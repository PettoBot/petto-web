export const prerender = false;
import type { APIRoute } from 'astro';
import type { Locale } from '../../../i18n/ui';
import { getPartners, type PartnerRow } from '../../../utils/partners';
import { renderPartnerOg } from '../../../utils/ogDynamic';

const parseLang = (raw: string | null): Locale => (raw === 'es' ? 'es' : raw === 'pt-BR' || raw === 'pt-br' ? 'pt-BR' : 'en');
const langSlug = (lang: Locale) => (lang === 'pt-BR' ? 'pt-br' : lang);
const slugify = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const descOf = (p: PartnerRow, lang: Locale) => (lang === 'es' ? p.description_es : lang === 'pt-BR' ? p.description_pt : p.description_en) || p.description_en;

export const GET: APIRoute = async (context) => {
  const wanted = String(context.url.searchParams.get('p') ?? '').trim().toLowerCase();
  const lang = parseLang(context.url.searchParams.get('lang'));
  const fallback = `/assets/og/partners-${langSlug(lang)}.webp`;
  if (!wanted) return context.redirect(fallback, 302);

  const { partners } = await getPartners(context);
  const partner = partners.find((p) => {
    const s = slugify(p.name);
    return s === wanted || `part_${p.kind}:${s}` === wanted;
  });
  if (!partner) return context.redirect(fallback, 302);

  const webp = await renderPartnerOg({
    lang,
    name: partner.name,
    description: descOf(partner, lang),
    isPrimary: Boolean(partner.is_primary),
    logoUrl: partner.logo_url || null,
  });

  if (!webp) return context.redirect(fallback, 302);
  return new Response(new Uint8Array(webp), {
    status: 200,
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
