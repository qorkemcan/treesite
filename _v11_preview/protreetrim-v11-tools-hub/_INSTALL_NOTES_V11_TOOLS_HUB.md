# V11 Tools Hub

## What changed

This update strengthens `/tools/` into a clearer Florida Tree Care Tools hub.

It adds:

- stronger hero copy and primary CTAs
- active tool cards for Florida Tree Care Advisor and Florida Problem Tree Guide
- related planning paths for county permit notes and emergency response
- a quick pre-call information checklist
- polished card styling consistent with the newer tool pages

## Install

```bash
cp ~/Desktop/protreetrim-v11-tools-hub.zip .

rm -rf _v11_preview
mkdir _v11_preview
unzip -o protreetrim-v11-tools-hub.zip -d _v11_preview

node _v11_preview/protreetrim-v11-tools-hub/scripts/install-v11-tools-hub.mjs

npm run build
```

## Test

```bash
npm run dev
```

Open:

```txt
http://localhost:4321/tools/
http://localhost:4321/tools/florida-tree-care-advisor/
http://localhost:4321/tools/florida-problem-tree-guide/
```

## Commit

```bash
git restore public/sitemap*.xml

git add src/pages/tools/index.astro \
  _INSTALL_NOTES_V11_TOOLS_HUB.md

git commit -m "Improve Florida tree care tools hub"
git push origin main
```

## Cleanup

```bash
rm -rf _v11_preview
rm -f protreetrim-v11-tools-hub.zip
git status --short
```
