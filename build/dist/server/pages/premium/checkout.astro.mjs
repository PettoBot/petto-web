import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { w as createPremiumCheckout } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const PLAN = /^premium-[135]-(?:month|year)$/;
const GET = async (context) => {
  const { url, redirect, cookies, locals } = context;
  const plan = url.searchParams.get("plan") ?? "";
  if (!PLAN.test(plan) || url.searchParams.get("terms") !== "1") return redirect("/premium", 302);
  const session = await getDashboardSession(context);
  if (!session) {
    const clientId = getEnv({ locals }, "DISCORD_CLIENT_ID");
    if (!clientId) return redirect("/dash?error=server_not_configured", 302);
    cookies.set("petto_after_login", `${url.pathname}${url.search}`, { httpOnly: true, secure: url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    const authorize = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(`${url.origin}/dash/callback`)}&response_type=code&scope=${encodeURIComponent("identify guilds")}`;
    return redirect(authorize, 302);
  }
  const checkoutUrl = await createPremiumCheckout(context, session.userId, plan, (/* @__PURE__ */ new Date()).toISOString());
  return redirect(checkoutUrl ?? "/dash/premium?error=checkout_unavailable", checkoutUrl ? 303 : 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
