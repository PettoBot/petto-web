// The allowed domains of the "All links" filter of Petto (automod_config.allowed_link_domains, a text[]). The rules are the bot's
// (petto-bot src/utils/linkDomains.js): lowercase, punycode, no scheme, user, port, path or `www.`, a valid name with a real ending,
// at most 50. Keep both equal. Plain JavaScript so scripts/check-dash-profile.mjs runs it with node alone.

const MAX_ALLOWED_DOMAINS = 50;
const DOMAIN_RE = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;

/**
 * A domain as it is saved, or null when it is not a valid domain name (IP addresses and single words included).
 * @param {unknown} input what was typed
 * @returns {string | null}
 */
function normalizeDomain(input) {
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
function parseDomainList(input) {
  const raws = Array.isArray(input) ? input.map(String) : String(input ?? '').split(/[\s,;]+/);
  const domains = [];
  const invalid = [];
  for (const raw of raws.map((x) => x.trim()).filter(Boolean)) {
    const domain = normalizeDomain(raw);
    if (!domain) { if (invalid.length < 5) invalid.push(raw.slice(0, 40)); } else if (!domains.includes(domain)) domains.push(domain);
  }
  return { domains: domains.slice(0, MAX_ALLOWED_DOMAINS), invalid, overflow: Math.max(0, domains.length - MAX_ALLOWED_DOMAINS) };
}

const TEMPLATES = [
  { id: "links", group: "links", icon: "ph:link-fill", options: [{ key: "nonClickable", type: "boolean", default: false }] },
  { id: "invites", group: "links", icon: "ph:paper-plane-tilt-fill", options: [{ key: "thirdParty", type: "boolean", default: false }] },
  { id: "inline_links", group: "links", icon: "ph:link-simple", options: [{ key: "disguisedOnly", type: "boolean", default: false }] },
  { id: "emails", group: "links", icon: "ph:paper-plane-tilt-fill", options: [] },
  { id: "scam", group: "safety", icon: "ph:warning-fill", options: [] },
  { id: "fake_pings", group: "safety", icon: "ph:siren-fill", options: [] },
  { id: "ip_addresses", group: "safety", icon: "ph:shield-warning-fill", options: [] },
  { id: "phone_numbers", group: "safety", icon: "ph:shield-warning-fill", options: [] },
  { id: "emojis", group: "text", icon: "ph:mask-happy-fill", options: [{ key: "max", type: "number", min: 0, max: 12, default: 6 }] },
  { id: "zalgo", group: "text", icon: "ph:text-t", options: [{ key: "filterAccents", type: "boolean", default: false }] },
  { id: "headings", group: "text", icon: "ph:list-bullets-fill", options: [{ key: "level", type: "number", min: 1, max: 3, default: 3 }] },
  { id: "subtext", group: "text", icon: "ph:text-t", options: [] },
  { id: "caps", group: "text", icon: "ph:text-t", options: [{ key: "words", type: "number", min: 3, max: 20, default: 6 }] },
  { id: "repeated_characters", group: "text", icon: "ph:text-t", options: [{ key: "times", type: "number", min: 6, max: 30, default: 10 }] },
  { id: "spoilers", group: "text", icon: "ph:eye-slash-fill", options: [{ key: "max", type: "number", min: 1, max: 10, default: 3 }] },
  { id: "invisible_text", group: "text", icon: "ph:eye-slash-fill", options: [] }
];
const PACKS = ["basic", "clean_chat", "anti_scam", "strict"];
const PETTO_ACTIONS = ["delete", "warn", "mute", "kick"];
function cleanOptions(id, raw) {
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) return null;
  const out = {};
  for (const opt of template.options) {
    const value = raw?.[opt.key];
    if (opt.type === "boolean") out[opt.key] = value === void 0 ? opt.default : value === true || value === "true" || value === "on";
    else {
      const n = Math.floor(Number(value ?? opt.default));
      out[opt.key] = Number.isFinite(n) ? Math.max(opt.min, Math.min(opt.max, n)) : opt.default;
    }
  }
  return out;
}

export { MAX_ALLOWED_DOMAINS as M, PACKS as P, TEMPLATES as T, PETTO_ACTIONS as a, cleanOptions as c, parseDomainList as p };
