export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { getEnv } from '../../utils/env';
import { createPremiumCheckout } from '../../utils/premium';

// The checkout of Premium, straight from the Premium page: the member accepted the terms in the dialog, so this signs them
// in with Discord if they are not (and comes back here), and sends them to Polar. They never land in the dashboard.
const PLAN = /^premium-[135]-(?:month|year)$/;

export const GET: APIRoute = async (context) => {
  const { url, redirect, cookies, locals } = context;
  const plan = url.searchParams.get('plan') ?? '';
  if (!PLAN.test(plan) || url.searchParams.get('terms') !== '1') return redirect('/premium', 302);

  const session = await getDashboardSession(context);
  if (!session) {
    const clientId = getEnv({ locals }, 'DISCORD_CLIENT_ID');
    if (!clientId) return redirect('/dash?error=server_not_configured', 302);
    cookies.set('petto_after_login', `${url.pathname}${url.search}`, { httpOnly: true, secure: url.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 10 * 60 });
    const authorize = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(`${url.origin}/dash/callback`)}&response_type=code&scope=${encodeURIComponent('identify guilds')}`;
    return redirect(authorize, 302);
  }

  const checkoutUrl = await createPremiumCheckout(context, session.userId, plan, new Date().toISOString());
  return redirect(checkoutUrl ?? '/dash/premium?error=checkout_unavailable', checkoutUrl ? 303 : 302);
};
