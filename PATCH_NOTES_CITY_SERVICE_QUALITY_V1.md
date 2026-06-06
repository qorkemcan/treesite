# City/Service Quality Differentiation V1

Date: 2026-06-06

## Purpose

This patch strengthens the programmatic city/service pages that are heavily represented in the Search Console "Crawled - currently not indexed" sample set.

It does **not** add noindex tags, delete pages, or change URL structure. It adds more visible, service-specific and location-sensitive homeowner decision content to the existing city/service template.

## Changed file

- `src/pages/[slug].astro`

## What changed

### 1. City-specific planning layer

Adds a new section near the top of every city/service page:

- Local setting: coastal, metro, rural, or inland residential context.
- Site constraints: access, driveways, fences, pool decks, nearby homes, rural access, pavers, etc.
- Weather and aftercare: storm exposure and the likely next step after the job.

These cards use the city, county, population, landmark, service type, and existing city data to reduce the feeling of a copied template.

### 2. Homeowner first-step guide

Adds a service-specific decision block:

- First check
- Call threshold
- Avoid

The text is different for:

- Tree removal
- Stump grinding
- Emergency tree service

This helps separate informational intent from service intent and gives each service page a clearer homeowner decision purpose.

### 3. Additional styling

Adds small scoped CSS classes for the new cards:

- `.local-differentiator-card`
- `.city-action-card`

## Build status

Tested with:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

Build completed successfully in the sandbox.

## Suggested commit message

```bash
git commit -m "Strengthen city service page differentiation"
```

## Post-deploy checks

After deploying, manually inspect one page from each service type:

```bash
https://www.protreetrim.com/tree-removal-fort-lauderdale/
https://www.protreetrim.com/stump-grinding-destin/
https://www.protreetrim.com/emergency-service-lake-city/
```

Confirm the new sections appear and read naturally.

## SEO expectation

This patch is intended to improve the quality and differentiation signals on city/service pages. It will not instantly clear CNI, but it gives Google more page-level content to evaluate when these URLs are crawled again.
