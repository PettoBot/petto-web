// The Discord cosmetics of the user card in the dashboard menu: the avatar decoration (the ring around the picture) and the nameplate
// (the picture behind the name). Plain JavaScript so scripts/check-dash-cosmetics.mjs runs it with node alone.
//
// Discord's `GET /users/@me` (scope identify) answers `avatar_decoration_data` ({ asset, sku_id, expires_at }) and
// `collectibles.nameplate` ({ asset, label, palette, sku_id }) when the user has them. The session keeps only the two asset strings and
// the palette name, and the page only gets addresses built here from strings that pass the checks below.

const CDN = 'https://cdn.discordapp.com';
/** Hash of an avatar decoration preset (for example `a_1f2e...`). */
const DECORATION_ASSET = /^[a-z0-9_-]{1,80}$/;
/** A folder of the nameplate files, like `nameplates/nameplates/twilight/` (a-z, 0-9, `_`, `-`, one to four parts). */
const NAMEPLATE_ASSET = /^(?:[a-z0-9_-]{1,40}\/){1,4}$/;

/** The colors of the nameplate palettes: [start, end] of the gradient behind the still picture and while it loads. */
export const NAMEPLATE_PALETTES = {
  crimson: ['#4d0a14', '#b3263f'],
  berry: ['#431240', '#a02f8c'],
  sky: ['#0e3558', '#3f94d6'],
  teal: ['#0a4343', '#2aa89b'],
  forest: ['#12351c', '#3d8c4f'],
  bubble_gum: ['#63203f', '#e57aa6'],
  violet: ['#2b1a58', '#7d5bd9'],
  cobalt: ['#102563', '#3a5bdc'],
  clover: ['#1d4419', '#72b847'],
  lemon: ['#5f510a', '#dcc22e'],
  white: ['#34373e', '#dcdee3'],
};
/** The gradient of a palette that is not in the list (a new one Discord adds later): a calm grey. */
export const DEFAULT_PALETTE = 'white';

/** The asset of an avatar decoration, or null when it is missing or not a plain asset string. @param {unknown} value */
export function cleanDecorationAsset(value) {
  return typeof value === 'string' && DECORATION_ASSET.test(value) ? value : null;
}

/** The folder of a nameplate (always ending in a slash), or null. @param {unknown} value */
export function cleanNameplateAsset(value) {
  if (typeof value !== 'string') return null;
  const text = value.endsWith('/') ? value : `${value}/`;
  return NAMEPLATE_ASSET.test(text) ? text : null;
}

/** The palette name, or the default one when it is unknown. @param {unknown} value */
export function cleanPalette(value) {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(NAMEPLATE_PALETTES, value) ? value : DEFAULT_PALETTE;
}

/**
 * What the session keeps of Discord's user object: two assets and a palette name. `null` means "checked, the user has none".
 * @param {any} user the answer of `GET /users/@me`
 * @returns {{ decoration: string | null, nameplate: { asset: string, palette: string } | null }}
 */
export function cosmeticsFromUser(user) {
  const decoration = cleanDecorationAsset(user?.avatar_decoration_data?.asset);
  const plate = user?.collectibles?.nameplate;
  const asset = cleanNameplateAsset(plate?.asset);
  return { decoration, nameplate: asset ? { asset, palette: cleanPalette(plate?.palette) } : null };
}

/** The address of an avatar decoration: the animated one (`passthrough=true`) or its still frame. @param {string} asset @param {boolean} animated */
export function decorationUrl(asset, animated) {
  const clean = cleanDecorationAsset(asset);
  return clean ? `${CDN}/avatar-decoration-presets/${clean}.png?size=96&passthrough=${animated ? 'true' : 'false'}` : null;
}

/** The addresses of a nameplate: the video and the still picture. @param {string} asset */
export function nameplateUrls(asset) {
  const clean = cleanNameplateAsset(asset);
  return clean ? { video: `${CDN}/assets/collectibles/${clean}asset.webm`, still: `${CDN}/assets/collectibles/${clean}static.png` } : null;
}

/**
 * Everything the user card draws from a session: a name, a picture and, only when the user has them, the decoration and the nameplate.
 * Never an id, a token or a time. Every address is built here from validated strings.
 * @param {{ username?: unknown, avatar?: unknown, decoration?: unknown, nameplate?: { asset?: unknown, palette?: unknown } | null } | null | undefined} session
 */
export function userCardData(session) {
  const s = session && typeof session === 'object' ? session : {};
  const name = typeof s.username === 'string' ? s.username.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 80) : '';
  const avatar = typeof s.avatar === 'string' && /^https:\/\/cdn\.discordapp\.com\/(?:avatars|embed\/avatars)\/[\w./-]+(?:\?[\w=&]*)?$/.test(s.avatar) ? s.avatar : null;
  const asset = cleanDecorationAsset(s.decoration);
  const plate = s.nameplate && typeof s.nameplate === 'object' ? nameplateUrls(/** @type {any} */ (s.nameplate).asset) : null;
  const [from, to] = NAMEPLATE_PALETTES[cleanPalette(s.nameplate && /** @type {any} */ (s.nameplate).palette)];
  return {
    name,
    avatar,
    decoration: asset ? { animated: decorationUrl(asset, true), still: decorationUrl(asset, false) } : null,
    nameplate: plate ? { video: plate.video, still: plate.still, from, to } : null,
  };
}
