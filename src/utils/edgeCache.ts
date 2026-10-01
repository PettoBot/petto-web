// Discord answers kept in Cloudflare's cache for a short time, shared by every Worker instance in the same data
// center. The in-memory caches of the dashboard only help the instance that made the call, and a fresh instance
// starts empty, so the first page after a pause had to ask Discord again. Everything here is optional: without the
// Cache API (local development) or on any error, the caller simply fetches.
const ORIGIN = 'https://edge-cache.petto.internal/';

function store(): Cache | null {
  const caches = (globalThis as { caches?: { default?: Cache } }).caches;
  return caches?.default ?? null;
}

async function digest(text: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** The value kept under `key`, or null. A secret such as a token is hashed first, it never goes into the cache key as it is. */
export async function edgeGet<T>(namespace: string, secret: string): Promise<T | null> {
  try {
    const cache = store();
    if (!cache) return null;
    const hit = await cache.match(new Request(`${ORIGIN}${namespace}/${await digest(secret)}`));
    return hit ? (await hit.json() as T) : null;
  } catch {
    return null;
  }
}

export async function edgePut(namespace: string, secret: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    const cache = store();
    if (!cache) return;
    await cache.put(
      new Request(`${ORIGIN}${namespace}/${await digest(secret)}`),
      new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${ttlSeconds}` } }),
    );
  } catch { /* A cache that cannot be written only costs a fetch next time. */ }
}

export async function edgeDelete(namespace: string, secret: string): Promise<void> {
  try {
    await store()?.delete(new Request(`${ORIGIN}${namespace}/${await digest(secret)}`));
  } catch { /* Nothing to forget. */ }
}
