import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, u as unescapeHTML, b as addAttribute, F as Fragment, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$VariableHelp } from '../../../../chunks/VariableHelp_CRlEe6IW.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$SelectSource } from '../../../../chunks/SelectSource_Dp8aydFk.mjs';
import { $ as $$SelectChosen } from '../../../../chunks/SelectChosen_B0lELVHS.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DurationScript } from '../../../../chunks/DurationScript_BO_8qKfV.mjs';
import { f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
import { c as configFormEntries, v as voiceFormEntries, e as rankFormEntries, h as rulesFormEntries, j as boardFormEntries, m as minFor, k as maxFor, l as keepChosen, r as readConfigForm, n as readBoardForm, a as readVoiceForm, d as readRankForm, g as readRulesForm, I as INT_MAX, o as formNumber, s as storedConfig, p as storedBoard, b as storedVoice, f as storedRank, i as storedRules } from '../../../../chunks/levelingForm_C3ar_9KM.mjs';
import { g as getDashLang, a as dashLocale, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                             */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getMemberProfiles, m as memberAvatarUrl } from '../../../../chunks/memberNames_skiCoAs8.mjs';
export { renderers } from '../../../../renderers.mjs';

const ctxFromEntries = (entries, flags = {}, channelName) => ({
  v: (name) => entries.find(([key]) => key === name)?.[1] ?? "",
  on: (name) => entries.some(([key]) => key === name),
  flag: (name) => Boolean(flags[name]),
  channelName
});
const num = (ctx, name) => {
  const value = Number.parseFloat(ctx.v(name));
  return Number.isFinite(value) ? value : 0;
};
const format = (template, args = {}) => String(template ?? "").replace(/\{(\w+)\}/g, (_, key) => String(args[key] ?? ""));
function statusParts(kind, ctx, L) {
  const f = (key, args) => format(L[key] ?? key, args);
  const parts = [];
  if (kind === "settings" || kind === "voice") {
    const p = kind === "voice" ? "voice_" : "";
    const enabled = ctx.on(kind === "voice" ? "voice_enabled" : "enabled");
    parts.push(enabled ? f("statusOn") : f("statusOff"));
    if (!enabled) return parts;
    parts.push(kind === "voice" ? f("statusVoiceXp", { a: num(ctx, "voice_xp_per_minute") }) : f("statusXp", { a: num(ctx, "xp_min"), b: num(ctx, "xp_max") }));
    const mode = ctx.v(`${p}notify_mode`) || (kind === "voice" ? "off" : "reply");
    if (mode === "off") parts.push(f("statusAnnounceOff"));
    else {
      const where = mode === "dm" ? f("statusDm") : mode === "channel" ? ctx.v(`${p}notify_channel_id`) ? f("statusChannel", { a: ctx.channelName?.(ctx.v(`${p}notify_channel_id`)) ?? ctx.v(`${p}notify_channel_id`) }) : f("statusChannelUnset") : f("statusReply");
      parts.push(where);
      const every = Math.max(1, Math.floor(num(ctx, `${p}notify_every`)) || 1);
      if (every > 1) parts.push(f("statusEvery", { a: every }));
      if (ctx.v(`${p}notify_embed_template`)) parts.push(f("statusTemplate", { a: ctx.v(`${p}notify_embed_template`) }));
      else if (ctx.on(`${p}notify_embed`)) parts.push(f("statusEmbed"));
    }
  } else if (kind === "rank") {
    const style = ctx.v("rank_style");
    parts.push(style === "embed" ? f("statusRankEmbed") : style === "both" ? f("statusRankBoth") : f("statusRankCard"));
    if (ctx.v("notify_card")) parts.push(f("statusLevelCard", { a: ctx.v("notify_card") }));
  } else if (kind === "rules") {
    const chars = num(ctx, "min_message_chars");
    parts.push(chars > 0 ? f("statusMinChars", { a: chars }) : f("statusAnyMessage"));
    const cap = num(ctx, "daily_xp_cap");
    parts.push(cap > 0 ? f("statusDailyCap", { a: cap }) : f("statusNoCap"));
    const people = num(ctx, "voice_min_members");
    if (people >= 2) parts.push(f("statusVoicePeople", { a: people }));
    const bonus = num(ctx, "daily_bonus_xp");
    if (bonus > 0) parts.push(f("statusDailyBonus", { a: bonus }));
  } else {
    parts.push(ctx.on("leaderboard_public") ? f("statusBoardOn") : f("statusBoardOff"));
  }
  return parts;
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashLeveling = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashLeveling;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const dth = makeT(dashLang, true);
  const { multipliers = [], categories = [] } = Astro2.props;
  const { user, guildId, guildName, guildIcon, config, rewards, roles, channels, voiceChannels, leaderboard, voiceConfig, voiceLeaderboard, embedTemplateNames, rank, rules, cards, events, saved, saveError, publicBoard, boardError, section } = Astro2.props;
  const sectionMeta = { settings: dt("Leveling settings"), voice: dt("Voice leveling"), rank: dt("Rank card"), rules: dt("Rules and events"), multipliers: dt("Multipliers"), rewards: dt("Level rewards"), leaderboard: dt("Leaderboard"), "leaderboard-voice": dt("Voice leaderboard") };
  const voiceXpHint = [
    rules.voiceMinMembers <= 1 ? dt("Voice XP is earned also when you are alone. Deafened members and the server's AFK channel never earn it.") : dt("Voice XP needs at least {a} people in the channel. Deafened members and the server's AFK channel never earn it.", { a: rules.voiceMinMembers }),
    rules.voiceIgnoreMuted ? dt("Muted members do not earn it either.") : ""
  ].filter(Boolean).join(" ");
  const ruleProfiles = [
    { id: "relaxed", name: dt("Relaxed"), text: dt("Everything counts, even short messages and repeats. Voice earns alone, at full XP."), icon: "ph:sun-fill", values: { min_message_chars: 0, anti_repeat: false, daily_xp_cap: 0, voice_min_members: 1, voice_alone_percent: 100, voice_ignore_muted: false } },
    { id: "balanced", name: dt("Balanced"), text: dt("Short messages and repeats earn nothing. Voice earns alone, at half XP."), icon: "ph:scales-fill", values: { min_message_chars: 3, anti_repeat: true, daily_xp_cap: 0, voice_min_members: 1, voice_alone_percent: 50, voice_ignore_muted: false } },
    { id: "strict", name: dt("Strict"), text: dt("Longer messages, a daily limit, and voice only with company and the microphone on."), icon: "ph:shield-check-fill", values: { min_message_chars: 8, anti_repeat: true, daily_xp_cap: 1500, voice_min_members: 2, voice_alone_percent: 0, voice_ignore_muted: true } }
  ];
  const chatSummary = [
    rules.minMessageChars > 0 ? dt("Messages shorter than {a} characters earn nothing.", { a: rules.minMessageChars }) : dt("Every message counts, however short."),
    rules.antiRepeat ? dt("The same text again within a minute earns nothing.") : "",
    rules.dailyXpCap > 0 ? dt("At most {a} XP a day from messages.", { a: rules.dailyXpCap.toLocaleString(dashLocale(dashLang)) }) : dt("No daily limit.")
  ].filter(Boolean).join(" ");
  const boardLink = `${Astro2.url.origin}/lb/${publicBoard?.slug || guildId}`;
  const boardErrors = {
    slug: dt("The name for the address needs 2 to 32 letters, numbers or dashes."),
    join: dt("The join link has to start with https://."),
    taken: dt("That name is already used by another server. Choose a different one."),
    save: dt("Could not save these changes. Check the API response and try again.")
  };
  const selectedSection = sectionMeta[section ?? ""] ? section ?? "" : "settings";
  const selectedTitle = sectionMeta[selectedSection];
  const leaderboardIsVoice = selectedSection === "leaderboard-voice";
  const displayLeaderboard = leaderboardIsVoice ? voiceLeaderboard : leaderboard;
  const boardCount = displayLeaderboard.length;
  const boardTopLevel = displayLeaderboard.reduce((top, row) => Math.max(top, row.level), 0);
  const boardXp = displayLeaderboard.reduce((sum, row) => sum + row.xp, 0);
  const boardMinutes = displayLeaderboard.reduce((sum, row) => sum + (row.voiceMinutes ?? 0), 0);
  const roleName = (roleId) => roles.find((role) => role.id === roleId)?.name ?? roleId;
  const channelName = (channelId) => {
    const found = channels.find((c) => c.id === channelId) ?? voiceChannels.find((c) => c.id === channelId) ?? categories.find((c) => c.id === channelId);
    return found ? found.name : channelId;
  };
  const multiplierLabel = (row) => row.type === "role" ? `@${roleName(row.targetId)}` : row.type === "category" ? `${channelName(row.targetId)} (${dt("category")})` : `#${channelName(row.targetId)}`;
  const rankCards = cards.filter((card) => card.kind === "rank");
  const sourceLabel = (source) => source === "text" ? dt("Messages only") : source === "voice" ? dt("Voice only") : dt("All XP");
  const eventTime = (value) => new Date(value).toISOString().replace("T", " ").slice(0, 16) + " UTC";
  const eventRunning = (event) => new Date(event.startsAt).getTime() <= Date.now();
  const curvePreviewLevels = [1, 2, 3, 4, 5, 7, 10, 25, 50, 100, 200];
  const curveNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const curveA = curveNumber(config.curveA, 1);
  const curveB = curveNumber(config.curveB, 50);
  const curveC = curveNumber(config.curveC, 100);
  const curveDifficulty = curveNumber(config.difficulty, 2.5);
  const curveRounding = Math.max(1, curveNumber(config.rounding, 50));
  const curveTotal = (level) => {
    if (level <= 0) return 0;
    const raw = (curveA * level ** 3 + curveB * level ** 2 + curveC * level) * curveDifficulty;
    return Math.round(raw / curveRounding) * curveRounding;
  };
  const curveMax = Math.max(curveTotal(50), 1);
  const curveX = (level) => 44 + level / 50 * 556;
  const curveY = (value) => 240 - value / curveMax * 216;
  const curvePath = Array.from({ length: 51 }, (_, level) => `${level ? "L" : "M"}${curveX(level).toFixed(1)} ${curveY(curveTotal(level)).toFixed(1)}`).join(" ");
  const curveMessages = (level) => Math.max(0, Math.ceil(curveTotal(level) / Math.max(curveNumber(config.xpMax, 25), 1)));
  const curveCooldown = (level) => Math.max(0, Math.round(curveMessages(level) * curveNumber(config.cooldownSeconds, 60)));
  const formatCurve = (value) => Math.max(0, Math.round(value)).toLocaleString(dashLocale(dashLang));
  const formatCooldown = (value) => `~${formatDuration(value, { locale: dashLocale(dashLang) })}`;
  const leaderboardProgress = (row, voice = false) => {
    const total = voice ? voiceCurveTotal : curveTotal;
    const current = total(row.level);
    const next = total(row.level + 1);
    if (next <= current) return 100;
    return Math.min(100, Math.max(0, (row.xp - current) / (next - current) * 100));
  };
  const voiceCurveTotal = (level) => {
    if (level <= 0) return 0;
    const raw = (Number(voiceConfig.curveA) * level ** 3 + Number(voiceConfig.curveB) * level ** 2 + Number(voiceConfig.curveC) * level) * Number(voiceConfig.difficulty);
    return Math.round(raw / Math.max(1, Number(voiceConfig.rounding))) * Math.max(1, Number(voiceConfig.rounding));
  };
  const voiceCurveMax = Math.max(voiceCurveTotal(50), 1);
  const voiceCurveX = (level) => 44 + level / 50 * 556;
  const voiceCurveY = (value) => 240 - value / voiceCurveMax * 216;
  const voiceCurvePath = Array.from({ length: 51 }, (_, level) => `${level ? "L" : "M"}${voiceCurveX(level).toFixed(1)} ${voiceCurveY(voiceCurveTotal(level)).toFixed(1)}`).join(" ");
  const voiceMinutesForLevel = (level) => Math.max(0, Math.ceil(voiceCurveTotal(level) / Math.max(1, Number(voiceConfig.xpPerMinute))));
  const lvLabels = {
    why_textOff: dt("Turn on leveling first."),
    why_voiceOff: dt("Turn on voice leveling first."),
    why_announceOff: dt("The announcement is off, so this is not used."),
    why_channelReply: dt('Only used with "Fixed channel". Now it answers in the same channel.'),
    why_channelDm: dt("A direct message has no channel."),
    why_replyDm: dt("A direct message cannot answer a message."),
    why_template: dt("A saved embed template replaces the simple embed."),
    why_joinLevel: dt('"Level on join" is set, and it wins over XP on join.'),
    why_rankEmbed: dt("Only used when the answer includes the card."),
    why_noTextNotify: dt("Level-ups are not announced. Turn the announcement on first."),
    why_noVoiceNotify: dt("Voice level-ups are not announced. Turn the voice announcement on first."),
    why_aloneNeedsOne: dt("Only used when 1 person is enough to earn voice XP."),
    why_noStreak: dt("There is no streak bonus, so there is nothing to limit."),
    why_boardOff: dt("Turn on the public page first."),
    link_textOff: dt("Open Leveling settings"),
    link_voiceOff: dt("Open Voice leveling"),
    link_noTextNotify: dt("Open Leveling settings"),
    link_noVoiceNotify: dt("Open Voice leveling"),
    err_xpRange: dt("The minimum cannot be higher than the maximum."),
    err_needChannel: dt("Choose the channel, or the announcement goes where the member leveled up."),
    err_milestoneIgnored: dt("{a} line(s) will be ignored. Write them like 10: your message, one level per line."),
    err_roleBoth: dt('{a} role(s) are in both lists. "Earn no XP" wins.'),
    err_range: dt("Enter a number between {a} and {b}."),
    err_min: dt("Enter {a} or more."),
    err_max: dt("Enter {a} or less."),
    statusOn: dt("On"),
    statusOff: dt("Off"),
    statusXp: dt("{a}-{b} XP per message"),
    statusVoiceXp: dt("{a} XP per voice minute"),
    statusAnnounceOff: dt("level-ups are not announced"),
    statusReply: dt("level-ups answer in the same channel"),
    statusChannel: dt("level-ups in {a}"),
    statusChannelUnset: dt("level-ups in the channel of the message"),
    statusDm: dt("level-ups by direct message"),
    statusEvery: dt("every {a} levels"),
    statusTemplate: dt("template {a}"),
    statusEmbed: dt("as an embed"),
    statusRankCard: dt("/levels rank answers with a card"),
    statusRankEmbed: dt("/levels rank answers with an embed"),
    statusRankBoth: dt("/levels rank answers with a card and an embed"),
    statusLevelCard: dt("level-up card {a}"),
    statusMinChars: dt("messages need {a}+ characters"),
    statusAnyMessage: dt("every message counts"),
    statusDailyCap: dt("at most {a} XP a day from messages"),
    statusNoCap: dt("no daily limit"),
    statusVoicePeople: dt("voice needs {a} people"),
    statusDailyBonus: dt("daily bonus {a} XP"),
    statusBoardOn: dt("Public page on"),
    statusBoardOff: dt("Public page off")
  };
  const lvFlags = { textOn: Boolean(config.enabled), voiceOn: Boolean(voiceConfig.enabled), textNotify: config.notifyMode !== "off", voiceNotify: voiceConfig.notifyMode !== "off" };
  const lvHref = { settings: `/dash/guild/${guildId}/leveling`, voice: `/dash/guild/${guildId}/leveling?section=voice` };
  const lvStatus = (kind, entries) => statusParts(kind, ctxFromEntries(entries, lvFlags, (id) => `#${channelName(id)}`), lvLabels).join(" \xB7 ");
  const statusSettings = lvStatus("settings", configFormEntries(config));
  const statusVoice = lvStatus("voice", voiceFormEntries(voiceConfig));
  const statusRank = lvStatus("rank", rankFormEntries(rank));
  const statusRules = lvStatus("rules", rulesFormEntries(rules));
  const statusBoard = lvStatus("board", boardFormEntries({ enabled: Boolean(publicBoard?.enabled), slug: publicBoard?.slug ?? "", joinUrl: publicBoard?.joinUrl ?? "" }));
  const missingLabel = (id) => dt("Missing: {a}", { a: id });
  const withMissing = (options, chosen) => keepChosen(options, chosen, missingLabel);
  const missingOption = (names, chosen) => chosen && !names.includes(chosen) ? chosen : "";
  const advNotify = (c) => c.notifyEmbed || c.notifyReply === false || !c.notifyPing || c.notifyDeleteAfter > 0 || c.notifyEvery > 1 || Boolean(c.notifyMilestones);
  const advMore = config.ignoredChannelIds.length > 0 || config.ignoredCategoryIds.length > 0 || config.joinXp > 0 || config.joinLevel > 0 || config.xpPerVcMinute !== 5;
  const advCurve = config.curveA !== 1 || config.curveB !== 50 || config.curveC !== 100 || config.difficulty !== 2.5 || config.rounding !== 50 || config.maxLevel !== 1e3;
  const advVoiceCurve = voiceConfig.curveA !== 1 || voiceConfig.curveB !== 50 || voiceConfig.curveC !== 100 || voiceConfig.difficulty !== 2.5 || voiceConfig.rounding !== 50 || voiceConfig.maxLevel !== 1e3;
  const advVoiceMore = voiceConfig.ignoredChannelIds.length > 0 || voiceConfig.ignoredCategoryIds.length > 0;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": selectedSection === "settings" ? "leveling" : `leveling-${selectedSection}`, "pageTitle": selectedTitle, "data-astro-cid-5lyycc4g": true }, { "default": async ($$result2) => renderTemplate(_b || (_b = __template([" ", "<h1 data-astro-cid-5lyycc4g>", "</h1> ", " ", " ", " ", "", "", "", "", "", "", "", "", "", "", "", "", "", '<script type="application/json" id="lvDepLabels">', '<\/script> <script type="application/json" id="lvStageLabels">', `<\/script>  <script>
(function () {
  let labels = {};
  const readLabels = (root) => {
    try {
      const el = root.querySelector?.("#lvStageLabels") ?? document.getElementById("lvStageLabels");
      if (el) labels = JSON.parse(el.textContent ?? "{}");
    } catch {
    }
  };
  const fill = (text, a) => String(text).replace("{a}", String(a));
  window.PettoLevelingStageInit = (root = document) => {
    readLabels(root);
    const typeSelect = root.querySelector("[data-mult-type]");
    const showTarget = () => root.querySelectorAll("[data-mult-target]").forEach((box) => {
      box.hidden = box.dataset.multTarget !== typeSelect?.value;
    });
    if (typeSelect && !typeSelect.dataset.lvBound) {
      typeSelect.dataset.lvBound = "1";
      typeSelect.addEventListener("change", showTarget);
      showTarget();
    }
    root.querySelectorAll("[data-stage-form]").forEach((form) => {
      if (form.dataset.stageBound) return;
      form.dataset.stageBound = "1";
      const kind = form.dataset.stageForm;
      const list = form.querySelector("[data-stage-list]");
      const payload = form.querySelector("[data-stage-payload]");
      const empty = form.querySelector("[data-stage-empty]");
      const dirtyNote = form.querySelector("[data-stage-dirty]");
      const field = (name) => form.querySelector(\`[data-stage-add] [data-f="\${name}"]\`);
      const initial = () => {
        try {
          return JSON.parse(form.dataset.initial ?? "[]");
        } catch {
          return [];
        }
      };
      let items = initial();
      const added = [];
      const removed = /* @__PURE__ */ new Set();
      let dirty = false;
      let fresh = null;
      const markDirty = () => {
        dirty = true;
        if (dirtyNote) dirtyNote.hidden = false;
        form.dispatchEvent(new Event("input", { bubbles: true }));
      };
      const row = (item, ...parts) => {
        const box = document.createElement("div");
        box.className = item && item === fresh ? "lv-reward-row lv-reward-new" : "lv-reward-row";
        parts.forEach((part) => box.append(part));
        return box;
      };
      const span = (cls, text) => {
        const el = document.createElement("span");
        el.className = cls;
        el.textContent = text;
        return el;
      };
      const del = (onClick) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lv-reward-del";
        btn.title = labels.remove;
        btn.setAttribute("aria-label", labels.remove);
        btn.textContent = "\\xD7";
        btn.addEventListener("click", onClick);
        return btn;
      };
      const render = () => {
        if (kind === "rewards") {
          items.sort((a, b) => a.source === b.source ? a.level - b.level : a.source === "voice" ? 1 : -1);
          list.replaceChildren(...items.map((item, i) => row(
            item,
            span("lv-reward-level", \`\${item.source === "voice" ? labels.voice : labels.text} \\xB7 \${fill(labels.level, item.level)}\`),
            span("lv-reward-arrow", "\\u2192"),
            span("lv-reward-role", item.label),
            del(() => {
              items.splice(i, 1);
              markDirty();
              render();
            })
          )));
          payload.value = JSON.stringify(items.map(({ source, level, role_id }) => ({ source, level, role_id })));
          if (empty) empty.hidden = items.length > 0;
        } else if (kind === "multipliers") {
          list.replaceChildren(...items.map((item, i) => row(
            item,
            span("lv-reward-level", \`\\xD7\${item.multiplier}\`),
            span("lv-reward-arrow", "\\u2192"),
            span("lv-reward-role", item.label),
            del(() => {
              items.splice(i, 1);
              markDirty();
              render();
            })
          )));
          payload.value = JSON.stringify(items.map(({ target_id, target_type, multiplier }) => ({ target_id, target_type, multiplier })));
          if (empty) empty.hidden = items.length > 0;
        } else if (kind === "rules") {
          list.querySelectorAll("[data-staged-event]").forEach((el) => el.remove());
          added.forEach((item, i) => {
            const sourceText = item.source === "text" ? labels.textOnly : item.source === "voice" ? labels.voiceOnly : labels.all;
            const box = row(item, span("lv-reward-level", item.name), span("lv-reward-role", \`\\xD7\${item.multiplier} \\xB7 \${sourceText} \\xB7 \${fill(labels.hours, item.duration)}\${item.startIn ? \` \\xB7 \${labels.startsIn} \${item.startIn}\` : ""}\`), del(() => {
              added.splice(i, 1);
              markDirty();
              render();
            }));
            box.dataset.stagedEvent = "1";
            list.append(box);
          });
          list.querySelectorAll("[data-existing-event]").forEach((el) => {
            el.style.opacity = removed.has(el.dataset.existingEvent ?? "") ? ".4" : "";
            el.style.textDecoration = removed.has(el.dataset.existingEvent ?? "") ? "line-through" : "";
          });
          const emptyNote = list.querySelector("[data-stage-empty]");
          if (emptyNote) emptyNote.hidden = added.length > 0;
          payload.value = JSON.stringify({ add: added, remove: [...removed] });
        }
        fresh = null;
        if (!list.dataset.drawn) setTimeout(() => { list.dataset.drawn = "1"; }, 700);
      };
      list.querySelectorAll("[data-existing-event]").forEach((el) => {
        el.querySelector("[data-remove-existing]")?.addEventListener("click", () => {
          const id = el.dataset.existingEvent ?? "";
          if (removed.has(id)) removed.delete(id);
          else removed.add(id);
          markDirty();
          render();
        });
      });
      form.querySelector("[data-stage-add-btn]")?.addEventListener("click", () => {
        if (kind === "rewards") {
          const level = Math.floor(Number(field("level")?.value));
          const select = field("role_id");
          if (!(level >= 1 && level <= 1e3) || !select.value) {
            (level >= 1 ? select : field("level"))?.focus();
            return;
          }
          const source = field("source").value === "voice" ? "voice" : "text";
          items = items.filter((item) => !(item.source === source && item.level === level));
          fresh = { source, level, role_id: select.value, label: select.selectedOptions[0]?.textContent ?? select.value };
          items.push(fresh);
        } else if (kind === "multipliers") {
          const type = field("target_type").value;
          const select = field(\`target_\${type}\`);
          const multiplier = Math.round(Number(field("multiplier")?.value) * 100) / 100;
          if (!select.value) {
            select.focus();
            return;
          }
          if (!(multiplier >= 0 && multiplier <= 20)) {
            field("multiplier")?.focus();
            return;
          }
          const text = select.selectedOptions[0]?.textContent ?? select.value;
          items = items.filter((item) => item.target_id !== select.value);
          fresh = { target_id: select.value, target_type: type, multiplier, label: type === "role" ? \`@\${text}\` : text };
          items.push(fresh);
        } else if (kind === "rules") {
          const name = (field("name")?.value ?? "").trim();
          const multiplier = Math.round(Number(field("multiplier")?.value) * 100) / 100;
          const duration = Number(field("duration")?.value);
          if (!name) {
            field("name")?.focus();
            return;
          }
          if (!(multiplier > 1 && multiplier <= 20) || !(duration >= 1)) {
            field("multiplier")?.focus();
            return;
          }
          fresh = { name, multiplier, source: field("source")?.value ?? "all", duration, startIn: Number(field("startIn")?.value) || 0 };
          added.push(fresh);
          field("name").value = "";
          field("name").dispatchEvent(new Event("input", { bubbles: true }));
        }
        markDirty();
        render();
      });
      form.addEventListener("reset", () => {
        items = initial();
        added.length = 0;
        removed.clear();
        dirty = false;
        if (dirtyNote) dirtyNote.hidden = true;
        render();
        setTimeout(showTarget, 0);
      });
      const onSaved = () => {
        if (!form.isConnected) {
          document.removeEventListener("dgl:dirty", onSaved);
          return;
        }
        if (!dirty || form.classList.contains("is-dirty")) return;
        dirty = false;
        if (kind === "rules") {
          window.dglRefreshPage?.(true);
          return;
        }
        form.dataset.initial = JSON.stringify(items);
      };
      document.addEventListener("dgl:dirty", onSaved);
      form.addEventListener("submit", () => {
        render();
      });
      window.addEventListener("beforeunload", (event) => {
        if (dirty && form.isConnected && !form.dataset.submitting) event.preventDefault();
      });
      form.addEventListener("submit", () => {
        form.dataset.submitting = "1";
      });
      render();
    });
  };
  window.PettoLevelingStageInit(document);
})();
<\/script> <script>
(function () {
  window.PettoRankPreviewInit = (root = document) => {
    const select = root.querySelector("#lvRankCard");
    const image = root.querySelector("#lvRankImg");
    const dataEl = root.querySelector("#lvCardsData");
    if (!select || !image || !dataEl || select.dataset.lvBound) return;
    select.dataset.lvBound = "1";
    const cards = JSON.parse(dataEl.textContent || "{}");
    const guildId = (location.pathname.match(/guild\\/(\\d+)/) ?? [])[1];
    const fallback = { kind: "rank", mode: "basic", basic: { preset: "rank", accent: "#ffb199", title: "LEVEL {level}" }, background: { color: "#120c1a", image: { src: "petto:rank-default", fit: "cover", blur: 0 } } };
    let sequence = 0;
    let objectUrl = "";
    const stage = image.closest(".lv-rank-stage");
    const fail = (status) => {
      if (!stage) return;
      stage.dataset.state = "failed";
      let box = stage.querySelector(".lv-rank-fail");
      if (!box) {
        box = document.createElement("div");
        box.className = "lv-rank-fail";
        const text = document.createElement("span");
        const retry = document.createElement("button");
        retry.type = "button";
        retry.textContent = stage.dataset.retry || "Try again";
        retry.addEventListener("click", () => show());
        box.append(text, retry);
        stage.appendChild(box);
      }
      box.firstChild.textContent = \`\${stage.dataset.fail || "The preview could not be drawn."}\${status ? \` (\${status})\` : ""}\`;
      image.hidden = true;
    };
    async function show(attempt = 0) {
      const mine = ++sequence;
      if (stage) {
        stage.dataset.state = "busy";
        stage.querySelector(".lv-rank-fail")?.remove();
      }
      try {
        const res = await fetch(\`/dash/guild/\${guildId}/cards-api\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "preview", data: cards[select.value] ?? fallback }) });
        if (mine !== sequence) return;
        if (!res.ok) {
          if (attempt < 1 && (res.status === 429 || res.status >= 500)) {
            await new Promise((r) => setTimeout(r, 1200));
            if (mine === sequence) return show(attempt + 1);
            return;
          }
          return fail(res.status);
        }
        const url = URL.createObjectURL(await res.blob());
        image.hidden = false;
        image.src = url;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = url;
        if (stage) delete stage.dataset.state;
      } catch {
        if (mine === sequence) fail("");
      }
    }
    select.addEventListener("change", () => show());
    show();
  };
  window.PettoRankPreviewInit(document);
})();
<\/script> <script>
(function () {
  // The profiles of the Rules page fill the Chat and Voice fields; the form tells the bar of unsaved changes as if they were typed.
  var forms = document.querySelectorAll('form[data-stage-form="rules"]');
  forms.forEach(function (form) {
    if (form.dataset.profilesBound) return;
    form.dataset.profilesBound = '1';
    var buttons = Array.prototype.slice.call(form.querySelectorAll('[data-lv-profile]'));
    var read = function (button) { try { return JSON.parse(button.getAttribute('data-lv-profile') || '{}'); } catch (e) { return {}; } };
    var field = function (name) { return form.elements.namedItem(name); };
    var matches = function (values) {
      return Object.keys(values).every(function (name) {
        var input = field(name);
        if (!input) return false;
        return input.type === 'checkbox' ? input.checked === Boolean(values[name]) : Number(input.value) === Number(values[name]);
      });
    };
    var mark = function () { buttons.forEach(function (button) { button.classList.toggle('is-active', matches(read(button))); }); };
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var values = read(button);
        Object.keys(values).forEach(function (name) {
          var input = field(name);
          if (!input) return;
          if (input.type === 'checkbox') input.checked = Boolean(values[name]); else input.value = String(values[name]);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        mark();
      });
    });
    form.addEventListener('input', mark);
    form.addEventListener('change', mark);
    form.addEventListener('reset', function () { setTimeout(mark, 0); });
    mark();
  });
})();
<\/script> <script>
  (function () {
    // The dashboard swaps a page's content in without a reload and runs this script again: the numbers of the new page get their buttons too.
    if (window.__lvSteppers) { window.__lvSteppers(); return; }
    // The numbers get a minus and a plus (the same input, with the same name, id and limits; DashSettingsKit does the pressing and holding).
    var plus = '<svg viewBox="0 0 256 256" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M224 128a8 8 0 0 1-8 8h-88v88a8 8 0 0 1-16 0v-88H32a8 8 0 0 1 0-16h88V32a8 8 0 0 1 16 0v88h88a8 8 0 0 1 8 8Z"/></svg>';
    var minus = '<svg viewBox="0 0 256 256" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8Z"/></svg>';
    function run() {
      document.querySelectorAll('.lv-form .lv-field input[type="number"], .lv-form .lv-curve-options input[type="number"]').forEach(function (input) {
        if (input.closest('.sx-stepper') || input.closest('.lv-formula')) return;
        var wrap = document.createElement('span'); wrap.className = 'sx-stepper';
        input.parentNode.insertBefore(wrap, input);
        wrap.innerHTML = '<button type="button" class="sx-step" data-sx-step="-1" tabindex="-1" aria-label="\u2212">' + minus + '</button>';
        wrap.appendChild(input);
        wrap.insertAdjacentHTML('beforeend', '<button type="button" class="sx-step" data-sx-step="1" tabindex="-1" aria-label="+">' + plus + '</button>');
      });
    }
    window.__lvSteppers = run;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  })();
<\/script> `], [" ", "<h1 data-astro-cid-5lyycc4g>", "</h1> ", " ", " ", " ", "", "", "", "", "", "", "", "", "", "", "", "", "", '<script type="application/json" id="lvDepLabels">', '<\/script> <script type="application/json" id="lvStageLabels">', `<\/script>  <script>
(function () {
  let labels = {};
  const readLabels = (root) => {
    try {
      const el = root.querySelector?.("#lvStageLabels") ?? document.getElementById("lvStageLabels");
      if (el) labels = JSON.parse(el.textContent ?? "{}");
    } catch {
    }
  };
  const fill = (text, a) => String(text).replace("{a}", String(a));
  window.PettoLevelingStageInit = (root = document) => {
    readLabels(root);
    const typeSelect = root.querySelector("[data-mult-type]");
    const showTarget = () => root.querySelectorAll("[data-mult-target]").forEach((box) => {
      box.hidden = box.dataset.multTarget !== typeSelect?.value;
    });
    if (typeSelect && !typeSelect.dataset.lvBound) {
      typeSelect.dataset.lvBound = "1";
      typeSelect.addEventListener("change", showTarget);
      showTarget();
    }
    root.querySelectorAll("[data-stage-form]").forEach((form) => {
      if (form.dataset.stageBound) return;
      form.dataset.stageBound = "1";
      const kind = form.dataset.stageForm;
      const list = form.querySelector("[data-stage-list]");
      const payload = form.querySelector("[data-stage-payload]");
      const empty = form.querySelector("[data-stage-empty]");
      const dirtyNote = form.querySelector("[data-stage-dirty]");
      const field = (name) => form.querySelector(\\\`[data-stage-add] [data-f="\\\${name}"]\\\`);
      const initial = () => {
        try {
          return JSON.parse(form.dataset.initial ?? "[]");
        } catch {
          return [];
        }
      };
      let items = initial();
      const added = [];
      const removed = /* @__PURE__ */ new Set();
      let dirty = false;
      let fresh = null;
      const markDirty = () => {
        dirty = true;
        if (dirtyNote) dirtyNote.hidden = false;
        form.dispatchEvent(new Event("input", { bubbles: true }));
      };
      const row = (item, ...parts) => {
        const box = document.createElement("div");
        box.className = item && item === fresh ? "lv-reward-row lv-reward-new" : "lv-reward-row";
        parts.forEach((part) => box.append(part));
        return box;
      };
      const span = (cls, text) => {
        const el = document.createElement("span");
        el.className = cls;
        el.textContent = text;
        return el;
      };
      const del = (onClick) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lv-reward-del";
        btn.title = labels.remove;
        btn.setAttribute("aria-label", labels.remove);
        btn.textContent = "\\\\xD7";
        btn.addEventListener("click", onClick);
        return btn;
      };
      const render = () => {
        if (kind === "rewards") {
          items.sort((a, b) => a.source === b.source ? a.level - b.level : a.source === "voice" ? 1 : -1);
          list.replaceChildren(...items.map((item, i) => row(
            item,
            span("lv-reward-level", \\\`\\\${item.source === "voice" ? labels.voice : labels.text} \\\\xB7 \\\${fill(labels.level, item.level)}\\\`),
            span("lv-reward-arrow", "\\\\u2192"),
            span("lv-reward-role", item.label),
            del(() => {
              items.splice(i, 1);
              markDirty();
              render();
            })
          )));
          payload.value = JSON.stringify(items.map(({ source, level, role_id }) => ({ source, level, role_id })));
          if (empty) empty.hidden = items.length > 0;
        } else if (kind === "multipliers") {
          list.replaceChildren(...items.map((item, i) => row(
            item,
            span("lv-reward-level", \\\`\\\\xD7\\\${item.multiplier}\\\`),
            span("lv-reward-arrow", "\\\\u2192"),
            span("lv-reward-role", item.label),
            del(() => {
              items.splice(i, 1);
              markDirty();
              render();
            })
          )));
          payload.value = JSON.stringify(items.map(({ target_id, target_type, multiplier }) => ({ target_id, target_type, multiplier })));
          if (empty) empty.hidden = items.length > 0;
        } else if (kind === "rules") {
          list.querySelectorAll("[data-staged-event]").forEach((el) => el.remove());
          added.forEach((item, i) => {
            const sourceText = item.source === "text" ? labels.textOnly : item.source === "voice" ? labels.voiceOnly : labels.all;
            const box = row(item, span("lv-reward-level", item.name), span("lv-reward-role", \\\`\\\\xD7\\\${item.multiplier} \\\\xB7 \\\${sourceText} \\\\xB7 \\\${fill(labels.hours, item.duration)}\\\${item.startIn ? \\\` \\\\xB7 \\\${labels.startsIn} \\\${item.startIn}\\\` : ""}\\\`), del(() => {
              added.splice(i, 1);
              markDirty();
              render();
            }));
            box.dataset.stagedEvent = "1";
            list.append(box);
          });
          list.querySelectorAll("[data-existing-event]").forEach((el) => {
            el.style.opacity = removed.has(el.dataset.existingEvent ?? "") ? ".4" : "";
            el.style.textDecoration = removed.has(el.dataset.existingEvent ?? "") ? "line-through" : "";
          });
          const emptyNote = list.querySelector("[data-stage-empty]");
          if (emptyNote) emptyNote.hidden = added.length > 0;
          payload.value = JSON.stringify({ add: added, remove: [...removed] });
        }
        fresh = null;
        if (!list.dataset.drawn) setTimeout(() => { list.dataset.drawn = "1"; }, 700);
      };
      list.querySelectorAll("[data-existing-event]").forEach((el) => {
        el.querySelector("[data-remove-existing]")?.addEventListener("click", () => {
          const id = el.dataset.existingEvent ?? "";
          if (removed.has(id)) removed.delete(id);
          else removed.add(id);
          markDirty();
          render();
        });
      });
      form.querySelector("[data-stage-add-btn]")?.addEventListener("click", () => {
        if (kind === "rewards") {
          const level = Math.floor(Number(field("level")?.value));
          const select = field("role_id");
          if (!(level >= 1 && level <= 1e3) || !select.value) {
            (level >= 1 ? select : field("level"))?.focus();
            return;
          }
          const source = field("source").value === "voice" ? "voice" : "text";
          items = items.filter((item) => !(item.source === source && item.level === level));
          fresh = { source, level, role_id: select.value, label: select.selectedOptions[0]?.textContent ?? select.value };
          items.push(fresh);
        } else if (kind === "multipliers") {
          const type = field("target_type").value;
          const select = field(\\\`target_\\\${type}\\\`);
          const multiplier = Math.round(Number(field("multiplier")?.value) * 100) / 100;
          if (!select.value) {
            select.focus();
            return;
          }
          if (!(multiplier >= 0 && multiplier <= 20)) {
            field("multiplier")?.focus();
            return;
          }
          const text = select.selectedOptions[0]?.textContent ?? select.value;
          items = items.filter((item) => item.target_id !== select.value);
          fresh = { target_id: select.value, target_type: type, multiplier, label: type === "role" ? \\\`@\\\${text}\\\` : text };
          items.push(fresh);
        } else if (kind === "rules") {
          const name = (field("name")?.value ?? "").trim();
          const multiplier = Math.round(Number(field("multiplier")?.value) * 100) / 100;
          const duration = Number(field("duration")?.value);
          if (!name) {
            field("name")?.focus();
            return;
          }
          if (!(multiplier > 1 && multiplier <= 20) || !(duration >= 1)) {
            field("multiplier")?.focus();
            return;
          }
          fresh = { name, multiplier, source: field("source")?.value ?? "all", duration, startIn: Number(field("startIn")?.value) || 0 };
          added.push(fresh);
          field("name").value = "";
          field("name").dispatchEvent(new Event("input", { bubbles: true }));
        }
        markDirty();
        render();
      });
      form.addEventListener("reset", () => {
        items = initial();
        added.length = 0;
        removed.clear();
        dirty = false;
        if (dirtyNote) dirtyNote.hidden = true;
        render();
        setTimeout(showTarget, 0);
      });
      const onSaved = () => {
        if (!form.isConnected) {
          document.removeEventListener("dgl:dirty", onSaved);
          return;
        }
        if (!dirty || form.classList.contains("is-dirty")) return;
        dirty = false;
        if (kind === "rules") {
          window.dglRefreshPage?.(true);
          return;
        }
        form.dataset.initial = JSON.stringify(items);
      };
      document.addEventListener("dgl:dirty", onSaved);
      form.addEventListener("submit", () => {
        render();
      });
      window.addEventListener("beforeunload", (event) => {
        if (dirty && form.isConnected && !form.dataset.submitting) event.preventDefault();
      });
      form.addEventListener("submit", () => {
        form.dataset.submitting = "1";
      });
      render();
    });
  };
  window.PettoLevelingStageInit(document);
})();
<\/script> <script>
(function () {
  window.PettoRankPreviewInit = (root = document) => {
    const select = root.querySelector("#lvRankCard");
    const image = root.querySelector("#lvRankImg");
    const dataEl = root.querySelector("#lvCardsData");
    if (!select || !image || !dataEl || select.dataset.lvBound) return;
    select.dataset.lvBound = "1";
    const cards = JSON.parse(dataEl.textContent || "{}");
    const guildId = (location.pathname.match(/guild\\\\/(\\\\d+)/) ?? [])[1];
    const fallback = { kind: "rank", mode: "basic", basic: { preset: "rank", accent: "#ffb199", title: "LEVEL {level}" }, background: { color: "#120c1a", image: { src: "petto:rank-default", fit: "cover", blur: 0 } } };
    let sequence = 0;
    let objectUrl = "";
    const stage = image.closest(".lv-rank-stage");
    const fail = (status) => {
      if (!stage) return;
      stage.dataset.state = "failed";
      let box = stage.querySelector(".lv-rank-fail");
      if (!box) {
        box = document.createElement("div");
        box.className = "lv-rank-fail";
        const text = document.createElement("span");
        const retry = document.createElement("button");
        retry.type = "button";
        retry.textContent = stage.dataset.retry || "Try again";
        retry.addEventListener("click", () => show());
        box.append(text, retry);
        stage.appendChild(box);
      }
      box.firstChild.textContent = \\\`\\\${stage.dataset.fail || "The preview could not be drawn."}\\\${status ? \\\` (\\\${status})\\\` : ""}\\\`;
      image.hidden = true;
    };
    async function show(attempt = 0) {
      const mine = ++sequence;
      if (stage) {
        stage.dataset.state = "busy";
        stage.querySelector(".lv-rank-fail")?.remove();
      }
      try {
        const res = await fetch(\\\`/dash/guild/\\\${guildId}/cards-api\\\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "preview", data: cards[select.value] ?? fallback }) });
        if (mine !== sequence) return;
        if (!res.ok) {
          if (attempt < 1 && (res.status === 429 || res.status >= 500)) {
            await new Promise((r) => setTimeout(r, 1200));
            if (mine === sequence) return show(attempt + 1);
            return;
          }
          return fail(res.status);
        }
        const url = URL.createObjectURL(await res.blob());
        image.hidden = false;
        image.src = url;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = url;
        if (stage) delete stage.dataset.state;
      } catch {
        if (mine === sequence) fail("");
      }
    }
    select.addEventListener("change", () => show());
    show();
  };
  window.PettoRankPreviewInit(document);
})();
<\/script> <script>
(function () {
  // The profiles of the Rules page fill the Chat and Voice fields; the form tells the bar of unsaved changes as if they were typed.
  var forms = document.querySelectorAll('form[data-stage-form="rules"]');
  forms.forEach(function (form) {
    if (form.dataset.profilesBound) return;
    form.dataset.profilesBound = '1';
    var buttons = Array.prototype.slice.call(form.querySelectorAll('[data-lv-profile]'));
    var read = function (button) { try { return JSON.parse(button.getAttribute('data-lv-profile') || '{}'); } catch (e) { return {}; } };
    var field = function (name) { return form.elements.namedItem(name); };
    var matches = function (values) {
      return Object.keys(values).every(function (name) {
        var input = field(name);
        if (!input) return false;
        return input.type === 'checkbox' ? input.checked === Boolean(values[name]) : Number(input.value) === Number(values[name]);
      });
    };
    var mark = function () { buttons.forEach(function (button) { button.classList.toggle('is-active', matches(read(button))); }); };
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var values = read(button);
        Object.keys(values).forEach(function (name) {
          var input = field(name);
          if (!input) return;
          if (input.type === 'checkbox') input.checked = Boolean(values[name]); else input.value = String(values[name]);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        mark();
      });
    });
    form.addEventListener('input', mark);
    form.addEventListener('change', mark);
    form.addEventListener('reset', function () { setTimeout(mark, 0); });
    mark();
  });
})();
<\/script> <script>
  (function () {
    // The dashboard swaps a page's content in without a reload and runs this script again: the numbers of the new page get their buttons too.
    if (window.__lvSteppers) { window.__lvSteppers(); return; }
    // The numbers get a minus and a plus (the same input, with the same name, id and limits; DashSettingsKit does the pressing and holding).
    var plus = '<svg viewBox="0 0 256 256" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M224 128a8 8 0 0 1-8 8h-88v88a8 8 0 0 1-16 0v-88H32a8 8 0 0 1 0-16h88V32a8 8 0 0 1 16 0v88h88a8 8 0 0 1 8 8Z"/></svg>';
    var minus = '<svg viewBox="0 0 256 256" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8Z"/></svg>';
    function run() {
      document.querySelectorAll('.lv-form .lv-field input[type="number"], .lv-form .lv-curve-options input[type="number"]').forEach(function (input) {
        if (input.closest('.sx-stepper') || input.closest('.lv-formula')) return;
        var wrap = document.createElement('span'); wrap.className = 'sx-stepper';
        input.parentNode.insertBefore(wrap, input);
        wrap.innerHTML = '<button type="button" class="sx-step" data-sx-step="-1" tabindex="-1" aria-label="\u2212">' + minus + '</button>';
        wrap.appendChild(input);
        wrap.insertAdjacentHTML('beforeend', '<button type="button" class="sx-step" data-sx-step="1" tabindex="-1" aria-label="+">' + plus + '</button>');
      });
    }
    window.__lvSteppers = run;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  })();
<\/script> `])), maybeRenderHead(), selectedTitle, renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-5lyycc4g": true }), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-5lyycc4g": true }), renderComponent($$result2, "DurationScript", $$DurationScript, { "data-astro-cid-5lyycc4g": true }), ["settings", "voice"].includes(selectedSection) && renderTemplate`${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "vars": [{ tok: "{EMOJI}", desc: dt("The level-up icon") }, { tok: "{level_role}", desc: dt("The reward role of that level") }], "data-astro-cid-5lyycc4g": true })}`, saved && renderTemplate`<div class="lv-flash" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-5lyycc4g": true })}${dt("Saved.")}</div>`, saveError && renderTemplate`<div class="lv-flash lv-flash-error" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-circle-fill", "width": "15", "height": "15", "data-astro-cid-5lyycc4g": true })}${dt("Could not save these changes. Check the API response and try again.")}</div>`, selectedSection === "settings" && renderTemplate`${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Level rewards"), value: rewards.length, tone: "joins" },
    { label: dt("Multipliers"), value: multipliers.length, tone: "reactions" },
    { label: dt("Max level"), value: config.maxLevel, tone: "invites" }
  ], "data-astro-cid-5lyycc4g": true })}`, selectedSection === "voice" && renderTemplate`${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("XP per voice minute"), value: voiceConfig.xpPerMinute, tone: "voice" },
    { label: dt("Minutes to level 10"), value: 0, text: formatDuration(voiceMinutesForLevel(10) * 60, { locale: dashLocale(dashLang) }), tone: "joins" },
    { label: dt("Max level"), value: voiceConfig.maxLevel, tone: "invites" }
  ], "data-astro-cid-5lyycc4g": true })}`, selectedSection === "settings" && renderTemplate`<form method="POST"${addAttribute(["lv-form", { "lv-section-hidden": selectedSection !== "settings" }], "class:list")} data-lv-settings data-lv-form="settings"${addAttribute(JSON.stringify(lvFlags), "data-lv-flags")}${addAttribute(JSON.stringify(lvHref), "data-lv-hrefs")} data-astro-cid-5lyycc4g> <input type="hidden" name="action" value="config" data-astro-cid-5lyycc4g> <div class="lv-card lv-master" data-astro-cid-5lyycc4g> <div class="lv-card-head" data-astro-cid-5lyycc4g> <div class="lv-card-icon" style="--c:var(--green)" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-line-up-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}</div> <div class="lv-card-title" id="lv-enabled-title" data-astro-cid-5lyycc4g>${dt("Leveling enabled")}</div> <label class="lv-switch" data-astro-cid-5lyycc4g><input type="checkbox" name="enabled"${addAttribute(config.enabled, "checked")} aria-labelledby="lv-enabled-title" aria-describedby="lv-status-settings" data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g></span></label> </div> <p class="lv-card-desc" data-astro-cid-5lyycc4g>${dt("Members earn XP from chatting and level up. Voice has its own switch in Voice leveling.")}</p> <p class="lv-status" id="lv-status-settings" data-lv-status="settings" aria-live="polite" data-astro-cid-5lyycc4g>${statusSettings}</p> </div> <p class="lv-gate-note" data-lv-gate-note role="status" hidden data-astro-cid-5lyycc4g>${dt("Leveling is off. Turn it on to edit what is below. Everything you saved stays as it is.")}</p> <div class="lv-gate" data-lv-gate="enabled" data-astro-cid-5lyycc4g> <div class="lv-section-label" data-astro-cid-5lyycc4g> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sliders-horizontal-fill", "width": "14", "height": "14", "data-astro-cid-5lyycc4g": true })} ${dt("Earning XP")} </div> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field" data-astro-cid-5lyycc4g> <label for="lv-xp_min" data-astro-cid-5lyycc4g>${dt("XP per message (min-max)")}</label> <div class="lv-pair" data-astro-cid-5lyycc4g><input id="lv-xp_min" type="number" name="xp_min"${addAttribute(config.xpMin, "value")}${addAttribute(minFor(config.xpMin, 1), "min")}${addAttribute(maxFor(config.xpMin, 1e3), "max")} data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g>${dt("to")}</span><input type="number" name="xp_max"${addAttribute(config.xpMax, "value")}${addAttribute(minFor(config.xpMax, 1), "min")}${addAttribute(maxFor(config.xpMax, 1e3), "max")}${addAttribute(dt("Maximum XP per message"), "aria-label")} data-astro-cid-5lyycc4g></div> </div> <div class="lv-field" data-astro-cid-5lyycc4g> <label for="lv-cooldown_seconds" data-astro-cid-5lyycc4g>${dt("Message cooldown (seconds)")}</label> <input id="lv-cooldown_seconds" type="number" name="cooldown_seconds"${addAttribute(config.cooldownSeconds, "value")}${addAttribute(minFor(config.cooldownSeconds, 0), "min")}${addAttribute(maxFor(config.cooldownSeconds, 600), "max")} data-astro-cid-5lyycc4g> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("A member earns XP at most once in this time, so fast chatting is not rewarded more.")}</p> </div> <div class="lv-field" data-astro-cid-5lyycc4g> <label for="lv-role_mode" data-astro-cid-5lyycc4g>${dt("Reward roles on level up")}</label> <select id="lv-role_mode" name="role_mode" data-astro-cid-5lyycc4g> <option value="highest"${addAttribute(config.roleMode === "highest", "selected")} data-astro-cid-5lyycc4g>${dt("Only the highest earned")}</option> <option value="all"${addAttribute(config.roleMode === "all", "selected")} data-astro-cid-5lyycc4g>${dt("Stack every earned role")}</option> </select> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("The roles themselves are chosen in Level rewards.")}</p> </div> </div> <div class="lv-section-label" data-astro-cid-5lyycc4g> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chat-circle-text-fill", "width": "14", "height": "14", "data-astro-cid-5lyycc4g": true })} ${dt("Level-up announcement")} </div> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field" data-astro-cid-5lyycc4g> <label for="lv-notify_mode" data-astro-cid-5lyycc4g>${dt("Level-up announcement")}</label> <select id="lv-notify_mode" name="notify_mode" data-astro-cid-5lyycc4g> <option value="off"${addAttribute(config.notifyMode === "off", "selected")} data-astro-cid-5lyycc4g>${dt("Off")}</option> <option value="reply"${addAttribute(config.notifyMode === "reply", "selected")} data-astro-cid-5lyycc4g>${dt("Reply in the same channel")}</option> <option value="channel"${addAttribute(config.notifyMode === "channel", "selected")} data-astro-cid-5lyycc4g>${dt("Fixed channel")}</option> <option value="dm"${addAttribute(config.notifyMode === "dm", "selected")} data-astro-cid-5lyycc4g>${dt("Direct message")}</option> </select> </div> <div class="lv-field" data-lv-dep="announce_on channel_used" data-astro-cid-5lyycc4g> <label for="lv-notify_channel_id" data-astro-cid-5lyycc4g>${dt("Announcement channel")}</label> <select id="lv-notify_channel_id" name="notify_channel_id" data-fill="lv-ch" data-astro-cid-5lyycc4g> <option value="" data-astro-cid-5lyycc4g>${dt("None")}</option> ${config.notifyChannelId && !channels.some((channel) => channel.id === config.notifyChannelId) && renderTemplate`<option${addAttribute(config.notifyChannelId, "value")} selected data-astro-cid-5lyycc4g>${missingLabel(config.notifyChannelId)}</option>`} ${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": channels, "selected": config.notifyChannelId, "prefix": "#", "data-astro-cid-5lyycc4g": true })} </select> </div> <div class="lv-field lv-field-wide" data-lv-dep="announce_on" data-astro-cid-5lyycc4g> <label for="lv-notify_message" data-astro-cid-5lyycc4g>${dt("Announcement message")}</label> <textarea id="lv-notify_message" class="dgl-autogrow" rows="2" name="notify_message" data-count data-ac maxlength="200" data-dp data-dp-template="notify_embed_template" data-dp-embed="notify_embed"${addAttribute(dt("Level up!"), "data-dp-title")} placeholder="{EMOJI} {user} just leveled up to **{level}**!" data-astro-cid-5lyycc4g>${config.notifyMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-5lyycc4g": true })} <p class="lv-hint" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(dth("<code>{a}</code> adds the level-up icon. Use the variables below to personalize it.", { a: "{EMOJI}" }))}` })}</p> ${renderComponent($$result2, "VariableHelp", $$VariableHelp, { "data-astro-cid-5lyycc4g": true })} </div> <div class="lv-field lv-field-wide" data-lv-dep="announce_on" data-astro-cid-5lyycc4g> <label for="lv-notify_embed_template" data-astro-cid-5lyycc4g>${dt("Saved embed template")}</label> <select id="lv-notify_embed_template" name="notify_embed_template" data-astro-cid-5lyycc4g> <option value=""${addAttribute(!config.notifyEmbedTemplate, "selected")} data-astro-cid-5lyycc4g>${dt("Use the message above")}</option> ${missingOption(embedTemplateNames, config.notifyEmbedTemplate) && renderTemplate`<option${addAttribute(config.notifyEmbedTemplate, "value")} selected data-astro-cid-5lyycc4g>${missingLabel(config.notifyEmbedTemplate)}</option>`} ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === config.notifyEmbedTemplate, "selected")} data-astro-cid-5lyycc4g>${name}</option>`)} </select> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("Create and edit templates from")} <a${addAttribute(`/dash/guild/${guildId}/embeds`, "href")} data-astro-cid-5lyycc4g>${dt("Embeds")}</a>${dt(". The template can use the same leveling variables.")}</p> </div> </div> <details class="lv-adv" data-lv-adv${addAttribute(advNotify(config), "open")} data-astro-cid-5lyycc4g> <summary data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right-bold", "width": "12", "height": "12", "data-astro-cid-5lyycc4g": true })}${dt("Advanced announcement options")}</summary> <div class="lv-grid lv-adv-body" data-astro-cid-5lyycc4g> <div class="lv-check-wrap" data-lv-dep="announce_on no_template" data-astro-cid-5lyycc4g> <label class="lv-inline-check" data-astro-cid-5lyycc4g><input type="checkbox" name="notify_embed"${addAttribute(config.notifyEmbed, "checked")} data-astro-cid-5lyycc4g>${dt("Use a simple embed when no template is selected")}</label> </div> <div class="lv-check-wrap" data-lv-dep="announce_on reply_used" data-astro-cid-5lyycc4g> <label class="lv-inline-check" data-astro-cid-5lyycc4g><input type="checkbox" name="notify_reply"${addAttribute(config.notifyReply, "checked")} data-astro-cid-5lyycc4g>${dt("Answer the message that made them level up")}</label> </div> <div class="lv-check-wrap" data-lv-dep="announce_on" data-astro-cid-5lyycc4g> <label class="lv-inline-check" data-astro-cid-5lyycc4g><input type="checkbox" name="notify_ping"${addAttribute(config.notifyPing, "checked")} data-astro-cid-5lyycc4g>${dt("Ping the member in the announcement")}</label> </div> <div class="lv-field" data-lv-dep="announce_on" data-astro-cid-5lyycc4g> <label for="lv-notify_delete_after" data-astro-cid-5lyycc4g>${dt("Delete the announcement after (seconds)")}</label> <input id="lv-notify_delete_after" type="number" name="notify_delete_after"${addAttribute(config.notifyDeleteAfter, "value")} min="0" max="86400" data-astro-cid-5lyycc4g> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("0 keeps it. Otherwise Petto deletes the announcement after this time, so the channel stays clean.")}</p> </div> <div class="lv-field" data-lv-dep="announce_on" data-astro-cid-5lyycc4g> <label for="lv-notify_every" data-astro-cid-5lyycc4g>${dt("Announce every N levels")}</label> <input id="lv-notify_every" type="number" name="notify_every"${addAttribute(config.notifyEvery, "value")}${addAttribute(minFor(config.notifyEvery, 1), "min")}${addAttribute(maxFor(config.notifyEvery, 50), "max")} data-astro-cid-5lyycc4g> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("1 announces every level, 5 announces levels 5, 10, 15...")}</p> </div> <div class="lv-field lv-field-wide" data-lv-dep="announce_on" data-astro-cid-5lyycc4g> <label for="lv-notify_milestones" data-astro-cid-5lyycc4g>${dt("Levels with a message of their own")}</label> <textarea id="lv-notify_milestones" class="dgl-autogrow" name="notify_milestones" rows="3" data-ac${addAttribute("10: {user} is now level {level} and got {level_role}!", "placeholder")} data-astro-cid-5lyycc4g>${config.notifyMilestones}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-5lyycc4g": true })} <p class="lv-hint" data-astro-cid-5lyycc4g>${dt('One level per line, like 10: your message. That level is always announced with its own message, even with "every N levels".')}</p> </div> </div> </details> <details class="lv-adv" data-lv-adv${addAttribute(advMore, "open")} data-astro-cid-5lyycc4g> <summary data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right-bold", "width": "12", "height": "12", "data-astro-cid-5lyycc4g": true })}${dt("Advanced")}</summary> <div class="lv-grid lv-adv-body" data-astro-cid-5lyycc4g> <div class="lv-field" data-lv-dep="voice_on" data-astro-cid-5lyycc4g> <label for="lv-xp_per_vc_minute" data-astro-cid-5lyycc4g>${dt("XP per voice minute")}</label> <input id="lv-xp_per_vc_minute" type="number" name="xp_per_vc_minute"${addAttribute(config.xpPerVcMinute, "value")}${addAttribute(minFor(config.xpPerVcMinute, 0), "min")}${addAttribute(maxFor(config.xpPerVcMinute, 1e3), "max")} data-astro-cid-5lyycc4g> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("Voice has its own page, with its own curve and announcements.")} <a${addAttribute(lvHref.voice, "href")} data-astro-cid-5lyycc4g>${dt("Open Voice leveling")}</a></p> </div> <div class="lv-field" data-lv-dep="join_xp_used" data-astro-cid-5lyycc4g> <label for="lv-join_xp" data-astro-cid-5lyycc4g>${dt("XP on join")}</label> <input id="lv-join_xp" type="number" name="join_xp"${addAttribute(config.joinXp, "value")} min="0" data-astro-cid-5lyycc4g> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt('What a new member starts with. If "Level on join" is set, the level is used instead.')}</p> </div> <div class="lv-field" data-astro-cid-5lyycc4g> <label for="lv-join_level" data-astro-cid-5lyycc4g>${dt("Level on join")}</label> <input id="lv-join_level" type="number" name="join_level"${addAttribute(config.joinLevel, "value")}${addAttribute(minFor(config.joinLevel, 0), "min")}${addAttribute(maxFor(config.joinLevel, 1e3), "max")} data-astro-cid-5lyycc4g> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("0 turns it off.")}</p> </div> <div class="lv-field lv-field-wide" data-astro-cid-5lyycc4g> <label data-astro-cid-5lyycc4g>${dt("Ignored channels")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "ignored_channel_ids", "options": withMissing(channels.map((ch) => ({ id: ch.id, name: `#${ch.name}` })), config.ignoredChannelIds), "selected": config.ignoredChannelIds, "placeholder": dt("Search channels..."), "data-astro-cid-5lyycc4g": true })} <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("No XP is granted for messages in these channels.")}</p> </div> <div class="lv-field lv-field-wide" data-astro-cid-5lyycc4g> <label data-astro-cid-5lyycc4g>${dt("Ignored categories")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "ignored_category_ids", "options": withMissing(categories.map((category) => ({ id: category.id, name: category.name })), config.ignoredCategoryIds), "selected": config.ignoredCategoryIds, "placeholder": dt("Search categories..."), "data-astro-cid-5lyycc4g": true })} <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("No XP is granted in any channel of these categories.")}</p> </div> </div> </details> <details class="lv-adv lv-adv-curve" data-lv-adv${addAttribute(advCurve, "open")} data-astro-cid-5lyycc4g> <summary data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right-bold", "width": "12", "height": "12", "data-astro-cid-5lyycc4g": true })}${dt("XP curve and level limit")}</summary> <div class="lv-advanced lv-curve-editor" data-curve-editor data-astro-cid-5lyycc4g> <div class="lv-curve-head" data-astro-cid-5lyycc4g> <div data-astro-cid-5lyycc4g> <div class="lv-curve-title" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-line-up", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}${dt("XP curve")}</div> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("Shape the progression and see the result before saving. Existing XP is interpreted with the new curve.")}</p> </div> <div class="lv-curve-stats" data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g>${dt("Lv.10")} <b data-curve-stat="10" data-astro-cid-5lyycc4g>${dt("{a} XP", { a: formatCurve(curveTotal(10)) })}</b></span><span data-astro-cid-5lyycc4g>${dt("Lv.25")} <b data-curve-stat="25" data-astro-cid-5lyycc4g>${dt("{a} XP", { a: formatCurve(curveTotal(25)) })}</b></span><span data-astro-cid-5lyycc4g>${dt("Lv.50")} <b data-curve-stat="50" data-astro-cid-5lyycc4g>${dt("{a} XP", { a: formatCurve(curveTotal(50)) })}</b></span></div> </div> <div class="lv-curve-layout" data-astro-cid-5lyycc4g> <div class="lv-curve-controls" data-astro-cid-5lyycc4g> <div class="lv-formula"${addAttribute(dt("XP formula"), "aria-label")} data-astro-cid-5lyycc4g> <span data-astro-cid-5lyycc4g>${dt("XP(L) =")}</span> <label data-astro-cid-5lyycc4g><input type="number" name="curve_a"${addAttribute(config.curveA, "value")} step="0.1" min="0"${addAttribute(dt("Curve A"), "aria-label")} data-astro-cid-5lyycc4g> L<sup data-astro-cid-5lyycc4g>3</sup></label> <span data-astro-cid-5lyycc4g>+</span> <label data-astro-cid-5lyycc4g><input type="number" name="curve_b"${addAttribute(config.curveB, "value")} step="0.1" min="0"${addAttribute(dt("Curve B"), "aria-label")} data-astro-cid-5lyycc4g> L<sup data-astro-cid-5lyycc4g>2</sup></label> <span data-astro-cid-5lyycc4g>+</span> <label data-astro-cid-5lyycc4g><input type="number" name="curve_c"${addAttribute(config.curveC, "value")} step="0.1" min="0"${addAttribute(dt("Curve C"), "aria-label")} data-astro-cid-5lyycc4g> L</label> </div> <div class="lv-preset-row" data-astro-cid-5lyycc4g> <div class="lv-field" data-astro-cid-5lyycc4g> <label data-astro-cid-5lyycc4g>${dt("Curve preset")}</label> <select data-curve-preset data-astro-cid-5lyycc4g> <option value="custom" data-astro-cid-5lyycc4g>${dt("Custom")}</option> <option value="balanced" data-astro-cid-5lyycc4g>${dt("Balanced")}</option> <option value="quick" data-astro-cid-5lyycc4g>${dt("Quick start")}</option> <option value="long" data-astro-cid-5lyycc4g>${dt("Long progression")}</option> </select> </div> <p class="lv-preset-description" data-curve-preset-description data-astro-cid-5lyycc4g>${dt("Adjust the values above to create your own curve.")}</p> </div> <div class="lv-curve-options" data-astro-cid-5lyycc4g> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Difficulty")}</label><input type="number" name="difficulty"${addAttribute(config.difficulty, "value")} step="0.1" min="0.1" data-astro-cid-5lyycc4g></div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Round to nearest")}</label><input type="number" name="rounding"${addAttribute(config.rounding, "value")}${addAttribute(minFor(config.rounding, 1), "min")} data-astro-cid-5lyycc4g></div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Max level")}</label><input type="number" name="max_level"${addAttribute(config.maxLevel, "value")}${addAttribute(minFor(config.maxLevel, 1), "min")}${addAttribute(maxFor(config.maxLevel, 1e4), "max")} data-astro-cid-5lyycc4g></div> </div> <p class="lv-hint lv-advanced-warn" data-astro-cid-5lyycc4g>${dt("A higher difficulty or steeper curve means members need more XP for each level. Rounding keeps totals readable.")}</p> </div> <div class="lv-curve-chart"${addAttribute(dt("Live XP curve preview"), "aria-label")} data-astro-cid-5lyycc4g> <svg viewBox="0 0 620 270" role="img" aria-labelledby="curve-title curve-desc" preserveAspectRatio="none" data-astro-cid-5lyycc4g> <title id="curve-title">${dt("XP required by level")}</title> <desc id="curve-desc" data-astro-cid-5lyycc4g>${dt("Live preview of the XP curve from level zero to fifty.")}</desc> <g class="lv-chart-grid" data-astro-cid-5lyycc4g> <line x1="44" y1="24" x2="600" y2="24" data-astro-cid-5lyycc4g></line><line x1="44" y1="78" x2="600" y2="78" data-astro-cid-5lyycc4g></line><line x1="44" y1="132" x2="600" y2="132" data-astro-cid-5lyycc4g></line><line x1="44" y1="186" x2="600" y2="186" data-astro-cid-5lyycc4g></line><line x1="44" y1="240" x2="600" y2="240" data-astro-cid-5lyycc4g></line> <line x1="44" y1="24" x2="44" y2="240" data-astro-cid-5lyycc4g></line><line x1="155" y1="24" x2="155" y2="240" data-astro-cid-5lyycc4g></line><line x1="266" y1="24" x2="266" y2="240" data-astro-cid-5lyycc4g></line><line x1="377" y1="24" x2="377" y2="240" data-astro-cid-5lyycc4g></line><line x1="488" y1="24" x2="488" y2="240" data-astro-cid-5lyycc4g></line><line x1="600" y1="24" x2="600" y2="240" data-astro-cid-5lyycc4g></line> </g> <path class="lv-chart-area" data-curve-area${addAttribute(`${curvePath} L600 240 L44 240 Z`, "d")} data-astro-cid-5lyycc4g></path> <path class="lv-chart-line" data-curve-line${addAttribute(curvePath, "d")} data-astro-cid-5lyycc4g></path> <text x="44" y="260" data-astro-cid-5lyycc4g>0</text><text x="266" y="260" data-astro-cid-5lyycc4g>20</text><text x="488" y="260" data-astro-cid-5lyycc4g>40</text><text x="586" y="260" data-astro-cid-5lyycc4g>50</text> <text x="10" y="30" data-curve-axis="max" data-astro-cid-5lyycc4g>${formatCurve(curveMax)}</text><text x="10" y="244" data-astro-cid-5lyycc4g>0</text> </svg> </div> </div> <div class="lv-curve-table-wrap" data-astro-cid-5lyycc4g> <table class="lv-curve-table" data-astro-cid-5lyycc4g> <thead data-astro-cid-5lyycc4g><tr data-astro-cid-5lyycc4g><th data-astro-cid-5lyycc4g>${dt("Level")}</th><th data-astro-cid-5lyycc4g>${dt("Total XP")}</th><th data-astro-cid-5lyycc4g>${dt("Total messages")}</th><th data-astro-cid-5lyycc4g>${dt("Total cooldown")}</th></tr></thead> <tbody data-astro-cid-5lyycc4g> ${curvePreviewLevels.map((level) => renderTemplate`<tr${addAttribute(level, "data-curve-row")} data-astro-cid-5lyycc4g><td data-astro-cid-5lyycc4g>${level}</td><td data-curve-total data-astro-cid-5lyycc4g>${dt("{a} XP", { a: formatCurve(curveTotal(level)) })}</td><td data-curve-messages data-astro-cid-5lyycc4g>~${formatCurve(curveMessages(level))}</td><td data-curve-cooldown data-astro-cid-5lyycc4g>${formatCooldown(curveCooldown(level))}</td></tr>`)} </tbody> </table> </div> </div> </details> </div> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-5lyycc4g>${dt("Save changes")}</button> </form>`, selectedSection === "voice" && renderTemplate`<form method="POST"${addAttribute(["lv-form", "lv-voice-form", { "lv-section-hidden": selectedSection !== "voice" }], "class:list")} data-lv-form="voice"${addAttribute(JSON.stringify(lvFlags), "data-lv-flags")}${addAttribute(JSON.stringify(lvHref), "data-lv-hrefs")} data-astro-cid-5lyycc4g> <input type="hidden" name="action" value="voice_config" data-astro-cid-5lyycc4g> <div class="lv-card lv-voice-card lv-master" data-astro-cid-5lyycc4g> <div class="lv-card-head" data-astro-cid-5lyycc4g> <div class="lv-card-icon" style="--c:var(--blue)" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:headphones-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}</div> <div class="lv-card-title" id="lv-voice-title" data-astro-cid-5lyycc4g>${dt("Voice leveling enabled")}</div> <label class="lv-switch" data-astro-cid-5lyycc4g><input type="checkbox" name="voice_enabled"${addAttribute(voiceConfig.enabled, "checked")} aria-labelledby="lv-voice-title" aria-describedby="lv-status-voice" data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g></span></label> </div> <p class="lv-card-desc" data-astro-cid-5lyycc4g>${dt("Track time spent in voice separately from messages. Voice XP has its own level, rank, leaderboard, curve, and announcements.")}</p> <p class="lv-status" id="lv-status-voice" data-lv-status="voice" aria-live="polite" data-astro-cid-5lyycc4g>${statusVoice}</p> </div> <p class="lv-gate-note" data-lv-gate-note role="status" hidden data-astro-cid-5lyycc4g>${dt("Voice leveling is off. Turn it on to edit what is below. Everything you saved stays as it is.")}</p> <div class="lv-gate" data-lv-gate="voice_enabled" data-astro-cid-5lyycc4g> <div class="lv-section-label" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sliders-horizontal-fill", "width": "14", "height": "14", "data-astro-cid-5lyycc4g": true })}${dt("Voice configuration")}</div> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field" data-astro-cid-5lyycc4g> <label for="lv-voice_xp_per_minute" data-astro-cid-5lyycc4g>${dt("XP per voice minute")}</label> <input id="lv-voice_xp_per_minute" type="number" name="voice_xp_per_minute"${addAttribute(voiceConfig.xpPerMinute, "value")}${addAttribute(minFor(voiceConfig.xpPerMinute, 0), "min")}${addAttribute(maxFor(voiceConfig.xpPerMinute, 1e3), "max")} data-astro-cid-5lyycc4g> <span class="lv-hint" data-astro-cid-5lyycc4g>${voiceXpHint} <a${addAttribute(`/dash/guild/${guildId}/leveling?section=rules`, "href")} data-astro-cid-5lyycc4g>${dt("Change it in Rules and events")}</a></span> </div> <div class="lv-field" data-astro-cid-5lyycc4g> <span class="lv-label" id="lv-voice_role_mode-label" data-astro-cid-5lyycc4g>${dt("Reward roles")}</span> <div class="dfx-chips" role="radiogroup" aria-labelledby="lv-voice_role_mode-label" data-astro-cid-5lyycc4g> <label class="dfx-chip" data-astro-cid-5lyycc4g><input id="lv-voice_role_mode" type="radio" name="voice_role_mode" value="highest"${addAttribute(voiceConfig.roleMode !== "all", "checked")} data-astro-cid-5lyycc4g>${dt("Only the highest earned")}</label> <label class="dfx-chip" data-astro-cid-5lyycc4g><input type="radio" name="voice_role_mode" value="all"${addAttribute(voiceConfig.roleMode === "all", "checked")} data-astro-cid-5lyycc4g>${dt("Stack every earned role")}</label> </div> </div> </div> <div class="lv-section-label" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chat-circle-text-fill", "width": "14", "height": "14", "data-astro-cid-5lyycc4g": true })}${dt("Voice level-up announcement")}</div> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field lv-field-wide" data-astro-cid-5lyycc4g> <span class="lv-label" id="lv-voice_notify_mode-label" data-astro-cid-5lyycc4g>${dt("Voice level-up announcement")}</span> <div class="dfx-chips" role="radiogroup" aria-labelledby="lv-voice_notify_mode-label" data-astro-cid-5lyycc4g> <label class="dfx-chip" data-astro-cid-5lyycc4g><input id="lv-voice_notify_mode" type="radio" name="voice_notify_mode" value="off"${addAttribute(voiceConfig.notifyMode === "off", "checked")} data-astro-cid-5lyycc4g>${dt("Off")}</label> <label class="dfx-chip" data-astro-cid-5lyycc4g><input type="radio" name="voice_notify_mode" value="reply"${addAttribute(voiceConfig.notifyMode === "reply", "checked")} data-astro-cid-5lyycc4g>${dt("In the voice channel chat")}</label> <label class="dfx-chip" data-astro-cid-5lyycc4g><input type="radio" name="voice_notify_mode" value="channel"${addAttribute(voiceConfig.notifyMode === "channel", "checked")} data-astro-cid-5lyycc4g>${dt("Fixed channel")}</label> <label class="dfx-chip" data-astro-cid-5lyycc4g><input type="radio" name="voice_notify_mode" value="dm"${addAttribute(voiceConfig.notifyMode === "dm", "checked")} data-astro-cid-5lyycc4g>${dt("Direct message")}</label> </div> </div> <div class="lv-field" data-lv-dep="v_announce_on v_channel_used" data-astro-cid-5lyycc4g> <label for="lv-voice_notify_channel_id" data-astro-cid-5lyycc4g>${dt("Announcement channel")}</label> <select id="lv-voice_notify_channel_id" name="voice_notify_channel_id" data-fill="lv-ch" data-astro-cid-5lyycc4g> <option value="" data-astro-cid-5lyycc4g>${dt("None")}</option> ${voiceConfig.notifyChannelId && !channels.some((channel) => channel.id === voiceConfig.notifyChannelId) && renderTemplate`<option${addAttribute(voiceConfig.notifyChannelId, "value")} selected data-astro-cid-5lyycc4g>${missingLabel(voiceConfig.notifyChannelId)}</option>`} ${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": channels, "selected": voiceConfig.notifyChannelId, "prefix": "#", "data-astro-cid-5lyycc4g": true })} </select> </div> <div class="lv-field lv-field-wide" data-lv-dep="v_announce_on" data-astro-cid-5lyycc4g> <label for="lv-voice_notify_message" data-astro-cid-5lyycc4g>${dt("Voice announcement message")}</label> <textarea id="lv-voice_notify_message" class="dgl-autogrow" rows="2" name="voice_notify_message" data-count data-ac maxlength="200" data-dp data-dp-template="voice_notify_embed_template" data-dp-embed="voice_notify_embed"${addAttribute(dt("Level up!"), "data-dp-title")} data-astro-cid-5lyycc4g>${voiceConfig.notifyMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-5lyycc4g": true })} <p class="lv-hint" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(dth("<code>{a}</code>, <code>{b}</code>, <code>{c}</code> and saved embed variables are available.", { a: "{user}", b: "{level}", c: "{level_xp}" }))}` })}</p> </div> <div class="lv-field lv-field-wide" data-lv-dep="v_announce_on" data-astro-cid-5lyycc4g> <label for="lv-voice_notify_embed_template" data-astro-cid-5lyycc4g>${dt("Saved embed template")}</label> <select id="lv-voice_notify_embed_template" name="voice_notify_embed_template" data-astro-cid-5lyycc4g> <option value=""${addAttribute(!voiceConfig.notifyEmbedTemplate, "selected")} data-astro-cid-5lyycc4g>${dt("Use the message above")}</option> ${missingOption(embedTemplateNames, voiceConfig.notifyEmbedTemplate) && renderTemplate`<option${addAttribute(voiceConfig.notifyEmbedTemplate, "value")} selected data-astro-cid-5lyycc4g>${missingLabel(voiceConfig.notifyEmbedTemplate)}</option>`} ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === voiceConfig.notifyEmbedTemplate, "selected")} data-astro-cid-5lyycc4g>${name}</option>`)} </select> </div> </div> <details class="lv-adv" data-lv-adv${addAttribute(advNotify({ notifyPing: voiceConfig.notifyPing, notifyDeleteAfter: voiceConfig.notifyDeleteAfter, notifyEvery: voiceConfig.notifyEvery, notifyMilestones: voiceConfig.notifyMilestones, notifyEmbed: voiceConfig.notifyEmbed }), "open")} data-astro-cid-5lyycc4g> <summary data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right-bold", "width": "12", "height": "12", "data-astro-cid-5lyycc4g": true })}${dt("Advanced announcement options")}</summary> <div class="lv-grid lv-adv-body" data-astro-cid-5lyycc4g> <div class="lv-check-wrap" data-lv-dep="v_announce_on v_no_template" data-astro-cid-5lyycc4g> <label class="lv-inline-check" data-astro-cid-5lyycc4g><input type="checkbox" name="voice_notify_embed"${addAttribute(voiceConfig.notifyEmbed, "checked")} data-astro-cid-5lyycc4g>${dt("Use a simple embed when no template is selected")}</label> </div> <div class="lv-check-wrap" data-lv-dep="v_announce_on" data-astro-cid-5lyycc4g> <label class="lv-inline-check" data-astro-cid-5lyycc4g><input type="checkbox" name="voice_notify_ping"${addAttribute(voiceConfig.notifyPing, "checked")} data-astro-cid-5lyycc4g>${dt("Ping the member in the announcement")}</label> </div> <div class="lv-field" data-lv-dep="v_announce_on" data-astro-cid-5lyycc4g> <label for="lv-voice_notify_every" data-astro-cid-5lyycc4g>${dt("Announce every N levels")}</label> <input id="lv-voice_notify_every" type="number" name="voice_notify_every"${addAttribute(voiceConfig.notifyEvery, "value")}${addAttribute(minFor(voiceConfig.notifyEvery, 1), "min")}${addAttribute(maxFor(voiceConfig.notifyEvery, 50), "max")} data-astro-cid-5lyycc4g> </div> <div class="lv-field" data-lv-dep="v_announce_on" data-astro-cid-5lyycc4g> <label for="lv-voice_notify_delete_after" data-astro-cid-5lyycc4g>${dt("Delete the announcement after (seconds)")}</label> <input id="lv-voice_notify_delete_after" type="number" name="voice_notify_delete_after"${addAttribute(voiceConfig.notifyDeleteAfter, "value")} min="0" max="86400" data-astro-cid-5lyycc4g> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("0 keeps it. Otherwise Petto deletes the announcement after this time, so the channel stays clean.")}</p> </div> <div class="lv-field lv-field-wide" data-lv-dep="v_announce_on" data-astro-cid-5lyycc4g> <label for="lv-voice_notify_milestones" data-astro-cid-5lyycc4g>${dt("Voice levels with a message of their own")}</label> <textarea id="lv-voice_notify_milestones" class="dgl-autogrow" name="voice_notify_milestones" rows="3" data-ac${addAttribute("10: {user} reached voice level {level} and got {level_role}!", "placeholder")} data-astro-cid-5lyycc4g>${voiceConfig.notifyMilestones}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-5lyycc4g": true })} <p class="lv-hint" data-astro-cid-5lyycc4g>${dt('One level per line, like 10: your message. That level is always announced with its own message, even with "every N levels".')}</p> </div> </div> </details> <details class="lv-adv" data-lv-adv${addAttribute(advVoiceMore, "open")} data-astro-cid-5lyycc4g> <summary data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right-bold", "width": "12", "height": "12", "data-astro-cid-5lyycc4g": true })}${dt("Advanced")}</summary> <div class="lv-grid lv-adv-body" data-astro-cid-5lyycc4g> <div class="lv-field lv-field-wide" data-astro-cid-5lyycc4g> <label data-astro-cid-5lyycc4g>${dt("Ignored voice channels")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "voice_ignored_channel_ids", "options": withMissing(voiceChannels.map((channel) => ({ id: channel.id, name: `Voice \xB7 ${channel.name}` })), voiceConfig.ignoredChannelIds), "selected": voiceConfig.ignoredChannelIds, "placeholder": dt("Search voice channels..."), "data-astro-cid-5lyycc4g": true })} <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("Members in these voice channels do not gain voice XP.")}</p> </div> <div class="lv-field lv-field-wide" data-astro-cid-5lyycc4g> <label data-astro-cid-5lyycc4g>${dt("Ignored voice categories")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "voice_ignored_category_ids", "options": withMissing(categories.map((category) => ({ id: category.id, name: category.name })), voiceConfig.ignoredCategoryIds), "selected": voiceConfig.ignoredCategoryIds, "placeholder": dt("Search categories..."), "data-astro-cid-5lyycc4g": true })} <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("Members in voice channels of these categories do not gain voice XP.")}</p> </div> </div> </details> <details class="lv-adv lv-adv-curve" data-lv-adv${addAttribute(advVoiceCurve, "open")} data-astro-cid-5lyycc4g> <summary data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right-bold", "width": "12", "height": "12", "data-astro-cid-5lyycc4g": true })}${dt("Voice XP curve and level limit")}</summary> <div class="lv-advanced lv-curve-editor" data-voice-curve-editor data-astro-cid-5lyycc4g> <div class="lv-curve-head" data-astro-cid-5lyycc4g> <div data-astro-cid-5lyycc4g> <div class="lv-curve-title" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-line-up", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}${dt("Voice XP curve")}</div> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("A separate curve controls voice levels. Change it and the preview updates immediately.")}</p> </div> <div class="lv-curve-stats" data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g>${dt("Lv.10")} <b data-voice-curve-stat="10" data-astro-cid-5lyycc4g>${dt("{a} XP", { a: formatCurve(voiceCurveTotal(10)) })}</b></span><span data-astro-cid-5lyycc4g>${dt("Lv.25")} <b data-voice-curve-stat="25" data-astro-cid-5lyycc4g>${dt("{a} XP", { a: formatCurve(voiceCurveTotal(25)) })}</b></span><span data-astro-cid-5lyycc4g>${dt("Lv.50")} <b data-voice-curve-stat="50" data-astro-cid-5lyycc4g>${dt("{a} XP", { a: formatCurve(voiceCurveTotal(50)) })}</b></span></div> </div> <div class="lv-curve-layout" data-astro-cid-5lyycc4g> <div class="lv-curve-controls" data-astro-cid-5lyycc4g> <div class="lv-formula"${addAttribute(dt("Voice XP formula"), "aria-label")} data-astro-cid-5lyycc4g> <span data-astro-cid-5lyycc4g>${dt("XP(L) =")}</span> <label data-astro-cid-5lyycc4g><input type="number" name="voice_curve_a"${addAttribute(voiceConfig.curveA, "value")} step="0.1" min="0"${addAttribute(dt("Voice curve A"), "aria-label")} data-astro-cid-5lyycc4g> L<sup data-astro-cid-5lyycc4g>3</sup></label> <span data-astro-cid-5lyycc4g>+</span> <label data-astro-cid-5lyycc4g><input type="number" name="voice_curve_b"${addAttribute(voiceConfig.curveB, "value")} step="0.1" min="0"${addAttribute(dt("Voice curve B"), "aria-label")} data-astro-cid-5lyycc4g> L<sup data-astro-cid-5lyycc4g>2</sup></label> <span data-astro-cid-5lyycc4g>+</span> <label data-astro-cid-5lyycc4g><input type="number" name="voice_curve_c"${addAttribute(voiceConfig.curveC, "value")} step="0.1" min="0"${addAttribute(dt("Voice curve C"), "aria-label")} data-astro-cid-5lyycc4g> L</label> </div> <div class="lv-curve-options" data-astro-cid-5lyycc4g> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Difficulty")}</label><input type="number" name="voice_difficulty"${addAttribute(voiceConfig.difficulty, "value")} step="0.1" min="0.1" data-astro-cid-5lyycc4g></div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Round to nearest")}</label><input type="number" name="voice_rounding"${addAttribute(voiceConfig.rounding, "value")}${addAttribute(minFor(voiceConfig.rounding, 1), "min")} data-astro-cid-5lyycc4g></div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Max level")}</label><input type="number" name="voice_max_level"${addAttribute(voiceConfig.maxLevel, "value")}${addAttribute(minFor(voiceConfig.maxLevel, 1), "min")}${addAttribute(maxFor(voiceConfig.maxLevel, 1e4), "max")} data-astro-cid-5lyycc4g></div> </div> </div> <div class="lv-curve-chart"${addAttribute(dt("Live voice XP curve preview"), "aria-label")} data-astro-cid-5lyycc4g> <svg viewBox="0 0 620 270" role="img"${addAttribute(dt("Voice XP required by level"), "aria-label")} preserveAspectRatio="none" data-astro-cid-5lyycc4g> <g class="lv-chart-grid" data-astro-cid-5lyycc4g><line x1="44" y1="24" x2="600" y2="24" data-astro-cid-5lyycc4g></line><line x1="44" y1="78" x2="600" y2="78" data-astro-cid-5lyycc4g></line><line x1="44" y1="132" x2="600" y2="132" data-astro-cid-5lyycc4g></line><line x1="44" y1="186" x2="600" y2="186" data-astro-cid-5lyycc4g></line><line x1="44" y1="240" x2="600" y2="240" data-astro-cid-5lyycc4g></line><line x1="44" y1="24" x2="44" y2="240" data-astro-cid-5lyycc4g></line><line x1="155" y1="24" x2="155" y2="240" data-astro-cid-5lyycc4g></line><line x1="266" y1="24" x2="266" y2="240" data-astro-cid-5lyycc4g></line><line x1="377" y1="24" x2="377" y2="240" data-astro-cid-5lyycc4g></line><line x1="488" y1="24" x2="488" y2="240" data-astro-cid-5lyycc4g></line><line x1="600" y1="24" x2="600" y2="240" data-astro-cid-5lyycc4g></line></g> <path class="lv-chart-area" data-voice-curve-area${addAttribute(`${voiceCurvePath} L600 240 L44 240 Z`, "d")} data-astro-cid-5lyycc4g></path> <path class="lv-chart-line" data-voice-curve-line${addAttribute(voiceCurvePath, "d")} data-astro-cid-5lyycc4g></path> <text x="44" y="260" data-astro-cid-5lyycc4g>0</text><text x="266" y="260" data-astro-cid-5lyycc4g>20</text><text x="488" y="260" data-astro-cid-5lyycc4g>40</text><text x="586" y="260" data-astro-cid-5lyycc4g>50</text> <text x="10" y="30" data-voice-curve-axis="max" data-astro-cid-5lyycc4g>${formatCurve(voiceCurveMax)}</text><text x="10" y="244" data-astro-cid-5lyycc4g>0</text> </svg> </div> </div> <div class="lv-curve-table-wrap" data-astro-cid-5lyycc4g> <table class="lv-curve-table" data-astro-cid-5lyycc4g><thead data-astro-cid-5lyycc4g><tr data-astro-cid-5lyycc4g><th data-astro-cid-5lyycc4g>${dt("Level")}</th><th data-astro-cid-5lyycc4g>${dt("Total XP")}</th><th data-astro-cid-5lyycc4g>${dt("Voice minutes")}</th><th data-astro-cid-5lyycc4g>${dt("Approx. time")}</th></tr></thead><tbody data-astro-cid-5lyycc4g> ${curvePreviewLevels.map((level) => renderTemplate`<tr${addAttribute(level, "data-voice-curve-row")} data-astro-cid-5lyycc4g><td data-astro-cid-5lyycc4g>${level}</td><td data-voice-curve-total data-astro-cid-5lyycc4g>${dt("{a} XP", { a: formatCurve(voiceCurveTotal(level)) })}</td><td data-voice-curve-minutes data-astro-cid-5lyycc4g>~${formatCurve(voiceMinutesForLevel(level))}</td><td data-voice-curve-time data-astro-cid-5lyycc4g>~${formatDuration(voiceMinutesForLevel(level) * 60, { locale: dashLocale(dashLang) })}</td></tr>`)} </tbody></table> </div> </div> </details> </div> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-5lyycc4g>${dt("Save voice leveling")}</button> </form>`, selectedSection === "rank" && renderTemplate(_a || (_a = __template(["<div", " data-astro-cid-5lyycc4g> ", " ", ' <div class="lv-head" data-astro-cid-5lyycc4g> <h2 data-astro-cid-5lyycc4g>', "", "</h2> <p data-astro-cid-5lyycc4g>", '</p> </div> <div class="lv-rank-layout" data-astro-cid-5lyycc4g> <form method="POST" class="lv-form lv-rank-form" data-lv-form="rank"', "", ' data-astro-cid-5lyycc4g> <input type="hidden" name="action" value="rank" data-astro-cid-5lyycc4g> <p class="lv-status lv-status-solo" data-lv-status="rank" aria-live="polite" data-astro-cid-5lyycc4g>', '</p> <div class="lv-field lv-field-wide" data-astro-cid-5lyycc4g> <span class="lv-label" id="lv-rank_style-label" data-astro-cid-5lyycc4g>', '</span> <div class="sx-choices" role="radiogroup" aria-labelledby="lv-rank_style-label" data-astro-cid-5lyycc4g> ', ' </div> </div> <div class="lv-field lv-field-wide" data-lv-dep="rank_card_used" data-astro-cid-5lyycc4g> <label for="lvRankCard" data-astro-cid-5lyycc4g>', '</label> <select name="rank_card" id="lvRankCard" data-astro-cid-5lyycc4g> <option value=""', " data-astro-cid-5lyycc4g>", "</option> ", " ", ' </select> <span class="lv-hint" data-astro-cid-5lyycc4g><a', " data-astro-cid-5lyycc4g>", '</a></span> </div> <div class="lv-section-label" data-astro-cid-5lyycc4g>', "", '</div> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field" data-lv-dep="notify_card_used" data-astro-cid-5lyycc4g> <label for="lv-notify_card" data-astro-cid-5lyycc4g>', '</label> <select id="lv-notify_card" name="notify_card" data-astro-cid-5lyycc4g> <option value=""', " data-astro-cid-5lyycc4g>", "</option> ", " ", ' </select> <p class="lv-hint" data-astro-cid-5lyycc4g>', '</p> </div> <div class="lv-field" data-lv-dep="voice_card_used" data-astro-cid-5lyycc4g> <label for="lv-voice_notify_card" data-astro-cid-5lyycc4g>', '</label> <select id="lv-voice_notify_card" name="voice_notify_card" data-astro-cid-5lyycc4g> <option value=""', " data-astro-cid-5lyycc4g>", "</option> ", " ", ' </select> </div> </div> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-5lyycc4g>', '</button> </form> <div class="lv-rank-preview" data-astro-cid-5lyycc4g> <div class="lv-preview-label" data-astro-cid-5lyycc4g>', '</div> <div class="lv-rank-stage"', "", "", ' data-astro-cid-5lyycc4g><img id="lvRankImg" alt="" data-astro-cid-5lyycc4g></div> <div class="lv-preview-label" data-astro-cid-5lyycc4g>', '</div> <div class="lv-embed" aria-hidden="true" data-astro-cid-5lyycc4g> <div class="lv-embed-author" data-astro-cid-5lyycc4g><img class="lv-embed-dot"', ' alt="" referrerpolicy="no-referrer" data-astro-cid-5lyycc4g>', '</div> <div class="lv-embed-fields lv-embed-stack" data-astro-cid-5lyycc4g><div data-astro-cid-5lyycc4g><b data-astro-cid-5lyycc4g>', "</b><br data-astro-cid-5lyycc4g>12</div><div data-astro-cid-5lyycc4g><b data-astro-cid-5lyycc4g>", "</b><br data-astro-cid-5lyycc4g>#3 ", " 120</div><div data-astro-cid-5lyycc4g><b data-astro-cid-5lyycc4g>", "</b><br data-astro-cid-5lyycc4g>1,420/2,350 XP</div><div data-astro-cid-5lyycc4g><b data-astro-cid-5lyycc4g>", ' (60%)</b><div class="lv-embed-bar" data-astro-cid-5lyycc4g><span style="width:60%" data-astro-cid-5lyycc4g></span></div></div></div> <div class="lv-embed-foot" data-astro-cid-5lyycc4g>', ': 23,450</div> </div> </div> </div> <script type="application/json" id="lvCardsData">', "<\/script> </div>"])), addAttribute(["lv-section", "lv-rank-section", { "lv-section-hidden": selectedSection !== "rank" }], "class:list"), renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Rank cards"), value: rankCards.length, tone: "reactions" },
    { label: dt("Image cards"), value: cards.length, tone: "invites" }
  ], "data-astro-cid-5lyycc4g": true }), !lvFlags.textOn && renderTemplate`<p class="lv-gate-note lv-off-note" role="status" data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g>${dt("Leveling is off, so nobody earns XP right now. You can still change this page, and what you save stays.")} <a${addAttribute(lvHref.settings, "href")} data-astro-cid-5lyycc4g>${dt("Open Leveling settings")}</a></span></p>`, renderComponent($$result2, "Icon", $$Icon, { "name": "ph:identification-badge-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true }), dt("Rank card"), dt("How /levels rank answers. The card is a picture with the avatar, the name, the level and a progress bar; the embed is the text version. Make or edit cards in Image cards."), addAttribute(JSON.stringify(lvFlags), "data-lv-flags"), addAttribute(JSON.stringify(lvHref), "data-lv-hrefs"), statusRank, dt("Answer with"), [["card", dt("Card"), "ph:identification-badge-fill", dt("A picture with the avatar and the progress bar.")], ["embed", dt("Embed"), "ph:chat-text-fill", dt("The same numbers, as text in Discord.")], ["both", dt("Card and embed"), "ph:stack-fill", dt("The picture and the text together.")]].map(([value, label, icon, hint]) => renderTemplate`<label class="sx-choice" data-astro-cid-5lyycc4g><input type="radio" name="rank_style"${addAttribute(value, "value")}${addAttribute(rank.style === value, "checked")} data-astro-cid-5lyycc4g><span class="sx-choice-body" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": icon, "width": "18", "height": "18", "data-astro-cid-5lyycc4g": true })}<b data-astro-cid-5lyycc4g>${label}</b><em data-astro-cid-5lyycc4g>${hint}</em></span></label>`), dt("Rank card"), addAttribute(!rank.card, "selected"), dt("Default rank card"), rankCards.map((card) => renderTemplate`<option${addAttribute(card.name, "value")}${addAttribute(rank.card === card.name, "selected")} data-astro-cid-5lyycc4g>${card.name}</option>`), rank.card && !rankCards.some((card) => card.name === rank.card) && renderTemplate`<option${addAttribute(rank.card, "value")} selected data-astro-cid-5lyycc4g>${rank.card}</option>`, addAttribute(`/dash/guild/${guildId}/cards`, "href"), dt("Make or edit cards"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sparkle-fill", "width": "14", "height": "14", "data-astro-cid-5lyycc4g": true }), dt("Level-up card"), dt("Level-up card"), addAttribute(!rank.notifyCard, "selected"), dt("No card"), missingOption(cards.map((card) => card.name), rank.notifyCard) && renderTemplate`<option${addAttribute(rank.notifyCard, "value")} selected data-astro-cid-5lyycc4g>${missingLabel(rank.notifyCard)}</option>`, cards.map((card) => renderTemplate`<option${addAttribute(card.name, "value")}${addAttribute(rank.notifyCard === card.name, "selected")} data-astro-cid-5lyycc4g>${card.name}</option>`), dt("Sent with the level-up announcement, inside the embed when there is one."), dt("Voice level-up card"), addAttribute(!rank.voiceNotifyCard, "selected"), dt("Same as messages"), missingOption(cards.map((card) => card.name), rank.voiceNotifyCard) && renderTemplate`<option${addAttribute(rank.voiceNotifyCard, "value")} selected data-astro-cid-5lyycc4g>${missingLabel(rank.voiceNotifyCard)}</option>`, cards.map((card) => renderTemplate`<option${addAttribute(card.name, "value")}${addAttribute(rank.voiceNotifyCard === card.name, "selected")} data-astro-cid-5lyycc4g>${card.name}</option>`), dt("Save changes"), dt("Card preview"), addAttribute(dt("The preview could not be drawn."), "data-fail"), addAttribute(dt("Try again"), "data-retry"), addAttribute(dt("Drawing the preview\u2026"), "data-busy"), dt("Embed preview"), addAttribute(user.avatar ?? "/assets/mascot-icon.webp", "src"), user.username, dt("Level"), dt("Server Rank"), dt("out of"), dt("Experience"), dt("Progress"), dt("Total Experience"), unescapeHTML(JSON.stringify(Object.fromEntries(cards.map((card) => [card.name, card.data]))))), selectedSection === "rules" && renderTemplate`<div${addAttribute(["lv-section", { "lv-section-hidden": selectedSection !== "rules" }], "class:list")} data-astro-cid-5lyycc4g> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("XP events"), value: events.length, tone: "reactions" },
    { label: dt("Daily limit"), value: rules.dailyXpCap, text: rules.dailyXpCap > 0 ? void 0 : dt("No limit"), tone: "voice" },
    { label: dt("Daily bonus XP"), value: rules.dailyBonusXp, tone: "joins" },
    { label: dt("Streak days"), value: rules.streakMaxDays, tone: "invites" }
  ], "data-astro-cid-5lyycc4g": true })} ${!lvFlags.textOn && renderTemplate`<p class="lv-gate-note lv-off-note" role="status" data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g>${dt("Leveling is off, so nobody earns XP right now. You can still change this page, and what you save stays.")} <a${addAttribute(lvHref.settings, "href")} data-astro-cid-5lyycc4g>${dt("Open Leveling settings")}</a></span></p>`} <div class="lv-head" data-astro-cid-5lyycc4g> <h2 data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}${dt("Rules")}</h2> <p data-astro-cid-5lyycc4g>${dt("How XP is earned, topic by topic. Start from a profile and adjust what you want.")}</p> </div> <form method="POST" class="lv-form lv-stage-form" data-stage-form="rules" data-lv-form="rules"${addAttribute(JSON.stringify(lvFlags), "data-lv-flags")}${addAttribute(JSON.stringify(lvHref), "data-lv-hrefs")} data-astro-cid-5lyycc4g> <input type="hidden" name="action" value="rules" data-astro-cid-5lyycc4g> <p class="lv-status lv-status-solo" data-lv-status="rules" aria-live="polite" data-astro-cid-5lyycc4g>${statusRules}</p> <input type="hidden" name="events_payload" value="{}" data-stage-payload data-astro-cid-5lyycc4g> <div class="lv-card lv-profiles" data-astro-cid-5lyycc4g> <div class="lv-card-head" data-astro-cid-5lyycc4g><div class="lv-card-icon" style="--c:var(--accent)" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magic-wand-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}</div><div class="lv-card-title" data-astro-cid-5lyycc4g>${dt("Start from a profile")}</div></div> <p class="lv-card-desc" data-astro-cid-5lyycc4g>${dt("A profile fills the Chat and Voice rules in one go. Nothing is saved until you press Save, and you can change any field after.")}</p> <div class="lv-profile-row" data-astro-cid-5lyycc4g> ${ruleProfiles.map((profile) => renderTemplate`<button type="button" class="lv-profile"${addAttribute(JSON.stringify(profile.values), "data-lv-profile")} data-astro-cid-5lyycc4g> <span class="lv-profile-name" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": profile.icon, "width": "14", "height": "14", "data-astro-cid-5lyycc4g": true })}${profile.name}</span> <span class="lv-profile-text" data-astro-cid-5lyycc4g>${profile.text}</span> </button>`)} </div> </div> <div class="lv-card" data-astro-cid-5lyycc4g> <div class="lv-card-head" data-astro-cid-5lyycc4g><div class="lv-card-icon" style="--c:var(--blue)" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chat-circle-dots-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}</div><div class="lv-card-title" data-astro-cid-5lyycc4g>${dt("Chat")}</div></div> <p class="lv-card-desc" data-astro-cid-5lyycc4g>${chatSummary}</p> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field" data-lv-dep="text_on" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Minimum message length")}</label><input type="number" name="min_message_chars"${addAttribute(rules.minMessageChars, "value")} min="0" max="200" data-astro-cid-5lyycc4g><span class="lv-hint" data-astro-cid-5lyycc4g>${dt("Links, mentions and custom emoji do not count. 0 turns it off.")}</span></div> <div class="lv-field" data-lv-dep="text_on" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Daily XP limit from messages")}</label><input type="number" name="daily_xp_cap"${addAttribute(rules.dailyXpCap, "value")} min="0" max="1000000" data-astro-cid-5lyycc4g><span class="lv-hint" data-astro-cid-5lyycc4g>${dt("The most XP a member can earn from messages in a day. 0 means no limit. The daily bonus is not counted.")}</span></div> <div class="lv-check-wrap" data-lv-dep="text_on" data-astro-cid-5lyycc4g><label class="lv-check" data-astro-cid-5lyycc4g><span class="lv-check-text" data-astro-cid-5lyycc4g><b data-astro-cid-5lyycc4g>${dt("The same message again within a minute earns no XP")}</b><em data-astro-cid-5lyycc4g>${dt("Pasting the same text over and over does not farm XP.")}</em></span><input type="checkbox" name="anti_repeat"${addAttribute(rules.antiRepeat, "checked")} data-astro-cid-5lyycc4g></label></div> </div> </div> <div class="lv-card" data-astro-cid-5lyycc4g> <div class="lv-card-head" data-astro-cid-5lyycc4g><div class="lv-card-icon" style="--c:var(--green)" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:headphones-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}</div><div class="lv-card-title" data-astro-cid-5lyycc4g>${dt("Voice")}</div></div> <p class="lv-card-desc" data-astro-cid-5lyycc4g>${voiceXpHint}</p> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field" data-lv-dep="voice_on" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("People needed in voice")}</label><input type="number" name="voice_min_members"${addAttribute(rules.voiceMinMembers, "value")} min="1" max="20" data-astro-cid-5lyycc4g><span class="lv-hint" data-astro-cid-5lyycc4g>${dt("1 also earns voice XP when you are alone. Bots and deafened members do not count as company.")}</span></div> <div class="lv-field" data-lv-dep="voice_on alone_used" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("XP while alone (%)")}</label><input type="number" name="voice_alone_percent"${addAttribute(rules.voiceAlonePercent, "value")} min="0" max="100" step="5" data-astro-cid-5lyycc4g><span class="lv-hint" data-astro-cid-5lyycc4g>${dt("Only matters when 1 person is enough. 100 is all the XP, 50 is half, 0 gives nothing while alone.")}</span></div> <div class="lv-check-wrap" data-lv-dep="voice_on" data-astro-cid-5lyycc4g><label class="lv-check" data-astro-cid-5lyycc4g><span class="lv-check-text" data-astro-cid-5lyycc4g><b data-astro-cid-5lyycc4g>${dt("Only with the microphone on (no voice XP while muted)")}</b><em data-astro-cid-5lyycc4g>${dt("Petto cannot hear who is talking: it only knows if the microphone is muted or the member is deafened.")}</em></span><input type="checkbox" name="voice_ignore_muted"${addAttribute(rules.voiceIgnoreMuted, "checked")} data-astro-cid-5lyycc4g></label></div> </div> </div> <div class="lv-card" data-astro-cid-5lyycc4g> <div class="lv-card-head" data-astro-cid-5lyycc4g><div class="lv-card-icon" style="--c:var(--accent)" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:calendar-check-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}</div><div class="lv-card-title" data-astro-cid-5lyycc4g>${dt("Daily bonus and streak")}</div></div> <p class="lv-card-desc" data-astro-cid-5lyycc4g>${dt("What counts as activity, and the bonus for coming back every day.")}</p> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Daily bonus XP")}</label><input type="number" name="daily_bonus_xp"${addAttribute(rules.dailyBonusXp, "value")} min="0" max="100000" data-astro-cid-5lyycc4g><span class="lv-hint" data-astro-cid-5lyycc4g>${dt("Given on the first activity of each day. 0 turns it off.")}</span></div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Streak bonus XP per day")}</label><input type="number" name="streak_bonus_xp"${addAttribute(rules.streakBonusXp, "value")} min="0" max="10000" data-astro-cid-5lyycc4g><span class="lv-hint" data-astro-cid-5lyycc4g>${dt("Added for each earlier day in a row.")}</span></div> <div class="lv-field" data-lv-dep="streak_used" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Streak bonus stops after (days)")}</label><input type="number" name="streak_max_days"${addAttribute(rules.streakMaxDays, "value")} min="1" max="365" data-astro-cid-5lyycc4g></div> </div> </div> <div class="lv-card" data-astro-cid-5lyycc4g> <div class="lv-card-head" data-astro-cid-5lyycc4g><div class="lv-card-icon" style="--c:var(--red)" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:rocket-launch-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}</div><div class="lv-card-title" data-astro-cid-5lyycc4g>${dt("Multipliers")}</div></div> <p class="lv-card-desc" data-astro-cid-5lyycc4g>${dt("Give more XP (or less) to a role, a channel or a whole category. 2 is double, 0.5 is half and 0 earns nothing.")}</p> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Base multiplier for all XP")}</label><input type="number" name="xp_multiplier"${addAttribute(rules.xpMultiplier, "value")} min="0" max="20" step="0.05" data-astro-cid-5lyycc4g><span class="lv-hint" data-astro-cid-5lyycc4g>${dt("1 changes nothing, 1.5 gives half more XP to everyone. Role, channel and category multipliers add to it.")}</span></div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Several role multipliers")}</label> <select name="multiplier_mode" data-astro-cid-5lyycc4g> <option value="highest"${addAttribute(rules.multiplierMode === "highest", "selected")} data-astro-cid-5lyycc4g>${dt("Only the highest")}</option> <option value="stack"${addAttribute(rules.multiplierMode === "stack", "selected")} data-astro-cid-5lyycc4g>${dt("Multiply them all")}</option> <option value="sum"${addAttribute(rules.multiplierMode === "sum", "selected")} data-astro-cid-5lyycc4g>${dt("Add each extra to 1")}</option> </select> <span class="lv-hint" data-astro-cid-5lyycc4g>${dt("What happens when a member has more than one role with a multiplier.")}</span> </div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Most a multiplier can reach")}</label><input type="number" name="multiplier_cap"${addAttribute(rules.multiplierCap, "value")} min="1" max="100" step="0.5" data-astro-cid-5lyycc4g><span class="lv-hint" data-astro-cid-5lyycc4g>${dt("The combined multiplier never goes above this.")}</span></div> </div> <div class="lv-check-wrap" data-astro-cid-5lyycc4g><label class="lv-check" data-astro-cid-5lyycc4g><span class="lv-check-text" data-astro-cid-5lyycc4g><b data-astro-cid-5lyycc4g>${dt("Vote boost: +10% XP for 12 hours to members who vote for Petto")}</b></span><input type="checkbox" name="vote_boost"${addAttribute(rules.voteBoost, "checked")} data-astro-cid-5lyycc4g></label></div> </div> <div class="lv-card" data-astro-cid-5lyycc4g> <div class="lv-card-head" data-astro-cid-5lyycc4g><div class="lv-card-icon" style="--c:var(--blue)" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}</div><div class="lv-card-title" data-astro-cid-5lyycc4g>${dt("Who earns XP")}</div></div> <p class="lv-card-desc" data-astro-cid-5lyycc4g>${dt("Leave both empty so everyone earns XP.")}</p> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field lv-field-wide" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Roles that earn no XP")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "no_xp_role_ids", "options": withMissing(roles.map((role) => ({ id: role.id, name: role.name })), rules.noXpRoleIds), "selected": rules.noXpRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-5lyycc4g": true })} </div> <div class="lv-field lv-field-wide" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Only these roles earn XP")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "only_xp_role_ids", "options": withMissing(roles.map((role) => ({ id: role.id, name: role.name })), rules.onlyXpRoleIds), "selected": rules.onlyXpRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-5lyycc4g": true })} <span class="lv-hint" data-astro-cid-5lyycc4g>${dt("Leave it empty so everyone can earn XP.")}</span> </div> <div class="lv-field lv-field-wide" data-astro-cid-5lyycc4g><label for="lv-no_xp_user_ids" data-astro-cid-5lyycc4g>${dt("Members blocked from XP")}</label> <textarea id="lv-no_xp_user_ids" class="dgl-autogrow" rows="2" name="no_xp_user_ids" maxlength="2700"${addAttribute(dt("Member IDs, one per line or separated by commas"), "placeholder")} data-astro-cid-5lyycc4g>${rules.noXpUserIds.join("\n")}</textarea> <span class="lv-hint" data-astro-cid-5lyycc4g>${dt("They earn no XP by themselves and nobody can give them any by hand. Their XP stays as it is. Up to 100 members. In Discord: /levels manage block.")}</span> </div> </div> </div> <div class="lv-card" data-astro-cid-5lyycc4g> <div class="lv-card-head" data-astro-cid-5lyycc4g><div class="lv-card-icon" style="--c:var(--red)" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sign-out-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}</div><div class="lv-card-title" data-astro-cid-5lyycc4g>${dt("Members who leave and come back")}</div></div> <p class="lv-card-desc" data-astro-cid-5lyycc4g>${dt("What happens to the XP and the reward roles of someone who leaves the server.")}</p> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-check-wrap" data-lv-dep="text_on" data-astro-cid-5lyycc4g><label class="lv-check" data-astro-cid-5lyycc4g><span class="lv-check-text" data-astro-cid-5lyycc4g><b data-astro-cid-5lyycc4g>${dt("Give the reward roles back to a member who returns")}</b><em data-astro-cid-5lyycc4g>${dt("The roles of the levels they had come back with them.")}</em></span><input type="checkbox" name="restore_roles"${addAttribute(rules.restoreRoles, "checked")} data-astro-cid-5lyycc4g></label></div> <label class="lv-check" data-astro-cid-5lyycc4g><span class="lv-check-text" data-astro-cid-5lyycc4g><b data-astro-cid-5lyycc4g>${dt("Keep the XP and level of a member who leaves")}</b><em data-astro-cid-5lyycc4g>${dt("Off: their XP is deleted and, if they return, they start from zero.")}</em></span><input type="checkbox" name="keep_xp"${addAttribute(rules.keepXp, "checked")} data-astro-cid-5lyycc4g></label> </div> </div> <div class="lv-head lv-events-head" data-astro-cid-5lyycc4g> <h2 data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:rocket-launch-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}${dt("XP events")}</h2> <p data-astro-cid-5lyycc4g>${dt("A boost for a few hours or days, such as double XP for a weekend.")}</p> </div> <div class="lv-rewards lv-events" data-stage-list data-astro-cid-5lyycc4g> ${events.length === 0 && renderTemplate`<p class="lv-empty-note" data-stage-empty data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:rocket-launch-fill", "width": "15", "height": "15", "data-astro-cid-5lyycc4g": true })}${dt("No XP events are running or coming.")}</p>`} ${events.map((event) => renderTemplate`<div class="lv-reward-row"${addAttribute(event.id, "data-existing-event")}${addAttribute(eventRunning(event) ? "running" : "soon", "data-state")} data-astro-cid-5lyycc4g> <span class="lv-reward-level" data-astro-cid-5lyycc4g>${event.name}</span> <span class="lv-reward-role" data-astro-cid-5lyycc4g>×${event.multiplier} · ${sourceLabel(event.source)} · ${eventRunning(event) ? dt("until {a}", { a: eventTime(event.endsAt) }) : dt("from {a}", { a: eventTime(event.startsAt) })}</span> <button type="button" class="lv-reward-del"${addAttribute(dt("Remove"), "title")} data-remove-existing data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-5lyycc4g": true })}</button> </div>`)} </div> <div class="lv-form lv-event-form lv-add-box" data-stage-add data-astro-cid-5lyycc4g> <div class="lv-add-title" data-astro-cid-5lyycc4g>${dt("Add event")}</div> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field lv-field-wide" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Name")}</label><textarea class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-f="name" maxlength="60"${addAttribute(dt("Double XP weekend"), "placeholder")} data-astro-cid-5lyycc4g></textarea></div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Multiplier")}</label><input type="number" data-f="multiplier" value="2" min="1.1" max="20" step="0.1" data-astro-cid-5lyycc4g></div> <div class="lv-field" data-astro-cid-5lyycc4g> <span class="lv-label" id="lv-event-source-label" data-astro-cid-5lyycc4g>${dt("Applies to")}</span> <select data-f="source" aria-labelledby="lv-event-source-label" data-astro-cid-5lyycc4g><option value="all" data-astro-cid-5lyycc4g>${dt("All XP")}</option><option value="text" data-astro-cid-5lyycc4g>${dt("Messages only")}</option><option value="voice" data-astro-cid-5lyycc4g>${dt("Voice only")}</option></select> </div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Lasts (hours)")}</label><input type="number" data-f="duration" value="48" min="1" max="1440" step="1" data-astro-cid-5lyycc4g></div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Starts in (hours)")}</label><input type="number" data-f="startIn" value="0" min="0" max="720" step="1" data-astro-cid-5lyycc4g></div> </div> <button type="button" class="btn btn-ghost btn-sm" data-stage-add-btn data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-5lyycc4g": true })}${dt("Add event")}</button> </div> <div class="lv-save-bar" data-astro-cid-5lyycc4g> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-5lyycc4g>${dt("Save changes")}</button> </div> </form> </div>`, selectedSection === "multipliers" && renderTemplate`<div${addAttribute(["lv-section", { "lv-section-hidden": selectedSection !== "multipliers" }], "class:list")} data-astro-cid-5lyycc4g> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Multipliers"), value: multipliers.length, tone: "reactions" },
    { label: dt("Roles"), value: multipliers.filter((row) => row.type === "role").length, tone: "invites" },
    { label: dt("Channels"), value: multipliers.filter((row) => row.type === "channel").length, tone: "voice" },
    { label: dt("Categories"), value: multipliers.filter((row) => row.type === "category").length, tone: "joins" }
  ], "data-astro-cid-5lyycc4g": true })} ${!lvFlags.textOn && renderTemplate`<p class="lv-gate-note lv-off-note" role="status" data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g>${dt("Leveling is off, so nobody earns XP right now. You can still change this page, and what you save stays.")} <a${addAttribute(lvHref.settings, "href")} data-astro-cid-5lyycc4g>${dt("Open Leveling settings")}</a></span></p>`} <div class="lv-head" data-astro-cid-5lyycc4g> <h2 data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:rocket-launch-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}${dt("Multipliers")}</h2> <p data-astro-cid-5lyycc4g>${dt("Give more XP (or less) to a role, a channel or a whole category. 2 is double, 0.5 is half and 0 earns nothing.")}</p> </div> <form method="POST" class="lv-form lv-stage-form" data-stage-form="multipliers" data-mult-form${addAttribute(JSON.stringify(multipliers.map((row) => ({ target_id: row.targetId, target_type: row.type, multiplier: row.multiplier, label: multiplierLabel(row) }))), "data-initial")} data-astro-cid-5lyycc4g> <input type="hidden" name="action" value="save_multipliers" data-astro-cid-5lyycc4g> <input type="hidden" name="payload"${addAttribute(JSON.stringify(multipliers.map((row) => ({ target_id: row.targetId, target_type: row.type, multiplier: row.multiplier }))), "value")} data-stage-payload data-astro-cid-5lyycc4g> <div class="lv-rewards" data-stage-list data-astro-cid-5lyycc4g> ${multipliers.map((row) => renderTemplate`<div class="lv-reward-row" data-astro-cid-5lyycc4g><span class="lv-reward-level" data-astro-cid-5lyycc4g>×${row.multiplier}</span><span class="lv-reward-arrow" data-astro-cid-5lyycc4g>→</span><span class="lv-reward-role" data-astro-cid-5lyycc4g>${multiplierLabel(row)}</span></div>`)} </div> <p class="lv-empty-note" data-stage-empty${addAttribute(multipliers.length > 0, "hidden")} data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:rocket-launch-fill", "width": "15", "height": "15", "data-astro-cid-5lyycc4g": true })}${dt("No multipliers yet.")}</p> <div class="lv-event-form lv-add-box" data-stage-add data-astro-cid-5lyycc4g> <div class="lv-add-title" data-astro-cid-5lyycc4g>${dt("Add multiplier")}</div> <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Applies to")}</label> <select data-f="target_type" data-mult-type data-astro-cid-5lyycc4g> <option value="role" data-astro-cid-5lyycc4g>${dt("A role")}</option> <option value="channel" data-astro-cid-5lyycc4g>${dt("A channel")}</option> <option value="category" data-astro-cid-5lyycc4g>${dt("A category")}</option> </select> </div> <div class="lv-field" data-mult-target="role" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Role")}</label> <select data-f="target_role" data-astro-cid-5lyycc4g><option value="" disabled selected data-astro-cid-5lyycc4g>${dt("Choose a role")}</option>${roles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")} data-astro-cid-5lyycc4g>${role.name}</option>`)}</select> </div> <div class="lv-field" data-mult-target="channel" hidden data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Channel")}</label> <select data-f="target_channel" data-astro-cid-5lyycc4g><option value="" disabled selected data-astro-cid-5lyycc4g>${dt("Choose a channel")}</option>${channels.map((channel) => renderTemplate`<option${addAttribute(channel.id, "value")} data-astro-cid-5lyycc4g>#${channel.name}</option>`)}${voiceChannels.map((channel) => renderTemplate`<option${addAttribute(channel.id, "value")} data-astro-cid-5lyycc4g>${dt("Voice")} · ${channel.name}</option>`)}</select> </div> <div class="lv-field" data-mult-target="category" hidden data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Category")}</label> <select data-f="target_category" data-astro-cid-5lyycc4g><option value="" disabled selected data-astro-cid-5lyycc4g>${dt("Choose a category")}</option>${categories.map((category) => renderTemplate`<option${addAttribute(category.id, "value")} data-astro-cid-5lyycc4g>${category.name}</option>`)}</select> </div> <div class="lv-field" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Multiplier")}</label><input type="number" data-f="multiplier" value="2" min="0" max="20" step="0.05" data-astro-cid-5lyycc4g></div> </div> <button type="button" class="btn btn-ghost btn-sm" data-stage-add-btn data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-5lyycc4g": true })}${dt("Add multiplier")}</button> <p class="lv-hint" data-astro-cid-5lyycc4g>${dt("A channel wins over its category. Several roles follow the rule in Rules and events.")}</p> </div> <div class="lv-save-bar" data-astro-cid-5lyycc4g> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-5lyycc4g>${dt("Save multipliers")}</button> </div> </form> </div>`, selectedSection === "rewards" && renderTemplate`<div${addAttribute(["lv-section", { "lv-section-hidden": selectedSection !== "rewards" }], "class:list")} data-astro-cid-5lyycc4g> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Level rewards"), value: rewards.length, tone: "reactions" },
    { label: dt("Message rewards"), value: rewards.filter((r) => r.source !== "voice").length, tone: "messages" },
    { label: dt("Voice rewards"), value: rewards.filter((r) => r.source === "voice").length, tone: "voice" },
    { label: dt("Highest level"), value: rewards.reduce((top, r) => Math.max(top, r.level), 0), tone: "invites" }
  ], "data-astro-cid-5lyycc4g": true })} ${!lvFlags.textOn && renderTemplate`<p class="lv-gate-note lv-off-note" role="status" data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g>${dt("Leveling is off, so nobody earns XP right now. You can still change this page, and what you save stays.")} <a${addAttribute(lvHref.settings, "href")} data-astro-cid-5lyycc4g>${dt("Open Leveling settings")}</a></span></p>`} <div class="lv-head" data-astro-cid-5lyycc4g> <h2 data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trophy-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}${dt("Level rewards")}</h2> <p data-astro-cid-5lyycc4g>${dt("A role given to a member when they reach a level. Message levels and voice levels have their own rewards.")}</p> </div> <form method="POST" class="lv-form lv-stage-form" data-stage-form="rewards"${addAttribute(JSON.stringify(rewards.map((r) => ({ source: r.source, level: r.level, role_id: r.roleId, label: roleName(r.roleId) }))), "data-initial")} data-astro-cid-5lyycc4g> <input type="hidden" name="action" value="save_rewards" data-astro-cid-5lyycc4g> <input type="hidden" name="payload"${addAttribute(JSON.stringify(rewards.map((r) => ({ source: r.source, level: r.level, role_id: r.roleId }))), "value")} data-stage-payload data-astro-cid-5lyycc4g> <div class="lv-rewards" data-stage-list data-astro-cid-5lyycc4g> ${[...rewards].sort((a, b) => a.source === b.source ? a.level - b.level : a.source === "voice" ? 1 : -1).map((r) => renderTemplate`<div class="lv-reward-row" data-astro-cid-5lyycc4g><span class="lv-reward-level" data-astro-cid-5lyycc4g>${r.source === "voice" ? dt("Voice level") : dt("Message level")} · ${dt("Level {a}", { a: r.level })}</span><span class="lv-reward-arrow" data-astro-cid-5lyycc4g>→</span><span class="lv-reward-role" data-astro-cid-5lyycc4g>${roleName(r.roleId)}</span></div>`)} </div> <p class="lv-empty-note" data-stage-empty${addAttribute(rewards.length > 0, "hidden")} data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trophy-fill", "width": "15", "height": "15", "data-astro-cid-5lyycc4g": true })}${dt("No rewards yet.")}</p> <div class="lv-add-reward lv-add-box" data-stage-add data-astro-cid-5lyycc4g> <div class="lv-add-title" data-astro-cid-5lyycc4g>${dt("Add reward")}</div> <div class="lv-grid lv-grid-3" data-astro-cid-5lyycc4g> <div class="lv-field" data-astro-cid-5lyycc4g> <span class="lv-label" id="lv-reward-source-label" data-astro-cid-5lyycc4g>${dt("Level")}</span> <select data-f="source" aria-labelledby="lv-reward-source-label" data-astro-cid-5lyycc4g><option value="text" data-astro-cid-5lyycc4g>${dt("Message level")}</option><option value="voice" data-astro-cid-5lyycc4g>${dt("Voice level")}</option></select> </div> <div class="lv-field" data-astro-cid-5lyycc4g> <label for="lv-reward-level" data-astro-cid-5lyycc4g>${dt("From level")}</label> <input id="lv-reward-level" type="number" data-f="level"${addAttribute(dt("Level"), "placeholder")} min="1" max="1000" data-astro-cid-5lyycc4g> </div> <div class="lv-field" data-astro-cid-5lyycc4g> <span class="lv-label" id="lv-reward-role-label" data-astro-cid-5lyycc4g>${dt("Role")}</span> <select data-f="role_id" data-give-role aria-labelledby="lv-reward-role-label" data-astro-cid-5lyycc4g> <option value="" disabled selected data-astro-cid-5lyycc4g>${dt("Choose a role")}</option> ${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")} data-astro-cid-5lyycc4g>${r.name}</option>`)} </select> </div> </div> <button type="button" class="btn btn-ghost btn-sm" data-stage-add-btn data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-5lyycc4g": true })}${dt("Add reward")}</button> </div> <div class="lv-save-bar" data-astro-cid-5lyycc4g> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-5lyycc4g>${dt("Save rewards")}</button> </div> </form> </div>`, (leaderboardIsVoice || selectedSection === "leaderboard") && renderTemplate`<span hidden data-dash-live="30" data-astro-cid-5lyycc4g></span>`, (leaderboardIsVoice || selectedSection === "leaderboard") && renderTemplate`<div${addAttribute(["lv-section", "lv-board-section", { "lv-section-hidden": !["leaderboard", "leaderboard-voice"].includes(selectedSection) }], "class:list")} data-astro-cid-5lyycc4g> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Members ranked"), value: boardCount, tone: "joins" },
    { label: dt("Top level"), value: boardTopLevel, tone: "invites" },
    ...leaderboardIsVoice ? [{ label: dt("Voice minutes"), value: 0, text: formatDuration(boardMinutes * 60, { locale: dashLocale(dashLang) }), tone: "voice" }] : [],
    { label: leaderboardIsVoice ? dt("Voice XP in the top") : dt("XP in the top"), value: boardXp, tone: "messages" }
  ], "data-astro-cid-5lyycc4g": true })} ${leaderboardIsVoice ? !lvFlags.voiceOn && renderTemplate`<p class="lv-gate-note lv-off-note" role="status" data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g>${dt("Voice leveling is off, so nobody earns voice XP right now. You can still change this page, and what you save stays.")} <a${addAttribute(lvHref.voice, "href")} data-astro-cid-5lyycc4g>${dt("Open Voice leveling")}</a></span></p>` : !lvFlags.textOn && renderTemplate`<p class="lv-gate-note lv-off-note" role="status" data-astro-cid-5lyycc4g><span data-astro-cid-5lyycc4g>${dt("Leveling is off, so nobody earns XP right now. You can still change this page, and what you save stays.")} <a${addAttribute(lvHref.settings, "href")} data-astro-cid-5lyycc4g>${dt("Open Leveling settings")}</a></span></p>`} <form method="POST" class="lv-board-page" data-lv-form="board"${addAttribute(JSON.stringify(lvFlags), "data-lv-flags")}${addAttribute(JSON.stringify(lvHref), "data-lv-hrefs")} data-astro-cid-5lyycc4g> <input type="hidden" name="action" value="board_page" data-astro-cid-5lyycc4g> <div class="lv-board-page-head" data-astro-cid-5lyycc4g> <span class="lv-card-icon" style="--c:var(--blue)" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:globe-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}</span> <div data-astro-cid-5lyycc4g> <h2 data-astro-cid-5lyycc4g>${dt("Public page")}</h2> <p data-astro-cid-5lyycc4g>${dt("Anyone with the link can see the ranking of this server on the website: names, pictures, levels and XP.")}</p> </div> </div> <label class="lv-check" data-astro-cid-5lyycc4g><span class="lv-check-text" data-astro-cid-5lyycc4g><b data-astro-cid-5lyycc4g>${dt("Show the leaderboard on the website")}</b></span><input type="checkbox" name="leaderboard_public"${addAttribute(publicBoard?.enabled, "checked")} aria-describedby="lv-status-board" data-astro-cid-5lyycc4g></label> <p class="lv-status" id="lv-status-board" data-lv-status="board" aria-live="polite" data-astro-cid-5lyycc4g>${statusBoard}</p> ${boardError && renderTemplate`<div class="lv-flash lv-flash-error" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-circle-fill", "width": "15", "height": "15", "data-astro-cid-5lyycc4g": true })}${boardErrors[boardError] ?? boardErrors.save}</div>`} <div class="lv-grid" data-astro-cid-5lyycc4g> <div class="lv-field" data-lv-dep="board_on" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Name in the address")}</label><input type="text" name="leaderboard_slug"${addAttribute(publicBoard?.slug ?? "", "value")} maxlength="32" placeholder="my-server" data-astro-cid-5lyycc4g><span class="lv-hint" data-astro-cid-5lyycc4g>${dt("Letters, numbers and dashes. Leave it empty to use the server ID.")}</span></div> <div class="lv-field" data-lv-dep="board_on" data-astro-cid-5lyycc4g><label data-astro-cid-5lyycc4g>${dt("Join button link")}</label><input type="text" name="leaderboard_join_url"${addAttribute(publicBoard?.joinUrl ?? "", "value")} maxlength="200" placeholder="https://discord.gg/..." data-astro-cid-5lyycc4g><span class="lv-hint" data-astro-cid-5lyycc4g>${dt("An invite shown as a Join button on the page. Optional.")}</span></div> </div> <div class="lv-board-page-foot" data-astro-cid-5lyycc4g> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-5lyycc4g>${dt("Save")}</button> ${publicBoard?.enabled && renderTemplate`<a class="lv-board-link"${addAttribute(boardLink, "href")} target="_blank" rel="noopener" data-astro-cid-5lyycc4g>${boardLink.replace(/^https?:\/\//, "")}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-up-right", "width": "13", "height": "13", "data-astro-cid-5lyycc4g": true })}</a>`} </div> </form> <div class="lv-board-heading" data-astro-cid-5lyycc4g> <div data-astro-cid-5lyycc4g> <h2 data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:ranking-fill", "width": "16", "height": "16", "data-astro-cid-5lyycc4g": true })}${leaderboardIsVoice ? dt("Voice leaderboard") : dt("Leaderboard")}</h2> <p data-astro-cid-5lyycc4g>${leaderboardIsVoice ? dt("Members ranked by voice XP and time spent in voice channels.") : dt("Members ranked by message XP and progress through the current leveling curve.")}</p> </div> <span class="lv-board-count" data-astro-cid-5lyycc4g>${dt("Top {a}", { a: displayLeaderboard.length })}</span> </div> ${displayLeaderboard.length === 0 ? renderTemplate`<p class="lv-empty-note" data-astro-cid-5lyycc4g>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:ranking-fill", "width": "15", "height": "15", "data-astro-cid-5lyycc4g": true })}${leaderboardIsVoice ? dt("Nobody has earned voice XP yet.") : dt("Nobody's earned XP yet.")}</p>` : renderTemplate`<div class="lv-board" role="table"${addAttribute(dt("Leveling leaderboard"), "aria-label")} data-astro-cid-5lyycc4g> <div class="lv-board-head" role="row" data-astro-cid-5lyycc4g> <span data-astro-cid-5lyycc4g>${dt("Rank")}</span><span data-astro-cid-5lyycc4g>${dt("Member")}</span><span data-astro-cid-5lyycc4g>${dt("Level")}</span><span data-astro-cid-5lyycc4g>${leaderboardIsVoice ? dt("Voice XP") : dt("Total XP")}</span> </div> ${displayLeaderboard.map((row, index) => renderTemplate`<div${addAttribute(["lv-board-row", { "lv-board-first": row.rank === 1, "lv-board-second": row.rank === 2, "lv-board-third": row.rank === 3 }], "class:list")} role="row"${addAttribute(`--i:${Math.min(index, 9)}`, "style")} data-astro-cid-5lyycc4g> <span class="lv-board-rank"${addAttribute(String(row.rank), "aria-label")} data-astro-cid-5lyycc4g>${row.rank <= 3 ? renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:medal-fill", "width": "24", "height": "24", "data-astro-cid-5lyycc4g": true })}` : String(row.rank).padStart(2, "0")}</span> <div class="lv-board-member" data-astro-cid-5lyycc4g> <img${addAttribute(row.avatarUrl, "src")} alt="" loading="lazy" data-astro-cid-5lyycc4g> <div data-astro-cid-5lyycc4g> <strong data-astro-cid-5lyycc4g>${row.displayName}</strong> <small data-astro-cid-5lyycc4g>${row.username ? `@${row.username}` : `ID ${row.userId}`}</small> <span class="lv-board-progress" data-astro-cid-5lyycc4g><i${addAttribute(`width:${leaderboardProgress(row, leaderboardIsVoice).toFixed(1)}%`, "style")} data-astro-cid-5lyycc4g></i></span> </div> </div> <span class="lv-board-level" data-astro-cid-5lyycc4g>${dt("Lv. {a}", { a: row.level })}</span> <span class="lv-board-xp" data-astro-cid-5lyycc4g>${row.xp.toLocaleString(dashLocale(dashLang))} <small data-astro-cid-5lyycc4g>${leaderboardIsVoice ? dt("voice XP") : "XP"}</small>${leaderboardIsVoice && row.voiceMinutes != null && renderTemplate`<small class="lv-board-minutes" data-astro-cid-5lyycc4g>${formatDuration(row.voiceMinutes * 60, { locale: dashLocale(dashLang) })}</small>`}</span> </div>`)} </div>`} </div>`, ["settings", "voice"].includes(selectedSection) && renderTemplate`${renderComponent($$result2, "SelectSource", $$SelectSource, { "name": "lv-ch", "items": channels.map((c) => ({ id: c.id, name: c.name })), "prefix": "#", "data-astro-cid-5lyycc4g": true })}`, unescapeHTML(JSON.stringify(lvLabels).replace(/</g, "\\u003c")), unescapeHTML(JSON.stringify({
    level: dt("Level {a}", { a: "{a}" }),
    text: dt("Message level"),
    voice: dt("Voice level"),
    remove: dt("Remove"),
    all: dt("All XP"),
    textOnly: dt("Messages only"),
    voiceOnly: dt("Voice only"),
    hours: dt("{a} h", { a: "{a}" }),
    startsIn: dt("Starts in (hours)"),
    role: dt("A role"),
    channel: dt("A channel"),
    category: dt("A category"),
    pick: dt("Choose a role"),
    needLevel: dt("Level"),
    needName: dt("Name")
  }))) })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashLeveling.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Leveling = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Leveling;
  const { id } = Astro2.params;
  const section = Astro2.url.searchParams.get("section") ?? "settings";
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
  let saved = false;
  let saveError = false;
  let boardError = "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    if (action === "config") {
      const saveResponse = await fetch(`${apiUrl}/rest/v1/level_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ guild_id: id, ...readConfigForm(form), updated_at: (/* @__PURE__ */ new Date()).toISOString() })
      });
      saved = saveResponse.ok;
      saveError = !saveResponse.ok;
    } else if (action === "board_page") {
      const board = readBoardForm(form);
      if ("error" in board) {
        boardError = board.error;
      } else {
        const saveResponse = await fetch(`${apiUrl}/rest/v1/level_config?on_conflict=guild_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, ...board.row, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
        });
        saved = saveResponse.ok;
        if (!saveResponse.ok) boardError = saveResponse.status === 409 ? "taken" : "save";
      }
    } else if (action === "voice_config") {
      const saveResponse = await fetch(`${apiUrl}/rest/v1/level_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ guild_id: id, ...readVoiceForm(form), updated_at: (/* @__PURE__ */ new Date()).toISOString() })
      });
      saved = saveResponse.ok;
      saveError = !saveResponse.ok;
    } else if (action === "rank") {
      const saveResponse = await fetch(`${apiUrl}/rest/v1/level_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ guild_id: id, ...readRankForm(form), updated_at: (/* @__PURE__ */ new Date()).toISOString() })
      });
      saved = saveResponse.ok;
      saveError = !saveResponse.ok;
    } else if (action === "rules") {
      const { row: ruleFields, newest: newestRules } = readRulesForm(form);
      const rulesRow = { guild_id: id, ...ruleFields, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
      const sendRules = (row) => fetch(`${apiUrl}/rest/v1/level_config?on_conflict=guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(row) });
      let saveResponse = await sendRules({ ...rulesRow, ...newestRules });
      if (!saveResponse.ok) saveResponse = await sendRules(rulesRow);
      saved = saveResponse.ok;
      saveError = !saveResponse.ok;
      if (saved) {
        let staged = {};
        try {
          staged = JSON.parse(String(form.get("events_payload") ?? "{}"));
        } catch {
          staged = {};
        }
        const removeIds = (Array.isArray(staged.remove) ? staged.remove : []).map(String).filter((value) => /^\d{1,18}$/.test(value)).slice(0, 25);
        for (const eventId of removeIds) {
          const res = await fetch(`${apiUrl}/rest/v1/xp_events?guild_id=eq.${id}&id=eq.${eventId}`, { method: "DELETE", headers: apiHeaders });
          if (!res.ok) saveError = true;
        }
        const toAdd = (Array.isArray(staged.add) ? staged.add : []).slice(0, 25);
        if (toAdd.length) {
          const activeRes = await fetch(`${apiUrl}/rest/v1/xp_events?guild_id=eq.${id}&ends_at=gt.${encodeURIComponent((/* @__PURE__ */ new Date()).toISOString())}&select=id`, { headers: apiHeaders });
          const room = Math.max(0, 25 - (activeRes.ok ? (await activeRes.json()).length : 25));
          const rows = [];
          for (const entry of toAdd.slice(0, room)) {
            const name = String(entry?.name ?? "").trim().slice(0, 60);
            const multiplier = Math.round(Number(entry?.multiplier) * 100) / 100;
            const source = String(entry?.source ?? "all");
            const startInHours = Math.max(0, Math.min(24 * 30, Number(entry?.startIn) || 0));
            const durationHours = Math.max(0, Math.min(24 * 60, Number(entry?.duration) || 0));
            if (!name || !(multiplier > 1 && multiplier <= 20) || !["all", "text", "voice"].includes(source) || durationHours < 1 / 60) {
              saveError = true;
              continue;
            }
            const startsAt = new Date(Date.now() + startInHours * 36e5);
            rows.push({ guild_id: id, name, multiplier, source, starts_at: startsAt.toISOString(), ends_at: new Date(startsAt.getTime() + durationHours * 36e5).toISOString(), created_by: String(session.userId) });
          }
          if (toAdd.length > room) saveError = true;
          if (rows.length) {
            await ensureGuildRow(apiUrl, apiHeaders, id);
            const res = await fetch(`${apiUrl}/rest/v1/xp_events`, { method: "POST", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(rows) });
            if (!res.ok) saveError = true;
          }
        }
        saved = !saveError;
      }
    } else if (action === "save_rewards") {
      const payloadRaw = form.get("payload");
      let list = [];
      try {
        list = JSON.parse(String(payloadRaw ?? "[]"));
      } catch {
        list = [];
      }
      const wanted = /* @__PURE__ */ new Map();
      for (const entry of (Array.isArray(list) ? list : []).slice(0, 400)) {
        const level = Math.floor(Number(entry?.level));
        const source = entry?.source === "voice" ? "voice" : "text";
        const roleId = String(entry?.role_id ?? "");
        if (level >= 1 && level <= INT_MAX && /^\d{15,25}$/.test(roleId)) wanted.set(`${source}:${level}`, { guild_id: id, source, level, role_id: roleId });
      }
      const currentRes = await fetch(`${apiUrl}/rest/v1/level_rewards?guild_id=eq.${id}&select=source,level`, { headers: apiHeaders });
      if (payloadRaw === null || !currentRes.ok) {
        saveError = true;
      } else {
        let failed = false;
        for (const row of await currentRes.json()) {
          if (wanted.has(`${row.source}:${row.level}`)) continue;
          const res = await fetch(`${apiUrl}/rest/v1/level_rewards?guild_id=eq.${id}&source=eq.${row.source}&level=eq.${row.level}`, { method: "DELETE", headers: apiHeaders });
          if (!res.ok) failed = true;
        }
        if (wanted.size) {
          await ensureGuildRow(apiUrl, apiHeaders, id);
          const res = await fetch(`${apiUrl}/rest/v1/level_rewards?on_conflict=guild_id,source,level`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify([...wanted.values()]) });
          if (!res.ok) failed = true;
        }
        saved = !failed;
        saveError = failed;
      }
    } else if (action === "save_multipliers") {
      const payloadRaw = form.get("payload");
      let list = [];
      try {
        list = JSON.parse(String(payloadRaw ?? "[]"));
      } catch {
        list = [];
      }
      const wanted = /* @__PURE__ */ new Map();
      for (const entry of (Array.isArray(list) ? list : []).slice(0, 300)) {
        const targetId = String(entry?.target_id ?? "");
        const targetType = String(entry?.target_type ?? "");
        const multiplier = Math.round(Number(entry?.multiplier) * 1e4) / 1e4;
        if (["role", "channel", "category"].includes(targetType) && /^\d{15,25}$/.test(targetId) && multiplier >= 0 && multiplier <= 1e5) wanted.set(targetId, { guild_id: id, target_id: targetId, target_type: targetType, multiplier });
      }
      if (payloadRaw === null || wanted.size > 100) {
        saveError = true;
      } else {
        const currentRes = await fetch(`${apiUrl}/rest/v1/level_multipliers?guild_id=eq.${id}&select=target_id`, { headers: apiHeaders });
        if (!currentRes.ok) {
          saveError = true;
        } else {
          let failed = false;
          for (const row of await currentRes.json()) {
            if (wanted.has(row.target_id)) continue;
            const res = await fetch(`${apiUrl}/rest/v1/level_multipliers?guild_id=eq.${id}&target_id=eq.${row.target_id}`, { method: "DELETE", headers: apiHeaders });
            if (!res.ok) failed = true;
          }
          if (wanted.size) {
            await ensureGuildRow(apiUrl, apiHeaders, id);
            const res = await fetch(`${apiUrl}/rest/v1/level_multipliers?on_conflict=guild_id,target_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify([...wanted.values()]) });
            if (!res.ok) failed = true;
          }
          saved = !failed;
          saveError = failed;
        }
      }
    } else if (action === "add_event") {
      const name = String(form.get("event_name") ?? "").trim().slice(0, 60);
      const multiplier = Math.round(formNumber(form, "event_multiplier", 2) * 100) / 100;
      const source = String(form.get("event_source") ?? "all");
      const startInHours = Math.max(0, Math.min(24 * 30, formNumber(form, "event_start_in", 0)));
      const durationHours = Math.max(0, Math.min(24 * 60, formNumber(form, "event_duration", 0)));
      if (!name || !(multiplier > 1 && multiplier <= 20) || !["all", "text", "voice"].includes(source) || durationHours < 1 / 60) {
        saveError = true;
      } else {
        const startsAt = new Date(Date.now() + startInHours * 36e5);
        const endsAt = new Date(startsAt.getTime() + durationHours * 36e5);
        const activeRes = await fetch(`${apiUrl}/rest/v1/xp_events?guild_id=eq.${id}&ends_at=gt.${encodeURIComponent((/* @__PURE__ */ new Date()).toISOString())}&select=id`, { headers: apiHeaders });
        const active = activeRes.ok ? await activeRes.json() : [];
        if (active.length >= 25) {
          saveError = true;
        } else {
          await ensureGuildRow(apiUrl, apiHeaders, id);
          const saveResponse = await fetch(`${apiUrl}/rest/v1/xp_events`, {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "return=minimal" },
            body: JSON.stringify({ guild_id: id, name, multiplier, source, starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(), created_by: String(session.userId) })
          });
          saved = saveResponse.ok;
          saveError = !saveResponse.ok;
        }
      }
    } else if (action === "delete_event") {
      const eventId = String(form.get("event_id") ?? "");
      if (/^\d{1,18}$/.test(eventId)) {
        const saveResponse = await fetch(`${apiUrl}/rest/v1/xp_events?guild_id=eq.${id}&id=eq.${eventId}`, { method: "DELETE", headers: apiHeaders });
        saved = saveResponse.ok;
        saveError = !saveResponse.ok;
      }
    } else if (action === "add_reward") {
      const level = Number(form.get("level") ?? 0);
      const roleId = String(form.get("role_id") ?? "");
      const source = String(form.get("source") ?? "text") === "voice" ? "voice" : "text";
      if (level > 0 && roleId) {
        const saveResponse = await fetch(`${apiUrl}/rest/v1/level_rewards?on_conflict=guild_id,source,level`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, source, level, role_id: roleId })
        });
        saved = saveResponse.ok;
        saveError = !saveResponse.ok;
      }
    } else if (action === "delete_reward") {
      const level = Number(form.get("level") ?? 0);
      const source = String(form.get("source") ?? "text") === "voice" ? "voice" : "text";
      const saveResponse = await fetch(`${apiUrl}/rest/v1/level_rewards?guild_id=eq.${id}&source=eq.${source}&level=eq.${level}`, {
        method: "DELETE",
        headers: apiHeaders
      });
      saved = saveResponse.ok;
      saveError = !saveResponse.ok;
    } else if (action === "add_multiplier") {
      const targetType = String(form.get("target_type") ?? "");
      const targetId = String(form.get(`target_${targetType}`) ?? "");
      const multiplier = Math.round(formNumber(form, "multiplier", 2) * 100) / 100;
      if (["role", "channel", "category"].includes(targetType) && /^\d{15,25}$/.test(targetId) && multiplier >= 0 && multiplier <= 20) {
        const countRes = await fetch(`${apiUrl}/rest/v1/level_multipliers?guild_id=eq.${id}&select=target_id`, { headers: apiHeaders });
        const existing = countRes.ok ? await countRes.json() : [];
        if (existing.length >= 100 && !existing.some((row) => row.target_id === targetId)) {
          saveError = true;
        } else {
          await ensureGuildRow(apiUrl, apiHeaders, id);
          const saveResponse = await fetch(`${apiUrl}/rest/v1/level_multipliers?on_conflict=guild_id,target_id`, {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify({ guild_id: id, target_id: targetId, target_type: targetType, multiplier })
          });
          saved = saveResponse.ok;
          saveError = !saveResponse.ok;
        }
      } else {
        saveError = true;
      }
    } else if (action === "delete_multiplier") {
      const targetId = String(form.get("target_id") ?? "");
      if (/^\d{15,25}$/.test(targetId)) {
        const saveResponse = await fetch(`${apiUrl}/rest/v1/level_multipliers?guild_id=eq.${id}&target_id=eq.${targetId}`, { method: "DELETE", headers: apiHeaders });
        saved = saveResponse.ok;
        saveError = !saveResponse.ok;
      }
    }
  }
  const LEVELING_SECTIONS = ["settings", "voice", "rank", "rules", "multipliers", "rewards", "leaderboard", "leaderboard-voice"];
  const shown = LEVELING_SECTIONS.includes(section) ? section : "settings";
  const needs = (...sections) => sections.includes(shown);
  const [guildInfo, configRes, rewardsRes, leaderboardRes, voiceLeaderboardRes, rolesRes, channelsRes, embedTemplatesRes, cardsRes, eventsRes, multipliersRes] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/level_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    needs("rewards", "settings") ? fetch(`${apiUrl}/rest/v1/level_rewards?guild_id=eq.${id}&select=source,level,role_id&order=level.asc`, { headers: apiHeaders }) : null,
    needs("leaderboard") ? fetch(`${apiUrl}/rest/v1/level_users?guild_id=eq.${id}&select=user_id,xp,level&order=xp.desc&limit=10`, { headers: apiHeaders }) : null,
    needs("leaderboard-voice") ? fetch(`${apiUrl}/rest/v1/level_users?guild_id=eq.${id}&voice_xp=gt.0&select=user_id,voice_xp,voice_level,vc_minutes&order=voice_xp.desc&limit=10`, { headers: apiHeaders }) : null,
    needs("rewards", "rules", "multipliers") ? getGuildList(Astro2, id, botToken, "roles") : null,
    needs("settings", "voice", "multipliers") ? getGuildList(Astro2, id, botToken, "channels") : null,
    needs("settings", "voice") ? fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders }) : null,
    needs("rank") ? fetch(`${apiUrl}/rest/v1/image_cards?guild_id=eq.${id}&select=name,data&order=name.asc`, { headers: apiHeaders }).catch(() => null) : null,
    needs("rules") ? fetch(`${apiUrl}/rest/v1/xp_events?guild_id=eq.${id}&ends_at=gt.${encodeURIComponent((/* @__PURE__ */ new Date()).toISOString())}&select=id,name,multiplier,source,starts_at,ends_at&order=starts_at.asc`, { headers: apiHeaders }).catch(() => null) : null,
    needs("multipliers", "settings") ? fetch(`${apiUrl}/rest/v1/level_multipliers?guild_id=eq.${id}&select=target_id,target_type,multiplier&order=target_type.asc`, { headers: apiHeaders }).catch(() => null) : null
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const configRows = configRes.ok ? await configRes.json() : [];
  const c = configRows[0] ?? {};
  const config = storedConfig(c);
  const publicBoard = storedBoard(c);
  const voiceConfig = storedVoice(c, config);
  const rank = storedRank(c);
  const rules = storedRules(c);
  const rawCards = cardsRes?.ok ? await cardsRes.json() : [];
  const cards = (Array.isArray(rawCards) ? rawCards : []).map((card) => ({ name: String(card.name), kind: card.data?.kind === "rank" ? "rank" : "welcome", data: card.data }));
  const rawEvents = eventsRes?.ok ? await eventsRes.json() : [];
  const events = (Array.isArray(rawEvents) ? rawEvents : []).map((event) => ({ id: String(event.id), name: String(event.name), multiplier: Number(event.multiplier), source: String(event.source), startsAt: String(event.starts_at), endsAt: String(event.ends_at) }));
  const rawRewards = rewardsRes?.ok ? await rewardsRes.json() : [];
  const rewards = rawRewards.map((r) => ({ level: r.level, roleId: r.role_id, source: r.source === "voice" ? "voice" : "text" }));
  const rawMultipliers = multipliersRes?.ok ? await multipliersRes.json() : [];
  const multipliers = (Array.isArray(rawMultipliers) ? rawMultipliers : []).map((row) => ({ targetId: String(row.target_id), type: String(row.target_type), multiplier: Number(row.multiplier) }));
  const rawLeaderboard = leaderboardRes?.ok ? await leaderboardRes.json() : [];
  const rawVoiceLeaderboard = voiceLeaderboardRes?.ok ? await voiceLeaderboardRes.json() : [];
  const profiles = await getMemberProfiles(Astro2, id, [...rawLeaderboard, ...rawVoiceLeaderboard].map((row) => String(row.user_id ?? "")), botToken, { userId: session.userId });
  const leaderboardMember = (row) => {
    const userId = String(row.user_id ?? "");
    const profile = profiles.get(userId) ?? null;
    const username = profile?.username ?? "";
    return { userId, username, displayName: profile?.displayName || profile?.globalName || username || `Member ${userId.slice(-4)}`, avatarUrl: memberAvatarUrl(userId, profile) };
  };
  const leaderboard = rawLeaderboard.map((row, i) => ({ rank: i + 1, ...leaderboardMember(row), xp: Number(row.xp ?? 0), level: Number(row.level ?? 0) }));
  const voiceLeaderboard = rawVoiceLeaderboard.map((row, i) => ({ rank: i + 1, ...leaderboardMember(row), xp: Number(row.voice_xp ?? 0), level: Number(row.voice_level ?? 0), voiceMinutes: Number(row.vc_minutes ?? 0) }));
  const allRoles = rolesRes?.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const allChannels = channelsRes?.ok ? await channelsRes.json() : [];
  const channels = allChannels.filter((c2) => c2.type === 0 || c2.type === 5).sort((a, b) => a.position - b.position).map((c2) => ({ id: c2.id, name: c2.name }));
  const categories = allChannels.filter((c2) => c2.type === 4).sort((a, b) => a.position - b.position).map((c2) => ({ id: c2.id, name: c2.name }));
  const voiceChannels = allChannels.filter((c2) => c2.type === 2 || c2.type === 13).sort((a, b) => a.position - b.position).map((c2) => ({ id: c2.id, name: c2.name }));
  const embedTemplates = embedTemplatesRes?.ok ? await embedTemplatesRes.json() : [];
  const embedTemplateNames = embedTemplates.map((template) => template.name).filter(Boolean);
  return renderTemplate`${renderComponent($$result, "DashLeveling", $$DashLeveling, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "config": config, "rewards": rewards, "multipliers": multipliers, "categories": categories, "roles": roles, "channels": channels, "voiceChannels": voiceChannels, "leaderboard": leaderboard, "voiceConfig": voiceConfig, "voiceLeaderboard": voiceLeaderboard, "embedTemplateNames": embedTemplateNames, "rank": rank, "rules": rules, "cards": cards, "events": events, "saved": saved, "saveError": saveError, "publicBoard": publicBoard, "boardError": boardError, "section": section })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/leveling.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/leveling.astro";
const $$url = "/dash/guild/[id]/leveling";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Leveling,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
