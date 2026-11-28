import { l as loadLeaderboard } from '../../../../chunks/leaderboard_DVUxK20u.mjs';
import { r as renderLeaderboardOg } from '../../../../chunks/ogDynamic_BZWvpwiZ.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const parseLang = (raw) => raw === "es" ? "es" : raw === "pt-BR" || raw === "pt-br" ? "pt-BR" : "en";
const langSlug = (lang) => lang === "pt-BR" ? "pt-br" : lang;
const GET = async (context) => {
  const slug = String(context.params.slug ?? "").trim();
  const lang = parseLang(context.url.searchParams.get("lang"));
  const fallback = `/assets/og/leaderboard-${langSlug(lang)}.webp`;
  if (!slug) return context.redirect(fallback, 302);
  const data = await loadLeaderboard(context, slug);
  if (data.status !== "ok" || !data.board?.guild) return context.redirect(fallback, 302);
  const guild = data.board.guild;
  const webp = await renderLeaderboardOg({
    lang,
    name: String(guild.name ?? slug),
    iconUrl: typeof guild.icon === "string" ? guild.icon : null,
    bannerUrl: typeof guild.banner === "string" ? guild.banner : null,
    memberCount: typeof guild.memberCount === "number" ? guild.memberCount : null
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
