'use client';

import { Check, Copy, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function MessageBubble({ message, onEdit }: { message: Message; onEdit: (id: string, content: string) => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="group rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
        <span>{message.role === 'user' ? 'You' : 'AI'}</span>
        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
          <Button size="sm" variant="ghost" onClick={async () => { await navigator.clipboard.writeText(message.content); setCopied(true); toast.success('Copied'); setTimeout(() => setCopied(false), 1000); }}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</Button>
          {message.role === 'user' && <Button size="sm" variant="ghost" onClick={() => onEdit(message.id, message.content)}><Pencil className="size-4" /></Button>}
        </div>
      </div>
      <article className="prose prose-invert max-w-none prose-pre:rounded-xl prose-pre:bg-black/50">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{message.content}</ReactMarkdown>
      </article>
    </motion.div>
  );
}
