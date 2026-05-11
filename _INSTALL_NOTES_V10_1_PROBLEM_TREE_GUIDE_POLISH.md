# ProTreeTrim V10.1 — Florida Problem Tree Guide Polish

This patch improves the live `/tools/florida-problem-tree-guide/` tool without changing the data model or route structure.

## What changed

- Converts JavaScript-generated Service planning and Related guides links from default blue browser links into branded pill/card buttons.
- Uses Astro `:global()` selectors so dynamically generated links receive the intended styling.
- Adds a bottom follow-up CTA linking to the Florida Tree Care Advisor and dispatch call action.
- Keeps the existing guide layout, tree data, Tools menu, and sitemap behavior intact.

## Install

```bash
cp ~/Desktop/protreetrim-v10-1-problem-tree-guide-polish.zip .

rm -rf _v10_1_preview
mkdir _v10_1_preview
unzip -o protreetrim-v10-1-problem-tree-guide-polish.zip -d _v10_1_preview

node _v10_1_preview/protreetrim-v10-1-problem-tree-guide-polish/scripts/install-v10-1-problem-tree-guide-polish.mjs

npm run build
```

## Test

```bash
npm run dev
```

Open:

- `http://localhost:4321/tools/florida-problem-tree-guide/`
- Select a few tree entries and category chips.
- Confirm Service planning and Related guides links appear as branded buttons, not default blue links.
- Confirm the bottom CTA appears above the footer.

## Commit

```bash
git restore public/sitemap*.xml

git add src/components/FloridaProblemTreeGuide.astro \
  _INSTALL_NOTES_V10_1_PROBLEM_TREE_GUIDE_POLISH.md

git commit -m "Polish Florida problem tree guide UI"
git push origin main
```

## Cleanup

```bash
rm -rf _v10_1_preview
rm -f protreetrim-v10-1-problem-tree-guide-polish.zip
git status --short
```
