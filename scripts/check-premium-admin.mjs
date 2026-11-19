// Checks the owner page that gives Premium by hand (src/utils/premiumAdmin.ts) against a fake bot REST layer and a fake Discord:
// the user/server cross-check, the durations (real calendar months), extending and editing a grant, the signed confirmation,
// revoking, and that a grant with an end date stops being live. Nothing real is read or written.
// Run: node scripts/check-premium-admin.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const bundled = await build({
  entryPoints: [`${root}src/utils/premiumAdmin.ts`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent',
  plugins: [{
    name: 'stubs',
    setup(b) {
      // The customization reset talks to Discord; here it does nothing.
      b.onResolve({ filter: /^\.\/premium$/ }, () => ({ path: 'premium-stub', namespace: 'stub' }));
      b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export const resets = []; export async function resetGuildPremiumCustomization(_a, id) { resets.push(id); return true; }', loader: 'js' }));
    },
  }],
});
const mod = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const { addMonthsUtc, endOfDayUtc, parseUntilDate, isLiveEntitlement, grantState, grantTarget, previewManualPremium, confirmManualPremium, extendManualPremium, revokeManualPremium, listManualPremium, resolveGrantNames, clearAdminLookupCache, verifyPlan, PETTO_OWNER_ID } = mod;

process.env.PETTO_BOT_API_URL = 'http://bot.test';
process.env.PETTO_BOT_API_SECRET = 'check-only-secret';
process.env.DISCORD_TOKEN = 'check-token';
const astro = { locals: {} };
const OWNER = PETTO_OWNER_ID;
const USER = '111111111111111111';
const USER2 = '111111111111111112';
const SERVER = '222222222222222222';
const SERVER2 = '222222222222222223';
const UNKNOWN_SERVER = '333333333333333333';
const NOW = new Date('2027-01-31T12:00:00Z');
const day = (iso) => iso?.slice(0, 10) ?? null;

// ---- fake bot REST layer (the PostgREST subset the page uses) and fake Discord ----
let db;
function reset() {
  clearAdminLookupCache();
  db = { premium_entitlements: [], premium_slot_assignments: [], guilds: [{ guild_id: SERVER }, { guild_id: SERVER2 }], discord_guild_snapshots: [{ guild_id: SERVER, name: 'Petto Lounge', icon: 'abc', member_count: 1234 }] };
  nextId = 1;
}
let nextId = 1;
const discord = { users: { [USER]: { id: USER, username: 'ana', global_name: 'Ana', avatar: 'av1' }, [USER2]: { id: USER2, username: 'bob', avatar: null } }, guilds: { [SERVER2]: { id: SERVER2, name: 'Second', icon: null, approximate_member_count: 50 } } };
function match(row, params) {
  for (const [col, raw] of params) {
    if (['select', 'limit', 'order', 'on_conflict'].includes(col)) continue;
    const [op, ...rest] = raw.split('.');
    const value = rest.join('.');
    if (op === 'eq' && String(row[col]) !== value) return false;
    if (op === 'in' && !value.replace(/^\(|\)$/g, '').split(',').includes(String(row[col]))) return false;
  }
  return true;
}
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init = {}) => {
  const url = new URL(String(input));
  if (url.host === 'discord.com') {
    const user = /\/users\/(\d+)$/.exec(url.pathname)?.[1];
    const guild = /\/guilds\/(\d+)$/.exec(url.pathname)?.[1];
    const found = user ? discord.users[user] : guild ? discord.guilds[guild] : null;
    return found ? json(found) : json({ message: 'Unknown' }, 404);
  }
  assert.equal(url.host, 'bot.test', `unexpected host ${url.host}`);
  const table = url.pathname.replace('/rest/v1/', '');
  assert.ok(table in db, `unknown table ${table}`);
  const rows = db[table];
  const method = (init.method ?? 'GET').toUpperCase();
  const body = init.body ? JSON.parse(init.body) : null;
  if (method === 'GET') {
    let out = rows.filter((row) => match(row, url.searchParams));
    const limit = Number(url.searchParams.get('limit') ?? 0);
    if (limit) out = out.slice(0, limit);
    return json(out.map((row) => structuredClone(row)));
  }
  if (method === 'PATCH') {
    for (const row of rows.filter((r) => match(r, url.searchParams))) Object.assign(row, structuredClone(body));
    return new Response(null, { status: 204 });
  }
  if (method === 'POST') {
    const existing = url.searchParams.get('on_conflict') ? rows.find((r) => r.provider_subscription_id === body.provider_subscription_id) : null;
    const row = existing ? Object.assign(existing, structuredClone(body)) : { id: nextId++, ...structuredClone(body), assigned_at: 'x' };
    if (!existing) rows.push(row);
    return json([structuredClone(row)], 201);
  }
  throw new Error(`unexpected ${method}`);
};

let failed = 0;
async function check(name, run) {
  reset();
  try { await run(); console.log(`ok   ${name}`); } catch (error) { failed += 1; console.error(`FAIL ${name}: ${error.message}`); }
}
const grantInput = (over = {}) => ({ mode: 'grant', targetType: 'user', targetId: USER, duration: 'permanent', slotLimit: 3, ...over });
/** Preview then confirm, as the page does. */
async function give(over = {}, ack = true, now = NOW) {
  const preview = await previewManualPremium(astro, OWNER, grantInput(over), now);
  if (!preview.ok) return preview;
  return { ...(await confirmManualPremium(astro, OWNER, preview.token, ack, now)), preview };
}
const row = (id) => db.premium_entitlements.find((r) => r.id === id);
const byKey = (key) => db.premium_entitlements.find((r) => r.provider_subscription_id === key);

// ---- month arithmetic ----
await check('31 Jan + 1 month is the last day of February (28 and 29)', async () => {
  assert.equal(day(addMonthsUtc(new Date('2027-01-31T00:00:00Z'), 1).toISOString()), '2027-02-28');
  assert.equal(day(addMonthsUtc(new Date('2028-01-31T00:00:00Z'), 1).toISOString()), '2028-02-29');
  assert.equal(day(addMonthsUtc(new Date('2028-02-29T00:00:00Z'), 12).toISOString()), '2029-02-28');
  assert.equal(day(addMonthsUtc(new Date('2028-02-29T00:00:00Z'), 1).toISOString()), '2028-03-29');
});
await check('months cross the end of the year and 30-day months', async () => {
  assert.equal(day(addMonthsUtc(new Date('2026-12-31T00:00:00Z'), 1).toISOString()), '2027-01-31');
  assert.equal(day(addMonthsUtc(new Date('2026-11-30T00:00:00Z'), 3).toISOString()), '2027-02-28');
  assert.equal(day(addMonthsUtc(new Date('2026-10-31T00:00:00Z'), 6).toISOString()), '2027-04-30');
  assert.equal(day(addMonthsUtc(new Date('2026-12-15T00:00:00Z'), 12).toISOString()), '2027-12-15');
  assert.equal(endOfDayUtc(new Date('2027-02-28T03:00:00Z')).toISOString(), '2027-02-28T23:59:59.999Z');
});
await check('the until date must be a real date', async () => {
  assert.equal(parseUntilDate('2027-02-30'), null);
  assert.equal(parseUntilDate('27-01-01'), null);
  assert.equal(parseUntilDate('2027-03-01').toISOString(), '2027-03-01T23:59:59.999Z');
});

// ---- owner only ----
await check('a non-owner is refused by every action', async () => {
  const other = '999999999999999999';
  assert.equal((await previewManualPremium(astro, other, grantInput(), NOW)).ok, false);
  const preview = await previewManualPremium(astro, OWNER, grantInput(), NOW);
  assert.equal((await confirmManualPremium(astro, other, preview.token, true, NOW)).ok, false);
  assert.equal((await extendManualPremium(astro, other, 1, '1m', NOW)).ok, false);
  assert.equal(await revokeManualPremium(astro, other, 1), false);
  assert.equal(db.premium_entitlements.length, 0);
});

// ---- cross-check ----
await check('a user grant with the ID of a server is not saved and offers to switch to Server', async () => {
  const result = await previewManualPremium(astro, OWNER, grantInput({ targetId: SERVER }), NOW);
  assert.equal(result.ok, false); assert.equal(result.code, 'wrong_type_server'); assert.equal(result.flip, 'server');
  assert.equal(result.target.name, 'Petto Lounge'); assert.equal(result.target.memberCount, 1234);
  assert.equal(db.premium_entitlements.length, 0);
});
await check('a server Petto only knows from Discord (bot is in it) is also caught', async () => {
  const result = await previewManualPremium(astro, OWNER, grantInput({ targetId: SERVER2 }), NOW);
  assert.equal(result.code, 'wrong_type_server');
});
await check('a server grant with the ID of a user is not saved and offers to switch to User', async () => {
  const result = await previewManualPremium(astro, OWNER, grantInput({ targetType: 'server', targetId: USER }), NOW);
  assert.equal(result.ok, false); assert.equal(result.code, 'wrong_type_user'); assert.equal(result.flip, 'user'); assert.equal(result.target.name, 'Ana');
});
await check('a user that only the Premium tables know (Discord gives nothing) is caught too', async () => {
  db.premium_entitlements.push({ id: 50, user_id: '444444444444444444', provider: 'polar', provider_subscription_id: 'sub_1', status: 'active', slot_limit: 1, current_period_end: null, metadata: {} });
  const result = await previewManualPremium(astro, OWNER, grantInput({ targetType: 'server', targetId: '444444444444444444' }), NOW);
  assert.equal(result.code, 'wrong_type_user');
});
await check('the owner ID as a server is refused', async () => {
  const result = await previewManualPremium(astro, OWNER, grantInput({ targetType: 'server', targetId: OWNER }), NOW);
  assert.equal(result.code, 'wrong_type_user');
});
await check('an ID Petto does not know as a server needs the box ticked', async () => {
  const preview = await previewManualPremium(astro, OWNER, grantInput({ targetType: 'server', targetId: UNKNOWN_SERVER }), NOW);
  assert.equal(preview.ok, true); assert.equal(preview.plan.needsAck, true); assert.equal(preview.target.known, false);
  assert.deepEqual(await confirmManualPremium(astro, OWNER, preview.token, false, NOW), { ok: false, code: 'unconfirmed' });
  assert.equal(db.premium_entitlements.length, 0);
  assert.equal((await confirmManualPremium(astro, OWNER, preview.token, true, NOW)).ok, true);
  assert.equal(db.premium_slot_assignments[0].guild_id, UNKNOWN_SERVER);
});
await check('an unknown user is allowed (with no name) and IDs of the wrong size are invalid', async () => {
  const unknown = await previewManualPremium(astro, OWNER, grantInput({ targetId: '555555555555555555' }), NOW);
  assert.equal(unknown.ok, true); assert.equal(unknown.target.known, false); assert.equal(unknown.target.name, null); assert.equal(unknown.plan.needsAck, false);
  for (const targetId of ['123', '1'.repeat(23), 'abc', '']) assert.equal((await previewManualPremium(astro, OWNER, grantInput({ targetId }), NOW)).code, 'invalid');
  assert.equal((await previewManualPremium(astro, OWNER, grantInput({ targetType: 'both' }), NOW)).code, 'invalid');
  assert.equal((await previewManualPremium(astro, OWNER, grantInput({ duration: 'forever' }), NOW)).code, 'invalid');
});

// ---- durations ----
await check('permanent: current_period_end null in the stored row', async () => {
  assert.equal((await give()).ok, true);
  const stored = byKey(`manual:user:${USER}`);
  assert.equal(stored.current_period_end, null); assert.equal(stored.metadata.permanent, true); assert.equal(stored.metadata.duration, 'permanent');
  assert.equal(stored.slot_limit, 3); assert.equal(stored.plan_key, 'premium-manual-3'); assert.equal(stored.provider, 'manual');
});
await check('a Premium for a person is saved with that person as its holder, not the owner', async () => {
  assert.equal((await give()).ok, true);
  assert.equal(byKey(`manual:user:${USER}`).user_id, USER, 'the person is the holder (the bot finds their Premium and gives them the role)');
});
await check('a grant for a person saved with the owner before is fixed when it is edited', async () => {
  db.premium_entitlements.push({ id: 60, user_id: OWNER, provider: 'manual', provider_subscription_id: `manual:user:${USER}`, plan_key: 'premium-manual-3', status: 'active', slot_limit: 3, current_period_end: null, metadata: { target_type: 'user', target_user_id: USER, permanent: true } });
  assert.equal((await give({ slotLimit: 4 })).ok, true);
  assert.equal(byKey(`manual:user:${USER}`).user_id, USER);
});
await check('timed: current_period_end is the end of the calendar day, permanent false, duration saved', async () => {
  for (const [duration, end] of [['1m', '2027-02-28'], ['3m', '2027-04-30'], ['6m', '2027-07-31'], ['1y', '2028-01-31']]) {
    reset();
    assert.equal((await give({ duration })).ok, true);
    const stored = byKey(`manual:user:${USER}`);
    assert.equal(stored.current_period_end, `${end}T23:59:59.999Z`, duration);
    assert.equal(stored.metadata.permanent, false); assert.equal(stored.metadata.duration, duration);
  }
});
await check('until a date: a past date and today are refused, a future date is saved as the end of that day', async () => {
  assert.equal((await previewManualPremium(astro, OWNER, grantInput({ duration: 'date', date: '2027-01-30' }), NOW)).code, 'past_date');
  assert.equal((await previewManualPremium(astro, OWNER, grantInput({ duration: 'date', date: '2027-01-31' }), new Date('2027-02-01T00:00:01Z'))).code, 'past_date');
  assert.equal((await previewManualPremium(astro, OWNER, grantInput({ duration: 'date', date: 'nope' }), NOW)).code, 'invalid');
  assert.equal((await give({ duration: 'date', date: '2027-03-15' })).ok, true);
  const stored = byKey(`manual:user:${USER}`);
  assert.equal(stored.current_period_end, '2027-03-15T23:59:59.999Z'); assert.equal(stored.metadata.duration, 'date');
});

// ---- granting again extends ----
await check('a live timed grant is extended from its current end (same row)', async () => {
  await give({ duration: '1m' });
  const id = byKey(`manual:user:${USER}`).id;
  const result = await give({ duration: '1m' }, true, new Date('2027-02-10T00:00:00Z'));
  assert.equal(result.ok, true); assert.equal(result.preview.plan.note, 'extended');
  assert.equal(db.premium_entitlements.length, 1); assert.equal(row(id).current_period_end, '2027-03-28T23:59:59.999Z');
  assert.equal(row(id).metadata.edited_by, OWNER);
});
await check('a live permanent grant stays permanent when granted again with a duration', async () => {
  await give();
  const result = await give({ duration: '3m' });
  assert.equal(result.preview.plan.note, 'kept_permanent');
  assert.equal(byKey(`manual:user:${USER}`).current_period_end, null);
  assert.equal(byKey(`manual:user:${USER}`).metadata.permanent, true);
});
await check('an expired grant restarts from now and is active again', async () => {
  await give({ duration: '1m' });
  const stored = byKey(`manual:user:${USER}`);
  const later = new Date('2027-06-10T09:00:00Z');
  const result = await give({ duration: '1m' }, true, later);
  assert.equal(result.preview.plan.note, 'restarted'); assert.equal(stored.current_period_end, '2027-07-10T23:59:59.999Z'); assert.equal(stored.status, 'active');
});
await check('granting a date to a live grant that ends later keeps the later end', async () => {
  await give({ duration: '1y' });
  const result = await give({ duration: 'date', date: '2027-03-01' });
  assert.equal(result.preview.plan.note, 'kept_later'); assert.equal(byKey(`manual:user:${USER}`).current_period_end, '2028-01-31T23:59:59.999Z');
});

// ---- server grants ----
await check('a server grant uses 1 slot, the owner account, and an active assignment', async () => {
  const result = await give({ targetType: 'server', targetId: SERVER, slotLimit: 25, duration: '6m' });
  assert.equal(result.ok, true); assert.equal(result.preview.plan.internalUserId, OWNER); assert.equal(result.preview.plan.slots, 1);
  const stored = byKey(`manual:server:${SERVER}`);
  assert.equal(stored.user_id, OWNER); assert.equal(stored.slot_limit, 1); assert.equal(stored.metadata.target_guild_id, SERVER);
  assert.deepEqual(db.premium_slot_assignments.map((a) => [a.guild_id, a.status, a.user_id]), [[SERVER, 'active', OWNER]]);
  assert.equal(result.preview.target.name, 'Petto Lounge');
});
await check('a server that another live grant holds is refused', async () => {
  db.premium_entitlements.push({ id: 90, user_id: USER, provider: 'polar', provider_subscription_id: 'sub_9', status: 'active', slot_limit: 1, current_period_end: null, metadata: {} });
  db.premium_slot_assignments.push({ id: 91, entitlement_id: 90, user_id: USER, guild_id: SERVER, status: 'active' });
  assert.equal((await previewManualPremium(astro, OWNER, grantInput({ targetType: 'server', targetId: SERVER }), NOW)).code, 'server_taken');
});

// ---- the signed confirmation ----
await check('a changed token, another owner or an old token cannot save; a changed grant is stale', async () => {
  const preview = await previewManualPremium(astro, OWNER, grantInput({ duration: '1m' }), NOW);
  const [body, sig] = preview.token.split('.');
  const forged = JSON.parse(Buffer.from(body, 'base64url').toString()); forged.duration = 'permanent'; forged.end = null;
  const forgedToken = `${Buffer.from(JSON.stringify(forged)).toString('base64url')}.${sig}`;
  assert.equal(await verifyPlan(astro, forgedToken, NOW.getTime()), null);
  assert.equal((await confirmManualPremium(astro, OWNER, forgedToken, true, NOW)).ok, false);
  assert.equal((await confirmManualPremium(astro, OWNER, preview.token, true, new Date(NOW.getTime() + 16 * 60_000))).ok, false);
  // the grant is created by someone else between the preview and the confirm
  await give({ duration: '1y' });
  assert.deepEqual(await confirmManualPremium(astro, OWNER, preview.token, true, NOW), { ok: false, code: 'stale' });
  assert.equal(byKey(`manual:user:${USER}`).current_period_end, '2028-01-31T23:59:59.999Z');
});
await check('confirm saves exactly what the preview showed', async () => {
  const preview = await previewManualPremium(astro, OWNER, grantInput({ duration: '3m', slotLimit: 5 }), NOW);
  assert.equal((await confirmManualPremium(astro, OWNER, preview.token, false, NOW)).ok, true);
  const stored = byKey(`manual:user:${USER}`);
  assert.equal(stored.current_period_end, preview.plan.end); assert.equal(stored.slot_limit, 5);
});

// ---- edit (sets exactly, same row) ----
async function edit(id, over, now = NOW) {
  const preview = await previewManualPremium(astro, OWNER, { mode: 'edit', entitlementId: id, duration: 'permanent', ...over }, now);
  if (!preview.ok) return preview;
  return { ...(await confirmManualPremium(astro, OWNER, preview.token, true, now)), preview };
}
await check('edit: permanent to 3 months, on the same row, metadata kept', async () => {
  await give();
  const stored = byKey(`manual:user:${USER}`);
  const grantedAt = stored.metadata.granted_at;
  const result = await edit(stored.id, { duration: '3m' });
  assert.equal(result.ok, true); assert.equal(result.preview.plan.prevEnd, null); assert.equal(result.preview.plan.note, 'set');
  assert.equal(db.premium_entitlements.length, 1); assert.equal(stored.current_period_end, '2027-04-30T23:59:59.999Z');
  assert.equal(stored.metadata.permanent, false); assert.equal(stored.metadata.duration, '3m');
  assert.equal(stored.metadata.granted_by, OWNER); assert.equal(stored.metadata.granted_at, grantedAt);
  assert.equal(stored.metadata.edited_by, OWNER); assert.ok(stored.metadata.edited_at); assert.equal(stored.slot_limit, 3);
});
await check('edit: timed to permanent, and edit shortens (it does not extend)', async () => {
  await give({ duration: '1y' });
  const stored = byKey(`manual:user:${USER}`);
  assert.equal((await edit(stored.id, { duration: '1m' })).ok, true);
  assert.equal(stored.current_period_end, '2027-02-28T23:59:59.999Z');
  assert.equal((await edit(stored.id, { duration: 'permanent' })).ok, true);
  assert.equal(stored.current_period_end, null); assert.equal(stored.metadata.permanent, true);
});
await check('edit: an expired user grant is reactivated', async () => {
  await give({ duration: '1m' });
  const stored = byKey(`manual:user:${USER}`);
  stored.status = 'expired'; stored.current_period_end = '2027-01-01T00:00:00.000Z';
  const result = await edit(stored.id, { duration: '6m' });
  assert.equal(result.ok, true); assert.equal(stored.status, 'active'); assert.equal(stored.current_period_end, '2027-07-31T23:59:59.999Z');
});
await check('edit: a revoked server grant is reactivated with the same assignment row, unless another live grant took the server', async () => {
  await give({ targetType: 'server', targetId: SERVER, duration: '1m' });
  const stored = byKey(`manual:server:${SERVER}`);
  assert.equal(await revokeManualPremium(astro, OWNER, stored.id), true);
  assert.equal(db.premium_slot_assignments[0].status, 'released');
  // another live grant takes the server meanwhile
  db.premium_entitlements.push({ id: 90, user_id: USER, provider: 'polar', provider_subscription_id: 'sub_9', status: 'active', slot_limit: 1, current_period_end: null, metadata: {} });
  db.premium_slot_assignments.push({ id: 91, entitlement_id: 90, user_id: USER, guild_id: SERVER, status: 'active' });
  assert.equal((await edit(stored.id, { duration: '3m' })).code, 'server_taken');
  assert.equal(stored.status, 'expired');
  db.premium_slot_assignments.pop();
  const result = await edit(stored.id, { duration: '3m' });
  assert.equal(result.ok, true); assert.equal(stored.status, 'active');
  assert.equal(db.premium_slot_assignments.length, 1); assert.equal(db.premium_slot_assignments[0].status, 'active');
  assert.equal(db.premium_slot_assignments[0].entitlement_id, stored.id);
});
await check('edit: slots lowered below the active servers are refused; raised or equal is fine', async () => {
  await give({ slotLimit: 5 });
  const stored = byKey(`manual:user:${USER}`);
  db.premium_slot_assignments.push(
    { id: 1, entitlement_id: stored.id, user_id: USER, guild_id: SERVER, status: 'active' },
    { id: 2, entitlement_id: stored.id, user_id: USER, guild_id: SERVER2, status: 'active' },
    { id: 3, entitlement_id: stored.id, user_id: USER, guild_id: UNKNOWN_SERVER, status: 'released' },
  );
  assert.equal((await edit(stored.id, { slotLimit: 1 })).code, 'slot_conflict');
  assert.equal(stored.slot_limit, 5);
  assert.equal((await edit(stored.id, { slotLimit: 2 })).ok, true);
  assert.equal(stored.slot_limit, 2); assert.equal(stored.plan_key, 'premium-manual-2');
  assert.equal(db.premium_slot_assignments.filter((a) => a.status === 'active').length, 2);
});
await check('edit: only manual entitlements can be edited, and only by the owner', async () => {
  db.premium_entitlements.push({ id: 70, user_id: USER, provider: 'polar', provider_subscription_id: 'sub_70', status: 'active', slot_limit: 1, current_period_end: '2027-05-01T00:00:00.000Z', metadata: {} });
  assert.equal((await edit(70, { duration: 'permanent' })).code, 'not_found');
  assert.equal((await extendManualPremium(astro, OWNER, 70, '1y', NOW)).code, 'not_found');
  assert.equal(db.premium_entitlements[0].current_period_end, '2027-05-01T00:00:00.000Z');
  await give();
  const id = byKey(`manual:user:${USER}`).id;
  assert.equal((await previewManualPremium(astro, '999999999999999999', { mode: 'edit', entitlementId: id, duration: '1m' }, NOW)).ok, false);
  assert.equal((await edit(id, { duration: 'date', date: '2020-01-01' })).code, 'past_date');
});

// ---- quick buttons ----
await check('extend 1 month / 1 year / make permanent on a row', async () => {
  await give({ duration: '1m' });
  const stored = byKey(`manual:user:${USER}`);
  assert.equal((await extendManualPremium(astro, OWNER, stored.id, '1m', NOW)).ok, true);
  assert.equal(stored.current_period_end, '2027-03-28T23:59:59.999Z');
  assert.equal((await extendManualPremium(astro, OWNER, stored.id, '1y', NOW)).ok, true);
  assert.equal(stored.current_period_end, '2028-03-28T23:59:59.999Z');
  assert.equal((await extendManualPremium(astro, OWNER, stored.id, 'permanent', NOW)).ok, true);
  assert.equal(stored.current_period_end, null);
  assert.equal((await extendManualPremium(astro, OWNER, stored.id, '2y', NOW)).code, 'invalid');
});

// ---- revoke ----
await check('revoke releases the assignments and keeps who the grant was for', async () => {
  await give({ targetType: 'server', targetId: SERVER, duration: '1m' });
  const stored = byKey(`manual:server:${SERVER}`);
  assert.equal(await revokeManualPremium(astro, OWNER, stored.id), true);
  assert.equal(stored.status, 'expired'); assert.ok(stored.metadata.revoked_at); assert.equal(stored.metadata.target_type, 'server'); assert.equal(stored.metadata.target_guild_id, SERVER);
  assert.equal(db.premium_slot_assignments[0].status, 'released');
  assert.equal(grantState(stored), 'revoked');
  assert.deepEqual(grantTarget(stored), { type: 'server', id: SERVER });
});

// ---- is it live ----
await check('current_period_end null is live forever, a future end is live, a past end is not (and neither is a non-active status)', async () => {
  const now = NOW.getTime();
  assert.equal(isLiveEntitlement({ status: 'active', current_period_end: null }, now), true);
  assert.equal(isLiveEntitlement({ status: 'active', current_period_end: '2027-02-01T00:00:00Z' }, now), true);
  assert.equal(isLiveEntitlement({ status: 'active', current_period_end: '2027-01-31T11:59:59Z' }, now), false);
  assert.equal(isLiveEntitlement({ status: 'expired', current_period_end: null }, now), false);
  assert.equal(isLiveEntitlement({ status: 'active', current_period_end: 'garbage' }, now), false);
  assert.equal(grantState({ status: 'active', current_period_end: null }, now), 'permanent');
  assert.equal(grantState({ status: 'active', current_period_end: '2027-02-01T00:00:00Z' }, now), 'timed');
  assert.equal(grantState({ status: 'active', current_period_end: '2027-01-01T00:00:00Z' }, now), 'expired');
});

// ---- the list ----
await check('the list resolves names of servers (saved copy, then Discord) and users', async () => {
  await give({ targetType: 'server', targetId: SERVER, duration: '1m' });
  await give({ targetId: USER });
  const list = await listManualPremium(astro);
  assert.equal(list.length, 2);
  const names = await resolveGrantNames(astro, list.map((g) => grantTarget(g)));
  assert.equal(names.get(`server:${SERVER}`).name, 'Petto Lounge');
  assert.equal(names.get(`user:${USER}`).name, 'Ana');
  assert.ok(names.get(`user:${USER}`).image.includes('avatars/'));
});

// ---- the bot and the website both honour current_period_end ----
for (const [file, pattern] of [['src/utils/premium.ts', /current_period_end\)\s*return true;[\s\S]{0,200}periodEnd > Date\.now\(\)/], ['src/utils/guildPremium.ts', /!entitlement\.current_period_end \|\| new Date\(entitlement\.current_period_end\)\.getTime\(\) > Date\.now\(\)/]]) {
  await check(`${file} stops counting a grant after current_period_end`, async () => assert.match(fs.readFileSync(`${root}${file}`, 'utf8'), pattern));
}
await check('the page has no direct grant action left (every grant goes through the signed confirmation)', async () => {
  const page = fs.readFileSync(`${root}src/pages/dash/admin.astro`, 'utf8');
  assert.ok(!/action === 'grant'/.test(page));
  assert.match(page, /origin !== Astro\.url\.origin/);
});

globalThis.fetch = realFetch;
if (failed) { console.error(`check-premium-admin: ${failed} failed`); process.exit(1); }
console.log('check-premium-admin: ok');
