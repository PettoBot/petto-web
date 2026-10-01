// The saved form of an image card, as the bot reads it. The bot checks everything again when it saves, so these
// types only describe what the editor builds.
export type Mode = 'basic' | 'advanced';
export type Align = 'left' | 'center' | 'right';
export type Fit = 'cover' | 'contain' | 'stretch';
export interface Stroke { color: string; width: number }
export interface Shadow { color: string; blur: number; x: number; y: number }

interface LayerBase { id: string; x: number; y: number; rotation: number; opacity: number }
export interface TextLayer extends LayerBase {
  type: 'text'; text: string; size: number; font: string; weight: number; color: string; align: Align; w: number;
  lineHeight: number; spacing: number; upper: boolean; stroke: Stroke | null; shadow: Shadow | null;
}
export interface ImageLayer extends LayerBase { type: 'image'; src: string; w: number; h: number; fit: Fit; radius: number; shadow: Shadow | null }
export interface AvatarLayer extends LayerBase {
  type: 'avatar'; source: 'user' | 'server'; size: number; shape: 'circle' | 'rounded' | 'square'; border: Stroke | null; shadow: Shadow | null;
}
export interface ShapeLayer extends LayerBase {
  type: 'shape'; shape: 'rect' | 'circle'; w: number; h: number; fill: string; radius: number; stroke: Stroke | null; shadow: Shadow | null;
}
export type Layer = TextLayer | ImageLayer | AvatarLayer | ShapeLayer;

export interface Basic {
  preset: string; title: string; name: string; subtitle: string; textColor: string; accent: string; font: string;
  avatarShape: 'circle' | 'rounded' | 'square'; showAvatar: boolean; showTitle: boolean; showName: boolean; showSubtitle: boolean;
}
export interface Background {
  color: string;
  gradient: { from: string; to: string; angle: number } | null;
  image: { src: string; fit: Fit; blur: number } | null;
  overlay: { color: string; opacity: number } | null;
}
export interface CardData { v?: number; mode: Mode; width: number; height: number; background: Background; basic?: Basic; layers: Layer[] }

export interface FontInfo { family: string; weights: number[]; premium: boolean }
export interface AssetInfo { id: string; name: string; width: number; height: number; size: number }
export interface Overview {
  ok: boolean; premium: boolean;
  limits: { cards: number; assets: number; storageBytes: number; uploadBytes: number };
  usage: { cards: number; assets: number; storageBytes: number };
  presets: string[]; fonts: FontInfo[];
  cards: { name: string; data: CardData; updated_at?: string }[];
  assets: AssetInfo[];
}

export const BASIC_DEFAULTS: Basic = {
  preset: 'classic', title: 'Welcome', name: '{user.display_name}', subtitle: 'We are now {server_membercount} members',
  textColor: '#ffffff', accent: '#ffffff', font: 'Poppins', avatarShape: 'circle',
  showAvatar: true, showTitle: true, showName: true, showSubtitle: true,
};

export function newCard(): CardData {
  return {
    mode: 'basic', width: 1024, height: 500,
    background: { color: '#1e1f22', gradient: { from: '#5865f2', to: '#eb459e', angle: 135 }, image: null, overlay: null },
    basic: { ...BASIC_DEFAULTS }, layers: [],
  };
}

let counter = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}`;

export function newLayer(type: Layer['type'], width: number, height: number): Layer {
  const base = { id: uid(type), x: Math.round(width / 2), y: Math.round(height / 2), rotation: 0, opacity: 1 };
  if (type === 'text') return { ...base, type, text: 'Your text', size: 56, font: 'Poppins', weight: 700, color: '#ffffff', align: 'center', w: 0, lineHeight: 1.15, spacing: 0, upper: false, stroke: null, shadow: { color: '#000000', blur: 8, x: 0, y: 2 } };
  if (type === 'image') return { ...base, type, src: '', w: 240, h: 240, fit: 'cover', radius: 0, shadow: null };
  if (type === 'avatar') return { ...base, type, source: 'user', size: 220, shape: 'circle', border: { color: '#ffffff', width: 8 }, shadow: null };
  return { ...base, type, shape: 'rect', w: 300, h: 120, fill: '#000000', radius: 24, stroke: null, shadow: null };
}

/** The box a layer takes on the card, used to draw the handles on the preview. Text is estimated from its size. */
export function layerBox(layer: Layer): { x: number; y: number; w: number; h: number } {
  if (layer.type === 'avatar') return { x: layer.x - layer.size / 2, y: layer.y - layer.size / 2, w: layer.size, h: layer.size };
  if (layer.type === 'text') {
    const lines = layer.text.split('\n').length;
    const w = layer.w || Math.min(1400, Math.max(40, layer.text.length * layer.size * 0.55));
    const h = layer.size * layer.lineHeight * lines;
    const left = layer.align === 'left' ? layer.x : layer.align === 'right' ? layer.x - w : layer.x - w / 2;
    return { x: left, y: layer.y - h / 2, w, h };
  }
  return { x: layer.x - layer.w / 2, y: layer.y - layer.h / 2, w: layer.w, h: layer.h };
}

export const VARIABLE_CHOICES = [
  '{user.display_name}', '{user.name}', '{server_name}', '{server_membercount}', '{server_membercount_ordinal}', '{user.id}',
];
