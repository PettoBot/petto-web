// Turns the activity counters the bot writes (per channel, hour, member and day, plus joins and leaves) into what the
// Statistics page shows. Same numbers as the bot's `!summary`.
export const STAT_TABS = ['overview', 'messages', 'voice', 'heatmap', 'joins', 'leaves', 'growth', 'compare', 'invites', 'sanctions', 'data'] as const;

// The time of Petto: GMT-5, Colombia (no daylight saving). Days and hours are counted in it.
export const BOT_OFFSET_MS = -5 * 60 * 60 * 1000;
export const BOT_TIME_LABEL = 'GMT-5';
// The same time as a database zone (to group timestamps by the Colombian day in SQL).
export const BOT_TIME_ZONE = 'America/Bogota';
export const botDay = (date: Date | string | number = new Date()) => new Date(new Date(date).getTime() + BOT_OFFSET_MS).toISOString().slice(0, 10);

const GROUPS: Record<string, string[]> = { bans: ['ban', 'hardban', 'tempban', 'softban'], mutes: ['mute', 'tempmute'], warns: ['warn'], kicks: ['kick'], jails: ['jail'] };
const UNDONE = ['unban', 'unmute', 'unjail'];
const SOURCES = ['moderator', 'automod', 'honeypot', 'escalation', 'expiry', 'antinuke'];
export type StatTab = (typeof STAT_TABS)[number];

type Row = Record<string, any>;
const num = (value: unknown) => Number(value ?? 0) || 0;
const dayKey = (value: unknown) => String(value).slice(0, 10);

export function rangeDays(now = new Date(), days = 7): string[] {
  const list: string[] = [];
  for (let back = days - 1; back >= 0; back -= 1) list.push(botDay(new Date(now.getTime() - back * 86_400_000)));
  return list;
}

function topOf(map: Map<string, { messages: number; voiceSeconds: number }>, key: 'messages' | 'voiceSeconds', limit: number) {
  return [...map.entries()]
    .map(([id, value]) => ({ id, ...value }))
    .filter((row) => row[key] > 0)
    .sort((a, b) => b[key] - a[key] || b.messages - a.messages)
    .slice(0, limit);
}

function peakOf(values: number[]) {
  let best = -1;
  values.forEach((value, hour) => { if (value > 0 && (best === -1 || value > values[best])) best = hour; });
  return best === -1 ? null : { hour: best, value: values[best] };
}

export function buildStats({ days, channelRows, hourlyRows, flowRows, memberRows, caseRows = [], botId = null, now = new Date() }: { days: number; channelRows: Row[]; hourlyRows: Row[]; flowRows: Row[]; memberRows: Row[]; caseRows?: Row[]; botId?: string | null; now?: Date }) {
  const list = rangeDays(now, days);
  const index = new Map(list.map((day, i) => [day, i]));
  const zeros = () => list.map(() => 0);
  const daily = { messages: zeros(), reactions: zeros(), voice: zeros(), joins: zeros(), leaves: zeros(), invited: zeros() };

  const channels = new Map<string, { messages: number; voiceSeconds: number }>();
  for (const row of channelRows) {
    const i = index.get(dayKey(row.day));
    if (i === undefined) continue;
    daily.messages[i] += num(row.messages);
    daily.reactions[i] += num(row.reactions);
    daily.voice[i] += num(row.voice_seconds);
    const current = channels.get(row.channel_id) ?? { messages: 0, voiceSeconds: 0 };
    current.messages += num(row.messages);
    current.voiceSeconds += num(row.voice_seconds);
    channels.set(row.channel_id, current);
  }
  for (const row of flowRows) {
    const i = index.get(dayKey(row.day));
    if (i === undefined) continue;
    daily.joins[i] += num(row.joins);
    daily.leaves[i] += num(row.leaves);
    daily.invited[i] += num(row.invited);
  }

  const hours = { messages: Array(24).fill(0) as number[], voice: Array(24).fill(0) as number[] };
  for (const row of hourlyRows) {
    if (!index.has(dayKey(row.day))) continue;
    const hour = Math.max(0, Math.min(23, num(row.hour)));
    hours.messages[hour] += num(row.messages);
    hours.voice[hour] += num(row.voice_seconds);
  }

  const members = new Map<string, { messages: number; voiceSeconds: number }>();
  for (const row of memberRows) {
    if (!index.has(dayKey(row.day))) continue;
    const current = members.get(row.user_id) ?? { messages: 0, voiceSeconds: 0 };
    current.messages += num(row.messages);
    current.voiceSeconds += num(row.voice_seconds);
    members.set(row.user_id, current);
  }

  // Sanctions: by day, kind, who applied them and who got them.
  const sanctionDaily = list.map(() => 0);
  const byGroup: Record<string, number> = { bans: 0, mutes: 0, warns: 0, kicks: 0, jails: 0, undone: 0 };
  const bySource: Record<string, number> = Object.fromEntries(SOURCES.map((source) => [source, 0]));
  const moderators = new Map<string, number>();
  const sanctioned = new Map<string, number>();
  for (const row of caseRows) {
    const i = index.get(botDay(row.created_at));
    if (i === undefined) continue;
    if (UNDONE.includes(row.type)) { byGroup.undone += 1; continue; }
    const group = Object.keys(GROUPS).find((key) => GROUPS[key].includes(row.type));
    if (!group) continue;
    byGroup[group] += 1;
    sanctionDaily[i] += 1;
    const source = row.source && row.source !== 'moderator' ? row.source : (botId && row.moderator_id === botId ? 'automod' : 'moderator');
    bySource[source in bySource ? source : 'moderator'] += 1;
    if (source === 'moderator') moderators.set(row.moderator_id, (moderators.get(row.moderator_id) ?? 0) + 1);
    sanctioned.set(row.user_id, (sanctioned.get(row.user_id) ?? 0) + 1);
  }
  const ranked = (map: Map<string, number>) => [...map.entries()].map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  const sanctionTotal = sanctionDaily.reduce((a, b) => a + b, 0);

  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
  const weekdays = { messages: Array(7).fill(0) as number[], voice: Array(7).fill(0) as number[], joins: Array(7).fill(0) as number[], leaves: Array(7).fill(0) as number[], invited: Array(7).fill(0) as number[] };
  list.forEach((day, i) => {
    const weekday = (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7; // Monday first
    for (const key of Object.keys(weekdays) as (keyof typeof weekdays)[]) weekdays[key][weekday] += daily[key][i];
  });

  return {
    days: list,
    daily,
    hours,
    weekdays,
    totals: {
      messages: sum(daily.messages), reactions: sum(daily.reactions), voiceSeconds: sum(daily.voice),
      joins: sum(daily.joins), leaves: sum(daily.leaves), invited: sum(daily.invited), activeMembers: members.size,
    },
    sanctions: { total: sanctionTotal, daily: sanctionDaily, byGroup, bySource, automatic: sanctionTotal - bySource.moderator, topModerators: ranked(moderators), topUsers: ranked(sanctioned) },
    peakHour: { messages: peakOf(hours.messages), voice: peakOf(hours.voice) },
    topChannels: { messages: topOf(channels, 'messages', 5), voice: topOf(channels, 'voiceSeconds', 5) },
    topMembers: { messages: topOf(members, 'messages', 5), voice: topOf(members, 'voiceSeconds', 5) },
  };
}

export type StatsData = ReturnType<typeof buildStats>;
