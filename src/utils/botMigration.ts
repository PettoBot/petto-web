// Moving from another bot: turns the variables of a welcome, goodbye or custom message written for MEE6, Carl-bot, Dyno, ProBot or Nekotina into Petto's.
// Only text is converted here. A bot can not read the settings of another bot, so the member brings the message and Petto rewrites it.
// The lists of variables are the ones in the official docs of each bot (read on 2026-11-18). ProBot writes them with square brackets ([user]) and Nekotina
// with double braces ({{user}}). The website of Welcomer (welcomer.gg) does not let its docs be read, so its list is not here yet: for it nothing is
// guessed and the text is left as it is.
import variables from '../data/variables.generated.json';

export type BotId = 'mee6' | 'carl' | 'dyno' | 'probot' | 'nekotina' | 'welcomer';

export interface BotInfo {
  id: BotId;
  name: string;
  /** false: the variables of this bot are not in this file yet, so no text is converted. */
  verified: boolean;
  /** Where the list of variables was read from. */
  source: string;
  /** The day it was read. */
  checkedOn: string;
}

export const BOTS: BotInfo[] = [
  { id: 'mee6', name: 'MEE6', verified: true, source: 'https://wiki.mee6.xyz/en/plugins/welcome_and_goodbye', checkedOn: '2026-11-18' },
  { id: 'carl', name: 'Carl-bot', verified: true, source: 'https://docs.carl.gg/greetings', checkedOn: '2026-11-18' },
  { id: 'dyno', name: 'Dyno', verified: true, source: 'https://docs.dyno.gg/en/modules/welcome', checkedOn: '2026-11-18' },
  { id: 'probot', name: 'ProBot', verified: true, source: 'https://docs.probot.io/docs/getting-started/variables', checkedOn: '2026-11-18' },
  { id: 'nekotina', name: 'Nekotina', verified: true, source: 'https://nekotina.com/guides/welcome-message', checkedOn: '2026-11-18' },
  { id: 'welcomer', name: 'Welcomer', verified: false, source: 'https://welcomer.gg', checkedOn: '2026-11-18' },
];

export const isBotId = (value: unknown): value is BotId => BOTS.some((bot) => bot.id === value);

/** Why a variable could not be turned into one of Petto's. The page writes the sentence of each one. */
export type UnsupportedHint = 'hash' | 'math' | 'bot-joined' | 'mention-name' | 'role-name' | 'channel-name' | 'no-equivalent' | 'command-argument' | 'unknown';

export interface Change { from: string; to: string; count: number }
export interface Unsupported { token: string; hint: UnsupportedHint; count: number }
export interface Conversion {
  text: string;
  changes: Change[];
  unsupported: Unsupported[];
  /** false: the bot has no list of variables here yet and the text came back as it went in. */
  verified: boolean;
}

type Rule = { to: string } | { unsupported: UnsupportedHint };

// What each bot writes between the braces (in lower case) and what Petto writes for it.
const MEE6: Record<string, Rule> = {
  'user': { to: '{user}' }, 'user.mention': { to: '{user.mention}' }, 'user.id': { to: '{user.id}' }, 'user.name': { to: '{user.name}' },
  'user.discriminator': { to: '{user_discrim}' }, 'user.idname': { to: '{user.name}' }, 'user.avatar_url': { to: '{user.avatar}' },
  'user.avatar': { unsupported: 'hash' }, 'user.bot': { to: '{user.bot}' },
  'server': { to: '{server_name}' }, 'server.name': { to: '{server_name}' }, 'server.id': { to: '{server_id}' }, 'server.icon_url': { to: '{server_icon}' },
  'server.icon': { unsupported: 'hash' }, 'server.owner_id': { to: '{server_owner_id}' }, 'server.owner': { to: '{server_owner}' },
  'server.region': { to: '{server_locale}' }, 'server.member_count': { to: '{server_membercount}' }, 'server.verification_level': { to: '{server_verification}' },
  'server.joined_at': { unsupported: 'bot-joined' },
};

const CARL: Record<string, Rule> = {
  'mention': { to: '{user.mention}' }, 'user': { to: '{user.name}' }, 'server': { to: '{server_name}' }, 'user(id)': { to: '{user.id}' },
  'user(proper)': { to: '{user.name}' }, 'server(members)': { to: '{server_membercount}' }, 'ord:{server(members)}': { to: '{server_membercount_ordinal}' },
};

const DYNO: Record<string, Rule> = {
  'user': { to: '{user.mention}' }, 'avatar': { to: '{user.avatar}' }, 'username': { to: '{user.name}' }, 'name': { to: '{user.name}' },
  'server': { to: '{server_name}' }, 'channel': { to: '{channel.name}' }, 'date': { to: '{date}' }, 'everyone': { to: '@everyone' }, 'here': { to: '@here' },
};

// ProBot writes [user] with square brackets: its welcome (docs.probot.io, Variables), its leveling messages and its autoresponders.
const PROBOT: Record<string, Rule> = {
  'user': { to: '{user.mention}' }, 'inviter': { to: '{inviter}' }, 'server': { to: '{server_name}' }, 'username': { to: '{user.name}' },
  'invitername': { to: '{inviter.name}' }, 'membercount': { to: '{server_membercount}' }, 'invites': { unsupported: 'no-equivalent' },
  'level': { to: '{level}' }, 'oldlevel': { to: '{level_previous}' }, 'user.username': { to: '{user.name}' }, 'user.tag': { to: '{user.name}' },
};

// Nekotina writes {{user}} with double braces: its welcome guide and its custom commands (nekotina.com/guides).
const NEKOTINA: Record<string, Rule> = {
  'user': { to: '{user.mention}' }, 'username': { to: '{user.name}' }, 'server': { to: '{server_name}' }, 'members': { to: '{server_membercount}' }, 'date': { to: '{date}' },
  'user.mention': { to: '{user.mention}' }, 'user.name': { to: '{user.name}' },
};

const TABLES: Partial<Record<BotId, Record<string, Rule>>> = { mee6: MEE6, carl: CARL, dyno: DYNO, probot: PROBOT, nekotina: NEKOTINA };

/** What a variable looks like in each bot: the part between the marks is what the table above is asked for. */
const PATTERNS: Partial<Record<BotId, string>> = {
  probot: String.raw`\[([A-Za-z][\w.]*)\](?!\()`, // [text](link) is a link, not a variable
  nekotina: String.raw`\{\{\s*([^{}]*?)\s*\}\}`,
};
const CURLY = String.raw`\{([^{}]*)\}`;

/** The names Petto already has (`user.name`, `server_name`, `choose`...), so a message that is already Petto's is left alone. */
const petto = new Set<string>();
for (const group of (variables as { en: { vars: { tok: string }[] }[] }).en) {
  for (const entry of group.vars) petto.add(entry.tok.replace(/^\{|\}$/g, '').split(/[:(]/)[0].toLowerCase());
}

const bump = <T extends { count: number }>(list: T[], same: (item: T) => boolean, make: () => T) => {
  const found = list.find(same);
  if (found) found.count += 1; else list.push(make());
};

/** Carl-bot's `{random: a ~ b ~ c}` is Petto's `{choose:a|b|c}`: it splits by `~` and, when there is none, by `,`. */
function randomList(inner: string): string | null {
  const body = inner.replace(/^random\s*:/i, '');
  const parts = (body.includes('~') ? body.split('~') : body.split(',')).map((part) => part.trim()).filter(Boolean);
  return parts.length > 0 ? `{choose:${parts.join('|')}}` : null;
}

/** Turns the variables of a message written for another bot into Petto's. Everything that is not a variable stays as it is. */
export function convertMessage(bot: BotId, text: string): Conversion {
  const info = BOTS.find((item) => item.id === bot)!;
  const table = TABLES[bot];
  if (!info.verified || !table) return { text, changes: [], unsupported: [], verified: false };

  const changes: Change[] = [];
  const unsupported: Unsupported[] = [];
  const done = (from: string, to: string) => from !== to && bump(changes, (c) => c.from === from && c.to === to, () => ({ from, to, count: 1 }));
  const failed = (token: string, hint: UnsupportedHint) => bump(unsupported, (u) => u.token === token, () => ({ token, hint, count: 1 }));

  let out = text;
  // Carl-bot writes one variable inside another: this one goes first, before the braces are read one by one.
  if (bot === 'carl') {
    out = out.replace(/\{ord:\{server\(members\)\}\}/gi, (whole) => { done(whole, '{server_membercount_ordinal}'); return '{server_membercount_ordinal}'; });
  }

  out = out.replace(new RegExp(PATTERNS[bot] ?? CURLY, 'g'), (whole, inner: string) => {
    const key = inner.trim().toLowerCase();
    if (!key) return whole;
    // [Staff] or [x] in a ProBot text can be plain words: only the variables ProBot has are touched, and nothing else is reported.
    if (bot === 'probot') {
      const rule = table[key];
      if (!rule) return whole;
      if ('to' in rule) { done(whole, rule.to); return rule.to; }
      failed(whole, rule.unsupported); return whole;
    }
    if (bot === 'nekotina' && /^arg\./.test(key)) { failed(whole, 'command-argument'); return whole; }
    if (bot === 'dyno') {
      if (key.startsWith('@') && key.length > 1) { failed(whole, 'mention-name'); return whole; }
      if (key.startsWith('&') && key.length > 1) { failed(whole, 'role-name'); return whole; }
      if (key.startsWith('#') && key.length > 1) { failed(whole, 'channel-name'); return whole; }
    }
    if (bot === 'carl') {
      if (/^random\s*:/i.test(key)) {
        const converted = randomList(inner.trim());
        if (converted) { done(whole, converted); return converted; }
        failed(whole, 'unknown'); return whole;
      }
      if (/^math\s*:/i.test(key)) { failed(whole, 'math'); return whole; }
    }
    const rule = table[key];
    if (rule) {
      if ('to' in rule) { done(whole, rule.to); return rule.to; }
      failed(whole, rule.unsupported); return whole;
    }
    // Already one of Petto's: nothing to do, and nothing to report.
    if (petto.has(key.split(/[:(]/)[0])) return whole;
    failed(whole, 'unknown');
    return whole;
  });

  return { text: out, changes, unsupported, verified: true };
}

/** The text with the sample member and server of the dashboard in place of Petto's variables, to show how it will read. */
export function previewText(text: string, values: Record<string, { text: string }>): string {
  return text
    .replace(/\{choose:([^{}]*)\}/gi, (_, list: string) => list.split('|')[0] ?? '')
    .replace(/\{newline\}/gi, '\n')
    .replace(/\{([^{}:]+)\}/g, (whole, name: string) => values[name.trim()]?.text ?? values[name.trim().toLowerCase()]?.text ?? whole);
}

/** The things another bot does that Petto has a page for. The page of the dashboard of each one is in FEATURE_PAGES. */
export type FeatureId =
  | 'welcome' | 'reaction-roles' | 'levels' | 'custom-commands' | 'autoresponders' | 'polls' | 'giveaways' | 'feeds' | 'birthdays' | 'boards' | 'timers'
  | 'voicemaster' | 'moderation' | 'sticky-roles' | 'automod' | 'logging' | 'suggestions' | 'permissions' | 'sticky-messages' | 'tickets' | 'forms' | 'join-roles' | 'prefix' | 'embeds';

/** Where each one lives in the dashboard of a server (after `/dash/guild/<id>/`). */
export const FEATURE_PAGES: Record<FeatureId, string> = {
  'welcome': 'welcome', 'reaction-roles': 'automation?section=reaction-roles', 'levels': 'leveling?section=settings', 'custom-commands': 'automation?section=custom-commands',
  'autoresponders': 'automation?section=autoresponders', 'polls': 'community?section=polls', 'giveaways': 'giveaways?section=settings', 'feeds': 'feeds',
  'birthdays': 'birthdays', 'boards': 'boards', 'timers': 'automation?section=timers', 'voicemaster': 'automation?section=voicemaster', 'moderation': 'moderation?section=cases',
  'sticky-roles': 'automation?section=sticky-roles', 'automod': 'automod', 'logging': 'logging', 'suggestions': 'suggestions', 'permissions': 'permissions',
  'sticky-messages': 'automation?section=sticky-messages', 'tickets': 'tickets?section=panels', 'forms': 'forms', 'join-roles': 'join-roles', 'prefix': 'general?section=settings',
  'embeds': 'embeds',
};

/** What each bot does, from its own docs and pages (the same rows of the guides of the blog), in the order of the guide. ProBot and Welcomer are empty until their docs can be read. */
export const CHECKLISTS: Record<BotId, FeatureId[]> = {
  mee6: ['welcome', 'reaction-roles', 'levels', 'custom-commands', 'autoresponders', 'polls', 'giveaways', 'feeds', 'birthdays', 'boards', 'timers', 'voicemaster', 'prefix'],
  carl: ['reaction-roles', 'moderation', 'sticky-roles', 'automod', 'logging', 'custom-commands', 'suggestions', 'welcome', 'permissions', 'boards', 'sticky-messages', 'feeds', 'levels'],
  dyno: ['automod', 'tickets', 'custom-commands', 'autoresponders', 'giveaways', 'forms', 'reaction-roles', 'join-roles', 'boards', 'levels', 'timers', 'feeds'],
  // The modules of docs.probot.io that have a page in Petto. Colors, Temp Links, Anti-Raid and VIP Protection are left out: they have no page that does the same.
  probot: ['welcome', 'autoresponders', 'embeds', 'levels', 'join-roles', 'logging', 'reaction-roles', 'voicemaster', 'automod', 'boards', 'tickets'],
  // What nekotina.com/guides explains: the welcome message, the custom commands and the autoroles. The rest of the bot is not read yet.
  nekotina: ['welcome', 'custom-commands', 'join-roles'],
  welcomer: [],
};

/** The pieces of any move, in order: they are the same for every bot. */
export const MOVE_STEPS = ['keep-both', 'write-down', 'quick-setup', 'messages', 'features', 'test', 'remove-old'] as const;
export type MoveStep = typeof MOVE_STEPS[number];

/** A line of variables in the syntax of each bot, shown empty as a hint in the box of the converter (no words, so it reads the same in every language). */
export const SAMPLE_TEXT: Record<BotId, string> = {
  mee6: '{user.mention} {server.name} {server.member_count}',
  carl: '{mention} {server} {ord:{server(members)}}',
  dyno: '{user} {server} {channel}',
  probot: '[user] [server] [memberCount]',
  nekotina: '{{user}} {{server}} {{members}}',
  welcomer: '',
};
