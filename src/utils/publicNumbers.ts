// Petto's public numbers for the link preview of the home page: how many servers it is in and how many members they have. They come from the
// row the bot rewrites every minute for the stats page (global_stats), kept 5 minutes here and shared by every visitor that asks at once.
// Asking never takes more than 1.5 seconds, and when the numbers cannot be read the answer is null (the preview then has a title with no numbers).
import { getEnv } from './env';

export interface PublicNumbers { servers: number; members: number | null }

const KEEP_MS = 5 * 60_000;
const KEEP_FAILURE_MS = 30_000;
let kept: { at: number; value: PublicNumbers | null } | null = null;
let running: Promise<PublicNumbers | null> | null = null;

async function load(context: { locals?: unknown }): Promise<PublicNumbers | null> {
  const url = getEnv(context, 'PETTO_BOT_API_URL');
  const key = getEnv(context, 'PETTO_BOT_API_SECRET');
  if (!url || !key) return null;
  try {
    const response = await fetch(`${url}/rest/v1/global_stats?id=eq.main&select=data`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'X-Petto-Dashboard-Key': key, Accept: 'application/json' },
      signal: AbortSignal.timeout(1_500),
    });
    if (!response.ok) return null;
    const rows = await response.json();
    const data = Array.isArray(rows) ? rows[0]?.data : null;
    const servers = Number(data?.servers);
    if (!Number.isFinite(servers) || servers < 1) return null;
    const members = Number(data?.members);
    return { servers, members: Number.isFinite(members) && members > 0 ? members : null };
  } catch {
    return null;
  }
}

export function getPublicNumbers(context: { locals?: unknown }): Promise<PublicNumbers | null> {
  if (kept && Date.now() - kept.at < (kept.value ? KEEP_MS : KEEP_FAILURE_MS)) return Promise.resolve(kept.value);
  if (!running) running = load(context).then((value) => { kept = { at: Date.now(), value }; return value; }).finally(() => { running = null; });
  return running;
}
