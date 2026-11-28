import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { i as callPettoAppeals } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { c as chatHtml } from '../../../../chunks/appealChat_D_n62gia.mjs';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" } });
const UUID = /^[0-9a-f-]{36}$/i;
async function allowed(astro) {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return { error: json({ ok: false, error: "unauthorized" }, 401) };
  return { id, session: auth.session };
}
const GET = async (astro) => {
  const checked = await allowed(astro);
  if ("error" in checked) return checked.error;
  const apiUrl = getEnv(astro, "PETTO_BOT_API_URL");
  const apiKey = getEnv(astro, "PETTO_BOT_API_SECRET");
  if (!apiUrl || !apiKey) return json({ ok: false, error: "not_configured" }, 503);
  const ids = String(astro.url.searchParams.get("ids") ?? "").split(",").filter((v) => UUID.test(v)).slice(0, 20);
  if (!ids.length) return json({ ok: true, items: {} });
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
  const list = ids.join(",");
  const [subsRes, msgsRes] = await Promise.all([
    fetch(`${apiUrl}/rest/v1/appeal_submissions?guild_id=eq.${checked.id}&id=in.(${list})&select=id,username,status`, { headers }),
    fetch(`${apiUrl}/rest/v1/appeal_messages?submission_id=in.(${list})&select=*&order=created_at.asc`, { headers })
  ]);
  if (!subsRes.ok || !msgsRes.ok) return json({ ok: false, error: "failed" }, 502);
  const dt = makeT(getDashLang(astro));
  const lang = getDashLang(astro);
  const when = (iso) => new Date(iso).toLocaleString(lang, { dateStyle: "medium", timeStyle: "short" });
  const subs = await subsRes.json();
  const grouped = {};
  for (const m of await msgsRes.json()) (grouped[m.submission_id] ??= []).push(m);
  const items = {};
  for (const s of subs) {
    const messages = grouped[s.id] ?? [];
    const who = (m) => m.author_type === "user" ? s.username : m.author_type === "staff" ? m.author_name ?? dt("Staff") : "Petto";
    items[s.id] = { status: s.status, count: messages.length, html: chatHtml(messages, { prefix: "da", who, when, empty: dt("No messages yet.") }) };
  }
  return json({ ok: true, items });
};
const POST = async (astro) => {
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: "invalid" }, 403);
  const checked = await allowed(astro);
  if ("error" in checked) return checked.error;
  let body = {};
  try {
    body = await astro.request.json();
  } catch {
  }
  const submissionId = String(body?.submission_id ?? "");
  const content = String(body?.content ?? "").trim().slice(0, 1500);
  if (!UUID.test(submissionId) || !content) return json({ ok: false, error: "invalid" }, 400);
  const result = await callPettoAppeals(astro, checked.id, checked.session.userId, "reply", { id: submissionId, content });
  return json({ ok: Boolean(result.ok), message: result.ok ? null : String(result.payload?.message ?? "") }, result.ok ? 200 : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
