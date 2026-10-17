// Live counters, the same rules as the bot (petto-bot src/utils/counterNames.js): the types, the number formats and how a
// template turns into a channel name. Used by the dashboard page for its previews, on the server and in the browser.

export const COUNTER_TYPES = [
  'members', 'users_only', 'bots_only', 'online', 'status_online', 'status_idle', 'status_dnd', 'in_voice', 'pending_members',
  'boosts', 'booster_count', 'boost_level', 'role_members', 'goal', 'roles', 'all_channels', 'text_channels', 'voice_channels',
  'categories', 'announcement_channels', 'staging_channels', 'emojis', 'stickers', 'clock', 'date',
] as const;
export type CounterType = typeof COUNTER_TYPES[number];
export const COUNTER_FORMATS = ['plain', 'grouped', 'compact'] as const;
export const COUNTER_KINDS = ['voice', 'text', 'category', 'stage', 'announce'] as const;
export const PRESENCE_TYPES = ['online', 'status_online', 'status_idle', 'status_dnd'];
/** Discord: two renames per channel every ten minutes. */
export const RENAMES_PER_WINDOW = 2;

const SEPARATORS: Record<string, { group: string; decimal: string }> = { en: { group: ',', decimal: '.' }, es: { group: '.', decimal: ',' }, 'pt-BR': { group: '.', decimal: ',' } };

export function formatCount(value: number | string, format = 'plain', lang = 'en'): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return String(value ?? '');
  const n = Math.trunc(value);
  const marks = SEPARATORS[lang] ?? SEPARATORS.en;
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (format === 'grouped') return sign + String(abs).replace(/\B(?=(\d{3})+(?!\d))/g, marks.group);
  if (format === 'compact' && abs >= 1000) {
    for (const [size, unit] of [[1e9, 'B'], [1e6, 'M'], [1e3, 'k']] as [number, string][]) {
      if (abs < size) continue;
      const scaled = abs / size;
      const digits = scaled < 100 ? Math.floor(scaled * 10) / 10 : Math.floor(scaled);
      return `${sign}${String(digits).replace('.', marks.decimal)}${unit}`;
    }
  }
  return sign + String(abs);
}

const NICE_STEPS = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000];
export function nextGoal(count: number, setGoal: number | null = null): number {
  const n = Math.max(0, Math.trunc(Number(count) || 0));
  const fixed = Math.trunc(Number(setGoal) || 0);
  if (fixed > n) return fixed;
  let step = NICE_STEPS[0];
  for (const candidate of NICE_STEPS) if (candidate <= n / 4) step = candidate;
  return (Math.floor(n / step) + 1) * step;
}

export function validTimeZone(zone: string): boolean {
  if (!zone || zone.length > 64) return false;
  try { new Intl.DateTimeFormat('en', { timeZone: zone }); return true; } catch { return false; }
}

export function timeValue(type: string, timeZone = 'UTC', lang = 'en', now = Date.now()): string {
  const zone = validTimeZone(timeZone) ? timeZone : 'UTC';
  const locale = lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es' : 'en-GB';
  if (type === 'date') return new Intl.DateTimeFormat(locale, { timeZone: zone, day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(now)).replace(/\./g, '');
  const stepped = Math.floor(now / 300_000) * 300_000;
  return new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(stepped));
}

export function zoneLabel(timeZone: string | null, now = Date.now()): string {
  const zone = timeZone && validTimeZone(timeZone) ? timeZone : 'UTC';
  if (zone === 'UTC' || zone === 'Etc/UTC') return 'UTC';
  return new Intl.DateTimeFormat('en', { timeZone: zone, timeZoneName: 'short' }).formatToParts(new Date(now)).find((p) => p.type === 'timeZoneName')?.value ?? zone;
}

export interface CounterLike { type: string; template: string; format: string; goal: number | null; timezone: string | null; prefix?: string; suffix?: string; role?: string; optionWord?: string }

/** The channel name of a counter for a value, like the bot draws it. */
export function renderCounterName(c: CounterLike, value: number | string, lang = 'en', now = Date.now()): string {
  const format = (COUNTER_FORMATS as readonly string[]).includes(c.format) ? c.format : 'plain';
  const count = formatCount(value, format, lang);
  const goal = typeof value === 'number' ? nextGoal(value, c.goal) : null;
  const vars: Record<string, string> = {
    '{count}': count, '{value}': count, '{remaining}': count, '{option}': c.optionWord ?? c.type,
    '{goal}': goal == null ? '' : formatCount(goal, format, lang),
    '{left}': goal == null || typeof value !== 'number' ? '' : formatCount(Math.max(0, goal - value), format, lang),
    '{percent}': goal && typeof value === 'number' ? `${Math.min(100, Math.floor((value / goal) * 100))}%` : '',
    '{role}': c.role ?? '', '{tz}': c.template.includes('{tz}') ? zoneLabel(c.timezone, now) : '',
  };
  const text = (c.template || '{option}: {value}').replace(/\{(count|value|remaining|option|goal|left|percent|role|tz)\}/g, (whole) => vars[whole]);
  const name = `${c.prefix ?? ''}${text}${c.suffix ?? ''}`.replace(/\s+/g, ' ').trim();
  return Array.from(name).reduce((out, ch) => (out.length + ch.length <= 100 ? out + ch : out), '') || count;
}

/** How Discord shows the name on a text or announcement channel: lower case, spaces as hyphens. */
export function shownName(name: string, kind: string): string {
  return kind === 'text' || kind === 'announce' ? name.toLowerCase().replace(/\s+/g, '-') : name;
}
