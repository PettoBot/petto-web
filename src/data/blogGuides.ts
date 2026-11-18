// The blog posts that compare Petto with other bots and help a server move from MEE6, Carl-bot or Dyno (one component draws all of them: src/components/BlogGuide.astro).
// Every fact about another bot was read on its own page on CHECKED_ON (mee6.xyz/en/premium and its help article of June 16, 2026, carl.gg, dyno.gg/premium); what a page did not say is
// written as "not on its page", never guessed. Prices and limits change: when they do, read the page again and change this file and the date. The facts about Petto come from the
// catalog of Premium (src/data/premiumCatalog.ts) and its limits (src/utils/planLimits.ts), the same ones the Premium page shows.
import type { Locale } from '../i18n/ui';

export type GuideKey = 'vsBots' | 'fromMee6' | 'fromCarl' | 'fromDyno';
export type FigKey = 'quickSetup' | 'welcomePage' | 'welcomeDiscord' | 'rankDiscord' | 'reactionDiscord' | 'automodDash' | 'ticketsDiscord' | 'giveawaysDash';
export interface GuideSection { h2: string; p?: string[]; list?: [string, string][]; table?: { head: string[]; rows: string[][] }; after?: string[]; figs?: FigKey[] }
export interface GuideContent { title: string; pill: string; h1: string; bannerAlt: string; lede: string; desc: string; sections: GuideSection[]; foot: string }

export const CHECKED_ON = '2026-11-18';
export const GUIDES: Record<GuideKey, { slug: string; banner: string; date: Record<'en' | 'es' | 'pt', string> }> = {
  vsBots: { slug: 'petto-vs-other-bots', banner: '/assets/vs-bots-banner.svg', date: { en: 'November 18, 2026', es: '18 de noviembre de 2026', pt: '18 de novembro de 2026' } },
  fromMee6: { slug: 'switch-from-mee6', banner: '/assets/switch-mee6-banner.svg', date: { en: 'November 18, 2026', es: '18 de noviembre de 2026', pt: '18 de novembro de 2026' } },
  fromCarl: { slug: 'switch-from-carl-bot', banner: '/assets/switch-carl-banner.svg', date: { en: 'November 18, 2026', es: '18 de noviembre de 2026', pt: '18 de novembro de 2026' } },
  fromDyno: { slug: 'switch-from-dyno', banner: '/assets/switch-dyno-banner.svg', date: { en: 'November 18, 2026', es: '18 de noviembre de 2026', pt: '18 de novembro de 2026' } },
};

const L = (lang: Locale): 'en' | 'es' | 'pt' => (lang === 'es' ? 'es' : lang === 'pt-BR' ? 'pt' : 'en');
const WIKI = { en: 'https://wiki.petto.sbs/guides/migrating-from-another-bot', es: 'https://wiki.petto.sbs/es/guides/migrating-from-another-bot', pt: 'https://wiki.petto.sbs/pt-br/guides/migrating-from-another-bot' };

// Where each thing lives in Petto, by language (the names are the ones of the dashboard menu).
const PLACE: Record<string, Record<'en' | 'es' | 'pt', string>> = {
  welcome: { en: 'Welcome → Welcome messages (up to 25 messages each for welcome, leave and boost)', es: 'Bienvenida → Mensajes de bienvenida (hasta 25 mensajes cada uno para bienvenida, despedida y boost)', pt: 'Boas-vindas → Mensagens de boas-vindas (até 25 mensagens cada uma para boas-vindas, saída e boost)' },
  reaction: { en: 'Roles → Reaction roles', es: 'Roles → Roles por reacción', pt: 'Cargos → Cargos por reação' },
  levels: { en: 'Leveling → Leveling and Level rewards', es: 'Niveles → Niveles y Recompensas por nivel', pt: 'Níveis → Níveis e Recompensas de nível' },
  commands: { en: 'Automation → Custom commands and Commands in code', es: 'Automatización → Comandos personalizados y Comandos en código', pt: 'Automação → Comandos personalizados e Comandos em código' },
  automod: { en: 'Moderation → AutoMod templates and Moderation rules', es: 'Moderación → Plantillas de AutoMod y Reglas de moderación', pt: 'Moderação → Modelos de AutoMod e Regras de moderação' },
  logs: { en: 'Security → Logging', es: 'Seguridad → Registros', pt: 'Segurança → Logs' },
  tickets: { en: 'Community → Tickets', es: 'Comunidad → Tickets', pt: 'Comunidade → Tickets' },
  giveaways: { en: 'Community → Giveaways', es: 'Comunidad → Sorteos', pt: 'Comunidade → Sorteios' },
  forms: { en: 'Forms', es: 'Formularios', pt: 'Formulários' },
  feeds: { en: 'Feeds (one page for each platform)', es: 'Feeds (una página por plataforma)', pt: 'Feeds (uma página por plataforma)' },
  boards: { en: 'Community → Boards (the starboard)', es: 'Comunidad → Tableros (el starboard)', pt: 'Comunidade → Quadros (o starboard)' },
  timers: { en: 'Automation → Timers', es: 'Automatización → Temporizadores', pt: 'Automação → Temporizadores' },
  joinroles: { en: 'Roles → Join roles', es: 'Roles → Roles al entrar', pt: 'Cargos → Cargos ao entrar' },
  sticky: { en: 'Roles → Sticky roles, and Automation → Sticky messages', es: 'Roles → Roles persistentes, y Automatización → Mensajes fijos', pt: 'Cargos → Cargos persistentes, e Automação → Mensagens fixas' },
  suggestions: { en: 'Community → Suggestions', es: 'Comunidad → Sugerencias', pt: 'Comunidade → Sugestões' },
  perms: { en: 'Security → Permissions', es: 'Seguridad → Permisos', pt: 'Segurança → Permissões' },
  polls: { en: 'Community → Polls', es: 'Comunidad → Encuestas', pt: 'Comunidade → Enquetes' },
  birthdays: { en: 'Community → Birthdays', es: 'Comunidad → Cumpleaños', pt: 'Comunidade → Aniversários' },
  voice: { en: 'Community → VoiceMaster (temporary voice channels)', es: 'Comunidad → VoiceMaster (canales de voz temporales)', pt: 'Comunidade → VoiceMaster (canais de voz temporários)' },
  moderation: { en: 'Moderation → Moderation and Case log (the history of the old bot does not move)', es: 'Moderación → Moderación y Registro de casos (el historial del bot anterior no se traslada)', pt: 'Moderação → Moderação e Registro de casos (o histórico do bot anterior não é transferido)' },
  autoresp: { en: 'Automation → Autoresponders', es: 'Automatización → Autorrespuestas', pt: 'Automação → Respostas automáticas' },
  prefix: { en: 'The prefix of Petto (`!prefix`), set in the dashboard or with the command', es: 'El prefijo de Petto (`!prefix`), desde el panel o con el comando', pt: 'O prefixo do Petto (`!prefix`), no painel ou pelo comando' },
  none: { en: 'Petto has no economy system', es: 'Petto no tiene sistema de economía', pt: 'O Petto não tem sistema de economia' },
};

type Row = [Record<'en' | 'es' | 'pt', string>, string];
const r = (en: string, es: string, pt: string, place: string): Row => [{ en, es, pt }, place];

const ROWS: Record<'fromMee6' | 'fromCarl' | 'fromDyno', Row[]> = {
  fromMee6: [
    r('Welcome & goodbye messages', 'Mensajes de bienvenida y despedida', 'Mensagens de boas-vindas e despedida', 'welcome'),
    r('Reaction roles', 'Roles por reacción', 'Cargos por reação', 'reaction'),
    r('XP and levels', 'XP y niveles', 'XP e níveis', 'levels'),
    r('Custom commands', 'Comandos personalizados', 'Comandos personalizados', 'commands'),
    r('Automations', 'Automatizaciones', 'Automações', 'autoresp'),
    r('Polls', 'Encuestas', 'Enquetes', 'polls'),
    r('Giveaways', 'Sorteos', 'Sorteios', 'giveaways'),
    r('Social alerts (YouTube, Twitch and more)', 'Alertas sociales (YouTube, Twitch y más)', 'Alertas sociais (YouTube, Twitch e mais)', 'feeds'),
    r('Birthday messages', 'Mensajes de cumpleaños', 'Mensagens de aniversário', 'birthdays'),
    r('Starboard', 'Starboard', 'Starboard', 'boards'),
    r('Reminders and timers', 'Recordatorios y temporizadores', 'Lembretes e temporizadores', 'timers'),
    r('Temporary channels', 'Canales temporales', 'Canais temporários', 'voice'),
    r('Economy', 'Economía', 'Economia', 'none'),
    r('Custom prefix', 'Prefijo personalizado', 'Prefixo personalizado', 'prefix'),
  ],
  fromCarl: [
    r('Reaction roles', 'Roles por reacción', 'Cargos por reação', 'reaction'),
    r('Moderation: modlogs, timed punishments, infractions', 'Moderación: registros, castigos con tiempo, infracciones', 'Moderação: registros, punições com tempo, infrações', 'moderation'),
    r('Sticky roles', 'Roles persistentes', 'Cargos persistentes', 'sticky'),
    r('Automod', 'Automod', 'Automod', 'automod'),
    r('Logging', 'Registros', 'Logs', 'logs'),
    r('Custom commands (TagScript)', 'Comandos personalizados (TagScript)', 'Comandos personalizados (TagScript)', 'commands'),
    r('Suggestions', 'Sugerencias', 'Sugestões', 'suggestions'),
    r('Greetings', 'Saludos de bienvenida', 'Boas-vindas', 'welcome'),
    r('Permissions', 'Permisos', 'Permissões', 'perms'),
    r('Starboard and sticky messages', 'Starboard y mensajes fijos', 'Starboard e mensagens fixas', 'boards'),
    r('Twitch and YouTube alerts', 'Alertas de Twitch y YouTube', 'Alertas da Twitch e do YouTube', 'feeds'),
    r('Levels (Premium)', 'Niveles (Premium)', 'Níveis (Premium)', 'levels'),
  ],
  fromDyno: [
    r('Automod', 'Automod', 'Automod', 'automod'),
    r('Tickets', 'Tickets', 'Tickets', 'tickets'),
    r('Custom commands', 'Comandos personalizados', 'Comandos personalizados', 'commands'),
    r('Autoresponders', 'Autorrespuestas', 'Respostas automáticas', 'autoresp'),
    r('Giveaways', 'Sorteos', 'Sorteios', 'giveaways'),
    r('Forms', 'Formularios', 'Formulários', 'forms'),
    r('Reaction role menus', 'Menús de roles por reacción', 'Menus de cargos por reação', 'reaction'),
    r('Autoroles', 'Autoroles', 'Autocargos', 'joinroles'),
    r('Starboard', 'Starboard', 'Starboard', 'boards'),
    r('Levels', 'Niveles', 'Níveis', 'levels'),
    r('Automessage', 'Mensaje automático', 'Mensagem automática', 'timers'),
    r('Twitch, YouTube, TikTok, Reddit and Kick integrations', 'Integraciones de Twitch, YouTube, TikTok, Reddit y Kick', 'Integrações da Twitch, do YouTube, do TikTok, do Reddit e do Kick', 'feeds'),
  ],
};

interface BotInfo {
  name: string;
  intro: Record<'en' | 'es' | 'pt', string>;
  facts: Record<'en' | 'es' | 'pt', [string, string][]>;
  notes: Record<'en' | 'es' | 'pt', string[]>;
  desc: Record<'en' | 'es' | 'pt', string>;
  title: Record<'en' | 'es' | 'pt', string>;
  alt: Record<'en' | 'es' | 'pt', string>;
}

const BOTS: Record<'fromMee6' | 'fromCarl' | 'fromDyno', BotInfo> = {
  fromMee6: {
    name: 'MEE6',
    title: { en: 'How to switch from MEE6 to Petto', es: 'Cómo cambiar de MEE6 a Petto', pt: 'Como trocar o MEE6 pelo Petto' },
    alt: { en: 'MEE6 to Petto', es: 'De MEE6 a Petto', pt: 'Do MEE6 para o Petto' },
    desc: { en: 'A step-by-step guide to leave MEE6 without a gap: what to write down, where each thing lives in Petto and what does not move.', es: 'Una guía paso a paso para dejar MEE6 sin quedarte desprotegido: qué anotar, dónde vive cada cosa en Petto y qué no se traslada.', pt: 'Um guia passo a passo para deixar o MEE6 sem ficar desprotegido: o que anotar, onde cada coisa fica no Petto e o que não é transferido.' },
    intro: {
      en: 'MEE6 puts most of its plugins behind Premium. If your server uses its welcome messages, reaction roles, levels or custom commands, those are the plugins its own comparison table marks as Premium, so a move is also a chance to see what the same things cost in a bot where most of them are free.',
      es: 'MEE6 pone la mayoría de sus plugins en Premium. Si tu servidor usa sus mensajes de bienvenida, roles por reacción, niveles o comandos personalizados, son justo los plugins que su propia tabla de comparación marca como Premium, así que mudarte también es una oportunidad de ver cuánto cuestan las mismas cosas en un bot donde la mayoría son gratis.',
      pt: 'O MEE6 coloca a maioria dos plugins no Premium. Se o seu servidor usa as mensagens de boas-vindas, os cargos por reação, os níveis ou os comandos personalizados, são justamente os plugins que a própria tabela de comparação dele marca como Premium, então trocar também é uma chance de ver quanto as mesmas coisas custam em um bot em que a maioria é grátis.',
    },
    facts: {
      en: [['Free in MEE6: ', 'the Achievements and Starboard plugins, a search command and one reminder or timer, according to its help article of June 16, 2026.'], ['Premium in MEE6: ', 'welcome and goodbye messages, reaction roles (40), custom commands (500), automations (50), XP and levels, polls, giveaways, social alerts, an economy plugin and more.'], ['Prices on mee6.xyz/en/premium: ', '€5.99 for the first month and €11.99 after; €24.99 for the first year and €49.99 after; or €44.99 once for Lifetime. Its AI services are sold separately.']],
      es: [['Gratis en MEE6: ', 'los plugins de Logros y Starboard, un comando de búsqueda y un recordatorio o temporizador, según su artículo de ayuda del 16 de junio de 2026.'], ['Premium en MEE6: ', 'mensajes de bienvenida y despedida, roles por reacción (40), comandos personalizados (500), automatizaciones (50), XP y niveles, encuestas, sorteos, alertas sociales, un plugin de economía y más.'], ['Precios en mee6.xyz/en/premium: ', '5,99 € el primer mes y 11,99 € después; 24,99 € el primer año y 49,99 € después; o 44,99 € una sola vez con Lifetime. Sus servicios de IA se venden aparte.']],
      pt: [['Grátis no MEE6: ', 'os plugins de Conquistas e Starboard, um comando de busca e um lembrete ou temporizador, segundo o artigo de ajuda de 16 de junho de 2026.'], ['Premium no MEE6: ', 'mensagens de boas-vindas e despedida, cargos por reação (40), comandos personalizados (500), automações (50), XP e níveis, enquetes, sorteios, alertas sociais, um plugin de economia e mais.'], ['Preços em mee6.xyz/en/premium: ', '€5,99 no primeiro mês e €11,99 depois; €24,99 no primeiro ano e €49,99 depois; ou €44,99 uma vez só no Lifetime. Os serviços de IA dele são vendidos à parte.']],
    },
    notes: {
      en: ['MEE6 has an Economy plugin and Petto has no economy system. If your server runs on it, keep MEE6 for that or look for a bot that has one.', 'The XP of your members does not move by itself. If you want to keep it, you can set it member by member with `/levels manage xp set`.'],
      es: ['MEE6 tiene un plugin de Economía y Petto no tiene sistema de economía. Si tu servidor funciona con ella, deja MEE6 para eso o busca un bot que la tenga.', 'La XP de tus miembros no se traslada sola. Si quieres conservarla, puedes ponerla miembro por miembro con `/levels manage xp set`.'],
      pt: ['O MEE6 tem um plugin de Economia e o Petto não tem sistema de economia. Se o seu servidor funciona com ela, mantenha o MEE6 para isso ou procure um bot que tenha.', 'O XP dos seus membros não é transferido sozinho. Se quiser mantê-lo, você pode definir membro por membro com `/levels manage xp set`.'],
    },
  },
  fromCarl: {
    name: 'Carl-bot',
    title: { en: 'How to switch from Carl-bot to Petto', es: 'Cómo cambiar de Carl-bot a Petto', pt: 'Como trocar o Carl-bot pelo Petto' },
    alt: { en: 'Carl-bot to Petto', es: 'De Carl-bot a Petto', pt: 'Do Carl-bot para o Petto' },
    desc: { en: 'A step-by-step guide to leave Carl-bot without a gap: reaction roles, modlogs, automod, tags and the rest, and where each one lives in Petto.', es: 'Una guía paso a paso para dejar Carl-bot sin quedarte desprotegido: roles por reacción, registros, automod, tags y lo demás, y dónde vive cada cosa en Petto.', pt: 'Um guia passo a passo para deixar o Carl-bot sem ficar desprotegido: cargos por reação, registros, automod, tags e o resto, e onde cada coisa fica no Petto.' },
    intro: {
      en: 'Carl-bot is known for its reaction roles, its modlogs and its tags, and it is a good bot. If you are moving because you want everything in one dashboard, this is the order that keeps your server covered the whole time.',
      es: 'Carl-bot es conocido por sus roles por reacción, sus registros y sus tags, y es un buen bot. Si te mudas porque quieres todo en un solo panel, este es el orden que mantiene tu servidor cubierto todo el tiempo.',
      pt: 'O Carl-bot é conhecido pelos cargos por reação, pelos registros e pelas tags, e é um bom bot. Se você está trocando porque quer tudo em um painel só, esta é a ordem que mantém o seu servidor coberto o tempo todo.',
    },
    facts: {
      en: [['What carl.gg lists: ', 'reaction roles (up to 250 pairs per server), moderation with modlogs and timed punishments, sticky roles, automod, logging, custom commands made with TagScript, suggestions, greetings, permissions, starboard, sticky messages, and Twitch and YouTube alerts.'], ['Premium in Carl-bot: ', 'its page lists a custom avatar and banner, higher limits, more reaction roles, more triggers, sticky messages, levels and temporary channels. The page does not show a price.']],
      es: [['Lo que lista carl.gg: ', 'roles por reacción (hasta 250 pares por servidor), moderación con registros y castigos con tiempo, roles persistentes, automod, registros, comandos personalizados hechos con TagScript, sugerencias, saludos, permisos, starboard, mensajes fijos y alertas de Twitch y YouTube.'], ['Premium en Carl-bot: ', 'su página lista avatar y banner propios, límites más altos, más roles por reacción, más triggers, mensajes fijos, niveles y canales temporales. La página no muestra un precio.']],
      pt: [['O que o carl.gg lista: ', 'cargos por reação (até 250 pares por servidor), moderação com registros e punições com tempo, cargos persistentes, automod, logs, comandos personalizados feitos com TagScript, sugestões, boas-vindas, permissões, starboard, mensagens fixas e alertas da Twitch e do YouTube.'], ['Premium no Carl-bot: ', 'a página dele lista avatar e banner próprios, limites maiores, mais cargos por reação, mais triggers, mensagens fixas, níveis e canais temporários. A página não mostra preço.']],
    },
    notes: {
      en: ['TagScript tags do not run in Petto: custom commands use Petto variables or Petto Code, so each tag has to be rewritten. The Petto Code Generator at petto.sbs/codegen builds them with forms.', 'The infractions and modlogs of the old bot stay there. Petto starts its own case log from the day you add it.'],
      es: ['Los tags de TagScript no funcionan en Petto: los comandos personalizados usan variables de Petto o Petto Code, así que cada tag hay que reescribirlo. El Generador de Petto Code en petto.sbs/codegen los arma con formularios.', 'Las infracciones y registros del bot anterior se quedan allí. Petto empieza su propio registro de casos desde el día que lo agregas.'],
      pt: ['As tags de TagScript não funcionam no Petto: os comandos personalizados usam variáveis do Petto ou Petto Code, então cada tag precisa ser reescrita. O Gerador de Petto Code em petto.sbs/codegen monta tudo com formulários.', 'As infrações e os registros do bot anterior ficam lá. O Petto começa o próprio registro de casos no dia em que você o adiciona.'],
    },
  },
  fromDyno: {
    name: 'Dyno',
    title: { en: 'How to switch from Dyno to Petto', es: 'Cómo cambiar de Dyno a Petto', pt: 'Como trocar o Dyno pelo Petto' },
    alt: { en: 'Dyno to Petto', es: 'De Dyno a Petto', pt: 'Do Dyno para o Petto' },
    desc: { en: 'A step-by-step guide to leave Dyno without a gap: automod, tickets, custom commands, autoroles and the rest, and where each one lives in Petto.', es: 'Una guía paso a paso para dejar Dyno sin quedarte desprotegido: automod, tickets, comandos personalizados, autoroles y lo demás, y dónde vive cada cosa en Petto.', pt: 'Um guia passo a passo para deixar o Dyno sem ficar desprotegido: automod, tickets, comandos personalizados, autocargos e o resto, e onde cada coisa fica no Petto.' },
    intro: {
      en: 'Dyno gives a lot for free and charges for more of the same: more commands, more modules and the extras. If your server has grown past its free limits, this is how to move without losing a day of moderation.',
      es: 'Dyno da mucho gratis y cobra por más de lo mismo: más comandos, más módulos y los extras. Si tu servidor ya pasó sus límites gratis, así te mudas sin perder un día de moderación.',
      pt: 'O Dyno dá muita coisa de graça e cobra por mais do mesmo: mais comandos, mais módulos e os extras. Se o seu servidor já passou dos limites grátis, é assim que você troca sem perder um dia de moderação.',
    },
    facts: {
      en: [['Free in Dyno: ', 'starboard, tickets, automod, 3 customizable embeds, 25 custom commands, 10 autoresponders, 3 active giveaways, 3 forms, 3 reaction role menus, 3 autoroles, 1 autodelete, 1 automessage and 1 autoban per rule, according to dyno.gg/premium.'], ['Paid in Dyno: ', 'Standard ($49.99 a year, shown as $4.17 a month) adds levels, unlimited commands and modules, advanced automod, advanced starboard, autopurge, slowmode and voice-text linking. Premium ($59.99 a year) adds Twitch, YouTube, TikTok, Reddit and Kick integrations. Custom ($99.99 a year) is a hosted bot with its own avatar, name and status.']],
      es: [['Gratis en Dyno: ', 'starboard, tickets, automod, 3 embeds personalizables, 25 comandos personalizados, 10 autorrespuestas, 3 sorteos activos, 3 formularios, 3 menús de roles por reacción, 3 autoroles, 1 autodelete, 1 mensaje automático y 1 autoban por regla, según dyno.gg/premium.'], ['De pago en Dyno: ', 'Standard (49,99 $ al año, mostrado como 4,17 $ al mes) suma niveles, comandos y módulos ilimitados, automod avanzado, starboard avanzado, autopurge, modo lento y enlace voz-texto. Premium (59,99 $ al año) suma integraciones de Twitch, YouTube, TikTok, Reddit y Kick. Custom (99,99 $ al año) es un bot alojado con su propio avatar, nombre y estado.']],
      pt: [['Grátis no Dyno: ', 'starboard, tickets, automod, 3 embeds personalizáveis, 25 comandos personalizados, 10 respostas automáticas, 3 sorteios ativos, 3 formulários, 3 menus de cargos por reação, 3 autocargos, 1 autodelete, 1 mensagem automática e 1 autoban por regra, segundo o dyno.gg/premium.'], ['Pago no Dyno: ', 'o Standard (US$ 49,99 por ano, mostrado como US$ 4,17 por mês) soma níveis, comandos e módulos ilimitados, automod avançado, starboard avançado, autopurge, modo lento e vínculo voz-texto. O Premium (US$ 59,99 por ano) soma integrações da Twitch, do YouTube, do TikTok, do Reddit e do Kick. O Custom (US$ 99,99 por ano) é um bot hospedado com avatar, nome e status próprios.']],
    },
    notes: {
      en: ['Dyno commands and autoresponders have their own syntax, so copy the text and rebuild the trigger in Petto instead of expecting it to import.', 'Autodelete and autopurge are Dyno modules; check Moderation rules and Timers in Petto for what you need before you switch them off.'],
      es: ['Los comandos y autorrespuestas de Dyno tienen su propia sintaxis, así que copia el texto y rearma el disparador en Petto en vez de esperar que se importe.', 'Autodelete y autopurge son módulos de Dyno; mira las Reglas de moderación y los Temporizadores de Petto para lo que necesites antes de apagarlos.'],
      pt: ['Os comandos e as respostas automáticas do Dyno têm sintaxe própria, então copie o texto e refaça o gatilho no Petto em vez de esperar uma importação.', 'Autodelete e autopurge são módulos do Dyno; veja as Regras de moderação e os Temporizadores do Petto para o que precisar antes de desligá-los.'],
    },
  },
};

const STR = {
  en: {
    pill: 'Guides', author: 'Petto Team',
    whatH: (n: string) => `What ${n} does, in its own words`,
    mapH: (n: string) => `Where each ${n} feature lives in Petto`,
    head: (n: string) => [`In ${n}`, 'In Petto'],
    stepsH: 'The order that avoids gaps',
    steps: (n: string): [string, string][] => [
      [`Add Petto and keep ${n} on. `, 'Never switch off the old bot first: for a few days both run, so the server is never without moderation.'],
      ['Write down what matters. ', `Open the dashboard of ${n} and copy your welcome texts, role menus, commands and channels. Petto cannot read the settings of another bot: Discord does not allow it.`],
      ['Run Quick Setup. ', 'In the Petto dashboard, Quick Setup makes the log, auto moderation, welcome, auto role, tickets and verification in seven steps, and nothing changes until the last one.'],
      ['Rebuild the rest from the table. ', 'Go through each row below. Variables have different names in every bot, so translate the idea, not the word: `!variables` lists the ones Petto has.'],
      ['Test each thing once. ', 'Use `!welcome test`, open a test ticket, trigger a test autoresponder. When it all works, remove the old bot.'],
    ],
    doesntH: 'What does not move',
    foot: (d: string) => `Facts about other bots were read on their own pages on ${d}. Prices and limits change: check their pages before you decide. Petto is made by the people who wrote this post.`,
    guide: (url: string) => `The same steps are in the guide in our wiki: ${url}.`,
  },
  es: {
    pill: 'Guías', author: 'Equipo de Petto',
    whatH: (n: string) => `Qué hace ${n}, con sus propias palabras`,
    mapH: (n: string) => `Dónde vive en Petto cada función de ${n}`,
    head: (n: string) => [`En ${n}`, 'En Petto'],
    stepsH: 'El orden que evita huecos',
    steps: (n: string): [string, string][] => [
      [`Agrega Petto y deja ${n} encendido. `, 'Nunca apagues primero el bot anterior: durante unos días corren los dos, así el servidor nunca se queda sin moderación.'],
      ['Anota lo que importa. ', `Abre el panel de ${n} y copia tus textos de bienvenida, menús de roles, comandos y canales. Petto no puede leer los ajustes de otro bot: Discord no lo permite.`],
      ['Haz el Quick Setup. ', 'En el panel de Petto, Quick Setup crea el registro, la automoderación, la bienvenida, el rol automático, los tickets y la verificación en siete pasos, y no cambia nada hasta el último.'],
      ['Arma el resto con la tabla. ', 'Ve fila por fila. Las variables se llaman distinto en cada bot, así que traduce la idea, no la palabra: `!variables` lista las que tiene Petto.'],
      ['Prueba cada cosa una vez. ', 'Usa `!welcome test`, abre un ticket de prueba, activa una autorrespuesta de prueba. Cuando todo funcione, quita el bot anterior.'],
    ],
    doesntH: 'Lo que no se traslada',
    foot: (d: string) => `Los datos de otros bots se leyeron en sus propias páginas el ${d}. Los precios y límites cambian: mira sus páginas antes de decidir. Petto lo hacen quienes escribieron este post.`,
    guide: (url: string) => `Los mismos pasos están en la guía de nuestro wiki: ${url}.`,
  },
  pt: {
    pill: 'Guias', author: 'Equipe do Petto',
    whatH: (n: string) => `O que o ${n} faz, nas palavras dele`,
    mapH: (n: string) => `Onde cada função do ${n} fica no Petto`,
    head: (n: string) => [`No ${n}`, 'No Petto'],
    stepsH: 'A ordem que evita buracos',
    steps: (n: string): [string, string][] => [
      [`Adicione o Petto e deixe o ${n} ligado. `, 'Nunca desligue o bot antigo primeiro: por alguns dias os dois rodam, assim o servidor nunca fica sem moderação.'],
      ['Anote o que importa. ', `Abra o painel do ${n} e copie seus textos de boas-vindas, menus de cargos, comandos e canais. O Petto não consegue ler as configurações de outro bot: o Discord não permite.`],
      ['Faça o Quick Setup. ', 'No painel do Petto, o Quick Setup cria o log, a automoderação, as boas-vindas, o cargo automático, os tickets e a verificação em sete passos, e nada muda até o último.'],
      ['Monte o resto pela tabela. ', 'Vá linha por linha. As variáveis têm nomes diferentes em cada bot, então traduza a ideia, não a palavra: `!variables` lista as que o Petto tem.'],
      ['Teste cada coisa uma vez. ', 'Use `!welcome test`, abra um ticket de teste, dispare uma resposta automática de teste. Quando tudo funcionar, tire o bot antigo.'],
    ],
    doesntH: 'O que não é transferido',
    foot: (d: string) => `Os dados de outros bots foram lidos nas páginas deles em ${d}. Preços e limites mudam: veja as páginas deles antes de decidir. O Petto é feito por quem escreveu este post.`,
    guide: (url: string) => `Os mesmos passos estão no guia do nosso wiki: ${url}.`,
  },
};


// The pictures of the posts (src/data/blogFigures.json, made from the pictures of the wiki: the dashboard and Discord with the main server, in dark mode). A language without its own picture shows the English one.
export const FIG_CAPTION: Record<FigKey, Record<'en' | 'es' | 'pt', string>> = {
  quickSetup: { en: 'Dashboard → Quick Setup: choose what to set up. Nothing changes until the last step.', es: 'Dashboard → Quick Setup: eliges qué configurar. No cambia nada hasta el último paso.', pt: 'Dashboard → Quick Setup: escolha o que configurar. Nada muda até o último passo.' },
  welcomePage: { en: 'Dashboard → Welcome → Welcome messages: the welcome message, its preview and the extra messages that Petto picks at random.', es: 'Dashboard → Bienvenida → Mensajes de bienvenida: el mensaje de bienvenida, su vista previa y los mensajes extra que Petto elige al azar.', pt: 'Dashboard → Boas-vindas → Mensagens de boas-vindas: a mensagem de boas-vindas, a prévia e as mensagens extras que o Petto escolhe ao acaso.' },
  welcomeDiscord: { en: 'In Discord: the welcome Petto sends when a member joins.', es: 'En Discord: la bienvenida que manda Petto cuando entra un miembro.', pt: 'No Discord: a boas-vindas que o Petto envia quando um membro entra.' },
  rankDiscord: { en: 'In Discord: the level card of a member.', es: 'En Discord: la tarjeta de nivel de un miembro.', pt: 'No Discord: o cartão de nível de um membro.' },
  reactionDiscord: { en: 'In Discord: the list of a reaction roles message, with its buttons and roles.', es: 'En Discord: la lista de un mensaje de roles por reacción, con sus botones y roles.', pt: 'No Discord: a lista de uma mensagem de cargos por reação, com seus botões e cargos.' },
  automodDash: { en: 'Dashboard → Moderation → AutoMod: what is active in Discord and what is active in Petto.', es: 'Dashboard → Moderación → AutoMod: lo que está activo en Discord y lo que está activo en Petto.', pt: 'Dashboard → Moderação → AutoMod: o que está ativo no Discord e o que está ativo no Petto.' },
  ticketsDiscord: { en: 'In Discord: a member opens a ticket.', es: 'En Discord: un miembro abre un ticket.', pt: 'No Discord: um membro abre um ticket.' },
  giveawaysDash: { en: 'Dashboard → Community → Giveaways: start a giveaway with its prize, winners and duration.', es: 'Dashboard → Comunidad → Sorteos: empieza un sorteo con su premio, ganadores y duración.', pt: 'Dashboard → Comunidade → Sorteios: comece um sorteio com prêmio, ganhadores e duração.' },
};
const BOT_FIGS: Record<'fromMee6' | 'fromCarl' | 'fromDyno', FigKey[]> = {
  fromMee6: ['welcomePage', 'welcomeDiscord', 'rankDiscord'],
  fromCarl: ['reactionDiscord', 'automodDash'],
  fromDyno: ['automodDash', 'ticketsDiscord', 'giveawaysDash'],
};
const LOOK_H = { en: 'How it looks in Petto', es: 'Cómo se ve en Petto', pt: 'Como fica no Petto' };

const DATE_WORD = { en: 'November 18, 2026', es: '18 de noviembre de 2026', pt: '18 de novembro de 2026' };

function migration(key: 'fromMee6' | 'fromCarl' | 'fromDyno', lang: Locale): GuideContent {
  const l = L(lang); const bot = BOTS[key]; const s = STR[l];
  const rows = ROWS[key].map(([label, place]) => [label[l], PLACE[place][l]]);
  const sections: GuideSection[] = [
    { h2: s.whatH(bot.name), p: [], list: bot.facts[l] },
    { h2: s.stepsH, list: s.steps(bot.name), after: [s.guide(WIKI[l])], figs: ['quickSetup'] },
    { h2: s.mapH(bot.name), table: { head: s.head(bot.name), rows } },
    { h2: LOOK_H[l], figs: BOT_FIGS[key] },
    { h2: s.doesntH, p: bot.notes[l] },
  ];
  return { title: bot.title[l], pill: s.pill, h1: bot.title[l], bannerAlt: bot.alt[l], lede: bot.intro[l], desc: bot.desc[l], sections, foot: s.foot(DATE_WORD[l]) };
}

// "Petto vs other bots": a table of what each bot says on its own page. "—" is "not on its page".
const VS: Record<'en' | 'es' | 'pt', GuideContent> = {
  en: {
    title: 'Petto and other Discord bots: an honest comparison', pill: 'Guides', h1: 'Petto and other Discord bots: an honest comparison', bannerAlt: 'Petto compared with MEE6, Carl-bot and Dyno',
    lede: 'Which bot should run your server? This is what MEE6, Carl-bot, Dyno and Petto say about themselves on their own pages, side by side, with what each one charges for. We make Petto, so read it knowing that.',
    desc: 'A side-by-side look at Petto, MEE6, Carl-bot and Dyno, from what their own pages say on November 18, 2026: what is free, what is paid and where Petto is behind.',
    sections: [
      { h2: 'How we checked', p: ['We read the pages of the bots themselves on November 18, 2026: mee6.xyz/en/premium and its help article of June 16, 2026, carl.gg, and dyno.gg/premium. We did not test their bots. When a page does not say something, the table has a dash: it does not mean the bot cannot do it.', 'For Petto the numbers are the ones of our Premium page.'] },
      {
        h2: 'Side by side',
        table: {
          head: ['', 'Petto', 'MEE6', 'Carl-bot', 'Dyno'],
          rows: [
            ['What is free', 'Moderation, automod, anti-nuke, verification, logging, level rewards, backups, forms and appeals have no Premium limit', 'Achievements, Starboard, a search command and 1 reminder', '— (its page lists the Premium extras)', 'Starboard, tickets, automod, 25 custom commands, 10 autoresponders, 3 giveaways, 3 forms, 3 reaction role menus'],
            ['Paid plans', 'Premium doubles the limits: $4.99 a month for 1 server, $12.99 for 3, $19.99 for 5 (15% off yearly)', 'Premium: €5.99 first month then €11.99; €24.99 first year then €49.99; or €44.99 once (Lifetime)', 'Premium (price not on carl.gg)', 'Standard $49.99 a year, Premium $59.99, Custom $99.99'],
            ['Reaction roles', 'Not limited by plan', 'Premium (40)', 'Up to 250 pairs per server', 'Free: 3 menus'],
            ['Custom commands', 'Free 125, Premium 250', 'Premium (500)', 'Yes, with TagScript', 'Free 25, unlimited on a paid plan'],
            ['Levels', 'Free, with role rewards', 'Premium', 'Premium', 'Paid plan'],
            ['Tickets', 'Free (25 categories)', '—', '—', 'Free'],
            ['Giveaways', 'Free (15 presets)', 'Premium', '—', 'Free (3 active)'],
            ['Social alerts', 'Feeds: 5 accounts per platform, 25 on Premium', 'Premium', 'Twitch and YouTube', 'Premium plan'],
            ['Economy', 'None', 'Premium plugin', '—', '—'],
          ],
        },
        after: ['A dash (—) means the page we read does not say it.'],
      },
      { h2: 'Where Petto is behind', list: [['It is younger and much smaller. ', 'Carl-bot says on its site that it is trusted by more than 15 million servers and Dyno says it is used on over 11.6 million. They have years of use that Petto does not.'], ['It has no economy. ', 'If your server runs on coins and a shop, Petto is not the bot for that part.'], ['Its own limits exist too. ', 'Premium exists because custom commands, autoresponders and ticket categories have a number per server, as in the other bots; the free numbers are just higher than most.']] },
      { figs: ['quickSetup'], h2: 'Where Petto is different', list: [['One dashboard for everything. ', 'Moderation, tickets, levels, giveaways, forms, feeds and the rest live in one place, with one log of what was changed and who changed it.'], ['Protection is not behind a plan. ', 'Moderation, automod, anti-nuke, verification and logging have no Premium limit.'], ['Rules you build yourself. ', 'Moderation rules, with strikes and heat, are made in the dashboard: triggers, conditions and effects, with a test mode.']] },
      { h2: 'Which one fits you?', p: ['If you need an economy or you want a bot with a very long track record, MEE6, Carl-bot or Dyno may be the better choice. If you want moderation and community tools in one dashboard without a paywall in front of the basics, Petto is built for that.', 'Moving is not all or nothing: you can run two bots at the same time while you decide. If you decide to move, we wrote a guide for each one: switching from MEE6, from Carl-bot and from Dyno.'] },
    ],
    foot: 'Facts about other bots were read on their own pages on November 18, 2026. Prices and limits change: check their pages before you decide. Petto is made by the people who wrote this post.',
  },
  es: {
    title: 'Petto y otros bots de Discord: una comparación honesta', pill: 'Guías', h1: 'Petto y otros bots de Discord: una comparación honesta', bannerAlt: 'Petto comparado con MEE6, Carl-bot y Dyno',
    lede: '¿Qué bot debería llevar tu servidor? Esto es lo que MEE6, Carl-bot, Dyno y Petto dicen de sí mismos en sus propias páginas, lado a lado, y lo que cobra cada uno. Petto lo hacemos nosotros, así que léelo sabiéndolo.',
    desc: 'Una mirada lado a lado a Petto, MEE6, Carl-bot y Dyno, con lo que dicen sus propias páginas el 18 de noviembre de 2026: qué es gratis, qué es de pago y en qué va detrás Petto.',
    sections: [
      { h2: 'Cómo lo comprobamos', p: ['Leímos las páginas de los propios bots el 18 de noviembre de 2026: mee6.xyz/en/premium y su artículo de ayuda del 16 de junio de 2026, carl.gg y dyno.gg/premium. No probamos sus bots. Cuando una página no dice algo, la tabla tiene un guion: no significa que el bot no pueda hacerlo.', 'Para Petto los números son los de nuestra página de Premium.'] },
      {
        h2: 'Lado a lado',
        table: {
          head: ['', 'Petto', 'MEE6', 'Carl-bot', 'Dyno'],
          rows: [
            ['Qué es gratis', 'Moderación, automod, anti-nuke, verificación, registros, recompensas de nivel, copias de seguridad, formularios y apelaciones no tienen límite de Premium', 'Logros, Starboard, un comando de búsqueda y 1 recordatorio', '— (su página lista los extras de Premium)', 'Starboard, tickets, automod, 25 comandos personalizados, 10 autorrespuestas, 3 sorteos, 3 formularios, 3 menús de roles por reacción'],
            ['Planes de pago', 'Premium duplica los límites: 4,99 $ al mes por 1 servidor, 12,99 $ por 3, 19,99 $ por 5 (15 % menos al año)', 'Premium: 5,99 € el primer mes y luego 11,99 €; 24,99 € el primer año y luego 49,99 €; o 44,99 € una vez (Lifetime)', 'Premium (precio no está en carl.gg)', 'Standard 49,99 $ al año, Premium 59,99 $, Custom 99,99 $'],
            ['Roles por reacción', 'Sin límite por plan', 'Premium (40)', 'Hasta 250 pares por servidor', 'Gratis: 3 menús'],
            ['Comandos personalizados', 'Gratis 125, Premium 250', 'Premium (500)', 'Sí, con TagScript', 'Gratis 25, ilimitados en un plan de pago'],
            ['Niveles', 'Gratis, con recompensas de rol', 'Premium', 'Premium', 'Plan de pago'],
            ['Tickets', 'Gratis (25 categorías)', '—', '—', 'Gratis'],
            ['Sorteos', 'Gratis (15 presets)', 'Premium', '—', 'Gratis (3 activos)'],
            ['Alertas sociales', 'Feeds: 5 cuentas por plataforma, 25 en Premium', 'Premium', 'Twitch y YouTube', 'Plan Premium'],
            ['Economía', 'No tiene', 'Plugin Premium', '—', '—'],
          ],
        },
        after: ['Un guion (—) significa que la página que leímos no lo dice.'],
      },
      { h2: 'En qué va detrás Petto', list: [['Es más joven y mucho más pequeño. ', 'Carl-bot dice en su sitio que lo usan más de 15 millones de servidores y Dyno dice que se usa en más de 11,6 millones. Tienen años de uso que Petto no tiene.'], ['No tiene economía. ', 'Si tu servidor funciona con monedas y tienda, Petto no es el bot para esa parte.'], ['También tiene límites. ', 'Premium existe porque los comandos personalizados, las autorrespuestas y las categorías de tickets tienen un número por servidor, como en los otros bots; los números gratis son más altos que los de la mayoría.']] },
      { figs: ['quickSetup'], h2: 'En qué es distinto Petto', list: [['Un solo panel para todo. ', 'Moderación, tickets, niveles, sorteos, formularios, feeds y lo demás viven en un lugar, con un registro de qué se cambió y quién lo cambió.'], ['La protección no está detrás de un plan. ', 'Moderación, automod, anti-nuke, verificación y registros no tienen límite de Premium.'], ['Reglas que armas tú. ', 'Las reglas de moderación, con strikes y heat, se hacen en el panel: disparadores, condiciones y efectos, con modo de prueba.']] },
      { h2: '¿Cuál te conviene?', p: ['Si necesitas economía o quieres un bot con un historial larguísimo, MEE6, Carl-bot o Dyno pueden ser mejor opción. Si quieres moderación y herramientas de comunidad en un solo panel sin un muro de pago delante de lo básico, Petto está hecho para eso.', 'Mudarse no es todo o nada: puedes tener dos bots a la vez mientras decides. Si decides mudarte, escribimos una guía para cada uno: cambiar desde MEE6, desde Carl-bot y desde Dyno.'] },
    ],
    foot: 'Los datos de otros bots se leyeron en sus propias páginas el 18 de noviembre de 2026. Los precios y límites cambian: mira sus páginas antes de decidir. Petto lo hacen quienes escribieron este post.',
  },
  pt: {
    title: 'O Petto e outros bots do Discord: uma comparação honesta', pill: 'Guias', h1: 'O Petto e outros bots do Discord: uma comparação honesta', bannerAlt: 'Petto comparado com MEE6, Carl-bot e Dyno',
    lede: 'Qual bot deve cuidar do seu servidor? Isto é o que MEE6, Carl-bot, Dyno e Petto dizem de si mesmos nas próprias páginas, lado a lado, e o que cada um cobra. O Petto somos nós que fazemos, então leia sabendo disso.',
    desc: 'Um olhar lado a lado para Petto, MEE6, Carl-bot e Dyno, com o que as próprias páginas deles dizem em 18 de novembro de 2026: o que é grátis, o que é pago e onde o Petto fica atrás.',
    sections: [
      { h2: 'Como conferimos', p: ['Lemos as páginas dos próprios bots em 18 de novembro de 2026: mee6.xyz/en/premium e o artigo de ajuda de 16 de junho de 2026, carl.gg e dyno.gg/premium. Não testamos os bots deles. Quando uma página não diz algo, a tabela tem um traço: não significa que o bot não consiga fazer.', 'Para o Petto, os números são os da nossa página de Premium.'] },
      {
        h2: 'Lado a lado',
        table: {
          head: ['', 'Petto', 'MEE6', 'Carl-bot', 'Dyno'],
          rows: [
            ['O que é grátis', 'Moderação, automod, anti-nuke, verificação, logs, recompensas de nível, backups, formulários e apelações não têm limite de Premium', 'Conquistas, Starboard, um comando de busca e 1 lembrete', '— (a página lista os extras do Premium)', 'Starboard, tickets, automod, 25 comandos personalizados, 10 respostas automáticas, 3 sorteios, 3 formulários, 3 menus de cargos por reação'],
            ['Planos pagos', 'O Premium dobra os limites: US$ 4,99 por mês para 1 servidor, US$ 12,99 para 3, US$ 19,99 para 5 (15% a menos no anual)', 'Premium: €5,99 no primeiro mês e depois €11,99; €24,99 no primeiro ano e depois €49,99; ou €44,99 uma vez (Lifetime)', 'Premium (o preço não está no carl.gg)', 'Standard US$ 49,99 por ano, Premium US$ 59,99, Custom US$ 99,99'],
            ['Cargos por reação', 'Sem limite por plano', 'Premium (40)', 'Até 250 pares por servidor', 'Grátis: 3 menus'],
            ['Comandos personalizados', 'Grátis 125, Premium 250', 'Premium (500)', 'Sim, com TagScript', 'Grátis 25, ilimitados em um plano pago'],
            ['Níveis', 'Grátis, com recompensas de cargo', 'Premium', 'Premium', 'Plano pago'],
            ['Tickets', 'Grátis (25 categorias)', '—', '—', 'Grátis'],
            ['Sorteios', 'Grátis (15 predefinições)', 'Premium', '—', 'Grátis (3 ativos)'],
            ['Alertas sociais', 'Feeds: 5 contas por plataforma, 25 no Premium', 'Premium', 'Twitch e YouTube', 'Plano Premium'],
            ['Economia', 'Não tem', 'Plugin Premium', '—', '—'],
          ],
        },
        after: ['Um traço (—) significa que a página que lemos não diz isso.'],
      },
      { h2: 'Onde o Petto fica atrás', list: [['É mais novo e muito menor. ', 'O Carl-bot diz no site dele que mais de 15 milhões de servidores confiam nele e o Dyno diz que é usado em mais de 11,6 milhões. Eles têm anos de uso que o Petto não tem.'], ['Não tem economia. ', 'Se o seu servidor funciona com moedas e loja, o Petto não é o bot para essa parte.'], ['Também tem limites. ', 'O Premium existe porque os comandos personalizados, as respostas automáticas e as categorias de tickets têm um número por servidor, como nos outros bots; os números grátis são mais altos que os da maioria.']] },
      { figs: ['quickSetup'], h2: 'Onde o Petto é diferente', list: [['Um painel só para tudo. ', 'Moderação, tickets, níveis, sorteios, formulários, feeds e o resto ficam em um lugar, com um registro do que foi mudado e de quem mudou.'], ['A proteção não fica atrás de um plano. ', 'Moderação, automod, anti-nuke, verificação e logs não têm limite de Premium.'], ['Regras que você monta. ', 'As regras de moderação, com strikes e heat, são feitas no painel: gatilhos, condições e efeitos, com modo de teste.']] },
      { h2: 'Qual combina com você?', p: ['Se você precisa de economia ou quer um bot com um histórico bem longo, MEE6, Carl-bot ou Dyno podem ser a melhor escolha. Se quer moderação e ferramentas de comunidade em um painel só, sem um paywall na frente do básico, o Petto foi feito para isso.', 'Trocar não é tudo ou nada: você pode ter dois bots ao mesmo tempo enquanto decide. Se decidir trocar, escrevemos um guia para cada um: trocar do MEE6, do Carl-bot e do Dyno.'] },
    ],
    foot: 'Os dados de outros bots foram lidos nas páginas deles em 18 de novembro de 2026. Preços e limites mudam: veja as páginas deles antes de decidir. O Petto é feito por quem escreveu este post.',
  },
};

export function guideContent(key: GuideKey, lang: Locale): GuideContent {
  if (key === 'vsBots') return VS[L(lang)];
  return migration(key, lang);
}
export function guideDate(key: GuideKey, lang: Locale): string { return GUIDES[key].date[L(lang)]; }
export function guideAuthor(lang: Locale): string { return STR[L(lang)].author; }
export const GUIDE_KEYS = Object.keys(GUIDES) as GuideKey[];
