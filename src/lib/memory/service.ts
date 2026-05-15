import type { Message } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { createEmbedding } from '@/lib/embeddings/provider';
import { compressMemoryContext } from './scoring';
import { extractMemoryCandidates } from './extractor';
import { insertEmbedding, insertMemory, semanticSearchMemories } from './repository';

const EMBEDDING_MODEL = 'text-embedding-3-small';

export async function retrieveMemoryContext(userId: string, query: string) {
  const supabase = await createClient();
  const queryEmbedding = await createEmbedding(query);
  const memories = await semanticSearchMemories(supabase, userId, queryEmbedding, 10);
  return compressMemoryContext(memories, 6);
}

export async function persistMemoriesFromMessages(userId: string, conversationId: string, messages: Message[]) {
  const supabase = await createClient();
  const candidates = extractMemoryCandidates(messages);

  for (const candidate of candidates) {
    const memory = await insertMemory(supabase, {
      userId,
      conversationId,
      memoryType: candidate.type,
      content: candidate.content,
      importance: candidate.importance,
      emotionalWeight: candidate.emotionalWeight
    });

    const vector = await createEmbedding(candidate.content);
    await insertEmbedding(supabase, memory.id, EMBEDDING_MODEL, vector);
  }
}
