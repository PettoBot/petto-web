import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';
import { getGuildList } from '../../../../utils/discord';

export const prerender = false;

// The roles Petto cannot give in a server: @everyone, the ones an integration owns (bots, boosters) and the ones above its highest role. The
// pickers of roles that Petto hands out show them greyed out. Where the bot has not marked its own roles yet, nothing is claimed about the
// position. Only a page that has such a picker asks for this, so the other pages never pay for it.
export const GET: APIRoute = async (context) => {
  const { id } = context.params as { id: string };
  const auth = await getGuildSession(context, id);
  if ('redirect' in auth) return new Response(JSON.stringify({ blocks: {} }), { status: 401, headers: { 'content-type': 'application/json' } });
  const token = getEnv(context, 'DISCORD_TOKEN');
  const blocks: Record<string, string> = {};
  // What the pickers show of each role (its color) and of each channel (its category and its place in the list).
  const colors: Record<string, number> = {};
  const channels: Record<string, { cat: string; o: number }> = {};
  if (token) {
    try {
      const [res, channelsRes] = await Promise.all([getGuildList(context, id, token, 'roles'), getGuildList(context, id, token, 'channels')]);
      if (channelsRes.ok) {
        const all: any[] = await channelsRes.json();
        const categories = new Map(all.filter((channel) => channel.type === 4).map((channel) => [String(channel.id), { name: String(channel.name), position: Number(channel.position) || 0 }]));
        const rank = (channel: any) => (channel.parent_id && categories.has(String(channel.parent_id)) ? categories.get(String(channel.parent_id))!.position + 1 : 0);
        const ordered = all.filter((channel) => channel.type !== 4).sort((a, b) => rank(a) - rank(b) || (Number(a.position) || 0) - (Number(b.position) || 0));
        ordered.forEach((channel, index) => { channels[String(channel.id)] = { cat: channel.parent_id ? categories.get(String(channel.parent_id))?.name ?? '' : '', o: index }; });
      }
      if (res.ok) {
        const roles: any[] = await res.json();
        for (const role of roles) if (Number(role.color)) colors[String(role.id)] = Number(role.color);
        const botTop = Math.max(-1, ...roles.filter((role) => role.mine === true).map((role) => Number(role.position)));
        for (const role of roles) {
          const roleId = String(role.id);
          if (roleId === id) blocks[roleId] = 'everyone';
          else if (role.managed) blocks[roleId] = 'managed';
          else if (botTop >= 0 && Number(role.position) >= botTop) blocks[roleId] = 'above_bot';
        }
      }
    } catch { /* nothing is greyed out */ }
  }
  return new Response(JSON.stringify({ blocks, colors, channels }), { headers: { 'content-type': 'application/json', 'cache-control': 'private, max-age=20' } });
};
