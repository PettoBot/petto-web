import { CONFIG_SCHEMA, type ColumnSpec } from './configYamlSchema';

// The configuration file of a server ("Config Management"): every module's settings as commented YAML, read-only. This file holds what the
// file contains and how it is written; configYaml.ts reads the rows. It has no imports from the site, so a script can build a file from fake rows.

export interface ModuleRead {
  /** Where the module's rows come from. */
  table: string;
  /** `one`: a single row of settings; `many`: a list of rows; `count`: only how many rows. */
  mode: 'one' | 'many' | 'count';
  /** Extra PostgREST filter (for example `ended=eq.false`). */
  filter?: string;
  /** PostgREST order (for example `level.asc`); only used by lists. */
  order?: string;
  /** Most rows shown in a list (the real total is still written as `<key>_count`). */
  limit?: number;
  /** Only these columns (the rest of the table is left out). */
  only?: string[];
}
export interface ModuleDef extends ModuleRead {
  key: string;
  about: string;
  /** Write the settings straight under the section instead of under their own key. */
  flat?: boolean;
}
export interface SectionDef { key: string; about: string; modules: ModuleDef[] }
export interface ModuleData { rows: any[] | null; total: number | null }

const one = (key: string, table: string, about: string, extra: Partial<ModuleDef> = {}): ModuleDef => ({ key, table, mode: 'one', about, ...extra });
const many = (key: string, table: string, about: string, extra: Partial<ModuleDef> = {}): ModuleDef => ({ key, table, mode: 'many', about, ...extra });

// The order of the dashboard menu. Keys that other parts of the site read (the tiles of the page) are marked with "tile".
export const SECTIONS: SectionDef[] = [
  { key: 'permissions', about: 'Who can use which commands', modules: [
    many('groups', 'permission_groups', 'Permission groups and their level', { order: 'level.desc' }),
    many('command_levels', 'command_permission_levels', 'The level each command asks for', { order: 'command_name.asc' }),
    many('dashboard_access', 'dash_access', 'Roles that can open parts of this dashboard'),
    many('command_restrictions', 'command_restrictions', 'Commands limited to a role'),
  ] },
  { key: 'design', about: 'Saved embeds and image cards (their names only)', modules: [
    many('embed_templates', 'embed_templates', 'Saved embeds', { only: ['name'], order: 'name.asc', limit: 200 }), // tile
    many('image_cards', 'image_cards', 'Image cards', { only: ['name'], order: 'name.asc', limit: 200 }), // tile
  ] },
  { key: 'moderation', about: 'Protection tools', modules: [
    one('automod', 'automod_config', 'Word filter, spam, raids and new accounts'), // tile
    one('antinuke', 'antinuke_config', 'Anti-nuke and panic mode'), // tile
    many('antinuke_rules', 'antinuke_rules', 'Anti-nuke rules, one per kind of action'),
    one('scam', 'scam_config', 'Scam and phishing links'),
    many('honeypots', 'honeypots', 'Bait channels'),
    many('role_triggers', 'role_triggers', 'What happens to a member who is given a role'),
    one('role_trigger_limits', 'role_trigger_settings', 'How many actions role triggers may take at once'),
    one('lockdown', 'lockdown_config', 'Server lockdown'),
    one('jail', 'jail_config', 'Jail role and channel'),
    many('silent_channels', 'automod_silent_channels', 'Channels where writing is punished'),
    many('warn_escalation_rules', 'warn_escalation_rules', 'What the warns add up to', { order: 'warn_count.asc' }),
    many('sanction_messages', 'sanction_templates', 'Texts of the messages that come with a sanction'),
    one('message_links', 'message_link_settings', 'Previews of links to messages'),
  ] },
  { key: 'appeals', about: 'Appeals of sanctions', modules: [
    one('settings', 'appeal_config', 'Appeals settings'),
    many('forms', 'appeal_forms', 'Appeal forms', { order: 'name.asc' }),
  ] },
  { key: 'logging', about: 'Which channel gets each kind of event', modules: [
    many('routed_events', 'log_entries', 'One line per event kind and the channel that gets it', { order: 'event.asc' }), // tile
    many('ignored', 'log_ignored', 'Channels, roles and users that are not logged'),
  ] },
  { key: 'leveling', about: 'XP, levels, rewards and the rank card', modules: [
    one('settings', 'level_config', 'Leveling settings', { flat: true }),
    many('rewards', 'level_rewards', 'Roles given at a level', { order: 'level.asc', limit: 200 }), // tile
    many('multipliers', 'level_multipliers', 'XP multipliers of roles and channels'),
    many('milestone_rewards', 'milestone_rewards', 'Rewards for milestones'),
  ] },
  { key: 'automation', about: 'Commands, replies, timers and other automatic things', modules: [
    many('custom_commands', 'custom_commands', 'Custom commands', { order: 'name.asc' }), // tile
    many('autoresponders', 'auto_responders', 'Autoresponders'), // tile
    many('sticky_messages', 'sticky_messages', 'Messages pinned to the bottom of a channel'),
    many('reaction_roles', 'reaction_roles', 'Reaction and button roles'), // tile
    many('reaction_triggers', 'reaction_triggers', 'Words that make the bot react'),
    many('reaction_messages', 'reaction_message_configs', 'Channels where the bot adds reactions'),
    many('disabled_commands', 'disabled_commands', 'Commands turned off'),
    many('aliases', 'command_aliases', 'Command aliases', { order: 'name.asc' }),
    many('auto_threads', 'auto_threads', 'Channels that open a thread for every message'),
    many('timers', 'auto_messages', 'Repeating timers'), // tile
    many('webhooks', 'managed_webhooks', 'Webhooks made by Petto (their tokens are never shown)'),
    many('feeds', 'feeds', 'Feeds of other services'), // tile
    many('counters', 'server_counters', 'Live counter channels'),
    many('button_replies', 'button_responders', 'Buttons that answer or give roles'),
    one('voicemaster', 'voice_configs', 'Temporary voice channels'),
    one('sticky_roles', 'sticky_roles_config', 'Give roles back to members who return'),
    many('senders', 'sender_identities', 'Name and picture used to send messages'),
  ] },
  { key: 'community', about: 'Community features', modules: [
    one('reports', 'report_config', 'Member reports'),
    one('booster_roles', 'booster_role_config', 'Roles that boosters make for themselves'),
    one('reputation', 'reputation_config', 'Reputation points'),
    one('requests', 'request_config', 'Requests'),
    one('profiles', 'profile_config', 'Member reviews'),
    one('uploads', 'upload_config', 'Uploads'),
    one('partners', 'partner_config', 'Partnerships'),
    one('suggestions', 'suggestion_config', 'Suggestions'),
    one('confessions', 'confession_config', 'Anonymous confessions'),
    one('counting', 'counting_config', 'Counting game'),
    one('birthdays', 'birthday_config', 'Birthdays'),
    one('quests', 'quest_config', 'Quest announcements'),
    one('rollouts', 'rollout_config', 'Rollouts'),
    one('invites', 'invite_config', 'How invites are counted'),
    many('invite_rewards', 'invite_rewards', 'Roles given for invites'),
    one('stats', 'stats_config', 'Server statistics'),
    one('counter_announcements', 'counter_announce_config', 'Announcements when a counter reaches a goal'),
  ] },
  { key: 'boards', about: 'Boards, media-only channels and forums', modules: [
    many('starboard', 'starboards', 'Starboard'),
    many('monkeyboard', 'monkeyboards', 'Monkeyboard'),
    many('clownboard', 'clownboards', 'Clownboard'),
    many('media_only_channels', 'media_only_channels', 'Channels that only take media'),
    many('forums', 'forum_setups', 'Forum setups'),
  ] },
  { key: 'vanity', about: 'Roles given for a word in the profile or a server tag', modules: [
    many('vanity_rules', 'vanity_rules', 'Rules for words in the profile'),
    many('guild_tag_rules', 'guildtag_rules', 'Rules for server tags'),
  ] },
  { key: 'onboarding', about: 'Welcome, leave, boost, verification and bump messages', modules: [
    one('member_events', 'member_events_config', 'Welcome, leave and boost messages', { flat: true }), // tile
    one('verification', 'verification_config', 'Verification'),
    one('bump', 'bump_reminders', 'Bump reminders'),
    one('ping_on_join', 'poj_config', 'Ping on join'),
    many('ping_on_join_channels', 'poj_channels', 'Channels used by ping on join'),
    many('join_roles', 'join_roles', 'Roles given when someone joins'),
  ] },
  { key: 'tickets', about: 'Tickets', modules: [
    one('settings', 'ticket_settings', 'Ticket settings'),
    many('panels', 'ticket_panels', 'Panels'),
    many('support_types', 'ticket_categories', 'Support types', { order: 'label.asc' }), // tile
    many('forms', 'ticket_forms', 'Ticket forms'),
    many('quick_replies', 'ticket_replies', 'Quick replies', { order: 'name.asc' }),
    many('blocklist', 'ticket_blacklist', 'Members and roles that cannot open tickets'),
    one('ai', 'ticket_ai_settings', 'AI assistant for tickets'),
  ] },
  { key: 'giveaways', about: 'Giveaways', modules: [
    one('settings', 'giveaway_config', 'Giveaway settings', { flat: true }),
    { key: 'running_now', table: 'giveaways', mode: 'count', filter: 'ended=eq.false', about: 'Giveaways running now' },
    many('presets', 'giveaway_presets', 'Presets', { order: 'name.asc' }),
  ] },
  { key: 'forms', about: 'Forms and applications', modules: [
    one('settings', 'form_config', 'Forms settings'),
    many('forms', 'forms', 'Forms', { order: 'name.asc' }),
    many('panels', 'form_panels', 'Panels'),
  ] },
];

export const GUILD_COLUMNS = ['prefix', 'prefixes', 'mute_role_id', 'image_mute_role_id', 'reaction_mute_role_id', 'language', 'setup_channel_id', 'bot_nickname', 'bot_avatar_url', 'bot_banner_url', 'bot_description', 'bot_name_style', 'updated_at'];

// ---------------------------------------------------------------------------------------------------------------------------------
// Comments: what each setting does. The exact ones first; the rest is worded from the name of the column.
const NOTE: Record<string, string> = {
  enabled: 'true turns it on, false turns it off',
  channel_id: 'Channel it uses (id)',
  role_id: 'Role it uses (id)',
  embed_template: 'Name of a saved embed to send',
  message: 'Text of the message (variables allowed)',
  action: 'What happens to the member',
  threshold: 'How many it takes',
  emoji: 'Emoji it uses',
  color: 'Color of the embed (a number)',
  name: 'Name',
  label: 'Text on the button or in the list',
  interval_ms: 'Time between runs (milliseconds)',
  duration_ms: 'How long it lasts (milliseconds)',
  hour: 'Hour of the day (0 to 23)',
  sections: 'Parts of the form (shortened)',
  messages: 'Texts it sends (shortened)',
  // automod
  word_filter_enabled: 'true to delete messages with a banned word',
  word_filter_action: 'What happens when a banned word is written (warn, mute, kick, delete)',
  banned_words: 'Words that are not allowed',
  anti_spam_enabled: 'true to stop spam (repeats, mentions, invites, caps)',
  max_mentions: 'Most mentions a message may have',
  allowed_invite_codes: 'Discord invite codes that are allowed',
  anti_raid_enabled: 'true to react when many members join at once',
  raid_join_threshold: 'Joins inside the window that count as a raid',
  raid_window_seconds: 'Window to count joins (seconds)',
  raid_action: 'What happens in a raid (alert, kick, lockdown)',
  immune_role_ids: 'Roles the automod never touches (ids)',
  anti_alt_enabled: 'true to act on very new accounts',
  anti_alt_min_age_days: 'Minimum age of an account (days)',
  anti_alt_action: 'What happens to a new account (kick, flag)',
  repeat_threshold: 'Repeated messages before the spam rule acts',
  repeat_window_seconds: 'Window to count repeated messages (seconds)',
  caps_percent: 'Percent of capital letters that counts as shouting',
  caps_min_length: 'Shortest message the caps rule looks at',
  max_message_length: 'Longest message allowed (0 for no limit)',
  max_lines: 'Most lines a message may have (0 for no limit)',
  exempt_channel_ids: 'Channels the rule ignores (ids)',
  allowed_link_domains: 'Domains that are allowed in links',
  strike_limit: 'Strikes before the member is muted (0 for off)',
  strike_window_minutes: 'Time strikes are counted for (minutes)',
  strike_mute_minutes: 'How long the strike mute lasts (minutes)',
  no_avatar_enabled: 'true to act on accounts without a picture',
  no_avatar_action: 'What happens to an account without a picture',
  // antinuke
  action_threshold: 'Dangerous actions allowed inside the window',
  window_seconds: 'Window to count actions (seconds)',
  whitelist_ids: 'Members the protection never touches (ids)',
  whitelist_role_ids: 'Roles the protection never touches (ids)',
  admin_ids: 'Members who may change the protection (ids)',
  owner_only: 'true so only the owner can change the protection',
  dm_owner: 'true to send the owner a message when it acts',
  panic_enabled: 'true to lock the server when many actions happen',
  panic_threshold: 'Alerts inside the window that start panic mode',
  panic_window_minutes: 'Window to count alerts (minutes)',
  panic_lockdown_minutes: 'How long panic mode lasts (minutes)',
  panic_on_raid: 'true to start panic mode on a raid',
  alert_channel_id: 'Channel that gets the alerts (id)',
  // scam
  timeout_minutes: 'How long a timeout lasts (minutes)',
  delete_messages: 'true to delete the scam messages',
  delete_minutes: 'How far back messages are deleted (minutes)',
  channels_threshold: 'Channels the same text is sent to before it counts',
  scan_text: 'true to look inside the text of messages',
  scan_new_accounts: 'true to be stricter with new accounts',
  new_account_hours: 'Age that counts as a new account (hours)',
  dm_user: 'true to send the member a message',
  ping_role_id: 'Role that is pinged (id)',
  // honeypot
  punishment: 'What happens to who writes there (ban, softban, kick)',
  panel_mode: 'What the bait channel shows (default, custom, none)',
  panel_text: 'Text shown in the bait channel',
  panel_template: 'Name of the saved embed shown there',
  dm_member: 'true to tell the member why',
  reinvite: 'true to send a new invite after a softban',
  // leveling
  xp_min: 'Least XP for a message',
  xp_max: 'Most XP for a message',
  xp_per_vc_minute: 'XP per minute in a voice channel',
  cooldown_seconds: 'Time between two rewarded messages (seconds)',
  curve_a: 'Level curve, part a',
  curve_b: 'Level curve, part b',
  curve_c: 'Level curve, part c',
  difficulty: 'How hard each level is',
  rounding: 'Round the XP of a level to a multiple of this',
  max_level: 'Highest level',
  notify_mode: 'Where level-up messages go (off, reply, channel, dm)',
  notify_message: 'Text of the level-up message',
  notify_every: 'Announce every this many levels',
  role_mode: 'Keep only the highest reward role, or all of them (highest, all)',
  ignored_channel_ids: 'Channels that give no XP (ids)',
  join_xp: 'XP given to a new member',
  join_level: 'Level given to a new member',
  voice_enabled: 'true to give XP for voice',
  rank_style: 'How /rank looks (card, embed, both)',
  min_message_chars: 'Shortest message that gives XP',
  anti_repeat: 'true to give no XP for repeated messages',
  daily_xp_cap: 'Most XP a day (0 for no limit)',
  daily_bonus_xp: 'XP of the first message of the day',
  streak_bonus_xp: 'Extra XP per day of the streak',
  streak_max_days: 'Longest streak that adds XP (days)',
  xp_multiplier: 'XP multiplier of the whole server',
  multiplier_mode: 'How several multipliers combine (highest, stack, sum)',
  multiplier_cap: 'Highest total multiplier',
  vote_boost_enabled: 'true so voters get extra XP',
  no_xp_role_ids: 'Roles that give no XP (ids)',
  only_xp_role_ids: 'Only these roles give XP (ids, empty for everyone)',
  keep_xp: 'true to keep the XP of a member who leaves (off: it is erased)',
  restore_roles: 'true to give reward roles back to a returning member',
  leaderboard_public: 'true to share the leaderboard on the website',
  leaderboard_slug: 'Address of the public leaderboard',
  // tickets
  claim_mode: 'Who can claim a ticket (shared, exclusive)',
  close_requires_reason: 'true to ask for a reason to close',
  dm_user_on_close: 'true to message the member when the ticket closes',
  default_close_reason: 'Reason used when none is given',
  autoclose_inactivity_enabled: 'true to close quiet tickets',
  autoclose_inactivity_hours: 'Hours without messages before closing',
  rating_enabled: 'true to ask for a rating when a ticket closes',
  global_limit: 'Most tickets open at once in the server (0 for no limit)',
  hours_enabled: 'true to have opening hours',
  hours_timezone: 'Time zone of the opening hours',
  hours_start: 'Opening time',
  hours_end: 'Closing time',
  hours_days: 'Days open (0 is Sunday)',
  transcript_channel_id: 'Channel that gets the transcripts (id)',
  transcript_mode: 'When a transcript is sent (auto and others)',
  naming_pattern: 'Name of a ticket channel ({number} is replaced)',
  max_open_per_user: 'Most tickets a member may have open',
  support_role_ids: 'Roles that answer the ticket (ids)',
  ping_role_ids: 'Roles that are pinged (ids)',
  // giveaways
  entry_mode: 'How members enter (button or reaction)',
  reaction: 'Reaction used to enter',
  min_level: 'Lowest level to enter',
  // member events
  welcome_channel_id: 'Channel that welcomes new members (id)',
  welcome_message: 'Text of the welcome message',
  leave_channel_id: 'Channel for goodbyes (id)',
  boost_channel_id: 'Channel for boost thank-yous (id)',
  boost_level_message: 'Text when the server reaches a boost level',
  dm_join_message: 'Direct message sent to new members',
  unverified_role_id: 'Role of members who have not verified (id)',
  verified_role_id: 'Role given after verifying (id)',
  method: 'How members verify',
  thankyou: 'Text that thanks the member who bumped',
  pingable: 'true to ping the role when it is time to bump',
  // community
  cooldown_hours: 'Time between two uses (hours)',
  role_limit: 'Most roles a booster can make',
  share_max: 'Most members a booster can share the role with',
  filtered_words: 'Words that cannot be in a role name',
  staff_role_id: 'Staff role (id)',
  up_emoji: 'Emoji to vote for',
  down_emoji: 'Emoji to vote against',
  start_number: 'Number the count starts at',
  allow_double: 'true so one member may count twice in a row',
  math: 'true to accept math expressions',
  utc_offset_minutes: 'Time zone as minutes from UTC',
  fake_days: 'Age under which an invited account does not count (days)',
  ignored_role_ids: 'Roles that are ignored (ids)',
  ignored_user_ids: 'Members that are ignored (ids)',
  selfstar: 'true so the author can star their own message',
  attachments: 'true to show attachments',
  jumpurl: 'true to add a link to the message',
  timestamp: 'true to add the time',
  extra_emojis: 'More emojis that count (list)',
  comparison: 'How the word is compared',
  priority: 'Order the rules are checked in',
  normalization: 'How text is cleaned before comparing (shortened)',
  match_mode: 'How the trigger is matched',
  trigger: 'Word or text that starts it',
  reply: 'What the bot answers',
  response: 'What the bot answers (shortened)',
  code: 'Code of the command (shortened)',
  trigger_type: 'What starts the command',
  trigger_text: 'Text that starts the command',
  channel_ids: 'Channels it works in (ids; empty for all)',
  role_ids: 'Roles it applies to (ids)',
  case_sensitive: 'true to tell capitals apart',
  command: 'Command',
  platform: 'Service the feed follows',
  account_name: 'Account followed',
  types: 'Kinds of posts sent',
  ping_roles: 'Roles pinged for a post (ids)',
  ping_everyone: 'true to ping @everyone for a post',
  schedule: 'How often it repeats',
  at_time: 'Time of the day',
  timezone: 'Time zone',
  weekday: 'Day of the week (0 is Sunday)',
  paused: 'true while paused',
  delete_previous: 'true to delete the one sent before',
  counter_option: 'What the counter shows',
  name_template: 'Name of the channel ({count} is replaced)',
  interval_seconds: 'Time between updates (seconds)',
  creator_channel_id: 'Voice channel that makes a new one when joined (id)',
  category_id: 'Category where new channels go (id)',
  default_limit: 'People allowed in a new channel (0 for no limit)',
  default_name: 'Name of a new channel',
  slug: 'Address on the website',
  default_username: 'Name the webhook posts with',
  default_message: 'Text the webhook sends by default',
  panel_channel_id: 'Channel where the panel is posted (id)',
  review_channel_id: 'Channel where staff review (id)',
  log_channel_id: 'Channel that gets the log (id)',
  submission_channel_id: 'Channel that gets the submissions (id)',
  retention_days: 'Days answers are kept',
  mode: 'Kind of reaction role (reaction or button)',
  button_label: 'Text of the button',
  button_style: 'Color of the button',
  required_role_ids: 'Roles needed to use it (ids)',
  blocked_role_ids: 'Roles that cannot use it (ids)',
  one_pending: 'true to allow only one pending application per member',
  web_enabled: 'true to fill it in on the website',
  closes_at: 'When it closes',
  status: 'State (open, closed...)',
  questions: 'Questions (shortened)',
  fields: 'Fields (shortened)',
  data: 'Data (shortened)',
};

const UNIT: Array<[RegExp, string]> = [[/_seconds$/, 'seconds'], [/_minutes$/, 'minutes'], [/_hours$/, 'hours'], [/_days$/, 'days'], [/_ms$/, 'milliseconds'], [/_percent$/, 'percent']];

function words(col: string): string {
  const text = col.replace(/_ids?$/, '').replace(/_/g, ' ').trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : col;
}

function noteOf(col: string, kind: string): string {
  if (NOTE[col]) return NOTE[col];
  const w = words(col);
  if (/_role_ids$/.test(col)) return `${w} roles (ids)`;
  if (/_role_id$/.test(col)) return `${w} role (id)`;
  if (/_channel_ids$/.test(col)) return `${w} channels (ids)`;
  if (/_channel_id$/.test(col)) return `${w} channel (id)`;
  if (/_category_ids?$/.test(col)) return `${w} categories (ids)`;
  if (/_user_ids$/.test(col)) return `${w} members (ids)`;
  if (/_template$/.test(col)) return `${w}: name of a saved embed`;
  if (/_message$/.test(col)) return `${w} text (variables allowed)`;
  if (/_ids$/.test(col)) return `${w} (ids)`;
  for (const [re, unit] of UNIT) if (re.test(col)) return `${w} (${unit})`;
  if (kind === 'bool') return `${w}: true or false`;
  if (kind === 'json') return `${w} (shortened)`;
  return w;
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Values.
const TEXT_MAX = 200;
const LIST_MAX = 200;

function cut(text: string, max = TEXT_MAX): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** A string as YAML: single quotes, or double quotes (JSON) when it has line breaks or other characters a single-quoted line cannot hold. */
export function quote(text: string): string {
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f-\u009f\u2028\u2029\ufeff]/.test(text)) return JSON.stringify(text).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029').replace(/\ufeff/g, '\\ufeff').replace(/\u007f/g, '\\u007f');
  return `'${text.replace(/'/g, "''")}'`;
}

function oneLine(text: string): string {
  return text.replace(/\r\n|\r|\n/g, ' ').replace(/\s+/g, ' ').trim();
}

export function scalar(kind: string, value: unknown, fallback: unknown): { text: string; note?: string } {
  let v = value === undefined ? fallback : value;
  if (kind === 'list') {
    if (v === null || v === undefined) return { text: '[]' };
    const items = Array.isArray(v) ? v : [];
    const shown = items.slice(0, LIST_MAX).map((x) => (typeof x === 'number' && Number.isFinite(x) ? String(x) : quote(cut(oneLine(String(x)), 120))));
    return { text: `[${shown.join(', ')}]`, note: items.length > LIST_MAX ? `${LIST_MAX} of ${items.length} shown` : undefined };
  }
  if (v === null || v === undefined) return { text: 'null' };
  if (kind === 'bool') return { text: v === true || v === 't' || v === 'true' ? 'true' : 'false' };
  if (kind === 'num') {
    const n = typeof v === 'number' ? v : Number(v);
    return { text: Number.isFinite(n) ? String(n) : 'null' };
  }
  if (kind === 'json') {
    if (typeof v !== 'string') { try { v = JSON.stringify(v); } catch { v = ''; } }
    return { text: quote(cut(oneLine(String(v)))) };
  }
  if (typeof v === 'object') { try { v = JSON.stringify(v); } catch { v = ''; } }
  const text = String(v);
  // Texts with line breaks keep them (written with escapes); the rest is one single-quoted line.
  const short = cut(text);
  return { text: /[\r\n]/.test(short) ? quote(short.replace(/\r\n?/g, '\n')) : quote(short) };
}

function empty(kind: string, value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true;
  if (kind === 'list') return !Array.isArray(value) || value.length === 0;
  return false;
}

const COMMENT_AT = 46;
function line(indent: number, body: string, note?: string): string {
  const left = `${' '.repeat(indent)}${body}`;
  if (!note) return left;
  return `${left}${' '.repeat(Math.max(2, COMMENT_AT - left.length))}# ${oneLine(note)}`;
}

// ---------------------------------------------------------------------------------------------------------------------------------
export function columnsOf(module: Pick<ModuleRead, 'table' | 'only'>): readonly ColumnSpec[] {
  const all = CONFIG_SCHEMA[module.table] ?? [];
  return module.only ? all.filter(([name]) => module.only!.includes(name)) : all;
}

function renderOne(mod: ModuleDef, data: ModuleData | undefined, indent: number): string[] {
  const out: string[] = [];
  const columns = columnsOf(mod);
  const row = data?.rows ? data.rows[0] ?? {} : null;
  let at = indent;
  if (!mod.flat) {
    out.push(row ? line(indent, `${mod.key}:`, mod.about) : line(indent, `${mod.key}: null`, `${mod.about} (not available yet)`));
    at = indent + 2;
  } else if (!row) {
    out.push(line(indent, `# ${mod.about}: not available yet`));
  }
  if (!row) return out;
  for (const [name, kind, fallback] of columns) {
    const { text, note } = scalar(kind, row[name], fallback);
    out.push(line(at, `${name}: ${text}`, note ? `${noteOf(name, kind)} (${note})` : noteOf(name, kind)));
  }
  return out;
}

function renderMany(mod: ModuleDef, data: ModuleData | undefined, indent: number): string[] {
  const out: string[] = [];
  const rows = data?.rows ?? null;
  if (!rows) {
    out.push(line(indent, `${mod.key}_count: null`, `${mod.about} (not available yet)`));
    out.push(line(indent, `${mod.key}: null`));
    return out;
  }
  const total = data?.total ?? rows.length;
  out.push(line(indent, `${mod.key}_count: ${total}`, mod.about));
  if (!rows.length) { out.push(line(indent, `${mod.key}: []`)); return out; }
  const columns = columnsOf(mod);
  out.push(line(indent, `${mod.key}:`, total > rows.length ? `${rows.length} of ${total} shown` : undefined));
  for (const row of rows) {
    const shown = columns.filter(([name, kind], i) => i === 0 || !empty(kind, row[name]));
    shown.forEach(([name, kind, fallback], i) => {
      const { text } = scalar(kind, row[name], fallback);
      out.push(`${' '.repeat(indent + 2)}${i === 0 ? '- ' : '  '}${name}: ${text}`);
    });
    if (!shown.length) out.push(`${' '.repeat(indent + 2)}- {}`);
  }
  return out;
}

function renderCount(mod: ModuleDef, data: ModuleData | undefined, indent: number): string[] {
  const total = data?.rows ? data.total ?? data.rows.length : null;
  return [line(indent, `${mod.key}: ${total === null ? 'null' : total}`, total === null ? `${mod.about} (not available yet)` : mod.about)];
}

export interface RenderInput {
  guildId: string;
  guildName: string;
  /** The row of `guilds` (null when it could not be read). */
  guild: Record<string, any> | null;
  /** What each module read, by `<section>.<module>`. */
  data: Record<string, ModuleData>;
}

const BANNER = [
  '  ██████╗ ███████╗████████╗████████╗ ██████╗ ',
  '  ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔═══██╗',
  '  ██████╔╝█████╗     ██║      ██║   ██║   ██║',
  '  ██╔═══╝ ██╔══╝     ██║      ██║   ██║   ██║',
  '  ██║     ███████╗   ██║      ██║   ╚██████╔╝',
  '  ╚═╝     ╚══════╝   ╚═╝      ╚═╝    ╚═════╝ ',
].map((l) => `#${l}`).join('\n');

export function renderConfigYaml(input: RenderInput): string {
  const g = input.guild;
  const val = (name: string, kind: string, fallback: unknown) => scalar(kind, g?.[name], fallback).text;
  const lines: string[] = [
    BANNER,
    '#',
    `#   This is a read-only snapshot of the configuration of the server: ${oneLine(input.guildName)}. To change a setting, use its own page of the dashboard.`,
    '#   Every setting is here, even the ones you never touched: they show their real default (0, false, null or []).',
    '#',
    '#   How to read it:',
    '#     - A line is   setting: value   # what it does',
    "#     - Ids of channels, roles and members are quoted text, like '668827416747048962'.",
    "#     - A list is written ['a', 'b']. Several items (commands, rewards...) start with a dash and also have a <name>_count line.",
    '#     - Long texts are shortened. Tokens, webhook links and other secrets are never written here.',
    '#     - null means "not set". "not available yet" means the part could not be read right now.',
    '',
    `guild_id: ${quote(input.guildId)}`,
    line(0, `language: ${val('language', 'text', 'en')}`, 'Language of the answers of the bot in this server'),
    line(0, `prefix: ${val('prefix', 'text', '!')}`, 'Prefix of the commands written as messages'),
    line(0, `prefixes: ${val('prefixes', 'list', [])}`, 'More prefixes that also work'),
    line(0, `mute_role_id: ${val('mute_role_id', 'text', null)}`, 'Role given by a mute (id)'),
    line(0, `image_mute_role_id: ${val('image_mute_role_id', 'text', null)}`, 'Role that stops pictures and files (id)'),
    line(0, `reaction_mute_role_id: ${val('reaction_mute_role_id', 'text', null)}`, 'Role that stops reactions (id)'),
    line(0, `setup_channel_id: ${val('setup_channel_id', 'text', null)}`, 'Channel where the bot first answered (id)'),
    '',
    line(0, 'bot_profile:', 'Set from the Customize page'),
    `  nickname: ${val('bot_nickname', 'text', null)}`,
    `  avatar_url: ${val('bot_avatar_url', 'text', null)}`,
    `  banner_url: ${val('bot_banner_url', 'text', null)}`,
    `  description: ${val('bot_description', 'text', null)}`,
    `  name_style: ${val('bot_name_style', 'json', null)}`,
  ];
  for (const section of SECTIONS) {
    lines.push('', line(0, `${section.key}:`, section.about));
    for (const mod of section.modules) {
      const data = input.data[`${section.key}.${mod.key}`];
      const part = mod.mode === 'one' ? renderOne(mod, data, 2) : mod.mode === 'many' ? renderMany(mod, data, 2) : renderCount(mod, data, 2);
      lines.push(...(mod.flat ? part.map((l) => l) : part));
    }
  }
  lines.push('', `updated_at: ${val('updated_at', 'time', null)}`, '');
  return lines.join('\n');
}
