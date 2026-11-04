// Checks the days of the dashboard statistics (src/utils/dashDays.ts, used by the Overview, and the places that count per day on the
// Moderation, Tickets, Tools and Partners pages). Petto counts its days in GMT-5 (Colombia, no daylight saving): the bot writes its
// per-day counters with that day, so the x axis, the cutoffs, the weeks of the year view and the cases per day must use it too.
// At 7 pm in Colombia the UTC day is already the next one; that day must NOT show up (a "tomorrow" with 0) until Colombia is in it.
// Run: node scripts/check-dash-days.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
async function load(file) {
  const bundled = await build({ entryPoints: [`${root}${file}`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
  return import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
}
const { botDay, rangeDays, BOT_TIME_ZONE } = await load('src/utils/activityStats.ts');
const { OVERVIEW_RANGE_DAYS, addDays, bucketKey, bucketSums, dayStartInstant, fillAxis, overviewDays, parseOverviewRange, periodStartInstant, rowDay, weekStartDay } = await load('src/utils/dashDays.ts');
const { periodStart } = await load('src/utils/inviteStats.ts');
const { summarizeTickets } = await load('src/utils/ticketStats.ts');

const RealDate = Date;
/** Runs `fn` with the clock of the process pinned at an instant: `new Date()` and `Date.now()` give that instant. */
function atClock(iso, fn) {
  const fixed = new RealDate(iso).getTime();
  class Pinned extends RealDate {
    constructor(...args) { super(...(args.length ? args : [fixed])); }
    static now() { return fixed; }
  }
  globalThis.Date = Pinned;
  try { return fn(); } finally { globalThis.Date = RealDate; }
}
const daysBetween = (a, b) => Math.round((RealDate.parse(`${b}T00:00:00Z`) - RealDate.parse(`${a}T00:00:00Z`)) / 86_400_000);
const consecutive = (list) => list.every((day, i) => i === 0 || daysBetween(list[i - 1], day) === 1);
const RANGES = ['day', 'week', 'month', 'year'];

// ── The pure day arithmetic ──
assert.equal(addDays('2026-12-31', 1), '2027-01-01');
assert.equal(addDays('2027-03-01', -1), '2027-02-28');
assert.equal(addDays('2028-03-01', -1), '2028-02-29', 'a leap year');
assert.equal(weekStartDay('2026-11-01'), '2026-11-01', 'Sunday starts its own week');
assert.equal(weekStartDay('2026-11-04'), '2026-11-01', 'Wednesday');
assert.equal(weekStartDay('2026-11-07'), '2026-11-01', 'Saturday is the last day of the week');
assert.equal(weekStartDay('2027-01-01'), '2026-12-27', 'a week that goes over the new year');
assert.equal(bucketKey('2026-11-04', 'week'), '2026-11-04');
assert.equal(bucketKey('2026-11-04', 'month'), '2026-11-04');
assert.equal(bucketKey('2026-11-04', 'day'), '2026-11-04');
assert.equal(bucketKey('2026-11-04', 'year'), '2026-11-01', 'the year view groups by week (Sunday)');
assert.equal(dayStartInstant('2026-11-04'), '2026-11-04T05:00:00.000Z', 'a Colombian day starts at 05:00 UTC');
assert.equal(dayStartInstant('2027-01-01'), '2027-01-01T05:00:00.000Z');
assert.deepEqual(RANGES.map((range) => OVERVIEW_RANGE_DAYS[range]), [1, 7, 30, 365]);
assert.deepEqual(['day', 'week', 'month', 'year', 'x', '', null, undefined].map(parseOverviewRange), ['day', 'week', 'month', 'year', 'week', 'week', 'week', 'week']);

// ── botDay is the day of America/Bogota (the zone the database groups the cases by) at every moment of two years ──
const bogota = new Intl.DateTimeFormat('en-CA', { timeZone: BOT_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });
for (let at = RealDate.parse('2026-01-01T00:00:00Z'); at < RealDate.parse('2028-01-01T00:00:00Z'); at += 37 * 60_000) {
  assert.equal(botDay(new RealDate(at)), bogota.format(at), `botDay at ${new RealDate(at).toISOString()}`);
}

// ── The boundaries, with the clock pinned ──
const CASES = [
  // [instant, what it is in Colombia, today (GMT-5)]
  ['2026-11-05T04:00:00Z', 'Nov 4, 11:00 pm', '2026-11-04'], // the report: UTC is already Nov 5, Colombia is not
  ['2026-11-05T04:59:59Z', 'Nov 4, 11:59:59 pm', '2026-11-04'],
  ['2026-11-05T05:00:00Z', 'Nov 5, 00:00 (the new day starts)', '2026-11-05'],
  ['2026-11-05T00:00:00Z', 'Nov 4, 7:00 pm (UTC already changed day)', '2026-11-04'],
  ['2026-11-04T12:00:00Z', 'Nov 4, noon', '2026-11-04'],
  ['2026-12-31T23:30:00-05:00', 'Dec 31, 11:30 pm (year end)', '2026-12-31'],
  ['2027-01-01T04:59:00Z', 'Dec 31, 11:59 pm (year end, UTC is Jan 1)', '2026-12-31'],
  ['2027-01-01T05:00:00Z', 'Jan 1, 00:00 (new year)', '2027-01-01'],
  ['2026-11-30T23:00:00-05:00', 'Nov 30, 11:00 pm (month end)', '2026-11-30'],
  ['2026-12-01T05:00:00Z', 'Dec 1, 00:00 (new month)', '2026-12-01'],
  ['2028-02-29T23:00:00-05:00', 'Feb 29, 11:00 pm (leap day)', '2028-02-29'],
];
const zones = ['UTC', 'America/Bogota', 'America/Los_Angeles', 'Asia/Tokyo', 'Pacific/Kiritimati', 'Pacific/Pago_Pago'];
const originalTz = process.env.TZ;
for (const zone of zones) {
  process.env.TZ = zone; // the server's own time zone must make no difference
  for (const [instant, what, today] of CASES) {
    const now = new RealDate(instant);
    assert.equal(botDay(now), today, `${what}: today in GMT-5 (TZ ${zone})`);
    for (const range of RANGES) {
      const label = `${what}, ${range}, TZ ${zone}`;
      const plan = atClock(instant, () => overviewDays(new Date(), range)); // the page asks with `new Date()`
      assert.deepEqual(plan, overviewDays(now, range), `${label}: the same with the clock pinned or passed`);
      const days = OVERVIEW_RANGE_DAYS[range];
      const list = rangeDays(now, days);
      assert.equal(list.length, days, `${label}: ${days} days`);
      assert.equal(new Set(list).size, days, `${label}: no day twice`);
      assert.ok(consecutive(list), `${label}: no gaps`);
      assert.equal(list[list.length - 1], today, `${label}: the axis ends today`);
      assert.equal(plan.today, today);
      assert.equal(plan.currentCutoff, list[0], `${label}: the cutoff is the first day`);
      assert.equal(daysBetween(plan.previousCutoff, plan.currentCutoff), days, `${label}: the period before is as long as this one`);
      // The axis: every day (or every week), sorted, no duplicates, nothing after today.
      assert.deepEqual([...plan.keys].sort(), plan.keys, `${label}: keys in order`);
      assert.equal(new Set(plan.keys).size, plan.keys.length, `${label}: no key twice`);
      assert.ok(plan.keys.every((key) => key <= today), `${label}: no day after today (no "tomorrow")`);
      assert.equal(plan.keys[plan.keys.length - 1], bucketKey(today, range), `${label}: last key`);
      if (range !== 'year') assert.deepEqual(plan.keys, list, `${label}: one key per day`);
      assert.ok(!plan.keys.includes(addDays(today, 1)), `${label}: tomorrow is not on the axis`);
    }
  }
}
process.env.TZ = originalTz ?? '';
if (originalTz === undefined) delete process.env.TZ;

// The report, in words: Nov 4 at 11 pm in Colombia. The last day is Nov 4 and Nov 5 does not exist.
{
  const now = new RealDate('2026-11-05T04:00:00Z');
  const week = overviewDays(now, 'week');
  assert.deepEqual(week.keys, ['2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04']);
  assert.equal(week.currentCutoff, '2026-10-29');
  assert.equal(week.previousCutoff, '2026-10-22');
  assert.equal(overviewDays(now, 'day').keys.join(), '2026-11-04');
  assert.equal(overviewDays(now, 'month').keys.at(-1), '2026-11-04');
  assert.equal(overviewDays(now, 'month').keys[0], '2026-10-06');
  // An hour later the day is Nov 5 and Nov 4 is the day before.
  assert.equal(overviewDays(new RealDate('2026-11-05T05:00:00Z'), 'week').keys.at(-1), '2026-11-05');
  assert.equal(overviewDays(new RealDate('2026-11-05T05:00:00Z'), 'week').keys[0], '2026-10-30');
  // Year end: the year view at Dec 31 11:30 pm and at Jan 1 00:00 in Colombia.
  assert.equal(overviewDays(new RealDate('2027-01-01T04:59:00Z'), 'week').keys.at(-1), '2026-12-31');
  assert.deepEqual(overviewDays(new RealDate('2027-01-01T05:00:00Z'), 'week').keys.slice(-2), ['2026-12-31', '2027-01-01']);
}

// ── 365 consecutive days ending today in GMT-5, and the weeks of the year view ──
{
  const now = new RealDate('2026-11-05T04:00:00Z');
  const list = rangeDays(now, 365);
  assert.equal(list.length, 365);
  assert.equal(list.at(-1), '2026-11-04');
  assert.equal(list[0], '2025-11-05');
  assert.ok(consecutive(list));
  const year = overviewDays(now, 'year');
  assert.equal(year.keys.at(-1), '2026-11-01', 'the current week starts on its Sunday, not on tomorrow');
  assert.ok(year.keys.every((key) => new RealDate(`${key}T12:00:00Z`).getUTCDay() === 0), 'every key is a Sunday');
  assert.ok(year.keys.every((key, i) => i === 0 || daysBetween(year.keys[i - 1], key) === 7), 'week after week, none missing');
  assert.equal(year.keys[0], weekStartDay('2025-11-05'), 'the first week is the one of the first day');
  assert.equal(year.keys.length, 53);
  // The first and last day of the period fall in the first and last key.
  assert.equal(bucketKey(list[0], 'year'), year.keys[0]);
  assert.equal(bucketKey(list.at(-1), 'year'), year.keys.at(-1));
  // At 7 pm Colombia on a Saturday UTC is already Sunday: the new week must not start yet.
  assert.equal(overviewDays(new RealDate('2026-11-08T00:30:00Z'), 'year').keys.at(-1), '2026-11-01', 'Sat Nov 7, 7:30 pm in Colombia is still the week of Nov 1');
  assert.equal(overviewDays(new RealDate('2026-11-08T05:00:00Z'), 'year').keys.at(-1), '2026-11-08', 'Sunday 00:00 in Colombia starts the week');
}

// ── Rows written by the bot with the Colombian day land in the right bucket ──
{
  // Nov 4, 11 pm in Colombia. The bot wrote the messages of the evening with day 2026-11-04.
  const now = new RealDate('2026-11-05T04:00:00Z');
  const row = (day, messages, reactions = 0, voice_seconds = 0) => ({ channel_id: 'c1', day, messages, reactions, voice_seconds });
  const written = [row('2026-10-28', 99), row('2026-10-29', 1), row('2026-11-02', 5, 2), row('2026-11-04', 40, 6, 3600), row('2026-11-04', 2)];
  const series = ['messages', 'reactions', 'voice_seconds'];
  for (const range of ['week', 'month']) {
    const { currentCutoff, keys } = overviewDays(now, range);
    const current = written.filter((r) => r.day >= currentCutoff);
    const axis = fillAxis(keys, bucketSums(current, range, series), series);
    assert.equal(axis.length, OVERVIEW_RANGE_DAYS[range]);
    assert.equal(axis.at(-1).label, '2026-11-04', `${range}: the evening's day is the last`);
    assert.equal(axis.at(-1).messages, 42, `${range}: Nov 4 counts what the bot wrote for Nov 4`);
    assert.equal(axis.at(-1).voice_seconds, 3600);
    assert.equal(axis.find((p) => p.label === '2026-11-03').messages, 0, `${range}: a day with nothing is zero`);
    assert.equal(axis.find((p) => p.label === '2026-11-02').reactions, 2);
    assert.equal(axis.reduce((a, p) => a + p.messages, 0), range === 'week' ? 48 : 147, `${range}: the total is what is inside the period`);
  }
  assert.equal(fillAxis(overviewDays(now, 'week').keys, bucketSums(written.filter((r) => r.day >= '2026-10-29'), 'week', series), series)[0].messages, 1, 'the first day of the week is Oct 29, the 28th is the period before');
  // The year view adds the days of a week up under its Sunday.
  const yearly = overviewDays(now, 'year');
  const weeks = fillAxis(yearly.keys, bucketSums(written.filter((r) => r.day >= yearly.currentCutoff), 'year', series), series);
  assert.equal(weeks.at(-1).label, '2026-11-01');
  assert.equal(weeks.at(-1).messages, 5 + 40 + 2, 'Nov 2 and Nov 4 are in the week that started on Sunday Nov 1');
  assert.equal(weeks.find((w) => w.label === '2026-10-25').messages, 1 + 99, 'Oct 28 and Oct 29 are in the week of Oct 25');
  assert.equal(weeks.filter((w) => w.label > '2026-11-04').length, 0, 'there is no week after today');

  // The cases (mod_actions) come with a timestamp or, counted by the database, with the day it grouped them by in America/Bogota.
  assert.equal(rowDay({ created_at: '2026-11-05T03:30:00+00:00' }), '2026-11-04', 'Nov 4, 10:30 pm in Colombia');
  assert.equal(rowDay({ created_at: '2026-11-05T04:59:59.999Z' }), '2026-11-04');
  assert.equal(rowDay({ created_at: '2026-11-05T05:00:00Z' }), '2026-11-05');
  assert.equal(rowDay({ day: '2026-11-04', created_at: '2026-11-05T09:00:00Z' }), '2026-11-04', 'the day of the database wins');
  assert.equal(rowDay({ day: '2026-11-04T00:00:00.000Z' }), '2026-11-04');
  assert.equal(rowDay({}), '');
  // What is asked of the database starts at the Colombian midnight of the first day, not at UTC midnight.
  const asked = dayStartInstant(overviewDays(now, 'week').previousCutoff);
  assert.equal(asked, '2026-10-22T05:00:00.000Z');
  assert.ok(new RealDate('2026-10-22T03:00:00Z') < new RealDate(asked), 'a case of Oct 21, 10 pm in Colombia is before the period');
  assert.equal(rowDay({ created_at: '2026-10-22T04:59:00Z' }), '2026-10-21');
  assert.equal(rowDay({ created_at: asked }), '2026-10-22');
}

// ── "Today" and "this week" (Monday first) of the Partners and Tools pages are the ones the bot's commands use (invite periods are the same) ──
{
  const at = (iso, period) => new RealDate(periodStartInstant(period, new RealDate(iso))).toISOString();
  assert.equal(at('2026-11-05T04:00:00Z', 'day'), '2026-11-04T05:00:00.000Z', 'Nov 4, 11 pm: today began at 05:00 UTC on Nov 4');
  assert.equal(at('2026-11-05T05:00:00Z', 'day'), '2026-11-05T05:00:00.000Z');
  assert.equal(at('2026-11-05T04:00:00Z', 'week'), '2026-11-02T05:00:00.000Z', 'the week of Monday Nov 2');
  assert.equal(at('2026-11-09T04:59:00Z', 'week'), '2026-11-02T05:00:00.000Z', 'Sunday night in Colombia is the old week');
  assert.equal(at('2026-11-09T05:00:00Z', 'week'), '2026-11-09T05:00:00.000Z');
  for (let ms = RealDate.parse('2026-10-01T00:00:00Z'); ms < RealDate.parse('2027-02-01T00:00:00Z'); ms += 53 * 60_000) {
    assert.equal(at(new RealDate(ms).toISOString(), 'week'), periodStart('week', new RealDate(ms)), `the week at ${new RealDate(ms).toISOString()} matches the invite periods`);
  }
}

// ── Tickets per day (the chart of the Tickets page): the last 14 days of GMT-5, a ticket of 10 pm on Nov 4 is on Nov 4 ──
{
  const now = RealDate.parse('2026-11-05T04:00:00Z');
  const ticket = (created_at, closed_at = null) => ({ status: closed_at ? 'closed' : 'open', claimed_by: null, created_at, closed_at });
  const { days } = summarizeTickets([ticket('2026-11-05T03:00:00Z'), ticket('2026-11-05T05:30:00Z'), ticket('2026-10-22T04:00:00Z', '2026-11-05T02:00:00Z')], [], now);
  assert.equal(days.length, 14);
  assert.equal(days.at(-1).label, '11-04', 'the last day is Nov 4, there is no Nov 5');
  assert.equal(days[0].label, '10-22');
  assert.deepEqual(days.at(-1), { label: '11-04', opened: 1, closed: 1 });
  assert.equal(days.reduce((a, d) => a + d.opened, 0), 1, 'the ticket of Oct 21 (11 pm in Colombia) is out of the 14 days and the one of Nov 5 is not there yet');
}

// ── Nothing that feeds a per-day chart or counter goes back to the UTC calendar ──
const FORBIDDEN = [/getUTC(?:Date|Day|Month|FullYear)/, /setUTC/, /toISOString\(\)\.slice\(0, ?10\)/, /AT TIME ZONE 'UTC'/];
for (const file of ['src/pages/dash/guild/[id]/overview.astro', 'src/pages/dash/guild/[id]/moderation.astro', 'src/pages/dash/guild/[id]/tools.astro', 'src/pages/dash/guild/[id]/partners.astro', 'src/utils/ticketStats.ts']) {
  const text = fs.readFileSync(`${root}${file}`, 'utf8');
  for (const pattern of FORBIDDEN) assert.ok(!pattern.test(text), `${file} counts days in UTC again (${pattern})`);
}
const overviewPage = fs.readFileSync(`${root}src/pages/dash/guild/[id]/overview.astro`, 'utf8');
assert.ok(/AT TIME ZONE \$3/.test(overviewPage) && overviewPage.includes('BOT_TIME_ZONE'), 'the cases are grouped by the Colombian day in SQL');
assert.ok(overviewPage.includes('overviewDays(new Date(), range)'), 'the page takes its days from dashDays');

console.log('check-dash-days: ok');
