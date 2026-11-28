import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashPanelEmpty } from '../../chunks/DashPanelEmpty_Dm0QkRuf.mjs';
import { m as makeT, g as getDashLang } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                           */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { c as canEditPartners } from '../../chunks/partners_BiJzadVG.mjs';
import { a as approveClaim, d as denyClaim, r as releaseName, l as listClaims, b as listNames, h as holderOf } from '../../chunks/appealNames_D_aJJczg.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashAppealNames = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashAppealNames;
  const dt = makeT(getDashLang(Astro2));
  const { user, tab, pending, decided, names, holders, query, error, done } = Astro2.props;
  const errors = {
    invalid: dt("That request was not valid."),
    gone: dt("That request was already answered or no longer exists."),
    database: dt("The database did not accept the change. Try again.")
  };
  const doneText = { approved: dt("The name was given to the server that asked."), denied: dt("The request was denied."), released: dt("The name was released.") };
  const hours = (iso) => Math.floor((Date.now() - Date.parse(iso)) / 36e5);
  const waited = (iso) => {
    const h = hours(iso);
    return h < 1 ? dt("Less than an hour ago") : h < 48 ? dt("{n} hours ago").replace("{n}", String(h)) : dt("{n} days ago").replace("{n}", String(Math.floor(h / 24)));
  };
  const page = (guildId) => `/appeal/${guildId}`;
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-appeals", "pageTitle": "Appeal names", "data-astro-cid-n4o5tqfk": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="an-wrap" data-astro-cid-n4o5tqfk> ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Appeal names"), "eyebrow": dt("Staff"), "icon": "ph:scales-fill", "back": false, "data-astro-cid-n4o5tqfk": true })} ${error && renderTemplate`<div class="an-alert error" data-astro-cid-n4o5tqfk>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-n4o5tqfk": true })} ${errors[error] ?? errors.invalid}</div>`} ${done && !error && renderTemplate`<div class="an-alert ok" data-astro-cid-n4o5tqfk>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "data-astro-cid-n4o5tqfk": true })} ${doneText[done] ?? dt("Saved.")}</div>`} <div class="an-tabs" data-astro-cid-n4o5tqfk> <a${addAttribute(["an-tab", { on: tab === "requests" }], "class:list")} href="?tab=requests" data-sk="list"${addAttribute(tab === "requests" ? "page" : void 0, "aria-current")} data-astro-cid-n4o5tqfk>${dt("Requests")}${pending.length > 0 && renderTemplate`<em data-astro-cid-n4o5tqfk>${pending.length}</em>`}</a> <a${addAttribute(["an-tab", { on: tab === "names" }], "class:list")} href="?tab=names" data-sk="list"${addAttribute(tab === "names" ? "page" : void 0, "aria-current")} data-astro-cid-n4o5tqfk>${dt("Names in use")}</a> </div> ${tab === "requests" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${pending.length === 0 && renderTemplate`${renderComponent($$result3, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:check-circle-fill", "text": dt("No requests waiting."), "data-astro-cid-n4o5tqfk": true })}`}<div class="an-stack dgl-stagger" data-astro-cid-n4o5tqfk> ${pending.map((claim) => renderTemplate`<article${addAttribute(["an-card", { late: hours(claim.created_at) >= 72 }], "class:list")} data-astro-cid-n4o5tqfk> <div class="an-top" data-astro-cid-n4o5tqfk> <h2 data-astro-cid-n4o5tqfk><code data-astro-cid-n4o5tqfk>${claim.slug}</code></h2> <span${addAttribute(["an-when", { late: hours(claim.created_at) >= 72 }], "class:list")} data-astro-cid-n4o5tqfk>${waited(claim.created_at)}</span> </div> <dl class="an-meta" data-astro-cid-n4o5tqfk> <div data-astro-cid-n4o5tqfk><dt data-astro-cid-n4o5tqfk>${dt("Asked by")}</dt><dd data-astro-cid-n4o5tqfk>${claim.username} <code data-astro-cid-n4o5tqfk>${claim.user_id}</code></dd></div> <div data-astro-cid-n4o5tqfk><dt data-astro-cid-n4o5tqfk>${dt("Server that asks")}</dt><dd data-astro-cid-n4o5tqfk><a${addAttribute(page(claim.guild_id), "href")} target="_blank" rel="noopener" data-astro-cid-n4o5tqfk>${claim.guild_id}</a> · <a${addAttribute(claim.server_url, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-n4o5tqfk>${dt("Look at the server")}</a></dd></div> <div data-astro-cid-n4o5tqfk><dt data-astro-cid-n4o5tqfk>${dt("Server that holds it")}</dt><dd data-astro-cid-n4o5tqfk>${holders[claim.slug] ? renderTemplate`<a${addAttribute(page(holders[claim.slug]), "href")} target="_blank" rel="noopener" data-astro-cid-n4o5tqfk>${holders[claim.slug]}</a>` : dt("Nobody now")}</dd></div> ${claim.extra_url && renderTemplate`<div data-astro-cid-n4o5tqfk><dt data-astro-cid-n4o5tqfk>${dt("Extra proof")}</dt><dd data-astro-cid-n4o5tqfk><a${addAttribute(claim.extra_url, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-n4o5tqfk>${claim.extra_url}</a></dd></div>`} </dl> <p class="an-reason" data-astro-cid-n4o5tqfk>${claim.reason}</p> <form method="POST" class="an-decide" data-no-dirty data-astro-cid-n4o5tqfk> <input type="hidden" name="claim_id"${addAttribute(claim.id, "value")} data-astro-cid-n4o5tqfk> <textarea name="note" rows="2" class="dgl-autogrow" maxlength="500"${addAttribute(dt("A note for the server (optional)"), "placeholder")} data-astro-cid-n4o5tqfk></textarea> <button type="submit" name="action" value="approve" class="btn btn-accent btn-sm"${addAttribute(dt("The current holder goes back to its server id link and the name goes to the server that asked. Continue?"), "data-confirm")} data-confirm-tone="neutral" data-astro-cid-n4o5tqfk>${dt("Give the name")}</button> <button type="submit" name="action" value="deny" class="btn btn-ghost btn-sm" data-astro-cid-n4o5tqfk>${dt("Deny")}</button> </form> </article>`)} </div> ${decided.length > 0 && renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate` <h2 class="an-sub" data-astro-cid-n4o5tqfk>${dt("Answered recently")}</h2> <div class="an-stack" data-astro-cid-n4o5tqfk> ${decided.map((claim) => renderTemplate`<div class="an-row" data-astro-cid-n4o5tqfk> <span${addAttribute(["an-tag", claim.status], "class:list")} data-astro-cid-n4o5tqfk>${claim.status === "approved" ? dt("Given") : dt("Denied")}</span> <code data-astro-cid-n4o5tqfk>${claim.slug}</code> <span class="an-muted" data-astro-cid-n4o5tqfk>${claim.guild_id}${claim.decided_by_name ? ` \xB7 ${claim.decided_by_name}` : ""}</span> </div>`)} </div> ` })}`}` })}`} ${tab === "names" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <form method="GET" class="an-search" data-astro-cid-n4o5tqfk><input type="hidden" name="tab" value="names" data-astro-cid-n4o5tqfk><input type="search" name="q"${addAttribute(query, "value")} maxlength="32"${addAttribute(dt("Search a name"), "placeholder")} data-astro-cid-n4o5tqfk><button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-n4o5tqfk>${dt("Search")}</button></form> ${names.length === 0 && renderTemplate`${renderComponent($$result3, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:magnifying-glass", "text": dt("No names found."), "data-astro-cid-n4o5tqfk": true })}`}<div class="an-stack dgl-stagger" data-astro-cid-n4o5tqfk> ${names.map((row) => renderTemplate`<div class="an-row" data-astro-cid-n4o5tqfk> <a class="an-name"${addAttribute(`/appeal/${row.slug}`, "href")} target="_blank" rel="noopener" data-astro-cid-n4o5tqfk><code data-astro-cid-n4o5tqfk>${row.slug}</code></a> <span class="an-muted" data-astro-cid-n4o5tqfk>${row.guild_id} · ${row.enabled ? dt("Appeals on") : dt("Appeals off")}</span> <form method="POST" action="?tab=names" class="an-release" data-no-dirty${addAttribute(dt("Release this name? The server keeps its link with the server id."), "data-confirm")} data-astro-cid-n4o5tqfk> <input type="hidden" name="action" value="release" data-astro-cid-n4o5tqfk><input type="hidden" name="guild_id"${addAttribute(row.guild_id, "value")} data-astro-cid-n4o5tqfk> <button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-n4o5tqfk>${dt("Release")}</button> </form> </div>`)} </div> ` })}`} </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashAppealNames.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$AppealNames = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AppealNames;
  const session = await getDashboardSession(Astro2);
  if (!session) return Astro2.redirect("/dash");
  if (!await canEditPartners(Astro2, session.userId)) return Astro2.redirect("/dash/manage?error=forbidden");
  if (!getEnv(Astro2, "PETTO_BOT_API_URL")) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const tab = Astro2.url.searchParams.get("tab") === "names" ? "names" : "requests";
  if (Astro2.request.method.toUpperCase() === "POST") {
    const origin = Astro2.request.headers.get("origin");
    if (origin && origin !== Astro2.url.origin) return Astro2.redirect(`/dash/appeal-names?tab=${tab}&error=invalid`);
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const by = { id: session.userId, name: session.username };
    let result = "invalid";
    if (action === "approve") {
      const done2 = await approveClaim(Astro2, String(form.get("claim_id") ?? ""), by, String(form.get("note") ?? "").replace(/\r\n?/g, "\n"));
      result = "error" in done2 ? done2.error : "approved";
    } else if (action === "deny") {
      result = await denyClaim(Astro2, String(form.get("claim_id") ?? ""), by, String(form.get("note") ?? "").replace(/\r\n?/g, "\n")) ? "denied" : "gone";
    } else if (action === "release") {
      const guildId = String(form.get("guild_id") ?? "");
      result = /^\d{15,25}$/.test(guildId) && await releaseName(Astro2, guildId) ? "released" : "database";
    }
    const ok = ["approved", "denied", "released"].includes(result);
    return Astro2.redirect(`/dash/appeal-names?tab=${tab}&${ok ? `done=${result}` : `error=${result}`}`);
  }
  const query = String(Astro2.url.searchParams.get("q") ?? "").slice(0, 32);
  const [pending, decided, names] = await Promise.all([
    listClaims(Astro2, "pending"),
    tab === "requests" ? listClaims(Astro2, "decided") : Promise.resolve([]),
    tab === "names" ? listNames(Astro2, query) : Promise.resolve([])
  ]);
  const holders = {};
  await Promise.all(pending.map(async (claim) => {
    holders[claim.slug] = await holderOf(Astro2, claim.slug);
  }));
  const error = Astro2.url.searchParams.get("error") ?? void 0;
  const done = Astro2.url.searchParams.get("done") ?? void 0;
  return renderTemplate`${renderComponent($$result, "DashAppealNames", $$DashAppealNames, { "user": session, "tab": tab, "pending": pending, "decided": decided, "names": names, "holders": holders, "query": query, "error": error, "done": done })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/appeal-names.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/appeal-names.astro";
const $$url = "/dash/appeal-names";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AppealNames,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
