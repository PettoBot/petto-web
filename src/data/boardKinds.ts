// The reaction boards of the dashboard (Boards page): which tables each one uses and what it starts with. Keep in step with the bot
// (src/db/starboard.js, monkeyboard.js and clownboard.js of petto-bot).
export interface BoardKind {
  id: 'star' | 'monkey' | 'clown';
  table: string;
  entries: string;
  name: string;
  emoji: string;
  color: number;
  icon: string;
  /** the start of the variables of its saved embed: {star.count}, {monkey.count}, {clown.count} */
  variable: string;
}

export const BOARD_KINDS: readonly BoardKind[] = [
  { id: 'star', table: 'starboards', entries: 'starboard_entries', name: 'Starboard', emoji: '⭐', color: 0xffc107, icon: 'ph:star-fill', variable: 'star' },
  { id: 'monkey', table: 'monkeyboards', entries: 'monkeyboard_entries', name: 'Monkeyboard', emoji: '🐒', color: 0x8b5a2b, icon: 'ph:smiley-fill', variable: 'monkey' },
  { id: 'clown', table: 'clownboards', entries: 'clownboard_entries', name: 'Clownboard', emoji: '🤡', color: 0xe8594f, icon: 'ph:smiley-wink-fill', variable: 'clown' },
];

export const MAX_EXTRA_EMOJIS = 4;

export interface BoardRow {
  kind: BoardKind['id'];
  channelId: string;
  threshold: number;
  emoji: string;
  extraEmojis: string[];
  color: number;
  selfstar: boolean;
  timestamp: boolean;
  jumpurl: boolean;
  attachments: boolean;
  template: string;
  ignoredChannelIds: string[];
  ignoredRoleIds: string[];
  ignoredUserIds: string[];
}

export function boardFromRow(kind: BoardKind, row: any): BoardRow {
  return {
    kind: kind.id,
    channelId: row.channel_id ?? '',
    threshold: Number(row.threshold) || 3,
    emoji: row.emoji || kind.emoji,
    extraEmojis: Array.isArray(row.extra_emojis) ? row.extra_emojis.map(String).slice(0, MAX_EXTRA_EMOJIS) : [],
    color: Number.isInteger(row.color) ? row.color : kind.color,
    selfstar: row.selfstar === true,
    timestamp: row.timestamp !== false,
    jumpurl: row.jumpurl !== false,
    attachments: row.attachments !== false,
    template: row.embed_template ?? '',
    ignoredChannelIds: row.ignored_channel_ids ?? [],
    ignoredRoleIds: row.ignored_role_ids ?? [],
    ignoredUserIds: row.ignored_user_ids ?? [],
  };
}

export const blankBoard = (kind: BoardKind): BoardRow => boardFromRow(kind, {});

const SNOWFLAKE = /^\d{15,25}$/;

/** The row to save for a board from the form (the emojis: the main one and up to four more, without repeats). */
export function rowFromForm(kind: BoardKind, guildId: string, form: FormData) {
  const emojis = [String(form.get('emoji') ?? ''), ...form.getAll('extra_emoji').map(String)].map((e) => e.trim().slice(0, 100)).filter(Boolean);
  const unique = [...new Set(emojis)];
  const colorHex = String(form.get('color') ?? '').trim();
  const template = String(form.get('embed_template') ?? '').trim().slice(0, 40);
  return {
    guild_id: guildId,
    channel_id: SNOWFLAKE.test(String(form.get('channel_id') ?? '').trim()) ? String(form.get('channel_id')).trim() : null,
    threshold: Math.max(1, Math.min(100, Math.floor(Number(form.get('threshold') ?? 3)) || 3)),
    emoji: unique[0] ?? kind.emoji,
    extra_emojis: unique.slice(1, 1 + MAX_EXTRA_EMOJIS),
    color: /^#[0-9a-f]{6}$/i.test(colorHex) ? parseInt(colorHex.slice(1), 16) : kind.color,
    selfstar: form.get('selfstar') === 'on',
    timestamp: form.get('timestamp') === 'on',
    jumpurl: form.get('jumpurl') === 'on',
    attachments: form.get('attachments') === 'on',
    embed_template: template || null,
    ignored_channel_ids: form.getAll('ignored_channel_ids').map(String).filter((id) => SNOWFLAKE.test(id)).slice(0, 100),
    ignored_role_ids: form.getAll('ignored_role_ids').map(String).filter((id) => SNOWFLAKE.test(id)).slice(0, 100),
    ignored_user_ids: String(form.get('ignored_user_ids') ?? '').split(/[\s,]+/).filter((v) => SNOWFLAKE.test(v)).slice(0, 100),
    updated_at: new Date().toISOString(),
  };
}
