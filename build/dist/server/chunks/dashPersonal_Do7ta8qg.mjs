import { t as read } from './premiumAdmin_C4HUbWtx.mjs';
import { cached } from './sharedCache_DFk4ml3Q.mjs';

const TTL_MS = 6e4;
function getPersonalSettings(astro, userId) {
  if (!/^\d{15,25}$/.test(userId)) return Promise.resolve({ prefix: null, reputation: null });
  return cached(`personal:${userId}`, () => loadPersonalSettings(astro, userId), { freshMs: TTL_MS, keep: () => true });
}
async function loadPersonalSettings(astro, userId) {
  const [prefixes, points] = await Promise.all([
    read(astro, "user_prefixes", `user_id=eq.${userId}&select=prefix&limit=1`),
    read(astro, "reputation", `user_id=eq.${userId}&points=gt.0&select=points&limit=500`)
  ]);
  const total = points.reduce((sum, row) => sum + (Number(row.points) || 0), 0);
  return {
    prefix: typeof prefixes[0]?.prefix === "string" ? prefixes[0].prefix : null,
    reputation: points.length ? { points: total, servers: points.length } : null
  };
}

export { getPersonalSettings as g };
