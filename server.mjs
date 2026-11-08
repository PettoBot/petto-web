import { existsSync, readdirSync } from 'node:fs';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

process.env.HOST ||= '0.0.0.0';
process.env.PORT ||= '8080';

const root = fileURLToPath(new URL('.', import.meta.url));
const entry = new URL('./build/dist/server/entry.mjs', import.meta.url);

// Discloud's builder compiles the site, but the container that runs it can come up without the build folder
// (it is git-ignored). If it is missing, build it here once instead of crashing in a loop.
const marker = new URL('./build/.built', import.meta.url);
if (!existsSync(entry) || !existsSync(marker)) {
  console.warn('[server] the build is missing or unfinished, building the site now (about a minute)...');
  const env = { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=700' };
  const run = (command, args) => spawnSync(command, args, { cwd: root, env, stdio: 'inherit', shell: process.platform === 'win32' });
  if (!existsSync(new URL('./node_modules/astro/package.json', import.meta.url))) run('npm', ['install', '--no-audit', '--no-fund']);
  run(process.execPath, ['scripts/build.mjs', '--discloud']);
  if (!existsSync(entry) || !existsSync(marker)) {
    console.error('[server] The build did not finish. Check the build errors above.');
    process.exit(1);
  }
}

// Static files (the prerendered pages and everything in public/) are sent with "public, max-age=0", the default of the library Astro uses.
// Cloudflare then asks this server again on every visit, and when that request is slow the page is slow too. Discord drops a link preview
// whose page and images take more than 10 seconds, so the previews failed on some links. Letting Cloudflare keep those files avoids the trip.
// Only that exact default is replaced, so the dashboard and the other server-rendered pages keep their own headers.
// The files hashed by the build already get a one-year header from Astro.
// Cloudflare answers static pages from its copy at once and refreshes it in the background (stale-while-revalidate), so a visitor
// never waits for the trip from Cloudflare to this server, which is sometimes slow (seconds). A copy from an older deploy is not a
// problem: each page checks /version.json and reloads itself once when it is old (Base.astro).
const STATIC_PAGE_CACHE = 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400, stale-if-error=86400';
const STATIC_FILE_CACHE = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800, stale-if-error=604800';
// Images, videos and fonts change rarely and are kept longer. Pages, version.json, the sitemap and the rest follow the pages.
const MEDIA_FILE = /\.(?:png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|woff2?|ttf|otf)$/i;
// The files under /_astro/ have the hash of their content in their name, so a browser may keep them for good.
const HASHED_FILE_CACHE = 'public, max-age=31536000, immutable';
const withStaticCache = (listener) => (req, res) => {
  const setHeader = res.setHeader.bind(res);
  res.setHeader = (name, value) => {
    if (String(name).toLowerCase() === 'cache-control' && value === 'public, max-age=0') {
      const path = (req.url ?? '/').split('?')[0];
      value = path === '/version.json' ? 'no-store' : path === '/sw.js' ? 'no-cache' : path.startsWith('/_astro/') ? HASHED_FILE_CACHE : MEDIA_FILE.test(path) ? STATIC_FILE_CACHE : STATIC_PAGE_CACHE;
    }
    return setHeader(name, value);
  };
  return listener(req, res);
};

// Pages, styles, scripts and JSON go out compressed (brotli when the browser takes it, gzip otherwise): a dashboard page is
// about five times smaller on the wire. Pictures, fonts and anything already compressed go as they are. The page is still sent
// while it renders: what is compressed so far is flushed as soon as the renderer pauses.
const COMPRESSIBLE = /^(?:text\/|application\/(?:json|javascript|x-javascript|xml|rss\+xml|atom\+xml|manifest\+json|ld\+json|xhtml\+xml)|image\/svg\+xml)/i;
const MIN_COMPRESS_BYTES = 1024;
const pickEncoding = (header) => {
  const accepted = new Map();
  for (const part of String(header ?? '').toLowerCase().split(',')) {
    const [name, ...params] = part.trim().split(';');
    const q = params.map((p) => /^\s*q=([\d.]+)/.exec(p)).find(Boolean);
    if (name) accepted.set(name.trim(), q ? Number(q[1]) : 1);
  }
  if ((accepted.get('br') ?? 0) > 0) return 'br';
  if ((accepted.get('gzip') ?? 0) > 0) return 'gzip';
  return null;
};
const withCompression = (listener) => (req, res) => {
  const encoding = req.method === 'HEAD' ? null : pickEncoding(req.headers['accept-encoding']);
  if (!encoding) return listener(req, res);

  const write = res.write.bind(res);
  const end = res.end.bind(res);
  const writeHead = res.writeHead.bind(res);
  let decided = false;
  let zipper = null;
  let flushQueued = false;

  const decide = () => {
    if (decided) return;
    decided = true;
    if (res.headersSent) return;
    const type = String(res.getHeader('content-type') ?? '');
    // A stream of events (the dashboard's live stamp) must reach the browser line by line, so it is never compressed.
    if (!COMPRESSIBLE.test(type) || /event-stream/i.test(type)) return;
    // A cache in front keeps one copy per encoding.
    const vary = String(res.getHeader('vary') ?? '');
    if (!/accept-encoding|\*/i.test(vary)) res.setHeader('Vary', vary ? `${vary}, Accept-Encoding` : 'Accept-Encoding');
    const status = res.statusCode;
    const length = Number(res.getHeader('content-length'));
    if (res.getHeader('content-encoding') || status < 200 || status === 204 || status === 206 || status === 304) return;
    if (Number.isFinite(length) && length < MIN_COMPRESS_BYTES) return;
    if (/no-transform/i.test(String(res.getHeader('cache-control') ?? ''))) return;
    res.setHeader('Content-Encoding', encoding);
    res.removeHeader('Content-Length');
    zipper = encoding === 'br'
      ? zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4, [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT } })
      : zlib.createGzip({ level: 6 });
    zipper.on('data', (chunk) => { if (!write(chunk)) zipper.pause(); });
    // Whoever writes into the page (a file piped by the static server, the renderer) waits for 'drain' when write() said the
    // compressor is full; that comes from the compressor, not from the socket.
    zipper.on('drain', () => res.emit('drain'));
    zipper.on('end', () => end());
    zipper.on('error', () => { try { res.destroy(); } catch { /* already gone */ } });
    res.on('drain', () => { if (zipper.isPaused()) zipper.resume(); });
    res.on('close', () => { if (!zipper.destroyed && !res.writableFinished) zipper.destroy(); });
  };
  const flushSoon = () => {
    if (flushQueued || !zipper) return;
    flushQueued = true;
    setImmediate(() => {
      flushQueued = false;
      if (zipper && !zipper.destroyed && !zipper.writableEnded) zipper.flush(encoding === 'br' ? zlib.constants.BROTLI_OPERATION_FLUSH : zlib.constants.Z_SYNC_FLUSH);
    });
  };

  res.writeHead = (status, ...args) => {
    if (!decided) {
      res.statusCode = status;
      let reason;
      for (const arg of args) {
        if (typeof arg === 'string') reason = arg;
        else if (Array.isArray(arg)) {
          // [name, value, name, value...] or [[name, value]...]
          if (Array.isArray(arg[0])) for (const [name, value] of arg) res.setHeader(name, value);
          else for (let i = 0; i + 1 < arg.length; i += 2) res.setHeader(arg[i], arg[i + 1]);
        } else if (arg && typeof arg === 'object') {
          for (const [name, value] of Object.entries(arg)) if (value !== undefined) res.setHeader(name, value);
        }
      }
      if (reason) res.statusMessage = reason;
      decide();
      return writeHead(status);
    }
    return writeHead(status, ...args);
  };
  res.write = (chunk, encodingOrCallback, callback) => {
    decide();
    if (!zipper) return write(chunk, encodingOrCallback, callback);
    const done = typeof encodingOrCallback === 'function' ? encodingOrCallback : callback;
    const ok = typeof encodingOrCallback === 'string' ? zipper.write(chunk, encodingOrCallback, done) : zipper.write(chunk, done);
    flushSoon();
    return ok;
  };
  res.end = (chunk, encodingOrCallback, callback) => {
    decide();
    if (!zipper) return end(chunk, encodingOrCallback, callback);
    const done = typeof chunk === 'function' ? chunk : typeof encodingOrCallback === 'function' ? encodingOrCallback : callback;
    if (done) res.once('finish', () => done());
    if (chunk !== undefined && chunk !== null && typeof chunk !== 'function') {
      if (typeof encodingOrCallback === 'string') zipper.end(chunk, encodingOrCallback);
      else zipper.end(chunk);
    } else {
      zipper.end();
    }
    return res;
  };
  return listener(req, res);
};

// How long each dashboard request takes here, from its first byte in to its last byte out, with its Server-Timing parts: the owner's
// /dash/health page shows the last 500 (src/utils/latencyStats.ts keeps them in Redis too, so a restart does not wipe them). Kept in
// memory only, nothing is written per request. The live stream, the stamp a page asks for, the health page itself and the progress the
// verification card asks for every moment while a setup runs, and the live tickets a page reads every few seconds, are left out.
const LATENCY_KEEP = 500;
const latency = (globalThis.__pettoLatency ??= { entries: [], max: LATENCY_KEEP, total: 0 });
const DASH_REQUEST = /^\/(?:(?:es|pt-br)\/)?dash(?:\/|$)/i;
const NOT_A_PAGE = /\/(?:events|version|health|bot-ping|verification-status|tickets-live)\/?$/;
const latencyPath = (url) => {
  const [rawPath, query = ''] = url.split('?');
  const path = rawPath.replace(/^\/(?:es|pt-br)(?=\/dash)/i, '').replace(/\/\d{5,25}(?=\/|$)/g, '/:id').replace(/\/+$/, '') || '/';
  const section = /(?:^|&)section=([\w-]{1,40})/.exec(query)?.[1];
  return section ? `${path}?section=${section}` : path;
};
// The server's own warm-up reads (below) are not visits: they used to be counted, and the first one after each deploy, which loads the
// code of the dashboard, made /dash look slow.
const WARMUP_AGENT = 'petto-warmup';
const SLOW_REQUEST_MS = 2500;
const slowSeen = new Map();
const withLatency = (listener) => (req, res) => {
  const url = req.url ?? '/';
  if (!DASH_REQUEST.test(url) || NOT_A_PAGE.test(url.split('?')[0]) || req.headers['user-agent'] === WARMUP_AGENT) return listener(req, res);
  const started = performance.now();
  res.once('finish', () => {
    const entry = { p: latencyPath(url), u: url.split('?')[0], cl: Number(req.headers['content-length'] ?? -1), m: req.method, s: res.statusCode, t: Math.round(performance.now() - started), st: String(res.getHeader('server-timing') ?? ''), at: Date.now() };
    // A failed dashboard request, or any change that was not answered with a page or a redirect, is said in the log of the host: the page
    // that was asked, the status and what the browser sent (a size and a kind of body, never what was in it).
    if (entry.s >= 400 || (!['GET', 'HEAD'].includes(String(req.method)) && entry.s >= 300 && entry.s < 400)) {
      console.warn(`[web] ${req.method} ${entry.u} -> ${entry.s} (${entry.t} ms, body ${req.headers['content-length'] ?? '?'} bytes, ${String(req.headers['content-type'] ?? 'no type').split(';')[0]}, from ${req.headers.referer ? new URL(req.headers.referer, 'http://x').pathname : 'no referer'})`);
    }
    // A dashboard page that took a long to answer says so in the log of the host, with where its time went (the Server-Timing parts: auth, db,
    // discord, bot, render), so a slow page can be traced without guessing. At most one line for each path every 20 seconds.
    if (entry.t >= SLOW_REQUEST_MS && entry.s < 400 && !(slowSeen.get(entry.p) > Date.now() - 20_000)) {
      if (slowSeen.size > 200) slowSeen.clear();
      slowSeen.set(entry.p, Date.now());
      console.warn(`[web] slow ${req.method} ${entry.u} (${entry.t} ms, ${entry.st || 'no timing'})`);
    }
    latency.entries.push(entry);
    latency.total += 1;
    if (latency.entries.length > latency.max) latency.entries.splice(0, latency.entries.length - latency.max);
  });
  return listener(req, res);
};

// A save sent to /es/dash/... or /pt-br/dash/... (a form posts to the address of its page) goes straight to the real /dash/... route here.
// Astro's rewrite of the prefix answered some of those saves "404 Not found" in about 5 ms on the host (Customize and the timers lost
// their changes), while the same save without the prefix always worked. The language is already in the cookie the prefixed page set,
// so the answer comes in the same language; its redirects go to /dash/..., which sends the browser back to the prefixed address.
// Reading pages (GET, HEAD) keeps going through the prefix, so the address bar keeps saying the language. Logging out keeps its own path.
const PREFIXED_DASH_CHANGE = /^\/(?:es|pt-br)(\/dash(?:[/?#]|$).*)$/i;
const withUnprefixedChanges = (listener) => (req, res) => {
  const method = String(req.method ?? 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') {
    const match = PREFIXED_DASH_CHANGE.exec(req.url ?? '');
    if (match && !/^\/dash\/(?:logout|lang)(?:[/?#]|$)/i.test(match[1])) {
      // The prefix it had goes along, so the answer keeps the language on its links and redirects (src/middleware.ts).
      req.headers['x-petto-dash-prefix'] = req.url.slice(0, req.url.length - match[1].length);
      req.url = match[1];
    } else {
      delete req.headers['x-petto-dash-prefix'];
    }
  }
  return listener(req, res);
};

// The proxy in front of the site (Caddy, behind Cloudflare) keeps connections open and reuses them. Node closes an idle connection after 5 seconds
// by default, so a request sent on a connection that was just closed can hang until something gives up. Keeping the connections open longer than
// the proxy does avoids that. This is set on the server that Astro creates, which is not reachable from here, so the creation is wrapped.
const createServer = http.createServer.bind(http);
http.createServer = (...args) => {
  const index = args.findIndex((arg) => typeof arg === 'function');
  if (index !== -1) args[index] = withLatency(withUnprefixedChanges(withCompression(withStaticCache(args[index]))));
  const server = createServer(...args);
  server.keepAliveTimeout = 75_000;
  server.headersTimeout = 80_000;
  return server;
};

await import(entry.href);

// The first request loads the middleware, which opens the database connections kept ready and connects to Redis. Making it
// here, right after start, means no visitor waits for that. Then the pages and the lists a first visitor would wait for are
// asked once (each one loads its code the first time it is used), and the cheap warm-up is repeated so the caches do not go cold.
const origin = () => `http://127.0.0.1:${process.env.PORT}`;
const touch = (path) => fetch(`${origin()}${path}`, { headers: { 'user-agent': WARMUP_AGENT }, redirect: 'manual' }).then((res) => res.arrayBuffer()).catch(() => {});
// The pages of a server, by the files of the build: each one loads its code (and the menu's) the first time it is asked for. Asked for
// a server id that is not one, a page stops at the session check, so this only loads code and reads nothing.
const GUILD_PAGES = new URL('./build/dist/server/pages/dash/guild/_id_/', import.meta.url);
const NOT_A_GUILD_PAGE = /-(?:api|file|image|live|export|import|restore|status|search|preview)$|^(?:events|version|live|role-blocks)$/;
const guildPages = () => {
  try {
    return readdirSync(GUILD_PAGES).filter((file) => file.endsWith('.astro.mjs')).map((file) => file.slice(0, -'.astro.mjs'.length)).filter((name) => !NOT_A_GUILD_PAGE.test(name));
  } catch {
    return [];
  }
};
setTimeout(async () => {
  await touch('/version.json');
  await touch('/api/warm');
  // The server-rendered pages load their code on the first visit; the dashboard entry and the status page are the usual first ones.
  for (const path of ['/dash', '/dash/manage', '/status', '/']) await touch(path);
  for (const name of guildPages()) await touch(`/dash/guild/0/${name}`);
}, 300).unref?.();
setInterval(() => { touch('/api/warm'); }, 4 * 60_000).unref?.();

// Every 2 minutes the site records its own status checks (the bot's heartbeat, the website, the database) for the status page's history:
// the app does the work (/api/status-check, with the secret it shares with the bot), this only asks at the start of each window. A first
// round soon after start fills in what a restart missed. The checks of the bot's side are written by the bot.
const STATUS_WINDOW_MS = 2 * 60_000;
const statusKey = process.env.PETTO_BOT_API_SECRET;
if (statusKey) {
  const checkNow = () => fetch(`${origin()}/api/status-check`, { method: 'POST', headers: { 'user-agent': WARMUP_AGENT, 'x-petto-status-key': statusKey } }).then((res) => res.arrayBuffer()).catch(() => {});
  const scheduleCheck = () => {
    const now = Date.now();
    const next = Math.floor(now / STATUS_WINDOW_MS) * STATUS_WINDOW_MS + STATUS_WINDOW_MS + 50_000;
    setTimeout(() => { checkNow().finally(scheduleCheck); }, next - now).unref?.();
  };
  setTimeout(checkNow, 20_000).unref?.();
  scheduleCheck();
}
