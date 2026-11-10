import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The screenshots of the verification for the Features page (src/data/shots/verification.json): the panel of the channel and the DM a member gets when they
// join, built by the bot's own code, like the other screenshots (scripts/make-shots.mjs, which this does not touch, so its answers of other services are not asked again).
//
//   npm run make:verify-shots -- <path to petto-bot>
const here = path.dirname(fileURLToPath(import.meta.url));
const botRoot = path.resolve(process.argv[2] ?? process.env.PETTO_BOT_DIR ?? path.join(here, '../../petto-bot'));
if (!fs.existsSync(path.join(botRoot, 'src', 'commands'))) { console.error(`Bot folder not found: ${botRoot}`); process.exit(1); }
process.env.DISCORD_TOKEN ??= 'shots';
process.env.DISCORD_CLIENT_ID ??= '1';
process.env.DISCLOUD_DATABASE_URL ??= 'postgres://shots:shots@127.0.0.1:1/shots';
process.env.VERIFY_BASE_URL = 'https://verify.petto.sbs'; // so the panel has its link row (the address is not shown)
process.env.VERIFY_TOKEN_SECRET = 'shots';

const require = createRequire(path.join(botRoot, 'package.json'));
const load = (relative) => require(path.join(botRoot, relative));
const IMG_DIR = path.join(here, '..', 'public', 'assets', 'shots');
const EMOJI_DIR = path.join(IMG_DIR, 'emoji');
fs.mkdirSync(EMOJI_DIR, { recursive: true });

const PETTO_AVATAR = '/assets/shots/petto-avatar.png'; // the one make-shots.mjs saves: the avatar every member sees
const FAKE = 'https://shots.invalid/petto-avatar.png'; // a builder wants an address; it is swapped for the saved file below
const LANGS = ['en', 'es', 'pt-BR'];
const TIME = { en: 'Today at 10:42 AM', es: 'Hoy a las 10:42', 'pt-BR': 'Hoje às 10:42' };
const LOCALES = { en: 'en-US', es: 'es-419', 'pt-BR': 'pt-BR' };
const NOW = 1793049053698;

const { buildPanel } = load('src/interactions/verifyLetters.js');
const { buildVerifyDM } = load('src/utils/verifyMessage.js');
const { EMOJI } = load('src/utils/emojis.js');

// The custom emojis of the cards are pictures of the site's own folder (the ones that are not saved yet are read from Discord's CDN).
for (const token of Object.values(EMOJI)) {
  const match = /^<a?:\w+:(\d+)>$/.exec(String(token));
  if (!match || fs.existsSync(path.join(EMOJI_DIR, `${match[1]}.png`))) continue;
  const needed = JSON.stringify([EMOJI.SAFETY, EMOJI.LINK, EMOJI.SPEECH]);
  if (!needed.includes(match[1])) continue;
  const response = await fetch(`https://cdn.discordapp.com/emojis/${match[1]}.png?size=64`).catch(() => null);
  if (response?.ok) fs.writeFileSync(path.join(EMOJI_DIR, `${match[1]}.png`), Buffer.from(await response.arrayBuffer()));
}

const guild = { id: '1502171756113432607', name: 'Petto Land', memberCount: 37, iconURL: () => null, client: { user: { displayAvatarURL: () => FAKE } } };
const bot = { name: 'Petto', bot: true, avatar: PETTO_AVATAR };
const plain = (parts) => JSON.parse(JSON.stringify(parts, (key, value) => (value && typeof value.toJSON === 'function' ? value.toJSON() : value)).replaceAll(FAKE, PETTO_AVATAR));
const message = (lang, channel, components) => ({ channel, now: NOW, locale: LOCALES[lang], names: {}, messages: [{ user: bot, time: TIME[lang], components: plain(components) }] });

const shots = { 'verify-panel': {}, 'verify-dm': {} };
for (const lang of LANGS) {
  shots['verify-panel'][lang] = message(lang, 'verify', buildPanel({ guild, method: 'letters', lang }).components);
  shots['verify-dm'][lang] = message(lang, 'petto', [buildVerifyDM({ guild, link: 'https://verify.petto.sbs/verify/sample', discordButton: true, lang })]);
}
fs.writeFileSync(path.join(here, '..', 'src', 'data', 'shots', 'verification.json'), `${JSON.stringify(shots, null, 1)}\n`);
console.log('Wrote src/data/shots/verification.json');
