const MAX_KEPT = 2e3;
const kept = /* @__PURE__ */ new Map();
function sharedCall(key, load, keepMs) {
  const now = Date.now();
  const hit = kept.get(key);
  if (hit && (!hit.settled || hit.until > now)) return hit.promise;
  const entry = { promise: Promise.resolve(), settled: false, until: 0 };
  const promise = load().then(
    (value) => {
      entry.settled = true;
      entry.until = Date.now() + Math.max(0, keepMs(value));
      return value;
    },
    (error) => {
      entry.settled = true;
      entry.until = 0;
      throw error;
    }
  );
  entry.promise = promise;
  promise.catch(() => {
  });
  kept.set(key, entry);
  if (kept.size > MAX_KEPT) {
    for (const [name, item] of kept) if (item.settled && item.until <= now) kept.delete(name);
    if (kept.size > MAX_KEPT) kept.delete(kept.keys().next().value);
  }
  return promise;
}
const lastAnswers = /* @__PURE__ */ new Map();
function lastAnswer(key) {
  return lastAnswers.get(key);
}
function rememberAnswer(key, value) {
  lastAnswers.delete(key);
  lastAnswers.set(key, value);
  if (lastAnswers.size > MAX_KEPT) lastAnswers.delete(lastAnswers.keys().next().value);
}
function forgetCalls(prefix) {
  for (const key of [...kept.keys()]) if (key.startsWith(prefix)) kept.delete(key);
}
async function withinBudget(promise, ms) {
  let timer;
  const late = new Promise((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  try {
    return await Promise.race([promise.then((value) => ({ value })), late]);
  } finally {
    clearTimeout(timer);
  }
}
function markPending(astro) {
  if (astro.locals) astro.locals.dashPending = true;
}

export { forgetCalls as f, lastAnswer as l, markPending as m, rememberAnswer as r, sharedCall as s, withinBudget as w };
