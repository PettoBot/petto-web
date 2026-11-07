// The vote webhooks of the lists reach the website, and it hands them to the bot untouched: body bytes, signature headers, and the bot's answer.
import { createServer } from 'node:http';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const out = await build({ entryPoints: [`${root}src/utils/botWebhookProxy.ts`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const { forwardToBot } = await import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);

const seen = [];
const bot = createServer((req, res) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => { seen.push({ url: req.url, method: req.method, headers: req.headers, body: Buffer.concat(chunks) }); res.statusCode = req.headers['x-webhook-signature'] === 'bad' ? 401 : 200; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ ok: res.statusCode === 200 })); });
});
await new Promise((resolve) => bot.listen(0, '127.0.0.1', resolve));
process.env.PETTO_BOT_API_URL = `http://127.0.0.1:${bot.address().port}/`;

const body = JSON.stringify({ type: 'NEW_VOTE', data: { user: '1' }, text: 'ñ ✓ emoji 🐥' });
const signature = `sha256=${createHmac('sha256', 'secret').update(body).digest('hex')}`;
const request = (headers, payload = body) => new Request('https://petto.sbs/webhooks/omniplex', { method: 'POST', headers, body: payload });

const ok = await forwardToBot({ request: request({ 'content-type': 'application/json', 'x-webhook-protocol': 'hmac-sha256', 'x-webhook-signature': signature, cookie: 'secret-cookie' }) }, '/webhooks/omniplex');
assert.equal(ok.status, 200);
assert.equal(seen[0].url, '/webhooks/omniplex', 'the same path reaches the bot (the trailing slash of the address is dropped)');
assert.equal(seen[0].method, 'POST');
assert.equal(seen[0].body.toString('utf8'), body, 'the body arrives byte for byte, so the signature still matches');
assert.equal(createHmac('sha256', 'secret').update(seen[0].body).digest('hex'), signature.slice(7), 'the signature the bot computes is the one of the list');
assert.equal(seen[0].headers['x-webhook-signature'], signature);
assert.equal(seen[0].headers['x-webhook-protocol'], 'hmac-sha256');
assert.equal(seen[0].headers.cookie, undefined, 'nothing else of the request is passed on');

const refused = await forwardToBot({ request: request({ 'content-type': 'application/json', 'x-webhook-signature': 'bad' }) }, '/webhooks/topgg');
assert.equal(refused.status, 401, 'the answer of the bot goes back as it is');
assert.equal(seen[1].url, '/webhooks/topgg');

const big = await forwardToBot({ request: request({ 'content-type': 'application/json' }, 'x'.repeat(101 * 1024)) }, '/webhooks/omniplex');
assert.equal(big.status, 413, 'a body that is too large is not passed on');
assert.equal(seen.length, 2);

bot.close();
process.env.PETTO_BOT_API_URL = 'http://127.0.0.1:1';
assert.equal((await forwardToBot({ request: request({ 'content-type': 'application/json' }) }, '/webhooks/omniplex')).status, 502, 'a bot that does not answer is a 502');
delete process.env.PETTO_BOT_API_URL;
assert.equal((await forwardToBot({ request: request({ 'content-type': 'application/json' }) }, '/webhooks/omniplex')).status, 503, 'no address of the bot is a 503');
console.log('Bot webhook proxy checks passed (the vote webhooks reach the bot with the body and the signature untouched).');
