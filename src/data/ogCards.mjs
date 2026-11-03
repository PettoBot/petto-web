// The picture a link to the site shows when it is shared (Discord, X, Telegram, Slack...), as DATA. Every card is one entry: a headline, a tagline,
// chips with the topics, an icon, and the panel (the small screen on the right) that matches what the page is about. `scripts/og/render.mjs` draws
// them into /public/assets/og (once per language) with Petto's look, `scripts/check-og-images.mjs` makes sure they are all there, and the layout
// (src/layouts/Base.astro) asks `ogCardFor(path)` which one a page uses. Adding a page to the system is adding an entry here and a line in CARD_PATHS.
// A page nobody listed (and a page under one that is listed, like /changelog/0.7.7) uses the card of its parent, and in the end the home card.
//
// Icons are Phosphor names without the prefix (`gavel-fill`): they are drawn into the pictures at build time, not by the site, so the site's icon list does not need them.
// panel: the kind of mini screen: toggles, list, case, ticket, rank, giveaway, dash, status, article, code, embed, doc, plan, server, stats.
// Text that is a name or a number (a member, a version) is the same in every language; the rest is written in the three.

export const LANGS = ['en', 'es', 'pt-BR'];
/** @type {(en: string, es: string, pt: string) => Record<string, string>} */
const L = (en, es, pt) => ({ en, es, 'pt-BR': pt });
/** @type {(en: string[], es: string[], pt: string[]) => Record<string, string[]>} */
const LL = (en, es, pt) => ({ en, es, 'pt-BR': pt });

/**
 * @typedef {{ icon: string, hue?: string, t: Record<string,string> | string, s?: Record<string,string> | string, tag?: Record<string,string> | string, on?: boolean }} Row
 * @typedef {{ panel: string, icon: string, hue?: string, title: Record<string,string>, tagline: Record<string,string>, chips: Record<string,string[]>, rows?: Row[], data?: Record<string, any> }} Card
 */

/** @type {Record<string, Card>} */
export const CARDS = {
  home: {
    panel: 'toggles', icon: 'paw-print-fill', hue: 'gold',
    title: L('Your server, looked after', 'Tu servidor, bien cuidado', 'Seu servidor, bem cuidado'),
    tagline: L('Moderation, tickets, levels and giveaways, with a dashboard you can preview.', 'Moderación, tickets, niveles y sorteos, con un dashboard con vista previa.', 'Moderação, tickets, níveis e sorteios, com um dashboard com prévia.'),
    chips: LL(['Moderation', 'Tickets', 'Levels', 'Giveaways', 'Dashboard'], ['Moderación', 'Tickets', 'Niveles', 'Sorteos', 'Dashboard'], ['Moderação', 'Tickets', 'Níveis', 'Sorteios', 'Dashboard']),
    rows: [
      { icon: 'shield-check-fill', hue: 'peach', t: L('Moderation', 'Moderación', 'Moderação'), s: L('Bans, warns and auto-mod', 'Bans, warns y auto-mod', 'Bans, warns e auto-mod'), on: true },
      { icon: 'ticket-fill', hue: 'gold', t: 'Tickets', s: L('Support with forms and logs', 'Soporte con formularios y logs', 'Suporte com formulários e logs'), on: true },
      { icon: 'chart-line-up-fill', hue: 'green', t: L('Levels & Rewards', 'Niveles y recompensas', 'Níveis e recompensas'), s: L('XP, ranks and role prizes', 'XP, rangos y roles de premio', 'XP, ranks e cargos de prêmio'), on: true },
      { icon: 'gift-fill', hue: 'pink', t: L('Giveaways', 'Sorteos', 'Sorteios'), s: L('Fair, with requirements', 'Justos, con requisitos', 'Justos, com requisitos'), on: false },
    ],
  },
  features: {
    panel: 'toggles', icon: 'squares-four-fill', hue: 'gold',
    title: L('Everything a server needs', 'Todo lo que un servidor necesita', 'Tudo que um servidor precisa'),
    tagline: L('Ten systems that work together, each with a live preview in the dashboard.', 'Diez sistemas que trabajan juntos, cada uno con vista previa en vivo en el dashboard.', 'Dez sistemas que trabalham juntos, cada um com prévia ao vivo no dashboard.'),
    chips: LL(['Moderation', 'Protection', 'Tickets', 'Levels', 'Feeds'], ['Moderación', 'Protección', 'Tickets', 'Niveles', 'Feeds'], ['Moderação', 'Proteção', 'Tickets', 'Níveis', 'Feeds']),
    rows: [
      { icon: 'gavel-fill', hue: 'red', t: L('Moderation', 'Moderación', 'Moderação'), s: L('Cases with history', 'Casos con historial', 'Casos com histórico'), on: true },
      { icon: 'chat-teardrop-text-fill', hue: 'blue', t: 'Tickets', s: L('A panel of your own', 'Un panel a tu manera', 'Um painel do seu jeito'), on: true },
      { icon: 'chart-line-up-fill', hue: 'green', t: L('Levels', 'Niveles', 'Níveis'), s: L('Text and voice XP', 'XP de texto y voz', 'XP de texto e voz'), on: true },
      { icon: 'bell-ringing-fill', hue: 'peach', t: 'Feeds', s: L('Posts from other services', 'Publicaciones de otros servicios', 'Posts de outros serviços'), on: true },
    ],
  },
  'feature-moderation': {
    panel: 'case', icon: 'gavel-fill', hue: 'red',
    title: L('Moderation that keeps the history', 'Moderación que guarda el historial', 'Moderação que guarda o histórico'),
    tagline: L('Ban, kick, mute and warn with a case for each one.', 'Banea, expulsa, silencia y advierte con un caso por acción.', 'Bana, expulsa, silencia e avisa com um caso por ação.'),
    chips: LL(['Bans', 'Warns', 'Cases', 'Notes'], ['Bans', 'Warns', 'Casos', 'Notas'], ['Bans', 'Warns', 'Casos', 'Notas']),
  },
  'feature-protection': {
    panel: 'toggles', icon: 'shield-check-fill', hue: 'gold',
    title: L('Protection that acts before you do', 'Protección que actúa antes que tú', 'Proteção que age antes de você'),
    tagline: L('Raids, nukes and scams are stopped while the staff is away.', 'Raids, nukes y estafas se frenan mientras el staff no está.', 'Raids, nukes e golpes são barrados enquanto a equipe não está.'),
    chips: LL(['Anti-raid', 'Anti-nuke', 'Anti-scam', 'Logs'], ['Anti-raid', 'Anti-nuke', 'Anti-estafa', 'Logs'], ['Anti-raid', 'Anti-nuke', 'Anti-golpe', 'Logs']),
    rows: [
      { icon: 'siren-fill', hue: 'red', t: 'Anti-raid', s: L('Joins in bursts are held', 'Entradas en masa retenidas', 'Entradas em massa retidas'), on: true },
      { icon: 'shield-warning-fill', hue: 'peach', t: 'Anti-nuke', s: L('Mass deletes are undone', 'Borrados masivos revertidos', 'Exclusões em massa revertidas'), on: true },
      { icon: 'prohibit-fill', hue: 'gold', t: L('Anti-scam', 'Anti-estafa', 'Anti-golpe'), s: L('Bad links removed', 'Links peligrosos fuera', 'Links perigosos removidos'), on: true },
      { icon: 'scroll-fill', hue: 'blue', t: 'Logs', s: L('Every action is saved', 'Cada acción queda guardada', 'Cada ação fica salva'), on: true },
    ],
  },
  'feature-tickets': {
    panel: 'ticket', icon: 'chat-teardrop-text-fill', hue: 'blue',
    title: L('Tickets with a panel of your own', 'Tickets con un panel a tu manera', 'Tickets com um painel do seu jeito'),
    tagline: L('A private channel with the team, with the look you choose.', 'Un canal privado con el equipo, con el aspecto que elijas.', 'Um canal privado com a equipe, com o visual que você escolher.'),
    chips: LL(['Panels', 'Forms', 'Transcripts', 'Claims'], ['Paneles', 'Formularios', 'Transcripciones', 'Reclamos'], ['Painéis', 'Formulários', 'Transcrições', 'Reivindicações']),
  },
  'feature-levels': {
    panel: 'rank', icon: 'chart-line-up-fill', hue: 'green',
    title: L('Levels, ranks and rewards', 'Niveles, rangos y recompensas', 'Níveis, ranks e recompensas'),
    tagline: L('Text and voice XP, with protection against farming and a rank card for everyone.', 'XP de texto y voz, con protección contra farmeo y una tarjeta de rango para todos.', 'XP de texto e voz, com proteção contra farm e um card de rank para todos.'),
    chips: LL(['XP', 'Ranks', 'Rewards', 'Voice'], ['XP', 'Rangos', 'Recompensas', 'Voz'], ['XP', 'Ranks', 'Recompensas', 'Voz']),
  },
  'feature-giveaways': {
    panel: 'giveaway', icon: 'gift-fill', hue: 'pink',
    title: L('Giveaways that are fair', 'Sorteos justos', 'Sorteios justos'),
    tagline: L('Start one in seconds, ask for what you want and let the bot pick.', 'Crea uno en segundos, pide lo que quieras y deja que el bot elija.', 'Crie um em segundos, peça o que quiser e deixe o bot sortear.'),
    chips: LL(['Requirements', 'Winners', 'Rerolls', 'Levels'], ['Requisitos', 'Ganadores', 'Resorteos', 'Niveles'], ['Requisitos', 'Vencedores', 'Re-sorteios', 'Níveis']),
  },
  'feature-integrations': {
    panel: 'list', icon: 'plug-fill', hue: 'blue',
    title: L('19 lookups of other services', '19 consultas a otros servicios', '19 consultas a outros serviços'),
    tagline: L('Songs, servers, profiles and prices without leaving Discord.', 'Canciones, servidores, perfiles y precios sin salir de Discord.', 'Músicas, servidores, perfis e preços sem sair do Discord.'),
    chips: LL(['Minecraft', 'Chess', 'Steam', 'Prices'], ['Minecraft', 'Ajedrez', 'Steam', 'Precios'], ['Minecraft', 'Xadrez', 'Steam', 'Preços']),
    rows: [
      { icon: 'cube-fill', hue: 'green', t: '/minecraft', s: L('Player and skin', 'Jugador y skin', 'Jogador e skin'), tag: 'OK' },
      { icon: 'crown-simple-fill', hue: 'gold', t: '/chess', s: L('Rating and games', 'Rating y partidas', 'Rating e partidas'), tag: 'OK' },
      { icon: 'steam-logo-fill', hue: 'blue', t: '/steam', s: L('Profile and games', 'Perfil y juegos', 'Perfil e jogos'), tag: 'OK' },
      { icon: 'currency-btc-fill', hue: 'peach', t: '/crypto', s: L('Live price', 'Precio en vivo', 'Preço ao vivo'), tag: 'OK' },
    ],
  },
  'feature-feeds': {
    panel: 'list', icon: 'bell-ringing-fill', hue: 'peach',
    title: L('Notifications from everywhere', 'Notificaciones de todos lados', 'Notificações de todo lugar'),
    tagline: L('Videos, streams, posts and new versions, posted in your channel.', 'Videos, directos, publicaciones y versiones nuevas, en tu canal.', 'Vídeos, lives, posts e novas versões, no seu canal.'),
    chips: LL(['YouTube', 'Twitch', 'Reddit', 'RSS'], ['YouTube', 'Twitch', 'Reddit', 'RSS'], ['YouTube', 'Twitch', 'Reddit', 'RSS']),
    rows: [
      { icon: 'youtube-logo-fill', hue: 'red', t: 'YouTube', s: L('New video', 'Video nuevo', 'Vídeo novo'), tag: L('now', 'ahora', 'agora') },
      { icon: 'twitch-logo-fill', hue: 'purple', t: 'Twitch', s: L('Live stream', 'En directo', 'Ao vivo'), tag: 'LIVE' },
      { icon: 'chat-circle-text-fill', hue: 'peach', t: 'Reddit', s: L('New post', 'Publicación nueva', 'Post novo'), tag: '2m' },
      { icon: 'github-logo-fill', hue: 'blue', t: 'GitHub', s: L('Release v2.4', 'Versión v2.4', 'Versão v2.4'), tag: '1h' },
    ],
  },
  'feature-community': {
    panel: 'toggles', icon: 'users-three-fill', hue: 'green',
    title: L('A community that feels alive', 'Una comunidad que se siente viva', 'Uma comunidade que parece viva'),
    tagline: L('Welcomes, birthdays, polls, suggestions and the small things that make a server yours.', 'Bienvenidas, cumpleaños, encuestas, sugerencias y los detalles que hacen un servidor tuyo.', 'Boas-vindas, aniversários, enquetes, sugestões e os detalhes que fazem um servidor seu.'),
    chips: LL(['Welcome', 'Birthdays', 'Polls', 'Suggestions'], ['Bienvenida', 'Cumpleaños', 'Encuestas', 'Sugerencias'], ['Boas-vindas', 'Aniversários', 'Enquetes', 'Sugestões']),
    rows: [
      { icon: 'hand-waving-fill', hue: 'gold', t: L('Welcome', 'Bienvenida', 'Boas-vindas'), s: L('A card for each new member', 'Una tarjeta por miembro nuevo', 'Um card por novo membro'), on: true },
      { icon: 'cake-fill', hue: 'pink', t: L('Birthdays', 'Cumpleaños', 'Aniversários'), s: L('Celebrated on their day', 'Celebrados en su día', 'Celebrados no dia'), on: true },
      { icon: 'chart-bar-fill', hue: 'blue', t: L('Polls', 'Encuestas', 'Enquetes'), s: L('Votes that close on time', 'Votos que cierran a tiempo', 'Votos que fecham no prazo'), on: true },
      { icon: 'lightbulb-fill', hue: 'green', t: L('Suggestions', 'Sugerencias', 'Sugestões'), s: L('Voted by the members', 'Votadas por los miembros', 'Votadas pelos membros'), on: false },
    ],
  },
  'feature-stats': {
    panel: 'stats', icon: 'chart-bar-fill', hue: 'red',
    title: L('Statistics you can trust', 'Estadísticas de confianza', 'Estatísticas confiáveis'),
    tagline: L('Trends, busiest hours, top channels and how members stay.', 'Tendencias, horas más activas, canales top y cuánto se quedan los miembros.', 'Tendências, horas mais ativas, canais top e quanto os membros ficam.'),
    chips: LL(['Trends', 'Channels', 'Members', 'Growth'], ['Tendencias', 'Canales', 'Miembros', 'Crecimiento'], ['Tendências', 'Canais', 'Membros', 'Crescimento']),
  },
  'feature-custom': {
    panel: 'code', icon: 'code-fill', hue: 'gold',
    title: L('Make it yours', 'Hazlo tuyo', 'Faça do seu jeito'),
    tagline: L('Your own commands, messages built visually, every setting in one dashboard.', 'Tus propios comandos, mensajes creados visualmente, todo en un dashboard.', 'Seus próprios comandos, mensagens criadas visualmente, tudo em um dashboard.'),
    chips: LL(['Commands', 'Embeds', 'Variables', 'Dashboard'], ['Comandos', 'Embeds', 'Variables', 'Dashboard'], ['Comandos', 'Embeds', 'Variáveis', 'Dashboard']),
  },
  commands: {
    panel: 'list', icon: 'terminal-window-fill', hue: 'green',
    title: L('Every command, with examples', 'Todos los comandos, con ejemplos', 'Todos os comandos, com exemplos'),
    tagline: L('Slash commands and short prefix commands, searchable and in your language.', 'Comandos slash y de prefijo cortos, con buscador y en tu idioma.', 'Comandos slash e de prefixo curtos, com busca e no seu idioma.'),
    chips: LL(['Slash', 'Prefix', 'Search', 'Examples'], ['Slash', 'Prefijo', 'Búsqueda', 'Ejemplos'], ['Slash', 'Prefixo', 'Busca', 'Exemplos']),
    rows: [
      { icon: 'gavel-fill', hue: 'red', t: '/ban', s: L('Ban a member with a case', 'Banea a un miembro con caso', 'Bana um membro com caso'), tag: L('Mod', 'Mod', 'Mod') },
      { icon: 'ticket-fill', hue: 'blue', t: '/ticket', s: L('Open or manage tickets', 'Abre o gestiona tickets', 'Abra ou gerencie tickets'), tag: 'Tickets' },
      { icon: 'chart-line-up-fill', hue: 'green', t: '/rank', s: L('Your level and XP', 'Tu nivel y XP', 'Seu nível e XP'), tag: L('Levels', 'Niveles', 'Níveis') },
      { icon: 'gift-fill', hue: 'pink', t: '/giveaway', s: L('Start a giveaway', 'Crea un sorteo', 'Crie um sorteio'), tag: L('Fun', 'Diversión', 'Diversão') },
    ],
  },
  premium: {
    panel: 'plan', icon: 'crown-fill', hue: 'gold',
    title: L('Petto Premium', 'Petto Premium', 'Petto Premium'),
    tagline: L('More room for your server and the extras that make it stand out.', 'Más espacio para tu servidor y los extras que lo hacen destacar.', 'Mais espaço para o seu servidor e os extras que o destacam.'),
    chips: LL(['Premium', 'Roles', 'Limits', 'Support'], ['Premium', 'Roles', 'Límites', 'Soporte'], ['Premium', 'Cargos', 'Limites', 'Suporte']),
  },
  dashboard: {
    panel: 'dash', icon: 'squares-four-fill', hue: 'blue',
    title: L('Everything in one dashboard', 'Todo en un solo dashboard', 'Tudo em um só dashboard'),
    tagline: L('Set up every system with a live preview of what your members will see.', 'Configura cada sistema con una vista previa en vivo de lo que verán tus miembros.', 'Configure cada sistema com uma prévia ao vivo do que seus membros vão ver.'),
    chips: LL(['Live preview', 'Roles', 'Logs', 'Backups'], ['Vista previa', 'Roles', 'Logs', 'Backups'], ['Prévia', 'Cargos', 'Logs', 'Backups']),
  },
  status: {
    panel: 'status', icon: 'pulse-fill', hue: 'green',
    title: L('Is Petto up right now?', '¿Petto está activo ahora?', 'O Petto está no ar agora?'),
    tagline: L('The state of the bot, the dashboard and the database, checked every 2 minutes, with 90 days of history.', 'El estado del bot, el dashboard y la base de datos, cada 2 minutos, con 90 días de historial.', 'O estado do bot, do dashboard e do banco de dados, a cada 2 minutos, com 90 dias de histórico.'),
    chips: LL(['Bot', 'Dashboard', 'Database', '90 days'], ['Bot', 'Dashboard', 'Base de datos', '90 días'], ['Bot', 'Dashboard', 'Banco de dados', '90 dias']),
  },
  stats: {
    panel: 'stats', icon: 'chart-bar-fill', hue: 'red',
    title: L('Petto in numbers', 'Petto en números', 'Petto em números'),
    tagline: L('What every server that uses Petto has done so far, live.', 'Lo que han hecho todos los servidores que usan Petto, en vivo.', 'O que todos os servidores que usam o Petto já fizeram, ao vivo.'),
    chips: LL(['Messages', 'Voice', 'Reactions', 'Ranking'], ['Mensajes', 'Voz', 'Reacciones', 'Ranking'], ['Mensagens', 'Voz', 'Reações', 'Ranking']),
  },
  leaderboard: {
    panel: 'server', icon: 'trophy-fill', hue: 'gold',
    title: L('Server leaderboard', 'Ranking del servidor', 'Ranking do servidor'),
    tagline: L('Who talks, who reacts and who spends time in voice.', 'Quién habla, quién reacciona y quién pasa tiempo en voz.', 'Quem fala, quem reage e quem passa tempo em voz.'),
    chips: LL(['Levels', 'Ranking', 'Members'], ['Niveles', 'Ranking', 'Miembros'], ['Níveis', 'Ranking', 'Membros']),
    data: { name: 'Petto server' },
  },
  partners: {
    panel: 'list', icon: 'handshake-fill', hue: 'peach',
    title: L('Partners of Petto', 'Partners de Petto', 'Parceiros do Petto'),
    tagline: L('The people and places that help Petto run and grow.', 'Las personas y lugares que ayudan a que Petto funcione y crezca.', 'As pessoas e lugares que ajudam o Petto a funcionar e crescer.'),
    chips: LL(['Hosting', 'Servers', 'Apps', 'Bots'], ['Hosting', 'Servidores', 'Apps', 'Bots'], ['Hospedagem', 'Servidores', 'Apps', 'Bots']),
    rows: [
      { icon: 'hard-drives-fill', hue: 'blue', t: 'Discloud', s: L('Hosting and database', 'Hosting y base de datos', 'Hospedagem e banco de dados'), tag: L('Primary', 'Principal', 'Principal') },
      { icon: 'compass-fill', hue: 'peach', t: 'Omniplex', s: L('Bots and servers to discover', 'Bots y servidores por descubrir', 'Bots e servidores para descobrir'), tag: L('Community', 'Comunidad', 'Comunidade') },
      { icon: 'users-three-fill', hue: 'green', t: L('Servers', 'Servidores', 'Servidores'), s: L('Communities that work with us', 'Comunidades que trabajan con nosotros', 'Comunidades que trabalham conosco'), tag: L('Partner', 'Partner', 'Parceiro') },
    ],
  },
  team: {
    panel: 'list', icon: 'users-three-fill', hue: 'green',
    title: L('The team behind Petto', 'El equipo detrás de Petto', 'A equipe por trás do Petto'),
    tagline: L('The people who build, test and look after the bot every day.', 'Las personas que construyen, prueban y cuidan el bot cada día.', 'As pessoas que constroem, testam e cuidam do bot todos os dias.'),
    chips: LL(['Developers', 'Support', 'Testers'], ['Desarrollo', 'Soporte', 'Testers'], ['Desenvolvimento', 'Suporte', 'Testers']),
    rows: [
      { icon: 'code-fill', hue: 'gold', t: L('Development', 'Desarrollo', 'Desenvolvimento'), s: L('Builds the bot and the site', 'Construye el bot y el sitio', 'Constrói o bot e o site'), tag: '' },
      { icon: 'headset-fill', hue: 'blue', t: L('Support', 'Soporte', 'Suporte'), s: L('Helps members in the server', 'Ayuda a los miembros en el servidor', 'Ajuda os membros no servidor'), tag: '' },
      { icon: 'flask-fill', hue: 'green', t: 'Testers', s: L('They try it before you do', 'Lo prueban antes que tú', 'Testam antes de você'), tag: '' },
    ],
  },
  roadmap: {
    panel: 'list', icon: 'map-trifold-fill', hue: 'blue',
    title: L('What comes next', 'Lo que viene', 'O que vem por aí'),
    tagline: L('What we are building, what is next and what already shipped.', 'Lo que estamos construyendo, lo que sigue y lo que ya salió.', 'O que estamos construindo, o que vem a seguir e o que já saiu.'),
    chips: LL(['Building', 'Planned', 'Shipped'], ['En desarrollo', 'Planeado', 'Listo'], ['Em andamento', 'Planejado', 'Pronto']),
    rows: [
      { icon: 'hammer-fill', hue: 'gold', t: L('In progress', 'En desarrollo', 'Em andamento'), s: L('What we are working on now', 'En lo que trabajamos ahora', 'No que trabalhamos agora'), tag: '' },
      { icon: 'clock-countdown-fill', hue: 'blue', t: L('Planned', 'Planeado', 'Planejado'), s: L('Next in line', 'Lo siguiente', 'A seguir'), tag: '' },
      { icon: 'check-circle-fill', hue: 'green', t: L('Shipped', 'Listo', 'Pronto'), s: L('Already in your server', 'Ya en tu servidor', 'Já no seu servidor'), tag: '' },
    ],
  },
  changelog: {
    panel: 'list', icon: 'newspaper-fill', hue: 'peach',
    title: L('What is new in Petto', 'Novedades de Petto', 'Novidades do Petto'),
    tagline: L('Every release, with what changed and why, in your language.', 'Cada versión, con qué cambió y por qué, en tu idioma.', 'Cada versão, com o que mudou e por quê, no seu idioma.'),
    chips: LL(['Releases', 'Fixes', 'New'], ['Versiones', 'Arreglos', 'Nuevo'], ['Versões', 'Correções', 'Novo']),
    rows: [
      { icon: 'rocket-launch-fill', hue: 'gold', t: 'v0.7.9', s: L('Clear slash commands', 'Comandos slash claros', 'Comandos slash claros'), tag: L('New', 'Nuevo', 'Novo') },
      { icon: 'rocket-launch-fill', hue: 'peach', t: 'v0.7.8', s: L('Rank cards and leaderboard', 'Tarjetas de rango y ranking', 'Cards de rank e ranking'), tag: '' },
      { icon: 'rocket-launch-fill', hue: 'blue', t: 'v0.7.7', s: L('Roles upgrade', 'Mejora de roles', 'Melhoria de cargos'), tag: '' },
    ],
  },
  faq: {
    panel: 'list', icon: 'question-fill', hue: 'blue',
    title: L('Questions, answered', 'Preguntas, respondidas', 'Perguntas, respondidas'),
    tagline: L('How Petto works, what it costs and what it needs, in plain words.', 'Cómo funciona Petto, cuánto cuesta y qué necesita, en palabras simples.', 'Como o Petto funciona, quanto custa e o que precisa, em palavras simples.'),
    chips: LL(['Setup', 'Permissions', 'Premium', 'Privacy'], ['Configuración', 'Permisos', 'Premium', 'Privacidad'], ['Configuração', 'Permissões', 'Premium', 'Privacidade']),
    rows: [
      { icon: 'question-fill', hue: 'blue', t: L('How do I add Petto?', '¿Cómo agrego a Petto?', 'Como adiciono o Petto?'), s: L('Two clicks and a server', 'Dos clics y un servidor', 'Dois cliques e um servidor'), tag: '' },
      { icon: 'question-fill', hue: 'gold', t: L('Is it free?', '¿Es gratis?', 'É grátis?'), s: L('Yes, with an optional Premium', 'Sí, con un Premium opcional', 'Sim, com um Premium opcional'), tag: '' },
      { icon: 'question-fill', hue: 'green', t: L('What does it store?', '¿Qué guarda?', 'O que ele guarda?'), s: L('Only what a feature needs', 'Solo lo que una función necesita', 'Só o que um recurso precisa'), tag: '' },
    ],
  },
  apply: {
    panel: 'list', icon: 'handshake-fill', hue: 'green',
    title: L('Join the Petto team', 'Únete al equipo de Petto', 'Entre para a equipe do Petto'),
    tagline: L('Apply to help with support, testing or development.', 'Postula para ayudar con soporte, pruebas o desarrollo.', 'Candidate-se para ajudar com suporte, testes ou desenvolvimento.'),
    chips: LL(['Support', 'Testing', 'Development'], ['Soporte', 'Pruebas', 'Desarrollo'], ['Suporte', 'Testes', 'Desenvolvimento']),
    rows: [
      { icon: 'headset-fill', hue: 'blue', t: L('Support', 'Soporte', 'Suporte'), s: L('Help members in the server', 'Ayuda a miembros en el servidor', 'Ajude membros no servidor'), tag: L('Open', 'Abierto', 'Aberto') },
      { icon: 'flask-fill', hue: 'green', t: L('Testing', 'Pruebas', 'Testes'), s: L('Try what is coming first', 'Prueba lo que viene primero', 'Teste o que vem primeiro'), tag: L('Open', 'Abierto', 'Aberto') },
      { icon: 'code-fill', hue: 'gold', t: L('Development', 'Desarrollo', 'Desenvolvimento'), s: L('Build features with us', 'Crea funciones con nosotros', 'Crie recursos conosco'), tag: L('Open', 'Abierto', 'Aberto') },
    ],
  },
  feedback: {
    panel: 'list', icon: 'chat-circle-dots-fill', hue: 'pink',
    title: L('Tell us what you need', 'Cuéntanos qué necesitas', 'Conte o que você precisa'),
    tagline: L('Post an idea, vote for others and follow what happens to it.', 'Publica una idea, vota las de otros y sigue qué pasa con ella.', 'Publique uma ideia, vote nas dos outros e acompanhe o que acontece.'),
    chips: LL(['Ideas', 'Votes', 'Roadmap'], ['Ideas', 'Votos', 'Hoja de ruta'], ['Ideias', 'Votos', 'Roteiro']),
    rows: [
      { icon: 'arrow-fat-lines-up-fill', hue: 'gold', t: L('Voice channel XP', 'XP del canal de voz', 'XP do canal de voz'), s: L('Planned', 'Planeado', 'Planejado'), tag: '128' },
      { icon: 'arrow-fat-lines-up-fill', hue: 'blue', t: L('More feed services', 'Más servicios de feeds', 'Mais serviços de feeds'), s: L('In progress', 'En desarrollo', 'Em andamento'), tag: '96' },
      { icon: 'arrow-fat-lines-up-fill', hue: 'green', t: L('Custom rank cards', 'Tarjetas de rango propias', 'Cards de rank próprios'), s: L('Shipped', 'Listo', 'Pronto'), tag: '71' },
    ],
  },
  news: {
    panel: 'article', icon: 'newspaper-fill', hue: 'peach',
    title: L('News from Petto', 'Noticias de Petto', 'Notícias do Petto'),
    tagline: L('Announcements, explained changes and stories from behind the scenes.', 'Anuncios, cambios explicados e historias de detrás de escena.', 'Anúncios, mudanças explicadas e histórias dos bastidores.'),
    chips: LL(['Announcements', 'Blog', 'Releases'], ['Anuncios', 'Blog', 'Versiones'], ['Anúncios', 'Blog', 'Versões']),
    data: { category: L('News', 'Noticias', 'Notícias') },
  },
  blog: {
    panel: 'article', icon: 'book-open-text-fill', hue: 'peach',
    title: L('The Petto blog', 'El blog de Petto', 'O blog do Petto'),
    tagline: L('How things are made and what we learn along the way.', 'Cómo se hacen las cosas y qué aprendemos en el camino.', 'Como as coisas são feitas e o que aprendemos pelo caminho.'),
    chips: LL(['Announcements', 'Behind the scenes', 'Guides'], ['Anuncios', 'Detrás de escena', 'Guías'], ['Anúncios', 'Bastidores', 'Guias']),
    data: { category: L('Blog', 'Blog', 'Blog') },
  },
  credits: {
    panel: 'list', icon: 'heart-fill', hue: 'pink',
    title: L('Credits and thanks', 'Créditos y gracias', 'Créditos e agradecimentos'),
    tagline: L('The tools, art and people that make Petto possible.', 'Las herramientas, el arte y las personas que hacen posible a Petto.', 'As ferramentas, a arte e as pessoas que tornam o Petto possível.'),
    chips: LL(['Art', 'Tools', 'Thanks'], ['Arte', 'Herramientas', 'Gracias'], ['Arte', 'Ferramentas', 'Obrigado']),
    rows: [
      { icon: 'paint-brush-fill', hue: 'pink', t: L('Art', 'Arte', 'Arte'), s: L('Mascots and banners', 'Mascotas y banners', 'Mascotes e banners'), tag: '' },
      { icon: 'wrench-fill', hue: 'blue', t: L('Tools', 'Herramientas', 'Ferramentas'), s: L('Open source we build on', 'Código abierto que usamos', 'Código aberto que usamos'), tag: '' },
      { icon: 'heart-fill', hue: 'peach', t: L('People', 'Personas', 'Pessoas'), s: L('Who helped along the way', 'Quienes ayudaron en el camino', 'Quem ajudou no caminho'), tag: '' },
    ],
  },
  brand: {
    panel: 'list', icon: 'palette-fill', hue: 'gold',
    title: L('The Petto brand', 'La marca Petto', 'A marca Petto'),
    tagline: L('The duck, its colors and how to use them.', 'El pato, sus colores y cómo usarlos.', 'O pato, suas cores e como usá-las.'),
    chips: LL(['Mascot', 'Colors', 'Banners'], ['Mascota', 'Colores', 'Banners'], ['Mascote', 'Cores', 'Banners']),
    rows: [
      { icon: 'paw-print-fill', hue: 'gold', t: L('Mascot', 'Mascota', 'Mascote'), s: L('The everyday duck', 'El pato de todos los días', 'O pato de todo dia'), tag: '' },
      { icon: 'palette-fill', hue: 'peach', t: L('Colors', 'Colores', 'Cores'), s: L('Warm yellow and peach', 'Amarillo cálido y durazno', 'Amarelo quente e pêssego'), tag: '' },
      { icon: 'image-fill', hue: 'blue', t: 'Banners', s: L('For link previews and headers', 'Para vistas previas y cabeceras', 'Para prévias e cabeçalhos'), tag: '' },
    ],
  },
  timestamp: {
    panel: 'code', icon: 'clock-fill', hue: 'blue',
    title: L('Timestamp generator', 'Generador de timestamps', 'Gerador de timestamps'),
    tagline: L('Pick a date and copy a time that shows in everyone\'s own time zone.', 'Elige una fecha y copia una hora que cada quien ve en su zona horaria.', 'Escolha uma data e copie um horário que cada um vê no seu fuso.'),
    chips: LL(['Discord', 'Time zones', 'Copy'], ['Discord', 'Zonas horarias', 'Copiar'], ['Discord', 'Fusos', 'Copiar']),
    data: { lines: ['<t:1788000000:F>', '<t:1788000000:R>', '<t:1788000000:t>'] },
  },
  snowflake: {
    panel: 'code', icon: 'snowflake-fill', hue: 'blue',
    title: L('Snowflake decoder', 'Decodificador de snowflake', 'Decodificador de snowflake'),
    tagline: L('Paste any Discord ID and see when it was created.', 'Pega cualquier ID de Discord y mira cuándo se creó.', 'Cole qualquer ID do Discord e veja quando foi criado.'),
    chips: LL(['IDs', 'Dates', 'Discord'], ['IDs', 'Fechas', 'Discord'], ['IDs', 'Datas', 'Discord']),
    data: { lines: ['1489326875498119168', 'created  2026-04-02 18:13 UTC', 'worker 1 · process 0'] },
  },
  'embed-code': {
    panel: 'code', icon: 'code-fill', hue: 'gold',
    title: L('Embed code generator', 'Generador de código de embeds', 'Gerador de código de embeds'),
    tagline: L('Build a message and get the code that sends it.', 'Crea un mensaje y obtén el código que lo envía.', 'Crie uma mensagem e obtenha o código que a envia.'),
    chips: LL(['Embeds', 'Code', 'Preview'], ['Embeds', 'Código', 'Vista previa'], ['Embeds', 'Código', 'Prévia']),
    data: { lines: ['{embed}', '$title: Welcome', '$color: #ffd45e', '{/embed}'] },
  },
  'linked-roles': {
    panel: 'toggles', icon: 'link-fill', hue: 'green',
    title: L('Linked roles', 'Roles vinculados', 'Cargos vinculados'),
    tagline: L('Give roles for what members do outside the server, like levels and Premium.', 'Da roles por lo que hacen los miembros fuera del servidor, como niveles y Premium.', 'Dê cargos pelo que os membros fazem fora do servidor, como níveis e Premium.'),
    chips: LL(['Levels', 'Premium', 'Verified'], ['Niveles', 'Premium', 'Verificado'], ['Níveis', 'Premium', 'Verificado']),
    rows: [
      { icon: 'chart-line-up-fill', hue: 'green', t: L('Level 10+', 'Nivel 10+', 'Nível 10+'), s: L('From Petto levels', 'De los niveles de Petto', 'Dos níveis do Petto'), on: true },
      { icon: 'crown-fill', hue: 'gold', t: 'Premium', s: L('Active subscription', 'Suscripción activa', 'Assinatura ativa'), on: true },
      { icon: 'seal-check-fill', hue: 'blue', t: L('Verified', 'Verificado', 'Verificado'), s: L('Passed the checks', 'Pasó las comprobaciones', 'Passou nas verificações'), on: false },
    ],
  },
  terms: { panel: 'doc', icon: 'scales-fill', hue: 'blue', title: L('Terms of Service', 'Términos del servicio', 'Termos de serviço'), tagline: L('The rules for using Petto, in plain words.', 'Las reglas para usar Petto, en palabras simples.', 'As regras para usar o Petto, em palavras simples.'), chips: LL(['Terms', 'Rules', 'Plain words'], ['Términos', 'Reglas', 'Palabras simples'], ['Termos', 'Regras', 'Palavras simples']) },
  privacy: { panel: 'doc', icon: 'lock-key-fill', hue: 'green', title: L('Privacy Policy', 'Política de privacidad', 'Política de privacidade'), tagline: L('What Petto stores, why, and how to have it removed.', 'Qué guarda Petto, por qué y cómo pedir que lo borre.', 'O que o Petto guarda, por quê e como pedir a remoção.'), chips: LL(['Data', 'Retention', 'Removal'], ['Datos', 'Retención', 'Borrado'], ['Dados', 'Retenção', 'Remoção']) },
  cookies: { panel: 'doc', icon: 'cookie-fill', hue: 'gold', title: L('Cookies', 'Cookies', 'Cookies'), tagline: L('The few cookies the site uses and what each one does.', 'Las pocas cookies que usa el sitio y qué hace cada una.', 'Os poucos cookies que o site usa e o que cada um faz.'), chips: LL(['Cookies', 'Choices'], ['Cookies', 'Opciones'], ['Cookies', 'Escolhas']) },
  refunds: { panel: 'doc', icon: 'receipt-fill', hue: 'peach', title: L('Refund policy', 'Política de reembolsos', 'Política de reembolso'), tagline: L('When and how a Premium payment can be refunded.', 'Cuándo y cómo se puede reembolsar un pago de Premium.', 'Quando e como um pagamento do Premium pode ser reembolsado.'), chips: LL(['Premium', 'Refunds'], ['Premium', 'Reembolsos'], ['Premium', 'Reembolsos']) },
};

// A post of the news (src/i18n/ui.ts `releases.items`: the blog posts, the Code Generator, the tools...) gets a card made from the post itself: its title,
// its date, its category and its own banner, drawn by scripts/og/render.mjs as `post-<path>` (`/blog/kobot-moves-to-petto` is `post-blog-kobot-moves-to-petto`).
// The pages that tell their story with a news post of their own (`newsPosts` in the same file) are listed here.
export const NEWS_PAGES = [
  {
    path: '/nelu', post: 'nelu', banner: '/assets/nelu-banner.svg', category: L('News', 'Noticias', 'Notícias'),
    title: L('Nelu, the anime bot', 'Nelu, el bot de anime', 'Nelu, o bot de anime'),
    tagline: L('A separate bot for characters, quotes and favorites, joining the Petto family.', 'Un bot aparte para personajes, frases y favoritos, que se une a la familia Petto.', 'Um bot à parte para personagens, frases e favoritos, entrando na família Petto.'),
    chips: LL(['Anime', 'Characters', 'Quotes'], ['Anime', 'Personajes', 'Frases'], ['Anime', 'Personagens', 'Frases']),
  },
  {
    path: '/am', post: 'am', banner: '/assets/am-banner.svg', category: L('News', 'Noticias', 'Notícias'),
    title: L('AM, the automoderation bot', 'AM, el bot de automoderación', 'AM, o bot de automoderação'),
    tagline: L('Automatic moderation that looks at the context, not just a list of words.', 'Moderación automática que mira el contexto, no solo una lista de palabras.', 'Moderação automática que olha o contexto, não só uma lista de palavras.'),
    chips: LL(['Auto-mod', 'Spam', 'Context'], ['Auto-mod', 'Spam', 'Contexto'], ['Auto-mod', 'Spam', 'Contexto']),
  },
  {
    path: '/embed-builder', post: 'embedBuilder', banner: '/assets/embed-builder-banner.webp', category: L('Tools', 'Herramientas', 'Ferramentas'),
    title: L('Embed Builder', 'Embed Builder', 'Embed Builder'),
    tagline: L('Build messages visually, see them as Discord will, send them in one click.', 'Crea mensajes visualmente, míralos como los verá Discord y envíalos con un clic.', 'Crie mensagens visualmente, veja como o Discord vai mostrar e envie com um clique.'),
    chips: LL(['Visual', 'Buttons', 'Variables'], ['Visual', 'Botones', 'Variables'], ['Visual', 'Botões', 'Variáveis']),
  },
];
/** The key of the card of a news post by its path: `/codegen` is `post-codegen`. */
export const postKeyOf = (path) => `post-${path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-')}`;

/** The path of a page (no language, no final slash) to the card that shows when it is shared. A page under a listed one uses its card. */
export const CARD_PATHS = {
  '/': 'home',
  '/features': 'features',
  '/features/moderation': 'feature-moderation', '/features/protection': 'feature-protection', '/features/tickets': 'feature-tickets', '/features/levels': 'feature-levels',
  '/features/giveaways': 'feature-giveaways', '/features/integrations': 'feature-integrations', '/features/feeds': 'feature-feeds', '/features/community': 'feature-community',
  '/features/stats': 'feature-stats', '/features/custom': 'feature-custom',
  '/commands': 'commands', '/premium': 'premium', '/dash': 'dashboard', '/status': 'status', '/stats': 'stats', '/lb': 'leaderboard',
  '/partners': 'partners', '/team': 'team', '/roadmap': 'roadmap', '/changelog': 'changelog', '/faq': 'faq', '/apply': 'apply', '/feedback': 'feedback',
  '/news': 'news', '/blog': 'blog', '/credits': 'credits', '/brand': 'brand', '/timestamp': 'timestamp', '/snowflake': 'snowflake', '/embed-code': 'embed-code',
  '/linked-roles': 'linked-roles',
  '/terms': 'terms', '/privacy': 'privacy', '/cookies': 'cookies', '/refunds': 'refunds',
  };

/** The name of the file of a card: `home-en`, `home-es`, `home-pt-br`. */
export const cardName = (key, lang) => `${key}-${lang === 'pt-BR' ? 'pt-br' : lang}`;
export const pathLang = (pathname) => (/^\/es(?:\/|$)/.test(pathname) ? 'es' : /^\/pt-br(?:\/|$)/.test(pathname) ? 'pt-BR' : 'en');
/** The path with no language prefix, no final slash and no index. */
export const cleanPath = (pathname) => pathname.replace(/^\/(es|pt-br)(?=\/|$)/, '').replace(/\/index(?:\.html)?$/, '').replace(/(.)\/+$/, '$1') || '/';

/**
 * The card of a page: [key, language]. `has` says whether a card with that key was drawn (the manifest), so a post that was never drawn falls
 * back to its parent. A news post has a card of its own when the manifest has it. Always answers: the home card is the base.
 * @param {string} pathname @param {(key: string) => boolean} [has]
 */
export function ogCardFor(pathname, has = (key) => key in CARDS) {
  const clean = cleanPath(pathname);
  const lang = pathLang(pathname);
  if (has(postKeyOf(clean))) return { key: postKeyOf(clean), lang };
  if (CARD_PATHS[clean]) return { key: CARD_PATHS[clean], lang };
  const parents = Object.keys(CARD_PATHS).filter((path) => path !== '/' && clean.startsWith(`${path}/`)).sort((a, b) => b.length - a.length);
  return { key: parents.length ? CARD_PATHS[parents[0]] : 'home', lang };
}
