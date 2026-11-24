import { getEnv } from './env';
import { resetGuildPremiumCustomization } from './premium';

export const PETTO_OWNER_ID = '293504726505357312';

type Settings = { url: string; key: string };

export interface ManualPremiumGrant {
  id: number;
  user_id: string;
  provider_subscription_id: string | null;
  plan_key: string;
  status: string;
  slot_limit: number;
  current_period_end: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  assignments: Array<{ guild_id: string; status: string }>;
}

function settings(astro: any): Settings | null {
  const url = getEnv(astro, 'PETTO_BOT_API_URL');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
  return url && key ? { url, key } : null;
}

function headers(key: string, extra: Record<string, string> = {}): HeadersInit {
  return { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json', ...extra };
}

function validDiscordId(value: string): boolean {
  return /^\d{15,22}$/.test(value);
}

// PETTO_OWNER_ID may hold one id or several, separated by commas, spaces or semicolons; quotes or a mention around an id are not part of it. The first one is "the owner"
// (the one that is shown or used as the default), and every one of them is an owner.
function ownerIds(astro: any): string[] {
  const listed = String(getEnv(astro, 'PETTO_OWNER_ID') ?? '').split(/[\s,;]+/).map((part) => part.replace(/\D/g, '')).filter(validDiscordId);
  return listed.length ? [...new Set(listed)] : [PETTO_OWNER_ID];
}

function ownerId(astro: any): string {
  return ownerIds(astro)[0];
}

export function isPettoOwner(astro: any, userId: string): boolean {
  return validDiscordId(userId) && ownerIds(astro).includes(userId);
}

async function read<T>(astro: any, table: string, query: string): Promise<T[]> {
  const config = settings(astro);
  if (!config) return [];
  try {
    const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, { headers: headers(config.key) });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data as T[] : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// Durations. A manual grant never charges anyone: when `current_period_end` passes, the grant just stops being live.
// ---------------------------------------------------------------------------------------------------------------------

export const DURATIONS = ['permanent', '1m', '3m', '6m', '1y', 'date'] as const;
export type Duration = typeof DURATIONS[number];
const DURATION_MONTHS: Record<string, number> = { '1m': 1, '3m': 3, '6m': 6, '1y': 12 };
const MAX_DATE_YEARS = 10;

/** Real calendar months: 31 Jan + 1 month is the last day of February. The time of day is kept. */
export function addMonthsUtc(from: Date, months: number): Date {
  const total = from.getUTCMonth() + months;
  const year = from.getUTCFullYear() + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(from.getUTCDate(), lastDay), from.getUTCHours(), from.getUTCMinutes(), from.getUTCSeconds(), from.getUTCMilliseconds()));
}

export function endOfDayUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

/** "2027-01-31" as the end of that day (UTC), or null when it is not a real date. */
export function parseUntilDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

/** Whether a stored row counts as Premium now (the same rule as the bot and the rest of the website). */
export function isLiveEntitlement(entitlement: { status: string; current_period_end: string | null } | undefined | null, now = Date.now()): boolean {
  if (!entitlement || entitlement.status !== 'active') return false;
  if (!entitlement.current_period_end) return true;
  const periodEnd = new Date(entitlement.current_period_end).getTime();
  return Number.isFinite(periodEnd) && periodEnd > now;
}

export type GrantState = 'permanent' | 'timed' | 'expired' | 'revoked';

export function grantState(grant: { status: string; current_period_end: string | null; metadata?: Record<string, unknown> | null }, now = Date.now()): GrantState {
  if (isLiveEntitlement(grant, now)) return grant.current_period_end ? 'timed' : 'permanent';
  if (grant.status !== 'active' && grant.metadata?.revoked_at) return 'revoked';
  return 'expired';
}

export function grantTarget(grant: { user_id: string; provider_subscription_id: string | null; metadata?: Record<string, unknown> | null }): { type: 'user' | 'server'; id: string } {
  const match = /^manual:(user|server):(\d+)$/.exec(grant.provider_subscription_id ?? '');
  if (match) return { type: match[1] as 'user' | 'server', id: match[2] };
  if (grant.metadata?.target_type === 'server') return { type: 'server', id: String(grant.metadata.target_guild_id ?? '') };
  return { type: 'user', id: grant.user_id };
}

/** Whole days from now until `end` (at least 0). */
export function daysLeft(end: string, now = Date.now()): number {
  return Math.max(0, Math.ceil((new Date(end).getTime() - now) / 86_400_000));
}

// ---------------------------------------------------------------------------------------------------------------------
// What an ID is. Discord answers "is this a user?" for any real account, the bot's tables and its saved copy of a server say
// whether Petto is in that server. Nothing here writes anything.
// ---------------------------------------------------------------------------------------------------------------------

export interface TargetInfo {
  type: 'user' | 'server';
  id: string;
  /** Petto knows this ID as the kind that was chosen. */
  known: boolean;
  name: string | null;
  image: string | null;
  memberCount: number | null;
}

interface Looked { found: boolean; name: string | null; image: string | null; memberCount: number | null; unsure?: boolean }
const LOOKUP_TTL_MS = 10 * 60_000;
const lookupCache = new Map<string, { value: Looked; expires: number }>();
export function clearAdminLookupCache(): void { lookupCache.clear(); }

function remember(key: string, value: Looked): Looked {
  if (lookupCache.size > 500) lookupCache.clear();
  if (!value.unsure) lookupCache.set(key, { value, expires: Date.now() + LOOKUP_TTL_MS });
  return value;
}

const NOT_FOUND: Looked = { found: false, name: null, image: null, memberCount: null };

export function guildIcon(id: string, icon: string | null | undefined): string | null {
  if (!icon) return null;
  return /^https?:\/\//.test(icon) ? icon : `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=64`;
}

export function userAvatar(id: string, avatar: string | null | undefined): string {
  if (avatar) return /^https?:\/\//.test(avatar) ? avatar : `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=64`;
  const index = validDiscordId(id) ? Number((BigInt(id) >> BigInt(22)) % BigInt(6)) : 0;
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

async function discordGet(path: string, token: string): Promise<{ status: number; body: any } | null> {
  try {
    const response = await fetch(`https://discord.com/api/v10${path}`, { headers: { Authorization: `Bot ${token}` } });
    const body = response.ok ? await response.json().catch(() => null) : null;
    return { status: response.status, body };
  } catch {
    return null;
  }
}

async function lookupGuild(astro: any, id: string): Promise<Looked> {
  const cached = lookupCache.get(`g:${id}`);
  if (cached && cached.expires > Date.now()) return cached.value;
  const [known, snapshots] = await Promise.all([
    read<{ guild_id: string }>(astro, 'guilds', `guild_id=eq.${encodeURIComponent(id)}&select=guild_id&limit=1`),
    read<{ name: string; icon: string | null; member_count: number | null }>(astro, 'discord_guild_snapshots', `guild_id=eq.${encodeURIComponent(id)}&select=name,icon,member_count&limit=1`),
  ]);
  const snapshot = snapshots[0];
  if (snapshot?.name) {
    const count = Number(snapshot.member_count);
    return remember(`g:${id}`, { found: true, name: String(snapshot.name), image: guildIcon(id, snapshot.icon), memberCount: Number.isFinite(count) && count > 0 ? count : null });
  }
  const token = getEnv(astro, 'DISCORD_TOKEN');
  const live = token ? await discordGet(`/guilds/${id}?with_counts=true`, token) : null;
  if (live?.body?.name) {
    const count = Number(live.body.approximate_member_count);
    return remember(`g:${id}`, { found: true, name: String(live.body.name), image: guildIcon(id, live.body.icon), memberCount: Number.isFinite(count) && count > 0 ? count : null });
  }
  // A row in `guilds` means Petto has been in the server (the row is kept when it leaves), but the name is not known.
  if (known.length) return remember(`g:${id}`, { found: true, name: null, image: null, memberCount: null });
  // Discord not answering (token missing, rate limit, outage) is not "Petto is not there".
  return live && live.status === 404 || live?.status === 403 || (!token && !snapshots.length) ? remember(`g:${id}`, NOT_FOUND) : { ...NOT_FOUND, unsure: true };
}

async function lookupUser(astro: any, id: string): Promise<Looked> {
  const cached = lookupCache.get(`u:${id}`);
  if (cached && cached.expires > Date.now()) return cached.value;
  const token = getEnv(astro, 'DISCORD_TOKEN');
  const live = token ? await discordGet(`/users/${id}`, token) : null;
  if (live?.body?.id) {
    return remember(`u:${id}`, { found: true, name: String(live.body.global_name || live.body.username || ''), image: userAvatar(id, live.body.avatar), memberCount: null });
  }
  // Without a Discord answer, the people Petto already has in its Premium tables are known (without a name).
  const [entitlements, assignments] = await Promise.all([
    read<{ user_id: string }>(astro, 'premium_entitlements', `user_id=eq.${encodeURIComponent(id)}&select=user_id&limit=1`),
    read<{ user_id: string }>(astro, 'premium_slot_assignments', `user_id=eq.${encodeURIComponent(id)}&select=user_id&limit=1`),
  ]);
  if (entitlements.length || assignments.length) return remember(`u:${id}`, { found: true, name: null, image: null, memberCount: null });
  return live && live.status === 404 || !token ? remember(`u:${id}`, NOT_FOUND) : { ...NOT_FOUND, unsure: true };
}

/** Names and pictures for the list of grants: servers from the bot's saved copies first, then Discord; users from Discord. */
export async function resolveGrantNames(astro: any, targets: Array<{ type: 'user' | 'server'; id: string }>): Promise<Map<string, { name: string | null; image: string | null }>> {
  const result = new Map<string, { name: string | null; image: string | null }>();
  const servers = [...new Set(targets.filter((t) => t.type === 'server' && validDiscordId(t.id)).map((t) => t.id))];
  const users = [...new Set(targets.filter((t) => t.type === 'user' && validDiscordId(t.id)).map((t) => t.id))];
  if (servers.length) {
    const rows = await read<{ guild_id: string; name: string; icon: string | null }>(astro, 'discord_guild_snapshots', `guild_id=in.(${servers.join(',')})&select=guild_id,name,icon`);
    for (const row of rows) if (row.name) result.set(`server:${row.guild_id}`, { name: String(row.name), image: guildIcon(String(row.guild_id), row.icon) });
  }
  const queue: Array<{ type: 'user' | 'server'; id: string }> = [
    ...servers.filter((id) => !result.has(`server:${id}`)).slice(0, 12).map((id) => ({ type: 'server' as const, id })),
    ...users.slice(0, 25).map((id) => ({ type: 'user' as const, id })),
  ];
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(5, queue.length) }, async () => {
    while (next < queue.length) {
      const item = queue[next++];
      const looked = item.type === 'server' ? await lookupGuild(astro, item.id) : await lookupUser(astro, item.id);
      if (looked.found && looked.name) result.set(`${item.type}:${item.id}`, { name: looked.name, image: looked.image });
    }
  }));
  return result;
}

// ---------------------------------------------------------------------------------------------------------------------
// The list
// ---------------------------------------------------------------------------------------------------------------------

function grantKey(targetType: 'user' | 'server', targetId: string): string {
  return `manual:${targetType}:${targetId}`;
}

export async function listManualPremium(astro: any): Promise<ManualPremiumGrant[]> {
  const entitlements = await read<ManualPremiumGrant>(
    astro,
    'premium_entitlements',
    'provider=eq.manual&select=id,user_id,provider_subscription_id,plan_key,status,slot_limit,current_period_end,metadata,created_at&order=updated_at.desc',
  );
  if (!entitlements.length) return [];

  const assignments = await read<{ entitlement_id: number; guild_id: string; status: string }>(
    astro,
    'premium_slot_assignments',
    'select=entitlement_id,guild_id,status&order=assigned_at.desc',
  );
  const byEntitlement = new Map<number, Array<{ guild_id: string; status: string }>>();
  for (const assignment of assignments) {
    const list = byEntitlement.get(assignment.entitlement_id) ?? [];
    list.push({ guild_id: assignment.guild_id, status: assignment.status });
    byEntitlement.set(assignment.entitlement_id, list);
  }
  return entitlements.map((grant) => ({ ...grant, assignments: byEntitlement.get(grant.id) ?? [] }));
}

// ---------------------------------------------------------------------------------------------------------------------
// Giving, extending and editing. Every change is first PLANNED (validated, with what it will do), shown to the owner, and
// only a signed copy of that plan can be saved.
// ---------------------------------------------------------------------------------------------------------------------

export type GrantCode = 'invalid' | 'database' | 'slot_conflict' | 'server_taken' | 'wrong_type_server' | 'wrong_type_user' | 'past_date' | 'not_found' | 'stale' | 'unconfirmed';
export type GrantResult = { ok: true } | { ok: false; code: GrantCode };

export type PlanNote = 'new' | 'extended' | 'kept_permanent' | 'kept_later' | 'restarted' | 'set';

export interface Plan {
  v: 1;
  mode: 'grant' | 'edit' | 'extend';
  actor: string;
  targetType: 'user' | 'server';
  targetId: string;
  entitlementId: number | null;
  slots: number;
  duration: Duration;
  /** The day typed for "Until a date" (YYYY-MM-DD), kept to plan the same change again when it is confirmed. */
  date: string;
  /** The end that will be saved (ISO), or null for permanent. */
  end: string | null;
  prevEnd: string | null;
  prevStatus: string | null;
  prevSlots: number | null;
  prevLive: boolean;
  note: PlanNote;
  /** A server grant has no user: the owner's account is the internal account. */
  internalUserId: string;
  /** The server is not one Petto knows: the owner must tick a box. */
  needsAck: boolean;
  exp: number;
}

export interface PlanInput {
  mode: 'grant' | 'edit' | 'extend';
  targetType?: string;
  targetId?: string;
  entitlementId?: number;
  duration: string;
  date?: string;
  slotLimit?: number;
}

export type PlanResult =
  | { ok: true; plan: Plan; target: TargetInfo }
  | { ok: false; code: GrantCode; flip?: 'user' | 'server'; target?: TargetInfo };

interface Existing {
  id: number;
  user_id: string;
  provider_subscription_id: string | null;
  status: string;
  slot_limit: number;
  current_period_end: string | null;
  metadata: Record<string, unknown> | null;
}
const EXISTING_COLUMNS = 'id,user_id,provider_subscription_id,status,slot_limit,current_period_end,metadata';
const PLAN_TTL_MS = 15 * 60_000;

function chooseEnd(existing: Existing | null, duration: Duration, dateEnd: Date | null, now: Date): { end: Date | null; note: PlanNote } {
  const months = DURATION_MONTHS[duration];
  const fromNow = () => (duration === 'permanent' ? null : duration === 'date' ? dateEnd : endOfDayUtc(addMonthsUtc(now, months)));
  if (duration === 'permanent') return { end: null, note: existing && isLiveEntitlement(existing, now.getTime()) && !existing.current_period_end ? 'kept_permanent' : 'set' };
  if (existing && isLiveEntitlement(existing, now.getTime())) {
    if (!existing.current_period_end) return { end: null, note: 'kept_permanent' };
    const current = new Date(existing.current_period_end);
    if (duration === 'date') return dateEnd && dateEnd.getTime() > current.getTime() ? { end: dateEnd, note: 'extended' } : { end: current, note: 'kept_later' };
    return { end: addMonthsUtc(current, months), note: 'extended' };
  }
  return { end: fromNow(), note: existing ? 'restarted' : 'new' };
}

/** Validates one change and says what it would do. Reads only. */
export async function planManualPremium(astro: any, actorId: string, input: PlanInput, now = new Date()): Promise<PlanResult> {
  if (!isPettoOwner(astro, actorId)) return { ok: false, code: 'invalid' };
  if (!settings(astro)) return { ok: false, code: 'database' };
  const duration = DURATIONS.find((d) => d === input.duration);
  if (!duration) return { ok: false, code: 'invalid' };
  const date = String(input.date ?? '').trim();
  let dateEnd: Date | null = null;
  if (duration === 'date') {
    dateEnd = parseUntilDate(date);
    if (!dateEnd) return { ok: false, code: 'invalid' };
    if (dateEnd.getTime() <= now.getTime()) return { ok: false, code: 'past_date' };
    if (dateEnd.getTime() > addMonthsUtc(now, MAX_DATE_YEARS * 12).getTime()) return { ok: false, code: 'invalid' };
  }

  let targetType: 'user' | 'server';
  let targetId: string;
  let existing: Existing | null = null;
  let target: TargetInfo;
  let needsAck = false;

  if (input.mode === 'grant') {
    const type = input.targetType === 'server' ? 'server' : input.targetType === 'user' ? 'user' : null;
    const id = String(input.targetId ?? '').trim();
    if (!type || !validDiscordId(id)) return { ok: false, code: 'invalid' };
    targetType = type;
    targetId = id;
    const [guild, user] = await Promise.all([lookupGuild(astro, id), lookupUser(astro, id)]);
    const asGuild: TargetInfo = { type: 'server', id, known: guild.found, name: guild.name, image: guild.image, memberCount: guild.memberCount };
    const asUser: TargetInfo = { type: 'user', id, known: user.found, name: user.name, image: user.image, memberCount: null };
    if (type === 'user' && guild.found) return { ok: false, code: 'wrong_type_server', flip: 'server', target: asGuild };
    if (type === 'server' && (id === ownerId(astro) || id === actorId || (user.found && !guild.found))) return { ok: false, code: 'wrong_type_user', flip: 'user', target: asUser };
    target = type === 'server' ? asGuild : asUser;
    needsAck = type === 'server' && !guild.found;
    existing = (await read<Existing>(astro, 'premium_entitlements', `provider_subscription_id=eq.${encodeURIComponent(grantKey(type, id))}&select=${EXISTING_COLUMNS}&limit=1`))[0] ?? null;
  } else {
    const entitlementId = Number(input.entitlementId);
    if (!Number.isInteger(entitlementId) || entitlementId < 1) return { ok: false, code: 'invalid' };
    existing = (await read<Existing>(astro, 'premium_entitlements', `id=eq.${entitlementId}&provider=eq.manual&select=${EXISTING_COLUMNS}&limit=1`))[0] ?? null;
    if (!existing) return { ok: false, code: 'not_found' };
    const parsed = grantTarget({ user_id: existing.user_id, provider_subscription_id: existing.provider_subscription_id, metadata: existing.metadata });
    if (!validDiscordId(parsed.id)) return { ok: false, code: 'invalid' };
    targetType = parsed.type;
    targetId = parsed.id;
    const looked = targetType === 'server' ? await lookupGuild(astro, targetId) : await lookupUser(astro, targetId);
    target = { type: targetType, id: targetId, known: looked.found, name: looked.name, image: looked.image, memberCount: looked.memberCount };
  }

  let slots = 1;
  if (targetType === 'user') {
    slots = input.slotLimit === undefined || input.slotLimit === null || Number.isNaN(Number(input.slotLimit)) ? (existing?.slot_limit ?? 0) : Number(input.slotLimit);
    if (input.mode === 'extend') slots = existing?.slot_limit ?? slots;
    if (!Number.isInteger(slots) || slots < 1 || slots > 1000) return { ok: false, code: 'invalid' };
  }

  if (existing && targetType === 'user') {
    const assigned = await read<{ id: number }>(astro, 'premium_slot_assignments', `entitlement_id=eq.${existing.id}&status=eq.active&select=id`);
    if (assigned.length > slots) return { ok: false, code: 'slot_conflict' };
  }
  if (targetType === 'server') {
    const taken = await serverTaken(astro, targetId, existing?.id ?? null, now.getTime());
    if (taken.code) return { ok: false, code: taken.code };
  }

  const { end, note } = input.mode === 'edit'
    ? { end: duration === 'permanent' ? null : duration === 'date' ? dateEnd : endOfDayUtc(addMonthsUtc(now, DURATION_MONTHS[duration])), note: 'set' as PlanNote }
    : chooseEnd(existing, duration, dateEnd, now);

  const plan: Plan = {
    v: 1, mode: input.mode, actor: actorId, targetType, targetId, entitlementId: existing?.id ?? null, slots, duration, date,
    end: end ? end.toISOString() : null,
    prevEnd: existing?.current_period_end ?? null, prevStatus: existing?.status ?? null, prevSlots: existing?.slot_limit ?? null,
    prevLive: isLiveEntitlement(existing, now.getTime()),
    note,
    // A Premium for a person belongs to that person (the bot finds it by `user_id`: their role, their slots, `!premium`). Only a Premium for a server is held by the owner.
    internalUserId: targetType === 'user' ? targetId : (existing?.user_id ?? ownerId(astro)),
    needsAck, exp: now.getTime() + PLAN_TTL_MS,
  };
  return { ok: true, plan, target };
}

/** A server can have one live Premium owner. A stale assignment (its owner's Premium is over) is reported so it can be released. */
async function serverTaken(astro: any, guildId: string, entitlementId: number | null, now: number): Promise<{ code?: 'server_taken'; staleAssignmentId?: number }> {
  const active = await read<{ id: number; entitlement_id: number }>(astro, 'premium_slot_assignments', `guild_id=eq.${encodeURIComponent(guildId)}&status=eq.active&select=id,entitlement_id&limit=1`);
  if (!active[0] || active[0].entitlement_id === entitlementId) return {};
  const other = await read<{ status: string; current_period_end: string | null }>(astro, 'premium_entitlements', `id=eq.${active[0].entitlement_id}&select=status,current_period_end&limit=1`);
  if (isLiveEntitlement(other[0], now)) return { code: 'server_taken' };
  return { staleAssignmentId: active[0].id };
}

// ---- the signed plan ----

const encoder = new TextEncoder();
const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64 = (text: string) => Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function hmac(astro: any, data: string): Promise<string | null> {
  const secret = getEnv(astro, 'PETTO_BOT_API_SECRET');
  if (!secret) return null;
  const key = await crypto.subtle.importKey('raw', encoder.encode(`petto-premium-admin:${secret}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toB64(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(data))));
}

export async function signPlan(astro: any, plan: Plan): Promise<string | null> {
  const body = toB64(encoder.encode(JSON.stringify(plan)));
  const signature = await hmac(astro, body);
  return signature ? `${body}.${signature}` : null;
}

export async function verifyPlan(astro: any, token: string, now = Date.now()): Promise<Plan | null> {
  const [body, signature] = String(token).split('.');
  if (!body || !signature) return null;
  const expected = await hmac(astro, body);
  if (!expected || expected.length !== signature.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const plan = JSON.parse(new TextDecoder().decode(fromB64(body))) as Plan;
    return plan && plan.v === 1 && Number.isFinite(plan.exp) && plan.exp > now ? plan : null;
  } catch {
    return null;
  }
}

export type PreviewResult = (PlanResult & { ok: true; token: string }) | Extract<PlanResult, { ok: false }>;

/** Plans a change and signs the plan: the owner sees it, then the token is what the Confirm button sends. */
export async function previewManualPremium(astro: any, actorId: string, input: PlanInput, now = new Date()): Promise<PreviewResult> {
  const planned = await planManualPremium(astro, actorId, input, now);
  if (!planned.ok) return planned;
  const token = await signPlan(astro, planned.plan);
  return token ? { ...planned, token } : { ok: false, code: 'database' };
}

/** Saves exactly what a signed plan says, after checking again that nothing changed since the owner looked at it. */
export async function confirmManualPremium(astro: any, actorId: string, token: string, acknowledged: boolean, now = new Date()): Promise<GrantResult> {
  if (!isPettoOwner(astro, actorId)) return { ok: false, code: 'invalid' };
  const plan = await verifyPlan(astro, token, now.getTime());
  if (!plan || plan.actor !== actorId) return { ok: false, code: 'stale' };
  if (plan.needsAck && !acknowledged) return { ok: false, code: 'unconfirmed' };
  if (plan.end && new Date(plan.end).getTime() <= now.getTime()) return { ok: false, code: 'past_date' };
  const fresh = await planManualPremium(astro, actorId, {
    mode: plan.mode, targetType: plan.targetType, targetId: plan.targetId, entitlementId: plan.entitlementId ?? undefined,
    duration: plan.duration, date: plan.date, slotLimit: plan.slots,
  }, now);
  if (!fresh.ok) return fresh;
  if (fresh.plan.entitlementId !== plan.entitlementId || fresh.plan.prevEnd !== plan.prevEnd || fresh.plan.prevStatus !== plan.prevStatus || fresh.plan.prevSlots !== plan.prevSlots) {
    return { ok: false, code: 'stale' };
  }
  return applyPlan(astro, actorId, plan, now);
}

/** The quick buttons of a row ("Extend 1 month", "Extend 1 year", "Make permanent"): planned and saved in one step. */
export async function extendManualPremium(astro: any, actorId: string, entitlementId: number, by: string, now = new Date()): Promise<GrantResult> {
  if (!['1m', '1y', 'permanent'].includes(by)) return { ok: false, code: 'invalid' };
  const planned = await planManualPremium(astro, actorId, { mode: 'extend', entitlementId, duration: by }, now);
  if (!planned.ok) return planned;
  return applyPlan(astro, actorId, planned.plan, now);
}

async function applyPlan(astro: any, actorId: string, plan: Plan, now: Date): Promise<GrantResult> {
  const config = settings(astro);
  if (!config) return { ok: false, code: 'database' };
  const { targetType, targetId } = plan;
  const key = grantKey(targetType, targetId);
  const existing = (await read<Existing>(astro, 'premium_entitlements', `provider_subscription_id=eq.${encodeURIComponent(key)}&provider=eq.manual&select=${EXISTING_COLUMNS}&limit=1`))[0] ?? null;
  if ((existing?.id ?? null) !== plan.entitlementId) return { ok: false, code: 'stale' };

  if (existing && targetType === 'user') {
    const assigned = await read<{ id: number }>(astro, 'premium_slot_assignments', `entitlement_id=eq.${existing.id}&status=eq.active&select=id`);
    if (assigned.length > plan.slots) return { ok: false, code: 'slot_conflict' };
  }
  if (targetType === 'server') {
    const taken = await serverTaken(astro, targetId, existing?.id ?? null, now.getTime());
    if (taken.code) return { ok: false, code: taken.code };
    if (taken.staleAssignmentId) {
      const released = await fetch(`${config.url}/rest/v1/premium_slot_assignments?id=eq.${taken.staleAssignmentId}&status=eq.active`, {
        method: 'PATCH',
        headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ status: 'released', released_at: now.toISOString() }),
      });
      if (!released.ok) return { ok: false, code: 'database' };
    }
  }

  const stamp = now.toISOString();
  const { revoked_by: _a, revoked_at: _b, ...kept } = (existing?.metadata ?? {}) as Record<string, unknown>;
  const metadata: Record<string, unknown> = {
    ...kept,
    permanent: plan.end === null,
    duration: plan.duration,
    granted_by: kept.granted_by ?? actorId,
    granted_at: kept.granted_at ?? stamp,
    target_type: targetType,
    target_user_id: targetType === 'user' ? targetId : null,
    target_guild_id: targetType === 'server' ? targetId : null,
    updated_at: stamp,
    ...(existing ? { edited_by: actorId, edited_at: stamp } : {}),
  };
  const fields = {
    // Also when an older grant is edited: the ones saved with the owner as holder (before this) are fixed with the first change.
    ...(targetType === 'user' ? { user_id: plan.internalUserId } : {}),
    plan_key: `premium-manual-${plan.slots}`,
    status: 'active',
    slot_limit: plan.slots,
    current_period_end: plan.end,
    metadata,
    updated_at: stamp,
  };

  let entitlementId = existing?.id ?? null;
  if (existing) {
    // The same row (same id and assignment) is changed; nothing is released or created again.
    const response = await fetch(`${config.url}/rest/v1/premium_entitlements?id=eq.${existing.id}&provider=eq.manual`, {
      method: 'PATCH',
      headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify(fields),
    });
    if (!response.ok) return { ok: false, code: 'database' };
  } else {
    const response = await fetch(`${config.url}/rest/v1/premium_entitlements?on_conflict=provider_subscription_id`, {
      method: 'POST',
      headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify({ user_id: plan.internalUserId, provider: 'manual', provider_subscription_id: key, ...fields }),
    });
    if (!response.ok) return { ok: false, code: 'database' };
    if (targetType !== 'server') return { ok: true };
    const row = await response.json().catch(() => null);
    entitlementId = Array.isArray(row) ? row[0]?.id ?? null : null;
    entitlementId = entitlementId ?? (await read<{ id: number }>(astro, 'premium_entitlements', `provider_subscription_id=eq.${encodeURIComponent(key)}&select=id&limit=1`))[0]?.id ?? null;
  }
  if (targetType !== 'server') return { ok: true };
  if (!entitlementId) return { ok: false, code: 'database' };

  const assignment = await read<{ id: number }>(astro, 'premium_slot_assignments', `entitlement_id=eq.${entitlementId}&guild_id=eq.${encodeURIComponent(targetId)}&select=id&limit=1`);
  const assignmentResponse = assignment[0]
    ? await fetch(`${config.url}/rest/v1/premium_slot_assignments?id=eq.${assignment[0].id}`, {
        method: 'PATCH',
        headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ user_id: plan.internalUserId, status: 'active', released_at: null }),
      })
    : await fetch(`${config.url}/rest/v1/premium_slot_assignments`, {
        method: 'POST',
        headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ entitlement_id: entitlementId, user_id: plan.internalUserId, guild_id: targetId, status: 'active' }),
      });
  return assignmentResponse.ok ? { ok: true } : { ok: false, code: 'database' };
}

export async function revokeManualPremium(astro: any, actorId: string, entitlementId: number): Promise<boolean> {
  if (!isPettoOwner(astro, actorId) || !Number.isInteger(entitlementId)) return false;
  const config = settings(astro);
  if (!config) return false;
  const now = new Date().toISOString();
  const row = (await read<{ metadata: Record<string, unknown> | null }>(astro, 'premium_entitlements', `id=eq.${entitlementId}&provider=eq.manual&select=metadata&limit=1`))[0];
  if (!row) return false;
  const assignments = await read<{ guild_id: string }>(astro, 'premium_slot_assignments', `entitlement_id=eq.${entitlementId}&status=eq.active&select=guild_id`);
  await Promise.all(assignments.map((assignment) => resetGuildPremiumCustomization(astro, assignment.guild_id)));
  const entitlementResponse = await fetch(`${config.url}/rest/v1/premium_entitlements?id=eq.${entitlementId}&provider=eq.manual`, {
    method: 'PATCH',
    headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    // The metadata is kept (who and what the grant was for); only the revoke marks are added.
    body: JSON.stringify({ status: 'expired', current_period_end: now, updated_at: now, metadata: { ...(row.metadata ?? {}), permanent: false, revoked_by: actorId, revoked_at: now } }),
  });
  if (!entitlementResponse.ok) return false;
  const assignmentResponse = await fetch(`${config.url}/rest/v1/premium_slot_assignments?entitlement_id=eq.${entitlementId}&status=eq.active`, {
    method: 'PATCH',
    headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({ status: 'released', released_at: now }),
  });
  return assignmentResponse.ok;
}
