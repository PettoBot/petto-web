import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
const GET = async ({ locals }) => {
  const botApiUrl = getEnv({ locals }, "PETTO_BOT_API_URL");
  const botApiSecret = getEnv({ locals }, "PETTO_BOT_API_SECRET");
  if (!botApiUrl || !botApiSecret) return json({ error: "status_not_configured" }, 503);
  const headers = {
    apikey: botApiSecret,
    Authorization: `Bearer ${botApiSecret}`,
    "X-Petto-Dashboard-Key": botApiSecret,
    Accept: "application/json"
  };
  try {
    const [shardResponse, hostResponse] = await Promise.all([
      fetch(`${botApiUrl}/rest/v1/bot_status?select=*&order=shard_id.asc`, { headers }),
      fetch(`${botApiUrl}/rest/v1/bot_host?select=uptime_seconds,node_version,updated_at`, { headers })
    ]);
    if (!shardResponse.ok || !hostResponse.ok) return json({ error: "status_backend_unavailable" }, 502);
    const [shards, hosts] = await Promise.all([shardResponse.json(), hostResponse.json()]);
    if (!Array.isArray(shards) || !Array.isArray(hosts)) return json({ error: "invalid_status_response" }, 502);
    const rows = shards.map((row) => ({
      shard_id: row.shard_id,
      status: row.status,
      updated_at: row.updated_at,
      guild_count: row.guild_count,
      member_count: row.member_count ?? null,
      ping_ms: row.ping_ms,
      cluster_name: row.cluster_name ?? null,
      cluster_location: row.cluster_location ?? null
    }));
    return json({ shards: rows, host: hosts[0] ?? null });
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
