# Volusia County Audio Fix

This mini package adds the Volusia County audio guide block to the dynamic county page.

## Files included

- `src/pages/county/[county].astro`

## What changed

- Imports `AudioGuideBlock`.
- Renders a Volusia-only audio guide when `countySlug === "volusia"`.
- Uses the existing audio file path:
  `/audio/volusia-county-tree-service-audio-guide.mp3`

## Install

From the project root:

```bash
cp _volusia_audio_fix_preview/src/pages/county/[county].astro 'src/pages/county/[county].astro'
npm run build
git add 'src/pages/county/[county].astro'
git commit -m "Add Volusia county audio guide"
git pull --rebase origin main
git push origin main
```

## Verify

```bash
grep -R "volusia-county-tree-service-audio-guide.mp3" -n src
curl -L https://www.protreetrim.com/county/volusia/ | grep -o '/audio/[^"]*mp3' | head
```
