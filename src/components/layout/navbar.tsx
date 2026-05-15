'use client';

import { Menu, MoonStar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/ui-store';

export function Navbar() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  return (
    <header className="glass sticky top-0 z-40 flex h-16 items-center justify-between px-4">
      <Button variant="ghost" size="sm" onClick={toggleSidebar}><Menu className="size-4" /></Button>
      <span className="text-sm text-zinc-300">AsianGPT Dashboard</span>
      <Button variant="ghost" size="sm"><MoonStar className="size-4" /></Button>
    </header>
  );
}
