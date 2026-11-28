import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                          */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashOwnPicture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashOwnPicture;
  const { user, data } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const reasons = { sexual: dt("sexual content"), minor: dt("content with minors"), violence: dt("violent content"), hate: dt("hate"), illegal: dt("illegal content"), private: dt("private data of someone"), copyright: dt("a copyright claim"), quality: dt("quality of the picture"), other: dt("the rules") };
  const ui = {
    working: dt("Working\u2026"),
    down: dt("Petto did not answer. Try again in a moment."),
    sent: dt("Sent. It waits for the team to review it: nobody sees it until it is approved."),
    used: dt("Done: your rank card now uses your own picture (once it is approved)."),
    errors: { blocked: dt("You cannot upload pictures any more."), premium_required: dt("Your plan does not allow an own picture."), policy_required: dt("Accept the user policy first."), bad_file: dt("That is not a picture Petto can read (PNG, JPEG or WebP)."), too_big: dt("The picture is bigger than 1 MB."), file_too_small: dt("The picture is too small: it needs at least 800 x 200 pixels."), detector: dt("This picture was not accepted: it looks like it breaks the user policy (sexual, violent or hateful content). Choose another one."), failed: dt("It could not be done. Try again in a moment.") }
  };
  const boot = JSON.stringify({ ui }).replace(/</g, "\\u003c");
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "own-picture", "pageTitle": "Own picture" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Own picture"), "eyebrow": dt("Personalization"), "icon": "ph:image-square-fill", "back": false })} ${!data && renderTemplate`${maybeRenderHead()}<p class="bd-down" role="alert">${dt("Petto did not answer. Try again in a moment.")}</p>`}${data && renderTemplate`<div class="op" id="op"${addAttribute(boot, "data-boot")}> <p class="op-lead">${dt("Use a picture of your own as the background of your rank card. The team reviews every picture before it is shown.")}</p> ${data.blocked && renderTemplate`<p class="op-note is-bad" role="alert">${dt("You cannot upload pictures any more. If you think it is a mistake, write to us in the support server.")}</p>`} ${!data.blocked && !data.allowed && renderTemplate`<section class="bd-card op-card op-lock"> <span class="op-crown"><i class="bd-coin"></i></span> <h2>${dt("Your plan does not include an own picture")}</h2> <p>${dt("An own picture comes with the Silver and Gold plans.")}</p> <a class="btn op-go" href="/dash/plans">${dt("See the plans")}</a> </section>`} ${!data.blocked && data.allowed && !data.policyAccepted && renderTemplate`<section class="bd-card op-card op-policy" id="op-policy"> <h2>${dt("User policy")}</h2> <p class="op-sub">${dt("Before you upload your own content, read and accept this.")}</p> <ul class="op-points"> <li><b>${dt("You choose and you answer")}</b><span>${dt("Everything you upload (backgrounds) you upload by your own decision, and you declare you have the right to use it.")}</span></li> <li><b>${dt("Copyright")}</b><span>${dt("If something you upload breaks the copyright of someone else, the responsibility is yours, not Petto\u2019s. We remove the content when we get a valid notice.")}</span></li> <li><b>${dt("We review the content")}</b><span>${dt("We review every picture. Sexual, minor-related, violent or illegal content is not allowed; it is rejected and the feature can be suspended.")}</span></li> </ul> <p class="op-sub">${dt("Full text in the")} <a href="/terms">${dt("Terms of use")}</a> ${dt("and the")} <a href="/privacy">${dt("Privacy Policy")}</a>.</p> <label class="op-check"><input type="checkbox" id="op-agree"> ${dt("I have read the policy and I agree. I understand I answer for what I upload.")}</label> <p class="op-msg" id="op-msg" role="status" hidden></p> <div class="op-actions"><a class="btn" href="/dash/rank">${dt("I do not agree")}</a><button type="button" class="btn op-go" id="op-accept" disabled>${dt("I agree")}</button></div> </section>`} ${!data.blocked && data.allowed && data.policyAccepted && renderTemplate`<div class="op-two"> <section class="bd-card op-card" id="op-upload"> <h2>${dt("Send a picture")}</h2> <p class="op-sub">${data.perk === "animated" ? dt("PNG, JPEG, WebP or GIF, up to 1 MB and at least 800 x 200 pixels. It is cut to the middle, 1024 x 320.") : dt("PNG, JPEG or WebP, up to 1 MB and at least 800 x 200 pixels. It is cut to the middle, 1024 x 320.")}</p> ${data.upload.hasApproved && renderTemplate`<p class="op-note">${dt("You have an approved picture.")}</p>`} ${data.upload.hasPending && renderTemplate`<p class="op-note is-wait">${dt("A picture is waiting for review.")}</p>`} ${data.upload.lastRejectReason && renderTemplate`<p class="op-note is-bad">${dt("Your last picture was rejected: {reason}.", { reason: reasons[data.upload.lastRejectReason] ?? reasons.other })}</p>`} ${data.upload.removedReason && renderTemplate`<p class="op-note is-bad">${dt("Your picture was removed: {reason}.", { reason: reasons[data.upload.removedReason] ?? reasons.other })}</p>`} <input type="file" id="op-file"${addAttribute(data.perk === "animated" ? "image/png,image/jpeg,image/webp,image/gif" : "image/png,image/jpeg,image/webp", "accept")} hidden> <label class="op-drop" for="op-file" id="op-drop">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:image-square-fill", "width": "28", "height": "28" })}<b id="op-name">${dt("Choose a picture")}</b><span>${dt("or drop it here")}</span></label> <p class="op-msg" id="op-msg" role="status" hidden></p> <div class="op-actions"> <button type="button" class="btn op-go" id="op-send" disabled>${dt("Send for review")}</button> <button type="button" class="btn op-use" id="op-use"${addAttribute(!data.upload.hasApproved, "disabled")}>${dt("Use it on my rank card")}</button> </div> </section> <section class="bd-card op-card"> <h2>${dt("Preview")}</h2> <div class="op-preview" id="op-preview"><img id="op-prev-img" alt="" hidden><span id="op-prev-text">${dt("Your picture will look like this on your rank card.")}</span></div> <ul class="op-points"> <li><b>${dt("The team reviews it")}</b><span>${dt("Nobody sees your picture until it is approved.")}</span></li> <li><b>${dt("Not allowed")}</b><span>${dt("Sexual, minor-related, violent, hateful or illegal content, or private data of someone.")}</span></li> <li><b>${dt("Your rights")}</b><span>${dt("Only upload what you have the right to use.")}</span></li> <li><b>${dt("Best results")}</b><span>${dt("A wide picture works best: 1024 x 320 shows all of it, and a taller one is cut to the middle.")}</span></li> <li><b>${dt("Animated with Gold")}</b><span>${dt("With the Gold plan a GIF moves on your rank card. With the other plans a GIF is drawn as a still picture.")}</span></li> </ul> </section> </div>`} </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashOwnPicture.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$OwnPicture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$OwnPicture;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const state = await callPettoCeramos(Astro2, session.userId, "upload-state");
  return renderTemplate`${renderComponent($$result, "DashOwnPicture", $$DashOwnPicture, { "user": session, "data": state.ok ? state.data : null })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/own-picture.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/own-picture.astro";
const $$url = "/dash/own-picture";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$OwnPicture,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
