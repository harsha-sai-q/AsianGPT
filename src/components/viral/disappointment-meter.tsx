'use client';

import { motion } from 'framer-motion';

export function DisappointmentMeter({ value }: { value: number }) {
  return (
    <div className="glass rounded-xl p-3">
      <p className="text-xs text-zinc-400">Disappointment Meter</p>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <motion.div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-red-400" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6 }} />
      </div>
      <p className="mt-2 text-sm font-medium">{value}%</p>
    </div>
  );
}
