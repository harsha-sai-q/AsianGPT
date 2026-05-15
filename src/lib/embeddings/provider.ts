import { embed } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { env } from '@/lib/env';

const provider = createOpenAI({
  baseURL: env.SARVAM_BASE_URL,
  apiKey: env.SARVAM_API_KEY
});

export async function createEmbedding(input: string) {
  const { embedding } = await embed({
    model: provider.textEmbeddingModel('text-embedding-3-small'),
    value: input.slice(0, 4000)
  });
  return embedding;
}
