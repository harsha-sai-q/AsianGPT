import type { Message } from 'ai';
import type { Conversation } from '@/types/chat';

const memoryStore = new Map<string, Conversation>();

export function listConversations() {
  return Array.from(memoryStore.values()).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getConversation(id: string) {
  return memoryStore.get(id) ?? null;
}

export function saveConversation(id: string, messages: Message[]) {
  const current = memoryStore.get(id);
  const now = new Date().toISOString();
  const title = messages[0]?.content?.slice(0, 42) || 'New conversation';
  const conversation: Conversation = {
    id,
    title,
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
    messages
  };
  memoryStore.set(id, conversation);
  return conversation;
}
