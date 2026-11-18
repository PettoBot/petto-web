export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getCachedUserGuilds } from '../../../../utils/discordCache';
import { canManageGuild } from '../../../../utils/discord';
import { callPettoQuickSetup } from '../../../../utils/pettoBotApi';
import { cleanQuickSetup } from '../../../../utils/quickSetup';
import { makeT, getDashLang } from '../../../../i18n/dash';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The last step of Quick Setup: what was chosen goes to the bot at once, so nothing is changed before this. Manage Server is asked for here and by the bot. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const dt = makeT(getDashLang(astro));
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: dt('Sign in again.') }, 401);
  if (auth.devView || auth.access) return json({ ok: false, message: dt('Only people with Manage Server can run Quick Setup.') }, 403);
  const guilds = await getCachedUserGuilds(auth.session.accessToken, astro.request, { forAccess: true }).catch(() => []);
  if (!canManageGuild(guilds.find((g: any) => g.id === id) ?? {})) return json({ ok: false, message: dt('Only people with Manage Server can run Quick Setup.') }, 403);
  const body: any = await astro.request.json().catch(() => null);
  const setup = cleanQuickSetup(body?.setup);
  if (!Object.values(setup.modules).some(Boolean)) return json({ ok: false, message: dt('Turn on at least one module.') }, 400);
  const result = await callPettoQuickSetup(astro, id, String(auth.session.userId), setup, getDashLang(astro));
  if (!result.results.length) return json({ ok: false, message: result.message || dt('Petto did not answer. Try again in a moment.') }, 502);
  return json(result, result.ok ? 200 : 400);
};
