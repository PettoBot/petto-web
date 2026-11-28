import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../chunks/Icon_CDiFdbJV.mjs';
import { g as guildLetterStyle, a as guildLetter } from '../../../chunks/DashUserCard_BiWYM-Hw.mjs';
import { $ as $$DashMeLayout } from '../../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { a as $$DashClientI18N } from '../../../chunks/Base_Di2YHjFe.mjs';
import { $ as $$DashPanelHead } from '../../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashPanelEmpty } from '../../../chunks/DashPanelEmpty_Dm0QkRuf.mjs';
import { $ as $$DashServerSort } from '../../../chunks/DashServerSort_CzhE8aK3.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                         */
import { g as getDashboardSession } from '../../../chunks/dashAuth_uqFK7-ED.mjs';
import { i as invalidateBotGuildCaches, a as getBotGuildList, b as getCachedUserGuilds } from '../../../chunks/discordCache_CnRINZ-g.mjs';
import { l as leaveGuild, c as canManageGuild } from '../../../chunks/discord_CxeBz2tv.mjs';
import { g as getEnv } from '../../../chunks/env_WnBvzCjc.mjs';
import { i as isPettoOwner } from '../../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashAdminServers = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashAdminServers;
  const dashLang = getDashLang(Astro2);
  const numLocale = dashLocale(dashLang);
  const dt = makeT(dashLang);
  const { user, guilds, mine = [], error, left = false } = Astro2.props;
  const mineSet = new Set(mine);
  const groups = [
    { key: "mine", title: dt("Your servers"), list: guilds.filter((g) => mineSet.has(g.id)) },
    { key: "other", title: dt("Other servers"), list: guilds.filter((g) => !mineSet.has(g.id)) }
  ].filter((group) => group.list.length);
  const split = groups.length > 1;
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-servers", "pageTitle": "All servers", "data-astro-cid-3qsrsahh": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="as-wrap" data-astro-cid-3qsrsahh> ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("All servers"), "eyebrow": dt("Staff"), "icon": "ph:hard-drives-fill", "back": false, "data-astro-cid-3qsrsahh": true })} ${error === "invalid" && renderTemplate`<div class="as-alert error" data-astro-cid-3qsrsahh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-3qsrsahh": true })} ${dt("That request was not valid.")}</div>`} ${error === "leave_failed" && renderTemplate`<div class="as-alert error" data-astro-cid-3qsrsahh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-3qsrsahh": true })} ${dt("Discord did not let the bot leave that server.")}</div>`} ${error === "discord_unavailable" && renderTemplate`<div class="as-alert error" data-astro-cid-3qsrsahh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-3qsrsahh": true })} ${dt("Discord did not answer. Reload in a few seconds.")}</div>`} ${left && renderTemplate`<div class="as-alert success" data-astro-cid-3qsrsahh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "data-astro-cid-3qsrsahh": true })} ${dt("Petto left the server.")}</div>`} <div class="as-toolbar" data-astro-cid-3qsrsahh> <label class="as-search" data-astro-cid-3qsrsahh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass", "width": "15", "height": "15", "data-astro-cid-3qsrsahh": true })}<input id="as-filter" type="search"${addAttribute(dt("Search by name or ID"), "placeholder")} autocomplete="off" data-astro-cid-3qsrsahh></label> <div class="as-toolbar-end" data-astro-cid-3qsrsahh> ${guilds.length > 1 && renderTemplate`${renderComponent($$result2, "DashServerSort", $$DashServerSort, { "targets": ".as-list", "data-astro-cid-3qsrsahh": true })}`} <span class="as-count" data-astro-cid-3qsrsahh><strong id="as-shown" data-astro-cid-3qsrsahh>${guilds.length}</strong> ${dt("of {a} servers", { a: guilds.length })}</span> </div> </div> ${guilds.length === 0 ? renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:hard-drives-fill", "text": dt("No servers found."), "data-astro-cid-3qsrsahh": true })}` : groups.map((group) => renderTemplate`<section class="as-group"${addAttribute(group.key, "data-group")} data-astro-cid-3qsrsahh> ${split && renderTemplate`<h2 class="as-group-title" data-astro-cid-3qsrsahh>${group.title} <span data-astro-cid-3qsrsahh>${group.list.length}</span></h2>`} <div class="as-list dgl-stagger" data-astro-cid-3qsrsahh> ${group.list.map((g) => renderTemplate`<article class="as-row"${addAttribute(`${g.name} ${g.id}`.toLowerCase(), "data-search")}${addAttribute(g.name.toLowerCase(), "data-name")}${addAttribute(g.memberCount !== null ? String(g.memberCount) : "", "data-members")} data-astro-cid-3qsrsahh> ${g.icon ? renderTemplate`<img class="as-icon"${addAttribute(g.icon, "src")} alt="" width="42" height="42" loading="lazy" data-astro-cid-3qsrsahh>` : renderTemplate`<div class="as-icon as-icon-fallback"${addAttribute(guildLetterStyle(g.name), "style")} data-astro-cid-3qsrsahh>${guildLetter(g.name)}</div>`} <div class="as-main" data-astro-cid-3qsrsahh> <strong data-astro-cid-3qsrsahh>${g.name}</strong> <span data-astro-cid-3qsrsahh>${g.memberCount !== null ? dt("{n} members", { n: g.memberCount.toLocaleString(numLocale) }) : dt("Members unknown")}</span> <small data-astro-cid-3qsrsahh>${g.id}</small> </div> <div class="as-actions" data-astro-cid-3qsrsahh> <a class="btn btn-ghost btn-sm"${addAttribute(`/dash/guild/${g.id}/overview`, "href")} data-astro-cid-3qsrsahh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "14", "height": "14", "data-astro-cid-3qsrsahh": true })} ${dt("View panel")}</a> <form method="POST" data-leave data-no-dirty${addAttribute(g.name, "data-name")}${addAttribute(dt("Remove Petto from {name}? The bot will leave the server.", { name: g.name }), "data-confirm")} data-astro-cid-3qsrsahh> <input type="hidden" name="action" value="leave" data-astro-cid-3qsrsahh> <input type="hidden" name="guild_id"${addAttribute(g.id, "value")} data-astro-cid-3qsrsahh> <button class="btn btn-danger btn-sm" type="submit" data-astro-cid-3qsrsahh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sign-out-fill", "width": "14", "height": "14", "data-astro-cid-3qsrsahh": true })} ${dt("Remove")}</button> </form> </div> </article>`)} </div> </section>`)} ${guilds.length > 0 && renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "id": "as-nomatch", "hidden": true, "icon": "ph:magnifying-glass", "text": dt("No server matches your search."), "data-astro-cid-3qsrsahh": true })}`} </div> ` })} ${renderComponent($$result, "DashClientI18n", $$DashClientI18N, { "data-astro-cid-3qsrsahh": true })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashAdminServers.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Servers = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Servers;
  const session = await getDashboardSession(Astro2);
  if (!session) return Astro2.redirect("/dash");
  if (!isPettoOwner(Astro2, session.userId)) return Astro2.redirect("/dash/manage?error=forbidden");
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  if (!botToken) return Astro2.redirect("/dash/manage?error=server_not_configured");
  if (Astro2.request.method.toUpperCase() === "POST") {
    const origin = Astro2.request.headers.get("origin");
    if (origin && origin !== Astro2.url.origin) return Astro2.redirect("/dash/admin/servers?error=invalid");
    const form = await Astro2.request.formData();
    const guildId = String(form.get("guild_id") ?? "");
    if (String(form.get("action") ?? "") !== "leave" || !/^\d{15,22}$/.test(guildId)) return Astro2.redirect("/dash/admin/servers?error=invalid");
    const ok = await leaveGuild(guildId, botToken);
    invalidateBotGuildCaches(botToken);
    return Astro2.redirect(ok ? "/dash/admin/servers?left=1" : "/dash/admin/servers?error=leave_failed");
  }
  let guilds = [];
  let unavailable = false;
  const [listResult, mineResult] = await Promise.all([
    getBotGuildList(botToken).then((list) => ({ list }), () => null),
    getCachedUserGuilds(session.accessToken, Astro2.request).catch(() => null)
  ]);
  if (listResult) {
    guilds = listResult.list.sort((a, b) => (b.memberCount ?? -1) - (a.memberCount ?? -1) || a.name.localeCompare(b.name));
  } else {
    unavailable = true;
  }
  const mine = (mineResult ?? []).filter(canManageGuild).map((g) => String(g.id));
  const error = unavailable ? "discord_unavailable" : Astro2.url.searchParams.get("error") ?? void 0;
  const left = Astro2.url.searchParams.get("left") === "1";
  return renderTemplate`${renderComponent($$result, "DashAdminServers", $$DashAdminServers, { "user": session, "guilds": guilds, "mine": mine, "error": error, "left": left })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/admin/servers.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/admin/servers.astro";
const $$url = "/dash/admin/servers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Servers,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
