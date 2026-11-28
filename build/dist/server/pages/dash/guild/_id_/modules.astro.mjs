import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { i as isStillNew } from '../../../../chunks/Base_Di2YHjFe.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { G as GUIDE, M as MODULES, C as CATEGORIES } from '../../../../chunks/dashModules_DtUifSkd.mjs';
/* empty css                                            */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { k as getGuildDetails, d as guildIconUrl } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { l as loadModuleStatuses } from '../../../../chunks/moduleStatuses_a5libdxg.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashModules = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashModules;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, statuses } = Astro2.props;
  const steps = GUIDE.map((step) => ({ ...step, mod: MODULES.find((m) => m.id === step.module), state: statuses[step.module]?.state }));
  const known = steps.filter((s) => s.state);
  const done = known.filter((s) => s.state === "on").length;
  const pct = known.length ? Math.round(done / known.length * 100) : 0;
  const next = steps.find((s) => s.state === "todo");
  const inCategory = (id) => MODULES.filter((m) => m.category === id).length;
  const toSetUp = MODULES.filter((m) => statuses[m.id]?.state === "todo").length;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "modules", "pageTitle": "Modules", "data-astro-cid-v5jrsiji": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", "<h1 data-astro-cid-v5jrsiji>", '</h1> <section class="md-guide" aria-labelledby="md-guide-title" data-astro-cid-v5jrsiji> <div class="md-guide-top" data-astro-cid-v5jrsiji> <div data-astro-cid-v5jrsiji> <h2 id="md-guide-title" data-astro-cid-v5jrsiji>', '</h2> <p class="md-guide-sub" data-astro-cid-v5jrsiji>', '</p> </div> <div class="md-ring"', ' role="img"', " data-astro-cid-v5jrsiji><span data-astro-cid-v5jrsiji>", "/", '</span></div> </div> <div class="md-bar" aria-hidden="true" data-astro-cid-v5jrsiji><i', ' data-astro-cid-v5jrsiji></i></div> <ol class="md-steps" data-astro-cid-v5jrsiji> ', " </ol> ", ' </section> <div class="md-tools" data-astro-cid-v5jrsiji> <label class="md-search" data-astro-cid-v5jrsiji>', '<input type="search" id="md-search"', ' autocomplete="off" data-astro-cid-v5jrsiji><kbd data-astro-cid-v5jrsiji>/</kbd></label> <div class="md-chips" id="md-chips" role="tablist" data-astro-cid-v5jrsiji> <button type="button" class="md-chip on" data-cat="all" data-astro-cid-v5jrsiji>', '<span class="md-chip-n" data-astro-cid-v5jrsiji>', "</span></button> ", ' <button type="button" class="md-chip" data-cat="todo" data-astro-cid-v5jrsiji>', '<span class="md-chip-n" data-astro-cid-v5jrsiji>', '</span></button> </div> </div> <div class="md-grid dgl-stagger" id="md-grid" data-astro-cid-v5jrsiji> ', ' </div> <p class="md-empty" id="md-empty" hidden data-astro-cid-v5jrsiji>', "", "</p> <script>\n    (function () {\n      var grid = document.getElementById('md-grid');\n      if (!grid) return;\n      var input = document.getElementById('md-search');\n      var chips = Array.prototype.slice.call(document.querySelectorAll('#md-chips .md-chip'));\n      var empty = document.getElementById('md-empty');\n      var cards = Array.prototype.slice.call(grid.querySelectorAll('.md-card'));\n      var cat = 'all';\n      function apply() {\n        var q = (input.value || '').trim().toLowerCase();\n        var shown = 0;\n        cards.forEach(function (card) {\n          var okCat = cat === 'all' || (cat === 'todo' ? card.getAttribute('data-state') === 'todo' : card.getAttribute('data-cat') === cat);\n          var okText = !q || card.getAttribute('data-text').indexOf(q) !== -1;\n          var show = okCat && okText;\n          card.hidden = !show;\n          if (show) shown += 1;\n        });\n        if (empty) empty.hidden = shown !== 0;\n      }\n      chips.forEach(function (chip) {\n        chip.addEventListener('click', function () {\n          cat = chip.getAttribute('data-cat');\n          chips.forEach(function (c) { c.classList.toggle('on', c === chip); });\n          apply();\n        });\n      });\n      input.addEventListener('input', apply);\n      if (!window.__mdSlash) {\n        window.__mdSlash = true;\n        document.addEventListener('keydown', function (e) {\n          var field = document.getElementById('md-search');\n          if (e.key === '/' && field && document.activeElement !== field && !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '')) {\n            e.preventDefault();\n            field.focus();\n          }\n        });\n      }\n    })();\n  <\/script> "])), maybeRenderHead(), dt("Modules"), dt("Setup guide"), done === known.length && known.length > 0 ? dt("Everything on the guide is ready. Look for more below.") : dt("A few steps leave the server ready."), addAttribute(`--p:${pct}`, "style"), addAttribute(`${pct}%`, "aria-label"), done, known.length || steps.length, addAttribute(`width:${pct}%`, "style"), steps.map((s) => renderTemplate`<li${addAttribute(["md-step", { done: s.state === "on", next: next && next.id === s.id }], "class:list")} data-astro-cid-v5jrsiji> <a${addAttribute(s.mod.href(guildId), "href")} data-astro-cid-v5jrsiji> <span class="md-check" data-astro-cid-v5jrsiji>${s.state === "on" ? renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-v5jrsiji": true })}` : null}</span> <span class="md-step-text" data-astro-cid-v5jrsiji><strong data-astro-cid-v5jrsiji>${dt(s.label)}</strong><span data-astro-cid-v5jrsiji>${dt(s.hint)}</span></span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right-bold", "width": "12", "height": "12", "class": "md-step-go", "data-astro-cid-v5jrsiji": true })} </a> </li>`), next && renderTemplate`<a class="btn btn-accent btn-sm md-next"${addAttribute(next.mod.href(guildId), "href")} data-astro-cid-v5jrsiji>${dt("Next step")}: ${dt(next.label)}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "12", "height": "12", "data-astro-cid-v5jrsiji": true })}</a>`, renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "14", "height": "14", "data-astro-cid-v5jrsiji": true }), addAttribute(dt("Search modules..."), "placeholder"), dt("All"), MODULES.length, CATEGORIES.map((c) => renderTemplate`<button type="button" class="md-chip"${addAttribute(c.id, "data-cat")} data-astro-cid-v5jrsiji>${dt(c.label)}<span class="md-chip-n" data-astro-cid-v5jrsiji>${inCategory(c.id)}</span></button>`), dt("To set up"), toSetUp, MODULES.map((m) => {
    const st = statuses[m.id];
    return renderTemplate`<a class="md-card"${addAttribute(m.href(guildId), "href")}${addAttribute(m.category, "data-cat")}${addAttribute(st?.state ?? "info", "data-state")}${addAttribute(`${dt(m.title)} ${dt(m.desc)}`.toLowerCase(), "data-text")}${addAttribute(`--c:${m.color}`, "style")} data-astro-cid-v5jrsiji> <span class="md-card-icon" data-astro-cid-v5jrsiji>${renderComponent($$result2, "Icon", $$Icon, { "name": m.icon, "width": "18", "height": "18", "data-astro-cid-v5jrsiji": true })}</span> <span class="md-card-body" data-astro-cid-v5jrsiji> <span class="md-card-title" data-astro-cid-v5jrsiji>${dt(m.title)}${isStillNew(m.since) && renderTemplate`<em class="md-new" data-astro-cid-v5jrsiji>${dt("New")}</em>`}</span> <span class="md-card-desc" data-astro-cid-v5jrsiji>${dt(m.desc)}</span> </span> ${st && renderTemplate`<span${addAttribute(["md-pill", st.state], "class:list")} data-astro-cid-v5jrsiji>${st.state === "on" ? st.note ? st.note : dt("On") : dt("Set up")}</span>`} </a>`;
  }), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass", "width": "16", "height": "16", "data-astro-cid-v5jrsiji": true }), dt("No modules match.")) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashModules.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Modules = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Modules;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const guild = await getGuildDetails(id, botToken);
  if (!guild) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const { statuses } = await loadModuleStatuses(apiUrl, apiKey, id);
  return renderTemplate`${renderComponent($$result, "DashModules", $$DashModules, { "user": session, "guildId": id, "guildName": guild.name, "guildIcon": guildIconUrl(guild) ?? "/assets/mascot-icon.webp", "statuses": statuses })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/modules.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/modules.astro";
const $$url = "/dash/guild/[id]/modules";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Modules,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
