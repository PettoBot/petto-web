import { g as getEnv } from './env_WnBvzCjc.mjs';

const TEAM_POSITIONS = ["owners", "programming", "support", "legal", "test"];
const MAX_PER_POSITION = 100;
const DEFAULTS = {
  owners: ["293504726505357312", "285568675631595521"],
  programming: ["1421156491322462291", "1383162811873628284", "293504726505357312"],
  support: ["1394428756948422706", "211313627343355904", "293504726505357312"],
  legal: ["293504726505357312"],
  test: ["803059961533825034", "1421156491322462291", "257181659865153539"]
};
const fallbackAvatar = (id) => `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id) >> 22n) % 6n)}.png`;
const USER_TTL_MS = 30 * 6e4;
const users = /* @__PURE__ */ new Map();
async function fetchUser(botToken, id) {
  const hit = users.get(id);
  if (hit && hit.expiresAt > Date.now()) return hit.member;
  let member = { id, username: id, displayName: id, avatarUrl: fallbackAvatar(id) };
  let found = false;
  try {
    const res = await fetch(`https://discord.com/api/users/${id}`, { headers: { Authorization: `Bot ${botToken}` } });
    if (res.ok) {
      const u = await res.json();
      member = {
        id,
        username: u.username,
        displayName: u.global_name || u.username,
        avatarUrl: u.avatar ? `https://cdn.discordapp.com/avatars/${id}/${u.avatar}.png?size=128` : fallbackAvatar(id)
      };
      found = true;
    }
  } catch {
  }
  users.set(id, { member, expiresAt: Date.now() + (found ? USER_TTL_MS : 6e4) });
  return member;
}
function findKnownUsers(text, limit = 10) {
  const needle = text.trim().toLowerCase();
  if (needle.length < 2) return [];
  const found = [];
  const now = Date.now();
  for (const [id, { member, expiresAt }] of users) {
    if (expiresAt <= now || member.username === id) continue;
    if (member.username.toLowerCase().includes(needle) || member.displayName.toLowerCase().includes(needle)) found.push(id);
    if (found.length >= limit) break;
  }
  return found;
}
async function fetchUsers(botToken, ids) {
  const out = /* @__PURE__ */ new Map();
  const unique = [...new Set(ids)];
  for (let start = 0; start < unique.length; start += 10) {
    await Promise.all(unique.slice(start, start + 10).map(async (id) => out.set(id, await fetchUser(botToken, id))));
  }
  return out;
}
function api(astro) {
  const url = getEnv(astro, "PETTO_BOT_API_URL")?.replace(/\/+$/, "");
  const key = getEnv(astro, "PETTO_BOT_API_SECRET");
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, "X-Petto-Dashboard-Key": key, Accept: "application/json", "Content-Type": "application/json" } } : null;
}
async function readTeamRows(astro) {
  const config = api(astro);
  if (!config) return null;
  try {
    const res = await fetch(`${config.url}/rest/v1/site_team?select=id,position,user_id,sort_order&order=sort_order.asc,id.asc&limit=1000`, { headers: config.headers });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? rows.filter((row) => TEAM_POSITIONS.includes(row.position)).map((row) => ({ ...row, id: Number(row.id) })) : null;
  } catch {
    return null;
  }
}
async function getTeamIds(astro) {
  const rows = await readTeamRows(astro);
  if (!rows || rows.length === 0) return { ids: structuredClone(DEFAULTS), custom: false };
  const ids = Object.fromEntries(TEAM_POSITIONS.map((position) => [position, rows.filter((row) => row.position === position).map((row) => row.user_id)]));
  return { ids, custom: true };
}
async function getTeamRoster(botToken, astro) {
  const { ids } = astro ? await getTeamIds(astro) : { ids: DEFAULTS };
  const byId = await fetchUsers(botToken, TEAM_POSITIONS.flatMap((position) => ids[position]));
  return Object.fromEntries(TEAM_POSITIONS.map((position) => [position, ids[position].map((id) => byId.get(id)).filter((m) => Boolean(m))]));
}
async function describeTeam(botToken, ids) {
  return fetchUsers(botToken, ids);
}
function readIds(text) {
  return [...new Set([...text.matchAll(/\d{15,22}/g)].map((match) => match[0]))];
}
async function write(astro, path, method, body, extra = {}) {
  const config = api(astro);
  if (!config) return false;
  try {
    const res = await fetch(`${config.url}/rest/v1/${path}`, { method, headers: { ...config.headers, ...extra }, body: body === void 0 ? void 0 : JSON.stringify(body) });
    return res.ok;
  } catch {
    return false;
  }
}
async function startCustomTeam(astro) {
  const rows = await readTeamRows(astro);
  if (rows === null) return { ok: false, error: "not_configured" };
  if (rows.length > 0) return { ok: true, added: 0 };
  let added = 0;
  for (const position of TEAM_POSITIONS) {
    for (const [index, id] of DEFAULTS[position].entries()) {
      if (await write(astro, "site_team", "POST", { position, user_id: id, sort_order: index + 1 }, { Prefer: "return=minimal" })) added += 1;
    }
  }
  return added ? { ok: true, added } : { ok: false, error: "database" };
}
async function addTeamMembers(astro, position, text) {
  if (!TEAM_POSITIONS.includes(position)) return { ok: false, error: "invalid" };
  const wanted = readIds(text);
  if (!wanted.length) return { ok: false, error: "nothing" };
  const rows = await readTeamRows(astro);
  if (rows === null) return { ok: false, error: "not_configured" };
  const here = rows.filter((row) => row.position === position);
  const present = new Set(here.map((row) => row.user_id));
  const fresh = wanted.filter((id) => !present.has(id));
  const room = MAX_PER_POSITION - here.length;
  if (fresh.length > room) return { ok: false, error: "full" };
  let order = Math.max(0, ...here.map((row) => row.sort_order));
  let added = 0;
  for (const id of fresh) {
    order += 1;
    if (await write(astro, "site_team", "POST", { position, user_id: id, sort_order: order }, { Prefer: "return=minimal" })) added += 1;
  }
  if (fresh.length && !added) return { ok: false, error: "database" };
  return { ok: true, added, skipped: wanted.length - fresh.length };
}
async function removeTeamMember(astro, rowId) {
  if (!Number.isInteger(rowId) || rowId <= 0) return { ok: false, error: "invalid" };
  return await write(astro, `site_team?id=eq.${rowId}`, "DELETE", void 0, { Prefer: "return=minimal" }) ? { ok: true } : { ok: false, error: "database" };
}
async function moveTeamMember(astro, rowId, direction) {
  const rows = await readTeamRows(astro);
  if (rows === null) return { ok: false, error: "not_configured" };
  const row = rows.find((entry) => entry.id === rowId);
  if (!row) return { ok: false, error: "invalid" };
  const list = rows.filter((entry) => entry.position === row.position);
  const index = list.findIndex((entry) => entry.id === rowId);
  const other = list[direction === "up" ? index - 1 : index + 1];
  if (!other) return { ok: true };
  const order = list.map((entry) => entry.id);
  const otherIndex = index + (direction === "up" ? -1 : 1);
  [order[index], order[otherIndex]] = [order[otherIndex], order[index]];
  for (const [place, id] of order.entries()) {
    if (!await write(astro, `site_team?id=eq.${id}`, "PATCH", { sort_order: place + 1 }, { Prefer: "return=minimal" })) return { ok: false, error: "database" };
  }
  return { ok: true };
}
async function resetTeam(astro) {
  return await write(astro, "site_team?id=gt.0", "DELETE", void 0, { Prefer: "return=minimal" }) ? { ok: true } : { ok: false, error: "database" };
}

export { MAX_PER_POSITION as M, TEAM_POSITIONS as T, addTeamMembers as a, resetTeam as b, readTeamRows as c, describeTeam as d, getTeamRoster as e, findKnownUsers as f, getTeamIds as g, moveTeamMember as m, removeTeamMember as r, startCustomTeam as s };
