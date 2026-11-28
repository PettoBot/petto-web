import { a as createComponent, r as renderTemplate, u as unescapeHTML } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { f as formatDuration } from './formatDuration_w2_MFD16.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$DurationScript = createComponent(($$result, $$props, $$slots) => {
  const source = `window.dglDuration = window.dglDuration || (${formatDuration.toString()});`;
  return renderTemplate(_a || (_a = __template(["<script>", "<\/script>"])), unescapeHTML(source));
}, "/home/runner/work/petto-web/petto-web/src/components/DurationScript.astro", void 0);

export { $$DurationScript as $ };
