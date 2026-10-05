import { getEnv } from './env';

type AstroContext = { locals?: any };

function apiConfig(context: AstroContext) {
  const baseUrl = getEnv(context, 'PETTO_BOT_API_URL')?.replace(/\/$/, '');
  const secret = getEnv(context, 'PETTO_BOT_API_SECRET');
  return { baseUrl, secret };
}

export async function syncPettoPrefix(context: AstroContext, guildId: string, prefix: string) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, error: 'not_configured' as const, payload: null };

  const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/prefix`, {
    method: 'POST',
    headers: {
      'X-Petto-Dashboard-Key': secret,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prefix }),
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
