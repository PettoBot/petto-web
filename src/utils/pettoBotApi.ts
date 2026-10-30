import { getEnv } from './env';
import { getGuildSession } from './dashAuth';
import { pageDecision } from './dashAccess';

/**
 * Members who reach a page through "Dashboard access" by role (not Manage Server) can use the bot-backed actions of that page: the site
 * says so with `X-Petto-Dashboard-Grant: <page>:<view|edit>`, only after its own check of their roles allowed the page. The bot does
 * not take the site's word alone: it reads the same rules (dash_access) and the member's roles itself (petto-bot
 * src/web/dashboardRoleAccess.js). Managers send nothing, so nothing changes for them.
 */
async function roleGrant(context: AstroContext, guildId: string, page: string, write: boolean): Promise<Record<string, string>> {
  try {
    const auth: any = await getGuildSession(context, guildId);
    if (!auth || !('access' in auth) || !auth.access) return {};
    const decision = pageDecision(auth.access, page);
    if (!decision.allowed || (write && !decision.canEdit)) return {};
    return { 'X-Petto-Dashboard-Grant': `${page}:${write ? 'edit' : 'view'}` };
  } catch {
    return {};
  }
}

type AstroContext = { locals?: any };

function apiConfig(context: AstroContext) {
  const baseUrl = getEnv(context, 'PETTO_BOT_API_URL')?.replace(/\/$/, '');
  const secret = getEnv(context, 'PETTO_BOT_API_SECRET');
  return { baseUrl, secret };
}

/** Tells the bot the whole list of prefixes of a server (it validates and saves it too, and uses it at once). */
export async function syncPettoPrefix(context: AstroContext, guildId: string, prefixes: string | string[]) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, error: 'not_configured' as const, payload: null };

  const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/prefix`, {
    method: 'POST',
    headers: {
      'X-Petto-Dashboard-Key': secret,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Array.isArray(prefixes) ? { prefixes } : { prefix: prefixes }),
  });
  let payload: any = null;
  try { payload = await response.json(); } catch { /* Keep the original HTTP status. */ }
  return { ok: response.ok && payload?.ok !== false, error: payload?.error ?? null, payload };
}

/** Tells the bot a server changed its language, so it is used at once and not when the bot's own 5 minutes run out. The database already has it. */
export async function syncPettoLanguage(context: AstroContext, guildId: string, language: string) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, error: 'not_configured' as const, payload: null };
  const response = await fetch(`${baseUrl}/internal/guild-language`, {
    method: 'POST',
    headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ guildId, language }),
    signal: AbortSignal.timeout(5000),
  });
  let payload: any = null;
  try { payload = await response.json(); } catch { /* Keep the original HTTP status. */ }
  return { ok: response.ok && payload?.ok !== false, error: payload?.error ?? null, payload };
}

/** The routes of commands written in code: the pieces of the editor, check, test, save and trigger. */
export async function callPettoCode(context: AstroContext, guildId: string, userId: string, route: 'meta' | 'check' | 'test' | 'save' | 'trigger', body?: Record<string, unknown>) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, payload: { ok: false, error: 'not_configured' } as any };
  const url = `${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/code/${route}${body ? '' : `?user_id=${encodeURIComponent(userId)}`}`;
  try {
    const response = await fetch(url, {
      method: body ? 'POST' : 'GET',
      // A bot that does not answer must not leave the editor waiting for ever.
      signal: AbortSignal.timeout(12_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify({ ...body, user_id: userId }) } : {}),
    });
    let payload: any = null;
    try { payload = await response.json(); } catch { /* Keep the HTTP status. */ }
    return { ok: response.ok, status: response.status, payload };
  } catch {
    return { ok: false, status: 502, payload: { ok: false, error: 'bot_unavailable' } as any };
  }
}

export async function callPettoVault(context: AstroContext, guildId: string, userId: string, init: RequestInit = {}) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, error: 'not_configured' as const, payload: null };

  const headers = new Headers(init.headers);
  headers.set('X-Petto-Dashboard-Key', secret);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');

  const query = init.method === 'GET' || !init.method ? `?user_id=${encodeURIComponent(userId)}` : '';
  const response = await fetch(`${baseUrl}/api/dashboard/vault/${encodeURIComponent(guildId)}${query}`, { ...init, headers });
  let payload: any = null;
  try { payload = await response.json(); } catch { /* Keep the original HTTP status. */ }
  return { ok: response.ok && payload?.ok !== false, error: payload?.error ?? null, payload };
}

/** One step of a restore (`status`, `preview`, `challenge`, `start`, `cancel`) on the bot: it answers what to show, or why not. */
export async function callPettoVaultRestore(context: AstroContext, guildId: string, userId: string, step: string, init: { method?: 'GET' | 'POST'; query?: Record<string, string>; body?: Record<string, unknown> } = {}) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, payload: { ok: false, error: 'not_configured' } as any };
  const method = init.method ?? 'GET';
  const query = new URLSearchParams({ ...(init.query ?? {}), ...(method === 'GET' ? { user_id: userId } : {}) });
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/vault/${encodeURIComponent(guildId)}/restore/${encodeURIComponent(step)}${query.size ? `?${query}` : ''}`, {
      method,
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}) },
      ...(method === 'POST' ? { body: JSON.stringify({ ...(init.body ?? {}), user_id: userId }) } : {}),
      signal: AbortSignal.timeout(20_000),
    });
    let payload: any = null;
    try { payload = await response.json(); } catch { /* Keep the HTTP status. */ }
    return { ok: response.ok && payload?.ok !== false, status: response.status, payload };
  } catch {
    return { ok: false, status: 502, payload: { ok: false, error: 'bot_unavailable' } as any };
  }
}

export async function exportPettoVaultBackup(context: AstroContext, guildId: string, userId: string, backupId: string) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return new Response('Petto Vault is not configured.', { status: 503 });
  const response = await fetch(`${baseUrl}/api/dashboard/vault/${encodeURIComponent(guildId)}/export/${encodeURIComponent(backupId)}?user_id=${encodeURIComponent(userId)}`, {
    headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json' },
  });
  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
      'Content-Disposition': response.headers.get('content-disposition') ?? `attachment; filename="petto-backup-${guildId}-${backupId}.json"`,
    },
  });
}

/** The image card routes of the bot. `init.body` may be JSON text or raw picture bytes. */
export async function callPettoCards(context: AstroContext, guildId: string, userId: string, path: string, init: RequestInit & { contentType?: string } = {}) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  const { contentType, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set('X-Petto-Dashboard-Key', secret);
  if (rest.body) headers.set('Content-Type', contentType ?? 'application/json');
  const separator = path.includes('?') ? '&' : '?';
  return fetch(`${baseUrl}/api/dashboard/cards/${encodeURIComponent(guildId)}${path}${separator}user_id=${encodeURIComponent(userId)}`, { ...rest, headers });
}

/** The poll message as the bot draws it (its card or the saved V2 design), or null so the dashboard draws its own. */
export async function renderPollMessage(context: AstroContext, guildId: string, poll: Record<string, unknown>, counts: number[], voters: number): Promise<{ flags: number; components: any[] } | null> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/poll-message`, {
      method: 'POST',
      signal: AbortSignal.timeout(6_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ poll, counts, voters }),
    });
    const payload: any = await response.json().catch(() => null);
    const message = payload?.payload;
    return response.ok && payload?.ok && Array.isArray(message?.components) ? message : null;
  } catch {
    return null;
  }
}

/** Starts, changes, ends or draws again a giveaway through the bot, as the person who manages the server. */
export async function callPettoGiveaway(context: AstroContext, guildId: string, userId: string, action: 'start' | 'edit' | 'end' | 'reroll', body: Record<string, unknown>): Promise<{ ok: boolean; error?: string; message?: string; winners?: string[] }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, error: 'not_configured', message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/giveaway/${action}`, {
      method: 'POST',
      signal: AbortSignal.timeout(15_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    if (response.ok && payload?.ok) return payload;
    return { ok: false, error: String(payload?.error ?? 'unavailable'), message: typeof payload?.message === 'string' ? payload.message : undefined };
  } catch {
    return { ok: false, error: 'unavailable', message: 'The bot did not answer in time.' };
  }
}

/** Sends the quest method of a server now (the newest active quest, or the one given), as the person who manages the server. */
export async function callPettoQuestMethod(context: AstroContext, guildId: string, userId: string, questId?: string): Promise<{ ok: boolean; message: string }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/quests/method`, {
      method: 'POST',
      signal: AbortSignal.timeout(15_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ quest_id: questId || undefined, user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === 'string' ? payload.message : response.ok ? 'Sent.' : 'The bot could not send it.' };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

/** Sets the verification up, posts its panel or switches it, now, through the bot, as the person who manages the server. */
/** How far a verification job of the bot is (setting it up edits every channel of the server, which can take a while). */
export interface VerificationJob { id: string; action: string; status: 'running' | 'done' | 'failed'; phase: string; done: number; total: number; percent: number; ok: boolean | null; message: string | null }
export interface VerificationAnswer { ok: boolean; message: string; status?: string; job?: VerificationJob | null }

/**
 * The buttons of the verification card. The bot answers within a moment and never waits for the long work: a quick action comes back
 * done, a long one comes back `status: 'running'` with its job, and the page asks `callPettoVerificationJob` until it ends.
 */
export async function callPettoVerification(context: AstroContext, guildId: string, userId: string, action: 'setup' | 'panel' | 'enable' | 'disable'): Promise<VerificationAnswer> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/verification/${action}`, {
      method: 'POST',
      signal: AbortSignal.timeout(8_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return {
      ok: Boolean(response.ok && payload?.ok),
      message: typeof payload?.message === 'string' ? payload.message : response.ok ? 'Done.' : 'The bot could not do it.',
      status: typeof payload?.status === 'string' ? payload.status : undefined,
      job: payload?.job ?? null,
    };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

/** The verification job of a server (or null when there is none), and whether members can get a verification link. */
export async function callPettoVerificationJob(context: AstroContext, guildId: string, userId: string): Promise<{ ok: boolean; job: VerificationJob | null; link: { ok: boolean; problem: string | null; lettersInstead: boolean } | null }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, job: null, link: null };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/verification/job?user_id=${encodeURIComponent(userId)}`, {
      signal: AbortSignal.timeout(5_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json' },
    });
    const payload: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), job: payload?.job ?? null, link: payload?.link ?? null };
  } catch {
    return { ok: false, job: null, link: null };
  }
}

/** Posts (or updates) the panel of the confessions of a server in a channel. */
export async function callPettoConfessionPanel(context: AstroContext, guildId: string, userId: string, channelId: string | null): Promise<{ ok: boolean; message: string }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/confessions/panel`, {
      method: 'POST',
      signal: AbortSignal.timeout(25_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, channel_id: channelId }),
    });
    const payload: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === 'string' ? payload.message : response.ok ? 'Done.' : 'The bot could not do it.' };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

/** The answer of the staff to a suggestion (approve, deny, consider, implement, pending), made by the bot right away. */
export async function callPettoSuggestionAnswer(context: AstroContext, guildId: string, userId: string, id: string, status: string, reason: string): Promise<{ ok: boolean; message: string }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/suggestions/answer`, {
      method: 'POST',
      signal: AbortSignal.timeout(25_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, id, status, reason }),
    });
    const payload: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === 'string' ? payload.message : response.ok ? 'Done.' : 'The bot could not do it.' };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

/** Who voted a suggestion (the staff only): the names in favor and against. */
export async function callPettoSuggestionVotes(context: AstroContext, guildId: string, userId: string, id: string): Promise<{ ok: boolean; message?: string; up?: { id: string; name: string }[]; down?: { id: string; name: string }[]; upTotal?: number; downTotal?: number }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/suggestions/votes`, {
      method: 'POST',
      signal: AbortSignal.timeout(25_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, id }),
    });
    const payload: any = await response.json().catch(() => null);
    return response.ok && payload?.ok ? payload : { ok: false, message: typeof payload?.message === 'string' ? payload.message : 'The bot could not do it.' };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

/** The signed link to the saved transcript of a ticket, for the dashboard. */
export async function callPettoTicketTranscript(context: AstroContext, guildId: string, userId: string, number: number): Promise<{ ok: boolean; message?: string; link?: string }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/tickets/transcript`, {
      method: 'POST',
      signal: AbortSignal.timeout(25_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, number }),
    });
    const payload: any = await response.json().catch(() => null);
    return response.ok && payload?.ok ? payload : { ok: false, message: typeof payload?.message === 'string' ? payload.message : 'The bot could not do it.' };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

/** Puts back what an anti-nuke protection stopped (the owner and the administrators only; the bot checks it). */
export async function callPettoAntinukeRestore(context: AstroContext, guildId: string, userId: string, id: number): Promise<{ ok: boolean; message?: string; done?: string[]; failed?: string[] }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/antinuke/restore`, {
      method: 'POST',
      signal: AbortSignal.timeout(40_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, id }),
    });
    const payload: any = await response.json().catch(() => null);
    return payload && typeof payload === 'object' && 'ok' in payload ? { ok: Boolean(payload.ok), message: typeof payload.message === 'string' ? payload.message : undefined, done: payload.done, failed: payload.failed } : { ok: false, message: 'The bot could not do it.' };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

export interface NativeRule { id: string; name: string; enabled: boolean; kind: string; patterns: number; official: boolean; mine: boolean; block: boolean; alertChannelId: string | null; timeoutMinutes: number; }
export interface NativeResult { ok: boolean; message?: string; rules?: NativeRule[]; used?: Record<string, number>; limits?: Record<string, number>; rule?: { id: string; name: string } }

/** The AutoMod rules of Discord made from the templates: op is list, add, toggle or delete. */
export async function callPettoNativeAutomod(context: AstroContext, guildId: string, userId: string, body: Record<string, unknown>): Promise<NativeResult> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/automod/native`, {
      method: 'POST',
      signal: AbortSignal.timeout(30_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return response.ok && payload?.ok ? payload : { ok: false, message: typeof payload?.message === 'string' ? payload.message : 'The bot could not do it.' };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

/** Lifts an active sanction (ban, mute or jail) from its case number. */
export async function callPettoLiftSanction(context: AstroContext, guildId: string, userId: string, caseNumber: number, reason: string): Promise<{ ok: boolean; message?: string }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/moderation/lift`, {
      method: 'POST',
      signal: AbortSignal.timeout(30_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, case: caseNumber, reason }),
    });
    const payload: any = await response.json().catch(() => null);
    return response.ok && payload?.ok ? { ok: true } : { ok: false, message: typeof payload?.message === 'string' ? payload.message : 'The bot could not do it.' };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

/** Starts or ends a lockdown now. */
export async function callPettoLockdown(context: AstroContext, guildId: string, userId: string, body: Record<string, unknown>): Promise<{ ok: boolean; message?: string; locked?: number; restored?: number; failed?: number }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/lockdown`, {
      method: 'POST',
      signal: AbortSignal.timeout(60_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return response.ok && payload?.ok ? payload : { ok: false, message: typeof payload?.message === 'string' ? payload.message : 'The bot could not do it.' };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

/** The staff side of appeals, from the dashboard: accept or reject a submission, or write to the member. */
export async function callPettoAppeals(context: AstroContext, guildId: string, userId: string, route: 'resolve' | 'reply', body: Record<string, unknown>) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, payload: { ok: false, message: 'not_configured' } as any };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/appeals/${route}`, {
      method: 'POST', signal: AbortSignal.timeout(20_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    let payload: any = null;
    try { payload = await response.json(); } catch { /* keep the status */ }
    return { ok: response.ok && payload?.ok !== false, status: response.status, payload };
  } catch {
    return { ok: false, status: 502, payload: { ok: false, message: 'bot_unavailable' } as any };
  }
}

/** The pictures of an appeal page: the dashboard uploads and removes them as the person, the public site reads them with the key alone. */
export async function callPettoAppealImage(context: AstroContext, guildId: string, kind: string, init: RequestInit & { contentType?: string; userId?: string } = {}) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  const { contentType, userId, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set('X-Petto-Dashboard-Key', secret);
  if (rest.body && contentType) headers.set('Content-Type', contentType);
  const path = userId
    ? `/api/dashboard/guild/${encodeURIComponent(guildId)}/appeals/image/${encodeURIComponent(kind)}?user_id=${encodeURIComponent(userId)}`
    : `/api/appeals/${encodeURIComponent(guildId)}/image/${encodeURIComponent(kind)}`;
  try { return await fetch(`${baseUrl}${path}`, { ...rest, headers, signal: AbortSignal.timeout(20_000) }); } catch { return null; }
}

/**
 * The files members attach to the answers of an appeal form, kept by the bot. The member (public site) uploads, removes and reads their own
 * with `/api/appeals/...`; the staff read them with `/api/dashboard/guild/.../appeals/files/...` after the dashboard checked the server.
 */
export async function callPettoAppealFile(
  context: AstroContext, guildId: string, userId: string,
  init: { method?: 'GET' | 'POST' | 'DELETE'; fileId?: string; staff?: boolean; query?: Record<string, string | number>; body?: ArrayBuffer; contentType?: string } = {},
): Promise<Response | null> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  const params = new URLSearchParams({ user_id: userId });
  for (const [key, value] of Object.entries(init.query ?? {})) params.set(key, String(value));
  const base = init.staff ? `/api/dashboard/guild/${encodeURIComponent(guildId)}/appeals/files` : `/api/appeals/${encodeURIComponent(guildId)}/files`;
  const path = `${base}${init.fileId ? `/${encodeURIComponent(init.fileId)}` : ''}?${params}`;
  const headers: Record<string, string> = { 'X-Petto-Dashboard-Key': secret, Accept: '*/*' };
  if (init.body) headers['Content-Type'] = init.contentType ?? 'application/octet-stream';
  try { return await fetch(`${baseUrl}${path}`, { method: init.method ?? 'GET', headers, body: init.body, signal: AbortSignal.timeout(30_000) }); } catch { return null; }
}

/**
 * The kept copy of an avatar of the profile history (/dash/history). `viewerId` is the person looking, from the login: the bot shows your
 * own history and somebody else's unless they turned it off, the same rules as the page. A 404 means there is no copy (yet, or ever).
 */
export async function callPettoHistoryAvatar(context: AstroContext, userId: string, hash: string, viewerId: string): Promise<Response | null> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  const path = `/api/dashboard/history/avatar/${encodeURIComponent(userId)}/${encodeURIComponent(hash)}?viewer_id=${encodeURIComponent(viewerId)}`;
  try { return await fetch(`${baseUrl}${path}`, { headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'image/*' }, signal: AbortSignal.timeout(15_000) }); } catch { return null; }
}

/** Makes the bot save its copy of the server (roles, channels) now, so the lists in the dashboard show what was just made in Discord. */
export async function callPettoResync(context: AstroContext, guildId: string, userId: string): Promise<{ ok: boolean; message?: string }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: 'The dashboard is not connected to the bot.' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/resync`, {
      method: 'POST',
      signal: AbortSignal.timeout(20_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === 'string' ? payload.message : undefined };
  } catch {
    return { ok: false, message: 'The bot did not answer in time.' };
  }
}

/** Members of a server whose name starts with `query` (at most 10), for the dashboard's "pick a person" boxes. */
export async function callPettoMemberSearch(context: AstroContext, guildId: string, userId: string, query: string): Promise<Array<{ id: string; username: string | null; displayName: string | null; avatar: string | null }>> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret || query.trim().length < 2) return [];
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/members/search`, {
      method: 'POST',
      signal: AbortSignal.timeout(12_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return response.ok && payload?.ok && Array.isArray(payload.members) ? payload.members : [];
  } catch {
    return [];
  }
}

/**
 * Forms, from the dashboard: accept or deny a submission (`review`), post a panel (`panel`), or list submissions (`submissions`, with
 * the pending count per form, how many the server keeps and its retention). The bot answers in `lang`.
 */
export async function callPettoForms(context: AstroContext, guildId: string, userId: string, route: 'review' | 'panel' | 'submissions', body: Record<string, unknown>, lang = 'en'): Promise<{ ok: boolean; message: string; url?: string | null; data?: any }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: '' };
  try {
    const grant = await roleGrant(context, guildId, 'forms', route !== 'submissions');
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/forms/${route}`, {
      method: 'POST', signal: AbortSignal.timeout(25_000),
      headers: { ...grant, 'X-Petto-Dashboard-Key': secret, 'X-Petto-Language': lang, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === 'string' ? payload.message : '', url: payload?.url ?? null, data: payload };
  } catch {
    return { ok: false, message: '' };
  }
}

// Live counters from the dashboard: the values for the previews, create, quick setup, refresh now and delete. The saved settings
// of a counter are changed by the dashboard straight in the database; these need the bot (Discord channels and the rename budget).
export async function callPettoCounters(context: AstroContext, guildId: string, userId: string, route: 'preview' | 'create' | 'setup' | 'refresh' | 'delete' | 'announce' | 'reorder', body: Record<string, unknown> = {}, lang = 'en'): Promise<{ ok: boolean; message: string; data?: any }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: '' };
  try {
    const grant = await roleGrant(context, guildId, 'counters', route !== 'preview');
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/counters/${route}`, {
      method: 'POST', signal: AbortSignal.timeout(route === 'preview' ? 6_000 : 25_000),
      headers: { ...grant, 'X-Petto-Dashboard-Key': secret, 'X-Petto-Language': lang, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === 'string' ? payload.message : '', data: payload };
  } catch {
    return { ok: false, message: '' };
  }
}

// Feeds from the dashboard (petto-bot src/web/feedRoutes.js): look up an account, follow it, change a feed, stop following, post a test
// notice, and the card as it will be posted. The list of feeds itself is read by the page from the database.
export type FeedsRoute = 'resolve' | 'search' | 'create' | 'update' | 'delete' | 'test' | 'preview';
export async function callPettoFeeds(context: AstroContext, guildId: string, userId: string, route: FeedsRoute, body: Record<string, unknown> = {}, lang = 'en'): Promise<{ ok: boolean; status: number; message: string; data: any }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, message: '', data: null };
  try {
    const grant = await roleGrant(context, guildId, 'feeds', route !== 'resolve' && route !== 'search' && route !== 'preview');
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/feeds/${route}`, {
      method: 'POST', signal: AbortSignal.timeout(route === 'create' || route === 'test' ? 25_000 : 12_000),
      headers: { ...grant, 'X-Petto-Dashboard-Key': secret, 'X-Petto-Language': lang, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    const data: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && data?.ok), status: response.status, message: typeof data?.message === 'string' ? data.message : '', data };
  } catch {
    return { ok: false, status: 502, message: '', data: null };
  }
}

// A form filled on the website (petto.sbs/form/<public id>, never the number of the form): the bot says whether the signed-in member may send it, and takes the answers through
// the same pipeline as a Discord submission. `look` needs no member (pass an empty user id): only how the page of the form looks, for the
// page before the login and the link preview of /form/<public id>.
export async function callPettoWebForm(context: AstroContext, formId: string, userId: string, route: 'public' | 'submit' | 'look', body: Record<string, unknown> = {}, lang = 'en'): Promise<{ ok: boolean; status: number; data: any }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, data: null };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/form/${encodeURIComponent(formId)}/${route}`, {
      method: 'POST', signal: AbortSignal.timeout(route === 'submit' ? 25_000 : route === 'look' ? 5_000 : 8_000),
      headers: { 'X-Petto-Dashboard-Key': secret, 'X-Petto-Language': lang, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(route === 'look' ? body : { ...body, user_id: userId }),
    });
    const data: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && data?.ok), status: response.status, data };
  } catch {
    return { ok: false, status: 502, data: null };
  }
}

/**
 * The Honeypot page: add a bait channel (or change its punishment), remove one, choose its message and post it again. The bot checks
 * the same as `!honeypot` (Administrator, the channel and its own permissions there) and answers a message in the dashboard's language.
 */
export async function callPettoHoneypot(context: AstroContext, guildId: string, userId: string, action: 'add' | 'remove' | 'panel' | 'post' | 'dm', body: Record<string, unknown>, lang = 'en'): Promise<{ ok: boolean; message: string; code?: string; honeypot?: any }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: '' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/honeypot/${action}`, {
      method: 'POST', signal: AbortSignal.timeout(25_000),
      headers: { 'X-Petto-Dashboard-Key': secret, 'X-Petto-Language': lang, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === 'string' ? payload.message : '', code: typeof payload?.code === 'string' ? payload.code : payload?.error, honeypot: payload?.honeypot };
  } catch {
    return { ok: false, message: '' };
  }
}

/**
 * Invite tracking from the Invites tab of Statistics: a role for a number of invites, bonus invites, a reset and the days under which a
 * join is fake. The bot checks the same as `/invites` (the roles it and the member can give, Administrator for a reset) and answers in
 * the dashboard's language.
 */
export async function callPettoInvites(context: AstroContext, guildId: string, userId: string, action: 'reward' | 'unreward' | 'bonus' | 'reset' | 'fake_days', body: Record<string, unknown>, lang = 'en'): Promise<{ ok: boolean; message: string; code?: string }> {
  return callPettoAction(context, guildId, userId, 'stats', `invites/${action}`, body, lang);
}

/** "Send now" of a timer (Automation, Timers), like `!timer run`: the bot sends it at once and its schedule does not change. */
export async function callPettoTimerRun(context: AstroContext, guildId: string, userId: string, timerId: string, lang = 'en'): Promise<{ ok: boolean; message: string; code?: string }> {
  return callPettoAction(context, guildId, userId, 'automation', `timers/${encodeURIComponent(timerId)}/run`, {}, lang);
}

/** The case log of Moderation: a new reason for a case, or delete it, like `/case edit` and `/case delete` (written to the sanctions log). */
export async function callPettoCases(context: AstroContext, guildId: string, userId: string, action: 'edit' | 'delete', body: Record<string, unknown>, lang = 'en'): Promise<{ ok: boolean; message: string; code?: string }> {
  return callPettoAction(context, guildId, userId, 'moderation', `cases/${action}`, body, lang);
}

/**
 * Paginated messages of the Embeds page: post one from saved embeds, stop one (its buttons come off, or the message is deleted) and put
 * the buttons back, like `!pagination`. The bot checks Manage Messages, the channel and the pages, and answers in the dashboard's language.
 */
export async function callPettoPagination(context: AstroContext, guildId: string, userId: string, action: 'create' | 'delete' | 'restore', body: Record<string, unknown>, lang = 'en'): Promise<{ ok: boolean; message: string; code?: string }> {
  return callPettoAction(context, guildId, userId, 'embeds', `pagination/${action}`, body, lang);
}

async function callPettoAction(context: AstroContext, guildId: string, userId: string, page: string, route: string, body: Record<string, unknown>, lang: string): Promise<{ ok: boolean; message: string; code?: string }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: '' };
  try {
    const grant = await roleGrant(context, guildId, page, true);
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/${route}`, {
      method: 'POST', signal: AbortSignal.timeout(20_000),
      headers: { ...grant, 'X-Petto-Dashboard-Key': secret, 'X-Petto-Language': lang, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === 'string' ? payload.message : '', code: typeof payload?.code === 'string' ? payload.code : payload?.error };
  } catch {
    return { ok: false, message: '' };
  }
}

export interface BoosterRoleInfo {
  user_id: string; role_id: string; exists: boolean; name: string | null; color: string | null; color2: string | null; icon: string | null;
  editable: boolean; shared_with: string[]; in_server: boolean | null; boosting: boolean | null; created_at: string | null;
}

/**
 * The Booster roles page: the list (every booster role with its Discord role and whether its owner still boosts) and the changes in
 * Discord (create or change a member's role, its icon, link an existing role, delete, clean up). The bot checks the same as
 * `!boosterrole admin` (Manage Server, its own Manage Roles) and answers a message in the dashboard's language.
 */
export async function callPettoBoosterRoles(context: AstroContext, guildId: string, userId: string, action: 'list' | 'set' | 'icon' | 'remove' | 'link' | 'cleanup', body: Record<string, unknown> = {}, lang = 'en'): Promise<{ ok: boolean; message: string; code?: string; data?: any }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: '' };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/boosterroles/${action}`, {
      method: 'POST', signal: AbortSignal.timeout(action === 'list' ? 8_000 : 25_000),
      headers: { 'X-Petto-Dashboard-Key': secret, 'X-Petto-Language': lang, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    const payload: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === 'string' ? payload.message : '', code: typeof payload?.code === 'string' ? payload.code : payload?.error, data: payload };
  } catch {
    return { ok: false, message: '' };
  }
}

export type TicketLiveRoute = 'list' | 'messages' | 'reply' | 'claim' | 'unclaim' | 'add' | 'remove' | 'close';

/**
 * Live tickets (Tickets → Live tickets): the open tickets, the last messages of one, and what the staff does with it. The two reads are
 * asked every few seconds while the view is open, so they wait little (a slow answer is skipped and the next one comes soon); the bot
 * checks the staff of the ticket for every action. A member let in by role sends the grant of the Tickets page.
 */
export async function callPettoTicketLive(context: AstroContext, guildId: string, userId: string, route: TicketLiveRoute, body: Record<string, unknown> = {}, lang = 'en'): Promise<{ ok: boolean; status: number; data: any }> {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, data: { ok: false, code: 'not_configured' } };
  const write = route !== 'list' && route !== 'messages';
  try {
    const grant = await roleGrant(context, guildId, 'tickets', write);
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/tickets/live/${route}`, {
      method: 'POST', signal: AbortSignal.timeout(write ? 12_000 : 4_000),
      headers: { ...grant, 'X-Petto-Dashboard-Key': secret, 'X-Petto-Language': lang, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, user_id: userId }),
    });
    const data: any = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && data?.ok), status: response.status, data: data ?? { ok: false } };
  } catch {
    return { ok: false, status: 504, data: { ok: false, code: 'bot_unavailable' } };
  }
}
