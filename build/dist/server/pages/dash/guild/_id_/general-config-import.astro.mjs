import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { C as syncPettoPrefix, k as syncPettoLanguage } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { deferGuildChange } from '../../../../chunks/serverTiming_CTuT9h6x.mjs';
import { bumpGuildVersion } from '../../../../chunks/guildVersion_C-xSL97y.mjs';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
import { parseDocument } from 'yaml';
import { G as GUILD_COLUMNS, S as SECTIONS, C as CONFIG_SCHEMA } from '../../../../chunks/configYamlRender_CdfrZ1VV.mjs';
import { c as checkPrefixList, p as prefixesFromRows } from '../../../../chunks/guildPrefixes_MsnzaZTo.mjs';
import { a as automodNumber } from '../../../../chunks/automodLimits_o4rqLaIq.mjs';
import { r as readConfigForm, c as configFormEntries, s as storedConfig, a as readVoiceForm, v as voiceFormEntries, b as storedVoice, d as readRankForm, e as rankFormEntries, f as storedRank, g as readRulesForm, h as rulesFormEntries, i as storedRules } from '../../../../chunks/levelingForm_C3ar_9KM.mjs';
export { renderers } from '../../../../renderers.mjs';

const MAX_FILE_BYTES = 256 * 1024;
const MAX_DEPTH = 8;
const MAX_NODES = 2e4;
const SNOWFLAKE = /^\d{15,25}$/;
const fail = (key, vars) => ({ ok: false, error: { key, vars } });
function parseConfigFile(text2) {
  if (typeof text2 !== "string" || !text2.trim()) return fail("The file is empty.");
  if (new TextEncoder().encode(text2).length > MAX_FILE_BYTES) return fail("The file is too big (at most {n} KB).", { n: MAX_FILE_BYTES / 1024 });
  if (text2.includes("\0")) return fail("This is not a configuration file.");
  let doc;
  try {
    doc = parseDocument(text2, { maxAliasCount: 0, merge: false, uniqueKeys: true, schema: "core", version: "1.2", prettyErrors: false, strict: true });
  } catch {
    return fail("This is not valid YAML.");
  }
  if (doc.errors.length || doc.warnings.length) {
    const first = doc.errors[0] ?? doc.warnings[0];
    const line = first.linePos?.[0]?.line;
    return fail("This is not valid YAML (line {n}).", { n: line ?? 1 });
  }
  let data;
  try {
    data = doc.toJS({ maxAliasCount: 0 });
  } catch {
    return fail("This is not valid YAML.");
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return fail("This is not a configuration file: it must be a list of settings.");
  let nodes = 0;
  const tooBig = (value, depth) => {
    if (depth > MAX_DEPTH) return true;
    if (++nodes > MAX_NODES) return true;
    if (Array.isArray(value)) return value.some((item) => tooBig(item, depth + 1));
    if (value && typeof value === "object") return Object.values(value).some((item) => tooBig(item, depth + 1));
    return false;
  };
  if (tooBig(data, 0)) return fail("The file is too complex to read.");
  return { ok: true, data };
}
const bad = (key, vars) => ({ ok: false, reason: { key, vars } });
const good = (value, note) => ({ ok: true, value, note });
const isNumber = (value) => typeof value === "number" && Number.isFinite(value);
const bool = (value) => typeof value === "boolean" ? good(value) : bad("Use true or false.");
const oneOf = (values) => (value) => typeof value === "string" && values.includes(value) ? good(value) : bad("Use one of: {list}.", { list: values.join(", ") });
const clamped = (clamp) => (value) => {
  if (!isNumber(value)) return bad("Use a number.");
  const out = clamp(value);
  return good(out, out === value ? void 0 : { key: "Brought into the allowed range: {n}.", vars: { n: out } });
};
const strictInt = (min, max) => (value) => isNumber(value) && Number.isInteger(value) && value >= min && value <= max ? good(value) : bad("Use a whole number from {a} to {b}.", { a: min, b: max });
const pageWhole = (min, max, fallback) => clamped((n) => {
  const w = Math.floor(n);
  return Number.isFinite(w) ? Math.min(max, Math.max(min, w)) : fallback;
});
const idKnown = (id2, kind, known) => {
  if (kind === "user") return true;
  const set = kind === "role" ? known.roles : known.channels;
  return !set || set.has(id2);
};
const id = (kind) => (value, ctx) => {
  if (value === null || value === "") return good(null);
  if (typeof value !== "string" || !SNOWFLAKE.test(value)) return bad("Write the id between quotes (a long number loses its last digits).");
  if (idKnown(value, kind, ctx.known)) return good(value);
  return kind === "role" ? bad("That role is not in this server.") : bad("That channel is not in this server.");
};
const ids = (kind, max) => (value, ctx) => {
  if (value === null) return good([]);
  if (!Array.isArray(value)) return bad("Use a list of ids between quotes.");
  const out = [];
  let missing = 0;
  for (const item of value) {
    if (typeof item !== "string" || !SNOWFLAKE.test(item)) return bad("Write each id between quotes (a long number loses its last digits).");
    if (!idKnown(item, kind, ctx.known)) {
      missing += 1;
      continue;
    }
    if (!out.includes(item)) out.push(item);
  }
  const kept = out.slice(0, max);
  const warn = !missing ? void 0 : kind === "role" ? { key: "{n} roles that are not in this server were left out.", vars: { n: missing } } : { key: "{n} channels that are not in this server were left out.", vars: { n: missing } };
  const note = out.length > kept.length ? { key: "Only the first {n} are kept.", vars: { n: max } } : void 0;
  return { ok: true, value: kept, note, warn };
};
const text = (options) => (value) => {
  if (value !== null && typeof value !== "string") return bad("Use text.");
  let out = String(value ?? "").replace(/\r\n?/g, "\n").trim();
  if (options.clean) out = options.clean(out);
  const long = out.length > options.max;
  out = out.slice(0, options.max);
  if (!out) return good(options.empty === "null" ? null : options.empty.text);
  return good(out, long ? { key: "The text was cut to {n} characters.", vars: { n: options.max } } : void 0);
};
const name = (max) => (raw) => raw.toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, max);
const words = (maxItems, maxLength) => (value) => {
  if (value === null) return good([]);
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" && typeof item !== "number")) return bad("Use a list of words.");
  const list = value.map((item) => String(item).trim()).filter(Boolean);
  if (list.length > maxItems) return bad("Too many items (at most {n}).", { n: maxItems });
  if (list.some((item) => item.length > maxLength)) return bad("An item is longer than {n} characters.", { n: maxLength });
  return good(list);
};
const inviteCodes = (value) => {
  if (value === null) return good([]);
  if (!Array.isArray(value)) return bad("Use a list of invite codes.");
  const out = /* @__PURE__ */ new Set();
  for (const raw of value) {
    const code = String(raw).trim().replace(/^(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord(?:app)?\.com\/invite)\//i, "").replace(/[?#].*$/, "").replace(/\/+$/, "").toLowerCase();
    if (!/^[a-z0-9-]{2,32}$/.test(code)) return bad("{x} is not an invite code.", { x: String(raw).slice(0, 40) });
    out.add(code);
  }
  if (out.size > 50) return bad("Too many items (at most {n}).", { n: 50 });
  return good([...out]);
};
const automod = (column) => clamped((n) => automodNumber(column, n));
const AUTOMOD_RULES = {
  word_filter_enabled: bool,
  word_filter_action: oneOf(["warn", "mute", "kick", "delete"]),
  banned_words: words(1e3, 100),
  anti_spam_enabled: bool,
  max_mentions: automod("max_mentions"),
  anti_raid_enabled: bool,
  raid_join_threshold: automod("raid_join_threshold"),
  raid_window_seconds: automod("raid_window_seconds"),
  raid_action: oneOf(["alert", "kick", "lockdown"]),
  anti_alt_enabled: bool,
  anti_alt_min_age_days: automod("anti_alt_min_age_days"),
  anti_alt_action: oneOf(["kick", "flag"]),
  immune_role_ids: ids("role", 250),
  allowed_invite_codes: inviteCodes,
  repeat_threshold: automod("repeat_threshold"),
  repeat_window_seconds: automod("repeat_window_seconds"),
  caps_percent: automod("caps_percent"),
  caps_min_length: automod("caps_min_length"),
  max_message_length: automod("max_message_length"),
  max_lines: automod("max_lines"),
  exempt_channel_ids: ids("channel", 50),
  spam_repeat: bool,
  spam_mentions: bool,
  spam_invites: bool,
  spam_caps: bool,
  strike_limit: automod("strike_limit"),
  strike_window_minutes: automod("strike_window_minutes"),
  strike_mute_minutes: automod("strike_mute_minutes")
};
const emoji = text({ max: 64, empty: { text: "" } });
const COUNTING_RULES = {
  enabled: bool,
  channel_id: id("channel"),
  allow_double: bool,
  math: bool,
  reset_on_wrong: bool,
  delete_wrong: bool,
  announce_edits: bool,
  react_ok: (v, c) => v === null || v === "" ? good("✅") : emoji(v, c),
  react_bad: (v, c) => v === null || v === "" ? good("❌") : emoji(v, c),
  react_record: (v, c) => v === null || v === "" ? good("🏆") : emoji(v, c),
  saves_max: pageWhole(0, 5, 0),
  save_every: pageWhole(10, 1e4, 100),
  milestone_every: pageWhole(0, 1e5, 100),
  record_every: pageWhole(0, 1e5, 100),
  start_number: pageWhole(0, 1e6, 0),
  wrong_role_id: id("role"),
  wrong_role_minutes: pageWhole(0, 10080, 60),
  alert_seconds: pageWhole(0, 3600, 30)
};
const BIRTHDAY_MESSAGE = "{EMOJI} Happy birthday {user}! Have a great day!";
const BIRTHDAY_RULES = {
  enabled: bool,
  channel_id: id("channel"),
  role_id: id("role"),
  message: text({ max: 1500, empty: { text: BIRTHDAY_MESSAGE } }),
  embed_template: text({ max: 60, empty: "null", clean: name(60) }),
  hour: strictInt(0, 23),
  utc_offset_minutes: strictInt(-720, 840)
};
const identity = (...columns) => Object.fromEntries(columns.map((column) => [column, column]));
const LEVELING_FORMS = [
  {
    columns: identity("enabled", "xp_min", "xp_max", "cooldown_seconds", "xp_per_vc_minute", "role_mode", "notify_mode", "notify_channel_id", "notify_message", "notify_embed", "notify_embed_template", "notify_every", "ignored_channel_ids", "ignored_category_ids", "notify_reply", "notify_ping", "notify_delete_after", "join_xp", "join_level", "curve_a", "curve_b", "curve_c", "difficulty", "rounding", "max_level"),
    entries: (row) => configFormEntries(storedConfig(row)),
    read: (form) => readConfigForm(form)
  },
  {
    columns: identity("voice_enabled", "voice_curve_a", "voice_curve_b", "voice_curve_c", "voice_difficulty", "voice_rounding", "voice_max_level", "voice_notify_mode", "voice_notify_channel_id", "voice_notify_message", "voice_notify_embed", "voice_notify_embed_template", "voice_notify_every", "voice_role_mode", "voice_ignored_channel_ids", "voice_ignored_category_ids", "voice_notify_ping", "voice_notify_delete_after"),
    entries: (row) => voiceFormEntries(storedVoice(row, storedConfig(row))),
    read: (form) => readVoiceForm(form)
  },
  {
    columns: identity("rank_style", "rank_card", "notify_card", "voice_notify_card"),
    entries: (row) => rankFormEntries(storedRank(row)),
    read: (form) => readRankForm(form)
  },
  {
    columns: { ...identity("min_message_chars", "anti_repeat", "voice_min_members", "voice_ignore_muted", "daily_bonus_xp", "streak_bonus_xp", "streak_max_days", "xp_multiplier", "multiplier_mode", "multiplier_cap", "keep_xp", "restore_roles", "no_xp_role_ids", "only_xp_role_ids", "no_xp_user_ids", "daily_xp_cap", "voice_alone_percent"), vote_boost_enabled: "vote_boost" },
    entries: (row) => rulesFormEntries(storedRules(row)),
    read: (form) => {
      const { row, newest } = readRulesForm(form);
      return { ...row, ...newest, vote_boost_enabled: newest.vote_boost_enabled };
    }
  }
];
const LEVELING_FLOATS = /* @__PURE__ */ new Set(["curve_a", "curve_b", "curve_c", "difficulty", "voice_curve_a", "voice_curve_b", "voice_curve_c", "voice_difficulty", "xp_multiplier", "multiplier_cap"]);
const LEVELING_ENUMS = {
  role_mode: ["highest", "all"],
  voice_role_mode: ["highest", "all"],
  notify_mode: ["off", "reply", "channel", "dm"],
  voice_notify_mode: ["off", "reply", "channel", "dm"],
  rank_style: ["card", "embed", "both"],
  multiplier_mode: ["highest", "stack", "sum"]
};
const LEVELING_IDS = {
  notify_channel_id: ["channel", null],
  voice_notify_channel_id: ["channel", null],
  ignored_channel_ids: ["channel", 100],
  ignored_category_ids: ["channel", 100],
  voice_ignored_channel_ids: ["channel", 100],
  voice_ignored_category_ids: ["channel", 100],
  no_xp_role_ids: ["role", 100],
  only_xp_role_ids: ["role", 100],
  no_xp_user_ids: ["user", 100]
};
const LEVELING_COLUMNS = new Set(LEVELING_FORMS.flatMap((form) => Object.keys(form.columns)));
const SPECS = [
  { id: "automod", title: "Word filter, spam, raids and new accounts", path: ["moderation", "automod"], table: "automod_config", rules: AUTOMOD_RULES },
  { id: "counting", title: "Counting game", path: ["community", "counting"], table: "counting_config", rules: COUNTING_RULES },
  { id: "birthdays", title: "Birthdays", path: ["community", "birthdays"], table: "birthday_config", rules: BIRTHDAY_RULES }
];
function shown(table, row, column) {
  const value = row?.[column];
  if (value !== void 0 && value !== null) return value;
  const spec = (CONFIG_SCHEMA[table] ?? []).find((item) => item[0] === column);
  return spec ? spec[2] ?? null : null;
}
function same(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    const x = Array.isArray(a) ? a : a === null || a === void 0 ? [] : [a];
    const y = Array.isArray(b) ? b : b === null || b === void 0 ? [] : [b];
    return x.length === y.length && x.every((item, index) => String(item) === String(y[index]));
  }
  if (a === null || a === void 0) return b === null || b === void 0 || b === "";
  if (typeof a === "number" || typeof b === "number") return Number(a) === Number(b);
  return a === b;
}
function isShortenedCopy(fileValue, current) {
  if (typeof fileValue === "string" && typeof current === "string") {
    return fileValue.endsWith("…") && current.length >= fileValue.length && current.startsWith(fileValue.slice(0, -1));
  }
  if (Array.isArray(fileValue) && Array.isArray(current) && fileValue.length <= current.length) {
    const cut = fileValue.length === 200 && current.length > 200;
    const itemsCut = fileValue.some((item, index) => isShortenedCopy(item, current[index]));
    if (!cut && !itemsCut) return false;
    return fileValue.every((item, index) => String(item) === String(current[index]) || isShortenedCopy(item, current[index]));
  }
  return false;
}
const newWork = () => ({ change: [], unchanged: 0, invalid: [], warnings: [], row: {} });
function checkWithRules(spec, input, row, ctx) {
  const work = newWork();
  for (const [column, rule] of Object.entries(spec.rules)) {
    if (!(column in input)) continue;
    if (isShortenedCopy(input[column], shown(spec.table, row, column))) {
      work.unchanged += 1;
      continue;
    }
    const result = rule(input[column], ctx);
    if (!result.ok) {
      work.invalid.push({ setting: column, value: input[column], reason: result.reason });
      continue;
    }
    if (result.warn) work.warnings.push({ setting: column, value: input[column], reason: result.warn });
    const from = shown(spec.table, row, column);
    if (same(from, result.value)) work.unchanged += 1;
    else {
      work.change.push({ setting: column, from, to: result.value, note: result.note });
      work.row[column] = result.value;
    }
  }
  return work;
}
function checkLeveling(input, row, ctx) {
  const work = newWork();
  const current = row ?? {};
  for (const form of LEVELING_FORMS) {
    const given = Object.keys(form.columns).filter((column) => column in input);
    if (!given.length) continue;
    const data = new FormData();
    for (const [key, value] of form.entries(current)) data.append(key, value);
    const set = (field, value) => {
      data.delete(field);
      if (typeof value === "boolean") {
        if (value) data.append(field, "on");
        return;
      }
      if (Array.isArray(value)) {
        for (const item of value) data.append(field, String(item));
        return;
      }
      data.append(field, value === null || value === void 0 ? "" : String(value));
    };
    const accepted = [];
    for (const column of given) {
      const value = input[column];
      if (isShortenedCopy(value, shown("level_config", row, column))) {
        work.unchanged += 1;
        continue;
      }
      const columnSpec = CONFIG_SCHEMA.level_config.find((item) => item[0] === column);
      const kind = columnSpec ? columnSpec[1] : "text";
      let checked;
      if (LEVELING_ENUMS[column]) checked = oneOf(LEVELING_ENUMS[column])(value, ctx);
      else if (LEVELING_IDS[column]) {
        const [type, max] = LEVELING_IDS[column];
        checked = max === null ? id(type)(value, ctx) : ids(type, max)(value, ctx);
      } else if (kind === "bool") checked = bool(value);
      else if (kind === "num") checked = !isNumber(value) ? bad("Use a number.") : LEVELING_FLOATS.has(column) || Number.isInteger(value) ? good(value) : bad("Use a whole number.");
      else checked = value === null || typeof value === "string" ? good(value) : bad("Use text.");
      if (!checked.ok) {
        work.invalid.push({ setting: column, value, reason: checked.reason });
        continue;
      }
      if (checked.warn) work.warnings.push({ setting: column, value, reason: checked.warn });
      set(form.columns[column], checked.value);
      accepted.push({ column, value: checked.value, note: checked.note });
    }
    if (!accepted.length) continue;
    const saved = form.read(data);
    for (const item of accepted) {
      const stored = saved[item.column];
      const from = shown("level_config", row, item.column);
      if (same(from, stored)) {
        work.unchanged += 1;
        continue;
      }
      const adjusted = !same(stored, item.value) && !LEVELING_ENUMS[item.column];
      work.change.push({ setting: item.column, from, to: stored, note: item.note ?? (adjusted ? { key: "Brought into the allowed range: {n}.", vars: { n: Array.isArray(stored) ? stored.join(", ") : String(stored) } } : void 0) });
      work.row[item.column] = stored;
    }
  }
  return work;
}
function checkGuild(data, row, ctx) {
  const work = newWork();
  const parts = [];
  if ("prefixes" in data && data.prefixes !== null) {
    const checked = checkPrefixList(Array.isArray(data.prefixes) ? data.prefixes.map((item) => typeof item === "string" || typeof item === "number" ? String(item) : item) : null);
    if (checked.problem) work.invalid.push({ setting: "prefixes", value: data.prefixes, reason: { key: checked.problem.key, vars: checked.problem.vars } });
    else {
      const from = prefixesFromRows(row?.prefixes, row?.prefix);
      if (same(from, checked.prefixes)) work.unchanged += 1;
      else {
        work.change.push({ setting: "prefixes", from, to: checked.prefixes });
        parts.push({ row: { prefix: checked.prefixes[0], prefixes: checked.prefixes }, after: "prefix" });
      }
    }
  }
  if ("language" in data) {
    const checked = oneOf(["en", "es", "pt-BR"])(data.language, ctx);
    if (!checked.ok) work.invalid.push({ setting: "language", value: data.language, reason: checked.reason });
    else {
      const from = shown("guilds", row, "language");
      if (same(from, checked.value)) work.unchanged += 1;
      else {
        work.change.push({ setting: "language", from, to: checked.value });
        parts.push({ row: { language: checked.value }, after: "language" });
      }
    }
  }
  if ("mute_role_id" in data) {
    const checked = id("role")(data.mute_role_id, ctx);
    if (!checked.ok) work.invalid.push({ setting: "mute_role_id", value: data.mute_role_id, reason: checked.reason });
    else {
      const from = shown("guilds", row, "mute_role_id");
      if (same(from, checked.value)) work.unchanged += 1;
      else {
        work.change.push({ setting: "mute_role_id", from, to: checked.value });
        parts.push({ row: { mute_role_id: checked.value } });
      }
    }
  }
  return { work, parts };
}
const IGNORED_ONE = { key: "Set from its own page of the dashboard." };
const IGNORED_MANY = { key: "Lists are not imported yet." };
const IGNORED_GUILD_COLUMNS = {
  prefix: { key: "It follows the first of the prefixes." },
  bot_nickname: { key: "Set from the Customize page (it changes Discord)." },
  bot_avatar_url: { key: "Set from the Customize page (it changes Discord)." },
  bot_banner_url: { key: "Set from the Customize page (it changes Discord)." },
  bot_description: { key: "Set from the Customize page (it changes Discord)." },
  bot_name_style: { key: "Set from the Customize page (it changes Discord)." }
};
const isMap = (value) => !!value && typeof value === "object" && !Array.isArray(value);
const GUILD_KEYS = new Set(GUILD_COLUMNS);
const HEADER_KEYS = /* @__PURE__ */ new Set(["guild_id", "updated_at", "exported_at"]);
function buildImportPlan(input) {
  const parsed = parseConfigFile(input.yaml);
  if (!parsed.ok) return parsed;
  const data = parsed.data;
  if ("guild_id" in data && String(data.guild_id) !== input.guildId) return fail("This file is from another server, so it cannot be imported here.");
  const ctx = { known: input.known ?? { roles: null, channels: null } };
  const modules = [];
  const ignored = [];
  const unknown = [];
  const writes = [];
  const noteUnknown = (path) => {
    if (unknown.length < 50) unknown.push(path);
  };
  const finish = (id2, title, path, table, work, parts) => {
    modules.push({ id: id2, title, path, changes: work.change, unchanged: work.unchanged, invalid: work.invalid, warnings: work.warnings });
    if (parts?.length) writes.push({ id: id2, table, parts });
    else if (Object.keys(work.row).length) writes.push({ id: id2, table, parts: [{ row: work.row }] });
  };
  const unreadable = (id2, title, path) => modules.push({ id: id2, title, path, changes: [], unchanged: 0, invalid: [], warnings: [], unreadable: true });
  const guildData = {};
  for (const key of ["prefixes", "language", "mute_role_id"]) if (key in data) guildData[key] = data[key];
  if (Object.keys(guildData).length) {
    if (input.rows.guilds === void 0) unreadable("guild", "Server settings", "");
    else {
      const { work, parts } = checkGuild(guildData, input.rows.guilds, ctx);
      finish("guild", "Server settings", "", "guilds", work, parts);
    }
  }
  for (const key of Object.keys(data)) {
    if (HEADER_KEYS.has(key) || key in guildData) continue;
    if (key === "bot_profile") {
      ignored.push({ path: key, reason: IGNORED_GUILD_COLUMNS.bot_nickname });
      continue;
    }
    if (GUILD_KEYS.has(key)) {
      ignored.push({ path: key, reason: IGNORED_GUILD_COLUMNS[key] ?? IGNORED_ONE });
      continue;
    }
    if (SECTIONS.some((section) => section.key === key)) continue;
    noteUnknown(key);
  }
  for (const section of SECTIONS) {
    if (!(section.key in data)) continue;
    const body = data[section.key];
    if (!isMap(body)) {
      noteUnknown(section.key);
      continue;
    }
    const levelingHere = section.key === "leveling";
    const levelingInput = {};
    for (const [key, value] of Object.entries(body)) {
      const path = `${section.key}.${key}`;
      if (key.endsWith("_count")) continue;
      const spec = SPECS.find((item) => item.path[0] === section.key && item.path[1] === key);
      if (spec) {
        if (!isMap(value)) {
          noteUnknown(path);
          continue;
        }
        if (input.rows[spec.table] === void 0) {
          unreadable(spec.id, spec.title, path);
          continue;
        }
        const work = checkWithRules(spec, value, input.rows[spec.table], ctx);
        for (const left of Object.keys(value)) if (!(left in spec.rules) && !left.endsWith("_count")) {
          const known = (CONFIG_SCHEMA[spec.table] ?? []).some((item) => item[0] === left);
          if (known) ignored.push({ path: `${path}.${left}`, reason: IGNORED_ONE });
          else noteUnknown(`${path}.${left}`);
        }
        finish(spec.id, spec.title, path, spec.table, work);
        continue;
      }
      if (levelingHere && LEVELING_COLUMNS.has(key)) {
        levelingInput[key] = value;
        continue;
      }
      const mod = section.modules.find((item) => item.key === key);
      if (mod) {
        ignored.push({ path, reason: mod.mode === "one" ? IGNORED_ONE : IGNORED_MANY });
        continue;
      }
      const flatModule = section.modules.find((item) => item.flat && (CONFIG_SCHEMA[item.table] ?? []).some((column) => column[0] === key));
      if (flatModule) {
        const flatPath = levelingHere ? path : `${section.key}.${flatModule.key}`;
        if (!ignored.some((item) => item.path === flatPath)) ignored.push({ path: flatPath, reason: IGNORED_ONE });
        continue;
      }
      noteUnknown(path);
    }
    if (levelingHere && Object.keys(levelingInput).length) {
      if (input.rows.level_config === void 0) unreadable("leveling", "Leveling settings", "leveling");
      else finish("leveling", "Leveling settings", "leveling", "level_config", checkLeveling(levelingInput, input.rows.level_config, ctx));
    }
  }
  const totals = {
    changes: modules.reduce((n, m) => n + m.changes.length, 0),
    unchanged: modules.reduce((n, m) => n + m.unchanged, 0),
    invalid: modules.reduce((n, m) => n + m.invalid.length, 0),
    ignored: ignored.length,
    unknown: unknown.length
  };
  return { ok: true, guildId: input.guildId, modules, ignored, unknown, totals, writes };
}
function publicPlan(plan) {
  const { writes: _writes, ...rest } = plan;
  return rest;
}
const IMPORT_TABLES = ["guilds", "automod_config", "level_config", "counting_config", "birthday_config"];

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const POST = async (context) => {
  const { id } = context.params;
  const origin = context.request.headers.get("origin");
  if (!origin || origin !== context.url.origin) return json({ ok: false, error: "origin" }, 403);
  const auth = await getGuildSession(context, id);
  if ("redirect" in auth) return json({ ok: false, error: "signin" }, 401);
  const dt = makeT(getDashLang(context));
  if (auth.devView || auth.access) return json({ ok: false, error: dt("Only the people who manage this server can import a file.") }, 403);
  const botToken = getEnv(context, "DISCORD_TOKEN");
  const apiUrl = getEnv(context, "PETTO_BOT_API_URL");
  const apiKey = getEnv(context, "PETTO_BOT_API_SECRET");
  if (!botToken || !apiUrl || !apiKey) return json({ ok: false, error: dt("Petto is not set up here yet.") }, 500);
  const length = Number(context.request.headers.get("content-length") ?? 0);
  if (length > MAX_FILE_BYTES + 16 * 1024) return json({ ok: false, error: dt("The file is too big (at most {n} KB).", { n: MAX_FILE_BYTES / 1024 }) }, 413);
  const body = await context.request.json().catch(() => null);
  const action = String(body?.action ?? "");
  if (!body || action !== "preview" && action !== "apply" || typeof body.yaml !== "string") return json({ ok: false, error: dt("This is not a configuration file.") }, 400);
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const [rowEntries, roles, channels] = await Promise.all([
    Promise.all(IMPORT_TABLES.map(async (table) => {
      try {
        const res = await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}&select=*`, { headers });
        if (!res.ok) return [table, void 0];
        const list = await res.json();
        return [table, (Array.isArray(list) ? list[0] : null) ?? null];
      } catch {
        return [table, void 0];
      }
    })),
    idsOf(context, id, botToken, "roles"),
    idsOf(context, id, botToken, "channels")
  ]);
  const rows = Object.fromEntries(rowEntries);
  const plan = buildImportPlan({ yaml: body.yaml, guildId: id, rows, known: { roles, channels } });
  if (!plan.ok) return json({ ok: false, error: say(dt, plan.error) }, 400);
  if (action === "preview") return json({ ok: true, plan: translate(plan, dt) });
  await ensureGuildRow(apiUrl, headers, id);
  const results = [];
  let wrote = false;
  for (const write of plan.writes) {
    const module = plan.modules.find((item) => item.id === write.id);
    let allOk = true;
    for (const part of write.parts) {
      const row = { guild_id: id, ...part.row };
      if (!("language" in part.row)) row.updated_at = (/* @__PURE__ */ new Date()).toISOString();
      const res = await fetch(`${apiUrl}/rest/v1/${write.table}?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(row)
      }).catch(() => null);
      if (!res || !res.ok) {
        allOk = false;
        continue;
      }
      wrote = true;
      if (part.after === "prefix") await syncPettoPrefix(context, id, part.row.prefixes).catch(() => {
      });
      if (part.after === "language") await syncPettoLanguage(context, id, String(part.row.language)).catch(() => {
      });
    }
    results.push({ id: write.id, ok: allOk, changes: module?.changes.length ?? 0 });
  }
  if (wrote && !deferGuildChange(id)) await bumpGuildVersion(id).catch(() => "");
  return json({ ok: results.every((item) => item.ok), results, plan: translate(plan, dt) });
};
async function idsOf(context, guildId, botToken, kind) {
  try {
    const res = await getGuildList(context, guildId, botToken, kind);
    if (!res.ok) return null;
    const list = await res.json();
    if (!Array.isArray(list)) return null;
    return new Set(list.map((item) => String(item?.id ?? "")).filter(Boolean));
  } catch {
    return null;
  }
}
const say = (dt, msg) => dt(msg.key, msg.vars);
function translate(plan, dt) {
  const open = publicPlan(plan);
  return {
    ...open,
    modules: open.modules.map((module) => ({
      ...module,
      title: dt(module.title),
      changes: module.changes.map((change) => ({ setting: change.setting, from: change.from, to: change.to, note: change.note ? say(dt, change.note) : void 0 })),
      invalid: module.invalid.map((item) => ({ setting: item.setting, value: item.value, reason: say(dt, item.reason) })),
      warnings: module.warnings.map((item) => ({ setting: item.setting, value: item.value, reason: say(dt, item.reason) }))
    })),
    ignored: open.ignored.map((item) => ({ path: item.path, reason: say(dt, item.reason) }))
  };
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
