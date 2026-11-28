import { c as createAstro, a as createComponent, b as addAttribute, r as renderTemplate, u as unescapeHTML, g as renderHead, f as renderSlot } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { t as themeFor, p as pictureUrl } from './appeals_OSuSBkCm.mjs';
import { A as APPEAL_LANGS, a as appealText } from './appealSite_SuoN-UBP.mjs';
/* empty css                         */

const $$Astro = createAstro("https://petto.sbs");
const $$AppealLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AppealLayout;
  const { lang, config, guild, preview } = Astro2.props;
  const t = appealText(lang);
  const theme = themeFor(config.brand);
  const where = { path: guild.path ?? guild.id, origin: Astro2.url.origin };
  const banner = pictureUrl(config.brand?.banner_url, "banner", where);
  const icon = pictureUrl(config.brand?.icon_url, "icon", where) ?? guild.icon;
  const siteName = (config.brand?.name || guild.name).slice(0, 60);
  const langLabels = { en: "EN", es: "ES", "pt-BR": "PT" };
  const here = Astro2.url.pathname;
  const canonical = new URL(Astro2.url.pathname, Astro2.site ?? "https://petto.sbs").toString();
  return renderTemplate`<html${addAttribute(lang, "lang")}> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${preview.title}</title><meta name="description"${addAttribute(preview.description, "content")}><meta name="theme-color"${addAttribute(preview.color, "content")}><link rel="canonical"${addAttribute(canonical, "href")}><link rel="icon"${addAttribute(icon ?? "/assets/mascot-icon.png", "href")}><meta property="og:type" content="website"><meta property="og:title"${addAttribute(preview.title, "content")}><meta property="og:description"${addAttribute(preview.description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:site_name"${addAttribute(preview.siteName, "content")}>${preview.image && renderTemplate`<meta property="og:image"${addAttribute(preview.image, "content")}>`}<meta name="twitter:card"${addAttribute(preview.image && !preview.small ? "summary_large_image" : "summary", "content")}><meta name="twitter:title"${addAttribute(preview.title, "content")}><meta name="twitter:description"${addAttribute(preview.description, "content")}>${preview.image && renderTemplate`<meta name="twitter:image"${addAttribute(preview.image, "content")}>`}<meta name="robots" content="noindex"><style is:global>${unescapeHTML(`
    @font-face { font-family: 'Jakarta Variable'; src: url('/fonts/dash/plus-jakarta-sans-latin-wght-normal.woff2') format('woff2-variations'); font-weight: 200 800; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122; }
    @font-face { font-family: 'Jakarta Variable'; src: url('/fonts/dash/plus-jakarta-sans-latin-ext-wght-normal.woff2') format('woff2-variations'); font-weight: 200 800; font-display: swap; unicode-range: U+0100-02BA, U+1E00-1EFF, U+2C60-2C7F, U+A720-A7FF; }
    @font-face { font-family: 'Fraunces Variable'; src: url('/fonts/dash/fraunces-latin-wght-normal.woff2') format('woff2-variations'); font-weight: 100 900; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122; }
    @font-face { font-family: 'Fraunces Variable'; src: url('/fonts/dash/fraunces-latin-ext-wght-normal.woff2') format('woff2-variations'); font-weight: 100 900; font-display: swap; unicode-range: U+0100-02BA, U+1E00-1EFF, U+2C60-2C7F, U+A720-A7FF; }
  `)}</style>${renderHead()}</head> <body class="ap"${addAttribute(`--accent:${theme.accent}`, "style")}> <div class="ap-shell"> <header class="ap-top"> <a class="ap-brand"${addAttribute(`/appeal/${guild.path ?? guild.id}`, "href")}><img${addAttribute(icon ?? "/assets/mascot-icon.webp", "src")} alt="" width="34" height="34"><span>${siteName}</span></a> <nav class="ap-langs" aria-label="Language"> ${APPEAL_LANGS.map((l) => renderTemplate`<a${addAttribute(`${here}?lang=${l}`, "href")}${addAttribute(["ap-lang", { on: l === lang }], "class:list")}${addAttribute(l, "hreflang")}>${langLabels[l]}</a>`)} </nav> </header> <main class="ap-screen"> ${banner && renderTemplate`<div class="ap-banner"${addAttribute(`background-image:url(${JSON.stringify(banner)})`, "style")}></div>`} <div class="ap-inner">${renderSlot($$result, $$slots["default"])}</div> </main> <footer class="ap-foot"><a href="https://petto.sbs" rel="noopener"><img src="/assets/mascot-icon.webp" alt="" width="18" height="18">${t("madeWith")}</a></footer> </div> </body></html>`;
}, "/home/runner/work/petto-web/petto-web/src/components/AppealLayout.astro", void 0);

export { $$AppealLayout as $ };
