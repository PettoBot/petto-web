// The footer has three groups: Product (what works today, alphabetical, with Partners; never the products that are not public yet), Support and Team.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = readFileSync('src/layouts/Base.astro', 'utf8');
const ui = readFileSync('src/i18n/ui.ts', 'utf8');

assert.match(base, /NOT_PUBLIC_YET = \[[^\]]*'\/nelu'[^\]]*'\/am'[^\]]*'\/bmo'/, 'Nelu, AM and BMO stay out of the footer until they are public');
assert.match(base, /FOOTER_PRODUCT: FooterLink\[\] = \[[\s\S]*?extraLink\(t\.footer\.partners, '\/partners'\)[\s\S]*?\.sort\(\(a, b\) => a\.title\.localeCompare\(b\.title, lang\)\)/, 'Product has Partners and is sorted by title');
assert.match(base, /FOOTER_SUPPORT: FooterLink\[\] = \[[^\]]*'\/status'[^\]]*'\/stats'/, 'Support has the status and the stats');
assert.match(base, /FOOTER_TEAM: FooterLink\[\] = \[[^\]]*'\/team'/, 'Team has the team');
assert.match(base, /t\.footer\.supportTitle/, 'Support has its own heading');
assert.match(base, /t\.footer\.team\b/, 'Team has its own heading');
for (const word of ["supportTitle: 'Support'", "team: 'Team'", "supportTitle: 'Soporte'", "team: 'Equipo'", "supportTitle: 'Suporte'", "team: 'Equipe'"]) assert.ok(ui.includes(word), `${word} is in the texts`);
console.log('footer: ok');
