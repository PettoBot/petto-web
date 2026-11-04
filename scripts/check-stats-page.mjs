// Checks the rules of the public stats page: how the daily history is cleaned, the change between days, the zoomed scale of the
// charts (src/utils/globalStatsMath.mjs), and that the three languages of the page say the same things (src/data/globalStatsCopy.mjs).
import assert from 'node:assert/strict';
import { botDay, changeSince, dailyRows, dayChanges, daysBefore, normalizeHistory, seriesOf, smoothPath, withinDays, zoomScale } from '../src/utils/globalStatsMath.mjs';
import { COPY } from '../src/data/globalStatsCopy.mjs';

// A day is a day in GMT-5: 03:00 UTC is still the day before.
assert.equal(botDay(Date.UTC(2026, 10, 4, 3, 0)), '2026-11-03');
assert.equal(botDay(Date.UTC(2026, 10, 4, 5, 0)), '2026-11-04');
assert.equal(daysBefore('2026-03-02', 2), '2026-02-28');

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
assert.equal(normalizeHistory(Array.from({ length: 200 }, (_, i) => ({ day: daysBefore('2026-11-04', i), messages: i }))).length, 120);

// A per-day number leaves out the day in progress, a level keeps it.
const days = normalizeHistory([
  { day: '2026-11-02', servers: 180, messages: 100 },
  { day: '2026-11-03', servers: 181, messages: 120 },
  { day: '2026-11-04', servers: 182, messages: 30 },
]);
assert.deepEqual(seriesOf(days, 'messages', '2026-11-04').map((p) => p.value), [100, 120]);
assert.deepEqual(seriesOf(days, 'servers', '2026-11-04').map((p) => p.value), [180, 181, 182]);
assert.deepEqual(seriesOf(days, 'members', '2026-11-04'), []);
assert.deepEqual(seriesOf(days, 'unknown', '2026-11-04'), []);

// Changes: against the day before, and since N days (never made up from a shorter history).
const levels = seriesOf(days, 'servers', '2026-11-04');
assert.deepEqual(dayChanges(levels), [null, 1, 1]);
assert.equal(changeSince(levels, 1), 1);
assert.equal(changeSince(levels, 2), 2);
assert.equal(changeSince(levels, 7), null);
assert.equal(changeSince([], 1), null);
assert.equal(withinDays(levels, 2).length, 2);
assert.equal(withinDays(levels, 90).length, 3);

// The table: newest first, today left out, the change of a day is against the day right before it (a gap gives no change).
const rows = dailyRows(days, '2026-11-04', 14);
assert.deepEqual(rows.map((row) => row.day), ['2026-11-03', '2026-11-02']);
assert.equal(rows[0].cells.messages.change, 20);
assert.equal(rows[1].cells.messages.change, null);
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
assert.ok(COPY.es.onlyDays.includes('{n}') && COPY['pt-BR'].onlyDays.includes('{n}') && COPY.en.onlyDays.includes('{n}'));

console.log('Checked the stats page: history, changes, scale and the three languages.');
