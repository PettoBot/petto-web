// The analysis tabs of the Statistics page: the week by hour, a period against the one before it, how the server grows and how messages are made.
// The same numbers as `!stats` in the bot (src/utils/statsV2.js there): only counts, in the time of Colombia (GMT-5).
import { rangeDays } from './activityStats';

type Row = Record<string, any>;
const DAY_MS = 86_400_000;
const dayKey = (value: unknown) => String(value).slice(0, 10);
const num = (value: unknown) => Number(value ?? 0) || 0;
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const weekdayOf = (day: string) => (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7; // Monday first

/** The change from `before` to `now` as a percent, or null when there was nothing before to compare with. */
export function percentChange(now: number, before: number): number | null {
  if (!before) return now ? null : 0;
  return Math.round(((now - before) / before) * 1000) / 10;
}

export const COMPARE_KEYS = ['messages', 'reactions', 'voiceSeconds', 'joins', 'leaves'] as const;
export type CompareKey = (typeof COMPARE_KEYS)[number];

export function buildAnalysis({ days, now = new Date(), channelRows, hourlyRows, flowRows, contentRows, lifespanRows }: { days: number; now?: Date; channelRows: Row[]; hourlyRows: Row[]; flowRows: Row[]; contentRows: Row[]; lifespanRows: Row[] }) {
  const current = rangeDays(now, days);
  const previous = rangeDays(new Date(now.getTime() - days * DAY_MS), days);
  const inCurrent = new Set(current);
  const inPrevious = new Set(previous);
  const only = (rows: Row[], set: Set<string>) => rows.filter((row) => set.has(dayKey(row.day)));
  const totals = (set: Set<string>) => {
    const channels = only(channelRows, set);
    const flows = only(flowRows, set);
    const content = only(contentRows, set);
    return {
      messages: sum(channels.map((row) => num(row.messages))),
      reactions: sum(channels.map((row) => num(row.reactions))),
      voiceSeconds: sum(channels.map((row) => num(row.voice_seconds))),
      joins: sum(flows.map((row) => num(row.joins))),
      leaves: sum(flows.map((row) => num(row.leaves))),
      links: sum(content.map((row) => num(row.links))),
      attachments: sum(content.map((row) => num(row.attachments))),
      replies: sum(content.map((row) => num(row.replies))),
      mentions: sum(content.map((row) => num(row.mentions))),
    };
  };
  const now_ = totals(inCurrent);
  const before = totals(inPrevious);
  const change = Object.fromEntries(Object.keys(now_).map((key) => [key, percentChange((now_ as any)[key], (before as any)[key])])) as Record<keyof typeof now_, number | null>;

  // The week by hour: messages of every hour of every weekday of the period.
  const heatmap = Array.from({ length: 7 }, () => Array(24).fill(0) as number[]);
  for (const row of only(hourlyRows, inCurrent)) heatmap[weekdayOf(dayKey(row.day))][Math.max(0, Math.min(23, num(row.hour)))] += num(row.messages);
  let peak: { weekday: number; hour: number; value: number } | null = null;
  heatmap.forEach((hours, weekday) => hours.forEach((value, hour) => { if (value > 0 && (!peak || value > peak.value)) peak = { weekday, hour, value }; }));
  const byHour = Array(24).fill(0) as number[];
  const byWeekday = Array(7).fill(0) as number[];
  heatmap.forEach((hours, weekday) => hours.forEach((value, hour) => { byHour[hour] += value; byWeekday[weekday] += value; }));
  const hoursTotal = sum(byHour);
  const dayparts = [0, 6, 12, 18].map((from) => (hoursTotal ? sum(byHour.slice(from, from + 6)) / hoursTotal : 0));

  // How long the members who left had stayed: under a day, a week, a month, three months, longer.
  const lifespan = Array(5).fill(0) as number[];
  for (const row of only(lifespanRows, inCurrent)) lifespan[Math.max(0, Math.min(4, num(row.bucket)))] += num(row.members);
  const lifespanTotal = sum(lifespan);

  const per100 = (key: 'links' | 'attachments' | 'replies' | 'mentions') => (now_.messages ? Math.round((now_[key] / now_.messages) * 1000) / 10 : 0);
  const netByDay = current.map((day) => sum(only(flowRows, new Set([day])).map((row) => num(row.joins) - num(row.leaves))));
  return {
    days: current,
    now: now_, before, change,
    heatmap, peak: peak as { weekday: number; hour: number; value: number } | null, byHour, byWeekday, dayparts,
    lifespan, lifespanTotal, earlyLeaveShare: lifespanTotal ? (lifespan[0] + lifespan[1]) / lifespanTotal : null,
    content: { per100: { links: per100('links'), attachments: per100('attachments'), replies: per100('replies'), mentions: per100('mentions') }, totals: { links: now_.links, attachments: now_.attachments, replies: now_.replies, mentions: now_.mentions } },
    netByDay,
    hasPrevious: sum(Object.values(before)) > 0,
  };
}

export type Analysis = ReturnType<typeof buildAnalysis>;

/** What a server lets Petto count (the table `stats_config`); a server that never changed anything counts everything. */
export interface StatsRules { enabled: boolean; members: boolean; content: boolean }
export const DEFAULT_RULES: StatsRules = { enabled: true, members: true, content: true };
export const rulesFromRow = (row: Row | undefined): StatsRules => (row ? { enabled: row.enabled !== false, members: row.members_enabled !== false, content: row.content_enabled !== false } : { ...DEFAULT_RULES });

/** The tables of the counters of a server, which the delete button empties. */
export const COUNTER_TABLES = ['activity_stats', 'activity_hourly', 'activity_members', 'member_flow', 'activity_content', 'member_lifespan'] as const;
