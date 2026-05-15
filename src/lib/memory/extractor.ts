import type { Message } from 'ai';
import type { MemoryType } from './types';

export function extractMemoryCandidates(messages: Message[]) {
  const last = [...messages].reverse().find((m) => m.role === 'user');
  const text = String(last?.content ?? '').trim();
  if (!text) return [] as Array<{ content: string; type: MemoryType; importance: number; emotionalWeight: number }>;

  const list: Array<{ content: string; type: MemoryType; importance: number; emotionalWeight: number }> = [];

  if (/(i like|i prefer|my favorite|usually)/i.test(text)) {
    list.push({ content: `User preference: ${text}`, type: 'preference', importance: 4, emotionalWeight: 2 });
  }
  if (/(failed|stuck|not working|again failed)/i.test(text)) {
    list.push({ content: `User recurring struggle: ${text}`, type: 'failure', importance: 5, emotionalWeight: 4 });
  }
  if (/(next week|tomorrow|i will|plan to)/i.test(text)) {
    list.push({ content: `User commitment: ${text}`, type: 'callback', importance: 4, emotionalWeight: 3 });
  }
  if (list.length === 0) {
    list.push({ content: `General user fact: ${text}`, type: 'fact', importance: 2, emotionalWeight: 2 });
  }

  return list;
}
