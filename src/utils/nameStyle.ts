// The display name style of the bot in one server: a font, an effect and one or two colors, like the name styles
// Nitro gives to people. Discord does not document these fields for bots. They are sent in the same call that sets
// the server nickname, avatar, banner and bio, and the ids come from what bot developers have found, so a style that
// Discord does not accept is reported to the person instead of being saved.

export interface NameStyle { fontId: number; effectId: number; colors: number[] }

export const NAME_FONTS = [
  { id: 11, label: 'Default' },
  { id: 1, label: 'Tempo' },
  { id: 3, label: 'Sakura' },
  { id: 4, label: 'Jellybean' },
  { id: 6, label: 'Modern' },
  { id: 7, label: 'Medieval' },
  { id: 8, label: '8bit' },
  { id: 10, label: 'Vampyre' },
] as const;

/**
 * How each font looks on the page (the tiles of the picker and the preview). Discord draws the real ones, these are the closest free fonts, kept in
 * public/fonts/namestyle. The default font is the one of the dashboard.
 */
export const NAME_FONT_STACKS: Record<number, string> = {
  11: 'inherit',
  1: "'Josefin Sans', sans-serif",
  3: "'Caveat', cursive",
  4: "'Chewy', cursive",
  6: "'Fredoka', sans-serif",
  7: "'MedievalSharp', serif",
  8: "'Press Start 2P', monospace",
  10: "'Cormorant Garamond', serif",
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
  const font = NAME_FONTS.find((item) => item.id === Number(value.fontId));
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
