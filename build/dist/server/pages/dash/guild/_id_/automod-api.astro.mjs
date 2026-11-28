import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { l as callPettoNativeAutomod } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { T as TEMPLATES, P as PACKS, c as cleanOptions, a as PETTO_ACTIONS, p as parseDomainList } from '../../../../chunks/automodTemplates_DK-cTfY2.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const SNOWFLAKE = /^\d{15,25}$/;
const NAMES = {
  links: "All links",
  invites: "Invite links",
  inline_links: "Inline links",
  emails: "Email addresses",
  scam: "Scam text",
  ip_addresses: "IP addresses",
  phone_numbers: "Phone numbers",
  emojis: "Emoji spam",
  zalgo: "Zalgo text",
  headings: "Headings",
  subtext: "Subtext",
  caps: "Shouting",
  repeated_characters: "Repeated characters",
  spoilers: "Spoiler spam",
  invisible_text: "Invisible text",
  fake_pings: "Fake pings"
};
const POST = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ ok: false, message: "Sign in again." }, 401);
  const body = await astro.request.json().catch(() => null);
  const op = String(body?.op ?? "");
  const userId = String(auth.session.userId);
  const ids = (list) => Array.isArray(list) ? list.map(String).filter((v) => SNOWFLAKE.test(v)).slice(0, 50) : [];
  if (op === "native_add") {
    const template = typeof body.template === "string" ? body.template : void 0;
    const pack = typeof body.pack === "string" ? body.pack : void 0;
    const kind = typeof body.kind === "string" ? body.kind : void 0;
    if (template && !TEMPLATES.some((t) => t.id === template)) return json({ ok: false, message: "That template does not exist." }, 400);
    if (pack && !PACKS.includes(pack)) return json({ ok: false, message: "That pack does not exist." }, 400);
    if (kind && !["spam", "mentions", "presets"].includes(kind)) return json({ ok: false, message: "That is not a kind of rule." }, 400);
    const result = await callPettoNativeAutomod(astro, id, userId, {
      op: "add",
      template,
      pack,
      kind,
      options: template ? cleanOptions(template, body.options) : {},
      presets: Array.isArray(body.presets) ? body.presets.map(String).filter((p) => ["profanity", "sexual", "slurs"].includes(p)) : [],
      mentionLimit: Math.max(1, Math.min(50, Math.floor(Number(body.mentionLimit)) || 5)),
      block: body.block !== false,
      alertChannelId: SNOWFLAKE.test(String(body.alertChannelId ?? "")) ? String(body.alertChannelId) : null,
      timeoutMinutes: Math.max(0, Math.min(40320, Math.floor(Number(body.timeoutMinutes)) || 0)),
      customMessage: String(body.customMessage ?? "").slice(0, 150),
      exemptRoleIds: ids(body.exemptRoleIds),
      exemptChannelIds: ids(body.exemptChannelIds)
    });
    return json(result, result.ok ? 200 : 400);
  }
  if (op === "native_list") {
    const result = await callPettoNativeAutomod(astro, id, userId, { op: "list" });
    return json(result, result.ok ? 200 : 400);
  }
  if (op === "native_toggle" || op === "native_delete") {
    const rule = String(body.id ?? "");
    if (!SNOWFLAKE.test(rule)) return json({ ok: false, message: "That is not a rule." }, 400);
    const result = await callPettoNativeAutomod(astro, id, userId, { op: op === "native_toggle" ? "toggle" : "delete", id: rule, enabled: body.enabled === true });
    return json(result, result.ok ? 200 : 400);
  }
  const apiUrl = getEnv(astro, "PETTO_BOT_API_URL");
  const apiKey = getEnv(astro, "PETTO_BOT_API_SECRET");
  if (!apiUrl || !apiKey) return json({ ok: false, message: "The dashboard is not connected to the bot." }, 500);
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  if (op === "filter_add") {
    const template = String(body.template ?? "");
    const options = cleanOptions(template, body.options);
    if (!options) return json({ ok: false, message: "That template does not exist." }, 400);
    const action = PETTO_ACTIONS.includes(body.action) ? body.action : "delete";
    const count = await fetch(`${apiUrl}/rest/v1/automod_rules?guild_id=eq.${id}&select=id`, { headers }).then((r) => r.ok ? r.json() : []).catch(() => []);
    if (count.length >= 40) return json({ ok: false, message: "A server can have 40 filters. Remove one first." }, 400);
    await ensureGuildRow(apiUrl, headers, id);
    const res = await fetch(`${apiUrl}/rest/v1/automod_rules`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({
        guild_id: id,
        name: NAMES[template] ?? template,
        template,
        options,
        action,
        mute_minutes: Math.max(1, Math.min(40320, Math.floor(Number(body.muteMinutes)) || 10)),
        exempt_role_ids: ids(body.exemptRoleIds),
        exempt_channel_ids: ids(body.exemptChannelIds)
      })
    });
    return json({ ok: res.ok, message: res.ok ? void 0 : "It could not be saved, try again." }, res.ok ? 200 : 500);
  }
  if (op === "link_domains_save") {
    const { domains, invalid, overflow } = parseDomainList(body.domains);
    await ensureGuildRow(apiUrl, headers, id);
    const res = await fetch(`${apiUrl}/rest/v1/automod_config?on_conflict=guild_id`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ guild_id: id, allowed_link_domains: domains, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
    if (res.ok) return json({ ok: true, domains, invalid, overflow });
    const detail = await res.text().catch(() => "");
    const unsupported = /allowed_link_domains|PGRST204|42703/.test(detail);
    return json({ ok: false, unsupported, message: unsupported ? "The bot has not been updated for this yet." : "It could not be saved, try again." }, unsupported ? 409 : 500);
  }
  if (op === "filter_toggle" || op === "filter_delete") {
    const ruleId = Math.floor(Number(body.id));
    if (!Number.isInteger(ruleId) || ruleId < 1) return json({ ok: false, message: "That is not a filter." }, 400);
    const url = `${apiUrl}/rest/v1/automod_rules?guild_id=eq.${id}&id=eq.${ruleId}`;
    const res = op === "filter_delete" ? await fetch(url, { method: "DELETE", headers }) : await fetch(url, { method: "PATCH", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ enabled: body.enabled === true }) });
    return json({ ok: res.ok }, res.ok ? 200 : 500);
  }
  return json({ ok: false, message: "That is not something I can do." }, 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
