import { v as variables } from './variables.generated_DwJBBG93.mjs';

const BOTS = [
  { id: "mee6", name: "MEE6", verified: true, source: "https://wiki.mee6.xyz/en/plugins/welcome_and_goodbye", checkedOn: "2026-11-18" },
  { id: "carl", name: "Carl-bot", verified: true, source: "https://docs.carl.gg/greetings", checkedOn: "2026-11-18" },
  { id: "dyno", name: "Dyno", verified: true, source: "https://docs.dyno.gg/en/modules/welcome", checkedOn: "2026-11-18" },
  { id: "probot", name: "ProBot", verified: true, source: "https://docs.probot.io/docs/getting-started/variables", checkedOn: "2026-11-18" },
  { id: "nekotina", name: "Nekotina", verified: true, source: "https://nekotina.com/guides/welcome-message", checkedOn: "2026-11-18" },
  { id: "welcomer", name: "Welcomer", verified: false, source: "https://welcomer.gg", checkedOn: "2026-11-18" }
];
const isBotId = (value) => BOTS.some((bot) => bot.id === value);
const petto = /* @__PURE__ */ new Set();
for (const group of variables.en) {
  for (const entry of group.vars) petto.add(entry.tok.replace(/^\{|\}$/g, "").split(/[:(]/)[0].toLowerCase());
}
const FEATURE_PAGES = {
  "welcome": "welcome",
  "reaction-roles": "automation?section=reaction-roles",
  "levels": "leveling?section=settings",
  "custom-commands": "automation?section=custom-commands",
  "autoresponders": "automation?section=autoresponders",
  "polls": "community?section=polls",
  "giveaways": "giveaways?section=settings",
  "feeds": "feeds",
  "birthdays": "birthdays",
  "boards": "boards",
  "timers": "automation?section=timers",
  "voicemaster": "automation?section=voicemaster",
  "moderation": "moderation?section=cases",
  "sticky-roles": "automation?section=sticky-roles",
  "automod": "automod",
  "logging": "logging",
  "suggestions": "suggestions",
  "permissions": "permissions",
  "sticky-messages": "automation?section=sticky-messages",
  "tickets": "tickets?section=panels",
  "forms": "forms",
  "join-roles": "join-roles",
  "prefix": "general?section=settings",
  "embeds": "embeds"
};
const CHECKLISTS = {
  mee6: ["welcome", "reaction-roles", "levels", "custom-commands", "autoresponders", "polls", "giveaways", "feeds", "birthdays", "boards", "timers", "voicemaster", "prefix"],
  carl: ["reaction-roles", "moderation", "sticky-roles", "automod", "logging", "custom-commands", "suggestions", "welcome", "permissions", "boards", "sticky-messages", "feeds", "levels"],
  dyno: ["automod", "tickets", "custom-commands", "autoresponders", "giveaways", "forms", "reaction-roles", "join-roles", "boards", "levels", "timers", "feeds"],
  // The modules of docs.probot.io that have a page in Petto. Colors, Temp Links, Anti-Raid and VIP Protection are left out: they have no page that does the same.
  probot: ["welcome", "autoresponders", "embeds", "levels", "join-roles", "logging", "reaction-roles", "voicemaster", "automod", "boards", "tickets"],
  // What nekotina.com/guides explains: the welcome message, the custom commands and the autoroles. The rest of the bot is not read yet.
  nekotina: ["welcome", "custom-commands", "join-roles"],
  welcomer: []
};
const MOVE_STEPS = ["keep-both", "write-down", "quick-setup", "messages", "features", "test", "remove-old"];

export { BOTS as B, CHECKLISTS as C, FEATURE_PAGES as F, MOVE_STEPS as M, isBotId as i };
