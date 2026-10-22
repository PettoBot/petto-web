import { getEnv } from './env';
import { isPettoOwner } from './premiumAdmin';

function list(astro: any, name: string): string[] {
  return String(getEnv(astro, name) ?? '').split(/[\s,]+/).filter((id) => /^\d{15,22}$/.test(id));
}

/** The team that sees the AI assistant on every server: the owner, PETTO_DEVELOPER_IDS and TICKET_AI_TESTER_IDS. */
export function isTicketAiTeam(astro: any, userId: string | undefined): boolean {
  if (!userId) return false;
  return isPettoOwner(astro, userId) || list(astro, 'PETTO_DEVELOPER_IDS').includes(userId) || list(astro, 'TICKET_AI_TESTER_IDS').includes(userId);
}

/**
 * The AI assistant of the tickets is a beta: open to the team on any server they can open, and to every manager of a server that staff
 * listed in TICKET_AI_GUILD_IDS. The normal server access (getGuildSession) is checked on top of this by the page and its route.
 */
export function canUseTicketAi(astro: any, userId: string | undefined, guildId: string): boolean {
  return isTicketAiTeam(astro, userId) || list(astro, 'TICKET_AI_GUILD_IDS').includes(guildId);
}
