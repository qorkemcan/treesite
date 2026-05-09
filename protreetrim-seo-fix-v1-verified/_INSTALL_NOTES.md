# ProTreeTrim SEO Fix v1.1 — Verified [slug].astro

This package is the same technical SEO cleanup pack as v1, but `src/pages/[slug].astro` was rebuilt from the exact file supplied after v1 to avoid relying on the Repomix copy.

## Replace these files in the same paths

- `astro.config.mjs`
- `generate-sitemaps.mjs`
- `src/layouts/MainLayout.astro`
- `src/pages/[slug].astro`
- `src/pages/county/[county].astro`
- `src/pages/blog/index.astro`
- `src/pages/blog/[slug].astro`
- `src/pages/blog/page/[page].astro`
- `src/pages/blog/category/[slug].astro`
- `src/pages/blog/category/[slug]/page/[page].astro`
- `src/pages/blog-search.json.ts`
- `src/components/PriceCalculator.astro`

## Key fixes

1. URL standard moved to trailing slash with `trailingSlash: 'always'`.
2. Sitemap URLs now match canonical trailing-slash format.
3. Page-level duplicate canonical tags removed; canonical is passed into `MainLayout`.
4. Blog and category canonical handling cleaned.
5. Fake/random live signals removed from `[slug].astro`.
6. `$0 - $0` default calculator output removed from the visible initial state.
7. Risky trust language softened from “official/licensed” style to “dispatch network / independent providers.”
8. Duplicate `(1).md` blog files are filtered out of sitemap/search/listing logic.

## Local test

Run:

```bash
npm run build
```

Then check these live paths after deploy:

- `/tree-removal-tallahassee/`
- `/stump-grinding-deland/`
- `/blog/`
- `/sitemap-index.xml`
- `/sitemap-main.xml`
- `/sitemap-blog.xml`

## Google Search Console after deploy

1. Resubmit `/sitemap-index.xml`.
2. Inspect a few representative city/service URLs.
3. Start validation for canonical-related coverage issues after Google recrawls the site.

