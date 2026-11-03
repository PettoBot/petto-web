import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Writes src/data/commands.generated.json from the bot, with the bot's own loader, so the page shows what the bot really has:
// the aliases it accepts (its curated ones and the short defaults), the commands that only work with the prefix, and the
// `!<name>config` cards that have a file of their own. Cards the bot makes by itself for every other command are left out.
// A command with subcommands (and the subcommands of its groups, `ticket panel create`) also gets `leaves`: one entry for each, with its own description
// in the three languages, its own arguments and the words that reach it, so the commands page can list each one on its own row.
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
const { CATALOGS, commandDescriptionKey } = require(path.join(botRoot, 'src', 'i18n', 'index.js'));
const { DEFAULT_PREFIX_ROUTES } = require(path.join(botRoot, 'src', 'utils', 'defaultCommandAliases.js'));

const client = { commands: new Collection() };
loadCommands(client);

const optionTypes = { 1: 'subcommand', 2: 'group' };

// The commands of the Integrations category get a section of their own on the commands page: every subcommand with its description in
// the three languages (from the bot's own catalogs), its arguments and the short words that reach it.
const LANGS = ['en', 'es', 'pt-BR'];
const describe = (key, english) => Object.fromEntries(LANGS.map((lang) => [lang, (lang === 'en' ? english : CATALOGS[lang]?.[key]) ?? english]));
const argsOf = (options) => (options ?? []).filter((o) => !optionTypes[o.type]).map((o) => ({ name: o.name, required: Boolean(o.required) }));
function integrationOf(cmd, json) {
  const base = `cmd.integrations.${json.name}`;
  const routes = DEFAULT_PREFIX_ROUTES.filter((route) => route.command === json.name);
  const words = cmd.prefixSubcommandAliases ?? {};
  const subs = (json.options ?? []).filter((o) => optionTypes[o.type]).map((sub) => ({
    name: sub.name,
    desc: describe(`${base}.${sub.name}.desc`, sub.description),
    args: argsOf(sub.options),
    // The word typed in place of the subcommand (`!lfm np`) and the commands that are a shortcut to it (`!np`).
    words: Object.entries(words).filter(([, target]) => target === sub.name).map(([word]) => word),
    shortcuts: routes.filter((route) => route.subcommand === sub.name).map((route) => route.alias),
  }));
  return { desc: describe(`${base}.desc`, json.description), args: argsOf(json.options), subs };
}

// Every subcommand, and every subcommand of a group, of a command: `path` is [subcommand] or [group, subcommand]. The description is the one of the bot's own
// catalogs in each language (cmd.<category>.<command>.<path>.desc), else the English one of the builder, else the description of the command.
// The permission is the one the command asks for (Discord only has it on the whole command), so every leaf of a command carries the same one.
function leavesOf(cmd, json) {
  const words = cmd.prefixSubcommandAliases ?? {};
  const routes = DEFAULT_PREFIX_ROUTES.filter((route) => route.command === json.name);
  const wordsFor = (target) => Object.entries(words).filter(([, to]) => to === target).map(([word]) => word);
  const leaf = (parts, node) => {
    const key = commandDescriptionKey(cmd.category, json.name, parts);
    const fallback = node.description || json.description || '';
    const direct = parts.length === 1;
    return {
      path: parts,
      desc: Object.fromEntries(LANGS.map((lang) => [lang, CATALOGS[lang]?.[key] || fallback])),
      args: argsOf(node.options),
      // The word typed in place of the subcommand (`!feed follow`) and the commands that are a shortcut to it (`!lock`).
      words: direct ? wordsFor(parts[0]) : [],
      groupWords: direct ? [] : wordsFor(parts[0]),
      shortcuts: routes.filter((route) => route.subcommand === parts[0] && (direct ? route.args.length <= 1 : route.args[1] === parts[1])).map((route) => route.alias),
      permissions: json.default_member_permissions ?? null,
    };
  };
  return (json.options ?? []).filter((o) => optionTypes[o.type]).flatMap((node) => (node.type === 2
    ? (node.options ?? []).map((inner) => leaf([node.name, inner.name], inner))
    : [leaf([node.name], node)]));
}
const { ACTIONS } = require(path.join(botRoot, 'src', 'utils', 'actions.js'));
function actionsOf(json) {
  return json.options.flatMap((group) => (group.options ?? []).map((sub) => {
    const action = ACTIONS.find((each) => each.name === sub.name);
    return { name: sub.name, group: group.name, aliases: action?.aliases ?? [], desc: describe(`cmd.roleplay.act.${group.name}.${sub.name}.desc`, sub.description) };
  }));
}
const commands = [];
const seen = new Set();
for (const cmd of client.commands.values()) {
  if (!cmd?.data || !cmd.filePath || seen.has(cmd) || cmd.hiddenEverywhere) continue;
  seen.add(cmd);
  const json = cmd.data.toJSON();
  commands.push({
    name: json.name,
    category: cmd.category ?? 'misc',
    contextMenu: json.type === 3 || json.type === 2,
    // Registered with Discord as a slash command (the same rule as the bot's collectCommandData); the rest are prefix commands only.
    slash: (json.type ?? 1) !== 1 || Boolean(!cmd.prefixOnly && (cmd.slashOnly || cmd.registerSlash || cmd.category === 'roleplay')),
    aliases: cmd.aliases ?? [],
    description: json.description ?? '',
    subcommands: (json.options ?? []).filter((o) => optionTypes[o.type]).map((o) => o.name),
    args: (json.options ?? []).filter((o) => !optionTypes[o.type]).map((o) => ({ name: o.name, required: Boolean(o.required) })),
    // The interaction actions are the subcommands of /action: each one in its group, with the words that reach it with the prefix and its
    // description in the three languages (from the bot's own catalogs).
    ...(json.name === 'action' ? { actions: actionsOf(json) } : {}),
    // One entry for each subcommand (and subcommand of a group); the services of the Integrations and the actions of /action have their own sections.
    ...(json.name !== 'action' && cmd.category !== 'integrations' && (json.options ?? []).some((o) => optionTypes[o.type]) ? { leaves: leavesOf(cmd, json) } : {}),
    // An umbrella (`/server`, `/user`) names the rule of each subcommand: the command it wraps (`serverinfo` for `/server info`) or a key of its own
    // (`servericon`, with the words that reach it, `!servericon`). The dashboard saves the same names the bot reads (Disabled commands).
    ...(cmd.ruleKeys ? { ruleKeys: Object.entries(cmd.ruleKeys).map(([subcommand, name]) => ({ subcommand, name, aliases: DEFAULT_PREFIX_ROUTES.filter((route) => route.command === json.name && route.disableName === name).map((route) => route.alias) })) } : {}),
    // The Discord permission the bot asks for before the command runs (its default_member_permissions), for the Permissions page.
    permissions: json.default_member_permissions ?? null,
    ...(cmd.category === 'integrations' ? { integration: integrationOf(cmd, json) } : {}),
  });
}
commands.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

const out = path.join(here, '../src/data/commands.generated.json');
// Each leaf is written on one line, so the file stays readable and a change of one subcommand is a change of one line.
const leafLines = [];
const text = JSON.stringify(commands, (key, value) => (key === 'leaves' && Array.isArray(value) ? value.map((leaf) => `@@leaf${leafLines.push(JSON.stringify(leaf)) - 1}@@`) : value), 1)
  .replace(/"@@leaf(\d+)@@"/g, (_, index) => leafLines[Number(index)]);
fs.writeFileSync(out, `${text}\n`);
console.log(`Wrote ${commands.length} commands to ${path.relative(process.cwd(), out)}`);
process.exit(0);
