// Checks the rules of the public stats page: how the daily history is cleaned, today as the last point of every series (a full point
// for servers and members, a partial day for the per-day numbers), the numbers above the chart, the change between days, the zoomed
// scale of the charts (src/utils/globalStatsMath.mjs), and that the three languages of the page say the same things
// (src/data/globalStatsCopy.mjs).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BOT_OFFSET_MS, baseSince, botDay, changeSince, dailyRows, dayChanges, daysBefore, isApprox, nextDay, normalizeHistory, runsOf, seriesOf, smoothPath, summarize, withLiveToday, withinDays, zoomScale } from '../src/utils/globalStatsMath.mjs';
import { COPY } from '../src/data/globalStatsCopy.mjs';

// A day is a day in GMT-5: 03:00 UTC is still the day before.
assert.equal(botDay(Date.UTC(2026, 10, 4, 3, 0)), '2026-11-03');
assert.equal(botDay(Date.UTC(2026, 10, 4, 5, 0)), '2026-11-04');
assert.equal(daysBefore('2026-03-02', 2), '2026-02-28');
// The boundary of the day: at 04:00 UTC on Nov 5 it is still Nov 4 in GMT-5, and at 05:00 UTC a new day begins (not at UTC midnight).
assert.equal(BOT_OFFSET_MS, -5 * 3_600_000);
assert.equal(botDay(Date.parse('2026-11-05T04:00:00Z')), '2026-11-04');
assert.equal(botDay(Date.parse('2026-11-05T04:59:59Z')), '2026-11-04');
assert.equal(botDay(Date.parse('2026-11-05T05:00:00Z')), '2026-11-05');
assert.equal(botDay(Date.parse('2026-11-05T00:00:00Z')), '2026-11-04');
assert.equal(nextDay('2026-11-04'), '2026-11-05');

// The history is cleaned: bad days and bad numbers go, repeated days merge, order is oldest first.
const clean = normalizeHistory({ days: [
  { day: '2026-11-03', messages: 10, servers: 5 },
  { day: 'nope', messages: 1 },
  { day: '2026-11-01', messages: '7', members: -4, reactions: 'x' },
  { day: '2026-11-02' },
  { day: '2026-11-03', voiceSeconds: 90 },
  null,
] });
assert.deepEqual(clean.map((row) => row.day), ['2026-11-01', '2026-11-03']);
assert.deepEqual(clean[0], { day: '2026-11-01', messages: 7 });
assert.deepEqual(clean[1], { day: '2026-11-03', messages: 10, servers: 5, voiceSeconds: 90 });
assert.deepEqual(normalizeHistory(null), []);
assert.deepEqual(normalizeHistory('x'), []);
// null is "not known", never zero: a null (or a zero servers/members count) is a gap, but a real zero of a per-day number stays.
const nulls = normalizeHistory({ days: [
  { day: '2026-11-01', servers: null, members: null, messages: 0, reactions: null, voiceSeconds: 0 },
  { day: '2026-11-02', servers: 0, members: 0, estimated: true },
  { day: '2026-11-03', servers: 150, members: 4000, estimated: true, messages: 5 },
  { day: '2026-11-04', servers: 151, estimated: 'yes' },
] });
assert.deepEqual(nulls, [
  { day: '2026-11-01', messages: 0, voiceSeconds: 0 },
  { day: '2026-11-03', servers: 150, members: 4000, messages: 5, estimated: true },
  { day: '2026-11-04', servers: 151 },
]);
assert.equal(normalizeHistory(Array.from({ length: 200 }, (_, i) => ({ day: daysBefore('2026-11-04', i), messages: i }))).length, 120);

// Today is the last point of every series. A level (servers, members) at today is a full point; a per-day number at today is partial
// (the day is not over), and only those carry the flag. Days without the number are left out (the line breaks there).
const days = normalizeHistory([
  { day: '2026-11-02', servers: 180, members: 56_000, messages: 100, reactions: 9, voiceSeconds: 3600, estimated: true },
  { day: '2026-11-03', servers: 181, members: 56_800, messages: 120, reactions: 12, voiceSeconds: 7200 },
  { day: '2026-11-04', servers: 182, members: 57_012, messages: 30, reactions: 3, voiceSeconds: 900 },
]);
for (const key of ['servers', 'members', 'messages', 'voice', 'reactions']) {
  const points = seriesOf(days, key, '2026-11-04');
  assert.equal(points.length, 3, `${key} has a point for each day, today included`);
  assert.equal(points[2].day, '2026-11-04', `${key} ends today`);
}
assert.deepEqual(seriesOf(days, 'messages', '2026-11-04').map((p) => p.value), [100, 120, 30]);
assert.deepEqual(seriesOf(days, 'messages', '2026-11-04').map((p) => Boolean(p.partial)), [false, false, true]);
assert.deepEqual(seriesOf(days, 'voice', '2026-11-04').map((p) => Boolean(p.partial)), [false, false, true]);
assert.deepEqual(seriesOf(days, 'reactions', '2026-11-04').map((p) => Boolean(p.partial)), [false, false, true]);
assert.deepEqual(seriesOf(days, 'servers', '2026-11-04').map((p) => p.value), [180, 181, 182]);
assert.deepEqual(seriesOf(days, 'servers', '2026-11-04').map((p) => Boolean(p.partial)), [false, false, false], 'a level is never partial');
assert.deepEqual(seriesOf(days, 'members', '2026-11-04').map((p) => Boolean(p.estimated)), [true, false, false], 'estimated is kept on levels');
assert.equal(seriesOf(days, 'messages', '2026-11-04').some((p) => p.estimated), false, 'estimated is only for servers and members');
assert.deepEqual(seriesOf(days, 'unknown', '2026-11-04'), []);
// No partial point when the history does not reach today (the day is simply not there yet).
assert.equal(seriesOf(days, 'messages', '2026-11-05').some((p) => p.partial), false);
// A null is a gap, never a zero.
const holes = normalizeHistory([
  { day: '2026-11-01', servers: 150, members: null, messages: 10 },
  { day: '2026-11-02', servers: null, members: null, messages: 12 },
  { day: '2026-11-03', servers: 152, members: 4000, messages: 14 },
]);
assert.deepEqual(seriesOf(holes, 'servers', '2026-11-04').map((p) => p.value), [150, 152]);
assert.deepEqual(seriesOf(holes, 'members', '2026-11-04').map((p) => p.value), [4000]);
assert.deepEqual(runsOf(seriesOf(holes, 'servers', '2026-11-04')), [[0], [1]], 'a missing day breaks the line');
assert.deepEqual(runsOf(seriesOf(holes, 'messages', '2026-11-04')), [[0, 1, 2]]);
assert.deepEqual(runsOf([]), []);

// Today on top of the saved history: the live servers and members (the numbers on the cards) and today so far for the rest.
const live = withLiveToday(days, '2026-11-04', { servers: 183, members: 57_100, messages: 40, reactions: 4, voiceSeconds: 1000 });
const todayRow = live.find((row) => row.day === '2026-11-04');
assert.deepEqual([todayRow.servers, todayRow.members, todayRow.messages, todayRow.reactions, todayRow.voiceSeconds], [183, 57_100, 40, 4, 1000]);
assert.equal(seriesOf(live, 'servers', '2026-11-04').pop().value, 183, 'the last point of the chart is the number on the card');
assert.equal(seriesOf(live, 'members', '2026-11-04').pop().value, 57_100);
assert.equal(days.find((row) => row.day === '2026-11-04').servers, 182, 'the saved history is not changed');
assert.equal(withLiveToday([{ day: '2026-11-02', servers: 5, estimated: true }], '2026-11-04', { servers: 7 }).length, 2, 'today is added when the history stops before it');
assert.equal(withLiveToday([{ day: '2026-11-04', servers: 5, estimated: true }], '2026-11-04', { servers: 7 })[0].estimated, undefined, 'a live count is not an estimate');
assert.deepEqual(withLiveToday([], '2026-11-04', { servers: 0, members: NaN, messages: undefined }), [], 'nothing is made up');
assert.deepEqual(withLiveToday([], '2026-11-04', {}), []);
assert.equal(withLiveToday([], '2026-11-04', { messages: 0 })[0].messages, 0, 'a real zero of a per-day number stays');
// The history of the bot does not have servers and members yet: the tabs have one point (today's count), and the per-day ones the history.
const flowsOnly = normalizeHistory([{ day: '2026-11-03', messages: 5, reactions: 1, voiceSeconds: 60 }, { day: '2026-11-04', messages: 2, reactions: 0, voiceSeconds: 30 }]);
assert.equal(seriesOf(flowsOnly, 'servers', '2026-11-04').length, 0);
const flowsToday = withLiveToday(flowsOnly, '2026-11-04', { servers: 182, members: 57_012 });
assert.deepEqual(seriesOf(flowsToday, 'servers', '2026-11-04'), [{ day: '2026-11-04', value: 182 }]);
assert.deepEqual(seriesOf(flowsToday, 'members', '2026-11-04'), [{ day: '2026-11-04', value: 57_012 }]);
assert.equal(changeSince(seriesOf(flowsToday, 'members', '2026-11-04'), 7), null, 'no change is drawn without history');
assert.equal(changeSince(seriesOf(flowsToday, 'members', '2026-11-04'), 30), null);

// The numbers above the chart: the total includes today so far; the average, highest and lowest count full days only.
const flow = seriesOf(normalizeHistory([
  { day: '2026-11-01', messages: 100 }, { day: '2026-11-02', messages: 300 }, { day: '2026-11-03', messages: 200 }, { day: '2026-11-04', messages: 10 },
]), 'messages', '2026-11-04');
const sum = summarize(flow, 'flow');
assert.equal(sum.total, 610, 'the total includes today so far');
assert.equal(sum.average, 200, 'the average is over the 3 full days, not 4');
assert.equal(sum.fullDays, 3);
assert.deepEqual([sum.high.day, sum.high.value], ['2026-11-02', 300]);
assert.deepEqual([sum.low.day, sum.low.value], ['2026-11-01', 100], 'today so far (10) is not the lowest');
assert.equal(sum.partial, true);
const onlyToday = summarize(seriesOf(normalizeHistory([{ day: '2026-11-04', messages: 10 }]), 'messages', '2026-11-04'), 'flow');
assert.equal(onlyToday.total, 10);
assert.equal(onlyToday.average, null);
assert.equal(onlyToday.high, null);
assert.equal(onlyToday.low, null);
const complete = summarize(seriesOf(normalizeHistory([{ day: '2026-11-01', messages: 100 }, { day: '2026-11-02', messages: 300 }]), 'messages', '2026-11-04'), 'flow');
assert.deepEqual([complete.total, complete.average, complete.partial], [400, 200, false]);
const lvl = summarize(seriesOf(days, 'servers', '2026-11-04'), 'level');
assert.deepEqual([lvl.last.value, lvl.change, lvl.high.value, lvl.low.value], [182, 2, 182, 180], 'a level keeps today');
assert.ok(Math.abs(lvl.share - 2 / 180) < 1e-9);

// Which stretches are drawn dashed: today so far, and any stretch that touches a day rebuilt afterwards.
const drawn = seriesOf(days, 'members', '2026-11-04');
assert.deepEqual(drawn.slice(1).map((p, i) => isApprox(drawn[i], p)), [true, false]);
const drawnFlow = seriesOf(days, 'messages', '2026-11-04');
assert.deepEqual(drawnFlow.slice(1).map((p, i) => isApprox(drawnFlow[i], p)), [false, true]);

// Changes: against the day before, and since N days (never made up from a shorter history).
const levels = seriesOf(days, 'servers', '2026-11-04');
assert.deepEqual(dayChanges(levels), [null, 1, 1]);
assert.equal(changeSince(levels, 1), 1);
assert.equal(changeSince(levels, 2), 2);
assert.equal(changeSince(levels, 7), null);
assert.equal(baseSince(levels, 2).day, '2026-11-02');
assert.equal(baseSince(levels, 7), null);
assert.equal(baseSince(seriesOf(days, 'members', '2026-11-04'), 2).estimated, true, 'a change from a rebuilt day is known to be approximate');
assert.equal(changeSince([], 1), null);
assert.equal(withinDays(levels, 2).length, 2);
assert.equal(withinDays(levels, 90).length, 3);

// The table: newest first, today left out, the change of a day is against the day right before it (a gap gives no change).
const rows = dailyRows(days, '2026-11-04', 14);
assert.deepEqual(rows.map((row) => row.day), ['2026-11-03', '2026-11-02']);
assert.equal(rows[0].cells.messages.change, 20);
assert.equal(rows[1].cells.messages.change, null);
// An estimated day is flagged in its cells (and so is the change measured from it); a stored day is not.
assert.equal(rows[1].cells.members.estimated, 'value');
assert.equal(rows[0].cells.members.estimated, 'change');
assert.equal(rows[0].cells.messages.estimated, undefined);
const gap = dailyRows(normalizeHistory([{ day: '2026-11-01', messages: 5 }, { day: '2026-11-03', messages: 9 }]), '2026-11-04', 14);
assert.equal(gap[0].cells.messages.change, null);

// The zoomed scale: it fits the data (not zero) and has round ticks inside it; a flat series still gets a band; never below zero.
const members = zoomScale([56_000, 56_300, 57_000, 56_800]);
assert.ok(members.min > 50_000 && members.min < 56_000, 'zoomed, not from zero');
assert.ok(members.max > 57_000 && members.max < 60_000);
assert.ok(members.ticks.length >= 3 && members.ticks.every((tick) => tick >= members.min && tick <= members.max));
assert.ok(members.ticks.every((tick) => tick % members.step === 0));
const flat = zoomScale([180, 180, 180]);
assert.ok(flat.min < 180 && flat.max > 180);
assert.ok(zoomScale([0, 3, 1]).min >= 0);
assert.deepEqual(zoomScale([]).ticks, [0, 1]);

// The smooth line never leaves the range of the points it joins, and a single point still draws.
const path = smoothPath([{ x: 0, y: 10 }, { x: 10, y: 50 }, { x: 20, y: 10 }]);
assert.ok(path.startsWith('M0,10 C'));
assert.ok(smoothPath([{ x: 3, y: 4 }]).startsWith('M3,4'));
assert.equal(smoothPath([]), '');

// The three languages have the same words, none empty.
const keys = Object.keys(COPY.en).sort();
for (const lang of Object.keys(COPY)) {
  assert.deepEqual(Object.keys(COPY[lang]).sort(), keys, `${lang} has different texts than en`);
  for (const [key, text] of Object.entries(COPY[lang])) assert.ok(typeof text === 'string' && text.trim(), `${lang}.${key} is empty`);
}
for (const lang of Object.keys(COPY)) {
  assert.ok(COPY[lang].estimatedNote.includes('{date}'), `${lang}.estimatedNote needs the date`);
  assert.ok(COPY[lang].todaySoFar !== COPY[lang].today, `${lang}.todaySoFar is its own text`);
}
assert.ok(COPY.es.onlyDays.includes('{n}') && COPY['pt-BR'].onlyDays.includes('{n}') && COPY.en.onlyDays.includes('{n}'));

// The page uses them: the tabs of servers and members stay with no history, with the message that it starts today, and the last
// point of a per-day series is an open one named "Today, so far".
const page = readFileSync(new URL('../src/components/GlobalStats.astro', import.meta.url), 'utf8');
for (const needle of ["t('histStarts')", "t('todaySoFar')", "t('estimatedNote')", "t('partialNote')", 'withLiveToday(', 'gs-hollow', "info.kind === 'level' && anything"]) {
  assert.ok(page.includes(needle), `GlobalStats.astro lost ${needle}`);
}

console.log('Checked the stats page: history, today, partial day, estimated days, changes, scale and the three languages.');
