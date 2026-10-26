import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Writes the screenshots the site shows (src/data/shots/*.json and public/assets/shots/) by running the bot's own code: its commands for the lookups
// (with the real answers of the public services) and its own builders for the cards of the moderation, giveaways, tickets, polls, levels and
// statistics. What the bot builds is what the site shows. The people are the team (src/data/shotPeople.json).
//
//   npm run make:shots -- <path to petto-bot>
const here = path.dirname(fileURLToPath(import.meta.url));
const botRoot = path.resolve(process.argv[2] ?? process.env.PETTO_BOT_DIR ?? path.join(here, '../../petto-bot'));
if (!fs.existsSync(path.join(botRoot, 'src', 'commands'))) { console.error(`Bot folder not found: ${botRoot}`); process.exit(1); }
process.env.DISCORD_TOKEN ??= 'shots';
process.env.DISCORD_CLIENT_ID ??= '1';
process.env.DISCLOUD_DATABASE_URL ??= 'postgres://shots:shots@127.0.0.1:1/shots';

const require = createRequire(path.join(botRoot, 'package.json'));
const stub = (relative, exports) => {
  const resolved = require.resolve(path.join(botRoot, relative));
  require.cache[resolved] = { id: resolved, filename: resolved, loaded: true, exports };
};
const load = (relative) => require(path.join(botRoot, relative));

const SHOT_DIR = path.join(here, '..', 'src', 'data', 'shots');
const IMG_DIR = path.join(here, '..', 'public', 'assets', 'shots');
fs.mkdirSync(SHOT_DIR, { recursive: true });
fs.mkdirSync(path.join(IMG_DIR, 'img'), { recursive: true });
fs.mkdirSync(path.join(IMG_DIR, 'emoji'), { recursive: true });
const people = JSON.parse(fs.readFileSync(path.join(here, '..', 'src', 'data', 'shotPeople.json'), 'utf8'));
const LIAM = '293504726505357312';
const CHU = '1421156491322462291';
const KIRA = '257181659865153539';
const person = (id) => ({ name: people[id].name, avatar: people[id].avatar });
// The avatar of the bot is the one every member sees on Discord (its global avatar), read from the public page of the application.
const BOT_ID = '1489326875498119168';
async function botAvatar() {
  const target = path.join(IMG_DIR, 'petto-avatar.png');
  try {
    const application = await (await fetch(`https://discord.com/api/v10/applications/${BOT_ID}/rpc`)).json();
    const hash = application.bot?.avatar;
    if (hash) {
      const picture = await fetch(`https://cdn.discordapp.com/avatars/${BOT_ID}/${hash}.png?size=256`);
      if (picture.ok) fs.writeFileSync(target, Buffer.from(await picture.arrayBuffer()));
    }
  } catch { /* the one saved last time stays */ }
  return fs.existsSync(target) ? '/assets/shots/petto-avatar.png' : '/assets/bot-avatar.png';
}
const BOT = { name: 'Petto', bot: true, avatar: await botAvatar() };

stub('src/utils/logger.js', { info() {}, warn() {}, error() {}, debug() {} });
const links = new Map([[LIAM, 'liam_music']]);
stub('src/db/lastfmLinks.js', { getLink: async (id) => links.get(id) ?? null, getLinks: async () => new Map(), setLink: async () => {}, removeLink: async () => true });

// --- the services: the public ones answer for real; the ones that need a key (Last.fm, TMDB, YouTube) answer with an example about something real ---------
const realFetch = globalThis.fetch;
const json = (body) => new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
let karmaCover = '';
const KEYED = [
  [/ws\.audioscrobbler\.com.*method=user\.getrecenttracks/, () => json({ recenttracks: { track: { name: 'Karma Police', artist: { '#text': 'Radiohead' }, album: { '#text': 'OK Computer' }, url: 'https://www.last.fm/music/Radiohead/_/Karma+Police', image: [{ '#text': karmaCover }], '@attr': { nowplaying: 'true' } } } })],
  [/api\.themoviedb\.org\/3\/search\/movie/, () => json({ results: [{ id: 27205 }] })],
  [/api\.themoviedb\.org\/3\/movie\/27205/, () => json({ id: 27205, title: 'Inception', original_title: 'Inception', tagline: 'Your mind is the scene of the crime.', overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.', release_date: '2010-07-15', runtime: 148, vote_average: 8.37, vote_count: 37000, genres: [{ name: 'Action' }, { name: 'Science Fiction' }, { name: 'Adventure' }], poster_path: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg', backdrop_path: null, homepage: '', imdb_id: 'tt1375666', status: 'Released' })],
];
globalThis.fetch = async (url, init) => {
  const value = String(url);
  for (const [pattern, handler] of KEYED) if (pattern.test(value)) return handler();
  // GitHub allows few requests without a key; our own repository is read with the session's GitHub client instead.
  const github = /^https:\/\/api\.github\.com\/(repos\/PettoBot\/[\w.-]+.*)$/.exec(value);
  if (github) {
    try {
      return json(JSON.parse(execFileSync('gh', ['api', github[1]], { encoding: 'utf8', maxBuffer: 20_000_000 })));
    } catch { /* the real service answers instead */ }
  }
  return realFetch(url, init);
};

// --- pictures: each address a card points to becomes a file of the site ---------------------------------------------------------------------------------
const downloaded = new Map();
async function localPicture(url) {
  if (url.startsWith('/')) return url;
  if (downloaded.has(url)) return downloaded.get(url);
  let result = null;
  try {
    const response = await realFetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Petto site screenshots)' } });
    const type = response.headers.get('content-type') ?? '';
    const bytes = Buffer.from(await response.arrayBuffer());
    const extension = /png/.test(type) ? 'png' : /webp/.test(type) ? 'webp' : /gif/.test(type) ? 'gif' : /svg/.test(type) ? 'svg' : 'jpg';
    if (response.ok && type.startsWith('image/') && bytes.length < 400_000) {
      const name = `${crypto.createHash('sha1').update(url).digest('hex').slice(0, 12)}.${extension}`;
      fs.writeFileSync(path.join(IMG_DIR, 'img', name), bytes);
      result = `/assets/shots/img/${name}`;
    }
  } catch { /* the picture is left out */ }
  downloaded.set(url, result);
  return result;
}

/** Downloads the custom emoji that a screenshot uses, in the text (`<:name:id>`) and in buttons, as files of the site. */
async function saveEmoji(all) {
  const text = JSON.stringify(all);
  const wanted = new Map();
  for (const [, animated, id] of text.matchAll(/<(a?):\w+:(\d+)>/g)) wanted.set(id, animated === 'a');
  for (const [, id] of text.matchAll(/"emoji":\{"id":"(\d+)"/g)) if (!wanted.has(id)) wanted.set(id, false);
  for (const [id, animated] of wanted) {
    const target = path.join(IMG_DIR, 'emoji', `${id}.${animated ? 'gif' : 'png'}`);
    if (fs.existsSync(target)) continue;
    try {
      const response = await realFetch(`https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}?size=48`);
      if (response.ok) fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()));
    } catch { /* the emoji shows as its name */ }
  }
}

/** Walks a JSON tree and swaps every picture address for a file of the site; what cannot be had is removed. */
async function localize(node) {
  if (Array.isArray(node)) { for (const item of node) await localize(item); return; }
  if (!node || typeof node !== 'object') return;
  for (const [key, value] of Object.entries(node)) {
    if (['url', 'icon_url'].includes(key) && typeof value === 'string' && /^https?:\/\//.test(value) && !(node.type === 2 && node.style === 5)) {
      const local = await localPicture(value);
      if (local) node[key] = local; else delete node[key];
    } else if (typeof value === 'object') await localize(value);
  }
}

// --- running the bot -----------------------------------------------------------------------------------------------------------------------------------
const LANGS = ['en', 'es', 'pt-BR'];
const TIME = { en: 'Today at 10:42 AM', es: 'Hoy a las 10:42', 'pt-BR': 'Hoje às 10:42' };
const LOCALES = { en: 'en-US', es: 'es-419', 'pt-BR': 'pt-BR' };
const NOW = Date.now();
const config = load('src/config.js');
config.lastfmApiKey = 'sample';
config.tmdbApiKey = 'sample';
const { clearCache } = load('src/utils/integrations.js');
const cmd = (name) => load(`src/commands/integrations/${name}.js`);

async function run(command, { lang, sub, strings, userId = LIAM }) {
  clearCache();
  let sent = null;
  const interaction = {
    pettoLang: lang,
    guild: { id: 'g', members: { cache: new Map() } },
    channel: { nsfw: false },
    user: { id: userId, username: 'liam' },
    options: { getSubcommand: () => sub ?? null, getString: (name) => strings?.[name] ?? null, getUser: () => null },
    deferReply: async () => {},
    reply: async (payload) => { sent = payload; },
    editReply: async (payload) => { sent = payload; },
  };
  await command.execute(interaction);
  return sent;
}

/** What a message of the bot holds, as plain JSON (embeds, cards, buttons, pictures of its files). */
function plain(payload, id, lang) {
  const out = {};
  if (payload.content) out.content = payload.content;
  if (payload.embeds?.length) out.embeds = payload.embeds.map((embed) => (embed.toJSON ? embed.toJSON() : embed));
  const parts = [...(payload.components ?? []), ...(payload.rows ?? [])].map((part) => (part.toJSON ? part.toJSON() : part));
  if (parts.length) out.components = parts;
  let text = JSON.stringify(out);
  const images = [];
  for (const file of payload.files ?? []) {
    const name = `${id}-${lang}-${file.name}`;
    fs.writeFileSync(path.join(IMG_DIR, name), typeof file.attachment === 'string' ? fs.readFileSync(file.attachment) : file.attachment); // a file the bot ships is read from its path
    text = text.split(`attachment://${file.name}`).join(`/assets/shots/${name}`);
    if (!text.includes(`/assets/shots/${name}`)) images.push({ url: `/assets/shots/${name}` });
  }
  const result = JSON.parse(text);
  if (images.length) result.images = images;
  return result;
}

let shots = {};
/**
 * One screenshot, in the three languages. `typed` is what the member writes (with who), `build(lang)` the payload of the bot, `bot` can be
 * given instead of a command; `names` lets a mention of the text show a name.
 */
async function shot(id, channel, { typed, who = LIAM, reply, build, names = {}, extra = [] }) {
  shots[id] = {};
  for (const lang of LANGS) {
    const payload = await build(lang);
    const bot = plain(payload, id, lang);
    await localize(bot);
    const messages = [];
    if (typed) messages.push({ user: person(who), time: TIME[lang], text: typeof typed === 'function' ? typed(lang) : typed });
    for (const message of extra) messages.push(message(lang));
    messages.push({ user: BOT, time: TIME[lang], ...(reply ? { reply: reply(lang) } : {}), ...(bot.content ? { text: bot.content } : {}), ...(bot.embeds ? { embeds: bot.embeds } : {}), ...(bot.components ? { components: bot.components } : {}), ...(bot.images ? { images: bot.images } : {}) });
    shots[id][lang] = { channel, now: NOW, locale: LOCALES[lang], names, messages };
  }
  console.log('  ' + id);
}
const byLang = (copy) => (lang) => copy[lang];

// === the lookups: the real answer of each service ==============================================================================================================
const deezer = await (await realFetch('https://api.deezer.com/search/track?q=karma%20police%20radiohead')).json();
karmaCover = deezer.data?.[0]?.album?.cover_xl ?? '';

await shot('lastfm-now', 'music', { typed: '!np', build: (lang) => run(cmd('lastfm'), { lang, sub: 'now' }) });
await shot('deezer-track', 'music', { typed: '!deezer creep radiohead', build: (lang) => run(cmd('deezer'), { lang, sub: 'track', strings: { query: 'creep radiohead' } }) });
await shot('itunes-song', 'music', { typed: '!itunes bad guy billie eilish', build: (lang) => run(cmd('itunes'), { lang, sub: 'song', strings: { query: 'bad guy billie eilish' } }) });
await shot('minecraft-server', 'minecraft', { typed: '!mc hypixel.net', build: (lang) => run(cmd('minecraft'), { lang, sub: 'server', strings: { address: 'hypixel.net' } }) });
await shot('minecraft-user', 'minecraft', { typed: '!mu Notch', build: (lang) => run(cmd('minecraft'), { lang, sub: 'user', strings: { player: 'Notch' } }) });
await shot('anime', 'anime', { typed: '!anime jujutsu kaisen', build: (lang) => run(cmd('anilist'), { lang, sub: 'anime', strings: { title: 'jujutsu kaisen' } }) });
await shot('github-repo', 'dev', { typed: '!gh PettoBot/petto-bot', build: (lang) => run(cmd('github'), { lang, sub: 'repo', strings: { repository: 'PettoBot/petto-bot' } }) });
await shot('chess', 'games', { typed: '!chess hikaru', build: (lang) => run(cmd('chess'), { lang, sub: 'chesscom', strings: { player: 'hikaru' } }) });
await shot('modrinth', 'minecraft', { typed: '!mr sodium', build: (lang) => run(cmd('modrinth'), { lang, strings: { query: 'sodium' } }) });
await shot('crypto', 'general', { typed: '!crypto bitcoin', build: (lang) => run(cmd('crypto'), { lang, strings: { coin: 'bitcoin' } }) });
await shot('currency', 'general', { typed: '!currency 100 usd cop eur', build: (lang) => run(cmd('currency'), { lang, strings: { conversion: '100 usd cop eur' } }) });
await shot('pokemon', 'games', { typed: '!pokemon pikachu', build: (lang) => run(cmd('pokemon'), { lang, strings: { pokemon: 'pikachu' } }) });
await shot('wikipedia', 'general', { typed: '!wp discord', build: (lang) => run(cmd('wikipedia'), { lang, strings: { query: 'discord' } }) });
await shot('package', 'dev', { typed: '!npm discord.js', build: (lang) => run(cmd('package'), { lang, sub: 'npm', strings: { package: 'discord.js' } }) });
await shot('movie', 'movies', { typed: '!movie inception', build: (lang) => run(cmd('tmdb'), { lang, sub: 'movie', strings: { title: 'inception' } }) });
await shot('animal', 'pets', { typed: '!cat', build: (lang) => run(cmd('animal'), { lang, sub: 'cat' }) });

await saveEmoji(shots);
fs.writeFileSync(path.join(SHOT_DIR, 'integrations.json'), `${JSON.stringify(shots, null, 1)}\n`);
console.log(`Wrote ${Object.keys(shots).length} screenshots of the lookups`);

// === the main systems: the builders of the bot ===================================================================================================================
shots = {};
const { buildCaseCard } = load('src/utils/caseCard.js');
const { buildEntryCard, buildEnterRow } = load('src/utils/giveawayCard.js');
const cards = load('src/utils/ticketCards.js');
const { buildPollCard } = load('src/utils/pollCard.js');
const { buildRankEmbed } = load('src/utils/rankView.js');
const { buildSummary } = load('src/utils/activitySummary.js');
const { buildSummaryCard } = load('src/imgutils/summaryCard.js');
const { describeSummary } = load('src/utils/summaryText.js');
const { t, tn } = load('src/i18n');
const { TextDisplayBuilder, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize, AttachmentBuilder } = require('discord.js');
const SPAMMER = '900000000000000001';
const user = (id) => ({ id, username: people[id].username, toString: () => `<@${id}>`, displayAvatarURL: () => people[id].cdn });

// A sanction answers with a line of text and the number of the case, no card around it.
await shot('mod-ban', 'mod', {
  typed: byLang({ en: '!ban @spammer advertising in every channel', es: '!ban @spammer publicidad en todos los canales', 'pt-BR': '!ban @spammer divulgação em todos os canais' }), who: CHU, names: { [SPAMMER]: 'spammer' },
  build: async (lang) => ({ components: [buildCaseCard({ caseNumber: 128, type: 'ban', target: { id: SPAMMER, username: 'spammer' }, reason: { en: 'advertising in every channel', es: 'publicidad en todos los canales', 'pt-BR': 'divulgação em todos os canais' }[lang], lang })] }),
});
await shot('mod-mute', 'mod', {
  typed: byLang({ en: '!mute @spammer 1h spam in #general', es: '!mute @spammer 1h spam en #general', 'pt-BR': '!mute @spammer 1h spam no #general' }), who: KIRA, names: { [SPAMMER]: 'spammer' },
  build: async (lang) => ({ components: [buildCaseCard({ caseNumber: 129, type: 'mute', target: { id: SPAMMER, username: 'spammer' }, reason: { en: 'spam in #general', es: 'spam en #general', 'pt-BR': 'spam no #general' }[lang], duration: '1h', lang })] }),
});

// A giveaway is an embed with the button to enter under it.
await shot('giveaway', 'giveaways', {
  who: LIAM,
  build: async (lang) => ({
    embeds: [buildEntryCard({ prize: 'Discord Nitro', hostId: LIAM, hostName: 'liam', hostAvatar: people[LIAM].cdn, winnersCount: 2, endsAtUnix: Math.floor(NOW / 1000) + 2 * 86400, entryMode: 'button', entriesCount: 184, ended: false, lang })],
    rows: [buildEnterRow('1', { lang })],
  }),
});
await shot('giveaway-ended', 'giveaways', {
  build: async (lang) => ({
    embeds: [buildEntryCard({ prize: 'Discord Nitro', hostId: LIAM, hostName: 'liam', hostAvatar: people[LIAM].cdn, winnersCount: 2, endsAtUnix: Math.floor(NOW / 1000) - 3600, entryMode: 'button', entriesCount: 231, ended: true, lang })],
    rows: [buildEnterRow('1', { lang, disabled: true })],
  }),
});

// Tickets: the panel with its buttons, and the welcome inside a new ticket.
const CATEGORIES = {
  en: [{ key: 'support', label: 'Support', emoji: '🎫' }, { key: 'report', label: 'Report a member', emoji: '🚨' }, { key: 'partner', label: 'Partnership', emoji: '🤝' }],
  es: [{ key: 'support', label: 'Soporte', emoji: '🎫' }, { key: 'report', label: 'Reportar a un miembro', emoji: '🚨' }, { key: 'partner', label: 'Alianzas', emoji: '🤝' }],
  'pt-BR': [{ key: 'support', label: 'Suporte', emoji: '🎫' }, { key: 'report', label: 'Denunciar um membro', emoji: '🚨' }, { key: 'partner', label: 'Parcerias', emoji: '🤝' }],
};
await shot('tickets-panel', 'support', {
  build: async (lang) => ({ components: [cards.buildPanelFallbackCard({ title: { en: 'Support', es: 'Soporte', 'pt-BR': 'Suporte' }[lang], description: null, lang })], rows: cards.buildPanelRows('button', CATEGORIES[lang], { lang }) }),
});
await shot('tickets-welcome', 'ticket-0012', {
  build: async (lang) => ({ components: [cards.buildWelcomeFallbackCard({ opener: user(LIAM), categoryLabel: CATEGORIES[lang][0].label, guildName: 'Petto', ticketNumber: 12, lang })], rows: [cards.buildTicketControlRow('1', lang)] }),
});

// A poll with its votes and buttons.
const POLL = {
  en: { question: 'What should the next event be?', options: ['Movie night', 'Game tournament', 'Karaoke'] },
  es: { question: '¿Cuál debería ser el próximo evento?', options: ['Noche de películas', 'Torneo de juegos', 'Karaoke'] },
  'pt-BR': { question: 'Qual deve ser o próximo evento?', options: ['Noite de filmes', 'Torneio de jogos', 'Karaokê'] },
};
await shot('poll', 'polls', {
  build: async (lang) => buildPollCard({ id: 1, ...POLL[lang], multi: false, closed: false, image: null, ends_at: new Date(NOW + 86400_000).toISOString() }, { voters: 142, counts: [64, 51, 27] }, lang),
});

// Levels: the message when someone levels up (it answers their message) and the rank embed.
await shot('levelup', 'general', {
  typed: byLang({ en: 'gg, that was a close one', es: 'gg, estuvo muy cerrado', 'pt-BR': 'gg, foi por pouco' }),
  build: async (lang) => ({ content: t(lang, 'leveling.notify.default').replace('{user}', `<@${LIAM}>`).replace('{level}', '12') }),
  reply: (lang) => ({ ...person(LIAM), text: { en: 'gg, that was a close one', es: 'gg, estuvo muy cerrado', 'pt-BR': 'gg, foi por pouco' }[lang] }),
});
await shot('rank', 'commands', {
  typed: '!rank',
  build: async (lang) => ({ embeds: [buildRankEmbed({ data: { source: 'messages', level: 12, rank: 3, total: 482, xpCurrent: 1840, xpNeeded: 2650, progress: 69, xp: 19240, voiceMinutes: 0 }, name: 'liam', avatarUrl: people[LIAM].cdn, date: new Date(NOW), lang })] }),
});

// The statistics: the picture of the summary and its lines, as `!summary` answers.
const CHANNELS = { 111: 'general', 222: 'memes', 333: 'gaming', 444: 'music' };
const day = (offset) => new Date(NOW - offset * 86400_000).toISOString().slice(0, 10);
const channelRows = [];
const flowRows = [];
const hourlyRows = [];
const HOURS = [2, 1, 1, 0, 0, 1, 3, 6, 9, 12, 14, 15, 16, 15, 14, 16, 18, 21, 26, 30, 34, 31, 22, 9];
for (let d = 0; d < 7; d += 1) {
  const weekend = [0, 1].includes((new Date(NOW - d * 86400_000).getUTCDay() + 6) % 7 > 4 ? 0 : 1) ? 1 : 1.35;
  Object.keys(CHANNELS).forEach((id, n) => channelRows.push({ day: day(d), channel_id: id, messages: Math.round((620 - n * 130) * (0.8 + ((d * 37) % 5) / 10) * weekend), reactions: 80 - n * 12, voice_seconds: n === 2 ? 25000 : n === 3 ? 12000 : 0 }));
  flowRows.push({ day: day(d), joins: 14 + ((d * 7) % 9), leaves: 5 + ((d * 3) % 6), invited: 9 + ((d * 5) % 5) });
  HOURS.forEach((value, hour) => hourlyRows.push({ day: day(d), hour, messages: Math.round(value * (3 + (d % 3))), voice_seconds: value * 90 }));
}
await shot('summary', 'staff', {
  typed: '!summary messages', who: KIRA, names: Object.fromEntries(Object.entries(CHANNELS).map(([id, name]) => [id, name])),
  build: async (lang) => {
    const summary = buildSummary({ days: 7, channelRows, hourlyRows, flowRows, memberRows: [], caseRows: [], now: new Date(NOW) });
    const container = new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(tn(lang, 'info.summary.header', 7, { title: t(lang, 'info.summary.title.messages'), server: 'Petto', count: 7 })));
    container.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL('attachment://summary.png')));
    const lines = describeSummary('messages', summary, 7, [], { channelExists: () => true, lang });
    if (lines.length) container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)).addTextDisplayComponents(new TextDisplayBuilder().setContent(lines.join('\n')));
    return { components: [container], files: [new AttachmentBuilder(buildSummaryCard({ guildName: 'Petto', days: 7, metric: 'messages', summary, lang }), { name: 'summary.png' })] };
  },
});

// Protection: the alert the anti-scam sends when it catches an account (`sendAlert` is not exported by the bot, so it is read from a copy of its file
// that exports it, and the channel it writes to is a stand-in that keeps the message), and the panel of the honeypot channel.
const Module = require('node:module');
const antiScamFile = path.join(botRoot, 'src', 'utils', 'antiScam.js');
const antiScamCopy = new Module(antiScamFile);
antiScamCopy.filename = antiScamFile;
antiScamCopy.paths = Module._nodeModulePaths(path.dirname(antiScamFile));
antiScamCopy._compile(`${fs.readFileSync(antiScamFile, 'utf8')}\nmodule.exports.sendAlert = sendAlert;`, antiScamFile);
const SCAMMER = '900000000000000002';
await shot('anti-scam', 'staff-alerts', {
  names: { [SCAMMER]: 'freenitro_giveaway' },
  build: async (lang) => {
    let sent = null;
    const channel = { isTextBased: () => true, send: async (payload) => { sent = payload; } };
    const guild = { id: 'g', name: 'Petto', channels: { fetch: async () => channel }, roles: { cache: new Map() } };
    await antiScamCopy.exports.sendAlert({}, guild, { alert_channel_id: '1', ping_role_id: null }, {
      message: { author: { id: SCAMMER, username: 'freenitro_giveaway' } },
      detection: { signal: 'multi-channel', detail: t(lang, 'security.antiscam.detail.multiChannel', { count: 5 }) },
      outcome: t(lang, 'security.antiscam.outcome.timeout', { minutes: 60, case: 130 }), deleted: 5, appliedAction: 'timeout',
    }, lang);
    return sent;
  },
});
const { buildHoneypotPanel, buildHoneypotImageAttachment } = load('src/utils/honeypotPanel.js');
await shot('honeypot', 'do-not-write-here', { build: async (lang) => ({ components: [buildHoneypotPanel({ punishment: 'softban', caughtCount: 37, lang })], files: [buildHoneypotImageAttachment()] }) });

// The analysis of `!stats`: the pictures and lines of the bot for a made-up server whose members are the team. The numbers are invented
// (a community of 1,840 members); the pictures, the lines and the panel are what the bot draws.
const statsV2 = load('src/utils/statsV2.js');
const statsCards = load('src/imgutils/statsCards.js');
const { describeStats, quietLine } = load('src/utils/statsLines.js');
const { buildPrivacyPanel } = load('src/utils/statsPanels.js');
const { botDay } = load('src/utils/botTime.js');
const DAYS = 14;
const dayAt = (back) => botDay(new Date(NOW - back * 86_400_000));
const HOURLY = [2, 1, 1, 0, 0, 1, 3, 6, 9, 12, 14, 15, 16, 15, 14, 16, 18, 21, 26, 30, 34, 31, 22, 9];
const CH = { 111: 'general', 222: 'memes', 333: 'gaming-voice', 444: 'music-voice', 555: 'bots', 666: 'announcements' };
const TEAM = Object.keys(people);
let seed = 11;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const rows = { channelRows: [], hourlyRows: [], flowRows: [], contentRows: [], lifespanRows: [], memberDaily: [] };
const userRows = [];
for (let back = 0; back < DAYS * 2; back += 1) {
  const weekday = (new Date(`${dayAt(back)}T00:00:00Z`).getUTCDay() + 6) % 7;
  const f = (weekday >= 5 ? 1.35 : 1) * (back < DAYS ? 1.15 : 0.95) * (0.85 + rnd() * 0.3);
  Object.keys(CH).forEach((id, n) => rows.channelRows.push({ channel_id: id, day: dayAt(back), messages: Math.round((id === '666' ? 6 : 640 - n * 130) * f), reactions: Math.round(60 * f), voice_seconds: id === '333' ? Math.round(26000 * f) : id === '444' ? Math.round(11000 * f) : 0 }));
  HOURLY.forEach((value, hour) => rows.hourlyRows.push({ day: dayAt(back), hour, messages: Math.round(value * (2 + weekday * 0.3) * f), voice_seconds: value * 80 }));
  rows.flowRows.push({ day: dayAt(back), joins: Math.round((10 + rnd() * 8) * (back < DAYS ? 1.2 : 1)), leaves: Math.round(4 + rnd() * 6), invited: 5 });
  rows.contentRows.push({ day: dayAt(back), links: Math.round(210 * f), attachments: Math.round(380 * f), replies: Math.round(760 * f), mentions: Math.round(420 * f) });
  [0, 1, 2, 3, 4].forEach((bucket) => rows.lifespanRows.push({ day: dayAt(back), bucket, members: [3, 2, 1, 1, 2][bucket] }));
  rows.memberDaily.push({ day: dayAt(back), active: Math.round(120 * f) });
  TEAM.forEach((id, n) => userRows.push({ user_id: id, day: dayAt(back), messages: Math.round((90 / (n + 1) + rnd() * 6) * f), voice_seconds: n < 4 ? Math.round(2600 / (n + 1)) : 0 }));
}
const sumBy = (filter) => Object.values(userRows.filter(filter).reduce((acc, row) => { const e = (acc[row.user_id] ??= { user_id: row.user_id, messages: 0, voice_seconds: 0, active_days: 0 }); e.messages += row.messages; e.voice_seconds += row.voice_seconds; e.active_days += 1; return acc; }, {}));
const inPeriod = new Set(Array.from({ length: DAYS }, (_, i) => dayAt(i)));
const memberTotals = sumBy((row) => inPeriod.has(row.day));
const analysis = statsV2.buildStatsV2({ days: DAYS, now: new Date(NOW), ...rows, memberTotals, activeDistinct: { current: 142, previous: 118 }, memberTotal: 1840 });
const channelNames = Object.fromEntries(Object.entries(CH).map(([id, name]) => [id, `#${name}`]));
const nameOf = Object.fromEntries(TEAM.map((id) => [id, people[id].name]));
const channelLabel = (id) => channelNames[id] ?? '#deleted';
const { ContainerBuilder: Box, TextDisplayBuilder: Text, SeparatorBuilder: Rule, SeparatorSpacingSize: Space, MediaGalleryBuilder: Gallery, MediaGalleryItemBuilder: GalleryItem } = require('discord.js');
const statsReply = (lang, titleKey, image, lines) => {
  const container = new Box().addTextDisplayComponents(new Text().setContent(tn(lang, 'info.stats.header', DAYS, { title: t(lang, `info.statsCard.title.${titleKey}`), server: 'Petto', count: DAYS })));
  container.addMediaGalleryComponents(new Gallery().addItems(new GalleryItem().setURL('attachment://stats.png')));
  container.addSeparatorComponents(new Rule().setDivider(true).setSpacing(Space.Small));
  container.addTextDisplayComponents(new Text().setContent([...lines, t(lang, 'info.stats.line.private')].join('\n')));
  return { components: [container], files: [new AttachmentBuilder(image, { name: 'stats.png' })] };
};
await shot('stats-overview', 'staff', { typed: '!stats', who: KIRA, build: async (lang) => statsReply(lang, 'overview', statsCards.buildTrendCard({ guildName: 'Petto', days: DAYS, stats: analysis, lang }), describeStats('overview', analysis, lang)) });
await shot('stats-heatmap', 'staff', { typed: '!stats heatmap', who: KIRA, build: async (lang) => statsReply(lang, 'heatmap', statsCards.buildHeatmapCard({ guildName: 'Petto', days: DAYS, stats: analysis, lang }), describeStats('heatmap', analysis, lang)) });
await shot('stats-channels', 'staff', {
  typed: '!stats channels', who: KIRA, names: { ...CH, 777: 'old-rules', 888: 'archive' },
  build: async (lang) => statsReply(lang, 'channels', statsCards.buildTopCard({ guildName: 'Petto', days: DAYS, kind: 'channels', lang, messages: analysis.topChannels.messages.map((r) => ({ label: channelLabel(r.id), value: r.messages, share: r.share })), voice: analysis.topChannels.voice.map((r) => ({ label: channelLabel(r.id), value: r.voiceSeconds, share: r.share })) }), [quietLine(['777', '888'], lang, (id) => `<#${id}>`)]),
});
await shot('stats-members', 'staff', {
  typed: '!stats members', who: KIRA,
  build: async (lang) => {
    const concentration = describeStats('members', analysis, lang)[0] ?? null;
    return statsReply(lang, 'members', statsCards.buildTopCard({ guildName: 'Petto', days: DAYS, kind: 'members', lang, note: concentration ? concentration.replace(/^<:[^>]+>\s*/, '').replace(/\*\*/g, '') : null, messages: analysis.topMembers.messages.map((r) => ({ label: nameOf[r.id], value: r.messages, share: r.share })), voice: analysis.topMembers.voice.map((r) => ({ label: nameOf[r.id], value: r.voiceSeconds, share: r.share })) }), []);
  },
});
await shot('stats-growth', 'staff', { typed: '!stats growth', who: KIRA, build: async (lang) => statsReply(lang, 'growth', statsCards.buildGrowthCard({ guildName: 'Petto', days: DAYS, stats: analysis, lang }), describeStats('growth', analysis, lang)) });
await shot('stats-compare', 'staff', { typed: '!stats compare', who: KIRA, build: async (lang) => statsReply(lang, 'compare', statsCards.buildCompareCard({ guildName: 'Petto', days: DAYS, stats: analysis, lang }), describeStats('compare', analysis, lang)) });
await shot('stats-member', 'staff', {
  typed: `!stats <@${LIAM}>`, who: KIRA,
  build: async (lang) => {
    const mine = statsV2.buildMemberStats({ userId: LIAM, days: DAYS, now: new Date(NOW), userRows: userRows.filter((row) => row.user_id === LIAM), memberTotals });
    const image = await statsCards.buildMemberCard({ guildName: 'Petto', name: people[LIAM].name, avatarUrl: people[LIAM].cdn, member: mine, lang });
    return statsReply(lang, 'member', image, []);
  },
});
await shot('stats-privacy', 'general', { typed: '!stats privacy', build: async (lang) => buildPrivacyPanel({ userId: LIAM, optedOut: false, lang }) });

// Custom commands: two commands written in Petto Code, run by the bot's own engine (the text of each is what a server owner would write).
const petto = load('src/scripting');
const { buildComponents } = load('src/utils/codeCommands.js');
const { EmbedBuilder } = (await import('node:module')).createRequire(path.join(botRoot, 'package.json'))('discord.js');
const codeData = (lang) => ({
  User: { ID: LIAM, Username: people[LIAM].name, Mention: `<@${LIAM}>` },
  Member: { RoleIDs: [] },
  Guild: { ID: '323456789012345678', Name: 'Petto HQ', MemberCount: 148 },
  Args: [],
  Lang: lang,
});
const WELCOME_CODE = {
  en: '{{ sendMessage nil (complexMessage "embed" (cembed "title" (printf "Welcome to %s, %s!" .Guild.Name .User.Username) "description" (printf "There are %d of us now. Read the rules and pick your role below." .Guild.MemberCount) "color" "#f0a88f") "components" (cslice (crow (cbutton "label" "Get the Member role" "id" "member" "style" "success") (cbutton "label" "Rules" "url" "https://petto.sbs")))) }}',
  es: '{{ sendMessage nil (complexMessage "embed" (cembed "title" (printf "¡Bienvenido a %s, %s!" .Guild.Name .User.Username) "description" (printf "Ya somos %d. Lee las reglas y elige tu rol abajo." .Guild.MemberCount) "color" "#f0a88f") "components" (cslice (crow (cbutton "label" "Obtener el rol Miembro" "id" "member" "style" "success") (cbutton "label" "Reglas" "url" "https://petto.sbs")))) }}',
  'pt-BR': '{{ sendMessage nil (complexMessage "embed" (cembed "title" (printf "Bem-vindo ao %s, %s!" .Guild.Name .User.Username) "description" (printf "Já somos %d. Leia as regras e escolha seu cargo abaixo." .Guild.MemberCount) "color" "#f0a88f") "components" (cslice (crow (cbutton "label" "Pegar o cargo Membro" "id" "member" "style" "success") (cbutton "label" "Regras" "url" "https://petto.sbs")))) }}',
};
await shot('custom-welcome', 'general', {
  typed: '!welcome',
  build: async (lang) => {
    const result = await petto.run(WELCOME_CODE[lang], codeData(lang), { now: () => NOW });
    const effect = result.effects[0];
    return { embeds: [new EmbedBuilder(effect.embed)], components: buildComponents(effect.components, 'welcome') };
  },
});
const BALL_CODE = {
  en: '{{ $a := cslice "It is certain." "Ask again later." "Very doubtful." "Without a doubt." "Better not tell you now." }}🎱 {{ index $a (randInt (len $a)) }}',
  es: '{{ $a := cslice "Es seguro." "Pregunta más tarde." "Muy dudoso." "Sin duda." "Mejor no decírtelo ahora." }}🎱 {{ index $a (randInt (len $a)) }}',
  'pt-BR': '{{ $a := cslice "É certo." "Pergunte mais tarde." "Muito duvidoso." "Sem dúvida." "Melhor não te dizer agora." }}🎱 {{ index $a (randInt (len $a)) }}',
};
await shot('custom-8ball', 'games', {
  typed: byLang({ en: '!8ball will I win the giveaway?', es: '!8ball ¿voy a ganar el sorteo?', 'pt-BR': '!8ball será que eu ganho o sorteio?' }),
  build: async (lang) => ({ content: (await petto.run(BALL_CODE[lang], codeData(lang), { random: () => 0.7 })).output }),
});

// Feeds: the notices of the accounts a server follows, built by the bot's own card (src/feeds/card.js). YouTube, Bluesky, Modrinth and the Pokémon are
// real (their public APIs answer); Twitch and Pinterest, which need keys, and the live stream, which cannot be real at any moment, are examples.
process.env.PETTO_FEED_ASSETS_URL = 'http://localhost:4399/assets/feeds';
const feedCard = load('src/feeds/card.js');
const feedYoutube = load('src/feeds/providers/youtube.js');
const feedBluesky = load('src/feeds/providers/bluesky.js');
const feedModrinth = load('src/feeds/providers/modrinth.js');
const feedPokemon = load('src/feeds/providers/pokemon.js');
const feedTwitch = load('src/feeds/providers/twitch.js');
const UPDATES_ROLE = '223456789012345678';
const feedNames = { [UPDATES_ROLE]: 'Updates' };
const feedOf = (message, extra = {}) => ({ message, ping_roles: [UPDATES_ROLE], options: {}, ...extra });
const DUCK = 'http://localhost:4399/assets/duck-purple.png';
const feedShot = (id, channel, build, typed = null) => shot(id, channel, { build: async (lang) => build(lang), names: feedNames, ...(typed ? { typed } : {}) });
const feedBot = (feed, item, lang) => feedCard.buildFeedMessage(feed, item, { lang });

const mkbhd = await feedYoutube.fetchChannel('UCBJycsmduvYEL83R_U4JriQ');
const mkbhdAvatar = (/og:image" content="([^"]+)"/.exec(await (await realFetch('https://www.youtube.com/channel/UCBJycsmduvYEL83R_U4JriQ', { headers: { 'User-Agent': 'Mozilla/5.0' } })).text()) ?? [])[1] ?? null;
const longVideo = mkbhd.entries.find((entry) => !entry.short);
const shortVideo = mkbhd.entries.find((entry) => entry.short);
await feedShot('feed-youtube-video', 'videos', (lang) => feedBot(feedOf({ en: 'New video from **{feed.author}**!', es: '¡Nuevo video de **{feed.author}**!', 'pt-BR': 'Vídeo novo de **{feed.author}**!' }[lang]), feedYoutube.toItem(longVideo, 'video', { avatar: mkbhdAvatar }), lang));
await feedShot('feed-youtube-short', 'videos', (lang) => feedBot(feedOf('', { ping_roles: [] }), feedYoutube.toItem(shortVideo, 'short', { avatar: mkbhdAvatar }), lang));
await feedShot('feed-youtube-live', 'directos', (lang) => feedBot(feedOf({ en: '🔴 We are live!', es: '🔴 ¡Estamos en directo!', 'pt-BR': '🔴 Estamos ao vivo!' }[lang]), {
  platform: 'youtube', type: 'live', title: { en: 'Petto Studio · building the feeds, live', es: 'Petto Studio · construyendo los feeds en vivo', 'pt-BR': 'Petto Studio · construindo os feeds ao vivo' }[lang], url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  description: { en: 'Come and say hi, we answer questions in the chat.', es: 'Pasa a saludar, respondemos preguntas en el chat.', 'pt-BR': 'Passe para dizer oi, respondemos perguntas no chat.' }[lang],
  image: DUCK, avatar: DUCK, author: 'Petto Studio', publishedAt: NOW - 120000, extra: '👁 1,284',
}, lang));
await feedShot('feed-twitch-live', 'directos', (lang) => feedBot(feedOf({ en: '{feed.author} is live!', es: '¡{feed.author} está en vivo!', 'pt-BR': '{feed.author} está ao vivo!' }[lang]), {
  platform: 'twitch', type: 'live', title: { en: 'Chill Minecraft night · come hang out', es: 'Noche tranquila de Minecraft · pasen a saludar', 'pt-BR': 'Noite tranquila de Minecraft · apareça' }[lang], url: 'https://www.twitch.tv/pettoplays',
  image: DUCK, avatar: DUCK, author: 'PettoPlays', publishedAt: NOW - 300000, extra: '🎮 Minecraft · 👁 342',
}, lang));
const skyActor = await feedBluesky.resolveActor('jay.bsky.team');
const skyPost = (await feedBluesky.fetchPosts(skyActor.id, 20))[0];
await feedShot('feed-bluesky', 'social', (lang) => feedBot(feedOf('', { ping_roles: [] }), feedBluesky.toItem(skyPost), lang));
const sodium = await feedModrinth.resolveProject('sodium');
const sodiumVersion = (await feedModrinth.fetchVersions(sodium.id, 3))[0];
await feedShot('feed-modrinth', 'minecraft', (lang) => feedBot(feedOf({ en: 'A new version is out:', es: 'Salió una versión nueva:', 'pt-BR': 'Saiu uma versão nova:' }[lang]), feedModrinth.toItem(sodium, sodiumVersion), lang));
await feedShot('feed-pokemon', 'pokemon', async (lang) => feedBot(feedOf('', { ping_roles: [] }), feedPokemon.toItem(await feedPokemon.fetchPokemon(feedPokemon.pokemonOfDay(), lang), NOW - 180000), lang));
await feedShot('feed-pinterest', 'inspo', (lang) => feedBot(feedOf('', { ping_roles: [] }), {
  platform: 'pinterest', type: 'pin', title: { en: 'Cozy purple desk setup', es: 'Escritorio morado acogedor', 'pt-BR': 'Mesa roxa aconchegante' }[lang], url: 'https://www.pinterest.com/', description: { en: 'Saved to the board Desk ideas', es: 'Guardado en el tablero Ideas de escritorio', 'pt-BR': 'Salvo no quadro Ideias de mesa' }[lang],
  image: DUCK, avatar: DUCK, author: 'pettodesigns', publishedAt: NOW - 3600000,
}, lang));

await saveEmoji(shots);
fs.writeFileSync(path.join(SHOT_DIR, 'core.json'), `${JSON.stringify(shots, null, 1)}\n`);
console.log(`Wrote ${Object.keys(shots).length} screenshots of the systems`);
process.exit(0);
