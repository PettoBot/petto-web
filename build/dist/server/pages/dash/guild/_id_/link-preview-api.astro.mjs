import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
export { renderers } from '../../../../renderers.mjs';

const HOSTS = ["klipy.com", "tenor.com", "giphy.com", "imgur.com"];
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif)(\?[^\s]*)?$/i;
const MAX_BYTES = 262144;
const TTL_MS = 10 * 6e4;
const cache = /* @__PURE__ */ new Map();
const isDirectImage = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && IMAGE_EXT.test(url.pathname + url.search.replace(/^\?/, "?"));
  } catch {
    return false;
  }
};
function allowedPage(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    return HOSTS.some((h) => host === h || host.endsWith(`.${h}`)) ? url : null;
  } catch {
    return null;
  }
}
function extractImage(html) {
  const found = [];
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (!/(?:property|name)\s*=\s*["'](?:og:image|og:image:url|twitter:image)["']/i.test(tag)) continue;
    const content = /content\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]?.replace(/&amp;/g, "&");
    if (content && /^https:\/\//i.test(content)) found.push(content);
  }
  return found.find((u) => /\.gif(\?|$)/i.test(u)) ?? found[0] ?? null;
}
async function previewImage(value, fetchImpl = fetch) {
  if (isDirectImage(value)) return value;
  const page = allowedPage(value);
  if (!page) return null;
  const key = page.href;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.image;
  let image = null;
  try {
    const res = await fetchImpl(page.href, { headers: { "User-Agent": "Mozilla/5.0 (compatible; Discordbot/2.0)", Accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(5e3) });
    if (res.ok && allowedPage(res.url || page.href)) {
      const text = await res.text();
      image = extractImage(text.slice(0, MAX_BYTES));
    }
  } catch {
    image = null;
  }
  if (cache.size > 500) cache.clear();
  cache.set(key, { image, at: Date.now() });
  return image;
}

const prerender = false;
const GET = async (astro) => {
  const { id } = astro.params;
  const result = await getGuildSession(astro, id);
  if ("redirect" in result) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  const link = new URL(astro.request.url).searchParams.get("url") ?? "";
  const image = link.length <= 500 ? await previewImage(link) : null;
  return new Response(JSON.stringify({ image }), { headers: { "Content-Type": "application/json", "Cache-Control": "private, max-age=300" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
