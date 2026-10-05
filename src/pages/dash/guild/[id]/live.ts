import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';

export const prerender = false;

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' },
});

/**
 * The numbers of what is running right now, for the pages that keep themselves up to date: the votes of the open polls and the
 * entries of the running giveaways. The person must manage the server, like on the pages themselves.
 */
export const GET: APIRoute = async (context) => {
  const { id } = context.params as { id: string };
  const session = await getGuildSession(context, id);
  if ('redirect' in session) return json({ error: 'unauthorized' }, 401);
  const apiUrl = getEnv(context, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(context, 'PETTO_BOT_API_SECRET');
  if (!apiUrl || !apiKey) return json({ error: 'not_configured' }, 500);
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, Prefer: 'count=exact' };
  const kind = new URL(context.request.url).searchParams.get('kind');

  try {
    if (kind === 'polls') {
      const pollsRes = await fetch(`${apiUrl}/rest/v1/polls?guild_id=eq.${id}&message_id=neq.pending&select=id,options,closed&order=created_at.desc&limit=20`, { headers });
      const polls: { id: number; options: string[]; closed: boolean }[] = pollsRes.ok ? await pollsRes.json() : [];
      const open = polls.filter((poll) => !poll.closed);
      const votesRes = open.length ? await fetch(`${apiUrl}/rest/v1/poll_votes?poll_id=in.(${open.map((poll) => poll.id).join(',')})&select=poll_id,choices`, { headers }) : null;
      const votes: { poll_id: number; choices: number[] }[] = votesRes?.ok ? await votesRes.json() : [];
      return json({
        polls: polls.map((poll) => {
          const mine = votes.filter((vote) => Number(vote.poll_id) === Number(poll.id));
          const counts = new Array(poll.options.length).fill(0);
          for (const vote of mine) for (const choice of vote.choices ?? []) if (choice >= 0 && choice < counts.length) counts[choice] += 1;
          return { id: poll.id, closed: poll.closed, voters: mine.length, counts };
        }),
      });
    }
    if (kind === 'giveaways') {
      const giveawaysRes = await fetch(`${apiUrl}/rest/v1/giveaways?guild_id=eq.${id}&ended=eq.false&select=id&order=ends_at.asc&limit=50`, { headers });
      const running: { id: number }[] = giveawaysRes.ok ? await giveawaysRes.json() : [];
      const entries = await Promise.all(running.map(async (giveaway) => {
        const res = await fetch(`${apiUrl}/rest/v1/giveaway_entries?giveaway_id=eq.${giveaway.id}&select=user_id&limit=1`, { headers });
        return { id: giveaway.id, entries: res.ok ? Number(res.headers.get('content-range')?.split('/')[1] ?? 0) : 0 };
      }));
      return json({ giveaways: entries, running: running.map((giveaway) => giveaway.id) });
    }
    return json({ error: 'unknown_kind' }, 400);
  } catch {
    return json({ error: 'unavailable' }, 502);
  }
};
