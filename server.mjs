import { existsSync } from 'node:fs';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
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
const withStaticCache = (listener) => (req, res) => {
  const setHeader = res.setHeader.bind(res);
  res.setHeader = (name, value) => {
    if (String(name).toLowerCase() === 'cache-control' && value === 'public, max-age=0') {
      const path = (req.url ?? '/').split('?')[0];
      value = MEDIA_FILE.test(path) ? STATIC_FILE_CACHE : STATIC_PAGE_CACHE;
    }
    return setHeader(name, value);
  };
  return listener(req, res);
};

// The proxy in front of the site (Caddy, behind Cloudflare) keeps connections open and reuses them. Node closes an idle connection after 5 seconds
// by default, so a request sent on a connection that was just closed can hang until something gives up. Keeping the connections open longer than
// the proxy does avoids that. This is set on the server that Astro creates, which is not reachable from here, so the creation is wrapped.
const createServer = http.createServer.bind(http);
http.createServer = (...args) => {
  const index = args.findIndex((arg) => typeof arg === 'function');
  if (index !== -1) args[index] = withStaticCache(args[index]);
  const server = createServer(...args);
  server.keepAliveTimeout = 75_000;
  server.headersTimeout = 80_000;
  return server;
};

await import(entry.href);
