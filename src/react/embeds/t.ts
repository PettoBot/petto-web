import type { Locale } from '../../i18n/ui';

// The dashboard's words for the React apps, in the page's language only: the page writes them into
// <script type="application/json" id="dash-react-words"> (DashReactWords.astro) ahead of the app. The English text is the
// key, so an English page sends nothing and a missing word falls back to English. Importing both catalogs here put
// 350 KB of translations into every visitor's download.
const lang = (typeof document !== 'undefined' ? document.documentElement.lang : 'en') as Locale;
let catalog: Record<string, string> | null = null;

function words(): Record<string, string> | null {
  if (catalog || lang === 'en' || typeof document === 'undefined') return catalog;
  const holder = document.getElementById('dash-react-words');
  if (!holder) return null;
  try {
    catalog = JSON.parse(holder.textContent || '{}');
  } catch {
    catalog = {};
  }
  return catalog;
}

export const t = (key: string, vars?: Record<string, unknown>): string => {
  let text = words()?.[key] || key;
  if (vars) text = text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole));
  return text;
};
