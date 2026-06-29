# Packet: Editorial Sprint 2 Revisions — Package 4

Prepared: 2026-06-29

## Scope

This final package revises candidates 25–30 and completes Editorial Sprint 2.

## Articles revised

1. `deland-oak-tree-risk-when-shade-trees-become-removal-candidates.md`
2. `macclenny-storm-damaged-trees-driveways-fences-and-rural-lots.md`
3. `glen-saint-mary-pine-and-oak-cleanup-rural-access-issues-homeowners-should-expect.md`
4. `fort-lauderdale-stump-grinding-near-pavers-pools-and-tight-side-yards.md`
5. `do-you-need-to-call-811-before-tree-planting-or-stump-grinding-in-florida.md`
6. `why-a-stump-sometimes-needs-a-second-grinding-visit.md`

## Main corrections

- Added direct local service links for DeLand, Macclenny, Glen Saint Mary, and Fort Lauderdale.
- Gave each local article a distinct role instead of repeating a generic Florida checklist.
- Added a 911/utility-first screen to the Macclenny storm article.
- Treated septic tanks and drain fields as no-drive constraints.
- Fixed the Fort Lauderdale broken/shortened stump-grinder gate slug.
- Rebuilt the Florida 811 article around the current official workflow:
  - two full business days
  - ticket number
  - member-operator positive responses
  - response verification before excavation
  - 24-inch tolerance zone from each facility's outside edges
  - narrow single-family residential 10-inch exemption
  - private-facility locating
  - remarking and damage-response steps
- Made safe-digging preparation the primary CTA in the legal article.
- Reframed the second-grinding article around callback, planned phase, changed conditions, and added scope.
- Preserved the global bordered and responsive table design introduced in Revision Package 3.
- Updated all six `updatedDate` values to `2026-06-29`.

## Official sources used

- Florida Legislature, Chapter 556 sections 556.105 and 556.108
- Sunshine 811 safe planting, positive response, tolerance-zone, and private-locator guidance
- City of DeLand tree-permitting information
- UF/IFAS hurricane, tree-risk, pruning, and root resources
- OSHA storm-cleanup and line-clearance guidance
- EPA septic-system guidance

## Editorial Sprint 2 completion

- Audited: **30 / 30**
- Revised: **30 / 30**
- Remaining: **0**
- Revision packages: **4**
- Global blog-table improvement: **completed**

## Git workflow

The included script:

- synchronizes local `main` with `origin/main`
- permits unrelated untracked files but refuses tracked or staged edits
- verifies all six source blobs before replacement
- creates `feature/editorial-sprint-2-revisions-4`
- applies six article revisions
- adds this report and the completion report
- runs `git diff --check`
- runs `npm run build`
- stages generated `sitemap-blog.xml` and `sitemap-index.xml`
- commits with `Complete editorial sprint 2 final revision batch`
- merges locally into `main`
- does not push

## Live verification after push

Recommended example:

`https://www.protreetrim.com/blog/do-you-need-to-call-811-before-tree-planting-or-stump-grinding-in-florida/`

Expected first section:

`The safe-digging workflow`

Ready for Editorial Sprint 2 final review
