// The text of the Features page, in the three languages: what Petto does, group by group. Only what the bot really does is listed here.
// `shots` names the screenshots to show next to a group (src/data/shotsIndex.ts: the files of src/data/shots, written by scripts/make-shots.mjs).
import type { Locale } from '../i18n/ui';

export interface FeatureGroup {
  id: string;
  icon: string;
  color: 'red' | 'yellow' | 'blue' | 'green';
  title: string;
  desc: string;
  points: string[];
  commands: string[];
  shots: string[];
  href?: string;
}

export interface FeaturesCopy {
  title: string;
  eyebrow: string;
  h1: string;
  lede: string;
  shotNote: string;
  cta: { add: string; commands: string; docs: string };
  allCommands: string;
  groups: FeatureGroup[];
  gallery: { eyebrow: string; title: string; desc: string; shots: string[] };
  closing: { title: string; desc: string };
}

// The lookups that are not beside a group, shown together at the end of the page.
const GALLERY = ['deezer-track', 'itunes-song', 'minecraft-user', 'chess', 'modrinth', 'pokemon', 'wikipedia', 'package', 'movie', 'crypto', 'animal'];

const en: FeaturesCopy = {
  title: 'Features',
  eyebrow: 'What Petto does',
  h1: 'Everything your server needs, in one bot',
  lede: 'Moderation that remembers, protection that reacts on its own, tickets, levels, giveaways and 19 lookups of other services. The screenshots below show how it looks in Discord.',
  shotNote: 'Simulated screenshots, built by the bot’s own code: the lookups show the real answers of each service, and the people are our team. Only Last.fm and TMDB, which need a key, use a sample.',
  cta: { add: 'Add to Discord', commands: 'See all commands', docs: 'Open the dashboard' },
  allCommands: 'All commands',
  gallery: { eyebrow: 'Lookups', title: 'Real answers, from real services', desc: 'These answers come from the services themselves: songs from Deezer and iTunes, players from Minecraft and Chess.com, packages from npm, anime from AniList and more.', shots: GALLERY },
  closing: { title: 'And a dashboard for all of it', desc: 'Every system has its own page in the dashboard, with a live preview of what the members will see, so nothing is configured blind.' },
  groups: [
    {
      id: 'moderation', icon: 'ph:gavel-fill', color: 'red', title: 'Moderation that keeps the history',
      desc: 'Ban, kick, mute and warn with a case for each one, notes on members and a message to the member that you can write yourself.',
      points: ['Cases and notes you can search later, and a list of the sanctions that are still active', 'Timed bans and mutes, softban and a hardban that only the owner and the admins can undo', 'The message to the member, the reply and the log of every sanction can be redesigned', 'Public appeals: the member answers a form on a page and the team decides in Discord'],
      commands: ['!ban', '!mute', '!warn', '!cases', '!notes'], shots: ['mod-ban', 'mod-mute'],
    },
    {
      id: 'protection', icon: 'ph:shield-check-fill', color: 'yellow', title: 'Protection that acts before you do',
      desc: 'Raids, nukes and scams are stopped by the bot while the staff is away, and every action is logged.',
      points: ['Anti-raid and anti-nuke with their own settings for each protection, and a lockdown you can start with one command', 'Anti-scam for the same message sent in many channels and for brand new accounts', 'Automod with ready-made rules, your own filters and strikes that grow into a punishment', 'A honeypot channel that catches the accounts that write where nobody should'],
      commands: ['!lockdown', '!automod', '!antinuke', '!honeypot'], shots: ['anti-scam', 'honeypot'],
    },
    {
      id: 'tickets', icon: 'ph:chat-teardrop-text-fill', color: 'blue', title: 'Tickets with a panel of your own',
      desc: 'Members open a private channel with the team; you choose how the panel looks, who answers and when.',
      points: ['Panels you can design, schedule and limit, with priority, notes and transfer between staff members', 'A welcome message and a channel name that use the member’s data', 'The transcript is kept when the ticket closes'],
      commands: ['!ticket', '!close', '!claim'], shots: ['tickets-panel', 'tickets-welcome'],
    },
    {
      id: 'levels', icon: 'ph:chart-line-up-fill', color: 'green', title: 'Levels, ranks and rewards',
      desc: 'Text and voice XP with the protections that stop people from farming it, and a rank card for each member.',
      points: ['Role rewards by level, multipliers by role, channel or category, and weekly and monthly boards', 'Rank card and level-up message you can design, with a card image', 'The level can also be the requirement of a giveaway, with bonus entries'],
      commands: ['!rank', '!top', '!level'], shots: ['levelup', 'rank'],
    },
    {
      id: 'giveaways', icon: 'ph:gift-fill', color: 'yellow', title: 'Giveaways that are fair',
      desc: 'Start one in seconds, ask for what you want and let the bot pick the winners.',
      points: ['A required level (text or voice) and a time for the winners to claim the prize', 'Bonus entries by role or by level, reroll, and messages for the winner that you write', 'Presets and saved designs so the next one takes one command'],
      commands: ['!giveaway start', '!giveaway quick', '!giveaway reroll'], shots: ['giveaway', 'giveaway-ended'],
    },
    {
      id: 'integrations', icon: 'ph:plug-fill', color: 'blue', title: '19 lookups of other services',
      desc: 'Members can look up songs, servers, profiles and prices without leaving Discord, with the same short commands everywhere.',
      points: ['Music: Last.fm now playing with the cover, Deezer and iTunes', 'Games: Minecraft servers and players, Roblox, Steam, Chess.com, Modrinth', 'Creators and code: Twitch, YouTube, GitHub, npm and PyPI packages', 'Anime, movies, Pokémon, Wikipedia, crypto and currency conversion'],
      commands: ['!np', '!deezer', '!mc', '!gh', '!currency', '!anime'], shots: ['lastfm-now', 'minecraft-server', 'anime', 'github-repo', 'currency', 'modrinth'], href: '/commands#integrations',
    },
    {
      id: 'community', icon: 'ph:users-three-fill', color: 'green', title: 'A community that feels alive',
      desc: 'The small things that make a server yours.',
      points: ['Welcome and verification, including a letters-in-an-image captcha', 'Birthdays, polls, suggestions, confessions and a starboard', 'Counters, a counting game and voice channels the members control', 'Partners, uploads and a public leaderboard page'],
      commands: ['!birthday', '!poll', '!suggest', '!starboard'], shots: ['poll'],
    },
    {
      id: 'stats', icon: 'ph:chart-bar-fill', color: 'red', title: 'Statistics and analysis you can trust',
      desc: 'See what happens in your server and compare it with the period before: trends, the busiest hours of the week, the top channels and members, how the server grows and how long members stay.',
      points: ['Line charts of messages, voice time and active members, each against the period before, with the change in percent', 'A heat map of the week by hour, the top channels and members with their share, and the channels that stayed quiet', 'Growth: who joins, who leaves and how long the ones who left had stayed, plus the page of one member with their streak and place', 'Privacy first: only counts, never what is written. Any member can stop being counted with one button, and a server can turn counting off or delete it all'],
      commands: ['!stats', '!stats heatmap', '!stats @member', '!stats privacy', '!statsconfig'], shots: ['stats-overview', 'stats-heatmap', 'stats-member', 'stats-privacy'],
    },
    {
      id: 'custom', icon: 'ph:code-fill', color: 'yellow', title: 'Make it yours',
      desc: 'Write your own commands, build messages visually and keep every setting in a dashboard.',
      points: ['Petto Code: your own commands with embeds, buttons, forms and saved data', 'Embed Builder for embeds and Components V2 messages, with a live preview', 'Custom prefix for the server, and one of your own for each person'],
      commands: ['!customcommand', '!prefix'], shots: [], href: '/embed-builder',
    },
  ],
};

const es: FeaturesCopy = {
  title: 'Características',
  eyebrow: 'Lo que hace Petto',
  h1: 'Todo lo que tu servidor necesita, en un solo bot',
  lede: 'Moderación que recuerda, protección que reacciona sola, tickets, niveles, sorteos y 19 consultas a otros servicios. Las capturas de abajo muestran cómo se ve en Discord.',
  shotNote: 'Capturas simuladas, construidas por el propio código del bot: las consultas muestran las respuestas reales de cada servicio, y las personas son nuestro equipo. Solo Last.fm y TMDB, que necesitan una clave, usan un ejemplo.',
  cta: { add: 'Añadir a Discord', commands: 'Ver todos los comandos', docs: 'Abrir el dashboard' },
  allCommands: 'Todos los comandos',
  gallery: { eyebrow: 'Consultas', title: 'Respuestas reales, de servicios reales', desc: 'Estas respuestas vienen de los propios servicios: canciones de Deezer e iTunes, jugadores de Minecraft y Chess.com, paquetes de npm, anime de AniList y más.', shots: GALLERY },
  closing: { title: 'Y un dashboard para todo', desc: 'Cada sistema tiene su propia página en el dashboard, con una vista previa en vivo de lo que verán los miembros, así que nada se configura a ciegas.' },
  groups: [
    {
      id: 'moderation', icon: 'ph:gavel-fill', color: 'red', title: 'Moderación que guarda el historial',
      desc: 'Banea, expulsa, silencia y advierte con un caso por cada acción, notas sobre los miembros y un mensaje al miembro que puedes escribir tú.',
      points: ['Casos y notas que puedes buscar después, y una lista de las sanciones que siguen activas', 'Baneos y silencios temporales, softban y un hardban que solo el dueño y los admins pueden deshacer', 'El mensaje al miembro, la respuesta y el registro de cada sanción se pueden rediseñar', 'Apelaciones públicas: el miembro responde un formulario en una página y el equipo decide en Discord'],
      commands: ['!ban', '!mute', '!warn', '!cases', '!notes'], shots: ['mod-ban', 'mod-mute'],
    },
    {
      id: 'protection', icon: 'ph:shield-check-fill', color: 'yellow', title: 'Protección que actúa antes que tú',
      desc: 'Raids, nukes y estafas los frena el bot mientras el staff no está, y cada acción queda registrada.',
      points: ['Anti-raid y anti-nuke con ajustes propios para cada protección, y un lockdown que activas con un comando', 'Anti-scam para el mismo mensaje enviado en muchos canales y para cuentas recién creadas', 'Automod con reglas listas, tus propios filtros y strikes que escalan hasta un castigo', 'Un canal honeypot que atrapa a las cuentas que escriben donde nadie debería'],
      commands: ['!lockdown', '!automod', '!antinuke', '!honeypot'], shots: ['anti-scam', 'honeypot'],
    },
    {
      id: 'tickets', icon: 'ph:chat-teardrop-text-fill', color: 'blue', title: 'Tickets con un panel a tu manera',
      desc: 'Los miembros abren un canal privado con el equipo; tú eliges cómo se ve el panel, quién responde y cuándo.',
      points: ['Paneles que puedes diseñar, programar y limitar, con prioridad, notas y traspaso entre miembros del staff', 'Un mensaje de bienvenida y un nombre de canal que usan los datos del miembro', 'La transcripción se guarda cuando el ticket se cierra'],
      commands: ['!ticket', '!close', '!claim'], shots: ['tickets-panel', 'tickets-welcome'],
    },
    {
      id: 'levels', icon: 'ph:chart-line-up-fill', color: 'green', title: 'Niveles, rangos y recompensas',
      desc: 'XP de texto y de voz con protecciones para que nadie la farmee, y una tarjeta de rango para cada miembro.',
      points: ['Roles de recompensa por nivel, multiplicadores por rol, canal o categoría, y tablas semanales y mensuales', 'Tarjeta de rango y mensaje de subida de nivel que puedes diseñar, con imagen de tarjeta', 'El nivel también puede ser requisito de un sorteo, con entradas extra'],
      commands: ['!rank', '!top', '!level'], shots: ['levelup', 'rank'],
    },
    {
      id: 'giveaways', icon: 'ph:gift-fill', color: 'yellow', title: 'Sorteos justos',
      desc: 'Crea uno en segundos, pide lo que quieras y deja que el bot elija a los ganadores.',
      points: ['Un nivel requerido (de texto o de voz) y un tiempo para que los ganadores reclamen el premio', 'Entradas extra por rol o por nivel, reroll y mensajes para el ganador que tú escribes', 'Presets y diseños guardados para que el siguiente lleve un solo comando'],
      commands: ['!giveaway start', '!giveaway quick', '!giveaway reroll'], shots: ['giveaway', 'giveaway-ended'],
    },
    {
      id: 'integrations', icon: 'ph:plug-fill', color: 'blue', title: '19 consultas a otros servicios',
      desc: 'Los miembros pueden buscar canciones, servidores, perfiles y precios sin salir de Discord, con los mismos comandos cortos en todas partes.',
      points: ['Música: Last.fm sonando ahora con la portada, Deezer e iTunes', 'Juegos: servidores y jugadores de Minecraft, Roblox, Steam, Chess.com, Modrinth', 'Creadores y código: Twitch, YouTube, GitHub, paquetes de npm y PyPI', 'Anime, películas, Pokémon, Wikipedia, cripto y conversión de monedas'],
      commands: ['!np', '!deezer', '!mc', '!gh', '!currency', '!anime'], shots: ['lastfm-now', 'minecraft-server', 'anime', 'github-repo', 'currency', 'modrinth'], href: '/commands#integrations',
    },
    {
      id: 'community', icon: 'ph:users-three-fill', color: 'green', title: 'Una comunidad que se siente viva',
      desc: 'Los detalles pequeños que hacen que un servidor sea tuyo.',
      points: ['Bienvenida y verificación, incluido un captcha de letras en una imagen', 'Cumpleaños, encuestas, sugerencias, confesiones y un starboard', 'Contadores, un juego de contar y canales de voz que controlan los miembros', 'Partners, uploads y una página pública de leaderboard'],
      commands: ['!birthday', '!poll', '!suggest', '!starboard'], shots: ['poll'],
    },
    {
      id: 'stats', icon: 'ph:chart-bar-fill', color: 'red', title: 'Estadísticas y análisis de confianza',
      desc: 'Mira qué pasa en tu servidor y compáralo con el periodo anterior: tendencias, las horas más activas de la semana, los canales y miembros top, cómo crece el servidor y cuánto se quedan los miembros.',
      points: ['Gráficas de líneas de mensajes, tiempo en voz y miembros activos, cada una contra el periodo anterior, con el cambio en porcentaje', 'Un mapa de calor de la semana por hora, el top de canales y miembros con su porcentaje, y los canales que estuvieron en silencio', 'Crecimiento: quién entra, quién sale y cuánto llevaban los que se fueron, y la página de un miembro con su racha y su lugar', 'Privacidad primero: solo cuentas, nunca lo que se escribe. Cualquier miembro puede dejar de ser contado con un botón, y un servidor puede apagar el conteo o borrarlo todo'],
      commands: ['!stats', '!stats heatmap', '!stats @miembro', '!stats privacy', '!statsconfig'], shots: ['stats-overview', 'stats-heatmap', 'stats-member', 'stats-privacy'],
    },
    {
      id: 'custom', icon: 'ph:code-fill', color: 'yellow', title: 'Hazlo tuyo',
      desc: 'Escribe tus propios comandos, crea mensajes de forma visual y mantén cada ajuste en un dashboard.',
      points: ['Petto Code: tus propios comandos con embeds, botones, formularios y datos guardados', 'Embed Builder para embeds y mensajes Components V2, con vista previa en vivo', 'Prefijo propio para el servidor, y uno tuyo para cada persona'],
      commands: ['!customcommand', '!prefix'], shots: [], href: '/embed-builder',
    },
  ],
};

const ptBR: FeaturesCopy = {
  title: 'Recursos',
  eyebrow: 'O que o Petto faz',
  h1: 'Tudo o que seu servidor precisa, em um só bot',
  lede: 'Moderação que lembra, proteção que reage sozinha, tickets, níveis, sorteios e 19 consultas a outros serviços. As capturas abaixo mostram como fica no Discord.',
  shotNote: 'Capturas simuladas, construidas por el propio código del bot: las consultas muestran las respuestas reales de cada servicio, y las personas son nuestro equipo. Solo Last.fm y TMDB, que necesitan una clave, usan un ejemplo.',
  cta: { add: 'Adicionar ao Discord', commands: 'Ver todos os comandos', docs: 'Abrir o dashboard' },
  allCommands: 'Todos os comandos',
  gallery: { eyebrow: 'Consultas', title: 'Respostas reais, de serviços reais', desc: 'Estas respostas vêm dos próprios serviços: músicas do Deezer e do iTunes, jogadores do Minecraft e do Chess.com, pacotes do npm, anime do AniList e mais.', shots: GALLERY },
  closing: { title: 'E um dashboard para tudo', desc: 'Cada sistema tem a sua própria página no dashboard, com uma prévia ao vivo do que os membros vão ver, então nada é configurado às cegas.' },
  groups: [
    {
      id: 'moderation', icon: 'ph:gavel-fill', color: 'red', title: 'Moderação que guarda o histórico',
      desc: 'Bana, expulse, silencie e advirta com um caso para cada ação, notas sobre os membros e uma mensagem ao membro que você mesmo escreve.',
      points: ['Casos e notas que você pode procurar depois, e uma lista das punições que ainda estão ativas', 'Banimentos e silenciamentos temporários, softban e um hardban que só o dono e os admins podem desfazer', 'A mensagem ao membro, a resposta e o registro de cada punição podem ser redesenhados', 'Apelações públicas: o membro responde um formulário em uma página e a equipe decide no Discord'],
      commands: ['!ban', '!mute', '!warn', '!cases', '!notes'], shots: ['mod-ban', 'mod-mute'],
    },
    {
      id: 'protection', icon: 'ph:shield-check-fill', color: 'yellow', title: 'Proteção que age antes de você',
      desc: 'Raids, nukes e golpes são barrados pelo bot enquanto a equipe está fora, e cada ação fica registrada.',
      points: ['Anti-raid e anti-nuke com ajustes próprios para cada proteção, e um lockdown que você ativa com um comando', 'Anti-scam para a mesma mensagem enviada em muitos canais e para contas recém-criadas', 'Automod com regras prontas, seus próprios filtros e strikes que escalam até uma punição', 'Um canal honeypot que pega as contas que escrevem onde ninguém deveria'],
      commands: ['!lockdown', '!automod', '!antinuke', '!honeypot'], shots: ['anti-scam', 'honeypot'],
    },
    {
      id: 'tickets', icon: 'ph:chat-teardrop-text-fill', color: 'blue', title: 'Tickets com um painel do seu jeito',
      desc: 'Os membros abrem um canal privado com a equipe; você escolhe como o painel aparece, quem responde e quando.',
      points: ['Painéis que você pode desenhar, agendar e limitar, com prioridade, notas e transferência entre membros da equipe', 'Uma mensagem de boas-vindas e um nome de canal que usam os dados do membro', 'A transcrição é guardada quando o ticket é fechado'],
      commands: ['!ticket', '!close', '!claim'], shots: ['tickets-panel', 'tickets-welcome'],
    },
    {
      id: 'levels', icon: 'ph:chart-line-up-fill', color: 'green', title: 'Níveis, ranks e recompensas',
      desc: 'XP de texto e de voz com proteções para ninguém farmar, e um card de rank para cada membro.',
      points: ['Cargos de recompensa por nível, multiplicadores por cargo, canal ou categoria, e rankings semanais e mensais', 'Card de rank e mensagem de subida de nível que você pode desenhar, com imagem de card', 'O nível também pode ser requisito de um sorteio, com entradas extras'],
      commands: ['!rank', '!top', '!level'], shots: ['levelup', 'rank'],
    },
    {
      id: 'giveaways', icon: 'ph:gift-fill', color: 'yellow', title: 'Sorteios justos',
      desc: 'Crie um em segundos, peça o que quiser e deixe o bot escolher os vencedores.',
      points: ['Um nível exigido (de texto ou de voz) e um tempo para os vencedores resgatarem o prêmio', 'Entradas extras por cargo ou por nível, reroll e mensagens para o vencedor que você escreve', 'Presets e designs salvos para o próximo levar um único comando'],
      commands: ['!giveaway start', '!giveaway quick', '!giveaway reroll'], shots: ['giveaway', 'giveaway-ended'],
    },
    {
      id: 'integrations', icon: 'ph:plug-fill', color: 'blue', title: '19 consultas a outros serviços',
      desc: 'Os membros podem buscar músicas, servidores, perfis e preços sem sair do Discord, com os mesmos comandos curtos em todo lugar.',
      points: ['Música: Last.fm tocando agora com a capa, Deezer e iTunes', 'Jogos: servidores e jogadores de Minecraft, Roblox, Steam, Chess.com, Modrinth', 'Criadores e código: Twitch, YouTube, GitHub, pacotes do npm e PyPI', 'Anime, filmes, Pokémon, Wikipédia, cripto e conversão de moedas'],
      commands: ['!np', '!deezer', '!mc', '!gh', '!currency', '!anime'], shots: ['lastfm-now', 'minecraft-server', 'anime', 'github-repo', 'currency', 'modrinth'], href: '/commands#integrations',
    },
    {
      id: 'community', icon: 'ph:users-three-fill', color: 'green', title: 'Uma comunidade que parece viva',
      desc: 'Os pequenos detalhes que fazem um servidor ser seu.',
      points: ['Boas-vindas e verificação, incluindo um captcha de letras em uma imagem', 'Aniversários, enquetes, sugestões, confissões e um starboard', 'Contadores, um jogo de contar e canais de voz que os membros controlam', 'Parceiros, uploads e uma página pública de leaderboard'],
      commands: ['!birthday', '!poll', '!suggest', '!starboard'], shots: ['poll'],
    },
    {
      id: 'stats', icon: 'ph:chart-bar-fill', color: 'red', title: 'Estatísticas e análise confiáveis',
      desc: 'Veja o que acontece no seu servidor e compare com o período anterior: tendências, os horários mais ativos da semana, os canais e membros top, como o servidor cresce e quanto tempo os membros ficam.',
      points: ['Gráficos de linhas de mensagens, tempo em voz e membros ativos, cada um contra o período anterior, com a variação em porcentagem', 'Um mapa de calor da semana por hora, o top de canais e membros com sua porcentagem, e os canais que ficaram em silêncio', 'Crescimento: quem entra, quem sai e quanto tempo os que saíram ficaram, e a página de um membro com sua sequência e seu lugar', 'Privacidade em primeiro lugar: só contagens, nunca o que é escrito. Qualquer membro pode deixar de ser contado com um botão, e um servidor pode desligar a contagem ou apagar tudo'],
      commands: ['!stats', '!stats heatmap', '!stats @membro', '!stats privacy', '!statsconfig'], shots: ['stats-overview', 'stats-heatmap', 'stats-member', 'stats-privacy'],
    },
    {
      id: 'custom', icon: 'ph:code-fill', color: 'yellow', title: 'Faça do seu jeito',
      desc: 'Escreva seus próprios comandos, crie mensagens de forma visual e mantenha cada ajuste em um dashboard.',
      points: ['Petto Code: seus próprios comandos com embeds, botões, formulários e dados guardados', 'Embed Builder para embeds e mensagens Components V2, com prévia ao vivo', 'Prefixo próprio para o servidor, e um seu para cada pessoa'],
      commands: ['!customcommand', '!prefix'], shots: [], href: '/embed-builder',
    },
  ],
};

export const featuresCopy: Record<Locale, FeaturesCopy> = { en, es, 'pt-BR': ptBR };
