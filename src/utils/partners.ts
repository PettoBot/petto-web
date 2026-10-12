// The partners of the public Partners page. The owner and the team edit them in the dashboard and they live in the `site_partners`
// table of the bot's database. While that table has nothing in it (or cannot be read) the page shows the original list below.
import { getEnv } from './env';
import { isPettoOwner } from './premiumAdmin';
import { getTeamIds } from './team';

export const PARTNER_KINDS = ['hosting', 'servers', 'apps', 'bots', 'communities', 'other'] as const;
export type PartnerKind = (typeof PARTNER_KINDS)[number];
export const MAX_PARTNERS = 200;

export type PartnerValue = Omit<PartnerRow, 'id' | 'sort_order' | 'visible'>;

export interface PartnerRow {
  id: number;
  kind: PartnerKind;
  name: string;
  url: string;
  logo_url: string | null;
  icon: string | null;
  description_en: string;
  description_es: string;
  description_pt: string;
  is_primary: boolean;
  visible: boolean;
  sort_order: number;
}

/** The original list, shown while nothing is saved. `icon` picks a built-in logo. */
export const DEFAULT_PARTNERS: PartnerRow[] = [
  {
    id: 0, kind: 'hosting', name: 'Discloud', url: 'https://discloud.com', logo_url: null, icon: 'discloud', is_primary: true, visible: true, sort_order: 1,
    description_en: "Petto's primary hosting provider, PostgreSQL database provider, and infrastructure partner for the bot.",
    description_es: 'Proveedor principal de hosting, base de datos PostgreSQL e infraestructura para el bot de Petto.',
    description_pt: 'Provedor principal de hospedagem, banco de dados PostgreSQL e infraestrutura do bot do Petto.',
  },
  {
    id: 0, kind: 'communities', name: 'Omniplex', url: 'https://omniplex.gg', logo_url: null, icon: 'omniplex', is_primary: false, visible: true, sort_order: 1,
    description_en: 'A place to discover Discord bots and servers: explore thousands of them, vote and leave reviews. Petto is a partner of Omniplex. They are not a hosting provider, ours is Discloud.',
    description_es: 'Un lugar para descubrir bots y servidores de Discord: explora miles, vota y deja reseñas. Petto es partner de Omniplex. No son un proveedor de hosting, el nuestro es Discloud.',
    description_pt: 'Um lugar para descobrir bots e servidores do Discord: explore milhares, vote e deixe avaliações. O Petto é parceiro da Omniplex. Eles não são um provedor de hospedagem, o nosso é a Discloud.',
  },
];

function api(astro: any) {
  const url = getEnv(astro, 'PETTO_BOT_API_URL')?.replace(/\/+$/, '');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'X-Petto-Dashboard-Key': key, Accept: 'application/json', 'Content-Type': 'application/json' } } : null;
}

const isHttps = (value: string) => { try { return new URL(value).protocol === 'https:'; } catch { return false; } };

/** Every saved partner in page order, or null when the table cannot be read. */
export async function readPartners(astro: any): Promise<PartnerRow[] | null> {
  const config = api(astro);
  if (!config) return null;
  try {
    const res = await fetch(`${config.url}/rest/v1/site_partners?select=*&order=sort_order.asc,id.asc&limit=1000`, { headers: config.headers });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? (rows as PartnerRow[]) : null;
  } catch {
    return null;
  }
}

/** What the public page shows (only visible partners), and whether it comes from the table. */
export async function getPartners(astro: any): Promise<{ partners: PartnerRow[]; custom: boolean }> {
  const rows = await readPartners(astro);
  if (!rows || rows.length === 0) return { partners: DEFAULT_PARTNERS, custom: false };
  return { partners: rows.filter((row) => row.visible), custom: true };
}

/** The owner and anybody on the team (any position) may edit the partners. */
export async function canEditPartners(astro: any, userId: string): Promise<boolean> {
  if (isPettoOwner(astro, userId)) return true;
  const { ids } = await getTeamIds(astro);
  return Object.values(ids).some((list) => list.includes(userId));
}

/** The icon of a website (its favicon), from the address of any of its pages. Null when the address is not one. */
export function faviconUrl(address: string | null | undefined): string | null {
  const value = String(address ?? '').trim();
  if (!value) return null;
  try {
    const host = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`).hostname;
    return host.includes('.') ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128` : null;
  } catch {
    return null;
  }
}

/** Adds https:// to an address written without it (`petto.sbs`). */
export function withScheme(address: string): string {
  const value = address.trim();
  return value && !/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? `https://${value}` : value;
}

const IMAGE_PATH = /\.(png|jpe?g|webp|gif|svg|ico|avif)$/i;

/**
 * Turns what was pasted in the logo box into a picture link. A Discord invite gives the icon of its server, a page of Imgur
 * (imgur.com/abc123) becomes the picture itself (i.imgur.com/abc123.png), a page of a website (not a picture) gives that website's icon, and any other https link is used as it is.
 * An empty box gives the icon of the partner's own website (`siteUrl`), and `{ error }` when an invite cannot be read or an album cannot be used.
 */
export async function resolveLogo(input: string, siteUrl = ''): Promise<{ url: string | null } | { error: 'invite' | 'album' }> {
  const value = input.trim();
  // No logo: the icon of the partner's own website.
  if (!value) return { url: faviconUrl(siteUrl) };
  const invite = value.match(/^https?:\/\/(?:www\.)?(?:discord\.gg|discord(?:app)?\.com\/invite)\/([A-Za-z0-9-]{2,32})\/?(?:[?#].*)?$/i);
  if (invite) {
    try {
      const res = await fetch(`https://discord.com/api/v10/invites/${invite[1]}`, { headers: { Accept: 'application/json' } });
      if (!res.ok) return { error: 'invite' };
      const data: any = await res.json();
      const guild = data?.guild;
      if (!guild?.icon) return { error: 'invite' };
      return { url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${String(guild.icon).startsWith('a_') ? 'gif' : 'png'}?size=128` };
    } catch {
      return { error: 'invite' };
    }
  }
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return { url: value };
    if (/(^|\.)imgur\.com$/i.test(url.hostname) && url.hostname.toLowerCase() !== 'i.imgur.com') {
      if (/^\/(a|gallery)\//i.test(url.pathname)) return { error: 'album' };
      const id = url.pathname.replace(/^\/+/, '').split(/[/.]/)[0];
      if (/^[A-Za-z0-9]{5,10}$/.test(id)) return { url: `https://i.imgur.com/${id}.png` };
    }
    // A page of a website (not a picture): its icon is used.
    if (!IMAGE_PATH.test(url.pathname) && !/(^|\.)(cdn|media|images?)\./i.test(url.hostname) && !/(^|\.)(discordapp\.(com|net)|imgur\.com|githubusercontent\.com)$/i.test(url.hostname)) {
      const icon = faviconUrl(value);
      if (icon) return { url: icon };
    }
  } catch { /* the form checks the link */ }
  return { url: value };
}

export type PartnerResult = { ok: true } | { ok: false; error: 'not_configured' | 'invalid' | 'full' | 'database' | 'name' | 'url' | 'logo' | 'invite' | 'album' };

async function write(astro: any, path: string, method: string, body?: unknown): Promise<boolean> {
  const config = api(astro);
  if (!config) return false;
  try {
    const res = await fetch(`${config.url}/rest/v1/${path}`, { method, headers: { ...config.headers, Prefer: 'return=minimal' }, body: body === undefined ? undefined : JSON.stringify(body) });
    return res.ok;
  } catch {
    return false;
  }
}

/** Reads the fields of the form, or says what is wrong. */
export function readPartnerForm(form: FormData): { ok: true; value: PartnerValue } | { ok: false; error: 'invalid' | 'name' | 'url' | 'logo' } {
  const text = (name: string, max: number) => String(form.get(name) ?? '').trim().slice(0, max);
  const kind = text('kind', 20) as PartnerKind;
  if (!(PARTNER_KINDS as readonly string[]).includes(kind)) return { ok: false, error: 'invalid' };
  const name = text('name', 60);
  if (!name) return { ok: false, error: 'name' };
  const url = withScheme(text('url', 300));
  if (!isHttps(url)) return { ok: false, error: 'url' };
  const logo = withScheme(text('logo_url', 400));
  if (logo && !isHttps(logo)) return { ok: false, error: 'logo' };
  const description_en = text('description_en', 500);
  return {
    ok: true,
    value: {
      kind, name, url, logo_url: logo || null, icon: null,
      description_en, description_es: text('description_es', 500) || description_en, description_pt: text('description_pt', 500) || description_en,
      is_primary: form.get('is_primary') === 'on',
    },
  };
}

/** Puts the original list in the table so it can be edited. Does nothing when there is already something saved. */
export async function startCustomPartners(astro: any): Promise<PartnerResult> {
  const rows = await readPartners(astro);
  if (rows === null) return { ok: false, error: 'not_configured' };
  if (rows.length > 0) return { ok: true };
  for (const [index, partner] of DEFAULT_PARTNERS.entries()) {
    const { id, ...rest } = partner;
    if (!(await write(astro, 'site_partners', 'POST', { ...rest, sort_order: index + 1 }))) return { ok: false, error: 'database' };
  }
  return { ok: true };
}

export async function addPartner(astro: any, value: PartnerValue): Promise<PartnerResult> {
  const rows = await readPartners(astro);
  if (rows === null) return { ok: false, error: 'not_configured' };
  if (rows.length >= MAX_PARTNERS) return { ok: false, error: 'full' };
  const order = Math.max(0, ...rows.filter((row) => row.kind === value.kind).map((row) => row.sort_order)) + 1;
  return (await write(astro, 'site_partners', 'POST', { ...value, sort_order: order, visible: true })) ? { ok: true } : { ok: false, error: 'database' };
}

export async function updatePartner(astro: any, id: number, value: PartnerValue): Promise<PartnerResult> {
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: 'invalid' };
  // A built-in logo stays only while no logo link is given.
  return (await write(astro, `site_partners?id=eq.${id}`, 'PATCH', { ...value, icon: undefined })) ? { ok: true } : { ok: false, error: 'database' };
}

export async function removePartner(astro: any, id: number): Promise<PartnerResult> {
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: 'invalid' };
  return (await write(astro, `site_partners?id=eq.${id}`, 'DELETE')) ? { ok: true } : { ok: false, error: 'database' };
}

export async function togglePartner(astro: any, id: number): Promise<PartnerResult> {
  const rows = await readPartners(astro);
  const row = rows?.find((entry) => entry.id === id);
  if (!row) return { ok: false, error: 'invalid' };
  return (await write(astro, `site_partners?id=eq.${id}`, 'PATCH', { visible: !row.visible })) ? { ok: true } : { ok: false, error: 'database' };
}

/** Moves a partner one place up or down inside its type, by numbering the whole type again. */
export async function movePartner(astro: any, id: number, direction: 'up' | 'down'): Promise<PartnerResult> {
  const rows = await readPartners(astro);
  if (rows === null) return { ok: false, error: 'not_configured' };
  const row = rows.find((entry) => entry.id === id);
  if (!row) return { ok: false, error: 'invalid' };
  const list = rows.filter((entry) => entry.kind === row.kind);
  const index = list.findIndex((entry) => entry.id === id);
  const other = list[direction === 'up' ? index - 1 : index + 1];
  if (!other) return { ok: true };
  const order = list.map((entry) => entry.id);
  [order[index], order[order.indexOf(other.id)]] = [other.id, row.id];
  for (const [place, partnerId] of order.entries()) {
    if (!(await write(astro, `site_partners?id=eq.${partnerId}`, 'PATCH', { sort_order: place + 1 }))) return { ok: false, error: 'database' };
  }
  return { ok: true };
}

/** Deletes every saved partner, so the page goes back to the original list. */
export async function resetPartners(astro: any): Promise<PartnerResult> {
  return (await write(astro, 'site_partners?id=gt.0', 'DELETE')) ? { ok: true } : { ok: false, error: 'database' };
}
