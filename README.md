# AsianGPT SaaS Foundation

A production-oriented Next.js 15 AI chat app with streaming responses, personality-driven prompting, and a Supabase + pgvector memory layer for long-term conversation context.

---

## Project Overview

**Asian GPT** is a stylized AI chat experience designed to combine:

- Fast streaming chat UX.
- A theatrical “auntie disappointment” personality system.
- Lightweight viral mechanics (“Sharma Ji score”, “Emotional Damage” vibes).
- Persistent semantic memory using Supabase and vector search.

At runtime, the app enriches user prompts with personality + relevant memory context, streams the model response, then extracts and stores new memory candidates for future chats.

---

## Features

- **AI Chat** via `/api/chat` with the AI SDK.
- **Streaming responses** (Edge runtime + `streamText()` data stream).
- **Personality modes** driven by mood/intensity engine and prompt templates.
- **Extreme Damage Mode** style roast intensity labels (1–5) and mood headers.
- **Memory system**:
  - candidate extraction from messages,
  - embedding generation,
  - semantic retrieval (`match_memories`) with pgvector,
  - context compression before prompt injection.
- **Supabase integration** for auth-ready SSR clients and memory persistence.
- **Responsive UI** with Tailwind, framer-motion, markdown rendering, and mobile-friendly chat layout.
- **Viral UI modules** (disappointment meter, leaderboard, mood indicator, share roast flow).
- **Server Actions** for conversation retrieval/editing.

---

## Tech Stack

### Application
- **Next.js 15** (App Router)
- **React 19 RC**
- **TypeScript**
- **Vercel AI SDK** (`ai`) + OpenAI-compatible provider adapter (`@ai-sdk/openai`)

### Data / Infra
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`)
- **Postgres + pgvector**
- **Vercel** deployment target

### UI / DX
- **Tailwind CSS** + `tailwindcss-animate`
- **Radix UI** primitives
- **framer-motion**
- **react-markdown + rehype-highlight + highlight.js**
- **zustand** (UI store)
- **zod** (env validation)
- **sonner** (toasts)

---

## Project Structure

```text
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts              # Streaming chat endpoint (Edge)
│   │   │   └── health/route.ts            # Health check endpoint
│   │   ├── actions/chat.ts                # Server actions for conversations
│   │   ├── auth/sign-in|sign-up           # Auth page scaffolds
│   │   ├── chat/page.tsx                  # Main chat page
│   │   └── dashboard/                     # Dashboard layout/pages
│   ├── components/
│   │   ├── chat/                          # Chat shell/input/message/sidebar
│   │   ├── layout/                        # Navbar + sidebar
│   │   ├── providers/                     # Theme + toast providers
│   │   ├── ui/                            # Reusable primitives (button)
│   │   └── viral/                         # Mood/disappointment/leaderboard widgets
│   ├── lib/
│   │   ├── ai/                            # Model provider, stream, prompt middleware
│   │   ├── chat/storage.ts                # In-memory conversation store
│   │   ├── embeddings/provider.ts         # Embedding generation
│   │   ├── env/index.ts                   # Strict env schema validation
│   │   ├── memory/                        # Extract/repo/scoring/service/types
│   │   ├── personality/                   # Mood engine + templates + config
│   │   ├── supabase/                      # Browser/server Supabase clients
│   │   └── viral/                         # Viral stats engine
│   ├── store/ui-store.ts                  # Zustand UI state
│   ├── styles/globals.css
│   └── types/
├── supabase/
│   └── migrations/20260515_memory_system.sql
└── README.md
```

---

## Local Development Setup

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd AsianGPT
npm install
# or pnpm install / yarn install
```

### 2) Configure environment variables

Create `.env.local` in project root:

```bash
cp .env.local.example .env.local  # if you create an example file
# OR manually create .env.local
```

Use the env template in the **Environment Variables** section below.

### 3) Start development server

```bash
npm run dev
```

Open: `http://localhost:3000`

### 4) Optional quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

---

## Environment Variables

This project validates env vars using Zod at startup. Missing/invalid values will fail fast.

### `.env.local` example

```bash
# Public (safe for browser)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Server-only (NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SARVAM_API_KEY=YOUR_SARVAM_API_KEY

# Server/runtime config
SARVAM_BASE_URL=https://api.sarvam.ai/v1
SARVAM_MODEL=gpt-4o-mini
```

### Public vs server-only

- **Public** (`NEXT_PUBLIC_*`): available in browser bundles.
- **Server-only**: only available to Node/Edge server runtime. Do not leak in client code, logs, or browser responses.

### Where to get them

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`:
  - Supabase Dashboard → Project Settings → API.
- `SARVAM_API_KEY`, base URL/model:
  - Sarvam provider dashboard/docs for your organization account.

---

## Supabase Setup

### 1) Create Supabase project

1. Go to Supabase dashboard.
2. Create a new project.
3. Save **Project URL**, **Anon key**, **Service Role key**.

### 2) Enable authentication

1. Supabase Dashboard → **Authentication** → **Providers**.
2. Enable your desired providers (email/password first).
3. Configure redirect URLs for local + production domains.

> Note: current auth pages are UI scaffolds; backend auth wiring should be completed before production launch.

### 3) Enable pgvector extension

The migration includes:

```sql
create extension if not exists vector;
```

No extra step needed if migration succeeds.

### 4) Run schema migration

Using Supabase CLI:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

This creates users, conversations, messages, memories, embeddings, preferences, indexes, and `match_memories` RPC.

### 5) Configure RLS (required for production)

The migration currently defines schema and function, but does **not** include explicit RLS policies. For production:

1. Enable RLS on user data tables.
2. Add strict `auth.uid() = user_id` policies for read/write.
3. Restrict service-role operations to trusted server paths only.

Suggested rollout:

- Start with `users`, `conversations`, `messages`, `memories`, `user_preferences`.
- Keep `embeddings` writable only through secure backend flow.

---

## Database Connection

The app uses two Supabase client modes:

- **Browser client** (`src/lib/supabase/client.ts`): anon key + URL for client-safe operations.
- **Server SSR client** (`src/lib/supabase/server.ts`): cookie-aware client for server routes/actions.

Memory pipeline operations instantiate the server client and call table inserts / RPC search.

---

## Database Schema

Current schema lives in `supabase/migrations/20260515_memory_system.sql`.

### Core tables

- `users` – canonical user row (UUID, email, display name).
- `conversations` – conversation metadata per user.
- `messages` – user/assistant/system messages under a conversation.
- `memories` – extracted long-term memory items with type + weights.
- `embeddings` – vector embeddings (1536 dims) per memory.
- `user_preferences` – normalized key/value preferences inferred from memories.

### Relationships

- `conversations.user_id -> users.id`
- `messages.conversation_id -> conversations.id`
- `messages.user_id -> users.id`
- `memories.user_id -> users.id`
- `memories.conversation_id -> conversations.id` (nullable, set null on delete)
- `embeddings.memory_id -> memories.id`
- `user_preferences.user_id -> users.id`
- `user_preferences.source_memory_id -> memories.id` (nullable)

### Semantic retrieval function

`match_memories(query_embedding, match_user_id, match_count)`:

- joins `embeddings` + `memories`
- computes cosine distance similarity using pgvector operator
- returns top-k memories for prompt context

---

## Authentication Flow

Current state:

- `/auth/sign-in` and `/auth/sign-up` are scaffolded UI pages.
- Supabase SSR helpers are implemented (browser + server clients).
- Dashboard/chat routes are not yet enforced with route guards.

Recommended production flow:

1. Implement Supabase email/password or OAuth actions on sign-in/up forms.
2. Persist session cookies through `@supabase/ssr` middleware patterns.
3. Add protected layouts/middleware for `/chat` and `/dashboard`.
4. Tie user identity to `user_id` in conversation + memory writes.
5. Remove fallback hardcoded user UUID in chat API.

---

## AI Architecture

### End-to-end flow

```mermaid
flowchart TD
  U[User Message] --> API[/api/chat POST]
  API --> MEM[Retrieve memory context]
  MEM --> EMB[Create query embedding]
  EMB --> RPC[Supabase match_memories RPC]
  RPC --> PROMPT[Inject personality + memory into prompt]
  PROMPT --> LLM[Sarvam model via AI SDK]
  LLM --> STREAM[Stream tokens to UI]
  STREAM --> SAVE[Persist conversation + extract memory candidates]
  SAVE --> E2[Embed memory candidates]
  E2 --> DB[(Supabase memories + embeddings)]
```

### Sarvam integration

- Uses `createOpenAI` with custom `baseURL` and API key.
- Model is selected by `SARVAM_MODEL` env var.
- Invoked through AI SDK `streamText()` for token streaming.

### Personality system

- `injectPersonality()` enriches messages before model call.
- Mood engine computes `mood` + roast `intensity`.
- Response headers expose mood metadata to UI:
  - `x-asian-gpt-mood`
  - `x-asian-gpt-intensity`

### Extreme Damage Mode

Intensity labels in config map levels 1–5 to escalating roast styles, capped with “EMOTIONAL DAMAGE maximum”.

### Memory injection

- Retrieve top semantic matches from `memories` via embeddings.
- Compress context for token efficiency.
- Feed context into system prompt for continuity and callbacks.

### Prompt architecture

- System prompt base template + personality template + memory context + conversation messages.
- Safety constraints in personality config ensure playful/non-abusive tone.

---

## Deployment Guide (Vercel)

### 1) Push to Git provider

```bash
git add .
git commit -m "docs: production-grade README"
git push origin main
```

### 2) Import project into Vercel

1. Vercel Dashboard → **Add New Project**.
2. Import the GitHub/GitLab/Bitbucket repo.
3. Framework should auto-detect **Next.js**.

### 3) Add environment variables (Vercel)

In Project Settings → Environment Variables, add all required keys:

- `NEXT_PUBLIC_APP_URL` (set to your production domain)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SARVAM_API_KEY`
- `SARVAM_BASE_URL`
- `SARVAM_MODEL`

Set for **Production**, **Preview**, and **Development** as needed.

### 4) Deploy

- Trigger deploy from dashboard or by pushing commits.
- Validate `/api/health` and `/chat` after deployment.

### 5) Custom domain

1. Vercel Project → **Domains** → add domain.
2. Configure DNS records as instructed by Vercel.
3. Update `NEXT_PUBLIC_APP_URL` to final HTTPS domain.
4. Update Supabase Auth redirect URLs to include new domain.

### 6) Redeploy after config changes

Any env var change requires a new deployment.

---

## Production Configuration

- Run `next build` in CI on every PR.
- Enforce type checks and lint checks before merge.
- Use separate Supabase projects per environment (dev/staging/prod).
- Lock down API keys and rotate periodically.
- Configure observability (Vercel logs + error tracking).
- Use real persistent conversation storage (currently in-memory map is ephemeral).

---

## Production Security

- **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in client bundles or public logs.
- **Enable and test RLS** before production data usage.
- Use authenticated `user_id` from Supabase session; never trust client-provided user ids.
- Validate request payload shape and length for chat endpoint.
- Add per-user rate limiting and abuse protections.
- Sanitize/monitor prompt injection patterns for system prompt integrity.

---

## Troubleshooting

### 1) “Invalid environment variables” on startup

Cause: Zod env validation failed.

Fix:

- Check `.env.local` for missing/empty vars.
- Ensure URL vars are valid absolute URLs.
- Restart dev server after env changes.

### 2) Supabase auth not working

Cause: providers/redirect URLs not configured.

Fix:

- Configure Auth providers in Supabase.
- Add correct local/prod redirect URLs.
- Confirm cookie behavior in SSR/client integration.

### 3) Build failures on Vercel

Cause: missing env vars or TypeScript errors.

Fix:

- Mirror all required env vars in Vercel settings.
- Run locally: `npm run typecheck && npm run build`.

### 4) Hydration mismatch warnings

Potential causes: theme differences, client-only state, dynamic content.

Fix:

- Keep `suppressHydrationWarning` (already set at html root).
- Ensure deterministic render defaults for client state.

### 5) Streaming errors from `/api/chat`

Cause: invalid Sarvam credentials, model name mismatch, provider base URL mismatch.

Fix:

- Verify `SARVAM_API_KEY`, `SARVAM_BASE_URL`, `SARVAM_MODEL`.
- Check runtime logs for provider/API response errors.

### 6) Memory retrieval not returning useful context

Cause: embeddings missing or schema mismatch.

Fix:

- Confirm `vector` extension is enabled.
- Verify rows exist in `memories` and `embeddings`.
- Confirm embedding dimension matches schema (`vector(1536)`).

### 7) Data loss between restarts

Cause: conversations are currently stored in in-memory `Map`.

Fix:

- Migrate conversation/message persistence fully to Supabase tables.

---

## Performance Notes

- **Edge runtime** on chat API lowers latency for token streaming.
- **Streaming UI** reduces perceived response time vs full-buffer responses.
- **Context compression** limits memory payload and token cost.
- **Virtualized improvements opportunity**: current chat list can be optimized for very long threads.
- **Client rendering** already uses memoization in key places (`useMemo`, selective state updates).
- **Animation/UI balance**: framer-motion effects are lightweight but should be monitored on low-end devices.

---

## Future Improvements

- **Voice mode** (speech-to-text + text-to-speech loop).
- **Avatar mode** (animated persona reactions tied to mood engine).
- **Realtime conversations** with Supabase Realtime channels.
- **Social sharing expansion** (clips, cards, meme exports).
- **Mobile app** (React Native/Expo with shared API backend).
- **Full auth hardening** + protected route middleware.
- **Persistent conversation DB** replacing in-memory store.
- **Observability stack** (Sentry/OpenTelemetry dashboards).

---

## Quick Start Checklist

- [ ] Add all env vars in `.env.local`
- [ ] Configure Supabase project + auth
- [ ] Run migration (`supabase db push`)
- [ ] Run `npm run dev`
- [ ] Validate `/chat` streaming + memory behavior
- [ ] Configure Vercel env vars + deploy
- [ ] Enable RLS + auth guards before production

