// Checks the time series of the dashboard's per-server statistics (src/utils/dashStatsView.ts) and the charts both statistics pages draw
// (src/utils/statsChart.mjs): the days of each number ending today so far, the change of each day against the one before (never against a
// day that was not counted), a server with a few days of data, the members line counted back from today, the change chips, and the markup
// of the charts (a zoomed axis, today so far dashed with an open dot, bars from zero).
// Run: node scripts/check-dash-stats.mjs
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
async function load(file) {
  const bundled = await build({ entryPoints: [`${root}${file}`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
  return import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
}
const { buildStats } = await load('src/utils/activityStats.ts');
const { buildAnalysis } = await load('src/utils/statsAnalysis.ts');
const { buildSeries, pointChanges, dayRows, seriesSummary, changeChip } = await load('src/utils/dashStatsView.ts');
const { lineChart, barChart, tickLabels, dayTickIndexes } = await load('src/utils/statsChart.mjs');

// 7 Nov 2026, 15:00 in Colombia (20:00 UTC): "today" is 2026-11-07.
const NOW = new Date('2026-11-07T20:00:00Z');
const day = (back) => new Date(NOW.getTime() - back * 86_400_000 - 5 * 3_600_000).toISOString().slice(0, 10);
const rows = (from, make) => Array.from({ length: from + 1 }, (_, i) => make(from - i, day(from - i))); // oldest first, `from` days back to today

function make({ days, activityBack, flowBack }) {
  const channelRows = rows(activityBack, (back, d) => ({ channel_id: 'c1', day: d, messages: 100 + back, reactions: 10, voice_seconds: 3600 }));
  const flowRows = rows(flowBack, (back, d) => ({ day: d, joins: 5, leaves: back === 0 ? 8 : 2, invited: 1 }));
  const input = { days, now: NOW, channelRows, hourlyRows: [], flowRows, contentRows: [], lifespanRows: [] };
  const inRange = (r) => r.day >= day(days - 1);
  const stats = buildStats({ days, now: NOW, channelRows: channelRows.filter(inRange), hourlyRows: [], flowRows: flowRows.filter(inRange), memberRows: [], caseRows: [] });
  return { stats, analysis: buildAnalysis(input) };
}

// ── A server with a long history: 7 days, all counted, the last one today so far ──
{
  const { stats, analysis } = make({ days: 7, activityBack: 20, flowBack: 20 });
  const series = buildSeries(stats, analysis, 1000);
  assert.equal(series.messages.points.length, 7);
  assert.equal(series.messages.points[6].day, '2026-11-07', 'the last point is today');
  assert.deepEqual(series.messages.points.map((p) => Boolean(p.partial)), [false, false, false, false, false, false, true], 'only today is a partial day');
  assert.equal(series.members.points[6].partial, undefined, 'the members count of today is a full point');
  // The first day is compared with the day before the period: it was counted.
  assert.equal(series.messages.edge, 107, 'edge = the day before the first day');
  const changes = pointChanges(series.messages);
  assert.equal(changes[0], 106 - 107, 'first day against the day before the period');
  assert.equal(changes[1], -1, 'a day against the day before');
  assert.equal(changes[6], null, 'today so far is not compared with a whole day');
  assert.equal(pointChanges(series.net)[0], 3 - 3, 'net edge = joins - leaves of the day before');
  // The members line is counted back from today with each day's net (joins - leaves).
  const members = series.members.points.map((p) => p.value);
  assert.equal(members[6], 1000);
  assert.equal(members[5], 1000 - (5 - 8), 'yesterday = today minus today\'s net');
  assert.equal(members[4], members[5] - 3, 'and so on back');
  assert.ok(members.every((value) => value > 0));
  // The summary leaves today out of the average, the highest and the lowest.
  const sum = seriesSummary(series.messages);
  assert.equal(sum.fullDays, 6);
  assert.equal(sum.average, (106 + 105 + 104 + 103 + 102 + 101) / 6, 'the average of the full days');
  assert.deepEqual([sum.high.day, sum.low.day], ['2026-11-01', '2026-11-06']);
  // No member count: no members line.
  assert.equal(buildSeries(stats, analysis, null).members.points.length, 0);
  // A members count that goes below one when counted back is not drawn.
  assert.equal(buildSeries(stats, analysis, 3).members.points.length, 0);
  // The table: newest first, today on top, each value with its change.
  const table = dayRows(series, ['messages', 'joins']);
  assert.equal(table.length, 7);
  assert.equal(table[0].day, '2026-11-07');
  assert.equal(table[0].today, true);
  assert.equal(table[0].cells.messages.change, null);
  assert.equal(table[1].cells.messages.value, 101);
  assert.equal(table[1].cells.messages.change, 101 - 102, 'yesterday against the day before');
  assert.equal(table[6].cells.messages.change, 106 - 107, 'the oldest row is compared with the day before the period');
}

// ── A server that started counting 5 days ago: 5 points, never 30 with 25 empty ones, and the first day has no change ──
{
  const { stats, analysis } = make({ days: 30, activityBack: 4, flowBack: 4 });
  assert.equal(analysis.counted.activity, day(4));
  const series = buildSeries(stats, analysis, 500);
  assert.equal(series.messages.points.length, 5, 'only the counted days');
  assert.equal(series.messages.points[0].day, day(4));
  assert.equal(series.messages.edge, null, 'nothing before the first counted day to compare with');
  const changes = pointChanges(series.messages);
  assert.equal(changes[0], null, 'the first counted day has no change');
  assert.equal(changes[1], -1);
  assert.equal(series.members.points.length, 5);
  // Nothing counted at all: no points, no table.
  const none = make({ days: 7, activityBack: -1, flowBack: -1 });
  const empty = buildSeries(none.stats, none.analysis, null);
  for (const key of Object.keys(empty)) if (key !== 'sanctions') assert.equal(empty[key].points.length, 0, `${key} has no points`);
  assert.deepEqual(dayRows(empty, ['messages', 'joins']).filter((row) => row.cells.messages || row.cells.joins), []);
  // Only today counted: a single point.
  const one = make({ days: 7, activityBack: 0, flowBack: 0 });
  const single = buildSeries(one.stats, one.analysis, 100);
  assert.equal(single.messages.points.length, 1);
  assert.equal(single.messages.points[0].partial, true);
}

// ── The change chip keeps its meaning: green for up (red for up where less is better), grey and "new" with nothing before ──
assert.deepEqual(changeChip(12.5, false, 'en-US', 'new'), { text: '12.5%', tone: 'good', arrow: '▲' });
assert.deepEqual(changeChip(-3, false, 'en-US', 'new'), { text: '3%', tone: 'bad', arrow: '▼' });
assert.deepEqual(changeChip(12.5, true, 'en-US', 'new'), { text: '12.5%', tone: 'bad', arrow: '▲' }, 'more members who left is bad');
assert.deepEqual(changeChip(-4, true, 'en-US', 'new'), { text: '4%', tone: 'good', arrow: '▼' });
assert.deepEqual(changeChip(null, false, 'en-US', 'new'), { text: 'new', tone: 'flat', arrow: '' });
assert.deepEqual(changeChip(0, false, 'en-US', 'new'), { text: '0%', tone: 'flat', arrow: '' });

// ── The charts ──
const intl = (digits) => new Intl.NumberFormat('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const common = {
  color: 'var(--m-messages)', format: (v) => String(Math.round(v)), tickLabels: (ticks) => tickLabels(ticks, { locale: 'en-US', num: intl(0), num1: intl(1) }),
  dayText: (d, opts) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' }), signed: (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}`,
  text: { todaySoFar: 'Today, so far', estimatedTag: '', changeVsPrev: 'vs the day before' }, aria: 'Messages', svgLabel: 'Chart',
};
const pts = (values) => values.map((value, i) => ({ day: day(values.length - 1 - i), value, ...(i === values.length - 1 ? { partial: true } : {}) }));
{
  const line = lineChart({ ...common, W: 520, H: 250, points: pts([5200, 5300, 5250, 5400, 5380, 2100]), fluid: true });
  assert.match(line.html, /class="sc-line sc-line-dash"/, 'today so far is a dashed stretch');
  assert.match(line.html, /class="sc-end sc-hollow"/, 'and ends in an open dot');
  assert.match(line.html, /Today, so far/, 'named on the axis and in the tooltip');
  assert.match(line.html, /viewBox="0 0 520 250"/);
  assert.doesNotMatch(line.html, /<svg width=/, 'a fluid chart has no fixed pixel size');
  assert.ok(line.scale.min > 1000, 'the vertical axis is zoomed to the data, it does not start at zero');
  const tip = JSON.parse(/<script type="application\/json" data-ct-data>(.*?)<\/script>/s.exec(line.html)[1]);
  assert.equal(tip.points.length, 6);
  assert.equal(tip.points[5].f.tag, 'Today, so far');
  assert.equal(tip.points[5].f.delta, '', 'today so far is not compared');
  assert.equal(tip.points[1].f.delta, '+100 vs the day before');
  assert.ok(tip.points.every((p) => p.x >= 0 && p.x <= 1 && p.y[0] >= 0 && p.y[0] <= 1), 'the tooltip data are fractions of the plot');
  // A members line counted back from today does not start at zero either.
  const members = lineChart({ ...common, W: 340, H: 230, points: pts([1815, 1830, 1848, 1875, 1840]).map((p) => ({ ...p, partial: undefined })), fluid: true });
  assert.ok(members.scale.min >= 1500);
  assert.doesNotMatch(members.html, /sc-line-dash/, 'a full last point is not dashed');
  // One point: a short chart with two ticks.
  const single = lineChart({ ...common, W: 340, H: 170, points: pts([7]), single: true, fluid: true });
  assert.match(single.html, /sc-end sc-hollow/);
  const bars = barChart({ ...common, W: 520, H: 250, fluid: true, items: pts([3, 0, 7, 5, 2]).map((p) => ({ day: p.day, value: p.value, partial: p.partial })) });
  assert.equal(bars.scale.min, 0, 'bars start at zero');
  assert.equal((bars.html.match(/class="sc-bar/g) || []).length, 5);
  assert.match(bars.html, /sc-bar sc-bar-partial/, 'today so far is a lighter dashed bar');
  const signed = barChart({ ...common, W: 520, H: 250, fluid: true, items: pts([4, -3, 6, -8]).map((p) => ({ day: p.day, value: p.value })) });
  assert.ok(signed.scale.min < 0, 'a negative value hangs from the zero line');
  assert.match(signed.html, /sc-bar sc-bar-neg/);
  assert.match(signed.html, /sc-grid sc-grid-zero/);
  const kinds = barChart({ ...common, W: 340, H: 230, fluid: true, items: ['Under a day', 'Under a week', 'Under a month', '1 to 3 months', 'Over 3 months'].map((label, i) => ({ label, value: i + 1 })) });
  const shown = (kinds.html.match(/<text [^>]*text-anchor="middle" class="sc-axis">[A-Z1][^<]*<\/text>/g) || []);
  assert.ok(shown.length >= 2 && shown.length < 5, 'labels that would touch are thinned');
  // The labels of the axis keep apart.
  assert.deepEqual(dayTickIndexes(1, 300, false), [0]);
  const ticks = dayTickIndexes(30, 420, true);
  assert.equal(ticks[ticks.length - 1], 29, 'the newest day is always named');
  assert.ok(ticks.length <= 4);
}
console.log('Checked the dashboard statistics: series, changes, a server with few days, members line, chips and charts.');
