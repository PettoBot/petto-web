import type { Locale } from '../i18n/ui';

const SITE = 'https://petto.sbs';
const ACCENT = 0x8399ff;
const MAX_BYTES = 3000;

const copy: Record<Locale, {
  description: string;
  points: [string, string, string];
  footer: string;
  buttons: { commands: string; invite: string; dashboard: string; support: string };
}> = {
  en: {
    description: 'Moderation, tickets, leveling and giveaways for your Discord server, all in one bot.',
    points: [
      '🛡️ **Keep it safe** with cases, AutoMod, anti-raid and anti-nuke',
      '🎫 **Keep it organized** with tickets, logs and backups',
      '🏆 **Keep it lively** with levels, giveaways and reaction roles',
    ],
    footer: '-# Prefix commands · Web dashboard · English, Español, Português',
    buttons: { commands: 'Commands', invite: 'Add to Discord', dashboard: 'Dashboard', support: 'Support server' },
  },
  es: {
    description: 'Moderación, tickets, niveles y sorteos para tu servidor de Discord, todo en un solo bot.',
    points: [
      '🛡️ **Mantén todo seguro** con casos, AutoMod, anti-raid y anti-nuke',
      '🎫 **Mantén todo organizado** con tickets, registros y copias de seguridad',
      '🏆 **Mantén todo animado** con niveles, sorteos y roles por reacción',
    ],
    footer: '-# Comandos con prefijo · Dashboard web · English, Español, Português',
    buttons: { commands: 'Comandos', invite: 'Agregar a Discord', dashboard: 'Dashboard', support: 'Servidor de soporte' },
  },
  'pt-BR': {
    description: 'Moderação, tickets, níveis e sorteios para o seu servidor do Discord, tudo em um só bot.',
    points: [
      '🛡️ **Mantenha tudo seguro** com casos, AutoMod, anti-raid e anti-nuke',
      '🎫 **Mantenha tudo organizado** com tickets, logs e backups',
      '🏆 **Mantenha tudo animado** com níveis, sorteios e cargos por reação',
    ],
    footer: '-# Comandos com prefixo · Dashboard web · English, Español, Português',
    buttons: { commands: 'Comandos', invite: 'Adicionar ao Discord', dashboard: 'Dashboard', support: 'Servidor de suporte' },
  },
};

const prefix: Record<Locale, string> = { en: '', es: '/es', 'pt-BR': '/pt-br' };

function linkButton(label: string, emoji: string, url: string) {
  return { type: 2, style: 5, label, emoji: { name: emoji }, url };
}

/**
 * JSON for Discord's component embed link preview, the card Discord draws when someone posts a
 * link to the site. Only standard emoji are used. Discord drops the whole preview when the payload
 * is invalid or over 3,000 bytes, so the size is checked while the site builds.
 */
export function discordEmbedJson(lang: Locale): string {
  const text = copy[lang];
  const home = `${SITE}${prefix[lang]}`;
  const payload = {
    component: {
      type: 17,
      accent_color: ACCENT,
      components: [
        {
          type: 9,
          components: [{ type: 10, content: `# **[Petto](${home})**\n${text.description}` }],
          accessory: { type: 11, media: { url: `${SITE}/assets/mascot-icon.png` } },
        },
        { type: 14, spacing: 1 },
        { type: 10, content: text.points.join('\n') },
        { type: 14, spacing: 1 },
        { type: 10, content: text.footer },
        {
          type: 1,
          components: [
            linkButton(text.buttons.commands, '📖', `${home}/commands`),
            linkButton(text.buttons.invite, '🚀', `${SITE}/invite`),
            linkButton(text.buttons.dashboard, '🧩', `${SITE}/dash`),
            linkButton(text.buttons.support, '💬', `${SITE}/support`),
          ],
        },
      ],
    },
  };
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  if (new TextEncoder().encode(json).length > MAX_BYTES) throw new Error('The Discord link preview is over 3,000 bytes.');
  return json;
}
