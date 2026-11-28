import { g as getEnv } from './env_WnBvzCjc.mjs';
import { i as isPettoOwner } from './premiumAdmin_C4HUbWtx.mjs';
import { g as getTeamIds } from './team_C2OWrCGw.mjs';

const PARTNER_KINDS = ["hosting", "servers", "apps", "bots", "communities", "other"];
const MAX_PARTNERS = 200;
const DEFAULT_PARTNERS = [
  {
    id: 0,
    kind: "hosting",
    name: "Discloud",
    url: "https://discloud.com",
    logo_url: null,
    icon: "discloud",
    is_primary: true,
    visible: true,
    sort_order: 1,
    description_en: "Petto's primary hosting provider, PostgreSQL database provider, and infrastructure partner for the bot.",
    description_es: "Proveedor principal de hosting, base de datos PostgreSQL e infraestructura para el bot de Petto.",
    description_pt: "Provedor principal de hospedagem, banco de dados PostgreSQL e infraestrutura do bot do Petto."
  },
  {
    id: 0,
    kind: "communities",
    name: "Omniplex",
    url: "https://omniplex.gg",
    logo_url: null,
    icon: "omniplex",
    is_primary: false,
    visible: true,
    sort_order: 1,
    description_en: "A place to discover Discord bots and servers: explore thousands of them, vote and leave reviews. Petto is a partner of Omniplex. They are not a hosting provider, ours is Discloud.",
    description_es: "Un lugar para descubrir bots y servidores de Discord: explora miles, vota y deja reseñas. Petto es partner de Omniplex. No son un proveedor de hosting, el nuestro es Discloud.",
    description_pt: "Um lugar para descobrir bots e servidores do Discord: explore milhares, vote e deixe avaliações. O Petto é parceiro da Omniplex. Eles não são um provedor de hospedagem, o nosso é a Discloud."
  }
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
async function readPartners(astro) {
  const config = api(astro);
  if (!config) return null;
  try {
    const res = await fetch(`${config.url}/rest/v1/site_partners?select=*&order=sort_order.asc,id.asc&limit=1000`, { headers: config.headers });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? rows : null;
  } catch {
    return null;
  }
}
async function getPartners(astro) {
  const rows = await readPartners(astro);
  if (!rows || rows.length === 0) return { partners: DEFAULT_PARTNERS, custom: false };
  return { partners: rows.filter((row) => row.visible), custom: true };
}
async function canEditPartners(astro, userId) {
  if (isPettoOwner(astro, userId)) return true;
  const { ids } = await getTeamIds(astro);
  return Object.values(ids).some((list) => list.includes(userId));
}
function faviconUrl(address) {
  const value = String(address ?? "").trim();
  if (!value) return null;
  try {
    const host = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`).hostname;
    return host.includes(".") ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128` : null;
  } catch {
    return null;
  }
}
function withScheme(address) {
  const value = address.trim();
  return value && !/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? `https://${value}` : value;
}
const IMAGE_PATH = /\.(png|jpe?g|webp|gif|svg|ico|avif)$/i;
async function resolveLogo(input, siteUrl = "") {
  const value = input.trim();
  if (!value) return { url: faviconUrl(siteUrl) };
  const invite = value.match(/^https?:\/\/(?:www\.)?(?:discord\.gg|discord(?:app)?\.com\/invite)\/([A-Za-z0-9-]{2,32})\/?(?:[?#].*)?$/i);
  if (invite) {
    try {
      const res = await fetch(`https://discord.com/api/v10/invites/${invite[1]}`, { headers: { Accept: "application/json" } });
      if (!res.ok) return { error: "invite" };
      const data = await res.json();
      const guild = data?.guild;
      if (!guild?.icon) return { error: "invite" };
      return { url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${String(guild.icon).startsWith("a_") ? "gif" : "png"}?size=128` };
    } catch {
      return { error: "invite" };
    }
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return { url: value };
    if (/(^|\.)imgur\.com$/i.test(url.hostname) && url.hostname.toLowerCase() !== "i.imgur.com") {
      if (/^\/(a|gallery)\//i.test(url.pathname)) return { error: "album" };
      const id = url.pathname.replace(/^\/+/, "").split(/[/.]/)[0];
      if (/^[A-Za-z0-9]{5,10}$/.test(id)) return { url: `https://i.imgur.com/${id}.png` };
    }
    if (!IMAGE_PATH.test(url.pathname) && !/(^|\.)(cdn|media|images?)\./i.test(url.hostname) && !/(^|\.)(discordapp\.(com|net)|imgur\.com|githubusercontent\.com)$/i.test(url.hostname)) {
      const icon = faviconUrl(value);
      if (icon) return { url: icon };
    }
  } catch {
  }
  return { url: value };
}
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
function readPartnerForm(form) {
  const text = (name2, max) => String(form.get(name2) ?? "").replace(/\r\n/g, "\n").trim().slice(0, max);
  const kind = text("kind", 20);
  if (!PARTNER_KINDS.includes(kind)) return { ok: false, error: "invalid" };
  const name = text("name", 60);
  if (!name) return { ok: false, error: "name" };
  const url = withScheme(text("url", 300));
  if (!isHttps(url)) return { ok: false, error: "url" };
  const logo = withScheme(text("logo_url", 400));
  if (logo && !isHttps(logo)) return { ok: false, error: "logo" };
  const description_en = text("description_en", 500);
  return {
    ok: true,
    value: {
      kind,
      name,
      url,
      logo_url: logo || null,
      icon: null,
      description_en,
      description_es: text("description_es", 500) || description_en,
      description_pt: text("description_pt", 500) || description_en,
      is_primary: form.get("is_primary") === "on"
    }
  };
}
async function startCustomPartners(astro) {
  const rows = await readPartners(astro);
  if (rows === null) return { ok: false, error: "not_configured" };
  if (rows.length > 0) return { ok: true };
  for (const [index, partner] of DEFAULT_PARTNERS.entries()) {
    const { id, ...rest } = partner;
    if (!await write(astro, "site_partners", "POST", { ...rest, sort_order: index + 1 })) return { ok: false, error: "database" };
  }
  return { ok: true };
}
async function addPartner(astro, value) {
  const rows = await readPartners(astro);
  if (rows === null) return { ok: false, error: "not_configured" };
  if (rows.length >= MAX_PARTNERS) return { ok: false, error: "full" };
  const order = Math.max(0, ...rows.filter((row) => row.kind === value.kind).map((row) => row.sort_order)) + 1;
  return await write(astro, "site_partners", "POST", { ...value, sort_order: order, visible: true }) ? { ok: true } : { ok: false, error: "database" };
}
async function updatePartner(astro, id, value) {
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "invalid" };
  return await write(astro, `site_partners?id=eq.${id}`, "PATCH", { ...value, icon: void 0 }) ? { ok: true } : { ok: false, error: "database" };
}
async function removePartner(astro, id) {
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "invalid" };
  return await write(astro, `site_partners?id=eq.${id}`, "DELETE") ? { ok: true } : { ok: false, error: "database" };
}
async function togglePartner(astro, id) {
  const rows = await readPartners(astro);
  const row = rows?.find((entry) => entry.id === id);
  if (!row) return { ok: false, error: "invalid" };
  return await write(astro, `site_partners?id=eq.${id}`, "PATCH", { visible: !row.visible }) ? { ok: true } : { ok: false, error: "database" };
}
async function movePartner(astro, id, direction) {
  const rows = await readPartners(astro);
  if (rows === null) return { ok: false, error: "not_configured" };
  const row = rows.find((entry) => entry.id === id);
  if (!row) return { ok: false, error: "invalid" };
  const list = rows.filter((entry) => entry.kind === row.kind);
  const index = list.findIndex((entry) => entry.id === id);
  const other = list[direction === "up" ? index - 1 : index + 1];
  if (!other) return { ok: true };
  const order = list.map((entry) => entry.id);
  [order[index], order[order.indexOf(other.id)]] = [other.id, row.id];
  for (const [place, partnerId] of order.entries()) {
    if (!await write(astro, `site_partners?id=eq.${partnerId}`, "PATCH", { sort_order: place + 1 })) return { ok: false, error: "database" };
  }
  return { ok: true };
}
async function resetPartners(astro) {
  return await write(astro, "site_partners?id=gt.0", "DELETE") ? { ok: true } : { ok: false, error: "database" };
}
function partnerIcon(partner) {
  const letter = (partner.name.trim().slice(0, 1) || "?").toUpperCase();
  if (partner.icon === "discloud" || partner.icon === "omniplex") return { kind: partner.icon, letter };
  const favicon = faviconUrl(partner.url);
  const logo = partner.logo_url?.trim() || null;
  if (logo) return { kind: "image", src: logo, fallback: favicon && favicon !== logo ? favicon : "", letter };
  if (favicon) return { kind: "image", src: favicon, fallback: "", letter };
  return { kind: "letter", letter };
}

export { DEFAULT_PARTNERS as D, PARTNER_KINDS as P, readPartnerForm as a, addPartner as b, canEditPartners as c, removePartner as d, resetPartners as e, readPartners as f, getPartners as g, movePartner as m, partnerIcon as p, resolveLogo as r, startCustomPartners as s, togglePartner as t, updatePartner as u };
