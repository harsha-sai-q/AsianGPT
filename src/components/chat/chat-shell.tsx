'use client';

import { useChat } from 'ai/react';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { getConversationAction, getConversationsAction, updateMessageAction } from '@/app/actions/chat';
import { ChatInput } from './chat-input';
import { ConversationSidebar } from './conversation-sidebar';
import { MessageBubble } from './message-bubble';
import type { Conversation } from '@/types/chat';
import { Button } from '@/components/ui/button';

export function ChatShell({ initialConversations }: { initialConversations: Conversation[] }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversations[0]?.id);
  const [editing, setEditing] = useState<{ id: string; content: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const viewportRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => conversations.find((c) => c.id === conversationId), [conversations, conversationId]);

  const { messages, input, setInput, setMessages, append, isLoading, reload } = useChat({
    api: '/api/chat',
    id: conversationId,
    initialMessages: active?.messages,
    body: { conversationId },
    onResponse(response) {
      const newId = response.headers.get('x-conversation-id');
      if (newId && !conversationId) setConversationId(newId);
    },
    onError() {
      toast.error('Failed to get response.');
    }
  });

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const loadConversation = (id: string) => {
    startTransition(async () => {
      const data = await getConversationAction(id);
      if (!data) return;
      setConversationId(id);
      setMessages(data.messages);
    });
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-4">
      <ConversationSidebar conversations={conversations} currentId={conversationId} onSelect={loadConversation} onNew={() => { setConversationId(undefined); setMessages([]); }} />
      <div className="flex flex-1 flex-col gap-3">
        <div ref={viewportRef} className="glass flex-1 space-y-3 overflow-y-auto rounded-2xl p-4">
          {pending && <div className="animate-pulse rounded-xl bg-white/5 p-4">Loading conversation...</div>}
          {messages.map((m) => <MessageBubble key={m.id} message={m} onEdit={(id, content) => setEditing({ id, content })} />)}
          {isLoading && <div className="animate-pulse rounded-xl bg-white/5 p-4">AI is typing...</div>}
        </div>
        {editing ? (
          <div className="glass rounded-2xl p-3">
            <textarea className="w-full rounded-lg bg-black/30 p-2" value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
            <div className="mt-2 flex gap-2"><Button size="sm" onClick={async () => {
              if (!conversationId) return;
              const updated = await updateMessageAction(conversationId, editing.id, editing.content);
              if (updated) { setMessages(updated.messages); toast.success('Message updated'); }
              setEditing(null);
            }}>Save</Button><Button size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button></div>
          </div>
        ) : <ChatInput value={input} onChange={setInput} loading={isLoading} onSubmit={async () => {
          await append({ role: 'user', content: input });
          const data = await getConversationsAction();
          setConversations(data);
        }} />}
        <div className="flex justify-end"><Button variant="ghost" onClick={() => reload()}>Regenerate response</Button></div>
      </div>
    </div>
  );
}
