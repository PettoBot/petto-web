export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';
import { loadModuleStatuses } from '../../../../utils/moduleStatuses';

// Which modules of the server are on, for the side menu (grey when off, a green dot when on). The menu asks for it after the page is drawn, so the page itself
// does not wait for the twenty-odd small reads it takes. The answer is kept for a few seconds for each server (and a read in progress is shared), so many
// pages opened in a row, or many people in the same server, cost the bot one set of reads and not one for each.
const KEEP_MS = 20_000;
const kept = new Map<string, { at: number; states: Record<string, 'on' | 'todo'> }>();
const reading = new Map<string, Promise<Record<string, 'on' | 'todo'>>>();

async function read(apiUrl: string, apiKey: string, id: string): Promise<Record<string, 'on' | 'todo'>> {
  const { statuses } = await loadModuleStatuses(apiUrl, apiKey, id);
  const states: Record<string, 'on' | 'todo'> = {};
  for (const [module, status] of Object.entries(statuses)) if (status.state === 'on' || status.state === 'todo') states[module] = status.state;
  return states;
}

export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return new Response(JSON.stringify({ states: {} }), { status: 401, headers });
  const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(astro, 'PETTO_BOT_API_SECRET');
  if (!apiUrl || !apiKey) return new Response(JSON.stringify({ states: {} }), { headers });
  const now = Date.now();
  const hit = kept.get(id);
  // `?fresh=1`: the person has just turned something on or off, so the kept answer is not used.
  if (hit && now - hit.at < KEEP_MS && astro.url.searchParams.get('fresh') !== '1') return new Response(JSON.stringify({ states: hit.states }), { headers });
  let pending = reading.get(id);
  if (!pending) {
    pending = read(apiUrl, apiKey, id).finally(() => reading.delete(id));
    reading.set(id, pending);
  }
  try {
    const states = await pending;
    kept.set(id, { at: Date.now(), states });
    if (kept.size > 200) for (const key of kept.keys()) { kept.delete(key); if (kept.size <= 100) break; }
    return new Response(JSON.stringify({ states }), { headers });
  } catch {
    return new Response(JSON.stringify({ states: {} }), { headers });
  }
};
