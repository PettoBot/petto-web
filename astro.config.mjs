import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';

// Reuses the bot's own .env (one source of truth for Supabase/Discord credentials) instead
// of duplicating secrets into this project. In dev this makes them available on
// process.env for the dashboard's SSR routes too; in production those same variables need
// to be set as Cloudflare Pages environment variables (Workers don't read .env files).
loadEnv({ path: path.resolve('../petto bot 1/.env') });

export default defineConfig({
  site: 'https://petto.sbs',
  integrations: [
    // Keep only the icons used by the UI in the Worker bundle. Without this allowlist
    // astro-icon embeds both complete Iconify collections in every SSR build.
    icon({
      include: {
        ph: [
          'archive-fill', 'arrow-bend-up-left-fill', 'arrow-counter-clockwise-bold', 'arrow-counter-clockwise-fill',
          'arrow-fat-lines-up-fill', 'arrow-left', 'arrow-right', 'arrow-square-out', 'arrow-up-right', 'bell-fill',
          'bell-ringing-fill', 'book-open-fill', 'buildings-fill', 'caret-down', 'caret-left-bold',
          'caret-right-bold', 'caret-up-down', 'chart-bar', 'chart-bar-fill', 'chart-line-fill',
          'chart-line-up', 'chart-line-up-fill', 'chat-circle-dots-fill', 'chat-circle-text-fill',
          'chats-circle-fill', 'chats-fill', 'chat-text-fill', 'check-bold', 'check-circle-fill',
          'check-fill', 'circle-dashed', 'circle-fill', 'clipboard-text-fill', 'clock-counter-clockwise-fill',
          'clock-fill', 'code-fill', 'command-fill', 'copy-bold', 'crown-fill', 'cube-fill', 'database-fill',
          'cloud-slash-fill', 'door-fill', 'door-open-fill', 'download-simple-bold', 'envelope-simple-fill', 'eye-slash-fill',
          'file-code-bold', 'file-code-fill', 'flag-fill', 'flask-fill', 'floppy-disk-fill', 'folder-fill',
          'funnel-fill', 'gauge-fill', 'gavel-fill', 'gear-fill', 'gear-six-fill', 'gift-fill', 'globe',
          'globe-hemisphere-west-fill', 'hand-fill', 'hand-waving-fill', 'hash', 'hash-fill', 'headphones-fill',
          'headset-fill', 'heart-fill', 'identification-badge-fill', 'info-fill', 'key-fill', 'keyhole-fill',
          'lightbulb-fill', 'link-fill', 'link-simple', 'list', 'list-checks-fill', 'list-dashes-fill', 'lock-simple-fill', 'magnifying-glass',
          'map-trifold-fill', 'medal-fill', 'megaphone-fill', 'moon-stars-fill', 'newspaper-fill', 'notebook-fill',
          'paint-brush-fill', 'paper-plane-tilt-fill', 'pencil-fill', 'pencil-simple-fill', 'play-fill', 'plus',
          'plus-bold', 'plus-circle-fill', 'prohibit-fill', 'pulse-fill', 'push-pin-fill', 'question-fill',
          'ranking-fill', 'robot', 'robot-fill', 'rocket-launch-fill', 'scales-fill', 'seal-check-fill',
          'share-network-fill', 'shield-check-fill', 'shield-fill', 'shield-warning-fill', 'sign-out-fill',
          'siren-fill', 'sliders-horizontal-fill', 'smiley-fill', 'sparkle-fill', 'speaker-high-fill',
          'speaker-slash-fill', 'spinner-gap', 'squares-four-fill', 'star-fill', 'stop-circle-fill', 'sun-fill',
          'stack-fill', 'tag-fill', 'terminal-window-fill', 'ticket', 'timer-fill', 'trash-fill', 'trophy-fill',
          'upload-simple-bold', 'user-fill', 'user-minus-fill', 'user-plus-fill', 'users-three-fill',
          'warning-fill', 'webhooks-logo-fill', 'wrench-fill', 'x', 'x-fill',
        ],
        'simple-icons': [
          'anthropic', 'astro', 'claude', 'cloudflare', 'discord', 'facebook', 'github',
          'googlegemini', 'nodedotjs', 'npm', 'phosphoricons', 'postgresql', 'simpleicons',
          'supabase', 'typescript', 'vite', 'x', 'youtube',
        ],
      },
    }),
    react(),
    // /dash/** is the authenticated dashboard, private and per-user, it has no business in a
    // public sitemap or search results.
    sitemap({ filter: (page) => !page.includes('/dash') }),
  ],
  i18n: {
    locales: ['en', 'es', 'pt-BR'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  // The whole marketing site stays static (prerendered); only src/pages/dash/** opts out
  // via `export const prerender = false`, since it needs a live session per request.
  output: 'hybrid',
  adapter: cloudflare(),
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
