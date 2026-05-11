# ProTreeTrim V8 — Florida Tree Care Advisor

## What this adds

- `/tools/florida-tree-care-advisor/`
- `src/components/FloridaTreeCareAdvisor.astro`
- `src/data/florida-tree-care-advisor.json`
- Navigation link in desktop menu, mobile menu, and footer
- Sitemap entry for the tool page

## Install from Desktop

From the repo root (`treesite-live`):

```bash
cp ~/Desktop/protreetrim-v8-tree-care-advisor.zip .
rm -rf _v8_preview
mkdir _v8_preview
unzip -o protreetrim-v8-tree-care-advisor.zip -d _v8_preview
node _v8_preview/protreetrim-v8-tree-care-advisor/scripts/install-v8-tree-care-advisor.mjs
npm run build
```

## Check locally

```bash
npm run dev
```

Open:

```txt
http://localhost:4321/tools/florida-tree-care-advisor/
```

Also check that the top menu and mobile menu include `Tools`.

## Commit

After build succeeds:

```bash
git restore public/sitemap*.xml
git status --short
git add src/data/florida-tree-care-advisor.json \
  src/components/FloridaTreeCareAdvisor.astro \
  src/pages/tools/florida-tree-care-advisor.astro \
  src/layouts/MainLayout.astro \
  generate-sitemaps.mjs \
  _INSTALL_NOTES_V8_TREE_CARE_ADVISOR.md

git commit -m "Add Florida tree care advisor tool"
git push origin main
```

## Cleanup after push

```bash
rm -rf _v8_preview
rm -f protreetrim-v8-tree-care-advisor.zip
git status --short
```

If Git shows the temporary files as tracked/deleted later, commit their removal just like we did for V7.
