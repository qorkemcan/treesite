import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.protreetrim.com',
  trailingSlash: 'always',
  output: 'static',
  adapter: vercel(),
});
