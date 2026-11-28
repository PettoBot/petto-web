import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { A as ACCESS_SECTIONS, a as getGuildSession, l as loadRules, f as forgetRules } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
/* empty css                                           */
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashAccess = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashAccess;
  const dt = makeT(getDashLang(Astro2));
  const { user, guildId, guildName, guildIcon, roles, rules, saved, problems } = Astro2.props;
  const roleName = (id) => roles.find((role) => role.id === id)?.name ?? id;
  const fullIds = rules.filter((rule) => rule.sections.includes("*")).map((rule) => rule.role_id);
  const bySection = rules.filter((rule) => !rule.sections.includes("*"));
  const sectionLabel = (id) => dt(ACCESS_SECTIONS.find((section) => section.id === id)?.label ?? id);
  return renderTemplate(_a || (_a = __template(["", ` <script>
  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-ac-all]'); if (!button) return;
    var on = button.getAttribute('data-ac-all') === '1';
    button.closest('.sx-field').querySelectorAll('[data-ac-parts] input[type="checkbox"]').forEach(function (box) { if (box.checked !== on) { box.checked = on; box.dispatchEvent(new Event('change', { bubbles: true })); } });
  });
<\/script> `])), renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "access", "pageTitle": "Dashboard access", "data-astro-cid-qln3q5je": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-qln3q5je": true })} ${maybeRenderHead()}<div class="sx-page" data-astro-cid-qln3q5je> <h1 data-astro-cid-qln3q5je>${dt("Dashboard access")}</h1> ${saved && renderTemplate`<div class="sx-flash" data-astro-cid-qln3q5je>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-qln3q5je": true })}${dt("Saved.")}</div>`} ${problems.map((problem) => renderTemplate`<div class="sx-flash sx-flash-bad" data-astro-cid-qln3q5je>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-qln3q5je": true })}${problem}</div>`)} ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Roles with full access"), value: fullIds.length, tone: "joins" },
    { label: dt("Rules by part"), value: bySection.length, tone: "voice" },
    { label: dt("Parts you can share"), value: ACCESS_SECTIONS.length, tone: "invites" }
  ], "data-astro-cid-qln3q5je": true })} <div class="sx-stack" data-astro-cid-qln3q5je> <section class="sx-panel ac-block" data-astro-cid-qln3q5je> <div class="sx-panel-head" data-astro-cid-qln3q5je> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-qln3q5je>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-gear-fill", "width": "17", "height": "17", "data-astro-cid-qln3q5je": true })}</span> <h2 data-astro-cid-qln3q5je>${dt("Roles with full access")}</h2> </div> <p class="sx-lead" data-astro-cid-qln3q5je>${dt("The members of these roles can open and change every part of the dashboard, except this page.")}</p> <form method="POST" class="ac-form" data-astro-cid-qln3q5je> <input type="hidden" name="action" value="save_full" data-astro-cid-qln3q5je> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "full_role_ids", "options": roles, "selected": fullIds, "placeholder": dt("Search roles..."), "data-astro-cid-qln3q5je": true })} <div class="sx-foot" data-astro-cid-qln3q5je><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-qln3q5je>${dt("Save changes")}</button></div> </form> </section> <section class="sx-panel ac-block" data-astro-cid-qln3q5je> <div class="sx-panel-head" data-astro-cid-qln3q5je> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-qln3q5je>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "17", "height": "17", "data-astro-cid-qln3q5je": true })}</span> <h2 data-astro-cid-qln3q5je>${dt("Access by part")}</h2> ${bySection.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-qln3q5je>${bySection.length}</span>`} </div> <p class="sx-lead" data-astro-cid-qln3q5je>${dt('Choose a role and the parts it opens. Without "can change" the members can look at them but not save anything.')}</p> ${bySection.length === 0 && renderTemplate`<p class="sx-empty" data-astro-cid-qln3q5je>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lock-key-fill", "width": "16", "height": "16", "data-astro-cid-qln3q5je": true })}${dt("There are no rules yet. Add one to let a role into some parts.")}</p>`} ${bySection.length > 0 && renderTemplate`<div class="sx-list dgl-stagger" data-astro-cid-qln3q5je> ${bySection.map((rule) => renderTemplate`<div class="sx-row ac-rule" data-astro-cid-qln3q5je> <div class="ac-rule-main" data-astro-cid-qln3q5je> <div class="ac-rule-top" data-astro-cid-qln3q5je> <strong data-astro-cid-qln3q5je>${roleName(rule.role_id)}</strong> <span${addAttribute(["sx-tag", { "sx-tag-accent": rule.can_edit }], "class:list")} data-astro-cid-qln3q5je>${rule.can_edit ? dt("Can change") : dt("View only")}</span> </div> <div class="ac-chips" data-astro-cid-qln3q5je>${rule.sections.map((id) => renderTemplate`<span class="ac-chip" data-astro-cid-qln3q5je>${sectionLabel(id)}</span>`)}</div> </div> <form method="POST" class="ac-del" data-no-dirty data-astro-cid-qln3q5je><input type="hidden" name="action" value="delete_rule" data-astro-cid-qln3q5je><input type="hidden" name="role_id"${addAttribute(rule.role_id, "value")} data-astro-cid-qln3q5je><button type="submit" class="sx-iconbtn"${addAttribute(dt("Remove"), "aria-label")}${addAttribute(dt("Remove"), "title")} data-astro-cid-qln3q5je>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-qln3q5je": true })}</button></form> </div>`)} </div>`} <form method="POST" class="sx-sub ac-add" data-no-dirty data-astro-cid-qln3q5je> <input type="hidden" name="action" value="add_rule" data-astro-cid-qln3q5je> <h3 data-astro-cid-qln3q5je>${dt("Add or change a rule")}</h3> <div class="sx-field" data-astro-cid-qln3q5je><label for="ac-role" data-astro-cid-qln3q5je>${dt("Role")}</label> <select name="role_id" id="ac-role" required data-astro-cid-qln3q5je> <option value="" disabled selected data-astro-cid-qln3q5je>${dt("Choose a role")}</option> ${roles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")} data-astro-cid-qln3q5je>${role.name}</option>`)} </select> </div> <div class="sx-field" data-astro-cid-qln3q5je> <div class="ac-parts-head" data-astro-cid-qln3q5je><span class="sx-label" data-astro-cid-qln3q5je>${dt("Parts")}</span><span data-astro-cid-qln3q5je><button type="button" class="sx-linkbtn" data-ac-all="1" data-astro-cid-qln3q5je>${dt("Select all")}</button><button type="button" class="sx-linkbtn" data-ac-all="0" data-astro-cid-qln3q5je>${dt("Clear")}</button></span></div> <div class="sx-chips" data-ac-parts data-astro-cid-qln3q5je> ${ACCESS_SECTIONS.map((section) => renderTemplate`<label class="sx-chip" data-astro-cid-qln3q5je><input type="checkbox" name="sections"${addAttribute(section.id, "value")} data-astro-cid-qln3q5je><span data-astro-cid-qln3q5je>${dt(section.label)}</span></label>`)} </div> </div> <label class="sx-switch" data-astro-cid-qln3q5je><input type="checkbox" name="can_edit" data-astro-cid-qln3q5je><span class="sx-switch-text" data-astro-cid-qln3q5je><b data-astro-cid-qln3q5je>${dt("Can change (not just look)")}</b><em data-astro-cid-qln3q5je>${dt("Without it the members can only look at these parts.")}</em></span><i class="sx-toggle" data-astro-cid-qln3q5je></i></label> <div class="sx-foot" data-astro-cid-qln3q5je><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-qln3q5je>${dt("Save rule")}</button></div> </form> </section> </div> </div> ` }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashAccess.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Access = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Access;
  const MAX_RULES = 50;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const dt = makeT(getDashLang(Astro2));
  const problems = [];
  let saved = false;
  const [guildInfo, rolesRes] = await Promise.all([getGuildInfo(id, botToken), getGuildList(Astro2, id, botToken, "roles")]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((role) => String(role.id) !== id).sort((a, b) => Number(b.position ?? 0) - Number(a.position ?? 0)).map((role) => ({ id: String(role.id), name: String(role.name) }));
  const known = new Set(roles.map((role) => role.id));
  const sectionIds = new Set(ACCESS_SECTIONS.map((section) => section.id));
  const upsert = (rows) => fetch(`${apiUrl}/rest/v1/dash_access?on_conflict=guild_id,role_id`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows)
  });
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const current = await loadRules(Astro2, id);
    let ok = true;
    if (action === "save_full") {
      const wanted = [...new Set(form.getAll("full_role_ids").map(String))].filter((role) => known.has(role));
      const currentFull = current.filter((rule) => rule.sections.includes("*")).map((rule) => rule.role_id);
      const removed = currentFull.filter((role) => !wanted.includes(role));
      if (current.length - removed.length + wanted.filter((role) => !current.some((rule) => rule.role_id === role)).length > MAX_RULES) {
        problems.push(dt("There can be at most {a} rules.", { a: MAX_RULES }));
      } else {
        if (removed.length) {
          const del = await fetch(`${apiUrl}/rest/v1/dash_access?guild_id=eq.${id}&role_id=in.(${removed.map(encodeURIComponent).join(",")})`, { method: "DELETE", headers });
          ok = ok && del.ok;
        }
        if (wanted.length) {
          const put = await upsert(wanted.map((role) => ({ guild_id: id, role_id: role, sections: ["*"], can_edit: true })));
          ok = ok && put.ok;
        }
      }
    } else if (action === "add_rule") {
      const role = String(form.get("role_id") ?? "");
      const sections = [...new Set(form.getAll("sections").map(String))].filter((section) => sectionIds.has(section));
      if (!known.has(role)) problems.push(dt("Pick a role from the list."));
      else if (!sections.length) problems.push(dt("Pick at least one part."));
      else if (!current.some((rule) => rule.role_id === role) && current.length >= MAX_RULES) problems.push(dt("There can be at most {a} rules.", { a: MAX_RULES }));
      else ok = (await upsert([{ guild_id: id, role_id: role, sections, can_edit: form.get("can_edit") === "on" }])).ok;
    } else if (action === "delete_rule") {
      const role = String(form.get("role_id") ?? "");
      if (/^\d{15,25}$/.test(role)) ok = (await fetch(`${apiUrl}/rest/v1/dash_access?guild_id=eq.${id}&role_id=eq.${role}`, { method: "DELETE", headers })).ok;
    }
    forgetRules(id);
    if (!ok) problems.push(dt("Something went wrong, try again."));
    saved = problems.length === 0;
  }
  const rules = await loadRules(Astro2, id);
  return renderTemplate`${renderComponent($$result, "DashAccess", $$DashAccess, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "roles": roles, "rules": rules, "saved": saved, "problems": problems })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/access.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/access.astro";
const $$url = "/dash/guild/[id]/access";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Access,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
