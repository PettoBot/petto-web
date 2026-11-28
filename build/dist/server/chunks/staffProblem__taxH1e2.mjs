import { c as createAstro, a as createComponent, m as maybeRenderHead, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';

const $$Astro = createAstro("https://petto.sbs");
const $$StaffProblem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$StaffProblem;
  const { problem = "down" } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  return renderTemplate`${maybeRenderHead()}<p class="be-down" role="alert"> ${problem === "forbidden" ? dt("The bot does not know this account as the owner. Check that the owner ID saved in the bot is the one of the account you logged in with, and restart the bot.") : problem === "key" ? dt("The bot did not accept the key of the website. Check that the bot key saved in the website is the same one the bot has.") : problem === "old" ? dt("The bot answered, but it does not know this page yet. Restart the bot with the latest update.") : dt("Petto did not answer. Try again in a moment.")} </p>`;
}, "/home/runner/work/petto-web/petto-web/src/components/StaffProblem.astro", void 0);

function staffProblem(call) {
  if (call.ok) return null;
  if (call.down) return "down";
  if (call.data && typeof call.data === "object" && call.data.error === "forbidden") return "forbidden";
  if (call.data && typeof call.data === "object" && call.data.error === "unauthorized") return "key";
  return "old";
}

export { $$StaffProblem as $, staffProblem as s };
