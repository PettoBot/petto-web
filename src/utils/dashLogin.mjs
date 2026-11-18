// The "Login required" card of /dash (components/DashLogin.astro): which notices it can show above the button and where its buttons go.
// Plain JavaScript so scripts/check-dash-login.mjs can check these rules with node alone.

/** Where the Login button goes: the Discord login of the site, which comes back to the profile (or to the page that asked for it). */
export const LOGIN_HREF = '/dash/login';

/** Every `?error=` code that sends a visitor to /dash (the login callback, the login route, the checkout and the server pages). */
export const LOGIN_ERRORS = [
  'missing_code',
  'token_exchange_failed',
  'user_fetch_failed',
  'login_failed',
  'server_not_configured',
  'no_access',
  'bot_not_in_guild',
  'discord_unavailable',
];

/** The codes that are Discord's doing (the card shows the Discord icon for them instead of a warning). */
export const DISCORD_ERRORS = ['missing_code', 'token_exchange_failed', 'user_fetch_failed', 'discord_unavailable'];

/** Every `?notice=` code the card can show as an information banner (not an error). */
export const LOGIN_INFO = ['relogin'];

/**
 * The info banner of the card for `?notice=` (or for a rejected old session): a known code or null. Never repeats the text of the address.
 * @param {unknown} raw
 * @returns {string | null}
 */
export function loginInfo(raw) {
  return typeof raw === 'string' && LOGIN_INFO.includes(raw) ? raw : null;
}

/**
 * What the card says for the `error` of the address: a known code, 'unknown' for any other text (the card then says something went wrong),
 * or null when there is no error. Anything that is not a known code is never repeated on the page.
 * @param {unknown} raw
 * @returns {string | null}
 */
export function loginNotice(raw) {
  if (typeof raw !== 'string' || raw === '') return null;
  return LOGIN_ERRORS.includes(raw) ? raw : 'unknown';
}

/** @param {unknown} raw */
export function isDiscordNotice(raw) {
  return typeof raw === 'string' && DISCORD_ERRORS.includes(raw);
}

/** Where a visitor who is already logged in goes from /dash (and where a plain login lands): their profile, which says "Discord did not answer" itself. */
export const LANDING_PATH = '/dash/me';

/** @param {unknown} _raw */
export function landingPath(_raw) {
  return LANDING_PATH;
}

/** The home page of the site in the language of the card ('' prefix for English). @param {string} lang */
export function homeHref(lang) {
  return lang === 'es' ? '/es/' : lang === 'pt-BR' ? '/pt-br/' : '/';
}

// ---- The question "do you want Petto to add you to the support server?" before the dashboard login.
// Discord only lets Petto add somebody to a server when they allow it on its own screen (the scope `guilds.join`), so the login asks first and
// asks Discord for that scope only when the answer is yes. The question is asked once per browser (a cookie remembers that it was asked, not the
// answer: a person who left the server is never added again without being asked).

/** The scopes of the login: who you are and your servers, and, only when the visitor said yes, joining the support server. @param {boolean} joinSupport */
export function loginScope(joinSupport) {
  return joinSupport ? 'identify guilds guilds.join' : 'identify guilds';
}

/**
 * What /dash/login does with the answer of the address (`?support=yes|no`) and the cookie that says the question was already asked.
 * @param {{ answer?: unknown, asked?: unknown }} input
 * @returns {{ ask: boolean, join: boolean, remember: boolean }} `ask`: show the question first; `join`: ask Discord to add the visitor; `remember`: set the cookie
 */
export function supportChoice({ answer = null, asked = null } = {}) {
  if (answer === 'yes') return { ask: false, join: true, remember: true };
  if (answer === 'no') return { ask: false, join: false, remember: true };
  return { ask: asked !== '1', join: false, remember: false };
}
