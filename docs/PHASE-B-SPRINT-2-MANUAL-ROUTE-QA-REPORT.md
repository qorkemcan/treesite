# Phase B Sprint 2 — Manual Route QA Report

## Scope

This sprint handled only the remaining Phase B manual QA set after Sprint 1.

No bulk automation was used.
No cluster, service page, layout, or unrelated blog changes were made.

## Starting Point

Remaining unique files reviewed: 4

### Zero internal Markdown link files before Sprint 2

- `src/content/blog/should-you-fertilize-a-stressed-tree-in-florida-or-could-that-make-it-worse.md`
- `src/content/blog/white-spots-on-palm-leaves-in-florida-scale-fungus-or-nutrient-issue.md`
- `src/content/blog/why-are-my-oak-tree-leaves-turning-brown-in-florida.md`

### Zero audited route files before Sprint 2

- `src/content/blog/glen-saint-mary-pine-and-oak-cleanup-rural-access-issues-homeowners-should-expect.md`
- `src/content/blog/should-you-fertilize-a-stressed-tree-in-florida-or-could-that-make-it-worse.md`
- `src/content/blog/white-spots-on-palm-leaves-in-florida-scale-fungus-or-nutrient-issue.md`
- `src/content/blog/why-are-my-oak-tree-leaves-turning-brown-in-florida.md`

## Product HQ Rule Applied

No internal link was forced.

If a page did not naturally fit a core service page, it was left as Intentional No Link.

## File Decisions

### 1. Glen Saint Mary Pine and Oak Cleanup

File:

`src/content/blog/glen-saint-mary-pine-and-oak-cleanup-rural-access-issues-homeowners-should-expect.md`

Decision:

Intentional No Core Link

Reason:

The page already contains local route links for Glen Saint Mary tree removal, stump grinding, and emergency tree service. Adding a generic `/services/` link would be redundant and forced.

Change:

No edit.

### 2. Should You Fertilize a Stressed Tree in Florida?

File:

`src/content/blog/should-you-fertilize-a-stressed-tree-in-florida-or-could-that-make-it-worse.md`

Decision:

Add one contextual `/trust-safety/` link.

Reason:

The article is not a direct service-intent article, but it repeatedly frames the issue as a safety/risk decision before fertilization. A trust/safety link is natural in the professional inspection section.

Added sentence:

`If the concern has shifted from nutrition to safety, use ProTreeTrim's [trust and safety](/trust-safety/) guidance to frame the next conversation before approving pruning, monitoring, or removal work.`

### 3. White Spots on Palm Leaves in Florida

File:

`src/content/blog/white-spots-on-palm-leaves-in-florida-scale-fungus-or-nutrient-issue.md`

Decision:

Add one contextual `/services/tree-removal/` link.

Reason:

The article has a natural "When Removal May Be Safer" section. The link appears only where palm decline has shifted from plant-health concern to property-risk/removal decision.

Added sentence:

`If the palm itself is becoming the risk rather than just the fronds, review [tree removal](/services/tree-removal/) expectations before treating the issue as routine trimming or cosmetic care.`

### 4. Why Are My Oak Tree Leaves Turning Brown in Florida?

File:

`src/content/blog/why-are-my-oak-tree-leaves-turning-brown-in-florida.md`

Decision:

Add one contextual `/services/tree-removal/` link.

Reason:

The article has a natural "Should the Oak Be Removed?" section. The link is framed around structure, targets, access, and cleanup rather than leaf color alone.

Added sentence:

`When removal becomes part of the discussion, compare the situation with [tree removal](/services/tree-removal/) expectations so the decision is based on structure, targets, access, and cleanup—not leaf color alone.`

## Files Changed

3 blog Markdown files changed.

## Intentional No Link

1 file intentionally left without a core audited route link:

- `src/content/blog/glen-saint-mary-pine-and-oak-cleanup-rural-access-issues-homeowners-should-expect.md`

## QA

- `git diff --check`: passed
- `node scripts/audit-money-page-routing.mjs`: run
- `npm run build`: passed

## Notes

Sprint 2 was intentionally small and manual.
Phase B should return to Product HQ before Phase C begins.
