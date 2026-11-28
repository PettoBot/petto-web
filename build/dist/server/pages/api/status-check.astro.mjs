import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { r as runStatusCycle } from '../../chunks/statusMonitor_eg7DWmfk.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const digest = async (text) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
function sameDigest(a, b) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}
const POST = async ({ locals, request, url }) => {
  const secret = getEnv({ locals }, "PETTO_BOT_API_SECRET");
  const given = request.headers.get("x-petto-status-key") ?? "";
  if (!secret || !sameDigest(await digest(given), await digest(secret))) return new Response("Not found", { status: 404 });
  const result = await runStatusCycle({ locals }, url.origin);
  return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
