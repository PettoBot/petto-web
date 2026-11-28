import { g as getDashboardSession } from '../../../chunks/dashAuth_uqFK7-ED.mjs';
import { c as callPettoWebForm } from '../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { P as PUBLIC_ID, p as pageLook, d as descriptionHtml, i as imageUrl } from '../../../chunks/forms_B4RRKoSS.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const LANGS = { en: "en", es: "es", "pt-BR": "pt-BR", pt: "pt-BR", "pt-br": "pt-BR" };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "private, no-store" } });
const server = (data) => data?.server ? { id: String(data.server.id ?? ""), name: String(data.server.name ?? ""), icon: typeof data.server.icon === "string" && data.server.icon.startsWith("https://") ? data.server.icon : null } : null;
function lookOf(data) {
  const form = data?.form;
  if (!form) return null;
  return { form: { id: String(form.id ?? ""), title: String(form.title ?? ""), description: form.description ?? null, color: typeof form.color === "number" ? form.color : null, page: pageLook(form.page) }, server: server(data) };
}
function shape(data) {
  const form = data?.form;
  if (!form) return null;
  return {
    ...form,
    page: pageLook(form.page),
    questions: (Array.isArray(form.questions) ? form.questions : []).map((q) => ({
      ...q,
      image: imageUrl(q?.image),
      description_html: q?.description ? descriptionHtml(q.description) : ""
    }))
  };
}
const GET = async (context) => {
  const id = String(context.params.id ?? "");
  if (!PUBLIC_ID.test(id)) return json({ ok: false, code: "not_found" }, 404);
  const lang = LANGS[context.url.searchParams.get("lang") ?? ""] ?? "en";
  const session = await getDashboardSession(context);
  if (!session) {
    const look = await callPettoWebForm(context, id, "", "look", {}, lang);
    return json({ ok: false, logged: false, look: look.ok ? lookOf(look.data) : null }, 401);
  }
  const shown = await callPettoWebForm(context, id, session.userId, "public", {}, lang);
  const form = shape(shown.data);
  if (!form) return json({ ok: false, logged: true, status: shown.status, code: shown.status === 404 ? "not_found" : "unavailable" }, shown.status === 404 ? 404 : 502);
  return json({ ok: true, logged: true, user: { username: session.username }, form, server: server(shown.data), can: Boolean(shown.data.can), code: shown.data.code ?? null, reason: shown.data.reason ?? null });
};
const POST = async (context) => {
  const id = String(context.params.id ?? "");
  if (!PUBLIC_ID.test(id)) return json({ ok: false, code: "not_found" }, 404);
  const origin = context.request.headers.get("origin");
  if (!origin || origin !== context.url.origin) return json({ ok: false, code: "origin" }, 403);
  const lang = LANGS[context.url.searchParams.get("lang") ?? ""] ?? "en";
  const session = await getDashboardSession(context);
  if (!session) return json({ ok: false, logged: false }, 401);
  const body = await context.request.json().catch(() => null);
  const raw = body?.values && typeof body.values === "object" ? body.values : {};
  const values = {};
  for (const [key, value] of Object.entries(raw).slice(0, 60)) {
    if (!/^[a-z0-9_-]{1,40}$/i.test(key)) continue;
    if (Array.isArray(value)) values[key] = value.slice(0, 30).map((v) => String(v).slice(0, 100));
    else if (typeof value === "string") values[key] = value.slice(0, 5e3);
  }
  const result = await callPettoWebForm(context, id, session.userId, "submit", { values }, lang);
  if (result.ok) return json({ ok: true, number: Number(result.data.number), message: String(result.data.message ?? "") });
  if (Array.isArray(result.data?.errors)) return json({ ok: false, errors: result.data.errors.map((e) => ({ id: String(e.id), message: String(e.message) })) }, 400);
  return json({ ok: false, code: result.data?.code ?? null, message: String(result.data?.message ?? "") }, result.status >= 400 ? result.status : 502);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
