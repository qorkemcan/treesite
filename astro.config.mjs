import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.protreetrim.com',
  output: 'static', 
  integrations: [
    sitemap({
      // Sadece ana statik sayfaları (Home, About, Contact vb.) dahil et
      filter: (page) => 
        !page.includes('tree-removal-') && 
        !page.includes('stump-grinding-') && 
        !page.includes('emergency-service-') &&
        !page.includes('/county/'),
      
      serialize(item) {
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