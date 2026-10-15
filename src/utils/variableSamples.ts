// Values for the bot's {variable} tokens. The dashboard previews use sample data, and a test send
// uses the real user and server. Tokens that only exist in some events get a sample so a message
// reads naturally, and anything not listed here is left as written.

export interface TokenContext {
  userId: string;
  userName: string;
  serverName: string;
  memberCount: number | null;
}

export interface TokenValue { text: string; mention?: boolean }

export const sampleContext: TokenContext = { userId: '293504726505357312', userName: 'Liam', serverName: 'Petto Support', memberCount: 1204 };

export function tokenValues(ctx: TokenContext): Record<string, TokenValue> {
  const mention: TokenValue = { text: `@${ctx.userName}`, mention: true };
  const name: TokenValue = { text: ctx.userName };
  const server: TokenValue = { text: ctx.serverName };
  const count: TokenValue = { text: (ctx.memberCount ?? 0).toLocaleString('en-US') };
  const id: TokenValue = { text: ctx.userId };
  return {
    user: mention, 'user.mention': mention, user_mention: mention,
    'user.name': name, user_name: name, user_tag: name, 'user.display_name': name, user_nick: name, 'user.id': id, user_id: id,
    server, server_name: server, 'server.name': server, guild: server, guild_name: server, 'guild.name': server,
    member_count: count, 'server.member_count': count, 'guild.member_count': count, server_members: count,
    'user.join_position': { text: count.text }, 'user.join_position_suffix': { text: `${count.text}th` },
    'user.boost': { text: 'Yes' }, 'user.top_role': { text: 'Member' }, 'user.bot': { text: 'No' },
    level: { text: '12' }, level_next: { text: '13' }, level_xp: { text: '23,450' }, level_xp_needed: { text: '2,350' }, level_xp_current: { text: '1,420' }, level_xp_to_next: { text: '930' },
    level_bar: { text: '▰▰▰▰▰▰▱▱▱▱' }, level_previous: { text: '11' }, level_role: { text: '@Level 10', mention: true }, level_role_name: { text: 'Level 10' }, level_type: { text: 'text' },
    level_progress: { text: '60' }, level_rank: { text: '3' }, level_rank_total: { text: '120' }, level_streak: { text: '4' }, level_messages: { text: '3,210' }, level_voice_minutes: { text: '540' }, level_type: { text: 'text' }, EMOJI: { text: '✦' },
    'gw.prize': { text: 'Discord Nitro' }, 'gw.host': mention, 'gw.winners': { text: '1' }, 'gw.claim_time': { text: '10 minutes' },
    nextBump: { text: 'in 2 hours' },
    'case.id': { text: '42' }, 'case.type': { text: 'ban' }, 'case.action': { text: 'banned' }, 'case.emoji': { text: '🔨' }, 'case.reason': { text: 'Breaking rule 3' },
    'case.duration': { text: '7 days' }, 'case.expires': { text: 'in 7 days' }, 'case.expires_at': { text: 'Oct 9, 2026' }, 'case.source': { text: 'moderator' },
    'case.moderator': { text: '@Moderator', mention: true }, 'case.moderator_name': { text: 'Moderator' }, 'case.moderator_id': { text: '1498210265458675853' }, 'case.moderator_avatar': { text: '' },
    'case.user': mention, 'case.user_name': name, 'case.user_id': id, 'case.user_avatar': { text: '' }, 'case.appeal': { text: 'https://petto.sbs/appeal/…' },
    'star.count': { text: '5' }, 'star.emoji': { text: '⭐' }, 'star.channel': { text: '#general', mention: true }, 'star.channel_name': { text: 'general' },
    'star.link': { text: 'https://discord.com/channels/…' }, 'star.message_id': { text: '1498210265458675853' }, 'star.author': mention, 'star.author_name': name, 'star.author_id': id, 'star.author_avatar': { text: '' },
    'star.content': { text: 'This message got a lot of stars!' }, 'star.image': { text: '' }, 'star.attachments': { text: '[photo.png](https://…)' }, 'star.time': { text: 'Today at 12:00 PM' },
    'monkey.count': { text: '5' }, 'monkey.emoji': { text: '🐒' }, 'monkey.channel': { text: '#general', mention: true }, 'monkey.channel_name': { text: 'general' },
    'monkey.link': { text: 'https://discord.com/channels/…' }, 'monkey.message_id': { text: '1498210265458675853' }, 'monkey.author': mention, 'monkey.author_name': name, 'monkey.author_id': id, 'monkey.author_avatar': { text: '' },
    'monkey.content': { text: 'This message got a lot of monkeys!' }, 'monkey.image': { text: '' }, 'monkey.attachments': { text: '[photo.png](https://…)' }, 'monkey.time': { text: 'Today at 12:00 PM' },
    'suggestion.id': { text: 'si2tr-foytm' }, 'suggestion.number': { text: '12' }, 'suggestion.content': { text: 'Add a music channel so we can listen together.' },
    'suggestion.status': { text: 'approved' }, 'suggestion.status_label': { text: 'Approved' }, 'suggestion.reason': { text: 'Great idea, it is coming this week.' },
    'suggestion.staff': { text: '@Moderator', mention: true }, 'suggestion.staff_name': { text: 'Moderator' },
    'suggestion.author': mention, 'suggestion.author_name': name, 'suggestion.author_id': id, 'suggestion.author_avatar': { text: '' },
    'suggestion.up': { text: '8' }, 'suggestion.down': { text: '1' }, 'suggestion.up_emoji': { text: '✅' }, 'suggestion.down_emoji': { text: '❌' },
    'suggestion.score': { text: '7' }, 'suggestion.percent': { text: '89' }, 'suggestion.image': { text: '' }, 'suggestion.link': { text: 'https://discord.com/channels/…' },
    'suggestion.channel': { text: '#suggestions', mention: true }, 'suggestion.thread': { text: '#Thread for suggestion si2tr-foytm', mention: true },
    'suggestion.created': { text: '5 days ago' }, 'suggestion.created_time': { text: 'Oct 8, 2026 5:00 PM' },
    'confession.id': { text: 'si2tr-foytm' }, 'confession.number': { text: '12' }, 'confession.content': { text: 'I still sleep with the light on.' }, 'confession.image': { text: 'https://petto.sbs/assets/mascot-icon.webp' }, 'confession.link': { text: 'https://discord.com/channels/1/2/3' }, 'confession.channel': { text: '#confessions', mention: true }, 'confession.created': { text: '5 days ago' }, 'confession.created_time': { text: 'Oct 8, 2026 5:00 PM' },
    'verify.link': { text: 'https://petto.bot/verify/…' },
    'quest.name': { text: 'Watch the trailer' }, 'quest.game': { text: 'March of Giants' }, 'quest.publisher': { text: 'Ubisoft' }, 'quest.id': { text: '1552897885883072582' },
    'quest.url': { text: 'https://discord.com/quests/1552897885883072582' }, 'quest.link': { text: 'https://example.com/game' }, 'quest.image': { text: '' }, 'quest.logo': { text: '' }, 'quest.color': { text: '#4752c4' },
    'quest.reward': { text: '200 Orbs' }, 'quest.reward_type': { text: 'Orbs' }, 'quest.reward_amount': { text: '200' }, 'quest.reward_image': { text: '' },
    'quest.task': { text: 'Watch a video' }, 'quest.task_minutes': { text: '2' }, 'quest.tasks': { text: 'Watch a video (2 min)' }, 'quest.platforms': { text: 'Desktop, Mobile' },
    'quest.starts': { text: '1 day ago' }, 'quest.starts_at': { text: 'Oct 1, 2026 5:00 PM' }, 'quest.expires': { text: 'in 5 days' }, 'quest.expires_at': { text: 'Oct 7, 2026 5:00 PM' },
    'quest.limits': { text: 'None' }, 'quest.age_gate': { text: '' }, 'quest.status': { text: 'New quest' }, 'quest.source': { text: 'discordquest.com' },
    'quest.starts.relative': { text: '2 days ago' }, 'quest.expires.relative': { text: 'in 5 days' }, 'quest.starts.short_time': { text: '5:00 PM' }, 'quest.expires.short_time': { text: '5:00 PM' },
    'quest.starts.long_time': { text: '5:00:00 PM' }, 'quest.expires.long_time': { text: '5:00:00 PM' }, 'quest.starts.short_date': { text: '10/01/2026' }, 'quest.expires.short_date': { text: '10/08/2026' },
    'quest.starts.long_date': { text: 'October 1, 2026' }, 'quest.expires.long_date': { text: 'October 8, 2026' }, 'quest.starts.full': { text: 'October 1, 2026 5:00 PM' }, 'quest.expires.full': { text: 'October 8, 2026 5:00 PM' },
    'quest.starts.full_long': { text: 'Thursday, October 1, 2026 5:00 PM' }, 'quest.expires.full_long': { text: 'Thursday, October 8, 2026 5:00 PM' }, 'quest.starts.short_datetime': { text: '10/01/2026, 5:00 PM' }, 'quest.expires.short_datetime': { text: '10/08/2026, 5:00 PM' },
    'quest.starts.medium_datetime': { text: '10/01/2026, 5:00:00 PM' }, 'quest.expires.medium_datetime': { text: '10/08/2026, 5:00:00 PM' }, 'quest.starts.unix': { text: '1790874000' }, 'quest.expires.unix': { text: '1791478800' },
    'quest.starts_ago': { text: '2 days ago' }, 'quest.expires_in': { text: 'in 5 days' }, 'quest.starts_date': { text: 'Oct 1, 2026' }, 'quest.expires_date': { text: 'Oct 8, 2026' },
    'quest.starts_datetime': { text: 'Oct 1, 2026, 5:00 PM UTC' }, 'quest.expires_datetime': { text: 'Oct 8, 2026, 5:00 PM UTC' }, 'quest.duration': { text: '7 days' }, 'quest.time_left': { text: '5 days 3 hours' },
    'quest.days_left': { text: '5' }, 'quest.hours_left': { text: '123' }, 'quest.reward_name': { text: '200 Orbs' }, 'quest.rewards_count': { text: '1' },
    'quest.reward_nitro_amount': { text: '240' }, 'quest.reward_expires': { text: '' }, 'quest.task_type': { text: 'video' }, 'quest.task_seconds': { text: '120' },
    'quest.task_time': { text: '2 min' }, 'quest.countries': { text: '' }, 'quest.excluded_countries': { text: '' },
    'quest.orbs.name': { text: '200 Orbs' }, 'quest.orbs.type': { text: 'Orbs' }, 'quest.orbs.image': { text: '' }, 'quest.orbs.amount': { text: '200' },
    'quest.orbs.nitro_amount': { text: '240' }, 'quest.orbs.expires': { text: '' }, 'quest.decoration.name': { text: 'Cool frame' }, 'quest.decoration.type': { text: 'Collectible' },
    'quest.decoration.image': { text: '' }, 'quest.decoration.amount': { text: '' }, 'quest.decoration.nitro_amount': { text: '' }, 'quest.decoration.expires': { text: 'in 5 days' },
    'quest.code.name': { text: '' }, 'quest.code.type': { text: '' }, 'quest.code.image': { text: '' }, 'quest.code.amount': { text: '' },
    'quest.code.nitro_amount': { text: '' }, 'quest.code.expires': { text: '' }, 'quest.ingame.name': { text: '' }, 'quest.ingame.type': { text: '' },
    'quest.ingame.image': { text: '' }, 'quest.ingame.amount': { text: '' }, 'quest.ingame.nitro_amount': { text: '' }, 'quest.ingame.expires': { text: '' },
    'quest.nitro.name': { text: '' }, 'quest.nitro.type': { text: '' }, 'quest.nitro.image': { text: '' }, 'quest.nitro.amount': { text: '' },
    'quest.nitro.nitro_amount': { text: '' }, 'quest.nitro.expires': { text: '' }, 'quest.reward1.name': { text: '200 Orbs' }, 'quest.reward1.type': { text: 'Orbs' },
    'quest.reward1.image': { text: '' }, 'quest.reward1.amount': { text: '200' }, 'quest.reward1.nitro_amount': { text: '240' }, 'quest.reward1.expires': { text: '' },
    'quest.reward2.name': { text: 'Cool frame' }, 'quest.reward2.type': { text: 'Collectible' }, 'quest.reward2.image': { text: '' }, 'quest.reward2.amount': { text: '' },
    'quest.reward2.nitro_amount': { text: '' }, 'quest.reward2.expires': { text: 'in 5 days' }, 'quest.reward3.name': { text: '' }, 'quest.reward3.type': { text: '' },
    'quest.reward3.image': { text: '' }, 'quest.reward3.amount': { text: '' }, 'quest.reward3.nitro_amount': { text: '' }, 'quest.reward3.expires': { text: '' },
    'quest.reward_types': { text: 'Orbs, Collectible' },
    'partner.name': { text: 'Cozy Club' }, 'partner.id': { text: '1100000000000000001' }, 'partner.members': { text: '1,240' }, 'partner.invite': { text: 'https://discord.gg/cozy' },
    'partner.manager': mention, 'partner.manager_name': name, 'partner.count_day': { text: '1' }, 'partner.count_week': { text: '4' }, 'partner.count_total': { text: '21' },
    'partner.min_members': { text: '100' }, 'partner.min_age_days': { text: '14' }, 'partner.cooldown_days': { text: '7' }, 'partner.cooldown_ends': { text: 'in 3 days' }, 'partner.cooldown': { text: '3d 4h' },
    'partner.rank_week': { text: '2' }, 'partner.rank_total': { text: '3' }, 'partner.top_week': mention, 'partner.top_week_count': { text: '6' }, 'partner.top_total': mention, 'partner.top_total_count': { text: '48' },
    'poll.question': { text: 'What should we build next?' }, 'poll.options': { text: '🇦 A new command\n🇧 A dashboard module' }, 'poll.results': { text: '🇦 **A new command**\n████████░░░░  67% (4)\n🇧 **A dashboard module**\n████░░░░░░░░  33% (2)' },
    'poll.votes': { text: '6' }, 'poll.votes_text': { text: '6 votes' }, 'poll.type': { text: 'Single choice' }, 'poll.status': { text: 'Open' }, 'poll.ends': { text: 'in 2 hours' },
    'poll.image': { text: 'https://petto.sbs/assets/mascot-icon.png' }, 'poll.host': mention, 'poll.winner': { text: 'A new command' },
    'partner.server_day': { text: '2' }, 'partner.server_week': { text: '9' }, 'partner.server_total': { text: '87' },
    'request.number': { text: '12' }, 'request.text': { text: 'A banner for my server' }, 'request.link': { text: 'https://discord.com/channels/…' }, 'request.channel': { text: '#requests', mention: true }, 'request.status': { text: 'Open' },
    'honeypot.action': { text: 'a softban' }, 'honeypot.count': { text: '17' }, 'honeypot.channel': { text: '#do-not-write', mention: true },
    'channel.name': { text: 'general' }, channel: { text: '#general' },
    date: { text: 'Today' }, time: { text: '12:00 PM' },
    server_id: { text: '707307527846625280' }, 'guild.id': { text: '707307527846625280' }, server_prefix: { text: '!' },
    server_membercount: count, server_membercount_ordinal: { text: `${count.text}th` }, server_membercount_nobots: count, server_membercount_nobots_ordinal: { text: `${count.text}th` },
    'guild.count': count, 'guild.max_members': { text: '500,000' }, server_botcount: { text: '6' }, server_botcount_ordinal: { text: '6th' },
    server_rolecount: { text: '38' }, 'guild.role_count': { text: '38' }, server_channelcount: { text: '54' }, 'guild.channels_count': { text: '54' }, 'guild.emoji_count': { text: '42' },
    server_randommember: mention, server_randommember_tag: name, server_randommember_nobots: mention,
    server_owner: mention, server_owner_id: id, 'guild.owner_id': id, server_createdate: { text: 'Jul 1, 2020' }, 'guild.created_at': { text: 'Jul 1, 2020' },
    server_boostlevel: { text: '2' }, 'guild.boost_tier': { text: '2' }, server_boostcount: { text: '14' }, 'guild.boost_count': { text: '14' },
    server_nextboostlevel: { text: '3' }, server_nextboostlevel_required: { text: '14' }, server_nextboostlevel_until_required: { text: '0' },
    'guild.vanity': { text: 'petto' }, 'guild.region': { text: 'us-east' },
    'user.boost_since': { text: 'Jul 1, 2026' }, user_boostsince: { text: 'Jul 1, 2026' }, 'user.joined_at': { text: 'Jul 1, 2026' }, 'user.created_at': { text: 'Jul 1, 2020' },
    'user.color': { text: '#8399ff' }, 'user.role_list': { text: '@Member @Booster' }, user_discrim: { text: '' },
    'channel.mention': { text: '#general', mention: true }, 'channel.id': { text: '1498210265458675853' }, channel_name: { text: 'general' }, 'channel.topic': { text: 'Say hi' },
    'rule.name': { text: 'cinnamochi' }, 'rule.source': { text: 'vanity' }, 'rule.value': { text: 'discord.gg/petto' }, 'rule.condition': { text: 'contains' }, 'rule.reason': { text: 'Matched custom_status condition for value join discord.gg/petto' },
    'rule.role': { text: '@Vanity', mention: true }, 'rule.role_id': { text: '1010101010101010101' }, 'rule.action': { text: 'add_role' }, 'rule.action_text': { text: 'add' }, 'rule.result': { text: 'completed' }, 'rule.error': { text: '' },
    'rule.matched_value': { text: 'join discord.gg/petto' }, 'rule.event': { text: 'vanity_add' }, 'rule.event_title': { text: 'Vanity role added' },
    'vanity.rule': { text: 'cinnamochi' }, 'vanity.word': { text: 'discord.gg/petto' }, 'vanity.source': { text: 'custom_status' }, 'vanity.value': { text: 'join discord.gg/petto' }, 'vanity.role': { text: '@Vanity', mention: true },
    tag: { text: 'PETT' }, 'tag.rule': { text: 'partner-server' }, 'tag.condition': { text: 'is_guild_id' }, 'tag.rule_value': { text: '707307527846625280' }, 'tag.guild_id': { text: '707307527846625280' },
    'tag.enabled': { text: 'true' }, 'tag.badge': { text: 'badge' }, 'tag.role': { text: '@Partner', mention: true },
  };
}

// The names other people (and other bots) use for the same variable, the same ones the bot understands.
const aliases: Record<string, string> = {
  mention: 'user', member: 'user', 'member.mention': 'user', 'user.ping': 'user', 'user.tag': 'user_tag', 'user.username': 'user_name', username: 'user_name', 'user.nickname': 'user.display_name',
  'user.nick': 'user_nick', nickname: 'user_nick', 'member.name': 'user.display_name', 'member.id': 'user.id',
  'level.level': 'level', 'level.current': 'level', 'level.xp': 'level_xp', 'level.total_xp': 'level_xp', 'level.xp_needed': 'level_xp_needed', 'level.rank': 'level_rank', 'level.next': 'level_next',
  'level.progress': 'level_progress', 'level.xp_current': 'level_xp_current', 'level.xp_to_next': 'level_xp_to_next', 'level.rank_total': 'level_rank_total', 'level.total': 'level_rank_total',
  'level.streak': 'level_streak', 'level.messages': 'level_messages', 'level.voice_minutes': 'level_voice_minutes', 'level.type': 'level_type', 'level.bar': 'level_bar', 'level.role': 'level_role',
  'level.role_name': 'level_role_name', 'level.previous': 'level_previous', 'server.id': 'server_id', 'server.members': 'server_membercount',
};

/** The sample of a variable written as it comes: whatever its case, with the names of other bots, or undefined when it is not known. */
export function findSample(samples: Record<string, TokenValue>, token: string): TokenValue | undefined {
  if (samples[token]) return samples[token];
  const lower = token.trim().toLowerCase();
  if (samples[lower]) return samples[lower];
  const byCase = Object.keys(samples).find((key) => key.toLowerCase() === lower);
  if (byCase) return samples[byCase];
  return aliases[lower] ? samples[aliases[lower]] : undefined;
}
