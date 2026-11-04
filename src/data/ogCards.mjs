// The picture a link to the site shows when it is shared (Discord, X, Telegram, Slack...), as DATA. Every card is one entry: a tone (the pastel of its family),
// the artwork that matches the page (`art`, drawn by scripts/og/template.mjs), a short headline that ends in a period and a two line tagline, in the three
// languages. `scripts/og/render.mjs` draws them into /public/assets/og (once per language) as flat pastel illustrations, `scripts/check-og-images.mjs` makes sure they
// are all there, and the layout (src/layouts/Base.astro) asks `ogCardFor(path)` which one a page uses. Adding a page to the system is adding an entry here and a
// line in CARD_PATHS. A page nobody listed (and a page under one that is listed, like /changelog/0.7.7) uses the card of its parent, and in the end the home card.

export const LANGS = ['en', 'es', 'pt-BR'];
/** @type {(en: string, es: string, pt: string) => Record<string, string>} */
const L = (en, es, pt) => ({ en, es, 'pt-BR': pt });

/**
 * The pastel of each family of pages: the background of its picture (`bg`), and the color of the faint doodles on it (`doodle`). The bar on the left of the
 * Discord card is the SAME color as the background of the picture (`accentNumber`), read from this table by the drawing and by the layout, so the two can
 * never drift. Lavender is not used on purpose.
 */
export const TONES = {
  butter: { name: 'Butter', bg: '#FFEFB0', doodle: '#F4DB7A' },
  peach: { name: 'Peach', bg: '#FFD8C6', doodle: '#F5BEA6' },
  mint: { name: 'Mint', bg: '#CDEFD9', doodle: '#ADDDBF' },
  sky: { name: 'Sky', bg: '#CFE6FA', doodle: '#ADD0EE' },
  pink: { name: 'Pink', bg: '#FFD3E3', doodle: '#F5B6CD' },
  cream: { name: 'Cream', bg: '#F8EFDD', doodle: '#E8DCC2' },
};
/** The color of the accent bar of the Discord card as the number Discord asks for: the background of the picture of the same family. */
export const accentNumber = (tone) => parseInt((TONES[tone] ?? TONES.butter).bg.slice(1), 16);

/**
 * @typedef {{ tone: keyof typeof TONES, art: string, title: Record<string,string>, tagline: Record<string,string> }} Card
 */

/** @type {Record<string, Card>} */
export const CARDS = {
  home: { tone: 'butter', art: 'home', title: L('Your server. Looked after.', 'Tu servidor. Bien cuidado.', 'Seu servidor. Bem cuidado.'), tagline: L('Moderation, tickets, levels and giveaways, with a dashboard you can preview.', 'Moderación, tickets, niveles y sorteos, con un dashboard con vista previa.', 'Moderação, tickets, níveis e sorteios, com um dashboard com prévia.') },
  features: { tone: 'butter', art: 'home', title: L('All you need. One bot.', 'Todo lo que necesitas. Un bot.', 'Tudo que precisa. Um bot.'), tagline: L('Ten systems that work together, each with a live preview.', 'Diez sistemas que trabajan juntos, cada uno con vista previa.', 'Dez sistemas que trabalham juntos, cada um com prévia.') },
  'feature-moderation': { tone: 'peach', art: 'moderation', title: L('Every action. A case.', 'Cada acción. Un caso.', 'Cada ação. Um caso.'), tagline: L('Ban, kick, mute and warn, with the history kept.', 'Banea, expulsa, silencia y advierte, con el historial guardado.', 'Bana, expulsa, silencia e avisa, com o histórico guardado.') },
  'feature-protection': { tone: 'peach', art: 'protection', title: L('Protected while you sleep.', 'Protegido mientras duermes.', 'Protegido enquanto você dorme.'), tagline: L('Raids, nukes and scams are stopped and logged.', 'Raids, nukes y estafas se frenan y quedan registrados.', 'Raids, nukes e golpes são barrados e registrados.') },
  'feature-tickets': { tone: 'sky', art: 'tickets', title: L('Support. Your way.', 'Soporte. A tu manera.', 'Suporte. Do seu jeito.'), tagline: L('Tickets with a panel of your own, forms and transcripts.', 'Tickets con panel propio, formularios y transcripciones.', 'Tickets com painel próprio, formulários e transcrições.') },
  'feature-levels': { tone: 'mint', art: 'levels', title: L('Talk. Level up.', 'Habla. Sube de nivel.', 'Converse. Suba de nível.'), tagline: L('Text and voice XP, ranks and role rewards.', 'XP de texto y voz, rangos y roles de premio.', 'XP de texto e voz, ranks e cargos de prêmio.') },
  'feature-giveaways': { tone: 'pink', art: 'giveaways', title: L('Fair giveaways. Fast.', 'Sorteos justos. Rápidos.', 'Sorteios justos. Rápidos.'), tagline: L('Start one in seconds, ask for what you want, let the bot pick.', 'Crea uno en segundos, pide lo que quieras y deja que el bot elija.', 'Crie um em segundos, peça o que quiser e deixe o bot sortear.') },
  'feature-integrations': { tone: 'sky', art: 'plug', title: L('19 lookups. No tabs.', '19 consultas. Sin salir.', '19 consultas. Sem sair.'), tagline: L('Songs, servers, profiles and prices without leaving Discord.', 'Canciones, servidores, perfiles y precios sin salir de Discord.', 'Músicas, servidores, perfis e preços sem sair do Discord.') },
  'feature-feeds': { tone: 'pink', art: 'feeds', title: L('News. In your channel.', 'Novedades. En tu canal.', 'Novidades. No seu canal.'), tagline: L('Videos, streams, posts and new versions, posted for you.', 'Videos, directos, publicaciones y versiones nuevas, en tu canal.', 'Vídeos, lives, posts e novas versões, no seu canal.') },
  'feature-community': { tone: 'mint', art: 'community', title: L('A server that feels alive.', 'Un servidor con vida.', 'Um servidor com vida.'), tagline: L('Welcomes, birthdays, polls and suggestions.', 'Bienvenidas, cumpleaños, encuestas y sugerencias.', 'Boas-vindas, aniversários, enquetes e sugestões.') },
  'feature-stats': { tone: 'butter', art: 'stats', title: L('Numbers you can trust.', 'Números de confianza.', 'Números confiáveis.'), tagline: L('Trends, busiest hours, top channels and how members stay.', 'Tendencias, horas más activas, canales top y cuánto se quedan los miembros.', 'Tendências, horas mais ativas, canais top e quanto os membros ficam.') },
  'feature-custom': { tone: 'cream', art: 'code', title: L('Make it yours.', 'Hazlo tuyo.', 'Faça do seu jeito.'), tagline: L('Your own commands and messages, all in one dashboard.', 'Tus propios comandos y mensajes, todo en un dashboard.', 'Seus próprios comandos e mensagens, tudo em um dashboard.') },
  commands: { tone: 'sky', art: 'commands', title: L('Every command. Explained.', 'Cada comando. Explicado.', 'Cada comando. Explicado.'), tagline: L('Slash and short prefix commands, with search and examples.', 'Comandos slash y de prefijo cortos, con búsqueda y ejemplos.', 'Comandos slash e de prefixo curtos, com busca e exemplos.') },
  premium: { tone: 'butter', art: 'premium', title: L('More room to grow.', 'Más espacio para crecer.', 'Mais espaço para crescer.'), tagline: L('Premium gives about twice the room and a few small touches.', 'Premium da casi el doble de espacio y unos pequeños detalles.', 'O Premium dá quase o dobro de espaço e alguns pequenos detalhes.') },
  dashboard: { tone: 'sky', art: 'dashboard', title: L('See it. Then save it.', 'Míralo. Luego guárdalo.', 'Veja. Depois salve.'), tagline: L('Set up every system with a live preview of what members see.', 'Configura cada sistema con una vista previa de lo que verán los miembros.', 'Configure cada sistema com uma prévia do que os membros vão ver.') },
  status: { tone: 'mint', art: 'status', title: L('Checked every 2 minutes.', 'Revisado cada 2 minutos.', 'Verificado a cada 2 minutos.'), tagline: L('The bot, the dashboard and the database, with 90 days of history.', 'El bot, el dashboard y la base de datos, con 90 días de historial.', 'O bot, o dashboard e o banco de dados, com 90 dias de histórico.') },
  stats: { tone: 'butter', art: 'stats', title: L('Petto. In numbers.', 'Petto. En números.', 'Petto. Em números.'), tagline: L('What every server that uses Petto has done so far, live.', 'Lo que han hecho todos los servidores que usan Petto, en vivo.', 'O que todos os servidores que usam o Petto já fizeram, ao vivo.') },
  leaderboard: { tone: 'butter', art: 'podium', title: L('Who is on top?', '¿Quién va primero?', 'Quem está no topo?'), tagline: L('The ranking of a server: who talks, reacts and joins voice.', 'El ranking de un servidor: quién habla, reacciona y entra a voz.', 'O ranking de um servidor: quem fala, reage e entra em voz.') },
  partners: { tone: 'pink', art: 'partners', title: L('Better together.', 'Mejor juntos.', 'Melhor juntos.'), tagline: L('The people and places that help Petto run and grow.', 'Las personas y lugares que ayudan a que Petto funcione y crezca.', 'As pessoas e lugares que ajudam o Petto a funcionar e crescer.') },
  team: { tone: 'peach', art: 'team', title: L('Meet the team.', 'Conoce al equipo.', 'Conheça a equipe.'), tagline: L('The people who build, test and look after Petto every day.', 'Las personas que construyen, prueban y cuidan a Petto cada día.', 'As pessoas que constroem, testam e cuidam do Petto todo dia.') },
  roadmap: { tone: 'butter', art: 'roadmap', title: L('What comes next.', 'Lo que viene.', 'O que vem depois.'), tagline: L('What we are building, what is next and what already shipped.', 'Lo que construimos, lo que sigue y lo que ya salió.', 'O que construímos, o que vem a seguir e o que já saiu.') },
  changelog: { tone: 'cream', art: 'changelog', title: L('What is new.', 'Qué hay de nuevo.', 'O que há de novo.'), tagline: L('Every release, with what changed and why.', 'Cada versión, con qué cambió y por qué.', 'Cada versão, com o que mudou e por quê.') },
  faq: { tone: 'cream', art: 'faq', title: L('Questions. Answered.', 'Preguntas. Respondidas.', 'Perguntas. Respondidas.'), tagline: L('How Petto works, what it costs and what it needs.', 'Cómo funciona Petto, cuánto cuesta y qué necesita.', 'Como o Petto funciona, quanto custa e o que precisa.') },
  apply: { tone: 'peach', art: 'team', title: L('Join the team.', 'Únete al equipo.', 'Entre para a equipe.'), tagline: L('Apply to help with support, testing or development.', 'Postula para ayudar con soporte, pruebas o desarrollo.', 'Candidate-se para ajudar com suporte, testes ou desenvolvimento.') },
  feedback: { tone: 'pink', art: 'feedback', title: L('Tell us. We listen.', 'Cuéntanos. Escuchamos.', 'Conte. Nós ouvimos.'), tagline: L('Post an idea, vote for others and follow what happens.', 'Publica una idea, vota las de otros y sigue qué pasa.', 'Publique uma ideia, vote nas dos outros e acompanhe.') },
  news: { tone: 'peach', art: 'news', title: L('News. From Petto.', 'Noticias. De Petto.', 'Notícias. Do Petto.'), tagline: L('Announcements and changes, explained.', 'Anuncios y cambios, explicados.', 'Anúncios e mudanças, explicados.') },
  blog: { tone: 'peach', art: 'news', title: L('The Petto blog.', 'El blog de Petto.', 'O blog do Petto.'), tagline: L('How things are made and what we learn along the way.', 'Cómo se hacen las cosas y qué aprendemos en el camino.', 'Como as coisas são feitas e o que aprendemos pelo caminho.') },
  credits: { tone: 'pink', art: 'credits', title: L('Thank you.', 'Gracias.', 'Obrigado.'), tagline: L('The tools, art and people that make Petto possible.', 'Las herramientas, el arte y las personas que hacen posible a Petto.', 'As ferramentas, a arte e as pessoas que tornam o Petto possível.') },
  brand: { tone: 'cream', art: 'brand', title: L('The Petto look.', 'La marca Petto.', 'A marca Petto.'), tagline: L('The duck, its colors and how to use them.', 'El pato, sus colores y cómo usarlos.', 'O pato, suas cores e como usá-las.') },
  timestamp: { tone: 'sky', art: 'clock', title: L('Time. For everyone.', 'La hora. Para todos.', 'A hora. Para todos.'), tagline: L('Pick a date and copy a time shown in each own time zone.', 'Elige una fecha y copia una hora que cada quien ve en su zona.', 'Escolha uma data e copie um horário que cada um vê no seu fuso.') },
  snowflake: { tone: 'sky', art: 'snowflake', title: L('Any ID. Its date.', 'Cualquier ID. Su fecha.', 'Qualquer ID. Sua data.'), tagline: L('Paste a Discord ID and see when it was created.', 'Pega un ID de Discord y mira cuándo se creó.', 'Cole um ID do Discord e veja quando foi criado.') },
  'embed-code': { tone: 'cream', art: 'code', title: L('Build it. Copy it.', 'Créalo. Cópialo.', 'Crie. Copie.'), tagline: L('Build a message and get the code that sends it.', 'Crea un mensaje y obtén el código que lo envía.', 'Crie uma mensagem e obtenha o código que a envia.') },
  'linked-roles': { tone: 'mint', art: 'chain', title: L('Roles. Linked.', 'Roles. Vinculados.', 'Cargos. Vinculados.'), tagline: L('Connect your account and unlock Petto Verified.', 'Conecta tu cuenta y desbloquea Petto Verified.', 'Conecte sua conta e libere o Petto Verified.') },
  terms: { tone: 'cream', art: 'doc', title: L('The rules. In plain words.', 'Las reglas. En simple.', 'As regras. Em simples.'), tagline: L('The Terms of Service for using Petto.', 'Los términos del servicio para usar Petto.', 'Os termos de serviço para usar o Petto.') },
  privacy: { tone: 'cream', art: 'lock', title: L('Your data. Your call.', 'Tus datos. Tu decisión.', 'Seus dados. Sua decisão.'), tagline: L('What Petto stores, why, and how to have it removed.', 'Qué guarda Petto, por qué y cómo pedir que lo borre.', 'O que o Petto guarda, por quê e como pedir a remoção.') },
  cookies: { tone: 'cream', art: 'cookie', title: L('Few cookies. Clear ones.', 'Pocas cookies. Claras.', 'Poucos cookies. Claros.'), tagline: L('The cookies the site uses and what each one does.', 'Las cookies que usa el sitio y qué hace cada una.', 'Os cookies que o site usa e o que cada um faz.') },
  refunds: { tone: 'cream', art: 'receipt', title: L('Fair refunds.', 'Reembolsos justos.', 'Reembolsos justos.'), tagline: L('When and how a Premium payment can be refunded.', 'Cuándo y cómo se puede reembolsar un pago de Premium.', 'Quando e como um pagamento do Premium pode ser reembolsado.') },
};

// A post of the news (src/i18n/ui.ts `releases.items`: the blog posts, the Code Generator, the tools...) gets a card made from the post itself: its title,
// its date, its category and its own banner, drawn by scripts/og/render.mjs as `post-<path>` (`/blog/kobot-moves-to-petto` is `post-blog-kobot-moves-to-petto`).
// The pages that tell their story with a news post of their own (`newsPosts` in the same file) are listed here, with their own headline, tagline and tone.
export const NEWS_PAGES = [
  { path: '/nelu', post: 'nelu', banner: '/assets/nelu-banner.svg', tone: 'pink', category: L('News', 'Noticias', 'Notícias'),
    title: L('Nelu. The anime bot.', 'Nelu. El bot de anime.', 'Nelu. O bot de anime.'),
    tagline: L('Characters, quotes and favorites, joining the Petto family.', 'Personajes, frases y favoritos, en la familia Petto.', 'Personagens, frases e favoritos, na família Petto.'),
    embedTitle: L('Nelu · The anime bot joining the Petto family', 'Nelu · El bot de anime que se une a la familia Petto', 'Nelu · O bot de anime que entra na família Petto'),
    description: L('Nelu is a separate bot for anime and manga: character and series lookup, daily picks, quotes and favorites. It shares Petto infrastructure, not its commands.', 'Nelu es un bot aparte para anime y manga: búsqueda de personajes y series, selecciones diarias, frases y favoritos. Comparte la infraestructura de Petto, no sus comandos.', 'O Nelu é um bot à parte para anime e mangá: busca de personagens e séries, escolhas diárias, frases e favoritos. Ele divide a infraestrutura do Petto, não os comandos.') },
  { path: '/am', post: 'am', banner: '/assets/am-banner.svg', tone: 'mint', category: L('News', 'Noticias', 'Notícias'),
    title: L('AM. The automod bot.', 'AM. El bot de automoderación.', 'AM. O bot de automoderação.'),
    tagline: L('Automatic moderation that looks at the context, not just words.', 'Moderación automática que mira el contexto, no solo palabras.', 'Moderação automática que olha o contexto, não só palavras.'),
    embedTitle: L('AM · The automod bot joining the Petto family', 'AM · El bot de automoderación que se une a la familia Petto', 'AM · O bot de automoderação que entra na família Petto'),
    description: L('AM is a separate automoderation bot that reads the context of a message instead of matching a fixed list of words, to catch spam and toxicity.', 'AM es un bot aparte de automoderación que lee el contexto de un mensaje en lugar de comparar una lista fija de palabras, para frenar spam y toxicidad.', 'O AM é um bot à parte de automoderação que lê o contexto de uma mensagem em vez de comparar uma lista fixa de palavras, para barrar spam e toxicidade.') },
  { path: '/embed-builder', post: 'embedBuilder', banner: '/assets/embed-builder-banner.webp', tone: 'cream', category: L('Tools', 'Herramientas', 'Ferramentas'),
    title: L('Build messages. Visually.', 'Crea mensajes. Visualmente.', 'Crie mensagens. Visualmente.'),
    tagline: L('See them as Discord will, and send them in one click.', 'Míralos como los verá Discord y envíalos con un clic.', 'Veja como o Discord vai mostrar e envie com um clique.'),
    embedTitle: L('Embed Builder · Build Discord messages visually, by Petto', 'Embed Builder · Crea mensajes de Discord visualmente, por Petto', 'Embed Builder · Crie mensagens do Discord visualmente, pelo Petto'),
    description: L('The visual builder for Discord embeds and Components V2 is now part of Petto: design a message, see it as Discord will draw it and send it.', 'El constructor visual de embeds y Components V2 de Discord ahora es parte de Petto: diseña un mensaje, míralo como lo dibujará Discord y envíalo.', 'O construtor visual de embeds e Components V2 do Discord agora faz parte do Petto: desenhe uma mensagem, veja como o Discord vai mostrá-la e envie.') },
];
/** The tone of the card of a news post by its path: blog posts are peach, the news about Discord sky, the tools and the code cream. */
export const postToneOf = (path) => (path.startsWith('/blog/') ? 'peach' : path.startsWith('/discord-') ? 'sky' : 'cream');
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
  if (has(postKeyOf(clean))) return { key: postKeyOf(clean), lang, exact: true };
  if (CARD_PATHS[clean]) return { key: CARD_PATHS[clean], lang, exact: true };
  const parents = Object.keys(CARD_PATHS).filter((path) => path !== '/' && clean.startsWith(`${path}/`)).sort((a, b) => b.length - a.length);
  return { key: parents.length ? CARD_PATHS[parents[0]] : 'home', lang, exact: false };
}
