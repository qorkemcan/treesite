# Packet: Blog Category Pills Expand Collapse v1

## Files Changed

- `src/pages/blog/index.astro`
- `docs/PACKET-BLOG-CATEGORY-PILLS-EXPAND-COLLAPSE-V1-REPORT.md`

## Before

The Blog index category pill area used a capped scrollable container. The category links were usable, but the visible scrollbar made the section feel less premium and could suggest that important content was hidden inside a cramped control.

## After

The Blog index now uses a clean expand/collapse pattern:

- Default state shows a limited, useful set of category pills.
- The scrollbar is removed from the default state.
- A subtle `Show all categories` button reveals every category.
- The button changes to `Show fewer categories` when expanded.
- Collapse returns the pill area to the limited state.
- Category data and URLs are unchanged.
- Blog search, article cards, routing, and sitemap behavior are unchanged.

## Accessibility

- The toggle is a native button.
- `aria-expanded` updates between `false` and `true`.
- `aria-controls` points to the category pill container.
- Focus styling remains visible with a clear outline.
- Button text is understandable without icons.

## No-JS Fallback

The categories remain usable without JavaScript.

The collapsed class and visible toggle are only added after JavaScript runs. If JavaScript is disabled, the category container stays fully visible and the hidden toggle remains out of the interface.

## Desktop QA

Tested `/blog/` from the production build at desktop viewport.

- Default limited categories visible: PASS
- No visible scrollbar in default state: PASS
- `Show all categories` visible: PASS
- Click expands all categories: PASS
- Label changes to `Show fewer categories`: PASS
- Click collapses cleanly: PASS
- `aria-expanded` updates correctly: PASS
- No horizontal overflow: PASS
- Console errors: PASS

## Mobile QA

Tested `/blog/` at a 390px mobile viewport.

- Default state readable: PASS
- Expand/collapse works: PASS
- `aria-expanded` updates correctly: PASS
- Button remains comfortable to tap: PASS
- No horizontal overflow: PASS
- Console errors: PASS

## Build Result

- `npm run build`: PASS
- `git diff --check`: PASS

## Remaining Opportunities

- Consider adding a very subtle bottom fade in a future polish pass if visual testing shows the collapsed area needs a stronger cue.
- If category count grows significantly, consider grouping category pills by homeowner intent in a separate navigation sprint.

Ready for QA
