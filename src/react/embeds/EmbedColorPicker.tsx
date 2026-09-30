import { useEffect, useRef, useState } from 'react';
import { t } from './t';

interface Props {
  value: number | null;
  onChange: (value: number) => void;
}

interface Hsv { h: number; s: number; v: number; }
interface Rgb { r: number; g: number; b: number; }

const PRESETS = ['#2DD4A7', '#3BA776', '#5B8DEF', '#A78BFA', '#E0568C', '#F5C945', '#F2994A', '#EF5B5B', '#7C8A94', '#4B5B63', '#0F1115', '#FFFFFF'];
const DEFAULT_HEX = '#8399FF';

function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }

function hexToRgb(hex: string): Rgb | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(rgb: Rgb) {
  return `#${[rgb.r, rgb.g, rgb.b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function rgbToHsv(rgb: Rgb): Hsv {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0;
  if (delta) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : delta / max, v: max };
}

function hsvToRgb(hsv: Hsv): Rgb {
  const c = hsv.v * hsv.s;
  const x = c * (1 - Math.abs((hsv.h / 60) % 2 - 1));
  const m = hsv.v - c;
  let r = 0, g = 0, b = 0;
  if (hsv.h < 60) { r = c; g = x; }
  else if (hsv.h < 120) { r = x; g = c; }
  else if (hsv.h < 180) { g = c; b = x; }
  else if (hsv.h < 240) { g = x; b = c; }
  else if (hsv.h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

function valueToHex(value: number | null) {
  return value == null ? DEFAULT_HEX : `#${value.toString(16).padStart(6, '0').toUpperCase()}`;
}

export default function EmbedColorPicker({ value, onChange }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(valueToHex(value));
  const [hsv, setHsv] = useState<Hsv>(() => rgbToHsv(hexToRgb(valueToHex(value))!));

  useEffect(() => {
    const nextHex = valueToHex(value);
    const rgb = hexToRgb(nextHex);
    if (!rgb) return;
    setHex(nextHex);
    setHsv(rgbToHsv(rgb));
  }, [value]);

  useEffect(() => {
    if (!open || !svRef.current || !hueRef.current) return;
    const sv = svRef.current;
    const hue = hueRef.current;
    const svCtx = sv.getContext('2d');
    const hueCtx = hue.getContext('2d');
    if (!svCtx || !hueCtx) return;

    const hueRgb = hsvToRgb({ h: hsv.h, s: 1, v: 1 });
    svCtx.fillStyle = `rgb(${Math.round(hueRgb.r)},${Math.round(hueRgb.g)},${Math.round(hueRgb.b)})`;
    svCtx.fillRect(0, 0, sv.width, sv.height);
    const white = svCtx.createLinearGradient(0, 0, sv.width, 0);
    white.addColorStop(0, 'rgba(255,255,255,1)');
    white.addColorStop(1, 'rgba(255,255,255,0)');
    svCtx.fillStyle = white;
    svCtx.fillRect(0, 0, sv.width, sv.height);
    const black = svCtx.createLinearGradient(0, 0, 0, sv.height);
    black.addColorStop(0, 'rgba(0,0,0,0)');
    black.addColorStop(1, 'rgba(0,0,0,1)');
    svCtx.fillStyle = black;
    svCtx.fillRect(0, 0, sv.width, sv.height);

    const gradient = hueCtx.createLinearGradient(0, 0, hue.width, 0);
    ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'].forEach((color, i, colors) => gradient.addColorStop(i / (colors.length - 1), color));
    hueCtx.fillStyle = gradient;
    hueCtx.fillRect(0, 0, hue.width, hue.height);
  }, [open, hsv.h]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  function commit(nextHex: string) {
    const normalized = nextHex.toUpperCase();
    const rgb = hexToRgb(normalized);
    if (!rgb) return;
    setHex(normalized);
    setHsv(rgbToHsv(rgb));
    onChange(parseInt(normalized.slice(1), 16));
  }

  function setFromSvPoint(clientX: number, clientY: number) {
    const canvas = svRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const next = { ...hsv, s: clamp((clientX - rect.left) / rect.width, 0, 1), v: 1 - clamp((clientY - rect.top) / rect.height, 0, 1) };
    setHsv(next);
    commit(rgbToHex(hsvToRgb(next)));
  }

  function setFromHuePoint(clientX: number) {
    const canvas = hueRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const next = { ...hsv, h: clamp((clientX - rect.left) / rect.width, 0, 1) * 360 };
    setHsv(next);
    commit(rgbToHex(hsvToRgb(next)));
  }

  function drag(update: (event: PointerEvent) => void, event: React.PointerEvent<HTMLCanvasElement>) {
    event.preventDefault();
    update(event.nativeEvent);
    const move = (moveEvent: PointerEvent) => update(moveEvent);
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
  }

  function updateRgb(channel: keyof Rgb, raw: string) {
    const rgb = hexToRgb(hex) ?? { r: 131, g: 153, b: 255 };
    commit(rgbToHex({ ...rgb, [channel]: clamp(parseInt(raw, 10) || 0, 0, 255) }));
  }

  const rgb = hexToRgb(hex) ?? { r: 131, g: 153, b: 255 };

  return (
    <div className="ebr-color-picker" ref={rootRef}>
      <button type="button" className="ebr-color-trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span className="ebr-color-swatch" style={{ backgroundColor: hex }} />
        <span>{hex}</span>
      </button>
      {open && (
        <div className="ebr-color-panel" onMouseDown={(event) => event.stopPropagation()}>
          <div className="ebr-color-sv-wrap">
            <canvas ref={svRef} width={260} height={150} onPointerDown={(event) => drag((point) => setFromSvPoint(point.clientX, point.clientY), event)} />
            <span className="ebr-color-sv-thumb" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }} />
          </div>
          <div className="ebr-color-hue-wrap">
            <canvas ref={hueRef} width={260} height={12} onPointerDown={(event) => drag((point) => setFromHuePoint(point.clientX), event)} />
            <span className="ebr-color-hue-thumb" style={{ left: `${(hsv.h / 360) * 100}%` }} />
          </div>
          <div className="ebr-color-fields">
            <label><span>{t('Hex')}</span><input value={hex} maxLength={7} onChange={(event) => { const raw = event.target.value.toUpperCase(); setHex(raw); if (/^#[0-9A-F]{6}$/.test(raw)) commit(raw); }} onBlur={() => setHex(hexToRgb(hex) ? hex.toUpperCase() : valueToHex(value))} /></label>
            <label><span>R</span><input type="number" min="0" max="255" value={Math.round(rgb.r)} onChange={(event) => updateRgb('r', event.target.value)} /></label>
            <label><span>G</span><input type="number" min="0" max="255" value={Math.round(rgb.g)} onChange={(event) => updateRgb('g', event.target.value)} /></label>
            <label><span>B</span><input type="number" min="0" max="255" value={Math.round(rgb.b)} onChange={(event) => updateRgb('b', event.target.value)} /></label>
          </div>
          <div className="ebr-color-presets">{PRESETS.map((preset) => <button key={preset} type="button" style={{ backgroundColor: preset }} aria-label={preset} onClick={() => commit(preset)} />)}</div>
          <button type="button" className="ebr-color-reset" onClick={() => commit(DEFAULT_HEX)}>{t('Reset')}</button>
        </div>
      )}
    </div>
  );
}
