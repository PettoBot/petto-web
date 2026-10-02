import { getEnv } from './env';
import { isPettoOwner } from './premiumAdmin';

function list(astro: any, name: string): string[] {
  return String(getEnv(astro, name) ?? '').split(/[\s,]+/).filter((id) => /^\d{15,22}$/.test(id));
}

/**
 * Quest alerts are open to every server now. QUESTS_PUBLIC=false limits the Quests page to the owner, the developers and
 * the testers (the bot has the same switch).
 */
export function canUseQuests(astro: any, userId: string | undefined): boolean {
  if (getEnv(astro, 'QUESTS_PUBLIC') !== 'false') return true;
  if (!userId) return false;
  return isPettoOwner(astro, userId) || list(astro, 'PETTO_DEVELOPER_IDS').includes(userId) || list(astro, 'QUESTS_TESTER_IDS').includes(userId);
}
