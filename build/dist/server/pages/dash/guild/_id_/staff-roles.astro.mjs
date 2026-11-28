import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$SelectSource } from '../../../../chunks/SelectSource_Dp8aydFk.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                                */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
export { renderers } from '../../../../renderers.mjs';

const GROUP_PREFIX = "__petto_moderation_role__:";
const ROLE_GROUP_LEVEL = 50;
const STAFF_ACTIONS = [
  { id: "ban", commands: ["ban", "hardban", "tempban"], label: "Ban", hint: "Ban a member, for good or for a time." },
  { id: "kick", commands: ["kick"], label: "Kick", hint: "Kick a member out." },
  { id: "softban", commands: ["softban"], label: "Softban", hint: "Ban and unban at once, to clean their messages." },
  { id: "unban", commands: ["unban"], label: "Unban", hint: "Lift a ban." },
  { id: "mute", commands: ["mute", "tempmute", "timeout"], label: "Mute", hint: "Mute or timeout a member." },
  { id: "unmute", commands: ["unmute"], label: "Unmute", hint: "Lift a mute." },
  { id: "warn", commands: ["warn"], label: "Warn", hint: "Warn a member." },
  { id: "case", commands: ["case"], label: "Cases", hint: "Look at and edit cases." },
  { id: "note", commands: ["note"], label: "Notes", hint: "Write notes about a member." },
  { id: "role", commands: ["role"], label: "Roles", hint: "Give and take roles from one member." },
  { id: "channel", commands: ["channel"], label: "Channels", hint: "Manage a channel." },
  { id: "voice", commands: ["voice"], label: "Voice", hint: "Move, mute and disconnect members in voice." },
  { id: "nuke", commands: ["nuke"], label: "Nuke", hint: "Clone a channel to empty it." }
];
async function groupsOf({ apiUrl, headers, guildId }) {
  const res = await fetch(`${apiUrl}/rest/v1/permission_groups?guild_id=eq.${guildId}&select=id,name&order=id.asc`, { headers });
  const all = res.ok ? await res.json() : [];
  const mine = all.filter((group) => String(group.name).startsWith(GROUP_PREFIX));
  if (!mine.length) return [];
  const memRes = await fetch(`${apiUrl}/rest/v1/permission_group_members?group_id=in.(${mine.map((group) => group.id).join(",")})&select=group_id,subject_type,subject_id`, { headers });
  const members = memRes.ok ? await memRes.json() : [];
  return mine.map((group) => ({ id: group.id, name: group.name, members: members.filter((member) => member.group_id === group.id) }));
}
async function loadStaffRoles(context) {
  const groups = await groupsOf(context);
  const out = {};
  for (const action of STAFF_ACTIONS) {
    const roles = action.commands.map((command) => groups.find((group) => group.name === GROUP_PREFIX + command)).flatMap((group) => group ? group.members.filter((member) => member.subject_type === "role").map((member) => member.subject_id) : []);
    out[action.id] = [...new Set(roles)];
  }
  return out;
}
async function allowRole(context, actionId, roleId) {
  const action = STAFF_ACTIONS.find((entry) => entry.id === actionId);
  if (!action) return false;
  const { apiUrl, headers, guildId } = context;
  await fetch(`${apiUrl}/rest/v1/permission_groups?on_conflict=guild_id,name`, { method: "POST", headers: { ...headers, Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: guildId, name: "@everyone", level: 0, is_base: true }) }).catch(() => null);
  for (const command of action.commands) {
    const res = await fetch(`${apiUrl}/rest/v1/permission_groups?on_conflict=guild_id,name`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ guild_id: guildId, name: GROUP_PREFIX + command, level: ROLE_GROUP_LEVEL })
    });
    if (!res.ok) return false;
    const rows = await res.json().catch(() => []);
    const groupId = Array.isArray(rows) ? rows[0]?.id : rows?.id;
    if (!groupId) return false;
    const added = await fetch(`${apiUrl}/rest/v1/permission_group_members?on_conflict=group_id,subject_type,subject_id`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ group_id: groupId, subject_type: "role", subject_id: roleId })
    });
    if (!added.ok) return false;
  }
  return true;
}
async function denyRole(context, actionId, roleId) {
  const action = STAFF_ACTIONS.find((entry) => entry.id === actionId);
  if (!action) return false;
  const { apiUrl, headers } = context;
  const groups = await groupsOf(context);
  for (const command of action.commands) {
    const group = groups.find((entry) => entry.name === GROUP_PREFIX + command);
    if (!group) continue;
    const res = await fetch(`${apiUrl}/rest/v1/permission_group_members?group_id=eq.${group.id}&subject_type=eq.role&subject_id=eq.${encodeURIComponent(roleId)}`, { method: "DELETE", headers });
    if (!res.ok) return false;
    const left = group.members.filter((member) => !(member.subject_type === "role" && member.subject_id === roleId));
    if (left.length === 0) await fetch(`${apiUrl}/rest/v1/permission_groups?id=eq.${group.id}&guild_id=eq.${context.guildId}`, { method: "DELETE", headers });
  }
  return true;
}

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashStaffRoles = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashStaffRoles;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, staff, roles, everyRole, saved, problem } = Astro2.props;
  const roleOf = (id) => everyRole.find((role) => role.id === id);
  const hex = (color) => color > 0 ? `#${color.toString(16).padStart(6, "0")}` : "#99aab5";
  const used = STAFF_ACTIONS.filter((action) => (staff[action.id] ?? []).length > 0).length;
  const total = new Set(Object.values(staff).flat()).size;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "staff-roles", "pageTitle": "Staff roles", "data-astro-cid-ketdcmpc": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-ketdcmpc": true })} ${maybeRenderHead()}<div class="sx-page sr" data-astro-cid-ketdcmpc> <h1 data-astro-cid-ketdcmpc>${dt("Staff roles")}</h1> <p class="sx-lead" data-astro-cid-ketdcmpc>${dt('Let a role use a moderation action without having the permission of Discord for it: for example a Mod role that can ban without "Ban Members". Each role is only let in for the actions you choose here. Administrators and the owner can always use them.')}</p> ${saved && renderTemplate`<div class="sx-flash" data-astro-cid-ketdcmpc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-ketdcmpc": true })}${dt("Saved.")}</div>`} ${problem && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-ketdcmpc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-ketdcmpc": true })}${problem}</div>`} ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Actions with roles"), value: used, tone: "messages" },
    { label: dt("Roles let in"), value: total, tone: "joins" }
  ], "data-astro-cid-ketdcmpc": true })} <div class="sr-grid dgl-stagger" data-astro-cid-ketdcmpc> ${STAFF_ACTIONS.map((action) => {
    const chosen = staff[action.id] ?? [];
    return renderTemplate`<section class="sx-panel sr-card" data-astro-cid-ketdcmpc> <div class="sr-top" data-astro-cid-ketdcmpc><h2 data-astro-cid-ketdcmpc>${dt(action.label)}</h2>${chosen.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-ketdcmpc>${chosen.length}</span>`}</div> <p class="sx-hint" data-astro-cid-ketdcmpc>${dt(action.hint)}</p> <div class="sr-chips" data-astro-cid-ketdcmpc> ${chosen.length === 0 && renderTemplate`<span class="sr-none" data-astro-cid-ketdcmpc>${dt("Only whoever has the permission of Discord.")}</span>`} ${chosen.map((roleId) => renderTemplate`<form method="POST" class="sr-chip" data-no-dirty${addAttribute(`--c:${hex(roleOf(roleId)?.color ?? 0)}`, "style")} data-astro-cid-ketdcmpc> <input type="hidden" name="action" value="deny" data-astro-cid-ketdcmpc><input type="hidden" name="staff_action"${addAttribute(action.id, "value")} data-astro-cid-ketdcmpc><input type="hidden" name="role_id"${addAttribute(roleId, "value")} data-astro-cid-ketdcmpc> <i class="sr-dot" data-astro-cid-ketdcmpc></i><span data-astro-cid-ketdcmpc>${roleOf(roleId)?.name ?? dt("a role that is gone")}</span> <button type="submit" class="sr-x"${addAttribute(dt("Remove"), "aria-label")}${addAttribute(dt("Remove"), "title")} data-astro-cid-ketdcmpc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-bold", "width": "11", "height": "11", "data-astro-cid-ketdcmpc": true })}</button> </form>`)} </div> <form method="POST" class="sr-add" data-no-dirty data-astro-cid-ketdcmpc> <input type="hidden" name="action" value="allow" data-astro-cid-ketdcmpc><input type="hidden" name="staff_action"${addAttribute(action.id, "value")} data-astro-cid-ketdcmpc> <select name="role_id" required data-give-role data-fill="sr-roles"${addAttribute(dt("Role"), "aria-label")} data-astro-cid-ketdcmpc><option value="" disabled selected data-astro-cid-ketdcmpc>${dt("Add a role")}</option></select> <button type="submit" class="btn btn-ghost btn-sm"${addAttribute(dt("Add"), "aria-label")}${addAttribute(dt("Add"), "title")} data-astro-cid-ketdcmpc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-ketdcmpc": true })}</button> </form> </section>`;
  })} </div> <p class="sx-hint sr-foot" data-astro-cid-ketdcmpc>${dt("The same can be done with the command: /moderation allow. It is also here so you can see everything at once. Bulk actions (mass ban, mass kick...) stay for administrators.")}</p> </div> ${renderComponent($$result2, "SelectSource", $$SelectSource, { "name": "sr-roles", "items": roles.map((role) => ({ id: role.id, name: role.name })), "data-astro-cid-ketdcmpc": true })} ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-ketdcmpc": true })} ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashStaffRoles.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$StaffRoles = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$StaffRoles;
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
  const context = { apiUrl, headers, guildId: id };
  let saved = false;
  let problem = null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const actionId = String(form.get("staff_action") ?? "");
    const roleId = String(form.get("role_id") ?? "").trim();
    try {
      if (!/^\d{15,25}$/.test(roleId)) problem = dt("Pick a role.");
      else if (!STAFF_ACTIONS.some((entry) => entry.id === actionId)) problem = dt("That action is not known.");
      else if (action === "allow" || action === "deny") {
        const ok = action === "allow" ? await allowRole(context, actionId, roleId) : await denyRole(context, actionId, roleId);
        if (ok) {
          saved = true;
          await fetch(`${apiUrl}/rest/v1/permission_audit_log`, { method: "POST", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ guild_id: id, actor_id: session.userId, actor_name: session.username, action: action === "allow" ? "add_member" : "remove_member", summary: `${action === "allow" ? "Allowed" : "Removed"} role ${roleId} ${action === "allow" ? "to use" : "from"} the moderation action "${actionId}"` }) }).catch(() => null);
        } else problem = dt("It could not be saved. Try again in a moment.");
      }
    } catch (error) {
      console.error(`[staff-roles] saving for ${id}:`, error?.message);
      problem = dt("It could not be saved. Try again in a moment.");
    }
  }
  const [guildInfo, rolesRes] = await runBatched([() => getGuildInfo(id, botToken), () => getGuildList(Astro2, id, botToken, "roles")], 2);
  const fallbackInfo = Astro2.request.method === "POST" && !guildInfo ? { name: dt("Server"), icon: null } : null;
  if (!guildInfo && !fallbackInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const serverInfo = guildInfo ?? fallbackInfo;
  const staff = await loadStaffRoles(context).catch(() => ({}));
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((role) => role.name !== "@everyone" && !role.managed).sort((a, b) => b.position - a.position).map((role) => ({ id: role.id, name: role.name, color: role.color ?? 0 }));
  const everyRole = allRoles.map((role) => ({ id: role.id, name: role.name, color: role.color ?? 0 }));
  return renderTemplate`${renderComponent($$result, "DashStaffRoles", $$DashStaffRoles, { "user": session, "guildId": id, "guildName": serverInfo.name, "guildIcon": serverInfo.icon ?? "/assets/mascot-icon.webp", "staff": staff, "roles": roles, "everyRole": everyRole, "saved": saved, "problem": problem })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/staff-roles.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/staff-roles.astro";
const $$url = "/dash/guild/[id]/staff-roles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$StaffRoles,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
