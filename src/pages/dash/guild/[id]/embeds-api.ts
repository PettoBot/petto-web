export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';
import { validateTemplate } from '../../../../utils/embedSchema';
import { buildDiscordMessage, sendTestMessage } from '../../../../utils/embedSend';
import { getGuildList } from '../../../../utils/discord';

// A few test sends per minute per person is plenty, and keeps the button from being used to spam.
const recentSends = new Map<string, number[]>();
function tooManySends(userId: string): boolean {
  const now = Date.now();
  const recent = (recentSends.get(userId) ?? []).filter((at) => now - at < 60_000);
  if (recent.length >= 6) { recentSends.set(userId, recent); return true; }
  recent.push(now);
  recentSends.set(userId, recent);
  return false;
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}

function headers(apiKey: string) {
  return { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
}

async function auth(astro: any, id: string) {
  const result = await getGuildSession(astro, id);
  return 'redirect' in result ? null : result.session;
}

export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const session = await auth(astro, id);
  if (!session) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL')!;
  const apiKey = getEnv(astro, 'PETTO_BOT_API_SECRET')!;
  const url = new URL(astro.request.url);

  if (url.searchParams.has('list')) {
    const res = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: headers(apiKey) });
    const rows = res.ok ? await res.json() : [];
    return new Response(JSON.stringify(rows.map((r: any) => r.name)), { headers: { 'Content-Type': 'application/json' } });
  }

  const name = url.searchParams.get('name');
  if (!name) return new Response(JSON.stringify({ error: 'missing name' }), { status: 400 });
  const res = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}&select=name,data`, { headers: headers(apiKey) });
  const rows = res.ok ? await res.json() : [];
  if (!rows[0]) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
  return new Response(JSON.stringify(rows[0]), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const session = await auth(astro, id);
  if (!session) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL')!;
  const apiKey = getEnv(astro, 'PETTO_BOT_API_SECRET')!;
  const body = await astro.request.json().catch(() => ({}));
  const action = String(body.action ?? '');

  if (action === 'create') {
    const name = normalizeName(String(body.name ?? '').trim().slice(0, 40));
    if (!name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400 });
    let imported: unknown = null;
    if (body.data !== undefined) {
      const checked = validateTemplate(body.data);
      if (!checked.ok) return new Response(JSON.stringify({ error: checked.error }), { status: 400 });
      imported = checked.data;
    }
    const res = await fetch(`${apiUrl}/rest/v1/embed_templates`, {
      method: 'POST',
      headers: { ...headers(apiKey), Prefer: 'return=minimal' },
      body: JSON.stringify({ guild_id: id, name, data: imported ?? { content: '', embeds: [], buttons: [] } }),
    });
    if (!res.ok) return new Response(JSON.stringify({ error: 'A template with that name already exists.' }), { status: 409 });
    return new Response(JSON.stringify({ ok: true, name }), { headers: { 'Content-Type': 'application/json' } });
  }

  if (action === 'save') {
    const name = String(body.name ?? '');
    if (!name) return new Response(JSON.stringify({ error: 'missing name' }), { status: 400 });
    const checked = validateTemplate(body.data);
    if (!checked.ok) return new Response(JSON.stringify({ error: checked.error }), { status: 400 });
    const res = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, {
      method: 'PATCH',
      headers: { ...headers(apiKey), Prefer: 'return=minimal' },
      body: JSON.stringify({ data: checked.data, updated_at: new Date().toISOString() }),
    });
    return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 500 });
  }

  if (action === 'delete') {
    const name = String(body.name ?? '');
    if (!name) return new Response(JSON.stringify({ error: 'missing name' }), { status: 400 });
    const res = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: { ...headers(apiKey), Prefer: 'return=representation' },
    });
    if (res.ok) {
      const deleted = await res.json().catch(() => []);
      if (!Array.isArray(deleted) || deleted.length === 0) {
        return new Response(JSON.stringify({ error: 'template not found' }), { status: 404 });
      }
    }
    return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 500 });
  }

  if (action === 'test_send') {
    const botToken = getEnv(astro, 'DISCORD_TOKEN');
    if (!botToken) return new Response(JSON.stringify({ error: 'The bot is not configured.' }), { status: 503 });
    if (tooManySends(String(session.userId))) return new Response(JSON.stringify({ error: 'Too many test messages, wait a minute and try again.' }), { status: 429 });
    const checked = validateTemplate(body.data);
    if (!checked.ok) return new Response(JSON.stringify({ error: checked.error }), { status: 400 });

    const channelId = String(body.channel_id ?? '');
    const toDm = channelId === '' || channelId === 'dm';
    if (!toDm) {
      // Only channels of this server are valid targets, so a test can never post somewhere else.
      const channelsRes = await getGuildList(astro, id, botToken, 'channels');
      const channels = channelsRes.ok ? await channelsRes.json() : [];
      if (!Array.isArray(channels) || !channels.some((c: any) => c.id === channelId)) {
        return new Response(JSON.stringify({ error: 'That channel is not in this server.' }), { status: 400 });
      }
    }

    const guildRes = await fetch(`https://discord.com/api/guilds/${id}?with_counts=true`, { headers: { Authorization: `Bot ${botToken}` } });
    const guild = guildRes.ok ? await guildRes.json() : null;
    const userId = String(session.userId);
    const message = buildDiscordMessage(checked.data, {
      userId,
      userName: String(session.username ?? 'you'),
      serverName: guild?.name ?? 'this server',
      memberCount: guild?.approximate_member_count ?? null,
    }, {
      userAvatar: session.avatar ?? null,
      serverIcon: guild?.icon ? `https://cdn.discordapp.com/icons/${id}/${guild.icon}.png?size=256` : null,
    });
    const result = await sendTestMessage(botToken, message, toDm ? { dmUserId: userId } : { channelId });
    return new Response(JSON.stringify(result.ok ? { ok: true } : { error: result.error }), { status: result.ok ? 200 : 502, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400 });
};
