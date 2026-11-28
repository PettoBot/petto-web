import { e as defineMiddleware, s as sequence } from './chunks/render-context_58b2h834.mjs';
import { g as getDashLang, L as LANG_COOKIE } from './chunks/dash_CORIPvM-.mjs';
import { H as configureSnapshots } from './chunks/discord_CxeBz2tv.mjs';
import { warmShared } from './chunks/sharedCache_DFk4ml3Q.mjs';
import { timed, requestGuildChanges } from './chunks/serverTiming_CTuT9h6x.mjs';
import { guildVersion, bumpGuildVersion, dashEtag } from './chunks/guildVersion_C-xSL97y.mjs';
import { r as recordSupportEdit, t as supportRefusal, a as getGuildSession } from './chunks/dashAuth_uqFK7-ED.mjs';
import { d as dashLangRedirect } from './chunks/dashPrefix_eB5wKYeM.mjs';
import { b as buildInfo } from './chunks/buildInfo_Bw1TupFW.mjs';
import { s as startLatencyKeeping } from './chunks/latencyStats_Bf39oyBT.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_D6y49U4X.mjs';
import 'cookie';

const directDatabase = import('./chunks/directDb_B7F6zYNj.mjs').then((module) => module.installDirectDatabase()).catch(() => {
}) ;
warmShared();
startLatencyKeeping();
const PUBLIC_SHARED_PAGE = /^\/(?:(?:es|pt-br)\/)?(?:stats|status|team|credits|partners|lb\/[^/]+)\/?$/i;
const PUBLIC_SHARED_CACHE = "public, s-maxage=60, stale-while-revalidate=600";
const PARTNERS_PAGE = /^\/(?:(?:es|pt-br)\/)?(?:partners|team|lb\/[^/]+)\/?$/i;
const PARTNERS_CACHE = "public, s-maxage=20";
const prefixes = { es: { lang: "es", path: "/es" }, "pt-br": { lang: "pt-BR", path: "/pt-br" } };
const DASH_PATH = /^\/(?:(?:es|pt-br)\/)?dash(?:\/|$)/i;
const notKept404 = (response) => response.status === 404 ? withHeaders(response, { "Cache-Control": "no-store" }) : response;
const onRequest$1 = defineMiddleware(async (context, next) => notKept404(await route(context, next)));
async function route(context, next) {
  await directDatabase;
  configureSnapshots({ locals: context.locals });
  if (DASH_PATH.test(context.url.pathname)) {
    const response = withReloginNotice(context, withFreshDash(await timed(context, () => handle(context, (payload) => payload ? next(payload) : guildPage(context, next)))));
    if (response.status === 404 && !["GET", "HEAD"].includes(context.request.method.toUpperCase())) {
      console.warn(`[web] the dashboard answered 404 to ${context.request.method} ${context.url.pathname} (route ${context.routePattern ?? "unknown"}, reroute ${response.headers.get("x-astro-reroute") ?? "none"})`);
    }
    return response;
  }
  return handle(context, next);
}
const GUILD_ROUTE = /^\/dash\/guild\/(\d{5,25})\/([\w-]+)\/?$/;
const STAMP_ROUTES = /* @__PURE__ */ new Set(["version", "events"]);
async function guildPage(context, next) {
  const match = GUILD_ROUTE.exec(context.url.pathname);
  if (!match || STAMP_ROUTES.has(match[2])) return next();
  const guildId = match[1];
  const locals = context.locals;
  const method = context.request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    locals.dashVersion = await guildVersion(guildId);
    const response2 = await next();
    const type2 = response2.headers.get("content-type") ?? "";
    const supportNote = locals.supportEdit;
    if (supportNote && response2.status < 400) await recordSupportEdit(context, supportNote, response2.status);
    if (locals.supportRefused && type2.includes("json")) return supportRefusal(context);
    const answered = response2.status < 400 && (type2.includes("text/html") || response2.status >= 300 && response2.status < 400);
    const changed = new Set(requestGuildChanges());
    if (answered) changed.add(guildId);
    let version2 = "";
    for (const id of changed) {
      const raised = await bumpGuildVersion(id).catch(() => "");
      if (id === guildId) version2 = raised;
    }
    if (!version2) return response2;
    locals.dashVersion = version2;
    return withHeaders(response2, { "X-Dash-Version": version2 });
  }
  const partial = Boolean(context.request.headers.get("x-dash-partial"));
  const ifNoneMatch = context.request.headers.get("if-none-match");
  let etag = null;
  let version = "";
  const auth = await getGuildSession(context, guildId);
  if (!("redirect" in auth)) {
    version = await guildVersion(guildId);
    locals.dashVersion = version;
    const etagParts = { version, path: context.url.pathname + context.url.search, userId: String(auth.session.userId), lang: getDashLang(context), build: `${buildInfo.version}.${buildInfo.builtAt}` };
    etag = dashEtag({ ...etagParts, partial });
    locals.dashPartialEtag = partial ? etag : dashEtag({ ...etagParts, partial: true });
    if (ifNoneMatch && ifNoneMatch.includes('W/"dv.') && ifNoneMatch.split(",").some((tag) => tag.trim() === etag)) {
      return new Response(null, { status: 304, headers: { ETag: etag, "Cache-Control": "private, no-cache", Vary: "X-Dash-Partial", "X-Dash-Version": version } });
    }
  }
  const response = await next();
  if (!version) return response;
  const type = response.headers.get("content-type") ?? "";
  const extra = { "X-Dash-Version": version };
  if (etag && response.status === 200 && type.includes("text/html") && !locals.dashPending) {
    extra.ETag = etag;
    extra.Vary = "X-Dash-Partial";
  }
  return withHeaders(response, extra);
}
function withReloginNotice(context, response) {
  if (!context.locals.sessionStale) return response;
  const location = response.headers.get("location");
  if (!location || !/^(?:\/(?:es|pt-br))?\/dash\/?$/i.test(location)) return response;
  const headers = new Headers(response.headers);
  headers.set("location", `${location}?notice=relogin`);
  headers.append("set-cookie", `petto_session=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${context.url.protocol === "https:" ? "; Secure" : ""}`);
  return new Response(null, { status: response.status, headers });
}
function withHeaders(response, values) {
  try {
    for (const [name, value] of Object.entries(values)) response.headers.set(name, value);
    return response;
  } catch {
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(values)) headers.set(name, value);
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
}
function prefixLinks(body, path) {
  const LINK = /(\s(?:href|action)=")\/dash(?!\/lang)(?=[/?#"])/g;
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let carry = "";
  return body.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      const text = carry + decoder.decode(chunk, { stream: true });
      let cut = text.length;
      for (let i = text.length - 1; i >= 0; i -= 1) {
        if (/\s/.test(text[i])) {
          cut = i;
          break;
        }
      }
      if (cut === text.length && text.length < 65536) cut = 0;
      carry = text.slice(cut);
      const ready = text.slice(0, cut).replace(LINK, `$1${path}/dash`);
      if (ready) controller.enqueue(encoder.encode(ready));
    },
    flush(controller) {
      const rest = (carry + decoder.decode()).replace(LINK, `$1${path}/dash`);
      if (rest) controller.enqueue(encoder.encode(rest));
    }
  }));
}
async function handle({ url, cookies, locals, rewrite, request }, next) {
  if (PUBLIC_SHARED_PAGE.test(url.pathname) && ["GET", "HEAD"].includes(request.method.toUpperCase())) {
    const response = await next();
    const cacheControl = PARTNERS_PAGE.test(url.pathname) ? PARTNERS_CACHE : PUBLIC_SHARED_CACHE;
    if (response.status === 200 && !response.headers.has("cache-control") && !response.headers.has("set-cookie")) {
      try {
        response.headers.set("Cache-Control", cacheControl);
      } catch {
        const headers = new Headers(response.headers);
        headers.set("Cache-Control", cacheControl);
        return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
      }
    }
    return response;
  }
  const to = locals.dashLang ? null : dashLangRedirect({ method: request.method, pathname: url.pathname, search: url.search, headers: request.headers, lang: getDashLang({ cookies, request }) });
  if (to) return new Response(null, { status: 303, headers: { location: to, "cache-control": "no-store", vary: "Cookie, Accept-Language" } });
  const board = url.pathname.match(/^\/(es|pt-br)(\/feedback(?:\/.*)?)$/i);
  if (board && !/^\/feedback\/login(?:[/?#]|$)/.test(board[2])) {
    const { lang: lang2 } = prefixes[board[1].toLowerCase()];
    cookies.set(LANG_COOKIE, lang2, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", secure: url.protocol === "https:" });
    locals.dashLang = lang2;
    return rewrite(`${board[2]}${url.search}`);
  }
  const sentPrefix = (request.headers.get("x-petto-dash-prefix") ?? "").toLowerCase().replace(/^\//, "");
  if (prefixes[sentPrefix] && !["GET", "HEAD"].includes(request.method.toUpperCase()) && /^\/dash(?:\/|$)/.test(url.pathname)) {
    const { lang: lang2, path: path2 } = prefixes[sentPrefix];
    cookies.set(LANG_COOKIE, lang2, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", secure: url.protocol === "https:" });
    locals.dashLang = lang2;
    return keepPrefix(await next(), path2, url.origin);
  }
  const match = url.pathname.match(/^\/(es|pt-br)(\/dash(?:\/.*)?)$/i);
  if (!match || /^\/dash\/lang(?:[/?#]|$)/.test(match[2])) return next();
  const { lang, path } = prefixes[match[1].toLowerCase()];
  if (/^\/dash\/logout\/?$/.test(match[2])) {
    const headers = new Headers({ location: `${path}/dash`, "cache-control": "no-store" });
    headers.append("set-cookie", `petto_session=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${url.protocol === "https:" ? "; Secure" : ""}`);
    return new Response(null, { status: 302, headers });
  }
  cookies.set(LANG_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", secure: url.protocol === "https:" });
  locals.dashLang = lang;
  return keepPrefix(await rewrite(`${match[2]}${url.search}`), path, url.origin);
}
function keepPrefix(response, path, origin) {
  let location = response.headers.get("location");
  if (location && location.startsWith(`${origin}/dash`)) location = location.slice(origin.length);
  if (location && /^\/dash(?:[/?#]|$)/.test(location)) {
    const headers2 = new Headers(response.headers);
    headers2.set("location", `${path}${location}`);
    return new Response(null, { status: response.status, headers: headers2 });
  }
  if (!(response.headers.get("content-type") ?? "").includes("text/html") || !response.body) return response;
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(prefixLinks(response.body, path), { status: response.status, statusText: response.statusText, headers });
}
function withFreshDash(response) {
  if (response.headers.has("cache-control")) return response;
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html") && !type.includes("json")) return response;
  try {
    response.headers.set("Cache-Control", "private, no-cache");
    return response;
  } catch {
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "private, no-cache");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
}

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
