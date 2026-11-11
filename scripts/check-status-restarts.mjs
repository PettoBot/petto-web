// Checks how the website writes down its own restarts (src/utils/statusMonitor.ts: readRestarts and recordRestart), with a replaced fetch and database.
// The rule that forgives them is checked in check-status-days.mjs. The TypeScript is compiled for this check with esbuild.
// Run: node scripts/check-status-restarts.mjs
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const dir = mkdtempSync(join(tmpdir(), 'petto-status-'));
try {
  const outfile = join(dir, 'statusMonitor.mjs');
  await build({
    entryPoints: [new URL('../src/utils/statusMonitor.ts', import.meta.url).pathname], bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent',
    define: { __DIRECT_DB__: 'false' },
  });
  process.env.PETTO_BOT_API_URL = 'http://database.test';
  process.env.PETTO_BOT_API_SECRET = 'secret-for-the-check';
  const load = (tag) => import(`${pathToFileURL(outfile).href}?${tag}`);

  const DAY = 86_400_000;
  const now = Date.UTC(2026, 10, 11, 12, 0, 0);
  let store = null; // the value of bot_settings
  let posts = 0;
  let failWrites = false;
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    const target = String(url);
    if (!target.startsWith('http://database.test/rest/v1/bot_settings')) throw new Error(`unexpected request ${target}`);
    if ((init.method ?? 'GET') === 'POST') {
      posts += 1;
      if (failWrites) return new Response('{}', { status: 500 });
      store = JSON.parse(init.body).value;
      return new Response(null, { status: 201 });
    }
    return new Response(JSON.stringify(store === null ? [] : [{ value: store }]), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const first = await load('a');
    assert.deepEqual(await first.readRestarts({}), [], 'nothing written yet');
    store = 'not json';
    assert.deepEqual(await first.readRestarts({}), [], 'a value that cannot be read is no restarts');
    store = '{"a":1}';
    assert.deepEqual(await first.readRestarts({}), [], 'not a list is no restarts');
    store = JSON.stringify(['2026-11-10T10:00:00.000Z', 'nonsense']);
    assert.deepEqual(await first.readRestarts({}), [Date.parse('2026-11-10T10:00:00.000Z')], 'what is not a date is left out');

    // Writing down a start: it is added to the list, once for each process.
    store = JSON.stringify(['2026-11-10T10:00:00.000Z']);
    const boot = now - 5 * 60_000;
    await first.recordRestart({}, now, boot);
    assert.deepEqual(JSON.parse(store), ['2026-11-10T10:00:00.000Z', new Date(boot).toISOString()]);
    assert.equal(posts, 1);
    await first.recordRestart({}, now, boot);
    await first.recordRestart({}, now, boot + 1);
    assert.equal(posts, 1, 'a process writes its start only once');

    // Old ones go (the retention of the checks) and the list has a limit.
    const second = await load('b');
    const old = new Date(now - 101 * DAY).toISOString();
    store = JSON.stringify([old, ...Array.from({ length: 80 }, (_, index) => new Date(now - (index + 1) * 3_600_000).toISOString())]);
    await second.recordRestart({}, now, now - 1000);
    const written = JSON.parse(store);
    assert.ok(!written.includes(old), 'a restart older than the retention is dropped');
    assert.equal(written.length, 60, 'at most 60 are kept');
    assert.equal(written.at(-1), new Date(now - 1000).toISOString(), 'the newest is the last');

    // A database that refuses the write must not stop the status cycle: it is a warning and the next round tries again.
    const third = await load('c');
    failWrites = true;
    const warnings = [];
    const realWarn = console.warn;
    console.warn = (...args) => warnings.push(args.join(' '));
    try { await third.recordRestart({}, now, now); await third.recordRestart({}, now, now); } finally { console.warn = realWarn; }
    assert.equal(warnings.length, 2, 'a write that failed is said, and tried again at the next round');
    failWrites = false;
    posts = 0;
    await third.recordRestart({}, now, now);
    assert.equal(posts, 1, 'and written when the database answers again');
  } finally {
    globalThis.fetch = realFetch;
  }
  console.log('Status restart checks passed (reading, writing once per process, the retention and the limit, a refused write).');
} finally {
  rmSync(dir, { recursive: true, force: true });
}
