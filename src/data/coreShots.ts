// Simulated screenshots of Petto's main systems, in the three languages of the site. The text of each card is the one the bot sends
// (src/i18n of the bot); the people are made up. The ones of the integrations are written by scripts/make-shots.mjs from the bot's own code.
import type { Shot, ShotComponent } from '../components/DiscordShot.astro';
import type { Locale } from '../i18n/ui';

const GREEN = 0xa5ea7a;
const RED = 0xfe6465;
const YELLOW = 0xfed53c;
const TIME: Record<Locale, string> = { en: 'Today at 10:42 AM', es: 'Hoy a las 10:42', 'pt-BR': 'Hoje às 10:42' };
const LOCALE: Record<Locale, string> = { en: 'en-US', es: 'es-419', 'pt-BR': 'pt-BR' };
const BOT = { name: 'Petto', bot: true, avatar: '/assets/bot-avatar.png' };
const STAFF = { name: 'kiwi', color: '#7fd4a8' };
const MEMBER = { name: 'liam', color: '#f2a65a' };

const text = (content: string): ShotComponent => ({ type: 10, content });
const line = (): ShotComponent => ({ type: 14, divider: true, spacing: 2 });
const card = (accent: number | undefined, ...parts: ShotComponent[]): ShotComponent[] => [{ type: 17, accent_color: accent, components: parts }];
const button = (label: string, style = 2): ShotComponent => ({ type: 2, style, label });
const row = (...buttons: ShotComponent[]): ShotComponent => ({ type: 1, components: buttons });

const build = (lang: Locale, channel: string, typed: string | undefined, who: Shot['messages'][number]['user'], components: ShotComponent[]): Shot => ({
  channel,
  now: 1798900000_000 - 2 * 86400_000, // the giveaway ends in two days
  locale: LOCALE[lang],
  messages: [
    ...(typed ? [{ user: who, time: TIME[lang], text: typed }] : []),
    { user: BOT, time: TIME[lang], components },
  ],
});

type Copy = Record<Locale, string>;
const pick = (copy: Copy, lang: Locale) => copy[lang];

export const coreShots: Record<string, (lang: Locale) => Shot> = {
  moderation: (lang) => build(lang, 'mod-log', pick({ en: '!ban @spammer advertising in every channel', es: '!ban @spammer publicidad en todos los canales', 'pt-BR': '!ban @spammer divulgação em todos os canais' }, lang), STAFF, card(RED,
    text(pick({
      en: '🔨 **spammer** was banned from the server. Reason: **advertising in every channel**.',
      es: '🔨 **spammer** fue baneado del servidor. Razón: **publicidad en todos los canales**.',
      'pt-BR': '🔨 **spammer** foi banido do servidor. Motivo: **divulgação em todos os canais**.',
    }, lang)),
    line(),
    text(pick({ en: 'Case **#128** · by **kiwi**', es: 'Caso **#128** · por **kiwi**', 'pt-BR': 'Caso **#128** · por **kiwi**' }, lang)),
  )),
  tickets: (lang) => build(lang, 'support', undefined, MEMBER, card(undefined,
    text(pick({
      en: '### Need help?\nOpen a ticket and the team will answer you here, in private.',
      es: '### ¿Necesitas ayuda?\nAbre un ticket y el equipo te responderá aquí, en privado.',
      'pt-BR': '### Precisa de ajuda?\nAbra um ticket e a equipe vai responder aqui, em privado.',
    }, lang)),
    line(),
    row(button(pick({ en: 'Open a ticket', es: 'Abrir un ticket', 'pt-BR': 'Abrir um ticket' }, lang), 1)),
  )),
  levels: (lang) => build(lang, 'general', undefined, MEMBER, card(GREEN,
    text(pick({
      en: '🎉 **liam** reached **level 12**!\nYou got the role **Regular**.',
      es: '🎉 **liam** llegó al **nivel 12**.\nObtuviste el rol **Habitual**.',
      'pt-BR': '🎉 **liam** chegou ao **nível 12**!\nVocê recebeu o cargo **Veterano**.',
    }, lang)),
  )),
  giveaways: (lang) => build(lang, 'giveaways', undefined, STAFF, card(YELLOW,
    text(pick({
      en: '### 🎁 Nitro Classic\nEnds <t:1798900000:R> · **2** winners\nRequires **level 5**',
      es: '### 🎁 Nitro Classic\nTermina <t:1798900000:R> · **2** ganadores\nRequiere **nivel 5**',
      'pt-BR': '### 🎁 Nitro Classic\nTermina <t:1798900000:R> · **2** vencedores\nRequer **nível 5**',
    }, lang)),
    line(),
    row(button(pick({ en: 'Enter · 184', es: 'Participar · 184', 'pt-BR': 'Participar · 184' }, lang), 3)),
  )),
  protection: (lang) => build(lang, 'alerts', undefined, STAFF, card(RED,
    text(pick({
      en: '### 🛡️ Anti-scam\nThe same message was sent in **5 channels** by an account created **2 hours ago**.\nAction taken: **timeout 1h** · recent messages deleted.',
      es: '### 🛡️ Anti-scam\nEl mismo mensaje se envió en **5 canales** desde una cuenta creada hace **2 horas**.\nAcción: **timeout 1h** · mensajes recientes borrados.',
      'pt-BR': '### 🛡️ Anti-scam\nA mesma mensagem foi enviada em **5 canais** por uma conta criada há **2 horas**.\nAção: **timeout 1h** · mensagens recentes apagadas.',
    }, lang)),
    line(),
    row(button(pick({ en: 'Ban', es: 'Banear', 'pt-BR': 'Banir' }, lang), 4), button(pick({ en: 'Undo', es: 'Deshacer', 'pt-BR': 'Desfazer' }, lang))),
  )),
  community: (lang) => build(lang, 'general', undefined, MEMBER, card(GREEN,
    text(pick({
      en: '### 🎂 Birthday today\nHappy birthday, **liam**! Everyone say hi.',
      es: '### 🎂 Cumpleaños hoy\n¡Feliz cumpleaños, **liam**! Saluden todos.',
      'pt-BR': '### 🎂 Aniversário hoje\nParabéns, **liam**! Todo mundo dá um oi.',
    }, lang)),
  )),
  stats: (lang) => build(lang, 'staff', pick({ en: '!summary messages', es: '!summary messages', 'pt-BR': '!summary messages' }, lang), STAFF, card(undefined,
    text(pick({
      en: '### Messages · last 7 days\n**18,420** messages · most active hour **9 PM**\nBusiest day **Saturday**',
      es: '### Mensajes · últimos 7 días\n**18.420** mensajes · hora más activa **21:00**\nDía más movido **sábado**',
      'pt-BR': '### Mensagens · últimos 7 dias\n**18.420** mensagens · horário mais ativo **21h**\nDia mais movimentado **sábado**',
    }, lang)),
  )),
  custom: (lang) => build(lang, 'general', '!hello', MEMBER, card(undefined,
    text(pick({
      en: '### Hello, liam 👋\nThis command was written with **Petto Code**.',
      es: '### Hola, liam 👋\nEste comando se escribió con **Petto Code**.',
      'pt-BR': '### Olá, liam 👋\nEste comando foi escrito com **Petto Code**.',
    }, lang)),
    line(),
    row(button(pick({ en: 'Say hi back', es: 'Saludar de vuelta', 'pt-BR': 'Responder o oi' }, lang), 1)),
  )),
};
