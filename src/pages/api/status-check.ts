import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';
import { runStatusCycle } from '../../utils/statusMonitor';

export const prerender = false;

// Web Crypto, which the server and the Cloudflare build both have (a Node built-in cannot be bundled for the Worker): both texts are hashed to the same length and the
// hashes are compared without stopping at the first difference.
const digest = async (text: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
function sameDigest(a: Uint8Array, b: Uint8Array): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

/**
 * One round of the site's own status checks. The server asks for it every 2 minutes (server.mjs) with the same secret the site already
 * shares with the bot; anyone else gets a 404. The answer says only how many checks were saved.
 */
export const POST: APIRoute = async ({ locals, request, url }) => {
  const secret = getEnv({ locals }, 'PETTO_BOT_API_SECRET');
  const given = request.headers.get('x-petto-status-key') ?? '';
  if (!secret || !sameDigest(await digest(given), await digest(secret))) return new Response('Not found', { status: 404 });
  const result = await runStatusCycle({ locals }, url.origin);
  return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
};
