// The server switcher sheet of the dashboard menu: which servers go under "Your servers" (Petto is in them) and which under "Invite Petto"
// (the visitor manages them and Petto is not), and the address of the invite. Plain JavaScript so scripts/check-dash-profile.mjs runs it with node alone.
// It uses the lists the server picker (/dash/manage) already reads, so it adds no Discord call.

/** The most servers one list draws (a visitor with hundreds still gets a sheet that opens at once). */
export const SWITCHER_LIMIT = 100;

/**
 * Splits the servers of a visitor: where Petto is (the biggest first, then by name) and where it is not (by name).
 * @param {any[]} guilds the servers Discord lists for the visitor
 * @param {Set<string> | null} botIds the ids of the servers Petto is in (null: not known, so only the first list is empty and nothing is offered to invite)
 * @param {{ canManage: (guild: any) => boolean, iconOf: (guild: any) => string | null, memberCounts?: Map<string, number | null>, premiumIds?: Set<string>, limit?: number }} options
 * @returns {{ mine: { id: string, name: string, icon: string | null, premium: boolean, members: number | null }[], invite: { id: string, name: string, icon: string | null }[], total: { mine: number, invite: number } }}
 */
export function splitServers(guilds, botIds, { canManage, iconOf, memberCounts = new Map(), premiumIds = new Set(), limit = SWITCHER_LIMIT }) {
  if (!Array.isArray(guilds) || !botIds) return { mine: [], invite: [], total: { mine: 0, invite: 0 } };
  const named = (guild) => typeof guild?.id === 'string' && /^\d{15,25}$/.test(guild.id) && typeof guild.name === 'string';
  const manageable = guilds.filter((guild) => named(guild) && canManage(guild));
  const mine = manageable
    .filter((guild) => botIds.has(guild.id))
    .map((guild) => ({ id: guild.id, name: guild.name, icon: iconOf(guild), premium: premiumIds.has(guild.id), members: memberCounts.get(guild.id) ?? null }))
    .sort((a, b) => (b.members ?? -1) - (a.members ?? -1) || a.name.localeCompare(b.name));
  const invite = manageable
    .filter((guild) => !botIds.has(guild.id))
    .map((guild) => ({ id: guild.id, name: guild.name, icon: iconOf(guild) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return { mine: mine.slice(0, limit), invite: invite.slice(0, limit), total: { mine: mine.length, invite: invite.length } };
}

/** The address that adds Petto to one server (the same invite the server picker uses). @param {string} clientId @param {string} guildId */
export function botInviteUrl(clientId, guildId) {
  return `https://discord.com/api/oauth2/authorize?client_id=${encodeURIComponent(clientId)}&permissions=8&scope=${encodeURIComponent('bot applications.commands')}&guild_id=${encodeURIComponent(guildId)}&disable_guild_select=true`;
}

/** How many servers one page of the owner's list holds (and the most it can ask for). */
export const OWNER_PAGE = 30;
export const OWNER_PAGE_MAX = 50;

/**
 * One page of the servers the bot is in, for the owner's part of the sheet: filtered by name or ID, the biggest first, then by name.
 * @param {{ id: string, name: string, icon: string | null, memberCount: number | null }[]} guilds
 * @param {{ q?: unknown, offset?: unknown, limit?: unknown }} options
 * @returns {{ items: { id: string, name: string, icon: string | null, members: number | null }[], total: number, next: number | null }}
 */
export function pageOwnerServers(guilds, { q = '', offset = 0, limit = OWNER_PAGE } = {}) {
  const needle = typeof q === 'string' ? q.trim().toLowerCase().slice(0, 100) : '';
  const start = Math.max(0, Number.parseInt(String(offset), 10) || 0);
  const size = Math.min(OWNER_PAGE_MAX, Math.max(1, Number.parseInt(String(limit), 10) || OWNER_PAGE));
  const matching = (Array.isArray(guilds) ? guilds : [])
    .filter((g) => typeof g?.id === 'string' && /^\d{15,25}$/.test(g.id) && typeof g.name === 'string' && (!needle || g.name.toLowerCase().includes(needle) || g.id.includes(needle)))
    .sort((a, b) => (b.memberCount ?? -1) - (a.memberCount ?? -1) || a.name.localeCompare(b.name));
  const items = matching.slice(start, start + size).map((g) => ({ id: g.id, name: g.name, icon: typeof g.icon === 'string' && g.icon.startsWith('https://cdn.discordapp.com/') ? g.icon : null, members: g.memberCount ?? null }));
  return { items, total: matching.length, next: start + size < matching.length ? start + size : null };
}
