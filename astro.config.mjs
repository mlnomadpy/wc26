// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages (custom domain) at https://www.tahabouhsine.com/wc26/
// `base` makes all asset URLs resolve under the /wc26/ subpath.
export default defineConfig({
  site: 'https://www.tahabouhsine.com',
  base: '/wc26',
  build: { assets: 'assets' },
});
