// Turns the activity counters the bot writes (per channel, hour, member and day, plus joins and leaves) into what the
// Statistics page shows. Same numbers as the bot's `/summary`.
export const STAT_TABS = ['overview', 'messages', 'voice', 'joins', 'leaves', 'invites'] as const;
export type StatTab = (typeof STAT_TABS)[number];

type Row = Record<string, any>;
const num = (value: unknown) => Number(value ?? 0) || 0;
const dayKey = (value: unknown) => String(value).slice(0, 10);

export function rangeDays(now = new Date(), days = 7): string[] {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const list: string[] = [];
  for (let back = days - 1; back >= 0; back -= 1) {
    const day = new Date(end);
    day.setUTCDate(day.getUTCDate() - back);
    list.push(day.toISOString().slice(0, 10));
  }
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

export function buildStats({ days, channelRows, hourlyRows, flowRows, memberRows, now = new Date() }: { days: number; channelRows: Row[]; hourlyRows: Row[]; flowRows: Row[]; memberRows: Row[]; now?: Date }) {
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
    peakHour: { messages: peakOf(hours.messages), voice: peakOf(hours.voice) },
    topChannels: { messages: topOf(channels, 'messages', 6), voice: topOf(channels, 'voiceSeconds', 6) },
    topMembers: { messages: topOf(members, 'messages', 6), voice: topOf(members, 'voiceSeconds', 6) },
  };
}

export type StatsData = ReturnType<typeof buildStats>;
