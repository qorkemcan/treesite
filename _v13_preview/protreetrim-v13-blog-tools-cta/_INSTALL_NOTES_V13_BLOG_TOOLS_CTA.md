# V13 — Blog Tools CTA Blocks

This package adds a contextual ProTreeTrim tools CTA block inside every blog article.

## What it adds

- `src/components/BlogToolsCTA.astro`
- Updates `src/pages/blog/[slug].astro`

The CTA automatically changes based on the blog topic:

- Storm, emergency, leaning, cracked, uprooted, roof, power-line, wind, or hurricane topics → Emergency Tree Safety Checklist + Call Dispatch
- Permit, HOA, statute, neighbor, liability, insurance, easement, or documentation topics → Tools Hub / Tree Care Advisor
- Invasive, pest, disease, fungus, rot, Brazilian pepper, melaleuca, ficus, etc. → Florida Problem Tree Guide
- Stump, roots, driveway, pool, pavers, palm, trimming, pruning, access, estimate, quote, etc. → Florida Tree Care Advisor
- Default → Tree Care Advisor + Problem Tree Guide

## Install

From the repo root:

```bash
cp ~/Desktop/protreetrim-v13-blog-tools-cta.zip .

rm -rf _v13_preview
mkdir _v13_preview
unzip -o protreetrim-v13-blog-tools-cta.zip -d _v13_preview

node _v13_preview/protreetrim-v13-blog-tools-cta/scripts/install-v13-blog-tools-cta.mjs

npm run build
```

## Local test

```bash
npm run dev
```

Check a few blog types:

- `/blog/emergency-tree-removal-florida/`
- `/blog/florida-tree-removal-permit-guide/`
- `/blog/native-florida-trees-vs-invasive-species-what-to-know/`
- `/blog/stump-grinding-vs-removal-which-is-best-for-your-property/`

## Commit

```bash
git restore public/sitemap*.xml

git add src/components/BlogToolsCTA.astro \
  src/pages/blog/[slug].astro \
  _INSTALL_NOTES_V13_BLOG_TOOLS_CTA.md

git commit -m "Add blog tools CTA blocks"
git push origin main
```

## Cleanup

```bash
rm -rf _v13_preview
rm -f protreetrim-v13-blog-tools-cta.zip
git status --short
```
