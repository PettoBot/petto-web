// The platforms a server can follow from the dashboard, with what each one can notify. The same ids, colors and types as the bot
// (petto-bot src/feeds/platforms.js); the bot checks everything again, this only draws the pages and the forms.
export type FeedType = 'video' | 'short' | 'live' | 'clip' | 'post' | 'pin' | 'update' | 'episode' | 'daily';

export interface FeedPlatform {
  id: string;
  name: string;
  /** The color of the side bar of the card (and of the page). */
  color: string;
  /** The color of the text over `color` (dark over the light brand colors). */
  ink: string;
  /** An icon of the `simple-icons` set (every one must be in the list of astro.config.mjs). */
  icon: string;
  types: FeedType[];
  defaultTypes: FeedType[];
  /** What the account box asks for: a link, a name... (English, passed through dt()). */
  account: { label: string; placeholder: string; help: string } | null;
  /** The kind of notice the preview shows first. */
  soon?: boolean;
}

export const FEED_PLATFORMS: FeedPlatform[] = [
  { id: 'youtube', name: 'YouTube', color: '#ff0000', ink: '#ffffff', icon: 'simple-icons:youtube', types: ['video', 'short', 'live'], defaultTypes: ['video', 'short', 'live'],
    account: { label: 'YouTube channel', placeholder: 'https://www.youtube.com/@name', help: 'Paste the link of the channel or its @name.' } },
  { id: 'twitch', name: 'Twitch', color: '#9146ff', ink: '#ffffff', icon: 'simple-icons:twitch', types: ['live', 'clip'], defaultTypes: ['live'],
    account: { label: 'Twitch channel', placeholder: 'https://www.twitch.tv/name', help: 'Paste the link of the channel or its name.' } },
  { id: 'kick', name: 'Kick', color: '#53fc18', ink: '#101010', icon: 'simple-icons:kick', types: ['live'], defaultTypes: ['live'],
    account: { label: 'Kick channel', placeholder: 'https://kick.com/name', help: 'Paste the link of the channel or its name.' } },
  { id: 'bluesky', name: 'Bluesky', color: '#1185fe', ink: '#ffffff', icon: 'simple-icons:bluesky', types: ['post'], defaultTypes: ['post'],
    account: { label: 'Bluesky account', placeholder: 'name.bsky.social', help: 'Paste the link of the profile or its handle.' } },
  { id: 'reddit', name: 'Reddit', color: '#ff4500', ink: '#ffffff', icon: 'simple-icons:reddit', types: ['post'], defaultTypes: ['post'],
    account: { label: 'Subreddit', placeholder: 'r/minecraft', help: 'Paste the link of the subreddit or write r/name.' } },
  { id: 'steam', name: 'Steam', color: '#66c0f4', ink: '#0b1d2a', icon: 'simple-icons:steam', types: ['post'], defaultTypes: ['post'],
    account: { label: 'Steam game', placeholder: 'https://store.steampowered.com/app/730', help: 'Paste the link of the game in the Steam store.' } },
  { id: 'github', name: 'GitHub', color: '#8b949e', ink: '#101010', icon: 'simple-icons:github', types: ['update'], defaultTypes: ['update'],
    account: { label: 'GitHub repository', placeholder: 'owner/repository', help: 'Paste the link of the repository or write owner/name. Its new releases are posted.' } },
  { id: 'modrinth', name: 'Modrinth', color: '#1bd96a', ink: '#0b2a18', icon: 'simple-icons:modrinth', types: ['update'], defaultTypes: ['update'],
    account: { label: 'Modrinth project', placeholder: 'https://modrinth.com/mod/name', help: 'Paste the link of the mod, plugin or pack.' } },
  { id: 'npm', name: 'npm', color: '#cb3837', ink: '#ffffff', icon: 'simple-icons:npm', types: ['update'], defaultTypes: ['update'],
    account: { label: 'npm package', placeholder: 'discord.js', help: 'Write the name of the package or paste its link.' } },
  { id: 'pypi', name: 'PyPI', color: '#3775a9', ink: '#ffffff', icon: 'simple-icons:pypi', types: ['update'], defaultTypes: ['update'],
    account: { label: 'PyPI package', placeholder: 'requests', help: 'Write the name of the package or paste its link.' } },
  { id: 'anilist', name: 'AniList', color: '#02a9ff', ink: '#ffffff', icon: 'simple-icons:anilist', types: ['episode'], defaultTypes: ['episode'],
    account: { label: 'Anime', placeholder: 'One Piece', help: 'Write the name of the anime or paste its AniList link.' } },
  { id: 'pinterest', name: 'Pinterest', color: '#e60023', ink: '#ffffff', icon: 'simple-icons:pinterest', types: ['pin'], defaultTypes: ['pin'],
    account: { label: 'Pinterest profile or board', placeholder: 'https://www.pinterest.com/name/board', help: 'Paste the link of a profile or of one of its boards.' } },
  { id: 'rss', name: 'RSS', color: '#f26522', ink: '#ffffff', icon: 'simple-icons:rss', types: ['post'], defaultTypes: ['post'],
    account: { label: 'Website or feed', placeholder: 'https://example.com/feed.xml', help: 'Paste the link of a blog, a news site or its RSS feed. Petto finds the feed.' } },
  { id: 'wikipedia', name: 'Wikipedia', color: '#636466', ink: '#ffffff', icon: 'simple-icons:wikipedia', types: ['daily'], defaultTypes: ['daily'], account: null },
  { id: 'chess', name: 'Chess.com', color: '#81b64c', ink: '#101010', icon: 'simple-icons:chessdotcom', types: ['daily'], defaultTypes: ['daily'], account: null },
  { id: 'pokemon', name: 'Pokémon', color: '#ffcb05', ink: '#1a1a1a', icon: 'simple-icons:pokemon', types: ['daily'], defaultTypes: ['daily'], account: null },
];

export const platformById = (id: string) => FEED_PLATFORMS.find((platform) => platform.id === id) ?? null;
/** The platforms that work now (the others are shown as coming soon). */
export const LIVE_PLATFORMS = FEED_PLATFORMS.filter((platform) => !platform.soon);

/** The words and icons of the kinds of notice (English, passed through dt()). */
export const FEED_TYPES: Record<FeedType, { label: string; icon: string }> = {
  video: { label: 'Videos', icon: 'ph:film-strip-fill' },
  short: { label: 'Shorts', icon: 'ph:lightning-fill' },
  live: { label: 'Live streams', icon: 'ph:broadcast-fill' },
  clip: { label: 'Clips', icon: 'ph:film-strip-fill' },
  post: { label: 'Posts', icon: 'ph:newspaper-fill' },
  pin: { label: 'Pins', icon: 'ph:push-pin-fill' },
  update: { label: 'New versions', icon: 'ph:cube-fill' },
  episode: { label: 'New episodes', icon: 'ph:television-fill' },
  daily: { label: 'Of the day', icon: 'ph:star-fill' },
};

/** The variables a feed message understands (the same as the bot: src/feeds/card.js). */
export const FEED_VARIABLES: { tok: string; desc: string }[] = [
  { tok: '{feed.title}', desc: 'Title of the post, video or stream' },
  { tok: '{feed.url}', desc: 'Link to what was published' },
  { tok: '{feed.author}', desc: 'Name of the account' },
  { tok: '{feed.description}', desc: 'Description, when there is one' },
  { tok: '{feed.platform}', desc: 'Name of the platform' },
  { tok: '{feed.image}', desc: 'Link of the cover picture' },
];

export interface FeedRow {
  id: number;
  platform: string;
  accountId: string;
  accountName: string;
  accountAvatar: string | null;
  accountUrl: string | null;
  channelId: string;
  types: string[];
  message: string;
  pingRoles: string[];
  pingEveryone: boolean;
  options: { image?: boolean; button?: boolean };
  filters: { include: string[]; exclude: string[] };
  enabled: boolean;
  ready: boolean;
  failures: number;
  lastSentAt: string | null;
  lastError: string | null;
  createdAt: string;
}

export function feedFromRow(row: any): FeedRow {
  const list = (value: unknown) => (Array.isArray(value) ? value.map(String) : []);
  return {
    id: Number(row.id), platform: String(row.platform), accountId: String(row.account_id), accountName: String(row.account_name ?? ''),
    accountAvatar: row.account_avatar ?? null, accountUrl: row.account_url ?? null, channelId: String(row.channel_id), types: list(row.types),
    message: String(row.message ?? ''), pingRoles: list(row.ping_roles), pingEveryone: row.ping_everyone === true,
    options: row.options && typeof row.options === 'object' ? { image: typeof row.options.image === 'boolean' ? row.options.image : undefined, button: typeof row.options.button === 'boolean' ? row.options.button : undefined } : {},
    filters: { include: list(row.filters?.include), exclude: list(row.filters?.exclude) },
    enabled: row.enabled !== false, ready: row.ready !== false, failures: Number(row.failures) || 0, lastSentAt: row.last_sent_at ?? null,
    lastError: row.last_error ?? null, createdAt: String(row.created_at ?? ''),
  };
}
