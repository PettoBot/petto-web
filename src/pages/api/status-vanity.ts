import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

// The public status of the separate Vanity bot. The bot answers without a key and the snapshot holds no secrets,
// this route only hides where the bot lives and keeps the browser on the same origin.
export const GET: APIRoute = async ({ locals }) => {
  const base = getEnv({ locals }, 'VANITY_BOT_API_URL');
  if (!base) return json({ state: 'unknown' }, 503);
  try {
    const res = await fetch(`${base.replace(/\/+$/, '')}/api/status`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    const raw = await res.text();
    let data: any = null;
    try { data = JSON.parse(raw); } catch {}
    if (!data || typeof data.state !== 'string') return json({ state: 'unknown' }, 502);
    return json({
      state: data.state,
      discord: data.discord,
      database: data.database,
      guilds: Number(data.guilds) || 0,
      latency_ms: Number(data.latency_ms) || 0,
      uptime_seconds: Number(data.uptime_seconds) || 0,
      version: String(data.version ?? ''),
      updated_at: String(data.updated_at ?? ''),
    });
  } catch (e) {
    return json({ state: 'unknown' }, 502);
  }
};
