import { defineMiddleware } from 'astro:middleware';
import { LANG_COOKIE } from './i18n/dash';

const prefixes: Record<string, string> = { es: 'es', 'pt-br': 'pt-BR' };

// /es/dash and /pt-br/dash pick the dashboard language, then render the single /dash route without changing the address bar.
export const onRequest = defineMiddleware(async ({ url, cookies, locals, rewrite }, next) => {
  const match = url.pathname.match(/^\/(es|pt-br)(\/dash(?:\/.*)?)$/i);
  if (!match) return next();
  const lang = prefixes[match[1].toLowerCase()];
  cookies.set(LANG_COOKIE, lang, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', secure: url.protocol === 'https:' });
  (locals as Record<string, unknown>).dashLang = lang;
  return rewrite(`${match[2]}${url.search}`);
});
