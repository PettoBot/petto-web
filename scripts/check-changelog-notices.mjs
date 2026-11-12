// Checks the notices of the changelog (the red security notice, warnings and information that stand out above the list of a version): each version of the three languages
// that has one has a known kind, a title and a text; the page draws them (with the icon and the color of their kind) and the RSS feed says them first.
// Run: node scripts/check-changelog-notices.mjs
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); }
};

const ui = read('src/i18n/ui.ts');
const KINDS = ['security', 'warning', 'breaking', 'info'];
const notices = [...ui.matchAll(/\{ kind: '([a-z]+)', title: "((?:[^"\\]|\\.)*)", text: "((?:[^"\\]|\\.)*)" \}/g)];
check('every language has the notice of 0.7.11', notices.length >= 3, `found ${notices.length}`);
for (const [, kind, title, text] of notices) {
  check(`the kind "${kind}" is known`, KINDS.includes(kind));
  check('a notice has a title', title.trim().length > 5);
  check('a notice has a text', text.trim().length > 40);
}
const versions = [...ui.matchAll(/version: '0\.7\.11',[\s\S]{0,400}?notices: \[/g)];
check('the notice is in the entry of 0.7.11 in the three languages', versions.length === 3, `found ${versions.length}`);
check('the 0.7.11 notice of every language is a security notice', [...ui.matchAll(/version: '0\.7\.11',[\s\S]{0,400}?notices: \[\s*\{ kind: '([a-z]+)'/g)].every((match) => match[1] === 'security'));
check('no notice says the bot is open source', !notices.some(([, , title, text]) => /(?<!no longer |not any more |ya no es de |não é mais de )open source|código abierto|código aberto/i.test(`${title} ${text}`) && !/no longer|ya no|não é mais|not open|may be open|puede volver|pode voltar/i.test(`${title} ${text}`)));

const page = read('src/components/Changelog.astro');
check('the page draws the notices', /entry\.notices/.test(page) && /class=\{`cl-notice cl-notice-\$\{notice\.kind\}`\}/.test(page));
check('the notice has an icon for its kind', /ph:shield-warning-fill/.test(page));
for (const kind of KINDS) check(`the color of "${kind}"`, new RegExp(`\\.cl-notice-${kind}\\b`).test(page));
check('the security notice is red', /\.cl-notice-security \{ --notice: var\(--red/.test(page));

const feed = read('src/utils/changelogFeed.ts');
check('the feed says the notices first', /entry\.notices/.test(feed) && /\.\.\.notices/.test(feed));

if (failed) { console.log(`${failed} check(s) failed`); process.exit(1); }
console.log('Changelog notice checks passed (the notice of 0.7.11 in three languages, the page and the feed).');
