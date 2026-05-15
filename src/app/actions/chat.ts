'use server';

import { revalidatePath } from 'next/cache';
import { getConversation, listConversations, saveConversation } from '@/lib/chat/storage';

export async function getConversationsAction() {
  return listConversations();
}

export async function getConversationAction(id: string) {
  return getConversation(id);
}

export async function updateMessageAction(conversationId: string, messageId: string, content: string) {
  const conversation = getConversation(conversationId);
  if (!conversation) return null;

  const messages = conversation.messages.map((m) => (m.id === messageId ? { ...m, content } : m));
  const updated = saveConversation(conversationId, messages);
  revalidatePath('/chat');
  return updated;
}
