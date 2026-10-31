import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Writes src/data/variables.generated.json from the bot's registry of the variables it understands (src/utils/embedVariableRegistry.js), in the
// three languages. The dashboard asks the live bot for the same list; this copy is what the pickers show when the bot cannot answer, so they never
// lack the variables of any section (sanctions, starboard, giveaways, quests, rollouts...).
//
//   npm run sync:variables -- <path to petto-bot>
const here = path.dirname(fileURLToPath(import.meta.url));
const botRoot = path.resolve(process.argv[2] ?? process.env.PETTO_BOT_DIR ?? path.join(here, '../../petto-bot'));
const registry = path.join(botRoot, 'src', 'utils', 'embedVariableRegistry.js');
if (!fs.existsSync(registry)) { console.error(`Bot registry not found: ${registry}\nUsage: npm run sync:variables -- <path to petto-bot>`); process.exit(1); }
process.env.DISCORD_TOKEN ??= 'sync';
process.env.DISCORD_CLIENT_ID ??= '1';
process.env.DISCLOUD_DATABASE_URL ??= 'postgres://sync:sync@127.0.0.1:1/sync';

const require = createRequire(path.join(botRoot, 'package.json'));
const { listVariables } = require(registry);
const { ALIASES } = require(path.join(botRoot, 'src', 'utils', 'embedVariables.js'));
const out = {};
for (const lang of ['en', 'es', 'pt-BR']) {
  out[lang] = listVariables(lang).map((group) => ({ id: group.id, label: group.label, availability: group.availability, vars: group.vars.map((variable) => ({ tok: variable.tok, desc: variable.desc })) }));
}
const file = path.join(here, '..', 'src', 'data', 'variables.generated.json');
fs.writeFileSync(file, `${JSON.stringify(out, null, 1)}\n`);
// The other names a variable answers to, so the editors do not call them unknown.
fs.writeFileSync(path.join(here, '..', 'src', 'data', 'variableAliases.generated.json'), `${JSON.stringify(Object.keys(ALIASES).sort())}\n`);
console.log(`Wrote ${out.en.length} groups and ${out.en.reduce((n, g) => n + g.vars.length, 0)} variables in 3 languages to src/data/variables.generated.json`);
process.exit(0);
