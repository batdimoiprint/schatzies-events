import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, MoreVertical, Send, X, Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  getConversationMessages,
  getMessageConversations,
  sendConversationMessage,
  type ChatMessage,
  type Conversation,
  type ConversationParticipant,
} from '@/api/messages';

/* ─── helpers ──────────────────────────────────────────────────────────── */

function normalizeRole(role?: string): string {
  return String(role || '')
    .trim()
    .toLowerCase();
}

/** Get the "other" participant — the client in the conversation. */
function getClientParticipant(
  conversation: Conversation | null,
  myUserId?: string
): ConversationParticipant | null {
  if (!conversation) return null;

  // Try the participants array first — find anyone who is NOT the organizer
  const client = conversation.participants?.find((p) => {
    const r = normalizeRole(p.role);
    if (r === 'client') return true;
    if (myUserId && p.id !== myUserId && r !== 'organizer') return true;
    return false;
  });

  return client ?? conversation.participants?.[0] ?? null;
}

function getInitialFromName(name?: string): string {
  const trimmed = String(name || '').trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
}

function isOutgoingMessage(msg: ChatMessage, userId?: string): boolean {
  const role = normalizeRole(msg.senderRole || msg.senderType);
  if (role === 'organizer') return true;
  if (userId && msg.senderId === userId) return true;
  return false;
}

function formatMessageTime(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// Deterministic avatar color palette
const AVATAR_COLORS = [
  'bg-[#db4b88]',
  'bg-[#4bc783]',
  'bg-[#5b54e3]',
  'bg-[#e3a854]',
  'bg-[#54b4e3]',
  'bg-[#e35454]',
  'bg-[#8854e3]',
  'bg-[#54e3a8]',
];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
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

export function OrganizerMessagePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  /* ── local state (UI only — no data fetching state) ─────────────────── */
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ── TanStack Query: fetch conversation list ────────────────────────── */
  // Polls every 10s to detect new conversations; pauses when tab is hidden.
  const {
    data: conversations = [],
    isLoading: isLoadingList,
    isError: isListError,
  } = useQuery<Conversation[]>({
    queryKey: ['conversations', user?.user_id],
    queryFn: getMessageConversations,
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  // Auto-select first conversation when list loads and nothing is selected
  useEffect(() => {
    if (!activeConvId && conversations.length > 0) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId]);

  /* ── TanStack Query: fetch messages for active conversation ─────────── */
  // Polls every 3s while the tab is focused; stops when no conversation is active.
  // refetchOnWindowFocus ensures an immediate refresh when the user returns to the tab.
  const {
    data: rawMessages = [],
    isLoading: isLoadingMessages,
    isError: isMsgError,
  } = useQuery<ChatMessage[]>({
    queryKey: ['messages', activeConvId, user?.user_id],
    queryFn: () => getConversationMessages(activeConvId!),
    enabled: !!activeConvId,
    refetchInterval: 3_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  // Deduplicate and sort messages to prevent duplicates from optimistic updates
  const messages = useMemo(() => dedupeAndSort(rawMessages), [rawMessages]);

  /* ── derived ────────────────────────────────────────────────────────── */
  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeConvId) ?? null,
    [conversations, activeConvId]
  );

  const activePeer = useMemo(
    () => getClientParticipant(activeConv, user?.user_id),
    [activeConv, user?.user_id]
  );

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => {
      const peer = getClientParticipant(c, user?.user_id);
      const name = (peer?.name || '').toLowerCase();
      const last = (c.lastMessage || '').toLowerCase();
      return name.includes(q) || last.includes(q);
    });
  }, [conversations, searchQuery, user?.user_id]);

  /* ── auto-scroll ────────────────────────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── send message with optimistic cache update ──────────────────────── */
  const handleSendMessage = async () => {
    const body = messageText.trim();
    if (!body || !activeConvId || isSending) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage: ChatMessage = {
      id: tempId,
      conversationId: activeConvId,
      body,
      senderRole: 'ORGANIZER',
      senderId: user?.user_id,
      createdAt: new Date().toISOString(),
    };

    setMessageText('');
    setIsSending(true);
    setSendError(null);

    // Optimistically add the temp message to the query cache
    const messagesKey = ['messages', activeConvId, user?.user_id];
    queryClient.setQueryData<ChatMessage[]>(messagesKey, (old = []) => [...old, tempMessage]);

    try {
      const saved = await sendConversationMessage(activeConvId, body);
      if (saved) {
        // Replace temp message with the real server response
        queryClient.setQueryData<ChatMessage[]>(messagesKey, (old = []) =>
          old.map((m) => (m.id === tempId ? saved : m))
        );
      }

      // Optimistically update "lastMessage" in the conversation list cache
      queryClient.setQueryData<Conversation[]>(['conversations', user?.user_id], (old = []) =>
        old.map((c) =>
          c.id === activeConvId
            ? { ...c, lastMessage: body, lastMessageAt: new Date().toISOString() }
            : c
        )
      );
    } catch {
      // Roll back the optimistic update
      queryClient.setQueryData<ChatMessage[]>(messagesKey, (old = []) =>
        old.filter((m) => m.id !== tempId)
      );
      setMessageText(body);
      setSendError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  /* ── select a conversation ──────────────────────────────────────────── */
  const handleSelectConversation = (convId: string) => {
    if (convId === activeConvId) return;
    setActiveConvId(convId);
    setSendError(null);
  };

  /* ─── render ─────────────────────────────────────────────────────────── */
  return (
    <div className="flex h-[calc(100vh-150px)] w-full gap-6 bg-transparent pb-4">
      {/* ─────────── LEFT SIDEBAR (INBOX LIST) ─────────── */}
      <div className="flex w-[340px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#e2deea] bg-white shadow-sm">
        <div className="border-b border-[#f0edf4] p-4">
          {/* Header — no manual refresh button */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#2d2834]">Message Inbox</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b2acbf]" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#ddd8e8] bg-[#f6f5f8] py-2.5 pl-10 pr-4 text-sm text-[#4f4a56] outline-none focus:border-[#df2b80]"
            />
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto">
          {isLoadingList ? (
            <div className="flex items-center justify-center gap-2 p-8">
              <Loader2 className="size-4 animate-spin text-[#df2b80]" />
              <span className="text-sm text-[#a49cb3]">Loading...</span>
            </div>
          ) : isListError ? (
            /* Error state — no retry button; TanStack Query will auto-retry */
            <div className="flex flex-col items-center gap-2 p-8 text-center">
              <p className="text-sm text-red-400">
                Unable to load conversations. Retrying automatically…
              </p>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const peer = getClientParticipant(conv, user?.user_id);
              const initial = peer?.initial || getInitialFromName(peer?.name);
              const color = getAvatarColor(conv.id);

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`flex cursor-pointer items-center gap-3 border-b border-[#f0edf4] p-4 transition-colors ${
                    activeConvId === conv.id
                      ? 'border-l-4 border-l-[#df2b80] bg-[#fafafa]'
                      : 'border-l-4 border-l-transparent hover:bg-[#fafafa]'
                  }`}
                >
                  <div
                    className={`relative flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${color}`}
                  >
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="truncate text-sm font-bold text-[#2d2834]">
                        {peer?.name || 'Client'}
                      </h4>
                      <span className="ml-2 whitespace-nowrap text-[10px] font-semibold text-[#a49cb3]">
                        {formatRelativeTime(conv.lastMessageAt || conv.updatedAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs font-medium text-[#696373]">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm font-medium text-[#a49cb3]">
              {conversations.length === 0 ? 'No conversations yet.' : 'No conversations found.'}
            </div>
          )}
        </div>
      </div>

      {/* ─────────── MIDDLE (CHAT AREA) ─────────── */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#e2deea] bg-white shadow-sm transition-all duration-300">
        {activeConv ? (
          <>
            {/* Chat Header — no manual refresh button */}
            <div className="flex items-center justify-between border-b border-[#f0edf4] px-6 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={`relative flex size-10 shrink-0 items-center justify-center rounded-full font-bold text-white ${getAvatarColor(activeConv.id)}`}
                >
                  {activePeer?.initial || getInitialFromName(activePeer?.name)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2d2834]">
                    {activePeer?.name || 'Client'}
                  </h3>
                  <p className="text-xs font-semibold capitalize text-[#4bc783]">
                    {normalizeRole(activePeer?.role) || 'client'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[#8f879f]">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className={`rounded-full p-2 transition ${showDetails ? 'text-[#df2b80]' : 'hover:bg-[#f6f5f8] hover:text-[#df2b80]'}`}
                >
                  <MoreVertical className="size-5" />
                </button>
              </div>
            </div>

            {/* Chat Bubbles */}
            <div className="flex-1 overflow-y-auto bg-[#fafafa] p-6">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center gap-2 py-12">
                  <Loader2 className="size-5 animate-spin text-[#df2b80]" />
                  <span className="text-sm text-[#a49cb3]">Loading messages...</span>
                </div>
              ) : isMsgError ? (
                /* Error state — no retry button; TanStack Query will auto-retry */
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <p className="text-sm text-red-400">
                    Unable to load messages. Retrying automatically…
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <MessageSquare className="size-8 text-[#d4d0dc]" />
                  <p className="text-sm font-medium text-[#a49cb3]">
                    No messages yet. Send one to start the conversation.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => {
                    const outgoing = isOutgoingMessage(msg, user?.user_id);
                    return (
                      <div
                        key={msg.id}
                        className={`flex w-full ${outgoing ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="flex max-w-[70%] flex-col gap-1">
                          <div
                            className={`rounded-2xl px-4 py-3 text-sm ${
                              outgoing
                                ? 'rounded-br-none bg-gradient-to-r from-[#df2b80] to-[#8f1fd1] text-white'
                                : 'rounded-bl-none border border-[#e2deea] bg-white text-[#4f4a56] shadow-sm'
                            }`}
                          >
                            {msg.body}
                          </div>
                          <span
                            className={`text-[10px] font-semibold text-[#a49cb3] ${
                              outgoing ? 'text-right' : 'text-left'
                            }`}
                          >
                            {formatMessageTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t border-[#f0edf4] bg-white p-4">
              {sendError && (
                <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-500">
                  {sendError}
                </p>
              )}
              <div className="flex items-center gap-3">
                <div className="flex flex-1 items-center rounded-full bg-[#f3f1f5] px-5 py-2.5">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void handleSendMessage();
                      }
                    }}
                    placeholder="Write something..."
                    className="flex-1 bg-transparent text-sm text-[#2d2834] outline-none placeholder:text-[#a49cb3]"
                  />
                  <button
                    onClick={() => void handleSendMessage()}
                    disabled={isSending || !messageText.trim()}
                    className="ml-2 flex items-center justify-center text-[#8f1fd1] transition-colors hover:text-[#7a18b3] disabled:opacity-40"
                  >
                    {isSending ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Send className="size-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No conversation selected placeholder */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <MessageSquare className="size-12 text-[#d4d0dc]" />
            <div>
              <p className="text-lg font-bold text-[#2d2834]">Your Messages</p>
              <p className="mt-1 text-sm text-[#a49cb3]">
                Select a conversation to start messaging.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─────────── RIGHT SIDE (CONTACT DETAILS) ─────────── */}
      {showDetails && activeConv && (
        <div className="animate-in slide-in-from-right-4 fade-in flex w-[320px] shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-2xl border border-[#e2deea] bg-white shadow-sm duration-300">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f0edf4] bg-white px-6 py-4">
            <h3 className="text-base font-bold text-[#2d2834]">Contact Details</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-[#8f879f] transition-colors hover:text-[#df2b80]"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
            <div
              className={`mb-4 flex size-24 items-center justify-center rounded-full text-4xl font-bold text-white shadow-md ${getAvatarColor(activeConv.id)}`}
            >
              {activePeer?.initial || getInitialFromName(activePeer?.name)}
            </div>
            <h4 className="text-lg font-bold leading-tight text-[#2d2834]">
              {activePeer?.name || 'Client'}
            </h4>
            <span className="mt-2 rounded-full bg-[#f8f5fe] px-4 py-1 text-xs font-bold uppercase tracking-wide text-[#8f1fd1]">
              {normalizeRole(activePeer?.role) || 'client'}
            </span>
          </div>

          {/* Information List */}
          <div className="flex flex-col gap-5 border-t border-[#f0edf4] p-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a49cb3]">
                Email Address
              </p>
              <p className="mt-1 break-all text-sm font-semibold text-[#2d2834]">
                {activePeer?.email || '-'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a49cb3]">
                Phone Number
              </p>
              <p className="mt-1 text-sm font-semibold text-[#2d2834]">
                {activePeer?.contactNumber || '-'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
