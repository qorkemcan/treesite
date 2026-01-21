// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Sitemizin tam adresi (Site haritası için şart!)
  site: 'https://protreetrim.com',

  // ★ BU SATIR ŞART: Hem hızlı statik sayfalar hem de canlı API (e-posta) için.
  output: 'hybrid', 

  integrations: [sitemap()],
  
  // Vercel adaptörü canlı fonksiyonları (e-posta gönderimini) yönetir.
  adapter: vercel(),
});