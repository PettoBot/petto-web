import type { Locale } from '../i18n/ui';
import { getAllCommands } from '../utils/commandList';

const SITE = 'https://petto.sbs';
// The peach of the site.
const ACCENT = 0xf0a88f;
const MAX_BYTES = 3000;

// The card is kept small and plain: a simple banner, the name, one line about the bot and a few buttons. It keeps the same order of parts
// as the card that Discord accepted before (banner, text, divider, text, divider, text, buttons with emoji), because Discord drops the
// whole preview when something in it is not to its liking and does not say what.
// The banner is the same file as in that card (a plain WebP, not the smaller one with a colour profile): Discord already keeps a copy of it,
// and a new image has to be fetched from the site within the 10 seconds Discord gives the whole preview.
const copy: Record<Locale, { description: string; line: string; stats: (commands: number) => string; buttons: { invite: string; commands: string; dashboard: string } }> = {
  en: { description: 'Moderation, tickets, leveling and giveaways for your Discord server, in one bot.', line: 'Safe, organized and lively.', stats: (n) => `-# Free to add · ${n} commands · English, Español, Português`, buttons: { invite: 'Add to Discord', commands: 'Commands', dashboard: 'Dashboard' } },
  es: { description: 'Moderación, tickets, niveles y sorteos para tu servidor de Discord, en un solo bot.', line: 'Seguro, organizado y animado.', stats: (n) => `-# Gratis para agregar · ${n} comandos · English, Español, Português`, buttons: { invite: 'Agregar a Discord', commands: 'Comandos', dashboard: 'Dashboard' } },
  'pt-BR': { description: 'Moderação, tickets, níveis e sorteios para o seu servidor do Discord, em um só bot.', line: 'Seguro, organizado e animado.', stats: (n) => `-# Grátis para adicionar · ${n} comandos · English, Español, Português`, buttons: { invite: 'Adicionar ao Discord', commands: 'Comandos', dashboard: 'Dashboard' } },
};

const prefix: Record<Locale, string> = { en: '', es: '/es', 'pt-BR': '/pt-br' };

const linkButton = (label: string, emoji: string, url: string) => ({ type: 2, style: 5, label, emoji: { name: emoji }, url });

/**
 * JSON for Discord's component embed link preview, the card Discord draws when someone posts a
 * link to the site. Discord drops the whole preview when the payload is invalid or over 3,000 bytes,
 * so the size is checked while the site builds.
 */
export function discordEmbedJson(lang: Locale): string {
  const text = copy[lang];
  const home = `${SITE}${prefix[lang]}`;
  const commands = getAllCommands().length;
  const payload = {
    component: {
      type: 17,
      accent_color: ACCENT,
      components: [
        { type: 12, items: [{ media: { url: `${SITE}/assets/petto-link-banner.webp` }, description: 'Petto, a moderation and community bot for Discord' }] },
        { type: 10, content: `# **[Petto](${home})**\n${text.description}` },
        { type: 14, spacing: 1 },
        { type: 10, content: text.line },
        { type: 14, spacing: 1 },
        { type: 10, content: text.stats(commands) },
        { type: 1, components: [linkButton(text.buttons.invite, '🚀', `${SITE}/invite`), linkButton(text.buttons.commands, '📖', `${home}/commands`), linkButton(text.buttons.dashboard, '🧩', `${SITE}/dash`)] },
      ],
    },
  };
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  if (new TextEncoder().encode(json).length > MAX_BYTES) throw new Error('The Discord link preview is over 3,000 bytes.');
  return json;
}
