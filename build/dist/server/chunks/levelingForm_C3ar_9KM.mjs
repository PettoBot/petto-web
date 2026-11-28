const INT_MAX = 2147483647;
const DEFAULT_NOTIFY_MESSAGE = "{EMOJI} {user} just leveled up to **{level}**!";
const DEFAULT_VOICE_NOTIFY_MESSAGE = "{EMOJI} {user} reached voice level **{level}**!";
const formNumber = (form, name, fallback) => {
  const raw = form.get(name);
  if (raw === null || String(raw).trim() === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
};
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const whole = (value) => Math.floor(value);
const parseMilestones = (value) => {
  const seen = /* @__PURE__ */ new Set();
  const list = [];
  for (const line of String(value ?? "").split(/\r?\n/)) {
    const match = /^\s*(\d{1,5})\s*[:|-]\s*(.+?)\s*$/.exec(line);
    if (!match) continue;
    const level = Number(match[1]);
    if (level < 1 || level > 1e4 || seen.has(level)) continue;
    seen.add(level);
    list.push({ level, message: match[2].slice(0, 1e3) });
    if (list.length >= 25) break;
  }
  return list.sort((a, b) => a.level - b.level);
};
const milestonesText = (value) => (Array.isArray(value) ? value : []).map((entry) => `${Number(entry.level)}: ${String(entry.message ?? "")}`).join("\n");
const memberIds = (values) => [...new Set(values.flatMap((value) => String(value).split(/[^0-9]+/)).filter((value) => /^\d{15,25}$/.test(value)))].slice(0, 100);
const ids = (values) => values.map(String).filter((value) => /^\d{15,25}$/.test(value)).slice(0, 100);
const cardName = (value) => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 40) || null;
const templateName = (value) => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_") || null;
const message = (value, fallback) => String(value ?? "").replace(/\r\n/g, "\n").trim().slice(0, 6e3) || fallback;
const minFor = (current, soft) => Number.isFinite(Number(current)) ? Math.min(soft, Number(current)) : soft;
const maxFor = (current, soft) => Number.isFinite(Number(current)) ? Math.max(soft, Number(current)) : soft;
function storedConfig(c) {
  return {
    enabled: c.enabled ?? false,
    xpMin: c.xp_min ?? 15,
    xpMax: c.xp_max ?? 25,
    xpPerVcMinute: c.xp_per_vc_minute ?? 5,
    cooldownSeconds: c.cooldown_seconds ?? 60,
    notifyMode: c.notify_mode ?? "reply",
    notifyChannelId: c.notify_channel_id ?? null,
    notifyMessage: c.notify_message ?? DEFAULT_NOTIFY_MESSAGE,
    notifyEmbed: c.notify_embed ?? false,
    notifyEmbedTemplate: c.notify_embed_template ?? "",
    notifyEvery: c.notify_every ?? 1,
    roleMode: c.role_mode ?? "highest",
    ignoredChannelIds: c.ignored_channel_ids ?? [],
    ignoredCategoryIds: c.ignored_category_ids ?? [],
    notifyReply: c.notify_reply ?? true,
    notifyPing: c.notify_ping ?? true,
    notifyDeleteAfter: c.notify_delete_after ?? 0,
    notifyMilestones: milestonesText(c.notify_milestones),
    joinXp: c.join_xp ?? 0,
    joinLevel: c.join_level ?? 0,
    curveA: c.curve_a ?? 1,
    curveB: c.curve_b ?? 50,
    curveC: c.curve_c ?? 100,
    difficulty: c.difficulty ?? 2.5,
    rounding: c.rounding ?? 50,
    maxLevel: c.max_level ?? 1e3
  };
}
function storedVoice(c, config) {
  return {
    enabled: c.voice_enabled ?? config.enabled,
    xpPerMinute: c.xp_per_vc_minute ?? 5,
    curveA: c.voice_curve_a ?? 1,
    curveB: c.voice_curve_b ?? 50,
    curveC: c.voice_curve_c ?? 100,
    difficulty: c.voice_difficulty ?? 2.5,
    rounding: c.voice_rounding ?? 50,
    maxLevel: c.voice_max_level ?? 1e3,
    notifyMode: c.voice_notify_mode ?? "off",
    notifyChannelId: c.voice_notify_channel_id ?? null,
    notifyMessage: c.voice_notify_message ?? DEFAULT_VOICE_NOTIFY_MESSAGE,
    notifyEmbed: c.voice_notify_embed ?? false,
    notifyEmbedTemplate: c.voice_notify_embed_template ?? "",
    notifyEvery: c.voice_notify_every ?? 1,
    roleMode: c.voice_role_mode ?? config.roleMode,
    ignoredChannelIds: c.voice_ignored_channel_ids ?? [],
    ignoredCategoryIds: c.voice_ignored_category_ids ?? [],
    notifyPing: c.voice_notify_ping ?? true,
    notifyDeleteAfter: c.voice_notify_delete_after ?? 0,
    notifyMilestones: milestonesText(c.voice_notify_milestones)
  };
}
const storedRank = (c) => ({
  style: c.rank_style ?? "card",
  card: c.rank_card ?? "",
  notifyCard: c.notify_card ?? "",
  voiceNotifyCard: c.voice_notify_card ?? ""
});
const storedRules = (c) => ({
  minMessageChars: c.min_message_chars ?? 3,
  antiRepeat: c.anti_repeat ?? true,
  dailyXpCap: c.daily_xp_cap ?? 0,
  voiceAlonePercent: c.voice_alone_percent ?? 100,
  voiceMinMembers: c.voice_min_members ?? 1,
  voiceIgnoreMuted: c.voice_ignore_muted ?? false,
  dailyBonusXp: c.daily_bonus_xp ?? 0,
  streakBonusXp: c.streak_bonus_xp ?? 0,
  streakMaxDays: c.streak_max_days ?? 7,
  xpMultiplier: Number(c.xp_multiplier ?? 1),
  multiplierMode: c.multiplier_mode ?? "highest",
  multiplierCap: Number(c.multiplier_cap ?? 20),
  voteBoost: c.vote_boost_enabled ?? true,
  keepXp: c.keep_xp ?? false,
  restoreRoles: c.restore_roles ?? true,
  noXpRoleIds: c.no_xp_role_ids ?? [],
  noXpUserIds: c.no_xp_user_ids ?? [],
  onlyXpRoleIds: c.only_xp_role_ids ?? []
});
const storedBoard = (c) => ({ enabled: c.leaderboard_public ?? false, slug: c.leaderboard_slug ?? "", joinUrl: c.leaderboard_join_url ?? "" });
function readConfigForm(form) {
  return {
    enabled: form.get("enabled") === "on",
    xp_min: clamp(formNumber(form, "xp_min", 15), 0, INT_MAX),
    xp_max: clamp(formNumber(form, "xp_max", 25), 0, INT_MAX),
    cooldown_seconds: clamp(formNumber(form, "cooldown_seconds", 60), 0, INT_MAX),
    xp_per_vc_minute: clamp(formNumber(form, "xp_per_vc_minute", 5), 0, INT_MAX),
    role_mode: String(form.get("role_mode") ?? "highest"),
    notify_mode: String(form.get("notify_mode") ?? "reply"),
    notify_channel_id: String(form.get("notify_channel_id") ?? "").trim() || null,
    notify_message: message(form.get("notify_message"), DEFAULT_NOTIFY_MESSAGE),
    notify_embed: form.get("notify_embed") === "on",
    notify_embed_template: templateName(form.get("notify_embed_template")),
    notify_every: clamp(whole(formNumber(form, "notify_every", 1)), 1, INT_MAX),
    ignored_channel_ids: form.getAll("ignored_channel_ids").map(String),
    ignored_category_ids: ids(form.getAll("ignored_category_ids")),
    notify_reply: form.get("notify_reply") === "on",
    notify_ping: form.get("notify_ping") === "on",
    notify_delete_after: clamp(whole(formNumber(form, "notify_delete_after", 0)), 0, 86400),
    notify_milestones: parseMilestones(form.get("notify_milestones")),
    join_xp: clamp(formNumber(form, "join_xp", 0), 0, INT_MAX),
    join_level: clamp(formNumber(form, "join_level", 0), 0, INT_MAX),
    curve_a: Math.max(0, formNumber(form, "curve_a", 1)),
    curve_b: Math.max(0, formNumber(form, "curve_b", 50)),
    curve_c: Math.max(0, formNumber(form, "curve_c", 100)),
    difficulty: Math.max(0.1, formNumber(form, "difficulty", 2.5)),
    rounding: clamp(formNumber(form, "rounding", 50), 0, INT_MAX),
    max_level: clamp(formNumber(form, "max_level", 1e3), 1, INT_MAX)
  };
}
function readVoiceForm(form) {
  return {
    voice_enabled: form.get("voice_enabled") === "on",
    xp_per_vc_minute: clamp(formNumber(form, "voice_xp_per_minute", 5), 0, INT_MAX),
    voice_curve_a: Math.max(0, formNumber(form, "voice_curve_a", 1)),
    voice_curve_b: Math.max(0, formNumber(form, "voice_curve_b", 50)),
    voice_curve_c: Math.max(0, formNumber(form, "voice_curve_c", 100)),
    voice_difficulty: Math.max(0.1, formNumber(form, "voice_difficulty", 2.5)),
    voice_rounding: clamp(formNumber(form, "voice_rounding", 50), 0, INT_MAX),
    voice_max_level: clamp(formNumber(form, "voice_max_level", 1e3), 1, INT_MAX),
    voice_notify_mode: String(form.get("voice_notify_mode") ?? "off"),
    voice_notify_channel_id: String(form.get("voice_notify_channel_id") ?? "").trim() || null,
    voice_notify_message: message(form.get("voice_notify_message"), DEFAULT_VOICE_NOTIFY_MESSAGE),
    voice_notify_embed: form.get("voice_notify_embed") === "on",
    voice_notify_embed_template: templateName(form.get("voice_notify_embed_template")),
    voice_notify_every: clamp(whole(formNumber(form, "voice_notify_every", 1)), 1, INT_MAX),
    voice_role_mode: String(form.get("voice_role_mode") ?? "highest"),
    voice_ignored_channel_ids: form.getAll("voice_ignored_channel_ids").map(String),
    voice_ignored_category_ids: ids(form.getAll("voice_ignored_category_ids")),
    voice_notify_ping: form.get("voice_notify_ping") === "on",
    voice_notify_delete_after: clamp(whole(formNumber(form, "voice_notify_delete_after", 0)), 0, 86400),
    voice_notify_milestones: parseMilestones(form.get("voice_notify_milestones"))
  };
}
function readRankForm(form) {
  const style = String(form.get("rank_style") ?? "card");
  return {
    rank_style: ["card", "embed", "both"].includes(style) ? style : "card",
    rank_card: cardName(form.get("rank_card")),
    notify_card: cardName(form.get("notify_card")),
    voice_notify_card: cardName(form.get("voice_notify_card"))
  };
}
function readRulesForm(form) {
  const row = {
    min_message_chars: clamp(whole(formNumber(form, "min_message_chars", 3)), 0, 200),
    anti_repeat: form.get("anti_repeat") === "on",
    voice_min_members: clamp(whole(formNumber(form, "voice_min_members", 1)), 1, 20),
    voice_ignore_muted: form.get("voice_ignore_muted") === "on",
    daily_bonus_xp: clamp(whole(formNumber(form, "daily_bonus_xp", 0)), 0, 1e5),
    streak_bonus_xp: clamp(whole(formNumber(form, "streak_bonus_xp", 0)), 0, 1e4),
    streak_max_days: clamp(whole(formNumber(form, "streak_max_days", 7)), 1, 365),
    xp_multiplier: clamp(Math.round(formNumber(form, "xp_multiplier", 1) * 100) / 100, 0, 20),
    multiplier_mode: ["highest", "stack", "sum"].includes(String(form.get("multiplier_mode"))) ? String(form.get("multiplier_mode")) : "highest",
    multiplier_cap: clamp(Math.round(formNumber(form, "multiplier_cap", 20) * 100) / 100, 1, 100),
    keep_xp: form.get("keep_xp") === "on",
    restore_roles: form.get("restore_roles") === "on",
    no_xp_role_ids: ids(form.getAll("no_xp_role_ids")),
    only_xp_role_ids: ids(form.getAll("only_xp_role_ids"))
  };
  const newest = {
    daily_xp_cap: clamp(whole(formNumber(form, "daily_xp_cap", 0)), 0, 1e6),
    voice_alone_percent: clamp(whole(formNumber(form, "voice_alone_percent", 100)), 0, 100),
    vote_boost_enabled: form.get("vote_boost") === "on",
    no_xp_user_ids: memberIds(form.getAll("no_xp_user_ids"))
  };
  return { row, newest };
}
function readBoardForm(form) {
  const slug = String(form.get("leaderboard_slug") ?? "").trim().toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "").slice(0, 32);
  const joinUrl = String(form.get("leaderboard_join_url") ?? "").trim().slice(0, 200);
  let joinOk = true;
  if (joinUrl) {
    try {
      joinOk = new URL(joinUrl).protocol === "https:";
    } catch {
      joinOk = false;
    }
  }
  if (slug && !/^[a-z0-9][a-z0-9-]{1,31}$/.test(slug)) return { error: "slug" };
  if (!joinOk) return { error: "join" };
  return { row: { leaderboard_public: form.get("leaderboard_public") === "on", leaderboard_slug: slug || null, leaderboard_join_url: joinUrl || null } };
}
const on = (entries, name, value) => {
  if (value) entries.push([name, "on"]);
};
const many = (entries, name, values) => {
  for (const value of values) entries.push([name, String(value)]);
};
const text = (entries, name, value) => entries.push([name, value === null || value === void 0 ? "" : String(value)]);
function configFormEntries(config) {
  const e = [];
  on(e, "enabled", config.enabled);
  text(e, "xp_min", config.xpMin);
  text(e, "xp_max", config.xpMax);
  text(e, "cooldown_seconds", config.cooldownSeconds);
  text(e, "xp_per_vc_minute", config.xpPerVcMinute);
  text(e, "role_mode", config.roleMode);
  text(e, "notify_mode", config.notifyMode);
  text(e, "notify_channel_id", config.notifyChannelId);
  text(e, "notify_message", config.notifyMessage);
  on(e, "notify_embed", config.notifyEmbed);
  text(e, "notify_embed_template", config.notifyEmbedTemplate);
  text(e, "notify_every", config.notifyEvery);
  many(e, "ignored_channel_ids", config.ignoredChannelIds);
  many(e, "ignored_category_ids", config.ignoredCategoryIds);
  on(e, "notify_reply", config.notifyReply);
  on(e, "notify_ping", config.notifyPing);
  text(e, "notify_delete_after", config.notifyDeleteAfter);
  text(e, "notify_milestones", config.notifyMilestones);
  text(e, "join_xp", config.joinXp);
  text(e, "join_level", config.joinLevel);
  text(e, "curve_a", config.curveA);
  text(e, "curve_b", config.curveB);
  text(e, "curve_c", config.curveC);
  text(e, "difficulty", config.difficulty);
  text(e, "rounding", config.rounding);
  text(e, "max_level", config.maxLevel);
  return e;
}
function voiceFormEntries(voice) {
  const e = [];
  on(e, "voice_enabled", voice.enabled);
  text(e, "voice_xp_per_minute", voice.xpPerMinute);
  text(e, "voice_role_mode", voice.roleMode);
  text(e, "voice_notify_mode", voice.notifyMode);
  text(e, "voice_notify_channel_id", voice.notifyChannelId);
  text(e, "voice_notify_message", voice.notifyMessage);
  text(e, "voice_notify_embed_template", voice.notifyEmbedTemplate);
  text(e, "voice_notify_every", voice.notifyEvery);
  text(e, "voice_notify_delete_after", voice.notifyDeleteAfter);
  on(e, "voice_notify_ping", voice.notifyPing);
  text(e, "voice_notify_milestones", voice.notifyMilestones);
  on(e, "voice_notify_embed", voice.notifyEmbed);
  many(e, "voice_ignored_channel_ids", voice.ignoredChannelIds);
  many(e, "voice_ignored_category_ids", voice.ignoredCategoryIds);
  text(e, "voice_curve_a", voice.curveA);
  text(e, "voice_curve_b", voice.curveB);
  text(e, "voice_curve_c", voice.curveC);
  text(e, "voice_difficulty", voice.difficulty);
  text(e, "voice_rounding", voice.rounding);
  text(e, "voice_max_level", voice.maxLevel);
  return e;
}
function rankFormEntries(rank) {
  const e = [];
  text(e, "rank_style", rank.style);
  text(e, "rank_card", rank.card);
  text(e, "notify_card", rank.notifyCard);
  text(e, "voice_notify_card", rank.voiceNotifyCard);
  return e;
}
function rulesFormEntries(rules) {
  const e = [];
  text(e, "min_message_chars", rules.minMessageChars);
  text(e, "daily_xp_cap", rules.dailyXpCap);
  on(e, "anti_repeat", rules.antiRepeat);
  text(e, "voice_min_members", rules.voiceMinMembers);
  text(e, "voice_alone_percent", rules.voiceAlonePercent);
  on(e, "voice_ignore_muted", rules.voiceIgnoreMuted);
  text(e, "daily_bonus_xp", rules.dailyBonusXp);
  text(e, "streak_bonus_xp", rules.streakBonusXp);
  text(e, "streak_max_days", rules.streakMaxDays);
  text(e, "xp_multiplier", rules.xpMultiplier);
  text(e, "multiplier_mode", rules.multiplierMode);
  text(e, "multiplier_cap", rules.multiplierCap);
  many(e, "no_xp_role_ids", rules.noXpRoleIds);
  many(e, "only_xp_role_ids", rules.onlyXpRoleIds);
  text(e, "no_xp_user_ids", rules.noXpUserIds.join("\n"));
  on(e, "vote_boost", rules.voteBoost);
  on(e, "restore_roles", rules.restoreRoles);
  on(e, "keep_xp", rules.keepXp);
  return e;
}
function boardFormEntries(board) {
  const e = [];
  on(e, "leaderboard_public", board.enabled);
  text(e, "leaderboard_slug", board.slug);
  text(e, "leaderboard_join_url", board.joinUrl);
  return e;
}
function keepChosen(options, chosen, label) {
  const known = new Set(options.map((option) => option.id));
  return [...options.map(({ id, name }) => ({ id, name })), ...chosen.filter((id) => !known.has(id)).map((id) => ({ id, name: label(id) }))];
}

export { INT_MAX as I, readVoiceForm as a, storedVoice as b, configFormEntries as c, readRankForm as d, rankFormEntries as e, storedRank as f, readRulesForm as g, rulesFormEntries as h, storedRules as i, boardFormEntries as j, maxFor as k, keepChosen as l, minFor as m, readBoardForm as n, formNumber as o, storedBoard as p, readConfigForm as r, storedConfig as s, voiceFormEntries as v };
