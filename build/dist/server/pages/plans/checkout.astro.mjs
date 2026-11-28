import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { B as activeUserPlan, C as createPlanCheckout, i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const PLAN = /^(?:bronze|silver|gold)$/;
const GET = async (context) => {
  const { url, redirect, cookies, locals } = context;
  const plan = url.searchParams.get("plan") ?? "";
  if (!PLAN.test(plan) || url.searchParams.get("terms") !== "1") return redirect("/dash/plans", 302);
  const session = await getDashboardSession(context);
  if (!session) {
    const clientId = getEnv({ locals }, "DISCORD_CLIENT_ID");
    if (!clientId) return redirect("/dash?error=server_not_configured", 302);
    cookies.set("petto_after_login", `${url.pathname}${url.search}`, { httpOnly: true, secure: url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    const authorize = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(`${url.origin}/dash/callback`)}&response_type=code&scope=${encodeURIComponent("identify guilds")}`;
    return redirect(authorize, 302);
  }
  if (await activeUserPlan(context, session.userId)) return redirect("/dash/plans?error=has_plan", 302);
  const result = await createPlanCheckout(context, session.userId, plan, (/* @__PURE__ */ new Date()).toISOString());
  if (result.url) return redirect(result.url, 303);
  const why = isPettoOwner(context, session.userId) && result.why ? `&why=${encodeURIComponent(result.why)}` : "";
  return redirect(`/dash/plans?error=checkout_unavailable${why}`, 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
