'use client';

import { Loader2, Mic, Paperclip, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatInput({ value, onChange, onSubmit, loading }: { value: string; onChange: (v: string) => void; onSubmit: () => void; loading: boolean }) {
  return (
    <div className="glass sticky bottom-0 rounded-3xl p-3 shadow-2xl shadow-black/20">
      <div className="mb-2 flex items-center justify-between px-1 text-xs text-zinc-500">
        <span>Ask anything. Roast settings apply.</span>
        <span>Enter to send</span>
      </div>
      <div className="flex items-end gap-2">
        <Button size="sm" variant="ghost" className="h-10 w-10 px-0"><Paperclip className="size-4" /></Button>
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={1} placeholder="Message AsianGPT..." className="max-h-44 min-h-12 flex-1 resize-none rounded-2xl border border-white/10 bg-black/20 p-3 outline-none" />
        <Button size="sm" variant="ghost" className="h-10 w-10 px-0"><Mic className="size-4" /></Button>
        <Button onClick={onSubmit} disabled={loading || !value.trim()} className="rounded-xl">{loading ? <Loader2 className="size-4 animate-spin" /> : <SendHorizonal className="size-4" />}</Button>
      </div>
    </div>
  );
}
