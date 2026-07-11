# Phase C Sprint 1 — Emergency Hub Links Report

## Status

Completed locally. Not committed. Not pushed.

## Scope

Phase C Sprint 1 is the first Cluster Linking pilot after Phase B closure.

This sprint intentionally focuses only on the Emergency & Active Hazards cluster.

No layout, sitemap, metadata, county routing, service-page routing, component, script, or generated-content changes were planned.

## Product HQ Rationale

The Knowledge Network Blueprint v1 identifies Emergency & Active Hazards as the largest and highest-intent cluster.

The suggested emergency hub is:

- `when-does-a-tree-problem-become-an-emergency-tree-service-call.md`

The hub existed but had only one internal link before this sprint. The selected supporting articles did not link back to the hub.

## Files Changed

Hub:

- `src/content/blog/when-does-a-tree-problem-become-an-emergency-tree-service-call.md`

Supporting articles:

- `src/content/blog/same-day-tree-removal-when-it-is-realistic-and-when-it-is-not.md`
- `src/content/blog/what-to-do-when-a-tree-falls-on-your-roof-in-florida.md`
- `src/content/blog/what-to-do-if-a-tree-blocks-the-road-or-sidewalk-near-your-property.md`
- `src/content/blog/what-to-do-if-a-tree-falls-on-a-fence-pool-cage-or-shed.md`
- `src/content/blog/what-to-do-if-a-tree-is-touching-power-lines-after-a-storm.md`
- `src/content/blog/what-to-photograph-before-emergency-tree-cleanup-for-insurance.md`

## Link Changes

The hub now links to six emergency supporting guides:

- tree falling on a roof
- tree touching power lines
- blocked road or sidewalk access
- fence, pool cage, or shed damage
- same-day tree removal timing
- insurance photo documentation

Each supporting article now links back to the emergency hub.

## QA

- Expected changed file set check: passed
- `git diff --check`: passed
- Hub outbound link check: passed
- Supporting article backlink check: passed
- Target file existence check: passed
- `npm run build`: passed

## Product HQ Notes

This sprint created a controlled hub path rather than adding scattered links.

No new service routes were added in this sprint.

No county links were added in this sprint.

No bulk automation was used.

## Next Step

Review local diff, then commit and open a PR after Product HQ approval.
