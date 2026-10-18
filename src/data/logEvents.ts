// The kinds of events a server can send to its log channels, in the order of the Logging page of the dashboard
// (src/components/DashLogging.astro, where each one has its name and description). The home page counts them.
export const LOG_EVENT_IDS = [
  'sanctions', 'automod', 'verification', 'members', 'messages', 'voice', 'roles', 'channels', 'invites',
  'emojis', 'webhooks', 'threads', 'integrations', 'commands', 'tickets', 'forms', 'server',
] as const;

export type LogEventId = (typeof LOG_EVENT_IDS)[number];
