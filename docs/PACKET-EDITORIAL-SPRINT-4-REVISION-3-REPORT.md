# Packet: Editorial Sprint 4 Revision — Package 3

Prepared: 2026-07-01

## Scope

This package revises Editorial Sprint 4 candidates 17–24.

## Articles revised

1. `caring-for-trees-after-a-storm-what-to-inspect-first.md`
2. `debris-cleanup-after-a-major-storm-hiring-professionals.md`
3. `do-palms-need-trimming-before-hurricane-season.md`
4. `bad-palm-pruning-in-florida-hurricane-cuts-pencil-pointing-and-hidden-costs.md`
5. `best-time-to-trim-palm-trees-florida.md`
6. `cold-snap-recovery-for-florida-palms-what-to-prune-what-to-leave-and-when-to-wait.md`
7. `common-pests-attacking-florida-oak-trees.md`
8. `citrus-greening-managing-fruit-trees-in-your-backyard.md`

## Main corrections

- Added missing H1 headings, current update dates, decision tables, official source sections, contextual internal links, phone CTA, and narrow service routes.
- Rebuilt post-storm inspection around electrical, fire, floodwater, structure-loading, hanging-wood, root-plate, and active-movement exclusions.
- Separated settled vegetative debris from active tree failure, utility responsibility, municipal pickup, structure-loaded wood, building debris, hauling, and stump work.
- Gave the three overlapping palm-pruning pages distinct roles:
  - hurricane-season palm page = pre-storm selective maintenance and whole-palm risk
  - bad-pruning page = harmful patterns, exclusions, and phased correction
  - best-time page = calendar and condition timing hub
- Rebuilt cold-snap recovery around additional-cold risk, spear condition, treatment limits, staged pruning, and structural removal triggers.
- Rebuilt oak-pest content around identification, symptom classes, host and site context, treatment thresholds, beneficial insects, pesticide labels, and licensing boundaries.
- Removed every visible `turn...` citation artifact from the Citrus Greening article.
- Rebuilt Citrus Greening around HLB-versus-nutrient symptom comparison, UF/IFAS Extension routing, management-versus-cure boundaries, psyllid control rules, and physical removal scope.
- Preserved the global bordered and responsive blog table style.

## Primary guidance used

- UF/IFAS hurricane recovery and cleanup publications.
- UF/IFAS palm pruning and cold-damage guidance.
- UF/IFAS oak-gall and insect resources.
- UF/IFAS citrus greening, nutrient-differentiation, home-landscape, and Extension resources.
- U.S. EPA pesticide-label guidance.
- Florida Department of Agriculture and Consumer Services pesticide-licensing guidance.
- OSHA tree-care safety guidance.
- FEMA debris-removal guidance.

## Completion after application

- Sprint 4 audited: **24 / 30**
- Sprint 4 revised: **24 / 30**
- Sprint 4 remaining: **6**
- Total unique site articles revised: **114**
- Global blog table style: **preserved**
- Public citation artifacts in this package: **removed**

## Git workflow

The included script:

- synchronizes local `main` with `origin/main`
- permits unrelated untracked files but refuses tracked or staged edits
- verifies all eight current article blobs
- creates `feature/editorial-sprint-4-revisions-3`
- applies eight article revisions
- adds this report
- runs `git diff --check`
- runs `npm run build`
- stages generated sitemap changes
- commits with `Revise editorial sprint 4 third priority batch`
- merges locally into `main`
- does not push

## Live verification after push

Recommended example:

`https://www.protreetrim.com/blog/citrus-greening-managing-fruit-trees-in-your-backyard/`

Expected first table heading:

`Use this symptom-comparison table`

No `turn...` citation codes should appear on the page.

Ready for Editorial Sprint 4 final audit package
