// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages at https://mlnomadpy.github.io/wc26/
// `base` makes all asset URLs resolve under the /wc26/ subpath.
export default defineConfig({
  site: 'https://mlnomadpy.github.io',
  base: '/wc26',
  build: { assets: 'assets' },
});
