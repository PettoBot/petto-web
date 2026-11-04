export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { sessionAnswer } from '../../utils/navAccount.mjs';

/**
 * Who is signed in, for the profile of the top bar: a name and a picture, nothing else. The pages of the site are kept by the CDN, so
 * the bar asks this once after it loads. A visitor gets a normal answer with no user, and no answer is ever kept by anyone.
 */
export const GET: APIRoute = async (context) => {
  let session = null;
  try {
    session = await getDashboardSession(context);
  } catch {
    session = null;
  }
  return new Response(JSON.stringify(sessionAnswer(session)), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Cookie' },
  });
};
