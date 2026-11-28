import { a as appealText, l as loadSite } from '../../../../../chunks/appealSite_SuoN-UBP.mjs';
import { h as loadMessages, c as callBot, i as loadSubmission, e as timeAgo } from '../../../../../chunks/appeals_OSuSBkCm.mjs';
import { c as chatHtml } from '../../../../../chunks/appealChat_D_n62gia.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" } });
async function open(astro) {
  const site = await loadSite(astro);
  if ("redirect" in site || "status" in site) return { error: json({ ok: false, error: "not_found" }, 404) };
  if (!site.session) return { error: json({ ok: false, error: "unauthorized" }, 401) };
  const sid = String(astro.params.sid ?? "");
  const submission = await loadSubmission(astro, site.id, sid);
  if (!submission || submission.user_id !== site.session.userId) return { error: json({ ok: false, error: "not_found" }, 404) };
  return { site, sid, submission, session: site.session };
}
const GET = async (astro) => {
  const found = await open(astro);
  if ("error" in found) return found.error;
  const { site, sid, submission } = found;
  const t = appealText(site.lang);
  const messages = await loadMessages(astro, sid) ?? [];
  const who = (m) => m.author_type === "user" ? t("you") : m.author_type === "staff" ? m.anonymous ? t("staff") : m.author_name || t("staff") : t("petto");
  const html = chatHtml(messages, { prefix: "ap", who, when: (iso) => timeAgo(iso, site.lang), empty: t("noMessages") });
  return json({ ok: true, status: submission.status, count: messages.length, last: messages.at(-1)?.id ?? 0, html });
};
const POST = async (astro) => {
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: "invalid" }, 403);
  const found = await open(astro);
  if ("error" in found) return found.error;
  const { site, sid, session } = found;
  let content = "";
  try {
    content = String((await astro.request.json())?.content ?? "");
  } catch {
  }
  const result = await callBot(astro, site.id, "reply", { method: "POST", userId: session.userId, body: { submission_id: sid, content } });
  if (result.ok) return json({ ok: true });
  const error = ["rate_limited", "bot_unavailable"].includes(String(result.payload?.error)) ? String(result.payload.error) : "failed";
  return json({ ok: false, error }, result.status && result.status >= 400 ? result.status : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
