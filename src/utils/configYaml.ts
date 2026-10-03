import { getGuildInfo } from './discord';
import { runBatched } from './concurrency';

const BANNER = [
  '  ██████╗ ███████╗████████╗████████╗ ██████╗ ',
  '  ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔═══██╗',
  '  ██████╔╝█████╗     ██║      ██║   ██║   ██║',
  '  ██╔═══╝ ██╔══╝     ██║      ██║   ██║   ██║',
  '  ██║     ███████╗   ██║      ██║   ╚██████╔╝',
  '  ╚═╝     ╚══════╝   ╚═╝      ╚═╝    ╚═════╝ ',
]
  .map((l) => `#${l}`)
  .join('\n');

function yamlScalar(v: unknown): string {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  if (Array.isArray(v)) return v.length === 0 ? '[]' : `[${v.map((x) => `'${String(x).replace(/'/g, "''")}'`).join(', ')}]`;
  return `'${String(v).replace(/'/g, "''")}'`;
}

/**
 * The full "current configuration" YAML preview shown on the General page, every module's
 * settings, not just this page's. Deliberately isolated from general.astro (which only needs
 * 3 fetches for its actual form) since this alone needs ~23 parallel API reads, expensive
 * enough that it's fetched lazily client-side instead of blocking the page's initial render.
 */
export async function buildConfigYaml(id: string, botToken: string, apiUrl: string, apiKey: string): Promise<string | null> {
  const guildInfo = await getGuildInfo(id, botToken);
  if (!guildInfo) return null;

  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
  const countHeaders = { ...apiHeaders, Prefer: 'count=exact' };
  function rowCount(res: Response): number {
    return Number(res.headers.get('content-range')?.split('/')[1] ?? '0');
  }

  const [
    guildsRes, automodRes, antinukeRes, levelRes, levelRewardsRes,
    ticketCatRes, giveawayConfigRes, giveawayActiveRes, giveawayPresetsRes,
    logEntriesRes, commandsRes, respondersRes, stickyRes, reactionRolesRes, disabledRes,
    reportRes, boosterRes, memberEventsRes, verificationRes, bumpRes, pojRes,
    silentChannelsRes, escalationRes,
  ] = await runBatched([
    () => fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=prefix,mute_role_id,bot_nickname,bot_avatar_url,bot_banner_url,bot_description,updated_at`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/automod_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/antinuke_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/level_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/level_rewards?guild_id=eq.${id}&select=level`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/ticket_categories?guild_id=eq.${id}&select=id`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/giveaway_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/giveaways?guild_id=eq.${id}&ended=eq.false&select=id`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/giveaway_presets?guild_id=eq.${id}&select=id`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/log_entries?guild_id=eq.${id}&select=event`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/custom_commands?guild_id=eq.${id}&select=id`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/auto_responders?guild_id=eq.${id}&select=id`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/sticky_messages?guild_id=eq.${id}&select=channel_id`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/reaction_roles?guild_id=eq.${id}&select=id`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/disabled_commands?guild_id=eq.${id}&select=id`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/report_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/booster_role_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/member_events_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/verification_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/bump_reminders?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/poj_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/automod_silent_channels?guild_id=eq.${id}&select=channel_id`, { headers: countHeaders }),
    () => fetch(`${apiUrl}/rest/v1/warn_escalation_rules?guild_id=eq.${id}&select=warn_count`, { headers: countHeaders }),
  ], 6);

  async function firstRow(res: Response) {
    const rows = res.ok ? await res.json() : [];
    return rows[0] ?? {};
  }

  const g = await firstRow(guildsRes);
  const config = {
    prefix: g.prefix ?? '!', mute_role_id: g.mute_role_id ?? null,
    bot_nickname: g.bot_nickname ?? null, bot_avatar_url: g.bot_avatar_url ?? null,
    bot_banner_url: g.bot_banner_url ?? null, bot_description: g.bot_description ?? null,
    updated_at: g.updated_at ?? null,
  };

  const am = await firstRow(automodRes);
  const an = await firstRow(antinukeRes);
  const lv = await firstRow(levelRes);
  const gc = await firstRow(giveawayConfigRes);
  const rp = await firstRow(reportRes);
  const br = await firstRow(boosterRes);
  const me = await firstRow(memberEventsRes);
  const vf = await firstRow(verificationRes);
  const bm = await firstRow(bumpRes);
  const pj = await firstRow(pojRes);

  const y = yamlScalar;

  return `${BANNER}
#
#   This is the configuration file for the server: ${guildInfo.name}. Editing it here saves it
#   straight to Petto, no need to paste it anywhere. Anything not set yet shows its real default
#   (0, false, null, or []), nothing here is hidden or skipped.
#

guild_id: ${y(id)}
prefix: ${y(config.prefix)}
mute_role_id: ${y(config.mute_role_id)}

bot_profile:                          # Set from the Customize page
  nickname: ${y(config.bot_nickname)}
  avatar_url: ${y(config.bot_avatar_url)}
  banner_url: ${y(config.bot_banner_url)}
  description: ${y(config.bot_description)}

moderation:
  automod:
    word_filter_enabled: ${y(am.word_filter_enabled ?? false)}
    word_filter_action: ${y(am.word_filter_action ?? 'warn')}
    banned_words: ${y(am.banned_words ?? [])}
    anti_spam_enabled: ${y(am.anti_spam_enabled ?? false)}
    max_mentions: ${y(am.max_mentions ?? 5)}
    anti_raid_enabled: ${y(am.anti_raid_enabled ?? false)}
    raid_join_threshold: ${y(am.raid_join_threshold ?? 6)}
    raid_window_seconds: ${y(am.raid_window_seconds ?? 10)}
    raid_action: ${y(am.raid_action ?? 'alert')}
    anti_alt_enabled: ${y(am.anti_alt_enabled ?? false)}
    anti_alt_min_age_days: ${y(am.anti_alt_min_age_days ?? 7)}
    anti_alt_action: ${y(am.anti_alt_action ?? 'kick')}
    immune_role_ids: ${y(am.immune_role_ids ?? [])}
  antinuke:
    enabled: ${y(an.enabled ?? false)}
    action_threshold: ${y(an.action_threshold ?? 5)}
    window_seconds: ${y(an.window_seconds ?? 10)}
    whitelist_ids: ${y(an.whitelist_ids ?? [])}
  silent_channels_count: ${y(rowCount(silentChannelsRes))}
  warn_escalation_rules_count: ${y(rowCount(escalationRes))}

leveling:
  enabled: ${y(lv.enabled ?? false)}
  xp_min: ${y(lv.xp_min ?? 15)}
  xp_max: ${y(lv.xp_max ?? 25)}
  xp_per_vc_minute: ${y(lv.xp_per_vc_minute ?? 5)}
  cooldown_seconds: ${y(lv.cooldown_seconds ?? 60)}
  notify_mode: ${y(lv.notify_mode ?? 'reply')}
  notify_channel_id: ${y(lv.notify_channel_id ?? null)}
  notify_embed: ${y(lv.notify_embed ?? false)}
  notify_every: ${y(lv.notify_every ?? 1)}
  role_mode: ${y(lv.role_mode ?? 'highest')}
  ignored_channel_ids: ${y(lv.ignored_channel_ids ?? [])}
  join_xp: ${y(lv.join_xp ?? 0)}
  join_level: ${y(lv.join_level ?? 0)}
  curve_a: ${y(lv.curve_a ?? 1)}
  curve_b: ${y(lv.curve_b ?? 50)}
  curve_c: ${y(lv.curve_c ?? 100)}
  difficulty: ${y(lv.difficulty ?? 2.5)}
  rounding: ${y(lv.rounding ?? 50)}
  max_level: ${y(lv.max_level ?? 1000)}
  rewards_count: ${y(rowCount(levelRewardsRes))}

tickets:
  support_types_count: ${y(rowCount(ticketCatRes))}

giveaways:
  entry_mode: ${y(gc.entry_mode ?? 'button')}
  reaction: ${y(gc.reaction ?? '🎉')}
  no_entries_message: ${y(gc.no_entries_message ?? null)}
  deny_message: ${y(gc.deny_message ?? null)}
  running_now: ${y(rowCount(giveawayActiveRes))}
  presets_count: ${y(rowCount(giveawayPresetsRes))}

automation:
  custom_commands_count: ${y(rowCount(commandsRes))}
  autoresponders_count: ${y(rowCount(respondersRes))}
  sticky_messages_count: ${y(rowCount(stickyRes))}
  reaction_roles_count: ${y(rowCount(reactionRolesRes))}
  disabled_commands_count: ${y(rowCount(disabledRes))}

logging:
  routed_events_count: ${y(rowCount(logEntriesRes))}

community:
  reports_enabled: ${y(rp.enabled ?? false)}
  reports_channel_id: ${y(rp.channel_id ?? null)}
  booster_role_limit: ${y(br.role_limit ?? 1)}
  booster_share_max: ${y(br.share_max ?? 0)}
  booster_color_cooldown_ms: ${y(br.color_cooldown_ms ?? 0)}
  booster_icon_cooldown_ms: ${y(br.icon_cooldown_ms ?? 0)}
  booster_rename_cooldown_ms: ${y(br.rename_cooldown_ms ?? 0)}

onboarding:
  welcome_channel_id: ${y(me.welcome_channel_id ?? null)}
  leave_channel_id: ${y(me.leave_channel_id ?? null)}
  boost_channel_id: ${y(me.boost_channel_id ?? null)}
  boost_level_message: ${y(me.boost_level_message ?? null)}
  dm_join_message: ${y(me.dm_join_message ?? null)}
  verification_enabled: ${y(vf.enabled ?? false)}
  bump_channel_id: ${y(bm.channel_id ?? null)}
  bump_message: ${y(bm.message ?? null)}
  bump_thankyou: ${y(bm.thankyou ?? null)}
  ping_on_join_enabled: ${y(pj.enabled ?? false)}

updated_at: ${y(config.updated_at)}
`;
}
