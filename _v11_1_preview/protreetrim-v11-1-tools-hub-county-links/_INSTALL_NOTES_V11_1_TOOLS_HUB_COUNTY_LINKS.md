# V11.1 Tools Hub County Links

This patch improves the `/tools/` page county planning card.

## What changed

- Replaces the single “View a county hub” link that always pointed to Volusia County.
- Adds a featured county hub grid with links to:
  - Volusia County
  - Broward County
  - Palm Beach County
  - Miami-Dade County
  - Orange County
  - Walton County
  - Hillsborough County
  - Pinellas County
- Keeps the Tools Hub layout and copy otherwise unchanged.

## Install

From the repo root:

```bash
cp ~/Desktop/protreetrim-v11-1-tools-hub-county-links.zip .

rm -rf _v11_1_preview
mkdir _v11_1_preview
unzip -o protreetrim-v11-1-tools-hub-county-links.zip -d _v11_1_preview

node _v11_1_preview/protreetrim-v11-1-tools-hub-county-links/scripts/install-v11-1-tools-hub-county-links.mjs

npm run build
```

## Test

```bash
npm run dev
```

Open:

```txt
http://localhost:4321/tools/
```

Check the “Permit and risk notes by Florida county” card. It should now show multiple county hub links instead of only Volusia.

## Commit

```bash
git restore public/sitemap*.xml

git add src/pages/tools/index.astro \
  _INSTALL_NOTES_V11_1_TOOLS_HUB_COUNTY_LINKS.md

git commit -m "Improve tools hub county links"
git push origin main
```

## Cleanup

```bash
rm -rf _v11_1_preview
rm -f protreetrim-v11-1-tools-hub-county-links.zip
git status --short
```
