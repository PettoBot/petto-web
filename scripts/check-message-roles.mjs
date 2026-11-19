// Checks the Message roles page of the dashboard (rules "at N messages, give this role"): the rule is checked like the bot does (same limits), the page saves with the keys the table has and
// only in the server of the page, the menu, the access by role, the module card and its status know the page, and the texts are in Spanish and Portuguese.
// Run: node scripts/check-message-roles.mjs
import { readFileSync } from 'node:fs';
import { loadTs } from './og/load-copy.mjs';

const { checkMessageRule, MAX_MESSAGE_RULES, MAX_MESSAGES, MAX_PERIOD_DAYS } = await loadTs('src/utils/messageRoles.ts');
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => { if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); } };
const ROLE = '1414452131850879081';
const rule = (over = {}) => checkMessageRule({ roleId: ROLE, messages: '100', mode: 'total', periodDays: '', removeBelow: false, ...over });

check('limits are the bot ones', MAX_MESSAGE_RULES === 25 && MAX_MESSAGES === 10_000_000 && MAX_PERIOD_DAYS === 365);
let r = rule();
check('total: ok', r.ok && r.rule.mode === 'total' && r.rule.messages === 100 && r.rule.periodDays === 0 && r.rule.removeBelow === false);
check('total never takes the role away', rule({ removeBelow: true }).rule.removeBelow === false);
r = rule({ mode: 'period', periodDays: '7', removeBelow: true });
check('period: ok', r.ok && r.rule.mode === 'period' && r.rule.periodDays === 7 && r.rule.removeBelow === true);
check('period without remove below', rule({ mode: 'period', periodDays: '30' }).rule.removeBelow === false);
check('role must be an id', ['', 'abc', '12', null, undefined].every((x) => rule({ roleId: x }).reason === 'role'));
check('messages must be a whole number from 1', ['0', '-3', '1.5', 'x', '', String(MAX_MESSAGES + 1)].every((x) => rule({ messages: x }).reason === 'messages') && rule({ messages: String(MAX_MESSAGES) }).ok);
check('period days from 1 to 365', ['', '0', '366', '2.5', 'x'].every((x) => rule({ mode: 'period', periodDays: x }).reason === 'period') && rule({ mode: 'period', periodDays: '365' }).ok);
check('the days are not asked for a total rule', rule({ mode: 'total', periodDays: 'x' }).ok);
check('an unknown mode is a total rule', rule({ mode: 'weird' }).rule.mode === 'total');

const page = read('src/pages/dash/guild/[id]/message-roles.astro');
check('page: saves in message_roles with the keys of the table', /message_roles\?on_conflict=guild_id,role_id,messages,mode,period_days/.test(page) && /resolution=merge-duplicates/.test(page));
check('page: every change is in the server of the page', /message_roles\?guild_id=eq\.\$\{id\}&id=eq\.\$\{ruleId\}/.test(page) && (page.match(/message_roles\?guild_id=eq\.\$\{id\}&id=eq/g) ?? []).length === 2);
check('page: the rule is checked first, and the room', /checkMessageRule\(/.test(page) && /MAX_MESSAGE_RULES/.test(page));
check('page: reads in order and says when the table is not there yet', /order=messages\.asc,id\.asc/.test(page) && /const ready = rulesRes\.ok/.test(page));
const card = read('src/components/DashMessageRoles.astro');
check('card: the days and the switch of the period are hidden until the period is chosen', (card.match(/data-mr-period hidden/g) ?? []).length === 2 && /data-mr-mode/.test(card));
check('card: docs button is a dashboard button', /btn btn-ghost btn-sm" href=\{docsUrl\}/.test(card));
check('menu: under Roles, new on its day', /id: 'message-roles'[^\n]*isNew: isStillNew\('2026-11-19'\)/.test(read('src/components/DashGuildLayout.astro')));
check('access: a page of the Roles group', /pages: \['join-roles', 'aged-roles', 'message-roles'\]/.test(read('src/utils/dashAccess.ts')));
check('module card and status', /id: 'message-roles'[^\n]*since: '2026-11-19'/.test(read('src/utils/dashModules.ts')) && /set\('message-roles'/.test(read('src/utils/moduleStatuses.ts')) && /'message-roles': \['message-roles'\]/.test(read('src/utils/navModules.ts')));
check('search: the page is found', /message-roles/.test(read('src/data/dashSearchIndex.json')));
for (const [lang, file] of [['es', 'src/i18n/dash-es.ts'], ['pt', 'src/i18n/dash-pt.ts']]) {
  const text = read(file);
  for (const key of ['Message roles', 'All time', 'In the last {n} days', 'Which messages count', 'Take the role away if the member falls under the number']) check(`${lang}: "${key}"`, text.includes(`"${key}":`));
}
if (failed) { console.log(`${failed} check(s) failed`); process.exit(1); }
console.log('message-roles: ok');
