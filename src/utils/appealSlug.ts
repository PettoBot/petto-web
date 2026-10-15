// The short name of an appeal link (petto.sbs/appeal/<name>): what it may look like and which names are kept back.
export const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])$/;

export function cleanSlug(value: unknown): string {
  return String(value ?? '').trim().toLowerCase().replace(/^https?:\/\/[^/]+\/appeal\//, '').replace(/[\s_]+/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
}

// Words that are a part of the site or that would look like the official thing. Only the Petto team may use these.
const RESERVED = new Set([
  'login', 'logout', 'form', 'forms', 'status', 'api', 'dash', 'dashboard', 'admin', 'administrator', 'root', 'system', 'support', 'soporte', 'help', 'ayuda', 'staff', 'team', 'equipo',
  'mod', 'mods', 'moderator', 'owner', 'ceo', 'official', 'oficial', 'verified', 'verificado', 'bot', 'bots', 'www', 'mail', 'blog', 'docs', 'wiki', 'status', 'premium', 'brand', 'credits',
  'apply', 'partners', 'terms', 'privacy', 'cookies', 'refunds', 'faq', 'feedback', 'changelog', 'roadmap', 'stats', 'commands', 'new', 'null', 'undefined', 'everyone', 'here', 'me', 'you',
  'discord', 'petto', 'pettobot', 'valorant', 'riot', 'riotgames', 'leagueoflegends', 'lol', 'minecraft', 'mojang', 'fortnite', 'epicgames', 'roblox', 'steam', 'valve', 'blizzard', 'overwatch',
  'youtube', 'twitch', 'tiktok', 'instagram', 'whatsapp', 'telegram', 'twitter', 'facebook', 'meta', 'google', 'apple', 'microsoft', 'xbox', 'playstation', 'nintendo', 'netflix', 'spotify',
  'paypal', 'binance', 'nitro', 'amongus', 'genshin', 'hoyoverse', 'ea', 'ubisoft', 'rockstar', 'gta', 'cod', 'warzone',
]);
// Names that must not appear inside a name, whatever is around them (brands people could pass as, and the staff of the platform).
const RESERVED_INSIDE = ['discord', 'petto', 'valorant', 'minecraft', 'fortnite', 'roblox', 'youtube', 'twitch', 'tiktok', 'instagram', 'whatsapp', 'telegram', 'netflix', 'spotify', 'paypal', 'binance', 'official', 'oficial', 'support', 'soporte', 'moderator'];

// Offensive words in English, Spanish and Portuguese. Matched after turning 0 1 3 4 5 7 @ $ into letters and removing hyphens.
const OFFENSIVE_INSIDE = [
  'fuck', 'shit', 'bitch', 'cunt', 'nigg', 'faggot', 'whore', 'slut', 'rape', 'rapist', 'nazi', 'hitler', 'porn', 'pedo', 'molest', 'blowjob', 'cocksuck', 'dick', 'pussy', 'penis', 'vagina', 'cum', 'anal', 'sex', 'xxx', 'incest',
  'puta', 'puto', 'mierda', 'pendej', 'cabron', 'cabrona', 'chingad', 'verga', 'culo', 'coger', 'follar', 'violador', 'violar', 'marica', 'maricon', 'zorra', 'perra', 'gilipoll', 'hijueputa', 'hdp', 'malparid', 'gonorrea', 'sidoso', 'negrata', 'sudaca', 'mamaguevo', 'pene', 'vaina',
  'caralho', 'buceta', 'porra', 'foda', 'foder', 'viado', 'cuzao', 'arrombad', 'desgraca', 'estupro', 'pornografia', 'pornô',
  'kkk', 'isis', 'suicid', 'cp',
];
// Short ones that are fine inside other words ("cum" in "cumple", "anal" in "canal"): only blocked when they are the whole name or a whole part.
const OFFENSIVE_WHOLE = new Set(['cum', 'anal', 'sex', 'xxx', 'cp', 'hdp', 'kkk', 'isis', 'pene', 'vaina', 'dick', 'rape', 'puta', 'puto', 'culo', 'foda', 'foder', 'porra', 'perra', 'zorra']);

const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', $: 's' };
const normalize = (slug: string) => slug.replace(/[013457@$]/g, (c) => LEET[c] ?? c).replace(/-/g, '');

export type SlugProblem = 'format' | 'numeric' | 'reserved' | 'offensive';

/** Why a name cannot be used, or null when it is fine. `isTeam` lets the Petto team take the reserved names. */
export function slugProblem(slug: string, isTeam = false): SlugProblem | null {
  if (!SLUG_PATTERN.test(slug)) return 'format';
  if (/^\d+$/.test(slug)) return 'numeric'; // Numbers alone are the ids of servers.
  const flat = normalize(slug);
  const parts = slug.split('-').map(normalize);
  if (OFFENSIVE_INSIDE.some((word) => (OFFENSIVE_WHOLE.has(word) ? parts.includes(word) || flat === word : flat.includes(word)))) return 'offensive';
  if (!isTeam && (RESERVED.has(slug) || RESERVED.has(flat) || RESERVED_INSIDE.some((word) => flat.includes(word)))) return 'reserved';
  return null;
}
