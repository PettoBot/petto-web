// What the link preview of each page says (the title and the description of the card Discord draws, and of the Open Graph tags): written for the card of the
// page (src/data/ogCards.mjs, the same keys), in the three languages. The title says what the page is and always carries the brand ("<what it is> · Petto,
// ..."), never just the name of the page; the description is one or two concrete sentences about what you get on that page. Neither says how many servers or
// members Petto has: no number of the bot's size is ever in a preview. `scripts/check-og-images.mjs` checks all of it.
// The cards of the news posts take their own title and description from the post (see scripts/og/render.mjs).

/** @type {(en: string, es: string, pt: string) => Record<string, string>} */
const L = (en, es, pt) => ({ en, es, 'pt-BR': pt });

/** @type {Record<string, { title: Record<string, string>, description: Record<string, string> }>} */
export const PREVIEW = {
  home: {
    title: L('Petto, a Discord bot for moderation and community', 'Petto, un bot de Discord para moderación y comunidad', 'Petto, um bot do Discord para moderação e comunidade'),
    description: L('Moderation, tickets, levels, giveaways and feeds in one bot, with a web dashboard that previews what your members will see.', 'Moderación, tickets, niveles, sorteos y feeds en un solo bot, con un dashboard web que muestra de antemano lo que verán tus miembros.', 'Moderação, tickets, níveis, sorteios e feeds em um só bot, com um dashboard web que mostra antes o que seus membros vão ver.'),
  },
  features: {
    title: L('Features of Petto · Every system a Discord server needs', 'Características de Petto · Los sistemas que un servidor necesita', 'Recursos do Petto · Os sistemas que um servidor precisa'),
    description: L('Moderation, protection, tickets, levels, giveaways, feeds and more. Each system is set up in the dashboard with a live preview.', 'Moderación, protección, tickets, niveles, sorteos, feeds y más. Cada sistema se configura en el dashboard con vista previa en vivo.', 'Moderação, proteção, tickets, níveis, sorteios, feeds e mais. Cada sistema é configurado no dashboard com prévia ao vivo.'),
  },
  'feature-moderation': {
    title: L('Moderation with Petto · Bans, warns and a case for each action', 'Moderación con Petto · Bans, warns y un caso por acción', 'Moderação com o Petto · Bans, warns e um caso por ação'),
    description: L('Ban, kick, mute and warn with a case for each action, notes on members and a message to the member that you write yourself. The history stays with the member.', 'Banea, expulsa, silencia y advierte con un caso por acción, notas sobre miembros y un mensaje al miembro que escribes tú. El historial queda con el miembro.', 'Bana, expulsa, silencia e avisa com um caso por ação, notas sobre membros e uma mensagem ao membro que você escreve. O histórico fica com o membro.'),
  },
  'feature-protection': {
    title: L('Protection with Petto · Raids, nukes and scams stopped', 'Protección con Petto · Frena raids, nukes y estafas', 'Proteção com o Petto · Barra raids, nukes e golpes'),
    description: L('Raids, nukes and scams are stopped while the staff is away, and every action is logged so you can review it later.', 'Los raids, nukes y estafas se frenan mientras el staff no está, y cada acción queda registrada para revisarla después.', 'Raids, nukes e golpes são barrados enquanto a equipe está ausente, e cada ação fica registrada para revisar depois.'),
  },
  'feature-tickets': {
    title: L('Tickets with Petto · A support panel of your own', 'Tickets con Petto · Un panel de soporte a tu manera', 'Tickets com o Petto · Um painel de suporte do seu jeito'),
    description: L('Members open a private channel with your team. You choose how the panel looks, who answers, what the form asks and where the transcript goes.', 'Los miembros abren un canal privado con tu equipo. Tú eliges cómo se ve el panel, quién responde, qué pregunta el formulario y a dónde va la transcripción.', 'Os membros abrem um canal privado com a sua equipe. Você escolhe como o painel é, quem responde, o que o formulário pergunta e para onde vai a transcrição.'),
  },
  'feature-levels': {
    title: L('Levels with Petto · XP, ranks and role rewards', 'Niveles con Petto · XP, rangos y roles de premio', 'Níveis com o Petto · XP, ranks e cargos de prêmio'),
    description: L('Text and voice XP with protection against farming, a rank card for each member and roles as rewards.', 'XP de texto y de voz con protección contra el farmeo, una tarjeta de rango para cada miembro y roles como premio.', 'XP de texto e de voz com proteção contra farm, um card de rank para cada membro e cargos como prêmio.'),
  },
  'feature-giveaways': {
    title: L('Giveaways with Petto · Fair, with requirements', 'Sorteos con Petto · Justos y con requisitos', 'Sorteios com o Petto · Justos e com requisitos'),
    description: L('Start a giveaway in seconds, ask for a role or a level to enter, and let the bot pick the winners fairly.', 'Crea un sorteo en segundos, pide un rol o un nivel para participar y deja que el bot elija a los ganadores con justicia.', 'Crie um sorteio em segundos, peça um cargo ou um nível para participar e deixe o bot sortear os vencedores com justiça.'),
  },
  'feature-integrations': {
    title: L('Lookups with Petto · Songs, players and prices in Discord', 'Consultas con Petto · Canciones, jugadores y precios en Discord', 'Consultas com o Petto · Músicas, jogadores e preços no Discord'),
    description: L('Look up songs, players, profiles and prices from other services without leaving Discord, with the same short commands everywhere.', 'Busca canciones, jugadores, perfiles y precios de otros servicios sin salir de Discord, con los mismos comandos cortos en todas partes.', 'Busque músicas, jogadores, perfis e preços de outros serviços sem sair do Discord, com os mesmos comandos curtos em todo lugar.'),
  },
  'feature-feeds': {
    title: L('Feeds with Petto · Videos, streams and posts in your channel', 'Feeds con Petto · Videos, directos y posts en tu canal', 'Feeds com o Petto · Vídeos, lives e posts no seu canal'),
    description: L('Petto posts in a channel what an account of another service publishes: videos, live streams, music, posts and new versions.', 'Petto publica en un canal lo que sube una cuenta de otro servicio: videos, directos, música, publicaciones y versiones nuevas.', 'O Petto publica em um canal o que uma conta de outro serviço posta: vídeos, lives, músicas, publicações e novas versões.'),
  },
  'feature-community': {
    title: L('Community with Petto · Welcomes, birthdays, polls and ideas', 'Comunidad con Petto · Bienvenidas, cumpleaños, encuestas e ideas', 'Comunidade com o Petto · Boas-vindas, aniversários, enquetes e ideias'),
    description: L('Welcome cards, birthdays, polls, suggestions and the small details that make a server feel like yours.', 'Tarjetas de bienvenida, cumpleaños, encuestas, sugerencias y los detalles que hacen que un servidor se sienta tuyo.', 'Cards de boas-vindas, aniversários, enquetes, sugestões e os detalhes que fazem um servidor parecer seu.'),
  },
  'feature-stats': {
    title: L('Statistics with Petto · Trends, busy hours and top channels', 'Estadísticas con Petto · Tendencias, horas activas y canales top', 'Estatísticas com o Petto · Tendências, horas ativas e canais top'),
    description: L('See what happens in your server and compare it with the period before: trends, busiest hours, top channels and how long members stay.', 'Mira qué pasa en tu servidor y compáralo con el periodo anterior: tendencias, horas más activas, canales top y cuánto se quedan los miembros.', 'Veja o que acontece no seu servidor e compare com o período anterior: tendências, horas mais ativas, canais top e quanto os membros ficam.'),
  },
  'feature-custom': {
    title: L('Make it yours with Petto · Commands, embeds and variables', 'Hazlo tuyo con Petto · Comandos, embeds y variables', 'Faça do seu jeito com o Petto · Comandos, embeds e variáveis'),
    description: L('Write your own commands, build messages visually and keep every setting in one dashboard.', 'Escribe tus propios comandos, crea mensajes visualmente y guarda cada ajuste en un solo dashboard.', 'Escreva seus próprios comandos, crie mensagens visualmente e mantenha cada ajuste em um só dashboard.'),
  },
  commands: {
    title: L('Commands of Petto · Slash and prefix, with examples', 'Comandos de Petto · Slash y prefijo, con ejemplos', 'Comandos do Petto · Slash e prefixo, com exemplos'),
    description: L('Every Petto command with its syntax and examples, for slash and short prefix, searchable and in your language.', 'Todos los comandos de Petto con su sintaxis y ejemplos, en slash y prefijo corto, con buscador y en tu idioma.', 'Todos os comandos do Petto com sintaxe e exemplos, em slash e prefixo curto, com busca e no seu idioma.'),
  },
  premium: {
    title: L('Petto Premium · More room for your Discord server', 'Petto Premium · Más espacio para tu servidor de Discord', 'Petto Premium · Mais espaço para o seu servidor do Discord'),
    description: L('Petto is free for almost everything. Premium gives about twice the room and a few small touches; moderation, security, logging and tickets stay free.', 'Petto es gratis casi para todo. Premium da casi el doble de espacio y unos pequeños detalles; moderación, seguridad, logs y tickets siguen gratis.', 'O Petto é grátis para quase tudo. O Premium dá quase o dobro de espaço e alguns pequenos detalhes; moderação, segurança, logs e tickets continuam grátis.'),
  },
  dashboard: {
    title: L('Petto Dashboard · Set up your server with a live preview', 'Dashboard de Petto · Configura tu servidor con vista previa', 'Dashboard do Petto · Configure o servidor com prévia'),
    description: L('Set up every Petto system from the web, with a live preview of what your members will see, access for your staff and backups.', 'Configura cada sistema de Petto desde la web, con una vista previa en vivo de lo que verán tus miembros, acceso para tu staff y copias de seguridad.', 'Configure cada sistema do Petto pela web, com prévia ao vivo do que seus membros vão ver, acesso para a sua equipe e backups.'),
  },
  status: {
    title: L('Petto Status · Is the bot, the dashboard and the database up?', 'Estado de Petto · ¿Están activos el bot, el dashboard y la base?', 'Status do Petto · O bot, o dashboard e o banco estão no ar?'),
    description: L('See right now whether the bot, the dashboard and the database are working, with a day by day history of past interruptions.', 'Mira ahora mismo si el bot, el dashboard y la base de datos funcionan, con un historial día a día de las interrupciones pasadas.', 'Veja agora se o bot, o dashboard e o banco de dados estão funcionando, com um histórico dia a dia das interrupções passadas.'),
  },
  stats: {
    title: L('Petto Stats · Messages, voice time and reactions, live', 'Estadísticas de Petto · Mensajes, voz y reacciones, en vivo', 'Estatísticas do Petto · Mensagens, voz e reações, ao vivo'),
    description: L('What every server that uses Petto has done so far, updated live, with a ranking of the servers that chose to appear.', 'Lo que han hecho todos los servidores que usan Petto hasta ahora, en vivo, con un ranking de los servidores que eligieron aparecer.', 'O que todos os servidores que usam o Petto já fizeram, ao vivo, com um ranking dos servidores que escolheram aparecer.'),
  },
  leaderboard: {
    title: L('Server leaderboard · Levels and ranking with Petto', 'Ranking del servidor · Niveles y clasificación con Petto', 'Ranking do servidor · Níveis e classificação com o Petto'),
    description: L('The ranking of a server: who talks, who reacts and who spends time in voice, with their levels.', 'El ranking de un servidor: quién habla, quién reacciona y quién pasa tiempo en voz, con sus niveles.', 'O ranking de um servidor: quem fala, quem reage e quem passa tempo em voz, com seus níveis.'),
  },
  partners: {
    title: L('Partners of Petto · The people and places that help it grow', 'Partners de Petto · Las personas y lugares que lo ayudan a crecer', 'Parceiros do Petto · As pessoas e lugares que ajudam a crescer'),
    description: L('The hosting, communities, apps and bots that Petto works with, and why each one is here.', 'El hosting, las comunidades, apps y bots con los que trabaja Petto, y por qué está cada uno.', 'A hospedagem, as comunidades, apps e bots com os quais o Petto trabalha, e por que cada um está aqui.'),
  },
  team: {
    title: L('The Petto team · Who builds and looks after the bot', 'El equipo de Petto · Quién construye y cuida el bot', 'A equipe do Petto · Quem constrói e cuida do bot'),
    description: L('Meet the people who build, test and look after Petto every day.', 'Conoce a las personas que construyen, prueban y cuidan a Petto cada día.', 'Conheça as pessoas que constroem, testam e cuidam do Petto todos os dias.'),
  },
  roadmap: {
    title: L('Petto Roadmap · What is being built, planned and shipped', 'Hoja de ruta de Petto · Qué se construye, qué sigue y qué salió', 'Roteiro do Petto · O que está em construção, planejado e pronto'),
    description: L('What the team is building now, what is planned next and what already shipped, so you know what to expect.', 'Lo que el equipo construye ahora, lo que viene después y lo que ya salió, para que sepas qué esperar.', 'O que a equipe está construindo agora, o que vem depois e o que já saiu, para você saber o que esperar.'),
  },
  changelog: {
    title: L('Petto Changelog · What changed in each release, and why', 'Novedades de Petto · Qué cambió en cada versión y por qué', 'Novidades do Petto · O que mudou em cada versão e por quê'),
    description: L('Every release of Petto with what changed and why, in your language.', 'Cada versión de Petto con qué cambió y por qué, en tu idioma.', 'Cada versão do Petto com o que mudou e por quê, no seu idioma.'),
  },
  faq: {
    title: L('Petto FAQ · How it works, what it costs, what it needs', 'Preguntas frecuentes de Petto · Cómo funciona y cuánto cuesta', 'Perguntas frequentes do Petto · Como funciona e quanto custa'),
    description: L('Straight answers about how Petto works, what it costs, which permissions it needs and what it stores.', 'Respuestas directas sobre cómo funciona Petto, cuánto cuesta, qué permisos necesita y qué guarda.', 'Respostas diretas sobre como o Petto funciona, quanto custa, quais permissões precisa e o que guarda.'),
  },
  apply: {
    title: L('Join the Petto team · Apply for support, testing or dev', 'Únete al equipo de Petto · Postula a soporte, pruebas o desarrollo', 'Entre para a equipe do Petto · Candidate-se a suporte, testes ou dev'),
    description: L('Apply to help Petto with support, testing or development, and tell us what you can bring.', 'Postula para ayudar a Petto con soporte, pruebas o desarrollo, y cuéntanos qué puedes aportar.', 'Candidate-se para ajudar o Petto com suporte, testes ou desenvolvimento e conte o que você pode oferecer.'),
  },
  feedback: {
    title: L('Petto Feedback · Post ideas, vote and follow what ships', 'Feedback de Petto · Publica ideas, vota y sigue lo que sale', 'Feedback do Petto · Publique ideias, vote e acompanhe o que sai'),
    description: L('Post an idea, vote on the ideas of others and follow what happens to them, from planned to shipped.', 'Publica una idea, vota las de otros y sigue qué pasa con ellas, desde planeada hasta lista.', 'Publique uma ideia, vote nas dos outros e acompanhe o que acontece com elas, de planejada a pronta.'),
  },
  news: {
    title: L('Petto News · Announcements and changes, explained', 'Noticias de Petto · Anuncios y cambios, explicados', 'Notícias do Petto · Anúncios e mudanças, explicados'),
    description: L('New bots, new tools and changes in Discord, explained, and what each one means for your server.', 'Bots nuevos, herramientas nuevas y cambios en Discord, explicados, y qué significa cada uno para tu servidor.', 'Novos bots, novas ferramentas e mudanças no Discord, explicados, e o que cada um significa para o seu servidor.'),
  },
  blog: {
    title: L('The Petto blog · How it is made and what we learn', 'El blog de Petto · Cómo se hace y qué aprendemos', 'O blog do Petto · Como é feito e o que aprendemos'),
    description: L('Stories from the team that builds Petto: how things are made, what failed and what worked.', 'Historias del equipo que construye Petto: cómo se hacen las cosas, qué falló y qué funcionó.', 'Histórias da equipe que constrói o Petto: como as coisas são feitas, o que falhou e o que funcionou.'),
  },
  credits: {
    title: L('Petto Credits · The tools, art and people behind it', 'Créditos de Petto · Las herramientas, el arte y las personas detrás', 'Créditos do Petto · As ferramentas, a arte e as pessoas por trás'),
    description: L('The open source tools, the art and the people that make Petto possible, with thanks.', 'Las herramientas de código abierto, el arte y las personas que hacen posible a Petto, con gracias.', 'As ferramentas de código aberto, a arte e as pessoas que tornam o Petto possível, com agradecimentos.'),
  },
  brand: {
    title: L('Petto Brand · The duck, its colors and how to use them', 'Marca de Petto · El pato, sus colores y cómo usarlos', 'Marca do Petto · O pato, suas cores e como usá-las'),
    description: L('The Petto duck, its colors and banners, and how to use them in your own server or post.', 'El pato de Petto, sus colores y banners, y cómo usarlos en tu propio servidor o publicación.', 'O pato do Petto, suas cores e banners, e como usá-los no seu próprio servidor ou post.'),
  },
  timestamp: {
    title: L('Timestamp generator · A free Discord tool by Petto', 'Generador de timestamps · Una herramienta gratis de Discord por Petto', 'Gerador de timestamps · Uma ferramenta grátis do Discord pelo Petto'),
    description: L('Pick a date and time and copy a Discord timestamp that every member sees in their own time zone. Free, no login.', 'Elige una fecha y hora y copia un timestamp de Discord que cada miembro ve en su propia zona horaria. Gratis, sin iniciar sesión.', 'Escolha uma data e hora e copie um timestamp do Discord que cada membro vê no seu próprio fuso. Grátis, sem login.'),
  },
  snowflake: {
    title: L('Snowflake decoder · A free Discord tool by Petto', 'Decodificador de snowflake · Herramienta gratis de Petto', 'Decodificador de snowflake · Ferramenta grátis do Petto'),
    description: L('Paste any Discord ID, of a user, a server or a message, and see exactly when it was created. Free, no login.', 'Pega cualquier ID de Discord, de un usuario, servidor o mensaje, y mira exactamente cuándo se creó. Gratis, sin iniciar sesión.', 'Cole qualquer ID do Discord, de um usuário, servidor ou mensagem, e veja exatamente quando foi criado. Grátis, sem login.'),
  },
  'embed-code': {
    title: L('Embed code generator · A free Discord tool by Petto', 'Generador de código de embeds · Una herramienta gratis por Petto', 'Gerador de código de embeds · Uma ferramenta grátis pelo Petto'),
    description: L('Build a Discord message visually and get the code that sends it, with a live preview. Free, no login.', 'Crea un mensaje de Discord visualmente y obtén el código que lo envía, con vista previa en vivo. Gratis, sin iniciar sesión.', 'Crie uma mensagem do Discord visualmente e obtenha o código que a envia, com prévia ao vivo. Grátis, sem login.'),
  },
  'linked-roles': {
    title: L('Linked roles with Petto · Connect and unlock Petto Verified', 'Roles vinculados con Petto · Conecta y desbloquea Petto Verified', 'Cargos vinculados com o Petto · Conecte e libere o Petto Verified'),
    description: L('Connect your Petto account to Discord and unlock the Petto Verified role in servers that use linked roles.', 'Conecta tu cuenta de Petto con Discord y desbloquea el rol Petto Verified en los servidores que usan roles vinculados.', 'Conecte sua conta do Petto ao Discord e libere o cargo Petto Verified nos servidores que usam cargos vinculados.'),
  },
  terms: {
    title: L('Petto Terms of Service · The rules, in plain words', 'Términos de servicio de Petto · Las reglas, en palabras simples', 'Termos de serviço do Petto · As regras, em palavras simples'),
    description: L('The rules for using Petto, in plain words: what you can expect from the bot and what it expects from you.', 'Las reglas para usar Petto, en palabras simples: qué puedes esperar del bot y qué espera él de ti.', 'As regras para usar o Petto, em palavras simples: o que você pode esperar do bot e o que ele espera de você.'),
  },
  privacy: {
    title: L('Petto Privacy Policy · What it stores and why', 'Privacidad de Petto · Qué guarda y por qué', 'Privacidade do Petto · O que guarda e por quê'),
    description: L('What Petto stores, why it stores it and how to have it removed, in plain words.', 'Qué guarda Petto, por qué lo guarda y cómo pedir que lo borre, en palabras simples.', 'O que o Petto guarda, por que guarda e como pedir a remoção, em palavras simples.'),
  },
  cookies: {
    title: L('Petto Cookies · The few the site uses and what they do', 'Cookies de Petto · Las pocas que usa el sitio y qué hacen', 'Cookies do Petto · Os poucos que o site usa e o que fazem'),
    description: L('The few cookies the Petto site uses, what each one does and how to change your choice.', 'Las pocas cookies que usa el sitio de Petto, qué hace cada una y cómo cambiar tu elección.', 'Os poucos cookies que o site do Petto usa, o que cada um faz e como mudar a sua escolha.'),
  },
  refunds: {
    title: L('Petto Refund Policy · When a Premium payment is refunded', 'Reembolsos de Petto · Cuándo se reembolsa un pago de Premium', 'Reembolsos do Petto · Quando um pagamento do Premium é reembolsado'),
    description: L('When and how a Premium payment can be refunded, and who to ask.', 'Cuándo y cómo se puede reembolsar un pago de Premium, y a quién pedirlo.', 'Quando e como um pagamento do Premium pode ser reembolsado e a quem pedir.'),
  },
};
