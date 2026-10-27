import { getEnv } from './env';
import { isPettoOwner } from './premiumAdmin';

function list(astro: any, name: string): string[] {
  return String(getEnv(astro, name) ?? '').split(/[\s,]+/).filter((id) => /^\d{15,22}$/.test(id));
}

/**
 * Feeds are open to every server. FEEDS_PUBLIC=false limits the Feeds pages to the owner, the developers and the testers
 * (the bot has the same switch, and FEEDS_ON_PREMIUM_PAGE in src/utils/feeds.ts decides whether the Premium page talks about them).
 */
export function canUseFeeds(astro: any, userId: string | undefined): boolean {
  if (getEnv(astro, 'FEEDS_PUBLIC') !== 'false') return true;
  if (!userId) return false;
  return isPettoOwner(astro, userId) || list(astro, 'PETTO_DEVELOPER_IDS').includes(userId) || list(astro, 'FEEDS_TESTER_IDS').includes(userId);
}
