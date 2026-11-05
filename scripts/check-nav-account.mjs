// Checks the login of the top bar (src/utils/navAccount.mjs, src/pages/api/session.ts, src/components/NavAccount.astro).
// Run: node scripts/check-nav-account.mjs
import { existsSync, readFileSync } from 'node:fs';
import { LOGIN_HREF } from '../src/utils/dashLogin.mjs';
import { accountEntries, accountState, cacheText, initialOf, loginHref, publicUser, readCache, sessionAnswer, SESSION_ENDPOINT, SUPPORT_URL } from '../src/utils/navAccount.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); }
};
const same = (name, got, expected) => check(name, JSON.stringify(got) === JSON.stringify(expected), `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);

// What the endpoint says: a name and a picture of a session, never the rest of it.
const session = {
  userId: '123456789012345678', username: 'Camila', avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/abc123.png?size=64',
  accessToken: 'ACCESS-TOKEN-SECRET', refreshToken: 'REFRESH-TOKEN-SECRET', expiresAt: 1893456000000,
};
const body = JSON.stringify(sessionAnswer(session));
same('endpoint answer for a session', JSON.parse(body), { user: { name: 'Camila', avatar: session.avatar } });
// The picture's address names the account (Discord's own address), the one place where that number is needed.
const bodyWithoutPicture = body.replace(session.avatar, '');
for (const secret of [session.userId, session.accessToken, session.refreshToken, String(session.expiresAt), 'accessToken', 'refreshToken', 'userId']) check(`no ${secret} in the answer`, !bodyWithoutPicture.includes(secret));
same('endpoint answer for a visitor', sessionAnswer(null), { user: null });
same('endpoint answer for a broken session', sessionAnswer({ username: '   ' }), { user: null });
same('a name loses control characters', publicUser({ username: 'Ca\u0000mi\nla', avatar: null }), { name: 'Camila', avatar: null });
check('a long name is cut', publicUser({ username: 'x'.repeat(500), avatar: null }).name.length === 80);
same('a picture from another site is dropped', publicUser({ username: 'A', avatar: 'https://example.com/a.png' }).avatar, null);
same('a script address is dropped', publicUser({ username: 'A', avatar: 'javascript:alert(1)' }).avatar, null);
same('no avatar stays null', publicUser({ username: 'A', avatar: null }).avatar, null);

// What the bar shows for an answer: the profile only for a well-formed user, Login for everything else.
const guest = { state: 'guest', user: null };
for (const [name, answer] of [['null', null], ['text', 'oops'], ['empty object', {}], ['user null', { user: null }], ['user without a name', { user: { avatar: null } }], ['empty name', { user: { name: ' ' } }], ['user is a string', { user: 'Camila' }], ['an error body', { error: 'x' }]]) {
  same(`state for ${name}`, accountState(answer), guest);
}
same('state for a user', accountState({ user: { name: 'Camila', avatar: session.avatar } }), { state: 'user', user: { name: 'Camila', avatar: session.avatar } });
same('state for a user without a picture', accountState({ user: { name: 'Camila' } }), { state: 'user', user: { name: 'Camila', avatar: null } });
same('state ignores what the bar does not need', accountState({ user: { name: 'Camila', avatar: null, id: '1', accessToken: 'x' } }), { state: 'user', user: { name: 'Camila', avatar: null } });
same('initial', [initialOf('camila'), initialOf('  Álvaro'), initialOf('🐾 pets'), initialOf('')], ['C', 'Á', '🐾', '?']);

// What the tab keeps between pages.
same('cache round trip', readCache(cacheText({ name: 'Camila', avatar: null })), { name: 'Camila', avatar: null });
same('cache of nobody', [cacheText(null), readCache(''), readCache(null), readCache('{'), readCache('[]'), readCache('{"name":""}')], ['', null, null, null, null, null]);

// The menu: entries, order and addresses in each language.
const expected = {
  en: { prefix: '', login: '/dash/login' },
  es: { prefix: '/es', login: '/es/dash/login' },
  'pt-BR': { prefix: '/pt-br', login: '/pt-br/dash/login' },
};
for (const [lang, { prefix, login }] of Object.entries(expected)) {
  same(`entries in ${lang}`, accountEntries(lang).map(({ key, href, external }) => [key, href, external]), [
    ['servers', `${prefix}/dash/manage`, false],
    ['premium', `${prefix}/dash/premium`, false],
    ['support', SUPPORT_URL, true],
    ['logout', `${prefix}/dash/logout`, false],
  ]);
  same(`login address in ${lang}`, loginHref(lang), login);
}
same('endpoint address', SESSION_ENDPOINT, '/api/session');

// Every address points at something that exists.
for (const file of ['src/pages/dash/manage/index.astro', 'src/pages/dash/premium.astro', 'src/pages/dash/logout.ts', 'src/pages/dash/login.ts', 'src/pages/dash/callback.ts', 'src/pages/api/session.ts']) check(`${file} exists`, existsSync(new URL(file, root)));
check('support address is the one of the site', SUPPORT_URL === 'https://petto.sbs/support' && /^\/support\s+https:\/\/discord\.gg\/\S+\s+301/m.test(read('public/_redirects')));

// The texts exist in the three languages, with the words of each one.
const ui = read('src/i18n/ui.ts');
const navBlocks = [...ui.matchAll(/^ {2}(en|es|'pt-BR'): \{\n {4}nav: \{\n([\s\S]*?)\n {6}menu: \{/gm)];
same('three nav blocks', navBlocks.map((m) => m[1].replace(/'/g, '').length > 0), [true, true, true]);
const words = {
  en: { login: 'Login', servers: 'Manage servers', premium: 'Manage premium', support: 'Support server', logout: 'Logout' },
  es: { login: 'Iniciar sesión', servers: 'Administrar servidores', premium: 'Administrar premium', support: 'Servidor de soporte', logout: 'Cerrar sesión' },
  'pt-BR': { login: 'Entrar', servers: 'Gerenciar servidores', premium: 'Gerenciar premium', support: 'Servidor de suporte', logout: 'Sair' },
};
for (const match of navBlocks) {
  const lang = match[1].replace(/'/g, '');
  const text = match[2];
  const login = /login: '([^']+)'/.exec(text)?.[1];
  const account = /account: \{([^}]*)\}/.exec(text)?.[1] ?? '';
  const got = Object.fromEntries([...account.matchAll(/(\w+): '([^']+)'/g)].map((m) => [m[1], m[2]]));
  check(`${lang}: login text`, login === words[lang].login, `got ${login}`);
  for (const key of ['servers', 'premium', 'support', 'logout']) check(`${lang}: ${key} text`, got[key] === words[lang][key], `got ${got[key]}`);
  check(`${lang}: account label`, Boolean(got.label));
  same(`${lang}: same keys as the entries`, Object.keys(got).sort(), ['label', 'logout', 'premium', 'servers', 'support']);
}

// The state is never drawn into the page (the CDN keeps it), and nothing here needs Node.
const component = read('src/components/NavAccount.astro');
const layout = read('src/layouts/Base.astro');
const endpoint = read('src/pages/api/session.ts');
check('the bar starts as Login', (component.match(/data-nav-account data-state="guest"/g) ?? []).length === 2 && !/data-nav-account data-state="user"/.test(component));
for (const [name, text] of [['Base.astro', layout], ['NavAccount.astro', component]]) {
  check(`${name} does not read the session`, !/getDashboardSession|decodeSession|petto_session/.test(text));
}
check('endpoint is never kept', /'Cache-Control': 'no-store'/.test(endpoint));
check('endpoint answers through sessionAnswer', /sessionAnswer\(session\)/.test(endpoint) && !/status:/.test(endpoint));
for (const [name, text] of [['api/session.ts', endpoint], ['NavAccount.astro', component], ['navAccount.mjs', read('src/utils/navAccount.mjs')], ['discordLogin.ts', read('src/utils/discordLogin.ts')]]) {
  check(`${name} uses nothing of Node`, !/node:|from 'pg'|require\(/.test(text));
}
check('the bar asks the endpoint once and gives up', /fetch\(SESSION_ENDPOINT/.test(component) && /AbortController/.test(component) && (component.match(/fetch\(/g) ?? []).length === 1);

// The full bar (links, language, theme, Login or profile, Add to Discord) fits from 881px up, so the burger menu starts at 880px and nowhere else.
check('the burger menu starts at 880px', /@media \(max-width: 880px\) \{\s*nav\.links \{ display: none; \}\s*\.nav-burger \{ display: flex; \}\s*\.nav-desktop-only \{ display: none; \}/.test(layout));
check('the page closes the burger menu above 880px', /window\.innerWidth > 880 && mobileNav/.test(layout));
check('the bar hides its login at 880px, where the burger menu has its own', /@media \(max-width: 880px\) \{ \.nav-account \{ display: none; \} \}/.test(component) && /window\.innerWidth <= 880/.test(component));
for (const [name, text] of [['Base.astro', layout], ['NavAccount.astro', component]]) {
  check(`${name} has no burger breakpoint above 880px`, !/@media \(max-width: (?:1060|1061|1120)px\)/.test(text) && !/innerWidth (?:<=|>) (?:1060|1061|1120)/.test(text));
}
check('Login is an icon that keeps its text for screen readers', /<svg viewBox="0 0 256 256"[^>]*aria-hidden="true"/.test(component) && /class="nav-login-label"/.test(component) && /title=\{t\.login\}/.test(component));

// The language picker: a local flag for each language (never hotlinked), the name in its own language, a check on the current one.
for (const flag of ['us', 'es', 'br']) check(`flag ${flag}.svg exists`, existsSync(new URL(`public/assets/flags/${flag}.svg`, root)) && /^<svg /.test(read(`public/assets/flags/${flag}.svg`)));
check('the language button shows the flag and keeps an accessible label', /id="langToggle" aria-label=\{langLabel\}/.test(layout) && /aria-haspopup="true" aria-expanded="false" aria-controls="langMenu"/.test(layout) && /class="flag flag-round" src=\{langNow\.flag\}/.test(layout));
check('the names are written in their own language', ['English', 'Español', 'Português (Brasil)'].every((name) => layout.includes(`label: '${name}'`)) && layout.includes("'/assets/flags/br.svg'"));
check('the menus mark the current language with a check', (layout.match(/o\.code === lang && <InlineIcon name="ph:check-bold"/g) ?? []).length === 2);
check('no flag is loaded from another site', !/https?:\/\/[^'"]*flag/i.test(layout));

// One login: the dashboard page and the Login of the bar build the same address.
check('Login and the dashboard card share the route', /dashAuthorizeUrl/.test(read('src/pages/dash/login.ts')) && LOGIN_HREF === loginHref('en') && /href=\{LOGIN_HREF\}/.test(read('src/components/DashLogin.astro')));
check('Login goes to the callback of the dashboard', /\/dash\/callback/.test(read('src/utils/discordLogin.ts')) && /identify guilds/.test(read('src/utils/discordLogin.ts')));

// The icons of the menu are drawn by InlineIcon.
const icons = read('src/components/InlineIcon.astro');
for (const { icon } of accountEntries('en')) check(`${icon} is in InlineIcon`, icons.includes(`'${icon}':`));

console.log(`Checked the login of the bar, ${failed} failed.`);
if (failed) process.exit(1);
