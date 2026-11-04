// The website's side of the status history. Every 2 minutes (server.mjs asks /api/status-check) it checks what it can judge itself and
// writes it to `status_checks` (source 'web'), then works out the daily state of the last days into `status_days`:
//  - the bot: the heartbeat the bot writes every 10 seconds (bot_status) must be fresh and Ready on every shard,
//  - the website and dashboard: its own light route and its home page, asked on this machine,
//  - the database: a real read with its time (only where the site has its own connection to it; elsewhere the bot's check is the one).
// The Discord bot writes the rest (the public address of the site, the database, itself) with source 'bot', so when one side is down the
// other still records it. A day is never green because nobody looked: see statusDays.mjs.
import { getEnv } from './env';
import { DAY_MS, RETENTION_DAYS, SLOT_MS, dayKey, dayStartOf, dayTime, slotOf, summarizeDay, type Check, type DaySummary } from './statusDays.mjs';

export const SERVICES = ['bot', 'site', 'database'] as const;
export type ServiceId = (typeof SERVICES)[number];
export const STARTED_KEY = 'status_monitoring_started_at';

const SOURCE = 'web';
/** The bot's heartbeat is written every 10 seconds (60 with a database that is struggling); older than this and the bot is not reporting. */
const HEARTBEAT_STALE_MS = 90_000;
const PROBE_TIMEOUT_MS = 6_000;
const KEEP_PENDING = 720 * 3; // a day of windows
const PAGE = 2000;

type Context = { locals?: unknown };
type Row = { slot: string; service: string; source: string; ok: boolean; latency_ms: number | null };
interface Fresh { slot: number; service: ServiceId; ok: boolean; ms: number | null; detail: string | null }

function api(context: Context) {
  const url = getEnv(context, 'PETTO_BOT_API_URL');
  const key = getEnv(context, 'PETTO_BOT_API_SECRET');
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'X-Petto-Dashboard-Key': key, Accept: 'application/json' } as Record<string, string> };
}

/** A read or a write of a table through the same path the dashboard uses (straight to PostgreSQL when the site has a connection, else the bot's API). */
export async function rest(context: Context, method: 'GET' | 'POST' | 'DELETE', path: string, body?: unknown, prefer?: string): Promise<any> {
  const target = api(context);
  if (!target) throw new Error('not configured');
  const response = await fetch(`${target.url}/rest/v1/${path}`, {
    method,
    headers: { ...target.headers, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(prefer ? { Prefer: prefer } : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`answered ${response.status}`);
  if (method !== 'GET' || response.status === 204) return null;
  return response.json();
}

async function timed(run: () => Promise<{ ok: boolean; detail?: string | null }>) {
  const started = Date.now();
  try {
    const result = await run();
    return { ok: result.ok, ms: Date.now() - started, detail: result.detail ?? null };
  } catch (error) {
    const code = (error as { cause?: { code?: string } })?.cause?.code;
    return { ok: false, ms: Date.now() - started, detail: (error as Error)?.name === 'TimeoutError' ? 'timeout' : String(code ?? 'unreachable') };
  }
}

/** The website and the dashboard: the light route (served by the app) and the home page (served from files), asked on this machine. */
export async function probeSite(origin: string) {
  const ask = async (path: string) => {
    const response = await fetch(new URL(path, origin), { redirect: 'manual', signal: AbortSignal.timeout(PROBE_TIMEOUT_MS), headers: { 'user-agent': 'petto-status-probe' } });
    return response;
  };
  return timed(async () => {
    const [health, home] = await Promise.all([ask('/api/health'), ask('/')]);
    const body: any = health.ok ? await health.json().catch(() => null) : null;
    if (!health.ok || body?.ok !== true) return { ok: false, detail: `health ${health.status}` };
    return { ok: home.status >= 200 && home.status < 400, detail: home.ok ? null : `home ${home.status}` };
  });
}

/** The bot: its heartbeat is fresh and every shard is Ready. A read that fails is the bot's API being down, unless the database is what is down. */
export async function probeBot(context: Context, now: number, databaseDown: boolean) {
  try {
    const rows: { status: string; updated_at: string; ping_ms: number | null }[] = await rest(context, 'GET', 'bot_status?select=status,updated_at,ping_ms');
    if (!Array.isArray(rows) || !rows.length) return { ok: false, ms: null, detail: 'no heartbeat' };
    const fresh = rows.filter((row) => now - new Date(row.updated_at).getTime() <= HEARTBEAT_STALE_MS);
    const ready = fresh.filter((row) => row.status === 'Ready');
    const pings = rows.map((row) => row.ping_ms).filter((ping): ping is number => typeof ping === 'number');
    const ok = ready.length === rows.length;
    return { ok, ms: pings.length ? Math.max(...pings) : null, detail: ok ? null : fresh.length < rows.length ? 'stale heartbeat' : `shards ${ready.length}/${rows.length}` };
  } catch {
    // If the database is down too, the read says nothing about the bot: the bot's own check covers it.
    return databaseDown ? null : { ok: false, ms: null, detail: 'unreachable' };
  }
}

// The Worker build leaves the database code out: the choice is made where the build can see it (a constant condition on the import itself, as in directQuery.ts).
const loadProbe = __DIRECT_DB__ ? () => import('./directDb').then((module) => module.probeDirect) : null;

async function probeDatabase() {
  if (!loadProbe) return null;
  const probeDirect = await loadProbe();
  const result = await probeDirect();
  return result.configured ? { ok: result.ok && result.ms < 4_000, ms: result.ms, detail: result.ok ? (result.ms < 4_000 ? null : 'slow') : result.detail ?? 'error' } : null;
}

// ---- Writing ----
const pending: Fresh[] = [];
let running = false;
let lastPrune = 0;
let caughtUp = false;
let startedAt: number | null = null;

const toRow = (check: Fresh) => ({ slot: new Date(check.slot).toISOString(), service: check.service, source: SOURCE, ok: check.ok, latency_ms: check.ms === null ? null : Math.round(check.ms), detail: check.detail });

async function saveChecks(context: Context, batch: Fresh[]) {
  await rest(context, 'POST', 'status_checks?on_conflict=slot,service,source', batch.map(toRow), 'resolution=merge-duplicates,return=minimal');
}

/** The first check ever, kept in bot_settings so the 100 day retention never moves it. */
export async function readStartedAt(context: Context): Promise<number | null> {
  if (startedAt !== null) return startedAt;
  const rows = await rest(context, 'GET', `bot_settings?key=eq.${STARTED_KEY}&select=value`);
  const value = Array.isArray(rows) && rows[0]?.value ? Date.parse(String(rows[0].value)) : NaN;
  if (Number.isFinite(value)) startedAt = value;
  return startedAt;
}

async function ensureStarted(context: Context): Promise<number | null> {
  const known = await readStartedAt(context);
  if (known !== null) return known;
  const first = await rest(context, 'GET', 'status_checks?select=slot&order=slot.asc&limit=1');
  const slot = Array.isArray(first) && first[0]?.slot ? Date.parse(String(first[0].slot)) : NaN;
  if (!Number.isFinite(slot)) return null;
  await rest(context, 'POST', 'bot_settings?on_conflict=key', { key: STARTED_KEY, value: new Date(slot).toISOString(), updated_at: new Date().toISOString() }, 'resolution=merge-duplicates,return=minimal');
  startedAt = slot;
  return slot;
}

/** The checks of one UTC day, read page by page (a day is at most 4,320 rows). */
async function readDay(context: Context, dayStart: number): Promise<Map<string, Check[]>> {
  const byService = new Map<string, Check[]>();
  const end = dayStart + DAY_MS;
  for (let offset = 0; offset < 20_000; offset += PAGE) {
    const rows: Row[] = await rest(context, 'GET', `status_checks?slot=gte.${encodeURIComponent(new Date(dayStart).toISOString())}&select=slot,service,source,ok,latency_ms&order=slot.asc&offset=${offset}&limit=${PAGE}`);
    if (!Array.isArray(rows)) break;
    let past = false;
    for (const row of rows) {
      const slot = Date.parse(row.slot);
      if (slot >= end) { past = true; continue; }
      const list = byService.get(row.service) ?? [];
      list.push({ slot, source: row.source, ok: row.ok, ms: row.latency_ms });
      byService.set(row.service, list);
    }
    if (rows.length < PAGE || past) break;
  }
  return byService;
}

async function judgeDay(context: Context, dayStart: number, started: number, now: number) {
  const byService = await readDay(context, dayStart);
  const out: Record<string, unknown>[] = [];
  for (const service of SERVICES) {
    const summary: DaySummary | null = summarizeDay(byService.get(service) ?? [], dayStart, started, now);
    if (!summary) continue;
    out.push({ day: dayKey(dayStart), service, state: summary.state, checks: summary.checks, failed: summary.failed, unconfirmed: summary.unconfirmed, down_minutes: summary.downMinutes, gap_minutes: summary.gapMinutes, avg_ms: summary.avgMs, max_ms: summary.maxMs, updated_at: new Date(now).toISOString() });
  }
  if (out.length) await rest(context, 'POST', 'status_days?on_conflict=day,service', out, 'resolution=merge-duplicates,return=minimal');
}

/** Today every round; yesterday during the first half hour of a day (late checks and the final state); and after a restart every day since the last one that was judged. */
async function summarize(context: Context, started: number, now: number) {
  const today = dayStartOf(now);
  const days = new Set<number>([today]);
  if (now - today < 30 * 60_000) days.add(today - DAY_MS);
  if (!caughtUp) {
    const rows = await rest(context, 'GET', 'status_days?select=day&order=day.desc&limit=1');
    const last = Array.isArray(rows) && rows[0]?.day ? dayTime(String(rows[0].day)) : started;
    const from = Math.max(dayStartOf(started), today - 95 * DAY_MS, Math.min(last, today) - DAY_MS);
    for (let day = from; day < today; day += DAY_MS) days.add(day);
  }
  for (const day of [...days].sort((a, b) => a - b)) await judgeDay(context, day, started, now);
  caughtUp = true;
}

async function prune(context: Context, now: number) {
  if (now - lastPrune < 6 * 3_600_000) return;
  lastPrune = now;
  await rest(context, 'DELETE', `status_checks?slot=lt.${encodeURIComponent(new Date(now - RETENTION_DAYS * DAY_MS).toISOString())}`);
}

/**
 * One round: check, save (what the database refused waits and goes in with the next round, with its own window), then judge the days.
 * If the database is down for a while, those checks are written when it is back; if the site is restarted meanwhile they are lost, and
 * the day shows the silence (amber or grey), never green.
 */
export async function runStatusCycle(context: Context, origin: string, now = Date.now()): Promise<{ saved: number; kept: number; skipped?: boolean }> {
  if (running) return { saved: 0, kept: pending.length, skipped: true };
  running = true;
  try {
    const slot = slotOf(now);
    const [site, database] = await Promise.all([probeSite(origin), probeDatabase()]);
    const bot = await probeBot(context, now, database !== null && !database.ok);
    const fresh: Fresh[] = [
      { slot, service: 'site', ok: site.ok, ms: site.ms, detail: site.detail },
      ...(database ? [{ slot, service: 'database' as const, ok: database.ok, ms: database.ms, detail: database.detail }] : []),
      ...(bot ? [{ slot, service: 'bot' as const, ok: bot.ok, ms: bot.ms, detail: bot.detail }] : []),
    ];
    const batch = [...pending.splice(0), ...fresh];
    try {
      await saveChecks(context, batch);
    } catch (error) {
      pending.push(...batch);
      if (pending.length > KEEP_PENDING) pending.splice(0, pending.length - KEEP_PENDING);
      console.warn(`[status] could not save the checks (${pending.length} waiting):`, (error as Error)?.message);
      return { saved: 0, kept: pending.length };
    }
    try {
      const started = await ensureStarted(context);
      if (started !== null) { await summarize(context, started, now); await prune(context, now); }
    } catch (error) {
      caughtUp = false;
      console.warn('[status] could not judge the days:', (error as Error)?.message);
    }
    return { saved: batch.length, kept: 0 };
  } finally {
    running = false;
  }
}
