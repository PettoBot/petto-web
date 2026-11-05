// Checks the Discord cosmetics of the user card in the dashboard menu (src/utils/discordCosmetics.mjs, DashUserCard.astro).
// Run: node scripts/check-dash-cosmetics.mjs
import { readFileSync } from 'node:fs';
import { NAMEPLATE_PALETTES, DEFAULT_PALETTE, cleanDecorationAsset, cleanNameplateAsset, cleanPalette, cosmeticsFromUser, decorationUrl, nameplateUrls, userCardData } from '../src/utils/discordCosmetics.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); }
};
const same = (name, got, expected) => check(name, JSON.stringify(got) === JSON.stringify(expected), `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);

// Asset strings: only a-z, 0-9, "_", "-" (and "/" between the parts of a nameplate folder).
same('decoration asset', cleanDecorationAsset('a_0123abcd'), 'a_0123abcd');
for (const bad of ['', 'A_UPPER', 'a b', '../x', 'a/b', 'a.png', 'a?x=1', 'a#b', 'a%2f', '"><script>', 'x'.repeat(81), null, undefined, 42, {}]) same(`decoration asset rejects ${JSON.stringify(bad)}`, cleanDecorationAsset(bad), null);
same('nameplate asset', cleanNameplateAsset('nameplates/nameplates/twilight/'), 'nameplates/nameplates/twilight/');
same('nameplate asset gets its slash', cleanNameplateAsset('nameplates/nameplates/twilight'), 'nameplates/nameplates/twilight/');
for (const bad of ['', '/', '//', '/x/', 'a//b/', '../x/', 'a/../b/', 'a.b/', 'a b/', 'a/?x/', 'a/b\\c/', 'Upper/case/', 'a/b/c/d/e/', null, 7]) same(`nameplate asset rejects ${JSON.stringify(bad)}`, cleanNameplateAsset(bad), null);

// Addresses: only cdn.discordapp.com over https, built from validated strings.
same('decoration animated', decorationUrl('a_0123', true), 'https://cdn.discordapp.com/avatar-decoration-presets/a_0123.png?size=96&passthrough=true');
same('decoration still', decorationUrl('a_0123', false), 'https://cdn.discordapp.com/avatar-decoration-presets/a_0123.png?size=96&passthrough=false');
same('decoration with a bad asset', decorationUrl('../../evil', true), null);
same('nameplate addresses', nameplateUrls('nameplates/nameplates/twilight/'), {
  video: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/twilight/asset.webm',
  still: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/twilight/static.png',
});
same('nameplate with a bad asset', nameplateUrls('http://evil.test/'), null);

// Palettes: the eleven of Discord, each with two colors; an unknown one is the calm default.
same('palette names', Object.keys(NAMEPLATE_PALETTES), ['crimson', 'berry', 'sky', 'teal', 'forest', 'bubble_gum', 'violet', 'cobalt', 'clover', 'lemon', 'white']);
for (const [name, pair] of Object.entries(NAMEPLATE_PALETTES)) check(`palette ${name} has two hex colors`, pair.length === 2 && pair.every((c) => /^#[0-9a-f]{6}$/.test(c)));
same('palette known', cleanPalette('violet'), 'violet');
for (const bad of ['neon', '', '__proto__', 'constructor', 'toString', null, 3]) same(`palette ${JSON.stringify(bad)} falls back`, cleanPalette(bad), DEFAULT_PALETTE);

// What the session keeps of Discord's user object: the two assets and the palette, nothing else.
const discordUser = {
  id: '123456789012345678', username: 'liam', global_name: 'Liam', avatar: 'abc', email: 'x@y.z', mfa_enabled: true, locale: 'es', banner: 'ban',
  avatar_decoration_data: { asset: 'a_0123abcd', sku_id: '999', expires_at: null },
  collectibles: { nameplate: { asset: 'nameplates/nameplates/twilight/', label: 'COLLECTIBLES_NAMEPLATES_TWILIGHT', palette: 'violet', sku_id: '1' } },
};
same('kept from the user', cosmeticsFromUser(discordUser), { decoration: 'a_0123abcd', nameplate: { asset: 'nameplates/nameplates/twilight/', palette: 'violet' } });
same('kept: nothing set', cosmeticsFromUser({ id: '1', username: 'a', avatar: null }), { decoration: null, nameplate: null });
same('kept: collectibles without nameplate', cosmeticsFromUser({ collectibles: {} }), { decoration: null, nameplate: null });
same('kept: null data', cosmeticsFromUser({ avatar_decoration_data: null, collectibles: null }), { decoration: null, nameplate: null });
same('kept: junk values', cosmeticsFromUser({ avatar_decoration_data: { asset: '../x' }, collectibles: { nameplate: { asset: 'http://x/', palette: 'neon' } } }), { decoration: null, nameplate: null });
same('kept: unknown palette', cosmeticsFromUser({ collectibles: { nameplate: { asset: 'nameplates/nameplates/x/', palette: 'neon' } } }).nameplate, { asset: 'nameplates/nameplates/x/', palette: 'white' });
same('kept: nothing for null', cosmeticsFromUser(null), { decoration: null, nameplate: null });

// What the card draws: no empty frames when nothing is set, and never a token, an id or a time.
const session = {
  userId: '123456789012345678', username: 'Liam', avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/abc.png?size=64',
  accessToken: 'ACCESS-TOKEN-SECRET', refreshToken: 'REFRESH-TOKEN-SECRET', expiresAt: 1893456000000, ...cosmeticsFromUser(discordUser),
};
const full = userCardData(session);
same('card with both', { d: full.decoration, n: full.nameplate }, {
  d: { animated: 'https://cdn.discordapp.com/avatar-decoration-presets/a_0123abcd.png?size=96&passthrough=true', still: 'https://cdn.discordapp.com/avatar-decoration-presets/a_0123abcd.png?size=96&passthrough=false' },
  n: { video: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/twilight/asset.webm', still: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/twilight/static.png', from: NAMEPLATE_PALETTES.violet[0], to: NAMEPLATE_PALETTES.violet[1] },
});
const body = JSON.stringify(full);
for (const secret of ['ACCESS-TOKEN-SECRET', 'REFRESH-TOKEN-SECRET', '1893456000000', 'accessToken', 'refreshToken', 'expiresAt', 'userId', 'sku_id', 'email']) check(`no ${secret} in the card`, !body.includes(secret));
for (const url of [full.avatar, full.decoration.animated, full.decoration.still, full.nameplate.video, full.nameplate.still]) check(`card address is cdn.discordapp.com https: ${url}`, /^https:\/\/cdn\.discordapp\.com\//.test(url));
const none = userCardData({ username: 'Liam', avatar: null, decoration: null, nameplate: null });
same('card with none', none, { name: 'Liam', avatar: null, decoration: null, nameplate: null });
same('card of an old session (never read)', userCardData({ username: 'Liam', avatar: session.avatar }), { name: 'Liam', avatar: session.avatar, decoration: null, nameplate: null });
same('card drops a tampered decoration', userCardData({ username: 'A', avatar: null, decoration: 'x/../../y' }).decoration, null);
same('card drops a tampered nameplate', userCardData({ username: 'A', avatar: null, nameplate: { asset: 'javascript:alert(1)/', palette: 'violet' } }).nameplate, null);
same('card drops a picture from another site', userCardData({ username: 'A', avatar: 'https://example.com/a.png' }).avatar, null);
same('card cleans the name', userCardData({ username: 'Li\u0000a\nm', avatar: null }).name, 'Liam');
check('card cuts a long name', userCardData({ username: 'x'.repeat(500), avatar: null }).name.length === 80);
same('card of nothing', userCardData(null), { name: '', avatar: null, decoration: null, nameplate: null });

// The component: motion rules, lazy video, a still picture as poster, room for the ring, nothing of Node.
const card = read('src/components/DashUserCard.astro');
check('video is muted, looped, inline and not preloaded', /<video[^>]*\bmuted\b[^>]*\bloop\b[^>]*\bplaysinline\b[^>]*preload="none"/.test(card));
check('video has the still picture as poster', /poster=\{plate\.still\}/.test(card));
check('video source is set only by the script', !/<video[^>]*\ssrc=/.test(card) && /video\.src = /.test(card));
check('reduced motion uses the still decoration', /prefers-reduced-motion: reduce/.test(card) && /<source media="\(prefers-reduced-motion: reduce\)"/.test(card));
check('Save-Data uses the still pictures', /saveData/.test(card) && /deco\.dataset\.still/.test(card));
check('the ring is 1.2x with room around the avatar', /width: 120%; height: 120%/.test(card) && /\.dgl-user-av \{[^}]*margin: 4px/.test(card));
check('the card reads nothing of the session but its props', !/getDashboardSession|decodeSession|petto_session|accessToken|refreshToken/.test(card));
for (const [name, text] of [['discordCosmetics.mjs', read('src/utils/discordCosmetics.mjs')], ['DashUserCard.astro', card], ['session.ts', read('src/utils/session.ts')]]) {
  check(`${name} uses nothing of Node`, !/node:|from 'pg'|require\(/.test(text));
}
const layout = read('src/components/DashGuildLayout.astro');
check('the menu draws the user card', /<DashUserCard user=\{user\}/.test(layout));
const callback = read('src/pages/dash/callback.ts');
check('the login keeps the cosmetics through the one function', /\.\.\.cosmeticsFromUser\(user\)/.test(callback) && !/avatar_decoration|collectibles/.test(callback));
check('the /api/session answer is unchanged', !/decoration|nameplate/.test(read('src/pages/api/session.ts')) && !/decoration|nameplate/.test(read('src/utils/navAccount.mjs')));

console.log(`Checked the user card cosmetics, ${failed} failed.`);
if (failed) process.exit(1);
