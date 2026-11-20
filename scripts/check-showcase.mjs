// Checks the cleaning of the servers of the carousel (src/utils/showcase.ts): only the fields the carousel draws, a picture only from the Discord CDN,
// the marks that exist, numbers that are numbers, no more than 15, and anything that is not a list gives an empty one.
// Run: node scripts/check-showcase.mjs
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const bundled = await build({ entryPoints: [`${root}src/utils/showcase.ts`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const { cleanShowcase, SHOWCASE_MAX } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);

const good = { id: '1414452131850879080', name: 'Petto', icon: 'https://cdn.discordapp.com/icons/1/a_x.gif?size=128', animated: true, members: 800, online: 90, badge: 'community-boosted' };
assert.deepEqual(cleanShowcase([good]), [good], 'a good server is kept as it is');
assert.deepEqual(cleanShowcase(null), []);
assert.deepEqual(cleanShowcase({ servers: [good] }), [], 'not a list');
assert.deepEqual(cleanShowcase(['x', 7, null, {}]), [], 'what does not look like a server is left out');
assert.deepEqual(cleanShowcase([{ ...good, id: 'abc' }]), [], 'an id that is not a Discord id');
assert.deepEqual(cleanShowcase([{ ...good, name: '   ' }]), [], 'a server with no name');
assert.deepEqual(cleanShowcase([{ ...good, members: -1 }, { ...good, members: 'many' }]), [], 'members that are not a number');
assert.equal(cleanShowcase([{ ...good, icon: 'https://evil.example/x.png' }])[0].icon, null, 'a picture only from the Discord CDN');
assert.equal(cleanShowcase([{ ...good, icon: 'https://evil.example/x.png' }])[0].animated, false, 'no picture, nothing animated');
assert.equal(cleanShowcase([{ ...good, online: 'x' }])[0].online, null, 'online that is not a number is unknown');
assert.equal(cleanShowcase([{ ...good, badge: 'verified' }])[0].badge, 'verified');
assert.equal(cleanShowcase([{ ...good, badge: '../../etc/passwd' }])[0].badge, null, 'only a badge that exists (it becomes a file name)');
assert.equal(cleanShowcase([{ ...good, badge: 7 }])[0].badge, null);
assert.equal(cleanShowcase([{ ...good, badge: undefined }])[0].badge, null, 'no badge');
assert.equal(cleanShowcase([{ ...good, name: 'x'.repeat(300) }])[0].name.length, 100, 'a long name is cut');
assert.equal(cleanShowcase([{ ...good, members: 1234.9 }])[0].members, 1234, 'whole numbers');
assert.deepEqual(Object.keys(cleanShowcase([{ ...good, owner: 'secret', invite: 'x' }])[0]).sort(), ['animated', 'badge', 'icon', 'id', 'members', 'name', 'online'], 'nothing else goes through');
const many = Array.from({ length: 40 }, (_, i) => ({ ...good, id: String(100000000000000 + i) }));
assert.equal(cleanShowcase(many).length, SHOWCASE_MAX);
assert.equal(SHOWCASE_MAX, 15);
console.log('Checked the servers of the carousel: the fields, the picture, the marks, the numbers and the limit of 15.');
