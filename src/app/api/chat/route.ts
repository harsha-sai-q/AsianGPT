import { type Message } from 'ai';
import { NextResponse } from 'next/server';
import { createChatStream } from '@/lib/ai/stream';
import { getSarvamDiagnostics } from '@/lib/ai/provider';
import { saveConversation } from '@/lib/chat/storage';
import { persistMemoriesFromMessages, retrieveMemoryContext } from '@/lib/memory/service';

export const runtime = 'edge';

type ChatRequestBody = { messages: Message[]; conversationId?: string; userId?: string };

function toErrorLog(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

export async function POST(req: Request) {
  const traceId = crypto.randomUUID();

  try {
    const body = (await req.json()) as ChatRequestBody;
    const conversationId = body.conversationId ?? crypto.randomUUID();
    const userId = body.userId ?? '00000000-0000-0000-0000-000000000001';
    const latestUserText = String([...(body.messages ?? [])].reverse().find((m) => m.role === 'user')?.content ?? '');

    console.info('[api/chat] incoming request', {
      traceId,
      conversationId,
      userId,
      messageCount: body.messages?.length ?? 0,
      latestUserTextPreview: latestUserText.slice(0, 160),
      sarvam: getSarvamDiagnostics()
    });

    let memoryContext = '';
    try {
      memoryContext = await retrieveMemoryContext(userId, latestUserText);
      console.info('[api/chat] memory retrieval success', {
        traceId,
        memoryContextLength: memoryContext.length
      });
    } catch (error) {
      console.error('[api/chat] memory retrieval failed, continuing without memory', {
        traceId,
        error: toErrorLog(error)
      });
    }

    const { result, mood } = createChatStream(body.messages ?? [], memoryContext);

    result.text
      .then(async (assistantText) => {
        console.info('[api/chat] stream completed', {
          traceId,
          conversationId,
          assistantPreview: assistantText.slice(0, 200),
          assistantLength: assistantText.length
        });
        const merged = [...(body.messages ?? []), { id: crypto.randomUUID(), role: 'assistant', content: assistantText } as Message];
        saveConversation(conversationId, merged);
        try {
          await persistMemoriesFromMessages(userId, conversationId, merged);
        } catch (error) {
          console.error('[api/chat] memory persistence failed (non-blocking)', {
            traceId,
            conversationId,
            error: toErrorLog(error)
          });
        }
      })
      .catch((error) => {
        console.error('[api/chat] stream text promise rejected', {
          traceId,
          conversationId,
          error: toErrorLog(error)
        });
      });

    return result.toDataStreamResponse({
      headers: {
        'x-conversation-id': conversationId,
        'x-asian-gpt-mood': mood.mood,
        'x-asian-gpt-intensity': String(mood.intensity),
        'x-trace-id': traceId
      }
    });
  } catch (error) {
    console.error('[api/chat] fatal handler error', { traceId, error: toErrorLog(error) });
    return NextResponse.json({ error: 'Failed to stream response.', traceId }, { status: 500 });
  }
}
