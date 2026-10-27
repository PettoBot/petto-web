// What each plan can have per server. The same numbers as the bot (petto-bot src/db/premium.js FREE_LIMITS and
// PREMIUM_LIMITS): the dashboard blocks at the same count the bot's commands do, and the Premium page shows these. Change both
// together. Free is generous on purpose and Premium is about twice as much: nothing important needs Premium. Moderation, automod,
// anti-nuke, verification, logging, level rewards, backups, forms and appeals have no Premium limit at all.
export interface PlanLimits {
  customCommands: number;
  autoResponders: number;
  ticketCategories: number;
  giveawayPresets: number;
  imageCards: number;
  cardAssets: number;
  partnerChannels: number;
  buttonResponders: number;
  uploadChannels: number;
  componentPanels: number;
  counters: number;
  paginationMessages: number;
  /** Accounts a server follows in Feeds, for each platform (3 of YouTube, 3 of Twitch...). */
  feeds: number;
}

export const FREE_LIMITS: Readonly<PlanLimits> = Object.freeze({
  customCommands: 125,
  autoResponders: 75,
  ticketCategories: 25,
  giveawayPresets: 15,
  imageCards: 30,
  cardAssets: 50,
  partnerChannels: 25,
  buttonResponders: 250,
  uploadChannels: 100,
  componentPanels: 50,
  counters: 25,
  paginationMessages: 25,
  feeds: 5,
});

export const PREMIUM_LIMITS: Readonly<PlanLimits> = Object.freeze({
  customCommands: 250,
  autoResponders: 150,
  ticketCategories: 50,
  giveawayPresets: 30,
  imageCards: 60,
  cardAssets: 120,
  partnerChannels: 50,
  buttonResponders: 500,
  uploadChannels: 200,
  componentPanels: 100,
  counters: 50,
  paginationMessages: 50,
  feeds: 25,
});

/** The periods of the Statistics page: every server sees these, and Premium also the longer ones (the bot keeps every day). */
export const FREE_STAT_DAYS = [7, 14, 30] as const;
export const PREMIUM_STAT_DAYS = [60, 90] as const;

/** The limits of a server by its plan. */
export function planLimits(premium: boolean): Readonly<PlanLimits> {
  return premium ? PREMIUM_LIMITS : FREE_LIMITS;
}
