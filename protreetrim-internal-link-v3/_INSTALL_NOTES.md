# ProTreeTrim Internal Link & Money Page Boost v3

This package adds controlled internal linking between blog posts, county hubs, and city/service money pages.

## Files changed

- `src/data/internal-links.js` — new helper with priority service pages, blog guide mappings, county hub mappings, and intent detection.
- `src/pages/blog/[slug].astro` — adds a contextual “Related Florida service areas” block under blog articles.
- `src/pages/county/[county].astro` — adds high-intent city/service hub cards and county-specific guide links.
- `src/pages/[slug].astro` — keeps the v2 city/service differentiation improvements and adds related guide links to money pages.

## Install

From the repo root:

```bash
unzip -o protreetrim-internal-link-v3.zip
rsync -av protreetrim-internal-link-v3/ ./
npm run build
```

## Commit

If build succeeds:

```bash
git status --short
git diff --stat
git add src/data/internal-links.js "src/pages/blog/[slug].astro" "src/pages/county/[county].astro" "src/pages/[slug].astro"
git commit -m "Add internal linking to money pages"
git push origin internal-link-money-page-v3
```

## Pages to manually check

Blog pages:

- `/blog/deland-stump-grinding-guide-costs-access-and-yard-restoration/`
- `/blog/florida-tree-removal-permit-guide/`
- `/blog/what-to-do-if-a-tree-blocks-your-driveway-after-a-storm/`

County pages:

- `/county/volusia/`
- `/county/baker/`
- `/county/broward/`

City/service pages:

- `/stump-grinding-deland/`
- `/tree-removal-macclenny/`
- `/emergency-service-lake-city/`
