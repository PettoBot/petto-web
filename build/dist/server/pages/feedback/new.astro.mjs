import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$Base } from '../../chunks/Base_Di2YHjFe.mjs';
import { $ as $$FeedbackStyles, K as KIND_ICON, a as KIND_LABEL, T as TAG_LABEL, f as feedbackBase } from '../../chunks/feedbackUi_BoNee_B9.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { n as emojiUrl, E as EMOJI, K as KINDS, L as LIMITS, T as TAGS } from '../../chunks/feedback_CYIQ_tXr.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const base = feedbackBase(lang);
  const session = await getDashboardSession(Astro2);
  if (!session) return Astro2.redirect("/feedback/login?next=/feedback/new");
  const error = Astro2.url.searchParams.get("error");
  const message = error === "rate" ? dt("You wrote many posts today. Try again tomorrow.") : error === "invalid" ? dt("Check the title (3 characters or more) and the text (10 characters or more).") : error ? dt("The post could not be saved. Try again in a moment.") : "";
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${dt("New post")} \xB7 Petto`, "lang": lang, "description": dt("Ideas, feedback and bugs for Petto. Write yours and vote on the ones you want.") }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "FeedbackStyles", $$FeedbackStyles, {})} ${maybeRenderHead()}<main class="fb-wrap" data-no-loader> <p><a class="fb-link"${addAttribute(base, "href")}>← ${dt("All posts")}</a></p> <div class="fb-eyebrow"><img${addAttribute(emojiUrl(EMOJI.suggest), "src")} alt="" width="20" height="20">${dt("Feedback")}</div> <h1 style="margin: 6px 0 16px;">${dt("New post")}</h1> ${message && renderTemplate`<div class="fb-flash warn">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15" })}${message}</div>`} <form class="fb-form" method="POST" action="/api/feedback"> <div class="fb-field"><label>${dt("Type")}</label> <div class="fb-chips"> ${KINDS.map((value, index) => renderTemplate`<label class="fb-check"><input type="radio" name="kind"${addAttribute(value, "value")}${addAttribute(index === 0, "checked")}>${renderComponent($$result2, "Icon", $$Icon, { "name": KIND_ICON[value], "width": "14", "height": "14" })}${dt(KIND_LABEL[value])}</label>`)} </div> </div> <div class="fb-field"><label for="fb-title">${dt("Title")}</label> <input id="fb-title" name="title" required minlength="3"${addAttribute(LIMITS.title, "maxlength")}${addAttribute(dt("A short title"), "placeholder")}></div> <div class="fb-field"><label for="fb-body">${dt("Details")}</label> <textarea id="fb-body" name="body" required minlength="10"${addAttribute(LIMITS.body, "maxlength")}${addAttribute(dt("What do you want, why, and an example. For a bug: what happened and what you expected."), "placeholder")}></textarea></div> <div class="fb-field"><label>${dt("Topics")} <span class="fb-hint" style="text-transform: none;">(${dt("up to {a}", { a: LIMITS.tags })})</span></label> <div class="fb-chips">${TAGS.map((value) => renderTemplate`<label class="fb-check"><input type="checkbox" name="tags"${addAttribute(value, "value")}>${dt(TAG_LABEL[value])}</label>`)}</div></div> <div class="fb-trap" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div> <p class="fb-hint">${dt("Your Discord name and avatar are shown on the post. It is also shown in the Petto server, where people can vote with reactions.")}</p> <div class="fb-actions"><button class="btn btn-accent" type="submit">${dt("Publish")}</button><a class="fb-link"${addAttribute(base, "href")}>${dt("Cancel")}</a></div> </form> </main> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/pages/feedback/new.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/feedback/new.astro";
const $$url = "/feedback/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
