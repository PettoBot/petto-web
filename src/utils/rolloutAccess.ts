import { getEnv } from './env';
import { isPettoOwner } from './premiumAdmin';

function list(astro: any, name: string): string[] {
  return String(getEnv(astro, name) ?? '').split(/[\s,]+/).filter((id) => /^\d{15,22}$/.test(id));
}

/**
 * Rollout alerts are in beta: the page is for the owner, the developers and the testers until ROLLOUTS_PUBLIC=true (the bot
 * has the same switch).
 */
export function canUseRollouts(astro: any, userId: string | undefined): boolean {
  if (getEnv(astro, 'ROLLOUTS_PUBLIC') === 'true') return true;
  if (!userId) return false;
  return isPettoOwner(astro, userId) || list(astro, 'PETTO_DEVELOPER_IDS').includes(userId) || list(astro, 'ROLLOUTS_TESTER_IDS').includes(userId);
}
