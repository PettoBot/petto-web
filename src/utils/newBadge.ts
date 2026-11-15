// The "New" badge of the site (the tabs of the dashboard, the modules, the menu and the footer, the Premium page) does not stay forever: a thing is new
// for NEW_FOR_DAYS days from the day it came out, and then the badge goes by itself. Every badge says that day (`since`), and
// scripts/check-new-badges.mjs refuses a badge that does not.
export const NEW_FOR_DAYS = 10;

const DAY_MS = 86_400_000;

/** Whether something that came out on `since` (`YYYY-MM-DD`, UTC) is still new at `now`. No date, or a date that is not one, is not new. */
export function isStillNew(since: string | undefined | null, now: number = Date.now()): boolean {
  if (!since) return false;
  const start = Date.parse(`${since}T00:00:00Z`);
  if (!Number.isFinite(start)) return false;
  return now >= start && now < start + NEW_FOR_DAYS * DAY_MS;
}
