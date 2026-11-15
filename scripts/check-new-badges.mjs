// Every "New" badge of the site says the day the thing came out (`since`, YYYY-MM-DD), so it goes by itself after a few days
// (src/utils/newBadge.ts): no `isNew: true` written by hand, and no menu or footer badge without its day.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { loadTs } from './og/load-copy.mjs';

const { isStillNew, NEW_FOR_DAYS } = await loadTs('src/utils/newBadge.ts');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) walk(file);
    else if (/\.(astro|ts|mjs)$/.test(name)) {
      const text = readFileSync(file, 'utf8');
      const rel = path.relative(root, file);
      text.split('\n').forEach((line, index) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
        if (/\bisNew:\s*true\b/.test(line)) problems.push(`${rel}:${index + 1}: isNew: true stays forever, write isNew: isStillNew('YYYY-MM-DD') (or since: 'YYYY-MM-DD')`);
        for (const match of line.matchAll(/\bisStillNew\('([^']*)'\)/g)) if (!/^\d{4}-\d{2}-\d{2}$/.test(match[1]) || Number.isNaN(Date.parse(match[1]))) problems.push(`${rel}:${index + 1}: "${match[1]}" is not a day (YYYY-MM-DD)`);
        for (const match of line.matchAll(/\bsince:\s*'([^']*)'/g)) if (/badge|isNew|href/.test(line) && !/^\d{4}-\d{2}-\d{2}$/.test(match[1])) problems.push(`${rel}:${index + 1}: since "${match[1]}" is not a day (YYYY-MM-DD)`);
        // A menu or footer item with a badge has to say its day.
        if (/\bbadge:\s*'[^']+'/.test(line) && /\bhref:/.test(line) && !/\bsince:\s*'\d{4}-\d{2}-\d{2}'/.test(line)) problems.push(`${rel}:${index + 1}: a badge without its day (since: 'YYYY-MM-DD')`);
      });
    }
  }
}
walk(path.join(root, 'src'));
assert.deepEqual(problems, [], `New badges:\n${problems.join('\n')}`);

// The rule: new for NEW_FOR_DAYS days from the day it came out, and not before.
assert.equal(NEW_FOR_DAYS, 10);
const day = Date.parse('2026-11-05T00:00:00Z');
assert.equal(isStillNew('2026-11-05', day), true, 'the first day');
assert.equal(isStillNew('2026-11-05', day + 9.9 * 86_400_000), true, 'almost ten days');
assert.equal(isStillNew('2026-11-05', day + 10 * 86_400_000), false, 'ten days: the badge is gone');
assert.equal(isStillNew('2026-11-05', day - 1), false, 'not before it came out');
assert.equal(isStillNew(undefined, day), false, 'no day, not new');
assert.equal(isStillNew('soon', day), false, 'not a day, not new');
console.log('Checked the New badges: every one has its day, and they go after ten days.');
