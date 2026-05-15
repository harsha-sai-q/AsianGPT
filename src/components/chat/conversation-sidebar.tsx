'use client';

import { MessageSquarePlus } from 'lucide-react';
import type { Conversation } from '@/types/chat';
import { Button } from '@/components/ui/button';

export function ConversationSidebar({ conversations, currentId, onSelect, onNew }: { conversations: Conversation[]; currentId?: string; onSelect: (id: string) => void; onNew: () => void }) {
  return (
    <aside className="glass hidden w-72 shrink-0 rounded-2xl p-4 lg:block">
      <Button className="mb-4 w-full" variant="outline" onClick={onNew}><MessageSquarePlus className="mr-2 size-4" />New chat</Button>
      <div className="space-y-2 overflow-y-auto">
        {conversations.map((item) => (
          <button key={item.id} onClick={() => onSelect(item.id)} className={`w-full rounded-xl px-3 py-2 text-left text-sm ${currentId === item.id ? 'bg-white/15 text-white' : 'bg-white/5 text-zinc-300'}`}>
            <p className="truncate">{item.title}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}
