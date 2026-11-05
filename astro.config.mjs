import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';

// Reuses the bot's own .env (one source of truth for Petto API/Discord credentials) instead
// of duplicating secrets into this project. In dev this makes them available on
// process.env for the dashboard's SSR routes too; in production those same variables need
// to be set as Cloudflare Pages environment variables (Workers don't read .env files).
loadEnv({ path: path.resolve('../petto bot 1/.env') });

import { readFileSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

// What the footer, the dashboard and /version.json say about this build, so it is easy to tell which one is running.
const appVersion = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version;
let buildCommit = '';
try { buildCommit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { /* no git folder in this build */ }

const discloudTarget = process.env.ASTRO_TARGET === 'discloud';

// The routes that also exist in Spanish (and so in every language), for the hreflang links of Base.astro: '/', '/commands', '/form/[id]'...
// Read here from the folder instead of with import.meta.glob in Base.astro: a glob there links every Spanish page (and the scripts of
// their components) to every page of the site, so the embed builder's script ran in the dashboard, failed, and stopped the dashboard's own.
const esRoutes = readdirSync(new URL('./src/pages/es', import.meta.url), { recursive: true })
  .map((file) => String(file).split(path.sep).join('/'))
  .filter((file) => file.endsWith('.astro'))
  .map((file) => `/${file}`.replace(/\.astro$/, '').replace(/\/index$/, '') || '/');

export default defineConfig({
  site: 'https://petto.sbs',
  integrations: [
    // Keep only the icons used by the UI in the Worker bundle. Without this allowlist
    // astro-icon embeds both complete Iconify collections in every SSR build.
    icon({
      include: {
        ph: [
          'moon-fill', 'desktop-fill', 'cookie-fill', 'sort-ascending-fill', 'hand-heart-fill', 'arrow-up-right-bold', 'vinyl-record-fill', 'dog-fill', 'bird-fill', 'feather-fill', 'rabbit-fill', 'leaf-fill', 'shuffle-fill', 'fire-fill', 'music-notes-fill', 'apple-logo-fill', 'twitch-logo-fill', 'youtube-logo-fill', 'github-logo-fill', 'steam-logo-fill', 'game-controller-fill', 'crown-simple-fill', 'television-fill', 'film-strip-fill', 'circle-half-fill', 'book-open-text-fill', 'package-fill', 'currency-btc-fill', 'currency-circle-dollar-fill', 'paw-print-fill',
          'folder-simple-fill', 'broadcast-fill', 'arrows-clockwise-bold', 'plug-fill', 'hourglass-medium-fill', 'pause-fill', 'check-circle-fill', 'x-circle-fill', 'funnel-simple-bold', 'users-three-fill',
          'puzzle-piece-fill', 'translate-fill', 'paperclip-bold', 'file-text-bold', 'magnifying-glass-bold', 'microphone-fill', 'handshake-fill', 'pencil-simple-fill', 'plus-circle-fill', 'trash', 'calendar-check-fill', 'gavel-fill', 'robot-fill',
          'bug-fill', 'user-circle-dashed-fill', 'chat-circle-fill', 'user-circle-fill', 'browser-fill', 'scales-fill', 'list-checks-fill', 'tray-fill', 'pencil-simple-bold', 'cursor-click-fill', 'gear-six-fill', 'paint-brush-broad-fill', 'chat-teardrop-text-fill', 'copy-simple-bold', 'link-simple-bold', 'trash-bold', 'circle', 'plus-bold', 'arrow-square-out-bold', 'check-circle-fill',
          'arrow-right-bold', 'lock-fill', 'lightning-fill', 'sword-fill', 'hammer-fill', 'arrow-left-bold', 'hash-bold', 'note-pencil-bold', 'arrow-square-out-bold', 'cursor-fill',
          'archive-fill', 'arrows-clockwise-fill', 'arrow-bend-up-left-fill', 'arrow-counter-clockwise-bold', 'arrow-counter-clockwise-fill',
          'arrow-down', 'arrow-fat-lines-up-fill', 'arrow-left', 'arrow-right', 'arrow-square-out', 'arrow-up', 'arrow-up-right', 'dots-six-vertical-bold', 'text-align-left-bold', 'caret-up-bold', 'caret-down-bold', 'clock-countdown-fill', 'link-simple-bold', 'bell-fill',
          'bell-ringing-fill', 'book-open-fill', 'buildings-fill', 'caret-down', 'caret-left-bold',
          'caret-right-bold', 'caret-up-down', 'chart-bar', 'chart-bar-fill', 'chart-line-fill',
          'chart-line-up', 'chart-line-up-fill', 'chat-circle-dots-fill', 'chat-circle-text-fill',
          'chats-circle-fill', 'chats-fill', 'chat-text-fill', 'check-bold', 'arrow-clockwise-bold', 'smiley-wink-fill', 'check-circle-fill',
          'check-fill', 'circle-dashed', 'circle-fill', 'clipboard-text-fill', 'clock-counter-clockwise-fill', 'credit-card-fill',
          'clock-fill', 'code-fill', 'command-fill', 'copy-bold', 'crown-fill', 'cube-fill', 'database-fill',
          'cloud-slash-fill', 'door-fill', 'door-open-fill', 'download-simple-bold', 'envelope-simple-fill', 'eye-fill', 'eye-slash-fill',
          'file-code-bold', 'file-code-fill', 'flag-fill', 'flask-fill', 'floppy-disk-fill', 'folder-fill',
          'funnel-fill', 'gauge-fill', 'gavel-fill', 'gear-fill', 'gear-six-fill', 'gift-fill', 'user-check-fill', 'medal', 'clock-counter-clockwise', 'palette-fill', 'broom-fill', 'sparkle', 'link-bold', 'globe', 'globe-fill', 'cake-fill', 'trophy-fill',
          'globe-hemisphere-west-fill', 'hand-fill', 'hand-waving-fill', 'handshake-fill', 'hard-drives-fill', 'image-fill', 'hash', 'hash-fill', 'headphones-fill',
          'headset-fill', 'heart-fill', 'identification-badge-fill', 'info-fill', 'key-fill', 'keyhole-fill',
          'lightbulb-fill', 'link-fill', 'link-simple', 'list', 'list-checks-fill', 'list-dashes-fill', 'lock-open-fill', 'lock-simple-fill', 'magic-wand-fill', 'magnifying-glass', 'user', 'clock', 'image', 'image-broken', 'text-t', 'users', 'shield-check',
          'map-trifold-fill', 'medal-fill', 'megaphone-fill', 'moon-stars-fill', 'newspaper-fill', 'notebook-fill',
          'mask-happy-fill', 'list-bullets-fill', 'minus-circle-fill', 'ticket-fill', 'users-fill', 'scroll-fill', 'archive-fill', 'paint-brush-fill', 'paper-plane-tilt-fill', 'pencil-fill', 'pencil-simple-fill', 'play-fill', 'plus',
          'plus-bold', 'plus-circle-fill', 'prohibit-fill', 'pulse-fill', 'push-pin-fill', 'question-fill',
          'ranking-fill', 'robot', 'robot-fill', 'rocket-launch-fill', 'scales-fill', 'seal-check-fill',
          'share-network-fill', 'shield-check-fill', 'shield-fill', 'shield-warning-fill', 'sign-out-fill',
          'siren-fill', 'sliders-horizontal-fill', 'smiley-fill', 'sparkle-fill', 'speaker-high-fill',
          'speaker-slash-fill', 'spinner-gap', 'squares-four-fill', 'star-fill', 'stop-circle-fill', 'sun-fill',
          'stack-fill', 'tag-fill', 'terminal-window-fill', 'ticket', 'timer-fill', 'trash-fill', 'trophy-fill', 'flask-fill',
          'upload-simple-bold', 'user-fill', 'user-gear-fill', 'lock-key-fill', 'user-minus-fill', 'user-plus-fill', 'users-three-fill',
          'warning-fill', 'webhooks-logo-fill', 'wrench-fill', 'x', 'x-bold', 'x-circle-fill', 'x-fill',, 'plugs-connected-fill', 'music-notes-fill', 'game-controller-fill', 'cat-fill', 'paw-print-fill', 'camera-fill'],
        'simple-icons': [
          'deezer', 'applemusic', 'mastodon', 'tumblr', 'letterboxd', 'epicgames', 'anthropic', 'astro', 'claude', 'cloudflare', 'discord', 'facebook', 'github',
          'googlegemini', 'nodedotjs', 'npm', 'phosphoricons', 'postgresql', 'simpleicons',
          'typescript', 'vite', 'x', 'youtube', 'instagram', 'tiktok', 'pinterest', 'spotify', 'twitch', 'kick', 'soundcloud', 'reddit', 'bluesky', 'modrinth', 'pokemon', 'rss', 'steam', 'pypi', 'anilist', 'wikipedia', 'chessdotcom',
        ],
      },
    }),
    react(),
    // /dash/** is the authenticated dashboard, private and per-user, it has no business in a
    // public sitemap or search results.
    sitemap({ filter: (page) => !page.includes('/dash') && !/\/form\/?$/.test(page) && !/\/features\/[^/]+\/?$/.test(page) }),
  ],
  i18n: {
    locales: ['en', 'es', 'pt-BR'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  // The whole marketing site stays static (prerendered); only src/pages/dash/** opts out
  // via `export const prerender = false`, since it needs a live session per request.
  // Public pages linked with data-astro-prefetch are fetched on hover (see Base.astro); nothing is prefetched by default.
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  output: 'hybrid',
  outDir: discloudTarget ? './build/' : './dist/',
  // Dynamic dashboard routes must carry their component styles in the Worker
  // response. Without this, Cloudflare can render the HTML while the SSR page
  // misses the generated CSS asset link and appears as unstyled markup.
  // The Node server (Discloud) links the larger stylesheets instead: they are hashed files the browser keeps for a year, so
  // every page after the first one is lighter. The dashboard's page swaps add the new page's links (syncHeadAssets).
  build: { inlineStylesheets: discloudTarget ? 'auto' : 'always' },
  // El JavaScript del navegador siempre puede inspeccionarse; esto endurece el build,
  // no lo convierte en código secreto: lo mantiene minificado y sin source maps.
  vite: {
    // Only the Node (Discloud) build may bundle the direct database reader; the Worker build drops it.
    define: {
      __DIRECT_DB__: JSON.stringify(discloudTarget),
      // The Node build (Discloud) may use Node-only modules: Redis and the shared cache's single flight.
      __NODE_TARGET__: JSON.stringify(discloudTarget),
      __APP_VERSION__: JSON.stringify(appVersion),
      __ES_ROUTES__: JSON.stringify(esRoutes),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __BUILD_COMMIT__: JSON.stringify(buildCommit),
      __BUILD_TARGET__: JSON.stringify(discloudTarget ? 'discloud' : 'cloudflare'),
    },
    build: {
      minify: 'esbuild',
      sourcemap: false,
    },
  },
  adapter: discloudTarget ? node({ mode: 'standalone' }) : cloudflare(),
  // Docs moved to their own Mintlify site, every old in-repo docs URL (and its localized
  // copies) now bounces straight there instead of 404ing.
  // Wildcard entries (/docs/[...slug]) are handled by public/_redirects instead: Astro
  // writes those without a :splat placeholder in the destination, which Cloudflare rejects.
  redirects: {
    '/docs': 'https://wiki.petto.sbs',
    '/es/docs': 'https://wiki.petto.sbs',
    '/pt-br/docs': 'https://wiki.petto.sbs',
  },
});
