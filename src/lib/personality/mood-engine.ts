import type { Message } from 'ai';
import type { MoodState, PersonalityContext, RoastIntensity } from '@/types/personality';
import { reactionTags } from './templates';

const clampIntensity = (n: number): RoastIntensity => Math.max(1, Math.min(5, n)) as RoastIntensity;

export function detectSentiment(text: string): PersonalityContext['userSentiment'] {
  const t = text.toLowerCase();
  if (/(failed|lost|sad|stressed|panic|depressed|anxious)/.test(t)) return 'negative';
  if (/(great|awesome|won|passed|happy)/.test(t)) return 'positive';
  return 'neutral';
}

export function deriveMoodState(messages: Message[], userMessage: string): MoodState {
  const sentiment = detectSentiment(userMessage);
  const failures = messages.filter((m) => m.role === 'user' && /(failed|not working|error|stuck)/i.test(String(m.content))).length;
  let base = 2 + Math.floor(messages.length / 8) + failures;
  if (sentiment === 'negative') base -= 1;
  const intensity = clampIntensity(base);

  const mood = sentiment === 'negative' ? 'supportive-after-roast' : intensity >= 4 ? 'chaotic' : intensity >= 3 ? 'dramatic' : 'disappointed';
  const reactionTag = reactionTags[Math.floor(Math.random() * reactionTags.length)] ?? 'dramatic sigh';

  return { mood, intensity, reactionTag };
}
