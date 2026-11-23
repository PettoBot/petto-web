// The rank card a person designs for themselves (page /dash/rank). These are the same rules as the bot's (utils/userRankCard.ts in petto-bot): what the person chooses, how it
// becomes the settings of the card, and what costs ceramos. The preview on the page draws the card with the same layers the bot draws; keep the two in step when one changes.
export interface RankCardSettings {
  barColor: string;
  barColor2: string | null;
  textColor: string | null;
  font: string;
  layout: 'side' | 'below';
  avatarShape: 'circle' | 'rounded' | 'square';
  theme: 'dark' | 'light';
  /** `default`, `banner` (the banner of the profile that is on), `shop:<id>` (a banner of the shop) or `design:<id>` (a design of Petto). */
  background: string;
}

export const DEFAULTS: RankCardSettings = { barColor: '#ffb199', barColor2: null, textColor: null, font: 'Poppins', layout: 'side', avatarShape: 'circle', theme: 'dark', background: 'default' };
export const GRADIENT_PRICE = 40;
export const BAR_COLORS = ['#ffb199', '#a5ea7a', '#7cb7ff', '#c4a5ff', '#ffd23f', '#ff6b8a'];
export const TEXT_COLORS = ['#ffffff', '#ffd6e0', '#bfe3ff', '#b8f5a0', '#ffe9a8'];
const HEX = /^#[0-9a-f]{6}$/i;
export const isHex = (value: unknown): value is string => typeof value === 'string' && HEX.test(value.trim());

/** The basic settings of the rank card for these choices (what the bot gives to its card renderer). */
export function toBasic(settings: RankCardSettings): Record<string, unknown> {
  const light = settings.theme === 'light';
  return {
    preset: settings.layout === 'below' ? 'rankBottom' : 'rank',
    accent: settings.barColor,
    ...(settings.barColor2 ? { accent2: settings.barColor2 } : {}),
    textColor: settings.textColor ?? (light ? '#111827' : '#ffffff'),
    font: settings.font,
    avatarShape: settings.avatarShape,
    ...(light ? { panelColor: '#ffffff', panelOpacity: 0.72 } : {}),
  };
}

/** What saving `next` costs: the two-color bar the first time. */
export const costOf = (next: RankCardSettings, gradientPaid: boolean): number => (next.barColor2 && !gradientPaid ? GRADIENT_PRICE : 0);
