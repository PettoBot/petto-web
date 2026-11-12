// Checks the changelog that the team edits in the dashboard (Staff → Changelog): the rules of src/utils/changelogStore.mjs (what a version, a notice and a change may be, how a
// saved version becomes a public entry, how it joins the ones written in the code) and that the pieces are wired: the page of the dashboard, its entry in the menu, the table, and the
// public pages and the feed that read the published versions on each request.
// Run: node scripts/check-changelog-store.mjs
import { readFileSync, existsSync } from 'node:fs';
import { LIMITS, NOTICE_KINDS, VERSION, cleanLang, compareVersions, displayVersion, draftFromCode, formatDate, isoFromEnglish, mergeEntries, toEntry, validDate, validateDraft } from '../src/utils/changelogStore.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); }
};
const same = (name, got, expected) => check(name, JSON.stringify(got) === JSON.stringify(expected), `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);

// --- versions and dates ---
same('the kinds of notice', [...NOTICE_KINDS], ['security', 'warning', 'breaking', 'info']);
for (const good of ['0.7.12', '1.0.0', '0.7.9-3', '10.20.30']) check(`a version: ${good}`, VERSION.test(good));
for (const bad of ['0.7', 'v0.7.12', '0.7.12-', '0.7.12-a', '0.7.12 ', '', '0.7.12.1', '../x', '0.7.1234']) check(`not a version: "${bad}"`, !VERSION.test(bad));
same('a real date', validDate('2026-11-12'), '2026-11-12');
same('a date that does not exist', validDate('2026-02-30'), null);
same('not a date', [validDate('12/11/2026'), validDate(''), validDate(undefined), validDate('2026-13-01')], [null, null, null, null]);
same('the date in English', formatDate('2026-11-12', 'en'), 'November 12, 2026');
same('the date in Spanish', formatDate('2026-11-05', 'es'), '5 de noviembre de 2026');
same('the date in Portuguese', formatDate('2026-03-01', 'pt'), '1 de março de 2026');
same('a date written in the code', isoFromEnglish('November 5, 2026'), '2026-11-05');
same('a date that is not English text', isoFromEnglish('5 de noviembre de 2026'), null);
same('a patch is shown with ~', [displayVersion('0.7.9-3'), displayVersion('0.7.10')], ['0.7.9~3', '0.7.10']);
check('versions in order', compareVersions('0.7.9', '0.7.9-1') < 0 && compareVersions('0.7.9-3', '0.7.10') < 0 && compareVersions('0.7.11', '0.7.10') > 0 && compareVersions('0.7.10', '0.7.10') === 0);

// --- what the editor sent ---
const draft = (extra = {}) => ({ version: '0.7.12', name: 'Tiramisu', date: '2026-11-19', published: true, langs: { en: { notices: [{ kind: 'warning', title: 'Restart', text: 'About 5 minutes.' }], items: ['A change with `code`.'] }, es: { notices: [], items: [] }, pt: { notices: [], items: [] } }, ...extra });
let result = validateDraft(draft());
check('a good version', result.ok === true);
same('what is saved', result.row && [result.row.version, result.row.name, result.row.release_date, result.row.published], ['0.7.12', 'Tiramisu', '2026-11-19', true]);
same('the three languages are always there', Object.keys(result.row.content), ['en', 'es', 'pt']);
same('a version is a draft unless it says published', validateDraft(draft({ published: 'yes' })).row.published, false);
same('a bad version', validateDraft(draft({ version: '0.7' })).error, 'version');
same('a bad date', validateDraft(draft({ date: '2026-02-30' })).error, 'date');
same('nothing in English is refused', validateDraft(draft({ langs: { en: { notices: [], items: ['  ', ''] }, es: { notices: [], items: ['Algo'] } } })).error, 'empty');
same('only a notice is enough', validateDraft(draft({ langs: { en: { notices: [{ kind: 'security', title: 'T', text: '' }], items: [] } } })).ok, true);
same('not an object', [validateDraft(null).error, validateDraft('x').error, validateDraft(undefined).error], ['invalid', 'invalid', 'invalid']);
same('a kind that does not exist is information', cleanLang({ notices: [{ kind: 'danger', title: 'T', text: 'x' }] }).notices[0].kind, 'info');
same('an empty notice is dropped', cleanLang({ notices: [{ kind: 'info', title: '', text: '  ' }] }).notices, []);
same('empty changes are dropped and the rest trimmed', cleanLang({ items: ['  a  ', '', null, 'b'] }).items, ['a', 'b']);
same('control characters are removed', cleanLang({ items: ['a\u0000b\u0007c'] }).items, ['abc']);
check('a change is cut to its limit', cleanLang({ items: ['x'.repeat(LIMITS.item + 50)] }).items[0].length === LIMITS.item);
check('a notice title and text are cut', (() => { const n = cleanLang({ notices: [{ kind: 'info', title: 't'.repeat(500), text: 'x'.repeat(9000) }] }).notices[0]; return n.title.length === LIMITS.noticeTitle && n.text.length === LIMITS.noticeText; })());
check('there are at most 5 notices and 60 changes', (() => { const c = cleanLang({ notices: Array.from({ length: 9 }, () => ({ kind: 'info', title: 't', text: 'x' })), items: Array.from({ length: 99 }, (_, i) => `c${i}`) }); return c.notices.length === 5 && c.items.length === 60; })());
check('the name is cut', validateDraft(draft({ name: 'n'.repeat(100) })).row.name.length === LIMITS.name);

// --- a saved version as the public entry ---
const row = { version: '0.7.12', name: 'Tiramisu', release_date: '2026-11-19', published: true, content: { en: { notices: [{ kind: 'security', title: 'S', text: 'x' }], items: ['one'] }, es: { notices: [], items: ['uno'] }, pt: { notices: [], items: [] } } };
same('the entry in English', (({ version, display, name, date, items }) => ({ version, display, name, date, items }))(toEntry(row, 'en')), { version: '0.7.12', display: '0.7.12', name: 'Tiramisu', date: 'November 19, 2026', items: ['one'] });
same('in Spanish, with its own text (and no notice of its own)', [toEntry(row, 'es').items, toEntry(row, 'es').notices, toEntry(row, 'es').date], [['uno'], [], '19 de noviembre de 2026']);
same('a language with nothing shows the English text, notice included', [toEntry(row, 'pt').items, toEntry(row, 'pt').notices.length, toEntry(row, 'pt').date], [['one'], 1, '19 de novembro de 2026']);
same('a patch', toEntry({ ...row, version: '0.7.9-3' }, 'en').display, '0.7.9~3');

// --- joined with what is in the code ---
const inCode = [{ version: '0.7.10', name: 'Cupcake', items: ['code'] }, { version: '0.7.11', name: 'Brownie', items: ['code'] }];
same('the table adds versions and sorts them', mergeEntries(inCode, [toEntry(row, 'en')]).map((e) => e.version), ['0.7.12', '0.7.11', '0.7.10']);
same('a version of the table replaces the one in the code', mergeEntries(inCode, [{ version: '0.7.11', name: 'Edited', items: ['db'] }]).map((e) => `${e.version}:${e.name}`), ['0.7.11:Edited', '0.7.10:Cupcake']);
same('nothing in the table is the code', mergeEntries(inCode, []).map((e) => e.version), ['0.7.11', '0.7.10']);
same('a version of the code as a draft', (({ version, name, date, published, langs }) => ({ version, name, date, published, en: langs.en.items }))(draftFromCode('2026-11-05', 'Cupcake', '0.7.10', { en: { items: ['a'] }, es: { items: ['b'] }, pt: {} })), { version: '0.7.10', name: 'Cupcake', date: '2026-11-05', published: true, en: ['a'] });

// --- the pieces are in place ---
const exists = (path) => existsSync(new URL(path, root));
const page = exists('src/pages/dash/changelog-admin.astro') ? read('src/pages/dash/changelog-admin.astro') : '';
check('the page of the dashboard', /export const prerender = false/.test(page) && /canEditChangelog/.test(page) && /validateDraft/.test(page) && /saveRow/.test(page) && /deleteRow/.test(page));
check('the page checks where the form came from', /headers\.get\('origin'\)/.test(page));
check('the page keeps what was typed when a save fails', /override/.test(page));
check('the entry in the menu is for the team', /id: 'staff-changelog', href: '\/dash\/changelog-admin'/.test(read('src/components/DashMeLayout.astro')) && /access\.team && \{ id: 'staff-changelog'/.test(read('src/components/DashMeLayout.astro')));
const db = read('src/utils/changelogDb.ts');
check('the table is site_changelog', /site_changelog\?select/.test(db) && /site_changelog\?on_conflict=version/.test(db) && /site_changelog\?version=eq\./.test(db));
check('only published versions are read for the public', /published=eq\.true/.test(db));
check('a database that cannot be read never breaks the public pages', /return null/.test(db) && /cache\.rows/.test(db));
for (const lang of ['', 'es/', 'pt-br/']) {
  const index = read(`src/pages/${lang}changelog.astro`);
  const one = read(`src/pages/${lang}changelog/[version].astro`);
  check(`${lang || 'en/'}changelog is rendered on request`, /prerender = false/.test(index) && /prerender = false/.test(one) && !/getStaticPaths/.test(one));
  check(`${lang || 'en/'}a version that does not exist answers 404`, !/getStaticPaths/.test(one) && /Astro\.response\.status = 404/.test(one));
  const feed = read(`src/pages/${lang}changelog/rss.xml.ts`);
  check(`${lang || 'en/'}the feed gets the request, so it can read the table`, /\(context\) => changelogRssResponse\(/.test(feed));
}
check('the page of 404 is the one of before (it does not read the address)', !/searchParams/.test(read('src/pages/404.astro')));
const component = read('src/components/DashChangelogAdmin.astro');
check('the editor sends its state as one JSON field', /data-ce-json/.test(component) && /name="draft"/.test(component));
check('the editor offers to remove a saved version', /name="action" value="delete"/.test(component));
check('the editor shows notices as the public page does (the same classes and kinds)', /cl-notice-security/.test(component) && /cl-notice-head/.test(component));
check('the editor only builds links of http and https', /\(https\?:\\\/\\\/\[\^\)\\s\]\+\)/.test(component));

if (failed) { console.log(`${failed} check(s) failed`); process.exit(1); }
console.log('Changelog store checks passed (the rules, the entries, the merge with the code, the page, the menu and the public pages).');
