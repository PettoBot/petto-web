import type { Locale } from '../i18n/ui';

const SITE = 'https://petto.sbs';
// The icons of the four buttons are from Petto's colorless set (grayscale, measured on the Discord CDN; the server's own emojis): the first two are the ones the
// card always had, Docs is the round i of information (light like the other two; the page of notes, pe_notas, is grayscale too but too dark on the button) and Support the speech bubble. The color of the bar on the left of the card is the background of the picture of
// the page (see data/ogCards.mjs), so the card and its picture are one color.
export const EMOJI = {
  invite: { id: '1562517637668540456', name: 'pe_ticket_add' },
  dashboard: { id: '1533209778438934609', name: 'pe_config' },
  docs: { id: '1533575563225337866', name: 'pe_info' },
  support: { id: '1566294375053660160', name: 'pe_speech' },
};
const MAX_BYTES = 3000;

// The card is kept small and plain, and it is about the page that was shared: the picture, the title of that page (a link to its own address) with its
// description, the address in small letters, and four buttons. It keeps the kinds of parts of the card that Discord accepted before (picture, text, divider,
// text, buttons with emoji), because Discord drops the whole preview when something in it is not to its liking and does not say what.
// The picture is the card drawn for the page (a WebP of 1200x630, see data/ogCards.mjs and data/pageImages.ts): the files are made when the site is built and
// served as they are (the server keeps them for a day), so Discord, which gives the whole preview 10 seconds, never waits for one to be drawn.
// What the card says never has a count of servers or members of the bot.
const buttons: Record<Locale, { invite: string; dashboard: string; docs: string; support: string }> = {
  en: { invite: 'Add to Discord', dashboard: 'Dashboard', docs: 'Docs', support: 'Support' },
  es: { invite: 'Agregar a Discord', dashboard: 'Dashboard', docs: 'Docs', support: 'Soporte' },
  'pt-BR': { invite: 'Adicionar ao Discord', dashboard: 'Dashboard', docs: 'Docs', support: 'Suporte' },
};
/** The wiki has its own pages in Spanish and Portuguese. */
export const DOCS_URL: Record<Locale, string> = { en: 'https://wiki.petto.sbs', es: 'https://wiki.petto.sbs/es/overview/introduction', 'pt-BR': 'https://wiki.petto.sbs/pt-br/overview/introduction' };
/** The support server of Petto: the address the site already uses (it sends people to the invite). */
export const SUPPORT_URL = `${SITE}/support`;

const linkButton = (label: string, emoji: { id: string; name: string }, url: string) => ({ type: 2, style: 5, label, emoji, url });
const clip = (text: string, max: number) => {
  const line = text.replace(/\s+/g, ' ').trim();
  return line.length <= max ? line : `${line.slice(0, max - 1).trimEnd()}…`;
};
// Markdown marks in a title or a description would change the card (a ] would end the link of the title).
const plain = (text: string, link = false) => text.replace(link ? /[\\*_~`|[\]()<>#]/g : /[\\*~`|[\]<>]/g, '');

/**
 * JSON for Discord's component embed link preview, the card Discord draws when someone posts a link to the site: the page that was
 * shared (its title, description and address) in its language. Discord drops the whole preview when the payload is invalid or over
 * 3,000 bytes, so the size is checked while the site builds.
 */
export function discordEmbedJson(lang: Locale, page: { title: string; description: string; url: string; image?: { url: string; alt: string }; accent?: number }): string {
  const text = buttons[lang];
  const url = page.url.startsWith(SITE) ? page.url : SITE;
  const address = url.replace(/^https:\/\//, '').replace(/\/$/, '');
  const payload = {
    component: {
      type: 17,
      // The bar on the left of the card: the same color as the background of the picture of the page.
      ...(typeof page.accent === 'number' ? { accent_color: page.accent } : {}),
      components: [
        { type: 12, items: [{ media: { url: page.image?.url ?? `${SITE}/assets/petto-link-banner.webp` }, description: page.image?.alt ?? 'Petto, a moderation and community bot for Discord' }] },
        { type: 10, content: `## [${clip(plain(page.title, true), 90) || 'Petto'}](${url})\n${clip(plain(page.description), 220)}` },
        { type: 14, spacing: 1 },
        { type: 10, content: `-# ${address}` },
        { type: 1, components: [linkButton(text.invite, EMOJI.invite, `${SITE}/invite`), linkButton(text.dashboard, EMOJI.dashboard, `${SITE}/dash`), linkButton(text.docs, EMOJI.docs, DOCS_URL[lang]), linkButton(text.support, EMOJI.support, SUPPORT_URL)] },
      ],
    },
  };
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  if (new TextEncoder().encode(json).length > MAX_BYTES) throw new Error('The Discord link preview is over 3,000 bytes.');
  return json;
}
