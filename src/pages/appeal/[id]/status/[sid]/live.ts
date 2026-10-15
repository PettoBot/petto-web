export const prerender = false;
import type { APIRoute } from 'astro';
import { loadSite } from '../../../../../utils/appealSite';
import { callBot, loadMessages, loadSubmission, timeAgo } from '../../../../../utils/appeals';
import { chatHtml } from '../../../../../utils/appealChat';
import { appealText } from '../../../../../i18n/appeal';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' } });

async function open(astro: any) {
  const site = await loadSite(astro);
  if ('redirect' in site || 'status' in site) return { error: json({ ok: false, error: 'not_found' }, 404) };
  if (!site.session) return { error: json({ ok: false, error: 'unauthorized' }, 401) };
  const sid = String(astro.params.sid ?? '');
  const submission = await loadSubmission(astro, site.id, sid);
  // Only the member who sent it reads it.
  if (!submission || submission.user_id !== site.session.userId) return { error: json({ ok: false, error: 'not_found' }, 404) };
  return { site, sid, submission, session: site.session };
}

// What the page asks every few seconds: the status and the conversation, already drawn in the language of the page.
export const GET: APIRoute = async (astro) => {
  const found = await open(astro);
  if ('error' in found) return found.error;
  const { site, sid, submission } = found;
  const t = appealText(site.lang);
  const messages = (await loadMessages(astro, sid)) ?? [];
  const who = (m: any) => (m.author_type === 'user' ? t('you') : m.author_type === 'staff' ? (m.anonymous ? t('staff') : m.author_name || t('staff')) : t('petto'));
  const html = chatHtml(messages, { prefix: 'ap', who, when: (iso) => timeAgo(iso, site.lang), empty: t('noMessages') });
  return json({ ok: true, status: submission.status, count: messages.length, last: messages.at(-1)?.id ?? 0, html });
};

// A reply of the member, sent without leaving the page.
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'invalid' }, 403);
  const found = await open(astro);
  if ('error' in found) return found.error;
  const { site, sid, session } = found;
  let content = '';
  try { content = String((await astro.request.json())?.content ?? ''); } catch { /* an empty message */ }
  const result = await callBot(astro, site.id, 'reply', { method: 'POST', userId: session.userId, body: { submission_id: sid, content } });
  if (result.ok) return json({ ok: true });
  const error = ['rate_limited', 'bot_unavailable'].includes(String(result.payload?.error)) ? String(result.payload.error) : 'failed';
  return json({ ok: false, error }, result.status && result.status >= 400 ? result.status : 400);
};
