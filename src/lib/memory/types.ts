export type MemoryType = 'fact' | 'preference' | 'failure' | 'joke' | 'goal' | 'callback' | 'summary';

export type MemoryRecord = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  memory_type: MemoryType;
  content: string;
  importance: number;
  emotional_weight: number;
  similarity?: number;
};
