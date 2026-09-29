import type { ApplicationRole } from '../utils/applications';

interface FieldCopy { label: string; hint?: string; placeholder?: string }

export interface ApplicationCopy {
  title: string;
  eyebrow: string;
  h1: string;
  lede: string;
  choose: string;
  submit: string;
  back: string;
  required: string;
  optional: string;
  select: string;
  loggedInAs: string;
  loginHint: string;
  loginCta: string;
  privacy: string;
  success: string;
  successAgain: string;
  errors: Record<'missing' | 'invalid' | 'rate' | 'unavailable' | 'failed', string>;
  roles: Record<ApplicationRole, { title: string; desc: string; intro: string }>;
  fields: Record<ApplicationRole, Record<string, FieldCopy>>;
  options: Record<string, string>;
}

const en: ApplicationCopy = {
  title: 'Apply · Petto',
  eyebrow: 'Join Petto',
  h1: 'Work with the Petto team.',
  lede: 'Pick the role you are interested in and tell us about yourself. Every application is read by the team, and we reply on Discord.',
  choose: 'Choose an application',
  submit: 'Send application',
  back: 'Back to all applications',
  required: 'Required',
  optional: 'Optional',
  select: 'Choose one',
  loggedInAs: 'Sending as',
  loginHint: 'Log in with Discord so we can confirm who you are. You can also send it without logging in.',
  loginCta: 'Log in with Discord',
  privacy: 'Your answers go to a private channel of the Petto team and are only used to review your application. See the Privacy Policy for details.',
  success: 'Your application was sent. Thank you, the team will read it and reply on Discord.',
  successAgain: 'Send another application',
  errors: {
    missing: 'Some required answers are empty. Check the form and try again.',
    invalid: 'Some answers are not valid. Check the form and try again.',
    rate: 'You sent several applications in a short time. Wait a bit and try again.',
    unavailable: 'Applications are closed for the moment. Try again later.',
    failed: 'We could not deliver your application. Try again in a few minutes.',
  },
  roles: {
    developer: { title: 'Developer', desc: 'Help build the bot, the website, or the dashboard.', intro: 'Tell us what you build and what you would like to work on.' },
    manager: { title: 'Manager', desc: 'Help run the Petto community, its events, and its staff.', intro: 'Managers look after the community and coordinate the staff team.' },
    partner: { title: 'Partner', desc: 'Propose an alliance between your project and Petto.', intro: 'Tell us about your project and what you have in mind.' },
    staff: { title: 'Staff', desc: 'Moderate and give support in the Petto server.', intro: 'Staff members moderate the server and help people in support.' },
  },
  fields: {
    developer: {
      discord: { label: 'Discord username or ID', placeholder: 'username or 123456789012345678' },
      timezone: { label: 'Time zone or country' },
      languages: { label: 'Languages you speak', placeholder: 'English, Spanish' },
      stack: { label: 'Languages and tools you work with', placeholder: 'JavaScript, TypeScript, Astro, PostgreSQL' },
      links: { label: 'GitHub or portfolio links' },
      experience: { label: 'Your experience', hint: 'Projects you built, bots or sites you worked on, and for how long.' },
      interest: { label: 'What would you like to work on in Petto?' },
      hours: { label: 'Time you can give each week' },
    },
    manager: {
      discord: { label: 'Discord username or ID', placeholder: 'username or 123456789012345678' },
      timezone: { label: 'Time zone or country' },
      languages: { label: 'Languages you speak', placeholder: 'English, Spanish' },
      communities: { label: 'Communities you manage or managed', hint: 'Name, size, and what you did there.' },
      experience: { label: 'Your experience managing communities and teams' },
      ideas: { label: 'What would you improve or start in the Petto community?' },
      hours: { label: 'Time you can give each week' },
    },
    partner: {
      discord: { label: 'Discord username or ID of the contact person', placeholder: 'username or 123456789012345678' },
      project: { label: 'Project name' },
      kind: { label: 'Type of project' },
      link: { label: 'Invite or website link', placeholder: 'https://' },
      members: { label: 'Approximate number of members or users' },
      proposal: { label: 'What do you propose?', hint: 'What the partnership would look like.' },
      offer: { label: 'What can each side offer?' },
    },
    staff: {
      discord: { label: 'Discord username or ID', placeholder: 'username or 123456789012345678' },
      timezone: { label: 'Time zone or country' },
      languages: { label: 'Languages you speak', placeholder: 'English, Spanish' },
      position: { label: 'Position you want' },
      experience: { label: 'Your moderation or support experience', hint: 'Servers you moderated and what you did there.' },
      why: { label: 'Why do you want to join the staff?' },
      scenario: { label: 'Two members are in a heated argument and it keeps growing. What do you do?' },
      hours: { label: 'Time you can give each week' },
    },
  },
  options: {
    h1: 'Up to 5 hours',
    h2: '5 to 10 hours',
    h3: '10 to 20 hours',
    h4: 'More than 20 hours',
    server: 'Discord server',
    bot: 'Discord bot',
    website: 'Website or tool',
    other: 'Something else',
    moderator: 'Moderator',
    support: 'Support',
    either: 'Either one',
  },
};

const es: ApplicationCopy = {
  title: 'Postular · Petto',
  eyebrow: 'Únete a Petto',
  h1: 'Trabaja con el equipo de Petto.',
  lede: 'Elige el rol que te interesa y cuéntanos sobre ti. El equipo lee cada postulación y responde por Discord.',
  choose: 'Elige una postulación',
  submit: 'Enviar postulación',
  back: 'Volver a todas las postulaciones',
  required: 'Obligatorio',
  optional: 'Opcional',
  select: 'Elige una opción',
  loggedInAs: 'Enviando como',
  loginHint: 'Inicia sesión con Discord para que podamos confirmar quién eres. También puedes enviarla sin iniciar sesión.',
  loginCta: 'Iniciar sesión con Discord',
  privacy: 'Tus respuestas llegan a un canal privado del equipo de Petto y solo se usan para revisar tu postulación. Mira la Política de privacidad para más detalle.',
  success: 'Tu postulación fue enviada. Gracias, el equipo la leerá y responderá por Discord.',
  successAgain: 'Enviar otra postulación',
  errors: {
    missing: 'Hay respuestas obligatorias vacías. Revisa el formulario e inténtalo de nuevo.',
    invalid: 'Algunas respuestas no son válidas. Revisa el formulario e inténtalo de nuevo.',
    rate: 'Enviaste varias postulaciones en poco tiempo. Espera un rato e inténtalo de nuevo.',
    unavailable: 'Las postulaciones están cerradas por ahora. Inténtalo más tarde.',
    failed: 'No pudimos entregar tu postulación. Inténtalo de nuevo en unos minutos.',
  },
  roles: {
    developer: { title: 'Desarrollador', desc: 'Ayuda a construir el bot, el sitio web o el dashboard.', intro: 'Cuéntanos qué construyes y en qué te gustaría trabajar.' },
    manager: { title: 'Manager', desc: 'Ayuda a dirigir la comunidad de Petto, sus eventos y su staff.', intro: 'Los managers cuidan la comunidad y coordinan al equipo de staff.' },
    partner: { title: 'Partner', desc: 'Propón una alianza entre tu proyecto y Petto.', intro: 'Cuéntanos sobre tu proyecto y qué tienes en mente.' },
    staff: { title: 'Staff', desc: 'Modera y da soporte en el servidor de Petto.', intro: 'El staff modera el servidor y ayuda a las personas en soporte.' },
  },
  fields: {
    developer: {
      discord: { label: 'Usuario o ID de Discord', placeholder: 'usuario o 123456789012345678' },
      timezone: { label: 'Zona horaria o país' },
      languages: { label: 'Idiomas que hablas', placeholder: 'Español, inglés' },
      stack: { label: 'Lenguajes y herramientas que usas', placeholder: 'JavaScript, TypeScript, Astro, PostgreSQL' },
      links: { label: 'Enlaces de GitHub o portafolio' },
      experience: { label: 'Tu experiencia', hint: 'Proyectos que construiste, bots o sitios en los que trabajaste y por cuánto tiempo.' },
      interest: { label: '¿En qué te gustaría trabajar dentro de Petto?' },
      hours: { label: 'Tiempo que puedes dar cada semana' },
    },
    manager: {
      discord: { label: 'Usuario o ID de Discord', placeholder: 'usuario o 123456789012345678' },
      timezone: { label: 'Zona horaria o país' },
      languages: { label: 'Idiomas que hablas', placeholder: 'Español, inglés' },
      communities: { label: 'Comunidades que administras o administraste', hint: 'Nombre, tamaño y qué hacías allí.' },
      experience: { label: 'Tu experiencia administrando comunidades y equipos' },
      ideas: { label: '¿Qué mejorarías o empezarías en la comunidad de Petto?' },
      hours: { label: 'Tiempo que puedes dar cada semana' },
    },
    partner: {
      discord: { label: 'Usuario o ID de Discord de la persona de contacto', placeholder: 'usuario o 123456789012345678' },
      project: { label: 'Nombre del proyecto' },
      kind: { label: 'Tipo de proyecto' },
      link: { label: 'Enlace de invitación o del sitio', placeholder: 'https://' },
      members: { label: 'Número aproximado de miembros o usuarios' },
      proposal: { label: '¿Qué propones?', hint: 'Cómo sería la alianza.' },
      offer: { label: '¿Qué puede ofrecer cada parte?' },
    },
    staff: {
      discord: { label: 'Usuario o ID de Discord', placeholder: 'usuario o 123456789012345678' },
      timezone: { label: 'Zona horaria o país' },
      languages: { label: 'Idiomas que hablas', placeholder: 'Español, inglés' },
      position: { label: 'Puesto que quieres' },
      experience: { label: 'Tu experiencia en moderación o soporte', hint: 'Servidores que moderaste y qué hacías allí.' },
      why: { label: '¿Por qué quieres unirte al staff?' },
      scenario: { label: 'Dos miembros discuten de forma acalorada y la discusión sigue creciendo. ¿Qué haces?' },
      hours: { label: 'Tiempo que puedes dar cada semana' },
    },
  },
  options: {
    h1: 'Hasta 5 horas',
    h2: 'De 5 a 10 horas',
    h3: 'De 10 a 20 horas',
    h4: 'Más de 20 horas',
    server: 'Servidor de Discord',
    bot: 'Bot de Discord',
    website: 'Sitio web o herramienta',
    other: 'Otra cosa',
    moderator: 'Moderador',
    support: 'Soporte',
    either: 'Cualquiera de los dos',
  },
};

const ptBR: ApplicationCopy = {
  title: 'Candidatar-se · Petto',
  eyebrow: 'Junte-se ao Petto',
  h1: 'Trabalhe com a equipe do Petto.',
  lede: 'Escolha o cargo que interessa a você e conte sobre você. A equipe lê cada candidatura e responde pelo Discord.',
  choose: 'Escolha uma candidatura',
  submit: 'Enviar candidatura',
  back: 'Voltar para todas as candidaturas',
  required: 'Obrigatório',
  optional: 'Opcional',
  select: 'Escolha uma opção',
  loggedInAs: 'Enviando como',
  loginHint: 'Faça login com o Discord para que possamos confirmar quem você é. Você também pode enviar sem fazer login.',
  loginCta: 'Entrar com o Discord',
  privacy: 'Suas respostas vão para um canal privado da equipe do Petto e só são usadas para analisar sua candidatura. Veja a Política de privacidade para mais detalhes.',
  success: 'Sua candidatura foi enviada. Obrigado, a equipe vai lê-la e responder pelo Discord.',
  successAgain: 'Enviar outra candidatura',
  errors: {
    missing: 'Há respostas obrigatórias vazias. Confira o formulário e tente de novo.',
    invalid: 'Algumas respostas não são válidas. Confira o formulário e tente de novo.',
    rate: 'Você enviou várias candidaturas em pouco tempo. Espere um pouco e tente de novo.',
    unavailable: 'As candidaturas estão fechadas por enquanto. Tente novamente mais tarde.',
    failed: 'Não conseguimos entregar sua candidatura. Tente de novo em alguns minutos.',
  },
  roles: {
    developer: { title: 'Desenvolvedor', desc: 'Ajude a construir o bot, o site ou o dashboard.', intro: 'Conte o que você constrói e no que gostaria de trabalhar.' },
    manager: { title: 'Manager', desc: 'Ajude a conduzir a comunidade do Petto, seus eventos e sua staff.', intro: 'Os managers cuidam da comunidade e coordenam a equipe de staff.' },
    partner: { title: 'Parceiro', desc: 'Proponha uma parceria entre o seu projeto e o Petto.', intro: 'Conte sobre o seu projeto e o que você tem em mente.' },
    staff: { title: 'Staff', desc: 'Modere e dê suporte no servidor do Petto.', intro: 'A staff modera o servidor e ajuda as pessoas no suporte.' },
  },
  fields: {
    developer: {
      discord: { label: 'Usuário ou ID do Discord', placeholder: 'usuário ou 123456789012345678' },
      timezone: { label: 'Fuso horário ou país' },
      languages: { label: 'Idiomas que você fala', placeholder: 'Português, inglês' },
      stack: { label: 'Linguagens e ferramentas que você usa', placeholder: 'JavaScript, TypeScript, Astro, PostgreSQL' },
      links: { label: 'Links do GitHub ou portfólio' },
      experience: { label: 'Sua experiência', hint: 'Projetos que você construiu, bots ou sites em que trabalhou e por quanto tempo.' },
      interest: { label: 'No que você gostaria de trabalhar dentro do Petto?' },
      hours: { label: 'Tempo que você pode dar por semana' },
    },
    manager: {
      discord: { label: 'Usuário ou ID do Discord', placeholder: 'usuário ou 123456789012345678' },
      timezone: { label: 'Fuso horário ou país' },
      languages: { label: 'Idiomas que você fala', placeholder: 'Português, inglês' },
      communities: { label: 'Comunidades que você gerencia ou gerenciou', hint: 'Nome, tamanho e o que você fazia lá.' },
      experience: { label: 'Sua experiência gerenciando comunidades e equipes' },
      ideas: { label: 'O que você melhoraria ou começaria na comunidade do Petto?' },
      hours: { label: 'Tempo que você pode dar por semana' },
    },
    partner: {
      discord: { label: 'Usuário ou ID do Discord da pessoa de contato', placeholder: 'usuário ou 123456789012345678' },
      project: { label: 'Nome do projeto' },
      kind: { label: 'Tipo de projeto' },
      link: { label: 'Link de convite ou do site', placeholder: 'https://' },
      members: { label: 'Número aproximado de membros ou usuários' },
      proposal: { label: 'O que você propõe?', hint: 'Como seria a parceria.' },
      offer: { label: 'O que cada lado pode oferecer?' },
    },
    staff: {
      discord: { label: 'Usuário ou ID do Discord', placeholder: 'usuário ou 123456789012345678' },
      timezone: { label: 'Fuso horário ou país' },
      languages: { label: 'Idiomas que você fala', placeholder: 'Português, inglês' },
      position: { label: 'Cargo que você quer' },
      experience: { label: 'Sua experiência em moderação ou suporte', hint: 'Servidores que você moderou e o que fazia lá.' },
      why: { label: 'Por que você quer entrar para a staff?' },
      scenario: { label: 'Dois membros estão em uma discussão acalorada e ela continua crescendo. O que você faz?' },
      hours: { label: 'Tempo que você pode dar por semana' },
    },
  },
  options: {
    h1: 'Até 5 horas',
    h2: 'De 5 a 10 horas',
    h3: 'De 10 a 20 horas',
    h4: 'Mais de 20 horas',
    server: 'Servidor do Discord',
    bot: 'Bot do Discord',
    website: 'Site ou ferramenta',
    other: 'Outra coisa',
    moderator: 'Moderador',
    support: 'Suporte',
    either: 'Qualquer um dos dois',
  },
};

export const applicationCopy = { en, es, 'pt-BR': ptBR } as const;
