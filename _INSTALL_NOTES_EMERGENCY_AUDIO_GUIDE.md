# Emergency Audio Guide Install Notes

This package adds a short MP3 audio guide to the Emergency Tree Safety Checklist page.

## Files included

- `src/components/EmergencyTreeSafetyChecklist.astro`
- `public/audio/emergency-tree-safety-checklist-audio-guide.mp3`

## Install

From the project root, copy the files into place, then run:

```bash
npm run build
git status --short
git add src/components/EmergencyTreeSafetyChecklist.astro public/audio/emergency-tree-safety-checklist-audio-guide.mp3 _INSTALL_NOTES_EMERGENCY_AUDIO_GUIDE.md
git commit -m "Add emergency checklist audio guide"
git pull --rebase origin main
git push origin main
```

## Live page to check

`/tools/emergency-tree-safety-checklist/`

The audio player uses `preload="none"` to avoid loading the MP3 until the user interacts with the player.
