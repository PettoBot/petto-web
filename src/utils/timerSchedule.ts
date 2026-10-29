// Timers that post at a time of day (Automation → Timers): every day, or every week on one weekday, at HH:MM in a time zone. The bot
// works the same way (src/utils/timerSchedule.js of petto-bot) and checks these fields again when they are written; the next run is
// worked out here too, so the list is right before the bot's next pass.

export const TIMER_SCHEDULES = ['interval', 'daily', 'weekly'] as const;
export type TimerSchedule = (typeof TIMER_SCHEDULES)[number];
/** What `interval_ms` holds for a scheduled timer (the column must stay at least 10 minutes). */
export const SCHEDULE_INTERVAL_MS: Record<'daily' | 'weekly', number> = { daily: 86_400_000, weekly: 604_800_000 };

const DAY_MS = 86_400_000;
const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;
const OFFSET_RE = /^(?:UTC|GMT)\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?$/i;

/** Every IANA time zone the runtime knows, UTC first. */
export function timeZoneList(): string[] {
  let zones: string[] = [];
  try {
    zones = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf?.('timeZone') ?? [];
  } catch { /* an old runtime: the field still takes any zone */ }
  return ['UTC', ...zones.filter((zone) => zone !== 'UTC')];
}

export function normalizeTime(input: unknown): string | null {
  const match = TIME_RE.exec(String(input ?? '').trim());
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : null;
}

function fixedOffsetMinutes(zone: string): number | null {
  const match = OFFSET_RE.exec(zone.trim());
  if (!match) return null;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? 0);
  if (hours > 14 || minutes > 59 || (hours === 14 && minutes > 0)) return null;
  return (match[1] === '-' ? -1 : 1) * (hours * 60 + minutes);
}

/** An IANA zone as the runtime spells it, `UTC`, or an offset as `UTC+5` / `UTC-3:30`; null when it is not a time zone. */
export function normalizeTimeZone(input: unknown): string | null {
  const text = String(input ?? '').trim();
  if (!text || text.length > 64) return null;
  if (/^(utc|gmt|z)$/i.test(text)) return 'UTC';
  const offset = fixedOffsetMinutes(text);
  if (offset !== null) {
    if (offset === 0) return 'UTC';
    const abs = Math.abs(offset);
    return `UTC${offset < 0 ? '-' : '+'}${Math.floor(abs / 60)}${abs % 60 ? `:${String(abs % 60).padStart(2, '0')}` : ''}`;
  }
  if (!/^[A-Za-z][A-Za-z0-9_+\-/]*$/.test(text)) return null;
  try {
    const resolved = new Intl.DateTimeFormat('en-US', { timeZone: text }).resolvedOptions().timeZone;
    return resolved === 'Etc/UTC' || resolved === 'Etc/GMT' ? 'UTC' : resolved;
  } catch {
    return null;
  }
}

function zoneOffsetMs(zone: string, ms: number): number {
  const fixed = zone === 'UTC' ? 0 : fixedOffsetMinutes(zone);
  if (fixed !== null) return fixed * 60_000;
  const parts: Record<string, string> = {};
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
  for (const part of formatter.formatToParts(new Date(ms))) parts[part.type] = part.value;
  const wall = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour) % 24, Number(parts.minute), Number(parts.second));
  return wall - Math.floor(ms / 1000) * 1000;
}

function zonedTimeToUtc(zone: string, year: number, month: number, day: number, hour: number, minute: number): number {
  const local = Date.UTC(year, month, day, hour, minute);
  const before = zoneOffsetMs(zone, local - DAY_MS / 2);
  const after = zoneOffsetMs(zone, local + DAY_MS / 2);
  const valid = [...new Set([before, after])].map((offset) => local - offset).filter((ms) => ms + zoneOffsetMs(zone, ms) === local);
  return valid.length ? Math.min(...valid) : local - before;
}

/** The next time a daily/weekly timer posts, strictly after `afterMs`; null for an interval timer or a bad schedule. */
export function nextScheduledRun(timer: { schedule: string; atTime: string; timezone: string; weekday: number | null }, afterMs = Date.now()): Date | null {
  if (timer.schedule !== 'daily' && timer.schedule !== 'weekly') return null;
  const time = normalizeTime(timer.atTime);
  const zone = normalizeTimeZone(timer.timezone || 'UTC');
  const weekday = timer.schedule === 'weekly' ? Number(timer.weekday) : null;
  if (!time || !zone || (weekday !== null && !(weekday >= 0 && weekday <= 6))) return null;
  const [hour, minute] = time.split(':').map(Number);
  const today = new Date(afterMs + zoneOffsetMs(zone, afterMs));
  for (let add = 0; add <= 8; add += 1) {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + add));
    if (weekday !== null && date.getUTCDay() !== weekday) continue;
    const at = zonedTimeToUtc(zone, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, minute);
    if (at > afterMs) return new Date(at);
  }
  return null;
}

export type TimerScheduleFields = { schedule: 'daily' | 'weekly'; at_time: string; timezone: string; weekday: number | null; interval_ms: number; next_run_at: string };

/**
 * The schedule a timer form asks for (`schedule`, `at_time`, `timezone`, `weekday`): null for an interval timer, the database fields of
 * a daily/weekly one, or { error } when its time, weekday or zone is wrong.
 */
export function timerScheduleFields(form: FormData): TimerScheduleFields | { error: string } | null {
  const schedule = String(form.get('schedule') ?? 'interval');
  if (schedule !== 'daily' && schedule !== 'weekly') return null;
  const atTime = normalizeTime(form.get('at_time'));
  if (!atTime) return { error: 'time' };
  const timezone = normalizeTimeZone(String(form.get('timezone') ?? '').trim() || 'UTC');
  if (!timezone) return { error: 'timezone' };
  const weekdayRaw = String(form.get('weekday') ?? '');
  const weekday = schedule === 'weekly' ? Number(weekdayRaw) : null;
  if (weekday !== null && !(/^[0-6]$/.test(weekdayRaw))) return { error: 'weekday' };
  const next = nextScheduledRun({ schedule, atTime, timezone, weekday });
  if (!next) return { error: 'time' };
  return { schedule, at_time: atTime, timezone, weekday, interval_ms: SCHEDULE_INTERVAL_MS[schedule], next_run_at: next.toISOString() };
}

/** The weekday's name in a language (0 = Sunday). */
export function weekdayName(weekday: number, lang: string): string {
  try {
    return new Intl.DateTimeFormat(lang, { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 7 + weekday)));
  } catch {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekday] ?? String(weekday);
  }
}
