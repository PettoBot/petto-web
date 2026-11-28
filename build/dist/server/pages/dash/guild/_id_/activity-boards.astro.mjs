import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                                    */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { b as getCachedUserGuilds } from '../../../../chunks/discordCache_CnRINZ-g.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashActivityBoards = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashActivityBoards;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const docsUrl = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/community/activity-leaderboards`;
  const { user, guildId, guildName, guildIcon, boards, roleBoards, roles, roleState, roleReasons, channels, state, canEdit, message, problem, reasons } = Astro2.props;
  const roleOf = (kind) => roleBoards.find((entry) => entry.kind === kind) ?? null;
  const day = (iso) => {
    const date = iso ? new Date(iso) : null;
    return date && Number.isFinite(date.getTime()) ? date.toLocaleString(dashLang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  };
  const periodOptions = [{ value: "monthly", label: dt("Month") }, { value: "weekly", label: dt("Week") }, { value: "daily", label: dt("Day") }];
  const periodsOf = (board) => board?.periods?.length ? board.periods : periodOptions.map((option) => option.value);
  const ready = state === "ok";
  const editable = ready && canEdit;
  const roleEditable = editable && roleState === "ok";
  const kindTitle = (kind) => kind === "voice" ? dt("Voice leaderboards") : dt("Chat leaderboards");
  const kindHint = (kind) => kind === "voice" ? dt("The members who spend the most minutes in voice channels.") : dt("The members who send the most messages.");
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "activity-boards", "pageTitle": dt("Activity leaderboards"), "data-astro-cid-xqkhfjn6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="ab" data-astro-cid-xqkhfjn6> <header class="ab-head" data-astro-cid-xqkhfjn6> <h1 data-astro-cid-xqkhfjn6>${dt("Activity leaderboards")}</h1> <a class="btn btn-sm ab-docs"${addAttribute(docsUrl, "href")} target="_blank" rel="noopener" data-astro-cid-xqkhfjn6>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13", "data-astro-cid-xqkhfjn6": true })}${dt("Read the docs")}</a> </header> <p class="ab-lead" data-astro-cid-xqkhfjn6>${dt("Post the most active members in a channel: a card for the month, the week and the day (all of them or only some), updated every few minutes.")}</p> ${message && renderTemplate`<div${addAttribute(["ab-flash", { "ab-flash-err": message.kind === "err" }], "class:list")} role="status" data-astro-cid-xqkhfjn6>${renderComponent($$result2, "Icon", $$Icon, { "name": message.kind === "ok" ? "ph:check-circle-fill" : "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-xqkhfjn6": true })}${message.text}</div>`} ${state === "unavailable" && renderTemplate`<div class="ab-flash ab-flash-warn" data-astro-cid-xqkhfjn6>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-xqkhfjn6": true })}${dt("The leaderboards are not available yet. Petto is being updated: try again in a few minutes.")}</div>`} ${state === "error" && renderTemplate`<div class="ab-flash ab-flash-warn" data-astro-cid-xqkhfjn6>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-xqkhfjn6": true })}${dt("The leaderboards could not be read. Try again in a moment.")}</div>`} ${ready && problem && renderTemplate`<div class="ab-flash ab-flash-warn" data-ab-problem data-astro-cid-xqkhfjn6>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-xqkhfjn6": true })}${problem}</div>`} ${ready && !canEdit && renderTemplate`<div class="ab-flash ab-flash-warn" data-ab-readonly data-astro-cid-xqkhfjn6>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "15", "height": "15", "data-astro-cid-xqkhfjn6": true })}${dt("Only people with Manage Server can change the leaderboards, the same as the command. You can look at them.")}</div>`} <div class="ab-grid" data-astro-cid-xqkhfjn6> ${boards.map(({ kind, board, channelName }) => renderTemplate`<section class="ab-card"${addAttribute(kind, "data-ab-kind")} data-astro-cid-xqkhfjn6> <div class="ab-card-head" data-astro-cid-xqkhfjn6> <h2 data-astro-cid-xqkhfjn6>${kindTitle(kind)}</h2> <span${addAttribute(["ab-pill", { "ab-pill-off": !board, "ab-pill-bad": Boolean(board?.error) }], "class:list")} data-astro-cid-xqkhfjn6> ${!board ? dt("Not set") : board.error ? dt("Needs attention") : board.refreshedAt ? dt("Updated {when}", { when: day(board.refreshedAt) }) : dt("Waiting to be written")} </span> </div> <p class="ab-hint" data-astro-cid-xqkhfjn6>${kindHint(kind)}</p> ${board && renderTemplate`<p class="ab-where" data-astro-cid-xqkhfjn6>${dt("Posted in")} <b data-astro-cid-xqkhfjn6>${channelName ? `#${channelName}` : dt("a channel that is gone")}</b> · ${periodsOf(board).map((value) => periodOptions.find((option) => option.value === value)?.label).join(", ")}</p>`} ${board?.error && renderTemplate`<p class="ab-problem" data-astro-cid-xqkhfjn6>${reasons[board.error] ?? reasons.error}</p>`} <form method="POST" class="ab-form" data-no-dirty data-astro-cid-xqkhfjn6> <input type="hidden" name="action" value="set" data-astro-cid-xqkhfjn6> <input type="hidden" name="kind"${addAttribute(kind, "value")} data-astro-cid-xqkhfjn6> <label class="ab-field" data-astro-cid-xqkhfjn6><span data-astro-cid-xqkhfjn6>${dt("Channel")}</span> <select name="channel_id" required${addAttribute(!editable, "disabled")} data-astro-cid-xqkhfjn6> <option value="" data-astro-cid-xqkhfjn6>${dt("Choose a channel")}</option> ${channels.map((channel) => renderTemplate`<option${addAttribute(channel.id, "value")}${addAttribute(board?.channelId === channel.id, "selected")} data-astro-cid-xqkhfjn6>#${channel.name}</option>`)} </select> </label> <fieldset class="ab-periods"${addAttribute(!editable, "disabled")} data-astro-cid-xqkhfjn6> <legend data-astro-cid-xqkhfjn6>${dt("Cards")}</legend> <div class="ab-chips" data-astro-cid-xqkhfjn6> ${periodOptions.map((option) => renderTemplate`<label class="ab-chip" data-astro-cid-xqkhfjn6><input type="checkbox" name="periods"${addAttribute(option.value, "value")}${addAttribute(periodsOf(board).includes(option.value), "checked")} data-astro-cid-xqkhfjn6><span data-astro-cid-xqkhfjn6>${option.label}</span></label>`)} </div> <p class="ab-periods-hint" data-astro-cid-xqkhfjn6>${dt("Choose the cards this board has: at least one.")}</p> </fieldset> <button class="btn btn-accent btn-sm" type="submit"${addAttribute(!editable || Boolean(problem), "disabled")} data-astro-cid-xqkhfjn6>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-xqkhfjn6": true })}${board ? dt("Save") : dt("Post the leaderboards")}</button> </form> ${editable && board && renderTemplate`<form method="POST" class="ab-remove" data-no-dirty data-astro-cid-xqkhfjn6> <input type="hidden" name="action" value="remove" data-astro-cid-xqkhfjn6> <input type="hidden" name="kind"${addAttribute(kind, "value")} data-astro-cid-xqkhfjn6> <button class="btn btn-ghost btn-sm" type="submit"${addAttribute(dt("Remove these leaderboards and delete their messages?"), "data-confirm")}${addAttribute(dt("Remove"), "aria-label")} data-astro-cid-xqkhfjn6>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-bold", "width": "13", "height": "13", "data-astro-cid-xqkhfjn6": true })}<span data-astro-cid-xqkhfjn6>${dt("Remove")}</span></button> </form>`} <div class="ab-role"${addAttribute(kind, "data-ab-role")} data-astro-cid-xqkhfjn6> <h3 data-astro-cid-xqkhfjn6>${kind === "voice" ? dt("Role of the most active talker") : dt("Role of the most active chatter")}</h3> <p class="ab-hint ab-role-hint" data-astro-cid-xqkhfjn6>${dt("When each week ends, the number 1 of the week gets this role and the one who had it loses it.")}</p> ${roleOf(kind)?.role && renderTemplate`<p class="ab-where" data-astro-cid-xqkhfjn6> ${dt("Role")} <b data-astro-cid-xqkhfjn6>${roleOf(kind)?.roleName ? `@${roleOf(kind)?.roleName}` : dt("a role that is gone")}</b> ·
${roleOf(kind)?.role?.holderId ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-xqkhfjn6": true }, { "default": ($$result3) => renderTemplate`${" "}${dt("has it now:")}${" "}<b data-astro-cid-xqkhfjn6>${roleOf(kind)?.holderName ?? dt("a member who left")}</b>` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-xqkhfjn6": true }, { "default": ($$result3) => renderTemplate`${" "}${dt("nobody has it yet")}` })}`} </p>`} ${roleOf(kind)?.role?.error && renderTemplate`<p class="ab-problem" data-astro-cid-xqkhfjn6>${roleReasons[roleOf(kind).role.error] ?? roleReasons.error}</p>`} ${roleState !== "ok" && ready && renderTemplate`<p class="ab-problem" data-astro-cid-xqkhfjn6>${roleState === "unavailable" ? dt("The roles are not available yet. Petto is being updated: try again in a few minutes.") : dt("The roles could not be read. Try again in a moment.")}</p>`} <form method="POST" class="ab-form ab-form-role" data-no-dirty data-astro-cid-xqkhfjn6> <input type="hidden" name="action" value="role-set" data-astro-cid-xqkhfjn6> <input type="hidden" name="kind"${addAttribute(kind, "value")} data-astro-cid-xqkhfjn6> <label class="ab-field" data-astro-cid-xqkhfjn6><span data-astro-cid-xqkhfjn6>${dt("Role")}</span> <select name="role_id" required${addAttribute(!roleEditable, "disabled")} data-give-role data-astro-cid-xqkhfjn6> <option value="" data-astro-cid-xqkhfjn6>${dt("Choose a role")}</option> ${roles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")}${addAttribute(roleOf(kind)?.role?.roleId === role.id, "selected")} data-astro-cid-xqkhfjn6>@${role.name}</option>`)} </select> </label> <button class="btn btn-accent btn-sm" type="submit"${addAttribute(!roleEditable || Boolean(problem), "disabled")} data-astro-cid-xqkhfjn6>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-xqkhfjn6": true })}${roleOf(kind)?.role ? dt("Save") : dt("Give this role")}</button> </form> ${roleEditable && roleOf(kind)?.role && renderTemplate`<form method="POST" class="ab-remove" data-no-dirty data-astro-cid-xqkhfjn6> <input type="hidden" name="action" value="role-remove" data-astro-cid-xqkhfjn6> <input type="hidden" name="kind"${addAttribute(kind, "value")} data-astro-cid-xqkhfjn6> <button class="btn btn-ghost btn-sm" type="submit"${addAttribute(dt("Stop giving this role and take it from who has it?"), "data-confirm")}${addAttribute(dt("Remove the role"), "aria-label")} data-astro-cid-xqkhfjn6>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-bold", "width": "13", "height": "13", "data-astro-cid-xqkhfjn6": true })}<span data-astro-cid-xqkhfjn6>${dt("Remove the role")}</span></button> </form>`} </div> </section>`)} </div> <section class="ab-card ab-how" data-astro-cid-xqkhfjn6> <div class="ab-card-head" data-astro-cid-xqkhfjn6><h2 data-astro-cid-xqkhfjn6>${dt("How it works")}</h2></div> <ul class="ab-notes" data-astro-cid-xqkhfjn6> <li data-astro-cid-xqkhfjn6>${dt("Each kind is one message in its channel, with a card for each period you choose (the month, the week, the day) one under the other, and Petto edits it about every 5 minutes, only when the numbers change. If someone deletes it, Petto writes it again.")}</li> <li data-astro-cid-xqkhfjn6>${dt("Days, weeks (Monday to Sunday) and months are counted in GMT-5, the time of Petto.")}</li> <li data-astro-cid-xqkhfjn6>${dt("Petto uses the numbers it already keeps for the statistics of the server, never what was said. Members who asked not to be counted, bots and members who left are not shown.")}</li> <li data-astro-cid-xqkhfjn6>${dt("Petto needs View Channel, Send Messages and Read Message History in the channel. If you change the channel, the old message is deleted and the board is written again in the new one. If you take a card away or add one, the same message is edited.")}</li> <li data-astro-cid-xqkhfjn6>${dt("The role goes to the number 1 of the week when the week ends (Monday, GMT-5). Petto needs Manage Roles and the role has to be below its highest role. When you choose a role, last week's number 1 gets it within a few minutes.")}</li> </ul> </section> </div> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashActivityBoards.astro", void 0);

// Activity leaderboards ("the most active members of the chat and of the voice, in a channel, a card for each period the server chose (the month, the week, the day), edited about every 5 minutes").
// The rules are the bot's (petto-bot src/utils/activityLeaderboard.ts and src/db/activityLeaderboards.ts, table `activity_leaderboards`): keep both equal.
// Plain JavaScript so scripts/check-dash-activity-boards.mjs runs it with node alone.

const KINDS = Object.freeze(['chat', 'voice']);
const SNOWFLAKE = /^\d{15,25}$/;
/** The cards a board can have, in the order they are posted (the same list and order as the bot's `PERIODS`). */
const PERIODS = Object.freeze(['monthly', 'weekly', 'daily']);

/** The periods in the order of `PERIODS`, once each, only the real ones. A list with none of them is every period (a row from before the choice has them all). */
function cleanPeriods(value) {
  const wanted = new Set(Array.isArray(value) ? value.map(String) : []);
  const chosen = PERIODS.filter((period) => wanted.has(period));
  return chosen.length ? chosen : [...PERIODS];
}
/** The reasons the bot saves when it cannot write a board (`last_error`). */
const REASONS = Object.freeze(['statsOff', 'membersOff', 'channel', 'permissions', 'error']);
/** The reasons the bot saves when it cannot give the role of the most active member (`activity_top_roles.last_error`). */
const ROLE_REASONS = Object.freeze(['statsOff', 'membersOff', 'role', 'permissions', 'error']);

/**
 * What the form sent, checked: the kind, a channel of the server (`channelIds` are the text and announcement channels it has) and the cards (`periods`, the checked boxes: at
 * least one real period; left out it is all of them). Returns `{ ok: true, board: { kind, channel_id, periods } }` or `{ ok: false, error: 'badKind' | 'badChannel' | 'badPeriods' }`.
 * @param {{ kind: unknown, channelId: unknown, channelIds: string[], periods?: unknown }} input
 */
function validateBoard({ kind, channelId, channelIds, periods }) {
  if (!KINDS.includes(String(kind))) return { ok: false, error: 'badKind' };
  const channel = String(channelId ?? '');
  if (!SNOWFLAKE.test(channel) || !channelIds.includes(channel)) return { ok: false, error: 'badChannel' };
  if (periods !== undefined && (!Array.isArray(periods) || !periods.some((period) => PERIODS.includes(String(period))))) return { ok: false, error: 'badPeriods' };
  return { ok: true, board: { kind: String(kind), channel_id: channel, periods: cleanPeriods(periods) } };
}

/** A row of `activity_leaderboards` as the page shows it (the ids of the messages are not shown; `messages` counts them: one, or up to three for a board written the older way). */
function cleanBoard(row) {
  const refreshed = row?.last_refreshed_at ? new Date(row.last_refreshed_at) : null;
  const error = REASONS.includes(String(row?.last_error ?? '')) ? String(row.last_error) : null;
  return {
    kind: KINDS.includes(String(row?.kind)) ? String(row.kind) : 'chat',
    channelId: SNOWFLAKE.test(String(row?.channel_id ?? '')) ? String(row.channel_id) : '',
    refreshedAt: refreshed && Number.isFinite(refreshed.getTime()) ? refreshed.toISOString() : null,
    error,
    periods: cleanPeriods(row?.periods),
    messages: messageIds(row).length,
  };
}

/** The ids of the messages of a row that can be deleted: the one message of the board and, for a board written the older way (a message for each period), those three. */
function messageIds(row) {
  return [row?.message_id, row?.monthly_message_id, row?.weekly_message_id, row?.daily_message_id].map((id) => String(id ?? '')).filter((id) => SNOWFLAKE.test(id));
}

/**
 * Why a server cannot have boards at all, from its row of `stats_config` (none means the defaults, all on): the statistics are off, or they are kept without members.
 * @param {{ enabled?: boolean, members_enabled?: boolean } | null | undefined} config
 * @returns {'statsOff' | 'membersOff' | null}
 */
function statsProblem(config) {
  if (config && config.enabled === false) return 'statsOff';
  if (config && config.members_enabled === false) return 'membersOff';
  return null;
}

/** Manage Server (or Administrator, or being the owner), the same as the command: the visitor's own permissions in the server, read from Discord, never the cookie. */
function canEditActivityBoards(guild) {
  if (!guild) return false;
  if (guild.owner) return true;
  try {
    const permissions = BigInt(guild.permissions ?? '0');
    return (permissions & 0x8n) === 0x8n || (permissions & 0x20n) === 0x20n;
  } catch {
    return false;
  }
}

/**
 * The role the form sent, checked: the kind, and a role of the server that Petto can hand out at all (`roles` are the roles of the server with `id` and `managed`; `guildId` is the
 * id of @everyone). That Petto is above the role is not checked here: the bot checks it when it gives the role and the page shows what it says.
 * Returns `{ ok: true, role: { kind, role_id } }` or `{ ok: false, error: 'badKind' | 'badRole' }`.
 * @param {{ kind: unknown, roleId: unknown, roles: { id: string, managed?: boolean }[], guildId: string }} input
 */
function validateRole({ kind, roleId, roles, guildId }) {
  if (!KINDS.includes(String(kind))) return { ok: false, error: 'badKind' };
  const id = String(roleId ?? '');
  const role = SNOWFLAKE.test(id) && id !== String(guildId) ? roles.find((each) => String(each.id) === id) : null;
  if (!role || role.managed) return { ok: false, error: 'badRole' };
  return { ok: true, role: { kind: String(kind), role_id: id } };
}

/** A row of `activity_top_roles` as the page shows it. */
function cleanRole(row) {
  const error = ROLE_REASONS.includes(String(row?.last_error ?? '')) ? String(row.last_error) : null;
  return {
    kind: KINDS.includes(String(row?.kind)) ? String(row.kind) : 'chat',
    roleId: SNOWFLAKE.test(String(row?.role_id ?? '')) ? String(row.role_id) : '',
    holderId: SNOWFLAKE.test(String(row?.holder_id ?? '')) ? String(row.holder_id) : null,
    error,
  };
}

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$ActivityBoards = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ActivityBoards;
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
    canEdit = canEditActivityBoards(guilds.find((g) => g.id === id));
  }
  const errors = {
    badKind: dt("Choose chat or voice."),
    badChannel: dt("Choose a text or announcement channel of this server."),
    badPeriods: dt("Choose at least one card: the month, the week or the day."),
    badRole: dt("Choose a role of this server that is not @everyone and not the role of a bot or of boosters."),
    statsOff: dt("This server turned its statistics off, so there is nothing to show."),
    membersOff: dt("This server keeps statistics without members, so there is no leaderboard of members.")
  };
  const reasons = {
    statsOff: errors.statsOff,
    membersOff: errors.membersOff,
    channel: dt("Petto cannot use that channel: it has to be a text or announcement channel that Petto can see."),
    permissions: dt("Petto needs View Channel, Send Messages and Read Message History in that channel."),
    error: dt("Something went wrong. Petto will try again in a few minutes.")
  };
  const roleReasons = {
    statsOff: errors.statsOff,
    membersOff: errors.membersOff,
    role: dt("Petto cannot use that role: it was deleted, or it is @everyone or the role of a bot or of boosters."),
    permissions: dt("Petto needs Manage Roles, and that role has to be below its highest role."),
    error: dt("Something went wrong. Petto will try again in an hour.")
  };
  const tableMissing = (res, body) => Boolean(res && (res.status === 404 || ["PGRST205", "42P01"].includes(String(body?.code ?? ""))));
  let message = null;
  let missingAfterWrite = false;
  const [guildInfo, channelsRes, rolesRes] = await Promise.all([getGuildInfo(id, botToken), getGuildList(Astro2, id, botToken, "channels"), getGuildList(Astro2, id, botToken, "roles")]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const allChannels = channelsRes.ok ? await channelsRes.json().catch(() => []) : [];
  const textChannels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0));
  const channelById = new Map(textChannels.map((c) => [String(c.id), c]));
  const allRoles = rolesRes.ok ? await rolesRes.json().catch(() => []) : [];
  const usableRoles = allRoles.filter((r) => String(r.id) !== id && !r.managed).sort((a, b) => Number(b.position ?? 0) - Number(a.position ?? 0));
  const roleById = new Map(allRoles.map((r) => [String(r.id), r]));
  const readRows = async () => {
    const res = await fetch(`${apiUrl}/rest/v1/activity_leaderboards?guild_id=eq.${id}&select=*&order=kind.asc`, { headers: apiHeaders }).catch(() => null);
    const body = res ? await res.json().catch(() => null) : null;
    if (res?.ok && Array.isArray(body)) return { state: "ok", rows: body };
    return { state: tableMissing(res, body) ? "unavailable" : "error", rows: [] };
  };
  const readRoleRows = async () => {
    const res = await fetch(`${apiUrl}/rest/v1/activity_top_roles?guild_id=eq.${id}&select=*&order=kind.asc`, { headers: apiHeaders }).catch(() => null);
    const body = res ? await res.json().catch(() => null) : null;
    if (res?.ok && Array.isArray(body)) return { state: "ok", rows: body };
    return { state: tableMissing(res, body) ? "unavailable" : "error", rows: [] };
  };
  const statsRes = await fetch(`${apiUrl}/rest/v1/stats_config?guild_id=eq.${id}&select=enabled,members_enabled`, { headers: apiHeaders }).catch(() => null);
  const statsRows = statsRes?.ok ? await statsRes.json().catch(() => []) : [];
  const problem = statsProblem(Array.isArray(statsRows) ? statsRows[0] : null);
  const deleteMessages = async (channelId, ids) => {
    for (const messageId of ids) {
      await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, { method: "DELETE", headers: { Authorization: `Bot ${botToken}` } }).catch(() => null);
    }
  };
  const takeRole = async (holderId, roleId) => {
    const holder = String(holderId ?? "");
    const role = String(roleId ?? "");
    if (!/^\d{15,25}$/.test(holder) || !/^\d{15,25}$/.test(role)) return;
    await fetch(`https://discord.com/api/v10/guilds/${id}/members/${holder}/roles/${role}`, { method: "DELETE", headers: { Authorization: `Bot ${botToken}` } }).catch(() => null);
  };
  let loaded = await readRows();
  let loadedRoles = await readRoleRows();
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const kind = String(form.get("kind") ?? "");
    const current = loaded.rows.find((row) => row.kind === kind);
    if (!canEdit) message = { kind: "err", text: dt("Only people with Manage Server can change the leaderboards, the same as the command.") };
    else if (loaded.state !== "ok") message = { kind: "err", text: loaded.state === "unavailable" ? dt("The leaderboards are not available yet. Petto is being updated: try again in a few minutes.") : dt("The leaderboards could not be read. Try again in a moment.") };
    else if (action === "set") {
      const checked = validateBoard({ kind, channelId: form.get("channel_id"), channelIds: [...channelById.keys()], periods: form.getAll("periods").map(String) });
      if (!checked.ok) message = { kind: "err", text: errors[checked.error] ?? dt("Something went wrong, try again.") };
      else if (problem) message = { kind: "err", text: errors[problem] };
      else {
        await ensureGuildRow(apiUrl, apiHeaders, id);
        const sameChannel = current && String(current.channel_id) === checked.board.channel_id;
        if (current && !sameChannel) await deleteMessages(String(current.channel_id), messageIds(current));
        const res = sameChannel ? await fetch(`${apiUrl}/rest/v1/activity_leaderboards?guild_id=eq.${id}&kind=eq.${checked.board.kind}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ periods: checked.board.periods, last_refreshed_at: null, last_error: null }) }).catch(() => null) : await fetch(`${apiUrl}/rest/v1/activity_leaderboards?on_conflict=guild_id,kind`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, ...checked.board, message_id: null, daily_message_id: null, weekly_message_id: null, monthly_message_id: null, card_state: {}, last_refreshed_at: null, last_error: null })
        }).catch(() => null);
        if (res?.ok) message = { kind: "ok", text: dt("Saved. Petto writes the cards within a few minutes.") };
        else {
          missingAfterWrite = tableMissing(res, await res?.json().catch(() => null));
          message = { kind: "err", text: dt("Something went wrong, try again.") };
        }
      }
    } else if (action === "role-set" || action === "role-remove") {
      const currentRole = loadedRoles.rows.find((row) => row.kind === kind);
      if (loadedRoles.state !== "ok") message = { kind: "err", text: loadedRoles.state === "unavailable" ? dt("The roles are not available yet. Petto is being updated: try again in a few minutes.") : dt("The roles could not be read. Try again in a moment.") };
      else if (action === "role-remove") {
        if (!KINDS.includes(kind)) message = { kind: "err", text: errors.badKind };
        else if (!currentRole) message = { kind: "err", text: dt("Something went wrong, try again.") };
        else {
          const res = await fetch(`${apiUrl}/rest/v1/activity_top_roles?guild_id=eq.${id}&kind=eq.${kind}`, { method: "DELETE", headers: apiHeaders }).catch(() => null);
          if (res?.ok) {
            await takeRole(currentRole.holder_id, currentRole.role_id);
            message = { kind: "ok", text: dt("Role removed.") };
          } else message = { kind: "err", text: dt("Something went wrong, try again.") };
        }
      } else {
        const checked = validateRole({ kind, roleId: form.get("role_id"), roles: usableRoles.map((r) => ({ id: String(r.id), managed: false })), guildId: id });
        if (!checked.ok) message = { kind: "err", text: errors[checked.error] ?? dt("Something went wrong, try again.") };
        else if (problem) message = { kind: "err", text: errors[problem] };
        else {
          await ensureGuildRow(apiUrl, apiHeaders, id);
          const sameRole = currentRole && String(currentRole.role_id) === checked.role.role_id;
          if (currentRole && !sameRole) await takeRole(currentRole.holder_id, currentRole.role_id);
          const res = sameRole ? await fetch(`${apiUrl}/rest/v1/activity_top_roles?guild_id=eq.${id}&kind=eq.${checked.role.kind}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ awarded_week: null, last_checked_at: null, last_error: null }) }).catch(() => null) : await fetch(`${apiUrl}/rest/v1/activity_top_roles?on_conflict=guild_id,kind`, {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify({ guild_id: id, ...checked.role, holder_id: null, awarded_week: null, last_checked_at: null, last_error: null })
          }).catch(() => null);
          if (res?.ok) message = { kind: "ok", text: dt("Saved. Petto gives the role when each week ends, and last week's most active member gets it within a few minutes.") };
          else {
            missingAfterWrite = tableMissing(res, await res?.json().catch(() => null));
            message = { kind: "err", text: dt("Something went wrong, try again.") };
          }
        }
      }
    } else if (action === "remove") {
      if (!KINDS.includes(kind)) message = { kind: "err", text: errors.badKind };
      else if (!current) message = { kind: "err", text: dt("Something went wrong, try again.") };
      else {
        const res = await fetch(`${apiUrl}/rest/v1/activity_leaderboards?guild_id=eq.${id}&kind=eq.${kind}`, { method: "DELETE", headers: apiHeaders }).catch(() => null);
        if (res?.ok) {
          await deleteMessages(String(current.channel_id), messageIds(current));
          message = { kind: "ok", text: dt("Leaderboards removed.") };
        } else message = { kind: "err", text: dt("Something went wrong, try again.") };
      }
    }
    if (message?.kind === "ok") {
      loaded = await readRows();
      loadedRoles = await readRoleRows();
    }
  }
  if (missingAfterWrite) {
    loaded = { state: "unavailable", rows: [] };
    loadedRoles = { state: "unavailable", rows: [] };
  }
  const byKind = new Map(loaded.rows.map((row) => [String(row.kind), cleanBoard(row)]));
  const boards = KINDS.map((kind) => {
    const board = byKind.get(kind) ?? null;
    const channel = board?.channelId ? channelById.get(board.channelId) : null;
    return { kind, board, channelName: board ? channel ? String(channel.name) : null : null };
  });
  const roleByKind = new Map(loadedRoles.rows.map((row) => [String(row.kind), cleanRole(row)]));
  const holderName = async (userId) => {
    if (!userId) return null;
    const res = await fetch(`https://discord.com/api/v10/guilds/${id}/members/${userId}`, { headers: { Authorization: `Bot ${botToken}` } }).catch(() => null);
    const member = res?.ok ? await res.json().catch(() => null) : null;
    return member ? String(member.nick ?? member.user?.global_name ?? member.user?.username ?? "") || null : null;
  };
  const roleBoards = await Promise.all(KINDS.map(async (kind) => {
    const role = roleByKind.get(kind) ?? null;
    const found = role?.roleId ? roleById.get(role.roleId) : null;
    return { kind, role, roleName: role ? found ? String(found.name) : null : null, holderName: role ? await holderName(role.holderId) : null };
  }));
  const channels = textChannels.map((c) => ({ id: String(c.id), name: String(c.name) }));
  return renderTemplate`${renderComponent($$result, "DashActivityBoards", $$DashActivityBoards, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "boards": boards, "roleBoards": roleBoards, "roles": usableRoles.map((r) => ({ id: String(r.id), name: String(r.name) })), "roleState": loadedRoles.state, "roleReasons": roleReasons, "channels": channels, "state": loaded.state, "canEdit": canEdit, "message": message, "problem": problem ? errors[problem] : null, "reasons": reasons })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/activity-boards.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/activity-boards.astro";
const $$url = "/dash/guild/[id]/activity-boards";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ActivityBoards,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
