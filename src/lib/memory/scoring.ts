import type { MemoryRecord } from './types';

export function rankMemories(memories: MemoryRecord[]) {
  return [...memories].sort((a, b) => score(b) - score(a));
}

function score(memory: MemoryRecord) {
  const similarity = memory.similarity ?? 0;
  const importance = memory.importance / 5;
  const emotional = memory.emotional_weight / 5;
  const callbackBoost = memory.memory_type === 'callback' ? 0.15 : 0;
  const failureBoost = memory.memory_type === 'failure' ? 0.08 : 0;

  return similarity * 0.62 + importance * 0.22 + emotional * 0.16 + callbackBoost + failureBoost;
}

export function compressMemoryContext(memories: MemoryRecord[], maxItems = 6) {
  return rankMemories(memories)
    .slice(0, maxItems)
    .map((m, idx) => `${idx + 1}. [${m.memory_type}] ${m.content}`)
    .join('\n');
}
