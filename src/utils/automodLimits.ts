// The limits of the numbers of the AutoMod form, kept apart from the page so the page and the import of the configuration file clamp a
// value in exactly the same way (a value out of range is brought into range, a missing or non-numeric one becomes its default).
// Each entry is [least, most, default, whole number].
export const AUTOMOD_NUMBERS: Record<string, readonly [min: number, max: number, fallback: number, whole: boolean]> = {
  max_mentions: [1, 50, 5, false],
  raid_join_threshold: [2, 50, 6, false],
  raid_window_seconds: [5, 120, 10, false],
  anti_alt_min_age_days: [0, 365, 7, false],
  repeat_threshold: [2, 20, 3, false],
  repeat_window_seconds: [3, 120, 10, false],
  caps_percent: [30, 100, 70, false],
  caps_min_length: [4, 200, 12, false],
  max_message_length: [0, 2000, 0, true],
  max_lines: [0, 100, 0, true],
  strike_limit: [0, 20, 0, true],
  strike_window_minutes: [1, 1440, 10, true],
  strike_mute_minutes: [1, 40320, 10, true],
};

/** The value the AutoMod form saves for a number field: `raw` is what the form sent (null when the field is missing). */
export function automodNumber(name: string, raw: unknown): number {
  const [min, max, fallback, whole] = AUTOMOD_NUMBERS[name];
  const n = Number(raw ?? fallback);
  return Math.max(min, Math.min(max, (whole ? Math.floor(n) : n) || fallback));
}

