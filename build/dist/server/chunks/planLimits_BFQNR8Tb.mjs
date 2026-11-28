const FREE_LIMITS = Object.freeze({
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
  feeds: 5
});
const PREMIUM_LIMITS = Object.freeze({
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
  feeds: 25
});
const FREE_STAT_DAYS = [7, 14, 30];
const PREMIUM_STAT_DAYS = [60, 90];
function planLimits(premium) {
  return premium ? PREMIUM_LIMITS : FREE_LIMITS;
}

export { FREE_LIMITS as F, PREMIUM_LIMITS as P, PREMIUM_STAT_DAYS as a, FREE_STAT_DAYS as b, planLimits as p };
