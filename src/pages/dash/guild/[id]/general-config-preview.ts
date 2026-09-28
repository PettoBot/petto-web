import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { buildConfigYaml } from '../../../../utils/configYaml';
import { getEnv } from '../../../../utils/env';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { id } = context.params as { id: string };
  const botToken = getEnv(context, 'DISCORD_TOKEN');
  const apiUrl = getEnv(context, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(context, 'PETTO_BOT_API_SECRET');

  const auth = await getGuildSession(context, id);
  if ('redirect' in auth) return new Response('Unauthorized', { status: 401 });

  if (!botToken || !apiUrl || !apiKey) return new Response('Server not configured', { status: 500 });

  const yaml = await buildConfigYaml(id, botToken, apiUrl, apiKey);
  if (yaml === null) return new Response('Bot not in guild', { status: 404 });

  return new Response(yaml, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
