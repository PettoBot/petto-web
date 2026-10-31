// Forum support needs the tables `forum_setups` and `forum_posts`, which the bot makes when it starts. The bot is deployed before the website, but a
// bot that is older (or restarting) has no such table: the Forums page and its menu entry stay hidden until the table answers. The answer is kept a
// short while (and a question already asked is shared), so the menu of every page does not ask the database each time.
import { getEnv } from './env';

const YES_MS = 5 * 60_000;
const NO_MS = 20_000;
const MAX_KEPT = 500;
const kept = new Map<string, { until: number; ready: boolean }>();
const asking = new Map<string, Promise<boolean>>();

type Context = { locals?: any };

async function ask(context: Context): Promise<boolean> {
  const apiUrl = getEnv(context as any, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(context as any, 'PETTO_BOT_API_SECRET');
  if (!apiUrl || !apiKey) return false;
  try {
    const res = await fetch(`${apiUrl}/rest/v1/forum_setups?select=id&limit=1`, { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(4_000) });
    return res.ok;
  } catch {
    return false;
  }
}

/** Whether the bot has the forum tables. `waitMs` is the most a page waits for a first answer: a slow one counts as "not yet". */
export async function forumsReady(context: Context, waitMs = 600): Promise<boolean> {
  const key = 'forum_setups';
  const hit = kept.get(key);
  if (hit && hit.until > Date.now()) return hit.ready;
  let pending = asking.get(key);
  if (!pending) {
    pending = ask(context).then((ready) => {
      if (kept.size > MAX_KEPT) kept.clear();
      kept.set(key, { ready, until: Date.now() + (ready ? YES_MS : NO_MS) });
      return ready;
    }).finally(() => { asking.delete(key); });
    asking.set(key, pending);
  }
  return Promise.race([pending, new Promise<boolean>((resolve) => setTimeout(() => resolve(false), waitMs))]);
}
