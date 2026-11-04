// What the dashboard's per-server statistics draw as time series: the days of each number, ending today (the day still in progress), the
// change of each day against the day before, and the numbers over a chart. It only arranges what `buildStats` and `buildAnalysis` already
// counted (same filters, same meaning); the maths shared with the public stats page is in statsCore.mjs.
import { summarize } from './statsCore.mjs';
import type { StatsData } from './activityStats';
import type { Analysis } from './statsAnalysis';

export type SeriesKey = 'messages' | 'reactions' | 'voice' | 'joins' | 'leaves' | 'invited' | 'sanctions' | 'net' | 'members';
export interface SeriesPoint { day: string; value: number; partial?: boolean }
export interface Series {
  key: SeriesKey;
  points: SeriesPoint[];
  /** The value of the day before the first point, when that day was counted (so the first day has its change too); null otherwise. */
  edge: number | null;
  /** A count at a moment (members) instead of a number per day. */
  level: boolean;
}

/** The numbers that a day-by-day table is made of, in the order its columns come. */
export const SERIES_KEYS: SeriesKey[] = ['messages', 'reactions', 'voice', 'joins', 'leaves', 'invited', 'sanctions', 'net', 'members'];

const FIRST_OF: Record<SeriesKey, 'activity' | 'flow' | null> = { messages: 'activity', reactions: 'activity', voice: 'activity', joins: 'flow', leaves: 'flow', invited: 'flow', net: 'flow', members: 'flow', sanctions: null };
const EDGE_OF: Partial<Record<SeriesKey, 'messages' | 'reactions' | 'voiceSeconds' | 'joins' | 'leaves' | 'invited'>> = { messages: 'messages', reactions: 'reactions', voice: 'voiceSeconds', joins: 'joins', leaves: 'leaves', invited: 'invited' };

/**
 * The series of the page, each from the first day its counters exist (a server that started counting 5 days ago has 5 points, not 30 with
 * 25 empty ones), the last one being today so far. `memberTotal` is the count of members now: it makes the members line, counted back
 * from today with the joins and leaves of each day; without it there is no members line.
 */
export function buildSeries(stats: StatsData, analysis: Analysis, memberTotal: number | null): Record<SeriesKey, Series> {
  const days = stats.days;
  const lastIndex = days.length - 1;
  const net = stats.daily.joins.map((joins, i) => joins - stats.daily.leaves[i]);
  const raw: Record<SeriesKey, number[]> = {
    messages: stats.daily.messages, reactions: stats.daily.reactions, voice: stats.daily.voice, joins: stats.daily.joins, leaves: stats.daily.leaves,
    invited: stats.daily.invited, sanctions: stats.sanctions.daily, net, members: [],
  };
  // Members: today is the count now (a full point), each day before it is the next day's count minus that next day's net.
  if (memberTotal !== null && memberTotal > 0 && days.length) {
    const members = Array<number>(days.length).fill(0);
    members[lastIndex] = memberTotal;
    for (let i = lastIndex; i > 0; i -= 1) members[i - 1] = members[i] - net[i];
    raw.members = members;
  }
  const out = {} as Record<SeriesKey, Series>;
  for (const key of SERIES_KEYS) {
    const level = key === 'members';
    const values = raw[key];
    const family = FIRST_OF[key];
    const first = family ? analysis.counted[family] : days[0];
    // A key with no counters at all has no points; before its first day nothing was counted, so those days are left out.
    let start = first === null || !values.length ? days.length : days.findIndex((day) => day >= (first as string));
    if (start < 0) start = days.length;
    const slice = days.slice(start).map((day, i) => ({ day, value: values[start + i] } as SeriesPoint));
    // A members line that went below one member was not counted back right (the counters are incomplete): it is not drawn.
    const broken = level && slice.some((point) => point.value < 1);
    const points = broken ? [] : slice;
    if (!level && points.length && start + points.length - 1 === lastIndex) points[points.length - 1].partial = true;
    const edgeKey = EDGE_OF[key];
    // The day before the first point was counted when the first counted day is earlier than the window.
    const before = first !== null && start === 0 && (first as string) < days[0];
    const edge = !before ? null : edgeKey ? analysis.edge[edgeKey] : key === 'net' ? analysis.edge.joins - analysis.edge.leaves : null;
    out[key] = { key, points: level && broken ? [] : points, edge, level };
  }
  return out;
}

/** The change of each point against the one before (the first against `edge`); the day in progress is not compared with a whole day (null). */
export function pointChanges(series: Series): (number | null)[] {
  return series.points.map((point, i) => {
    if (point.partial) return null;
    if (i === 0) return series.edge === null ? null : point.value - series.edge;
    return point.value - series.points[i - 1].value;
  });
}

export interface DayCell { value: number; change: number | null }
export interface DayRow { day: string; today: boolean; cells: Partial<Record<SeriesKey, DayCell>> }

/** The rows of the day by day table, newest first (today so far on top): each column's value and its change from the day before. */
export function dayRows(all: Record<SeriesKey, Series>, keys: SeriesKey[]): DayRow[] {
  const byDay = new Map<string, DayRow>();
  for (const key of keys) {
    const series = all[key];
    const changes = pointChanges(series);
    series.points.forEach((point, i) => {
      const row = byDay.get(point.day) ?? { day: point.day, today: false, cells: {} };
      row.cells[key] = { value: point.value, change: changes[i] };
      if (point.partial) row.today = true;
      byDay.set(point.day, row);
    });
  }
  return [...byDay.values()].sort((a, b) => (a.day < b.day ? 1 : -1));
}

/** The numbers over a chart: average per day, highest and lowest over the full days (today so far is left out of them). */
export function seriesSummary(series: Series) {
  const sum = summarize(series.points, series.level ? 'level' : 'flow');
  return { average: sum.average as number | null, high: sum.high as SeriesPoint | null, low: sum.low as SeriesPoint | null, fullDays: sum.fullDays as number };
}

/**
 * A change from the period before as a chip: the percent, its tone (good, bad or flat; `inverse` for a number where less is better, the
 * members who left) and `new` when there was nothing before to compare with.
 */
export function changeChip(value: number | null, inverse: boolean, locale: string, newText: string): { text: string; tone: 'good' | 'bad' | 'flat'; arrow: '▲' | '▼' | '' } {
  if (value === null) return { text: newText, tone: 'flat', arrow: '' };
  if (value === 0) return { text: '0%', tone: 'flat', arrow: '' };
  const good = (value > 0) !== inverse;
  return { text: `${Math.abs(value).toLocaleString(locale)}%`, tone: good ? 'good' : 'bad', arrow: value > 0 ? '▲' : '▼' };
}
