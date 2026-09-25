import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const astroCli = fileURLToPath(new URL('../node_modules/astro/astro.js', import.meta.url));
const child = spawn(process.execPath, [astroCli, 'build'], {
  stdio: 'inherit',
  env: { ...process.env, ASTRO_TARGET: 'discloud' },
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
