import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashPanelEmpty } from '../../chunks/DashPanelEmpty_Dm0QkRuf.mjs';
import { u as userAvatar, d as daysLeft, i as isPettoOwner, p as previewManualPremium, a as confirmManualPremium, f as forgetPremiumSnapshots, e as extendManualPremium, b as revokeManualPremium, l as listManualPremium, h as isLiveEntitlement, j as grantTarget, k as resolveGrantNames, m as grantState } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                    */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { p as postActivePremium } from '../../chunks/polarWebhook_B_r2jyuY.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashPremiumAdmin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashPremiumAdmin;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, rows, counts, filter, form, preview, flip, editedId, error, saved = null, logged = null, ownerId } = Astro2.props;
  const fmt = new Intl.DateTimeFormat(dashLocale(dashLang), { dateStyle: "medium", timeZone: "UTC" });
  const day = (iso) => iso ? fmt.format(new Date(iso)) : dt("Permanent");
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  const durations = [["permanent", dt("Permanent")], ["1m", dt("1 month")], ["3m", dt("3 months")], ["6m", dt("6 months")], ["1y", dt("1 year")], ["date", dt("Until a date")]];
  const slotChoices = (current) => [.../* @__PURE__ */ new Set([1, 3, 5, 10, 25, ...current ? [current] : []])].sort((a, b) => a - b);
  const slotLabel = (n) => n === 1 ? dt("1 server") : dt("{n} servers", { n });
  const flipHref = (type) => `/dash/admin?${new URLSearchParams({ target_type: type, target_id: form.targetId, duration: form.duration, until: form.until, slot_limit: form.slots }).toString()}#give`;
  const targetKind = (type) => type === "server" ? dt("Server") : dt("User");
  const fallbackName = (type, id) => type === "server" ? dt("Server {id}", { id }) : dt("User {id}", { id });
  const errors = {
    invalid: dt("Check the Discord ID, the date and the slot limit. IDs have 15 to 22 digits."),
    database: dt("The private API could not save this grant. Check the dashboard API secret."),
    slot_conflict: dt("This grant already has more active servers than the new slot limit."),
    server_taken: dt("That server already has an active Premium owner."),
    wrong_type_server: dt("That ID is a server, not a user. Switch to Server."),
    wrong_type_user: dt("That ID is a user, not a server. Switch to User."),
    past_date: dt("The end date must be in the future."),
    not_found: dt("That manual grant no longer exists."),
    stale: dt("The grant changed or the review expired while you were looking at it. Review it again."),
    unconfirmed: dt("Tick the box to confirm that the ID is a server of Petto."),
    log_not_configured: dt("Set PREMIUM_LOGS_WEBHOOK_URL in the website first: the webhook of the channel of the team."),
    log_database: dt("The list of active Premium could not be read from the database."),
    log_discord: dt("Discord did not accept the message. Check the webhook of the channel.")
  };
  const savedText = {
    "1": dt("Premium grant saved."),
    grant: dt("Premium grant saved."),
    edit: dt("Premium grant changed."),
    extend: dt("Premium grant extended."),
    revoke: dt("Premium grant revoked.")
  };
  const plan = preview?.plan ?? null;
  const target = preview?.target ?? null;
  const planTitle = plan ? plan.mode === "edit" ? dt("Check the change") : dt("Check before you save") : "";
  const noteText = {
    new: dt("A new grant. It starts now."),
    extended: dt("This target already has a live grant: the time is added to its current end."),
    kept_permanent: dt("This target already has a permanent grant. It stays permanent."),
    kept_later: dt("This target already has a grant that ends later than that date. Its end does not change."),
    restarted: dt("This target had a grant that is over. It becomes active again and counts from now."),
    set: dt("The end is set exactly to this value, whatever it was before.")
  };
  const prevText = plan ? plan.prevStatus === null ? dt("No grant yet") : plan.prevLive ? plan.prevEnd ? dt("Ends on {d} (UTC)", { d: day(plan.prevEnd) }) : dt("Permanent") : dt("Not live (over or revoked)") : "";
  const rowEnd = (row) => row.grant.current_period_end;
  const stateText = (row) => {
    const end = rowEnd(row);
    if (row.state === "permanent") return dt("Permanent");
    if (row.state === "timed" && end) {
      const n = daysLeft(end);
      return dt("Ends on {d} \xB7 {n}", { d: day(end), n: n === 1 ? dt("1 day left") : dt("{n} days left", { n }) });
    }
    return row.state === "revoked" ? dt("Revoked") : dt("Expired");
  };
  const filters = [["all", dt("All")], ["users", dt("Users")], ["servers", dt("Servers")]];
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-premium", "pageTitle": "Premium grants", "data-astro-cid-rdvqcozz": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="admin-wrap" data-astro-cid-rdvqcozz> ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Manual Premium grants"), "eyebrow": dt("Staff"), "icon": "ph:crown-fill", "back": false, "data-astro-cid-rdvqcozz": true })} ${error && errors[error] && renderTemplate`<div class="admin-alert error" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-rdvqcozz": true })} <span data-astro-cid-rdvqcozz>${errors[error]}</span></div>`} ${flip && renderTemplate`<div class="admin-flip" data-astro-cid-rdvqcozz> <div class="admin-target" data-astro-cid-rdvqcozz> ${flip.image ? renderTemplate`<img${addAttribute(flip.image, "src")} alt="" width="40" height="40" data-astro-cid-rdvqcozz>` : renderTemplate`<span class="admin-target-ph" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": flip.type === "server" ? "ph:hard-drives-fill" : "ph:user-fill", "width": "18", "height": "18", "data-astro-cid-rdvqcozz": true })}</span>`} <div data-astro-cid-rdvqcozz><strong data-astro-cid-rdvqcozz>${flip.name ?? fallbackName(flip.type, form.targetId)}</strong><small data-astro-cid-rdvqcozz>${targetKind(flip.type)} · ${form.targetId}</small></div> </div> <a class="btn btn-primary btn-sm"${addAttribute(flipHref(flip.type), "href")} data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "14", "height": "14", "data-astro-cid-rdvqcozz": true })} ${flip.type === "server" ? dt("Switch to Server") : dt("Switch to User")}</a> </div>`} ${logged !== null && renderTemplate`<div class="admin-alert success" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "data-astro-cid-rdvqcozz": true })} ${dt("Sent to the channel of the team: {n} active.", { n: logged })}</div>`} ${saved && savedText[saved] && renderTemplate`<div class="admin-alert success" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "data-astro-cid-rdvqcozz": true })} ${savedText[saved]}</div>`} <form method="POST" class="admin-log" data-no-dirty data-astro-cid-rdvqcozz><input type="hidden" name="action" value="premium_log" data-astro-cid-rdvqcozz><button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:megaphone-fill", "width": "14", "height": "14", "data-astro-cid-rdvqcozz": true })} ${dt("Send the active Premium to the log channel")}</button><span data-astro-cid-rdvqcozz>${dt("Lists what the database has, so you can check that the subscriptions of Polar arrived.")}</span></form> <div class="admin-grid" data-astro-cid-rdvqcozz> ${plan && target ? renderTemplate`<article class="admin-card admin-review" id="give" data-astro-cid-rdvqcozz> <div class="admin-card-head" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:seal-check-fill", "width": "20", "height": "20", "data-astro-cid-rdvqcozz": true })}<div data-astro-cid-rdvqcozz><h2 data-astro-cid-rdvqcozz>${planTitle}</h2><p data-astro-cid-rdvqcozz>${dt("Nothing is saved until you confirm.")}</p></div></div> <div class="admin-target big" data-astro-cid-rdvqcozz> ${target.image ? renderTemplate`<img${addAttribute(target.image, "src")} alt="" width="52" height="52" data-astro-cid-rdvqcozz>` : renderTemplate`<span class="admin-target-ph" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": plan.targetType === "server" ? "ph:hard-drives-fill" : "ph:user-fill", "width": "22", "height": "22", "data-astro-cid-rdvqcozz": true })}</span>`} <div data-astro-cid-rdvqcozz> <strong data-astro-cid-rdvqcozz>${target.name ?? (plan.targetType === "server" ? dt("Petto does not know this server") : dt("Petto does not know this user yet"))}</strong> <small data-astro-cid-rdvqcozz><span${addAttribute(["kind", plan.targetType], "class:list")} data-astro-cid-rdvqcozz>${targetKind(plan.targetType)}</span> ${target.id}${target.memberCount ? ` \xB7 ${dt("{n} members", { n: new Intl.NumberFormat(dashLocale(dashLang)).format(target.memberCount) })}` : ""}</small> </div> </div> ${plan.needsAck && renderTemplate`<div class="admin-alert error strong" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "19", "height": "19", "data-astro-cid-rdvqcozz": true })} <span data-astro-cid-rdvqcozz>${dt("Petto is not in a server with this ID: check it is a server ID. If it is a user ID, the Premium would go to nobody.")}</span></div>`} ${!plan.needsAck && plan.targetType === "user" && !target.known && renderTemplate`<div class="admin-alert warn" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "17", "height": "17", "data-astro-cid-rdvqcozz": true })} <span data-astro-cid-rdvqcozz>${dt("Petto does not know this user yet. You can still confirm it: they will have Premium when they use Petto.")}</span></div>`} <dl class="admin-sum" data-astro-cid-rdvqcozz> <div data-astro-cid-rdvqcozz><dt data-astro-cid-rdvqcozz>${dt("Action")}</dt><dd data-astro-cid-rdvqcozz>${plan.mode === "edit" ? dt("Edit the grant (the end is set exactly)") : plan.mode === "extend" ? dt("Extend the grant") : dt("Give Premium (extends the grant if there is one)")}</dd></div> <div data-astro-cid-rdvqcozz><dt data-astro-cid-rdvqcozz>${dt("For")}</dt><dd data-astro-cid-rdvqcozz>${plan.targetType === "server" ? dt("The server directly: it gets Premium, 1 server slot") : dt("The user account: {slots}", { slots: slotLabel(plan.slots) })}</dd></div> ${plan.targetType === "server" && renderTemplate`<div data-astro-cid-rdvqcozz><dt data-astro-cid-rdvqcozz>${dt("Internal account")}</dt><dd data-astro-cid-rdvqcozz>${dt("Your owner account ({id}) holds this grant.", { id: plan.internalUserId || ownerId })}</dd></div>`} ${plan.prevStatus !== null && renderTemplate`<div data-astro-cid-rdvqcozz><dt data-astro-cid-rdvqcozz>${dt("Now")}</dt><dd data-astro-cid-rdvqcozz>${prevText}${plan.targetType === "user" && plan.prevSlots !== plan.slots ? ` \xB7 ${slotLabel(plan.prevSlots ?? 0)}` : ""}</dd></div>`} <div class="admin-sum-new" data-astro-cid-rdvqcozz><dt data-astro-cid-rdvqcozz>${dt("After")}</dt><dd data-astro-cid-rdvqcozz>${plan.prevStatus !== null ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-rdvqcozz": true }, { "default": ($$result3) => renderTemplate`<span data-astro-cid-rdvqcozz>${prevText}</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "13", "height": "13", "data-astro-cid-rdvqcozz": true })} ` })}` : ""}<strong data-astro-cid-rdvqcozz>${plan.end ? dt("Ends on {d} (UTC)", { d: day(plan.end) }) : dt("Permanent")}</strong>${plan.targetType === "user" && plan.prevSlots !== plan.slots && plan.prevSlots !== null ? ` \xB7 ${slotLabel(plan.slots)}` : ""}</dd></div> </dl> <p class="admin-note-strong" data-astro-cid-rdvqcozz>${noteText[plan.note]}</p> <p class="admin-note-strong" data-astro-cid-rdvqcozz>${plan.end ? dt("Nothing is charged: when that day passes, the grant simply stops.") : dt("Nothing is charged. It lasts until you revoke it or edit it.")}</p> <form method="POST" class="admin-form" data-no-dirty data-astro-cid-rdvqcozz> <input type="hidden" name="action" value="confirm" data-astro-cid-rdvqcozz> <input type="hidden" name="token"${addAttribute(preview.token, "value")} data-astro-cid-rdvqcozz> <input type="hidden" name="kind"${addAttribute(plan.mode === "edit" ? "edit" : "grant", "value")} data-astro-cid-rdvqcozz> ${plan.needsAck && renderTemplate`<label class="admin-check" data-astro-cid-rdvqcozz><input type="checkbox" name="ack" value="1" required data-astro-cid-rdvqcozz> <span data-astro-cid-rdvqcozz>${dt("I checked it: this is the ID of a server.")}</span></label>`} <div class="admin-buttons" data-astro-cid-rdvqcozz> <button class="btn btn-primary" type="submit" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "15", "height": "15", "data-astro-cid-rdvqcozz": true })} ${plan.mode === "edit" ? dt("Confirm the change") : dt("Confirm and give Premium")}</button> <a class="btn btn-ghost"${addAttribute(plan.mode === "edit" ? "/dash/admin" : flipHref(plan.targetType), "href")} data-astro-cid-rdvqcozz>${dt("Back")}</a> </div> </form> </article>` : renderTemplate`<article class="admin-card" id="give" data-astro-cid-rdvqcozz> <div class="admin-card-head" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:gift-fill", "width": "20", "height": "20", "data-astro-cid-rdvqcozz": true })}<div data-astro-cid-rdvqcozz><h2 data-astro-cid-rdvqcozz>${dt("Give Premium")}</h2><p data-astro-cid-rdvqcozz>${dt("Choose who it is for, paste one ID and pick how long it lasts.")}</p></div></div> <form method="POST" class="admin-form give-form" data-no-dirty data-astro-cid-rdvqcozz> <input type="hidden" name="action" value="preview" data-astro-cid-rdvqcozz> <fieldset class="admin-choice" data-astro-cid-rdvqcozz> <legend data-astro-cid-rdvqcozz>${dt("Give it to")}</legend> <label data-astro-cid-rdvqcozz><input type="radio" name="target_type" value="user"${addAttribute(form.targetType === "user", "checked")} data-astro-cid-rdvqcozz> <span data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-fill", "width": "15", "height": "15", "data-astro-cid-rdvqcozz": true })} ${dt("User")}</span></label> <label data-astro-cid-rdvqcozz><input type="radio" name="target_type" value="server"${addAttribute(form.targetType === "server", "checked")} data-astro-cid-rdvqcozz> <span data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "15", "height": "15", "data-astro-cid-rdvqcozz": true })} ${dt("Server")}</span></label> </fieldset> <label class="id-field" data-astro-cid-rdvqcozz> <span class="when-user" data-astro-cid-rdvqcozz>${dt("Discord user ID")}</span><span class="when-server" data-astro-cid-rdvqcozz>${dt("Discord server ID")}</span> <input name="target_id"${addAttribute(form.targetId, "value")} inputmode="numeric" pattern="[0-9]{15,22}" minlength="15" maxlength="22" required autocomplete="off"${addAttribute(dt("Discord ID"), "placeholder")}${addAttribute(dt("Discord user ID"), "data-ph-user")}${addAttribute(dt("Discord server ID"), "data-ph-server")} data-astro-cid-rdvqcozz> <small class="when-user" data-astro-cid-rdvqcozz>${dt("The ID of a person: in Discord, Developer Mode on, right click their name, Copy User ID. 15 to 22 digits.")}</small> <small class="when-server" data-astro-cid-rdvqcozz>${dt("The ID of a server: right click its icon, Copy Server ID. Not a user ID. 15 to 22 digits.")}</small> </label> <label class="slots-field" data-astro-cid-rdvqcozz>${dt("Server slots")}<select name="slot_limit" data-astro-cid-rdvqcozz>${slotChoices().map((n) => renderTemplate`<option${addAttribute(String(n), "value")}${addAttribute(String(n) === form.slots, "selected")} data-astro-cid-rdvqcozz>${slotLabel(n)}</option>`)}</select><small data-astro-cid-rdvqcozz>${dt("How many servers this person can give Premium to. A server grant uses 1 slot.")}</small></label> <label data-astro-cid-rdvqcozz>${dt("Duration")}<select name="duration" data-astro-cid-rdvqcozz>${durations.map(([value, label]) => renderTemplate`<option${addAttribute(value, "value")}${addAttribute(value === form.duration, "selected")} data-astro-cid-rdvqcozz>${label}</option>`)}</select></label> <label class="until-field" data-astro-cid-rdvqcozz>${dt("Until")}<input type="date" name="until"${addAttribute(form.until, "value")}${addAttribute(tomorrow, "min")} data-astro-cid-rdvqcozz><small data-astro-cid-rdvqcozz>${dt("The grant ends at the end of that day (UTC).")}</small></label> <button class="btn btn-primary" type="submit" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:seal-check-fill", "width": "15", "height": "15", "data-astro-cid-rdvqcozz": true })} ${dt("Review")}</button> </form> <p class="admin-note" data-astro-cid-rdvqcozz>${dt("You will see what the ID is (name and picture) before anything is saved. Giving Premium again to a target that already has a grant extends it; Edit in the list sets the end exactly. A server grant uses your owner ID as the internal account.")}</p> </article>`} <article class="admin-card admin-info-card" data-astro-cid-rdvqcozz> <div class="admin-card-head" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "20", "height": "20", "data-astro-cid-rdvqcozz": true })}<div data-astro-cid-rdvqcozz><h2 data-astro-cid-rdvqcozz>${dt("Protected owner area")}</h2><p data-astro-cid-rdvqcozz>${dt("Only the configured Petto owner can submit these actions.")}</p></div></div> <dl data-astro-cid-rdvqcozz> <div data-astro-cid-rdvqcozz><dt data-astro-cid-rdvqcozz>${dt("Owner ID")}</dt><dd data-astro-cid-rdvqcozz>${ownerId}</dd></div> <div data-astro-cid-rdvqcozz><dt data-astro-cid-rdvqcozz>${dt("Storage")}</dt><dd data-astro-cid-rdvqcozz>${dt("Discloud PostgreSQL \xB7 premium_entitlements")}</dd></div> <div data-astro-cid-rdvqcozz><dt data-astro-cid-rdvqcozz>${dt("Billing")}</dt><dd data-astro-cid-rdvqcozz>${dt("Manual grant \xB7 no Polar charge, nothing is charged when it ends")}</dd></div> </dl> </article> </div> <div class="admin-list-head" data-astro-cid-rdvqcozz><div data-astro-cid-rdvqcozz><h2 data-astro-cid-rdvqcozz>${dt("Manual grants")}</h2><p data-astro-cid-rdvqcozz>${dt("Permanent grants last until revoked. Timed ones stop by themselves on their end date. A revoked or ended grant is deleted automatically within minutes. Edit sets the end exactly; Extend adds time.")}</p></div></div> <nav class="admin-filters"${addAttribute(dt("Filter the grants"), "aria-label")} data-astro-cid-rdvqcozz> ${filters.map(([value, label]) => renderTemplate`<a${addAttribute(value === "all" ? "/dash/admin" : `/dash/admin?filter=${value}`, "href")}${addAttribute([{ on: filter === value }], "class:list")}${addAttribute(filter === value ? "page" : void 0, "aria-current")} data-astro-cid-rdvqcozz>${label} <span data-astro-cid-rdvqcozz>${counts[value]}</span></a>`)} </nav> ${rows.length === 0 ? renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:crown-fill", "text": counts.all === 0 ? dt("No manual grants yet.") : dt("No grants in this filter."), "data-astro-cid-rdvqcozz": true })}` : renderTemplate`<div class="admin-grants dgl-stagger" data-astro-cid-rdvqcozz> ${rows.map((row) => {
    const { grant, target: t } = row;
    const active = grant.assignments.filter((a) => a.status === "active");
    const editing = editedId === grant.id;
    return renderTemplate`<article${addAttribute(["grant-row", { over: !row.live }], "class:list")} data-astro-cid-rdvqcozz> <div class="grant-top" data-astro-cid-rdvqcozz> ${t.type === "user" || row.image ? renderTemplate`<img class="grant-img"${addAttribute(row.image ?? userAvatar(t.id, null), "src")} alt="" width="40" height="40" loading="lazy" data-astro-cid-rdvqcozz>` : renderTemplate`<div class="grant-icon" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "18", "height": "18", "data-astro-cid-rdvqcozz": true })}</div>`} <div class="grant-main" data-astro-cid-rdvqcozz> <strong data-astro-cid-rdvqcozz>${row.name ?? fallbackName(t.type, t.id)}</strong> <span class="grant-meta" data-astro-cid-rdvqcozz><span${addAttribute(["kind", t.type], "class:list")} data-astro-cid-rdvqcozz>${targetKind(t.type)}</span> <code data-astro-cid-rdvqcozz>${t.id}</code></span> <span class="grant-meta" data-astro-cid-rdvqcozz>${t.type === "user" ? slotLabel(grant.slot_limit) : dt("Server directly")} · <span${addAttribute(["state", row.state], "class:list")} data-astro-cid-rdvqcozz>${stateText(row)}</span></span> ${t.type === "user" && active.length > 0 && renderTemplate`<small data-astro-cid-rdvqcozz>${dt("Assigned: {list}", { list: active.map((a) => a.guild_id).join(", ") })}</small>`} </div> </div> <div class="grant-actions" data-astro-cid-rdvqcozz> ${row.live && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-rdvqcozz": true }, { "default": ($$result3) => renderTemplate`${grant.current_period_end && renderTemplate`<form method="POST" data-no-dirty data-astro-cid-rdvqcozz><input type="hidden" name="action" value="extend" data-astro-cid-rdvqcozz><input type="hidden" name="entitlement_id"${addAttribute(grant.id, "value")} data-astro-cid-rdvqcozz><input type="hidden" name="by" value="1m" data-astro-cid-rdvqcozz><button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-rdvqcozz>${dt("Extend 1 month")}</button></form>`}${grant.current_period_end && renderTemplate`<form method="POST" data-no-dirty data-astro-cid-rdvqcozz><input type="hidden" name="action" value="extend" data-astro-cid-rdvqcozz><input type="hidden" name="entitlement_id"${addAttribute(grant.id, "value")} data-astro-cid-rdvqcozz><input type="hidden" name="by" value="1y" data-astro-cid-rdvqcozz><button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-rdvqcozz>${dt("Extend 1 year")}</button></form>`}${grant.current_period_end && renderTemplate`<form method="POST" data-no-dirty data-astro-cid-rdvqcozz><input type="hidden" name="action" value="extend" data-astro-cid-rdvqcozz><input type="hidden" name="entitlement_id"${addAttribute(grant.id, "value")} data-astro-cid-rdvqcozz><input type="hidden" name="by" value="permanent" data-astro-cid-rdvqcozz><button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-rdvqcozz>${dt("Make permanent")}</button></form>`}` })}`} <details class="grant-edit"${addAttribute(editing, "open")} data-astro-cid-rdvqcozz> <summary class="btn btn-ghost btn-sm" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "14", "height": "14", "data-astro-cid-rdvqcozz": true })} ${dt("Edit")}</summary> <form method="POST" class="admin-form cond-form" data-no-dirty data-astro-cid-rdvqcozz> <input type="hidden" name="action" value="edit_preview" data-astro-cid-rdvqcozz> <input type="hidden" name="entitlement_id"${addAttribute(grant.id, "value")} data-astro-cid-rdvqcozz> <label data-astro-cid-rdvqcozz>${dt("New duration (counted from today)")}<select name="duration" data-astro-cid-rdvqcozz>${durations.map(([value, label]) => renderTemplate`<option${addAttribute(value, "value")}${addAttribute(value === (row.live ? grant.current_period_end ? "date" : "permanent" : "1m"), "selected")} data-astro-cid-rdvqcozz>${label}</option>`)}</select></label> <label class="until-field" data-astro-cid-rdvqcozz>${dt("Until")}<input type="date" name="until"${addAttribute(tomorrow, "min")}${addAttribute(row.live && grant.current_period_end ? grant.current_period_end.slice(0, 10) : "", "value")} data-astro-cid-rdvqcozz></label> ${t.type === "user" && renderTemplate`<label data-astro-cid-rdvqcozz>${dt("Server slots")}<select name="slot_limit" data-astro-cid-rdvqcozz>${slotChoices(grant.slot_limit).map((n) => renderTemplate`<option${addAttribute(String(n), "value")}${addAttribute(n === grant.slot_limit, "selected")} data-astro-cid-rdvqcozz>${slotLabel(n)}</option>`)}</select></label>`} <button class="btn btn-primary btn-sm" type="submit" data-astro-cid-rdvqcozz>${dt("Review the change")}</button> </form> </details> ${row.live && renderTemplate`<details class="grant-revoke" data-astro-cid-rdvqcozz> <summary class="btn btn-danger btn-sm" data-astro-cid-rdvqcozz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x", "width": "14", "height": "14", "data-astro-cid-rdvqcozz": true })} ${dt("Revoke")}</summary> <form method="POST" data-no-dirty data-astro-cid-rdvqcozz><input type="hidden" name="action" value="revoke" data-astro-cid-rdvqcozz><input type="hidden" name="entitlement_id"${addAttribute(grant.id, "value")} data-astro-cid-rdvqcozz><p data-astro-cid-rdvqcozz>${dt("Revoke this Premium now? The server slots are released.")}</p><button class="btn btn-danger btn-sm" type="submit" data-astro-cid-rdvqcozz>${dt("Yes, revoke it")}</button></form> </details>`} </div> </article>`;
  })} </div>`} </div> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPremiumAdmin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Admin;
  const session = await getDashboardSession(Astro2);
  if (!session) return Astro2.redirect("/dash");
  if (!isPettoOwner(Astro2, session.userId)) return Astro2.redirect("/dash/manage?error=forbidden");
  const query = Astro2.url.searchParams;
  const form = {
    targetType: query.get("target_type") === "server" ? "server" : "user",
    targetId: (query.get("target_id") ?? "").replace(/\D/g, "").slice(0, 22),
    duration: query.get("duration") ?? "permanent",
    until: /^\d{4}-\d{2}-\d{2}$/.test(query.get("until") ?? "") ? query.get("until") : "",
    slots: ["1", "3", "5", "10", "25"].includes(query.get("slot_limit") ?? "") ? query.get("slot_limit") : "1"
  };
  let actionError;
  let preview = null;
  let flip = null;
  let editedId = null;
  if (Astro2.request.method.toUpperCase() === "POST") {
    const origin = Astro2.request.headers.get("origin");
    if (origin && origin !== Astro2.url.origin) {
      actionError = "invalid";
    } else {
      const data = await Astro2.request.formData();
      const action = String(data.get("action") ?? "");
      const text = (name) => String(data.get(name) ?? "");
      if (action === "preview" || action === "edit_preview") {
        const input = action === "preview" ? { mode: "grant", targetType: text("target_type"), targetId: text("target_id"), duration: text("duration"), date: text("until"), slotLimit: Number(text("slot_limit") || 1) } : { mode: "edit", entitlementId: Number(text("entitlement_id")), duration: text("duration"), date: text("until"), slotLimit: text("slot_limit") === "" ? void 0 : Number(text("slot_limit")) };
        if (action === "preview") {
          form.targetType = text("target_type") === "server" ? "server" : "user";
          form.targetId = text("target_id").replace(/\D/g, "").slice(0, 22);
          form.duration = text("duration");
          form.until = text("until");
          form.slots = text("slot_limit") || "1";
        } else {
          editedId = Number(text("entitlement_id")) || null;
        }
        const result = await previewManualPremium(Astro2, session.userId, input);
        if ("token" in result) {
          preview = result;
        } else {
          actionError = result.code;
          if ("flip" in result && result.flip && result.target) flip = { type: result.flip, name: result.target.name, image: result.target.image, known: result.target.known };
        }
      } else if (action === "confirm") {
        const result = await confirmManualPremium(Astro2, session.userId, text("token"), text("ack") === "1");
        forgetPremiumSnapshots();
        if (result.ok) return Astro2.redirect(`/dash/admin?saved=${text("kind") === "edit" ? "edit" : "grant"}`);
        actionError = "code" in result ? result.code : "database";
      } else if (action === "extend") {
        const result = await extendManualPremium(Astro2, session.userId, Number(text("entitlement_id")), text("by"));
        forgetPremiumSnapshots();
        if (result.ok) return Astro2.redirect("/dash/admin?saved=extend");
        actionError = "code" in result ? result.code : "database";
      } else if (action === "revoke") {
        const ok = await revokeManualPremium(Astro2, session.userId, Number(text("entitlement_id")));
        forgetPremiumSnapshots();
        if (ok) return Astro2.redirect("/dash/admin?saved=revoke");
        actionError = "database";
      } else if (action === "premium_log") {
        const result = await postActivePremium(Astro2);
        if (result.ok) return Astro2.redirect(`/dash/admin?logged=${result.count}`);
        actionError = `log_${"error" in result ? result.error : "discord"}`;
      } else {
        actionError = "invalid";
      }
    }
  }
  const savedParam = query.get("saved");
  const saved = savedParam && ["1", "grant", "edit", "extend", "revoke"].includes(savedParam) ? savedParam : null;
  const loggedParam = query.get("logged");
  const logged = loggedParam !== null && /^\d{1,4}$/.test(loggedParam) ? Number(loggedParam) : null;
  const filter = ["users", "servers"].includes(query.get("filter") ?? "") ? query.get("filter") : "all";
  const now = Date.now();
  const all = (await listManualPremium(Astro2)).filter((grant) => isLiveEntitlement(grant, now));
  const targets = all.map((grant) => grantTarget(grant));
  const names = await resolveGrantNames(Astro2, targets);
  const rows = all.map((grant, index) => {
    const target = targets[index];
    const known = names.get(`${target.type}:${target.id}`);
    return { grant, target, name: known?.name ?? null, image: known?.image ?? null, state: grantState(grant, now), live: isLiveEntitlement(grant, now) };
  }).sort((a, b) => Number(b.live) - Number(a.live));
  const counts = { all: rows.length, users: rows.filter((r) => r.target.type === "user").length, servers: rows.filter((r) => r.target.type === "server").length };
  const shown = rows.filter((r) => filter === "users" ? r.target.type === "user" : filter === "servers" ? r.target.type === "server" : true);
  return renderTemplate`${renderComponent($$result, "DashPremiumAdmin", $$DashPremiumAdmin, { "user": session, "rows": shown, "counts": counts, "filter": filter, "form": form, "preview": preview, "flip": flip, "editedId": editedId, "error": actionError, "saved": saved, "logged": logged, "ownerId": session.userId })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/admin.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/admin.astro";
const $$url = "/dash/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
