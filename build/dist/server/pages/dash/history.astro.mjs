import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashPanelEmpty } from '../../chunks/DashPanelEmpty_Dm0QkRuf.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                      */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashHistory = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashHistory;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, profile, own, invalid, ready, hidden, optedOut, names, nicknames, createdMs, flash } = Astro2.props;
  const locale = dashLang === "pt-BR" ? "pt-BR" : dashLang === "es" ? "es" : "en";
  const fmt = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
  const rel = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const ago = (value) => {
    const days = Math.round((new Date(value).getTime() - Date.now()) / 864e5);
    if (Math.abs(days) < 1) return rel.format(0, "day");
    if (Math.abs(days) < 30) return rel.format(days, "day");
    if (Math.abs(days) < 365) return rel.format(Math.round(days / 30), "month");
    return rel.format(Math.round(days / 365), "year");
  };
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "history", "pageTitle": "History", "data-astro-cid-lb3453br": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hs-wrap" data-astro-cid-lb3453br> ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("History"), "eyebrow": dt("Dashboard"), "icon": "ph:clock-counter-clockwise-fill", "back": false, "data-astro-cid-lb3453br": true })} <form class="hs-search" method="GET" action="/dash/history" data-astro-cid-lb3453br> <input type="text" name="id" inputmode="numeric"${addAttribute(dt("Search the history of another user by ID..."), "placeholder")}${addAttribute(own ? "" : profile.id, "value")}${addAttribute(dt("User ID"), "aria-label")} data-astro-cid-lb3453br> <button class="btn btn-primary btn-sm" type="submit" data-astro-cid-lb3453br>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass", "width": "14", "height": "14", "data-astro-cid-lb3453br": true })}${dt("Search")}</button> </form> <p class="hs-who" data-astro-cid-lb3453br>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user", "width": "15", "height": "15", "data-astro-cid-lb3453br": true })}${own ? dt("Viewing your history") : dt("Viewing the history of {a}", { a: profile.name })}${!own && renderTemplate`<a href="/dash/history" data-sk="cards" data-astro-cid-lb3453br>${dt("Back to mine")}</a>`}</p> ${flash === "cleared" && renderTemplate`<div class="hs-flash" data-astro-cid-lb3453br>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-lb3453br": true })}${dt("Deleted.")}</div>`} ${flash === "record_off" && renderTemplate`<div class="hs-flash" data-astro-cid-lb3453br>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-lb3453br": true })}${dt("Petto stops saving your history, and nobody else can see it.")}</div>`} ${flash === "record_on" && renderTemplate`<div class="hs-flash" data-astro-cid-lb3453br>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-lb3453br": true })}${dt("Your history is saved again.")}</div>`} ${flash === "error" && renderTemplate`<div class="hs-flash hs-warn" data-astro-cid-lb3453br>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-lb3453br": true })}${dt("It could not be saved. Try again in a moment.")}</div>`} ${invalid ? renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:warning-fill", "text": dt("That is not a user ID. It is a number of 17 to 20 digits."), "data-astro-cid-lb3453br": true })}` : !ready ? renderTemplate`${renderComponent($$result2, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:hourglass-medium-fill", "text": dt("This arrives with the next Petto update."), "data-astro-cid-lb3453br": true })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-lb3453br": true }, { "default": ($$result3) => renderTemplate` <header class="hs-profile" data-astro-cid-lb3453br> ${profile.avatar ? renderTemplate`<img${addAttribute(profile.avatar, "src")} alt="" width="84" height="84" data-astro-cid-lb3453br>` : renderTemplate`<span class="hs-ph" data-astro-cid-lb3453br>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:user-fill", "width": "32", "height": "32", "data-astro-cid-lb3453br": true })}</span>`} <div data-astro-cid-lb3453br> <h2 class="hs-name" data-astro-cid-lb3453br>${profile.name}</h2> ${profile.username && renderTemplate`<div class="hs-user" data-astro-cid-lb3453br>@${profile.username}</div>`} <div class="hs-id" data-astro-cid-lb3453br>${profile.id}</div> </div> </header> ${hidden ? renderTemplate`${renderComponent($$result3, "DashPanelEmpty", $$DashPanelEmpty, { "icon": "ph:eye-slash-fill", "text": dt("This person turned their history off."), "data-astro-cid-lb3453br": true })}` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-lb3453br": true }, { "default": ($$result4) => renderTemplate` <div class="hs-stats" data-astro-cid-lb3453br> <div data-astro-cid-lb3453br>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:clock", "width": "18", "height": "18", "data-astro-cid-lb3453br": true })}<span data-astro-cid-lb3453br>${dt("Account created")}</span><b data-astro-cid-lb3453br>${createdMs ? fmt.format(new Date(createdMs)) : "\u2014"}</b></div> <div data-astro-cid-lb3453br>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:text-t", "width": "18", "height": "18", "data-astro-cid-lb3453br": true })}<span data-astro-cid-lb3453br>${dt("Names")}</span><b data-astro-cid-lb3453br>${names.length + nicknames.length}</b></div> </div> <h2 class="hs-h" data-astro-cid-lb3453br>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:text-t", "width": "18", "height": "18", "data-astro-cid-lb3453br": true })}${dt("Names and nicknames")}<span class="hs-count" data-astro-cid-lb3453br>${names.length + nicknames.length}</span></h2> <h3 class="hs-sub" data-astro-cid-lb3453br>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:text-t", "width": "15", "height": "15", "data-astro-cid-lb3453br": true })}${dt("Global names")}<span class="hs-count" data-astro-cid-lb3453br>${names.length}</span></h3> ${names.length === 0 ? renderTemplate`<p class="hs-empty" data-astro-cid-lb3453br>${dt("No names saved yet.")}</p>` : renderTemplate`<ul class="hs-list dgl-stagger" data-astro-cid-lb3453br> ${names.map((entry) => renderTemplate`<li data-astro-cid-lb3453br><i class="hs-dot" data-astro-cid-lb3453br></i><div data-astro-cid-lb3453br><strong data-astro-cid-lb3453br>${entry.value}</strong><small data-astro-cid-lb3453br>${fmt.format(new Date(entry.seen_at))} · ${ago(entry.seen_at)}</small></div></li>`)} </ul>`}<h3 class="hs-sub" data-astro-cid-lb3453br>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:users", "width": "15", "height": "15", "data-astro-cid-lb3453br": true })}${dt("Nicknames in servers")}<span class="hs-count" data-astro-cid-lb3453br>${nicknames.length}</span></h3> ${nicknames.length === 0 ? renderTemplate`<p class="hs-empty" data-astro-cid-lb3453br>${dt("No nicknames saved yet.")}</p>` : renderTemplate`<ul class="hs-list dgl-stagger" data-astro-cid-lb3453br> ${nicknames.map((entry) => renderTemplate`<li data-astro-cid-lb3453br><i class="hs-dot hs-dot-nick" data-astro-cid-lb3453br></i><div data-astro-cid-lb3453br><strong data-astro-cid-lb3453br>${entry.value}</strong><small data-astro-cid-lb3453br>${fmt.format(new Date(entry.seen_at))} · ${ago(entry.seen_at)}</small></div></li>`)} </ul>`}` })}`}${own && renderTemplate`<form method="POST" class="hs-own" data-no-dirty data-astro-cid-lb3453br> <h2 class="hs-h" data-astro-cid-lb3453br>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:shield-check", "width": "18", "height": "18", "data-astro-cid-lb3453br": true })}${dt("Your privacy")}</h2> <p data-astro-cid-lb3453br>${dt("You decide what Petto keeps. Anyone can look up a history by ID, but only you can delete yours.")}</p> <div class="hs-actions" data-astro-cid-lb3453br> <button class="btn btn-ghost btn-sm" type="submit" name="action" value="clear_names" data-astro-cid-lb3453br>${dt("Delete names")}</button> <button class="btn btn-ghost btn-sm" type="submit" name="action" value="clear_nicknames" data-astro-cid-lb3453br>${dt("Delete nicknames")}</button> <button class="btn btn-ghost btn-sm" type="submit" name="action" value="clear_all" data-astro-cid-lb3453br>${dt("Delete everything")}</button> ${optedOut ? renderTemplate`<button class="btn btn-primary btn-sm" type="submit" name="action" value="record_on" data-astro-cid-lb3453br>${dt("Save my history again")}</button>` : renderTemplate`<button class="btn btn-ghost btn-sm" type="submit" name="action" value="record_off" data-astro-cid-lb3453br>${dt("Stop saving my history")}</button>`} </div> </form>`}` })}`} </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashHistory.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$History = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$History;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL")?.replace(/\/+$/, "");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const headers = apiKey ? { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } : null;
  const ID = /^\d{15,25}$/;
  const asked = (Astro2.url.searchParams.get("id") ?? "").trim().replace(/[<@!>]/g, "");
  const own = !asked || asked === session.userId;
  const targetId = own ? session.userId : asked;
  const invalid = Boolean(asked) && !ID.test(asked);
  let flash = "";
  if (Astro2.request.method === "POST" && own && headers && apiUrl) {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const kinds = { clear_names: "name", clear_nicknames: "nickname", clear_all: null };
    if (action in kinds) {
      const filter = kinds[action] ? `&kind=eq.${kinds[action]}` : "";
      const res = await fetch(`${apiUrl}/rest/v1/identity_history?user_id=eq.${session.userId}${filter}`, { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" } });
      flash = res.ok ? "cleared" : "error";
    } else if (action === "record_off" || action === "record_on") {
      const res = action === "record_off" ? await fetch(`${apiUrl}/rest/v1/identity_history_optout?on_conflict=user_id`, { method: "POST", headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ user_id: session.userId }) }) : await fetch(`${apiUrl}/rest/v1/identity_history_optout?user_id=eq.${session.userId}`, { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" } });
      flash = res.ok ? action : "error";
    }
  }
  let ready = Boolean(headers && apiUrl);
  let hidden = false;
  let optedOut = false;
  let names = [];
  let nicknames = [];
  if (ready && !invalid) {
    const get = async (path) => {
      try {
        const res = await fetch(`${apiUrl}/rest/v1/${path}`, { headers });
        return res.ok ? await res.json() : null;
      } catch {
        return null;
      }
    };
    const [opt, nm, nk] = await Promise.all([
      get(`identity_history_optout?user_id=eq.${targetId}&select=user_id`),
      get(`identity_history?user_id=eq.${targetId}&kind=eq.name&select=value,seen_at&order=seen_at.desc&limit=200`),
      get(`identity_history?user_id=eq.${targetId}&kind=eq.nickname&select=value,guild_id,seen_at&order=seen_at.desc&limit=200`)
    ]);
    if (opt === null || nm === null || nk === null) ready = false;
    optedOut = Array.isArray(opt) && opt.length > 0;
    hidden = optedOut && !own;
    if (!hidden) {
      names = nm ?? [];
      nicknames = nk ?? [];
    }
  }
  let profile = { id: targetId, name: own ? session.username : targetId, username: own ? session.username : "", avatar: own ? session.avatar : null };
  if (!own && !invalid && botToken) {
    try {
      const res = await fetch(`https://discord.com/api/v10/users/${targetId}`, { headers: { Authorization: `Bot ${botToken}` } });
      if (res.ok) {
        const user = await res.json();
        profile = { id: targetId, name: user.global_name || user.username, username: user.username, avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${targetId}/${user.avatar}.png?size=256` : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(targetId) >> 22n) % 6}.png` };
      }
    } catch {
    }
  }
  const createdMs = ID.test(targetId) ? Number((BigInt(targetId) >> 22n) + 1420070400000n) : null;
  return renderTemplate`${renderComponent($$result, "DashHistory", $$DashHistory, { "user": session, "profile": profile, "own": own, "invalid": invalid, "ready": ready, "hidden": hidden, "optedOut": optedOut, "names": names, "nicknames": nicknames, "createdMs": createdMs, "flash": flash })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/history.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/history.astro";
const $$url = "/dash/history";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$History,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
