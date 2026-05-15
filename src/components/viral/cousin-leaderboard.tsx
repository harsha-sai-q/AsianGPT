'use client';

import { motion } from 'framer-motion';
import type { CousinScore } from '@/lib/viral/types';

export function CousinLeaderboard({ data }: { data: CousinScore[] }) {
  return (
    <div className="glass rounded-xl p-3">
      <p className="text-xs text-zinc-400">Fake Cousin Leaderboard</p>
      <div className="mt-2 space-y-2">
        {data.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1 text-sm">
            <span>{c.name} · {c.badge}</span>
            <span className="font-semibold text-cyan-300">{c.score}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
