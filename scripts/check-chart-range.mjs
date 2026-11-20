// Checks the rules of the movable window of the statistics charts (src/utils/chartRange.ts), the markup that statsChart.mjs writes for it, and that the
// public page, the dashboard and the home all turn it on and say its words in the three languages.
// Run: node scripts/check-chart-range.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { lineChart, barChart, tickLabels } from '../src/utils/statsChart.mjs';
import { COPY } from '../src/data/globalStatsCopy.mjs';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
// The rules are TypeScript (src/utils/chartRange.ts, which has no imports): they are compiled here, so this check runs on any Node, the one of CI included.
const compiled = ts.transpileModule(read('src/utils/chartRange.ts'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { clampWin, dragWin, edgeAt, indexAt, makeFormat, percentText, rangeStats, shareOf, signedText, startWin, tween, easeOut } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const pts = (list) => list.map((value) => (typeof value === 'object' ? value : { value }));

// ── The numbers of a window ──
const flow = pts([10, 10, 10, 20, 20, 20, 30, 30, { value: 99, partial: true }]);
let s = rangeStats(flow, { a: 3, b: 5 }, 'flow');
assert.equal(s.days, 3);
assert.equal(s.total, 60);
assert.equal(s.average, 20);
assert.equal(s.versus, 1, 'the average doubled against the window just before (10 -> 20)');
s = rangeStats(flow, { a: 6, b: 8 }, 'flow');
assert.equal(s.total, 159, 'the day in progress counts in the total');
assert.equal(s.average, 30, '...never in the average');
assert.equal(shareOf(1, 0), null, 'a change from nothing is not a percentage');
s = rangeStats(flow, { a: 0, b: 2 }, 'flow');
assert.equal(s.versus, null, 'no window before it: nothing to compare');
s = rangeStats(flow, { a: 1, b: 4 }, 'flow');
assert.equal(s.versus, null, 'a window with less than half its days before it is not compared');
s = rangeStats(flow, { a: 2, b: 5 }, 'flow');
assert.equal(s.versus, (17.5 - 10) / 10, 'with half its days or more before it, the averages per day are compared');
const level = pts([100, 110, 130, 120, 150]);
s = rangeStats(level, { a: 1, b: 4 }, 'level');
assert.deepEqual([s.end, s.change, s.high], [150, 40, 150]);
assert.ok(Math.abs(s.versus - 40 / 110) < 1e-9);
assert.equal(rangeStats(level, { a: 4, b: 99 }, 'level').days, 1, 'a window past the end is cut to it');

// ── Moving and stretching ──
assert.deepEqual(clampWin({ a: -5, b: -1 }, 30, 3), { a: 0, b: 4 }, 'it keeps its length and never goes before the first day');
assert.deepEqual(clampWin({ a: 5, b: 5 }, 30, 3), { a: 5, b: 7 }, 'never shorter than the minimum');
assert.deepEqual(clampWin({ a: 28, b: 40 }, 30, 3), { a: 17, b: 29 }, 'it keeps its length and never goes past the last day');
assert.equal(clampWin({ a: 0, b: 99 }, 30, 3).b, 29);
assert.deepEqual(dragWin({ a: 10, b: 19 }, 'move', 5, 30, 3), { a: 15, b: 24 });
assert.deepEqual(dragWin({ a: 10, b: 19 }, 'move', 50, 30, 3), { a: 20, b: 29 }, 'it stops at the end and keeps its length');
assert.deepEqual(dragWin({ a: 10, b: 19 }, 'move', -50, 30, 3), { a: 0, b: 9 });
assert.deepEqual(dragWin({ a: 10, b: 19 }, 'left', -4, 30, 3), { a: 6, b: 19 });
assert.deepEqual(dragWin({ a: 10, b: 19 }, 'left', 50, 30, 3), { a: 17, b: 19 }, 'the left edge stops 3 days from the right one');
assert.deepEqual(dragWin({ a: 10, b: 19 }, 'right', 50, 30, 3), { a: 10, b: 29 });
assert.deepEqual(dragWin({ a: 10, b: 19 }, 'right', -50, 30, 3), { a: 10, b: 12 });
assert.deepEqual(dragWin({ a: 0, b: 1 }, 'right', 5, 2, 3), { a: 0, b: 1 }, 'a series shorter than the minimum is all there is');
assert.deepEqual(startWin(30, 3), { a: 20, b: 29 }, 'the last third at first');
assert.deepEqual(startWin(8, 3), { a: 1, b: 7 }, 'at least a week when there are that many days');
assert.deepEqual(startWin(4, 3), { a: 0, b: 3 });

// ── The strip ──
assert.equal(edgeAt(0, 'left', 11, 'points'), 0);
assert.equal(edgeAt(10, 'right', 11, 'points'), 1);
assert.equal(edgeAt(5, 'left', 11, 'points'), 0.5);
assert.equal(edgeAt(0, 'left', 10, 'slots'), 0);
assert.equal(edgeAt(9, 'right', 10, 'slots'), 1);
assert.equal(edgeAt(2, 'right', 10, 'slots'), 0.3);
assert.equal(indexAt(0.5, 11, 'points'), 5);
assert.equal(indexAt(-3, 11, 'points'), 0);
assert.equal(indexAt(9, 11, 'points'), 10);
assert.equal(indexAt(0.999, 10, 'slots'), 9);
assert.equal(indexAt(0.35, 10, 'slots'), 3);

// ── Writing numbers ──
const count = makeFormat({ type: 'count' }, 'en');
assert.equal(count(1234.6), '1,235');
assert.equal(makeFormat({ type: 'count' }, 'es')(1234567), '1.234.567');
assert.equal(makeFormat({ type: 'decimal1', suffix: 'h' }, 'en')(12.34), '12.3 h');
const dur = makeFormat({ type: 'duration' }, 'en');
assert.equal(dur(12.5), '12h 30m');
assert.equal(dur(2), '2h');
assert.equal(dur(0.75), '45m');
assert.equal(dur(0.005), '18s');
assert.equal(signedText(count, 35), '+35');
assert.equal(signedText(count, -35), '−35');
assert.equal(signedText(count, 0), '0');
assert.equal(percentText(0.042, 'en'), '+4.2%');
assert.equal(percentText(-0.125, 'en'), '−13%');
assert.equal(percentText(null, 'en'), '–');
assert.equal(easeOut(0), 0);
assert.equal(easeOut(1), 1);
assert.ok(easeOut(0.5) > 0.5, 'fast first, slow at the end');
assert.equal(tween(10, 20, 1), 20);
assert.equal(tween(10, 20, 0), 10);

// ── The markup ──
const text = { todaySoFar: 'Today, so far', estimatedTag: '', changeVsPrev: 'vs' };
const brush = { kind: 'flow', locale: 'en', fmt: { type: 'count' }, text: { label: 'L', total: 'T', avg: 'A', versus: 'V', end: 'E', change: 'C', high: 'H', all: 'All' } };
const base = { W: 600, H: 220, color: 'red', format: String, tickLabels: (t) => tickLabels(t, { locale: 'en', num: new Intl.NumberFormat('en'), num1: new Intl.NumberFormat('en'), fractional: false }), dayText: (d) => d, signed: String, text, aria: 'a', svgLabel: 'a' };
const days = Array.from({ length: 12 }, (_, i) => ({ day: `2026-03-${String(i + 1).padStart(2, '0')}`, value: 100 + i * 7 }));
const withBrush = lineChart({ ...base, points: days, brush }).html;
assert.match(withBrush, /data-cr[ >]/);
assert.match(withBrush, /data-cr-win/);
assert.match(withBrush, /data-cr-dim="l"/);
assert.match(withBrush, /data-cr-n="total"/);
assert.match(withBrush, /data-ct[ >]/, 'the plot keeps its tooltip');
const json = JSON.parse(/<script type="application\/json" data-cr-data>(.*?)<\/script>/s.exec(withBrush)[1]);
assert.equal(json.v.length, 12);
assert.equal(json.e.length, 12);
assert.equal(json.layout, 'points');
assert.ok(json.box[0] < json.box[1] && json.box[2] < json.box[3]);
assert.ok(json.e.every(([l, r], i) => l >= json.box[0] - 1e-3 && r <= json.box[1] + 1e-3 && (i === 0 || l >= json.e[i - 1][0])), 'the edges of the days lie inside the plot, in order');
assert.doesNotMatch(lineChart({ ...base, points: days.slice(0, 5), brush }).html, /data-cr[ >]/, 'a few days are not worth a window');
assert.doesNotMatch(lineChart({ ...base, points: days }).html, /data-cr[ >]/, 'without the option there is none');
assert.match(lineChart({ ...base, points: days, brush: { ...brush, kind: 'level' } }).html, /data-cr-n="share"/, 'a level shows its change and its share');
const bars = barChart({ ...base, items: days, brush }).html;
assert.equal(JSON.parse(/data-cr-data>(.*?)<\/script>/s.exec(bars)[1]).layout, 'slots');
assert.doesNotMatch(barChart({ ...base, items: days.map((d, i) => ({ label: String(i), value: d.value })), brush }).html, /data-cr[ >]/, 'bars of kinds (hours, weekdays) are not days: no window');

// ── It is on everywhere, and in the three languages ──
for (const [file, needle] of [['src/components/GlobalStats.astro', 'DashChartRange'], ['src/components/DashStats.astro', 'DashChartRange'], ['src/components/HomeChartDemo.astro', 'DashChartRange']]) assert.ok(read(file).includes(needle), `${file} carries the window`);
assert.match(read('src/components/Home.astro'), /<HomeChartDemo /);
for (const lang of ['en', 'es', 'pt-BR']) for (const key of ['brushLabel', 'brushTotal', 'brushAvg', 'brushVersus', 'brushEnd', 'brushChange', 'brushHigh', 'brushAll']) assert.ok(COPY[lang][key], `${lang} says ${key}`);
const css = read('src/components/DashChartRange.astro');
assert.match(css, /prefers-reduced-motion/, 'reduced motion switches the movement off');
assert.match(css, /touch-action: none/, 'the strip is dragged with a finger without scrolling the page');
console.log('chart-range: ok');
