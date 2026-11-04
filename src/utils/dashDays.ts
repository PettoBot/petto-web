// The days of the dashboard statistics, all counted in the time of Petto (GMT-5, Colombia, no daylight saving) because that is the
// day the bot writes its counters with (activity_stats, member_flow...). A day is a "YYYY-MM-DD" string of that calendar: the calendar
// arithmetic below works on the string itself, so a server in any time zone gives the same days.
import { BOT_OFFSET_MS, botDay, rangeDays } from './activityStats';

export type OverviewRange = 'day' | 'week' | 'month' | 'year';
export const OVERVIEW_RANGE_DAYS: Record<OverviewRange, number> = { day: 1, week: 7, month: 30, year: 365 };

const DAY_MS = 86_400_000;
const atNoon = (day: string) => new Date(`${day}T12:00:00Z`);

/** The range asked for in the address (`?range=`), week when it is missing or not one of the four. */
export function parseOverviewRange(value: string | null | undefined): OverviewRange {
  return value === 'day' || value === 'week' || value === 'month' || value === 'year' ? value : 'week';
}

/** A calendar day moved by some days: `addDays('2026-12-31', 1)` is `2027-01-01`. */
export function addDays(day: string, delta: number): string {
  return new Date(atNoon(day).getTime() + delta * DAY_MS).toISOString().slice(0, 10);
}

/** The Sunday on or before a calendar day: where its week starts (the weeks of the year view begin on Sunday). */
export function weekStartDay(day: string): string {
  return addDays(day, -atNoon(day).getUTCDay());
}

/** The bucket a day is added to: itself, or the Sunday that starts its week in the year view. */
export function bucketKey(day: string, range: OverviewRange): string {
  return range === 'year' ? weekStartDay(day) : day;
}

/** The instant (ISO, UTC) at which a Colombian day starts, to ask the database for what happened since then. */
export function dayStartInstant(day: string): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) - BOT_OFFSET_MS).toISOString();
}

/**
 * Everything the overview needs to know about its days for a range, at an instant: the first day of this period and of the one before
 * it (the cutoffs sent to the database), today, and the keys of the x axis (every day, or every week in the year view), oldest first,
 * with no gaps and nothing after today.
 */
export function overviewDays(now: Date, range: OverviewRange) {
  const days = OVERVIEW_RANGE_DAYS[range];
  const list = rangeDays(now, days);
  return {
    days,
    today: list[list.length - 1],
    currentCutoff: list[0],
    previousCutoff: rangeDays(now, days * 2)[0],
    keys: [...new Set(list.map((day) => bucketKey(day, range)))],
  };
}

/** The rows of the current period added up per bucket of the axis (a day, or a week in the year view); `fields` are the numbers to add. */
export function bucketSums<K extends string>(rows: Array<{ day: string } & Record<K, number>>, range: OverviewRange, fields: K[]): Map<string, Record<K, number>> {
  const sums = new Map<string, Record<K, number>>();
  for (const row of rows) {
    const key = bucketKey(row.day, range);
    const sum = sums.get(key) ?? (Object.fromEntries(fields.map((field) => [field, 0])) as Record<K, number>);
    for (const field of fields) sum[field] += row[field];
    sums.set(key, sum);
  }
  return sums;
}

/** The axis of the chart: one entry per key, in order, zero where nothing was counted, so a day with no activity still has its place. */
export function fillAxis<K extends string>(keys: string[], sums: Map<string, Record<K, number>>, fields: K[]): Array<{ label: string } & Record<K, number>> {
  return keys.map((label) => ({ label, ...(sums.get(label) ?? (Object.fromEntries(fields.map((field) => [field, 0])) as Record<K, number>)) }));
}

/** The Colombian day of a row of cases: the `day` the database already grouped it by, or the Colombian day of its `created_at`; '' when it has neither. */
export function rowDay(row: { day?: unknown; created_at?: unknown }): string {
  if (row.day) return String(row.day).slice(0, 10);
  return row.created_at ? botDay(String(row.created_at)) : '';
}

/** The start (an instant) of today or of this week, Monday first, in GMT-5: the same "today" and "this week" the bot's commands use. */
export function periodStartInstant(period: 'day' | 'week', now = new Date()): number {
  const today = botDay(now);
  const first = period === 'day' ? today : addDays(today, -((atNoon(today).getUTCDay() + 6) % 7));
  return Date.parse(dayStartInstant(first));
}
