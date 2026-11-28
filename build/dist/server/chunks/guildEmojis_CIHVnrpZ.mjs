import { cached } from './sharedCache_DFk4ml3Q.mjs';
import { h as readSnapshotEmojis } from './discord_CxeBz2tv.mjs';

const EMOJI_TTL_MS = 5 * 6e4;
async function getGuildEmojis(guildId, botToken) {
  const result = await cached(`emojis:${guildId}`, () => loadGuildEmojis(guildId, botToken), { freshMs: EMOJI_TTL_MS, shared: true, keep: (value) => value !== null }).catch(() => null);
  return result ?? [];
}
async function loadGuildEmojis(guildId, botToken) {
  const saved = await readSnapshotEmojis(guildId).catch(() => null);
  if (saved) return saved;
  if (!botToken) return null;
  const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/emojis`, { headers: { Authorization: `Bot ${botToken}` } }).catch(() => null);
  if (!res?.ok) return null;
  const list = await res.json().catch(() => null);
  return Array.isArray(list) ? list.map(toEmoji).filter((emoji) => Boolean(emoji)) : null;
}
function toEmoji(raw) {
  if (!raw?.id) return null;
  return { id: String(raw.id), name: String(raw.name ?? ""), animated: Boolean(raw.animated) };
}

export { getGuildEmojis as g };
