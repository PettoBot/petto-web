import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { n as callPettoVaultRestore } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { b as backupsUnderMaintenance } from '../../../../chunks/maintenance_ZyU-NXSZ.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET_STEPS = /* @__PURE__ */ new Set(["status", "preview"]);
const POST_STEPS = /* @__PURE__ */ new Set(["challenge", "start", "cancel"]);
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
async function handle(context, method) {
  const { id } = context.params;
  const step = context.url.searchParams.get("step") ?? "";
  if (!(method === "GET" ? GET_STEPS : POST_STEPS).has(step)) return json({ ok: false, error: "unknown_step" }, 400);
  if (method === "POST" && context.request.headers.get("x-petto-dash") !== "1") return json({ ok: false, error: "forbidden" }, 403);
  const auth = await getGuildSession(context, id);
  if ("redirect" in auth) return json({ ok: false, error: "unauthorized" }, 401);
  if (backupsUnderMaintenance(context, auth.session.userId)) return json({ ok: false, error: "maintenance" }, 503);
  let body = {};
  if (method === "POST") {
    try {
      body = await context.request.json();
    } catch {
      body = {};
    }
  }
  const query = {};
  for (const key of ["backup_id", "mode", "parts"]) {
    const value = context.url.searchParams.get(key);
    if (value) query[key] = value;
  }
  const allowed = step === "start" ? { backup_id: Number(body.backup_id), mode: String(body.mode ?? "merge"), parts: String(body.parts ?? "").slice(0, 100), challenge_id: String(body.challenge_id ?? ""), answer: String(body.answer ?? "") } : {};
  const result = await callPettoVaultRestore(context, id, auth.session.userId, step, { method, query, body: allowed });
  return json(result.payload ?? { ok: false, error: "bot_unavailable" }, result.ok ? 200 : result.status >= 400 ? result.status : 502);
}
const GET = (context) => handle(context, "GET");
const POST = (context) => handle(context, "POST");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
