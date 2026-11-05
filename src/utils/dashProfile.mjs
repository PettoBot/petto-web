// What the dashboard draws about a Discord account and a server: the banner of the menu header, the account facts of the profile
// overview (/dash/me) and the checks behind them. Plain JavaScript so scripts/check-dash-profile.mjs runs it with node alone.
//
// Discord's `GET /users/@me` (scope identify) answers `banner` (a hash, `a_` first when animated), `accent_color` (an integer) and the
// user name. The session keeps only those, validated here, and every address is built here from a validated hash and a numeric id on
// cdn.discordapp.com, never from text the account holder wrote.

const CDN = 'https://cdn.discordapp.com';
/** A banner hash: 32 hex digits, with `a_` in front when the picture is animated. */
const BANNER_HASH = /^(?:a_)?[0-9a-f]{32}$/;
const SNOWFLAKE = /^\d{15,25}$/;
const HANDLE = /^[A-Za-z0-9_.]{2,32}$/;
const DISCORD_EPOCH = 1420070400000n;

/** The hash of a banner, or null when it is missing or not a plain hash. @param {unknown} value */
export function cleanBannerHash(value) {
  return typeof value === 'string' && BANNER_HASH.test(value) ? value : null;
}

/** An id of Discord (digits only), or null. @param {unknown} value */
export function cleanSnowflake(value) {
  return typeof value === 'string' && SNOWFLAKE.test(value) ? value : null;
}

/** The accent color of an account: an integer from 0 to 0xFFFFFF, or null. @param {unknown} value */
export function cleanAccentColor(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 0xffffff ? value : null;
}

/** `#rrggbb` of an accent color. @param {number} value */
export function accentHex(value) {
  return `#${value.toString(16).padStart(6, '0')}`;
}

/**
 * What the session keeps of Discord's user object besides the cosmetics: the @username, the banner hash and the accent color.
 * `null` means "checked, the account has none".
 * @param {any} user the answer of `GET /users/@me`
 * @returns {{ handle: string | null, banner: string | null, accentColor: number | null }}
 */
export function profileFromUser(user) {
  const handle = typeof user?.username === 'string' && HANDLE.test(user.username) ? user.username : null;
  return { handle, banner: cleanBannerHash(user?.banner), accentColor: cleanAccentColor(user?.accent_color) };
}

/** The picture of a server banner (a still frame even when it is animated), or null. @param {unknown} guildId @param {unknown} hash */
export function guildBannerUrl(guildId, hash) {
  const id = cleanSnowflake(guildId);
  const clean = cleanBannerHash(hash);
  return id && clean ? `${CDN}/banners/${id}/${clean}.webp?size=600` : null;
}

/**
 * The pictures of an account banner: the still one and, only for an animated banner (`a_`), the animated GIF. The page uses the GIF only
 * when the visitor does not ask for reduced motion.
 * @param {unknown} userId @param {unknown} hash
 * @returns {{ still: string, animated: string | null } | null}
 */
export function userBannerUrls(userId, hash) {
  const id = cleanSnowflake(userId);
  const clean = cleanBannerHash(hash);
  if (!id || !clean) return null;
  const base = `${CDN}/banners/${id}/${clean}`;
  return clean.startsWith('a_') ? { still: `${base}.png?size=600`, animated: `${base}.gif?size=600` } : { still: `${base}.webp?size=600`, animated: null };
}

/**
 * What fills the banner of a menu header: the picture when there is one, otherwise the account color as a gradient, otherwise the Petto art.
 * @typedef {{ kind: 'image', still: string, animated: string | null } | { kind: 'color', color: string } | { kind: 'art' }} HeaderArt
 */

/** The header art of a server: its banner, or the Petto art. @param {{ id?: unknown, banner?: unknown } | null | undefined} guild @returns {HeaderArt} */
export function guildHeaderArt(guild) {
  const still = guildBannerUrl(guild?.id, guild?.banner);
  return still ? { kind: 'image', still, animated: null } : { kind: 'art' };
}

/** The header art of an account: its banner, else its accent color, else the Petto art. @param {{ userId?: unknown, banner?: unknown, accentColor?: unknown } | null | undefined} session @returns {HeaderArt} */
export function userHeaderArt(session) {
  const pictures = userBannerUrls(session?.userId, session?.banner);
  if (pictures) return { kind: 'image', ...pictures };
  const color = cleanAccentColor(session?.accentColor);
  return color === null ? { kind: 'art' } : { kind: 'color', color: accentHex(color) };
}

/** The moment an account (or any Discord id) was created, read from its snowflake, or null. @param {unknown} id @returns {Date | null} */
export function snowflakeDate(id) {
  const clean = cleanSnowflake(id);
  if (!clean) return null;
  const date = new Date(Number((BigInt(clean) >> 22n) + DISCORD_EPOCH));
  return Number.isNaN(date.getTime()) ? null : date;
}

const PREMIUM_STATES = ['free', 'pending', 'active', 'past_due', 'canceled', 'expired'];

/**
 * The facts of the profile overview, from what the dashboard already has: the session, the servers Discord lists for the account, the
 * servers Petto is in, the Premium snapshot and the few personal rows the bot keeps. Nothing is invented: what is missing is null.
 * @param {{
 *   session: { userId?: unknown, username?: unknown, handle?: unknown },
 *   servers: { mine: unknown[], invite: unknown[], total: { mine: number, invite: number } },
 *   premium?: { status?: unknown, slotsUsed?: unknown, slotsTotal?: unknown, periodEnd?: unknown } | null,
 *   prefix?: unknown,
 *   reputation?: { points?: unknown, servers?: unknown } | null,
 *   top?: number,
 * }} input
 */
export function profileOverview({ session, servers, premium = null, prefix = null, reputation = null, top = 5 }) {
  const name = typeof session.username === 'string' ? session.username.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 80) : '';
  const handle = typeof session.handle === 'string' && HANDLE.test(session.handle) ? session.handle : null;
  const created = snowflakeDate(session.userId);
  const status = typeof premium?.status === 'string' && PREMIUM_STATES.includes(premium.status) ? premium.status : 'free';
  const count = (value) => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);
  const end = typeof premium?.periodEnd === 'string' ? new Date(premium.periodEnd) : null;
  const points = count(reputation?.points);
  const cleanPrefix = typeof prefix === 'string' ? prefix.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 8) : '';
  return {
    name,
    // The @username is shown only when it says something the display name does not.
    handle: handle && handle !== name ? handle : null,
    created: created ? created.toISOString() : null,
    servers: { withPetto: servers.total.mine, toInvite: servers.total.invite, managed: servers.total.mine + servers.total.invite, top: servers.mine.slice(0, top) },
    premium: { status, slotsUsed: count(premium?.slotsUsed), slotsTotal: count(premium?.slotsTotal), endsAt: end && !Number.isNaN(end.getTime()) && status === 'active' ? end.toISOString() : null },
    settings: { prefix: cleanPrefix || null, reputation: points > 0 ? { points, servers: Math.max(1, count(reputation?.servers)) } : null },
  };
}
