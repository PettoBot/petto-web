// Checks the rules that turn status checks into the daily state (src/utils/statusDays.mjs): green, amber, red and grey, the days before
// the first check, the failure of a single window against two in a row, two sources, gaps, and the current state.
import assert from 'node:assert/strict';
import { DAY_MS, SLOT_MS, currentState, dayMarkers, dayStartOf, lastDays, summarizeDay } from '../src/utils/statusDays.mjs';

const day = Date.UTC(2026, 10, 1);
const nextDay = day + DAY_MS;
const after = nextDay + 3600_000; // the day is over
const slots = (from, count) => Array.from({ length: count }, (_, index) => day + (from + index) * SLOT_MS);
const row = (slot, source = 'web', ok = true, ms = 50) => ({ slot, source, ok, ms });
const full = (sources = ['web', 'bot']) => slots(0, 720).flatMap((slot) => sources.map((source) => row(slot, source)));
const without = (rows, from, count) => rows.filter((entry) => entry.slot < day + from * SLOT_MS || entry.slot >= day + (from + count) * SLOT_MS);
const fail = (rows, from, count, sources = ['web', 'bot']) => rows.map((entry) => (entry.slot >= day + from * SLOT_MS && entry.slot < day + (from + count) * SLOT_MS && sources.includes(entry.source) ? { ...entry, ok: false } : entry));

// Green: every window checked and fine, by both places or only one.
assert.equal(summarizeDay(full(), day, day, after).state, 'up');
assert.equal(summarizeDay(full(['web']), day, day, after).state, 'up');
assert.equal(summarizeDay(full(), day, day, after).checks, 720);

// Amber: one failed window seen by one place, or a mixed one (the places disagree).
assert.equal(summarizeDay(fail(full(['web']), 100, 1), day, day, after).state, 'warn');
assert.equal(summarizeDay(fail(full(), 100, 1, ['bot']), day, day, after).state, 'warn');
assert.equal(summarizeDay(fail(full(), 100, 1, ['bot']), day, day, after).unconfirmed, 1);

// Red: two failed windows in a row, or one window that two places saw fail.
const two = summarizeDay(fail(full(['web']), 100, 2), day, day, after);
assert.equal(two.state, 'down'); assert.equal(two.downMinutes, 4);
assert.equal(summarizeDay(fail(full(), 100, 1), day, day, after).state, 'down');
// Two failures that are not next to each other do not confirm each other.
assert.equal(summarizeDay(fail(fail(full(['web']), 100, 1), 300, 1), day, day, after).state, 'warn');
assert.equal(summarizeDay(fail(full(['web']), 100, 30), day, day, after).downMinutes, 60);

// A short silence is fine; a long one (6 minutes or more with no check at all) is amber; almost nothing is grey.
assert.equal(summarizeDay(without(full(['web']), 50, 2), day, day, after).state, 'up');
const gap = summarizeDay(without(full(['web']), 50, 5), day, day, after);
assert.equal(gap.state, 'warn'); assert.equal(gap.gapMinutes, 10);
assert.equal(summarizeDay(full(['web']).filter((entry) => entry.slot < day + 30 * SLOT_MS), day, day, after).state, 'nodata');
assert.equal(summarizeDay([], day, day, after).state, 'nodata', 'watching but nothing recorded is grey, never green');
// The silence is judged on a failed window next to it too: a failure, then silence, is not a run of failures.
assert.equal(summarizeDay(without(fail(full(['web']), 100, 2), 101, 1), day, day, after).state, 'warn');

// The first day only counts from the first check; the day before the first check is not judged; the future is not judged.
const started = day + 600 * SLOT_MS;
const startDay = summarizeDay(full(['web']).filter((entry) => entry.slot >= started), day, started, after);
assert.equal(startDay.state, 'up'); assert.equal(startDay.checks, 120);
assert.equal(summarizeDay(full(['web']), day, nextDay + 1000, after + DAY_MS), null);
assert.equal(summarizeDay([], nextDay, day, day + 1000), null);
// Today: only the windows that are over count, so a day in progress with every check done is green.
const noon = day + 360 * SLOT_MS + 30_000;
const today = summarizeDay(full(['web']).filter((entry) => entry.slot < day + 360 * SLOT_MS), day, day, noon);
assert.equal(today.state, 'up'); assert.equal(today.checks, 360);
// Both places down since the morning: the day is amber (a long gap) and then grey when most of the day is silence.
assert.equal(summarizeDay(full().filter((entry) => entry.slot < day + 100 * SLOT_MS), day, day, after).state, 'nodata');

// The current state.
const t = day + 500 * SLOT_MS + 20_000;
const at = (offset, ok, source = 'web') => row(day + (500 + offset) * SLOT_MS, source, ok);
assert.equal(currentState([at(0, true), at(-1, true)], t).state, 'up');
assert.equal(currentState([at(0, false), at(-1, true)], t).state, 'degraded', 'one failed check is not an outage yet');
assert.equal(currentState([at(0, false), at(-1, false)], t).state, 'down');
assert.equal(currentState([at(0, false, 'web'), at(0, false, 'bot')], t).state, 'down', 'two places agree');
assert.equal(currentState([at(0, true), at(-1, false)], t).state, 'up', 'a blip that is over');
assert.equal(currentState([at(-5, true)], t).state, 'unknown', 'nothing checked for 10 minutes');
assert.equal(currentState([], t).state, 'unknown');

// The markers: the days before the first check are pre-monitoring (shown green, said to be unmeasured), a measured day without a row is grey.
const days = lastDays(day + 4 * DAY_MS + 5000, 90);
assert.equal(days.length, 90); assert.equal(days[89], '2026-11-05'); assert.equal(days[0], '2026-08-08');
const rows = new Map([['2026-11-01', { state: 'warn', checks: 700 }], ['2026-11-03', { state: 'up', checks: 720 }]]);
const marks = dayMarkers(days, rows, day + 100 * SLOT_MS, day + 4 * DAY_MS + 5000);
assert.equal(marks.filter((m) => m.s === 'pre').length, 85, 'the 85 days before the first check');
assert.equal(marks[85].s, 'warn'); assert.equal(marks[86].s, 'nodata', 'a measured day nobody wrote down is grey, not green');
assert.equal(marks[87].s, 'up'); assert.equal(marks[88].s, 'nodata'); assert.equal(marks[89].s, 'up', 'today has no summary yet');
assert.ok(dayMarkers(days, new Map(), null).every((m) => m.s === 'pre'), 'before anything was ever checked every day is unmeasured');
assert.equal(dayStartOf(day + 5), day);
console.log('Checked the status days: green, amber, red, grey, the days before the first check, and the current state.');
