const DEFAULT_PREFIXES = ["!", "petto"];
const MAX_PREFIXES = 10;
const MAX_PREFIX_LENGTH = 12;
function checkPrefixList(input) {
  if (!Array.isArray(input)) return { prefixes: null, problem: { key: "Keep at least one prefix." } };
  const list = [];
  for (const item of input) {
    const value = String(item ?? "").trim();
    if (!value) return { prefixes: null, problem: { key: "Write a prefix first." } };
    if (value.length > MAX_PREFIX_LENGTH) return { prefixes: null, problem: { key: "A prefix has at most {n} characters.", vars: { n: MAX_PREFIX_LENGTH } } };
    if (/\s/.test(value)) return { prefixes: null, problem: { key: "A prefix cannot have spaces." } };
    if (value.includes("@") || value.includes("`")) return { prefixes: null, problem: { key: "A prefix cannot have @ or backticks." } };
    if (list.some((p) => p.toLowerCase() === value.toLowerCase())) return { prefixes: null, problem: { key: "{p} is already in the list.", vars: { p: value } } };
    list.push(value);
  }
  if (!list.length) return { prefixes: null, problem: { key: "Keep at least one prefix." } };
  if (list.length > MAX_PREFIXES) return { prefixes: null, problem: { key: "A server can have up to {n} prefixes.", vars: { n: MAX_PREFIXES } } };
  return { prefixes: list, problem: null };
}
function prefixesFromRows(prefixes, prefix) {
  const saved = Array.isArray(prefixes) ? prefixes.map((p) => String(p ?? "").trim()).filter(Boolean) : [];
  if (saved.length) return saved;
  const old = typeof prefix === "string" ? prefix.trim() : "";
  return [old || "!"];
}

export { DEFAULT_PREFIXES as D, MAX_PREFIXES as M, MAX_PREFIX_LENGTH as a, checkPrefixList as c, prefixesFromRows as p };
