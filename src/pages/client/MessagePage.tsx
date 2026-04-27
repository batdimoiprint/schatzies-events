import { useEffect, useMemo, useState } from 'react';
import { Send, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  getConversationMessages,
  getMessageConversations,
  sendConversationMessage,
  type ChatMessage,
  type Conversation,
  type ConversationParticipant,
} from '@/api/messages';

function normalizeRole(role?: string): string {
  return String(role || '').trim().toLowerCase();
}

function getOrganizerParticipant(conversation: Conversation | null): ConversationParticipant | null {
  if (!conversation) return null;

  if (conversation.organizer) {
    return conversation.organizer;
  }

  const organizer = conversation.participants?.find(
    (participant) => normalizeRole(participant.role) === 'organizer'
  );

  return organizer ?? null;
}

function getInitialFromName(name?: string): string {
  const trimmed = String(name || '').trim();
  if (!trimmed) return 'O';

  return trimmed.charAt(0).toUpperCase();
}

function isOutgoingMessage(message: ChatMessage, userId?: string, clientId?: string): boolean {
  const senderType = normalizeRole(message.senderType);
  if (senderType === 'client') return true;
  if (userId && message.senderId === userId) return true;
  if (clientId && message.senderId === clientId) return true;

  return false;
}

export function MessagePage() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const organizer = useMemo(
    () => getOrganizerParticipant(activeConversation),
    [activeConversation]
  );

  const loadConversation = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const conversations = await getMessageConversations();
      const selectedConversation =
        conversations.find((conversation) => getOrganizerParticipant(conversation) !== null) ??
        conversations[0] ??
        null;

      setActiveConversation(selectedConversation);

      if (!selectedConversation) {
        setMessages([]);
        return;
      }

      const conversationMessages = await getConversationMessages(selectedConversation.id);
      setMessages(conversationMessages);
    } catch {
      setLoadError('Unable to load messages right now. Please try again.');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadConversation();
  }, []);

  const handleSendMessage = async () => {
    const body = input.trim();
    if (!body || !activeConversation || isSending) return;

    const temporaryMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversation.id,
      body,
      senderType: 'client',
      senderId: user?.id || user?.client_id,
      createdAt: new Date().toISOString(),
    };

    setInput('');
    setIsSending(true);
    setSendError(null);
    setMessages((prev) => [...prev, temporaryMessage]);

    try {
      const savedMessage = await sendConversationMessage(activeConversation.id, body);

      if (savedMessage) {
        setMessages((prev) =>
          prev.map((message) => (message.id === temporaryMessage.id ? savedMessage : message))
        );
      }
    } catch {
      setMessages((prev) => prev.filter((message) => message.id !== temporaryMessage.id));
      setInput(body);
      setSendError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────── */}

      {/* ── Two-column grid ────────────────────────────────────────────────── */}
      <div className="mt-6 grid min-h-0 flex-1 gap-6 lg:grid-cols-3">
        {/* ── Left: Chat Window (col-span-2) ─────────────────────────────── */}
        <div className="flex min-h-0 flex-col rounded-xl bg-white shadow-md lg:col-span-2">
          {/* Chat Header */}
          <div className="shrink-0 rounded-t-xl bg-pink-400 px-4 py-3 sm:p-4">
            <p className="text-xl font-bold text-white">{organizer?.name || 'Assigned Organizer'}</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm text-white">Active</span>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
            {isLoading ? (
              <p className="text-sm font-medium text-gray-500">Loading messages...</p>
            ) : loadError ? (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm font-medium text-red-500">{loadError}</p>
                <button
                  type="button"
                  onClick={() => void loadConversation()}
                  className="rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-pink-600"
                >
                  Retry
                </button>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-sm font-medium text-gray-500">
                No messages yet. Start your conversation with your organizer.
              </p>
            ) : (
              messages.map((msg) =>
                isOutgoingMessage(msg, user?.id, user?.client_id) ? (
                  /* Outgoing */
                  <div key={msg.id} className="flex items-end justify-end gap-3">
                    <div className="max-w-xs rounded-2xl bg-gray-100 p-4 text-sm text-gray-800">
                      {msg.body}
                    </div>
                    <img
                      src="/Pictures/organizerpics/Profile Picture.png"
                      alt="You"
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  </div>
                ) : (
                /* Incoming */
                <div key={msg.id} className="flex items-end gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-400 text-sm font-bold text-white">
                    {organizer?.initial || getInitialFromName(organizer?.name)}
                  </div>
                  <div className="max-w-xs rounded-2xl bg-gray-100 p-4 text-sm text-gray-800">
                    {msg.body}
                  </div>
                </div>
              )
              )
            )}
          </div>

          {/* Chat Input */}
          <div className="flex shrink-0 items-center gap-4 p-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="w-full rounded-full bg-gray-100 px-6 py-3 text-sm text-gray-700 shadow-inner outline-none placeholder:text-gray-400"
            />
            <button
              aria-label="Send"
              onClick={() => void handleSendMessage()}
              disabled={!activeConversation || isSending || !input.trim()}
              className="shrink-0 text-purple-700 transition hover:text-purple-900"
            >
              <Send className="size-6" />
            </button>
          </div>
          {sendError ? <p className="px-4 pb-3 text-xs font-medium text-red-500">{sendError}</p> : null}
        </div>

        {/* ── Right: Profile Card (col-span-1) ───────────────────────────── */}
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
