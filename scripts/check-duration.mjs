// Checks the short text of a length of time that the whole dashboard shows (src/utils/formatDuration.ts): 45s, 35m, 1h 5m, 2d 3h, no zero units,
// no plurals, nothing or a negative value handled, and the thousands separator of the language.
// Run: node scripts/check-duration.mjs
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const bundled = await build({ entryPoints: [`${root}src/utils/formatDuration.ts`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const { formatDuration, agoText } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);

const cases = [
  [0, '0s'], [1, '1s'], [45, '45s'], [59, '59s'], [60, '1m'], [61, '1m'], [119, '1m'], [120, '2m'], [35 * 60, '35m'], [59 * 60, '59m'], [59 * 60 + 59, '59m'],
  [3599.6, '1h'], [3600, '1h'], [60 * 60, '1h'], [61 * 60, '1h 1m'], [65 * 60, '1h 5m'], [2 * 3600, '2h'], [2 * 3600 + 30, '2h'], [5 * 3600 + 59 * 60, '5h 59m'],
  [24 * 3600, '1d'], [25 * 3600, '1d 1h'], [25 * 3600 + 20 * 60, '1d 1h'], [2 * 86_400 + 3 * 3600, '2d 3h'], [3 * 86_400, '3d'], [30 * 86_400, '30d'], [400 * 86_400, '400d'],
  [-90, '-1m'], [-45, '-45s'], [-3 * 3600, '-3h'], [-0.2, '0s'],
  [null, '—'], [undefined, '—'], [NaN, '—'], [Infinity, '—'], ['300', '5m'], ['abc', '—'],
];
for (const [input, expected] of cases) assert.equal(formatDuration(input), expected, `${String(input)} -> ${expected}`);
assert.equal(formatDuration(null, { empty: '' }), '', 'a place can choose what nothing looks like');
assert.equal(formatDuration(1234 * 3600), '51d 10h', 'a day is the biggest unit by default');
assert.equal(formatDuration(1234 * 3600 + 5 * 60, { max: 'w' }), '7w 2d', 'weeks only where they are allowed');
assert.equal(formatDuration(100 * 86_400, { max: 'mo' }), '3mo 10d', 'months only where they are allowed');
assert.equal(formatDuration(400 * 86_400, { max: 'y' }), '1y 1mo', 'years only where they are allowed');
assert.equal(formatDuration(3 * 86_400 + 4 * 3600, { max: 'w' }), '3d 4h', 'less than a week stays in days');
assert.equal(formatDuration(12_345 * 86_400, { locale: 'en-US' }), '12,345d', 'thousands separator (English)');
assert.equal(formatDuration(12_345 * 86_400, { locale: 'es' }), '12.345d', 'thousands separator (Spanish)');
assert.match(formatDuration(12_345 * 86_400, { locale: 'de-DE' }), /^12\.345d$/, 'thousands separator (German)');
for (const text of [0, 45, 61, 3600, 7200, 3661, 90_000, 200_000].map((s) => formatDuration(s))) assert.doesNotMatch(text, /\b0[hm]\b|s$.*s|hours?|minutes?|seconds?/, `${text} has no zero unit and no long words`);
// The "ago" text: the same short form, with the three texts of the page.
const dt = (key, vars = {}) => key.replace('{a}', vars.a);
const now = Date.parse('2026-11-06T12:00:00Z');
assert.equal(agoText(dt, '2026-11-06T11:59:30Z', { now }), 'just now');
assert.equal(agoText(dt, '2026-11-06T11:55:00Z', { now }), '5m ago');
assert.equal(agoText(dt, '2026-11-06T10:55:00Z', { now }), '1h 5m ago');
assert.equal(agoText(dt, '2026-11-04T09:00:00Z', { now }), '2d 3h ago');
assert.equal(agoText(dt, '2026-11-06T12:30:00Z', { now }), 'in 30m');
assert.equal(agoText(dt, null, { now }), '—');
assert.equal(agoText(dt, 'not a date', { now, empty: '' }), '');
// The function stays self-contained: its source is copied into pages that format times in their own script.
const copy = new Function(`return ${formatDuration.toString()}`)();
assert.equal(copy(3661), '1h 1m', 'the source of the function works on its own');
console.log('Duration checks passed.');
