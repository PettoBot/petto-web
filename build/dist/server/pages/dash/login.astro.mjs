import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { d as loginScope, s as supportChoice } from '../../chunks/dashLogin_BrhWPYc0.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
import { w as withDashPrefix } from '../../chunks/dashPrefix_eB5wKYeM.mjs';
export { renderers } from '../../renderers.mjs';

function dashAuthorizeUrl(astro, { joinSupport = false } = {}) {
  const clientId = getEnv(astro, "DISCORD_CLIENT_ID");
  if (!clientId) return null;
  const redirectUri = `${astro.url.origin}/dash/callback`;
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(loginScope(joinSupport))}`;
}

const prerender = false;
const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const YEAR = 60 * 60 * 24 * 365;
function questionPage(lang, dt) {
  const yes = escapeHtml(withDashPrefix("/dash/login?support=yes", lang));
  const no = escapeHtml(withDashPrefix("/dash/login?support=no", lang));
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(dt("Join the support server?"))}</title><style>
:root{color-scheme:dark light}html,body{height:100%;margin:0}body{display:grid;place-items:center;padding:16px;box-sizing:border-box;background:#111113;color:#f2f1ed;font-family:system-ui,-apple-system,Segoe UI,sans-serif}
@media (prefers-color-scheme:light){body{background:#fff;color:#1b1c20}.b{background:#f7f8fa!important;border-color:#dfe1e6!important}.n{background:transparent!important;color:inherit!important;border-color:#c9ccd3!important}}
.b{display:flex;flex-direction:column;gap:10px;max-width:420px;width:100%;padding:28px;border:1px solid #34373e;border-radius:18px;background:#1c1c20;box-sizing:border-box}
h1{font-size:18px;margin:0}p{font-size:14px;line-height:1.5;margin:0;opacity:.8}.r{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
a{flex:1 1 140px;text-align:center;text-decoration:none;font-weight:600;font-size:14px;padding:11px 16px;border-radius:12px;border:1px solid transparent}
.y{background:#4fbf7f;color:#08210f}.n{background:transparent;color:#f2f1ed;border-color:#4a4d55}
</style></head><body><div class="b"><h1>${escapeHtml(dt("Join the support server?"))}</h1><p>${escapeHtml(dt("Petto can add you to its support server when you sign in, so you can ask for help and follow the news. Discord asks you to allow it on its own screen, and you can leave the server any time."))}</p><div class="r"><a class="y" href="${yes}">${escapeHtml(dt("Yes, add me"))}</a><a class="n" href="${no}">${escapeHtml(dt("No, thanks"))}</a></div></div></body></html>`;
  return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
const GET = async ({ locals, url, redirect, cookies, request }) => {
  const choice = supportChoice({ answer: url.searchParams.get("support"), asked: cookies.get("petto_support_asked")?.value });
  if (choice.ask) {
    const lang = getDashLang({ locals, cookies, request });
    return questionPage(lang, makeT(lang));
  }
  const secure = url.protocol === "https:";
  if (choice.remember) cookies.set("petto_support_asked", "1", { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: YEAR });
  if (choice.join) cookies.set("petto_join_support", "1", { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 600 });
  else cookies.delete("petto_join_support", { path: "/" });
  const to = dashAuthorizeUrl({ locals, url }, { joinSupport: choice.join });
  return redirect(to ?? "/dash?error=server_not_configured", 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
