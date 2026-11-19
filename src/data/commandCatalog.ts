import generated from './commands.generated.json';
import { commandText } from './commandText';

export type CommandRow = readonly [name: string, syntax: string, description: string];
type CatalogLocale = 'en' | 'es' | 'pt-BR';

/** One subcommand: `path` is [subcommand] or [group, subcommand]; `words` and `groupWords` are other words typed in place of them with the prefix. */
interface GeneratedLeaf {
  path: string[];
  desc: Record<CatalogLocale, string>;
  args: { name: string; required: boolean }[];
  words: string[];
  groupWords: string[];
  shortcuts: string[];
  permissions: string | null;
}

interface GeneratedCommand {
  name: string;
  category: string;
  contextMenu: boolean;
  slash?: boolean;
  // `/ban` takes the options of this subcommand directly; the paths (`users`, `temp`) that have no slash form.
  slashFlatten?: string;
  slashHidden?: string[];
  // Options only the prefix reads, by subcommand (none today: `/ban` and `/mute` take the optional `duration` too).
  slashHiddenOptions?: Record<string, string[]>;
  // The order of the options in the `/` menu when it is not the one the prefix reads (`/ban <user> [duration] [reason] [delete_message_days]`).
  slashOptionOrder?: string[];
  aliases: string[];
  description: string;
  subcommands: string[];
  args: { name: string; required: boolean }[];
  // A command with subcommands: one entry for each subcommand (and each subcommand of a group), so the page can list each one on its own row.
  leaves?: GeneratedLeaf[];
  // Only /action: its actions with their group, the words that reach them with the prefix and their description in each language.
  actions?: { name: string; group: string; aliases: string[]; desc: Record<CatalogLocale, string> }[];
}

const categoryOf: Record<string, string[]> = {
  moderation: ['banlist', 'mutelist', 'jaillist', 'jailsetup', 'warnescalation', 'imagemute', 'imageunmute', 'reactionmute', 'reactionunmute', 'protect', 'mod', 'modtools', 'staff', 'sanctionmessage', 'ban', 'case', 'channel', 'hardban', 'kick', 'massban', 'masskick', 'massmute', 'massunban', 'massunmute', 'masswarn', 'mute', 'note', 'nuke', 'pauseinvites', 'role', 'softban', 'tempban', 'tempmute', 'timeout', 'unban', 'unmute', 'voice', 'warn', 'snipe', 'history', 'jail', 'unjail', 'purge', 'mhistory', 'lockdown', 'appeals', 'antinuke', 'antiscam', 'clearinvites', 'imute', 'rmute', 'nickname', 'raid', 'stripstaff', 'thread'],
  tickets: ['ticket', 'quickreply', 'forum', 'forumconfig'],
  leveling: ['levels', 'level', 'rank', 'leaderboard', 'rep'],
  giveaways: ['giveaway', 'giveawaypreset', 'giveawaytemplate'],
  automation: ['automation', 'message', 'automod', 'autoresponder', 'autothread', 'customcommand', 'disablecommand', 'honeypot', 'roletrigger', 'rolequota', 'reaction', 'reactionrole', 'starboard', 'monkeyboard', 'clownboard', 'stickymessage', 'stickyroles', 'timer', 'voicemaster', 'responder', 'panel', 'vanity', 'guildtag', 'identity', 'feed', 'messagelinks'],
  community: ['community', 'social', 'contributions', 'specialchannels', 'remind', 'invites', 'afk', 'me', 'birthday', 'profilehistory', 'boosterrole', 'report', 'poll', 'counter', 'steal', 'partner', 'partnerconfig', 'uploads', 'uploadconfig', 'request', 'requestconfig', 'form', 'review', 'profile', 'profileconfig', 'quests', 'globalranking', 'votes', 'confession', 'confess', 'suggestion', 'suggest', 'counting', 'rollouts', 'imageonly', 'linkonly'],
  onboarding: ['greet', 'welcome', 'leave', 'boost', 'dmonjoin', 'poj', 'joinrole', 'verify', 'bumpreminder', 'agedrole', 'messagerole'],
  logging: ['logs'],
  info: ['support', 'rolemembers', 'servericon', 'serverbanner', 'serversplash', 'topcommands', 'ai', 'feedback', 'bot', 'search', 'activity', 'activityboard', 'variables', 'avatar', 'banner', 'botinfo', 'channelinfo', 'color', 'emojiinfo', 'jumbo', 'minecraft', 'github', 'roblox', 'steam', 'twitch', 'youtube', 'lastfm', 'deezer', 'itunes', 'wikipedia', 'anilist', 'pokemon', 'package', 'tmdb', 'chess', 'modrinth', 'crypto', 'currency', 'animal', 'firstmessage', 'inviteinfo', 'permissions', 'ping', 'premium', 'roleinfo', 'roles', 'emojis', 'channels', 'boosters', 'bots', 'inrole', 'serverinfo', 'snowflake', 'spotify', 'summary', 'uptime', 'userinfo', 'usercosmetics', 'version', 'calc', 'time', 'weather', 'wiki', 'choose', 'roll', 'server', 'user', 'stats'],
  setup: ['customize', 'prefix', 'embed', 'help', 'permission', 'alias', 'backup', 'moderation', 'security', 'setup', 'webhook', 'sender', 'cmdconfig', 'myprefix', 'restrictcommand', 'language', 'editembed', 'send', 'pagination'],
  // `action` stands for every interaction action (hug, pat, slap...): they are the subcommands of /action, and each gets its own row below.
  roleplay: ['action', 'game', '8ball', 'rps', 'ship', 'quote', 'image', 'uwu', 'coinflip', 'wouldyourather', 'neverhaveiever', 'truthordare'],
};

// Owner-only support tools and the message context menu are not part of the public reference.
const hidden = new Set(['guilddebug', 'guildsend', 'leaveguild', 'botstatus', 'slots', 'perf', 'bots', 'Report Message', 'Report User']);

// Each module has a `!<module>config` card (and every other command a generated one); they are explained once in `!cmdconfig`, not one by one.
const listedNames = new Set(Object.values(categoryOf).flat());
const isModuleCard = (name: string) => name.endsWith('config') && name !== 'cmdconfig' && !listedNames.has(name);

const commands = (generated as GeneratedCommand[]).filter((c) => !hidden.has(c.name) && !isModuleCard(c.name));
const byName = new Map(commands.map((c) => [c.name, c]));

const localeIndex: Record<CatalogLocale, 0 | 1 | 2> = { en: 0, es: 1, 'pt-BR': 2 };
const MAX_ARGS_SHOWN = 6;
const MAX_ALSO_SHOWN = 6;

const argsText = (args: { name: string; required: boolean }[]) => {
  const shown = args.slice(0, MAX_ARGS_SHOWN).map((a) => (a.required ? `<${a.name}>` : `[${a.name}]`));
  return [...shown, ...(args.length > MAX_ARGS_SHOWN ? ['...'] : [])].join(' ');
};

// Most commands are prefix commands (shown with the default prefix !); only the ones registered with Discord are shown with /.
// A command with subcommands has no entry of its own: each subcommand is a row (`leafRows`).
function syntaxOf(cmd: GeneratedCommand): string {
  const mark = cmd.slash ? '/' : '!';
  const args = argsText(cmd.args);
  return args ? `${mark}${cmd.name} ${args}` : `${mark}${cmd.name}`;
}

/**
 * One row for each subcommand of a command, and for each subcommand of a group (`!ticket panel create`): its full name, its own arguments and description,
 * and the other ways to type it: the slash form when the command is a slash command, the short commands that reach it (`!lock`), the aliases of the command
 * (`!tk close`) and the words typed in place of the subcommand. The name is what the search of the page looks at.
 */
/** The slash form of the subcommand a command takes directly (`/ban <user> [duration] [reason] [delete_message_days]`): its arguments, without the ones only the prefix reads. */
function slashFlat(cmd: GeneratedCommand, leaf: GeneratedLeaf, path: string): string {
  const hidden = new Set(cmd.slashHiddenOptions?.[path] ?? []);
  const order = cmd.slashOptionOrder ?? [];
  const rank = (name: string) => { const at = order.indexOf(name); return at === -1 ? order.length : at; };
  const args = argsText(leaf.args.filter((arg) => !hidden.has(arg.name)).sort((a, b) => rank(a.name) - rank(b.name)));
  return args ? `/${cmd.name} ${args}` : `/${cmd.name}`;
}

function leafRows(cmd: GeneratedCommand, lang: CatalogLocale): (readonly [string, string, string, string[]])[] {
  return (cmd.leaves ?? []).map((leaf) => {
    const path = leaf.path.join(' ');
    const also = [
      ...(cmd.slash && !(cmd.slashHidden ?? []).some((hidden) => path === hidden || path.startsWith(`${hidden} `)) ? (cmd.slashFlatten ? (path === cmd.slashFlatten ? [slashFlat(cmd, leaf, path)] : []) : [`/${cmd.name} ${path}`]) : []),
      ...leaf.shortcuts.map((alias) => `!${alias}`),
      ...cmd.aliases.map((alias) => `!${alias} ${path}`),
      ...leaf.words.map((word) => `!${cmd.name} ${word}`),
      ...leaf.groupWords.map((word) => `!${cmd.name} ${word} ${leaf.path[leaf.path.length - 1]}`),
    ].filter((value, index, list) => list.indexOf(value) === index).slice(0, MAX_ALSO_SHOWN);
    const args = argsText(leaf.args);
    return [`${cmd.name} ${path}`, `!${cmd.name} ${path}${args ? ` ${args}` : ''}`, leaf.desc[lang] ?? leaf.desc.en, also] as const;
  });
}

/**
 * The rows of the actions of /action: `!hug [user]` with the slash form (`/action love hug`) and the other words that reach it (`!hf`) next
 * to it. The curated text of an action (commandText) wins over the one of the bot's catalog.
 */
function actionRows(cmd: GeneratedCommand, lang: CatalogLocale): (readonly [string, string, string, string[]])[] {
  return (cmd.actions ?? []).map((action) => [
    action.name,
    `!${action.name} [user]`,
    commandText[action.name]?.[localeIndex[lang]] ?? action.desc[lang] ?? action.desc.en,
    [`/${cmd.name} ${action.group} ${action.name}`, ...action.aliases.map((alias) => `!${alias}`)],
  ] as const);
}

export function commandRows(categoryId: string, lang: CatalogLocale): CommandRow[] {
  return (categoryOf[categoryId] ?? []).flatMap((name) => {
    const cmd = byName.get(name);
    if (cmd?.actions) return actionRows(cmd, lang) as unknown as CommandRow[];
    // The services of the Integrations category have a section each (data/integrationSections.ts), not a row in Info.
    if (!cmd || (cmd as GeneratedCommand & { integration?: unknown }).integration) return [];
    if (cmd.leaves?.length) return leafRows(cmd, lang) as unknown as CommandRow[];
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
    for (const leaf of cmd.leaves ?? []) {
      if (!leaf.path.length || leaf.path.length > 2) problems.push(`"${cmd.name}" has a subcommand with a path of ${leaf.path.length} words`);
      for (const lang of Object.keys(localeIndex) as CatalogLocale[]) if (!leaf.desc?.[lang]) problems.push(`"${cmd.name} ${leaf.path.join(' ')}" has no description in ${lang}`);
    }
  }
  for (const name of listed) if (!byName.has(name)) problems.push(`"${name}" is listed but no longer exists in the bot`);
  return problems;
}

export interface CatalogCommand { name: string; category: string; desc: string; aliases: string[]; slash: boolean; permissions: string | null }

/** Every public command with its category, its description in `lang`, its aliases and the Discord permission it asks for. */
export function catalogCommands(lang: CatalogLocale): CatalogCommand[] {
  return Object.entries(categoryOf).flatMap(([category, names]) => names.flatMap((name) => {
    const cmd = byName.get(name) as (GeneratedCommand & { permissions?: string | null }) | undefined;
    if (!cmd) return [];
    return [{ name, category, desc: commandText[name]?.[localeIndex[lang]] ?? cmd.description, aliases: cmd.aliases ?? [], slash: Boolean(cmd.slash), permissions: cmd.permissions ?? null }];
  }));
}
