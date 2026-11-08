// The display name style of the bot in one server: a font, an effect and one or two colors, like the name styles
// Nitro gives to people. Discord does not document these fields for bots. They are sent in the same call that sets
// the server nickname, avatar, banner and bio, and the ids come from what bot developers have found, so a style that
// Discord does not accept is reported to the person instead of being saved.

export interface NameStyle { fontId: number; effectId: number; colors: number[] }

/**
 * The fonts Discord has for a display name, with the id it uses (docs.discord.food, Display Name Font). The label is the name Discord shows. Tempo is
 * 12 (Zilla Slab): 1 is a deprecated font (Bangers) that this page sent as Tempo before, see LEGACY_FONT_IDS.
 */
export const NAME_FONTS = [
  { id: 11, label: 'gg sans' },
  { id: 12, label: 'Tempo' },
  { id: 3, label: 'Sakura' },
  { id: 4, label: 'Jellybean' },
  { id: 6, label: 'Modern' },
  { id: 7, label: 'Medieval' },
  { id: 8, label: '8bit' },
  { id: 10, label: 'Vampyre' },
] as const;

/** Ids this page used to send that mean another font now: a style saved with one is read as the new id, and is sent again with it on the next save. */
export const LEGACY_FONT_IDS: Record<number, number> = { 1: 12 };

/**
 * How each font looks on the page (the tiles of the picker and the preview): the same typefaces Discord uses where they are free to host (Zilla Slab, Cherry Bomb One,
 * Chicle, MuseoModerno, Pixelify Sans), and the closest ones for the other two. Kept in public/fonts/namestyle. The default is the font of the dashboard.
 */
export const NAME_FONT_STACKS: Record<number, string> = {
  11: 'inherit',
  12: "'Zilla Slab', serif", // Tempo
  3: "'Cherry Bomb One', cursive", // Sakura
  4: "'Chicle', cursive", // Jellybean
  6: "'MuseoModerno', sans-serif", // Modern
  7: "'MedievalSharp', serif", // Medieval (Discord's is Néo-Castel, which is not on Google Fonts)
  8: "'Pixelify Sans', monospace", // 8bit
  10: "'Cormorant Garamond', serif", // Vampyre (Discord's is Sinistre, which is not on Google Fonts)
};

/** `colors` is how many colors the effect takes: Discord refuses any other number. */
export const NAME_EFFECTS = [
  { id: 1, label: 'Solid', colors: 1 },
  { id: 2, label: 'Gradient', colors: 2 },
  { id: 3, label: 'Neon', colors: 1 },
  { id: 4, label: 'Toon', colors: 1 },
  { id: 5, label: 'Pop', colors: 1 },
  { id: 6, label: 'Glow', colors: 1 },
] as const;

export const DEFAULT_NAME_STYLE: NameStyle = { fontId: 11, effectId: 2, colors: [0x8399ff, 0xff91c2] };

export const hexToInt = (hex: string): number | null => (/^#[0-9a-f]{6}$/i.test(hex.trim()) ? parseInt(hex.trim().slice(1), 16) : null);
export const intToHex = (value: number): string => `#${Math.max(0, Math.min(0xffffff, value)).toString(16).padStart(6, '0')}`;

/** Reads a style from what was saved. Anything that is not a valid style gives null. */
export function readNameStyle(raw: unknown): NameStyle | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Record<string, unknown>;
  const font = NAME_FONTS.find((item) => item.id === (LEGACY_FONT_IDS[Number(value.fontId)] ?? Number(value.fontId)));
  const effect = NAME_EFFECTS.find((item) => item.id === Number(value.effectId));
  if (!font || !effect || !Array.isArray(value.colors)) return null;
  const colors = value.colors.map(Number).filter((color) => Number.isInteger(color) && color >= 0 && color <= 0xffffff);
  return colors.length === effect.colors ? { fontId: font.id, effectId: effect.id, colors } : null;
}

/** Reads the style from the form. Returns `null` for "no style", a style, or an error text key. */
export function parseNameStyleForm(form: FormData): { style: NameStyle | null } | { error: 'name_style_invalid' } {
  const effectId = Number(form.get('name_effect') ?? 0);
  if (!effectId) return { style: null };
  const effect = NAME_EFFECTS.find((item) => item.id === effectId);
  const font = NAME_FONTS.find((item) => item.id === Number(form.get('name_font') ?? 11));
  if (!effect || !font) return { error: 'name_style_invalid' };
  const colors = [hexToInt(String(form.get('name_color_1') ?? ''))];
  if (effect.colors === 2) colors.push(hexToInt(String(form.get('name_color_2') ?? '')));
  if (colors.some((color) => color === null)) return { error: 'name_style_invalid' };
  return { style: { fontId: font.id, effectId: effect.id, colors: colors as number[] } };
}

export const sameNameStyle = (a: NameStyle | null, b: NameStyle | null): boolean => JSON.stringify(a) === JSON.stringify(b);

/** The body Discord's member endpoint takes. No style clears it: ids at 0 and no colors. */
export function nameStyleBody(style: NameStyle | null): Record<string, unknown> {
  return style
    ? { display_name_font_id: style.fontId, display_name_effect_id: style.effectId, display_name_colors: style.colors }
    : { display_name_font_id: 0, display_name_effect_id: 0, display_name_colors: [] };
}

/** The ways of clearing the style, from the cleanest (null) to the one that sets everything to nothing. */
export function nameStyleClearBodies(): Record<string, unknown>[] {
  return [
    { display_name_font_id: null, display_name_effect_id: null, display_name_colors: null },
    { display_name_font_id: 0, display_name_effect_id: 0, display_name_colors: [] },
    { display_name_effect_id: 0, display_name_colors: [] },
  ];
}

/** CSS that approximates the effect for the preview. Discord draws the font and the final look itself. */
export function nameStyleCss(style: NameStyle | null): string {
  if (!style) return '';
  const [first, second] = style.colors.map(intToHex);
  switch (style.effectId) {
    case 2: return `background:linear-gradient(90deg,${first},${second});-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;`;
    case 3: return `color:#fff;text-shadow:0 0 4px ${first},0 0 10px ${first},0 0 18px ${first};`;
    case 4: return `color:${first};-webkit-text-stroke:1px #000;text-shadow:1px 1px 0 #000;`;
    case 5: return `color:${first};text-shadow:2px 2px 0 color-mix(in srgb,${first} 45%,#000);`;
    case 6: return `color:${first};text-shadow:0 0 8px ${first};`;
    default: return `color:${first};`;
  }
}
