import axiosInstance from './axios-instance';

export interface ConversationParticipant {
  id: string;
  name?: string;
  email?: string;
  contactNumber?: string;
  role?: string;
  initial?: string;
  profilePic?: string;
}

export interface Conversation {
  id: string;
  eventId?: string;
  participants?: ConversationParticipant[];
  organizer?: ConversationParticipant;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  body: string;
  senderId?: string;
  senderRole?: string;
  receiverId?: string;
  /** @deprecated Use senderRole instead */
  senderType?: string;
  createdAt?: string;
  /** Alias — same as `id`, included for stable polling contract */
  messageId?: string;
  /** Alias — same as `body`, included for stable polling contract */
  content?: string;
}

/**
 * Fetch all conversations for the authenticated user.
 */
export async function getMessageConversations(): Promise<Conversation[]> {
  const { data } = await axiosInstance.get<{ conversations: Conversation[] } | Conversation[]>(
    '/messages/conversations'
  );

  if (Array.isArray(data)) return data;
  return data.conversations ?? [];
}

/**
 * Fetch all messages for a specific conversation.
 */
export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data } = await axiosInstance.get<{ messages: ChatMessage[] } | ChatMessage[]>(
    `/messages/conversations/${encodeURIComponent(conversationId)}/messages`
  );

  if (Array.isArray(data)) return data;
  return data.messages ?? [];
}

/**
 * Send a new message in an existing conversation.
 */
export async function sendConversationMessage(
  conversationId: string,
  body: string
): Promise<ChatMessage> {
  const { data } = await axiosInstance.post<{ message: ChatMessage } | ChatMessage>(
    `/messages/conversations/${encodeURIComponent(conversationId)}/messages`,
    { body }
  );

  if ('message' in data && typeof data.message === 'object') return data.message;
  return data as ChatMessage;
}

/**
 * Client-only: auto-routes a message to the assigned organizer.
 * Creates a conversation if one doesn't exist. The client does NOT
 * choose the organizer — the system resolves it from admin-assigned appointments.
 */
export async function initiateConversation(
  body: string
): Promise<{ conversation: Conversation; message: ChatMessage }> {
  const { data } = await axiosInstance.post<{
    conversation: Conversation;
    message: ChatMessage;
  }>('/messages/send', { body });

  return data;
}

/**
 * Admin-only: Delete a conversation and all its messages.
 */
export async function deleteConversation(
  conversationId: string
): Promise<{ success: boolean; deleted: number }> {
  const { data } = await axiosInstance.delete<{ success: boolean; deleted: number }>(
    `/messages/conversations/${encodeURIComponent(conversationId)}`
  );
  return data;
}
