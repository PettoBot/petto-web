// The pictures a server can pick for Petto's avatar and banner without having one of its own (Customize, the picker the pencils open).
// Each one is a link: picking it fills the same field a pasted link fills, so it is saved, fetched and sent to Discord the same way.
// `src` starting with / is a file of this site (the page adds its address); anything else is already a full link.

export interface Preset { id: string; label: string; src: string }
export interface PresetGroup { id: string; label: string; items: Preset[] }

const local = (id: string, label: string, src: string): Preset => ({ id, label, src });
const discordAvatar = (n: number): Preset => ({ id: `discord-${n}`, label: `Discord ${n + 1}`, src: `https://cdn.discordapp.com/embed/avatars/${n}.png` });

/**
 * The first group is the recommended one: Petto as it is by default and in each season (more are added here as they are made: Easter and so on).
 * The pictures are in public/assets/presets.
 */
export function avatarPresetGroups(): PresetGroup[] {
  const recommended: Preset[] = [
    local('default', 'Default', '/assets/presets/avatar-default.png'),
    local('christmas', 'Christmas', '/assets/presets/avatar-christmas.png'),
    local('halloween', 'Halloween', '/assets/presets/avatar-halloween.png'),
  ];
  const hats: Preset[] = [
    local('coral', 'Coral hat', '/assets/mascot-icon.png'),
    local('blue', 'Blue hat', '/assets/duck-blue.png'),
    local('green', 'Green hat', '/assets/duck-green.png'),
    local('red', 'Red hat', '/assets/duck-red.png'),
    local('crown', 'Crown', '/assets/brand/duck-crown.png'),
    local('bowl', 'Bowl', '/assets/brand/duck-bowl.png'),
  ];
  const friends: Preset[] = [
    ['bambu', 'Bambu'], ['bellota', 'Bellota'], ['chispa', 'Chispa'], ['copo', 'Copo'], ['lili', 'Lili'],
    ['luna', 'Luna'], ['miel', 'Miel'], ['nube', 'Nube'], ['pipo', 'Pipo'],
  ].map(([id, label]) => local(id, label, `/assets/brand/characters/${id}.png`));
  return [
    { id: 'recommended', label: 'Recommended', items: recommended },
    { id: 'petto', label: 'Petto', items: hats },
    { id: 'friends', label: 'Friends of Petto', items: friends },
    { id: 'discord', label: 'Discord', items: [0, 1, 2, 3, 4, 5].map(discordAvatar) },
  ];
}

/** `current` is Petto's own banner on Discord right now, when it has one. */
export function bannerPresetGroups(current: string | null): PresetGroup[] {
  const petto: Preset[] = [
    ...(current ? [{ id: 'current', label: 'Petto now', src: current }] : []),
    local('petto', 'Petto', '/assets/dash-banner-petto.webp'),
    local('link', 'Petto dark', '/assets/petto-link-banner-min.png'),
  ];
  const colors: Preset[] = ['coral', 'blurple', 'green', 'yellow', 'red', 'pink', 'grey', 'night']
    .map((id) => local(id, id[0].toUpperCase() + id.slice(1), `/assets/presets/banner-${id}.png`));
  return [
    { id: 'petto', label: 'Petto', items: petto },
    { id: 'colors', label: 'Colors', items: colors },
  ];
}
