const MANAGE_GUILD = 0x20n;
const ADMINISTRATOR = 0x8n;

export function canManageGuild(guild: { owner?: boolean; permissions?: string }): boolean {
  if (guild.owner) return true;
  const perms = BigInt(guild.permissions ?? '0');
  return (perms & MANAGE_GUILD) === MANAGE_GUILD || (perms & ADMINISTRATOR) === ADMINISTRATOR;
}

export function guildIconUrl(guild: { id: string; icon?: string | null }, size = 64): string | null {
  return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=${size}` : null;
}

const GUILD_INFO_TTL_MS = 20_000;
const guildInfoCache = new Map<string, { value: { id: string; name: string; icon: string | null }; expiresAt: number }>();

export async function getGuildInfo(guildId: string, botToken: string): Promise<{ id: string; name: string; icon: string | null } | null> {
  const cacheKey = `${botToken}:${guildId}`;
  const cached = guildInfoCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const res = await fetch(`https://discord.com/api/guilds/${guildId}`, { headers: { Authorization: `Bot ${botToken}` } });
  if (!res.ok) return null;
  const guild = await res.json();
  const value = { id: guild.id, name: guild.name, icon: guildIconUrl(guild) };
  guildInfoCache.set(cacheKey, { value, expiresAt: Date.now() + GUILD_INFO_TTL_MS });
  return value;
}

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export async function imageUrlToDataUri(url: string): Promise<{ dataUri: string } | { error: 'fetch_failed' | 'too_large' }> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    return { error: 'fetch_failed' };
  }
  if (!res.ok) return { error: 'fetch_failed' };

  const contentType = res.headers.get('content-type') ?? 'image/png';
  if (!contentType.startsWith('image/')) return { error: 'fetch_failed' };

  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_AVATAR_BYTES) return { error: 'too_large' };

  const bytes = new Uint8Array(buf);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return { dataUri: `data:${contentType};base64,${btoa(binary)}` };
}

export async function fileToDataUri(file: File): Promise<{ dataUri: string } | { error: 'too_large' | 'fetch_failed' }> {
  if (!file.type.startsWith('image/')) return { error: 'fetch_failed' };
  if (file.size > MAX_AVATAR_BYTES) return { error: 'too_large' };

  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return { dataUri: `data:${file.type};base64,${btoa(binary)}` };
}

export async function setBotGuildProfile(guildId: string, botToken: string, patch: { nick?: string | null; avatarDataUri?: string | null; bannerDataUri?: string | null; bio?: string | null }): Promise<boolean> {
  const body: Record<string, unknown> = {};
  if (patch.nick !== undefined) body.nick = patch.nick;
  if (patch.avatarDataUri !== undefined) body.avatar = patch.avatarDataUri;
  if (patch.bannerDataUri !== undefined) body.banner = patch.bannerDataUri;
  if (patch.bio !== undefined) body.bio = patch.bio;

  const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/@me`, {
    method: 'PATCH',
    headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.ok;
}

export async function getGuildMemberSelf(guildId: string, botToken: string, botUserId: string): Promise<{ nick: string | null; avatarUrl: string | null; bannerUrl: string | null } | null> {
  const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/${botUserId}`, { headers: { Authorization: `Bot ${botToken}` } });
  if (!res.ok) return null;
  const member = await res.json();
  const avatarUrl = member.avatar ? `https://cdn.discordapp.com/guilds/${guildId}/users/${member.user.id}/avatars/${member.avatar}.png?size=128` : null;
  const bannerUrl = member.banner ? `https://cdn.discordapp.com/guilds/${guildId}/users/${member.user.id}/banners/${member.banner}.png?size=512` : null;
  return { nick: member.nick ?? null, avatarUrl, bannerUrl };
}

export async function getBotProfile(botToken: string): Promise<{ id: string; username: string; avatarUrl: string | null; bannerUrl: string | null; accentColor: number | null } | null> {
  const res = await fetch('https://discord.com/api/users/@me', { headers: { Authorization: `Bot ${botToken}` } });
  if (!res.ok) return null;
  const user = await res.json();
  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128` : null,
    bannerUrl: user.banner ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=600` : null,
    accentColor: user.accent_color ?? null,
  };
}

export async function getBotDescription(botToken: string): Promise<string> {
  const res = await fetch('https://discord.com/api/applications/@me', { headers: { Authorization: `Bot ${botToken}` } });
  if (!res.ok) return '';
  const app = await res.json();
  return app.description ?? '';
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

export function renderDiscordEmojis(text: string): string {
  return text
    .split(/(<a?:\w+:\d+>)/g)
    .map((part) => {
      const m = part.match(/^<(a?):(\w+):(\d+)>$/);
      if (!m) return escapeHtml(part);
      const [, animated, name, id] = m;
      const ext = animated ? 'gif' : 'png';
      return `<img src="https://cdn.discordapp.com/emojis/${id}.${ext}?size=20" alt=":${name}:" class="inline-emoji" />`;
    })
    .join('');
}
