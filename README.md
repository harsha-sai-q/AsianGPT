# AsianGPT SaaS Foundation

Now includes a dynamic **Asian GPT personality engine** with roast-first comedic behavior and useful answers.

## Install

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Personality Engine Architecture

- `src/lib/personality/config.ts`: canonical behavior rules and intensity labels
- `src/lib/personality/mood-engine.ts`: dynamic mood + intensity derivation from context
- `src/lib/personality/templates.ts`: roast openers, reaction tags, recovery closers
- `src/lib/ai/prompts/system-prompt.ts`: prompt templating + behavior constraints
- `src/lib/ai/middleware/personality.ts`: personality injection middleware
- `src/lib/ai/stream.ts`: streaming handler with mood-aware prompt pipeline
- `src/app/api/chat/route.ts`: Edge stream + mood/intensity response headers

## Behavior Contract

- Roast first, answer second
- Dramatic/sarcastic/comedic timing with playful disappointment
- Uses meme phrases like "Sharma ji son" and "EMOTIONAL DAMAGE" contextually
- Occasional Hindi/Telugu slang for flavor
- Strictly non-hateful and non-abusive

## Existing Chat Features

- streaming responses via Vercel AI SDK
- markdown + syntax highlighting
- copy buttons + edit message + regenerate
- conversation switching + loading states + toasts
