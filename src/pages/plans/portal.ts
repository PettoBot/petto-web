export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { createPremiumCustomerPortalSession } from '../../utils/premium';

// The Polar portal of the person (to see the payments, change the card or cancel the plan). Only for a logged-in person; it opens their own customer, never another one.
export const GET: APIRoute = async (context) => {
  const session = await getDashboardSession(context);
  if (!session) return context.redirect('/dash', 302);
  const portal = await createPremiumCustomerPortalSession(context, session.userId);
  return context.redirect(portal ?? '/dash/plan?error=portal_unavailable', portal ? 303 : 302);
};
