// What Quick Setup of the dashboard sends to the bot, cleaned: only the six modules it knows, ids that look like ids, and short texts. The bot checks it
// again (utils/quickSetup.ts of the bot) and does what it can with what is left.
export const SETUP_MODULES = ['moderation', 'automod', 'welcome', 'autorole', 'tickets', 'verification'] as const;
export type SetupModule = (typeof SETUP_MODULES)[number];

const SNOWFLAKE = /^\d{15,25}$/;
/** `new` (make one) or the id of a channel or role; anything else is nothing. */
const pick = (value: unknown): string | null => (value === 'new' ? 'new' : SNOWFLAKE.test(String(value ?? '')) ? String(value) : null);
const text = (value: unknown, max: number): string => String(value ?? '').replace(/\u0000/g, '').replace(/\r\n?/g, '\n').trim().slice(0, max);

export interface CleanSetup {
  modules: Record<SetupModule, boolean>;
  moderation: { log_channel: string | null };
  automod: { spam: boolean; invites: boolean; scam: boolean; links: boolean };
  welcome: { channel: string | null; message: string; goodbye: boolean };
  autorole: { role: string | null };
  tickets: { channel: string | null; support_role: string | null };
}

export function cleanQuickSetup(raw: unknown): CleanSetup {
  const o: any = raw && typeof raw === 'object' ? raw : {};
  const modules = Object.fromEntries(SETUP_MODULES.map((module) => [module, o.modules?.[module] === true])) as Record<SetupModule, boolean>;
  return {
    modules,
    moderation: { log_channel: pick(o.moderation?.log_channel) },
    automod: { spam: o.automod?.spam !== false, invites: o.automod?.invites === true, scam: o.automod?.scam === true, links: o.automod?.links === true },
    welcome: { channel: pick(o.welcome?.channel), message: text(o.welcome?.message, 1800), goodbye: o.welcome?.goodbye === true },
    autorole: { role: pick(o.autorole?.role) },
    tickets: { channel: pick(o.tickets?.channel), support_role: pick(o.tickets?.support_role) },
  };
}
