import { readFileSync } from 'node:fs';
// Checks the rules of the dashboard's language prefix (src/utils/dashPrefix.mjs): which requests are sent to /es/dash or /pt-br/dash and
// which are answered where they are. Run: node scripts/check-dash-prefix.mjs
import { dashLangRedirect, withDashPrefix } from '../src/utils/dashPrefix.mjs';

const nav = { accept: 'text/html,application/xhtml+xml', 'sec-fetch-mode': 'navigate', 'sec-fetch-dest': 'document' };
const h = (o) => ({ get: (name) => o[name.toLowerCase()] ?? null });
const cases = [
  // [description, request, expected]
  ['es page navigation', { method: 'GET', pathname: '/dash/guild/1/overview', search: '?section=x', headers: h(nav), lang: 'es' }, '/es/dash/guild/1/overview?section=x'],
  ['pt-BR server list', { method: 'GET', pathname: '/dash/manage', search: '', headers: h(nav), lang: 'pt-BR' }, '/pt-br/dash/manage'],
  ['English never prefixed', { method: 'GET', pathname: '/dash/manage', search: '', headers: h(nav), lang: 'en' }, null],
  ['dash root', { method: 'GET', pathname: '/dash', search: '', headers: h(nav), lang: 'es' }, '/es/dash'],
  ['HEAD navigation', { method: 'HEAD', pathname: '/dash/manage', search: '', headers: h(nav), lang: 'es' }, '/es/dash/manage'],
  ['POST is never redirected', { method: 'POST', pathname: '/dash/guild/1/general', search: '', headers: h(nav), lang: 'es' }, null],
  ['partial read by AJAX', { method: 'GET', pathname: '/dash/guild/1/general', search: '', headers: h({ ...nav, 'x-dash-partial': '1' }), lang: 'es' }, null],
  ['fetch of an API', { method: 'GET', pathname: '/dash/guild/1/ac-data', search: '', headers: h({ accept: 'application/json', 'sec-fetch-mode': 'cors', 'sec-fetch-dest': 'empty' }), lang: 'es' }, null],
  ['event stream', { method: 'GET', pathname: '/dash/guild/1/events', search: '', headers: h({ accept: 'text/event-stream', 'sec-fetch-mode': 'cors', 'sec-fetch-dest': 'empty' }), lang: 'es' }, null],
  ['image proxy in an <img>', { method: 'GET', pathname: '/dash/history/avatar/1/a', search: '', headers: h({ accept: 'image/avif,*/*', 'sec-fetch-mode': 'no-cors', 'sec-fetch-dest': 'image' }), lang: 'es' }, null],
  ['language switch', { method: 'GET', pathname: '/dash/lang', search: '?to=en&next=/dash', headers: h(nav), lang: 'es' }, null],
  ['login callback', { method: 'GET', pathname: '/dash/callback', search: '?code=x', headers: h(nav), lang: 'es' }, null],
  ['logout', { method: 'GET', pathname: '/dash/logout', search: '', headers: h(nav), lang: 'es' }, null],
  ['health as JSON', { method: 'GET', pathname: '/dash/health', search: '?format=json', headers: h(nav), lang: 'es' }, null],
  ['old browser without sec-fetch, HTML', { method: 'GET', pathname: '/dash/manage', search: '', headers: h({ accept: 'text/html' }), lang: 'es' }, '/es/dash/manage'],
  ['old browser without sec-fetch, JSON', { method: 'GET', pathname: '/dash/guild/1/version', search: '', headers: h({ accept: 'application/json' }), lang: 'es' }, null],
  ['not a dashboard path', { method: 'GET', pathname: '/premium', search: '', headers: h(nav), lang: 'es' }, null],
  ['dashboard-like but not it', { method: 'GET', pathname: '/dashboard', search: '', headers: h(nav), lang: 'es' }, null],
  ['feedback board in Spanish', { method: 'GET', pathname: '/feedback', search: '?kind=idea', headers: h(nav), lang: 'es' }, '/es/feedback?kind=idea'],
  ['a post of the board in Portuguese', { method: 'GET', pathname: '/feedback/12', search: '', headers: h(nav), lang: 'pt-BR' }, '/pt-br/feedback/12'],
  ['feedback board in English', { method: 'GET', pathname: '/feedback', search: '', headers: h(nav), lang: 'en' }, null],
  ['feedback sign-in is answered where it is asked', { method: 'GET', pathname: '/feedback/login', search: '?next=/feedback', headers: h(nav), lang: 'es' }, null],
  ['feedback list read by the board script', { method: 'GET', pathname: '/feedback', search: '?kind=bug', headers: h({ accept: 'text/html', 'sec-fetch-mode': 'cors', 'sec-fetch-dest': 'empty' }), lang: 'es' }, null],
  ['the feedback API is not a page', { method: 'POST', pathname: '/api/feedback', search: '', headers: h(nav), lang: 'es' }, null],
  ['already prefixed is not touched here', { method: 'GET', pathname: '/es/dash/manage', search: '', headers: h(nav), lang: 'es' }, null],
];
let failed = 0;
for (const [name, req, expected] of cases) {
  const got = dashLangRedirect(req);
  if (got !== expected) { failed += 1; console.log(`FAIL ${name}: expected ${expected}, got ${got}`); }
}
const prefixCases = [
  ['/dash/manage', 'es', '/es/dash/manage'], ['/dash?error=x', 'pt-BR', '/pt-br/dash?error=x'], ['/dash/manage', 'en', '/dash/manage'], ['/form/abc', 'es', '/form/abc'],
];
for (const [path, lang, expected] of prefixCases) {
  const got = withDashPrefix(path, lang);
  if (got !== expected) { failed += 1; console.log(`FAIL withDashPrefix(${path}, ${lang}): expected ${expected}, got ${got}`); }
}
console.log(`${cases.length + prefixCases.length} prefix rules checked, ${failed} failed`);
// The rewrite of /es/dash to /dash runs the middleware again: that inner request must never be redirected back (a loop).
const middleware = readFileSync(new URL('../src/middleware.ts', import.meta.url), 'utf8');
if (!/\(locals as Record<string, unknown>\)\.dashLang \? null : dashLangRedirect\(/.test(middleware)) {
  console.error('FAILED: the language redirect in src/middleware.ts must be skipped when locals.dashLang is already set (redirect loop on /es/dash).');
  process.exit(1);
}
console.log('redirect loop guard present');
process.exit(failed ? 1 : 0);
