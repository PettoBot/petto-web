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
    level: { text: '12' }, level_xp: { text: '4,250' }, level_xp_needed: { text: '1,750' }, level_rank: { text: '#3' }, EMOJI: { text: '✦' },
    'gw.prize': { text: 'Discord Nitro' }, 'gw.host': mention, 'gw.winners': { text: '1' }, 'gw.claim_time': { text: '10 minutes' },
    nextBump: { text: 'in 2 hours' },
    'channel.name': { text: 'general' }, channel: { text: '#general' },
    date: { text: 'Today' }, time: { text: '12:00 PM' },
  };
}
