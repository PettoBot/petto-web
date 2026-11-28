import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Base } from './Base_Di2YHjFe.mjs';
import { $ as $$DashChartTip } from './DashChartTip_Ddh1J1_O.mjs';
import { a as $$StatsChartStyle, $ as $$DashChartRange } from './DashChartRange_BG3UPTdS.mjs';
import { l as localePath } from './ui_C1MR3LHJ.mjs';
import { g as getEnv } from './env_WnBvzCjc.mjs';
import { l as loadGlobalHistory } from './globalStatsHistory_B1qMHU20.mjs';
import { C as COPY } from './globalStatsCopy_C2_wqZbv.mjs';
/* empty css                         */

const $$Astro = createAstro("https://petto.sbs");
const $$GlobalStats = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$GlobalStats;
  const { lang } = Astro2.props;
  const localeBase = localePath[lang] ?? "";
  const c = COPY[lang] ?? COPY.en;
  const statsEndpoint = new URL("/api/stats", Astro2.url).pathname;
  const historyEndpoint = new URL("/api/stats-history", Astro2.url).pathname;
  async function firstSnapshot() {
    const url = getEnv(Astro2, "PETTO_BOT_API_URL");
    const key = getEnv(Astro2, "PETTO_BOT_API_SECRET");
    if (!url || !key) return null;
    try {
      const res = await fetch(`${url}/rest/v1/global_stats?id=eq.main&select=data,updated_at`, {
        headers: { apikey: key, Authorization: `Bearer ${key}`, "X-Petto-Dashboard-Key": key },
        signal: AbortSignal.timeout(6e3)
      });
      if (!res.ok) return null;
      const rows = await res.json();
      const row = Array.isArray(rows) ? rows[0] : null;
      return row?.data?.totals ? { data: row.data, updatedAt: row.updated_at } : null;
    } catch {
      return null;
    }
  }
  const [initial, history] = await Promise.all([firstSnapshot(), loadGlobalHistory(Astro2).catch(() => ({ days: [], source: "none" }))]);
  const CARDS = [
    { key: "servers", label: c.servers, level: true },
    { key: "members", label: c.members, level: true },
    { key: "messages", label: c.messages, level: false },
    { key: "voiceSeconds", label: c.voice, level: false },
    { key: "reactions", label: c.reactions, level: false }
  ];
  const CARD_SUBS = {
    en: { servers: "Servers that have Petto", members: "People in those servers", messages: "Sent in all of them", voiceSeconds: "Spent in voice channels", reactions: "Added to messages" },
    es: { servers: "Servidores que tienen a Petto", members: "Personas en esos servidores", messages: "Enviados en todos ellos", voiceSeconds: "Pasado en canales de voz", reactions: "A\xF1adidas a mensajes" },
    "pt-BR": { servers: "Servidores que t\xEAm o Petto", members: "Pessoas nesses servidores", messages: "Enviadas em todos eles", voiceSeconds: "Passado em canais de voz", reactions: "Adicionadas \xE0s mensagens" }
  };
  const cardSub = (key) => (CARD_SUBS[lang] ?? CARD_SUBS.en)[key] ?? "";
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${c.title} \xB7 Petto`, "lang": lang, "data-astro-cid-rxy23ikl": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-rxy23ikl> <section class="gs-sec" data-astro-cid-rxy23ikl> <div class="wrap gs-wrap" data-astro-cid-rxy23ikl> <div class="gs-top" data-astro-cid-rxy23ikl> <div class="eyebrow" data-astro-cid-rxy23ikl>${c.pill}</div> <span class="gs-live" id="gsLive" data-astro-cid-rxy23ikl><span class="gs-live-dot" data-astro-cid-rxy23ikl></span><span id="gsUpdated" data-astro-cid-rxy23ikl>${c.never}</span></span> </div> <h1 data-astro-cid-rxy23ikl>${c.heading}</h1> <p class="gs-desc" data-astro-cid-rxy23ikl>${c.desc}</p> <div id="gs"${addAttribute(statsEndpoint, "data-endpoint")}${addAttribute(historyEndpoint, "data-history-endpoint")}${addAttribute(lang, "data-locale")}${addAttribute(initial ? JSON.stringify(initial) : "", "data-initial")}${addAttribute(JSON.stringify(history), "data-history")}${addAttribute(JSON.stringify(c), "data-copy")}${addAttribute(`${localeBase}/dash`, "data-guild-link")} data-astro-cid-rxy23ikl> <div class="gs-cards" data-astro-cid-rxy23ikl> ${CARDS.map((card) => renderTemplate`<button type="button"${addAttribute(`gs-card gs-card-${card.key}`, "class")}${addAttribute(card.key, "data-metric")}${addAttribute(c.refresh, "title")}${addAttribute(card.level, "hidden")} data-astro-cid-rxy23ikl> <span class="gs-card-label" data-astro-cid-rxy23ikl><i class="gs-swatch" data-astro-cid-rxy23ikl></i>${card.label}</span> <span class="gs-odo" data-odo aria-live="off" data-astro-cid-rxy23ikl>&ndash;</span> <small class="gs-card-sub" data-astro-cid-rxy23ikl>${cardSub(card.key)}</small> ${card.key === "voiceSeconds" && renderTemplate`<small class="gs-equiv" data-equiv hidden data-astro-cid-rxy23ikl></small>`} <span class="gs-chips" data-chips data-astro-cid-rxy23ikl></span> </button>`)} </div> <p class="gs-unavailable" id="gsUnavailable" hidden data-astro-cid-rxy23ikl>${c.unavailable}</p> <section class="gs-panel" aria-labelledby="gsHistTitle" data-astro-cid-rxy23ikl> <div class="gs-panel-head" data-astro-cid-rxy23ikl> <div data-astro-cid-rxy23ikl> <h2 id="gsHistTitle" data-astro-cid-rxy23ikl>${c.histTitle}</h2> <p class="gs-panel-desc" data-astro-cid-rxy23ikl>${c.histDesc}</p> </div> <div class="gs-seg" role="group"${addAttribute(c.rangeLabel, "aria-label")} id="gsRanges" data-astro-cid-rxy23ikl> <button type="button" data-range="7" aria-pressed="false" data-astro-cid-rxy23ikl>${c.range7}</button> <button type="button" data-range="30" aria-pressed="true" data-astro-cid-rxy23ikl>${c.range30}</button> <button type="button" data-range="90" aria-pressed="false" data-astro-cid-rxy23ikl>${c.range90}</button> <button type="button" data-range="365" aria-pressed="false" data-astro-cid-rxy23ikl>${c.range365}</button> </div> </div> <div class="gs-metrics" role="group"${addAttribute(c.metricLabel, "aria-label")} id="gsMetrics" data-astro-cid-rxy23ikl></div> <dl class="gs-summary" id="gsSummary" data-astro-cid-rxy23ikl></dl> <div class="gs-plot-host" id="gsPlotHost" data-astro-cid-rxy23ikl></div> <p class="gs-panel-note" id="gsChartNote" data-astro-cid-rxy23ikl></p> </section> <section class="gs-panel" aria-labelledby="gsTableTitle" id="gsTablePanel" data-astro-cid-rxy23ikl> <div class="gs-panel-head" data-astro-cid-rxy23ikl> <div data-astro-cid-rxy23ikl> <h2 id="gsTableTitle" data-astro-cid-rxy23ikl>${c.tableTitle}</h2> <p class="gs-panel-desc" data-astro-cid-rxy23ikl>${c.tableDesc}</p> </div> </div> <div class="gs-table-scroll" id="gsTable" tabindex="0" role="region" aria-labelledby="gsTableTitle" data-astro-cid-rxy23ikl></div> <p class="gs-panel-note" id="gsTableNote" data-astro-cid-rxy23ikl></p> <button type="button" class="gs-more" id="gsMore" hidden data-astro-cid-rxy23ikl></button> </section> <section class="gs-panel" aria-labelledby="gsRankTitle" data-astro-cid-rxy23ikl> <div class="gs-panel-head gs-rank-head" data-astro-cid-rxy23ikl> <div data-astro-cid-rxy23ikl> <h2 id="gsRankTitle" data-astro-cid-rxy23ikl>${c.rankTitle}</h2> <p class="gs-panel-desc" data-astro-cid-rxy23ikl>${c.rankDesc}</p> </div> <div class="gs-rank-tabs" data-astro-cid-rxy23ikl> <div class="gs-seg" role="group"${addAttribute(c.rankFor, "aria-label")} id="gsRankMetric" data-astro-cid-rxy23ikl> <button type="button" data-metric-tab="messages" aria-pressed="true" data-astro-cid-rxy23ikl>${c.messages}</button> <button type="button" data-metric-tab="voiceSeconds" aria-pressed="false" data-astro-cid-rxy23ikl>${c.voice}</button> <button type="button" data-metric-tab="reactions" aria-pressed="false" data-astro-cid-rxy23ikl>${c.reactions}</button> </div> <div class="gs-seg" role="group"${addAttribute(c.rankFor, "aria-label")} id="gsRankPeriod" data-astro-cid-rxy23ikl> <button type="button" data-rank-period="all" aria-pressed="true" data-astro-cid-rxy23ikl>${c.all}</button> <button type="button" data-rank-period="week" aria-pressed="false" data-astro-cid-rxy23ikl>${c.week}</button> </div> </div> </div> <div class="gs-podium" id="gsPodium" hidden data-astro-cid-rxy23ikl></div> <ol class="gs-rank" id="gsRank" data-astro-cid-rxy23ikl></ol> </section> <p class="gs-note" data-astro-cid-rxy23ikl>${c.note}</p> </div> </div> </section> </main> ${renderComponent($$result2, "DashChartTip", $$DashChartTip, { "data-astro-cid-rxy23ikl": true })} ${renderComponent($$result2, "StatsChartStyle", $$StatsChartStyle, { "data-astro-cid-rxy23ikl": true })} ${renderComponent($$result2, "DashChartRange", $$DashChartRange, { "data-astro-cid-rxy23ikl": true })} ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/GlobalStats.astro", void 0);

export { $$GlobalStats as $ };
