// Checks the calls the Forums page makes to the bot (callPettoForums in src/utils/pettoBotApi.ts) against a fake bot, with the same fetch
// behaviour as the real one (an answer's body can be read only once). It fails when a healthy bot is reported as "not answering":
// botFetch reads the body and hands the parsed answer over as `data`, so a caller that reads the body again would always fail.
// Run: node scripts/check-forums.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const source = fs.readFileSync(`${root}src/utils/pettoBotApi.ts`, 'utf8');
assert.ok(!/call\.response\??\.(json|text|arrayBuffer|blob)\(/.test(source), 'a caller reads the body again after botFetch read it (use call.data)');

// The module as the dashboard runs it, without the session code (the role grant is only a header and is optional).
const bundled = await build({
  entryPoints: [`${root}src/utils/pettoBotApi.ts`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent',
  define: { __NODE_TARGET__: 'true', __DIRECT_DB__: 'true' },
  plugins: [{
    name: 'stubs',
    setup(b) {
      b.onResolve({ filter: /^\.\/(dashAuth|dashAccess)$/ }, (args) => ({ path: args.path, namespace: 'stub' }));
      b.onLoad({ filter: /.*/, namespace: 'stub' }, (args) => ({ contents: args.path.includes('dashAuth') ? 'export async function getGuildSession() { return {}; }' : 'export function pageDecision() { return { allowed: false }; }', loader: 'js' }));
    },
  }],
});
const url = `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`;
const { callPettoForums, botFetch } = await import(url);

process.env.PETTO_BOT_API_URL = 'http://bot.test';
process.env.PETTO_BOT_API_SECRET = 'check-only';
const context = { locals: {} };
const realFetch = globalThis.fetch;
let failed = 0;
async function check(name, fake, expect) {
  globalThis.fetch = async (...args) => fake(...args);
  try {
    const answer = await callPettoForums(context, '111111111111111111', '222222222222222222', 'channels', {}, 'en');
    expect(answer);
    console.log(`ok   ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}: ${error.message}`);
  } finally {
    globalThis.fetch = realFetch;
  }
}
const reply = (body, status = 200) => new Response(body === undefined ? null : typeof body === 'string' ? body : JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const forums = [{ id: '1', name: 'support', can_post: true, missing: [], tags: [] }];
await check('a healthy bot answers ok with its data', async () => reply({ ok: true, forums }), (a) => {
  assert.equal(a.ok, true);
  assert.deepEqual(a.data?.forums, forums);
  assert.notEqual(a.down, true);
});
await check('the message and the link of an answer are kept', async () => reply({ ok: true, message: 'Posted', url: 'https://discord.com/x' }), (a) => {
  assert.equal(a.ok, true); assert.equal(a.message, 'Posted'); assert.equal(a.url, 'https://discord.com/x');
});
await check('a refusal of a healthy bot is not "down" and keeps its message', async () => reply({ ok: false, message: 'No access' }, 403), (a) => {
  assert.equal(a.ok, false); assert.equal(a.message, 'No access'); assert.notEqual(a.down, true);
});
await check('a bot that is away is down', async () => { throw Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNREFUSED' } }); }, (a) => {
  assert.equal(a.ok, false); assert.equal(a.down, true);
});
await check('an answer that is not JSON is down', async () => reply('<html>bad gateway</html>', 502), (a) => {
  assert.equal(a.ok, false); assert.equal(a.down, true);
});

// The same through botFetch itself, as the caller sees it: the body is gone after botFetch, the answer is in `data`.
globalThis.fetch = async () => reply({ ok: true, n: 1 });
const call = await botFetch('http://bot.test/x', { method: 'POST' }, { timeoutMs: 1000, mode: 'read' });
globalThis.fetch = realFetch;
assert.deepEqual(call.data, { ok: true, n: 1 });
assert.equal(call.response.bodyUsed, true, 'botFetch reads the body once');

// The page tells "not answering" from "answered with a refusal" with the down flag, not with !ok.
const page = fs.readFileSync(`${root}src/pages/dash/guild/[id]/forums.astro`, 'utf8');
assert.match(page, /botDown = Boolean\([^;]*forumsAnswer\.down\)/, 'the Forums page must use the down flag for "Petto is not answering"');

if (failed) { console.error(`check-forums: ${failed} failed`); process.exit(1); }
console.log('check-forums: ok');
