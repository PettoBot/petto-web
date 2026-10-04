export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { isPettoOwner } from '../../utils/premiumAdmin';
import { getEnv } from '../../utils/env';
import { buildInfo } from '../../utils/buildInfo';
import { readGuildSnapshot } from '../../utils/guildSnapshots';

/**
 * For the owner only: where the time goes and why. Which build is running, whether the database is reachable from this host and how fast,
 * whether the bot's saved copy of the servers is there (and has its columns), and how fast the bot API and Discord answer.
 * Never prints a secret, only whether it is set. Open `/dash/health?guild=<server id>` to also see what is saved for one server.
 */
export const GET: APIRoute = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return new Response('Not found', { status: 404 });

  const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(astro, 'PETTO_BOT_API_SECRET');
  const botToken = getEnv(astro, 'DISCORD_TOKEN');
  const timed = async (run: () => Promise<Record<string, unknown>>) => {
    const started = Date.now();
    try {
      const result = await run();
      return { ...result, ms: Date.now() - started };
    } catch (error) {
      return { ok: false, ms: Date.now() - started, error: String((error as Error)?.message ?? error).slice(0, 200) };
    }
  };

  const report: Record<string, unknown> = {
    build: buildInfo,
    environment: {
      PETTO_BOT_API_URL: Boolean(apiUrl),
      PETTO_BOT_API_SECRET: Boolean(apiKey),
      DISCORD_TOKEN: Boolean(botToken),
      DISCORD_CLIENT_ID: Boolean(getEnv(astro, 'DISCORD_CLIENT_ID')),
      DISCORD_CLIENT_SECRET: Boolean(getEnv(astro, 'DISCORD_CLIENT_SECRET')),
      PETTO_DATABASE_URL: Boolean(getEnv(astro, 'PETTO_DATABASE_URL')),
    },
  };

  report.directDatabase = __DIRECT_DB__
    ? await (await import('../../utils/directDb')).checkDirectDatabase()
    : { configured: false, note: 'This is the Cloudflare build, it never reads the database directly.' };

  const headers = apiKey ? { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'X-Petto-Dashboard-Key': apiKey } : {};
  report.savedServersThroughTheWebPath = apiUrl && apiKey
    ? await timed(async () => {
        const res = await fetch(`${apiUrl}/rest/v1/discord_guild_snapshots?select=guild_id&limit=1`, { headers });
        return { ok: res.ok, status: res.status, answeredBy: res.headers.get('x-petto-source') === 'database' ? 'database (direct)' : 'bot API' };
      })
    : { ok: false, error: 'PETTO_BOT_API_URL or PETTO_BOT_API_SECRET is not set' };
  report.botApi = apiUrl && apiKey
    ? await timed(async () => {
        const res = await fetch(`${apiUrl}/api/dashboard/variables`, { headers: { 'X-Petto-Dashboard-Key': apiKey, Accept: 'application/json' }, signal: AbortSignal.timeout(4000) });
        return { ok: res.ok, status: res.status };
      })
    : { ok: false, error: 'not configured' };
  report.discordBotToken = botToken
    ? await timed(async () => {
        const res = await fetch('https://discord.com/api/v10/users/@me', { headers: { Authorization: `Bot ${botToken}` }, signal: AbortSignal.timeout(4000) });
        return { ok: res.ok, status: res.status, ...(res.ok ? {} : { answer: (await res.text()).replace(/\s+/g, ' ').slice(0, 120) }) };
      })
    : { ok: false, error: 'DISCORD_TOKEN is not set' };

  const guildId = new URL(astro.request.url).searchParams.get('guild');
  if (guildId) {
    const copy = await readGuildSnapshot(guildId);
    report.savedServer = copy
      ? { found: true, name: copy.name, members: copy.memberCount, channels: copy.channels.length, roles: copy.roles.length, emojis: copy.emojiCount, boosts: copy.boostCount, botNick: copy.botNick }
      : { found: false, note: 'Nothing saved for this server (or it could not be read): pages then ask Discord.' };
  }

  return new Response(JSON.stringify(report, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
};
