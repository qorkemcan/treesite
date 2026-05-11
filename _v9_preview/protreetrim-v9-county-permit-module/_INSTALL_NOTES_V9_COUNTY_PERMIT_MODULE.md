# ProTreeTrim V9 — County Permit & Risk Documentation Module

## What this package changes

Adds a safer county-level permit/risk documentation module and removes overly absolute legal language from county pages.

### Added

- `src/data/county-permits.json`
  - Safe fallback permit language for all counties.
  - Enhanced local context for 20 priority Florida counties.
  - Source label, source URL, last-reviewed date, and risk note fields.

### Updated

- `src/pages/county/[county].astro`
  - Imports county permit data.
  - Replaces overly certain “Legal Framework” copy with safer “Permit & risk documentation notes.”
  - Softens dispatch/provider language.
  - Keeps the county hub, city/service links, and existing design intact.

## Install

From the repo root:

```bash
cp ~/Desktop/protreetrim-v9-county-permit-module.zip .

rm -rf _v9_preview
mkdir _v9_preview
unzip -o protreetrim-v9-county-permit-module.zip -d _v9_preview

node _v9_preview/protreetrim-v9-county-permit-module/scripts/install-v9-county-permit-module.mjs

npm run build
```

## Local test

```bash
npm run dev
```

Open:

```txt
http://localhost:4321/county/volusia/
http://localhost:4321/county/broward/
http://localhost:4321/county/baker/
```

Check:

- The old “Legal Framework” language is gone.
- The new “Permit & risk documentation notes” section appears near the lower part of the county page.
- Volusia/Broward/Baker show county-specific context.
- Any county not in the JSON priority set uses safe fallback language.

## Commit

After build and visual check:

```bash
git restore public/sitemap*.xml

git add src/data/county-permits.json \
  src/pages/county/[county].astro \
  _INSTALL_NOTES_V9_COUNTY_PERMIT_MODULE.md

git commit -m "Add county permit risk notes"
git push origin main
```

## Cleanup

```bash
rm -rf _v9_preview
rm -f protreetrim-v9-county-permit-module.zip
git status --short
```

If Git shows deleted temporary files after cleanup, commit that cleanup separately:

```bash
git add -u _v9_preview protreetrim-v9-county-permit-module.zip
git commit -m "Remove temporary V9 install files"
git push origin main
```

## Notes

This module intentionally avoids definitive legal advice. The copy uses cautious language such as “may vary,” “verify current local requirements,” and “professional assessment may be needed.”
