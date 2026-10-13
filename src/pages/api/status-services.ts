import type { APIRoute } from 'astro';
import { getServiceStatus } from '../../utils/serviceStatus';

export const prerender = false;

/** The live state of the website, the dashboard, the database, Discord and the bot, for the status page. Nothing private is in it. */
export const GET: APIRoute = async ({ locals }) => {
  const report = await getServiceStatus({ locals });
  return new Response(JSON.stringify(report), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
};
