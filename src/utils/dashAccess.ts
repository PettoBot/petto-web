// Access to the dashboard by role. Whoever manages a server (Manage Server or Administrator) always has all of it; besides them, the server can
// let the members of a role into the whole dashboard or into some of its parts, to look at them or to change them. The rules live in the
// `dash_access` table, and the roles of the visitor are read from Discord with the bot, never from the cookie.
import { getEnv } from './env';
import { memoPerRequest } from './requestMemo';

/** One rule: the members of a role, the parts they can open (`*` is all of them) and whether they can change them. */
export interface AccessRule { role_id: string; sections: string[]; can_edit: boolean }

/** The parts of the dashboard a rule can name, each with the pages (and the pages that serve them) it opens. */
export const ACCESS_SECTIONS: { id: string; label: string; pages: string[] }[] = [
  { id: 'dashboard', label: 'Dashboard', pages: ['modules', 'stats', 'general', 'customize', 'backups'] },
  { id: 'design', label: 'Design', pages: ['embeds', 'cards'] },
  { id: 'moderation', label: 'Moderation', pages: ['moderation', 'antinuke', 'antiscam', 'automod', 'lockdown'] },
  { id: 'appeals', label: 'Appeals', pages: ['appeals'] },
  { id: 'security', label: 'Security', pages: ['onboarding', 'verification', 'security', 'permissions', 'audit', 'logging'] },
  { id: 'leveling', label: 'Leveling', pages: ['leveling'] },
  { id: 'automation', label: 'Automation', pages: ['automation', 'code', 'bulk-role', 'reaction-role', 'counters'] },
  { id: 'community', label: 'Community', pages: ['tickets', 'giveaways', 'community', 'birthdays', 'confessions', 'counting', 'partners', 'responders', 'senders', 'suggestions', 'tools', 'forms'] },
  { id: 'quests', label: 'Quests', pages: ['quests'] },
  { id: 'rollouts', label: 'Rollouts', pages: ['rollouts'] },
  { id: 'vanity', label: 'Vanity roles', pages: ['vanity'] },
];
const SECTION_IDS = new Set(ACCESS_SECTIONS.map((section) => section.id));
/** Open for anyone who has any rule: the overview and the live updates the pages ask for. */
const OPEN_PAGES = new Set(['overview', 'live', 'role-blocks']);

/** What a member's roles allow: the parts they can open, and for each one whether they can change it. */
export interface RoleAccess { all: boolean; sections: Record<string, boolean>; canEditAll: boolean }

/** The page of a dashboard address: `/dash/guild/<id>/<page>` is `<page>`. */
export function pageOf(pathname: string, guildId: string): string {
  const prefix = `/dash/guild/${guildId}/`;
  if (!pathname.startsWith(prefix)) return '';
  return pathname.slice(prefix.length).split('/')[0].replace(/\.[a-z]+$/, '');
}

/** The part of the dashboard a page belongs to (a page that serves another one, like `tickets-api`, belongs with it). */
export function sectionOfPage(page: string): string | null {
  for (const section of ACCESS_SECTIONS) {
    if (section.pages.some((name) => page === name || page.startsWith(`${name}-`))) return section.id;
  }
  return null;
}

/** Puts together the rules of every role the member has. A part is changeable when any of their rules lets them change it. */
export function accessFromRules(rules: AccessRule[], roleIds: string[]): RoleAccess | null {
  const mine = rules.filter((rule) => roleIds.includes(rule.role_id));
  if (!mine.length) return null;
  const access: RoleAccess = { all: false, sections: {}, canEditAll: false };
  for (const rule of mine) {
    if (rule.sections.includes('*')) { access.all = true; if (rule.can_edit) access.canEditAll = true; }
    for (const id of rule.sections) if (SECTION_IDS.has(id)) access.sections[id] = access.sections[id] || rule.can_edit;
  }
  return access;
}

/** Whether a page can be opened with this access, and whether it can be changed there. The page that sets the access up is never open. */
export function pageDecision(access: RoleAccess, page: string): { allowed: boolean; canEdit: boolean } {
  if (page === 'access') return { allowed: false, canEdit: false };
  if (OPEN_PAGES.has(page)) return { allowed: true, canEdit: false };
  const section = sectionOfPage(page);
  if (!section) return { allowed: access.all, canEdit: access.all && access.canEditAll };
  if (access.all) return { allowed: true, canEdit: access.canEditAll || Boolean(access.sections[section]) };
  return { allowed: section in access.sections, canEdit: Boolean(access.sections[section]) };
}

// ---- reading the rules and the roles

const RULES_TTL_MS = 10_000;
const ROLES_TTL_MS = 20_000;
const rulesCache = new Map<string, { rules: AccessRule[]; expiresAt: number }>();
const rolesCache = new Map<string, { roles: string[] | null; expiresAt: number }>();

function database(astro: any) {
  const url = getEnv(astro, 'PETTO_BOT_API_URL');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } };
}

const cleanRule = (row: any): AccessRule => ({
  role_id: String(row.role_id),
  sections: Array.isArray(row.sections) ? row.sections.map(String) : [],
  can_edit: Boolean(row.can_edit),
});

/** The rules of a server. Kept for a few seconds; saving them calls `forgetRules`. */
export async function loadRules(astro: any, guildId: string): Promise<AccessRule[]> {
  const hit = rulesCache.get(guildId);
  if (hit && hit.expiresAt > Date.now()) return hit.rules;
  const db = database(astro);
  if (!db) return [];
  try {
    const response = await fetch(`${db.url}/rest/v1/dash_access?guild_id=eq.${encodeURIComponent(guildId)}&select=role_id,sections,can_edit&order=created_at.asc`, { headers: db.headers });
    if (!response.ok) return [];
    const rules = ((await response.json()) as any[]).map(cleanRule);
    rulesCache.set(guildId, { rules, expiresAt: Date.now() + RULES_TTL_MS });
    return rules;
  } catch {
    return [];
  }
}

export function forgetRules(guildId: string): void {
  rulesCache.delete(guildId);
}

/** The roles a member has in a server, from Discord; null when they are not in it (or Discord did not say). */
export async function memberRoleIds(astro: any, guildId: string, userId: string): Promise<string[] | null> {
  const key = `${guildId}:${userId}`;
  const hit = rolesCache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.roles;
  const token = getEnv(astro, 'DISCORD_TOKEN');
  if (!token) return null;
  try {
    const response = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, { headers: { Authorization: `Bot ${token}` } });
    if (!response.ok) {
      if (response.status === 404) rolesCache.set(key, { roles: null, expiresAt: Date.now() + ROLES_TTL_MS });
      return null;
    }
    const member: any = await response.json();
    const roles = Array.isArray(member.roles) ? member.roles.map(String) : [];
    rolesCache.set(key, { roles, expiresAt: Date.now() + ROLES_TTL_MS });
    return roles;
  } catch {
    return null;
  }
}

/** What the roles of a member allow in a server, or null when no rule applies to them. Shared by the page and its layout in one request. */
export function getRoleAccess(astro: any, guildId: string, userId: string): Promise<RoleAccess | null> {
  return memoPerRequest(astro.request, `role-access:${guildId}:${userId}`, async () => {
    const rules = await loadRules(astro, guildId);
    if (!rules.length) return null;
    const roles = await memberRoleIds(astro, guildId, userId);
    return roles ? accessFromRules(rules, roles) : null;
  });
}

/** Of some servers (where Petto is and the visitor is a member), the ones whose rules let them in. */
export async function guildsWithRoleAccess(astro: any, userId: string, guildIds: string[]): Promise<string[]> {
  const db = database(astro);
  if (!db || !guildIds.length) return [];
  const ids = guildIds.slice(0, 100);
  let rows: any[] = [];
  try {
    const response = await fetch(`${db.url}/rest/v1/dash_access?guild_id=in.(${ids.map(encodeURIComponent).join(',')})&select=guild_id,role_id,sections,can_edit`, { headers: db.headers });
    if (response.ok) rows = await response.json();
  } catch { /* nothing to list */ }
  const byGuild = new Map<string, AccessRule[]>();
  for (const row of rows) byGuild.set(String(row.guild_id), [...(byGuild.get(String(row.guild_id)) ?? []), cleanRule(row)]);
  const found = await Promise.all([...byGuild].slice(0, 25).map(async ([guildId, rules]) => {
    const roles = await memberRoleIds(astro, guildId, userId);
    return roles && accessFromRules(rules, roles) ? guildId : null;
  }));
  return found.filter((id): id is string => Boolean(id));
}
