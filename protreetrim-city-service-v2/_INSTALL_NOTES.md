# ProTreeTrim City / Service Quality Fix v2

## What changed

This package updates `src/pages/[slug].astro` to make programmatic city/service pages more distinct from one another.

Key changes:

1. Tree removal, stump grinding, and emergency service pages now have different search-intent structures.
2. Each service type has its own hero copy, decision guide, process steps, site-review cards, FAQ framing, and long-form support copy.
3. Generic fallback copy is now service-specific instead of one shared generic city template.
4. Risky or overclaiming title language such as `#1`, `Top Rated`, and `Licensed & Insured` was removed from dynamic title templates.
5. Internal city/service links now use trailing slashes to match the canonical URL standard.
6. Fake operational metrics were removed from the city/service template and replaced with safer planning/coordination language.
7. City CSV descriptions are now surfaced as local context, adding more location-specific uniqueness to each page.

## How to install

From the repo root:

```bash
unzip -o protreetrim-city-service-v2.zip
rsync -av protreetrim-city-service-v2/ ./
npm run build
```

If build succeeds:

```bash
git status
git diff --stat
git add src/pages/[slug].astro
git commit -m "Improve city service page differentiation"
git push origin seo-technical-fix-v1-1
```

Then merge/deploy as usual.

## Important note

Your input zip did not include `src/pages/[slug].astro`, most likely because shell treated `[slug]` as a glob pattern. For future zips, quote bracket paths like this:

```bash
cp 'src/pages/[slug].astro' protreetrim-city-service-v2-input/src/pages/
```

I used the latest Repomix file from the current repo state as the source for this v2 update.

## Pages to test after deploy

```txt
https://www.protreetrim.com/tree-removal-deland/
https://www.protreetrim.com/stump-grinding-deland/
https://www.protreetrim.com/emergency-service-deland/
https://www.protreetrim.com/tree-removal-tallahassee/
https://www.protreetrim.com/stump-grinding-tallahassee/
https://www.protreetrim.com/emergency-service-tallahassee/
```

Compare the three Deland pages side by side. The structure and intent should now feel meaningfully different.
