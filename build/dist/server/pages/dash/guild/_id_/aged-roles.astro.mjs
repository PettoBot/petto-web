import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$SelectSource } from '../../../../chunks/SelectSource_Dp8aydFk.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                               */
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
const $$DashAgedRoles = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashAgedRoles;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, rules, roles, everyRole, ready, saved, problem, max } = Astro2.props;
  const name = (roleId) => roleId ? everyRole.find((role) => role.id === roleId)?.name ?? dt("a role that is gone") : "";
  const targets = [["humans", dt("Humans only")], ["all", dt("Everyone")], ["bots", dt("Bots only")]];
  const targetLabel = (target) => targets.find(([value]) => value === target)?.[1] ?? dt("Humans only");
  const on = rules.filter((rule) => rule.enabled).length;
  const docsUrl = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/moderation/aged-roles`;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "aged-roles", "pageTitle": "Aged roles", "data-astro-cid-lhoczb2q": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<div class="sx-page ar" data-astro-cid-lhoczb2q> <div class="ar-head" data-astro-cid-lhoczb2q> <h1 data-astro-cid-lhoczb2q>', '</h1> <a class="btn btn-sm"', ' target="_blank" rel="noopener" data-astro-cid-lhoczb2q>', "", '</a> </div> <p class="sx-lead" data-astro-cid-lhoczb2q>', "</p> ", " ", " ", " ", ' <div class="ar-cols" data-astro-cid-lhoczb2q> <section class="sx-panel ar-box" data-astro-cid-lhoczb2q> <div class="sx-panel-head" data-astro-cid-lhoczb2q><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-lhoczb2q>', "</span><h2 data-astro-cid-lhoczb2q>", "</h2>", "</div> ", " ", ' </section> <form method="POST" class="sx-panel ar-box" data-no-dirty data-astro-cid-lhoczb2q> <input type="hidden" name="action" value="add" data-astro-cid-lhoczb2q> <div class="sx-panel-head" data-astro-cid-lhoczb2q><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-lhoczb2q>', "</span><h2 data-astro-cid-lhoczb2q>", '</h2></div> <div class="sx-field" data-astro-cid-lhoczb2q><label for="ar-role" data-astro-cid-lhoczb2q>', '</label> <select id="ar-role" name="role_id" required data-give-role data-fill="ar-roles"', ' data-astro-cid-lhoczb2q><option value="" disabled selected data-astro-cid-lhoczb2q>', '</option></select> </div> <div class="sx-field" data-astro-cid-lhoczb2q><label for="ar-days" data-astro-cid-lhoczb2q>', '</label> <input id="ar-days" type="number" name="days" min="1" max="3650" value="7" required', ' data-astro-cid-lhoczb2q> </div> <div class="sx-field" data-astro-cid-lhoczb2q><label for="ar-remove" data-astro-cid-lhoczb2q>', '</label> <select id="ar-remove" name="remove_role_id" data-give-role data-fill="ar-roles"', ' data-astro-cid-lhoczb2q><option value="" data-astro-cid-lhoczb2q>', '</option></select> </div> <div class="sx-field" data-astro-cid-lhoczb2q><span class="sx-label" id="ar-target-l" data-astro-cid-lhoczb2q>', '</span> <div class="dfx-chips" role="radiogroup" aria-labelledby="ar-target-l" data-astro-cid-lhoczb2q>', '</div> </div> <p class="sx-hint" data-astro-cid-lhoczb2q>', '</p> <div class="sx-foot" data-astro-cid-lhoczb2q><button type="submit" class="btn btn-accent btn-sm"', " data-astro-cid-lhoczb2q>", "", "</button></div> </form> </div> </div> ", " <script>\n    // The switch of a rule saves at once (it is a small form of its own).\n    document.addEventListener('change', function (event) {\n      var box = event.target && event.target.closest ? event.target.closest('input[data-auto-submit]') : null;\n      if (box && box.form) { if (box.form.requestSubmit) box.form.requestSubmit(); else box.form.submit(); }\n    });\n  <\/script> ", " "])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-lhoczb2q": true }), maybeRenderHead(), dt("Aged roles"), addAttribute(docsUrl, "href"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13", "data-astro-cid-lhoczb2q": true }), dt("Read the docs"), dt("Give a role after a member has been in the server for some days, and take another one away if you want. Petto looks about every 30 minutes, and the members who were already here get it too."), saved && renderTemplate`<div class="sx-flash" data-astro-cid-lhoczb2q>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-lhoczb2q": true })}${dt("Saved.")}</div>`, problem && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-lhoczb2q>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-lhoczb2q": true })}${problem}</div>`, !ready && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-lhoczb2q>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-lhoczb2q": true })}${dt("Aged roles are not available yet. Petto is being updated: try again in a few minutes.")}</div>`, renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Rules"), value: rules.length, tone: "messages" },
    { label: dt("On"), value: on, tone: "joins" }
  ], "data-astro-cid-lhoczb2q": true }), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hourglass-medium-fill", "width": "17", "height": "17", "data-astro-cid-lhoczb2q": true }), dt("Rules"), rules.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-lhoczb2q>${rules.length}/${max}</span>`, rules.length === 0 && renderTemplate`<p class="ar-empty" data-astro-cid-lhoczb2q>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hourglass-medium-fill", "width": "22", "height": "22", "data-astro-cid-lhoczb2q": true })}${dt("No rules yet. Add the first one.")}</p>`, rules.length > 0 && renderTemplate`<div class="sx-list ar-list dgl-stagger" data-astro-cid-lhoczb2q> ${rules.map((rule) => renderTemplate`<div${addAttribute(["sx-row", "ar-row", { "ar-off": !rule.enabled }], "class:list")} data-astro-cid-lhoczb2q> <span class="ar-days" data-astro-cid-lhoczb2q><b data-astro-cid-lhoczb2q>${rule.days}</b><em data-astro-cid-lhoczb2q>${dt("days")}</em></span> <span class="ar-what" data-astro-cid-lhoczb2q> <span class="ar-line" data-astro-cid-lhoczb2q>${dt("Gives")} <b data-astro-cid-lhoczb2q>${name(rule.roleId)}</b></span> ${rule.removeRoleId && renderTemplate`<span class="ar-line ar-sub" data-astro-cid-lhoczb2q>${dt("Takes away")} <b data-astro-cid-lhoczb2q>${name(rule.removeRoleId)}</b></span>`} <span class="sx-tag ar-target" data-astro-cid-lhoczb2q>${targetLabel(rule.target)}</span> </span> <form method="POST" data-no-dirty class="ar-act" data-astro-cid-lhoczb2q> <input type="hidden" name="action" value="toggle" data-astro-cid-lhoczb2q><input type="hidden" name="rule_id"${addAttribute(rule.id, "value")} data-astro-cid-lhoczb2q> <label class="sx-switch ar-switch"${addAttribute(rule.enabled ? dt("On") : dt("Off"), "title")} data-astro-cid-lhoczb2q><input type="checkbox" name="enabled" role="switch"${addAttribute(rule.enabled, "checked")}${addAttribute(dt("On"), "aria-label")} data-auto-submit data-astro-cid-lhoczb2q><span class="sx-toggle" data-astro-cid-lhoczb2q></span></label> </form> <form method="POST" data-no-dirty class="ar-act" data-astro-cid-lhoczb2q> <input type="hidden" name="action" value="remove" data-astro-cid-lhoczb2q><input type="hidden" name="rule_id"${addAttribute(rule.id, "value")} data-astro-cid-lhoczb2q> <button type="submit" class="sx-iconbtn"${addAttribute(dt("Remove"), "aria-label")}${addAttribute(dt("Remove"), "title")} data-astro-cid-lhoczb2q>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-lhoczb2q": true })}</button> </form> </div>`)} </div>`, renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "17", "height": "17", "data-astro-cid-lhoczb2q": true }), dt("Add a rule"), dt("Role to give"), addAttribute(!ready, "disabled"), dt("Role"), dt("After how many days in the server"), addAttribute(!ready, "disabled"), dt("Role to take away (optional)"), addAttribute(!ready, "disabled"), dt("None"), dt("Who gets it"), targets.map(([value, label]) => renderTemplate`<label class="dfx-chip" data-astro-cid-lhoczb2q><input type="radio" name="target"${addAttribute(value, "value")}${addAttribute(value === "humans", "checked")} data-astro-cid-lhoczb2q>${label}</label>`), dt("Petto's role has to be above the roles it gives or takes away."), addAttribute(!ready || rules.length >= max, "disabled"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-lhoczb2q": true }), dt("Add"), renderComponent($$result2, "SelectSource", $$SelectSource, { "name": "ar-roles", "items": roles.map((role) => ({ id: role.id, name: role.name })), "data-astro-cid-lhoczb2q": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-lhoczb2q": true })) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashAgedRoles.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$AgedRoles = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AgedRoles;
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
  const MAX_RULES = 25;
  const SNOWFLAKE = /^\d{15,25}$/;
  let saved = false;
  let problem = null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    try {
      if (action === "add") {
        const roleId = String(form.get("role_id") ?? "").trim();
        const removeRaw = String(form.get("remove_role_id") ?? "").trim();
        const days = Math.floor(Number(form.get("days")));
        const target = ["humans", "all", "bots"].includes(String(form.get("target"))) ? String(form.get("target")) : "humans";
        if (!SNOWFLAKE.test(roleId)) problem = dt("Pick the role to give.");
        else if (!Number.isFinite(days) || days < 1 || days > 3650) problem = dt("The days must be a number from 1 to 3650.");
        else if (removeRaw && (!SNOWFLAKE.test(removeRaw) || removeRaw === roleId)) problem = dt("The role to take away has to be a different role.");
        else {
          const count = await fetch(`${apiUrl}/rest/v1/aged_roles?guild_id=eq.${id}&select=id`, { headers });
          const have = count.ok ? (await count.json()).length : 0;
          if (have >= MAX_RULES) problem = dt("There is no room: a server can have {n} rules.", { n: MAX_RULES });
          else {
            const res = await fetch(`${apiUrl}/rest/v1/aged_roles?on_conflict=guild_id,role_id,days`, {
              method: "POST",
              headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
              body: JSON.stringify({ guild_id: id, role_id: roleId, days, remove_role_id: removeRaw || null, target, enabled: true })
            });
            if (res.ok) saved = true;
            else problem = dt("It could not be saved. Try again in a moment.");
          }
        }
      } else if (action === "remove" || action === "toggle") {
        const ruleId = Math.floor(Number(form.get("rule_id")));
        if (Number.isFinite(ruleId) && ruleId > 0) {
          const res = action === "remove" ? await fetch(`${apiUrl}/rest/v1/aged_roles?guild_id=eq.${id}&id=eq.${ruleId}`, { method: "DELETE", headers }) : await fetch(`${apiUrl}/rest/v1/aged_roles?guild_id=eq.${id}&id=eq.${ruleId}`, { method: "PATCH", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ enabled: form.get("enabled") === "on" }) });
          if (res.ok) saved = true;
          else problem = dt("It could not be saved. Try again in a moment.");
        }
      }
    } catch (error) {
      console.error(`[aged-roles] saving for ${id}:`, error?.message);
      problem = dt("It could not be saved. Try again in a moment.");
    }
  }
  const [guildInfo, rulesRes, rolesRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => fetch(`${apiUrl}/rest/v1/aged_roles?guild_id=eq.${id}&select=id,role_id,days,remove_role_id,target,enabled&order=days.asc,id.asc`, { headers }),
    () => getGuildList(Astro2, id, botToken, "roles")
  ], 3);
  const fallbackInfo = Astro2.request.method === "POST" && !guildInfo ? { name: dt("Server"), icon: null } : null;
  if (!guildInfo && !fallbackInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const serverInfo = guildInfo ?? fallbackInfo;
  const ready = rulesRes.ok;
  const rules = ready ? (await rulesRes.json()).map((row) => ({ id: Number(row.id), roleId: String(row.role_id), days: Number(row.days), removeRoleId: row.remove_role_id ? String(row.remove_role_id) : null, target: String(row.target), enabled: row.enabled !== false })) : [];
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((role) => role.name !== "@everyone" && !role.managed).sort((a, b) => b.position - a.position).map((role) => ({ id: role.id, name: role.name, color: role.color ?? 0 }));
  const everyRole = allRoles.map((role) => ({ id: role.id, name: role.name }));
  return renderTemplate`${renderComponent($$result, "DashAgedRoles", $$DashAgedRoles, { "user": session, "guildId": id, "guildName": serverInfo.name, "guildIcon": serverInfo.icon ?? "/assets/mascot-icon.webp", "rules": rules, "roles": roles, "everyRole": everyRole, "ready": ready, "saved": saved, "problem": problem, "max": MAX_RULES })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/aged-roles.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/aged-roles.astro";
const $$url = "/dash/guild/[id]/aged-roles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AgedRoles,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
