// The servers of the carousel of the home page, as the bot saves them (`showcase` in the row `main` of `global_stats`). What comes from there is
// cleaned before it reaches the page: only the fields the carousel draws, with the right type and length, a picture only from the Discord CDN and at most 15 servers.

export type Badge = 'partnered' | 'verified' | 'discoverable' | 'community';

export interface ShowcaseServer {
  id: string;
  name: string;
  icon: string | null;
  animated: boolean;
  members: number;
  online: number | null;
  badges: Badge[];
  /** Boost level, 0 to 3. */
  boost: number;
}

export const SHOWCASE_MAX = 15;
const BADGES: readonly Badge[] = ['partnered', 'verified', 'discoverable', 'community'];
const whole = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : null);

/** The list the page can draw, from whatever the row holds (anything that is not a list, or a server that does not look like one, is left out). */
export function cleanShowcase(raw: unknown): ShowcaseServer[] {
  if (!Array.isArray(raw)) return [];
  const servers: ShowcaseServer[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const item = entry as Record<string, unknown>;
    const id = typeof item.id === 'string' && /^\d{15,25}$/.test(item.id) ? item.id : null;
    const name = typeof item.name === 'string' ? item.name.trim().slice(0, 100) : '';
    const members = whole(item.members);
    if (!id || !name || members === null) continue;
    const icon = typeof item.icon === 'string' && /^https:\/\/cdn\.discordapp\.com\//.test(item.icon) ? item.icon : null;
    servers.push({
      id,
      name,
      icon,
      animated: Boolean(icon) && item.animated === true,
      members,
      online: whole(item.online),
      badges: Array.isArray(item.badges) ? BADGES.filter((badge) => (item.badges as unknown[]).includes(badge)) : [],
      boost: Math.min(3, whole(item.boost) ?? 0),
    });
    if (servers.length >= SHOWCASE_MAX) break;
  }
  return servers;
}
