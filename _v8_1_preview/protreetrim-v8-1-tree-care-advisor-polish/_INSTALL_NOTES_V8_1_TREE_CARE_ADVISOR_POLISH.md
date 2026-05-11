# V8.1 Tree Care Advisor UI Polish

This small polish package keeps the sticky quote CTA in place while improving the tool page around it.

## What changes

- Keeps the existing sticky quote CTA behavior.
- Adds more bottom spacing so tool content has room around the sticky CTA.
- Converts dynamically rendered related guide links into professional card-style links.
- Adds a practical "Before calling, note" checklist to the left panel.
- Replaces the plain zone/concern pill row with clearer Area profile / Primary concern cards.
- Adds Astro `:global()` styles for JavaScript-rendered result content so the live page does not show raw blue browser links.

## Install from Desktop

From the repository root:

```bash
cp ~/Desktop/protreetrim-v8-1-tree-care-advisor-polish.zip .

rm -rf _v8_1_preview
mkdir _v8_1_preview
unzip -o protreetrim-v8-1-tree-care-advisor-polish.zip -d _v8_1_preview

node _v8_1_preview/protreetrim-v8-1-tree-care-advisor-polish/scripts/install-v8-1-tree-care-advisor-polish.mjs

npm run build
```

## Test

```bash
npm run dev
```

Open:

```txt
http://localhost:4321/tools/florida-tree-care-advisor/
```

Check:

- Related guide links look like cards, not raw blue links.
- Sticky CTA remains visible.
- Page has enough bottom room to read the final content.
- Tool result updates when the dropdown selections change and the button is pressed.

## Commit

```bash
git restore public/sitemap*.xml

git add src/components/FloridaTreeCareAdvisor.astro \
  src/pages/tools/florida-tree-care-advisor.astro \
  _INSTALL_NOTES_V8_1_TREE_CARE_ADVISOR_POLISH.md

git commit -m "Polish Florida tree care advisor UI"
git push origin main
```

## Cleanup after push

```bash
rm -rf _v8_1_preview
rm -f protreetrim-v8-1-tree-care-advisor-polish.zip

git status --short
```

If Git shows deleted temporary files after cleanup, run:

```bash
git add -u _v8_1_preview protreetrim-v8-1-tree-care-advisor-polish.zip
git commit -m "Remove temporary V8.1 install files"
git push origin main
```
