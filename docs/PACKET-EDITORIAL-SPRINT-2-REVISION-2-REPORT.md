# Packet: Editorial Sprint 2 Revisions — Package 2

Prepared: 2026-06-29

## Scope

This package revises candidates 9–16 from Editorial Sprint 2.

## Articles revised

1. `can-a-tree-be-too-close-to-remove-safely-without-a-crane.md`
2. `why-tree-removal-over-a-roof-needs-a-different-plan-in-florida.md`
3. `why-crane-setup-space-can-change-a-tree-removal-quote-in-florida.md`
4. `can-heavy-tree-equipment-leave-ruts-in-a-florida-yard.md`
5. `how-tree-crews-protect-driveways-lawns-and-pool-decks-during-removal.md`
6. `can-a-stump-grinder-fit-through-a-backyard-gate-access-issues-homeowners-miss.md`
7. `what-makes-stump-grinding-harder-than-it-looks.md`
8. `how-deep-should-a-stump-be-ground-in-a-florida-yard.md`

## Main corrections

- Removed the universal, unsourced `6–12 inch` stump-depth promise.
- Reframed stump depth as an end-use specification.
- Fixed the shortened/broken stump-grinder gate link.
- Added direct `/services/tree-removal/` or `/services/stump-grinding/` links to every article.
- Separated crane-method selection from crane setup geometry.
- Separated roof-load removal from general crane and property-protection content.
- Separated rutting/compaction from the broader property-protection plan.
- Treated septic tanks and drain fields as no-drive constraints.
- Added OSHA line-clearance and crane-setup boundaries.
- Added Sunshine 811 and private-facility distinctions.
- Added clear result-based stump scopes for lawn, mulch, replanting, and hardscape.
- Updated all eight `updatedDate` fields to `2026-06-29`.

## Search-intent roles after revision

- Crane decision: which removal method fits the tree and targets.
- Roof removal: controlling tree loads above or on a roof.
- Crane setup: support, reach, pick path, landing zone, and public area.
- Rut risk: moisture, route, compaction, delay, and restoration.
- Property protection: access, landing, processing, and no-drive zones.
- Grinder gate access: provider-machine dimensions and route measurements.
- Stump complexity: hidden material, root flare, species, utilities, and chips.
- Stump depth: final-use specification instead of a universal depth.

## Official guidance used

- OSHA tree-care, line-clearance, and crane safety resources
- EPA septic-system guidance
- Sunshine 811 safe-digging and private-utility guidance
- UF/IFAS tree, root, risk, and project-specification resources
- Florida Department of Financial Services storm documentation guidance

## Progress after application

- Sprint 2 audited: **16 / 30**
- Sprint 2 revised: **16 / 30**
- Sprint 2 revision candidates remaining: **14**

## Git workflow

The included script:

- synchronizes local `main` with `origin/main`
- permits unrelated untracked files but refuses tracked or staged edits
- verifies the expected source blobs before replacement
- creates `feature/editorial-sprint-2-revisions-2`
- applies eight revisions and this report
- runs `git diff --check`
- runs `npm run build`
- includes generated `sitemap-blog.xml` and `sitemap-index.xml`
- commits with `Revise editorial sprint 2 second priority batch`
- merges locally into `main`
- does not push

## Live verification workflow

After push, one example URL will be supplied for direct verification.

Ready for Editorial Sprint 2 package 2 review
