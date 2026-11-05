// Checks the "Login required" card of /dash (src/components/DashLogin.astro, src/pages/dash/index.astro, src/utils/dashLogin.mjs):
// the notices it can show in the three languages, where its buttons go, and that no text is written straight into the markup.
// Run: node scripts/check-dash-login.mjs
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DISCORD_ERRORS, LOGIN_ERRORS, LOGIN_HREF, homeHref, isDiscordNotice, loginNotice, managePath } from '../src/utils/dashLogin.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); }
};
const same = (name, got, expected) => check(name, JSON.stringify(got) === JSON.stringify(expected), `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);

// The button and the links.
same('login address', LOGIN_HREF, '/dash/login');
check('the login route exists', existsSync(new URL('src/pages/dash/login.ts', root)));
same('home address per language', [homeHref('en'), homeHref('es'), homeHref('pt-BR'), homeHref('fr')], ['/', '/es/', '/pt-br/', '/']);
same('logged in goes to the servers', [managePath(null), managePath('no_access'), managePath('login_failed')], ['/dash/manage', '/dash/manage', '/dash/manage']);
same('logged in keeps the Discord notice', managePath('discord_unavailable'), '/dash/manage?error=discord_unavailable');

// Which notice the card shows for the error of the address.
same('no error, no notice', [loginNotice(null), loginNotice(undefined), loginNotice('')], [null, null, null]);
for (const code of LOGIN_ERRORS) same(`known code ${code}`, loginNotice(code), code);
for (const odd of ['nope', 'constructor', '__proto__', 'toString', '<script>alert(1)</script>', 'LOGIN_FAILED', ' login_failed']) same(`unknown code ${JSON.stringify(odd)}`, loginNotice(odd), 'unknown');
same('a list is not a code', loginNotice(['login_failed']), null);
same('discord codes', LOGIN_ERRORS.filter(isDiscordNotice), DISCORD_ERRORS);
check('discord codes are known codes', DISCORD_ERRORS.every((code) => LOGIN_ERRORS.includes(code)));

// Every error the site sends to /dash has a message.
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});
const sent = new Set();
for (const file of walk(new URL('src/', root).pathname).filter((f) => /\.(astro|ts|mjs)$/.test(f) && !f.includes('/i18n/'))) {
  for (const match of readFileSync(file, 'utf8').matchAll(/['"`]\/dash\?error=(\w+)/g)) sent.add(match[1]);
}
check('some errors are sent to /dash', sent.size >= 5, `found ${[...sent]}`);
for (const code of sent) check(`${code} (sent to /dash) has a message`, LOGIN_ERRORS.includes(code));

// The component: its messages, in the three languages.
const component = read('src/components/DashLogin.astro');
const catalog = (name) => {
  const map = new Map();
  for (const m of read(`src/i18n/${name}`).matchAll(/^\s*("(?:[^"\\]|\\.)*"):\s*("(?:[^"\\]|\\.)*"),?\s*$/gm)) map.set(JSON.parse(m[1]), JSON.parse(m[2]));
  return map;
};
const es = catalog('dash-es.ts');
const pt = catalog('dash-pt.ts');
const block = /const errorMessages[^{]*\{([\s\S]*?)\n\};/.exec(component)?.[1] ?? '';
const messages = [...block.matchAll(/^\s*(\w+): dt\('((?:[^'\\]|\\.)*)'\),?$/gm)].map((m) => [m[1], m[2].replace(/\\'/g, "'")]);
same('the card has a message for every code and for the rest', messages.map(([code]) => code), [...LOGIN_ERRORS, 'unknown']);
for (const [code, english] of messages) {
  const inEs = es.get(english);
  const inPt = pt.get(english);
  check(`${code}: Spanish`, Boolean(inEs) && inEs !== english, english);
  check(`${code}: Portuguese`, Boolean(inPt) && inPt !== english, english);
  check(`${code}: short enough for a card`, english.length <= 110, english);
}
// Every text of the card, and the copy that was agreed for each language.
const used = [...component.matchAll(/\bdt\('((?:[^'\\]|\\.)*)'\)/g)].map((m) => m[1].replace(/\\'/g, "'"));
for (const key of used) {
  check(`Spanish text for "${key}"`, es.has(key));
  check(`Portuguese text for "${key}"`, pt.has(key));
}
const copy = {
  'Login required': ['Inicia sesión', 'Login necessário'],
  'Log in with Discord to manage your servers.': ['Inicia sesión con Discord para administrar tus servidores.', 'Entre com o Discord para gerenciar seus servidores.'],
  'Log in with Discord': ['Iniciar sesión con Discord', 'Entrar com o Discord'],
  'Back to home': ['Volver al inicio', 'Voltar ao início'],
};
for (const [key, [inEs, inPt]] of Object.entries(copy)) {
  check(`"${key}" is on the card`, used.includes(key));
  same(`"${key}" in Spanish`, es.get(key), inEs);
  same(`"${key}" in Portuguese`, pt.get(key), inPt);
}

// No text written straight into the markup (every word goes through dt()), no attribute with English words.
const markup = component.replace(/^---[\s\S]*?\n---/, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
let text = '';
let depth = 0;
for (const ch of markup) {
  if (ch === '{') depth += 1;
  else if (ch === '}') depth = Math.max(0, depth - 1);
  else text += depth ? (ch === '\n' ? '\n' : ' ') : ch;
}
const words = [...text.matchAll(/>([^<>]+)</g)].map((m) => m[1].trim()).filter((t) => /[A-Za-z]{2,}/.test(t));
same('no text outside dt() in the markup', words, []);
const attributes = [...markup.matchAll(/\s(?:alt|title|aria-label|placeholder)="([^"{]*)"/g)].map((m) => m[1]).filter((t) => /[A-Za-z]{2,}/.test(t));
same('no English attribute text', attributes, []);

// The card is only the card: the button goes to the login route, the page is kept out of search results, nothing of the old page is left.
check('the button uses the login route', /href=\{LOGIN_HREF\}/.test(component) && !/authorizeUrl|discord\.com\/api/.test(component));
check('the page is noindex', /<Base[^>]*\snoindex[\s>]/.test(component));
check('the page keeps the top bar and the footer', /<Base[^>]*\sactive="dash"/.test(component) && /<Base[^>]*\sshowFooter/.test(component));
check('nothing of the old page is left', !/SpecularButton|dash-mock|highlight|step-card|dash-hero/.test(component));
check('the focus does not scroll the page', /focus\(\{ preventScroll: true \}\)/.test(component));
check('the Petto picture exists', /\/assets\/mascot-icon\.webp/.test(component) && existsSync(new URL('public/assets/mascot-icon.webp', root)));
check('the old component is gone', !existsSync(new URL('src/components/Dash.astro', root)));

// The page: a visitor with a session goes on to the servers, anyone else gets the card.
const page = read('src/pages/dash/index.astro');
check('the page draws the card', /<DashLogin error=\{errorParam\} info=\{/.test(page));
check('a session goes to the servers', /if \(session\) \{\s*return Astro\.redirect\(managePath\(errorParam\)\);\s*\}/.test(page));
check('the page does not build a Discord address', !/dashAuthorizeUrl/.test(page));

console.log(`Checked the login card, ${failed} failed.`);
if (failed) process.exit(1);
