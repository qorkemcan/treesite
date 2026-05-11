# V11.2 Tools Hub Compact County Links

This small polish patch keeps the multi-county hub links on `/tools/`, but makes the county buttons more compact.

## What changed

- Reduces county button height, padding, border radius, and font size.
- Reduces the gap between county buttons.
- Keeps all existing county links and the Tools Hub layout.

## Install

From the repo root:

```bash
cp ~/Desktop/protreetrim-v11-2-tools-hub-compact-county-links.zip .

rm -rf _v11_2_preview
mkdir _v11_2_preview
unzip -o protreetrim-v11-2-tools-hub-compact-county-links.zip -d _v11_2_preview

node _v11_2_preview/protreetrim-v11-2-tools-hub-compact-county-links/scripts/install-v11-2-tools-hub-compact-county-links.mjs

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

Check the county buttons inside the “Permit and risk notes by Florida county” card. They should feel less oversized.

## Commit

```bash
git restore public/sitemap*.xml

git add src/pages/tools/index.astro \
  _INSTALL_NOTES_V11_2_TOOLS_HUB_COMPACT_COUNTY_LINKS.md

git commit -m "Compact tools hub county links"
git push origin main
```

## Cleanup

```bash
rm -rf _v11_2_preview
rm -f protreetrim-v11-2-tools-hub-compact-county-links.zip
git status --short
```
