import { r as runBatched } from './concurrency_PoJGtmqS.mjs';

async function loadModuleStatuses(apiUrl, apiKey, id) {
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
  const row = (table, columns) => () => fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}&select=${columns}`, { headers }).catch(() => null);
  const total = (table, extra = "") => () => fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}${extra}&select=guild_id&limit=1`, { headers: { ...headers, Prefer: "count=exact" } }).catch(() => null);
  const [events, verification, automod, antinuke, logs, level, tickets, giveaways, starboard, monkeyboard, birthdays, reactionRoles, responders, commands, webhooks, embeds, cards, suggestions, counting, confessions, formsOpen, counters, honeypots, roleTriggers, roleQuotas, activityBoards, modRules, agedRoles, messageRoles, joinRolesCount, stayVoice] = await runBatched([
    row("member_events_config", "welcome_channel_id,leave_channel_id,boost_channel_id"),
    row("verification_config", "enabled"),
    row("automod_config", "word_filter_enabled,anti_spam_enabled,anti_raid_enabled,anti_alt_enabled"),
    row("antinuke_config", "enabled"),
    total("log_entries"),
    row("level_config", "enabled"),
    total("ticket_categories"),
    total("giveaways", "&ended=eq.false"),
    row("starboards", "channel_id"),
    row("monkeyboards", "channel_id"),
    row("birthday_config", "enabled,channel_id"),
    total("reaction_roles"),
    total("auto_responders"),
    total("custom_commands"),
    total("managed_webhooks"),
    total("embed_templates"),
    total("image_cards"),
    row("suggestion_config", "enabled,channel_id"),
    row("counting_config", "enabled,channel_id"),
    row("confession_config", "enabled,channel_id"),
    total("forms", "&status=eq.open"),
    total("server_counters"),
    total("honeypots"),
    total("role_triggers"),
    total("role_quotas"),
    total("activity_leaderboards"),
    total("mod_rules", "&enabled=eq.true"),
    total("aged_roles", "&enabled=eq.true"),
    total("message_roles", "&enabled=eq.true"),
    total("join_roles"),
    total("stay_voice", "&enabled=eq.true")
  ], 6);
  async function first(res) {
    if (!res || !res.ok) return void 0;
    try {
      const rows = await res.json();
      return Array.isArray(rows) ? rows[0] ?? null : void 0;
    } catch {
      return void 0;
    }
  }
  const count = (res) => {
    if (!res || !res.ok) return void 0;
    const n = Number(res.headers.get("content-range")?.split("/")[1]);
    return Number.isFinite(n) ? n : void 0;
  };
  const ev = await first(events);
  const vf = await first(verification);
  const am = await first(automod);
  const an = await first(antinuke);
  const sg = await first(suggestions);
  const ct = await first(counting);
  const cf = await first(confessions);
  const lv = await first(level);
  const sb = await first(starboard);
  const mb = await first(monkeyboard);
  const bd = await first(birthdays);
  const logCount = count(logs);
  const ticketCount = count(tickets);
  const giveawayCount = count(giveaways);
  const rrCount = count(reactionRoles);
  const formCount = count(formsOpen);
  const counterCount = count(counters);
  const honeypotCount = count(honeypots);
  const roleTriggerCount = count(roleTriggers);
  const roleQuotaCount = count(roleQuotas);
  const activityBoardCount = count(activityBoards);
  const modRuleCount = count(modRules);
  const agedRoleCount = count(agedRoles);
  const messageRoleCount = count(messageRoles);
  const joinRoleCount = count(joinRolesCount);
  const stayVoiceCount = count(stayVoice);
  const responderCount = count(responders);
  const commandCount = count(commands);
  const webhookCount = count(webhooks);
  const embedCount = count(embeds);
  const cardCount = count(cards);
  const statuses = {};
  const set = (key, known, on, note = "") => {
    if (known) statuses[key] = { state: on ? "on" : "todo", note };
  };
  set("welcome", ev !== void 0, Boolean(ev?.welcome_channel_id || ev?.leave_channel_id || ev?.boost_channel_id));
  set("verification", vf !== void 0, Boolean(vf?.enabled));
  set("automod", am !== void 0, Boolean(am && (am.word_filter_enabled || am.anti_spam_enabled || am.anti_raid_enabled || am.anti_alt_enabled)));
  set("security", an !== void 0, Boolean(an?.enabled));
  set("honeypot", honeypotCount !== void 0, (honeypotCount ?? 0) > 0, honeypotCount ? String(honeypotCount) : "");
  set("role-triggers", roleTriggerCount !== void 0, (roleTriggerCount ?? 0) > 0, roleTriggerCount ? String(roleTriggerCount) : "");
  set("role-quotas", roleQuotaCount !== void 0, (roleQuotaCount ?? 0) > 0, roleQuotaCount ? String(roleQuotaCount) : "");
  set("activity-boards", activityBoardCount !== void 0, (activityBoardCount ?? 0) > 0, activityBoardCount ? String(activityBoardCount) : "");
  set("aged-roles", agedRoleCount !== void 0, (agedRoleCount ?? 0) > 0, agedRoleCount ? String(agedRoleCount) : "");
  set("message-roles", messageRoleCount !== void 0, (messageRoleCount ?? 0) > 0, messageRoleCount ? String(messageRoleCount) : "");
  set("stay-voice", stayVoiceCount !== void 0, (stayVoiceCount ?? 0) > 0);
  set("joinroles", joinRoleCount !== void 0, (joinRoleCount ?? 0) > 0, joinRoleCount ? String(joinRoleCount) : "");
  set("mod-rules", modRuleCount !== void 0, (modRuleCount ?? 0) > 0, modRuleCount ? String(modRuleCount) : "");
  set("logging", logCount !== void 0, (logCount ?? 0) > 0, logCount ? String(logCount) : "");
  set("leveling", lv !== void 0, Boolean(lv?.enabled));
  set("tickets", ticketCount !== void 0, (ticketCount ?? 0) > 0, ticketCount ? String(ticketCount) : "");
  set("giveaways", giveawayCount !== void 0, (giveawayCount ?? 0) > 0, giveawayCount ? String(giveawayCount) : "");
  set("starboard", sb !== void 0 || mb !== void 0, Boolean(sb?.channel_id || mb?.channel_id));
  set("suggestions", sg !== void 0, Boolean(sg?.enabled && sg?.channel_id));
  set("counting", ct !== void 0, Boolean(ct?.enabled && ct?.channel_id));
  set("confessions", cf !== void 0, Boolean(cf?.enabled && cf?.channel_id));
  set("forms", formCount !== void 0, (formCount ?? 0) > 0, formCount ? String(formCount) : "");
  set("birthdays", bd !== void 0, Boolean(bd?.enabled));
  set("reactionroles", rrCount !== void 0, (rrCount ?? 0) > 0, rrCount ? String(rrCount) : "");
  set("autoresponders", responderCount !== void 0, (responderCount ?? 0) > 0, responderCount ? String(responderCount) : "");
  set("commands", commandCount !== void 0, (commandCount ?? 0) > 0, commandCount ? String(commandCount) : "");
  set("counters", counterCount !== void 0, (counterCount ?? 0) > 0, counterCount ? String(counterCount) : "");
  set("webhooks", webhookCount !== void 0, (webhookCount ?? 0) > 0, webhookCount ? String(webhookCount) : "");
  set("embeds", embedCount !== void 0, (embedCount ?? 0) > 0, embedCount ? String(embedCount) : "");
  set("cards", cardCount !== void 0, (cardCount ?? 0) > 0, cardCount ? String(cardCount) : "");
  const switches = {};
  if (vf !== void 0) switches.verification = { enabled: Boolean(vf?.enabled), needsChannel: false, hasChannel: true };
  if (lv !== void 0) switches.leveling = { enabled: Boolean(lv?.enabled), needsChannel: false, hasChannel: true };
  if (bd !== void 0) switches.birthdays = { enabled: Boolean(bd?.enabled), needsChannel: true, hasChannel: Boolean(bd?.channel_id) };
  if (sg !== void 0) switches.suggestions = { enabled: Boolean(sg?.enabled), needsChannel: true, hasChannel: Boolean(sg?.channel_id) };
  if (ct !== void 0) switches.counting = { enabled: Boolean(ct?.enabled), needsChannel: true, hasChannel: Boolean(ct?.channel_id) };
  if (cf !== void 0) switches.confessions = { enabled: Boolean(cf?.enabled), needsChannel: true, hasChannel: Boolean(cf?.channel_id) };
  return { statuses, switches };
}

export { loadModuleStatuses as l };
