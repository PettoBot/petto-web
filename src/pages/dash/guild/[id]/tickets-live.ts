export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoTicketLive, type TicketLiveRoute } from '../../../../utils/pettoBotApi';
import { getDashLang } from '../../../../i18n/dash';

// Live tickets (Tickets → Live tickets). GET: the open tickets, or with ?ticket=<number> the last messages of one; the view asks every
// few seconds while it is on screen, and at once when the bot says something changed (the stream's `tk` event). POST: what the staff
// does with a ticket (reply, claim, unclaim, add, remove, close). The bot checks who may see and do what (see petto-bot
// src/web/ticketLiveRoutes.js); this route checks the session, the role access of the page and the shape of what is sent.
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' } });
const ACTIONS = new Set<TicketLiveRoute>(['reply', 'claim', 'unclaim', 'add', 'remove', 'close']);

async function allowed(astro: any) {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) {
    const viewOnly = /error=(view_only|dev_readonly)/.test(auth.redirect);
    return { error: json({ ok: false, code: viewOnly ? 'view_only' : 'unauthorized' }, viewOnly ? 403 : 401) };
  }
  return { id, userId: String(auth.session.userId) };
}

const ticketNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 && number <= 10_000_000 ? number : null;
};

export const GET: APIRoute = async (astro) => {
  const checked = await allowed(astro);
  if ('error' in checked) return checked.error;
  const lang = getDashLang(astro);
  const raw = astro.url.searchParams.get('ticket');
  if (raw !== null) {
    const number = ticketNumber(raw);
    if (!number) return json({ ok: false, code: 'not_found' }, 400);
    const result = await callPettoTicketLive(astro, checked.id, checked.userId, 'messages', { ticket: number }, lang);
    return json(result.data, result.ok ? 200 : result.status || 502);
  }
  const result = await callPettoTicketLive(astro, checked.id, checked.userId, 'list', {}, lang);
  return json(result.data, result.ok ? 200 : result.status || 502);
};

export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, code: 'invalid' }, 403);
  const checked = await allowed(astro);
  if ('error' in checked) return checked.error;
  let body: any = null;
  try { body = await astro.request.json(); } catch { /* checked below */ }
  const action = String(body?.action ?? '') as TicketLiveRoute;
  const number = ticketNumber(body?.ticket);
  if (!ACTIONS.has(action) || !number) return json({ ok: false, code: 'invalid' }, 400);
  const payload: Record<string, unknown> = { ticket: number };
  if (action === 'reply') payload.content = String(body?.content ?? '').slice(0, 2000);
  if (action === 'add' || action === 'remove') payload.target = String(body?.target ?? '').trim().slice(0, 40);
  if (action === 'close') payload.reason = String(body?.reason ?? '').slice(0, 500);
  const result = await callPettoTicketLive(astro, checked.id, checked.userId, action, payload, getDashLang(astro));
  return json(result.data, result.ok ? 200 : result.status || 502);
};
