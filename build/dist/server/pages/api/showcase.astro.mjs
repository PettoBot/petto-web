import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../renderers.mjs';

const SHOWCASE_MAX = 15;
const BADGES = ["partnered", "verified", "discoverable", "discoverable-boosted", "community", "community-boosted", "boost-0", "boost-1", "boost-2", "boost-3"];
const whole = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : null;
function cleanShowcase(raw) {
  if (!Array.isArray(raw)) return [];
  const servers = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry;
    const id = typeof item.id === "string" && /^\d{15,25}$/.test(item.id) ? item.id : null;
    const name = typeof item.name === "string" ? item.name.trim().slice(0, 100) : "";
    const members = whole(item.members);
    if (!id || !name || members === null) continue;
    const icon = typeof item.icon === "string" && /^https:\/\/cdn\.discordapp\.com\//.test(item.icon) ? item.icon : null;
    servers.push({
      id,
      name,
      icon,
      animated: Boolean(icon) && item.animated === true,
      members,
      online: whole(item.online),
      badge: typeof item.badge === "string" && BADGES.includes(item.badge) ? item.badge : null
    });
    if (servers.length >= SHOWCASE_MAX) break;
  }
  return servers;
}

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
  if (!botApiUrl || !botApiSecret) return json({ servers: [] }, 200, "public, max-age=30");
  try {
    const response = await fetch(`${botApiUrl}/rest/v1/global_stats?id=eq.main&select=data,updated_at`, {
      headers: {
        apikey: botApiSecret,
        Authorization: `Bearer ${botApiSecret}`,
        "X-Petto-Dashboard-Key": botApiSecret,
        Accept: "application/json"
      }
    });
    if (!response.ok) return json({ servers: [] }, 200, "public, max-age=30");
    const rows = await response.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    return json({ servers: cleanShowcase(row?.data?.showcase), updatedAt: row?.updated_at ?? null }, 200, "public, max-age=30, s-maxage=60");
  } catch {
    return json({ servers: [] }, 200, "public, max-age=30");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
