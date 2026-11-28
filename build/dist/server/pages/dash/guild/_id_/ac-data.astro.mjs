import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getGuildEmojis } from '../../../../chunks/guildEmojis_CIHVnrpZ.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "private, max-age=60" } });
const GET = async (context) => {
  const { id } = context.params;
  const auth = await getGuildSession(context, id);
  if ("redirect" in auth) return json({ r: [], c: [], e: [] }, 401);
  const token = getEnv(context, "DISCORD_TOKEN");
  if (!token) return json({ r: [], c: [], e: [] });
  const read = async (kind) => {
    try {
      const res = await getGuildList(context, id, token, kind);
      return res.ok ? await res.json() : [];
    } catch {
      return [];
    }
  };
  const [roles, channels, emojis] = await Promise.all([read("roles"), read("channels"), getGuildEmojis(id, token).catch(() => [])]);
  return json({
    r: roles.filter((role) => String(role.id) !== id && role.name !== "@everyone").sort((a, b) => Number(b.position) - Number(a.position)).map((role) => [String(role.id), String(role.name), role.color ? `#${Number(role.color).toString(16).padStart(6, "0")}` : ""]),
    c: channels.sort((a, b) => Number(a.position) - Number(b.position)).map((channel) => [String(channel.id), String(channel.name), Number(channel.type) || 0]),
    e: emojis.map((emoji) => [emoji.id, emoji.name, emoji.animated ? 1 : 0])
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
