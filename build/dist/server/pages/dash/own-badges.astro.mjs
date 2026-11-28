import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { e as $$DashConfirm } from '../../chunks/Base_Di2YHjFe.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                         */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashOwnBadges = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashOwnBadges;
  const { user, data } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const MAX = 4;
  const slotsShown = data ? Array.from({ length: MAX }, (_, i) => i + 1).map((slot) => ({ slot, item: data.items.find((row) => row.slot === slot) ?? null, free: slot <= data.slots })) : [];
  const ui = {
    working: dt("Working\u2026"),
    down: dt("Petto did not answer. Try again in a moment."),
    sent: dt("Sent. It waits for the team to review it: nobody sees it until it is approved."),
    removed: dt("Removed."),
    confirmRemove: dt("Remove this badge?"),
    errors: {
      blocked: dt("You cannot upload pictures any more."),
      premium_required: dt("Your plan does not allow own badges."),
      slot_locked: dt("Your plan does not have that slot."),
      policy_required: dt("Accept the user policy first."),
      bad_name: dt("The name needs 2 to 24 letters or numbers (spaces and . _ ' ! & - are fine)."),
      bad_file: dt("That is not a picture Petto can read (PNG, JPEG or WebP)."),
      too_big: dt("The picture is too big."),
      file_too_small: dt("The picture is too small: it needs at least 64 x 64 pixels."),
      detector: dt("This picture was not accepted: it looks like it breaks the user policy (sexual, violent or hateful content). Choose another one."),
      failed: dt("It could not be done. Try again in a moment.")
    }
  };
  const boot = JSON.stringify({ ui }).replace(/</g, "\\u003c");
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "own-badges", "pageTitle": "Own badges" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashConfirm", $$DashConfirm, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Own badges"), "eyebrow": dt("Personalization"), "icon": "ph:medal-fill", "back": false })} ${!data && renderTemplate`${maybeRenderHead()}<p class="bd-down" role="alert">${dt("Petto did not answer. Try again in a moment.")}</p>`}${data && renderTemplate`<div class="ob" id="ob"${addAttribute(boot, "data-boot")}> <p class="ob-lead">${dt("Make badges of your own with a name and a picture. Bronze has 1, Silver 2 and Gold 4. The team reviews every badge before it is shown.")}</p> ${data.blocked && renderTemplate`<p class="ob-note is-bad" role="alert">${dt("You cannot upload pictures any more. If you think it is a mistake, write to us in the support server.")}</p>`} ${!data.blocked && data.slots === 0 && data.items.length === 0 && renderTemplate`<section class="bd-card ob-card ob-lock"> <h2>${dt("Your plan does not include own badges")}</h2> <p>${dt("Own badges come with the Bronze, Silver and Gold plans.")}</p> <a class="btn ob-go" href="/dash/plans">${dt("See the plans")}</a> </section>`} ${!data.blocked && data.slots > 0 && !data.policyAccepted && renderTemplate`<section class="bd-card ob-card" id="ob-policy"> <h2>${dt("User policy")}</h2> <p class="ob-sub">${dt("Before you upload your own content, read and accept this.")}</p> <p class="ob-sub">${dt("Everything you upload you upload by your own decision, and you declare you have the right to use it. We review every badge: sexual, minor-related, violent, hateful or illegal content is not allowed, and the feature can be suspended.")} <a href="/terms">${dt("Terms of use")}</a></p> <label class="ob-check"><input type="checkbox" id="ob-agree"> ${dt("I have read the policy and I agree. I understand I answer for what I upload.")}</label> <p class="ob-msg" id="ob-msg" role="status" hidden></p> <div class="ob-actions"><button type="button" class="btn ob-go" id="ob-accept" disabled>${dt("I agree")}</button></div> </section>`} ${!data.blocked && (data.slots > 0 ? data.policyAccepted : data.items.length > 0) && renderTemplate`<div class="ob-grid"> ${slotsShown.map(({ slot, item, free }) => renderTemplate`<section class="bd-card ob-card ob-slot"${addAttribute(slot, "data-slot")}> <header><h2>${dt("Badge {n}", { n: String(slot) })}</h2>${!free && renderTemplate`<span class="ob-tag">${dt("Not in your plan")}</span>`}</header> <div class="ob-hex"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:medal-fill", "width": "38", "height": "38" })} ${item?.approved && renderTemplate`<img class="ob-art"${addAttribute(`/dash/badge-art/${item.approved.id}`, "src")} alt="" width="96" height="96" loading="lazy">`} </div> ${item?.approved && renderTemplate`<p class="ob-name"><b>${item.approved.name}</b><span>${dt("Approved: it is yours alone.")}</span></p>`} ${item?.pending && renderTemplate`<p class="ob-note is-wait">${dt("Waiting for review: {name}.", { name: item.pending.name })}</p>`} ${free && data.policyAccepted && !item?.pending && renderTemplate`<form class="ob-form" autocomplete="off"> <input type="text" class="ob-text" maxlength="24" minlength="2"${addAttribute(dt("Name of the badge"), "placeholder")}${addAttribute(dt("Name of the badge"), "aria-label")} required> <input type="file" class="ob-file" accept="image/png,image/jpeg,image/webp"> <p class="ob-hint">${dt("PNG, JPEG or WebP, up to 512 KB and at least 64 x 64 pixels. It is cut to a square.")}</p> <div class="ob-actions"><button type="submit" class="btn ob-go" disabled>${dt("Send for review")}</button></div> </form>`} ${(item?.approved || item?.pending) && renderTemplate`<div class="ob-actions"><button type="button" class="btn ob-del"${addAttribute(slot, "data-remove")}${addAttribute(dt("Remove this badge?"), "data-confirm")}>${dt("Remove")}</button></div>`} <p class="ob-msg" role="status" hidden></p> </section>`)} </div>`} </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashOwnBadges.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$OwnBadges = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$OwnBadges;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const state = await callPettoCeramos(Astro2, session.userId, "own-badge-state");
  return renderTemplate`${renderComponent($$result, "DashOwnBadges", $$DashOwnBadges, { "user": session, "data": state.ok ? state.data : null })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/own-badges.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/own-badges.astro";
const $$url = "/dash/own-badges";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$OwnBadges,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
