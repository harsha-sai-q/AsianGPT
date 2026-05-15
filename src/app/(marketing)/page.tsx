'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const features = ['Disappointment Meter', 'Sharma Ji Son Score', 'Roast streaks', 'Shareable roast cards'];

export default function LandingPage() {
  return (
    <main className="min-h-screen px-6 pb-16">
      <section className="mx-auto max-w-6xl pt-24 text-center">
        <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-violet-200 via-cyan-100 to-fuchsia-300 bg-clip-text text-6xl font-semibold text-transparent md:text-8xl">Asian GPT</motion.h1>
        <p className="mx-auto mt-5 max-w-2xl text-zinc-300">The only AI that roasts your excuses, tracks your chaos, and still gives world-class answers.</p>
        <div className="mt-8 flex justify-center gap-3"><Button asChild><Link href="/chat">Start getting roasted</Link></Button><Button variant="outline" asChild><Link href="/dashboard">View product</Link></Button></div>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-6"><p className="text-xs text-zinc-400">Live AI demo preview</p><p className="mt-2 text-lg">“Last week you promised to study. Today reels again? EMOTIONAL DAMAGE.”</p></div>
        <div className="glass rounded-2xl p-6"><p className="text-xs text-zinc-400">Viral feature stack</p><ul className="mt-2 space-y-2 text-sm text-zinc-200">{features.map((f) => <li key={f}>⚡ {f}</li>)}</ul></div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="text-2xl font-semibold">Loved by students, devs, and procrastinators</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">{['“Funniest productivity slap ever.”', '“Like ChatGPT + Steven He + Red Bull.”', '“I laughed, then actually fixed my bug.”'].map((t) => <div key={t} className="glass rounded-xl p-4 text-sm">{t}</div>)}</div>
      </section>
    </main>
  );
}
