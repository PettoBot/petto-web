// The login of the top bar, in one place for the server (api/session.ts), the bar itself (components/NavAccount.astro) and
// scripts/check-nav-account.mjs, which checks these rules. Plain JavaScript so the check runs with node alone.

/** Same-origin route the bar asks once after the page loads. Never cached. */
export const SESSION_ENDPOINT = '/api/session';
/** The support server invite the site already uses everywhere. */
export const SUPPORT_URL = 'https://petto.sbs/support';
/** What the tab remembers between pages so the profile shows at once (the answer of the endpoint still decides). */
export const CACHE_KEY = 'petto-nav-user';

const AVATAR_URL = /^https:\/\/cdn\.discordapp\.com\/(?:avatars|embed\/avatars)\/[\w./-]+(?:\?[\w=&]*)?$/;

/** The language prefix of the public site: '' for English. @param {string} lang */
export function prefixOf(lang) {
  return lang === 'es' ? '/es' : lang === 'pt-BR' ? '/pt-br' : '';
}

/** A name and a picture that are safe to draw, or null. @param {unknown} name @param {unknown} avatar */
function cleanUser(name, avatar) {
  const text = typeof name === 'string' ? name.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 80) : '';
  if (!text) return null;
  return { name: text, avatar: typeof avatar === 'string' && AVATAR_URL.test(avatar) ? avatar : null };
}

/**
 * The only part of a session the bar needs: a name and a picture. Never an id, a token or a time.
 * @param {{ username?: unknown, avatar?: unknown } | null | undefined} session
 * @returns {{ name: string, avatar: string | null } | null}
 */
export function publicUser(session) {
  return session && typeof session === 'object' ? cleanUser(session.username, session.avatar) : null;
}

/** The body of the endpoint: `{ user: null }` for a visitor (a normal answer, not an error). */
export function sessionAnswer(session) {
  return { user: publicUser(session) };
}

/**
 * What the bar shows for an answer of the endpoint (or for anything that is not one): the profile only for a well-formed user, the Login button otherwise.
 * @param {any} answer
 * @returns {{ state: 'user', user: { name: string, avatar: string | null } } | { state: 'guest', user: null }}
 */
export function accountState(answer) {
  const user = answer && typeof answer === 'object' && answer.user && typeof answer.user === 'object' ? cleanUser(answer.user.name, answer.user.avatar) : null;
  return user ? { state: 'user', user } : { state: 'guest', user: null };
}

/** The first letter shown on the round picture when the person has no avatar. @param {string} name */
export function initialOf(name) {
  const letter = Array.from(String(name).trim())[0] ?? '?';
  return letter.toLocaleUpperCase();
}

/** Where Login goes: the same Discord login the dashboard starts, which brings the visitor back to the list of servers. @param {string} lang */
export function loginHref(lang) {
  return `${prefixOf(lang)}/dash/login`;
}

/** The profile page of the dashboard (the card of the burger menu opens it). @param {string} lang */
export function profileHref(lang) {
  return `${prefixOf(lang)}/dash/me`;
}

/** The list of servers, where the dashboard starts. @param {string} lang */
export function dashboardHref(lang) {
  return `${prefixOf(lang)}/dash/manage`;
}

/**
 * The entries of the profile menu, in order. `key` is the name of the text in the site's translations (nav.account.<key>).
 * @param {string} lang
 * @returns {{ key: 'servers' | 'premium' | 'support' | 'logout', href: string, external: boolean, icon: string }[]}
 */
export function accountEntries(lang) {
  const prefix = prefixOf(lang);
  return [
    { key: 'servers', href: `${prefix}/dash/manage`, external: false, icon: 'ph:squares-four-fill' },
    { key: 'premium', href: `${prefix}/dash/premium`, external: false, icon: 'ph:crown-fill' },
    { key: 'support', href: SUPPORT_URL, external: true, icon: 'ph:headset-fill' },
    { key: 'logout', href: `${prefix}/dash/logout`, external: false, icon: 'ph:sign-out-fill' },
  ];
}

/** What the tab keeps of the last answer. @param {{ name: string, avatar: string | null } | null} user */
export function cacheText(user) {
  return user ? JSON.stringify({ name: user.name, avatar: user.avatar }) : '';
}

/** Reads what the tab kept: a user, or null for anything else. @param {string | null | undefined} text */
export function readCache(text) {
  if (!text) return null;
  try {
    const value = JSON.parse(text);
    const state = accountState({ user: value });
    return state.state === 'user' ? state.user : null;
  } catch {
    return null;
  }
}
