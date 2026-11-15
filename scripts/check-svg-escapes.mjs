// An SVG that is not well-formed XML does not draw: the browser shows a broken picture. The usual mistake is a bare `&` in a text ("Web & docs"):
// it has to be `&amp;`. This looks for it in every SVG of public/.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
let count = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) { walk(file); continue; }
    if (!name.endsWith('.svg')) continue;
    count += 1;
    const text = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
    text.split('\n').forEach((line, index) => {
      if (/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(line)) problems.push(`${path.relative(root, file)}:${index + 1}: a bare "&" (write &amp;)`);
    });
  }
}
walk(path.join(root, 'public'));
assert.ok(count > 0, 'no SVG found');
assert.deepEqual(problems, [], `SVG files that do not draw:\n${problems.join('\n')}`);
console.log(`Checked ${count} SVG files: no bare "&".`);
