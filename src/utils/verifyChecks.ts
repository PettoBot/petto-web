// The extra checks of a server's verification (verification_config.checks): Tor, alt accounts, the Discord account and the email code. The bot reads them with
// the same rules (utils/verifyChecks.js there): anything missing or wrong is "off", so a bad value never blocks anybody.
export type CheckMode = 'off' | 'warn' | 'block';
export interface VerifyChecks {
  tor: CheckMode;
  alt: CheckMode;
  account: { mode: CheckMode; min_age_days: number; no_avatar: boolean; flagged: boolean };
  email: { required: boolean; common_only: boolean; block_disposable: boolean; allowed_domains: string[]; blocked_domains: string[] };
}

const MODES: CheckMode[] = ['off', 'warn', 'block'];
const DOMAIN_RE = /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
const MAX_DOMAINS = 50;
const mode = (value: unknown): CheckMode => (MODES.includes(value as CheckMode) ? (value as CheckMode) : 'off');

/** A list of domains: lower case, valid, no duplicates, at most 50. Takes an array or a text with commas, spaces or lines. */
export function domainList(value: unknown): string[] {
  const parts = Array.isArray(value) ? value : String(value ?? '').split(/[\s,;]+/);
  const out: string[] = [];
  for (const part of parts) {
    const domain = String(part ?? '').trim().toLowerCase().replace(/^@/, '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (DOMAIN_RE.test(domain) && !out.includes(domain)) out.push(domain);
    if (out.length >= MAX_DOMAINS) break;
  }
  return out;
}

export function normalizeChecks(raw: unknown): VerifyChecks {
  const source: any = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const account: any = source.account && typeof source.account === 'object' ? source.account : {};
  const email: any = source.email && typeof source.email === 'object' ? source.email : {};
  const days = Math.floor(Number(account.min_age_days));
  return {
    tor: mode(source.tor),
    alt: mode(source.alt),
    account: { mode: mode(account.mode), min_age_days: Number.isFinite(days) ? Math.min(365, Math.max(0, days)) : 0, no_avatar: account.no_avatar === true, flagged: account.flagged !== false },
    email: { required: email.required === true, common_only: email.common_only !== false, block_disposable: email.block_disposable !== false, allowed_domains: domainList(email.allowed_domains), blocked_domains: domainList(email.blocked_domains) },
  };
}

/** The checks of the form of the verification (`chk_*` fields). */
export function checksFromForm(form: FormData): VerifyChecks {
  return normalizeChecks({
    tor: form.get('chk_tor'),
    alt: form.get('chk_alt'),
    account: { mode: form.get('chk_account'), min_age_days: form.get('chk_account_age'), no_avatar: form.get('chk_account_avatar') === 'on', flagged: form.get('chk_account_flagged') === 'on' },
    email: { required: form.get('chk_email') === 'on', common_only: form.get('chk_email_common') === 'on', block_disposable: form.get('chk_email_disposable') === 'on', allowed_domains: form.get('chk_email_allow'), blocked_domains: form.get('chk_email_deny') },
  });
}
