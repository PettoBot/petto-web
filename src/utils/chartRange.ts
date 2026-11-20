// The rules behind the movable window of the statistics charts (src/components/DashChartRange.astro draws and moves it, src/utils/statsChart.mjs
// writes its markup): the numbers of a stretch of days, how the window moves and is stretched, how a place of the strip becomes a day, and how
// a number is written and counted up. Pure functions with no page in them, so scripts/check-chart-range.mjs tests the very code the page runs.

export type Kind = 'flow' | 'level';
export interface RangePoint { value: number; partial?: boolean }
export interface Win { a: number; b: number }
/** `points`: the window edges are the points themselves (a line). `slots`: every point owns a slot of the strip (bars). */
export type Layout = 'points' | 'slots';
export type FormatSpec = { type: 'count' } | { type: 'decimal1'; suffix?: string } | { type: 'duration' };

export interface RangeStats {
  days: number;
  /** flow: all the days of the window (the day in progress counts); level: null */
  total: number | null;
  /** flow: per full day (the day in progress never lowers it); null when no full day is inside */
  average: number | null;
  /** flow: the average against the window of the same length just before it; level: the change share against the start. null when there is nothing fair to compare. */
  versus: number | null;
  /** level: the value at the end of the window, its change from the start and the highest */
  end: number | null;
  change: number | null;
  high: number | null;
}

const sum = (list: RangePoint[]) => list.reduce((total, point) => total + point.value, 0);
/** `part / base` as a fraction, or null when the base is not positive (a change from nothing is not a percentage). */
export const shareOf = (part: number, base: number): number | null => (base > 0 ? part / base : null);

/** The numbers of the days `a` to `b` (both included) of `points`, oldest first. */
export function rangeStats(points: RangePoint[], win: Win, kind: Kind): RangeStats {
  const a = Math.max(0, Math.min(win.a, points.length - 1));
  const b = Math.max(a, Math.min(win.b, points.length - 1));
  const slice = points.slice(a, b + 1);
  const days = slice.length;
  if (kind === 'level') {
    const start = slice[0].value;
    const end = slice[days - 1].value;
    return { days, total: null, average: null, versus: shareOf(end - start, start), end, change: end - start, high: Math.max(...slice.map((point) => point.value)) };
  }
  const full = slice.filter((point) => !point.partial);
  const average = full.length ? sum(full) / full.length : null;
  // The window of the same length just before it. Near the first day there may be less of it: with at least half the days it still gives a fair
  // average per day; with fewer it is not compared.
  const prior = points.slice(Math.max(0, a - days), a);
  const before = prior.filter((point) => !point.partial);
  const beforeAverage = prior.length >= Math.ceil(days / 2) && before.length ? sum(before) / before.length : null;
  const versus = average !== null && beforeAverage !== null && beforeAverage > 0 ? (average - beforeAverage) / beforeAverage : null;
  return { days, total: sum(slice), average, versus, end: null, change: null, high: null };
}

// ── The window ──

/** The window kept inside `0..count-1`, at least `min` days long (or the whole series if that is shorter). */
export function clampWin(win: Win, count: number, min: number): Win {
  const size = Math.min(Math.max(min, win.b - win.a + 1), count);
  const a = Math.max(0, Math.min(win.a, count - size));
  return { a, b: a + size - 1 };
}

/** The window after a drag by `delta` days: `move` keeps its length, `left` and `right` pull that edge (and stop `min` days from the other). */
export function dragWin(start: Win, mode: 'move' | 'left' | 'right', delta: number, count: number, min: number): Win {
  const floor = Math.min(min, count);
  if (mode === 'move') return clampWin({ a: start.a + delta, b: start.b + delta }, count, floor);
  if (mode === 'left') {
    const a = Math.max(0, Math.min(start.a + delta, start.b - floor + 1));
    return { a, b: start.b };
  }
  const b = Math.min(count - 1, Math.max(start.b + delta, start.a + floor - 1));
  return { a: start.a, b };
}

/** Where the left or right edge of day `index` lies along the strip, from 0 to 1. */
export function edgeAt(index: number, side: 'left' | 'right', count: number, layout: Layout): number {
  if (layout === 'points') return count > 1 ? index / (count - 1) : side === 'left' ? 0 : 1;
  return (index + (side === 'right' ? 1 : 0)) / Math.max(1, count);
}

/** The day under the place `fraction` (0-1) of the strip. */
export function indexAt(fraction: number, count: number, layout: Layout): number {
  const f = Math.max(0, Math.min(1, fraction));
  const index = layout === 'points' ? Math.round(f * (count - 1)) : Math.floor(f * count);
  return Math.max(0, Math.min(count - 1, index));
}

/** The window shown at first: the last third of the days (at least a week when there are that many), so the strip is already worth touching. */
export function startWin(count: number, min: number): Win {
  const size = Math.min(count, Math.max(min, Math.round(count / 3), Math.min(count, 7)));
  return { a: count - size, b: count - 1 };
}

// ── Numbers ──

/** The writer of a number: the same letters the page prints, for the numbers that are counted up on the way. */
export function makeFormat(spec: FormatSpec, locale: string): (value: number) => string {
  if (spec.type === 'count') {
    const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    return (value) => nf.format(Math.round(value));
  }
  if (spec.type === 'decimal1') {
    const nf = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return (value) => `${nf.format(value)}${spec.suffix ? ` ${spec.suffix}` : ''}`;
  }
  const big = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  // Hours (a decimal number of them) as "12h 30m", "45m" or "20s", like the dashboard writes a time in voice.
  return (hours) => {
    const seconds = Math.round(Math.abs(hours) * 3600);
    const sign = hours < 0 && seconds > 0 ? '-' : '';
    if (seconds >= 3600) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds - h * 3600) / 60);
      return `${sign}${big.format(h)}h${m > 0 ? ` ${m}m` : ''}`;
    }
    if (seconds >= 60) return `${sign}${Math.floor(seconds / 60)}m`;
    return `${sign}${seconds}s`;
  };
}

/** A change as text with its sign ("+1,200", "−35"); a zero has none. */
export const signedText = (format: (value: number) => string, value: number): string => `${value > 0 ? '+' : value < 0 ? '−' : ''}${format(Math.abs(value))}`;

/** A share as a signed percentage ("+4.2%", "−12%"), or the dash when there is nothing to compare. */
export function percentText(share: number | null, locale: string): string {
  if (share === null || !Number.isFinite(share)) return '–';
  const nf = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: Math.abs(share) < 0.1 ? 1 : 0 });
  const text = nf.format(Math.abs(share));
  return `${share > 0 ? '+' : share < 0 ? '−' : ''}${text}`;
}

/** The ease of the count-up: fast first, slow at the end, so the number settles. `t` is 0-1. */
export const easeOut = (t: number): number => 1 - (1 - Math.max(0, Math.min(1, t))) ** 3;

/** The value `t` (0-1) of the way from `from` to `to`. */
export const tween = (from: number, to: number, t: number): number => from + (to - from) * easeOut(t);
