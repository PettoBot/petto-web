// The page of badges of the account (/dash/badges): what a tile and the showcase look like, written once so the server draws the first page and the browser redraws
// it after each action with the same code. Pure: no network and no DOM, so scripts/check-badges-view.mjs tests it.

export type Category = 'plan' | 'fablo' | 'country' | 'language' | 'status';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CatalogBadge {
  id: string; category: Category; unlock: 'plan' | 'self' | 'team' | 'shop'; rarity: Rarity | null; price: number; color: string;
  region: string | null; language: string | null; pack: string | null;
}
export interface Catalog { badges: CatalogBadge[]; frames: { id: string; cost: number }[]; rarityPrice: Record<string, number>; daily: Record<string, number>; slots: Record<string, number> }
export interface State { balance: number; plan: string | null; daily: { canClaim: boolean; nextAt: string; amount: number }; slots: number; owned: { id: string; frame: string }[]; showcase: string[] }

/** The words the page needs, already in the language of the person (the page gives them; this file has no text of its own). */
export interface Words {
  name: (badge: CatalogBadge) => string;
  rarity: Record<Rarity, string>;
  owned: string;
  free: string;
}

export const TABS: readonly Category[] = ['country', 'language', 'fablo', 'status'];
/** The picture files of the badges that are not flags (copied to public/assets/badges). */
const ART: Record<string, string> = { 'plan-bronze': 'plan-bronze.png', 'plan-silver': 'plan-silver.png', 'plan-gold': 'plan-gold.png', furro: 'furro.png', boykisser: 'boykisser.png', hetero: 'hetero.png', femboy: 'femboy.png' };

const esc = (value: string): string => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

/** The picture of a badge: the flag of its country, or its art file, or null (then it is drawn with its code). */
export function artUrl(badge: CatalogBadge): string | null {
  if (badge.region && /^[A-Z]{2}$/.test(badge.region)) return `/assets/country-flags/${badge.region.toLowerCase()}.svg`;
  return ART[badge.id] ? `/assets/badges/${ART[badge.id]}` : null;
}

/** The code drawn on a badge with no picture (a language). */
export const codeOf = (badge: CatalogBadge): string => (badge.region ?? badge.language ?? '').toUpperCase();

/** One hexagon: the picture or the code, in the colour of the badge, with the frame it has. */
export function hexHtml(badge: CatalogBadge, frame = 'normal', size: 'sm' | 'md' | 'lg' = 'md'): string {
  const url = artUrl(badge);
  const inner = url ? `<img src="${esc(url)}" alt="" loading="lazy" decoding="async" width="64" height="64">` : `<b>${esc(codeOf(badge))}</b>`;
  return `<span class="bd-hex bd-${size} bd-f-${esc(frame)}" style="--c:${esc(badge.color)}"><span class="bd-hex-in">${inner}</span></span>`;
}

export interface Tile { badge: CatalogBadge; name: string; owned: boolean; frame: string; shown: boolean }

/** The tiles of a tab: the search by name, the filter (all or owned) and the order (owned first only in the owned filter; otherwise by name). */
export function tilesFor(catalog: Catalog, state: State, words: Words, opts: { tab: Category; query: string; owned: boolean }): Tile[] {
  const have = new Map(state.owned.map((row) => [row.id, row.frame]));
  const shown = new Set(state.showcase);
  const q = opts.query.trim().toLowerCase();
  const list: Tile[] = [];
  for (const badge of catalog.badges) {
    // The stars of the plans are shown with the badges that follow what a person is.
    if ((badge.category === 'plan' ? 'status' : badge.category) !== opts.tab) continue;
    const name = words.name(badge);
    if (q && !name.toLowerCase().includes(q) && !badge.id.includes(q)) continue;
    const owned = have.has(badge.id);
    if (opts.owned && !owned) continue;
    list.push({ badge, name, owned, frame: have.get(badge.id) ?? 'normal', shown: shown.has(badge.id) });
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export function tileHtml(tile: Tile, words: Words): string {
  const { badge } = tile;
  const price = tile.owned ? `<span class="bd-owned">${esc(words.owned)}</span>` : badge.price ? `<span class="bd-price"><i class="bd-coin"></i>${badge.price}</span>` : `<span class="bd-price">${esc(words.free)}</span>`;
  const rarity = badge.rarity ? `<span class="bd-rar bd-r-${badge.rarity}">${esc(words.rarity[badge.rarity])}</span>` : '';
  return `<button type="button" class="bd-tile${tile.owned ? ' is-owned' : ''}${tile.shown ? ' is-shown' : ''}" data-id="${esc(badge.id)}">${hexHtml(badge, tile.frame, 'md')}<span class="bd-name">${esc(tile.name)}</span><span class="bd-meta">${price}${rarity}</span></button>`;
}

/** The showcase: one slot for each place of the plan with its badge or a plus, and the rest of the six locked. */
export function slotsHtml(catalog: Catalog, state: State, badgeOf: (id: string) => CatalogBadge | undefined, frameOf: (id: string) => string): string {
  const out: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const id = state.showcase[i];
    const badge = id ? badgeOf(id) : undefined;
    if (badge) out.push(`<button type="button" class="bd-slot is-full" data-slot="${i}" data-id="${esc(badge.id)}">${hexHtml(badge, frameOf(badge.id), 'sm')}</button>`);
    else if (i < state.slots) out.push(`<span class="bd-slot is-empty" data-slot="${i}"><span class="bd-hex bd-sm bd-f-normal"><span class="bd-hex-in bd-plus">+</span></span></span>`);
    else out.push(`<span class="bd-slot is-locked" data-slot="${i}"><span class="bd-hex bd-sm bd-f-normal"><span class="bd-hex-in bd-lock" aria-hidden="true"></span></span></span>`);
  }
  return out.join('');
}

/** What the person can do with a badge right now, for the detail dialog. */
export type Action = { kind: 'buy'; price: number; canAfford: boolean } | { kind: 'identity'; on: boolean } | { kind: 'none' };

export function actionsFor(badge: CatalogBadge, owned: boolean, state: State, catalog: Catalog): { primary: Action; upgrade: { cost: number; next: string; canAfford: boolean } | null; show: 'add' | 'remove' | 'full' | null } {
  const primary: Action = badge.unlock === 'shop' && !owned ? { kind: 'buy', price: badge.price, canAfford: state.balance >= badge.price }
    : badge.unlock === 'self' ? { kind: 'identity', on: owned } : { kind: 'none' };
  const frame = state.owned.find((row) => row.id === badge.id)?.frame ?? 'normal';
  const index = catalog.frames.findIndex((each) => each.id === frame);
  const next = owned && badge.unlock !== 'plan' ? catalog.frames[index + 1] : undefined;
  const inShowcase = state.showcase.includes(badge.id);
  const show = !owned ? null : inShowcase ? 'remove' : state.showcase.length < state.slots ? 'add' : 'full';
  return { primary, upgrade: next ? { cost: next.cost, next: next.id, canAfford: state.balance >= next.cost } : null, show };
}
