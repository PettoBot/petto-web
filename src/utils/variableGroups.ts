import { getVariableGroups, peekVariableGroups } from './variableRegistry';
import { getDashLang } from '../i18n/dash';

type Dt = (key: string, vars?: Record<string, unknown>) => string;

// Keep this list aligned with the bot's resolver and its contextual handlers. The choose, range,
// nextBump, and reactreply tokens are handled by dedicated logic rather than the base map.
interface VarDef { tok: string; desc: string; }
interface VarGroup { label: string; vars: VarDef[]; }

const fallbackGroups = (dt: Dt): VarGroup[] => [
  {
    label: dt('User dot notation'),
    vars: [
      { tok: '{user}', desc: dt('Mentions the user') },
      { tok: '{user.mention}', desc: dt('Mentions the user (same as {user})') },
      { tok: '{user.name}', desc: dt('Username') },
      { tok: '{user.id}', desc: dt('User ID') },
      { tok: '{user.avatar}', desc: dt('Global avatar image URL') },
      { tok: '{user.display_avatar}', desc: dt('Server avatar, falls back to global') },
      { tok: '{user.avatar_decoration}', desc: dt('Picture of their avatar decoration, empty if they have none') },
      { tok: '{user.nameplate}', desc: dt('Picture of their nameplate, empty if they have none') },
      { tok: '{user.server_tag}', desc: dt('Their server tag text (like ABC), empty if they do not show one') },
      { tok: '{user.server_tag_badge}', desc: dt('Picture of their server tag badge, empty if they have none') },
      { tok: '{user.display_name}', desc: dt('Server nickname, or username if none') },
      { tok: '{user.joined_at}', desc: dt('Date they joined this server') },
      { tok: '{user.joined_at_timestamp}', desc: dt('Unix timestamp of that join date') },
      { tok: '{user.created_at}', desc: dt('Date the account was created') },
      { tok: '{user.created_at_timestamp}', desc: dt('Unix timestamp of account creation') },
      { tok: '{user.boost}', desc: '"Yes" or "No", are they boosting' },
      { tok: '{user.boost_since}', desc: dt('Date they started boosting, or "Not boosting"') },
      { tok: '{user.boost_since_timestamp}', desc: dt('Unix timestamp of boost start') },
      { tok: '{user.color}', desc: dt('Highest role color as hex') },
      { tok: '{user.top_role}', desc: dt('Their highest role name') },
      { tok: '{user.role_list}', desc: dt('All their roles, mentioned') },
      { tok: '{user.bot}', desc: '"Yes" or "No", is it a bot account' },
      { tok: '{user.join_position}', desc: dt('Which member number they were') },
      { tok: '{user.join_position_suffix}', desc: dt('Join position with suffix (1st, 2nd...)') },
    ],
  },
  {
    label: dt('User (legacy)'),
    vars: [
      { tok: '{user_tag}', desc: dt('Username (same as {user.name})') },
      { tok: '{user_name}', desc: dt('Username') },
      { tok: '{user_avatar}', desc: dt('Avatar image URL') },
      { tok: '{user_id}', desc: dt('User ID') },
      { tok: '{user_discrim}', desc: dt('Discriminator, mostly empty on new usernames') },
      { tok: '{user_nick}', desc: dt('Server nickname, or username if none') },
      { tok: '{user_joindate}', desc: dt('Date they joined this server') },
      { tok: '{user_createdate}', desc: dt('Date the account was created') },
      { tok: '{user_displaycolor}', desc: dt('Highest role color as hex') },
      { tok: '{user_boostsince}', desc: dt('Date they started boosting, or "Not boosting"') },
    ],
  },
  {
    label: dt('Server'),
    vars: [
      { tok: '{server_name}', desc: dt('Server name') },
      { tok: '{server_id}', desc: dt('Server ID') },
      { tok: '{server_prefix}', desc: dt('The server\'s configured prefix') },
      { tok: '{server_membercount}', desc: dt('Total member count') },
      { tok: '{server_membercount_ordinal}', desc: dt('Member count with suffix (1st, 2nd...)') },
      { tok: '{server_membercount_nobots}', desc: dt('Member count excluding bots') },
      { tok: '{server_membercount_nobots_ordinal}', desc: dt('That count, with suffix') },
      { tok: '{server_botcount}', desc: dt('Number of bots in the server') },
      { tok: '{server_botcount_ordinal}', desc: dt('Bot count, with suffix') },
      { tok: '{server_icon}', desc: dt('Server icon URL') },
      { tok: '{server_rolecount}', desc: dt('Number of roles') },
      { tok: '{server_channelcount}', desc: dt('Number of channels') },
      { tok: '{server_randommember}', desc: dt('Mentions a random member') },
      { tok: '{server_randommember_tag}', desc: dt('Username of a random member') },
      { tok: '{server_randommember_nobots}', desc: dt('Mentions a random non-bot member') },
      { tok: '{server_owner}', desc: dt('Mentions the server owner') },
      { tok: '{server_owner_id}', desc: dt('Server owner\'s user ID') },
      { tok: '{server_createdate}', desc: dt('Date the server was created') },
      { tok: '{server_boostlevel}', desc: dt('Current boost level (0-3)') },
      { tok: '{server_boostcount}', desc: dt('Total boost count') },
      { tok: '{server_nextboostlevel}', desc: dt('The next boost level (1-3)') },
      { tok: '{server_nextboostlevel_required}', desc: dt('Boosts required to reach it') },
      { tok: '{server_nextboostlevel_until_required}', desc: dt('Boosts still needed to reach it') },
    ],
  },
  {
    label: dt('Guild dot notation'),
    vars: [
      { tok: '{guild.name}', desc: dt('Server name') },
      { tok: '{guild.id}', desc: dt('Server ID') },
      { tok: '{guild.count}', desc: dt('Total member count') },
      { tok: '{guild.icon}', desc: dt('Server icon URL') },
      { tok: '{guild.banner}', desc: dt('Server banner URL') },
      { tok: '{guild.owner_id}', desc: dt('Server owner\'s user ID') },
      { tok: '{guild.created_at}', desc: dt('Date the server was created') },
      { tok: '{guild.created_at_timestamp}', desc: dt('Unix timestamp of server creation') },
      { tok: '{guild.emoji_count}', desc: dt('Number of custom emojis') },
      { tok: '{guild.role_count}', desc: dt('Number of roles') },
      { tok: '{guild.boost_count}', desc: dt('Total boost count') },
      { tok: '{guild.boost_tier}', desc: dt('Boost tier, e.g. "Level 2" or "No Level"') },
      { tok: '{guild.channels_count}', desc: dt('Number of channels') },
      { tok: '{guild.vanity}', desc: dt('Vanity invite URL, if the server has one') },
      { tok: '{guild.region}', desc: dt('Server\'s preferred locale') },
      { tok: '{guild.max_members}', desc: dt('Max member capacity') },
    ],
  },
  {
    label: dt('Channel'),
    vars: [
      { tok: '{channel}', desc: dt('Mentions the current channel') },
      { tok: '{channel.mention}', desc: dt('Mentions the current channel') },
      { tok: '{channel.name}', desc: dt('Channel name') },
      { tok: '{channel.id}', desc: dt('Channel ID') },
      { tok: '{channel.topic}', desc: dt('Channel topic') },
      { tok: '{channel_name}', desc: dt('Channel name (legacy)') },
      { tok: '{channel_createdate}', desc: dt('Date the channel was created (legacy)') },
    ],
  },
  {
    label: dt('Message'),
    vars: [
      { tok: '{message_link}', desc: dt('Only where a triggering message exists (e.g. autoresponders)') },
      { tok: '{message_id}', desc: dt('ID of the triggering message') },
      { tok: '{message_content}', desc: dt('Text of the triggering message') },
    ],
  },
  {
    label: dt('Leveling'),
    vars: [
      { tok: '{level}', desc: dt('Only in the level-up message: the new level reached') },
      { tok: '{level_xp}', desc: dt('Only in the level-up message: total XP') },
      { tok: '{level_xp_needed}', desc: dt('Only in the level-up message: XP needed for the next level') },
      { tok: '{level_rank}', desc: dt('Only in the level-up message: leaderboard rank') },
      { tok: '{level_top_percent}', desc: dt('Only in the level-up message: the top percent they are in, such as 2.5') },
    ],
  },
  {
    label: dt('Giveaway'),
    vars: [
      { tok: '{gw.prize}', desc: dt('The prize') },
      { tok: '{gw.winners}', desc: dt('Number of winners') },
      { tok: '{gw.entries}', desc: dt('Current number of entries') },
      { tok: '{gw.host}', desc: dt('Mentions whoever started it') },
      { tok: '{gw.host_name}', desc: dt('The host\'s username') },
      { tok: '{gw.host_avatar}', desc: dt('The host\'s avatar image URL') },
      { tok: '{gw.duration}', desc: dt('End time, as a raw unix timestamp') },
      { tok: '{gw.timestamp}', desc: dt('End time, as a relative Discord timestamp') },
      { tok: '{gw.ends}', desc: dt('End time as a relative Discord timestamp') },
      { tok: '{gw.claim_time}', desc: dt('How long winners have to claim') },
      { tok: '{gw.reaction}', desc: dt('The entry emoji, if using reaction mode') },
      { tok: '{gw.entry_mode}', desc: '"react with" or "click on", matches entry mode' },
      { tok: '{gw.entry_text}', desc: dt('Entry instruction, based on the selected method') },
      { tok: '{gw.winner_text}', desc: dt('Winner-count text used by the giveaway') },
      { tok: '{gw.status}', desc: dt('Active or Ended') },
      { tok: '{gw.preset}', desc: dt('The bonus-entry roles list, if a preset is used') },
    ],
  },
  {
    label: dt('Custom Commands'),
    vars: [
      { tok: '{args}', desc: dt('All text after the command name') },
      { tok: '{arguments}', desc: dt('Alias for {args}') },
      { tok: '{args_raw}', desc: dt('Alias for {args}; keeps the full argument text') },
      { tok: '{arg1}', desc: dt('First argument') },
      { tok: '{arg2}', desc: dt('Second argument') },
      { tok: '{arg3}', desc: dt('Third argument') },
      { tok: '{arg4}', desc: dt('Fourth argument') },
      { tok: '{arg5}', desc: dt('Fifth argument') },
      { tok: '{arg6}', desc: dt('Sixth argument') },
      { tok: '{arg7}', desc: dt('Seventh argument') },
      { tok: '{arg8}', desc: dt('Eighth argument') },
      { tok: '{arg9}', desc: dt('Ninth argument') },
      { tok: '{arg10}', desc: dt('Tenth argument') },
      { tok: '{args_from:2}', desc: dt('All arguments starting at the given position') },
      { tok: '{arg_count}', desc: dt('Number of arguments supplied') },
      { tok: '{command_name}', desc: dt('The command name that was used') },
      { tok: '{prefix}', desc: dt('The prefix that was used') },
      { tok: '{reactreply:emoji}', desc: dt('Response flag: reacts to the sent message with this emoji; repeat it for more reactions') },
    ],
  },
  {
    label: dt('Bump'),
    vars: [
      { tok: '{user.mention}', desc: dt('Only in bump messages: mentions whoever bumped') },
      { tok: '{nextBump}', desc: dt('Only in bump messages: relative time until the next bump is allowed') },
    ],
  },
  {
    label: dt('Date'),
    vars: [
      { tok: '{date}', desc: dt('Today\'s date') },
      { tok: '{date.now}', desc: dt('Today\'s date, Pacific time') },
      { tok: '{date.utc_now}', desc: dt('Current date and time, UTC') },
      { tok: '{date.utc_timestamp}', desc: dt('Current unix timestamp') },
    ],
  },
  {
    label: dt('Functions'),
    vars: [
      { tok: '{choose:a|b|c}', desc: dt('Picks one option at random each time') },
      { tok: '{range:1-100}', desc: dt('A random whole number in that range') },
      { tok: '{newline}', desc: dt('Forces a line break') },
      { tok: '{separator}', desc: dt('A decorative divider line') },
    ],
  },
  {
    label: dt('Actions'),
    vars: [
      { tok: '{reactreply:emoji}', desc: dt('Reacts to the sent message with this emoji. If the response contains only this flag, it reacts to the triggering message instead.') },
    ],
  },
];

/**
 * The variables of the dashboard's menus (the Variables button and the typed autocomplete), as the compact JSON both read:
 * [{ l: label, v: [[token, description]] }]. The bot says which variables it understands; this built-in list is only used when it
 * cannot answer.
 */
export async function variableGroupsJson(astro: { locals?: any }, dt: Dt, options: { ask?: boolean } = {}): Promise<string> {
  // `ask: false` never calls the bot: the copy it gave lately, or the built-in list.
  const registry = options.ask === false ? peekVariableGroups() : await getVariableGroups(astro);
  const fallback = fallbackGroups(dt);
  const english = getDashLang(astro as any) === 'en';
  // The bot writes its descriptions in English. One the dashboard cannot translate (its wording is not in the catalog) takes the translated
  // description the built-in list has for the same variable, so a Spanish or Portuguese menu is not half in English.
  const known = new Map(fallback.flatMap((group) => group.vars.map((variable) => [variable.tok, variable.desc] as [string, string])));
  const describe = (tok: string, desc: string) => {
    const translated = dt(desc);
    return english || translated !== desc || !known.has(tok) ? translated : (known.get(tok) as string);
  };
  const groups: VarGroup[] = registry
    ? registry.map((group) => ({ label: dt(group.label), vars: group.vars.map((variable) => ({ tok: variable.tok, desc: describe(variable.tok, variable.desc) })) }))
    : fallback;
  return JSON.stringify(groups.map((g) => ({ l: g.label, v: g.vars.map((v) => [v.tok, v.desc]) }))).replace(/</g, '\\u003c');
}
