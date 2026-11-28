import { c as catalogCommands, u as useTranslations } from './ui_C1MR3LHJ.mjs';

const PERMISSION_NAMES = [
  [1n << 3n, "Administrator"],
  [1n << 5n, "Manage Server"],
  [1n << 28n, "Manage Roles"],
  [1n << 4n, "Manage Channels"],
  [1n << 2n, "Ban Members"],
  [1n << 1n, "Kick Members"],
  [1n << 40n, "Timeout Members"],
  [1n << 13n, "Manage Messages"],
  [1n << 27n, "Manage Nicknames"],
  [1n << 29n, "Manage Webhooks"],
  [1n << 30n, "Manage Expressions"],
  [1n << 33n, "Manage Events"],
  [1n << 34n, "Manage Threads"],
  [1n << 7n, "View Audit Log"],
  [1n << 22n, "Mute Members"],
  [1n << 24n, "Move Members"],
  [1n << 23n, "Deafen Members"],
  [1n << 17n, "Mention Everyone"],
  [1n << 0n, "Create Invite"]
];
function permissionNames(bits) {
  if (!bits) return [];
  let value;
  try {
    value = BigInt(bits);
  } catch {
    return [];
  }
  if (value === 0n) return [];
  return PERMISSION_NAMES.filter(([flag]) => (value & flag) === flag).map(([, name]) => name);
}
function categoryTitles(lang) {
  const t = useTranslations(lang);
  return Object.fromEntries(t.commandsPage.categories.map((c) => [c.id, c.title]));
}
function accessCommands(lang, rows) {
  const titles = categoryTitles(lang);
  const level = new Map(rows.levels.map((r) => [r.command_name, Number(r.required_level) || 0]));
  const restrict = /* @__PURE__ */ new Map();
  for (const r of rows.restrictions) restrict.set(r.command, [...restrict.get(r.command) ?? [], String(r.role_id)]);
  const server = new Set(rows.disabled.filter((d) => !d.channel_id).map((d) => d.command));
  const channels = /* @__PURE__ */ new Map();
  for (const d of rows.disabled) if (d.channel_id) channels.set(d.command, [...channels.get(d.command) ?? [], String(d.channel_id)]);
  return catalogCommands(lang).filter((c) => c.category !== "roleplay").map((c) => ({
    name: c.name,
    category: c.category,
    categoryTitle: titles[c.category] ?? c.category,
    desc: c.desc,
    aliases: c.aliases,
    slash: c.slash,
    permissions: c.permissions,
    permissionNames: permissionNames(c.permissions),
    level: level.get(c.name) ?? 0,
    restrictRoles: restrict.get(c.name) ?? [],
    disabledServer: server.has(c.name),
    disabledChannels: channels.get(c.name) ?? []
  }));
}
function isSensitive(c) {
  return c.permissionNames.length > 0 || ["moderation", "setup"].includes(c.category);
}

export { PERMISSION_NAMES as P, accessCommands as a, isSensitive as i };
