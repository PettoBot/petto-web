import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { m as makeT, g as getDashLang } from '../../chunks/dash_CORIPvM-.mjs';
import { a as $$DashClientI18N } from '../../chunks/Base_Di2YHjFe.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { M as MAX_PER_POSITION, s as startCustomTeam, a as addTeamMembers, r as removeTeamMember, m as moveTeamMember, b as resetTeam, T as TEAM_POSITIONS, g as getTeamIds, c as readTeamRows, d as describeTeam } from '../../chunks/team_C2OWrCGw.mjs';
/* empty css                                   */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashTeamAdmin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashTeamAdmin;
  const dt = makeT(getDashLang(Astro2));
  const { user, sections, custom, error, saved = false, added = 0, skipped = 0 } = Astro2.props;
  const titles = {
    owners: dt("Owners"),
    programming: dt("Programming"),
    support: dt("Support"),
    legal: dt("Legal"),
    test: dt("Testing")
  };
  const errors = {
    invalid: dt("That request was not valid."),
    nothing: dt("Paste at least one Discord ID or mention."),
    full: dt("That position would pass {max} people.", { max: MAX_PER_POSITION }),
    database: dt("The database did not accept the change. Try again."),
    not_configured: dt("The dashboard is not connected to the bot database.")
  };
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-team", "pageTitle": "Team", "data-astro-cid-di3kibaq": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="tm-wrap" data-astro-cid-di3kibaq> ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Team"), "eyebrow": dt("Staff"), "icon": "ph:users-three-fill", "back": false, "data-astro-cid-di3kibaq": true }, { "default": ($$result3) => renderTemplate` <a class="btn btn-ghost btn-sm" href="/team" target="_blank" rel="noopener" data-astro-cid-di3kibaq>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrow-square-out", "width": "14", "height": "14", "data-astro-cid-di3kibaq": true })} ${dt("See the page")}</a> ` })} ${error && renderTemplate`<div class="tm-alert error" data-astro-cid-di3kibaq>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-di3kibaq": true })} ${errors[error] ?? errors.invalid}</div>`} ${saved && !error && renderTemplate`<div class="tm-alert success" data-astro-cid-di3kibaq>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "data-astro-cid-di3kibaq": true })} ${added ? dt("Saved: {n} added.", { n: added }) : dt("Saved.")}${skipped ? " " + (skipped === 1 ? dt("1 was already there.") : dt("{n} were already there.", { n: skipped })) : ""}</div>`} ${!custom && renderTemplate`<div class="tm-banner" data-astro-cid-di3kibaq> <p data-astro-cid-di3kibaq>${dt("The page shows the original list. Start editing to save it, then change it as you like.")}</p> <form method="POST" data-no-dirty data-astro-cid-di3kibaq><input type="hidden" name="action" value="start" data-astro-cid-di3kibaq><button class="btn btn-primary btn-sm" type="submit" data-astro-cid-di3kibaq>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "14", "height": "14", "data-astro-cid-di3kibaq": true })} ${dt("Start editing")}</button></form> </div>`} ${sections.map((section) => renderTemplate`<article class="tm-block"${addAttribute(section.position, "id")} data-astro-cid-di3kibaq> <header data-astro-cid-di3kibaq> <h2 data-astro-cid-di3kibaq>${titles[section.position]}</h2> <span class="tm-count" data-astro-cid-di3kibaq>${section.members.length} / ${MAX_PER_POSITION}</span> </header> ${section.members.length === 0 ? renderTemplate`<p class="tm-empty" data-astro-cid-di3kibaq>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-circle-dashed-fill", "width": "16", "height": "16", "data-astro-cid-di3kibaq": true })}${dt("Nobody here. The position is hidden on the page.")}</p>` : renderTemplate`<ul class="tm-list dgl-stagger" data-astro-cid-di3kibaq> ${section.members.map((member, index) => renderTemplate`<li class="tm-row" data-astro-cid-di3kibaq> <img class="tm-avatar"${addAttribute(member.avatarUrl, "src")} alt="" width="38" height="38" loading="lazy" data-astro-cid-di3kibaq> <div class="tm-who" data-astro-cid-di3kibaq><strong data-astro-cid-di3kibaq>${member.displayName}</strong><span data-astro-cid-di3kibaq>@${member.username} · ${member.id}</span></div> ${custom && renderTemplate`<div class="tm-actions" data-astro-cid-di3kibaq> <form method="POST" data-no-dirty data-astro-cid-di3kibaq><input type="hidden" name="row_id"${addAttribute(member.rowId, "value")} data-astro-cid-di3kibaq><input type="hidden" name="position"${addAttribute(section.position, "value")} data-astro-cid-di3kibaq><button class="btn btn-ghost btn-sm" name="action" value="up" type="submit"${addAttribute(index === 0, "disabled")}${addAttribute(dt("Move up"), "aria-label")}${addAttribute(dt("Move up"), "title")} data-astro-cid-di3kibaq>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-up", "width": "14", "height": "14", "data-astro-cid-di3kibaq": true })}</button></form> <form method="POST" data-no-dirty data-astro-cid-di3kibaq><input type="hidden" name="row_id"${addAttribute(member.rowId, "value")} data-astro-cid-di3kibaq><input type="hidden" name="position"${addAttribute(section.position, "value")} data-astro-cid-di3kibaq><button class="btn btn-ghost btn-sm" name="action" value="down" type="submit"${addAttribute(index === section.members.length - 1, "disabled")}${addAttribute(dt("Move down"), "aria-label")}${addAttribute(dt("Move down"), "title")} data-astro-cid-di3kibaq>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-down", "width": "14", "height": "14", "data-astro-cid-di3kibaq": true })}</button></form> <form method="POST" data-remove data-no-dirty${addAttribute(member.displayName, "data-name")}${addAttribute(dt("Remove {name} from this position?", { name: member.displayName }), "data-confirm")} data-astro-cid-di3kibaq><input type="hidden" name="row_id"${addAttribute(member.rowId, "value")} data-astro-cid-di3kibaq><input type="hidden" name="position"${addAttribute(section.position, "value")} data-astro-cid-di3kibaq><button class="btn btn-danger btn-sm" name="action" value="remove" type="submit" data-astro-cid-di3kibaq>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "14", "height": "14", "data-astro-cid-di3kibaq": true })} ${dt("Remove")}</button></form> </div>`} </li>`)} </ul>`} ${custom && section.members.length < MAX_PER_POSITION && renderTemplate`<form method="POST" class="tm-add" data-no-dirty data-astro-cid-di3kibaq> <input type="hidden" name="action" value="add" data-astro-cid-di3kibaq> <input type="hidden" name="position"${addAttribute(section.position, "value")} data-astro-cid-di3kibaq> <textarea name="ids" rows="2"${addAttribute(dt("Discord IDs or mentions, separated by spaces or lines"), "placeholder")} required data-astro-cid-di3kibaq></textarea> <button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-di3kibaq>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-plus-fill", "width": "14", "height": "14", "data-astro-cid-di3kibaq": true })} ${dt("Add")}</button> </form>`} </article>`)} ${custom && renderTemplate`<form method="POST" class="tm-reset" data-reset data-no-dirty${addAttribute(dt("Delete the saved team and show the original list again?"), "data-confirm")} data-astro-cid-di3kibaq> <input type="hidden" name="action" value="reset" data-astro-cid-di3kibaq> <button class="btn btn-danger btn-sm" type="submit" data-astro-cid-di3kibaq>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-fill", "width": "14", "height": "14", "data-astro-cid-di3kibaq": true })} ${dt("Go back to the original list")}</button> </form>`} </div> ` })} ${renderComponent($$result, "DashClientI18n", $$DashClientI18N, { "data-astro-cid-di3kibaq": true })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashTeamAdmin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Team = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Team;
  const session = await getDashboardSession(Astro2);
  if (!session) return Astro2.redirect("/dash");
  if (!isPettoOwner(Astro2, session.userId)) return Astro2.redirect("/dash/manage?error=forbidden");
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  if (!botToken) return Astro2.redirect("/dash/manage?error=server_not_configured");
  if (Astro2.request.method.toUpperCase() === "POST") {
    const origin = Astro2.request.headers.get("origin");
    if (origin && origin !== Astro2.url.origin) return Astro2.redirect("/dash/team?error=invalid");
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    let result = { ok: false, error: "invalid" };
    if (action === "start") result = await startCustomTeam(Astro2);
    else if (action === "add") result = await addTeamMembers(Astro2, String(form.get("position") ?? ""), String(form.get("ids") ?? ""));
    else if (action === "remove") result = await removeTeamMember(Astro2, Number(form.get("row_id")));
    else if (action === "up" || action === "down") result = await moveTeamMember(Astro2, Number(form.get("row_id")), action);
    else if (action === "reset") result = await resetTeam(Astro2);
    const query = new URLSearchParams();
    if (result.ok) {
      query.set("saved", "1");
      if (result.added) query.set("added", String(result.added));
      if (result.skipped) query.set("skipped", String(result.skipped));
    } else query.set("error", "error" in result ? result.error : "invalid");
    const position = String(form.get("position") ?? "");
    return Astro2.redirect(`/dash/team?${query}${TEAM_POSITIONS.includes(position) ? `#${position}` : ""}`);
  }
  const { ids, custom } = await getTeamIds(Astro2);
  const rows = custom ? await readTeamRows(Astro2) ?? [] : [];
  const people = await describeTeam(botToken, TEAM_POSITIONS.flatMap((position) => ids[position]));
  const sections = TEAM_POSITIONS.map((position) => ({
    position,
    members: custom ? rows.filter((row) => row.position === position).map((row) => ({ rowId: row.id, ...people.get(row.user_id) })) : ids[position].map((id) => ({ rowId: 0, ...people.get(id) }))
  }));
  const error = Astro2.url.searchParams.get("error") ?? void 0;
  const saved = Astro2.url.searchParams.get("saved") === "1";
  const added = Number(Astro2.url.searchParams.get("added") ?? 0);
  const skipped = Number(Astro2.url.searchParams.get("skipped") ?? 0);
  return renderTemplate`${renderComponent($$result, "DashTeamAdmin", $$DashTeamAdmin, { "user": session, "sections": sections, "custom": custom, "error": error, "saved": saved, "added": added, "skipped": skipped })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/team.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/team.astro";
const $$url = "/dash/team";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Team,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
