import type { APIRoute } from 'astro';
import { getStatusHistory } from '../../utils/statusHistory';

export const prerender = false;

/** The 90 day history and the state of each service now, for the status page. Nothing private is in it; it is kept 60 seconds. */
export const GET: APIRoute = async ({ locals }) => {
  const history = await getStatusHistory({ locals });
  return new Response(JSON.stringify(history), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': history.available ? 'public, max-age=30, s-maxage=60, stale-while-revalidate=300' : 'no-store',
    },
  });
};
