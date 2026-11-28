function sessionAvatar(user, size = 128) {
  const value = String(user.avatar ?? "").trim();
  if (!value) return null;
  if (/^https:\/\/cdn\.discordapp\.com\/avatars\//.test(value)) return value.replace(/\?.*$/, "") + `?size=${size}`;
  if (/^[a-z0-9_]{5,64}$/i.test(value)) return `https://cdn.discordapp.com/avatars/${user.userId}/${value}.png?size=${size}`;
  return null;
}

export { sessionAvatar as s };
