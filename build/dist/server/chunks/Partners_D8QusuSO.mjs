import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { $ as $$Base } from './Base_Di2YHjFe.mjs';
import { g as getPartners, P as PARTNER_KINDS } from './partners_BiJzadVG.mjs';
import { $ as $$PartnerIcon } from './PartnerIcon_DUwHRjdM.mjs';
/* empty css                            */

const $$Astro = createAstro("https://petto.sbs");
const $$Partners = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Partners;
  const { lang } = Astro2.props;
  const copy = {
    en: {
      eyebrow: "Partners",
      title: "The partners of Petto.",
      lede: "The providers that keep Petto and its data running, and the communities that work with us.",
      notice: "This list is provisional. Partners may still be awaiting confirmation or may have been discontinued, so this page may not always be up to date. To add or remove a partner, send us a ticket in the Petto support Discord.",
      noticeTitle: "Partner information may change",
      primary: "Primary partner",
      partner: "Partner",
      omniplexDesc: "A place to discover Discord bots and servers: explore thousands of them, vote and leave reviews. Petto is a partner of Omniplex. They are not a hosting provider, ours is Discloud.",
      visitOmniplex: "Visit Omniplex",
      discloudDesc: "Petto's primary hosting provider, PostgreSQL database provider, and infrastructure partner for the bot.",
      visit: "Visit Discloud",
      support: "Open a support ticket"
    },
    es: {
      eyebrow: "Partners",
      title: "Los partners de Petto.",
      lede: "Los proveedores que mantienen funcionando a Petto y sus datos, y las comunidades que trabajan con nosotros.",
      notice: "Esta lista es provisional. Algunos partners pueden estar pendientes de confirmaci\xF3n o haber sido descontinuados, por lo que la p\xE1gina podr\xEDa no estar siempre actualizada. Si quieres a\xF1adir o eliminar un partner, env\xEDanos un ticket en el Discord de soporte de Petto.",
      noticeTitle: "La informaci\xF3n de los partners puede cambiar",
      primary: "Partner principal",
      partner: "Partner",
      omniplexDesc: "Un lugar para descubrir bots y servidores de Discord: explora miles, vota y deja rese\xF1as. Petto es partner de Omniplex. No son un proveedor de hosting, el nuestro es Discloud.",
      visitOmniplex: "Visitar Omniplex",
      discloudDesc: "Proveedor principal de hosting, base de datos PostgreSQL e infraestructura para el bot de Petto.",
      visit: "Visitar Discloud",
      support: "Abrir un ticket de soporte"
    },
    "pt-BR": {
      eyebrow: "Partners",
      title: "Os parceiros do Petto.",
      lede: "Os provedores que mant\xEAm o Petto e seus dados funcionando, e as comunidades que trabalham com a gente.",
      notice: "Esta lista \xE9 provis\xF3ria. Alguns partners podem estar aguardando confirma\xE7\xE3o ou ter sido descontinuados, ent\xE3o a p\xE1gina pode n\xE3o estar sempre atualizada. Se quiser adicionar ou remover um partner, envie um ticket no Discord de suporte do Petto.",
      noticeTitle: "As informa\xE7\xF5es dos partners podem mudar",
      primary: "Partner principal",
      partner: "Partner",
      omniplexDesc: "Um lugar para descobrir bots e servidores do Discord: explore milhares, vote e deixe avalia\xE7\xF5es. O Petto \xE9 parceiro da Omniplex. Eles n\xE3o s\xE3o um provedor de hospedagem, o nosso \xE9 a Discloud.",
      visitOmniplex: "Visitar a Omniplex",
      discloudDesc: "Provedor principal de hospedagem, banco de dados PostgreSQL e infraestrutura do bot do Petto.",
      visit: "Visitar a Discloud",
      support: "Abrir um ticket de suporte"
    }
  };
  const extra = {
    en: { copyLink: "Copy link", copied: "Link copied", visitPartner: (name) => `Visit ${name}`, kinds: { hosting: "Hosting", servers: "Servers", apps: "Apps", bots: "Bots", communities: "Communities", other: "Other" } },
    es: { copyLink: "Copiar enlace", copied: "Enlace copiado", visitPartner: (name) => `Visitar ${name}`, kinds: { hosting: "Hosting", servers: "Servidores", apps: "Apps", bots: "Bots", communities: "Comunidades", other: "Otros" } },
    "pt-BR": { copyLink: "Copiar link", copied: "Link copiado", visitPartner: (name) => `Visitar ${name}`, kinds: { hosting: "Hospedagem", servers: "Servidores", apps: "Apps", bots: "Bots", communities: "Comunidades", other: "Outros" } }
  };
  const t = { ...copy[lang], ...extra[lang] };
  const { partners } = await getPartners(Astro2);
  const groups = PARTNER_KINDS.map((kind) => ({ kind, items: partners.filter((partner) => partner.kind === kind) })).filter((group) => group.items.length > 0);
  const partnerSlug = (partner) => partner.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const partnerAnchor = (partner) => `part_${partner.kind}:${partnerSlug(partner)}`;
  const descriptionOf = (partner) => (lang === "es" ? partner.description_es : lang === "pt-BR" ? partner.description_pt : partner.description_en) || partner.description_en;
  const wantedPartner = (Astro2.url.searchParams.get("p") ?? "").trim().toLowerCase();
  const selectedPartner = wantedPartner ? partners.find((p) => partnerSlug(p) === wantedPartner || partnerAnchor(p) === wantedPartner) ?? null : null;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": selectedPartner ? `${selectedPartner.name} \xB7 ${t.eyebrow} \xB7 Petto` : `${t.eyebrow} \xB7 Petto`, "description": selectedPartner ? descriptionOf(selectedPartner) : void 0, "ogTitle": selectedPartner ? `${selectedPartner.name} \xB7 ${t.eyebrow} \xB7 Petto` : void 0, "ogImage": selectedPartner ? `/api/og/partner?p=${encodeURIComponent(partnerSlug(selectedPartner))}&lang=${lang}` : void 0, "ogImageAlt": selectedPartner ? selectedPartner.name : void 0, "lang": lang, "preloadImages": ["/assets/hero-art-4.webp"], "data-astro-cid-s63cuhea": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-s63cuhea> <section class="pa-hero vx-sub-hero pa-hero-tall" data-astro-cid-s63cuhea> <div class="vx-sub-bg" aria-hidden="true" style="background-image:url('/assets/hero-art-4.webp');background-size:cover;background-position:center 26%;" data-astro-cid-s63cuhea> <img src="/assets/hero-art-4.webp" alt="" loading="eager" decoding="sync" fetchpriority="high" draggable="false" data-astro-cid-s63cuhea> <div class="vx-sub-fade" data-astro-cid-s63cuhea></div> </div> <div class="wrap pa-hero-inner" data-astro-cid-s63cuhea> <div class="eyebrow reveal" data-astro-cid-s63cuhea>${t.eyebrow}</div> <h1 class="reveal" data-astro-cid-s63cuhea>${t.title}</h1> <p class="pa-lede reveal" data-astro-cid-s63cuhea>${t.lede}</p> </div> </section> <section class="pa-content" data-astro-cid-s63cuhea> <div class="wrap" data-astro-cid-s63cuhea> <div class="pa-notice reveal" role="note" data-astro-cid-s63cuhea> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "19", "height": "19", "data-astro-cid-s63cuhea": true })} <div data-astro-cid-s63cuhea> <strong data-astro-cid-s63cuhea>${t.noticeTitle}</strong> <p data-astro-cid-s63cuhea>${t.notice}</p> </div> </div> <div class="pa-groups" data-astro-cid-s63cuhea> ${groups.map((group) => renderTemplate`<div class="pa-group reveal" data-astro-cid-s63cuhea> ${groups.length > 1 && renderTemplate`<h2 class="pa-kind" data-astro-cid-s63cuhea>${t.kinds[group.kind]}</h2>`} <div class="pa-grid" data-astro-cid-s63cuhea> ${group.items.map((partner) => renderTemplate`<article class="pa-card"${addAttribute(partnerAnchor(partner), "id")} data-astro-cid-s63cuhea> <div class="pa-card-top" data-astro-cid-s63cuhea> ${renderComponent($$result2, "PartnerIcon", $$PartnerIcon, { "partner": partner, "prefix": "pa", "label": true, "data-astro-cid-s63cuhea": true })} <span class="pa-status" data-astro-cid-s63cuhea>${partner.is_primary ? t.primary : t.partner}</span> </div> <h2 data-astro-cid-s63cuhea>${partner.name}</h2> <p data-astro-cid-s63cuhea>${descriptionOf(partner)}</p> <div class="pa-actions" data-astro-cid-s63cuhea> <a class="pa-link"${addAttribute(partner.url, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-s63cuhea> ${t.visitPartner(partner.name)}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-up-right", "width": "14", "height": "14", "data-astro-cid-s63cuhea": true })} </a> <button type="button" class="pa-copy"${addAttribute(partnerSlug(partner), "data-copy-slug")}${addAttribute(partnerAnchor(partner), "data-copy-anchor")}${addAttribute(t.copied, "data-copied")}${addAttribute(t.copyLink, "title")}${addAttribute(t.copyLink, "aria-label")} data-astro-cid-s63cuhea> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:link-simple-bold", "width": "14", "height": "14", "data-astro-cid-s63cuhea": true })}<span data-astro-cid-s63cuhea>${t.copyLink}</span> </button> </div> </article>`)} </div> </div>`)} </div> <div class="pa-contact reveal" data-astro-cid-s63cuhea> <a class="btn btn-ghost btn-sm" href="https://petto.sbs/support" target="_blank" rel="noopener" data-astro-cid-s63cuhea> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:ticket", "width": "14", "height": "14", "data-astro-cid-s63cuhea": true })} ${t.support} </a> </div> </div> </section> </main> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/Partners.astro", void 0);

export { $$Partners as $ };
