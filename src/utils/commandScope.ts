// Where and for whom a custom command works (the form of the commands page of the dashboard): the channels and roles it is allowed in or blocked from, the NSFW switch, and the
// "restricted" switch (a member who is not a moderator is answered in another channel). It is kept in the `options` of the command, the same field the commands in code
// use for their own lists, and the bot reads it (utils/commandScope.js of petto-bot). Only the fields of this form are written: what else the options hold is kept.

export interface CommandScope {
  allowChannels: string[];
  blockChannels: string[];
  allowRoles: string[];
  blockRoles: string[];
  nsfw: boolean;
  restricted: boolean;
  restrictedChannel: string | null;
}

export const MAX_SCOPE_IDS = 25;
const ID = /^\d{15,25}$/;

const idsOf = (value: unknown): string[] => (Array.isArray(value) ? [...new Set(value.map(String).filter((id) => ID.test(id)))].slice(0, MAX_SCOPE_IDS) : []);

/** The scope saved in the options of a command (nothing saved: it works everywhere for everybody). */
export function scopeOf(options: unknown): CommandScope {
  const raw = options && typeof options === 'object' && !Array.isArray(options) ? (options as Record<string, unknown>) : {};
  return {
    allowChannels: idsOf(raw.allowChannels), blockChannels: idsOf(raw.blockChannels), allowRoles: idsOf(raw.allowRoles), blockRoles: idsOf(raw.blockRoles),
    nsfw: raw.nsfw === true, restricted: raw.restricted === true, restrictedChannel: ID.test(String(raw.restrictedChannel ?? '')) ? String(raw.restrictedChannel) : null,
  };
}

/** Whether the scope limits the command at all. */
export function isScoped(scope: CommandScope): boolean {
  return scope.allowChannels.length > 0 || scope.blockChannels.length > 0 || scope.allowRoles.length > 0 || scope.blockRoles.length > 0 || scope.nsfw || (scope.restricted && scope.restrictedChannel !== null);
}

/** Reads the fields of the scope form (`scope_allow_channels`, `scope_block_channels`, `scope_allow_roles`, `scope_block_roles`, `scope_nsfw`, `scope_restricted`, `scope_restricted_channel`). */
export function scopeFromForm(form: FormData): CommandScope {
  const ids = (name: string) => idsOf(form.getAll(name));
  const restrictedChannel = String(form.get('scope_restricted_channel') ?? '');
  const restricted = form.has('scope_restricted') && ID.test(restrictedChannel);
  return {
    allowChannels: ids('scope_allow_channels'), blockChannels: ids('scope_block_channels'), allowRoles: ids('scope_allow_roles'), blockRoles: ids('scope_block_roles'),
    nsfw: form.has('scope_nsfw'), restricted, restrictedChannel: ID.test(restrictedChannel) ? restrictedChannel : null,
  };
}

/** The options to save: the ones the command had, with the fields of the scope replaced. */
export function withScope(existing: unknown, scope: CommandScope): Record<string, unknown> {
  const base = existing && typeof existing === 'object' && !Array.isArray(existing) ? { ...(existing as Record<string, unknown>) } : {};
  return { ...base, ...scope };
}
