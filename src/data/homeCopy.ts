// The words of the redesigned pages (home, Features, Premium, Commands) that are new: the hero, the phones, the animated scenes and the headers of the
// other pages. Written in the three languages of the site; the rest of the words of those pages stay where they were (src/i18n/ui.ts).
import type { Locale } from '../i18n/ui';

export interface HomeCopy {
  hero: { eyebrow: string; before: string; em: string; after: string; lede: string };
  devices: { laptopAlt: string; phoneAlt: Record<'leveling' | 'welcome' | 'modules', string> };
  phones: { eyebrow: string; title: string; em: string; desc: string; points: string[] };
  scenes: {
    eyebrow: string; title: string; em: string; desc: string;
    leveling: { chip: string; levelUp: string; next: string };
    tickets: { chip: string; button: string; opened: string; joined: string };
  };
  layers: { eyebrow: string; title: string; em: string; desc: string; nuke: LayerCopy; raid: LayerCopy; automod: LayerCopy };
  discord: { eyebrow: string; title: string; em: string; desc: string };
}
interface LayerCopy { chip: string; title: string; desc: string }

export const HOME_COPY: Record<Locale, HomeCopy> = {
  en: {
    hero: { eyebrow: 'Discord bot · since 2017', before: 'The bot you set up', em: 'in a few taps', after: 'and forget.', lede: 'Moderation, tickets, levels, giveaways and more in one place. You choose how you want it in a clear panel, and Petto applies it in seconds.' },
    devices: { laptopAlt: 'The Petto dashboard on a laptop', phoneAlt: { leveling: 'Leveling settings on a phone', welcome: 'Welcome messages on a phone', modules: 'The list of modules on a phone' } },
    phones: {
      eyebrow: 'On your phone',
      title: 'Everything you can set up,',
      em: 'you can set up from your phone',
      desc: 'The dashboard fits the screen: open the menu, change what you want and it is saved at once. No app to install, no waiting to get to a computer.',
      points: ['Levels, welcomes, moderation and more', 'The same settings as on the computer', 'Applied in your server in seconds'],
    },
    scenes: {
      eyebrow: 'Always on',
      title: 'It watches the server,',
      em: 'so you do not have to',
      desc: 'Rules you set once keep working while you sleep: Petto answers in the channel, with the buttons right there.',
      leveling: { chip: 'Leveling', levelUp: 'kiwi reached level 12!', next: '8,240 / 12,900 XP' },
      tickets: { chip: 'Support', button: 'Open a ticket', opened: 'Ticket #42 opened by kiwi', joined: 'Support joined the ticket' },
    },
    layers: {
      eyebrow: 'Protection', title: 'Shielded day and night,', em: 'in three layers', desc: 'Each layer has its own settings and writes down what it does, so the staff can rest.',
      nuke: { chip: 'Anti-nuke', title: 'Stops an account that goes rogue', desc: 'If an account starts deleting channels or roles, the bot steps in. Every protection has its own settings.' },
      raid: { chip: 'Anti-raid', title: 'Holds back the flood of new accounts', desc: 'Spots a wave of new accounts as it starts and warns your staff. A lockdown starts with one command.' },
      automod: { chip: 'AutoMod', title: 'Cleans the chat by itself', desc: 'Ready-made rules, your own filters and strikes that grow into a punishment, with no moderator watching.' },
    },
    discord: { eyebrow: 'In Discord', title: 'This is what your members', em: 'see in the server', desc: 'Cards with the look of Discord, in your language, with the buttons right there.' },
  },
  es: {
    hero: { eyebrow: 'Bot de Discord · desde 2017', before: 'El bot que se configura', em: 'con unos toques', after: 'y te olvidas.', lede: 'Moderación, tickets, niveles, sorteos y más en un solo lugar. Tú eliges cómo lo quieres en un panel claro, y Petto lo aplica en segundos.' },
    devices: { laptopAlt: 'El dashboard de Petto en una laptop', phoneAlt: { leveling: 'Ajustes de niveles en un celular', welcome: 'Mensajes de bienvenida en un celular', modules: 'La lista de módulos en un celular' } },
    phones: {
      eyebrow: 'En el celular',
      title: 'Todo lo que puedes configurar,',
      em: 'también desde tu celular',
      desc: 'El dashboard se adapta a la pantalla: abres el menú, cambias lo que quieras y se guarda al instante. Sin apps que instalar, sin esperar a llegar a la compu.',
      points: ['Niveles, bienvenidas, moderación y más', 'Los mismos ajustes que en la compu', 'Se aplican en tu servidor en segundos'],
    },
    scenes: {
      eyebrow: 'Siempre activo',
      title: 'Vigila el servidor,',
      em: 'para que tú no tengas que hacerlo',
      desc: 'Las reglas que configuras una vez siguen funcionando mientras duermes: Petto responde en el canal, con los botones ahí mismo.',
      leveling: { chip: 'Niveles', levelUp: '¡kiwi llegó al nivel 12!', next: '8.240 / 12.900 XP' },
      tickets: { chip: 'Soporte', button: 'Abrir un ticket', opened: 'Ticket #42 abierto por kiwi', joined: 'Soporte entró al ticket' },
    },
    layers: {
      eyebrow: 'Protección', title: 'Protegido de día y de noche,', em: 'en tres capas', desc: 'Cada capa tiene sus propios ajustes y deja registro de lo que hace, para que el staff pueda descansar.',
      nuke: { chip: 'Anti-nuke', title: 'Frena a una cuenta que se vuelve loca', desc: 'Si una cuenta empieza a borrar canales o roles, el bot interviene. Cada protección tiene sus propios ajustes.' },
      raid: { chip: 'Anti-raid', title: 'Contiene la avalancha de cuentas nuevas', desc: 'Detecta una oleada de cuentas nuevas apenas empieza y avisa a tu staff. Un lockdown se activa con un comando.' },
      automod: { chip: 'AutoMod', title: 'Limpia el chat solo', desc: 'Reglas listas, tus propios filtros y strikes que escalan hasta un castigo, sin un moderador vigilando.' },
    },
    discord: { eyebrow: 'En Discord', title: 'Esto es lo que ven', em: 'tus miembros en el servidor', desc: 'Tarjetas con el aspecto de Discord, en tu idioma, con los botones ahí mismo.' },
  },
  'pt-BR': {
    hero: { eyebrow: 'Bot do Discord · desde 2017', before: 'O bot que você configura', em: 'em poucos toques', after: 'e esquece.', lede: 'Moderação, tickets, níveis, sorteios e mais em um só lugar. Você escolhe como quer em um painel claro, e o Petto aplica em segundos.' },
    devices: { laptopAlt: 'O dashboard do Petto em um notebook', phoneAlt: { leveling: 'Ajustes de níveis em um celular', welcome: 'Mensagens de boas-vindas em um celular', modules: 'A lista de módulos em um celular' } },
    phones: {
      eyebrow: 'No celular',
      title: 'Tudo o que você pode configurar,',
      em: 'também pelo celular',
      desc: 'O dashboard se adapta à tela: você abre o menu, muda o que quiser e salva na hora. Sem app para instalar, sem esperar chegar ao computador.',
      points: ['Níveis, boas-vindas, moderação e mais', 'Os mesmos ajustes do computador', 'Aplicados no seu servidor em segundos'],
    },
    scenes: {
      eyebrow: 'Sempre ligado',
      title: 'Ele vigia o servidor,',
      em: 'para você não precisar',
      desc: 'As regras que você configura uma vez continuam funcionando enquanto você dorme: o Petto responde no canal, com os botões ali mesmo.',
      leveling: { chip: 'Níveis', levelUp: 'kiwi chegou ao nível 12!', next: '8.240 / 12.900 XP' },
      tickets: { chip: 'Suporte', button: 'Abrir um ticket', opened: 'Ticket #42 aberto por kiwi', joined: 'O suporte entrou no ticket' },
    },
    layers: {
      eyebrow: 'Proteção', title: 'Protegido de dia e de noite,', em: 'em três camadas', desc: 'Cada camada tem seus próprios ajustes e registra o que faz, para a equipe poder descansar.',
      nuke: { chip: 'Anti-nuke', title: 'Barra uma conta que enlouquece', desc: 'Se uma conta começa a apagar canais ou cargos, o bot intervém. Cada proteção tem seus próprios ajustes.' },
      raid: { chip: 'Anti-raid', title: 'Segura a enxurrada de contas novas', desc: 'Detecta uma onda de contas novas assim que começa e avisa a equipe. Um lockdown se ativa com um comando.' },
      automod: { chip: 'AutoMod', title: 'Limpa o chat sozinho', desc: 'Regras prontas, seus próprios filtros e strikes que escalam até uma punição, sem moderador vigiando.' },
    },
    discord: { eyebrow: 'No Discord', title: 'É isso que seus membros', em: 'veem no servidor', desc: 'Cards com a cara do Discord, no seu idioma, com os botões ali mesmo.' },
  },
};
