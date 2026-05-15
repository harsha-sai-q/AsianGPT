import { type Message } from 'ai';
import { NextResponse } from 'next/server';
import { createChatStream } from '@/lib/ai/stream';
import { saveConversation } from '@/lib/chat/storage';
import { persistMemoriesFromMessages, retrieveMemoryContext } from '@/lib/memory/service';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages: Message[]; conversationId?: string; userId?: string };
    const conversationId = body.conversationId ?? crypto.randomUUID();
    const userId = body.userId ?? '00000000-0000-0000-0000-000000000001';
    const latestUserText = String([...body.messages].reverse().find((m) => m.role === 'user')?.content ?? '');

    const memoryContext = await retrieveMemoryContext(userId, latestUserText);
    const { result, mood } = createChatStream(body.messages, memoryContext);

    result.text.then(async () => {
      const merged = [...body.messages, { id: crypto.randomUUID(), role: 'assistant', content: await result.text } as Message];
      saveConversation(conversationId, merged);
      await persistMemoriesFromMessages(userId, conversationId, merged);
    });

    return result.toDataStreamResponse({
      headers: {
        'x-conversation-id': conversationId,
        'x-asian-gpt-mood': mood.mood,
        'x-asian-gpt-intensity': String(mood.intensity)
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to stream response.' }, { status: 500 });
  }
}
