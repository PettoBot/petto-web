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
    level_progress: { text: '60' }, level_rank: { text: '3' }, level_rank_total: { text: '120' }, level_streak: { text: '4' }, level_messages: { text: '3,210' }, level_voice_minutes: { text: '540' }, level_type: { text: 'text' }, EMOJI: { text: '✦' },
    'gw.prize': { text: 'Discord Nitro' }, 'gw.host': mention, 'gw.winners': { text: '1' }, 'gw.claim_time': { text: '10 minutes' },
    nextBump: { text: 'in 2 hours' },
    'case.id': { text: '42' }, 'case.type': { text: 'ban' }, 'case.action': { text: 'banned' }, 'case.emoji': { text: '🔨' }, 'case.reason': { text: 'Breaking rule 3' },
    'case.duration': { text: '7 days' }, 'case.expires': { text: 'in 7 days' }, 'case.expires_at': { text: 'Oct 9, 2026' }, 'case.source': { text: 'moderator' },
    'case.moderator': { text: '@Moderator', mention: true }, 'case.moderator_name': { text: 'Moderator' }, 'case.moderator_id': { text: '1498210265458675853' }, 'case.moderator_avatar': { text: '' },
    'case.user': mention, 'case.user_name': name, 'case.user_id': id, 'case.user_avatar': { text: '' },
    'star.count': { text: '5' }, 'star.emoji': { text: '⭐' }, 'star.channel': { text: '#general', mention: true }, 'star.channel_name': { text: 'general' },
    'star.link': { text: 'https://discord.com/channels/…' }, 'star.message_id': { text: '1498210265458675853' }, 'star.author': mention, 'star.author_name': name, 'star.author_id': id, 'star.author_avatar': { text: '' },
    'star.content': { text: 'This message got a lot of stars!' }, 'star.image': { text: '' }, 'star.attachments': { text: '[photo.png](https://…)' }, 'star.time': { text: 'Today at 12:00 PM' },
    'verify.link': { text: 'https://petto.bot/verify/…' },
    'quest.name': { text: 'Watch the trailer' }, 'quest.game': { text: 'March of Giants' }, 'quest.publisher': { text: 'Ubisoft' }, 'quest.id': { text: '1552897885883072582' },
    'quest.url': { text: 'https://discord.com/quests/1552897885883072582' }, 'quest.link': { text: 'https://example.com/game' }, 'quest.image': { text: '' }, 'quest.logo': { text: '' }, 'quest.color': { text: '#4752c4' },
    'quest.reward': { text: '200 Orbs' }, 'quest.reward_type': { text: 'Orbs' }, 'quest.reward_amount': { text: '200' }, 'quest.reward_image': { text: '' },
    'quest.task': { text: 'Watch a video' }, 'quest.task_minutes': { text: '2' }, 'quest.tasks': { text: 'Watch a video (2 min)' }, 'quest.platforms': { text: 'Desktop, Mobile' },
    'quest.starts': { text: '1 day ago' }, 'quest.starts_at': { text: 'Oct 1, 2026 5:00 PM' }, 'quest.expires': { text: 'in 5 days' }, 'quest.expires_at': { text: 'Oct 7, 2026 5:00 PM' },
    'quest.limits': { text: 'None' }, 'quest.age_gate': { text: '' }, 'quest.status': { text: 'New quest' }, 'quest.source': { text: 'discordquest.com' },
    'partner.name': { text: 'Cozy Club' }, 'partner.id': { text: '1100000000000000001' }, 'partner.members': { text: '1,240' }, 'partner.invite': { text: 'https://discord.gg/cozy' },
    'partner.manager': mention, 'partner.manager_name': name, 'partner.count_day': { text: '1' }, 'partner.count_week': { text: '4' }, 'partner.count_total': { text: '21' },
    'partner.min_members': { text: '100' }, 'partner.min_age_days': { text: '14' }, 'partner.cooldown_days': { text: '7' }, 'partner.cooldown_ends': { text: 'in 3 days' }, 'partner.cooldown': { text: '3d 4h' },
    'partner.rank_week': { text: '2' }, 'partner.rank_total': { text: '3' }, 'partner.top_week': mention, 'partner.top_week_count': { text: '6' }, 'partner.top_total': mention, 'partner.top_total_count': { text: '48' },
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
  };
}

/** Sample values for the variables of the Vanity bot, which has its own set. */
export function vanitySamples(ctx: TokenContext = sampleContext): Record<string, TokenValue> {
  const mention: TokenValue = { text: `@${ctx.userName}`, mention: true };
  const role: TokenValue = { text: '@Vanity', mention: true };
  const word: TokenValue = { text: 'discord.gg/petto' };
  return {
    'guild.icon': { text: '' }, 'role': role, 'role.id': { text: '1010101010101010101' },
    'rule.name': { text: 'cinnamochi' }, 'rule.source': { text: 'custom_status' }, 'rule.value': word, 'rule.condition': { text: 'contains' }, 'rule.reason': { text: 'Custom Status contains the vanity' },
    'vanity.rule': { text: 'cinnamochi' }, 'vanity.word': word, 'vanity.source': { text: 'custom_status' }, 'vanity.value': { text: 'join discord.gg/petto' }, 'vanity.role': role, 'vanity.role.id': { text: '1010101010101010101' },
    'tag.rule': { text: 'partner-server' }, 'tag.condition': { text: 'is_guild_id' }, tag: { text: 'PETT' }, 'tag.value': { text: 'PETT' }, 'tag.rule_value': { text: '707307527846625280' },
    'tag.guild_id': { text: '707307527846625280' }, 'tag.enabled': { text: 'true' }, 'tag.badge': { text: 'badge' }, 'tag.role': role,
    action: { text: 'add_role' }, 'action.text': { text: 'Role added' }, result: { text: 'completed' }, event: { text: 'vanity_add' }, 'event.name': { text: 'vanity_add' }, 'event.title': { text: 'Vanity role added' },
    'event.error': { text: '' }, 'event.matched_value': { text: 'join discord.gg/petto' }, 'identity.source': { text: 'custom_status' }, 'identity.value': { text: 'join discord.gg/petto' },
    timestamp: { text: 'Today at 12:00 PM' }, 'date.utc_timestamp': { text: 'Today at 12:00 PM' }, newline: { text: ' ' }, separator: { text: '—' }, 'user.tag': { text: ctx.userName }, user: mention,
  };
}
