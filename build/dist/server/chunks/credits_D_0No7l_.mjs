import { g as getEnv } from './env_WnBvzCjc.mjs';
import { c as canEditPartners } from './partners_BiJzadVG.mjs';

const CREDIT_KINDS = ["people", "features", "data", "systems", "tools", "art", "other"];
const MAX_CREDITS = 300;
const entry = (kind, name, url, en, es, pt, sort) => ({
  id: 0,
  kind,
  name,
  url,
  logo_url: null,
  description_en: en,
  description_es: es,
  description_pt: pt,
  visible: true,
  sort_order: sort
});
const DEFAULT_CREDITS = [
  entry(
    "people",
    "Petto Team",
    "https://petto.sbs/team",
    "The people who build, test and support Petto every day.",
    "Las personas que construyen, prueban y dan soporte a Petto cada día.",
    "As pessoas que constroem, testam e dão suporte ao Petto todos os dias.",
    1
  ),
  entry(
    "data",
    "agnonotdev's rollouts list",
    "https://gist.github.com/agnonotdev/fb2b6a7ba1301733aa5c2050b3e59a18",
    "The community list of Discord's experiments that the rollout alerts are built on.",
    "La lista de la comunidad con los experimentos de Discord en la que se basan las alertas de rollouts.",
    "A lista da comunidade com os experimentos do Discord em que os alertas de rollouts se baseiam.",
    1
  ),
  entry(
    "data",
    "discordquest.com",
    "https://discordquest.com",
    "The community directory of Discord Quests, used for the quest alerts and their region and age limits.",
    "El directorio de la comunidad de Quests de Discord, usado para las alertas de quests y sus límites de región y edad.",
    "O diretório da comunidade de Quests do Discord, usado nos alertas de quests e nos limites de região e idade.",
    2
  ),
  entry(
    "data",
    "discord-api-diff",
    "https://github.com/aamiaa/discord-api-diff",
    "By aamiaa. It archives Discord's own quest data every few hours and is one of the sources of the quest alerts.",
    "De aamiaa. Archiva los datos de quests de Discord cada pocas horas y es una de las fuentes de las alertas de quests.",
    "De aamiaa. Arquiva os dados de quests do Discord a cada poucas horas e é uma das fontes dos alertas de quests.",
    3
  ),
  entry(
    "data",
    "discord-api-tracker",
    "https://github.com/xGustavvo/discord-api-tracker",
    "By xGustavvo. Its short list of recent quests is how a new quest is found within minutes.",
    "De xGustavvo. Su lista corta de quests recientes permite encontrar una quest nueva en minutos.",
    "De xGustavvo. A lista curta de quests recentes permite achar uma quest nova em minutos.",
    4
  ),
  entry(
    "systems",
    "Discloud",
    "https://discloud.com",
    "Petto's hosting and PostgreSQL database provider.",
    "El proveedor de hosting y de base de datos PostgreSQL de Petto.",
    "O provedor de hospedagem e de banco de dados PostgreSQL do Petto.",
    1
  ),
  entry(
    "systems",
    "Cloudflare",
    "https://www.cloudflare.com",
    "Serves and protects this website.",
    "Sirve y protege este sitio web.",
    "Serve e protege este site.",
    2
  ),
  entry(
    "systems",
    "Polar",
    "https://polar.sh",
    "Handles the payments and subscriptions of Petto Premium.",
    "Gestiona los pagos y las suscripciones de Petto Premium.",
    "Gerencia os pagamentos e as assinaturas do Petto Premium.",
    3
  ),
  entry(
    "tools",
    "discord.js",
    "https://discord.js.org",
    "The library Petto the bot is built with.",
    "La librería con la que está hecho el bot de Petto.",
    "A biblioteca com a qual o bot do Petto é feito.",
    1
  ),
  entry(
    "tools",
    "Astro",
    "https://astro.build",
    "The framework of this website and the dashboard.",
    "El framework de este sitio web y del dashboard.",
    "O framework deste site e do dashboard.",
    2
  ),
  entry(
    "art",
    "Phosphor Icons",
    "https://phosphoricons.com",
    "The icons used across the website and the dashboard.",
    "Los iconos usados en todo el sitio web y el dashboard.",
    "Os ícones usados em todo o site e no dashboard.",
    1
  )
];
function api(astro) {
  const url = getEnv(astro, "PETTO_BOT_API_URL")?.replace(/\/+$/, "");
  const key = getEnv(astro, "PETTO_BOT_API_SECRET");
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, "X-Petto-Dashboard-Key": key, Accept: "application/json", "Content-Type": "application/json" } } : null;
}
const isHttps = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};
async function readCredits(astro) {
  const config = api(astro);
  if (!config) return null;
  try {
    const res = await fetch(`${config.url}/rest/v1/site_credits?select=*&order=sort_order.asc,id.asc&limit=1000`, { headers: config.headers });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? rows : null;
  } catch {
    return null;
  }
}
async function getCredits(astro) {
  const rows = await readCredits(astro);
  if (!rows || rows.length === 0) return { credits: DEFAULT_CREDITS, custom: false };
  return { credits: rows.filter((row) => row.visible), custom: true };
}
const canEditCredits = canEditPartners;
async function write(astro, path, method, body) {
  const config = api(astro);
  if (!config) return false;
  try {
    const res = await fetch(`${config.url}/rest/v1/${path}`, { method, headers: { ...config.headers, Prefer: "return=minimal" }, body: body === void 0 ? void 0 : JSON.stringify(body) });
    return res.ok;
  } catch {
    return false;
  }
}
function readCreditForm(form) {
  const text = (name2, max) => String(form.get(name2) ?? "").replace(/\r\n/g, "\n").trim().slice(0, max);
  const kind = text("kind", 20);
  if (!CREDIT_KINDS.includes(kind)) return { ok: false, error: "invalid" };
  const name = text("name", 80);
  if (!name) return { ok: false, error: "name" };
  const url = text("url", 300);
  if (url && !isHttps(url)) return { ok: false, error: "url" };
  const logo = text("logo_url", 400);
  if (logo && !isHttps(logo)) return { ok: false, error: "logo" };
  const description_en = text("description_en", 600);
  return {
    ok: true,
    value: {
      kind,
      name,
      url: url || null,
      logo_url: logo || null,
      description_en,
      description_es: text("description_es", 600) || description_en,
      description_pt: text("description_pt", 600) || description_en
    }
  };
}
async function startCustomCredits(astro) {
  const rows = await readCredits(astro);
  if (rows === null) return { ok: false, error: "not_configured" };
  if (rows.length > 0) return { ok: true };
  for (const credit of DEFAULT_CREDITS) {
    const { id, ...rest } = credit;
    if (!await write(astro, "site_credits", "POST", rest)) return { ok: false, error: "database" };
  }
  return { ok: true };
}
async function addCredit(astro, value) {
  const rows = await readCredits(astro);
  if (rows === null) return { ok: false, error: "not_configured" };
  if (rows.length >= MAX_CREDITS) return { ok: false, error: "full" };
  const order = Math.max(0, ...rows.filter((row) => row.kind === value.kind).map((row) => row.sort_order)) + 1;
  return await write(astro, "site_credits", "POST", { ...value, sort_order: order, visible: true }) ? { ok: true } : { ok: false, error: "database" };
}
async function updateCredit(astro, id, value) {
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "invalid" };
  return await write(astro, `site_credits?id=eq.${id}`, "PATCH", value) ? { ok: true } : { ok: false, error: "database" };
}
async function removeCredit(astro, id) {
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "invalid" };
  return await write(astro, `site_credits?id=eq.${id}`, "DELETE") ? { ok: true } : { ok: false, error: "database" };
}
async function toggleCredit(astro, id) {
  const rows = await readCredits(astro);
  const row = rows?.find((entry2) => entry2.id === id);
  if (!row) return { ok: false, error: "invalid" };
  return await write(astro, `site_credits?id=eq.${id}`, "PATCH", { visible: !row.visible }) ? { ok: true } : { ok: false, error: "database" };
}
async function moveCredit(astro, id, direction) {
  const rows = await readCredits(astro);
  if (rows === null) return { ok: false, error: "not_configured" };
  const row = rows.find((entry2) => entry2.id === id);
  if (!row) return { ok: false, error: "invalid" };
  const list = rows.filter((entry2) => entry2.kind === row.kind);
  const index = list.findIndex((entry2) => entry2.id === id);
  const other = list[direction === "up" ? index - 1 : index + 1];
  if (!other) return { ok: true };
  const order = list.map((entry2) => entry2.id);
  [order[index], order[order.indexOf(other.id)]] = [other.id, row.id];
  for (const [place, creditId] of order.entries()) {
    if (!await write(astro, `site_credits?id=eq.${creditId}`, "PATCH", { sort_order: place + 1 })) return { ok: false, error: "database" };
  }
  return { ok: true };
}
async function resetCredits(astro) {
  return await write(astro, "site_credits?id=gt.0", "DELETE") ? { ok: true } : { ok: false, error: "database" };
}

export { CREDIT_KINDS as C, DEFAULT_CREDITS as D, addCredit as a, removeCredit as b, canEditCredits as c, resetCredits as d, readCredits as e, getCredits as g, moveCredit as m, readCreditForm as r, startCustomCredits as s, toggleCredit as t, updateCredit as u };
