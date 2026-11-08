// The team page (src/utils/team.ts): moving a person up or down, removing and adding, with the rows as the database really answers them:
// the id of a row is a bigint, which comes as text ("34"). Moving used to fail with "That request was not valid" because "34" is not 34.
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const out = await build({ entryPoints: [`${root}src/utils/team.ts`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const team = await import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);

process.env.PETTO_BOT_API_URL = 'http://bot.test';
process.env.PETTO_BOT_API_SECRET = 'secret';
const ID = (n) => `28556867563159${String(5000 + n)}`;
let rows = [
  { id: '31', position: 'owners', user_id: ID(1), sort_order: 1 },
  { id: '32', position: 'owners', user_id: ID(2), sort_order: 2 },
  { id: '33', position: 'programming', user_id: ID(3), sort_order: 1 },
  { id: '34', position: 'programming', user_id: ID(4), sort_order: 2 },
  { id: '35', position: 'programming', user_id: ID(5), sort_order: 3 },
];
const writes = [];
globalThis.fetch = async (url, init = {}) => {
  const path = String(url).replace('http://bot.test/rest/v1/', '');
  const method = init.method ?? 'GET';
  if (method === 'GET') return new Response(JSON.stringify(rows), { status: 200 });
  writes.push([method, path, init.body ? JSON.parse(init.body) : null]);
  const match = /^site_team\?id=eq\.(\d+)$/.exec(path);
  if (method === 'PATCH' && match) { const row = rows.find((r) => r.id === match[1]); if (row) row.sort_order = JSON.parse(init.body).sort_order; }
  if (method === 'DELETE' && match) rows = rows.filter((r) => r.id !== match[1]);
  if (method === 'POST') rows.push({ id: String(40 + rows.length), ...JSON.parse(init.body) });
  return new Response(null, { status: 204 });
};
const astro = {};
const order = (position) => [...rows].filter((r) => r.position === position).sort((a, b) => a.sort_order - b.sort_order || Number(a.id) - Number(b.id)).map((r) => r.user_id);

assert.deepEqual((await team.readTeamRows(astro)).map((row) => row.id), [31, 32, 33, 34, 35], 'the ids are numbers');

assert.deepEqual(await team.moveTeamMember(astro, 32, 'up'), { ok: true }, 'the second owner moves up');
assert.deepEqual(order('owners'), [ID(2), ID(1)], 'and is now first');
assert.deepEqual(await team.moveTeamMember(astro, 33, 'up'), { ok: true }, 'the first of a position moving up changes nothing');
assert.deepEqual(order('programming'), [ID(3), ID(4), ID(5)]);
assert.deepEqual(await team.moveTeamMember(astro, 34, 'down'), { ok: true }, 'the middle one moves down');
assert.deepEqual(order('programming'), [ID(3), ID(5), ID(4)]);
assert.deepEqual(await team.moveTeamMember(astro, 999, 'up'), { ok: false, error: 'invalid' }, 'a row that does not exist is refused');

assert.deepEqual(await team.removeTeamMember(astro, 31), { ok: true });
assert.deepEqual(order('owners'), [ID(2)]);
assert.deepEqual(await team.removeTeamMember(astro, 0), { ok: false, error: 'invalid' });
const added = await team.addTeamMembers(astro, 'owners', `<@${ID(9)}> ${ID(2)}`);
assert.deepEqual(added, { ok: true, added: 1, skipped: 1 }, 'a mention is added and the one that is there is skipped');
console.log('Team page checks passed (moving, removing and adding with the ids as the database sends them).');
