import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                                */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { b as getCachedUserGuilds } from '../../../../chunks/discordCache_CnRINZ-g.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashRoleQuotas = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashRoleQuotas;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const docsUrl = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/moderation/role-quotas`;
  const { user, guildId, guildName, guildIcon, rules, roles, channels, places, state, canEdit, message, max, limits } = Astro2.props;
  const hex = (color) => color > 0 ? `#${color.toString(16).padStart(6, "0")}` : "#99aab5";
  const day = (iso) => {
    const date = iso ? new Date(iso) : null;
    return date && Number.isFinite(date.getTime()) ? date.toLocaleString(dashLang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  };
  const where = (rule) => rule.channelNames.length ? rule.channelNames.map((place) => place.category ? place.name : `#${place.name}`).join(", ") : dt("a channel that is gone");
  const ready = state === "ok";
  const editable = ready && canEdit;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "role-quotas", "pageTitle": dt("Role quotas"), "data-astro-cid-v4medkif": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="rq" data-astro-cid-v4medkif> <header class="rq-head" data-astro-cid-v4medkif> <h1 data-astro-cid-v4medkif>${dt("Role quotas")}</h1> <a class="btn btn-sm rq-docs"${addAttribute(docsUrl, "href")} target="_blank" rel="noopener" data-astro-cid-v4medkif>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13", "data-astro-cid-v4medkif": true })}${dt("Read the docs")}</a> </header> <p class="rq-lead" data-astro-cid-v4medkif>${dt("Ask a role for a number of messages in each period. A member who falls short too many periods in a row loses the role.")}</p> ${message && renderTemplate`<div${addAttribute(["rq-flash", { "rq-flash-err": message.kind === "err" }], "class:list")} role="status" data-astro-cid-v4medkif>${renderComponent($$result2, "Icon", $$Icon, { "name": message.kind === "ok" ? "ph:check-circle-fill" : "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-v4medkif": true })}${message.text}</div>`} ${state === "unavailable" && renderTemplate`<div class="rq-flash rq-flash-warn" data-astro-cid-v4medkif>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-v4medkif": true })}${dt("Role quotas are not available yet. Petto is being updated: try again in a few minutes.")}</div>`} ${state === "error" && renderTemplate`<div class="rq-flash rq-flash-warn" data-astro-cid-v4medkif>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-v4medkif": true })}${dt("The role quotas could not be read. Try again in a moment.")}</div>`} ${ready && !canEdit && renderTemplate`<div class="rq-flash rq-flash-warn" data-rq-readonly data-astro-cid-v4medkif>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "15", "height": "15", "data-astro-cid-v4medkif": true })}${dt("Only administrators can change role quotas, the same as the command. You can look at them.")}</div>`} <div class="rq-grid" data-astro-cid-v4medkif> <section class="rq-card rq-list" data-astro-cid-v4medkif> <div class="rq-card-head" data-astro-cid-v4medkif> <h2 data-astro-cid-v4medkif>${dt("Quotas")}</h2> <span${addAttribute(["rq-count", { "rq-count-full": rules.length >= max }], "class:list")} data-astro-cid-v4medkif>${dt("{n} of {max}", { n: rules.length, max })}</span> </div> ${rules.length === 0 ? renderTemplate`<p class="rq-empty" data-astro-cid-v4medkif>${ready ? dt("No role has a quota yet. Add the first one with the form.") : dt("There are no quotas to show.")}</p>` : renderTemplate`<ul class="rq-rules" data-astro-cid-v4medkif> ${rules.map((rule) => renderTemplate`<li class="rq-rule" data-rq-rule data-astro-cid-v4medkif> <div class="rq-rule-main" data-astro-cid-v4medkif> <span${addAttribute(["rq-role", { "rq-role-gone": rule.roleName === null }], "class:list")}${addAttribute(`--c:${hex(rule.roleColor)}`, "style")} data-astro-cid-v4medkif> <i aria-hidden="true" data-astro-cid-v4medkif></i><b data-astro-cid-v4medkif>${rule.roleName ?? dt("Deleted role")}</b> </span> <span class="rq-quota" data-astro-cid-v4medkif>${dt("{n} messages every {days} day(s)", { n: rule.minMessages, days: rule.periodDays })}</span> </div> <p class="rq-meta" data-astro-cid-v4medkif> ${dt("The role goes after {n} periods in a row below it.", { n: rule.maxStrikes })} ${rule.endsAt && renderTemplate`<span data-astro-cid-v4medkif> · ${dt("This period ends {when}.", { when: day(rule.endsAt) })}</span>`} </p> <p class="rq-meta" data-astro-cid-v4medkif> ${rule.withStrikes > 0 ? dt("{n} member(s) with strikes now.", { n: rule.withStrikes }) : dt("Nobody has strikes now.")} ${rule.lastRunAt && rule.lastMet !== null && renderTemplate`<span data-astro-cid-v4medkif> · ${dt("Last period: {met} met, {missed} below, {removed} lost the role.", { met: rule.lastMet ?? 0, missed: rule.lastMissed ?? 0, removed: rule.lastRemoved ?? 0 })}</span>`} </p> <p class="rq-meta" data-rq-where data-astro-cid-v4medkif> ${rule.channelMode === "all" ? dt("Counts messages in every channel.") : rule.channelMode === "only" ? dt("Counts only in {where}.", { where: where(rule) }) : dt("Counts everywhere except {where}.", { where: where(rule) })} ${rule.remindHours > 0 && renderTemplate`<span data-astro-cid-v4medkif> · ${dt("Members below the quota are reminded {n} hour(s) before the period ends.", { n: rule.remindHours })}</span>`} </p> <p class="rq-meta" data-astro-cid-v4medkif> ${rule.notifyDm ? dt("Members are told by DM.") : dt("No DMs.")} ${rule.reportChannelId && renderTemplate`<span data-astro-cid-v4medkif> · ${dt("Report in #{name}", { name: rule.reportChannelName ?? dt("a channel that is gone") })}</span>`} </p> ${editable && renderTemplate`<form method="POST" class="rq-remove" data-no-dirty data-astro-cid-v4medkif> <input type="hidden" name="action" value="remove" data-astro-cid-v4medkif> <input type="hidden" name="role_id"${addAttribute(rule.roleId, "value")} data-astro-cid-v4medkif> <button class="btn btn-ghost btn-sm" type="submit"${addAttribute(dt("Remove the quota of this role?"), "data-confirm")}${addAttribute(dt("Remove"), "aria-label")} data-astro-cid-v4medkif>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-bold", "width": "13", "height": "13", "data-astro-cid-v4medkif": true })}<span data-astro-cid-v4medkif>${dt("Remove")}</span></button> </form>`} </li>`)} </ul>`} </section> <section class="rq-card rq-add" data-rq-add data-astro-cid-v4medkif> <div class="rq-card-head" data-astro-cid-v4medkif><h2 data-astro-cid-v4medkif>${dt("Set a quota")}</h2></div> <form method="POST" class="rq-form" data-no-dirty data-astro-cid-v4medkif> <input type="hidden" name="action" value="set" data-astro-cid-v4medkif> <label class="rq-field" data-astro-cid-v4medkif><span data-astro-cid-v4medkif>${dt("Role")}</span> <select name="role_id" required${addAttribute(!editable, "disabled")} data-astro-cid-v4medkif> <option value="" data-astro-cid-v4medkif>${dt("Choose a role")}</option> ${roles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")} data-astro-cid-v4medkif>${role.hasRule ? dt("{name} (replaces its quota)", { name: role.name }) : role.name}</option>`)} </select> </label> <label class="rq-field" data-astro-cid-v4medkif><span data-astro-cid-v4medkif>${dt("Messages in each period")}</span> <input type="number" name="messages" min="1"${addAttribute(limits.messages, "max")} step="1" inputmode="numeric" required${addAttribute(!editable, "disabled")} data-astro-cid-v4medkif> </label> <div class="rq-two" data-astro-cid-v4medkif> <label class="rq-field" data-astro-cid-v4medkif><span data-astro-cid-v4medkif>${dt("Days in each period")}</span> <input type="number" name="period_days" min="1"${addAttribute(limits.days, "max")} step="1"${addAttribute(limits.defaultDays, "value")} inputmode="numeric" required${addAttribute(!editable, "disabled")} data-astro-cid-v4medkif> </label> <label class="rq-field" data-astro-cid-v4medkif><span data-astro-cid-v4medkif>${dt("Periods in a row before the role goes")}</span> <input type="number" name="strikes" min="1"${addAttribute(limits.strikes, "max")} step="1"${addAttribute(limits.defaultStrikes, "value")} inputmode="numeric" required${addAttribute(!editable, "disabled")} data-astro-cid-v4medkif> </label> </div> <label class="rq-field" data-astro-cid-v4medkif><span data-astro-cid-v4medkif>${dt("Report channel")}</span> <select name="report_channel_id"${addAttribute(!editable, "disabled")} data-astro-cid-v4medkif> <option value="" data-astro-cid-v4medkif>${dt("None")}</option> ${channels.map((channel) => renderTemplate`<option${addAttribute(channel.id, "value")} data-astro-cid-v4medkif>#${channel.name}</option>`)} </select> <em data-astro-cid-v4medkif>${dt("Optional. The result of each period is posted there.")}</em> </label> <label class="rq-field" data-astro-cid-v4medkif><span data-astro-cid-v4medkif>${dt("Where the messages count")}</span> <select name="channel_mode" data-rq-mode${addAttribute(!editable, "disabled")} data-astro-cid-v4medkif> <option value="all" data-astro-cid-v4medkif>${dt("Every channel")}</option> <option value="only" data-astro-cid-v4medkif>${dt("Only these channels")}</option> <option value="except" data-astro-cid-v4medkif>${dt("All but these channels")}</option> </select> </label> <fieldset class="rq-places" data-rq-places hidden data-astro-cid-v4medkif> <legend data-astro-cid-v4medkif>${dt("Channels and categories (up to {max})", { max: limits.channels })}</legend> <div class="rq-place-list" data-astro-cid-v4medkif> ${places.map((place) => renderTemplate`<label${addAttribute(["rq-place", { "rq-place-cat": place.category }], "class:list")} data-astro-cid-v4medkif> <input type="checkbox" name="channel_ids"${addAttribute(place.id, "value")}${addAttribute(!editable, "disabled")} data-astro-cid-v4medkif> <span data-astro-cid-v4medkif>${place.category ? place.name : `#${place.name}`}${!place.category && place.parent ? renderTemplate`<em data-astro-cid-v4medkif> · ${place.parent}</em>` : null}</span> </label>`)} </div> <em class="rq-sub" data-astro-cid-v4medkif>${dt("A category covers all its channels, and a thread follows its channel.")}</em> </fieldset> <label class="rq-field" data-astro-cid-v4medkif><span data-astro-cid-v4medkif>${dt("Reminder before the period ends (hours)")}</span> <input type="number" name="remind_hours" min="0"${addAttribute(limits.remind, "max")} step="1" value="0" inputmode="numeric"${addAttribute(!editable, "disabled")} data-astro-cid-v4medkif> <em data-astro-cid-v4medkif>${dt("0 is off. Members below the quota get a DM this many hours before the end.")}</em> </label> <label class="rq-check" data-astro-cid-v4medkif><input type="checkbox" name="notify_dm" checked${addAttribute(!editable, "disabled")} data-astro-cid-v4medkif><span data-astro-cid-v4medkif>${dt("Tell members by DM when they fall short")}</span></label> <button class="btn btn-accent btn-sm" type="submit"${addAttribute(!editable || rules.length >= max, "disabled")} data-astro-cid-v4medkif>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-v4medkif": true })}${dt("Save quota")}</button> <p class="rq-hint" data-astro-cid-v4medkif>${dt("A role has one quota: saving it again replaces the old one and starts a new period now. Petto needs Manage Roles and a role above this one to take it away.")}</p> </form> </section> </div> <section class="rq-card rq-how" data-astro-cid-v4medkif> <div class="rq-card-head" data-astro-cid-v4medkif><h2 data-astro-cid-v4medkif>${dt("How it works")}</h2></div> <ul class="rq-notes" data-astro-cid-v4medkif> <li data-astro-cid-v4medkif>${dt("At the end of each period Petto counts the messages of each member who holds the role. Reaching the number clears their strikes; falling short adds one.")}</li> <li data-astro-cid-v4medkif>${dt("A member given the role during a period is judged from the next one. The command /rolequota excuse gives someone time off.")}</li> <li data-astro-cid-v4medkif>${dt("Petto keeps only a number for each member and period, never what was said, and only for members who hold a role with a quota. It is deleted when they lose the role.")}</li> </ul> </section> </div> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashRoleQuotas.astro", void 0);

// Role quotas ("a member who holds this role must send at least N messages in each period; after M periods in a row below it, the role is taken away").
// The rules are the bot's (petto-bot src/utils/roleQuotas.js and src/db/roleQuotas.js, tables `role_quotas` and `role_quota_members`): keep both equal.
// Plain JavaScript so scripts/check-dash-role-quotas.mjs runs it with node alone.

const MAX_RULES = 25;
const MAX_PERIOD_DAYS = 90;
const MAX_MESSAGES = 100000;
const MAX_STRIKES = 20;
const MAX_CHANNELS = 25;
const MAX_REMIND_HOURS = 72;
/** Where the messages count: every channel, only the listed ones, or every one but the listed. A listed id can be a channel or a category. */
const CHANNEL_MODES = Object.freeze(['all', 'only', 'except']);
const SNOWFLAKE = /^\d{15,25}$/;
/** @type {{ readonly periodDays: number, readonly strikes: number }} */
const DEFAULTS = Object.freeze({ periodDays: 7, strikes: 3 });

const whole = (value) => {
  const text = String(value ?? '').trim();
  return /^\d{1,7}$/.test(text) ? Number(text) : NaN;
};

/**
 * The same checks as the bot's `rolequota set`. `role` has `id` and `managed` (null when it does not exist in the server), `guildId` is the server and
 * `existingRoleIds` are the roles that already have a quota. Returns `{ ok: true, rule }` or `{ ok: false, error }`.
 * @param {{ role: { id: string, managed: boolean } | null, guildId: string, messages: any, periodDays?: any, strikes?: any, notifyDm?: boolean, reportChannelId?: string | null, channelMode?: string, channelIds?: string[], remindHours?: any, existingRoleIds?: string[] }} input
 */
function validateRule({ role, guildId, messages, periodDays = DEFAULTS.periodDays, strikes = DEFAULTS.strikes, notifyDm = true, reportChannelId = null, channelMode = 'all', channelIds = [], remindHours = 0, existingRoleIds = [] }) {
  if (!role) return { ok: false, error: 'noRole' };
  if (role.id === guildId) return { ok: false, error: 'everyone' };
  if (role.managed) return { ok: false, error: 'managed' };
  const min = whole(messages);
  if (!Number.isInteger(min) || min < 1 || min > MAX_MESSAGES) return { ok: false, error: 'badMessages' };
  const days = whole(periodDays);
  if (!Number.isInteger(days) || days < 1 || days > MAX_PERIOD_DAYS) return { ok: false, error: 'badPeriod' };
  const max = whole(strikes);
  if (!Number.isInteger(max) || max < 1 || max > MAX_STRIKES) return { ok: false, error: 'badStrikes' };
  if (!existingRoleIds.includes(role.id) && existingRoleIds.length >= MAX_RULES) return { ok: false, error: 'tooMany' };
  const channel = reportChannelId ? String(reportChannelId) : null;
  if (channel && !SNOWFLAKE.test(channel)) return { ok: false, error: 'badChannel' };
  const where = validateChannels(channelMode, channelIds);
  if (!where.ok) return where;
  const remind = whole(remindHours);
  if (!Number.isInteger(remind) || remind < 0 || remind > MAX_REMIND_HOURS) return { ok: false, error: 'badRemind' };
  return {
    ok: true,
    rule: {
      role_id: role.id, period_days: days, min_messages: min, max_strikes: max, notify_dm: Boolean(notifyDm), report_channel_id: channel,
      channel_mode: where.mode, channel_ids: where.ids, remind_hours: remind, period_started_at: new Date().toISOString(),
    },
  };
}

/** The same as the bot's `validateChannels`: `all` keeps no list, `only` needs at least one, at most 25 ids and no repeats. Returns `{ ok: true, mode, ids }` or `{ ok: false, error }`. */
function validateChannels(mode = 'all', ids = []) {
  if (!CHANNEL_MODES.includes(mode)) return { ok: false, error: 'badChannelMode' };
  const list = [...new Set((ids ?? []).map(String))];
  if (list.some((id) => !SNOWFLAKE.test(id))) return { ok: false, error: 'badChannel' };
  if (list.length > MAX_CHANNELS) return { ok: false, error: 'tooManyChannels' };
  if (mode === 'only' && !list.length) return { ok: false, error: 'noChannels' };
  return { ok: true, mode, ids: mode === 'all' ? [] : list };
}

/** A row of `role_quotas` as the page shows it. */
function cleanRule(row) {
  return {
    roleId: String(row?.role_id ?? ''),
    periodDays: Number(row?.period_days) || DEFAULTS.periodDays,
    minMessages: Number(row?.min_messages) || 0,
    maxStrikes: Number(row?.max_strikes) || DEFAULTS.strikes,
    notifyDm: row?.notify_dm !== false,
    reportChannelId: SNOWFLAKE.test(String(row?.report_channel_id ?? '')) ? String(row.report_channel_id) : null,
    channelMode: CHANNEL_MODES.includes(row?.channel_mode) ? row.channel_mode : 'all',
    channelIds: Array.isArray(row?.channel_ids) ? row.channel_ids.map(String).filter((id) => SNOWFLAKE.test(id)) : [],
    remindHours: Number.isInteger(Number(row?.remind_hours)) && Number(row?.remind_hours) > 0 ? Number(row.remind_hours) : 0,
    startedAt: String(row?.period_started_at ?? ''),
    lastRunAt: row?.last_run_at ? String(row.last_run_at) : null,
    lastMet: Number.isFinite(Number(row?.last_met)) && row?.last_met !== null ? Number(row.last_met) : null,
    lastMissed: Number.isFinite(Number(row?.last_missed)) && row?.last_missed !== null ? Number(row.last_missed) : null,
    lastRemoved: Number.isFinite(Number(row?.last_removed)) && row?.last_removed !== null ? Number(row.last_removed) : null,
  };
}

/** When the running period ends (an ISO time), from when it started. */
function periodEnd(startedAt, periodDays) {
  const start = new Date(startedAt).getTime();
  return Number.isFinite(start) ? new Date(start + periodDays * 86400000).toISOString() : null;
}

/** Administrator only, the same as the command (a quota takes a role away by itself): the visitor's own permissions in the server, read from Discord, never the cookie. */
function canEditRoleQuotas(guild) {
  if (!guild) return false;
  if (guild.owner) return true;
  try { return (BigInt(guild.permissions ?? '0') & 0x8n) === 0x8n; } catch { return false; }
}

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$RoleQuotas = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$RoleQuotas;
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
    canEdit = canEditRoleQuotas(guilds.find((g) => g.id === id));
  }
  const errors = {
    noRole: dt("That role does not exist."),
    everyone: dt("@everyone cannot have a quota."),
    managed: dt("A role that an integration manages cannot have a quota."),
    badMessages: dt("The messages must be a whole number from 1 to {max}.", { max: MAX_MESSAGES }),
    badPeriod: dt("The period must be a whole number of days from 1 to {max}.", { max: MAX_PERIOD_DAYS }),
    badStrikes: dt("The periods in a row must be a whole number from 1 to {max}.", { max: MAX_STRIKES }),
    tooMany: dt("A server can have up to {max} role quotas. Remove one first.", { max: MAX_RULES }),
    badChannel: dt("That channel is not valid."),
    badChannelMode: dt("That is not a valid way to count."),
    noChannels: dt('Choose at least one channel or category for "Only these".'),
    tooManyChannels: dt("You can choose up to {max} channels or categories.", { max: MAX_CHANNELS }),
    badRemind: dt("The reminder must be a whole number of hours from 0 to {max}.", { max: MAX_REMIND_HOURS })
  };
  const tableMissing = (res, body) => Boolean(res && (res.status === 404 || ["PGRST205", "42P01"].includes(String(body?.code ?? ""))));
  let message = null;
  let missingAfterWrite = false;
  const [guildInfo, rolesRes, channelsRes] = await Promise.all([getGuildInfo(id, botToken), getGuildList(Astro2, id, botToken, "roles"), getGuildList(Astro2, id, botToken, "channels")]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const allRoles = rolesRes.ok ? await rolesRes.json().catch(() => []) : [];
  const allChannels = channelsRes.ok ? await channelsRes.json().catch(() => []) : [];
  const roleById = new Map(allRoles.map((r) => [String(r.id), r]));
  const textChannels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0));
  const channelById = new Map(textChannels.map((c) => [String(c.id), c]));
  const places = allChannels.filter((c) => [0, 4, 5, 15].includes(Number(c.type))).sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0));
  const placeById = new Map(places.map((c) => [String(c.id), c]));
  const readRules = async () => {
    const res = await fetch(`${apiUrl}/rest/v1/role_quotas?guild_id=eq.${id}&select=*&order=created_at.asc`, { headers: apiHeaders }).catch(() => null);
    const body = res ? await res.json().catch(() => null) : null;
    if (res?.ok && Array.isArray(body)) return { state: "ok", rows: body };
    return { state: tableMissing(res, body) ? "unavailable" : "error", rows: [] };
  };
  let loaded = await readRules();
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    if (!canEdit) message = { kind: "err", text: dt("Only administrators can change role quotas, the same as the command.") };
    else if (loaded.state !== "ok") message = { kind: "err", text: loaded.state === "unavailable" ? dt("Role quotas are not available yet. Petto is being updated: try again in a few minutes.") : dt("The role quotas could not be read. Try again in a moment.") };
    else if (action === "set") {
      const roleId = String(form.get("role_id") ?? "");
      const found = SNOWFLAKE.test(roleId) ? roleById.get(roleId) : null;
      const reportId = String(form.get("report_channel_id") ?? "");
      const checked = validateRule({
        role: found ? { id: String(found.id), managed: Boolean(found.managed) } : null,
        guildId: id,
        messages: form.get("messages"),
        periodDays: form.get("period_days") || DEFAULTS.periodDays,
        strikes: form.get("strikes") || DEFAULTS.strikes,
        notifyDm: form.get("notify_dm") === "on",
        // A channel that is not in the list of the server is not kept (the field is optional).
        reportChannelId: reportId && channelById.has(reportId) ? reportId : null,
        channelMode: String(form.get("channel_mode") || "all"),
        // Only places of this server are kept, so a made-up id never reaches the table.
        channelIds: form.getAll("channel_ids").map(String).filter((each) => placeById.has(each)),
        remindHours: form.get("remind_hours") || 0,
        existingRoleIds: loaded.rows.map((row) => String(row.role_id))
      });
      if (!checked.ok) message = { kind: "err", text: errors[checked.error] ?? dt("Something went wrong, try again.") };
      else {
        await ensureGuildRow(apiUrl, apiHeaders, id);
        const res = await fetch(`${apiUrl}/rest/v1/role_quotas?on_conflict=guild_id,role_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, ...checked.rule })
        }).catch(() => null);
        if (res?.ok) {
          await fetch(`${apiUrl}/rest/v1/role_quota_members?guild_id=eq.${id}&role_id=eq.${checked.rule.role_id}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ messages: 0 }) }).catch(() => null);
          message = { kind: "ok", text: dt("Saved.") };
        } else {
          missingAfterWrite = tableMissing(res, await res?.json().catch(() => null));
          message = { kind: "err", text: dt("Something went wrong, try again.") };
        }
      }
    } else if (action === "remove") {
      const roleId = String(form.get("role_id") ?? "");
      if (!SNOWFLAKE.test(roleId)) message = { kind: "err", text: dt("Something went wrong, try again.") };
      else {
        const res = await fetch(`${apiUrl}/rest/v1/role_quotas?guild_id=eq.${id}&role_id=eq.${roleId}`, { method: "DELETE", headers: apiHeaders }).catch(() => null);
        message = res?.ok ? { kind: "ok", text: dt("Quota removed.") } : { kind: "err", text: dt("Something went wrong, try again.") };
      }
    }
    if (message?.kind === "ok") loaded = await readRules();
  }
  if (missingAfterWrite) loaded = { state: "unavailable", rows: [] };
  const strikesRes = loaded.state === "ok" && loaded.rows.length ? await fetch(`${apiUrl}/rest/v1/role_quota_members?guild_id=eq.${id}&strikes=gt.0&select=role_id&limit=5000`, { headers: apiHeaders }).catch(() => null) : null;
  const withStrikes = /* @__PURE__ */ new Map();
  if (strikesRes?.ok) for (const row of await strikesRes.json().catch(() => [])) withStrikes.set(String(row.role_id), (withStrikes.get(String(row.role_id)) ?? 0) + 1);
  const rules = loaded.rows.map(cleanRule).map((rule) => {
    const role = roleById.get(rule.roleId);
    const channel = rule.reportChannelId ? channelById.get(rule.reportChannelId) : null;
    return {
      ...rule,
      roleName: role ? String(role.name) : null,
      roleColor: role && Number(role.color) > 0 ? Number(role.color) : 0,
      reportChannelName: channel ? String(channel.name) : null,
      // The names of the channels and categories where messages count (or not), in the order of the server; one that is gone is left out.
      channelNames: rule.channelIds.map((each) => placeById.get(each)).filter(Boolean).map((place) => ({ name: String(place.name), category: Number(place.type) === 4 })),
      endsAt: periodEnd(rule.startedAt, rule.periodDays),
      withStrikes: withStrikes.get(rule.roleId) ?? 0
    };
  });
  const used = new Set(rules.map((rule) => rule.roleId));
  const roles = allRoles.filter((role) => String(role.id) !== id && !role.managed).sort((a, b) => Number(b.position ?? 0) - Number(a.position ?? 0)).map((role) => ({ id: String(role.id), name: String(role.name), hasRule: used.has(String(role.id)) }));
  const channels = textChannels.map((c) => ({ id: String(c.id), name: String(c.name) }));
  const categoryName = (place) => place.parent_id ? String(placeById.get(String(place.parent_id))?.name ?? "") : "";
  const placeOptions = places.map((c) => ({ id: String(c.id), name: String(c.name), category: Number(c.type) === 4, parent: categoryName(c) }));
  return renderTemplate`${renderComponent($$result, "DashRoleQuotas", $$DashRoleQuotas, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "rules": rules, "roles": roles, "channels": channels, "places": placeOptions, "state": loaded.state, "canEdit": canEdit, "message": message, "max": MAX_RULES, "limits": { messages: MAX_MESSAGES, days: MAX_PERIOD_DAYS, strikes: MAX_STRIKES, channels: MAX_CHANNELS, remind: MAX_REMIND_HOURS, defaultDays: DEFAULTS.periodDays, defaultStrikes: DEFAULTS.strikes } })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/role-quotas.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/role-quotas.astro";
const $$url = "/dash/guild/[id]/role-quotas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$RoleQuotas,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
