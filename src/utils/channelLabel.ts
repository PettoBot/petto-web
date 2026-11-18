import { readHiddenChannelIds } from './guildSnapshots';

/** The ids of the channels of a server that Petto cannot view (Discord shows them to the bot only in outline). Never throws: empty when unknown. */
export async function hiddenChannelSet(guildId: string): Promise<Set<string>> {
  try {
    return new Set(await readHiddenChannelIds(guildId));
  } catch {
    return new Set();
  }
}

/**
 * What to say for a saved channel that is not in the lists: "no access" when Petto cannot view it (it exists, the bot just cannot see it),
 * otherwise the words for a channel that is gone. `dt` is the dashboard translator.
 */
export function goneChannelLabel(dt: (key: string) => string, hidden: Set<string>, id: string, goneKey: string): string {
  return hidden.has(String(id)) ? dt('No access (hidden channel)') : dt(goneKey);
}
