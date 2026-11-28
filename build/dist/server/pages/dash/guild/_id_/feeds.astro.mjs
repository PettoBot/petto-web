import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { h as hiddenChannelSet, g as goneChannelLabel } from '../../../../chunks/channelLabel_899ww5-9.mjs';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$Modal } from '../../../../chunks/Modal_-nOZLo0Z.mjs';
import { a as agoText, f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
import { a as postProblemText, p as postableChannel } from '../../../../chunks/channelPost_BevYrtSt.mjs';
import { p as platformById, a as platformGroup, A as ANIMAL_PLATFORM_IDS, b as FEED_PACES, c as FEED_TYPES, F as FEED_PLATFORMS, d as ANNOUNCING_PLATFORMS, e as paceOf, L as LOCKED_PLATFORMS, f as FEED_VARIABLES, g as ANIMAL_KINDS, h as feedFromRow } from '../../../../chunks/feeds_CoTT4ZQR.mjs';
/* empty css                                          */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { o as hasPremiumForGuild } from '../../../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { p as planLimits, F as FREE_LIMITS, P as PREMIUM_LIMITS } from '../../../../chunks/planLimits_BFQNR8Tb.mjs';
import { c as canUseFeeds } from '../../../../chunks/feedsAccess_J9XGccQ9.mjs';
import { i as isPettoTeam } from '../../../../chunks/maintenance_ZyU-NXSZ.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashFeeds = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashFeeds;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, platform, feeds, channels, roles, limit, premium, premiumLimit, freeLimit, ready, teamView = false } = Astro2.props;
  const hiddenChannels = await hiddenChannelSet(guildId);
  const goneChannel = (id, goneKey) => goneChannelLabel(dt, hiddenChannels, id, goneKey);
  const current = platform ? platformById(platform) : null;
  const shown = current ? feeds.filter((feed) => platformGroup(current.id).includes(feed.platform)) : feeds;
  const channelName = new Map(channels.map((channel) => [channel.id, channel.name]));
  const channelClosed = new Map(channels.filter((channel) => channel.problem).map((channel) => [channel.id, postProblemText(dt, channel.problem)]));
  const used = current ? feeds.filter((feed) => feed.platform === current.id).length : feeds.length;
  const full = current ? used >= limit : false;
  const countOf = (id) => feeds.filter((feed) => feed.platform === id).length;
  const locale = dashLocale(dashLang);
  const activeCount = shown.filter((feed) => feed.enabled).length;
  const pausedCount = shown.length - activeCount;
  const platformsInUse = new Set(feeds.map((feed) => ANIMAL_PLATFORM_IDS.includes(feed.platform) ? "animals" : feed.platform)).size;
  const lastSentAt = shown.reduce((latest, feed) => Math.max(latest, feed.lastSentAt ? Date.parse(feed.lastSentAt) || 0 : 0), 0);
  const tiles = current ? [
    { label: dt("Followed"), value: shown.length, tone: "voice" },
    { label: dt("Active"), value: activeCount, tone: "joins" },
    { label: dt("Paused"), value: pausedCount, tone: "reactions" },
    { label: dt("Last notice"), value: 0, text: lastSentAt ? agoText(dt, lastSentAt, { locale }) : "\u2014", tone: "messages" }
  ] : [
    { label: dt("Feeds"), value: feeds.length, tone: "voice" },
    { label: dt("Platforms"), value: platformsInUse, tone: "invites" },
    { label: dt("Active"), value: activeCount, tone: "joins" },
    { label: dt("Paused"), value: pausedCount, tone: "reactions" },
    { label: dt("Limit per platform"), value: limit, tone: "messages" }
  ];
  const ERROR_TEXT = {
    permission: dt("Petto cannot post in that channel."),
    canPostHere: dt("Petto can post in #{channel}."),
    cannotPostHere: dt("Give Petto the permission there, or pick another channel, or nothing will arrive."),
    channelGone: dt("The channel no longer exists."),
    send: dt("The last notice could not be sent. Petto will try again with the next one."),
    sendRejected: dt("Discord did not accept the last notice. Check the message of this feed: it may be too long or have something Discord refuses."),
    sendBusy: dt("Discord did not answer in time. Petto will try again with the next notice."),
    blocked: dt("The site does not let Petto read this account right now. Petto keeps trying."),
    accountGone: dt("The account no longer exists."),
    noFeed: dt("The address is a web page, not a feed. Use the link of the RSS or Atom feed itself."),
    rateLimited: dt("The site asks Petto to wait. It will try again by itself."),
    unavailable: dt("The account cannot be read right now. Petto keeps trying.")
  };
  const errorText = (code) => code ? ERROR_TEXT[code] ?? dt("Something is wrong with this feed. Petto keeps trying.") : "";
  const statusOf = (feed) => {
    if (!feed.enabled && feed.failures >= 5) return { key: "off", label: dt("Turned off"), detail: `${errorText(feed.lastError)} ${dt("It was turned off after {n} failures in a row. Fix the cause and press Resume.", { n: 5 })}`.trim() };
    if (!feed.enabled) return { key: "paused", label: dt("Paused"), detail: errorText(feed.lastError) };
    if (!feed.ready) return { key: "wait", label: dt("Getting ready"), detail: "" };
    if (feed.lastError) return { key: "warn", label: dt("Having trouble"), detail: `${errorText(feed.lastError)}${feed.lastErrorAt ? ` ${dt("Since {when}.", { when: agoText(dt, feed.lastErrorAt, { locale }) })}` : ""}` };
    return { key: "ok", label: dt("Active"), detail: "" };
  };
  const text = {
    find: dt("Find"),
    change: dt("Change"),
    looking: dt("Looking\u2026"),
    pasteFirst: dt("Paste the link or the name first."),
    save: dt("Save feed"),
    create: dt("Follow this account"),
    saving: dt("Saving\u2026"),
    saved: dt("Saved."),
    newFeed: dt("New feed"),
    editFeed: dt("Edit feed"),
    pickChannel: dt("Pick the channel for the notices."),
    pickAccount: dt("Find the account first."),
    pickType: dt("Pick at least one kind of notice."),
    failed: dt("Petto did not answer. Try again in a moment."),
    deleteAsk: dt("Stop following {name}? The channel keeps what was already posted."),
    previewFail: dt("The preview is not available right now."),
    removeRole: dt("Remove"),
    retry: dt("Try again"),
    removing: dt("Removing\u2026"),
    tooManyReactions: dt("A notice can have up to 5 reactions."),
    messageExample: dt("{feed.author} just posted!"),
    messageOptional: dt("Optional text above the card"),
    searchName: dt("Search {name} or paste a link"),
    noResults: dt("No results. Try another name or paste the link."),
    followed: dt("Now following {name} on {platform} in {channel}. Nothing from the past is posted: the next notice will be new."),
    updated: dt("Saved the changes to {name}."),
    pickTags: dt("Write one to four words first."),
    tagsPlaceholder: dt("pink flower anime -character"),
    whichMeaning: dt("Which \u201C{word}\u201D do you mean?"),
    meaningHelp: dt("Pick one and the feed is saved with it, or add a word that says it."),
    paused: dt("Feed paused."),
    resumed: dt("Feed resumed."),
    removed: dt("Stopped following {name}."),
    everyN: dt("Every {n} minutes"),
    // The two lines under the channel of the window (showChannelNote): without them opening a feed to edit it, or picking a channel, stopped with an error.
    canPostHere: ERROR_TEXT.canPostHere,
    cannotPostHere: ERROR_TEXT.cannotPostHere
  };
  const config = {
    guildId,
    limit,
    used,
    platforms: Object.fromEntries(FEED_PLATFORMS.map((p) => [p.id, { name: p.name, color: p.color, ink: p.ink, types: p.types, defaultTypes: p.defaultTypes, pace: Boolean(p.pace), announces: ANNOUNCING_PLATFORMS.has(p.id), extra: p.extra ?? null, intro: p.intro ? dt(p.intro) : "", account: p.account ? { ...p.account, label: dt(p.account.label), placeholder: p.account.placeholder, help: dt(p.account.help) } : null }])),
    types: Object.fromEntries(Object.entries(FEED_TYPES).map(([id, type]) => [id, dt(type.label)])),
    paces: FEED_PACES.map((pace) => [pace.minutes, dt(pace.label)]),
    roles: roles.map((role) => [role.id, role.name]),
    channels: channels.map((channel) => [channel.id, channel.name, channel.canPost, channelClosed.get(channel.id) ?? ""]),
    text,
    feeds: Object.fromEntries(feeds.map((feed) => [feed.id, feed]))
  };
  const typeTable = FEED_TYPES;
  const paceShort = (minutes) => dt("Every {a}", { a: formatDuration(minutes * 60, { locale }) });
  const typeIcon = (id) => typeTable[id]?.icon ?? "ph:bell-ringing-fill";
  const siteIcon = (url) => {
    try {
      return url ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(url).hostname)}&sz=128` : "";
    } catch {
      return "";
    }
  };
  const typeLabel = (id) => dt(typeTable[id]?.label ?? id);
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": current ? `feeds-${current.id}` : "feeds-overview", "pageTitle": current ? `${current.name} \xB7 ${dt("Feeds")}` : dt("Feeds") }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, {})} ${maybeRenderHead()}<div class="fd sx-page" data-feeds${addAttribute(JSON.stringify(config), "data-config")}${addAttribute(current ? `--fd-c:${current.color};--fd-ink:${current.ink}` : "", "style")}> <header class="fd-head"> <div class="fd-title"> ${current ? renderTemplate`<span class="fd-logo"${addAttribute(`--fd-c:${current.color};--fd-ink:${current.ink}`, "style")}>${renderComponent($$result2, "Icon", $$Icon, { "name": current.icon, "width": "22", "height": "22" })}</span>` : renderTemplate`<span class="fd-logo fd-logo-all">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:bell-ringing-fill", "width": "22", "height": "22" })}</span>`} <div> <h1>${current ? current.name : dt("Feeds")}</h1> <p class="fd-lead">${current ? dt("Petto posts what these accounts publish, in the channel you choose.") : dt("Follow accounts of other services and Petto posts what they publish: videos, live streams, posts and more.")}</p> </div> </div> ${current && renderTemplate`<div class="fd-head-actions"> <span${addAttribute(`fd-count${full ? " fd-count-full" : ""}`, "class")}${addAttribute(premium ? dt("The limit of Premium servers.") : dt("Free servers follow up to {count} accounts of each platform, Premium servers up to {premium}.", { count: String(freeLimit), premium: String(premiumLimit) }), "title")}> ${dt("{used} of {limit} {name} accounts", { used: String(used), limit: String(limit), name: current.name })} </span> <a class="btn btn-ghost btn-sm"${addAttribute(`/dash/guild/${guildId}/feeds`, "href")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-left-bold", "width": "13", "height": "13" })}${dt("All feeds")}</a> ${!current.soon && renderTemplate`<button type="button" class="btn btn-accent btn-sm"${addAttribute(current.id, "data-feed-new")}${addAttribute(!ready || full, "disabled")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14" })}${dt("New feed")}</button>`} </div>`} </header> <div class="fd-flash" data-flash hidden role="status"></div> ${!ready && renderTemplate`<div class="fd-note fd-note-warn">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15" })}${dt("This arrives with the next Petto update.")}</div>`} ${ready && full && !premium && current && renderTemplate`<div class="fd-note">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "15", "height": "15" })}<span>${dt("You follow the {count} {name} accounts a free server can. Premium servers can follow up to {premium} of each platform.", { count: String(limit), name: current.name, premium: String(premiumLimit) })} <a href="/premium">${dt("See Premium")}</a></span></div>`} ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": tiles })} ${!current && renderTemplate`<section class="sx-panel fd-picker" aria-labelledby="fd-pick-title"> <div class="sx-panel-head"> <span class="sx-panel-icon">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:squares-four-fill", "width": "17", "height": "17" })}</span> <h2 id="fd-pick-title">${dt("Platforms")}</h2> </div> <p class="sx-hint">${dt("Pick a platform to see its accounts or to follow a new one.")}</p> <nav class="fd-plats dgl-stagger"${addAttribute(dt("Platforms"), "aria-label")}> ${FEED_PLATFORMS.filter((p) => !p.hidden).map((p) => {
    const count = countOf(p.id);
    return p.soon ? renderTemplate`<span class="fd-plat fd-plat-soon"${addAttribute(`--fd-c:${p.color};--fd-ink:${p.ink}`, "style")}><span class="fd-logo">${renderComponent($$result2, "Icon", $$Icon, { "name": p.icon, "width": "16", "height": "16" })}</span><b>${p.name}</b><em class="fd-plat-n">${dt("Coming soon")}</em></span>` : renderTemplate`<a class="fd-plat"${addAttribute(`/dash/guild/${guildId}/feeds?platform=${p.id}`, "href")}${addAttribute(count ? dt("{count} of {limit} followed", { count: String(count), limit: String(limit) }) : dt("Nothing followed yet"), "title")}${addAttribute(`--fd-c:${p.color};--fd-ink:${p.ink}`, "style")}> <span class="fd-logo">${renderComponent($$result2, "Icon", $$Icon, { "name": p.icon, "width": "16", "height": "16" })}</span><b>${p.name}</b>${count > 0 && renderTemplate`<em${addAttribute(`fd-plat-n${count >= limit ? " fd-plat-n-full" : ""}`, "class")}><span>${count}</span><span class="fd-plat-lim">/${limit}</span></em>`} </a>`;
  })} </nav> </section>`} ${shown.length > 0 && renderTemplate`<section class="fd-listbox" aria-labelledby="fd-list-title"> <div class="fd-list-head"> <div class="fd-list-title"><h2 id="fd-list-title">${current ? dt("Accounts") : dt("Followed accounts")}</h2><span class="sx-tag">${shown.length}</span></div> <label class="fd-search">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "14", "height": "14" })}<input type="search" data-feed-search${addAttribute(dt("Search accounts"), "placeholder")}${addAttribute(dt("Search accounts"), "aria-label")} autocomplete="off"></label> </div> <ul class="fd-list dgl-stagger"> ${shown.map((feed) => {
    const p = platformById(feed.platform);
    const status = statusOf(feed);
    return renderTemplate`<li${addAttribute(`fd-feed fd-feed-${status.key}`, "class")}${addAttribute(feed.id, "data-feed-row")}${addAttribute(`${feed.accountName} ${p?.name ?? ""} ${channelName.get(feed.channelId) ?? ""}`.toLowerCase(), "data-search")}${addAttribute(`--fd-c:${p?.color ?? "#888"};--fd-ink:${p?.ink ?? "#fff"}`, "style")}> <div class="fd-top"> <span class="fd-avatar">${feed.accountAvatar ? renderTemplate`<img${addAttribute(feed.accountAvatar, "src")} alt="" loading="lazy" referrerpolicy="no-referrer"${addAttribute(feed.platform, "data-platform")}${addAttribute(siteIcon(feed.accountUrl), "data-fallback")}>` : p ? renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": p.icon, "width": "20", "height": "20" })}` : null}</span> <div class="fd-main"> <div class="fd-name">${feed.accountUrl ? renderTemplate`<a${addAttribute(feed.accountUrl, "href")} target="_blank" rel="noopener noreferrer">${feed.accountName}</a>` : renderTemplate`<span>${feed.accountName}</span>`}${!current && p && renderTemplate`<span class="fd-plat-tag">${renderComponent($$result2, "Icon", $$Icon, { "name": p.icon, "width": "11", "height": "11" })}${p.name}</span>`}</div> <div class="fd-last">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "12", "height": "12" })}${feed.lastSentAt ? renderTemplate`<span>${dt("Last notice")}: <time${addAttribute(feed.lastSentAt, "datetime")} data-when data-keep>${agoText(dt, feed.lastSentAt, { locale })}</time></span>` : dt("Nothing posted yet")}</div> </div> <span${addAttribute(`fd-status fd-status-${status.key}`, "class")}>${status.label}</span> </div> <div class="fd-meta"> <span class="fd-chans">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hash-bold", "width": "11", "height": "11" })}${channelName.get(feed.channelId) ?? goneChannel(feed.channelId, "deleted channel")}</span> ${feed.types.map((type) => renderTemplate`<span class="fd-type">${renderComponent($$result2, "Icon", $$Icon, { "name": typeIcon(type), "width": "11", "height": "11" })}${typeLabel(type)}</span>`)} ${p?.pace && renderTemplate`<span class="fd-type">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:timer-fill", "width": "11", "height": "11" })}${paceShort(paceOf(feed.accountId))}</span>`} </div> ${status.detail && renderTemplate`<div class="fd-err"${addAttribute(status.detail, "title")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "13", "height": "13" })}<span>${status.detail}</span></div>`} ${teamView && feed.lastErrorDetail && renderTemplate`<div class="fd-err fd-err-team" data-team-error>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:bug-fill", "width": "13", "height": "13" })}<span><strong>${dt("Team")}:</strong> <code>${feed.lastErrorDetail}</code></span></div>`} ${channelClosed.has(feed.channelId) && renderTemplate`<div class="fd-err">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "13", "height": "13" })}<span><strong>#${channelName.get(feed.channelId)}</strong>: ${channelClosed.get(feed.channelId)}<span class="fd-err-fix">${dt("Give Petto the permission there, or edit the feed and pick another channel.")}</span></span></div>`} <div class="fd-actions"> <button type="button" class="btn btn-ghost btn-sm"${addAttribute(feed.id, "data-feed-test")}${addAttribute(dt("Send a test notice"), "title")}${addAttribute(dt("Send a test notice"), "aria-label")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "13", "height": "13" })}${dt("Test")}</button> <button type="button" class="btn btn-ghost btn-sm"${addAttribute(feed.id, "data-feed-edit")}${addAttribute(dt("Edit"), "title")}${addAttribute(dt("Edit"), "aria-label")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-bold", "width": "13", "height": "13" })}${dt("Edit")}</button> <button type="button" class="btn btn-ghost btn-sm"${addAttribute(feed.id, "data-feed-toggle")}${addAttribute(feed.enabled ? "1" : "", "data-on")}${addAttribute(feed.enabled ? dt("Pause") : dt("Resume"), "title")}${addAttribute(feed.enabled ? dt("Pause") : dt("Resume"), "aria-label")}>${renderComponent($$result2, "Icon", $$Icon, { "name": feed.enabled ? "ph:pause-fill" : "ph:play-fill", "width": "13", "height": "13" })}${feed.enabled ? dt("Pause") : dt("Resume")}</button> <button type="button" class="fd-del"${addAttribute(feed.id, "data-feed-delete")}${addAttribute(feed.accountName, "data-name")}${addAttribute(dt("Stop following"), "title")}${addAttribute(dt("Stop following"), "aria-label")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-bold", "width": "13", "height": "13" })}${dt("Remove")}</button> </div> </li>`;
  })} </ul> </section>`} <p class="sx-empty fd-nomatch" data-feed-nomatch hidden>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "15", "height": "15" })}${dt("No account matches your search.")}</p> ${shown.length === 0 && ready && (current ? renderTemplate`<div class="fd-empty"><span class="fd-logo"${addAttribute(`--fd-c:${current.color};--fd-ink:${current.ink}`, "style")}>${renderComponent($$result2, "Icon", $$Icon, { "name": current.icon, "width": "24", "height": "24" })}</span><h2>${dt("No {name} account followed yet", { name: current.name })}</h2><p>${dt("Add one and Petto will post its news here as soon as they happen.")}</p><button type="button" class="btn btn-accent btn-sm"${addAttribute(current.id, "data-feed-new")}${addAttribute(full, "disabled")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14" })}${dt("New feed")}</button></div>` : renderTemplate`<div class="fd-empty"><span class="fd-logo fd-logo-all">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:bell-ringing-fill", "width": "24", "height": "24" })}</span><h2>${dt("No account followed yet")}</h2><p>${dt("Pick a platform to follow your first account.")}</p></div>`)} ${current && renderTemplate`<section class="sx-panel fd-about" aria-labelledby="fd-about-title"> <div class="sx-panel-head"> <span class="sx-panel-icon">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "17", "height": "17" })}</span> <h2 id="fd-about-title">${dt("What Petto posts")}</h2> </div> ${(current.intro || current.account) && renderTemplate`<p class="sx-lead fd-about-text">${current.intro ? dt(current.intro) : dt(current.account.help)}</p>`} <div class="fd-kinds">${current.types.map((type) => renderTemplate`<span class="fd-kind">${renderComponent($$result2, "Icon", $$Icon, { "name": typeIcon(type), "width": "13", "height": "13" })}${typeLabel(type)}</span>`)}</div> </section>`} ${!current && renderTemplate`<section class="sx-panel fd-locked"${addAttribute(dt("Locked for now"), "aria-label")}> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--text-dim)">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lock-fill", "width": "17", "height": "17" })}</span> <h2>${dt("Premium, locked for now")}</h2> <a class="fd-locked-link" href="/premium">${dt("See Premium")}</a> </div> <p class="sx-hint">${dt("These services cost money to follow, so they will be Premium only to cover that cost. They unlock when they are ready.")}</p> <ul class="fd-locked-list"> ${LOCKED_PLATFORMS.map((p) => renderTemplate`<li${addAttribute(`--fd-c:${p.color};--fd-ink:${p.ink}`, "style")}><span class="fd-logo">${renderComponent($$result2, "Icon", $$Icon, { "name": p.icon, "width": "16", "height": "16" })}</span><div><b>${p.name}</b><small>${dt(p.reason)}</small></div>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lock-fill", "width": "14", "height": "14" })}</li>`)} </ul> </section>`} </div> ${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "vars": FEED_VARIABLES.map((variable) => ({ tok: variable.tok, desc: dt(variable.desc) })) })} <div hidden data-icons="platform">${FEED_PLATFORMS.map((p) => renderTemplate`<span${addAttribute(p.id, "data-icon-id")}>${renderComponent($$result2, "Icon", $$Icon, { "name": p.icon, "width": "16", "height": "16" })}</span>`)}</div> <div hidden data-icons="type">${Object.entries(FEED_TYPES).map(([id, type]) => renderTemplate`<span${addAttribute(id, "data-icon-id")}>${renderComponent($$result2, "Icon", $$Icon, { "name": type.icon, "width": "14", "height": "14" })}</span>`)}</div> ${renderComponent($$result2, "Modal", $$Modal, { "id": "fd-modal", "title": dt("New feed"), "icon": "ph:bell-ringing-fill" }, { "default": async ($$result3) => renderTemplate` <form class="fd-form" data-feed-form data-no-dirty autocomplete="off" novalidate> <p class="fd-sub" data-sub></p> <div class="fd-wait" data-auto-wait hidden></div> <div class="fd-field" data-step="account"> <div class="fd-combo" data-combo> <div class="fd-search-box"> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "15", "height": "15" })} <input id="fd-account" type="text" data-account-input maxlength="200" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="fd-results"${addAttribute(dt("Search"), "aria-label")}> <span class="fd-spin" data-spin hidden aria-hidden="true"></span> </div> <ul class="fd-results" id="fd-results" data-results role="listbox" hidden></ul> </div> <div class="fd-found" data-found hidden></div> <span class="fd-help" data-account-help></span> </div> <div class="fd-field" data-step="pace" hidden> <label for="fd-pace">${dt("How often")}</label> <select id="fd-pace" data-pace>${FEED_PACES.map((pace) => renderTemplate`<option${addAttribute(String(pace.minutes), "value")}>${dt(pace.label)}</option>`)}</select> <span class="fd-help">${dt("Every time Petto posts something new. The shortest is every 5 minutes, so the channel is not flooded.")}</span> </div> <fieldset class="fd-field fd-set" data-step="kinds" hidden><legend>${dt("Which animals")}</legend> <div class="fd-types" data-kinds>${ANIMAL_KINDS.map((kind) => renderTemplate`<label class="fd-type-pick"><input type="checkbox"${addAttribute(kind.id, "value")}><span>${renderComponent($$result3, "Icon", $$Icon, { "name": kind.icon, "width": "14", "height": "14" })}${dt(kind.label)}</span></label>`)}</div> <span class="fd-help">${dt("Pick the ones you want, or none to get any of them.")}</span> </fieldset> <div class="fd-field" data-step="tags" hidden> <label for="fd-tags">${dt("Tags")}</label> <input id="fd-tags" type="text" data-tags maxlength="60" autocomplete="off"> <span class="fd-help">${dt("One to four words in English, like pink, cats aesthetic or anime roses. Add anime to get anime pictures, memes for funny ones (cat memes) and a minus sign to leave a word out (pink flower anime -character).")}</span> </div> <fieldset class="fd-field fd-set" data-types-box><legend>${dt("What to post")}</legend><div class="fd-types" data-types></div></fieldset> <div class="fd-field"> <label for="fd-channel">${dt("Channel")}</label> <select id="fd-channel" data-channel><option value="">${dt("Pick a channel")}</option>${channels.map((channel) => renderTemplate`<option${addAttribute(channel.id, "value")}>#${channel.name}</option>`)}</select> <span class="fd-help fd-chan-note" data-chan-note hidden></span> </div> <div class="fd-field"> <label for="fd-message">${dt("Message above the notice")} <small>(${dt("optional")})</small></label> <textarea id="fd-message" data-message data-ac="vars,emojis,roles" rows="3" maxlength="1500"${addAttribute(dt("Optional text above the card"), "placeholder")}></textarea>${renderComponent($$result3, "SilentMentionHint", $$SilentMentionHint, {})} <div class="fd-chips" data-var-chips>${FEED_VARIABLES.slice(0, 4).map((variable) => renderTemplate`<button type="button" class="fd-chip"${addAttribute(variable.tok, "data-var")}${addAttribute(dt(variable.desc), "title")}>${variable.tok}</button>`)}</div> </div> <div class="fd-field"> <label for="fd-role">${dt("Ping")}</label> <select id="fd-role" data-role-select><option value="">${dt("Add a role to ping")}</option>${roles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")}>${role.name}</option>`)}</select> <div class="fd-roles" data-roles></div> <label class="fd-switch"><span>${dt("Also mention @everyone")}</span><input type="checkbox" data-everyone><i aria-hidden="true"></i></label> </div> <details class="fd-more"> <summary>${dt("More options")}</summary> <div class="fd-field" data-image-field> <label for="fd-image">${dt("Big picture")}</label> <select id="fd-image" data-image><option value="">${dt("Automatic")}</option><option value="on">${dt("Always show it")}</option><option value="off">${dt("Never show it")}</option></select> <span class="fd-help">${dt("Automatic shows the cover of videos and streams, and leaves it out for Shorts.")}</span> </div> <div class="fd-field" data-player-field hidden> <label class="fd-switch"><span>${dt("Show the video player")}</span><input type="checkbox" data-player><i aria-hidden="true"></i></label> <span class="fd-help">${dt("Posts the link instead of the card, so Discord plays the video right there. Streams keep their card.")}</span> </div> <label class="fd-switch"><span>${dt("Add a button that opens it")}</span><input type="checkbox" data-button checked><i aria-hidden="true"></i></label> <div class="fd-field"> <label for="fd-reactions">${dt("Reactions")}</label> <input id="fd-reactions" type="text" data-reactions maxlength="300"${addAttribute(dt("up to 5 emojis, like \u{1F44D} \u{1F525}"), "placeholder")} autocomplete="off"> <span class="fd-help">${dt("Petto adds these emojis to each notice. Custom emojis have to be from a server where Petto is.")}</span> </div> <div class="fd-field"><label for="fd-include">${dt("Only if the title has one of these words")}</label><input id="fd-include" type="text" data-include maxlength="300"${addAttribute(dt("words, separated by commas"), "placeholder")}></div> <div class="fd-field"><label for="fd-exclude">${dt("Skip it if the title has one of these words")}</label><input id="fd-exclude" type="text" data-exclude maxlength="300"${addAttribute(dt("words, separated by commas"), "placeholder")}></div> </details> <details class="fd-more fd-prev" data-preview-details> <summary>${dt("Preview")}</summary> <div class="fd-tabs" data-preview-tabs></div> <div class="fd-preview-box" data-preview></div> <p class="fd-help">${dt("This is an example. The real notice has the title, picture and link of what was published.")}</p> </details> <div class="fd-senses" data-senses hidden role="group"></div> <div class="fd-wait" data-wait hidden></div> <p class="fd-error" data-error hidden role="alert"></p> <div class="fd-foot"> <button type="button" class="btn btn-ghost btn-sm" data-modal-close>${dt("Cancel")}</button> <button type="submit" class="btn btn-accent btn-sm" data-submit>${dt("Follow this account")}</button> </div> </form> ` })} ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashFeeds.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Feeds = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Feeds;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  if (!canUseFeeds(Astro2, session.userId)) return Astro2.redirect(`/dash/guild/${id}/overview`);
  const wanted = Astro2.url.searchParams.get("platform") ?? "";
  const platform = platformById(wanted)?.id ?? null;
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
  const [guildInfo, rowsRes, channelsRes, rolesRes, premium] = await Promise.all([
    getGuildInfo(id, botToken),
    // A database that does not answer in ten seconds is reported as "not ready" instead of keeping the page waiting for minutes.
    fetch(`${apiUrl}/rest/v1/feeds?guild_id=eq.${id}&select=*&order=id.asc&limit=500`, { headers: apiHeaders, signal: AbortSignal.timeout(1e4) }).catch(() => null),
    getGuildList(Astro2, id, botToken, "channels"),
    getGuildList(Astro2, id, botToken, "roles"),
    hasPremiumForGuild(Astro2, session.userId, id)
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = Boolean(rowsRes?.ok);
  const feeds = (ready ? await rowsRes.json().catch(() => []) : []).map(feedFromRow);
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map(postableChannel);
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: String(r.id), name: String(r.name), color: Number(r.color) || 0 }));
  const limit = planLimits(premium).feeds;
  return renderTemplate`${renderComponent($$result, "DashFeeds", $$DashFeeds, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "platform": platform, "feeds": feeds, "channels": channels, "roles": roles, "limit": limit, "premium": premium, "premiumLimit": PREMIUM_LIMITS.feeds, "freeLimit": FREE_LIMITS.feeds, "ready": ready, "teamView": isPettoTeam(Astro2, session.userId) })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/feeds.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/feeds.astro";
const $$url = "/dash/guild/[id]/feeds";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Feeds,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
