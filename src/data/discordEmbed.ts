import type { Locale } from '../i18n/ui';

const SITE = 'https://petto.sbs';
// The icons of the two buttons are from Petto's colorless set (the server's own emojis), and the card has no accent color, so it is as
// plain as the other cards in the chat.
const EMOJI = {
  invite: { id: '1562517637668540456', name: 'pe_ticket_add' },
  dashboard: { id: '1533209778438934609', name: 'pe_config' },
};
const MAX_BYTES = 3000;

// The card is kept small and plain, and it is about the page that was shared: the banner, the title of that page (a link to its own
// address) with its one-line description, the address in small letters, and two buttons. It keeps the kinds of parts of the card that
// Discord accepted before (banner, text, divider, text, buttons with emoji), because Discord drops the whole preview when something in
// it is not to its liking and does not say what.
// A page with a banner of its own (a blog post) shows that banner instead (a PNG, see data/pageImages.mjs).
// The default banner is the same file as in that card (a plain WebP, not the smaller one with a colour profile): Discord already keeps a copy of it,
// and a new image has to be fetched from the site within the 10 seconds Discord gives the whole preview.
const buttons: Record<Locale, { invite: string; dashboard: string }> = {
  en: { invite: 'Add to Discord', dashboard: 'Dashboard' },
  es: { invite: 'Agregar a Discord', dashboard: 'Dashboard' },
  'pt-BR': { invite: 'Adicionar ao Discord', dashboard: 'Dashboard' },
};

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
export function discordEmbedJson(lang: Locale, page: { title: string; description: string; url: string; image?: { url: string; alt: string } }): string {
  const text = buttons[lang];
  const url = page.url.startsWith(SITE) ? page.url : SITE;
  const address = url.replace(/^https:\/\//, '').replace(/\/$/, '');
  const payload = {
    component: {
      type: 17,
      components: [
        { type: 12, items: [{ media: { url: page.image?.url ?? `${SITE}/assets/petto-link-banner.webp` }, description: page.image?.alt ?? 'Petto, a moderation and community bot for Discord' }] },
        { type: 10, content: `## [${clip(plain(page.title, true), 80) || 'Petto'}](${url})\n${clip(plain(page.description), 200)}` },
        { type: 14, spacing: 1 },
        { type: 10, content: `-# ${address}` },
        { type: 1, components: [linkButton(text.invite, EMOJI.invite, `${SITE}/invite`), linkButton(text.dashboard, EMOJI.dashboard, `${SITE}/dash`)] },
      ],
    },
  };
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  if (new TextEncoder().encode(json).length > MAX_BYTES) throw new Error('The Discord link preview is over 3,000 bytes.');
  return json;
}
