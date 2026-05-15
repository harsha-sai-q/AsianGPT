'use client';

import { useChat } from 'ai/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ChatInput } from './chat-input';
import { ConversationSidebar } from './conversation-sidebar';
import { MessageBubble } from './message-bubble';
import type { Conversation } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { computeViralStats } from '@/lib/viral/engine';

const MODES = [
  { key: 'normal', label: 'Normal', hint: 'Balanced and helpful' },
  { key: 'roast', label: 'Roast', hint: 'Playful savage mode' },
  { key: 'extreme', label: 'Extreme Damage', hint: 'Maximum emotional damage' }
] as const;

export function ChatShell({ initialConversations }: { initialConversations: Conversation[] }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversations[0]?.id);
  const [mode, setMode] = useState<'normal'|'roast'|'extreme'>('roast');
  const [mood, setMood] = useState<string>('dramatic');
  const [intensity, setIntensity] = useState<string>('2');
  const [collapsed, setCollapsed] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => conversations.find((c) => c.id === conversationId), [conversations, conversationId]);
  const { messages, input, setInput, setMessages, append, isLoading } = useChat({ api: '/api/chat', id: conversationId, initialMessages: active?.messages, body: { conversationId, mode }, onResponse(r){setMood(r.headers.get('x-asian-gpt-mood') ?? 'dramatic'); setIntensity(r.headers.get('x-asian-gpt-intensity') ?? '2'); const id=r.headers.get('x-conversation-id'); if(id&&!conversationId)setConversationId(id);}, onError(){toast.error('Response failed. Please retry.');}});

  useEffect(() => { viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    const key = 'asiangpt_conversations';
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved) as Conversation[];
      setConversations(parsed);
      if (!conversationId && parsed[0]?.id) setConversationId(parsed[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    const updated: Conversation = {
      id: conversationId,
      title: (messages[0]?.content?.slice(0, 40) || 'New conversation').replace(/\n/g, ' '),
      createdAt: active?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages
    };
    const next = [updated, ...conversations.filter((c) => c.id !== conversationId)];
    setConversations(next);
    localStorage.setItem('asiangpt_conversations', JSON.stringify(next));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, conversationId]);

  const stats = useMemo(() => computeViralStats(messages), [messages]);

  const maybeContextToast = () => {
    if (Math.random() < 0.15) {
      toast('Tiny emotional damage delivered.', { description: 'Context-aware roast enabled.', duration: 2800 });
    }
  };

  return <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-[1500px] gap-4 p-3">
    <ConversationSidebar conversations={conversations} currentId={conversationId} onSelect={(id)=>{setConversationId(id); setMessages(conversations.find((c)=>c.id===id)?.messages ?? []); const modeKey=`asiangpt_mode_${id}`; const m=localStorage.getItem(modeKey) as 'normal'|'roast'|'extreme'|null; if(m) setMode(m);}} onNew={()=>{const id=crypto.randomUUID(); setConversationId(id); setMessages([]); setMode('roast');}} collapsed={collapsed} onToggle={()=>setCollapsed(!collapsed)} />
    <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
      <div className="glass flex min-h-0 flex-col rounded-3xl p-4">
        <div className="mb-3 flex items-center justify-between"><div><h1 className="text-lg font-semibold">AsianGPT</h1><p className="text-sm text-zinc-400">Premium chaos intelligence</p></div><div className="rounded-xl border border-white/10 bg-black/20 p-1">{MODES.map((m)=><button key={m.key} onClick={()=>{setMode(m.key); if(conversationId)localStorage.setItem(`asiangpt_mode_${conversationId}`,m.key); toast(m.hint,{duration:1800});}} className={`rounded-lg px-3 py-1.5 text-xs transition ${mode===m.key?'bg-violet-500/30 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]':'text-zinc-400 hover:text-zinc-200'}`}>{m.label}</button>)}</div></div>
        <div ref={viewportRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-2xl bg-black/20 p-3">
          {messages.length===0 && <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="mx-auto mt-10 max-w-xl space-y-3 text-center"><h2 className="text-2xl font-semibold tracking-tight">What should we build today?</h2><p className="text-sm text-zinc-400">Ask for strategy, code, writing, or brutal productivity coaching.</p><div className="grid gap-2 text-left sm:grid-cols-2">{['Plan my SaaS launch week','Fix my API latency bottleneck','Create a viral content calendar','Help me stop procrastinating today'].map((p)=><button key={p} onClick={()=>setInput(p)} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm hover:bg-white/10">{p}</button>)}</div></motion.div>}
          {messages.map((m) => <MessageBubble key={m.id} message={m} onEdit={()=>{}} />)}
          {isLoading && <div className="animate-pulse rounded-xl bg-white/5 p-4 text-sm text-zinc-300">Crafting response…</div>}
        </div>
        <div className="mt-3"><ChatInput value={input} onChange={setInput} loading={isLoading} onSubmit={async()=>{await append({role:'user',content:input}); maybeContextToast();}} /></div>
      </div>
      <aside className="glass hidden rounded-3xl p-4 xl:block"><h3 className="mb-3 text-sm font-medium text-zinc-300">Session</h3><div className="space-y-3 text-sm"><div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-zinc-400">AI mood</p><p className="font-medium text-cyan-300">{mood}</p></div><div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-zinc-400">Roast level</p><p className="font-medium text-violet-300">{intensity}/5</p></div><div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-zinc-400">Sharma score</p><p className="font-medium text-emerald-300">{stats.sharmaScore}</p></div><Button className="w-full" variant="outline">Project memory</Button></div></aside>
    </div>
  </div>;
}
