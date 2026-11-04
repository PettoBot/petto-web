// Reads the site's own texts (src/i18n/ui.ts, TypeScript) from a build script: it is bundled with esbuild (a dependency of Vite, so it is
// already installed) into a temporary file and imported. Only the texts are used, never the pages.
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Any TypeScript file of the site, bundled the same way (its JSON and its .mjs imports included), to be used from a check. */
export async function loadTs(relativePath) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'petto-ts-'));
  const outfile = path.join(dir, 'module.mjs');
  try {
    await build({ entryPoints: [path.join(root, relativePath)], bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent', define: { __ES_ROUTES__: '[]', __DIRECT_DB__: 'false', __NODE_TARGET__: 'false', __APP_VERSION__: '"0"', __BUILD_TIME__: '"0"', __BUILD_COMMIT__: '""', __BUILD_TARGET__: '"og"' } });
    return await import(pathToFileURL(outfile).href);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

export async function loadUi() {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'petto-ui-'));
  const outfile = path.join(dir, 'ui.mjs');
  try {
    await build({ entryPoints: [path.join(root, 'src/i18n/ui.ts')], bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent', define: { __ES_ROUTES__: '[]', __DIRECT_DB__: 'false', __NODE_TARGET__: 'false', __APP_VERSION__: '"0"', __BUILD_TIME__: '"0"', __BUILD_COMMIT__: '""', __BUILD_TARGET__: '"og"' } });
    return await import(pathToFileURL(outfile).href);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
