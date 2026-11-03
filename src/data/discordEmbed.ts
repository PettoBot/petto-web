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
// The picture is the card drawn for the page (a WebP of 1200x630, see data/ogCards.mjs and data/pageImages.ts): the files are made when the site
// is built and served as they are (the server keeps them for a day), so Discord, which gives the whole preview 10 seconds, never waits for one to be
// drawn. The home page's title says how many servers and members Petto has (homeEmbedTitle); if the numbers cannot be read, it is the plain title.
const buttons: Record<Locale, { invite: string; dashboard: string }> = {
  en: { invite: 'Add to Discord', dashboard: 'Dashboard' },
  es: { invite: 'Agregar a Discord', dashboard: 'Dashboard' },
  'pt-BR': { invite: 'Adicionar ao Discord', dashboard: 'Dashboard' },
};

const NUMBER_SEPARATOR: Record<Locale, string> = { en: ',', es: '.', 'pt-BR': '.' };
/** 56468 as `56,468` (English) or `56.468` (Spanish and Portuguese), whatever the browser or the server would do with 4 digits. */
export const groupNumber = (value: number, lang: Locale) => String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, NUMBER_SEPARATOR[lang]);

/**
 * The title of the link preview of the home page: Petto's own numbers when they are known ("Petto · Looking after 620 servers and 56,468
 * members"), only the servers when the members are not known, and the plain title when nothing is.
 */
export function homeEmbedTitle(lang: Locale, plain: string, numbers: { servers: number; members: number | null } | null): string {
  const servers = numbers && Number.isFinite(numbers.servers) && numbers.servers > 0 ? numbers.servers : 0;
  if (!servers) return plain;
  const members = numbers?.members && Number.isFinite(numbers.members) && numbers.members > 0 ? numbers.members : 0;
  const s = groupNumber(servers, lang);
  const m = groupNumber(members, lang);
  const text = {
    en: members ? `Looking after ${s} ${servers === 1 ? 'server' : 'servers'} and ${m} ${members === 1 ? 'member' : 'members'}` : `Looking after ${s} ${servers === 1 ? 'server' : 'servers'}`,
    es: members ? `Cuidando ${s} ${servers === 1 ? 'servidor' : 'servidores'} y ${m} ${members === 1 ? 'miembro' : 'miembros'}` : `Cuidando ${s} ${servers === 1 ? 'servidor' : 'servidores'}`,
    'pt-BR': members ? `Cuidando de ${s} ${servers === 1 ? 'servidor' : 'servidores'} e ${m} ${members === 1 ? 'membro' : 'membros'}` : `Cuidando de ${s} ${servers === 1 ? 'servidor' : 'servidores'}`,
  }[lang];
  return `Petto · ${text}`;
}

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
