import type { Locale } from '../i18n/ui';

const SITE = 'https://petto.sbs';
// The peach of the site.
const ACCENT = 0xf0a88f;
const MAX_BYTES = 3000;

// The card is kept small and plain: the name, one line and two buttons.
const copy: Record<Locale, { description: string; buttons: { invite: string; commands: string } }> = {
  en: { description: 'Moderation, tickets, leveling and giveaways for your Discord server, in one bot.', buttons: { invite: 'Add to Discord', commands: 'Commands' } },
  es: { description: 'Moderación, tickets, niveles y sorteos para tu servidor de Discord, en un solo bot.', buttons: { invite: 'Agregar a Discord', commands: 'Comandos' } },
  'pt-BR': { description: 'Moderação, tickets, níveis e sorteios para o seu servidor do Discord, em um só bot.', buttons: { invite: 'Adicionar ao Discord', commands: 'Comandos' } },
};

const prefix: Record<Locale, string> = { en: '', es: '/es', 'pt-BR': '/pt-br' };

const linkButton = (label: string, url: string) => ({ type: 2, style: 5, label, url });

/**
 * JSON for Discord's component embed link preview, the card Discord draws when someone posts a
 * link to the site. Discord drops the whole preview when the payload is invalid or over 3,000 bytes,
 * so the size is checked while the site builds.
 */
export function discordEmbedJson(lang: Locale): string {
  const text = copy[lang];
  const home = `${SITE}${prefix[lang]}`;
  const payload = {
    component: {
      type: 17,
      accent_color: ACCENT,
      components: [
        { type: 10, content: `# [Petto](${home})\n${text.description}` },
        { type: 1, components: [linkButton(text.buttons.invite, `${SITE}/invite`), linkButton(text.buttons.commands, `${home}/commands`)] },
      ],
    },
  };
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  if (new TextEncoder().encode(json).length > MAX_BYTES) throw new Error('The Discord link preview is over 3,000 bytes.');
  return json;
}
