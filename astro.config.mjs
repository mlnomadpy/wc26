// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

// Feature-Sliced Design layer aliases (see docs/feature-sliced-design.md).
// Mirrors tsconfig.json `paths`; Vite needs these to resolve .astro/.js imports.
const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// Deployed to GitHub Pages (custom domain) at https://www.tahabouhsine.com/wc26/
// `base` makes all asset URLs resolve under the /wc26/ subpath.
export default defineConfig({
  site: 'https://www.tahabouhsine.com',
  base: '/wc26',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { assets: 'assets' },
  vite: {
    resolve: {
      alias: {
        '@app': r('./src/app'),
        '@pages': r('./src/pages'),
        '@widgets': r('./src/widgets'),
        '@features': r('./src/features'),
        '@entities': r('./src/entities'),
        '@shared': r('./src/shared'),
      },
    },
  },
});
