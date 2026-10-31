// Which Leveling settings depend on, or exclude, each other, written once for the page (first draw) and for its script (every change),
// and tested by scripts/check-leveling-ux.mjs. The rules follow what the bot really does (levelActions.js, levelSource.js, voiceXpJob.js):
//  - notifyLevelUp returns at once when the announcement is `off`; it answers a message only in `reply`/`channel` and has no channel in
//    a DM; the `channel` is used only with `channel`; a saved embed template replaces the simple embed.
//  - Message XP needs `enabled`; voice XP needs `voice_enabled` (not `enabled`); a member who joins gets the level OR the XP.
// Nothing here changes a value: a field a rule switches off keeps what it holds, and the page still sends it.

export interface Ctx {
  /** The text of a control. */
  v(name: string): string;
  /** Whether a switch or a checkbox is on. */
  on(name: string): boolean;
  /** A fact the form cannot see by itself: textOn, voiceOn, textNotify, voiceNotify. */
  flag(name: string): boolean;
  channelName?(id: string): string;
}

export type Entries = [string, string][];
export const ctxFromEntries = (entries: Entries, flags: Record<string, boolean> = {}, channelName?: (id: string) => string): Ctx => ({
  v: (name) => entries.find(([key]) => key === name)?.[1] ?? '',
  on: (name) => entries.some(([key]) => key === name),
  flag: (name) => Boolean(flags[name]),
  channelName,
});

const num = (ctx: Ctx, name: string) => {
  const value = Number.parseFloat(ctx.v(name));
  return Number.isFinite(value) ? value : 0;
};

/** The rules a field can name in `data-lv-dep` (several, separated by spaces: the first that applies is the reason shown). */
export const RULES = [
  'text_on', 'voice_on',
  'announce_on', 'channel_used', 'reply_used', 'no_template',
  'v_announce_on', 'v_channel_used', 'v_no_template',
  'join_xp_used', 'rank_card_used', 'notify_card_used', 'voice_card_used',
  'alone_used', 'streak_used', 'board_on',
] as const;
export type Rule = (typeof RULES)[number];

/** The key of the reason a rule switches its fields off for, or null when they are in use. */
export function reasonFor(rule: string, ctx: Ctx): string | null {
  const mode = (prefix: string) => ctx.v(`${prefix}notify_mode`) || (prefix ? 'off' : 'reply');
  const channel = (prefix: string) => {
    const m = mode(prefix);
    return m === 'channel' ? null : m === 'off' ? 'announceOff' : m === 'dm' ? 'channelDm' : 'channelReply';
  };
  switch (rule) {
    case 'text_on': return ctx.flag('textOn') ? null : 'textOff';
    case 'voice_on': return ctx.flag('voiceOn') ? null : 'voiceOff';
    case 'announce_on': return mode('') === 'off' ? 'announceOff' : null;
    case 'v_announce_on': return mode('voice_') === 'off' ? 'announceOff' : null;
    case 'channel_used': return channel('');
    case 'v_channel_used': return channel('voice_');
    case 'reply_used': return mode('') === 'dm' ? 'replyDm' : mode('') === 'off' ? 'announceOff' : null;
    case 'no_template': return ctx.v('notify_embed_template') ? 'template' : null;
    case 'v_no_template': return ctx.v('voice_notify_embed_template') ? 'template' : null;
    case 'join_xp_used': return num(ctx, 'join_level') > 0 ? 'joinLevel' : null;
    case 'rank_card_used': return ctx.v('rank_style') === 'embed' ? 'rankEmbed' : null;
    case 'notify_card_used': return !ctx.flag('textOn') ? 'textOff' : !ctx.flag('textNotify') ? 'noTextNotify' : null;
    case 'voice_card_used': return !ctx.flag('voiceOn') ? 'voiceOff' : !ctx.flag('voiceNotify') ? 'noVoiceNotify' : null;
    case 'alone_used': return num(ctx, 'voice_min_members') >= 2 ? 'aloneNeedsOne' : null;
    case 'streak_used': return num(ctx, 'streak_bonus_xp') <= 0 ? 'noStreak' : null;
    case 'board_on': return ctx.on('leaderboard_public') ? null : 'boardOff';
    default: return null;
  }
}
export const firstReason = (rules: string[], ctx: Ctx) => {
  for (const rule of rules) { const reason = reasonFor(rule, ctx); if (reason) return reason; }
  return null;
};

/** The fields that are only a message about another one (shown under a field, never switched off). Key per field name. */
export interface Problem { field: string; key: string; args?: Record<string, string | number>; /** Stops the form from being sent. */ blocks: boolean }

/** How many lines of a "10: message" box the bot would ignore (not that format, the same level twice, or over the 25 it keeps). */
export function ignoredMilestoneLines(value: string): number {
  const seen = new Set<number>();
  let kept = 0;
  let ignored = 0;
  for (const line of String(value ?? '').split(/\r?\n/)) {
    if (!line.trim()) continue;
    const match = /^\s*(\d{1,5})\s*[:|-]\s*(.+?)\s*$/.exec(line);
    const level = match ? Number(match[1]) : 0;
    if (!match || level < 1 || level > 10000 || seen.has(level) || kept >= 25) { ignored += 1; continue; }
    seen.add(level);
    kept += 1;
  }
  return ignored;
}

/**
 * The messages under the fields of a form. `initial` is the same form as it was drawn: a message that blocks the form only blocks when the
 * person changed the fields it is about, so a combination that was already saved never traps them (they can still save the rest).
 */
export function problemsFor(kind: 'settings' | 'voice' | 'rules', ctx: Ctx, initial: Ctx): Problem[] {
  const out: Problem[] = [];
  const changed = (...names: string[]) => names.some((name) => ctx.v(name) !== initial.v(name));
  if (kind === 'settings' || kind === 'voice') {
    const p = kind === 'voice' ? 'voice_' : '';
    if (kind === 'settings' && num(ctx, 'xp_min') > num(ctx, 'xp_max')) out.push({ field: 'xp_max', key: 'xpRange', blocks: changed('xp_min', 'xp_max') });
    if (ctx.v(`${p}notify_mode`) === 'channel' && !ctx.v(`${p}notify_channel_id`)) out.push({ field: `${p}notify_channel_id`, key: 'needChannel', blocks: changed(`${p}notify_mode`, `${p}notify_channel_id`) });
    const ignored = ignoredMilestoneLines(ctx.v(`${p}notify_milestones`));
    if (ignored > 0) out.push({ field: `${p}notify_milestones`, key: 'milestoneIgnored', args: { a: ignored }, blocks: false });
  }
  if (kind === 'rules') {
    const none = new Set(ctx.v('no_xp_role_ids').split('\u0001').filter(Boolean));
    const both = ctx.v('only_xp_role_ids').split('\u0001').filter((id) => none.has(id));
    if (both.length) out.push({ field: 'only_xp_role_ids', key: 'roleBoth', args: { a: both.length }, blocks: false });
  }
  return out;
}

/** The values of the MultiSelects joined in one text, so a context can answer for them (the page script does this on every change). */
export const joinIds = (ids: string[]) => ids.join('\u0001');

// ---- The line at the top of a card ---------------------------------------------------------------------------------------------

export type Labels = Record<string, string>;
export const format = (template: string, args: Record<string, string | number> = {}) => String(template ?? '').replace(/\{(\w+)\}/g, (_, key) => String(args[key] ?? ''));

/** "On · 15-25 XP per message · level-ups in #chat, every 5 levels" for the four main cards. `L` has the texts (translated by the page). */
export function statusParts(kind: 'settings' | 'voice' | 'rank' | 'rules' | 'board', ctx: Ctx, L: Labels): string[] {
  const f = (key: string, args?: Record<string, string | number>) => format(L[key] ?? key, args);
  const parts: string[] = [];
  if (kind === 'settings' || kind === 'voice') {
    const p = kind === 'voice' ? 'voice_' : '';
    const enabled = ctx.on(kind === 'voice' ? 'voice_enabled' : 'enabled');
    parts.push(enabled ? f('statusOn') : f('statusOff'));
    if (!enabled) return parts;
    parts.push(kind === 'voice' ? f('statusVoiceXp', { a: num(ctx, 'voice_xp_per_minute') }) : f('statusXp', { a: num(ctx, 'xp_min'), b: num(ctx, 'xp_max') }));
    const mode = ctx.v(`${p}notify_mode`) || (kind === 'voice' ? 'off' : 'reply');
    if (mode === 'off') parts.push(f('statusAnnounceOff'));
    else {
      const where = mode === 'dm' ? f('statusDm')
        : mode === 'channel' ? (ctx.v(`${p}notify_channel_id`) ? f('statusChannel', { a: ctx.channelName?.(ctx.v(`${p}notify_channel_id`)) ?? ctx.v(`${p}notify_channel_id`) }) : f('statusChannelUnset'))
          : f('statusReply');
      parts.push(where);
      const every = Math.max(1, Math.floor(num(ctx, `${p}notify_every`)) || 1);
      if (every > 1) parts.push(f('statusEvery', { a: every }));
      if (ctx.v(`${p}notify_embed_template`)) parts.push(f('statusTemplate', { a: ctx.v(`${p}notify_embed_template`) }));
      else if (ctx.on(`${p}notify_embed`)) parts.push(f('statusEmbed'));
    }
  } else if (kind === 'rank') {
    const style = ctx.v('rank_style');
    parts.push(style === 'embed' ? f('statusRankEmbed') : style === 'both' ? f('statusRankBoth') : f('statusRankCard'));
    if (ctx.v('notify_card')) parts.push(f('statusLevelCard', { a: ctx.v('notify_card') }));
  } else if (kind === 'rules') {
    const chars = num(ctx, 'min_message_chars');
    parts.push(chars > 0 ? f('statusMinChars', { a: chars }) : f('statusAnyMessage'));
    const cap = num(ctx, 'daily_xp_cap');
    parts.push(cap > 0 ? f('statusDailyCap', { a: cap }) : f('statusNoCap'));
    const people = num(ctx, 'voice_min_members');
    if (people >= 2) parts.push(f('statusVoicePeople', { a: people }));
    const bonus = num(ctx, 'daily_bonus_xp');
    if (bonus > 0) parts.push(f('statusDailyBonus', { a: bonus }));
  } else {
    parts.push(ctx.on('leaderboard_public') ? f('statusBoardOn') : f('statusBoardOff'));
  }
  return parts;
}
