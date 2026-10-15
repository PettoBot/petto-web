export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';
import { callPettoAppeals } from '../../../../utils/pettoBotApi';
import { chatHtml } from '../../../../utils/appealChat';
import { getDashLang, makeT } from '../../../../i18n/dash';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' } });
const UUID = /^[0-9a-f-]{36}$/i;

async function allowed(astro: any) {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return { error: json({ ok: false, error: 'unauthorized' }, 401) };
  return { id, session: auth.session };
}

// The conversations of the appeals the staff has open on the page: asked every few seconds, so a message of the member shows up by itself.
export const GET: APIRoute = async (astro) => {
  const checked = await allowed(astro);
  if ('error' in checked) return checked.error;
  const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(astro, 'PETTO_BOT_API_SECRET');
  if (!apiUrl || !apiKey) return json({ ok: false, error: 'not_configured' }, 503);
  const ids = String(astro.url.searchParams.get('ids') ?? '').split(',').filter((v) => UUID.test(v)).slice(0, 20);
  if (!ids.length) return json({ ok: true, items: {} });
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
  const list = ids.join(',');
  const [subsRes, msgsRes] = await Promise.all([
    fetch(`${apiUrl}/rest/v1/appeal_submissions?guild_id=eq.${checked.id}&id=in.(${list})&select=id,username,status`, { headers }),
    fetch(`${apiUrl}/rest/v1/appeal_messages?submission_id=in.(${list})&select=*&order=created_at.asc`, { headers }),
  ]);
  if (!subsRes.ok || !msgsRes.ok) return json({ ok: false, error: 'failed' }, 502);
  const dt = makeT(getDashLang(astro));
  const lang = getDashLang(astro);
  const when = (iso: string) => new Date(iso).toLocaleString(lang, { dateStyle: 'medium', timeStyle: 'short' });
  const subs: { id: string; username: string; status: string }[] = await subsRes.json();
  const grouped: Record<string, any[]> = {};
  for (const m of await msgsRes.json()) (grouped[m.submission_id] ??= []).push(m);
  const items: Record<string, { status: string; count: number; html: string }> = {};
  for (const s of subs) {
    const messages = grouped[s.id] ?? [];
    const who = (m: any) => (m.author_type === 'user' ? s.username : m.author_type === 'staff' ? (m.author_name ?? dt('Staff')) : 'Petto');
    items[s.id] = { status: s.status, count: messages.length, html: chatHtml(messages, { prefix: 'da', who, when, empty: dt('No messages yet.') }) };
  }
  return json({ ok: true, items });
};

// A message to the member, sent without redrawing the page.
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'invalid' }, 403);
  const checked = await allowed(astro);
  if ('error' in checked) return checked.error;
  let body: any = {};
  try { body = await astro.request.json(); } catch { /* nothing to send */ }
  const submissionId = String(body?.submission_id ?? '');
  const content = String(body?.content ?? '').trim().slice(0, 1500);
  if (!UUID.test(submissionId) || !content) return json({ ok: false, error: 'invalid' }, 400);
  const result = await callPettoAppeals(astro, checked.id, checked.session.userId, 'reply', { id: submissionId, content });
  return json({ ok: Boolean(result.ok), message: result.ok ? null : String(result.payload?.message ?? '') }, result.ok ? 200 : 400);
};
