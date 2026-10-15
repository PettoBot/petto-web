// Link names of the appeal pages when two servers want the same one: the requests the team reviews, and the names the team can free.
import { getEnv } from './env';
import { slugProblem } from './appealSlug';

export interface NameClaim {
  id: string; guild_id: string; slug: string; user_id: string; username: string; reason: string; server_url: string; extra_url: string | null;
  status: 'pending' | 'approved' | 'denied' | 'cancelled'; note: string | null; decided_by: string | null; decided_by_name: string | null; created_at: string; decided_at: string | null;
}
export interface NamedServer { guild_id: string; slug: string; enabled: boolean; updated_at: string }

/** How long a name stays reserved for the server that changed or dropped it. */
export const RESERVE_DAYS = 30;
export async function reservationOf(ctx: any, slug: string): Promise<string | null> {
  const now = encodeURIComponent(new Date().toISOString());
  return (await rows<{ guild_id: string }>(ctx, `appeal_name_reservations?slug=eq.${encodeURIComponent(slug)}&reserved_until=gt.${now}&select=guild_id&limit=1`))?.[0]?.guild_id ?? null;
}
export async function reserveName(ctx: any, slug: string, guildId: string): Promise<boolean> {
  const until = new Date(Date.now() + RESERVE_DAYS * 86_400_000).toISOString();
  const res = await rest(ctx, 'appeal_name_reservations?on_conflict=slug', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ slug, guild_id: guildId, reserved_until: until }) });
  return Boolean(res?.ok);
}
export async function dropReservation(ctx: any, slug: string): Promise<void> {
  await rest(ctx, `appeal_name_reservations?slug=eq.${encodeURIComponent(slug)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
}

export const CLAIM_LIMITS = { reasonMin: 20, reasonMax: 1000, url: 300, perMonth: 5 };
export type ClaimError = 'slug' | 'taken_gone' | 'pending' | 'limit' | 'reason' | 'url' | 'extra_url' | 'database' | 'not_configured';

function conn(ctx: any) {
  const url = getEnv(ctx, 'PETTO_BOT_API_URL')?.replace(/\/+$/, '');
  const key = getEnv(ctx, 'PETTO_BOT_API_SECRET');
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } as Record<string, string> } : null;
}
async function rest(ctx: any, path: string, init: RequestInit = {}): Promise<Response | null> {
  const c = conn(ctx);
  if (!c) return null;
  try { return await fetch(`${c.url}/rest/v1/${path}`, { ...init, headers: { ...c.headers, ...(init.headers as Record<string, string> | undefined) }, signal: AbortSignal.timeout(8000) }); } catch { return null; }
}
async function rows<T>(ctx: any, path: string): Promise<T[] | null> {
  const res = await rest(ctx, path);
  return res?.ok ? ((await res.json()) as T[]) : null;
}

const https = (value: string) => { try { return new URL(value).protocol === 'https:'; } catch { return false; } };
const clean = (value: unknown, max: number) => String(value ?? '').replace(/\u0000/g, '').trim().slice(0, max);

/** The request a server has open, or null. */
export async function openClaim(ctx: any, guildId: string): Promise<NameClaim | null> {
  return (await rows<NameClaim>(ctx, `appeal_name_claims?guild_id=eq.${guildId}&status=eq.pending&select=*&limit=1`))?.[0] ?? null;
}
/** The last answered request of a server. */
export async function lastDecidedClaim(ctx: any, guildId: string): Promise<NameClaim | null> {
  return (await rows<NameClaim>(ctx, `appeal_name_claims?guild_id=eq.${guildId}&status=in.(approved,denied)&select=*&order=decided_at.desc&limit=1`))?.[0] ?? null;
}

export async function createClaim(ctx: any, input: { guildId: string; slug: string; userId: string; username: string; reason: unknown; serverUrl: unknown; extraUrl: unknown }): Promise<{ ok: true; claim: NameClaim } | { ok: false; error: ClaimError }> {
  if (!conn(ctx)) return { ok: false, error: 'not_configured' };
  if (slugProblem(input.slug, false)) return { ok: false, error: 'slug' };
  const reason = clean(input.reason, CLAIM_LIMITS.reasonMax);
  if (reason.length < CLAIM_LIMITS.reasonMin) return { ok: false, error: 'reason' };
  const serverUrl = clean(input.serverUrl, CLAIM_LIMITS.url);
  if (!https(serverUrl)) return { ok: false, error: 'url' };
  const extra = clean(input.extraUrl, CLAIM_LIMITS.url);
  if (extra && !https(extra)) return { ok: false, error: 'extra_url' };
  if (await openClaim(ctx, input.guildId)) return { ok: false, error: 'pending' };
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const recent = await rows<{ id: string }>(ctx, `appeal_name_claims?guild_id=eq.${input.guildId}&created_at=gte.${encodeURIComponent(since)}&select=id`);
  if ((recent?.length ?? 0) >= CLAIM_LIMITS.perMonth) return { ok: false, error: 'limit' };
  // The name has to be held by someone: if it was freed in the meantime, the server can simply take it.
  const holder = await rows<{ guild_id: string }>(ctx, `appeal_config?slug=eq.${encodeURIComponent(input.slug)}&select=guild_id&limit=1`);
  if (holder && !holder.length && !(await reservationOf(ctx, input.slug))) return { ok: false, error: 'taken_gone' };
  const res = await rest(ctx, 'appeal_name_claims', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ guild_id: input.guildId, slug: input.slug, user_id: input.userId, username: clean(input.username, 80), reason, server_url: serverUrl, extra_url: extra || null }) });
  if (!res) return { ok: false, error: 'database' };
  if (res.status === 409) return { ok: false, error: 'pending' };
  if (!res.ok) return { ok: false, error: 'database' };
  const claim = ((await res.json()) as NameClaim[])[0];
  void notifyTeam(ctx, claim);
  return { ok: true, claim };
}

export async function cancelClaim(ctx: any, guildId: string): Promise<boolean> {
  const res = await rest(ctx, `appeal_name_claims?guild_id=eq.${guildId}&status=eq.pending`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'cancelled', decided_at: new Date().toISOString() }) });
  return Boolean(res?.ok);
}

export async function listClaims(ctx: any, filter: 'pending' | 'decided'): Promise<NameClaim[]> {
  const query = filter === 'pending' ? 'status=eq.pending&order=created_at.asc&limit=100' : 'status=in.(approved,denied)&order=decided_at.desc&limit=30';
  return (await rows<NameClaim>(ctx, `appeal_name_claims?${query}&select=*`)) ?? [];
}
export async function countPendingClaims(ctx: any): Promise<number> {
  const res = await rows<{ id: string }>(ctx, 'appeal_name_claims?status=eq.pending&select=id&limit=200');
  return res?.length ?? 0;
}

export async function holderOf(ctx: any, slug: string): Promise<string | null> {
  return (await rows<{ guild_id: string }>(ctx, `appeal_config?slug=eq.${encodeURIComponent(slug)}&select=guild_id&limit=1`))?.[0]?.guild_id ?? null;
}

/** Gives the name to the server that asked: the current holder goes back to its server id link, then the name is set. */
export async function approveClaim(ctx: any, claimId: string, by: { id: string; name: string }, note: string): Promise<{ ok: true } | { ok: false; error: 'gone' | 'database' }> {
  const claim = (await rows<NameClaim>(ctx, `appeal_name_claims?id=eq.${claimId}&status=eq.pending&select=*`))?.[0];
  if (!claim) return { ok: false, error: 'gone' };
  const holder = await holderOf(ctx, claim.slug);
  if (holder && holder !== claim.guild_id) {
    const freed = await rest(ctx, `appeal_config?guild_id=eq.${holder}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ slug: null }) });
    if (!freed?.ok) return { ok: false, error: 'database' };
  }
  const set = await rest(ctx, 'appeal_config?on_conflict=guild_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ guild_id: claim.guild_id, slug: claim.slug, updated_at: new Date().toISOString() }) });
  if (!set?.ok) return { ok: false, error: 'database' };
  await dropReservation(ctx, claim.slug);
  const done = await rest(ctx, `appeal_name_claims?id=eq.${claimId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'approved', note: clean(note, 500) || null, decided_by: by.id, decided_by_name: clean(by.name, 80), decided_at: new Date().toISOString() }) });
  return done?.ok ? { ok: true } : { ok: false, error: 'database' };
}

export async function denyClaim(ctx: any, claimId: string, by: { id: string; name: string }, note: string): Promise<boolean> {
  const res = await rest(ctx, `appeal_name_claims?id=eq.${claimId}&status=eq.pending`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'denied', note: clean(note, 500) || null, decided_by: by.id, decided_by_name: clean(by.name, 80), decided_at: new Date().toISOString() }) });
  return Boolean(res?.ok);
}

export async function listNames(ctx: any, query: string): Promise<NamedServer[]> {
  const q = query.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 32);
  const filter = q ? `&slug=ilike.*${q}*` : '';
  return (await rows<NamedServer>(ctx, `appeal_config?slug=not.is.null${filter}&select=guild_id,slug,enabled,updated_at&order=slug.asc&limit=100`)) ?? [];
}
export async function releaseName(ctx: any, guildId: string): Promise<boolean> {
  const res = await rest(ctx, `appeal_config?guild_id=eq.${guildId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ slug: null }) });
  return Boolean(res?.ok);
}

/** A message in the channel of the team when a request arrives, if a webhook is set (APPEAL_CLAIMS_WEBHOOK_URL). Nothing breaks without it. */
async function notifyTeam(ctx: any, claim: NameClaim): Promise<void> {
  const hook = getEnv(ctx, 'APPEAL_CLAIMS_WEBHOOK_URL');
  if (!hook || !https(hook)) return;
  const site = getEnv(ctx, 'PUBLIC_SITE_URL') ?? 'https://petto.sbs';
  try {
    await fetch(hook, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(6000),
      body: JSON.stringify({ username: 'Petto', allowed_mentions: { parse: [] }, embeds: [{ title: `Name request: ${claim.slug}`, color: 0xf0a88f, description: `${claim.username} (\`${claim.user_id}\`) asks for **${claim.slug}**.\n\n${claim.reason.slice(0, 600)}\n\n[Server](${claim.server_url}) · [Review it](${site}/dash/appeal-names)` }] }),
    });
  } catch { /* The team still sees the request on the page. */ }
}
