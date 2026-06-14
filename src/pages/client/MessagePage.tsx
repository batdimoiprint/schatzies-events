import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  getConversationMessages,
  getMessageConversations,
  sendConversationMessage,
  initiateConversation,
  type ChatMessage,
  type Conversation,
  type ConversationParticipant,
} from '@/api/messages';
import { getEventManagerEvents, getEventById, getEventUser } from '@/api/events';

/* ─── helpers ──────────────────────────────────────────────────────────── */

function normalizeRole(role?: string): string {
  return String(role || '')
    .trim()
    .toLowerCase();
}

function getOrganizerParticipant(
  conversation: Conversation | null
): ConversationParticipant | null {
  if (!conversation) return null;

  if (conversation.organizer) return conversation.organizer;

  const organizer = conversation.participants?.find((p) => normalizeRole(p.role) === 'organizer');
  return organizer ?? null;
}

function getInitialFromName(name?: string): string {
  const trimmed = String(name || '').trim();
  if (!trimmed) return 'O';
  return trimmed.charAt(0).toUpperCase();
}

function isOutgoingMessage(message: ChatMessage, userId?: string, clientId?: string): boolean {
  const role = normalizeRole(message.senderRole || message.senderType);
  if (role === 'client') return true;
  if (userId && message.senderId === userId) return true;
  if (clientId && message.senderId === clientId) return true;
  return false;
}

function formatMessageTime(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Deduplicate messages by ID and sort by createdAt ascending.
 * Prevents duplicate rendering when optimistic messages overlap with server data.
 */
function dedupeAndSort(msgs: ChatMessage[]): ChatMessage[] {
  const seen = new Map<string, ChatMessage>();
  for (const msg of msgs) {
    if (!seen.has(msg.id)) seen.set(msg.id, msg);
  }
  return [...seen.values()].sort(
    (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
  );
}

/* ─── component ────────────────────────────────────────────────────────── */

export function MessagePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ── TanStack Query: fetch conversation list ──────────────────────── */
  // Polls every 10s to detect new conversations; pauses when tab is hidden.
  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    isError: isConversationsError,
  } = useQuery<Conversation[]>({
    queryKey: ['conversations', user?.user_id],
    queryFn: getMessageConversations,
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  // Auto-select the first conversation that has an organizer participant
  const activeConversation = useMemo(
    () =>
      conversations.find((c) => getOrganizerParticipant(c) !== null) ?? conversations[0] ?? null,
    [conversations]
  );

  const activeConversationId = activeConversation?.id ?? null;

  /* ── TanStack Query: fetch messages for active conversation ───────── */
  // Polls every 3s while the tab is focused; stops when no conversation is active.
  // refetchOnWindowFocus ensures an immediate refresh when the user returns to the tab.
  const {
    data: rawMessages = [],
    isLoading: isLoadingMessages,
    isError: isMessagesError,
  } = useQuery<ChatMessage[]>({
    queryKey: ['messages', activeConversationId, user?.user_id],
    queryFn: () => getConversationMessages(activeConversationId!),
    enabled: !!activeConversationId,
    refetchInterval: 3_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  // Deduplicate and sort messages to prevent duplicates from optimistic updates
  const messages = useMemo(() => dedupeAndSort(rawMessages), [rawMessages]);

  /* ── TanStack Query: fetch assigned organizer if no conversation exists ── */
  const { data: fallbackOrganizer } = useQuery<ConversationParticipant | null>({
    queryKey: ['assigned-organizer', user?.user_id],
    queryFn: async () => {
      if (!user || user.role !== 'CLIENT') return null;
      try {
        const events = await getEventManagerEvents();
        const userFullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
        const userEvents = events.filter(
          (e) =>
            e.clientId === user.user_id ||
            e.clientId === user.client_id ||
            (e.client && e.client.toLowerCase().includes(userFullName))
        );

        if (userEvents.length === 0) return null;

        const fullEvent = await getEventById(userEvents[0].id);
        const fullEventRec = fullEvent as { organizer_id?: string; organizerId?: string };
        const firstEventRec = userEvents[0] as { organizer_id?: string };
        const orgId =
          fullEventRec.organizer_id ||
          fullEventRec.organizerId ||
          userEvents[0].organizerId ||
          firstEventRec.organizer_id;

        if (!orgId) return null;

        const org = await getEventUser(orgId);
        return {
          id: orgId,
          name:
            `${org.firstName || org.user?.firstName || ''} ${org.lastName || org.user?.lastName || ''}`.trim() ||
            'Organizer',
          email: org.email || org.user?.email || '-',
          contactNumber: org.contactNumber || org.user?.contactNumber || '-',
          role: 'organizer',
          initial: getInitialFromName(org.firstName || org.user?.firstName),
        };
      } catch (error) {
        console.error('Error fetching assigned organizer:', error);
        return null;
      }
    },
    enabled: !!user && !activeConversation, // Only fetch if we don't have an active conversation organizer yet
  });

  const organizer = useMemo(() => {
    const fromConversation = getOrganizerParticipant(activeConversation);
    if (fromConversation) return fromConversation;
    return fallbackOrganizer ?? null;
  }, [activeConversation, fallbackOrganizer]);

  const isLoading = isLoadingConversations || (!!activeConversationId && isLoadingMessages);
  const isError = isConversationsError || isMessagesError;

  /* ── auto-scroll to bottom on new messages ────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── send message with optimistic cache update ────────────────────── */
  const handleSendMessage = async () => {
    const body = input.trim();
    if (!body || isSending) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage: ChatMessage = {
      id: tempId,
      conversationId: activeConversation?.id ?? '',
      body,
      senderRole: 'CLIENT',
      senderId: user?.user_id || user?.client_id,
      createdAt: new Date().toISOString(),
    };

    setInput('');
    setIsSending(true);
    setSendError(null);

    // Optimistically add the temp message to the query cache
    const messagesKey = ['messages', activeConversationId, user?.user_id];
    queryClient.setQueryData<ChatMessage[]>(messagesKey, (old = []) => [...old, tempMessage]);

    try {
      if (activeConversation) {
        // Existing conversation → send to it
        const saved = await sendConversationMessage(activeConversation.id, body);
        if (saved) {
          // Replace temp message with the real server response
          queryClient.setQueryData<ChatMessage[]>(messagesKey, (old = []) =>
            old.map((m) => (m.id === tempId ? saved : m))
          );
        }
      } else {
        // No conversation yet → initiate one (auto-routes to assigned organizer)
        const result = await initiateConversation(body);
        // Invalidate conversations so the new one is picked up
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        // Seed the message cache for the new conversation
        queryClient.setQueryData(
          ['messages', result.conversation.id, user?.user_id],
          [result.message]
        );
      }
    } catch {
      // Roll back the optimistic update
      queryClient.setQueryData<ChatMessage[]>(messagesKey, (old = []) =>
        old.filter((m) => m.id !== tempId)
      );
      setInput(body);
      setSendError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  /* ─── render ─────────────────────────────────────────────────────────── */
  return (
    <div className="flex h-[calc(100vh-140px)] flex-col overflow-hidden lg:h-[calc(100vh-160px)]">
      {/* ── Two-column grid ────────────────────────────────────────────── */}
      <div className="mt-4 grid min-h-0 flex-1 gap-6 pb-4 lg:mt-6 lg:grid-cols-3">
        {/* ── Left: Chat Window (col-span-2) ───────────────────────────── */}
        <div className="flex min-h-0 flex-col rounded-xl bg-white shadow-md lg:col-span-2">
          {/* Chat Header — no manual refresh button */}
          <div className="flex shrink-0 items-center justify-between rounded-t-xl bg-pink-400 px-4 py-3 sm:p-4">
            <div>
              <p className="text-xl font-bold text-white">{organizer?.name || ''}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-sm text-white">Active</span>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-pink-400" />
                <span className="ml-2 text-sm font-medium text-gray-500">Loading messages...</span>
              </div>
            ) : isError ? (
              /* Error state — no retry button; TanStack Query will auto-retry */
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <p className="text-sm font-medium text-red-500">
                  Unable to load messages right now. Retrying automatically…
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <MessageSquare className="size-10 text-pink-300" />
                <p className="text-sm font-medium text-gray-500">
                  No messages yet. Start your conversation below!
                </p>
              </div>
            ) : (
              messages.map((msg) =>
                isOutgoingMessage(msg, user?.user_id, user?.client_id) ? (
                  /* Outgoing */
                  <div key={msg.id} className="flex items-end justify-end gap-3">
                    <div className="flex flex-col items-end gap-1">
                      <div className="max-w-xs rounded-2xl rounded-br-sm bg-gradient-to-r from-pink-400 to-purple-500 px-4 py-3 text-sm text-white shadow-sm">
                        {msg.body}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                      {user?.firstName?.charAt(0)?.toUpperCase() || 'Y'}
                    </div>
                  </div>
                ) : (
                  /* Incoming */
                  <div key={msg.id} className="flex items-end gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-400 text-sm font-bold text-white">
                      {organizer?.initial || getInitialFromName(organizer?.name)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="max-w-xs rounded-2xl rounded-bl-sm border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm">
                        {msg.body}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                )
              )
            )}
            <div ref={bottomRef} />
          </div>

          {/* Chat Input */}
          <div className="shrink-0 border-t border-gray-100 p-4">
            {sendError && (
              <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-500">
                {sendError}
              </p>
            )}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void handleSendMessage();
                  }
                }}
                placeholder="Type your message here..."
                className="w-full rounded-full bg-gray-100 px-6 py-3 text-sm text-gray-700 shadow-inner outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300"
              />
              <button
                aria-label="Send"
                onClick={() => void handleSendMessage()}
                disabled={isSending || !input.trim()}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow transition hover:brightness-110 disabled:opacity-40"
              >
                {isSending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Profile Card (col-span-1) ─────────────────────────── */}
        <div className="hidden min-h-0 flex-col items-center overflow-y-auto rounded-xl bg-white p-6 shadow-md lg:col-span-1 lg:flex xl:p-8">
          {/* Avatar */}
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-pink-400 text-5xl font-bold text-white shadow-lg">
            {organizer?.initial || getInitialFromName(organizer?.name)}
          </div>

          {/* Name + badge */}
          <p className="mt-4 text-2xl font-bold text-foreground">{organizer?.name || ''}</p>
          <span className="mt-2 rounded-full bg-pink-400 px-4 py-1 text-sm text-white">
            Assigned Organizer
          </span>

          {/* Inquiry Information */}
          <div className="mt-8 w-full">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              Inquiry Information
            </p>
            <div className="mb-4 border-b border-gray-200" />

            {/* Email */}
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-500 text-white">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">EMAIL</p>
                <p className="text-sm text-gray-700">{organizer?.email || '-'}</p>
              </div>
            </div>

            {/* Contact Number */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-500 text-white">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">CONTACT NUMBER</p>
                <p className="text-sm text-gray-700">{organizer?.contactNumber || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
