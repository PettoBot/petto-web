// The credits of the public Credits page: the people, features, systems, data and tools that Petto owes something to. The owner and the
// team edit them in the dashboard and they live in the `site_credits` table of the bot's database. While that table has nothing in it (or
// cannot be read) the page shows the original list below.
import { getEnv } from './env';
import { canEditPartners } from './partners';

export const CREDIT_KINDS = ['people', 'features', 'data', 'systems', 'tools', 'art', 'other'] as const;
export type CreditKind = (typeof CREDIT_KINDS)[number];
export const MAX_CREDITS = 300;

export interface CreditRow {
  id: number;
  kind: CreditKind;
  name: string;
  url: string | null;
  logo_url: string | null;
  description_en: string;
  description_es: string;
  description_pt: string;
  visible: boolean;
  sort_order: number;
}
export type CreditValue = Omit<CreditRow, 'id' | 'sort_order' | 'visible'>;

const entry = (kind: CreditKind, name: string, url: string | null, en: string, es: string, pt: string, sort: number): CreditRow => ({
  id: 0, kind, name, url, logo_url: null, description_en: en, description_es: es, description_pt: pt, visible: true, sort_order: sort,
});

/** The original list, shown while nothing is saved. */
export const DEFAULT_CREDITS: CreditRow[] = [
  entry('people', 'Petto Team', 'https://petto.sbs/team',
    'The people who build, test and support Petto every day.',
    'Las personas que construyen, prueban y dan soporte a Petto cada día.',
    'As pessoas que constroem, testam e dão suporte ao Petto todos os dias.', 1),
  entry('data', "agnonotdev's rollouts list", 'https://gist.github.com/agnonotdev/fb2b6a7ba1301733aa5c2050b3e59a18',
    "The community list of Discord's experiments that the rollout alerts are built on.",
    'La lista de la comunidad con los experimentos de Discord en la que se basan las alertas de rollouts.',
    'A lista da comunidade com os experimentos do Discord em que os alertas de rollouts se baseiam.', 1),
  entry('data', 'discordquest.com', 'https://discordquest.com',
    'The community directory of Discord Quests, used for the quest alerts and their region and age limits.',
    'El directorio de la comunidad de Quests de Discord, usado para las alertas de quests y sus límites de región y edad.',
    'O diretório da comunidade de Quests do Discord, usado nos alertas de quests e nos limites de região e idade.', 2),
  entry('data', 'discord-api-diff', 'https://github.com/aamiaa/discord-api-diff',
    "By aamiaa. It archives Discord's own quest data every few hours and is one of the sources of the quest alerts.",
    'De aamiaa. Archiva los datos de quests de Discord cada pocas horas y es una de las fuentes de las alertas de quests.',
    'De aamiaa. Arquiva os dados de quests do Discord a cada poucas horas e é uma das fontes dos alertas de quests.', 3),
  entry('data', 'discord-api-tracker', 'https://github.com/xGustavvo/discord-api-tracker',
    'By xGustavvo. Its short list of recent quests is how a new quest is found within minutes.',
    'De xGustavvo. Su lista corta de quests recientes permite encontrar una quest nueva en minutos.',
    'De xGustavvo. A lista curta de quests recentes permite achar uma quest nova em minutos.', 4),
  entry('systems', 'Discloud', 'https://discloud.com',
    "Petto's hosting and PostgreSQL database provider.",
    'El proveedor de hosting y de base de datos PostgreSQL de Petto.',
    'O provedor de hospedagem e de banco de dados PostgreSQL do Petto.', 1),
  entry('systems', 'Cloudflare', 'https://www.cloudflare.com',
    'Serves and protects this website.',
    'Sirve y protege este sitio web.',
    'Serve e protege este site.', 2),
  entry('systems', 'Polar', 'https://polar.sh',
    'Handles the payments and subscriptions of Petto Premium.',
    'Gestiona los pagos y las suscripciones de Petto Premium.',
    'Gerencia os pagamentos e as assinaturas do Petto Premium.', 3),
  entry('tools', 'discord.js', 'https://discord.js.org',
    'The library Petto the bot is built with.',
    'La librería con la que está hecho el bot de Petto.',
    'A biblioteca com a qual o bot do Petto é feito.', 1),
  entry('tools', 'Astro', 'https://astro.build',
    'The framework of this website and the dashboard.',
    'El framework de este sitio web y del dashboard.',
    'O framework deste site e do dashboard.', 2),
  entry('art', 'Phosphor Icons', 'https://phosphoricons.com',
    'The icons used across the website and the dashboard.',
    'Los iconos usados en todo el sitio web y el dashboard.',
    'Os ícones usados em todo o site e no dashboard.', 1),
];

function api(astro: any) {
  const url = getEnv(astro, 'PETTO_BOT_API_URL')?.replace(/\/+$/, '');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'X-Petto-Dashboard-Key': key, Accept: 'application/json', 'Content-Type': 'application/json' } } : null;
}

const isHttps = (value: string) => { try { return new URL(value).protocol === 'https:'; } catch { return false; } };

/** Every saved credit in page order, or null when the table cannot be read. */
export async function readCredits(astro: any): Promise<CreditRow[] | null> {
  const config = api(astro);
  if (!config) return null;
  try {
    const res = await fetch(`${config.url}/rest/v1/site_credits?select=*&order=sort_order.asc,id.asc&limit=1000`, { headers: config.headers });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? (rows as CreditRow[]) : null;
  } catch {
    return null;
  }
}

/** What the public page shows (only visible credits), and whether it comes from the table. */
export async function getCredits(astro: any): Promise<{ credits: CreditRow[]; custom: boolean }> {
  const rows = await readCredits(astro);
  if (!rows || rows.length === 0) return { credits: DEFAULT_CREDITS, custom: false };
  return { credits: rows.filter((row) => row.visible), custom: true };
}

/** The owner and anybody on the team (any position) may edit the credits, like the partners. */
export const canEditCredits = canEditPartners;

export type CreditResult = { ok: true } | { ok: false; error: 'not_configured' | 'invalid' | 'full' | 'database' | 'name' | 'url' | 'logo' | 'invite' | 'album' };

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

/** Reads the fields of the form, or says what is wrong. The link is optional (a credit can be to a person with no page). */
export function readCreditForm(form: FormData): { ok: true; value: CreditValue } | { ok: false; error: 'invalid' | 'name' | 'url' | 'logo' } {
  const text = (name: string, max: number) => String(form.get(name) ?? '').trim().slice(0, max);
  const kind = text('kind', 20) as CreditKind;
  if (!(CREDIT_KINDS as readonly string[]).includes(kind)) return { ok: false, error: 'invalid' };
  const name = text('name', 80);
  if (!name) return { ok: false, error: 'name' };
  const url = text('url', 300);
  if (url && !isHttps(url)) return { ok: false, error: 'url' };
  const logo = text('logo_url', 400);
  if (logo && !isHttps(logo)) return { ok: false, error: 'logo' };
  const description_en = text('description_en', 600);
  return {
    ok: true,
    value: {
      kind, name, url: url || null, logo_url: logo || null,
      description_en, description_es: text('description_es', 600) || description_en, description_pt: text('description_pt', 600) || description_en,
    },
  };
}

/** Puts the original list in the table so it can be edited. Does nothing when there is already something saved. */
export async function startCustomCredits(astro: any): Promise<CreditResult> {
  const rows = await readCredits(astro);
  if (rows === null) return { ok: false, error: 'not_configured' };
  if (rows.length > 0) return { ok: true };
  for (const credit of DEFAULT_CREDITS) {
    const { id, ...rest } = credit;
    if (!(await write(astro, 'site_credits', 'POST', rest))) return { ok: false, error: 'database' };
  }
  return { ok: true };
}

export async function addCredit(astro: any, value: CreditValue): Promise<CreditResult> {
  const rows = await readCredits(astro);
  if (rows === null) return { ok: false, error: 'not_configured' };
  if (rows.length >= MAX_CREDITS) return { ok: false, error: 'full' };
  const order = Math.max(0, ...rows.filter((row) => row.kind === value.kind).map((row) => row.sort_order)) + 1;
  return (await write(astro, 'site_credits', 'POST', { ...value, sort_order: order, visible: true })) ? { ok: true } : { ok: false, error: 'database' };
}

export async function updateCredit(astro: any, id: number, value: CreditValue): Promise<CreditResult> {
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: 'invalid' };
  return (await write(astro, `site_credits?id=eq.${id}`, 'PATCH', value)) ? { ok: true } : { ok: false, error: 'database' };
}

export async function removeCredit(astro: any, id: number): Promise<CreditResult> {
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: 'invalid' };
  return (await write(astro, `site_credits?id=eq.${id}`, 'DELETE')) ? { ok: true } : { ok: false, error: 'database' };
}

export async function toggleCredit(astro: any, id: number): Promise<CreditResult> {
  const rows = await readCredits(astro);
  const row = rows?.find((entry) => entry.id === id);
  if (!row) return { ok: false, error: 'invalid' };
  return (await write(astro, `site_credits?id=eq.${id}`, 'PATCH', { visible: !row.visible })) ? { ok: true } : { ok: false, error: 'database' };
}

/** Moves a credit one place up or down inside its type, by numbering the whole type again. */
export async function moveCredit(astro: any, id: number, direction: 'up' | 'down'): Promise<CreditResult> {
  const rows = await readCredits(astro);
  if (rows === null) return { ok: false, error: 'not_configured' };
  const row = rows.find((entry) => entry.id === id);
  if (!row) return { ok: false, error: 'invalid' };
  const list = rows.filter((entry) => entry.kind === row.kind);
  const index = list.findIndex((entry) => entry.id === id);
  const other = list[direction === 'up' ? index - 1 : index + 1];
  if (!other) return { ok: true };
  const order = list.map((entry) => entry.id);
  [order[index], order[order.indexOf(other.id)]] = [other.id, row.id];
  for (const [place, creditId] of order.entries()) {
    if (!(await write(astro, `site_credits?id=eq.${creditId}`, 'PATCH', { sort_order: place + 1 }))) return { ok: false, error: 'database' };
  }
  return { ok: true };
}

/** Deletes every saved credit, so the page goes back to the original list. */
export async function resetCredits(astro: any): Promise<CreditResult> {
  return (await write(astro, 'site_credits?id=gt.0', 'DELETE')) ? { ok: true } : { ok: false, error: 'database' };
}
