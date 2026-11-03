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
//  - amber ('warn')   a failed or mixed check that nobody confirmed, or 6 minutes or more in a row with no check at all
//  - grey  ('nodata') fewer than a quarter of the windows have any check (nothing was watching)
//  - green ('up')     otherwise
// Days before the first check ever are not judged at all ('pre'); the page shows them as green and says they were not measured.

export const SLOT_MS = 2 * 60_000;
export const DAY_MS = 86_400_000;
export const DAYS_SHOWN = 90;
/** A run of this many windows with no check at all (6 minutes) is a gap worth showing. */
export const GAP_SLOTS = 3;
/** Under this share (a quarter) of the windows with a check, the day has no data. */
export const MIN_COVERAGE = 0.25;
/** How long a check stays in the database. */
export const RETENTION_DAYS = 100;

export const slotOf = (time) => Math.floor(time / SLOT_MS) * SLOT_MS;
export const dayStartOf = (time) => Math.floor(time / DAY_MS) * DAY_MS;
export const dayKey = (time) => new Date(time).toISOString().slice(0, 10);
export const dayTime = (key) => Date.parse(`${key}T00:00:00.000Z`);

/** @typedef {{ slot: number, source: string, ok: boolean, ms?: number | null }} Check */
/** @typedef {'up' | 'warn' | 'down' | 'nodata'} DayState */
/** @typedef {{ state: DayState, checks: number, failed: number, unconfirmed: number, downMinutes: number, gapMinutes: number, avgMs: number | null, maxMs: number | null }} DaySummary */

/**
 * The state of one service on one UTC day.
 * @param {Check[]} checks the checks of that service whose slot is in the day (others are ignored)
 * @param {number} dayStart start of the UTC day (ms)
 * @param {number} monitoringStart the first check ever (ms)
 * @param {number} now (ms)
 * @returns {DaySummary | null} null when there is nothing to judge (the day is before the first check or has not started)
 */
export function summarizeDay(checks, dayStart, monitoringStart, now) {
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
  let run = 0; let runSlots = []; let missingRun = 0;
  const latencies = [];
  const closeFailRun = () => {
    if (!runSlots.length) return;
    // Two failed windows in a row confirm each other; a single one is confirmed only when two sources saw it.
    for (const entry of runSlots) {
      if (runSlots.length >= 2 || entry.sources >= 2) confirmedSlots += 1; else unconfirmed += 1;
    }
    runSlots = []; run = 0;
  };
  const closeMissing = () => { if (missingRun >= GAP_SLOTS) gapSlots += missingRun; missingRun = 0; };

  for (let slot = first; slot <= end; slot += SLOT_MS) {
    const rows = bySlot.get(slot);
    if (!rows) { closeFailRun(); missingRun += 1; continue; }
    closeMissing();
    observed += 1;
    for (const row of rows) if (row.ok && Number.isFinite(row.ms)) latencies.push(Number(row.ms));
    const bad = rows.filter((row) => !row.ok);
    if (bad.length === 0) { closeFailRun(); continue; }
    failed += 1;
    if (bad.length < rows.length) { closeFailRun(); unconfirmed += 1; continue; } // mixed: the sources disagree
    run += 1;
    runSlots.push({ sources: new Set(bad.map((row) => row.source)).size });
  }
  closeFailRun(); closeMissing();

  const expected = Math.round((end - first) / SLOT_MS) + 1;
  const downMinutes = confirmedSlots * (SLOT_MS / 60_000);
  const gapMinutes = gapSlots * (SLOT_MS / 60_000);
  /** @type {DayState} */
  let state = 'up';
  if (observed / expected < MIN_COVERAGE) state = 'nodata';
  else if (confirmedSlots > 0) state = 'down';
  else if (unconfirmed > 0 || gapSlots > 0) state = 'warn';
  const avgMs = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : null;
  return { state, checks: observed, failed, unconfirmed, downMinutes, gapMinutes, avgMs, maxMs: latencies.length ? Math.max(...latencies) : null };
}

/**
 * What a service is doing now, from its latest checks (any day).
 * @param {Check[]} recent the newest checks of the service (a few windows are enough)
 * @param {number} now
 * @returns {{ state: 'up' | 'degraded' | 'down' | 'unknown', lastSlot: number | null, ms: number | null }}
 */
export function currentState(recent, now) {
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

/** The 90 day keys, oldest first, ending today (UTC). */
export function lastDays(now, count = DAYS_SHOWN) {
  const today = dayStartOf(now);
  return Array.from({ length: count }, (_, index) => dayKey(today - (count - 1 - index) * DAY_MS));
}

/**
 * The marker of each day for one service: the rows of status_days by day, and the first check ever.
 * A day before the first check is 'pre' (the page shows it as green and says it was not measured); a measured day with no row is grey.
 * @param {string[]} days @param {Map<string, { state: DayState } & Partial<DaySummary>>} rows @param {number | null} startedAt
 */
export function dayMarkers(days, rows, startedAt, now = Date.now()) {
  const today = dayKey(now);
  return days.map((day) => {
    if (startedAt === null || dayTime(day) + DAY_MS <= slotOf(startedAt)) return { d: day, s: 'pre' };
    const row = rows.get(day);
    if (row) return { d: day, s: row.state, c: row.checks ?? 0, dm: row.downMinutes ?? 0, um: row.unconfirmed ?? 0, gm: row.gapMinutes ?? 0 };
    // A day with no summary: nothing has judged it yet when it is today, otherwise nobody was watching.
    return { d: day, s: day === today ? 'up' : 'nodata', c: 0, dm: 0, um: 0, gm: 0 };
  });
}
