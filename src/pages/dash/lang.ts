export const prerender = false;
import type { APIRoute } from 'astro';
import { LANG_COOKIE } from '../../i18n/dash';

const allowed = ['en', 'es', 'pt-BR'];

// Saves the language choice and returns to the page the visitor was on.
export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const to = url.searchParams.get('to') ?? '';
  if (allowed.includes(to)) {
    cookies.set(LANG_COOKIE, to, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', secure: url.protocol === 'https:' });
  }
  const next = url.searchParams.get('next') ?? '/dash';
  const safe = next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : '/dash';
  return redirect(safe, 303);
};
