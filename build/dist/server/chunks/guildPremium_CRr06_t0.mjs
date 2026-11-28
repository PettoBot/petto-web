import { cached } from './sharedCache_DFk4ml3Q.mjs';

function guildHasPremium(apiUrl, apiHeaders, guildId) {
  return cached(`premium:guild:${guildId}`, () => readGuildPremium(apiUrl, apiHeaders, guildId), { freshMs: 3e4, staleMs: 10 * 6e4, allowStale: true }).catch(() => false);
}
async function readGuildPremium(apiUrl, apiHeaders, guildId) {
  try {
    const slot = (await (await fetch(`${apiUrl}/rest/v1/premium_slot_assignments?guild_id=eq.${guildId}&status=eq.active&select=entitlement_id&limit=1`, { headers: apiHeaders })).json())[0];
    if (!slot) return false;
    const entitlement = (await (await fetch(`${apiUrl}/rest/v1/premium_entitlements?id=eq.${slot.entitlement_id}&select=status,current_period_end&limit=1`, { headers: apiHeaders })).json())[0];
    return entitlement?.status === "active" && (!entitlement.current_period_end || new Date(entitlement.current_period_end).getTime() > Date.now());
  } catch {
    return false;
  }
}

export { guildHasPremium as g };
