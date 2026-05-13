# V15 — Mobile Performance & Accessibility Optimization Pass

## Scope
This package applies a controlled homepage/layout optimization pass based on the May 13, 2026 mobile PageSpeed snapshot.

### Updated files
- `src/layouts/MainLayout.astro`
- `src/pages/index.astro`

### What changed
1. Added a proper `<main>` landmark to the homepage.
2. Corrected homepage heading structure by removing non-semantic heading use in stat cards and promoting hub-card headings to the correct level.
3. Added an accessible name to the homepage city search input.
4. Kept county accordion `aria-expanded` values synchronized with open/closed state.
5. Added accessible labels to the mobile call icon and mobile menu button.
6. Switched Google Fonts stylesheet loading to a non-blocking preload pattern with a `<noscript>` fallback.
7. Added a stronger system-font fallback stack while Inter loads.
8. Reworked the sticky CTA pulse animation to animate only `transform`, avoiding the previous box-shadow animation.
9. Added `prefers-reduced-motion` handling for the sticky CTA animation and smooth scrolling.
10. Strengthened low-contrast small homepage link colors where risk was most obvious.

## Installation
From the root of the ProTreeTrim repo:

```bash
rm -rf _v15_preview
mkdir _v15_preview
unzip -o protreetrim-v15-mobile-performance-accessibility-pass.zip -d _v15_preview
node _v15_preview/protreetrim-v15-mobile-performance-accessibility-pass/scripts/install-v15-mobile-performance-accessibility-pass.mjs
npm run build
```

## Suggested local QA
Run:

```bash
npm run dev
```

Then review:
- `http://localhost:4321/`
- Hero and sticky CTA visual consistency
- Major Service Hubs cards
- County expand/collapse behavior
- City search filtering behavior
- Mobile menu icon and mobile call icon

## Post-deploy validation
After deployment, re-run mobile PageSpeed on the homepage.
The code-side intent is to reduce or remove the following previously observed issues where applicable:
- Missing main landmark
- Heading order warning
- Non-composited animation warning from the sticky CTA
- Render-blocking font stylesheet impact
- Some low-contrast small link cases on the homepage

PageSpeed scores can still vary from run to run and can be affected by third-party resources, device emulation, network throttling, and Google Tag Manager.
