'use client';

import { useChat } from 'ai/react';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { getConversationAction, getConversationsAction, updateMessageAction } from '@/app/actions/chat';
import { ChatInput } from './chat-input';
import { ConversationSidebar } from './conversation-sidebar';
import { MessageBubble } from './message-bubble';
import type { Conversation } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { computeViralStats, fakeCousinLeaderboard } from '@/lib/viral/engine';
import { DisappointmentMeter } from '@/components/viral/disappointment-meter';
import { MoodIndicator } from '@/components/viral/mood-indicator';
import { CousinLeaderboard } from '@/components/viral/cousin-leaderboard';

export function ChatShell({ initialConversations }: { initialConversations: Conversation[] }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversations[0]?.id);
  const [editing, setEditing] = useState<{ id: string; content: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [mood, setMood] = useState<string>('dramatic');
  const [intensity, setIntensity] = useState<string>('2');
  const [showMeme, setShowMeme] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => conversations.find((c) => c.id === conversationId), [conversations, conversationId]);
  const { messages, input, setInput, setMessages, append, isLoading, reload } = useChat({ api: '/api/chat', id: conversationId, initialMessages: active?.messages, body: { conversationId } , onResponse(r){setMood(r.headers.get('x-asian-gpt-mood') ?? 'dramatic'); setIntensity(r.headers.get('x-asian-gpt-intensity') ?? '2');}, onError(){toast.error('EMOTIONAL DAMAGE: response failed');}});

  const stats = useMemo(() => computeViralStats(messages), [messages]);
  useEffect(() => { viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  return <div className="flex h-[calc(100vh-2rem)] gap-4">
    <ConversationSidebar conversations={conversations} currentId={conversationId} onSelect={(id)=>startTransition(async()=>{const d=await getConversationAction(id); if(!d)return; setConversationId(id); setMessages(d.messages);})} onNew={()=>{setConversationId(undefined); setMessages([]);}} />
    <div className="grid flex-1 grid-cols-1 gap-3 xl:grid-cols-[1fr_320px]">
      <div className="flex min-h-0 flex-col gap-3">
        <div className="glass flex items-center justify-between rounded-xl px-4 py-2 text-xs text-zinc-300"><span>AI mood: <b className="text-cyan-300">{mood}</b></span><span>Roast: <b className="text-violet-300">{intensity}/5</b></span><span>Sharma Ji Son Score: <b className="text-emerald-300">{stats.sharmaScore}</b></span></div>
        <div ref={viewportRef} className="glass flex-1 space-y-3 overflow-y-auto rounded-2xl p-4 will-change-transform">
          {pending && <div className="animate-pulse rounded-xl bg-white/5 p-4">Loading conversation...</div>}
          {messages.map((m) => <MessageBubble key={m.id} message={m} onEdit={(id, content) => setEditing({ id, content })} />)}
          {isLoading && <div className="animate-pulse rounded-xl bg-white/5 p-4">💥 EMOTIONAL DAMAGE... generating response...</div>}
        </div>
        <AnimatePresence>{showMeme && <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="glass rounded-xl p-3 text-sm">📣 Meme Popup: “Last week study promise, today reels marathon?”</motion.div>}</AnimatePresence>
        {editing ? <div className="glass rounded-2xl p-3"><textarea className="w-full rounded-lg bg-black/30 p-2" value={editing.content} onChange={(e)=>setEditing({...editing,content:e.target.value})}/><div className="mt-2 flex gap-2"><Button size="sm" onClick={async()=>{if(!conversationId)return; const u=await updateMessageAction(conversationId,editing.id,editing.content); if(u){setMessages(u.messages); toast.success('Updated');} setEditing(null);}}>Save</Button><Button size="sm" variant="ghost" onClick={()=>setEditing(null)}>Cancel</Button></div></div> : <ChatInput value={input} onChange={setInput} loading={isLoading} onSubmit={async()=>{await append({role:'user',content:input}); const data=await getConversationsAction(); setConversations(data); if(Math.random()>0.65) setShowMeme(true);}} />}
        <div className="flex gap-2 justify-end"><Button variant="ghost" onClick={()=>reload()}>Regenerate</Button><Button variant="outline" onClick={()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Asian GPT just gave me EMOTIONAL DAMAGE 😂')}`,'_blank')}>Share roast</Button></div>
      </div>
      <div className="hidden xl:flex xl:flex-col gap-3">
        <DisappointmentMeter value={stats.disappointment} />
        <MoodIndicator mood={stats.mood} />
        <div className="glass rounded-xl p-3 text-sm">🔥 Roast streak: <b>{stats.roastStreak}</b></div>
        <CousinLeaderboard data={fakeCousinLeaderboard} />
      </div>
    </div>
  </div>;
}
