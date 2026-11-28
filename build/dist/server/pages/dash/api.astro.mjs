import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopAdminShared } from '../../chunks/DashShopAdminShared_DyqGJdSO.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                  */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashApiKeys = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashApiKeys;
  const { user, data, origin } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", year: "numeric" });
  const DOCS_URL = {
    en: "https://wiki.petto.sbs/user/api",
    es: "https://wiki.petto.sbs/es/user/api",
    "pt-BR": "https://wiki.petto.sbs/pt-br/user/api"
  };
  const docsHref = DOCS_URL[lang];
  const COPY = {
    en: {
      title: "Petto API",
      docs: "Documentation",
      heroTitle: "Build on Petto",
      heroSub: "Read your ceramos balance, personal plan, wallet movements and packs from your own apps. Read-only, up to 60 reads a minute per key.",
      placeholder: "Key name (e.g. Portfolio widget)",
      copy: "Copy",
      copied: "Copied",
      keysTitle: "Your API keys",
      keysCount: "{n} of {max} keys",
      buildTitle: "What you can build",
      features: [
        { icon: "ph:coins-fill", title: "Balance and plan", desc: "Read your current ceramos balance and active plan via /api/v1/me." },
        { icon: "ph:clock-counter-clockwise-fill", title: "Movement history", desc: "Fetch the last 50 ceramos movements from /api/v1/movements." },
        { icon: "ph:package-fill", title: "Public packs catalog", desc: "Query available ceramos packs via /api/v1/packs with no key needed." },
        { icon: "ph:key-fill", title: "Read-only API keys", desc: "Keys only read your own data and can never modify anything." }
      ],
      howTitle: "How it works",
      steps: [
        { title: "Create a key", desc: "Give your key a name so you remember what app uses it." },
        { title: "Copy it once", desc: "Your key is shown only once; only its hash is stored." },
        { title: "Send the header", desc: "Pass Authorization: Bearer YOUR_KEY on every request." },
        { title: "Start building", desc: "Call the endpoints and manage or revoke keys here anytime." }
      ],
      quickTitle: "Quick start",
      rateNote: "Rate limit: 60 reads per minute for each key."
    },
    es: {
      title: "Petto API",
      docs: "Documentaci\xF3n",
      heroTitle: "Construye con Petto",
      heroSub: "Lee tu saldo de c\xE9ramos, tu plan personal, movimientos y paquetes desde tus propios programas. Solo lectura, hasta 60 consultas por minuto por clave.",
      placeholder: "Nombre de la clave (ej. Mi web)",
      copy: "Copiar",
      copied: "Copiada",
      keysTitle: "Tus claves de API",
      keysCount: "{n} de {max} claves",
      buildTitle: "Qu\xE9 puedes construir",
      features: [
        { icon: "ph:coins-fill", title: "Saldo y plan", desc: "Consulta tus c\xE9ramos y tu plan activo desde /api/v1/me." },
        { icon: "ph:clock-counter-clockwise-fill", title: "Historial de movimientos", desc: "Obt\xE9n los \xFAltimos 50 movimientos de tu billetera en /api/v1/movements." },
        { icon: "ph:package-fill", title: "Cat\xE1logo p\xFAblico de paquetes", desc: "Lee los paquetes de c\xE9ramos en /api/v1/packs sin necesidad de clave." },
        { icon: "ph:key-fill", title: "Claves de solo lectura", desc: "Solo leen tus propios datos y nunca pueden modificar nada." }
      ],
      howTitle: "C\xF3mo funciona",
      steps: [
        { title: "Crea una clave", desc: "Ponle un nombre para recordar qu\xE9 proyecto la usa." },
        { title: "C\xF3piala una vez", desc: "Se muestra una sola vez; solo guardamos su hash." },
        { title: "Env\xEDa el encabezado", desc: "Usa Authorization: Bearer TU_CLAVE en cada petici\xF3n." },
        { title: "Empieza a construir", desc: "Consulta los endpoints y administra tus claves aqu\xED." }
      ],
      quickTitle: "Inicio r\xE1pido",
      rateNote: "L\xEDmite: 60 lecturas por minuto por cada clave."
    },
    "pt-BR": {
      title: "Petto API",
      docs: "Documenta\xE7\xE3o",
      heroTitle: "Construa com o Petto",
      heroSub: "Leia seu saldo de c\xE9ramos, plano pessoal, movimenta\xE7\xF5es e pacotes nos seus pr\xF3prios aplicativos. Somente leitura, at\xE9 60 leituras por minuto por chave.",
      placeholder: "Nome da chave (ex. Meu site)",
      copy: "Copiar",
      copied: "Copiada",
      keysTitle: "Suas chaves de API",
      keysCount: "{n} de {max} chaves",
      buildTitle: "O que voc\xEA pode construir",
      features: [
        { icon: "ph:coins-fill", title: "Saldo e plano", desc: "Leia seus c\xE9ramos atuais e seu plano ativo via /api/v1/me." },
        { icon: "ph:clock-counter-clockwise-fill", title: "Hist\xF3rico de movimenta\xE7\xF5es", desc: "Busque as \xFAltimas 50 movimenta\xE7\xF5es em /api/v1/movements." },
        { icon: "ph:package-fill", title: "Cat\xE1logo p\xFAblico de pacotes", desc: "Consulte pacotes de c\xE9ramos em /api/v1/packs sem precisar de chave." },
        { icon: "ph:key-fill", title: "Chaves somente leitura", desc: "As chaves leem apenas seus pr\xF3prios dados e nunca alteram nada." }
      ],
      howTitle: "Como funciona",
      steps: [
        { title: "Crie uma chave", desc: "D\xEA um nome para lembrar qual app usa esta chave." },
        { title: "Copie uma vez", desc: "Sua chave aparece apenas uma vez; guardamos s\xF3 o hash." },
        { title: "Envie o cabe\xE7alho", desc: "Passe Authorization: Bearer SUA_CHAVE em cada requisi\xE7\xE3o." },
        { title: "Comece a construir", desc: "Chame os endpoints e gerencie ou remova chaves aqui." }
      ],
      quickTitle: "In\xEDcio r\xE1pido",
      rateNote: "Limite: 60 leituras por minuto para cada chave."
    }
  }[lang];
  const ui = {
    down: dt("Petto did not answer. Try again in a moment."),
    working: dt("Working\u2026"),
    copy: COPY.copy,
    copied: COPY.copied,
    errors: {
      too_many: dt("You already have the most keys. Remove one first."),
      failed: dt("It could not be done. Try again in a moment.")
    }
  };
  const boot = JSON.stringify({ ui }).replace(/</g, "\\u003c");
  const curlSnippet = `curl ${origin}/api/v1/me \\
  -H "Authorization: Bearer YOUR_KEY"`;
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "api", "pageTitle": COPY.title }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopAdminShared", $$DashShopAdminShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": COPY.title, "eyebrow": dt("Account"), "icon": "ph:code-fill", "back": false }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<a class="btn ak-docs-btn"${addAttribute(docsHref, "href")} target="_blank" rel="noopener"> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "15", "height": "15" })} ${COPY.docs} ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrow-up-right-bold", "width": "13", "height": "13" })} </a> ` })} ${!data && renderTemplate`<p class="be-down" role="alert">${ui.down}</p>`}${data && renderTemplate`<div class="ak" id="be"${addAttribute(boot, "data-boot")}> <div class="ak-hero-card"> <div class="ak-hero-banner"> <div class="ak-hero-copy"> <h2>${COPY.heroTitle}</h2> <p>${COPY.heroSub}</p> </div> <div class="ak-hero-badge" aria-hidden="true"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:code-fill", "width": "42", "height": "42" })} </div> </div> <form class="ak-create-bar" id="be-form" autocomplete="off"> <div class="ak-create-row"> <input class="ak-input" name="label" maxlength="40"${addAttribute(COPY.placeholder, "placeholder")}${addAttribute(dt("Name (to remember what it is for)"), "aria-label")}> <button type="submit" class="btn be-save ak-create-btn" id="be-save"${addAttribute(data.keys.length >= data.max, "disabled")}> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14" })} ${dt("Make key")} </button> </div> <div class="ak-new" id="ak-new" hidden> <div class="ak-new-top"> <p>${dt("This is your key. Copy it now: it is shown only once.")}</p> <button type="button" class="btn ak-copy-btn" id="ak-copy-key">${COPY.copy}</button> </div> <code id="ak-key"></code> </div> <p class="be-msg" id="be-msg" role="status" hidden></p> </form> </div> <div class="ak-section"> <div class="ak-sec-head"> <h2>${COPY.keysTitle}</h2> <span class="ak-count">${COPY.keysCount.replace("{n}", String(data.keys.length)).replace("{max}", String(data.max))}</span> </div> <div class="ak-keys-card"> ${data.keys.length === 0 ? renderTemplate`<p class="ak-empty">${dt("You have no keys yet.")}</p>` : renderTemplate`<div class="ak-keys-list"> ${data.keys.map((row) => renderTemplate`<article class="ak-key-row"> <span class="ak-key-icon">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:key-fill", "width": "16", "height": "16" })}</span> <div class="be-info"> <strong>${row.label || dt("Key {n}", { n: String(row.id) })}</strong> <span class="be-meta"> <span>${dt("Made {date}", { date: date.format(new Date(row.createdAt)) })}</span> <span>${row.lastUsed ? dt("Last used {date}", { date: date.format(new Date(row.lastUsed)) }) : dt("Never used")}</span> </span> </div> <div class="be-actions"> <button type="button" class="btn be-off"${addAttribute(row.id, "data-remove")}>${dt("Remove")}</button> </div> </article>`)} </div>`} </div> </div> <div class="ak-section"> <h2 class="ak-sec-title">${COPY.buildTitle}</h2> <div class="ak-feat-grid"> ${COPY.features.map((feat) => renderTemplate`<article class="ak-feat-card"> <span class="ak-feat-well">${renderComponent($$result2, "Icon", $$Icon, { "name": feat.icon, "width": "20", "height": "20" })}</span> <h3>${feat.title}</h3> <p>${feat.desc}</p> </article>`)} </div> </div> <div class="ak-how-card"> <h2>${COPY.howTitle}</h2> <ol class="ak-steps"> ${COPY.steps.map((step, i) => renderTemplate`<li class="ak-step"> <div class="ak-step-top"> <span class="ak-step-num">${i + 1}</span> ${i < COPY.steps.length - 1 && renderTemplate`<span class="ak-step-line" aria-hidden="true"></span>`} </div> <h3>${step.title}</h3> <p>${step.desc}</p> </li>`)} </ol> </div> <div class="ak-how-card ak-quick"> <div class="ak-sec-head"> <h2>${COPY.quickTitle}</h2> <button type="button" class="btn ak-copy-btn" id="ak-copy-curl">${COPY.copy}</button> </div> <pre class="ak-code" id="ak-curl">${curlSnippet}</pre> <p class="ak-rate">${COPY.rateNote}</p> </div> </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashApiKeys.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Api = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Api;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const keys = await callPettoCeramos(Astro2, session.userId, "api-keys");
  return renderTemplate`${renderComponent($$result, "DashApiKeys", $$DashApiKeys, { "user": session, "data": keys.ok ? keys.data : null, "origin": Astro2.url.origin })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/api.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/api.astro";
const $$url = "/dash/api";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Api,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
