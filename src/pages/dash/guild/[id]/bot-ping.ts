export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { pingPettoBot } from '../../../../utils/pettoBotApi';

/**
 * Is the bot there? The dashboard asks it when an action has had no answer for a few seconds (scripts/bot-wait.js): a bot that answers here is
 * only slow, so the page keeps waiting; one that does not is away (restarting), so the page stops and says so. A look at its home page, no key.
 */
export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return new Response(JSON.stringify({ up: true }), { status: 401, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  return new Response(JSON.stringify({ up: await pingPettoBot(astro) }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
};
