import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { b as $$InlineIcon } from '../../chunks/Base_Di2YHjFe.mjs';
import { $ as $$DashMeLayout, l as loadSwitcherServers } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { g as guildLetterStyle, a as guildLetter } from '../../chunks/DashUserCard_BiWYM-Hw.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../chunks/dash_CORIPvM-.mjs';
import { l as localePath } from '../../chunks/ui_C1MR3LHJ.mjs';
import { c as changelogEntries } from '../../chunks/changelogFeed_DUjcvSF3.mjs';
import { u as userCardData, b as userHeaderArt, o as accountAge, g as getDashboardSession, q as profileOverview } from '../../chunks/dashAuth_uqFK7-ED.mjs';
/* empty css                                 */
import { g as getPersonalSettings } from '../../chunks/dashPersonal_Do7ta8qg.mjs';
import { s as getPremiumSnapshot, t as read } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashMe = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashMe;
  const { user, overview, names = [], unavailable = false } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const locale = dashLocale(lang);
  const date = (iso) => iso ? new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso)) : null;
  const shortDate = (iso) => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
  const statusLabel = { active: dt("Active"), pending: dt("Pending"), past_due: dt("Past due"), canceled: dt("Canceled"), expired: dt("Expired"), free: dt("Free") };
  const { servers, premium, settings } = overview;
  const card = userCardData(user);
  const art = userHeaderArt(user);
  const avatar = card.avatar ? card.avatar.replace(/size=64$/, "size=256") : null;
  const age = accountAge(overview.created, Date.now());
  const ageText = !age ? null : age.unit === "year" ? age.n === 1 ? dt("1 year on Discord") : dt("{a} years on Discord", { a: age.n }) : age.n === 1 ? dt("1 month on Discord") : dt("{a} months on Discord", { a: age.n });
  const langName = { en: "English", es: "Espa\xF1ol", "pt-BR": "Portugu\xEAs (Brasil)" };
  const premiumNote = premium.status === "active" ? [premium.slotsTotal ? dt("{a} of {b} slots used", { a: premium.slotsUsed, b: premium.slotsTotal }) : null, premium.endsAt ? dt("Active until {d}", { d: date(premium.endsAt) }) : null].filter(Boolean).join(" \xB7 ") : "";
  const slotsPercent = premium.slotsTotal ? Math.min(100, Math.round(premium.slotsUsed / premium.slotsTotal * 100)) : 0;
  const stats = [
    { icon: "ph:hard-drives-fill", label: dt("Servers you manage"), value: servers.managed.toLocaleString(locale) },
    { icon: "ph:check-circle-fill", label: dt("With Petto"), value: servers.withPetto.toLocaleString(locale) },
    { icon: "ph:crown-fill", label: dt("With Premium"), value: servers.premium.toLocaleString(locale), note: premium.status === "active" ? dt("Premium: {a}", { a: statusLabel.active }) : "" },
    ...settings.reputation ? [{ icon: "ph:heart-fill", label: dt("Reputation"), value: settings.reputation.points.toLocaleString(locale), note: settings.reputation.servers === 1 ? dt("In 1 server") : dt("In {a} servers", { a: settings.reputation.servers }) }] : []
  ];
  const latest = (await changelogEntries(lang, Astro2))[0];
  const plain = (text) => text.replace(/`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  const clip = (text, max) => text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}\u2026` : text;
  const news = latest ? latest.items.slice(0, 3).map((item) => clip(plain(item), 150)) : [];
  const changelogHref = `${localePath[lang]}/changelog`;
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "overview", "pageTitle": "Overview", "data-astro-cid-jkesfjex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="am-hero" data-astro-cid-jkesfjex> <div${addAttribute(["am-banner", `am-banner-${art.kind}`], "class:list")}${addAttribute(art.kind === "color" ? `--am-tint:${art.color}` : void 0, "style")} aria-hidden="true" data-astro-cid-jkesfjex> ${art.kind === "image" && renderTemplate`<picture data-astro-cid-jkesfjex> ${art.animated && renderTemplate`<source media="(prefers-reduced-motion: reduce)"${addAttribute(art.still, "srcset")} data-astro-cid-jkesfjex>`} <img${addAttribute(art.animated ?? art.still, "src")} alt="" width="900" height="200" decoding="async" referrerpolicy="no-referrer" data-astro-cid-jkesfjex> </picture>`} ${art.kind === "art" && renderTemplate`<img src="/assets/banner-default.webp" alt="" width="900" height="200" decoding="async" draggable="false" class="am-banner-petto" data-astro-cid-jkesfjex>`} </div> <div class="am-hero-body" data-astro-cid-jkesfjex> <span class="am-av" data-astro-cid-jkesfjex> ${avatar ? renderTemplate`<img${addAttribute(avatar, "src")} alt="" width="84" height="84" referrerpolicy="no-referrer" data-astro-cid-jkesfjex>` : renderTemplate`<span class="am-av-fallback" data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-fill", "width": "30", "height": "30", "data-astro-cid-jkesfjex": true })}</span>`} ${card.decoration && renderTemplate`<picture class="am-deco" data-astro-cid-jkesfjex> <source media="(prefers-reduced-motion: reduce)"${addAttribute(card.decoration.still, "srcset")} data-astro-cid-jkesfjex> <img${addAttribute(card.decoration.animated, "src")} alt="" width="96" height="96" decoding="async" data-astro-cid-jkesfjex> </picture>`} </span> <div class="am-who" data-astro-cid-jkesfjex> <h1 data-astro-cid-jkesfjex>${dt("Welcome back, {a}", { a: overview.name || user.username })}</h1> <p class="am-sub" data-astro-cid-jkesfjex> ${overview.handle && renderTemplate`<span class="am-handle" data-astro-cid-jkesfjex>@${overview.handle}</span>`} ${ageText && renderTemplate`<span class="am-chip" data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:calendar-check-fill", "width": "13", "height": "13", "data-astro-cid-jkesfjex": true })}${ageText}</span>`} ${overview.created && renderTemplate`<span class="am-since" data-astro-cid-jkesfjex>${dt("Joined Discord on {d}", { d: date(overview.created) })}</span>`} </p> </div> <div class="am-actions" data-astro-cid-jkesfjex> <a class="btn btn-primary btn-sm" href="/dash/manage" data-sk="grid" data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "14", "height": "14", "data-astro-cid-jkesfjex": true })}${dt("Manage servers")}</a> <a class="btn btn-ghost btn-sm" href="/dash/premium" data-sk="cards" data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "14", "height": "14", "data-astro-cid-jkesfjex": true })}Premium</a> <a class="btn btn-ghost btn-sm" href="https://petto.sbs/support" target="_blank" rel="noopener" data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:headset-fill", "width": "14", "height": "14", "data-astro-cid-jkesfjex": true })}${dt("Support")}</a> </div> </div> </div> <div class="am-stats"${addAttribute(`--am-cols:${stats.length}`, "style")} data-astro-cid-jkesfjex> ${stats.map((stat) => renderTemplate`<div class="am-stat" data-astro-cid-jkesfjex> ${renderComponent($$result2, "Icon", $$Icon, { "name": stat.icon, "width": "44", "height": "44", "class": "am-stat-icon", "data-astro-cid-jkesfjex": true })} <strong data-astro-cid-jkesfjex>${stat.value}</strong> <span data-astro-cid-jkesfjex>${stat.label}</span> ${stat.note && renderTemplate`<small data-astro-cid-jkesfjex>${stat.note}</small>`} </div>`)} </div> <div class="ac-grid am-grid" data-astro-cid-jkesfjex> <section class="ac-card ac-wide" data-astro-cid-jkesfjex> <div class="ac-card-head" data-astro-cid-jkesfjex><h2 data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "16", "height": "16", "data-astro-cid-jkesfjex": true })}${dt("Your servers")}</h2><a href="/dash/manage" data-sk="grid" data-astro-cid-jkesfjex>${dt("See all")}</a></div> ${servers.top.length > 0 ? renderTemplate`<ul class="am-servers" data-astro-cid-jkesfjex> ${servers.top.map((g) => renderTemplate`<li data-astro-cid-jkesfjex> <a${addAttribute(`/dash/guild/${g.id}/overview`, "href")} data-astro-cid-jkesfjex> ${g.icon ? renderTemplate`<img${addAttribute(g.icon, "src")} alt="" width="38" height="38" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-jkesfjex>` : renderTemplate`<span class="am-sv-fallback"${addAttribute(guildLetterStyle(g.name), "style")} data-astro-cid-jkesfjex>${guildLetter(g.name)}</span>`} <span class="am-sv-name" data-astro-cid-jkesfjex>${g.name}</span> ${g.premium && renderTemplate`<span class="am-sv-premium" data-astro-cid-jkesfjex>${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:crown-fill", "width": "11", "height": "11", "data-astro-cid-jkesfjex": true })}Premium</span>`} <span class="am-sv-go" data-astro-cid-jkesfjex>${dt("Manage")}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right-bold", "width": "12", "height": "12", "data-astro-cid-jkesfjex": true })}</span> </a> </li>`)} </ul>` : renderTemplate`<p class="ac-muted" data-astro-cid-jkesfjex>${unavailable ? dt("Discord did not answer in time. Reload in a few seconds to load your servers.") : dt("Petto is not in any of your servers yet.")}</p>`} </section> ${servers.invite.length > 0 && renderTemplate`<section class="ac-card ac-wide am-invite" data-astro-cid-jkesfjex> <div class="ac-card-head" data-astro-cid-jkesfjex><h2 data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-jkesfjex": true })}${dt("Bring Petto to your other servers")}</h2>${servers.toInvite > servers.invite.length && renderTemplate`<a href="/dash/manage" data-sk="grid" data-astro-cid-jkesfjex>${dt("And {a} more", { a: servers.toInvite - servers.invite.length })}</a>`}</div> <ul class="am-invites" data-astro-cid-jkesfjex> ${servers.invite.map((g) => renderTemplate`<li data-astro-cid-jkesfjex> ${g.icon ? renderTemplate`<img${addAttribute(g.icon, "src")} alt="" width="34" height="34" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-jkesfjex>` : renderTemplate`<span class="am-sv-fallback"${addAttribute(guildLetterStyle(g.name), "style")} data-astro-cid-jkesfjex>${guildLetter(g.name)}</span>`} <span class="am-sv-name" data-astro-cid-jkesfjex>${g.name}</span> <a class="btn btn-ghost btn-sm"${addAttribute(g.href, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-jkesfjex": true })}${dt("Invite")}</a> </li>`)} </ul> </section>`} <section class="ac-card" data-astro-cid-jkesfjex> <div class="ac-card-head" data-astro-cid-jkesfjex><h2 data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "16", "height": "16", "data-astro-cid-jkesfjex": true })}Premium</h2><span${addAttribute(["ac-pill", `is-${premium.status}`], "class:list")} data-astro-cid-jkesfjex>${statusLabel[premium.status] ?? premium.status}</span></div> <p class="ac-muted" data-astro-cid-jkesfjex>${premiumNote || dt("Unlock the paid modules and the custom look for your servers.")}</p> ${premium.slotsTotal > 0 && renderTemplate`<div class="am-meter" role="img"${addAttribute(dt("{a} of {b} slots used", { a: premium.slotsUsed, b: premium.slotsTotal }), "aria-label")} data-astro-cid-jkesfjex><span${addAttribute(`width:${slotsPercent}%`, "style")} data-astro-cid-jkesfjex></span></div>`} <div class="ac-btns" data-astro-cid-jkesfjex><a class="btn btn-ghost btn-sm" href="/dash/premium" data-sk="cards" data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "13", "height": "13", "data-astro-cid-jkesfjex": true })}${dt("Manage Premium")}</a></div> </section> <section class="ac-card" data-astro-cid-jkesfjex> <div class="ac-card-head" data-astro-cid-jkesfjex><h2 data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sliders-horizontal-fill", "width": "16", "height": "16", "data-astro-cid-jkesfjex": true })}${dt("Your settings")}</h2><a href="/dash/preferences" data-sk="form" data-astro-cid-jkesfjex>${dt("Preferences")}</a></div> <dl class="ac-rows" data-astro-cid-jkesfjex> <div data-astro-cid-jkesfjex><dt data-astro-cid-jkesfjex>${dt("Dashboard language")}</dt><dd data-astro-cid-jkesfjex>${langName[lang] ?? lang}</dd></div> <div data-astro-cid-jkesfjex><dt data-astro-cid-jkesfjex>${dt("Personal prefix")}</dt><dd data-astro-cid-jkesfjex>${settings.prefix ? renderTemplate`<code class="ac-code" data-astro-cid-jkesfjex>${settings.prefix}</code>` : renderTemplate`<span class="am-dim" data-astro-cid-jkesfjex>${dt("Not set")}</span>`}</dd></div> ${settings.reputation && renderTemplate`<div data-astro-cid-jkesfjex><dt data-astro-cid-jkesfjex>${dt("Reputation")}</dt><dd data-astro-cid-jkesfjex>${settings.reputation.points.toLocaleString(locale)}<small data-astro-cid-jkesfjex>${settings.reputation.servers === 1 ? dt("In 1 server") : dt("In {a} servers", { a: settings.reputation.servers })}</small></dd></div>`} </dl> </section> ${names.length > 0 && renderTemplate`<section class="ac-card" data-astro-cid-jkesfjex> <div class="ac-card-head" data-astro-cid-jkesfjex><h2 data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise", "width": "16", "height": "16", "data-astro-cid-jkesfjex": true })}${dt("Recent names")}</h2><a href="/dash/history" data-sk="list" data-astro-cid-jkesfjex>${dt("Open history")}</a></div> <ul class="am-names" data-astro-cid-jkesfjex> ${names.map((n) => renderTemplate`<li data-astro-cid-jkesfjex><span class="am-name" data-astro-cid-jkesfjex>${n.value}</span><time${addAttribute(n.seen_at, "datetime")} data-astro-cid-jkesfjex>${shortDate(n.seen_at)}</time></li>`)} </ul> </section>`} ${news.length > 0 && latest && renderTemplate`<section${addAttribute(["ac-card", { "ac-wide": names.length === 0 }], "class:list")} data-astro-cid-jkesfjex> <div class="ac-card-head" data-astro-cid-jkesfjex><h2 data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sparkle-fill", "width": "16", "height": "16", "data-astro-cid-jkesfjex": true })}${dt("What is new in Petto")}</h2><a${addAttribute(changelogHref, "href")} data-astro-cid-jkesfjex>${dt("Changelog")}</a></div> <p class="am-ver" data-astro-cid-jkesfjex><b data-astro-cid-jkesfjex>v${latest.display ?? latest.version}</b>${latest.name && renderTemplate`<span data-astro-cid-jkesfjex> · ${latest.name}</span>`}<span class="am-dim" data-astro-cid-jkesfjex> · ${latest.date}</span></p> <ul class="ac-list" data-astro-cid-jkesfjex> ${news.map((item) => renderTemplate`<li data-astro-cid-jkesfjex>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-jkesfjex": true })}<span data-astro-cid-jkesfjex>${item}</span></li>`)} </ul> </section>`} </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashMe.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Me = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Me;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const [servers, premium, personal, names] = await Promise.all([
    loadSwitcherServers(Astro2, session),
    getPremiumSnapshot(Astro2, session.userId).catch(() => null),
    getPersonalSettings(Astro2, session.userId).catch(() => ({ prefix: null, reputation: null })),
    // The last names Petto saw for the account (the same rows as the History page; none when the history is off or empty).
    read(Astro2, "identity_history", `user_id=eq.${session.userId}&kind=eq.name&select=value,seen_at&order=seen_at.desc&limit=3`)
  ]);
  const overview = profileOverview({
    session,
    servers,
    premium: premium && { status: premium.status, slotsUsed: premium.slotsUsed, slotsTotal: premium.slotsTotal, periodEnd: premium.entitlement?.current_period_end },
    prefix: personal.prefix,
    reputation: personal.reputation,
    top: 6
  });
  return renderTemplate`${renderComponent($$result, "DashMe", $$DashMe, { "user": session, "overview": overview, "names": names, "unavailable": servers.unavailable })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/me.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/me.astro";
const $$url = "/dash/me";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Me,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
