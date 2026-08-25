const TTL_MS = 20_000;
const cache = new Map<string, { data: any[]; expiresAt: number }>();

export async function getCachedUserGuilds(accessToken: string): Promise<any[]> {
  const hit = cache.get(accessToken);
  if (hit && hit.expiresAt > Date.now()) return hit.data;

  try {
    const res = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Discord guild list failed with ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Discord guild list was not an array');
    cache.set(accessToken, { data, expiresAt: Date.now() + TTL_MS });
    return data;
  } catch (error) {
    if (hit?.data && Date.now() - (hit.expiresAt - TTL_MS) < 60_000) return hit.data;
    throw error;
  }
}

const botGuildsCache = new Map<string, { ids: Set<string>; expiresAt: number }>();

export async function getCachedBotGuildIds(botToken: string): Promise<Set<string>> {
  const hit = botGuildsCache.get(botToken);
  if (hit && hit.expiresAt > Date.now()) return hit.ids;

  const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: { Authorization: `Bot ${botToken}` },
  });
  const data = res.ok ? await res.json() : [];
  const ids = new Set<string>(Array.isArray(data) ? data.map((g: any) => g.id) : []);
  botGuildsCache.set(botToken, { ids, expiresAt: Date.now() + TTL_MS });
  return ids;
}
