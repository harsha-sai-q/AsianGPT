'use client';

import { motion } from 'framer-motion';

const moodMap = {
  calm: '🙂 Calm but judging',
  dramatic: '🎭 Dramatic disappointment',
  chaotic: '🌪️ Chaos mode',
  'emotional-damage': '💥 EMOTIONAL DAMAGE'
};

export function MoodIndicator({ mood }: { mood: keyof typeof moodMap }) {
  return (
    <motion.div layout className="glass rounded-xl p-3 text-sm">
      <p className="text-xs text-zinc-400">AI Mood Indicator</p>
      <p className="mt-1 font-medium">{moodMap[mood]}</p>
    </motion.div>
  );
}
