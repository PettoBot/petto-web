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
const BOT = { name: 'Petto', bot: true, avatar: '/assets/bot-avatar.png' };

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
    fs.writeFileSync(path.join(IMG_DIR, name), file.attachment);
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

await saveEmoji(shots);
fs.writeFileSync(path.join(SHOT_DIR, 'core.json'), `${JSON.stringify(shots, null, 1)}\n`);
console.log(`Wrote ${Object.keys(shots).length} screenshots of the systems`);
process.exit(0);
