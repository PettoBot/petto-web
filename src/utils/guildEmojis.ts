import { cached } from './sharedCache';
import { readSnapshotEmojis } from './guildSnapshots';

export type GuildEmoji = { id: string; name: string; animated: boolean };

const EMOJI_TTL_MS = 5 * 60_000;

/**
 * Custom emojis of a server, for the emoji picker of the dashboard. They come from the bot's saved copy of the server (the `emojis`
 * column of `discord_guild_snapshots`) and are kept for a few minutes; Discord is asked only when the copy has none (an older bot).
 * Empty when neither can be read (that answer is not kept, so the next page tries again).
 */
export async function getGuildEmojis(guildId: string, botToken: string | undefined): Promise<GuildEmoji[]> {
  const result = await cached(`emojis:${guildId}`, () => loadGuildEmojis(guildId, botToken), { freshMs: EMOJI_TTL_MS, shared: true, keep: (value) => value !== null }).catch(() => null);
  return result ?? [];
}

async function loadGuildEmojis(guildId: string, botToken: string | undefined): Promise<GuildEmoji[] | null> {
  const saved = await readSnapshotEmojis(guildId).catch(() => null);
  if (saved) return saved;
  if (!botToken) return null;
  const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/emojis`, { headers: { Authorization: `Bot ${botToken}` } }).catch(() => null);
  if (!res?.ok) return null;
  const list = await res.json().catch(() => null);
  return Array.isArray(list) ? list.map(toEmoji).filter((emoji): emoji is GuildEmoji => Boolean(emoji)) : null;
}

export function toEmoji(raw: any): GuildEmoji | null {
  if (!raw?.id) return null;
  return { id: String(raw.id), name: String(raw.name ?? ''), animated: Boolean(raw.animated) };
}
