// Checks the pure logic of the shared chart tooltip (src/scripts/chart-tip.js): which point the pointer means (the nearest one, with a little
// hysteresis around the middle of two points), the timing constants of the motion and that the CSS (DashChartTip.astro) says the same
// numbers, and that reduced motion switches every transition off.
// Run: node scripts/check-chart-tip.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const code = read('src/scripts/chart-tip.js');
const css = read('src/components/DashChartTip.astro');

// The script runs in a bare sandbox: it only needs somewhere to hang its listeners.
const listeners = [];
const sandbox = {
  window: { addEventListener: (...args) => listeners.push(args), matchMedia: () => ({ matches: false }), requestAnimationFrame: (fn) => setTimeout(fn, 0) },
  document: { addEventListener: (...args) => listeners.push(args), documentElement: { lang: 'en', clientWidth: 1280 } },
  WeakMap, Math, Object, Array, JSON, Number, String, Infinity, clearTimeout, setTimeout,
};
sandbox.window.window = sandbox.window;
vm.runInNewContext(code, sandbox);
const api = sandbox.window.__dglChartTips;
assert.ok(api && typeof api.pickIndex === 'function', 'the script exposes its pure logic');
const { TIMING, nearestIndex, pickIndex } = api;
// Binding twice does nothing (the page can carry the script more than once).
const bound = listeners.length;
vm.runInNewContext(code, sandbox);
assert.equal(listeners.length, bound, 'it binds once to the document');
assert.ok(bound > 0);

// ── The nearest point ──
const xs = [0, 0.25, 0.5, 0.75, 1];
assert.equal(nearestIndex(xs, -0.3), 0);
assert.equal(nearestIndex(xs, 0.1), 0);
assert.equal(nearestIndex(xs, 0.16), 1);
assert.equal(nearestIndex(xs, 0.5), 2);
assert.equal(nearestIndex(xs, 0.99), 4);
assert.equal(nearestIndex(xs, 3), 4);
assert.equal(nearestIndex([], 0.4), 0, 'no points: index 0, never NaN');
assert.equal(nearestIndex([0.5], 0.9), 0);
// Uneven gaps (a chart with a gap of days): the nearest in x, not in the order.
assert.equal(nearestIndex([0, 0.1, 0.9, 1], 0.45), 1);
assert.equal(nearestIndex([0, 0.1, 0.9, 1], 0.55), 2);

// ── Hysteresis: the point shown is kept around the middle of two points ──
assert.equal(pickIndex(xs, 0.24, -1), 1, 'nothing shown yet: the nearest');
assert.equal(pickIndex(xs, 0.126, 0), 0, 'just past the middle of 0 and 1 it still shows 0');
assert.equal(pickIndex(xs, 0.124, 0), 0);
assert.equal(pickIndex(xs, 0.17, 0), 1, 'clearly nearer to 1: it moves');
assert.equal(pickIndex(xs, 0.124, 1), 1, 'and keeps 1 on the way back around the middle');
assert.equal(pickIndex(xs, 0.08, 1), 0, 'until it is clearly nearer to 0');
// A fast jump over several points is not held back.
assert.equal(pickIndex(xs, 0.95, 0), 4);
assert.equal(pickIndex(xs, 0.5, 4), 2);
// A stale index (a chart that now has fewer points) falls back to the nearest.
assert.equal(pickIndex(xs, 0.5, 99), 2);
// The margin moves the dead zone: with none, it is the plain nearest point.
assert.equal(pickIndex(xs, 0.126, 0, 0), 1);
// Every point is reachable from every other by moving the pointer onto it.
for (let from = 0; from < xs.length; from += 1) for (let to = 0; to < xs.length; to += 1) assert.equal(pickIndex(xs, xs[to], from), to);

// ── The timing ──
const within = (value, lo, hi, name) => assert.ok(value >= lo && value <= hi, `${name} is ${value}, wanted ${lo} to ${hi}`);
within(TIMING.glideMs, 140, 220, 'glide');
within(TIMING.fadeInMs, 100, 140, 'fade in');
within(TIMING.hideDelayMs, 80, 120, 'hide delay');
within(TIMING.fadeOutMs, 100, 200, 'fade out');
within(TIMING.swapMs, 0, 150, 'cross-fade of the content');
within(TIMING.hysteresis, 0.1, 0.35, 'hysteresis');

// The CSS says the same numbers (one source of truth for the motion).
const cssMs = (name) => {
  const match = new RegExp(`--${name}:\\s*(\\d+)ms`).exec(css);
  assert.ok(match, `--${name} is in DashChartTip.astro`);
  return Number(match[1]);
};
assert.equal(cssMs('ct-glide'), TIMING.glideMs, 'CSS glide = script glide');
assert.equal(cssMs('ct-in'), TIMING.fadeInMs, 'CSS fade in = script fade in');
assert.equal(cssMs('ct-out'), TIMING.fadeOutMs, 'CSS fade out = script fade out');
// An ease-out curve for the glide (the curve rises fast and settles: its first control point is above the diagonal).
const ease = /--ct-ease:\s*cubic-bezier\(([^)]+)\)/.exec(css);
assert.ok(ease, 'the glide has a cubic-bezier curve');
const [x1, y1, x2, y2] = ease[1].split(',').map(Number);
assert.ok(y1 > x1 && y2 >= x2 && y2 <= 1.0001, 'it is an ease-out curve');
// The glide is a transform transition (never top/left), on the box, the guide and the dots.
assert.match(css, /\.ct-guide, \.ct-dot, \.ct-tip \{[^}]*transition: transform var\(--ct-glide\) var\(--ct-ease\)/, 'the three glide with a transform transition');
assert.match(css, /\.ct-on [^{]*\{[^}]*opacity: 1; transition: transform var\(--ct-glide\) var\(--ct-ease\), opacity var\(--ct-in\)/, 'it fades in with --ct-in');
// Reduced motion: every transition off, and the script skips the delay and the cross-fade.
const reduce = /@media \(prefers-reduced-motion: reduce\) \{([^}]*\{[^}]*\})\s*\}/.exec(css);
assert.ok(reduce && /transition: none/.test(reduce[1]), 'prefers-reduced-motion switches the transitions off');
for (const selector of ['.ct-guide', '.ct-dot', '.ct-tip', '.ct-on .ct-tip', '.ct-snap .ct-tip']) assert.ok(reduce[1].includes(selector), `${selector} is instant with reduced motion`);
assert.match(code, /prefers-reduced-motion: reduce/, 'the script asks for reduced motion');
assert.match(code, /function closeSoon\(\)[^]*calm\(\)[^]*close\(\)/, 'with reduced motion the box closes at once');
assert.match(code, /!calm\(\) && changed\.length/, 'no cross-fade with reduced motion');
// The pointer is read once per frame, not on every move; touch and keyboard are still there.
assert.match(code, /requestAnimationFrame/, 'the pointer is read once per frame');
for (const piece of ["e.key === 'Escape'", "'ArrowLeft'", "'ArrowRight'", "'Home'", "'End'", "'touch'", "pointerdown"]) assert.ok(code.includes(piece), `${piece} is still handled`);

console.log('chart tooltip: all checks passed');
