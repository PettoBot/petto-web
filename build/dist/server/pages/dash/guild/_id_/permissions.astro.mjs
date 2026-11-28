import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$SkeletonBlocks } from '../../../../chunks/SkeletonBlocks_COw0_LxU.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { P as PERMISSION_NAMES, a as accessCommands } from '../../../../chunks/commandAccess_BkOHtTxp.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                                */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashPermissions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashPermissions;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, roles, everyonePermissions, groups, commands } = Astro2.props;
  const keys = [
    "How Petto decides",
    "Not disabled",
    "!disablecommand turns a command off in the server or in some channels. Nobody skips it.",
    "Discord permission",
    "Commands that change the server ask for the Discord permission of the action, like Ban Members.",
    "Petto level",
    "A command can need a level from 0 to 100. Members get the level of their groups; everyone has the @everyone level.",
    "Role restriction",
    "!restrictcommand lets only some roles use a command.",
    "The owner and Administrators skip steps 2 to 4.",
    "Level groups",
    "Each group gives its level to its roles and members. The highest one counts.",
    "Level",
    "Less",
    "More",
    "No other groups yet",
    "Create one below, like Moderators, then add the roles or members that should have its level.",
    "Delete group",
    "Delete this group?",
    "Group deleted.",
    "Everybody in the server has this level.",
    "No roles or members yet.",
    "Member",
    "Remove",
    "Add a role",
    "+ Add a role",
    "A member by ID\u2026",
    "The ID of the member",
    "New group, like Moderators",
    "Create group",
    "Group created.",
    "Saved.",
    "It could not be saved, try again.",
    "Who can use what",
    "Pick a role to see, command by command, whether its members can use it and why.",
    "Preview a role",
    "No preview",
    "commands",
    "Administrator",
    "Level {a}",
    "Commands",
    "{a} shown",
    "Search a command or alias",
    "Filter",
    "All commands",
    "With a level",
    "Restricted to roles",
    "Disabled",
    "Open to everyone",
    "The role can use",
    "The role cannot use",
    "All",
    "No command matches.",
    "Off in {a} channels",
    "0 \xB7 anyone",
    "Delete",
    "Add",
    "Disabled in the server",
    "Yes, except in {a} channels",
    "Administrator: always",
    "Needs {a} in Discord",
    "Needs level {a} (has {b})",
    "Only for {a}",
    "Can use it"
  ];
  const text = Object.fromEntries(keys.map((k) => [k, dt(k)]));
  void [dt("Delete"), dt("Add")];
  void [dt("How Petto decides"), dt("Not disabled"), dt("!disablecommand turns a command off in the server or in some channels. Nobody skips it."), dt("Discord permission"), dt("Commands that change the server ask for the Discord permission of the action, like Ban Members."), dt("Petto level"), dt("A command can need a level from 0 to 100. Members get the level of their groups; everyone has the @everyone level."), dt("Role restriction"), dt("!restrictcommand lets only some roles use a command."), dt("The owner and Administrators skip steps 2 to 4."), dt("Level groups"), dt("Each group gives its level to its roles and members. The highest one counts."), dt("Level"), dt("Less"), dt("More"), dt("No other groups yet"), dt("Create one below, like Moderators, then add the roles or members that should have its level."), dt("Delete group"), dt("Delete this group?"), dt("Group deleted."), dt("Everybody in the server has this level."), dt("No roles or members yet."), dt("Member"), dt("Remove"), dt("Add a role"), dt("+ Add a role"), dt("A member by ID\u2026"), dt("The ID of the member"), dt("New group, like Moderators"), dt("Create group"), dt("Group created."), dt("Saved."), dt("It could not be saved, try again."), dt("Who can use what"), dt("Pick a role to see, command by command, whether its members can use it and why."), dt("Preview a role"), dt("No preview"), dt("commands"), dt("Administrator"), dt("Level {a}"), dt("Commands"), dt("{a} shown"), dt("Search a command or alias"), dt("Filter"), dt("All commands"), dt("With a level"), dt("Restricted to roles"), dt("Disabled"), dt("Open to everyone"), dt("The role can use"), dt("The role cannot use"), dt("All"), dt("No command matches."), dt("Off in {a} channels"), dt("0 \xB7 anyone"), dt("Disabled in the server"), dt("Yes, except in {a} channels"), dt("Administrator: always"), dt("Needs {a} in Discord"), dt("Needs level {a} (has {b})"), dt("Only for {a}"), dt("Can use it")];
  const permissionText = Object.fromEntries(PERMISSION_NAMES.map(([, name]) => [name, dt(name)]));
  void [dt("Administrator"), dt("Manage Server"), dt("Manage Roles"), dt("Manage Channels"), dt("Ban Members"), dt("Kick Members"), dt("Timeout Members"), dt("Manage Messages"), dt("Manage Nicknames"), dt("Manage Webhooks"), dt("Manage Expressions"), dt("Manage Events"), dt("Manage Threads"), dt("View Audit Log"), dt("Mute Members"), dt("Move Members"), dt("Deafen Members"), dt("Mention Everyone"), dt("Create Invite")];
  const restricted = commands.filter((c) => c.restrictRoles.length).length;
  const disabled = commands.filter((c) => c.disabledServer || c.disabledChannels.length).length;
  const leveled = commands.filter((c) => c.level > 0).length;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "permissions", "pageTitle": dt("Permissions"), "data-astro-cid-pznsidi6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 data-astro-cid-pznsidi6>${dt("Permissions")}</h1> <div class="pg-wrap" data-astro-cid-pznsidi6> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Level groups"), value: groups.length, tone: "voice" },
    { label: dt("Commands with a level"), value: leveled, tone: "invites" },
    { label: dt("Restricted to roles"), value: restricted, tone: "joins" },
    { label: dt("Disabled commands"), value: disabled, tone: "leaves" }
  ], "data-astro-cid-pznsidi6": true })} </div> <div class="pg-prefix-card" data-astro-cid-pznsidi6> <div class="pg-prefix-copy" data-astro-cid-pznsidi6> <span class="pg-prefix-icon" data-astro-cid-pznsidi6>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "15", "height": "15", "data-astro-cid-pznsidi6": true })}</span> <div data-astro-cid-pznsidi6><strong data-astro-cid-pznsidi6>${dt("Also from Discord")}</strong><span data-astro-cid-pznsidi6>${dt("Levels with !permission, role restrictions with !restrictcommand and disabled commands with !disablecommand (or Disabled Commands in Automation).")}</span></div> </div> <div class="pg-prefix-examples" data-astro-cid-pznsidi6><code data-astro-cid-pznsidi6>!permission mylevel</code><code data-astro-cid-pznsidi6>!rc list</code><code data-astro-cid-pznsidi6>!disablecommand list</code></div> </div> ${renderComponent($$result2, "PermissionsApp", null, { "client:only": "react", "guildId": guildId, "roles": roles, "everyonePermissions": everyonePermissions, "initialGroups": groups, "commands": commands, "text": text, "permissionText": permissionText, "canEdit": true, "client:component-hydration": "only", "data-astro-cid-pznsidi6": true, "client:component-path": "/home/runner/work/petto-web/petto-web/src/react/permissions/PermissionsApp", "client:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`${renderComponent($$result3, "SkeletonBlocks", $$SkeletonBlocks, { "slot": "fallback", "variant": "page", "data-astro-cid-pznsidi6": true })}` })} ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPermissions.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Permissions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Permissions;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  const [guildInfo, rolesRes, groupsRes, levelsRes, restrictRes, disabledRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => getGuildList(Astro2, id, botToken, "roles"),
    () => fetch(`${apiUrl}/rest/v1/permission_groups?guild_id=eq.${id}&select=*&order=id.asc`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/command_permission_levels?guild_id=eq.${id}&select=command_name,required_level`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/command_restrictions?guild_id=eq.${id}&select=command,role_id`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/disabled_commands?guild_id=eq.${id}&select=command,channel_id`, { headers: apiHeaders })
  ], 6);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ADMINISTRATOR = 1n << 3n;
  const MANAGE_GUILD = 1n << 5n;
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const everyonePermissions = String(allRoles.find((r) => r.name === "@everyone" || r.id === id)?.permissions ?? "0");
  const roles = allRoles.filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => {
    const bits = BigInt(r.permissions ?? "0");
    return {
      id: r.id,
      name: r.name,
      isAdmin: (bits & ADMINISTRATOR) === ADMINISTRATOR,
      isManageGuild: (bits & MANAGE_GUILD) === MANAGE_GUILD,
      color: Number(r.color) || 0,
      permissions: String(r.permissions ?? "0")
    };
  });
  let groups = groupsRes.ok ? await groupsRes.json() : [];
  let baseGroup = groups.find((g) => g.is_base);
  if (!baseGroup) {
    const createRes = await fetch(`${apiUrl}/rest/v1/permission_groups?on_conflict=guild_id,name`, {
      method: "POST",
      headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ guild_id: id, name: "@everyone", level: 0, is_base: true })
    });
    if (createRes.ok) {
      const created = await createRes.json();
      baseGroup = created[0];
      groups = [...groups, baseGroup];
    }
  }
  const groupIds = groups.map((g) => g.id);
  let members = [];
  if (groupIds.length) {
    const memRes = await fetch(`${apiUrl}/rest/v1/permission_group_members?group_id=in.(${groupIds.join(",")})&select=*`, { headers: apiHeaders });
    members = memRes.ok ? await memRes.json() : [];
  }
  const groupsWithMembers = groups.map((g) => ({
    id: g.id,
    name: g.name,
    level: g.level,
    isBase: g.is_base,
    members: members.filter((m) => m.group_id === g.id).map((m) => ({ subjectType: m.subject_type, subjectId: m.subject_id }))
  }));
  const levelRows = levelsRes.ok ? await levelsRes.json() : [];
  const json = async (res) => res.ok ? res.json().catch(() => []) : [];
  const commands = accessCommands(getDashLang(Astro2), { levels: levelRows, restrictions: await json(restrictRes), disabled: await json(disabledRes) });
  return renderTemplate`${renderComponent($$result, "DashPermissions", $$DashPermissions, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "roles": roles, "groups": groupsWithMembers, "everyonePermissions": everyonePermissions, "commands": commands })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/permissions.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/permissions.astro";
const $$url = "/dash/guild/[id]/permissions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Permissions,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
