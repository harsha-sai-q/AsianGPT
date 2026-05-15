import { createOpenAI } from '@ai-sdk/openai';
import { env } from '@/lib/env';

function normalizeSarvamBaseUrl(baseUrl: string) {
  const trimmed = baseUrl.replace(/\/$/, '');
  return trimmed.endsWith('/v1') ? trimmed : `${trimmed}/v1`;
}

const sarvamBaseUrl = normalizeSarvamBaseUrl(env.SARVAM_BASE_URL);

const sarvam = createOpenAI({
  baseURL: sarvamBaseUrl,
  apiKey: env.SARVAM_API_KEY,
  compatibility: 'compatible'
});

export function getChatModel() {
  return sarvam(env.SARVAM_MODEL);
}

export function getSarvamDiagnostics() {
  return {
    baseUrl: sarvamBaseUrl,
    model: env.SARVAM_MODEL,
    hasApiKey: Boolean(env.SARVAM_API_KEY)
  };
}
