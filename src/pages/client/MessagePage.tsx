import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Send, Mail, Phone, MessageSquare, RefreshCw, Loader2 } from 'lucide-react';
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

/* ─── helpers ──────────────────────────────────────────────────────────── */

function normalizeRole(role?: string): string {
  return String(role || '').trim().toLowerCase();
}

function getOrganizerParticipant(conversation: Conversation | null): ConversationParticipant | null {
  if (!conversation) return null;

  if (conversation.organizer) return conversation.organizer;

  const organizer = conversation.participants?.find(
    (p) => normalizeRole(p.role) === 'organizer'
  );
  return organizer ?? null;
}

function getInitialFromName(name?: string): string {
  const trimmed = String(name || '').trim();
  if (!trimmed) return 'O';
  return trimmed.charAt(0).toUpperCase();
}

function isOutgoingMessage(
  message: ChatMessage,
  userId?: string,
  clientId?: string
): boolean {
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

const POLL_INTERVAL = 8_000; // 8 seconds

/* ─── component ────────────────────────────────────────────────────────── */

export function MessagePage() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const organizer = useMemo(
    () => getOrganizerParticipant(activeConversation),
    [activeConversation]
  );

  /* ── scroll to bottom on new messages ─────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── load conversation ────────────────────────────────────────────── */
  const loadConversation = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const conversations = await getMessageConversations();
      const selected =
        conversations.find((c) => getOrganizerParticipant(c) !== null) ??
        conversations[0] ??
        null;

      setActiveConversation(selected);

      if (!selected) {
        setMessages([]);
        return;
      }

      const msgs = await getConversationMessages(selected.id);
      setMessages(msgs);
    } catch {
      setLoadError('Unable to load messages right now. Please try again.');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ── poll for new messages ────────────────────────────────────────── */
  const pollMessages = useCallback(async () => {
    if (!activeConversation) return;
    try {
      const msgs = await getConversationMessages(activeConversation.id);
      setMessages(msgs);
    } catch {
      /* silently ignore poll failures */
    }
  }, [activeConversation]);

  useEffect(() => {
    void loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    if (!activeConversation) return;
    pollRef.current = setInterval(() => void pollMessages(), POLL_INTERVAL);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeConversation, pollMessages]);

  /* ── send message ─────────────────────────────────────────────────── */
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
    setMessages((prev) => [...prev, tempMessage]);

    try {
      if (activeConversation) {
        // Existing conversation → send to it
        const saved = await sendConversationMessage(activeConversation.id, body);
        if (saved) {
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? saved : m))
          );
        }
      } else {
        // No conversation yet → initiate one (auto-routes to assigned organizer)
        const result = await initiateConversation(body);
        setActiveConversation(result.conversation);
        setMessages([result.message]);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(body);
      setSendError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  /* ─── render ─────────────────────────────────────────────────────────── */
  return (
    <div className="flex h-full flex-col">
      {/* ── Two-column grid ────────────────────────────────────────────── */}
      <div className="mt-6 grid min-h-0 flex-1 gap-6 lg:grid-cols-3">
        {/* ── Left: Chat Window (col-span-2) ───────────────────────────── */}
        <div className="flex min-h-0 flex-col rounded-xl bg-white shadow-md lg:col-span-2">
          {/* Chat Header */}
          <div className="flex shrink-0 items-center justify-between rounded-t-xl bg-pink-400 px-4 py-3 sm:p-4">
            <div>
              <p className="text-xl font-bold text-white">
                {organizer?.name || 'Your Organizer'}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-sm text-white">Active</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void pollMessages()}
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              title="Refresh messages"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-pink-400" />
                <span className="ml-2 text-sm font-medium text-gray-500">
                  Loading messages...
                </span>
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <p className="text-sm font-medium text-red-500">{loadError}</p>
                <button
                  type="button"
                  onClick={() => void loadConversation()}
                  className="rounded-lg bg-pink-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-pink-600"
                >
                  Retry
                </button>
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
          <p className="mt-4 text-2xl font-bold text-[#2d2834]">
            {organizer?.name || 'Organizer'}
          </p>
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
