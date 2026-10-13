// A guild has to have its row in the bot's database before any table that points at it gets one. Saving a page used to ask for
// that on every save, which is a whole round trip to the bot before the real write. A server that was ensured a moment ago is
// not asked again; the row is never deleted while the bot is in the server, so remembering it for a while is safe.
const KEEP_MS = 10 * 60_000;
const seen = new Map<string, number>();

export async function ensureGuildRow(apiUrl: string, apiHeaders: Record<string, string>, guildId: string): Promise<void> {
  const until = seen.get(guildId);
  if (until && until > Date.now()) return;
  const res = await fetch(`${apiUrl}/rest/v1/guilds?on_conflict=guild_id`, {
    method: 'POST',
    headers: { ...apiHeaders, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ guild_id: guildId }),
  }).catch(() => null);
  if (res?.ok) {
    if (seen.size > 5000) seen.clear();
    seen.set(guildId, Date.now() + KEEP_MS);
  }
}
