const f = (section, key, kind, required, max, min = 0, options) => ({ section, key, kind, required, max, min, options });
const hours = ["h1", "h2", "h3", "h4"];
const years = ["y0", "y1", "y2", "y3"];
const level = ["l0", "l1", "l2", "l3"];
const teamSize = ["t0", "t1", "t2", "t3"];
const applicationRoles = {
  developer: {
    color: 6220500,
    fields: [
      f("about", "discord", "text", true, 64, 2),
      f("about", "timezone", "text", true, 40, 2),
      f("about", "languages", "text", true, 100, 2),
      f("about", "hours", "select", true, 8, 0, hours),
      f("about", "schedule", "text", false, 200, 5),
      f("skills", "focus", "select", true, 12, 0, ["backend", "frontend", "fullstack", "bots", "data", "devops"]),
      f("skills", "years", "select", true, 8, 0, years),
      f("skills", "stack", "text", true, 200, 3),
      f("skills", "djs", "select", true, 8, 0, level),
      f("skills", "sql", "select", true, 8, 0, level),
      f("work", "experience", "textarea", true, 1e3, 120),
      f("work", "projects", "textarea", true, 1e3, 120),
      f("work", "links", "text", false, 300, 8),
      f("work", "opensource", "textarea", false, 800, 30),
      f("work", "teamwork", "textarea", true, 800, 100),
      f("technical", "qDesign", "textarea", true, 1e3, 150),
      f("technical", "qSecurity", "textarea", true, 1e3, 150),
      f("technical", "qDebug", "textarea", true, 1e3, 150),
      f("technical", "qReview", "textarea", true, 800, 100),
      f("motivation", "interest", "textarea", true, 800, 100),
      f("motivation", "first30", "textarea", true, 800, 100),
      f("confirm", "confirm", "checkbox", true, 3)
    ]
  },
  manager: {
    color: 16758892,
    fields: [
      f("about", "discord", "text", true, 64, 2),
      f("about", "timezone", "text", true, 40, 2),
      f("about", "languages", "text", true, 100, 2),
      f("about", "hours", "select", true, 8, 0, hours),
      f("about", "schedule", "text", false, 200, 5),
      f("experience", "years", "select", true, 8, 0, years),
      f("experience", "teamsize", "select", true, 8, 0, teamSize),
      f("experience", "communities", "textarea", true, 800, 100),
      f("experience", "experience", "textarea", true, 1e3, 120),
      f("experience", "tools", "text", true, 200, 3),
      f("experience", "events", "textarea", true, 800, 60),
      f("scenarios", "qConflict", "textarea", true, 1e3, 150),
      f("scenarios", "qCrisis", "textarea", true, 1e3, 150),
      f("scenarios", "qInactive", "textarea", true, 1e3, 120),
      f("scenarios", "qPolicy", "textarea", true, 1e3, 150),
      f("vision", "metrics", "textarea", true, 800, 100),
      f("vision", "ideas", "textarea", true, 800, 100),
      f("vision", "first30", "textarea", true, 800, 100),
      f("vision", "qDelegate", "textarea", true, 800, 100),
      f("confirm", "confirm", "checkbox", true, 3)
    ]
  },
  partner: {
    color: 8624639,
    fields: [
      f("project", "discord", "text", true, 64, 2),
      f("project", "project", "text", true, 100, 2),
      f("project", "kind", "select", true, 8, 0, ["server", "bot", "website", "other"]),
      f("project", "link", "url", true, 300),
      f("project", "members", "number", false, 9),
      f("project", "proposal", "textarea", true, 1e3, 60),
      f("project", "offer", "textarea", false, 800, 20),
      f("confirm", "confirm", "checkbox", true, 3)
    ]
  },
  staff: {
    color: 16224179,
    fields: [
      f("about", "discord", "text", true, 64, 2),
      f("about", "timezone", "text", false, 40, 2),
      f("about", "position", "select", true, 12, 0, ["moderator", "support", "either"]),
      f("about", "hours", "select", true, 8, 0, hours),
      f("about", "experience", "textarea", true, 800, 60),
      f("about", "why", "textarea", true, 600, 40),
      f("confirm", "confirm", "checkbox", true, 3)
    ]
  },
  translator: {
    color: 16758892,
    fields: [
      f("about", "discord", "text", true, 64, 2),
      f("about", "timezone", "text", true, 40, 2),
      f("about", "language", "select", true, 8, 0, ["tlEs", "tlPt", "tlBoth", "tlOther"]),
      f("about", "otherLanguage", "text", false, 80, 2),
      f("about", "level", "select", true, 8, 0, ["nv0", "nv1", "nv2"]),
      f("about", "hours", "select", true, 8, 0, hours),
      f("about", "experience", "textarea", false, 600, 20),
      f("work", "sample1", "textarea", true, 600, 30),
      f("work", "sample2", "textarea", true, 600, 30),
      f("work", "why", "textarea", true, 600, 40),
      f("confirm", "confirm", "checkbox", true, 3)
    ]
  }
};
const applicationRoleList = Object.keys(applicationRoles);
function isApplicationRole(value) {
  return typeof value === "string" && value in applicationRoles;
}
function clean(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").replace(/\r\n/g, "\n").trim().slice(0, max);
}
const DISCORD_HANDLE = /^(@?[A-Za-z0-9_.]{2,32}|\d{17,20})$/;
function checkField(field, raw) {
  if (!raw) return field.required ? "missing" : null;
  if (field.kind === "select") return field.options?.includes(raw) ? null : "select";
  if (field.kind === "number") return /^\d{1,9}$/.test(raw) ? null : "number";
  if (field.kind === "url") {
    try {
      const url = new URL(raw);
      return url.protocol === "https:" || url.protocol === "http:" ? null : "url";
    } catch {
      return "url";
    }
  }
  if (field.key === "discord" && !DISCORD_HANDLE.test(raw)) return "discord";
  if (field.min > 0 && raw.length < field.min) return "short";
  return null;
}
function readAnswers(role, form) {
  const answers = {};
  const errors = {};
  for (const field of applicationRoles[role].fields) {
    if (field.kind === "checkbox") {
      if (form.get(field.key) !== null) answers[field.key] = "yes";
      else if (field.required) errors[field.key] = "missing";
      continue;
    }
    const raw = clean(form.get(field.key), field.max);
    const problem = checkField(field, raw);
    if (problem) errors[field.key] = problem;
    else if (raw) answers[field.key] = raw;
  }
  if (role === "translator" && answers.language === "tlOther" && !answers.otherLanguage && !errors.otherLanguage) errors.otherLanguage = "missing";
  return Object.keys(errors).length > 0 ? { errors } : { answers };
}
const attempts = /* @__PURE__ */ new Map();
const WINDOW_MS = 30 * 60 * 1e3;
const MAX_ATTEMPTS = 3;
function tooManyAttempts(visitor) {
  const now = Date.now();
  const recent = (attempts.get(visitor) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(visitor, recent);
    return true;
  }
  recent.push(now);
  attempts.set(visitor, recent);
  if (attempts.size > 5e3) {
    for (const [key, times] of attempts) if (times.every((t) => now - t >= WINDOW_MS)) attempts.delete(key);
  }
  return false;
}
const EMBED_BUDGET = 5e3;
function chunkFields(fields) {
  const chunks = [];
  let current = [];
  let size = 0;
  for (const field of fields) {
    const cost = field.name.length + field.value.length;
    if (current.length > 0 && (size + cost > EMBED_BUDGET || current.length >= 25)) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(field);
    size += cost;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}
async function sendApplication(webhookUrl, role, answers, applicant) {
  const fields = applicationRoles[role].fields.filter((f2) => answers[f2.key] && f2.kind !== "checkbox").map((f2) => ({ name: (applicant.labels[f2.key] ?? f2.key).slice(0, 256), value: answers[f2.key].slice(0, 1024), inline: f2.kind !== "textarea" }));
  const identity = applicant.verifiedId ? `${applicant.verifiedLabel}: <@${applicant.verifiedId}> (${applicant.verifiedId})${applicant.username ? `, ${applicant.username}` : ""}` : applicant.unverifiedLabel;
  const chunks = chunkFields(fields);
  for (let index = 0; index < chunks.length; index += 1) {
    const suffix = chunks.length > 1 ? ` (${index + 1}/${chunks.length})` : "";
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Petto Applications",
          allowed_mentions: { parse: [] },
          embeds: [{
            title: `${applicant.title}${suffix}`.slice(0, 256),
            description: index === 0 ? identity.slice(0, 2e3) : void 0,
            color: applicationRoles[role].color,
            fields: chunks[index],
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }]
        })
      });
      if (!response.ok) {
        console.error("[apply] webhook answered", response.status);
        return false;
      }
    } catch (error) {
      console.error("[apply] webhook request failed", error);
      return false;
    }
  }
  return chunks.length > 0;
}

const en = {
  title: "Apply · Petto",
  eyebrow: "Join Petto",
  h1: "Work with the Petto team.",
  lede: "Pick the role you are interested in and tell us about yourself. Every application is read by the team, and we reply on Discord. Developer and Manager applications are long on purpose, because Petto is a big project and these roles carry a lot of responsibility.",
  choose: "Choose an application",
  submit: "Send application",
  back: "Back to all applications",
  required: "Required",
  optional: "Optional",
  select: "Choose one",
  loggedInAs: "Sending as",
  loginHint: "Log in with Discord so we can confirm who you are. You can also send it without logging in.",
  loginCta: "Log in with Discord",
  privacy: "Your answers go to a private channel of the Petto team and are only used to review your application. See the Privacy Policy for details.",
  privacyLink: "Privacy Policy",
  success: "Your application was sent. Thank you, the team will read it and reply on Discord.",
  validation: {
    missing: "This answer is required.",
    short: "Write at least {min} characters. You have {n}.",
    select: "Choose one of the options.",
    number: "Use numbers only.",
    url: "Enter a full link that starts with https://",
    discord: "Enter your Discord username, or your numeric user ID.",
    confirm: "You need to accept this to send the application.",
    summary: "Check the answers marked in red before sending.",
    counter: "{n} / {min} minimum",
    sending: "Sending...",
    network: "We could not reach the server. Check your connection and try again."
  },
  errors: {
    missing: "Some required answers are empty. Check the form and try again.",
    invalid: "Some answers are not valid. Check the form and try again.",
    rate: "You sent several applications in a short time. Wait a bit and try again.",
    unavailable: "Applications are closed for the moment. Try again later.",
    failed: "We could not deliver your application. Try again in a few minutes."
  },
  roles: {
    developer: { title: "Developer", desc: "Help build the bot, the website, or the dashboard.", intro: "Tell us what you build, how you think, and what you would like to work on.", time: "Takes about 25 minutes" },
    manager: { title: "Manager", desc: "Help run the Petto community, its events, and its staff.", intro: "Managers look after the community and coordinate the staff team.", time: "Takes about 25 minutes" },
    partner: { title: "Partner", desc: "Propose an alliance between your project and Petto.", intro: "Tell us about your project and what you have in mind.", time: "Takes about 5 minutes" },
    staff: { title: "Staff", desc: "Moderate and give support in the Petto server.", intro: "Staff members moderate the server and help people in support.", time: "Takes about 5 minutes" },
    translator: { title: "Translator", desc: "Help translate Petto into Spanish and Brazilian Portuguese.", intro: "Tell us which language you translate to and show us a short sample.", time: "Takes about 10 minutes" }
  },
  sections: {
    developer: { about: "About you", skills: "Skills", work: "Your work", technical: "Technical questions", motivation: "Motivation", confirm: "Before you send" },
    manager: { about: "About you", experience: "Experience", scenarios: "Scenarios", vision: "Vision and plan", confirm: "Before you send" },
    partner: { project: "Your project", confirm: "Before you send" },
    staff: { about: "About you", confirm: "Before you send" },
    translator: { about: "About you", work: "Your translation", confirm: "Before you send" }
  },
  fields: {
    developer: {
      discord: { label: "Discord username or ID", placeholder: "username or 123456789012345678" },
      timezone: { label: "Time zone or country" },
      languages: { label: "Languages you speak", placeholder: "English, Spanish" },
      hours: { label: "Time you can give each week" },
      schedule: { label: "Days and times you are usually online" },
      focus: { label: "Your main area" },
      years: { label: "Years of programming experience" },
      stack: { label: "Languages and tools you work with", placeholder: "JavaScript, TypeScript, Astro, PostgreSQL" },
      djs: { label: "Experience with the Discord API (discord.js or similar)" },
      sql: { label: "Experience with PostgreSQL or SQL databases" },
      experience: { label: "Your work experience", hint: "Jobs, freelance work, or long personal projects, and for how long." },
      projects: { label: "Your best projects", hint: "Two or three projects, with links if you can, and what you did in each." },
      links: { label: "GitHub or portfolio links" },
      opensource: { label: "Open source or community contributions" },
      teamwork: { label: "How do you work with others?", hint: "Code review, Git workflow, and how you handle a disagreement about a change." },
      qDesign: { label: "You are building a moderation command that runs in thousands of servers. How do you handle permissions, rate limits, and errors?" },
      qSecurity: { label: "How do you protect tokens, secrets, and user data in a bot and its web dashboard?" },
      qDebug: { label: "A command works on your machine but fails in production, only in some servers. How do you find the cause?" },
      qReview: { label: "What do you check when you review someone else’s pull request?" },
      interest: { label: "What would you like to work on in Petto, and why?" },
      first30: { label: "What could you deliver in your first 30 days?" },
      confirm: { label: "I confirm my answers are true, and I accept the Terms of Service and the Privacy Policy." }
    },
    manager: {
      discord: { label: "Discord username or ID", placeholder: "username or 123456789012345678" },
      timezone: { label: "Time zone or country" },
      languages: { label: "Languages you speak", placeholder: "English, Spanish" },
      hours: { label: "Time you can give each week" },
      schedule: { label: "Days and times you are usually online" },
      years: { label: "Years managing communities" },
      teamsize: { label: "Largest team you have led" },
      communities: { label: "Communities you manage or managed", hint: "Name, size, and what you did there." },
      experience: { label: "What did you do to grow those communities and keep them healthy?" },
      tools: { label: "Tools you use to manage communities", placeholder: "Discord bots, ticket systems, spreadsheets, Notion" },
      events: { label: "Events or programs you organized" },
      qConflict: { label: "A staff member and a long-time member are in a public conflict, and both feel they were treated unfairly. What do you do?" },
      qCrisis: { label: "A raid hits the server and private information about a member starts to spread. Walk us through your first hour." },
      qInactive: { label: "Several staff members stop being active. How do you find out why, and what do you do?" },
      qPolicy: { label: "Write three rules you would add to a server of 50,000 members, and explain how you would enforce them fairly." },
      metrics: { label: "How do you measure whether a community is healthy?" },
      ideas: { label: "What would you improve or start in the Petto community?" },
      first30: { label: "What is your plan for your first 30 days?" },
      qDelegate: { label: "How do you train new staff and delegate work without losing quality?" },
      confirm: { label: "I confirm my answers are true, and I accept the Terms of Service and the Privacy Policy." }
    },
    partner: {
      discord: { label: "Discord username or ID of the contact person", placeholder: "username or 123456789012345678" },
      project: { label: "Project name" },
      kind: { label: "Type of project" },
      link: { label: "Invite or website link", placeholder: "https://" },
      members: { label: "Approximate number of members or users" },
      proposal: { label: "What do you propose?", hint: "What the partnership would look like." },
      offer: { label: "What can each side offer?" },
      confirm: { label: "I confirm my answers are true, and I accept the Terms of Service and the Privacy Policy." }
    },
    staff: {
      discord: { label: "Discord username or ID", placeholder: "username or 123456789012345678" },
      timezone: { label: "Time zone or country" },
      position: { label: "Position you want" },
      hours: { label: "Time you can give each week" },
      experience: { label: "Your moderation or support experience", hint: "Servers you moderated and what you did there." },
      why: { label: "Why do you want to join the staff?" },
      confirm: { label: "I confirm my answers are true, and I accept the Terms of Service and the Privacy Policy." }
    },
    translator: {
      discord: { label: "Discord username or ID", placeholder: "username or 123456789012345678" },
      timezone: { label: "Time zone or country" },
      language: { label: "Language you translate into" },
      otherLanguage: { label: "Which language, if you chose another", hint: "Only if you chose Another language: tell us which one.", placeholder: "Hindi, French, German..." },
      level: { label: "Your level in that language" },
      hours: { label: "Time you can give each week" },
      experience: { label: "Translation experience", hint: "Bots, games, apps, communities or studies. Optional." },
      sample1: { label: "Translate this message into your language", hint: "Petto could not ban {user}: I am missing the Ban Members permission. Move my role above theirs and try again." },
      sample2: { label: "Now translate this one, keep the same friendly tone", hint: "Welcome to {server}, {user}! You are member number {count}. Say hi in the chat!" },
      why: { label: "Why do you want to translate Petto?" },
      confirm: { label: "I confirm my answers are true, and I accept the Terms of Service and the Privacy Policy." }
    }
  },
  options: {
    h1: "Up to 5 hours",
    h2: "5 to 10 hours",
    h3: "10 to 20 hours",
    h4: "More than 20 hours",
    y0: "Less than 1 year",
    y1: "1 to 3 years",
    y2: "3 to 5 years",
    y3: "More than 5 years",
    l0: "None",
    l1: "Basic",
    l2: "Comfortable",
    l3: "Advanced",
    t0: "I have not led a team",
    t1: "Up to 5 people",
    t2: "6 to 15 people",
    t3: "More than 15 people",
    backend: "Backend",
    frontend: "Frontend",
    fullstack: "Full stack",
    bots: "Discord bots",
    data: "Databases and data",
    devops: "Infrastructure and DevOps",
    server: "Discord server",
    bot: "Discord bot",
    website: "Website or tool",
    other: "Something else",
    moderator: "Moderator",
    support: "Support",
    either: "Either one",
    tlEs: "Spanish (Latin America)",
    tlPt: "Portuguese (Brazil)",
    tlBoth: "Both",
    tlOther: "Another language",
    nv0: "Native",
    nv1: "Fluent",
    nv2: "Advanced"
  }
};
const es = {
  title: "Postular · Petto",
  eyebrow: "Únete a Petto",
  h1: "Trabaja con el equipo de Petto.",
  lede: "Elige el rol que te interesa y cuéntanos sobre ti. El equipo lee cada postulación y responde por Discord. Las postulaciones de Desarrollador y Manager son largas a propósito, porque Petto es un proyecto grande y estos roles llevan mucha responsabilidad.",
  choose: "Elige una postulación",
  submit: "Enviar postulación",
  back: "Volver a todas las postulaciones",
  required: "Obligatorio",
  optional: "Opcional",
  select: "Elige una opción",
  loggedInAs: "Enviando como",
  loginHint: "Inicia sesión con Discord para que podamos confirmar quién eres. También puedes enviarla sin iniciar sesión.",
  loginCta: "Iniciar sesión con Discord",
  privacy: "Tus respuestas llegan a un canal privado del equipo de Petto y solo se usan para revisar tu postulación. Mira la Política de privacidad para más detalle.",
  privacyLink: "Política de privacidad",
  success: "Tu postulación fue enviada. Gracias, el equipo la leerá y responderá por Discord.",
  validation: {
    missing: "Esta respuesta es obligatoria.",
    short: "Escribe al menos {min} caracteres. Llevas {n}.",
    select: "Elige una de las opciones.",
    number: "Usa solo números.",
    url: "Escribe un enlace completo que empiece por https://",
    discord: "Escribe tu nombre de usuario de Discord, o tu ID numérico.",
    confirm: "Debes aceptar esto para enviar la postulación.",
    summary: "Revisa las respuestas marcadas en rojo antes de enviar.",
    counter: "{n} / {min} mínimo",
    sending: "Enviando...",
    network: "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo."
  },
  errors: {
    missing: "Hay respuestas obligatorias vacías. Revisa el formulario e inténtalo de nuevo.",
    invalid: "Algunas respuestas no son válidas. Revisa el formulario e inténtalo de nuevo.",
    rate: "Enviaste varias postulaciones en poco tiempo. Espera un rato e inténtalo de nuevo.",
    unavailable: "Las postulaciones están cerradas por ahora. Inténtalo más tarde.",
    failed: "No pudimos entregar tu postulación. Inténtalo de nuevo en unos minutos."
  },
  roles: {
    developer: { title: "Desarrollador", desc: "Ayuda a construir el bot, el sitio web o el dashboard.", intro: "Cuéntanos qué construyes, cómo piensas y en qué te gustaría trabajar.", time: "Toma unos 25 minutos" },
    manager: { title: "Manager", desc: "Ayuda a dirigir la comunidad de Petto, sus eventos y su staff.", intro: "Los managers cuidan la comunidad y coordinan al equipo de staff.", time: "Toma unos 25 minutos" },
    partner: { title: "Partner", desc: "Propón una alianza entre tu proyecto y Petto.", intro: "Cuéntanos sobre tu proyecto y qué tienes en mente.", time: "Toma unos 5 minutos" },
    staff: { title: "Staff", desc: "Modera y da soporte en el servidor de Petto.", intro: "El staff modera el servidor y ayuda a las personas en soporte.", time: "Toma unos 5 minutos" },
    translator: { title: "Traductor", desc: "Ayuda a traducir Petto al español y al portugués de Brasil.", intro: "Cuéntanos a qué idioma traduces y muéstranos una muestra corta.", time: "Toma unos 10 minutos" }
  },
  sections: {
    developer: { about: "Sobre ti", skills: "Habilidades", work: "Tu trabajo", technical: "Preguntas técnicas", motivation: "Motivación", confirm: "Antes de enviar" },
    manager: { about: "Sobre ti", experience: "Experiencia", scenarios: "Escenarios", vision: "Visión y plan", confirm: "Antes de enviar" },
    partner: { project: "Tu proyecto", confirm: "Antes de enviar" },
    staff: { about: "Sobre ti", confirm: "Antes de enviar" },
    translator: { about: "Sobre ti", work: "Tu traducción", confirm: "Antes de enviar" }
  },
  fields: {
    developer: {
      discord: { label: "Usuario o ID de Discord", placeholder: "usuario o 123456789012345678" },
      timezone: { label: "Zona horaria o país" },
      languages: { label: "Idiomas que hablas", placeholder: "Español, inglés" },
      hours: { label: "Tiempo que puedes dar cada semana" },
      schedule: { label: "Días y horas en los que sueles estar conectado" },
      focus: { label: "Tu área principal" },
      years: { label: "Años de experiencia programando" },
      stack: { label: "Lenguajes y herramientas que usas", placeholder: "JavaScript, TypeScript, Astro, PostgreSQL" },
      djs: { label: "Experiencia con la API de Discord (discord.js o similar)" },
      sql: { label: "Experiencia con PostgreSQL o bases de datos SQL" },
      experience: { label: "Tu experiencia laboral", hint: "Empleos, trabajos freelance o proyectos personales largos, y por cuánto tiempo." },
      projects: { label: "Tus mejores proyectos", hint: "Dos o tres proyectos, con enlaces si puedes, y qué hiciste en cada uno." },
      links: { label: "Enlaces de GitHub o portafolio" },
      opensource: { label: "Contribuciones a código abierto o a comunidades" },
      teamwork: { label: "¿Cómo trabajas con otras personas?", hint: "Revisión de código, flujo de Git y cómo manejas un desacuerdo sobre un cambio." },
      qDesign: { label: "Estás creando un comando de moderación que corre en miles de servidores. ¿Cómo manejas los permisos, los límites de tasa y los errores?" },
      qSecurity: { label: "¿Cómo proteges tokens, secretos y datos de usuarios en un bot y su dashboard web?" },
      qDebug: { label: "Un comando funciona en tu equipo pero falla en producción, solo en algunos servidores. ¿Cómo encuentras la causa?" },
      qReview: { label: "¿Qué revisas cuando evalúas el pull request de otra persona?" },
      interest: { label: "¿En qué te gustaría trabajar dentro de Petto y por qué?" },
      first30: { label: "¿Qué podrías entregar en tus primeros 30 días?" },
      confirm: { label: "Confirmo que mis respuestas son verdaderas y acepto los Términos de servicio y la Política de privacidad." }
    },
    manager: {
      discord: { label: "Usuario o ID de Discord", placeholder: "usuario o 123456789012345678" },
      timezone: { label: "Zona horaria o país" },
      languages: { label: "Idiomas que hablas", placeholder: "Español, inglés" },
      hours: { label: "Tiempo que puedes dar cada semana" },
      schedule: { label: "Días y horas en los que sueles estar conectado" },
      years: { label: "Años administrando comunidades" },
      teamsize: { label: "El equipo más grande que has liderado" },
      communities: { label: "Comunidades que administras o administraste", hint: "Nombre, tamaño y qué hacías allí." },
      experience: { label: "¿Qué hiciste para hacer crecer esas comunidades y mantenerlas sanas?" },
      tools: { label: "Herramientas que usas para administrar comunidades", placeholder: "Bots de Discord, sistemas de tickets, hojas de cálculo, Notion" },
      events: { label: "Eventos o programas que organizaste" },
      qConflict: { label: "Un miembro del staff y un miembro de mucho tiempo tienen un conflicto público, y ambos sienten que los trataron de forma injusta. ¿Qué haces?" },
      qCrisis: { label: "Un raid golpea el servidor y empieza a circular información privada de un miembro. Cuéntanos tu primera hora." },
      qInactive: { label: "Varias personas del staff dejan de estar activas. ¿Cómo averiguas por qué y qué haces?" },
      qPolicy: { label: "Escribe tres reglas que añadirías a un servidor de 50.000 miembros y explica cómo las aplicarías de forma justa." },
      metrics: { label: "¿Cómo mides si una comunidad está sana?" },
      ideas: { label: "¿Qué mejorarías o empezarías en la comunidad de Petto?" },
      first30: { label: "¿Cuál es tu plan para tus primeros 30 días?" },
      qDelegate: { label: "¿Cómo capacitas a personal nuevo y delegas trabajo sin perder calidad?" },
      confirm: { label: "Confirmo que mis respuestas son verdaderas y acepto los Términos de servicio y la Política de privacidad." }
    },
    partner: {
      discord: { label: "Usuario o ID de Discord de la persona de contacto", placeholder: "usuario o 123456789012345678" },
      project: { label: "Nombre del proyecto" },
      kind: { label: "Tipo de proyecto" },
      link: { label: "Enlace de invitación o del sitio", placeholder: "https://" },
      members: { label: "Número aproximado de miembros o usuarios" },
      proposal: { label: "¿Qué propones?", hint: "Cómo sería la alianza." },
      offer: { label: "¿Qué puede ofrecer cada parte?" },
      confirm: { label: "Confirmo que mis respuestas son verdaderas y acepto los Términos de servicio y la Política de privacidad." }
    },
    staff: {
      discord: { label: "Usuario o ID de Discord", placeholder: "usuario o 123456789012345678" },
      timezone: { label: "Zona horaria o país" },
      position: { label: "Puesto que quieres" },
      hours: { label: "Tiempo que puedes dar cada semana" },
      experience: { label: "Tu experiencia en moderación o soporte", hint: "Servidores que moderaste y qué hacías allí." },
      why: { label: "¿Por qué quieres unirte al staff?" },
      confirm: { label: "Confirmo que mis respuestas son verdaderas y acepto los Términos de servicio y la Política de privacidad." }
    },
    translator: {
      discord: { label: "Usuario o ID de Discord", placeholder: "usuario o 123456789012345678" },
      timezone: { label: "Zona horaria o país" },
      language: { label: "Idioma al que traduces" },
      otherLanguage: { label: "Qué idioma, si elegiste otro", hint: "Solo si elegiste Otro idioma: dinos cuál.", placeholder: "Hindi, francés, alemán..." },
      level: { label: "Tu nivel en ese idioma" },
      hours: { label: "Tiempo que puedes dar cada semana" },
      experience: { label: "Experiencia traduciendo", hint: "Bots, juegos, apps, comunidades o estudios. Opcional." },
      sample1: { label: "Traduce este mensaje a tu idioma", hint: "Petto could not ban {user}: I am missing the Ban Members permission. Move my role above theirs and try again." },
      sample2: { label: "Ahora traduce este, con el mismo tono cercano", hint: "Welcome to {server}, {user}! You are member number {count}. Say hi in the chat!" },
      why: { label: "¿Por qué quieres traducir Petto?" },
      confirm: { label: "Confirmo que mis respuestas son verdaderas y acepto los Términos del servicio y la Política de privacidad." }
    }
  },
  options: {
    h1: "Hasta 5 horas",
    h2: "De 5 a 10 horas",
    h3: "De 10 a 20 horas",
    h4: "Más de 20 horas",
    y0: "Menos de 1 año",
    y1: "De 1 a 3 años",
    y2: "De 3 a 5 años",
    y3: "Más de 5 años",
    l0: "Ninguna",
    l1: "Básica",
    l2: "Cómoda",
    l3: "Avanzada",
    t0: "No he liderado un equipo",
    t1: "Hasta 5 personas",
    t2: "De 6 a 15 personas",
    t3: "Más de 15 personas",
    backend: "Backend",
    frontend: "Frontend",
    fullstack: "Full stack",
    bots: "Bots de Discord",
    data: "Bases de datos y datos",
    devops: "Infraestructura y DevOps",
    server: "Servidor de Discord",
    bot: "Bot de Discord",
    website: "Sitio web o herramienta",
    other: "Otra cosa",
    moderator: "Moderador",
    support: "Soporte",
    either: "Cualquiera de los dos",
    tlEs: "Español (Latinoamérica)",
    tlPt: "Portugués (Brasil)",
    tlBoth: "Los dos",
    tlOther: "Otro idioma",
    nv0: "Nativo",
    nv1: "Fluido",
    nv2: "Avanzado"
  }
};
const ptBR = {
  title: "Candidatar-se · Petto",
  eyebrow: "Junte-se ao Petto",
  h1: "Trabalhe com a equipe do Petto.",
  lede: "Escolha o cargo que interessa a você e conte sobre você. A equipe lê cada candidatura e responde pelo Discord. As candidaturas de Desenvolvedor e Manager são longas de propósito, porque o Petto é um projeto grande e esses cargos têm muita responsabilidade.",
  choose: "Escolha uma candidatura",
  submit: "Enviar candidatura",
  back: "Voltar para todas as candidaturas",
  required: "Obrigatório",
  optional: "Opcional",
  select: "Escolha uma opção",
  loggedInAs: "Enviando como",
  loginHint: "Faça login com o Discord para que possamos confirmar quem você é. Você também pode enviar sem fazer login.",
  loginCta: "Entrar com o Discord",
  privacy: "Suas respostas vão para um canal privado da equipe do Petto e só são usadas para analisar sua candidatura. Veja a Política de privacidade para mais detalhes.",
  privacyLink: "Política de privacidade",
  success: "Sua candidatura foi enviada. Obrigado, a equipe vai lê-la e responder pelo Discord.",
  validation: {
    missing: "Esta resposta é obrigatória.",
    short: "Escreva pelo menos {min} caracteres. Você tem {n}.",
    select: "Escolha uma das opções.",
    number: "Use apenas números.",
    url: "Digite um link completo que comece com https://",
    discord: "Digite seu nome de usuário do Discord, ou seu ID numérico.",
    confirm: "Você precisa aceitar isto para enviar a candidatura.",
    summary: "Confira as respostas marcadas em vermelho antes de enviar.",
    counter: "{n} / {min} mínimo",
    sending: "Enviando...",
    network: "Não conseguimos falar com o servidor. Confira sua conexão e tente de novo."
  },
  errors: {
    missing: "Há respostas obrigatórias vazias. Confira o formulário e tente de novo.",
    invalid: "Algumas respostas não são válidas. Confira o formulário e tente de novo.",
    rate: "Você enviou várias candidaturas em pouco tempo. Espere um pouco e tente de novo.",
    unavailable: "As candidaturas estão fechadas por enquanto. Tente novamente mais tarde.",
    failed: "Não conseguimos entregar sua candidatura. Tente de novo em alguns minutos."
  },
  roles: {
    developer: { title: "Desenvolvedor", desc: "Ajude a construir o bot, o site ou o dashboard.", intro: "Conte o que você constrói, como você pensa e no que gostaria de trabalhar.", time: "Leva cerca de 25 minutos" },
    manager: { title: "Manager", desc: "Ajude a conduzir a comunidade do Petto, seus eventos e sua staff.", intro: "Os managers cuidam da comunidade e coordenam a equipe de staff.", time: "Leva cerca de 25 minutos" },
    partner: { title: "Parceiro", desc: "Proponha uma parceria entre o seu projeto e o Petto.", intro: "Conte sobre o seu projeto e o que você tem em mente.", time: "Leva cerca de 5 minutos" },
    staff: { title: "Staff", desc: "Modere e dê suporte no servidor do Petto.", intro: "A staff modera o servidor e ajuda as pessoas no suporte.", time: "Leva cerca de 5 minutos" },
    translator: { title: "Tradutor", desc: "Ajude a traduzir o Petto para espanhol e português do Brasil.", intro: "Conte para qual idioma você traduz e mostre uma amostra curta.", time: "Leva cerca de 10 minutos" }
  },
  sections: {
    developer: { about: "Sobre você", skills: "Habilidades", work: "Seu trabalho", technical: "Perguntas técnicas", motivation: "Motivação", confirm: "Antes de enviar" },
    manager: { about: "Sobre você", experience: "Experiência", scenarios: "Cenários", vision: "Visão e plano", confirm: "Antes de enviar" },
    partner: { project: "Seu projeto", confirm: "Antes de enviar" },
    staff: { about: "Sobre você", confirm: "Antes de enviar" },
    translator: { about: "Sobre você", work: "Sua tradução", confirm: "Antes de enviar" }
  },
  fields: {
    developer: {
      discord: { label: "Usuário ou ID do Discord", placeholder: "usuário ou 123456789012345678" },
      timezone: { label: "Fuso horário ou país" },
      languages: { label: "Idiomas que você fala", placeholder: "Português, inglês" },
      hours: { label: "Tempo que você pode dar por semana" },
      schedule: { label: "Dias e horários em que você costuma estar online" },
      focus: { label: "Sua área principal" },
      years: { label: "Anos de experiência programando" },
      stack: { label: "Linguagens e ferramentas que você usa", placeholder: "JavaScript, TypeScript, Astro, PostgreSQL" },
      djs: { label: "Experiência com a API do Discord (discord.js ou similar)" },
      sql: { label: "Experiência com PostgreSQL ou bancos de dados SQL" },
      experience: { label: "Sua experiência profissional", hint: "Empregos, trabalhos freelance ou projetos pessoais longos, e por quanto tempo." },
      projects: { label: "Seus melhores projetos", hint: "Dois ou três projetos, com links se puder, e o que você fez em cada um." },
      links: { label: "Links do GitHub ou portfólio" },
      opensource: { label: "Contribuições para código aberto ou comunidades" },
      teamwork: { label: "Como você trabalha com outras pessoas?", hint: "Revisão de código, fluxo de Git e como você lida com um desacordo sobre uma mudança." },
      qDesign: { label: "Você está criando um comando de moderação que roda em milhares de servidores. Como você lida com permissões, limites de taxa e erros?" },
      qSecurity: { label: "Como você protege tokens, segredos e dados de usuários em um bot e no seu dashboard web?" },
      qDebug: { label: "Um comando funciona na sua máquina mas falha em produção, só em alguns servidores. Como você encontra a causa?" },
      qReview: { label: "O que você confere ao revisar o pull request de outra pessoa?" },
      interest: { label: "No que você gostaria de trabalhar dentro do Petto e por quê?" },
      first30: { label: "O que você poderia entregar nos seus primeiros 30 dias?" },
      confirm: { label: "Confirmo que minhas respostas são verdadeiras e aceito os Termos de serviço e a Política de privacidade." }
    },
    manager: {
      discord: { label: "Usuário ou ID do Discord", placeholder: "usuário ou 123456789012345678" },
      timezone: { label: "Fuso horário ou país" },
      languages: { label: "Idiomas que você fala", placeholder: "Português, inglês" },
      hours: { label: "Tempo que você pode dar por semana" },
      schedule: { label: "Dias e horários em que você costuma estar online" },
      years: { label: "Anos gerenciando comunidades" },
      teamsize: { label: "A maior equipe que você já liderou" },
      communities: { label: "Comunidades que você gerencia ou gerenciou", hint: "Nome, tamanho e o que você fazia lá." },
      experience: { label: "O que você fez para fazer essas comunidades crescerem e se manterem saudáveis?" },
      tools: { label: "Ferramentas que você usa para gerenciar comunidades", placeholder: "Bots do Discord, sistemas de tickets, planilhas, Notion" },
      events: { label: "Eventos ou programas que você organizou" },
      qConflict: { label: "Um membro da staff e um membro antigo entram em um conflito público, e ambos sentem que foram tratados de forma injusta. O que você faz?" },
      qCrisis: { label: "Uma raid atinge o servidor e começa a circular uma informação privada de um membro. Conte a sua primeira hora." },
      qInactive: { label: "Vários membros da staff deixam de ficar ativos. Como você descobre o motivo e o que você faz?" },
      qPolicy: { label: "Escreva três regras que você adicionaria a um servidor de 50.000 membros e explique como as aplicaria de forma justa." },
      metrics: { label: "Como você mede se uma comunidade está saudável?" },
      ideas: { label: "O que você melhoraria ou começaria na comunidade do Petto?" },
      first30: { label: "Qual é o seu plano para os primeiros 30 dias?" },
      qDelegate: { label: "Como você treina novos membros da staff e delega trabalho sem perder qualidade?" },
      confirm: { label: "Confirmo que minhas respostas são verdadeiras e aceito os Termos de serviço e a Política de privacidade." }
    },
    partner: {
      discord: { label: "Usuário ou ID do Discord da pessoa de contato", placeholder: "usuário ou 123456789012345678" },
      project: { label: "Nome do projeto" },
      kind: { label: "Tipo de projeto" },
      link: { label: "Link de convite ou do site", placeholder: "https://" },
      members: { label: "Número aproximado de membros ou usuários" },
      proposal: { label: "O que você propõe?", hint: "Como seria a parceria." },
      offer: { label: "O que cada lado pode oferecer?" },
      confirm: { label: "Confirmo que minhas respostas são verdadeiras e aceito os Termos de serviço e a Política de privacidade." }
    },
    staff: {
      discord: { label: "Usuário ou ID do Discord", placeholder: "usuário ou 123456789012345678" },
      timezone: { label: "Fuso horário ou país" },
      position: { label: "Cargo que você quer" },
      hours: { label: "Tempo que você pode dar por semana" },
      experience: { label: "Sua experiência em moderação ou suporte", hint: "Servidores que você moderou e o que fazia lá." },
      why: { label: "Por que você quer entrar para a staff?" },
      confirm: { label: "Confirmo que minhas respostas são verdadeiras e aceito os Termos de serviço e a Política de privacidade." }
    },
    translator: {
      discord: { label: "Usuário ou ID do Discord", placeholder: "usuário ou 123456789012345678" },
      timezone: { label: "Fuso horário ou país" },
      language: { label: "Idioma para o qual você traduz" },
      otherLanguage: { label: "Qual idioma, se você escolheu outro", hint: "Só se você escolheu Outro idioma: diga qual.", placeholder: "Hindi, francês, alemão..." },
      level: { label: "Seu nível nesse idioma" },
      hours: { label: "Tempo que você pode dar por semana" },
      experience: { label: "Experiência com tradução", hint: "Bots, jogos, apps, comunidades ou estudos. Opcional." },
      sample1: { label: "Traduza esta mensagem para o seu idioma", hint: "Petto could not ban {user}: I am missing the Ban Members permission. Move my role above theirs and try again." },
      sample2: { label: "Agora traduza esta, mantendo o mesmo tom próximo", hint: "Welcome to {server}, {user}! You are member number {count}. Say hi in the chat!" },
      why: { label: "Por que você quer traduzir o Petto?" },
      confirm: { label: "Confirmo que minhas respostas são verdadeiras e aceito os Termos de Serviço e a Política de Privacidade." }
    }
  },
  options: {
    h1: "Até 5 horas",
    h2: "De 5 a 10 horas",
    h3: "De 10 a 20 horas",
    h4: "Mais de 20 horas",
    y0: "Menos de 1 ano",
    y1: "De 1 a 3 anos",
    y2: "De 3 a 5 anos",
    y3: "Mais de 5 anos",
    l0: "Nenhuma",
    l1: "Básica",
    l2: "Confortável",
    l3: "Avançada",
    t0: "Nunca liderei uma equipe",
    t1: "Até 5 pessoas",
    t2: "De 6 a 15 pessoas",
    t3: "Mais de 15 pessoas",
    backend: "Backend",
    frontend: "Frontend",
    fullstack: "Full stack",
    bots: "Bots do Discord",
    data: "Bancos de dados e dados",
    devops: "Infraestrutura e DevOps",
    server: "Servidor do Discord",
    bot: "Bot do Discord",
    website: "Site ou ferramenta",
    other: "Outra coisa",
    moderator: "Moderador",
    support: "Suporte",
    either: "Qualquer um dos dois",
    tlEs: "Espanhol (América Latina)",
    tlPt: "Português (Brasil)",
    tlBoth: "Os dois",
    tlOther: "Outro idioma",
    nv0: "Nativo",
    nv1: "Fluente",
    nv2: "Avançado"
  }
};
const applicationCopy = { en, es, "pt-BR": ptBR };

export { applicationRoles as a, applicationCopy as b, applicationRoleList as c, isApplicationRole as i, readAnswers as r, sendApplication as s, tooManyAttempts as t };
