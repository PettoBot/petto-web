// The buttons of reaction roles, as Discord takes them. It follows the rules of the bot (interactions/reactionRoleButton.js): the color
// the builder chose or the one of the mode, a button with only an emoji, a button with no emoji, and the rows.
export interface RoleButtonRow {
  id: number;
  emoji: string;
  role_id: string;
  mode: string;
  button_label?: string | null;
  button_style?: number | null;
  button_row?: number | null;
  button_position?: number | null;
}

export const MAX_ROWS = 5;
export const PER_ROW = 5;
export const MAX_BUTTONS = 25;
/** An emoji that starts with this is a button with no emoji; it keeps the pair message + emoji unique. */
export const NO_EMOJI = /^label:/;

export function discordButtonEmoji(value: string): { id?: string; name: string; animated?: boolean } | undefined {
  if (!value || NO_EMOJI.test(value)) return undefined;
  const custom = value.match(/^<(a?):(\w+):(\d+)>$/);
  return custom ? { id: custom[3], name: custom[2], animated: custom[1] === 'a' } : { name: value };
}

const STYLE_BY_MODE: Record<string, number> = { add: 3, remove: 4 };

export function buttonStyleOf(row: Pick<RoleButtonRow, 'button_style' | 'mode'>): number {
  const chosen = Number(row.button_style);
  if (chosen >= 1 && chosen <= 4) return chosen;
  return STYLE_BY_MODE[row.mode] ?? 1;
}

/** The buttons in the rows of the message: the rows that were set, in order, and what has no row after them, five to a row. */
export function placeInRows<T extends RoleButtonRow>(buttons: T[]): T[][] {
  const byPlace = (a: T, b: T) => (Number(a.button_position ?? 0) - Number(b.button_position ?? 0)) || (Number(a.id) - Number(b.id));
  const explicit = new Map<number, T[]>();
  const loose: T[] = [];
  for (const row of [...buttons].sort(byPlace)) {
    const place = Number(row.button_row);
    if (row.button_row !== null && row.button_row !== undefined && Number.isInteger(place) && place >= 0 && place < MAX_ROWS && (explicit.get(place)?.length ?? 0) < PER_ROW) {
      explicit.set(place, [...(explicit.get(place) ?? []), row]);
    } else loose.push(row);
  }
  const rows = [...explicit.keys()].sort((a, b) => a - b).map((key) => explicit.get(key) as T[]);
  for (let index = 0; index < loose.length; index += PER_ROW) rows.push(loose.slice(index, index + PER_ROW));
  return rows;
}

/** The action rows of Discord for the buttons of a message, or the reason why they do not fit. */
export function buildRoleButtonComponents(rows: RoleButtonRow[], roleName: (id: string) => string | undefined): { ok: true; components: any[] } | { ok: false; reason: 'too_many_buttons' | 'too_many_rows' } {
  if (rows.length > MAX_BUTTONS) return { ok: false, reason: 'too_many_buttons' };
  const placed = placeInRows(rows);
  if (placed.length > MAX_ROWS) return { ok: false, reason: 'too_many_rows' };
  const components = placed.map((row) => ({
    type: 1,
    components: row.map((button) => {
      const emoji = discordButtonEmoji(button.emoji);
      const onlyEmoji = button.button_label === '' && emoji;
      const label = onlyEmoji ? undefined : (String(button.button_label || roleName(button.role_id) || 'Role').trim().slice(0, 80) || 'Role');
      return { type: 2, custom_id: `rr:${button.id}`, style: buttonStyleOf(button), ...(label ? { label } : {}), ...(emoji ? { emoji } : {}) };
    }),
  }));
  return { ok: true, components };
}
