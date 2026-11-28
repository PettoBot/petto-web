import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { x as createPremiumCustomerPortalSession } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  const session = await getDashboardSession(context);
  if (!session) return context.redirect("/dash", 302);
  const portal = await createPremiumCustomerPortalSession(context, session.userId);
  return context.redirect(portal ?? "/dash/plan?error=portal_unavailable", portal ? 303 : 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
