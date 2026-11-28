import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { j as getGuildInfo } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const TABLES = [
  "guilds",
  "automod_config",
  "antinuke_config",
  "level_config",
  "level_rewards",
  "ticket_categories",
  "giveaway_config",
  "giveaway_presets",
  "log_entries",
  "custom_commands",
  "auto_responders",
  "sticky_messages",
  "reaction_roles",
  "reaction_triggers",
  "reaction_message_configs",
  "disabled_commands",
  "report_config",
  "booster_role_config",
  "member_events_config",
  "verification_config",
  "bump_reminders",
  "poj_config",
  "poj_channels",
  "auto_messages",
  "feeds",
  "server_counters",
  "embed_templates",
  "image_cards"
];
const GET = async (context) => {
  const { id } = context.params;
  const botToken = getEnv(context, "DISCORD_TOKEN");
  const apiUrl = getEnv(context, "PETTO_BOT_API_URL");
  const apiKey = getEnv(context, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(context, id);
  if ("redirect" in auth) return context.redirect(auth.redirect);
  if (!botToken || !apiUrl || !apiKey) return new Response("Server not configured", { status: 500 });
  const guildInfo = await getGuildInfo(id, botToken);
  if (!guildInfo) return new Response("Bot not in guild", { status: 404 });
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
  const results = await Promise.all(
    TABLES.map(async (table) => {
      const res = await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}&select=*`, { headers });
      return [table, res.ok ? await res.json() : []];
    })
  );
  const dump = {
    exported_at: (/* @__PURE__ */ new Date()).toISOString(),
    guild_id: id,
    guild_name: guildInfo.name
  };
  for (const [table, rows] of results) dump[table] = rows;
  return new Response(JSON.stringify(dump, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="petto-${id}-config.json"`
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
