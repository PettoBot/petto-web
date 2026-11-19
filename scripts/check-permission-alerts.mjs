// Checks the permission problems card of the Overview (what Petto could not do because a permission is missing): the call to the bot sends the right requests and reads the answer safely, the route is for
// Manage Server only (and refuses another origin when it changes something), the card writes what the bot says as text (never as HTML) and sits on the Overview.
// Run: node scripts/check-permission-alerts.mjs
import { readFileSync } from 'node:fs';
import { loadTs } from './og/load-copy.mjs';

process.env.PETTO_BOT_API_URL = 'http://bot.test';
process.env.PETTO_BOT_API_SECRET = 'secret';
const { callPettoPermissionAlerts } = await loadTs('src/utils/pettoBotApi.ts');
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => { if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); } };

const calls = [];
const original = globalThis.fetch;
let answer = { status: 200, body: { ok: true, alerts: [] } };
globalThis.fetch = async (url, init = {}) => { calls.push({ url: String(url), init }); return new Response(JSON.stringify(answer.body), { status: answer.status }); };
const context = {};
const good = { key: 'command:ban|POST /guilds/:id/bans/:id|BanMembers@server||', feature: 'the command ban', kind: 'missing', lines: ['I am missing Ban Members in this server.'], occurrences: 3, firstSeen: '2026-11-18T10:00:00.000Z', lastSeen: '2026-11-18T12:00:00.000Z', notifiedAt: null };

answer = { status: 200, body: { ok: true, alerts: [good, { key: '' }, { ...good, key: 'b', lines: Array.from({ length: 20 }, (_, i) => `l${i}`), kind: 'weird' }] } };
let result = await callPettoPermissionAlerts(context, '1414452131850879080', '293504726505357312', 'list', '', 'es');
check('list: GET with the user', calls[0].init.method === 'GET' && calls[0].url === 'http://bot.test/api/dashboard/guild/1414452131850879080/permission-alerts?user_id=293504726505357312', calls[0].url);
check('list: key and language sent', calls[0].init.headers['X-Petto-Dashboard-Key'] === 'secret' && calls[0].init.headers['X-Petto-Language'] === 'es');
check('list: rows read, the one without a key dropped', result.ok && result.alerts.length === 2 && result.alerts[0].key === good.key && result.alerts[0].occurrences === 3);
check('list: lines and kind are cleaned', result.alerts[1].lines.length === 8 && result.alerts[1].kind === 'missing');

answer = { status: 200, body: { ok: true } };
result = await callPettoPermissionAlerts(context, '1414452131850879080', '293504726505357312', 'dismiss', 'some key', 'en');
const post = calls.at(-1);
check('dismiss: POST with the key', post.init.method === 'POST' && post.url.endsWith('/permission-alerts/dismiss') && JSON.parse(post.init.body).key === 'some key' && JSON.parse(post.init.body).user_id === '293504726505357312');
check('dismiss: ok', result.ok === true);

answer = { status: 500, body: { ok: false, message: 'No' } };
result = await callPettoPermissionAlerts(context, '1', '2', 'list');
check('a failure is not ok and has no rows', !result.ok && result.alerts.length === 0);
globalThis.fetch = async () => { throw new Error('down'); };
result = await callPettoPermissionAlerts(context, '1', '2', 'list');
check('the bot away: not ok, no throw', !result.ok && result.down === true);
globalThis.fetch = original;

const route = read('src/pages/dash/guild/[id]/permission-alerts.ts');
check('route: manage server only', /canManageGuild\(/.test(route) && /auth\.devView \|\| auth\.access/.test(route));
check('route: origin of the change', /origin !== new URL\(astro\.request\.url\)\.origin/.test(route));
check('route: GET lists, POST dismisses', /export const GET/.test(route) && /export const POST/.test(route) && /'dismiss'/.test(route));
const card = read('src/components/DashPermissionAlerts.astro');
check('card: text only', !/innerHTML\s*=\s*(?!['"])\S/.test(card) && /textContent = alert\.feature/.test(card) && /p\.textContent = line/.test(card));
check('card: hidden until there is something', /hidden aria-live/.test(card) && /box\.hidden = alerts\.length === 0/.test(card));
check('card: texts from the dictionary', !/aria-label', 'Dismiss'/.test(card) && /data-t-dismiss=\{dt\('Dismiss'\)\}/.test(card));
check('overview: has the card', /<DashPermissionAlerts guildId=\{guildId\} \/>/.test(read('src/components/DashGuildOverview.astro')));
for (const [lang, file] of [['es', 'src/i18n/dash-es.ts'], ['pt', 'src/i18n/dash-pt.ts']]) {
  const text = read(file);
  for (const key of ['Petto is missing permissions', 'Check again', 'Happened {n} times.', 'Only people with Manage Server can see this.']) check(`${lang}: "${key}"`, text.includes(`"${key}":`));
}
if (failed) { console.log(`${failed} check(s) failed`); process.exit(1); }
console.log('permission-alerts: ok');
