import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { b as getCachedUserGuilds } from '../../../../chunks/discordCache_CnRINZ-g.mjs';
import { c as canManageGuild } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { K as callPettoPermissionAlerts } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
async function allowed(astro, id) {
  const dt = makeT(getDashLang(astro));
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return { response: json({ ok: false, message: dt("Sign in again.") }, 401) };
  const needsManage = dt("Only people with Manage Server can see this.");
  if (auth.devView || auth.access) return { response: json({ ok: false, message: needsManage }, 403) };
  const guilds = await getCachedUserGuilds(auth.session.accessToken, astro.request, { forAccess: true }).catch(() => []);
  if (!canManageGuild(guilds.find((g) => g.id === id) ?? {})) return { response: json({ ok: false, message: needsManage }, 403) };
  return { userId: String(auth.session.userId), dt };
}
const GET = async (astro) => {
  const { id } = astro.params;
  const gate = await allowed(astro, id);
  if ("response" in gate && gate.response) return gate.response;
  const { userId, dt } = gate;
  const result = await callPettoPermissionAlerts(astro, id, userId, "list", "", getDashLang(astro));
  if (!result.ok) return json({ ok: false, message: result.message || dt("Petto did not answer. Try again in a moment.") }, 502);
  return json({ ok: true, alerts: result.alerts });
};
const POST = async (astro) => {
  const { id } = astro.params;
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== new URL(astro.request.url).origin) return json({ ok: false }, 403);
  const gate = await allowed(astro, id);
  if ("response" in gate && gate.response) return gate.response;
  const { userId, dt } = gate;
  const body = await astro.request.json().catch(() => null);
  const key = String(body?.key ?? "").slice(0, 400);
  if (!key) return json({ ok: false, message: dt("Petto did not answer. Try again in a moment.") }, 400);
  const result = await callPettoPermissionAlerts(astro, id, userId, "dismiss", key, getDashLang(astro));
  if (!result.ok) return json({ ok: false, message: result.message || dt("Petto did not answer. Try again in a moment.") }, 502);
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
