// Checks the Role triggers page: the rules of src/utils/roleTriggers.mjs (the same as the bot's src/utils/roleTriggers.js), who may change them
// (Administrator only), that Support mode cannot write the page, and that the page is in the menu, the modules list and the role access sections.
// Run: node scripts/check-dash-role-triggers.mjs
import { readFileSync } from 'node:fs';
import {
  ACTIONS, DURATION_ACTIONS, MAX_REASON, MAX_RULES, MAX_TIMEOUT_MS, TRIGGERS, canEditRoleTriggers, cleanRule, parseDuration, shortDuration, validateRule,
} from '../src/utils/roleTriggers.mjs';

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
const rule = (extra = {}) => validateRule({ role, guildId: GUILD, action: 'ban', ...extra });

// --- the constants are the bot's ---
same('actions', ACTIONS, ['warn', 'mute', 'jail', 'kick', 'ban', 'remove_role']);
same('moments', TRIGGERS, ['role_added', 'onboarding', 'either']);
same('actions with a duration', DURATION_ACTIONS, ['mute', 'jail', 'ban']);
same('limits', [MAX_RULES, MAX_REASON, MAX_TIMEOUT_MS], [25, 200, 28 * 24 * 3600 * 1000]);

// --- durations: the units the bot reads ---
same('1h', parseDuration('1h'), 3_600_000);
same('1d', parseDuration('1d'), 86_400_000);
same('3d 4h', parseDuration('3d 4h'), 3 * 86_400_000 + 4 * 3_600_000);
same('1h30m', parseDuration('1h30m'), 5_400_000);
same('1 hour 30 minutes', parseDuration('1 hour 30 minutes'), 5_400_000);
same('spanish words', parseDuration('2 horas y 30 minutos'), 9_000_000);
same('portuguese words', parseDuration('1 semana'), 7 * 86_400_000);
same('1.5h', parseDuration('1.5h'), 5_400_000);
for (const bad of ['', '0h', 'abc', '10', '1x', '-1h', null, undefined, 'a'.repeat(65), '1h foo']) same(`duration rejects ${JSON.stringify(bad)}`, parseDuration(bad), null);
same('short form', [shortDuration(3_600_000), shortDuration(90_000), shortDuration(86_400_000 + 7_200_000), shortDuration(45_000), shortDuration(0), shortDuration(null)], ['1h', '1m 30s', '1d 2h', '45s', '', '']);

// --- validation, in the order of the bot ---
same('a plain rule', rule({ action: 'warn' }), { ok: true, rule: { role_id: ROLE, action: 'warn', duration_ms: null, reason: null, on_event: 'role_added' } });
same('every action is valid', ACTIONS.map((action) => rule({ action }).ok), ACTIONS.map(() => true));
same('every moment is valid', TRIGGERS.map((on) => rule({ on }).ok), TRIGGERS.map(() => true));
same('no role', validateRule({ role: null, guildId: GUILD, action: 'ban' }), { ok: false, error: 'noRole' });
same('@everyone', validateRule({ role: { id: GUILD }, guildId: GUILD, action: 'ban' }), { ok: false, error: 'everyone' });
same('managed role', validateRule({ role: { id: ROLE, managed: true }, guildId: GUILD, action: 'ban' }), { ok: false, error: 'managed' });
same('bad action', rule({ action: 'nuke' }), { ok: false, error: 'badAction' });
same('bad moment', rule({ on: 'sometimes' }), { ok: false, error: 'badOn' });
const many = Array.from({ length: MAX_RULES }, (_, i) => `${1290000000000000200 + i}`);
same('25 rules is the limit', rule({ existingRoleIds: many }), { ok: false, error: 'tooMany' });
same('24 rules still has room', rule({ existingRoleIds: many.slice(1) }).ok, true);
same('replacing a rule at the limit is fine', rule({ existingRoleIds: [ROLE, ...many.slice(1)] }).ok, true);
same('duration on warn', rule({ action: 'warn', duration: '1h' }), { ok: false, error: 'noDuration' });
same('duration on kick', rule({ action: 'kick', duration: '1h' }), { ok: false, error: 'noDuration' });
same('duration on remove_role', rule({ action: 'remove_role', duration: '1h' }), { ok: false, error: 'noDuration' });
same('bad duration', rule({ duration: 'soon' }), { ok: false, error: 'badDuration' });
same('ban with a duration', rule({ duration: '1d' }).rule.duration_ms, 86_400_000);
same('jail with a duration', rule({ action: 'jail', duration: '12h' }).rule.duration_ms, 43_200_000);
same('mute for 28 days', rule({ action: 'mute', duration: '28d' }).rule.duration_ms, MAX_TIMEOUT_MS);
same('mute for 29 days', rule({ action: 'mute', duration: '29d' }), { ok: false, error: 'timeoutCap' });
same('a ban may last longer than 28 days', rule({ duration: '90d' }).ok, true);
same('reason is trimmed', rule({ reason: '  spam  ' }).rule.reason, 'spam');
same('blank reason is nothing', rule({ reason: '   ' }).rule.reason, null);
same('reason of 200', rule({ reason: 'a'.repeat(200) }).ok, true);
same('reason of 201', rule({ reason: 'a'.repeat(201) }), { ok: false, error: 'reasonLong' });
same('moment is kept', rule({ on: 'either' }).rule.on_event, 'either');

// --- a row of the table, made safe to draw ---
same('clean row', cleanRule({ guild_id: GUILD, role_id: ROLE, action: 'mute', duration_ms: '3600000', reason: 'x', on_event: 'onboarding' }), { roleId: ROLE, action: 'mute', durationMs: 3_600_000, reason: 'x', on: 'onboarding' });
same('clean row with junk', cleanRule({ role_id: 5, action: '<b>', duration_ms: -3, reason: null, on_event: 'x' }), { roleId: '5', action: 'warn', durationMs: 0, reason: '', on: 'role_added' });

// --- who may change them: Administrator (the owner has it), as the command (setDefaultMemberPermissions Administrator) ---
check('owner may', canEditRoleTriggers({ owner: true, permissions: '0' }));
check('administrator may', canEditRoleTriggers({ owner: false, permissions: '8' }));
check('administrator among others may', canEditRoleTriggers({ owner: false, permissions: String(8n | 32n | 2048n) }));
check('Manage Server alone may not', !canEditRoleTriggers({ owner: false, permissions: '32' }));
check('no permissions may not', !canEditRoleTriggers({ owner: false, permissions: '0' }));
check('nothing known may not', !canEditRoleTriggers(undefined) && !canEditRoleTriggers(null) && !canEditRoleTriggers({}));
check('junk permissions may not', !canEditRoleTriggers({ owner: false, permissions: 'abc' }));

// --- the wiring ---
const page = read('src/pages/dash/guild/[id]/role-triggers.astro');
check('the page asks for Administrator and not for a role access or Support mode', /if \(!auth\.devView && !auth\.access\)/.test(page) && /canEditRoleTriggers\(/.test(page));
check('every write is refused first when the visitor may not', /if \(!canEdit\) message = /.test(page) && page.indexOf('if (!canEdit)') < page.indexOf("action === 'add'") && page.indexOf("action === 'add'") < page.indexOf('method: \'POST\', headers'));
check('the page validates with the shared rules before it writes', /validateRule\(/.test(page) && /on_conflict=guild_id,role_id/.test(page) && /role_triggers\?guild_id=eq\.\$\{id\}&role_id=eq\./.test(page));
check('a missing table is a calm state', /'unavailable'/.test(page) && /PGRST205/.test(page) && /not available yet/.test(read('src/components/DashRoleTriggers.astro')));
check('support mode cannot write the page', !/page: 'role-triggers/.test(read('src/utils/supportEdit.ts')));
check('role access has the page in Moderation', /id: 'moderation'[^\n]*'role-triggers'/.test(read('src/utils/dashAccess.ts')));
check('the menu has the page', /id: 'role-triggers', href: `\/dash\/guild\/\$\{guildId\}\/role-triggers`/.test(read('src/components/DashGuildLayout.astro')));
check('the modules list has a card', /id: 'role-triggers'[^\n]*category: 'moderation'/.test(read('src/utils/dashModules.ts')));
check('the commands page knows the command', /roletrigger: \[/.test(read('src/data/commandText.ts')) && /"name": "roletrigger"/.test(read('src/data/commands.generated.json')));

if (failed) { console.log(`${failed} check(s) failed.`); process.exit(1); }
console.log('Role triggers checks passed.');
