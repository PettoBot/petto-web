import type { Locale } from './ui';
import { dashEs } from './dash-es';
import { dashPt } from './dash-pt';

export const LANG_COOKIE = 'petto_lang';
const supported: Locale[] = ['en', 'es', 'pt-BR'];

type CookieReader = { cookies?: { get(name: string): { value: string } | undefined }; request?: Request };

/** Language of the dashboard: the saved choice, then the browser language, then English. */
export function getDashLang(astro: CookieReader): Locale {
  const saved = astro.cookies?.get(LANG_COOKIE)?.value;
  if (saved && (supported as string[]).includes(saved)) return saved as Locale;
  const header = astro.request?.headers.get('accept-language') ?? '';
  for (const part of header.split(',')) {
    const tag = part.trim().toLowerCase();
    if (tag.startsWith('es')) return 'es';
    if (tag.startsWith('pt')) return 'pt-BR';
    if (tag.startsWith('en')) return 'en';
  }
  return 'en';
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

/**
 * Returns a translate function for the dashboard. The English text is the key, so English pages
 * render exactly what is written in the code, and a missing translation falls back to English.
 * `{a}`, `{b}` placeholders are filled from `vars`; with `html` the values are escaped because
 * the result goes into `set:html`.
 */
export function dashCatalog(lang: Locale): Record<string, string> {
  return lang === 'es' ? dashEs : lang === 'pt-BR' ? dashPt : {};
}

export function makeT(lang: Locale, html = false) {
  const catalog: Record<string, string> | null = lang === 'es' ? dashEs : lang === 'pt-BR' ? dashPt : null;
  return (key: string, vars?: Record<string, unknown>): string => {
    let text = (catalog && catalog[key]) || key;
    if (vars) {
      text = text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? (html ? escapeHtml(String(vars[name])) : String(vars[name])) : whole));
    }
    return text;
  };
}
