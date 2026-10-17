// Parts of a page that many components share (a list of variables, of channels, of roles) are written once per answer. The first
// component of a request that asks for a key gets true and writes it; every later one gets false and points at it.
const seen = new WeakMap<Request, Set<string>>();

export function firstInRequest(request: Request, key: string): boolean {
  let keys = seen.get(request);
  if (!keys) {
    keys = new Set();
    seen.set(request, keys);
  }
  if (keys.has(key)) return false;
  keys.add(key);
  return true;
}
