import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$AppealLayout } from '../../chunks/AppealLayout_D9gU673z.mjs';
import { a as appealText, l as loadSite } from '../../chunks/appealSite_SuoN-UBP.mjs';
import { l as linkPreview, p as pictureUrl, e as timeAgo, c as callBot, f as loadLiveForms, g as loadUserSubmissions } from '../../chunks/appeals_OSuSBkCm.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$AppealLanding = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AppealLanding;
  const { lang, guild, config, state, loginHref, user = null, punishments = [], blocked = false, blockedUntil = null, opensAt = null, forms = [], mine = [] } = Astro2.props;
  const waiting = Boolean(opensAt && Date.parse(opensAt) > Date.now());
  const t = appealText(lang);
  const preview = linkPreview(config, guild, lang, { path: guild.path ?? guild.id, origin: Astro2.url.origin });
  const icon = pictureUrl(config.brand?.icon_url, "icon", { path: guild.path ?? guild.id, origin: Astro2.url.origin }) ?? guild.icon;
  const when = (iso) => iso ? new Date(iso).toLocaleString(lang === "pt-BR" ? "pt-BR" : lang, { dateStyle: "medium", timeStyle: "short" }) : "";
  const typeList = (types) => types.map((x) => t(`type_${x}`)).join(" / ");
  const have = new Set(punishments.map((p) => p.type));
  const meets = (form) => !form.requirement_types.length || form.requirement_types.some((x) => have.has(x));
  const greeting = (config.greeting || "").trim() || t("defaultGreeting");
  return renderTemplate`${renderComponent($$result, "AppealLayout", $$AppealLayout, { "lang": lang, "config": config, "guild": guild, "preview": preview }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="ap-server"> ${icon && renderTemplate`<img${addAttribute(icon, "src")} alt="" width="62" height="62">`} <div> <h1>${state === "closed" ? t("closedTitle") : t("appealTo", { server: config.brand?.name || guild.name })}</h1> ${config.brand?.tagline && renderTemplate`<p class="ap-muted">${config.brand.tagline}</p>`} </div> </div> ${state === "closed" && renderTemplate`<div class="ap-card soft"><p>${t("closedBody")}</p></div>`}${state === "unavailable" && renderTemplate`<div class="ap-card bad"><p>${t("serverUnavailable")}</p></div>`}${state === "login" && renderTemplate`<div class="ap-card soft"> <p style="white-space:pre-wrap">${greeting}</p> <div class="ap-row"><a class="ap-btn"${addAttribute(loginHref, "href")}>${t("signIn")}</a><span class="ap-muted">${t("signInHint")}</span></div> </div>`}${state === "ready" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <p style="white-space:pre-wrap">${greeting}</p> ${user && renderTemplate`<div class="ap-row"><span class="ap-muted">${t("signedInAs", { name: user.name })}</span><a class="ap-btn ghost"${addAttribute(`${loginHref.replace(/login.*$/, "")}logout`, "href")}>${t("signOut")}</a></div>`}${blocked && renderTemplate`<div class="ap-card bad"> <h3>${t("blockedTitle")}</h3> <p>${blockedUntil ? t("blockedUntil", { when: timeAgo(blockedUntil, lang) || when(blockedUntil) }) : t("blockedForever")}</p> </div>`}${waiting && !blocked && renderTemplate`<div class="ap-card soft"> <h3>${t("waitTitle")}</h3> <p>${t("waitUntil", { when: timeAgo(opensAt, lang) || when(opensAt) })}</p> </div>`}<section class="ap-list"> <h2>${t("yourPunishments")}</h2> ${punishments.length === 0 && renderTemplate`<div class="ap-card soft"><p>${t("noPunishments")}</p><p class="ap-muted">${t("noPunishmentsHint")}</p></div>`} ${punishments.map((p) => renderTemplate`<div class="ap-card"> <div class="ap-row"><h3>${t(`type_${p.type}`)}</h3><span>${p.case && renderTemplate`<span class="ap-chip">${t("caseNumber", { n: p.case })}</span>`} <span class="ap-chip">${t(`source_${p.source}`)}</span></span></div> ${p.reason && renderTemplate`<p>${p.reason}</p>`} ${"until" in p && renderTemplate`<p class="ap-muted">${p.until ? `${t("until")}: ${when(p.until)}` : t("forever")}</p>`} ${p.moderator && renderTemplate`<p class="ap-muted">${t("moderator")}: ${p.moderator}</p>`} </div>`)} </section> <section class="ap-list"> <h2>${t("forms")}</h2> ${forms.length === 0 && renderTemplate`<div class="ap-card soft"><p>${t("noForms")}</p></div>`} ${forms.map((form) => {
    const ok = meets(form) && !blocked && !waiting;
    return renderTemplate`<div${addAttribute(["ap-card", { soft: !ok }], "class:list")}> <div class="ap-row"><h3>${form.icon && renderTemplate`${renderComponent($$result3, "Icon", $$Icon, { "name": `ph:${form.icon}-fill`, "width": "18", "height": "18", "class": "ap-ico" })}`}${form.name}</h3>${!ok && renderTemplate`<span class="ap-chip">${t("locked")}</span>`}</div> ${form.short_description && renderTemplate`<p class="ap-muted">${form.short_description}</p>`} ${!meets(form) && renderTemplate`<p class="ap-muted">${t("needs", { types: typeList(form.requirement_types) })}</p>`} <div><a${addAttribute(["ap-btn", { off: !ok }], "class:list")}${addAttribute(ok ? `/appeal/${guild.path ?? guild.id}/form/${form.id}` : void 0, "href")}${addAttribute(!ok, "aria-disabled")}>${t("openForm")}</a></div> </div>`;
  })} </section> <section class="ap-list"> <h2>${t("yourAppeals")}</h2> ${mine.length === 0 && renderTemplate`<p class="ap-muted">${t("noAppeals")}</p>`} ${mine.map((s) => renderTemplate`<a class="ap-card"${addAttribute(`/appeal/${guild.path ?? guild.id}/status/${s.id}`, "href")} style="text-decoration:none"> <div class="ap-row"><h3>${s.form_name}</h3><span${addAttribute(["ap-chip", s.status], "class:list")}>${t(`status_${s.status}`)}</span></div> <p class="ap-muted">${t("sent", { when: timeAgo(s.created_at, lang) })}</p> </a>`)} </section> ` })}`}` })}`;
}, "/home/runner/work/petto-web/petto-web/src/components/AppealLanding.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const site = await loadSite(Astro2);
  if ("redirect" in site) return Astro2.redirect(site.redirect, 301);
  if ("status" in site) return new Response(site.status === 404 ? "Not found" : "Unavailable", { status: site.status });
  const { id, path, lang, config, guild, session } = site;
  const loginHref = `/appeal/${path}/login`;
  let state = !config.enabled ? "closed" : session ? "ready" : "login";
  let punishments = [];
  let blocked = false;
  let blockedUntil = null;
  let opensAt = null;
  let forms = [];
  let mine = [];
  if (state === "ready" && session) {
    const [punishmentsRes, liveForms, mySubmissions] = await Promise.all([
      callBot(Astro2, id, "punishments", { userId: session.userId }),
      loadLiveForms(Astro2, id),
      loadUserSubmissions(Astro2, id, session.userId)
    ]);
    if (!punishmentsRes.ok) state = "unavailable";
    else {
      punishments = punishmentsRes.payload.punishments ?? [];
      blocked = Boolean(punishmentsRes.payload.blocked);
      blockedUntil = punishmentsRes.payload.blockedUntil ?? null;
      opensAt = punishmentsRes.payload.opensAt ?? null;
    }
    forms = liveForms ?? [];
    mine = mySubmissions ?? [];
  }
  Astro2.response.headers.set("Cache-Control", "private, no-store");
  return renderTemplate`${renderComponent($$result, "AppealLanding", $$AppealLanding, { "lang": lang, "guild": guild, "config": config, "state": state, "loginHref": loginHref, "user": session ? { name: session.username, avatar: session.avatar } : null, "punishments": punishments, "blocked": blocked, "blockedUntil": blockedUntil, "opensAt": opensAt, "forms": forms, "mine": mine })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/appeal/[id]/index.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/appeal/[id]/index.astro";
const $$url = "/appeal/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
