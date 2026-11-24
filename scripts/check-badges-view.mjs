// The page of badges of the account (/dash/badges): what the tiles, the showcase and the actions look like (src/utils/badgesView.ts), that the flags it points to are in
// public/assets/country-flags, that the pictures of the other badges are in public/assets/badges, and that the page and its translations exist. The bot gives the catalog
// at run time; here a small sample of it stands in.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(path.join(root, 'src/utils/badgesView.ts'), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const view = { exports: {} };
new Function('module', 'exports', 'require', js)(view, view.exports, createRequire(import.meta.url));
const { artUrl, hexHtml, tilesFor, tileHtml, slotsHtml, actionsFor, codeOf } = view.exports;

const badge = (id, category, extra = {}) => ({ id, category, unlock: 'shop', rarity: 'common', price: 250, color: '#e8794a', region: null, language: null, pack: null, custom: false, names: null, saleFrom: null, saleUntil: null, planMin: null, grantRule: null, onSale: false, retired: false, hasArt: false, version: null, ...extra });
const catalog = {
  badges: [
    badge('country-co', 'country', { region: 'CO' }), badge('country-mx', 'country', { region: 'MX' }), badge('lang-es', 'language', { language: 'es' }),
    badge('femboy', 'fablo', { unlock: 'self', rarity: null, price: 0, pack: 'fablo' }), badge('plan-gold', 'plan', { unlock: 'plan', rarity: null, price: 0 }),
    badge('xmas', 'special', { custom: true, price: 30, hasArt: true, version: 'v1', onSale: true, saleUntil: '2027-01-01T00:00:00Z', rarity: 'epic' }), badge('old-one', 'special', { custom: true, price: 30, onSale: false, saleUntil: '2026-01-01T00:00:00Z' }),
    badge('voter', 'status', { custom: true, unlock: 'status', price: 0, grantRule: 'voter' }), badge('gold-only', 'special', { custom: true, price: 40, onSale: true, planMin: 'gold' }), badge('gone', 'special', { custom: true, retired: true }),
  ],
  frames: [{ id: 'normal', cost: 0 }, { id: 'bright', cost: 150 }, { id: 'divine', cost: 400 }], rarityPrice: {}, daily: {}, slots: {},
};
const names = { 'country-co': 'Colombia', 'country-mx': 'México', 'lang-es': 'español', femboy: 'Femboy', 'plan-gold': 'Plan Oro', xmas: 'Navidad', 'old-one': 'Vieja', voter: 'Voter', 'gold-only': 'Solo oro', gone: 'Retirada' };
const words = { name: (b) => names[b.id], rarity: { common: 'Común', rare: 'Rara', epic: 'Épica', legendary: 'Legendaria' }, owned: 'Tuya', free: 'Gratis', until: (iso) => `Hasta ${iso.slice(0, 10)}`, auto: 'Automática' };
const state = { balance: 300, plan: null, daily: { canClaim: true, nextAt: new Date().toISOString(), amount: 2 }, slots: 2, owned: [{ id: 'country-co', frame: 'divine' }, { id: 'femboy', frame: 'normal' }], showcase: ['country-co'] };

// Pictures: a country has its flag, a language has the flag of the country that stands for it (or its code when the bot gives none), the others have a file of the site.
assert.equal(artUrl(catalog.badges[0]), '/assets/country-flags/co.svg');
assert.equal(artUrl(catalog.badges[2]), null);
assert.equal(codeOf(catalog.badges[2]), 'ES');
// A language has no flag of its own: when the bot says which country stands for it, that flag is drawn (and a flag that is not two letters never makes a path).
assert.equal(artUrl({ ...catalog.badges[2], flag: 'ES' }), '/assets/country-flags/es.svg');
assert.equal(artUrl({ ...catalog.badges[2], flag: '../x' }), null);
assert.equal(artUrl(catalog.badges[3]), '/assets/badges/femboy.png');
assert.equal(artUrl({ ...catalog.badges[0], region: '../x' }), null, 'a region that is not two letters never makes a path');
assert.match(hexHtml(catalog.badges[0], 'divine', 'lg'), /bd-f-divine/);
assert.match(hexHtml({ ...catalog.badges[0], category: 'plan', unlock: 'plan' }, 'normal'), /bd-bare/, 'the star of a plan has no colored hexagon');
assert.doesNotMatch(hexHtml({ ...catalog.badges[0], category: 'country', unlock: 'self' }, 'normal'), /bd-bare/, 'the other badges keep their hexagon');
assert.doesNotMatch(hexHtml({ ...catalog.badges[2], color: '"><script>' }, 'normal'), /<script>/, 'a colour cannot close the attribute');

// Tabs: the stars of the plans are in the Status tab; search by name; the owned filter.
assert.deepEqual(tilesFor(catalog, state, words, { tab: 'country', query: '', owned: false }).map((t) => t.name), ['Colombia', 'México']);
assert.deepEqual(tilesFor(catalog, state, words, { tab: 'status', query: '', owned: false }).map((t) => t.name), ['Plan Oro', 'Voter']);
assert.deepEqual(tilesFor(catalog, state, words, { tab: 'country', query: 'méx', owned: false }).map((t) => t.name), ['México']);
assert.deepEqual(tilesFor(catalog, state, words, { tab: 'country', query: '', owned: true }).map((t) => t.name), ['Colombia']);
const tiles = tilesFor(catalog, state, words, { tab: 'country', query: '', owned: false });
assert.match(tileHtml(tiles[0], words), /is-owned is-shown[\s\S]*Tuya/);
assert.match(tileHtml(tiles[1], words), /250[\s\S]*Común/);
assert.doesNotMatch(tileHtml({ ...tiles[1], name: '<img onerror=x>' }, words), /<img onerror/, 'a name is escaped');

// The badges of the editor: the picture comes from the site, a sale that is not open is seen only by who has the badge, the end of the sale is shown, a rule shows Automatic.
assert.equal(artUrl(catalog.badges[5]), '/dash/badge-art/xmas?v=v1');
assert.equal(artUrl(catalog.badges[6]), null, 'with no picture saved there is none to point to');
assert.deepEqual(tilesFor(catalog, state, words, { tab: 'special', query: '', owned: false }).map((t) => t.name), ['Navidad', 'Solo oro'], 'a closed sale, and a badge taken off sale, are not seen by those who do not have them');
const ownedOld = { ...state, owned: [...state.owned, { id: 'old-one', frame: 'normal' }, { id: 'gone', frame: 'bright' }] };
assert.deepEqual(tilesFor(catalog, ownedOld, words, { tab: 'special', query: '', owned: false }).map((t) => t.name), ['Navidad', 'Retirada', 'Solo oro', 'Vieja'], 'whoever has them still sees them');
const specialTiles = tilesFor(catalog, state, words, { tab: 'special', query: '', owned: false });
assert.match(tileHtml(specialTiles[0], words), /Hasta 2027-01-01/);
assert.match(tileHtml(tilesFor(catalog, state, words, { tab: 'status', query: '', owned: false })[1], words), /Automática/);
let act2 = actionsFor(catalog.badges[5], false, state, catalog);
assert.deepEqual([act2.primary.kind, act2.primary.price], ['buy', 30]);
assert.equal(actionsFor(catalog.badges[6], false, state, catalog).primary.kind, 'closed');
assert.deepEqual(actionsFor(catalog.badges[8], false, state, catalog).primary, { kind: 'plan', plan: 'gold' });
assert.equal(actionsFor(catalog.badges[8], false, { ...state, plan: 'gold' }, catalog).primary.kind, 'buy');
assert.equal(actionsFor(catalog.badges[7], false, state, catalog).primary.kind, 'auto');
// The frame that shows can be one below the best the badge has: the choice is among the frames it has, and the next purchase builds on the best one.
const framed = (shown, unlocked) => ({ ...state, owned: [{ id: 'country-co', frame: shown, unlocked }] });
assert.deepEqual(actionsFor(catalog.badges[0], true, framed('divine', 'divine'), catalog).frames, ['normal', 'bright', 'divine'], 'every frame it has can be chosen');
assert.deepEqual(actionsFor(catalog.badges[0], true, framed('normal', 'bright'), catalog).frames, ['normal', 'bright'], 'not the ones it does not have');
assert.deepEqual(actionsFor(catalog.badges[0], true, framed('normal', 'normal'), catalog).frames, [], 'with one frame there is nothing to choose');
assert.deepEqual(actionsFor(catalog.badges[0], false, framed('normal', 'divine'), catalog).frames, [], 'a badge that is not owned has no choice');
assert.deepEqual(actionsFor(catalog.badges[4], true, { ...state, owned: [{ id: 'plan-gold', frame: 'normal', unlocked: 'divine' }] }, catalog).frames, [], 'the star of a plan has no frames');
assert.equal(actionsFor(catalog.badges[0], true, framed('normal', 'bright'), catalog).upgrade?.next, 'divine', 'buying builds on the best frame, not on the one that shows');
assert.equal(actionsFor(catalog.badges[0], true, { ...state, owned: [{ id: 'country-co', frame: 'bright' }] }, catalog).upgrade?.next, 'divine', 'an answer of the bot without `unlocked` still works');
const page = readFileSync(path.join(root, 'src/pages/dash/badges-act.ts'), 'utf8');
assert.match(page, /'frame'/, 'the page of actions passes the choice of frame to the bot');


// The showcase: a place for each slot of the plan and locks for the rest of the six.
const html = slotsHtml(catalog, state, (id) => catalog.badges.find((b) => b.id === id), (id) => state.owned.find((r) => r.id === id)?.frame ?? 'normal');
assert.equal((html.match(/data-slot=/g) ?? []).length, 6);
assert.equal((html.match(/is-full/g) ?? []).length, 1); assert.equal((html.match(/is-empty/g) ?? []).length, 1); assert.equal((html.match(/is-locked/g) ?? []).length, 4);

// The actions: buy what is for sale when there are enough ceramos, turn a free badge on or off, show or hide an owned one, upgrade the frame one step at a time.
let acts = actionsFor(catalog.badges[1], false, state, catalog);
assert.deepEqual([acts.primary.kind, acts.primary.price, acts.primary.canAfford, acts.show, acts.upgrade], ['buy', 250, true, null, null]);
acts = actionsFor(catalog.badges[1], false, { ...state, balance: 10 }, catalog);
assert.equal(acts.primary.canAfford, false);
acts = actionsFor(catalog.badges[0], true, state, catalog);
assert.deepEqual([acts.primary.kind, acts.show, acts.upgrade], ['none', 'remove', null], 'the best frame has no next step');
acts = actionsFor(catalog.badges[3], true, state, catalog);
assert.deepEqual([acts.primary.kind, acts.primary.on, acts.show, acts.upgrade.next, acts.upgrade.cost], ['identity', true, 'add', 'bright', 150]);
acts = actionsFor(catalog.badges[3], true, { ...state, showcase: ['country-co', 'lang-es'] }, catalog);
assert.equal(acts.show, 'full');
acts = actionsFor(catalog.badges[4], true, state, catalog);
assert.equal(acts.upgrade, null, 'the badge of a plan has no frames');

// The files the page points to: every flag of the open package and the pictures of the other badges.
const flags = readdirSync(path.join(root, 'public/assets/country-flags')).filter((f) => /^[a-z]{2}\.svg$/.test(f));
assert.ok(flags.length >= 250, `${flags.length} flags in public/assets/country-flags`);
for (const file of ['plan-bronze', 'plan-silver', 'plan-gold', 'furro', 'boykisser', 'hetero', 'femboy']) assert.ok(existsSync(path.join(root, 'public/assets/badges', `${file}.png`)), `${file}.png`);
for (const file of ['src/pages/dash/badges.astro', 'src/pages/dash/badges-act.ts', 'src/components/DashBadges.astro', 'src/pages/dash/badges-admin.astro', 'src/pages/dash/badges-admin-act.ts', 'src/components/DashBadgesAdmin.astro', 'src/pages/dash/badge-art/[id].ts']) assert.ok(existsSync(path.join(root, file)), file);
const layout = readFileSync(path.join(root, 'src/components/DashMeLayout.astro'), 'utf8');
assert.match(layout, /id: 'badges', href: '\/dash\/badges'/, 'the page is in the menu of the account');
const act = readFileSync(path.join(root, 'src/pages/dash/badges-act.ts'), 'utf8');
assert.match(act, /origin !== astro\.url\.origin/, 'a request from another site is refused');
assert.match(act, /session\.userId/, 'the person is the one of the login');
assert.doesNotMatch(act, /body\.(user_id|userId)/, 'the page never names the person');
// The editor of badges is for the owner only: the page and the endpoint answer a plain 404 to anybody else, and the endpoint takes no id of a person from the page.
const adminPage = readFileSync(path.join(root, 'src/pages/dash/badges-admin.astro'), 'utf8');
assert.match(adminPage, /isPettoOwner\(Astro, session\.userId\)[\s\S]*404/, 'the page of the editor is for the owner');
const adminAct = readFileSync(path.join(root, 'src/pages/dash/badges-admin-act.ts'), 'utf8');
assert.match(adminAct, /!isPettoOwner\(astro, session\.userId\)/, 'the endpoint of the editor is for the owner');
assert.match(adminAct, /origin !== astro\.url\.origin/); assert.doesNotMatch(adminAct, /body\.(user_id|userId)/);
assert.match(adminAct, /MAX_BYTES/, 'the picture is cut at 256 KB before it is sent');
assert.match(layout, /id: 'staff-badges', href: '\/dash\/badges-admin'/, 'the editor is in the Staff menu');
// The shop round two: the pages of name fonts and banners, and the editor of packs, banners, fonts and the badges of the code. The editor is for the owner only, like the badge editor.
for (const file of ['src/pages/dash/name.astro', 'src/pages/dash/banners.astro', 'src/pages/dash/shop-act.ts', 'src/components/DashShopItems.astro', 'src/pages/dash/shop-admin.astro', 'src/pages/dash/shop-admin-act.ts', 'src/components/DashShopAdmin.astro', 'src/components/DashShopTabs.astro', 'src/pages/dash/item-file/[kind]/[id].ts']) assert.ok(existsSync(path.join(root, file)), file);
assert.match(layout, /id: 'name', href: '\/dash\/name'/, 'the name fonts are in the menu of the account');
assert.match(layout, /id: 'banners', href: '\/dash\/banners'/, 'the banners are in the menu of the account');
const shopAct = readFileSync(path.join(root, 'src/pages/dash/shop-act.ts'), 'utf8');
assert.match(shopAct, /origin !== astro\.url\.origin/, 'a request from another site is refused'); assert.match(shopAct, /session\.userId/); assert.doesNotMatch(shopAct, /body\.(user_id|userId)/, 'the page never names the person');
assert.match(shopAct, /new Set\(\['buy-item', 'buy-pack', 'wear'\]\)/, 'a person can only buy and wear');
const shopAdminPage = readFileSync(path.join(root, 'src/pages/dash/shop-admin.astro'), 'utf8');
assert.match(shopAdminPage, /isPettoOwner\(Astro, session\.userId\)[\s\S]*404/, 'the page of the shop editor is for the owner');
const shopAdminAct = readFileSync(path.join(root, 'src/pages/dash/shop-admin-act.ts'), 'utf8');
assert.match(shopAdminAct, /!isPettoOwner\(astro, session\.userId\)/, 'the endpoint of the shop editor is for the owner');
assert.match(shopAdminAct, /origin !== astro\.url\.origin/); assert.doesNotMatch(shopAdminAct, /body\.(user_id|userId)/);
assert.match(shopAdminAct, /MAX_BYTES = 768 \* 1024/, 'a file is cut at 768 KB before it is sent');
const itemFile = readFileSync(path.join(root, 'src/pages/dash/item-file/[kind]/[id].ts'), 'utf8');
assert.match(itemFile, /getDashboardSession/, 'only a logged-in person gets a file of the shop');
// Every text of the new pages has its Spanish and Portuguese.
const esText = readFileSync(path.join(root, 'src/i18n/dash-es.ts'), 'utf8'), ptText = readFileSync(path.join(root, 'src/i18n/dash-pt.ts'), 'utf8');
for (const file of ['src/components/DashShopItems.astro', 'src/components/DashShopAdmin.astro', 'src/components/DashShopTabs.astro']) {
  const text = readFileSync(path.join(root, file), 'utf8');
  for (const match of text.matchAll(/dt\(\s*'((?:[^'\\]|\\.)*)'/g)) {
    const english = match[1].replace(/\\'/g, "'");
    const key = JSON.stringify(english);
    assert.ok(esText.includes(`${key}:`), `Spanish for: ${english}`);
    assert.ok(ptText.includes(`${key}:`), `Portuguese for: ${english}`);
  }
}
console.log('Checked the page of badges and the editor: tiles, tabs, sales, showcase, actions, flags, pictures and who may edit; and the pages of name fonts, banners and the shop editor.');
