// The daily history the stats page draws (/stats, /es/stats, /pt-br/stats). Nothing here names a person or a server.
//
// 1. The bot may save one extra row, `global_stats` id `history`, with `{ days: [{ day, servers, members, messages, reactions,
//    voiceSeconds, estimated? }] }`: one row per day (GMT-5), oldest first, ending with today (still in progress). A number that is
//    not known is `null`; `estimated: true` marks a day whose servers and members were rebuilt afterwards. That is the only place
//    with the servers and members of past days.
// 2. Without it, where the site has its own database connection (Discloud, `PETTO_DATABASE_URL`), the messages, reactions and voice
//    time of every day are added up from `activity_stats`, which the bot already keeps. The Worker build leaves that code out.
// 3. Without either, there is no history and the page says so.
//
// Kept 5 minutes in memory and shared by everyone who asks at once, so a visitor never makes the database work.
import { getEnv } from './env';
import { directQuery } from './directQuery';
import { MAX_HISTORY_DAYS, botDay, normalizeHistory } from './globalStatsMath.mjs';

export interface HistoryDay { day: string; servers?: number; members?: number; messages?: number; reactions?: number; voiceSeconds?: number; estimated?: boolean }
export interface GlobalHistory { days: HistoryDay[]; source: 'saved' | 'activity' | 'none' }

const KEEP_MS = 5 * 60_000;
const KEEP_FAILURE_MS = 30_000;
type Context = { locals?: { runtime?: { env?: Record<string, string | undefined> } } };
let kept: { at: number; ttl: number; value: GlobalHistory } | null = null;
let running: Promise<GlobalHistory> | null = null;

async function readSaved(context: Context): Promise<HistoryDay[] | null> {
  const url = getEnv(context, 'PETTO_BOT_API_URL');
  const key = getEnv(context, 'PETTO_BOT_API_SECRET');
  if (!url || !key) return null;
  const response = await fetch(`${url}/rest/v1/global_stats?id=eq.history&select=data`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'X-Petto-Dashboard-Key': key, Accept: 'application/json' },
    signal: AbortSignal.timeout(6_000),
  });
  if (!response.ok) return null;
  const rows = await response.json();
  const days = normalizeHistory(Array.isArray(rows) ? rows[0]?.data : null);
  return days.length ? days : null;
}

/** Messages, reactions and voice time of all servers by day, from the counters the bot keeps; only where the site has the database. */
async function readActivity(): Promise<HistoryDay[] | null> {
  if (!directQuery) return null;
  const since = botDay(Date.now() - (MAX_HISTORY_DAYS - 1) * 86_400_000);
  const rows = await directQuery<{ day: string; messages: string; reactions: string; voice: string }>(
    `SELECT to_char("day", 'YYYY-MM-DD') AS "day", SUM("messages")::bigint AS "messages", SUM("reactions")::bigint AS "reactions", SUM("voice_seconds")::bigint AS "voice" FROM "public"."activity_stats" WHERE "day" >= $1::date GROUP BY "day" ORDER BY "day"`,
    [since],
  );
  if (!rows) return null;
  const days = normalizeHistory(rows.map((row) => ({ day: row.day, messages: row.messages, reactions: row.reactions, voiceSeconds: row.voice })));
  return days.length ? days : null;
}

async function load(context: Context): Promise<GlobalHistory> {
  try {
    const saved = await readSaved(context);
    if (saved) return { days: saved, source: 'saved' };
  } catch { /* the saved history is not there or not reachable: the counters are tried next */ }
  try {
    const activity = await readActivity();
    if (activity) return { days: activity, source: 'activity' };
  } catch { /* none */ }
  return { days: [], source: 'none' };
}

export async function loadGlobalHistory(context: Context): Promise<GlobalHistory> {
  const now = Date.now();
  if (kept && now - kept.at < kept.ttl) return kept.value;
  running ??= load(context).then((value) => {
    kept = { at: Date.now(), ttl: value.source === 'none' ? KEEP_FAILURE_MS : KEEP_MS, value };
    return value;
  }).finally(() => { running = null; });
  return running;
}
