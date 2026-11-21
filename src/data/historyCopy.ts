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
  /** A short paragraph before the story: the tone of the page. */
  prologue: string;
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
    prologue: 'Most bots start with a plan. This one started with a date, a name that is no longer used and many servers that needed welcomes and levels. Years later, after hosts that ran short, a team that moved on to something else and a brand that had lost its reach, it is still here. This is how it got here.',
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
      { when: 'September 18, 2017', title: 'It begins', text: 'On September 18, 2017 a new Discord bot goes live. It is a multipurpose bot, like the ones of that time: welcomes, levels and the basics that every server asked for. It does not have the name you know today. It had another one, with a Japanese touch. Nobody knew yet how far it would go.' },
      { when: '2019', title: 'The one who fixes things', text: 'In 2019 I join the team as a support developer. My job is simple and it never stops: when something fails, I have to be there to fix it. I had been on Discord since 2016, so none of this was new to me, but being on the inside of a bot that thousands of servers depended on was something else.' },
      { when: '2021', title: 'Thirty thousand', text: 'Then comes the pandemic, and the bot grows like never before: in 2021 it reaches 30,000 servers. For a moment it looks like nothing can stop it.' },
      { when: '2022', title: 'The year everything cracked', text: 'In 2022 the problems begin. The bot has grown more than its host and its databases can hold, and we are running short of both. I put my own money into it, because letting it fall was not an option for me. And I had an idea: that the bot work with partners. That is how the partnerships began, and they helped it keep going.' },
      { when: '2023', title: 'Silence', text: 'In 2023 the updates stop. Discord keeps changing, adding something new every few months, and the bot does not follow: the people who led it had started building a new project, and the bot was left without anyone at the helm. It still worked, but nobody was making it grow.' },
      { when: '2024', title: 'The doors close', text: 'In 2024 the doors close. The old direction comes to an end and, all of a sudden, the question lands on me: I am the owner. What do we do now? The brand had lost most of its reach, and I could have tried to hold on to it. I decided to leave it behind and begin a new one.' },
      { when: '2025', title: 'Testing the ground', text: 'Around May of 2025 I make a replacement for the 2017 bot. It was known as Peto One, also called Bli. It was not Petto yet, but it was already something of mine, and the first step of everything that came after.' },
      { when: 'April 19, 2026', title: 'Petto', text: 'On April 19, 2026 the bot is born with the name you know: Petto. It is not a patch over something old, it is a new bot, built with everything learned along these years.', note: 'I did not build it on top of the 2017 bot: that one already had its own servers, and starting over on it did not seem right. Petto is a new bot.' },
      { when: 'August 2026', title: 'A home on the web', text: 'In August 2026 the website arrives, and Petto gets a home of its own: a place where you can see what it does and set it up. From there, everything grows.' },
    ],
    code: { title: 'The code', text: 'The code I received was written in Go. I rewrote its main parts (levels, welcomes and the embed system) and started adding things to it. It was not the only time: the bot has been rebuilt five times, two by the first team and three by me.' },
    why: { title: 'Why Petto', text: 'The first bot had a Japanese style, so when I had to choose a name I wanted to keep a bit of that. Petto sounds Japanese and also a little Italian, and to me it is a pretty word. That is why Petto.' },
    today: { title: 'Petto today', text: 'Nine years after that day in September, there is still a bot, a team and a person who stayed. I have been in the team since 2019 and I have led it since 2024. This story is not over: it is still being written, one update at a time. Thank you for being here.', sign: 'Liam', add: 'Add to Discord', team: 'Meet the team' },
  },
  es: {
    name: 'Historia de Petto',
    navDesc: 'De dónde viene Petto: 2017, 2026 y todo lo que pasó en medio.',
    description: 'La marca nació en 2017, el bot que agregas hoy se creó en abril de 2026 y esta web en agosto de 2026. Esta es la historia de en medio, contada por quien lidera Petto.',
    h1: 'La historia de Petto',
    lede: 'Por qué la web dice 2017 si el bot que agregas hoy se creó en 2026. Esta es la historia de en medio, contada por quien lidera Petto.',
    prologue: 'La mayoría de los bots empiezan con un plan. Este empezó con una fecha, un nombre que ya no se usa y muchos servidores que necesitaban bienvenidas y niveles. Años después, tras hosts que se quedaron cortos, un equipo que se fue a otro proyecto y una marca que había perdido su alcance, sigue aquí. Así fue como llegó hasta aquí.',
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
      { when: '18 de septiembre de 2017', title: 'Empieza todo', text: 'El 18 de septiembre de 2017 sale al aire un bot nuevo de Discord. Es un bot multifuncional, de los de esa época: bienvenidas, niveles y lo básico que pedía cualquier servidor. No tenía el nombre que conoces hoy. Tenía otro, con un toque japonés. Nadie sabía todavía hasta dónde iba a llegar.' },
      { when: '2019', title: 'El que arregla las cosas', text: 'En 2019 me uno al equipo como desarrollador de soporte. Mi trabajo es simple y no para nunca: si algo falla, tengo que estar ahí para arreglarlo. Yo ya estaba en Discord desde 2016, así que nada de esto me era nuevo, pero estar por dentro de un bot del que dependían miles de servidores era otra cosa.' },
      { when: '2021', title: 'Treinta mil', text: 'Luego llega la pandemia y el bot crece como nunca: en 2021 llega a 30.000 servidores. Por un momento parece que nada lo puede detener.' },
      { when: '2022', title: 'El año en que todo se agrietó', text: 'En 2022 empiezan los problemas. El bot creció más de lo que aguantaban su host y sus bases de datos, y nos quedamos cortos de las dos cosas. Puse mi propio dinero, porque dejar que se cayera no era una opción para mí. Y tuve una idea: que el bot trabajara con partners. Así empezaron las alianzas, y ayudaron a que siguiera adelante.' },
      { when: '2023', title: 'Silencio', text: 'En 2023 las actualizaciones se detienen. Discord sigue cambiando, trae algo nuevo cada pocos meses, y el bot no lo sigue: quienes lo dirigían habían empezado a construir un proyecto nuevo y el bot quedó sin nadie al timón. Seguía funcionando, pero nadie lo hacía crecer.' },
      { when: '2024', title: 'Se cierran las puertas', text: 'En 2024 se cierran las puertas. La antigua dirección termina y, de pronto, la pregunta me cae a mí: soy el dueño. ¿Y ahora qué hacemos? La marca había perdido casi todo su alcance, y yo pude haber intentado aferrarme a ella. Decidí dejarla atrás y empezar una nueva.' },
      { when: '2025', title: 'Probando el terreno', text: 'Por mayo de 2025 hago un reemplazo del bot de 2017. Se conocía como Peto One, también llamado Bli. Todavía no era Petto, pero ya era algo mío, y el primer paso de todo lo que vino después.' },
      { when: '19 de abril de 2026', title: 'Petto', text: 'El 19 de abril de 2026 nace el bot con el nombre que conoces: Petto. No es un parche sobre algo viejo, es un bot nuevo, hecho con todo lo aprendido en estos años.', note: 'No lo construí sobre el bot de 2017: ese ya tenía sus propios servidores y empezar de nuevo encima de él no me parecía bien. Petto es un bot nuevo.' },
      { when: 'Agosto de 2026', title: 'Un hogar en la web', text: 'En agosto de 2026 llega la página web y Petto tiene un hogar propio: un lugar donde ver qué hace y configurarlo. Desde ahí, todo crece.' },
    ],
    code: { title: 'El código', text: 'El código que recibí estaba hecho en Go. Reescribí sus partes principales (niveles, bienvenidas y el sistema de embeds) y empecé a añadirle cosas. No fue la única vez: el bot se ha reconstruido cinco veces, dos por el primer equipo y tres por mí.' },
    why: { title: 'Por qué Petto', text: 'El primer bot tenía un estilo japonés, así que cuando tuve que elegir un nombre quise conservar un poco de eso. Petto suena japonés y también un poco italiano, y para mí es una palabra muy bonita. Por eso Petto.' },
    today: { title: 'Petto hoy', text: 'Nueve años después de aquel día de septiembre, sigue habiendo un bot, un equipo y alguien que se quedó. Estoy en el equipo desde 2019 y lo dirijo desde 2024. Esta historia no ha terminado: se sigue escribiendo, una actualización a la vez. Gracias por estar aquí.', sign: 'Liam', add: 'Añadir a Discord', team: 'Conocer al equipo' },
  },
  'pt-BR': {
    name: 'História do Petto',
    navDesc: 'De onde vem o Petto: 2017, 2026 e tudo o que aconteceu no meio.',
    description: 'A marca nasceu em 2017, o bot que você adiciona hoje foi criado em abril de 2026 e este site em agosto de 2026. Esta é a história do meio, contada por quem lidera o Petto.',
    h1: 'A história do Petto',
    lede: 'Por que o site diz 2017 se o bot que você adiciona hoje foi criado em 2026. Esta é a história do meio, contada por quem lidera o Petto.',
    prologue: 'A maioria dos bots começa com um plano. Este começou com uma data, um nome que já não se usa e muitos servidores que precisavam de boas-vindas e níveis. Anos depois, depois de hospedagens que ficaram curtas, uma equipe que seguiu para outro projeto e uma marca que tinha perdido o alcance, ele continua aqui. Foi assim que chegou até aqui.',
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
      { when: '18 de setembro de 2017', title: 'Tudo começa', text: 'Em 18 de setembro de 2017 entra no ar um bot novo do Discord. É um bot multifuncional, desses da época: boas-vindas, níveis e o básico que qualquer servidor pedia. Não tinha o nome que você conhece hoje. Tinha outro, com um toque japonês. Ninguém sabia ainda até onde ele iria.' },
      { when: '2019', title: 'Quem resolve as coisas', text: 'Em 2019 entro na equipe como desenvolvedor de suporte. Meu trabalho é simples e nunca para: se algo falha, tenho que estar lá para resolver. Eu já estava no Discord desde 2016, então nada disso era novo para mim, mas estar por dentro de um bot do qual milhares de servidores dependiam era outra coisa.' },
      { when: '2021', title: 'Trinta mil', text: 'Depois vem a pandemia e o bot cresce como nunca: em 2021 chega a 30.000 servidores. Por um momento parece que nada pode pará-lo.' },
      { when: '2022', title: 'O ano em que tudo rachou', text: 'Em 2022 começam os problemas. O bot cresceu mais do que sua hospedagem e seus bancos de dados aguentavam, e ficamos curtos nas duas coisas. Coloquei meu próprio dinheiro, porque deixar o bot cair não era uma opção para mim. E tive uma ideia: que o bot trabalhasse com parceiros. Assim começaram as parcerias, e elas ajudaram o bot a seguir em frente.' },
      { when: '2023', title: 'Silêncio', text: 'Em 2023 as atualizações param. O Discord continua mudando, traz algo novo a cada poucos meses, e o bot não acompanha: quem o dirigia tinha começado a construir um projeto novo e o bot ficou sem ninguém no leme. Continuava funcionando, mas ninguém o fazia crescer.' },
      { when: '2024', title: 'As portas se fecham', text: 'Em 2024 as portas se fecham. A antiga direção termina e, de repente, a pergunta cai em mim: eu sou o dono. E agora, o que fazemos? A marca tinha perdido quase todo o seu alcance, e eu poderia ter tentado me agarrar a ela. Decidi deixá-la para trás e começar uma nova.' },
      { when: '2025', title: 'Testando o terreno', text: 'Por volta de maio de 2025 faço um substituto do bot de 2017. Era conhecido como Peto One, também chamado Bli. Ainda não era o Petto, mas já era algo meu, e o primeiro passo de tudo o que veio depois.' },
      { when: '19 de abril de 2026', title: 'Petto', text: 'Em 19 de abril de 2026 nasce o bot com o nome que você conhece: Petto. Não é um remendo sobre algo velho, é um bot novo, feito com tudo o que foi aprendido nesses anos.', note: 'Não o construí em cima do bot de 2017: aquele já tinha seus próprios servidores e começar de novo em cima dele não me parecia certo. O Petto é um bot novo.' },
      { when: 'Agosto de 2026', title: 'Um lar na web', text: 'Em agosto de 2026 chega o site e o Petto ganha um lar próprio: um lugar onde ver o que ele faz e configurá-lo. A partir daí, tudo cresce.' },
    ],
    code: { title: 'O código', text: 'O código que recebi estava feito em Go. Reescrevi suas partes principais (níveis, boas-vindas e o sistema de embeds) e comecei a acrescentar coisas. Não foi a única vez: o bot foi reconstruído cinco vezes, duas pela primeira equipe e três por mim.' },
    why: { title: 'Por que Petto', text: 'O primeiro bot tinha um estilo japonês, então, quando tive que escolher um nome, quis manter um pouco disso. Petto soa japonês e também um pouco italiano, e para mim é uma palavra muito bonita. Por isso Petto.' },
    today: { title: 'Petto hoje', text: 'Nove anos depois daquele dia de setembro, ainda existe um bot, uma equipe e alguém que ficou. Estou na equipe desde 2019 e a dirijo desde 2024. Esta história não terminou: continua sendo escrita, uma atualização de cada vez. Obrigado por estar aqui.', sign: 'Liam', add: 'Adicionar ao Discord', team: 'Conhecer a equipe' },
  },
};
