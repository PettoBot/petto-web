type TaskResult<T> = T extends () => Promise<infer R> ? R : never;
type BatchedResults<T extends readonly (() => Promise<any>)[]> = {
  [K in keyof T]: TaskResult<T[K]>;
};

export async function runBatched<const T extends readonly (() => Promise<any>)[]>(
  tasks: T,
  concurrency = 6,
): Promise<BatchedResults<T>> {
  const results: unknown[] = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
  return results as BatchedResults<T>;
}
