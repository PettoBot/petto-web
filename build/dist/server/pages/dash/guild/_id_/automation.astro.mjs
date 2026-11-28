import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, d as renderComponent, u as unescapeHTML, e as defineScriptVars, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { r as redrawPanelsInServerLanguage } from '../../../../chunks/panelLanguage_v4KZmQmx.mjs';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import 'clsx';
/* empty css                                               */
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$VariableHelp } from '../../../../chunks/VariableHelp_CRlEe6IW.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$MultiSelectOptions } from '../../../../chunks/MultiSelectOptions_D6F-04X6.mjs';
import { m as makeT, g as getDashLang, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
import { g as generated, u as useTranslations } from '../../../../chunks/ui_C1MR3LHJ.mjs';
import { $ as $$ColorPicker } from '../../../../chunks/ColorPicker_DwzcbTkv.mjs';
import { $ as $$EmojiPicker } from '../../../../chunks/EmojiPicker_0tfnRmiq.mjs';
import { r as renderMarkdown } from '../../../../chunks/discordPreview_BH9qALM3.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { g as getAllCommands } from '../../../../chunks/commandList_CyjlbWar.mjs';
import { f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
import { p as planLimits, P as PREMIUM_LIMITS, F as FREE_LIMITS } from '../../../../chunks/planLimits_BFQNR8Tb.mjs';
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { k as getGuildDetails, n as noteGuildWrite, j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { v as validateTemplate } from '../../../../chunks/embedSchema_Bj4vwR3q.mjs';
import { b as buildDiscordMessage } from '../../../../chunks/embedSend_kaZVlTnV.mjs';
import { b as buildRoleButtonComponents } from '../../../../chunks/reactionRoleButtons_C990GI6m.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
import { g as getGuildEmojis } from '../../../../chunks/guildEmojis_CIHVnrpZ.mjs';
import { o as hasPremiumForGuild } from '../../../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { j as callPettoTimerRun } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { g as getMemberProfiles, m as memberAvatarUrl } from '../../../../chunks/memberNames_skiCoAs8.mjs';
import { w as withinBudget } from '../../../../chunks/liveCall_BSZ7MViH.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$4 = createAstro("https://petto.sbs");
const $$DashBoardMock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$DashBoardMock;
  const { emoji, color, count } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="bm-wrap" data-board-mock data-astro-cid-r764awv4> <div class="bm-line" data-astro-cid-r764awv4><span class="bm-emoji" data-astro-cid-r764awv4>${emoji}</span> <b data-astro-cid-r764awv4>${count}</b> <span class="bm-sep" data-astro-cid-r764awv4>|</span> <span class="bm-chan" data-astro-cid-r764awv4>#general</span></div> <div class="bm-embed"${addAttribute(`--bm-c:${color}`, "style")} data-astro-cid-r764awv4> <div class="bm-author" data-astro-cid-r764awv4><span class="bm-avatar" data-astro-cid-r764awv4></span>Friend</div> <div class="bm-text" data-astro-cid-r764awv4>Fuh</div> <div class="bm-foot" data-astro-cid-r764awv4>09/25/2026 10:17 PM</div> </div> <div class="bm-btn" data-astro-cid-r764awv4>Original Message <span aria-hidden="true" data-astro-cid-r764awv4>↗</span></div> </div> `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashBoardMock.astro", void 0);

const $$Astro$3 = createAstro("https://petto.sbs");
const $$CommandScopeFields = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$CommandScopeFields;
  const { scope, channelOptions, roleOptions, idPrefix } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const value = scope ?? { allowChannels: [], blockChannels: [], allowRoles: [], blockRoles: [], nsfw: false, restricted: false, restrictedChannel: null };
  return renderTemplate`${maybeRenderHead()}<div class="csf" data-astro-cid-fqk6uxis> <div class="sx-grid" data-astro-cid-fqk6uxis> <div class="sx-field" data-astro-cid-fqk6uxis><span class="sx-label" data-astro-cid-fqk6uxis>${dt("Allowed channels")}</span>${renderComponent($$result, "MultiSelect", $$MultiSelect, { "name": "scope_allow_channels", "options": channelOptions, "source": "am-channels", "selected": value.allowChannels, "placeholder": dt("All channels"), "data-astro-cid-fqk6uxis": true })}</div> <div class="sx-field" data-astro-cid-fqk6uxis><span class="sx-label" data-astro-cid-fqk6uxis>${dt("Blocked channels")}</span>${renderComponent($$result, "MultiSelect", $$MultiSelect, { "name": "scope_block_channels", "options": channelOptions, "source": "am-channels", "selected": value.blockChannels, "placeholder": dt("No channel"), "data-astro-cid-fqk6uxis": true })}</div> <div class="sx-field" data-astro-cid-fqk6uxis><span class="sx-label" data-astro-cid-fqk6uxis>${dt("Allowed roles")}</span>${renderComponent($$result, "MultiSelect", $$MultiSelect, { "name": "scope_allow_roles", "options": roleOptions, "source": "am-roles", "selected": value.allowRoles, "placeholder": dt("Everyone"), "data-astro-cid-fqk6uxis": true })}</div> <div class="sx-field" data-astro-cid-fqk6uxis><span class="sx-label" data-astro-cid-fqk6uxis>${dt("Blocked roles")}</span>${renderComponent($$result, "MultiSelect", $$MultiSelect, { "name": "scope_block_roles", "options": roleOptions, "source": "am-roles", "selected": value.blockRoles, "placeholder": dt("No role"), "data-astro-cid-fqk6uxis": true })}</div> </div> <div class="sx-switches" data-astro-cid-fqk6uxis> <label class="sx-switch" data-astro-cid-fqk6uxis><input type="checkbox" name="scope_nsfw"${addAttribute(value.nsfw, "checked")} data-astro-cid-fqk6uxis><span class="sx-switch-text" data-astro-cid-fqk6uxis><b data-astro-cid-fqk6uxis>NSFW</b><em data-astro-cid-fqk6uxis>${dt("It only works in channels marked as NSFW.")}</em></span><span class="sx-toggle" data-astro-cid-fqk6uxis></span></label> <label class="sx-switch" data-astro-cid-fqk6uxis><input type="checkbox" name="scope_restricted"${addAttribute(value.restricted, "checked")} data-astro-cid-fqk6uxis><span class="sx-switch-text" data-astro-cid-fqk6uxis><b data-astro-cid-fqk6uxis>${dt("Restricted")}</b><em data-astro-cid-fqk6uxis>${dt("When somebody who is not a moderator uses it, the answer goes to the channel you choose.")}</em></span><span class="sx-toggle" data-astro-cid-fqk6uxis></span></label> </div> <div class="sx-field csf-answer" data-astro-cid-fqk6uxis> <label${addAttribute(`${idPrefix}-answer`, "for")} data-astro-cid-fqk6uxis>${dt("Answer channel for restricted use")}</label> <select${addAttribute(`${idPrefix}-answer`, "id")} name="scope_restricted_channel" data-astro-cid-fqk6uxis> <option value="" data-astro-cid-fqk6uxis>${dt("Choose a channel")}</option> ${channelOptions.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(value.restrictedChannel === c.id, "selected")} data-astro-cid-fqk6uxis>${c.name}</option>`)} </select> </div> </div> `;
}, "/home/runner/work/petto-web/petto-web/src/components/CommandScopeFields.astro", void 0);

const MAX_SCOPE_IDS = 25;
const ID = /^\d{15,25}$/;
const idsOf = (value) => Array.isArray(value) ? [...new Set(value.map(String).filter((id) => ID.test(id)))].slice(0, MAX_SCOPE_IDS) : [];
function scopeOf(options) {
  const raw = options && typeof options === "object" && !Array.isArray(options) ? options : {};
  return {
    allowChannels: idsOf(raw.allowChannels),
    blockChannels: idsOf(raw.blockChannels),
    allowRoles: idsOf(raw.allowRoles),
    blockRoles: idsOf(raw.blockRoles),
    nsfw: raw.nsfw === true,
    restricted: raw.restricted === true,
    restrictedChannel: ID.test(String(raw.restrictedChannel ?? "")) ? String(raw.restrictedChannel) : null
  };
}
function isScoped(scope) {
  return scope.allowChannels.length > 0 || scope.blockChannels.length > 0 || scope.allowRoles.length > 0 || scope.blockRoles.length > 0 || scope.nsfw || scope.restricted && scope.restrictedChannel !== null;
}
function scopeFromForm(form) {
  const ids = (name) => idsOf(form.getAll(name));
  const restrictedChannel = String(form.get("scope_restricted_channel") ?? "");
  const restricted = form.has("scope_restricted") && ID.test(restrictedChannel);
  return {
    allowChannels: ids("scope_allow_channels"),
    blockChannels: ids("scope_block_channels"),
    allowRoles: ids("scope_allow_roles"),
    blockRoles: ids("scope_block_roles"),
    nsfw: form.has("scope_nsfw"),
    restricted,
    restrictedChannel: ID.test(restrictedChannel) ? restrictedChannel : null
  };
}
function withScope(existing, scope) {
  const base = existing && typeof existing === "object" && !Array.isArray(existing) ? { ...existing } : {};
  return { ...base, ...scope };
}

const PROTECTED_COMMANDS = /* @__PURE__ */ new Set(["disablecommand", "help"]);
const MAX_COMMANDS_AT_ONCE = 25;
const MAX_CHANNELS_AT_ONCE = 10;
const realNames = /* @__PURE__ */ new Map();
for (const command of generated) {
  if (command.contextMenu) continue;
  realNames.set(command.name.toLowerCase(), command.name.toLowerCase());
}
for (const command of generated) {
  for (const action of command.actions ?? []) {
    const name = action.name.toLowerCase();
    if (!realNames.has(name)) realNames.set(name, name);
  }
}
for (const command of generated) {
  for (const action of command.actions ?? []) {
    for (const alias of action.aliases) if (!realNames.has(alias.toLowerCase())) realNames.set(alias.toLowerCase(), action.name.toLowerCase());
  }
}
for (const command of generated) {
  for (const key of command.ruleKeys ?? []) {
    const name = key.name.toLowerCase();
    if (!realNames.has(name)) realNames.set(name, name);
    for (const alias of key.aliases) if (!realNames.has(alias.toLowerCase())) realNames.set(alias.toLowerCase(), name);
  }
}
for (const command of generated) {
  if (command.contextMenu) continue;
  for (const alias of command.aliases) if (!realNames.has(alias.toLowerCase())) realNames.set(alias.toLowerCase(), command.name.toLowerCase());
}
const disableableCommands = [...new Set(realNames.values())].filter((name) => !PROTECTED_COMMANDS.has(name)).sort();
function realCommandName(raw) {
  const name = String(raw ?? "").trim().replace(/^[^\p{L}\p{N}]+/u, "").toLowerCase();
  return name ? realNames.get(name) ?? null : null;
}
function readCommandNames(raw) {
  const names = /* @__PURE__ */ new Set();
  const unknown = [];
  const refused = /* @__PURE__ */ new Set();
  for (const word of String(raw ?? "").split(/[\s,]+/).filter(Boolean)) {
    const name = realCommandName(word);
    if (!name) unknown.push(word.slice(0, 32));
    else if (PROTECTED_COMMANDS.has(name)) refused.add(name);
    else names.add(name);
  }
  return { names: [...names], unknown, refused: [...refused] };
}
function groupRules(rules) {
  const groups = /* @__PURE__ */ new Map();
  for (const rule of rules) {
    const key = rule.channelId ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(rule);
  }
  return [...groups.entries()].sort(([a], [b]) => a === "" ? -1 : b === "" ? 1 : a.localeCompare(b)).map(([key, list]) => ({ channelId: key || null, rules: list.sort((x, y) => x.command.localeCompare(y.command)) }));
}

const TIMER_UNITS = [
  { id: "seconds", ms: 1e3 },
  { id: "minutes", ms: 6e4 },
  { id: "hours", ms: 36e5 },
  { id: "days", ms: 864e5 },
  { id: "weeks", ms: 6048e5 },
  { id: "months", ms: 30 * 864e5 },
  { id: "years", ms: 365 * 864e5 }
];
const MIN_TIMER_MS = 10 * 6e4;
const MAX_TIMER_MS = 10 * 365 * 864e5;
function timerIntervalMs(form) {
  const unit = TIMER_UNITS.find((u) => u.id === String(form.get("interval_unit") ?? "minutes")) ?? TIMER_UNITS[1];
  const value = Number(form.get("interval_value") ?? form.get("interval_minutes") ?? 10);
  const ms = Math.round((Number.isFinite(value) && value > 0 ? value : 10) * unit.ms);
  return Math.max(MIN_TIMER_MS, Math.min(MAX_TIMER_MS, ms));
}
function splitInterval(ms) {
  for (let i = TIMER_UNITS.length - 1; i >= 0; i--) {
    const u = TIMER_UNITS[i];
    if (ms >= u.ms && ms % u.ms === 0) return { value: ms / u.ms, unit: u.id };
  }
  return { value: Math.max(1, Math.round(ms / 6e4)), unit: "minutes" };
}

const SCHEDULE_INTERVAL_MS = { daily: 864e5, weekly: 6048e5 };
const DAY_MS = 864e5;
const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;
const OFFSET_RE = /^(?:UTC|GMT)\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?$/i;
function timeZoneList() {
  let zones = [];
  try {
    zones = Intl.supportedValuesOf?.("timeZone") ?? [];
  } catch {
  }
  return ["UTC", ...zones.filter((zone) => zone !== "UTC")];
}
function normalizeTime(input) {
  const match = TIME_RE.exec(String(input ?? "").trim());
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : null;
}
function fixedOffsetMinutes(zone) {
  const match = OFFSET_RE.exec(zone.trim());
  if (!match) return null;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? 0);
  if (hours > 14 || minutes > 59 || hours === 14 && minutes > 0) return null;
  return (match[1] === "-" ? -1 : 1) * (hours * 60 + minutes);
}
function normalizeTimeZone(input) {
  const text = String(input ?? "").trim();
  if (!text || text.length > 64) return null;
  if (/^(utc|gmt|z)$/i.test(text)) return "UTC";
  const offset = fixedOffsetMinutes(text);
  if (offset !== null) {
    if (offset === 0) return "UTC";
    const abs = Math.abs(offset);
    return `UTC${offset < 0 ? "-" : "+"}${Math.floor(abs / 60)}${abs % 60 ? `:${String(abs % 60).padStart(2, "0")}` : ""}`;
  }
  if (!/^[A-Za-z][A-Za-z0-9_+\-/]*$/.test(text)) return null;
  try {
    const resolved = new Intl.DateTimeFormat("en-US", { timeZone: text }).resolvedOptions().timeZone;
    return resolved === "Etc/UTC" || resolved === "Etc/GMT" ? "UTC" : resolved;
  } catch {
    return null;
  }
}
function zoneOffsetMs(zone, ms) {
  const fixed = zone === "UTC" ? 0 : fixedOffsetMinutes(zone);
  if (fixed !== null) return fixed * 6e4;
  const parts = {};
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: zone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
  for (const part of formatter.formatToParts(new Date(ms))) parts[part.type] = part.value;
  const wall = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour) % 24, Number(parts.minute), Number(parts.second));
  return wall - Math.floor(ms / 1e3) * 1e3;
}
function zonedTimeToUtc(zone, year, month, day, hour, minute) {
  const local = Date.UTC(year, month, day, hour, minute);
  const before = zoneOffsetMs(zone, local - DAY_MS / 2);
  const after = zoneOffsetMs(zone, local + DAY_MS / 2);
  const valid = [.../* @__PURE__ */ new Set([before, after])].map((offset) => local - offset).filter((ms) => ms + zoneOffsetMs(zone, ms) === local);
  return valid.length ? Math.min(...valid) : local - before;
}
function nextScheduledRun(timer, afterMs = Date.now()) {
  if (timer.schedule !== "daily" && timer.schedule !== "weekly") return null;
  const time = normalizeTime(timer.atTime);
  const zone = normalizeTimeZone(timer.timezone || "UTC");
  const weekday = timer.schedule === "weekly" ? Number(timer.weekday) : null;
  if (!time || !zone || weekday !== null && !(weekday >= 0 && weekday <= 6)) return null;
  const [hour, minute] = time.split(":").map(Number);
  const today = new Date(afterMs + zoneOffsetMs(zone, afterMs));
  for (let add = 0; add <= 8; add += 1) {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + add));
    if (weekday !== null && date.getUTCDay() !== weekday) continue;
    const at = zonedTimeToUtc(zone, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, minute);
    if (at > afterMs) return new Date(at);
  }
  return null;
}
function timerScheduleFields(form) {
  const schedule = String(form.get("schedule") ?? "interval");
  if (schedule !== "daily" && schedule !== "weekly") return null;
  const atTime = normalizeTime(form.get("at_time"));
  if (!atTime) return { error: "time" };
  const timezone = normalizeTimeZone(String(form.get("timezone") ?? "").trim() || "UTC");
  if (!timezone) return { error: "timezone" };
  const weekdayRaw = String(form.get("weekday") ?? "");
  const weekday = schedule === "weekly" ? Number(weekdayRaw) : null;
  if (weekday !== null && !/^[0-6]$/.test(weekdayRaw)) return { error: "weekday" };
  const next = nextScheduledRun({ schedule, atTime, timezone, weekday });
  if (!next) return { error: "time" };
  return { schedule, at_time: atTime, timezone, weekday, interval_ms: SCHEDULE_INTERVAL_MS[schedule], next_run_at: next.toISOString() };
}
function weekdayName(weekday, lang) {
  try {
    return new Intl.DateTimeFormat(lang, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 7 + weekday)));
  } catch {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][weekday] ?? String(weekday);
  }
}

const $$Astro$2 = createAstro("https://petto.sbs");
const $$LiveTextPreview = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$LiveTextPreview;
  const { id, label, text = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="lm-box"${addAttribute(id, "data-lm-preview")}${addAttribute(!text.trim(), "hidden")}> ${label && renderTemplate`<span class="lm-label">${label}</span>`} <div class="lm-body">${unescapeHTML(renderMarkdown(text))}</div> </div>  `;
}, "/home/runner/work/petto-web/petto-web/src/components/LiveTextPreview.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b, _c, _d, _e, _f;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashAutomation = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashAutomation;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const dth = makeT(dashLang, true);
  const { user, guildId, guildName, guildIcon, prefix = "!", monkeyboard = null, customCommands, premiumActive, autoResponders, stickyMessages, disabledCommands, reactionRoles, reactionTriggers, reactionMessages, autoThreads, roles, channels, embedTemplateNames, saved, notice = null, reactionRoleError, error, aliases, timers, starboard, voiceMaster, voiceChannels, channelCategories, managedWebhooks, serverCounters, stickyRolesEnabled = false, stickyRolesSaved = 0, stickyRolesWaiting = [], section, customEmojis = [] } = Astro2.props;
  const channelOptions = channels.map((c) => ({ id: c.id, name: `#${c.name}` }));
  const roleOptions = roles.map((r) => ({ id: r.id, name: r.name }));
  const vmName = (list, id) => list.find((c) => c.id === id)?.name ?? "\u2014";
  const vmNameValue = voiceMaster?.defaultName ?? "{user.name}";
  const vmShort = (text) => text.length > 12 ? `${text.slice(0, 11)}\u2026` : text;
  const vmSplit = (text) => {
    const [head, ...rest] = text.split(": ");
    return [head, rest.join(": ")];
  };
  const vmPrivacy = {
    public: vmSplit(dt("Public: everyone can see and join")),
    locked: vmSplit(dt("Locked: everyone sees it, only invited members join")),
    hidden: vmSplit(dt("Hidden: only invited members see and join"))
  };
  const newsChannelIds = new Set(channels.filter((c) => c.type === 5).map((c) => c.id));
  function channelName(id) {
    return channels.find((c) => c.id === id)?.name ?? id;
  }
  function roleName(id) {
    return roles.find((r) => r.id === id)?.name ?? id;
  }
  const sectionMeta = {
    overview: { label: dt("Automation"), description: dt("Manage every automation module independently from one place.") },
    "custom-commands": { label: dt("Custom commands"), description: dt("Create as many prefix commands as your server needs.") },
    autoresponders: { label: dt("Autoresponders"), description: dt("Build multiple automatic replies with channel, role, and embed rules.") },
    "sticky-messages": { label: dt("Sticky messages"), description: dt("Keep one configurable message pinned at the bottom of each selected channel.") },
    "reaction-roles": { label: dt("Reaction roles"), description: dt("Bind multiple messages, emojis, and roles to build flexible role menus.") },
    "reaction-triggers": { label: dt("Reaction triggers"), description: dt("React to words or phrases with independent matching and scope rules.") },
    "reaction-messages": { label: dt("Message reactions"), description: dt("Add a configurable set of emojis to every new message in selected channels.") },
    "auto-threads": { label: "Auto-threading", description: dt("Create independent thread rules for each channel that needs them.") },
    "disabled-commands": { label: dt("Disabled commands"), description: dt("Disable commands globally or only in selected channels.") },
    aliases: { label: dt("Command aliases"), description: dt("Create multiple prefix shortcuts for your most-used commands.") },
    timers: { label: dt("Repeating timers"), description: dt("Run multiple recurring messages with independent channels and intervals.") },
    starboard: { label: dt("Starboard"), description: dt("Configure how highlighted messages are collected and displayed.") },
    monkeyboard: { label: dt("Monkeyboard"), description: dt("The starboard's opposite: messages that get enough monkeys are collected in their own channel.") },
    voicemaster: { label: dt("VoiceMaster"), description: dt("Configure the temporary voice channel system and its control panel.") },
    webhooks: { label: dt("Webhooks"), description: dt("Manage multiple webhooks and send customized messages from one place.") },
    "sticky-roles": { label: dt("Sticky roles"), description: dt("Give members back the roles they had when they come back to the server.") },
    counters: { label: dt("Live counters"), description: dt("Create multiple live counters with their own channel, format, and interval.") }
  };
  const selectedSection = sectionMeta[section ?? ""] ? section ?? "" : "overview";
  const selectedMeta = sectionMeta[selectedSection];
  const showSection = (id) => selectedSection !== id ? "am-section-hidden" : "";
  const customCommandLimit = planLimits(premiumActive).customCommands;
  const customCommandAtLimit = customCommands.length >= customCommandLimit;
  const responderLimit = planLimits(premiumActive).autoResponders;
  const timerUnitLabel = { seconds: dt("Seconds"), minutes: dt("Minutes"), hours: dt("Hours"), days: dt("Days"), weeks: dt("Weeks"), months: dt("Months"), years: dt("Years") };
  ({ seconds: dt("1 second"), minutes: dt("1 minute"), hours: dt("1 hour"), days: dt("1 day"), weeks: dt("1 week"), months: dt("1 month"), years: dt("1 year") });
  const intervalText = (ms) => formatDuration(ms / 1e3, { locale: dashLocale(dashLang), max: "y" });
  const timerWhen = (t) => t.schedule === "daily" ? dt("Every day at {a} ({b})", { a: t.atTime ?? "", b: t.timezone ?? "UTC" }) : t.schedule === "weekly" ? dt("Every {a} at {b} ({c})", { a: weekdayName(Number(t.weekday ?? 0), dashLang), b: t.atTime ?? "", c: t.timezone ?? "UTC" }) : intervalText(t.intervalMs);
  const timerWeekdays = [1, 2, 3, 4, 5, 6, 0].map((day) => ({ day, name: weekdayName(day, dashLang) }));
  const timerZones = selectedSection === "timers" ? timeZoneList() : [];
  const timerNextText = (iso) => {
    const at = Date.parse(iso);
    return Number.isFinite(at) ? new Date(at).toISOString().replace("T", " ").slice(0, 16) + " UTC" : "";
  };
  const { overview = null } = Astro2.props;
  const ax2Locale = dashLocale(dashLang);
  const ax2In = (iso) => {
    const at = iso ? Date.parse(iso) : NaN;
    if (!Number.isFinite(at)) return "\u2014";
    const seconds = (at - Date.now()) / 1e3;
    return seconds < 45 ? dt("Due now") : dt("in {a}", { a: formatDuration(seconds, { locale: ax2Locale }) });
  };
  const ax2NextTimer = timers.filter((t) => !t.paused && t.nextRunAt).map((t) => t.nextRunAt).sort((a, b) => Date.parse(a) - Date.parse(b))[0] ?? null;
  const ax2Repeats = [["interval", dt("Every interval")], ["daily", dt("Every day")], ["weekly", dt("Every week")]];
  const ax2Modes = [["contains", dt("contains")], ["startsWith", dt("starts with")], ["endsWith", dt("ends with")], ["exact", dt("exact")]];
  const ax2Emoji = (value) => {
    const m = /^<(a?):(\w+):(\d+)>$/.exec(value ?? "");
    return m ? { src: `https://cdn.discordapp.com/emojis/${m[3]}.${m[1] ? "gif" : "png"}?size=48`, text: `:${m[2]}:` } : { src: "", text: value ?? "" };
  };
  const ax2Hub = () => {
    const n = (id) => overview?.counts[id] ?? null;
    const boardCounts = ["starboard", "monkeyboard", "clownboard"].map(n);
    const boards = boardCounts.every((c) => c === null) ? null : boardCounts.reduce((sum, c) => sum + (c ?? 0), 0);
    const base = `/dash/guild/${guildId}`;
    const feature = (id, href, count, on = null) => ({ id, href, label: sectionMeta[id].label, desc: sectionMeta[id].description, icon: sectionIcons[id], color: sectionColors[id] ?? "var(--accent)", n: count, on });
    const inSection = (id, on = null) => feature(id, `${base}/automation?section=${id}`, n(id), on);
    return [
      inSection("custom-commands"),
      inSection("autoresponders"),
      inSection("sticky-messages"),
      inSection("reaction-roles"),
      inSection("reaction-messages"),
      inSection("reaction-triggers"),
      inSection("auto-threads"),
      inSection("timers"),
      inSection("aliases"),
      inSection("disabled-commands"),
      inSection("webhooks"),
      feature("counters", `${base}/counters`, n("counters")),
      inSection("voicemaster", overview ? Boolean(overview.on.voicemaster) : null),
      inSection("sticky-roles", overview ? Boolean(overview.on["sticky-roles"]) : null),
      { id: "boards", href: `${base}/boards`, label: dt("Boards"), desc: dt("Collect the best messages of the server in a channel of their own."), icon: "ph:star-fill", color: sectionColors.starboard, n: boards, on: null }
    ];
  };
  const sectionIcons = {
    "custom-commands": "ph:chat-circle-dots-fill",
    autoresponders: "ph:robot-fill",
    "sticky-messages": "ph:push-pin-fill",
    "reaction-roles": "ph:smiley-fill",
    "reaction-triggers": "ph:smiley-fill",
    "reaction-messages": "ph:chat-circle-dots-fill",
    "auto-threads": "ph:chats-circle-fill",
    "disabled-commands": "ph:prohibit-fill",
    aliases: "ph:command-fill",
    timers: "ph:timer-fill",
    starboard: "ph:star-fill",
    monkeyboard: "ph:smiley-fill",
    voicemaster: "ph:speaker-high-fill",
    webhooks: "ph:webhooks-logo-fill",
    counters: "ph:chart-line-up-fill",
    "sticky-roles": "ph:arrow-counter-clockwise-fill"
  };
  const sectionColors = {
    "custom-commands": "var(--accent)",
    autoresponders: "#c792ea",
    "sticky-messages": "#5eead4",
    "reaction-roles": "#fed53c",
    "reaction-triggers": "#f59e0b",
    "reaction-messages": "#f59e0b",
    "auto-threads": "#5b8def",
    "disabled-commands": "#fe6465",
    aliases: "#c792ea",
    timers: "#5eead4",
    starboard: "#fed53c",
    monkeyboard: "#c98b4a",
    voicemaster: "var(--accent)",
    webhooks: "#a78bfa",
    "sticky-roles": "#5eead4",
    counters: "#2dd4a7"
  };
  const ax2Features = selectedSection === "overview" ? ax2Hub() : [];
  const ax2Timers = overview?.timers ?? null;
  const ax2InUse = ax2Features.filter((f) => f.on === true || (f.n ?? 0) > 0).length;
  const ax2Items = ax2Features.reduce((sum, f) => sum + (f.on === null ? f.n ?? 0 : 0), 0);
  const matchLabel = { contains: "contains", startsWith: dt("starts with"), endsWith: dt("ends with"), exact: "exact", regex: "regex" };
  const matchHelp = {
    contains: dt("Replies when the trigger appears anywhere in the message."),
    startsWith: dt("Replies when the message starts with the trigger."),
    endsWith: dt("Replies when the message ends with the trigger."),
    exact: dt("Replies only when the whole message is the trigger."),
    regex: dt("Replies when the message matches this regular expression.")
  };
  const dcCategoryIcons = {
    moderation: "ph:shield-check-fill",
    tickets: "ph:ticket",
    leveling: "ph:chart-line-up-fill",
    giveaways: "ph:gift-fill",
    automation: "ph:robot-fill",
    community: "ph:users-three-fill",
    onboarding: "ph:hand-waving-fill",
    logging: "ph:notebook-fill",
    info: "ph:info-fill",
    setup: "ph:gear-fill",
    roleplay: "ph:heart-fill"
  };
  const dcCategoryOf = /* @__PURE__ */ new Map();
  const DcTile = disabledCommands.length ? "button" : "div";
  const dcCategories = selectedSection !== "disabled-commands" ? [] : (() => {
    const all = getAllCommands();
    for (const c of all) dcCategoryOf.set(c.name.toLowerCase(), c.category);
    const offNames = new Set(disabledCommands.map((d) => d.command.toLowerCase()));
    return useTranslations(dashLang).commandsPage.categories.map((cat) => {
      const names = all.filter((c) => c.category === cat.id).map((c) => c.name.toLowerCase());
      return { id: cat.id, title: cat.title, icon: dcCategoryIcons[cat.id] ?? "ph:squares-four-fill", total: names.length, off: names.filter((n) => offNames.has(n)).length };
    }).filter((c) => c.total > 0);
  })();
  const withMessages = ["webhooks", "timers", "custom-commands", "autoresponders", "sticky-messages", "auto-threads"].includes(selectedSection);
  const ax1Code = customCommands.filter((c) => c.isCode).length;
  const ax1CmdEmbed = customCommands.filter((c) => !c.isCode && c.embedTemplate).length;
  const ax1ArEmbed = autoResponders.filter((a) => a.embedTemplate || a.replyType === "embed").length;
  const ax1ArScoped = autoResponders.filter((a) => a.channelIds.length > 0 || a.roleIds.length > 0).length;
  const ax1StickyEmbed = stickyMessages.filter((s) => s.embedTemplate).length;
  const ax1RrButtons = reactionRoles.filter((r) => r.interactionType === "button").length;
  const ax1RrMessages = new Set(reactionRoles.map((r) => r.messageId)).size;
  const ax1ThreadsMsg = autoThreads.filter((t) => t.messageText || t.embedTemplate).length;
  const ax1DcServer = disabledCommands.filter((d) => !d.channelId).length;
  const ax1RrMenus = (() => {
    const byMessage = /* @__PURE__ */ new Map();
    for (const r of reactionRoles) {
      const group = byMessage.get(r.messageId) ?? { messageId: r.messageId, channelId: r.channelId ?? "", items: [] };
      group.items.push(r);
      byMessage.set(r.messageId, group);
    }
    return [...byMessage.values()];
  })();
  const ax1Emoji = (emoji) => {
    const m = emoji.match(/^<(a?):(\w+):(\d+)>$/);
    return m ? { name: m[2], src: `https://cdn.discordapp.com/emojis/${m[3]}.${m[1] ? "gif" : "webp"}?size=48` } : null;
  };
  const ax1Archive = [60, 1440, 4320, 10080];
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": selectedSection === "overview" ? "automation-overview" : selectedSection, "pageTitle": selectedMeta.label, "data-astro-cid-yjoymnrx": true }, { "default": ($$result2) => renderTemplate(_f || (_f = __template([" ", " ", " ", '<div class="am-heading" data-astro-cid-yjoymnrx> <h1 data-astro-cid-yjoymnrx>', "</h1> ", " </div> ", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", " <script>\n    // The usual look of a starboard repost is drawn while no saved design is picked.\n    if (!window.__boardMock) {\n      window.__boardMock = true;\n      document.addEventListener('change', function (e) {\n        var select = e.target;\n        if (!select || select.name !== 'embed_template') return;\n        var scope = select.closest('.am-channel-scope');\n        var mock = scope && scope.querySelector('[data-board-mock]') ? scope.querySelector('.am-board-mock') : null;\n        if (mock) mock.hidden = !!select.value;\n      });\n    }\n  <\/script> <script>(function(){", "\n  // The add forms use placeholders as their only hint; this gives each field a label that stays visible while typing. A form put in the\n  // page later (the edit form of an autoresponder row) is given them when it arrives.\n  (window.amFloatLabels = function () {\n    document.querySelectorAll('.am-section form.am-add:not([data-fl])').forEach(function (form) {\n      form.setAttribute('data-fl', '1');\n      form.querySelectorAll('input, select, textarea').forEach(function (el) {\n        var type = (el.getAttribute('type') || '').toLowerCase();\n        if (['hidden', 'checkbox', 'radio', 'file', 'color', 'submit', 'button'].indexOf(type) !== -1) return;\n        // The search box of a role or channel picker already says what it is: a label above it would repeat it.\n        if (el.closest('label, [data-colorpicker], .am-send-modes, [data-multiselect]') || el.hasAttribute('data-no-label')) return;\n        var text = el.getAttribute('aria-label') || el.getAttribute('placeholder') || flNames[el.getAttribute('name')] || '';\n        // A select whose first choice is already readable (not a disabled placeholder) needs no extra label.\n        if (!text && el.tagName === 'SELECT' && el.options.length && el.options[0].disabled) text = el.options[0].textContent || '';\n        text = text.trim();\n        if (!text) return;\n        var wrap = document.createElement('label');\n        wrap.className = 'am-fl';\n        var t = document.createElement('span');\n        t.className = 'am-fl-t';\n        t.textContent = text;\n        el.parentNode.insertBefore(wrap, el);\n        wrap.appendChild(t);\n        wrap.appendChild(el);\n      });\n    });\n  })();\n})();<\/script> "])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-yjoymnrx": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-yjoymnrx": true }), maybeRenderHead(), selectedMeta.label, selectedSection !== "overview" && renderTemplate`<a class="am-overview-link"${addAttribute(`/dash/guild/${guildId}/automation?section=overview`, "href")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:squares-four-fill", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}${dt("Automation overview")}</a>`, withMessages && renderTemplate`${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "emojis": customEmojis, "data-astro-cid-yjoymnrx": true })}`, saved && renderTemplate`<div class="am-flash" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-yjoymnrx": true })}${dt("Saved.")}</div>`, notice && renderTemplate`<div class="am-flash" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-yjoymnrx": true })}${notice}</div>`, error && renderTemplate`<div class="am-error" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}${error}</div>`, selectedSection === "overview" && renderTemplate`<div class="ax2-page" data-section="overview" data-astro-cid-yjoymnrx> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Features in use"), value: ax2InUse, tone: "joins" },
    { label: dt("Items set up"), value: ax2Items, tone: "invites" },
    { label: dt("Timers running"), value: ax2Timers?.running ?? 0, text: ax2Timers ? void 0 : "\u2014", tone: "voice" },
    { label: dt("Next timer"), value: 0, text: ax2Timers?.nextRunAt ? ax2In(ax2Timers.nextRunAt) : "\u2014", tone: "reactions" }
  ], "data-astro-cid-yjoymnrx": true })} <div class="ax2-head" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>${dt("Features")} <span class="ax2-count" data-astro-cid-yjoymnrx>${ax2Features.length}</span></h2> <p data-astro-cid-yjoymnrx>${sectionMeta.overview.description}</p> </div> <div class="ax2-hub dgl-stagger" data-astro-cid-yjoymnrx> ${ax2Features.map((f) => renderTemplate`<a class="ax2-feat"${addAttribute(`--c:${f.color}`, "style")}${addAttribute(f.href, "href")}${addAttribute(f.desc, "title")} data-astro-cid-yjoymnrx> <span class="ax2-feat-ico" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": f.icon, "width": "18", "height": "18", "data-astro-cid-yjoymnrx": true })}</span> <span class="ax2-feat-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${f.label}</b></span> ${f.on !== null ? renderTemplate`<span${addAttribute(["ax2-feat-n", f.on ? "is-on" : "is-zero"], "class:list")} data-astro-cid-yjoymnrx>${f.on ? dt("On") : dt("Off")}</span>` : renderTemplate`<span${addAttribute(["ax2-feat-n", { "is-zero": !f.n }], "class:list")} data-astro-cid-yjoymnrx>${f.n === null ? "\u2014" : f.n.toLocaleString(ax2Locale)}</span>`} </a>`)} </div> </div>`, selectedSection === "aliases" && renderTemplate`<div class="ax2-page" data-section="aliases" data-astro-cid-yjoymnrx> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Aliases"), value: aliases.length, tone: "invites" },
    { label: dt("With arguments"), value: aliases.filter((a) => /\{\d+\}/.test(a.command)).length, tone: "voice" },
    { label: dt("Prefix"), value: 0, text: prefix, tone: "reactions" }
  ], "data-astro-cid-yjoymnrx": true })} <div class="ax2-head" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>${dt("Command aliases")} <span class="ax2-count" data-astro-cid-yjoymnrx>${aliases.length}</span></h2> <p data-astro-cid-yjoymnrx>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Aliases are prefix-only. Use <code>{a}</code>, <code>{b}</code>, and so on for typed arguments.", { a: "{0}", b: "{1}" }))}` })}</p> </div> ${aliases.length === 0 && renderTemplate`<p class="ax2-empty" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:command-fill", "width": "18", "height": "18", "data-astro-cid-yjoymnrx": true })}${dt("Nothing here yet. Add the first one below.")}</p>`} <div class="ax2-list ax2-duo dgl-stagger" data-astro-cid-yjoymnrx> ${aliases.map((a) => renderTemplate`<details class="ax2-item" style="--c:var(--accent)" data-astro-cid-yjoymnrx> <summary class="ax2-sum" data-astro-cid-yjoymnrx> <span class="ax2-ico" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:command-fill", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true })}</span> <span class="ax2-main" data-astro-cid-yjoymnrx><code class="ax2-key" data-astro-cid-yjoymnrx>${prefix}${a.name}</code><span class="ax2-val"${addAttribute(a.command, "title")} data-astro-cid-yjoymnrx>${a.command}</span></span> <span class="ax2-acts" data-astro-cid-yjoymnrx><span class="ax2-act" aria-hidden="true" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}<span class="ax2-t-edit" data-astro-cid-yjoymnrx>${dt("Edit")}</span><span class="ax2-t-close" data-astro-cid-yjoymnrx>${dt("Close")}</span></span><button type="submit"${addAttribute(`am-del-alias-${a.id}`, "form")} class="ax2-del"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-yjoymnrx": true })}</button></span> </summary> <form method="POST" class="ax2-edit" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_alias" data-astro-cid-yjoymnrx><input type="hidden" name="name"${addAttribute(a.name, "value")} data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-alias-cmd-${a.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Target command")}</label><textarea${addAttribute(`ax2-alias-cmd-${a.id}`, "id")} name="command" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="500" required data-astro-cid-yjoymnrx>${a.command}</textarea></div> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save")}</button></div> </form> <form method="POST"${addAttribute(`am-del-alias-${a.id}`, "id")} data-no-dirty hidden data-astro-cid-yjoymnrx><input type="hidden" name="action" value="delete_alias" data-astro-cid-yjoymnrx><input type="hidden" name="name"${addAttribute(a.name, "value")} data-astro-cid-yjoymnrx></form> </details>`)} </div> <form method="POST" class="ax2-add" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_alias" data-astro-cid-yjoymnrx> <div class="ax2-add-title" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true })}${dt("Add an alias")}</div> <div class="sx-grid ax2-grid-narrow" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-alias-name" data-astro-cid-yjoymnrx>${dt("Shortcut")}</label><input id="ax2-alias-name" type="text" name="name" maxlength="32" required data-count placeholder="w" data-astro-cid-yjoymnrx></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-alias-command" data-astro-cid-yjoymnrx>${dt("Target command")}</label><textarea id="ax2-alias-command" name="command" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="500" required${addAttribute(dt("Target command, e.g. warn {0} repeated spam"), "placeholder")} data-astro-cid-yjoymnrx></textarea></div> </div> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Add")}</button></div> </form> </div>`, selectedSection === "webhooks" && renderTemplate(_a || (_a = __template(['<div class="ax2-page" data-section="webhooks" data-astro-cid-yjoymnrx> ', ' <div class="ax2-head" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>', ' <span class="ax2-count" data-astro-cid-yjoymnrx>', "</span></h2> <p data-astro-cid-yjoymnrx>", "</p> </div> ", ' <div class="ax2-list dgl-stagger" data-astro-cid-yjoymnrx> ', ' </div> <form method="POST" class="ax2-add" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="create_webhook" data-astro-cid-yjoymnrx> <div class="ax2-add-title" data-astro-cid-yjoymnrx>', "", '</div> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-channel" data-astro-cid-yjoymnrx>', '</label><select id="ax2-wh-channel" name="channel_id" required data-astro-cid-yjoymnrx><option value="" disabled selected data-astro-cid-yjoymnrx>', "</option>", '</select></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-new-name" data-astro-cid-yjoymnrx>', '</label><input id="ax2-wh-new-name" type="text" name="name" maxlength="80" required data-count data-astro-cid-yjoymnrx></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-new-user" data-astro-cid-yjoymnrx>', '</label><input id="ax2-wh-new-user" type="text" name="default_username" maxlength="80" data-count data-astro-cid-yjoymnrx></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-new-avatar" data-astro-cid-yjoymnrx>', '</label><input id="ax2-wh-new-avatar" type="url" name="default_avatar_url" placeholder="https://" data-astro-cid-yjoymnrx></div> </div> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>', "", "</button></div> </form> ", ` <script>
      (function () {
        document.querySelectorAll('.ax2-send').forEach(function (form) {
          if (form.dataset.sendBound) return;
          form.dataset.sendBound = '1';
          function sync() {
            var mode = (form.querySelector('input[name="send_mode"]:checked') || {}).value || 'text';
            form.querySelectorAll('[data-send-pane]').forEach(function (pane) {
              var name = pane.getAttribute('data-send-pane');
              // The text fields stay visible while editing: an edit can change the text as well as the design.
              pane.hidden = !(name === mode || (mode === 'edit' && name === 'text'));
            });
            var design = form.querySelector('[data-send-pane="design"]');
            if (design && mode === 'edit') design.hidden = false;
            var editPane = form.querySelector('[data-send-pane="edit"]');
            if (editPane) editPane.hidden = mode !== 'edit';
            var id = form.querySelector('[name="edit_message_id"]');
            if (id) id.required = mode === 'edit';
          }
          form.querySelectorAll('input[name="send_mode"]').forEach(function (r) { r.addEventListener('change', sync); });
          sync();
        });
      })();
    <\/script> </div>`])), renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Webhooks"), value: managedWebhooks.length, tone: "invites" },
    { label: dt("Enabled"), value: managedWebhooks.filter((w) => w.enabled).length, tone: "joins" },
    { label: dt("Disabled"), value: managedWebhooks.filter((w) => !w.enabled).length, tone: "leaves" },
    { label: dt("Channels"), value: new Set(managedWebhooks.map((w) => w.channelId)).size, tone: "voice" }
  ], "data-astro-cid-yjoymnrx": true }), dt("Managed webhooks"), managedWebhooks.length, dt("Create webhooks, send custom messages, and override their username or avatar without exposing webhook tokens in the dashboard."), managedWebhooks.length === 0 && renderTemplate`<p class="ax2-empty" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:webhooks-logo-fill", "width": "18", "height": "18", "data-astro-cid-yjoymnrx": true })}${dt("Nothing here yet. Add the first one below.")}</p>`, managedWebhooks.map((w) => renderTemplate`<details class="ax2-item"${addAttribute(`--c:${w.enabled ? "#a78bfa" : "#8b8d96"}`, "style")} data-astro-cid-yjoymnrx> <summary class="ax2-sum" data-astro-cid-yjoymnrx> <span class="ax2-ico" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:webhooks-logo-fill", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true })}</span> <span class="ax2-main" data-astro-cid-yjoymnrx><b class="ax2-title"${addAttribute(w.webhookId, "title")} data-astro-cid-yjoymnrx>${w.name}</b><span class="ax2-val" data-astro-cid-yjoymnrx>#${channelName(w.channelId)}${w.defaultMessage ? ` \xB7 ${w.defaultMessage}` : ""}</span></span> <span${addAttribute(["ax2-pill", { "is-on": w.enabled }], "class:list")} data-astro-cid-yjoymnrx>${w.enabled ? dt("Enabled") : dt("Disabled")}</span> <span class="ax2-acts" data-astro-cid-yjoymnrx><span class="ax2-act" aria-hidden="true" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}<span class="ax2-t-edit" data-astro-cid-yjoymnrx>${dt("Edit")}</span><span class="ax2-t-close" data-astro-cid-yjoymnrx>${dt("Close")}</span></span><button type="submit"${addAttribute(`am-del-webhook-${w.id}`, "form")} class="ax2-del"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-yjoymnrx": true })}</button></span> </summary> <div class="ax2-edit" data-astro-cid-yjoymnrx> <form method="POST" class="ax2-form" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="edit_webhook" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(w.id, "value")} data-astro-cid-yjoymnrx> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-wh-name-${w.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Webhook name")}</label><input${addAttribute(`ax2-wh-name-${w.id}`, "id")} type="text" name="name"${addAttribute(w.name, "value")} maxlength="80" required data-count data-astro-cid-yjoymnrx></div> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-wh-user-${w.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Default username")}</label><input${addAttribute(`ax2-wh-user-${w.id}`, "id")} type="text" name="default_username"${addAttribute(w.defaultUsername ?? "", "value")} maxlength="80" data-count data-astro-cid-yjoymnrx></div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-wh-avatar-${w.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Default avatar URL")}</label><input${addAttribute(`ax2-wh-avatar-${w.id}`, "id")} type="url" name="default_avatar_url"${addAttribute(w.defaultAvatarUrl ?? "", "value")} placeholder="https://" data-astro-cid-yjoymnrx></div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-wh-msg-${w.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Default message template")}</label><textarea${addAttribute(`ax2-wh-msg-${w.id}`, "id")} name="default_message" class="dgl-autogrow" rows="2" data-ac data-count maxlength="2000" data-astro-cid-yjoymnrx>${w.defaultMessage ?? ""}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-yjoymnrx": true })}</div> </div> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="enabled"${addAttribute(w.enabled, "checked")} data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Enabled")}</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save webhook")}</button></div> </form> <div class="ax2-foot" data-astro-cid-yjoymnrx><form method="POST" data-astro-cid-yjoymnrx><input type="hidden" name="action" value="duplicate_webhook" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(w.id, "value")} data-astro-cid-yjoymnrx><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:copy-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Duplicate")}</button></form><form method="POST"${addAttribute(`am-del-webhook-${w.id}`, "id")} data-no-dirty hidden data-astro-cid-yjoymnrx><input type="hidden" name="action" value="delete_webhook" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(w.id, "value")} data-astro-cid-yjoymnrx></form></div> </div> </details>`), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true }), dt("Create a webhook"), dt("Channel"), dt("Channel"), channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-yjoymnrx>#${c.name}</option>`), dt("Webhook name"), dt("Default username"), dt("Default avatar URL"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true }), dt("Create"), managedWebhooks.length > 0 && renderTemplate`<form method="POST" class="ax2-add ax2-send" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="send_webhook" data-astro-cid-yjoymnrx> <div class="ax2-add-title" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true })}${dt("Send a message")}</div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-pick" data-astro-cid-yjoymnrx>${dt("Webhook")}</label><select id="ax2-wh-pick" name="webhook_id" required data-astro-cid-yjoymnrx><option value="" disabled selected data-astro-cid-yjoymnrx>${dt("Webhook")}</option>${managedWebhooks.map((w) => renderTemplate`<option${addAttribute(w.id, "value")} data-astro-cid-yjoymnrx>${w.name} · #${channelName(w.channelId)}</option>`)}</select></div> <div class="dfx-chips" role="radiogroup"${addAttribute(dt("Send a message"), "aria-label")} data-astro-cid-yjoymnrx> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="send_mode" value="text" checked data-astro-cid-yjoymnrx>${dt("Text and embed")}</label> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="send_mode" value="design" data-astro-cid-yjoymnrx>${dt("Saved design")}</label> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="send_mode" value="edit" data-astro-cid-yjoymnrx>${dt("Edit a sent message")}</label> </div> <div class="ax2-pane" data-send-pane="text" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx> <label for="ax2-wh-message" data-astro-cid-yjoymnrx>${dt("Message")}</label> <textarea id="ax2-wh-message" name="message" class="dgl-autogrow" rows="3" data-ac data-count${addAttribute(dt("Message (empty uses the default)"), "placeholder")} maxlength="2000" data-lm-source="wh-message" data-astro-cid-yjoymnrx></textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-yjoymnrx": true })} ${renderComponent($$result2, "LiveTextPreview", $$LiveTextPreview, { "id": "wh-message", "data-astro-cid-yjoymnrx": true })} <span class="sx-hint" data-astro-cid-yjoymnrx>${dt("Works: **bold**, *italic*, __underline__, ~~strike~~, `code`, > quote, and a command as")} <code data-astro-cid-yjoymnrx>${"</bump:123456789>"}</code></span> </div> <div class="sx-sub" data-astro-cid-yjoymnrx> <h3 data-astro-cid-yjoymnrx>${dt("Sender")}</h3> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-username" data-astro-cid-yjoymnrx>${dt("Username override")}</label><input id="ax2-wh-username" type="text" name="username" maxlength="80" data-count data-astro-cid-yjoymnrx></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-avatar" data-astro-cid-yjoymnrx>${dt("Avatar URL override")}</label><input id="ax2-wh-avatar" type="url" name="avatar_url" placeholder="https://" data-astro-cid-yjoymnrx></div> </div> </div> <details class="ax2-fold" data-astro-cid-yjoymnrx> <summary data-astro-cid-yjoymnrx><span class="ax2-fold-title" data-astro-cid-yjoymnrx>${dt("Embed (optional)")}</span>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "ax2-caret", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}</summary> <div class="ax2-fold-body" data-astro-cid-yjoymnrx> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-etitle" data-astro-cid-yjoymnrx>${dt("Embed title")}</label><textarea id="ax2-wh-etitle" name="embed_title" class="dgl-autogrow sx-one" rows="1" data-one-line data-ac data-count maxlength="256" data-astro-cid-yjoymnrx></textarea></div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Embed color")}</span>${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "embed_color", "value": "#8399ff", "label": dt("Embed color"), "allowNone": true, "data-astro-cid-yjoymnrx": true })}</div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label for="ax2-wh-edesc" data-astro-cid-yjoymnrx>${dt("Embed description")}</label><textarea id="ax2-wh-edesc" name="embed_description" class="dgl-autogrow" rows="3" data-ac data-count maxlength="4096" data-lm-source="wh-embed" data-astro-cid-yjoymnrx></textarea>${renderComponent($$result2, "LiveTextPreview", $$LiveTextPreview, { "id": "wh-embed", "data-astro-cid-yjoymnrx": true })}</div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-eimage" data-astro-cid-yjoymnrx>${dt("Embed image URL")}</label><input id="ax2-wh-eimage" type="url" name="embed_image" placeholder="https://" data-astro-cid-yjoymnrx></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-ethumb" data-astro-cid-yjoymnrx>${dt("Embed thumbnail URL")}</label><input id="ax2-wh-ethumb" type="url" name="embed_thumbnail" placeholder="https://" data-astro-cid-yjoymnrx></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-efooter" data-astro-cid-yjoymnrx>${dt("Embed footer")}</label><textarea id="ax2-wh-efooter" name="embed_footer" class="dgl-autogrow sx-one" rows="1" data-one-line data-ac data-count maxlength="2048" data-astro-cid-yjoymnrx></textarea></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-eurl" data-astro-cid-yjoymnrx>${dt("Embed title link")}</label><input id="ax2-wh-eurl" type="url" name="embed_url" placeholder="https://" data-astro-cid-yjoymnrx></div> </div> </div> </details> </div> <div class="ax2-pane" data-send-pane="design" hidden data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-design" data-astro-cid-yjoymnrx>${dt("Saved design")}</label><select id="ax2-wh-design" name="send_design" data-astro-cid-yjoymnrx><option value="" data-astro-cid-yjoymnrx>${dt("Pick a saved design")}</option>${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")} data-astro-cid-yjoymnrx>${name}</option>`)}</select><span class="sx-hint" data-astro-cid-yjoymnrx>${dt("Sends a design from the Embeds page, with its variables filled in. Components V2 designs work too.")}</span></div> </div> <div class="ax2-pane" data-send-pane="edit" hidden data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-editid" data-astro-cid-yjoymnrx>${dt("ID of a message this webhook sent")}</label><input id="ax2-wh-editid" type="text" name="edit_message_id" placeholder="123456789012345678" inputmode="numeric" pattern="[0-9]{15,22}" data-astro-cid-yjoymnrx><span class="sx-hint" data-astro-cid-yjoymnrx>${dt("Fill the text or pick a design above and the message is changed in place instead of sending a new one.")}</span></div> </div> <details class="ax2-fold" data-astro-cid-yjoymnrx> <summary data-astro-cid-yjoymnrx><span class="ax2-fold-title" data-astro-cid-yjoymnrx>${dt("More options")}</span>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "ax2-caret", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}</summary> <div class="ax2-fold-body" data-astro-cid-yjoymnrx> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-thread" data-astro-cid-yjoymnrx>${dt("Send into a thread (thread ID)")}</label><input id="ax2-wh-thread" type="text" name="thread_id" inputmode="numeric" pattern="[0-9]{15,22}" data-astro-cid-yjoymnrx></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-wh-forum" data-astro-cid-yjoymnrx>${dt("Or start a forum post with this title")}</label><input id="ax2-wh-forum" type="text" name="thread_name" maxlength="100" data-count data-astro-cid-yjoymnrx></div> </div> <div class="sx-switches" data-astro-cid-yjoymnrx> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="silent" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Send without a notification (silent)")}</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="allow_pings" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Allow @everyone, roles and members to be pinged")}</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> </div> </div> </details> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Send")}</button></div> </form>`), selectedSection === "sticky-roles" && renderTemplate`<div class="vmx-page" data-section="sticky-roles" data-astro-cid-yjoymnrx> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Sticky roles"), value: 0, text: stickyRolesEnabled ? dt("On") : dt("Off"), tone: stickyRolesEnabled ? "joins" : "leaves" },
    stickyRolesSaved >= 1e3 ? { label: dt("Members waiting"), value: 0, text: "1000+", tone: "invites" } : { label: dt("Members waiting"), value: stickyRolesSaved, tone: "invites" }
  ], "data-astro-cid-yjoymnrx": true })} <div class="sx-duo vmx-duo" data-astro-cid-yjoymnrx> <div class="vmx-col" data-astro-cid-yjoymnrx> <form method="POST" class="sx-panel" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="save_sticky_roles" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("Sticky roles")}</h2> </div> <p class="sx-lead" data-astro-cid-yjoymnrx>${dt("When this is on, Petto remembers the roles of a member who leaves and gives them back once if the member returns.")}</p> <label class="sx-switch sx-master" data-astro-cid-yjoymnrx><input type="checkbox" name="enabled"${addAttribute(stickyRolesEnabled, "checked")} data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Give back the roles of members who return")}</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <div class="sx-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save")}</button></div> </form> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("How it works")}</h2> </div> <ol class="vmx-steps" data-astro-cid-yjoymnrx> <li data-astro-cid-yjoymnrx><span class="vmx-step-n" data-astro-cid-yjoymnrx>1</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("A member leaves the server")}</b><em data-astro-cid-yjoymnrx>${dt("Petto remembers the roles they had.")}</em></span></li> <li data-astro-cid-yjoymnrx><span class="vmx-step-n" data-astro-cid-yjoymnrx>2</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("The member comes back")}</b><em data-astro-cid-yjoymnrx>${dt("Petto gives those roles back, once.")}</em></span></li> <li data-astro-cid-yjoymnrx><span class="vmx-step-n" data-astro-cid-yjoymnrx>3</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Members waiting")}</b><em data-astro-cid-yjoymnrx>${dt("The ones who left and have not come back yet are listed here.")}</em></span></li> </ol> </div> </div> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("Waiting for their roles")}</h2> <span class="vmx-count" data-astro-cid-yjoymnrx>${stickyRolesSaved >= 1e3 ? "1000+" : stickyRolesSaved}</span> </div> ${stickyRolesWaiting.length === 0 ? renderTemplate`<div class="vmx-empty" data-astro-cid-yjoymnrx> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "28", "height": "28", "data-astro-cid-yjoymnrx": true })} <b data-astro-cid-yjoymnrx>${dt("Nobody is waiting right now.")}</b> <p data-astro-cid-yjoymnrx>${dt("When a member leaves, they show up here until they come back.")}</p> </div>` : renderTemplate`<div class="vmx-people" data-astro-cid-yjoymnrx> ${stickyRolesWaiting.map((member) => renderTemplate`<div class="vmx-person" data-astro-cid-yjoymnrx> <img${addAttribute(member.avatar, "src")} alt="" width="34" height="34" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-yjoymnrx> <span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${member.name ?? member.id}</b><code data-astro-cid-yjoymnrx>${member.id}</code></span> </div>`)} ${stickyRolesSaved > stickyRolesWaiting.length && renderTemplate`<p class="sx-hint" data-astro-cid-yjoymnrx>${dt("And {n} more.", { n: stickyRolesSaved >= 1e3 ? "1000+" : stickyRolesSaved - stickyRolesWaiting.length })}</p>`} </div>`} </div> </div> </div>`, selectedSection === "reaction-triggers" && renderTemplate`<div class="ax2-page" data-section="reaction-triggers" data-astro-cid-yjoymnrx> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Reaction triggers"), value: reactionTriggers.length, tone: "reactions" },
    { label: dt("Enabled"), value: reactionTriggers.filter((r) => r.enabled).length, tone: "joins" },
    { label: dt("Disabled"), value: reactionTriggers.filter((r) => !r.enabled).length, tone: "leaves" },
    { label: dt("With a cooldown"), value: reactionTriggers.filter((r) => r.cooldownSeconds > 0).length, tone: "voice" }
  ], "data-astro-cid-yjoymnrx": true })} <div class="ax2-head ax2-head-row" data-astro-cid-yjoymnrx> <div data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>${dt("Reaction triggers")} <span class="ax2-count" data-astro-cid-yjoymnrx>${reactionTriggers.length}</span></h2> <p data-astro-cid-yjoymnrx>${dt("React automatically when a message contains a configured word or phrase. Specific triggers are required so busy servers stay fast.")}</p> </div> <form method="POST" data-no-dirty${addAttribute(reactionTriggers.length === 0, "hidden")} data-astro-cid-yjoymnrx><input type="hidden" name="action" value="reset_reaction_triggers" data-astro-cid-yjoymnrx><button type="submit" class="ax2-danger"${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}${dt("Remove all triggers")}</button></form> </div> ${reactionTriggers.length === 0 && renderTemplate`<p class="ax2-empty" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:smiley-fill", "width": "18", "height": "18", "data-astro-cid-yjoymnrx": true })}${dt("Nothing here yet. Add the first one below.")}</p>`} <div class="ax2-list dgl-stagger" data-astro-cid-yjoymnrx> ${reactionTriggers.map((r) => {
    const mode = ax2Modes.some(([value]) => value === r.matchMode) ? r.matchMode : "contains";
    const emoji = ax2Emoji(r.emoji);
    return renderTemplate`<details class="ax2-item"${addAttribute(`--c:${r.enabled ? "#f59e0b" : "#8b8d96"}`, "style")} data-astro-cid-yjoymnrx> <summary class="ax2-sum" data-astro-cid-yjoymnrx> <span class="ax2-ico" data-astro-cid-yjoymnrx>${emoji.src ? renderTemplate`<img${addAttribute(emoji.src, "src")}${addAttribute(emoji.text, "alt")} width="22" height="22" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-yjoymnrx>` : emoji.text}</span> <span class="ax2-main" data-astro-cid-yjoymnrx> <code class="ax2-key" data-astro-cid-yjoymnrx>${r.trigger}</code> <span class="ax2-chips" data-astro-cid-yjoymnrx> <span class="ax2-chip" data-astro-cid-yjoymnrx>${ax2Modes.find(([value]) => value === mode)?.[1]}</span> <span class="ax2-chip" data-astro-cid-yjoymnrx>${r.channelIds.length ? dt("{n} channel(s)", { n: r.channelIds.length }) : dt("All channels")}</span> <span class="ax2-chip" data-astro-cid-yjoymnrx>${r.roleIds.length ? dt("{n} role(s)", { n: r.roleIds.length }) : dt("Everyone")}</span> ${r.cooldownSeconds > 0 && renderTemplate`<span class="ax2-chip"${addAttribute(dt("Cooldown"), "title")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:timer-fill", "width": "11", "height": "11", "data-astro-cid-yjoymnrx": true })}${formatDuration(r.cooldownSeconds, { locale: ax2Locale })}</span>`} ${r.caseSensitive && renderTemplate`<span class="ax2-chip"${addAttribute(dt("Case-sensitive matching"), "title")} data-astro-cid-yjoymnrx>Aa</span>`} </span> </span> <span${addAttribute(["ax2-pill", { "is-on": r.enabled }], "class:list")} data-astro-cid-yjoymnrx>${r.enabled ? dt("Enabled") : dt("Disabled")}</span> <span class="ax2-acts" data-astro-cid-yjoymnrx><span class="ax2-act" aria-hidden="true" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}<span class="ax2-t-edit" data-astro-cid-yjoymnrx>${dt("Edit")}</span><span class="ax2-t-close" data-astro-cid-yjoymnrx>${dt("Close")}</span></span><button type="submit"${addAttribute(`am-del-trigger-${r.id}`, "form")} class="ax2-del"${addAttribute(dt("Delete trigger"), "title")}${addAttribute(dt("Delete trigger"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-yjoymnrx": true })}</button></span> </summary> <form method="POST" class="ax2-edit" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="edit_reaction_trigger" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(r.id, "value")} data-astro-cid-yjoymnrx> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx> <span class="sx-label"${addAttribute(`ax2-rt-mode-${r.id}`, "id")} data-astro-cid-yjoymnrx>${dt("Match mode")}</span> <div class="dfx-chips" role="radiogroup"${addAttribute(`ax2-rt-mode-${r.id}`, "aria-labelledby")} data-astro-cid-yjoymnrx> ${ax2Modes.map(([value, label]) => renderTemplate`<label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="match_mode"${addAttribute(value, "value")}${addAttribute(mode === value, "checked")} data-astro-cid-yjoymnrx>${label}</label>`)} </div> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-rt-cool-${r.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Cooldown seconds")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": `ax2-rt-cool-${r.id}`, "name": "cooldown_seconds", "value": r.cooldownSeconds, "min": "0", "max": "86400", "data-astro-cid-yjoymnrx": true })}</div> </div> <div class="sx-switches" data-astro-cid-yjoymnrx> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="case_sensitive"${addAttribute(r.caseSensitive, "checked")} data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Case-sensitive matching")}</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="enabled"${addAttribute(r.enabled, "checked")} data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Enabled")}</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> </div> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Only in these channels")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "trigger_channel_ids", "options": channelOptions, "source": "am-channels", "selected": r.channelIds, "placeholder": dt("All channels"), "data-astro-cid-yjoymnrx": true })}</div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Only for members with these roles")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "trigger_role_ids", "options": roleOptions, "source": "am-roles", "selected": r.roleIds, "placeholder": dt("Everyone"), "data-astro-cid-yjoymnrx": true })}</div> </div> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save trigger")}</button></div> </form> <form method="POST"${addAttribute(`am-del-trigger-${r.id}`, "id")} data-no-dirty hidden data-astro-cid-yjoymnrx><input type="hidden" name="action" value="delete_reaction_trigger" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(r.id, "value")} data-astro-cid-yjoymnrx></form> </details>`;
  })} </div> <form method="POST" class="ax2-add" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_reaction_trigger" data-astro-cid-yjoymnrx> <div class="ax2-add-title" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true })}${dt("Add a trigger")}</div> <div class="sx-grid ax2-grid-emoji" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Emoji")}</span><input type="text" name="emoji" data-emoji-input${addAttribute(dt("Emoji"), "placeholder")} maxlength="100" required data-astro-cid-yjoymnrx></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-rt-phrase" data-astro-cid-yjoymnrx>${dt("Word or phrase")}</label><input id="ax2-rt-phrase" type="text" name="trigger" maxlength="80" required data-count data-astro-cid-yjoymnrx></div> </div> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx> <span class="sx-label" id="ax2-rt-new-mode" data-astro-cid-yjoymnrx>${dt("Match mode")}</span> <div class="dfx-chips" role="radiogroup" aria-labelledby="ax2-rt-new-mode" data-astro-cid-yjoymnrx> ${ax2Modes.map(([value, label], i) => renderTemplate`<label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="match_mode"${addAttribute(value, "value")}${addAttribute(i === 0, "checked")} data-astro-cid-yjoymnrx>${label}</label>`)} </div> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-rt-new-cool" data-astro-cid-yjoymnrx>${dt("Cooldown seconds")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "ax2-rt-new-cool", "name": "cooldown_seconds", "value": "0", "min": "0", "max": "86400", "data-astro-cid-yjoymnrx": true })}</div> <label class="sx-switch sx-wide" data-astro-cid-yjoymnrx><input type="checkbox" name="case_sensitive" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Case-sensitive matching")}</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Only in these channels")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "trigger_channel_ids", "options": channelOptions, "source": "am-channels", "selected": [], "placeholder": dt("All channels"), "data-astro-cid-yjoymnrx": true })}</div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Only for members with these roles")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "trigger_role_ids", "options": roleOptions, "source": "am-roles", "selected": [], "placeholder": dt("Everyone"), "data-astro-cid-yjoymnrx": true })}</div> </div> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Add trigger")}</button></div> </form> </div>`, selectedSection === "reaction-messages" && renderTemplate`<div class="ax2-page" data-section="reaction-messages" data-astro-cid-yjoymnrx> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Channels"), value: reactionMessages.length, tone: "reactions" },
    { label: dt("Emojis"), value: reactionMessages.reduce((sum, r) => sum + r.emojis.length, 0), tone: "invites" },
    { label: dt("Announcement channels"), value: reactionMessages.filter((r) => newsChannelIds.has(r.channelId)).length, tone: "voice" }
  ], "data-astro-cid-yjoymnrx": true })} <div class="ax2-head" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>${dt("Channels")} <span class="ax2-count" data-astro-cid-yjoymnrx>${reactionMessages.length}</span></h2> <p data-astro-cid-yjoymnrx>${dt("Add up to five emojis to every new message in a channel, announcement channels included (posts from followed channels and webhooks get them too). Save the channel with no emojis to disable it.")}</p> </div> ${reactionMessages.length === 0 && renderTemplate`<p class="ax2-empty" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chat-circle-dots-fill", "width": "18", "height": "18", "data-astro-cid-yjoymnrx": true })}${dt("Nothing here yet. Add the first one below.")}</p>`} <div class="ax2-list ax2-duo dgl-stagger" data-astro-cid-yjoymnrx> ${reactionMessages.map((r) => renderTemplate`<details class="ax2-item" style="--c:var(--accent)" data-astro-cid-yjoymnrx> <summary class="ax2-sum" data-astro-cid-yjoymnrx> <span class="ax2-ico" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": newsChannelIds.has(r.channelId) ? "ph:megaphone-fill" : "ph:hash-bold", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true })}</span> <span class="ax2-main" data-astro-cid-yjoymnrx> <b class="ax2-title" data-astro-cid-yjoymnrx>${channelName(r.channelId)}</b> <span class="ax2-emojis" data-astro-cid-yjoymnrx>${r.emojis.map((e) => {
    const em = ax2Emoji(e);
    return em.src ? renderTemplate`<img${addAttribute(em.src, "src")}${addAttribute(em.text, "alt")} width="20" height="20" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-yjoymnrx>` : renderTemplate`<span data-astro-cid-yjoymnrx>${em.text}</span>`;
  })}</span> </span> <span class="ax2-pill"${addAttribute(dt("Emojis"), "title")} data-astro-cid-yjoymnrx>${r.emojis.length}/5</span> <span class="ax2-acts" data-astro-cid-yjoymnrx><span class="ax2-act" aria-hidden="true" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}<span class="ax2-t-edit" data-astro-cid-yjoymnrx>${dt("Edit")}</span><span class="ax2-t-close" data-astro-cid-yjoymnrx>${dt("Close")}</span></span><button type="submit"${addAttribute(`am-del-react-${r.id}`, "form")} class="ax2-del"${addAttribute(dt("Remove channel"), "title")}${addAttribute(dt("Remove channel"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-yjoymnrx": true })}</button></span> </summary> <form method="POST" class="ax2-edit" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="save_reaction_messages" data-astro-cid-yjoymnrx><input type="hidden" name="channel_id"${addAttribute(r.channelId, "value")} data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Emojis")}</span><div class="ax2-slots" data-astro-cid-yjoymnrx>${[0, 1, 2, 3, 4].map((n) => renderTemplate`<input type="text" name="emojis" data-emoji-input${addAttribute(n === 0 ? dt("Emoji 1") : dt("Emoji {a} (optional)", { a: n + 1 }), "placeholder")} maxlength="100"${addAttribute(r.emojis[n] ?? "", "value")}${addAttribute(n === 0, "required")} data-astro-cid-yjoymnrx>`)}</div></div> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save channel")}</button></div> </form> <form method="POST"${addAttribute(`am-del-react-${r.id}`, "id")} data-no-dirty hidden data-astro-cid-yjoymnrx><input type="hidden" name="action" value="delete_reaction_messages" data-astro-cid-yjoymnrx><input type="hidden" name="channel_id"${addAttribute(r.channelId, "value")} data-astro-cid-yjoymnrx></form> </details>`)} </div> <form method="POST" class="ax2-add" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="save_reaction_messages" data-astro-cid-yjoymnrx> <div class="ax2-add-title" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true })}${dt("Add a channel")}</div> <div class="sx-field ax2-field-channel" data-astro-cid-yjoymnrx><label for="ax2-rm-channel" data-astro-cid-yjoymnrx>${dt("Channel")}</label><select id="ax2-rm-channel" name="channel_id" required data-astro-cid-yjoymnrx><option value="" disabled selected data-astro-cid-yjoymnrx>${dt("Channel")}</option>${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-yjoymnrx>#${c.name}${c.type === 5 ? " \xB7 " + dt("Announcement channel") : ""}</option>`)}</select></div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Emojis")}</span><div class="ax2-slots" data-astro-cid-yjoymnrx>${[0, 1, 2, 3, 4].map((n) => renderTemplate`<input type="text" name="emojis" data-emoji-input${addAttribute(n === 0 ? dt("Emoji 1") : dt("Emoji {a} (optional)", { a: n + 1 }), "placeholder")} maxlength="100"${addAttribute(n === 0, "required")} data-astro-cid-yjoymnrx>`)}</div></div> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save channel")}</button></div> </form> </div>`, selectedSection === "timers" && renderTemplate(_b || (_b = __template(['<div class="ax2-page" data-section="timers" data-astro-cid-yjoymnrx> ', ' <div class="ax2-head" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>', ' <span class="ax2-count" data-astro-cid-yjoymnrx>', "</span></h2> <p data-astro-cid-yjoymnrx>", "</p> </div> ", ' <div class="ax2-list ax2-duo dgl-stagger" data-astro-cid-yjoymnrx> ', ' </div> <form method="POST" class="ax2-add ax2-tm" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_timer" data-astro-cid-yjoymnrx> <div class="ax2-add-title" data-astro-cid-yjoymnrx>', "", '</div> <div class="sx-field ax2-field-channel" data-astro-cid-yjoymnrx><label for="ax2-tm-new-channel" data-astro-cid-yjoymnrx>', '</label><select id="ax2-tm-new-channel" name="channel_id" required data-astro-cid-yjoymnrx><option value="" disabled selected data-astro-cid-yjoymnrx>', "</option>", '</select></div> <div class="sx-field" data-astro-cid-yjoymnrx> <span class="sx-label" id="ax2-tm-new-repeat" data-astro-cid-yjoymnrx>', '</span> <div class="dfx-chips" role="radiogroup" aria-labelledby="ax2-tm-new-repeat" data-astro-cid-yjoymnrx> ', ' </div> </div> <div class="ax2-tm-when" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-tm-new-time" data-astro-cid-yjoymnrx>', '</label><input id="ax2-tm-new-time" type="time" name="at_time" value="18:00" data-astro-cid-yjoymnrx></div> <div class="sx-field ax2-tm-weekday" data-astro-cid-yjoymnrx><label for="ax2-tm-new-week" data-astro-cid-yjoymnrx>', '</label><select id="ax2-tm-new-week" name="weekday" data-astro-cid-yjoymnrx>', '</select></div> <div class="sx-field ax2-tm-zone" data-astro-cid-yjoymnrx><label for="ax2-tm-new-zone" data-astro-cid-yjoymnrx>', '</label><input id="ax2-tm-new-zone" type="text" name="timezone" list="am-tm-zones" value="UTC" autocomplete="off" spellcheck="false" maxlength="64"', ' data-tm-zone-default data-astro-cid-yjoymnrx></div> <span class="sx-hint ax2-tm-note" data-astro-cid-yjoymnrx>', '</span> </div> <div class="ax2-tm-int" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-tm-new-every" data-astro-cid-yjoymnrx>', "</label>", '</div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-tm-new-unit" data-astro-cid-yjoymnrx>', '</label><select id="ax2-tm-new-unit" name="interval_unit" data-astro-cid-yjoymnrx>', '</select></div> <span class="sx-hint ax2-tm-note" data-astro-cid-yjoymnrx>', '</span> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax2-tm-new-msg" data-astro-cid-yjoymnrx>', '</label><textarea id="ax2-tm-new-msg" class="dgl-autogrow" rows="2" name="message" data-ac data-count', ' maxlength="2000"', " data-astro-cid-yjoymnrx></textarea>", "</div> ", ' <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="delete_previous" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', '</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>', "", '</button></div> </form> <datalist id="am-tm-zones" data-astro-cid-yjoymnrx>', "</datalist> <script>(function(){", "\n      // Timers: the zone of a new timer starts as the browser's, and the next runs show in the viewer's own time. Runs on every visit\n      // of the page (it only fills fields of this page); the window flag keeps the function from being defined again.\n      if (!window.__amTimerZone) {\n        window.__amTimerZone = function (nextLabel) {\n          var zone = '';\n          try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}\n          document.querySelectorAll('#dgl-content input[data-tm-zone-default]').forEach(function (el) {\n            if (zone && el.value === 'UTC' && !el.hasAttribute('data-tm-zone-set')) el.value = zone;\n            el.setAttribute('data-tm-zone-set', '');\n          });\n          document.querySelectorAll('#dgl-content time[data-tm-next]').forEach(function (el) {\n            var at = Date.parse(el.getAttribute('datetime') || '');\n            if (!isFinite(at)) return;\n            try { el.textContent = nextLabel.replace('{a}', new Date(at).toLocaleString(document.documentElement.lang || undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })); } catch (e) {}\n          });\n        };\n      }\n      window.__amTimerZone(tmNext);\n    })();<\/script> </div>"])), renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Timers"), value: timers.length, tone: "voice" },
    { label: dt("Running"), value: timers.filter((t) => !t.paused).length, tone: "joins" },
    { label: dt("Paused"), value: timers.filter((t) => t.paused).length, tone: "leaves" },
    { label: dt("Next run"), value: 0, text: ax2NextTimer ? ax2In(ax2NextTimer) : "\u2014", tone: "reactions" }
  ], "data-astro-cid-yjoymnrx": true }), dt("Repeating timers"), timers.length, dt("Run multiple recurring messages with independent channels and intervals."), timers.length === 0 && renderTemplate`<p class="ax2-empty" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:timer-fill", "width": "18", "height": "18", "data-astro-cid-yjoymnrx": true })}${dt("Nothing here yet. Add the first one below.")}</p>`, timers.map((t) => renderTemplate`<details class="ax2-item"${addAttribute(`--c:${t.paused ? "#8b8d96" : "#5eead4"}`, "style")} data-astro-cid-yjoymnrx> <summary class="ax2-sum ax2-sum-wrap" data-astro-cid-yjoymnrx> <span class="ax2-ico" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:timer-fill", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true })}</span> <span class="ax2-main" data-astro-cid-yjoymnrx> <span class="ax2-line" data-astro-cid-yjoymnrx><b class="ax2-title" data-astro-cid-yjoymnrx>#${channelName(t.channelId)}</b><span class="ax2-chip"${addAttribute(dt("Timer number (the one the commands use)"), "title")} data-astro-cid-yjoymnrx>${dt("Timer {a}", { a: t.number ?? t.id })}</span>${t.paused && renderTemplate`<span class="ax2-pill" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pause-fill", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}${dt("Paused")}</span>`}</span> </span> <span class="ax2-acts" data-astro-cid-yjoymnrx><button type="submit"${addAttribute(`am-run-timer-${t.id}`, "form")} class="ax2-act ax2-act-btn"${addAttribute(dt("Send now (the schedule does not change)"), "title")}${addAttribute(dt("Send now"), "aria-label")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}<span data-astro-cid-yjoymnrx>${dt("Send now")}</span></button><span class="ax2-act" aria-hidden="true" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}<span class="ax2-t-edit" data-astro-cid-yjoymnrx>${dt("Edit")}</span><span class="ax2-t-close" data-astro-cid-yjoymnrx>${dt("Close")}</span></span><button type="submit"${addAttribute(`am-del-timer-${t.id}`, "form")} class="ax2-del"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-yjoymnrx": true })}</button></span> <span class="ax2-chips ax2-chips-row" data-astro-cid-yjoymnrx> <span class="ax2-chip ax2-chip-when" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrows-clockwise-bold", "width": "11", "height": "11", "data-astro-cid-yjoymnrx": true })}${timerWhen(t)}</span> ${t.nextRunAt && !t.paused && renderTemplate`<span class="ax2-chip"${addAttribute(dt("Next run"), "title")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-fill", "width": "11", "height": "11", "data-astro-cid-yjoymnrx": true })}<time${addAttribute(t.nextRunAt, "datetime")} data-tm-next data-astro-cid-yjoymnrx>${dt("Next: {a}", { a: timerNextText(t.nextRunAt) })}</time><span class="ax2-in" data-astro-cid-yjoymnrx>· ${ax2In(t.nextRunAt)}</span></span>`} ${t.deletePrevious && renderTemplate`<span class="ax2-chip" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "11", "height": "11", "data-astro-cid-yjoymnrx": true })}${dt("Deletes the message of the time before")}</span>`} </span> <span class="am-chat ax2-bubble" data-astro-cid-yjoymnrx><span class="am-msg" data-astro-cid-yjoymnrx><img class="am-av" src="/assets/mascot-icon.webp" alt="" width="22" height="22" loading="lazy" decoding="async" data-astro-cid-yjoymnrx><span class="am-msg-body" data-cp${addAttribute(t.message, "data-cp-text")}${addAttribute(t.embedTemplate ?? "", "data-cp-template")} data-astro-cid-yjoymnrx><span class="am-msg-name am-msg-bot" data-astro-cid-yjoymnrx>Petto<span class="am-msg-tag" data-astro-cid-yjoymnrx>${dt("APP")}</span></span>${t.embedTemplate && renderTemplate`<span class="am-msg-embed" style="--ec:var(--border)" data-astro-cid-yjoymnrx><span class="am-msg-embed-title" data-astro-cid-yjoymnrx>${t.embedTemplate}</span></span>`}${t.message ? renderTemplate`<span class="am-msg-text am-msg-clamp"${addAttribute(t.message, "title")} data-astro-cid-yjoymnrx>${t.message}</span>` : !t.embedTemplate && renderTemplate`<span class="am-msg-text am-msg-none" data-astro-cid-yjoymnrx>${dt("No reply text")}</span>`}</span></span></span> ${t.lastError && renderTemplate`<span class="ax2-issue"${addAttribute(t.lastError, "title")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Last send failed: {a}", { a: t.lastError })}</span>`} </summary> <form method="POST" class="ax2-edit ax2-tm" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="edit_timer" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(t.id, "value")} data-astro-cid-yjoymnrx><input type="hidden" name="old_channel_id"${addAttribute(t.channelId, "value")} data-astro-cid-yjoymnrx><input type="hidden" name="old_schedule"${addAttribute(t.schedule ?? "interval", "value")} data-astro-cid-yjoymnrx><input type="hidden" name="paused_field" value="1" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-tm-channel-${t.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Channel")}</label><select${addAttribute(`ax2-tm-channel-${t.id}`, "id")} name="channel_id" required data-astro-cid-yjoymnrx>${!channels.some((c) => c.id === t.channelId) && renderTemplate`<option${addAttribute(t.channelId, "value")} selected data-astro-cid-yjoymnrx>#${channelName(t.channelId)}</option>`}${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === t.channelId, "selected")} data-astro-cid-yjoymnrx>#${c.name}</option>`)}</select></div> <div class="sx-field" data-astro-cid-yjoymnrx> <span class="sx-label"${addAttribute(`ax2-tm-repeat-${t.id}`, "id")} data-astro-cid-yjoymnrx>${dt("Repeat")}</span> <div class="dfx-chips" role="radiogroup"${addAttribute(`ax2-tm-repeat-${t.id}`, "aria-labelledby")} data-astro-cid-yjoymnrx> ${ax2Repeats.map(([value, label]) => renderTemplate`<label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="schedule"${addAttribute(value, "value")}${addAttribute((t.schedule ?? "interval") === value, "checked")} data-astro-cid-yjoymnrx>${label}</label>`)} </div> </div> <div class="ax2-tm-when" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-tm-time-${t.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Time")}</label><input${addAttribute(`ax2-tm-time-${t.id}`, "id")} type="time" name="at_time"${addAttribute(t.atTime ?? "", "value")} data-astro-cid-yjoymnrx></div> <div class="sx-field ax2-tm-weekday" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-tm-week-${t.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Day of the week")}</label><select${addAttribute(`ax2-tm-week-${t.id}`, "id")} name="weekday" data-astro-cid-yjoymnrx>${timerWeekdays.map((d) => renderTemplate`<option${addAttribute(d.day, "value")}${addAttribute(d.day === Number(t.weekday ?? 1), "selected")} data-astro-cid-yjoymnrx>${d.name}</option>`)}</select></div> <div class="sx-field ax2-tm-zone" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-tm-zone-${t.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Time zone")}</label><input${addAttribute(`ax2-tm-zone-${t.id}`, "id")} type="text" name="timezone" list="am-tm-zones"${addAttribute(t.timezone ?? "UTC", "value")} autocomplete="off" spellcheck="false" maxlength="64"${addAttribute(dt("Search a time zone (e.g. America/Bogota)"), "placeholder")} data-astro-cid-yjoymnrx></div> </div> <div class="ax2-tm-int" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-tm-every-${t.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Repeat every")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": `ax2-tm-every-${t.id}`, "name": "interval_value", "value": splitInterval(t.intervalMs).value, "min": "1", "step": "any", "inputmode": "decimal", "required": true, "data-astro-cid-yjoymnrx": true })}</div> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-tm-unit-${t.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Unit")}</label><select${addAttribute(`ax2-tm-unit-${t.id}`, "id")} name="interval_unit" data-astro-cid-yjoymnrx>${TIMER_UNITS.map((u) => renderTemplate`<option${addAttribute(u.id, "value")}${addAttribute(u.id === splitInterval(t.intervalMs).unit, "selected")} data-astro-cid-yjoymnrx>${timerUnitLabel[u.id]}</option>`)}</select></div> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-tm-msg-${t.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Message")}</label><textarea${addAttribute(`ax2-tm-msg-${t.id}`, "id")} class="dgl-autogrow" rows="2" name="message" data-ac data-count maxlength="2000"${addAttribute(!embedTemplateNames.length, "required")} data-astro-cid-yjoymnrx>${t.message}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-yjoymnrx": true })}</div> ${embedTemplateNames.length > 0 && renderTemplate`<div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax2-tm-embed-${t.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Saved embed")}</label><select${addAttribute(`ax2-tm-embed-${t.id}`, "id")} name="embed_template" data-tpl-locks="message" data-astro-cid-yjoymnrx><option value="" data-astro-cid-yjoymnrx>${dt("No saved embed")}</option>${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === t.embedTemplate, "selected")} data-astro-cid-yjoymnrx>${name}</option>`)}</select><span class="sx-hint" data-astro-cid-yjoymnrx>${dt("With a saved embed, the message is optional and goes above it.")}</span></div>`} <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="delete_previous"${addAttribute(t.deletePrevious, "checked")} data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Delete the message of the time before (the bot needs Manage Messages)")}</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="paused"${addAttribute(t.paused, "checked")} data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Paused (sends nothing until it is turned off)")}</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <div class="ax2-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save timer")}</button></div> </form> <form method="POST"${addAttribute(`am-del-timer-${t.id}`, "id")} data-no-dirty hidden data-astro-cid-yjoymnrx><input type="hidden" name="action" value="delete_timer" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(t.id, "value")} data-astro-cid-yjoymnrx></form> <form method="POST"${addAttribute(`am-run-timer-${t.id}`, "id")} data-no-dirty data-bot-wait hidden data-astro-cid-yjoymnrx><input type="hidden" name="action" value="run_timer" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(t.id, "value")} data-astro-cid-yjoymnrx></form> </details>`), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true }), dt("Add a timer"), dt("Channel"), dt("Channel"), channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-yjoymnrx>#${c.name}</option>`), dt("Repeat"), ax2Repeats.map(([value, label], i) => renderTemplate`<label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="schedule"${addAttribute(value, "value")}${addAttribute(i === 0, "checked")} data-astro-cid-yjoymnrx>${label}</label>`), dt("Time"), dt("Day of the week"), timerWeekdays.map((d) => renderTemplate`<option${addAttribute(d.day, "value")}${addAttribute(d.day === 1, "selected")} data-astro-cid-yjoymnrx>${d.name}</option>`), dt("Time zone"), addAttribute(dt("Search a time zone (e.g. America/Bogota)"), "placeholder"), dt("Daily and weekly timers post at a time of day in the time zone you choose, and keep that time when the clocks change."), dt("Repeat every"), renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "ax2-tm-new-every", "name": "interval_value", "value": "10", "min": "1", "step": "any", "inputmode": "decimal", "required": true, "data-astro-cid-yjoymnrx": true }), dt("Unit"), TIMER_UNITS.map((u) => renderTemplate`<option${addAttribute(u.id, "value")}${addAttribute(u.id === "minutes", "selected")} data-astro-cid-yjoymnrx>${timerUnitLabel[u.id]}</option>`), dt("Minimum interval: 10 minutes (600 seconds), up to 10 years. One timer per channel."), dt("Message"), addAttribute(dt("Message to send repeatedly"), "placeholder"), addAttribute(!embedTemplateNames.length, "required"), renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-yjoymnrx": true }), embedTemplateNames.length > 0 && renderTemplate`<div class="sx-field ax2-field-channel" data-astro-cid-yjoymnrx><label for="ax2-tm-new-embed" data-astro-cid-yjoymnrx>${dt("Saved embed")}</label><select id="ax2-tm-new-embed" name="embed_template" data-tpl-locks="message" data-astro-cid-yjoymnrx><option value="" data-astro-cid-yjoymnrx>${dt("No saved embed")}</option>${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")} data-astro-cid-yjoymnrx>${name}</option>`)}</select><span class="sx-hint" data-astro-cid-yjoymnrx>${dt("With a saved embed, the message is optional and goes above it.")}</span></div>`, dt("Delete the message of the time before (the bot needs Manage Messages)"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true }), dt("Add timer"), timerZones.map((zone) => renderTemplate`<option${addAttribute(zone, "value")} data-astro-cid-yjoymnrx></option>`), defineScriptVars({ tmNext: dt("Next: {a}") })), selectedSection === "starboard" && renderTemplate`<div${addAttribute(["am-section", showSection("starboard")], "class:list")} data-section="starboard" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx><span class="am-h2-icon" style="--c:var(--accent)" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:star-fill", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}</span>${dt("Starboard")}</h2> <form method="POST" class="am-add am-add-wide" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="save_starboard" data-astro-cid-yjoymnrx> <div class="am-add-row" data-astro-cid-yjoymnrx><label class="am-field" data-astro-cid-yjoymnrx><span data-astro-cid-yjoymnrx>${dt("Channel")}</span><select name="channel_id" data-astro-cid-yjoymnrx><option value="" data-astro-cid-yjoymnrx>${dt("Disabled / no channel")}</option>${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === starboard?.channel_id, "selected")} data-astro-cid-yjoymnrx>#${c.name}</option>`)}</select></label><label class="am-field am-field-narrow" data-astro-cid-yjoymnrx><span data-astro-cid-yjoymnrx>${dt("Reactions needed")}</span><input type="number" name="threshold" min="1" max="100"${addAttribute(starboard?.threshold ?? 3, "value")} required data-astro-cid-yjoymnrx></label><label class="am-field am-field-narrow" data-astro-cid-yjoymnrx><span data-astro-cid-yjoymnrx>${dt("Emoji")}</span><input type="text" name="emoji" data-emoji-input maxlength="100"${addAttribute(starboard?.emoji ?? "\u2B50", "value")}${addAttribute(dt("Emoji"), "placeholder")} required data-astro-cid-yjoymnrx></label></div> ${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "color", "value": `#${(starboard?.color ?? 16761095).toString(16).padStart(6, "0")}`, "label": dt("Color of the repost"), "data-astro-cid-yjoymnrx": true })} <label class="am-check" data-astro-cid-yjoymnrx><input type="checkbox" name="selfstar"${addAttribute(starboard?.selfstar ?? false, "checked")} data-astro-cid-yjoymnrx>${dt("Count the message author's own reaction")}</label> <label class="am-check" data-astro-cid-yjoymnrx><input type="checkbox" name="timestamp"${addAttribute(starboard?.timestamp ?? true, "checked")} data-astro-cid-yjoymnrx>${dt("Show the original timestamp")}</label> <label class="am-check" data-astro-cid-yjoymnrx><input type="checkbox" name="jumpurl"${addAttribute(starboard?.jumpurl ?? true, "checked")} data-astro-cid-yjoymnrx>${dt("Add an Original Message button")}</label> <label class="am-check" data-astro-cid-yjoymnrx><input type="checkbox" name="attachments"${addAttribute(starboard?.attachments ?? true, "checked")} data-astro-cid-yjoymnrx>${dt("Include attachments and images")}</label> <div class="am-channel-scope" data-astro-cid-yjoymnrx><span class="am-channel-scope-label" data-astro-cid-yjoymnrx>${dt("Repost design")}</span> <select name="embed_template" data-dp-template-only data-astro-cid-yjoymnrx> <option value=""${addAttribute(!starboard?.embed_template, "selected")} data-astro-cid-yjoymnrx>${dt("Use Petto default")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === starboard?.embed_template, "selected")} data-astro-cid-yjoymnrx>${name}</option>`)} </select> <div class="am-board-mock" data-mock-for="embed_template"${addAttribute(Boolean(starboard?.embed_template), "hidden")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "DashBoardMock", $$DashBoardMock, { "emoji": starboard?.emoji ?? "\u2B50", "color": "#" + Number(starboard?.color ?? 16761095).toString(16).padStart(6, "0"), "count": 3, "data-astro-cid-yjoymnrx": true })}</div> ${starboard && "embed_template" in starboard && renderTemplate`<input type="hidden" name="design_ready" value="1" data-astro-cid-yjoymnrx>`} <span class="am-hint" data-astro-cid-yjoymnrx>${dt("A saved design from the Embeds page. It can use {star.count}, {star.link}, {star.content}, {star.image} and the other star variables.")}</span> </div> <div class="am-channel-scope" data-astro-cid-yjoymnrx><span class="am-channel-scope-label" data-astro-cid-yjoymnrx>${dt("Ignored channels")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "ignored_channel_ids", "options": channelOptions, "source": "am-channels", "selected": starboard?.ignoredChannelIds ?? [], "placeholder": dt("Search channels..."), "data-astro-cid-yjoymnrx": true })}</div> <div class="am-channel-scope" data-astro-cid-yjoymnrx><span class="am-channel-scope-label" data-astro-cid-yjoymnrx>${dt("Ignored roles")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "ignored_role_ids", "options": roleOptions, "source": "am-roles", "selected": starboard?.ignoredRoleIds ?? [], "placeholder": dt("Search roles..."), "data-astro-cid-yjoymnrx": true })}</div> <input type="text" name="ignored_user_ids"${addAttribute((starboard?.ignoredUserIds ?? []).join(", "), "value")}${addAttribute(dt("Ignored member IDs, comma-separated"), "placeholder")} maxlength="260" data-astro-cid-yjoymnrx> <div class="am-feature-actions" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save starboard")}</button><button type="submit" name="action" value="disable_starboard" class="am-del-text" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Disable")}</button></div> </form> <p class="am-hint" data-astro-cid-yjoymnrx>${dt("The bot reposts messages after the selected emoji reaches the threshold and updates the count when reactions change.")}</p> </div>`, selectedSection === "monkeyboard" && renderTemplate`<div${addAttribute(["am-section", showSection("monkeyboard")], "class:list")} data-section="monkeyboard" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx><span class="am-h2-icon" style="--c:var(--accent)" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:smiley-fill", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}</span>${dt("Monkeyboard")}</h2> <form method="POST" class="am-add am-add-wide" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="save_monkeyboard" data-astro-cid-yjoymnrx> <div class="am-add-row" data-astro-cid-yjoymnrx><label class="am-field" data-astro-cid-yjoymnrx><span data-astro-cid-yjoymnrx>${dt("Channel")}</span><select name="channel_id" data-astro-cid-yjoymnrx><option value="" data-astro-cid-yjoymnrx>${dt("Disabled / no channel")}</option>${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === monkeyboard?.channel_id, "selected")} data-astro-cid-yjoymnrx>#${c.name}</option>`)}</select></label><label class="am-field am-field-narrow" data-astro-cid-yjoymnrx><span data-astro-cid-yjoymnrx>${dt("Reactions needed")}</span><input type="number" name="threshold" min="1" max="100"${addAttribute(monkeyboard?.threshold ?? 3, "value")} required data-astro-cid-yjoymnrx></label><label class="am-field am-field-narrow" data-astro-cid-yjoymnrx><span data-astro-cid-yjoymnrx>${dt("Emoji")}</span><input type="text" name="emoji" data-emoji-input maxlength="100"${addAttribute(monkeyboard?.emoji ?? "\u{1F412}", "value")}${addAttribute(dt("Emoji"), "placeholder")} required data-astro-cid-yjoymnrx></label></div> ${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "color", "value": `#${(monkeyboard?.color ?? 9132587).toString(16).padStart(6, "0")}`, "label": dt("Color of the repost"), "data-astro-cid-yjoymnrx": true })} <label class="am-check" data-astro-cid-yjoymnrx><input type="checkbox" name="selfstar"${addAttribute(monkeyboard?.selfstar ?? false, "checked")} data-astro-cid-yjoymnrx>${dt("Count the message author's own reaction")}</label> <label class="am-check" data-astro-cid-yjoymnrx><input type="checkbox" name="timestamp"${addAttribute(monkeyboard?.timestamp ?? true, "checked")} data-astro-cid-yjoymnrx>${dt("Show the original timestamp")}</label> <label class="am-check" data-astro-cid-yjoymnrx><input type="checkbox" name="jumpurl"${addAttribute(monkeyboard?.jumpurl ?? true, "checked")} data-astro-cid-yjoymnrx>${dt("Add an Original Message button")}</label> <label class="am-check" data-astro-cid-yjoymnrx><input type="checkbox" name="attachments"${addAttribute(monkeyboard?.attachments ?? true, "checked")} data-astro-cid-yjoymnrx>${dt("Include attachments and images")}</label> <div class="am-channel-scope" data-astro-cid-yjoymnrx><span class="am-channel-scope-label" data-astro-cid-yjoymnrx>${dt("Repost design")}</span> <select name="embed_template" data-dp-template-only data-astro-cid-yjoymnrx> <option value=""${addAttribute(!monkeyboard?.embed_template, "selected")} data-astro-cid-yjoymnrx>${dt("Use Petto default")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === monkeyboard?.embed_template, "selected")} data-astro-cid-yjoymnrx>${name}</option>`)} </select> <div class="am-board-mock" data-mock-for="embed_template"${addAttribute(Boolean(monkeyboard?.embed_template), "hidden")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "DashBoardMock", $$DashBoardMock, { "emoji": monkeyboard?.emoji ?? "\u{1F412}", "color": "#" + Number(monkeyboard?.color ?? 16761095).toString(16).padStart(6, "0"), "count": 3, "data-astro-cid-yjoymnrx": true })}</div> ${monkeyboard && "embed_template" in monkeyboard && renderTemplate`<input type="hidden" name="design_ready" value="1" data-astro-cid-yjoymnrx>`} <span class="am-hint" data-astro-cid-yjoymnrx>${dt("A saved design from the Embeds page. It can use {monkey.count}, {monkey.link}, {monkey.content}, {monkey.image} and the other monkey variables.")}</span> </div> <div class="am-channel-scope" data-astro-cid-yjoymnrx><span class="am-channel-scope-label" data-astro-cid-yjoymnrx>${dt("Ignored channels")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "ignored_channel_ids", "options": channelOptions, "source": "am-channels", "selected": monkeyboard?.ignoredChannelIds ?? [], "placeholder": dt("Search channels..."), "data-astro-cid-yjoymnrx": true })}</div> <div class="am-channel-scope" data-astro-cid-yjoymnrx><span class="am-channel-scope-label" data-astro-cid-yjoymnrx>${dt("Ignored roles")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "ignored_role_ids", "options": roleOptions, "source": "am-roles", "selected": monkeyboard?.ignoredRoleIds ?? [], "placeholder": dt("Search roles..."), "data-astro-cid-yjoymnrx": true })}</div> <input type="text" name="ignored_user_ids"${addAttribute((monkeyboard?.ignoredUserIds ?? []).join(", "), "value")}${addAttribute(dt("Ignored member IDs, comma-separated"), "placeholder")} maxlength="260" data-astro-cid-yjoymnrx> <div class="am-feature-actions" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save monkeyboard")}</button><button type="submit" name="action" value="disable_monkeyboard" class="am-del-text" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Disable")}</button></div> </form> <p class="am-hint" data-astro-cid-yjoymnrx>${dt("The bot reposts messages after the selected emoji reaches the threshold and updates the count when reactions change.")}</p> </div>`, selectedSection === "voicemaster" && renderTemplate(_c || (_c = __template(['<div class="vmx-page" data-section="voicemaster" data-astro-cid-yjoymnrx> ', ' <form method="POST" class="vmx-form" data-vm data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="save_voicemaster" data-astro-cid-yjoymnrx> <div class="sx-duo vmx-duo vmx-main" data-astro-cid-yjoymnrx> <div class="sx-stack" data-astro-cid-yjoymnrx> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="vm-creator" data-astro-cid-yjoymnrx>', '</label> <select id="vm-creator" name="creator_channel_id" required data-astro-cid-yjoymnrx><option value="" disabled selected data-astro-cid-yjoymnrx>', "</option>", '</select> <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="vm-panel" data-astro-cid-yjoymnrx>', '</label> <select id="vm-panel" name="panel_channel_id" required data-astro-cid-yjoymnrx><option value="" disabled selected data-astro-cid-yjoymnrx>', "</option>", '</select> <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="vm-category" data-astro-cid-yjoymnrx>', '</label> <select id="vm-category" name="category_id" data-astro-cid-yjoymnrx><option value="" data-astro-cid-yjoymnrx>', "</option>", '</select> <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> </div> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="vm-limit" data-astro-cid-yjoymnrx>', "</label> ", ' <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> <div class="sx-field" data-astro-cid-yjoymnrx> <label for="vmName" data-astro-cid-yjoymnrx>', '</label> <textarea id="vmName" name="default_name" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="100" placeholder="{user.name}" data-vm-name data-astro-cid-yjoymnrx>', '</textarea> <div class="vm-chips" data-astro-cid-yjoymnrx><span class="sx-hint" data-astro-cid-yjoymnrx>', "</span>", '</div> <div class="vm-preview" data-astro-cid-yjoymnrx>', "<span data-vm-sample data-astro-cid-yjoymnrx>", "</span><em data-astro-cid-yjoymnrx>", '</em></div> </div> </div> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="sync_category_permissions"', ' data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', "</span> ", ' <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', '</span> <div class="sx-choices" data-astro-cid-yjoymnrx> ', ' </div> </div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', '</span> <div class="sx-chips" data-astro-cid-yjoymnrx> ', ' </div> <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> </div> </div> <div class="sx-stack vmx-side" data-astro-cid-yjoymnrx> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <ol class="vmx-steps" data-astro-cid-yjoymnrx> <li data-astro-cid-yjoymnrx><span class="vmx-step-n" data-astro-cid-yjoymnrx>1</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span></li> <li data-astro-cid-yjoymnrx><span class="vmx-step-n" data-astro-cid-yjoymnrx>2</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span></li> <li data-astro-cid-yjoymnrx><span class="vmx-step-n" data-astro-cid-yjoymnrx>3</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span></li> </ol> </div> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <div class="vmx-facts" data-astro-cid-yjoymnrx> <div class="sx-row" data-astro-cid-yjoymnrx><span class="vmx-k" data-astro-cid-yjoymnrx>', "</span><b data-astro-cid-yjoymnrx>", '</b></div> <div class="sx-row" data-astro-cid-yjoymnrx><span class="vmx-k" data-astro-cid-yjoymnrx>', "</span><b data-astro-cid-yjoymnrx>", '</b></div> <div class="sx-row" data-astro-cid-yjoymnrx><span class="vmx-k" data-astro-cid-yjoymnrx>', "</span><b data-astro-cid-yjoymnrx>", '</b></div> <div class="sx-row" data-astro-cid-yjoymnrx><span class="vmx-k" data-astro-cid-yjoymnrx>', "</span><b data-astro-cid-yjoymnrx>", '</b></div> <div class="sx-row" data-astro-cid-yjoymnrx><span class="vmx-k" data-astro-cid-yjoymnrx>', "</span><b data-astro-cid-yjoymnrx>", '</b></div> </div> </div> </div> </div> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="resend_panel" checked data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', '</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <div class="vmx-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>', "", "</button>", '</div> </form> <p class="sx-hint vmx-cmd" data-astro-cid-yjoymnrx>', "</p> <script>\n      (function () {\n        var f = document.querySelector('[data-vm]'); if (!f || f.dataset.bound) return; f.dataset.bound = '1';\n        var input = f.querySelector('[data-vm-name]'), sample = f.querySelector('[data-vm-sample]');\n        var paint = function () { sample.textContent = (input.value || '{user.name}').replace(/\\{user\\.display_name\\}|\\{user\\.name\\}|\\{user\\}/g, 'Liam').slice(0, 100); };\n        input.addEventListener('input', paint);\n        f.addEventListener('click', function (e) {\n          var b = e.target.closest('[data-vm-insert]'); if (!b) return;\n          var at = input.selectionStart == null ? input.value.length : input.selectionStart;\n          input.value = (input.value.slice(0, at) + b.getAttribute('data-vm-insert') + input.value.slice(input.selectionEnd == null ? at : input.selectionEnd)).slice(0, 100);\n          input.focus(); paint();\n        });\n      })();\n    <\/script> </div>"], ['<div class="vmx-page" data-section="voicemaster" data-astro-cid-yjoymnrx> ', ' <form method="POST" class="vmx-form" data-vm data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="save_voicemaster" data-astro-cid-yjoymnrx> <div class="sx-duo vmx-duo vmx-main" data-astro-cid-yjoymnrx> <div class="sx-stack" data-astro-cid-yjoymnrx> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="vm-creator" data-astro-cid-yjoymnrx>', '</label> <select id="vm-creator" name="creator_channel_id" required data-astro-cid-yjoymnrx><option value="" disabled selected data-astro-cid-yjoymnrx>', "</option>", '</select> <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="vm-panel" data-astro-cid-yjoymnrx>', '</label> <select id="vm-panel" name="panel_channel_id" required data-astro-cid-yjoymnrx><option value="" disabled selected data-astro-cid-yjoymnrx>', "</option>", '</select> <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="vm-category" data-astro-cid-yjoymnrx>', '</label> <select id="vm-category" name="category_id" data-astro-cid-yjoymnrx><option value="" data-astro-cid-yjoymnrx>', "</option>", '</select> <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> </div> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="vm-limit" data-astro-cid-yjoymnrx>', "</label> ", ' <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> <div class="sx-field" data-astro-cid-yjoymnrx> <label for="vmName" data-astro-cid-yjoymnrx>', '</label> <textarea id="vmName" name="default_name" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="100" placeholder="{user.name}" data-vm-name data-astro-cid-yjoymnrx>', '</textarea> <div class="vm-chips" data-astro-cid-yjoymnrx><span class="sx-hint" data-astro-cid-yjoymnrx>', "</span>", '</div> <div class="vm-preview" data-astro-cid-yjoymnrx>', "<span data-vm-sample data-astro-cid-yjoymnrx>", "</span><em data-astro-cid-yjoymnrx>", '</em></div> </div> </div> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="sync_category_permissions"', ' data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', "</span> ", ' <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', '</span> <div class="sx-choices" data-astro-cid-yjoymnrx> ', ' </div> </div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', '</span> <div class="sx-chips" data-astro-cid-yjoymnrx> ', ' </div> <span class="sx-hint" data-astro-cid-yjoymnrx>', '</span></div> </div> </div> <div class="sx-stack vmx-side" data-astro-cid-yjoymnrx> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <ol class="vmx-steps" data-astro-cid-yjoymnrx> <li data-astro-cid-yjoymnrx><span class="vmx-step-n" data-astro-cid-yjoymnrx>1</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span></li> <li data-astro-cid-yjoymnrx><span class="vmx-step-n" data-astro-cid-yjoymnrx>2</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span></li> <li data-astro-cid-yjoymnrx><span class="vmx-step-n" data-astro-cid-yjoymnrx>3</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span></li> </ol> </div> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <div class="vmx-facts" data-astro-cid-yjoymnrx> <div class="sx-row" data-astro-cid-yjoymnrx><span class="vmx-k" data-astro-cid-yjoymnrx>', "</span><b data-astro-cid-yjoymnrx>", '</b></div> <div class="sx-row" data-astro-cid-yjoymnrx><span class="vmx-k" data-astro-cid-yjoymnrx>', "</span><b data-astro-cid-yjoymnrx>", '</b></div> <div class="sx-row" data-astro-cid-yjoymnrx><span class="vmx-k" data-astro-cid-yjoymnrx>', "</span><b data-astro-cid-yjoymnrx>", '</b></div> <div class="sx-row" data-astro-cid-yjoymnrx><span class="vmx-k" data-astro-cid-yjoymnrx>', "</span><b data-astro-cid-yjoymnrx>", '</b></div> <div class="sx-row" data-astro-cid-yjoymnrx><span class="vmx-k" data-astro-cid-yjoymnrx>', "</span><b data-astro-cid-yjoymnrx>", '</b></div> </div> </div> </div> </div> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="resend_panel" checked data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', '</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <div class="vmx-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>', "", "</button>", '</div> </form> <p class="sx-hint vmx-cmd" data-astro-cid-yjoymnrx>', "</p> <script>\n      (function () {\n        var f = document.querySelector('[data-vm]'); if (!f || f.dataset.bound) return; f.dataset.bound = '1';\n        var input = f.querySelector('[data-vm-name]'), sample = f.querySelector('[data-vm-sample]');\n        var paint = function () { sample.textContent = (input.value || '{user.name}').replace(/\\\\{user\\\\.display_name\\\\}|\\\\{user\\\\.name\\\\}|\\\\{user\\\\}/g, 'Liam').slice(0, 100); };\n        input.addEventListener('input', paint);\n        f.addEventListener('click', function (e) {\n          var b = e.target.closest('[data-vm-insert]'); if (!b) return;\n          var at = input.selectionStart == null ? input.value.length : input.selectionStart;\n          input.value = (input.value.slice(0, at) + b.getAttribute('data-vm-insert') + input.value.slice(input.selectionEnd == null ? at : input.selectionEnd)).slice(0, 100);\n          input.focus(); paint();\n        });\n      })();\n    <\/script> </div>"])), renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Status"), value: 0, text: voiceMaster ? dt("Active") : dt("Not set up"), tone: voiceMaster ? "joins" : "leaves" },
    { label: dt("Creator channel"), value: 0, text: voiceMaster ? vmShort(vmName(voiceChannels, voiceMaster.creatorChannelId)) : "\u2014", tone: "voice" },
    { label: dt("Default user limit"), value: voiceMaster?.defaultLimit ?? 0, text: voiceMaster?.defaultLimit ? void 0 : dt("No limit"), tone: "messages" },
    { label: dt("Privacy of new rooms"), value: 0, text: vmPrivacy[voiceMaster?.privacyMode ?? "public"][0], tone: "invites" },
    { label: dt("Access roles"), value: voiceMaster?.accessRoleIds?.length ?? 0, text: voiceMaster?.accessRoleIds?.length ? void 0 : dt("Everyone"), tone: "reactions" }
  ], "data-astro-cid-yjoymnrx": true }), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:speaker-high-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true }), dt("Channels"), dt("Creator channel"), dt("Join-to-create voice channel"), voiceChannels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === voiceMaster?.creatorChannelId, "selected")} data-astro-cid-yjoymnrx>${c.name}</option>`), dt("Members join this channel and get their own room."), dt("Control panel channel"), dt("Panel text channel"), channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === voiceMaster?.panelChannelId, "selected")} data-astro-cid-yjoymnrx>#${c.name}</option>`), dt("Where the panel with the buttons is posted."), dt("Category"), dt("Use creator category"), channelCategories.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === voiceMaster?.categoryId, "selected")} data-astro-cid-yjoymnrx>${c.name}</option>`), dt("Where the new rooms are created."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:headphones-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true }), dt("The rooms"), dt("Default user limit"), renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "vm-limit", "name": "default_limit", "value": voiceMaster?.defaultLimit ?? 0, "min": 0, "max": 99, "data-astro-cid-yjoymnrx": true }), dt("0 means no limit."), dt("Room name template"), vmNameValue, dt("Click to add:"), ["{user.name}", "{user.display_name}"].map((v) => renderTemplate`<button type="button" class="vm-chip"${addAttribute(v, "data-vm-insert")} data-astro-cid-yjoymnrx>${v}</button>`), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:speaker-high-fill", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true }), (voiceMaster?.defaultName ?? "{user.name}").replace(/\{user\.display_name\}|\{user\.name\}|\{user\}/g, "Liam"), dt("How the first room of Liam would be named."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lock-simple-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true }), dt("Who can join and what they can do"), addAttribute(voiceMaster?.syncCategoryPermissions === true, "checked"), dt("Copy the permissions of the category"), dt("A new room starts with the same permissions as its category, so roles set there work inside the room."), dt("Access roles"), renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "access_role_ids", "options": roleOptions, "source": "am-roles", "selected": voiceMaster?.accessRoleIds ?? [], "placeholder": dt("Everyone can join"), "data-astro-cid-yjoymnrx": true }), dt("When you pick roles, only they can see and join the rooms."), dt("Privacy of new rooms"), ["public", "locked", "hidden"].map((mode) => renderTemplate`<label class="sx-choice" data-astro-cid-yjoymnrx><input type="radio" name="privacy_mode"${addAttribute(mode, "value")}${addAttribute((voiceMaster?.privacyMode ?? "public") === mode, "checked")} data-astro-cid-yjoymnrx><span class="sx-choice-body" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${vmPrivacy[mode][0]}</b><em data-astro-cid-yjoymnrx>${vmPrivacy[mode][1]}</em></span></label>`), dt("What the owner of a room can do"), [["manage_channels", "Manage the channel"], ["move_members", "Move members"], ["mute_members", "Mute members"], ["deafen_members", "Deafen members"], ["priority_speaker", "Priority speaker"], ["manage_permissions", "Manage permissions"]].map(([key, label]) => renderTemplate`<label class="sx-chip" data-astro-cid-yjoymnrx><input type="checkbox" name="owner_permissions"${addAttribute(key, "value")}${addAttribute((voiceMaster?.ownerPermissions ?? ["manage_channels", "move_members"]).includes(key), "checked")} data-astro-cid-yjoymnrx><span data-astro-cid-yjoymnrx>${dt(label)}</span></label>`), dt("Joining and seeing their own room is always allowed."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true }), dt("How it works"), dt("A member joins the creator channel"), voiceMaster ? "\u{1F50A} " + vmName(voiceChannels, voiceMaster.creatorChannelId) : dt("Pick the creator channel on the left."), dt("They get a room of their own"), voiceMaster ? dt("In {a}", { a: voiceMaster.categoryId ? vmName(channelCategories, voiceMaster.categoryId) : dt("the category of the creator channel") }) : dt("A temporary voice channel, made for them."), dt("They manage it from the panel"), voiceMaster ? "#" + vmName(channels, voiceMaster.panelChannelId) : dt("Or with the command !vc."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sliders-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true }), dt("What is set now"), dt("Default user limit"), voiceMaster?.defaultLimit ? voiceMaster.defaultLimit : dt("No limit"), dt("Privacy of new rooms"), vmPrivacy[voiceMaster?.privacyMode ?? "public"][0], dt("Access roles"), voiceMaster?.accessRoleIds?.length ? dt("{n} role(s)", { n: voiceMaster.accessRoleIds.length }) : dt("Everyone"), dt("Copy the permissions of the category"), voiceMaster?.syncCategoryPermissions ? dt("On") : dt("Off"), dt("What the owner of a room can do"), (voiceMaster?.ownerPermissions ?? ["manage_channels", "move_members"]).length, dt("Replace and resend the current VoiceMaster panel"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true }), dt("Save VoiceMaster"), voiceMaster && renderTemplate`<button type="submit" name="action" value="disable_voicemaster" class="btn btn-ghost btn-sm vmx-disable" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Disable")}</button>`, renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Users join the creator channel, receive a temporary channel, and manage it from the panel or <code>!vc</code>."))}` })), selectedSection === "custom-commands" && renderTemplate`<div class="ax1-page ax1-grid2" data-section="custom-commands" data-astro-cid-yjoymnrx> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Commands"), value: customCommands.length, text: `${customCommands.length} / ${customCommandLimit}`, tone: "messages" },
    { label: dt("Text replies"), value: customCommands.length - ax1Code - ax1CmdEmbed, tone: "joins" },
    { label: dt("Saved embeds"), value: ax1CmdEmbed, tone: "voice" },
    { label: dt("Written in code"), value: ax1Code, tone: "invites" }
  ], "data-astro-cid-yjoymnrx": true })} ${customCommandAtLimit ? renderTemplate`<div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" style="--c:var(--yellow)" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${premiumActive ? dt("Custom command limit reached") : dt("Free command limit reached")}</h2> </div> <p class="sx-lead" data-astro-cid-yjoymnrx>${premiumActive ? dt("You are using all {n} available custom commands.", { n: customCommandLimit }) : dt("Free includes {a} custom commands. Premium increases this to {b}.", { a: FREE_LIMITS.customCommands, b: PREMIUM_LIMITS.customCommands })}</p> ${!premiumActive && renderTemplate`<div class="sx-foot" data-astro-cid-yjoymnrx><a class="btn btn-accent btn-sm"${addAttribute(`/dash/premium?guild_id=${guildId}`, "href")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Unlock Premium")}</a></div>`} </div>` : renderTemplate`<form method="POST" class="sx-panel ax1-form" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_command" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("New command")}</h2> </div> <p class="sx-lead" data-astro-cid-yjoymnrx>${selectedMeta.description}</p> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-cc-name" data-astro-cid-yjoymnrx>${dt("Command name")}</label> <span class="ax1-inp" data-astro-cid-yjoymnrx><i data-astro-cid-yjoymnrx>${prefix}</i><input type="text" id="ax1-cc-name" name="name" placeholder="rules" maxlength="32" required data-count autocomplete="off" data-astro-cid-yjoymnrx></span> </div> ${embedTemplateNames.length > 0 && renderTemplate`<div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-cc-tpl" data-astro-cid-yjoymnrx>${dt("Saved embed")}</label> <select id="ax1-cc-tpl" name="embed_template" data-tpl-locks="response" data-astro-cid-yjoymnrx> <option value="" data-astro-cid-yjoymnrx>${dt("No template, use response text")}</option> ${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")} data-astro-cid-yjoymnrx>${n}</option>`)} </select> </div>`} <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label for="ax1-cc-response" data-astro-cid-yjoymnrx>${dt("Response")}</label> <textarea class="dgl-autogrow" rows="3" id="ax1-cc-response" name="response" data-ac data-count${addAttribute(dt("Response text or flags (optional with a template)"), "placeholder")} maxlength="500" data-astro-cid-yjoymnrx></textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-yjoymnrx": true })} ${renderComponent($$result2, "VariableHelp", $$VariableHelp, { "data-astro-cid-yjoymnrx": true })} </div> </div> ${embedTemplateNames.length > 0 && renderTemplate`<p class="sx-hint ax1-text" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Templates are managed on the Embeds page. You can still put flags such as <code>{a}</code> in the response field.", { a: "{reactreply:\u{1F338}}" }))}` })}</p>`} <details class="ax1-scope" data-astro-cid-yjoymnrx> <summary data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:funnel-fill", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}${dt("Where it works")}<span class="ax1-scope-hint" data-astro-cid-yjoymnrx>${dt("Everywhere, for everybody")}</span></summary> ${renderComponent($$result2, "CommandScopeFields", $$CommandScopeFields, { "channelOptions": channelOptions, "roleOptions": roleOptions, "idPrefix": "ax1-new-scope", "data-astro-cid-yjoymnrx": true })} </details> <div class="sx-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Add")}</button></div> </form>`} <div class="sx-stack ax1-late" data-astro-cid-yjoymnrx> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("How it works")}</h2> </div> <ol class="ax1-steps" data-astro-cid-yjoymnrx> <li data-astro-cid-yjoymnrx><span class="ax1-step-n" data-astro-cid-yjoymnrx>1</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Pick a name")}</b><em data-astro-cid-yjoymnrx>${dt("Short and without spaces, like rules.")}</em></span></li> <li data-astro-cid-yjoymnrx><span class="ax1-step-n" data-astro-cid-yjoymnrx>2</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Write the answer")}</b><em data-astro-cid-yjoymnrx>${dt("A text, or a saved embed from the Embeds page.")}</em></span></li> <li data-astro-cid-yjoymnrx><span class="ax1-step-n" data-astro-cid-yjoymnrx>3</span><span data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Members use it")}</b><em data-astro-cid-yjoymnrx>${dt("They type {a} and Petto answers.", { a: `${prefix}rules` })}</em></span></li> </ol> </div> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:code-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("Commands in code")}</h2> </div> <p class="sx-hint ax1-text" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth('Write custom commands with code: embeds, buttons, forms and reactions. Open <a href="{a}">the editor</a>, or use <code>!customcommand code</code> in Discord. <a href="https://code.petto.sbs" target="_blank" rel="noopener">Read the docs</a>.', { a: `/dash/guild/${guildId}/code` }))}` })}</p> </div> </div> <section class="ax1-list" data-astro-cid-yjoymnrx> <div class="ax1-list-head" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>${dt("Your commands")}</h2> <span class="sx-tag" data-astro-cid-yjoymnrx>${customCommands.length} / ${customCommandLimit}</span> ${!premiumActive && renderTemplate`<span class="ax1-premium" data-astro-cid-yjoymnrx>Premium: ${PREMIUM_LIMITS.customCommands}</span>`} </div> ${customCommands.length === 0 ? renderTemplate`<p class="ax1-empty" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "26", "height": "26", "data-astro-cid-yjoymnrx": true })}${dt("Nothing here yet. Add the first one above.")}</p>` : renderTemplate`<div class="ax1-cards dgl-stagger" data-astro-cid-yjoymnrx> ${customCommands.map((c) => renderTemplate`<div class="ax1-card ax1-plain dgl-rc" data-astro-cid-yjoymnrx> <div class="ax1-card-head" data-astro-cid-yjoymnrx> <span class="ax1-card-main" data-astro-cid-yjoymnrx> <code class="ax1-key" data-astro-cid-yjoymnrx>${prefix}${c.name}</code> ${c.isCode ? renderTemplate`<span class="ax1-chip"${addAttribute(dt("Written in code. Edit it in Discord with the customcommand code command."), "title")} data-astro-cid-yjoymnrx>${dt("code")}</span>` : c.embedTemplate ? renderTemplate`<span class="ax1-chip"${addAttribute(dt("Uses a saved embed template"), "title")} data-astro-cid-yjoymnrx>embed: ${c.embedTemplate}</span>` : null} </span> <span class="ax1-acts" data-astro-cid-yjoymnrx> <form method="POST" data-no-dirty data-astro-cid-yjoymnrx><input type="hidden" name="action" value="delete_command" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(c.id, "value")} data-astro-cid-yjoymnrx> <button type="submit" class="ax1-act ax1-act-del"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}</button> </form> </span> </div> <span class="am-chat" data-astro-cid-yjoymnrx> <span class="am-msg" data-astro-cid-yjoymnrx> <img class="am-av" src="/assets/mascot-icon.webp" alt="" width="22" height="22" loading="lazy" decoding="async" data-astro-cid-yjoymnrx> <span class="am-msg-body"${addAttribute(c.isCode ? void 0 : "", "data-cp")}${addAttribute(c.embedTemplate ? "" : c.response ?? "", "data-cp-text")}${addAttribute(c.embedTemplate ?? "", "data-cp-template")} data-astro-cid-yjoymnrx><span class="am-msg-name am-msg-bot" data-astro-cid-yjoymnrx>Petto<span class="am-msg-tag" data-astro-cid-yjoymnrx>${dt("APP")}</span></span> ${c.isCode ? renderTemplate`<span class="am-msg-text am-msg-none" data-astro-cid-yjoymnrx>${dt("Written in code")}</span>` : c.embedTemplate ? renderTemplate`<span class="am-msg-embed" style="--ec:var(--border)" data-astro-cid-yjoymnrx><span class="am-msg-embed-title" data-astro-cid-yjoymnrx>${c.embedTemplate}</span></span>` : c.response ? renderTemplate`<span class="am-msg-text am-msg-clamp"${addAttribute(c.response, "title")} data-astro-cid-yjoymnrx>${c.response}</span>` : renderTemplate`<span class="am-msg-text am-msg-none" data-astro-cid-yjoymnrx>${dt("No reply text")}</span>`} </span> </span> </span> ${!c.isCode && renderTemplate`<details class="ax1-scope ax1-scope-card" data-astro-cid-yjoymnrx> <summary data-astro-cid-yjoymnrx> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:funnel-fill", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}${dt("Where it works")} <span class="ax1-scope-hint" data-astro-cid-yjoymnrx>${c.scope && isScoped(c.scope) ? [
    c.scope.allowChannels.length ? dt("{n} allowed channel(s)", { n: c.scope.allowChannels.length }) : "",
    c.scope.blockChannels.length ? dt("{n} blocked channel(s)", { n: c.scope.blockChannels.length }) : "",
    c.scope.allowRoles.length ? dt("{n} allowed role(s)", { n: c.scope.allowRoles.length }) : "",
    c.scope.blockRoles.length ? dt("{n} blocked role(s)", { n: c.scope.blockRoles.length }) : "",
    c.scope.nsfw ? "NSFW" : "",
    c.scope.restricted && c.scope.restrictedChannel ? dt("Restricted") : ""
  ].filter(Boolean).join(" \xB7 ") : dt("Everywhere, for everybody")}</span> </summary> <form method="POST" class="ax1-scope-form" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="command_scope" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(c.id, "value")} data-astro-cid-yjoymnrx> ${renderComponent($$result2, "CommandScopeFields", $$CommandScopeFields, { "scope": c.scope, "channelOptions": channelOptions, "roleOptions": roleOptions, "idPrefix": `ax1-scope-${c.id}`, "data-astro-cid-yjoymnrx": true })} <div class="sx-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save where it works")}</button></div> </form> </details>`} </div>`)} </div>`} </section> </div>`, selectedSection === "autoresponders" && renderTemplate(_d || (_d = __template(['<div class="ax1-page" data-section="autoresponders" data-astro-cid-yjoymnrx> ', ' <section class="ax1-list" data-astro-cid-yjoymnrx> <div class="ax1-list-head" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>', '</h2> <span class="sx-tag" data-astro-cid-yjoymnrx>', " / ", "</span> ", ' </div> <p class="sx-lead ax1-lead" data-astro-cid-yjoymnrx>', '</p> <div class="ax1-cards dgl-stagger" data-astro-cid-yjoymnrx> ', " ", ' </div> </section>  <span class="am-icon-keep" aria-hidden="true" data-astro-cid-yjoymnrx>', '</span> <template data-ar-edit data-astro-cid-yjoymnrx> <form method="POST" class="ax1-edit ax1-ar-edit" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="edit_responder" data-astro-cid-yjoymnrx> <input type="hidden" name="ar_id" value="" data-astro-cid-yjoymnrx> <div class="ax1-ar-cols" data-astro-cid-yjoymnrx> <div class="ax1-ar-col" data-astro-cid-yjoymnrx> <h3 class="ax1-h3" data-astro-cid-yjoymnrx>', '</h3> <div class="sx-field" data-astro-cid-yjoymnrx><label data-for="trigger" data-astro-cid-yjoymnrx>', '</label> <textarea class="dgl-autogrow sx-one" rows="1" name="trigger" data-one-line data-count maxlength="80" required data-astro-cid-yjoymnrx></textarea></div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', '</span> <div class="dfx-chips" role="radiogroup"', " data-astro-cid-yjoymnrx> ", ' </div></div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', "</span> ", '</div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', "</span> ", '</div> </div> <div class="ax1-ar-col" data-astro-cid-yjoymnrx> <h3 class="ax1-h3" data-astro-cid-yjoymnrx>', '</h3> <div class="sx-field" data-astro-cid-yjoymnrx><label data-for="reply" data-astro-cid-yjoymnrx>', '</label> <textarea class="dgl-autogrow" rows="3" name="reply" data-ac data-count maxlength="500"', " data-astro-cid-yjoymnrx></textarea>", " ", '</div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', '</span> <div class="dfx-chips" role="radiogroup"', ' data-astro-cid-yjoymnrx> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="reply_type" value="text" checked data-astro-cid-yjoymnrx>', '</label> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="reply_type" value="embed" data-astro-cid-yjoymnrx>', '</label> </div></div> <div class="ax1-embed" data-sx-needs="reply_type=embed" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label data-for="embed_title" data-astro-cid-yjoymnrx>', '</label> <textarea class="dgl-autogrow sx-one" rows="1" name="embed_title" data-ac data-one-line data-count maxlength="100" data-astro-cid-yjoymnrx></textarea></div> ', ' <div class="sx-field" data-astro-cid-yjoymnrx><label data-for="embed_footer" data-astro-cid-yjoymnrx>', '</label> <textarea class="dgl-autogrow sx-one" rows="1" name="embed_footer" data-ac data-one-line data-count maxlength="100" data-astro-cid-yjoymnrx></textarea></div> <p class="sx-hint ax1-text" data-astro-cid-yjoymnrx>', "</p> </div> ", ' </div> </div> <div class="sx-switches" data-astro-cid-yjoymnrx> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="delete_trigger" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', '</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="reply_to_trigger" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="ping_user" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="delete_previous" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b><em data-astro-cid-yjoymnrx>", '</em></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> </div> <div class="ax1-actions" data-astro-cid-yjoymnrx> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>', "", `</button> </div> </form> </template> <script>
      // Puts the edit form in an autoresponder row the first time it opens, with the values of that row: the same fields, values and
      // choices the server used to write into every row.
      if (!window.__ax1ArBound) {
        window.__ax1ArBound = true;
        var arBuild = function (box) {
          if (!box || !box.hasAttribute('data-ar') || box.querySelector('.ax1-ar-edit')) return;
          var tpl = document.querySelector('template[data-ar-edit]');
          if (!tpl || !tpl.content.firstElementChild) return;
          var d;
          try { d = JSON.parse(box.getAttribute('data-ar')); } catch (e) { return; }
          var form = tpl.content.firstElementChild.cloneNode(true);
          var field = function (name) { return form.querySelector('[name="' + name + '"]'); };
          var setValue = function (name, value) { var el = field(name); if (!el) return; if (el.tagName === 'TEXTAREA') el.textContent = value == null ? '' : String(value); else el.setAttribute('value', value == null ? '' : String(value)); };
          // A choice among chips (radio) or a list: only the one with this value is marked.
          var choose = function (name, value) {
            var found = false;
            form.querySelectorAll('[name="' + name + '"]').forEach(function (el) {
              if (el.type === 'radio') { var on = el.value === value; found = found || on; if (on) el.setAttribute('checked', ''); else el.removeAttribute('checked'); }
              else if (el.options) Array.prototype.forEach.call(el.options, function (o) { if (o.value && o.value === value) o.setAttribute('selected', ''); else o.removeAttribute('selected'); });
            });
            return found;
          };
          setValue('ar_id', d.id);
          setValue('trigger', d.trigger);
          setValue('reply', d.reply);
          setValue('embed_title', d.title);
          setValue('embed_footer', d.footer);
          if (!choose('match_mode', d.mode)) choose('match_mode', 'contains');
          choose('reply_type', d.type === 'embed' ? 'embed' : 'text');
          choose('embed_template', d.template || '');
          [['delete_trigger', d.del], ['reply_to_trigger', d.rep], ['ping_user', d.ping], ['delete_previous', d.prev]].forEach(function (pair) { var el = field(pair[0]); if (el && pair[1]) el.setAttribute('checked', ''); });
          // Each label points at its field (the ids are made here so two open rows never share one).
          form.querySelectorAll('label[data-for]').forEach(function (label) {
            var el = field(label.getAttribute('data-for'));
            if (el) { el.id = 'ax1-' + d.id + '-' + label.getAttribute('data-for'); label.setAttribute('for', el.id); }
          });
          var picker = form.querySelector('[data-colorpicker]');
          if (picker) {
            var color = d.color || '';
            setValue('embed_color', color);
            picker.setAttribute('data-cp-default', color);
            picker.classList.toggle('is-none', !color);
            var swatch = picker.querySelector('[data-cp-swatch]');
            if (swatch) swatch.setAttribute('style', '--sw:' + (color || '#8399ff'));
            var hex = picker.querySelector('[data-cp-hexlabel]');
            if (hex) hex.textContent = color || picker.getAttribute('data-cp-nonelabel') || '';
          }
          form.querySelectorAll('[data-ms-source]').forEach(function (wrap) {
            var chosen = wrap.getAttribute('data-ms-name') === 'role_ids' ? d.ro : d.ch;
            if (!chosen || !chosen.length) return;
            var holder = document.querySelector('script[data-ms-options="' + wrap.getAttribute('data-ms-source') + '"]');
            var list;
            try { list = JSON.parse(holder ? holder.textContent : '[]'); } catch (e) { list = []; }
            var dropdown = wrap.querySelector('[data-ms-dropdown]');
            list.forEach(function (option) {
              if (chosen.indexOf(option.id) === -1) return;
              var label = document.createElement('label');
              label.className = 'dgl-ms-option';
              label.setAttribute('data-ms-option', '');
              var cb = document.createElement('input');
              cb.type = 'checkbox';
              cb.name = wrap.getAttribute('data-ms-name');
              cb.value = option.id;
              cb.defaultChecked = true;
              cb.hidden = true;
              var text = document.createElement('span');
              text.textContent = option.name;
              label.appendChild(cb);
              label.appendChild(text);
              dropdown.appendChild(label);
            });
          });
          box.insertBefore(form, box.querySelector('.ax1-hide'));
          if (window.dglInitContent) window.dglInitContent(box);
          if (window.__dfxKit) window.__dfxKit();
          if (window.__sxKit) window.__sxKit();
        };
        document.addEventListener('click', function (e) {
          var summary = e.target && e.target.closest ? e.target.closest('details[data-ar] > summary') : null;
          if (summary) arBuild(summary.parentNode);
        }, true);
        document.addEventListener('toggle', function (e) { if (e.target && e.target.open) arBuild(e.target); }, true);
      }
    <\/script> </div>`])), renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Autoresponders"), value: autoResponders.length, text: `${autoResponders.length} / ${responderLimit}`, tone: "messages" },
    { label: dt("Text replies"), value: autoResponders.length - ax1ArEmbed, tone: "joins" },
    { label: dt("Embed replies"), value: ax1ArEmbed, tone: "voice" },
    { label: dt("Channels or roles"), value: ax1ArScoped, tone: "invites" }
  ], "data-astro-cid-yjoymnrx": true }), dt("Your autoresponders"), autoResponders.length, responderLimit, !premiumActive && renderTemplate`<span class="ax1-premium" data-astro-cid-yjoymnrx>Premium: ${PREMIUM_LIMITS.autoResponders}</span>`, selectedMeta.description, autoResponders.length >= responderLimit ? renderTemplate`<div class="ax1-card ax1-limit" data-astro-cid-yjoymnrx> <span class="ax1-limit-icon" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <span class="ax1-limit-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Autoresponder limit reached")}</b><em data-astro-cid-yjoymnrx>${premiumActive ? dt("You have reached the {n} autoresponder limit.", { n: responderLimit }) : dt("The Free plan includes {a} autoresponders. Premium unlocks up to {b}.", { a: FREE_LIMITS.autoResponders, b: PREMIUM_LIMITS.autoResponders })}</em></span> ${!premiumActive && renderTemplate`<a class="btn btn-accent btn-sm"${addAttribute(`/dash/premium?guild_id=${guildId}`, "href")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Unlock Premium")}</a>`} </div>` : renderTemplate`<details class="ax1-card ax1-fold ax1-free ax1-new"${addAttribute(autoResponders.length === 0 || Boolean(error), "open")} data-astro-cid-yjoymnrx> <summary class="ax1-sum ax1-sum-new" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}${dt("New autoresponder")}</summary> <form method="POST" class="ax1-edit" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_responder" data-astro-cid-yjoymnrx> <div class="ax1-ar-cols" data-astro-cid-yjoymnrx> <div class="ax1-ar-col" data-astro-cid-yjoymnrx> <h3 class="ax1-h3" data-astro-cid-yjoymnrx>${dt("When someone writes")}</h3> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-n-trigger" data-astro-cid-yjoymnrx>${dt("Trigger word")}</label> <textarea class="dgl-autogrow sx-one" rows="1" id="ax1-n-trigger" name="trigger" data-one-line data-count maxlength="80" required data-astro-cid-yjoymnrx></textarea></div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Match mode")}</span> <div class="dfx-chips" role="radiogroup"${addAttribute(dt("Match mode"), "aria-label")} data-astro-cid-yjoymnrx> ${["contains", "startsWith", "endsWith", "exact", "regex"].map((mode) => renderTemplate`<label class="dfx-chip"${addAttribute(matchHelp[mode], "title")} data-astro-cid-yjoymnrx><input type="radio" name="match_mode"${addAttribute(mode, "value")}${addAttribute(mode === "contains", "checked")} data-astro-cid-yjoymnrx>${matchLabel[mode]}</label>`)} </div></div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Only in these channels (empty = everywhere)")}</span> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "channel_ids", "options": channelOptions, "source": "am-channels", "selected": [], "placeholder": dt("Search channels..."), "data-astro-cid-yjoymnrx": true })}</div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Only for members with these roles (empty = everyone)")}</span> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "role_ids", "options": roleOptions, "source": "am-roles", "selected": [], "placeholder": dt("Search roles..."), "data-astro-cid-yjoymnrx": true })}</div> </div> <div class="ax1-ar-col" data-astro-cid-yjoymnrx> <h3 class="ax1-h3" data-astro-cid-yjoymnrx>${dt("The reply")}</h3> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-n-reply" data-astro-cid-yjoymnrx>${dt("Reply")}</label> <textarea class="dgl-autogrow" rows="3" id="ax1-n-reply" name="reply" data-ac data-count maxlength="500"${addAttribute(dt("Reply text or flags (optional with a template)"), "placeholder")} data-astro-cid-yjoymnrx></textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-yjoymnrx": true })} ${renderComponent($$result2, "VariableHelp", $$VariableHelp, { "data-astro-cid-yjoymnrx": true })}</div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Send as")}</span> <div class="dfx-chips" role="radiogroup"${addAttribute(dt("Send as"), "aria-label")} data-astro-cid-yjoymnrx> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="reply_type" value="text" checked data-astro-cid-yjoymnrx>${dt("Send as plain text")}</label> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="reply_type" value="embed" data-astro-cid-yjoymnrx>${dt("Send as an embed")}</label> </div></div> <div class="ax1-embed" data-sx-needs="reply_type=embed" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-n-title" data-astro-cid-yjoymnrx>${dt("Embed title (optional)")}</label> <textarea class="dgl-autogrow sx-one" rows="1" id="ax1-n-title" name="embed_title" data-ac data-one-line data-count maxlength="100" data-astro-cid-yjoymnrx></textarea></div> ${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "embed_color", "value": "#8399ff", "label": dt("Embed color"), "allowNone": true, "data-astro-cid-yjoymnrx": true })} <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-n-footer" data-astro-cid-yjoymnrx>${dt("Footer text (optional)")}</label> <textarea class="dgl-autogrow sx-one" rows="1" id="ax1-n-footer" name="embed_footer" data-ac data-one-line data-count maxlength="100" data-astro-cid-yjoymnrx></textarea></div> <p class="sx-hint ax1-text" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("The title/color/footer only apply when set to embed, the reply text above becomes the embed description. Use <code>{a}</code> in that field to react to the sent embed.", { a: "{reactreply:\u{1F338}}" }))}` })}</p> </div> ${embedTemplateNames.length > 0 && renderTemplate`<div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-n-tpl" data-astro-cid-yjoymnrx>${dt("Saved embed")}</label> <select id="ax1-n-tpl" name="embed_template" data-tpl-ignore data-astro-cid-yjoymnrx> <option value="" data-astro-cid-yjoymnrx>${dt("No saved template, use the options above")}</option> ${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")} data-astro-cid-yjoymnrx>${n}</option>`)} </select> <span class="sx-hint ax1-text" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Picking a saved template here uses its visual design. The reply field still accepts flags such as <code>{a}</code>; templates are managed on the Embeds page.", { a: "{reactreply:\u{1F338}}" }))}` })}</span></div>`} </div> </div> <div class="sx-switches" data-astro-cid-yjoymnrx> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="delete_trigger" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Delete the triggering message")}</b></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="reply_to_trigger" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Reply directly to the triggering message")}</b><em data-astro-cid-yjoymnrx>${dt("Instead of sending a new message.")}</em></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="ping_user" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Notify the triggering user")}</b><em data-astro-cid-yjoymnrx>${dt("A native reply ping, with no @mention in the text.")}</em></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> <label class="sx-switch" data-astro-cid-yjoymnrx><input type="checkbox" name="delete_previous" data-astro-cid-yjoymnrx><span class="sx-switch-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Delete its previous reply in the channel")}</b><em data-astro-cid-yjoymnrx>${dt("Petto needs Manage Messages.")}</em></span><span class="sx-toggle" data-astro-cid-yjoymnrx></span></label> </div> <div class="ax1-actions" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Add")}</button></div> </form> </details>`, autoResponders.map((a) => {
    const kind = a.embedTemplate ? "template" : a.replyType === "embed" ? "embed" : "text";
    const embedColor = a.embedColor != null ? `#${a.embedColor.toString(16).padStart(6, "0")}` : "var(--border)";
    return renderTemplate`<details class="ax1-card ax1-fold ax1-free dgl-rc" style="--c:var(--accent)"${addAttribute(JSON.stringify({ id: a.arId, trigger: a.trigger, mode: a.matchMode, reply: a.reply, del: a.deleteTrigger, rep: a.replyToTrigger, ping: a.pingUser, prev: a.deletePrevious ?? false, type: a.replyType, title: a.embedTitle ?? "", color: a.embedColor != null ? `#${a.embedColor.toString(16).padStart(6, "0")}` : "", footer: a.embedFooter ?? "", template: a.embedTemplate, ch: a.channelIds, ro: a.roleIds }), "data-ar")} data-astro-cid-yjoymnrx> <summary class="ax1-sum" data-astro-cid-yjoymnrx> <span class="ax1-card-head" data-astro-cid-yjoymnrx> <span class="ax1-kind" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": kind === "text" ? "ph:chat-circle-text-fill" : "ph:browser-fill", "width": "15", "height": "15", "data-astro-cid-yjoymnrx": true })}</span> <span class="ax1-card-title" data-astro-cid-yjoymnrx>${kind === "text" ? dt("Text reply") : kind === "embed" ? dt("Embed reply") : dt("Saved embed")}</span> <span class="ax1-acts" data-astro-cid-yjoymnrx><span class="ax1-act" aria-hidden="true" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}<span class="ax1-act-t" data-astro-cid-yjoymnrx><span class="ax1-t-edit" data-astro-cid-yjoymnrx>${dt("Edit")}</span><span class="ax1-t-close" data-astro-cid-yjoymnrx>${dt("Close")}</span></span></span><button type="submit"${addAttribute(`am-del-ar-${a.arId}`, "form")} class="ax1-act ax1-act-del"${addAttribute(dt("Delete this autoresponder"), "title")}${addAttribute(dt("Delete this autoresponder"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}</button></span> </span> <span class="am-chat" data-astro-cid-yjoymnrx> <span class="am-msg" data-astro-cid-yjoymnrx> <span class="am-av am-av-member" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}</span> <span class="am-msg-body" data-astro-cid-yjoymnrx><span class="am-msg-name" data-astro-cid-yjoymnrx>${dt("Member")}</span>${a.matchMode === "regex" ? renderTemplate`<code class="am-msg-text am-msg-code"${addAttribute(a.trigger, "title")} data-astro-cid-yjoymnrx>${a.trigger}</code>` : renderTemplate`<span class="am-msg-text am-msg-trigger"${addAttribute(a.trigger, "title")} data-astro-cid-yjoymnrx>${a.trigger}</span>`}</span> </span> <span class="am-msg" data-astro-cid-yjoymnrx> <img class="am-av" src="/assets/mascot-icon.webp" alt="" width="22" height="22" loading="lazy" decoding="async" data-astro-cid-yjoymnrx> <span class="am-msg-body" data-cp${addAttribute(a.embedTemplate ? "" : a.reply, "data-cp-text")}${addAttribute(a.embedTemplate ?? "", "data-cp-template")}${addAttribute(kind === "embed" ? "1" : "", "data-cp-embed")}${addAttribute(a.embedTitle ?? "", "data-cp-title")}${addAttribute(a.embedColor != null ? embedColor : "", "data-cp-color")}${addAttribute(a.embedFooter ?? "", "data-cp-footer")} data-astro-cid-yjoymnrx><span class="am-msg-name am-msg-bot" data-astro-cid-yjoymnrx>Petto<span class="am-msg-tag" data-astro-cid-yjoymnrx>${dt("APP")}</span></span> ${kind === "text" ? a.reply ? renderTemplate`<span class="am-msg-text am-msg-clamp"${addAttribute(a.reply, "title")} data-astro-cid-yjoymnrx>${a.reply}</span>` : renderTemplate`<span class="am-msg-text am-msg-none" data-astro-cid-yjoymnrx>${dt("No reply text")}</span>` : renderTemplate`<span class="am-msg-embed"${addAttribute(`--ec:${embedColor}`, "style")} data-astro-cid-yjoymnrx> ${kind === "template" ? renderTemplate`<span class="am-msg-embed-title" data-astro-cid-yjoymnrx>${a.embedTemplate}</span>` : a.embedTitle && renderTemplate`<span class="am-msg-embed-title" data-astro-cid-yjoymnrx>${a.embedTitle}</span>`} ${a.reply && renderTemplate`<span class="am-msg-text am-msg-clamp"${addAttribute(a.reply, "title")} data-astro-cid-yjoymnrx>${a.reply}</span>`} ${kind === "embed" && !a.embedTitle && !a.reply && renderTemplate`<span class="am-msg-text am-msg-none" data-astro-cid-yjoymnrx>${dt("No reply text")}</span>`} </span>`} </span> </span> </span> <span class="ax1-chips" data-astro-cid-yjoymnrx> <span class="ax1-chip ax1-chip-accent"${addAttribute(matchHelp[a.matchMode] ?? "", "title")} data-astro-cid-yjoymnrx>${matchLabel[a.matchMode] ?? a.matchMode}</span> ${a.deleteTrigger && renderTemplate`<span class="ax1-chip"${addAttribute(dt("Deletes the triggering message"), "title")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}${dt("Deletes the message")}</span>`} ${a.replyToTrigger && renderTemplate`<span class="ax1-chip"${addAttribute(dt("Replies directly to the triggering message"), "title")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-bend-up-left-fill", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}${dt("Replies to it")}</span>`} ${a.pingUser && renderTemplate`<span class="ax1-chip"${addAttribute(dt("Pings the triggering user"), "title")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:bell-fill", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}${dt("Pings the user")}</span>`} ${a.deletePrevious && renderTemplate`<span class="ax1-chip"${addAttribute(dt("Deletes its previous reply in the channel"), "title")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrows-clockwise-bold", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}${dt("Replaces its last reply")}</span>`} ${a.channelIds.length > 0 && renderTemplate`<span class="ax1-chip" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hash-bold", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}${a.channelIds.length === 1 ? dt("1 channel") : dt("{a} channels", { a: a.channelIds.length })}</span>`} ${a.roleIds.length > 0 && renderTemplate`<span class="ax1-chip" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}${a.roleIds.length === 1 ? dt("1 role") : dt("{a} roles", { a: a.roleIds.length })}</span>`} </span> </summary> <form method="POST" class="ax1-hide"${addAttribute(`am-del-ar-${a.arId}`, "id")} data-no-dirty data-astro-cid-yjoymnrx><input type="hidden" name="action" value="delete_responder" data-astro-cid-yjoymnrx><input type="hidden" name="ar_id"${addAttribute(a.arId, "value")} data-astro-cid-yjoymnrx></form> </details>`;
  }), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true }), dt("When someone writes"), dt("Trigger word"), dt("Match mode"), addAttribute(dt("Match mode"), "aria-label"), ["contains", "startsWith", "endsWith", "exact", "regex"].map((mode) => renderTemplate`<label class="dfx-chip"${addAttribute(matchHelp[mode], "title")} data-astro-cid-yjoymnrx><input type="radio" name="match_mode"${addAttribute(mode, "value")}${addAttribute(mode === "contains", "checked")} data-astro-cid-yjoymnrx>${matchLabel[mode]}</label>`), dt("Only in these channels (empty = everywhere)"), renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "channel_ids", "options": channelOptions, "source": "am-channels", "selected": [], "placeholder": dt("Search channels..."), "data-astro-cid-yjoymnrx": true }), dt("Only for members with these roles (empty = everyone)"), renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "role_ids", "options": roleOptions, "source": "am-roles", "selected": [], "placeholder": dt("Search roles..."), "data-astro-cid-yjoymnrx": true }), dt("The reply"), dt("Reply"), addAttribute(dt("Reply text or flags (optional with a template)"), "placeholder"), renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-yjoymnrx": true }), renderComponent($$result2, "VariableHelp", $$VariableHelp, { "data-astro-cid-yjoymnrx": true }), dt("Send as"), addAttribute(dt("Send as"), "aria-label"), dt("Send as plain text"), dt("Send as an embed"), dt("Embed title (optional)"), renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "embed_color", "value": "", "label": dt("Embed color"), "allowNone": true, "data-astro-cid-yjoymnrx": true }), dt("Footer text (optional)"), renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("The title/color/footer only apply when set to embed, the reply text above becomes the embed description. Use <code>{a}</code> in that field to react to the sent embed.", { a: "{reactreply:\u{1F338}}" }))}` }), embedTemplateNames.length > 0 && renderTemplate`<div class="sx-field" data-astro-cid-yjoymnrx><label data-for="embed_template" data-astro-cid-yjoymnrx>${dt("Saved embed")}</label> <select name="embed_template" data-tpl-ignore data-astro-cid-yjoymnrx> <option value="" data-astro-cid-yjoymnrx>${dt("No saved template, use the options above")}</option> ${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")} data-astro-cid-yjoymnrx>${n}</option>`)} </select> <span class="sx-hint ax1-text" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Picking a saved template here uses its visual design. The reply field still accepts flags such as <code>{a}</code>; templates are managed on the Embeds page.", { a: "{reactreply:\u{1F338}}" }))}` })}</span></div>`, dt("Delete the triggering message"), dt("Reply directly to the triggering message"), dt("Instead of sending a new message."), dt("Notify the triggering user"), dt("A native reply ping, with no @mention in the text."), dt("Delete its previous reply in the channel"), dt("Petto needs Manage Messages."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true }), dt("Save changes")), selectedSection === "sticky-messages" && renderTemplate`<div class="ax1-page ax1-split" data-section="sticky-messages" data-astro-cid-yjoymnrx> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Sticky messages"), value: stickyMessages.length, tone: "messages" },
    { label: dt("Text only"), value: stickyMessages.length - ax1StickyEmbed, tone: "joins" },
    { label: dt("Saved embeds"), value: ax1StickyEmbed, tone: "voice" },
    { label: dt("Channels without one"), value: channels.filter((c) => !stickyMessages.some((s) => s.channelId === c.id)).length, tone: "invites" }
  ], "data-astro-cid-yjoymnrx": true })} <form method="POST" class="sx-panel ax1-form" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_sticky" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:push-pin-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("New sticky message")}</h2> </div> <p class="sx-lead" data-astro-cid-yjoymnrx>${selectedMeta.description}</p> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-st-channel" data-astro-cid-yjoymnrx>${dt("Channel")}</label> <select id="ax1-st-channel" name="channel_id" required data-astro-cid-yjoymnrx> <option value="" disabled selected data-astro-cid-yjoymnrx>${dt("Channel")}</option> ${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-yjoymnrx>#${c.name}</option>`)} </select> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-st-tpl" data-astro-cid-yjoymnrx>${dt("Saved embed")}</label> <select id="ax1-st-tpl" name="embed_template" data-tpl-locks="content" data-astro-cid-yjoymnrx><option value="" data-astro-cid-yjoymnrx>${dt("No saved embed")}</option>${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")} data-astro-cid-yjoymnrx>${name}</option>`)}</select> </div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label for="ax1-st-content" data-astro-cid-yjoymnrx>${dt("Message")}</label> <textarea class="dgl-autogrow" rows="3" id="ax1-st-content" name="content" data-ac data-count${addAttribute(dt("Message to keep pinned to the bottom"), "placeholder")} maxlength="500" data-astro-cid-yjoymnrx></textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-yjoymnrx": true })} </div> </div> <p class="sx-hint ax1-text" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("One sticky per channel, adding another in the same channel replaces it. After you save, the bot deletes and re-sends it every time someone posts in that channel, so it always stays at the bottom. Use <code>{a}</code> for a line break, <code>{b}</code> for a divider line. Choose a saved embed (a V2 design too) to send it instead of the text; the text is used if the embed is missing.", { a: "{newline}", b: "{separator}" }))}` })}</p> <div class="sx-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Add")}</button></div> </form> <section class="ax1-list" data-astro-cid-yjoymnrx> <div class="ax1-list-head" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>${dt("Your sticky messages")}</h2> <span class="sx-tag" data-astro-cid-yjoymnrx>${stickyMessages.length}</span> </div> ${stickyMessages.length === 0 ? renderTemplate`<p class="ax1-empty" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:push-pin-fill", "width": "26", "height": "26", "data-astro-cid-yjoymnrx": true })}${dt("Nothing here yet. Add the first one above.")}</p>` : renderTemplate`<div class="ax1-cards dgl-stagger" data-astro-cid-yjoymnrx> ${stickyMessages.map((s) => renderTemplate`<details class="ax1-card ax1-fold dgl-rc" style="--c:var(--green)" data-astro-cid-yjoymnrx> <summary class="ax1-sum" data-astro-cid-yjoymnrx> <span class="ax1-card-head" data-astro-cid-yjoymnrx> <span class="ax1-card-main" data-astro-cid-yjoymnrx><code class="ax1-key" data-astro-cid-yjoymnrx>#${channelName(s.channelId)}</code></span> <span class="ax1-acts" data-astro-cid-yjoymnrx><span class="ax1-act" aria-hidden="true" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}<span class="ax1-act-t" data-astro-cid-yjoymnrx><span class="ax1-t-edit" data-astro-cid-yjoymnrx>${dt("Edit")}</span><span class="ax1-t-close" data-astro-cid-yjoymnrx>${dt("Close")}</span></span></span><button type="submit"${addAttribute(`am-del-sticky-${s.channelId}`, "form")} class="ax1-act ax1-act-del"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}</button></span> </span> <span class="am-chat" data-astro-cid-yjoymnrx><span class="am-msg" data-astro-cid-yjoymnrx><img class="am-av" src="/assets/mascot-icon.webp" alt="" width="22" height="22" loading="lazy" decoding="async" data-astro-cid-yjoymnrx><span class="am-msg-body" data-cp${addAttribute(s.content, "data-cp-text")}${addAttribute(s.embedTemplate ?? "", "data-cp-template")} data-astro-cid-yjoymnrx><span class="am-msg-name am-msg-bot" data-astro-cid-yjoymnrx>Petto<span class="am-msg-tag" data-astro-cid-yjoymnrx>${dt("APP")}</span></span>${s.embedTemplate ? renderTemplate`<span class="am-msg-embed" style="--ec:var(--border)" data-astro-cid-yjoymnrx><span class="am-msg-embed-title" data-astro-cid-yjoymnrx>${s.embedTemplate}</span></span>` : renderTemplate`<span class="am-msg-text am-msg-clamp"${addAttribute(s.content, "title")} data-astro-cid-yjoymnrx>${s.content}</span>`}</span></span></span> <span class="ax1-chips" data-astro-cid-yjoymnrx><span class="ax1-chip" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:push-pin-fill", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}${dt("Stays at the bottom")}</span></span> </summary> <form method="POST" class="ax1-edit" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_sticky" data-astro-cid-yjoymnrx><input type="hidden" name="old_channel_id"${addAttribute(s.channelId, "value")} data-astro-cid-yjoymnrx> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax1-st-ch-${s.channelId}`, "for")} data-astro-cid-yjoymnrx>${dt("Channel")}</label> <select${addAttribute(`ax1-st-ch-${s.channelId}`, "id")} name="channel_id" required data-astro-cid-yjoymnrx>${!channels.some((c) => c.id === s.channelId) && renderTemplate`<option${addAttribute(s.channelId, "value")} selected data-astro-cid-yjoymnrx>#${channelName(s.channelId)}</option>`}${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === s.channelId, "selected")} data-astro-cid-yjoymnrx>#${c.name}</option>`)}</select> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax1-st-tp-${s.channelId}`, "for")} data-astro-cid-yjoymnrx>${dt("Saved embed")}</label> <select${addAttribute(`ax1-st-tp-${s.channelId}`, "id")} name="embed_template" data-tpl-locks="content" data-astro-cid-yjoymnrx><option value="" data-astro-cid-yjoymnrx>${dt("No saved embed")}</option>${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === s.embedTemplate, "selected")} data-astro-cid-yjoymnrx>${name}</option>`)}</select> </div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label${addAttribute(`ax1-st-ct-${s.channelId}`, "for")} data-astro-cid-yjoymnrx>${dt("Message")}</label> <textarea class="dgl-autogrow" rows="3"${addAttribute(`ax1-st-ct-${s.channelId}`, "id")} name="content" data-ac data-count${addAttribute(dt("Message to keep pinned to the bottom"), "placeholder")} maxlength="500" data-astro-cid-yjoymnrx>${s.content}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-yjoymnrx": true })} </div> </div> <div class="ax1-actions" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${dt("Save changes")}</button></div> </form> <form method="POST" class="ax1-hide"${addAttribute(`am-del-sticky-${s.channelId}`, "id")} data-no-dirty data-astro-cid-yjoymnrx><input type="hidden" name="action" value="delete_sticky" data-astro-cid-yjoymnrx><input type="hidden" name="channel_id"${addAttribute(s.channelId, "value")} data-astro-cid-yjoymnrx></form> </details>`)} </div>`} </section> </div>`, selectedSection === "reaction-roles" && renderTemplate`<div class="ax1-page ax1-grid2" data-section="reaction-roles" data-astro-cid-yjoymnrx> ${reactionRoleError && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-yjoymnrx": true })}${reactionRoleError}</div>`} ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Role bindings"), value: reactionRoles.length, tone: "messages" },
    { label: dt("Reactions"), value: reactionRoles.length - ax1RrButtons, tone: "reactions" },
    { label: dt("Buttons"), value: ax1RrButtons, tone: "voice" },
    { label: dt("Messages"), value: ax1RrMessages, tone: "invites" }
  ], "data-astro-cid-yjoymnrx": true })} <a class="ax1-banner"${addAttribute(`/dash/guild/${guildId}/reaction-role`, "href")} data-astro-cid-yjoymnrx> <span class="ax1-banner-icon" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magic-wand-fill", "width": "18", "height": "18", "data-astro-cid-yjoymnrx": true })}</span> <span class="ax1-banner-text" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>${dt("Create a role menu with an embed and buttons")}</b><em data-astro-cid-yjoymnrx>${dt("Pick the channel, write or load an embed, and add rows of buttons with their color, role and emoji.")}</em></span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })} </a> <form method="POST" class="sx-panel ax1-form" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_reactionrole" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:smiley-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("New role binding")}</h2> </div> <p class="sx-lead" data-astro-cid-yjoymnrx>${selectedMeta.description}</p> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-rr-channel" data-astro-cid-yjoymnrx>${dt("Channel")}</label> <select id="ax1-rr-channel" name="channel_id" required data-astro-cid-yjoymnrx> <option value="" disabled selected data-astro-cid-yjoymnrx>${dt("Channel")}</option> ${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-yjoymnrx>#${c.name}</option>`)} </select> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-rr-message" data-astro-cid-yjoymnrx>${dt("Message ID")}</label> <input type="text" id="ax1-rr-message" name="message_id" list="rr-messages" placeholder="123456789012345678" maxlength="24" autocomplete="off" data-astro-cid-yjoymnrx> <datalist id="rr-messages" data-astro-cid-yjoymnrx>${[...new Set(reactionRoles.map((r) => r.messageId))].map((mid) => renderTemplate`<option${addAttribute(mid, "value")} data-astro-cid-yjoymnrx></option>`)}</datalist> </div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label for="ax1-rr-tpl" data-astro-cid-yjoymnrx>${dt("Saved embed")}</label> <select id="ax1-rr-tpl" name="embed_template" data-astro-cid-yjoymnrx> <option value="" data-astro-cid-yjoymnrx>${dt("Or post a new message with a saved embed")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")} data-astro-cid-yjoymnrx>${name}</option>`)} </select> </div> <div class="sx-field sx-wide ax1-rr-who" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Emoji")}</span> <input type="text" name="emoji" data-emoji-input${addAttribute(dt("Emoji or custom emoji"), "placeholder")} maxlength="100" required data-astro-cid-yjoymnrx> </div> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-rr-role" data-astro-cid-yjoymnrx>${dt("Role")}</label> <select id="ax1-rr-role" name="role_id" required data-give-role data-astro-cid-yjoymnrx> <option value="" disabled selected data-astro-cid-yjoymnrx>${dt("Role")}</option> ${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")} data-astro-cid-yjoymnrx>${r.name}</option>`)} </select> </div> </div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Type")}</span> <div class="dfx-chips" role="radiogroup"${addAttribute(dt("Type"), "aria-label")} data-astro-cid-yjoymnrx> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="interaction_type" value="reaction" checked data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:smiley-fill", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}reaction</label> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="interaction_type" value="button" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:cursor-click-fill", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}button</label> </div> </div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Mode")}</span> <div class="dfx-chips" role="radiogroup"${addAttribute(dt("Mode"), "aria-label")} data-astro-cid-yjoymnrx> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="mode" value="toggle" checked data-astro-cid-yjoymnrx>toggle</label> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="mode" value="add" data-astro-cid-yjoymnrx>${dt("add only")}</label> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="mode" value="remove" data-astro-cid-yjoymnrx>${dt("remove only")}</label> </div> </div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label for="ax1-rr-label" data-astro-cid-yjoymnrx>${dt("Button label (optional)")}</label> <textarea class="dgl-autogrow sx-one" rows="1" id="ax1-rr-label" name="button_label" data-one-line data-count maxlength="80" data-astro-cid-yjoymnrx></textarea> </div> </div> <div class="sx-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Add")}</button></div> </form> <div class="sx-stack ax1-late" data-astro-cid-yjoymnrx> <div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("How it works")}</h2> </div> <p class="sx-hint ax1-text" data-astro-cid-yjoymnrx>${dt("Use reaction mode for emoji reactions or button mode for a clickable role menu. Button mode can add up to 25 buttons to a message without another component panel.")}</p> <p class="sx-hint ax1-text" data-astro-cid-yjoymnrx>${dt("Type the ID of a message, or pick a saved embed to post a new message with the role button on it (classic embeds only; a V2 design cannot hold role buttons). To add more buttons to that message, use its ID.")}</p> </div> ${ax1RrMenus.length > 0 && renderTemplate`<div class="sx-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chat-circle-dots-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("Messages with roles")}</h2> <span class="sx-tag" data-astro-cid-yjoymnrx>${ax1RrMenus.length}</span> </div> <div class="ax1-menus" data-astro-cid-yjoymnrx> ${ax1RrMenus.slice(0, 5).map((menu) => renderTemplate`<div class="ax1-menu" data-astro-cid-yjoymnrx> <span class="ax1-menu-top" data-astro-cid-yjoymnrx> <code class="ax1-key" data-astro-cid-yjoymnrx>${menu.channelId ? `#${channelName(menu.channelId)}` : menu.messageId}</code> ${menu.channelId && renderTemplate`<a class="ax1-chip ax1-chip-link"${addAttribute(`https://discord.com/channels/${guildId}/${menu.channelId}/${menu.messageId}`, "href")} target="_blank" rel="noopener" data-astro-cid-yjoymnrx>${dt("Open message")}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-square-out-bold", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}</a>`} </span> <span class="ax1-menu-items" data-astro-cid-yjoymnrx> ${menu.items.slice(0, 8).map((r) => {
    const custom = ax1Emoji(r.emoji);
    return renderTemplate`<span class="ax1-menu-item"${addAttribute(`@${roleName(r.roleId)}`, "title")} data-astro-cid-yjoymnrx>${custom ? renderTemplate`<img${addAttribute(custom.src, "src")}${addAttribute(custom.name, "alt")} width="18" height="18" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-yjoymnrx>` : r.emoji && !r.emoji.startsWith("label:") ? r.emoji : renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:cursor-click-fill", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}`}${r.interactionType === "button" && r.buttonLabel ? renderTemplate`<em data-astro-cid-yjoymnrx>${r.buttonLabel}</em>` : null}</span>`;
  })} ${menu.items.length > 8 && renderTemplate`<span class="ax1-menu-item" data-astro-cid-yjoymnrx>+${menu.items.length - 8}</span>`} </span> </div>`)} </div> ${ax1RrMenus.length > 5 && renderTemplate`<p class="sx-hint" data-astro-cid-yjoymnrx>${dt("And {n} more.", { n: ax1RrMenus.length - 5 })}</p>`} </div>`} </div> <section class="ax1-list" data-astro-cid-yjoymnrx> <div class="ax1-list-head" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>${dt("Your role bindings")}</h2> <span class="sx-tag" data-astro-cid-yjoymnrx>${reactionRoles.length}</span> </div> ${reactionRoles.length === 0 ? renderTemplate`<p class="ax1-empty" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:smiley-fill", "width": "26", "height": "26", "data-astro-cid-yjoymnrx": true })}${dt("Nothing here yet. Add the first one above.")}</p>` : renderTemplate`<div class="ax1-cards dgl-stagger" data-astro-cid-yjoymnrx> ${reactionRoles.map((r) => {
    const custom = ax1Emoji(r.emoji);
    return renderTemplate`<details class="ax1-card ax1-fold dgl-rc" style="--c:var(--accent)" data-astro-cid-yjoymnrx> <summary class="ax1-sum" data-astro-cid-yjoymnrx> <span class="ax1-card-head" data-astro-cid-yjoymnrx> <span class="ax1-mark" data-astro-cid-yjoymnrx>${custom ? renderTemplate`<img${addAttribute(custom.src, "src")}${addAttribute(custom.name, "alt")} width="24" height="24" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-yjoymnrx>` : r.emoji && !r.emoji.startsWith("label:") ? renderTemplate`<span class="ax1-mark-emoji" data-astro-cid-yjoymnrx>${r.emoji}</span>` : renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:cursor-click-fill", "width": "18", "height": "18", "data-astro-cid-yjoymnrx": true })}`}</span> <span class="ax1-rr-name" data-astro-cid-yjoymnrx><b${addAttribute(roleName(r.roleId), "title")} data-astro-cid-yjoymnrx>@${roleName(r.roleId)}</b>${r.interactionType === "button" && renderTemplate`<em${addAttribute(r.buttonLabel ?? "", "title")} data-astro-cid-yjoymnrx>${r.buttonLabel || "button"}</em>`}</span> <span class="ax1-acts" data-astro-cid-yjoymnrx><span class="ax1-act" aria-hidden="true" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}<span class="ax1-act-t" data-astro-cid-yjoymnrx><span class="ax1-t-edit" data-astro-cid-yjoymnrx>${dt("Edit")}</span><span class="ax1-t-close" data-astro-cid-yjoymnrx>${dt("Close")}</span></span></span><button type="submit"${addAttribute(`am-del-rr-${r.id}`, "form")} class="ax1-act ax1-act-del"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}</button></span> </span> <span class="ax1-chips" data-astro-cid-yjoymnrx> <span class="ax1-chip ax1-chip-accent" data-astro-cid-yjoymnrx>${r.interactionType}</span> <span class="ax1-chip" data-astro-cid-yjoymnrx>${r.mode === "add" ? dt("add only") : r.mode === "remove" ? dt("remove only") : r.mode}</span> ${r.channelId && renderTemplate`<a class="ax1-chip ax1-chip-link"${addAttribute(`https://discord.com/channels/${guildId}/${r.channelId}/${r.messageId}`, "href")} target="_blank" rel="noopener" onclick="event.stopPropagation()" data-astro-cid-yjoymnrx>${dt("Open message")}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-square-out-bold", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}</a>`} </span> </summary> <form method="POST" class="ax1-edit" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="edit_reactionrole" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(r.id, "value")} data-astro-cid-yjoymnrx> ${r.interactionType === "button" && r.channelId && renderTemplate`<a class="ax1-link"${addAttribute(`/dash/guild/${guildId}/reaction-role?message=${r.messageId}`, "href")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Edit the message in the builder")}</a>`} <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label${addAttribute(`ax1-rr-r-${r.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Role")}</label> <select${addAttribute(`ax1-rr-r-${r.id}`, "id")} name="role_id" required data-give-role data-astro-cid-yjoymnrx>${roles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")}${addAttribute(role.id === r.roleId, "selected")} data-astro-cid-yjoymnrx>${role.name}</option>`)}</select> </div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Mode")}</span> <div class="dfx-chips" role="radiogroup"${addAttribute(dt("Mode"), "aria-label")} data-astro-cid-yjoymnrx> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="mode" value="toggle"${addAttribute(r.mode === "toggle", "checked")} data-astro-cid-yjoymnrx>toggle</label> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="mode" value="add"${addAttribute(r.mode === "add", "checked")} data-astro-cid-yjoymnrx>${dt("add only")}</label> <label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="mode" value="remove"${addAttribute(r.mode === "remove", "checked")} data-astro-cid-yjoymnrx>${dt("remove only")}</label> </div> </div> ${r.interactionType === "button" && renderTemplate`<div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label${addAttribute(`ax1-rr-l-${r.id}`, "for")} data-astro-cid-yjoymnrx>${dt("Button label (optional)")}</label> <textarea class="dgl-autogrow sx-one" rows="1"${addAttribute(`ax1-rr-l-${r.id}`, "id")} name="button_label" data-one-line data-count maxlength="80" data-astro-cid-yjoymnrx>${r.buttonLabel ?? ""}</textarea> </div>`} </div> <div class="ax1-actions" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Save")}</button></div> </form> <form method="POST" class="ax1-hide"${addAttribute(`am-del-rr-${r.id}`, "id")} data-no-dirty data-astro-cid-yjoymnrx><input type="hidden" name="action" value="delete_reactionrole" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(r.id, "value")} data-astro-cid-yjoymnrx></form> </details>`;
  })} </div>`} </section> </div>`, selectedSection === "auto-threads" && renderTemplate`<div class="ax1-page ax1-split" data-section="auto-threads" data-astro-cid-yjoymnrx> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Channels"), value: autoThreads.length, tone: "messages" },
    { label: dt("Has a starter message"), value: ax1ThreadsMsg, tone: "joins" },
    autoThreads.length ? { label: dt("Longest archive time"), value: 0, text: formatDuration(Math.max(...autoThreads.map((t) => t.archiveMinutes)) * 60, { locale: dashLocale(dashLang), max: "w" }), tone: "voice" } : { label: dt("Longest archive time"), value: 0, text: "\u2014", tone: "voice" }
  ], "data-astro-cid-yjoymnrx": true })} <form method="POST" class="sx-panel ax1-form" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_autothread" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chats-circle-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true })}</span> <h2 data-astro-cid-yjoymnrx>${dt("New auto-thread")}</h2> </div> <p class="sx-lead" data-astro-cid-yjoymnrx>${selectedMeta.description}</p> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label for="ax1-at-channel" data-astro-cid-yjoymnrx>${dt("Channel")}</label> <select id="ax1-at-channel" name="channel_id" required data-astro-cid-yjoymnrx> <option value="" disabled selected data-astro-cid-yjoymnrx>${dt("Channel")}</option> ${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-yjoymnrx>#${c.name}</option>`)} </select> </div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label for="ax1-at-name" data-astro-cid-yjoymnrx>${dt("Thread name")}</label> <textarea class="dgl-autogrow sx-one" rows="1" id="ax1-at-name" name="name_template" data-one-line data-count maxlength="100"${addAttribute(dt("Thread name (default: {user_name})"), "placeholder")} data-astro-cid-yjoymnrx></textarea> </div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>${dt("Archive after")}</span> <div class="dfx-chips" role="radiogroup"${addAttribute(dt("Archive after"), "aria-label")} data-astro-cid-yjoymnrx> ${ax1Archive.map((minutes, i) => renderTemplate`<label class="dfx-chip" data-astro-cid-yjoymnrx><input type="radio" name="archive_minutes"${addAttribute(String(minutes), "value")}${addAttribute(i === 0, "checked")} data-astro-cid-yjoymnrx>${formatDuration(minutes * 60, { locale: dashLocale(dashLang), max: "w" })}</label>`)} </div> </div> <div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label for="ax1-at-text" data-astro-cid-yjoymnrx>${dt("Starter message")}</label> <textarea class="dgl-autogrow" rows="3" id="ax1-at-text" name="message_text" data-ac data-count${addAttribute(dt("Starter message inside the thread (optional, supports variables)"), "placeholder")} maxlength="500" data-astro-cid-yjoymnrx></textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-yjoymnrx": true })} ${renderComponent($$result2, "VariableHelp", $$VariableHelp, { "data-astro-cid-yjoymnrx": true })} </div> ${embedTemplateNames.length > 0 && renderTemplate`<div class="sx-field sx-wide" data-astro-cid-yjoymnrx><label for="ax1-at-tpl" data-astro-cid-yjoymnrx>${dt("Saved embed")}</label> <select id="ax1-at-tpl" name="embed_template" data-tpl-locks="message_text" data-astro-cid-yjoymnrx> <option value="" data-astro-cid-yjoymnrx>${dt("No template, use message text above")}</option> ${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")} data-astro-cid-yjoymnrx>${n}</option>`)} </select> </div>`} </div> <p class="sx-hint ax1-text" data-astro-cid-yjoymnrx>${dt("Starts a thread off every new message in the channel, good for support/showcase channels where each message deserves its own conversation.")}</p> <div class="sx-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${dt("Add")}</button></div> </form> <section class="ax1-list" data-astro-cid-yjoymnrx> <div class="ax1-list-head" data-astro-cid-yjoymnrx> <h2 data-astro-cid-yjoymnrx>${dt("Your auto-threads")}</h2> <span class="sx-tag" data-astro-cid-yjoymnrx>${autoThreads.length}</span> </div> ${autoThreads.length === 0 ? renderTemplate`<p class="ax1-empty" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chats-circle-fill", "width": "26", "height": "26", "data-astro-cid-yjoymnrx": true })}${dt("Nothing here yet. Add the first one above.")}</p>` : renderTemplate`<div class="ax1-cards dgl-stagger" data-astro-cid-yjoymnrx> ${autoThreads.map((at) => renderTemplate`<div class="ax1-card ax1-plain dgl-rc" data-astro-cid-yjoymnrx> <div class="ax1-card-head" data-astro-cid-yjoymnrx> <span class="ax1-card-main" data-astro-cid-yjoymnrx> <code class="ax1-key" data-astro-cid-yjoymnrx>#${channelName(at.channelId)}</code> <span class="ax1-chip"${addAttribute(dt("Archive after"), "title")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-fill", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}${formatDuration(at.archiveMinutes * 60, { locale: dashLocale(dashLang), max: "w" })}</span> </span> <span class="ax1-acts" data-astro-cid-yjoymnrx> <form method="POST" data-no-dirty data-astro-cid-yjoymnrx><input type="hidden" name="action" value="delete_autothread" data-astro-cid-yjoymnrx><input type="hidden" name="channel_id"${addAttribute(at.channelId, "value")} data-astro-cid-yjoymnrx> <button type="submit" class="ax1-act ax1-act-del"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}</button> </form> </span> </div> <span class="ax1-thread"${addAttribute(dt("Thread name"), "title")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chats-circle-fill", "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}<span data-astro-cid-yjoymnrx>${at.nameTemplate}</span></span> ${(at.messageText || at.embedTemplate) && renderTemplate`<span class="am-chat" data-astro-cid-yjoymnrx> <span class="am-msg" data-astro-cid-yjoymnrx> <img class="am-av" src="/assets/mascot-icon.webp" alt="" width="22" height="22" loading="lazy" decoding="async" data-astro-cid-yjoymnrx> <span class="am-msg-body" data-astro-cid-yjoymnrx><span class="am-msg-name am-msg-bot" data-astro-cid-yjoymnrx>Petto<span class="am-msg-tag" data-astro-cid-yjoymnrx>${dt("APP")}</span></span> ${at.embedTemplate ? renderTemplate`<span class="am-msg-embed" style="--ec:var(--border)" data-astro-cid-yjoymnrx><span class="am-msg-embed-title" data-astro-cid-yjoymnrx>${at.embedTemplate}</span></span>` : renderTemplate`<span class="am-msg-text am-msg-clamp"${addAttribute(at.messageText ?? "", "title")} data-astro-cid-yjoymnrx>${at.messageText}</span>`} </span> </span> </span>`} </div>`)} </div>`} </section> </div>`, selectedSection === "disabled-commands" && renderTemplate(_e || (_e = __template(['<div class="ax1-page" data-section="disabled-commands" data-astro-cid-yjoymnrx> ', ' <form method="POST" class="sx-panel ax1-form" data-no-dirty data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="add_disabled" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> </div> <p class="sx-lead" data-astro-cid-yjoymnrx>', '</p> <div class="sx-grid" data-astro-cid-yjoymnrx> <div class="sx-field" data-astro-cid-yjoymnrx><label for="ax1-dc-command" data-astro-cid-yjoymnrx>', '</label> <input type="text" id="ax1-dc-command" name="command" list="am-dc-commands"', ' maxlength="400" required autocomplete="off" data-count data-astro-cid-yjoymnrx> <datalist id="am-dc-commands" data-astro-cid-yjoymnrx>', '</datalist> </div> <div class="sx-field" data-astro-cid-yjoymnrx><span class="sx-label" data-astro-cid-yjoymnrx>', "</span> ", ' </div> </div> <p class="sx-hint ax1-text" data-astro-cid-yjoymnrx>', '</p> <div class="sx-foot" data-astro-cid-yjoymnrx><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-yjoymnrx>', "", '</button></div> </form> <section class="sx-panel ax1-dc-panel" data-astro-cid-yjoymnrx> <div class="sx-panel-head" data-astro-cid-yjoymnrx> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-yjoymnrx>', "</span> <h2 data-astro-cid-yjoymnrx>", '</h2> <span class="sx-tag" data-astro-cid-yjoymnrx>', '</span> </div> <details class="dfx-acc ax1-dc-fold"', ' data-astro-cid-yjoymnrx> <summary data-astro-cid-yjoymnrx> <span class="dfx-acc-title" data-astro-cid-yjoymnrx><b data-astro-cid-yjoymnrx>', "</b></span> ", ' </summary> <div class="dfx-acc-body" data-astro-cid-yjoymnrx> <div class="ax1-dc-cats" role="group"', " data-astro-cid-yjoymnrx> ", " </div> </div> </details> ", " ", ' <div class="ax1-dc-groups" data-astro-cid-yjoymnrx> ', ` </div> </section> <script>
      // A category tile shows only the disabled commands of that category (the list is all on the page); the same tile again shows all.
      if (!window.__ax1DcBound) {
        window.__ax1DcBound = true;
        document.addEventListener('click', function (e) {
          var tile = e.target && e.target.closest ? e.target.closest('[data-dc-cat]') : null;
          if (!tile) return;
          var section = tile.closest('[data-section="disabled-commands"]');
          if (!section) return;
          var on = tile.getAttribute('aria-pressed') !== 'true';
          var cat = on ? tile.getAttribute('data-dc-cat') : '';
          section.querySelectorAll('[data-dc-cat]').forEach(function (t) { t.setAttribute('aria-pressed', String(t === tile && on)); });
          var shown = 0;
          section.querySelectorAll('[data-dc-group]').forEach(function (group) {
            var any = false;
            group.querySelectorAll('[data-dc-chip]').forEach(function (chip) {
              var match = !cat || chip.getAttribute('data-dc-chip') === cat;
              chip.hidden = !match;
              if (match) any = true;
            });
            group.hidden = !any;
            if (any) shown++;
          });
          var none = section.querySelector('[data-dc-none]');
          if (none) none.hidden = shown > 0;
        });
      }
    <\/script> </div>`])), renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Disabled"), value: disabledCommands.length, tone: "leaves" },
    { label: dt("The whole server"), value: ax1DcServer, tone: "messages" },
    { label: dt("Channels"), value: new Set(disabledCommands.filter((d) => d.channelId).map((d) => d.channelId)).size, tone: "voice" }
  ], "data-astro-cid-yjoymnrx": true }), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true }), dt("Turn off commands"), selectedMeta.description, dt("Commands"), addAttribute(dt("Commands, like suggest, rank, 8ball"), "placeholder"), disableableCommands.map((name) => renderTemplate`<option${addAttribute(name, "value")} data-astro-cid-yjoymnrx></option>`), dt("Channels"), renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "channel_ids", "options": channelOptions, "source": "am-channels", "selected": [], "placeholder": dt("The whole server"), "data-astro-cid-yjoymnrx": true }), dt("Several at once, separated by commas or spaces; an alias is saved as its command. No channel: the whole server. The same as {a} in Discord.", { a: `${prefix}dc suggest,rank #channel` }), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true }), dt("Disable"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-dashes-fill", "width": "17", "height": "17", "data-astro-cid-yjoymnrx": true }), dt("Disabled now"), disabledCommands.length, addAttribute(disabledCommands.length > 0, "open"), dt("Commands by category"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down", "class": "dfx-caret", "width": "16", "height": "16", "data-astro-cid-yjoymnrx": true }), addAttribute(dt("Commands by category"), "aria-label"), dcCategories.map((c) => renderTemplate`${renderComponent($$result2, "DcTile", DcTile, { ...disabledCommands.length ? { type: "button", "data-dc-cat": c.id, "aria-pressed": "false", title: dt("Show only the disabled commands of {a}", { a: c.title }) } : { title: c.total === 1 ? dt("1 command") : dt("{a} commands", { a: c.total }) }, "class": "ax1-dc-cat", "data-astro-cid-yjoymnrx": true }, { "default": ($$result3) => renderTemplate` <span class="ax1-dc-icon" data-astro-cid-yjoymnrx>${renderComponent($$result3, "Icon", $$Icon, { "name": c.icon, "width": "14", "height": "14", "data-astro-cid-yjoymnrx": true })}</span> <span class="ax1-dc-name" data-astro-cid-yjoymnrx>${c.title}</span> <span class="ax1-dc-n" data-astro-cid-yjoymnrx>${c.total}</span> ${c.off > 0 && renderTemplate`<span class="ax1-dc-off" data-astro-cid-yjoymnrx>${dt("{a} disabled", { a: c.off })}</span>`}` })}`), disabledCommands.length === 0 && renderTemplate`<p class="ax1-empty" data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "26", "height": "26", "data-astro-cid-yjoymnrx": true })}${dt("No commands are disabled: everything works everywhere.")}</p>`, disabledCommands.length > 0 && renderTemplate`<p class="ax1-empty" data-dc-none hidden data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "26", "height": "26", "data-astro-cid-yjoymnrx": true })}${dt("No command of this category is disabled.")}</p>`, groupRules(disabledCommands).map((group) => renderTemplate`<div class="ax1-dc-group" data-dc-group data-astro-cid-yjoymnrx> <div class="ax1-dc-head" data-astro-cid-yjoymnrx> <span class="ax1-dc-place" data-astro-cid-yjoymnrx>${group.channelId ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-yjoymnrx": true }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:hash-bold", "width": "12", "height": "12", "data-astro-cid-yjoymnrx": true })}${channelName(group.channelId)}` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-yjoymnrx": true }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:globe-hemisphere-west-fill", "width": "13", "height": "13", "data-astro-cid-yjoymnrx": true })}${dt("The whole server")}` })}`}</span> <span class="ax1-chip" data-astro-cid-yjoymnrx>${group.rules.length === 1 ? dt("1 command") : dt("{a} commands", { a: group.rules.length })}</span> <form method="POST" class="ax1-dc-clear" data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="clear_disabled" data-astro-cid-yjoymnrx><input type="hidden" name="channel_id"${addAttribute(group.channelId ?? "server", "value")} data-astro-cid-yjoymnrx> <button type="submit" class="btn btn-ghost btn-sm"${addAttribute(dt("Turn every command of this place back on?"), "data-confirm")} data-astro-cid-yjoymnrx>${dt("Remove all")}</button> </form> </div> <div class="ax1-dc-chips" data-astro-cid-yjoymnrx> ${group.rules.map((d) => renderTemplate`<form method="POST" class="ax1-dc-chip"${addAttribute(dcCategoryOf.get(d.command.toLowerCase()) ?? "", "data-dc-chip")} data-astro-cid-yjoymnrx> <input type="hidden" name="action" value="delete_disabled" data-astro-cid-yjoymnrx><input type="hidden" name="id"${addAttribute(d.id, "value")} data-astro-cid-yjoymnrx> <code data-astro-cid-yjoymnrx>${prefix}${d.command}</code> <button type="submit" class="ax1-dc-x"${addAttribute(dt("Turn {a} back on", { a: `${prefix}${d.command}` }), "title")}${addAttribute(dt("Turn {a} back on", { a: `${prefix}${d.command}` }), "aria-label")} data-astro-cid-yjoymnrx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-bold", "width": "10", "height": "10", "data-astro-cid-yjoymnrx": true })}</button> </form>`)} </div> </div>`)), ["reaction-triggers", "starboard", "monkeyboard", "autoresponders", "voicemaster", "disabled-commands", "custom-commands"].includes(selectedSection) && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-yjoymnrx": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "MultiSelectOptions", $$MultiSelectOptions, { "name": "am-channels", "options": channelOptions, "data-astro-cid-yjoymnrx": true })} ${renderComponent($$result3, "MultiSelectOptions", $$MultiSelectOptions, { "name": "am-roles", "options": roleOptions, "data-astro-cid-yjoymnrx": true })} ` })}`, renderComponent($$result2, "EmojiPicker", $$EmojiPicker, { "customEmojis": customEmojis, "data-astro-cid-yjoymnrx": true }), defineScriptVars({ flNames: { interval_seconds: dt("Update every (seconds)") } })) })}    `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashAutomation.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Automation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Automation;
  const VOICE_OWNER_PERMISSIONS = ["manage_channels", "move_members", "manage_permissions", "mute_members", "deafen_members", "priority_speaker"];
  const dt = makeT(getDashLang(Astro2));
  const { id } = Astro2.params;
  const section = Astro2.url.searchParams.get("section") ?? "overview";
  if (section === "counters") return Astro2.redirect(`/dash/guild/${id}/counters`, Astro2.request.method === "GET" ? 302 : 303);
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  const premiumActive = await hasPremiumForGuild(Astro2, session.userId, id);
  const customCommandLimit = planLimits(premiumActive).customCommands;
  const responderLimit = planLimits(premiumActive).autoResponders;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  let saved = false;
  let reactionRoleError = null;
  let error = null;
  let notice = null;
  async function deleteDiscordMessage(channelId, messageId) {
    if (!channelId || !messageId) return true;
    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, { method: "DELETE", headers: { Authorization: `Bot ${botToken}` } });
    return res.ok || res.status === 404;
  }
  async function syncReactionRoleButtons(channelId, messageId) {
    const base = "https://discord.com/api/v10/channels/" + channelId + "/messages/" + messageId;
    const messageRes = await fetch(base, { headers: { Authorization: "Bot " + botToken } });
    if (!messageRes.ok) return { ok: false, message: dt("Couldn't fetch that message.") };
    const message = await messageRes.json();
    const foreignComponents = (message.components ?? []).some((row) => (row.components ?? []).some((component) => component.custom_id && !String(component.custom_id).startsWith("rr:")));
    if (foreignComponents) return { ok: false, message: dt("That message already has another component panel. Use a message without buttons or selects for button roles.") };
    const rowsUrl = apiUrl + "/rest/v1/reaction_roles?guild_id=eq." + id + "&message_id=eq." + encodeURIComponent(messageId) + "&interaction_type=eq.button&select=id,emoji,role_id,mode,button_label,button_style,button_row,button_position&order=id.asc";
    const rowsRes = await fetch(rowsUrl, { headers: apiHeaders });
    if (!rowsRes.ok) return { ok: false, message: dt("Couldn't read the button role configuration.") };
    const rows = await rowsRes.json();
    const built = buildRoleButtonComponents(rows, () => void 0);
    if ("reason" in built) return { ok: false, message: built.reason === "too_many_rows" ? dt("A message can have at most 5 rows of buttons.") : dt("A message can have at most 25 button roles.") };
    const components = built.components;
    const editRes = await fetch(base, {
      method: "PATCH",
      headers: { Authorization: "Bot " + botToken, "Content-Type": "application/json" },
      body: JSON.stringify({ components })
    });
    return editRes.ok ? { ok: true, message: "" } : { ok: false, message: dt("Couldn't update the message components.") };
  }
  async function postVoiceMasterPanel(channelId) {
    const emoji = {
      leave: { id: "1533576199354454197", name: "pe_leave" },
      decrease: { id: "1533576366174503085", name: "pe_Decrease" },
      increase: { id: "1533576368502341683", name: "pe_Increase" },
      lock: { id: "1533573937059987517", name: "pe_Lock" },
      noVisibility: { id: "1533574205986177126", name: "pe_Novisibility" },
      start: { id: "1533575715562192987", name: "pe_Start" },
      visibility: { id: "1533574204287484145", name: "pe_Visibility" },
      claim: { id: "1533574819084369931", name: "pe_claim" },
      delete: { id: "1533575163273023599", name: "pe_delete" },
      deny: { id: "1533574864198172772", name: "pe_deny" },
      edit: { id: "1533574936168501479", name: "pe_edit" },
      permit: { id: "1533574862436569228", name: "pe_permit" },
      info: { id: "1533575563225337866", name: "pe_info" },
      unlocked: { id: "1533573689461706914", name: "pe_unlocked" },
      reload: { id: "1533575051947802764", name: "pe_reload" }
    };
    const tag = (key) => `<:${emoji[key].name}:${emoji[key].id}>`;
    const payload = {
      flags: 1 << 15,
      components: [
        { type: 17, components: [
          { type: 10, content: ["## Voice Channel Panel", "-# Use the buttons below to manage your temporary voice channel."].join("\n") },
          { type: 14, divider: true, spacing: 1 },
          { type: 10, content: [
            `>>> ${tag("lock")} \xB7 **Lock** the voice channel`,
            `${tag("unlocked")} \xB7 **Unlock** the voice channel`,
            `${tag("noVisibility")} \xB7 **Ghost** (hide) the voice channel`,
            `${tag("visibility")} \xB7 **Reveal** the voice channel`,
            `${tag("claim")} \xB7 **Claim** an unowned channel`,
            `${tag("permit")} \xB7 **Permit** a member to join`,
            `${tag("deny")} \xB7 **Reject** a member from the channel`,
            `${tag("edit")} \xB7 **Rename** the voice channel`,
            `${tag("reload")} \xB7 **Transfer** channel ownership`,
            `${tag("delete")} \xB7 **Delete** your channel`,
            `${tag("leave")} \xB7 **Disconnect** a member`,
            `${tag("start")} \xB7 **Start** an activity`,
            `${tag("info")} \xB7 **View** channel info`,
            `${tag("increase")} \xB7 **Increase** the user limit`,
            `${tag("decrease")} \xB7 **Decrease** the user limit`
          ].join("\n") },
          { type: 14, divider: false, spacing: 1 },
          { type: 1, components: [
            { type: 2, custom_id: "vc:lock", style: 2, emoji: emoji.lock },
            { type: 2, custom_id: "vc:unlock", style: 2, emoji: emoji.unlocked },
            { type: 2, custom_id: "vc:ghost", style: 2, emoji: emoji.noVisibility },
            { type: 2, custom_id: "vc:reveal", style: 2, emoji: emoji.visibility },
            { type: 2, custom_id: "vc:claim", style: 2, emoji: emoji.claim }
          ] },
          { type: 1, components: [
            { type: 2, custom_id: "vc:permit", style: 2, emoji: emoji.permit },
            { type: 2, custom_id: "vc:reject", style: 2, emoji: emoji.deny },
            { type: 2, custom_id: "vc:rename", style: 2, emoji: emoji.edit },
            { type: 2, custom_id: "vc:transfer", style: 2, emoji: emoji.reload },
            { type: 2, custom_id: "vc:delete", style: 4, emoji: emoji.delete }
          ] },
          { type: 1, components: [
            { type: 2, custom_id: "vc:disconnect", style: 2, emoji: emoji.leave },
            { type: 2, custom_id: "vc:activity", style: 2, emoji: emoji.start },
            { type: 2, custom_id: "vc:info", style: 2, emoji: emoji.info },
            { type: 2, custom_id: "vc:limit_up", style: 2, emoji: emoji.increase },
            { type: 2, custom_id: "vc:limit_down", style: 2, emoji: emoji.decrease }
          ] }
        ] }
      ]
    };
    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, { method: "POST", headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) return null;
    const message = await res.json();
    return String(message.id ?? "");
  }
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    if (action === "add_command") {
      const name = String(form.get("name") ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 32);
      const response = String(form.get("response") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 500) || null;
      const embedTemplate = String(form.get("embed_template") ?? "").trim() || null;
      if (name && (response || embedTemplate)) {
        const countRes = await fetch(`${apiUrl}/rest/v1/custom_commands?guild_id=eq.${id}&select=id`, { headers: apiHeaders });
        const current = countRes.ok ? await countRes.json() : null;
        if (!current) {
          error = dt("Couldn't check the custom command limit, try again.");
        } else if (current.length >= customCommandLimit) {
          error = premiumActive ? dt("You have reached the {n} custom command limit.", { n: customCommandLimit }) : dt("The Free plan includes {a} custom commands. Premium unlocks up to {b}.", { a: FREE_LIMITS.customCommands, b: PREMIUM_LIMITS.customCommands });
        } else {
          const res = await fetch(`${apiUrl}/rest/v1/custom_commands?on_conflict=guild_id,name`, {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
            // Where it works (channels and roles allowed or blocked, NSFW, restricted) is only written when the form asked for something.
            body: JSON.stringify({ guild_id: id, name, response, embed_template: embedTemplate, ...isScoped(scopeFromForm(form)) ? { options: withScope(null, scopeFromForm(form)) } : {} })
          });
          if (res.ok) saved = true;
          else error = dt("Couldn't save that custom command, try again.");
        }
      } else {
        error = dt("Write a name, and a response or choose a template.");
      }
    } else if (action === "command_scope") {
      const commandId = encodeURIComponent(String(form.get("id") ?? ""));
      const currentRes = await fetch(`${apiUrl}/rest/v1/custom_commands?id=eq.${commandId}&guild_id=eq.${id}&select=options`, { headers: apiHeaders });
      const current = currentRes.ok ? await currentRes.json() : null;
      if (!Array.isArray(current) || current.length === 0) {
        error = dt("Couldn't save that custom command, try again.");
      } else {
        const res = await fetch(`${apiUrl}/rest/v1/custom_commands?id=eq.${commandId}&guild_id=eq.${id}`, {
          method: "PATCH",
          headers: { ...apiHeaders, Prefer: "return=minimal" },
          body: JSON.stringify({ options: withScope(current[0].options, scopeFromForm(form)) })
        });
        if (res.ok) saved = true;
        else error = dt("Couldn't save that custom command, try again.");
      }
    } else if (action === "delete_command") {
      await fetch(`${apiUrl}/rest/v1/custom_commands?id=eq.${encodeURIComponent(String(form.get("id") ?? ""))}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else if (action === "add_responder") {
      const trigger = String(form.get("trigger") ?? "").trim().slice(0, 80);
      const reply = String(form.get("reply") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 500);
      const matchMode = String(form.get("match_mode") ?? "contains");
      const deleteTrigger = form.get("delete_trigger") === "on";
      const replyToTrigger = form.get("reply_to_trigger") === "on";
      const pingUser = form.get("ping_user") === "on";
      const deletePrevious = form.get("delete_previous") === "on";
      const channelIds = form.getAll("channel_ids").map(String);
      const roleIds = form.getAll("role_ids").map(String);
      const replyType = String(form.get("reply_type") ?? "text");
      const embedColorRaw = String(form.get("embed_color") ?? "").trim().replace("#", "");
      const embedColor = /^[0-9a-fA-F]{6}$/.test(embedColorRaw) ? parseInt(embedColorRaw, 16) : null;
      const embedTitle = String(form.get("embed_title") ?? "").trim().slice(0, 100) || null;
      const embedFooter = String(form.get("embed_footer") ?? "").trim().slice(0, 100) || null;
      const embedTemplate = String(form.get("embed_template") ?? "").trim() || null;
      if (trigger && (reply || embedTemplate)) {
        const countRes = await fetch(`${apiUrl}/rest/v1/auto_responders?guild_id=eq.${id}&select=id`, { headers: apiHeaders });
        const current = countRes.ok ? await countRes.json() : null;
        if (!current) {
          error = dt("Couldn't check the autoresponder limit, try again.");
        } else if (current.length >= responderLimit) {
          error = premiumActive ? dt("You have reached the {n} autoresponder limit.", { n: responderLimit }) : dt("The Free plan includes {a} autoresponders. Premium unlocks up to {b}.", { a: FREE_LIMITS.autoResponders, b: PREMIUM_LIMITS.autoResponders });
        } else {
          const res = await fetch(`${apiUrl}/rest/v1/auto_responders`, {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "return=minimal" },
            body: JSON.stringify({
              guild_id: id,
              ar_id: crypto.randomUUID().slice(0, 8),
              trigger,
              reply,
              match_mode: matchMode,
              delete_trigger: deleteTrigger,
              reply_to_trigger: replyToTrigger,
              ping_user: pingUser,
              // Only sent when on: a server whose database does not have the column yet can still save its autoresponders.
              ...deletePrevious ? { delete_previous: true } : {},
              channel_ids: channelIds,
              role_ids: roleIds,
              reply_type: replyType,
              embed_color: embedColor,
              embed_title: embedTitle,
              embed_footer: embedFooter,
              embed_template: embedTemplate
            })
          });
          if (res.ok) saved = true;
          else error = dt("Couldn't save that autoresponder, try again.");
        }
      }
    } else if (action === "edit_responder") {
      const arId = String(form.get("ar_id") ?? "");
      const trigger = String(form.get("trigger") ?? "").trim().slice(0, 80);
      const reply = String(form.get("reply") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 500);
      const matchMode = String(form.get("match_mode") ?? "contains");
      const deleteTrigger = form.get("delete_trigger") === "on";
      const replyToTrigger = form.get("reply_to_trigger") === "on";
      const pingUser = form.get("ping_user") === "on";
      const deletePrevious = form.get("delete_previous") === "on";
      const channelIds = form.getAll("channel_ids").map(String);
      const roleIds = form.getAll("role_ids").map(String);
      const replyType = String(form.get("reply_type") ?? "text");
      const embedColorRaw = String(form.get("embed_color") ?? "").trim().replace("#", "");
      const embedColor = /^[0-9a-fA-F]{6}$/.test(embedColorRaw) ? parseInt(embedColorRaw, 16) : null;
      const embedTitle = String(form.get("embed_title") ?? "").trim().slice(0, 100) || null;
      const embedFooter = String(form.get("embed_footer") ?? "").trim().slice(0, 100) || null;
      const embedTemplate = String(form.get("embed_template") ?? "").trim() || null;
      if (arId && trigger && (reply || embedTemplate)) {
        const patch = {
          trigger,
          reply,
          match_mode: matchMode,
          delete_trigger: deleteTrigger,
          reply_to_trigger: replyToTrigger,
          ping_user: pingUser,
          channel_ids: channelIds,
          role_ids: roleIds,
          reply_type: replyType,
          embed_color: embedColor,
          embed_title: embedTitle,
          embed_footer: embedFooter,
          embed_template: embedTemplate
        };
        const patchUrl = `${apiUrl}/rest/v1/auto_responders?ar_id=eq.${encodeURIComponent(arId)}&guild_id=eq.${id}`;
        const send = (body) => fetch(patchUrl, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(body) });
        let res = await send({ ...patch, delete_previous: deletePrevious });
        if (!res.ok) res = await send(patch);
        saved = res.ok;
      }
    } else if (action === "delete_responder") {
      await fetch(`${apiUrl}/rest/v1/auto_responders?ar_id=eq.${encodeURIComponent(String(form.get("ar_id") ?? ""))}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else if (action === "add_sticky") {
      const channelId = String(form.get("channel_id") ?? "");
      const content = String(form.get("content") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 500).replaceAll("{newline}", "\n").replaceAll("{separator}", "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
      const template = String(form.get("embed_template") ?? "").trim().slice(0, 100);
      if (channelId && (content || template)) {
        const res = await fetch(`${apiUrl}/rest/v1/sticky_messages?on_conflict=guild_id,channel_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, channel_id: channelId, content, embed_template: template || null })
        });
        const oldChannelId = String(form.get("old_channel_id") ?? "");
        if (res.ok && /^\d{15,25}$/.test(oldChannelId) && oldChannelId !== channelId) {
          await fetch(`${apiUrl}/rest/v1/sticky_messages?channel_id=eq.${encodeURIComponent(oldChannelId)}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
        }
        if (res.ok) {
          const { sharedPublish } = await import('../../../../chunks/sharedCache_DFk4ml3Q.mjs');
          await sharedPublish("petto:sticky", JSON.stringify({ guildId: id, channelId })).catch(() => {
          });
        }
        saved = res.ok;
      }
    } else if (action === "delete_sticky") {
      await fetch(`${apiUrl}/rest/v1/sticky_messages?channel_id=eq.${encodeURIComponent(String(form.get("channel_id") ?? ""))}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else if (action === "add_reactionrole") {
      const channelId = String(form.get("channel_id") ?? "");
      let messageId = String(form.get("message_id") ?? "").trim();
      const embedName = String(form.get("embed_template") ?? "").trim();
      const emoji = String(form.get("emoji") ?? "").trim().slice(0, 100);
      const roleId = String(form.get("role_id") ?? "");
      const mode = String(form.get("mode") ?? "toggle");
      let interactionType = String(form.get("interaction_type") ?? "reaction") === "button" ? "button" : "reaction";
      const buttonLabel = String(form.get("button_label") ?? "").trim().slice(0, 80) || null;
      let createdMessage = false;
      if (channelId && !messageId && embedName) {
        const templateRes = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(embedName)}&select=data`, { headers: apiHeaders });
        const row = templateRes.ok ? (await templateRes.json())[0] : null;
        const checked = row ? validateTemplate(row.data) : null;
        if (!checked || !checked.ok) reactionRoleError = dt("That saved embed was not found.");
        else if (checked.data.v2) reactionRoleError = dt("A V2 design cannot hold role buttons. Pick a classic embed.");
        else {
          const details = await getGuildDetails(id, botToken);
          const message = buildDiscordMessage(checked.data, {
            userId: String(session.userId),
            userName: String(session.username ?? "you"),
            serverName: details?.name ?? "this server",
            memberCount: details?.approximate_member_count ?? null
          }, { userAvatar: session.avatar ?? null, serverIcon: details?.icon ? `https://cdn.discordapp.com/icons/${id}/${details.icon}.png?size=256` : null });
          const sendRes = await fetch(`https://discord.com/api/v10/channels/${encodeURIComponent(channelId)}/messages`, { method: "POST", headers: { Authorization: "Bot " + botToken, "Content-Type": "application/json" }, body: JSON.stringify({ content: message.content, embeds: message.embeds, allowed_mentions: { parse: [] } }) });
          if (!sendRes.ok) reactionRoleError = dt("Petto couldn't post the message there. Check the channel and its permissions.");
          else {
            messageId = String((await sendRes.json()).id);
            createdMessage = true;
            interactionType = "button";
          }
        }
      } else if (channelId && !messageId) reactionRoleError = dt("Type a message ID or pick a saved embed.");
      if (!reactionRoleError && channelId && messageId && emoji && roleId) {
        if (interactionType === "reaction") {
          const customMatch = emoji.match(/^<a?:(\w+):(\d+)>$/);
          const reactionParam = customMatch ? customMatch[1] + ":" + customMatch[2] : emoji;
          const reactUrl = "https://discord.com/api/v10/channels/" + channelId + "/messages/" + messageId + "/reactions/" + encodeURIComponent(reactionParam) + "/@me";
          const reactRes = await fetch(reactUrl, { method: "PUT", headers: { Authorization: "Bot " + botToken } });
          if (!reactRes.ok) reactionRoleError = dt("Couldn't react to that message, check the channel, message ID, and emoji.");
        }
        if (!reactionRoleError) {
          const insertRes = await fetch(apiUrl + "/rest/v1/reaction_roles?on_conflict=message_id,emoji", {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify({ guild_id: id, channel_id: channelId, message_id: messageId, emoji, role_id: roleId, mode, interaction_type: interactionType, button_label: interactionType === "button" ? buttonLabel : null })
          });
          if (!insertRes.ok) reactionRoleError = dt("Couldn't save that role binding.");
          else if (interactionType === "button") {
            const sync = await syncReactionRoleButtons(channelId, messageId);
            if (!sync.ok) reactionRoleError = sync.message;
          }
          saved = !reactionRoleError;
        }
        if (reactionRoleError && createdMessage) await deleteDiscordMessage(channelId, messageId);
      } else if (!reactionRoleError && createdMessage) await deleteDiscordMessage(channelId, messageId);
    } else if (action === "edit_reactionrole") {
      const roleBindingId = String(form.get("id") ?? "");
      const roleId = String(form.get("role_id") ?? "").trim();
      const mode = ["toggle", "add", "remove"].includes(String(form.get("mode"))) ? String(form.get("mode")) : "toggle";
      const buttonLabel = String(form.get("button_label") ?? "").trim().slice(0, 80) || null;
      const oldRes = await fetch(apiUrl + "/rest/v1/reaction_roles?id=eq." + encodeURIComponent(roleBindingId) + "&guild_id=eq." + id + "&select=channel_id,message_id,interaction_type", { headers: apiHeaders });
      const oldRows = oldRes.ok ? await oldRes.json() : [];
      if (roleId && oldRows[0]) {
        const patchRes = await fetch(apiUrl + "/rest/v1/reaction_roles?id=eq." + encodeURIComponent(roleBindingId) + "&guild_id=eq." + id, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ role_id: roleId, mode, button_label: buttonLabel }) });
        if (!patchRes.ok) reactionRoleError = dt("Couldn't save that role binding.");
        else if (oldRows[0].interaction_type === "button") {
          const sync = await syncReactionRoleButtons(oldRows[0].channel_id, oldRows[0].message_id);
          if (!sync.ok) reactionRoleError = sync.message;
        }
        saved = patchRes.ok && !reactionRoleError;
      }
    } else if (action === "delete_reactionrole") {
      const roleBindingId = String(form.get("id") ?? "");
      const oldUrl = apiUrl + "/rest/v1/reaction_roles?id=eq." + encodeURIComponent(roleBindingId) + "&guild_id=eq." + id + "&select=channel_id,message_id,interaction_type";
      const oldRes = await fetch(oldUrl, { headers: apiHeaders });
      const oldRows = oldRes.ok ? await oldRes.json() : [];
      const deleteUrl = apiUrl + "/rest/v1/reaction_roles?id=eq." + encodeURIComponent(roleBindingId) + "&guild_id=eq." + id;
      const deleteRes = await fetch(deleteUrl, { method: "DELETE", headers: apiHeaders });
      if (deleteRes.ok && oldRows[0]?.interaction_type === "button") {
        const sync = await syncReactionRoleButtons(oldRows[0].channel_id, oldRows[0].message_id);
        if (!sync.ok) reactionRoleError = sync.message;
      }
      saved = deleteRes.ok && !reactionRoleError;
    } else if (action === "add_reaction_trigger") {
      const emoji = String(form.get("emoji") ?? "").trim().slice(0, 100);
      const trigger = String(form.get("trigger") ?? "").trim().replace(/\s+/g, " ").toLowerCase().slice(0, 80);
      const matchMode = String(form.get("match_mode") ?? "contains");
      const channelIds = form.getAll("trigger_channel_ids").map(String);
      const roleIds = form.getAll("trigger_role_ids").map(String);
      const cooldownSeconds = Math.max(0, Math.min(86400, Number(form.get("cooldown_seconds") ?? 0) || 0));
      const common = /* @__PURE__ */ new Set(["a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do", "for", "from", "get", "go", "have", "he", "hey", "hi", "i", "if", "in", "is", "it", "me", "my", "no", "of", "on", "or", "our", "so", "that", "the", "this", "to", "was", "we", "what", "when", "where", "who", "why", "will", "with", "you", "your"]);
      if (emoji && trigger.length >= 2 && !common.has(trigger)) {
        const res = await fetch(`${apiUrl}/rest/v1/reaction_triggers?on_conflict=guild_id,emoji,trigger`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, emoji, trigger, owner_id: session.userId, match_mode: matchMode, channel_ids: channelIds, role_ids: roleIds, case_sensitive: form.get("case_sensitive") === "on", cooldown_seconds: cooldownSeconds }) });
        saved = res.ok;
        if (!res.ok) error = dt("That emoji and trigger may already be configured.");
      } else {
        error = dt("Use an emoji and a specific trigger phrase (common one-word triggers are blocked).");
      }
    } else if (action === "delete_reaction_trigger") {
      await fetch(`${apiUrl}/rest/v1/reaction_triggers?id=eq.${encodeURIComponent(String(form.get("id") ?? ""))}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else if (action === "reset_reaction_triggers") {
      await fetch(`${apiUrl}/rest/v1/reaction_triggers?guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else if (action === "edit_reaction_trigger") {
      const triggerId = String(form.get("id") ?? "").trim();
      const channelIds = form.getAll("trigger_channel_ids").map(String);
      const roleIds = form.getAll("trigger_role_ids").map(String);
      const patch = { match_mode: String(form.get("match_mode") ?? "contains"), channel_ids: channelIds, role_ids: roleIds, case_sensitive: form.get("case_sensitive") === "on", cooldown_seconds: Math.max(0, Math.min(86400, Number(form.get("cooldown_seconds") ?? 0) || 0)), enabled: form.get("enabled") === "on" };
      const res = await fetch(`${apiUrl}/rest/v1/reaction_triggers?id=eq.${encodeURIComponent(triggerId)}&guild_id=eq.${id}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(patch) });
      saved = res.ok;
    } else if (action === "save_reaction_messages") {
      const channelId = String(form.get("channel_id") ?? "").trim();
      const emojis = [...new Set(form.getAll("emojis").map(String).map((value) => value.trim()).filter(Boolean))].slice(0, 5);
      if (channelId) {
        const res = emojis.length ? await fetch(`${apiUrl}/rest/v1/reaction_message_configs?on_conflict=guild_id,channel_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, channel_id: channelId, emojis }) }) : await fetch(`${apiUrl}/rest/v1/reaction_message_configs?guild_id=eq.${id}&channel_id=eq.${encodeURIComponent(channelId)}`, { method: "DELETE", headers: apiHeaders });
        saved = res.ok;
      }
    } else if (action === "delete_reaction_messages") {
      await fetch(`${apiUrl}/rest/v1/reaction_message_configs?guild_id=eq.${id}&channel_id=eq.${encodeURIComponent(String(form.get("channel_id") ?? ""))}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else if (action === "create_webhook") {
      const channelId = String(form.get("channel_id") ?? "").trim();
      const name = String(form.get("name") ?? "").trim().slice(0, 80);
      const defaultUsername = String(form.get("default_username") ?? "").trim().slice(0, 80) || null;
      const defaultAvatarUrl = String(form.get("default_avatar_url") ?? "").trim() || null;
      const defaultMessage = String(form.get("default_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2e3) || null;
      if (channelId && name) {
        const createRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/webhooks`, { method: "POST", headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
        if (createRes.ok) {
          const webhook = await createRes.json();
          const dbRes = await fetch(`${apiUrl}/rest/v1/managed_webhooks`, { method: "POST", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ guild_id: id, channel_id: channelId, webhook_id: webhook.id, webhook_token: webhook.token, name: webhook.name ?? name, created_by: session.userId, default_username: defaultUsername, default_avatar_url: defaultAvatarUrl, default_message: defaultMessage }) });
          saved = dbRes.ok;
        } else error = dt("Could not create the webhook. Check Manage Webhooks in that channel.");
      }
    } else if (action === "send_webhook") {
      const localId = String(form.get("webhook_id") ?? "").trim();
      const mode = ["design", "edit"].includes(String(form.get("send_mode"))) ? String(form.get("send_mode")) : "text";
      const message = String(form.get("message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2e3);
      const username = String(form.get("username") ?? "").trim().slice(0, 80) || void 0;
      const avatarUrl = String(form.get("avatar_url") ?? "").trim() || void 0;
      const embedTitle = String(form.get("embed_title") ?? "").trim().slice(0, 256) || void 0;
      const embedDescription = String(form.get("embed_description") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 4096) || void 0;
      const embedColor = String(form.get("embed_color") ?? "").trim().replace("#", "");
      const link = (name) => {
        const value = String(form.get(name) ?? "").trim();
        return /^https?:\/\/\S+$/i.test(value) ? value : void 0;
      };
      const embedImage = link("embed_image");
      const embedThumbnail = link("embed_thumbnail");
      const embedUrl = link("embed_url");
      const embedFooter = String(form.get("embed_footer") ?? "").trim().slice(0, 2048) || void 0;
      const threadId = /^\d{15,22}$/.test(String(form.get("thread_id") ?? "").trim()) ? String(form.get("thread_id")).trim() : "";
      const threadName = String(form.get("thread_name") ?? "").trim().slice(0, 100);
      const editId = /^\d{15,22}$/.test(String(form.get("edit_message_id") ?? "").trim()) ? String(form.get("edit_message_id")).trim() : "";
      const silent = form.get("silent") === "on";
      const allowPings = form.get("allow_pings") === "on";
      const designName = String(form.get("send_design") ?? "").trim();
      const rowRes = await fetch(`${apiUrl}/rest/v1/managed_webhooks?id=eq.${encodeURIComponent(localId)}&guild_id=eq.${id}&select=webhook_id,webhook_token,default_message,default_username,default_avatar_url,default_embed`, { headers: apiHeaders });
      const [row] = rowRes.ok ? await rowRes.json() : [];
      let body = null;
      let withComponents = false;
      if (!row) error = dt("That webhook was not found.");
      else if (designName) {
        const templateRes = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(designName)}&select=data`, { headers: apiHeaders });
        const templateRow = templateRes.ok ? (await templateRes.json())[0] : null;
        const checked = templateRow ? validateTemplate(templateRow.data) : null;
        if (!checked || !checked.ok) error = dt("That saved embed was not found.");
        else {
          const details = await getGuildDetails(id, botToken);
          const built = buildDiscordMessage(checked.data, {
            userId: String(session.userId),
            userName: String(session.username ?? "you"),
            serverName: details?.name ?? "this server",
            memberCount: details?.approximate_member_count ?? null
          }, { userAvatar: session.avatar ?? null, serverIcon: details?.icon ? `https://cdn.discordapp.com/icons/${id}/${details.icon}.png?size=256` : null });
          body = { ...built };
          withComponents = Boolean(checked.data.v2);
          if (!withComponents) body.components = void 0;
        }
      } else {
        const hasEmbed = embedTitle || embedDescription || embedImage || embedThumbnail || embedFooter;
        const embed = hasEmbed ? {
          ...embedTitle ? { title: embedTitle } : {},
          ...embedDescription ? { description: embedDescription } : {},
          ...embedUrl ? { url: embedUrl } : {},
          .../^[0-9a-fA-F]{6}$/.test(embedColor) ? { color: parseInt(embedColor, 16) } : {},
          ...embedImage ? { image: { url: embedImage } } : {},
          ...embedThumbnail ? { thumbnail: { url: embedThumbnail } } : {},
          ...embedFooter ? { footer: { text: embedFooter } } : {}
        } : mode === "edit" ? void 0 : row.default_embed;
        if (message || mode !== "edit" && row.default_message || embed) body = { content: message || (mode === "edit" ? void 0 : row.default_message) || void 0, embeds: embed ? [embed] : void 0 };
        else error = dt("Write a message or an embed first.");
      }
      if (body) {
        const flags = (withComponents ? 32768 : 0) | (silent ? 4096 : 0);
        const payload = {
          ...body,
          ...flags ? { flags } : {},
          allowed_mentions: allowPings ? void 0 : { parse: [] }
        };
        if (mode !== "edit") {
          payload.username = username || row.default_username || void 0;
          payload.avatar_url = avatarUrl || row.default_avatar_url || void 0;
          if (threadName && !threadId) payload.thread_name = threadName;
        }
        const base = `https://discord.com/api/v10/webhooks/${row.webhook_id}/${row.webhook_token}`;
        const query = new URLSearchParams({ wait: "true" });
        if (withComponents) query.set("with_components", "true");
        if (threadId) query.set("thread_id", threadId);
        const sendRes = mode === "edit" && editId ? await fetch(`${base}/messages/${editId}?${query}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }) : mode === "edit" ? null : await fetch(`${base}?${query}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!sendRes) error = dt("Write the ID of the message to edit.");
        else if (!sendRes.ok) error = dt("Discord did not accept the message. Check the thread ID, the message ID and that the design fits.");
        saved = Boolean(sendRes?.ok);
      }
    } else if (action === "edit_webhook") {
      const localId = String(form.get("id") ?? "").trim();
      const patch = { name: String(form.get("name") ?? "").trim().slice(0, 80), default_username: String(form.get("default_username") ?? "").trim().slice(0, 80) || null, default_avatar_url: String(form.get("default_avatar_url") ?? "").trim() || null, default_message: String(form.get("default_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2e3) || null, enabled: form.get("enabled") === "on" };
      const res = await fetch(`${apiUrl}/rest/v1/managed_webhooks?id=eq.${encodeURIComponent(localId)}&guild_id=eq.${id}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(patch) });
      saved = res.ok;
    } else if (action === "duplicate_webhook") {
      const localId = String(form.get("id") ?? "").trim();
      const rowRes = await fetch(`${apiUrl}/rest/v1/managed_webhooks?id=eq.${encodeURIComponent(localId)}&guild_id=eq.${id}&select=*`, { headers: apiHeaders });
      const [row] = rowRes.ok ? await rowRes.json() : [];
      if (row) {
        const createRes = await fetch(`https://discord.com/api/v10/channels/${row.channel_id}/webhooks`, { method: "POST", headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ name: `${row.name} copy`.slice(0, 80) }) });
        if (createRes.ok) {
          const webhook = await createRes.json();
          const dbRes = await fetch(`${apiUrl}/rest/v1/managed_webhooks`, { method: "POST", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ guild_id: id, channel_id: row.channel_id, webhook_id: webhook.id, webhook_token: webhook.token, name: webhook.name, created_by: session.userId, default_username: row.default_username, default_avatar_url: row.default_avatar_url, default_message: row.default_message, default_embed: row.default_embed }) });
          saved = dbRes.ok;
        }
      }
    } else if (action === "delete_webhook") {
      const localId = String(form.get("id") ?? "").trim();
      const rowRes = await fetch(`${apiUrl}/rest/v1/managed_webhooks?id=eq.${encodeURIComponent(localId)}&guild_id=eq.${id}&select=webhook_id,webhook_token`, { headers: apiHeaders });
      const [row] = rowRes.ok ? await rowRes.json() : [];
      if (row) await fetch(`https://discord.com/api/v10/webhooks/${row.webhook_id}/${row.webhook_token}`, { method: "DELETE" }).catch(() => {
      });
      const dbRes = await fetch(`${apiUrl}/rest/v1/managed_webhooks?id=eq.${encodeURIComponent(localId)}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = dbRes.ok;
    } else if (action === "add_disabled") {
      const { names, unknown, refused } = readCommandNames(String(form.get("command") ?? ""));
      const channelIds = [...new Set(form.getAll("channel_ids").map(String).filter((c) => /^\d{15,25}$/.test(c)))];
      const problems = [];
      if (unknown.length) problems.push(dt("Petto has no command called {a}.", { a: unknown.join(", ") }));
      if (refused.length) problems.push(dt("{a} always stay on, or nobody could turn anything back on.", { a: refused.join(", ") }));
      if (!names.length && !problems.length) problems.push(dt("Write at least one command."));
      if (names.length > MAX_COMMANDS_AT_ONCE) problems.push(dt("Up to {a} commands at a time.", { a: MAX_COMMANDS_AT_ONCE }));
      else if (channelIds.length > MAX_CHANNELS_AT_ONCE) problems.push(dt("Up to {a} channels at a time.", { a: MAX_CHANNELS_AT_ONCE }));
      else if (names.length) {
        const places = channelIds.length ? channelIds : [null];
        const existingRes = await fetch(`${apiUrl}/rest/v1/disabled_commands?guild_id=eq.${id}&select=command,channel_id`, { headers: apiHeaders });
        const existing = existingRes.ok ? await existingRes.json() : [];
        const have = new Set(existing.map((r) => `${r.command}|${r.channel_id ?? ""}`));
        const rows = names.flatMap((command) => places.filter((channelId) => !have.has(`${command}|${channelId ?? ""}`)).map((channelId) => ({ guild_id: id, command, channel_id: channelId })));
        if (rows.length) {
          const res = await fetch(`${apiUrl}/rest/v1/disabled_commands`, { method: "POST", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(rows) });
          if (res.ok) saved = true;
          else problems.push(dt("It could not be saved, try again."));
        } else saved = true;
      }
      if (problems.length) error = problems.join(" ");
    } else if (action === "delete_disabled") {
      await fetch(`${apiUrl}/rest/v1/disabled_commands?id=eq.${encodeURIComponent(String(form.get("id") ?? ""))}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else if (action === "clear_disabled") {
      const place = String(form.get("channel_id") ?? "");
      const filter = place === "server" ? "channel_id=is.null" : /^\d{15,25}$/.test(place) ? `channel_id=eq.${place}` : null;
      if (filter) {
        const res = await fetch(`${apiUrl}/rest/v1/disabled_commands?guild_id=eq.${id}&${filter}`, { method: "DELETE", headers: apiHeaders });
        saved = res.ok;
        if (!res.ok) error = dt("It could not be saved, try again.");
      }
    } else if (action === "add_autothread") {
      const channelId = String(form.get("channel_id") ?? "").trim();
      const nameTemplate = String(form.get("name_template") ?? "").trim().slice(0, 100) || "{user_name}";
      const messageText = String(form.get("message_text") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 500) || null;
      const embedTemplate = String(form.get("embed_template") ?? "").trim() || null;
      const archiveMinutes = Number(form.get("archive_minutes")) || 60;
      if (channelId) {
        await fetch(`${apiUrl}/rest/v1/auto_threads?on_conflict=guild_id,channel_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, channel_id: channelId, name_template: nameTemplate, message_text: messageText, embed_template: embedTemplate, archive_minutes: archiveMinutes })
        });
        saved = true;
      }
    } else if (action === "delete_autothread") {
      await fetch(`${apiUrl}/rest/v1/auto_threads?guild_id=eq.${id}&channel_id=eq.${encodeURIComponent(String(form.get("channel_id") ?? ""))}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else if (action === "add_alias") {
      const name = String(form.get("name") ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 32);
      const command = String(form.get("command") ?? "").trim().slice(0, 500);
      if (name && command && !["alias", "timer", "starboard", "voicemaster"].includes(name)) {
        const res = await fetch(`${apiUrl}/rest/v1/command_aliases?on_conflict=guild_id,name`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, name, command }) });
        saved = res.ok;
      }
    } else if (action === "delete_alias") {
      const name = encodeURIComponent(String(form.get("name") ?? ""));
      const res = await fetch(`${apiUrl}/rest/v1/command_aliases?guild_id=eq.${id}&name=eq.${name}`, { method: "DELETE", headers: apiHeaders });
      saved = res.ok;
    } else if (action === "add_timer") {
      const channelId = String(form.get("channel_id") ?? "").trim();
      const intervalMs = timerIntervalMs(form);
      const message = String(form.get("message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2e3);
      const deletePrevious = form.get("delete_previous") === "on";
      const embedTemplate = String(form.get("embed_template") ?? "").trim() || null;
      const scheduled = timerScheduleFields(form);
      if (scheduled && "error" in scheduled) error = dt("Write the time as HH:MM and choose a valid time zone (e.g. America/Bogota or UTC-5).");
      else if (channelId && (message || embedTemplate)) {
        const timing = scheduled ?? { interval_ms: intervalMs, next_run_at: new Date(Date.now() + intervalMs).toISOString() };
        const res = await fetch(`${apiUrl}/rest/v1/auto_messages`, { method: "POST", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ guild_id: id, channel_id: channelId, message, ...deletePrevious ? { delete_previous: true } : {}, ...embedTemplate ? { embed_template: embedTemplate } : {}, ...timing }) });
        saved = res.ok;
        if (!res.ok) error = scheduled && res.status !== 409 ? dt("The bot could not save the schedule. It may need to be updated first.") : dt("That channel may already have a timer.");
      }
    } else if (action === "run_timer") {
      const result = await callPettoTimerRun(Astro2, id, String(session.userId), String(form.get("id") ?? ""), getDashLang(Astro2));
      if (result.ok) notice = result.message || dt("Sent.");
      else error = result.message || (result.down ? dt("Petto is not answering. It may be restarting after an update. Try again in a few seconds.") : dt("The bot could not send the timer. It may need to be updated first."));
    } else if (action === "edit_timer") {
      const intervalMs = timerIntervalMs(form);
      const message = String(form.get("message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2e3);
      const deletePrevious = form.get("delete_previous") === "on";
      const paused = form.get("paused") === "on";
      const embedTemplate = String(form.get("embed_template") ?? "").trim() || null;
      const scheduled = timerScheduleFields(form);
      const unschedule = !scheduled && ["daily", "weekly"].includes(String(form.get("old_schedule") ?? "")) ? { schedule: "interval", at_time: null, weekday: null } : {};
      if (scheduled && "error" in scheduled) error = dt("Write the time as HH:MM and choose a valid time zone (e.g. America/Bogota or UTC-5).");
      else if (message || embedTemplate) {
        const patchUrl = `${apiUrl}/rest/v1/auto_messages?id=eq.${encodeURIComponent(String(form.get("id") ?? ""))}&guild_id=eq.${id}`;
        const channelId = String(form.get("channel_id") ?? "");
        const moved = /^\d{15,25}$/.test(channelId) && channelId !== String(form.get("old_channel_id") ?? "");
        const patch = { interval_ms: intervalMs, message, next_run_at: new Date(Date.now() + intervalMs).toISOString(), ...unschedule, ...scheduled ?? {}, ...moved ? { channel_id: channelId } : {} };
        const send = (body) => fetch(patchUrl, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(body) });
        try {
          let res = await send({ ...patch, delete_previous: deletePrevious, embed_template: embedTemplate, ...moved ? { last_message_id: null } : {}, ...form.has("paused_field") ? { paused } : {} });
          if (!res.ok) res = await send({ ...patch, delete_previous: deletePrevious, embed_template: embedTemplate });
          if (!res.ok) res = await send(patch);
          saved = res.ok;
          if (!res.ok) error = res.status === 409 ? dt("That channel may already have a timer.") : scheduled ? dt("The bot could not save the schedule. It may need to be updated first.") : dt("The timer could not be saved. Try again.");
        } catch (err) {
          console.error("[timers] edit failed:", err);
          error = dt("The timer could not be saved. Try again.");
        }
      }
    } else if (action === "save_sticky_roles") {
      const res = await fetch(`${apiUrl}/rest/v1/sticky_roles_config?on_conflict=guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, enabled: form.get("enabled") === "on" }) });
      saved = res.ok;
    } else if (action === "delete_timer") {
      const timerId = encodeURIComponent(String(form.get("id") ?? ""));
      const res = await fetch(`${apiUrl}/rest/v1/auto_messages?guild_id=eq.${id}&id=eq.${timerId}`, { method: "DELETE", headers: apiHeaders });
      saved = res.ok;
    } else if (action === "save_starboard") {
      const channelId = String(form.get("channel_id") ?? "").trim() || null;
      const threshold = Math.max(1, Math.min(100, Number(form.get("threshold") ?? 3) || 3));
      const emoji = String(form.get("emoji") ?? "\u2B50").trim().slice(0, 100) || "\u2B50";
      const colorHex = String(form.get("color") ?? "").trim();
      const starboardColor = /^#[0-9a-f]{6}$/i.test(colorHex) ? parseInt(colorHex.slice(1), 16) : 16761095;
      const ignoredChannelIds = form.getAll("ignored_channel_ids").map(String);
      const ignoredRoleIds = form.getAll("ignored_role_ids").map(String);
      const ignoredUserIds = String(form.get("ignored_user_ids") ?? "").split(/[\s,]+/).map((v) => v.trim()).filter((v) => /^\d{15,25}$/.test(v)).slice(0, 100);
      const res = await fetch(`${apiUrl}/rest/v1/starboards?on_conflict=guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, channel_id: channelId, threshold, emoji, color: starboardColor, selfstar: form.get("selfstar") === "on", timestamp: form.get("timestamp") === "on", jumpurl: form.get("jumpurl") === "on", attachments: form.get("attachments") === "on", ...form.get("design_ready") || String(form.get("embed_template") ?? "").trim() ? { embed_template: String(form.get("embed_template") ?? "").trim().slice(0, 40) || null } : {}, ignored_channel_ids: ignoredChannelIds, ignored_role_ids: ignoredRoleIds, ignored_user_ids: ignoredUserIds }) });
      saved = res.ok;
    } else if (action === "disable_starboard") {
      const entriesRes = await fetch(`${apiUrl}/rest/v1/starboard_entries?guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      const res = await fetch(`${apiUrl}/rest/v1/starboards?guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = entriesRes.ok && res.ok;
    } else if (action === "save_monkeyboard") {
      const channelId = String(form.get("channel_id") ?? "").trim() || null;
      const threshold = Math.max(1, Math.min(100, Number(form.get("threshold") ?? 3) || 3));
      const emoji = String(form.get("emoji") ?? "\u{1F412}").trim().slice(0, 100) || "\u{1F412}";
      const colorHex = String(form.get("color") ?? "").trim();
      const monkeyColor = /^#[0-9a-f]{6}$/i.test(colorHex) ? parseInt(colorHex.slice(1), 16) : 9132587;
      const ignoredChannelIds = form.getAll("ignored_channel_ids").map(String);
      const ignoredRoleIds = form.getAll("ignored_role_ids").map(String);
      const ignoredUserIds = String(form.get("ignored_user_ids") ?? "").split(/[\s,]+/).map((v) => v.trim()).filter((v) => /^\d{15,25}$/.test(v)).slice(0, 100);
      const res = await fetch(`${apiUrl}/rest/v1/monkeyboards?on_conflict=guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, channel_id: channelId, threshold, emoji, color: monkeyColor, selfstar: form.get("selfstar") === "on", timestamp: form.get("timestamp") === "on", jumpurl: form.get("jumpurl") === "on", attachments: form.get("attachments") === "on", ...form.get("design_ready") || String(form.get("embed_template") ?? "").trim() ? { embed_template: String(form.get("embed_template") ?? "").trim().slice(0, 40) || null } : {}, ignored_channel_ids: ignoredChannelIds, ignored_role_ids: ignoredRoleIds, ignored_user_ids: ignoredUserIds }) });
      saved = res.ok;
    } else if (action === "disable_monkeyboard") {
      const entriesRes = await fetch(`${apiUrl}/rest/v1/monkeyboard_entries?guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      const res = await fetch(`${apiUrl}/rest/v1/monkeyboards?guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = entriesRes.ok && res.ok;
    } else if (action === "save_voicemaster") {
      const creatorChannelId = String(form.get("creator_channel_id") ?? "").trim();
      const panelChannelId = String(form.get("panel_channel_id") ?? "").trim();
      const categoryId = String(form.get("category_id") ?? "").trim() || null;
      const defaultLimit = Math.max(0, Math.min(99, Number(form.get("default_limit") ?? 0) || 0));
      const defaultName = String(form.get("default_name") ?? "{user.name}").trim().slice(0, 100) || "{user.name}";
      if (creatorChannelId && panelChannelId) {
        const oldRes = await fetch(`${apiUrl}/rest/v1/voice_configs?guild_id=eq.${id}&select=panel_channel_id,panel_message_id`, { headers: apiHeaders });
        const [old] = oldRes.ok ? await oldRes.json() : [];
        if (old && (old.panel_channel_id !== panelChannelId || form.get("resend_panel") === "on")) await deleteDiscordMessage(old.panel_channel_id, old.panel_message_id);
        const panelMessageId = old && old.panel_channel_id === panelChannelId && form.get("resend_panel") !== "on" ? old.panel_message_id : await postVoiceMasterPanel(panelChannelId);
        if (!panelMessageId) {
          error = dt("Could not post the VoiceMaster panel. Check the bot permissions in that channel.");
        } else {
          const base = { guild_id: id, creator_channel_id: creatorChannelId, panel_channel_id: panelChannelId, panel_message_id: panelMessageId, category_id: categoryId, default_limit: defaultLimit, default_name: defaultName, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
          const privacy = String(form.get("privacy_mode") ?? "public");
          const permissions = {
            sync_category_permissions: form.get("sync_category_permissions") === "on",
            access_role_ids: form.getAll("access_role_ids").map(String).filter((v) => /^\d{5,25}$/.test(v)).slice(0, 25),
            privacy_mode: ["public", "locked", "hidden"].includes(privacy) ? privacy : "public",
            owner_permissions: form.getAll("owner_permissions").map(String).filter((v) => VOICE_OWNER_PERMISSIONS.includes(v))
          };
          const send = (body) => fetch(`${apiUrl}/rest/v1/voice_configs?on_conflict=guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(body) });
          let res = await send({ ...base, ...permissions });
          if (!res.ok) res = await send(base);
          saved = res.ok;
          if (saved && panelMessageId !== old?.panel_message_id) await redrawPanelsInServerLanguage(Astro2, apiUrl, apiHeaders, id);
        }
      }
    } else if (action === "disable_voicemaster") {
      const oldRes = await fetch(`${apiUrl}/rest/v1/voice_configs?guild_id=eq.${id}&select=panel_channel_id,panel_message_id`, { headers: apiHeaders });
      const [old] = oldRes.ok ? await oldRes.json() : [];
      await deleteDiscordMessage(old?.panel_channel_id, old?.panel_message_id);
      const res = await fetch(`${apiUrl}/rest/v1/voice_configs?guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = res.ok;
    }
    if (["create_webhook", "duplicate_webhook", "delete_webhook", "create_counter", "edit_counter", "save_voicemaster", "disable_voicemaster"].includes(action)) noteGuildWrite(id);
  }
  const AUTOMATION_SECTIONS = ["overview", "custom-commands", "autoresponders", "sticky-messages", "reaction-roles", "reaction-triggers", "reaction-messages", "auto-threads", "disabled-commands", "aliases", "timers", "starboard", "monkeyboard", "voicemaster", "webhooks", "sticky-roles", "counters"];
  const shown = AUTOMATION_SECTIONS.includes(section) ? section : "overview";
  const needs = (...sections) => sections.includes(shown);
  const when = (sections, load) => () => needs(...sections) ? load() : Promise.resolve(null);
  const customEmojisPromise = needs("reaction-triggers", "reaction-messages", "starboard", "monkeyboard", "reaction-roles") ? getGuildEmojis(id, botToken) : Promise.resolve([]);
  const WITH_CHANNELS = ["custom-commands", "webhooks", "counters", "reaction-triggers", "reaction-messages", "timers", "starboard", "monkeyboard", "voicemaster", "autoresponders", "sticky-messages", "reaction-roles", "auto-threads", "disabled-commands"];
  const WITH_ROLES = ["custom-commands", "reaction-triggers", "starboard", "monkeyboard", "autoresponders", "reaction-roles", "voicemaster"];
  const WITH_TEMPLATES = ["webhooks", "starboard", "monkeyboard", "timers", "custom-commands", "autoresponders", "sticky-messages", "reaction-roles", "auto-threads"];
  const [guildInfo, commandsRes, respondersRes, stickyRes, reactionRolesRes, reactionTriggersRes, reactionMessagesRes, disabledRes, autoThreadsRes, aliasesRes, timersRes, starboardRes, monkeyboardRes, voiceMasterRes, webhooksRes, countersRes, rolesRes, channelsRes, embedTemplatesRes, stickyRolesRes, stickySnapshotsRes, prefixRes, codeRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    when(["custom-commands"], () => fetch(`${apiUrl}/rest/v1/custom_commands?guild_id=eq.${id}&select=id,name,response,embed_template,options&order=name.asc`, { headers: apiHeaders })),
    when(["autoresponders"], () => fetch(`${apiUrl}/rest/v1/auto_responders?guild_id=eq.${id}&select=*&order=trigger.asc`, { headers: apiHeaders })),
    when(["sticky-messages"], () => fetch(`${apiUrl}/rest/v1/sticky_messages?guild_id=eq.${id}&select=channel_id,content,embed_template`, { headers: apiHeaders })),
    when(["reaction-roles"], () => fetch(apiUrl + "/rest/v1/reaction_roles?guild_id=eq." + id + "&select=id,channel_id,message_id,emoji,role_id,mode,interaction_type,button_label", { headers: apiHeaders })),
    when(["reaction-triggers"], () => fetch(`${apiUrl}/rest/v1/reaction_triggers?guild_id=eq.${id}&select=id,emoji,trigger,owner_id,match_mode,channel_ids,role_ids,case_sensitive,cooldown_seconds,enabled&order=trigger.asc`, { headers: apiHeaders })),
    when(["reaction-messages"], () => fetch(`${apiUrl}/rest/v1/reaction_message_configs?guild_id=eq.${id}&select=id,channel_id,emojis&order=channel_id.asc`, { headers: apiHeaders })),
    when(["disabled-commands"], () => fetch(`${apiUrl}/rest/v1/disabled_commands?guild_id=eq.${id}&select=id,command,channel_id`, { headers: apiHeaders })),
    when(["auto-threads"], () => fetch(`${apiUrl}/rest/v1/auto_threads?guild_id=eq.${id}&select=channel_id,name_template,message_text,embed_template,archive_minutes`, { headers: apiHeaders })),
    when(["aliases"], () => fetch(`${apiUrl}/rest/v1/command_aliases?guild_id=eq.${id}&select=id,name,command&order=name.asc`, { headers: apiHeaders })),
    when(["timers"], () => fetch(`${apiUrl}/rest/v1/auto_messages?guild_id=eq.${id}&select=*&order=id.asc`, { headers: apiHeaders })),
    when(["starboard"], () => fetch(`${apiUrl}/rest/v1/starboards?guild_id=eq.${id}&select=*`, { headers: apiHeaders })),
    when(["monkeyboard"], () => fetch(`${apiUrl}/rest/v1/monkeyboards?guild_id=eq.${id}&select=*`, { headers: apiHeaders })),
    when(["voicemaster"], () => fetch(`${apiUrl}/rest/v1/voice_configs?guild_id=eq.${id}&select=*`, { headers: apiHeaders })),
    when(["webhooks"], () => fetch(`${apiUrl}/rest/v1/managed_webhooks?guild_id=eq.${id}&select=id,name,channel_id,webhook_id,default_username,default_avatar_url,default_message,default_embed,enabled&order=id.asc`, { headers: apiHeaders })),
    when(["counters"], () => fetch(`${apiUrl}/rest/v1/server_counters?guild_id=eq.${id}&select=id,channel_id,counter_option,channel_type,name_template,prefix,suffix,parent_id,interval_seconds,enabled&order=id.asc`, { headers: apiHeaders })),
    when(WITH_ROLES, () => getGuildList(Astro2, id, botToken, "roles")),
    when(WITH_CHANNELS, () => getGuildList(Astro2, id, botToken, "channels")),
    when(WITH_TEMPLATES, () => fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders })),
    when(["sticky-roles"], () => fetch(`${apiUrl}/rest/v1/sticky_roles_config?guild_id=eq.${id}&select=enabled`, { headers: apiHeaders })),
    when(["sticky-roles"], () => fetch(`${apiUrl}/rest/v1/sticky_role_snapshots?guild_id=eq.${id}&select=user_id&limit=1000`, { headers: apiHeaders })),
    // The prefix of the server and which custom commands are written in code. Both tolerate a database that does not have them yet.
    when(["aliases", "custom-commands", "disabled-commands"], () => fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=prefix`, { headers: apiHeaders }).catch(() => null)),
    when(["custom-commands"], () => fetch(`${apiUrl}/rest/v1/custom_commands?guild_id=eq.${id}&code=not.is.null&select=name`, { headers: apiHeaders }).catch(() => null))
  ], 6);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  let guildPrefix = "!";
  try {
    if (prefixRes?.ok) guildPrefix = String((await prefixRes.json())?.[0]?.prefix || "!");
  } catch {
  }
  const codeCommandNames = /* @__PURE__ */ new Set();
  try {
    if (codeRes?.ok) for (const row of await codeRes.json()) codeCommandNames.add(row.name);
  } catch {
  }
  const customCommands = commandsRes?.ok ? (await commandsRes.json()).map((c) => ({ id: c.id, name: c.name, response: c.response, embedTemplate: c.embed_template, isCode: codeCommandNames.has(c.name), scope: scopeOf(c.options) })) : [];
  const stickyRolesEnabled = stickyRolesRes?.ok ? Boolean((await stickyRolesRes.json())?.[0]?.enabled) : false;
  const stickyRows = stickySnapshotsRes?.ok ? await stickySnapshotsRes.json() : [];
  const stickyRolesSaved = stickyRows.length;
  const waitingIds = stickyRows.slice(0, 8).map((row) => String(row.user_id));
  const waitingProfiles = waitingIds.length ? (await withinBudget(getMemberProfiles(Astro2, id, waitingIds, botToken, { fallback: "user", userId: session.userId }), 1500))?.value ?? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Map();
  const stickyRolesWaiting = waitingIds.map((userId) => {
    const profile = waitingProfiles.get(userId) ?? null;
    return { id: userId, name: profile ? profile.displayName || profile.username : null, avatar: memberAvatarUrl(userId, profile, 64) };
  });
  const embedTemplateNames = embedTemplatesRes?.ok ? (await embedTemplatesRes.json()).map((t) => t.name) : [];
  const autoResponders = respondersRes?.ok ? (await respondersRes.json()).map((a) => ({
    id: a.id,
    arId: a.ar_id,
    trigger: a.trigger,
    reply: a.reply,
    matchMode: a.match_mode,
    deleteTrigger: a.delete_trigger ?? false,
    replyToTrigger: a.reply_to_trigger ?? false,
    pingUser: a.ping_user ?? false,
    deletePrevious: a.delete_previous ?? false,
    channelIds: a.channel_ids ?? [],
    roleIds: a.role_ids ?? [],
    replyType: a.reply_type ?? "text",
    embedColor: a.embed_color,
    embedTitle: a.embed_title,
    embedFooter: a.embed_footer,
    embedTemplate: a.embed_template
  })) : [];
  const stickyMessages = stickyRes?.ok ? (await stickyRes.json()).map((s) => ({ channelId: s.channel_id, content: s.content, embedTemplate: s.embed_template ?? "" })) : [];
  const reactionRoles = reactionRolesRes?.ok ? (await reactionRolesRes.json()).map((r) => ({ id: r.id, channelId: r.channel_id ?? "", messageId: r.message_id, emoji: r.emoji, roleId: r.role_id, mode: r.mode, interactionType: r.interaction_type ?? "reaction", buttonLabel: r.button_label ?? null })) : [];
  const reactionTriggers = reactionTriggersRes?.ok ? (await reactionTriggersRes.json()).map((r) => ({ id: r.id, emoji: r.emoji, trigger: r.trigger, ownerId: r.owner_id, matchMode: r.match_mode ?? "contains", channelIds: r.channel_ids ?? [], roleIds: r.role_ids ?? [], caseSensitive: r.case_sensitive ?? false, cooldownSeconds: r.cooldown_seconds ?? 0, enabled: r.enabled !== false })) : [];
  const reactionMessages = reactionMessagesRes?.ok ? (await reactionMessagesRes.json()).map((r) => ({ id: r.id, channelId: r.channel_id, emojis: r.emojis ?? [] })) : [];
  const disabledCommands = disabledRes?.ok ? (await disabledRes.json()).map((d) => ({ id: d.id, command: d.command, channelId: d.channel_id })) : [];
  const autoThreads = autoThreadsRes?.ok ? (await autoThreadsRes.json()).map((t) => ({ channelId: t.channel_id, nameTemplate: t.name_template, messageText: t.message_text, embedTemplate: t.embed_template, archiveMinutes: t.archive_minutes })) : [];
  const aliases = aliasesRes?.ok ? (await aliasesRes.json()).map((a) => ({ id: a.id, name: a.name, command: a.command })) : [];
  const timers = timersRes?.ok ? (await timersRes.json()).map((t) => ({ id: t.id, channelId: t.channel_id, intervalMs: Number(t.interval_ms), message: t.message, nextRunAt: t.next_run_at, deletePrevious: t.delete_previous ?? false, embedTemplate: t.embed_template ?? "", schedule: t.schedule === "daily" || t.schedule === "weekly" ? t.schedule : "interval", atTime: t.at_time ?? "", timezone: t.timezone ?? "UTC", weekday: t.weekday == null ? null : Number(t.weekday), number: t.number == null ? null : Number(t.number), lastError: t.last_error ? String(t.last_error) : "", paused: Boolean(t.paused) })) : [];
  const starboardRows = starboardRes?.ok ? await starboardRes.json() : [];
  const starboard = starboardRows[0] ? { ...starboardRows[0], ignoredChannelIds: starboardRows[0].ignored_channel_ids ?? [], ignoredRoleIds: starboardRows[0].ignored_role_ids ?? [], ignoredUserIds: starboardRows[0].ignored_user_ids ?? [] } : null;
  const monkeyboardRows = monkeyboardRes?.ok ? await monkeyboardRes.json() : [];
  const monkeyboard = monkeyboardRows[0] ? { ...monkeyboardRows[0], ignoredChannelIds: monkeyboardRows[0].ignored_channel_ids ?? [], ignoredRoleIds: monkeyboardRows[0].ignored_role_ids ?? [], ignoredUserIds: monkeyboardRows[0].ignored_user_ids ?? [] } : null;
  const voiceRows = voiceMasterRes?.ok ? await voiceMasterRes.json() : [];
  const voiceMaster = voiceRows[0] ? { creatorChannelId: voiceRows[0].creator_channel_id, panelChannelId: voiceRows[0].panel_channel_id, panelMessageId: voiceRows[0].panel_message_id, categoryId: voiceRows[0].category_id, defaultLimit: voiceRows[0].default_limit ?? 0, defaultName: voiceRows[0].default_name ?? "{user.name}", syncCategoryPermissions: voiceRows[0].sync_category_permissions === true, accessRoleIds: Array.isArray(voiceRows[0].access_role_ids) ? voiceRows[0].access_role_ids : [], privacyMode: ["public", "locked", "hidden"].includes(voiceRows[0].privacy_mode) ? voiceRows[0].privacy_mode : "public", ownerPermissions: Array.isArray(voiceRows[0].owner_permissions) ? voiceRows[0].owner_permissions : ["manage_channels", "move_members"] } : null;
  const managedWebhooks = webhooksRes?.ok ? (await webhooksRes.json()).map((w) => ({ id: w.id, name: w.name, channelId: w.channel_id, webhookId: w.webhook_id, defaultUsername: w.default_username, defaultAvatarUrl: w.default_avatar_url, defaultMessage: w.default_message, enabled: w.enabled !== false })) : [];
  const serverCounters = countersRes?.ok ? (await countersRes.json()).map((c) => ({ id: c.id, channelId: c.channel_id, option: c.counter_option, type: c.channel_type, nameTemplate: c.name_template ?? "{option}: {value}", prefix: c.prefix ?? "", suffix: c.suffix ?? "", parentId: c.parent_id, intervalSeconds: c.interval_seconds ?? 60, enabled: c.enabled !== false })) : [];
  const allRoles = rolesRes?.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const allChannels = channelsRes?.ok ? await channelsRes.json() : [];
  const channels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name, type: c.type }));
  const voiceChannels = allChannels.filter((c) => c.type === 2 || c.type === 13).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const channelCategories = allChannels.filter((c) => c.type === 4).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  let overview = null;
  if (shown === "overview") {
    const countHeaders = { ...apiHeaders, Prefer: "count=exact" };
    const hubTables = [["custom-commands", "custom_commands"], ["autoresponders", "auto_responders"], ["sticky-messages", "sticky_messages"], ["reaction-roles", "reaction_roles"], ["reaction-triggers", "reaction_triggers"], ["reaction-messages", "reaction_message_configs"], ["auto-threads", "auto_threads"], ["disabled-commands", "disabled_commands"], ["aliases", "command_aliases"], ["webhooks", "managed_webhooks"], ["counters", "server_counters"], ["starboard", "starboards"], ["monkeyboard", "monkeyboards"], ["clownboard", "clownboards"]];
    const hubReads = [...await runBatched([
      ...hubTables.map(([, table]) => () => fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}&select=guild_id`, { headers: { ...countHeaders, Range: "0-0" } }).catch(() => null)),
      () => fetch(`${apiUrl}/rest/v1/auto_messages?guild_id=eq.${id}&select=next_run_at,paused&order=next_run_at.asc&limit=200`, { headers: apiHeaders }).catch(() => null),
      () => fetch(`${apiUrl}/rest/v1/voice_configs?guild_id=eq.${id}&select=creator_channel_id&limit=1`, { headers: apiHeaders }).catch(() => null),
      () => fetch(`${apiUrl}/rest/v1/sticky_roles_config?guild_id=eq.${id}&select=enabled&limit=1`, { headers: apiHeaders }).catch(() => null)
    ], 6)];
    const counts = {};
    for (let i = 0; i < hubTables.length; i++) {
      const res = hubReads[i];
      await res?.body?.cancel().catch(() => {
      });
      const total = Number(res?.headers.get("content-range")?.split("/")[1]);
      counts[hubTables[i][0]] = res?.status === 416 ? 0 : res?.ok && Number.isFinite(total) ? total : null;
    }
    const timerRows = hubReads[hubTables.length]?.ok ? await hubReads[hubTables.length].json() : null;
    const voiceRows2 = hubReads[hubTables.length + 1]?.ok ? await hubReads[hubTables.length + 1].json() : null;
    const stickyRoleRows = hubReads[hubTables.length + 2]?.ok ? await hubReads[hubTables.length + 2].json() : null;
    const running = (timerRows ?? []).filter((t) => !t.paused);
    counts.timers = timerRows ? timerRows.length : null;
    overview = {
      counts,
      on: { voicemaster: Boolean(voiceRows2?.length), "sticky-roles": Boolean(stickyRoleRows?.[0]?.enabled) },
      timers: timerRows ? { total: timerRows.length, running: running.length, nextRunAt: running[0]?.next_run_at ?? null } : null
    };
  }
  const customEmojis = await customEmojisPromise;
  return renderTemplate`${renderComponent($$result, "DashAutomation", $$DashAutomation, { "customEmojis": customEmojis, "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "customCommands": customCommands, "prefix": guildPrefix, "premiumActive": premiumActive, "autoResponders": autoResponders, "stickyMessages": stickyMessages, "disabledCommands": disabledCommands, "reactionRoles": reactionRoles, "reactionTriggers": reactionTriggers, "reactionMessages": reactionMessages, "autoThreads": autoThreads, "roles": roles, "channels": channels, "embedTemplateNames": embedTemplateNames, "saved": saved, "reactionRoleError": reactionRoleError, "error": error, "aliases": aliases, "timers": timers, "notice": notice, "starboard": starboard, "monkeyboard": monkeyboard, "stickyRolesEnabled": stickyRolesEnabled, "stickyRolesSaved": stickyRolesSaved, "stickyRolesWaiting": stickyRolesWaiting, "voiceMaster": voiceMaster, "voiceChannels": voiceChannels, "channelCategories": channelCategories, "managedWebhooks": managedWebhooks, "serverCounters": serverCounters, "overview": overview, "section": section })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/automation.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/automation.astro";
const $$url = "/dash/guild/[id]/automation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Automation,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
