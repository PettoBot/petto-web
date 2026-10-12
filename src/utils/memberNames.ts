import { getEnv } from './env';
import { peekMany, storeMany } from './sharedCache';

/**
 * Names and avatars of the members a page shows (leaderboards, statistics). The bot already knows its members, so one call to its
 * API (`POST /api/dashboard/guild/:id/members`, 100 ids per call) answers all of them, instead of one Discord call per member.
 * Answers are kept for 10 minutes (in Redis when there is one). A bot without that route (404) is asked again only after a while,
 * and meanwhile the names come from Discord one by one, as they did before.
 */

export interface MemberProfile {
  id: string;
  username: string;
  globalName: string | null;
  displayName: string;
  avatar: string | null;
  bot: boolean;
}

const NAME_TTL_MS = 10 * 60_000;
const ROUTE_RETRY_MS = 10 * 60_000;
const CHUNK = 100;
const FALLBACK_CONCURRENCY = 5;
const ID = /^\d{15,25}$/;
let routeMissingUntil = 0;

const key = (guildId: string, userId: string) => `member:${guildId}:${userId}`;

/** A Discord CDN link for the member's avatar: the bot may send a hash or a full link. */
export function memberAvatarUrl(userId: string, profile: MemberProfile | null | undefined, size = 64): string {
  const avatar = profile?.avatar ?? null;
  if (avatar && /^https?:\/\//.test(avatar)) return avatar;
  if (avatar) return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=${size}`;
  return `https://cdn.discordapp.com/embed/avatars/${Number(userId || 0) % 6}.png`;
}

function fromBot(id: string, raw: any): MemberProfile | null {
  if (!raw || typeof raw !== 'object') return null;
  const username = String(raw.username ?? '');
  const globalName = raw.globalName ?? raw.global_name ?? null;
  return { id, username, globalName, displayName: String(raw.displayName ?? raw.display_name ?? globalName ?? username ?? ''), avatar: raw.avatar ?? null, bot: Boolean(raw.bot) };
}

function fromDiscordMember(id: string, member: any): MemberProfile | null {
  const user = member?.user;
  if (!user) return null;
  return { id, username: String(user.username ?? ''), globalName: user.global_name ?? null, displayName: String(member.nick || user.global_name || user.username || ''), avatar: user.avatar ?? null, bot: Boolean(user.bot) };
}

function fromDiscordUser(id: string, user: any): MemberProfile | null {
  if (!user?.id) return null;
  return { id, username: String(user.username ?? ''), globalName: user.global_name ?? null, displayName: String(user.global_name || user.username || ''), avatar: user.avatar ?? null, bot: Boolean(user.bot) };
}

async function askBot(astro: { locals?: any }, guildId: string, ids: string[], userId: string | undefined): Promise<Map<string, MemberProfile | null> | null> {
  const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL');
  const secret = getEnv(astro, 'PETTO_BOT_API_SECRET');
  if (!apiUrl || !secret || !userId || Date.now() < routeMissingUntil) return null;
  const found = new Map<string, MemberProfile | null>();
  for (let start = 0; start < ids.length; start += CHUNK) {
    const chunk = ids.slice(start, start + CHUNK);
    let res: Response;
    try {
      res = await fetch(`${apiUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/members`, {
        method: 'POST',
        signal: AbortSignal.timeout(4_000),
        headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', 'Content-Type': 'application/json' },
        // The bot checks that the person looking can manage the server, like its other dashboard routes.
        body: JSON.stringify({ ids: chunk, user_id: userId }),
      });
    } catch {
      return found.size ? found : null;
    }
    if (res.status === 404) {
      // A bot without the route yet (or a server it cannot see): the per-member path answers until the bot is asked again.
      routeMissingUntil = Date.now() + ROUTE_RETRY_MS;
      return found.size ? found : null;
    }
    // Any other refusal (no access, a bad id, the bot failing) also falls back to the per-member path, for this page only.
    if (!res.ok) return found.size ? found : null;
    const payload: any = await res.json().catch(() => null);
    const members = payload?.members;
    if (payload?.ok === false || !members || typeof members !== 'object') return found.size ? found : null;
    for (const id of chunk) found.set(id, fromBot(id, members[id]));
  }
  return found;
}

async function inBatches<T>(items: T[], size: number, run: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) await run(items[next++]);
  }));
}

/**
 * Profiles for `ids` in one server. A member the bot does not know (left the server) is null, or, with `fallback: 'user'`, read
 * from Discord's global profile, as the statistics page always did.
 */
export async function getMemberProfiles(astro: { locals?: any }, guildId: string, ids: string[], botToken: string | undefined, options: { fallback?: 'member' | 'user'; userId?: string } = {}): Promise<Map<string, MemberProfile | null>> {
  const wanted = [...new Set(ids.map(String).filter((id) => ID.test(id)))];
  const result = new Map<string, MemberProfile | null>();
  if (!wanted.length) return result;

  const kept = await peekMany<MemberProfile | null>(wanted.map((id) => key(guildId, id)));
  const missing: string[] = [];
  for (const id of wanted) {
    const k = key(guildId, id);
    if (kept.has(k)) result.set(id, kept.get(k) ?? null);
    else missing.push(id);
  }
  if (!missing.length) return result;

  const learned: Array<[string, MemberProfile | null]> = [];
  const fromApi = await askBot(astro, guildId, missing, options.userId);
  let left = missing;
  if (fromApi) {
    left = [];
    for (const id of missing) {
      const profile = fromApi.has(id) ? fromApi.get(id) ?? null : undefined;
      if (profile === undefined) { left.push(id); continue; }
      if (profile || options.fallback !== 'user') { result.set(id, profile); learned.push([key(guildId, id), profile]); }
      else left.push(id);
    }
  }

  // Without the bot's answer (or for people who left, when the page shows them anyway), Discord is asked, a few at a time.
  if (left.length && botToken) {
    const viaUser = options.fallback === 'user';
    await inBatches(left, FALLBACK_CONCURRENCY, async (id) => {
      try {
        const url = viaUser ? `https://discord.com/api/users/${id}` : `https://discord.com/api/guilds/${guildId}/members/${id}`;
        const res = await fetch(url, { headers: { Authorization: `Bot ${botToken}` } });
        if (res.status === 429 || res.status >= 500) { result.set(id, null); return; }
        const body = res.ok ? await res.json() : null;
        const profile = res.ok ? (viaUser ? fromDiscordUser(id, body) : fromDiscordMember(id, body)) : null;
        result.set(id, profile);
        learned.push([key(guildId, id), profile]);
      } catch {
        result.set(id, null);
      }
    });
  }
  for (const id of left) if (!result.has(id)) result.set(id, null);
  await storeMany(learned, NAME_TTL_MS).catch(() => {});
  return result;
}
