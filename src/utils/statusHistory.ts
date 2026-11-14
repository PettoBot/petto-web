// The history the status page shows: the 90 UTC days of each service and what each one is doing now, from status_days (one small row per
// day and service) and the last few windows of status_checks. Kept 60 seconds in memory and shared by everyone who asks at once, so a
// visitor never makes the database work. The rules are in statusDays.mjs.
import { DAYS_SHOWN, SLOT_MS, applyNotes, currentState, dayKey, dayMarkers, dayTime, lastDays, type Check } from './statusDays.mjs';
import notes from '../data/statusIncidents.json';
import { SERVICES, STARTED_KEY, rest, type ServiceId } from './statusMonitor';

export type ServiceNow = 'up' | 'degraded' | 'down' | 'unknown';
export interface Marker { d: string; s: 'pre' | 'up' | 'warn' | 'down' | 'nodata'; c?: number; dm?: number; um?: number; gm?: number }
export interface ServiceHistory { id: ServiceId; now: ServiceNow; ms: number | null; lastAt: string | null; marks: Marker[] }
export interface Incident { day: string; service: ServiceId; kind: 'down' | 'warn' | 'nodata'; minutes: number; unconfirmed: number; /** What the team wrote about an outage that was noted by hand, in each language. */ note?: Record<string, string> }
export interface StatusHistory {
  /** false when the history could not be read: the page then says so and shows nothing as green. */
  available: boolean;
  generatedAt: string;
  /** The first check ever (ISO), or null before there is one. */
  startedAt: string | null;
  days: string[];
  services: ServiceHistory[];
  incidents: Incident[];
}

const KEEP_MS = 60_000;
const KEEP_FAILURE_MS = 15_000;
let kept: { at: number; value: StatusHistory } | null = null;
let running: Promise<StatusHistory> | null = null;
type Context = { locals?: unknown };

function empty(now: number, available: boolean): StatusHistory {
  const days = lastDays(now, DAYS_SHOWN);
  return { available, generatedAt: new Date(now).toISOString(), startedAt: null, days, services: SERVICES.map((id) => ({ id, now: 'unknown', ms: null, lastAt: null, marks: dayMarkers(days, new Map(), null, now).map((mark) => (available ? mark : { d: mark.d, s: 'nodata' as const })) })), incidents: [] };
}

async function load(context: Context): Promise<StatusHistory> {
  const now = Date.now();
  const days = lastDays(now, DAYS_SHOWN);
  try {
    const [startRows, dayRows, recentRows] = await Promise.all([
      rest(context, 'GET', `bot_settings?key=eq.${STARTED_KEY}&select=value`),
      rest(context, 'GET', `status_days?day=gte.${days[0]}&select=day,service,state,checks,unconfirmed,down_minutes,gap_minutes&order=day.asc&limit=1000`),
      rest(context, 'GET', `status_checks?slot=gte.${encodeURIComponent(new Date(now - 20 * 60_000).toISOString())}&select=slot,service,source,ok,latency_ms&order=slot.desc&limit=240`),
    ]);
    if (!Array.isArray(startRows) || !Array.isArray(dayRows) || !Array.isArray(recentRows)) throw new Error('unreadable');
    let started = startRows[0]?.value ? Date.parse(String(startRows[0].value)) : NaN;
    // Without the saved date, the first judged day is the best that is known.
    if (!Number.isFinite(started) && dayRows.length) started = dayTime(String(dayRows[0].day));
    const startedAt = Number.isFinite(started) ? started : null;

    const incidents: Incident[] = [];
    const services: ServiceHistory[] = SERVICES.map((id) => {
      const rows = new Map<string, { state: any; checks: number; downMinutes: number; unconfirmed: number; gapMinutes: number }>();
      for (const row of dayRows) if (row.service === id) rows.set(String(row.day).slice(0, 10), { state: row.state, checks: row.checks, downMinutes: row.down_minutes, unconfirmed: row.unconfirmed, gapMinutes: row.gap_minutes });
      const marks = applyNotes(dayMarkers(days, rows, startedAt, now), id, notes) as Marker[];
      for (const mark of marks) {
        if (mark.s === 'down') {
          const note = (notes as { day: string; services: string[]; note?: Record<string, string> }[]).find((entry) => entry.day === mark.d && entry.services.includes(id))?.note;
          incidents.push({ day: mark.d, service: id, kind: 'down', minutes: mark.dm ?? 0, unconfirmed: mark.um ?? 0, ...(note ? { note } : {}) });
        }
        else if (mark.s === 'warn') incidents.push({ day: mark.d, service: id, kind: 'warn', minutes: mark.gm ?? 0, unconfirmed: mark.um ?? 0 });
        else if (mark.s === 'nodata') incidents.push({ day: mark.d, service: id, kind: 'nodata', minutes: 0, unconfirmed: 0 });
      }
      const recent: Check[] = recentRows.filter((row: any) => row.service === id).map((row: any) => ({ slot: Date.parse(row.slot), source: row.source, ok: row.ok, ms: row.latency_ms }));
      const current = currentState(recent, now);
      return { id, now: current.state, ms: current.ms, lastAt: current.lastSlot === null ? null : new Date(current.lastSlot).toISOString(), marks };
    });
    incidents.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0));
    return { available: true, generatedAt: new Date(now).toISOString(), startedAt: startedAt === null ? null : new Date(startedAt).toISOString(), days, services, incidents: incidents.slice(0, 120) };
  } catch {
    return empty(now, false);
  }
}

export function getStatusHistory(context: Context): Promise<StatusHistory> {
  if (kept && Date.now() - kept.at < (kept.value.available ? KEEP_MS : KEEP_FAILURE_MS)) return Promise.resolve(kept.value);
  if (!running) running = load(context).then((value) => { kept = { at: Date.now(), value }; return value; }).finally(() => { running = null; });
  return running;
}

/** The day the checks started, for the note under the bars ("2026-11-03"), or null. */
export const startedDay = (history: StatusHistory) => (history.startedAt ? dayKey(Date.parse(history.startedAt)) : null);
export const SLOT_MINUTES = SLOT_MS / 60_000;
