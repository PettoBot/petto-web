import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { U as callPettoTicketLive } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" } });
const ACTIONS = /* @__PURE__ */ new Set(["reply", "claim", "unclaim", "add", "remove", "close"]);
async function allowed(astro) {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) {
    const viewOnly = /error=(view_only|dev_readonly)/.test(auth.redirect);
    return { error: json({ ok: false, code: viewOnly ? "view_only" : "unauthorized" }, viewOnly ? 403 : 401) };
  }
  return { id, userId: String(auth.session.userId) };
}
const ticketNumber = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 && number <= 1e7 ? number : null;
};
const GET = async (astro) => {
  const checked = await allowed(astro);
  if ("error" in checked) return checked.error;
  const lang = getDashLang(astro);
  const raw = astro.url.searchParams.get("ticket");
  if (raw !== null) {
    const number = ticketNumber(raw);
    if (!number) return json({ ok: false, code: "not_found" }, 400);
    const result2 = await callPettoTicketLive(astro, checked.id, checked.userId, "messages", { ticket: number }, lang);
    return json(result2.data, result2.ok ? 200 : result2.status || 502);
  }
  const result = await callPettoTicketLive(astro, checked.id, checked.userId, "list", {}, lang);
  return json(result.data, result.ok ? 200 : result.status || 502);
};
const POST = async (astro) => {
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, code: "invalid" }, 403);
  const checked = await allowed(astro);
  if ("error" in checked) return checked.error;
  let body = null;
  try {
    body = await astro.request.json();
  } catch {
  }
  const action = String(body?.action ?? "");
  const number = ticketNumber(body?.ticket);
  if (!ACTIONS.has(action) || !number) return json({ ok: false, code: "invalid" }, 400);
  const payload = { ticket: number };
  if (action === "reply") payload.content = String(body?.content ?? "").slice(0, 2e3);
  if (action === "add" || action === "remove") payload.target = String(body?.target ?? "").trim().slice(0, 40);
  if (action === "close") payload.reason = String(body?.reason ?? "").slice(0, 500);
  const result = await callPettoTicketLive(astro, checked.id, checked.userId, action, payload, getDashLang(astro));
  return json(result.data, result.ok ? 200 : result.status || 502);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
