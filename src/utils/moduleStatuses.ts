// What each module of a server is doing, read in a few small calls: whether it has been set up (`statuses`) and, for the modules that have a real
// on/off switch in their own settings, that switch and whether it has the channel it needs (`switches`). Used by the Modules page and by the
// quick access of the Overview. A read that fails leaves its module without a mark.
import { runBatched } from './concurrency';

export type ModuleState = 'on' | 'todo' | 'info';
export interface ModuleSwitch { enabled: boolean; needsChannel: boolean; hasChannel: boolean }
export interface ModuleStatuses { statuses: Record<string, { state: ModuleState; note: string }>; switches: Record<string, ModuleSwitch> }

export async function loadModuleStatuses(apiUrl: string, apiKey: string, id: string): Promise<ModuleStatuses> {
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
  const row = (table: string, columns: string) => () => fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}&select=${columns}`, { headers }).catch(() => null);
  const total = (table: string, extra = '') => () => fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}${extra}&select=guild_id&limit=1`, { headers: { ...headers, Prefer: 'count=exact' } }).catch(() => null);
  
  const [events, verification, automod, antinuke, logs, level, tickets, giveaways, starboard, monkeyboard, birthdays, reactionRoles, responders, commands, webhooks, embeds, cards, suggestions, counting, confessions, formsOpen, counters, honeypots, roleTriggers, roleQuotas, activityBoards, modRules, agedRoles, messageRoles, joinRolesCount] = await runBatched([
    row('member_events_config', 'welcome_channel_id,leave_channel_id,boost_channel_id'),
    row('verification_config', 'enabled'),
    row('automod_config', 'word_filter_enabled,anti_spam_enabled,anti_raid_enabled,anti_alt_enabled'),
    row('antinuke_config', 'enabled'),
    total('log_entries'),
    row('level_config', 'enabled'),
    total('ticket_categories'),
    total('giveaways', '&ended=eq.false'),
    row('starboards', 'channel_id'),
    row('monkeyboards', 'channel_id'),
    row('birthday_config', 'enabled,channel_id'),
    total('reaction_roles'),
    total('auto_responders'),
    total('custom_commands'),
    total('managed_webhooks'),
    total('embed_templates'),
    total('image_cards'),
    row('suggestion_config', 'enabled,channel_id'),
    row('counting_config', 'enabled,channel_id'),
    row('confession_config', 'enabled,channel_id'),
    total('forms', '&status=eq.open'),
    total('server_counters'),
    total('honeypots'),
    total('role_triggers'),
    total('role_quotas'),
    total('activity_leaderboards'),
    total('mod_rules', '&enabled=eq.true'),
    total('aged_roles', '&enabled=eq.true'),
    total('message_roles', '&enabled=eq.true'),
    total('join_roles'),
  ], 6);
  
  async function first(res: Response | null): Promise<Record<string, any> | null | undefined> {
    if (!res || !res.ok) return undefined;
    try { const rows = await res.json(); return Array.isArray(rows) ? (rows[0] ?? null) : undefined; } catch { return undefined; }
  }
  const count = (res: Response | null): number | undefined => {
    if (!res || !res.ok) return undefined;
    const n = Number(res.headers.get('content-range')?.split('/')[1]);
    return Number.isFinite(n) ? n : undefined;
  };
  
  const ev = await first(events); const vf = await first(verification); const am = await first(automod); const an = await first(antinuke);
  const sg = await first(suggestions); const ct = await first(counting); const cf = await first(confessions);
  const lv = await first(level); const sb = await first(starboard); const mb = await first(monkeyboard); const bd = await first(birthdays);
  const logCount = count(logs); const ticketCount = count(tickets); const giveawayCount = count(giveaways); const rrCount = count(reactionRoles);
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
  const responderCount = count(responders); const commandCount = count(commands); const webhookCount = count(webhooks); const embedCount = count(embeds); const cardCount = count(cards);
  
  const statuses: Record<string, { state: ModuleState; note: string }> = {};
  const set = (key: string, known: boolean, on: boolean, note = '') => { if (known) statuses[key] = { state: on ? 'on' : 'todo', note }; };
  set('welcome', ev !== undefined, Boolean(ev?.welcome_channel_id || ev?.leave_channel_id || ev?.boost_channel_id));
  set('verification', vf !== undefined, Boolean(vf?.enabled));
  set('automod', am !== undefined, Boolean(am && (am.word_filter_enabled || am.anti_spam_enabled || am.anti_raid_enabled || am.anti_alt_enabled)));
  set('security', an !== undefined, Boolean(an?.enabled));
  set('honeypot', honeypotCount !== undefined, (honeypotCount ?? 0) > 0, honeypotCount ? String(honeypotCount) : '');
  set('role-triggers', roleTriggerCount !== undefined, (roleTriggerCount ?? 0) > 0, roleTriggerCount ? String(roleTriggerCount) : '');
  set('role-quotas', roleQuotaCount !== undefined, (roleQuotaCount ?? 0) > 0, roleQuotaCount ? String(roleQuotaCount) : '');
  set('activity-boards', activityBoardCount !== undefined, (activityBoardCount ?? 0) > 0, activityBoardCount ? String(activityBoardCount) : '');
  set('aged-roles', agedRoleCount !== undefined, (agedRoleCount ?? 0) > 0, agedRoleCount ? String(agedRoleCount) : '');
  set('message-roles', messageRoleCount !== undefined, (messageRoleCount ?? 0) > 0, messageRoleCount ? String(messageRoleCount) : '');
  set('joinroles', joinRoleCount !== undefined, (joinRoleCount ?? 0) > 0, joinRoleCount ? String(joinRoleCount) : '');
  set('mod-rules', modRuleCount !== undefined, (modRuleCount ?? 0) > 0, modRuleCount ? String(modRuleCount) : '');
  set('logging', logCount !== undefined, (logCount ?? 0) > 0, logCount ? String(logCount) : '');
  set('leveling', lv !== undefined, Boolean(lv?.enabled));
  set('tickets', ticketCount !== undefined, (ticketCount ?? 0) > 0, ticketCount ? String(ticketCount) : '');
  set('giveaways', giveawayCount !== undefined, (giveawayCount ?? 0) > 0, giveawayCount ? String(giveawayCount) : '');
  set('starboard', sb !== undefined || mb !== undefined, Boolean(sb?.channel_id || mb?.channel_id));
  set('suggestions', sg !== undefined, Boolean(sg?.enabled && sg?.channel_id));
  set('counting', ct !== undefined, Boolean(ct?.enabled && ct?.channel_id));
  set('confessions', cf !== undefined, Boolean(cf?.enabled && cf?.channel_id));
  set('forms', formCount !== undefined, (formCount ?? 0) > 0, formCount ? String(formCount) : '');
  set('birthdays', bd !== undefined, Boolean(bd?.enabled));
  set('reactionroles', rrCount !== undefined, (rrCount ?? 0) > 0, rrCount ? String(rrCount) : '');
  set('autoresponders', responderCount !== undefined, (responderCount ?? 0) > 0, responderCount ? String(responderCount) : '');
  set('commands', commandCount !== undefined, (commandCount ?? 0) > 0, commandCount ? String(commandCount) : '');
  set('counters', counterCount !== undefined, (counterCount ?? 0) > 0, counterCount ? String(counterCount) : '');
  set('webhooks', webhookCount !== undefined, (webhookCount ?? 0) > 0, webhookCount ? String(webhookCount) : '');
  set('embeds', embedCount !== undefined, (embedCount ?? 0) > 0, embedCount ? String(embedCount) : '');
  set('cards', cardCount !== undefined, (cardCount ?? 0) > 0, cardCount ? String(cardCount) : '');
  // Joining roles and the DM have their own tables; the guide only needs the ones above.

  // The modules whose own settings have a real on/off switch: the switch as saved, and whether the channel they need is chosen.
  const switches: Record<string, ModuleSwitch> = {};
  if (vf !== undefined) switches.verification = { enabled: Boolean(vf?.enabled), needsChannel: false, hasChannel: true };
  if (lv !== undefined) switches.leveling = { enabled: Boolean(lv?.enabled), needsChannel: false, hasChannel: true };
  if (bd !== undefined) switches.birthdays = { enabled: Boolean(bd?.enabled), needsChannel: true, hasChannel: Boolean(bd?.channel_id) };
  if (sg !== undefined) switches.suggestions = { enabled: Boolean(sg?.enabled), needsChannel: true, hasChannel: Boolean(sg?.channel_id) };
  if (ct !== undefined) switches.counting = { enabled: Boolean(ct?.enabled), needsChannel: true, hasChannel: Boolean(ct?.channel_id) };
  if (cf !== undefined) switches.confessions = { enabled: Boolean(cf?.enabled), needsChannel: true, hasChannel: Boolean(cf?.channel_id) };
  return { statuses, switches };
}
