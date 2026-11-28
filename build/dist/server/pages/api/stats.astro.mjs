import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
function json(body, status = 200, cache = "no-store") {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache }
  });
}
const GET = async ({ locals }) => {
  const botApiUrl = getEnv({ locals }, "PETTO_BOT_API_URL");
  const botApiSecret = getEnv({ locals }, "PETTO_BOT_API_SECRET");
  if (!botApiUrl || !botApiSecret) return json({ error: "stats_not_configured" }, 503);
  try {
    const response = await fetch(`${botApiUrl}/rest/v1/global_stats?id=eq.main&select=data,updated_at`, {
      headers: {
        apikey: botApiSecret,
        Authorization: `Bearer ${botApiSecret}`,
        "X-Petto-Dashboard-Key": botApiSecret,
        Accept: "application/json"
      }
    });
    if (!response.ok) return json({ error: "stats_backend_unavailable" }, 502);
    const rows = await response.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row?.data?.totals) return json({ error: "stats_not_ready" }, 503);
    return json({ data: row.data, updatedAt: row.updated_at }, 200, "public, max-age=15, s-maxage=20");
  } catch {
    return json({ error: "stats_backend_unavailable" }, 502);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
