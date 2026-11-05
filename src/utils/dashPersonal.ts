import { read } from './premium';
import { cached } from './sharedCache';

export interface PersonalSettings {
  /** The prefix the member chose for themselves (`/myprefix`), or null. */
  prefix: string | null;
  /** Reputation points over every server, and in how many servers they were given. */
  reputation: { points: number; servers: number } | null;
}

const TTL_MS = 60_000;

/**
 * The few personal rows the bot keeps for a member and the dashboard can read: their own prefix and their reputation. Two small reads
 * (kept a minute in the shared cache); a failed read is the same as "nothing set", so the profile page never breaks for it.
 */
export function getPersonalSettings(astro: any, userId: string): Promise<PersonalSettings> {
  if (!/^\d{15,25}$/.test(userId)) return Promise.resolve({ prefix: null, reputation: null });
  return cached(`personal:${userId}`, () => loadPersonalSettings(astro, userId), { freshMs: TTL_MS, keep: () => true });
}

async function loadPersonalSettings(astro: any, userId: string): Promise<PersonalSettings> {
  const [prefixes, points] = await Promise.all([
    read<{ prefix: string }>(astro, 'user_prefixes', `user_id=eq.${userId}&select=prefix&limit=1`),
    read<{ points: number }>(astro, 'reputation', `user_id=eq.${userId}&points=gt.0&select=points&limit=500`),
  ]);
  const total = points.reduce((sum, row) => sum + (Number(row.points) || 0), 0);
  return {
    prefix: typeof prefixes[0]?.prefix === 'string' ? prefixes[0].prefix : null,
    reputation: points.length ? { points: total, servers: points.length } : null,
  };
}
