import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
import { e as etaSeconds, a as shortDuration, p as parseDay, b as parseRoleCount, r as roleBlocks, d as dangerousPermissionsOf, s as shapeJob } from '../../../../chunks/bulkRole_DtuybX_8.mjs';
import { a as agoText } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
import { $ as $$DurationScript } from '../../../../chunks/DurationScript_BO_8qKfV.mjs';
/* empty css                                              */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { e as getGuildList, j as getGuildInfo } from '../../../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashBulkRole = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashBulkRole;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, roles, channels, jobs, flash, error, today } = Astro2.props;
  const job = jobs[0] ?? null;
  const history = jobs.slice(1);
  const jobActive = job ? ["pending", "running"].includes(job.status) : false;
  const locale = dashLocale(dashLang);
  function roleName(id) {
    return roles.find((r) => r.id === id)?.name ?? id;
  }
  const fmt = (n) => n.toLocaleString(locale);
  const fullDate = (value) => value ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "";
  const statusLabel = {
    pending: dt("Queued"),
    running: dt("Running"),
    completed: dt("Completed"),
    cancelled: dt("Cancelled"),
    failed: dt("Failed"),
    paused: dt("Paused")
  };
  const flashText = {
    started: dt("Job started, it'll process in the background."),
    previewed: dt("Preview started, the numbers show up below in a moment. Nothing is changed."),
    cancelled: dt("The job was cancelled."),
    paused: dt("The job is paused."),
    resumed: dt("The job goes on.")
  };
  const errorText = {
    busy: dt("A bulk role job is already running for this server. Wait for it to finish or cancel it first."),
    pick_role: dt("Pick a role first."),
    save_failed: dt("Couldn't start the job, try again."),
    bad_date: dt("That date is not valid."),
    date_order: dt('"Joined after" has to be earlier than "joined before".'),
    bad_count: dt("The number of roles has to be a whole number from 0 to 250."),
    count_order: dt("The minimum number of roles cannot be higher than the maximum."),
    role_gone: dt("That role no longer exists."),
    role_everyone: dt("@everyone cannot be given or taken away."),
    role_managed: dt("That role is managed by an integration, so Discord does not let anyone give it."),
    role_above_bot: dt("That role is above Petto's highest role. Move Petto's role above it and try again."),
    confirm_danger: dt("This role gives powerful permissions. Tick the box to confirm you want to give it to many members."),
    no_preview: dt("That preview is not there any more. Run it again."),
    guild_gone: dt("Petto isn't in that server anymore."),
    missing_permission: dt("Petto needs the Manage Roles permission to do this."),
    member_list: dt("Petto could not read the member list. Try again in a moment."),
    permission_lost: dt("Discord kept refusing, so the job stopped: Petto lost the permission, or the role moved above its own, while it was running."),
    crashed: dt("The job stopped because of an unexpected error. What was already done stays done.")
  };
  const failureText = (j) => j.errorCode && errorText[j.errorCode] || j.errorMessage || "";
  const flashMessage = flash ? flashText[flash] ?? null : null;
  const errorMessage = error ? errorText[error] ?? null : null;
  const titleOf = (j) => j.dryRun ? j.action === "add" ? dt("Preview of assigning") : dt("Preview of removing") : j.action === "add" ? dt("Assigning") : dt("Removing");
  const stateOf = (j) => j.status === "running" && j.paused ? "paused" : j.status;
  const colorOf = (state2) => state2 === "pending" || state2 === "running" || state2 === "paused" ? "var(--yellow)" : state2 === "completed" ? "var(--green)" : state2 === "failed" ? "var(--red)" : "var(--text-dim)";
  const percent = (j) => j.totalMembers > 0 ? Math.min(100, Math.round(j.processedMembers / j.totalMembers * 100)) : 0;
  const filtered = (j) => Math.max(0, j.processedMembers - j.successCount - j.skippedCount - j.errorCount);
  const left = job ? etaSeconds(job) : null;
  const took = job && job.startedAt && job.finishedAt ? Math.round((new Date(job.finishedAt).getTime() - new Date(job.startedAt).getTime()) / 1e3) : null;
  const state = job ? stateOf(job) : "completed";
  const changedTotal = jobs.filter((j) => !j.dryRun).reduce((sum, j) => sum + j.successCount, 0);
  const previewCount = jobs.filter((j) => j.dryRun).length;
  const lastWhen = job ? agoText(dt, job.finishedAt ?? job.startedAt ?? job.createdAt, { locale }) : "\u2014";
  const jsWords = JSON.stringify({
    labels: statusLabel,
    titles: { add: dt("Assigning"), remove: dt("Removing"), previewAdd: dt("Preview of assigning"), previewRemove: dt("Preview of removing") },
    note: dt("{done} / {total} members checked"),
    waiting: dt("Waiting to start..."),
    changed: dt("Changed"),
    wouldChange: dt("Would change"),
    failed: dt("Failed"),
    notMatching: dt("Not matching"),
    timeLeft: dt("Time left"),
    took: dt("Took"),
    errors: errorText,
    start: dt("Start"),
    busy: dt("A job is already running"),
    summary: {
      assign: dt("Assign the role"),
      remove: dt("Remove the role"),
      noRole: dt("Choose a role"),
      after: dt("joined after {date}"),
      before: dt("joined before {date}"),
      least: dt("at least {n} roles"),
      most: dt("at most {n} roles"),
      filter: dt("with some of {n} chosen roles"),
      exclude: dt("without {n} chosen roles"),
      pending: dt("not counting members who have not accepted the rules")
    }
  });
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "bulk-role", "pageTitle": "Bulk Role", "data-astro-cid-5olt6jft": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DurationScript", $$DurationScript, { "data-astro-cid-5olt6jft": true })} ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-5olt6jft": true })} ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-5olt6jft": true })} ${maybeRenderHead()}<div class="sx-page br-page" data-astro-cid-5olt6jft> <div class="sx-title" data-astro-cid-5olt6jft> <h1 data-astro-cid-5olt6jft>${dt("Bulk Role")}</h1> <span${addAttribute(["sx-pill-state", { on: jobActive }], "class:list")} data-astro-cid-5olt6jft>${jobActive ? dt("Running") : dt("Nothing running")}</span> </div> <p class="br-lead" data-astro-cid-5olt6jft>${dt("Give or take away one role for many members at once. Check how many members it would change first, then run it: you can pause or cancel it while it works.")}</p> ${flashMessage && renderTemplate`<div class="sx-flash" role="status" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-5olt6jft": true })}${flashMessage}</div>`} ${(errorMessage || error && !errorMessage) && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-5olt6jft": true })}${errorMessage ?? dt("Couldn't start the job, try again.")}</div>`} ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Recent jobs"), value: jobs.length, tone: "voice" },
    { label: dt("Members changed"), value: changedTotal, tone: "joins" },
    { label: dt("Previews"), value: previewCount, tone: "invites" },
    { label: dt("Last job"), value: 0, text: lastWhen, tone: "messages" }
  ], "data-astro-cid-5olt6jft": true })} <div class="br-grid" data-astro-cid-5olt6jft>  <form method="POST" class="br-form sx-stack" data-no-dirty${addAttribute(`/dash/guild/${guildId}/bulk-role-status`, "data-status-url")}${addAttribute(jsWords, "data-words")}${addAttribute(today, "data-today")} data-astro-cid-5olt6jft> <section class="sx-panel" data-astro-cid-5olt6jft> <div class="sx-panel-head" data-astro-cid-5olt6jft><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "17", "height": "17", "data-astro-cid-5olt6jft": true })}</span><h2 data-astro-cid-5olt6jft>${dt("What to do")}</h2></div> <fieldset class="br-set"${addAttribute(jobActive, "disabled")} data-config data-astro-cid-5olt6jft> <div class="sx-grid" data-astro-cid-5olt6jft> <div class="sx-field" data-astro-cid-5olt6jft> <label for="br-role" data-astro-cid-5olt6jft>${dt("Role")}</label> <select id="br-role" name="target_role_id" required data-give-role data-role-select data-astro-cid-5olt6jft> <option value="" disabled selected data-astro-cid-5olt6jft>${dt("Choose a role")}</option> ${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.memberRisk.join(", "), "data-risk")} data-astro-cid-5olt6jft>${r.name}</option>`)} </select> </div> <div class="sx-field" data-astro-cid-5olt6jft> <span class="sx-label" id="br-action-label" data-astro-cid-5olt6jft>${dt("Action")}</span> <div class="sx-chips" role="radiogroup" aria-labelledby="br-action-label" data-astro-cid-5olt6jft> <label class="sx-chip" data-astro-cid-5olt6jft><input type="radio" name="role_action" value="add" checked data-astro-cid-5olt6jft><span data-astro-cid-5olt6jft>${dt("Assign the role")}</span></label> <label class="sx-chip" data-astro-cid-5olt6jft><input type="radio" name="role_action" value="remove" data-astro-cid-5olt6jft><span data-astro-cid-5olt6jft>${dt("Remove the role")}</span></label> </div> </div> </div> <div class="br-danger" data-danger hidden role="group"${addAttribute(dt("Powerful permissions"), "aria-label")} data-astro-cid-5olt6jft> <p data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-5olt6jft": true })}<span data-astro-cid-5olt6jft>${dt("This role gives powerful permissions:")} <strong data-danger-list data-astro-cid-5olt6jft></strong></span></p> <label class="br-inline-check" data-astro-cid-5olt6jft><input type="checkbox" name="confirm_danger" data-astro-cid-5olt6jft>${dt("I understand, give it to every member that matches.")}</label> </div> </fieldset> </section> <section class="sx-panel" data-astro-cid-5olt6jft> <div class="sx-panel-head" data-astro-cid-5olt6jft><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:funnel-fill", "width": "17", "height": "17", "data-astro-cid-5olt6jft": true })}</span><h2 data-astro-cid-5olt6jft>${dt("Who")}</h2></div> <fieldset class="br-set"${addAttribute(jobActive, "disabled")} data-config data-astro-cid-5olt6jft> <div class="sx-field" data-astro-cid-5olt6jft> <span class="sx-label" id="br-members-label" data-astro-cid-5olt6jft>${dt("Members")}</span> <div class="sx-chips" role="radiogroup" aria-labelledby="br-members-label" data-astro-cid-5olt6jft> <label class="sx-chip" data-astro-cid-5olt6jft><input type="radio" name="member_type" value="all" checked data-astro-cid-5olt6jft><span data-astro-cid-5olt6jft>${dt("All members")}</span></label> <label class="sx-chip" data-astro-cid-5olt6jft><input type="radio" name="member_type" value="humans" data-astro-cid-5olt6jft><span data-astro-cid-5olt6jft>${dt("Humans only")}</span></label> <label class="sx-chip" data-astro-cid-5olt6jft><input type="radio" name="member_type" value="bots" data-astro-cid-5olt6jft><span data-astro-cid-5olt6jft>${dt("Bots only")}</span></label> </div> </div> <div class="sx-grid" data-astro-cid-5olt6jft> <div class="sx-field" data-astro-cid-5olt6jft> <label for="br-after" data-astro-cid-5olt6jft>${dt("Joined after (optional)")}</label> <div class="br-date" data-date data-empty="true" data-astro-cid-5olt6jft> <input id="br-after" type="date" name="joined_after"${addAttribute(today, "max")} data-astro-cid-5olt6jft> <span class="br-date-hint" aria-hidden="true" data-astro-cid-5olt6jft>${dt("Any date")}</span> </div> <div class="br-chips" role="group"${addAttribute(dt("Joined after (optional)"), "aria-label")} data-astro-cid-5olt6jft> <button type="button" class="br-chip" data-after-days="7" data-astro-cid-5olt6jft>${dt("Last 7 days")}</button> <button type="button" class="br-chip" data-after-days="30" data-astro-cid-5olt6jft>${dt("Last 30 days")}</button> <button type="button" class="br-chip" data-after-days="90" data-astro-cid-5olt6jft>${dt("Last 90 days")}</button> <button type="button" class="br-chip" data-clear="joined_after" data-astro-cid-5olt6jft>${dt("Clear")}</button> </div> </div> <div class="sx-field" data-astro-cid-5olt6jft> <label for="br-before" data-astro-cid-5olt6jft>${dt("Joined before (optional)")}</label> <div class="br-date" data-date data-empty="true" data-astro-cid-5olt6jft> <input id="br-before" type="date" name="joined_before"${addAttribute(today, "max")} data-astro-cid-5olt6jft> <span class="br-date-hint" aria-hidden="true" data-astro-cid-5olt6jft>${dt("Any date")}</span> </div> <div class="br-chips" role="group"${addAttribute(dt("Joined before (optional)"), "aria-label")} data-astro-cid-5olt6jft> <button type="button" class="br-chip" data-before-days="30" data-astro-cid-5olt6jft>${dt("Older than 30 days")}</button> <button type="button" class="br-chip" data-before-days="90" data-astro-cid-5olt6jft>${dt("Older than 90 days")}</button> <button type="button" class="br-chip" data-before-days="365" data-astro-cid-5olt6jft>${dt("Older than a year")}</button> <button type="button" class="br-chip" data-clear="joined_before" data-astro-cid-5olt6jft>${dt("Clear")}</button> </div> </div> </div> <div class="sx-grid" data-astro-cid-5olt6jft> <div class="sx-field" data-astro-cid-5olt6jft> <label for="br-min" data-astro-cid-5olt6jft>${dt("At least this many roles (optional)")}</label> ${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "br-min", "name": "min_roles", "value": "", "min": "0", "max": "250", "placeholder": "0", "data-astro-cid-5olt6jft": true })} </div> <div class="sx-field" data-astro-cid-5olt6jft> <label for="br-max" data-astro-cid-5olt6jft>${dt("At most this many roles (optional)")}</label> ${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "br-max", "name": "max_roles", "value": "", "min": "0", "max": "250", "placeholder": "250", "data-astro-cid-5olt6jft": true })} </div> <p class="sx-hint sx-wide" data-astro-cid-5olt6jft>${dt("@everyone does not count. Use 0 as the most to pick the members who have no roles.")}</p> </div> <div class="sx-field" data-astro-cid-5olt6jft> <span class="sx-label" id="br-filter-label" data-astro-cid-5olt6jft>${dt("Filter by existing roles (optional)")}</span> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "filter_role_ids", "options": roles, "selected": [], "placeholder": dt("Search roles..."), "data-astro-cid-5olt6jft": true })} <div class="br-filter-opts" data-sx-needs="filter_role_ids" data-astro-cid-5olt6jft> <div class="sx-chips" role="radiogroup"${addAttribute(dt("Filter by existing roles (optional)"), "aria-label")} data-astro-cid-5olt6jft> <label class="sx-chip" data-astro-cid-5olt6jft><input type="radio" name="filter_mode" value="any" checked data-astro-cid-5olt6jft><span data-astro-cid-5olt6jft>${dt("Has any of these")}</span></label> <label class="sx-chip" data-astro-cid-5olt6jft><input type="radio" name="filter_mode" value="all" data-astro-cid-5olt6jft><span data-astro-cid-5olt6jft>${dt("Has all of these")}</span></label> </div> <label class="sx-switch" data-astro-cid-5olt6jft><input type="checkbox" name="filter_exclude" data-astro-cid-5olt6jft><span class="sx-switch-text" data-astro-cid-5olt6jft><b data-astro-cid-5olt6jft>${dt("Invert (members WITHOUT them instead)")}</b></span><i class="sx-toggle" data-astro-cid-5olt6jft></i></label> </div> </div> <label class="sx-switch" data-astro-cid-5olt6jft><input type="checkbox" name="skip_pending" data-astro-cid-5olt6jft><span class="sx-switch-text" data-astro-cid-5olt6jft><b data-astro-cid-5olt6jft>${dt("Skip members who have not accepted the rules of the server yet")}</b></span><i class="sx-toggle" data-astro-cid-5olt6jft></i></label> </fieldset> </section> <section class="sx-panel" data-astro-cid-5olt6jft> <div class="sx-panel-head" data-astro-cid-5olt6jft><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:note-pencil-bold", "width": "17", "height": "17", "data-astro-cid-5olt6jft": true })}</span><h2 data-astro-cid-5olt6jft>${dt("Details")}</h2></div> <fieldset class="br-set"${addAttribute(jobActive, "disabled")} data-config data-astro-cid-5olt6jft> <div class="sx-field" data-astro-cid-5olt6jft> <label for="br-reason" data-astro-cid-5olt6jft>${dt("Reason (optional)")}</label> <textarea id="br-reason" name="reason" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="300" autocomplete="off" data-astro-cid-5olt6jft></textarea> <span class="sx-hint" data-astro-cid-5olt6jft>${dt("Shown in the audit log of Discord, with the number of the job.")}</span> </div> <div class="sx-field" data-astro-cid-5olt6jft> <label for="br-notify" data-astro-cid-5olt6jft>${dt("Notify channel (optional)")}</label> <select id="br-notify" name="notify_channel_id" data-astro-cid-5olt6jft> <option value="" data-astro-cid-5olt6jft>${dt("None")}</option> ${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-5olt6jft>#${c.name}</option>`)} </select> </div> </fieldset> <p class="br-summary" data-summary aria-live="polite" data-astro-cid-5olt6jft></p> <div class="br-submit" data-astro-cid-5olt6jft> <button type="submit" name="action" value="preview" formnovalidate class="btn btn-ghost btn-sm"${addAttribute(jobActive, "disabled")} data-submit-preview data-astro-cid-5olt6jft> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "13", "height": "13", "data-astro-cid-5olt6jft": true })}${dt("Preview")} </button> <button type="submit" name="action" value="start" class="btn btn-accent btn-sm"${addAttribute(jobActive, "disabled")} data-submit-start data-astro-cid-5olt6jft> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:play-fill", "width": "13", "height": "13", "data-astro-cid-5olt6jft": true })} <span data-start-label data-astro-cid-5olt6jft>${jobActive ? dt("A job is already running") : dt("Start")}</span> </button> </div> </section> </form> <div class="br-side" data-astro-cid-5olt6jft> ${job && renderTemplate`<section class="sx-panel br-job" id="br-status-card" aria-labelledby="br-job-title"${addAttribute(`/dash/guild/${guildId}/bulk-role-status`, "data-status-url")}${addAttribute(jobActive ? "true" : "false", "data-live")}${addAttribute(job.id, "data-job-id")}${addAttribute(state, "data-state")} data-astro-cid-5olt6jft> <div class="sx-panel-head" data-astro-cid-5olt6jft> <span class="sx-panel-icon" data-status-icon${addAttribute(`--c:${colorOf(state)}`, "style")} data-astro-cid-5olt6jft> <span data-job-icon="active"${addAttribute({ "br-icon-hidden": !(jobActive && !job.paused) }, "class:list")} data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:spinner-gap", "width": "17", "height": "17", "class": "br-spin", "data-astro-cid-5olt6jft": true })}</span> <span data-job-icon="paused"${addAttribute({ "br-icon-hidden": !(jobActive && job.paused) }, "class:list")} data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pause-fill", "width": "17", "height": "17", "data-astro-cid-5olt6jft": true })}</span> <span data-job-icon="completed"${addAttribute({ "br-icon-hidden": job.status !== "completed" }, "class:list")} data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-fill", "width": "17", "height": "17", "data-astro-cid-5olt6jft": true })}</span> <span data-job-icon="failed"${addAttribute({ "br-icon-hidden": job.status !== "failed" }, "class:list")} data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-fill", "width": "17", "height": "17", "data-astro-cid-5olt6jft": true })}</span> <span data-job-icon="other"${addAttribute({ "br-icon-hidden": job.status !== "cancelled" }, "class:list")} data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "17", "height": "17", "data-astro-cid-5olt6jft": true })}</span> </span> <h2 id="br-job-title" data-astro-cid-5olt6jft> <span data-job-title data-astro-cid-5olt6jft>${titleOf(job)}</span> <span class="br-role-chip" data-astro-cid-5olt6jft>${roleName(job.targetRoleId)}</span> </h2> </div> <div class="br-job-line" data-astro-cid-5olt6jft> <span class="br-status-label" data-status-text data-astro-cid-5olt6jft>${statusLabel[state]}</span> <span class="br-when"${addAttribute(fullDate(job.createdAt), "title")} data-astro-cid-5olt6jft>${agoText(dt, job.startedAt ?? job.createdAt, { locale })}</span> </div> <div data-astro-cid-5olt6jft> <div class="br-progress-track" role="progressbar"${addAttribute(dt("Progress"), "aria-label")} aria-valuemin="0" aria-valuemax="100"${addAttribute(percent(job), "aria-valuenow")} data-progress-bar data-astro-cid-5olt6jft> <div class="br-progress-fill" data-progress-fill${addAttribute(`width:${percent(job)}%`, "style")} data-astro-cid-5olt6jft></div> </div> <p class="br-progress-note" data-astro-cid-5olt6jft> <span data-progress-note aria-live="polite" data-astro-cid-5olt6jft>${job.status === "pending" ? dt("Waiting to start...") : dt("{done} / {total} members checked", { done: fmt(job.processedMembers), total: fmt(Math.max(job.totalMembers, job.processedMembers)) })}</span> <b data-progress-pct data-astro-cid-5olt6jft>${percent(job)}%</b> </p> </div> <dl class="br-stats" data-stats data-astro-cid-5olt6jft> <div data-astro-cid-5olt6jft><dt data-stat-label="changed" data-astro-cid-5olt6jft>${job.dryRun ? dt("Would change") : dt("Changed")}</dt><dd data-stat="changed" data-astro-cid-5olt6jft>${fmt(job.successCount)}</dd></div> <div data-astro-cid-5olt6jft><dt data-astro-cid-5olt6jft>${dt("Already fine")}</dt><dd data-stat="skipped" data-astro-cid-5olt6jft>${fmt(job.skippedCount)}</dd></div> <div data-astro-cid-5olt6jft><dt data-stat-label="third" data-astro-cid-5olt6jft>${job.dryRun ? dt("Not matching") : dt("Failed")}</dt><dd data-stat="third" data-astro-cid-5olt6jft>${fmt(job.dryRun ? filtered(job) : job.errorCount)}</dd></div> <div data-astro-cid-5olt6jft><dt data-stat-label="time" data-astro-cid-5olt6jft>${jobActive ? dt("Time left") : dt("Took")}</dt><dd data-stat="time" data-astro-cid-5olt6jft>${jobActive ? left !== null ? shortDuration(left) : "-" : took !== null ? shortDuration(took) : "-"}</dd></div> </dl> ${job.reason && renderTemplate`<p class="br-meta" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:note-pencil-bold", "width": "13", "height": "13", "data-astro-cid-5olt6jft": true })}<span data-astro-cid-5olt6jft>${dt("Reason")}: ${job.reason}</span></p>`} <p class="br-error-note" data-error-note${addAttribute(job.status !== "failed" || !failureText(job), "hidden")} role="alert" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "14", "height": "14", "data-astro-cid-5olt6jft": true })}<span data-error-text data-astro-cid-5olt6jft>${failureText(job)}</span></p> <div class="br-actions" data-job-actions${addAttribute(!jobActive, "hidden")} data-astro-cid-5olt6jft> <form method="POST" data-no-dirty data-form-pause${addAttribute(job.paused, "hidden")} data-astro-cid-5olt6jft> <input type="hidden" name="action" value="pause" data-astro-cid-5olt6jft> <button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pause-fill", "width": "13", "height": "13", "data-astro-cid-5olt6jft": true })}${dt("Pause")}</button> </form> <form method="POST" data-no-dirty data-form-resume${addAttribute(!job.paused, "hidden")} data-astro-cid-5olt6jft> <input type="hidden" name="action" value="resume" data-astro-cid-5olt6jft> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:play-fill", "width": "13", "height": "13", "data-astro-cid-5olt6jft": true })}${dt("Resume")}</button> </form> <form method="POST" data-no-dirty data-astro-cid-5olt6jft> <input type="hidden" name="action" value="cancel" data-astro-cid-5olt6jft> <button type="submit" class="btn btn-ghost btn-sm br-cancel" data-astro-cid-5olt6jft>${dt("Cancel")}</button> </form> </div> ${job.dryRun && job.status === "completed" && renderTemplate`<form method="POST" class="br-run-preview" data-no-dirty data-astro-cid-5olt6jft> <input type="hidden" name="action" value="run_preview" data-astro-cid-5olt6jft> <input type="hidden" name="preview_id"${addAttribute(job.id, "value")} data-astro-cid-5olt6jft> <p data-astro-cid-5olt6jft>${dt("Nothing was changed. Run it for real with the same settings?")}</p> <button type="submit" class="btn btn-accent btn-sm"${addAttribute(job.successCount === 0, "disabled")} data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:play-fill", "width": "13", "height": "13", "data-astro-cid-5olt6jft": true })}${dt("Run it for real")}</button> </form>`} </section>`} <section class="sx-panel br-history" aria-labelledby="br-history-title" data-astro-cid-5olt6jft> <div class="sx-panel-head" data-astro-cid-5olt6jft> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "17", "height": "17", "data-astro-cid-5olt6jft": true })}</span> <h2 id="br-history-title" data-astro-cid-5olt6jft>${dt("Recent jobs")}</h2> ${history.length > 0 && renderTemplate`<span class="br-count" data-astro-cid-5olt6jft>${history.length}</span>`} </div> ${history.length === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "18", "height": "18", "data-astro-cid-5olt6jft": true })}${dt("No earlier jobs.")}</p>` : renderTemplate`<ul class="br-history-list dgl-stagger" data-astro-cid-5olt6jft> ${history.map((j) => renderTemplate`<li${addAttribute(`--c:${colorOf(j.status)}`, "style")} data-astro-cid-5olt6jft> <div class="br-history-main" data-astro-cid-5olt6jft> <span class="br-history-title" data-astro-cid-5olt6jft>${titleOf(j)}</span> <span class="br-role-chip" data-astro-cid-5olt6jft>${roleName(j.targetRoleId)}</span> </div> <div class="br-history-meta" data-astro-cid-5olt6jft> <span class="br-badge" data-astro-cid-5olt6jft>${statusLabel[j.status]}</span> <span data-astro-cid-5olt6jft>${j.dryRun ? dt("{n} would change", { n: fmt(j.successCount) }) : dt("{n} changed, {m} failed", { n: fmt(j.successCount), m: fmt(j.errorCount) })}</span> <span class="br-history-when"${addAttribute(fullDate(j.finishedAt ?? j.createdAt), "title")} data-astro-cid-5olt6jft>${agoText(dt, j.finishedAt ?? j.createdAt, { locale })}</span> </div> ${j.status === "failed" && failureText(j) && renderTemplate`<p class="br-error-note" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "14", "height": "14", "data-astro-cid-5olt6jft": true })}<span data-astro-cid-5olt6jft>${failureText(j)}</span></p>`} </li>`)} </ul>`} </section> <section class="sx-panel br-how" aria-labelledby="br-how-title" data-astro-cid-5olt6jft> <div class="sx-panel-head" data-astro-cid-5olt6jft><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-5olt6jft": true })}</span><h2 id="br-how-title" data-astro-cid-5olt6jft>${dt("How a job runs")}</h2></div> <ul class="br-how-list" data-astro-cid-5olt6jft> <li data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "15", "height": "15", "data-astro-cid-5olt6jft": true })}<span data-astro-cid-5olt6jft>${dt("Preview counts how many members would change and touches nobody.")}</span></li> <li data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:play-fill", "width": "15", "height": "15", "data-astro-cid-5olt6jft": true })}<span data-astro-cid-5olt6jft>${dt("A job runs in the background, one at a time per server, and goes on by itself if Petto restarts.")}</span></li> <li data-astro-cid-5olt6jft>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hourglass-medium-fill", "width": "15", "height": "15", "data-astro-cid-5olt6jft": true })}<span data-astro-cid-5olt6jft>${dt("Large servers can take a few minutes: Discord paces it.")}</span></li> </ul> </section> </div> </div> </div>  ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashBulkRole.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$BulkRole = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BulkRole;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  const jobsUrl = `${apiUrl}/rest/v1/bulk_role_jobs`;
  const here = Astro2.url.pathname;
  async function activeJob() {
    const res = await fetch(`${jobsUrl}?guild_id=eq.${encodeURIComponent(id)}&status=in.(pending,running)&order=created_at.desc&limit=1`, { headers: apiHeaders });
    const rows = res.ok ? await res.json() : [];
    return rows[0] ?? null;
  }
  const back = (word, kind) => Astro2.redirect(`${here}?${kind}=${word}`, 303);
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    if (action === "cancel" || action === "pause" || action === "resume") {
      const patch = action === "cancel" ? { status: "cancelled", finished_at: (/* @__PURE__ */ new Date()).toISOString() } : { paused: action === "pause" };
      const res = await fetch(`${jobsUrl}?guild_id=eq.${encodeURIComponent(id)}&status=in.(pending,running)`, {
        method: "PATCH",
        headers: { ...apiHeaders, Prefer: "return=minimal" },
        body: JSON.stringify(patch)
      });
      return back(res.ok ? action === "cancel" ? "cancelled" : action === "pause" ? "paused" : "resumed" : "save_failed", res.ok ? "ok" : "error");
    }
    if (action === "start" || action === "preview" || action === "run_preview") {
      if (await activeJob()) return back("busy", "error");
      let row;
      let targetRoleId;
      let roleAction;
      if (action === "run_preview") {
        const previewId = Number(form.get("preview_id"));
        const res2 = Number.isInteger(previewId) ? await fetch(`${jobsUrl}?id=eq.${previewId}&guild_id=eq.${encodeURIComponent(id)}&dry_run=eq.true&limit=1`, { headers: apiHeaders }) : null;
        const source = res2?.ok ? (await res2.json())[0] : null;
        if (!source) return back("no_preview", "error");
        row = {
          guild_id: id,
          action: source.action,
          target_role_id: source.target_role_id,
          member_type: source.member_type,
          filter_role_ids: source.filter_role_ids,
          filter_mode: source.filter_mode,
          filter_exclude: source.filter_exclude,
          joined_after: source.joined_after,
          joined_before: source.joined_before,
          min_roles: source.min_roles,
          max_roles: source.max_roles,
          skip_pending: source.skip_pending,
          reason: source.reason,
          notify_channel_id: source.notify_channel_id,
          dry_run: false,
          started_by: session.userId,
          source: "dashboard"
        };
        targetRoleId = String(source.target_role_id);
        roleAction = source.action === "remove" ? "remove" : "add";
      } else {
        targetRoleId = String(form.get("target_role_id") ?? "").trim();
        roleAction = String(form.get("role_action") ?? "add") === "remove" ? "remove" : "add";
        if (!/^\d{15,25}$/.test(targetRoleId)) return back("pick_role", "error");
        const memberType = ["all", "bots", "humans"].includes(String(form.get("member_type"))) ? String(form.get("member_type")) : "all";
        const filterRoleIds = [...new Set(form.getAll("filter_role_ids").map(String).filter((value) => /^\d{15,25}$/.test(value)))].slice(0, 25);
        const joinedAfter = parseDay(form.get("joined_after"));
        const joinedBefore = parseDay(form.get("joined_before"));
        if (joinedAfter === void 0 || joinedBefore === void 0) return back("bad_date", "error");
        if (joinedAfter && joinedBefore && joinedAfter > joinedBefore) return back("date_order", "error");
        const minRoles = parseRoleCount(form.get("min_roles"));
        const maxRoles = parseRoleCount(form.get("max_roles"));
        if (minRoles === void 0 || maxRoles === void 0) return back("bad_count", "error");
        if (minRoles !== null && maxRoles !== null && minRoles > maxRoles) return back("count_order", "error");
        const reason = String(form.get("reason") ?? "").trim().slice(0, 300);
        const notifyChannelId = /^\d{15,25}$/.test(String(form.get("notify_channel_id") ?? "")) ? String(form.get("notify_channel_id")) : null;
        row = {
          guild_id: id,
          action: roleAction,
          target_role_id: targetRoleId,
          member_type: memberType,
          filter_role_ids: filterRoleIds,
          filter_mode: String(form.get("filter_mode") ?? "any") === "all" ? "all" : "any",
          filter_exclude: form.get("filter_exclude") === "on",
          joined_after: joinedAfter,
          joined_before: joinedBefore,
          min_roles: minRoles,
          max_roles: maxRoles,
          skip_pending: form.get("skip_pending") === "on",
          reason: reason || null,
          notify_channel_id: notifyChannelId,
          dry_run: action === "preview",
          started_by: session.userId,
          source: "dashboard"
        };
      }
      const rolesRes2 = await getGuildList(Astro2, id, botToken, "roles");
      const guildRoles = rolesRes2.ok ? await rolesRes2.json() : [];
      const role = guildRoles.find((each) => String(each.id) === targetRoleId);
      if (rolesRes2.ok && !role) return back("role_gone", "error");
      const block = rolesRes2.ok ? roleBlocks(guildRoles, id)[targetRoleId] : void 0;
      if (block) return back(`role_${block}`, "error");
      if (action === "start" && roleAction === "add" && role && dangerousPermissionsOf(role.permissions).length && form.get("confirm_danger") !== "on") return back("confirm_danger", "error");
      if (action === "run_preview") row.dry_run = false;
      const res = await fetch(jobsUrl, { method: "POST", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(row) });
      return back(res.ok ? action === "preview" ? "previewed" : "started" : "save_failed", res.ok ? "ok" : "error");
    }
  }
  const [guildInfo, rolesRes, channelsRes, jobsRes] = await Promise.all([
    getGuildInfo(id, botToken),
    getGuildList(Astro2, id, botToken, "roles"),
    getGuildList(Astro2, id, botToken, "channels"),
    fetch(`${jobsUrl}?guild_id=eq.${encodeURIComponent(id)}&order=created_at.desc&limit=8`, { headers: apiHeaders })
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const blocks = roleBlocks(allRoles, id);
  const roles = allRoles.filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: String(r.id), name: String(r.name), color: Number(r.color ?? 0), memberRisk: dangerousPermissionsOf(r.permissions), blocked: blocks[String(r.id)] ?? null }));
  const allChannels = channelsRes.ok ? await channelsRes.json() : [];
  const channels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: String(c.id), name: String(c.name) }));
  const jobRows = jobsRes.ok ? await jobsRes.json() : [];
  const jobs = jobRows.map((row) => shapeJob(row)).filter((job) => Boolean(job));
  const flash = Astro2.url.searchParams.get("ok") ?? null;
  const error = Astro2.url.searchParams.get("error") ?? null;
  return renderTemplate`${renderComponent($$result, "DashBulkRole", $$DashBulkRole, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "roles": roles, "channels": channels, "jobs": jobs, "flash": flash, "error": error, "today": (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/bulk-role.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/bulk-role.astro";
const $$url = "/dash/guild/[id]/bulk-role";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BulkRole,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
