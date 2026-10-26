import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Writes the screenshots the site shows (src/data/shots/*.json and public/assets/shots/*.png) by running the bot's own commands with sample data
// instead of the real services, so a screenshot is exactly what the bot would send. Nothing leaves this machine and no real person appears in them.
//
//   npm run make:shots -- <path to petto-bot>
const here = path.dirname(fileURLToPath(import.meta.url));
const botRoot = path.resolve(process.argv[2] ?? process.env.PETTO_BOT_DIR ?? path.join(here, '../../petto-bot'));
if (!fs.existsSync(path.join(botRoot, 'src', 'commands'))) { console.error(`Bot folder not found: ${botRoot}`); process.exit(1); }
process.env.DISCORD_TOKEN ??= 'shots';
process.env.DISCORD_CLIENT_ID ??= '1';
process.env.DISCLOUD_DATABASE_URL ??= 'postgres://shots:shots@127.0.0.1:1/shots';
for (const key of ['githubToken', 'lastfmApiKey', 'steamApiKey', 'twitchClientId', 'twitchClientSecret', 'youtubeApiKey', 'tmdbApiKey']) void key;

const require = createRequire(path.join(botRoot, 'package.json'));
const { createCanvas } = require('@napi-rs/canvas');
const stub = (relative, exports) => {
  const resolved = require.resolve(path.join(botRoot, relative));
  require.cache[resolved] = { id: resolved, filename: resolved, loaded: true, exports };
};

// --- the pictures: a cover is drawn here (a gradient and a shape), never taken from anyone ----------------------------------------------------
const COVERS = {
  night: ['#1b1464', '#7b2cbf', '#ff6b9d'],
  sunset: ['#ff9966', '#ff5e62', '#4b134f'],
  ocean: ['#0f2027', '#2c5364', '#38b6ff'],
  forest: ['#134e5e', '#71b280', '#e8f5c8'],
};
const cover = (name) => {
  const [a, b, c] = COVERS[name] ?? COVERS.night;
  const canvas = createCanvas(600, 600);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 600, 600);
  gradient.addColorStop(0, a); gradient.addColorStop(0.55, b); gradient.addColorStop(1, c);
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 600, 600);
  ctx.globalAlpha = 0.28; ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(420, 190, 150, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.arc(170, 430, 200, 0, Math.PI * 2); ctx.fill();
  return canvas;
};
let nextCover = 'night';
stub('src/utils/safeImage.js', { loadImageFromLink: async () => cover(nextCover) });
stub('src/utils/logger.js', { info() {}, warn() {}, error() {} });
const links = new Map([['liam', 'liam_music']]);
stub('src/db/lastfmLinks.js', { getLink: async (id) => links.get(id) ?? null, getLinks: async () => new Map(), setLink: async () => {}, removeLink: async () => true });

// --- the sample data the services answer with -------------------------------------------------------------------------------------------------
const now = Date.now();
const json = (body) => new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
const ROUTES = [
  [/method=user\.getrecenttracks/, () => json({ recenttracks: { track: { name: 'Karma Police', artist: { '#text': 'Radiohead' }, album: { '#text': 'OK Computer' }, url: 'https://www.last.fm/music/Radiohead/_/Karma+Police', image: [{ '#text': 'https://lastfm.example/cover.png' }], '@attr': { nowplaying: 'true' } } } })],
  [/api\.deezer\.com\/search\/track/, () => json({ data: [
    { title: 'Everything In Its Right Place', link: 'https://www.deezer.com/track/1', duration: 251, rank: 812340, preview: 'https://cdn.example/p1.mp3', artist: { name: 'Radiohead' }, album: { title: 'Kid A', cover_xl: 'https://cdn.example/c.jpg' } },
    { title: 'Everything In Its Right Place (Live)', link: 'https://www.deezer.com/track/2', duration: 280, artist: { name: 'Radiohead' }, album: { title: 'Live' } },
    { title: 'Everything In Its Right Place (Remastered)', link: 'https://www.deezer.com/track/3', duration: 251, artist: { name: 'Radiohead' }, album: { title: 'Kid A Mnesia' } },
  ] })],
  [/api\.mcsrvstat\.us\/3\/play\.pettocraft\.net/, () => json({ online: true, ip: '203.0.113.7', port: 25565, hostname: 'play.pettocraft.net', version: 'Paper 1.21.4', software: 'Paper', motd: { clean: ['PettoCraft Survival', 'Season 4 is live! Claim your land'] }, players: { online: 1284, max: 5000, list: [{ name: 'kiwi' }, { name: 'Steve_99' }, { name: 'Alexa' }, { name: 'blocky' }] } })],
  [/open\.er-api\.com\/v6\/latest\/USD/, () => json({ result: 'success', time_last_update_unix: Math.floor(now / 1000) - 3600, base_code: 'USD', rates: { USD: 1, COP: 3170.487231, EUR: 0.89213, MXN: 18.723111 } })],
  [/graphql\.anilist\.co/, () => json({ data: { Media: { id: 1, title: { romaji: 'Sousou no Frieren', english: 'Frieren: Beyond Journey\'s End' }, format: 'TV', status: 'FINISHED', episodes: 28, averageScore: 91, genres: ['Adventure', 'Drama', 'Fantasy'], startDate: { year: 2023, month: 9, day: 29 }, description: 'The adventure is over but life goes on for an elf mage just beginning to learn what living is all about.', coverImage: { extraLarge: 'https://anilist.example/cover.png' }, siteUrl: 'https://anilist.co/anime/154587', isAdult: false, studios: { nodes: [{ name: 'Madhouse' }] } } } })],
  [/api\.github\.com\/repos\/PettoBot\/petto-bot$/, () => json({ full_name: 'PettoBot/petto-bot', description: 'Moderation management', html_url: 'https://github.com/PettoBot/petto-bot', stargazers_count: 128, forks_count: 9, open_issues_count: 3, language: 'JavaScript', license: { spdx_id: 'AGPL-3.0' }, topics: ['discord', 'bot', 'moderation'], pushed_at: new Date(now - 3600e3).toISOString(), created_at: '2025-03-01T00:00:00Z', owner: { avatar_url: 'https://github.example/a.png' } })],
  [/api\.chess\.com\/pub\/player\/pettochess\/stats/, () => json({ chess_rapid: { last: { rating: 1654 } }, chess_blitz: { last: { rating: 1721 } }, chess_bullet: { last: { rating: 1580 } }, tactics: { highest: { rating: 2105 } } })],
  [/api\.chess\.com\/pub\/player\/pettochess$/, () => json({ username: 'pettochess', name: 'Petto Chess', title: 'FM', avatar: 'https://chess.example/a.png', url: 'https://www.chess.com/member/pettochess', followers: 4210, country: 'https://api.chess.com/pub/country/CO', joined: 1600000000, last_online: Math.floor(now / 1000) - 600, league: 'Champion' })],
];
globalThis.fetch = async (url) => {
  for (const [pattern, handler] of ROUTES) if (pattern.test(String(url))) return handler();
  return new Response('{}', { status: 404 });
};

// --- running a command like a member typing it ---------------------------------------------------------------------------------------------------
const config = require(path.join(botRoot, 'src', 'config.js'));
config.lastfmApiKey = 'sample';
const cmd = (name) => require(path.join(botRoot, 'src', 'commands', 'integrations', `${name}.js`));
const LANGS = ['en', 'es', 'pt-BR'];
const TIME = { en: 'Today at 10:42 AM', es: 'Hoy a las 10:42', 'pt-BR': 'Hoje às 10:42' };
const LOCALES = { en: 'en-US', es: 'es-419', 'pt-BR': 'pt-BR' };
const SHOT_DIR = path.join(here, '..', 'src', 'data', 'shots');
const IMG_DIR = path.join(here, '..', 'public', 'assets', 'shots');
fs.mkdirSync(SHOT_DIR, { recursive: true });
fs.mkdirSync(IMG_DIR, { recursive: true });
const MASCOT = '/assets/mascot-icon.webp';

const { clearCache } = require(path.join(botRoot, 'src', 'utils', 'integrations.js'));

async function run(command, options) {
  clearCache();
  const sent = [];
  const interaction = {
    pettoLang: options.lang,
    guild: { id: 'g', members: { cache: new Map() } },
    channel: { nsfw: false },
    user: { id: options.userId ?? `u${Math.random()}`, username: 'liam' },
    options: {
      getSubcommand: () => options.sub ?? null,
      getString: (name) => options.strings?.[name] ?? null,
      getUser: () => null,
    },
    deferReply: async () => {},
    reply: async (payload) => { sent.push(payload); },
    editReply: async (payload) => { sent.push(payload); },
  };
  await command.execute(interaction);
  return sent.at(-1);
}

/** The payload as plain JSON, with its pictures kept as files of the site and every outside address left out. */
function pack(payload, id, lang) {
  let text = JSON.stringify((payload.components ?? []).map((component) => component.toJSON()));
  const files = payload.files ?? [];
  for (const file of files) {
    const name = `${id}-${file.name}`;
    fs.writeFileSync(path.join(IMG_DIR, name), file.attachment);
    text = text.split(`attachment://${file.name}`).join(`/assets/shots/${name}`);
  }
  // Any other picture is an address of a service: show the mascot (a small picture) or a drawn cover instead.
  text = text.replace(/"url":"https?:\/\/[^"]+"/g, '"url":"__OUTSIDE__"');
  return JSON.parse(text);
}

const shots = {};
async function shot(id, channel, typed, build) {
  shots[id] = {};
  for (const lang of LANGS) {
    const payload = await build(lang);
    const components = pack(payload, id, lang);
    // What is left pointing outside: thumbnails become the mascot, wide pictures a drawn cover.
    const draw = (node) => {
      if (Array.isArray(node)) return node.forEach(draw);
      if (!node || typeof node !== 'object') return;
      if (node.type === 11 && node.media?.url === '__OUTSIDE__') node.media.url = MASCOT;
      if (node.type === 12) node.items = node.items.filter((item) => item.media?.url !== '__OUTSIDE__');
      Object.values(node).forEach(draw);
    };
    draw(components);
    shots[id][lang] = {
      channel,
      now,
      locale: LOCALES[lang],
      messages: [
        { user: { name: 'liam', color: '#f2a65a' }, time: TIME[lang], text: typed },
        { user: { name: 'Petto', bot: true, avatar: '/assets/bot-avatar.png' }, time: TIME[lang], components },
      ],
    };
  }
}

nextCover = 'night';
await shot('lastfm-now', 'music', '!np', (lang) => run(cmd('lastfm'), { lang, sub: 'now', userId: 'liam' }));
nextCover = 'sunset';
await shot('deezer-track', 'music', '!deezer everything in its right place', (lang) => run(cmd('deezer'), { lang, sub: 'track', strings: { query: 'everything in its right place' } }));
nextCover = 'ocean';
await shot('minecraft-server', 'minecraft', '!mc play.pettocraft.net', (lang) => run(cmd('minecraft'), { lang, sub: 'server', strings: { address: 'play.pettocraft.net' } }));
await shot('currency', 'general', '!currency 100 usd cop eur', (lang) => run(cmd('currency'), { lang, strings: { conversion: '100 usd cop eur' } }));
nextCover = 'forest';
await shot('anime', 'anime', '!anime frieren', (lang) => run(cmd('anilist'), { lang, sub: 'anime', strings: { title: 'frieren' } }));
await shot('github-repo', 'dev', '!gh PettoBot/petto-bot', (lang) => run(cmd('github'), { lang, sub: 'repo', strings: { repository: 'PettoBot/petto-bot' } }));
await shot('chess', 'games', '!chess pettochess', (lang) => run(cmd('chess'), { lang, sub: 'chesscom', strings: { player: 'pettochess' } }));

fs.writeFileSync(path.join(SHOT_DIR, 'integrations.json'), `${JSON.stringify(shots, null, 1)}\n`);
console.log(`Wrote ${Object.keys(shots).length} screenshots in ${LANGS.length} languages to src/data/shots/integrations.json`);
process.exit(0);
