import type { Message } from 'ai';
import { streamText } from 'ai';
import { injectPersonality } from '@/lib/ai/middleware/personality';
import { getChatModel } from './provider';

export function createChatStream(messages: Message[], memoryContext?: string) {
  const enriched = injectPersonality(messages, memoryContext);

  console.info('[ai/stream] creating stream', {
    incomingCount: messages.length,
    outgoingCount: enriched.messages.length,
    hasMemoryContext: Boolean(memoryContext),
    memoryContextLength: memoryContext?.length ?? 0
  });

  const result = streamText({
    model: getChatModel(),
    messages: enriched.messages,
    temperature: 0.8,
    topP: 0.9
  });

  return { result, mood: enriched.mood };
}
