import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const target = resolve('dist/.assetsignore');
writeFileSync(target, '_worker.js\n_routes.json\n');
console.log('wrote dist/.assetsignore');
