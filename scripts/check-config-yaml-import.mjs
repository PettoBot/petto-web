// Checks the import of the configuration file (src/utils/configYamlImport.ts): a file made from a server's rows gives a plan with nothing to
// change, a changed value is found and brought into range the way the pages do it, a wrong value is skipped and said so, lists and
// other-page settings are left out with a reason, a file of another server, a huge file and a malicious one are refused, and only the
// settings of the modules that are imported can ever be written.
// Run: node scripts/check-config-yaml-import.mjs
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url).pathname;
const bundle = async (entry) => {
  const out = await build({ entryPoints: [`${root}${entry}`], bundle: true, write: false, format: 'esm', platform: 'browser', logLevel: 'silent' });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
};
const { renderConfigYaml, SECTIONS } = await bundle('src/utils/configYamlRender.ts');
const { buildImportPlan, publicPlan, parseConfigFile, isShortenedCopy, MAX_FILE_BYTES } = await bundle('src/utils/configYamlImport.ts');
const { automodNumber, AUTOMOD_NUMBERS } = await bundle('src/utils/automodLimits.ts');
const { readConfigForm } = await bundle('src/utils/levelingForm.ts');
const { CONFIG_SCHEMA } = await bundle('src/utils/configYamlSchema.ts');

const GUILD = '900000000000000001';
const ROLE = '910000000000000001';
const CHANNEL = '920000000000000001';
const rows = {
  guilds: { guild_id: GUILD, prefix: '!', prefixes: ['!', 'petto'], language: 'es', mute_role_id: ROLE },
  automod_config: { word_filter_enabled: true, word_filter_action: 'mute', banned_words: ['spoiler', 'gift'], max_mentions: 8, immune_role_ids: [ROLE], exempt_channel_ids: [CHANNEL], allowed_invite_codes: ['abc'], caps_percent: 80 },
  level_config: { enabled: true, xp_min: 10, xp_max: 30, cooldown_seconds: 45, notify_mode: 'channel', notify_channel_id: CHANNEL, notify_message: 'GG {user} {level}', ignored_channel_ids: [CHANNEL], role_mode: 'all', voice_enabled: true, rank_style: 'both', min_message_chars: 5, xp_multiplier: 1.5, multiplier_mode: 'stack', vote_boost_enabled: false, no_xp_role_ids: [ROLE] },
  counting_config: { enabled: true, channel_id: CHANNEL, saves_max: 3, react_ok: '👍' },
  birthday_config: { enabled: true, channel_id: CHANNEL, role_id: ROLE, hour: 10, utc_offset_minutes: -360, message: 'Happy {user}' },
};
const known = { roles: new Set([ROLE]), channels: new Set([CHANNEL]) };

// The file as the page writes it.
const data = {};
const tableOf = { 'moderation.automod': 'automod_config', 'leveling.settings': 'level_config', 'community.counting': 'counting_config', 'community.birthdays': 'birthday_config' };
for (const section of SECTIONS) for (const m of section.modules) {
  const key = `${section.key}.${m.key}`;
  if (m.mode === 'one') data[key] = { rows: tableOf[key] ? [rows[tableOf[key]]] : [{}], total: 1 };
  else if (m.mode === 'count') data[key] = { rows: [{}], total: 0 };
  else data[key] = { rows: [], total: 0 };
}
const file = renderConfigYaml({ guildId: GUILD, guildName: 'Test', guild: rows.guilds, data });
const plan = (yaml, extra = {}) => buildImportPlan({ yaml, guildId: GUILD, rows, known, ...extra });
const ok = (p) => { assert.ok(p.ok, p.ok ? '' : JSON.stringify(p.error)); return p; };
const mod = (p, id) => p.modules.find((m) => m.id === id);
const editAfter = (text, marker, from, to) => { const at = text.indexOf(marker); assert.ok(at >= 0, `no ${marker}`); const i = text.indexOf(from, at); assert.ok(i >= 0, `no "${from}" after ${marker}`); return text.slice(0, i) + to + text.slice(i + from.length); };
const edit = (text, from, to) => { assert.ok(text.includes(from), `the file has no "${from}"`); return text.replace(from, to); };

// 1. A round trip changes nothing and finds nothing wrong.
const round = ok(plan(file));
assert.equal(round.totals.changes, 0, `round trip: ${JSON.stringify(round.modules.filter((m) => m.changes.length).map((m) => [m.id, m.changes]))}`);
assert.equal(round.totals.invalid, 0, `round trip invalid: ${JSON.stringify(round.modules.flatMap((m) => m.invalid))}`);
assert.equal(round.writes.length, 0, 'a round trip writes nothing');
assert.ok(round.totals.unchanged > 60, 'the settings were read');
for (const id of ['guild', 'automod', 'leveling', 'counting', 'birthdays']) assert.ok(mod(round, id), `${id} was checked`);
// Lists and settings of other pages are left out, with their reason, and nothing in a file written by the page is unknown.
assert.ok(round.ignored.some((i) => i.path === 'automation.custom_commands' && i.reason.key === 'Lists are not imported yet.'), 'lists are left out');
assert.ok(round.ignored.some((i) => i.path === 'moderation.antinuke' && i.reason.key === 'Set from its own page of the dashboard.'), 'other modules are left out');
assert.ok(round.ignored.some((i) => i.path === 'bot_profile'), 'the bot profile is left out');
assert.deepEqual(round.unknown, [], 'a file the page wrote has nothing unknown');

// 2. Changed values are found and written.
let changed = file;
changed = edit(changed, '  max_mentions: 8', '  max_mentions: 12');
changed = edit(changed, 'caps_percent: 80', 'caps_percent: 90');
changed = edit(changed, "prefixes: ['!', 'petto']", "prefixes: ['?', 'bot']");
changed = edit(changed, '  xp_min: 10', '  xp_min: 12');
changed = edit(changed, '  hour: 10', '  hour: 7');
const c = ok(plan(changed));
assert.equal(c.totals.changes, 5, JSON.stringify(c.modules.map((m) => m.changes.map((x) => x.setting))));
assert.deepEqual(mod(c, 'automod').changes.map((x) => [x.setting, x.from, x.to]).sort(), [['caps_percent', 80, 90], ['max_mentions', 8, 12]]);
assert.deepEqual(mod(c, 'guild').changes[0].to, ['?', 'bot']);
const write = (p, id) => p.writes.find((w) => w.id === id);
assert.deepEqual(write(c, 'automod').parts[0].row, { max_mentions: 12, caps_percent: 90 }, 'only what changed is written');
assert.deepEqual(write(c, 'guild').parts, [{ row: { prefix: '?', prefixes: ['?', 'bot'] }, after: 'prefix' }]);
assert.deepEqual(write(c, 'leveling').parts[0].row, { xp_min: 12 });
assert.deepEqual(write(c, 'birthdays').parts[0].row, { hour: 7 });

// 3. Out-of-range numbers are brought into range the way the pages do it (and the plan says so); wrong values are skipped.
const wild = ok(plan(edit(edit(edit(edit(edit(file, '  max_mentions: 8', '  max_mentions: 500'), '  hour: 10', '  hour: 31'), 'word_filter_action: \'mute\'', "word_filter_action: 'explode'"), '  enabled: true  ', '  enabled: yes!!  ').replace('saves_max: 3', 'saves_max: 99'), 'caps_percent: 80', "caps_percent: 'a lot'")));
assert.equal(mod(wild, 'automod').changes.find((x) => x.setting === 'max_mentions').to, 50, 'clamped like the page');
assert.ok(mod(wild, 'automod').changes.find((x) => x.setting === 'max_mentions').note, 'and says so');
assert.equal(mod(wild, 'counting').changes.find((x) => x.setting === 'saves_max').to, 5);
assert.ok(mod(wild, 'birthdays').invalid.some((x) => x.setting === 'hour'), 'an hour out of range is refused, as the page refuses it');
assert.ok(mod(wild, 'automod').invalid.some((x) => x.setting === 'word_filter_action'), 'a value that is not a choice is refused');
assert.ok(mod(wild, 'automod').invalid.some((x) => x.setting === 'caps_percent'), 'text where a number goes is refused');
assert.ok(!('caps_percent' in write(wild, 'automod').parts[0].row) && !('word_filter_action' in write(wild, 'automod').parts[0].row), 'a refused setting is not written, the rest is');
// The AutoMod limits are the page's: the same function clamps both.
for (const name of Object.keys(AUTOMOD_NUMBERS)) for (const raw of [-5, 0, 1, 7, 49.5, 51, 100000, 'x', null]) {
  const [min, max, fallback, whole] = AUTOMOD_NUMBERS[name];
  const n = Number(raw ?? fallback);
  assert.equal(automodNumber(name, raw), Math.max(min, Math.min(max, (whole ? Math.floor(n) : n) || fallback)));
}
// Leveling goes through the page's own form reader: what is planned is what the page would save.
const form = new FormData(); form.set('xp_min', '99999999999'); form.set('xp_max', '5');
const level = ok(plan(edit(edit(file, '  xp_min: 10', '  xp_min: 99999999999'), '  curve_a: 1', '  curve_a: 2.5')));
assert.equal(mod(level, 'leveling').changes.find((x) => x.setting === 'xp_min').to, readConfigForm(form).xp_min, 'same clamp as the leveling form');
assert.equal(mod(level, 'leveling').changes.find((x) => x.setting === 'curve_a').to, 2.5);
const notInt = ok(plan(edit(file, '  xp_max: 30', '  xp_max: 30.5')));
assert.ok(mod(notInt, 'leveling').invalid.some((x) => x.setting === 'xp_max'), 'a fraction where a whole number goes is refused');

// 4. Ids: quoted, in this server, or left out.
const ids = ok(plan(editAfter(edit(file, `immune_role_ids: ['${ROLE}']`, `immune_role_ids: ['${ROLE}', '999999999999999999']`), '  counting:', `channel_id: '${CHANNEL}'`, `channel_id: '999999999999999999'`)));
assert.ok(mod(ids, 'automod').warnings.some((x) => x.setting === 'immune_role_ids'), 'a role that is not in the server is left out of a list');
assert.deepEqual(mod(ids, 'automod').changes.filter((x) => x.setting === 'immune_role_ids'), [], 'and the list stays as it is');
assert.ok(mod(ids, 'counting').invalid.some((x) => x.setting === 'channel_id'), 'a channel that is not in the server is refused');
const bigId = ok(plan(editAfter(file, '  counting:', `channel_id: '${CHANNEL}'`, 'channel_id: 920000000000000001')));
assert.ok(mod(bigId, 'counting').invalid.some((x) => x.setting === 'channel_id'), 'an id that is not between quotes is refused');

// 5. The file itself: another server, empty, too big, not YAML, aliases, tags, deep, a list.
assert.equal(plan(edit(file, `guild_id: '${GUILD}'`, "guild_id: '1234567890123456789'")).ok, false, 'a file of another server is refused');
assert.equal(plan('').ok, false);
assert.equal(plan('   \n').ok, false);
assert.equal(plan('x'.repeat(MAX_FILE_BYTES + 1)).ok, false, 'a huge file is refused');
assert.equal(plan('a: [unclosed').ok, false, 'broken YAML is refused');
assert.equal(plan('- a\n- b').ok, false, 'a list is not a configuration');
assert.equal(plan('just text').ok, false);
assert.equal(plan('a: &x [1,2]\nb: *x\n').ok, false, 'aliases are refused');
const bomb = ['a: &a ["x","x","x","x","x","x","x","x","x"]', ...'bcdefghi'.split('').map((k, i) => `${k}: &${k} [${Array(9).fill(`*${'abcdefgh'[i]}`).join(',')}]`)].join('\n');
assert.equal(plan(bomb).ok, false, 'an alias bomb is refused');
assert.equal(plan('moderation:\n  automod: !!python/object:os.system "x"\n').ok, false, 'tags are refused');
assert.equal(plan('base: &b {x: 1}\nmoderation:\n  automod:\n    <<: *b\n').ok, false, 'merge keys are refused');
assert.equal(plan('a: 1\na: 2\n').ok, false, 'a repeated key is refused');
let deep = 'x'; for (let i = 0; i < 30; i += 1) deep = `{a: ${deep}}`;
assert.equal(plan(`moderation: ${deep}`).ok, false, 'a file nested too deep is refused');
assert.equal(plan(`moderation: [${Array(25000).fill('1').join(',')}]`).ok, false, 'a file with too many values is refused');
assert.equal(parseConfigFile(file).ok, true);

// 6. Unknown things are listed and ignored; other-page settings never reach a write.
const strange = ok(plan(`${file}\nmystery: 1\nmoderation2:\n  a: 1\n`.replace('\nmoderation2', '\nmoderation2')));
assert.ok(strange.unknown.includes('mystery') && strange.unknown.includes('moderation2'), 'unknown keys are listed');
const sneaky = ok(plan(edit(edit(file, '  word_filter_enabled: true', '  word_filter_enabled: true\n    webhook_token: \'abc\'\n    guild_id: \'1\'\n    id: 7'), 'allowed_link_domains: []', "allowed_link_domains: ['evil.test']")));
const written = new Set(sneaky.writes.flatMap((w) => w.parts.flatMap((part) => Object.keys(part.row))));
for (const name of ['webhook_token', 'guild_id', 'id', 'allowed_link_domains']) assert.ok(!written.has(name), `${name} can never be written`);
assert.ok(sneaky.unknown.some((p) => p.endsWith('webhook_token')), 'it is said to be unknown');
assert.ok(sneaky.ignored.some((p) => p.path === 'moderation.automod.allowed_link_domains'), 'a setting of another page is left out');
// Every column an import can write is a real column of its table.
for (const [table, names] of Object.entries({ automod_config: ['word_filter_enabled', 'max_mentions', 'immune_role_ids'], counting_config: ['channel_id', 'saves_max'], birthday_config: ['hour', 'message'], level_config: ['xp_min', 'vote_boost_enabled'], guilds: ['prefix', 'language'] })) {
  for (const name of names) assert.ok(CONFIG_SCHEMA[table].some((spec) => spec[0] === name), `${table}.${name} is a column`);
}

// 7. A module that could not be read is not touched; the plan can be sent to the browser without the rows to write.
const blind = ok(plan(file, { rows: { ...rows, automod_config: undefined } }));
assert.ok(mod(blind, 'automod').unreadable && mod(blind, 'automod').changes.length === 0, 'an unreadable module is reported and left alone');
assert.ok(!blind.writes.some((w) => w.id === 'automod'));
assert.ok(!('writes' in publicPlan(c)), 'the rows to write stay on the server');
assert.ok(JSON.stringify(publicPlan(c)).length < 20000, 'the plan is small');

// 8. A shortened copy never overwrites the saved text.
const long = 'x'.repeat(260);
const shortRows = { ...rows, level_config: { ...rows.level_config, notify_message: long } };
const shortFile = renderConfigYaml({ guildId: GUILD, guildName: 'Test', guild: rows.guilds, data: { ...data, 'leveling.settings': { rows: [shortRows.level_config], total: 1 } } });
const short = ok(buildImportPlan({ yaml: shortFile, guildId: GUILD, rows: shortRows, known }));
assert.equal(short.totals.changes, 0, `a shortened text is not written back: ${JSON.stringify(short.modules.flatMap((m) => m.changes))}`);
assert.equal(isShortenedCopy('abc…', 'abcdef'), true);
assert.equal(isShortenedCopy('abc…', 'xyz'), false);
assert.equal(isShortenedCopy('abc', 'abcdef'), false);

// 9. Every text the import can say is in both catalogs (these texts are keys inside the plan, so the usual scan of dt() calls does not see them).
const catalog = (name) => {
  const keys = new Set();
  for (const m of readFileSync(`${root}src/i18n/${name}`, 'utf8').matchAll(/^\s*("(?:[^"\\]|\\.)*"):/gm)) keys.add(JSON.parse(m[1]));
  return keys;
};
const [es, pt] = [catalog('dash-es.ts'), catalog('dash-pt.ts')];
const emitted = new Set();
const source = readFileSync(`${root}src/utils/configYamlImport.ts`, 'utf8');
for (const re of [/\b(?:bad|fail)\(\s*'((?:[^'\\]|\\.)*)'/g, /\bkey:\s*'((?:[^'\\]|\\.)*)'/g, /\btitle: '((?:[^'\\]|\\.)*)'/g, /'((?:Server|Leveling) settings)'/g]) for (const m of source.matchAll(re)) emitted.add(m[1].replace(/\\'/g, "'"));
for (const m of readFileSync(`${root}src/utils/guildPrefixes.ts`, 'utf8').matchAll(/\bkey:\s*'((?:[^'\\]|\\.)*)'/g)) emitted.add(m[1].replace(/\\'/g, "'"));
assert.ok(emitted.size > 40, 'the texts were found');
for (const key of emitted) { assert.ok(es.has(key), `missing in Spanish: ${key}`); assert.ok(pt.has(key), `missing in Portuguese: ${key}`); }

console.log(`Config YAML import checks passed (${round.totals.unchanged} settings read back unchanged, ${round.ignored.length} left out with a reason).`);
