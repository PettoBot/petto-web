// The timing of the waits of the dashboard (src/utils/dashLoading.mjs), with a clock and timers made here: a fast answer shows no placeholder,
// a slow one shows it after the delay and keeps it for the minimum, a failure follows the same timing, and a cancelled wait calls nothing more.
import assert from 'node:assert/strict';
import { createWaiter, LOADING_DELAY, LOADING_MIN } from '../src/utils/dashLoading.mjs';

function clock() {
  let t = 0; let id = 0; const timers = new Map();
  return {
    now: () => t,
    setTimer: (fn, ms) => { const key = ++id; timers.set(key, { at: t + ms, fn }); return key; },
    clearTimer: (key) => { timers.delete(key); },
    tick(ms) {
      const end = t + ms;
      for (;;) {
        const due = [...timers.entries()].filter(([, v]) => v.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        timers.delete(due[0]); t = due[1].at; due[1].fn();
      }
      t = end;
    },
  };
}
function make(c) {
  const log = [];
  const waiter = createWaiter({ now: c.now, setTimer: c.setTimer, clearTimer: c.clearTimer, show: () => log.push(['show', c.now()]), hide: () => log.push(['hide', c.now()]), render: (v) => log.push(['render', c.now(), v]), fail: (e) => log.push(['fail', c.now(), e]) });
  return { waiter, log };
}

assert.equal(LOADING_DELAY, 150); assert.equal(LOADING_MIN, 350);

{ // A fast answer: no placeholder at all, drawn at once.
  const c = clock(); const { waiter, log } = make(c);
  c.tick(80); waiter.done('x'); c.tick(1000);
  assert.deepEqual(log, [['render', 80, 'x']], 'a fast answer shows no placeholder');
}
{ // A slow answer: the placeholder after the delay, and the content when it has been there for the minimum.
  const c = clock(); const { waiter, log } = make(c);
  c.tick(150); assert.deepEqual(log, [['show', 150]]);
  c.tick(50); waiter.done('y'); // 200: the placeholder has been there 50 ms
  assert.deepEqual(log, [['show', 150]], 'the content waits for the minimum');
  c.tick(1000);
  assert.deepEqual(log, [['show', 150], ['hide', 500], ['render', 500, 'y']], 'shown for the minimum, then replaced');
}
{ // An answer after the minimum: replaced at once.
  const c = clock(); const { waiter, log } = make(c);
  c.tick(900); waiter.done('z');
  assert.deepEqual(log, [['show', 150], ['hide', 900], ['render', 900, 'z']]);
}
{ // A failure follows the same timing and calls fail, not render.
  const c = clock(); const { waiter, log } = make(c);
  c.tick(160); waiter.fail('boom'); c.tick(1000);
  assert.deepEqual(log, [['show', 150], ['hide', 500], ['fail', 500, 'boom']]);
  const d = clock(); const fast = make(d); d.tick(10); fast.waiter.fail('quick');
  assert.deepEqual(fast.log, [['fail', 10, 'quick']], 'a fast failure shows no placeholder either');
}
{ // Cancelled: nothing is drawn, a shown placeholder is taken away.
  const c = clock(); const { waiter, log } = make(c);
  c.tick(200); waiter.cancel(); waiter.done('late'); c.tick(1000);
  assert.deepEqual(log, [['show', 150], ['hide', 200]]);
  const d = clock(); const a = make(d); a.waiter.cancel(); d.tick(1000);
  assert.deepEqual(a.log, [], 'cancelled before the delay: the placeholder never shows');
}
{ // Answering twice draws once.
  const c = clock(); const { waiter, log } = make(c);
  waiter.done('a'); waiter.done('b'); waiter.fail('c');
  assert.deepEqual(log, [['render', 0, 'a']]);
}
{ // Cancelled while it waits for the minimum: the pending draw does not happen.
  const c = clock(); const { waiter, log } = make(c);
  c.tick(200); waiter.done('q'); waiter.cancel(); c.tick(1000);
  assert.deepEqual(log, [['show', 150], ['hide', 200]]);
}
console.log('Checked the timing of the waits: a fast answer shows nothing, a slow one shows its placeholder for the minimum, failures and cancels.');
