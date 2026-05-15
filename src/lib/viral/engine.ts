import type { Message } from 'ai';
import type { CousinScore, ViralStats } from './types';

export function computeViralStats(messages: Message[]): ViralStats {
  const userMsgs = messages.filter((m) => m.role === 'user');
  const failures = userMsgs.filter((m) => /(failed|stuck|again|panic|not working)/i.test(String(m.content))).length;
  const streak = Math.max(0, userMsgs.length - failures);
  const disappointment = Math.min(100, failures * 17 + userMsgs.length * 4);
  const sharmaScore = Math.max(1, 100 - disappointment + streak * 3);
  const mood: ViralStats['mood'] = disappointment > 80 ? 'emotional-damage' : disappointment > 60 ? 'chaotic' : disappointment > 35 ? 'dramatic' : 'calm';
  return { disappointment, sharmaScore, roastStreak: streak, mood };
}

export const fakeCousinLeaderboard: CousinScore[] = [
  { name: 'Rohan Cousin', score: 99, badge: 'IIT Aura' },
  { name: 'Priya Cousin', score: 97, badge: 'Startup Intern' },
  { name: 'Arjun Cousin', score: 95, badge: 'LeetCode Beast' },
  { name: 'You', score: 68, badge: 'Potential Energy' }
];
