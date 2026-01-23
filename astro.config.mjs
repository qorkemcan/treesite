// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Sitemizin tam adresi (Site haritası için şart!)
  site: 'https://www.protreetrim.com',

  // Hatanın çözümü: Astro v5 "hybrid" yerine "static" kullanımını öneriyor.
  // API dosyamızdaki "prerender = false" ayarı sayesinde formumuz yine çalışacak.
  output: 'static', 

  integrations: [sitemap()],
  
  // Vercel adaptörü canlı fonksiyonları (e-posta gönderimini) yönetir.
  adapter: vercel(),
});