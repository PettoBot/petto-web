import { memoPerRequest } from './requestMemo';
import { nameStyleBody, nameStyleClearBodies, type NameStyle } from './nameStyle';
import { readGuildSnapshot, iconUrl, recentlyWritten, noteGuildWrite, snapshotEpoch, botLookKey } from './guildSnapshots';
import { cached, invalidate } from './sharedCache';
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

/** Lightweight guild lookup (name + icon only) via the bot token, shared by every dashboard section page for the sidebar/breadcrumb without repeating the full stats fetch each time. */
const GUILD_INFO_TTL_MS = 20_000;
const guildInfoCache = new Map<string, { value: { id: string; name: string; icon: string | null }; expiresAt: number; epoch: number }>();

export async function getGuildInfo(guildId: string, botToken: string): Promise<{ id: string; name: string; icon: string | null } | null> {
  const cacheKey = `${botToken}:${guildId}`;
  const cached = guildInfoCache.get(cacheKey);
  // A copy the bot saved again (or a change made from here) drops the name and icon kept from the old one.
  const epoch = snapshotEpoch(guildId);
  if (cached && cached.expiresAt > Date.now() && cached.epoch === epoch) return cached.value;

  const saved = await readGuildSnapshot(guildId);
  if (saved) {
    const value = { id: saved.id, name: saved.name, icon: iconUrl(saved.id, saved.icon) };
    guildInfoCache.set(cacheKey, { value, expiresAt: Date.now() + GUILD_INFO_TTL_MS, epoch });
    return value;
  }

  const res = await fetch(`https://discord.com/api/guilds/${guildId}`, { headers: { Authorization: `Bot ${botToken}` } });
  if (!res.ok) return null;
  const guild = await res.json();
  const value = { id: guild.id, name: guild.name, icon: guildIconUrl(guild) };
  guildInfoCache.set(cacheKey, { value, expiresAt: Date.now() + GUILD_INFO_TTL_MS, epoch });
  return value;
}

/**
 * The server as Discord's `GET /guilds/{id}?with_counts=true` shows it, for the pages that need its counts, banner, emojis
 * or boosts. Built from the bot's saved copy when there is one, and asked from Discord otherwise. `null` when the bot is
 * not in the server.
 */
export async function getGuildDetails(guildId: string, botToken: string): Promise<any | null> {
  const saved = await readGuildSnapshot(guildId);
  if (saved) {
    return {
      id: saved.id,
      name: saved.name,
      icon: saved.icon,
      banner: saved.banner,
      owner_id: saved.ownerId,
      approximate_member_count: saved.memberCount,
      roles: saved.roles,
      emojis: Array.from({ length: saved.emojiCount }, () => ({})),
      premium_tier: saved.premiumTier,
      premium_subscription_count: saved.boostCount,
    };
  }
  const res = await fetch(`https://discord.com/api/guilds/${guildId}?with_counts=true`, { headers: { Authorization: `Bot ${botToken}` } });
  return res.ok ? res.json() : null;
}

const GUILD_LIST_TTL_MS = 15_000;
const guildListCache = new Map<string, { status: number; text: string; expiresAt: number }>();

/**
 * Roles or channels of a server, as a Response. Every dashboard page asks for the same lists, so a
 * short cache turns page-to-page navigation into zero Discord calls. A change made in Discord from the
 * dashboard (see noteGuildWrite) skips the cache for a few seconds, so the page that follows shows it.
 * Only finished results are shared between requests. A Worker cannot wait on a fetch that another
 * request started, so a request that finds nothing cached always makes its own call.
 */
export async function getGuildList(astro: { request?: Request }, guildId: string, botToken: string, kind: 'roles' | 'channels'): Promise<Response> {
  const key = `${botToken}:${guildId}:${kind}`;
  // Right after a change made in Discord from here (a channel, a webhook, the bot's look) the saved copy is behind, so Discord is
  // asked. Any other save (a setting stored in the database) reads the copy like a normal page.
  const changed = recentlyWritten(guildId);
  const hit = guildListCache.get(key);
  if (!changed && hit && hit.expiresAt > Date.now()) return new Response(hit.text, { status: hit.status });

  if (!changed) {
    const saved = await readGuildSnapshot(guildId);
    if (saved) {
      return new Response(JSON.stringify(kind === 'roles' ? saved.roles : saved.channels), { status: 200 });
    }
  }

  const res = await fetch(`https://discord.com/api/guilds/${guildId}/${kind}`, { headers: { Authorization: `Bot ${botToken}` } });
  const text = await res.text();
  if (res.status === 200) guildListCache.set(key, { status: res.status, text, expiresAt: Date.now() + GUILD_LIST_TTL_MS });
  return new Response(text, { status: res.status });
}

const BOT_IDENTITY_TTL_MS = 10 * 60_000;
// The bot's own name and avatar (the same in every server) change rarely; they are asked from Discord once in a while, not on every page.
const BOT_PROFILE_TTL_MS = 10 * 60_000;
// After that time an old answer is still shown at once while a new one is read in the background (a page never waits for Discord for it).
const BOT_LOOK_STALE_MS = 24 * 3600_000;
// Kept in Redis too, so the first pages after a restart do not wait for Discord either.
const botProfileKey = (botToken: string) => `bot-profile:${botToken.split('.')[0]}`;
function getBotProfileCached(botToken: string) {
  return cached(botProfileKey(botToken), () => getBotProfile(botToken), { freshMs: BOT_PROFILE_TTL_MS, staleMs: BOT_LOOK_STALE_MS, allowStale: true, shared: true, keep: (value) => value !== null });
}

/** Reads the bot's profile ahead (the server does it as it starts), so the first page of a server does not wait for Discord for it. */
export function warmBotProfile(botToken: string): Promise<void> {
  return getBotProfileCached(botToken).then(() => undefined, () => undefined);
}
const botIdentityCache = new Map<string, { value: { name: string; icon: string | null }; expiresAt: number }>();

/**
 * How the bot looks in one server: its server nickname and avatar when it has them, otherwise its
 * global name and avatar. Used to draw message previews the way members will see the bot.
 * The bot's user id is the first part of its token, so both reads start at once.
 */
export function getBotIdentity(guildId: string, botToken: string, request?: Request): Promise<{ name: string; icon: string | null } | null> {
  return memoPerRequest(request, `bot-identity:${guildId}`, () => loadBotIdentity(guildId, botToken));
}

const botIdentityLoading = new Map<string, Promise<{ name: string; icon: string | null } | null>>();

async function loadBotIdentity(guildId: string, botToken: string): Promise<{ name: string; icon: string | null } | null> {
  const key = `${botToken}:${guildId}`;
  const hit = botIdentityCache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value;
  let loading = botIdentityLoading.get(key);
  if (!loading) {
    loading = readBotIdentity(guildId, botToken).finally(() => botIdentityLoading.delete(key));
    botIdentityLoading.set(key, loading);
  }
  // An older answer is shown at once while the new one is read (every page of the server waited for Discord every ten minutes).
  if (hit && hit.expiresAt + BOT_LOOK_STALE_MS > Date.now()) {
    void loading.catch(() => null);
    return hit.value;
  }
  return loading;
}

async function readBotIdentity(guildId: string, botToken: string): Promise<{ name: string; icon: string | null } | null> {
  const key = `${botToken}:${guildId}`;

  let botId = '';
  try { botId = atob(botToken.split('.')[0]); } catch { return null; }
  if (!/^\d{15,22}$/.test(botId)) return null;

  // How the bot looks in this server is part of the bot's saved copy of it; Discord is asked only without one.
  const saved = await readGuildSnapshot(guildId);
  const [profile, member] = await Promise.all([
    getBotProfileCached(botToken).catch(() => null),
    saved
      ? Promise.resolve({ nick: saved.botNick, avatarUrl: saved.botAvatar ? `https://cdn.discordapp.com/guilds/${guildId}/users/${botId}/avatars/${saved.botAvatar}.png?size=128` : null, bannerUrl: null })
      : getGuildMemberSelf(guildId, botToken, botId).catch(() => null),
  ]);
  if (!profile && !member) return null;
  const value = { name: member?.nick || profile?.username || 'Petto', icon: member?.avatarUrl || profile?.avatarUrl || null };
  botIdentityCache.set(key, { value, expiresAt: Date.now() + BOT_IDENTITY_TTL_MS });
  return value;
}

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const IMAGE_FETCH_TIMEOUT_MS = 8_000;
// Discord answers a profile change in a second or two; one that does not answer in this time is reported as not applied.
const DISCORD_WRITE_TIMEOUT_MS = 15_000;

/** Fetches an image URL server-side and returns it as a `data:` URI, the format Discord's member-avatar endpoint expects. Returns null on any failure so callers can show a clean error instead of a stack trace. */
export async function imageUrlToDataUri(url: string): Promise<{ dataUri: string } | { error: 'fetch_failed' | 'too_large' }> {
  // A host that never answers must not keep the save waiting: the image has a few seconds, the body included.
  const signal = AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return { error: 'fetch_failed' };

    const contentType = res.headers.get('content-type') ?? 'image/png';
    if (!contentType.startsWith('image/')) return { error: 'fetch_failed' };

    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_AVATAR_BYTES) return { error: 'too_large' };
    return { dataUri: `data:${contentType};base64,${Buffer.from(buf).toString('base64')}` };
  } catch {
    return { error: 'fetch_failed' };
  }
}

/** Converts an uploaded file (from a multipart form) to a `data:` URI, the counterpart to `imageUrlToDataUri` for the "upload instead of link" path. */
export async function fileToDataUri(file: File): Promise<{ dataUri: string } | { error: 'too_large' | 'fetch_failed' }> {
  if (!file.type.startsWith('image/')) return { error: 'fetch_failed' };
  if (file.size > MAX_AVATAR_BYTES) return { error: 'too_large' };

  const buf = await file.arrayBuffer();
  return { dataUri: `data:${file.type};base64,${Buffer.from(buf).toString('base64')}` };
}

/**
 * Sets the bot's own nickname, per-guild avatar, per-guild banner and/or per-guild bio in a
 * specific server, via `PATCH /guilds/{id}/members/@me`. `bio` is a real, documented field on
 * this endpoint (Discord's "guild member bio"), a genuine per-server override, not something we
 * invented. Pass a field as `null` to clear it back to the bot's global default.
 */
export async function setBotGuildProfile(guildId: string, botToken: string, patch: { nick?: string | null; avatarDataUri?: string | null; bannerDataUri?: string | null; bio?: string | null }): Promise<boolean> {
  const body: Record<string, unknown> = {};
  if (patch.nick !== undefined) body.nick = patch.nick;
  if (patch.avatarDataUri !== undefined) body.avatar = patch.avatarDataUri;
  if (patch.bannerDataUri !== undefined) body.banner = patch.bannerDataUri;
  if (patch.bio !== undefined) body.bio = patch.bio;

  botIdentityCache.delete(`${botToken}:${guildId}`);
  forgetMemberSelf(guildId);
  // The bot's global profile (getBotProfileCached) does not change with its look in one server.
  const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/@me`, {
    method: 'PATCH',
    headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(DISCORD_WRITE_TIMEOUT_MS),
  }).catch(() => null);
  // The bot's look in this server changed in Discord: its saved copy is behind until the bot saves it again.
  noteGuildWrite(guildId);
  forgetMemberSelf(guildId);
  return Boolean(res?.ok);
}

/**
 * Sets, or clears with `null`, the display name style of the bot in one server. Its own call: the fields are not in
 * Discord's documentation, so when Discord refuses them the nickname, avatar, banner and bio are not affected.
 */
export async function setBotNameStyle(guildId: string, botToken: string, style: NameStyle | null): Promise<boolean> {
  botIdentityCache.delete(`${botToken}:${guildId}`);
  forgetMemberSelf(guildId);
  const send = async (body: Record<string, unknown>) => {
    const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/@me`, {
      method: 'PATCH',
      headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(DISCORD_WRITE_TIMEOUT_MS),
    }).catch(() => null);
    noteGuildWrite(guildId);
    forgetMemberSelf(guildId);
    return Boolean(res?.ok);
  };
  if (style) return send(nameStyleBody(style));
  // Clearing: Discord does not document these fields, so the accepted way of saying "no style" is tried in order.
  for (const body of nameStyleClearBodies()) if (await send(body)) return true;
  return false;
}

/**
 * The bot's own per-guild nickname/avatar/banner override, read live from Discord instead of a
 * cached copy. `GET /guilds/{id}/members/@me` isn't a real bot-token route (only the PATCH form
 * of `@me` is), so this fetches the member by the bot's own user id instead. Doesn't cover `bio`:
 * confirmed live that Discord accepts and applies it via PATCH but never returns it from GET, so
 * there's no live source for it, our own database has to be the read-back for that one field.
 */
// How the bot looks in a server, from Discord. It changes only when someone changes it, so it is kept ten minutes and, after that, shown
// at once for up to a day while it is read again in the background (the Customize page asked Discord once a minute). It is read again:
// - the moment the dashboard changes the bot's look (setBotGuildProfile, setBotNameStyle: forgotten here and in Redis, and read straight
//   from Discord for the few seconds after the change);
// - when the bot's own copy of the server (petto:snap) shows another nickname or avatar than the one it showed when this was read, which
//   is how a change made in Discord or by the bot reaches the page.
const MEMBER_SELF_FRESH_MS = 10 * 60_000;
const MEMBER_SELF_STALE_MS = 24 * 3600_000;
const lookChangedAt = new Map<string, number>();
type MemberSelf = { nick: string | null; avatarUrl: string | null; bannerUrl: string | null };
type KeptMemberSelf = MemberSelf & { botUserId: string; snap: string };

export async function getGuildMemberSelf(guildId: string, botToken: string, botUserId: string): Promise<MemberSelf | null> {
  if (recentlyWritten(guildId)) return readGuildMemberSelf(guildId, botToken, botUserId);
  const saved = await readGuildSnapshot(guildId).catch(() => null);
  const snap = saved ? `${saved.botNick ?? ''}|${saved.botAvatar ?? ''}` : '';
  const load = () => {
    let started = 0;
    return cached<KeptMemberSelf | null>(
      botLookKey(guildId),
      async () => {
        started = Date.now();
        const read = await readGuildMemberSelf(guildId, botToken, botUserId);
        return read ? { ...read, botUserId, snap } : null;
      },
      // A read that began before the last change may answer the old look: it is shown but not kept.
      { freshMs: MEMBER_SELF_FRESH_MS, staleMs: MEMBER_SELF_STALE_MS, allowStale: true, shared: true, keep: (read) => read !== null && started >= (lookChangedAt.get(guildId) ?? 0) },
    ).catch(() => null);
  };
  let value = await load();
  if (value && (value.botUserId !== botUserId || (snap && value.snap !== snap))) {
    await invalidate(botLookKey(guildId)).catch(() => {});
    value = await load();
  }
  return value ? { nick: value.nick, avatarUrl: value.avatarUrl, bannerUrl: value.bannerUrl } : null;
}

function forgetMemberSelf(guildId: string): void {
  if (lookChangedAt.size > 5000) lookChangedAt.clear();
  lookChangedAt.set(guildId, Date.now());
  void invalidate(botLookKey(guildId)).catch(() => {});
}

/** The bot's id, which is the first part of its token (null when the token does not look like one). */
export function botUserIdFromToken(botToken: string): string | null {
  try {
    const value = atob(botToken.split('.')[0]);
    return /^\d{15,22}$/.test(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Whether the bot has its own avatar or banner in this server, asked to Discord itself (never a kept copy) because this decides whether
 * something must be taken off. A picture that was uploaded keeps no link in our database, so the database cannot say. null when Discord
 * cannot be asked.
 */
export async function getGuildLookOverrides(guildId: string, botToken: string): Promise<{ avatar: boolean; banner: boolean } | null> {
  const botId = botUserIdFromToken(botToken);
  if (!botId) return null;
  try {
    const read = await readGuildMemberSelf(guildId, botToken, botId);
    return read ? { avatar: Boolean(read.avatarUrl), banner: Boolean(read.bannerUrl) } : null;
  } catch {
    return null;
  }
}

async function readGuildMemberSelf(guildId: string, botToken: string, botUserId: string): Promise<{ nick: string | null; avatarUrl: string | null; bannerUrl: string | null } | null> {
  const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/${botUserId}`, { headers: { Authorization: `Bot ${botToken}` }, signal: AbortSignal.timeout(DISCORD_WRITE_TIMEOUT_MS) });
  if (!res.ok) return null;
  const member = await res.json();
  const avatarUrl = member.avatar ? `https://cdn.discordapp.com/guilds/${guildId}/users/${member.user.id}/avatars/${member.avatar}.png?size=128` : null;
  const bannerUrl = member.banner ? `https://cdn.discordapp.com/guilds/${guildId}/users/${member.user.id}/banners/${member.banner}.png?size=512` : null;
  return { nick: member.nick ?? null, avatarUrl, bannerUrl };
}

/** Global bot profile (applies in every server, not just one): username, default avatar, and profile banner. */
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

/** The application description shown under the bot's tag in Discord's profile popout, read-only here on purpose: it's global to every server, an admin in one guild shouldn't be able to deface it for everyone else. */
export async function getBotDescription(botToken: string): Promise<string> {
  const res = await fetch('https://discord.com/api/applications/@me', { headers: { Authorization: `Bot ${botToken}` } });
  if (!res.ok) return '';
  const app = await res.json();
  return app.description ?? '';
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

/** Discord custom-emoji tokens (`<:name:id>`, `<a:name:id>`) don't render as text, Discord's client swaps them for the actual emoji image. Do the same here so descriptions that use them show correctly instead of raw markup. Everything outside a matched token is HTML-escaped, so admin-entered text can't inject markup. */
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

/** Makes the bot leave a server (`DELETE /users/@me/guilds/{id}`). Returns true when Discord accepts it. */
export async function leaveGuild(guildId: string, botToken: string): Promise<boolean> {
  try {
    const res = await fetch(`https://discord.com/api/v10/users/@me/guilds/${encodeURIComponent(guildId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bot ${botToken}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
