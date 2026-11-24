// The picture of the person who is logged in. The session keeps the whole address of the Discord avatar (the login saves it that way), but an older session may keep only the
// hash: both give a good address here, at the size the page asks for. Pages that built `cdn.discordapp.com/avatars/<id>/<address>` by hand got a broken picture.
export function sessionAvatar(user: { userId: string; avatar?: string | null }, size = 128): string | null {
  const value = String(user.avatar ?? '').trim();
  if (!value) return null;
  if (/^https:\/\/cdn\.discordapp\.com\/avatars\//.test(value)) return value.replace(/\?.*$/, '') + `?size=${size}`;
  if (/^[a-z0-9_]{5,64}$/i.test(value)) return `https://cdn.discordapp.com/avatars/${user.userId}/${value}.png?size=${size}`;
  return null;
}
