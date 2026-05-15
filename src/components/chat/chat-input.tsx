'use client';

import { Loader2, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatInput({ value, onChange, onSubmit, loading }: { value: string; onChange: (v: string) => void; onSubmit: () => void; loading: boolean }) {
  return (
    <div className="glass sticky bottom-0 rounded-2xl p-3">
      <div className="flex items-end gap-2">
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={1} placeholder="Send a message..." className="max-h-44 min-h-12 flex-1 resize-none rounded-xl border border-white/10 bg-black/20 p-3 outline-none" />
        <Button onClick={onSubmit} disabled={loading || !value.trim()}>{loading ? <Loader2 className="size-4 animate-spin" /> : <SendHorizonal className="size-4" />}</Button>
      </div>
    </div>
  );
}
