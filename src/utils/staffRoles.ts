// Which roles may use each moderation action without the permission of Discord (the same thing `/moderation allow action:ban role:@Mod` does in the bot, src/utils/moderationPermissions.js).
// It is stored as permission groups named `__petto_moderation_role__:<command>` with level 50, one for each command of the action. This file writes them from the dashboard with the
// same names, so the bot reads them as its own. The list of actions and their commands has to be the one of the bot.
export const GROUP_PREFIX = '__petto_moderation_role__:';
export const ROLE_GROUP_LEVEL = 50;
export const STAFF_ACTIONS: { id: string; commands: string[]; label: string; hint: string }[] = [
  { id: 'ban', commands: ['ban', 'hardban', 'tempban'], label: 'Ban', hint: 'Ban a member, for good or for a time.' },
  { id: 'kick', commands: ['kick'], label: 'Kick', hint: 'Kick a member out.' },
  { id: 'softban', commands: ['softban'], label: 'Softban', hint: 'Ban and unban at once, to clean their messages.' },
  { id: 'unban', commands: ['unban'], label: 'Unban', hint: 'Lift a ban.' },
  { id: 'mute', commands: ['mute', 'tempmute', 'timeout'], label: 'Mute', hint: 'Mute or timeout a member.' },
  { id: 'unmute', commands: ['unmute'], label: 'Unmute', hint: 'Lift a mute.' },
  { id: 'warn', commands: ['warn'], label: 'Warn', hint: 'Warn a member.' },
  { id: 'case', commands: ['case'], label: 'Cases', hint: 'Look at and edit cases.' },
  { id: 'note', commands: ['note'], label: 'Notes', hint: 'Write notes about a member.' },
  { id: 'role', commands: ['role'], label: 'Roles', hint: 'Give and take roles from one member.' },
  { id: 'channel', commands: ['channel'], label: 'Channels', hint: 'Manage a channel.' },
  { id: 'voice', commands: ['voice'], label: 'Voice', hint: 'Move, mute and disconnect members in voice.' },
  { id: 'nuke', commands: ['nuke'], label: 'Nuke', hint: 'Clone a channel to empty it.' },
];

interface Context { apiUrl: string; headers: Record<string, string>; guildId: string }
interface Group { id: number; name: string; members: { subject_type: string; subject_id: string }[] }

async function groupsOf({ apiUrl, headers, guildId }: Context): Promise<Group[]> {
  const res = await fetch(`${apiUrl}/rest/v1/permission_groups?guild_id=eq.${guildId}&select=id,name&order=id.asc`, { headers });
  const all: { id: number; name: string }[] = res.ok ? await res.json() : [];
  const mine = all.filter((group) => String(group.name).startsWith(GROUP_PREFIX));
  if (!mine.length) return [];
  const memRes = await fetch(`${apiUrl}/rest/v1/permission_group_members?group_id=in.(${mine.map((group) => group.id).join(',')})&select=group_id,subject_type,subject_id`, { headers });
  const members: { group_id: number; subject_type: string; subject_id: string }[] = memRes.ok ? await memRes.json() : [];
  return mine.map((group) => ({ id: group.id, name: group.name, members: members.filter((member) => member.group_id === group.id) }));
}

/** The roles of each action, from the groups of its commands. */
export async function loadStaffRoles(context: Context): Promise<Record<string, string[]>> {
  const groups = await groupsOf(context);
  const out: Record<string, string[]> = {};
  for (const action of STAFF_ACTIONS) {
    const roles = action.commands
      .map((command) => groups.find((group) => group.name === GROUP_PREFIX + command))
      .flatMap((group) => (group ? group.members.filter((member) => member.subject_type === 'role').map((member) => member.subject_id) : []));
    out[action.id] = [...new Set(roles)];
  }
  return out;
}

/** Lets a role use the action (every command of it). False when the action is not known or a write failed. */
export async function allowRole(context: Context, actionId: string, roleId: string): Promise<boolean> {
  const action = STAFF_ACTIONS.find((entry) => entry.id === actionId);
  if (!action) return false;
  const { apiUrl, headers, guildId } = context;
  // The base group (@everyone, level 0) exists in every server that uses levels: the bot makes it before it makes any other.
  await fetch(`${apiUrl}/rest/v1/permission_groups?on_conflict=guild_id,name`, { method: 'POST', headers: { ...headers, Prefer: 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify({ guild_id: guildId, name: '@everyone', level: 0, is_base: true }) }).catch(() => null);
  for (const command of action.commands) {
    const res = await fetch(`${apiUrl}/rest/v1/permission_groups?on_conflict=guild_id,name`, {
      method: 'POST', headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({ guild_id: guildId, name: GROUP_PREFIX + command, level: ROLE_GROUP_LEVEL }),
    });
    if (!res.ok) return false;
    const rows = await res.json().catch(() => []);
    const groupId = Array.isArray(rows) ? rows[0]?.id : rows?.id;
    if (!groupId) return false;
    const added = await fetch(`${apiUrl}/rest/v1/permission_group_members?on_conflict=group_id,subject_type,subject_id`, {
      method: 'POST', headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ group_id: groupId, subject_type: 'role', subject_id: roleId }),
    });
    if (!added.ok) return false;
  }
  return true;
}

/** Takes a role away from the action; a group that is left with nobody is deleted (as the bot does). */
export async function denyRole(context: Context, actionId: string, roleId: string): Promise<boolean> {
  const action = STAFF_ACTIONS.find((entry) => entry.id === actionId);
  if (!action) return false;
  const { apiUrl, headers } = context;
  const groups = await groupsOf(context);
  for (const command of action.commands) {
    const group = groups.find((entry) => entry.name === GROUP_PREFIX + command);
    if (!group) continue;
    const res = await fetch(`${apiUrl}/rest/v1/permission_group_members?group_id=eq.${group.id}&subject_type=eq.role&subject_id=eq.${encodeURIComponent(roleId)}`, { method: 'DELETE', headers });
    if (!res.ok) return false;
    const left = group.members.filter((member) => !(member.subject_type === 'role' && member.subject_id === roleId));
    if (left.length === 0) await fetch(`${apiUrl}/rest/v1/permission_groups?id=eq.${group.id}&guild_id=eq.${context.guildId}`, { method: 'DELETE', headers });
  }
  return true;
}
