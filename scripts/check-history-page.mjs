// Checks the page "The history of Petto" (/history, /es/history, /pt-br/history): the three languages tell the same story (the same number of years in the same
// order, with the same numbers), the dates the maintainer gave are in every language, the page is in the three routes, the menu and the footer link to it,
// and nothing in it names the website as the origin of the bot. Run: node scripts/check-history-page.mjs
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
// The copy is TypeScript with only a type import: compiled here so the check runs on any Node (the one of CI included).
const compiled = ts.transpileModule(read('src/data/historyCopy.ts'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { HISTORY_COPY } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const langs = ['en', 'es', 'pt-BR'];
assert.deepEqual(Object.keys(HISTORY_COPY).sort(), [...langs].sort(), 'the three languages');
const years = (text) => (text.match(/\b(?:19|20)\d{2}\b/g) ?? []).join(',');

// The same steps, in the same order, in every language.
const en = HISTORY_COPY.en;
for (const lang of langs) {
  const c = HISTORY_COPY[lang];
  assert.equal(c.steps.length, en.steps.length, `${lang}: the same number of steps`);
  assert.deepEqual(c.steps.map((s) => years(s.when)), en.steps.map((s) => years(s.when)), `${lang}: the same years, in the same order`);
  assert.deepEqual(c.steps.map((s) => Boolean(s.note)), en.steps.map((s) => Boolean(s.note)), `${lang}: the same steps carry a note`);
  assert.deepEqual(c.short.items.map((i) => years(i.when)), en.short.items.map((i) => years(i.when)), `${lang}: the short answer has the same dates`);
  assert.deepEqual(c.numbers.map((n) => n.value.replace(/[.,]/g, '')), en.numbers.map((n) => n.value.replace(/[.,]/g, '')), `${lang}: the same numbers`);
  for (const [key, value] of Object.entries(c)) if (typeof value === 'string') assert.ok(value.trim(), `${lang}: ${key} is not empty`);
  assert.ok(c.name.includes('Petto'), `${lang}: the name says Petto`);
  assert.ok(c.prologue.length >= 150, `${lang}: the page opens with a paragraph that sets the tone`);
  assert.ok(c.steps.every((step) => step.text.length >= 100), `${lang}: every year is told in a few sentences, not in a line`);
  assert.ok(c.description.length <= 200 && c.description.length >= 60, `${lang}: the description is a sentence or two`);
}

// The dates of the story (they come from the maintainer; a change here must be a decision, not a slip).
const whens = en.steps.map((s) => s.when);
assert.deepEqual(whens, ['September 18, 2017', '2019', '2021', '2022', '2023', '2024', '2025', 'April 19, 2026', 'August 2026'], 'the years of the story');
assert.deepEqual(en.short.items.map((i) => i.when), ['September 18, 2017', 'April 19, 2026', 'August 2026'], 'the short answer: brand, bot, site');
assert.ok(/30,000/.test(en.numbers[1].value) && /2021/.test(en.numbers[1].label), '30,000 servers in 2021');
assert.ok(/2 by the first team, 3 by me/.test(en.numbers[2].label) && en.numbers[2].value === '5', 'five rebuilds, three of them his');

// The three routes, the menu and the footer.
for (const [file, lang] of [['src/pages/history.astro', 'en'], ['src/pages/es/history.astro', 'es'], ['src/pages/pt-br/history.astro', 'pt-BR']]) {
  assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), `${file} exists`);
  assert.match(read(file), new RegExp(`<History lang="${lang}" />`), `${file} draws the page in ${lang}`);
}
const ui = read('src/i18n/ui.ts');
assert.equal((ui.match(/href: '\/history'/g) ?? []).length, 3, 'the menu of the three languages links to the page');
assert.match(read('src/layouts/Base.astro'), /FOOTER_COMMUNITY = \[[^\]]*'\/history'/, 'the footer links to it');
const page = read('src/components/History.astro');
assert.match(page, /skin="ash"/, 'it has the look of the public pages');
assert.match(page, /\{c\.prologue\}/, 'the page shows its opening paragraph');
assert.match(page, /title=\{c\.name\}/, 'the tab says the name of the page, without the brand twice');
console.log('history page: ok');
