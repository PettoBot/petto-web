import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const botRoot = path.resolve(process.argv[2] ?? process.env.PETTO_BOT_DIR ?? path.join(here, '../../petto bot 1'));
const commandsDir = path.join(botRoot, 'src', 'commands');
if (!fs.existsSync(commandsDir)) {
  console.error(`Bot commands folder not found: ${commandsDir}\nUsage: npm run sync:commands -- <path to petto-bot>`);
  process.exit(1);
}

const require = createRequire(path.join(botRoot, 'package.json'));
const discordPath = require.resolve('discord.js');
const Module = require('node:module');

// Command files pull in the database and the rest of the bot. Only their `data` builder is
// needed, so every module other than discord.js is replaced with an inert stand-in.
const inert = () => new Proxy(function () {}, {
  get: (_, key) => (key === 'then' ? undefined : inert()),
  apply: () => inert(),
  construct: () => inert(),
});
const load = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'discord.js') return load.call(this, discordPath, parent, isMain);
  try {
    return load.call(this, request, parent, isMain);
  } catch {
    return inert();
  }
};

const optionTypes = { 1: 'subcommand', 2: 'group' };
const commands = [];
for (const category of fs.readdirSync(commandsDir).sort()) {
  const dir = path.join(commandsDir, category);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort()) {
    const mod = require(path.join(dir, file));
    for (const cmd of Array.isArray(mod) ? mod : [mod]) {
      if (!cmd?.data) continue;
      const json = cmd.data.toJSON();
      const subcommands = (json.options ?? []).filter((o) => optionTypes[o.type]).map((o) => o.name);
      const args = (json.options ?? []).filter((o) => !optionTypes[o.type]).map((o) => ({ name: o.name, required: Boolean(o.required) }));
      commands.push({
        name: json.name,
        category,
        contextMenu: json.type === 3 || json.type === 2,
        aliases: cmd.aliases ?? [],
        description: json.description ?? '',
        subcommands,
        args,
      });
    }
  }
}

const out = path.join(here, '../src/data/commands.generated.json');
fs.writeFileSync(out, `${JSON.stringify(commands, null, 1)}\n`);
console.log(`Wrote ${commands.length} commands to ${path.relative(process.cwd(), out)}`);
