import { getEnv } from './env';
import { isPettoOwner } from './premiumAdmin';

function list(astro: any, name: string): string[] {
  return String(getEnv(astro, name) ?? '').split(/[\s,]+/).filter((id) => /^\d{15,22}$/.test(id));
}

/**
 * Commands written in code are in testing: only the owner, the developers and the testers see their editor. CODE_COMMANDS_PUBLIC=true
 * opens it (the bot has the same switch and also checks it when something is saved, so this only decides who sees the page).
 */
export function canUseCodeCommands(astro: any, userId: string | undefined): boolean {
  if (getEnv(astro, 'CODE_COMMANDS_PUBLIC') === 'true') return true;
  if (!userId) return false;
  return isPettoOwner(astro, userId) || list(astro, 'PETTO_DEVELOPER_IDS').includes(userId) || list(astro, 'CODE_COMMAND_TESTER_IDS').includes(userId);
}
