// Checks the rules that turn status checks into the daily state (src/utils/statusDays.mjs): green, amber, red and grey, the days before
// the first check, the failure of a single window against two in a row, two sources, gaps, and the current state.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DAY_MS, RESTART_FORGIVE_MS, SLOT_MS, UNCONFIRMED_WARN_SLOTS, applyNotes, currentState, dayMarkers, incidentDays, dayStartOf, lastDays, restartSlots, summarizeDay } from '../src/utils/statusDays.mjs';

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

// Amber: failed or mixed windows that nobody confirmed, from 3 of them in the day on. One or two (a deploy, a network hiccup) are counted but leave the day green.
assert.equal(UNCONFIRMED_WARN_SLOTS, 3);
assert.equal(summarizeDay(fail(full(['web']), 100, 1), day, day, after).state, 'up', 'a single failed window is a blip');
assert.equal(summarizeDay(fail(full(), 100, 1, ['bot']), day, day, after).state, 'up', 'a single mixed window is a blip');
assert.equal(summarizeDay(fail(full(), 100, 1, ['bot']), day, day, after).unconfirmed, 1, 'but it is still counted');
const blips = (count) => Array.from({ length: count }).reduce((rows, _, index) => fail(rows, 100 + index * 10, 1, ['bot']), full());
assert.equal(summarizeDay(blips(2), day, day, after).state, 'up', 'two blips leave the day green');
assert.equal(summarizeDay(blips(3), day, day, after).state, 'warn', 'three blips in a day are worth an amber day');
assert.equal(summarizeDay(blips(3), day, day, after).unconfirmed, 3);

// Red: two failed windows in a row, or one window that two places saw fail.
const two = summarizeDay(fail(full(['web']), 100, 2), day, day, after);
assert.equal(two.state, 'down'); assert.equal(two.downMinutes, 4);
assert.equal(summarizeDay(fail(full(), 100, 1), day, day, after).state, 'down');
// Two failures that are not next to each other do not confirm each other.
assert.equal(summarizeDay(fail(fail(full(['web']), 100, 1), 300, 1), day, day, after).downMinutes, 0);
assert.equal(summarizeDay(fail(fail(full(['web']), 100, 1), 300, 1), day, day, after).unconfirmed, 2);
assert.equal(summarizeDay(fail(full(['web']), 100, 30), day, day, after).downMinutes, 60);

// A short silence is fine; a long one (6 minutes or more with no check at all) is amber; almost nothing is grey.
assert.equal(summarizeDay(without(full(['web']), 50, 2), day, day, after).state, 'up');
const gap = summarizeDay(without(full(['web']), 50, 5), day, day, after);
assert.equal(gap.state, 'warn'); assert.equal(gap.gapMinutes, 10);
assert.equal(summarizeDay(full(['web']).filter((entry) => entry.slot < day + 30 * SLOT_MS), day, day, after).state, 'nodata');
assert.equal(summarizeDay([], day, day, after).state, 'nodata', 'watching but nothing recorded is grey, never green');
// The silence is judged on a failed window next to it too: a failure, then silence, is not a run of failures.
const lone = summarizeDay(without(fail(full(['web']), 100, 2), 101, 1), day, day, after);
assert.equal(lone.downMinutes, 0); assert.equal(lone.unconfirmed, 1);

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
// A restart of the website (a deploy) is not an outage: while it is away the site's own check is missing and the bot's check of the public address fails.
// The website writes down when it starts; the windows after its last good check up to that start are left out when that took 10 minutes or less.
const deploy = (from, count, restartAt) => {
  const rows = full().filter((entry) => !(entry.source === 'web' && entry.slot >= day + from * SLOT_MS && entry.slot < day + (from + count) * SLOT_MS));
  const broken = fail(rows, from, count, ['bot']);
  return { rows: broken, restart: restartAt };
};
const brief = deploy(100, 3, day + 102 * SLOT_MS + 30_000); // 3 windows (6 minutes) and then the website starts
assert.equal(summarizeDay(brief.rows, day, day, after).state, 'down', 'without the restart written down, 3 failed windows are an outage');
const forgiven = restartSlots(brief.rows, [brief.restart]);
assert.deepEqual([...forgiven].sort((a, b) => a - b), [100, 101, 102].map((n) => day + n * SLOT_MS), 'the windows after the last good one, up to the one of the restart');
const calm = summarizeDay(brief.rows, day, day, after, forgiven);
assert.equal(calm.state, 'up', 'a restart of a few minutes leaves the day green');
assert.equal(calm.downMinutes, 0);
assert.equal(calm.gapMinutes, 0, 'the missing checks of the website while it started are not a gap either');
assert.equal(calm.checks, 717, 'the windows that a restart explains are not counted as checked');

// The same days without that: other failures of the day still count (a restart forgives only its own windows).
const mixedDay = fail(brief.rows, 400, 2, ['web', 'bot']);
assert.equal(summarizeDay(mixedDay, day, day, after, restartSlots(mixedDay, [brief.restart])).state, 'down', 'a real outage on the same day still turns it red');

// Away for too long (more than 10 minutes) is an outage, even if the website then starts.
const long = deploy(100, 12, day + 111 * SLOT_MS + 30_000);
assert.equal(restartSlots(long.rows, [long.restart]).size, 0, 'longer than RESTART_FORGIVE_MS forgives nothing');
assert.equal(summarizeDay(long.rows, day, day, after, restartSlots(long.rows, [long.restart])).state, 'down');
assert.equal(RESTART_FORGIVE_MS, 10 * 60_000);

// A restart with nothing wrong before it forgives nothing; one far from the failure does not forgive it.
assert.equal(restartSlots(full(), [day + 200 * SLOT_MS + 1000]).size, 0, 'all good: nothing to forgive');
const farFailure = fail(full(), 100, 3);
assert.equal(restartSlots(farFailure, [day + 500 * SLOT_MS]).size, 0, 'a restart long after the failure does not explain it');
assert.equal(summarizeDay(farFailure, day, day, after, restartSlots(farFailure, [day + 500 * SLOT_MS])).state, 'down');
assert.equal(restartSlots(farFailure, [Number.NaN]).size, 0, 'a restart that cannot be read is ignored');
// The first window of a restart with no good check before it is its own.
assert.deepEqual([...restartSlots([row(day, 'bot', false)], [day + 1000])], [day]);

console.log('Checked the status days: green, amber, red, grey, the days before the first check, and the current state.');

// Outages written by hand (src/data/statusIncidents.json): the day of each listed service turns red with those minutes, nothing else changes.
{
  const base = [{ d: '2026-11-12', s: 'up', c: 700 }, { d: '2026-11-13', s: 'warn', c: 600, gm: 20, dm: 0 }, { d: '2026-11-14', s: 'pre' }];
  const notes = [{ day: '2026-11-13', services: ['bot', 'site'], minutes: 35 }];
  const bot = applyNotes(base, 'bot', notes);
  assert.equal(bot[1].s, 'down'); assert.equal(bot[1].dm, 35); assert.equal(bot[1].gm, 20, 'the rest of the day is kept');
  assert.equal(bot[0].s, 'up', 'other days are not touched');
  assert.equal(applyNotes(base, 'database', notes)[1].s, 'warn', 'a service that is not listed is not touched');
  assert.equal(applyNotes([{ d: '2026-11-13', s: 'down', dm: 50 }], 'bot', notes)[0].dm, 50, 'a day that is already red keeps its longer outage');
  assert.equal(applyNotes([{ d: '2026-11-13', s: 'pre' }], 'bot', notes)[0].s, 'pre', 'a day before the first check is not judged');
  assert.equal(applyNotes(base, 'bot', [{ day: '2026-11-13', services: ['bot'], minutes: 0 }])[1].s, 'warn', 'no minutes, no outage');
  assert.deepEqual(base[1], { d: '2026-11-13', s: 'warn', c: 600, gm: 20, dm: 0 }, 'the input is not changed');
  // The real file: every note has a UTC day, known services and minutes.
  const real = JSON.parse(readFileSync(new URL('../src/data/statusIncidents.json', import.meta.url), 'utf8'));
  assert.ok(Array.isArray(real));
  for (const note of real) {
    assert.match(note.day, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Array.isArray(note.services) && note.services.length && note.services.every((id) => ['bot', 'site', 'database'].includes(id)), 'known services');
    assert.ok(Number.isFinite(note.minutes) && note.minutes > 0 && note.minutes <= 1440);
    assert.ok(note.note && typeof note.note.en === 'string' && typeof note.note.es === 'string' && typeof note.note['pt-BR'] === 'string', 'the note is written in English, Spanish and Portuguese');
  }
}

// The list of past incidents: every recent day is there, and a day with nothing says so (like Discord Status). Days nobody measured are not listed.
{
  const days = lastDays(Date.UTC(2026, 10, 13, 12), 90); // ends 2026-11-13
  const incidents = [
    { day: '2026-11-13', service: 'bot', kind: 'down', minutes: 35, unconfirmed: 0 },
    { day: '2026-11-13', service: 'site', kind: 'down', minutes: 35, unconfirmed: 0 },
    { day: '2026-11-09', service: 'site', kind: 'warn', minutes: 0, unconfirmed: 3 },
  ];
  const list = incidentDays(days, incidents, '2026-11-04');
  assert.equal(list.length, 10, 'from today back to the first measured day (4 November): 10 days');
  assert.equal(list[0].day, '2026-11-13'); assert.equal(list[0].today, true, 'newest first, and today is marked');
  assert.equal(list[0].incidents.length, 2); assert.equal(list[1].today, false);
  assert.deepEqual(list.map((entry) => entry.incidents.length), [2, 0, 0, 0, 1, 0, 0, 0, 0, 0], 'a day with nothing is listed with no incidents');
  assert.equal(list.at(-1).day, '2026-11-04', 'it stops at the first measured day');
  assert.equal(incidentDays(days, incidents, '2026-10-01').length, 14, 'at most 14 days by default');
  assert.equal(incidentDays(days, incidents, '2026-10-01', 5).length, 5);
  assert.deepEqual(incidentDays(days, incidents, null), [], 'nothing measured yet: nothing to say');
  assert.deepEqual(incidentDays([], incidents, '2026-11-04'), []);
  assert.deepEqual(incidentDays(days, [], '2026-11-12').map((entry) => entry.incidents.length), [0, 0], 'two measured days with nothing');
}
