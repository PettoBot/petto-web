// Members blocked from a module (suggestions, confessions): the same rows the bot's block commands write, read and changed from the
// dashboard. The bot reads them on every use, so a change counts at once.
import { ensureGuildRow } from './ensureGuild';
import { getMemberProfiles, memberAvatarUrl } from './memberNames';
import { withinBudget } from './liveCall';

export type BlockTable = 'suggestion_blocks' | 'confession_blocks';
export interface BlockedMember { id: string; name: string | null; avatar: string; by: string | null; byName: string | null; at: string }

const SNOWFLAKE = /^\d{15,25}$/;

/** Blocks or unblocks the member of the form (`block_member` / `unblock_member`); null when the form is about something else. */
export async function changeBlock(apiUrl: string, apiHeaders: Record<string, string>, table: BlockTable, guildId: string, form: FormData, byUserId: string): Promise<'blocked' | 'unblocked' | 'failed' | null> {
  const action = String(form.get('action') ?? '');
  if (action !== 'block_member' && action !== 'unblock_member') return null;
  const memberId = String(form.get('member_id') ?? '');
  if (!SNOWFLAKE.test(memberId)) return 'failed';
  if (action === 'unblock_member') {
    const res = await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${guildId}&user_id=eq.${memberId}`, { method: 'DELETE', headers: { ...apiHeaders, Prefer: 'return=minimal' } }).catch(() => null);
    return res?.ok ? 'unblocked' : 'failed';
  }
  await ensureGuildRow(apiUrl, apiHeaders, guildId);
  const res = await fetch(`${apiUrl}/rest/v1/${table}?on_conflict=guild_id,user_id`, {
    method: 'POST',
    headers: { ...apiHeaders, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ guild_id: guildId, user_id: memberId, blocked_by: byUserId }),
  }).catch(() => null);
  return res?.ok ? 'blocked' : 'failed';
}

/** The blocked members, newest first, with their names and pictures (never waiting long for them). */
export async function loadBlocked(astro: { locals?: any }, apiUrl: string, apiHeaders: Record<string, string>, table: BlockTable, guildId: string, botToken: string | undefined, viewerId: string): Promise<BlockedMember[]> {
  const res = await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${guildId}&select=user_id,blocked_by,created_at&order=created_at.desc&limit=200`, { headers: apiHeaders }).catch(() => null);
  const rows: any[] = res?.ok ? await res.json().catch(() => []) : [];
  if (!rows.length) return [];
  const ids = rows.flatMap((row) => [String(row.user_id), row.blocked_by ? String(row.blocked_by) : '']).filter(Boolean);
  const profiles = (await withinBudget(getMemberProfiles(astro, guildId, ids, botToken, { fallback: 'user', userId: viewerId }), 1500))?.value ?? new Map();
  const nameOf = (id: string) => { const p = profiles.get(id); return p ? p.displayName || p.username : null; };
  return rows.map((row) => ({
    id: String(row.user_id), name: nameOf(String(row.user_id)), avatar: memberAvatarUrl(String(row.user_id), profiles.get(String(row.user_id)), 64),
    by: row.blocked_by ? String(row.blocked_by) : null, byName: row.blocked_by ? nameOf(String(row.blocked_by)) : null, at: String(row.created_at ?? ''),
  }));
}
