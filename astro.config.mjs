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
    icon(),
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
