import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="min-h-screen px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center py-24 text-center">
        <div className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
          <Sparkles className="size-4 text-cyan-300" /> AI-native SaaS foundation
        </div>
        <h1 className="max-w-4xl bg-gradient-to-r from-violet-200 via-cyan-100 to-violet-300 bg-clip-text text-5xl font-semibold text-transparent md:text-7xl">Build premium AI products faster.</h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-300">Scalable architecture with Next.js 15, Supabase, Vercel AI SDK, and premium futuristic design primitives.</p>
        <div className="mt-10 flex gap-4">
          <Button asChild><Link href="/auth/sign-up">Get started</Link></Button>
          <Button variant="outline" asChild><Link href="/dashboard">Open dashboard</Link></Button>
        </div>
      </div>
    </main>
  );
}
