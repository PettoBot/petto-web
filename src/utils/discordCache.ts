// Every guild dashboard page needs the user's full Discord guild list at least once (to verify
// they can actually manage this server), and the sidebar's server-switcher needs the exact same
// list again on the exact same page load. Without this, that's two identical Discord API calls
// per request. A short in-memory TTL cache (same idea YAGPDB uses for its own Discord API reads)
// collapses that back down to one real fetch, and also covers rapid dashboard nagivation.
const TTL_MS = 20_000;
const cache = new Map<string, { data: any[]; expiresAt: number }>();

export async function getCachedUserGuilds(accessToken: string): Promise<any[]> {
  const hit = cache.get(accessToken);
  if (hit && hit.expiresAt > Date.now()) return hit.data;

  const res = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = res.ok ? await res.json() : [];
  cache.set(accessToken, { data, expiresAt: Date.now() + TTL_MS });
  return data;
}
