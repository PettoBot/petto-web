import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// One `npm run build` for both hosts. Cloudflare is the default. Discloud's builder runs `npm run build`
// itself (it ignores BUILD in discloud.config) inside /home/node, and there the Node build is the one it needs.
// ASTRO_TARGET=discloud, or the same line in a .env file, forces it from anywhere.
function fromDotenv() {
  try {
    return /^\s*ASTRO_TARGET\s*=\s*["']?(\w+)/m.exec(readFileSync('.env', 'utf8'))?.[1];
  } catch {
    return undefined;
  }
}

const onCloudflare = Boolean(process.env.WORKERS_CI || process.env.CF_PAGES);
const target = (process.argv.includes('--discloud') ? 'discloud' : process.env.ASTRO_TARGET) || fromDotenv() || (!onCloudflare && process.cwd() === '/home/node' ? 'discloud' : 'cloudflare');
console.log(`Building for ${target}`);

// A build that was killed half way leaves build/dist/server/entry.mjs behind without the rest.
// Only a finished build gets the marker, and server.mjs trusts nothing else.
if (target === 'discloud') rmSync('build', { recursive: true, force: true });

const astroCli = fileURLToPath(new URL('../node_modules/astro/astro.js', import.meta.url));
const build = spawnSync(process.execPath, [astroCli, 'build'], { stdio: 'inherit', env: { ...process.env, ASTRO_TARGET: target } });
if (build.status !== 0) process.exit(build.status ?? 1);

if (target === 'discloud') {
  writeFileSync('build/.built', new Date().toISOString());
} else {
  const ignore = spawnSync(process.execPath, [fileURLToPath(new URL('./write-assetsignore.mjs', import.meta.url))], { stdio: 'inherit' });
  process.exit(ignore.status ?? 0);
}
