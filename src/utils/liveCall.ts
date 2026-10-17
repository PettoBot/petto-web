/**
 * Calls to the bot whose answer a page shows but must not wait for (the live numbers of the counters, which can take the bot a second or
 * more). A page starts the call, waits for it at most a short budget, and is drawn without it when it is late: it then says so
 * (`markPending`), and the dashboard reads the page again a moment later (data-dash-fill in DashGuildLayout.astro). That read finds the
 * same call, already answered or still running, instead of asking the bot again: an answer is kept a few seconds after it arrives.
 *
 * Only Node can wait on a call another request started; the Worker build waits for the whole call, as before.
 */

type Kept = { promise: Promise<unknown>; settled: boolean; until: number };

const MAX_KEPT = 2_000;
const kept = new Map<string, Kept>();

/** The running or recent call under `key`, or a new one. `keepMs` says how long its answer is reused once it arrives. */
export function sharedCall<T>(key: string, load: () => Promise<T>, keepMs: (value: T) => number): Promise<T> {
  const now = Date.now();
  const hit = kept.get(key);
  if (hit && (!hit.settled || hit.until > now)) return hit.promise as Promise<T>;
  const entry: Kept = { promise: Promise.resolve(), settled: false, until: 0 };
  const promise = load().then(
    (value) => { entry.settled = true; entry.until = Date.now() + Math.max(0, keepMs(value)); return value; },
    (error) => { entry.settled = true; entry.until = 0; throw error; },
  );
  entry.promise = promise;
  // Nobody may be waiting any more when it fails (the page was already drawn).
  promise.catch(() => {});
  kept.set(key, entry);
  if (kept.size > MAX_KEPT) {
    for (const [name, item] of kept) if (item.settled && item.until <= now) kept.delete(name);
    if (kept.size > MAX_KEPT) kept.delete(kept.keys().next().value as string);
  }
  return promise;
}

const lastAnswers = new Map<string, unknown>();

/** The last answer seen under `key` (whatever its age), to show while a newer one is on its way. */
export function lastAnswer<T>(key: string): T | undefined {
  return lastAnswers.get(key) as T | undefined;
}

export function rememberAnswer(key: string, value: unknown): void {
  lastAnswers.delete(key);
  lastAnswers.set(key, value);
  if (lastAnswers.size > MAX_KEPT) lastAnswers.delete(lastAnswers.keys().next().value as string);
}

/** Forgets the answers kept under keys that start with `prefix` (after a change, the next page asks again). */
export function forgetCalls(prefix: string): void {
  for (const key of [...kept.keys()]) if (key.startsWith(prefix)) kept.delete(key);
}

/** The answer of `promise` if it arrives within `ms`, otherwise null (the call goes on). The Worker build always waits for it. */
export async function withinBudget<T>(promise: Promise<T>, ms: number): Promise<{ value: T } | null> {
  if (!__NODE_TARGET__) return { value: await promise };
  let timer: ReturnType<typeof setTimeout> | undefined;
  const late = new Promise<null>((resolve) => { timer = setTimeout(() => resolve(null), ms); });
  try {
    return await Promise.race([promise.then((value) => ({ value })), late]);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * The page was drawn without something it is still waiting for: it carries no ETag (a copy of it is never reused), and the dashboard
 * reads it again in a moment to fill it in.
 */
export function markPending(astro: { locals?: any }): void {
  if (astro.locals) astro.locals.dashPending = true;
}
