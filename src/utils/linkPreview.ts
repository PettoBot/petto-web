// The picture Discord would draw for a link in a message, for the previews of the dashboard (an autoresponder that answers with a GIF link,
// for example). Only a few GIF and image sites are asked, the page is read for its og:image and nothing else, and the answer is cached.
const HOSTS = ['klipy.com', 'tenor.com', 'giphy.com', 'imgur.com'];
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif)(\?[^\s]*)?$/i;
const MAX_BYTES = 262_144;
const TTL_MS = 10 * 60_000;
const cache = new Map<string, { image: string | null; at: number }>();

/** A link that is a picture itself (a file ending in an image type). */
export const isDirectImage = (value: string): boolean => {
  try { const url = new URL(value); return url.protocol === 'https:' && IMAGE_EXT.test(url.pathname + url.search.replace(/^\?/, '?')); } catch { return false; }
};

/** The address, when it is a page of one of the sites that are asked. */
export function allowedPage(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    return HOSTS.some((h) => host === h || host.endsWith(`.${h}`)) ? url : null;
  } catch { return null; }
}

/** The best og:image of a page: a GIF when there is one, otherwise the first. Only https addresses. */
export function extractImage(html: string): string | null {
  const found: string[] = [];
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (!/(?:property|name)\s*=\s*["'](?:og:image|og:image:url|twitter:image)["']/i.test(tag)) continue;
    const content = /content\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]?.replace(/&amp;/g, '&');
    if (content && /^https:\/\//i.test(content)) found.push(content);
  }
  return found.find((u) => /\.gif(\?|$)/i.test(u)) ?? found[0] ?? null;
}

/** The picture of a link: itself when it is an image, the og:image of the page for the allowed sites, null for anything else. */
export async function previewImage(value: string, fetchImpl: typeof fetch = fetch): Promise<string | null> {
  if (isDirectImage(value)) return value;
  const page = allowedPage(value);
  if (!page) return null;
  const key = page.href;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.image;
  let image: string | null = null;
  try {
    const res = await fetchImpl(page.href, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Discordbot/2.0)', Accept: 'text/html' }, redirect: 'follow', signal: AbortSignal.timeout(5000) });
    // A redirect must end on one of the sites too.
    if (res.ok && allowedPage(res.url || page.href)) {
      const text = await res.text();
      image = extractImage(text.slice(0, MAX_BYTES));
    }
  } catch { image = null; }
  if (cache.size > 500) cache.clear();
  cache.set(key, { image, at: Date.now() });
  return image;
}
