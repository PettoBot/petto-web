import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const STALE_MS = 5 * 60 * 1e3;
const MAX_RESULTS = 5;
const RATE_LIMIT = 30;
const hits = /* @__PURE__ */ new Map();
function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
function limited(key) {
  const now = Date.now();
  if (hits.size > 2e3) {
    for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
  }
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + 6e4 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}
function bucket(rawStatus, updatedAt, now) {
  if (new Date(updatedAt).getTime() + STALE_MS < now) return "offline";
  if (rawStatus === "Ready") return "operational";
  if (rawStatus === "Disconnected") return "offline";
  return "reconnecting";
}
function likeValue(text) {
  return text.replace(/[*%_\\,()."]/g, " ").replace(/\s+/g, " ").trim();
}
const GET = async ({ locals, url, request, clientAddress }) => {
  const botApiUrl = getEnv({ locals }, "PETTO_BOT_API_URL");
  const botApiSecret = getEnv({ locals }, "PETTO_BOT_API_SECRET");
  if (!botApiUrl || !botApiSecret) return json({ error: "status_not_configured" }, 503);
  let who = "unknown";
  try {
    who = clientAddress;
  } catch {
    who = request.headers.get("cf-connecting-ip") ?? "unknown";
  }
  if (limited(who)) return json({ error: "too_many_searches" }, 429);
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
  const isId = /^\d{15,22}$/.test(query);
  if (!isId && likeValue(query).length < 3) return json({ error: "query_too_short" }, 400);
  const headers = { apikey: botApiSecret, Authorization: `Bearer ${botApiSecret}`, "X-Petto-Dashboard-Key": botApiSecret, Accept: "application/json" };
  const filter = isId ? `guild_id=eq.${query}` : `name=ilike.*${encodeURIComponent(likeValue(query))}*`;
  try {
    const [serversRes, shardsRes] = await Promise.all([
      fetch(`${botApiUrl}/rest/v1/discord_guild_snapshots?${filter}&select=guild_id,name,icon&order=name.asc&limit=${MAX_RESULTS}`, { headers }),
      fetch(`${botApiUrl}/rest/v1/bot_status?select=*&order=shard_id.asc`, { headers })
    ]);
    if (!serversRes.ok || !shardsRes.ok) return json({ error: "status_backend_unavailable" }, 502);
    const [servers, shards] = await Promise.all([serversRes.json(), shardsRes.json()]);
    if (!Array.isArray(servers) || !Array.isArray(shards)) return json({ error: "invalid_status_response" }, 502);
    let visible = servers;
    if (!isId && visible.length) {
      const hiddenRes = await fetch(`${botApiUrl}/rest/v1/guilds?guild_id=in.(${visible.map((s) => s.guild_id).join(",")})&global_stats_hidden=is.true&select=guild_id`, { headers });
      const hidden = new Set(hiddenRes.ok ? (await hiddenRes.json()).map((row) => row.guild_id) : []);
      visible = visible.filter((server) => !hidden.has(server.guild_id));
    }
    const now = Date.now();
    const shardCount = Math.max(1, ...shards.map((row) => Number(row.shard_id) + 1));
    const results = visible.map((server) => {
      const shardId = Number((BigInt(server.guild_id) >> 22n) % BigInt(shardCount));
      const row = shards.find((entry) => Number(entry.shard_id) === shardId);
      return {
        id: server.guild_id,
        name: server.name,
        icon: server.icon ? `https://cdn.discordapp.com/icons/${server.guild_id}/${server.icon}.png?size=64` : null,
        shard: shardId,
        state: row ? bucket(row.status, row.updated_at, now) : "offline",
        ping: row?.ping_ms ?? null,
        cluster: [row?.cluster_name, row?.cluster_location].filter(Boolean).join(" · ") || null
      };
    });
    return json({ results });
  } catch {
    return json({ error: "status_backend_unavailable" }, 502);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
