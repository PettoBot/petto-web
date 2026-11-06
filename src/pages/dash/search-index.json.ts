export const prerender = false;
import type { APIRoute } from 'astro';
import index from '../../data/dashSearchIndex.json';
import { getDashLang, makeT } from '../../i18n/dash';
import type { Locale } from '../../i18n/ui';

/**
 * What the finder of the dashboard (Ctrl+K) searches besides the pages: the names of the settings on each page, in the language of the dashboard
 * (the same texts the pages show). The list is made from the pages by scripts/dash-search-index.mjs; it holds only names, nothing of a server.
 * `?lang=` is the language of the page that asks, which a /es or /pt-br address sets without a cookie.
 */
export const GET: APIRoute = async (astro) => {
  const asked = astro.url.searchParams.get('lang');
  const lang: Locale = asked === 'es' || asked === 'pt-BR' || asked === 'en' ? asked : getDashLang(astro);
  const dt = makeT(lang);
  const pages = Object.fromEntries(
    Object.entries(index.pages as Record<string, string[]>).map(([slug, labels]) => [slug, [...new Set(labels.map((label) => dt(label)))]]),
  );
  return new Response(JSON.stringify({ lang, pages }), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, max-age=300', vary: 'Cookie, Accept-Language' },
  });
};
