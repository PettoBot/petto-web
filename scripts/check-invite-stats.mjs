// Checks what the Invites tab works out from rows read from the database (src/utils/inviteStats.ts): the total with the leaves taken off or
// kept, the leaderboard of all time and of a week or month, the start of a period in GMT-5, the codes of a member and the defaults of a server
// whose bot is older than the page. Run: node scripts/check-invite-stats.mjs
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const bundled = await build({ entryPoints: [`${root}src/utils/inviteStats.ts`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const { inviteTotal, periodStart, rankInviters, rankPeriod, groupPeriod, groupCodes, codeStats, readInviteSettings, parseInvitePeriod } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);

assert.equal(inviteTotal({ joins: 10, leaves: 4, bonus: 3 }), 9, 'leaves are taken off by default');
assert.equal(inviteTotal({ joins: 10, leaves: 4, bonus: 3 }, false), 13, 'and kept when the server says so');
assert.equal(inviteTotal({}), 0);

assert.deepEqual(readInviteSettings(undefined), { fakeDays: 3, quickLeaveMinutes: 0, ignoreBots: false, subtractLeaves: true }, 'a server with no row');
assert.deepEqual(readInviteSettings({ fake_days: 7 }), { fakeDays: 7, quickLeaveMinutes: 0, ignoreBots: false, subtractLeaves: true }, 'a bot older than the page gives only the days');
assert.deepEqual(readInviteSettings({ fake_days: 0, quick_leave_minutes: 15, ignore_bots: true, subtract_leaves: false }), { fakeDays: 0, quickLeaveMinutes: 15, ignoreBots: true, subtractLeaves: false });

// Monday 2026-10-26 to Sunday: a Wednesday in the afternoon (GMT-5) is in the week that began on Monday at 00:00 GMT-5 (05:00 UTC).
assert.equal(periodStart('week', new Date('2026-10-28T20:00:00Z')), '2026-10-26T05:00:00.000Z');
assert.equal(periodStart('week', new Date('2026-10-26T04:59:00Z')), '2026-10-19T05:00:00.000Z', 'Sunday night in GMT-5 is still the old week');
assert.equal(periodStart('month', new Date('2026-10-31T20:00:00Z')), '2026-10-01T05:00:00.000Z');
assert.equal(periodStart('month', new Date('2026-11-01T04:00:00Z')), '2026-10-01T05:00:00.000Z', 'the first hours of November in UTC are still October in GMT-5');

const uses = [
  { inviter_id: 'a', joins: 10, leaves: 8, fake: 2, bonus: 0 },
  { inviter_id: 'b', joins: 6, leaves: 0, fake: 0, bonus: 1 },
  { inviter_id: 'c', joins: 0, leaves: 0, fake: 5, bonus: 0 },
];
assert.deepEqual(rankInviters(uses, true).map((r) => [r.id, r.net]), [['b', 7], ['a', 2]], 'with leaves taken off; nobody with nothing counted is listed');
assert.deepEqual(rankInviters(uses, false).map((r) => [r.id, r.net]), [['a', 10], ['b', 7]], 'with leaves kept the order changes');
assert.equal(rankInviters(uses, true, 1).length, 1);

const members = [{ inviter_id: 'a', left_at: null }, { inviter_id: 'a', left_at: '2026-10-27T00:00:00Z' }, { inviter_id: 'b', left_at: null }, { inviter_id: null, left_at: null }];
const grouped = groupPeriod(members);
assert.deepEqual(rankPeriod(grouped, true).map((r) => [r.id, r.joins, r.leaves, r.net]), [['a', 2, 1, 1], ['b', 1, 0, 1]]);
assert.deepEqual(rankPeriod(grouped, false).map((r) => [r.id, r.net]), [['a', 2], ['b', 1]]);

assert.deepEqual(codeStats(groupCodes([
  { invite_code: 'x', fake: false, left_at: null }, { invite_code: 'x', fake: false, left_at: 'y' }, { invite_code: 'x', fake: true, left_at: null },
  { invite_code: 'z', fake: false, left_at: null }, { invite_code: null, fake: false, left_at: null },
])), [{ code: 'x', joins: 2, left: 1, fake: 1 }, { code: 'z', joins: 1, left: 0, fake: 0 }]);

assert.equal(parseInvitePeriod('week'), 'week'); assert.equal(parseInvitePeriod('nope'), 'all'); assert.equal(parseInvitePeriod(null), 'all');
console.log('Invite stats: totals, leaderboards, periods in GMT-5, codes and the defaults for an older bot work.');
