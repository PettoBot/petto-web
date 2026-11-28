import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { s as shapeJob, e as etaSeconds } from '../../../../chunks/bulkRole_DtuybX_8.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  const { id } = context.params;
  const session = await getGuildSession(context, id);
  if ("redirect" in session) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  const apiUrl = getEnv(context, "PETTO_BOT_API_URL");
  const apiKey = getEnv(context, "PETTO_BOT_API_SECRET");
  if (!apiUrl || !apiKey) return new Response(JSON.stringify({ error: "server not configured" }), { status: 500 });
  const res = await fetch(`${apiUrl}/rest/v1/bulk_role_jobs?guild_id=eq.${encodeURIComponent(id)}&order=created_at.desc&limit=1`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }
  });
  const rows = res.ok ? await res.json() : [];
  const job = shapeJob(rows[0] ?? null);
  return new Response(JSON.stringify({ job, etaSeconds: job ? etaSeconds(job) : null }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
