import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';
import { cleanShowcase } from '../../utils/showcase';

export const prerender = false;

function json(body: unknown, status = 200, cache = 'no-store') {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache },
  });
}

/** The servers of the carousel of the home page: the list the bot keeps in the row of the public numbers (500 members or more, at most 15). Public, no person is named. */
export const GET: APIRoute = async ({ locals }) => {
  const botApiUrl = getEnv({ locals }, 'PETTO_BOT_API_URL');
  const botApiSecret = getEnv({ locals }, 'PETTO_BOT_API_SECRET');
  if (!botApiUrl || !botApiSecret) return json({ servers: [] }, 200, 'public, max-age=30');

  try {
    const response = await fetch(`${botApiUrl}/rest/v1/global_stats?id=eq.main&select=data,updated_at`, {
      headers: {
        apikey: botApiSecret,
        Authorization: `Bearer ${botApiSecret}`,
        'X-Petto-Dashboard-Key': botApiSecret,
        Accept: 'application/json',
      },
    });
    if (!response.ok) return json({ servers: [] }, 200, 'public, max-age=30');
    const rows = await response.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    return json({ servers: cleanShowcase(row?.data?.showcase), updatedAt: row?.updated_at ?? null }, 200, 'public, max-age=30, s-maxage=60');
  } catch {
    return json({ servers: [] }, 200, 'public, max-age=30');
  }
};
