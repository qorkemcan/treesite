# Packet: Editorial Sprint 2 Revisions — Package 3

Prepared: 2026-06-29

## Scope

This package revises candidates 17–24 from Editorial Sprint 2 and fixes Markdown table styling across the entire blog.

## Articles revised

1. `a-tree-looks-hollow-near-the-base-what-should-a-homeowner-check-first.md`
2. `can-a-tree-rotting-at-the-base-be-saved-or-is-removal-safer.md`
3. `is-decay-at-the-base-of-an-oak-always-an-emergency-in-florida.md`
4. `what-that-dark-crack-in-a-florida-tree-trunk-may-mean.md`
5. `when-a-florida-tree-has-two-main-trunks-codominant-stem-warning-signs.md`
6. `what-is-included-bark-and-why-can-it-make-a-florida-tree-split.md`
7. `bark-beetles-in-florida-pines-when-a-brown-pine-becomes-a-removal-risk.md`
8. `can-storm-damaged-trees-fail-days-later.md`

## Site-wide table fix

The existing table CSS in `src/pages/blog/[slug].astro` used scoped selectors. Markdown-rendered `table`, `th`, and `td` elements did not receive those scoped styles.

This package converts the table selectors to global blog-prose selectors and adds:

- visible outer border
- cell dividers
- restrained green header background
- improved padding and line height
- alternating row background
- rounded outer corners
- subtle shadow
- mobile horizontal scrolling
- mobile minimum cell widths for readability

The fix applies to existing and future Markdown tables across all blog articles.

## Main editorial corrections

- Removed the public `Internal Links to Add` section from the bark-beetle article.
- Differentiated hollow-base observation from base-rot save/remove decisions.
- Made the oak page oak-specific rather than a duplicate base-decay checklist.
- Converted the trunk-crack article into a location-and-change triage guide.
- Differentiated codominant whole-tree structure from the included-bark defect.
- Added design, inspection, and maintenance boundaries for support systems.
- Separated pest diagnosis from dead-pine structural removal risk.
- Added an explicit 911/utility-first screen to delayed storm-failure content.
- Added direct tree-removal, tree-trimming, emergency-response, or stump-grinding service links as appropriate.
- Updated all eight `updatedDate` fields to `2026-06-29`.

## Official guidance used

- UF/IFAS tree risk, structural pruning, hurricane recovery, pine beetle, and root resources
- OSHA tree-care, storm cleanup, and line-clearance guidance

## Progress after application

- Sprint 2 audited: **24 / 30**
- Sprint 2 revised: **24 / 30**
- Sprint 2 remaining: **6**

## Git workflow

The included script:

- synchronizes local `main` with `origin/main`
- permits unrelated untracked files but refuses tracked or staged edits
- verifies all eight source blobs and the blog-template blob
- creates `feature/editorial-sprint-2-revisions-3`
- applies eight article revisions
- patches the global blog-table CSS
- adds this report
- runs `git diff --check`
- runs `npm run build`
- stages generated `sitemap-blog.xml` and `sitemap-index.xml`
- commits with `Revise editorial sprint 2 third priority batch`
- merges locally into `main`
- does not push

## Live verification after push

Use a revised article containing a table to verify both content and presentation:

`https://www.protreetrim.com/blog/can-a-tree-rotting-at-the-base-be-saved-or-is-removal-safer/`

Expected table heading:

`Use this decision framework`

Ready for Editorial Sprint 2 package 3 review
