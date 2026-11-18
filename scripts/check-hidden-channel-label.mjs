// Checks that a saved channel the bot cannot view is shown as "no access", not as a deleted channel: the bot keeps the ids (`hidden_channels`), the
// website reads them (Redis first, then a read of their own that never breaks the page) and the places that said "deleted channel" use one helper.
import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const snapshots = read('src/utils/guildSnapshots.ts');
assert.match(snapshots, /export async function readHiddenChannelIds/, 'the reader of the hidden ids');
assert.match(snapshots, /petto:snap:\$\{guildId\}[\s\S]*hidden_channels/, 'from the copy in Redis first');
assert.match(snapshots, /select=hidden_channels/, 'then from a read of its own: a bot without the column never breaks the copy of the server');
assert.ok(!/select=guild_id,name,icon[^`]*hidden_channels/.test(snapshots), 'the main read of the copy does not ask for it');

const label = read('src/utils/channelLabel.ts');
assert.match(label, /hidden\.has\(String\(id\)\) \? dt\('No access \(hidden channel\)'\) : dt\(goneKey\)/, 'no access for a hidden one, the old words otherwise');
assert.match(label, /catch \{\s*return new Set\(\);/, 'unknown means none are hidden');

for (const [file, gone] of [['DashFeeds', 'deleted channel'], ['DashHoneypot', 'Deleted channel'], ['DashPaginations', 'Deleted channel'], ['DashStats', 'Deleted or temporary channel'], ['DashLogging', 'A channel that is gone']]) {
  const text = read(`src/components/${file}.astro`);
  assert.match(text, /hiddenChannelSet\((guildId|String\(Astro\.params\.id \?\? ''\))\)/, `${file} knows the hidden channels`);
  assert.ok(text.includes(`, '${gone}')`), `${file} says no access through the helper`);
  assert.ok(!new RegExp(`dt\\('${gone}'\\)`).test(text), `${file} no longer calls a hidden channel deleted`);
}
for (const file of ['src/i18n/dash-es.ts', 'src/i18n/dash-pt.ts']) assert.ok(read(file).includes('"No access (hidden channel)":'), `${file} translates it`);
console.log('check-hidden-channel-label: the ids are read safely and five places say "no access" for a channel the bot cannot view.');
