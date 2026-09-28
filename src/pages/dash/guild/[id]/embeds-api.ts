export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';

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
    const res = await fetch(`${apiUrl}/rest/v1/embed_templates`, {
      method: 'POST',
      headers: { ...headers(apiKey), Prefer: 'return=minimal' },
      body: JSON.stringify({ guild_id: id, name, data: { content: '', embeds: [], buttons: [] } }),
    });
    if (!res.ok) return new Response(JSON.stringify({ error: 'A template with that name already exists.' }), { status: 409 });
    return new Response(JSON.stringify({ ok: true, name }), { headers: { 'Content-Type': 'application/json' } });
  }

  if (action === 'save') {
    const name = String(body.name ?? '');
    if (!name) return new Response(JSON.stringify({ error: 'missing name' }), { status: 400 });
    const res = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, {
      method: 'PATCH',
      headers: { ...headers(apiKey), Prefer: 'return=minimal' },
      body: JSON.stringify({ data: body.data ?? {}, updated_at: new Date().toISOString() }),
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

  return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400 });
};
