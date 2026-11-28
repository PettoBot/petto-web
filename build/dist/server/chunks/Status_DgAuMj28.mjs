import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { $ as $$Base } from './Base_Di2YHjFe.mjs';
import { u as useTranslations, l as localePath } from './ui_C1MR3LHJ.mjs';
import { g as getEnv } from './env_WnBvzCjc.mjs';
import { g as getStatusHistory, s as startedDay } from './statusHistory_BHKFqBBT.mjs';
import { i as incidentDays } from './statusMonitor_eg7DWmfk.mjs';
/* empty css                          */

const $$Astro = createAstro("https://petto.sbs");
const $$Status = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Status;
  const { lang } = Astro2.props;
  const t = useTranslations(lang);
  const s = t.simplePages.status;
  const base = localePath[lang] ?? "";
  const statusEndpoint = new URL("/api/status", Astro2.url).pathname;
  const searchEndpoint = new URL("/api/status-search", Astro2.url).pathname;
  const STALE_MS = 5 * 60 * 1e3;
  async function botApiGet(table) {
    const url = getEnv(Astro2, "PETTO_BOT_API_URL");
    const key = getEnv(Astro2, "PETTO_BOT_API_SECRET");
    if (!url || !key) return null;
    try {
      const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "X-Petto-Dashboard-Key": key
        }
      });
      if (!res.ok) return null;
      const rows = await res.json();
      return Array.isArray(rows) && rows.length > 0 ? rows : null;
    } catch {
      return null;
    }
  }
  function bucket(rawStatus, updatedAt, now2) {
    const staleAt = new Date(updatedAt).getTime() + STALE_MS;
    if (staleAt < now2) return "offline";
    if (rawStatus === "Ready") return "operational";
    if (rawStatus === "Disconnected") return "offline";
    return "reconnecting";
  }
  function formatUptime(totalSeconds) {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor(totalSeconds % 86400 / 3600);
    const m = Math.floor(totalSeconds % 3600 / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }
  const history = await getStatusHistory(Astro2).catch(() => ({ available: false, generatedAt: (/* @__PURE__ */ new Date()).toISOString(), startedAt: null, days: [], services: [], incidents: [] }));
  const historyEndpoint = new URL("/api/status-history", Astro2.url).pathname;
  const serviceNames = { bot: s.svcBot, site: s.svcSite, database: s.svcDatabase };
  const nowLabel = { up: s.shardOperational, degraded: s.nowDegraded, down: s.nowDown, unknown: s.nowUnknown };
  const uiCopy = {
    en: {
      servicesLead: "Services.",
      servicesSub: "Uptime for each over the last {n} days.",
      grpBot: "Discord Bot",
      grpWeb: "Web & Platform",
      descBot: "Commands, events and Discord gateway connection.",
      descSite: "Public website, web dashboard and API routes.",
      descDb: "PostgreSQL configuration database and live state.",
      uptimeSuffix: "uptime",
      checkLead: "Is my server affected?",
      checkSub: "Check the shard that serves it.",
      checkBtn: "Check",
      calLead: "Event calendar.",
      calSub: "Days with a published incident.",
      incBtn: "Incident history",
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      ringCrit: "Outage",
      ringWarn: "Degraded",
      ringNone: "Unmeasured",
      ringOk: "No impact",
      supportBtn: "Join support server"
    },
    es: {
      servicesLead: "Servicios.",
      servicesSub: "Disponibilidad de cada uno en los \xFAltimos {n} d\xEDas.",
      grpBot: "Bot de Discord",
      grpWeb: "Web y Plataforma",
      descBot: "Comandos, eventos y conexi\xF3n con el gateway de Discord.",
      descSite: "Sitio p\xFAblico, dashboard web y rutas de API.",
      descDb: "Base de datos PostgreSQL de configuraci\xF3n y estado en vivo.",
      uptimeSuffix: "activo",
      checkLead: "\xBFMi servidor est\xE1 afectado?",
      checkSub: "Comprueba el shard que lo atiende.",
      checkBtn: "Comprobar",
      calLead: "Calendario de eventos.",
      calSub: "D\xEDas con alg\xFAn incidente registrado.",
      incBtn: "Historial de incidentes",
      weekdays: ["Lun", "Mar", "Mi\xE9", "Jue", "Vie", "S\xE1b", "Dom"],
      ringCrit: "Ca\xEDda",
      ringWarn: "Degradado",
      ringNone: "Sin medir",
      ringOk: "Sin impacto",
      supportBtn: "Entrar al soporte"
    },
    "pt-BR": {
      servicesLead: "Servi\xE7os.",
      servicesSub: "Disponibilidade de cada um nos \xFAltimos {n} dias.",
      grpBot: "Bot do Discord",
      grpWeb: "Web e Plataforma",
      descBot: "Comandos, eventos e conex\xE3o com o gateway do Discord.",
      descSite: "Site p\xFAblico, dashboard web e rotas de API.",
      descDb: "Banco PostgreSQL de configura\xE7\xE3o e estado ao vivo.",
      uptimeSuffix: "ativo",
      checkLead: "Meu servidor foi afetado?",
      checkSub: "Verifique o shard que atende ele.",
      checkBtn: "Verificar",
      calLead: "Calend\xE1rio de eventos.",
      calSub: "Dias com algum incidente registrado.",
      incBtn: "Hist\xF3rico de incidentes",
      weekdays: ["Seg", "Ter", "Qua", "Qui", "Sex", "S\xE1b", "Dom"],
      ringCrit: "Queda",
      ringWarn: "Degradado",
      ringNone: "Sem medi\xE7\xE3o",
      ringOk: "Sem impacto",
      supportBtn: "Entrar no suporte"
    }
  }[lang];
  const serviceDescs = {
    bot: uiCopy.descBot,
    site: uiCopy.descSite,
    database: uiCopy.descDb
  };
  const calcUptimePct = (marks) => {
    const measured = marks.filter((m) => m.s !== "pre" && m.s !== "nodata");
    if (!measured.length) return "100.00%";
    const totalMins = measured.length * 1440;
    const downMins = measured.reduce((acc, m) => acc + (Number(m.dm) || 0), 0);
    const pct = Math.max(0, Math.min(100, (totalMins - downMins) / totalMins * 100));
    return `${pct.toFixed(2)}%`;
  };
  const overallOf = (h) => {
    const states = h.services.map((svc) => svc.now);
    if (!h.available || !states.length || states.every((state) => state === "unknown")) return "unknown";
    return states.includes("down") ? "down" : states.includes("degraded") ? "degraded" : "up";
  };
  const overall = overallOf(history);
  const headingFor = (state) => state === "down" ? s.headingDown : state === "degraded" ? s.headingDegraded : state === "unknown" ? s.headingUnknown : s.heading;
  const dateLocale = lang === "pt-BR" ? "pt-BR" : lang;
  const dayLabel = (day) => (/* @__PURE__ */ new Date(`${day}T00:00:00Z`)).toLocaleDateString(dateLocale, { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });
  const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
  const started = startedDay(history);
  const barClass = (state) => state === "down" ? "down" : state === "warn" ? "warn" : state === "nodata" ? "none" : "up";
  const barTip = (mark) => {
    const lines = [dayLabel(mark.d)];
    if (mark.s === "pre") lines.push(started ? fill(s.tipPre, { date: dayLabel(started) }) : s.startingNote);
    else if (mark.s === "nodata") lines.push(s.tipNone);
    else if (mark.s === "up") lines.push(s.tipUp);
    else {
      if (mark.dm) lines.push(fill(s.tipDown, { n: mark.dm }));
      if (mark.um) lines.push(fill(s.tipUnconfirmed, { n: mark.um }));
      if (mark.gm) lines.push(fill(s.tipGap, { n: mark.gm }));
    }
    if (mark.c) lines.push(fill(s.tipChecks, { n: mark.c }));
    return lines.join("\n");
  };
  const fallbackDays = Array.from({ length: 90 }, (_, idx) => {
    const d = new Date(Date.now() - (89 - idx) * 864e5).toISOString().slice(0, 10);
    return d;
  });
  const dayKeys = history.days.length ? history.days : fallbackDays;
  const overallMarks = dayKeys.map((d, idx) => {
    if (!history.services.length) return { d, s: "up", dm: 0 };
    const states = history.services.map((svc) => svc.marks[idx]?.s ?? "pre");
    const dm = Math.max(0, ...history.services.map((svc) => Number(svc.marks[idx]?.dm ?? 0)));
    const state = states.includes("down") ? "down" : states.includes("warn") ? "warn" : states.every((x) => x === "nodata") ? "nodata" : states.every((x) => x === "pre") ? "pre" : "up";
    return { d, s: state, dm };
  });
  const overallPct = calcUptimePct(overallMarks);
  const incidentText = (inc) => inc.kind === "down" ? fill(s.incDown, { n: inc.minutes }) : inc.kind === "nodata" ? s.incNone : inc.minutes && !inc.unconfirmed ? fill(s.incGap, { n: inc.minutes }) : s.incWarn;
  const clientText = { incidentNoneDay: s.incidentNoneDay, incidentNoneToday: s.incidentNoneToday, up: s.shardOperational, degraded: s.nowDegraded, down: s.nowDown, unknown: s.nowUnknown, tipPre: s.tipPre, startingNote: s.startingNote, tipNone: s.tipNone, tipUp: s.tipUp, tipDown: s.tipDown, tipUnconfirmed: s.tipUnconfirmed, tipGap: s.tipGap, tipChecks: s.tipChecks, daysAgo: s.daysAgo, today: s.today, headingOk: s.heading, headingDegraded: s.headingDegraded, headingDown: s.headingDown, headingUnknown: s.headingUnknown, startedNote: s.startedNote, incDown: s.incDown, incWarn: s.incWarn, incGap: s.incGap, incNone: s.incNone, incidentsNone: s.incidentsNone, unavailable: s.histUnavailable, svcBot: s.svcBot, svcSite: s.svcSite, svcDatabase: s.svcDatabase, uptimeSuffix: uiCopy.uptimeSuffix, servicesSub: uiCopy.servicesSub };
  const incidentList = incidentDays(history.days, history.incidents, started, 14);
  const noteOf = (inc) => inc.note?.[lang] ?? inc.note?.en ?? "";
  const now = Date.now();
  const shardRows = await botApiGet("bot_status");
  function tierOf(state, ping) {
    if (state === "offline") return "down";
    if (state === "reconnecting") return "slow";
    if (ping === null || ping === void 0 || !Number.isFinite(Number(ping))) return "unknown";
    return Number(ping) <= 50 ? "good" : Number(ping) <= 150 ? "warn" : Number(ping) <= 300 ? "slow" : "down";
  }
  const shards = shardRows ? shardRows.sort((a, b) => a.shard_id - b.shard_id).map((r) => {
    const state = bucket(r.status, r.updated_at, now);
    return { id: r.shard_id, guildCount: r.guild_count, members: r.member_count ?? null, ping: r.ping_ms, state, tier: tierOf(state, r.ping_ms), cluster: r.cluster_name ?? null, place: r.cluster_location ?? null };
  }) : null;
  const numberFormat = new Intl.NumberFormat(lang === "pt-BR" ? "pt-BR" : lang);
  const clusterText = (name, place) => [name, place].filter(Boolean).join(" \xB7 ");
  const totalServers = shards ? shards.filter((sh) => sh.state !== "offline").reduce((total, sh) => total + (Number(sh.guildCount) || 0), 0) : null;
  const hostRows = await botApiGet("bot_host");
  const host = hostRows ? hostRows[0] : null;
  const stateLabel = {
    operational: s.shardOperational,
    offline: s.shardOffline,
    reconnecting: s.shardReconnecting
  };
  const effectiveServices = history.services.length ? history.services : ["bot", "site", "database"].map((id) => ({
    id,
    now: "up",
    marks: overallMarks
  }));
  const botServices = effectiveServices.filter((svc) => svc.id === "bot");
  const webServices = effectiveServices.filter((svc) => svc.id !== "bot");
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${s.title} \xB7 Petto`, "lang": lang, "skin": "ash", "data-astro-cid-tvtxql23": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="statusBlock"${addAttribute(statusEndpoint, "data-status-endpoint")}${addAttribute(STALE_MS, "data-stale-ms")}${addAttribute(s.shardOperational, "data-label-operational")}${addAttribute(s.shardOffline, "data-label-offline")}${addAttribute(s.shardReconnecting, "data-label-reconnecting")}${addAttribute(s.guildsCol, "data-label-servers")}${addAttribute(s.pingCol, "data-label-ping")}${addAttribute(s.noShardData, "data-label-nodata")}${addAttribute(s.shardName, "data-label-shard")}${addAttribute(s.uptimeLabel, "data-label-uptime")}${addAttribute(s.membersCol, "data-label-members")}${addAttribute(s.statusCol, "data-label-state")}${addAttribute(s.clusterLabel, "data-label-cluster")}${addAttribute(lang === "pt-BR" ? "pt-BR" : lang, "data-locale")} data-astro-cid-tvtxql23> <!-- 1. Atmospheric Night Hero --> <section class="st-hero" data-astro-cid-tvtxql23> <div class="st-stars" aria-hidden="true" data-astro-cid-tvtxql23></div> <div class="wrap st-hero-in" data-astro-cid-tvtxql23> <div class="st-hero-pill" data-astro-cid-tvtxql23> <img src="/assets/favicon-3d.png" alt="" width="18" height="18" data-astro-cid-tvtxql23> <span class="eyebrow" data-astro-cid-tvtxql23>${s.pill}</span> <span class="live-badge" id="liveBadge" data-astro-cid-tvtxql23><span class="live-dot" data-astro-cid-tvtxql23></span>${s.live}</span> </div> <h1 class="st-main-title" data-astro-cid-tvtxql23>${s.title}</h1> <p class="status-desc" data-astro-cid-tvtxql23>${s.desc}</p> <div class="st-hero-actions" data-astro-cid-tvtxql23> <a class="btn btn-primary st-pill-btn" href="#services" data-astro-cid-tvtxql23>${uiCopy.servicesLead.replace(".", "")}</a> <a class="btn btn-ghost st-pill-btn" href="#calendar" data-astro-cid-tvtxql23>${uiCopy.incBtn} ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right", "width": "13", "height": "13", "data-astro-cid-tvtxql23": true })}</a> </div> </div> </section> <!-- 2. Overlapping Overall Summary Card + Collapsible 90-Day Service Groups --> <section class="st-services-sec" id="services" data-astro-cid-tvtxql23> <div class="wrap st-services-wrap" id="statusHistory"${addAttribute(historyEndpoint, "data-endpoint")}${addAttribute(dateLocale, "data-locale")}${addAttribute(JSON.stringify(clientText), "data-text")} data-period="90"${addAttribute(JSON.stringify(overallMarks), "data-cal")} data-astro-cid-tvtxql23> <div class="st-top-card" data-astro-cid-tvtxql23> <div class="st-top-head" data-astro-cid-tvtxql23> <h2 id="statusHeading" class="st-overall-title" data-astro-cid-tvtxql23> <span${addAttribute(["status-hero-dot", overall], "class:list")} data-astro-cid-tvtxql23></span> <span id="statusHeadingText" data-astro-cid-tvtxql23>${headingFor(overall)}</span> </h2> <div class="st-top-metrics" data-astro-cid-tvtxql23> <span class="st-uptime-pill" id="overallUptime" data-astro-cid-tvtxql23>${overallPct} ${uiCopy.uptimeSuffix}</span> <span class="st-metric-chip" data-astro-cid-tvtxql23><b id="statusTotal" data-astro-cid-tvtxql23>${totalServers ?? "\u2014"}</b> ${s.totalServers}</span> <div id="hostContent" class="st-host-inline" data-astro-cid-tvtxql23> ${host && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-tvtxql23": true }, { "default": async ($$result3) => renderTemplate` <span class="st-metric-chip" data-astro-cid-tvtxql23><b data-astro-cid-tvtxql23>${formatUptime(host.uptime_seconds)}</b> ${s.uptimeLabel}</span> <span class="st-metric-chip" data-astro-cid-tvtxql23><b data-astro-cid-tvtxql23>${host.node_version}</b></span> ` })}`} </div> </div> </div> <div class="bars st-overall-bars" id="overallBars" aria-hidden="true" data-astro-cid-tvtxql23> ${overallMarks.map((mark) => renderTemplate`<i${addAttribute(`b ${barClass(mark.s)}${mark.s === "pre" ? " pre" : ""}`, "class")}${addAttribute(mark.d, "data-d")}${addAttribute(barTip(mark), "data-tip")} data-astro-cid-tvtxql23></i>`)} </div> <div class="bars-axis" data-astro-cid-tvtxql23><span data-axis-start data-astro-cid-tvtxql23>${fill(s.daysAgo, { n: 90 })}</span><span data-astro-cid-tvtxql23>${s.today}</span></div> </div> <div class="hist-head" data-astro-cid-tvtxql23> <div class="st-sec-head st-two-tone" data-astro-cid-tvtxql23> <h2 class="st-two-h2" data-astro-cid-tvtxql23><b data-astro-cid-tvtxql23>${uiCopy.servicesLead}</b> <span id="stServicesSub" data-astro-cid-tvtxql23>${fill(uiCopy.servicesSub, { n: 90 })}</span></h2> </div> <label class="hist-period" data-astro-cid-tvtxql23> <span class="sr-only" data-astro-cid-tvtxql23>${s.periodLabel}</span> <select id="histPeriod" data-dash-menu${addAttribute(s.periodLabel, "aria-label")} data-astro-cid-tvtxql23> <option value="90" selected data-astro-cid-tvtxql23>${s.period90}</option> <option value="60" data-astro-cid-tvtxql23>${s.period60}</option> <option value="30" data-astro-cid-tvtxql23>${s.period30}</option> </select> </label> </div> ${!history.available && renderTemplate`<p class="hist-problem" role="status" data-astro-cid-tvtxql23>${s.histUnavailable}</p>`} <div class="st-groups" id="histCards" data-astro-cid-tvtxql23> <!-- Group 1: Discord Bot + Gateway Shards --> <details class="st-group" open data-astro-cid-tvtxql23> <summary class="st-group-head" data-astro-cid-tvtxql23> <span class="st-group-title" data-astro-cid-tvtxql23>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:robot-fill", "width": "16", "height": "16", "data-astro-cid-tvtxql23": true })} ${uiCopy.grpBot}</span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "width": "13", "height": "13", "class": "st-group-caret", "data-astro-cid-tvtxql23": true })} </summary> <div class="st-group-body" data-astro-cid-tvtxql23> ${botServices.map((svc) => renderTemplate`<article class="hist-card"${addAttribute(svc.id, "data-svc")}${addAttribute(JSON.stringify(svc.marks), "data-marks")} data-astro-cid-tvtxql23> <header class="hist-card-head" data-astro-cid-tvtxql23> <div class="st-svc-left" data-astro-cid-tvtxql23> <span${addAttribute(`st-svc-ic ${svc.now}`, "class")} data-astro-cid-tvtxql23>${renderComponent($$result2, "Icon", $$Icon, { "name": svc.now === "down" ? "ph:x-circle-fill" : svc.now === "degraded" ? "ph:warning-fill" : "ph:check-circle-fill", "width": "18", "height": "18", "data-astro-cid-tvtxql23": true })}</span> <div data-astro-cid-tvtxql23> <h3 data-astro-cid-tvtxql23>${serviceNames[svc.id]}</h3> <p class="st-svc-desc" data-astro-cid-tvtxql23>${serviceDescs[svc.id]}</p> </div> </div> <div class="st-svc-right" data-astro-cid-tvtxql23> <span class="st-svc-pct" data-svc-pct data-astro-cid-tvtxql23>${calcUptimePct(svc.marks)} ${uiCopy.uptimeSuffix}</span> <span${addAttribute(`hist-now ${svc.now}`, "class")} data-astro-cid-tvtxql23>${nowLabel[svc.now]}</span> </div> </header> <div class="bars" role="img"${addAttribute(fill(s.serviceHistory, { n: 90 }), "aria-label")} data-astro-cid-tvtxql23> ${svc.marks.map((mark) => renderTemplate`<i${addAttribute(`b ${barClass(mark.s)}${mark.s === "pre" ? " pre" : ""}`, "class")}${addAttribute(mark.d, "data-d")}${addAttribute(barTip(mark), "data-tip")} data-astro-cid-tvtxql23></i>`)} </div> <div class="bars-axis" data-astro-cid-tvtxql23><span data-axis-start data-astro-cid-tvtxql23>${fill(s.daysAgo, { n: 90 })}</span><span data-astro-cid-tvtxql23>${s.today}</span></div> </article>`)} <div class="st-shards-sub" data-astro-cid-tvtxql23> <div class="st-shards-bar" data-astro-cid-tvtxql23> <span class="status-block-label" data-astro-cid-tvtxql23>${s.shardsTitle}</span> <ul class="tier-legend"${addAttribute(s.legendTitle, "aria-label")} data-astro-cid-tvtxql23> <li data-astro-cid-tvtxql23><span class="tier-dot good" data-astro-cid-tvtxql23></span>${s.tierGood}</li> <li data-astro-cid-tvtxql23><span class="tier-dot warn" data-astro-cid-tvtxql23></span>${s.tierWarn}</li> <li data-astro-cid-tvtxql23><span class="tier-dot slow" data-astro-cid-tvtxql23></span>${s.tierSlow}</li> <li data-astro-cid-tvtxql23><span class="tier-dot down" data-astro-cid-tvtxql23></span>${s.tierDown}</li> </ul> </div> <div id="shardsContent" class="shard-grid" data-astro-cid-tvtxql23> ${shards ? shards.map((sh) => renderTemplate`<div class="shard-card"${addAttribute(sh.id, "data-shard-id")}${addAttribute(sh.tier, "data-tier")} tabindex="0" data-astro-cid-tvtxql23> <div class="shard-card-head" data-astro-cid-tvtxql23> <span class="tier-dot" aria-hidden="true" data-astro-cid-tvtxql23></span> <span class="shard-name" data-astro-cid-tvtxql23>${s.shardName} ${Number(sh.id) + 1}</span> <span${addAttribute(["status-pill", sh.state], "class:list")} data-astro-cid-tvtxql23>${stateLabel[sh.state] ?? s.shardUnknown}</span> </div> <div class="shard-card-stats" data-astro-cid-tvtxql23> <div class="shard-stat" data-astro-cid-tvtxql23><span class="n" data-astro-cid-tvtxql23>${sh.guildCount}</span><span class="l" data-astro-cid-tvtxql23>${s.guildsCol}</span></div> <div class="shard-stat" data-astro-cid-tvtxql23><span class="n" data-astro-cid-tvtxql23>${sh.ping != null ? `${sh.ping}` : "n/a"}<em data-astro-cid-tvtxql23>ms</em></span><span class="l" data-astro-cid-tvtxql23>${s.pingCol}</span></div> </div> <dl class="shard-tip" role="tooltip" data-astro-cid-tvtxql23> <div data-astro-cid-tvtxql23><dt data-astro-cid-tvtxql23>${s.guildsCol}</dt><dd data-astro-cid-tvtxql23>${numberFormat.format(Number(sh.guildCount) || 0)}</dd></div> ${sh.members != null && renderTemplate`<div data-astro-cid-tvtxql23><dt data-astro-cid-tvtxql23>${s.membersCol}</dt><dd data-astro-cid-tvtxql23>${numberFormat.format(Number(sh.members) || 0)}</dd></div>`} <div data-astro-cid-tvtxql23><dt data-astro-cid-tvtxql23>${s.pingCol}</dt><dd data-astro-cid-tvtxql23>${sh.ping != null ? `${sh.ping} ms` : "n/a"} · ${stateLabel[sh.state] ?? s.shardUnknown}</dd></div> ${clusterText(sh.cluster, sh.place) && renderTemplate`<div data-astro-cid-tvtxql23><dt data-astro-cid-tvtxql23>${s.clusterLabel}</dt><dd data-astro-cid-tvtxql23>${clusterText(sh.cluster, sh.place)}</dd></div>`} </dl> </div>`) : renderTemplate`<p class="no-shard-data" data-astro-cid-tvtxql23>${s.noShardData}</p>`} </div> </div> </div> </details> <!-- Group 2: Web & Platform --> <details class="st-group" open data-astro-cid-tvtxql23> <summary class="st-group-head" data-astro-cid-tvtxql23> <span class="st-group-title" data-astro-cid-tvtxql23>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:globe-fill", "width": "16", "height": "16", "data-astro-cid-tvtxql23": true })} ${uiCopy.grpWeb}</span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "width": "13", "height": "13", "class": "st-group-caret", "data-astro-cid-tvtxql23": true })} </summary> <div class="st-group-body" data-astro-cid-tvtxql23> ${webServices.map((svc) => renderTemplate`<article class="hist-card"${addAttribute(svc.id, "data-svc")}${addAttribute(JSON.stringify(svc.marks), "data-marks")} data-astro-cid-tvtxql23> <header class="hist-card-head" data-astro-cid-tvtxql23> <div class="st-svc-left" data-astro-cid-tvtxql23> <span${addAttribute(`st-svc-ic ${svc.now}`, "class")} data-astro-cid-tvtxql23>${renderComponent($$result2, "Icon", $$Icon, { "name": svc.now === "down" ? "ph:x-circle-fill" : svc.now === "degraded" ? "ph:warning-fill" : "ph:check-circle-fill", "width": "18", "height": "18", "data-astro-cid-tvtxql23": true })}</span> <div data-astro-cid-tvtxql23> <h3 class="st-svc-title-row" data-astro-cid-tvtxql23> ${serviceNames[svc.id]} ${svc.id === "site" && renderTemplate`<a${addAttribute(`${base}/`, "href")} class="st-svc-ext"${addAttribute(serviceNames[svc.id], "aria-label")} data-astro-cid-tvtxql23>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-up-right", "width": "13", "height": "13", "data-astro-cid-tvtxql23": true })}</a>`} </h3> <p class="st-svc-desc" data-astro-cid-tvtxql23>${serviceDescs[svc.id]}</p> </div> </div> <div class="st-svc-right" data-astro-cid-tvtxql23> <span class="st-svc-pct" data-svc-pct data-astro-cid-tvtxql23>${calcUptimePct(svc.marks)} ${uiCopy.uptimeSuffix}</span> <span${addAttribute(`hist-now ${svc.now}`, "class")} data-astro-cid-tvtxql23>${nowLabel[svc.now]}</span> </div> </header> <div class="bars" role="img"${addAttribute(fill(s.serviceHistory, { n: 90 }), "aria-label")} data-astro-cid-tvtxql23> ${svc.marks.map((mark) => renderTemplate`<i${addAttribute(`b ${barClass(mark.s)}${mark.s === "pre" ? " pre" : ""}`, "class")}${addAttribute(mark.d, "data-d")}${addAttribute(barTip(mark), "data-tip")} data-astro-cid-tvtxql23></i>`)} </div> <div class="bars-axis" data-astro-cid-tvtxql23><span data-axis-start data-astro-cid-tvtxql23>${fill(s.daysAgo, { n: 90 })}</span><span data-astro-cid-tvtxql23>${s.today}</span></div> </article>`)} </div> </details> </div> <div class="hist-tip" id="histTip" role="tooltip" hidden data-astro-cid-tvtxql23></div> <div class="st-hist-foot" data-astro-cid-tvtxql23> <ul class="hist-legend" data-astro-cid-tvtxql23> <li data-astro-cid-tvtxql23><i class="b up" data-astro-cid-tvtxql23></i>${s.legendUp}</li> <li data-astro-cid-tvtxql23><i class="b warn" data-astro-cid-tvtxql23></i>${s.legendWarn}</li> <li data-astro-cid-tvtxql23><i class="b down" data-astro-cid-tvtxql23></i>${s.legendDown}</li> <li data-astro-cid-tvtxql23><i class="b none" data-astro-cid-tvtxql23></i>${s.legendNone}</li> </ul> <p class="hist-meta" data-astro-cid-tvtxql23><span data-astro-cid-tvtxql23>${s.everyTwo}</span>${history.available && renderTemplate`<span id="histStarted" data-astro-cid-tvtxql23> · ${started ? fill(s.startedNote, { date: dayLabel(started) }) : s.startingNote}</span>`}</p> </div> </div> </section> <!-- 3. Two-Column Shard Checker (1:1 Vetox split with center 1px vertical rail) --> <section class="st-check-sec" data-astro-cid-tvtxql23> <div class="wrap st-check-wrap" data-astro-cid-tvtxql23> <form class="st-check-grid" id="statusSearch" role="search"${addAttribute(searchEndpoint, "data-endpoint")}${addAttribute(s.searchShort, "data-short")}${addAttribute(s.searchEmpty, "data-empty")}${addAttribute(s.searchError, "data-error")}${addAttribute(s.searchLimited, "data-limited")}${addAttribute(s.shardOffline, "data-offline")}${addAttribute(s.shardOperational, "data-operational")}${addAttribute(s.shardReconnecting, "data-reconnecting")}${addAttribute(s.shardName, "data-shard")} data-astro-cid-tvtxql23> <div class="st-check-left" data-astro-cid-tvtxql23> <div class="st-sec-head st-two-tone" data-astro-cid-tvtxql23> <label for="statusSearchInput" class="st-two-h2" data-astro-cid-tvtxql23><b data-astro-cid-tvtxql23>${uiCopy.checkLead}</b> <span data-astro-cid-tvtxql23>${uiCopy.checkSub}</span></label> </div> <p class="status-search-hint" id="statusSearchHint" data-astro-cid-tvtxql23>${s.searchHint}</p> </div> <div class="st-check-right" data-astro-cid-tvtxql23> <div class="st-pill-bar" data-astro-cid-tvtxql23> <span class="st-pill-badge" aria-hidden="true" data-astro-cid-tvtxql23>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:squares-four-fill", "width": "16", "height": "16", "data-astro-cid-tvtxql23": true })}</span> <input id="statusSearchInput" type="search" name="q" autocomplete="off" maxlength="100"${addAttribute(s.searchPlaceholder, "placeholder")} data-astro-cid-tvtxql23> <button type="submit" class="st-pill-submit" data-astro-cid-tvtxql23>${uiCopy.checkBtn}</button> </div> <ul class="status-search-results" id="statusSearchResults" aria-live="polite" data-astro-cid-tvtxql23></ul> </div> </form> </div> </section> <!-- 4. Event Calendar + Incident Feed --> <section class="st-cal-sec" id="calendar" data-astro-cid-tvtxql23> <div class="wrap st-cal-wrap" data-astro-cid-tvtxql23> <div class="st-cal-top" data-astro-cid-tvtxql23> <div class="st-sec-head st-two-tone" data-astro-cid-tvtxql23> <h2 class="st-two-h2" data-astro-cid-tvtxql23><b data-astro-cid-tvtxql23>${uiCopy.calLead}</b> <span data-astro-cid-tvtxql23>${uiCopy.calSub}</span></h2> </div> <a class="btn btn-ghost btn-sm st-inc-jump" href="#incidents" data-astro-cid-tvtxql23>${s.incidentsTitle} ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right", "width": "12", "height": "12", "data-astro-cid-tvtxql23": true })}</a> </div> <div class="st-cal-split" id="incidents" data-astro-cid-tvtxql23> <div class="st-cal-card" id="stCalendar"${addAttribute(JSON.stringify(uiCopy.weekdays), "data-weekdays")}${addAttribute(dateLocale, "data-locale")} data-astro-cid-tvtxql23> <div class="st-cal-nav" data-astro-cid-tvtxql23> <button type="button" class="st-cal-btn" id="stCalPrev" aria-label="Previous month" data-astro-cid-tvtxql23>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-left-bold", "width": "13", "height": "13", "data-astro-cid-tvtxql23": true })}</button> <strong id="stCalTitle" data-astro-cid-tvtxql23></strong> <button type="button" class="st-cal-btn" id="stCalNext" aria-label="Next month" data-astro-cid-tvtxql23>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-right-bold", "width": "13", "height": "13", "data-astro-cid-tvtxql23": true })}</button> </div> <div class="st-cal-weekdays" data-astro-cid-tvtxql23> ${uiCopy.weekdays.map((wd) => renderTemplate`<span data-astro-cid-tvtxql23>${wd}</span>`)} </div> <div class="st-cal-days" id="stCalDays" data-astro-cid-tvtxql23></div> <ul class="st-cal-legend" data-astro-cid-tvtxql23> <li data-astro-cid-tvtxql23><i class="ring down" data-astro-cid-tvtxql23></i>${uiCopy.ringCrit}</li> <li data-astro-cid-tvtxql23><i class="ring warn" data-astro-cid-tvtxql23></i>${uiCopy.ringWarn}</li> <li data-astro-cid-tvtxql23><i class="ring none" data-astro-cid-tvtxql23></i>${uiCopy.ringNone}</li> <li data-astro-cid-tvtxql23><i class="ring up" data-astro-cid-tvtxql23></i>${uiCopy.ringOk}</li> </ul> </div> <div class="st-inc-card" data-astro-cid-tvtxql23> <div class="st-inc-head" data-astro-cid-tvtxql23> <h3 data-astro-cid-tvtxql23>${s.incidentsTitle}</h3> <span class="st-inc-sub" data-astro-cid-tvtxql23>14d</span> </div> <div class="hist-incidents" id="histIncidents" data-astro-cid-tvtxql23> ${history.available ? incidentList.map((entry) => renderTemplate`<div class="inc-day" data-astro-cid-tvtxql23> <h3 data-astro-cid-tvtxql23>${dayLabel(entry.day)}</h3> ${entry.incidents.length === 0 ? renderTemplate`<p class="inc-none" data-astro-cid-tvtxql23>${entry.today ? s.incidentNoneToday : s.incidentNoneDay}</p>` : renderTemplate`<ul data-astro-cid-tvtxql23>${entry.incidents.map((inc) => renderTemplate`<li${addAttribute(inc.kind, "class")} data-astro-cid-tvtxql23><i${addAttribute(`b ${barClass(inc.kind)}`, "class")} data-astro-cid-tvtxql23></i><div data-astro-cid-tvtxql23><b data-astro-cid-tvtxql23>${serviceNames[inc.service]}</b><em data-astro-cid-tvtxql23>${incidentText(inc)}</em>${noteOf(inc) && renderTemplate`<p data-astro-cid-tvtxql23>${noteOf(inc)}</p>`}</div></li>`)}</ul>`} </div>`) : renderTemplate`<p class="inc-none" data-astro-cid-tvtxql23>${s.histUnavailable}</p>`} </div> </div> </div> </div> </section> </main> ` })}    `;
}, "/home/runner/work/petto-web/petto-web/src/components/Status.astro", void 0);

export { $$Status as $ };
