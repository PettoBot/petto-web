import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, u as unescapeHTML, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { G as GATE_ACTIONS, R as RAID_ACTIONS, L as LIMITS, c as cleanJoinGate } from '../../../../chunks/modRules_BmF65XBm.mjs';
/* empty css                                          */
import { a as getGuildSession, p as pageDecision } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../../../renderers.mjs';

const t = (trigger) => trigger;
const e = (effect) => effect;
const c = (condition) => condition;
const SCAM_DOMAINS = ["discord-nitro.gift", "discordnitro.gift", "discord-gift.com", "discordgift.site", "discord-giveaway.com", "dlscord.gift", "dicsord.gift", "discorcl.gift", "steamcommunlty.com", "steamcornmunity.com", "steam-gift.ru"];
const RULE_TEMPLATES = [
  { id: "flood", rule: { name: "Message flood", triggers: [t({ type: "rate", messages: 6, seconds: 8 })], effects: [e({ type: "delete" }), e({ type: "timeout", minutes: 10, multiplier: 3, max_minutes: 1440, window_hours: 24 })], stop: true } },
  { id: "repeat", rule: { name: "The same message again", triggers: [t({ type: "repeated", times: 3, seconds: 30 })], effects: [e({ type: "delete" }), e({ type: "warn", reason: "Repeating the same message" })], threshold_count: 2, threshold_minutes: 10 } },
  { id: "invites-new", rule: { name: "No invites from new accounts", triggers: [t({ type: "invites" })], conditions: [c({ type: "account_age", max_days: 7 })], effects: [e({ type: "delete" }), e({ type: "reply", text: "{user}, new accounts cannot share invites.", delete_after: 10 }), e({ type: "timeout", minutes: 60, multiplier: 1, max_minutes: 60, window_hours: 24 })] } },
  { id: "scam-links", rule: { name: "Scam links", triggers: [t({ type: "links", mode: "deny", domains: SCAM_DOMAINS }), t({ type: "words", match: "contains", words: ["free nitro", "nitro gift", "steam gift", "claim your gift"] })], effects: [e({ type: "delete" }), e({ type: "timeout", minutes: 1440, multiplier: 1, max_minutes: 1440, window_hours: 24 }), e({ type: "alert", channel_id: "", text: "{rule}: {user} in {channel}" })] } },
  { id: "mass-mentions", rule: { name: "Mass mentions", triggers: [t({ type: "mentions", kind: "any", max: 5 })], effects: [e({ type: "delete" }), e({ type: "timeout", minutes: 30, multiplier: 2, max_minutes: 1440, window_hours: 24 })] } },
  { id: "mention-rate", rule: { name: "Mentions too fast", triggers: [t({ type: "mention_rate", mentions: 10, seconds: 10 })], effects: [e({ type: "delete" }), e({ type: "purge", count: 20, minutes: 5 }), e({ type: "timeout", minutes: 60, multiplier: 1, max_minutes: 60, window_hours: 24 })] } },
  { id: "caps", rule: { name: "Shouting", triggers: [t({ type: "caps", percent: 70, min_length: 15 })], effects: [e({ type: "delete" }), e({ type: "reply", text: "{user}, please do not shout.", delete_after: 8 })] } },
  { id: "emoji-wall", rule: { name: "Emoji spam", triggers: [t({ type: "emojis", max: 12 })], effects: [e({ type: "delete" })] } },
  { id: "wall-of-text", rule: { name: "Walls of text", triggers: [t({ type: "length", max_chars: 1500, max_lines: 15 })], effects: [e({ type: "delete" }), e({ type: "reply", text: "{user}, that message is too long.", delete_after: 8 })] } },
  { id: "zalgo", rule: { name: "Zalgo and repeated characters", triggers: [t({ type: "zalgo", max: 8 }), t({ type: "repeated_chars", max: 12 })], effects: [e({ type: "delete" })] } },
  { id: "link-flood", rule: { name: "Link flood from new members", triggers: [t({ type: "link_rate", links: 5, seconds: 30 })], conditions: [c({ type: "member_age", max_days: 3 })], effects: [e({ type: "delete" }), e({ type: "purge", count: 20, minutes: 5 }), e({ type: "timeout", minutes: 120, multiplier: 1, max_minutes: 120, window_hours: 24 })] } },
  { id: "strikes", rule: { name: "Three strikes: timeout", triggers: [t({ type: "violations", name: "strikes", count: 3, minutes: 60 })], effects: [e({ type: "timeout", minutes: 30, multiplier: 2, max_minutes: 1440, window_hours: 24 }), e({ type: "reset_violations", name: "strikes" })] } },
  { id: "heat", rule: { name: "Heat from fast messages", triggers: [t({ type: "rate", messages: 4, seconds: 6 })], effects: [e({ type: "add_heat", amount: 25 })], stop: false } },
  { id: "heat-act", rule: { name: "Too hot: timeout", triggers: [t({ type: "heat", at_least: 100 })], effects: [e({ type: "timeout", minutes: 15, multiplier: 2, max_minutes: 1440, window_hours: 24 }), e({ type: "reset_heat" })] } }
];

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashRules = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashRules;
  const { user, guildId, guildName, guildIcon, data, roles, channels, categories, ready, canEdit } = Astro2.props;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const docsUrl = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/moderation/rules`;
  const num = (k, label, min, max, d, hint) => ({ k, t: "number", label, min, max, d, hint });
  const pick = (k, label, options, d) => ({ k, t: "select", label, options, d });
  const TRIGGERS = {
    words: { label: dt("Words"), hint: dt("A word or phrase from a list, or typed here. Accents and capitals do not matter."), fields: [
      pick("match", dt("How it is found"), [["word", dt("Whole words")], ["contains", dt("Inside other words too")], ["exact", dt("The whole message is exactly it")]], "word"),
      { k: "list_id", t: "list", kind: "words", label: dt("List of words") },
      { k: "words", t: "lines", label: dt("More words, one per line") }
    ] },
    regex: { label: dt("Pattern (regex)"), hint: dt("An expression for advanced users. Short ones only: patterns that could run for ever are refused."), fields: [{ k: "pattern", t: "text", label: dt("Expression") }] },
    links: { label: dt("Links"), hint: dt("Any link, links to some domains, or links that are not to the domains you allow."), fields: [
      pick("mode", dt("When it applies"), [["any", dt("Any link")], ["deny", dt("A link to a domain in the list")], ["allow", dt("A link to a domain that is NOT in the list")]], "any"),
      { k: "list_id", t: "list", kind: "domains", label: dt("List of domains") },
      { k: "domains", t: "lines", label: dt("More domains, one per line") }
    ] },
    invites: { label: dt("Discord invites"), hint: dt("Invitations to any Discord server."), fields: [] },
    mentions: { label: dt("Mentions"), hint: dt("More mentions than the limit in one message."), fields: [
      pick("kind", dt("What counts"), [["any", dt("Everything")], ["users", dt("Members")], ["roles", dt("Roles")], ["everyone", dt("@everyone and @here")]], "any"),
      num("max", dt("More than"), 0, 100, 5)
    ] },
    caps: { label: dt("Shouting (capitals)"), hint: dt("A message that is mostly capital letters."), fields: [num("percent", dt("Percent of capitals"), 30, 100, 70), num("min_length", dt("Only if it has at least this many letters"), 5, 500, 12)] },
    emojis: { label: dt("Many emojis"), hint: dt("More emojis than the limit in one message."), fields: [num("max", dt("More than"), 1, 200, 10)] },
    repeated: { label: dt("The same message again"), hint: dt("The same text sent again and again by one member."), fields: [num("times", dt("Times"), 2, 20, 3), num("seconds", dt("In this many seconds"), 3, 600, 30)] },
    rate: { label: dt("Too many messages"), hint: dt("A member who writes faster than the limit."), fields: [num("messages", dt("Messages"), 2, 50, 6), num("seconds", dt("In this many seconds"), 2, 120, 8)] },
    attachments: { label: dt("Attachments"), hint: dt("Files or images in a message."), fields: [
      pick("kind", dt("What counts"), [["any", dt("Any file")], ["images", dt("Images")], ["files", dt("Files that are not images")]], "any"),
      num("max", dt("More than"), 0, 20, 0)
    ] },
    length: { label: dt("Long messages"), hint: dt("Too many characters or too many lines. Leave 0 to not look at one of them."), fields: [num("max_chars", dt("More characters than"), 0, 4e3, 0), num("max_lines", dt("More lines than"), 0, 200, 0)] },
    zalgo: { label: dt("Zalgo text"), hint: dt("Letters piled with strange marks."), fields: [num("max", dt("Marks"), 3, 100, 8)] },
    repeated_chars: { label: dt("Repeated characters"), hint: dt("The same character again and again, like aaaaaaaaa."), fields: [num("max", dt("Repeats"), 3, 100, 10)] },
    channel_rate: { label: dt("Channel too busy"), hint: dt("More messages than the limit in a channel, from everybody together (a raid on a channel)."), fields: [num("messages", dt("Messages"), 3, 200, 20), num("seconds", dt("In this many seconds"), 2, 300, 10)] },
    mention_rate: { label: dt("Mentions too fast"), hint: dt("A member who mentions more than the limit across several messages."), fields: [num("mentions", dt("Mentions"), 2, 200, 10), num("seconds", dt("In this many seconds"), 2, 300, 10)] },
    attachment_rate: { label: dt("Attachments too fast"), hint: dt("A member who sends more files or images than the limit across several messages."), fields: [num("attachments", dt("Attachments"), 2, 100, 6), num("seconds", dt("In this many seconds"), 2, 300, 30)] },
    link_rate: { label: dt("Links too fast"), hint: dt("A member who sends more links than the limit across several messages."), fields: [num("links", dt("Links"), 2, 100, 5), num("seconds", dt("In this many seconds"), 2, 300, 30)] },
    name: { label: dt("Name of the member"), hint: dt("The username or the nickname has a word, or matches a pattern."), fields: [
      pick("where", dt("Where"), [["either", dt("Username or nickname")], ["username", dt("Username")], ["nickname", dt("Nickname")]], "either"),
      pick("match", dt("How it is found"), [["contains", dt("Inside other words too")], ["word", dt("Whole words")], ["exact", dt("The whole message is exactly it")], ["regex", dt("Pattern (regex)")]], "contains"),
      { k: "list_id", t: "list", kind: "words", label: dt("List of words") },
      { k: "words", t: "lines", label: dt("More words, one per line") },
      { k: "pattern", t: "text", label: dt("Expression (only for a pattern)") }
    ] },
    violations: { label: dt("Strikes"), hint: dt('A member who has this many strikes of a counter in a time. Other rules add strikes with the effect "Count a strike".'), fields: [
      { k: "name", t: "text", label: dt("Name of the counter"), d: "strikes" },
      num("count", dt("Strikes"), 1, 100, 4),
      num("minutes", dt("In this many minutes"), 1, 1440, 60)
    ] },
    heat: { label: dt("Heat"), hint: dt('The heat of the member is at least this. Heat rises with the effect "Add heat" and falls by itself.'), fields: [num("at_least", dt("Heat at least"), 1, 1e4, 100)] }
  };
  const CONDITIONS = {
    channel: { label: dt("Channel"), fields: [pick("mode", dt("The message is"), [["not_in", dt("NOT in these channels")], ["in", dt("Only in these channels")]], "not_in"), { k: "ids", t: "select", label: dt("Channels"), kind: "channels" }] },
    category: { label: dt("Category"), fields: [pick("mode", dt("The message is"), [["not_in", dt("NOT in these categories")], ["in", dt("Only in these categories")]], "not_in"), { k: "ids", t: "select", label: dt("Categories"), kind: "categories" }] },
    role: { label: dt("Roles of the member"), fields: [pick("mode", dt("The member"), [["has_none", dt("has none of these roles")], ["has_any", dt("has one of these roles")], ["has_all", dt("has all of these roles")]], "has_none"), { k: "ids", t: "select", label: dt("Roles"), kind: "roles" }] },
    account_age: { label: dt("New account"), fields: [num("max_days", dt("The account is at most this many days old"), 1, 3650, 7)] },
    member_age: { label: dt("New member"), fields: [num("max_days", dt("The member joined at most this many days ago"), 1, 3650, 7)] },
    no_roles: { label: dt("Member with no roles"), fields: [] },
    author_kind: { label: dt("Who writes"), fields: [pick("kind", dt("The author is"), [["humans", dt("A person")], ["bots", dt("A bot or a webhook")]], "humans")] },
    message_kind: { label: dt("New or edited message"), fields: [pick("kind", dt("The message is"), [["new", dt("New")], ["edited", dt("Edited")]], "new")] },
    thread: { label: dt("Threads"), fields: [pick("mode", dt("The message is"), [["ignore", dt("NOT in a thread")], ["only", dt("Only in a thread")]], "ignore")] }
  };
  const EFFECTS = {
    delete: { label: dt("Delete the message"), later: false, fields: [] },
    reply: { label: dt("Reply in the channel"), later: false, fields: [{ k: "text", t: "textarea", label: dt("Message"), hint: dt("You can use {user}, {username}, {server}, {channel} and {rule}.") }, num("delete_after", dt("Delete the reply after (seconds, 0 to keep it)"), 0, 600, 10)] },
    dm: { label: dt("Send a DM"), later: true, fields: [{ k: "text", t: "textarea", label: dt("Message"), hint: dt("You can use {user}, {username}, {server}, {channel} and {rule}.") }] },
    warn: { label: dt("Warn the member"), later: true, fields: [{ k: "reason", t: "text", label: dt("Reason (optional)") }] },
    timeout: { label: dt("Timeout (mute)"), later: true, fields: [num("minutes", dt("Minutes"), 1, 40320, 10), num("multiplier", dt("Grows each time by (1: it does not grow)"), 1, 10, 1), num("max_minutes", dt("Never more than (minutes)"), 1, 40320, 40320), num("window_hours", dt("Counting the times of the last (hours)"), 1, 720, 168)] },
    kick: { label: dt("Kick"), later: true, fields: [] },
    ban: { label: dt("Ban"), later: true, fields: [{ k: "reason", t: "text", label: dt("Reason (optional)") }, num("delete_days", dt("Delete their messages of the last days"), 0, 7, 0)] },
    add_role: { label: dt("Give a role"), later: true, fields: [{ k: "role_id", t: "role", label: dt("Role") }] },
    remove_role: { label: dt("Take a role away"), later: true, fields: [{ k: "role_id", t: "role", label: dt("Role") }] },
    temp_role: { label: dt("Give a role for a while"), later: true, fields: [{ k: "role_id", t: "role", label: dt("Role") }, num("minutes", dt("Minutes"), 1, 43200, 60)] },
    purge: { label: dt("Delete their last messages"), later: true, fields: [num("count", dt("How many messages (at most)"), 2, 100, 10), num("minutes", dt("Only those of the last (minutes)"), 1, 1440, 10)] },
    slowmode: { label: dt("Slowmode in the channel"), later: true, fields: [num("seconds", dt("Seconds between messages"), 1, 21600, 10), num("minutes", dt("For how long (minutes)"), 1, 1440, 10)] },
    alert: { label: dt("Alert in a channel"), later: true, fields: [{ k: "channel_id", t: "channel", label: dt("Channel (empty: the channel of the hits)") }, { k: "text", t: "textarea", label: dt("Message (optional)"), hint: dt("You can use {user}, {username}, {server}, {channel} and {rule}.") }] },
    set_nickname: { label: dt("Set a nickname"), later: true, fields: [{ k: "nickname", t: "text", label: dt("Nickname (empty: remove it)") }] },
    quarantine: { label: dt("Quarantine"), later: true, fields: [] },
    lockdown: { label: dt("Lock the server"), later: true, fields: [num("minutes", dt("Minutes"), 1, 720, 10)] },
    violation: { label: dt("Count a strike"), later: false, fields: [{ k: "name", t: "text", label: dt("Name of the counter"), d: "strikes" }] },
    reset_violations: { label: dt("Clear the strikes"), later: false, fields: [{ k: "name", t: "text", label: dt("Name of the counter"), d: "strikes" }] },
    add_heat: { label: dt("Add heat"), later: false, fields: [num("amount", dt("Heat"), 1, 1e3, 20)] },
    reset_heat: { label: dt("Cool down (heat to 0)"), later: false, fields: [] }
  };
  const TEMPLATE_TEXT = {
    flood: [dt("Message flood"), dt("Deletes the messages of someone who writes too fast and mutes them, longer each time.")],
    repeat: [dt("The same message again"), dt("Deletes the same text sent again and again, and warns on the second time.")],
    "invites-new": [dt("No invites from new accounts"), dt("Accounts of less than 7 days cannot share Discord invites.")],
    "scam-links": [dt("Scam links"), dt("Fake gifts and Nitro: deletes, mutes for a day and alerts.")],
    "mass-mentions": [dt("Mass mentions"), dt("More than 5 mentions in a message.")],
    "mention-rate": [dt("Mentions too fast"), dt("More than 10 mentions in 10 seconds: deletes their last messages and mutes.")],
    caps: [dt("Shouting"), dt("Messages that are mostly capitals.")],
    "emoji-wall": [dt("Emoji spam"), dt("More than 12 emojis in a message.")],
    "wall-of-text": [dt("Walls of text"), dt("More than 1500 characters or 15 lines.")],
    zalgo: [dt("Zalgo and repeated characters"), dt("Strange marks and aaaaaaaaaaaa.")],
    "link-flood": [dt("Link flood from new members"), dt("5 links in 30 seconds from someone who joined 3 days ago or less.")],
    strikes: [dt("Three strikes: timeout"), dt('Acts when a member has 3 strikes of the counter "strikes" in an hour. Other rules add strikes with "Count a strike".')],
    heat: [dt("Heat from fast messages"), dt("Writing fast adds heat (it falls by itself).")],
    "heat-act": [dt("Too hot: timeout"), dt("Mutes whoever reaches 100 of heat, longer each time, and cools them down.")]
  };
  const templates = RULE_TEMPLATES.map((tpl) => ({ id: tpl.id, name: TEMPLATE_TEXT[tpl.id]?.[0] ?? tpl.rule.name, text: TEMPLATE_TEXT[tpl.id]?.[1] ?? "", rule: tpl.rule }));
  const GATE_LABEL = { none: dt("Do nothing"), alert: dt("Only alert"), timeout: dt("Timeout"), kick: dt("Kick"), ban: dt("Ban"), quarantine: dt("Quarantine") };
  const RAID_LABEL = { alert: dt("Only alert"), lockdown: dt("Lock the server"), kick_new: dt("Kick whoever joins while it lasts"), ban_new: dt("Ban whoever joins while it lasts") };
  const gateActions = GATE_ACTIONS.map((id) => [id, GATE_LABEL[id]]);
  const raidActions = RAID_ACTIONS.map((id) => [id, RAID_LABEL[id]]);
  const i18n = {
    tabs: { global: dt("Global settings"), lists: dt("Lists"), logs: dt("Logs"), gate: dt("Join gate"), tools: dt("Tools"), newSet: dt("New ruleset") },
    blank: dt("Nothing chosen"),
    save: dt("Save"),
    cancel: dt("Cancel"),
    delete: dt("Delete"),
    edit: dt("Edit"),
    add: dt("Add"),
    yes: dt("Yes"),
    no: dt("No"),
    saved: dt("Saved."),
    failed: dt("Something went wrong, try again."),
    working: dt("Saving\u2026"),
    confirmDeleteSet: dt("Delete this ruleset and all its rules?"),
    confirmDeleteRule: dt("Delete this rule?"),
    confirmDeleteList: dt("Delete this list? Rules that use it stop finding anything with it."),
    global: {
      title: dt("Global settings"),
      lead: dt("These apply to every rule of the server."),
      enabled: dt("Rules are on"),
      enabledHint: dt("Turn it off to stop every rule at once without deleting them."),
      staff: dt("Leave out moderators"),
      staffHint: dt("Members who can manage messages are never touched by the rules."),
      logChannel: dt("Send each hit to a channel"),
      logNone: dt("No channel (hits are only kept in the Logs tab)"),
      bots: dt("Leave out bots"),
      botsHint: dt('Bots and webhooks are never touched by the rules, unless you turn this off and use the condition "Who writes".'),
      heat: dt("Heat that falls every minute"),
      heatHint: dt('How much heat a member loses each minute (see the trigger and the effect "Heat"). 0: it never falls.'),
      quarantine: dt("Quarantine role"),
      quarantineNone: dt("No role"),
      quarantineHint: dt('The role that the effect "Quarantine" and the join gate give. Make it so that it only sees one channel.')
    },
    lists: {
      title: dt("Lists"),
      lead: dt("Lists of words and of domains that any rule can use. Change a list here and every rule that uses it follows."),
      none: dt("No lists yet."),
      name: dt("Name"),
      kind: dt("Kind"),
      words: dt("Words"),
      domains: dt("Domains"),
      items: dt("One per line"),
      count: dt("{n} items"),
      newList: dt("New list"),
      domainsHint: dt("Domains like example.com. A domain also covers its subdomains.")
    },
    logs: { title: dt("Logs"), lead: dt("What the rules did lately: the rule, the member, the channel and what matched. Petto never keeps the text of the message. The last 100 are shown."), none: dt("No rule has caught anything yet."), gate: dt("Join gate"), when: dt("When"), rule: dt("Rule"), member: dt("Member"), channel: dt("Channel"), what: dt("Matched"), did: dt("Petto did"), clear: dt("Clear the logs"), confirmClear: dt("Clear the logs of the rules?"), nothingDone: dt("nothing yet") },
    set: {
      name: dt("Name of the ruleset"),
      enabled: dt("Ruleset is on"),
      conditions: dt("General conditions"),
      conditionsLead: dt("Rules of this ruleset only apply to messages that pass all of these."),
      addCondition: dt("Add a condition"),
      rules: dt("Rules"),
      none: dt("This ruleset has no rules yet."),
      newRule: dt("New rule"),
      delete: dt("Delete ruleset"),
      hits: dt("{n} hits"),
      saveSet: dt("Save ruleset")
    },
    rule: {
      name: dt("Name of the rule"),
      enabled: dt("Rule is on"),
      triggers: dt("Triggers: what it looks for"),
      addTrigger: dt("Add a trigger"),
      any: dt("Any of them"),
      all: dt("All of them"),
      mode: dt("The rule applies when it finds"),
      conditions: dt("Conditions: who and where"),
      addCondition: dt("Add a condition"),
      effects: dt("Effects: what Petto does"),
      addEffect: dt("Add an effect"),
      threshold: dt("Wait until the member does it"),
      times: dt("time(s) in"),
      minutes: dt("minutes"),
      thresholdHint: dt("Delete and reply happen every time. The rest (warn, timeout, kick, ban, DM and roles) wait for this count."),
      stop: dt("Stop here: do not check the rules after this one"),
      up: dt("Move up"),
      down: dt("Move down"),
      later: dt("waits for the count"),
      needTrigger: dt("Add at least one trigger."),
      needEffect: dt("Add at least one effect."),
      pickType: dt("Choose\u2026"),
      newTitle: dt("New rule"),
      dryRun: dt("Test mode: only write in the log what it would do"),
      duplicate: dt("Duplicate"),
      copy: dt("(copy)"),
      tryTitle: dt("Try this rule"),
      tryLead: dt("Write a message and see what the rule would do with it. Nothing is done and nothing is saved."),
      tryText: dt("A sample message"),
      tryAge: dt("Age of the account (days)"),
      tryTimes: dt("Send it this many times (for the rules about speed)"),
      tryMentions: dt("Members mentioned"),
      tryAttach: dt("Attachments"),
      tryButton: dt("Try it"),
      tryApplies: dt("The rule applies."),
      tryNo: dt("The rule does not apply."),
      tryCond: dt("Conditions"),
      tryTrig: dt("Triggers"),
      tryEff: dt("Effects"),
      tryPass: dt("passes"),
      tryFail: dt("does not pass"),
      tryHit: dt("finds"),
      tryNothing: dt("finds nothing"),
      tryNow: dt("at once"),
      tryCount: dt("waits for the count"),
      tryState: dt("Strikes and heat are not known here: they count as 0 unless you write them."),
      tryFailed: dt("Petto could not try the rule.")
    },
    templates: { add: dt("Add from a template"), choose: dt("Choose a template\u2026"), added: dt("Rule added.") },
    gate: {
      title: dt("Join gate"),
      lead: dt("What Petto looks at in whoever joins, and what it does when many join at once. Bots are not looked at."),
      enabled: dt("The join gate is on"),
      noAvatar: dt("A member with no avatar"),
      age: dt("An account younger than (days)"),
      ageAction: dt("Then"),
      username: dt("A name with a word of a list"),
      usernameList: dt("List of words"),
      usernameWords: dt("More words, one per line"),
      timeout: dt("A timeout lasts (minutes)"),
      raid: dt("Raid detector"),
      raidLead: dt("A raid is many joins in a short time. Leave the number at 0 to turn it off."),
      raidJoins: dt("This many joins"),
      raidSeconds: dt("In this many seconds"),
      raidAction: dt("Then"),
      raidMinutes: dt("The raid lasts (minutes)"),
      raidChannel: dt("Say it in this channel"),
      raidNone: dt("The channel of the hits"),
      action: dt("Action")
    },
    gateActions,
    raidActions,
    tools: {
      title: dt("Tools"),
      exportTitle: dt("Export"),
      exportLead: dt("Download your lists, rulesets and rules as a file, to keep a copy or to use them in another server."),
      exportButton: dt("Download the file"),
      importTitle: dt("Import"),
      importLead: dt("Paste the content of a file made by Export. What you add is added to what you have: nothing is replaced."),
      importPlaceholder: dt("Paste the file here"),
      importButton: dt("Import"),
      importDone: dt("Imported: {lists} lists, {rulesets} rulesets and {rules} rules. {skipped} left out."),
      importBad: dt("That is not a file made by Export.")
    },
    triggers: TRIGGERS,
    conditions: CONDITIONS,
    effects: EFFECTS,
    templateList: templates,
    limits: { rulesets: LIMITS.rulesets, rules: LIMITS.rulesPerSet, lists: LIMITS.lists }
  };
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "mod-rules", "pageTitle": dt("Moderation rules") }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", " ", '<div class="mr" data-mr', "", "", '> <header class="mr-head"> <h1>', '</h1> <a class="btn btn-sm"', ' target="_blank" rel="noopener">', "", '</a> </header> <p class="mr-lead">', "</p> ", " ", ' <div class="mr-flash" data-mr-flash role="status" hidden></div> <nav class="mr-tabs" data-mr-tabs', '></nav> <div class="mr-body" data-mr-body></div> <script type="application/json" data-mr-data>', '<\/script> <script type="application/json" data-mr-i18n>', '<\/script> <script type="application/json" data-mr-places>', "<\/script> </div> "])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, {}), renderComponent($$result2, "DashFormKit", $$DashFormKit, {}), maybeRenderHead(), addAttribute(guildId, "data-guild"), addAttribute(canEdit ? "1" : "0", "data-can-edit"), addAttribute(ready ? "1" : "0", "data-ready"), dt("Moderation rules"), addAttribute(docsUrl, "href"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13" }), dt("Read the docs"), dt("Make your own rules: what to look for, who and where it applies, and what Petto does. Rules are made here in the dashboard; the bot only follows them."), !ready && renderTemplate`<div class="mr-flash mr-flash-warn">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15" })}${dt("The rules could not be read. Petto may be updating: try again in a few minutes.")}</div>`, ready && !canEdit && renderTemplate`<div class="mr-flash mr-flash-warn">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "15", "height": "15" })}${dt("You can look at the rules but not change them.")}</div>`, addAttribute(dt("Moderation rules"), "aria-label"), unescapeHTML(JSON.stringify(data)), unescapeHTML(JSON.stringify(i18n)), unescapeHTML(JSON.stringify({ roles, channels, categories }))) })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashRules.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Rules = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Rules;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const read = async (path) => {
    const res = await fetch(`${apiUrl}/rest/v1/${path}`, { headers }).catch(() => null);
    const body = res?.ok ? await res.json().catch(() => null) : null;
    return Array.isArray(body) ? { ok: true, rows: body } : { ok: false, rows: [] };
  };
  const [guildInfo, rolesRes, channelsRes, settings, lists, rulesets, rules, logs, gateRes] = await Promise.all([
    getGuildInfo(id, botToken),
    getGuildList(Astro2, id, botToken, "roles"),
    getGuildList(Astro2, id, botToken, "channels"),
    read(`mod_rule_settings?guild_id=eq.${id}&select=*`),
    read(`mod_lists?guild_id=eq.${id}&select=*&order=name.asc`),
    read(`mod_rulesets?guild_id=eq.${id}&select=*&order=position.asc,id.asc`),
    read(`mod_rules?guild_id=eq.${id}&select=*&order=position.asc,id.asc`),
    read(`mod_rule_logs?guild_id=eq.${id}&select=*&order=id.desc&limit=100`),
    read(`mod_join_gate?guild_id=eq.${id}&select=*`)
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const allRoles = rolesRes.ok ? await rolesRes.json().catch(() => []) : [];
  const allChannels = channelsRes.ok ? await channelsRes.json().catch(() => []) : [];
  const roles = allRoles.filter((r) => String(r.id) !== id).sort((a, b) => Number(b.position ?? 0) - Number(a.position ?? 0)).map((r) => ({ id: String(r.id), name: String(r.name), managed: Boolean(r.managed) }));
  const channels = allChannels.filter((c) => c.type === 0 || c.type === 5 || c.type === 15).sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)).map((c) => ({ id: String(c.id), name: String(c.name) }));
  const categories = allChannels.filter((c) => c.type === 4).sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)).map((c) => ({ id: String(c.id), name: String(c.name) }));
  const ready = settings.ok && lists.ok && rulesets.ok && rules.ok;
  const gateRow = gateRes.rows[0];
  const gate = cleanJoinGate(gateRow ?? {});
  const data = {
    settings: settings.rows[0] ? { enabled: settings.rows[0].enabled !== false, ignore_staff: settings.rows[0].ignore_staff !== false, ignore_bots: settings.rows[0].ignore_bots !== false, heat_decay: Number(settings.rows[0].heat_decay ?? 10), quarantine_role_id: settings.rows[0].quarantine_role_id ?? null, log_channel_id: settings.rows[0].log_channel_id ?? null } : { enabled: true, ignore_staff: true, ignore_bots: true, heat_decay: 10, quarantine_role_id: null, log_channel_id: null },
    gate,
    lists: lists.rows.map((l) => ({ id: String(l.id), name: String(l.name), kind: l.kind === "domains" ? "domains" : "words", items: Array.isArray(l.items) ? l.items.map(String) : [] })),
    rulesets: rulesets.rows.map((s) => ({
      id: String(s.id),
      name: String(s.name),
      enabled: s.enabled !== false,
      conditions: Array.isArray(s.conditions) ? s.conditions : [],
      rules: rules.rows.filter((r) => String(r.ruleset_id) === String(s.id)).map((r) => ({
        id: String(r.id),
        name: String(r.name),
        enabled: r.enabled !== false,
        dry_run: r.dry_run === true,
        trigger_mode: r.trigger_mode === "all" ? "all" : "any",
        triggers: Array.isArray(r.triggers) ? r.triggers : [],
        conditions: Array.isArray(r.conditions) ? r.conditions : [],
        effects: Array.isArray(r.effects) ? r.effects : [],
        threshold_count: Number(r.threshold_count) || 1,
        threshold_minutes: Number(r.threshold_minutes) || 10,
        stop: r.stop !== false,
        hits: Number(r.hits) || 0
      }))
    })),
    logs: logs.rows.map((l) => ({ id: String(l.id), rule: String(l.rule_name), user: String(l.user_id), channel: l.channel_id ? String(l.channel_id) : null, trigger: String(l.trigger), effects: Array.isArray(l.effects) ? l.effects.map(String) : [], at: String(l.created_at) }))
  };
  let canEdit = !auth.devView && !auth.access;
  if (auth.access) canEdit = pageDecision(auth.access, "rules").canEdit;
  return renderTemplate`${renderComponent($$result, "DashRules", $$DashRules, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "data": data, "roles": roles, "channels": channels, "categories": categories, "ready": ready, "canEdit": canEdit })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/rules.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/rules.astro";
const $$url = "/dash/guild/[id]/rules";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Rules,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
