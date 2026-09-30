import { defineMiddleware } from 'astro:middleware';
import { LANG_COOKIE } from './i18n/dash';

const prefixes: Record<string, string> = { es: 'es', 'pt-br': 'pt-BR' };

// /es/dash and /pt-br/dash pick the dashboard language, then continue to the single /dash route.
export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  const match = url.pathname.match(/^\/(es|pt-br)(\/dash(?:\/.*)?)$/i);
  if (!match) return next();
  const lang = prefixes[match[1].toLowerCase()];
  cookies.set(LANG_COOKIE, lang, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', secure: url.protocol === 'https:' });
  return redirect(`${match[2]}${url.search}`, 302);
});
