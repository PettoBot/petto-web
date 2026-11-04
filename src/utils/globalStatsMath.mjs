// The rules behind the public stats page (/stats): how the daily history is cleaned, which days count, the change between two
// days and the scale of a chart whose vertical axis is zoomed to the data. Pure functions, so scripts/check-stats-page.mjs can test
// them and the page script can use the very same code.

import { BOT_OFFSET_MS, botDay, nextDay, changeShare } from './statsCore.mjs';
// What the dashboard's statistics share with this page lives in statsCore.mjs; it is re-exported here so this page's own imports and checks stay as they were.
export { BOT_OFFSET_MS, LONG_RANGE_DAYS, baseSince, botDay, changeShare, changeSince, dayChanges, daysBefore, isApprox, monthTicks, nextDay, runsOf, smoothPath, summarize, withinDays, zoomScale } from './statsCore.mjs';

/** Every number of a day the bot may store. A day can lack some (servers and members were stored later than the activity). */
export const DAY_FIELDS = ['servers', 'members', 'messages', 'reactions', 'voiceSeconds'];
/** The series the page can draw: `level` ones are a count at the end of the day (they are not added up), the others are per day. */
export const METRICS = [
  // `flag` is the mark of a day whose value was not measured. Servers, members and the per-day numbers each have their own, they never share one.
  { key: 'servers', field: 'servers', kind: 'level', flag: 'estimatedServers' },
  { key: 'members', field: 'members', kind: 'level', flag: 'estimated' },
  // The three per-day numbers share one mark: the days whose activity includes an approximate average, counted before an outage.
  { key: 'messages', field: 'messages', kind: 'flow', flag: 'estimatedActivity' },
  { key: 'voice', field: 'voiceSeconds', kind: 'flow', flag: 'estimatedActivity' },
  { key: 'reactions', field: 'reactions', kind: 'flow', flag: 'estimatedActivity' },
];
export const MAX_HISTORY_DAYS = 400;
export const RANGES = [7, 30, 90, 365];

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const isDay = (value) => typeof value === 'string' && DAY_RE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const count = (value) => {
  if (value === null || value === undefined || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
};
/** A count at the end of the day (servers, members) is never zero: a zero there is a gap in what the bot knew, not a number. */
const LEVEL_FIELDS = METRICS.filter((info) => info.kind === 'level').map((info) => info.field);

/**
 * What the bot saved (`{ days: [...] }`, or the list itself) as a clean list: oldest first, one row per day, only real numbers,
 * the last 400 days. Anything that is not a day or a number is dropped (`null` means "not known", never zero); a day with no number
 * at all is dropped too. `estimated: true` marks a day whose MEMBERS were rebuilt afterwards instead of stored, and `estimatedServers: true`
 * one whose SERVERS were interpolated between two days with a measured count, and `estimatedActivity: true` one whose messages,
 * reactions and voice time include an approximate average; each flag is only about its own numbers.
 */
export function normalizeHistory(raw) {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw?.days) ? raw.days : [];
  const byDay = new Map();
  for (const entry of list) {
    const day = entry?.day ?? entry?.d;
    if (!isDay(day)) continue;
    const row = { day };
    for (const field of DAY_FIELDS) {
      const value = count(entry[field]);
      if (value !== undefined && !(value === 0 && LEVEL_FIELDS.includes(field))) row[field] = value;
    }
    for (const info of METRICS) if (info.flag && entry[info.flag] === true) row[info.flag] = true;
    if (DAY_FIELDS.some((field) => row[field] !== undefined)) byDay.set(day, { ...byDay.get(day), ...row });
  }
  return [...byDay.values()].sort((a, b) => (a.day < b.day ? -1 : 1)).slice(-MAX_HISTORY_DAYS);
}

/**
 * The saved days with today's live numbers on top, oldest first. `live` has the current servers and members (a count at this moment,
 * a full point) and today's messages, reactions and voice seconds so far (a partial day); a number that is missing or not positive
 * (levels) is left as the history has it, never made up. Today's row is created only when it gets a number, and a live level takes
 * away the estimated mark of that number on that day (the one of its own series: servers, members or the per-day numbers), and only of that one. The cards and the last point of the chart read the same live numbers, so they agree.
 */
export function withLiveToday(days, today, live) {
  const out = days.map((row) => ({ ...row }));
  for (const info of METRICS) {
    const value = live?.[info.field];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (info.kind === 'level' && value === 0)) continue;
    let row = out.find((entry) => entry.day === today);
    if (!row) { row = { day: today }; out.push(row); }
    row[info.field] = value;
    if (info.flag) delete row[info.flag];
  }
  return out.sort((a, b) => (a.day < b.day ? -1 : 1));
}

/**
 * The points of one metric: `{ day, value }`, oldest first, with two flags. `partial` is the day still in progress (`today`) of a
 * per-day metric: it is only part of a day, so the page draws it apart and keeps it out of the average, highest and lowest. A level
 * (servers, members) at `today` is the live count, a full point. `estimated` marks a point that was not measured, by the flag of its own series.
 * A day that lacks the number is left out; the page breaks the line there instead of joining its neighbours.
 */
export function seriesOf(days, metric, today) {
  const info = METRICS.find((item) => item.key === metric);
  if (!info) return [];
  return days
    .filter((row) => row[info.field] !== undefined)
    .map((row) => {
      const point = { day: row.day, value: row[info.field] };
      if (info.kind === 'flow' && row.day === today) point.partial = true;
      if (info.flag && row[info.flag] === true) point.estimated = true;
      return point;
    });
}

/**
 * The table of the last days, newest first: for each metric, the value of the day and the change against the day before (and
 * whether that value or the one it is compared with was rebuilt, not stored). The day in progress is left to the caller, which
 * uses the live numbers instead.
 */
export function dailyRows(days, today, limit) {
  const rows = [];
  for (let i = days.length - 1; i >= 0 && rows.length < limit; i -= 1) {
    const row = days[i];
    if (row.day === today) continue;
    const before = i > 0 && nextDay(days[i - 1].day) === row.day ? days[i - 1] : null;
    const cells = {};
    for (const info of METRICS) {
      const value = row[info.field];
      if (value === undefined) continue;
      const previous = before?.[info.field];
      const cell = { value, change: previous === undefined ? null : value - previous };
      if (info.flag && (row[info.flag] === true || before?.[info.flag] === true)) cell.estimated = row[info.flag] === true ? 'value' : 'change';
      cells[info.key] = cell;
    }
    rows.push({ day: row.day, cells });
  }
  return rows;
}
