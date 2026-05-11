# V12 Emergency Tree Safety Checklist

This package adds a new Tools page for emergency tree safety triage.

## What it adds

- `src/components/EmergencyTreeSafetyChecklist.astro`
- `src/pages/tools/emergency-tree-safety-checklist.astro`
- Updates `src/pages/tools/index.astro` so the Tools Hub includes the new checklist card.
- Attempts to add `/tools/emergency-tree-safety-checklist/` to `generate-sitemaps.mjs`.

## New URL

```txt
/tools/emergency-tree-safety-checklist/
```

## Install

From the repo root:

```bash
cp ~/Desktop/protreetrim-v12-emergency-tree-safety-checklist.zip .

rm -rf _v12_preview
mkdir _v12_preview
unzip -o protreetrim-v12-emergency-tree-safety-checklist.zip -d _v12_preview

node _v12_preview/protreetrim-v12-emergency-tree-safety-checklist/scripts/install-v12-emergency-tree-safety-checklist.mjs

npm run build
```

## Test

```bash
npm run dev
```

Open:

```txt
http://localhost:4321/tools/
http://localhost:4321/tools/emergency-tree-safety-checklist/
http://localhost:4321/tools/florida-tree-care-advisor/
http://localhost:4321/tools/florida-problem-tree-guide/
```

Checklist behavior to verify:

- Selecting utility-line, structure, blocked-access, or newly leaning/uprooted conditions should show an Emergency result.
- Lower-risk selections should show Monitor or Priority guidance.
- Reset checklist should clear the form.
- Tools Hub should show the Emergency Tree Safety Checklist card.

## Commit

If build and live preview look good:

```bash
git restore public/sitemap*.xml

git add src/components/EmergencyTreeSafetyChecklist.astro \
  src/pages/tools/emergency-tree-safety-checklist.astro \
  src/pages/tools/index.astro \
  generate-sitemaps.mjs \
  _INSTALL_NOTES_V12_EMERGENCY_TREE_SAFETY_CHECKLIST.md

git commit -m "Add emergency tree safety checklist tool"
git push origin main
```

## Cleanup

```bash
rm -rf _v12_preview
rm -f protreetrim-v12-emergency-tree-safety-checklist.zip
git status --short
```
