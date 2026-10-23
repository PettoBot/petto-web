// How often a repeating timer (Automation → Timers) sends its message: a number and a unit, from seconds to years. The bot understands the same
// units (src/utils/duration.js of petto-bot). The database does not accept less than 10 minutes (auto_messages.interval_ms), so a shorter
// interval is raised to that.
export const TIMER_UNITS = [
  { id: 'seconds', ms: 1000 },
  { id: 'minutes', ms: 60_000 },
  { id: 'hours', ms: 3_600_000 },
  { id: 'days', ms: 86_400_000 },
  { id: 'weeks', ms: 604_800_000 },
  { id: 'months', ms: 30 * 86_400_000 },
  { id: 'years', ms: 365 * 86_400_000 },
] as const;
export type TimerUnit = (typeof TIMER_UNITS)[number]['id'];

export const MIN_TIMER_MS = 10 * 60_000;
export const MAX_TIMER_MS = 10 * 365 * 86_400_000;

/** The interval a form asks for (`interval_value` + `interval_unit`, or the old `interval_minutes`), inside the allowed range. */
export function timerIntervalMs(form: FormData): number {
  const unit = TIMER_UNITS.find((u) => u.id === String(form.get('interval_unit') ?? 'minutes')) ?? TIMER_UNITS[1];
  const value = Number(form.get('interval_value') ?? form.get('interval_minutes') ?? 10);
  const ms = Math.round((Number.isFinite(value) && value > 0 ? value : 10) * unit.ms);
  return Math.max(MIN_TIMER_MS, Math.min(MAX_TIMER_MS, ms));
}

/** An interval split into the biggest unit that divides it exactly: 7 200 000 → 2 hours. */
export function splitInterval(ms: number): { value: number; unit: TimerUnit } {
  for (let i = TIMER_UNITS.length - 1; i >= 0; i--) {
    const u = TIMER_UNITS[i];
    if (ms >= u.ms && ms % u.ms === 0) return { value: ms / u.ms, unit: u.id };
  }
  return { value: Math.max(1, Math.round(ms / 60_000)), unit: 'minutes' };
}
