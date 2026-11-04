// The picture a link to a page shows when it is shared (Discord, X, Telegram...): a 1200x630 WebP drawn for the page and its language
// (src/data/ogCards.mjs says which card each page uses, scripts/og/render.mjs draws them, src/data/ogManifest.json lists what was drawn).
// Every page has one: a page nobody listed uses the card of its parent, and the home card is the base.
// The same table gives what the preview says: the title and the description of the card of the page (src/data/previewText.mjs), and the color of the bar
// of the Discord card, which is the background of the picture itself (the tone of its family, see accentNumber).
import { accentNumber, cardName, ogCardFor } from './ogCards.mjs';
import manifest from './ogManifest.json';

export interface PageImage {
  name: string;
  /** The start of the hash of the picture: it goes in the address so Discord, X and the CDN fetch the picture again when it was drawn again. */
  version: string;
  alt: string;
  tagline: string;
  /** The title the preview of the page has when the page is one of the cards (a page under a card, like a release, has its own). */
  embedTitle: string;
  /** What the preview of the page says when the page is one of the cards. */
  description: string;
  /** True when the page itself has a card (or a post does), false when it uses the card of the page it is under or the home one. */
  exact: boolean;
  /** The color of the bar of the Discord card: the background of the picture. */
  accent: number;
  width: number;
  height: number;
}

const cards = manifest.cards as Record<string, { key: string; lang: string; tone: string; alt: string; tagline: string; embedTitle: string; description: string; version?: string }>;
const drawn = new Set(Object.values(cards).map((card) => card.key));

/** The picture of a page by its path (with or without the language prefix and a final slash). */
export function pageImage(pathname: string): PageImage {
  const found = ogCardFor(pathname, (candidate) => drawn.has(candidate));
  let name = cardName(found.key, found.lang);
  if (!cards[name]) name = cardName('home', found.lang);
  const card = cards[name];
  return {
    name,
    version: card?.version ?? '',
    alt: card?.alt ?? 'Petto',
    tagline: card?.tagline ?? '',
    embedTitle: card?.embedTitle ?? 'Petto, a Discord bot',
    description: card?.description ?? '',
    exact: found.exact && Boolean(cards[cardName(found.key, found.lang)]),
    accent: accentNumber(card?.tone ?? 'butter'),
    width: manifest.width,
    height: manifest.height,
  };
}

export const pageImagePath = (image: PageImage) => `/assets/og/${image.name}.webp${image.version ? `?v=${image.version}` : ''}`;
