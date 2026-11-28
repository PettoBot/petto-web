const seen = /* @__PURE__ */ new WeakMap();
function firstInRequest(request, key) {
  let keys = seen.get(request);
  if (!keys) {
    keys = /* @__PURE__ */ new Set();
    seen.set(request, keys);
  }
  if (keys.has(key)) return false;
  keys.add(key);
  return true;
}

export { firstInRequest as f };
