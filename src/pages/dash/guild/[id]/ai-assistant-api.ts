export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { canUseTicketAi } from '../../../../utils/ticketAiAccess';
import { groqChat, handleTicketAiAction, problemText, readTicketAiSettings, readTicketAiUsage, ticketAiDb } from '../../../../utils/ticketAi';
import { getDashLang, makeT } from '../../../../i18n/dash';

// The AI assistant page (Tickets → AI assistant, beta): POST { action: 'test' | 'helper' | 'usage', ... }. The test chat answers as the
// assistant would in a ticket, the setup helper proposes a draft of the fields, usage gives this month's counter. The Groq key stays
// on the server; problems come back as short words in the language of the dashboard, never as the upstream error.
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' } });
const MAX_BODY = 64 * 1024;

export const POST: APIRoute = async (astro) => {
  const lang = getDashLang(astro);
  const dt = makeT(lang);
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, code: 'invalid', message: problemText(dt, 'invalid') }, 403);
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) {
    const viewOnly = /error=(view_only|dev_readonly)/.test(auth.redirect);
    return json({ ok: false, code: viewOnly ? 'view_only' : 'unauthorized', message: viewOnly ? dt('You can look at this page but not change it.') : dt('Sign in again.') }, viewOnly ? 403 : 401);
  }
  const userId = String(auth.session.userId);
  if (!canUseTicketAi(astro, userId, id)) return json({ ok: false, code: 'forbidden', message: problemText(dt, 'invalid') }, 403);
  const db = ticketAiDb(astro);
  if (!db) return json({ ok: false, code: 'not_configured', message: problemText(dt, 'upstream') }, 503);

  const raw = await astro.request.text().catch(() => '');
  if (raw.length > MAX_BODY) return json({ ok: false, code: 'too_long', message: problemText(dt, 'too_long') }, 413);
  let body: any = null;
  try { body = JSON.parse(raw); } catch { /* refused below */ }
  if (!body || typeof body !== 'object') return json({ ok: false, code: 'invalid', message: problemText(dt, 'invalid') }, 400);

  const result = await handleTicketAiAction({
    guildId: id,
    userId,
    lang,
    dt,
    body,
    chat: groqChat(astro),
    loadSaved: () => readTicketAiSettings(db, id),
    loadUsage: () => readTicketAiUsage(db, id),
  });
  return json(result.body, result.status);
};

export const ALL: APIRoute = () => json({ ok: false, code: 'method' }, 405);
