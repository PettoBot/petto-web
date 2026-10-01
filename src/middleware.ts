import { defineMiddleware } from 'astro:middleware';
import { LANG_COOKIE } from './i18n/dash';

const prefixes: Record<string, { lang: string; path: string }> = { es: { lang: 'es', path: '/es' }, 'pt-br': { lang: 'pt-BR', path: '/pt-br' } };

// /es/dash and /pt-br/dash pick the dashboard language and render the single /dash route.
// The prefix is kept on the links, forms, and redirects of the page, so it stays in the address bar.
export const onRequest = defineMiddleware(async ({ url, cookies, locals, rewrite }, next) => {
  const match = url.pathname.match(/^\/(es|pt-br)(\/dash(?:\/.*)?)$/i);
  if (!match || /^\/dash\/lang(?:[/?#]|$)/.test(match[2])) return next();
  const { lang, path } = prefixes[match[1].toLowerCase()];
  // Logging out is answered here: a cookie cleared by the rewritten route is lost when the redirect is rebuilt below,
  // so the session stayed and /es/dash kept showing the servers.
  if (/^\/dash\/logout\/?$/.test(match[2])) {
    const headers = new Headers({ location: `${path}/dash`, 'cache-control': 'no-store' });
    headers.append('set-cookie', `petto_session=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${url.protocol === 'https:' ? '; Secure' : ''}`);
    return new Response(null, { status: 302, headers });
  }
  cookies.set(LANG_COOKIE, lang, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', secure: url.protocol === 'https:' });
  (locals as Record<string, unknown>).dashLang = lang;
  const response = await rewrite(`${match[2]}${url.search}`);

  const location = response.headers.get('location');
  if (location && location.startsWith('/dash')) {
    const headers = new Headers(response.headers);
    headers.set('location', `${path}${location}`);
    return new Response(null, { status: response.status, headers });
  }

  if (!(response.headers.get('content-type') ?? '').includes('text/html')) return response;
  const html = (await response.text()).replace(/(\s(?:href|action)=")\/dash(?!\/lang)(?=[/?#"])/g, `$1${path}/dash`);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
});
