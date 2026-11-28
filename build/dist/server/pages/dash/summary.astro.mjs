import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                      */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo } from '../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashSummary = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashSummary;
  const { user, data, state } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const number = new Intl.NumberFormat(lang);
  const planNames = { free: dt("Free"), bronze: dt("Bronze"), silver: dt("Silver"), gold: dt("Gold") };
  const hours = data ? Math.floor(data.totals.voiceSeconds / 3600) : 0;
  const minutes = data ? Math.floor(data.totals.voiceSeconds % 3600 / 60) : 0;
  const BUFIS = [
    { id: "bufi-normal", name: dt("Normal"), color: "#8a8f98" },
    { id: "bufi-silver", name: dt("Silver"), color: "#b8bcc4" },
    { id: "bufi-girl", name: dt("Girl"), color: "#ff3d8f" },
    { id: "bufi-boy", name: dt("Boy"), color: "#1e90ff" },
    { id: "bufi-bu", name: dt("Bu"), color: "#f4cf3a" },
    { id: "bufi-black-friday", name: dt("Black Friday"), color: "#3a3a42" }
  ];
  const owned = new Set((state?.owned ?? []).map((row) => row.id));
  const have = BUFIS.filter((bufi) => owned.has(bufi.id)).length;
  const plan = state?.plan ?? "free";
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "summary", "pageTitle": "Summary" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Summary"), "eyebrow": dt("Main"), "icon": "ph:fire-fill", "back": false })} ${!data && renderTemplate`${maybeRenderHead()}<p class="bd-down" role="alert">${dt("Petto did not answer. Try again in a moment.")}</p>`}${data && renderTemplate`<div class="sm"> <div class="sm-tiles" role="group"${addAttribute(dt("Summary"), "aria-label")}> <article class="bd-card sm-tile"><span>${dt("Plan")}</span><b>${planNames[plan] ?? plan}</b></article> <article class="bd-card sm-tile"><span>${dt("Messages")}</span><b>${number.format(data.totals.messages)}</b></article> <article class="bd-card sm-tile"><span>${dt("In voice")}</span><b>${hours > 0 ? dt("{h} h {m} min", { h: String(hours), m: String(minutes) }) : dt("{m} min", { m: String(minutes) })}</b></article> <article class="bd-card sm-tile sm-fire"><span>${dt("Best streak")}</span><b>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:fire-fill", "width": "20", "height": "20" })}${dt("{n} days", { n: number.format(data.bestEver) })}</b></article> </div> <section class="bd-card sm-card" aria-labelledby="sm-streaks"> <header><h2 id="sm-streaks">${dt("My streaks by server")}</h2><span>${dt("Freezes: {n}", { n: String(data.freezes) })}</span></header> ${data.servers.length === 0 ? renderTemplate`<p class="sm-empty">${dt("You have no streak yet. Chat or join a voice channel in a server with streaks to start one.")}</p>` : renderTemplate`<ul class="sm-list"> ${data.servers.map((row) => renderTemplate`<li class="sm-row"> ${row.icon ? renderTemplate`<img${addAttribute(row.icon, "src")} alt="" width="36" height="36" loading="lazy">` : renderTemplate`<span class="sm-ph" aria-hidden="true"></span>`} <div class="sm-name"><strong>${row.name ?? dt("Server")}</strong><span>${row.activeToday ? dt("Done today") : row.current > 0 ? dt("Be active today to keep it") : dt("No streak now")}</span></div> <div class="sm-days"${addAttribute(dt("Best: {n} days", { n: String(row.best) }), "title")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:fire-fill", "width": "16", "height": "16" })}<b>${dt("{n} days", { n: number.format(row.current) })}</b></div> </li>`)} </ul>`} </section> <section class="bd-card sm-card" aria-labelledby="sm-bufis"> <header><h2 id="sm-bufis">${dt("Bufis")}</h2><span>${dt("{n} of {m} owned", { n: String(have), m: String(BUFIS.length) })}</span></header> <ul class="sm-bufis"> ${BUFIS.map((bufi) => renderTemplate`<li${addAttribute(["sm-bufi", { "is-own": owned.has(bufi.id) }], "class:list")}${addAttribute(`--bufi:${bufi.color}`, "style")}> <img class="sm-art"${addAttribute(`/assets/badges/${bufi.id}.png`, "src")} alt="" width="64" height="64" loading="lazy"> <b>${bufi.name}</b> <em>${owned.has(bufi.id) ? dt("Yours") : dt("Not yet")}</em> </li>`)} </ul> <a class="btn btn-sm sm-more" href="/dash/badges">${dt("See the badges")}</a> </section> </div>`}` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashSummary.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Summary = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Summary;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const [summary, state] = await Promise.all([callPettoCeramos(Astro2, session.userId, "summary"), callPettoCeramos(Astro2, session.userId, "state")]);
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const servers = summary.ok ? summary.data.servers : [];
  const infos = botToken ? await Promise.all(servers.map((entry) => getGuildInfo(entry.guildId, botToken).catch(() => null))) : [];
  const rows = servers.map((entry, index) => ({ ...entry, name: infos[index]?.name ?? null, icon: infos[index]?.icon ?? null })).sort((a, b) => b.current - a.current);
  return renderTemplate`${renderComponent($$result, "DashSummary", $$DashSummary, { "user": session, "data": summary.ok ? { ...summary.data, servers: rows } : null, "state": state.ok ? state.data : null })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/summary.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/summary.astro";
const $$url = "/dash/summary";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Summary,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
