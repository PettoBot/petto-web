import { g as getPartners } from '../../../chunks/partners_BiJzadVG.mjs';
import { a as renderPartnerOg } from '../../../chunks/ogDynamic_BZWvpwiZ.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const parseLang = (raw) => raw === "es" ? "es" : raw === "pt-BR" || raw === "pt-br" ? "pt-BR" : "en";
const langSlug = (lang) => lang === "pt-BR" ? "pt-br" : lang;
const slugify = (name) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const descOf = (p, lang) => (lang === "es" ? p.description_es : lang === "pt-BR" ? p.description_pt : p.description_en) || p.description_en;
const GET = async (context) => {
  const wanted = String(context.url.searchParams.get("p") ?? "").trim().toLowerCase();
  const lang = parseLang(context.url.searchParams.get("lang"));
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
    logoUrl: partner.logo_url || null
  });
  if (!webp) return context.redirect(fallback, 302);
  return new Response(new Uint8Array(webp), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
