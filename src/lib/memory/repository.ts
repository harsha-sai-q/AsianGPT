import type { SupabaseClient } from '@supabase/supabase-js';
import type { MemoryRecord, MemoryType } from './types';

type AddMemoryInput = {
  userId: string;
  conversationId?: string;
  memoryType: MemoryType;
  content: string;
  importance?: number;
  emotionalWeight?: number;
};

export async function insertMemory(supabase: SupabaseClient, input: AddMemoryInput) {
  const { data, error } = await supabase
    .from('memories')
    .insert({
      user_id: input.userId,
      conversation_id: input.conversationId ?? null,
      memory_type: input.memoryType,
      content: input.content,
      importance: input.importance ?? 3,
      emotional_weight: input.emotionalWeight ?? 3
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as MemoryRecord;
}

export async function insertEmbedding(supabase: SupabaseClient, memoryId: string, model: string, embedding: number[]) {
  const { error } = await supabase.from('embeddings').insert({
    memory_id: memoryId,
    model,
    embedding
  });
  if (error) throw error;
}

export async function semanticSearchMemories(supabase: SupabaseClient, userId: string, embedding: number[], limit = 8) {
  const { data, error } = await supabase.rpc('match_memories', {
    query_embedding: embedding,
    match_user_id: userId,
    match_count: limit
  });
  if (error) throw error;
  return (data ?? []) as MemoryRecord[];
}
