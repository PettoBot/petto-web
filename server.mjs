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

// The proxy in front of the site (Caddy, behind Cloudflare) keeps connections open and reuses them. Node closes an idle connection after 5 seconds
// by default, so a request sent on a connection that was just closed can hang until something gives up. Keeping the connections open longer than
// the proxy does avoids that. This is set on the server that Astro creates, which is not reachable from here, so the creation is wrapped.
const createServer = http.createServer.bind(http);
http.createServer = (...args) => {
  const server = createServer(...args);
  server.keepAliveTimeout = 75_000;
  server.headersTimeout = 80_000;
  return server;
};

await import(entry.href);
