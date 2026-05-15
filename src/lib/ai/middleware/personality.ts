import type { Message } from 'ai';
import { deriveMoodState } from '@/lib/personality/mood-engine';
import { buildSystemPrompt } from '@/lib/ai/prompts/system-prompt';

export function injectPersonality(messages: Message[]) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const userMessage = String(lastUser?.content ?? '');
  const mood = deriveMoodState(messages, userMessage);

  const withSystem: Message[] = [
    { id: 'asian-gpt-system', role: 'system', content: buildSystemPrompt(mood) } as Message,
    ...messages
  ];

  return { messages: withSystem, mood };
}
