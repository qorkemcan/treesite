# ProTreeTrim CNI Sitemap Hygiene Patch — 2026-06-06

This patch targets Search Console's `Crawled - currently not indexed` cleanup work without noindexing or deleting city/service pages.

## Changes

- Normalizes county slugs consistently, including `St. Lucie` and `St. Johns` to `st-lucie` and `st-johns`.
- Updates county hub route generation and homepage county links to use the same normalized slug logic.
- Cleans generated sitemap files before each sitemap build so stale `sitemap-county-st.-*.xml` files do not remain in `/public`.
- Changes sitemap submission behavior to prioritize richer city/service pages by default. The non-rich generated city/service pages still exist and remain indexable, but they are no longer all pushed through XML sitemaps unless explicitly requested.
- Adds redirects for old dotted county hub and sitemap URLs.

## Build behavior

Default build now submits only richer city/service pages in county sitemaps:

```bash
npm run build
```

To temporarily submit every generated city/service URL again:

```bash
SITEMAP_ONLY_RICH_PAGES=false npm run build
```

## Install

```bash
unzip -o protreetrim-cni-sitemap-hygiene-patch-2026-06-06.zip
npm run build
git add generate-sitemaps.mjs vercel.json src/pages PATCH_NOTES_CNI_SITEMAP_HYGIENE.md
git commit -m "Improve sitemap hygiene for crawled not indexed URLs"
git push origin main
```

After deployment, test:

```bash
curl -I https://www.protreetrim.com/county/st.-lucie/
curl -I https://www.protreetrim.com/county/st.-johns/
curl -I https://www.protreetrim.com/sitemap-county-st.-lucie.xml
curl -I https://www.protreetrim.com/sitemap-county-st.-johns.xml
```

Expected result: `308` redirect to the normalized URL.
