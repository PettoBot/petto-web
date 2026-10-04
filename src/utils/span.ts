// A time written as `3d 4h` (weeks, days, hours, minutes), the way the bot reads the cooldown of partners.
const UNITS: Record<string, number> = { w: 10_080, d: 1_440, h: 60, m: 1 };
export const MAX_SPAN_MINUTES = 365 * 24 * 60;

/** Minutes of `3d 4h`; 0 for `0`, `none` or `off`; null when it is not a valid span or is over a year. */
export function parseSpan(text: string): number | null {
  const value = text.trim().toLowerCase();
  if (/^(0|none|off|no)$/.test(value)) return 0;
  if (!value || !/^(?:\d+\s*[wdhm]\s*)+$/.test(value)) return null;
  let minutes = 0;
  for (const match of value.matchAll(/(\d+)\s*([wdhm])/g)) minutes += Number(match[1]) * UNITS[match[2]];
  return minutes > 0 && minutes <= MAX_SPAN_MINUTES ? minutes : null;
}

/** Minutes as `3d 4h`, or an empty text for none. */
export function formatSpan(minutes: number): string {
  if (!minutes) return '';
  const parts: string[] = [];
  let left = minutes;
  for (const [unit, size] of [['w', 10_080], ['d', 1_440], ['h', 60], ['m', 1]] as const) {
    const count = Math.floor(left / size);
    if (count) { parts.push(`${count}${unit}`); left -= count * size; }
  }
  return parts.join(' ');
}
