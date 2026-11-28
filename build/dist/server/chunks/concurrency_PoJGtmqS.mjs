async function runBatched(tasks, concurrency = 6) {
  return Promise.all(tasks.map((task) => task()));
}

export { runBatched as r };
