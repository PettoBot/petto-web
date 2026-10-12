import { existsSync } from 'node:fs';
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
const STATIC_PAGE_CACHE = 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400, stale-if-error=86400';
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
      value = path.startsWith('/_astro/') ? HASHED_FILE_CACHE : MEDIA_FILE.test(path) ? STATIC_FILE_CACHE : STATIC_PAGE_CACHE;
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
    if (!COMPRESSIBLE.test(type)) return;
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

// The proxy in front of the site (Caddy, behind Cloudflare) keeps connections open and reuses them. Node closes an idle connection after 5 seconds
// by default, so a request sent on a connection that was just closed can hang until something gives up. Keeping the connections open longer than
// the proxy does avoids that. This is set on the server that Astro creates, which is not reachable from here, so the creation is wrapped.
const createServer = http.createServer.bind(http);
http.createServer = (...args) => {
  const index = args.findIndex((arg) => typeof arg === 'function');
  if (index !== -1) args[index] = withCompression(withStaticCache(args[index]));
  const server = createServer(...args);
  server.keepAliveTimeout = 75_000;
  server.headersTimeout = 80_000;
  return server;
};

await import(entry.href);

// The first request loads the middleware, which opens the database connections kept ready and connects to Redis. Making it
// here, right after start, means no visitor waits for that.
setTimeout(() => {
  fetch(`http://127.0.0.1:${process.env.PORT}/version.json`).then((res) => res.arrayBuffer()).catch(() => {});
}, 300).unref?.();
