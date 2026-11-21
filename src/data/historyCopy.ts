// The words of the page "The history of Petto" (/history, /es/history, /pt-br/history), told in the first person by the person who leads Petto.
// Kept apart from the page so scripts/check-history-page.mjs can see that the three languages tell the same story, with the same dates, in the same order.
import type { Locale } from '../i18n/ui';

export interface HistoryStep { when: string; title: string; text: string; note?: string }
export interface HistoryCopy {
  /** The name of the page: the title of the tab, the menu and the footer. */
  name: string;
  navDesc: string;
  description: string;
  h1: string;
  lede: string;
  short: { title: string; items: { when: string; text: string }[]; note: string };
  numbers: { value: string; label: string }[];
  timelineTitle: string;
  steps: HistoryStep[];
  code: { title: string; text: string };
  why: { title: string; text: string };
  today: { title: string; text: string; sign: string; add: string; team: string };
}

export const HISTORY_COPY: Record<Locale, HistoryCopy> = {
  en: {
    name: 'Petto History',
    navDesc: 'Where Petto comes from: 2017, 2026 and everything in between.',
    description: 'The brand began in 2017, the bot you add today was made in April 2026 and this site in August 2026. This is the story in between, told by the person who leads Petto.',
    h1: 'The history of Petto',
    lede: 'Why the site says 2017 when the bot you add today was made in 2026. This is the story in between, told by the person who leads Petto.',
    short: {
      title: 'The short answer',
      items: [
        { when: 'September 18, 2017', text: 'The brand and the team begin, with a multipurpose Discord bot.' },
        { when: 'April 19, 2026', text: 'The bot you add today, Petto, is created.' },
        { when: 'August 2026', text: 'This website is created.' },
      ],
      note: 'That is why the footer says 2017 and the bot and the site say 2026: the brand is older than the bot you use today.',
    },
    numbers: [
      { value: '2017', label: 'the year it began' },
      { value: '30,000', label: 'servers, in 2021' },
      { value: '5', label: 'times rebuilt: 2 by the first team, 3 by me' },
      { value: '2019', label: 'the year I joined' },
    ],
    timelineTitle: 'Year by year',
    steps: [
      { when: 'September 18, 2017', title: 'It begins', text: 'The team is born with a multipurpose bot, like the ones of that time: welcomes, levels and the basics every server asked for. It had another name, with a Japanese touch.' },
      { when: '2019', title: 'I join the team', text: 'I join as a support developer: when something failed, I was there to fix it.' },
      { when: '2021', title: '30,000 servers', text: 'During the pandemic the bot reaches 30,000 servers.' },
      { when: '2022', title: 'The hard year', text: 'We run short of host and of databases. I put my own money into the bot and suggested that it work with partners, and that is how the partnerships began.' },
      { when: '2023', title: 'No more updates', text: 'Discord changes a lot and the bot stops receiving updates: the people who led it started working on a new project, and the bot was left without direction.' },
      { when: '2024', title: 'The direction ends', text: 'The doors close and the old direction ends. I become the owner and I ask myself what to do. The brand had lost much of its reach, so I decide to leave it behind and start a new one.' },
      { when: '2025', title: 'A replacement', text: 'Around May I make a replacement for the 2017 bot. It was known as Peto One, also called Bli.' },
      { when: 'April 19, 2026', title: 'Petto', text: 'Petto, the bot of today, is created.', note: 'I did not build it on top of the 2017 bot: that one already had its own servers, and starting over on it did not seem right. Petto is a new bot.' },
      { when: 'August 2026', title: 'This website', text: 'The website is created and, from there, everything grows.' },
    ],
    code: { title: 'The code', text: 'The code I received was written in Go. I rewrote its main parts (levels, welcomes and the embed system) and started adding things to it.' },
    why: { title: 'Why Petto', text: 'The first bot had a Japanese style, so I chose a name that sounds both Japanese and a little Italian, and that to me is a pretty word: Petto.' },
    today: { title: 'Petto today', text: 'I have been in the team since 2019 and I have led it since 2024. Thank you for being here.', sign: 'Liam', add: 'Add to Discord', team: 'Meet the team' },
  },
  es: {
    name: 'Historia de Petto',
    navDesc: 'De dónde viene Petto: 2017, 2026 y todo lo que pasó en medio.',
    description: 'La marca nació en 2017, el bot que agregas hoy se creó en abril de 2026 y esta web en agosto de 2026. Esta es la historia de en medio, contada por quien lidera Petto.',
    h1: 'La historia de Petto',
    lede: 'Por qué la web dice 2017 si el bot que agregas hoy se creó en 2026. Esta es la historia de en medio, contada por quien lidera Petto.',
    short: {
      title: 'La respuesta corta',
      items: [
        { when: '18 de septiembre de 2017', text: 'Nacen la marca y el equipo, con un bot multifuncional de Discord.' },
        { when: '19 de abril de 2026', text: 'Se crea el bot que agregas hoy, Petto.' },
        { when: 'Agosto de 2026', text: 'Se crea esta página web.' },
      ],
      note: 'Por eso el pie de página dice 2017 y el bot y la web dicen 2026: la marca es más antigua que el bot que usas hoy.',
    },
    numbers: [
      { value: '2017', label: 'el año en que empezó' },
      { value: '30.000', label: 'servidores, en 2021' },
      { value: '5', label: 'reconstrucciones: 2 del primer equipo, 3 mías' },
      { value: '2019', label: 'el año en que me uní' },
    ],
    timelineTitle: 'Año por año',
    steps: [
      { when: '18 de septiembre de 2017', title: 'Empieza todo', text: 'Nace el equipo con un bot multifuncional, de los de esa época: bienvenidas, niveles y lo básico que pedía cualquier servidor. Tenía otro nombre, con un toque japonés.' },
      { when: '2019', title: 'Me uno al equipo', text: 'Entro como desarrollador de soporte: si algo fallaba, yo estaba ahí para solucionarlo.' },
      { when: '2021', title: '30.000 servidores', text: 'En plena pandemia el bot llega a 30.000 servidores.' },
      { when: '2022', title: 'El año difícil', text: 'Nos quedamos cortos de host y de bases de datos. Puse mi propio dinero en el bot y propuse que trabajara con partners, y así empezaron las alianzas.' },
      { when: '2023', title: 'Sin más actualizaciones', text: 'Discord cambia mucho y el bot deja de recibir actualizaciones: quienes lo dirigían empezaron a trabajar en un proyecto nuevo y el bot quedó sin dirección.' },
      { when: '2024', title: 'Termina la dirección', text: 'Se cierran las puertas y la antigua dirección termina. Yo paso a ser el dueño y me pregunto qué hacer. La marca había perdido mucho alcance, así que decido dejarla atrás y crear una nueva.' },
      { when: '2025', title: 'Un reemplazo', text: 'Por mayo hago un reemplazo del bot de 2017. Se conocía como Peto One, también llamado Bli.' },
      { when: '19 de abril de 2026', title: 'Petto', text: 'Se crea Petto, el bot de hoy.', note: 'No lo construí sobre el bot de 2017: ese ya tenía sus propios servidores y empezar de nuevo encima de él no me parecía bien. Petto es un bot nuevo.' },
      { when: 'Agosto de 2026', title: 'Esta página web', text: 'Se crea la página web y, desde ahí, todo crece.' },
    ],
    code: { title: 'El código', text: 'El código que recibí estaba hecho en Go. Reescribí sus partes principales (niveles, bienvenidas y el sistema de embeds) y empecé a añadirle cosas.' },
    why: { title: 'Por qué Petto', text: 'El primer bot tenía un estilo japonés, así que elegí un nombre que suena japonés y un poco italiano, y que para mí es una palabra muy bonita: Petto.' },
    today: { title: 'Petto hoy', text: 'Estoy en el equipo desde 2019 y lo dirijo desde 2024. Gracias por estar aquí.', sign: 'Liam', add: 'Añadir a Discord', team: 'Conocer al equipo' },
  },
  'pt-BR': {
    name: 'História do Petto',
    navDesc: 'De onde vem o Petto: 2017, 2026 e tudo o que aconteceu no meio.',
    description: 'A marca nasceu em 2017, o bot que você adiciona hoje foi criado em abril de 2026 e este site em agosto de 2026. Esta é a história do meio, contada por quem lidera o Petto.',
    h1: 'A história do Petto',
    lede: 'Por que o site diz 2017 se o bot que você adiciona hoje foi criado em 2026. Esta é a história do meio, contada por quem lidera o Petto.',
    short: {
      title: 'A resposta curta',
      items: [
        { when: '18 de setembro de 2017', text: 'Nascem a marca e a equipe, com um bot multifuncional do Discord.' },
        { when: '19 de abril de 2026', text: 'É criado o bot que você adiciona hoje, o Petto.' },
        { when: 'Agosto de 2026', text: 'Este site é criado.' },
      ],
      note: 'Por isso o rodapé diz 2017 e o bot e o site dizem 2026: a marca é mais antiga que o bot que você usa hoje.',
    },
    numbers: [
      { value: '2017', label: 'o ano em que começou' },
      { value: '30.000', label: 'servidores, em 2021' },
      { value: '5', label: 'reconstruções: 2 da primeira equipe, 3 minhas' },
      { value: '2019', label: 'o ano em que entrei' },
    ],
    timelineTitle: 'Ano a ano',
    steps: [
      { when: '18 de setembro de 2017', title: 'Tudo começa', text: 'A equipe nasce com um bot multifuncional, desses da época: boas-vindas, níveis e o básico que qualquer servidor pedia. Tinha outro nome, com um toque japonês.' },
      { when: '2019', title: 'Entro na equipe', text: 'Entro como desenvolvedor de suporte: se algo falhava, eu estava lá para resolver.' },
      { when: '2021', title: '30.000 servidores', text: 'Em plena pandemia o bot chega a 30.000 servidores.' },
      { when: '2022', title: 'O ano difícil', text: 'Ficamos curtos de hospedagem e de bancos de dados. Coloquei meu próprio dinheiro no bot e propus que ele trabalhasse com parceiros, e assim começaram as parcerias.' },
      { when: '2023', title: 'Sem mais atualizações', text: 'O Discord muda muito e o bot deixa de receber atualizações: quem o dirigia começou a trabalhar em um projeto novo e o bot ficou sem direção.' },
      { when: '2024', title: 'A direção termina', text: 'As portas se fecham e a antiga direção termina. Eu passo a ser o dono e me pergunto o que fazer. A marca tinha perdido muito alcance, então decido deixá-la para trás e criar uma nova.' },
      { when: '2025', title: 'Um substituto', text: 'Por volta de maio faço um substituto do bot de 2017. Era conhecido como Peto One, também chamado Bli.' },
      { when: '19 de abril de 2026', title: 'Petto', text: 'É criado o Petto, o bot de hoje.', note: 'Não o construí em cima do bot de 2017: aquele já tinha seus próprios servidores e começar de novo em cima dele não me parecia certo. O Petto é um bot novo.' },
      { when: 'Agosto de 2026', title: 'Este site', text: 'O site é criado e, a partir daí, tudo cresce.' },
    ],
    code: { title: 'O código', text: 'O código que recebi estava feito em Go. Reescrevi suas partes principais (níveis, boas-vindas e o sistema de embeds) e comecei a acrescentar coisas.' },
    why: { title: 'Por que Petto', text: 'O primeiro bot tinha um estilo japonês, então escolhi um nome que soa japonês e um pouco italiano, e que para mim é uma palavra muito bonita: Petto.' },
    today: { title: 'Petto hoje', text: 'Estou na equipe desde 2019 e a dirijo desde 2024. Obrigado por estar aqui.', sign: 'Liam', add: 'Adicionar ao Discord', team: 'Conhecer a equipe' },
  },
};
