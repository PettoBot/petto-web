export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getCachedUserGuilds } from '../../../../utils/discordCache';
import { canManageGuild } from '../../../../utils/discord';
import { callPettoPermissionAlerts } from '../../../../utils/pettoBotApi';
import { makeT, getDashLang } from '../../../../i18n/dash';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** Only people with Manage Server (like the notice in the log channel, and like the bot, which checks it again). Answers `null` when the member may go on. */
async function allowed(astro: Parameters<APIRoute>[0], id: string) {
  const dt = makeT(getDashLang(astro));
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return { response: json({ ok: false, message: dt('Sign in again.') }, 401) };
  const needsManage = dt('Only people with Manage Server can see this.');
  if (auth.devView || auth.access) return { response: json({ ok: false, message: needsManage }, 403) };
  const guilds = await getCachedUserGuilds(auth.session.accessToken, astro.request, { forAccess: true }).catch(() => []);
  if (!canManageGuild(guilds.find((g: any) => g.id === id) ?? {})) return { response: json({ ok: false, message: needsManage }, 403) };
  return { userId: String(auth.session.userId), dt };
}

/** The permission problems of the server, each one checked again by the bot (what the staff fixed is gone). */
export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const gate = await allowed(astro, id);
  if ('response' in gate && gate.response) return gate.response;
  const { userId, dt } = gate as { userId: string; dt: ReturnType<typeof makeT> };
  const result = await callPettoPermissionAlerts(astro, id, userId, 'list', '', getDashLang(astro));
  if (!result.ok) return json({ ok: false, message: result.message || dt('Petto did not answer. Try again in a moment.') }, 502);
  return json({ ok: true, alerts: result.alerts });
};

/** "Dismiss": takes one problem off the list. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== new URL(astro.request.url).origin) return json({ ok: false }, 403);
  const gate = await allowed(astro, id);
  if ('response' in gate && gate.response) return gate.response;
  const { userId, dt } = gate as { userId: string; dt: ReturnType<typeof makeT> };
  const body: any = await astro.request.json().catch(() => null);
  const key = String(body?.key ?? '').slice(0, 400);
  if (!key) return json({ ok: false, message: dt('Petto did not answer. Try again in a moment.') }, 400);
  const result = await callPettoPermissionAlerts(astro, id, userId, 'dismiss', key, getDashLang(astro));
  if (!result.ok) return json({ ok: false, message: result.message || dt('Petto did not answer. Try again in a moment.') }, 502);
  return json({ ok: true });
};
