# ProTreeTrim Audio Guides Batch 1

This package adds short audio guide players to selected high-intent ProTreeTrim pages.

## Pages updated

- `/tools/florida-tree-care-advisor/`
- `/tools/florida-problem-tree-guide/`
- `/services/emergency-response/`
- `/services/tree-removal/`
- `/services/stump-grinding/`
- `/county/volusia/`

Note: the current repo uses the service page paths above. If you later add shortcut redirects such as `/emergency-tree-service-florida/`, `/tree-removal-service-florida/`, or `/stump-grinding-service-florida/`, these audio guides will still live on the canonical service pages unless those pages are aliased or redirected.

## Files added

- `src/components/AudioGuideBlock.astro`
- `public/audio/florida-tree-care-advisor-audio-guide.mp3`
- `public/audio/florida-problem-tree-guide-audio-guide.mp3`
- `public/audio/emergency-tree-service-florida-audio-guide.mp3`
- `public/audio/tree-removal-service-florida-audio-guide.mp3`
- `public/audio/stump-grinding-service-florida-audio-guide.mp3`
- `public/audio/volusia-county-tree-service-audio-guide.mp3`

## Important performance note

The audio elements use `preload="none"` inside the shared component. This means the browser should not download the MP3 files until the visitor chooses to play them.

## Install

From the project root:

```bash
cp ~/Desktop/protreetrim-audio-guides-batch-1-install.zip .

rm -rf _audio_batch_1_preview
mkdir _audio_batch_1_preview
unzip -o protreetrim-audio-guides-batch-1-install.zip -d _audio_batch_1_preview

mkdir -p public/audio

cp _audio_batch_1_preview/src/components/AudioGuideBlock.astro src/components/
cp _audio_batch_1_preview/src/pages/tools/florida-tree-care-advisor.astro src/pages/tools/
cp _audio_batch_1_preview/src/pages/tools/florida-problem-tree-guide.astro src/pages/tools/
cp _audio_batch_1_preview/src/pages/services/emergency-response.astro src/pages/services/
cp _audio_batch_1_preview/src/pages/services/tree-removal.astro src/pages/services/
cp _audio_batch_1_preview/src/pages/services/stump-grinding.astro src/pages/services/
cp _audio_batch_1_preview/src/pages/county/[county].astro src/pages/county/
cp _audio_batch_1_preview/public/audio/*.mp3 public/audio/
cp _audio_batch_1_preview/_INSTALL_NOTES_AUDIO_GUIDES_BATCH_1.md .

npm run build
```

If the build passes:

```bash
git add src/components/AudioGuideBlock.astro \
  src/pages/tools/florida-tree-care-advisor.astro \
  src/pages/tools/florida-problem-tree-guide.astro \
  src/pages/services/emergency-response.astro \
  src/pages/services/tree-removal.astro \
  src/pages/services/stump-grinding.astro \
  src/pages/county/[county].astro \
  public/audio/*.mp3 \
  _INSTALL_NOTES_AUDIO_GUIDES_BATCH_1.md

git commit -m "Add audio guides to key service pages"

git pull --rebase origin main

git push origin main
```

After successful push, clean temporary files:

```bash
rm -rf _audio_batch_1_preview protreetrim-audio-guides-batch-1-install.zip
```

## Live QA

After Vercel deploy, check:

- `/tools/florida-tree-care-advisor/`
- `/tools/florida-problem-tree-guide/`
- `/services/emergency-response/`
- `/services/tree-removal/`
- `/services/stump-grinding/`
- `/county/volusia/`

Each page should show a compact audio guide block. The player may show `0:00 / 0:00` before playback metadata loads; that is normal with `preload="none"`.
