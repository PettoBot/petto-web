import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Base } from './Base_Di2YHjFe.mjs';
import { e as getTeamRoster } from './team_C2OWrCGw.mjs';
import { g as getEnv } from './env_WnBvzCjc.mjs';
/* empty css                        */

const $$Astro = createAstro("https://petto.sbs");
const $$Team = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Team;
  const { lang } = Astro2.props;
  const copy = {
    en: {
      title: "Team \xB7 Petto",
      eyebrow: "Petto Team",
      h1: "The people behind Petto.",
      lede: "Everyone who builds, moderates, and keeps Petto running day to day.",
      sections: { owners: "Owners", programming: "Programming", support: "Support", legal: "Legal", test: "Testing" },
      creditsEyebrow: "Maintenance & infrastructure",
      creditsPre: "Petto is developed and maintained by",
      creditsMid: "with support from",
      creditsAnd: "and",
      creditsHost: "Hosted on",
      creditsHostPost: "Petto's primary hosting and PostgreSQL provider."
    },
    es: {
      title: "Equipo \xB7 Petto",
      eyebrow: "Equipo de Petto",
      h1: "Las personas detr\xE1s de Petto.",
      lede: "Todos los que construyen, moderan y mantienen Petto funcionando d\xEDa a d\xEDa.",
      sections: { owners: "Due\xF1os", programming: "Programaci\xF3n", support: "Soporte", legal: "Legal", test: "Pruebas" },
      creditsEyebrow: "Mantenimiento e infraestructura",
      creditsPre: "Petto es desarrollado y mantenido por",
      creditsMid: "con el apoyo de",
      creditsAnd: "y",
      creditsHost: "Alojado en",
      creditsHostPost: "el proveedor principal de hosting y PostgreSQL de Petto."
    },
    "pt-BR": {
      title: "Equipe \xB7 Petto",
      eyebrow: "Equipe do Petto",
      h1: "As pessoas por tr\xE1s do Petto.",
      lede: "Todos que constroem, moderam e mant\xEAm o Petto funcionando no dia a dia.",
      sections: { owners: "Donos", programming: "Programa\xE7\xE3o", support: "Suporte", legal: "Jur\xEDdico", test: "Testes" },
      creditsEyebrow: "Manuten\xE7\xE3o e infraestrutura",
      creditsPre: "O Petto \xE9 desenvolvido e mantido pela",
      creditsMid: "com o apoio de",
      creditsAnd: "e",
      creditsHost: "Hospedado na",
      creditsHostPost: "o principal provedor de hospedagem e PostgreSQL do Petto."
    }
  }[lang];
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const roster = botToken ? await getTeamRoster(botToken, Astro2) : { owners: [], programming: [], support: [], test: [], legal: [] };
  const sections = [
    { key: "owners", label: copy.sections.owners, badge: "/assets/badge-owner.png", members: roster.owners },
    { key: "programming", label: copy.sections.programming, badge: "/assets/badge-programming.png", members: roster.programming },
    { key: "support", label: copy.sections.support, badge: "/assets/badge-support.png", members: roster.support },
    { key: "legal", label: copy.sections.legal, badge: "/assets/badge-owner.png", members: roster.legal },
    { key: "test", label: copy.sections.test, badge: "/assets/badge-test.png", members: roster.test }
  ].filter((s) => s.members.length > 0);
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": copy.title, "lang": lang, "data-astro-cid-yu4wt3u2": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-yu4wt3u2> <section class="tm-hero" data-astro-cid-yu4wt3u2> <div class="wrap" data-astro-cid-yu4wt3u2> <div class="eyebrow reveal" data-astro-cid-yu4wt3u2>${copy.eyebrow}</div> <h1 class="reveal" data-astro-cid-yu4wt3u2>${copy.h1}</h1> <p class="tm-lede reveal" data-astro-cid-yu4wt3u2>${copy.lede}</p> </div> </section> ${sections.map((s) => renderTemplate`<section class="tm-sec" data-astro-cid-yu4wt3u2> <div class="wrap" data-astro-cid-yu4wt3u2> <div class="tm-sec-head reveal" data-astro-cid-yu4wt3u2> <img${addAttribute(s.badge, "src")} alt="" class="tm-sec-badge" data-astro-cid-yu4wt3u2> <h2 data-astro-cid-yu4wt3u2>${s.label}</h2> </div> <div class="tm-grid reveal" data-astro-cid-yu4wt3u2> ${s.members.map((m) => renderTemplate`<div class="tm-card" data-astro-cid-yu4wt3u2> <div class="tm-avatar-wrap" data-astro-cid-yu4wt3u2> <img${addAttribute(m.avatarUrl, "src")} alt="" class="tm-avatar" data-astro-cid-yu4wt3u2> <div class="tm-badge-wrap" data-astro-cid-yu4wt3u2><img${addAttribute(s.badge, "src")} alt="" class="tm-badge" data-astro-cid-yu4wt3u2></div> </div> <div class="tm-name" data-astro-cid-yu4wt3u2>${m.displayName}</div> <div class="tm-username" data-astro-cid-yu4wt3u2>@${m.username}</div> </div>`)} </div> </div> </section>`)} <section class="tm-credits alt" data-astro-cid-yu4wt3u2> <div class="wrap reveal" data-astro-cid-yu4wt3u2> <div class="eyebrow" data-astro-cid-yu4wt3u2>${copy.creditsEyebrow}</div> <p class="tm-credits-text" data-astro-cid-yu4wt3u2> ${copy.creditsPre} <b data-astro-cid-yu4wt3u2>Petto Team</b>, ${copy.creditsMid} <a href="https://skirr.dev" target="_blank" rel="noopener" data-astro-cid-yu4wt3u2>skirr.dev</a> ${copy.creditsAnd} <a href="https://kirzu.sbs/bots" target="_blank" rel="noopener" data-astro-cid-yu4wt3u2>kirzu.sbs/bots</a>.
${copy.creditsHost} <a href="https://discloud.com" target="_blank" rel="noopener" data-astro-cid-yu4wt3u2>Discloud</a>, ${copy.creditsHostPost} </p> </div> </section> </main> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/Team.astro", void 0);

export { $$Team as $ };
