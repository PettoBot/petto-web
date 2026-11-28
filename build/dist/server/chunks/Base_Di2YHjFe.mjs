import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, u as unescapeHTML, r as renderTemplate, d as renderComponent, e as defineScriptVars, F as Fragment, f as renderSlot, g as renderHead } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { a as buildTitle, c as buildLabel, b as buildInfo } from './buildInfo_Bw1TupFW.mjs';
import 'clsx';
import { g as getDashLang, d as dashCatalog, m as makeT } from './dash_CORIPvM-.mjs';
/* empty css                          */
/* empty css                          */
/* empty css                         */
import { u as useTranslations, l as localePath } from './ui_C1MR3LHJ.mjs';
import { C as CACHE_KEY, p as profileHref, d as dashboardHref, a as accountEntries, l as loginHref } from './navAccount_CB9ntmtH.mjs';

var define_ES_ROUTES_default = ["/am", "/apply", "/brand", "/changelog", "/code", "/codegen", "/commands", "/cookies", "/credits", "/discord-age-verification", "/discord-api-2026", "/discord-encryption", "/embed-builder", "/embed-code", "/faq", "/features", "/form", "/history", "/", "/linked-roles", "/nelu", "/news", "/partners", "/premium", "/privacy", "/refunds", "/roadmap", "/snowflake", "/stats", "/status", "/team", "/terms", "/timestamp", "/tools", "/blog/blibot-to-petto", "/blog/currently-log", "/blog/embed-builder-joins-petto", "/blog", "/blog/kobot-moves-to-petto", "/blog/online-without-the-dot", "/blog/petto-vs-other-bots", "/blog/switch-from-carl-bot", "/blog/switch-from-dyno", "/blog/switch-from-mee6", "/blog/vanity-moves-to-petto", "/changelog/[version]", "/f/[id]", "/features/[id]", "/feedback", "/feedback/new", "/form/[id]", "/lb/[slug]", "/status/vanity"];
const LOCALIZED_ROUTES = define_ES_ROUTES_default.map((route) => new RegExp(`^${route.replace(/\[\.\.\.[^\]]+\]/g, ".+").replace(/\[[^\]]+\]/g, "[^/]+")}$`));

const $$Astro$b = createAstro("https://petto.sbs");
const $$InlineIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$InlineIcon;
  const { name, class: className, width = 16, height = width, id } = Astro2.props;
  const paths = {
    "ph:caret-down": '<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>',
    "ph:caret-right": '<path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>',
    "ph:crown-fill": '<path fill="currentColor" d="m3 7 4 3 5-6 5 6 4-3-1.7 11H4.7L3 7Zm3.1 9h9.8l.6-4.1-4.5 3-1-1.2-1 1.2-4.5-3L6.1 16Z"/>',
    "ph:globe": '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.8 12h16.4M12 3.5c2.1 2.3 3.2 5.1 3.2 8.5s-1.1 6.2-3.2 8.5c-2.1-2.3-3.2-5.1-3.2-8.5S9.9 5.8 12 3.5Z" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    "ph:check-bold": '<path d="m5 12.5 4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"/>',
    "ph:check-circle-fill": '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.7 7.7-5.6 5.6a1 1 0 0 1-1.4 0l-2.4-2.4 1.4-1.4 1.7 1.7 4.9-4.9 1.4 1.4Z"/>',
    "ph:info-fill": '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/>',
    "ph:link-fill": '<path fill="currentColor" d="M9.2 14.8 7.8 16.2a3 3 0 1 1-4.2-4.2l3.1-3.1a3 3 0 0 1 4.2 0l.7.7-1.4 1.4-.7-.7a1 1 0 0 0-1.4 0L5 13.4a1 1 0 1 0 1.4 1.4l1.4-1.4 1.4 1.4Zm5.6-5.6 1.4-1.4a3 3 0 1 1 4.2 4.2l-3.1 3.1a3 3 0 0 1-4.2 0l-.7-.7 1.4-1.4.7.7a1 1 0 0 0 1.4 0l3.1-3.1a1 1 0 1 0-1.4-1.4l-1.4 1.4-1.4-1.4Zm-5.1 4.4-1.4-1.4 6.1-6.1 1.4 1.4-6.1 6.1Z"/>',
    "ph:warning-fill": '<path fill="currentColor" d="M11 3.7 2.4 18.5A2 2 0 0 0 4.1 21h15.8a2 2 0 0 0 1.7-2.5L13 3.7a2 2 0 0 0-2 0ZM13 17h-2v-2h2v2Zm0-4h-2V9h2v4Z"/>',
    "ph:seal-check-fill": '<path fill="currentColor" d="m12 2 2.1 1.4 2.5-.2 1.1 2.2 2.2 1.1-.2 2.5L21 11l-1.4 2.1.2 2.5-2.2 1.1-1.1 2.2-2.5-.2L12 20l-2.1-1.4-2.5.2-1.1-2.2-2.2-1.1.2-2.5L3 12l1.4-2.1-.2-2.5 2.2-1.1 1.1-2.2 2.5.2L12 2Zm-1.2 13.2 5.7-5.7-1.4-1.4-4.3 4.3-2.1-2.1-1.4 1.4 3.5 3.5Z"/>',
    "ph:gear-six-fill": '<path fill="currentColor" d="m20.2 13.1 1.5 1.2-1.8 3.1-1.8-.8a7.8 7.8 0 0 1-1.9 1.1l-.2 2h-3.6l-.2-2a7.8 7.8 0 0 1-1.9-1.1l-1.8.8-1.8-3.1 1.5-1.2a7.4 7.4 0 0 1 0-2.2L6.7 9.7l1.8-3.1 1.8.8a7.8 7.8 0 0 1 1.9-1.1l.2-2H16l.2 2a7.8 7.8 0 0 1 1.9 1.1l1.8-.8 1.8 3.1-1.5 1.2a7.4 7.4 0 0 1 0 2.2ZM14.2 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>',
    "simple-icons:discord": '<path fill="currentColor" d="M19.5 5.1A16 16 0 0 0 15.6 4l-.5 1a14 14 0 0 0-6.2 0l-.5-1a16 16 0 0 0-3.9 1.1C2 8.4 1.4 11.7 1.7 15a15.7 15.7 0 0 0 4.8 2.4l1.2-1.6a9 9 0 0 1-1.9-.9l.5-.4c3.7 1.7 7.7 1.7 11.3 0l.5.4a9 9 0 0 1-1.9.9l1.2 1.6a15.7 15.7 0 0 0 4.8-2.4c.4-3.8-.7-7-2.7-9.9ZM8.5 13.6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm7 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z"/>',
    "ph:sun-fill": '<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.7"/>',
    "ph:arrow-clockwise-bold": '<path d="M19 12a7 7 0 1 1-2.2-5.1M19 4v4.5h-4.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"/>',
    "ph:list": '<path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>',
    "ph:x": '<path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>',
    "ph:book-open-fill": '<path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H9a3 3 0 0 1 3 3v14a2.5 2.5 0 0 0-2.5-2.5H4.5A2.5 2.5 0 0 1 2 15V5.5Zm20 0A2.5 2.5 0 0 0 19.5 3H15a3 3 0 0 0-3 3v14a2.5 2.5 0 0 1 2.5-2.5h5A2.5 2.5 0 0 0 22 15V5.5Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/>',
    "ph:circle-fill": '<circle cx="12" cy="12" r="6" fill="currentColor"/>',
    "ph:sparkle-fill": '<path fill="currentColor" d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Zm7 13 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/>',
    "ph:shield-check-fill": '<path fill="currentColor" d="M12 2 20 5v5.7c0 4.7-3.1 8.7-8 10.3-4.9-1.6-8-5.6-8-10.3V5l8-3Zm-1.2 12.4 5.7-5.7-1.4-1.4-4.3 4.3-2-2-1.4 1.4 3.4 3.4Z"/>',
    "ph:terminal-window-fill": '<path fill="currentColor" d="M3 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4Zm3.3 4.3 3.7 3.7-3.7 3.7 1.4 1.4 5.1-5.1-5.1-5.1-1.4 1.4ZM13 16h5v-2h-5v2Z"/>',
    "ph:squares-four-fill": '<path fill="currentColor" d="M4 3h6v6H4V3Zm10 0h6v6h-6V3ZM4 13h6v6H4v-6Zm10 0h6v6h-6v-6Z"/>',
    "ph:megaphone-fill": '<path fill="currentColor" d="M3 10.2a2 2 0 0 1 1.2-1.8L19 2.2V18l-14.8-6.2A2 2 0 0 1 3 10.2Zm4.5 3.5 1.7 5.1a2 2 0 0 0 3.8-1.3l-1.4-4.6-4.1-1.7Z"/>',
    "ph:headset-fill": '<path fill="currentColor" d="M4 12a8 8 0 0 1 16 0v5a3 3 0 0 1-3 3h-2v-7h3v-1a6 6 0 0 0-12 0v1h3v7H7a3 3 0 0 1-3-3v-5Z"/>',
    "ph:users-three-fill": '<path fill="currentColor" d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 8a6 6 0 0 1 12 0H3Zm14-8a3 3 0 1 0-1.1-5.8 5.8 5.8 0 0 1 0 6.6c.3-.5.7-.8 1.1-.8Zm-1.6 3.2a6.5 6.5 0 0 1 3.6 5.8h4a6 6 0 0 0-7.6-5.8Z"/>',
    "ph:headphones-fill": '<path fill="currentColor" d="M4 12a8 8 0 0 1 16 0v5a3 3 0 0 1-3 3h-2v-7h3v-1a6 6 0 0 0-12 0v1h3v7H7a3 3 0 0 1-3-3v-5Z"/>',
    "ph:chart-line-up-fill": '<path fill="currentColor" d="M4 20V4h2v12.6l4-4 3 3L18 9h-3V7h6v6h-2v-2.6l-5 5-3-3-5 5V20H4Z"/>',
    "ph:ranking-fill": '<path fill="currentColor" d="M4 20v-8h4v8H4Zm6 0V7h4v13h-4Zm6 0V3h4v17h-4Z"/>',
    "ph:pulse-fill": '<path fill="currentColor" d="M2 12h4l2-6 4 12 2-6h4l2-3 2 3h2v2h-3l-1-1.5-1 1.5h-4l-1 3-4-12-1.5 5H2v-2Z"/>',
    "ph:clock-counter-clockwise-fill": '<path fill="currentColor" d="M12 3a9 9 0 1 1-8.5 6H6v2H1V6h2v2.2A9 9 0 0 1 12 3Zm0 3v6l4 2-1 1.7-5-3V6h2Z"/>',
    "ph:newspaper-fill": '<path fill="currentColor" d="M4 4h16v16H5a3 3 0 0 1-3-3V7a3 3 0 0 1 2-3Zm3 3v3h4V7H7Zm6 0v2h5V7h-5Zm-6 5v2h11v-2H7Zm0 4v2h8v-2H7Z"/>',
    "simple-icons:youtube": '<path fill="currentColor" d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"/>',
    "simple-icons:github": '<path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.5 4.9.4.3.7 1 .7 2v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/>',
    "ph:map-trifold-fill": '<path fill="currentColor" d="m3 5 5-2 8 2 5-2v16l-5 2-8-2-5 2V5Zm2 1.4v11.8l3-1.2V5.2L5 6.4Zm5-1.2v11.8l4 1V6.2l-4-1Zm6 1v11.8l3-1.2V5.9l-3 1.3Z"/>',
    "ph:question-fill": '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 16.7a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm1.5-5.3v.4h-3v-.8c0-1.2.6-1.8 1.7-2.5.8-.5 1.2-.8 1.2-1.5 0-.8-.6-1.3-1.5-1.3-.9 0-1.5.5-1.7 1.4l-2.3-.5c.4-1.8 1.8-2.9 4-2.9 2.5 0 4.3 1.3 4.3 3.4 0 1.7-1 2.5-2.1 3.2-.5.3-.6.6-.6 1.1Z"/>',
    "ph:clock-fill": '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v4.4l3.2 1.9-1 1.7-4.2-2.5V7h2Z"/>',
    "ph:hash": '<path fill="currentColor" d="m9 3-1 6H4v2h3.7l-.7 4H3v2h3.7l-.8 4h2l.8-4h4.6l-.8 4h2l.8-4H20v-2h-4.1l.8-4H21V9h-4.1l1-6h-2l-1 6h-4.6l1-6H9Zm.9 8h4.6l-.7 4H9.2l.7-4Z"/>',
    // Phosphor draws on a 256 grid: an inner svg scales it (a CSS "transform: none" for reduced motion would undo a transform attribute).
    "ph:sign-out-fill": '<svg viewBox="0 0 256 256" width="24" height="24"><path fill="currentColor" d="M120 216a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16H56v160h56a8 8 0 0 1 8 8m109.66-93.66l-40-40A8 8 0 0 0 176 88v32h-64a8 8 0 0 0 0 16h64v32a8 8 0 0 0 13.66 5.66l40-40a8 8 0 0 0 0-11.32"/></svg>',
    // Phosphor draws on a 256 grid, this component on a 24 grid.
    "ph:tag-fill": '<g transform="scale(.09375)" fill="currentColor"><path fill="currentColor" d="M243.31 136L144 36.69A15.86 15.86 0 0 0 132.69 32H40a8 8 0 0 0-8 8v92.69A15.86 15.86 0 0 0 36.69 144L136 243.31a16 16 0 0 0 22.63 0l84.68-84.68a16 16 0 0 0 0-22.63M84 96a12 12 0 1 1 12-12a12 12 0 0 1-12 12"/></g>',
    // Phosphor draws on a 256 grid, this component on a 24 grid.
    "ph:chat-circle-dots-fill": '<g transform="scale(.09375)" fill="currentColor"><path fill="currentColor" d="M128 24a104 104 0 0 0-91.82 152.88l-11.35 34.05a16 16 0 0 0 20.24 20.24l34.05-11.35A104 104 0 1 0 128 24M84 140a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44 0a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44 0a12 12 0 1 1 12-12a12 12 0 0 1-12 12"/></g>',
    // Phosphor draws on a 256 grid, this component on a 24 grid.
    "ph:clipboard-text-fill": '<g transform="scale(.09375)" fill="currentColor"><path fill="currentColor" d="M200 32h-36.26a47.92 47.92 0 0 0-71.48 0H56a16 16 0 0 0-16 16v168a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m-72 0a32 32 0 0 1 32 32H96a32 32 0 0 1 32-32m32 128H96a8 8 0 0 1 0-16h64a8 8 0 0 1 0 16m0-32H96a8 8 0 0 1 0-16h64a8 8 0 0 1 0 16"/></g>',
    // Phosphor draws on a 256 grid, this component on a 24 grid.
    "ph:magic-wand-fill": '<g transform="scale(.09375)" fill="currentColor"><path fill="currentColor" d="M248 152a8 8 0 0 1-8 8h-16v16a8 8 0 0 1-16 0v-16h-16a8 8 0 0 1 0-16h16v-16a8 8 0 0 1 16 0v16h16a8 8 0 0 1 8 8M56 72h16v16a8 8 0 0 0 16 0V72h16a8 8 0 0 0 0-16H88V40a8 8 0 0 0-16 0v16H56a8 8 0 0 0 0 16m128 120h-8v-8a8 8 0 0 0-16 0v8h-8a8 8 0 0 0 0 16h8v8a8 8 0 0 0 16 0v-8h8a8 8 0 0 0 0-16m35.31-112L80 219.31a16 16 0 0 1-22.62 0l-20.7-20.68a16 16 0 0 1 0-22.63L176 36.69a16 16 0 0 1 22.63 0l20.68 20.68a16 16 0 0 1 0 22.63M208 68.69L187.31 48l-32 32L176 100.69Z"/></g>',
    "ph:wrench-fill": '<g transform="scale(.09375)" fill="currentColor"><path fill="currentColor" d="M226.76 69a8 8 0 0 0-12.84-2.88l-40.3 37.19-17.23-3.7-3.7-17.23 37.19-40.3A8 8 0 0 0 187 29.24a72 72 0 0 0-88.35 92.23l-67.79 58.95a32 32 0 1 0 44.72 44.72l58.95-67.79A72 72 0 0 0 226.76 69"/></g>'
  };
  const body = paths[name] ?? paths["ph:sparkle-fill"];
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"${addAttribute(width, "width")}${addAttribute(height, "height")}${addAttribute(className, "class")}${addAttribute(id, "id")} aria-hidden="true">${unescapeHTML(body)}</svg>`;
}, "/home/runner/work/petto-web/petto-web/src/components/InlineIcon.astro", void 0);

const $$Astro$a = createAstro("https://petto.sbs");
const $$NavIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$NavIcon;
  const { name, class: className, width, height } = Astro2.props;
  const iconProps = { class: className, width, height };
  return renderTemplate`${renderComponent($$result, "InlineIcon", $$InlineIcon, { "name": name, ...iconProps })}`;
}, "/home/runner/work/petto-web/petto-web/src/components/NavIcon.astro", void 0);

var __freeze$a = Object.freeze;
var __defProp$a = Object.defineProperty;
var __template$a = (cooked, raw) => __freeze$a(__defProp$a(cooked, "raw", { value: __freeze$a(cooked.slice()) }));
var _a$a;
const $$Astro$9 = createAstro("https://petto.sbs");
const $$DashClientI18N = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$DashClientI18N;
  const CLIENT_KEYS = [
    "Nobody found",
    "Search...",
    "Remove Petto from {name}? The bot will leave the server.",
    "this server",
    "Resetting\u2026",
    "Reset",
    "Saved.",
    "Discord didn't accept the profile sync, it'll retry next save.",
    "Something went wrong, try again.",
    "Saving...",
    "Petto Official",
    "{n} pattern(s)",
    "Remove",
    "Active",
    "Inactive",
    "Saved",
    "Discarding...",
    "Discarded",
    "{n} sections have unsaved changes",
    "Saving {a} of {b}...",
    "{n} sections could not be saved",
    "Saved all changes",
    "Couldn't load the preview, try refreshing.",
    "No matches.",
    "Early levels feel fast while high levels still matter.",
    "A steady curve for general-purpose communities.",
    "A slower progression for long-running servers.",
    "Adjust the values above to create your own curve.",
    "Member reached a new level",
    "Level up!",
    "Saved embed: {name}",
    "Embed preview",
    "Message preview",
    "Nothing set yet.",
    "APP",
    "Today at 12:00 PM",
    "Could not save. Try again.",
    "You have unsaved changes",
    "Remove {name} from this position?",
    "Delete the saved team and show the original list again?",
    "Done.",
    "It could not be done.",
    "Rule added to Discord.",
    "Pack added to Discord.",
    "Filter added to Petto.",
    "Remove this rule from Discord?",
    "Rule removed.",
    "Remove this filter?",
    "Filter removed.",
    "Rule on.",
    "Rule off.",
    "Filter on.",
    "Filter off.",
    "These were not valid domains and were skipped: {a}",
    "Only the first {a} domains were kept.",
    "Domains saved.",
    "Asking Petto\u2026",
    "Petto is asking {name}\u2026",
    "Petto is taking longer than usual, trying again\u2026",
    "{name} is slow to answer\u2026",
    "Petto is slow to answer\u2026",
    "Still waiting for the answer. This can take a little longer\u2026",
    "Petto is not answering. It may be restarting after an update. Try again in a few seconds.",
    "Try again"
  ];
  const lang = getDashLang(Astro2);
  const catalog = dashCatalog(lang);
  const words = Object.fromEntries(CLIENT_KEYS.map((key) => [key, catalog[key] ?? key]));
  const script = `window.__dashWords=${JSON.stringify(words).replace(/</g, "\\u003c")};window.cdt=function(k,v){var s=(window.__dashWords&&window.__dashWords[k])||k;if(v)for(var n in v)s=s.split('{'+n+'}').join(String(v[n]));return s;};`;
  return renderTemplate(_a$a || (_a$a = __template$a(["<script>", "<\/script>"])), unescapeHTML(script));
}, "/home/runner/work/petto-web/petto-web/src/components/DashClientI18n.astro", void 0);

var __freeze$9 = Object.freeze;
var __defProp$9 = Object.defineProperty;
var __template$9 = (cooked, raw) => __freeze$9(__defProp$9(cooked, "raw", { value: __freeze$9(raw || cooked.slice()) }));
var _a$9;
const $$DashMotion = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$9 || (_a$9 = __template$9(["<script>\n  (function () {\n    if (window.dglMotion) return;\n    var media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;\n    var reduced = function () { return !!(media && media.matches); };\n    function leave(el, done, cls) {\n      done = done || function () {};\n      if (!el || !el.isConnected || el.hidden || reduced()) { if (el && el._dglLeave) el._dglLeave(true); done(); return; }\n      if (el._dglLeave) return;\n      var name = cls || 'dgl-leave';\n      var finished = false;\n      var timer = 0;\n      var end = function (cancelled) {\n        if (finished) return;\n        finished = true;\n        clearTimeout(timer);\n        el.removeEventListener('animationend', onEnd);\n        el.classList.remove(name);\n        el._dglLeave = null;\n        if (!cancelled) done();\n      };\n      var onEnd = function (event) { if (event.target === el) end(false); };\n      el._dglLeave = end;\n      el.classList.add(name);\n      el.addEventListener('animationend', onEnd);\n      // A safety net: an element that cannot animate (display: contents, a hidden parent) still closes.\n      timer = setTimeout(function () { end(false); }, 420);\n    }\n    // Something that was leaving and is opened again stays (its exit is cancelled, nothing is hidden under the person).\n    function stay(el) { if (el && el._dglLeave) el._dglLeave(true); }\n    function hide(el, then) { leave(el, function () { el.hidden = true; if (then) then(); }); }\n\n    // FLIP: what follows `anchor` (its next siblings, and those of every box around it up to `stop`) is measured, `change` runs, and each\n    // of them that is on screen starts where it was and slides to its new place. Off-screen ones simply move.\n    function following(anchor, stop) {\n      var out = [];\n      for (var node = anchor; node && node !== stop && node !== document.body; node = node.parentElement) {\n        for (var sib = node.nextElementSibling; sib; sib = sib.nextElementSibling) {\n          if (out.length > 60) return out;\n          out.push(sib);\n        }\n      }\n      return out;\n    }\n    function flip(anchor, change, stop) {\n      if (reduced() || !anchor) { change(); return; }\n      var list = following(anchor, stop || document.getElementById('dgl-content') || document.body);\n      var height = window.innerHeight;\n      // Measured where they are seen (mid-slide too), then their running slides stop, so a quick second press continues smoothly.\n      var before = list.map(function (el) { var r = el.getBoundingClientRect(); return [r.left, r.top]; });\n      list.forEach(function (el) { if (el._dglFlip) { el._dglFlip.cancel(); el._dglFlip = null; } });\n      change();\n      var moves = [];\n      list.forEach(function (el, i) {\n        var rect = el.getBoundingClientRect();\n        var dx = before[i][0] - rect.left;\n        var dy = before[i][1] - rect.top;\n        if ((Math.abs(dx) < 1 && Math.abs(dy) < 1) || !rect.height) return;\n        // Neither where it was nor where it lands is on screen: it just moves.\n        var wasVisible = before[i][1] < height && before[i][1] + rect.height > 0;\n        var isVisible = rect.top < height && rect.bottom > 0;\n        if (!wasVisible && !isVisible) return;\n        moves.push([el, dx, dy]);\n      });\n      moves.forEach(function (move) {\n        var el = move[0];\n        el._dglFlip = el.animate([{ transform: 'translate(' + move[1] + 'px, ' + move[2] + 'px)' }, { transform: 'none' }], { duration: 280, easing: 'cubic-bezier(.2, .8, .2, 1)' });\n        el._dglFlip.onfinish = el._dglFlip.oncancel = function () { el._dglFlip = null; };\n      });\n    }\n    // A change of page as a cross-fade (the browser's view transition: the old page fades out while the new one fades in, ~200 ms, see the\n    // ::view-transition rules below). `change` runs in the middle, after the old page was captured; it may throw, and then the promise rejects\n    // like the plain call would have thrown. A skipped transition (a second page change, a hidden tab) is not an error for anyone.\n    function crossfade(change) {\n      if (!document.startViewTransition || reduced() || document.hidden) { change(); return Promise.resolve(); }\n      var root = document.documentElement;\n      var transition;\n      // Only the content is a picture of its own (the class gives #dgl-content its view-transition-name, and only while this lasts): the menu,\n      // the header and a drawer that is closing are not part of the fade, so they behave exactly as they do without it.\n      root.classList.add('dgl-vt');\n      // A phone scrolls the whole page: it goes to the top first, so the box of the content does not slide while it fades.\n      if (window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });\n      try { transition = document.startViewTransition(change); } catch (e) { root.classList.remove('dgl-vt'); change(); return Promise.resolve(); }\n      transition.ready.catch(function () { /* skipped */ });\n      transition.finished.catch(function () { /* skipped */ }).then(function () { root.classList.remove('dgl-vt'); });\n      return transition.updateCallbackDone;\n    }\n    window.dglMotion = { reduced: reduced, leave: leave, stay: stay, hide: hide, flip: flip, crossfade: crossfade };\n\n    // Closing a fold at the very end of a page makes the page shorter than the place the person is at, so the browser drags the whole page\n    // down while the fold shrinks (the page seems to jump and the last block flickers). When a fold is closed with the page already at\n    // its end, an empty block as tall as the fold is left at the end of the content: the page keeps its height, the fold shrinks softly\n    // and nothing else moves. The block goes away as soon as the person scrolls up a little or leaves the page.\n    document.addEventListener('click', function (event) {\n      var summary = event.target && event.target.closest ? event.target.closest('details[open] > summary') : null;\n      if (!summary || !summary.parentElement.classList.contains('dfx-acc') || reduced()) return;\n      var fold = summary.parentElement;\n      var host = fold.closest('#dgl-content') || document.body;\n      var scroller = document.scrollingElement || document.documentElement;\n      for (var node = fold.parentElement; node && node !== document.body; node = node.parentElement) {\n        var overflow = getComputedStyle(node).overflowY;\n        if ((overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight + 2) { scroller = node; break; }\n      }\n      if (scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight > 6) return;\n      var old = host.querySelector(':scope > .dgl-slack');\n      if (old) old.remove();\n      var slack = document.createElement('div');\n      slack.className = 'dgl-slack';\n      slack.setAttribute('aria-hidden', 'true');\n      slack.style.cssText = 'height:' + Math.max(0, fold.offsetHeight - summary.offsetHeight) + 'px;pointer-events:none';\n      host.appendChild(slack);\n      var target = scroller === (document.scrollingElement || document.documentElement) ? window : scroller;\n      var release = function () {\n        if (!slack.isConnected) { target.removeEventListener('scroll', release); return; }\n        var free = scroller.scrollHeight - slack.offsetHeight - scroller.scrollTop - scroller.clientHeight;\n        if (free > 24) { slack.remove(); target.removeEventListener('scroll', release); }\n      };\n      setTimeout(function () { target.addEventListener('scroll', release, { passive: true }); }, 700);\n    }, true);\n  })();\n<\/script> "], ["<script>\n  (function () {\n    if (window.dglMotion) return;\n    var media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;\n    var reduced = function () { return !!(media && media.matches); };\n    function leave(el, done, cls) {\n      done = done || function () {};\n      if (!el || !el.isConnected || el.hidden || reduced()) { if (el && el._dglLeave) el._dglLeave(true); done(); return; }\n      if (el._dglLeave) return;\n      var name = cls || 'dgl-leave';\n      var finished = false;\n      var timer = 0;\n      var end = function (cancelled) {\n        if (finished) return;\n        finished = true;\n        clearTimeout(timer);\n        el.removeEventListener('animationend', onEnd);\n        el.classList.remove(name);\n        el._dglLeave = null;\n        if (!cancelled) done();\n      };\n      var onEnd = function (event) { if (event.target === el) end(false); };\n      el._dglLeave = end;\n      el.classList.add(name);\n      el.addEventListener('animationend', onEnd);\n      // A safety net: an element that cannot animate (display: contents, a hidden parent) still closes.\n      timer = setTimeout(function () { end(false); }, 420);\n    }\n    // Something that was leaving and is opened again stays (its exit is cancelled, nothing is hidden under the person).\n    function stay(el) { if (el && el._dglLeave) el._dglLeave(true); }\n    function hide(el, then) { leave(el, function () { el.hidden = true; if (then) then(); }); }\n\n    // FLIP: what follows \\`anchor\\` (its next siblings, and those of every box around it up to \\`stop\\`) is measured, \\`change\\` runs, and each\n    // of them that is on screen starts where it was and slides to its new place. Off-screen ones simply move.\n    function following(anchor, stop) {\n      var out = [];\n      for (var node = anchor; node && node !== stop && node !== document.body; node = node.parentElement) {\n        for (var sib = node.nextElementSibling; sib; sib = sib.nextElementSibling) {\n          if (out.length > 60) return out;\n          out.push(sib);\n        }\n      }\n      return out;\n    }\n    function flip(anchor, change, stop) {\n      if (reduced() || !anchor) { change(); return; }\n      var list = following(anchor, stop || document.getElementById('dgl-content') || document.body);\n      var height = window.innerHeight;\n      // Measured where they are seen (mid-slide too), then their running slides stop, so a quick second press continues smoothly.\n      var before = list.map(function (el) { var r = el.getBoundingClientRect(); return [r.left, r.top]; });\n      list.forEach(function (el) { if (el._dglFlip) { el._dglFlip.cancel(); el._dglFlip = null; } });\n      change();\n      var moves = [];\n      list.forEach(function (el, i) {\n        var rect = el.getBoundingClientRect();\n        var dx = before[i][0] - rect.left;\n        var dy = before[i][1] - rect.top;\n        if ((Math.abs(dx) < 1 && Math.abs(dy) < 1) || !rect.height) return;\n        // Neither where it was nor where it lands is on screen: it just moves.\n        var wasVisible = before[i][1] < height && before[i][1] + rect.height > 0;\n        var isVisible = rect.top < height && rect.bottom > 0;\n        if (!wasVisible && !isVisible) return;\n        moves.push([el, dx, dy]);\n      });\n      moves.forEach(function (move) {\n        var el = move[0];\n        el._dglFlip = el.animate([{ transform: 'translate(' + move[1] + 'px, ' + move[2] + 'px)' }, { transform: 'none' }], { duration: 280, easing: 'cubic-bezier(.2, .8, .2, 1)' });\n        el._dglFlip.onfinish = el._dglFlip.oncancel = function () { el._dglFlip = null; };\n      });\n    }\n    // A change of page as a cross-fade (the browser's view transition: the old page fades out while the new one fades in, ~200 ms, see the\n    // ::view-transition rules below). \\`change\\` runs in the middle, after the old page was captured; it may throw, and then the promise rejects\n    // like the plain call would have thrown. A skipped transition (a second page change, a hidden tab) is not an error for anyone.\n    function crossfade(change) {\n      if (!document.startViewTransition || reduced() || document.hidden) { change(); return Promise.resolve(); }\n      var root = document.documentElement;\n      var transition;\n      // Only the content is a picture of its own (the class gives #dgl-content its view-transition-name, and only while this lasts): the menu,\n      // the header and a drawer that is closing are not part of the fade, so they behave exactly as they do without it.\n      root.classList.add('dgl-vt');\n      // A phone scrolls the whole page: it goes to the top first, so the box of the content does not slide while it fades.\n      if (window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });\n      try { transition = document.startViewTransition(change); } catch (e) { root.classList.remove('dgl-vt'); change(); return Promise.resolve(); }\n      transition.ready.catch(function () { /* skipped */ });\n      transition.finished.catch(function () { /* skipped */ }).then(function () { root.classList.remove('dgl-vt'); });\n      return transition.updateCallbackDone;\n    }\n    window.dglMotion = { reduced: reduced, leave: leave, stay: stay, hide: hide, flip: flip, crossfade: crossfade };\n\n    // Closing a fold at the very end of a page makes the page shorter than the place the person is at, so the browser drags the whole page\n    // down while the fold shrinks (the page seems to jump and the last block flickers). When a fold is closed with the page already at\n    // its end, an empty block as tall as the fold is left at the end of the content: the page keeps its height, the fold shrinks softly\n    // and nothing else moves. The block goes away as soon as the person scrolls up a little or leaves the page.\n    document.addEventListener('click', function (event) {\n      var summary = event.target && event.target.closest ? event.target.closest('details[open] > summary') : null;\n      if (!summary || !summary.parentElement.classList.contains('dfx-acc') || reduced()) return;\n      var fold = summary.parentElement;\n      var host = fold.closest('#dgl-content') || document.body;\n      var scroller = document.scrollingElement || document.documentElement;\n      for (var node = fold.parentElement; node && node !== document.body; node = node.parentElement) {\n        var overflow = getComputedStyle(node).overflowY;\n        if ((overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight + 2) { scroller = node; break; }\n      }\n      if (scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight > 6) return;\n      var old = host.querySelector(':scope > .dgl-slack');\n      if (old) old.remove();\n      var slack = document.createElement('div');\n      slack.className = 'dgl-slack';\n      slack.setAttribute('aria-hidden', 'true');\n      slack.style.cssText = 'height:' + Math.max(0, fold.offsetHeight - summary.offsetHeight) + 'px;pointer-events:none';\n      host.appendChild(slack);\n      var target = scroller === (document.scrollingElement || document.documentElement) ? window : scroller;\n      var release = function () {\n        if (!slack.isConnected) { target.removeEventListener('scroll', release); return; }\n        var free = scroller.scrollHeight - slack.offsetHeight - scroller.scrollTop - scroller.clientHeight;\n        if (free > 24) { slack.remove(); target.removeEventListener('scroll', release); }\n      };\n      setTimeout(function () { target.addEventListener('scroll', release, { passive: true }); }, 700);\n    }, true);\n  })();\n<\/script> "])));
}, "/home/runner/work/petto-web/petto-web/src/components/DashMotion.astro", void 0);

var __freeze$8 = Object.freeze;
var __defProp$8 = Object.defineProperty;
var __template$8 = (cooked, raw) => __freeze$8(__defProp$8(cooked, "raw", { value: __freeze$8(cooked.slice()) }));
var _a$8;
const $$DashSelectMenu = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$8 || (_a$8 = __template$8([`<script>
  (function () {
    if (window.__dglSelectMenu) return;
    window.__dglSelectMenu = true;
    // With a mouse, short lists keep the browser's own small list; on a touch screen every list uses this menu.
    var TOUCH = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    var MIN_OPTIONS = TOUCH ? 1 : 6;
    var SEARCH_FROM = 12;
    var menu = null;
    var current = null;

    function eligible(select) {
      if (!select || select.tagName !== 'SELECT' || select.multiple || select.disabled || select.hasAttribute('data-native') || select.closest('[data-native]') || select.closest('astro-island')) return false;
      var minOpts = (document.body.classList.contains('public-body') || document.body.classList.contains('dashboard-motion') || select.hasAttribute('data-dash-menu')) ? 1 : MIN_OPTIONS;
      return select.options.length >= minOpts;
    }
    function close() {
      // The menu fades out where it is (dglMotion, DashMotion.astro) and is removed after; a new one can open meanwhile.
      if (menu) { var gone = menu; menu = null; var held = document.activeElement; if (held && gone.contains(held)) held.blur(); if (window.dglMotion) window.dglMotion.leave(gone, function () { gone.remove(); }); else gone.remove(); }
      if (current) current.removeAttribute('data-menu-open');
      current = null;
    }
    function choose(select, option) {
      if (option.disabled) return;
      select.value = option.value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    function open(select) {
      close();
      current = select;
      select.setAttribute('data-menu-open', '');
      var rect = select.getBoundingClientRect();
      menu = document.createElement('div');
      menu.className = 'dgl-selmenu';
      menu.setAttribute('role', 'listbox');
      var search = null;
      if (select.options.length >= SEARCH_FROM) {
        search = document.createElement('input');
        search.type = 'text';
        search.className = 'dgl-selmenu-search';
        search.autocomplete = 'off';
        search.placeholder = (window.cdt ? window.cdt('Search...') : 'Search...');
        menu.appendChild(search);
      }
      var list = document.createElement('div');
      list.className = 'dgl-selmenu-list';
      menu.appendChild(list);
      var items = [];
      var lastGroup = null;
      var options = Array.prototype.slice.call(select.options);
      // A list of channels (their order and category come from the dashboard script) is listed under its categories, in the order of Discord;
      // the first options that are not channels ("None", "Choose...") stay where they are.
      var ordered = options.filter(function (option) { return option.hasAttribute('data-order'); });
      var byCategory = ordered.length >= 2 && !select.querySelector('optgroup');
      if (byCategory) {
        var firstChannel = options.indexOf(ordered[0]);
        ordered.sort(function (a, b) { return Number(a.getAttribute('data-order')) - Number(b.getAttribute('data-order')); });
        options = options.slice(0, firstChannel).concat(ordered, options.slice(firstChannel).filter(function (option) { return !option.hasAttribute('data-order'); }));
      }
      options.forEach(function (option) {
        var group = option.parentNode && option.parentNode.tagName === 'OPTGROUP' ? option.parentNode.label : (byCategory && option.hasAttribute('data-order') ? option.getAttribute('data-cat') || '' : '');
        if (group && group !== lastGroup) {
          var head = document.createElement('div');
          head.className = 'dgl-selmenu-group';
          if (window.dglCategoryHead) window.dglCategoryHead(head, group); else head.textContent = group;
          list.appendChild(head);
          items.push({ el: head, text: '', group: true });
        }
        lastGroup = group;
        var row = document.createElement('button');
        row.type = 'button';
        row.className = 'dgl-selmenu-opt';
        row.setAttribute('role', 'option');
        // The color of a role as a dot; a role that Petto cannot give is dark and locked with its reason; one above Petto (where it is only a filter) has a small mark.
        var color = option.getAttribute('data-color');
        var plain = option.getAttribute('data-plain');
        var lock = option.getAttribute('data-lock');
        var above = option.getAttribute('data-above');
        var note = option.getAttribute('data-note') || lock;
        var label = plain || option.textContent;
        if (color || note || above) {
          var line = document.createElement('span');
          line.className = 'dgl-selmenu-name';
          // A role is written in its own color, as Discord shows it (no dot).
          if (color) { line.classList.add('dgl-selmenu-role'); line.style.setProperty('--role-c', color); }
          line.appendChild(document.createTextNode(label));
          if (above) { var tag = document.createElement('em'); tag.className = 'dgl-selmenu-tag'; tag.textContent = above; line.appendChild(tag); }
          row.appendChild(line);
          if (note) {
            var why = document.createElement('span');
            why.className = lock ? 'dgl-selmenu-lock' : 'dgl-selmenu-note';
            why.textContent = note;
            row.appendChild(why);
          }
        } else row.textContent = option.textContent;
        if (option.disabled) row.disabled = true;
        if (option.selected) { row.classList.add('on'); row.setAttribute('aria-selected', 'true'); }
        row.addEventListener('click', function () { choose(select, option); close(); select.focus({ preventScroll: true }); });
        list.appendChild(row);
        items.push({ el: row, text: label.toLowerCase(), group: false });
      });
      if (search) {
        search.addEventListener('input', function () {
          var q = search.value.trim().toLowerCase();
          items.forEach(function (item) { item.el.hidden = item.group ? !!q : !!q && item.text.indexOf(q) === -1; });
        });
      }
      document.body.appendChild(menu);
      openWidth = window.innerWidth;
      var pad = 10;
      var gap = 6;
      var width = Math.min(Math.max(rect.width, 220), window.innerWidth - pad * 2);
      var left = Math.min(Math.max(pad, rect.left), Math.max(pad, window.innerWidth - width - pad));
      var viewBottom = window.innerHeight;
      var saveBar = document.getElementById('dgl-savebar');
      if (saveBar && saveBar.classList.contains('show')) {
        var sb = saveBar.getBoundingClientRect();
        if (sb.top > 180 && sb.top < viewBottom) viewBottom = sb.top;
      }
      var below = Math.max(0, viewBottom - rect.bottom - gap - pad);
      var above = Math.max(0, rect.top - gap - pad);
      // Never cover the trigger button or its label: pick the side with more room and fit strictly within it.
      var up = below < 220 && above > below;
      var room = up ? above : below;
      var maxHeight = Math.max(120, Math.min(340, Math.floor(room)));
      if (up) menu.classList.add('up');
      menu.style.cssText = 'left:' + left + 'px;width:' + width + 'px;max-height:' + maxHeight + 'px;' + (up ? 'bottom:' + Math.round(window.innerHeight - rect.top + gap) + 'px;' : 'top:' + Math.round(rect.bottom + gap) + 'px;');
      var on = list.querySelector('.on');
      if (on) on.scrollIntoView({ block: 'center' });
      if (search && window.matchMedia && window.matchMedia('(pointer: fine)').matches) search.focus({ preventScroll: true });
    }

    // The same note under the field while the chosen option has one (a closed list only shows the name). Drawn again by the page after each
    // change and, for the content a page just drew, by dglSelectNotes (the layout calls it).
    function syncNote(select) {
      if (!select || select.tagName !== 'SELECT' || select.multiple) return;
      var option = select.options[select.selectedIndex];
      var text = option ? option.getAttribute('data-note') : '';
      var next = select.nextElementSibling;
      var note = next && next.classList && next.classList.contains('dgl-sel-note') ? next : null;
      if (!text) { if (note) note.remove(); return; }
      if (!note) {
        note = document.createElement('div');
        note.className = 'dgl-sel-note';
        note.setAttribute('role', 'note');
        select.insertAdjacentElement('afterend', note);
      }
      note.textContent = text;
    }
    window.dglSelectNotes = function (root) {
      Array.prototype.forEach.call((root || document).querySelectorAll('select option[data-note]'), function (option) { syncNote(option.parentNode && option.parentNode.tagName === 'OPTGROUP' ? option.parentNode.parentNode : option.parentNode); });
    };
    document.addEventListener('change', function (event) { syncNote(event.target); });

    // On a touch screen the phone opens its own list when the finger lifts, so the tap is taken there (a finger that moved was a scroll).
    var touchStart = null;
    document.addEventListener('touchstart', function (event) {
      var t = event.touches && event.touches[0];
      touchStart = t ? { x: t.clientX, y: t.clientY } : null;
    }, { capture: true, passive: true });
    document.addEventListener('touchend', function (event) {
      var select = event.target && event.target.closest ? event.target.closest('select') : null;
      if (!eligible(select)) return;
      var t = event.changedTouches && event.changedTouches[0];
      if (touchStart && t && (Math.abs(t.clientX - touchStart.x) > 10 || Math.abs(t.clientY - touchStart.y) > 10)) return;
      event.preventDefault();
      if (current === select) { close(); return; }
      open(select);
    }, { capture: true, passive: false });
    function typingInMenu() {
      var active = document.activeElement;
      return !!(menu && active && menu.contains(active));
    }

    document.addEventListener('mousedown', function (event) {
      var select = event.target && event.target.closest ? event.target.closest('select') : null;
      if (menu && !(event.target.closest && event.target.closest('.dgl-selmenu')) && select !== current) close();
      if (!eligible(select)) return;
      event.preventDefault();
      if (current === select) { close(); return; }
      open(select);
    }, true);
    // Focus that goes to another field (Tab, a script, a tap on a text box) closes the menu: what is typed next must go to that field, not to the menu.
    document.addEventListener('focusin', function (event) {
      var target = event.target;
      if (menu && target && !(target.closest && target.closest('.dgl-selmenu')) && target !== current) close();
    }, true);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu) { close(); return; }
      var select = event.target && event.target.tagName === 'SELECT' ? event.target : null;
      if (!eligible(select)) return;
      if (event.key === 'Enter' || event.key === ' ' || (event.altKey && event.key === 'ArrowDown')) { event.preventDefault(); open(select); }
    }, true);
    // The phone's keyboard (typing in the search box) resizes and scrolls the page: that must not close the menu.
    // Only a change of width closes it: scrolling a list on a phone shows and hides the browser's address bar, which changes the height.
    var openWidth = window.innerWidth;
    window.addEventListener('resize', function () { if (typingInMenu()) return; if (menu && window.innerWidth === openWidth) return; close(); });
    document.addEventListener('scroll', function (event) { if (menu && !typingInMenu() && !(event.target && event.target.closest && event.target.closest('.dgl-selmenu'))) close(); }, true);
    document.addEventListener('touchstart', function (event) {
      if (menu && !(event.target && event.target.closest && (event.target.closest('.dgl-selmenu') || event.target.closest('select') === current))) close();
    }, { capture: true, passive: true });
  })();
<\/script> `])));
}, "/home/runner/work/petto-web/petto-web/src/components/DashSelectMenu.astro", void 0);

var __freeze$7 = Object.freeze;
var __defProp$7 = Object.defineProperty;
var __template$7 = (cooked, raw) => __freeze$7(__defProp$7(cooked, "raw", { value: __freeze$7(cooked.slice()) }));
var _a$7;
const $$DashToast = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$7 || (_a$7 = __template$7(["", `<div class="dgl-toasts" id="dgl-toasts" role="status" aria-live="polite" aria-atomic="false"></div> <div class="dgl-toasts-alert" id="dgl-toasts-alert" role="alert" aria-live="assertive"></div> <script>
  (function () {
    if (window.dglToast) return;
    var MAX = 3;
    var ICONS = {
      ok: '<svg viewBox="0 0 256 256" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/></svg>',
      error: '<svg viewBox="0 0 256 256" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M236.8 188.09 149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19 23.51 23.51 0 0 0 .02-23.72ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z"/></svg>',
      info: '<svg viewBox="0 0 256 256" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-4 48a12 12 0 1 1-12 12 12 12 0 0 1 12-12Zm12 112a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16 16 16 0 0 1 16 16v40a8 8 0 0 1 0 16Z"/></svg>',
    };
    function stack() { return document.getElementById('dgl-toasts'); }
    function close(el) {
      if (!el || !el.isConnected || el._closing) return;
      el._closing = true;
      clearTimeout(el._timer);
      var done = function () { el.remove(); };
      if (window.dglMotion) window.dglMotion.leave(el, done); else done();
    }
    window.dglToast = function (text, opts) {
      opts = opts || {};
      var host = stack();
      if (!host || !text) return function () {};
      var kind = opts.kind === 'error' ? 'error' : opts.kind === 'info' ? 'info' : 'ok';
      // The same message twice in a row is one message (a double click, a script that reports twice).
      var last = host.lastElementChild;
      if (last && !last._closing && last.getAttribute('data-text') === text) { clearTimeout(last._timer); last._timer = setTimeout(function () { close(last); }, opts.ms || 3200); return function () { close(last); }; }
      var el = document.createElement('div');
      el.className = 'dgl-toast dgl-toast-' + kind;
      el.setAttribute('data-text', text);
      el.innerHTML = ICONS[kind];
      var span = document.createElement('span');
      span.textContent = text;
      el.appendChild(span);
      el.addEventListener('click', function () { close(el); });
      host.appendChild(el);
      // Errors are also said at once by the assertive region (they matter more than a "Saved").
      if (kind === 'error') { var alert = document.getElementById('dgl-toasts-alert'); if (alert) { alert.textContent = ''; setTimeout(function () { alert.textContent = text; }, 30); } }
      var live = Array.prototype.filter.call(host.children, function (child) { return !child._closing; });
      while (live.length > MAX) close(live.shift());
      el._timer = setTimeout(function () { close(el); }, opts.ms || (kind === 'error' ? 6000 : 3200));
      return function () { close(el); };
    };
  })();
<\/script> `])), maybeRenderHead());
}, "/home/runner/work/petto-web/petto-web/src/components/DashToast.astro", void 0);

var __freeze$6 = Object.freeze;
var __defProp$6 = Object.defineProperty;
var __template$6 = (cooked, raw) => __freeze$6(__defProp$6(cooked, "raw", { value: __freeze$6(raw || cooked.slice()) }));
var _a$6;
const $$Astro$8 = createAstro("https://petto.sbs");
const $$DashConfirm = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$DashConfirm;
  const dt = makeT(getDashLang(Astro2));
  const words = { title: dt("Are you sure?"), confirm: dt("Confirm"), cancel: dt("Cancel") };
  return renderTemplate(_a$6 || (_a$6 = __template$6(["<script>", `<\/script> <script>
  (function () {
    if (window.dglConfirm) return;
    var ICON = '<svg viewBox="0 0 256 256" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M236.8 188.09 149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19 23.51 23.51 0 0 0 .02-23.72ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z"/></svg>';
    var open = null;
    function words() { return window.dglConfirmWords || { title: 'Are you sure?', confirm: 'Confirm', cancel: 'Cancel' }; }
    function ask(text, opts) {
      opts = opts || {};
      // One question at a time: asking again while one is open answers "no" to the old one.
      if (open) open(false);
      return new Promise(function (resolve) {
        var w = words();
        var returnTo = document.activeElement;
        var layer = document.createElement('div');
        layer.className = 'dgl-ask';
        layer.setAttribute('role', 'alertdialog');
        layer.setAttribute('aria-modal', 'true');
        var box = document.createElement('div');
        box.className = 'dgl-ask-box' + (opts.tone === 'neutral' ? ' neutral' : ' danger');
        var icon = document.createElement('span'); icon.className = 'dgl-ask-icon'; icon.innerHTML = ICON; icon.setAttribute('aria-hidden', 'true');
        var title = document.createElement('h2'); title.className = 'dgl-ask-title'; title.id = 'dgl-ask-title'; title.textContent = opts.title || w.title;
        var body = document.createElement('p'); body.className = 'dgl-ask-text'; body.id = 'dgl-ask-text'; body.textContent = text || '';
        var yes = document.createElement('button'); yes.type = 'button'; yes.className = 'dgl-ask-yes'; yes.textContent = opts.confirm || w.confirm;
        var no = document.createElement('button'); no.type = 'button'; no.className = 'dgl-ask-no'; no.textContent = opts.cancel || w.cancel;
        layer.setAttribute('aria-labelledby', 'dgl-ask-title'); layer.setAttribute('aria-describedby', 'dgl-ask-text');
        // A question that wants a word as the answer (dglPrompt): one line of text between the question and the buttons.
        var input = null;
        if (opts.field) {
          input = document.createElement('input'); input.type = 'text'; input.className = 'dgl-ask-input'; input.autocomplete = 'off'; input.spellcheck = false;
          input.placeholder = opts.field.placeholder || ''; input.value = opts.field.value || ''; input.setAttribute('aria-labelledby', 'dgl-ask-text');
          if (opts.field.maxLength) input.maxLength = opts.field.maxLength;
          if (opts.field.inputMode) input.inputMode = opts.field.inputMode;
        }
        box.append(icon, title, body);
        if (input) box.appendChild(input);
        box.append(yes, no);
        layer.appendChild(box);
        var settled = false;
        function finish(answer) {
          if (settled) return;
          settled = true;
          open = null;
          document.removeEventListener('keydown', onKey, true);
          var done = function () {
            layer.remove();
            document.documentElement.classList.remove('dgl-ask-open');
            if (returnTo && returnTo.isConnected && returnTo.focus) { try { returnTo.focus({ preventScroll: true }); } catch (e) {} }
            resolve(answer && input ? input.value : answer);
          };
          if (window.dglMotion) window.dglMotion.leave(layer, done); else done();
        }
        function onKey(e) {
          if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); return; }
          if (e.key === 'Tab') {
            // The focus stays inside the card: between its two buttons.
            e.preventDefault();
            var order = input ? [input, yes, no] : [yes, no];
            var at = order.indexOf(document.activeElement);
            order[(at + (e.shiftKey ? order.length - 1 : 1)) % order.length].focus();
            return;
          }
          if (e.key === 'Enter' && input && document.activeElement === input) { e.preventDefault(); finish(true); }
        }
        yes.addEventListener('click', function () { finish(true); });
        no.addEventListener('click', function () { finish(false); });
        layer.addEventListener('mousedown', function (e) { if (e.target === layer) finish(false); });
        document.addEventListener('keydown', onKey, true);
        open = finish;
        document.documentElement.classList.add('dgl-ask-open');
        document.body.appendChild(layer);
        (input || no).focus({ preventScroll: true });
      });
    }
    window.dglConfirm = function (text, opts) { return ask(text, opts); };
    // dglPrompt(text, { field: { placeholder, value, maxLength, inputMode }, title, confirm }) settles with the written text, or null for no.
    window.dglPrompt = function (text, opts) { return ask(text, Object.assign({ tone: 'neutral', field: {} }, opts)).then(function (answer) { return answer === false ? null : String(answer); }); };

    // A card that says what is going on while something takes a moment ("Deleting backup...", then "Removing the saved files...", then
    // "Almost done..."): a turning ring and a line of text that changes by itself, the last one stays. Scripts call
    //   var work = window.dglProgress(['Deleting backup...', 'Removing the saved files...', 'Almost done...'], { title: 'Deleting' })
    // and \`work.close()\` when it is over (\`work.set(text)\` shows a line at once). It cannot be dismissed (the work is under way); it closes
    // by itself after a minute at most, and a form with data-progress="a|b|c" shows it when it is sent.
    var working = null;
    window.dglProgress = function (messages, opts) {
      opts = opts || {};
      if (working) working.close();
      var list = (Array.isArray(messages) ? messages : String(messages || '').split('|')).map(function (m) { return String(m).trim(); }).filter(Boolean);
      var layer = document.createElement('div');
      layer.className = 'dgl-ask dgl-work';
      layer.setAttribute('role', 'alertdialog'); layer.setAttribute('aria-modal', 'true'); layer.setAttribute('aria-busy', 'true');
      var box = document.createElement('div'); box.className = 'dgl-ask-box neutral';
      var ring = document.createElement('span'); ring.className = 'dgl-work-ring'; ring.setAttribute('aria-hidden', 'true');
      var title = document.createElement('h2'); title.className = 'dgl-ask-title'; title.textContent = opts.title || list[0] || '';
      var line = document.createElement('p'); line.className = 'dgl-ask-text dgl-work-line'; line.setAttribute('role', 'status'); line.setAttribute('aria-live', 'polite');
      box.append(ring, title, line); layer.appendChild(box);
      var index = 0, timer = 0, closed = false, guard = 0;
      function show(text) { line.classList.remove('in'); void line.offsetWidth; line.textContent = text; line.classList.add('in'); }
      function next() {
        if (closed) return;
        show(list[Math.min(index, list.length - 1)] || '');
        index += 1;
        if (index < list.length) timer = setTimeout(next, opts.every || 1700);
      }
      var handle = {
        set: function (text) { clearTimeout(timer); show(text); },
        close: function () {
          if (closed) return;
          closed = true; clearTimeout(timer); clearTimeout(guard);
          if (working === handle) working = null;
          var done = function () { layer.remove(); document.documentElement.classList.remove('dgl-ask-open'); };
          if (window.dglMotion) window.dglMotion.leave(layer, done); else done();
        },
      };
      working = handle;
      document.documentElement.classList.add('dgl-ask-open');
      document.body.appendChild(layer);
      next();
      guard = setTimeout(handle.close, 60000);
      return handle;
    };
    // A form that is sent the usual way (the page loads again) shows the card until the new page arrives; one that the dashboard sends
    // without leaving the page asks for it itself (the submit handler of the layout) and closes it when the answer is drawn.
    document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!form || !form.getAttribute || !form.hasAttribute('data-progress') || event.defaultPrevented) return;
      window.dglProgress(form.getAttribute('data-progress'), { title: form.getAttribute('data-progress-title') || undefined });
    });
    window.addEventListener('pageshow', function (event) { if (event.persisted && working) working.close(); });

    // data-confirm on a button or on a form: the action waits for a yes. The answer is given once; then the same click or submit goes on.
    var passing = false;
    document.addEventListener('click', function (event) {
      if (passing) return;
      var button = event.target && event.target.closest ? event.target.closest('button[data-confirm], a[data-confirm], [role="button"][data-confirm]') : null;
      if (!button || button.disabled) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.dglConfirm(button.getAttribute('data-confirm'), { tone: button.getAttribute('data-confirm-tone') || undefined, confirm: (button.getAttribute('data-confirm-yes') || button.textContent || button.getAttribute('aria-label') || button.getAttribute('title') || '').trim().slice(0, 40) || undefined }).then(function (yes) {
        if (!yes) return;
        passing = true;
        try { button.click(); } finally { passing = false; }
      });
    }, true);
    document.addEventListener('submit', function (event) {
      if (passing) return;
      var form = event.target;
      if (!form || !form.getAttribute || !form.hasAttribute('data-confirm')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      var submitter = event.submitter || null;
      // The yes button is named after the button that sent the form (or data-confirm-yes on the form).
      var yesLabel = (form.getAttribute('data-confirm-yes') || (submitter && (submitter.textContent || submitter.getAttribute('aria-label') || submitter.getAttribute('title'))) || '').trim().slice(0, 40);
      window.dglConfirm(form.getAttribute('data-confirm'), { tone: form.getAttribute('data-confirm-tone') || undefined, confirm: yesLabel || undefined }).then(function (yes) {
        if (!yes) return;
        passing = true;
        try { if (form.requestSubmit) form.requestSubmit(submitter || undefined); else form.submit(); } finally { passing = false; }
      });
    }, true);
  })();
<\/script> `], ["<script>", `<\/script> <script>
  (function () {
    if (window.dglConfirm) return;
    var ICON = '<svg viewBox="0 0 256 256" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M236.8 188.09 149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19 23.51 23.51 0 0 0 .02-23.72ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z"/></svg>';
    var open = null;
    function words() { return window.dglConfirmWords || { title: 'Are you sure?', confirm: 'Confirm', cancel: 'Cancel' }; }
    function ask(text, opts) {
      opts = opts || {};
      // One question at a time: asking again while one is open answers "no" to the old one.
      if (open) open(false);
      return new Promise(function (resolve) {
        var w = words();
        var returnTo = document.activeElement;
        var layer = document.createElement('div');
        layer.className = 'dgl-ask';
        layer.setAttribute('role', 'alertdialog');
        layer.setAttribute('aria-modal', 'true');
        var box = document.createElement('div');
        box.className = 'dgl-ask-box' + (opts.tone === 'neutral' ? ' neutral' : ' danger');
        var icon = document.createElement('span'); icon.className = 'dgl-ask-icon'; icon.innerHTML = ICON; icon.setAttribute('aria-hidden', 'true');
        var title = document.createElement('h2'); title.className = 'dgl-ask-title'; title.id = 'dgl-ask-title'; title.textContent = opts.title || w.title;
        var body = document.createElement('p'); body.className = 'dgl-ask-text'; body.id = 'dgl-ask-text'; body.textContent = text || '';
        var yes = document.createElement('button'); yes.type = 'button'; yes.className = 'dgl-ask-yes'; yes.textContent = opts.confirm || w.confirm;
        var no = document.createElement('button'); no.type = 'button'; no.className = 'dgl-ask-no'; no.textContent = opts.cancel || w.cancel;
        layer.setAttribute('aria-labelledby', 'dgl-ask-title'); layer.setAttribute('aria-describedby', 'dgl-ask-text');
        // A question that wants a word as the answer (dglPrompt): one line of text between the question and the buttons.
        var input = null;
        if (opts.field) {
          input = document.createElement('input'); input.type = 'text'; input.className = 'dgl-ask-input'; input.autocomplete = 'off'; input.spellcheck = false;
          input.placeholder = opts.field.placeholder || ''; input.value = opts.field.value || ''; input.setAttribute('aria-labelledby', 'dgl-ask-text');
          if (opts.field.maxLength) input.maxLength = opts.field.maxLength;
          if (opts.field.inputMode) input.inputMode = opts.field.inputMode;
        }
        box.append(icon, title, body);
        if (input) box.appendChild(input);
        box.append(yes, no);
        layer.appendChild(box);
        var settled = false;
        function finish(answer) {
          if (settled) return;
          settled = true;
          open = null;
          document.removeEventListener('keydown', onKey, true);
          var done = function () {
            layer.remove();
            document.documentElement.classList.remove('dgl-ask-open');
            if (returnTo && returnTo.isConnected && returnTo.focus) { try { returnTo.focus({ preventScroll: true }); } catch (e) {} }
            resolve(answer && input ? input.value : answer);
          };
          if (window.dglMotion) window.dglMotion.leave(layer, done); else done();
        }
        function onKey(e) {
          if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); return; }
          if (e.key === 'Tab') {
            // The focus stays inside the card: between its two buttons.
            e.preventDefault();
            var order = input ? [input, yes, no] : [yes, no];
            var at = order.indexOf(document.activeElement);
            order[(at + (e.shiftKey ? order.length - 1 : 1)) % order.length].focus();
            return;
          }
          if (e.key === 'Enter' && input && document.activeElement === input) { e.preventDefault(); finish(true); }
        }
        yes.addEventListener('click', function () { finish(true); });
        no.addEventListener('click', function () { finish(false); });
        layer.addEventListener('mousedown', function (e) { if (e.target === layer) finish(false); });
        document.addEventListener('keydown', onKey, true);
        open = finish;
        document.documentElement.classList.add('dgl-ask-open');
        document.body.appendChild(layer);
        (input || no).focus({ preventScroll: true });
      });
    }
    window.dglConfirm = function (text, opts) { return ask(text, opts); };
    // dglPrompt(text, { field: { placeholder, value, maxLength, inputMode }, title, confirm }) settles with the written text, or null for no.
    window.dglPrompt = function (text, opts) { return ask(text, Object.assign({ tone: 'neutral', field: {} }, opts)).then(function (answer) { return answer === false ? null : String(answer); }); };

    // A card that says what is going on while something takes a moment ("Deleting backup...", then "Removing the saved files...", then
    // "Almost done..."): a turning ring and a line of text that changes by itself, the last one stays. Scripts call
    //   var work = window.dglProgress(['Deleting backup...', 'Removing the saved files...', 'Almost done...'], { title: 'Deleting' })
    // and \\\`work.close()\\\` when it is over (\\\`work.set(text)\\\` shows a line at once). It cannot be dismissed (the work is under way); it closes
    // by itself after a minute at most, and a form with data-progress="a|b|c" shows it when it is sent.
    var working = null;
    window.dglProgress = function (messages, opts) {
      opts = opts || {};
      if (working) working.close();
      var list = (Array.isArray(messages) ? messages : String(messages || '').split('|')).map(function (m) { return String(m).trim(); }).filter(Boolean);
      var layer = document.createElement('div');
      layer.className = 'dgl-ask dgl-work';
      layer.setAttribute('role', 'alertdialog'); layer.setAttribute('aria-modal', 'true'); layer.setAttribute('aria-busy', 'true');
      var box = document.createElement('div'); box.className = 'dgl-ask-box neutral';
      var ring = document.createElement('span'); ring.className = 'dgl-work-ring'; ring.setAttribute('aria-hidden', 'true');
      var title = document.createElement('h2'); title.className = 'dgl-ask-title'; title.textContent = opts.title || list[0] || '';
      var line = document.createElement('p'); line.className = 'dgl-ask-text dgl-work-line'; line.setAttribute('role', 'status'); line.setAttribute('aria-live', 'polite');
      box.append(ring, title, line); layer.appendChild(box);
      var index = 0, timer = 0, closed = false, guard = 0;
      function show(text) { line.classList.remove('in'); void line.offsetWidth; line.textContent = text; line.classList.add('in'); }
      function next() {
        if (closed) return;
        show(list[Math.min(index, list.length - 1)] || '');
        index += 1;
        if (index < list.length) timer = setTimeout(next, opts.every || 1700);
      }
      var handle = {
        set: function (text) { clearTimeout(timer); show(text); },
        close: function () {
          if (closed) return;
          closed = true; clearTimeout(timer); clearTimeout(guard);
          if (working === handle) working = null;
          var done = function () { layer.remove(); document.documentElement.classList.remove('dgl-ask-open'); };
          if (window.dglMotion) window.dglMotion.leave(layer, done); else done();
        },
      };
      working = handle;
      document.documentElement.classList.add('dgl-ask-open');
      document.body.appendChild(layer);
      next();
      guard = setTimeout(handle.close, 60000);
      return handle;
    };
    // A form that is sent the usual way (the page loads again) shows the card until the new page arrives; one that the dashboard sends
    // without leaving the page asks for it itself (the submit handler of the layout) and closes it when the answer is drawn.
    document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!form || !form.getAttribute || !form.hasAttribute('data-progress') || event.defaultPrevented) return;
      window.dglProgress(form.getAttribute('data-progress'), { title: form.getAttribute('data-progress-title') || undefined });
    });
    window.addEventListener('pageshow', function (event) { if (event.persisted && working) working.close(); });

    // data-confirm on a button or on a form: the action waits for a yes. The answer is given once; then the same click or submit goes on.
    var passing = false;
    document.addEventListener('click', function (event) {
      if (passing) return;
      var button = event.target && event.target.closest ? event.target.closest('button[data-confirm], a[data-confirm], [role="button"][data-confirm]') : null;
      if (!button || button.disabled) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.dglConfirm(button.getAttribute('data-confirm'), { tone: button.getAttribute('data-confirm-tone') || undefined, confirm: (button.getAttribute('data-confirm-yes') || button.textContent || button.getAttribute('aria-label') || button.getAttribute('title') || '').trim().slice(0, 40) || undefined }).then(function (yes) {
        if (!yes) return;
        passing = true;
        try { button.click(); } finally { passing = false; }
      });
    }, true);
    document.addEventListener('submit', function (event) {
      if (passing) return;
      var form = event.target;
      if (!form || !form.getAttribute || !form.hasAttribute('data-confirm')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      var submitter = event.submitter || null;
      // The yes button is named after the button that sent the form (or data-confirm-yes on the form).
      var yesLabel = (form.getAttribute('data-confirm-yes') || (submitter && (submitter.textContent || submitter.getAttribute('aria-label') || submitter.getAttribute('title'))) || '').trim().slice(0, 40);
      window.dglConfirm(form.getAttribute('data-confirm'), { tone: form.getAttribute('data-confirm-tone') || undefined, confirm: yesLabel || undefined }).then(function (yes) {
        if (!yes) return;
        passing = true;
        try { if (form.requestSubmit) form.requestSubmit(submitter || undefined); else form.submit(); } finally { passing = false; }
      });
    }, true);
  })();
<\/script> `])), unescapeHTML(`window.dglConfirmWords = ${JSON.stringify(words)};`));
}, "/home/runner/work/petto-web/petto-web/src/components/DashConfirm.astro", void 0);

var __freeze$5 = Object.freeze;
var __defProp$5 = Object.defineProperty;
var __template$5 = (cooked, raw) => __freeze$5(__defProp$5(cooked, "raw", { value: __freeze$5(cooked.slice()) }));
var _a$5;
const $$Astro$7 = createAstro("https://petto.sbs");
const $$DashLoading = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$DashLoading;
  const dt = makeT(getDashLang(Astro2));
  const words = { failed: dt("Could not load this."), retry: dt("Try again") };
  return renderTemplate(_a$5 || (_a$5 = __template$5(["<script>", "<\/script>  "])), unescapeHTML(`window.dglLoadWords = ${JSON.stringify(words)};`));
}, "/home/runner/work/petto-web/petto-web/src/components/DashLoading.astro", void 0);

const $$Astro$6 = createAstro("https://petto.sbs");
const $$DashPanelKit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$DashPanelKit;
  const dt = makeT(getDashLang(Astro2));
  return renderTemplate`${renderComponent($$result, "DashClientI18n", $$DashClientI18N, {})} ${renderComponent($$result, "DashMotion", $$DashMotion, {})} ${renderComponent($$result, "DashSelectMenu", $$DashSelectMenu, {})} ${renderComponent($$result, "DashToast", $$DashToast, {})} ${renderComponent($$result, "DashConfirm", $$DashConfirm, {})} ${renderComponent($$result, "DashLoading", $$DashLoading, {})} ${maybeRenderHead()}<div class="dpk-progress" id="dpk-progress" aria-hidden="true"></div> <div class="dpk-bar" id="dpk-bar" role="status" aria-live="polite"> <span class="dpk-bar-dot" aria-hidden="true"></span> <span class="dpk-bar-spin" aria-hidden="true"></span> <span class="dpk-bar-text"${addAttribute(dt("You have unsaved changes"), "data-idle")}${addAttribute(dt("Saving..."), "data-busy")}>${dt("You have unsaved changes")}</span> <div class="dpk-bar-actions"> <button type="button" class="dpk-bar-discard" data-dpk-discard>${dt("Discard")}</button> <button type="button" class="dpk-bar-save" data-dpk-save>${dt("Save changes")}<kbd aria-hidden="true">Ctrl S</kbd></button> </div> </div>  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPanelKit.astro", void 0);

var __freeze$4 = Object.freeze;
var __defProp$4 = Object.defineProperty;
var __template$4 = (cooked, raw) => __freeze$4(__defProp$4(cooked, "raw", { value: __freeze$4(cooked.slice()) }));
var _a$4;
const $$Astro$5 = createAstro("https://petto.sbs");
const $$GlassDock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$GlassDock;
  const { base, route, labels } = Astro2.props;
  const items = [
    { key: "home", href: `${base}/`, label: labels.home, match: (r) => r === "/", icon: "M4 11.2 12 4l8 7.2V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1v-7.8Z" },
    { key: "commands", href: `${base}/commands`, label: labels.commands, match: (r) => r.startsWith("/commands"), icon: "M9 9V6.5A2.5 2.5 0 1 0 6.5 9H9Zm0 0h6m-6 0v6m6-6V6.5A2.5 2.5 0 1 1 17.5 9H15Zm0 0v6m-6 0H6.5A2.5 2.5 0 1 0 9 17.5V15Zm0 0h6m0 0h2.5a2.5 2.5 0 1 1-2.5 2.5V15Z" },
    { key: "premium", href: `${base}/premium`, label: labels.premium, match: (r) => r.startsWith("/premium"), icon: "M4 8l3.5 3L12 5l4.5 6L20 8l-1.6 10H5.6L4 8Zm1.6 12h12.8" },
    { key: "status", href: `${base}/status`, label: labels.status, match: (r) => r.startsWith("/status"), icon: "M3 12h4l2.5-6 4 12 2.5-6H21" },
    { key: "support", href: "https://petto.sbs/support", label: labels.support, match: () => false, external: true, icon: "M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20Z" }
  ];
  const activeIndex = items.findIndex((item) => item.match(route));
  const accountActive = route === "/dash" || route.startsWith("/dash/");
  return renderTemplate(_a$4 || (_a$4 = __template$4(["", '<nav class="gdock" id="gdock" aria-label="Petto"', "", '> <div class="gdock-pill lg-glass"> <span class="gdock-lens" aria-hidden="true"></span> ', " </div> <a", "", "", `> <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.6-3.4 3.4-5.5 7-5.5s6.4 2.1 7 5.5"></path></svg> </a> </nav>  <script>
  (function () {
    var dock = document.getElementById('gdock');
    if (!dock) return;

    var items = dock.querySelectorAll('.gdock-item');
    // Pressing an item slides the lens there right away, and the page follows.
    items.forEach(function (item) {
      var press = function () {
        dock.style.setProperty('--i', item.getAttribute('data-index'));
        dock.classList.add('is-touching');
        items.forEach(function (other) { other.classList.toggle('is-pressed', other === item); });
      };
      item.addEventListener('pointerdown', press);
      item.addEventListener('focus', press);
    });
  })();
<\/script>`])), maybeRenderHead(), addAttribute(`--i: ${Math.max(activeIndex, 0)};`, "style"), addAttribute(activeIndex >= 0 ? "true" : "false", "data-has-active"), items.map((item, index) => renderTemplate`<a${addAttribute(["gdock-item", { "is-active": index === activeIndex }], "class:list")}${addAttribute(item.href, "href")}${addAttribute(item.label, "aria-label")}${addAttribute(index === activeIndex ? "page" : void 0, "aria-current")}${addAttribute(index, "data-index")}${addAttribute(item.external ? "_blank" : void 0, "target")}${addAttribute(item.external ? "noopener" : void 0, "rel")}> <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(item.icon, "d")}></path></svg> </a>`), addAttribute(["gdock-account", "lg-glass", { "is-active": accountActive }], "class:list"), addAttribute(`${base}/dash`, "href"), addAttribute(labels.account, "aria-label"));
}, "/home/runner/work/petto-web/petto-web/src/components/GlassDock.astro", void 0);

var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(raw || cooked.slice()) }));
var _a$3;
const $$LiquidGlass = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$3 || (_a$3 = __template$3(["", `<svg class="lg-defs" width="0" height="0" aria-hidden="true" focusable="false"></svg>  <script>
  (function () {
    var root = document.documentElement;
    var SVG = 'http://www.w3.org/2000/svg';
    var ua = navigator.userAgent;
    // The bend is a backdrop-filter with an SVG filter, which only Chromium engines draw.
    if (/Chrome\\//.test(ua) && !/Firefox\\//.test(ua)) root.setAttribute('data-lens', '');
    // A phone that is slow, or that already showed it cannot keep up (below), gets the frosted glass without the bend.
    var STORE = 'petto-glass-lite';
    var remembered = false;
    // ?glass=full brings the bend back for a visit that was switched to the frosted glass.
    try {
      if (/[?&]glass=full\\b/.test(location.search)) sessionStorage.removeItem(STORE);
      remembered = sessionStorage.getItem(STORE) === '1';
    } catch (e) { /* storage can be blocked */ }
    // The number of cores is not used: some browsers (Brave among them) report a made-up small number to hide the device.
    if (remembered) root.removeAttribute('data-lens');
    var lens = root.hasAttribute('data-lens');
    var defs = document.querySelector('.lg-defs');

    // The map of the glass, a picture that the filter reads to know how far to move each point of what is behind it. Grey (128) means
    // "do not move". It holds two things at once, so one filter pass is enough: (1) the rim of the rounded box, where the picture is pushed
    // along the normal of the edge, more the closer to the rim, so the glass bends at its edge and is clear in the middle, and (2) slow
    // waves over the whole surface, a few sines drawn once here, so what passes under the glass flows and smears like liquid.
    var WAVES = 23; // the distortion of the waves, in pixels
    var waveSet = [[0.083, 0.4, 1.3, 2.1], [0.047, 1.9, 4.2, 0.7], [0.121, 3.1, 2.6, 5.0], [0.061, 5.0, 0.3, 3.4]];
    function wave(x, y, shift) {
      var total = 0;
      for (var k = 0; k < waveSet.length; k += 1) {
        var w = waveSet[k];
        total += Math.sin(w[0] * (x * Math.cos(w[1] + shift) + y * Math.sin(w[1] + shift)) + w[2] + shift * w[3]);
      }
      return total / waveSet.length; // -1..1
    }
    function glassMap(width, height, radius, bezel, span) {
      var canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      var ctx = canvas.getContext('2d');
      if (!ctx) return null;
      var image = ctx.createImageData(width, height);
      var hw = width / 2, hh = height / 2;
      var rimMax = bezel * 1.3, waveMax = WAVES / 2;
      for (var y = 0; y < height; y += 1) {
        for (var x = 0; x < width; x += 1) {
          // Signed distance to a rounded box, and the direction of the edge.
          var px = x + 0.5 - hw, py = y + 0.5 - hh;
          var qx = Math.abs(px) - (hw - radius), qy = Math.abs(py) - (hh - radius);
          var ox = Math.max(qx, 0), oy = Math.max(qy, 0);
          var outside = Math.sqrt(ox * ox + oy * oy);
          var depth = radius - (outside + Math.min(Math.max(qx, qy), 0));
          var dx = wave(x, y, 0) * waveMax, dy = wave(x, y, 1.7) * waveMax;
          if (depth >= 0 && depth < bezel) {
            var nx, ny;
            if (outside > 0) { nx = ox / outside; ny = oy / outside; } else if (qx > qy) { nx = 1; ny = 0; } else { nx = 0; ny = 1; }
            nx *= px < 0 ? -1 : 1; ny *= py < 0 ? -1 : 1;
            // A curve that is steep at the very rim and gentle further in, like the surface of a thick glass. The light is taken from further in.
            var strength = Math.pow(1 - depth / bezel, 2);
            dx -= nx * strength * rimMax;
            dy -= ny * strength * rimMax;
          }
          var i = (y * width + x) * 4;
          image.data[i] = Math.max(0, Math.min(255, 128 + (dx / span) * 255));
          image.data[i + 1] = Math.max(0, Math.min(255, 128 + (dy / span) * 255));
          image.data[i + 2] = 128; image.data[i + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
      return canvas.toDataURL('image/png');
    }

    var counter = 0;
    var pending = [];
    function fit(element) {
      // The layout size, which an entry animation (a scale) does not change.
      var width = element.offsetWidth, height = element.offsetHeight;
      if (!width || !height || element.getAttribute('data-lg-size') === width + 'x' + height) return;
      var radius = Math.min(parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0, width / 2, height / 2);
      var bezel = Math.max(8, Math.min(radius * 0.95 || height / 2, height / 2 * 0.95, 26));
      // One displacement of up to rimMax + waveMax pixels in each direction; the picture is the size of the glass in CSS pixels.
      var span = (bezel * 1.3 + WAVES / 2) * 2;
      var url = glassMap(width, height, radius, bezel, span);
      if (!url) return;
      var id = element.getAttribute('data-lg-id');
      if (!id) { counter += 1; id = 'lg-f-' + counter; element.setAttribute('data-lg-id', id); }
      // A new filter with a new name takes the place of the old one, and the old one goes a moment later, so the glass is never left without one.
      var previous = element.getAttribute('data-lg-filter');
      counter += 1;
      id = id + '-' + counter;
      var filter = document.createElementNS(SVG, 'filter');
      filter.setAttribute('id', id);
      filter.setAttribute('filterUnits', 'userSpaceOnUse');
      filter.setAttribute('x', '0'); filter.setAttribute('y', '0');
      filter.setAttribute('width', width); filter.setAttribute('height', height);
      filter.setAttribute('color-interpolation-filters', 'sRGB');
      var image = document.createElementNS(SVG, 'feImage');
      image.setAttribute('x', '0'); image.setAttribute('y', '0');
      image.setAttribute('width', width); image.setAttribute('height', height);
      image.setAttribute('preserveAspectRatio', 'none');
      image.setAttribute('result', 'map');
      image.setAttribute('href', url);
      var displace = document.createElementNS(SVG, 'feDisplacementMap');
      displace.setAttribute('in', 'SourceGraphic'); displace.setAttribute('in2', 'map');
      displace.setAttribute('scale', String(Math.round(span)));
      displace.setAttribute('xChannelSelector', 'R'); displace.setAttribute('yChannelSelector', 'G');
      filter.appendChild(image); filter.appendChild(displace);
      defs.appendChild(filter);
      element.setAttribute('data-lg-size', width + 'x' + height);
      element.setAttribute('data-lg-filter', id);
      element.style.setProperty('--lg-filter', 'url(#' + id + ')');
      if (previous) requestAnimationFrame(function () { var old = document.getElementById(previous); if (old) old.remove(); });
      // The picture of the map is decoded before the glass shows, or the first frames would be drawn without the bend.
      var probe = new Image();
      probe.src = url;
      pending.push(probe.decode ? probe.decode().catch(function () {}) : Promise.resolve());
    }

    var glass = [];
    function collect() {
      glass = Array.prototype.slice.call(document.querySelectorAll('.lg-glass, body.public-body header.nav'));
    }
    function fitAll() { glass.forEach(fit); }
    var shown = false;
    function show() {
      if (shown) return;
      shown = true;
      root.setAttribute('data-lg-ready', '');
    }
    function start() {
      collect();
      if (!lens || !defs) { show(); return; }
      fitAll();
      // The glass shows when the maps are decoded and the entry animation of the bars is over (while it runs the bar is the root of its own
      // backdrop and cannot see the page, so showing the glass then would make it snap on at the end).
      var settle = function (tries) {
        var running = [];
        glass.forEach(function (element) { if (element.getAnimations) running = running.concat(element.getAnimations()); });
        if (running.length && tries < 6) {
          Promise.all(running.map(function (animation) { return animation.finished.catch(function () {}); })).then(function () { settle(tries + 1); });
        } else {
          Promise.all(pending).then(function () { requestAnimationFrame(show); });
        }
      };
      // A moment later, so that the page has had time to start those animations.
      setTimeout(function () { settle(0); }, 150);
      setTimeout(show, 2200);
      // The bars change size with the screen, so their maps are drawn again.
      if (window.ResizeObserver) {
        var observer = new ResizeObserver(function () { fitAll(); });
        glass.forEach(function (element) { observer.observe(element); });
      } else {
        window.addEventListener('resize', fitAll);
      }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();

    // The bend is the part that costs the most, because the browser draws it again on every frame of a scroll. While the page scrolls, the
    // time of the frames is watched, and if the phone cannot keep about 40 frames a second the bend is turned off for the rest of the visit.
    if (lens) {
      var watching = false, last = 0, deltas = [], quiet = 0, slow = 0;
      var watch = function (now) {
        if (last) deltas.push(now - last);
        last = now;
        if (deltas.length >= 36) {
          deltas.sort(function (a, b) { return a - b; });
          var median = deltas[Math.floor(deltas.length / 2)];
          deltas = [];
          // Only a phone that is clearly struggling (under 30 frames a second, twice in a row) loses the bend; one slow moment is not enough.
          slow = median > 34 ? slow + 1 : 0;
          if (slow >= 2) {
            root.removeAttribute('data-lens');
            try { sessionStorage.setItem(STORE, '1'); } catch (e) { /* storage can be blocked */ }
            watching = false;
            return;
          }
        }
        // It stops looking when the scroll stops.
        if (now - quiet > 300) { watching = false; last = 0; deltas = []; return; }
        requestAnimationFrame(watch);
      };
      window.addEventListener('scroll', function () {
        quiet = performance.now();
        if (!watching && root.hasAttribute('data-lens')) { watching = true; last = 0; requestAnimationFrame(watch); }
      }, { passive: true });
    }

    // The point of light follows the mouse. It does not move with the scroll or the finger: changing it makes the glass draw again, and a bar that
    // draws again while the page moves under it flickers. Its place is measured on each piece of glass (in pixels from its left edge), not as a share of
    // the window: the bar is narrower than the window on a wide screen, so a share of the window put the light far from the pointer.
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      var frame = 0, lastX = -100;
      window.addEventListener('pointermove', function (event) {
        if (event.pointerType !== 'mouse' || frame) return;
        var clientX = event.clientX;
        frame = requestAnimationFrame(function () {
          frame = 0;
          if (Math.abs(clientX - lastX) < 3) return;
          lastX = clientX;
          for (var i = 0; i < glass.length; i += 1) {
            var box = glass[i].getBoundingClientRect();
            // A little past the edges are allowed, so the light still lights the rim when the pointer is just outside the bar.
            var x = Math.max(-40, Math.min(box.width + 40, clientX - box.left));
            glass[i].style.setProperty('--lg-x', x.toFixed(0) + 'px');
          }
        });
      }, { passive: true });
    }
  })();
<\/script>`], ["", `<svg class="lg-defs" width="0" height="0" aria-hidden="true" focusable="false"></svg>  <script>
  (function () {
    var root = document.documentElement;
    var SVG = 'http://www.w3.org/2000/svg';
    var ua = navigator.userAgent;
    // The bend is a backdrop-filter with an SVG filter, which only Chromium engines draw.
    if (/Chrome\\\\//.test(ua) && !/Firefox\\\\//.test(ua)) root.setAttribute('data-lens', '');
    // A phone that is slow, or that already showed it cannot keep up (below), gets the frosted glass without the bend.
    var STORE = 'petto-glass-lite';
    var remembered = false;
    // ?glass=full brings the bend back for a visit that was switched to the frosted glass.
    try {
      if (/[?&]glass=full\\\\b/.test(location.search)) sessionStorage.removeItem(STORE);
      remembered = sessionStorage.getItem(STORE) === '1';
    } catch (e) { /* storage can be blocked */ }
    // The number of cores is not used: some browsers (Brave among them) report a made-up small number to hide the device.
    if (remembered) root.removeAttribute('data-lens');
    var lens = root.hasAttribute('data-lens');
    var defs = document.querySelector('.lg-defs');

    // The map of the glass, a picture that the filter reads to know how far to move each point of what is behind it. Grey (128) means
    // "do not move". It holds two things at once, so one filter pass is enough: (1) the rim of the rounded box, where the picture is pushed
    // along the normal of the edge, more the closer to the rim, so the glass bends at its edge and is clear in the middle, and (2) slow
    // waves over the whole surface, a few sines drawn once here, so what passes under the glass flows and smears like liquid.
    var WAVES = 23; // the distortion of the waves, in pixels
    var waveSet = [[0.083, 0.4, 1.3, 2.1], [0.047, 1.9, 4.2, 0.7], [0.121, 3.1, 2.6, 5.0], [0.061, 5.0, 0.3, 3.4]];
    function wave(x, y, shift) {
      var total = 0;
      for (var k = 0; k < waveSet.length; k += 1) {
        var w = waveSet[k];
        total += Math.sin(w[0] * (x * Math.cos(w[1] + shift) + y * Math.sin(w[1] + shift)) + w[2] + shift * w[3]);
      }
      return total / waveSet.length; // -1..1
    }
    function glassMap(width, height, radius, bezel, span) {
      var canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      var ctx = canvas.getContext('2d');
      if (!ctx) return null;
      var image = ctx.createImageData(width, height);
      var hw = width / 2, hh = height / 2;
      var rimMax = bezel * 1.3, waveMax = WAVES / 2;
      for (var y = 0; y < height; y += 1) {
        for (var x = 0; x < width; x += 1) {
          // Signed distance to a rounded box, and the direction of the edge.
          var px = x + 0.5 - hw, py = y + 0.5 - hh;
          var qx = Math.abs(px) - (hw - radius), qy = Math.abs(py) - (hh - radius);
          var ox = Math.max(qx, 0), oy = Math.max(qy, 0);
          var outside = Math.sqrt(ox * ox + oy * oy);
          var depth = radius - (outside + Math.min(Math.max(qx, qy), 0));
          var dx = wave(x, y, 0) * waveMax, dy = wave(x, y, 1.7) * waveMax;
          if (depth >= 0 && depth < bezel) {
            var nx, ny;
            if (outside > 0) { nx = ox / outside; ny = oy / outside; } else if (qx > qy) { nx = 1; ny = 0; } else { nx = 0; ny = 1; }
            nx *= px < 0 ? -1 : 1; ny *= py < 0 ? -1 : 1;
            // A curve that is steep at the very rim and gentle further in, like the surface of a thick glass. The light is taken from further in.
            var strength = Math.pow(1 - depth / bezel, 2);
            dx -= nx * strength * rimMax;
            dy -= ny * strength * rimMax;
          }
          var i = (y * width + x) * 4;
          image.data[i] = Math.max(0, Math.min(255, 128 + (dx / span) * 255));
          image.data[i + 1] = Math.max(0, Math.min(255, 128 + (dy / span) * 255));
          image.data[i + 2] = 128; image.data[i + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
      return canvas.toDataURL('image/png');
    }

    var counter = 0;
    var pending = [];
    function fit(element) {
      // The layout size, which an entry animation (a scale) does not change.
      var width = element.offsetWidth, height = element.offsetHeight;
      if (!width || !height || element.getAttribute('data-lg-size') === width + 'x' + height) return;
      var radius = Math.min(parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0, width / 2, height / 2);
      var bezel = Math.max(8, Math.min(radius * 0.95 || height / 2, height / 2 * 0.95, 26));
      // One displacement of up to rimMax + waveMax pixels in each direction; the picture is the size of the glass in CSS pixels.
      var span = (bezel * 1.3 + WAVES / 2) * 2;
      var url = glassMap(width, height, radius, bezel, span);
      if (!url) return;
      var id = element.getAttribute('data-lg-id');
      if (!id) { counter += 1; id = 'lg-f-' + counter; element.setAttribute('data-lg-id', id); }
      // A new filter with a new name takes the place of the old one, and the old one goes a moment later, so the glass is never left without one.
      var previous = element.getAttribute('data-lg-filter');
      counter += 1;
      id = id + '-' + counter;
      var filter = document.createElementNS(SVG, 'filter');
      filter.setAttribute('id', id);
      filter.setAttribute('filterUnits', 'userSpaceOnUse');
      filter.setAttribute('x', '0'); filter.setAttribute('y', '0');
      filter.setAttribute('width', width); filter.setAttribute('height', height);
      filter.setAttribute('color-interpolation-filters', 'sRGB');
      var image = document.createElementNS(SVG, 'feImage');
      image.setAttribute('x', '0'); image.setAttribute('y', '0');
      image.setAttribute('width', width); image.setAttribute('height', height);
      image.setAttribute('preserveAspectRatio', 'none');
      image.setAttribute('result', 'map');
      image.setAttribute('href', url);
      var displace = document.createElementNS(SVG, 'feDisplacementMap');
      displace.setAttribute('in', 'SourceGraphic'); displace.setAttribute('in2', 'map');
      displace.setAttribute('scale', String(Math.round(span)));
      displace.setAttribute('xChannelSelector', 'R'); displace.setAttribute('yChannelSelector', 'G');
      filter.appendChild(image); filter.appendChild(displace);
      defs.appendChild(filter);
      element.setAttribute('data-lg-size', width + 'x' + height);
      element.setAttribute('data-lg-filter', id);
      element.style.setProperty('--lg-filter', 'url(#' + id + ')');
      if (previous) requestAnimationFrame(function () { var old = document.getElementById(previous); if (old) old.remove(); });
      // The picture of the map is decoded before the glass shows, or the first frames would be drawn without the bend.
      var probe = new Image();
      probe.src = url;
      pending.push(probe.decode ? probe.decode().catch(function () {}) : Promise.resolve());
    }

    var glass = [];
    function collect() {
      glass = Array.prototype.slice.call(document.querySelectorAll('.lg-glass, body.public-body header.nav'));
    }
    function fitAll() { glass.forEach(fit); }
    var shown = false;
    function show() {
      if (shown) return;
      shown = true;
      root.setAttribute('data-lg-ready', '');
    }
    function start() {
      collect();
      if (!lens || !defs) { show(); return; }
      fitAll();
      // The glass shows when the maps are decoded and the entry animation of the bars is over (while it runs the bar is the root of its own
      // backdrop and cannot see the page, so showing the glass then would make it snap on at the end).
      var settle = function (tries) {
        var running = [];
        glass.forEach(function (element) { if (element.getAnimations) running = running.concat(element.getAnimations()); });
        if (running.length && tries < 6) {
          Promise.all(running.map(function (animation) { return animation.finished.catch(function () {}); })).then(function () { settle(tries + 1); });
        } else {
          Promise.all(pending).then(function () { requestAnimationFrame(show); });
        }
      };
      // A moment later, so that the page has had time to start those animations.
      setTimeout(function () { settle(0); }, 150);
      setTimeout(show, 2200);
      // The bars change size with the screen, so their maps are drawn again.
      if (window.ResizeObserver) {
        var observer = new ResizeObserver(function () { fitAll(); });
        glass.forEach(function (element) { observer.observe(element); });
      } else {
        window.addEventListener('resize', fitAll);
      }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();

    // The bend is the part that costs the most, because the browser draws it again on every frame of a scroll. While the page scrolls, the
    // time of the frames is watched, and if the phone cannot keep about 40 frames a second the bend is turned off for the rest of the visit.
    if (lens) {
      var watching = false, last = 0, deltas = [], quiet = 0, slow = 0;
      var watch = function (now) {
        if (last) deltas.push(now - last);
        last = now;
        if (deltas.length >= 36) {
          deltas.sort(function (a, b) { return a - b; });
          var median = deltas[Math.floor(deltas.length / 2)];
          deltas = [];
          // Only a phone that is clearly struggling (under 30 frames a second, twice in a row) loses the bend; one slow moment is not enough.
          slow = median > 34 ? slow + 1 : 0;
          if (slow >= 2) {
            root.removeAttribute('data-lens');
            try { sessionStorage.setItem(STORE, '1'); } catch (e) { /* storage can be blocked */ }
            watching = false;
            return;
          }
        }
        // It stops looking when the scroll stops.
        if (now - quiet > 300) { watching = false; last = 0; deltas = []; return; }
        requestAnimationFrame(watch);
      };
      window.addEventListener('scroll', function () {
        quiet = performance.now();
        if (!watching && root.hasAttribute('data-lens')) { watching = true; last = 0; requestAnimationFrame(watch); }
      }, { passive: true });
    }

    // The point of light follows the mouse. It does not move with the scroll or the finger: changing it makes the glass draw again, and a bar that
    // draws again while the page moves under it flickers. Its place is measured on each piece of glass (in pixels from its left edge), not as a share of
    // the window: the bar is narrower than the window on a wide screen, so a share of the window put the light far from the pointer.
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      var frame = 0, lastX = -100;
      window.addEventListener('pointermove', function (event) {
        if (event.pointerType !== 'mouse' || frame) return;
        var clientX = event.clientX;
        frame = requestAnimationFrame(function () {
          frame = 0;
          if (Math.abs(clientX - lastX) < 3) return;
          lastX = clientX;
          for (var i = 0; i < glass.length; i += 1) {
            var box = glass[i].getBoundingClientRect();
            // A little past the edges are allowed, so the light still lights the rim when the pointer is just outside the bar.
            var x = Math.max(-40, Math.min(box.width + 40, clientX - box.left));
            glass[i].style.setProperty('--lg-x', x.toFixed(0) + 'px');
          }
        });
      }, { passive: true });
    }
  })();
<\/script>`])), maybeRenderHead());
}, "/home/runner/work/petto-web/petto-web/src/components/LiquidGlass.astro", void 0);

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$Astro$4 = createAstro("https://petto.sbs");
const $$NavAccount = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$NavAccount;
  const { lang, variant } = Astro2.props;
  const t = useTranslations(lang).nav;
  const entries = accountEntries(lang);
  const login = loginHref(lang);
  const support = entries.find((entry) => entry.key === "support");
  const logout = entries.find((entry) => entry.key === "logout");
  return renderTemplate`${variant === "bar" ? renderTemplate(_a$2 || (_a$2 = __template$2(["", '<div class="nav-account" data-nav-account data-state="guest"><a class="nav-login"', "", ' data-nav-login><svg viewBox="0 0 256 256" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M141.66 133.66l-40 40A8 8 0 0 1 88 168v-32H24a8 8 0 0 1 0-16h64V88a8 8 0 0 1 13.66-5.66l40 40a8 8 0 0 1 0 11.32M200 32h-56a8 8 0 0 0 0 16h48v160h-48a8 8 0 0 0 0 16h56a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8"></path></svg><span class="nav-login-label">', '</span></a><div class="nav-profile"><button type="button" class="nav-profile-btn" id="navProfileBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="navProfileMenu"', '><span class="nav-avatar"><img alt="" width="28" height="28" referrerpolicy="no-referrer" hidden><span class="nav-avatar-letter" aria-hidden="true"></span></span><span class="nav-profile-name"></span>', '</button><div class="nav-profile-menu" id="navProfileMenu" role="menu" aria-labelledby="navProfileBtn" hidden>', "</div></div></div>\n  <script>(function(){", "\n    (function () {\n      try {\n        var raw = sessionStorage.getItem(navCacheKey);\n        if (!raw) return;\n        var parsed = JSON.parse(raw);\n        if (!parsed || typeof parsed.name !== 'string' || !parsed.name) return;\n        var root = document.querySelector('.nav-account[data-nav-account]');\n        if (!root) return;\n        root.setAttribute('data-state', 'user');\n        var label = root.querySelector('.nav-profile-name');\n        var letter = root.querySelector('.nav-avatar-letter');\n        var img = root.querySelector('.nav-avatar img');\n        if (label) label.textContent = parsed.name;\n        if (letter) letter.textContent = parsed.name.trim().charAt(0).toUpperCase();\n        if (img && typeof parsed.avatar === 'string' && parsed.avatar) {\n          img.hidden = false;\n          img.src = parsed.avatar;\n        }\n      } catch (e) {}\n    })();\n  })();<\/script>"])), maybeRenderHead(), addAttribute(login, "href"), addAttribute(t.login, "title"), t.login, addAttribute(t.account.label, "aria-label"), renderComponent($$result, "InlineIcon", $$InlineIcon, { "name": "ph:caret-down", "class": "nav-profile-caret", "width": "12", "height": "12" }), entries.map((entry) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${entry.key === "logout" && renderTemplate`<div class="nav-profile-sep" role="separator"></div>`}<a role="menuitem" tabindex="-1" class="nav-profile-item"${addAttribute(entry.href, "href")}${addAttribute(entry.external ? "_blank" : void 0, "target")}${addAttribute(entry.external ? "noopener" : void 0, "rel")}${addAttribute(entry.key, "data-nav-entry")}>${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": entry.icon, "width": "16", "height": "16" })}<span>${t.account[entry.key]}</span></a>` })}`), defineScriptVars({ navCacheKey: CACHE_KEY })) : variant === "mobile" ? renderTemplate`<div class="mnav-account" data-nav-account data-state="guest"><div class="mnav-card mnav-guest"><div class="mnav-guest-top"><img class="mnav-guest-mascot" src="/assets/mascot-icon.webp" alt="" width="40" height="40"><p class="mnav-guest-line">${t.loginLine}</p></div><a class="mnav-btn mnav-btn-solid"${addAttribute(login, "href")} data-nav-login><svg viewBox="0 0 256 256" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M141.66 133.66l-40 40A8 8 0 0 1 88 168v-32H24a8 8 0 0 1 0-16h64V88a8 8 0 0 1 13.66-5.66l40 40a8 8 0 0 1 0 11.32M200 32h-56a8 8 0 0 0 0 16h48v160h-48a8 8 0 0 0 0 16h56a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8"></path></svg><span>${t.loginDiscord}</span></a></div><div class="mnav-card mnav-user"><a class="mnav-user-main"${addAttribute(profileHref(lang), "href")}><span class="nav-avatar"><img alt="" width="40" height="40" referrerpolicy="no-referrer" hidden><span class="nav-avatar-letter" aria-hidden="true"></span></span><span class="mnav-user-text"><span class="nav-profile-name"></span><span class="mnav-user-sub">${t.account.profile}</span></span>${renderComponent($$result, "InlineIcon", $$InlineIcon, { "name": "ph:caret-right", "class": "mnav-user-go", "width": "16", "height": "16" })}</a><a class="mnav-btn"${addAttribute(dashboardHref(lang), "href")} data-nav-entry="servers">${renderComponent($$result, "InlineIcon", $$InlineIcon, { "name": "ph:squares-four-fill", "width": "16", "height": "16" })}<span>${t.account.dashboard}</span></a></div></div>` : renderTemplate`<div class="mnav-account mnav-account-foot" data-nav-account data-state="guest">${support && renderTemplate`<a class="mnav-small"${addAttribute(support.href, "href")} target="_blank" rel="noopener" data-nav-entry="support">${renderComponent($$result, "InlineIcon", $$InlineIcon, { "name": support.icon, "width": "15", "height": "15" })}<span>${t.account.support}</span></a>`}${logout && renderTemplate`<a class="mnav-small mnav-small-logout"${addAttribute(logout.href, "href")} data-nav-entry="logout">${renderComponent($$result, "InlineIcon", $$InlineIcon, { "name": logout.icon, "width": "15", "height": "15" })}<span>${t.account.logout}</span></a>`}</div>`}`;
}, "/home/runner/work/petto-web/petto-web/src/components/NavAccount.astro", void 0);

// The picture a link to the site shows when it is shared (Discord, X, Telegram, Slack...), as DATA. Every card is one entry: a tone (the pastel of its family),
// the artwork that matches the page (`art`, drawn by scripts/og/template.mjs), a short headline that ends in a period and a two line tagline, in the three
// languages. `scripts/og/render.mjs` draws them into /public/assets/og (once per language) as flat pastel illustrations, `scripts/check-og-images.mjs` makes sure they
// are all there, and the layout (src/layouts/Base.astro) asks `ogCardFor(path)` which one a page uses. Adding a page to the system is adding an entry here and a
// line in CARD_PATHS. A page nobody listed (and a page under one that is listed, like /changelog/0.7.7) uses the card of its parent, and in the end the home card.

/** @type {(en: string, es: string, pt: string) => Record<string, string>} */
const L = (en, es, pt) => ({ en, es, 'pt-BR': pt });

/**
 * The dark atmospheric accent of each family of pages: used for the OG card tint and the dark left bar of the Discord embed.
 */
const TONES = {
  butter: { name: 'Night', bg: '#182032', doodle: '#25314d', sky: 'home-hero-sky.webp' },
  peach: { name: 'Dusk', bg: '#1b1d2e', doodle: '#2a2d45', sky: 'hero-art-3.webp' },
  mint: { name: 'Deep', bg: '#15222c', doodle: '#203442', sky: 'hero-art-4.webp' },
  sky: { name: 'Cobalt', bg: '#162136', doodle: '#223352', sky: 'hero-art-2.webp' },
  pink: { name: 'Twilight', bg: '#1c1d30', doodle: '#2b2d47', sky: 'hero-art-4.webp' },
  cream: { name: 'Slate', bg: '#181e2c', doodle: '#262f42', sky: 'hero-art-4.webp' },
};
/** The color of the accent bar of the Discord card as the number Discord asks for: the background of the picture of the same family. */
const accentNumber = (tone) => parseInt((TONES[tone] ?? TONES.butter).bg.slice(1), 16);

/**
 * @typedef {{ tone: keyof typeof TONES, art: string, title: Record<string,string>, tagline: Record<string,string> }} Card
 */

/** @type {Record<string, Card>} */
const CARDS = {
  home: { tone: 'butter', art: 'home', title: L('Your server. Made easy.', 'Tu servidor. Más fácil.', 'Seu servidor. Mais fácil.'), tagline: L('Moderation, tickets, levels and giveaways, with a dashboard you can preview.', 'Moderación, tickets, niveles y sorteos, con un dashboard con vista previa.', 'Moderação, tickets, níveis e sorteios, com um dashboard com prévia.') },
  features: { tone: 'butter', art: 'home', title: L('All you need. One bot.', 'Todo lo que necesitas. Un bot.', 'Tudo que precisa. Um bot.'), tagline: L('Ten systems that work together, each with a live preview.', 'Diez sistemas que trabajan juntos, cada uno con vista previa.', 'Dez sistemas que trabalham juntos, cada um com prévia.') },
  'feature-moderation': { tone: 'peach', art: 'moderation', title: L('Every action. A case.', 'Cada acción. Un caso.', 'Cada ação. Um caso.'), tagline: L('Ban, kick, mute and warn, with the history kept.', 'Banea, expulsa, silencia y advierte, con el historial guardado.', 'Bana, expulsa, silencia e avisa, com o histórico guardado.') },
  'feature-protection': { tone: 'peach', art: 'protection', title: L('Protected while you sleep.', 'Protegido mientras duermes.', 'Protegido enquanto você dorme.'), tagline: L('Raids, nukes and scams are stopped and logged.', 'Raids, nukes y estafas se frenan y quedan registrados.', 'Raids, nukes e golpes são barrados e registrados.') },
  'feature-tickets': { tone: 'sky', art: 'tickets', title: L('Support. Your way.', 'Soporte. A tu manera.', 'Suporte. Do seu jeito.'), tagline: L('Tickets with a panel of your own, forms and transcripts.', 'Tickets con panel propio, formularios y transcripciones.', 'Tickets com painel próprio, formulários e transcrições.') },
  'feature-levels': { tone: 'mint', art: 'levels', title: L('Talk. Level up.', 'Habla. Sube de nivel.', 'Converse. Suba de nível.'), tagline: L('Text and voice XP, ranks and role rewards.', 'XP de texto y voz, rangos y roles de premio.', 'XP de texto e voz, ranks e cargos de prêmio.') },
  'feature-giveaways': { tone: 'pink', art: 'giveaways', title: L('Fair giveaways. Fast.', 'Sorteos justos. Rápidos.', 'Sorteios justos. Rápidos.'), tagline: L('Start one in seconds, ask for what you want, let the bot pick.', 'Crea uno en segundos, pide lo que quieras y deja que el bot elija.', 'Crie um em segundos, peça o que quiser e deixe o bot sortear.') },
  'feature-integrations': { tone: 'sky', art: 'plug', title: L('19 lookups. No tabs.', '19 consultas. Sin salir.', '19 consultas. Sem sair.'), tagline: L('Songs, servers, profiles and prices without leaving Discord.', 'Canciones, servidores, perfiles y precios sin salir de Discord.', 'Músicas, servidores, perfis e preços sem sair do Discord.') },
  'feature-feeds': { tone: 'pink', art: 'feeds', title: L('News. In your channel.', 'Novedades. En tu canal.', 'Novidades. No seu canal.'), tagline: L('Videos, streams, posts and new versions, posted for you.', 'Videos, directos, publicaciones y versiones nuevas, en tu canal.', 'Vídeos, lives, posts e novas versões, no seu canal.') },
  'feature-community': { tone: 'mint', art: 'community', title: L('A server that feels alive.', 'Un servidor con vida.', 'Um servidor com vida.'), tagline: L('Welcomes, birthdays, polls and suggestions.', 'Bienvenidas, cumpleaños, encuestas y sugerencias.', 'Boas-vindas, aniversários, enquetes e sugestões.') },
  'feature-stats': { tone: 'butter', art: 'stats', title: L('Numbers you can trust.', 'Números de confianza.', 'Números confiáveis.'), tagline: L('Trends, busiest hours, top channels and how members stay.', 'Tendencias, horas más activas, canales top y cuánto se quedan los miembros.', 'Tendências, horas mais ativas, canais top e quanto os membros ficam.') },
  'feature-custom': { tone: 'cream', art: 'code', title: L('Make it yours.', 'Hazlo tuyo.', 'Faça do seu jeito.'), tagline: L('Your own commands and messages, all in one dashboard.', 'Tus propios comandos y mensajes, todo en un dashboard.', 'Seus próprios comandos e mensagens, tudo em um dashboard.') },
  commands: { tone: 'sky', art: 'commands', title: L('Every command. Explained.', 'Cada comando. Explicado.', 'Cada comando. Explicado.'), tagline: L('Slash and short prefix commands, with search and examples.', 'Comandos slash y de prefijo cortos, con búsqueda y ejemplos.', 'Comandos slash e de prefixo curtos, com busca e exemplos.') },
  premium: { tone: 'butter', art: 'premium', title: L('More room to grow.', 'Más espacio para crecer.', 'Mais espaço para crescer.'), tagline: L('Premium gives about twice the room and a few small touches.', 'Premium da casi el doble de espacio y unos pequeños detalles.', 'O Premium dá quase o dobro de espaço e alguns pequenos detalhes.') },
  dashboard: { tone: 'sky', art: 'dashboard', title: L('See it. Then save it.', 'Míralo. Luego guárdalo.', 'Veja. Depois salve.'), tagline: L('Set up every system with a live preview of what members see.', 'Configura cada sistema con una vista previa de lo que verán los miembros.', 'Configure cada sistema com uma prévia do que os membros vão ver.') },
  status: { tone: 'mint', art: 'status', title: L('Checked every 2 minutes.', 'Revisado cada 2 minutos.', 'Verificado a cada 2 minutos.'), tagline: L('The bot, the dashboard and the database, with 90 days of history.', 'El bot, el dashboard y la base de datos, con 90 días de historial.', 'O bot, o dashboard e o banco de dados, com 90 dias de histórico.') },
  stats: { tone: 'butter', art: 'stats', title: L('Petto. In numbers.', 'Petto. En números.', 'Petto. Em números.'), tagline: L('What every server that uses Petto has done so far, live.', 'Lo que han hecho todos los servidores que usan Petto, en vivo.', 'O que todos os servidores que usam o Petto já fizeram, ao vivo.') },
  leaderboard: { tone: 'butter', art: 'podium', title: L('Who is on top?', '¿Quién va primero?', 'Quem está no topo?'), tagline: L('The ranking of a server: who talks, reacts and joins voice.', 'El ranking de un servidor: quién habla, reacciona y entra a voz.', 'O ranking de um servidor: quem fala, reage e entra em voz.') },
  partners: { tone: 'pink', art: 'partners', title: L('Better together.', 'Mejor juntos.', 'Melhor juntos.'), tagline: L('The people and places that help Petto run and grow.', 'Las personas y lugares que ayudan a que Petto funcione y crezca.', 'As pessoas e lugares que ajudam o Petto a funcionar e crescer.') },
  team: { tone: 'peach', art: 'team', title: L('Meet the team.', 'Conoce al equipo.', 'Conheça a equipe.'), tagline: L('The people who build, test and look after Petto every day.', 'Las personas que construyen, prueban y cuidan a Petto cada día.', 'As pessoas que constroem, testam e cuidam do Petto todo dia.') },
  roadmap: { tone: 'butter', art: 'roadmap', title: L('What comes next.', 'Lo que viene.', 'O que vem depois.'), tagline: L('What we are building, what is next and what already shipped.', 'Lo que construimos, lo que sigue y lo que ya salió.', 'O que construímos, o que vem a seguir e o que já saiu.') },
  changelog: { tone: 'cream', art: 'changelog', title: L('What is new.', 'Qué hay de nuevo.', 'O que há de novo.'), tagline: L('Every release, with what changed and why.', 'Cada versión, con qué cambió y por qué.', 'Cada versão, com o que mudou e por quê.') },
  faq: { tone: 'cream', art: 'faq', title: L('Questions. Answered.', 'Preguntas. Respondidas.', 'Perguntas. Respondidas.'), tagline: L('How Petto works, what it costs and what it needs.', 'Cómo funciona Petto, cuánto cuesta y qué necesita.', 'Como o Petto funciona, quanto custa e o que precisa.') },
  apply: { tone: 'peach', art: 'team', title: L('Join the team.', 'Únete al equipo.', 'Entre para a equipe.'), tagline: L('Apply to help with support, testing or development.', 'Postula para ayudar con soporte, pruebas o desarrollo.', 'Candidate-se para ajudar com suporte, testes ou desenvolvimento.') },
  feedback: { tone: 'pink', art: 'feedback', title: L('Tell us. We listen.', 'Cuéntanos. Escuchamos.', 'Conte. Nós ouvimos.'), tagline: L('Post an idea, vote for others and follow what happens.', 'Publica una idea, vota las de otros y sigue qué pasa.', 'Publique uma ideia, vote nas dos outros e acompanhe.') },
  news: { tone: 'peach', art: 'news', title: L('News. From Petto.', 'Noticias. De Petto.', 'Notícias. Do Petto.'), tagline: L('Announcements and changes, explained.', 'Anuncios y cambios, explicados.', 'Anúncios e mudanças, explicados.') },
  blog: { tone: 'peach', art: 'news', title: L('The Petto blog.', 'El blog de Petto.', 'O blog do Petto.'), tagline: L('How things are made and what we learn along the way.', 'Cómo se hacen las cosas y qué aprendemos en el camino.', 'Como as coisas são feitas e o que aprendemos pelo caminho.') },
  credits: { tone: 'pink', art: 'credits', title: L('Thank you.', 'Gracias.', 'Obrigado.'), tagline: L('The tools, art and people that make Petto possible.', 'Las herramientas, el arte y las personas que hacen posible a Petto.', 'As ferramentas, a arte e as pessoas que tornam o Petto possível.') },
  brand: { tone: 'cream', art: 'brand', title: L('The Petto look.', 'La marca Petto.', 'A marca Petto.'), tagline: L('The duck, its colors and how to use them.', 'El pato, sus colores y cómo usarlos.', 'O pato, suas cores e como usá-las.') },
  timestamp: { tone: 'sky', art: 'clock', title: L('Time. For everyone.', 'La hora. Para todos.', 'A hora. Para todos.'), tagline: L('Pick a date and copy a time shown in each own time zone.', 'Elige una fecha y copia una hora que cada quien ve en su zona.', 'Escolha uma data e copie um horário que cada um vê no seu fuso.') },
  snowflake: { tone: 'sky', art: 'snowflake', title: L('Any ID. Its date.', 'Cualquier ID. Su fecha.', 'Qualquer ID. Sua data.'), tagline: L('Paste a Discord ID and see when it was created.', 'Pega un ID de Discord y mira cuándo se creó.', 'Cole um ID do Discord e veja quando foi criado.') },
  'embed-code': { tone: 'cream', art: 'code', title: L('Build it. Copy it.', 'Créalo. Cópialo.', 'Crie. Copie.'), tagline: L('Build a message and get the code that sends it.', 'Crea un mensaje y obtén el código que lo envía.', 'Crie uma mensagem e obtenha o código que a envia.') },
  'linked-roles': { tone: 'mint', art: 'chain', title: L('Roles. Linked.', 'Roles. Vinculados.', 'Cargos. Vinculados.'), tagline: L('Connect your account and unlock Petto Verified.', 'Conecta tu cuenta y desbloquea Petto Verified.', 'Conecte sua conta e libere o Petto Verified.') },
  terms: { tone: 'cream', art: 'doc', title: L('The rules. In plain words.', 'Las reglas. En simple.', 'As regras. Em simples.'), tagline: L('The Terms of Service for using Petto.', 'Los términos del servicio para usar Petto.', 'Os termos de serviço para usar o Petto.') },
  privacy: { tone: 'cream', art: 'lock', title: L('Your data. Your call.', 'Tus datos. Tu decisión.', 'Seus dados. Sua decisão.'), tagline: L('What Petto stores, why, and how to have it removed.', 'Qué guarda Petto, por qué y cómo pedir que lo borre.', 'O que o Petto guarda, por quê e como pedir a remoção.') },
  cookies: { tone: 'cream', art: 'cookie', title: L('Few cookies. Clear ones.', 'Pocas cookies. Claras.', 'Poucos cookies. Claros.'), tagline: L('The cookies the site uses and what each one does.', 'Las cookies que usa el sitio y qué hace cada una.', 'Os cookies que o site usa e o que cada um faz.') },
  refunds: { tone: 'cream', art: 'receipt', title: L('Fair refunds.', 'Reembolsos justos.', 'Reembolsos justos.'), tagline: L('When and how a Premium payment can be refunded.', 'Cuándo y cómo se puede reembolsar un pago de Premium.', 'Quando e como um pagamento do Premium pode ser reembolsado.') },
};
/** The key of the card of a news post by its path: `/codegen` is `post-codegen`. */
const postKeyOf = (path) => `post-${path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-')}`;

/** The path of a page (no language, no final slash) to the card that shows when it is shared. A page under a listed one uses its card. */
const CARD_PATHS = {
  '/': 'home',
  '/features': 'features',
  '/features/moderation': 'feature-moderation', '/features/protection': 'feature-protection', '/features/tickets': 'feature-tickets', '/features/levels': 'feature-levels',
  '/features/giveaways': 'feature-giveaways', '/features/integrations': 'feature-integrations', '/features/feeds': 'feature-feeds', '/features/community': 'feature-community',
  '/features/stats': 'feature-stats', '/features/custom': 'feature-custom',
  '/commands': 'commands', '/premium': 'premium', '/dash': 'dashboard', '/status': 'status', '/stats': 'stats', '/lb': 'leaderboard',
  '/partners': 'partners', '/team': 'team', '/roadmap': 'roadmap', '/changelog': 'changelog', '/faq': 'faq', '/apply': 'apply', '/feedback': 'feedback',
  '/news': 'news', '/blog': 'blog', '/credits': 'credits', '/brand': 'brand', '/timestamp': 'timestamp', '/snowflake': 'snowflake', '/embed-code': 'embed-code',
  '/linked-roles': 'linked-roles',
  '/terms': 'terms', '/privacy': 'privacy', '/cookies': 'cookies', '/refunds': 'refunds',
};

/** The name of the file of a card: `home-en`, `home-es`, `home-pt-br`. */
const cardName = (key, lang) => `${key}-${lang === 'pt-BR' ? 'pt-br' : lang}`;
const pathLang = (pathname) => (/^\/es(?:\/|$)/.test(pathname) ? 'es' : /^\/pt-br(?:\/|$)/.test(pathname) ? 'pt-BR' : 'en');
/** The path with no language prefix, no final slash and no index. */
const cleanPath = (pathname) => pathname.replace(/^\/(es|pt-br)(?=\/|$)/, '').replace(/\/index(?:\.html)?$/, '').replace(/(.)\/+$/, '$1') || '/';

/**
 * The card of a page: [key, language]. `has` says whether a card with that key was drawn (the manifest), so a post that was never drawn falls
 * back to its parent. A news post has a card of its own when the manifest has it. Always answers: the home card is the base.
 * @param {string} pathname @param {(key: string) => boolean} [has]
 */
function ogCardFor(pathname, has = (key) => key in CARDS) {
  const clean = cleanPath(pathname);
  const lang = pathLang(pathname);
  if (has(postKeyOf(clean))) return { key: postKeyOf(clean), lang, exact: true };
  if (CARD_PATHS[clean]) return { key: CARD_PATHS[clean], lang, exact: true };
  const parents = Object.keys(CARD_PATHS).filter((path) => path !== '/' && clean.startsWith(`${path}/`)).sort((a, b) => b.length - a.length);
  return { key: parents.length ? CARD_PATHS[parents[0]] : 'home', lang, exact: false };
}

const width = 1200;
const height = 630;
const cards$1 = {
	"apply-en": {
		key: "apply",
		lang: "en",
		tone: "peach",
		alt: "Join the team.",
		tagline: "Apply to help with support, testing or development.",
		embedTitle: "Join the Petto team · Apply for support, testing or dev",
		description: "Apply to help Petto with support, testing or development, and tell us what you can bring.",
		version: "c4d4bce4f5"
	},
	"apply-es": {
		key: "apply",
		lang: "es",
		tone: "peach",
		alt: "Únete al equipo.",
		tagline: "Postula para ayudar con soporte, pruebas o desarrollo.",
		embedTitle: "Únete al equipo de Petto · Postula a soporte, pruebas o desarrollo",
		description: "Postula para ayudar a Petto con soporte, pruebas o desarrollo, y cuéntanos qué puedes aportar.",
		version: "615aac364a"
	},
	"apply-pt-br": {
		key: "apply",
		lang: "pt-BR",
		tone: "peach",
		alt: "Entre para a equipe.",
		tagline: "Candidate-se para ajudar com suporte, testes ou desenvolvimento.",
		embedTitle: "Entre para a equipe do Petto · Candidate-se a suporte, testes ou dev",
		description: "Candidate-se para ajudar o Petto com suporte, testes ou desenvolvimento e conte o que você pode oferecer.",
		version: "eed1e13c39"
	},
	"blog-en": {
		key: "blog",
		lang: "en",
		tone: "peach",
		alt: "The Petto blog.",
		tagline: "How things are made and what we learn along the way.",
		embedTitle: "The Petto blog · How it is made and what we learn",
		description: "Stories from the team that builds Petto: how things are made, what failed and what worked.",
		version: "04d29bb0e8"
	},
	"blog-es": {
		key: "blog",
		lang: "es",
		tone: "peach",
		alt: "El blog de Petto.",
		tagline: "Cómo se hacen las cosas y qué aprendemos en el camino.",
		embedTitle: "El blog de Petto · Cómo se hace y qué aprendemos",
		description: "Historias del equipo que construye Petto: cómo se hacen las cosas, qué falló y qué funcionó.",
		version: "050ee713b1"
	},
	"blog-pt-br": {
		key: "blog",
		lang: "pt-BR",
		tone: "peach",
		alt: "O blog do Petto.",
		tagline: "Como as coisas são feitas e o que aprendemos pelo caminho.",
		embedTitle: "O blog do Petto · Como é feito e o que aprendemos",
		description: "Histórias da equipe que constrói o Petto: como as coisas são feitas, o que falhou e o que funcionou.",
		version: "4a0e02d019"
	},
	"brand-en": {
		key: "brand",
		lang: "en",
		tone: "cream",
		alt: "The Petto look.",
		tagline: "The duck, its colors and how to use them.",
		embedTitle: "Petto Brand · The duck, its colors and how to use them",
		description: "The Petto duck, its colors and banners, and how to use them in your own server or post.",
		version: "c84caca371"
	},
	"brand-es": {
		key: "brand",
		lang: "es",
		tone: "cream",
		alt: "La marca Petto.",
		tagline: "El pato, sus colores y cómo usarlos.",
		embedTitle: "Marca de Petto · El pato, sus colores y cómo usarlos",
		description: "El pato de Petto, sus colores y banners, y cómo usarlos en tu propio servidor o publicación.",
		version: "2277cd2926"
	},
	"brand-pt-br": {
		key: "brand",
		lang: "pt-BR",
		tone: "cream",
		alt: "A marca Petto.",
		tagline: "O pato, suas cores e como usá-las.",
		embedTitle: "Marca do Petto · O pato, suas cores e como usá-las",
		description: "O pato do Petto, suas cores e banners, e como usá-los no seu próprio servidor ou post.",
		version: "5c53c9b3b8"
	},
	"changelog-en": {
		key: "changelog",
		lang: "en",
		tone: "cream",
		alt: "What is new.",
		tagline: "Every release, with what changed and why.",
		embedTitle: "Petto Changelog · What changed in each release, and why",
		description: "Every release of Petto with what changed and why, in your language.",
		version: "fc91b14b0e"
	},
	"changelog-es": {
		key: "changelog",
		lang: "es",
		tone: "cream",
		alt: "Qué hay de nuevo.",
		tagline: "Cada versión, con qué cambió y por qué.",
		embedTitle: "Novedades de Petto · Qué cambió en cada versión y por qué",
		description: "Cada versión de Petto con qué cambió y por qué, en tu idioma.",
		version: "e534655b86"
	},
	"changelog-pt-br": {
		key: "changelog",
		lang: "pt-BR",
		tone: "cream",
		alt: "O que há de novo.",
		tagline: "Cada versão, com o que mudou e por quê.",
		embedTitle: "Novidades do Petto · O que mudou em cada versão e por quê",
		description: "Cada versão do Petto com o que mudou e por quê, no seu idioma.",
		version: "c8ddef2cc1"
	},
	"commands-en": {
		key: "commands",
		lang: "en",
		tone: "sky",
		alt: "Every command. Explained.",
		tagline: "Slash and short prefix commands, with search and examples.",
		embedTitle: "Commands of Petto · Slash and prefix, with examples",
		description: "Every Petto command with its syntax and examples, for slash and short prefix, searchable and in your language.",
		version: "d7387ac1c9"
	},
	"commands-es": {
		key: "commands",
		lang: "es",
		tone: "sky",
		alt: "Cada comando. Explicado.",
		tagline: "Comandos slash y de prefijo cortos, con búsqueda y ejemplos.",
		embedTitle: "Comandos de Petto · Slash y prefijo, con ejemplos",
		description: "Todos los comandos de Petto con su sintaxis y ejemplos, en slash y prefijo corto, con buscador y en tu idioma.",
		version: "4a04eaf575"
	},
	"commands-pt-br": {
		key: "commands",
		lang: "pt-BR",
		tone: "sky",
		alt: "Cada comando. Explicado.",
		tagline: "Comandos slash e de prefixo curtos, com busca e exemplos.",
		embedTitle: "Comandos do Petto · Slash e prefixo, com exemplos",
		description: "Todos os comandos do Petto com sintaxe e exemplos, em slash e prefixo curto, com busca e no seu idioma.",
		version: "29183c14bc"
	},
	"cookies-en": {
		key: "cookies",
		lang: "en",
		tone: "cream",
		alt: "Few cookies. Clear ones.",
		tagline: "The cookies the site uses and what each one does.",
		embedTitle: "Petto Cookies · The few the site uses and what they do",
		description: "The few cookies the Petto site uses, what each one does and how to change your choice.",
		version: "b868fd8d44"
	},
	"cookies-es": {
		key: "cookies",
		lang: "es",
		tone: "cream",
		alt: "Pocas cookies. Claras.",
		tagline: "Las cookies que usa el sitio y qué hace cada una.",
		embedTitle: "Cookies de Petto · Las pocas que usa el sitio y qué hacen",
		description: "Las pocas cookies que usa el sitio de Petto, qué hace cada una y cómo cambiar tu elección.",
		version: "5c7af5a990"
	},
	"cookies-pt-br": {
		key: "cookies",
		lang: "pt-BR",
		tone: "cream",
		alt: "Poucos cookies. Claros.",
		tagline: "Os cookies que o site usa e o que cada um faz.",
		embedTitle: "Cookies do Petto · Os poucos que o site usa e o que fazem",
		description: "Os poucos cookies que o site do Petto usa, o que cada um faz e como mudar a sua escolha.",
		version: "83c6a2e4b6"
	},
	"credits-en": {
		key: "credits",
		lang: "en",
		tone: "pink",
		alt: "Thank you.",
		tagline: "The tools, art and people that make Petto possible.",
		embedTitle: "Petto Credits · The tools, art and people behind it",
		description: "The open source tools, the art and the people that make Petto possible, with thanks.",
		version: "cea50a6888"
	},
	"credits-es": {
		key: "credits",
		lang: "es",
		tone: "pink",
		alt: "Gracias.",
		tagline: "Las herramientas, el arte y las personas que hacen posible a Petto.",
		embedTitle: "Créditos de Petto · Las herramientas, el arte y las personas detrás",
		description: "Las herramientas de código abierto, el arte y las personas que hacen posible a Petto, con gracias.",
		version: "56d1f091e7"
	},
	"credits-pt-br": {
		key: "credits",
		lang: "pt-BR",
		tone: "pink",
		alt: "Obrigado.",
		tagline: "As ferramentas, a arte e as pessoas que tornam o Petto possível.",
		embedTitle: "Créditos do Petto · As ferramentas, a arte e as pessoas por trás",
		description: "As ferramentas de código aberto, a arte e as pessoas que tornam o Petto possível, com agradecimentos.",
		version: "95ace81d76"
	},
	"dashboard-en": {
		key: "dashboard",
		lang: "en",
		tone: "sky",
		alt: "See it. Then save it.",
		tagline: "Set up every system with a live preview of what members see.",
		embedTitle: "Petto Dashboard · Set up your server with a live preview",
		description: "Set up every Petto system from the web, with a live preview of what your members will see, access for your staff and backups.",
		version: "670af2a71b"
	},
	"dashboard-es": {
		key: "dashboard",
		lang: "es",
		tone: "sky",
		alt: "Míralo. Luego guárdalo.",
		tagline: "Configura cada sistema con una vista previa de lo que verán los miembros.",
		embedTitle: "Dashboard de Petto · Configura tu servidor con vista previa",
		description: "Configura cada sistema de Petto desde la web, con una vista previa en vivo de lo que verán tus miembros, acceso para tu staff y copias de seguridad.",
		version: "74852c5797"
	},
	"dashboard-pt-br": {
		key: "dashboard",
		lang: "pt-BR",
		tone: "sky",
		alt: "Veja. Depois salve.",
		tagline: "Configure cada sistema com uma prévia do que os membros vão ver.",
		embedTitle: "Dashboard do Petto · Configure o servidor com prévia",
		description: "Configure cada sistema do Petto pela web, com prévia ao vivo do que seus membros vão ver, acesso para a sua equipe e backups.",
		version: "2a1409a87e"
	},
	"embed-code-en": {
		key: "embed-code",
		lang: "en",
		tone: "cream",
		alt: "Build it. Copy it.",
		tagline: "Build a message and get the code that sends it.",
		embedTitle: "Embed code generator · A free Discord tool by Petto",
		description: "Build a Discord message visually and get the code that sends it, with a live preview. Free, no login.",
		version: "7cf80d7626"
	},
	"embed-code-es": {
		key: "embed-code",
		lang: "es",
		tone: "cream",
		alt: "Créalo. Cópialo.",
		tagline: "Crea un mensaje y obtén el código que lo envía.",
		embedTitle: "Generador de código de embeds · Una herramienta gratis por Petto",
		description: "Crea un mensaje de Discord visualmente y obtén el código que lo envía, con vista previa en vivo. Gratis, sin iniciar sesión.",
		version: "2a403a73a7"
	},
	"embed-code-pt-br": {
		key: "embed-code",
		lang: "pt-BR",
		tone: "cream",
		alt: "Crie. Copie.",
		tagline: "Crie uma mensagem e obtenha o código que a envia.",
		embedTitle: "Gerador de código de embeds · Uma ferramenta grátis pelo Petto",
		description: "Crie uma mensagem do Discord visualmente e obtenha o código que a envia, com prévia ao vivo. Grátis, sem login.",
		version: "d0c7eeb43c"
	},
	"faq-en": {
		key: "faq",
		lang: "en",
		tone: "cream",
		alt: "Questions. Answered.",
		tagline: "How Petto works, what it costs and what it needs.",
		embedTitle: "Petto FAQ · How it works, what it costs, what it needs",
		description: "Straight answers about how Petto works, what it costs, which permissions it needs and what it stores.",
		version: "572f64952e"
	},
	"faq-es": {
		key: "faq",
		lang: "es",
		tone: "cream",
		alt: "Preguntas. Respondidas.",
		tagline: "Cómo funciona Petto, cuánto cuesta y qué necesita.",
		embedTitle: "Preguntas frecuentes de Petto · Cómo funciona y cuánto cuesta",
		description: "Respuestas directas sobre cómo funciona Petto, cuánto cuesta, qué permisos necesita y qué guarda.",
		version: "077d1480cb"
	},
	"faq-pt-br": {
		key: "faq",
		lang: "pt-BR",
		tone: "cream",
		alt: "Perguntas. Respondidas.",
		tagline: "Como o Petto funciona, quanto custa e o que precisa.",
		embedTitle: "Perguntas frequentes do Petto · Como funciona e quanto custa",
		description: "Respostas diretas sobre como o Petto funciona, quanto custa, quais permissões precisa e o que guarda.",
		version: "6525d9ad84"
	},
	"feature-community-en": {
		key: "feature-community",
		lang: "en",
		tone: "mint",
		alt: "A server that feels alive.",
		tagline: "Welcomes, birthdays, polls and suggestions.",
		embedTitle: "Community with Petto · Welcomes, birthdays, polls and ideas",
		description: "Welcome cards, birthdays, polls, suggestions and the small details that make a server feel like yours.",
		version: "26465db04c"
	},
	"feature-community-es": {
		key: "feature-community",
		lang: "es",
		tone: "mint",
		alt: "Un servidor con vida.",
		tagline: "Bienvenidas, cumpleaños, encuestas y sugerencias.",
		embedTitle: "Comunidad con Petto · Bienvenidas, cumpleaños, encuestas e ideas",
		description: "Tarjetas de bienvenida, cumpleaños, encuestas, sugerencias y los detalles que hacen que un servidor se sienta tuyo.",
		version: "9630c0b77a"
	},
	"feature-community-pt-br": {
		key: "feature-community",
		lang: "pt-BR",
		tone: "mint",
		alt: "Um servidor com vida.",
		tagline: "Boas-vindas, aniversários, enquetes e sugestões.",
		embedTitle: "Comunidade com o Petto · Boas-vindas, aniversários, enquetes e ideias",
		description: "Cards de boas-vindas, aniversários, enquetes, sugestões e os detalhes que fazem um servidor parecer seu.",
		version: "582ed38690"
	},
	"feature-custom-en": {
		key: "feature-custom",
		lang: "en",
		tone: "cream",
		alt: "Make it yours.",
		tagline: "Your own commands and messages, all in one dashboard.",
		embedTitle: "Make it yours with Petto · Commands, embeds and variables",
		description: "Write your own commands, build messages visually and keep every setting in one dashboard.",
		version: "176f34fdb8"
	},
	"feature-custom-es": {
		key: "feature-custom",
		lang: "es",
		tone: "cream",
		alt: "Hazlo tuyo.",
		tagline: "Tus propios comandos y mensajes, todo en un dashboard.",
		embedTitle: "Hazlo tuyo con Petto · Comandos, embeds y variables",
		description: "Escribe tus propios comandos, crea mensajes visualmente y guarda cada ajuste en un solo dashboard.",
		version: "bea36f058b"
	},
	"feature-custom-pt-br": {
		key: "feature-custom",
		lang: "pt-BR",
		tone: "cream",
		alt: "Faça do seu jeito.",
		tagline: "Seus próprios comandos e mensagens, tudo em um dashboard.",
		embedTitle: "Faça do seu jeito com o Petto · Comandos, embeds e variáveis",
		description: "Escreva seus próprios comandos, crie mensagens visualmente e mantenha cada ajuste em um só dashboard.",
		version: "690a474f00"
	},
	"feature-feeds-en": {
		key: "feature-feeds",
		lang: "en",
		tone: "pink",
		alt: "News. In your channel.",
		tagline: "Videos, streams, posts and new versions, posted for you.",
		embedTitle: "Feeds with Petto · Videos, streams and posts in your channel",
		description: "Petto posts in a channel what an account of another service publishes: videos, live streams, music, posts and new versions.",
		version: "f948e3d7b3"
	},
	"feature-feeds-es": {
		key: "feature-feeds",
		lang: "es",
		tone: "pink",
		alt: "Novedades. En tu canal.",
		tagline: "Videos, directos, publicaciones y versiones nuevas, en tu canal.",
		embedTitle: "Feeds con Petto · Videos, directos y posts en tu canal",
		description: "Petto publica en un canal lo que sube una cuenta de otro servicio: videos, directos, música, publicaciones y versiones nuevas.",
		version: "3616bdec39"
	},
	"feature-feeds-pt-br": {
		key: "feature-feeds",
		lang: "pt-BR",
		tone: "pink",
		alt: "Novidades. No seu canal.",
		tagline: "Vídeos, lives, posts e novas versões, no seu canal.",
		embedTitle: "Feeds com o Petto · Vídeos, lives e posts no seu canal",
		description: "O Petto publica em um canal o que uma conta de outro serviço posta: vídeos, lives, músicas, publicações e novas versões.",
		version: "6e4b94346a"
	},
	"feature-giveaways-en": {
		key: "feature-giveaways",
		lang: "en",
		tone: "pink",
		alt: "Fair giveaways. Fast.",
		tagline: "Start one in seconds, ask for what you want, let the bot pick.",
		embedTitle: "Giveaways with Petto · Fair, with requirements",
		description: "Start a giveaway in seconds, ask for a role or a level to enter, and let the bot pick the winners fairly.",
		version: "83deb18ff2"
	},
	"feature-giveaways-es": {
		key: "feature-giveaways",
		lang: "es",
		tone: "pink",
		alt: "Sorteos justos. Rápidos.",
		tagline: "Crea uno en segundos, pide lo que quieras y deja que el bot elija.",
		embedTitle: "Sorteos con Petto · Justos y con requisitos",
		description: "Crea un sorteo en segundos, pide un rol o un nivel para participar y deja que el bot elija a los ganadores con justicia.",
		version: "be1bd5b640"
	},
	"feature-giveaways-pt-br": {
		key: "feature-giveaways",
		lang: "pt-BR",
		tone: "pink",
		alt: "Sorteios justos. Rápidos.",
		tagline: "Crie um em segundos, peça o que quiser e deixe o bot sortear.",
		embedTitle: "Sorteios com o Petto · Justos e com requisitos",
		description: "Crie um sorteio em segundos, peça um cargo ou um nível para participar e deixe o bot sortear os vencedores com justiça.",
		version: "28bd0848d9"
	},
	"feature-integrations-en": {
		key: "feature-integrations",
		lang: "en",
		tone: "sky",
		alt: "19 lookups. No tabs.",
		tagline: "Songs, servers, profiles and prices without leaving Discord.",
		embedTitle: "Lookups with Petto · Songs, players and prices in Discord",
		description: "Look up songs, players, profiles and prices from other services without leaving Discord, with the same short commands everywhere.",
		version: "c2de66c380"
	},
	"feature-integrations-es": {
		key: "feature-integrations",
		lang: "es",
		tone: "sky",
		alt: "19 consultas. Sin salir.",
		tagline: "Canciones, servidores, perfiles y precios sin salir de Discord.",
		embedTitle: "Consultas con Petto · Canciones, jugadores y precios en Discord",
		description: "Busca canciones, jugadores, perfiles y precios de otros servicios sin salir de Discord, con los mismos comandos cortos en todas partes.",
		version: "c09005c244"
	},
	"feature-integrations-pt-br": {
		key: "feature-integrations",
		lang: "pt-BR",
		tone: "sky",
		alt: "19 consultas. Sem sair.",
		tagline: "Músicas, servidores, perfis e preços sem sair do Discord.",
		embedTitle: "Consultas com o Petto · Músicas, jogadores e preços no Discord",
		description: "Busque músicas, jogadores, perfis e preços de outros serviços sem sair do Discord, com os mesmos comandos curtos em todo lugar.",
		version: "4b9c0831e8"
	},
	"feature-levels-en": {
		key: "feature-levels",
		lang: "en",
		tone: "mint",
		alt: "Talk. Level up.",
		tagline: "Text and voice XP, ranks and role rewards.",
		embedTitle: "Levels with Petto · XP, ranks and role rewards",
		description: "Text and voice XP with protection against farming, a rank card for each member and roles as rewards.",
		version: "c7d7ff1967"
	},
	"feature-levels-es": {
		key: "feature-levels",
		lang: "es",
		tone: "mint",
		alt: "Habla. Sube de nivel.",
		tagline: "XP de texto y voz, rangos y roles de premio.",
		embedTitle: "Niveles con Petto · XP, rangos y roles de premio",
		description: "XP de texto y de voz con protección contra el farmeo, una tarjeta de rango para cada miembro y roles como premio.",
		version: "c9119b90ac"
	},
	"feature-levels-pt-br": {
		key: "feature-levels",
		lang: "pt-BR",
		tone: "mint",
		alt: "Converse. Suba de nível.",
		tagline: "XP de texto e voz, ranks e cargos de prêmio.",
		embedTitle: "Níveis com o Petto · XP, ranks e cargos de prêmio",
		description: "XP de texto e de voz com proteção contra farm, um card de rank para cada membro e cargos como prêmio.",
		version: "c3bda65512"
	},
	"feature-moderation-en": {
		key: "feature-moderation",
		lang: "en",
		tone: "peach",
		alt: "Every action. A case.",
		tagline: "Ban, kick, mute and warn, with the history kept.",
		embedTitle: "Moderation with Petto · Bans, warns and a case for each action",
		description: "Ban, kick, mute and warn with a case for each action, notes on members and a message to the member that you write yourself. The history stays with the member.",
		version: "8cade6c5e2"
	},
	"feature-moderation-es": {
		key: "feature-moderation",
		lang: "es",
		tone: "peach",
		alt: "Cada acción. Un caso.",
		tagline: "Banea, expulsa, silencia y advierte, con el historial guardado.",
		embedTitle: "Moderación con Petto · Bans, warns y un caso por acción",
		description: "Banea, expulsa, silencia y advierte con un caso por acción, notas sobre miembros y un mensaje al miembro que escribes tú. El historial queda con el miembro.",
		version: "8ddc545864"
	},
	"feature-moderation-pt-br": {
		key: "feature-moderation",
		lang: "pt-BR",
		tone: "peach",
		alt: "Cada ação. Um caso.",
		tagline: "Bana, expulsa, silencia e avisa, com o histórico guardado.",
		embedTitle: "Moderação com o Petto · Bans, warns e um caso por ação",
		description: "Bana, expulsa, silencia e avisa com um caso por ação, notas sobre membros e uma mensagem ao membro que você escreve. O histórico fica com o membro.",
		version: "0feb4b25d9"
	},
	"feature-protection-en": {
		key: "feature-protection",
		lang: "en",
		tone: "peach",
		alt: "Protected while you sleep.",
		tagline: "Raids, nukes and scams are stopped and logged.",
		embedTitle: "Protection with Petto · Raids, nukes and scams stopped",
		description: "Raids, nukes and scams are stopped while the staff is away, and every action is logged so you can review it later.",
		version: "78c3130cda"
	},
	"feature-protection-es": {
		key: "feature-protection",
		lang: "es",
		tone: "peach",
		alt: "Protegido mientras duermes.",
		tagline: "Raids, nukes y estafas se frenan y quedan registrados.",
		embedTitle: "Protección con Petto · Frena raids, nukes y estafas",
		description: "Los raids, nukes y estafas se frenan mientras el staff no está, y cada acción queda registrada para revisarla después.",
		version: "0af6af2f7a"
	},
	"feature-protection-pt-br": {
		key: "feature-protection",
		lang: "pt-BR",
		tone: "peach",
		alt: "Protegido enquanto você dorme.",
		tagline: "Raids, nukes e golpes são barrados e registrados.",
		embedTitle: "Proteção com o Petto · Barra raids, nukes e golpes",
		description: "Raids, nukes e golpes são barrados enquanto a equipe está ausente, e cada ação fica registrada para revisar depois.",
		version: "3ed7ed2442"
	},
	"feature-stats-en": {
		key: "feature-stats",
		lang: "en",
		tone: "butter",
		alt: "Numbers you can trust.",
		tagline: "Trends, busiest hours, top channels and how members stay.",
		embedTitle: "Statistics with Petto · Trends, busy hours and top channels",
		description: "See what happens in your server and compare it with the period before: trends, busiest hours, top channels and how long members stay.",
		version: "cd2f4a8f86"
	},
	"feature-stats-es": {
		key: "feature-stats",
		lang: "es",
		tone: "butter",
		alt: "Números de confianza.",
		tagline: "Tendencias, horas más activas, canales top y cuánto se quedan los miembros.",
		embedTitle: "Estadísticas con Petto · Tendencias, horas activas y canales top",
		description: "Mira qué pasa en tu servidor y compáralo con el periodo anterior: tendencias, horas más activas, canales top y cuánto se quedan los miembros.",
		version: "467bbc724a"
	},
	"feature-stats-pt-br": {
		key: "feature-stats",
		lang: "pt-BR",
		tone: "butter",
		alt: "Números confiáveis.",
		tagline: "Tendências, horas mais ativas, canais top e quanto os membros ficam.",
		embedTitle: "Estatísticas com o Petto · Tendências, horas ativas e canais top",
		description: "Veja o que acontece no seu servidor e compare com o período anterior: tendências, horas mais ativas, canais top e quanto os membros ficam.",
		version: "e59104d2ee"
	},
	"feature-tickets-en": {
		key: "feature-tickets",
		lang: "en",
		tone: "sky",
		alt: "Support. Your way.",
		tagline: "Tickets with a panel of your own, forms and transcripts.",
		embedTitle: "Tickets with Petto · A support panel of your own",
		description: "Members open a private channel with your team. You choose how the panel looks, who answers, what the form asks and where the transcript goes.",
		version: "d02cc8cda9"
	},
	"feature-tickets-es": {
		key: "feature-tickets",
		lang: "es",
		tone: "sky",
		alt: "Soporte. A tu manera.",
		tagline: "Tickets con panel propio, formularios y transcripciones.",
		embedTitle: "Tickets con Petto · Un panel de soporte a tu manera",
		description: "Los miembros abren un canal privado con tu equipo. Tú eliges cómo se ve el panel, quién responde, qué pregunta el formulario y a dónde va la transcripción.",
		version: "2c84ebe467"
	},
	"feature-tickets-pt-br": {
		key: "feature-tickets",
		lang: "pt-BR",
		tone: "sky",
		alt: "Suporte. Do seu jeito.",
		tagline: "Tickets com painel próprio, formulários e transcrições.",
		embedTitle: "Tickets com o Petto · Um painel de suporte do seu jeito",
		description: "Os membros abrem um canal privado com a sua equipe. Você escolhe como o painel é, quem responde, o que o formulário pergunta e para onde vai a transcrição.",
		version: "14c86c9446"
	},
	"features-en": {
		key: "features",
		lang: "en",
		tone: "butter",
		alt: "All you need. One bot.",
		tagline: "Ten systems that work together, each with a live preview.",
		embedTitle: "Features of Petto · Every system a Discord server needs",
		description: "Moderation, protection, tickets, levels, giveaways, feeds and more. Each system is set up in the dashboard with a live preview.",
		version: "dc58eb7d4a"
	},
	"features-es": {
		key: "features",
		lang: "es",
		tone: "butter",
		alt: "Todo lo que necesitas. Un bot.",
		tagline: "Diez sistemas que trabajan juntos, cada uno con vista previa.",
		embedTitle: "Características de Petto · Los sistemas que un servidor necesita",
		description: "Moderación, protección, tickets, niveles, sorteos, feeds y más. Cada sistema se configura en el dashboard con vista previa en vivo.",
		version: "b4ab873af9"
	},
	"features-pt-br": {
		key: "features",
		lang: "pt-BR",
		tone: "butter",
		alt: "Tudo que precisa. Um bot.",
		tagline: "Dez sistemas que trabalham juntos, cada um com prévia.",
		embedTitle: "Recursos do Petto · Os sistemas que um servidor precisa",
		description: "Moderação, proteção, tickets, níveis, sorteios, feeds e mais. Cada sistema é configurado no dashboard com prévia ao vivo.",
		version: "5e04aeb32c"
	},
	"feedback-en": {
		key: "feedback",
		lang: "en",
		tone: "pink",
		alt: "Tell us. We listen.",
		tagline: "Post an idea, vote for others and follow what happens.",
		embedTitle: "Petto Feedback · Post ideas, vote and follow what ships",
		description: "Post an idea, vote on the ideas of others and follow what happens to them, from planned to shipped.",
		version: "1ede17b575"
	},
	"feedback-es": {
		key: "feedback",
		lang: "es",
		tone: "pink",
		alt: "Cuéntanos. Escuchamos.",
		tagline: "Publica una idea, vota las de otros y sigue qué pasa.",
		embedTitle: "Feedback de Petto · Publica ideas, vota y sigue lo que sale",
		description: "Publica una idea, vota las de otros y sigue qué pasa con ellas, desde planeada hasta lista.",
		version: "1dc39a8903"
	},
	"feedback-pt-br": {
		key: "feedback",
		lang: "pt-BR",
		tone: "pink",
		alt: "Conte. Nós ouvimos.",
		tagline: "Publique uma ideia, vote nas dos outros e acompanhe.",
		embedTitle: "Feedback do Petto · Publique ideias, vote e acompanhe o que sai",
		description: "Publique uma ideia, vote nas dos outros e acompanhe o que acontece com elas, de planejada a pronta.",
		version: "4b59a28948"
	},
	"home-en": {
		key: "home",
		lang: "en",
		tone: "butter",
		alt: "Your server. Made easy.",
		tagline: "Moderation, tickets, levels and giveaways, with a dashboard you can preview.",
		embedTitle: "Petto, a Discord bot for moderation and community",
		description: "Moderation, tickets, levels, giveaways and feeds in one bot, with a web dashboard that previews what your members will see.",
		version: "404fd45902"
	},
	"home-es": {
		key: "home",
		lang: "es",
		tone: "butter",
		alt: "Tu servidor. Más fácil.",
		tagline: "Moderación, tickets, niveles y sorteos, con un dashboard con vista previa.",
		embedTitle: "Petto, un bot de Discord para moderación y comunidad",
		description: "Moderación, tickets, niveles, sorteos y feeds en un solo bot, con un dashboard web que muestra de antemano lo que verán tus miembros.",
		version: "86fa78cd20"
	},
	"home-pt-br": {
		key: "home",
		lang: "pt-BR",
		tone: "butter",
		alt: "Seu servidor. Mais fácil.",
		tagline: "Moderação, tickets, níveis e sorteios, com um dashboard com prévia.",
		embedTitle: "Petto, um bot do Discord para moderação e comunidade",
		description: "Moderação, tickets, níveis, sorteios e feeds em um só bot, com um dashboard web que mostra antes o que seus membros vão ver.",
		version: "a780ef63c6"
	},
	"leaderboard-en": {
		key: "leaderboard",
		lang: "en",
		tone: "butter",
		alt: "Who is on top?",
		tagline: "The ranking of a server: who talks, reacts and joins voice.",
		embedTitle: "Server leaderboard · Levels and ranking with Petto",
		description: "The ranking of a server: who talks, who reacts and who spends time in voice, with their levels.",
		version: "7b33afb446"
	},
	"leaderboard-es": {
		key: "leaderboard",
		lang: "es",
		tone: "butter",
		alt: "¿Quién va primero?",
		tagline: "El ranking de un servidor: quién habla, reacciona y entra a voz.",
		embedTitle: "Ranking del servidor · Niveles y clasificación con Petto",
		description: "El ranking de un servidor: quién habla, quién reacciona y quién pasa tiempo en voz, con sus niveles.",
		version: "f534212ac3"
	},
	"leaderboard-pt-br": {
		key: "leaderboard",
		lang: "pt-BR",
		tone: "butter",
		alt: "Quem está no topo?",
		tagline: "O ranking de um servidor: quem fala, reage e entra em voz.",
		embedTitle: "Ranking do servidor · Níveis e classificação com o Petto",
		description: "O ranking de um servidor: quem fala, quem reage e quem passa tempo em voz, com seus níveis.",
		version: "b3531336da"
	},
	"linked-roles-en": {
		key: "linked-roles",
		lang: "en",
		tone: "mint",
		alt: "Roles. Linked.",
		tagline: "Connect your account and unlock Petto Verified.",
		embedTitle: "Linked roles with Petto · Connect and unlock Petto Verified",
		description: "Connect your Petto account to Discord and unlock the Petto Verified role in servers that use linked roles.",
		version: "b6a5946725"
	},
	"linked-roles-es": {
		key: "linked-roles",
		lang: "es",
		tone: "mint",
		alt: "Roles. Vinculados.",
		tagline: "Conecta tu cuenta y desbloquea Petto Verified.",
		embedTitle: "Roles vinculados con Petto · Conecta y desbloquea Petto Verified",
		description: "Conecta tu cuenta de Petto con Discord y desbloquea el rol Petto Verified en los servidores que usan roles vinculados.",
		version: "b04bee8e68"
	},
	"linked-roles-pt-br": {
		key: "linked-roles",
		lang: "pt-BR",
		tone: "mint",
		alt: "Cargos. Vinculados.",
		tagline: "Conecte sua conta e libere o Petto Verified.",
		embedTitle: "Cargos vinculados com o Petto · Conecte e libere o Petto Verified",
		description: "Conecte sua conta do Petto ao Discord e libere o cargo Petto Verified nos servidores que usam cargos vinculados.",
		version: "d5986a3a31"
	},
	"news-en": {
		key: "news",
		lang: "en",
		tone: "peach",
		alt: "News. From Petto.",
		tagline: "Announcements and changes, explained.",
		embedTitle: "Petto News · Announcements and changes, explained",
		description: "New bots, new tools and changes in Discord, explained, and what each one means for your server.",
		version: "c7f472b633"
	},
	"news-es": {
		key: "news",
		lang: "es",
		tone: "peach",
		alt: "Noticias. De Petto.",
		tagline: "Anuncios y cambios, explicados.",
		embedTitle: "Noticias de Petto · Anuncios y cambios, explicados",
		description: "Bots nuevos, herramientas nuevas y cambios en Discord, explicados, y qué significa cada uno para tu servidor.",
		version: "2c37909f1f"
	},
	"news-pt-br": {
		key: "news",
		lang: "pt-BR",
		tone: "peach",
		alt: "Notícias. Do Petto.",
		tagline: "Anúncios e mudanças, explicados.",
		embedTitle: "Notícias do Petto · Anúncios e mudanças, explicados",
		description: "Novos bots, novas ferramentas e mudanças no Discord, explicados, e o que cada um significa para o seu servidor.",
		version: "0ce7f9e2db"
	},
	"partners-en": {
		key: "partners",
		lang: "en",
		tone: "pink",
		alt: "Better together.",
		tagline: "The people and places that help Petto run and grow.",
		embedTitle: "Partners of Petto · The people and places that help it grow",
		description: "The hosting, communities, apps and bots that Petto works with, and why each one is here.",
		version: "daeffbf294"
	},
	"partners-es": {
		key: "partners",
		lang: "es",
		tone: "pink",
		alt: "Mejor juntos.",
		tagline: "Las personas y lugares que ayudan a que Petto funcione y crezca.",
		embedTitle: "Partners de Petto · Las personas y lugares que lo ayudan a crecer",
		description: "El hosting, las comunidades, apps y bots con los que trabaja Petto, y por qué está cada uno.",
		version: "73a5a93b62"
	},
	"partners-pt-br": {
		key: "partners",
		lang: "pt-BR",
		tone: "pink",
		alt: "Melhor juntos.",
		tagline: "As pessoas e lugares que ajudam o Petto a funcionar e crescer.",
		embedTitle: "Parceiros do Petto · As pessoas e lugares que ajudam a crescer",
		description: "A hospedagem, as comunidades, apps e bots com os quais o Petto trabalha, e por que cada um está aqui.",
		version: "bb845ae4cf"
	},
	"post-am-en": {
		key: "post-am",
		lang: "en",
		tone: "mint",
		alt: "AM. The automod bot.",
		tagline: "Automatic moderation that looks at the context, not just words.",
		embedTitle: "AM · The automod bot joining the Petto family",
		description: "AM is a separate automoderation bot that reads the context of a message instead of matching a fixed list of words, to catch spam and toxicity.",
		version: "609ad2c177"
	},
	"post-am-es": {
		key: "post-am",
		lang: "es",
		tone: "mint",
		alt: "AM. El bot de automoderación.",
		tagline: "Moderación automática que mira el contexto, no solo palabras.",
		embedTitle: "AM · El bot de automoderación que se une a la familia Petto",
		description: "AM es un bot aparte de automoderación que lee el contexto de un mensaje en lugar de comparar una lista fija de palabras, para frenar spam y toxicidad.",
		version: "dc42e32b57"
	},
	"post-am-pt-br": {
		key: "post-am",
		lang: "pt-BR",
		tone: "mint",
		alt: "AM. O bot de automoderação.",
		tagline: "Moderação automática que olha o contexto, não só palavras.",
		embedTitle: "AM · O bot de automoderação que entra na família Petto",
		description: "O AM é um bot à parte de automoderação que lê o contexto de uma mensagem em vez de comparar uma lista fixa de palavras, para barrar spam e toxicidade.",
		version: "e4390a6e1a"
	},
	"post-blog-blibot-to-petto-en": {
		key: "post-blog-blibot-to-petto",
		lang: "en",
		tone: "peach",
		alt: "blibot is moving 100% to Petto",
		tagline: "Every system blibot ever ran, rebuilt on a stack that will actually keep running.",
		embedTitle: "blibot is moving 100% to Petto",
		description: "Every system blibot ever ran, rebuilt on a stack that will actually keep running.",
		version: "7a6ade700b"
	},
	"post-blog-blibot-to-petto-es": {
		key: "post-blog-blibot-to-petto",
		lang: "es",
		tone: "peach",
		alt: "blibot se muda 100% a Petto",
		tagline: "Cada sistema que blibot tuvo alguna vez, reconstruido sobre una base que sí se va a mante…",
		embedTitle: "blibot se muda 100% a Petto",
		description: "Cada sistema que blibot tuvo alguna vez, reconstruido sobre una base que sí se va a mantener andando.",
		version: "355ae24f9d"
	},
	"post-blog-blibot-to-petto-pt-br": {
		key: "post-blog-blibot-to-petto",
		lang: "pt-BR",
		tone: "peach",
		alt: "O blibot está migrando 100% para o Petto",
		tagline: "Cada sistema que o blibot já teve, reconstruído sobre uma base que realmente vai continua…",
		embedTitle: "O blibot está migrando 100% para o Petto",
		description: "Cada sistema que o blibot já teve, reconstruído sobre uma base que realmente vai continuar funcionando.",
		version: "6dc35acda4"
	},
	"post-blog-currently-log-en": {
		key: "post-blog-currently-log",
		lang: "en",
		tone: "peach",
		alt: "Introducing the Currently log: every change of Petto, in color",
		tagline: "One channel with every change of Petto in colors by kind, with a short explanation and a…",
		embedTitle: "Introducing the Currently log: every change of Petto, in color",
		description: "One channel with every change of Petto in colors by kind, with a short explanation and a picture of each.",
		version: "20fbf401dd"
	},
	"post-blog-currently-log-es": {
		key: "post-blog-currently-log",
		lang: "es",
		tone: "peach",
		alt: "Presentamos el Currently log: cada cambio de Petto, en color",
		tagline: "Un canal con cada cambio de Petto en colores según el tipo, con una explicación corta y u…",
		embedTitle: "Presentamos el Currently log: cada cambio de Petto, en color",
		description: "Un canal con cada cambio de Petto en colores según el tipo, con una explicación corta y una imagen de cada uno.",
		version: "a9ee6b4ae2"
	},
	"post-blog-currently-log-pt-br": {
		key: "post-blog-currently-log",
		lang: "pt-BR",
		tone: "peach",
		alt: "Apresentamos o Currently log: cada mudança do Petto, em cores",
		tagline: "Um canal com cada mudança do Petto em cores por tipo, com uma explicação curta e uma imag…",
		embedTitle: "Apresentamos o Currently log: cada mudança do Petto, em cores",
		description: "Um canal com cada mudança do Petto em cores por tipo, com uma explicação curta e uma imagem de cada uma.",
		version: "7206d14630"
	},
	"post-blog-embed-builder-joins-petto-en": {
		key: "post-blog-embed-builder-joins-petto",
		lang: "en",
		tone: "peach",
		alt: "Embed Builder is now part of Petto",
		tagline: "The visual builder for Discord embeds and Components V2 joins Petto, under the same Terms…",
		embedTitle: "Embed Builder is now part of Petto",
		description: "The visual builder for Discord embeds and Components V2 joins Petto, under the same Terms and Privacy Policy.",
		version: "d80bfb375e"
	},
	"post-blog-embed-builder-joins-petto-es": {
		key: "post-blog-embed-builder-joins-petto",
		lang: "es",
		tone: "peach",
		alt: "Embed Builder ahora es parte de Petto",
		tagline: "El creador visual de embeds y Components V2 de Discord se une a Petto, bajo los mismos Té…",
		embedTitle: "Embed Builder ahora es parte de Petto",
		description: "El creador visual de embeds y Components V2 de Discord se une a Petto, bajo los mismos Términos y la misma Política de privacidad.",
		version: "a4451e81ab"
	},
	"post-blog-embed-builder-joins-petto-pt-br": {
		key: "post-blog-embed-builder-joins-petto",
		lang: "pt-BR",
		tone: "peach",
		alt: "O Embed Builder agora faz parte do Petto",
		tagline: "O criador visual de embeds e Components V2 do Discord entra para o Petto, sob os mesmos T…",
		embedTitle: "O Embed Builder agora faz parte do Petto",
		description: "O criador visual de embeds e Components V2 do Discord entra para o Petto, sob os mesmos Termos e a mesma Política de privacidade.",
		version: "fb00a19aaa"
	},
	"post-blog-kobot-moves-to-petto-en": {
		key: "post-blog-kobot-moves-to-petto",
		lang: "en",
		tone: "peach",
		alt: "Kobot is moving to Petto",
		tagline: "Moderation, tickets, levels and verification in one bot with one dashboard.",
		embedTitle: "Kobot is moving to Petto",
		description: "Moderation, tickets, levels and verification in one bot with one dashboard.",
		version: "2e2fec7c90"
	},
	"post-blog-kobot-moves-to-petto-es": {
		key: "post-blog-kobot-moves-to-petto",
		lang: "es",
		tone: "peach",
		alt: "Kobot se muda a Petto",
		tagline: "Moderación, tickets, niveles y verificación en un solo bot con un solo panel.",
		embedTitle: "Kobot se muda a Petto",
		description: "Moderación, tickets, niveles y verificación en un solo bot con un solo panel.",
		version: "3c83f6cc5f"
	},
	"post-blog-kobot-moves-to-petto-pt-br": {
		key: "post-blog-kobot-moves-to-petto",
		lang: "pt-BR",
		tone: "peach",
		alt: "O Kobot está indo para o Petto",
		tagline: "Moderação, tickets, níveis e verificação em um só bot com um só painel.",
		embedTitle: "O Kobot está indo para o Petto",
		description: "Moderação, tickets, níveis e verificação em um só bot com um só painel.",
		version: "cf3e106d1b"
	},
	"post-blog-online-without-the-dot-en": {
		key: "post-blog-online-without-the-dot",
		lang: "en",
		tone: "peach",
		alt: "How to show a bot as online without the green dot",
		tagline: "What we tried, what failed, and the order of steps that worked for our feedback bot.",
		embedTitle: "How to show a bot as online without the green dot · Petto",
		description: "What we tried, what failed, and the order of steps that worked for our feedback bot.",
		version: "3915bbfee9"
	},
	"post-blog-online-without-the-dot-es": {
		key: "post-blog-online-without-the-dot",
		lang: "es",
		tone: "peach",
		alt: "Cómo mostrar un bot en línea sin la bolita verde",
		tagline: "Lo que probamos, lo que falló y el orden de pasos que funcionó con nuestro bot de feedbac…",
		embedTitle: "Cómo mostrar un bot en línea sin la bolita verde · Petto",
		description: "Lo que probamos, lo que falló y el orden de pasos que funcionó con nuestro bot de feedback.",
		version: "f3ac1b78e8"
	},
	"post-blog-online-without-the-dot-pt-br": {
		key: "post-blog-online-without-the-dot",
		lang: "pt-BR",
		tone: "peach",
		alt: "Como mostrar um bot online sem a bolinha verde",
		tagline: "O que tentamos, o que falhou e a ordem de passos que funcionou com o nosso bot de feedbac…",
		embedTitle: "Como mostrar um bot online sem a bolinha verde · Petto",
		description: "O que tentamos, o que falhou e a ordem de passos que funcionou com o nosso bot de feedback.",
		version: "592687d4ba"
	},
	"post-blog-petto-vs-other-bots-en": {
		key: "post-blog-petto-vs-other-bots",
		lang: "en",
		tone: "peach",
		alt: "Petto and other Discord bots: an honest comparison",
		tagline: "Petto, MEE6, Carl-bot and Dyno side by side, from what their own pages say: what is free,…",
		embedTitle: "Petto and other Discord bots: an honest comparison",
		description: "Petto, MEE6, Carl-bot and Dyno side by side, from what their own pages say: what is free, what is paid and where Petto is behind.",
		version: "1686a3f8b2"
	},
	"post-blog-petto-vs-other-bots-es": {
		key: "post-blog-petto-vs-other-bots",
		lang: "es",
		tone: "peach",
		alt: "Petto y otros bots de Discord: una comparación honesta",
		tagline: "Petto, MEE6, Carl-bot y Dyno lado a lado, con lo que dicen sus propias páginas: qué es gr…",
		embedTitle: "Petto y otros bots de Discord: una comparación honesta",
		description: "Petto, MEE6, Carl-bot y Dyno lado a lado, con lo que dicen sus propias páginas: qué es gratis, qué es de pago y en qué va detrás Petto.",
		version: "04eea33b3b"
	},
	"post-blog-petto-vs-other-bots-pt-br": {
		key: "post-blog-petto-vs-other-bots",
		lang: "pt-BR",
		tone: "peach",
		alt: "O Petto e outros bots do Discord: uma comparação honesta",
		tagline: "Petto, MEE6, Carl-bot e Dyno lado a lado, com o que as próprias páginas dizem: o que é gr…",
		embedTitle: "O Petto e outros bots do Discord: uma comparação honesta",
		description: "Petto, MEE6, Carl-bot e Dyno lado a lado, com o que as próprias páginas dizem: o que é grátis, o que é pago e onde o Petto fica atrás.",
		version: "b4025603fd"
	},
	"post-blog-switch-from-carl-bot-en": {
		key: "post-blog-switch-from-carl-bot",
		lang: "en",
		tone: "peach",
		alt: "How to switch from Carl-bot to Petto",
		tagline: "A step-by-step guide to leave Carl-bot without a gap: reaction roles, modlogs, automod, t…",
		embedTitle: "How to switch from Carl-bot to Petto",
		description: "A step-by-step guide to leave Carl-bot without a gap: reaction roles, modlogs, automod, tags and the rest.",
		version: "fccc462ca3"
	},
	"post-blog-switch-from-carl-bot-es": {
		key: "post-blog-switch-from-carl-bot",
		lang: "es",
		tone: "peach",
		alt: "Cómo cambiar de Carl-bot a Petto",
		tagline: "Una guía paso a paso para dejar Carl-bot sin huecos: roles por reacción, registros, autom…",
		embedTitle: "Cómo cambiar de Carl-bot a Petto",
		description: "Una guía paso a paso para dejar Carl-bot sin huecos: roles por reacción, registros, automod, tags y lo demás.",
		version: "2be6eda8de"
	},
	"post-blog-switch-from-carl-bot-pt-br": {
		key: "post-blog-switch-from-carl-bot",
		lang: "pt-BR",
		tone: "peach",
		alt: "Como trocar o Carl-bot pelo Petto",
		tagline: "Um guia passo a passo para deixar o Carl-bot sem buracos: cargos por reação, registros, a…",
		embedTitle: "Como trocar o Carl-bot pelo Petto",
		description: "Um guia passo a passo para deixar o Carl-bot sem buracos: cargos por reação, registros, automod, tags e o resto.",
		version: "4fb2ce60aa"
	},
	"post-blog-switch-from-dyno-en": {
		key: "post-blog-switch-from-dyno",
		lang: "en",
		tone: "peach",
		alt: "How to switch from Dyno to Petto",
		tagline: "A step-by-step guide to leave Dyno without a gap: automod, tickets, custom commands, auto…",
		embedTitle: "How to switch from Dyno to Petto",
		description: "A step-by-step guide to leave Dyno without a gap: automod, tickets, custom commands, autoroles and the rest.",
		version: "cea8fbd358"
	},
	"post-blog-switch-from-dyno-es": {
		key: "post-blog-switch-from-dyno",
		lang: "es",
		tone: "peach",
		alt: "Cómo cambiar de Dyno a Petto",
		tagline: "Una guía paso a paso para dejar Dyno sin huecos: automod, tickets, comandos personalizado…",
		embedTitle: "Cómo cambiar de Dyno a Petto",
		description: "Una guía paso a paso para dejar Dyno sin huecos: automod, tickets, comandos personalizados, autoroles y lo demás.",
		version: "8481957acd"
	},
	"post-blog-switch-from-dyno-pt-br": {
		key: "post-blog-switch-from-dyno",
		lang: "pt-BR",
		tone: "peach",
		alt: "Como trocar o Dyno pelo Petto",
		tagline: "Um guia passo a passo para deixar o Dyno sem buracos: automod, tickets, comandos personal…",
		embedTitle: "Como trocar o Dyno pelo Petto",
		description: "Um guia passo a passo para deixar o Dyno sem buracos: automod, tickets, comandos personalizados, autocargos e o resto.",
		version: "bedc0ff1c6"
	},
	"post-blog-switch-from-mee6-en": {
		key: "post-blog-switch-from-mee6",
		lang: "en",
		tone: "peach",
		alt: "How to switch from MEE6 to Petto",
		tagline: "A step-by-step guide to leave MEE6 without a gap, and where each thing lives in Petto.",
		embedTitle: "How to switch from MEE6 to Petto",
		description: "A step-by-step guide to leave MEE6 without a gap, and where each thing lives in Petto.",
		version: "0abc60e9b5"
	},
	"post-blog-switch-from-mee6-es": {
		key: "post-blog-switch-from-mee6",
		lang: "es",
		tone: "peach",
		alt: "Cómo cambiar de MEE6 a Petto",
		tagline: "Una guía paso a paso para dejar MEE6 sin huecos, y dónde vive cada cosa en Petto.",
		embedTitle: "Cómo cambiar de MEE6 a Petto",
		description: "Una guía paso a paso para dejar MEE6 sin huecos, y dónde vive cada cosa en Petto.",
		version: "93d943817a"
	},
	"post-blog-switch-from-mee6-pt-br": {
		key: "post-blog-switch-from-mee6",
		lang: "pt-BR",
		tone: "peach",
		alt: "Como trocar o MEE6 pelo Petto",
		tagline: "Um guia passo a passo para deixar o MEE6 sem buracos, e onde cada coisa fica no Petto.",
		embedTitle: "Como trocar o MEE6 pelo Petto",
		description: "Um guia passo a passo para deixar o MEE6 sem buracos, e onde cada coisa fica no Petto.",
		version: "59827ed96c"
	},
	"post-blog-vanity-moves-to-petto-en": {
		key: "post-blog-vanity-moves-to-petto",
		lang: "en",
		tone: "peach",
		alt: "Vanity is moving into Petto",
		tagline: "The Vanity bot becomes part of Petto: same rules and roles, one bot, one dashboard and yo…",
		embedTitle: "Vanity is moving into Petto",
		description: "The Vanity bot becomes part of Petto: same rules and roles, one bot, one dashboard and your Embeds.",
		version: "2929dd59ac"
	},
	"post-blog-vanity-moves-to-petto-es": {
		key: "post-blog-vanity-moves-to-petto",
		lang: "es",
		tone: "peach",
		alt: "Vanity se muda a Petto",
		tagline: "El bot Vanity pasa a ser parte de Petto: las mismas reglas y roles, un solo bot, un solo…",
		embedTitle: "Vanity se muda a Petto",
		description: "El bot Vanity pasa a ser parte de Petto: las mismas reglas y roles, un solo bot, un solo panel y tus Embeds.",
		version: "cb4ade5500"
	},
	"post-blog-vanity-moves-to-petto-pt-br": {
		key: "post-blog-vanity-moves-to-petto",
		lang: "pt-BR",
		tone: "peach",
		alt: "O Vanity está indo para o Petto",
		tagline: "O bot Vanity passa a fazer parte do Petto: as mesmas regras e cargos, um só bot, um só pa…",
		embedTitle: "O Vanity está indo para o Petto",
		description: "O bot Vanity passa a fazer parte do Petto: as mesmas regras e cargos, um só bot, um só painel e os seus Embeds.",
		version: "fc8d1b41d4"
	},
	"post-code-en": {
		key: "post-code",
		lang: "en",
		tone: "cream",
		alt: "The code behind Petto",
		tagline: "What Petto actually runs on, and an update: the bot is not open source any more.",
		embedTitle: "The code behind Petto",
		description: "What Petto actually runs on, and an update: the bot is not open source any more.",
		version: "30b91e3268"
	},
	"post-code-es": {
		key: "post-code",
		lang: "es",
		tone: "cream",
		alt: "El código detrás de Petto",
		tagline: "Sobre qué corre Petto en realidad, y una actualización: el bot ya no es de código abierto.",
		embedTitle: "El código detrás de Petto",
		description: "Sobre qué corre Petto en realidad, y una actualización: el bot ya no es de código abierto.",
		version: "1f5d5ebef0"
	},
	"post-code-pt-br": {
		key: "post-code",
		lang: "pt-BR",
		tone: "cream",
		alt: "O código por trás do Petto",
		tagline: "Sobre o que o Petto realmente roda, e uma atualização: o bot não é mais de código aberto.",
		embedTitle: "O código por trás do Petto",
		description: "Sobre o que o Petto realmente roda, e uma atualização: o bot não é mais de código aberto.",
		version: "1e41e1b0ca"
	},
	"post-codegen-en": {
		key: "post-codegen",
		lang: "en",
		tone: "cream",
		alt: "New: the Petto Code Generator",
		tagline: "Build custom commands with forms, try them in a test channel, and install them with one c…",
		embedTitle: "New: the Petto Code Generator",
		description: "Build custom commands with forms, try them in a test channel, and install them with one command.",
		version: "6911ceaedc"
	},
	"post-codegen-es": {
		key: "post-codegen",
		lang: "es",
		tone: "cream",
		alt: "Nuevo: el Petto Code Generator",
		tagline: "Crea comandos personalizados con formularios, pruébalos en un canal de prueba e instálalo…",
		embedTitle: "Nuevo: el Petto Code Generator",
		description: "Crea comandos personalizados con formularios, pruébalos en un canal de prueba e instálalos con un comando.",
		version: "0dc88b7b52"
	},
	"post-codegen-pt-br": {
		key: "post-codegen",
		lang: "pt-BR",
		tone: "cream",
		alt: "Novidade: o Petto Code Generator",
		tagline: "Crie comandos personalizados com formulários, teste num canal de teste e instale com um c…",
		embedTitle: "Novidade: o Petto Code Generator",
		description: "Crie comandos personalizados com formulários, teste num canal de teste e instale com um comando.",
		version: "25de5cd242"
	},
	"post-discord-age-verification-en": {
		key: "post-discord-age-verification",
		lang: "en",
		tone: "sky",
		alt: "Discord's new age verification, and what it means for admins",
		tagline: "Teen-by-default accounts, explained, and how it relates to Petto's own /verify.",
		embedTitle: "Discord's new age verification, and what it means for admins · Petto",
		description: "Teen-by-default accounts, explained, and how it relates to Petto's own /verify.",
		version: "26747f4be7"
	},
	"post-discord-age-verification-es": {
		key: "post-discord-age-verification",
		lang: "es",
		tone: "sky",
		alt: "La nueva verificación de edad de Discord, y qué significa para los admins",
		tagline: "Las cuentas \"teen por defecto\", explicadas, y cómo se relacionan con el !verify propio de…",
		embedTitle: "La nueva verificación de edad de Discord, y qué significa para los admins · Petto",
		description: "Las cuentas \"teen por defecto\", explicadas, y cómo se relacionan con el !verify propio de Petto.",
		version: "2f3b0a61cc"
	},
	"post-discord-age-verification-pt-br": {
		key: "post-discord-age-verification",
		lang: "pt-BR",
		tone: "sky",
		alt: "A nova verificação de idade do Discord, e o que ela significa pros admins",
		tagline: "As contas \"teen por padrão\", explicadas, e como se relacionam com o !verify próprio do Pe…",
		embedTitle: "A nova verificação de idade do Discord, e o que ela significa pros admins · Petto",
		description: "As contas \"teen por padrão\", explicadas, e como se relacionam com o !verify próprio do Petto.",
		version: "94db4ae438"
	},
	"post-discord-api-2026-en": {
		key: "post-discord-api-2026",
		lang: "en",
		tone: "sky",
		alt: "What Discord's 2026 API updates mean for bots like Petto",
		tagline: "Social SDK 1.10, API v10, and why none of it breaks anything Petto does.",
		embedTitle: "What Discord's 2026 API updates mean for bots like Petto",
		description: "Social SDK 1.10, API v10, and why none of it breaks anything Petto does.",
		version: "46567b9e4f"
	},
	"post-discord-api-2026-es": {
		key: "post-discord-api-2026",
		lang: "es",
		tone: "sky",
		alt: "Qué significan las actualizaciones de API 2026 de Discord para bots como Petto",
		tagline: "Social SDK 1.10, API v10, y por qué nada de eso rompe algo de lo que hace Petto.",
		embedTitle: "Qué significan las actualizaciones de API 2026 de Discord para bots como Petto",
		description: "Social SDK 1.10, API v10, y por qué nada de eso rompe algo de lo que hace Petto.",
		version: "3fd4590b6a"
	},
	"post-discord-api-2026-pt-br": {
		key: "post-discord-api-2026",
		lang: "pt-BR",
		tone: "sky",
		alt: "O que as atualizações de API 2026 do Discord significam pra bots como o Petto",
		tagline: "Social SDK 1.10, API v10, e por que nada disso quebra alguma coisa que o Petto faz.",
		embedTitle: "O que as atualizações de API 2026 do Discord significam pra bots como o Petto",
		description: "Social SDK 1.10, API v10, e por que nada disso quebra alguma coisa que o Petto faz.",
		version: "ec4811b381"
	},
	"post-discord-encryption-en": {
		key: "post-discord-encryption",
		lang: "en",
		tone: "sky",
		alt: "Every Discord call is now end-to-end encrypted",
		tagline: "What Discord's DAVE protocol rollout does and doesn't change for a server running Petto.",
		embedTitle: "Every Discord call is now end-to-end encrypted · Petto",
		description: "What Discord's DAVE protocol rollout does and doesn't change for a server running Petto.",
		version: "8218cc6d21"
	},
	"post-discord-encryption-es": {
		key: "post-discord-encryption",
		lang: "es",
		tone: "sky",
		alt: "Todas las llamadas de Discord ahora tienen cifrado de extremo a extremo",
		tagline: "Qué cambia y qué no el despliegue del protocolo DAVE para un servidor que corre Petto.",
		embedTitle: "Todas las llamadas de Discord ahora tienen cifrado de extremo a extremo · Petto",
		description: "Qué cambia y qué no el despliegue del protocolo DAVE para un servidor que corre Petto.",
		version: "16e1b5e244"
	},
	"post-discord-encryption-pt-br": {
		key: "post-discord-encryption",
		lang: "pt-BR",
		tone: "sky",
		alt: "Toda chamada do Discord agora tem criptografia de ponta a ponta",
		tagline: "O que muda e o que não muda no lançamento do protocolo DAVE pra um server que roda o Pett…",
		embedTitle: "Toda chamada do Discord agora tem criptografia de ponta a ponta · Petto",
		description: "O que muda e o que não muda no lançamento do protocolo DAVE pra um server que roda o Petto.",
		version: "cd02e6c9dc"
	},
	"post-embed-builder-en": {
		key: "post-embed-builder",
		lang: "en",
		tone: "cream",
		alt: "Build messages. Visually.",
		tagline: "See them as Discord will, and send them in one click.",
		embedTitle: "Embed Builder · Build Discord messages visually, by Petto",
		description: "The visual builder for Discord embeds and Components V2 is now part of Petto: design a message, see it as Discord will draw it and send it.",
		version: "5fa3f54480"
	},
	"post-embed-builder-es": {
		key: "post-embed-builder",
		lang: "es",
		tone: "cream",
		alt: "Crea mensajes. Visualmente.",
		tagline: "Míralos como los verá Discord y envíalos con un clic.",
		embedTitle: "Embed Builder · Crea mensajes de Discord visualmente, por Petto",
		description: "El constructor visual de embeds y Components V2 de Discord ahora es parte de Petto: diseña un mensaje, míralo como lo dibujará Discord y envíalo.",
		version: "ac82563ec8"
	},
	"post-embed-builder-pt-br": {
		key: "post-embed-builder",
		lang: "pt-BR",
		tone: "cream",
		alt: "Crie mensagens. Visualmente.",
		tagline: "Veja como o Discord vai mostrar e envie com um clique.",
		embedTitle: "Embed Builder · Crie mensagens do Discord visualmente, pelo Petto",
		description: "O construtor visual de embeds e Components V2 do Discord agora faz parte do Petto: desenhe uma mensagem, veja como o Discord vai mostrá-la e envie.",
		version: "48299ef392"
	},
	"post-nelu-en": {
		key: "post-nelu",
		lang: "en",
		tone: "pink",
		alt: "Nelu. The anime bot.",
		tagline: "Characters, quotes and favorites, joining the Petto family.",
		embedTitle: "Nelu · The anime bot joining the Petto family",
		description: "Nelu is a separate bot for anime and manga: character and series lookup, daily picks, quotes and favorites. It shares Petto infrastructure, not its commands.",
		version: "2c34f582eb"
	},
	"post-nelu-es": {
		key: "post-nelu",
		lang: "es",
		tone: "pink",
		alt: "Nelu. El bot de anime.",
		tagline: "Personajes, frases y favoritos, en la familia Petto.",
		embedTitle: "Nelu · El bot de anime que se une a la familia Petto",
		description: "Nelu es un bot aparte para anime y manga: búsqueda de personajes y series, selecciones diarias, frases y favoritos. Comparte la infraestructura de Petto, no sus comandos.",
		version: "d8cdee4790"
	},
	"post-nelu-pt-br": {
		key: "post-nelu",
		lang: "pt-BR",
		tone: "pink",
		alt: "Nelu. O bot de anime.",
		tagline: "Personagens, frases e favoritos, na família Petto.",
		embedTitle: "Nelu · O bot de anime que entra na família Petto",
		description: "O Nelu é um bot à parte para anime e mangá: busca de personagens e séries, escolhas diárias, frases e favoritos. Ele divide a infraestrutura do Petto, não os comandos.",
		version: "7e0eecfa4a"
	},
	"post-tools-en": {
		key: "post-tools",
		lang: "en",
		tone: "cream",
		alt: "New: a timestamp generator and a snowflake decoder",
		tagline: "Two web tools, no bot command or server needed for either.",
		embedTitle: "New: a timestamp generator and a snowflake decoder · Petto",
		description: "Two web tools, no bot command or server needed for either.",
		version: "d705e29b94"
	},
	"post-tools-es": {
		key: "post-tools",
		lang: "es",
		tone: "cream",
		alt: "Nuevo: un generador de timestamps y un decodificador de snowflake",
		tagline: "Dos herramientas web, ninguna necesita comando de bot ni servidor.",
		embedTitle: "Nuevo: un generador de timestamps y un decodificador de snowflake · Petto",
		description: "Dos herramientas web, ninguna necesita comando de bot ni servidor.",
		version: "e1b21884d0"
	},
	"post-tools-pt-br": {
		key: "post-tools",
		lang: "pt-BR",
		tone: "cream",
		alt: "Novidade: um gerador de timestamps e um decodificador de snowflake",
		tagline: "Duas ferramentas web, nenhuma precisa de comando de bot nem de servidor.",
		embedTitle: "Novidade: um gerador de timestamps e um decodificador de snowflake · Petto",
		description: "Duas ferramentas web, nenhuma precisa de comando de bot nem de servidor.",
		version: "5e4af09428"
	},
	"premium-en": {
		key: "premium",
		lang: "en",
		tone: "butter",
		alt: "More room to grow.",
		tagline: "Premium gives about twice the room and a few small touches.",
		embedTitle: "Petto Premium · More room for your Discord server",
		description: "Petto is free for almost everything. Premium gives about twice the room and a few small touches; moderation, security, logging and tickets stay free.",
		version: "47984044ba"
	},
	"premium-es": {
		key: "premium",
		lang: "es",
		tone: "butter",
		alt: "Más espacio para crecer.",
		tagline: "Premium da casi el doble de espacio y unos pequeños detalles.",
		embedTitle: "Petto Premium · Más espacio para tu servidor de Discord",
		description: "Petto es gratis casi para todo. Premium da casi el doble de espacio y unos pequeños detalles; moderación, seguridad, logs y tickets siguen gratis.",
		version: "04c2b51fa2"
	},
	"premium-pt-br": {
		key: "premium",
		lang: "pt-BR",
		tone: "butter",
		alt: "Mais espaço para crescer.",
		tagline: "O Premium dá quase o dobro de espaço e alguns pequenos detalhes.",
		embedTitle: "Petto Premium · Mais espaço para o seu servidor do Discord",
		description: "O Petto é grátis para quase tudo. O Premium dá quase o dobro de espaço e alguns pequenos detalhes; moderação, segurança, logs e tickets continuam grátis.",
		version: "2e80aebc05"
	},
	"privacy-en": {
		key: "privacy",
		lang: "en",
		tone: "cream",
		alt: "Your data. Your call.",
		tagline: "What Petto stores, why, and how to have it removed.",
		embedTitle: "Petto Privacy Policy · What it stores and why",
		description: "What Petto stores, why it stores it and how to have it removed, in plain words.",
		version: "24ab917234"
	},
	"privacy-es": {
		key: "privacy",
		lang: "es",
		tone: "cream",
		alt: "Tus datos. Tu decisión.",
		tagline: "Qué guarda Petto, por qué y cómo pedir que lo borre.",
		embedTitle: "Privacidad de Petto · Qué guarda y por qué",
		description: "Qué guarda Petto, por qué lo guarda y cómo pedir que lo borre, en palabras simples.",
		version: "10b1922ce3"
	},
	"privacy-pt-br": {
		key: "privacy",
		lang: "pt-BR",
		tone: "cream",
		alt: "Seus dados. Sua decisão.",
		tagline: "O que o Petto guarda, por quê e como pedir a remoção.",
		embedTitle: "Privacidade do Petto · O que guarda e por quê",
		description: "O que o Petto guarda, por que guarda e como pedir a remoção, em palavras simples.",
		version: "32fe84471a"
	},
	"refunds-en": {
		key: "refunds",
		lang: "en",
		tone: "cream",
		alt: "Fair refunds.",
		tagline: "When and how a Premium payment can be refunded.",
		embedTitle: "Petto Refund Policy · When a Premium payment is refunded",
		description: "When and how a Premium payment can be refunded, and who to ask.",
		version: "9d2cce2e03"
	},
	"refunds-es": {
		key: "refunds",
		lang: "es",
		tone: "cream",
		alt: "Reembolsos justos.",
		tagline: "Cuándo y cómo se puede reembolsar un pago de Premium.",
		embedTitle: "Reembolsos de Petto · Cuándo se reembolsa un pago de Premium",
		description: "Cuándo y cómo se puede reembolsar un pago de Premium, y a quién pedirlo.",
		version: "891970fe0b"
	},
	"refunds-pt-br": {
		key: "refunds",
		lang: "pt-BR",
		tone: "cream",
		alt: "Reembolsos justos.",
		tagline: "Quando e como um pagamento do Premium pode ser reembolsado.",
		embedTitle: "Reembolsos do Petto · Quando um pagamento do Premium é reembolsado",
		description: "Quando e como um pagamento do Premium pode ser reembolsado e a quem pedir.",
		version: "18e7e01395"
	},
	"roadmap-en": {
		key: "roadmap",
		lang: "en",
		tone: "butter",
		alt: "What comes next.",
		tagline: "What we are building, what is next and what already shipped.",
		embedTitle: "Petto Roadmap · What is being built, planned and shipped",
		description: "What the team is building now, what is planned next and what already shipped, so you know what to expect.",
		version: "5f1497df3c"
	},
	"roadmap-es": {
		key: "roadmap",
		lang: "es",
		tone: "butter",
		alt: "Lo que viene.",
		tagline: "Lo que construimos, lo que sigue y lo que ya salió.",
		embedTitle: "Hoja de ruta de Petto · Qué se construye, qué sigue y qué salió",
		description: "Lo que el equipo construye ahora, lo que viene después y lo que ya salió, para que sepas qué esperar.",
		version: "3f7940be31"
	},
	"roadmap-pt-br": {
		key: "roadmap",
		lang: "pt-BR",
		tone: "butter",
		alt: "O que vem depois.",
		tagline: "O que construímos, o que vem a seguir e o que já saiu.",
		embedTitle: "Roteiro do Petto · O que está em construção, planejado e pronto",
		description: "O que a equipe está construindo agora, o que vem depois e o que já saiu, para você saber o que esperar.",
		version: "222724ceed"
	},
	"snowflake-en": {
		key: "snowflake",
		lang: "en",
		tone: "sky",
		alt: "Any ID. Its date.",
		tagline: "Paste a Discord ID and see when it was created.",
		embedTitle: "Snowflake decoder · A free Discord tool by Petto",
		description: "Paste any Discord ID, of a user, a server or a message, and see exactly when it was created. Free, no login.",
		version: "5429377b09"
	},
	"snowflake-es": {
		key: "snowflake",
		lang: "es",
		tone: "sky",
		alt: "Cualquier ID. Su fecha.",
		tagline: "Pega un ID de Discord y mira cuándo se creó.",
		embedTitle: "Decodificador de snowflake · Herramienta gratis de Petto",
		description: "Pega cualquier ID de Discord, de un usuario, servidor o mensaje, y mira exactamente cuándo se creó. Gratis, sin iniciar sesión.",
		version: "6e8a05f904"
	},
	"snowflake-pt-br": {
		key: "snowflake",
		lang: "pt-BR",
		tone: "sky",
		alt: "Qualquer ID. Sua data.",
		tagline: "Cole um ID do Discord e veja quando foi criado.",
		embedTitle: "Decodificador de snowflake · Ferramenta grátis do Petto",
		description: "Cole qualquer ID do Discord, de um usuário, servidor ou mensagem, e veja exatamente quando foi criado. Grátis, sem login.",
		version: "739ed9e8a4"
	},
	"stats-en": {
		key: "stats",
		lang: "en",
		tone: "butter",
		alt: "Petto. In numbers.",
		tagline: "What every server that uses Petto has done so far, live.",
		embedTitle: "Petto Stats · Messages, voice time and reactions, live",
		description: "What every server that uses Petto has done so far, updated live, with a ranking of the servers that chose to appear.",
		version: "d8a7b3684c"
	},
	"stats-es": {
		key: "stats",
		lang: "es",
		tone: "butter",
		alt: "Petto. En números.",
		tagline: "Lo que han hecho todos los servidores que usan Petto, en vivo.",
		embedTitle: "Estadísticas de Petto · Mensajes, voz y reacciones, en vivo",
		description: "Lo que han hecho todos los servidores que usan Petto hasta ahora, en vivo, con un ranking de los servidores que eligieron aparecer.",
		version: "c37efbfece"
	},
	"stats-pt-br": {
		key: "stats",
		lang: "pt-BR",
		tone: "butter",
		alt: "Petto. Em números.",
		tagline: "O que todos os servidores que usam o Petto já fizeram, ao vivo.",
		embedTitle: "Estatísticas do Petto · Mensagens, voz e reações, ao vivo",
		description: "O que todos os servidores que usam o Petto já fizeram, ao vivo, com um ranking dos servidores que escolheram aparecer.",
		version: "8235a7bcab"
	},
	"status-en": {
		key: "status",
		lang: "en",
		tone: "mint",
		alt: "Checked every 2 minutes.",
		tagline: "The bot, the dashboard and the database, with 90 days of history.",
		embedTitle: "Petto Status · Is the bot, the dashboard and the database up?",
		description: "See right now whether the bot, the dashboard and the database are working, with a day by day history of past interruptions.",
		version: "451e2e9d4a"
	},
	"status-es": {
		key: "status",
		lang: "es",
		tone: "mint",
		alt: "Revisado cada 2 minutos.",
		tagline: "El bot, el dashboard y la base de datos, con 90 días de historial.",
		embedTitle: "Estado de Petto · ¿Están activos el bot, el dashboard y la base?",
		description: "Mira ahora mismo si el bot, el dashboard y la base de datos funcionan, con un historial día a día de las interrupciones pasadas.",
		version: "1887fc2d10"
	},
	"status-pt-br": {
		key: "status",
		lang: "pt-BR",
		tone: "mint",
		alt: "Verificado a cada 2 minutos.",
		tagline: "O bot, o dashboard e o banco de dados, com 90 dias de histórico.",
		embedTitle: "Status do Petto · O bot, o dashboard e o banco estão no ar?",
		description: "Veja agora se o bot, o dashboard e o banco de dados estão funcionando, com um histórico dia a dia das interrupções passadas.",
		version: "b540cd7888"
	},
	"team-en": {
		key: "team",
		lang: "en",
		tone: "peach",
		alt: "Meet the team.",
		tagline: "The people who build, test and look after Petto every day.",
		embedTitle: "The Petto team · Who builds and looks after the bot",
		description: "Meet the people who build, test and look after Petto every day.",
		version: "5a167d1893"
	},
	"team-es": {
		key: "team",
		lang: "es",
		tone: "peach",
		alt: "Conoce al equipo.",
		tagline: "Las personas que construyen, prueban y cuidan a Petto cada día.",
		embedTitle: "El equipo de Petto · Quién construye y cuida el bot",
		description: "Conoce a las personas que construyen, prueban y cuidan a Petto cada día.",
		version: "a14a7462f4"
	},
	"team-pt-br": {
		key: "team",
		lang: "pt-BR",
		tone: "peach",
		alt: "Conheça a equipe.",
		tagline: "As pessoas que constroem, testam e cuidam do Petto todo dia.",
		embedTitle: "A equipe do Petto · Quem constrói e cuida do bot",
		description: "Conheça as pessoas que constroem, testam e cuidam do Petto todos os dias.",
		version: "a1698ac736"
	},
	"terms-en": {
		key: "terms",
		lang: "en",
		tone: "cream",
		alt: "The rules. In plain words.",
		tagline: "The Terms of Service for using Petto.",
		embedTitle: "Petto Terms of Service · The rules, in plain words",
		description: "The rules for using Petto, in plain words: what you can expect from the bot and what it expects from you.",
		version: "87c1c25a9b"
	},
	"terms-es": {
		key: "terms",
		lang: "es",
		tone: "cream",
		alt: "Las reglas. En simple.",
		tagline: "Los términos del servicio para usar Petto.",
		embedTitle: "Términos de servicio de Petto · Las reglas, en palabras simples",
		description: "Las reglas para usar Petto, en palabras simples: qué puedes esperar del bot y qué espera él de ti.",
		version: "3c7f612ed7"
	},
	"terms-pt-br": {
		key: "terms",
		lang: "pt-BR",
		tone: "cream",
		alt: "As regras. Em simples.",
		tagline: "Os termos de serviço para usar o Petto.",
		embedTitle: "Termos de serviço do Petto · As regras, em palavras simples",
		description: "As regras para usar o Petto, em palavras simples: o que você pode esperar do bot e o que ele espera de você.",
		version: "53164260ad"
	},
	"timestamp-en": {
		key: "timestamp",
		lang: "en",
		tone: "sky",
		alt: "Time. For everyone.",
		tagline: "Pick a date and copy a time shown in each own time zone.",
		embedTitle: "Timestamp generator · A free Discord tool by Petto",
		description: "Pick a date and time and copy a Discord timestamp that every member sees in their own time zone. Free, no login.",
		version: "e7126bc002"
	},
	"timestamp-es": {
		key: "timestamp",
		lang: "es",
		tone: "sky",
		alt: "La hora. Para todos.",
		tagline: "Elige una fecha y copia una hora que cada quien ve en su zona.",
		embedTitle: "Generador de timestamps · Una herramienta gratis de Discord por Petto",
		description: "Elige una fecha y hora y copia un timestamp de Discord que cada miembro ve en su propia zona horaria. Gratis, sin iniciar sesión.",
		version: "a557df094f"
	},
	"timestamp-pt-br": {
		key: "timestamp",
		lang: "pt-BR",
		tone: "sky",
		alt: "A hora. Para todos.",
		tagline: "Escolha uma data e copie um horário que cada um vê no seu fuso.",
		embedTitle: "Gerador de timestamps · Uma ferramenta grátis do Discord pelo Petto",
		description: "Escolha uma data e hora e copie um timestamp do Discord que cada membro vê no seu próprio fuso. Grátis, sem login.",
		version: "3033b53f01"
	}
};
const manifest = {
	width: width,
	height: height,
	cards: cards$1
};

const cards = manifest.cards;
const drawn = new Set(Object.values(cards).map((card) => card.key));
function pageImage(pathname) {
  const found = ogCardFor(pathname, (candidate) => drawn.has(candidate));
  let name = cardName(found.key, found.lang);
  if (!cards[name]) name = cardName("home", found.lang);
  const card = cards[name];
  return {
    name,
    version: card?.version ?? "",
    alt: card?.alt ?? "Petto",
    tagline: card?.tagline ?? "",
    embedTitle: card?.embedTitle ?? "Petto, a Discord bot",
    description: card?.description ?? "",
    exact: found.exact && Boolean(cards[cardName(found.key, found.lang)]),
    accent: accentNumber(card?.tone ?? "butter"),
    width: manifest.width,
    height: manifest.height
  };
}
const pageImagePath = (image) => `/assets/og/${image.name}.webp${image.version ? `?v=${image.version}` : ""}`;

const $$Astro$3 = createAstro("https://petto.sbs");
const $$IsoBox = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$IsoBox;
  const { top, left, right, class: className = "", style } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<g${addAttribute(["bx", className], "class:list")}${addAttribute(style, "style")}> <polygon class="f-left"${addAttribute(left, "points")}></polygon> <polygon class="f-right"${addAttribute(right, "points")}></polygon> <polygon class="f-top"${addAttribute(top, "points")}></polygon> </g>`;
}, "/home/runner/work/petto-web/petto-web/src/components/IsoBox.astro", void 0);

const S = 30;
const P = (x, y, z) => [(x - y) * 0.866 * S, (x + y) * 0.5 * S - z * S];
const str = (a) => a.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
function scene(pad = 34) {
  const pts = [];
  const add = (a) => {
    pts.push(...a);
    return a;
  };
  const box = (x, y, z, w, d, h) => {
    const p = (a, b, c) => P(x + a, y + b, z + c);
    return {
      top: str(add([p(0, 0, h), p(w, 0, h), p(w, d, h), p(0, d, h)])),
      right: str(add([p(w, 0, 0), p(w, d, 0), p(w, d, h), p(w, 0, h)])),
      left: str(add([p(0, d, 0), p(w, d, 0), p(w, d, h), p(0, d, h)]))
    };
  };
  const line = (a, b) => ({ x1: a[0].toFixed(1), y1: a[1].toFixed(1), x2: b[0].toFixed(1), y2: b[1].toFixed(1) });
  const view = () => {
    const xs = pts.map((q) => q[0]);
    const ys = pts.map((q) => q[1]);
    let minX = Math.min(...xs) - pad;
    let maxX = Math.max(...xs) + pad;
    let minY = Math.min(...ys) - pad;
    let maxY = Math.max(...ys) + pad;
    const w = maxX - minX;
    const h = maxY - minY;
    if (w / h > 4 / 3) {
      const nh = w * 3 / 4;
      minY -= (nh - h) / 2;
      maxY = minY + nh;
    } else {
      const nw = h * 4 / 3;
      minX -= (nw - w) / 2;
      maxX = minX + nw;
    }
    return `${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`;
  };
  return { box, add, line, view };
}

const iso = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  P,
  S,
  scene,
  str
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro("https://petto.sbs");
const $$IsoLoader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$IsoLoader;
  const { size = 104, class: className = "" } = Astro2.props;
  const A = scene(14);
  const base = A.box(0, 0, -0.3, 5.2, 5.2, 0.3);
  const blocks = [A.box(0.5, 0.5, 0, 1.5, 1.5, 1.5), A.box(3.2, 0.5, 0, 1.5, 1.5, 1.1), A.box(1.9, 3.1, 0, 1.5, 1.5, 1.9)];
  const view = A.view();
  return renderTemplate`${maybeRenderHead()}<svg${addAttribute(["iso-loader", className], "class:list")}${addAttribute(view, "viewBox")}${addAttribute(size, "width")}${addAttribute(Math.round(size * 0.75), "height")} aria-hidden="true" focusable="false" data-astro-cid-nptvlz75> ${renderComponent($$result, "IsoBox", $$IsoBox, { ...base, "class": "il-base", "data-astro-cid-nptvlz75": true })} ${blocks.map((b, i) => renderTemplate`<g class="il-block"${addAttribute(`--i:${i}`, "style")} data-astro-cid-nptvlz75>${renderComponent($$result, "IsoBox", $$IsoBox, { ...b, "class": "il-box", "data-astro-cid-nptvlz75": true })}</g>`)} </svg> `;
}, "/home/runner/work/petto-web/petto-web/src/components/IsoLoader.astro", void 0);

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashLoader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashLoader;
  const dt = makeT(getDashLang(Astro2));
  return renderTemplate`${maybeRenderHead()}<div class="dl-curtain" id="dl-curtain"${addAttribute(dt("Loading your servers"), "data-servers")}${addAttribute(dt("Loading your data"), "data-data")}${addAttribute(dt("Loading your profile"), "data-profile")}${addAttribute(dt("Getting your server ready\u2026"), "data-sub-server")}${addAttribute(dt("Getting your account ready\u2026"), "data-sub-profile")} role="status" aria-live="polite" hidden> <div class="dl-box"> ${renderComponent($$result, "IsoLoader", $$IsoLoader, { "size": 140, "class": "dl-iso" })} <strong id="dl-title">${dt("Loading your data")}</strong> <small id="dl-sub">${dt("Getting your server ready\u2026")}</small> <div class="dl-bar" aria-hidden="true"><i></i></div> </div> </div>  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashLoader.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$TextFit = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$1 || (_a$1 = __template$1(["<script>\n  (function () {\n    if (window.__textFit) return;\n    window.__textFit = true;\n    document.documentElement.classList.add('tf-on');\n    var MIN_LINES = 4;\n    var skip = function (el) {\n      return !el || el.tagName !== 'TEXTAREA' || el.hasAttribute('data-fixed-size') || el.classList.contains('ebr-grow') || el.classList.contains('ebr-grow-1');\n    };\n    var oneLine = function (el) { return el.hasAttribute('data-one-line') || el.getAttribute('rows') === '1'; };\n    // Shrinking a field for a moment can move the page if it is scrolled to the bottom: every scrolled parent gets its place back.\n    var scrolled = function (el) {\n      var list = [];\n      for (var node = el.parentElement; node; node = node.parentElement) {\n        if (node.scrollTop > 0) list.push([node, node.scrollTop]);\n      }\n      var page = document.scrollingElement;\n      if (page && page.scrollTop > 0) list.push([page, page.scrollTop]);\n      return list;\n    };\n    var widths = new WeakMap();\n    var fit = function (el) {\n      if (skip(el) || !el.isConnected) return;\n      var cs = getComputedStyle(el);\n      if (cs.display === 'none' || (!el.offsetParent && cs.position !== 'fixed')) return;\n      var fontSize = parseFloat(cs.fontSize) || 14;\n      var line = parseFloat(cs.lineHeight);\n      if (!line || isNaN(line)) line = fontSize * 1.4;\n      var pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);\n      var border = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);\n      var borderBox = cs.boxSizing === 'border-box';\n      var rows = parseInt(el.getAttribute('rows'), 10) || 0;\n      var lines = oneLine(el) ? 1 : Math.max(MIN_LINES, rows);\n      var keep = scrolled(el);\n      el.style.height = 'auto';\n      // scrollHeight is the text and the padding, never the border.\n      var box = Math.max(el.scrollHeight + border, lines * line + pad + border);\n      el.style.height = (borderBox ? box : box - pad - border) + 'px';\n      keep.forEach(function (entry) { entry[0].scrollTop = entry[1]; });\n      widths.set(el, el.clientWidth);\n    };\n    var queue = new Set();\n    var queued = false;\n    var schedule = function (el) {\n      if (skip(el)) return;\n      queue.add(el);\n      if (queued) return;\n      queued = true;\n      requestAnimationFrame(function () {\n        queued = false;\n        var list = Array.from(queue);\n        queue.clear();\n        list.forEach(fit);\n      });\n    };\n    var watcher = typeof ResizeObserver === 'function' ? new ResizeObserver(function (entries) {\n      entries.forEach(function (entry) {\n        var el = entry.target;\n        // A new width wraps the lines differently, and a field that was hidden (a tab, an open section) has its first size.\n        if (widths.get(el) !== el.clientWidth) schedule(el);\n      });\n    }) : null;\n    var adopt = function (root) {\n      var list = root.tagName === 'TEXTAREA' ? [root] : (root.querySelectorAll ? Array.from(root.querySelectorAll('textarea')) : []);\n      list.forEach(function (el) {\n        if (skip(el)) return;\n        if (watcher && !el.__tfWatched) { el.__tfWatched = true; watcher.observe(el); }\n        schedule(el);\n      });\n    };\n    document.addEventListener('input', function (event) { if (event.target && event.target.tagName === 'TEXTAREA') schedule(event.target); }, true);\n    document.addEventListener('reset', function (event) {\n      var form = event.target;\n      if (form && form.querySelectorAll) setTimeout(function () { form.querySelectorAll('textarea').forEach(schedule); }, 0);\n    }, true);\n    // A value set by a script (a form filled from a saved item, a template inserted) fires no event: the setter says so.\n    try {\n      var descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');\n      if (descriptor && descriptor.set) {\n        Object.defineProperty(HTMLTextAreaElement.prototype, 'value', {\n          configurable: true,\n          enumerable: descriptor.enumerable,\n          get: descriptor.get,\n          set: function (value) { descriptor.set.call(this, value); schedule(this); },\n        });\n      }\n    } catch (e) { /* an old browser keeps the sizes of the first measure and the typing */ }\n    new MutationObserver(function (records) {\n      records.forEach(function (record) {\n        record.addedNodes.forEach(function (node) { if (node.nodeType === 1) adopt(node); });\n      });\n    }).observe(document.documentElement, { childList: true, subtree: true });\n    var start = function () { adopt(document.documentElement); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { document.querySelectorAll('textarea').forEach(schedule); }); };\n    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();\n    window.addEventListener('load', function () { document.querySelectorAll('textarea').forEach(schedule); });\n  })();\n<\/script>"])));
}, "/home/runner/work/petto-web/petto-web/src/components/TextFit.astro", void 0);

const NEW_FOR_DAYS = 10;
const DAY_MS = 864e5;
function isStillNew(since, now = Date.now()) {
  if (!since) return false;
  const start = Date.parse(`${since}T00:00:00Z`);
  if (!Number.isFinite(start)) return false;
  return now >= start && now < start + NEW_FOR_DAYS * DAY_MS;
}

const $$PopOut = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate` `;
}, "/home/runner/work/petto-web/petto-web/src/components/PopOut.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b, _c;
const $$Astro = createAstro("https://petto.sbs");
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const DEFAULT_DESCRIPTION = {
    en: "Moderation, tickets, levels and giveaways for your Discord server, with a web dashboard.",
    es: "Moderaci\xF3n, tickets, niveles y sorteos para tu servidor de Discord, con un dashboard web.",
    "pt-BR": "Modera\xE7\xE3o, tickets, n\xEDveis e sorteios para o seu servidor do Discord, com um dashboard web."
  };
  const badgeOf = (item) => item.badge && isStillNew(item.since) ? item.badge : "";
  const { title, description, active = "home", lang: langProp, showFooter = active !== "dash", appShell = false, feed, noindex = false, skin, hideNav = false, preloadImages = [], ogImage, ogImageAlt: ogImageAltProp, ogTitle } = Astro2.props;
  const lang = langProp ?? (active === "dash" ? getDashLang(Astro2) : "en");
  const t = useTranslations(lang);
  const base = localePath[lang];
  const langOptions = [
    { code: "en", label: "English", short: "EN", flag: "/assets/flags/us.svg" },
    { code: "es", label: "Espa\xF1ol", short: "ES", flag: "/assets/flags/es.svg" },
    { code: "pt-BR", label: "Portugu\xEAs (Brasil)", short: "PT", flag: "/assets/flags/br.svg" }
  ];
  const langNow = langOptions.find((o) => o.code === lang) ?? langOptions[0];
  const langWord = lang === "en" ? "Language" : "Idioma";
  const langLabel = `${langWord}: ${langNow.label}`;
  const currentRoute = Astro2.url.pathname.replace(/^\/(?:es|pt-br)(?=\/|$)/, "") || "/";
  const OWN_HERO_ROUTES = /* @__PURE__ */ new Set(["/", "/premium", "/commands", "/features", "/partners", "/changelog"]);
  const LEGAL_ROUTES = /* @__PURE__ */ new Set(["/terms", "/privacy", "/cookies", "/refunds"]);
  const useVxBackdrop = active !== "dash" && !OWN_HERO_ROUTES.has(currentRoute) && !LEGAL_ROUTES.has(currentRoute) && !currentRoute.startsWith("/changelog/") && !currentRoute.startsWith("/dash");
  const allPreloads = Array.from(/* @__PURE__ */ new Set([...preloadImages, ...useVxBackdrop ? ["/assets/hero-art-4.webp"] : []]));
  const languageHref = (target) => {
    if (active === "dash" || currentRoute === "/dash" || currentRoute.startsWith("/dash/")) return `/dash/lang?to=${encodeURIComponent(target)}&next=${encodeURIComponent(Astro2.url.pathname + Astro2.url.search)}`;
    if (target === "en") return currentRoute;
    return `${localePath[target]}${currentRoute === "/" ? "/" : currentRoute}`;
  };
  const isExternal = (href) => /^https?:\/\//.test(href);
  const menuLinks = /* @__PURE__ */ new Map();
  for (const it of [...t.nav.menu.product.items, ...t.nav.menu.community.items]) {
    const href = String(it.href ?? "");
    if (href && href !== "#" && !menuLinks.has(href)) menuLinks.set(href, { title: it.title, href, badge: badgeOf(it) });
  }
  const extraLink = (title2, href, premium = false) => ({ title: title2, href, badge: "", premium });
  const linksOf = (hrefs) => hrefs.map((h) => menuLinks.get(h)).filter((l) => Boolean(l));
  const NOT_PUBLIC_YET = ["/nelu", "/am", "/bmo"];
  const FOOTER_PRODUCT = [
    ...t.nav.menu.product.items.map((it) => menuLinks.get(String(it.href ?? ""))).filter((l) => Boolean(l) && !NOT_PUBLIC_YET.includes(l.href)),
    ...linksOf(["/changelog", "/blog", "/roadmap", "/timestamp", "/snowflake", "/embed-code"]),
    extraLink(t.footer.partners, "/partners"),
    extraLink(t.nav.premium, "/premium", true)
  ].sort((a, b) => a.title.localeCompare(b.title, lang));
  const FOOTER_SUPPORT = [
    extraLink(lang === "es" ? "Documentaci\xF3n" : lang === "pt-BR" ? "Documenta\xE7\xE3o" : "Documentation", "https://wiki.petto.sbs"),
    ...linksOf(["https://petto.sbs/support", "/status", "/stats", "/faq", "/feedback"])
  ];
  const FOOTER_TEAM = [
    ...linksOf(["/team", "/history", "/apply"]),
    extraLink(t.footer.credits, "/credits")
  ];
  const FOOTER_PRODUCT_COMPACT = FOOTER_PRODUCT.filter(
    (it) => ["/features", "/commands", "/changelog", "/premium", "/dash", "/partners"].includes(it.href)
  );
  const CLOSING_CTA = {
    en: {
      title: "Make your Discord powerful.",
      desc: "Add Petto to your server, then set everything up from the dashboard.",
      invite: "Add to Discord",
      support: "Join the support server"
    },
    es: {
      title: "Haz tu Discord m\xE1s poderoso.",
      desc: "A\xF1ade a Petto a tu servidor y config\xFAralo todo desde la Dash.",
      invite: "A\xF1adir a Discord",
      support: "Unirse al servidor de soporte"
    },
    "pt-BR": {
      title: "Deixe seu Discord mais poderoso.",
      desc: "Adicione o Petto ao seu servidor e configure tudo pela Dash.",
      invite: "Adicionar ao Discord",
      support: "Entrar no servidor de suporte"
    }
  };
  const closingCta = CLOSING_CTA[lang];
  const FOOTER_TOOLS_TITLE = { en: "Tools", es: "Herramientas", "pt-BR": "Ferramentas" };
  const FOOTER_TOOLS_ALL = { en: "All tools", es: "Todas las herramientas", "pt-BR": "Todas as ferramentas" };
  const FOOTER_TOOLS = [
    extraLink(FOOTER_TOOLS_ALL[lang], "/tools"),
    ...linksOf(["/snowflake", "/timestamp", "/embed-code", "/embed-builder"])
  ];
  const NAV_COPY = {
    en: {
      resources: "Resources",
      docsTitle: "Documentation",
      docsDesc: "Setup guides and references",
      supportTitle: "Support",
      supportDesc: "Get help from the Petto team",
      commandsTitle: "Commands",
      commandsDesc: "Every command, by category",
      embedTitle: "Embed Builder",
      embedDesc: "Build embeds & Components V2",
      dashTitle: "Dashboard",
      dashDesc: "Set up and manage servers",
      changelogTitle: "Changelog",
      changelogDesc: "Every update and new feature",
      serverTitle: "Server Premium",
      serverDesc: "Unlock every limit, custom branding & backups",
      plansTitle: "Personal Plans",
      plansDesc: "Bronze, Silver & Gold perks, badges & rank cards"
    },
    es: {
      resources: "Recursos",
      docsTitle: "Documentaci\xF3n",
      docsDesc: "Gu\xEDas de uso y referencias",
      supportTitle: "Soporte",
      supportDesc: "Ayuda directa del equipo de Petto",
      commandsTitle: "Comandos",
      commandsDesc: "Todos los comandos por categor\xEDa",
      embedTitle: "Embed Builder",
      embedDesc: "Embeds y Components V2 visuales",
      dashTitle: "Dashboard",
      dashDesc: "Configura y administra servidores",
      changelogTitle: "Changelog",
      changelogDesc: "Cada actualizaci\xF3n y novedad",
      serverTitle: "Premium de Servidor",
      serverDesc: "Ampl\xEDa l\xEDmites, perfil propio y copias de seguridad",
      plansTitle: "Planes Personales",
      plansDesc: "Bronce, Plata y Oro con insignias y tarjetas propias"
    },
    "pt-BR": {
      resources: "Recursos",
      docsTitle: "Documenta\xE7\xE3o",
      docsDesc: "Guias de configura\xE7\xE3o e refer\xEAncias",
      supportTitle: "Suporte",
      supportDesc: "Ajuda direta da equipe do Petto",
      commandsTitle: "Comandos",
      commandsDesc: "Todos os comandos por categoria",
      embedTitle: "Embed Builder",
      embedDesc: "Embeds e Components V2 visuais",
      dashTitle: "Dashboard",
      dashDesc: "Configure e gerencie servidores",
      changelogTitle: "Changelog",
      changelogDesc: "Cada atualiza\xE7\xE3o e novidade",
      serverTitle: "Premium para Servidor",
      serverDesc: "Libere limites, perfil pr\xF3prio e backups",
      plansTitle: "Planos Pessoais",
      plansDesc: "Bronze, Prata e Ouro com ins\xEDgnias e cards pr\xF3prios"
    }
  }[lang];
  const NAV_RESOURCES = [
    { icon: "ph:book-open-fill", title: NAV_COPY.docsTitle, desc: NAV_COPY.docsDesc, href: "https://wiki.petto.sbs" },
    { icon: "ph:question-fill", title: NAV_COPY.supportTitle, desc: NAV_COPY.supportDesc, href: "https://petto.sbs/support" },
    { icon: "ph:terminal-window-fill", title: NAV_COPY.commandsTitle, desc: NAV_COPY.commandsDesc, href: "/commands" },
    { icon: "ph:wrench-fill", title: NAV_COPY.embedTitle, desc: NAV_COPY.embedDesc, href: "/embed-builder" },
    { icon: "ph:squares-four-fill", title: NAV_COPY.dashTitle, desc: NAV_COPY.dashDesc, href: "/dash" },
    { icon: "ph:clock-counter-clockwise-fill", title: NAV_COPY.changelogTitle, desc: NAV_COPY.changelogDesc, href: "/changelog" }
  ];
  const NAV_PRICING = [
    { icon: "ph:crown-fill", title: NAV_COPY.serverTitle, desc: NAV_COPY.serverDesc, href: "/premium" },
    { icon: "ph:sparkle-fill", title: NAV_COPY.plansTitle, desc: NAV_COPY.plansDesc, href: "/dash/plans" }
  ];
  const prefetchFor = (href) => isExternal(href) || /(?:^|\/)dash(?:[/?#]|$)/.test(href) ? void 0 : "hover";
  const SITE = Astro2.site ?? "https://petto.sbs";
  const canonicalPath = Astro2.url.pathname.replace(/\/index(?:\.html)?$/, "/").replace(/(.)\/+$/, "$1").replace(/^\/(es|pt-br)$/, "/$1/");
  const canonicalUrl = new URL(canonicalPath, SITE).toString();
  const pagePicture = pageImage(canonicalPath);
  const ogImageUrl = new URL(ogImage || pageImagePath(pagePicture), SITE).toString();
  const ogImageAlt = ogImageAltProp || pagePicture.alt;
  const brandOf = (text) => /Petto/.test(text) ? text : `${text} \xB7 Petto`;
  const previewTitle = ogTitle ? brandOf(ogTitle) : pagePicture.exact ? pagePicture.embedTitle : brandOf(title);
  const metaDescription = description ?? (pagePicture.exact ? pagePicture.description : pagePicture.description || pagePicture.tagline || DEFAULT_DESCRIPTION[lang]);
  const embedThemeColor = `#${pagePicture.accent.toString(16).padStart(6, "0")}`;
  const OG_LOCALE = { en: "en_US", es: "es_ES", "pt-BR": "pt_BR" };
  const HREFLANG = { en: "en", es: "es", "pt-BR": "pt-BR" };
  const routeNoSlash = currentRoute.replace(/(.)\/+$/, "$1");
  const hasLanguages = active !== "dash" && !routeNoSlash.startsWith("/dash") && LOCALIZED_ROUTES.some((re) => re.test(routeNoSlash));
  const alternates = hasLanguages ? Object.keys(localePath).map((l) => ({ lang: l, href: new URL(`${localePath[l]}${routeNoSlash === "/" ? "/" : routeNoSlash}`, SITE).toString() })) : [];
  const cookieCopy = {
    en: { text: "By using this site, you agree with our use of cookies.", consent: "I consent to cookies", decline: "Decline all", more: "Want to know more?", privacy: "Privacy policy" },
    es: { text: "Al usar este sitio, aceptas nuestro uso de cookies.", consent: "Acepto las cookies", decline: "Rechazar todo", more: "\xBFQuieres saber m\xE1s?", privacy: "Pol\xEDtica de privacidad" },
    "pt-BR": { text: "Ao usar este site, voc\xEA concorda com o uso de cookies.", consent: "Aceito os cookies", decline: "Recusar tudo", more: "Quer saber mais?", privacy: "Pol\xEDtica de privacidade" }
  }[lang];
  const bypassLocale = (href) => href.startsWith("/dash") && active === "dash";
  const hrefFor = (href) => isExternal(href) || bypassLocale(href) ? href : `${base}${href}`;
  return renderTemplate(_c || (_c = __template(["<html", '> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><script>(function(){', "\n    // A copy of this page kept by Cloudflare or the browser can belong to an older deploy. The version that is live now is asked once\n    // (a unique address, so no cache answers it); when it is newer, the page loads itself again once with that version in the address,\n    // which no cache has seen yet. The dashboard is never kept, so it is left alone.\n    (function () {\n      if (location.pathname.indexOf('/dash') !== -1) return;\n      // Loaded again for this version (?v=<version>): the address goes back to the clean one, so it is the one people copy and share.\n      try {\n        var here = new URL(location.href);\n        if (here.searchParams.get('v') === pageVersion) { here.searchParams.delete('v'); history.replaceState(history.state, '', here.pathname + here.search + here.hash); }\n      } catch (e) { /* an old browser keeps the address */ }\n      fetch('/version.json?t=' + Date.now(), { cache: 'no-store' })\n        .then(function (r) { return r.ok ? r.json() : null; })\n        .then(function (live) {\n          // What is compared is the moment of the build, not the version number of package.json: a deploy that did not change the number\n          // (most of them) used to leave the old copy of a static page, such as Premium, in place for hours.\n          if (!live || !live.builtAt) return;\n          // The number in the footer is always the live one, even on a copy that is kept (it is written again as soon as the page can be read).\n          if (live.version) {\n            var showVersion = function () { var spots = document.querySelectorAll('[data-web-version]'); for (var i = 0; i < spots.length; i++) spots[i].textContent = 'Web v' + live.version; };\n            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showVersion); else showVersion();\n          }\n          if (live.builtAt === pageVersion) return;\n          // One reload for each page: the mark is of the page (not of the whole visit), so a second old page that the browser kept is also loaded again.\n          var key = 'petto-reloaded:' + location.pathname;\n          try { if (sessionStorage.getItem(key) === live.builtAt) return; sessionStorage.setItem(key, live.builtAt); } catch (e) { return; }\n          var url = new URL(location.href);\n          url.searchParams.set('v', live.builtAt);\n          location.replace(url.toString());\n        })\n        .catch(function () {});\n    })();\n  })();<\/script><title>", '</title><meta name="description"', ">", '<!-- Dark midnight accent bar for Discord OpenGraph embeds, matching the night-sky cards; browsers apply theme-specific colors below. --><meta name="theme-color"', `><meta name="theme-color" content="#111113" media="(prefers-color-scheme: dark)"><meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)"><script>
    // A theme chosen by hand (the theme switch) wins over the phone's own setting.
    (function () {
      var colors = { dark: '#111113', light: '#ffffff' };
      var apply = function () {
        var theme = document.documentElement.getAttribute('data-theme');
        if (!colors[theme]) return;
        document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) { meta.removeAttribute('media'); meta.setAttribute('content', colors[theme]); });
      };
      apply();
      try { new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); } catch (e) { /* the bar keeps its color */ }
    })();
  <\/script><link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/assets/favicon-3d.png"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Petto"><link rel="canonical"`, ">", "", "", '<link rel="icon" type="image/png" href="/assets/favicon-3d.png"><link rel="preload" as="image" href="/assets/favicon-3d.png" fetchpriority="high">', '<meta property="og:type" content="website"><meta property="og:site_name" content="Petto"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:locale"', ">", '<meta property="og:image"', '><meta property="og:image:type" content="image/webp"><meta property="og:image:width"', '><meta property="og:image:height"', '><meta property="og:image:alt"', '><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', "><script>\n    // The installed app (see /manifest.webmanifest) needs a service worker; it only shows an offline page when there is no connection.\n    if ('serviceWorker' in navigator) {\n      window.addEventListener('load', function () {\n        try { navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {}); } catch (e) { /* the page works without it */ }\n      });\n    }\n  <\/script>", "</head> <body", "> ", " ", " ", ' <div class="page-transition" id="pageTransition" aria-hidden="true"> <img class="page-transition-mascot" src="/assets/favicon-3d.png" alt=""> </div> ', " ", " ", " ", " ", " ", ' <div class="cookie-banner" id="cookieBanner" hidden> <p class="cookie-text">', '</p> <div class="cookie-btns"> <button type="button" class="cookie-btn cookie-btn-accent" id="cookieAccept">', '</button> <button type="button" class="cookie-btn cookie-btn-ghost" id="cookieDecline">', '</button> <a class="cookie-btn cookie-btn-outline"', ">", '</a> </div> <a class="cookie-privacy-link"', ">", "</a> </div>   ", " ", " ", ` <script>
    (function () {
      var btt = document.getElementById('backToTop');
      if (btt) {
        var syncBtt = function () { btt.classList.toggle('is-visible', window.scrollY > 420); };
        syncBtt();
        window.addEventListener('scroll', syncBtt, { passive: true });
        btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
      }
      // Protect artwork and images from casual right-click save / drag-out while keeping form inputs normal.
      document.addEventListener('contextmenu', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
        if (t.closest('img, picture, .closing-scene, .pr-stage-wrap, .home-hero-stage, .pr-vetox-hero-art, .sh-art, [data-protected-art]')) {
          e.preventDefault();
        }
      });
      document.addEventListener('dragstart', function (e) {
        var t = e.target;
        if (t && t.closest && t.closest('img, picture, [data-protected-art]')) e.preventDefault();
      });
      // Warm shared public hero artwork in the browser cache while idle so navigating between Home and Premium paints instantly with zero black flash.
      if (document.body.classList.contains('public-body')) {
        var warmed = false;
        var warmArtwork = function () {
          if (warmed) return;
          warmed = true;
          ['/assets/home-hero-sky.webp', '/assets/premium-sky.webp', '/assets/premium-footer-sky.webp'].forEach(function (src) {
            var img = new Image();
            img.decoding = 'async';
            img.src = src;
          });
        };
        if ('requestIdleCallback' in window) window.requestIdleCallback(warmArtwork, { timeout: 1400 });
        else setTimeout(warmArtwork, 500);
        document.addEventListener('pointerenter', function (e) {
          var a = e.target && e.target.closest ? e.target.closest('a[href*="/premium"]') : null;
          if (a) warmArtwork();
        }, true);
      }
    })();
  <\/script> `, " ", " </body></html>"])), addAttribute(lang, "lang"), defineScriptVars({ pageVersion: buildInfo.builtAt }), title, addAttribute(metaDescription, "content"), noindex && renderTemplate`<meta name="robots" content="noindex, follow">`, addAttribute(embedThemeColor, "content"), addAttribute(canonicalUrl, "href"), feed && renderTemplate`<link rel="alternate" type="application/rss+xml"${addAttribute(feed.title, "title")}${addAttribute(feed.href, "href")}>`, alternates.map((a) => renderTemplate`<link rel="alternate"${addAttribute(HREFLANG[a.lang], "hreflang")}${addAttribute(a.href, "href")}>`), alternates.length > 0 && renderTemplate`<link rel="alternate" hreflang="x-default"${addAttribute(alternates[0].href, "href")}>`, allPreloads.map((src) => renderTemplate`<link rel="preload" as="image"${addAttribute(src, "href")} fetchpriority="high">`), addAttribute(previewTitle, "content"), addAttribute(metaDescription, "content"), addAttribute(canonicalUrl, "content"), addAttribute(OG_LOCALE[lang], "content"), alternates.filter((a) => a.lang !== lang).map((a) => renderTemplate`<meta property="og:locale:alternate"${addAttribute(OG_LOCALE[a.lang], "content")}>`), addAttribute(ogImageUrl, "content"), addAttribute(String(pagePicture.width), "content"), addAttribute(String(pagePicture.height), "content"), addAttribute(ogImageAlt, "content"), addAttribute(previewTitle, "content"), addAttribute(metaDescription, "content"), addAttribute(ogImageUrl, "content"), renderHead(), addAttribute({ "dash-body": appShell, "public-body": active !== "dash", "dashboard-motion": active === "dash", "skin-ash": skin === "ash", "has-vx-backdrop": useVxBackdrop }, "class:list"), useVxBackdrop && renderTemplate`<div class="vx-page-sky" aria-hidden="true"> <img src="/assets/hero-art-4.webp" alt="" loading="eager" decoding="sync" fetchpriority="high" draggable="false"> <div class="vx-page-sky-fade"></div> </div>`, renderComponent($$result, "DashLoader", $$DashLoader, {}), active === "dash" && !appShell && renderTemplate`${renderComponent($$result, "DashPanelKit", $$DashPanelKit, {})}`, renderComponent($$result, "LiquidGlass", $$LiquidGlass, {}), !hideNav && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <header class="nav"> <div class="nav-inner"> <a class="brand"', ' data-astro-prefetch="hover"> <img src="/assets/favicon-3d.png" alt="" width="24" height="24" loading="eager" decoding="sync" fetchpriority="high">\nPetto\n</a> <nav class="links"> <div class="mega"> <button class="mega-trigger" id="productTrigger" aria-expanded="false"> ', " ", ' </button> <div class="mega-panel mega-panel-vetox" id="productPanel"> <div class="mega-grid-2"> ', ' </div> </div> </div> <div class="mega"> <button class="mega-trigger" id="communityTrigger" aria-expanded="false"> ', " ", ' </button> <div class="mega-panel mega-panel-vetox mega-panel-pricing" id="communityPanel"> <div class="mega-grid-1"> ', " </div> </div> </div> <a", ' data-astro-prefetch="hover"', ">", "</a> <a", ' data-astro-prefetch="hover"', ">", '</a> </nav> <div class="nav-actions"> <div class="lang-switch"> <button type="button" class="theme-toggle lang-btn" id="langToggle"', "", ' aria-haspopup="true" aria-expanded="false" aria-controls="langMenu"> <img class="flag flag-round"', ' alt="" width="20" height="20"> </button> <div class="lang-menu" id="langMenu"> ', ' </div> </div> <button class="theme-toggle nav-desktop-only nav-theme-hidden" id="themeToggle" aria-label="Toggle theme" title="Toggle theme"> ', " </button> ", ' <a class="btn btn-primary nav-cta-pill nav-desktop-only" href="https://petto.sbs/invite" target="_blank" rel="noopener">', '</a> <button class="nav-burger" id="navBurger" aria-label="Menu" aria-expanded="false" aria-controls="mobileNav"> ', " ", ' </button> </div> </div> </header>  <div class="mobile-nav" id="mobileNav"> <div class="mobile-nav-inner"> <div class="mnav-scroll"> <div class="mnav-top"> <div class="mnav-head"> <details class="mnav-pop mnav-lang" id="mnavLang"> <summary class="mnav-chip"', '> <img class="flag"', ' alt="" width="24" height="16"> <span class="mnav-chip-text">', "</span> ", ' </summary> <div class="mnav-menu"> ', ' </div> </details> <button type="button" class="mnav-theme" id="mobileThemeToggle" aria-label="Toggle theme" title="Toggle theme"> ', " </button> </div> ", ' <a class="btn btn-primary mobile-nav-cta" href="https://petto.sbs/invite" target="_blank" rel="noopener">', '</a> </div> <div class="mnav-list"> <details class="mnav-group" name="mnav-group"> <summary class="mnav-row"><span>', "</span>", '</summary> <div class="mnav-sub"> ', " </div> </details> <a", ' class="mnav-row" data-astro-prefetch="hover"><span>', "</span></a> <a", ' class="mnav-row" data-astro-prefetch="hover"><span class="premium-shine">', "</span></a> <a", ' class="mnav-row" data-astro-prefetch="hover"><span>', '</span><span class="status-dot" aria-hidden="true"></span></a> </div> </div> <div class="mnav-foot"> ', " </div> </div> </div> <script>\n    // The burger and the language of the top bar. They are wired here, right after the menu, in plain old JavaScript, and not in the big script of the\n    // page: if that one fails (a browser too old for its syntax, a content blocker, a file that does not load or loads late) the menu still opens.\n    (function () {\n      if (window.__pettoNav) return;\n      window.__pettoNav = true;\n      var langToggle = document.getElementById('langToggle');\n      var langMenu = document.getElementById('langMenu');\n      var navBurger = document.getElementById('navBurger');\n      var mobileNav = document.getElementById('mobileNav');\n      var mnavPops = mobileNav ? Array.prototype.slice.call(mobileNav.querySelectorAll('details.mnav-pop')) : [];\n      function setLangOpen(open) {\n        if (langMenu) langMenu.classList.toggle('open', open);\n        if (langToggle) langToggle.setAttribute('aria-expanded', String(open));\n      }\n      // The language and the account of the burger menu are small pop-ups: one open at a time, closed by a tap outside or by Escape.\n      function closeMnavPops(except) {\n        mnavPops.forEach(function (pop) { if (pop !== except) pop.open = false; });\n      }\n      function closeMobileNav() {\n        if (navBurger) { navBurger.classList.remove('open'); navBurger.setAttribute('aria-expanded', 'false'); }\n        if (mobileNav) mobileNav.classList.remove('open');\n        document.body.style.overflow = '';\n        closeMnavPops(null);\n      }\n      if (langToggle) langToggle.addEventListener('click', function (e) {\n        e.stopPropagation();\n        setLangOpen(!(langMenu && langMenu.classList.contains('open')));\n      });\n      if (navBurger) navBurger.addEventListener('click', function (e) {\n        e.stopPropagation();\n        var isOpen = navBurger.classList.contains('open');\n        // Under the pill of the header, wherever it is: its real bottom edge plus a small gap (the glass pill has a soft shadow).\n        var pill = document.querySelector('header.nav');\n        if (!isOpen && pill && mobileNav && document.body.classList.contains('public-body')) mobileNav.style.top = Math.round(pill.getBoundingClientRect().bottom + 10) + 'px';\n        navBurger.classList.toggle('open', !isOpen);\n        if (mobileNav) mobileNav.classList.toggle('open', !isOpen);\n        navBurger.setAttribute('aria-expanded', String(!isOpen));\n        document.body.style.overflow = !isOpen ? 'hidden' : '';\n      });\n      mnavPops.forEach(function (pop) {\n        pop.addEventListener('toggle', function () { if (pop.open) closeMnavPops(pop); });\n      });\n      if (mobileNav) {\n        mobileNav.addEventListener('click', function (e) {\n          if (!(e.target instanceof Element) || !e.target.closest('details.mnav-pop')) closeMnavPops(null);\n        });\n        Array.prototype.forEach.call(mobileNav.querySelectorAll('a'), function (link) { link.addEventListener('click', closeMobileNav); });\n      }\n      document.addEventListener('click', function () { setLangOpen(false); });\n      document.addEventListener('keydown', function (event) {\n        if (event.key !== 'Escape') return;\n        if (langMenu && langMenu.classList.contains('open')) { setLangOpen(false); if (langToggle) langToggle.focus(); }\n        if (mobileNav && mobileNav.classList.contains('open')) {\n          var openPop = mnavPops.filter(function (pop) { return pop.open; })[0];\n          if (openPop) { openPop.open = false; var sum = openPop.querySelector('summary'); if (sum) sum.focus(); } else { closeMobileNav(); if (navBurger) navBurger.focus(); }\n        }\n      });\n      // Coming back to the page with the Back button (it can be restored as it was left) never shows an open menu.\n      window.addEventListener('pageshow', function (e) { if (e.persisted) closeMobileNav(); });\n      window.addEventListener('resize', function () {\n        if (window.innerWidth > 880 && mobileNav && mobileNav.classList.contains('open')) closeMobileNav();\n      });\n    })();\n  <\/script> "])), addAttribute(`${base}/`, "href"), NAV_COPY.resources, renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:caret-down", "class": "mega-caret", "width": "12", "height": "12" }), NAV_RESOURCES.map((it) => renderTemplate`<a class="mega-card-item"${addAttribute(hrefFor(it.href), "href")}${addAttribute(prefetchFor(hrefFor(it.href)), "data-astro-prefetch")}${addAttribute(isExternal(it.href) ? "_blank" : void 0, "target")}${addAttribute(isExternal(it.href) ? "noopener" : void 0, "rel")}> <span class="mega-tile">${renderComponent($$result2, "NavIcon", $$NavIcon, { "name": it.icon, "width": "18", "height": "18" })}</span> <span class="mega-item-body"> <span class="mega-item-title">${it.title}</span> <span class="mega-item-desc">${it.desc}</span> </span> </a>`), t.nav.premium, renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:caret-down", "class": "mega-caret", "width": "12", "height": "12" }), NAV_PRICING.map((it) => renderTemplate`<a class="mega-card-item"${addAttribute(hrefFor(it.href), "href")}${addAttribute(prefetchFor(hrefFor(it.href)), "data-astro-prefetch")}${addAttribute(isExternal(it.href) ? "_blank" : void 0, "target")}${addAttribute(isExternal(it.href) ? "noopener" : void 0, "rel")}> <span class="mega-tile mega-tile-gold">${renderComponent($$result2, "NavIcon", $$NavIcon, { "name": it.icon, "width": "18", "height": "18" })}</span> <span class="mega-item-body"> <span class="mega-item-title">${it.title}</span> <span class="mega-item-desc">${it.desc}</span> </span> </a>`), addAttribute(`${base}/commands`, "href"), addAttribute({ active: currentRoute.startsWith("/commands") }, "class:list"), t.nav.commands, addAttribute(`${base}/status`, "href"), addAttribute({ active: currentRoute.startsWith("/status") }, "class:list"), t.nav.status, addAttribute(langLabel, "aria-label"), addAttribute(langLabel, "title"), addAttribute(langNow.flag, "src"), langOptions.map((o) => renderTemplate`<a${addAttribute(languageHref(o.code), "href")}${addAttribute(o.code, "data-set-lang")}${addAttribute(o.code, "lang")}${addAttribute(o.code === lang ? "true" : void 0, "aria-current")}${addAttribute({ active: o.code === lang }, "class:list")}> <span class="lang-name"><img class="flag"${addAttribute(o.flag, "src")} alt="" width="24" height="16">${o.label}</span> ${o.code === lang && renderTemplate`${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:check-bold", "width": "14", "height": "14" })}`} </a>`), renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:sun-fill", "id": "themeIcon", "width": "16", "height": "16" }), renderComponent($$result2, "NavAccount", $$NavAccount, { "lang": lang, "variant": "bar" }), t.nav.addToDiscord, renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:list", "width": "20", "height": "20", "class": "nav-burger-open-ic" }), renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:x", "width": "20", "height": "20", "class": "nav-burger-close-ic" }), addAttribute(langLabel, "aria-label"), addAttribute(langNow.flag, "src"), langNow.label, renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:caret-down", "class": "mnav-caret", "width": "14", "height": "14" }), langOptions.map((o) => renderTemplate`<a${addAttribute(languageHref(o.code), "href")}${addAttribute(o.code, "data-set-lang")}${addAttribute(o.code, "lang")}${addAttribute(o.code === lang ? "true" : void 0, "aria-current")}${addAttribute({ active: o.code === lang }, "class:list")}> <span class="lang-name"><img class="flag"${addAttribute(o.flag, "src")} alt="" width="24" height="16">${o.label}</span> ${o.code === lang && renderTemplate`${renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:check-bold", "width": "14", "height": "14" })}`} </a>`), renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:sun-fill", "width": "18", "height": "18", "id": "mobileThemeIcon" }), renderComponent($$result2, "NavAccount", $$NavAccount, { "lang": lang, "variant": "mobile" }), t.nav.addToDiscord, NAV_COPY.resources, renderComponent($$result2, "InlineIcon", $$InlineIcon, { "name": "ph:caret-down", "class": "mnav-caret", "width": "16", "height": "16" }), NAV_RESOURCES.map((it) => renderTemplate`<a${addAttribute(hrefFor(it.href), "href")}${addAttribute(prefetchFor(hrefFor(it.href)), "data-astro-prefetch")}${addAttribute(isExternal(it.href) ? "_blank" : void 0, "target")}${addAttribute(isExternal(it.href) ? "noopener" : void 0, "rel")} class="mobile-nav-link"> ${renderComponent($$result2, "NavIcon", $$NavIcon, { "name": it.icon, "width": "16", "height": "16" })} <span>${it.title}</span> </a>`), addAttribute(`${base}/commands`, "href"), t.nav.commands, addAttribute(`${base}/premium`, "href"), t.nav.premium, addAttribute(`${base}/status`, "href"), t.nav.status, renderComponent($$result2, "NavAccount", $$NavAccount, { "lang": lang, "variant": "foot" })) })}`, active !== "dash" && renderTemplate`${renderComponent($$result, "GlassDock", $$GlassDock, { "base": base, "route": currentRoute, "labels": { home: "Petto", commands: t.nav.commands, premium: t.nav.premium, status: t.nav.status, support: t.nav.support, account: "Dashboard" } })}`, renderSlot($$result, $$slots["default"]), showFooter && active !== "dash" && renderTemplate`<section class="closing-scene" aria-labelledby="closing-cta-title"> <div class="closing-bg" aria-hidden="true"> <img src="/assets/premium-footer-sky.webp" alt="" class="closing-img" loading="lazy"> <div class="closing-fade-top"></div> <div class="closing-fade-bottom"></div> </div> <div class="wrap closing-inner"> <h2 id="closing-cta-title">${closingCta.title}</h2> <p>${closingCta.desc}</p> <div class="closing-actions"> <a class="closing-btn closing-btn-primary" href="https://petto.sbs/invite" target="_blank" rel="noopener">${closingCta.invite}</a> <a class="closing-btn closing-btn-glass" href="https://petto.sbs/support" target="_blank" rel="noopener">${closingCta.support}</a> </div> </div> </section>`, showFooter && renderTemplate`<footer id="footer"> <div class="wrap"> <div class="foot-grid"> <div> <div class="foot-brand"><img src="/assets/favicon-3d.png" alt="">Petto</div> <p class="foot-desc">${t.footer.desc}</p> <div class="foot-socials"> <a class="foot-social-btn foot-social-discord" href="https://petto.sbs/support" target="_blank" rel="noopener" aria-label="Discord" title="Discord"> <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path></svg> </a> <a class="foot-social-btn foot-social-x" href="https://x.com/pettobot" target="_blank" rel="noopener" aria-label="X" title="X"> <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg> </a> <button type="button" class="foot-social-btn" id="footThemeToggle" aria-label="Toggle theme" title="Toggle theme"> <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg> </button> </div> </div> <div class="foot-col"> <div class="ft">${t.footer.product}</div> <div class="foot-list"> ${FOOTER_PRODUCT_COMPACT.map((it) => it.premium ? renderTemplate`<a${addAttribute(`${base}${it.href}`, "href")} class="foot-premium-link" data-astro-prefetch="hover"> ${renderComponent($$result, "InlineIcon", $$InlineIcon, { "name": "ph:crown-fill", "width": "14", "height": "14" })} <span class="premium-shine">${it.title}</span> </a>` : renderTemplate`<a${addAttribute(hrefFor(it.href), "href")}${addAttribute(prefetchFor(hrefFor(it.href)), "data-astro-prefetch")}${addAttribute(isExternal(it.href) ? "_blank" : void 0, "target")}${addAttribute(isExternal(it.href) ? "noopener" : void 0, "rel")}>${it.title}${it.badge && renderTemplate`<em class="foot-badge">${it.badge}</em>`}</a>`)} </div> </div> <div class="foot-col"> <div class="ft">${FOOTER_TOOLS_TITLE[lang]}</div> ${FOOTER_TOOLS.map((it) => renderTemplate`<a${addAttribute(hrefFor(it.href), "href")}${addAttribute(prefetchFor(hrefFor(it.href)), "data-astro-prefetch")}>${it.title}${it.badge && renderTemplate`<em class="foot-badge">${it.badge}</em>`}</a>`)} </div> <div class="foot-col"> <div class="ft">${t.footer.supportTitle}</div> ${FOOTER_SUPPORT.slice(0, 5).map((it) => renderTemplate`<a${addAttribute(hrefFor(it.href), "href")}${addAttribute(prefetchFor(hrefFor(it.href)), "data-astro-prefetch")}${addAttribute(isExternal(it.href) ? "_blank" : void 0, "target")}${addAttribute(isExternal(it.href) ? "noopener" : void 0, "rel")}>${it.title}${it.badge && renderTemplate`<em class="foot-badge">${it.badge}</em>`}</a>`)} </div> <div class="foot-col"> <div class="ft">${t.footer.team}</div> ${FOOTER_TEAM.map((it) => renderTemplate`<a${addAttribute(hrefFor(it.href), "href")}${addAttribute(prefetchFor(hrefFor(it.href)), "data-astro-prefetch")}${addAttribute(isExternal(it.href) ? "_blank" : void 0, "target")}${addAttribute(isExternal(it.href) ? "noopener" : void 0, "rel")}>${it.title}${it.badge && renderTemplate`<em class="foot-badge">${it.badge}</em>`}</a>`)} </div> <div class="foot-col"> <div class="ft">${t.footer.legal}</div> ${t.footer.legalItems.map((it) => renderTemplate`<a${addAttribute(`${base}${it.href}`, "href")} data-astro-prefetch="hover">${it.title}</a>`)} </div> </div> <div class="foot-bottom"> <div class="foot-meta-left"> <span>${t.footer.copy}</span> <span class="foot-meta-sep" aria-hidden="true">·</span> <p class="foot-powered">${t.footer.poweredBy} <a href="https://cubepath.com" target="_blank" rel="noopener">CubePath</a> ${t.footer.poweredAnd} <a href="https://discloud.com" target="_blank" rel="noopener">Discloud</a></p> <span class="foot-meta-sep" aria-hidden="true">·</span> <span class="num" data-web-version${addAttribute(buildTitle(), "title")}>${buildLabel()}</span> </div> <details class="foot-lang" id="footLang"> <summary${addAttribute(langLabel, "aria-label")}> <img class="flag flag-round"${addAttribute(langNow.flag, "src")} alt="" width="16" height="16"> <span>${langWord}: <b>${langNow.label}</b></span> ${renderComponent($$result, "InlineIcon", $$InlineIcon, { "name": "ph:caret-down", "class": "foot-lang-caret", "width": "12", "height": "12" })} </summary> <div class="foot-lang-menu"> ${langOptions.map((o) => renderTemplate`<a${addAttribute(languageHref(o.code), "href")}${addAttribute(o.code, "data-set-lang")}${addAttribute(o.code, "lang")}${addAttribute(o.code === lang ? "true" : void 0, "aria-current")}${addAttribute({ active: o.code === lang }, "class:list")}> <span class="lang-name"><img class="flag"${addAttribute(o.flag, "src")} alt="" width="22" height="15">${o.label}</span> ${o.code === lang && renderTemplate`${renderComponent($$result, "InlineIcon", $$InlineIcon, { "width": "13", "height": "13", "name": "ph:check-bold" })}`} </a>`)} </div> </details> </div> </div> </footer>`, cookieCopy.text, cookieCopy.consent, cookieCopy.decline, addAttribute(`${base}/privacy`, "href"), cookieCopy.more, addAttribute(`${base}/privacy`, "href"), cookieCopy.privacy, renderComponent($$result, "DashSelectMenu", $$DashSelectMenu, {}), active === "dash" && renderTemplate(_b || (_b = __template([`<script>
      // The height of the sticky top of a dashboard page (--dash-sticky, see scroll-padding-top above), measured, not guessed: the site
      // header plus, on a phone inside a server, the bar with the menu button. And a page opened fresh (a link, an address typed) starts
      // at its top, whatever scrolled it while it loaded; a reload or the back button keep the browser's own restored place.
      (function () {
        var root = document.documentElement;
        function measure() {
          var off = 0;
          var header = document.querySelector('header.nav');
          if (header) {
            var cs = getComputedStyle(header);
            if (cs.position === 'sticky' || cs.position === 'fixed') off += header.getBoundingClientRect().height + (parseFloat(cs.top) || 0);
          }
          var bar = document.querySelector('.dgl-menu-bar');
          if (bar && bar.offsetHeight && getComputedStyle(bar).position === 'sticky') off += bar.offsetHeight;
          var dtb = document.querySelector('.dtb');
          if (dtb && dtb.offsetHeight && getComputedStyle(dtb).position === 'sticky') off += dtb.offsetHeight;
          root.style.setProperty('--dash-sticky', Math.round(off) + 'px');
        }
        measure();
        window.addEventListener('resize', measure, { passive: true });
        // The language links say which page to come back to as the page was first drawn; after moving to other sections without a reload
        // (the address changed) they come back to where the person is now, with its tab, filters and anchor.
        document.addEventListener('click', function (event) {
          var link = event.target && event.target.closest ? event.target.closest('a[href*="/dash/lang?"]') : null;
          if (!link) return;
          try {
            var url = new URL(link.getAttribute('href'), location.href);
            url.searchParams.set('next', location.pathname + location.search + location.hash);
            link.setAttribute('href', url.pathname + url.search);
          } catch (e) { /* the link keeps the page it had */ }
        }, true);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
        try {
          var entry = performance.getEntriesByType('navigation')[0];
          if (entry && entry.type === 'navigate' && !location.hash) {
            var touched = false;
            ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (name) { window.addEventListener(name, function () { touched = true; }, { once: true, passive: true }); });
            var top = function () { if (!touched && window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); };
            window.addEventListener('load', top);
            requestAnimationFrame(top);
          }
        } catch (e) { /* an old browser keeps its own behaviour */ }
      })();
    <\/script>`]))), active !== "dash" && renderTemplate`<button type="button" id="backToTop" class="back-to-top"${addAttribute(lang === "es" ? "Volver arriba" : lang === "pt-BR" ? "Voltar ao topo" : "Back to top", "aria-label")}${addAttribute(lang === "es" ? "Volver arriba" : lang === "pt-BR" ? "Voltar ao topo" : "Back to top", "title")}> <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path></svg> </button>`, renderComponent($$result, "TextFit", $$TextFit, {}), active !== "dash" && renderTemplate`${renderComponent($$result, "PopOut", $$PopOut, {})}`);
}, "/home/runner/work/petto-web/petto-web/src/layouts/Base.astro", void 0);

export { $$Base as $, P, $$DashClientI18N as a, $$InlineIcon as b, $$DashMotion as c, $$DashToast as d, $$DashConfirm as e, $$DashLoading as f, $$DashSelectMenu as g, $$IsoBox as h, isStillNew as i, scene as j, iso as k, str as s };
