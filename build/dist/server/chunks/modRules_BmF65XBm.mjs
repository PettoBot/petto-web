const TRIGGER_TYPES = [
  "words",
  "regex",
  "links",
  "invites",
  "mentions",
  "caps",
  "emojis",
  "repeated",
  "rate",
  "attachments",
  "length",
  "zalgo",
  "repeated_chars",
  "channel_rate",
  "mention_rate",
  "attachment_rate",
  "link_rate",
  "name",
  "violations",
  "heat"
];
const CONDITION_TYPES = ["channel", "category", "role", "account_age", "member_age", "no_roles", "author_kind", "message_kind", "thread"];
const EFFECT_TYPES = [
  "delete",
  "reply",
  "dm",
  "warn",
  "timeout",
  "kick",
  "ban",
  "add_role",
  "remove_role",
  "purge",
  "slowmode",
  "alert",
  "set_nickname",
  "temp_role",
  "violation",
  "reset_violations",
  "add_heat",
  "reset_heat",
  "quarantine",
  "lockdown"
];
const LIMITS = { words: 5e3, domains: 1e3, ids: 50, triggers: 10, conditions: 10, effects: 10, rulesPerSet: 50, rulesets: 20, lists: 30, text: 500, regex: 200, listName: 60, counterName: 40 };
const asObject = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
const int = (value, min, max, fallback) => {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
};
const SNOWFLAKE = /^\d{15,25}$/;
const ids = (value) => Array.isArray(value) ? [...new Set(value.map(String).filter((v) => SNOWFLAKE.test(v)))].slice(0, LIMITS.ids) : [];
const oneOf = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
const text = (value, max) => String(value ?? "").replace(/\u0000/g, "").replace(/\r\n?/g, "\n").trim().slice(0, max);
const channelOrNone = (value) => SNOWFLAKE.test(String(value ?? "")) ? String(value) : "";
const counterName = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, LIMITS.counterName) || "default";
function safeRegex(pattern) {
  const source = String(pattern ?? "");
  if (!source || source.length > LIMITS.regex) return null;
  if (/\([^)]*[+*][^)]*\)[+*{]/.test(source) || /\\[1-9]/.test(source) || /\(\?[=!<]/.test(source)) return null;
  try {
    return new RegExp(source, "iu");
  } catch {
    return null;
  }
}
const cleanDomain = (value) => value.trim().toLowerCase().replace(/^[a-z]+:\/\//, "").replace(/^www\./, "").replace(/[/?#].*$/, "").replace(/:\d+$/, "");
const cleanDomains = (list) => Array.isArray(list) ? [...new Set(list.map((item) => cleanDomain(String(item))).filter((d) => /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(d)))].slice(0, LIMITS.domains) : [];
const cleanWords = (list) => Array.isArray(list) ? [...new Set(list.map((item) => text(item, 80).replace(/\n/g, " ")).filter(Boolean))].slice(0, LIMITS.words) : [];
function cleanTrigger(raw) {
  const o = asObject(raw);
  if (!TRIGGER_TYPES.includes(o.type)) return null;
  const type = o.type;
  const list = Number(o.list_id) > 0 ? Number(o.list_id) : null;
  switch (type) {
    case "words":
      return { type, list_id: list, words: cleanWords(o.words), match: oneOf(o.match, ["contains", "word", "exact"], "word") };
    case "regex":
      return safeRegex(o.pattern) ? { type, pattern: String(o.pattern) } : null;
    case "links":
      return { type, mode: oneOf(o.mode, ["any", "deny", "allow"], "any"), list_id: list, domains: cleanDomains(o.domains) };
    case "invites":
      return { type };
    case "mentions":
      return { type, kind: oneOf(o.kind, ["any", "users", "roles", "everyone"], "any"), max: int(o.max, 0, 100, 5) };
    case "caps":
      return { type, percent: int(o.percent, 30, 100, 70), min_length: int(o.min_length, 5, 500, 12) };
    case "emojis":
      return { type, max: int(o.max, 1, 200, 10) };
    case "repeated":
      return { type, times: int(o.times, 2, 20, 3), seconds: int(o.seconds, 3, 600, 30) };
    case "rate":
      return { type, messages: int(o.messages, 2, 50, 6), seconds: int(o.seconds, 2, 120, 8) };
    case "attachments":
      return { type, kind: oneOf(o.kind, ["any", "images", "files"], "any"), max: int(o.max, 0, 20, 0) };
    case "length":
      return { type, max_chars: int(o.max_chars, 0, 4e3, 0), max_lines: int(o.max_lines, 0, 200, 0) };
    case "zalgo":
      return { type, max: int(o.max, 3, 100, 8) };
    case "repeated_chars":
      return { type, max: int(o.max, 3, 100, 10) };
    case "channel_rate":
      return { type, messages: int(o.messages, 3, 200, 20), seconds: int(o.seconds, 2, 300, 10) };
    case "mention_rate":
      return { type, mentions: int(o.mentions, 2, 200, 10), seconds: int(o.seconds, 2, 300, 10) };
    case "attachment_rate":
      return { type, attachments: int(o.attachments, 2, 100, 6), seconds: int(o.seconds, 2, 300, 30) };
    case "link_rate":
      return { type, links: int(o.links, 2, 100, 5), seconds: int(o.seconds, 2, 300, 30) };
    case "name": {
      const match = oneOf(o.match, ["contains", "word", "exact", "regex"], "contains");
      if (match === "regex" && !safeRegex(o.pattern)) return null;
      return { type, where: oneOf(o.where, ["username", "nickname", "either"], "either"), match, list_id: list, words: cleanWords(o.words), pattern: match === "regex" ? String(o.pattern) : "" };
    }
    case "violations":
      return { type, name: counterName(o.name), count: int(o.count, 1, 100, 4), minutes: int(o.minutes, 1, 1440, 60) };
    case "heat":
      return { type, at_least: int(o.at_least, 1, 1e4, 100) };
  }
  return null;
}
function cleanCondition(raw) {
  const o = asObject(raw);
  if (!CONDITION_TYPES.includes(o.type)) return null;
  const type = o.type;
  switch (type) {
    case "channel":
    case "category":
      return { type, mode: oneOf(o.mode, ["in", "not_in"], "not_in"), ids: ids(o.ids) };
    case "role":
      return { type, mode: oneOf(o.mode, ["has_any", "has_all", "has_none"], "has_none"), ids: ids(o.ids) };
    case "account_age":
    case "member_age":
      return { type, max_days: int(o.max_days, 1, 3650, 7) };
    case "no_roles":
      return { type };
    case "author_kind":
      return { type, kind: oneOf(o.kind, ["humans", "bots"], "humans") };
    case "message_kind":
      return { type, kind: oneOf(o.kind, ["new", "edited"], "new") };
    case "thread":
      return { type, mode: oneOf(o.mode, ["only", "ignore"], "ignore") };
  }
  return null;
}
function cleanEffect(raw) {
  const o = asObject(raw);
  if (!EFFECT_TYPES.includes(o.type)) return null;
  const type = o.type;
  switch (type) {
    case "delete":
    case "kick":
    case "reset_heat":
    case "quarantine":
      return { type };
    case "reply":
      return { type, text: text(o.text, LIMITS.text), delete_after: int(o.delete_after, 0, 600, 10) };
    case "dm":
      return { type, text: text(o.text, LIMITS.text) };
    case "warn":
      return { type, reason: text(o.reason, 200) };
    case "timeout":
      return { type, minutes: int(o.minutes, 1, 40320, 10), multiplier: int(o.multiplier, 1, 10, 1), max_minutes: int(o.max_minutes, 1, 40320, 40320), window_hours: int(o.window_hours, 1, 720, 168) };
    case "ban":
      return { type, reason: text(o.reason, 200), delete_days: int(o.delete_days, 0, 7, 0) };
    case "add_role":
    case "remove_role":
      return SNOWFLAKE.test(String(o.role_id ?? "")) ? { type, role_id: String(o.role_id) } : null;
    case "purge":
      return { type, count: int(o.count, 2, 100, 10), minutes: int(o.minutes, 1, 1440, 10) };
    case "slowmode":
      return { type, seconds: int(o.seconds, 1, 21600, 10), minutes: int(o.minutes, 1, 1440, 10) };
    case "alert":
      return { type, channel_id: channelOrNone(o.channel_id), text: text(o.text, LIMITS.text) };
    case "set_nickname":
      return { type, nickname: text(o.nickname, 32) };
    case "temp_role":
      return SNOWFLAKE.test(String(o.role_id ?? "")) ? { type, role_id: String(o.role_id), minutes: int(o.minutes, 1, 43200, 60) } : null;
    case "violation":
    case "reset_violations":
      return { type, name: counterName(o.name) };
    case "add_heat":
      return { type, amount: int(o.amount, 1, 1e3, 20) };
    case "lockdown":
      return { type, minutes: int(o.minutes, 1, 720, 10) };
  }
  return null;
}
const cleanList = (raw, clean, max) => Array.isArray(raw) ? raw.map(clean).filter((item) => item !== null).slice(0, max) : [];
function cleanRule(raw) {
  const o = asObject(raw);
  const name = text(o.name, LIMITS.listName);
  if (!name) return { ok: false, error: "name" };
  const triggers = cleanList(o.triggers, cleanTrigger, LIMITS.triggers);
  if (!triggers.length) return { ok: false, error: "triggers" };
  const effects = cleanList(o.effects, cleanEffect, LIMITS.effects);
  if (!effects.length) return { ok: false, error: "effects" };
  return {
    ok: true,
    rule: {
      name,
      enabled: o.enabled !== false,
      dry_run: o.dry_run === true,
      trigger_mode: oneOf(o.trigger_mode, ["any", "all"], "any"),
      triggers,
      effects,
      conditions: cleanList(o.conditions, cleanCondition, LIMITS.conditions),
      threshold_count: int(o.threshold_count, 1, 50, 1),
      threshold_minutes: int(o.threshold_minutes, 1, 1440, 10),
      stop: o.stop !== false
    }
  };
}
const cleanConditions = (raw) => cleanList(raw, cleanCondition, LIMITS.conditions);
const GATE_ACTIONS = ["none", "alert", "timeout", "kick", "ban", "quarantine"];
const RAID_ACTIONS = ["alert", "lockdown", "kick_new", "ban_new"];
function cleanJoinGate(raw) {
  const o = asObject(raw);
  return {
    enabled: o.enabled === true,
    no_avatar_action: oneOf(o.no_avatar_action, GATE_ACTIONS, "none"),
    account_age_days: int(o.account_age_days, 0, 365, 0),
    account_age_action: oneOf(o.account_age_action, GATE_ACTIONS, "none"),
    username_list_id: Number(o.username_list_id) > 0 ? Number(o.username_list_id) : null,
    username_words: cleanWords(o.username_words),
    username_action: oneOf(o.username_action, GATE_ACTIONS, "none"),
    timeout_minutes: int(o.timeout_minutes, 1, 40320, 60),
    raid_joins: int(o.raid_joins, 0, 500, 0),
    raid_seconds: int(o.raid_seconds, 5, 600, 30),
    raid_action: oneOf(o.raid_action, RAID_ACTIONS, "alert"),
    raid_lockdown_minutes: int(o.raid_lockdown_minutes, 1, 720, 10),
    raid_alert_channel_id: channelOrNone(o.raid_alert_channel_id)
  };
}

export { GATE_ACTIONS as G, LIMITS as L, RAID_ACTIONS as R, cleanDomains as a, cleanWords as b, cleanJoinGate as c, cleanConditions as d, cleanRule as e };
