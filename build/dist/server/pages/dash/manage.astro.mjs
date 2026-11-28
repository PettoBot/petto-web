import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { g as guildLetterStyle, a as guildLetter } from '../../chunks/DashUserCard_BiWYM-Hw.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashPanelEmpty } from '../../chunks/DashPanelEmpty_Dm0QkRuf.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../chunks/dash_CORIPvM-.mjs';
import { $ as $$DashServerSort } from '../../chunks/DashServerSort_CzhE8aK3.mjs';
/* empty css                                    */
import { g as getDashboardSession, n as guildsWithRoleAccess } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { c as canManageGuild, d as guildIconUrl } from '../../chunks/discord_CxeBz2tv.mjs';
import { b as getCachedUserGuilds, g as getCachedBotGuildIds, a as getBotGuildList } from '../../chunks/discordCache_CnRINZ-g.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { c as canEditPartners } from '../../chunks/partners_BiJzadVG.mjs';
import { g as getPremiumGuildIds, i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { b as botInviteUrl } from '../../chunks/dashSwitcher_BIhzOPcN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashManage = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashManage;
  const dashLang = getDashLang(Astro2);
  const numLocale = dashLocale(dashLang);
  const dt = makeT(dashLang);
  const { user, guilds, inviteUrl, isOwner, canPartners = false, error } = Astro2.props;
  const withPetto = guilds.filter((g) => g.active);
  const withoutPetto = guilds.filter((g) => !g.active);
  const groups = [
    { key: "with", title: dt("Servers with Petto"), list: withPetto },
    { key: "without", title: dt("Servers without Petto"), list: withoutPetto }
  ].filter((group) => group.list.length);
  const staffLinks = [
    isOwner && { href: "/dash/admin", icon: "ph:gift-fill", label: dt("Owner grants"), sk: "form" },
    isOwner && { href: "/dash/admin/servers", icon: "ph:hard-drives-fill", label: dt("All servers"), sk: "list" },
    isOwner && { href: "/dash/team", icon: "ph:users-three-fill", label: dt("Team"), sk: "list" },
    canPartners && { href: "/dash/partners-admin", icon: "ph:handshake-fill", label: dt("Partners"), sk: "list" },
    canPartners && { href: "/dash/credits-admin", icon: "ph:heart-fill", label: dt("Credits"), sk: "list" },
    canPartners && { href: "/dash/appeal-names", icon: "ph:scales-fill", label: dt("Appeal names"), sk: "list" }
  ].filter(Boolean);
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "servers", "pageTitle": "Your servers", "data-astro-cid-bec2uqdr": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="dm-wrap" data-astro-cid-bec2uqdr> ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Your servers"), "eyebrow": dt("Dashboard"), "icon": "ph:squares-four-fill", "back": false, "data-astro-cid-bec2uqdr": true }, { "default": ($$result3) => renderTemplate` <a class="btn btn-ghost btn-sm" href="/dash/me" data-astro-cid-bec2uqdr>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:user-circle-fill", "width": "13", "height": "13", "data-astro-cid-bec2uqdr": true })} ${dt("My profile")}</a> <a class="btn btn-ghost btn-sm" href="/dash/premium" data-sk="cards" data-astro-cid-bec2uqdr>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "13", "height": "13", "data-astro-cid-bec2uqdr": true })} ${dt("Premium servers")}</a> <a class="btn btn-ghost btn-sm" href="/dash/history" data-sk="cards" data-astro-cid-bec2uqdr>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:clock", "width": "13", "height": "13", "data-astro-cid-bec2uqdr": true })} ${dt("History")}</a> ` })} ${staffLinks.length > 0 && renderTemplate`<nav class="dm-staff"${addAttribute(dt("Staff"), "aria-label")} data-astro-cid-bec2uqdr> <span class="dm-staff-label" data-astro-cid-bec2uqdr>${dt("Staff")}</span> <div class="dm-staff-links" data-astro-cid-bec2uqdr> ${staffLinks.map((link) => renderTemplate`<a class="dm-staff-link"${addAttribute(link.href, "href")}${addAttribute(link.sk, "data-sk")} data-astro-cid-bec2uqdr>${renderComponent($$result2, "Icon", $$Icon, { "name": link.icon, "width": "14", "height": "14", "data-astro-cid-bec2uqdr": true })}${link.label}</a>`)} </div> </nav>`} ${error === "discord_unavailable" ? renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "tone": "error", "icon": "ph:cloud-slash-fill", "text": dt("Discord no respondi\xF3 a tiempo. Recarga la p\xE1gina en unos segundos para volver a cargar tus servidores."), "data-astro-cid-bec2uqdr": true })}` : guilds.length === 0 ? renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:hard-drives-fill", "text": dt("No servers found where you can manage Petto. You need Manage Server or Administrator permission on a server first."), "data-astro-cid-bec2uqdr": true })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <div class="dm-tools" data-astro-cid-bec2uqdr> ${guilds.length > 6 && renderTemplate`<label class="dm-search" data-astro-cid-bec2uqdr> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:magnifying-glass", "width": "14", "height": "14", "data-astro-cid-bec2uqdr": true })} <input type="search" id="dm-search"${addAttribute(dt("Search servers"), "placeholder")}${addAttribute(dt("Search servers"), "aria-label")} autocomplete="off" data-astro-cid-bec2uqdr> </label>`} ${withPetto.length > 1 && renderTemplate`${renderComponent($$result3, "DashServerSort", $$DashServerSort, { "targets": ".dm-group[data-group='with'] .dm-grid", "data-astro-cid-bec2uqdr": true })}`} </div> ${groups.map((group) => renderTemplate`<div class="dm-group"${addAttribute(group.key, "data-group")} data-astro-cid-bec2uqdr> <h2 class="dm-group-title" data-astro-cid-bec2uqdr>${group.title} <span class="dm-group-count" data-astro-cid-bec2uqdr>${group.list.length}</span></h2> <div class="dm-grid dgl-stagger" data-astro-cid-bec2uqdr> ${group.list.map((g) => renderTemplate`<article${addAttribute(g.name.toLowerCase(), "data-name")}${addAttribute(g.active && g.memberCount != null ? String(g.memberCount) : "", "data-members")}${addAttribute(["dm-card", { "dm-card-inactive": !g.active, "dm-card-premium": g.premiumActive }], "class:list")} data-astro-cid-bec2uqdr> <div class="dm-card-banner" aria-hidden="true" data-astro-cid-bec2uqdr> ${g.icon ? renderTemplate`<img${addAttribute(g.icon, "src")} alt="" class="dm-card-banner-bg" loading="lazy" decoding="async" data-astro-cid-bec2uqdr>` : renderTemplate`<span class="dm-card-banner-bg dm-letter-bg"${addAttribute(guildLetterStyle(g.name), "style")} data-astro-cid-bec2uqdr></span>`} <span${addAttribute(["dm-plan-badge", { "dm-plan-badge-premium": g.premiumActive }], "class:list")} data-astro-cid-bec2uqdr> ${g.premiumActive && renderTemplate`${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "12", "height": "12", "data-astro-cid-bec2uqdr": true })}`} ${g.premiumActive ? dt("Premium active") : dt("Free")} </span> </div> ${g.icon ? renderTemplate`<img${addAttribute(g.icon, "src")} alt="" class="dm-card-icon" loading="lazy" decoding="async" data-astro-cid-bec2uqdr>` : renderTemplate`<span class="dm-card-icon dm-letter"${addAttribute(guildLetterStyle(g.name), "style")} data-astro-cid-bec2uqdr>${guildLetter(g.name)}</span>`} <div class="dm-card-body" data-astro-cid-bec2uqdr> <div class="dm-card-name"${addAttribute(g.name, "title")} data-astro-cid-bec2uqdr>${g.name}</div> <div class="dm-card-tag" data-astro-cid-bec2uqdr> ${g.premiumActive && renderTemplate`<span class="dm-crown" data-astro-cid-bec2uqdr>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "11", "height": "11", "data-astro-cid-bec2uqdr": true })}${dt("Premium")}</span>`} <span data-astro-cid-bec2uqdr>${g.active ? g.memberCount != null ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate`<span class="dm-nw" data-astro-cid-bec2uqdr>${`${g.memberCount.toLocaleString(numLocale)} ${dt("members")}`}</span> <span class="dm-nw" data-astro-cid-bec2uqdr>${`\xB7 ${dt(g.tag)}`}</span>` })}` : dt(g.tag) : dt("Petto not added")}</span> </div> </div> <div class="dm-card-actions" data-astro-cid-bec2uqdr> ${g.active ? renderTemplate`<a class="btn btn-ghost btn-sm dm-card-btn"${addAttribute(`/dash/guild/${g.id}/overview`, "href")} data-astro-cid-bec2uqdr> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:gear-fill", "width": "13", "height": "13", "data-astro-cid-bec2uqdr": true })} ${dt("Open")} </a>` : renderTemplate`<a class="btn btn-sm dm-card-btn dm-card-btn-invite"${addAttribute(inviteUrl(g.id), "href")} target="_blank" rel="noopener"${addAttribute(g.id, "data-bot-invite")} data-astro-cid-bec2uqdr> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "13", "height": "13", "data-astro-cid-bec2uqdr": true })} ${dt("Add Petto")} </a>`} ${g.active && renderTemplate`<a class="btn btn-ghost btn-sm dm-card-vanity"${addAttribute(`/dash/guild/${g.id}/vanity`, "href")}${addAttribute(dt("Vanity roles"), "title")}${addAttribute(dt("Vanity roles"), "aria-label")} data-astro-cid-bec2uqdr> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:sparkle-fill", "width": "14", "height": "14", "data-astro-cid-bec2uqdr": true })} </a>`} </div> </article>`)} </div> </div>`)}${renderComponent($$result3, "DashPanelEmpty", $$DashPanelEmpty, { "id": "dm-nomatch", "hidden": true, "icon": "ph:magnifying-glass", "text": dt("No server matches your search."), "data-astro-cid-bec2uqdr": true })} ` })}`} </div> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashManage.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const clientId = getEnv(Astro2, "DISCORD_CLIENT_ID");
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const session = await getDashboardSession(Astro2);
  if (!session) {
    return Astro2.redirect("/dash");
  }
  const [guildsResult, botGuildIds, botGuildList] = await Promise.all([
    getCachedUserGuilds(session.accessToken, Astro2.request).then((list) => ({ list }), () => ({ list: null })),
    botToken ? getCachedBotGuildIds(botToken, Astro2.request) : Promise.resolve(/* @__PURE__ */ new Set()),
    // Only used to sort by members, so a failure just leaves the order by name.
    botToken ? getBotGuildList(botToken).catch(() => []) : Promise.resolve([])
  ]);
  const discordUnavailable = guildsResult.list === null;
  const manageable = (guildsResult.list ?? []).filter(canManageGuild);
  const memberCounts = new Map(botGuildList.map((guild) => [guild.id, guild.memberCount]));
  const manageableIds = new Set(manageable.map((g) => g.id));
  const roleCandidates = (guildsResult.list ?? []).filter((g) => !manageableIds.has(g.id) && botGuildIds.has(g.id));
  const [premiumGuildIds, byRoleList, canPartners] = await Promise.all([
    getPremiumGuildIds(Astro2, session.userId, manageable.filter((g) => botGuildIds.has(g.id)).map((g) => g.id)),
    guildsWithRoleAccess(Astro2, session.userId, roleCandidates.map((g) => g.id)),
    canEditPartners(Astro2, session.userId)
  ]);
  const byRole = new Set(byRoleList);
  const roleGuilds = roleCandidates.filter((g) => byRole.has(g.id));
  const guilds = [...manageable, ...roleGuilds].map((g) => ({
    id: g.id,
    name: g.name,
    icon: guildIconUrl(g),
    tag: byRole.has(g.id) ? "Role access" : g.owner ? "Owner" : "Administrator",
    active: botGuildIds.has(g.id),
    premiumActive: premiumGuildIds.has(g.id),
    memberCount: memberCounts.get(g.id) ?? null
  })).sort((a, b) => a.active !== b.active ? Number(b.active) - Number(a.active) : a.active ? (b.memberCount ?? -1) - (a.memberCount ?? -1) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
  const inviteUrl = (guildId) => botInviteUrl(String(clientId), guildId);
  const isOwner = isPettoOwner(Astro2, session.userId);
  return renderTemplate`${renderComponent($$result, "DashManage", $$DashManage, { "user": session, "guilds": guilds, "inviteUrl": inviteUrl, "isOwner": isOwner, "canPartners": canPartners, "error": discordUnavailable ? "discord_unavailable" : void 0 })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/manage/index.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/manage/index.astro";
const $$url = "/dash/manage";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
