import type { APIContext, MiddlewareNext } from 'astro';
import { defineMiddleware } from 'astro:middleware';
import { LANG_COOKIE } from './i18n/dash';
import { configureSnapshots } from './utils/guildSnapshots';
import { warmShared } from './utils/sharedCache';
import { requestGuildChanges, timed } from './utils/serverTiming';
import { bumpGuildVersion, dashEtag, guildVersion } from './utils/guildVersion';
import { getGuildSession } from './utils/dashAuth';
import { getDashLang } from './i18n/dash';
import { dashLangRedirect } from './utils/dashPrefix.mjs';
import { buildInfo } from './utils/buildInfo';
import { startLatencyKeeping } from './utils/latencyStats';
import { recordSupportEdit, supportRefusal, type SupportEditNote } from './utils/supportEdit';

// On Discloud the site can read tables straight from PostgreSQL when PETTO_DATABASE_URL is set (see utils/directDb.ts).
const directDatabase = __DIRECT_DB__ ? import('./utils/directDb').then((module) => module.installDirectDatabase()).catch(() => {}) : null;

// Connects to Redis (when configured) as the server starts, not on the first page that needs it.
warmShared();
// The owner's latency figures (/dash/health) survive a restart through Redis.
startLatencyKeeping();

const PUBLIC_SHARED_PAGE = /^\/(?:(?:es|pt-br)\/)?(?:stats|status|team|credits|partners|lb\/[^/]+)\/?$/i;
const PUBLIC_SHARED_CACHE = 'public, s-maxage=60, stale-while-revalidate=600';
// The partners, the team and the leaderboards are edited by their owners and checked right after saving, so the copy in front is kept shorter and never served stale.
const PARTNERS_PAGE = /^\/(?:(?:es|pt-br)\/)?(?:partners|team|lb\/[^/]+)\/?$/i;
const PARTNERS_CACHE = 'public, s-maxage=20';

const prefixes: Record<string, { lang: string; path: string }> = { es: { lang: 'es', path: '/es' }, 'pt-br': { lang: 'pt-BR', path: '/pt-br' } };

// /es/dash and /pt-br/dash pick the dashboard language and render the single /dash route.
// The prefix is kept on the links, forms, and redirects of the page, so it stays in the address bar.
const DASH_PATH = /^\/(?:(?:es|pt-br)\/)?dash(?:\/|$)/i;

/**
 * A page that was not found is never kept. Cloudflare in front of the site gives every answer a browser lifetime of four hours, and a person who asked for a page
 * while a new version was being published (the page was not there yet) kept the "404" on the phone for hours after the page existed. `no-store` says nobody keeps it.
 */
const notKept404 = (response: Response): Response => (response.status === 404 ? withHeaders(response, { 'Cache-Control': 'no-store' }) : response);

export const onRequest = defineMiddleware(async (context, next) => notKept404(await route(context, next)));

async function route(context: APIContext, next: MiddlewareNext): Promise<Response> {
  await directDatabase;
  configureSnapshots({ locals: context.locals });
  // Dashboard pages say where their time went (Server-Timing: auth, db, discord, bot, render).
  if (DASH_PATH.test(context.url.pathname)) {
    const response = withReloginNotice(context, withFreshDash(await timed(context, () => handle(context, (payload?: any) => (payload ? next(payload) : guildPage(context, next))))));
    // A change answered "not found" is said in the log with where it came from, to tell a page that said it from a route that was not found.
    if (response.status === 404 && !['GET', 'HEAD'].includes(context.request.method.toUpperCase())) {
      console.warn(`[web] the dashboard answered 404 to ${context.request.method} ${context.url.pathname} (route ${(context as any).routePattern ?? 'unknown'}, reroute ${response.headers.get('x-astro-reroute') ?? 'none'})`);
    }
    return response;
  }
  return handle(context, next);
}

// A page (or a route) of one server. The routes that only stream or report the stamp answer it themselves.
const GUILD_ROUTE = /^\/dash\/guild\/(\d{5,25})\/([\w-]+)\/?$/;
const STAMP_ROUTES = new Set(['version', 'events']);

/**
 * The pages of a server carry the server's change stamp (guildVersion.ts):
 * - A read answers `X-Dash-Version` (and the page says it on #dgl-content), with an ETag built from the stamp, the minute, the address,
 *   the visitor and the language. A browser that already has that copy is answered 304 right after the session check, without
 *   reading or drawing anything.
 * - A change (any other method) that saved something raises the stamp once it is done, and answers the new one, so the page that comes
 *   back is known to be current and every other open page of the server reads itself again.
 */
async function guildPage(context: APIContext, next: MiddlewareNext): Promise<Response> {
  const match = GUILD_ROUTE.exec(context.url.pathname);
  if (!match || STAMP_ROUTES.has(match[2])) return next();
  const guildId = match[1];
  const locals = context.locals as Record<string, unknown>;
  const method = context.request.method.toUpperCase();

  if (method !== 'GET' && method !== 'HEAD') {
    locals.dashVersion = await guildVersion(guildId);
    const response = await next();
    const type = response.headers.get('content-type') ?? '';
    // Support mode (supportEdit.ts): the Petto owner changed a setting of a server he does not manage. The change leaves its trace for the
    // admins of the server (who, when, the page and the action, never a value), once, and only when the page did not fail.
    const supportNote = locals.supportEdit as SupportEditNote | undefined;
    if (supportNote && response.status < 400) await recordSupportEdit(context, supportNote, response.status);
    // A JSON route says "sign in again" to a write the gate refused: Support mode says what happened instead.
    if (locals.supportRefused && type.includes('json')) return supportRefusal(context);
    const answered = response.status < 400 && (type.includes('text/html') || (response.status >= 300 && response.status < 400));
    const changed = new Set(requestGuildChanges());
    if (answered) changed.add(guildId);
    let version = '';
    for (const id of changed) {
      const raised = await bumpGuildVersion(id).catch(() => '');
      if (id === guildId) version = raised;
    }
    if (!version) return response;
    locals.dashVersion = version;
    return withHeaders(response, { 'X-Dash-Version': version });
  }

  const partial = Boolean(context.request.headers.get('x-dash-partial'));
  const ifNoneMatch = context.request.headers.get('if-none-match');
  // Only a copy this server made (ours start with W/"dv.) is checked before the page runs; anything else is drawn as usual.
  let etag: string | null = null;
  let version = '';
  const auth = await getGuildSession(context, guildId);
  if (!('redirect' in auth)) {
    version = await guildVersion(guildId);
    locals.dashVersion = version;
    const etagParts = { version, path: context.url.pathname + context.url.search, userId: String(auth.session.userId), lang: getDashLang(context), build: `${buildInfo.version}.${buildInfo.builtAt}` };
    etag = dashEtag({ ...etagParts, partial });
    // The page says which copy the dashboard's own reads of it would get, for the pages that check themselves (data-dash-live).
    locals.dashPartialEtag = partial ? etag : dashEtag({ ...etagParts, partial: true });
    if (ifNoneMatch && ifNoneMatch.includes('W/"dv.') && ifNoneMatch.split(',').some((tag) => tag.trim() === etag)) {
      return new Response(null, { status: 304, headers: { ETag: etag, 'Cache-Control': 'private, no-cache', Vary: 'X-Dash-Partial', 'X-Dash-Version': version } });
    }
  }
  const response = await next();
  if (!version) return response;
  const type = response.headers.get('content-type') ?? '';
  const extra: Record<string, string> = { 'X-Dash-Version': version };
  // A page drawn while it still waited for something (liveCall.ts) is never answered "not modified" later: it gets no ETag.
  if (etag && response.status === 200 && type.includes('text/html') && !locals.dashPending) {
    extra.ETag = etag;
    extra.Vary = 'X-Dash-Partial';
  }
  return withHeaders(response, extra);
}

/**
 * A session made before SESSION_VERSION was rejected (dashAuth.ts) and the page sent the visitor to the plain /dash: the redirect gets
 * `?notice=relogin` so the login card says why, and the old cookie is cleared (also on a prefixed address, where a rewritten route loses it).
 */
function withReloginNotice(context: APIContext, response: Response): Response {
  if (!(context.locals as Record<string, unknown>).sessionStale) return response;
  const location = response.headers.get('location');
  if (!location || !/^(?:\/(?:es|pt-br))?\/dash\/?$/i.test(location)) return response;
  const headers = new Headers(response.headers);
  headers.set('location', `${location}?notice=relogin`);
  headers.append('set-cookie', `petto_session=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${context.url.protocol === 'https:' ? '; Secure' : ''}`);
  return new Response(null, { status: response.status, headers });
}

function withHeaders(response: Response, values: Record<string, string>): Response {
  try {
    for (const [name, value] of Object.entries(values)) response.headers.set(name, value);
    return response;
  } catch {
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(values)) headers.set(name, value);
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
}

/** Puts the language prefix on the dashboard links of a page while it streams (it used to wait for the whole page first). */
function prefixLinks(body: ReadableStream<Uint8Array>, path: string): ReadableStream<Uint8Array> {
  const LINK = /(\s(?:href|action)=")\/dash(?!\/lang)(?=[/?#"])/g;
  // A link split between two chunks is finished with the next one. A link starts with a space and has none after it, so everything up
  // to the last space of a chunk can go at once and only the rest waits.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let carry = '';
  return body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const text = carry + decoder.decode(chunk, { stream: true });
      let cut = text.length;
      for (let i = text.length - 1; i >= 0; i -= 1) {
        if (/\s/.test(text[i])) { cut = i; break; }
      }
      if (cut === text.length && text.length < 65_536) cut = 0;
      carry = text.slice(cut);
      const ready = text.slice(0, cut).replace(LINK, `$1${path}/dash`);
      if (ready) controller.enqueue(encoder.encode(ready));
    },
    flush(controller) {
      const rest = (carry + decoder.decode()).replace(LINK, `$1${path}/dash`);
      if (rest) controller.enqueue(encoder.encode(rest));
    },
  }));
}

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
  // A dashboard address without prefix whose page would be shown in Spanish or Portuguese (the saved choice, or the browser's language)
  // goes to the prefixed address, so the address always says the language on screen (a link from Discord, a bookmark, the login).
  // Not while a prefixed address is being answered: /es/dash is rewritten to /dash and this runs again for that inner request, which would
  // send it back to /es/dash for ever (the language is already set on `locals` by then).
  const to = (locals as Record<string, unknown>).dashLang ? null : dashLangRedirect({ method: request.method, pathname: url.pathname, search: url.search, headers: request.headers, lang: getDashLang({ cookies, request }) });
  if (to) return new Response(null, { status: 303, headers: { location: to, 'cache-control': 'no-store', vary: 'Cookie, Accept-Language' } });
  // The feedback board has the same prefixes: /es/feedback and /pt-br/feedback pick the language and render the single /feedback route.
  // Its own links already carry the prefix (feedbackBase), so nothing is rewritten in the page.
  const board = url.pathname.match(/^\/(es|pt-br)(\/feedback(?:\/.*)?)$/i);
  if (board && !/^\/feedback\/login(?:[/?#]|$)/.test(board[2])) {
    const { lang } = prefixes[board[1].toLowerCase()];
    cookies.set(LANG_COOKIE, lang, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', secure: url.protocol === 'https:' });
    (locals as Record<string, unknown>).dashLang = lang;
    return rewrite(`${board[2]}${url.search}`);
  }
  // A save sent to a prefixed address reaches /dash/... directly (server.mjs takes the prefix off, Astro's rewrite lost some saves) and
  // says which prefix it had: it is answered in that language, with the prefix kept on its links and redirects.
  const sentPrefix = (request.headers.get('x-petto-dash-prefix') ?? '').toLowerCase().replace(/^\//, '');
  if (prefixes[sentPrefix] && !['GET', 'HEAD'].includes(request.method.toUpperCase()) && /^\/dash(?:\/|$)/.test(url.pathname)) {
    const { lang, path } = prefixes[sentPrefix];
    cookies.set(LANG_COOKIE, lang, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', secure: url.protocol === 'https:' });
    (locals as Record<string, unknown>).dashLang = lang;
    return keepPrefix(await next(), path, url.origin);
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
  return keepPrefix(await rewrite(`${match[2]}${url.search}`), path, url.origin);
}

/** The answer of a dashboard route asked through /es or /pt-br: its redirects and its links keep the prefix. */
function keepPrefix(response: Response, path: string, origin: string): Response {
  let location = response.headers.get('location');
  // A redirect written with the full address of this site keeps the prefix too.
  if (location && location.startsWith(`${origin}/dash`)) location = location.slice(origin.length);
  if (location && /^\/dash(?:[/?#]|$)/.test(location)) {
    const headers = new Headers(response.headers);
    headers.set('location', `${path}${location}`);
    return new Response(null, { status: response.status, headers });
  }

  if (!(response.headers.get('content-type') ?? '').includes('text/html') || !response.body) return response;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(prefixLinks(response.body, path), { status: response.status, statusText: response.statusText, headers });
}

/**
 * A dashboard page shows settings that change (from the bot, another tab, a save), so the browser must ask again every time instead of
 * showing a copy it kept, including when the page is opened with Back or loaded by a script. `no-cache` still lets Back be instant.
 */
function withFreshDash(response: Response): Response {
  if (response.headers.has('cache-control')) return response;
  const type = response.headers.get('content-type') ?? '';
  if (!type.includes('text/html') && !type.includes('json')) return response;
  try {
    response.headers.set('Cache-Control', 'private, no-cache');
    return response;
  } catch {
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'private, no-cache');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
}
