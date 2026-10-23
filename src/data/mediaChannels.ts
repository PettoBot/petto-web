// The sites a link channel can allow (Media channels, /dash/guild/<id>/media). The ids are the ones of the bot (src/utils/mediaOnly.js of
// petto-bot): keep the two lists in step. `icon` is a Simple Icons name that is in the icon list of astro.config.mjs.
export interface MediaNetwork { id: string; name: string; icon: string }

export const MEDIA_NETWORKS: readonly MediaNetwork[] = [
  { id: 'youtube', name: 'YouTube', icon: 'simple-icons:youtube' },
  { id: 'twitter', name: 'X (Twitter)', icon: 'simple-icons:x' },
  { id: 'instagram', name: 'Instagram', icon: 'simple-icons:instagram' },
  { id: 'tiktok', name: 'TikTok', icon: 'simple-icons:tiktok' },
  { id: 'pinterest', name: 'Pinterest', icon: 'simple-icons:pinterest' },
  { id: 'spotify', name: 'Spotify', icon: 'simple-icons:spotify' },
  { id: 'twitch', name: 'Twitch', icon: 'simple-icons:twitch' },
  { id: 'kick', name: 'Kick', icon: 'simple-icons:kick' },
  { id: 'soundcloud', name: 'SoundCloud', icon: 'simple-icons:soundcloud' },
  { id: 'reddit', name: 'Reddit', icon: 'simple-icons:reddit' },
  { id: 'facebook', name: 'Facebook', icon: 'simple-icons:facebook' },
  { id: 'github', name: 'GitHub', icon: 'simple-icons:github' },
  { id: 'gif', name: 'GIFs (Tenor, Giphy)', icon: 'ph:image-fill' },
  { id: 'discord', name: 'Discord', icon: 'simple-icons:discord' },
];
export const MEDIA_NETWORK_IDS = MEDIA_NETWORKS.map((n) => n.id);

/** The rule of a channel, as the page reads and writes it. */
export interface MediaRule {
  channelId: string;
  attachments: boolean;
  links: boolean;
  images: boolean;
  videos: boolean;
  audio: boolean;
  files: boolean;
  networks: string[];
  caption: boolean;
  notice: boolean;
  bypassRoleIds: string[];
}

export const MAX_BYPASS_ROLES = 25;

export function ruleFromRow(row: any): MediaRule {
  return {
    channelId: String(row.channel_id),
    attachments: row.attachments_enabled === true,
    links: row.links_enabled === true,
    images: row.allow_images !== false,
    videos: row.allow_videos !== false,
    audio: row.allow_audio === true,
    files: row.allow_files === true,
    networks: Array.isArray(row.networks) ? row.networks.map(String).filter((id: string) => MEDIA_NETWORK_IDS.includes(id)) : [],
    caption: row.allow_caption !== false,
    notice: row.notice !== false,
    bypassRoleIds: Array.isArray(row.bypass_role_ids) ? row.bypass_role_ids.map(String) : [],
  };
}

/** The row to save for a rule (the form of one channel, or a preset when a channel is added). */
export function rowFromForm(guildId: string, channelId: string, form: FormData) {
  const all = form.get('any_site') === 'on';
  const picked = form.getAll('networks').map(String).filter((id) => MEDIA_NETWORK_IDS.includes(id));
  return {
    guild_id: guildId,
    channel_id: channelId,
    attachments_enabled: form.get('attachments_enabled') === 'on',
    links_enabled: form.get('links_enabled') === 'on',
    allow_images: form.get('allow_images') === 'on',
    allow_videos: form.get('allow_videos') === 'on',
    allow_audio: form.get('allow_audio') === 'on',
    allow_files: form.get('allow_files') === 'on',
    networks: all ? [] : [...new Set(picked)],
    allow_caption: form.get('allow_caption') === 'on',
    notice: form.get('notice') === 'on',
    bypass_role_ids: [...new Set(form.getAll('bypass_role_ids').map(String).filter((id) => /^\d{15,25}$/.test(id)))].slice(0, MAX_BYPASS_ROLES),
    updated_at: new Date().toISOString(),
  };
}

/** The first values of a channel that is added: the preset says which of the two rules it starts with. */
export function presetRow(guildId: string, channelId: string, preset: string) {
  return {
    guild_id: guildId,
    channel_id: channelId,
    attachments_enabled: preset === 'media' || preset === 'both',
    links_enabled: preset === 'links' || preset === 'both',
    allow_images: true, allow_videos: true, allow_audio: false, allow_files: false,
    networks: [],
    allow_caption: true, notice: true, bypass_role_ids: [],
    updated_at: new Date().toISOString(),
  };
}
