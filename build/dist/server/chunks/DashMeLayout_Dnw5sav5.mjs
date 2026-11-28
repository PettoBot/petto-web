import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute, F as Fragment, f as renderSlot } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { $ as $$Base } from './Base_Di2YHjFe.mjs';
import { $ as $$DashServerRail, b as $$DashSideHead, c as $$DashUserCard, d as $$DashTopBar, e as $$DashServerSheet } from './DashUserCard_BiWYM-Hw.mjs';
import { u as userCardData, b as userHeaderArt } from './dashAuth_uqFK7-ED.mjs';
import { i as isPettoOwner, g as getPremiumGuildIds } from './premiumAdmin_C4HUbWtx.mjs';
import { c as canEditPartners } from './partners_BiJzadVG.mjs';
import { m as memoPerRequest, c as canManageGuild, d as guildIconUrl } from './discord_CxeBz2tv.mjs';
import { b as getCachedUserGuilds, g as getCachedBotGuildIds, a as getBotGuildList } from './discordCache_CnRINZ-g.mjs';
import { g as getEnv } from './env_WnBvzCjc.mjs';
import { s as splitServers, b as botInviteUrl } from './dashSwitcher_BIhzOPcN.mjs';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                           */

const memory = /* @__PURE__ */ new Map();
const KEEP_MS = 6e4;
async function staffAccess(astro, userId) {
  const owner = isPettoOwner(astro, userId);
  if (owner) return { owner, team: true };
  const known = memory.get(userId);
  if (known && Date.now() - known.at < KEEP_MS) return { owner, team: known.team };
  const team = await canEditPartners(astro, userId).catch(() => false);
  if (memory.size > 500) memory.clear();
  memory.set(userId, { at: Date.now(), team });
  return { owner, team };
}

function loadSwitcherServers(astro, session) {
  return memoPerRequest(astro.request, "dash-switcher-servers", async () => {
    const request = astro.request;
    const botToken = getEnv(astro, "DISCORD_TOKEN");
    const clientId = getEnv(astro, "DISCORD_CLIENT_ID");
    const [guilds, botIds, botList] = await Promise.all([
      getCachedUserGuilds(session.accessToken, request).catch(() => null),
      botToken ? getCachedBotGuildIds(botToken, request).catch(() => null) : Promise.resolve(/* @__PURE__ */ new Set()),
      botToken ? getBotGuildList(botToken).catch(() => []) : Promise.resolve([])
    ]);
    const options = { canManage: canManageGuild, iconOf: (guild) => guildIconUrl(guild), memberCounts: new Map(botList.map((guild) => [guild.id, guild.memberCount])) };
    const split = splitServers(guilds, botIds, options);
    const premiumIds = await getPremiumGuildIds(astro, session.userId, split.mine.map((guild) => guild.id)).catch(() => /* @__PURE__ */ new Set());
    return {
      unavailable: guilds === null,
      mine: split.mine.map((guild) => ({ ...guild, premium: premiumIds.has(guild.id) })),
      invite: clientId ? split.invite.map((guild) => ({ ...guild, href: botInviteUrl(clientId, guild.id) })) : [],
      total: split.total
    };
  });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://petto.sbs");
const $$DashMeLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashMeLayout;
  const { user, active, pageTitle: rawTitle } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const pageTitle = dt(rawTitle);
  const servers = await loadSwitcherServers(Astro2, user);
  const card = userCardData(user);
  const art = userHeaderArt(user);
  const handle = user.handle && user.handle !== (card.name || user.username) ? user.handle : null;
  const sections = [
    { title: dt("Main"), items: [
      { id: "overview", href: "/dash/me", icon: "ph:squares-four-fill", label: dt("Overview"), sk: "stats" },
      { id: "summary", href: "/dash/summary", icon: "ph:fire-fill", label: dt("Summary"), sk: "stats" },
      { id: "daily", href: "/dash/daily", icon: "ph:gift-fill", label: dt("Daily reward"), sk: "cards" }
    ] },
    { title: dt("Subscriptions"), items: [
      { id: "plans", href: "/dash/plans", icon: "ph:star-fill", label: dt("Plans"), sk: "cards" },
      { id: "plan", href: "/dash/plan", icon: "ph:identification-badge-fill", label: dt("My plan"), sk: "cards" },
      { id: "premium", href: "/dash/premium", icon: "ph:crown-fill", label: dt("Manage premium"), sk: "cards" }
    ] },
    { title: dt("Personalization"), items: [
      { id: "badges", href: "/dash/badges", icon: "ph:medal-fill", label: dt("Badges"), sk: "cards" },
      { id: "name", href: "/dash/name", icon: "ph:text-aa-fill", label: dt("Customize name"), sk: "cards" },
      { id: "banners", href: "/dash/banners", icon: "ph:image-fill", label: dt("Customize profile"), sk: "cards" },
      { id: "own-picture", href: "/dash/own-picture", icon: "ph:image-square-fill", label: dt("Own picture"), sk: "form" },
      { id: "own-badges", href: "/dash/own-badges", icon: "ph:medal-fill", label: dt("Own badges"), sk: "cards" },
      { id: "rank", href: "/dash/rank", icon: "ph:identification-card-fill", label: dt("Rank card"), sk: "cards" }
    ] },
    { title: dt("Ceramos"), items: [
      { id: "buy", href: "/dash/buy-ceramos", icon: "ph:coins-fill", label: dt("Buy ceramos"), sk: "cards" },
      { id: "missions", href: "/dash/missions", icon: "ph:target-fill", label: dt("Missions"), sk: "cards" },
      { id: "movements", href: "/dash/ceramos", icon: "ph:list-bullets-fill", label: dt("Ceramos movements"), sk: "list" }
    ] },
    { title: dt("Account"), items: [
      { id: "servers", href: "/dash/manage", icon: "ph:hard-drives-fill", label: dt("Your servers"), sk: "grid" },
      { id: "history", href: "/dash/history", icon: "ph:clock-counter-clockwise", label: dt("History"), sk: "list" },
      { id: "preferences", href: "/dash/preferences", icon: "ph:sliders-horizontal-fill", label: dt("Preferences"), sk: "form" },
      { id: "api", href: "/dash/api", icon: "ph:key-fill", label: dt("API keys"), sk: "form" },
      { id: "privacy", href: "/dash/privacy", icon: "ph:shield-check-fill", label: dt("Privacy and session"), sk: "cards" }
    ] }
  ];
  const access = await staffAccess(Astro2, user.userId);
  const staffItems = [
    access.owner && { id: "staff-servers", href: "/dash/admin/servers", icon: "ph:hard-drives-fill", label: dt("All servers"), sk: "list" },
    access.owner && { id: "staff-premium", href: "/dash/admin", icon: "ph:gift-fill", label: dt("Premium grants"), sk: "form" },
    access.owner && { id: "staff-grant", href: "/dash/ceramos-admin", icon: "ph:coins-fill", label: dt("Give ceramos"), sk: "form" },
    access.owner && { id: "staff-uploads", href: "/dash/uploads-admin", icon: "ph:image-square-fill", label: dt("Own pictures"), sk: "list" },
    access.owner && { id: "staff-plans", href: "/dash/plans-admin", icon: "ph:star-fill", label: dt("User plans"), sk: "form" },
    access.owner && { id: "staff-badges", href: "/dash/badges-admin", icon: "ph:medal-fill", label: dt("Shop editor"), sk: "form" },
    access.owner && { id: "staff-team", href: "/dash/team", icon: "ph:users-three-fill", label: dt("Team"), sk: "list" },
    access.team && { id: "staff-partners", href: "/dash/partners-admin", icon: "ph:handshake-fill", label: dt("Partners"), sk: "list" },
    access.team && { id: "staff-credits", href: "/dash/credits-admin", icon: "ph:heart-fill", label: dt("Credits"), sk: "list" },
    access.team && { id: "staff-changelog", href: "/dash/changelog-admin", icon: "ph:clock-counter-clockwise-fill", label: dt("Changelog"), sk: "form" },
    access.team && { id: "staff-appeals", href: "/dash/appeal-names", icon: "ph:scales-fill", label: dt("Appeal names"), sk: "list" }
  ].filter((item) => Boolean(item));
  if (staffItems.length) sections.push({ title: dt("Staff"), items: staffItems });
  const activeItem = sections.flatMap((section) => section.items).find((item) => item.id === active);
  return renderTemplate(_a || (_a = __template(["", " <script>\n  (function () {\n    function syncHeaderHeight() {\n      var header = document.querySelector('header.nav');\n      document.documentElement.style.setProperty('--dgl-header-h', (header ? header.offsetHeight : 0) + 'px');\n    }\n    syncHeaderHeight();\n    window.addEventListener('resize', syncHeaderHeight);\n    var side = document.getElementById('dme-side');\n    var burger = document.getElementById('dme-burger');\n    var backdrop = document.getElementById('dme-backdrop');\n    if (!side || !burger || !backdrop) return;\n    // The menu scrolls when it is taller than the screen: the page you are on is brought into view (a Staff page sits at the end).\n    function showActive() {\n      var nav = side.querySelector('.dme-nav');\n      var link = side.querySelector('.dme-link.active');\n      if (!nav || !link) return;\n      var top = link.getBoundingClientRect().top - nav.getBoundingClientRect().top + nav.scrollTop;\n      if (top + link.offsetHeight > nav.clientHeight) nav.scrollTop = top - (nav.clientHeight - link.offsetHeight) / 2;\n    }\n    showActive();\n    function setDrawer(open) {\n      if (side.classList.contains('open') === open) return;\n      side.classList.toggle('open', open);\n      backdrop.hidden = !open;\n      burger.setAttribute('aria-expanded', String(open));\n      document.documentElement.classList.toggle('dme-drawer-open', open);\n      if (open) { showActive(); setTimeout(function () { document.getElementById('dme-close').focus({ preventScroll: true }); }, 60); }\n      else burger.focus({ preventScroll: true });\n    }\n    burger.addEventListener('click', function () { setDrawer(!side.classList.contains('open')); });\n    backdrop.addEventListener('click', function () { setDrawer(false); });\n    document.getElementById('dme-close').addEventListener('click', function () { setDrawer(false); });\n    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });\n  })();\n<\/script>  "])), renderComponent($$result, "Base", $$Base, { "title": `${pageTitle} \xB7 Petto`, "active": "dash", "hideNav": true, "data-astro-cid-yffua3fp": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-yffua3fp> <section class="dme-sec" data-astro-cid-yffua3fp> <div class="wrap dme-wrap" data-astro-cid-yffua3fp> <div class="dme-layout" data-astro-cid-yffua3fp> <div class="dme-backdrop" id="dme-backdrop" hidden data-astro-cid-yffua3fp></div> ${renderComponent($$result2, "DashServerRail", $$DashServerRail, { "user": user, "guilds": servers.mine, "data-astro-cid-yffua3fp": true })} <aside class="dme-side" id="dme-side" data-astro-cid-yffua3fp> <div class="dme-close-row" data-astro-cid-yffua3fp> <button type="button" class="dme-close" id="dme-close"${addAttribute(dt("Close the menu"), "aria-label")} data-astro-cid-yffua3fp>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x", "width": "16", "height": "16", "data-astro-cid-yffua3fp": true })}</button> </div> ${renderComponent($$result2, "DashSideHead", $$DashSideHead, { "kind": "user", "size": "roomy", "name": card.name || user.username, "handle": handle, "icon": card.avatar ? card.avatar.replace(/size=64$/, "size=256") : null, "art": art, "decoration": card.decoration, "data-astro-cid-yffua3fp": true })} <nav class="dme-nav"${addAttribute(dt("Account"), "aria-label")} data-astro-cid-yffua3fp> ${sections.map((section) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="dme-title" data-astro-cid-yffua3fp>${section.title}</div> ${section.items.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(item.sk, "data-sk")}${addAttribute(["dme-link", { active: item.id === active }], "class:list")}${addAttribute(item.id === active ? "page" : void 0, "aria-current")} data-astro-cid-yffua3fp> ${renderComponent($$result3, "Icon", $$Icon, { "name": item.icon, "width": "18", "height": "18", "data-astro-cid-yffua3fp": true })} <span data-astro-cid-yffua3fp>${item.label}</span> </a>`)}` })}`)} </nav> ${renderComponent($$result2, "DashUserCard", $$DashUserCard, { "user": user, "data-astro-cid-yffua3fp": true })} </aside> <div class="dme-main-col" data-astro-cid-yffua3fp> ${renderComponent($$result2, "DashTopBar", $$DashTopBar, { "kind": "user", "contextName": card.name || user.username, "contextIcon": card.avatar, "pageLabel": activeItem?.label ?? pageTitle, "user": { username: card.name || user.username, avatar: card.avatar }, "menuBtnId": "dme-burger", "sideId": "dme-side", "data-astro-cid-yffua3fp": true })} <div class="dme-content" id="dme-content" data-astro-cid-yffua3fp>${renderSlot($$result2, $$slots["default"])}</div> </div> </div> </div> </section> </main> ${renderComponent($$result2, "DashServerSheet", $$DashServerSheet, { "user": { name: card.name || user.username, avatar: card.avatar }, "profileHref": "/dash/me", "onProfile": true, "servers": servers.mine, "invites": servers.invite, "owner": isPettoOwner(Astro2, user.userId), "data-astro-cid-yffua3fp": true })} ` }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashMeLayout.astro", void 0);

export { $$DashMeLayout as $, loadSwitcherServers as l };
