export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';
import { hasPremiumForGuild } from '../../../../utils/premium';

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}

function headers(supabaseKey: string) {
  return { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' };
}

async function auth(astro: any, id: string) {
  const result = await getGuildSession(astro, id);
  return 'redirect' in result ? null : result.session;
}

export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const session = await auth(astro, id);
  if (!session) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  const supabaseUrl = getEnv(astro, 'SUPABASE_URL')!;
  const supabaseKey = getEnv(astro, 'SUPABASE_SERVICE_ROLE_KEY')!;
  const url = new URL(astro.request.url);

  if (url.searchParams.has('list')) {
    const res = await fetch(`${supabaseUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: headers(supabaseKey) });
    const rows = res.ok ? await res.json() : [];
    return new Response(JSON.stringify(rows.map((r: any) => r.name)), { headers: { 'Content-Type': 'application/json' } });
  }

  const name = url.searchParams.get('name');
  if (!name) return new Response(JSON.stringify({ error: 'missing name' }), { status: 400 });
  const res = await fetch(`${supabaseUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}&select=name,data`, { headers: headers(supabaseKey) });
  const rows = res.ok ? await res.json() : [];
  if (!rows[0]) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
  return new Response(JSON.stringify(rows[0]), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const session = await auth(astro, id);
  if (!session) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  const premiumActive = await hasPremiumForGuild(astro, session.userId, id);

  const supabaseUrl = getEnv(astro, 'SUPABASE_URL')!;
  const supabaseKey = getEnv(astro, 'SUPABASE_SERVICE_ROLE_KEY')!;
  const body = await astro.request.json().catch(() => ({}));
  const action = String(body.action ?? '');

  if (action === 'create') {
    const name = normalizeName(String(body.name ?? '').trim().slice(0, 40));
    if (!name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400 });
    const listRes = await fetch(`${supabaseUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name`, { headers: headers(supabaseKey) });
    if (!listRes.ok) return new Response(JSON.stringify({ error: "Couldn't check the embed theme limit." }), { status: 500 });
    const current = await listRes.json();
    const limit = premiumActive ? 30 : 3;
    if (current.length >= limit) {
      return new Response(JSON.stringify({ error: premiumActive ? 'You have reached the 30 embed theme limit.' : 'The Free plan includes 3 embed themes. Premium unlocks 30.' }), { status: 403 });
    }
    const res = await fetch(`${supabaseUrl}/rest/v1/embed_templates`, {
      method: 'POST',
      headers: { ...headers(supabaseKey), Prefer: 'return=minimal' },
      body: JSON.stringify({ guild_id: id, name, data: { content: '', embeds: [], buttons: [] } }),
    });
    if (!res.ok) return new Response(JSON.stringify({ error: 'A template with that name already exists.' }), { status: 409 });
    return new Response(JSON.stringify({ ok: true, name }), { headers: { 'Content-Type': 'application/json' } });
  }

  if (action === 'save') {
    const name = String(body.name ?? '');
    if (!name) return new Response(JSON.stringify({ error: 'missing name' }), { status: 400 });
    const res = await fetch(`${supabaseUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, {
      method: 'PATCH',
      headers: { ...headers(supabaseKey), Prefer: 'return=minimal' },
      body: JSON.stringify({ data: body.data ?? {}, updated_at: new Date().toISOString() }),
    });
    return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 500 });
  }

  if (action === 'delete') {
    const name = String(body.name ?? '');
    if (!name) return new Response(JSON.stringify({ error: 'missing name' }), { status: 400 });
    const res = await fetch(`${supabaseUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: { ...headers(supabaseKey), Prefer: 'return=representation' },
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
