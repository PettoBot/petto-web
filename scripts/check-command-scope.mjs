// Where a custom command works (the commands page of the dashboard): the form is read into lists of channels and roles (allowed and blocked), NSFW and restricted; ids that are
// not ids are dropped; the other options of a command are kept when this part is saved; and the page, the fields and the words exist.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(path.join(root, 'src/utils/commandScope.ts'), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const mod = { exports: {} };
new Function('module', 'exports', 'require', js)(mod, mod.exports, createRequire(import.meta.url));
const { scopeOf, scopeFromForm, withScope, isScoped, MAX_SCOPE_IDS } = mod.exports;

const A = '100000000000000001'; const B = '100000000000000002'; const R = '200000000000000001';
const formOf = (entries) => { const form = new FormData(); for (const [key, value] of entries) form.append(key, value); return form; };

// Nothing saved: everywhere, for everybody.
for (const raw of [null, undefined, {}, [], 'x', 5]) assert.equal(isScoped(scopeOf(raw)), false);
// The form: lists, switches, and the channel of the answer (restricted needs one).
const scope = scopeFromForm(formOf([['scope_allow_channels', A], ['scope_allow_channels', B], ['scope_block_channels', B], ['scope_allow_roles', R], ['scope_block_roles', R], ['scope_nsfw', 'on'], ['scope_restricted', 'on'], ['scope_restricted_channel', A]]));
assert.deepEqual(scope, { allowChannels: [A, B], blockChannels: [B], allowRoles: [R], blockRoles: [R], nsfw: true, restricted: true, restrictedChannel: A });
assert.equal(isScoped(scope), true);
assert.equal(scopeFromForm(formOf([['scope_restricted', 'on']])).restricted, false, 'restricted with no channel is not restricted');
assert.equal(isScoped(scopeFromForm(formOf([['scope_restricted', 'on']]))), false);
assert.equal(scopeFromForm(formOf([['scope_restricted_channel', A]])).restricted, false, 'the switch is off');
assert.equal(scopeFromForm(formOf([['scope_restricted_channel', A]])).restrictedChannel, A, 'the channel is kept for later');
// Ids that are not ids are dropped, repeats too, and there is a limit.
assert.deepEqual(scopeFromForm(formOf([['scope_allow_channels', 'x'], ['scope_allow_channels', A], ['scope_allow_channels', A], ['scope_allow_channels', '12']])).allowChannels, [A]);
assert.equal(scopeFromForm(formOf(Array.from({ length: 40 }, (_, i) => ['scope_allow_roles', String(200000000000000100n + BigInt(i))]))).allowRoles.length, MAX_SCOPE_IDS);
// Saving keeps what else the options hold (the lists of a command in code, where its mistakes go).
const existing = { errorsAsResponse: false, errorChannel: B, roles: { mode: 'ignore', ids: [R] }, channels: { mode: 'only', ids: [A] }, nsfw: true, allowChannels: [B] };
const saved = withScope(existing, scopeFromForm(formOf([['scope_block_roles', R]])));
assert.deepEqual([saved.errorsAsResponse, saved.errorChannel, saved.roles, saved.channels], [false, B, existing.roles, existing.channels]);
assert.deepEqual([saved.blockRoles, saved.allowChannels, saved.nsfw], [[R], [], false], 'the fields of the form replace the old ones');
assert.deepEqual(scopeOf(withScope(null, scope)), scope, 'what is written is what is read');
assert.equal(existing.nsfw, true, 'the options given are not changed');

// The page, the fields and the words.
const page = readFileSync(path.join(root, 'src/pages/dash/guild/[id]/automation.astro'), 'utf8');
assert.match(page, /action === 'command_scope'/, 'the page saves the scope of a command');
assert.match(page, /scopeFromForm\(form\)/, 'and a new command carries it');
// The page loads the channels and the roles of the server for this section (without them the lists of the fields say "No matches").
for (const list of ['WITH_CHANNELS', 'WITH_ROLES']) assert.match(page, new RegExp(`const ${list} = \\[[^\\]]*'custom-commands'`), `${list} has the custom commands section`);
const dash = readFileSync(path.join(root, 'src/components/DashAutomation.astro'), 'utf8');
assert.match(dash, /<CommandScopeFields[^>]*idPrefix="ax1-new-scope"/, 'the form of a new command has the fields');
assert.match(dash, /name="action" value="command_scope"/, 'and each command of the list too');
const fields = readFileSync(path.join(root, 'src/components/CommandScopeFields.astro'), 'utf8');
for (const name of ['scope_allow_channels', 'scope_block_channels', 'scope_allow_roles', 'scope_block_roles', 'scope_nsfw', 'scope_restricted', 'scope_restricted_channel']) assert.ok(fields.includes(`name="${name}"`), `the field ${name}`);
const words = [...new Set([...(dash + fields).matchAll(/dt\('((?:Where it works|Everywhere, for everybody|Allowed channels|Blocked channels|Allowed roles|Blocked roles|It only works[^']*|Restricted|When somebody who is not a moderator[^']*|Answer channel for restricted use|\{n\} (?:allowed|blocked) (?:channel|role)\(s\)|Save where it works))'/g)].map((m) => m[1]))];
assert.ok(words.length >= 14, 'the words of the fields were found');
for (const file of ['dash-es.ts', 'dash-pt.ts']) {
  const text = readFileSync(path.join(root, 'src/i18n', file), 'utf8');
  for (const word of words) assert.ok(text.includes(`  ${JSON.stringify(word)}:`), `${file} has "${word}"`);
}
// A fold of the dashboard fades in once: the base stylesheet animation of its content is off inside the dashboard (the script adds .is-opening), so the content does not restart.
const layout = readFileSync(path.join(root, 'src/components/DashGuildLayout.astro'), 'utf8');
assert.match(layout, /\.dgl-content details:not\(\[data-no-anim\]\) > \*:not\(summary\) \{ animation: none; \}/, 'the content of a fold of the dashboard does not run the base fade as well');
assert.ok(layout.indexOf('.dgl-content details:not([data-no-anim]) > *:not(summary) { animation: none; }') < layout.indexOf('.dgl-content details.is-opening > *:not(summary)'), 'the base animation is turned off before .is-opening sets its own');
console.log('Checked where a custom command works: the form, the saved options, the page, the fields and the words in three languages.');
