import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Deploying to Workers uploads ./dist as static assets, which would otherwise publish
// dist/_worker.js/ — the compiled server code, including session signing and Supabase calls —
// straight to the public internet. Wrangler only skips it if this file exists, and dist/ is
// rebuilt from scratch every time, so it has to be regenerated after each build rather than
// committed once.
const target = resolve('dist/.assetsignore');
writeFileSync(target, '_worker.js\n_routes.json\n');
console.log('wrote dist/.assetsignore');
