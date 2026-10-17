import { cached } from './sharedCache';

// Whether a server has Premium: an active slot on it with a valid entitlement. Premium belongs to the server, so it does not
// matter which of its admins looks at the page. Anything that goes wrong counts as Free.
// The answer is kept 30 seconds, and an older one (up to ten minutes) is shown at once while a new one is read; a change made on the
// Premium page or by Polar's webhook forgets it (forgetPremiumSnapshots, key `premium:guild:<id>`). It used to be two reads, one after
// the other, before every Buttons, Uploads and Partners page could start its own.
export function guildHasPremium(apiUrl: string, apiHeaders: Record<string, string>, guildId: string): Promise<boolean> {
  return cached(`premium:guild:${guildId}`, () => readGuildPremium(apiUrl, apiHeaders, guildId), { freshMs: 30_000, staleMs: 10 * 60_000, allowStale: true }).catch(() => false);
}

async function readGuildPremium(apiUrl: string, apiHeaders: Record<string, string>, guildId: string): Promise<boolean> {
  try {
    const slot = (await (await fetch(`${apiUrl}/rest/v1/premium_slot_assignments?guild_id=eq.${guildId}&status=eq.active&select=entitlement_id&limit=1`, { headers: apiHeaders })).json())[0];
    if (!slot) return false;
    const entitlement = (await (await fetch(`${apiUrl}/rest/v1/premium_entitlements?id=eq.${slot.entitlement_id}&select=status,current_period_end&limit=1`, { headers: apiHeaders })).json())[0];
    return entitlement?.status === 'active' && (!entitlement.current_period_end || new Date(entitlement.current_period_end).getTime() > Date.now());
  } catch {
    return false;
  }
}
