import type { Message } from 'ai';
import { streamText } from 'ai';
import { getChatModel } from './provider';

export function createChatStream(messages: Message[]) {
  return streamText({
    model: getChatModel(),
    messages,
    temperature: 0.5
  });
}
