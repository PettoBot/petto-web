import { canManageGuild, getBotIdentity } from './discord';
import { getBotGuildList, getCachedBotGuildIds, getCachedUserGuilds } from './discordCache';
import { getEnv } from './env';
import { getPremiumGuildIds } from './premium';
import { getRoleAccess, type RoleAccess } from './dashAccess';
import { memoPerRequest } from './requestMemo';
import { markTiming } from './serverTiming';

export interface DashLayoutData {
  discordGuilds: any[] | null;
  botGuildIds: Set<string> | null;
  botIdentity: { name: string; icon: string | null } | null;
  /** The servers of the switcher (managed by the visitor, with Petto in them). */
  switchable: string[];
  premiumGuildIds: Set<string>;
  /** Members of the bot's servers, from the bot's saved copies (the same list the bot's server ids come from), for the switcher. */
  memberCounts: Map<string, number | null>;
  isManager: boolean;
  roleAccess: RoleAccess | null;
}

/**
 * Everything the menu of a server page needs (the visitor's servers, the bot's servers, how the bot looks, Premium, the role that lets a
 * non-manager in), read together. The session check starts it for a page read, so it runs while the page loads its own data, and the
 * layout picks up the same answer (one per request) instead of starting after the page is done.
 */
export function loadDashLayoutData(astro: any, guildId: string, user: { userId?: string; accessToken?: string }): Promise<DashLayoutData> {
  const request = astro.request as Request | undefined;
  return memoPerRequest(request, `dash-layout:${guildId}`, async () => {
    const started = performance.now();
    const botToken = getEnv(astro, 'DISCORD_TOKEN');
    const [discordGuilds, botGuildIds, botIdentity, botGuildList] = await Promise.all([
      user.accessToken ? getCachedUserGuilds(user.accessToken, request).catch(() => null) : Promise.resolve(null),
      user.accessToken && botToken ? getCachedBotGuildIds(botToken, request).catch(() => null) : Promise.resolve(null),
      botToken ? getBotIdentity(guildId, botToken, request).catch(() => null) : Promise.resolve(null),
      // Kept in the shared cache (and read from the same saved copies as the ids above), so this is not a request per page.
      user.accessToken && botToken ? getBotGuildList(botToken).catch(() => []) : Promise.resolve([]),
    ]);
    const memberCounts = new Map(botGuildList.map((guild) => [guild.id, guild.memberCount] as [string, number | null]));
    const switchable = discordGuilds && botGuildIds ? discordGuilds.filter(canManageGuild).filter((g: any) => botGuildIds.has(g.id)).map((g: any) => g.id as string) : [];
    const guildEntry = discordGuilds?.find((g: any) => g.id === guildId);
    const isManager = Boolean(guildEntry && canManageGuild(guildEntry));
    const [premiumGuildIds, roleAccess] = await Promise.all([
      user.userId ? getPremiumGuildIds(astro, user.userId, [guildId, ...switchable]).catch(() => new Set<string>()) : Promise.resolve(new Set<string>()),
      guildEntry && !isManager && user.userId ? getRoleAccess(astro, guildId, user.userId).catch(() => null) : Promise.resolve(null),
    ]);
    markTiming('layout', started);
    return { discordGuilds, botGuildIds, botIdentity, switchable, premiumGuildIds, memberCounts, isManager, roleAccess };
  });
}
