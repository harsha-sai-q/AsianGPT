import { createOpenAI } from '@ai-sdk/openai';
import { env } from '@/lib/env';

const sarvam = createOpenAI({
  baseURL: env.SARVAM_BASE_URL,
  apiKey: env.SARVAM_API_KEY
});

export function getChatModel() {
  return sarvam(env.SARVAM_MODEL);
}
