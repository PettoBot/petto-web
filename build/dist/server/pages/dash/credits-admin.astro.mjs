import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashPanelEmpty } from '../../chunks/DashPanelEmpty_Dm0QkRuf.mjs';
import { m as makeT, g as getDashLang } from '../../chunks/dash_CORIPvM-.mjs';
import { C as CREDIT_KINDS, c as canEditCredits, s as startCustomCredits, r as readCreditForm, a as addCredit, u as updateCredit, b as removeCredit, t as toggleCredit, m as moveCredit, d as resetCredits, e as readCredits, D as DEFAULT_CREDITS } from '../../chunks/credits_D_0No7l_.mjs';
/* empty css                                            */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { r as resolveLogo } from '../../chunks/partners_BiJzadVG.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashCreditsAdmin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashCreditsAdmin;
  const dt = makeT(getDashLang(Astro2));
  const { user, credits, custom, error, saved = false } = Astro2.props;
  const kindLabels = {
    people: dt("People"),
    features: dt("Features"),
    data: dt("Data sources"),
    systems: dt("Systems"),
    tools: dt("Tools and libraries"),
    art: dt("Art and icons"),
    other: dt("And more")
  };
  const errors = {
    invalid: dt("That request was not valid."),
    name: dt("Write the name of the credit."),
    url: dt("The link has to start with https://."),
    logo: dt("The logo link has to start with https://."),
    invite: dt("That invite could not be read, or its server has no icon. Paste a direct link to the picture instead."),
    album: dt("An Imgur album cannot be used. Open the picture and copy its link (i.imgur.com/...)."),
    full: dt("There can be up to 300 credits."),
    database: dt("The database did not accept the change. Try again."),
    not_configured: dt("The dashboard is not connected to the bot database.")
  };
  const groups = CREDIT_KINDS.map((kind) => ({ kind, items: credits.filter((credit) => credit.kind === kind) }));
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-credits", "pageTitle": "Credits", "data-astro-cid-yxffi2xy": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="pe-wrap" data-astro-cid-yxffi2xy> ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Credits"), "eyebrow": dt("Staff"), "icon": "ph:heart-fill", "back": false, "data-astro-cid-yxffi2xy": true }, { "default": ($$result3) => renderTemplate` <a class="btn btn-ghost btn-sm" href="/credits" target="_blank" rel="noopener" data-astro-cid-yxffi2xy>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrow-square-out", "width": "14", "height": "14", "data-astro-cid-yxffi2xy": true })} ${dt("See the page")}</a> ` })} ${error && renderTemplate`<div class="pe-alert error" data-astro-cid-yxffi2xy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-yxffi2xy": true })} ${errors[error] ?? errors.invalid}</div>`} ${saved && !error && renderTemplate`<div class="pe-alert success" data-astro-cid-yxffi2xy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "data-astro-cid-yxffi2xy": true })} ${dt("Saved.")}</div>`} ${!custom && renderTemplate`<div class="pe-banner" data-astro-cid-yxffi2xy> <p data-astro-cid-yxffi2xy>${dt("The page shows the original list. Start editing to save it, then change it as you like.")}</p> <form method="POST" data-no-dirty data-astro-cid-yxffi2xy><input type="hidden" name="action" value="start" data-astro-cid-yxffi2xy><button class="btn btn-primary btn-sm" type="submit" data-astro-cid-yxffi2xy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "14", "height": "14", "data-astro-cid-yxffi2xy": true })} ${dt("Start editing")}</button></form> </div>`} ${custom && renderTemplate`<details class="pe-card pe-add"${addAttribute(credits.length === 0, "open")} data-astro-cid-yxffi2xy> <summary data-astro-cid-yxffi2xy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-yxffi2xy": true })} ${dt("Add a credit")}</summary> <form method="POST" class="pe-form" data-no-dirty data-astro-cid-yxffi2xy> <input type="hidden" name="action" value="add" data-astro-cid-yxffi2xy> <label data-astro-cid-yxffi2xy>${dt("Type")}<select name="kind" data-astro-cid-yxffi2xy>${CREDIT_KINDS.map((kind) => renderTemplate`<option${addAttribute(kind, "value")} data-astro-cid-yxffi2xy>${kindLabels[kind]}</option>`)}</select></label> <label data-astro-cid-yxffi2xy>${dt("Name")}<input name="name" maxlength="80" required data-astro-cid-yxffi2xy></label> <label data-astro-cid-yxffi2xy>${dt("Link (optional)")}<input name="url" type="url" placeholder="https://…" maxlength="300" data-astro-cid-yxffi2xy></label> <label data-astro-cid-yxffi2xy>${dt("Logo link (optional)")}<input name="logo_url" type="url" placeholder="https://…" maxlength="400" data-astro-cid-yxffi2xy><small data-astro-cid-yxffi2xy>${dt("A link to the picture (.png, .jpg, .webp), an Imgur link, or a Discord invite to use the icon of its server.")}</small></label> <label class="wide" data-astro-cid-yxffi2xy>${dt("Description (English)")}<textarea name="description_en" rows="2" maxlength="600" data-astro-cid-yxffi2xy></textarea></label> <label class="wide" data-astro-cid-yxffi2xy>${dt("Description (Spanish, optional)")}<textarea name="description_es" rows="2" maxlength="600" data-astro-cid-yxffi2xy></textarea></label> <label class="wide" data-astro-cid-yxffi2xy>${dt("Description (Portuguese, optional)")}<textarea name="description_pt" rows="2" maxlength="600" data-astro-cid-yxffi2xy></textarea></label> <button class="btn btn-primary btn-sm" type="submit" data-astro-cid-yxffi2xy>${dt("Add")}</button> </form> </details>`} ${custom && groups.map((group) => group.items.length > 0 && renderTemplate`<div class="pe-group" data-astro-cid-yxffi2xy> <h2 data-astro-cid-yxffi2xy>${kindLabels[group.kind]} <span data-astro-cid-yxffi2xy>${group.items.length}</span></h2> <div class="pe-list dgl-stagger" data-astro-cid-yxffi2xy> ${group.items.map((credit) => renderTemplate`<details${addAttribute(["pe-card", { "pe-hidden": !credit.visible }], "class:list")} data-astro-cid-yxffi2xy> <summary data-astro-cid-yxffi2xy> ${credit.logo_url ? renderTemplate`<img${addAttribute(credit.logo_url, "src")} alt="" width="28" height="28" data-astro-cid-yxffi2xy>` : renderTemplate`<span class="pe-letter" data-astro-cid-yxffi2xy>${credit.name.slice(0, 1).toUpperCase()}</span>`} <span class="pe-sum" data-astro-cid-yxffi2xy><b data-astro-cid-yxffi2xy>${credit.name}</b>${credit.description_en && renderTemplate`<small data-astro-cid-yxffi2xy>${credit.description_en}</small>`}</span> ${!credit.visible && renderTemplate`<i class="pe-tag pe-tag-off" data-astro-cid-yxffi2xy>${dt("Hidden")}</i>`} ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down", "width": "14", "height": "14", "class": "pe-caret", "data-astro-cid-yxffi2xy": true })} </summary> <form method="POST" class="pe-form" data-astro-cid-yxffi2xy> <input type="hidden" name="action" value="update" data-astro-cid-yxffi2xy><input type="hidden" name="id"${addAttribute(credit.id, "value")} data-astro-cid-yxffi2xy> <label data-astro-cid-yxffi2xy>${dt("Type")}<select name="kind" data-astro-cid-yxffi2xy>${CREDIT_KINDS.map((kind) => renderTemplate`<option${addAttribute(kind, "value")}${addAttribute(kind === credit.kind, "selected")} data-astro-cid-yxffi2xy>${kindLabels[kind]}</option>`)}</select></label> <label data-astro-cid-yxffi2xy>${dt("Name")}<input name="name"${addAttribute(credit.name, "value")} maxlength="80" required data-astro-cid-yxffi2xy></label> <label data-astro-cid-yxffi2xy>${dt("Link (optional)")}<input name="url" type="url"${addAttribute(credit.url ?? "", "value")} maxlength="300" data-astro-cid-yxffi2xy></label> <label data-astro-cid-yxffi2xy>${dt("Logo link (optional)")}<input name="logo_url" type="url"${addAttribute(credit.logo_url ?? "", "value")} maxlength="400" data-astro-cid-yxffi2xy><small data-astro-cid-yxffi2xy>${dt("A link to the picture (.png, .jpg, .webp), an Imgur link, or a Discord invite to use the icon of its server.")}</small></label> <label class="wide" data-astro-cid-yxffi2xy>${dt("Description (English)")}<textarea name="description_en" rows="2" maxlength="600" data-astro-cid-yxffi2xy>${credit.description_en}</textarea></label> <label class="wide" data-astro-cid-yxffi2xy>${dt("Description (Spanish, optional)")}<textarea name="description_es" rows="2" maxlength="600" data-astro-cid-yxffi2xy>${credit.description_es}</textarea></label> <label class="wide" data-astro-cid-yxffi2xy>${dt("Description (Portuguese, optional)")}<textarea name="description_pt" rows="2" maxlength="600" data-astro-cid-yxffi2xy>${credit.description_pt}</textarea></label> <button class="btn btn-primary btn-sm" type="submit" data-keep data-astro-cid-yxffi2xy>${dt("Save")}</button> </form> <div class="pe-row-actions" data-astro-cid-yxffi2xy> <form method="POST" data-no-dirty data-astro-cid-yxffi2xy><input type="hidden" name="id"${addAttribute(credit.id, "value")} data-astro-cid-yxffi2xy><button class="btn btn-ghost btn-sm" name="action" value="up" type="submit" data-astro-cid-yxffi2xy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-up", "width": "13", "height": "13", "data-astro-cid-yxffi2xy": true })} ${dt("Up")}</button></form> <form method="POST" data-no-dirty data-astro-cid-yxffi2xy><input type="hidden" name="id"${addAttribute(credit.id, "value")} data-astro-cid-yxffi2xy><button class="btn btn-ghost btn-sm" name="action" value="down" type="submit" data-astro-cid-yxffi2xy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-down", "width": "13", "height": "13", "data-astro-cid-yxffi2xy": true })} ${dt("Down")}</button></form> <form method="POST" data-no-dirty data-astro-cid-yxffi2xy><input type="hidden" name="id"${addAttribute(credit.id, "value")} data-astro-cid-yxffi2xy><button class="btn btn-ghost btn-sm" name="action" value="toggle" type="submit" data-astro-cid-yxffi2xy>${credit.visible ? dt("Hide") : dt("Show")}</button></form> <form method="POST" data-no-dirty${addAttribute(dt("Remove this credit?"), "data-confirm")} data-astro-cid-yxffi2xy><input type="hidden" name="id"${addAttribute(credit.id, "value")} data-astro-cid-yxffi2xy><button class="btn btn-ghost btn-sm pe-danger" name="action" value="remove" type="submit" data-astro-cid-yxffi2xy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash", "width": "13", "height": "13", "data-astro-cid-yxffi2xy": true })} ${dt("Remove")}</button></form> </div> </details>`)} </div> </div>`)} ${custom && credits.length === 0 && renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:heart-fill", "text": dt("Nothing here yet. Add the first one above."), "data-astro-cid-yxffi2xy": true })}`} ${custom && renderTemplate`<form method="POST" class="pe-reset" data-no-dirty${addAttribute(dt("Delete every saved credit and go back to the original list?"), "data-confirm")} data-astro-cid-yxffi2xy> <input type="hidden" name="action" value="reset" data-astro-cid-yxffi2xy> <button class="btn btn-ghost btn-sm pe-danger" type="submit" data-astro-cid-yxffi2xy>${dt("Go back to the original list")}</button> </form>`} </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCreditsAdmin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$CreditsAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CreditsAdmin;
  const session = await getDashboardSession(Astro2);
  if (!session) return Astro2.redirect("/dash");
  if (!await canEditCredits(Astro2, session.userId)) return Astro2.redirect("/dash/manage?error=forbidden");
  if (!getEnv(Astro2, "PETTO_BOT_API_URL")) return Astro2.redirect("/dash/manage?error=server_not_configured");
  if (Astro2.request.method.toUpperCase() === "POST") {
    const origin = Astro2.request.headers.get("origin");
    if (origin && origin !== Astro2.url.origin) return Astro2.redirect("/dash/credits-admin?error=invalid");
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const id = Number(form.get("id"));
    let result = { ok: false, error: "invalid" };
    if (action === "start") result = await startCustomCredits(Astro2);
    else if (action === "add" || action === "update") {
      const read = readCreditForm(form);
      if (!read.ok) result = read;
      else {
        const logo = await resolveLogo(read.value.logo_url ?? "");
        if ("error" in logo) result = { ok: false, error: logo.error };
        else {
          const value = { ...read.value, logo_url: logo.url };
          result = action === "add" ? await addCredit(Astro2, value) : await updateCredit(Astro2, id, value);
        }
      }
    } else if (action === "remove") result = await removeCredit(Astro2, id);
    else if (action === "toggle") result = await toggleCredit(Astro2, id);
    else if (action === "up" || action === "down") result = await moveCredit(Astro2, id, action);
    else if (action === "reset") result = await resetCredits(Astro2);
    return Astro2.redirect(`/dash/credits-admin?${result.ok ? "saved=1" : `error=${"error" in result ? result.error : "invalid"}`}`);
  }
  const rows = await readCredits(Astro2);
  const custom = Boolean(rows && rows.length);
  const credits = custom ? rows : DEFAULT_CREDITS;
  const error = Astro2.url.searchParams.get("error") ?? void 0;
  const saved = Astro2.url.searchParams.get("saved") === "1";
  return renderTemplate`${renderComponent($$result, "DashCreditsAdmin", $$DashCreditsAdmin, { "user": session, "credits": credits, "custom": custom, "error": error, "saved": saved })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/credits-admin.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/credits-admin.astro";
const $$url = "/dash/credits-admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CreditsAdmin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
