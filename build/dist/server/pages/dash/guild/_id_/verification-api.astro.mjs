import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { q as callPettoVerification } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const ACTIONS = /* @__PURE__ */ new Set(["setup", "panel", "enable", "disable"]);
const POST = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ ok: false, message: "Sign in again." }, 401);
  const body = await astro.request.json().catch(() => null);
  const action = String(body?.action ?? "");
  if (!ACTIONS.has(action)) return json({ ok: false, message: "Unknown action." }, 400);
  const channelId = String(body?.channel_id ?? "").trim();
  if (action === "panel" && /^\d{15,25}$/.test(channelId)) {
    const apiUrl = getEnv(astro, "PETTO_BOT_API_URL");
    const apiKey = getEnv(astro, "PETTO_BOT_API_SECRET");
    if (apiUrl && apiKey) {
      const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
      await ensureGuildRow(apiUrl, headers, id);
      const image = typeof body?.panel_image_url === "string" ? /^https:\/\/\S+$/i.test(body.panel_image_url.trim()) ? body.panel_image_url.trim().slice(0, 500) : null : void 0;
      await fetch(`${apiUrl}/rest/v1/verification_config?on_conflict=guild_id`, { method: "POST", headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, panel_channel_id: channelId, ...image === void 0 ? {} : { panel_image_url: image }, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) }).catch(() => null);
    }
  }
  const result = await callPettoVerification(astro, id, String(auth.session.userId), action);
  if (result.down) return json({ ok: false, error: "bot_unavailable", message: "", retry: Boolean(result.retrySafe) }, 502);
  return json(result, result.ok ? result.status === "running" ? 202 : 200 : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
