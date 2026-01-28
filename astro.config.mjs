// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.protreetrim.com',
  output: 'static', 
  integrations: [
    sitemap({
      // Her sayfa için özel SEO kuralları tanımlıyoruz
      serialize(item) {
        // Şehir bazlı programmatic sayfalar (tree-removal, stump-grinding, emergency-service)
        if (
          item.url.includes('tree-removal') || 
          item.url.includes('stump-grinding') || 
          item.url.includes('emergency-service')
        ) {
          return {
            ...item,
            changefreq: 'weekly', // Fiyatlar veya veriler değiştikçe haftalık taransın
            priority: 0.9,       // Bu sayfalar bizim en önemli sayfalarımız (Hero pages)
            lastmod: new Date().toISOString(), // Her build alındığında güncel tarih basar
          };
        }
        
        // Ana sayfa için en yüksek öncelik
        if (item.url === 'https://www.protreetrim.com/') {
          return {
            ...item,
            changefreq: 'daily',
            priority: 1.0,
          };
        }

        // Diğer statik sayfalar (About, Privacy, etc.)
        return {
          ...item,
          changefreq: 'monthly',
          priority: 0.5,
        };
      },
    }),
  ],
  adapter: vercel(),
});