// Who can use each command, the way the bot decides it (petto-bot src/events/messageCreateCommands.js), for the Permissions and
// Command coverage pages. In order, a command is refused when:
//   1. it is disabled in the server or in that channel (`disabled_commands`, !disablecommand),
//   2. the member lacks the Discord permission the command asks for (its default_member_permissions; a moderation role set in
//      the moderation settings also lets its members use the moderation commands),
//   3. the member's Petto level is below the level set for the command (`permission_groups` + `command_permission_levels`),
//   4. the command is restricted to some roles and the member has none of them (`command_restrictions`, !restrictcommand).
// The server owner and Administrators skip 2 to 4 (Discord itself lets them through 2); nothing skips 1.
import { catalogCommands } from '../data/commandCatalog';
import { useTranslations } from '../i18n/ui';

export const PERMISSION_NAMES: [bigint, string][] = [
  [1n << 3n, 'Administrator'], [1n << 5n, 'Manage Server'], [1n << 28n, 'Manage Roles'], [1n << 4n, 'Manage Channels'], [1n << 2n, 'Ban Members'],
  [1n << 1n, 'Kick Members'], [1n << 40n, 'Timeout Members'], [1n << 13n, 'Manage Messages'], [1n << 27n, 'Manage Nicknames'], [1n << 29n, 'Manage Webhooks'],
  [1n << 30n, 'Manage Expressions'], [1n << 33n, 'Manage Events'], [1n << 34n, 'Manage Threads'], [1n << 7n, 'View Audit Log'], [1n << 22n, 'Mute Members'],
  [1n << 24n, 'Move Members'], [1n << 23n, 'Deafen Members'], [1n << 17n, 'Mention Everyone'], [1n << 0n, 'Create Invite'],
];

export function permissionNames(bits: string | null): string[] {
  if (!bits) return [];
  let value: bigint;
  try { value = BigInt(bits); } catch { return []; }
  if (value === 0n) return [];
  return PERMISSION_NAMES.filter(([flag]) => (value & flag) === flag).map(([, name]) => name);
}

export interface AccessCommand {
  name: string; category: string; categoryTitle: string; desc: string; aliases: string[]; slash: boolean;
  /** The Discord permission bits the command asks for ("0" or null: nobody needs one). */
  permissions: string | null; permissionNames: string[];
  level: number; restrictRoles: string[]; disabledServer: boolean; disabledChannels: string[];
}

export interface AccessRows {
  levels: { command_name: string; required_level: number }[];
  restrictions: { command: string; role_id: string }[];
  disabled: { command: string; channel_id: string | null }[];
}

type Lang = 'en' | 'es' | 'pt-BR';

export function categoryTitles(lang: Lang): Record<string, string> {
  const t = useTranslations(lang) as any;
  return Object.fromEntries((t.commandsPage.categories as { id: string; title: string }[]).map((c) => [c.id, c.title]));
}

/** Every public command (roleplay left out: nobody gates hugs) with what the server set for it. */
export function accessCommands(lang: Lang, rows: AccessRows): AccessCommand[] {
  const titles = categoryTitles(lang);
  const level = new Map(rows.levels.map((r) => [r.command_name, Number(r.required_level) || 0]));
  const restrict = new Map<string, string[]>();
  for (const r of rows.restrictions) restrict.set(r.command, [...(restrict.get(r.command) ?? []), String(r.role_id)]);
  const server = new Set(rows.disabled.filter((d) => !d.channel_id).map((d) => d.command));
  const channels = new Map<string, string[]>();
  for (const d of rows.disabled) if (d.channel_id) channels.set(d.command, [...(channels.get(d.command) ?? []), String(d.channel_id)]);
  return catalogCommands(lang).filter((c) => c.category !== 'roleplay').map((c) => ({
    name: c.name, category: c.category, categoryTitle: titles[c.category] ?? c.category, desc: c.desc, aliases: c.aliases, slash: c.slash,
    permissions: c.permissions, permissionNames: permissionNames(c.permissions),
    level: level.get(c.name) ?? 0, restrictRoles: restrict.get(c.name) ?? [], disabledServer: server.has(c.name), disabledChannels: channels.get(c.name) ?? [],
  }));
}

/** A command that can change the server or punish people: it asks for a Discord permission, or it is in a staff category. */
export function isSensitive(c: AccessCommand): boolean {
  return c.permissionNames.length > 0 || ['moderation', 'setup'].includes(c.category);
}
