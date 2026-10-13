import { getEnv } from './env';

export interface LeaderboardData {
  source: 'text' | 'voice';
  page: number;
  board: any;
  status: 'ok' | 'missing' | 'down';
}

/**
 * What the public leaderboard page shows: the bot answers only for a server that turned the page on, with the names and pictures it
 * already knows. `status` is 'missing' for a server that is not public (404) and 'down' when the bot could not answer (503).
 */
export async function loadLeaderboard(astro: { locals?: any; url: URL }, slug: string): Promise<LeaderboardData> {
  const source = astro.url.searchParams.get('type') === 'voice' ? 'voice' : 'text';
  const page = Math.max(1, Math.min(20, Math.floor(Number(astro.url.searchParams.get('page'))) || 1));
  const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL')?.replace(/\/+$/, '');
  const apiKey = getEnv(astro, 'PETTO_BOT_API_SECRET');
  const valid = /^[a-z0-9][a-z0-9-]{1,31}$/i.test(slug) || /^\d{15,25}$/.test(slug);
  if (!apiUrl || !apiKey) return { source, page, board: null, status: 'down' };
  if (!valid) return { source, page, board: null, status: 'missing' };
  try {
    const response = await fetch(`${apiUrl}/api/public/leaderboard`, {
      method: 'POST',
      signal: AbortSignal.timeout(6_000),
      headers: { 'Content-Type': 'application/json', 'X-Petto-Dashboard-Key': apiKey, Accept: 'application/json' },
      body: JSON.stringify(/^\d{15,25}$/.test(slug) ? { guildId: slug, source, page } : { slug: slug.toLowerCase(), source, page }),
    });
    if (response.status === 404) return { source, page, board: null, status: 'missing' };
    if (!response.ok) return { source, page, board: null, status: 'down' };
    const board = await response.json();
    return board?.ok ? { source, page, board, status: 'ok' } : { source, page, board: null, status: 'down' };
  } catch {
    return { source, page, board: null, status: 'down' };
  }
}
