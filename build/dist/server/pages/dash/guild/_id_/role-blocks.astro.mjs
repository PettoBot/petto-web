import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  const { id } = context.params;
  const auth = await getGuildSession(context, id);
  if ("redirect" in auth) return new Response(JSON.stringify({ blocks: {} }), { status: 401, headers: { "content-type": "application/json" } });
  const token = getEnv(context, "DISCORD_TOKEN");
  const blocks = {};
  const colors = {};
  const channels = {};
  if (token) {
    try {
      const [res, channelsRes] = await Promise.all([getGuildList(context, id, token, "roles"), getGuildList(context, id, token, "channels")]);
      if (channelsRes.ok) {
        const all = await channelsRes.json();
        const categories = new Map(all.filter((channel) => channel.type === 4).map((channel) => [String(channel.id), { name: String(channel.name), position: Number(channel.position) || 0 }]));
        const rank = (channel) => channel.parent_id && categories.has(String(channel.parent_id)) ? categories.get(String(channel.parent_id)).position + 1 : 0;
        const ordered = all.filter((channel) => channel.type !== 4).sort((a, b) => rank(a) - rank(b) || (Number(a.position) || 0) - (Number(b.position) || 0));
        ordered.forEach((channel, index) => {
          channels[String(channel.id)] = { cat: channel.parent_id ? categories.get(String(channel.parent_id))?.name ?? "" : "", o: index };
        });
      }
      if (res.ok) {
        const roles = await res.json();
        for (const role of roles) if (Number(role.color)) colors[String(role.id)] = Number(role.color);
        const botTop = Math.max(-1, ...roles.filter((role) => role.mine === true).map((role) => Number(role.position)));
        for (const role of roles) {
          const roleId = String(role.id);
          if (roleId === id) blocks[roleId] = "everyone";
          else if (role.managed) blocks[roleId] = "managed";
          else if (botTop >= 0 && Number(role.position) >= botTop) blocks[roleId] = "above_bot";
        }
      }
    } catch {
    }
  }
  return new Response(JSON.stringify({ blocks, colors, channels }), { headers: { "content-type": "application/json", "cache-control": "private, max-age=20" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
