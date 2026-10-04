import { existsSync } from 'node:fs';
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
  const env = { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=300' };
  const run = (command, args) => spawnSync(command, args, { cwd: root, env, stdio: 'inherit', shell: process.platform === 'win32' });
  if (!existsSync(new URL('./node_modules/astro/package.json', import.meta.url))) run('npm', ['install', '--no-audit', '--no-fund']);
  run(process.execPath, ['scripts/build.mjs', '--discloud']);
  if (!existsSync(entry) || !existsSync(marker)) {
    console.error('[server] The build did not finish. Check the build errors above.');
    process.exit(1);
  }
}

await import(entry.href);
