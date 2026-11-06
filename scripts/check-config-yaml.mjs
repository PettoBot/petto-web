// Checks the configuration file of Config Management (src/utils/configYamlRender.ts): it is valid YAML whatever the rows hold (quotes, line breaks, long
// texts, empty and missing tables), every part the page reads is where the page looks for it, every module is there, and no secret is written.
// Run: node scripts/check-config-yaml.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const bundled = await build({ entryPoints: [`${root}src/utils/configYamlRender.ts`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const mod = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const { SECTIONS, renderConfigYaml, columnsOf } = mod;

// A real parser when the project has one around (the YAML library comes with the tools of the project); the structural check below always runs.
const require = createRequire(import.meta.url);
let parse = null;
for (const name of ['yaml', 'js-yaml']) {
  try { const lib = require(name); parse = name === 'yaml' ? (text) => lib.parse(text) : (text) => lib.load(text); break; } catch { /* next */ }
}

// Fake rows: every column with its default, plus text that is hard to write.
const hard = ["it's", 'two\nlines', 'a # not a comment', 'colon: inside', '  padded  ', 'ünï©ode 🎉', 'x'.repeat(500), '- dash', '"double"', '{ not: a map }', '', 'null', 'true', '123', ' sep'];
function rowOf(table, i) {
  const row = {};
  for (const [name, kind, fallback] of columnsOf({ table })) {
    if (kind === 'text') row[name] = hard[(i + name.length) % hard.length];
    else if (kind === 'list') row[name] = i % 2 ? ['1', "it's", 'b # c'] : [1, 2, 3];
    else if (kind === 'json') row[name] = { a: [1, 2, { b: "it's" }], text: 'two\nlines' };
    else if (kind === 'num') row[name] = i + 7;
    else if (kind === 'bool') row[name] = i % 2 === 0;
    else row[name] = fallback;
  }
  // Things that must never reach the file even if the table hands them over.
  row.webhook_token = 'SECRET-TOKEN-VALUE';
  row.api_key = 'SECRET-API-KEY';
  row.message_id = '999999999999999999';
  return row;
}
const data = {};
for (const section of SECTIONS) section.modules.forEach((m, n) => {
  const key = `${section.key}.${m.key}`;
  if (m.mode === 'one') data[key] = { rows: [rowOf(m.table, n)], total: 1 };
  else if (m.mode === 'count') data[key] = { rows: [{ guild_id: '1' }], total: 4 };
  else data[key] = n % 3 === 2 ? { rows: [], total: 0 } : { rows: [rowOf(m.table, n), rowOf(m.table, n + 1), { }], total: 1234 };
});
// A module whose table cannot be read, and one with nothing in it.
data['moderation.scam'] = { rows: null, total: null };
data['moderation.automod'] = { rows: [], total: 0 };

const guild = { prefix: "it's", prefixes: ['?', '>'], language: 'es', mute_role_id: '123456789012345678', bot_nickname: 'Pet\nto', bot_name_style: { a: 1 }, updated_at: '2026-01-01T00:00:00Z' };
const text = renderConfigYaml({ guildId: '900000000000000001', guildName: "Petto's\nLand", guild, data });
const empty = renderConfigYaml({ guildId: '900000000000000001', guildName: 'Empty', guild: null, data: {} });

for (const [label, yaml] of [['full', text], ['empty', empty]]) {
  // Structure: spaces only, two per level, no stray tabs, every line is a comment, a key, a list item or one of its fields.
  yaml.split('\n').forEach((l, i) => {
    assert.ok(!/\t/.test(l), `${label} line ${i + 1}: a tab`);
    if (!l.trim() || /^\s*#/.test(l)) return;
    assert.ok(/^( *)(- )?[A-Za-z0-9_]+:( .*)?$|^ *- \{\}$/.test(l), `${label} line ${i + 1}: not a key, a list item or a comment: ${l.slice(0, 80)}`);
    assert.equal(/^ */.exec(l)[0].length % 2, 0, `${label} line ${i + 1}: odd indent`);
  });
  assert.ok(!yaml.includes('SECRET-TOKEN-VALUE') && !yaml.includes('SECRET-API-KEY'), `${label}: a secret was written`);
  assert.ok(!/webhook_token|api_key|message_id:/.test(yaml), `${label}: a secret or state column was written`);
}

// Every part of the dashboard menu is a top-level key, in order, and every module is somewhere under it.
const topKeys = [...text.matchAll(/^([a-z_]+):/gm)].map((m) => m[1]);
for (const section of SECTIONS) assert.ok(topKeys.includes(section.key), `section ${section.key} missing`);
for (const key of ['guild_id', 'language', 'prefix', 'mute_role_id', 'bot_profile', 'updated_at']) assert.ok(topKeys.includes(key), `${key} missing`);

if (parse) {
  const doc = parse(text);
  const emptyDoc = parse(empty);
  assert.equal(doc.guild_id, '900000000000000001', 'ids stay text');
  assert.equal(doc.prefix, "it's", 'quotes survive');
  assert.deepEqual(doc.prefixes, ['?', '>'], 'lists are lists');
  assert.equal(doc.bot_profile.nickname, 'Pet\nto', 'line breaks survive');
  // The parts the page reads numbers from (DashConfigManagement.astro).
  const at = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  for (const path of ['moderation.antinuke.enabled', 'onboarding.welcome_channel_id', 'onboarding.leave_channel_id', 'onboarding.boost_channel_id',
    'automation.custom_commands_count', 'automation.autoresponders_count', 'automation.reaction_roles_count', 'automation.timers_count', 'automation.feeds_count',
    'logging.routed_events_count', 'tickets.support_types_count', 'leveling.rewards_count', 'design.embed_templates_count', 'design.image_cards_count', 'moderation.automod']) {
    assert.notEqual(at(doc, path), undefined, `${path} missing (the tiles of the page read it)`);
  }
  assert.equal(at(doc, 'automation.custom_commands_count'), 1234, 'the real total is written, not the shown rows');
  assert.equal(at(doc, 'moderation.scam'), null, 'a module that cannot be read is null');
  assert.ok(Array.isArray(at(doc, 'automation.custom_commands')), 'a list is a list');
  assert.equal(at(doc, 'giveaways.running_now'), 4, 'a count is a number');
  // A long text is shortened, and a text that looks like another type stays text.
  const longs = JSON.stringify(doc).match(/x{100,}/g) ?? [];
  assert.ok(longs.every((s) => s.length < 300), 'long texts are shortened');
  assert.equal(typeof at(doc, 'automation.custom_commands')[0].name, 'string', 'text stays text');
  // The empty file (nothing could be read) is still a file.
  assert.equal(emptyDoc.guild_id, '900000000000000001');
  assert.equal(emptyDoc.moderation.automod, null);
  assert.equal(emptyDoc.automation.custom_commands_count, null);
  // The tables hand back a state column and a token that never show up (checked above on the text).
} else {
  console.log('No YAML library around: the structure was checked, the parse was skipped.');
}

console.log(`Config YAML checks passed (${text.split('\n').length} lines${parse ? ', parsed' : ''}).`);
