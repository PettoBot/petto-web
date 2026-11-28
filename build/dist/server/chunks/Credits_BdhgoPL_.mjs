import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { $ as $$Base } from './Base_Di2YHjFe.mjs';
import { g as getCredits, C as CREDIT_KINDS } from './credits_D_0No7l_.mjs';
/* empty css                           */

const $$Astro = createAstro("https://petto.sbs");
const $$Credits = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Credits;
  const { lang } = Astro2.props;
  const copy = {
    en: {
      eyebrow: "Credits",
      title: "Thank you.",
      lede: "Petto stands on the work of many people, communities and tools. These are the ones that make it possible.",
      note: "Missing someone, or want your credit changed? Open a ticket in the Petto support Discord and we will fix it.",
      support: "Open a support ticket",
      visit: (name) => `Visit ${name}`,
      kinds: { people: "People", features: "Features", data: "Data sources", systems: "Systems", tools: "Tools and libraries", art: "Art and icons", other: "And more" }
    },
    es: {
      eyebrow: "Cr\xE9ditos",
      title: "Gracias.",
      lede: "Petto se apoya en el trabajo de muchas personas, comunidades y herramientas. Estas son las que lo hacen posible.",
      note: "\xBFFalta alguien o quieres cambiar tu cr\xE9dito? Abre un ticket en el Discord de soporte de Petto y lo arreglamos.",
      support: "Abrir un ticket de soporte",
      visit: (name) => `Visitar ${name}`,
      kinds: { people: "Personas", features: "Funciones", data: "Fuentes de datos", systems: "Sistemas", tools: "Herramientas y librer\xEDas", art: "Arte e iconos", other: "Y m\xE1s" }
    },
    "pt-BR": {
      eyebrow: "Cr\xE9ditos",
      title: "Obrigado.",
      lede: "O Petto se apoia no trabalho de muitas pessoas, comunidades e ferramentas. Estas s\xE3o as que o tornam poss\xEDvel.",
      note: "Faltou algu\xE9m, ou quer mudar o seu cr\xE9dito? Abra um ticket no Discord de suporte do Petto e a gente corrige.",
      support: "Abrir um ticket de suporte",
      visit: (name) => `Visitar ${name}`,
      kinds: { people: "Pessoas", features: "Fun\xE7\xF5es", data: "Fontes de dados", systems: "Sistemas", tools: "Ferramentas e bibliotecas", art: "Arte e \xEDcones", other: "E mais" }
    }
  };
  const t = copy[lang];
  const { credits } = await getCredits(Astro2);
  const groups = CREDIT_KINDS.map((kind) => ({ kind, items: credits.filter((credit) => credit.kind === kind) })).filter((group) => group.items.length > 0);
  const descriptionOf = (credit) => (lang === "es" ? credit.description_es : lang === "pt-BR" ? credit.description_pt : credit.description_en) || credit.description_en;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${t.eyebrow} \xB7 Petto`, "lang": lang, "data-astro-cid-wcoxe63l": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-wcoxe63l> <section class="cr-hero" data-astro-cid-wcoxe63l> <div class="wrap" data-astro-cid-wcoxe63l> <div class="eyebrow reveal" data-astro-cid-wcoxe63l>${t.eyebrow}</div> <h1 class="reveal" data-astro-cid-wcoxe63l>${t.title}</h1> <p class="cr-lede reveal" data-astro-cid-wcoxe63l>${t.lede}</p> </div> </section> <section class="cr-content" data-astro-cid-wcoxe63l> <div class="wrap" data-astro-cid-wcoxe63l> ${groups.map((group) => renderTemplate`<div class="cr-group reveal" data-astro-cid-wcoxe63l> <h2 class="cr-kind" data-astro-cid-wcoxe63l>${t.kinds[group.kind]}</h2> <div class="cr-grid" data-astro-cid-wcoxe63l> ${group.items.map((credit) => renderTemplate`<article class="cr-card" data-astro-cid-wcoxe63l> <div class="cr-top" data-astro-cid-wcoxe63l> ${credit.logo_url ? renderTemplate`<div class="cr-icon cr-icon-logo" data-astro-cid-wcoxe63l><img${addAttribute(credit.logo_url, "src")}${addAttribute(credit.name, "alt")} width="40" height="40" loading="lazy" data-astro-cid-wcoxe63l></div>` : renderTemplate`<div class="cr-icon" aria-hidden="true" data-astro-cid-wcoxe63l>${credit.name.slice(0, 1).toUpperCase()}</div>`} <h3 data-astro-cid-wcoxe63l>${credit.name}</h3> </div> <p data-astro-cid-wcoxe63l>${descriptionOf(credit)}</p> ${credit.url && renderTemplate`<a class="cr-link"${addAttribute(credit.url, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-wcoxe63l> ${t.visit(credit.name)}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-up-right", "width": "14", "height": "14", "data-astro-cid-wcoxe63l": true })} </a>`} </article>`)} </div> </div>`)} <div class="cr-contact reveal" data-astro-cid-wcoxe63l> <p data-astro-cid-wcoxe63l>${t.note}</p> <a class="btn btn-ghost btn-sm" href="https://petto.sbs/support" target="_blank" rel="noopener" data-astro-cid-wcoxe63l> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:ticket", "width": "14", "height": "14", "data-astro-cid-wcoxe63l": true })} ${t.support} </a> </div> </div> </section> </main> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/Credits.astro", void 0);

export { $$Credits as $ };
