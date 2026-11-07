/**
 * A length of time as the short text the whole dashboard uses to SHOW it: `45s`, `35m`, `1h`, `1h 5m`, `1d`, `2d 3h`.
 * The two units that matter at most, never a zero unit (`2h`, not `2h 0m`), no plurals and no long words. What is saved and what is typed
 * in a field (`3d 4h`, minutes...) is not touched by this: it is only for what is on screen.
 *
 *   under a minute  -> 45s            an hour or more      -> 1h, 1h 5m
 *   under an hour   -> 35m            a day or more        -> 1d, 2d 3h
 *   `max` lets a place that already shows weeks, months or years keep them: 'w' (3w 2d), 'mo' (2mo 3d), 'y' (1y 2mo). 'h' never goes
 *   to days: 54h 12m (the voice time of a server adds up every member, so a day can hold more hours than the clock has).
 *
 * Nothing or something that is not a number gives `empty` (a dash). A negative length is shown with a minus. The number at the front gets the
 * thousands separator of `locale` (1,234h). The function is self-contained on purpose: `formatDuration.toString()` goes into the pages that
 * format times in their own script (see DurationScript.astro).
 */
export function formatDuration(seconds: number | null | undefined, options: { locale?: string; max?: 'h' | 'd' | 'w' | 'mo' | 'y'; empty?: string } = {}): string {
  const value = typeof seconds === 'number' ? seconds : seconds == null ? NaN : Number(seconds);
  if (!Number.isFinite(value)) return options.empty ?? '—';
  const total = Math.round(Math.abs(value));
  const sign = value < 0 && total > 0 ? '-' : '';
  const locale = options.locale || 'en-US';
  const big = (n: number) => n.toLocaleString(locale);
  const sizes = { s: 1, m: 60, h: 3600, d: 86_400, w: 604_800, mo: 2_592_000, y: 31_536_000 };
  const max = options.max === 'h' || options.max === 'w' || options.max === 'mo' || options.max === 'y' ? options.max : 'd';
  // The unit in front and the one after it: seconds, minutes (+ hours), hours (+ minutes), days (+ hours), and the bigger ones when allowed.
  const chain: Array<[string, string | null]> = [['y', 'mo'], ['mo', 'd'], ['w', 'd'], ['d', 'h'], ['h', 'm'], ['m', null], ['s', null]];
  const allowed = max === 'h' ? ['h', 'm', 's'] : max === 'y' ? ['y', 'mo', 'w', 'd', 'h', 'm', 's'] : max === 'mo' ? ['mo', 'w', 'd', 'h', 'm', 's'] : max === 'w' ? ['w', 'd', 'h', 'm', 's'] : ['d', 'h', 'm', 's'];
  for (const [unit, next] of chain) {
    if (!allowed.includes(unit)) continue;
    const size = sizes[unit as keyof typeof sizes];
    if (total < size && unit !== 's') continue;
    const count = Math.floor(total / size);
    // Under a day the text is hours and minutes; from a day on it is days and hours; seconds are only for under a minute.
    let text = `${big(count)}${unit}`;
    if (next) {
      const rest = Math.floor((total - count * size) / sizes[next as keyof typeof sizes]);
      if (rest > 0) text += ` ${rest}${next}`;
    }
    return sign + text;
  }
  return `${sign}0s`;
}

/**
 * A moment compared with now, in the same short form: `5m ago`, `1h 5m ago`, `in 2d 3h`, and `just now` for under 45 seconds either way.
 * `dt` is the translate function of the page (the texts are `just now`, `{a} ago` and `in {a}`).
 */
export function agoText(dt: (key: string, vars?: Record<string, string | number>) => string, when: string | number | Date | null | undefined, options: { now?: number; locale?: string; max?: 'd' | 'w' | 'mo' | 'y'; empty?: string } = {}): string {
  const at = when instanceof Date ? when.getTime() : typeof when === 'number' ? when : when ? Date.parse(String(when)) : NaN;
  if (!Number.isFinite(at)) return options.empty ?? '—';
  const seconds = ((options.now ?? Date.now()) - at) / 1000;
  if (Math.abs(seconds) < 45) return dt('just now');
  const text = formatDuration(Math.abs(seconds), { locale: options.locale, max: options.max });
  return seconds > 0 ? dt('{a} ago', { a: text }) : dt('in {a}', { a: text });
}
