const AUTOMOD_NUMBERS = {
  max_mentions: [1, 50, 5, false],
  raid_join_threshold: [2, 50, 6, false],
  raid_window_seconds: [5, 120, 10, false],
  anti_alt_min_age_days: [0, 365, 7, false],
  repeat_threshold: [2, 20, 3, false],
  repeat_window_seconds: [3, 120, 10, false],
  caps_percent: [30, 100, 70, false],
  caps_min_length: [4, 200, 12, false],
  max_message_length: [0, 2e3, 0, true],
  max_lines: [0, 100, 0, true],
  strike_limit: [0, 20, 0, true],
  strike_window_minutes: [1, 1440, 10, true],
  strike_mute_minutes: [1, 40320, 10, true]
};
function automodNumber(name, raw) {
  const [min, max, fallback, whole] = AUTOMOD_NUMBERS[name];
  const n = Number(raw ?? fallback);
  return Math.max(min, Math.min(max, (whole ? Math.floor(n) : n) || fallback));
}

export { automodNumber as a };
