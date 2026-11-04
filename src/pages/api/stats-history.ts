import type { APIRoute } from 'astro';
import { loadGlobalHistory } from '../../utils/globalStatsHistory';

export const prerender = false;

/** The daily history of the stats page: one row per day with the totals of every server. Nothing here names a person or a server. */
export const GET: APIRoute = async ({ locals }) => {
  const history = await loadGlobalHistory({ locals });
  return new Response(JSON.stringify(history), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': history.source === 'none' ? 'no-store' : 'public, max-age=60, s-maxage=300' },
  });
};
