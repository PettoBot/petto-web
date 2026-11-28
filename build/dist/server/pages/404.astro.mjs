import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$Base } from '../chunks/Base_Di2YHjFe.mjs';
import { g as getDashLang } from '../chunks/dash_CORIPvM-.mjs';
/* empty css                               */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$404 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$404;
  const path = Astro2.url.pathname;
  const inDash = /^\/(?:(?:es|pt-br)\/)?dash(?:\/|$)/i.test(path);
  const lang = /^\/es(?:\/|$)/i.test(path) ? "es" : /^\/pt-br(?:\/|$)/i.test(path) ? "pt-BR" : inDash ? getDashLang(Astro2) : "en";
  const prefix = lang === "es" ? "/es" : lang === "pt-BR" ? "/pt-br" : "";
  const copy = {
    en: { title: "Page not found", lede: "That page does not exist, or it moved. Check the address, or go back to somewhere that does.", home: "Back home", commands: "Commands", dash: "Dashboard", support: "Ask in the support server" },
    es: { title: "P\xE1gina no encontrada", lede: "Esa p\xE1gina no existe o se movi\xF3. Revisa la direcci\xF3n, o vuelve a un lugar que s\xED exista.", home: "Volver al inicio", commands: "Comandos", dash: "Panel", support: "Pregunta en el servidor de soporte" },
    "pt-BR": { title: "P\xE1gina n\xE3o encontrada", lede: "Essa p\xE1gina n\xE3o existe ou foi movida. Confira o endere\xE7o, ou volte para um lugar que exista.", home: "Voltar ao in\xEDcio", commands: "Comandos", dash: "Painel", support: "Pergunte no servidor de suporte" }
  }[lang];
  Astro2.response.status = 404;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${copy.title} \xB7 Petto`, "lang": lang, "active": inDash ? "dash" : "home", "noindex": true, "data-astro-cid-zetdm5md": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="nf" data-astro-cid-zetdm5md> <div class="nf-card" data-astro-cid-zetdm5md> <img class="nf-mascot" src="/assets/mascot-icon.webp" alt="" width="84" height="84" data-astro-cid-zetdm5md> <p class="nf-code" aria-hidden="true" data-astro-cid-zetdm5md>404</p> <h1 data-astro-cid-zetdm5md>${copy.title}</h1> <p class="nf-lede" data-astro-cid-zetdm5md>${copy.lede}</p> <div class="nf-actions" data-astro-cid-zetdm5md> <a class="btn btn-primary"${addAttribute(prefix || "/", "href")} data-astro-cid-zetdm5md>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-left-bold", "width": "16", "height": "16", "data-astro-cid-zetdm5md": true })}${copy.home}</a> <a class="btn btn-ghost"${addAttribute(`${prefix}/commands`, "href")} data-astro-cid-zetdm5md>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "16", "height": "16", "data-astro-cid-zetdm5md": true })}${copy.commands}</a> <a class="btn btn-ghost" href="/dash/manage" data-astro-cid-zetdm5md>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:squares-four-fill", "width": "16", "height": "16", "data-astro-cid-zetdm5md": true })}${copy.dash}</a> </div> <a class="nf-support" href="https://petto.sbs/support" target="_blank" rel="noopener" data-astro-cid-zetdm5md>${copy.support}</a> </div> </main> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/pages/404.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
