/**
 * Runs fetch-like tasks with a concurrency cap. Cloudflare Workers close the
 * response with "connection limit" once too many outbound connections are open
 * at the same time in a single request, overview.astro hit this by firing 14
 * fetches in one Promise.all (Discord + 13 Supabase calls).
 */
export async function runBatched<T>(tasks: (() => Promise<T>)[], concurrency = 6): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
  return results;
}
