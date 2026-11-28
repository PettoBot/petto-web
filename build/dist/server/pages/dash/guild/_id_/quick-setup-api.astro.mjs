import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { b as getCachedUserGuilds } from '../../../../chunks/discordCache_CnRINZ-g.mjs';
import { c as canManageGuild } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { M as callPettoQuickSetup } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
export { renderers } from '../../../../renderers.mjs';

const SETUP_MODULES = ["moderation", "automod", "welcome", "autorole", "tickets", "verification"];
const SNOWFLAKE = /^\d{15,25}$/;
const pick = (value) => value === "new" ? "new" : SNOWFLAKE.test(String(value ?? "")) ? String(value) : null;
const text = (value, max) => String(value ?? "").replace(/\u0000/g, "").replace(/\r\n?/g, "\n").trim().slice(0, max);
function cleanQuickSetup(raw) {
  const o = raw && typeof raw === "object" ? raw : {};
  const modules = Object.fromEntries(SETUP_MODULES.map((module) => [module, o.modules?.[module] === true]));
  return {
    modules,
    moderation: { log_channel: pick(o.moderation?.log_channel) },
    automod: { spam: o.automod?.spam !== false, invites: o.automod?.invites === true, scam: o.automod?.scam === true, links: o.automod?.links === true },
    welcome: { channel: pick(o.welcome?.channel), message: text(o.welcome?.message, 1800), goodbye: o.welcome?.goodbye === true },
    autorole: { role: pick(o.autorole?.role) },
    tickets: { channel: pick(o.tickets?.channel), support_role: pick(o.tickets?.support_role) }
  };
}

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const POST = async (astro) => {
  const { id } = astro.params;
  const dt = makeT(getDashLang(astro));
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ ok: false, message: dt("Sign in again.") }, 401);
  if (auth.devView || auth.access) return json({ ok: false, message: dt("Only people with Manage Server can run Quick Setup.") }, 403);
  const guilds = await getCachedUserGuilds(auth.session.accessToken, astro.request, { forAccess: true }).catch(() => []);
  if (!canManageGuild(guilds.find((g) => g.id === id) ?? {})) return json({ ok: false, message: dt("Only people with Manage Server can run Quick Setup.") }, 403);
  const body = await astro.request.json().catch(() => null);
  const setup = cleanQuickSetup(body?.setup);
  if (!Object.values(setup.modules).some(Boolean)) return json({ ok: false, message: dt("Turn on at least one module.") }, 400);
  const result = await callPettoQuickSetup(astro, id, String(auth.session.userId), setup, getDashLang(astro));
  if (!result.results.length) return json({ ok: false, message: result.message || dt("Petto did not answer. Try again in a moment.") }, 502);
  return json(result, result.ok ? 200 : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
