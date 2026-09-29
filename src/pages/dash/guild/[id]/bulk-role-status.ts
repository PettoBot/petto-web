import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { id } = context.params as { id: string };
  const session = await getGuildSession(context, id);
  if ('redirect' in session) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  const apiUrl = getEnv(context, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(context, 'PETTO_BOT_API_SECRET');
  if (!apiUrl || !apiKey) return new Response(JSON.stringify({ error: 'server not configured' }), { status: 500 });

  const res = await fetch(`${apiUrl}/rest/v1/bulk_role_jobs?guild_id=eq.${id}&order=created_at.desc&limit=1`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
  });
  const rows = res.ok ? await res.json() : [];
  const row = rows[0] ?? null;
  const job = row && {
    id: row.id,
    action: row.action,
    targetRoleId: row.target_role_id,
    status: row.status,
    totalMembers: row.total_members,
    processedMembers: row.processed_members,
    successCount: row.success_count,
    errorCount: row.error_count,
    errorMessage: row.error_message,
  };

  return new Response(JSON.stringify({ job }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
    },
  });
};
