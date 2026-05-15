'use client';

import { Clock3, MessageSquarePlus, PanelLeftClose, Search, Settings2, Sparkles, UserCircle2 } from 'lucide-react';
import type { Conversation } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export function ConversationSidebar({
  conversations,
  currentId,
  onSelect,
  onNew,
  collapsed,
  onToggle
}: {
  conversations: Conversation[];
  currentId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside className={cn('glass hidden h-[calc(100vh-3rem)] shrink-0 rounded-3xl p-3 lg:flex lg:flex-col', collapsed ? 'w-20' : 'w-80')}>
      <div className="mb-3 flex items-center justify-between gap-2">
        {!collapsed && <div className="text-sm font-medium text-zinc-300">AsianGPT Studio</div>}
        <Button size="sm" variant="ghost" className="h-9 w-9 px-0" onClick={onToggle}><PanelLeftClose className="size-4" /></Button>
      </div>
      <Button className="mb-4 w-full justify-start rounded-xl" onClick={onNew}>
        <MessageSquarePlus className="mr-2 size-4" />
        {!collapsed && 'New chat'}
      </Button>
      {!collapsed && <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-400"><Search className="size-4" />Search history</div>}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {conversations.map((item) => (
          <button key={item.id} onClick={() => onSelect(item.id)} className={cn('w-full rounded-2xl border px-3 py-2 text-left transition', currentId === item.id ? 'border-cyan-300/30 bg-cyan-500/10 text-white' : 'border-white/5 bg-white/[0.03] text-zinc-300 hover:bg-white/10')}>
            {collapsed ? <Clock3 className="size-4" /> : <><p className="truncate text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-zinc-500">{new Date(item.updatedAt).toLocaleString()}</p></>}
          </button>
        ))}
      </div>
      {!collapsed && <div className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-400"><div className="flex items-center gap-2"><Sparkles className="size-3.5" />Intentional chaos mode enabled</div><div className="flex items-center gap-2"><Settings2 className="size-3.5" />Model settings coming soon</div><div className="flex items-center gap-2 text-zinc-300"><UserCircle2 className="size-4" />Founder Plan</div></div>}
    </aside>
  );
}
