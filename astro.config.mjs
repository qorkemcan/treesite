import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.protreetrim.com',
  output: 'static', 
  integrations: [], // Sitemap eklentisini sildik, çakışma riski sıfırlandı.
  adapter: vercel(),
});