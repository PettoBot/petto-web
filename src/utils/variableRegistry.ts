import { getEnv } from './env';

export interface RegistryVariable { tok: string; desc: string; dynamic?: boolean }
export interface RegistryGroup { id: string; label: string; availability: string; vars: RegistryVariable[] }

const OK_TTL_MS = 5 * 60_000;
const FAILED_TTL_MS = 60_000;
let cached: { groups: RegistryGroup[] | null; expiresAt: number } | null = null;

const isText = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && value.length < 400;

function readGroups(payload: any): RegistryGroup[] | null {
  if (!payload?.ok || !Array.isArray(payload.groups) || payload.groups.length === 0) return null;
  const groups: RegistryGroup[] = [];
  for (const group of payload.groups) {
    if (!isText(group?.id) || !isText(group?.label) || !Array.isArray(group?.vars)) return null;
    const vars: RegistryVariable[] = [];
    for (const variable of group.vars) {
      if (!isText(variable?.tok) || !isText(variable?.desc)) return null;
      vars.push({ tok: variable.tok, desc: variable.desc, dynamic: variable.dynamic === true });
    }
    groups.push({ id: group.id, label: group.label, availability: isText(group.availability) ? group.availability : 'always', vars });
  }
  return groups;
}

/**
 * The variables the bot understands, straight from the bot, so the dashboard does not keep its own
 * list as the only truth. Returns null when the bot is unreachable or is an older version without the
 * route, and callers then use the dashboard's built-in list. A good answer is kept for five minutes and
 * a failure for one minute, so a bot that is down does not slow every page.
 */
export async function getVariableGroups(astro: { locals?: any }): Promise<RegistryGroup[] | null> {
  if (cached && cached.expiresAt > Date.now()) return cached.groups;
  const baseUrl = getEnv(astro, 'PETTO_BOT_API_URL')?.replace(/\/$/, '');
  const secret = getEnv(astro, 'PETTO_BOT_API_SECRET');
  if (!baseUrl || !secret) return null;

  let groups: RegistryGroup[] | null = null;
  try {
    const res = await fetch(`${baseUrl}/api/dashboard/variables`, {
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json' },
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) groups = readGroups(await res.json());
  } catch {
    groups = null;
  }
  cached = { groups, expiresAt: Date.now() + (groups ? OK_TTL_MS : FAILED_TTL_MS) };
  return groups;
}

/** The bot's list if a page already read it lately (or null), without asking the bot: for parts that must add no request. */
export function peekVariableGroups(): RegistryGroup[] | null {
  return cached?.groups ?? null;
}
