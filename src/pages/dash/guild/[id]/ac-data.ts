import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';
import { getGuildList } from '../../../../utils/discord';
import { getGuildEmojis } from '../../../../utils/guildEmojis';

export const prerender = false;

// The roles, channels and custom emojis of a server for the typed autocomplete of the message fields (DashAutocomplete.astro), for a
// page that did not already bring them (DashAcData). It is asked at most once per page, when a field with the autocomplete gets the
// focus, and it reads the same saved copies as the pages (bot snapshot, then Discord), so it costs no new call to Discord in most cases.
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'private, max-age=60' } });

export const GET: APIRoute = async (context) => {
  const { id } = context.params as { id: string };
  const auth = await getGuildSession(context, id);
  if ('redirect' in auth) return json({ r: [], c: [], e: [] }, 401);
  const token = getEnv(context, 'DISCORD_TOKEN');
  if (!token) return json({ r: [], c: [], e: [] });
  const read = async (kind: 'roles' | 'channels') => {
    try {
      const res = await getGuildList(context, id, token, kind);
      return res.ok ? ((await res.json()) as any[]) : [];
    } catch { return []; }
  };
  const [roles, channels, emojis] = await Promise.all([read('roles'), read('channels'), getGuildEmojis(id, token).catch(() => [])]);
  return json({
    r: roles.filter((role) => String(role.id) !== id && role.name !== '@everyone')
      .sort((a, b) => Number(b.position) - Number(a.position))
      .map((role) => [String(role.id), String(role.name), role.color ? `#${Number(role.color).toString(16).padStart(6, '0')}` : '']),
    // Categories (4) cannot be mentioned.
    c: channels.filter((channel) => Number(channel.type) !== 4)
      .sort((a, b) => Number(a.position) - Number(b.position))
      .map((channel) => [String(channel.id), String(channel.name), Number(channel.type) || 0]),
    e: emojis.map((emoji) => [emoji.id, emoji.name, emoji.animated ? 1 : 0]),
  });
};
