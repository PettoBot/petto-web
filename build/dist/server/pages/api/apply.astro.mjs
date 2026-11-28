import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { i as isApplicationRole, r as readAnswers, t as tooManyAttempts, a as applicationRoles, b as applicationCopy, s as sendApplication } from '../../chunks/applicationCopy_Cm3gfsjr.mjs';
import { l as localePath } from '../../chunks/ui_C1MR3LHJ.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
function localeFrom(value) {
  return value === "es" || value === "pt-BR" ? value : "en";
}
function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
const POST = async (context) => {
  const { request, url, redirect } = context;
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return new Response("Forbidden", { status: 403 });
  const wantsJson = (request.headers.get("accept") ?? "").includes("application/json");
  const form = await request.formData();
  const lang = localeFrom(form.get("lang"));
  const role = form.get("role");
  const back = (query) => redirect(`${localePath[lang]}/apply?${query}`, 303);
  const fail = (code, status, errors) => wantsJson ? json({ ok: false, error: code, errors }, status) : back(`${isApplicationRole(role) ? `role=${role}&` : ""}error=${code}`);
  if (!isApplicationRole(role)) return fail("invalid", 400);
  if (String(form.get("website") ?? "") !== "") return wantsJson ? json({ ok: true }) : back(`role=${role}&sent=1`);
  const webhookUrl = getEnv(context, "PETTO_FORMS_WEBHOOK_URL");
  if (!webhookUrl) return fail("unavailable", 503);
  const parsed = readAnswers(role, form);
  if ("errors" in parsed) return fail("invalid", 422, parsed.errors);
  const visitor = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "unknown";
  if (tooManyAttempts(visitor)) return fail("rate", 429);
  const session = await getDashboardSession(context);
  const copy = applicationCopy.en;
  const selectKeys = new Set(applicationRoles[role].fields.filter((f) => f.kind === "select").map((f) => f.key));
  const answers = Object.fromEntries(Object.entries(parsed.answers).map(([key, value]) => [key, selectKeys.has(key) ? copy.options[value] ?? value : value]));
  const sent = await sendApplication(webhookUrl, role, answers, {
    verifiedId: session?.userId ?? null,
    username: session?.username ?? null,
    labels: Object.fromEntries(Object.entries(copy.fields[role]).map(([key, value]) => [key, value.label])),
    title: `${copy.roles[role].title} application`,
    verifiedLabel: "Logged in with Discord as",
    unverifiedLabel: "Not logged in. The Discord user below was typed by the applicant and is not verified."
  });
  if (!sent) return fail("failed", 502);
  return wantsJson ? json({ ok: true }) : back(`role=${role}&sent=1`);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
