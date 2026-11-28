import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                                  */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList, k as getGuildDetails } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { d as describeTeam } from '../../../../chunks/team_C2OWrCGw.mjs';
import { b as getCachedUserGuilds } from '../../../../chunks/discordCache_CnRINZ-g.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
export { renderers } from '../../../../renderers.mjs';

// Role triggers ("a member who is given this role, or holds it when they finish Discord's onboarding, gets this action"). The rules are the
// bot's (petto-bot src/utils/roleTriggers.js and src/db/roleTriggers.js, table `role_triggers`): keep both equal. Plain JavaScript so
// scripts/check-dash-role-triggers.mjs runs it with node alone.

const ACTIONS = Object.freeze(['warn', 'mute', 'jail', 'kick', 'ban', 'remove_role']);
const TRIGGERS = Object.freeze(['role_added', 'onboarding', 'either']);
const DURATION_ACTIONS = Object.freeze(['mute', 'jail', 'ban']);
const MAX_RULES = 25;
const MAX_REASON = 200;
const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;
const SNOWFLAKE = /^\d{15,25}$/;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Every way of writing a unit, as the bot reads them (English, Spanish and Portuguese).
const UNITS = new Map();
for (const [names, value] of [
  [['ms', 'msec', 'millisecond', 'milliseconds', 'milisegundo', 'milisegundos'], 1],
  [['s', 'sec', 'secs', 'second', 'seconds', 'seg', 'segs', 'segundo', 'segundos'], SECOND],
  [['m', 'min', 'mins', 'minute', 'minutes', 'minuto', 'minutos'], MINUTE],
  [['h', 'hr', 'hrs', 'hour', 'hours', 'hora', 'horas'], HOUR],
  [['d', 'day', 'days', 'dia', 'dias', 'día', 'días'], DAY],
  [['w', 'wk', 'wks', 'week', 'weeks', 'sem', 'semana', 'semanas'], 7 * DAY],
  [['mo', 'month', 'months', 'mes', 'meses', 'mês'], 30 * DAY],
  [['y', 'yr', 'yrs', 'year', 'years', 'año', 'años', 'ano', 'anos'], 365 * DAY],
]) for (const name of names) UNITS.set(name, value);

const PIECE = /(\d+(?:[.,]\d+)?)\s*([a-záéíóúñêç]+)/giy;
const GLUE = /^[\s,]*(?:and|y|e)?[\s,]*/i;

/**
 * A length of time as people write it ("10m", "2h", "7d", "3d 4h", "1h30m", "1 hour 30 minutes") in milliseconds, or null when it is not valid
 * or not positive. The bot also falls back on the `ms` library for a bare number; here a number without a unit is refused (it is ambiguous).
 * @param {unknown} input
 * @returns {number | null}
 */
function parseDuration(input) {
  const text = String(input ?? '').trim().toLowerCase();
  if (!text || text.length > 64) return null;
  let total = 0;
  let index = 0;
  let pieces = 0;
  while (index < text.length) {
    index += (GLUE.exec(text.slice(index)) ?? [''])[0].length;
    if (index >= text.length) break;
    PIECE.lastIndex = index;
    const match = PIECE.exec(text);
    if (!match) return null;
    const unit = UNITS.get(match[2]);
    if (!unit) return null;
    total += Number(match[1].replace(',', '.')) * unit;
    index = PIECE.lastIndex;
    pieces += 1;
  }
  return pieces > 0 && Number.isFinite(total) && total > 0 ? Math.round(total) : null;
}

/**
 * The same checks as the bot's `validateRule`. `role` has `id` and `managed` (null when the role is not in the server); `existingRoleIds` are the
 * roles that already have a rule. Returns `{ ok: true, rule }` (`rule` is what is saved: `role_id`, `action`, `duration_ms`, `reason`, `on_event`)
 * or `{ ok: false, error }` (the same words as the bot's `automation.roletrigger.error.<error>`).
 * @param {{ role: { id: string, managed?: boolean } | null, guildId: string, action: unknown, duration?: unknown, reason?: unknown, on?: unknown, existingRoleIds?: string[] }} input
 */
function validateRule({ role, guildId, action, duration = null, reason = null, on = 'role_added', existingRoleIds = [] }) {
  if (!role) return { ok: false, error: 'noRole' };
  if (role.id === guildId) return { ok: false, error: 'everyone' };
  if (role.managed) return { ok: false, error: 'managed' };
  if (!ACTIONS.includes(/** @type {string} */ (action))) return { ok: false, error: 'badAction' };
  if (!TRIGGERS.includes(/** @type {string} */ (on))) return { ok: false, error: 'badOn' };
  if (!existingRoleIds.includes(role.id) && existingRoleIds.length >= MAX_RULES) return { ok: false, error: 'tooMany' };
  let durationMs = null;
  if (duration) {
    if (!DURATION_ACTIONS.includes(/** @type {string} */ (action))) return { ok: false, error: 'noDuration' };
    durationMs = parseDuration(duration);
    if (!durationMs) return { ok: false, error: 'badDuration' };
    if (action === 'mute' && durationMs > MAX_TIMEOUT_MS) return { ok: false, error: 'timeoutCap' };
  }
  const text = reason ? String(reason).trim() : '';
  if (text.length > MAX_REASON) return { ok: false, error: 'reasonLong' };
  return { ok: true, rule: { role_id: role.id, action, duration_ms: durationMs, reason: text || null, on_event: on } };
}

/**
 * A row of `role_triggers` made safe to draw: unknown actions and triggers are shown as they are never (they fall back), numbers are numbers.
 * @param {any} row
 */
function cleanRule(row) {
  return {
    roleId: String(row?.role_id ?? ''),
    action: ACTIONS.includes(row?.action) ? String(row.action) : 'warn',
    durationMs: Number(row?.duration_ms) > 0 ? Number(row.duration_ms) : 0,
    reason: row?.reason ? String(row.reason).slice(0, MAX_REASON) : '',
    on: TRIGGERS.includes(row?.on_event) ? String(row.on_event) : 'role_added',
  };
}

/**
 * Whether the visitor may change role triggers: the bot asks for Administrator (the server owner has it too). `permissions` is the number Discord
 * gives for the visitor in the server (the list of their servers).
 * @param {{ owner?: boolean, permissions?: string } | null | undefined} guild
 */
function canEditRoleTriggers(guild) {
  if (!guild) return false;
  if (guild.owner) return true;
  try { return (BigInt(guild.permissions ?? '0') & 0x8n) === 0x8n; } catch { return false; }
}


// ---- The safety stop (the circuit breaker): how many actions a minute before the rules of the server pause. The same numbers as the bot (utils/roleTriggers.js).
const MIN_LIMIT = 1;
const MAX_LIMIT = 500;
const BREAKER_PAUSE_MINUTES = 10;
/** The line of members over the limit holds what the limit can handle in this many minutes (the bot: QUEUE_MINUTES). */
const QUEUE_MINUTES = 10;

/** What a server gets when it did not choose: it grows with the size of the server. */
function defaultLimit(memberCount) {
  const count = Number(memberCount) || 0;
  if (count >= 25_000) return 40;
  if (count >= 5_000) return 20;
  if (count >= 1_000) return 10;
  return 5;
}

/** The number a person typed, or null when it is not a whole number from MIN_LIMIT to MAX_LIMIT. */
function parseLimit(input) {
  const text = String(input ?? '').trim();
  if (!/^\d{1,3}$/.test(text)) return null;
  const value = Number(text);
  return value >= MIN_LIMIT && value <= MAX_LIMIT ? value : null;
}

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashRoleTriggers = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashRoleTriggers;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const docsUrl = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/moderation/role-triggers`;
  const { user, guildId, guildName, guildIcon, rules, roles, state, canEdit, message, max, limit, activity } = Astro2.props;
  const shownLimit = limit.chosen ?? limit.fallback;
  const actions = [
    { id: "warn", label: dt("Warn") },
    { id: "mute", label: dt("Mute") },
    { id: "jail", label: dt("Jail") },
    { id: "kick", label: dt("Kick") },
    { id: "ban", label: dt("Ban") },
    { id: "remove_role", label: dt("Remove the role") }
  ];
  const moments = [
    { id: "role_added", label: dt("When it is given") },
    { id: "onboarding", label: dt("When onboarding is finished") },
    { id: "either", label: dt("When it is given or onboarding is finished") }
  ];
  const typeLabel = (type) => ({ warn: dt("Warn"), mute: dt("Mute"), tempmute: dt("Mute"), jail: dt("Jail"), kick: dt("Kick"), ban: dt("Ban"), tempban: dt("Ban") })[type] ?? type;
  const when = (iso) => {
    const date = new Date(iso);
    return Number.isFinite(date.getTime()) ? date.toLocaleString(dashLang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  };
  const label = (list, id) => list.find((item) => item.id === id)?.label ?? id;
  const hex = (color) => color > 0 ? `#${color.toString(16).padStart(6, "0")}` : "#99aab5";
  const ready = state === "ok";
  const editable = ready && canEdit;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "role-triggers", "pageTitle": dt("Role triggers"), "data-astro-cid-ioo4y42i": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="rt" data-astro-cid-ioo4y42i> <header class="rt-head" data-astro-cid-ioo4y42i> <h1 data-astro-cid-ioo4y42i>${dt("Role triggers")}</h1> <a class="btn btn-sm rt-docs"${addAttribute(docsUrl, "href")} target="_blank" rel="noopener" data-astro-cid-ioo4y42i>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13", "data-astro-cid-ioo4y42i": true })}${dt("Read the docs")}</a> </header> ${message && renderTemplate`<div${addAttribute(["rt-flash", { "rt-flash-err": message.kind === "err" }], "class:list")} role="status" data-astro-cid-ioo4y42i>${renderComponent($$result2, "Icon", $$Icon, { "name": message.kind === "ok" ? "ph:check-circle-fill" : "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-ioo4y42i": true })}${message.text}</div>`} ${state === "unavailable" && renderTemplate`<div class="rt-flash rt-flash-warn" data-astro-cid-ioo4y42i>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-ioo4y42i": true })}${dt("Role triggers are not available yet. Petto is being updated: try again in a few minutes.")}</div>`} ${state === "error" && renderTemplate`<div class="rt-flash rt-flash-warn" data-astro-cid-ioo4y42i>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-ioo4y42i": true })}${dt("The role triggers could not be read. Try again in a moment.")}</div>`} ${ready && !canEdit && renderTemplate`<div class="rt-flash rt-flash-warn" data-rt-readonly data-astro-cid-ioo4y42i>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "15", "height": "15", "data-astro-cid-ioo4y42i": true })}${dt("Only administrators can change role triggers, the same as the command. You can look at the rules.")}</div>`} <div class="rt-grid" data-astro-cid-ioo4y42i> <div class="rt-left" data-astro-cid-ioo4y42i> <section class="rt-card rt-list" data-astro-cid-ioo4y42i> <div class="rt-card-head" data-astro-cid-ioo4y42i> <h2 data-astro-cid-ioo4y42i>${dt("Rules")}</h2> <span${addAttribute(["rt-count", { "rt-count-full": rules.length >= max }], "class:list")} data-astro-cid-ioo4y42i>${dt("{n} of {max}", { n: rules.length, max })}</span> </div> ${rules.length === 0 ? renderTemplate`<p class="rt-empty" data-astro-cid-ioo4y42i>${ready ? dt("No role triggers yet. Add the first one with the form.") : dt("There are no rules to show.")}</p>` : renderTemplate`<ul class="rt-rules" data-astro-cid-ioo4y42i> ${rules.map((rule) => renderTemplate`<li class="rt-rule" data-rt-rule data-astro-cid-ioo4y42i> <div class="rt-rule-main" data-astro-cid-ioo4y42i> <span${addAttribute(["rt-role", { "rt-role-gone": rule.roleName === null }], "class:list")}${addAttribute(`--c:${hex(rule.roleColor)}`, "style")} data-astro-cid-ioo4y42i> <i aria-hidden="true" data-astro-cid-ioo4y42i></i><b data-astro-cid-ioo4y42i>${rule.roleName ?? dt("Deleted role")}</b> </span> <span${addAttribute(["rt-action", `rt-action-${rule.action}`], "class:list")} data-astro-cid-ioo4y42i>${label(actions, rule.action)}</span> ${rule.durationMs > 0 && renderTemplate`<span class="rt-duration" data-astro-cid-ioo4y42i>${formatDuration(rule.durationMs / 1e3)}</span>`} </div> <p class="rt-when" data-astro-cid-ioo4y42i>${label(moments, rule.on)}${rule.reason ? renderTemplate`<span class="rt-reason" data-astro-cid-ioo4y42i> · ${rule.reason}</span>` : null}</p> ${editable && renderTemplate`<form method="POST" class="rt-remove" data-no-dirty data-astro-cid-ioo4y42i> <input type="hidden" name="action" value="remove" data-astro-cid-ioo4y42i> <input type="hidden" name="role_id"${addAttribute(rule.roleId, "value")} data-astro-cid-ioo4y42i> <button class="btn btn-ghost btn-sm" type="submit"${addAttribute(dt("Remove the rule of this role?"), "data-confirm")}${addAttribute(dt("Remove"), "aria-label")} data-astro-cid-ioo4y42i>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-bold", "width": "13", "height": "13", "data-astro-cid-ioo4y42i": true })}<span data-astro-cid-ioo4y42i>${dt("Remove")}</span></button> </form>`} </li>`)} </ul>`} </section> <section class="rt-card rt-stop" data-rt-stop data-astro-cid-ioo4y42i> <div class="rt-card-head" data-astro-cid-ioo4y42i><h2 data-astro-cid-ioo4y42i>${dt("Safety stop")}</h2></div> <form method="POST" class="rt-stop-form" data-no-dirty data-astro-cid-ioo4y42i> <p data-astro-cid-ioo4y42i>${dt("Past this many actions a minute, the rest wait in line.")}</p> <div class="rt-stop-row" data-astro-cid-ioo4y42i> <label class="rt-field" data-astro-cid-ioo4y42i><span data-astro-cid-ioo4y42i>${dt("Actions a minute")}</span> <input type="number" name="limit"${addAttribute(limit.min, "min")}${addAttribute(limit.max, "max")} step="1"${addAttribute(shownLimit, "value")} inputmode="numeric" required${addAttribute(!editable || !limit.available, "disabled")} data-astro-cid-ioo4y42i> </label> <button class="btn btn-accent btn-sm" type="submit" name="action" value="set_limit"${addAttribute(!editable || !limit.available, "disabled")} data-astro-cid-ioo4y42i>${dt("Save limit")}</button> ${limit.chosen !== null && renderTemplate`<button class="btn btn-sm" type="submit" name="action" value="reset_limit" formnovalidate${addAttribute(!editable || !limit.available, "disabled")} data-astro-cid-ioo4y42i>${dt("Use the default")}</button>`} </div> <p class="rt-hint" data-astro-cid-ioo4y42i>${limit.chosen !== null ? dt("Default for its size: {n}.", { n: limit.fallback }) : dt("Default for this size.")}</p> </form> </section> </div> <div class="rt-right" data-astro-cid-ioo4y42i> <section class="rt-card rt-add" data-rt-add data-astro-cid-ioo4y42i> <div class="rt-card-head" data-astro-cid-ioo4y42i><h2 data-astro-cid-ioo4y42i>${dt("Add a rule")}</h2></div> <form method="POST" class="rt-form" data-no-dirty data-astro-cid-ioo4y42i> <input type="hidden" name="action" value="add" data-astro-cid-ioo4y42i> <label class="rt-field" data-astro-cid-ioo4y42i><span data-astro-cid-ioo4y42i>${dt("Role")}</span> <select name="role_id" required${addAttribute(!editable, "disabled")} data-astro-cid-ioo4y42i> <option value="" data-astro-cid-ioo4y42i>${dt("Choose a role")}</option> ${roles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")} data-astro-cid-ioo4y42i>${role.hasRule ? dt("{name} (replaces its rule)", { name: role.name }) : role.name}</option>`)} </select> </label> <label class="rt-field" data-astro-cid-ioo4y42i><span data-astro-cid-ioo4y42i>${dt("Action")}</span> <select name="rule_action"${addAttribute(!editable, "disabled")} data-rt-action data-astro-cid-ioo4y42i> ${actions.map((a) => renderTemplate`<option${addAttribute(a.id, "value")} data-astro-cid-ioo4y42i>${a.label}</option>`)} </select> </label> <label class="rt-field rt-duration-field" data-astro-cid-ioo4y42i><span data-astro-cid-ioo4y42i>${dt("Duration")}</span> <input type="text" name="duration" maxlength="64" placeholder="1h, 12h, 1d" autocomplete="off"${addAttribute(!editable, "disabled")} data-astro-cid-ioo4y42i> <em data-astro-cid-ioo4y42i>${dt("Optional. Empty means no end. A mute can last up to 28 days; a ban with a duration is a temporary ban.")}</em> </label> <label class="rt-field" data-astro-cid-ioo4y42i><span data-astro-cid-ioo4y42i>${dt("When")}</span> <select name="on"${addAttribute(!editable, "disabled")} data-astro-cid-ioo4y42i> ${moments.map((m) => renderTemplate`<option${addAttribute(m.id, "value")} data-astro-cid-ioo4y42i>${m.label}</option>`)} </select> </label> <label class="rt-field" data-astro-cid-ioo4y42i><span data-astro-cid-ioo4y42i>${dt("Reason")}</span> <input type="text" name="reason"${addAttribute(MAX_REASON, "maxlength")}${addAttribute(dt("Optional, added to the case"), "placeholder")} autocomplete="off"${addAttribute(!editable, "disabled")} data-astro-cid-ioo4y42i> </label> <button class="btn btn-accent btn-sm" type="submit"${addAttribute(!editable || rules.length >= max, "disabled")} data-astro-cid-ioo4y42i>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-ioo4y42i": true })}${dt("Add rule")}</button> <p class="rt-hint" data-astro-cid-ioo4y42i>${dt("A role has one rule: adding it again replaces the old one.")}</p> </form> </section> </div> </div> <section class="rt-card rt-activity" data-astro-cid-ioo4y42i> <div class="rt-card-head" data-astro-cid-ioo4y42i><h2 data-astro-cid-ioo4y42i>${dt("Recent activity")}</h2></div> ${activity.length === 0 ? renderTemplate`<div class="rt-activity-empty" data-astro-cid-ioo4y42i>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lightning-fill", "width": "22", "height": "22", "data-astro-cid-ioo4y42i": true })}<p data-astro-cid-ioo4y42i>${dt("Nothing yet. What the rules do shows up here.")}</p></div>` : renderTemplate`<ul class="rt-acts" data-astro-cid-ioo4y42i> ${activity.map((item) => renderTemplate`<li class="rt-act" data-astro-cid-ioo4y42i> <span class="rt-act-who" data-astro-cid-ioo4y42i>${item.avatar ? renderTemplate`<img${addAttribute(item.avatar, "src")} alt="" width="20" height="20" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-ioo4y42i>` : renderTemplate`<i aria-hidden="true" data-astro-cid-ioo4y42i></i>`}<b data-astro-cid-ioo4y42i>${item.name}</b></span> <span${addAttribute(["rt-action", `rt-action-${item.type.replace(/^temp/, "")}`], "class:list")} data-astro-cid-ioo4y42i>${typeLabel(item.type)}</span> <span class="rt-act-why" data-astro-cid-ioo4y42i>${item.reason}</span> <time class="rt-act-when"${addAttribute(item.at, "datetime")} data-astro-cid-ioo4y42i>${when(item.at)}</time> </li>`)} </ul>`} </section> </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashRoleTriggers.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$RoleTriggers = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$RoleTriggers;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  let canEdit = false;
  if (!auth.devView && !auth.access) {
    const guilds = await getCachedUserGuilds(session.accessToken, Astro2.request, { forAccess: true }).catch(() => []);
    canEdit = canEditRoleTriggers(guilds.find((g) => g.id === id));
  }
  const errors = {
    noRole: dt("That role does not exist."),
    everyone: dt("@everyone cannot be a trigger."),
    managed: dt("A role that an integration manages cannot be a trigger."),
    badAction: dt("That action is not valid."),
    badOn: dt("That moment is not valid."),
    tooMany: dt("A server can have up to {max} role triggers. Remove one first.", { max: MAX_RULES }),
    noDuration: dt("Only mute, jail and ban take a duration."),
    badDuration: dt("That duration is not valid. Use something like 1h, 12h or 1d."),
    timeoutCap: dt("Discord timeouts cannot exceed 28 days."),
    reasonLong: dt("The reason can have up to 200 characters.")
  };
  const tableMissing = (res, body) => Boolean(res && (res.status === 404 || ["PGRST205", "42P01"].includes(String(body?.code ?? ""))));
  let message = null;
  let missingAfterWrite = false;
  const [guildInfo, rolesRes] = await Promise.all([getGuildInfo(id, botToken), getGuildList(Astro2, id, botToken, "roles")]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const allRoles = rolesRes.ok ? await rolesRes.json().catch(() => []) : [];
  const roleById = new Map(allRoles.map((r) => [String(r.id), r]));
  const readRules = async () => {
    const res = await fetch(`${apiUrl}/rest/v1/role_triggers?guild_id=eq.${id}&select=*&order=created_at.asc`, { headers: apiHeaders }).catch(() => null);
    const body = res ? await res.json().catch(() => null) : null;
    if (res?.ok && Array.isArray(body)) return { state: "ok", rows: body };
    return { state: tableMissing(res, body) ? "unavailable" : "error", rows: [] };
  };
  const readLimit = async () => {
    const res = await fetch(`${apiUrl}/rest/v1/role_trigger_settings?guild_id=eq.${id}&select=max_actions`, { headers: apiHeaders }).catch(() => null);
    const body = res ? await res.json().catch(() => null) : null;
    if (res?.ok && Array.isArray(body)) {
      const value = Number(body[0]?.max_actions);
      return { available: true, chosen: parseLimit(String(value)) };
    }
    return { available: false, chosen: null };
  };
  let loaded = await readRules();
  let limitState = await readLimit();
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    if (!canEdit) message = { kind: "err", text: dt("Only administrators can change role triggers, the same as the command.") };
    else if (loaded.state !== "ok") message = { kind: "err", text: loaded.state === "unavailable" ? dt("Role triggers are not available yet. Petto is being updated: try again in a few minutes.") : dt("The role triggers could not be read. Try again in a moment.") };
    else if (action === "add") {
      const roleId = String(form.get("role_id") ?? "");
      const found = SNOWFLAKE.test(roleId) ? roleById.get(roleId) : null;
      const actionName = String(form.get("rule_action") ?? "");
      const takesDuration = ["mute", "jail", "ban"].includes(actionName);
      const checked = validateRule({
        role: found ? { id: String(found.id), managed: Boolean(found.managed) } : null,
        guildId: id,
        action: actionName,
        duration: takesDuration ? String(form.get("duration") ?? "").trim() || null : null,
        reason: String(form.get("reason") ?? "").replace(/\u0000/g, "").replace(/\s+/g, " "),
        on: String(form.get("on") ?? "role_added"),
        existingRoleIds: loaded.rows.map((row) => String(row.role_id))
      });
      if (!checked.ok) message = { kind: "err", text: errors[checked.error] ?? dt("Something went wrong, try again.") };
      else {
        await ensureGuildRow(apiUrl, apiHeaders, id);
        const res = await fetch(`${apiUrl}/rest/v1/role_triggers?on_conflict=guild_id,role_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, ...checked.rule })
        }).catch(() => null);
        if (res?.ok) message = { kind: "ok", text: dt("Saved.") };
        else {
          missingAfterWrite = tableMissing(res, await res?.json().catch(() => null));
          message = { kind: "err", text: dt("Something went wrong, try again.") };
        }
      }
    } else if (action === "set_limit" || action === "reset_limit") {
      const value = action === "set_limit" ? parseLimit(form.get("limit")) : null;
      if (action === "set_limit" && value === null) message = { kind: "err", text: dt("The limit must be a whole number from {min} to {max}.", { min: MIN_LIMIT, max: MAX_LIMIT }) };
      else if (!limitState.available) message = { kind: "err", text: dt("Role triggers are not available yet. Petto is being updated: try again in a few minutes.") };
      else {
        await ensureGuildRow(apiUrl, apiHeaders, id);
        const res = action === "set_limit" ? await fetch(`${apiUrl}/rest/v1/role_trigger_settings?on_conflict=guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, max_actions: value, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) }).catch(() => null) : await fetch(`${apiUrl}/rest/v1/role_trigger_settings?guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders }).catch(() => null);
        if (res?.ok) {
          message = { kind: "ok", text: action === "set_limit" ? dt("Saved.") : dt("Back to the default.") };
          limitState = await readLimit();
        } else message = { kind: "err", text: dt("Something went wrong, try again.") };
      }
    } else if (action === "remove") {
      const roleId = String(form.get("role_id") ?? "");
      if (!SNOWFLAKE.test(roleId)) message = { kind: "err", text: dt("Something went wrong, try again.") };
      else {
        const res = await fetch(`${apiUrl}/rest/v1/role_triggers?guild_id=eq.${id}&role_id=eq.${roleId}`, { method: "DELETE", headers: apiHeaders }).catch(() => null);
        message = res?.ok ? { kind: "ok", text: dt("Rule removed.") } : { kind: "err", text: dt("Something went wrong, try again.") };
      }
    }
    if (message?.kind === "ok") loaded = await readRules();
  }
  if (missingAfterWrite) loaded = { state: "unavailable", rows: [] };
  const memberCount = Number((await getGuildDetails(id, botToken).catch(() => null))?.approximate_member_count) || 0;
  const activityRes = await fetch(`${apiUrl}/rest/v1/mod_actions?guild_id=eq.${id}&source=eq.roletrigger&select=case_number,type,user_id,reason,created_at&order=created_at.desc&limit=8`, { headers: apiHeaders }).catch(() => null);
  const activityRows = activityRes?.ok ? (await activityRes.json().catch(() => [])).filter((row) => row && SNOWFLAKE.test(String(row.user_id))) : [];
  const activityPeople = activityRows.length ? await describeTeam(botToken, [...new Set(activityRows.map((row) => String(row.user_id)))]).catch(() => /* @__PURE__ */ new Map()) : /* @__PURE__ */ new Map();
  const activity = activityRows.map((row) => {
    const person = activityPeople.get(String(row.user_id));
    return {
      caseNumber: Number(row.case_number) || 0,
      type: String(row.type ?? ""),
      name: String(person?.displayName || person?.username || row.user_id),
      avatar: String(person?.avatarUrl ?? "").replace(/\?size=128$/, "?size=32"),
      reason: String(row.reason ?? "").replace(/^Role trigger:\s*/, ""),
      at: String(row.created_at ?? "")
    };
  });
  const rules = loaded.rows.map(cleanRule).map((rule) => {
    const role = roleById.get(rule.roleId);
    return { ...rule, roleName: role ? String(role.name) : null, roleColor: role && Number(role.color) > 0 ? Number(role.color) : 0 };
  });
  const used = new Set(rules.map((rule) => rule.roleId));
  const roles = allRoles.filter((role) => String(role.id) !== id && !role.managed).sort((a, b) => Number(b.position ?? 0) - Number(a.position ?? 0)).map((role) => ({ id: String(role.id), name: String(role.name), color: Number(role.color) > 0 ? Number(role.color) : 0, hasRule: used.has(String(role.id)) }));
  return renderTemplate`${renderComponent($$result, "DashRoleTriggers", $$DashRoleTriggers, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "rules": rules, "roles": roles, "activity": activity, "state": loaded.state, "canEdit": canEdit, "message": message, "max": MAX_RULES, "limit": { chosen: limitState.chosen, fallback: defaultLimit(memberCount), available: limitState.available, min: MIN_LIMIT, max: MAX_LIMIT, minutes: BREAKER_PAUSE_MINUTES, queueMinutes: QUEUE_MINUTES } })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/role-triggers.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/role-triggers.astro";
const $$url = "/dash/guild/[id]/role-triggers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$RoleTriggers,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
