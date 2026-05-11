# V10 — Florida Problem Tree Guide

This package adds a second ProTreeTrim tool:

- `/tools/` — Tools hub
- `/tools/florida-problem-tree-guide/` — Florida Problem Tree Guide

## Files added

- `src/data/florida-problem-trees.json`
- `src/components/FloridaProblemTreeGuide.astro`
- `src/pages/tools/index.astro`
- `src/pages/tools/florida-problem-tree-guide.astro`

## Files updated

- `src/layouts/MainLayout.astro`
  - Tools menu now points to `/tools/` instead of directly to the advisor.
- `generate-sitemaps.mjs`
  - Adds `/tools/` and `/tools/florida-problem-tree-guide/` to the main sitemap.

## Install

From the repo root:

```bash
cp ~/Desktop/protreetrim-v10-problem-tree-guide.zip .

rm -rf _v10_preview
mkdir _v10_preview
unzip -o protreetrim-v10-problem-tree-guide.zip -d _v10_preview

node _v10_preview/protreetrim-v10-problem-tree-guide/scripts/install-v10-problem-tree-guide.mjs

npm run build
```

## Test URLs

```txt
http://localhost:4321/tools/
http://localhost:4321/tools/florida-problem-tree-guide/
http://localhost:4321/tools/florida-tree-care-advisor/
```

## Commit

```bash
git restore public/sitemap*.xml

git add src/data/florida-problem-trees.json \
  src/components/FloridaProblemTreeGuide.astro \
  src/pages/tools/index.astro \
  src/pages/tools/florida-problem-tree-guide.astro \
  src/layouts/MainLayout.astro \
  generate-sitemaps.mjs \
  _INSTALL_NOTES_V10_PROBLEM_TREE_GUIDE.md

git commit -m "Add Florida problem tree guide tool"
git push origin main
```

## Cleanup

```bash
rm -rf _v10_preview
rm -f protreetrim-v10-problem-tree-guide.zip
git status --short
```
