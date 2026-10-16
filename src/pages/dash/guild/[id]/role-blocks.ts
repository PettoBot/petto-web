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
  if (token) {
    try {
      const res = await getGuildList(context, id, token, 'roles');
      if (res.ok) {
        const roles: any[] = await res.json();
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
  return new Response(JSON.stringify({ blocks }), { headers: { 'content-type': 'application/json', 'cache-control': 'private, max-age=20' } });
};
