# V15.1 Legacy 404 Redirect Cleanup — Fixed Installer

This package installs a root-level `vercel.json` file with permanent redirects for the legacy 404 URLs detected in Google Search Console.

## Install

```bash
rm -rf _v15_1_fix_preview
mkdir _v15_1_fix_preview
unzip -o protreetrim-v15-1-legacy-404-redirect-cleanup-fix.zip -d _v15_1_fix_preview
node _v15_1_fix_preview/protreetrim-v15-1-legacy-404-redirect-cleanup-fix/scripts/install-v15-1-legacy-404-redirect-cleanup-fix.mjs
cat vercel.json
npm run build
```

## Expected installer output

```text
✓ Installed vercel.json
✓ Redirect rules available: 26
```

## Deploy

```bash
git add vercel.json
git commit -m "Add legacy 404 redirect cleanup"
git push origin main
```

## Live redirect verification

After Vercel deployment completes, re-run the curl redirect test. The old URLs should return a permanent redirect status (typically 308 on Vercel) and a `location:` header pointing to the clean canonical destination.
