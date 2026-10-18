// What each plan can have per server. The same numbers as the bot (petto-bot src/db/premium.js FREE_LIMITS and
// PREMIUM_LIMITS): the dashboard blocks at the same count the bot does, and the Premium page shows these. Change both together.
export interface PlanLimits {
  customCommands: number;
  autoResponders: number;
  ticketCategories: number;
  levelRewards: number;
  giveawayPresets: number;
  logRoutes: number;
  imageCards: number;
  cardAssets: number;
  partnerChannels: number;
  buttonResponders: number;
  uploadChannels: number;
  componentPanels: number;
  counters: number;
}

export const FREE_LIMITS: Readonly<PlanLimits> = Object.freeze({
  customCommands: 100,
  autoResponders: 30,
  ticketCategories: 10,
  levelRewards: 20,
  giveawayPresets: 6,
  logRoutes: 20,
  imageCards: 6,
  cardAssets: 10,
  partnerChannels: 12,
  buttonResponders: 40,
  uploadChannels: 40,
  componentPanels: 20,
  counters: 12,
});

export const PREMIUM_LIMITS: Readonly<PlanLimits> = Object.freeze({
  customCommands: 250,
  autoResponders: 150,
  ticketCategories: 50,
  levelRewards: 100,
  giveawayPresets: 30,
  logRoutes: Number.POSITIVE_INFINITY,
  imageCards: 60,
  cardAssets: 120,
  partnerChannels: 50,
  buttonResponders: 500,
  uploadChannels: 200,
  componentPanels: 100,
  counters: 50,
});

/** The limits of a server by its plan. */
export function planLimits(premium: boolean): Readonly<PlanLimits> {
  return premium ? PREMIUM_LIMITS : FREE_LIMITS;
}
