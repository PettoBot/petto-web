import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Writes src/data/commands.generated.json from the bot, with the bot's own loader, so the page shows what the bot really has:
// the aliases it accepts (its curated ones and the short defaults), the commands that only work with the prefix, and the
// `!<name>config` cards that have a file of their own. Cards the bot makes by itself for every other command are left out.
//
//   npm run sync:commands -- <path to petto-bot>
const here = path.dirname(fileURLToPath(import.meta.url));
const botRoot = path.resolve(process.argv[2] ?? process.env.PETTO_BOT_DIR ?? path.join(here, '../../petto-bot'));
const commandsDir = path.join(botRoot, 'src', 'commands');
if (!fs.existsSync(commandsDir)) {
  console.error(`Bot commands folder not found: ${commandsDir}\nUsage: npm run sync:commands -- <path to petto-bot>`);
  process.exit(1);
}

// The bot's config file asks for these and the loader never connects to anything with them.
process.env.DISCORD_TOKEN ??= 'sync';
process.env.DISCORD_CLIENT_ID ??= '1';
process.env.DISCLOUD_DATABASE_URL ??= 'postgres://sync:sync@127.0.0.1:1/sync';

const require = createRequire(path.join(botRoot, 'package.json'));
const { Collection } = require('discord.js');
const { loadCommands } = require(path.join(botRoot, 'src', 'handlers', 'commandHandler.js'));

const client = { commands: new Collection() };
loadCommands(client);

const optionTypes = { 1: 'subcommand', 2: 'group' };
const commands = [];
const seen = new Set();
for (const cmd of client.commands.values()) {
  if (!cmd?.data || !cmd.filePath || seen.has(cmd)) continue;
  seen.add(cmd);
  const json = cmd.data.toJSON();
  commands.push({
    name: json.name,
    category: cmd.category ?? 'misc',
    contextMenu: json.type === 3 || json.type === 2,
    // Registered with Discord as a slash command (the same rule as the bot's collectCommandData); the rest are prefix commands only.
    slash: (json.type ?? 1) !== 1 || Boolean(cmd.slashOnly || cmd.registerSlash) || cmd.category === 'roleplay',
    aliases: cmd.aliases ?? [],
    description: json.description ?? '',
    subcommands: (json.options ?? []).filter((o) => optionTypes[o.type]).map((o) => o.name),
    args: (json.options ?? []).filter((o) => !optionTypes[o.type]).map((o) => ({ name: o.name, required: Boolean(o.required) })),
  });
}
commands.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

const out = path.join(here, '../src/data/commands.generated.json');
fs.writeFileSync(out, `${JSON.stringify(commands, null, 1)}\n`);
console.log(`Wrote ${commands.length} commands to ${path.relative(process.cwd(), out)}`);
process.exit(0);
