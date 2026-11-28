import { g as getEnv } from './env_WnBvzCjc.mjs';
import { i as isPettoOwner } from './premiumAdmin_C4HUbWtx.mjs';

function list(astro, name) {
  return String(getEnv(astro, name) ?? "").split(/[\s,]+/).filter((id) => /^\d{15,22}$/.test(id));
}
function canUseFeeds(astro, userId) {
  if (getEnv(astro, "FEEDS_PUBLIC") !== "false") return true;
  if (!userId) return false;
  return isPettoOwner(astro, userId) || list(astro, "PETTO_DEVELOPER_IDS").includes(userId) || list(astro, "FEEDS_TESTER_IDS").includes(userId);
}

export { canUseFeeds as c };
