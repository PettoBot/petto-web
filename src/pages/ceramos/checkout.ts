export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { getEnv } from '../../utils/env';
import { createCoinCheckout } from '../../utils/premium';

// The checkout of a pack of ceramos, from the page "Buy ceramos": the person accepted the terms in the dialog, so this signs them in with Discord if they are not (and comes
// back here), and sends them to Polar. The ceramos are given when the payment is confirmed (the webhook), never from this page.
const PACK = /^[a-z0-9][a-z0-9-]{2,30}$/;

export const GET: APIRoute = async (context) => {
  const { url, redirect, cookies, locals } = context;
  const pack = url.searchParams.get('pack') ?? '';
  if (!PACK.test(pack) || url.searchParams.get('terms') !== '1') return redirect('/dash/buy-ceramos', 302);

  const session = await getDashboardSession(context);
  if (!session) {
    const clientId = getEnv({ locals }, 'DISCORD_CLIENT_ID');
    if (!clientId) return redirect('/dash?error=server_not_configured', 302);
    cookies.set('petto_after_login', `${url.pathname}${url.search}`, { httpOnly: true, secure: url.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 10 * 60 });
    const authorize = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(`${url.origin}/dash/callback`)}&response_type=code&scope=${encodeURIComponent('identify guilds')}`;
    return redirect(authorize, 302);
  }

  const checkoutUrl = await createCoinCheckout(context, session.userId, pack, new Date().toISOString());
  return redirect(checkoutUrl ?? '/dash/buy-ceramos?error=checkout_unavailable', checkoutUrl ? 303 : 302);
};
