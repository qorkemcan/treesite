# Packet: Editorial Sprint 2 Revisions — Package 1

Prepared: 2026-06-29

## Scope

This package revises the first eight articles audited in Editorial Sprint 2.

## Articles revised

1. `florida-tree-removal-cost-guide.md`
2. `how-much-does-it-cost-to-remove-a-large-tree-in-florida.md`
3. `oak-tree-removal-cost-in-florida-what-to-expect.md`
4. `dead-tree-removal-cost-in-florida-what-changes-the-price.md`
5. `what-happens-during-a-tree-removal-estimate-in-florida.md`
6. `how-to-compare-tree-removal-quotes-without-looking-only-at-price.md`
7. `can-a-tree-service-remove-a-tree-in-a-tight-backyard.md`
8. `when-tree-removal-needs-mats-cranes-or-special-yard-protection.md`

## Main fixes

- Removed visible web citation artifacts.
- Removed the public `Internal Links to Add` editor note.
- Replaced the retired cheapest-quote slug with current contextual links.
- Added direct service-page links to all eight articles.
- Added dated 2026 consumer pricing benchmarks to cost-intent pages.
- Clearly labeled consumer benchmarks as planning data, not provider quotes.
- Separated the role of each pricing and estimate article to reduce overlap.
- Added Florida permit and documentation boundaries.
- Strengthened utility and line-clearance language.
- Corrected the implication that mats make heavy equipment traffic over septic areas acceptable.
- Added Sunshine 811 and private-utility distinctions.
- Added clear, topic-specific CTAs.
- Updated all eight `updatedDate` fields to `2026-06-29`.

## Search-intent roles after revision

- General cost guide: broad current pricing framework and completed-job cost.
- Large-tree cost: size, canopy, target, lift/crane, and access.
- Oak cost: live-oak canopy, dense wood, local approval, and hauling.
- Dead-tree cost: brittleness, climbability, urgency, and method.
- Estimate guide: onsite workflow and homeowner preparation.
- Quote comparison: compact scope-comparison worksheet.
- Tight backyard: feasibility, route, equipment, and stump access.
- Yard protection: mats, no-drive zones, rigging, cranes, and surface limits.

## Sources used

- HomeGuide 2026 consumer cost data
- Angi 2026 consumer cost data
- OSHA tree-care and line-clearance guidance
- Florida Legislature / Florida Statute 163.045
- Florida Department of Financial Services
- Sunshine 811
- UF/IFAS

## Progress after this package is applied

- Editorial Sprint 2 articles revised: **8 / 30**
- Editorial Sprint 2 articles remaining: **22**
- Next audit group: Package 2 — crane, roof, equipment access, property protection, and stump scope

## Git workflow

The included script:

- synchronizes local `main` with `origin/main`
- permits unrelated untracked files but refuses tracked or staged edits
- verifies the expected source blobs before replacement
- creates `feature/editorial-sprint-2-revisions-1`
- applies eight revisions and this report
- runs `git diff --check`
- runs `npm run build`
- includes generated `sitemap-blog.xml` and `sitemap-index.xml`
- commits with `Revise editorial sprint 2 first priority batch`
- merges locally into `main`
- does not push

## Live verification workflow

After push, one example URL will be provided for the user to verify directly.

Ready for Editorial Sprint 2 package 1 review
