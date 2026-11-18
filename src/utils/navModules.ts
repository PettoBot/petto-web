// Which module of the Modules list (src/utils/dashModules.ts) each page of the side menu belongs to, so the menu can show it grey when the module is off and with a
// green dot when it is on. A page that is not a module with an on or off (Audit log, Settings, Permissions, the live tickets...) has none and is drawn as usual.
// A page of a module that has several (the voice leveling, the ticket types...) follows its module. One page can follow more than one module: it is on if any is.

const BY_ID: Record<string, string[]> = {
  // Moderation
  moderation: ['automod'], 'automod-templates': ['automod'], antinuke: ['security'], honeypot: ['honeypot'],
  'role-triggers': ['role-triggers'], 'role-quotas': ['role-quotas'], 'mod-rules': ['mod-rules'],
  // Security and join
  onboarding: ['welcome', 'verification', 'joinroles'], security: ['security'], logging: ['logging'],
  // Design
  embeds: ['embeds'], cards: ['cards'],
  // Automation
  'custom-commands': ['commands'], code: ['commands'], autoresponders: ['autoresponders'], 'reaction-roles': ['reactionroles'], webhooks: ['webhooks'],
  // Community
  tickets: ['tickets'], giveaways: ['giveaways'], birthdays: ['birthdays'], suggestions: ['suggestions'], confessions: ['confessions'], counting: ['counting'],
  'activity-boards': ['activity-boards'], boards: ['starboard'], forms: ['forms'], counters: ['counters'],
};
const PREFIXES: [string, string[]][] = [
  ['leveling', ['leveling']], ['tickets-', ['tickets']], ['giveaways-', ['giveaways']], ['forms-', ['forms']],
];

/** The modules that decide the state of a page of the menu (empty: the page has no on or off). */
export function navModulesOf(itemId: string): string[] {
  if (BY_ID[itemId]) return BY_ID[itemId];
  for (const [prefix, modules] of PREFIXES) if (itemId.startsWith(prefix)) return modules;
  return [];
}
