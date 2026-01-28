// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.protreetrim.com',
  output: 'static', 
  integrations: [
    sitemap({
      // DİKKAT: Script ile oluşturduğumuz sayfaları buradan eliyoruz.
      // Astro sadece ana sayfaları (Home, About, Contact, Gallery vb.) sitemap yapacak.
      filter: (page) => 
        !page.includes('tree-removal-') && 
        !page.includes('stump-grinding-') && 
        !page.includes('emergency-service-') &&
        !page.includes('/county/'),
      
      serialize(item) {
        // Ana sayfa için ayarlar
        if (item.url === 'https://www.protreetrim.com/') {
          return {
            ...item,
            changefreq: 'daily',
            priority: 1.0,
            lastmod: new Date().toISOString(),
          };
        }

        // Geri kalan sabit sayfalar (About, Contact, Privacy, Gallery)
        return {
          ...item,
          changefreq: 'monthly',
          priority: 0.7,
          lastmod: new Date().toISOString(),
        };
      },
    }),
  ],
  adapter: vercel(),
});