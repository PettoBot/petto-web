import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, d as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { g as guildLetterStyle, a as guildLetter } from '../../chunks/DashUserCard_BiWYM-Hw.mjs';
import { $ as $$CheckoutConsent } from '../../chunks/CheckoutConsent_BhJLEx7I.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                      */
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashPanelEmpty } from '../../chunks/DashPanelEmpty_Dm0QkRuf.mjs';
import { P as PREMIUM_TIERS, t as tr, a as annual, p as premiumFeatures } from '../../chunks/premiumCatalog_DKTPXzYN.mjs';
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { c as canManageGuild, d as guildIconUrl } from '../../chunks/discord_CxeBz2tv.mjs';
import { b as getCachedUserGuilds, g as getCachedBotGuildIds } from '../../chunks/discordCache_CnRINZ-g.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { w as createPremiumCheckout, x as createPremiumCustomerPortalSession, y as requestPremiumServer, f as forgetPremiumSnapshots, z as cancelPremiumServerRequest, A as releasePremiumServer, s as getPremiumSnapshot } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$2 = createAstro("https://petto.sbs");
const $$PremiumPlanCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PremiumPlanCard;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { slots, monthly, annual, note, selectedPlan, checkoutReady, featured = false } = Astro2.props;
  const label = slots === 1 ? dt("1 server") : dt("{n} servers", { n: slots });
  const monthPlan = `premium-${slots}-month`;
  const yearPlan = `premium-${slots}-year`;
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(["premium-plan-card dgl-card", { "premium-plan-featured": featured }], "class:list")} data-astro-cid-vzfcgdns> <div class="premium-plan-top" data-astro-cid-vzfcgdns> <span class="premium-plan-icon" data-astro-cid-vzfcgdns>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "17", "height": "17", "data-astro-cid-vzfcgdns": true })}</span> <div class="premium-plan-title" data-astro-cid-vzfcgdns> <strong data-astro-cid-vzfcgdns>${label}</strong> <span data-astro-cid-vzfcgdns>${note}</span> </div> ${featured && renderTemplate`<span class="premium-plan-badge" data-astro-cid-vzfcgdns>${dt("Most popular")}</span>`} </div> <div class="premium-plan-price"${addAttribute(`<span>${monthly.split(" ")[0]}</span> ${monthly.slice(monthly.indexOf(" "))}`, "data-m")}${addAttribute(`<span>${annual.split(" ")[0]}</span> ${annual.slice(annual.indexOf(" "))}`, "data-y")} data-astro-cid-vzfcgdns><span data-astro-cid-vzfcgdns>${monthly.split(" ")[0]}</span> ${monthly.slice(monthly.indexOf(" "))}</div> <div class="premium-plan-annual" data-astro-cid-vzfcgdns>${dt("Annual option: {a}", { a: annual })}</div> <form method="POST" class="premium-plan-form" data-no-dirty data-astro-cid-vzfcgdns> <input type="hidden" name="action" value="checkout" data-astro-cid-vzfcgdns> <select name="plan"${addAttribute(dt("Billing period for {s}", { s: label }), "aria-label")} data-astro-cid-vzfcgdns> <option${addAttribute(monthPlan, "value")}${addAttribute(selectedPlan === monthPlan, "selected")} data-astro-cid-vzfcgdns>${dt("Monthly \xB7 {a}", { a: monthly })}</option> <option${addAttribute(yearPlan, "value")}${addAttribute(selectedPlan === yearPlan, "selected")} data-astro-cid-vzfcgdns>${dt("Annual \xB7 {a}", { a: annual })}</option> </select> <button class="btn btn-primary btn-sm" type="submit"${addAttribute(!checkoutReady, "disabled")} data-astro-cid-vzfcgdns> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:credit-card-fill", "width": "14", "height": "14", "data-astro-cid-vzfcgdns": true })} ${dt("Choose plan")} </button> </form> </article> `;
}, "/home/runner/work/petto-web/petto-web/src/components/PremiumPlanCard.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashPremium = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashPremium;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guilds, status, slotsUsed, slotsTotal, assignedGuildIds, requestedGuildIds, history, checkoutReady, portalReady, selectedPlan = "premium-3-month", error, saved = false, checkoutStarted = false } = Astro2.props;
  const assigned = new Set(assignedGuildIds);
  const requested = new Set(requestedGuildIds);
  const latestEntitlement = history[0] ?? null;
  const formatDate = (value) => value ? new Intl.DateTimeFormat(dashLang, { dateStyle: "medium" }).format(new Date(value)) : dt("No end date");
  const statusLabel = (value) => ({ active: dt("Active"), pending: dt("Pending"), past_due: dt("Past due"), canceled: dt("Canceled"), expired: dt("Expired"), free: dt("Free") })[value] ?? value;
  const scheduledCancellation = Boolean(latestEntitlement?.metadata?.cancel_at_period_end || latestEntitlement?.metadata?.polar?.cancel_at_period_end);
  const planCards = PREMIUM_TIERS.map((tier) => ({ slots: tier.servers, featured: Boolean(tier.featured), monthly: `$${tier.monthly.toFixed(2)} / month`, annual: `$${annual(tier.monthly).toFixed(2)} / year`, note: tr(tier.note, dashLang) }));
  const benefits = premiumFeatures();
  const introStatus = status === "active" ? dt("Premium active") : status === "pending" ? dt("Payment pending") : status === "past_due" ? dt("Payment needs attention") : status === "canceled" ? dt("Premium canceled") : status === "expired" ? dt("Premium expired") : dt("Free plan");
  const slotPct = slotsTotal > 0 ? Math.min(100, Math.round(slotsUsed / slotsTotal * 100)) : 0;
  const defaultTab = status === "active" || slotsTotal > 0 ? "servers" : "plans";
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "premium", "pageTitle": "Premium", "data-astro-cid-63mdxfxd": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="premium-dash-wrap" id="pr-dash-root" data-astro-cid-63mdxfxd> ', " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", ' <div class="pr-vetox-hero" data-astro-cid-63mdxfxd> <div class="pr-vetox-hero-left" data-astro-cid-63mdxfxd> <span class="pr-vetox-badge" data-astro-cid-63mdxfxd>', " PREMIUM</span> <h2 data-astro-cid-63mdxfxd>", "</h2> <p data-astro-cid-63mdxfxd>", '</p> <div class="pr-vetox-billing" data-astro-cid-63mdxfxd> <div class="pr-vetox-seg" id="prDashBilling" role="tablist" data-astro-cid-63mdxfxd> <button type="button" class="active" data-bill="month" role="tab" aria-selected="true" data-astro-cid-63mdxfxd>', '</button> <button type="button" data-bill="year" role="tab" aria-selected="false" data-astro-cid-63mdxfxd>', '</button> </div> <span class="pr-vetox-save" data-astro-cid-63mdxfxd>', '</span> </div> <div class="pr-vetox-perks" data-astro-cid-63mdxfxd> <span data-astro-cid-63mdxfxd>', " ", "</span> <span data-astro-cid-63mdxfxd>", " ", "</span> <span data-astro-cid-63mdxfxd>", " ", '</span> </div> <div class="pr-vetox-slots" data-astro-cid-63mdxfxd> <span data-astro-cid-63mdxfxd>', ": <strong data-astro-cid-63mdxfxd>", " / ", '</strong></span> <div class="premium-slot-bar" aria-hidden="true" data-astro-cid-63mdxfxd><i', ' data-astro-cid-63mdxfxd></i></div> </div> </div> <div class="pr-vetox-hero-art" aria-hidden="true" data-astro-cid-63mdxfxd> <img src="/assets/dash-premium-banner.webp" alt="" class="pr-vetox-sky-img" loading="eager" decoding="sync" fetchpriority="high" draggable="false" data-astro-cid-63mdxfxd> <div class="pr-vetox-art-fade" data-astro-cid-63mdxfxd></div> </div> </div> <div class="pr-dash-tabs" role="tablist"', ' data-astro-cid-63mdxfxd> <button type="button" role="tab"', ' data-pr-tab="servers"', " data-astro-cid-63mdxfxd> ", " <span data-astro-cid-63mdxfxd>", '</span> <em class="pr-dash-count" data-astro-cid-63mdxfxd>', "/", '</em> </button> <button type="button" role="tab"', ' data-pr-tab="plans"', " data-astro-cid-63mdxfxd> ", " <span data-astro-cid-63mdxfxd>", '</span> </button> <button type="button" role="tab" class="pr-dash-tab" data-pr-tab="billing" aria-selected="false" data-astro-cid-63mdxfxd> ', " <span data-astro-cid-63mdxfxd>", '</span> </button> </div> <section class="pr-dash-panel" data-pr-panel="servers"', ' data-astro-cid-63mdxfxd> <div class="premium-block" data-astro-cid-63mdxfxd> <div class="premium-section-head" data-astro-cid-63mdxfxd> <div data-astro-cid-63mdxfxd><h2 data-astro-cid-63mdxfxd>', "</h2><p data-astro-cid-63mdxfxd>", '</p></div> <div class="pr-srv-tools" data-astro-cid-63mdxfxd> <div class="pr-srv-search" data-astro-cid-63mdxfxd> ', ' <input type="search" id="prSrvSearch"', ' autocomplete="off" data-astro-cid-63mdxfxd> </div> <div class="pr-srv-filters" role="group" data-astro-cid-63mdxfxd> <button type="button" class="active" data-srv-filter="all" data-astro-cid-63mdxfxd>', '</button> <button type="button" data-srv-filter="active" data-astro-cid-63mdxfxd>', '</button> <button type="button" data-srv-filter="ready" data-astro-cid-63mdxfxd>', "</button> </div> </div> </div> ", ' <div class="premium-footnote" data-astro-cid-63mdxfxd>', "<span data-astro-cid-63mdxfxd>", '</span></div> </div> </section> <section class="pr-dash-panel" data-pr-panel="plans"', ' data-astro-cid-63mdxfxd> <div class="premium-block" data-astro-cid-63mdxfxd> <div class="premium-section-head" data-astro-cid-63mdxfxd> <div data-astro-cid-63mdxfxd><h2 data-astro-cid-63mdxfxd>', "</h2><p data-astro-cid-63mdxfxd>", " ", '</p></div> </div> <div class="premium-plan-grid" data-astro-cid-63mdxfxd> ', ' </div> <p class="premium-roles-note" data-astro-cid-63mdxfxd>', " ", "</p> ", ' </div> <div class="premium-block" data-astro-cid-63mdxfxd> <div class="premium-section-head" data-astro-cid-63mdxfxd> <div data-astro-cid-63mdxfxd><h2 data-astro-cid-63mdxfxd>', '</h2></div> <a class="btn btn-ghost btn-sm" href="/premium" data-astro-cid-63mdxfxd>', " ", '</a> </div> <div class="premium-benefits" data-astro-cid-63mdxfxd> ', ' </div> </div> </section> <section class="pr-dash-panel" data-pr-panel="billing" hidden data-astro-cid-63mdxfxd> <div class="premium-block premium-billing-section" data-astro-cid-63mdxfxd> <div class="premium-section-head" data-astro-cid-63mdxfxd> <div data-astro-cid-63mdxfxd><h2 data-astro-cid-63mdxfxd>', "</h2><p data-astro-cid-63mdxfxd>", "</p></div> ", ' </div> <div class="premium-billing-grid" data-astro-cid-63mdxfxd> <div class="premium-billing-card" data-astro-cid-63mdxfxd> <span class="premium-summary-label" data-astro-cid-63mdxfxd>', "</span> <strong data-astro-cid-63mdxfxd>", "</strong> <small data-astro-cid-63mdxfxd>", '</small> </div> <div class="premium-billing-card" data-astro-cid-63mdxfxd> <span class="premium-summary-label" data-astro-cid-63mdxfxd>', "</span> <strong data-astro-cid-63mdxfxd>", "</strong> <small data-astro-cid-63mdxfxd>", "</small> </div> </div> ", ` </div> </section> </div> <script>
    (function () {
      var root = document.getElementById('pr-dash-root');
      if (!root || root.dataset.ready) return;
      root.dataset.ready = '1';
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-pr-tab]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[data-pr-panel]'));
      tabs.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-pr-tab');
          tabs.forEach(function (t) { var on = t === btn; t.classList.toggle('active', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
          panels.forEach(function (p) { p.hidden = p.getAttribute('data-pr-panel') !== target; });
        });
      });
      var billSeg = document.getElementById('prDashBilling');
      if (billSeg) {
        billSeg.querySelectorAll('[data-bill]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var mode = btn.getAttribute('data-bill') || 'month';
            billSeg.querySelectorAll('[data-bill]').forEach(function (b) { var on = b === btn; b.classList.toggle('active', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
            root.querySelectorAll('.premium-plan-form select[name="plan"]').forEach(function (sel) {
              for (var i = 0; i < sel.options.length; i++) {
                if (sel.options[i].value.slice(-mode.length) === mode) { sel.selectedIndex = i; break; }
              }
            });
            root.querySelectorAll('.premium-plan-card').forEach(function (card) {
              var price = card.querySelector('.premium-plan-price');
              if (!price) return;
              var m = price.getAttribute('data-m');
              var y = price.getAttribute('data-y');
              if (m && y) {
                price.innerHTML = mode === 'year' ? y : m;
                if (price.animate) price.animate([{ opacity: 0.35, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
              }
            });
          });
        });
      }
      var search = document.getElementById('prSrvSearch');
      var grid = document.getElementById('prSrvGrid');
      var filterBtns = Array.prototype.slice.call(root.querySelectorAll('[data-srv-filter]'));
      var currentFilter = 'all';
      function applyFilter() {
        if (!grid) return;
        var q = search ? search.value.trim().toLowerCase() : '';
        grid.querySelectorAll('.premium-server-card').forEach(function (card) {
          var name = card.getAttribute('data-srv-name') || '';
          var st = card.getAttribute('data-srv-state') || '';
          var okQ = !q || name.indexOf(q) !== -1;
          var okF = currentFilter === 'all' || st === currentFilter;
          card.hidden = !(okQ && okF);
        });
      }
      if (search) search.addEventListener('input', applyFilter);
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          currentFilter = btn.getAttribute('data-srv-filter') || 'all';
          filterBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
          applyFilter();
        });
      });
    })();
  <\/script> `, " "])), maybeRenderHead(), renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Choose where your Premium goes."), "eyebrow": dt("Petto Premium"), "icon": "ph:crown-fill", "back": false, "data-astro-cid-63mdxfxd": true }, { "badge": ($$result3) => renderTemplate`<span${addAttribute(["premium-status", `premium-status-${status}`], "class:list")} data-astro-cid-63mdxfxd><span class="premium-status-dot" data-astro-cid-63mdxfxd></span>${introStatus}</span>` }), error === "discord_unavailable" && renderTemplate`<div class="premium-alert premium-alert-error" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-63mdxfxd": true })} ${dt("Discord did not respond. Refresh in a few seconds.")}</div>`, error === "request_failed" && renderTemplate`<div class="premium-alert premium-alert-error" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-63mdxfxd": true })} ${dt("We could not save that server preference. Try again.")}</div>`, error === "not_manageable" && renderTemplate`<div class="premium-alert premium-alert-error" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-63mdxfxd": true })} ${dt("You can only select servers where you have Manage Server or Administrator.")}</div>`, error === "terms_required" && renderTemplate`<div class="premium-alert premium-alert-error" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-63mdxfxd": true })} ${dt("Accept the purchase and refund terms before paying. Turn on JavaScript and press Choose plan again.")}</div>`, error === "checkout_unavailable" && renderTemplate`<div class="premium-alert premium-alert-error" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-63mdxfxd": true })} ${dt("Checkout is not connected yet. Add the Polar access token to the dashboard environment first.")}</div>`, error === "portal_unavailable" && renderTemplate`<div class="premium-alert premium-alert-error" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-63mdxfxd": true })} ${dt("We could not open the billing portal. Your subscription is still safe; try again in a moment.")}</div>`, error === "premium_required" && renderTemplate`<div class="premium-alert premium-alert-error" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lock-simple-fill", "width": "17", "height": "17", "data-astro-cid-63mdxfxd": true })} ${dt("This server does not have an active Premium slot yet. Choose it below after Premium is activated.")}</div>`, saved && renderTemplate`<div class="premium-alert premium-alert-success" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "data-astro-cid-63mdxfxd": true })} ${dt("Server preference saved.")}</div>`, checkoutStarted && status === "active" && renderTemplate`<div class="premium-alert premium-alert-success" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "data-astro-cid-63mdxfxd": true })} ${dt("Thank you! Your Premium is active. Choose the servers below.")}</div>`, checkoutStarted && status !== "active" && renderTemplate`<div class="premium-alert premium-alert-success" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "data-astro-cid-63mdxfxd": true })} ${dt("Thank you! Your payment was received and Petto is turning your Premium on. Refresh this page in a few seconds.")}</div>`, renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "12", "height": "12", "data-astro-cid-63mdxfxd": true }), dt("Choose where your Premium goes."), status === "active" ? `${latestEntitlement?.plan_key ?? dt("Account-level access")} \xB7 ${formatDate(latestEntitlement?.current_period_end)}` : dt("Every plan has the same Premium features. A plan only changes how many servers it covers."), dt("Monthly"), dt("Annual"), dt("Save 15%"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-63mdxfxd": true }), dt("Move between servers"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-63mdxfxd": true }), dt("Cancel at any time"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-63mdxfxd": true }), dt("Payments by Polar"), dt("Server slots"), slotsUsed, slotsTotal, addAttribute(`width:${slotPct}%`, "style"), addAttribute(dt("Petto Premium"), "aria-label"), addAttribute(["pr-dash-tab", { active: defaultTab === "servers" }], "class:list"), addAttribute(defaultTab === "servers" ? "true" : "false", "aria-selected"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "15", "height": "15", "data-astro-cid-63mdxfxd": true }), dt("Your servers"), slotsUsed, slotsTotal, addAttribute(["pr-dash-tab", { active: defaultTab === "plans" }], "class:list"), addAttribute(defaultTab === "plans" ? "true" : "false", "aria-selected"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "15", "height": "15", "data-astro-cid-63mdxfxd": true }), dt("Plans"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:credit-card-fill", "width": "15", "height": "15", "data-astro-cid-63mdxfxd": true }), dt("Subscription & billing"), addAttribute(defaultTab !== "servers", "hidden"), dt("Your servers"), dt("Select where you want to use your Premium slots. Paid selections activate after Polar confirms the subscription."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass", "width": "14", "height": "14", "data-astro-cid-63mdxfxd": true }), addAttribute(dt("Search..."), "placeholder"), dt("All"), dt("Active"), dt("Available"), guilds.length === 0 ? renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:users-three-fill", "text": `${dt("No manageable servers found")}. ${dt("Give Petto Manage Server access or refresh Discord permissions.")}`, "data-astro-cid-63mdxfxd": true })}` : renderTemplate`<div class="premium-server-grid" id="prSrvGrid" data-astro-cid-63mdxfxd> ${guilds.map((guild) => {
    const isAssigned = assigned.has(guild.id);
    const isRequested = requested.has(guild.id);
    const stateTag = isAssigned ? "active" : guild.active ? "ready" : "offline";
    return renderTemplate`<article${addAttribute(["premium-server-card", { "is-active": isAssigned, "is-requested": isRequested, "is-offline": !guild.active }], "class:list")}${addAttribute(guild.name.toLowerCase(), "data-srv-name")}${addAttribute(stateTag, "data-srv-state")} data-astro-cid-63mdxfxd> <div class="premium-server-icon-wrap" data-astro-cid-63mdxfxd>${guild.icon ? renderTemplate`<img${addAttribute(guild.icon, "src")} alt="" class="premium-server-icon" data-astro-cid-63mdxfxd>` : renderTemplate`<span class="premium-server-icon premium-server-letter"${addAttribute(guildLetterStyle(guild.name), "style")} data-astro-cid-63mdxfxd>${guildLetter(guild.name)}</span>`}<span${addAttribute(["premium-server-dot", { online: guild.active }], "class:list")} data-astro-cid-63mdxfxd></span></div> <div class="premium-server-info" data-astro-cid-63mdxfxd><strong data-astro-cid-63mdxfxd>${guild.name}</strong><span data-astro-cid-63mdxfxd>${guild.active ? guild.tag : dt("Petto not added")}</span></div> ${isAssigned ? renderTemplate`<form method="POST" class="premium-server-action" data-no-dirty data-astro-cid-63mdxfxd><input type="hidden" name="guild_id"${addAttribute(guild.id, "value")} data-astro-cid-63mdxfxd><input type="hidden" name="action" value="release" data-astro-cid-63mdxfxd><button class="premium-server-state active" type="submit" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-63mdxfxd": true })} ${dt("Premium here \xB7 Remove")}</button></form>` : isRequested ? renderTemplate`<form method="POST" class="premium-server-action" data-no-dirty data-astro-cid-63mdxfxd><input type="hidden" name="guild_id"${addAttribute(guild.id, "value")} data-astro-cid-63mdxfxd><input type="hidden" name="action" value="cancel" data-astro-cid-63mdxfxd><button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x", "width": "14", "height": "14", "data-astro-cid-63mdxfxd": true })} ${dt("Cancel request")}</button></form>` : guild.active ? renderTemplate`<form method="POST" class="premium-server-action" data-no-dirty data-astro-cid-63mdxfxd><input type="hidden" name="guild_id"${addAttribute(guild.id, "value")} data-astro-cid-63mdxfxd><input type="hidden" name="action" value="request" data-astro-cid-63mdxfxd><button class="pr-select-srv-btn" type="submit" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus", "width": "14", "height": "14", "data-astro-cid-63mdxfxd": true })} ${dt("Select server")}</button></form>` : renderTemplate`<a class="btn btn-ghost btn-sm premium-add-bot" href="/dash/manage" data-sk="list" data-astro-cid-63mdxfxd>${dt("Add Petto first")}</a>`} </article>`;
  })} </div>`, renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "16", "height": "16", "data-astro-cid-63mdxfxd": true }), dt("Selections are checked against your live Discord permissions on every request. A pending selection never unlocks paid features by itself."), addAttribute(defaultTab !== "plans", "hidden"), dt("Plans"), dt("Every plan has the same Premium features. A plan only changes how many servers it covers."), dt("You can buy more than one: their servers add up."), planCards.map((plan) => renderTemplate`${renderComponent($$result2, "PremiumPlanCard", $$PremiumPlanCard, { "slots": plan.slots, "monthly": plan.monthly, "annual": plan.annual, "note": plan.note, "selectedPlan": selectedPlan, "checkoutReady": checkoutReady, "featured": plan.featured, "data-astro-cid-63mdxfxd": true })}`), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:medal-fill", "width": "15", "height": "15", "data-astro-cid-63mdxfxd": true }), dt("In the Petto Discord server you also get the role of your plan and the Priority Support role. They are given to you by themselves, a couple of minutes after the payment, if you are in the server."), !checkoutReady && renderTemplate`<p class="premium-setup-note" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "15", "height": "15", "data-astro-cid-63mdxfxd": true })} ${dt("Premium stays optional. The plans appear now; checkout activates after the Polar access token is added to the dashboard environment.")}</p>`, dt("What Premium includes"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "14", "height": "14", "data-astro-cid-63mdxfxd": true }), dt("See plans"), benefits.map((item) => renderTemplate`<div${addAttribute(`premium-benefit${item.locked ? " premium-benefit-locked" : ""}`, "class")} data-astro-cid-63mdxfxd> <span class="premium-benefit-icon" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": item.icon, "width": "16", "height": "16", "data-astro-cid-63mdxfxd": true })}</span> <div class="premium-benefit-text" data-astro-cid-63mdxfxd> <strong data-astro-cid-63mdxfxd>${tr(item.name, dashLang)}${item.isNew && renderTemplate`<span class="premium-new" data-astro-cid-63mdxfxd>${dt("New")}</span>`}${item.locked && renderTemplate`<span class="premium-new premium-lock" data-astro-cid-63mdxfxd>${dt("Locked")}</span>`}</strong> ${item.desc && renderTemplate`<small data-astro-cid-63mdxfxd>${tr(item.desc, dashLang)}</small>`} ${item.locked && renderTemplate`<small class="premium-lock-reason" data-astro-cid-63mdxfxd>${tr(item.locked.reason, dashLang)}</small>`} </div> </div>`), dt("Subscription & billing"), dt("Manage payment details, receipts, invoices, and cancellation safely through Polar."), portalReady ? renderTemplate`<form method="POST" data-no-dirty data-astro-cid-63mdxfxd><input type="hidden" name="action" value="portal" data-astro-cid-63mdxfxd><button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-63mdxfxd>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-square-out", "width": "14", "height": "14", "data-astro-cid-63mdxfxd": true })} ${dt("Manage billing")}</button></form>` : renderTemplate`<span class="premium-billing-muted" data-astro-cid-63mdxfxd>${dt("Available after your first Polar purchase")}</span>`, dt("Current billing state"), statusLabel(status), latestEntitlement?.provider === "manual" ? dt("Manual grant from Petto") : latestEntitlement ? scheduledCancellation ? dt("Ends on {d}", { d: formatDate(latestEntitlement.current_period_end) }) : dt("Next renewal: {d}", { d: formatDate(latestEntitlement.current_period_end) }) : dt("No subscription yet"), dt("What happens if Premium ends?"), dt("Free stays safe"), dt("Paid modules fall back to Free, assigned slots are released, and Premium customization is restored to the server defaults."), history.length > 0 && renderTemplate`<div class="premium-history-card" data-astro-cid-63mdxfxd> <div class="premium-history-title" data-astro-cid-63mdxfxd><strong data-astro-cid-63mdxfxd>${dt("Subscription history")}</strong><span data-astro-cid-63mdxfxd>${history.length === 1 ? dt("1 record") : dt("{n} records", { n: history.length })}</span></div> <div class="premium-history-list" data-astro-cid-63mdxfxd> ${history.slice(0, 8).map((item) => renderTemplate`<div class="premium-history-row" data-astro-cid-63mdxfxd> <div data-astro-cid-63mdxfxd><strong data-astro-cid-63mdxfxd>${item.plan_key}</strong><span data-astro-cid-63mdxfxd>${dt("{a} \xB7 started {b}", { a: item.provider === "manual" ? dt("Manual grant") : dt("Polar subscription"), b: formatDate(item.created_at) })}</span></div> <div class="premium-history-state" data-astro-cid-63mdxfxd><span${addAttribute(["premium-history-dot", `is-${item.status}`], "class:list")} data-astro-cid-63mdxfxd></span>${statusLabel(item.status)}<small data-astro-cid-63mdxfxd>${formatDate(item.current_period_end)}</small></div> </div>`)} </div> </div>`, renderComponent($$result2, "CheckoutConsent", $$CheckoutConsent, { "lang": dashLang, "data-astro-cid-63mdxfxd": true })) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPremium.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Premium = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Premium;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, {
      httpOnly: true,
      secure: Astro2.url.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60
    });
    return Astro2.redirect("/dash");
  }
  let discordGuilds = [];
  let discordUnavailable = false;
  try {
    discordGuilds = await getCachedUserGuilds(session.accessToken, Astro2.request);
  } catch {
    discordUnavailable = true;
  }
  const manageable = discordGuilds.filter(canManageGuild);
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const botGuildIds = botToken ? await getCachedBotGuildIds(botToken, Astro2.request) : /* @__PURE__ */ new Set();
  let actionError;
  const method = Astro2.request.method.toUpperCase();
  if (method === "POST" && !discordUnavailable) {
    const form = await Astro2.request.formData();
    const guildId = String(form.get("guild_id") ?? "");
    const action = String(form.get("action") ?? "");
    const guild = manageable.find((item) => item.id === guildId);
    if (action === "checkout") {
      if (form.get("terms") !== "1") {
        actionError = "terms_required";
      } else {
        const checkoutUrl = await createPremiumCheckout(Astro2, session.userId, String(form.get("plan") ?? ""), (/* @__PURE__ */ new Date()).toISOString());
        if (checkoutUrl) return Astro2.redirect(checkoutUrl, 303);
        actionError = "checkout_unavailable";
      }
    } else if (action === "portal") {
      const portalUrl = await createPremiumCustomerPortalSession(Astro2, session.userId);
      if (portalUrl) return Astro2.redirect(portalUrl, 303);
      actionError = "portal_unavailable";
    } else if (!guild) {
      actionError = "not_manageable";
    } else if (action === "request" && !botGuildIds.has(guildId)) {
      actionError = "request_failed";
    } else if (action === "request") {
      const changed = await requestPremiumServer(Astro2, session.userId, guildId);
      forgetPremiumSnapshots(session.userId);
      if (changed) return Astro2.redirect("/dash/premium?saved=1");
      actionError = "request_failed";
    } else if (action === "cancel") {
      const changed = await cancelPremiumServerRequest(Astro2, session.userId, guildId);
      forgetPremiumSnapshots(session.userId);
      if (changed) return Astro2.redirect("/dash/premium?saved=1");
      actionError = "request_failed";
    } else if (action === "release") {
      const changed = await releasePremiumServer(Astro2, session.userId, guildId);
      forgetPremiumSnapshots(session.userId);
      if (changed) return Astro2.redirect("/dash/premium?saved=1");
      actionError = "request_failed";
    }
  }
  const snapshot = await getPremiumSnapshot(Astro2, session.userId);
  const guilds = manageable.map((guild) => ({
    id: guild.id,
    name: guild.name,
    icon: guildIconUrl(guild),
    tag: guild.owner ? "Owner" : "Administrator",
    active: botGuildIds.has(guild.id)
  })).sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name));
  const queryError = Astro2.url.searchParams.get("error");
  const error = actionError ?? (queryError === "premium_required" ? queryError : void 0) ?? (discordUnavailable ? "discord_unavailable" : void 0);
  const saved = Astro2.url.searchParams.get("saved") === "1";
  const checkoutStarted = Astro2.url.searchParams.has("checkout_id");
  const checkoutReady = Boolean(getEnv(Astro2, "POLAR_ACCESS_TOKEN"));
  const portalReady = checkoutReady && snapshot.history.some((entitlement) => entitlement.provider === "polar");
  const requestedPlan = Astro2.url.searchParams.get("plan") ?? "";
  const selectedPlan = /^premium-(1|3|5)-(month|year)$/.test(requestedPlan) ? requestedPlan : "premium-3-month";
  return renderTemplate`${renderComponent($$result, "DashPremium", $$DashPremium, { "user": session, "guilds": guilds, "status": snapshot.status, "slotsUsed": snapshot.slotsUsed, "slotsTotal": snapshot.slotsTotal, "assignedGuildIds": snapshot.assignments.map((assignment) => assignment.guild_id), "requestedGuildIds": snapshot.requests.map((request) => request.guild_id), "history": snapshot.history, "checkoutReady": checkoutReady, "portalReady": portalReady, "selectedPlan": selectedPlan, "error": error, "saved": saved, "checkoutStarted": checkoutStarted })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/premium.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/premium.astro";
const $$url = "/dash/premium";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Premium,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
