const OWNERS = ['293504726505357312', '285568675631595521'];
const PROGRAMMING = ['1421156491322462291', '1383162811873628284', '293504726505357312'];
const SUPPORT = ['1394428756948422706', '211313627343355904', '293504726505357312'];
const TEST = ['803059961533825034', '1421156491322462291', '257181659865153539'];
const LEGAL = ['293504726505357312'];

export interface TeamMember {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

async function fetchUser(botToken: string, id: string): Promise<TeamMember> {
  const res = await fetch(`https://discord.com/api/users/${id}`, { headers: { Authorization: `Bot ${botToken}` } });
  if (!res.ok) {
    return { id, username: id, displayName: id, avatarUrl: `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id) >> 22n) % 6n)}.png` };
  }
  const u = await res.json();
  return {
    id,
    username: u.username,
    displayName: u.global_name || u.username,
    avatarUrl: u.avatar
      ? `https://cdn.discordapp.com/avatars/${id}/${u.avatar}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id) >> 22n) % 6n)}.png`,
  };
}

export interface TeamRoster {
  owners: TeamMember[];
  programming: TeamMember[];
  support: TeamMember[];
  test: TeamMember[];
  legal: TeamMember[];
}

export async function getTeamRoster(botToken: string): Promise<TeamRoster> {
  const allIds = [...new Set([...OWNERS, ...PROGRAMMING, ...SUPPORT, ...TEST, ...LEGAL])];
  const usersById = new Map<string, TeamMember>();
  await Promise.all(allIds.map(async (id) => usersById.set(id, await fetchUser(botToken, id))));

  const byIds = (ids: string[]) => ids.map((id) => usersById.get(id)).filter((m): m is TeamMember => Boolean(m));
  return {
    owners: byIds(OWNERS),
    programming: byIds(PROGRAMMING),
    support: byIds(SUPPORT),
    test: byIds(TEST),
    legal: byIds(LEGAL),
  };
}
