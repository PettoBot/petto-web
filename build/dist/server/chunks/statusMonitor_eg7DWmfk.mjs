import { g as getEnv } from './env_WnBvzCjc.mjs';

// How the status page turns checks into the state of a day. Pure functions (no network, no database), so the same rules run in the
// website, in the check (`node scripts/check-status-days.mjs`) and in the mockups.
//
// A check is one row { slot, service, source, ok, ms }: `slot` is the start (ms) of a 2 minute window, `source` is who made it ('bot' is the
// Discord bot's process, 'web' is the website) and a window can hold one row per source. For one service and one window:
//  - no row                          -> missing
//  - every row failed                -> failed; it is CONFIRMED when two sources failed, or when it is one of 2 or more failed windows in a row
//  - some rows failed, some were ok  -> mixed (the sources disagree): unconfirmed
//  - every row was ok                -> ok
// A day (UTC) is judged on the windows that could have been checked (from the first check ever, until the last window that is over):
//  - red   ('down')   at least one confirmed failure (so 2 failed checks in a row, 4 minutes or more, or two places seeing it fail)
//  - amber ('warn')   failed or mixed checks that nobody confirmed, when there are 3 or more of them in the day (6 minutes; one or two are a blip, such as a deploy,
//                     and leave the day green), or 6 minutes or more in a row with no check at all
//  - grey  ('nodata') fewer than a quarter of the windows have any check (nothing was watching)
//  - green ('up')     otherwise
// Days before the first check ever are not judged at all ('pre'); the page shows them as green and says they were not measured.
// A restart of the website (a deploy) is forgiven: the website writes down each time it starts, and the windows of the SITE between its last good
// check and that start are left out of the judgement (neither failed nor missing) when that took 10 minutes or less (see `restartSlots`).

const SLOT_MS = 2 * 60_000;
const DAY_MS = 86_400_000;
const DAYS_SHOWN = 90;
/** A run of this many windows with no check at all (6 minutes) is a gap worth showing. */
const GAP_SLOTS = 3;
/** Failed or mixed checks that nobody confirmed turn a day amber from this many windows (6 minutes) on: fewer are a blip (a deploy, a network hiccup), not news. */
const UNCONFIRMED_WARN_SLOTS = 3;
/** A website that was down for this long or less before it started again was restarted (a deploy), not broken: those windows are not judged. */
const RESTART_FORGIVE_MS = 10 * 60_000;
/** Under this share (a quarter) of the windows with a check, the day has no data. */
const MIN_COVERAGE = 0.25;
/** How long a check stays in the database. */
const RETENTION_DAYS = 100;

const slotOf = (time) => Math.floor(time / SLOT_MS) * SLOT_MS;
const dayStartOf = (time) => Math.floor(time / DAY_MS) * DAY_MS;
const dayKey = (time) => new Date(time).toISOString().slice(0, 10);
const dayTime = (key) => Date.parse(`${key}T00:00:00.000Z`);

/**
 * The windows of the site that a restart explains. `siteChecks` are the checks of the service `site` (any source, any day), `restarts` the moments (ms) the
 * website started. For each restart: the windows after the last good one (every row ok) up to the window the restart is in, those that are not good, when
 * the website was away `RESTART_FORGIVE_MS` or less. A restart with no good check before it forgives only its own window. Returns a Set of window starts.
 * @param {Check[]} siteChecks @param {number[]} restarts @returns {Set<number>}
 */
function restartSlots(siteChecks, restarts) {
  const bySlot = new Map();
  for (const check of siteChecks) { const list = bySlot.get(check.slot) ?? []; list.push(check); bySlot.set(check.slot, list); }
  const good = (slot) => { const rows = bySlot.get(slot); return Boolean(rows?.length) && rows.every((entry) => entry.ok); };
  const goodSlots = [...bySlot.keys()].filter(good).sort((a, b) => a - b);
  const out = new Set();
  for (const at of restarts) {
    if (!Number.isFinite(at)) continue;
    const boot = slotOf(at);
    let lastGood = null;
    for (const slot of goodSlots) { if (slot < boot) lastGood = slot; else break; }
    const start = lastGood === null ? boot : lastGood + SLOT_MS;
    if (at - start > RESTART_FORGIVE_MS) continue; // it was away for too long: that is an outage, not a restart
    for (let slot = start; slot <= boot; slot += SLOT_MS) if (!good(slot)) out.add(slot);
  }
  return out;
}

/** @typedef {{ slot: number, source: string, ok: boolean, ms?: number | null }} Check */
/** @typedef {'up' | 'warn' | 'down' | 'nodata'} DayState */
/** @typedef {{ state: DayState, checks: number, failed: number, unconfirmed: number, downMinutes: number, gapMinutes: number, avgMs: number | null, maxMs: number | null }} DaySummary */

/**
 * The state of one service on one UTC day.
 * @param {Check[]} checks the checks of that service whose slot is in the day (others are ignored)
 * @param {number} dayStart start of the UTC day (ms)
 * @param {number} monitoringStart the first check ever (ms)
 * @param {number} now (ms)
 * @param {Set<number>} [excused] windows that a restart explains (`restartSlots`): left out, neither failed nor missing nor expected
 * @returns {DaySummary | null} null when there is nothing to judge (the day is before the first check or has not started)
 */
function summarizeDay(checks, dayStart, monitoringStart, now, excused = new Set()) {
  const first = Math.max(dayStart, slotOf(monitoringStart));
  // The window that is still going is not judged yet; one that already has a check counts.
  const last = Math.min(dayStart + DAY_MS - SLOT_MS, slotOf(now) - SLOT_MS);
  const bySlot = new Map();
  for (const check of checks) {
    if (check.slot < dayStart || check.slot >= dayStart + DAY_MS) continue;
    const list = bySlot.get(check.slot) ?? [];
    list.push(check);
    bySlot.set(check.slot, list);
  }
  const lastObserved = Math.max(-Infinity, ...bySlot.keys());
  const end = Math.max(last, Math.min(lastObserved, dayStart + DAY_MS - SLOT_MS));
  if (!(end >= first)) return null;

  let observed = 0; let failed = 0; let unconfirmed = 0; let confirmedSlots = 0; let gapSlots = 0;
 let runSlots = []; let missingRun = 0;
  const latencies = [];
  const closeFailRun = () => {
    if (!runSlots.length) return;
    // Two failed windows in a row confirm each other; a single one is confirmed only when two sources saw it.
    for (const entry of runSlots) {
      if (runSlots.length >= 2 || entry.sources >= 2) confirmedSlots += 1; else unconfirmed += 1;
    }
    runSlots = [];  };
  const closeMissing = () => { if (missingRun >= GAP_SLOTS) gapSlots += missingRun; missingRun = 0; };

  let excusedCount = 0;
  for (let slot = first; slot <= end; slot += SLOT_MS) {
    if (excused.has(slot)) { excusedCount += 1; closeFailRun(); closeMissing(); continue; }
    const rows = bySlot.get(slot);
    if (!rows) { closeFailRun(); missingRun += 1; continue; }
    closeMissing();
    observed += 1;
    for (const row of rows) if (row.ok && Number.isFinite(row.ms)) latencies.push(Number(row.ms));
    const bad = rows.filter((row) => !row.ok);
    if (bad.length === 0) { closeFailRun(); continue; }
    failed += 1;
    if (bad.length < rows.length) { closeFailRun(); unconfirmed += 1; continue; } // mixed: the sources disagree
    runSlots.push({ sources: new Set(bad.map((row) => row.source)).size });
  }
  closeFailRun(); closeMissing();

  const expected = Math.max(1, Math.round((end - first) / SLOT_MS) + 1 - excusedCount);
  const downMinutes = confirmedSlots * (SLOT_MS / 60_000);
  const gapMinutes = gapSlots * (SLOT_MS / 60_000);
  /** @type {DayState} */
  let state = 'up';
  if (observed / expected < MIN_COVERAGE) state = 'nodata';
  else if (confirmedSlots > 0) state = 'down';
  else if (unconfirmed >= UNCONFIRMED_WARN_SLOTS || gapSlots > 0) state = 'warn';
  const avgMs = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : null;
  return { state, checks: observed, failed, unconfirmed, downMinutes, gapMinutes, avgMs, maxMs: latencies.length ? Math.max(...latencies) : null };
}

/**
 * What a service is doing now, from its latest checks (any day).
 * @param {Check[]} recent the newest checks of the service (a few windows are enough)
 * @param {number} now
 * @returns {{ state: 'up' | 'degraded' | 'down' | 'unknown', lastSlot: number | null, ms: number | null }}
 */
function currentState(recent, now) {
  const bySlot = new Map();
  for (const check of recent) { const list = bySlot.get(check.slot) ?? []; list.push(check); bySlot.set(check.slot, list); }
  const slots = [...bySlot.keys()].sort((a, b) => b - a);
  // No check in the last 3 windows (6 minutes): nobody is watching right now, so nothing is said.
  if (!slots.length || slotOf(now) - slots[0] > SLOT_MS * 2) return { state: 'unknown', lastSlot: slots[0] ?? null, ms: null };
  const failedAt = (slot) => bySlot.get(slot).every((row) => !row.ok);
  const someFailedAt = (slot) => bySlot.get(slot).some((row) => !row.ok);
  const newest = slots[0];
  const previous = slots.find((slot) => slot < newest && newest - slot <= SLOT_MS);
  const ms = bySlot.get(newest).map((row) => row.ms).filter((value) => Number.isFinite(value))[0] ?? null;
  const sources = (slot) => new Set(bySlot.get(slot).filter((row) => !row.ok).map((row) => row.source)).size;
  if (failedAt(newest) && ((previous !== undefined && failedAt(previous)) || sources(newest) >= 2)) return { state: 'down', lastSlot: newest, ms };
  if (someFailedAt(newest)) return { state: 'degraded', lastSlot: newest, ms };
  // The newest window is fine; if the one before it failed, that was a blip that is over.
  return { state: 'up', lastSlot: newest, ms };
}

/**
 * Outages that nothing could write down (the hosting was in maintenance, so the bot, its database and the places the checks are saved were all away) and that the team
 * wrote by hand in src/data/statusIncidents.json: { day: 'YYYY-MM-DD' (UTC), services: ['bot', ...], minutes: N }. They turn the day of each listed service red ('down') with at
 * least those minutes, never the other way (a day that is already red keeps its own minutes if they are more). Pure: returns new markers.
 * @param {{ d: string, s: string, c?: number, dm?: number, um?: number, gm?: number }[]} marks the markers of ONE service
 * @param {string} service @param {{ day: string, services: string[], minutes: number }[]} notes
 */
function applyNotes(marks, service, notes) {
  return marks.map((mark) => {
    const note = notes.find((entry) => entry.day === mark.d && Array.isArray(entry.services) && entry.services.includes(service) && Number.isFinite(entry.minutes) && entry.minutes > 0);
    if (!note || mark.s === 'pre') return mark;
    return { ...mark, s: 'down', dm: Math.max(mark.dm ?? 0, Math.round(note.minutes)) };
  });
}

/**
 * The last days with what happened on each, newest first, like the "Past incidents" of Discord Status: every day is listed, and a day with nothing is there to say so.
 * Days before the first check are not listed (nothing was measured then, so "no incidents" would be a promise nobody checked). Nothing at all before the first check.
 * @param {string[]} days the UTC day keys, oldest first, ending today @param {{ day: string }[]} incidents @param {string | null} startedKey the first measured day or null
 * @param {number} [count] how many days @returns {{ day: string, today: boolean, incidents: any[] }[]}
 */
function incidentDays(days, incidents, startedKey, count = 14) {
  const out = [];
  if (!startedKey || !days.length) return out;
  const today = days[days.length - 1];
  for (let index = days.length - 1; index >= 0 && out.length < count; index -= 1) {
    const day = days[index];
    if (day < startedKey) break;
    out.push({ day, today: day === today, incidents: incidents.filter((incident) => incident.day === day) });
  }
  return out;
}

/** The 90 day keys, oldest first, ending today (UTC). */
function lastDays(now, count = DAYS_SHOWN) {
  const today = dayStartOf(now);
  return Array.from({ length: count }, (_, index) => dayKey(today - (count - 1 - index) * DAY_MS));
}

/**
 * The marker of each day for one service: the rows of status_days by day, and the first check ever.
 * A day before the first check is 'pre' (the page shows it as green and says it was not measured); a measured day with no row is grey.
 * @param {string[]} days @param {Map<string, { state: DayState } & Partial<DaySummary>>} rows @param {number | null} startedAt
 */
function dayMarkers(days, rows, startedAt, now = Date.now()) {
  const today = dayKey(now);
  return days.map((day) => {
    if (startedAt === null || dayTime(day) + DAY_MS <= slotOf(startedAt)) return { d: day, s: 'pre' };
    const row = rows.get(day);
    if (row) return { d: day, s: row.state, c: row.checks ?? 0, dm: row.downMinutes ?? 0, um: row.unconfirmed ?? 0, gm: row.gapMinutes ?? 0 };
    // A day with no summary: nothing has judged it yet when it is today, otherwise nobody was watching.
    return { d: day, s: day === today ? 'up' : 'nodata', c: 0, dm: 0, um: 0, gm: 0 };
  });
}

const SERVICES = ["bot", "site", "database"];
const STARTED_KEY = "status_monitoring_started_at";
const RESTARTS_KEY = "status_web_restarts";
const MAX_RESTARTS = 60;
const BOOT_AT = Date.now();
const SOURCE = "web";
const HEARTBEAT_STALE_MS = 9e4;
const PROBE_TIMEOUT_MS = 6e3;
const KEEP_PENDING = 720 * 3;
const PAGE = 2e3;
function api(context) {
  const url = getEnv(context, "PETTO_BOT_API_URL");
  const key = getEnv(context, "PETTO_BOT_API_SECRET");
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}`, "X-Petto-Dashboard-Key": key, Accept: "application/json" } };
}
async function rest(context, method, path, body, prefer) {
  const target = api(context);
  if (!target) throw new Error("not configured");
  const response = await fetch(`${target.url}/rest/v1/${path}`, {
    method,
    headers: { ...target.headers, ...body !== void 0 ? { "Content-Type": "application/json" } : {}, ...prefer ? { Prefer: prefer } : {} },
    body: body !== void 0 ? JSON.stringify(body) : void 0,
    signal: AbortSignal.timeout(8e3)
  });
  if (!response.ok) throw new Error(`answered ${response.status}`);
  if (method !== "GET" || response.status === 204) return null;
  return response.json();
}
async function timed(run) {
  const started = Date.now();
  try {
    const result = await run();
    return { ok: result.ok, ms: Date.now() - started, detail: result.detail ?? null };
  } catch (error) {
    const code = error?.cause?.code;
    return { ok: false, ms: Date.now() - started, detail: error?.name === "TimeoutError" ? "timeout" : String(code ?? "unreachable") };
  }
}
async function probeSite(origin) {
  const ask = async (path) => {
    const response = await fetch(new URL(path, origin), { redirect: "manual", signal: AbortSignal.timeout(PROBE_TIMEOUT_MS), headers: { "user-agent": "petto-status-probe" } });
    return response;
  };
  return timed(async () => {
    const [health, home] = await Promise.all([ask("/api/health"), ask("/")]);
    const body = health.ok ? await health.json().catch(() => null) : null;
    if (!health.ok || body?.ok !== true) return { ok: false, detail: `health ${health.status}` };
    return { ok: home.status >= 200 && home.status < 400, detail: home.ok ? null : `home ${home.status}` };
  });
}
async function probeBot(context, now, databaseDown) {
  try {
    const rows = await rest(context, "GET", "bot_status?select=status,updated_at,ping_ms");
    if (!Array.isArray(rows) || !rows.length) return { ok: false, ms: null, detail: "no heartbeat" };
    const fresh = rows.filter((row) => now - new Date(row.updated_at).getTime() <= HEARTBEAT_STALE_MS);
    const ready = fresh.filter((row) => row.status === "Ready");
    const pings = rows.map((row) => row.ping_ms).filter((ping) => typeof ping === "number");
    const ok = ready.length === rows.length;
    return { ok, ms: pings.length ? Math.max(...pings) : null, detail: ok ? null : fresh.length < rows.length ? "stale heartbeat" : `shards ${ready.length}/${rows.length}` };
  } catch {
    return databaseDown ? null : { ok: false, ms: null, detail: "unreachable" };
  }
}
const loadProbe = () => import('./directDb_B7F6zYNj.mjs').then((module) => module.probeDirect) ;
async function probeDatabase() {
  if (!loadProbe) return null;
  const probeDirect = await loadProbe();
  const result = await probeDirect();
  return result.configured ? { ok: result.ok && result.ms < 4e3, ms: result.ms, detail: result.ok ? result.ms < 4e3 ? null : "slow" : result.detail ?? "error" } : null;
}
const pending = [];
let running = false;
let lastPrune = 0;
let caughtUp = false;
let startedAt = null;
let restartWritten = false;
const toRow = (check) => ({ slot: new Date(check.slot).toISOString(), service: check.service, source: SOURCE, ok: check.ok, latency_ms: check.ms === null ? null : Math.round(check.ms), detail: check.detail });
async function saveChecks(context, batch) {
  await rest(context, "POST", "status_checks?on_conflict=slot,service,source", batch.map(toRow), "resolution=merge-duplicates,return=minimal");
}
async function readStartedAt(context) {
  if (startedAt !== null) return startedAt;
  const rows = await rest(context, "GET", `bot_settings?key=eq.${STARTED_KEY}&select=value`);
  const value = Array.isArray(rows) && rows[0]?.value ? Date.parse(String(rows[0].value)) : NaN;
  if (Number.isFinite(value)) startedAt = value;
  return startedAt;
}
async function ensureStarted(context) {
  const known = await readStartedAt(context);
  if (known !== null) return known;
  const first = await rest(context, "GET", "status_checks?select=slot&order=slot.asc&limit=1");
  const slot = Array.isArray(first) && first[0]?.slot ? Date.parse(String(first[0].slot)) : NaN;
  if (!Number.isFinite(slot)) return null;
  await rest(context, "POST", "bot_settings?on_conflict=key", { key: STARTED_KEY, value: new Date(slot).toISOString(), updated_at: (/* @__PURE__ */ new Date()).toISOString() }, "resolution=merge-duplicates,return=minimal");
  startedAt = slot;
  return slot;
}
async function readDay(context, dayStart) {
  const byService = /* @__PURE__ */ new Map();
  const end = dayStart + DAY_MS;
  for (let offset = 0; offset < 2e4; offset += PAGE) {
    const rows = await rest(context, "GET", `status_checks?slot=gte.${encodeURIComponent(new Date(dayStart).toISOString())}&select=slot,service,source,ok,latency_ms&order=slot.asc&offset=${offset}&limit=${PAGE}`);
    if (!Array.isArray(rows)) break;
    let past = false;
    for (const row of rows) {
      const slot = Date.parse(row.slot);
      if (slot >= end) {
        past = true;
        continue;
      }
      const list = byService.get(row.service) ?? [];
      list.push({ slot, source: row.source, ok: row.ok, ms: row.latency_ms });
      byService.set(row.service, list);
    }
    if (rows.length < PAGE || past) break;
  }
  return byService;
}
async function readRestarts(context) {
  try {
    const rows = await rest(context, "GET", `bot_settings?key=eq.${RESTARTS_KEY}&select=value`);
    const parsed = rows?.[0]?.value ? JSON.parse(String(rows[0].value)) : [];
    return Array.isArray(parsed) ? parsed.map((entry) => Date.parse(String(entry))).filter((time) => Number.isFinite(time)) : [];
  } catch {
    return [];
  }
}
async function recordRestart(context, now = Date.now(), bootAt = BOOT_AT) {
  if (restartWritten) return;
  try {
    const known = await readRestarts(context);
    const iso = new Date(bootAt).toISOString();
    const kept = known.filter((time) => now - time <= RETENTION_DAYS * DAY_MS && time !== bootAt).map((time) => new Date(time).toISOString());
    const next = [...kept, iso].slice(-MAX_RESTARTS);
    await rest(context, "POST", "bot_settings?on_conflict=key", { key: RESTARTS_KEY, value: JSON.stringify(next), updated_at: new Date(now).toISOString() }, "resolution=merge-duplicates,return=minimal");
    restartWritten = true;
  } catch (error) {
    console.warn("[status] could not write down the restart:", error?.message);
  }
}
async function judgeDay(context, dayStart, started, now, restarts) {
  const byService = await readDay(context, dayStart);
  const out = [];
  for (const service of SERVICES) {
    const checks = byService.get(service) ?? [];
    const nearby = restarts.filter((time) => time >= dayStart - SLOT_MS && time < dayStart + DAY_MS + SLOT_MS);
    const excused = service === "site" && nearby.length ? restartSlots(checks, nearby) : void 0;
    const summary = summarizeDay(checks, dayStart, started, now, excused);
    if (!summary) continue;
    out.push({ day: dayKey(dayStart), service, state: summary.state, checks: summary.checks, failed: summary.failed, unconfirmed: summary.unconfirmed, down_minutes: summary.downMinutes, gap_minutes: summary.gapMinutes, avg_ms: summary.avgMs, max_ms: summary.maxMs, updated_at: new Date(now).toISOString() });
  }
  if (out.length) await rest(context, "POST", "status_days?on_conflict=day,service", out, "resolution=merge-duplicates,return=minimal");
}
async function summarize(context, started, now) {
  const restarts = await readRestarts(context);
  const today = dayStartOf(now);
  const days = /* @__PURE__ */ new Set([today]);
  if (now - today < 30 * 6e4) days.add(today - DAY_MS);
  if (!caughtUp) {
    const rows = await rest(context, "GET", "status_days?select=day&order=day.desc&limit=1");
    const last = Array.isArray(rows) && rows[0]?.day ? dayTime(String(rows[0].day)) : started;
    const from = Math.max(dayStartOf(started), today - 95 * DAY_MS, Math.min(last, today) - DAY_MS);
    for (let day = from; day < today; day += DAY_MS) days.add(day);
  }
  for (const day of [...days].sort((a, b) => a - b)) await judgeDay(context, day, started, now, restarts);
  caughtUp = true;
}
async function prune(context, now) {
  if (now - lastPrune < 6 * 36e5) return;
  lastPrune = now;
  await rest(context, "DELETE", `status_checks?slot=lt.${encodeURIComponent(new Date(now - RETENTION_DAYS * DAY_MS).toISOString())}`);
}
async function runStatusCycle(context, origin, now = Date.now()) {
  if (running) return { saved: 0, kept: pending.length, skipped: true };
  running = true;
  try {
    const slot = slotOf(now);
    const [site, database] = await Promise.all([probeSite(origin), probeDatabase()]);
    const bot = await probeBot(context, now, database !== null && !database.ok);
    const fresh = [
      { slot, service: "site", ok: site.ok, ms: site.ms, detail: site.detail },
      ...database ? [{ slot, service: "database", ok: database.ok, ms: database.ms, detail: database.detail }] : [],
      ...bot ? [{ slot, service: "bot", ok: bot.ok, ms: bot.ms, detail: bot.detail }] : []
    ];
    const batch = [...pending.splice(0), ...fresh];
    try {
      await saveChecks(context, batch);
    } catch (error) {
      pending.push(...batch);
      if (pending.length > KEEP_PENDING) pending.splice(0, pending.length - KEEP_PENDING);
      console.warn(`[status] could not save the checks (${pending.length} waiting):`, error?.message);
      return { saved: 0, kept: pending.length };
    }
    await recordRestart(context, now);
    try {
      const started = await ensureStarted(context);
      if (started !== null) {
        await summarize(context, started, now);
        await prune(context, now);
      }
    } catch (error) {
      caughtUp = false;
      console.warn("[status] could not judge the days:", error?.message);
    }
    return { saved: batch.length, kept: 0 };
  } finally {
    running = false;
  }
}

export { DAYS_SHOWN as D, STARTED_KEY as S, rest as a, dayTime as b, SERVICES as c, dayKey as d, applyNotes as e, dayMarkers as f, currentState as g, incidentDays as i, lastDays as l, runStatusCycle as r };
