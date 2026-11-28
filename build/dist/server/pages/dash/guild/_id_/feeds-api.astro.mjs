import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { z as callPettoFeeds } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
import { c as canUseFeeds } from '../../../../chunks/feedsAccess_J9XGccQ9.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
const ROUTES = ["resolve", "search", "create", "update", "delete", "test", "preview"];
const POST = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ ok: false, error: "unauthorized" }, 401);
  if (!canUseFeeds(astro, auth.session.userId)) return json({ ok: false, error: "no_access" }, 403);
  const body = await astro.request.json().catch(() => null);
  const route = String(body?.action ?? "");
  if (!body || !ROUTES.includes(route)) return json({ ok: false, error: "unknown_action" }, 400);
  const { action: _action, user_id: _user, ...rest } = body;
  const answer = await callPettoFeeds(astro, id, auth.session.userId, route, rest, getDashLang(astro));
  if (!answer.data) return json({ ok: false, error: "bot_unavailable", message: "", retry: Boolean(answer.down && answer.retrySafe) }, 502);
  if (answer.data.error === "ambiguous") {
    const choices = (Array.isArray(answer.data.choices) ? answer.data.choices : []).filter((choice) => choice && typeof choice.account === "string" && choice.account.trim()).slice(0, 10).map((choice) => ({ key: String(choice.key ?? "").slice(0, 40), label: String(choice.label || choice.account).slice(0, 100), account: String(choice.account).slice(0, 200) }));
    return json({ ok: false, error: "ambiguous", word: String(answer.data.word ?? "").slice(0, 40), choices, message: typeof answer.data.message === "string" ? answer.data.message : "" }, 409);
  }
  return json(answer.data, answer.status || (answer.ok ? 200 : 502));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
