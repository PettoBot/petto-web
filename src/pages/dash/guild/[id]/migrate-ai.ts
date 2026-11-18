export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getCachedUserGuilds } from '../../../../utils/discordCache';
import { canManageGuild } from '../../../../utils/discord';
import { callPettoMigrateAi } from '../../../../utils/pettoBotApi';
import { isBotId } from '../../../../utils/botMigration';
import { makeT, getDashLang } from '../../../../i18n/dash';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const MODES = ['rewrite', 'plan', 'ask'];
const MAX_TEXT = 1500;

/** The AI helper of the Migrate page. It only proposes (nothing is saved) but it spends the shared AI quota, so Manage Server is asked for here and by the bot. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const dt = makeT(getDashLang(astro));
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: dt('Sign in again.') }, 401);
  const needsManage = dt('Only people with Manage Server can use the AI helper.');
  if (auth.devView || auth.access) return json({ ok: false, message: needsManage }, 403);
  const guilds = await getCachedUserGuilds(auth.session.accessToken, astro.request, { forAccess: true }).catch(() => []);
  if (!canManageGuild(guilds.find((g: any) => g.id === id) ?? {})) return json({ ok: false, message: needsManage }, 403);
  const body: any = await astro.request.json().catch(() => null);
  const mode = String(body?.mode ?? '');
  const text = String(body?.text ?? '').trim();
  if (!MODES.includes(mode)) return json({ ok: false, message: dt('Pick what the AI should do.') }, 400);
  if (!text) return json({ ok: false, message: dt('Write something first.') }, 400);
  if (text.length > MAX_TEXT) return json({ ok: false, message: dt('That is too long. Keep it under {n} characters.', { n: MAX_TEXT }) }, 400);
  const bot = isBotId(body?.bot) ? body.bot : 'other';
  const result = await callPettoMigrateAi(astro, id, String(auth.session.userId), { mode, bot, text }, getDashLang(astro));
  if (result.ok) return json({ ok: true, answer: result.answer, unknown: result.unknown });
  const status = result.status === 504 ? 502 : result.status >= 400 && result.status < 600 ? result.status : 502;
  return json({ ok: false, message: result.message || dt('Petto did not answer. Try again in a moment.'), retryAfter: result.retryAfter }, status);
};
