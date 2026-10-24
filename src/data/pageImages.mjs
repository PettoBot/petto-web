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
  '/tools': banner('tools', '/assets/tools-banner.svg', 'The Petto tools'),
  '/discord-age-verification': banner('discord', '/assets/discord-banner.svg', 'Discord news explained for server admins'),
  '/discord-api-2026': banner('discord', '/assets/discord-banner.svg', 'Discord news explained for server admins'),
  '/discord-encryption': banner('discord', '/assets/discord-banner.svg', 'Discord news explained for server admins'),
};

/** The picture of a page by its path (with or without the language prefix and a final slash), or null for the default one. */
/** @param {string} pathname @returns {PageImage | null} */
export function pageImage(pathname) {
  const clean = pathname.replace(/^\/(es|pt-br)(?=\/|$)/, '').replace(/\/index(?:\.html)?$/, '').replace(/(.)\/+$/, '$1') || '/';
  return PAGE_IMAGES[clean] ?? null;
}

/** @param {PageImage} image */
export const pageImagePath = (image) => `/assets/og/${image.name}.png`;
