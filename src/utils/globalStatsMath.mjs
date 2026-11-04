// The rules behind the public stats page (/stats): how the daily history is cleaned, which days count, the change between two
// days and the scale of a chart whose vertical axis is zoomed to the data. Pure functions, so scripts/check-stats-page.mjs can test
// them and the page script can use the very same code.

/** The time of Petto: GMT-5 (Colombia, no daylight saving). A "day" of the stats is a day in it, like the bot counts them. */
export const BOT_OFFSET_MS = -5 * 60 * 60 * 1000;
export const botDay = (now = Date.now()) => new Date(new Date(now).getTime() + BOT_OFFSET_MS).toISOString().slice(0, 10);

/** Every number of a day the bot may store. A day can lack some (servers and members were stored later than the activity). */
export const DAY_FIELDS = ['servers', 'members', 'messages', 'reactions', 'voiceSeconds'];
/** The series the page can draw: `level` ones are a count at the end of the day (they are not added up), the others are per day. */
export const METRICS = [
  { key: 'servers', field: 'servers', kind: 'level' },
  { key: 'members', field: 'members', kind: 'level' },
  { key: 'messages', field: 'messages', kind: 'flow' },
  { key: 'voice', field: 'voiceSeconds', kind: 'flow' },
  { key: 'reactions', field: 'reactions', kind: 'flow' },
];
export const MAX_HISTORY_DAYS = 120;
export const RANGES = [7, 30, 90];

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const isDay = (value) => typeof value === 'string' && DAY_RE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const count = (value) => {
  if (value === null || value === undefined || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
};

/**
 * What the bot saved (`{ days: [...] }`, or the list itself) as a clean list: oldest first, one row per day, only real numbers,
 * the last 120 days. Anything that is not a day or a number is dropped; a day with no number at all is dropped too.
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
      if (value !== undefined) row[field] = value;
    }
    if (DAY_FIELDS.some((field) => row[field] !== undefined)) byDay.set(day, { ...byDay.get(day), ...row });
  }
  return [...byDay.values()].sort((a, b) => (a.day < b.day ? -1 : 1)).slice(-MAX_HISTORY_DAYS);
}

/** The next day after `day` ('2026-11-04' -> '2026-11-05'). */
export const nextDay = (day) => new Date(Date.parse(`${day}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

/**
 * The points of one metric: `{ day, value }`, oldest first. A per-day metric leaves out the day still in progress (`today`), which
 * would look like a fall; a level keeps it. A day that lacks the number is left out (the line goes between its neighbours).
 */
export function seriesOf(days, metric, today) {
  const info = METRICS.find((item) => item.key === metric);
  if (!info) return [];
  return days
    .filter((row) => row[info.field] !== undefined && (info.kind === 'level' || row.day !== today))
    .map((row) => ({ day: row.day, value: row[info.field] }));
}

/** The day `back` days before `day`. */
export const daysBefore = (day, back) => new Date(Date.parse(`${day}T00:00:00Z`) - back * 86_400_000).toISOString().slice(0, 10);

/** The points of the last `n` days counted back from the last point (the range chosen on the page). */
export function withinDays(points, n) {
  if (!points.length) return [];
  const from = daysBefore(points[points.length - 1].day, Math.max(1, n) - 1);
  return points.filter((point) => point.day >= from);
}

/**
 * The last value minus the value `back` days earlier (the last point on or before that day), or null when the history does not reach
 * that far back: a change is never made up from a shorter history.
 */
export function changeSince(points, back) {
  if (!points.length || back < 1) return null;
  const last = points[points.length - 1];
  const target = daysBefore(last.day, back);
  let from = null;
  for (const point of points) if (point.day <= target) from = point;
  return from ? last.value - from.value : null;
}

/** The change of each point against the one before it (null for the first). */
export const dayChanges = (points) => points.map((point, index) => (index === 0 ? null : point.value - points[index - 1].value));

/** A change as a share of the value it started from, or null when that is zero. */
export const changeShare = (change, from) => (change === null || !from ? null : change / from);

/**
 * The vertical scale of a chart that is zoomed to its data: from a little below the lowest value to a little above the highest, with
 * round tick values between them, so a small movement is a visible one. When every value is the same the scale is a band around it.
 * `floorZero` keeps the bottom at zero when the zoomed scale would go below it for a number that cannot be negative.
 */
export function zoomScale(values, wantedTicks = 4, floorZero = true) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return { min: 0, max: 1, step: 1, ticks: [0, 1] };
  let lo = Math.min(...clean);
  let hi = Math.max(...clean);
  if (hi === lo) {
    const band = Math.max(1, Math.abs(hi) * 0.02);
    lo -= band; hi += band;
  } else {
    const pad = (hi - lo) * 0.14;
    lo -= pad; hi += pad;
  }
  if (floorZero && lo < 0) lo = 0;
  const raw = (hi - lo) / Math.max(1, wantedTicks);
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((candidate) => candidate >= raw) ?? raw;
  // The plot runs exactly from `lo` to `hi` (the data and a little air), so none of it is spent on empty space; the ticks are the round values inside.
  const ticks = [];
  for (let value = Math.ceil(lo / step - 1e-9) * step; value <= hi + step / 1000; value += step) ticks.push(Math.round(value / step) * step);
  return { min: lo, max: hi, step, ticks };
}

/** A smooth line through the points (Catmull-Rom, never leaving the range of the two points it joins), as an SVG path. */
export function smoothPath(points) {
  if (!points.length) return '';
  if (points.length === 1) return `M${points[0].x},${points[0].y} L${points[0].x + 0.01},${points[0].y}`;
  const fmt = (n) => Math.round(n * 100) / 100;
  let path = `M${fmt(points[0].x)},${fmt(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
    const lo = Math.min(p1.y, p2.y), hi = Math.max(p1.y, p2.y);
    const c1y = Math.max(lo, Math.min(hi, p1.y + (p2.y - p0.y) / 6));
    const c2y = Math.max(lo, Math.min(hi, p2.y - (p3.y - p1.y) / 6));
    path += ` C${fmt(p1.x + (p2.x - p0.x) / 6)},${fmt(c1y)} ${fmt(p2.x - (p3.x - p1.x) / 6)},${fmt(c2y)} ${fmt(p2.x)},${fmt(p2.y)}`;
  }
  return path;
}

/**
 * The table of the last days, newest first: for each metric, the value of the day and the change against the day before. A
 * per-day metric of the day still in progress is left to the caller (it uses the live number instead).
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
      cells[info.key] = { value, change: previous === undefined ? null : value - previous };
    }
    rows.push({ day: row.day, cells });
  }
  return rows;
}
