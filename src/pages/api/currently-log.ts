import type { APIRoute } from 'astro';
import log from '../../data/currentlyLog.json';

export const prerender = false;

/**
 * The Currently log: the changes of Petto, as the bot reads them (every few minutes) to post the new ones in its channel. The file is src/data/currentlyLog.json,
 * so a change of the web or of the bot reaches Discord when this site is deployed, with no change to the bot. The pictures it names are in public/assets/log/.
 */
export const GET: APIRoute = () => new Response(JSON.stringify(log), {
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=60, s-maxage=60', 'Access-Control-Allow-Origin': '*' },
});
