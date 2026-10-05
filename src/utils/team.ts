// The people on the team page. The owner edits them in the dashboard and they live in the `site_team` table of the bot's
// database. While that table has nothing in it (or cannot be read) the page shows the original list below, so it is never empty.
import { getEnv } from './env';

export const TEAM_POSITIONS = ['owners', 'programming', 'support', 'legal', 'test'] as const;
export type TeamPosition = (typeof TEAM_POSITIONS)[number];
/** The most people one position can hold. */
export const MAX_PER_POSITION = 100;

const DEFAULTS: Record<TeamPosition, string[]> = {
  owners: ['293504726505357312', '285568675631595521'],
  programming: ['1421156491322462291', '1383162811873628284', '293504726505357312'],
  support: ['1394428756948422706', '211313627343355904', '293504726505357312'],
  legal: ['293504726505357312'],
  test: ['803059961533825034', '1421156491322462291', '257181659865153539'],
};

export interface TeamMember {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export interface TeamRow { id: number; position: TeamPosition; user_id: string; sort_order: number }

const fallbackAvatar = (id: string) => `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id) >> 22n) % 6n)}.png`;

// A person is looked up in Discord once and kept for a while, so a page with many people does not ask Discord for each of them every time.
const USER_TTL_MS = 30 * 60_000;
const users = new Map<string, { member: TeamMember; expiresAt: number }>();

async function fetchUser(botToken: string, id: string): Promise<TeamMember> {
  const hit = users.get(id);
  if (hit && hit.expiresAt > Date.now()) return hit.member;
  let member: TeamMember = { id, username: id, displayName: id, avatarUrl: fallbackAvatar(id) };
  let found = false;
  try {
    const res = await fetch(`https://discord.com/api/users/${id}`, { headers: { Authorization: `Bot ${botToken}` } });
    if (res.ok) {
      const u: any = await res.json();
      member = {
        id,
        username: u.username,
        displayName: u.global_name || u.username,
        avatarUrl: u.avatar ? `https://cdn.discordapp.com/avatars/${id}/${u.avatar}.png?size=128` : fallbackAvatar(id),
      };
      found = true;
    }
  } catch { /* the id stays as the name */ }
  users.set(id, { member, expiresAt: Date.now() + (found ? USER_TTL_MS : 60_000) });
  return member;
}

async function fetchUsers(botToken: string, ids: string[]): Promise<Map<string, TeamMember>> {
  const out = new Map<string, TeamMember>();
  const unique = [...new Set(ids)];
  for (let start = 0; start < unique.length; start += 10) {
    await Promise.all(unique.slice(start, start + 10).map(async (id) => out.set(id, await fetchUser(botToken, id))));
  }
  return out;
}

function api(astro: any) {
  const url = getEnv(astro, 'PETTO_BOT_API_URL')?.replace(/\/+$/, '');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'X-Petto-Dashboard-Key': key, Accept: 'application/json', 'Content-Type': 'application/json' } } : null;
}

/** Every saved row in page order, or null when the table cannot be read. */
export async function readTeamRows(astro: any): Promise<TeamRow[] | null> {
  const config = api(astro);
  if (!config) return null;
  try {
    const res = await fetch(`${config.url}/rest/v1/site_team?select=id,position,user_id,sort_order&order=sort_order.asc,id.asc&limit=1000`, { headers: config.headers });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? rows.filter((row: any) => (TEAM_POSITIONS as readonly string[]).includes(row.position)) as TeamRow[] : null;
  } catch {
    return null;
  }
}

/** The ids of each position and whether they come from the table (true) or are the original list (false). */
export async function getTeamIds(astro: any): Promise<{ ids: Record<TeamPosition, string[]>; custom: boolean }> {
  const rows = await readTeamRows(astro);
  if (!rows || rows.length === 0) return { ids: structuredClone(DEFAULTS), custom: false };
  const ids = Object.fromEntries(TEAM_POSITIONS.map((position) => [position, rows.filter((row) => row.position === position).map((row) => row.user_id)])) as Record<TeamPosition, string[]>;
  return { ids, custom: true };
}

export type TeamRoster = Record<TeamPosition, TeamMember[]>;

export async function getTeamRoster(botToken: string, astro?: any): Promise<TeamRoster> {
  const { ids } = astro ? await getTeamIds(astro) : { ids: DEFAULTS };
  const byId = await fetchUsers(botToken, TEAM_POSITIONS.flatMap((position) => ids[position]));
  return Object.fromEntries(TEAM_POSITIONS.map((position) => [position, ids[position].map((id) => byId.get(id)).filter((m): m is TeamMember => Boolean(m))])) as TeamRoster;
}

/** Names and pictures for the editor. */
export async function describeTeam(botToken: string, ids: string[]): Promise<Map<string, TeamMember>> {
  return fetchUsers(botToken, ids);
}

/** Discord ids written in a box: ids, mentions (`<@123>`), separated by spaces, commas or lines. */
export function readIds(text: string): string[] {
  return [...new Set([...text.matchAll(/\d{15,22}/g)].map((match) => match[0]))];
}

export type TeamResult = { ok: true; added?: number; skipped?: number } | { ok: false; error: 'not_configured' | 'invalid' | 'full' | 'database' | 'nothing' };

async function write(astro: any, path: string, method: string, body?: unknown, extra: Record<string, string> = {}): Promise<boolean> {
  const config = api(astro);
  if (!config) return false;
  try {
    const res = await fetch(`${config.url}/rest/v1/${path}`, { method, headers: { ...config.headers, ...extra }, body: body === undefined ? undefined : JSON.stringify(body) });
    return res.ok;
  } catch {
    return false;
  }
}

/** Puts the original list in the table so it can be edited. Does nothing when there is already something saved. */
export async function startCustomTeam(astro: any): Promise<TeamResult> {
  const rows = await readTeamRows(astro);
  if (rows === null) return { ok: false, error: 'not_configured' };
  if (rows.length > 0) return { ok: true, added: 0 };
  let added = 0;
  for (const position of TEAM_POSITIONS) {
    for (const [index, id] of DEFAULTS[position].entries()) {
      if (await write(astro, 'site_team', 'POST', { position, user_id: id, sort_order: index + 1 }, { Prefer: 'return=minimal' })) added += 1;
    }
  }
  return added ? { ok: true, added } : { ok: false, error: 'database' };
}

/** Adds people to a position, never past the limit. */
export async function addTeamMembers(astro: any, position: string, text: string): Promise<TeamResult> {
  if (!(TEAM_POSITIONS as readonly string[]).includes(position)) return { ok: false, error: 'invalid' };
  const wanted = readIds(text);
  if (!wanted.length) return { ok: false, error: 'nothing' };
  const rows = await readTeamRows(astro);
  if (rows === null) return { ok: false, error: 'not_configured' };
  const here = rows.filter((row) => row.position === position);
  const present = new Set(here.map((row) => row.user_id));
  const fresh = wanted.filter((id) => !present.has(id));
  const room = MAX_PER_POSITION - here.length;
  if (fresh.length > room) return { ok: false, error: 'full' };
  let order = Math.max(0, ...here.map((row) => row.sort_order));
  let added = 0;
  for (const id of fresh) {
    order += 1;
    if (await write(astro, 'site_team', 'POST', { position, user_id: id, sort_order: order }, { Prefer: 'return=minimal' })) added += 1;
  }
  if (fresh.length && !added) return { ok: false, error: 'database' };
  return { ok: true, added, skipped: wanted.length - fresh.length };
}

export async function removeTeamMember(astro: any, rowId: number): Promise<TeamResult> {
  if (!Number.isInteger(rowId) || rowId <= 0) return { ok: false, error: 'invalid' };
  return (await write(astro, `site_team?id=eq.${rowId}`, 'DELETE', undefined, { Prefer: 'return=minimal' })) ? { ok: true } : { ok: false, error: 'database' };
}

/** Moves a person one place up or down inside their position by swapping their order with the neighbour. */
export async function moveTeamMember(astro: any, rowId: number, direction: 'up' | 'down'): Promise<TeamResult> {
  const rows = await readTeamRows(astro);
  if (rows === null) return { ok: false, error: 'not_configured' };
  const row = rows.find((entry) => entry.id === rowId);
  if (!row) return { ok: false, error: 'invalid' };
  const list = rows.filter((entry) => entry.position === row.position);
  const index = list.findIndex((entry) => entry.id === rowId);
  const other = list[direction === 'up' ? index - 1 : index + 1];
  if (!other) return { ok: true };
  // Equal orders cannot be swapped, so the whole position is numbered again first.
  const order = list.map((entry) => entry.id);
  [order[index], order[order.indexOf(other.id)]] = [other.id, row.id];
  for (const [place, id] of order.entries()) {
    if (!(await write(astro, `site_team?id=eq.${id}`, 'PATCH', { sort_order: place + 1 }, { Prefer: 'return=minimal' }))) return { ok: false, error: 'database' };
  }
  return { ok: true };
}

/** Deletes every saved person, so the page goes back to the original list. */
export async function resetTeam(astro: any): Promise<TeamResult> {
  return (await write(astro, 'site_team?id=gt.0', 'DELETE', undefined, { Prefer: 'return=minimal' })) ? { ok: true } : { ok: false, error: 'database' };
}
