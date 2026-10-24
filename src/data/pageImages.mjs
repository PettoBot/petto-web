// The picture a link to a page shows when it is shared (Discord, X, Telegram...). A page that has a banner of its own is listed here by its
// address without the language (`/blog/...` also covers `/es/blog/...` and `/pt-br/blog/...`); every other page keeps the default one.
// The pictures are PNGs of 1200x500 in /assets/og (a preview cannot be an SVG): `node scripts/make-og-images.mjs` draws them from the
// banners in `source`, and `node scripts/check-og-images.mjs` (part of `npm run check`) makes sure they exist.
// Each entry: `name` (the file in /assets/og, without the extension), `source` (the banner it is drawn from, in /public) and `alt` (what the
// picture shows, in English: it is the alt text of the preview).
/** @typedef {{ name: string, source: string, alt: string }} PageImage */

/** @type {(name: string, source: string, alt: string) => PageImage} */
const banner = (name, source, alt) => ({ name, source, alt });

/** @type {Record<string, PageImage>} */
export const PAGE_IMAGES = {
  '/blog/online-without-the-dot': banner('online', '/assets/online-banner.svg', 'A bot listed as online without the green dot'),
  '/blog/kobot-moves-to-petto': banner('kobot', '/assets/kobot-banner.svg', 'Kobot moving to Petto'),
  '/blog/vanity-moves-to-petto': banner('vanity', '/assets/vanity-banner.svg', 'Vanity moving into Petto'),
  '/blog/blibot-to-petto': banner('blibot', '/assets/banner-blibot.svg', 'Blibot moving to Petto'),
  '/blog/embed-builder-joins-petto': banner('embed-builder', '/assets/embed-builder-banner.webp', 'Embed Builder joins Petto'),
  '/codegen': banner('codegen', '/assets/codegen-banner.svg', 'The Petto Code Generator'),
  '/code': banner('code', '/assets/tetto-code-banner.svg', 'Petto Code'),
  '/nelu': banner('nelu', '/assets/nelu-banner.svg', 'Nelu'),
  '/am': banner('am', '/assets/am-banner.svg', 'AM'),
  '/tools': banner('tools', '/assets/tools-banner.svg', 'The Petto tools'),
  '/discord-age-verification': banner('discord', '/assets/discord-banner.svg', 'Discord news explained for server admins'),
  '/discord-api-2026': banner('discord', '/assets/discord-banner.svg', 'Discord news explained for server admins'),
  '/discord-encryption': banner('discord', '/assets/discord-banner.svg', 'Discord news explained for server admins'),
};

// The pages that have no banner get a card with their title on Petto's background, drawn by `scripts/make-og-images.mjs` once per language.
// A page also covers what is under it (`/changelog` covers `/changelog/0.7.7`, `/feedback` covers every post of the board).
/** @typedef {{ slug: string, title: Record<'en' | 'es' | 'pt-BR', string> }} TitleCard */
/** @type {(slug: string, en: string, es: string, pt: string) => TitleCard} */
const card = (slug, en, es, pt) => ({ slug, title: { en, es, 'pt-BR': pt } });

/** @type {Record<string, TitleCard>} */
export const TITLE_PAGES = {
  '/commands': card('commands', 'Commands', 'Comandos', 'Comandos'),
  '/status': card('status', 'Status', 'Estado', 'Status'),
  '/stats': card('stats', 'Stats', 'Estadísticas', 'Estatísticas'),
  '/team': card('team', 'Team', 'Equipo', 'Equipe'),
  '/roadmap': card('roadmap', 'Roadmap', 'Hoja de ruta', 'Roteiro'),
  '/changelog': card('changelog', 'Changelog', 'Novedades', 'Novidades'),
  '/premium': card('premium', 'Premium', 'Premium', 'Premium'),
  '/faq': card('faq', 'FAQ', 'Preguntas frecuentes', 'Perguntas frequentes'),
  '/partners': card('partners', 'Partners', 'Partners', 'Parceiros'),
  '/apply': card('apply', 'Apply to the team', 'Postula al equipo', 'Candidate-se à equipe'),
  '/feedback': card('feedback', 'Feedback board', 'Tablero de feedback', 'Quadro de feedback'),
  '/news': card('news', 'News', 'Noticias', 'Notícias'),
  '/blog': card('blog', 'Blog', 'Blog', 'Blog'),
  '/credits': card('credits', 'Credits', 'Créditos', 'Créditos'),
  '/brand': card('brand', 'Brand', 'Marca', 'Marca'),
  '/timestamp': card('timestamp', 'Timestamp generator', 'Generador de timestamps', 'Gerador de timestamps'),
  '/snowflake': card('snowflake', 'Snowflake decoder', 'Decodificador de snowflake', 'Decodificador de snowflake'),
  '/embed-code': card('embed-code', 'Embed code generator', 'Generador de código de embeds', 'Gerador de código de embeds'),
  '/embed-builder': card('embed-builder-page', 'Embed Builder', 'Embed Builder', 'Embed Builder'),
  '/linked-roles': card('linked-roles', 'Linked roles', 'Roles vinculados', 'Cargos vinculados'),
  '/terms': card('terms', 'Terms of Service', 'Términos del servicio', 'Termos de serviço'),
  '/privacy': card('privacy', 'Privacy Policy', 'Política de privacidad', 'Política de privacidade'),
  '/cookies': card('cookies', 'Cookies', 'Cookies', 'Cookies'),
  '/refunds': card('refunds', 'Refund policy', 'Política de reembolsos', 'Política de reembolso'),
};

/** The language a path is in: `/es/...` is Spanish, `/pt-br/...` is Brazilian Portuguese, anything else is English. */
export const pathLang = (pathname) => (/^\/es(?:\/|$)/.test(pathname) ? 'es' : /^\/pt-br(?:\/|$)/.test(pathname) ? 'pt-BR' : 'en');
/** The file name of a title card: its slug and the language of the page. */
export const titleCardName = (slug, lang) => `t-${slug}-${lang === 'pt-BR' ? 'pt-br' : lang}`;

/**
 * The picture of a page by its path (with or without the language prefix and a final slash), or null for the default one. A banner of its
 * own wins, then the title card of the page (or of the page it is under).
 * @param {string} pathname @returns {PageImage | null}
 */
export function pageImage(pathname) {
  const clean = pathname.replace(/^\/(es|pt-br)(?=\/|$)/, '').replace(/\/index(?:\.html)?$/, '').replace(/(.)\/+$/, '$1') || '/';
  if (PAGE_IMAGES[clean]) return PAGE_IMAGES[clean];
  const key = Object.keys(TITLE_PAGES).find((page) => clean === page || clean.startsWith(`${page}/`));
  if (!key) return null;
  const lang = pathLang(pathname);
  const found = TITLE_PAGES[key];
  return { name: titleCardName(found.slug, lang), source: '', alt: found.title[lang] };
}

/** @param {PageImage} image */
export const pageImagePath = (image) => `/assets/og/${image.name}.png`;
