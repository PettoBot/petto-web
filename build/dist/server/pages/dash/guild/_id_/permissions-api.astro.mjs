import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
function headers(apiKey) {
  return { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
}
async function auth(astro, id) {
  const result = await getGuildSession(astro, id);
  return "redirect" in result ? null : result.session;
}
async function fetchGroups(apiUrl, apiKey, guildId) {
  const res = await fetch(`${apiUrl}/rest/v1/permission_groups?guild_id=eq.${guildId}&select=*&order=id.asc`, { headers: headers(apiKey) });
  const groups = res.ok ? await res.json() : [];
  if (!groups.length) return [];
  const ids = groups.map((g) => g.id).join(",");
  const memRes = await fetch(`${apiUrl}/rest/v1/permission_group_members?group_id=in.(${ids})&select=*`, { headers: headers(apiKey) });
  const members = memRes.ok ? await memRes.json() : [];
  return groups.map((g) => ({ ...g, members: members.filter((m) => m.group_id === g.id) }));
}
const POST = async (astro) => {
  const { id } = astro.params;
  const session = await auth(astro, id);
  if (!session) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  const apiUrl = getEnv(astro, "PETTO_BOT_API_URL");
  const apiKey = getEnv(astro, "PETTO_BOT_API_SECRET");
  const body = await astro.request.json().catch(() => ({}));
  const action = String(body.action ?? "");
  const h = headers(apiKey);
  async function fail(res, fallback) {
    const text = await res.text().catch(() => "");
    return new Response(JSON.stringify({ error: `${fallback} (${res.status}): ${text.slice(0, 300)}` }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  async function groupName(groupId) {
    const res = await fetch(`${apiUrl}/rest/v1/permission_groups?id=eq.${groupId}&guild_id=eq.${id}&select=name,is_base`, { headers: h });
    if (!res.ok) return `group #${groupId}`;
    const rows = await res.json();
    if (!rows[0]) return `group #${groupId}`;
    return rows[0].is_base ? "@everyone" : rows[0].name;
  }
  async function ownsGroup(groupId) {
    if (!Number.isInteger(groupId) || groupId <= 0) return false;
    const res = await fetch(`${apiUrl}/rest/v1/permission_groups?id=eq.${groupId}&guild_id=eq.${id}&select=id`, { headers: h });
    if (!res.ok) return false;
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) && rows.length === 1;
  }
  async function logAudit(logAction, summary) {
    await fetch(`${apiUrl}/rest/v1/permission_audit_log`, {
      method: "POST",
      headers: { ...h, Prefer: "return=minimal" },
      body: JSON.stringify({ guild_id: id, actor_id: session.userId, actor_name: session.username, action: logAction, summary })
    }).catch(() => {
    });
  }
  if (action === "create_group") {
    const name = String(body.name ?? "").trim().slice(0, 60);
    if (!name) return new Response(JSON.stringify({ error: "name required" }), { status: 400 });
    const level = Math.max(0, Math.min(100, Number(body.level) || 0));
    const res = await fetch(`${apiUrl}/rest/v1/permission_groups`, {
      method: "POST",
      headers: { ...h, Prefer: "return=minimal" },
      body: JSON.stringify({ guild_id: id, name, level })
    });
    if (!res.ok) return fail(res, "Couldn't create the group, maybe it already exists or the permission_groups table isn't set up yet");
    await logAudit("create_group", `Created group "${name}"`);
  } else if (action === "delete_group") {
    if (!await ownsGroup(Number(body.groupId))) return new Response(JSON.stringify({ error: "That group does not belong to this server." }), { status: 404, headers: { "Content-Type": "application/json" } });
    const name = await groupName(Number(body.groupId));
    const res = await fetch(`${apiUrl}/rest/v1/permission_groups?id=eq.${Number(body.groupId)}&guild_id=eq.${id}&is_base=eq.false`, { method: "DELETE", headers: h });
    if (!res.ok) return fail(res, "Couldn't delete the group");
    await logAudit("delete_group", `Deleted group "${name}"`);
  } else if (action === "update_group_level") {
    if (!await ownsGroup(Number(body.groupId))) return new Response(JSON.stringify({ error: "That group does not belong to this server." }), { status: 404, headers: { "Content-Type": "application/json" } });
    const level = Math.max(0, Math.min(100, Number(body.level) || 0));
    const name = await groupName(Number(body.groupId));
    const res = await fetch(`${apiUrl}/rest/v1/permission_groups?id=eq.${Number(body.groupId)}&guild_id=eq.${id}`, {
      method: "PATCH",
      headers: { ...h, Prefer: "return=minimal" },
      body: JSON.stringify({ level })
    });
    if (!res.ok) return fail(res, "Couldn't update the group's level, the permission_groups table may not exist yet");
    await logAudit("update_group_level", `Set "${name}" to level ${level}`);
  } else if (action === "add_member") {
    const subjectType = body.subjectType === "user" ? "user" : "role";
    const subjectId = String(body.subjectId ?? "").trim();
    if (!subjectId) return new Response(JSON.stringify({ error: "subjectId required" }), { status: 400 });
    if (!await ownsGroup(Number(body.groupId))) return new Response(JSON.stringify({ error: "That group does not belong to this server." }), { status: 404, headers: { "Content-Type": "application/json" } });
    const name = await groupName(Number(body.groupId));
    const res = await fetch(`${apiUrl}/rest/v1/permission_group_members?on_conflict=group_id,subject_type,subject_id`, {
      method: "POST",
      headers: { ...h, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ group_id: Number(body.groupId), subject_type: subjectType, subject_id: subjectId })
    });
    if (!res.ok) return fail(res, "Couldn't add that member, the permission_group_members table may not exist yet");
    await logAudit("add_member", `Added ${subjectType} ${subjectId} to "${name}"`);
  } else if (action === "remove_member") {
    if (!await ownsGroup(Number(body.groupId))) return new Response(JSON.stringify({ error: "That group does not belong to this server." }), { status: 404, headers: { "Content-Type": "application/json" } });
    const name = await groupName(Number(body.groupId));
    const res = await fetch(
      `${apiUrl}/rest/v1/permission_group_members?group_id=eq.${Number(body.groupId)}&subject_type=eq.${body.subjectType === "user" ? "user" : "role"}&subject_id=eq.${encodeURIComponent(String(body.subjectId ?? ""))}`,
      { method: "DELETE", headers: h }
    );
    if (!res.ok) return fail(res, "Couldn't remove that member");
    await logAudit("remove_member", `Removed ${body.subjectType} ${body.subjectId} from "${name}"`);
  } else if (action === "set_command_level") {
    const commandName = String(body.commandName ?? "").trim();
    if (!commandName) return new Response(JSON.stringify({ error: "commandName required" }), { status: 400 });
    const level = Math.max(0, Math.min(100, Number(body.level) || 0));
    const res = await fetch(`${apiUrl}/rest/v1/command_permission_levels?on_conflict=guild_id,command_name`, {
      method: "POST",
      headers: { ...h, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ guild_id: id, command_name: commandName, required_level: level, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
    if (!res.ok) return fail(res, "Couldn't set the command's level, the command_permission_levels table may not exist yet");
    await logAudit("set_command_level", `Set /${commandName} to required level ${level}`);
  } else {
    return new Response(JSON.stringify({ error: "unknown action" }), { status: 400 });
  }
  const groups = await fetchGroups(apiUrl, apiKey, id);
  const levelsRes = await fetch(`${apiUrl}/rest/v1/command_permission_levels?guild_id=eq.${id}&select=command_name,required_level`, { headers: h });
  const levels = levelsRes.ok ? await levelsRes.json() : [];
  return new Response(JSON.stringify({ ok: true, groups, levels }), { headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
