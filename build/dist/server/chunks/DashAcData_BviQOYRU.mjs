import { c as createAstro, a as createComponent, r as renderTemplate, u as unescapeHTML } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { g as getDashLang, m as makeT } from './dash_CORIPvM-.mjs';
import { f as firstInRequest } from './oncePerRequest_kWGr_b-C.mjs';
import { g as getEnv } from './env_WnBvzCjc.mjs';
import { v as variables } from './variables.generated_DwJBBG93.mjs';

const OK_TTL_MS = 5 * 6e4;
const FAILED_TTL_MS = 6e4;
let cached = null;
const isText = (value) => typeof value === "string" && value.length > 0 && value.length < 400;
function readGroups(payload) {
  if (!payload?.ok || !Array.isArray(payload.groups) || payload.groups.length === 0) return null;
  const groups = [];
  for (const group of payload.groups) {
    if (!isText(group?.id) || !isText(group?.label) || !Array.isArray(group?.vars)) return null;
    const vars = [];
    for (const variable of group.vars) {
      if (!isText(variable?.tok) || !isText(variable?.desc)) return null;
      vars.push({ tok: variable.tok, desc: variable.desc, dynamic: variable.dynamic === true });
    }
    groups.push({ id: group.id, label: group.label, availability: isText(group.availability) ? group.availability : "always", vars });
  }
  return groups;
}
async function getVariableGroups(astro) {
  if (cached && cached.expiresAt > Date.now()) return cached.groups;
  const baseUrl = getEnv(astro, "PETTO_BOT_API_URL")?.replace(/\/$/, "");
  const secret = getEnv(astro, "PETTO_BOT_API_SECRET");
  if (!baseUrl || !secret) return null;
  let groups = null;
  try {
    const res = await fetch(`${baseUrl}/api/dashboard/variables`, {
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json" },
      signal: AbortSignal.timeout(1500)
    });
    if (res.ok) groups = readGroups(await res.json());
  } catch {
    groups = null;
  }
  cached = { groups, expiresAt: Date.now() + (groups ? OK_TTL_MS : FAILED_TTL_MS) };
  return groups;
}
function peekVariableGroups() {
  return cached?.groups ?? null;
}

const generated = variables;
const fallbackGroups = (lang) => (generated[lang] ?? generated.en).map((group) => ({ label: group.label, vars: group.vars }));
async function variableGroupsJson(astro, dt, options = {}) {
  const registry = options.ask === false ? peekVariableGroups() : await getVariableGroups(astro);
  const fallback = fallbackGroups(getDashLang(astro));
  const english = getDashLang(astro) === "en";
  const known = new Map(fallback.flatMap((group) => group.vars.map((variable) => [variable.tok, variable.desc])));
  const describe = (tok, desc) => {
    const translated = dt(desc);
    return english || translated !== desc || !known.has(tok) ? translated : known.get(tok);
  };
  const groups = registry ? registry.map((group) => ({ label: dt(group.label), vars: group.vars.map((variable) => ({ tok: variable.tok, desc: describe(variable.tok, variable.desc) })) })) : fallback;
  return JSON.stringify(groups.map((g) => ({ l: g.label, v: g.vars.map((v) => [v.tok, v.desc]) }))).replace(/</g, "\\u003c");
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b;
const $$Astro = createAstro("https://petto.sbs");
const $$DashAcData = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashAcData;
  const { roles = [], channels = [], emojis = [], vars: pageVars = [] } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const data = JSON.stringify({
    r: roles.filter((role) => role.name !== "@everyone").map((role) => [role.id, role.name, role.color ? `#${Number(role.color).toString(16).padStart(6, "0")}` : ""]),
    c: channels.map((channel) => [channel.id, channel.name, channel.type ?? 0]),
    e: emojis.map((emoji) => [emoji.id, emoji.name, emoji.animated ? 1 : 0]),
    v: pageVars.map((variable) => [variable.tok, variable.desc])
  }).replace(/</g, "\\u003c");
  const first = firstInRequest(Astro2.request, "variables");
  if (first && !peekVariableGroups()) void getVariableGroups(Astro2).catch(() => null);
  const vars = first ? await variableGroupsJson(Astro2, dt, { ask: false }) : "";
  return renderTemplate(_b || (_b = __template(['<script type="application/json" data-ac-data>', "<\/script> ", ""])), unescapeHTML(data), first && renderTemplate(_a || (_a = __template(['<script type="application/json" data-var-groups>', "<\/script>"])), unescapeHTML(vars)));
}, "/home/runner/work/petto-web/petto-web/src/components/DashAcData.astro", void 0);

export { $$DashAcData as $, getVariableGroups as g, variableGroupsJson as v };
