// Checks the Role quotas page: the rules of src/utils/roleQuotas.mjs (the same as the bot's src/utils/roleQuotas.js), who may change them (Administrator only),
// that Support mode cannot write the page, and that the page is in the menu, the modules list, the module statuses and the role access sections.
// Run: node scripts/check-dash-role-quotas.mjs
import { readFileSync } from 'node:fs';
import { MAX_RULES, MAX_MESSAGES, MAX_PERIOD_DAYS, MAX_STRIKES, DEFAULTS, canEditRoleQuotas, cleanRule, periodEnd, validateRule } from '../src/utils/roleQuotas.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); }
};
const same = (name, got, expected) => check(name, JSON.stringify(got) === JSON.stringify(expected), `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);

const GUILD = '1290000000000000001';
const ROLE = '1290000000000000102';
const role = { id: ROLE, managed: false };
const rule = (extra = {}) => validateRule({ role, guildId: GUILD, messages: 50, ...extra });

// --- the limits are the bot's ---
same('limits', [MAX_RULES, MAX_MESSAGES, MAX_PERIOD_DAYS, MAX_STRIKES], [25, 100000, 90, 20]);
same('defaults: a week, 3 in a row', DEFAULTS, { periodDays: 7, strikes: 3 });

// --- validation, in the order of the bot ---
const good = rule();
check('a good rule', good.ok === true);
same('the rule saved', [good.rule.role_id, good.rule.period_days, good.rule.min_messages, good.rule.max_strikes, good.rule.notify_dm, good.rule.report_channel_id], [ROLE, 7, 50, 3, true, null]);
check('a new period starts now', Math.abs(new Date(good.rule.period_started_at).getTime() - Date.now()) < 5000);
same('no role', validateRule({ role: null, guildId: GUILD, messages: 5 }).error, 'noRole');
same('everyone', validateRule({ role: { id: GUILD, managed: false }, guildId: GUILD, messages: 5 }).error, 'everyone');
same('managed', validateRule({ role: { id: ROLE, managed: true }, guildId: GUILD, messages: 5 }).error, 'managed');
for (const bad of [0, '0', '', 'abc', '2.5', -1, MAX_MESSAGES + 1, null]) same(`messages ${JSON.stringify(bad)}`, rule({ messages: bad }).error, 'badMessages');
same('messages at the limit', rule({ messages: MAX_MESSAGES }).ok, true);
for (const bad of [0, 91, 'x', '1.5']) same(`period ${JSON.stringify(bad)}`, rule({ periodDays: bad }).error, 'badPeriod');
for (const bad of [0, 21, 'x']) same(`strikes ${JSON.stringify(bad)}`, rule({ strikes: bad }).error, 'badStrikes');
same('bad channel', rule({ reportChannelId: 'general' }).error, 'badChannel');
same('a channel', rule({ reportChannelId: '1290000000000000200' }).rule.report_channel_id, '1290000000000000200');
const many = Array.from({ length: MAX_RULES }, (_, i) => `129000000000000${String(1000 + i)}`);
same('too many', rule({ existingRoleIds: many }).error, 'tooMany');
same('replacing one that exists is not a new one', rule({ existingRoleIds: [ROLE, ...many.slice(1)] }).ok, true);
same('DMs off', rule({ notifyDm: false }).rule.notify_dm, false);

// --- what the page shows ---
const clean = cleanRule({ role_id: ROLE, period_days: 14, min_messages: 30, max_strikes: 2, notify_dm: false, report_channel_id: '1290000000000000200', period_started_at: '2026-11-01T00:00:00Z', last_run_at: null, last_met: null });
same('a clean rule', [clean.roleId, clean.periodDays, clean.minMessages, clean.maxStrikes, clean.notifyDm, clean.reportChannelId, clean.lastMet], [ROLE, 14, 30, 2, false, '1290000000000000200', null]);
same('a report channel that is not an id is dropped', cleanRule({ report_channel_id: 'x' }).reportChannelId, null);
same('the period ends', periodEnd('2026-11-01T00:00:00.000Z', 7), '2026-11-08T00:00:00.000Z');
same('no end for a bad start', periodEnd('nope', 7), null);

// --- who may change them ---
check('the owner', canEditRoleQuotas({ owner: true, permissions: '0' }));
check('an administrator', canEditRoleQuotas({ owner: false, permissions: '8' }));
check('not Manage Roles', !canEditRoleQuotas({ owner: false, permissions: String(0x10000000) }));
check('not Manage Server', !canEditRoleQuotas({ owner: false, permissions: String(0x20) }));
check('no guild', !canEditRoleQuotas(null) && !canEditRoleQuotas({ permissions: 'x' }));

// --- the page is in place ---
const page = read('src/pages/dash/guild/[id]/role-quotas.astro');
check('the page asks for the permissions of Discord, not the cookie', /canEditRoleQuotas\(guilds\.find/.test(page) && /getCachedUserGuilds/.test(page));
check('the page does not write when it cannot edit', /if \(!canEdit\) message = \{ kind: 'err'/.test(page));
check('the same validation as the bot', /validateRule\(\{/.test(page));
check('a report channel outside the server is not kept', /channelById\.has\(reportId\)/.test(page));
check('saving starts a new period with the count at zero', /period_started_at/.test(read('src/utils/roleQuotas.mjs')) && /messages: 0/.test(page));
check('who has strikes is a number per role, never who', /select=role_id/.test(page) && !/user_id/.test(page));
check('the menu', /id: 'role-quotas'/.test(read('src/components/DashGuildLayout.astro')));
check('the modules list', /id: 'role-quotas'/.test(read('src/utils/dashModules.ts')));
check('the module statuses', /set\('role-quotas'/.test(read('src/utils/moduleStatuses.ts')));
check('the role access sections', /'role-quotas'/.test(read('src/utils/dashAccess.ts')));
check('Support mode stays closed', !/role-quotas/.test(read('src/utils/supportEdit.ts')));

if (failed) { console.log(`${failed} check(s) failed`); process.exit(1); }
console.log('Role quota page checks passed (rules, permissions, the page in the menu and the lists).');
