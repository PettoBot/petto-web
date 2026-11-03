// Checks the rows of the commands page (src/data/commandCatalog.ts): every subcommand of a command, and every subcommand of a group, is a row of its own
// with its full name (`ticket close`, `ticket panel create`), its own description and arguments, and the slash form when there is one; a command without
// subcommands is one row; the actions of /action stay one row each (`!hug [user]` with `/action love hug`); and no command that has subcommands is also a row of its own.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';

const read = (name) => fs.readFileSync(new URL(`../src/data/${name}`, import.meta.url), 'utf8');
const generated = JSON.parse(read('commands.generated.json'));
const load = (source, imports) => {
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  new Function('module', 'exports', 'require', outputText)(module, module.exports, (id) => {
    assert.ok(id in imports, `unexpected import ${id}`);
    return imports[id];
  });
  return module.exports;
};
const { commandText } = load(read('commandText.ts'), {});
const catalog = load(read('commandCatalog.ts'), { './commands.generated.json': { default: generated }, './commandText': { commandText } });
const categories = ['moderation', 'tickets', 'leveling', 'giveaways', 'automation', 'community', 'onboarding', 'logging', 'info', 'setup', 'roleplay'];

for (const lang of ['en', 'es', 'pt-BR']) {
  const rows = categories.flatMap((id) => catalog.commandRows(id, lang));
  const byName = new Map(rows.map((row) => [row[0], row]));
  assert.ok(rows.length > 700, `${lang}: every subcommand is a row (${rows.length})`);
  for (const row of rows) assert.ok(row[1] && row[2], `${lang}: "${row[0]}" has a syntax and a description`);

  // Every command with subcommands is only its subcommands, and each one has its own row.
  const listed = new Set(catalog.catalogCommands(lang).map((command) => command.name));
  const withLeaves = generated.filter((command) => listed.has(command.name) && command.leaves?.length && !command.integration && command.name !== 'action');
  assert.ok(withLeaves.length > 90, 'many commands have subcommands');
  for (const command of withLeaves) {
    if (!byName.has(command.name) || command.leaves.every((leaf) => leaf.path.join(' ') !== command.name)) assert.ok(!byName.has(command.name), `${lang}: "${command.name}" has subcommands, so it is not a row of its own`);
    for (const leaf of command.leaves) {
      const name = `${command.name} ${leaf.path.join(' ')}`;
      const row = byName.get(name);
      assert.ok(row, `${lang}: "${name}" is a row`);
      assert.ok(row[1].startsWith(`!${name}`), `${lang}: "${name}" is written with its full name (${row[1]})`);
      assert.equal(row[2], leaf.desc[lang], `${lang}: "${name}" has its own description`);
      if (command.slash) assert.ok(row[3].includes(`/${name}`), `${lang}: "${name}" shows its slash form`);
      for (const arg of leaf.args.slice(0, 6)) assert.ok(row[1].includes(arg.required ? `<${arg.name}>` : `[${arg.name}]`), `${lang}: "${name}" shows its argument ${arg.name}`);
    }
  }
  const ticketClose = byName.get('ticket close');
  assert.deepEqual([ticketClose[0], ticketClose[1]], ['ticket close', '!ticket close [reason]']);
  assert.ok(byName.has('ticket open') && byName.has('ticket add') && byName.has('ticket panel create'), 'ticket open, add and a subcommand of a group');
  assert.ok(!byName.has('ticket'), `${lang}: "ticket" alone is not a row`);
  assert.notEqual(byName.get('ticket close')[2], byName.get('ticket open')[2], 'each subcommand has its own text');

  // The commands that have no subcommands stay one row, with their own arguments.
  const plain = generated.filter((command) => listed.has(command.name) && !command.leaves && !command.integration && !command.actions);
  for (const command of plain) assert.ok(byName.has(command.name), `${lang}: "${command.name}" is one row`);
  assert.ok(plain.length > 20, `${lang}: commands without subcommands are one row each`);
  assert.ok(byName.has('rank') && /^[!/]rank/.test(byName.get('rank')[1]), 'rank is one row');

  // The actions of /action: one row each, `!hug [user]`, with `/action love hug` next to it.
  const act = generated.find((command) => command.name === 'action');
  for (const action of act.actions) {
    const row = byName.get(action.name);
    assert.ok(row, `${lang}: the action ${action.name} is a row`);
    assert.equal(row[1], `!${action.name} [user]`);
    assert.ok(row[3].includes(`/action ${action.group} ${action.name}`), `${lang}: ${action.name} shows /action ${action.group} ${action.name}`);
  }
  assert.ok(![...byName.keys()].some((name) => name.startsWith('action ')), 'the groups of /action are not rows');

  // A row is a name nobody else has (the page gives each one its anchor).
  assert.equal(byName.size, rows.length, `${lang}: no row name is repeated`);
}
// Every command of the bot has a category and a description in the three languages, so it shows in the commands page and the home page counter (music has no category in this page yet, so it is the one exception).
// The leaves of every command carry a description in the three languages (catalogProblems also lists commands nobody gave a category yet).
assert.deepEqual(catalog.catalogProblems().filter((problem) => /has no description in|path of|has no category|has no translated description/.test(problem) && !problem.startsWith('"music"')), []);
console.log(`check-command-rows: ${categories.flatMap((id) => catalog.commandRows(id, 'en')).length} rows in the commands page`);
