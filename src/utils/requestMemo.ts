// A page and its layout run one after the other, and both need some of the same Discord data. Work that is started
// once per request and shared by key lets the page start the layout's reads early, so they run while the page does its
// own, and lets the layout pick up the same answer instead of asking again. Only for reads (GET and HEAD): a write
// always reads fresh data.
const memos = new WeakMap<object, Map<string, Promise<unknown>>>();

export function memoPerRequest<T>(request: Request | undefined, key: string, load: () => Promise<T>): Promise<T> {
  const method = String(request?.method ?? 'GET').toUpperCase();
  if (!request || (method !== 'GET' && method !== 'HEAD')) return load();
  let byKey = memos.get(request);
  if (!byKey) memos.set(request, (byKey = new Map()));
  let pending = byKey.get(key) as Promise<T> | undefined;
  if (!pending) {
    pending = load();
    byKey.set(key, pending);
    pending.catch(() => byKey?.delete(key));
  }
  return pending;
}
