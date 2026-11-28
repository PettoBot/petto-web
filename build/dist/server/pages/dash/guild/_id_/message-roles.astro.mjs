import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$SelectSource } from '../../../../chunks/SelectSource_Dp8aydFk.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                                  */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashMessageRoles = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashMessageRoles;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, rules, roles, everyRole, ready, saved, problem, max } = Astro2.props;
  const name = (roleId) => everyRole.find((role) => role.id === roleId)?.name ?? dt("a role that is gone");
  const on = rules.filter((rule) => rule.enabled).length;
  const docsUrl = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/onboarding/message-roles`;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "message-roles", "pageTitle": "Message roles", "data-astro-cid-d7gm6rjz": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<div class="sx-page mr" data-astro-cid-d7gm6rjz> <div class="mr-head" data-astro-cid-d7gm6rjz> <h1 data-astro-cid-d7gm6rjz>', '</h1> <a class="btn btn-ghost btn-sm"', ' target="_blank" rel="noopener" data-astro-cid-d7gm6rjz>', "", '</a> </div> <p class="sx-lead" data-astro-cid-d7gm6rjz>', "</p> ", " ", " ", " ", ' <div class="mr-cols" data-astro-cid-d7gm6rjz> <section class="sx-panel mr-box" data-astro-cid-d7gm6rjz> <div class="sx-panel-head" data-astro-cid-d7gm6rjz><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-d7gm6rjz>', "</span><h2 data-astro-cid-d7gm6rjz>", "</h2>", "</div> ", " ", ' </section> <form method="POST" class="sx-panel mr-box" data-no-dirty data-mr-form data-astro-cid-d7gm6rjz> <input type="hidden" name="action" value="add" data-astro-cid-d7gm6rjz> <div class="sx-panel-head" data-astro-cid-d7gm6rjz><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-d7gm6rjz>', "</span><h2 data-astro-cid-d7gm6rjz>", '</h2></div> <div class="sx-field" data-astro-cid-d7gm6rjz><label for="mr-role" data-astro-cid-d7gm6rjz>', '</label> <select id="mr-role" name="role_id" required data-give-role data-fill="mr-roles"', ' data-astro-cid-d7gm6rjz><option value="" disabled selected data-astro-cid-d7gm6rjz>', '</option></select> </div> <div class="sx-field" data-astro-cid-d7gm6rjz><label for="mr-messages" data-astro-cid-d7gm6rjz>', '</label> <input id="mr-messages" type="number" name="messages" min="1" max="10000000" value="100" required', ' data-astro-cid-d7gm6rjz> </div> <div class="sx-field" data-astro-cid-d7gm6rjz><span class="sx-label" id="mr-mode-l" data-astro-cid-d7gm6rjz>', '</span> <div class="dfx-chips" role="radiogroup" aria-labelledby="mr-mode-l" data-astro-cid-d7gm6rjz> <label class="dfx-chip" data-astro-cid-d7gm6rjz><input type="radio" name="mode" value="total" checked data-mr-mode data-astro-cid-d7gm6rjz>', '</label> <label class="dfx-chip" data-astro-cid-d7gm6rjz><input type="radio" name="mode" value="period" data-mr-mode data-astro-cid-d7gm6rjz>', '</label> </div> </div> <div class="sx-field" data-mr-period hidden data-astro-cid-d7gm6rjz><label for="mr-days" data-astro-cid-d7gm6rjz>', '</label> <input id="mr-days" type="number" name="period_days" min="1" max="365" value="30"', ' data-astro-cid-d7gm6rjz> </div> <label class="sx-switch mr-below" data-mr-period hidden data-astro-cid-d7gm6rjz><input type="checkbox" name="remove_below" role="switch" data-astro-cid-d7gm6rjz><span class="sx-toggle" data-astro-cid-d7gm6rjz></span><span data-astro-cid-d7gm6rjz>', '</span></label> <p class="sx-hint" data-astro-cid-d7gm6rjz>', '</p> <div class="sx-foot" data-astro-cid-d7gm6rjz><button type="submit" class="btn btn-accent btn-sm"', " data-astro-cid-d7gm6rjz>", "", "</button></div> </form> </div> </div> ", " <script>\n    // The switch of a rule saves at once (it is a small form of its own). The days and the switch of the period only show when the period is chosen.\n    document.addEventListener('change', function (event) {\n      var box = event.target && event.target.closest ? event.target.closest('input[data-auto-submit]') : null;\n      if (box && box.form) { if (box.form.requestSubmit) box.form.requestSubmit(); else box.form.submit(); }\n      var mode = event.target && event.target.matches ? event.target.matches('input[data-mr-mode]') : false;\n      if (mode) {\n        var form = event.target.closest('form');\n        var period = event.target.value === 'period';\n        form.querySelectorAll('[data-mr-period]').forEach(function (el) { el.hidden = !period; });\n      }\n    });\n  <\/script> ", " "])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-d7gm6rjz": true }), maybeRenderHead(), dt("Message roles"), addAttribute(docsUrl, "href"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13", "data-astro-cid-d7gm6rjz": true }), dt("Read the docs"), dt("Give a role when a member reaches a number of messages: all of them since the first rule, or only the ones of the last days. Petto counts from the moment you add the first rule, and gives the role right after the message that reaches the number."), saved && renderTemplate`<div class="sx-flash" data-astro-cid-d7gm6rjz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-d7gm6rjz": true })}${dt("Saved.")}</div>`, problem && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-d7gm6rjz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-d7gm6rjz": true })}${problem}</div>`, !ready && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-d7gm6rjz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-d7gm6rjz": true })}${dt("Message roles are not available yet. Petto is being updated: try again in a few minutes.")}</div>`, renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Rules"), value: rules.length, tone: "messages" },
    { label: dt("On"), value: on, tone: "joins" }
  ], "data-astro-cid-d7gm6rjz": true }), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chat-circle-text-fill", "width": "17", "height": "17", "data-astro-cid-d7gm6rjz": true }), dt("Rules"), rules.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-d7gm6rjz>${rules.length}/${max}</span>`, rules.length === 0 && renderTemplate`<p class="mr-empty" data-astro-cid-d7gm6rjz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chat-circle-text-fill", "width": "22", "height": "22", "data-astro-cid-d7gm6rjz": true })}${dt("No rules yet. Add the first one.")}</p>`, rules.length > 0 && renderTemplate`<div class="sx-list mr-list dgl-stagger" data-astro-cid-d7gm6rjz> ${rules.map((rule) => renderTemplate`<div${addAttribute(["sx-row", "mr-row", { "mr-off": !rule.enabled }], "class:list")} data-astro-cid-d7gm6rjz> <span class="mr-count" data-astro-cid-d7gm6rjz><b data-astro-cid-d7gm6rjz>${rule.messages.toLocaleString("en-US")}</b><em data-astro-cid-d7gm6rjz>${dt("messages")}</em></span> <span class="mr-what" data-astro-cid-d7gm6rjz> <span class="mr-line" data-astro-cid-d7gm6rjz>${dt("Gives")} <b data-astro-cid-d7gm6rjz>${name(rule.roleId)}</b></span> <span class="mr-tags" data-astro-cid-d7gm6rjz> <span class="sx-tag" data-astro-cid-d7gm6rjz>${rule.mode === "period" ? dt("In the last {n} days", { n: rule.periodDays }) : dt("All time")}</span> ${rule.removeBelow && renderTemplate`<span class="sx-tag" data-astro-cid-d7gm6rjz>${dt("Taken away if under")}</span>`} </span> </span> <form method="POST" data-no-dirty class="mr-act" data-astro-cid-d7gm6rjz> <input type="hidden" name="action" value="toggle" data-astro-cid-d7gm6rjz><input type="hidden" name="rule_id"${addAttribute(rule.id, "value")} data-astro-cid-d7gm6rjz> <label class="sx-switch mr-switch"${addAttribute(rule.enabled ? dt("On") : dt("Off"), "title")} data-astro-cid-d7gm6rjz><input type="checkbox" name="enabled" role="switch"${addAttribute(rule.enabled, "checked")}${addAttribute(dt("On"), "aria-label")} data-auto-submit data-astro-cid-d7gm6rjz><span class="sx-toggle" data-astro-cid-d7gm6rjz></span></label> </form> <form method="POST" data-no-dirty class="mr-act" data-astro-cid-d7gm6rjz> <input type="hidden" name="action" value="remove" data-astro-cid-d7gm6rjz><input type="hidden" name="rule_id"${addAttribute(rule.id, "value")} data-astro-cid-d7gm6rjz> <button type="submit" class="sx-iconbtn"${addAttribute(dt("Remove"), "aria-label")}${addAttribute(dt("Remove"), "title")} data-astro-cid-d7gm6rjz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-d7gm6rjz": true })}</button> </form> </div>`)} </div>`, renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "17", "height": "17", "data-astro-cid-d7gm6rjz": true }), dt("Add a rule"), dt("Role to give"), addAttribute(!ready, "disabled"), dt("Role"), dt("Number of messages"), addAttribute(!ready, "disabled"), dt("Which messages count"), dt("All time"), dt("Only the last days"), dt("Days of the period"), addAttribute(!ready, "disabled"), dt("Take the role away if the member falls under the number"), dt("Petto's role has to be above the role it gives or takes away."), addAttribute(!ready || rules.length >= max, "disabled"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-d7gm6rjz": true }), dt("Add"), renderComponent($$result2, "SelectSource", $$SelectSource, { "name": "mr-roles", "items": roles.map((role) => ({ id: role.id, name: role.name })), "data-astro-cid-d7gm6rjz": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-d7gm6rjz": true })) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashMessageRoles.astro", void 0);

const MAX_MESSAGE_RULES = 25;
const MAX_MESSAGES = 1e7;
const MAX_PERIOD_DAYS = 365;
const SNOWFLAKE = /^\d{15,25}$/;
function checkMessageRule(input) {
  const roleId = String(input.roleId ?? "").trim();
  if (!SNOWFLAKE.test(roleId)) return { ok: false, reason: "role" };
  const messages = Number(input.messages);
  if (!Number.isInteger(messages) || messages < 1 || messages > MAX_MESSAGES) return { ok: false, reason: "messages", max: MAX_MESSAGES };
  if (String(input.mode) !== "period") return { ok: true, rule: { roleId, messages, mode: "total", periodDays: 0, removeBelow: false } };
  const periodDays = Number(input.periodDays);
  if (!Number.isInteger(periodDays) || periodDays < 1 || periodDays > MAX_PERIOD_DAYS) return { ok: false, reason: "period", max: MAX_PERIOD_DAYS };
  return { ok: true, rule: { roleId, messages, mode: "period", periodDays, removeBelow: input.removeBelow === true } };
}

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$MessageRoles = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MessageRoles;
  const dt = makeT(getDashLang(Astro2));
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  let saved = false;
  let problem = null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    try {
      if (action === "add") {
        const checked = checkMessageRule({ roleId: form.get("role_id"), messages: form.get("messages"), mode: form.get("mode"), periodDays: form.get("period_days"), removeBelow: form.get("remove_below") === "on" });
        if (!checked.ok) {
          problem = checked.reason === "role" ? dt("Pick the role to give.") : checked.reason === "messages" ? dt("The number of messages must be from 1 to {n}.", { n: checked.max }) : dt("The days of the period must be from 1 to {n}.", { n: checked.max });
        } else {
          const count = await fetch(`${apiUrl}/rest/v1/message_roles?guild_id=eq.${id}&select=id`, { headers });
          const have = count.ok ? (await count.json()).length : 0;
          if (have >= MAX_MESSAGE_RULES) problem = dt("There is no room: a server can have {n} rules.", { n: MAX_MESSAGE_RULES });
          else {
            const rule = checked.rule;
            const res = await fetch(`${apiUrl}/rest/v1/message_roles?on_conflict=guild_id,role_id,messages,mode,period_days`, {
              method: "POST",
              headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
              body: JSON.stringify({ guild_id: id, role_id: rule.roleId, messages: rule.messages, mode: rule.mode, period_days: rule.periodDays, remove_below: rule.removeBelow, enabled: true })
            });
            if (res.ok) saved = true;
            else problem = dt("It could not be saved. Try again in a moment.");
          }
        }
      } else if (action === "remove" || action === "toggle") {
        const ruleId = Math.floor(Number(form.get("rule_id")));
        if (Number.isFinite(ruleId) && ruleId > 0) {
          const res = action === "remove" ? await fetch(`${apiUrl}/rest/v1/message_roles?guild_id=eq.${id}&id=eq.${ruleId}`, { method: "DELETE", headers }) : await fetch(`${apiUrl}/rest/v1/message_roles?guild_id=eq.${id}&id=eq.${ruleId}`, { method: "PATCH", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ enabled: form.get("enabled") === "on" }) });
          if (res.ok) saved = true;
          else problem = dt("It could not be saved. Try again in a moment.");
        }
      }
    } catch (error) {
      console.error(`[message-roles] saving for ${id}:`, error?.message);
      problem = dt("It could not be saved. Try again in a moment.");
    }
  }
  const [guildInfo, rulesRes, rolesRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => fetch(`${apiUrl}/rest/v1/message_roles?guild_id=eq.${id}&select=id,role_id,messages,mode,period_days,remove_below,enabled&order=messages.asc,id.asc`, { headers }),
    () => getGuildList(Astro2, id, botToken, "roles")
  ], 3);
  const fallbackInfo = Astro2.request.method === "POST" && !guildInfo ? { name: dt("Server"), icon: null } : null;
  if (!guildInfo && !fallbackInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const serverInfo = guildInfo ?? fallbackInfo;
  const ready = rulesRes.ok;
  const rules = ready ? (await rulesRes.json()).map((row) => ({ id: Number(row.id), roleId: String(row.role_id), messages: Number(row.messages), mode: row.mode === "period" ? "period" : "total", periodDays: Number(row.period_days) || 0, removeBelow: row.remove_below === true, enabled: row.enabled !== false })) : [];
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((role) => role.name !== "@everyone" && !role.managed).sort((a, b) => b.position - a.position).map((role) => ({ id: role.id, name: role.name, color: role.color ?? 0 }));
  const everyRole = allRoles.map((role) => ({ id: role.id, name: role.name }));
  return renderTemplate`${renderComponent($$result, "DashMessageRoles", $$DashMessageRoles, { "user": session, "guildId": id, "guildName": serverInfo.name, "guildIcon": serverInfo.icon ?? "/assets/mascot-icon.webp", "rules": rules, "roles": roles, "everyRole": everyRole, "ready": ready, "saved": saved, "problem": problem, "max": MAX_MESSAGE_RULES })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/message-roles.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/message-roles.astro";
const $$url = "/dash/guild/[id]/message-roles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MessageRoles,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
