// The timing of a wait in the dashboard, apart from the page so it can be tested: a placeholder shows only when the answer takes longer than
// `delay` (a fast answer never flashes one), and once shown it stays at least `min` (it never blinks away at once). The pieces that touch the
// page (what the placeholder looks like, how the content is uncovered) are handed in as functions.
//
//   const wait = createWaiter({ delay, min, now, setTimer, clearTimer, show, hide, render, fail })
//   wait.done(value)   the answer came: it is drawn now (fast answer) or when the placeholder has been there for `min`
//   wait.fail(error)   it failed: same timing, then fail(error) is called instead of render
//   wait.cancel()      nobody wants the answer any more (another request took its place): nothing else is called
export const LOADING_DELAY = 150;
export const LOADING_MIN = 350;

export function createWaiter(options) {
  const delay = options.delay ?? LOADING_DELAY;
  const min = options.min ?? LOADING_MIN;
  const now = options.now ?? Date.now;
  const setTimer = options.setTimer ?? setTimeout;
  const clearTimer = options.clearTimer ?? clearTimeout;
  let shownAt = 0;
  let state = 'waiting'; // waiting -> shown -> finished | cancelled
  let showTimer = null;
  let endTimer = null;

  const finish = (draw) => {
    if (state === 'cancelled' || state === 'finished') return;
    clearTimer(showTimer);
    if (state === 'shown') {
      const left = Math.max(0, min - (now() - shownAt));
      const run = () => {
        if (state === 'cancelled') return;
        state = 'finished';
        options.hide?.();
        draw();
      };
      if (left > 0) endTimer = setTimer(run, left); else run();
    } else {
      state = 'finished';
      draw();
    }
  };

  showTimer = setTimer(() => {
    if (state !== 'waiting') return;
    state = 'shown';
    shownAt = now();
    options.show?.();
  }, delay);

  return {
    done: (value) => finish(() => options.render?.(value)),
    fail: (error) => finish(() => options.fail?.(error)),
    cancel: () => {
      if (state === 'finished') return;
      const wasShown = state === 'shown';
      state = 'cancelled';
      clearTimer(showTimer);
      clearTimer(endTimer);
      if (wasShown) options.hide?.();
    },
    state: () => state,
  };
}

// Widths of the grey lines of a placeholder, so a list does not look like a ruler.
export const LINE_WIDTHS = [62, 38, 74, 50, 30, 66, 44, 58, 36, 70, 48, 28];
