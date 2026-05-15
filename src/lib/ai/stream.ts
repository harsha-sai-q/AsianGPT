import type { Message } from 'ai';
import { streamText } from 'ai';
import { injectPersonality } from '@/lib/ai/middleware/personality';
import { getChatModel } from './provider';

export function createChatStream(messages: Message[]) {
  const enriched = injectPersonality(messages);

  const result = streamText({
    model: getChatModel(),
    messages: enriched.messages,
    temperature: 0.8,
    topP: 0.9
  });

  return { result, mood: enriched.mood };
}
