# AsianGPT SaaS Foundation

Production-grade AI chatbot SaaS with smooth streaming UX, conversation management, and Sarvam 105B integration via Vercel AI SDK.

## Install

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Required Environment Variables

- `SARVAM_API_KEY`
- `SARVAM_BASE_URL` (default: `https://api.sarvam.ai/v1`)
- `SARVAM_MODEL` (default: `sarvam-105b`)
- Supabase + app URL values from `.env.example`

## Architecture

- `src/lib/ai/*`: provider abstraction + streaming handler
- `src/app/api/chat/route.ts`: Edge streaming endpoint
- `src/components/chat/*`: chat UX primitives (markdown, copy, edit, regenerate, typing)
- `src/app/actions/chat.ts`: server actions for conversation management
- `src/lib/chat/storage.ts`: persistence interface (currently in-memory; replace with DB)

## Features Implemented

- streaming responses (AI SDK)
- animated messages + smooth autoscroll
- markdown + syntax highlighting
- copy buttons + user message editing
- regenerate response button
- conversation sidebar + switching + new chat
- loading/skeleton states
- toast notifications and error handling
