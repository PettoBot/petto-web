// Taking Premium off a server (src/utils/premium.ts): the avatar and the banner that were UPLOADED leave no link in the database, so the reset
// used to see "nothing saved" and leave them on in Discord. It now asks Discord what is on, and takes it off. Also: the Customize page saves the
// profile and the name style at the same time, the notice of the locked fields does not follow the scroll, and a host that never answers cannot
// keep a save waiting.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const out = await build({ entryPoints: [`${root}src/utils/premium.ts`], bundle: true, write: false, format: 'esm', platform: 'node', define: { __NODE_TARGET__: 'false' }, logLevel: 'silent' });
const premium = await import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);

const BOT_ID = '1234567890123456789';
const GUILD = '987654321098765432';
process.env.PETTO_BOT_API_URL = 'http://bot.test';
process.env.PETTO_BOT_API_SECRET = 'secret';
process.env.DISCORD_TOKEN = `${Buffer.from(BOT_ID).toString('base64')}.abc.def`;

let guildRow;       // what the database says about the server
let discordMember;  // what Discord says about the bot in the server
let calls = [];
globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  const method = init.method ?? 'GET';
  calls.push([method, u.replace(/^https?:\/\//, ''), init.body ? JSON.parse(init.body) : null]);
  if (u.startsWith('http://bot.test/rest/v1/guilds')) {
    if (method === 'GET') return new Response(JSON.stringify(u.includes('bot_name_style') && !u.includes('bot_avatar_url') ? [{ bot_name_style: null }] : [guildRow]), { status: 200 });
    return new Response(null, { status: 204 });
  }
  if (u === `https://discord.com/api/guilds/${GUILD}/members/${BOT_ID}` && method === 'GET') return new Response(JSON.stringify(discordMember), { status: 200 });
  if (u === `https://discord.com/api/guilds/${GUILD}/members/@me` && method === 'PATCH') return new Response('{}', { status: 200 });
  return new Response(null, { status: 404 });
};
const discordPatches = () => calls.filter(([m, u]) => m === 'PATCH' && u.includes('discord.com'));
const astro = {};

// 1. An avatar that was uploaded: nothing saved in the database, but Discord has it on. The reset takes it off.
guildRow = { bot_nickname: null, bot_avatar_url: null, bot_banner_url: null, bot_description: null, bot_name_style: null };
discordMember = { nick: null, avatar: 'a_hash', banner: null, user: { id: BOT_ID } };
calls = [];
assert.equal(await premium.resetGuildPremiumCustomization(astro, GUILD), true);
assert.equal(discordPatches().length, 1, 'Discord is told to clear the look');
assert.deepEqual(discordPatches()[0][2], { avatar: null, banner: null, bio: null }, 'avatar, banner and bio go back to the default');

// 2. The same on the Customize page's fallback.
calls = [];
await premium.resetGuildPremiumCustomizationIfStale(astro, GUILD);
assert.equal(discordPatches().length, 1, 'the page fallback takes an uploaded avatar off too');

// 3. A banner only is enough as well.
discordMember = { nick: null, avatar: null, banner: 'b_hash', user: { id: BOT_ID } };
calls = [];
await premium.resetGuildPremiumCustomization(astro, GUILD);
assert.equal(discordPatches().length, 1, 'an uploaded banner is taken off');

// 4. Nothing on anywhere: nothing is sent to Discord (a nickname stays, it is free).
discordMember = { nick: 'Petto Mod', avatar: null, banner: null, user: { id: BOT_ID } };
calls = [];
assert.equal(await premium.resetGuildPremiumCustomization(astro, GUILD), true);
assert.equal(discordPatches().length, 0, 'a clean server is left alone, and its nickname is kept');

// 5. A clean server is not asked again for a while.
const GUILD2 = '987654321098765433';
const before = calls.length;
await premium.resetGuildPremiumCustomizationIfStale(astro, GUILD);
calls = [];
await premium.resetGuildPremiumCustomizationIfStale(astro, GUILD);
assert.equal(calls.length, 0, 'the second visit within ten minutes asks nothing');
void GUILD2; void before;

// 6. The page, its styles and the save.
const customize = readFileSync(`${root}src/components/DashCustomize.astro`, 'utf8');
assert.ok(!/premium-gate-card\)\s*\{[^}]*position:\s*sticky/.test(customize), 'the Premium notice does not follow the scroll');
const page = readFileSync(`${root}src/pages/dash/guild/[id]/customize.astro`, 'utf8');
assert.ok(/Promise\.all\(\[saveProfile\(\), saveStyle\(\)\]\)/.test(page), 'the profile and the name style are saved at the same time');
const discord = readFileSync(`${root}src/utils/discord.ts`, 'utf8');
assert.ok(/AbortSignal\.timeout\(IMAGE_FETCH_TIMEOUT_MS\)/.test(discord), 'an image host that does not answer is given up on');
assert.ok(/signal: AbortSignal\.timeout\(DISCORD_WRITE_TIMEOUT_MS\)/.test(discord), 'a Discord that does not answer is given up on');

console.log('premium reset: ok');
