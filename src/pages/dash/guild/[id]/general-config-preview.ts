import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { buildConfigYaml } from '../../../../utils/configYaml';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { id } = context.params as { id: string };
  const botToken = process.env.DISCORD_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const auth = await getGuildSession(context, id);
  if ('redirect' in auth) return new Response('Unauthorized', { status: 401 });

  if (!botToken || !supabaseUrl || !supabaseKey) return new Response('Server not configured', { status: 500 });

  const yaml = await buildConfigYaml(id, botToken, supabaseUrl, supabaseKey);
  if (yaml === null) return new Response('Bot not in guild', { status: 404 });

  return new Response(yaml, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
