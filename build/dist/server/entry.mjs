import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_0EQpSEEY.mjs';
import { manifest } from './manifest_BMI87l_x.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/am.astro.mjs');
const _page3 = () => import('./pages/api/apply.astro.mjs');
const _page4 = () => import('./pages/api/billing/polar/webhook.astro.mjs');
const _page5 = () => import('./pages/api/currently-log.astro.mjs');
const _page6 = () => import('./pages/api/feedback/_id_/comment.astro.mjs');
const _page7 = () => import('./pages/api/feedback/_id_/comment-delete.astro.mjs');
const _page8 = () => import('./pages/api/feedback/_id_/status.astro.mjs');
const _page9 = () => import('./pages/api/feedback/_id_/vote.astro.mjs');
const _page10 = () => import('./pages/api/feedback.astro.mjs');
const _page11 = () => import('./pages/api/form/_id_.astro.mjs');
const _page12 = () => import('./pages/api/health.astro.mjs');
const _page13 = () => import('./pages/api/og/lb/_slug_.astro.mjs');
const _page14 = () => import('./pages/api/og/partner.astro.mjs');
const _page15 = () => import('./pages/api/session.astro.mjs');
const _page16 = () => import('./pages/api/showcase.astro.mjs');
const _page17 = () => import('./pages/api/stats.astro.mjs');
const _page18 = () => import('./pages/api/stats-history.astro.mjs');
const _page19 = () => import('./pages/api/status.astro.mjs');
const _page20 = () => import('./pages/api/status-check.astro.mjs');
const _page21 = () => import('./pages/api/status-history.astro.mjs');
const _page22 = () => import('./pages/api/status-search.astro.mjs');
const _page23 = () => import('./pages/api/status-services.astro.mjs');
const _page24 = () => import('./pages/api/v1/me.astro.mjs');
const _page25 = () => import('./pages/api/v1/movements.astro.mjs');
const _page26 = () => import('./pages/api/v1/packs.astro.mjs');
const _page27 = () => import('./pages/api/warm.astro.mjs');
const _page28 = () => import('./pages/appeal/_id_/file/_fileid_.astro.mjs');
const _page29 = () => import('./pages/appeal/_id_/form/_fid_/upload.astro.mjs');
const _page30 = () => import('./pages/appeal/_id_/form/_fid_.astro.mjs');
const _page31 = () => import('./pages/appeal/_id_/img/_kind_.astro.mjs');
const _page32 = () => import('./pages/appeal/_id_/login.astro.mjs');
const _page33 = () => import('./pages/appeal/_id_/logout.astro.mjs');
const _page34 = () => import('./pages/appeal/_id_/status/_sid_/live.astro.mjs');
const _page35 = () => import('./pages/appeal/_id_/status/_sid_.astro.mjs');
const _page36 = () => import('./pages/appeal/_id_.astro.mjs');
const _page37 = () => import('./pages/apply.astro.mjs');
const _page38 = () => import('./pages/blog/blibot-to-petto.astro.mjs');
const _page39 = () => import('./pages/blog/currently-log.astro.mjs');
const _page40 = () => import('./pages/blog/embed-builder-joins-petto.astro.mjs');
const _page41 = () => import('./pages/blog/kobot-moves-to-petto.astro.mjs');
const _page42 = () => import('./pages/blog/online-without-the-dot.astro.mjs');
const _page43 = () => import('./pages/blog/petto-vs-other-bots.astro.mjs');
const _page44 = () => import('./pages/blog/switch-from-carl-bot.astro.mjs');
const _page45 = () => import('./pages/blog/switch-from-dyno.astro.mjs');
const _page46 = () => import('./pages/blog/switch-from-mee6.astro.mjs');
const _page47 = () => import('./pages/blog/vanity-moves-to-petto.astro.mjs');
const _page48 = () => import('./pages/blog.astro.mjs');
const _page49 = () => import('./pages/brand.astro.mjs');
const _page50 = () => import('./pages/ceramos/checkout.astro.mjs');
const _page51 = () => import('./pages/changelog/rss.xml.astro.mjs');
const _page52 = () => import('./pages/changelog/_version_.astro.mjs');
const _page53 = () => import('./pages/changelog.astro.mjs');
const _page54 = () => import('./pages/code.astro.mjs');
const _page55 = () => import('./pages/codegen.astro.mjs');
const _page56 = () => import('./pages/commands.astro.mjs');
const _page57 = () => import('./pages/cookies.astro.mjs');
const _page58 = () => import('./pages/credits.astro.mjs');
const _page59 = () => import('./pages/dash/admin/servers.astro.mjs');
const _page60 = () => import('./pages/dash/admin.astro.mjs');
const _page61 = () => import('./pages/dash/api.astro.mjs');
const _page62 = () => import('./pages/dash/api-act.astro.mjs');
const _page63 = () => import('./pages/dash/appeal-names.astro.mjs');
const _page64 = () => import('./pages/dash/badge-art/_id_.astro.mjs');
const _page65 = () => import('./pages/dash/badges.astro.mjs');
const _page66 = () => import('./pages/dash/badges-act.astro.mjs');
const _page67 = () => import('./pages/dash/badges-admin.astro.mjs');
const _page68 = () => import('./pages/dash/badges-admin-act.astro.mjs');
const _page69 = () => import('./pages/dash/banners.astro.mjs');
const _page70 = () => import('./pages/dash/buy-ceramos.astro.mjs');
const _page71 = () => import('./pages/dash/callback.astro.mjs');
const _page72 = () => import('./pages/dash/ceramos.astro.mjs');
const _page73 = () => import('./pages/dash/ceramos-admin.astro.mjs');
const _page74 = () => import('./pages/dash/ceramos-admin-act.astro.mjs');
const _page75 = () => import('./pages/dash/changelog-admin.astro.mjs');
const _page76 = () => import('./pages/dash/credits-admin.astro.mjs');
const _page77 = () => import('./pages/dash/daily.astro.mjs');
const _page78 = () => import('./pages/dash/guild/_id_/ac-data.astro.mjs');
const _page79 = () => import('./pages/dash/guild/_id_/access.astro.mjs');
const _page80 = () => import('./pages/dash/guild/_id_/activity-boards.astro.mjs');
const _page81 = () => import('./pages/dash/guild/_id_/aged-roles.astro.mjs');
const _page82 = () => import('./pages/dash/guild/_id_/antinuke.astro.mjs');
const _page83 = () => import('./pages/dash/guild/_id_/antinuke-api.astro.mjs');
const _page84 = () => import('./pages/dash/guild/_id_/antiscam.astro.mjs');
const _page85 = () => import('./pages/dash/guild/_id_/appeals.astro.mjs');
const _page86 = () => import('./pages/dash/guild/_id_/appeals-file.astro.mjs');
const _page87 = () => import('./pages/dash/guild/_id_/appeals-image.astro.mjs');
const _page88 = () => import('./pages/dash/guild/_id_/appeals-live.astro.mjs');
const _page89 = () => import('./pages/dash/guild/_id_/audit.astro.mjs');
const _page90 = () => import('./pages/dash/guild/_id_/automation.astro.mjs');
const _page91 = () => import('./pages/dash/guild/_id_/automod.astro.mjs');
const _page92 = () => import('./pages/dash/guild/_id_/automod-api.astro.mjs');
const _page93 = () => import('./pages/dash/guild/_id_/backups.astro.mjs');
const _page94 = () => import('./pages/dash/guild/_id_/backups-export.astro.mjs');
const _page95 = () => import('./pages/dash/guild/_id_/backups-restore.astro.mjs');
const _page96 = () => import('./pages/dash/guild/_id_/birthdays.astro.mjs');
const _page97 = () => import('./pages/dash/guild/_id_/boards.astro.mjs');
const _page98 = () => import('./pages/dash/guild/_id_/bot-ping.astro.mjs');
const _page99 = () => import('./pages/dash/guild/_id_/bulk-role.astro.mjs');
const _page100 = () => import('./pages/dash/guild/_id_/bulk-role-status.astro.mjs');
const _page101 = () => import('./pages/dash/guild/_id_/bump.astro.mjs');
const _page102 = () => import('./pages/dash/guild/_id_/cards.astro.mjs');
const _page103 = () => import('./pages/dash/guild/_id_/cards-api.astro.mjs');
const _page104 = () => import('./pages/dash/guild/_id_/code.astro.mjs');
const _page105 = () => import('./pages/dash/guild/_id_/code-api.astro.mjs');
const _page106 = () => import('./pages/dash/guild/_id_/community.astro.mjs');
const _page107 = () => import('./pages/dash/guild/_id_/confessions.astro.mjs');
const _page108 = () => import('./pages/dash/guild/_id_/confessions-api.astro.mjs');
const _page109 = () => import('./pages/dash/guild/_id_/counters.astro.mjs');
const _page110 = () => import('./pages/dash/guild/_id_/counting.astro.mjs');
const _page111 = () => import('./pages/dash/guild/_id_/customize.astro.mjs');
const _page112 = () => import('./pages/dash/guild/_id_/economy.astro.mjs');
const _page113 = () => import('./pages/dash/guild/_id_/embeds.astro.mjs');
const _page114 = () => import('./pages/dash/guild/_id_/embeds-api.astro.mjs');
const _page115 = () => import('./pages/dash/guild/_id_/events.astro.mjs');
const _page116 = () => import('./pages/dash/guild/_id_/feeds.astro.mjs');
const _page117 = () => import('./pages/dash/guild/_id_/feeds-api.astro.mjs');
const _page118 = () => import('./pages/dash/guild/_id_/forms.astro.mjs');
const _page119 = () => import('./pages/dash/guild/_id_/forums.astro.mjs');
const _page120 = () => import('./pages/dash/guild/_id_/general.astro.mjs');
const _page121 = () => import('./pages/dash/guild/_id_/general-config-import.astro.mjs');
const _page122 = () => import('./pages/dash/guild/_id_/general-config-preview.astro.mjs');
const _page123 = () => import('./pages/dash/guild/_id_/general-export.astro.mjs');
const _page124 = () => import('./pages/dash/guild/_id_/giveaways.astro.mjs');
const _page125 = () => import('./pages/dash/guild/_id_/honeypot.astro.mjs');
const _page126 = () => import('./pages/dash/guild/_id_/join-roles.astro.mjs');
const _page127 = () => import('./pages/dash/guild/_id_/leveling.astro.mjs');
const _page128 = () => import('./pages/dash/guild/_id_/link-preview-api.astro.mjs');
const _page129 = () => import('./pages/dash/guild/_id_/live.astro.mjs');
const _page130 = () => import('./pages/dash/guild/_id_/lockdown-api.astro.mjs');
const _page131 = () => import('./pages/dash/guild/_id_/logging.astro.mjs');
const _page132 = () => import('./pages/dash/guild/_id_/media.astro.mjs');
const _page133 = () => import('./pages/dash/guild/_id_/members-search.astro.mjs');
const _page134 = () => import('./pages/dash/guild/_id_/message-roles.astro.mjs');
const _page135 = () => import('./pages/dash/guild/_id_/migrate.astro.mjs');
const _page136 = () => import('./pages/dash/guild/_id_/migrate-ai.astro.mjs');
const _page137 = () => import('./pages/dash/guild/_id_/moderation.astro.mjs');
const _page138 = () => import('./pages/dash/guild/_id_/moderation-api.astro.mjs');
const _page139 = () => import('./pages/dash/guild/_id_/module-states.astro.mjs');
const _page140 = () => import('./pages/dash/guild/_id_/modules.astro.mjs');
const _page141 = () => import('./pages/dash/guild/_id_/onboarding.astro.mjs');
const _page142 = () => import('./pages/dash/guild/_id_/overview.astro.mjs');
const _page143 = () => import('./pages/dash/guild/_id_/partners.astro.mjs');
const _page144 = () => import('./pages/dash/guild/_id_/permission-alerts.astro.mjs');
const _page145 = () => import('./pages/dash/guild/_id_/permissions.astro.mjs');
const _page146 = () => import('./pages/dash/guild/_id_/permissions-api.astro.mjs');
const _page147 = () => import('./pages/dash/guild/_id_/quests.astro.mjs');
const _page148 = () => import('./pages/dash/guild/_id_/quick-setup.astro.mjs');
const _page149 = () => import('./pages/dash/guild/_id_/quick-setup-api.astro.mjs');
const _page150 = () => import('./pages/dash/guild/_id_/reaction-role.astro.mjs');
const _page151 = () => import('./pages/dash/guild/_id_/responders.astro.mjs');
const _page152 = () => import('./pages/dash/guild/_id_/resync-api.astro.mjs');
const _page153 = () => import('./pages/dash/guild/_id_/role-blocks.astro.mjs');
const _page154 = () => import('./pages/dash/guild/_id_/role-quotas.astro.mjs');
const _page155 = () => import('./pages/dash/guild/_id_/role-triggers.astro.mjs');
const _page156 = () => import('./pages/dash/guild/_id_/rollouts.astro.mjs');
const _page157 = () => import('./pages/dash/guild/_id_/rules.astro.mjs');
const _page158 = () => import('./pages/dash/guild/_id_/rules-api.astro.mjs');
const _page159 = () => import('./pages/dash/guild/_id_/security.astro.mjs');
const _page160 = () => import('./pages/dash/guild/_id_/senders.astro.mjs');
const _page161 = () => import('./pages/dash/guild/_id_/staff-roles.astro.mjs');
const _page162 = () => import('./pages/dash/guild/_id_/stats.astro.mjs');
const _page163 = () => import('./pages/dash/guild/_id_/streaks.astro.mjs');
const _page164 = () => import('./pages/dash/guild/_id_/suggestions.astro.mjs');
const _page165 = () => import('./pages/dash/guild/_id_/suggestions-api.astro.mjs');
const _page166 = () => import('./pages/dash/guild/_id_/tickets.astro.mjs');
const _page167 = () => import('./pages/dash/guild/_id_/tickets-api.astro.mjs');
const _page168 = () => import('./pages/dash/guild/_id_/tickets-live.astro.mjs');
const _page169 = () => import('./pages/dash/guild/_id_/tools.astro.mjs');
const _page170 = () => import('./pages/dash/guild/_id_/vanity.astro.mjs');
const _page171 = () => import('./pages/dash/guild/_id_/verification-api.astro.mjs');
const _page172 = () => import('./pages/dash/guild/_id_/verification-status.astro.mjs');
const _page173 = () => import('./pages/dash/guild/_id_/version.astro.mjs');
const _page174 = () => import('./pages/dash/guild/_id_/voice-247.astro.mjs');
const _page175 = () => import('./pages/dash/guild/_id_/welcome.astro.mjs');
const _page176 = () => import('./pages/dash/health.astro.mjs');
const _page177 = () => import('./pages/dash/history.astro.mjs');
const _page178 = () => import('./pages/dash/import.astro.mjs');
const _page179 = () => import('./pages/dash/import-code.astro.mjs');
const _page180 = () => import('./pages/dash/item-file/_kind_/_id_.astro.mjs');
const _page181 = () => import('./pages/dash/lang.astro.mjs');
const _page182 = () => import('./pages/dash/login.astro.mjs');
const _page183 = () => import('./pages/dash/logout.astro.mjs');
const _page184 = () => import('./pages/dash/manage/bot-status.astro.mjs');
const _page185 = () => import('./pages/dash/manage.astro.mjs');
const _page186 = () => import('./pages/dash/me.astro.mjs');
const _page187 = () => import('./pages/dash/missions.astro.mjs');
const _page188 = () => import('./pages/dash/missions-act.astro.mjs');
const _page189 = () => import('./pages/dash/name.astro.mjs');
const _page190 = () => import('./pages/dash/own-badges.astro.mjs');
const _page191 = () => import('./pages/dash/own-badges-act.astro.mjs');
const _page192 = () => import('./pages/dash/own-picture.astro.mjs');
const _page193 = () => import('./pages/dash/own-picture-act.astro.mjs');
const _page194 = () => import('./pages/dash/owner-servers.astro.mjs');
const _page195 = () => import('./pages/dash/partners-admin.astro.mjs');
const _page196 = () => import('./pages/dash/plan.astro.mjs');
const _page197 = () => import('./pages/dash/plans.astro.mjs');
const _page198 = () => import('./pages/dash/plans-admin.astro.mjs');
const _page199 = () => import('./pages/dash/plans-admin-act.astro.mjs');
const _page200 = () => import('./pages/dash/preferences.astro.mjs');
const _page201 = () => import('./pages/dash/premium.astro.mjs');
const _page202 = () => import('./pages/dash/privacy.astro.mjs');
const _page203 = () => import('./pages/dash/rank.astro.mjs');
const _page204 = () => import('./pages/dash/rank-act.astro.mjs');
const _page205 = () => import('./pages/dash/rank-design/_id_/_size_.astro.mjs');
const _page206 = () => import('./pages/dash/search-index.json.astro.mjs');
const _page207 = () => import('./pages/dash/shop-act.astro.mjs');
const _page208 = () => import('./pages/dash/shop-admin.astro.mjs');
const _page209 = () => import('./pages/dash/shop-admin-act.astro.mjs');
const _page210 = () => import('./pages/dash/summary.astro.mjs');
const _page211 = () => import('./pages/dash/team.astro.mjs');
const _page212 = () => import('./pages/dash/uploads-admin.astro.mjs');
const _page213 = () => import('./pages/dash/uploads-admin-act.astro.mjs');
const _page214 = () => import('./pages/dash.astro.mjs');
const _page215 = () => import('./pages/discord-age-verification.astro.mjs');
const _page216 = () => import('./pages/discord-api-2026.astro.mjs');
const _page217 = () => import('./pages/discord-encryption.astro.mjs');
const _page218 = () => import('./pages/embed-builder.astro.mjs');
const _page219 = () => import('./pages/embed-code.astro.mjs');
const _page220 = () => import('./pages/es/am.astro.mjs');
const _page221 = () => import('./pages/es/apply.astro.mjs');
const _page222 = () => import('./pages/es/blog/blibot-to-petto.astro.mjs');
const _page223 = () => import('./pages/es/blog/currently-log.astro.mjs');
const _page224 = () => import('./pages/es/blog/embed-builder-joins-petto.astro.mjs');
const _page225 = () => import('./pages/es/blog/kobot-moves-to-petto.astro.mjs');
const _page226 = () => import('./pages/es/blog/online-without-the-dot.astro.mjs');
const _page227 = () => import('./pages/es/blog/petto-vs-other-bots.astro.mjs');
const _page228 = () => import('./pages/es/blog/switch-from-carl-bot.astro.mjs');
const _page229 = () => import('./pages/es/blog/switch-from-dyno.astro.mjs');
const _page230 = () => import('./pages/es/blog/switch-from-mee6.astro.mjs');
const _page231 = () => import('./pages/es/blog/vanity-moves-to-petto.astro.mjs');
const _page232 = () => import('./pages/es/blog.astro.mjs');
const _page233 = () => import('./pages/es/brand.astro.mjs');
const _page234 = () => import('./pages/es/changelog/rss.xml.astro.mjs');
const _page235 = () => import('./pages/es/changelog/_version_.astro.mjs');
const _page236 = () => import('./pages/es/changelog.astro.mjs');
const _page237 = () => import('./pages/es/code.astro.mjs');
const _page238 = () => import('./pages/es/codegen.astro.mjs');
const _page239 = () => import('./pages/es/commands.astro.mjs');
const _page240 = () => import('./pages/es/cookies.astro.mjs');
const _page241 = () => import('./pages/es/credits.astro.mjs');
const _page242 = () => import('./pages/es/discord-age-verification.astro.mjs');
const _page243 = () => import('./pages/es/discord-api-2026.astro.mjs');
const _page244 = () => import('./pages/es/discord-encryption.astro.mjs');
const _page245 = () => import('./pages/es/embed-builder.astro.mjs');
const _page246 = () => import('./pages/es/embed-code.astro.mjs');
const _page247 = () => import('./pages/es/f/_id_.astro.mjs');
const _page248 = () => import('./pages/es/faq.astro.mjs');
const _page249 = () => import('./pages/es/features/_id_.astro.mjs');
const _page250 = () => import('./pages/es/features.astro.mjs');
const _page251 = () => import('./pages/es/feedback/new.astro.mjs');
const _page252 = () => import('./pages/es/feedback.astro.mjs');
const _page253 = () => import('./pages/es/form/_id_.astro.mjs');
const _page254 = () => import('./pages/es/form.astro.mjs');
const _page255 = () => import('./pages/es/history.astro.mjs');
const _page256 = () => import('./pages/es/lb/_slug_.astro.mjs');
const _page257 = () => import('./pages/es/linked-roles.astro.mjs');
const _page258 = () => import('./pages/es/nelu.astro.mjs');
const _page259 = () => import('./pages/es/news.astro.mjs');
const _page260 = () => import('./pages/es/partners.astro.mjs');
const _page261 = () => import('./pages/es/premium.astro.mjs');
const _page262 = () => import('./pages/es/privacy.astro.mjs');
const _page263 = () => import('./pages/es/refunds.astro.mjs');
const _page264 = () => import('./pages/es/roadmap.astro.mjs');
const _page265 = () => import('./pages/es/snowflake.astro.mjs');
const _page266 = () => import('./pages/es/stats.astro.mjs');
const _page267 = () => import('./pages/es/status/vanity.astro.mjs');
const _page268 = () => import('./pages/es/status.astro.mjs');
const _page269 = () => import('./pages/es/team.astro.mjs');
const _page270 = () => import('./pages/es/terms.astro.mjs');
const _page271 = () => import('./pages/es/timestamp.astro.mjs');
const _page272 = () => import('./pages/es/tools.astro.mjs');
const _page273 = () => import('./pages/es.astro.mjs');
const _page274 = () => import('./pages/f/login.astro.mjs');
const _page275 = () => import('./pages/f/_id_.astro.mjs');
const _page276 = () => import('./pages/faq.astro.mjs');
const _page277 = () => import('./pages/features/_id_.astro.mjs');
const _page278 = () => import('./pages/features.astro.mjs');
const _page279 = () => import('./pages/feedback/login.astro.mjs');
const _page280 = () => import('./pages/feedback/new.astro.mjs');
const _page281 = () => import('./pages/feedback/_id_.astro.mjs');
const _page282 = () => import('./pages/feedback.astro.mjs');
const _page283 = () => import('./pages/form/_id_.astro.mjs');
const _page284 = () => import('./pages/form.astro.mjs');
const _page285 = () => import('./pages/history.astro.mjs');
const _page286 = () => import('./pages/lb/_slug_.astro.mjs');
const _page287 = () => import('./pages/linked-role.astro.mjs');
const _page288 = () => import('./pages/linked-roles/callback.astro.mjs');
const _page289 = () => import('./pages/linked-roles/start.astro.mjs');
const _page290 = () => import('./pages/linked-roles.astro.mjs');
const _page291 = () => import('./pages/nelu.astro.mjs');
const _page292 = () => import('./pages/news.astro.mjs');
const _page293 = () => import('./pages/partners.astro.mjs');
const _page294 = () => import('./pages/plans/checkout.astro.mjs');
const _page295 = () => import('./pages/plans/portal.astro.mjs');
const _page296 = () => import('./pages/premium/checkout.astro.mjs');
const _page297 = () => import('./pages/premium.astro.mjs');
const _page298 = () => import('./pages/privacy.astro.mjs');
const _page299 = () => import('./pages/pt-br/am.astro.mjs');
const _page300 = () => import('./pages/pt-br/apply.astro.mjs');
const _page301 = () => import('./pages/pt-br/blog/blibot-to-petto.astro.mjs');
const _page302 = () => import('./pages/pt-br/blog/currently-log.astro.mjs');
const _page303 = () => import('./pages/pt-br/blog/embed-builder-joins-petto.astro.mjs');
const _page304 = () => import('./pages/pt-br/blog/kobot-moves-to-petto.astro.mjs');
const _page305 = () => import('./pages/pt-br/blog/online-without-the-dot.astro.mjs');
const _page306 = () => import('./pages/pt-br/blog/petto-vs-other-bots.astro.mjs');
const _page307 = () => import('./pages/pt-br/blog/switch-from-carl-bot.astro.mjs');
const _page308 = () => import('./pages/pt-br/blog/switch-from-dyno.astro.mjs');
const _page309 = () => import('./pages/pt-br/blog/switch-from-mee6.astro.mjs');
const _page310 = () => import('./pages/pt-br/blog/vanity-moves-to-petto.astro.mjs');
const _page311 = () => import('./pages/pt-br/blog.astro.mjs');
const _page312 = () => import('./pages/pt-br/brand.astro.mjs');
const _page313 = () => import('./pages/pt-br/changelog/rss.xml.astro.mjs');
const _page314 = () => import('./pages/pt-br/changelog/_version_.astro.mjs');
const _page315 = () => import('./pages/pt-br/changelog.astro.mjs');
const _page316 = () => import('./pages/pt-br/code.astro.mjs');
const _page317 = () => import('./pages/pt-br/codegen.astro.mjs');
const _page318 = () => import('./pages/pt-br/commands.astro.mjs');
const _page319 = () => import('./pages/pt-br/cookies.astro.mjs');
const _page320 = () => import('./pages/pt-br/credits.astro.mjs');
const _page321 = () => import('./pages/pt-br/discord-age-verification.astro.mjs');
const _page322 = () => import('./pages/pt-br/discord-api-2026.astro.mjs');
const _page323 = () => import('./pages/pt-br/discord-encryption.astro.mjs');
const _page324 = () => import('./pages/pt-br/embed-builder.astro.mjs');
const _page325 = () => import('./pages/pt-br/embed-code.astro.mjs');
const _page326 = () => import('./pages/pt-br/f/_id_.astro.mjs');
const _page327 = () => import('./pages/pt-br/faq.astro.mjs');
const _page328 = () => import('./pages/pt-br/features/_id_.astro.mjs');
const _page329 = () => import('./pages/pt-br/features.astro.mjs');
const _page330 = () => import('./pages/pt-br/feedback/new.astro.mjs');
const _page331 = () => import('./pages/pt-br/feedback.astro.mjs');
const _page332 = () => import('./pages/pt-br/form/_id_.astro.mjs');
const _page333 = () => import('./pages/pt-br/form.astro.mjs');
const _page334 = () => import('./pages/pt-br/history.astro.mjs');
const _page335 = () => import('./pages/pt-br/lb/_slug_.astro.mjs');
const _page336 = () => import('./pages/pt-br/linked-roles.astro.mjs');
const _page337 = () => import('./pages/pt-br/nelu.astro.mjs');
const _page338 = () => import('./pages/pt-br/news.astro.mjs');
const _page339 = () => import('./pages/pt-br/partners.astro.mjs');
const _page340 = () => import('./pages/pt-br/premium.astro.mjs');
const _page341 = () => import('./pages/pt-br/privacy.astro.mjs');
const _page342 = () => import('./pages/pt-br/refunds.astro.mjs');
const _page343 = () => import('./pages/pt-br/roadmap.astro.mjs');
const _page344 = () => import('./pages/pt-br/snowflake.astro.mjs');
const _page345 = () => import('./pages/pt-br/stats.astro.mjs');
const _page346 = () => import('./pages/pt-br/status/vanity.astro.mjs');
const _page347 = () => import('./pages/pt-br/status.astro.mjs');
const _page348 = () => import('./pages/pt-br/team.astro.mjs');
const _page349 = () => import('./pages/pt-br/terms.astro.mjs');
const _page350 = () => import('./pages/pt-br/timestamp.astro.mjs');
const _page351 = () => import('./pages/pt-br/tools.astro.mjs');
const _page352 = () => import('./pages/pt-br.astro.mjs');
const _page353 = () => import('./pages/refunds.astro.mjs');
const _page354 = () => import('./pages/roadmap.astro.mjs');
const _page355 = () => import('./pages/snowflake.astro.mjs');
const _page356 = () => import('./pages/stats.astro.mjs');
const _page357 = () => import('./pages/status/vanity.astro.mjs');
const _page358 = () => import('./pages/status.astro.mjs');
const _page359 = () => import('./pages/team.astro.mjs');
const _page360 = () => import('./pages/terms.astro.mjs');
const _page361 = () => import('./pages/timestamp.astro.mjs');
const _page362 = () => import('./pages/tools.astro.mjs');
const _page363 = () => import('./pages/version.json.astro.mjs');
const _page364 = () => import('./pages/webhooks/omniplex.astro.mjs');
const _page365 = () => import('./pages/webhooks/topgg.astro.mjs');
const _page366 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/am.astro", _page2],
    ["src/pages/api/apply.ts", _page3],
    ["src/pages/api/billing/polar/webhook.ts", _page4],
    ["src/pages/api/currently-log.ts", _page5],
    ["src/pages/api/feedback/[id]/comment.ts", _page6],
    ["src/pages/api/feedback/[id]/comment-delete.ts", _page7],
    ["src/pages/api/feedback/[id]/status.ts", _page8],
    ["src/pages/api/feedback/[id]/vote.ts", _page9],
    ["src/pages/api/feedback/index.ts", _page10],
    ["src/pages/api/form/[id].ts", _page11],
    ["src/pages/api/health.ts", _page12],
    ["src/pages/api/og/lb/[slug].ts", _page13],
    ["src/pages/api/og/partner.ts", _page14],
    ["src/pages/api/session.ts", _page15],
    ["src/pages/api/showcase.ts", _page16],
    ["src/pages/api/stats.ts", _page17],
    ["src/pages/api/stats-history.ts", _page18],
    ["src/pages/api/status.ts", _page19],
    ["src/pages/api/status-check.ts", _page20],
    ["src/pages/api/status-history.ts", _page21],
    ["src/pages/api/status-search.ts", _page22],
    ["src/pages/api/status-services.ts", _page23],
    ["src/pages/api/v1/me.ts", _page24],
    ["src/pages/api/v1/movements.ts", _page25],
    ["src/pages/api/v1/packs.ts", _page26],
    ["src/pages/api/warm.ts", _page27],
    ["src/pages/appeal/[id]/file/[fileId].ts", _page28],
    ["src/pages/appeal/[id]/form/[fid]/upload.ts", _page29],
    ["src/pages/appeal/[id]/form/[fid].astro", _page30],
    ["src/pages/appeal/[id]/img/[kind].ts", _page31],
    ["src/pages/appeal/[id]/login.ts", _page32],
    ["src/pages/appeal/[id]/logout.ts", _page33],
    ["src/pages/appeal/[id]/status/[sid]/live.ts", _page34],
    ["src/pages/appeal/[id]/status/[sid].astro", _page35],
    ["src/pages/appeal/[id]/index.astro", _page36],
    ["src/pages/apply.astro", _page37],
    ["src/pages/blog/blibot-to-petto.astro", _page38],
    ["src/pages/blog/currently-log.astro", _page39],
    ["src/pages/blog/embed-builder-joins-petto.astro", _page40],
    ["src/pages/blog/kobot-moves-to-petto.astro", _page41],
    ["src/pages/blog/online-without-the-dot.astro", _page42],
    ["src/pages/blog/petto-vs-other-bots.astro", _page43],
    ["src/pages/blog/switch-from-carl-bot.astro", _page44],
    ["src/pages/blog/switch-from-dyno.astro", _page45],
    ["src/pages/blog/switch-from-mee6.astro", _page46],
    ["src/pages/blog/vanity-moves-to-petto.astro", _page47],
    ["src/pages/blog/index.astro", _page48],
    ["src/pages/brand.astro", _page49],
    ["src/pages/ceramos/checkout.ts", _page50],
    ["src/pages/changelog/rss.xml.ts", _page51],
    ["src/pages/changelog/[version].astro", _page52],
    ["src/pages/changelog.astro", _page53],
    ["src/pages/code.astro", _page54],
    ["src/pages/codegen.astro", _page55],
    ["src/pages/commands.astro", _page56],
    ["src/pages/cookies.astro", _page57],
    ["src/pages/credits.astro", _page58],
    ["src/pages/dash/admin/servers.astro", _page59],
    ["src/pages/dash/admin.astro", _page60],
    ["src/pages/dash/api.astro", _page61],
    ["src/pages/dash/api-act.ts", _page62],
    ["src/pages/dash/appeal-names.astro", _page63],
    ["src/pages/dash/badge-art/[id].ts", _page64],
    ["src/pages/dash/badges.astro", _page65],
    ["src/pages/dash/badges-act.ts", _page66],
    ["src/pages/dash/badges-admin.astro", _page67],
    ["src/pages/dash/badges-admin-act.ts", _page68],
    ["src/pages/dash/banners.astro", _page69],
    ["src/pages/dash/buy-ceramos.astro", _page70],
    ["src/pages/dash/callback.ts", _page71],
    ["src/pages/dash/ceramos.astro", _page72],
    ["src/pages/dash/ceramos-admin.astro", _page73],
    ["src/pages/dash/ceramos-admin-act.ts", _page74],
    ["src/pages/dash/changelog-admin.astro", _page75],
    ["src/pages/dash/credits-admin.astro", _page76],
    ["src/pages/dash/daily.astro", _page77],
    ["src/pages/dash/guild/[id]/ac-data.ts", _page78],
    ["src/pages/dash/guild/[id]/access.astro", _page79],
    ["src/pages/dash/guild/[id]/activity-boards.astro", _page80],
    ["src/pages/dash/guild/[id]/aged-roles.astro", _page81],
    ["src/pages/dash/guild/[id]/antinuke.astro", _page82],
    ["src/pages/dash/guild/[id]/antinuke-api.ts", _page83],
    ["src/pages/dash/guild/[id]/antiscam.astro", _page84],
    ["src/pages/dash/guild/[id]/appeals.astro", _page85],
    ["src/pages/dash/guild/[id]/appeals-file.ts", _page86],
    ["src/pages/dash/guild/[id]/appeals-image.ts", _page87],
    ["src/pages/dash/guild/[id]/appeals-live.ts", _page88],
    ["src/pages/dash/guild/[id]/audit.astro", _page89],
    ["src/pages/dash/guild/[id]/automation.astro", _page90],
    ["src/pages/dash/guild/[id]/automod.astro", _page91],
    ["src/pages/dash/guild/[id]/automod-api.ts", _page92],
    ["src/pages/dash/guild/[id]/backups.astro", _page93],
    ["src/pages/dash/guild/[id]/backups-export.ts", _page94],
    ["src/pages/dash/guild/[id]/backups-restore.ts", _page95],
    ["src/pages/dash/guild/[id]/birthdays.astro", _page96],
    ["src/pages/dash/guild/[id]/boards.astro", _page97],
    ["src/pages/dash/guild/[id]/bot-ping.ts", _page98],
    ["src/pages/dash/guild/[id]/bulk-role.astro", _page99],
    ["src/pages/dash/guild/[id]/bulk-role-status.ts", _page100],
    ["src/pages/dash/guild/[id]/bump.astro", _page101],
    ["src/pages/dash/guild/[id]/cards.astro", _page102],
    ["src/pages/dash/guild/[id]/cards-api.ts", _page103],
    ["src/pages/dash/guild/[id]/code.astro", _page104],
    ["src/pages/dash/guild/[id]/code-api.ts", _page105],
    ["src/pages/dash/guild/[id]/community.astro", _page106],
    ["src/pages/dash/guild/[id]/confessions.astro", _page107],
    ["src/pages/dash/guild/[id]/confessions-api.ts", _page108],
    ["src/pages/dash/guild/[id]/counters.astro", _page109],
    ["src/pages/dash/guild/[id]/counting.astro", _page110],
    ["src/pages/dash/guild/[id]/customize.astro", _page111],
    ["src/pages/dash/guild/[id]/economy.astro", _page112],
    ["src/pages/dash/guild/[id]/embeds.astro", _page113],
    ["src/pages/dash/guild/[id]/embeds-api.ts", _page114],
    ["src/pages/dash/guild/[id]/events.ts", _page115],
    ["src/pages/dash/guild/[id]/feeds.astro", _page116],
    ["src/pages/dash/guild/[id]/feeds-api.ts", _page117],
    ["src/pages/dash/guild/[id]/forms.astro", _page118],
    ["src/pages/dash/guild/[id]/forums.astro", _page119],
    ["src/pages/dash/guild/[id]/general.astro", _page120],
    ["src/pages/dash/guild/[id]/general-config-import.ts", _page121],
    ["src/pages/dash/guild/[id]/general-config-preview.ts", _page122],
    ["src/pages/dash/guild/[id]/general-export.ts", _page123],
    ["src/pages/dash/guild/[id]/giveaways.astro", _page124],
    ["src/pages/dash/guild/[id]/honeypot.astro", _page125],
    ["src/pages/dash/guild/[id]/join-roles.astro", _page126],
    ["src/pages/dash/guild/[id]/leveling.astro", _page127],
    ["src/pages/dash/guild/[id]/link-preview-api.ts", _page128],
    ["src/pages/dash/guild/[id]/live.ts", _page129],
    ["src/pages/dash/guild/[id]/lockdown-api.ts", _page130],
    ["src/pages/dash/guild/[id]/logging.astro", _page131],
    ["src/pages/dash/guild/[id]/media.astro", _page132],
    ["src/pages/dash/guild/[id]/members-search.ts", _page133],
    ["src/pages/dash/guild/[id]/message-roles.astro", _page134],
    ["src/pages/dash/guild/[id]/migrate.astro", _page135],
    ["src/pages/dash/guild/[id]/migrate-ai.ts", _page136],
    ["src/pages/dash/guild/[id]/moderation.astro", _page137],
    ["src/pages/dash/guild/[id]/moderation-api.ts", _page138],
    ["src/pages/dash/guild/[id]/module-states.ts", _page139],
    ["src/pages/dash/guild/[id]/modules.astro", _page140],
    ["src/pages/dash/guild/[id]/onboarding.astro", _page141],
    ["src/pages/dash/guild/[id]/overview.astro", _page142],
    ["src/pages/dash/guild/[id]/partners.astro", _page143],
    ["src/pages/dash/guild/[id]/permission-alerts.ts", _page144],
    ["src/pages/dash/guild/[id]/permissions.astro", _page145],
    ["src/pages/dash/guild/[id]/permissions-api.ts", _page146],
    ["src/pages/dash/guild/[id]/quests.astro", _page147],
    ["src/pages/dash/guild/[id]/quick-setup.astro", _page148],
    ["src/pages/dash/guild/[id]/quick-setup-api.ts", _page149],
    ["src/pages/dash/guild/[id]/reaction-role.astro", _page150],
    ["src/pages/dash/guild/[id]/responders.astro", _page151],
    ["src/pages/dash/guild/[id]/resync-api.ts", _page152],
    ["src/pages/dash/guild/[id]/role-blocks.ts", _page153],
    ["src/pages/dash/guild/[id]/role-quotas.astro", _page154],
    ["src/pages/dash/guild/[id]/role-triggers.astro", _page155],
    ["src/pages/dash/guild/[id]/rollouts.astro", _page156],
    ["src/pages/dash/guild/[id]/rules.astro", _page157],
    ["src/pages/dash/guild/[id]/rules-api.ts", _page158],
    ["src/pages/dash/guild/[id]/security.astro", _page159],
    ["src/pages/dash/guild/[id]/senders.astro", _page160],
    ["src/pages/dash/guild/[id]/staff-roles.astro", _page161],
    ["src/pages/dash/guild/[id]/stats.astro", _page162],
    ["src/pages/dash/guild/[id]/streaks.astro", _page163],
    ["src/pages/dash/guild/[id]/suggestions.astro", _page164],
    ["src/pages/dash/guild/[id]/suggestions-api.ts", _page165],
    ["src/pages/dash/guild/[id]/tickets.astro", _page166],
    ["src/pages/dash/guild/[id]/tickets-api.ts", _page167],
    ["src/pages/dash/guild/[id]/tickets-live.ts", _page168],
    ["src/pages/dash/guild/[id]/tools.astro", _page169],
    ["src/pages/dash/guild/[id]/vanity.astro", _page170],
    ["src/pages/dash/guild/[id]/verification-api.ts", _page171],
    ["src/pages/dash/guild/[id]/verification-status.ts", _page172],
    ["src/pages/dash/guild/[id]/version.ts", _page173],
    ["src/pages/dash/guild/[id]/voice-247.astro", _page174],
    ["src/pages/dash/guild/[id]/welcome.astro", _page175],
    ["src/pages/dash/health.ts", _page176],
    ["src/pages/dash/history.astro", _page177],
    ["src/pages/dash/import.astro", _page178],
    ["src/pages/dash/import-code.astro", _page179],
    ["src/pages/dash/item-file/[kind]/[id].ts", _page180],
    ["src/pages/dash/lang.ts", _page181],
    ["src/pages/dash/login.ts", _page182],
    ["src/pages/dash/logout.ts", _page183],
    ["src/pages/dash/manage/bot-status.ts", _page184],
    ["src/pages/dash/manage/index.astro", _page185],
    ["src/pages/dash/me.astro", _page186],
    ["src/pages/dash/missions.astro", _page187],
    ["src/pages/dash/missions-act.ts", _page188],
    ["src/pages/dash/name.astro", _page189],
    ["src/pages/dash/own-badges.astro", _page190],
    ["src/pages/dash/own-badges-act.ts", _page191],
    ["src/pages/dash/own-picture.astro", _page192],
    ["src/pages/dash/own-picture-act.ts", _page193],
    ["src/pages/dash/owner-servers.ts", _page194],
    ["src/pages/dash/partners-admin.astro", _page195],
    ["src/pages/dash/plan.astro", _page196],
    ["src/pages/dash/plans.astro", _page197],
    ["src/pages/dash/plans-admin.astro", _page198],
    ["src/pages/dash/plans-admin-act.ts", _page199],
    ["src/pages/dash/preferences.astro", _page200],
    ["src/pages/dash/premium.astro", _page201],
    ["src/pages/dash/privacy.astro", _page202],
    ["src/pages/dash/rank.astro", _page203],
    ["src/pages/dash/rank-act.ts", _page204],
    ["src/pages/dash/rank-design/[id]/[size].ts", _page205],
    ["src/pages/dash/search-index.json.ts", _page206],
    ["src/pages/dash/shop-act.ts", _page207],
    ["src/pages/dash/shop-admin.astro", _page208],
    ["src/pages/dash/shop-admin-act.ts", _page209],
    ["src/pages/dash/summary.astro", _page210],
    ["src/pages/dash/team.astro", _page211],
    ["src/pages/dash/uploads-admin.astro", _page212],
    ["src/pages/dash/uploads-admin-act.ts", _page213],
    ["src/pages/dash/index.astro", _page214],
    ["src/pages/discord-age-verification.astro", _page215],
    ["src/pages/discord-api-2026.astro", _page216],
    ["src/pages/discord-encryption.astro", _page217],
    ["src/pages/embed-builder.astro", _page218],
    ["src/pages/embed-code.astro", _page219],
    ["src/pages/es/am.astro", _page220],
    ["src/pages/es/apply.astro", _page221],
    ["src/pages/es/blog/blibot-to-petto.astro", _page222],
    ["src/pages/es/blog/currently-log.astro", _page223],
    ["src/pages/es/blog/embed-builder-joins-petto.astro", _page224],
    ["src/pages/es/blog/kobot-moves-to-petto.astro", _page225],
    ["src/pages/es/blog/online-without-the-dot.astro", _page226],
    ["src/pages/es/blog/petto-vs-other-bots.astro", _page227],
    ["src/pages/es/blog/switch-from-carl-bot.astro", _page228],
    ["src/pages/es/blog/switch-from-dyno.astro", _page229],
    ["src/pages/es/blog/switch-from-mee6.astro", _page230],
    ["src/pages/es/blog/vanity-moves-to-petto.astro", _page231],
    ["src/pages/es/blog/index.astro", _page232],
    ["src/pages/es/brand.astro", _page233],
    ["src/pages/es/changelog/rss.xml.ts", _page234],
    ["src/pages/es/changelog/[version].astro", _page235],
    ["src/pages/es/changelog.astro", _page236],
    ["src/pages/es/code.astro", _page237],
    ["src/pages/es/codegen.astro", _page238],
    ["src/pages/es/commands.astro", _page239],
    ["src/pages/es/cookies.astro", _page240],
    ["src/pages/es/credits.astro", _page241],
    ["src/pages/es/discord-age-verification.astro", _page242],
    ["src/pages/es/discord-api-2026.astro", _page243],
    ["src/pages/es/discord-encryption.astro", _page244],
    ["src/pages/es/embed-builder.astro", _page245],
    ["src/pages/es/embed-code.astro", _page246],
    ["src/pages/es/f/[id].astro", _page247],
    ["src/pages/es/faq.astro", _page248],
    ["src/pages/es/features/[id].astro", _page249],
    ["src/pages/es/features.astro", _page250],
    ["src/pages/es/feedback/new.astro", _page251],
    ["src/pages/es/feedback/index.astro", _page252],
    ["src/pages/es/form/[id].astro", _page253],
    ["src/pages/es/form.astro", _page254],
    ["src/pages/es/history.astro", _page255],
    ["src/pages/es/lb/[slug].astro", _page256],
    ["src/pages/es/linked-roles.astro", _page257],
    ["src/pages/es/nelu.astro", _page258],
    ["src/pages/es/news.astro", _page259],
    ["src/pages/es/partners.astro", _page260],
    ["src/pages/es/premium.astro", _page261],
    ["src/pages/es/privacy.astro", _page262],
    ["src/pages/es/refunds.astro", _page263],
    ["src/pages/es/roadmap.astro", _page264],
    ["src/pages/es/snowflake.astro", _page265],
    ["src/pages/es/stats.astro", _page266],
    ["src/pages/es/status/vanity.astro", _page267],
    ["src/pages/es/status.astro", _page268],
    ["src/pages/es/team.astro", _page269],
    ["src/pages/es/terms.astro", _page270],
    ["src/pages/es/timestamp.astro", _page271],
    ["src/pages/es/tools.astro", _page272],
    ["src/pages/es/index.astro", _page273],
    ["src/pages/f/login.ts", _page274],
    ["src/pages/f/[id].astro", _page275],
    ["src/pages/faq.astro", _page276],
    ["src/pages/features/[id].astro", _page277],
    ["src/pages/features.astro", _page278],
    ["src/pages/feedback/login.ts", _page279],
    ["src/pages/feedback/new.astro", _page280],
    ["src/pages/feedback/[id].astro", _page281],
    ["src/pages/feedback/index.astro", _page282],
    ["src/pages/form/[id].astro", _page283],
    ["src/pages/form.astro", _page284],
    ["src/pages/history.astro", _page285],
    ["src/pages/lb/[slug].astro", _page286],
    ["src/pages/linked-role.astro", _page287],
    ["src/pages/linked-roles/callback.ts", _page288],
    ["src/pages/linked-roles/start.ts", _page289],
    ["src/pages/linked-roles.astro", _page290],
    ["src/pages/nelu.astro", _page291],
    ["src/pages/news.astro", _page292],
    ["src/pages/partners.astro", _page293],
    ["src/pages/plans/checkout.ts", _page294],
    ["src/pages/plans/portal.ts", _page295],
    ["src/pages/premium/checkout.ts", _page296],
    ["src/pages/premium.astro", _page297],
    ["src/pages/privacy.astro", _page298],
    ["src/pages/pt-br/am.astro", _page299],
    ["src/pages/pt-br/apply.astro", _page300],
    ["src/pages/pt-br/blog/blibot-to-petto.astro", _page301],
    ["src/pages/pt-br/blog/currently-log.astro", _page302],
    ["src/pages/pt-br/blog/embed-builder-joins-petto.astro", _page303],
    ["src/pages/pt-br/blog/kobot-moves-to-petto.astro", _page304],
    ["src/pages/pt-br/blog/online-without-the-dot.astro", _page305],
    ["src/pages/pt-br/blog/petto-vs-other-bots.astro", _page306],
    ["src/pages/pt-br/blog/switch-from-carl-bot.astro", _page307],
    ["src/pages/pt-br/blog/switch-from-dyno.astro", _page308],
    ["src/pages/pt-br/blog/switch-from-mee6.astro", _page309],
    ["src/pages/pt-br/blog/vanity-moves-to-petto.astro", _page310],
    ["src/pages/pt-br/blog/index.astro", _page311],
    ["src/pages/pt-br/brand.astro", _page312],
    ["src/pages/pt-br/changelog/rss.xml.ts", _page313],
    ["src/pages/pt-br/changelog/[version].astro", _page314],
    ["src/pages/pt-br/changelog.astro", _page315],
    ["src/pages/pt-br/code.astro", _page316],
    ["src/pages/pt-br/codegen.astro", _page317],
    ["src/pages/pt-br/commands.astro", _page318],
    ["src/pages/pt-br/cookies.astro", _page319],
    ["src/pages/pt-br/credits.astro", _page320],
    ["src/pages/pt-br/discord-age-verification.astro", _page321],
    ["src/pages/pt-br/discord-api-2026.astro", _page322],
    ["src/pages/pt-br/discord-encryption.astro", _page323],
    ["src/pages/pt-br/embed-builder.astro", _page324],
    ["src/pages/pt-br/embed-code.astro", _page325],
    ["src/pages/pt-br/f/[id].astro", _page326],
    ["src/pages/pt-br/faq.astro", _page327],
    ["src/pages/pt-br/features/[id].astro", _page328],
    ["src/pages/pt-br/features.astro", _page329],
    ["src/pages/pt-br/feedback/new.astro", _page330],
    ["src/pages/pt-br/feedback/index.astro", _page331],
    ["src/pages/pt-br/form/[id].astro", _page332],
    ["src/pages/pt-br/form.astro", _page333],
    ["src/pages/pt-br/history.astro", _page334],
    ["src/pages/pt-br/lb/[slug].astro", _page335],
    ["src/pages/pt-br/linked-roles.astro", _page336],
    ["src/pages/pt-br/nelu.astro", _page337],
    ["src/pages/pt-br/news.astro", _page338],
    ["src/pages/pt-br/partners.astro", _page339],
    ["src/pages/pt-br/premium.astro", _page340],
    ["src/pages/pt-br/privacy.astro", _page341],
    ["src/pages/pt-br/refunds.astro", _page342],
    ["src/pages/pt-br/roadmap.astro", _page343],
    ["src/pages/pt-br/snowflake.astro", _page344],
    ["src/pages/pt-br/stats.astro", _page345],
    ["src/pages/pt-br/status/vanity.astro", _page346],
    ["src/pages/pt-br/status.astro", _page347],
    ["src/pages/pt-br/team.astro", _page348],
    ["src/pages/pt-br/terms.astro", _page349],
    ["src/pages/pt-br/timestamp.astro", _page350],
    ["src/pages/pt-br/tools.astro", _page351],
    ["src/pages/pt-br/index.astro", _page352],
    ["src/pages/refunds.astro", _page353],
    ["src/pages/roadmap.astro", _page354],
    ["src/pages/snowflake.astro", _page355],
    ["src/pages/stats.astro", _page356],
    ["src/pages/status/vanity.astro", _page357],
    ["src/pages/status.astro", _page358],
    ["src/pages/team.astro", _page359],
    ["src/pages/terms.astro", _page360],
    ["src/pages/timestamp.astro", _page361],
    ["src/pages/tools.astro", _page362],
    ["src/pages/version.json.ts", _page363],
    ["src/pages/webhooks/omniplex.ts", _page364],
    ["src/pages/webhooks/topgg.ts", _page365],
    ["src/pages/index.astro", _page366]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///home/runner/work/petto-web/petto-web/build/dist/client/",
    "server": "file:///home/runner/work/petto-web/petto-web/build/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
{
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
