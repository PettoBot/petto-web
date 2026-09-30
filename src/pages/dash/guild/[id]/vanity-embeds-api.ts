export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { validateTemplate, emptyTemplate } from '../../../../utils/embedSchema';
import { fromVanityTemplate, toVanityTemplate } from '../../../../utils/vanityEmbeds';
import { getVanityOverview, getVanityEmbed, vanityAction } from '../../../../utils/vanityBot';

// Same contract as embeds-api.ts, so the dashboard's message editor works with both bots, but the messages
// live in the Vanity bot. The bot checks the user's permissions again on every call.

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}

async function auth(astro: any, id: string) {
  const result = await getGuildSession(astro, id);
  return 'redirect' in result ? null : result.session;
}

export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const session = await auth(astro, id);
  if (!session) return json({ error: 'unauthorized' }, 401);
  const url = new URL(astro.request.url);

  if (url.searchParams.has('list')) {
    const overview = await getVanityOverview(astro, id, session.userId);
    return json(overview.ok ? overview.data.embeds : []);
  }

  const name = url.searchParams.get('name');
  if (!name) return json({ error: 'missing name' }, 400);
  const result = await getVanityEmbed(astro, id, session.userId, name);
  if (!result.ok) return json({ error: result.message }, result.status === 404 ? 404 : 502);
  return json({ name: result.data.name, data: fromVanityTemplate(result.data.template) });
};

export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const session = await auth(astro, id);
  if (!session) return json({ error: 'unauthorized' }, 401);
  const body = await astro.request.json().catch(() => ({}));
  const action = String(body.action ?? '');

  if (action === 'create') {
    const name = normalizeName(String(body.name ?? '').trim().slice(0, 40));
    if (!name) return json({ error: 'name required' }, 400);
    let data = emptyTemplate();
    if (body.data !== undefined) {
      const checked = validateTemplate(body.data);
      if (!checked.ok) return json({ error: checked.error }, 400);
      data = checked.data;
    }
    const existing = await getVanityEmbed(astro, id, session.userId, name);
    if (existing.ok) return json({ error: 'A template with that name already exists.' }, 409);
    const result = await vanityAction(astro, id, session.userId, { action: 'embed_save', name, template: toVanityTemplate(data) });
    if (!result.ok) return json({ error: result.message }, result.status === 409 ? 409 : 400);
    return json({ ok: true, name });
  }

  if (action === 'save') {
    const name = String(body.name ?? '');
    if (!name) return json({ error: 'missing name' }, 400);
    const checked = validateTemplate(body.data);
    if (!checked.ok) return json({ error: checked.error }, 400);
    const result = await vanityAction(astro, id, session.userId, { action: 'embed_save', name, template: toVanityTemplate(checked.data) });
    if (!result.ok) return json({ error: result.message }, 400);
    return json({ ok: true });
  }

  if (action === 'delete') {
    const name = String(body.name ?? '');
    if (!name) return json({ error: 'missing name' }, 400);
    const result = await vanityAction(astro, id, session.userId, { action: 'embed_delete', name });
    if (!result.ok) return json({ error: result.message }, result.status === 404 ? 404 : 409);
    return json({ ok: true });
  }

  // Messages from this bot are sent by the Vanity bot itself, so there is no test send from here.
  return json({ error: 'unknown action' }, 400);
};
