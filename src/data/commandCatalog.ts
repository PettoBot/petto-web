import generated from './commands.generated.json';
import { commandText } from './commandText';

export type CommandRow = readonly [name: string, syntax: string, description: string];
type CatalogLocale = 'en' | 'es' | 'pt-BR';

interface GeneratedCommand {
  name: string;
  category: string;
  contextMenu: boolean;
  aliases: string[];
  description: string;
  subcommands: string[];
  args: { name: string; required: boolean }[];
}

const categoryOf: Record<string, string[]> = {
  moderation: ['sanctionmessage', 'ban', 'case', 'channel', 'hardban', 'kick', 'massban', 'masskick', 'massmute', 'massunban', 'massunmute', 'masswarn', 'mute', 'note', 'nuke', 'pauseinvites', 'role', 'softban', 'tempban', 'tempmute', 'timeout', 'unban', 'unmute', 'voice', 'warn', 'snipe', 'history', 'jail', 'unjail', 'purge'],
  tickets: ['ticket'],
  leveling: ['level', 'rank', 'top', 'rep'],
  giveaways: ['giveaway', 'giveawaypreset', 'giveawaytemplate'],
  automation: ['automod', 'autoresponder', 'autothread', 'customcommand', 'disablecommand', 'honeypot', 'reaction', 'reactionrole', 'starboard', 'stickymessage', 'stickyroles', 'timer', 'voicemaster', 'responder', 'panel', 'vanity', 'guildtag', 'identity'],
  community: ['remind', 'invites', 'afk', 'birthday', 'boosterrole', 'report', 'poll', 'counter', 'steal', 'partner', 'partnerconfig', 'uploads', 'uploadconfig', 'request', 'requestconfig', 'review', 'profile', 'profileconfig', 'quests', 'globalranking', 'votes'],
  onboarding: ['welcome', 'leave', 'boost', 'dmonjoin', 'poj', 'joinrole', 'verify', 'bumpreminder'],
  logging: ['logs'],
  info: ['activity', 'avatar', 'banner', 'botinfo', 'channelinfo', 'color', 'emojiinfo', 'firstmessage', 'inviteinfo', 'permissions', 'ping', 'premium', 'roleinfo', 'roles', 'emojis', 'channels', 'boosters', 'inrole', 'serverinfo', 'snowflake', 'spotify', 'summary', 'uptime', 'userinfo', 'version', 'calc', 'time', 'weather', 'wiki', 'choose', 'roll'],
  setup: ['prefix', 'embed', 'help', 'permission', 'alias', 'backup', 'moderation', 'security', 'setup', 'webhook', 'sender', 'cmdconfig', 'myprefix'],
  roleplay: ['airkiss', 'angry', 'angrystare', 'bite', 'bleh', 'blush', 'boop', 'brofist', 'bye', 'cry', 'cuddle', 'dance', 'glomp', 'handhold', 'happy', 'hi', 'highfive', 'hug', 'kill', 'kiss', 'laugh', 'lick', 'no', 'nom', 'pat', 'poke', 'punch', 'sad', 'slap', 'smile', 'smug', 'tickle', 'wave', 'wink', 'yeet', 'yes', '8ball', 'rps', 'ship'],
};

// Owner-only support tools and the message context menu are not part of the public reference.
const hidden = new Set(['guilddebug', 'guildsend', 'leaveguild', 'botstatus', 'Report Message', 'Report User']);

// Each module has a `!<module>config` card (and every other command a generated one); they are explained once in `!cmdconfig`, not one by one.
const listedNames = new Set(Object.values(categoryOf).flat());
const isModuleCard = (name: string) => name.endsWith('config') && name !== 'cmdconfig' && !listedNames.has(name);

const commands = (generated as GeneratedCommand[]).filter((c) => !hidden.has(c.name) && !isModuleCard(c.name));
const byName = new Map(commands.map((c) => [c.name, c]));

const localeIndex: Record<CatalogLocale, 0 | 1 | 2> = { en: 0, es: 1, 'pt-BR': 2 };
const MAX_SUBCOMMANDS_SHOWN = 6;

function syntaxOf(cmd: GeneratedCommand): string {
  if (cmd.subcommands.length > 0) {
    const shown = cmd.subcommands.slice(0, MAX_SUBCOMMANDS_SHOWN).join('|');
    const more = cmd.subcommands.length > MAX_SUBCOMMANDS_SHOWN ? '|...' : '';
    return `/${cmd.name} <${shown}${more}>`;
  }
  const args = cmd.args.map((a) => (a.required ? `<${a.name}>` : `[${a.name}]`)).join(' ');
  return args ? `/${cmd.name} ${args}` : `/${cmd.name}`;
}

export function commandRows(categoryId: string, lang: CatalogLocale): CommandRow[] {
  return (categoryOf[categoryId] ?? []).flatMap((name) => {
    const cmd = byName.get(name);
    if (!cmd) return [];
    const text = commandText[name]?.[localeIndex[lang]] ?? cmd.description;
    return [[name, syntaxOf(cmd), text] as const];
  });
}

export function catalogProblems(): string[] {
  const listed = new Set(Object.values(categoryOf).flat());
  const problems: string[] = [];
  for (const cmd of commands) {
    if (!listed.has(cmd.name)) problems.push(`"${cmd.name}" exists in the bot but has no category`);
    if (!commandText[cmd.name]) problems.push(`"${cmd.name}" has no translated description`);
  }
  for (const name of listed) if (!byName.has(name)) problems.push(`"${name}" is listed but no longer exists in the bot`);
  return problems;
}
