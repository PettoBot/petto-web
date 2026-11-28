const MAX_ROWS = 5;
const PER_ROW = 5;
const MAX_BUTTONS = 25;
const NO_EMOJI = /^label:/;
function discordButtonEmoji(value) {
  if (!value || NO_EMOJI.test(value)) return void 0;
  const custom = value.match(/^<(a?):(\w+):(\d+)>$/);
  return custom ? { id: custom[3], name: custom[2], animated: custom[1] === "a" } : { name: value };
}
const STYLE_BY_MODE = { add: 3, remove: 4 };
function buttonStyleOf(row) {
  const chosen = Number(row.button_style);
  if (chosen >= 1 && chosen <= 4) return chosen;
  return STYLE_BY_MODE[row.mode] ?? 1;
}
function placeInRows(buttons) {
  const byPlace = (a, b) => Number(a.button_position ?? 0) - Number(b.button_position ?? 0) || Number(a.id) - Number(b.id);
  const explicit = /* @__PURE__ */ new Map();
  const loose = [];
  for (const row of [...buttons].sort(byPlace)) {
    const place = Number(row.button_row);
    if (row.button_row !== null && row.button_row !== void 0 && Number.isInteger(place) && place >= 0 && place < MAX_ROWS && (explicit.get(place)?.length ?? 0) < PER_ROW) {
      explicit.set(place, [...explicit.get(place) ?? [], row]);
    } else loose.push(row);
  }
  const rows = [...explicit.keys()].sort((a, b) => a - b).map((key) => explicit.get(key));
  for (let index = 0; index < loose.length; index += PER_ROW) rows.push(loose.slice(index, index + PER_ROW));
  return rows;
}
function buildRoleButtonComponents(rows, roleName) {
  if (rows.length > MAX_BUTTONS) return { ok: false, reason: "too_many_buttons" };
  const placed = placeInRows(rows);
  if (placed.length > MAX_ROWS) return { ok: false, reason: "too_many_rows" };
  const components = placed.map((row) => ({
    type: 1,
    components: row.map((button) => {
      const emoji = discordButtonEmoji(button.emoji);
      const onlyEmoji = button.button_label === "" && emoji;
      const label = onlyEmoji ? void 0 : String(button.button_label || roleName(button.role_id) || "Role").trim().slice(0, 80) || "Role";
      return { type: 2, custom_id: `rr:${button.id}`, style: buttonStyleOf(button), ...label ? { label } : {}, ...emoji ? { emoji } : {} };
    })
  }));
  return { ok: true, components };
}

export { MAX_ROWS as M, NO_EMOJI as N, PER_ROW as P, buttonStyleOf as a, buildRoleButtonComponents as b, MAX_BUTTONS as c, placeInRows as p };
