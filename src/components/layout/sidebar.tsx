'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { Bot, LayoutDashboard, MessageSquare, Settings } from 'lucide-react';
import type { ComponentType } from 'react';
import { cn } from '@/lib/utils/cn';
import { useUIStore } from '@/store/ui-store';

const links: ReadonlyArray<{ href: Route; label: string; icon: ComponentType<{ className?: string }> }> = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/chat', label: 'Chat', icon: Bot },
  { href: '/dashboard', label: 'History', icon: MessageSquare },
  { href: '/dashboard', label: 'Settings', icon: Settings }
];

export function Sidebar() {
  const open = useUIStore((s) => s.sidebarOpen);
  return (
    <aside className={cn('glass hidden h-[calc(100vh-4rem)] w-64 shrink-0 p-4 md:block', !open && 'md:w-20')}>
      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={label} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-white/5 hover:text-white">
            <Icon className="size-4" />
            {open && <span className="text-sm">{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
