import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { u as userCardData, a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { $ as $$SkeletonBlocks } from '../../../../chunks/SkeletonBlocks_COw0_LxU.mjs';
import { $ as $$DashReactWords } from '../../../../chunks/DashReactWords_BE3DKW1v.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
/* empty css                                          */
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo } from '../../../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashCards = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashCards;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, selected } = Astro2.props;
  const look = userCardData(user);
  const decorationUrl = look.decoration?.still?.replace("size=96", "size=256") ?? "";
  const nameplateUrl = look.nameplate?.still ?? "";
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "cards", "pageTitle": "Image cards", "data-astro-cid-cj2mkyrz": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="crd-page" data-astro-cid-cj2mkyrz> <header class="crd-head" data-astro-cid-cj2mkyrz> <h1 data-astro-cid-cj2mkyrz>${dt("Image cards")}</h1> <p class="crd-lead" data-astro-cid-cj2mkyrz>${dt("The pictures of welcome and rank messages. Design a card here, then pick it in an embed template, under Image card.")}</p> </header> ${renderComponent($$result2, "DashAcData", $$DashAcData, { "data-astro-cid-cj2mkyrz": true })} ${renderComponent($$result2, "DashReactWords", $$DashReactWords, { "data-astro-cid-cj2mkyrz": true })} ${renderComponent($$result2, "CardsApp", null, { "client:only": "react", "guildId": guildId, "premiumUrl": "/dash/premium", "initialSelected": selected, "userId": String(user.userId ?? ""), "userName": user.username, "userAvatarUrl": user.avatar ?? "/assets/mascot-icon.webp", "serverName": guildName, "serverIconUrl": guildIcon, "decorationUrl": decorationUrl, "nameplateUrl": nameplateUrl, "client:component-hydration": "only", "data-astro-cid-cj2mkyrz": true, "client:component-path": "/home/runner/work/petto-web/petto-web/src/react/cards/CardsApp", "client:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`${renderComponent($$result3, "SkeletonBlocks", $$SkeletonBlocks, { "slot": "fallback", "variant": "editor", "data-astro-cid-cj2mkyrz": true })}` })} </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCards.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Cards = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Cards;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  if (!botToken || !getEnv(Astro2, "PETTO_BOT_API_URL") || !getEnv(Astro2, "PETTO_BOT_API_SECRET")) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const guildInfo = await getGuildInfo(id, botToken);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const selected = new URL(Astro2.request.url).searchParams.get("name") ?? "";
  return renderTemplate`${renderComponent($$result, "DashCards", $$DashCards, { "user": auth.session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "selected": selected })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/cards.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/cards.astro";
const $$url = "/dash/guild/[id]/cards";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cards,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
