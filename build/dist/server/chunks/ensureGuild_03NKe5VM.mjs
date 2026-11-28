const KEEP_MS = 10 * 6e4;
const seen = /* @__PURE__ */ new Map();
async function ensureGuildRow(apiUrl, apiHeaders, guildId) {
  const until = seen.get(guildId);
  if (until && until > Date.now()) return;
  const res = await fetch(`${apiUrl}/rest/v1/guilds?on_conflict=guild_id`, {
    method: "POST",
    headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ guild_id: guildId })
  }).catch(() => null);
  if (res?.ok) {
    if (seen.size > 5e3) seen.clear();
    seen.set(guildId, Date.now() + KEEP_MS);
  }
}

export { ensureGuildRow as e };
