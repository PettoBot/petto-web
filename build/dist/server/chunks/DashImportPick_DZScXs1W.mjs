import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from './DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from './DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashPanelEmpty } from './DashPanelEmpty_Dm0QkRuf.mjs';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                               */

const $$Astro = createAstro("https://petto.sbs");
const $$DashImportPick = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashImportPick;
  const { user, title, noMessage, hint, page, guilds, unavailable } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "servers", "pageTitle": title, "data-astro-cid-3u3bqp6j": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="imp-wrap" data-astro-cid-3u3bqp6j> ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": title, "eyebrow": dt("Import"), "icon": "ph:download-simple-bold", "back": false, "data-astro-cid-3u3bqp6j": true })} <p class="imp-note imp-warn" data-imp-nomsg hidden data-astro-cid-3u3bqp6j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-3u3bqp6j": true })}${noMessage}</p> <p class="imp-note" data-astro-cid-3u3bqp6j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "15", "height": "15", "data-astro-cid-3u3bqp6j": true })}${hint}</p> ${unavailable && renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "tone": "error", "icon": "ph:cloud-slash-fill", "text": dt("Discord did not respond in time. Reload the page in a few seconds to load your servers again."), "data-astro-cid-3u3bqp6j": true })}`} ${!unavailable && guilds.length === 0 && renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:hard-drives-fill", "text": dt("Petto is not in any server you can manage yet."), "data-astro-cid-3u3bqp6j": true }, { "default": ($$result3) => renderTemplate` <a class="btn btn-ghost btn-sm" href="/dash/manage" data-astro-cid-3u3bqp6j>${dt("Manage servers")}</a> ` })}`} ${guilds.length > 0 && renderTemplate`<div class="imp-list dgl-stagger" data-astro-cid-3u3bqp6j> ${guilds.map((g) => renderTemplate`<a class="imp-item" data-imp-link${addAttribute(`/dash/guild/${g.id}/${page}`, "href")} data-astro-cid-3u3bqp6j> ${g.icon ? renderTemplate`<img${addAttribute(g.icon, "src")} alt="" loading="lazy" data-astro-cid-3u3bqp6j>` : renderTemplate`<span class="imp-fallback" data-astro-cid-3u3bqp6j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "16", "height": "16", "data-astro-cid-3u3bqp6j": true })}</span>`} <span class="imp-name" data-astro-cid-3u3bqp6j>${g.name}</span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right", "width": "15", "height": "15", "class": "imp-go", "data-astro-cid-3u3bqp6j": true })} </a>`)} </div>`} </div> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashImportPick.astro", void 0);

export { $$DashImportPick as $ };
