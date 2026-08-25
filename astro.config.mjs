import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';

loadEnv({ path: path.resolve('../petto bot 1/.env') });

export default defineConfig({
  site: 'https://petto.sbs',
  integrations: [
    icon({
      include: {
        ph: [
          'archive-fill', 'arrow-bend-up-left-fill', 'arrow-counter-clockwise-bold', 'arrow-counter-clockwise-fill',
          'arrow-fat-lines-up-fill', 'arrow-left', 'arrow-right', 'arrow-square-out', 'arrow-up-right', 'bell-fill',
          'bell-ringing-fill', 'book-open-fill', 'buildings-fill', 'caret-down', 'caret-left-bold',
          'caret-right-bold', 'caret-up-down', 'chart-bar', 'chart-bar-fill', 'chart-line-fill',
          'chart-line-up', 'chart-line-up-fill', 'chat-circle-dots-fill', 'chat-circle-text-fill',
          'chats-circle-fill', 'chats-fill', 'chat-text-fill', 'check-bold', 'check-circle-fill',
          'check-fill', 'circle-dashed', 'circle-fill', 'clipboard-text-fill', 'clock-counter-clockwise-fill', 'credit-card-fill',
          'clock-fill', 'code-fill', 'command-fill', 'copy-bold', 'crown-fill', 'cube-fill', 'database-fill',
          'cloud-slash-fill', 'door-fill', 'door-open-fill', 'download-simple-bold', 'envelope-simple-fill', 'eye-slash-fill',
          'file-code-bold', 'file-code-fill', 'flag-fill', 'flask-fill', 'floppy-disk-fill', 'folder-fill',
          'funnel-fill', 'gauge-fill', 'gavel-fill', 'gear-fill', 'gear-six-fill', 'gift-fill', 'globe',
          'globe-hemisphere-west-fill', 'hand-fill', 'hand-waving-fill', 'hash', 'hash-fill', 'headphones-fill',
          'headset-fill', 'heart-fill', 'identification-badge-fill', 'info-fill', 'key-fill', 'keyhole-fill',
          'lightbulb-fill', 'link-fill', 'link-simple', 'list', 'list-checks-fill', 'list-dashes-fill', 'lock-open-fill', 'lock-simple-fill', 'magnifying-glass',
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
    sitemap({ filter: (page) => !page.includes('/dash') }),
  ],
  i18n: {
    locales: ['en', 'es', 'pt-BR'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  output: 'hybrid',
  build: { inlineStylesheets: 'always' },
  vite: {
    build: {
      minify: 'esbuild',
      sourcemap: false,
    },
  },
  adapter: cloudflare(),
  redirects: {
    '/docs': 'https://wiki.petto.sbs',
    '/es/docs': 'https://wiki.petto.sbs',
    '/pt-br/docs': 'https://wiki.petto.sbs',
  },
});
