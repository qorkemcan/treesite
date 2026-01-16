// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Sitemizin tam adresi (Site haritası için şart!)
  site: 'https://protreetrim.com',
  integrations: [sitemap()],
});