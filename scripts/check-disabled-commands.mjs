// Checks the names a rule of Disabled commands can take (src/utils/disabledCommands.ts): a command by its name or an alias, and every
// interaction action of /act (`hug`, and `hf` for `highfive`) saved under the name of the action, the same key the bot's
// `!disablecommand hug` saves, so the dashboard and the bot write and read the same rules.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import ts from 'typescript';

const generated = JSON.parse(fs.readFileSync(new URL('../src/data/commands.generated.json', import.meta.url), 'utf8'));
const source = fs.readFileSync(new URL('../src/utils/disabledCommands.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
const module = { exports: {} };
// The file only imports the generated list of commands: give it the one on disk.
new Function('module', 'exports', 'require', outputText)(module, module.exports, (id) => {
  assert.ok(id.endsWith('commands.generated.json'), `unexpected import ${id}`);
  return { default: generated };
});
const { realCommandName, readCommandNames, disableableCommands } = module.exports;

const act = generated.find((command) => command.name === 'act');
assert.ok(act?.actions?.length >= 79, '/act brings its actions in the generated list');

// Every action is a name a rule can have, and is in the suggestions.
for (const action of act.actions) {
  assert.equal(realCommandName(action.name), action.name, `${action.name} is an action a rule can name`);
  assert.equal(realCommandName(`!${action.name}`), action.name, `!${action.name} with the prefix`);
  assert.ok(disableableCommands.includes(action.name), `${action.name} is in the suggestions`);
  for (const alias of action.aliases) assert.equal(realCommandName(alias), action.name, `${alias} is the action ${action.name}, the key the bot saves`);
}
assert.equal(realCommandName('hf'), 'highfive');
assert.equal(realCommandName('lol'), 'laugh');
assert.equal(realCommandName('act'), 'act', 'the whole command can be turned off too');
assert.ok(disableableCommands.includes('act'));
assert.equal(realCommandName('nothing-like-this'), null, 'a word that is no command or action is unknown');

// Reading what is typed: actions and commands together, without repeats, and the unknown ones told.
assert.deepEqual(readCommandNames('hug hf !pat, rank banana'), { names: ['hug', 'highfive', 'pat', 'rank'], unknown: ['banana'], refused: [] });
assert.deepEqual(readCommandNames('hug, hello').names, ['hug', 'hi'], 'an alias of an action is the action');
assert.deepEqual(readCommandNames('help disablecommand').refused.sort(), ['disablecommand', 'help'], 'the protected commands are still refused');
console.log(`check-disabled-commands: ${act.actions.length} actions can be named by a rule, with the same keys as the bot`);
