// The picture a link to a page shows when it is shared (Discord, X, Telegram...): a 1200x630 WebP drawn for the page and its language
// (src/data/ogCards.mjs says which card each page uses, scripts/og/render.mjs draws them, src/data/ogManifest.json lists what was drawn).
// Every page has one: a page nobody listed uses the card of its parent, and the home card is the base.
import { cardName, ogCardFor } from './ogCards.mjs';
import manifest from './ogManifest.json';

export interface PageImage { name: string; alt: string; tagline: string; accent: number; width: number; height: number }

const cards = manifest.cards as Record<string, { key: string; lang: string; alt: string; tagline: string; accent: number }>;
const drawn = new Set(Object.values(cards).map((card) => card.key));

/** The picture of a page by its path (with or without the language prefix and a final slash). */
export function pageImage(pathname: string): PageImage {
  const { key, lang } = ogCardFor(pathname, (candidate) => drawn.has(candidate));
  let name = cardName(key, lang);
  if (!cards[name]) name = cardName('home', lang);
  return { name, alt: cards[name]?.alt ?? 'Petto', tagline: cards[name]?.tagline ?? '', accent: cards[name]?.accent ?? 0xf5c518, width: manifest.width, height: manifest.height };
}

export const pageImagePath = (image: PageImage) => `/assets/og/${image.name}.webp`;
