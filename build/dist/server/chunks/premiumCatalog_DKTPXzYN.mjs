import { F as FREE_LIMITS, a as PREMIUM_STAT_DAYS, b as FREE_STAT_DAYS, P as PREMIUM_LIMITS } from './planLimits_BFQNR8Tb.mjs';
import { i as FEEDS_ON_PREMIUM_PAGE } from './feeds_CoTT4ZQR.mjs';

function tr(text, lang) {
  return lang === "es" ? text.es : lang === "pt-BR" || lang === "pt" ? text.pt : text.en;
}
const PREMIUM_TIERS = [
  { servers: 1, monthly: 4.99, note: { en: "For one community", es: "Para una comunidad", pt: "Para uma comunidade" } },
  { servers: 3, monthly: 12.99, featured: true, note: { en: "For a small group", es: "Para un grupo pequeño", pt: "Para um grupo pequeno" } },
  { servers: 5, monthly: 19.99, note: { en: "For your whole network", es: "Para toda tu red", pt: "Para toda a sua rede" } }
];
const CUSTOM_MONTHLY = 25;
function annual(monthly) {
  return Math.round(monthly * 12 * 0.85 * 100) / 100;
}
const F = FREE_LIMITS;
const days = (list, and) => `${list.slice(0, -1).join(", ")} ${and} ${list[list.length - 1]}`;
const PAID = ["premium", "custom"];
const ALL = ["free", "premium", "custom"];
const ALL_FEATURES = [
  // What every plan has (the Free card).
  { id: "safety", icon: "ph:shield-check-fill", plans: ALL, name: { en: "Moderation, automod, anti-nuke & verification", es: "Moderación, automod, anti-nuke y verificación", pt: "Moderação, automod, anti-nuke e verificação" } },
  { id: "community", icon: "ph:ticket-fill", plans: ALL, name: { en: "Tickets, leveling, giveaways, forms & appeals", es: "Tickets, niveles, sorteos, formularios y apelaciones", pt: "Tickets, níveis, sorteios, formulários e apelações" } },
  { id: "logs", icon: "ph:scroll-fill", plans: ALL, name: { en: "Logs of every event & backups", es: "Logs de cada evento y backups", pt: "Logs de cada evento e backups" } },
  { id: "dashboard", icon: "ph:browser-fill", plans: ALL, name: { en: "Web dashboard & embed builder", es: "Dashboard web y editor de embeds", pt: "Dashboard web e editor de embeds" } },
  { id: "cards-basic", icon: "ph:image-fill", plans: ALL, name: { en: "Image cards with 15 fonts", es: "Tarjetas de imagen con 15 fuentes", pt: "Cartões de imagem com 15 fontes" } },
  { id: "free-room", icon: "ph:terminal-window-fill", plans: ALL, name: { en: `${F.customCommands} custom commands, ${F.ticketCategories} ticket types`, es: `${F.customCommands} comandos propios, ${F.ticketCategories} tipos de ticket`, pt: `${F.customCommands} comandos personalizados, ${F.ticketCategories} tipos de ticket` } },
  { id: "servers", icon: "ph:users-three-fill", plans: ALL, name: { en: "Unlimited servers", es: "Servers ilimitados", pt: "Servers ilimitados" } },
  // Premium (and the Custom Bot).
  {
    id: "room",
    icon: "ph:stack-fill",
    plans: PAID,
    name: { en: "About twice the room", es: "Cerca del doble de espacio", pt: "Cerca do dobro de espaço" },
    desc: { en: "About twice the room for commands, autoresponders, tickets, cards and more", es: "Cerca del doble de espacio para comandos, autorespuestas, tickets, tarjetas y más", pt: "Cerca do dobro de espaço para comandos, autorespostas, tickets, cartões e mais" }
  },
  {
    id: "feeds",
    icon: "ph:bell-ringing-fill",
    plans: PAID,
    name: { en: "More feeds", es: "Más feeds", pt: "Mais feeds" },
    desc: { en: "Follow up to 10 accounts of each platform (YouTube, Twitch, Kick, Reddit, GitHub, RSS and more) and get their news in a channel", es: "Sigue hasta 10 cuentas de cada plataforma (YouTube, Twitch, Kick, Reddit, GitHub, RSS y más) y recibe sus novedades en un canal", pt: "Siga até 10 contas de cada plataforma (YouTube, Twitch, Kick, Reddit, GitHub, RSS e mais) e receba as novidades em um canal" }
  },
  {
    id: "feeds-paid",
    icon: "ph:lock-fill",
    plans: PAID,
    name: { en: "Feeds of X, Instagram and TikTok", es: "Feeds de X, Instagram y TikTok", pt: "Feeds de X, Instagram e TikTok" },
    desc: { en: "Follow accounts of services that cost money to follow", es: "Sigue cuentas de servicios que cuesta dinero seguir", pt: "Siga contas de serviços que custa dinheiro seguir" },
    locked: { reason: {
      en: "Locked for now: X charges for its API, and Instagram and TikTok have no public way to follow an account, so Petto needs a paid provider. They will be Premium only, to cover that cost, and unlock when they are ready.",
      es: "Bloqueado por ahora: X cobra por su API, e Instagram y TikTok no tienen una forma pública de seguir cuentas, así que Petto necesita un proveedor de pago. Serán solo Premium, para cubrir ese costo, y se desbloquean cuando estén listos.",
      pt: "Bloqueado por enquanto: o X cobra pela API, e o Instagram e o TikTok não têm uma forma pública de seguir contas, então o Petto precisa de um provedor pago. Serão só Premium, para cobrir esse custo, e desbloqueiam quando estiverem prontos."
    } }
  },
  {
    id: "card-editor",
    icon: "ph:image-fill",
    plans: PAID,
    name: { en: "Card editor and fonts", es: "Editor y fuentes de tarjetas", pt: "Editor e fontes dos cartões" },
    desc: { en: "Image cards: layer editor and all 40 fonts", es: "Tarjetas de imagen: editor de capas y las 40 fuentes", pt: "Cartões de imagem: editor de camadas e as 40 fontes" },
    compare: { free: { en: "Basic, 15 fonts", es: "Básico, 15 fuentes", pt: "Básico, 15 fontes" }, premium: { en: "Layers, all 40 fonts", es: "Capas, las 40 fuentes", pt: "Camadas, as 40 fontes" } }
  },
  {
    id: "bot-profile",
    icon: "ph:user-circle-fill",
    plans: PAID,
    name: { en: "Bot profile in your server", es: "Perfil del bot en tu server", pt: "Perfil do bot no seu server" },
    desc: { en: "Petto with your own avatar, banner, bio and name style (gradient, neon) in your server", es: "Petto con tu propio avatar, banner, bio y estilo de nombre (degradado, neón) en tu server", pt: "O Petto com seu próprio avatar, banner, bio e estilo de nome (gradiente, neon) no seu server" },
    compare: { free: { en: "Nickname", es: "Apodo", pt: "Apelido" }, premium: { en: "Avatar, banner, bio, name style", es: "Avatar, banner, bio, estilo de nombre", pt: "Avatar, banner, bio, estilo de nome" } }
  },
  {
    id: "form-look",
    icon: "ph:paint-brush-fill",
    plans: PAID,
    name: { en: "Form page look", es: "Aspecto de la página de formularios", pt: "Visual da página de formulários" },
    desc: { en: 'Form pages with animated backgrounds and without the "Forms by Petto" line', es: 'Páginas de formularios con fondos animados y sin la línea "Formularios por Petto"', pt: 'Páginas de formulários com fundos animados e sem a linha "Formulários por Petto"' },
    compare: { free: { en: "Banner, color, gradient", es: "Banner, color, degradado", pt: "Banner, cor, gradiente" }, premium: { en: "Also animated, no Petto line", es: "También animado, sin la línea de Petto", pt: "Também animado, sem a linha do Petto" } }
  },
  {
    id: "stats-history",
    icon: "ph:chart-line-up-fill",
    plans: PAID,
    name: { en: "Statistics history", es: "Historial de estadísticas", pt: "Histórico de estatísticas" },
    desc: { en: `Statistics for the last ${days(PREMIUM_STAT_DAYS, "and")} days`, es: `Estadísticas de los últimos ${days(PREMIUM_STAT_DAYS, "y")} días`, pt: `Estatísticas dos últimos ${days(PREMIUM_STAT_DAYS, "e")} dias` },
    compare: {
      free: { en: `${days(FREE_STAT_DAYS, "and")} days`, es: `${days(FREE_STAT_DAYS, "y")} días`, pt: `${days(FREE_STAT_DAYS, "e")} dias` },
      premium: { en: `Also ${days(PREMIUM_STAT_DAYS, "and")} days`, es: `También ${days(PREMIUM_STAT_DAYS, "y")} días`, pt: `Também ${days(PREMIUM_STAT_DAYS, "e")} dias` }
    }
  },
  {
    id: "auto-reopen",
    icon: "ph:arrows-clockwise-fill",
    plans: PAID,
    name: { en: "Requests back to open by themselves", es: "Solicitudes que vuelven a abiertas solas", pt: "Pedidos que voltam a abertos sozinhos" },
    desc: { en: "Claimed requests go back to open by themselves", es: "Las solicitudes reclamadas vuelven a abiertas solas", pt: "Pedidos assumidos voltam a abertos sozinhos" },
    compare: { free: { en: "By hand", es: "A mano", pt: "Na mão" }, premium: { en: "After the hours you set", es: "Tras las horas que elijas", pt: "Depois das horas que você definir" } }
  },
  {
    id: "own-prefix",
    icon: "ph:hash-bold",
    plans: PAID,
    name: { en: "Your own prefix (!myprefix)", es: "Prefijo propio (!myprefix)", pt: "Prefixo próprio (!myprefix)" },
    desc: { en: "A prefix of your own in every server", es: "Un prefijo propio en todos los servers", pt: "Um prefixo próprio em todos os servers" },
    compare: { free: { en: "Boosters, partners and the team", es: "Boosters, partners y el equipo", pt: "Boosters, parceiros e a equipe" }, premium: { en: "Yes, in every server", es: "Sí, en todos los servers", pt: "Sim, em todos os servers" } }
  },
  {
    id: "support-role",
    icon: "ph:crown-fill",
    plans: PAID,
    name: { en: "Premium role", es: "Rol Premium", pt: "Cargo Premium" },
    desc: { en: "A Premium role in the support server", es: "Un rol Premium en el server de soporte", pt: "Um cargo Premium no server de suporte" }
  },
  // The Custom Bot only (it also has everything above).
  { id: "custom-profile", icon: "ph:paint-brush-fill", plans: ["custom"], name: { en: "Your own avatar & banner", es: "Tu propio avatar y banner", pt: "Seu próprio avatar e banner" } },
  { id: "custom-private", icon: "ph:lock-simple-fill", plans: ["custom"], name: { en: "Runs only in your server", es: "Corre solo en tu server", pt: "Roda só no seu server" } },
  { id: "custom-contact", icon: "ph:chat-circle-fill", plans: ["custom"], name: { en: "Direct line to the developer", es: "Línea directa con el desarrollador", pt: "Linha direta com o desenvolvedor" } }
];
const FEATURES = ALL_FEATURES.filter((f) => FEEDS_ON_PREMIUM_PAGE);
const freeFeatures = () => FEATURES.filter((f) => f.plans.includes("free"));
const premiumFeatures = () => FEATURES.filter((f) => f.plans.includes("premium") && !f.plans.includes("free"));
const customFeatures = () => FEATURES.filter((f) => f.plans.includes("custom") && !f.plans.includes("premium"));
const LIMIT_ROWS = [
  { key: "customCommands", label: { en: "Custom commands", es: "Comandos propios", pt: "Comandos personalizados" } },
  { key: "autoResponders", label: { en: "Autoresponders", es: "Autorespuestas", pt: "Autorespostas" } },
  { key: "ticketCategories", label: { en: "Ticket types", es: "Tipos de ticket", pt: "Tipos de ticket" } },
  { key: "giveawayPresets", label: { en: "Giveaway presets", es: "Presets de sorteo", pt: "Presets de sorteio" } },
  { key: "imageCards", label: { en: "Image cards", es: "Tarjetas de imagen", pt: "Cartões de imagem" } },
  { key: "cardAssets", label: { en: "Uploaded pictures", es: "Imágenes subidas", pt: "Imagens enviadas" } },
  { key: "partnerChannels", label: { en: "Partner channels", es: "Canales de partners", pt: "Canais de parceiros" } },
  { key: "uploadChannels", label: { en: "Upload channels", es: "Canales de subidas", pt: "Canais de uploads" } },
  { key: "buttonResponders", label: { en: "Button responders", es: "Botones con respuesta", pt: "Botões com resposta" } },
  { key: "componentPanels", label: { en: "Button panels", es: "Paneles de botones", pt: "Painéis de botões" } },
  { key: "counters", label: { en: "Counters", es: "Contadores", pt: "Contadores" } },
  { key: "feeds", label: { en: "Followed accounts of each platform (Feeds)", es: "Cuentas seguidas de cada plataforma (Feeds)", pt: "Contas seguidas de cada plataforma (Feeds)" } },
  { key: "paginationMessages", label: { en: "Paginated messages", es: "Mensajes con páginas", pt: "Mensagens com páginas" } }
];
function compareRows(lang) {
  return [
    ...LIMIT_ROWS.filter((row) => FEEDS_ON_PREMIUM_PAGE).map((row) => ({ label: tr(row.label, lang), free: String(FREE_LIMITS[row.key]), premium: String(PREMIUM_LIMITS[row.key]), numeric: true, isNew: false })),
    ...FEATURES.filter((f) => f.compare).map((f) => ({ label: tr(f.name, lang), free: tr(f.compare.free, lang), premium: tr(f.compare.premium, lang), numeric: false, isNew: Boolean(f.isNew) }))
  ];
}

export { CUSTOM_MONTHLY as C, PREMIUM_TIERS as P, annual as a, compareRows as b, customFeatures as c, freeFeatures as f, premiumFeatures as p, tr as t };
