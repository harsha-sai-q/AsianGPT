import { type Message } from 'ai';
import { NextResponse } from 'next/server';
import { createChatStream } from '@/lib/ai/stream';
import { saveConversation } from '@/lib/chat/storage';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages: Message[]; conversationId?: string };
    const conversationId = body.conversationId ?? crypto.randomUUID();
    const result = createChatStream(body.messages);

    result.text.then(async () => {
      const merged = [...body.messages, { id: crypto.randomUUID(), role: 'assistant', content: await result.text } as Message];
      saveConversation(conversationId, merged);
    });

    return result.toDataStreamResponse({ headers: { 'x-conversation-id': conversationId } });
  } catch {
    return NextResponse.json({ error: 'Failed to stream response.' }, { status: 500 });
  }
}
