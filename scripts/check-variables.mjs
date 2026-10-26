// Checks the built-in list of variables (src/data/variables.generated.json, a copy of the bot's registry): the three languages have the same
// groups and tokens, nothing is empty, and every variable that has a value outside of an event has a sample for the previews.
import fs from 'node:fs';
import assert from 'node:assert/strict';

const data = JSON.parse(fs.readFileSync(new URL('../src/data/variables.generated.json', import.meta.url), 'utf8'));
const shape = (lang) => data[lang].map((group) => `${group.id}:${group.vars.map((v) => v.tok).join(',')}`);
assert.deepEqual(shape('es'), shape('en'), 'Spanish has the same variables as English');
assert.deepEqual(shape('pt-BR'), shape('en'), 'Portuguese has the same variables as English');
for (const lang of Object.keys(data)) {
  for (const group of data[lang]) {
    assert.ok(group.label && group.vars.length, `${lang}: group ${group.id} has a label and variables`);
    for (const variable of group.vars) assert.ok(variable.tok.startsWith('{') && variable.desc, `${lang}: ${variable.tok} has a description`);
  }
}
const ids = data.en.map((group) => group.id);
for (const id of ['user', 'server', 'leveling', 'giveaway', 'sanction', 'starboard', 'poll', 'quest', 'rollout', 'verification', 'honeypot', 'counter', 'invites', 'date']) assert.ok(ids.includes(id), `the group ${id} is in the list`);

// A preview leaves a variable as written when it has no sample: the ones with a value of their own are listed in variableSamples.ts.
const samples = fs.readFileSync(new URL('../src/utils/variableSamples.ts', import.meta.url), 'utf8');
const DYNAMIC = /^\{(choose|range|args_from|imgcard|reactreply|timestamp:|newline|separator)/;
const missing = data.en.flatMap((group) => group.vars.map((v) => v.tok)).filter((tok) => !DYNAMIC.test(tok) && !samples.includes(tok.replace(/^\{|\}$/g, '')));
assert.deepEqual(missing, [], `variables without a sample: ${missing.join(' ')}`);
console.log(`check-variables: ${data.en.length} groups, ${data.en.reduce((n, g) => n + g.vars.length, 0)} variables in 3 languages, all with a sample`);
