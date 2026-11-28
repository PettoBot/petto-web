import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { c as createCoinCheckout, i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const PACK = /^[a-z0-9][a-z0-9-]{2,30}$/;
const GET = async (context) => {
  const { url, redirect, cookies, locals } = context;
  const pack = url.searchParams.get("pack") ?? "";
  if (!PACK.test(pack) || url.searchParams.get("terms") !== "1") return redirect("/dash/buy-ceramos", 302);
  const session = await getDashboardSession(context);
  if (!session) {
    const clientId = getEnv({ locals }, "DISCORD_CLIENT_ID");
    if (!clientId) return redirect("/dash?error=server_not_configured", 302);
    cookies.set("petto_after_login", `${url.pathname}${url.search}`, { httpOnly: true, secure: url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    const authorize = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(`${url.origin}/dash/callback`)}&response_type=code&scope=${encodeURIComponent("identify guilds")}`;
    return redirect(authorize, 302);
  }
  const result = await createCoinCheckout(context, session.userId, pack, (/* @__PURE__ */ new Date()).toISOString());
  if (result.url) return redirect(result.url, 303);
  const why = isPettoOwner(context, session.userId) && result.why ? `&why=${encodeURIComponent(result.why)}` : "";
  return redirect(`/dash/buy-ceramos?error=checkout_unavailable${why}`, 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
