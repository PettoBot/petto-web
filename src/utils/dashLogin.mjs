// The "Login required" card of /dash (components/DashLogin.astro): which notices it can show above the button and where its buttons go.
// Plain JavaScript so scripts/check-dash-login.mjs can check these rules with node alone.

/** Where the Login button goes: the Discord login of the site, which comes back to the list of servers (or to the page that asked for it). */
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

/** Where a visitor who is already logged in goes from /dash: the list of servers, which says "Discord did not answer" itself. @param {unknown} raw */
export function managePath(raw) {
  return raw === 'discord_unavailable' ? '/dash/manage?error=discord_unavailable' : '/dash/manage';
}

/** The home page of the site in the language of the card ('' prefix for English). @param {string} lang */
export function homeHref(lang) {
  return lang === 'es' ? '/es/' : lang === 'pt-BR' ? '/pt-br/' : '/';
}
