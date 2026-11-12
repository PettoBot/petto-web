// Activity leaderboards ("the most active members of the chat and of the voice, in a channel, a card for the month, the week and the day, edited every hour").
// The rules are the bot's (petto-bot src/utils/activityLeaderboard.ts and src/db/activityLeaderboards.ts, table `activity_leaderboards`): keep both equal.
// Plain JavaScript so scripts/check-dash-activity-boards.mjs runs it with node alone.

export const KINDS = Object.freeze(['chat', 'voice']);
export const SNOWFLAKE = /^\d{15,25}$/;
/** The reasons the bot saves when it cannot write a board (`last_error`). */
export const REASONS = Object.freeze(['statsOff', 'membersOff', 'channel', 'permissions', 'error']);
/** The reasons the bot saves when it cannot give the role of the most active member (`activity_top_roles.last_error`). */
export const ROLE_REASONS = Object.freeze(['statsOff', 'membersOff', 'role', 'permissions', 'error']);

/**
 * What the form sent, checked: the kind, and a channel of the server (`channelIds` are the text and announcement channels it has).
 * Returns `{ ok: true, board: { kind, channel_id } }` or `{ ok: false, error: 'badKind' | 'badChannel' }`.
 * @param {{ kind: unknown, channelId: unknown, channelIds: string[] }} input
 */
export function validateBoard({ kind, channelId, channelIds }) {
  if (!KINDS.includes(String(kind))) return { ok: false, error: 'badKind' };
  const channel = String(channelId ?? '');
  if (!SNOWFLAKE.test(channel) || !channelIds.includes(channel)) return { ok: false, error: 'badChannel' };
  return { ok: true, board: { kind: String(kind), channel_id: channel } };
}

/** A row of `activity_leaderboards` as the page shows it (the ids of the messages are not shown). */
export function cleanBoard(row) {
  const refreshed = row?.last_refreshed_at ? new Date(row.last_refreshed_at) : null;
  const error = REASONS.includes(String(row?.last_error ?? '')) ? String(row.last_error) : null;
  return {
    kind: KINDS.includes(String(row?.kind)) ? String(row.kind) : 'chat',
    channelId: SNOWFLAKE.test(String(row?.channel_id ?? '')) ? String(row.channel_id) : '',
    refreshedAt: refreshed && Number.isFinite(refreshed.getTime()) ? refreshed.toISOString() : null,
    error,
    messages: [row?.daily_message_id, row?.weekly_message_id, row?.monthly_message_id].filter((id) => SNOWFLAKE.test(String(id ?? ''))).length,
  };
}

/** The ids of the three messages of a row that can be deleted. */
export function messageIds(row) {
  return [row?.monthly_message_id, row?.weekly_message_id, row?.daily_message_id].map((id) => String(id ?? '')).filter((id) => SNOWFLAKE.test(id));
}

/**
 * Why a server cannot have boards at all, from its row of `stats_config` (none means the defaults, all on): the statistics are off, or they are kept without members.
 * @param {{ enabled?: boolean, members_enabled?: boolean } | null | undefined} config
 * @returns {'statsOff' | 'membersOff' | null}
 */
export function statsProblem(config) {
  if (config && config.enabled === false) return 'statsOff';
  if (config && config.members_enabled === false) return 'membersOff';
  return null;
}

/** Manage Server (or Administrator, or being the owner), the same as the command: the visitor's own permissions in the server, read from Discord, never the cookie. */
export function canEditActivityBoards(guild) {
  if (!guild) return false;
  if (guild.owner) return true;
  try {
    const permissions = BigInt(guild.permissions ?? '0');
    return (permissions & 0x8n) === 0x8n || (permissions & 0x20n) === 0x20n;
  } catch {
    return false;
  }
}

/**
 * The role the form sent, checked: the kind, and a role of the server that Petto can hand out at all (`roles` are the roles of the server with `id` and `managed`; `guildId` is the
 * id of @everyone). That Petto is above the role is not checked here: the bot checks it when it gives the role and the page shows what it says.
 * Returns `{ ok: true, role: { kind, role_id } }` or `{ ok: false, error: 'badKind' | 'badRole' }`.
 * @param {{ kind: unknown, roleId: unknown, roles: { id: string, managed?: boolean }[], guildId: string }} input
 */
export function validateRole({ kind, roleId, roles, guildId }) {
  if (!KINDS.includes(String(kind))) return { ok: false, error: 'badKind' };
  const id = String(roleId ?? '');
  const role = SNOWFLAKE.test(id) && id !== String(guildId) ? roles.find((each) => String(each.id) === id) : null;
  if (!role || role.managed) return { ok: false, error: 'badRole' };
  return { ok: true, role: { kind: String(kind), role_id: id } };
}

/** A row of `activity_top_roles` as the page shows it. */
export function cleanRole(row) {
  const error = ROLE_REASONS.includes(String(row?.last_error ?? '')) ? String(row.last_error) : null;
  return {
    kind: KINDS.includes(String(row?.kind)) ? String(row.kind) : 'chat',
    roleId: SNOWFLAKE.test(String(row?.role_id ?? '')) ? String(row.role_id) : '',
    holderId: SNOWFLAKE.test(String(row?.holder_id ?? '')) ? String(row.holder_id) : null,
    error,
  };
}
