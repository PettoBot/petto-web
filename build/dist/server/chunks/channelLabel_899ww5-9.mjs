import { F as readHiddenChannelIds } from './discord_CxeBz2tv.mjs';

async function hiddenChannelSet(guildId) {
  try {
    return new Set(await readHiddenChannelIds(guildId));
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function goneChannelLabel(dt, hidden, id, goneKey) {
  return hidden.has(String(id)) ? dt("No access (hidden channel)") : dt(goneKey);
}

export { goneChannelLabel as g, hiddenChannelSet as h };
