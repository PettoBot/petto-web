import { g as getEnv } from './env_WnBvzCjc.mjs';
import { onSharedMessage, invalidate, sharedMessagesLive, sharedGetRaw, cached } from './sharedCache_DFk4ml3Q.mjs';
import { bumpGuildVersion } from './guildVersion_C-xSL97y.mjs';

const memos = /* @__PURE__ */ new WeakMap();
function memoPerRequest(request, key, load) {
  const method = String(request?.method ?? "GET").toUpperCase();
  if (!request || method !== "GET" && method !== "HEAD") return load();
  let byKey = memos.get(request);
  if (!byKey) memos.set(request, byKey = /* @__PURE__ */ new Map());
  let pending = byKey.get(key);
  if (!pending) {
    pending = load();
    byKey.set(key, pending);
    pending.catch(() => byKey?.delete(key));
  }
  return pending;
}

const NAME_FONTS = [
  { id: 11, label: "gg sans" },
  { id: 12, label: "Tempo" },
  { id: 3, label: "Sakura" },
  { id: 4, label: "Jellybean" },
  { id: 6, label: "Modern" },
  { id: 7, label: "Medieval" },
  { id: 8, label: "8bit" },
  { id: 10, label: "Vampyre" }
];
const LEGACY_FONT_IDS = { 1: 12 };
const NAME_FONT_STACKS = {
  11: "inherit",
  12: "'Zilla Slab', serif",
  // Tempo
  3: "'Cherry Bomb One', cursive",
  // Sakura
  4: "'Chicle', cursive",
  // Jellybean
  6: "'MuseoModerno', sans-serif",
  // Modern
  7: "'MedievalSharp', serif",
  // Medieval (Discord's is Néo-Castel, which is not on Google Fonts)
  8: "'Pixelify Sans', monospace",
  // 8bit
  10: "'Cormorant Garamond', serif"
  // Vampyre (Discord's is Sinistre, which is not on Google Fonts)
};
const NAME_EFFECTS = [
  { id: 1, label: "Solid", colors: 1 },
  { id: 2, label: "Gradient", colors: 2 },
  { id: 3, label: "Neon", colors: 1 },
  { id: 4, label: "Toon", colors: 1 },
  { id: 5, label: "Pop", colors: 1 },
  { id: 6, label: "Glow", colors: 1 }
];
const DEFAULT_NAME_STYLE = { fontId: 11, colors: [8624639, 16748994] };
const hexToInt = (hex) => /^#[0-9a-f]{6}$/i.test(hex.trim()) ? parseInt(hex.trim().slice(1), 16) : null;
const intToHex = (value) => `#${Math.max(0, Math.min(16777215, value)).toString(16).padStart(6, "0")}`;
function readNameStyle(raw) {
  if (!raw || typeof raw !== "object") return null;
  const value = raw;
  const font = NAME_FONTS.find((item) => item.id === (LEGACY_FONT_IDS[Number(value.fontId)] ?? Number(value.fontId)));
  const effect = NAME_EFFECTS.find((item) => item.id === Number(value.effectId));
  if (!font || !effect || !Array.isArray(value.colors)) return null;
  const colors = value.colors.map(Number).filter((color) => Number.isInteger(color) && color >= 0 && color <= 16777215);
  return colors.length === effect.colors ? { fontId: font.id, effectId: effect.id, colors } : null;
}
function parseNameStyleForm(form) {
  const effectId = Number(form.get("name_effect") ?? 0);
  if (!effectId) return { style: null };
  const effect = NAME_EFFECTS.find((item) => item.id === effectId);
  const font = NAME_FONTS.find((item) => item.id === Number(form.get("name_font") ?? 11));
  if (!effect || !font) return { error: "name_style_invalid" };
  const colors = [hexToInt(String(form.get("name_color_1") ?? ""))];
  if (effect.colors === 2) colors.push(hexToInt(String(form.get("name_color_2") ?? "")));
  if (colors.some((color) => color === null)) return { error: "name_style_invalid" };
  return { style: { fontId: font.id, effectId: effect.id, colors } };
}
const sameNameStyle = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function nameStyleBody(style) {
  return style ? { display_name_font_id: style.fontId, display_name_effect_id: style.effectId, display_name_colors: style.colors } : { display_name_font_id: 0, display_name_effect_id: 0, display_name_colors: [] };
}
function nameStyleClearBodies() {
  return [
    { display_name_font_id: null, display_name_effect_id: null, display_name_colors: null },
    { display_name_font_id: 0, display_name_effect_id: 0, display_name_colors: [] },
    { display_name_effect_id: 0, display_name_colors: [] }
  ];
}
function nameStyleCss(style) {
  if (!style) return "";
  const [first, second] = style.colors.map(intToHex);
  switch (style.effectId) {
    case 2:
      return `background:linear-gradient(90deg,${first},${second});-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;`;
    case 3:
      return `color:#fff;text-shadow:0 0 4px ${first},0 0 10px ${first},0 0 18px ${first};`;
    case 4:
      return `color:${first};-webkit-text-stroke:1px #000;text-shadow:1px 1px 0 #000;`;
    case 5:
      return `color:${first};text-shadow:2px 2px 0 color-mix(in srgb,${first} 45%,#000);`;
    case 6:
      return `color:${first};text-shadow:0 0 8px ${first};`;
    default:
      return `color:${first};`;
  }
}

let source = null;
function configureSnapshots(astro) {
  const url = getEnv(astro, "PETTO_BOT_API_URL");
  const key = getEnv(astro, "PETTO_BOT_API_SECRET");
  source = url && key ? { url, key } : null;
}
const GUILD_TTL_MS = 5e3;
const GUILD_TTL_SUBSCRIBED_MS = 6e4;
const WRITE_WINDOW_MS = 15e3;
const LIST_TTL_MS = 2e4;
let listCache = null;
const guildCache = /* @__PURE__ */ new Map();
const writes = /* @__PURE__ */ new Map();
const epochs = /* @__PURE__ */ new Map();
let subscribedNow = false;
function snapshotEpoch(guildId) {
  return epochs.get(guildId) ?? 0;
}
function botLookKey(guildId) {
  return `bot-look:${guildId}`;
}
function dropGuild(guildId) {
  guildCache.delete(guildId);
  epochs.set(guildId, snapshotEpoch(guildId) + 1);
  void invalidate(`emojis:${guildId}`).catch(() => {
  });
}
onSharedMessage("petto:snap", (message) => {
  const guildId = String(message).trim();
  if (!/^\d{5,25}$/.test(guildId)) return;
  dropGuild(guildId);
  void bumpGuildVersion(guildId).catch(() => {
  });
});
function forgetGuildSnapshot(guildId) {
  dropGuild(guildId);
}
function noteGuildWrite(guildId) {
  writes.set(guildId, Date.now());
  dropGuild(guildId);
}
function recentlyWritten(guildId) {
  const at = writes.get(guildId);
  if (at === void 0) return false;
  if (Date.now() - at < WRITE_WINDOW_MS) return true;
  writes.delete(guildId);
  return false;
}
function headers(key) {
  return { apikey: key, Authorization: `Bearer ${key}`, "X-Petto-Dashboard-Key": key, Accept: "application/json" };
}
function iconUrl(guildId, hash, size = 64) {
  return hash ? `https://cdn.discordapp.com/icons/${guildId}/${hash}.png?size=${size}` : null;
}
function fromRow(row) {
  return row && Array.isArray(row.channels) && Array.isArray(row.roles) ? { id: String(row.guild_id), name: String(row.name), icon: row.icon ?? null, ownerId: row.owner_id ?? null, memberCount: Number.isFinite(Number(row.member_count)) ? Number(row.member_count) : null, banner: row.banner ?? null, emojiCount: Number(row.emoji_count) || 0, premiumTier: Number(row.premium_tier) || 0, boostCount: Number(row.boost_count) || 0, botNick: row.bot_nick ?? null, botAvatar: row.bot_avatar ?? null, channels: row.channels, roles: row.roles } : null;
}
async function readFromRedis(guildId) {
  const raw = await sharedGetRaw(`petto:snap:${guildId}`).catch(() => null);
  if (!raw) return null;
  try {
    const row = JSON.parse(raw);
    const snapshot = fromRow(row);
    return snapshot && snapshot.id === guildId ? { snapshot, emojis: row.emojis } : null;
  } catch {
    return null;
  }
}
async function readGuildSnapshot(guildId) {
  if (!source || !/^\d{5,25}$/.test(guildId) || recentlyWritten(guildId)) return null;
  const hit = guildCache.get(guildId);
  if (hit && hit.expiresAt > Date.now()) return hit.value;
  const epoch = snapshotEpoch(guildId);
  const keep = (value) => {
    if (snapshotEpoch(guildId) !== epoch) return;
    guildCache.set(guildId, { value, expiresAt: Date.now() + (subscribedNow ? GUILD_TTL_SUBSCRIBED_MS : GUILD_TTL_MS) });
  };
  subscribedNow = await sharedMessagesLive().catch(() => false);
  const fromRedis = await readFromRedis(guildId);
  if (fromRedis) {
    keep(fromRedis.snapshot);
    return fromRedis.snapshot;
  }
  try {
    const res = await fetch(`${source.url}/rest/v1/discord_guild_snapshots?guild_id=eq.${guildId}&select=guild_id,name,icon,owner_id,member_count,banner,emoji_count,premium_tier,boost_count,bot_nick,bot_avatar,channels,roles`, { headers: headers(source.key) });
    if (!res.ok) return null;
    const rows = await res.json();
    const value = fromRow(Array.isArray(rows) ? rows[0] : null);
    keep(value);
    return value;
  } catch {
    return null;
  }
}
const EMOJI_COLUMN_RETRY_MS = 10 * 6e4;
let emojiColumnMissingUntil = 0;
function emojiList(raw) {
  if (!Array.isArray(raw) || !raw.length) return null;
  return raw.filter((emoji) => emoji?.id).map((emoji) => ({ id: String(emoji.id), name: String(emoji.name ?? ""), animated: Boolean(emoji.animated) }));
}
async function readSnapshotEmojis(guildId) {
  if (!source || !/^\d{5,25}$/.test(guildId)) return null;
  const fromRedis = await readFromRedis(guildId);
  const kept = fromRedis ? emojiList(fromRedis.emojis) : null;
  if (kept) return kept;
  if (Date.now() < emojiColumnMissingUntil) return null;
  try {
    const res = await fetch(`${source.url}/rest/v1/discord_guild_snapshots?guild_id=eq.${guildId}&select=emojis`, { headers: headers(source.key) });
    if (!res.ok) {
      emojiColumnMissingUntil = Date.now() + (res.status >= 500 ? 6e4 : EMOJI_COLUMN_RETRY_MS);
      return null;
    }
    const rows = await res.json();
    return emojiList(Array.isArray(rows) ? rows[0]?.emojis : null);
  } catch {
    return null;
  }
}
const HIDDEN_COLUMN_RETRY_MS = 10 * 6e4;
let hiddenColumnMissingUntil = 0;
async function readHiddenChannelIds(guildId) {
  if (!source || !/^\d{5,25}$/.test(guildId)) return [];
  const clean = (raw2) => Array.isArray(raw2) ? raw2.map((id) => String(id)).filter((id) => /^\d{5,25}$/.test(id)) : [];
  const raw = await sharedGetRaw(`petto:snap:${guildId}`).catch(() => null);
  if (raw) {
    try {
      const row = JSON.parse(raw);
      if (row && Array.isArray(row.hidden_channels)) return clean(row.hidden_channels);
    } catch {
    }
  }
  if (Date.now() < hiddenColumnMissingUntil) return [];
  try {
    const res = await fetch(`${source.url}/rest/v1/discord_guild_snapshots?guild_id=eq.${guildId}&select=hidden_channels`, { headers: headers(source.key) });
    if (!res.ok) {
      hiddenColumnMissingUntil = Date.now() + (res.status >= 500 ? 6e4 : HIDDEN_COLUMN_RETRY_MS);
      return [];
    }
    const rows = await res.json();
    return clean(Array.isArray(rows) ? rows[0]?.hidden_channels : null);
  } catch {
    return [];
  }
}
async function readBotGuildSnapshots() {
  if (!source) return null;
  if (listCache && listCache.expiresAt > Date.now()) return listCache.value;
  try {
    const res = await fetch(`${source.url}/rest/v1/discord_guild_snapshots?select=guild_id,name,icon,member_count`, { headers: headers(source.key) });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || !rows.length) return null;
    const value = rows.map((row) => ({ id: String(row.guild_id), name: String(row.name), icon: row.icon ?? null, memberCount: Number.isFinite(Number(row.member_count)) ? Number(row.member_count) : null }));
    listCache = { value, expiresAt: Date.now() + LIST_TTL_MS };
    return value;
  } catch {
    return null;
  }
}
function forgetGuildSnapshots() {
  guildCache.clear();
  listCache = null;
}

const MANAGE_GUILD = 0x20n;
const ADMINISTRATOR = 0x8n;
function canManageGuild(guild) {
  if (guild.owner) return true;
  const perms = BigInt(guild.permissions ?? "0");
  return (perms & MANAGE_GUILD) === MANAGE_GUILD || (perms & ADMINISTRATOR) === ADMINISTRATOR;
}
function guildIconUrl(guild, size = 64) {
  return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=${size}` : null;
}
const GUILD_INFO_TTL_MS = 2e4;
const guildInfoCache = /* @__PURE__ */ new Map();
async function getGuildInfo(guildId, botToken) {
  const cacheKey = `${botToken}:${guildId}`;
  const cached2 = guildInfoCache.get(cacheKey);
  const epoch = snapshotEpoch(guildId);
  if (cached2 && cached2.expiresAt > Date.now() && cached2.epoch === epoch) return cached2.value;
  const saved = await readGuildSnapshot(guildId);
  if (saved) {
    const value2 = { id: saved.id, name: saved.name, icon: iconUrl(saved.id, saved.icon) };
    guildInfoCache.set(cacheKey, { value: value2, expiresAt: Date.now() + GUILD_INFO_TTL_MS, epoch });
    return value2;
  }
  const res = await fetch(`https://discord.com/api/guilds/${guildId}`, { headers: { Authorization: `Bot ${botToken}` } });
  if (!res.ok) {
    console.error(`[discord] the server ${guildId} could not be read: ${res.status} ${(await res.clone().text().catch(() => "")).replace(/\s+/g, " ").slice(0, 160)}`);
    return null;
  }
  const guild = await res.json();
  const value = { id: guild.id, name: guild.name, icon: guildIconUrl(guild) };
  guildInfoCache.set(cacheKey, { value, expiresAt: Date.now() + GUILD_INFO_TTL_MS, epoch });
  return value;
}
async function getGuildDetails(guildId, botToken) {
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
      premium_subscription_count: saved.boostCount
    };
  }
  const res = await fetch(`https://discord.com/api/guilds/${guildId}?with_counts=true`, { headers: { Authorization: `Bot ${botToken}` } });
  return res.ok ? res.json() : null;
}
const GUILD_LIST_TTL_MS = 15e3;
const guildListCache = /* @__PURE__ */ new Map();
async function getGuildList(astro, guildId, botToken, kind) {
  const key = `${botToken}:${guildId}:${kind}`;
  const changed = recentlyWritten(guildId);
  const hit = guildListCache.get(key);
  if (!changed && hit && hit.expiresAt > Date.now()) return new Response(hit.text, { status: hit.status });
  if (!changed) {
    const saved = await readGuildSnapshot(guildId);
    if (saved) {
      return new Response(JSON.stringify(kind === "roles" ? saved.roles : saved.channels), { status: 200 });
    }
  }
  try {
    const res = await fetch(`https://discord.com/api/guilds/${guildId}/${kind}`, { headers: { Authorization: `Bot ${botToken}` }, signal: AbortSignal.timeout(DISCORD_LIST_TIMEOUT_MS) });
    const text = await res.text();
    if (res.status === 200) guildListCache.set(key, { status: res.status, text, expiresAt: Date.now() + GUILD_LIST_TTL_MS });
    return new Response(text, { status: res.status });
  } catch {
    return new Response("[]", { status: 504 });
  }
}
const BOT_IDENTITY_TTL_MS = 10 * 6e4;
const BOT_PROFILE_TTL_MS = 10 * 6e4;
const BOT_LOOK_STALE_MS = 24 * 36e5;
const botProfileKey = (botToken) => `bot-profile:${botToken.split(".")[0]}`;
function getBotProfileCached(botToken) {
  return cached(botProfileKey(botToken), () => getBotProfile(botToken), { freshMs: BOT_PROFILE_TTL_MS, staleMs: BOT_LOOK_STALE_MS, allowStale: true, shared: true, keep: (value) => value !== null });
}
function warmBotProfile(botToken) {
  return getBotProfileCached(botToken).then(() => void 0, () => void 0);
}
const botIdentityCache = /* @__PURE__ */ new Map();
function getBotIdentity(guildId, botToken, request) {
  return memoPerRequest(request, `bot-identity:${guildId}`, () => loadBotIdentity(guildId, botToken));
}
const botIdentityLoading = /* @__PURE__ */ new Map();
async function loadBotIdentity(guildId, botToken) {
  const key = `${botToken}:${guildId}`;
  const hit = botIdentityCache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value;
  let loading = botIdentityLoading.get(key);
  if (!loading) {
    loading = readBotIdentity(guildId, botToken).finally(() => botIdentityLoading.delete(key));
    botIdentityLoading.set(key, loading);
  }
  if (hit && hit.expiresAt + BOT_LOOK_STALE_MS > Date.now()) {
    void loading.catch(() => null);
    return hit.value;
  }
  return loading;
}
async function readBotIdentity(guildId, botToken) {
  const key = `${botToken}:${guildId}`;
  let botId = "";
  try {
    botId = atob(botToken.split(".")[0]);
  } catch {
    return null;
  }
  if (!/^\d{15,22}$/.test(botId)) return null;
  const saved = await readGuildSnapshot(guildId);
  const [profile, member] = await Promise.all([
    getBotProfileCached(botToken).catch(() => null),
    saved ? Promise.resolve({ nick: saved.botNick, avatarUrl: saved.botAvatar ? `https://cdn.discordapp.com/guilds/${guildId}/users/${botId}/avatars/${saved.botAvatar}.png?size=128` : null, bannerUrl: null }) : getGuildMemberSelf(guildId, botToken, botId).catch(() => null)
  ]);
  if (!profile && !member) return null;
  const value = { name: member?.nick || profile?.username || "Petto", icon: member?.avatarUrl || profile?.avatarUrl || null };
  botIdentityCache.set(key, { value, expiresAt: Date.now() + BOT_IDENTITY_TTL_MS });
  return value;
}
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const IMAGE_FETCH_TIMEOUT_MS = 8e3;
const DISCORD_WRITE_TIMEOUT_MS = 15e3;
const DISCORD_LIST_TIMEOUT_MS = 8e3;
async function imageUrlToDataUri(url) {
  const signal = AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return { error: "fetch_failed" };
    const contentType = res.headers.get("content-type") ?? "image/png";
    if (!contentType.startsWith("image/")) return { error: "fetch_failed" };
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_AVATAR_BYTES) return { error: "too_large" };
    return { dataUri: `data:${contentType};base64,${Buffer.from(buf).toString("base64")}` };
  } catch {
    return { error: "fetch_failed" };
  }
}
async function fileToDataUri(file) {
  if (!file.type.startsWith("image/")) return { error: "fetch_failed" };
  if (file.size > MAX_AVATAR_BYTES) return { error: "too_large" };
  const buf = await file.arrayBuffer();
  return { dataUri: `data:${file.type};base64,${Buffer.from(buf).toString("base64")}` };
}
async function setBotGuildProfile(guildId, botToken, patch) {
  const body = {};
  if (patch.nick !== void 0) body.nick = patch.nick;
  if (patch.avatarDataUri !== void 0) body.avatar = patch.avatarDataUri;
  if (patch.bannerDataUri !== void 0) body.banner = patch.bannerDataUri;
  if (patch.bio !== void 0) body.bio = patch.bio;
  botIdentityCache.delete(`${botToken}:${guildId}`);
  forgetMemberSelf(guildId);
  const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/@me`, {
    method: "PATCH",
    headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(DISCORD_WRITE_TIMEOUT_MS)
  }).catch(() => null);
  noteGuildWrite(guildId);
  forgetMemberSelf(guildId);
  return Boolean(res?.ok);
}
async function setBotNameStyle(guildId, botToken, style) {
  botIdentityCache.delete(`${botToken}:${guildId}`);
  forgetMemberSelf(guildId);
  const send = async (body) => {
    const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/@me`, {
      method: "PATCH",
      headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(DISCORD_WRITE_TIMEOUT_MS)
    }).catch(() => null);
    noteGuildWrite(guildId);
    forgetMemberSelf(guildId);
    return Boolean(res?.ok);
  };
  if (style) return send(nameStyleBody(style));
  for (const body of nameStyleClearBodies()) if (await send(body)) return true;
  return false;
}
const MEMBER_SELF_FRESH_MS = 10 * 6e4;
const MEMBER_SELF_STALE_MS = 24 * 36e5;
const lookChangedAt = /* @__PURE__ */ new Map();
async function getGuildMemberSelf(guildId, botToken, botUserId) {
  if (recentlyWritten(guildId)) return readGuildMemberSelf(guildId, botToken, botUserId);
  const saved = await readGuildSnapshot(guildId).catch(() => null);
  const snap = saved ? `${saved.botNick ?? ""}|${saved.botAvatar ?? ""}` : "";
  const load = () => {
    let started = 0;
    return cached(
      botLookKey(guildId),
      async () => {
        started = Date.now();
        const read = await readGuildMemberSelf(guildId, botToken, botUserId);
        return read ? { ...read, botUserId, snap } : null;
      },
      // A read that began before the last change may answer the old look: it is shown but not kept.
      { freshMs: MEMBER_SELF_FRESH_MS, staleMs: MEMBER_SELF_STALE_MS, allowStale: true, shared: true, keep: (read) => read !== null && started >= (lookChangedAt.get(guildId) ?? 0) }
    ).catch(() => null);
  };
  let value = await load();
  if (value && (value.botUserId !== botUserId || snap && value.snap !== snap)) {
    await invalidate(botLookKey(guildId)).catch(() => {
    });
    value = await load();
  }
  return value ? { nick: value.nick, avatarUrl: value.avatarUrl, bannerUrl: value.bannerUrl } : null;
}
function forgetMemberSelf(guildId) {
  if (lookChangedAt.size > 5e3) lookChangedAt.clear();
  lookChangedAt.set(guildId, Date.now());
  void invalidate(botLookKey(guildId)).catch(() => {
  });
}
function botUserIdFromToken(botToken) {
  try {
    const value = atob(botToken.split(".")[0]);
    return /^\d{15,22}$/.test(value) ? value : null;
  } catch {
    return null;
  }
}
async function getGuildLookOverrides(guildId, botToken) {
  const botId = botUserIdFromToken(botToken);
  if (!botId) return null;
  try {
    const read = await readGuildMemberSelf(guildId, botToken, botId);
    return read ? { avatar: Boolean(read.avatarUrl), banner: Boolean(read.bannerUrl) } : null;
  } catch {
    return null;
  }
}
async function readGuildMemberSelf(guildId, botToken, botUserId) {
  const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/${botUserId}`, { headers: { Authorization: `Bot ${botToken}` }, signal: AbortSignal.timeout(DISCORD_WRITE_TIMEOUT_MS) });
  if (!res.ok) return null;
  const member = await res.json();
  const avatarUrl = member.avatar ? `https://cdn.discordapp.com/guilds/${guildId}/users/${member.user.id}/avatars/${member.avatar}.png?size=128` : null;
  const bannerUrl = member.banner ? `https://cdn.discordapp.com/guilds/${guildId}/users/${member.user.id}/banners/${member.banner}.png?size=512` : null;
  return { nick: member.nick ?? null, avatarUrl, bannerUrl };
}
async function getBotProfile(botToken) {
  const res = await fetch("https://discord.com/api/users/@me", { headers: { Authorization: `Bot ${botToken}` } });
  if (!res.ok) return null;
  const user = await res.json();
  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128` : null,
    bannerUrl: user.banner ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=600` : null,
    accentColor: user.accent_color ?? null
  };
}
async function getBotDescription(botToken) {
  const res = await fetch("https://discord.com/api/applications/@me", { headers: { Authorization: `Bot ${botToken}` } });
  if (!res.ok) return "";
  const app = await res.json();
  return app.description ?? "";
}
async function leaveGuild(guildId, botToken) {
  try {
    const res = await fetch(`https://discord.com/api/v10/users/@me/guilds/${encodeURIComponent(guildId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bot ${botToken}` }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export { getBotDescription as A, getGuildMemberSelf as B, readNameStyle as C, DEFAULT_NAME_STYLE as D, sameNameStyle as E, readHiddenChannelIds as F, forgetGuildSnapshot as G, configureSnapshots as H, LEGACY_FONT_IDS as L, NAME_EFFECTS as N, getGuildLookOverrides as a, setBotNameStyle as b, canManageGuild as c, guildIconUrl as d, getGuildList as e, forgetGuildSnapshots as f, getBotIdentity as g, readSnapshotEmojis as h, iconUrl as i, getGuildInfo as j, getGuildDetails as k, leaveGuild as l, memoPerRequest as m, noteGuildWrite as n, readGuildSnapshot as o, intToHex as p, nameStyleCss as q, readBotGuildSnapshots as r, setBotGuildProfile as s, NAME_FONT_STACKS as t, NAME_FONTS as u, fileToDataUri as v, warmBotProfile as w, imageUrlToDataUri as x, parseNameStyleForm as y, getBotProfile as z };
