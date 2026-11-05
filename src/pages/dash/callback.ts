export const prerender = false;
import type { APIRoute } from 'astro';
import { encodeSession } from '../../utils/session';
import { cosmeticsFromUser } from '../../utils/discordCosmetics.mjs';
import { profileFromUser } from '../../utils/dashProfile.mjs';
import { getEnv } from '../../utils/env';
import { getDashLang, makeT } from '../../i18n/dash';
import { withDashPrefix } from '../../utils/dashPrefix.mjs';
import { LANDING_PATH } from '../../utils/dashLogin.mjs';

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

/** A small page that shows the loading animation while the next page (the profile) loads. */
function loadingPage(target: string, dt: (key: string) => string): Response {
  const href = escapeHtml(target);
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="1;url=${href}"><title>Petto</title><style>
:root{color-scheme:dark light}html,body{height:100%;margin:0}body{display:grid;place-items:center;background:#18191d;color:#f2f1ed;font-family:system-ui,-apple-system,Segoe UI,sans-serif}
@media (prefers-color-scheme:light){body{background:#fff;color:#1b1c20}.b{background:#f7f8fa!important;border-color:#dfe1e6!important}}
.b{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;padding:30px 40px;border:1px solid #34373e;border-radius:18px;background:#212328;animation:in .35s ease both}
.o{position:relative;width:54px;height:54px;margin-bottom:10px}.o span{position:absolute;inset:0;border-radius:50%;border:3px solid transparent;border-top-color:#f0a88f;animation:s 1s linear infinite}
.o span:nth-child(2){inset:7px;opacity:.6;animation-duration:1.4s;animation-direction:reverse}.o span:nth-child(3){inset:16px;opacity:.35;animation-duration:.8s}
strong{font-size:16px}small{font-size:13px;opacity:.65}.l{width:180px;height:4px;border-radius:4px;background:rgba(240,168,143,.18);overflow:hidden;margin-top:12px}.l i{display:block;height:100%;width:40%;border-radius:4px;background:#f0a88f;animation:m 1.2s ease-in-out infinite}
@keyframes s{to{transform:rotate(360deg)}}@keyframes m{0%{transform:translateX(-110%)}100%{transform:translateX(350%)}}@keyframes in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
</style></head><body><div class="b" role="status"><div class="o"><span></span><span></span><span></span></div><strong>${escapeHtml(dt('Loading your data'))}</strong><small>${escapeHtml(dt('Signing you in…'))}</small><div class="l"><i></i></div></div><script>location.replace(${JSON.stringify(target)})</script></body></html>`;
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

export const GET: APIRoute = async ({ url, redirect: plainRedirect, cookies, locals, request }) => {
  // Discord sends everyone back to /dash/callback (no prefix): the next address carries the language the visitor uses, so a Spanish or
  // Portuguese dashboard opens at /es/dash or /pt-br/dash right away.
  const lang = getDashLang({ locals, cookies, request } as any);
  const redirect = (to: string) => plainRedirect(withDashPrefix(to, lang));
  const clientId = getEnv({ locals }, 'DISCORD_CLIENT_ID');
  const clientSecret = getEnv({ locals }, 'DISCORD_CLIENT_SECRET');
  if (!clientId || !clientSecret) return redirect('/dash?error=server_not_configured');

  const code = url.searchParams.get('code');
  if (!code) return redirect('/dash?error=missing_code');

  const redirectUri = `${url.origin}/dash/callback`;

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });
    if (!tokenRes.ok) {
      // Discord's answer names the cause (invalid_client = wrong secret or app, invalid_grant = redirect_uri or an expired code,
      // 429 = rate limit). It never contains the secret, so it is safe to keep in the host logs.
      const detail = (await tokenRes.text().catch(() => '')).slice(0, 300);
      console.error(`[oauth] token exchange failed: ${tokenRes.status} redirect_uri=${redirectUri} ${detail}`);
      return redirect('/dash?error=token_exchange_failed');
    }
    const token = await tokenRes.json();

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!userRes.ok) {
      console.error(`[oauth] user fetch failed: ${userRes.status}`);
      return redirect('/dash?error=user_fetch_failed');
    }
    const user = await userRes.json();

    const session = {
      userId: user.id,
      username: user.global_name || user.username,
      avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : null,
      ...cosmeticsFromUser(user),
      ...profileFromUser(user),
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + token.expires_in * 1000,
    };
    const encoded = await encodeSession(session, clientSecret);

    cookies.set('petto_session', encoded, {
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // A form filled on the web says which form in the OAuth state (form.<public id>.<lang>), so the visitor comes back to it even
    // without the cookie.
    const fromState = /^form\.([0-9A-Za-z]{12})\.(en|es|pt)$/.exec(url.searchParams.get('state') ?? '');
    const afterLogin = cookies.get('petto_after_login')?.value || (fromState ? `${fromState[2] === 'es' ? '/es' : fromState[2] === 'pt' ? '/pt-br' : ''}/form/${fromState[1]}` : undefined);
    cookies.delete('petto_after_login', { path: '/' });
    // Only places of this site that need a signed-in member: the dashboard, the appeal site, the feedback board, the forms filled on the web, and the checkout that opens from the Premium page.
    const returnTo = afterLogin && /^\/(?:(?:es|pt-br)\/(?=dash))?(?:appeal\/[a-z0-9-]{3,32}(?:\/(?:form\/\d{1,12}|status\/[0-9a-f-]{36}))?$|dash(?:\/|$)|feedback(?:\/(?:new|\d{1,12}))?$|f\/[0-9A-Za-z]{12}$|(?:(?:es|pt-br)\/)?form[#/][0-9A-Za-z]{12}$|premium\/checkout\?plan=premium-[135]-(?:month|year)&terms=1$)/.test(afterLogin) ? afterLogin : LANDING_PATH;
    // The destination is checked above, so it is safe to put in the page. Only the plain landing page gets the animation.
    if (returnTo === LANDING_PATH) return loadingPage(withDashPrefix(returnTo, lang), makeT(lang));
    return redirect(returnTo);
  } catch {
    return redirect('/dash?error=login_failed');
  }
};
