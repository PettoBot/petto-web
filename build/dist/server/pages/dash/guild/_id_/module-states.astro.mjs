import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { l as loadModuleStatuses } from '../../../../chunks/moduleStatuses_a5libdxg.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const KEEP_MS = 2e4;
const kept = /* @__PURE__ */ new Map();
const reading = /* @__PURE__ */ new Map();
async function read(apiUrl, apiKey, id) {
  const { statuses } = await loadModuleStatuses(apiUrl, apiKey, id);
  const states = {};
  for (const [module, status] of Object.entries(statuses)) if (status.state === "on" || status.state === "todo") states[module] = status.state;
  return states;
}
const GET = async (astro) => {
  const { id } = astro.params;
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return new Response(JSON.stringify({ states: {} }), { status: 401, headers });
  const apiUrl = getEnv(astro, "PETTO_BOT_API_URL");
  const apiKey = getEnv(astro, "PETTO_BOT_API_SECRET");
  if (!apiUrl || !apiKey) return new Response(JSON.stringify({ states: {} }), { headers });
  const now = Date.now();
  const hit = kept.get(id);
  if (hit && now - hit.at < KEEP_MS && astro.url.searchParams.get("fresh") !== "1") return new Response(JSON.stringify({ states: hit.states }), { headers });
  let pending = reading.get(id);
  if (!pending) {
    pending = read(apiUrl, apiKey, id).finally(() => reading.delete(id));
    reading.set(id, pending);
  }
  try {
    const states = await pending;
    kept.set(id, { at: Date.now(), states });
    if (kept.size > 200) for (const key of kept.keys()) {
      kept.delete(key);
      if (kept.size <= 100) break;
    }
    return new Response(JSON.stringify({ states }), { headers });
  } catch {
    return new Response(JSON.stringify({ states: {} }), { headers });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
