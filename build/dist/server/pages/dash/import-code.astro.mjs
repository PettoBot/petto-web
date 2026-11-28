import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashImportPick } from '../../chunks/DashImportPick_DZScXs1W.mjs';
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { c as canManageGuild, d as guildIconUrl } from '../../chunks/discord_CxeBz2tv.mjs';
import { b as getCachedUserGuilds, g as getCachedBotGuildIds } from '../../chunks/discordCache_CnRINZ-g.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { m as makeT, g as getDashLang } from '../../chunks/dash_CORIPvM-.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$ImportCode = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ImportCode;
  const dt = makeT(getDashLang(Astro2));
  const session = await getDashboardSession(Astro2);
  if (!session) return Astro2.redirect("/dash");
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  let guilds = [];
  let unavailable = false;
  try {
    const [userGuilds, botGuildIds] = await Promise.all([
      getCachedUserGuilds(session.accessToken, Astro2.request),
      botToken ? getCachedBotGuildIds(botToken, Astro2.request) : Promise.resolve(/* @__PURE__ */ new Set())
    ]);
    guilds = userGuilds.filter((g) => canManageGuild(g) && botGuildIds.has(g.id)).map((g) => ({ id: g.id, name: g.name, icon: guildIconUrl(g) })).sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    unavailable = true;
  }
  return renderTemplate`${renderComponent($$result, "DashImportPick", $$DashImportPick, { "user": session, "docTitle": dt("Import a command \xB7 Petto"), "title": dt("Choose the server for this command"), "noMessage": dt("No command came with this link. Open it again from the Code Generator."), "hint": dt("It opens Commands in code there, with the command in the editor. Nothing is saved until you press Save."), "page": "code", "guilds": guilds, "unavailable": unavailable })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/import-code.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/import-code.astro";
const $$url = "/dash/import-code";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ImportCode,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
