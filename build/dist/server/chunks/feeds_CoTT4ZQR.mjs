const FEEDS_ON_PREMIUM_PAGE = true;
const ANNOUNCING_PLATFORMS = /* @__PURE__ */ new Set(["youtube", "twitch", "kick", "bluesky", "modrinth", "mastodon", "tumblr", "letterboxd", "github", "npm", "pypi", "steam", "spotify", "deezer", "applemusic"]);
const FEED_PLATFORMS = [
  {
    id: "youtube",
    name: "YouTube",
    color: "#ff0000",
    ink: "#ffffff",
    icon: "simple-icons:youtube",
    types: ["video", "short", "live"],
    defaultTypes: ["video", "short", "live"],
    account: { label: "YouTube channel", placeholder: "https://www.youtube.com/@name", help: "Paste the link of the channel or its @name." }
  },
  {
    id: "twitch",
    name: "Twitch",
    color: "#9146ff",
    ink: "#ffffff",
    icon: "simple-icons:twitch",
    types: ["live", "clip"],
    defaultTypes: ["live"],
    account: { label: "Twitch channel", placeholder: "https://www.twitch.tv/name", help: "Paste the link of the channel or its name." }
  },
  {
    id: "kick",
    name: "Kick",
    color: "#53fc18",
    ink: "#101010",
    icon: "simple-icons:kick",
    types: ["live"],
    defaultTypes: ["live"],
    account: { label: "Kick channel", placeholder: "https://kick.com/name", help: "Paste the link of the channel or its name." }
  },
  {
    id: "bluesky",
    name: "Bluesky",
    color: "#1185fe",
    ink: "#ffffff",
    icon: "simple-icons:bluesky",
    types: ["post"],
    defaultTypes: ["post"],
    account: { label: "Bluesky account", placeholder: "name.bsky.social", help: "Paste the link of the profile or its handle." }
  },
  {
    id: "mastodon",
    name: "Mastodon",
    color: "#6364ff",
    ink: "#ffffff",
    icon: "simple-icons:mastodon",
    types: ["post"],
    defaultTypes: ["post"],
    account: { label: "Mastodon account", placeholder: "@name@mastodon.social", help: "Mastodon is a social network like X, but made of many servers (mastodon.social, mastodon.online…). Write the account as @name@server, for example @Gargron@mastodon.social, or paste the link of its profile. Each new public post is shared." }
  },
  {
    id: "reddit",
    name: "Reddit",
    color: "#ff4500",
    ink: "#ffffff",
    icon: "simple-icons:reddit",
    types: ["post"],
    defaultTypes: ["post"],
    account: { label: "Subreddit", placeholder: "r/minecraft", help: "Paste the link of the subreddit or write r/name." }
  },
  {
    id: "tumblr",
    name: "Tumblr",
    color: "#36465d",
    ink: "#ffffff",
    icon: "simple-icons:tumblr",
    types: ["post"],
    defaultTypes: ["post"],
    account: { label: "Tumblr blog", placeholder: "name.tumblr.com", help: "Write the name of the blog (name.tumblr.com) or paste its link. Each new post of the blog is shared." }
  },
  {
    id: "steam",
    name: "Steam",
    color: "#66c0f4",
    ink: "#0b1d2a",
    icon: "simple-icons:steam",
    types: ["post"],
    defaultTypes: ["post"],
    account: { label: "Steam game or list", placeholder: "https://store.steampowered.com/app/730", help: 'Search a game or paste the link of its Steam store page to follow its news. Or type "new" for the new releases of the store, "top" for the top sellers, or "coming soon". Those lists can be busy.' }
  },
  {
    id: "epic",
    name: "Epic Games",
    color: "#ffffff",
    ink: "#101010",
    icon: "simple-icons:epicgames",
    types: ["game"],
    defaultTypes: ["game"],
    account: null,
    intro: "Tells you when Epic Games gives a game for free, and when the next one comes."
  },
  {
    id: "github",
    name: "GitHub",
    color: "#8b949e",
    ink: "#101010",
    icon: "simple-icons:github",
    types: ["update"],
    defaultTypes: ["update"],
    account: { label: "GitHub repository", placeholder: "owner/repository", help: "Paste the link of the repository or write owner/name. Its new releases are posted." }
  },
  {
    id: "modrinth",
    name: "Modrinth",
    color: "#1bd96a",
    ink: "#0b2a18",
    icon: "simple-icons:modrinth",
    types: ["update", "project"],
    defaultTypes: ["update", "project"],
    account: { label: "Modrinth project or list", placeholder: "https://modrinth.com/mod/name", help: 'Search a project or paste the link of the mod, plugin or pack to follow its versions. Or type "new" (or "new mods", "new shaders"…) for the newest projects of Modrinth. That list can be busy.' }
  },
  {
    id: "npm",
    name: "npm",
    color: "#cb3837",
    ink: "#ffffff",
    icon: "simple-icons:npm",
    types: ["update"],
    defaultTypes: ["update"],
    account: { label: "npm package", placeholder: "discord.js", help: "Write the name of the package or paste its link." }
  },
  {
    id: "pypi",
    name: "PyPI",
    color: "#3775a9",
    ink: "#ffffff",
    icon: "simple-icons:pypi",
    types: ["update"],
    defaultTypes: ["update"],
    account: { label: "PyPI package", placeholder: "requests", help: "Write the name of the package or paste its link." }
  },
  {
    id: "anilist",
    name: "AniList",
    color: "#02a9ff",
    ink: "#ffffff",
    icon: "simple-icons:anilist",
    types: ["episode"],
    defaultTypes: ["episode"],
    account: { label: "Anime", placeholder: "One Piece", help: "Write the name of the anime or paste its AniList link." }
  },
  {
    id: "letterboxd",
    name: "Letterboxd",
    color: "#00e054",
    ink: "#0b2a18",
    icon: "simple-icons:letterboxd",
    types: ["post"],
    defaultTypes: ["post"],
    account: { label: "Letterboxd user", placeholder: "https://letterboxd.com/name", help: "Write the user name or paste the link of the profile. What they watch and write is posted." }
  },
  {
    id: "pinterest",
    name: "Pinterest",
    color: "#e60023",
    ink: "#ffffff",
    icon: "simple-icons:pinterest",
    types: ["pin"],
    defaultTypes: ["pin"],
    account: { label: "Pinterest profile or board", placeholder: "https://www.pinterest.com/name/board", help: "Paste the link of a profile or of one of its boards." }
  },
  {
    id: "spotify",
    name: "Spotify",
    color: "#1db954",
    ink: "#0b1d12",
    icon: "simple-icons:spotify",
    types: ["release", "episode"],
    defaultTypes: ["release", "episode"],
    account: { label: "Artist, podcast or playlist", placeholder: "https://open.spotify.com/…", help: 'Search an artist, a podcast or a playlist, or paste a Spotify link: of an artist, a playlist, or a song or album (Petto follows its artist). Type "new" for the new albums of a country, like "new colombia".' }
  },
  {
    id: "deezer",
    name: "Deezer",
    color: "#a238ff",
    ink: "#ffffff",
    icon: "simple-icons:deezer",
    types: ["release"],
    defaultTypes: ["release"],
    account: { label: "Artist, playlist or top", placeholder: "https://www.deezer.com/…", help: 'Search an artist or a playlist, or paste a Deezer link: of an artist, a playlist, or a song or album (Petto follows its artist). Type "top" for the charts, like "top rock".' }
  },
  {
    id: "applemusic",
    name: "Apple Music",
    color: "#fa243c",
    ink: "#ffffff",
    icon: "simple-icons:applemusic",
    types: ["release"],
    defaultTypes: ["release"],
    account: { label: "Artist or top", placeholder: "https://music.apple.com/…", help: 'Search an artist, or paste an Apple Music link of an artist, a song or an album (Petto follows its artist). Type "top" for the charts of a country, like "top colombia". Apple does not let bots follow playlists.' }
  },
  {
    id: "rss",
    name: "RSS",
    color: "#f26522",
    ink: "#ffffff",
    icon: "simple-icons:rss",
    types: ["post"],
    defaultTypes: ["post"],
    account: { label: "Website or feed", placeholder: "https://example.com/feed.xml", help: "Paste the link of a blog, a news site or its RSS feed. Petto finds the feed." }
  },
  {
    id: "wikipedia",
    name: "Wikipedia",
    color: "#636466",
    ink: "#ffffff",
    icon: "simple-icons:wikipedia",
    types: ["daily"],
    defaultTypes: ["daily"],
    account: null,
    pace: true,
    intro: "The featured article of Wikipedia, every so often."
  },
  { id: "cat", name: "Cats", color: "#f5a524", ink: "#1a1100", icon: "ph:cat-fill", types: ["photo"], defaultTypes: ["photo"], account: null, pace: true, hidden: true },
  { id: "dog", name: "Dogs", color: "#b7791f", ink: "#1a1100", icon: "ph:dog-fill", types: ["photo"], defaultTypes: ["photo"], account: null, pace: true, hidden: true },
  { id: "fox", name: "Foxes", color: "#ff7a1a", ink: "#1a0d00", icon: "ph:paw-print-fill", types: ["photo"], defaultTypes: ["photo"], account: null, pace: true, hidden: true },
  { id: "bird", name: "Birds", color: "#38bdf8", ink: "#041824", icon: "ph:bird-fill", types: ["photo"], defaultTypes: ["photo"], account: null, pace: true, hidden: true },
  { id: "duck", name: "Ducks", color: "#facc15", ink: "#1f1700", icon: "ph:feather-fill", types: ["photo"], defaultTypes: ["photo"], account: null, pace: true, hidden: true },
  { id: "capybara", name: "Capybaras", color: "#a16207", ink: "#ffffff", icon: "ph:leaf-fill", types: ["photo"], defaultTypes: ["photo"], account: null, pace: true, hidden: true },
  { id: "bunny", name: "Bunnies", color: "#f9a8d4", ink: "#2a0a18", icon: "ph:rabbit-fill", types: ["photo"], defaultTypes: ["photo"], account: null, pace: true, hidden: true },
  {
    id: "animals",
    name: "Animals",
    color: "#9b7bff",
    ink: "#10062b",
    icon: "ph:paw-print-fill",
    types: ["photo"],
    defaultTypes: ["photo"],
    account: null,
    pace: true,
    extra: "kinds",
    intro: "A picture of an animal every so often. Pick which ones, or leave them all."
  },
  {
    id: "randommusic",
    name: "Random music",
    color: "#a238ff",
    ink: "#ffffff",
    icon: "ph:shuffle-fill",
    types: ["track"],
    defaultTypes: ["track"],
    account: null,
    pace: true,
    intro: "A song picked at random from Deezer, Apple Music and Spotify, every so often."
  },
  {
    id: "pictures",
    name: "Pictures",
    color: "#ff6fa5",
    ink: "#2a0a18",
    icon: "ph:image-fill",
    types: ["photo"],
    defaultTypes: ["photo"],
    account: null,
    pace: true,
    extra: "tags",
    intro: "A picture of what you write (a color, a thing, a mood, anime roses), every so often. Pinterest has no public search, so Petto searches several places for safe pictures: Wallhaven and Safebooru for anime, Google, Pixabay, Pexels and Unsplash when the bot has their keys, Openverse and Flickr."
  },
  {
    id: "chess",
    name: "Chess.com",
    color: "#81b64c",
    ink: "#101010",
    icon: "simple-icons:chessdotcom",
    types: ["daily"],
    defaultTypes: ["daily"],
    account: null,
    pace: true,
    intro: "The daily chess puzzle of Chess.com, every so often."
  },
  {
    id: "pokemon",
    name: "Pokémon",
    color: "#ffcb05",
    ink: "#1a1a1a",
    icon: "simple-icons:pokemon",
    types: ["daily"],
    defaultTypes: ["daily"],
    account: null,
    pace: true,
    intro: "A Pokémon from the Pokédex, every so often."
  }
];
const LOCKED_PLATFORMS = [
  { id: "x", name: "X", color: "#111111", ink: "#ffffff", icon: "simple-icons:x", reason: "X charges for its API, so following accounts there has a monthly cost." },
  { id: "instagram", name: "Instagram", color: "#e1306c", ink: "#ffffff", icon: "simple-icons:instagram", reason: "Instagram has no public way to follow an account; a paid provider is needed." },
  { id: "tiktok", name: "TikTok", color: "#010101", ink: "#ffffff", icon: "simple-icons:tiktok", reason: "TikTok has no public way to follow an account; a paid provider is needed." }
];
const FEED_PACES = [
  { minutes: 1440, label: "Once a day" },
  { minutes: 720, label: "Every 12 hours" },
  { minutes: 360, label: "Every 6 hours" },
  { minutes: 180, label: "Every 3 hours" },
  { minutes: 60, label: "Every hour" },
  { minutes: 30, label: "Every 30 minutes" },
  { minutes: 15, label: "Every 15 minutes" },
  { minutes: 5, label: "Every 5 minutes" }
];
const paceOf = (accountId) => {
  const match = /^every:(\d+)(?::[a-z0-9+_-]*)?$/.exec(accountId);
  return match ? Number(match[1]) : 1440;
};
const ANIMAL_KINDS = [
  { id: "cat", label: "Cats", icon: "ph:cat-fill" },
  { id: "dog", label: "Dogs", icon: "ph:dog-fill" },
  { id: "fox", label: "Foxes", icon: "ph:paw-print-fill" },
  { id: "bird", label: "Birds", icon: "ph:bird-fill" },
  { id: "duck", label: "Ducks", icon: "ph:feather-fill" },
  { id: "capybara", label: "Capybaras", icon: "ph:leaf-fill" },
  { id: "bunny", label: "Bunnies", icon: "ph:rabbit-fill" }
];
const ANIMAL_PLATFORM_IDS = ["animals", ...ANIMAL_KINDS.map((kind) => kind.id)];
const platformGroup = (id) => id === "animals" ? ANIMAL_PLATFORM_IDS : [id];
const platformById = (id) => FEED_PLATFORMS.find((platform) => platform.id === id) ?? null;
FEED_PLATFORMS.filter((platform) => !platform.soon);
const FEED_TYPES = {
  video: { label: "Videos", icon: "ph:film-strip-fill" },
  short: { label: "Shorts", icon: "ph:lightning-fill" },
  live: { label: "Live streams", icon: "ph:broadcast-fill" },
  clip: { label: "Clips", icon: "ph:film-strip-fill" },
  post: { label: "Posts", icon: "ph:newspaper-fill" },
  pin: { label: "Pins", icon: "ph:push-pin-fill" },
  update: { label: "New versions", icon: "ph:cube-fill" },
  episode: { label: "New episodes", icon: "ph:television-fill" },
  release: { label: "New releases", icon: "ph:music-notes-fill" },
  track: { label: "Random songs", icon: "ph:shuffle-fill" },
  project: { label: "New projects", icon: "ph:package-fill" },
  game: { label: "Free games", icon: "ph:game-controller-fill" },
  photo: { label: "Photos", icon: "ph:camera-fill" },
  daily: { label: "Of the day", icon: "ph:star-fill" }
};
const FEED_VARIABLES = [
  { tok: "{feed.title}", desc: "Title of the post, video or stream" },
  { tok: "{feed.url}", desc: "Link to what was published" },
  { tok: "{feed.author}", desc: "Name of the account" },
  { tok: "{feed.description}", desc: "Description, when there is one" },
  { tok: "{feed.platform}", desc: "Name of the platform" },
  { tok: "{feed.image}", desc: "Link of the cover picture" }
];
function feedFromRow(row) {
  const list = (value) => Array.isArray(value) ? value.map(String) : [];
  return {
    id: Number(row.id),
    platform: String(row.platform),
    accountId: String(row.account_id),
    accountName: String(row.account_name ?? ""),
    accountAvatar: row.account_avatar ?? null,
    accountUrl: row.account_url ?? null,
    channelId: String(row.channel_id),
    types: list(row.types),
    message: String(row.message ?? ""),
    pingRoles: list(row.ping_roles),
    pingEveryone: row.ping_everyone === true,
    options: row.options && typeof row.options === "object" ? { image: typeof row.options.image === "boolean" ? row.options.image : void 0, button: typeof row.options.button === "boolean" ? row.options.button : void 0, player: typeof row.options.player === "boolean" ? row.options.player : void 0, reactions: Array.isArray(row.options.reactions) ? row.options.reactions.filter((entry) => typeof entry === "string").slice(0, 5) : void 0 } : {},
    filters: { include: list(row.filters?.include), exclude: list(row.filters?.exclude) },
    enabled: row.enabled !== false,
    ready: row.ready !== false,
    failures: Number(row.failures) || 0,
    lastSentAt: row.last_sent_at ?? null,
    lastError: row.last_error ?? null,
    lastErrorAt: row.last_error_at ?? null,
    lastErrorDetail: row.last_error_detail ? String(row.last_error_detail).slice(0, 500) : null,
    createdAt: String(row.created_at ?? "")
  };
}

export { ANIMAL_PLATFORM_IDS as A, FEED_PLATFORMS as F, LOCKED_PLATFORMS as L, platformGroup as a, FEED_PACES as b, FEED_TYPES as c, ANNOUNCING_PLATFORMS as d, paceOf as e, FEED_VARIABLES as f, ANIMAL_KINDS as g, feedFromRow as h, FEEDS_ON_PREMIUM_PAGE as i, platformById as p };
