import { canManageGuild, guildIconUrl } from './discord';
import { getBotGuildList, getCachedBotGuildIds, getCachedUserGuilds } from './discordCache';
import { getEnv } from './env';
import { getPremiumGuildIds } from './premium';
import { memoPerRequest } from './requestMemo';
import { botInviteUrl, splitServers } from './dashSwitcher.mjs';

export interface SwitcherServers {
  /** Discord did not answer in time, so the lists are empty for that reason (not because the account has no servers). */
  unavailable: boolean;
  mine: { id: string; name: string; icon: string | null; premium: boolean; members: number | null }[];
  invite: { id: string; name: string; icon: string | null; href: string }[];
  total: { mine: number; invite: number };
}

/**
 * The servers of the account for the server sheet and the profile overview, read like the server picker (/dash/manage) reads them: the
 * same cached lists (the account's servers, the bot's servers, its member counts), one read per request. No call of its own.
 */
export function loadSwitcherServers(astro: any, session: { userId: string; accessToken: string }): Promise<SwitcherServers> {
  return memoPerRequest(astro.request as Request | undefined, 'dash-switcher-servers', async () => {
    const request = astro.request as Request | undefined;
    const botToken = getEnv(astro, 'DISCORD_TOKEN');
    const clientId = getEnv(astro, 'DISCORD_CLIENT_ID');
    const [guilds, botIds, botList] = await Promise.all([
      getCachedUserGuilds(session.accessToken, request).catch(() => null),
      botToken ? getCachedBotGuildIds(botToken, request).catch(() => null) : Promise.resolve(new Set<string>()),
      botToken ? getBotGuildList(botToken).catch(() => []) : Promise.resolve([]),
    ]);
    const options = { canManage: canManageGuild, iconOf: (guild: any) => guildIconUrl(guild), memberCounts: new Map(botList.map((guild) => [guild.id, guild.memberCount] as [string, number | null])) };
    const split = splitServers(guilds, botIds, options);
    const premiumIds = await getPremiumGuildIds(astro, session.userId, split.mine.map((guild) => guild.id)).catch(() => new Set<string>());
    return {
      unavailable: guilds === null,
      mine: split.mine.map((guild) => ({ ...guild, premium: premiumIds.has(guild.id) })),
      invite: clientId ? split.invite.map((guild) => ({ ...guild, href: botInviteUrl(clientId, guild.id) })) : [],
      total: split.total,
    };
  });
}
