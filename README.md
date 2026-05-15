# AsianGPT SaaS Foundation

Now includes a production-grade **AI memory system** with Supabase + pgvector semantic retrieval.

## Install

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Database Memory Layer (Supabase)

Run migration:

```bash
supabase db push
```

Created schema in `supabase/migrations/20260515_memory_system.sql`:

- `users`
- `conversations`
- `messages`
- `memories`
- `embeddings` (pgvector)
- `user_preferences`
- `match_memories(...)` semantic retrieval function

## Memory Architecture

- `src/lib/embeddings/provider.ts`: embedding generation pipeline
- `src/lib/memory/repository.ts`: Supabase persistence + semantic RPC
- `src/lib/memory/scoring.ts`: memory ranking and context compression
- `src/lib/memory/extractor.ts`: memory candidate extraction (failures, habits, preferences, callbacks)
- `src/lib/memory/service.ts`: retrieve + persist orchestration
- `src/lib/ai/prompts/system-prompt.ts`: memory-aware prompt injection for continuity
- `src/app/api/chat/route.ts`: memory retrieval before streaming + memory persistence after response

## Behavioral Outcome

Asian GPT now references prior user goals/failures/jokes with comedic continuity while still giving useful answers.
