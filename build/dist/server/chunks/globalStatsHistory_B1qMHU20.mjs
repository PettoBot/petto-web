import { g as getEnv } from './env_WnBvzCjc.mjs';
import { d as directQuery } from './directQuery_DHNRMYtJ.mjs';
import { n as normalizeHistory, M as MAX_HISTORY_DAYS } from './globalStatsMath_L1osmDju.mjs';
import { b as botDay } from './statsCore_h_kq9w3r.mjs';

const KEEP_MS = 5 * 6e4;
const KEEP_FAILURE_MS = 3e4;
let kept = null;
let running = null;
async function readSaved(context) {
  const url = getEnv(context, "PETTO_BOT_API_URL");
  const key = getEnv(context, "PETTO_BOT_API_SECRET");
  if (!url || !key) return null;
  const response = await fetch(`${url}/rest/v1/global_stats?id=eq.history&select=data`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, "X-Petto-Dashboard-Key": key, Accept: "application/json" },
    signal: AbortSignal.timeout(6e3)
  });
  if (!response.ok) return null;
  const rows = await response.json();
  const days = normalizeHistory(Array.isArray(rows) ? rows[0]?.data : null);
  return days.length ? days : null;
}
async function readActivity() {
  if (!directQuery) return null;
  const since = botDay(Date.now() - (MAX_HISTORY_DAYS - 1) * 864e5);
  const rows = await directQuery(
    `SELECT to_char("day", 'YYYY-MM-DD') AS "day", SUM("messages")::bigint AS "messages", SUM("reactions")::bigint AS "reactions", SUM("voice_seconds")::bigint AS "voice" FROM "public"."activity_stats" WHERE "day" >= $1::date GROUP BY "day" ORDER BY "day"`,
    [since]
  );
  if (!rows) return null;
  const days = normalizeHistory(rows.map((row) => ({ day: row.day, messages: row.messages, reactions: row.reactions, voiceSeconds: row.voice })));
  return days.length ? days : null;
}
async function load(context) {
  try {
    const saved = await readSaved(context);
    if (saved) return { days: saved, source: "saved" };
  } catch {
  }
  try {
    const activity = await readActivity();
    if (activity) return { days: activity, source: "activity" };
  } catch {
  }
  return { days: [], source: "none" };
}
async function loadGlobalHistory(context) {
  const now = Date.now();
  if (kept && now - kept.at < kept.ttl) return kept.value;
  running ??= load(context).then((value) => {
    kept = { at: Date.now(), ttl: value.source === "none" ? KEEP_FAILURE_MS : KEEP_MS, value };
    return value;
  }).finally(() => {
    running = null;
  });
  return running;
}

export { loadGlobalHistory as l };
