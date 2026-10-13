import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';
import { getCachedBotGuildIds } from '../../utils/discordCache';
import { getServiceStatus } from '../../utils/serviceStatus';

export const prerender = false;

let lastWarm = 0;

/**
 * Heats what the first visitor would otherwise wait for: the list of the bot's servers, the connection to the bot's database and
 * the service check. The server asks for it as it starts and every few minutes, so the first person to open the dashboard finds
 * everything ready. It returns nothing and holds nothing private; it runs at most every 20 seconds.
 */
export const GET: APIRoute = async ({ locals }) => {
  if (Date.now() - lastWarm > 20_000) {
    lastWarm = Date.now();
    const botToken = getEnv({ locals }, 'DISCORD_TOKEN');
    await Promise.allSettled([botToken ? getCachedBotGuildIds(botToken) : Promise.resolve(null), getServiceStatus({ locals })]);
  }
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
};
