// The allowed domains of the "All links" filter of Petto (automod_config.allowed_link_domains, a text[]). The rules are the bot's
// (petto-bot src/utils/linkDomains.js): lowercase, punycode, no scheme, user, port, path or `www.`, a valid name with a real ending,
// at most 50. Keep both equal. Plain JavaScript so scripts/check-dash-profile.mjs runs it with node alone.

export const MAX_ALLOWED_DOMAINS = 50;
const DOMAIN_RE = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;

/**
 * A domain as it is saved, or null when it is not a valid domain name (IP addresses and single words included).
 * @param {unknown} input what was typed
 * @returns {string | null}
 */
export function normalizeDomain(input) {
  let value = String(input ?? '').trim().toLowerCase();
  if (!value || value.length > 300 || /[\s\\]/.test(value)) return null;
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, '').replace(/^\/\//, '');
  value = value.replace(/[/?#].*$/, '').replace(/:\d+$/, '');
  if (value.includes('@')) return null;
  value = value.replace(/^\*\./, '').replace(/^\.+/, '').replace(/\.+$/, '').replace(/^www\./, '');
  if (!value || !/^[\p{L}\p{N}.-]+$/u.test(value)) return null;
  let ascii = '';
  try { ascii = new URL(`http://${value}`).hostname; } catch { return null; }
  return DOMAIN_RE.test(ascii) ? ascii : null;
}

/**
 * The domains of a text (one per line, or separated by commas, spaces or semicolons) or of a list.
 * @param {unknown} input
 * @returns {{ domains: string[], invalid: string[], overflow: number }} the valid ones without repeats (at most 50), the entries that were refused, and how many valid ones did not fit
 */
export function parseDomainList(input) {
  const raws = Array.isArray(input) ? input.map(String) : String(input ?? '').split(/[\s,;]+/);
  const domains = [];
  const invalid = [];
  for (const raw of raws.map((x) => x.trim()).filter(Boolean)) {
    const domain = normalizeDomain(raw);
    if (!domain) { if (invalid.length < 5) invalid.push(raw.slice(0, 40)); } else if (!domains.includes(domain)) domains.push(domain);
  }
  return { domains: domains.slice(0, MAX_ALLOWED_DOMAINS), invalid, overflow: Math.max(0, domains.length - MAX_ALLOWED_DOMAINS) };
}
