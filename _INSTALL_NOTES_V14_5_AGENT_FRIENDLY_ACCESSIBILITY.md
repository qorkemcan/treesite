# V14.5 — Agent-Friendly UX & Accessibility Cleanup

## Purpose
This package adds a safe accessibility and agent-readability cleanup to ProTreeTrim without changing the site architecture, page URLs, SEO strategy, or visual design intent.

The goal is not to chase experimental MCP/API/agent-commerce scores. The goal is to make existing navigation, CTA links, forms, and tools easier for users, Googlebot, accessibility tools, and future AI agents to understand.

## Files included

- `src/layouts/MainLayout.astro`
- `src/components/FloridaTreeCareAdvisor.astro`
- `src/components/FloridaProblemTreeGuide.astro`
- `src/components/EmergencyTreeSafetyChecklist.astro`
- `src/components/BlogToolsCTA.astro`
- `src/pages/contact.astro`
- `src/pages/join-network.astro`

## What changed

### Main layout
- Added a keyboard-accessible “Skip to main content” link.
- Added primary navigation and footer navigation labels.
- Added a stable `#main-content` wrapper for skip-link targeting.
- Improved logo and decorative icon accessibility.
- Added clearer call CTA labels for desktop, mobile, and sticky call buttons.
- Added mobile menu state handling with `aria-expanded`, `aria-hidden`, Escape-key close, and focus return.

### Tools and CTA components
- Added accessible labels/relationships to the Florida Tree Care Advisor.
- Added accessible labels and active states to the Problem Tree Guide category buttons.
- Added `aria-atomic` to dynamic result regions so updated guidance is announced more cleanly.
- Added clearer labels to dynamically generated guide/service links.
- Added clearer labels to emergency checklist actions and reset behavior.
- Added descriptive labels to blog tools CTA links.

### Forms
- Added explicit form labels, IDs, autocomplete hints, and submit labels on Contact and Join Network forms.
- Added a descriptive map iframe title on the Contact page.

## Install steps

From the ZIP root, copy the included `src` files into your project root, replacing the existing files.

Then run:

```bash
npm run build
```

If the build passes, commit and push:

```bash
git add \
  src/layouts/MainLayout.astro \
  src/components/FloridaTreeCareAdvisor.astro \
  src/components/FloridaProblemTreeGuide.astro \
  src/components/EmergencyTreeSafetyChecklist.astro \
  src/components/BlogToolsCTA.astro \
  src/pages/contact.astro \
  src/pages/join-network.astro \
  _INSTALL_NOTES_V14_5_AGENT_FRIENDLY_ACCESSIBILITY.md

git commit -m "Add agent-friendly accessibility cleanup"
git push origin main
```

## Verification performed

- `npm ci --ignore-scripts --no-audit --no-fund`
- `npm run build`

The production build completed successfully in the test environment.

## Notes

This package intentionally does **not** add MCP, OAuth discovery, API catalogs, Markdown negotiation, payment protocols, or experimental agent-commerce metadata. Those are not necessary for ProTreeTrim’s current content/resource/dispatch model.
