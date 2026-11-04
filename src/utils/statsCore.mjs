// The pieces that the public statistics page (/stats) and the dashboard's per-server statistics both need: the day of Petto (GMT-5), the
// change between two days, the zoomed scale of a chart, the smooth line, the runs of days, the numbers above a chart. Pure functions,
// so scripts/check-stats-page.mjs and scripts/check-dash-stats.mjs can test them and both pages run the very same code.

/** A chart that spans more days than this labels its axis by month instead of by day. */
export const LONG_RANGE_DAYS = 120;

/** The time of Petto: GMT-5 (Colombia, no daylight saving). A "day" of the stats is a day in it, like the bot counts them. */
export const BOT_OFFSET_MS = -5 * 60 * 60 * 1000;
export const botDay = (now = Date.now()) => new Date(new Date(now).getTime() + BOT_OFFSET_MS).toISOString().slice(0, 10);

/** The next day after `day` ('2026-11-04' -> '2026-11-05'). */
export const nextDay = (day) => new Date(Date.parse(`${day}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

/**
 * The numbers above a chart. A level shows its last value and the change over the window. A per-day metric adds up every point
 * (the day in progress included, it is real activity) but its average, highest and lowest count full days only, so a day that is
 * not over never reads as a low. Those three are `null` when no full day is in the window.
 */
export function summarize(points, kind) {
  const full = points.filter((point) => !point.partial);
  const pick = (list, better) => list.reduce((best, point) => (best === null || better(point.value, best.value) ? point : best), null);
  const sumOf = (list) => list.reduce((sum, point) => sum + point.value, 0);
  const first = points[0];
  const last = points[points.length - 1];
  const level = kind === 'level';
  // One shape for both kinds (a field that does not apply is null), so the page reads it without guessing.
  return {
    high: pick(level ? points : full, (a, b) => a > b),
    low: pick(level ? points : full, (a, b) => a < b),
    fullDays: full.length,
    last: level ? last : null,
    change: level ? last.value - first.value : null,
    share: level ? changeShare(last.value - first.value, first.value) : null,
    total: level ? null : sumOf(points),
    average: level || !full.length ? null : sumOf(full) / full.length,
    partial: !level && points.length > full.length,
  };
}

/**
 * Cuts the points into runs of consecutive days: a day with no number between two points is a gap, and the line is not drawn
 * across it. Each run is a list of indexes into `points`.
 */
export function runsOf(points) {
  const runs = [];
  points.forEach((point, index) => {
    const last = runs[runs.length - 1];
    if (last && nextDay(points[last[last.length - 1]].day) === point.day) last.push(index);
    else runs.push([index]);
  });
  return runs;
}

/**
 * True when the stretch that ends at `point` is drawn dashed: the day in progress, or a stretch between two days that were both rebuilt afterwards (the line
 * between two known dates). A stretch that has a known day at one end is solid: the rise to a day the team recorded (a spike) and the fall after it.
 */
export const isApprox = (before, point) => Boolean(point.partial || (point.estimated && before?.estimated));

/** The day `back` days before `day`. */
export const daysBefore = (day, back) => new Date(Date.parse(`${day}T00:00:00Z`) - back * 86_400_000).toISOString().slice(0, 10);

/**
 * The month labels of a long chart: the first day of each month inside `first`..`last`, thinned (every 2nd, 3rd... month) so that
 * at most `max` remain, always starting from the newest month so the labels stay put as the chart moves. Each has `year: true` for a
 * January and for the oldest one shown, which are the ones that need the year.
 */
export function monthTicks(first, last, max) {
  const months = [];
  let [year, month] = [Number(first.slice(0, 4)), Number(first.slice(5, 7))];
  const end = Number(last.slice(0, 4)) * 12 + Number(last.slice(5, 7));
  for (; year * 12 + month <= end; month === 12 ? ((month = 1), (year += 1)) : (month += 1)) {
    const day = `${year}-${String(month).padStart(2, '0')}-01`;
    if (day >= first && day <= last) months.push(day);
  }
  const step = Math.max(1, Math.ceil(months.length / Math.max(1, max)));
  const picked = months.filter((_, index) => (months.length - 1 - index) % step === 0);
  return picked.map((day, index) => ({ day, year: day.slice(5, 7) === '01' || index === 0 }));
}

/** The points of the last `n` days counted back from the last point (the range chosen on the page). */
export function withinDays(points, n) {
  if (!points.length) return [];
  const from = daysBefore(points[points.length - 1].day, Math.max(1, n) - 1);
  return points.filter((point) => point.day >= from);
}

/**
 * The point `back` days before the last one (the last point on or before that day), or null when the history does not reach that
 * far back: a change is never made up from a shorter history.
 */
export function baseSince(points, back) {
  if (!points.length || back < 1) return null;
  const target = daysBefore(points[points.length - 1].day, back);
  let from = null;
  for (const point of points) if (point.day <= target) from = point;
  return from;
}

/** The last value minus the value `back` days earlier, or null when the history does not reach that far back. */
export function changeSince(points, back) {
  const from = baseSince(points, back);
  return from ? points[points.length - 1].value - from.value : null;
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
  for (let value = Math.ceil(lo / step - 1e-9) * step; value <= hi + step / 1000; value += step) ticks.push(Math.round(value / step) * step + 0); // + 0 turns -0 into 0, which would print as "-0"
  return { min: lo, max: hi, step, ticks };
}

/**
 * A smooth line through the points (Catmull-Rom, never leaving the range of the two points it joins), as an SVG path. `from` and `to`
 * draw only that stretch while its ends still follow the neighbours, so a dashed stretch meets a solid one without a kink.
 */
export function smoothPath(points, from = 0, to = points.length - 1) {
  if (!points.length) return '';
  if (points.length === 1) return `M${points[0].x},${points[0].y} L${points[0].x + 0.01},${points[0].y}`;
  const fmt = (n) => Math.round(n * 100) / 100;
  let path = `M${fmt(points[from].x)},${fmt(points[from].y)}`;
  for (let i = from; i < to; i += 1) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
    const lo = Math.min(p1.y, p2.y), hi = Math.max(p1.y, p2.y);
    const c1y = Math.max(lo, Math.min(hi, p1.y + (p2.y - p0.y) / 6));
    const c2y = Math.max(lo, Math.min(hi, p2.y - (p3.y - p1.y) / 6));
    path += ` C${fmt(p1.x + (p2.x - p0.x) / 6)},${fmt(c1y)} ${fmt(p2.x - (p3.x - p1.x) / 6)},${fmt(c2y)} ${fmt(p2.x)},${fmt(p2.y)}`;
  }
  return path;
}

