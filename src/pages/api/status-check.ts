import type { APIRoute } from 'astro';
import { createHash, timingSafeEqual } from 'node:crypto';
import { getEnv } from '../../utils/env';
import { runStatusCycle } from '../../utils/statusMonitor';

export const prerender = false;

const digest = (text: string) => createHash('sha256').update(text).digest();

/**
 * One round of the site's own status checks. The server asks for it every 2 minutes (server.mjs) with the same secret the site already
 * shares with the bot; anyone else gets a 404. The answer says only how many checks were saved.
 */
export const POST: APIRoute = async ({ locals, request, url }) => {
  const secret = getEnv({ locals }, 'PETTO_BOT_API_SECRET');
  const given = request.headers.get('x-petto-status-key') ?? '';
  if (!secret || !timingSafeEqual(digest(given), digest(secret))) return new Response('Not found', { status: 404 });
  const result = await runStatusCycle({ locals }, url.origin);
  return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
};
