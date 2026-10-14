/** The protections of the anti-nuke, the same list and defaults as the bot (src/utils/antiNukeRules.js in the bot). */
export interface RuleMeta { id: string; legacy: boolean; threshold: number; window: number; icon: string; }

export const RULES: RuleMeta[] = [
  { id: 'ban', legacy: true, threshold: 3, window: 10, icon: 'ph:gavel-fill' },
  { id: 'kick', legacy: true, threshold: 3, window: 10, icon: 'ph:sign-out-fill' },
  { id: 'bot_add', legacy: false, threshold: 1, window: 60, icon: 'ph:robot-fill' },
  { id: 'webhook', legacy: true, threshold: 3, window: 10, icon: 'ph:link-fill' },
  { id: 'channel_create', legacy: true, threshold: 4, window: 10, icon: 'ph:plus-circle-fill' },
  { id: 'channel_delete', legacy: true, threshold: 2, window: 10, icon: 'ph:trash-fill' },
  { id: 'role_create', legacy: true, threshold: 4, window: 10, icon: 'ph:plus-circle-fill' },
  { id: 'role_delete', legacy: true, threshold: 2, window: 10, icon: 'ph:trash-fill' },
  { id: 'role_assign', legacy: false, threshold: 1, window: 10, icon: 'ph:key-fill' },
  { id: 'unban', legacy: false, threshold: 5, window: 10, icon: 'ph:gavel-fill' },
  { id: 'emoji_delete', legacy: true, threshold: 5, window: 10, icon: 'ph:mask-happy-fill' },
  { id: 'emoji_create', legacy: true, threshold: 8, window: 10, icon: 'ph:mask-happy-fill' },
  { id: 'guild_update', legacy: false, threshold: 3, window: 60, icon: 'ph:gear-six-fill' },
];

export const ACTIONS = ['alert', 'quarantine', 'kick', 'ban'] as const;

export interface RuleRow { rule: string; enabled: boolean; threshold: number; window_seconds: number; action: string; alert_channel_id: string | null; whitelist_ids: string[]; whitelist_role_ids: string[]; }
export interface NukeConfig { enabled?: boolean; action_threshold?: number; window_seconds?: number; whitelist_ids?: string[]; whitelist_role_ids?: string[]; alert_channel_id?: string | null; }

export interface Effective { id: string; enabled: boolean; saved: boolean; threshold: number; window: number; action: string; alertChannelId: string; whitelistIds: string[]; whitelistRoleIds: string[]; followsOldSwitch: boolean; }

/** What a protection does now: its saved row, else the old single switch (the protections that existed), else off. */
export function resolveRule(config: NukeConfig | null, rows: RuleRow[], meta: RuleMeta): Effective {
  const row = rows.find((r) => r.rule === meta.id);
  if (row) {
    return { id: meta.id, enabled: row.enabled, saved: true, threshold: row.threshold, window: row.window_seconds, action: row.action, alertChannelId: row.alert_channel_id ?? '', whitelistIds: row.whitelist_ids ?? [], whitelistRoleIds: row.whitelist_role_ids ?? [], followsOldSwitch: false };
  }
  if (meta.legacy && config?.enabled) {
    return { id: meta.id, enabled: true, saved: false, threshold: config.action_threshold ?? meta.threshold, window: config.window_seconds ?? meta.window, action: 'quarantine', alertChannelId: '', whitelistIds: [], whitelistRoleIds: [], followsOldSwitch: true };
  }
  return { id: meta.id, enabled: false, saved: false, threshold: meta.threshold, window: meta.window, action: 'quarantine', alertChannelId: '', whitelistIds: [], whitelistRoleIds: [], followsOldSwitch: false };
}

export const SNOWFLAKE = /^\d{15,25}$/;
