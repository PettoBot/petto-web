// Custom emojis of a server, for the emoji picker of the dashboard. Empty when Discord can't be reached.
export async function getGuildEmojis(guildId: string, botToken: string | undefined): Promise<{ id: string; name: string; animated: boolean }[]> {
  if (!botToken) return [];
  const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/emojis`, { headers: { Authorization: `Bot ${botToken}` } }).catch(() => null);
  if (!res?.ok) return [];
  return (await res.json()).map((e: any) => ({ id: String(e.id), name: String(e.name), animated: Boolean(e.animated) }));
}
