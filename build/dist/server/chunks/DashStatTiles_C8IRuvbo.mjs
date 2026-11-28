import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, d as renderComponent, F as Fragment } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { c as changeChip } from './dashStatsView_Crz8BTRt.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from './dash_CORIPvM-.mjs';
/* empty css                          */

const $$Astro = createAstro("https://petto.sbs");
const $$DashStatTiles = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashStatTiles;
  const { tiles, against } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const locale = dashLocale(lang);
  const compare = against ?? dt("vs before");
  return renderTemplate`${maybeRenderHead()}<div class="stt"${addAttribute(`--cols:${Math.min(tiles.length, 6)}`, "style")} data-astro-cid-3issm74a> ${tiles.map((tile, i) => {
    const chip = tile.change === void 0 ? null : changeChip(tile.change, Boolean(tile.inverse), locale, dt("new"));
    return renderTemplate`<div class="stt-tile"${addAttribute(`--m:var(--m-${tile.tone ?? "messages"});--i:${i}`, "style")} data-astro-cid-3issm74a> <span class="stt-label" data-astro-cid-3issm74a><i class="stt-swatch" data-astro-cid-3issm74a></i>${tile.label}</span> <b data-astro-cid-3issm74a><span class="stt-num-clip" data-astro-cid-3issm74a><span class="stt-num" data-astro-cid-3issm74a>${tile.text ?? tile.value.toLocaleString(locale)}</span></span></b> ${tile.hint && renderTemplate`<small class="stt-hint" data-astro-cid-3issm74a>${tile.hint}</small>`} <span class="stt-chips" data-astro-cid-3issm74a>${chip && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<span${addAttribute(`stt-chip stt-chip-${chip.tone}`, "class")} data-astro-cid-3issm74a><b data-astro-cid-3issm74a>${chip.arrow ? `${chip.arrow} ` : ""}${chip.text}</b></span><small data-astro-cid-3issm74a>${compare}</small>` })}`}</span> </div>`;
  })} </div> `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashStatTiles.astro", void 0);

export { $$DashStatTiles as $ };
