export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../../utils/dashAuth';
import { callPettoWebForm } from '../../../utils/pettoBotApi';
import { PUBLIC_ID, descriptionHtml, imageUrl } from '../../../utils/forms';

// The data of a form filled on the website (the page /form#<public id> is the same static page for every form and asks here):
// GET says who is logged in and what the bot answers for that member (the form, whether they may send it, and why not);
// POST sends the answers. Both go to the bot's public routes of a form (POST /api/dashboard/form/:publicId/public|submit).
const LANGS: Record<string, string> = { en: 'en', es: 'es', 'pt-BR': 'pt-BR', pt: 'pt-BR', 'pt-br': 'pt-BR' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store' } });

function shape(data: any) {
  const form = data?.form;
  if (!form) return null;
  return {
    ...form,
    questions: (Array.isArray(form.questions) ? form.questions : []).map((q: any) => ({
      ...q, image: imageUrl(q?.image), description_html: q?.description ? descriptionHtml(q.description) : '',
    })),
  };
}

export const GET: APIRoute = async (context) => {
  const id = String(context.params.id ?? '');
  if (!PUBLIC_ID.test(id)) return json({ ok: false, code: 'not_found' }, 404);
  const lang = LANGS[context.url.searchParams.get('lang') ?? ''] ?? 'en';
  const session = await getDashboardSession(context);
  if (!session) return json({ ok: false, logged: false }, 401);
  const shown = await callPettoWebForm(context, id, session.userId, 'public', {}, lang);
  const form = shape(shown.data);
  if (!form) return json({ ok: false, logged: true, status: shown.status, code: shown.status === 404 ? 'not_found' : 'unavailable' }, shown.status === 404 ? 404 : 502);
  return json({ ok: true, logged: true, user: { username: session.username }, form, server: shown.data.server ?? null, can: Boolean(shown.data.can), code: shown.data.code ?? null, reason: shown.data.reason ?? null });
};

export const POST: APIRoute = async (context) => {
  const id = String(context.params.id ?? '');
  if (!PUBLIC_ID.test(id)) return json({ ok: false, code: 'not_found' }, 404);
  // Only this site's own page sends answers: a page of another site cannot send them as the member.
  const origin = context.request.headers.get('origin');
  if (!origin || origin !== context.url.origin) return json({ ok: false, code: 'origin' }, 403);
  const lang = LANGS[context.url.searchParams.get('lang') ?? ''] ?? 'en';
  const session = await getDashboardSession(context);
  if (!session) return json({ ok: false, logged: false }, 401);
  const body: any = await context.request.json().catch(() => null);
  const raw = body?.values && typeof body.values === 'object' ? body.values : {};
  const values: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(raw).slice(0, 60)) {
    if (!/^[a-z0-9_-]{1,40}$/i.test(key)) continue;
    if (Array.isArray(value)) values[key] = value.slice(0, 30).map((v) => String(v).slice(0, 100));
    else if (typeof value === 'string') values[key] = value.slice(0, 5000);
  }
  const result = await callPettoWebForm(context, id, session.userId, 'submit', { values }, lang);
  if (result.ok) return json({ ok: true, number: Number(result.data.number), message: String(result.data.message ?? '') });
  if (Array.isArray(result.data?.errors)) return json({ ok: false, errors: result.data.errors.map((e: any) => ({ id: String(e.id), message: String(e.message) })) }, 400);
  return json({ ok: false, code: result.data?.code ?? null, message: String(result.data?.message ?? '') }, result.status >= 400 ? result.status : 502);
};
