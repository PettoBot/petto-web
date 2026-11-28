import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashPanelEmpty } from '../../chunks/DashPanelEmpty_Dm0QkRuf.mjs';
import { m as makeT, g as getDashLang } from '../../chunks/dash_CORIPvM-.mjs';
import { P as PARTNER_KINDS, c as canEditPartners, s as startCustomPartners, a as readPartnerForm, r as resolveLogo, b as addPartner, u as updatePartner, d as removePartner, t as togglePartner, m as movePartner, e as resetPartners, f as readPartners, D as DEFAULT_PARTNERS } from '../../chunks/partners_BiJzadVG.mjs';
import { $ as $$PartnerIcon } from '../../chunks/PartnerIcon_DUwHRjdM.mjs';
/* empty css                                             */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashPartnersAdmin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashPartnersAdmin;
  const dt = makeT(getDashLang(Astro2));
  const { user, partners, custom, error, saved = false } = Astro2.props;
  const kindLabels = {
    hosting: dt("Hosting"),
    servers: dt("Servers"),
    apps: dt("Apps"),
    bots: dt("Bots"),
    communities: dt("Communities"),
    other: dt("Other")
  };
  const errors = {
    invalid: dt("That request was not valid."),
    name: dt("Write the name of the partner."),
    url: dt("The link has to start with https://."),
    logo: dt("The logo link has to start with https://."),
    invite: dt("That invite could not be read, or its server has no icon. Paste a direct link to the picture instead."),
    album: dt("An Imgur album cannot be used. Open the picture and copy its link (i.imgur.com/...)."),
    full: dt("There can be up to 200 partners."),
    database: dt("The database did not accept the change. Try again."),
    not_configured: dt("The dashboard is not connected to the bot database.")
  };
  const groups = PARTNER_KINDS.map((kind) => ({ kind, items: partners.filter((partner) => partner.kind === kind) }));
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-partners", "pageTitle": "Partners", "data-astro-cid-nwaxrcaa": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="pe-wrap" data-astro-cid-nwaxrcaa> ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Partners"), "eyebrow": dt("Staff"), "icon": "ph:handshake-fill", "back": false, "data-astro-cid-nwaxrcaa": true }, { "default": ($$result3) => renderTemplate` <a class="btn btn-ghost btn-sm" href="/partners" target="_blank" rel="noopener" data-astro-cid-nwaxrcaa>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrow-square-out", "width": "14", "height": "14", "data-astro-cid-nwaxrcaa": true })} ${dt("See the page")}</a> ` })} ${error && renderTemplate`<div class="pe-alert error" data-astro-cid-nwaxrcaa>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-nwaxrcaa": true })} ${errors[error] ?? errors.invalid}</div>`} ${saved && !error && renderTemplate`<div class="pe-alert success" data-astro-cid-nwaxrcaa>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "data-astro-cid-nwaxrcaa": true })} ${dt("Saved.")}</div>`} ${!custom && renderTemplate`<div class="pe-banner" data-astro-cid-nwaxrcaa> <p data-astro-cid-nwaxrcaa>${dt("The page shows the original list. Start editing to save it, then change it as you like.")}</p> <form method="POST" data-no-dirty data-astro-cid-nwaxrcaa><input type="hidden" name="action" value="start" data-astro-cid-nwaxrcaa><button class="btn btn-primary btn-sm" type="submit" data-astro-cid-nwaxrcaa>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "14", "height": "14", "data-astro-cid-nwaxrcaa": true })} ${dt("Start editing")}</button></form> </div>`} ${custom && renderTemplate`<details class="pe-card pe-add"${addAttribute(partners.length === 0, "open")} data-astro-cid-nwaxrcaa> <summary data-astro-cid-nwaxrcaa>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-nwaxrcaa": true })} ${dt("Add a partner")}</summary> <form method="POST" class="pe-form" data-no-dirty data-astro-cid-nwaxrcaa> <input type="hidden" name="action" value="add" data-astro-cid-nwaxrcaa> <label data-astro-cid-nwaxrcaa>${dt("Type")}<select name="kind" data-astro-cid-nwaxrcaa>${PARTNER_KINDS.map((kind) => renderTemplate`<option${addAttribute(kind, "value")} data-astro-cid-nwaxrcaa>${kindLabels[kind]}</option>`)}</select></label> <label data-astro-cid-nwaxrcaa>${dt("Name")}<input name="name" maxlength="60" required data-astro-cid-nwaxrcaa></label> <label data-astro-cid-nwaxrcaa>${dt("Link")}<input name="url" type="text" inputmode="url" placeholder="https://…" maxlength="300" required data-astro-cid-nwaxrcaa></label> <label data-astro-cid-nwaxrcaa>${dt("Logo link (optional)")}<input name="logo_url" type="text" inputmode="url" placeholder="https://…" maxlength="400" data-astro-cid-nwaxrcaa><small data-astro-cid-nwaxrcaa>${dt("A link to the picture (.png, .jpg, .webp), an Imgur link, or a Discord invite to use the icon of its server.")}</small></label> <label class="wide" data-astro-cid-nwaxrcaa>${dt("Description (English)")}<textarea name="description_en" rows="2" maxlength="500" data-astro-cid-nwaxrcaa></textarea></label> <label class="wide" data-astro-cid-nwaxrcaa>${dt("Description (Spanish, optional)")}<textarea name="description_es" rows="2" maxlength="500" data-astro-cid-nwaxrcaa></textarea></label> <label class="wide" data-astro-cid-nwaxrcaa>${dt("Description (Portuguese, optional)")}<textarea name="description_pt" rows="2" maxlength="500" data-astro-cid-nwaxrcaa></textarea></label> <label class="check" data-astro-cid-nwaxrcaa><input type="checkbox" name="is_primary" data-astro-cid-nwaxrcaa> ${dt("Primary partner")}</label> <button class="btn btn-primary btn-sm" type="submit" data-astro-cid-nwaxrcaa>${dt("Add")}</button> </form> </details>`} ${custom && groups.map((group) => group.items.length > 0 && renderTemplate`<div class="pe-group" data-astro-cid-nwaxrcaa> <h2 data-astro-cid-nwaxrcaa>${kindLabels[group.kind]} <span data-astro-cid-nwaxrcaa>${group.items.length}</span></h2> <div class="pe-list dgl-stagger" data-astro-cid-nwaxrcaa> ${group.items.map((partner) => renderTemplate`<details${addAttribute(["pe-card", { "pe-hidden": !partner.visible }], "class:list")} data-astro-cid-nwaxrcaa> <summary data-astro-cid-nwaxrcaa> ${renderComponent($$result2, "PartnerIcon", $$PartnerIcon, { "partner": partner, "prefix": "pe", "size": 28, "data-astro-cid-nwaxrcaa": true })} <span class="pe-sum" data-astro-cid-nwaxrcaa><b data-astro-cid-nwaxrcaa>${partner.name}</b>${partner.description_en && renderTemplate`<small data-astro-cid-nwaxrcaa>${partner.description_en}</small>`}</span> ${partner.is_primary && renderTemplate`<i class="pe-tag" data-astro-cid-nwaxrcaa>${dt("Primary")}</i>`} ${!partner.visible && renderTemplate`<i class="pe-tag pe-tag-off" data-astro-cid-nwaxrcaa>${dt("Hidden")}</i>`} ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down", "width": "14", "height": "14", "class": "pe-caret", "data-astro-cid-nwaxrcaa": true })} </summary> <form method="POST" class="pe-form" data-astro-cid-nwaxrcaa> <input type="hidden" name="action" value="update" data-astro-cid-nwaxrcaa><input type="hidden" name="id"${addAttribute(partner.id, "value")} data-astro-cid-nwaxrcaa> <label data-astro-cid-nwaxrcaa>${dt("Type")}<select name="kind" data-astro-cid-nwaxrcaa>${PARTNER_KINDS.map((kind) => renderTemplate`<option${addAttribute(kind, "value")}${addAttribute(kind === partner.kind, "selected")} data-astro-cid-nwaxrcaa>${kindLabels[kind]}</option>`)}</select></label> <label data-astro-cid-nwaxrcaa>${dt("Name")}<input name="name"${addAttribute(partner.name, "value")} maxlength="60" required data-astro-cid-nwaxrcaa></label> <label data-astro-cid-nwaxrcaa>${dt("Link")}<input name="url" type="text" inputmode="url"${addAttribute(partner.url, "value")} maxlength="300" required data-astro-cid-nwaxrcaa></label> <label data-astro-cid-nwaxrcaa>${dt("Logo link (optional)")}<input name="logo_url" type="text" inputmode="url"${addAttribute(partner.logo_url ?? "", "value")} maxlength="400" data-astro-cid-nwaxrcaa><small data-astro-cid-nwaxrcaa>${dt("A link to the picture (.png, .jpg, .webp), an Imgur link, or a Discord invite to use the icon of its server.")}</small></label> <label class="wide" data-astro-cid-nwaxrcaa>${dt("Description (English)")}<textarea name="description_en" rows="2" maxlength="500" data-astro-cid-nwaxrcaa>${partner.description_en}</textarea></label> <label class="wide" data-astro-cid-nwaxrcaa>${dt("Description (Spanish, optional)")}<textarea name="description_es" rows="2" maxlength="500" data-astro-cid-nwaxrcaa>${partner.description_es}</textarea></label> <label class="wide" data-astro-cid-nwaxrcaa>${dt("Description (Portuguese, optional)")}<textarea name="description_pt" rows="2" maxlength="500" data-astro-cid-nwaxrcaa>${partner.description_pt}</textarea></label> <label class="check" data-astro-cid-nwaxrcaa><input type="checkbox" name="is_primary"${addAttribute(partner.is_primary, "checked")} data-astro-cid-nwaxrcaa> ${dt("Primary partner")}</label> <button class="btn btn-primary btn-sm" type="submit" data-keep data-astro-cid-nwaxrcaa>${dt("Save")}</button> </form> <div class="pe-row-actions" data-astro-cid-nwaxrcaa> <form method="POST" data-no-dirty data-astro-cid-nwaxrcaa><input type="hidden" name="id"${addAttribute(partner.id, "value")} data-astro-cid-nwaxrcaa><button class="btn btn-ghost btn-sm" name="action" value="up" type="submit" data-astro-cid-nwaxrcaa>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-up", "width": "13", "height": "13", "data-astro-cid-nwaxrcaa": true })} ${dt("Up")}</button></form> <form method="POST" data-no-dirty data-astro-cid-nwaxrcaa><input type="hidden" name="id"${addAttribute(partner.id, "value")} data-astro-cid-nwaxrcaa><button class="btn btn-ghost btn-sm" name="action" value="down" type="submit" data-astro-cid-nwaxrcaa>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-down", "width": "13", "height": "13", "data-astro-cid-nwaxrcaa": true })} ${dt("Down")}</button></form> <form method="POST" data-no-dirty data-astro-cid-nwaxrcaa><input type="hidden" name="id"${addAttribute(partner.id, "value")} data-astro-cid-nwaxrcaa><button class="btn btn-ghost btn-sm" name="action" value="toggle" type="submit" data-astro-cid-nwaxrcaa>${partner.visible ? dt("Hide") : dt("Show")}</button></form> <form method="POST" data-no-dirty${addAttribute(dt("Remove this partner?"), "data-confirm")} data-astro-cid-nwaxrcaa><input type="hidden" name="id"${addAttribute(partner.id, "value")} data-astro-cid-nwaxrcaa><button class="btn btn-ghost btn-sm pe-danger" name="action" value="remove" type="submit" data-astro-cid-nwaxrcaa>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash", "width": "13", "height": "13", "data-astro-cid-nwaxrcaa": true })} ${dt("Remove")}</button></form> </div> </details>`)} </div> </div>`)} ${custom && partners.length === 0 && renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:handshake-fill", "text": dt("Nothing here yet. Add the first one above."), "data-astro-cid-nwaxrcaa": true })}`} ${custom && renderTemplate`<form method="POST" class="pe-reset" data-no-dirty${addAttribute(dt("Delete every saved partner and go back to the original list?"), "data-confirm")} data-astro-cid-nwaxrcaa> <input type="hidden" name="action" value="reset" data-astro-cid-nwaxrcaa> <button class="btn btn-ghost btn-sm pe-danger" type="submit" data-astro-cid-nwaxrcaa>${dt("Go back to the original list")}</button> </form>`} </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPartnersAdmin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$PartnersAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PartnersAdmin;
  const session = await getDashboardSession(Astro2);
  if (!session) return Astro2.redirect("/dash");
  if (!await canEditPartners(Astro2, session.userId)) return Astro2.redirect("/dash/manage?error=forbidden");
  if (!getEnv(Astro2, "PETTO_BOT_API_URL")) return Astro2.redirect("/dash/manage?error=server_not_configured");
  if (Astro2.request.method.toUpperCase() === "POST") {
    const origin = Astro2.request.headers.get("origin");
    if (origin && origin !== Astro2.url.origin) return Astro2.redirect("/dash/partners-admin?error=invalid");
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const id = Number(form.get("id"));
    let result = { ok: false, error: "invalid" };
    if (action === "start") result = await startCustomPartners(Astro2);
    else if (action === "add" || action === "update") {
      const read = readPartnerForm(form);
      if (!read.ok) result = read;
      else {
        const logo = await resolveLogo(read.value.logo_url ?? "", read.value.url);
        if ("error" in logo) result = { ok: false, error: logo.error };
        else {
          const value = { ...read.value, logo_url: logo.url };
          result = action === "add" ? await addPartner(Astro2, value) : await updatePartner(Astro2, id, value);
        }
      }
    } else if (action === "remove") result = await removePartner(Astro2, id);
    else if (action === "toggle") result = await togglePartner(Astro2, id);
    else if (action === "up" || action === "down") result = await movePartner(Astro2, id, action);
    else if (action === "reset") result = await resetPartners(Astro2);
    return Astro2.redirect(`/dash/partners-admin?${result.ok ? "saved=1" : `error=${"error" in result ? result.error : "invalid"}`}`);
  }
  const rows = await readPartners(Astro2);
  const custom = Boolean(rows && rows.length);
  const partners = custom ? rows : DEFAULT_PARTNERS;
  const error = Astro2.url.searchParams.get("error") ?? void 0;
  const saved = Astro2.url.searchParams.get("saved") === "1";
  return renderTemplate`${renderComponent($$result, "DashPartnersAdmin", $$DashPartnersAdmin, { "user": session, "partners": partners, "custom": custom, "error": error, "saved": saved })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/partners-admin.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/partners-admin.astro";
const $$url = "/dash/partners-admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PartnersAdmin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
