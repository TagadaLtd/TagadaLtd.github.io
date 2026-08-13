// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { LANGS, DEFAULT_LANG } from './src/i18n/config.mjs';

// The GitHub Pages user site for this account. Served from the domain root, so
// no `base` is needed and every internal path stays absolute.
//
// When a real domain is chosen: change this line, add a CNAME file to public/,
// and point the DNS at GitHub. Nothing else refers to the host.
const SITE = 'https://tagadaltd.github.io';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LANG,
        locales: Object.fromEntries(LANGS.map((l) => [l, l])),
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
