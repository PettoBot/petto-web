// Checks the menu header, the server sheet and the profile dash (src/utils/dashProfile.mjs, dashSwitcher.mjs, DashSideHead.astro,
// DashServerSheet.astro, DashMeLayout.astro, DashMe.astro, pages/dash/me.astro).
// Run: node scripts/check-dash-profile.mjs
import { readFileSync } from 'node:fs';
import {
  accentHex, cleanAccentColor, cleanBannerHash, guildBannerUrl, guildHeaderArt, profileFromUser, profileOverview, snowflakeDate, userBannerUrls, userHeaderArt,
} from '../src/utils/dashProfile.mjs';
import { SWITCHER_LIMIT, botInviteUrl, splitServers } from '../src/utils/dashSwitcher.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); }
};
const same = (name, got, expected) => check(name, JSON.stringify(got) === JSON.stringify(expected), `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);

const HASH = '0123456789abcdef0123456789abcdef';
const ANIMATED = `a_${HASH}`;
const GUILD = '1290000000000000001';
const USER = '293504726505357312';

// --- hashes: 32 hex digits, `a_` in front when animated, nothing else ---
same('hash', cleanBannerHash(HASH), HASH);
same('animated hash', cleanBannerHash(ANIMATED), ANIMATED);
for (const bad of ['', 'abc', HASH.toUpperCase(), `${HASH}0`, HASH.slice(1), `b_${HASH}`, `a_${HASH}.gif`, `${HASH}/../x`, `${HASH}?x=1`, `${HASH}#a`, '../etc/passwd', '"><script>', 'a_', null, undefined, 7, {}, [HASH]]) {
  same(`hash rejects ${JSON.stringify(bad)}`, cleanBannerHash(bad), null);
}

// --- accent color: an integer of 24 bits ---
same('accent', cleanAccentColor(0x5865f2), 0x5865f2);
same('accent zero', cleanAccentColor(0), 0);
same('accent hex', accentHex(0x5865f2), '#5865f2');
same('accent hex pads', accentHex(0xff), '#0000ff');
for (const bad of [-1, 0x1000000, 1.5, NaN, Infinity, '16711680', null, undefined, {}]) same(`accent rejects ${JSON.stringify(bad)}`, cleanAccentColor(bad), null);

// --- the addresses: only cdn.discordapp.com, only from a validated hash and a numeric id ---
same('guild banner', guildBannerUrl(GUILD, HASH), `https://cdn.discordapp.com/banners/${GUILD}/${HASH}.webp?size=600`);
same('guild banner animated hash is still', guildBannerUrl(GUILD, ANIMATED), `https://cdn.discordapp.com/banners/${GUILD}/${ANIMATED}.webp?size=600`);
same('guild banner bad hash', guildBannerUrl(GUILD, '../x'), null);
same('guild banner bad id', guildBannerUrl('12/../3', HASH), null);
same('guild banner no hash', guildBannerUrl(GUILD, null), null);
same('user banner', userBannerUrls(USER, HASH), { still: `https://cdn.discordapp.com/banners/${USER}/${HASH}.webp?size=600`, animated: null });
same('user banner animated', userBannerUrls(USER, ANIMATED), { still: `https://cdn.discordapp.com/banners/${USER}/${ANIMATED}.png?size=600`, animated: `https://cdn.discordapp.com/banners/${USER}/${ANIMATED}.gif?size=600` });
same('user banner bad hash', userBannerUrls(USER, 'http://evil.test/x'), null);
same('user banner bad id', userBannerUrls('abc', HASH), null);
for (const url of [guildBannerUrl(GUILD, HASH), userBannerUrls(USER, ANIMATED)?.animated, userBannerUrls(USER, ANIMATED)?.still]) check(`address host ${url}`, new URL(url).origin === 'https://cdn.discordapp.com');

// --- what the session keeps of Discord's user object ---
same('kept from the user', profileFromUser({ id: USER, username: 'ft8d', global_name: 'liam', banner: HASH, accent_color: 0x5865f2, email: 'x@y.z', locale: 'es' }), { handle: 'ft8d', banner: HASH, accentColor: 0x5865f2 });
same('kept: nothing set', profileFromUser({ id: USER, username: 'ft8d', banner: null, accent_color: null }), { handle: 'ft8d', banner: null, accentColor: null });
same('kept: junk', profileFromUser({ username: '<b>x</b>', banner: '../x', accent_color: -5 }), { handle: null, banner: null, accentColor: null });
same('kept: null user', profileFromUser(null), { handle: null, banner: null, accentColor: null });

// --- the banner of a header: the picture, else the account color, else the Petto art ---
same('server with a banner', guildHeaderArt({ id: GUILD, banner: HASH }), { kind: 'image', still: `https://cdn.discordapp.com/banners/${GUILD}/${HASH}.webp?size=600`, animated: null });
same('server without a banner', guildHeaderArt({ id: GUILD, banner: null }), { kind: 'art' });
same('server with a bad banner', guildHeaderArt({ id: GUILD, banner: 'x' }), { kind: 'art' });
same('server unknown', guildHeaderArt(undefined), { kind: 'art' });
same('account with a banner', userHeaderArt({ userId: USER, banner: HASH, accentColor: 0xff0000 }), { kind: 'image', still: `https://cdn.discordapp.com/banners/${USER}/${HASH}.webp?size=600`, animated: null });
same('account with an animated banner', userHeaderArt({ userId: USER, banner: ANIMATED }).animated, `https://cdn.discordapp.com/banners/${USER}/${ANIMATED}.gif?size=600`);
same('account with a color only', userHeaderArt({ userId: USER, banner: null, accentColor: 0x3498db }), { kind: 'color', color: '#3498db' });
same('account with a black color', userHeaderArt({ userId: USER, accentColor: 0 }), { kind: 'color', color: '#000000' });
same('account with nothing', userHeaderArt({ userId: USER, banner: null, accentColor: null }), { kind: 'art' });
same('an old session (nothing read yet)', userHeaderArt({ userId: USER }), { kind: 'art' });

// --- the account creation date, from the snowflake (Discord's own example: 175928847299117063 is 2016-04-30T11:18:25.796Z) ---
same('snowflake date', snowflakeDate('175928847299117063')?.toISOString(), '2016-04-30T11:18:25.796Z');
same('snowflake bad', snowflakeDate('abc'), null);
same('snowflake number', snowflakeDate(175928847299117063), null);

// --- the lists of the sheet: where Petto is, and where it could be invited ---
const MANAGE = 0x20;
const guild = (id, name, permissions = '0', owner = false) => ({ id, name, permissions, owner, icon: null });
const canManage = (g) => g.owner || (Number(g.permissions) & MANAGE) === MANAGE;
const iconOf = (g) => (g.icon ? `icon:${g.id}` : null);
const guilds = [
  guild('100000000000000001', 'Zeta', String(MANAGE)),
  guild('100000000000000002', 'Alpha', String(MANAGE)),
  guild('100000000000000003', 'Mid', '0', true),
  guild('100000000000000004', 'Not mine', '0'),
  guild('100000000000000005', 'Beta', String(MANAGE)),
  guild('100000000000000006', 'Gamma (no bot)', String(MANAGE)),
  { id: 'nope', name: 'Bad id', permissions: String(MANAGE) },
  { id: '100000000000000007', permissions: String(MANAGE) },
];
const bot = new Set(['100000000000000001', '100000000000000002', '100000000000000003', '100000000000000004', '100000000000000005']);
const split = splitServers(guilds, bot, { canManage, iconOf, memberCounts: new Map([['100000000000000001', 50], ['100000000000000003', 900]]), premiumIds: new Set(['100000000000000003']) });
same('mine: biggest first, then by name; the ones I do not manage are left out', split.mine.map((g) => g.name), ['Mid', 'Zeta', 'Alpha', 'Beta']);
same('mine: premium and members', [split.mine[0].premium, split.mine[0].members, split.mine[1].premium, split.mine[3].members], [true, 900, false, null]);
same('invite: managed, Petto not in them, by name', split.invite.map((g) => g.name), ['Gamma (no bot)']);
same('totals', split.total, { mine: 4, invite: 1 });
same('bot list unknown', splitServers(guilds, null, { canManage, iconOf }), { mine: [], invite: [], total: { mine: 0, invite: 0 } });
same('guild list unknown', splitServers(null, bot, { canManage, iconOf }), { mine: [], invite: [], total: { mine: 0, invite: 0 } });
same('no servers', splitServers([], bot, { canManage, iconOf }).mine, []);
const many = Array.from({ length: SWITCHER_LIMIT + 30 }, (_, i) => guild(String(200000000000000000 + i), `S${String(i).padStart(3, '0')}`, String(MANAGE)));
const capped = splitServers(many, new Set(), { canManage, iconOf });
same('invite list is capped, the total is not', [capped.invite.length, capped.total.invite], [SWITCHER_LIMIT, SWITCHER_LIMIT + 30]);
// The invite is the one the server picker uses.
same('invite address', botInviteUrl('1489326875498119168', '100000000000000006'), 'https://discord.com/api/oauth2/authorize?client_id=1489326875498119168&permissions=8&scope=bot%20applications.commands&guild_id=100000000000000006&disable_guild_select=true');

// --- the profile overview: only what exists ---
const full = profileOverview({
  session: { userId: USER, username: 'liam', handle: 'ft8d' },
  servers: { ...split, total: { mine: 12, invite: 3 } },
  premium: { status: 'active', slotsUsed: 2, slotsTotal: 3, periodEnd: '2027-01-02T00:00:00.000Z' },
  prefix: '?',
  reputation: { points: 42, servers: 2 },
  top: 2,
});
same('overview name and handle', [full.name, full.handle], ['liam', 'ft8d']);
same('overview servers', [full.servers.managed, full.servers.withPetto, full.servers.toInvite, full.servers.top.length], [15, 12, 3, 2]);
same('overview premium', full.premium, { status: 'active', slotsUsed: 2, slotsTotal: 3, endsAt: '2027-01-02T00:00:00.000Z' });
same('overview settings', full.settings, { prefix: '?', reputation: { points: 42, servers: 2 } });
same('overview created', full.created, '2017-03-20T22:02:59.853Z');
const bare = profileOverview({ session: { userId: 'x', username: ' ', handle: 'bad handle' }, servers: { mine: [], invite: [], total: { mine: 0, invite: 0 } } });
same('overview of an empty account', [bare.name, bare.handle, bare.created, bare.premium, bare.settings], ['', null, null, { status: 'free', slotsUsed: 0, slotsTotal: 0, endsAt: null }, { prefix: null, reputation: null }]);
same('overview hides the handle when it is the name', profileOverview({ session: { userId: USER, username: 'ft8d', handle: 'ft8d' }, servers: { mine: [], invite: [], total: { mine: 0, invite: 0 } } }).handle, null);
same('overview ends date only while active', profileOverview({ session: { userId: USER, username: 'a' }, servers: { mine: [], invite: [], total: { mine: 0, invite: 0 } }, premium: { status: 'expired', periodEnd: '2020-01-01T00:00:00Z' } }).premium.endsAt, null);
same('overview unknown premium status is free', profileOverview({ session: { userId: USER, username: 'a' }, servers: { mine: [], invite: [], total: { mine: 0, invite: 0 } }, premium: { status: 'hacked' } }).premium.status, 'free');
same('overview reputation of zero is hidden', profileOverview({ session: { userId: USER, username: 'a' }, servers: { mine: [], invite: [], total: { mine: 0, invite: 0 } }, reputation: { points: 0, servers: 0 } }).settings.reputation, null);

// --- the session keeps only the new optional fields, with their types, and nothing else of the account ---
const session = read('src/utils/session.ts');
for (const field of ['handle', 'banner', 'accentColor']) {
  check(`session declares ${field}`, new RegExp(`${field}\\?: `).test(session));
  check(`session validates ${field}`, new RegExp(`session\\.${field} === undefined \\|\\| session\\.${field} === null \\|\\| typeof session\\.${field} === '`).test(session));
}
check('session still has no email or locale', !/email|locale/i.test(session));
check('the login keeps the profile fields', /\.\.\.profileFromUser\(user\)/.test(read('src/pages/dash/callback.ts')));
const auth = read('src/utils/dashAuth.ts');
check('old sessions are refreshed for the profile fields', /session\.handle !== undefined && session\.banner !== undefined && session\.accentColor !== undefined/.test(auth) && /\.\.\.profileFromUser\(user\)/.test(auth));

// --- the pages ---
const head = read('src/components/DashSideHead.astro');
const sheet = read('src/components/DashServerSheet.astro');
const guildLayout = read('src/components/DashGuildLayout.astro');
const meLayout = read('src/components/DashMeLayout.astro');
const mePage = read('src/pages/dash/me.astro');
check('the server menu uses the new header and the sheet', /<DashSideHead kind="guild"/.test(guildLayout) && /<DashServerSheet /.test(guildLayout));
check('the old dropdown is gone', !/dgl-switcher/.test(guildLayout));
check('the profile menu uses the new header and the sheet', /<DashSideHead kind="user"/.test(meLayout) && /<DashServerSheet /.test(meLayout));
check('the header opens the sheet', /data-sheet-open/.test(head) && /aria-haspopup="dialog"/.test(head) && /aria-controls="ds-sheet"/.test(head));
check('the sheet is a labelled modal dialog', /role="dialog"/.test(sheet) && /aria-modal="true"/.test(sheet) && /aria-labelledby="ds-title"/.test(sheet));
check('the sheet closes with Escape, the backdrop and a swipe, and traps Tab', /e\.key === 'Escape'/.test(sheet) && /data-sheet-veil/.test(sheet) && /touchmove/.test(sheet) && /e\.key !== 'Tab'/.test(sheet));
check('the sheet marks the current server', /aria-current/.test(sheet));
check('the invite opens in a new tab safely', /target="_blank" rel="noopener noreferrer"/.test(sheet));
check('the profile page needs a login and keeps the place', /petto_after_login/.test(mePage) && /Astro\.redirect\('\/dash'\)/.test(mePage));
check('the profile page adds no Discord call of its own', !/discord\.com/.test(mePage) && !/discord\.com/.test(read('src/utils/dashSwitcherData.ts')));
check('the account header uses the decoration and the animated banner only without reduced motion', /prefers-reduced-motion: reduce/.test(head));
check('the profile and its prefixed addresses are routed by the existing middleware', /\(es\|pt-br\)\(\\\/dash/.test(read('src/middleware.ts')));
check('the callback accepts /dash/me as a place to come back to', /dash\(\?:\\\/\|\$\)/.test(read('src/pages/dash/callback.ts')));

// --- the texts: every key the new parts use is in the Spanish and Portuguese catalogs, with the same placeholders ---
const catalog = (name) => {
  const out = new Map();
  for (const m of read(`src/i18n/${name}`).matchAll(/^\s*("(?:[^"\\]|\\.)*"):\s*("(?:[^"\\]|\\.)*"),?$/gm)) out.set(JSON.parse(m[1]), JSON.parse(m[2]));
  return out;
};
const es = catalog('dash-es.ts');
const pt = catalog('dash-pt.ts');
const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const files = ['src/components/DashSideHead.astro', 'src/components/DashServerSheet.astro', 'src/components/DashMeLayout.astro', 'src/components/DashMe.astro'];
for (const file of files) {
  for (const m of read(file).matchAll(/\bdt\(\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g)) {
    const key = (m[1] ?? m[2]).replace(/\\'/g, "'");
    for (const [lang, table] of [['es', es], ['pt-BR', pt]]) {
      check(`${file} "${key}" is translated to ${lang}`, table.has(key) && table.get(key) !== '');
      if (table.has(key)) check(`${file} "${key}" keeps its placeholders in ${lang}`, placeholders(table.get(key)) === placeholders(key));
    }
  }
}
for (const [key] of [...es].filter(([key]) => !pt.has(key))) check(`"${key}" is in the Portuguese catalog too`, false);
for (const [key] of [...pt].filter(([key]) => !es.has(key))) check(`"${key}" is in the Spanish catalog too`, false);

if (failed) { console.log(`${failed} checks failed`); process.exit(1); }
console.log('Checked the menu header, the server sheet and the profile dash.');
