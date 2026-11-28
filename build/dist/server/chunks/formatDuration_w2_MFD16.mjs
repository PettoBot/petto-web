function formatDuration(seconds, options = {}) {
  const value = typeof seconds === "number" ? seconds : seconds == null ? NaN : Number(seconds);
  if (!Number.isFinite(value)) return options.empty ?? "—";
  const total = Math.round(Math.abs(value));
  const sign = value < 0 && total > 0 ? "-" : "";
  const locale = options.locale || "en-US";
  const big = (n) => n.toLocaleString(locale);
  const sizes = { s: 1, m: 60, h: 3600, d: 86400, w: 604800, mo: 2592e3, y: 31536e3 };
  const max = options.max === "h" || options.max === "w" || options.max === "mo" || options.max === "y" ? options.max : "d";
  const chain = [["y", "mo"], ["mo", "d"], ["w", "d"], ["d", "h"], ["h", "m"], ["m", null], ["s", null]];
  const allowed = max === "h" ? ["h", "m", "s"] : max === "y" ? ["y", "mo", "w", "d", "h", "m", "s"] : max === "mo" ? ["mo", "w", "d", "h", "m", "s"] : max === "w" ? ["w", "d", "h", "m", "s"] : ["d", "h", "m", "s"];
  for (const [unit, next] of chain) {
    if (!allowed.includes(unit)) continue;
    const size = sizes[unit];
    if (total < size && unit !== "s") continue;
    const count = Math.floor(total / size);
    let text = `${big(count)}${unit}`;
    if (next) {
      const rest = Math.floor((total - count * size) / sizes[next]);
      if (rest > 0) text += ` ${rest}${next}`;
    }
    return sign + text;
  }
  return `${sign}0s`;
}
function agoText(dt, when, options = {}) {
  const at = when instanceof Date ? when.getTime() : typeof when === "number" ? when : when ? Date.parse(String(when)) : NaN;
  if (!Number.isFinite(at)) return options.empty ?? "—";
  const seconds = ((options.now ?? Date.now()) - at) / 1e3;
  if (Math.abs(seconds) < 45) return dt("just now");
  const text = formatDuration(Math.abs(seconds), { locale: options.locale, max: options.max });
  return seconds > 0 ? dt("{a} ago", { a: text }) : dt("in {a}", { a: text });
}

export { agoText as a, formatDuration as f };
