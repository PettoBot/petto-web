// Checks the menu header, the server sheet and the profile dash (src/utils/dashProfile.mjs, dashSwitcher.mjs, DashSideHead.astro,
// DashServerSheet.astro, DashMeLayout.astro, DashMe.astro, pages/dash/me.astro).
// Run: node scripts/check-dash-profile.mjs
import { readFileSync } from 'node:fs';
import { loginInfo } from '../src/utils/dashLogin.mjs';
import {
  accentHex, accountAge, cleanAccentColor, cleanBannerHash, guildBannerUrl, guildHeaderArt, profileFromUser, profileOverview, snowflakeDate, userBannerUrls, userHeaderArt,
} from '../src/utils/dashProfile.mjs';
import { MAX_ALLOWED_DOMAINS, normalizeDomain, parseDomainList } from '../src/utils/linkDomains.mjs';
import { OWNER_PAGE, OWNER_PAGE_MAX, SWITCHER_LIMIT, botInviteUrl, pageOwnerServers, splitServers } from '../src/utils/dashSwitcher.mjs';

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
same('overview invite list and premium count', [full.servers.invite.map((g) => g.name), full.servers.premium], [['Gamma (no bot)'], 1]);
same('overview created', full.created, '2017-03-20T22:02:59.853Z');
const bare = profileOverview({ session: { userId: 'x', username: ' ', handle: 'bad handle' }, servers: { mine: [], invite: [], total: { mine: 0, invite: 0 } } });
same('overview of an empty account', [bare.name, bare.handle, bare.created, bare.premium, bare.settings], ['', null, null, { status: 'free', slotsUsed: 0, slotsTotal: 0, endsAt: null }, { prefix: null, reputation: null }]);
same('overview hides the handle when it is the name', profileOverview({ session: { userId: USER, username: 'ft8d', handle: 'ft8d' }, servers: { mine: [], invite: [], total: { mine: 0, invite: 0 } } }).handle, null);
same('overview ends date only while active', profileOverview({ session: { userId: USER, username: 'a' }, servers: { mine: [], invite: [], total: { mine: 0, invite: 0 } }, premium: { status: 'expired', periodEnd: '2020-01-01T00:00:00Z' } }).premium.endsAt, null);
same('overview unknown premium status is free', profileOverview({ session: { userId: USER, username: 'a' }, servers: { mine: [], invite: [], total: { mine: 0, invite: 0 } }, premium: { status: 'hacked' } }).premium.status, 'free');
same('overview reputation of zero is hidden', profileOverview({ session: { userId: USER, username: 'a' }, servers: { mine: [], invite: [], total: { mine: 0, invite: 0 } }, reputation: { points: 0, servers: 0 } }).settings.reputation, null);

// --- the account age: whole years, or months under a year ---
const AT = Date.parse('2026-11-04T19:30:00Z');
same('age in years', accountAge('2017-03-20T22:02:59.853Z', AT), { unit: 'year', n: 9 });
same('age just under a year', accountAge('2025-11-05T00:00:00Z', AT), { unit: 'month', n: 11 });
same('age of exactly a year', accountAge('2025-11-04T00:00:00Z', AT), { unit: 'year', n: 1 });
same('age of a new account', accountAge('2026-11-01T00:00:00Z', AT), { unit: 'month', n: 1 });
same('age: junk and the future', [accountAge(null, AT), accountAge('x', AT), accountAge('2030-01-01T00:00:00Z', AT)], [null, null, null]);

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
// The account pages share one layout (menu, header, drawer) and the plain login lands on the profile.
const account = { 'src/components/DashManage.astro': 'servers', 'src/components/DashHistory.astro': 'history', 'src/components/DashPremium.astro': 'premium', 'src/components/DashMe.astro': 'overview' };
for (const [file, id] of Object.entries(account)) {
  const source = read(file);
  check(`${file} sits in the account layout`, new RegExp(`<DashMeLayout user=\\{user\\} active="${id}"`).test(source) && !/layouts\/Base\.astro/.test(source));
  check(`${id} is in the account menu`, new RegExp(`id: '${id}', href: '/dash/`).test(meLayout));
}
// The private staff pages live in the same layout, with a Staff group that only the people who may open them see.
const staffPages = {
  'src/components/DashAdminServers.astro': 'staff-servers', 'src/components/DashPremiumAdmin.astro': 'staff-premium', 'src/components/DashTeamAdmin.astro': 'staff-team',
  'src/components/DashPartnersAdmin.astro': 'staff-partners', 'src/components/DashCreditsAdmin.astro': 'staff-credits', 'src/components/DashAppealNames.astro': 'staff-appeals',
  'src/components/DashImportPick.astro': 'servers',
};
for (const [file, id] of Object.entries(staffPages)) {
  const source = read(file);
  check(`${file} sits in the account layout`, new RegExp(`<DashMeLayout user=\\{user\\} active="${id}"`).test(source) && !/layouts\/Base\.astro/.test(source));
  if (id.startsWith('staff-')) check(`${id} is in the Staff group`, new RegExp(`id: '${id}', href: '/dash/`).test(meLayout));
}
check('the Staff group is built only from the access of the person', /const access = await staffAccess\(Astro, user\.userId\)/.test(meLayout) && /if \(staffItems\.length\) sections\.push/.test(meLayout));
check('the owner pages are in the menu for the owner only', ['staff-servers', 'staff-premium', 'staff-team'].every((id) => new RegExp(`access\\.owner && \\{ id: '${id}'`).test(meLayout)));
check('partners, credits and appeal names are in the menu for the team only', ['staff-partners', 'staff-credits', 'staff-appeals'].every((id) => new RegExp(`access\\.team && \\{ id: '${id}'`).test(meLayout)));
const staffAccessSource = read('src/utils/staffAccess.ts');
check('the menu access reuses the checks of the pages', /isPettoOwner\(astro, userId\)/.test(staffAccessSource) && /canEditPartners\(astro, userId\)/.test(staffAccessSource));
// The page checks did not move: each one still refuses before it reads or writes anything.
const refuse = (file, check_, where) => check(`${file} refuses the people who may not open it`, new RegExp(`if \\(!${check_}\\) return Astro\\.redirect\\('/dash/manage\\?error=forbidden'\\)`).test(read(file)), where);
for (const file of ['src/pages/dash/admin.astro', 'src/pages/dash/admin/servers.astro', 'src/pages/dash/team.astro']) refuse(file, 'isPettoOwner\\(Astro, session\\.userId\\)');
for (const file of ['src/pages/dash/partners-admin.astro', 'src/pages/dash/appeal-names.astro']) refuse(file, '\\(await canEditPartners\\(Astro, session\\.userId\\)\\)');
refuse('src/pages/dash/credits-admin.astro', '\\(await canEditCredits\\(Astro, session\\.userId\\)\\)');
for (const file of ['src/pages/dash/admin.astro', 'src/pages/dash/admin/servers.astro', 'src/pages/dash/team.astro', 'src/pages/dash/partners-admin.astro', 'src/pages/dash/credits-admin.astro', 'src/pages/dash/appeal-names.astro']) {
  const page = read(file);
  check(`${file} checks the person before any POST is read`, page.indexOf('error=forbidden') > -1 && page.indexOf('error=forbidden') < page.indexOf("Astro.request.method"));
}
check('the login lands on the profile', /afterLogin : LANDING_PATH/.test(read('src/pages/dash/callback.ts')) && /LANDING_PATH = '\/dash\/me'/.test(read('src/utils/dashLogin.mjs')));
check('the skeleton of the kit goes inside the account panel', /getElementById\('dme-content'\)/.test(read('src/components/DashPanelKit.astro')));


// --- the owner's part of the sheet: a page of the bot's servers, filtered, never drawn or fetched for anyone else ---
const bigList = Array.from({ length: 95 }, (_, i) => ({ id: String(300000000000000000n + BigInt(i)), name: `Srv ${String(i).padStart(2, '0')}`, icon: i === 0 ? 'https://cdn.discordapp.com/icons/1/a.png' : i === 1 ? 'http://evil.test/x.png' : null, memberCount: i === 5 ? 1000 : i % 2 ? null : i }));
const first = pageOwnerServers(bigList, {});
same('owner page: size, total and where the next starts', [first.items.length, first.total, first.next], [OWNER_PAGE, 95, OWNER_PAGE]);
same('owner page: the biggest first', first.items[0].name, 'Srv 05');
same('owner page: the last page has no next', pageOwnerServers(bigList, { offset: 90 }).next, null);
same('owner page: the limit is capped', pageOwnerServers(bigList, { limit: 5000 }).items.length, OWNER_PAGE_MAX);
same('owner page: bad numbers fall back', [pageOwnerServers(bigList, { offset: 'x', limit: '-3' }).items.length, pageOwnerServers(bigList, { offset: -9 }).items.length], [1, OWNER_PAGE]);
same('owner search by name', pageOwnerServers(bigList, { q: ' SRV 42 ' }).items.map((g) => g.name), ['Srv 42']);
same('owner search by id', pageOwnerServers(bigList, { q: '300000000000000007' }).items.map((g) => g.name), ['Srv 07']);
same('owner search with no match', pageOwnerServers(bigList, { q: 'zzz' }), { items: [], total: 0, next: null });
same('owner page: only discord icons pass', pageOwnerServers(bigList, { q: 'Srv 0', limit: 50 }).items.filter((g) => g.name === 'Srv 00' || g.name === 'Srv 01').map((g) => g.icon), ['https://cdn.discordapp.com/icons/1/a.png', null]);
same('owner page: junk input', [pageOwnerServers(null, {}).total, pageOwnerServers([{ id: 'x', name: 'a' }, { id: '300000000000000001' }], {}).total, pageOwnerServers(bigList, { q: { toString: 1 } }).total], [0, 0, 95]);
const ownerRoute = read('src/pages/dash/owner-servers.ts');
check('the owner route answers 404 to anyone but the owner, before reading the list', /!isPettoOwner\(astro, session\.userId\)\) return json\(\{ error: 'not_found' \}, 404\)/.test(ownerRoute) && ownerRoute.indexOf('isPettoOwner(astro') < ownerRoute.indexOf('getBotGuildList(botToken)'));
check('the owner route is not cached', /no-store/.test(ownerRoute));
const sheetSrc = read('src/components/DashServerSheet.astro');
check('the owner part exists only in the markup of an owner (server side)', /\{owner && \(\s*<div class="ds-owner" data-owner/.test(sheetSrc) && /owner\?: boolean/.test(sheetSrc) && /owner = false/.test(sheetSrc));
check('the owner part fetches only when it is opened, with a skeleton', /if \(open && !started\)/.test(sheetSrc) && /data-owner-skel/.test(sheetSrc) && !/fetch\(/.test(sheetSrc.split('<script is:inline>')[0]));
check('the owner rows link like the normal rows', /'\/dash\/guild\/' \+ encodeURIComponent\(g\.id\) \+ '\/overview'/.test(sheetSrc));
check('the owner list is built with textContent, never innerHTML', !/innerHTML/.test(sheetSrc));
check('both layouts decide the owner with isPettoOwner', /owner=\{[^}]*isPettoOwner\(Astro, user\.userId/.test(guildLayout) && /owner=\{isPettoOwner\(Astro, user\.userId\)\}/.test(meLayout));

// --- everyone logs in again once: the session carries a version, an older one is rejected ---
check('the session has a version constant, stamped when it is made', /export const SESSION_VERSION = \d+;/.test(session) && /JSON\.stringify\(\{ \.\.\.session, v: SESSION_VERSION \}\)/.test(session));
check('a session without the version or with a lower one is rejected', /typeof session\.v === 'number' && session\.v >= SESSION_VERSION/.test(session) && /isCurrentSession\(session\)/.test(session));
check('the session code stays Web Crypto only (Cloudflare)', !/node:|from 'crypto'|require\(|\bBuffer\b|from 'pg'/.test(session.replace(/^\s*\/\/.*$/gm, '')));
check('a stale session is cleared and flagged', /isCurrentSession\(session\)/.test(auth) && /sessionStale = true/.test(auth) && /cookies\.delete\('petto_session'/.test(auth));
check('the redirect to /dash carries ?notice=relogin', /notice=relogin/.test(read('src/middleware.ts')) && /withReloginNotice\(context,/.test(read('src/middleware.ts')));
same('login info codes', [loginInfo('relogin'), loginInfo('x'), loginInfo(null), loginInfo(['relogin'])], ['relogin', null, null, null]);
check('the login card shows the info banner with a close button', /data-dl-info/.test(read('src/components/DashLogin.astro')) && /data-dl-info-close/.test(read('src/components/DashLogin.astro')) && /loginInfo\(noticeParam\)/.test(read('src/pages/dash/index.astro')));
try {
  // session.ts has no imports, so it is turned into plain JavaScript with the TypeScript package of the repo and loaded from memory: this works on
  // any Node (CI runs Node 20, which cannot import a .ts file) and needs no flag.
  const ts = (await import('typescript')).default;
  const compiled = ts.transpileModule(read('src/utils/session.ts'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const { SESSION_VERSION, decodeAnySession, decodeSession, encodeSession } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
  const base = { userId: USER, username: 'liam', avatar: null, accessToken: 'a', refreshToken: 'r', expiresAt: Date.now() + 1e6 };
  const fresh = await encodeSession(base, 'secret');
  same('a new session carries the version and is accepted', [(await decodeSession(fresh, 'secret'))?.v], [SESSION_VERSION]);
  same('a session with the wrong secret is rejected', await decodeSession(fresh, 'other'), null);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('secret'));
  const key = await crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt']);
  const b64 = (bytes) => Buffer.from(bytes).toString('base64url');
  const forge = async (extra) => `v1.${b64(iv)}.${b64(new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify({ ...base, ...extra })))))}`;
  const old = await forge({});
  same('a session made before the version is rejected as logged out', await decodeSession(old, 'secret'), null);
  same('...but can still be told apart from a broken cookie', (await decodeAnySession(old, 'secret'))?.userId, USER);
  same('a lower version is rejected', await decodeSession(await forge({ v: SESSION_VERSION - 1 }), 'secret'), null);
  same('a higher version is accepted', (await decodeSession(await forge({ v: SESSION_VERSION + 1 }), 'secret'))?.userId, USER);
} catch (error) {
  check('the session version runs', false, String(error?.message ?? error));
}

// --- the texts: every key the new parts use is in the Spanish and Portuguese catalogs, with the same placeholders ---
const catalog = (name) => {
  const out = new Map();
  for (const m of read(`src/i18n/${name}`).matchAll(/^\s*("(?:[^"\\]|\\.)*"):\s*("(?:[^"\\]|\\.)*"),?$/gm)) out.set(JSON.parse(m[1]), JSON.parse(m[2]));
  return out;
};
const es = catalog('dash-es.ts');
const pt = catalog('dash-pt.ts');
const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
// The swipe moves the sheet through --ds-dy only: an inline transform would replace translate(-50%, ...) and push the sheet to the right.
check('the sheet swipe never sets an inline transform', !/sheet\.style\.transform/.test(sheetSrc) && /setProperty\('--ds-dy'/.test(sheetSrc));
check('every sheet transform keeps the horizontal centering', (sheetSrc.match(/transform: translate\(-50%, [^;]*var\(--ds-dy/g) || []).length === 3);

// Moving to another page replaces #dgl-content, so the menu height cap must follow the new node (an observer on the old one reported 0).
check('the menu height follows the page node after a swap', /MutationObserver\(tell\)\.observe\(layout, \{ childList: true \}\)/.test(guildLayout) && /panel !== watched/.test(guildLayout));

const files = ['src/components/DashSideHead.astro', 'src/components/DashServerSheet.astro', 'src/components/DashMeLayout.astro', 'src/components/DashMe.astro', 'src/components/DashLogin.astro', 'src/components/DashAutomodTemplates.astro'];
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

// --- the allowed domains of the All links filter (the same rules as the bot's src/utils/linkDomains.js) ---
same('domain lowercase', normalizeDomain('Example.COM'), 'example.com');
same('domain from a link', normalizeDomain('https://www.Example.com/path?q=1#x'), 'example.com');
same('domain port', normalizeDomain('example.com:8080'), 'example.com');
same('domain final dot', normalizeDomain('example.com.'), 'example.com');
same('domain wildcard', normalizeDomain('*.example.com'), 'example.com');
same('domain subdomain kept', normalizeDomain('sub.example.co.uk'), 'sub.example.co.uk');
same('domain idn', normalizeDomain('münchen.de'), 'xn--mnchen-3ya.de');
same('domain punycode', normalizeDomain('xn--mnchen-3ya.de'), 'xn--mnchen-3ya.de');
for (const bad of ['', '   ', 'localhost', '1.2.3.4', '[::1]', 'a..b.com', '-x.com', 'x-.com', 'foo.c', 'bad domain.com', 'user@example.com', 'http://user@example.com', 'exa_mple.com', 'exam%70le.com', 'example.com\\evil.com', `${'x'.repeat(64)}.com`, '<script>.com', null, undefined, 7, {}]) {
  same(`domain rejects ${JSON.stringify(bad)}`, normalizeDomain(bad), null);
}
same('domain list from text', parseDomainList('example.com, HTTPS://Example.com/x\nnope;foo.org\n\n'), { domains: ['example.com', 'foo.org'], invalid: ['nope'], overflow: 0 });
same('domain list from an array', parseDomainList(['a.com', 'b.com', 7]).invalid, ['7']);
same('domain list not a text', parseDomainList(null), { domains: [], invalid: [], overflow: 0 });
const manyDomains = parseDomainList(Array.from({ length: 60 }, (_, i) => `site${i}.com`));
same('domain list limit', [manyDomains.domains.length, manyDomains.overflow, MAX_ALLOWED_DOMAINS], [50, 10, 50]);
same('domain list reports at most 5 invalid', parseDomainList('a b c d e f g h'.split(' ').map((x) => `x${x}`)).invalid.length, 5);
const domainsApi = read('src/pages/dash/guild/[id]/automod-api.ts');
check('domains are saved through the validation', /op === 'link_domains_save'[\s\S]*parseDomainList\(body\.domains\)[\s\S]*allowed_link_domains: domains/.test(domainsApi));
check('a missing column is answered as unsupported, not as a failure', /unsupported = \/allowed_link_domains\|PGRST204\|42703\//.test(domainsApi) && /unsupported \? 409 : 500/.test(domainsApi));
const domainsPage = read('src/pages/dash/guild/[id]/automod.astro');
check('the page reads the column on its own and turns the control off when it fails', /select=allowed_link_domains/.test(domainsPage) && /linkDomainsSupported = Boolean\(domainsRes\?\.ok\)/.test(domainsPage));
check('the control is disabled when unsupported', /disabled=\{!linkDomainsSupported\}/.test(read('src/components/DashAutomodTemplates.astro')));

if (failed) { console.log(`${failed} checks failed`); process.exit(1); }
console.log('Checked the menu header, the server sheet and the profile dash.');
