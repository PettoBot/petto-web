import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { t as callPettoCode } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { c as canUseCodeCommands } from '../../../../chunks/codeAccess_BCmrm43i.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
async function who(astro, id) {
  const result = await getGuildSession(astro, id);
  if ("redirect" in result) return null;
  return canUseCodeCommands(astro, result.session.userId) ? result.session : null;
}
const GET = async (astro) => {
  const { id } = astro.params;
  const session = await who(astro, id);
  if (!session) return json({ ok: false, error: "unauthorized" }, 401);
  const view = new URL(astro.request.url).searchParams.get("view") === "overview" ? "overview" : "meta";
  const answer = await callPettoCode(astro, id, session.userId, view);
  return json(answer.payload ?? { ok: false, error: "bot_unavailable" }, answer.ok ? 200 : answer.status);
};
const POST = async (astro) => {
  const { id } = astro.params;
  const session = await who(astro, id);
  if (!session) return json({ ok: false, error: "unauthorized" }, 401);
  const body = await astro.request.json().catch(() => ({}));
  const action = String(body.action ?? "");
  if (action === "delete") {
    const apiUrl = getEnv(astro, "PETTO_BOT_API_URL");
    const apiKey = getEnv(astro, "PETTO_BOT_API_SECRET");
    const name = String(body.name ?? "").toLowerCase();
    if (!apiUrl || !apiKey || !/^[a-z0-9_-]{1,32}$/.test(name)) return json({ ok: false, error: "invalid" }, 400);
    const res = await fetch(`${apiUrl}/rest/v1/custom_commands?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, { method: "DELETE", headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}`, Prefer: "return=minimal" } });
    return json({ ok: res.ok }, res.ok ? 200 : 502);
  }
  const routes = { check: "check", test: "test", save: "save", trigger: "trigger", timezone: "timezone", links: "links", options: "options", reminder: "reminder", "reminder-cancel": "reminder/cancel" };
  if (!routes[action]) return json({ ok: false, error: "unknown_action" }, 400);
  const { action: _ignored, user_id: _user, ...rest } = body;
  const answer = await callPettoCode(astro, id, session.userId, routes[action], rest);
  return json(answer.payload ?? { ok: false, error: "bot_unavailable" }, answer.status || 502);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
