import generated from './commands.generated.json';

type Lang = 'en' | 'es' | 'pt-BR';
type Localized = Record<Lang, string>;

interface GeneratedSub { name: string; desc: Record<string, string>; args: { name: string; required: boolean }[]; words: string[]; shortcuts: string[] }
interface GeneratedCommand {
  name: string;
  aliases: string[];
  integration?: { desc: Record<string, string>; args: { name: string; required: boolean }[]; subs: GeneratedSub[] };
}

/** A row of the commands page: the name (what the search looks at), the syntax, the description and the other ways to type it. */
export type IntegrationRow = readonly [name: string, syntax: string, description: string, also: string[]];

interface Meta { id: string; command: string; icon: string; title: string; blurb: Localized; examples: string[] }

// The order of the sections is the order of this list. A section is one command of the bot (`command`), shown with its own title, a sentence
// about it and a few examples; what it can do is read from the bot, so the page cannot say something the bot does not.
const META: Meta[] = [
  { id: 'lastfm', command: 'lastfm', icon: 'ph:vinyl-record-fill', title: 'Last.fm', examples: ['!lastfm link <your name>', '!np', '!lastfm whoknows Radiohead'], blurb: {
    en: 'Link your Last.fm name once and show what you listen to: now playing, recent songs, your tops, an artist, how alike two members are, and who in the server listens to an artist the most.',
    es: 'Vincula tu nombre de Last.fm una vez y muestra lo que escuchas: lo que suena ahora, canciones recientes, tus tops, un artista, cuánto se parecen dos miembros y quién del servidor escucha más a un artista.',
    'pt-BR': 'Vincule seu nome do Last.fm uma vez e mostre o que você ouve: o que toca agora, músicas recentes, seus tops, um artista, o quanto dois membros se parecem e quem do servidor mais ouve um artista.' } },
  { id: 'deezer', command: 'deezer', icon: 'ph:music-notes-fill', title: 'Deezer', examples: ['!deezer creep radiohead', '!deezer artist radiohead', '!deezer album ok computer'], blurb: {
    en: 'Songs, artists and albums, with a picture of the cover and a 30 second preview.',
    es: 'Canciones, artistas y álbumes, con una imagen de la portada y un adelanto de 30 segundos.',
    'pt-BR': 'Músicas, artistas e álbuns, com uma imagem da capa e uma prévia de 30 segundos.' } },
  { id: 'itunes', command: 'itunes', icon: 'ph:apple-logo-fill', title: 'Apple (iTunes)', examples: ['!itunes creep radiohead', '!itunes app minecraft', '!itunes podcast the daily'], blurb: {
    en: 'Songs and albums of Apple Music, apps of the App Store and podcasts.',
    es: 'Canciones y álbumes de Apple Music, apps de la App Store y podcasts.',
    'pt-BR': 'Músicas e álbuns do Apple Music, apps da App Store e podcasts.' } },
  { id: 'twitch', command: 'twitch', icon: 'ph:twitch-logo-fill', title: 'Twitch', examples: ['!twitch ibai', '!twitch clips ibai', '!twitch top'], blurb: {
    en: 'See if a channel is live, what it plays and how many are watching; its best clips; and what is most watched right now.',
    es: 'Mira si un canal está en vivo, qué juega y cuánta gente lo ve; sus mejores clips; y lo más visto ahora mismo.',
    'pt-BR': 'Veja se um canal está ao vivo, o que joga e quantas pessoas assistem; seus melhores clipes; e o mais visto agora.' } },
  { id: 'youtube', command: 'youtube', icon: 'ph:youtube-logo-fill', title: 'YouTube', examples: ['!yt @MrBeast', '!yt latest @MrBeast', '!yt never gonna give you up'], blurb: {
    en: 'Videos by link or by words, channels by @handle, the newest video of a channel and a search with five results.',
    es: 'Videos por enlace o por palabras, canales por @usuario, el último video de un canal y una búsqueda con cinco resultados.',
    'pt-BR': 'Vídeos por link ou por palavras, canais por @usuário, o vídeo mais recente de um canal e uma busca com cinco resultados.' } },
  { id: 'minecraft', command: 'minecraft', icon: 'ph:cube-fill', title: 'Minecraft', examples: ['!mc Notch', '!mc skin Notch', '!mc hypixel.net'], blurb: {
    en: 'A Java player (UUID, skin, head, cape) and the status of a server: who is online, the version and the message of the day.',
    es: 'Un jugador de Java (UUID, skin, cabeza, capa) y el estado de un servidor: quién está en línea, la versión y el mensaje del día.',
    'pt-BR': 'Um jogador de Java (UUID, skin, cabeça, capa) e o status de um servidor: quem está online, a versão e a mensagem do dia.' } },
  { id: 'modrinth', command: 'modrinth', icon: 'ph:puzzle-piece-fill', title: 'Modrinth', examples: ['!modrinth sodium', '!modrinth shader bsl'], blurb: {
    en: 'Minecraft mods, modpacks, resource packs, shaders and plugins, with downloads and the versions they work on.',
    es: 'Mods, modpacks, paquetes de recursos, shaders y plugins de Minecraft, con descargas y las versiones en que funcionan.',
    'pt-BR': 'Mods, modpacks, pacotes de recursos, shaders e plugins de Minecraft, com downloads e as versões em que funcionam.' } },
  { id: 'github', command: 'github', icon: 'ph:github-logo-fill', title: 'GitHub', examples: ['!gh octocat', '!gh PettoBot/petto-bot', '!gh commits PettoBot/petto-bot'], blurb: {
    en: 'Profiles, repositories, the latest release, commits, issues, pull requests, languages and contributors.',
    es: 'Perfiles, repositorios, la última versión, commits, issues, pull requests, lenguajes y contribuidores.',
    'pt-BR': 'Perfis, repositórios, a última versão, commits, issues, pull requests, linguagens e contribuidores.' } },
  { id: 'steam', command: 'steam', icon: 'ph:steam-logo-fill', title: 'Steam', examples: ['!steam gaben', '!steam games gaben'], blurb: {
    en: 'A profile with its level, what they are playing and their games of the last two weeks, and the games played the most.',
    es: 'Un perfil con su nivel, lo que está jugando y sus juegos de las últimas dos semanas, y los juegos más jugados.',
    'pt-BR': 'Um perfil com seu nível, o que está jogando e seus jogos das últimas duas semanas, e os jogos mais jogados.' } },
  { id: 'roblox', command: 'roblox', icon: 'ph:game-controller-fill', title: 'Roblox', examples: ['!rbx Builderman', '!roblox avatar Builderman', '!roblox group Roblox'], blurb: {
    en: 'Profiles with friends and groups, the full avatar, and groups with their members and owner.',
    es: 'Perfiles con amigos y grupos, el avatar de cuerpo entero, y grupos con sus miembros y dueño.',
    'pt-BR': 'Perfis com amigos e grupos, o avatar de corpo inteiro, e grupos com seus membros e dono.' } },
  { id: 'chess', command: 'chess', icon: 'ph:crown-simple-fill', title: 'Chess', examples: ['!chess hikaru', '!chess lichess DrNykterstein'], blurb: {
    en: 'Players of Chess.com and Lichess: ratings by mode, games, title and since when.',
    es: 'Jugadores de Chess.com y Lichess: ratings por modo, partidas, título y desde cuándo.',
    'pt-BR': 'Jogadores do Chess.com e Lichess: ratings por modo, partidas, título e desde quando.' } },
  { id: 'anilist', command: 'anilist', icon: 'ph:television-fill', title: 'AniList (anime & manga)', examples: ['!anime frieren', '!manga berserk', '!anilist character frieren'], blurb: {
    en: 'Anime, manga and characters, with the score, the studio and the synopsis (spoilers are cut).',
    es: 'Anime, manga y personajes, con la nota, el estudio y la sinopsis (los spoilers se cortan).',
    'pt-BR': 'Anime, mangá e personagens, com a nota, o estúdio e a sinopse (os spoilers são cortados).' } },
  { id: 'tmdb', command: 'tmdb', icon: 'ph:film-strip-fill', title: 'Movies & TV (TMDB)', examples: ['!movie interstellar', '!tv dark'], blurb: {
    en: 'Movies and series with the score, the genres, the release and the synopsis in the language of the server.',
    es: 'Películas y series con la nota, los géneros, el estreno y la sinopsis en el idioma del servidor.',
    'pt-BR': 'Filmes e séries com a nota, os gêneros, a estreia e a sinopse no idioma do servidor.' } },
  { id: 'pokemon', command: 'pokemon', icon: 'ph:circle-half-fill', title: 'Pokémon', examples: ['!pokemon pikachu', '!pokemon 25'], blurb: {
    en: 'Types, height, weight, abilities, base stats and the Pokédex entry of any Pokémon.',
    es: 'Tipos, altura, peso, habilidades, estadísticas base y la entrada de Pokédex de cualquier Pokémon.',
    'pt-BR': 'Tipos, altura, peso, habilidades, status base e a entrada da Pokédex de qualquer Pokémon.' } },
  { id: 'wikipedia', command: 'wikipedia', icon: 'ph:book-open-text-fill', title: 'Wikipedia', examples: ['!wp minecraft'], blurb: {
    en: 'The summary of an article, in the language of the server.',
    es: 'El resumen de un artículo, en el idioma del servidor.',
    'pt-BR': 'O resumo de um artigo, no idioma do servidor.' } },
  { id: 'package', command: 'package', icon: 'ph:package-fill', title: 'npm & PyPI', examples: ['!npm discord.js', '!pypi requests'], blurb: {
    en: 'Packages of npm and PyPI: version, downloads, license, size and where the code is.',
    es: 'Paquetes de npm y PyPI: versión, descargas, licencia, tamaño y dónde está el código.',
    'pt-BR': 'Pacotes do npm e PyPI: versão, downloads, licença, tamanho e onde está o código.' } },
  { id: 'crypto', command: 'crypto', icon: 'ph:currency-btc-fill', title: 'Crypto', examples: ['!crypto bitcoin', '!coin eth'], blurb: {
    en: 'The price of a cryptocurrency in dollars, its change today and its market.',
    es: 'El precio de una criptomoneda en dólares, su cambio de hoy y su mercado.',
    'pt-BR': 'O preço de uma criptomoeda em dólares, a variação de hoje e seu mercado.' } },
  { id: 'currency', command: 'currency', icon: 'ph:currency-circle-dollar-fill', title: 'Currency', examples: ['!currency 100 usd cop', '!cur 50 eur mxn brl'], blurb: {
    en: 'Change an amount from one currency to others, more than 160 of them (pesos included).',
    es: 'Cambia una cantidad de una moneda a otras, más de 160 (pesos incluidos).',
    'pt-BR': 'Converte uma quantia de uma moeda para outras, mais de 160 (pesos incluídos).' } },
  { id: 'animal', command: 'animal', icon: 'ph:paw-print-fill', title: 'Animals', examples: ['!cat', '!dog', '!fox'], blurb: {
    en: 'A random picture of a cat, a dog or a fox.',
    es: 'Una foto al azar de un gato, un perro o un zorro.',
    'pt-BR': 'Uma foto aleatória de um gato, um cachorro ou uma raposa.' } },
];

const GROUP: Localized = { en: 'Integrations', es: 'Integraciones', 'pt-BR': 'Integrações' };
const TRY: Localized = { en: 'Try', es: 'Prueba', 'pt-BR': 'Experimente' };

const byName = new Map((generated as GeneratedCommand[]).filter((c) => c.integration).map((c) => [c.name, c]));
const syntax = (command: string, sub: string | null, args: { name: string; required: boolean }[]) => [`!${command}`, sub, ...args.map((a) => (a.required ? `<${a.name}>` : `[${a.name}]`))].filter(Boolean).join(' ');

/** The rows of one command: a row for each subcommand, or one row when it has none. */
function rowsOf(command: GeneratedCommand, lang: Lang): IntegrationRow[] {
  const info = command.integration!;
  const aliases = command.aliases ?? [];
  if (!info.subs.length) {
    return [[command.name, syntax(command.name, null, info.args), info.desc[lang] ?? info.desc.en, aliases.map((alias) => syntax(alias, null, info.args))]];
  }
  return info.subs.map((sub) => {
    const also = [
      ...sub.shortcuts.map((alias) => `!${alias}`),
      ...aliases.map((alias) => syntax(alias, sub.name, [])),
      ...sub.words.filter((word) => !sub.shortcuts.includes(word)).map((word) => `!${command.name} ${word}`),
    ].filter((value, index, list) => list.indexOf(value) === index).slice(0, 6);
    return [`${command.name} ${sub.name}`, syntax(command.name, sub.name, sub.args), sub.desc[lang] ?? sub.desc.en, also] as IntegrationRow;
  });
}

/** The sections of the commands page that are about one service each, in the order of `META`. */
export function integrationCategories(lang: Lang) {
  return META.flatMap((meta) => {
    const command = byName.get(meta.command);
    if (!command) return [];
    return [{
      id: meta.id,
      title: meta.title,
      desc: meta.blurb[lang],
      group: GROUP[lang],
      icon: meta.icon,
      tryLabel: TRY[lang],
      examples: meta.examples,
      cmds: rowsOf(command, lang),
    }];
  });
}

/** True for a command that has a section of its own, so the generic list of its category leaves it out. */
export const hasSection = (name: string) => byName.has(name);

/** The problems of the sections: a service of the list that the bot does not have, or a command of the bot that no section shows. */
export function integrationProblems(): string[] {
  const shown = new Set(META.map((meta) => meta.command));
  const problems: string[] = [];
  for (const meta of META) if (!byName.has(meta.command)) problems.push(`"${meta.command}" has a section but the bot does not have it`);
  for (const name of byName.keys()) if (!shown.has(name)) problems.push(`"${name}" is an integration of the bot with no section`);
  return problems;
}
