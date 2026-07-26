import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getGuildInfo } from '../../../../utils/discord';
import { getEnv } from '../../../../utils/env';

export const prerender = false;

const TABLES = [
  'guilds', 'automod_config', 'antinuke_config', 'level_config', 'level_rewards',
  'ticket_categories', 'giveaway_config', 'giveaway_presets', 'log_entries',
  'custom_commands', 'auto_responders', 'sticky_messages', 'reaction_roles', 'disabled_commands',
  'report_config', 'booster_role_config', 'member_events_config', 'verification_config',
  'bump_reminders', 'poj_config', 'poj_channels',
];

export const GET: APIRoute = async (context) => {
  const { id } = context.params as { id: string };
  const botToken = getEnv(context, 'DISCORD_TOKEN');
  const supabaseUrl = getEnv(context, 'SUPABASE_URL');
  const supabaseKey = getEnv(context, 'SUPABASE_SERVICE_ROLE_KEY');

  const auth = await getGuildSession(context, id);
  if ('redirect' in auth) return context.redirect(auth.redirect);

  if (!botToken || !supabaseUrl || !supabaseKey) return new Response('Server not configured', { status: 500 });

  const guildInfo = await getGuildInfo(id, botToken);
  if (!guildInfo) return new Response('Bot not in guild', { status: 404 });

  const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` };
  const results = await Promise.all(
    TABLES.map(async (table) => {
      const res = await fetch(`${supabaseUrl}/rest/v1/${table}?guild_id=eq.${id}&select=*`, { headers });
      return [table, res.ok ? await res.json() : []] as const;
    }),
  );

  const dump: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
    guild_id: id,
    guild_name: guildInfo.name,
  };
  for (const [table, rows] of results) dump[table] = rows;

  return new Response(JSON.stringify(dump, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="petto-${id}-config.json"`,
    },
  });
};
