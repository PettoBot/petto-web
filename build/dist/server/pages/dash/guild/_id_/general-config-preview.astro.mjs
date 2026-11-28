import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { j as getGuildInfo } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
import { S as SECTIONS, c as columnsOf, r as renderConfigYaml, G as GUILD_COLUMNS } from '../../../../chunks/configYamlRender_CdfrZ1VV.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../../../renderers.mjs';

async function buildConfigYaml(id, botToken, apiUrl, apiKey) {
  const guildInfo = await getGuildInfo(id, botToken);
  if (!guildInfo) return null;
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, Prefer: "count=exact" };
  const base = `${apiUrl}/rest/v1`;
  async function read(table, columns, filter, order, limit) {
    for (const [select, sorted] of [[columns.join(","), true], ["*", true], ["*", false]]) {
      try {
        const res = await fetch(`${base}/${table}?guild_id=eq.${id}&select=${select}${filter}${sorted ? order : ""}&limit=${limit}`, { headers });
        if (!res.ok) continue;
        const rows = await res.json();
        if (!Array.isArray(rows)) continue;
        const range = Number(res.headers.get("content-range")?.split("/")[1]);
        return { rows, total: Number.isFinite(range) ? range : rows.length };
      } catch {
      }
    }
    return { rows: null, total: null };
  }
  const pairs = [];
  for (const section of SECTIONS) for (const mod of section.modules) pairs.push({ key: `${section.key}.${mod.key}`, mod });
  const tasks = [
    () => read("guilds", GUILD_COLUMNS, "", "", 1),
    ...pairs.map(({ mod }) => () => {
      const columns = mod.mode === "count" ? ["guild_id"] : columnsOf(mod).map(([name]) => name);
      const order = mod.order && mod.mode === "many" ? `&order=${mod.order}` : "";
      return read(mod.table, columns, mod.filter ? `&${mod.filter}` : "", order, mod.mode === "many" ? mod.limit ?? 100 : 1);
    })
  ];
  const results = await runBatched(tasks, 6);
  const data = {};
  pairs.forEach(({ key }, i) => {
    data[key] = results[i + 1];
  });
  const guildRows = results[0].rows;
  return renderConfigYaml({ guildId: id, guildName: guildInfo.name, guild: guildRows ? guildRows[0] ?? {} : null, data });
}

const prerender = false;
const GET = async (context) => {
  const { id } = context.params;
  const botToken = getEnv(context, "DISCORD_TOKEN");
  const apiUrl = getEnv(context, "PETTO_BOT_API_URL");
  const apiKey = getEnv(context, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(context, id);
  if ("redirect" in auth) return new Response("Unauthorized", { status: 401 });
  if (!botToken || !apiUrl || !apiKey) return new Response("Server not configured", { status: 500 });
  const yaml = await buildConfigYaml(id, botToken, apiUrl, apiKey);
  if (yaml === null) return new Response("Bot not in guild", { status: 404 });
  return new Response(yaml, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
