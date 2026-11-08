// The picture of an image card for a message preview that is not the card editor or the embed builder (the welcome, boost and other message previews of the
// dashboard): the card is read once, drawn in the browser with the avatar, decoration and name of the person looking, and handed back as a picture address.
import { drawCard, withDefaults } from '../react/cards/cardCanvas';
import { buildBasicLayers } from '../react/cards/basicLayers';

export interface CardLook {
  guildId: string;
  userName: string;
  avatarUrl: string;
  serverName: string;
  serverIconUrl: string;
  decorationUrl?: string;
  nameplateUrl?: string;
}

interface CardRow { name: string; data: any }

const LIST_TTL = 60_000;
const lists = new Map<string, { at: number; rows: Promise<CardRow[]> }>();
const images = new Map<string, Promise<string | null>>();

function cardRows(guildId: string): Promise<CardRow[]> {
  const known = lists.get(guildId);
  if (known && Date.now() - known.at < LIST_TTL) return known.rows;
  const rows = fetch(`/dash/guild/${guildId}/cards-api`, { headers: { Accept: 'application/json' } })
    .then((res) => (res.ok ? res.json() : null))
    .then((body) => (Array.isArray(body?.cards) ? (body.cards as CardRow[]) : []))
    .catch(() => []);
  lists.set(guildId, { at: Date.now(), rows });
  return rows;
}

/** The picture of the card with this name, or null when there is no such card or it could not be drawn. */
export async function cardImageUrl(name: string, look: CardLook): Promise<string | null> {
  const row = (await cardRows(look.guildId)).find((c) => c.name === name);
  if (!row) return null;
  const key = JSON.stringify([look, row.data]);
  let pending = images.get(key);
  if (!pending) {
    pending = (async () => {
      const data = row.data;
      const card = data.mode === 'basic'
        ? { ...data, layers: withDefaults(buildBasicLayers(data.basic ?? {}, data.width, data.height, data.kind === 'rank' ? 'rank' : 'welcome')) }
        : data;
      const canvas = document.createElement('canvas');
      canvas.width = card.width;
      canvas.height = card.height;
      await drawCard(canvas, card, {
        context: { userId: '', userName: look.userName, serverName: look.serverName, memberCount: 1204 },
        avatarUrl: look.avatarUrl,
        serverIconUrl: look.serverIconUrl,
        decorationUrl: look.decorationUrl,
        nameplateUrl: look.nameplateUrl,
        assetUrl: (id) => `/dash/guild/${look.guildId}/cards-api?asset=${id}`,
        designUrl: (id) => `/dash/guild/${look.guildId}/cards-api?design=${id}&size=full`,
      }, () => true);
      return new Promise<string | null>((resolve) => {
        try { canvas.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : null)); } catch { resolve(null); }
      });
    })().catch(() => null);
    images.set(key, pending);
  }
  return pending;
}
