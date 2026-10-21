// Disabled commands (Automation → Disabled commands), saved in the same shape as the bot's !disablecommand
// (petto-bot src/db/disabledCommands.js): `disabled_commands (guild_id, command, channel_id)`, `command` the real name of the
// command in lower case (never an alias), `channel_id` null for the whole server, each rule once.
import generated from '../data/commands.generated.json';

interface GeneratedCommand { name: string; contextMenu: boolean; aliases: string[] }

// Turned off, nobody could turn anything back on or find out how (the bot refuses them too).
export const PROTECTED_COMMANDS = new Set(['disablecommand', 'help']);
// The bot's own limits for one `!dc`.
export const MAX_COMMANDS_AT_ONCE = 25;
export const MAX_CHANNELS_AT_ONCE = 10;

const realNames = new Map<string, string>();
for (const command of generated as GeneratedCommand[]) {
  if (command.contextMenu) continue;
  realNames.set(command.name.toLowerCase(), command.name.toLowerCase());
}
for (const command of generated as GeneratedCommand[]) {
  if (command.contextMenu) continue;
  for (const alias of command.aliases) if (!realNames.has(alias.toLowerCase())) realNames.set(alias.toLowerCase(), command.name.toLowerCase());
}

/** Every command a rule can name, for the suggestions of the input. */
export const disableableCommands = [...new Set(realNames.values())].filter((name) => !PROTECTED_COMMANDS.has(name)).sort();

/** The real name of a command written as its name or an alias, with or without a prefix, or null. */
export function realCommandName(raw: string): string | null {
  const name = String(raw ?? '').trim().replace(/^[^\p{L}\p{N}]+/u, '').toLowerCase();
  return name ? realNames.get(name) ?? null : null;
}

/** Reads "suggest, sug !rank 8ball" into real names, without repeats, and what could not be used. */
export function readCommandNames(raw: string): { names: string[]; unknown: string[]; refused: string[] } {
  const names = new Set<string>();
  const unknown: string[] = [];
  const refused = new Set<string>();
  for (const word of String(raw ?? '').split(/[\s,]+/).filter(Boolean)) {
    const name = realCommandName(word);
    if (!name) unknown.push(word.slice(0, 32));
    else if (PROTECTED_COMMANDS.has(name)) refused.add(name);
    else names.add(name);
  }
  return { names: [...names], unknown, refused: [...refused] };
}

export interface DisabledRule { id: number | string; command: string; channelId: string | null }

/** The rules grouped by place: the whole server first, then each channel, commands in alphabetical order. */
export function groupRules(rules: DisabledRule[]): { channelId: string | null; rules: DisabledRule[] }[] {
  const groups = new Map<string, DisabledRule[]>();
  for (const rule of rules) {
    const key = rule.channelId ?? '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(rule);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b)))
    .map(([key, list]) => ({ channelId: key || null, rules: list.sort((x, y) => x.command.localeCompare(y.command)) }));
}
