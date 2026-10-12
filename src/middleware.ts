import type { APIContext, MiddlewareNext } from 'astro';
import { defineMiddleware } from 'astro:middleware';
import { LANG_COOKIE } from './i18n/dash';
import { configureSnapshots } from './utils/guildSnapshots';
import { warmShared } from './utils/sharedCache';
import { timed } from './utils/serverTiming';

// On Discloud the site can read tables straight from PostgreSQL when PETTO_DATABASE_URL is set (see utils/directDb.ts).
const directDatabase = __DIRECT_DB__ ? import('./utils/directDb').then((module) => module.installDirectDatabase()).catch(() => {}) : null;

// Connects to Redis (when configured) as the server starts, not on the first page that needs it.
warmShared();

const PUBLIC_SHARED_PAGE = /^\/(?:(?:es|pt-br)\/)?(?:stats|status|team|credits|partners)\/?$/i;
const PUBLIC_SHARED_CACHE = 'public, s-maxage=60, stale-while-revalidate=600';
// The partners are edited by the team and checked right after saving, so the copy in front is kept shorter and never served stale.
const PARTNERS_PAGE = /^\/(?:(?:es|pt-br)\/)?partners\/?$/i;
const PARTNERS_CACHE = 'public, s-maxage=20';

const prefixes: Record<string, { lang: string; path: string }> = { es: { lang: 'es', path: '/es' }, 'pt-br': { lang: 'pt-BR', path: '/pt-br' } };

// /es/dash and /pt-br/dash pick the dashboard language and render the single /dash route.
// The prefix is kept on the links, forms, and redirects of the page, so it stays in the address bar.
const DASH_PATH = /^\/(?:(?:es|pt-br)\/)?dash(?:\/|$)/i;

export const onRequest = defineMiddleware(async (context, next) => {
  await directDatabase;
  configureSnapshots({ locals: context.locals });
  // Dashboard pages say where their time went (Server-Timing: auth, db, discord, bot, render).
  if (DASH_PATH.test(context.url.pathname)) return timed(context, () => handle(context, next));
  return handle(context, next);
});

async function handle({ url, cookies, locals, rewrite, request }: APIContext, next: MiddlewareNext): Promise<Response> {
  // Public pages rendered on each visit (stats, status, team, credits, partners) are the same for everyone, so a cache in front
  // (Cloudflare) may keep them a minute and serve an older copy for ten while it fetches a new one.
  if (PUBLIC_SHARED_PAGE.test(url.pathname) && ['GET', 'HEAD'].includes(request.method.toUpperCase())) {
    const response = await next();
    const cacheControl = PARTNERS_PAGE.test(url.pathname) ? PARTNERS_CACHE : PUBLIC_SHARED_CACHE;
    if (response.status === 200 && !response.headers.has('cache-control') && !response.headers.has('set-cookie')) {
      try {
        response.headers.set('Cache-Control', cacheControl);
      } catch {
        const headers = new Headers(response.headers);
        headers.set('Cache-Control', cacheControl);
        return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
      }
    }
    return response;
  }
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
}
