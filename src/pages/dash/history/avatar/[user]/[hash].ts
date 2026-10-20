export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../../../../utils/dashAuth';
import { callPettoHistoryAvatar } from '../../../../../utils/pettoBotApi';

const ID = /^\d{15,25}$/;
const HASH = /^(a_)?[0-9a-f]{32}$/;

// The copy Petto kept of an old avatar of the profile history (Discord stops serving an avatar soon after it is changed). Only for a
// visitor who is logged in, with the page's rules, checked by the bot: your own history, or somebody else's unless they turned it off.
// The hash names the picture for good, so the browser keeps it (privately: who may see it can change, and it can be deleted).
export const GET: APIRoute = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session) return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const { user, hash } = astro.params as { user: string; hash: string };
  if (!ID.test(user) || !HASH.test(hash)) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  const response = await callPettoHistoryAvatar(astro, user, hash, String(session.userId));
  if (!response || !response.ok) {
    const status = response && [401, 404, 429].includes(response.status) ? (response.status === 401 ? 502 : response.status) : 502;
    return new Response('Not found', { status, headers: { 'Cache-Control': 'no-store' } });
  }
  const type = response.headers.get('Content-Type') ?? '';
  if (!/^image\/(webp|png)$/.test(type)) return new Response('Not found', { status: 502, headers: { 'Cache-Control': 'no-store' } });
  return new Response(await response.arrayBuffer(), { headers: {
    'Content-Type': type,
    'Cache-Control': 'private, max-age=31536000, immutable',
    ETag: `"${hash}"`,
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; sandbox",
  } });
};
