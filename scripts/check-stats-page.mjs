// Checks the rules of the public stats page: how the daily history is cleaned, today as the last point of every series (a full point
// for servers and members, a partial day for the per-day numbers), the numbers above the chart, the change between days, the zoomed
// scale of the charts (src/utils/globalStatsMath.mjs), and that the three languages of the page say the same things
// (src/data/globalStatsCopy.mjs).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BOT_OFFSET_MS, LONG_RANGE_DAYS, MAX_HISTORY_DAYS, RANGES, baseSince, botDay, changeSince, dailyRows, dayChanges, daysBefore, isApprox, monthTicks, nextDay, normalizeHistory, runsOf, seriesOf, smoothPath, summarize, withLiveToday, withinDays, zoomScale } from '../src/utils/globalStatsMath.mjs';
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
// The two series have their own mark: `estimated` is the members', `estimatedServers` the servers'. They never mix.
const flags = normalizeHistory({ days: [
  { day: '2026-11-01', servers: 20, members: 5000, estimatedServers: true },
  { day: '2026-11-02', servers: 21, members: 5100, estimated: true },
  { day: '2026-11-03', servers: 22, members: 5200, estimated: true, estimatedServers: true },
  { day: '2026-11-04', servers: 23, members: 5300, estimatedServers: 'yes', estimated: 1 },
] });
assert.deepEqual(flags.map((row) => [row.estimated === true, row.estimatedServers === true]), [[false, true], [true, false], [true, true], [false, false]], 'only a literal true is kept, each flag on its own');
const flagServers = seriesOf(flags, 'servers', '2026-11-05');
const flagMembers = seriesOf(flags, 'members', '2026-11-05');
assert.deepEqual(flagServers.map((p) => Boolean(p.estimated)), [true, false, true, false], 'the servers series reads estimatedServers');
assert.deepEqual(flagMembers.map((p) => Boolean(p.estimated)), [false, true, true, false], 'the members series reads estimated');
// A stretch is dashed only between two interpolated days of that series; with a measured day at one end it is solid.
assert.deepEqual(flagServers.slice(1).map((p, i) => isApprox(flagServers[i], p)), [false, false, false]);
const gapServers = seriesOf(normalizeHistory([
  { day: '2026-11-01', servers: 20 }, { day: '2026-11-02', servers: 21, estimatedServers: true }, { day: '2026-11-03', servers: 22, estimatedServers: true }, { day: '2026-11-04', servers: 23 },
]), 'servers', '2026-11-05');
assert.deepEqual(gapServers.slice(1).map((p, i) => isApprox(gapServers[i], p)), [false, true, false], 'dashed between two interpolated days, solid next to a measured one');
// The change chips and the table follow the series' own mark.
assert.equal(baseSince(flagServers, 3).estimated, true);
assert.equal(baseSince(flagMembers, 3).estimated, undefined, 'the members of 2026-11-01 are measured, so a change from them is exact');
const flagRows = dailyRows(flags, '2026-11-05', 14); // newest first: Nov 4, 3, 2, 1
assert.deepEqual(flagRows.map((row) => row.cells.servers.estimated), ['change', 'value', 'change', 'value'], 'servers cells follow estimatedServers');
assert.deepEqual(flagRows.map((row) => row.cells.members.estimated), ['change', 'value', 'value', undefined], 'members cells follow estimated');
// The per-day numbers (messages, hours in voice, reactions) have a third mark, `estimatedActivity`, that is not the servers' or the members'.
const act = normalizeHistory({ days: [
  { day: '2026-11-01', servers: 20, members: 5000, messages: 100, reactions: 10, voiceSeconds: 3600, estimatedActivity: true },
  { day: '2026-11-02', servers: 21, members: 5100, messages: 100, reactions: 10, voiceSeconds: 3600, estimatedActivity: true, estimated: true },
  { day: '2026-11-03', servers: 22, members: 5200, messages: 300, reactions: 30, voiceSeconds: 7200 },
  { day: '2026-11-04', servers: 23, members: 5300, messages: 50, reactions: 5, voiceSeconds: 900, estimatedActivity: 'yes', estimatedServers: true },
] });
assert.deepEqual(act.map((row) => [row.estimatedActivity === true, row.estimated === true, row.estimatedServers === true]), [[true, false, false], [true, true, false], [false, false, false], [false, false, true]], 'three marks, each on its own, only a literal true is kept');
for (const key of ['messages', 'voice', 'reactions']) {
  assert.deepEqual(seriesOf(act, key, '2026-11-05').map((p) => Boolean(p.estimated)), [true, true, false, false], `${key} reads estimatedActivity`);
}
assert.deepEqual(seriesOf(act, 'servers', '2026-11-05').map((p) => Boolean(p.estimated)), [false, false, false, true], 'servers do not read the activity mark');
assert.deepEqual(seriesOf(act, 'members', '2026-11-05').map((p) => Boolean(p.estimated)), [false, true, false, false], 'members do not read the activity mark');
// Dashed only between two flagged days (or today so far); a real day at one end makes the stretch solid.
const actMsgs = seriesOf(act, 'messages', '2026-11-05');
assert.deepEqual(actMsgs.slice(1).map((p, i) => isApprox(actMsgs[i], p)), [true, false, false]);
const actToday = seriesOf(act, 'messages', '2026-11-04');
assert.equal(isApprox(actToday[2], actToday[3]), true, 'today so far is dashed');
// The numbers above the chart count the flagged days as normal days: they are part of the sum.
const actSum = summarize(actMsgs, 'flow');
assert.deepEqual([actSum.total, actSum.average, actSum.high.value, actSum.low.value], [550, 137.5, 300, 50], 'flagged days are counted like any other');
const actSumToday = summarize(actToday, 'flow');
assert.deepEqual([actSumToday.total, actSumToday.average, actSumToday.low.value], [550, 166.66666666666666, 100], 'today so far stays out of the average and the lowest');
// A live number only clears the mark of its own series (the activity mark is cleared by live per-day numbers).
const liveAct = withLiveToday([{ day: '2026-11-04', servers: 5, members: 900, messages: 9, estimated: true, estimatedServers: true, estimatedActivity: true }], '2026-11-04', { messages: 20 })[0];
assert.deepEqual([liveAct.estimatedActivity, liveAct.estimated, liveAct.estimatedServers], [undefined, true, true]);
// The table: `~` before a flagged value, and in the change measured from a flagged day; the three marks do not mix in the cells.
const actRows = dailyRows(act, '2026-11-05', 14); // newest first: Nov 4, 3, 2, 1
assert.deepEqual(actRows.map((row) => row.cells.messages.estimated), [undefined, 'change', 'value', 'value'], 'flow cells follow estimatedActivity');
assert.deepEqual(actRows.map((row) => row.cells.reactions.estimated), [undefined, 'change', 'value', 'value']);
assert.deepEqual(actRows.map((row) => row.cells.voice.estimated), [undefined, 'change', 'value', 'value']);
assert.deepEqual(actRows.map((row) => row.cells.servers.estimated), ['value', undefined, undefined, undefined], 'servers cells follow estimatedServers only');
assert.deepEqual(actRows.map((row) => row.cells.members.estimated), [undefined, 'change', 'value', undefined], 'members cells follow estimated only');
// Nulls in the activity are a gap in that series only.
const nullAct = normalizeHistory([{ day: '2026-11-01', messages: null, servers: 9 }, { day: '2026-11-02', messages: 4, servers: 10, estimatedActivity: true }]);
assert.deepEqual(seriesOf(nullAct, 'messages', '2026-11-05').map((p) => p.value), [4]);
assert.deepEqual(seriesOf(nullAct, 'servers', '2026-11-05').map((p) => p.value), [9, 10]);
// Nulls in servers are a gap in the servers line only.
const nullServers = normalizeHistory([{ day: '2026-11-01', servers: null, members: 100 }, { day: '2026-11-02', servers: 5, members: 110 }]);
assert.deepEqual(seriesOf(nullServers, 'servers', '2026-11-05').map((p) => p.value), [5]);
assert.deepEqual(seriesOf(nullServers, 'members', '2026-11-05').map((p) => p.value), [100, 110]);
// Up to 400 days are kept, the newest ones, and the ranges of the chart go up to a year.
assert.equal(MAX_HISTORY_DAYS, 400);
assert.deepEqual(RANGES, [7, 30, 90, 365]);
assert.ok(RANGES[RANGES.length - 1] < MAX_HISTORY_DAYS);
const long = normalizeHistory(Array.from({ length: 500 }, (_, i) => ({ day: daysBefore('2026-11-04', i), members: 1000 + i, estimated: i > 4 })));
assert.equal(long.length, 400);
assert.equal(long[long.length - 1].day, '2026-11-04');
assert.equal(long[0].day, daysBefore('2026-11-04', 399));
assert.equal(withinDays(seriesOf(long, 'members', '2026-11-04'), 365).length, 365, 'a year is 365 points');
assert.equal(withinDays(seriesOf(long, 'members', '2026-11-04'), 365)[0].day, daysBefore('2026-11-04', 364));
assert.equal(seriesOf(long, 'members', '2026-11-04').filter((p) => p.estimated).length, 395, 'almost the whole line is estimated');

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
assert.equal(withLiveToday([{ day: '2026-11-02', servers: 5, estimatedServers: true }], '2026-11-04', { servers: 7 }).length, 2, 'today is added when the history stops before it');
assert.equal(withLiveToday([{ day: '2026-11-04', servers: 5, estimatedServers: true }], '2026-11-04', { servers: 7 })[0].estimatedServers, undefined, 'a live count is not an estimate');
// A live number only clears the mark of its own series.
const liveMix = withLiveToday([{ day: '2026-11-04', servers: 5, members: 900, estimated: true, estimatedServers: true }], '2026-11-04', { servers: 7 })[0];
assert.deepEqual([liveMix.estimatedServers, liveMix.estimated], [undefined, true], 'live servers clear only the servers mark');
const liveMix2 = withLiveToday([{ day: '2026-11-04', servers: 5, members: 900, estimated: true, estimatedServers: true }], '2026-11-04', { members: 950 })[0];
assert.deepEqual([liveMix2.estimatedServers, liveMix2.estimated], [true, undefined], 'live members clear only the members mark');
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

// Which stretches are drawn dashed: today so far, and a stretch between two days that were both rebuilt afterwards; a stretch with a known day at one end is solid.
const drawn = seriesOf(days, 'members', '2026-11-04');
assert.deepEqual(drawn.slice(1).map((p, i) => isApprox(drawn[i], p)), [false, false], 'a stretch with a known day at one end is solid');
assert.equal(isApprox({ estimated: true }, { estimated: true }), true, 'between two rebuilt days: dashed');
assert.equal(isApprox({ estimated: true }, {}), false, 'from a rebuilt day to a known one (the rise to a spike): solid');
assert.equal(isApprox({}, { estimated: true }), false, 'from a known day to a rebuilt one (the fall after a spike): solid');
assert.equal(isApprox({}, { partial: true }), true, 'today so far: dashed');
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

// The month labels of a long chart: the first of each month in the window, thinned from the newest one, the year on January and on the
// oldest. Never more than asked for, so they do not touch on a phone.
const yearTicks = monthTicks(daysBefore('2026-11-04', 364), '2026-11-04', 12);
assert.equal(yearTicks.length, 12);
assert.equal(yearTicks[yearTicks.length - 1].day, '2026-11-01');
assert.equal(yearTicks[0].day, '2025-12-01');
assert.deepEqual(yearTicks.filter((tick) => tick.year).map((tick) => tick.day), ['2025-12-01', '2026-01-01']);
const phoneTicks = monthTicks(daysBefore('2026-11-04', 364), '2026-11-04', 3);
assert.deepEqual(phoneTicks.map((tick) => tick.day), ['2026-03-01', '2026-07-01', '2026-11-01'], 'thinned, anchored to the newest month');
assert.ok(phoneTicks.length <= 3);
assert.deepEqual(monthTicks('2026-11-02', '2026-11-20', 4), [], 'no month starts inside a short window');
assert.deepEqual(monthTicks('2026-11-01', '2026-11-20', 4).map((tick) => tick.day), ['2026-11-01']);
assert.ok(LONG_RANGE_DAYS >= 90 && LONG_RANGE_DAYS < 365, 'a year labels months, 90 days labels days');

// The zoomed scale: it fits the data (not zero) and has round ticks inside it; a flat series still gets a band; never below zero.
const members = zoomScale([56_000, 56_300, 57_000, 56_800]);
assert.ok(members.min > 50_000 && members.min < 56_000, 'zoomed, not from zero');
assert.ok(members.max > 57_000 && members.max < 60_000);
assert.ok(members.ticks.length >= 3 && members.ticks.every((tick) => tick >= members.min && tick <= members.max));
assert.ok(members.ticks.every((tick) => tick % members.step === 0));
// A big swing (340,000 members down to 57,800) still gets round ticks inside a zoomed scale.
const swing = zoomScale([340_000, 270_000, 80_000, 57_800]);
assert.ok(swing.min < 57_800 && swing.max > 340_000 && swing.min >= 0);
assert.ok(swing.ticks.every((tick) => !Object.is(tick, -0)), 'no -0 tick');
assert.ok(swing.ticks.length >= 3 && swing.ticks.length <= 8 && swing.ticks.every((tick) => tick >= swing.min && tick <= swing.max));
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
  assert.ok(COPY[lang].range365.trim().length <= 3, `${lang}.range365 is a short label`);
  // The note says where the numbers come from (the team's records of key dates, and the counters) and that the line is dashed.
  assert.ok(!COPY[lang].estimatedNote.includes('<'), `${lang}.estimatedNote has no markup`);
  assert.ok(COPY[lang].todaySoFar !== COPY[lang].today, `${lang}.todaySoFar is its own text`);
}
assert.ok(COPY.en.estimatedNote.includes('key dates') && COPY.es.estimatedNote.includes('fechas clave') && COPY['pt-BR'].estimatedNote.includes('datas-chave'), 'the note names the team records as a source');
assert.ok(COPY.en.estimatedNote.includes('dashed') && COPY.es.estimatedNote.includes('trazos') && COPY['pt-BR'].estimatedNote.includes('tracejado'), 'the note says the line is dashed');
// The page names no outside source and carries no note about the axis: the notes only say that the dashed stretches (and the values marked ~) are approximate.
for (const lang of Object.keys(COPY)) {
  for (const key of Object.keys(COPY[lang])) assert.ok(!/discord\.watch/i.test(COPY[lang][key]), `${lang}.${key} does not name discord.watch`);
  assert.equal(COPY[lang].zoomNote, undefined, `${lang} has no note about the axis`);
  assert.ok(COPY[lang].approxNote && COPY[lang].approxNoteTable.includes('~'), `${lang}.approxNoteTable explains the ~`);
  assert.notEqual(COPY[lang].approxNote, COPY[lang].estimatedNote, `${lang}: the approximate note is not the members note`);
}
assert.deepEqual([COPY.en.approxNote, COPY.es.approxNote, COPY['pt-BR'].approxNote], ['The dashed stretches are approximate.', 'Los tramos a trazos son aproximados.', 'Os trechos tracejados são aproximados.'], 'the note of the volume charts is the shared approximate note');
assert.deepEqual([COPY.en.approxNoteTable, COPY.es.approxNoteTable, COPY['pt-BR'].approxNoteTable], ['Values marked ~ are approximate.', 'Los valores marcados con ~ son aproximados.', 'Os valores marcados com ~ são aproximados.']);
assert.ok(COPY.es.onlyDays.includes('{n}') && COPY['pt-BR'].onlyDays.includes('{n}') && COPY.en.onlyDays.includes('{n}'));

// The page uses them: the tabs of servers and members stay with no history, with the message that it starts today, and the last
// point of a per-day series is an open one named "Today, so far".
const page = readFileSync(new URL('../src/components/GlobalStats.astro', import.meta.url), 'utf8');
for (const needle of  ["'approxNote'", "t('approxNoteTable')", "metric === 'members' ? 'estimatedNote'", "t('histStarts')", "t('todaySoFar')", "'estimatedNote'", "t('partialNote')", 'withLiveToday(', 'gs-hollow', "info.kind === 'level' && anything", 'monthMode', 'data-range="365"']) {
  assert.ok(page.includes(needle), `GlobalStats.astro lost ${needle}`);
}

console.log('Checked the stats page: history, today, partial day, estimated days, changes, scale and the three languages.');
