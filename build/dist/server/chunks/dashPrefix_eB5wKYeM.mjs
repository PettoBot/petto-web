// The language prefix of the dashboard address (/es/dash, /pt-br/dash), in one place for the server (middleware.ts, the login callback)
// and for scripts/check-dash-prefix.mjs, which checks these rules. Plain JavaScript so the check runs with node alone.

/** @typedef {'en' | 'es' | 'pt-BR'} DashLang */

/** The prefix of a language: '' for English. Also used by the feedback board's own links. @param {string} lang @returns {string} */
function prefixFor(lang) {
  return lang === 'es' ? '/es' : lang === 'pt-BR' ? '/pt-br' : '';
}

/** A dashboard path with the prefix of a language (an address that already has one keeps it). @param {string} path @param {string} lang */
function withDashPrefix(path, lang) {
  if (!/^\/dash(?:[/?#]|$)/.test(path)) return path;
  return `${prefixFor(lang)}${path}`;
}

// Routes that must answer where they are asked: the language switch, signing in and out.
const NEVER = /^\/(?:dash\/(?:lang|callback|login|logout)|feedback\/login)(?:[/?#]|$)/;
// The pages that carry the language in their address: the dashboard and the feedback board (/es/feedback, /pt-br/feedback).
const LANGUAGE_PAGES = /^\/(?:dash|feedback)(?:\/|$)/;

/**
 * Where a request for an address WITHOUT prefix should go so the address says the language the page will be shown in, or null to answer
 * it as it is. Only a page the browser navigates to (GET or HEAD, a document): never a script's fetch, a partial page read by the
 * dashboard's own navigation, an event stream, a POST, the language switch or the sign-in callback. English has no prefix.
 * @param {{ method: string, pathname: string, search: string, headers: { get(name: string): string | null }, lang: string }} req
 * @returns {string | null}
 */
function dashLangRedirect(req) {
  const { method, pathname, search, headers, lang } = req;
  if (!LANGUAGE_PAGES.test(pathname)) return null;
  if (NEVER.test(pathname)) return null;
  if (!['GET', 'HEAD'].includes(method.toUpperCase())) return null;
  const prefix = prefixFor(lang);
  if (!prefix) return null;
  if (headers.get('x-dash-partial')) return null;
  const mode = headers.get('sec-fetch-mode');
  const dest = headers.get('sec-fetch-dest');
  if (mode) {
    if (mode !== 'navigate' || (dest && dest !== 'document')) return null;
  } else if (!(headers.get('accept') ?? '').includes('text/html')) {
    return null;
  }
  // A JSON variant of a page (?format=json) is for scripts.
  if (/(?:^|&)format=json(?:&|$)/.test(search.replace(/^\?/, ''))) return null;
  return `${prefix}${pathname}${search}`;
}

export { dashLangRedirect as d, prefixFor as p, withDashPrefix as w };
