# Packet: Editorial Sprint 1 — Revision Batch 1

## Objective

Revise the eight priority articles identified in the Editorial Sprint 1 audit without changing slugs, categories, publication dates, routes, schemas, layouts, or UI code.

## Scope Completed

- **Articles revised:** 8
- **Editorial approach:** one clear search/decision intent per page; natural US English; tighter structure; contextual internal links; stage-matched CTA; current authoritative source review.
- **Frontmatter:** original titles, slugs/filenames, categories, tags, authors, and `pubDate` values retained.
- **Freshness:** `updatedDate` set to `2026-06-28` on all eight files.
- **Publishing hygiene:** all visible `Internal Links to Add` notes removed; the retired low-quote slug was removed.

## Revised Files

| Article | Previous audit score | Revision focus | Words | Contextual internal links |
|---|---:|---|---:|---:|
| What Should Be in a Written Tree Removal Estimate? | 78 | Rebuilt around a 10-field estimate framework plus a sample scope. | 1,607 | 6 |
| The Cost of Waiting Too Long to Remove a Dangerous Tree in Florida | 80 | Added emergency/prompt/scheduled triage and a non-alarmist cost-of-delay framework. | 1,411 | 4 |
| How Close Can a Tree Be to a House Before Removal Is the Safer Option? | 81 | Repositioned as the removal decision companion to the broader distance guide. | 1,456 | 4 |
| Emergency Tree Service Costs: Why They Differ from Standard Rates | 82 | Added six pricing factors and a four-part emergency quote comparison. | 1,381 | 3 |
| Questions to Ask Before Hiring a Tree Removal Service in Florida | 82 | Reduced the overexpanded list to ten high-value hiring questions. | 1,350 | 4 |
| Why the Cheapest Tree Removal Quote Can Become the Most Expensive | 83 | Differentiated as the warning guide; removed checklist duplication. | 1,271 | 5 |
| Low Tree Removal Quote Checklist: What Florida Homeowners Should Confirm Before Saying Yes | 84 | Converted into a concise 12-point decision checklist and scorecard. | 1,288 | 4 |
| Palm Leaves Turning Yellow in Florida: Nutrients, Water Stress, or Removal Warning? | 84 | Separated care, diagnosis, and structural-removal pathways. | 1,442 | 2 |

## Cluster Differentiation

- **Written estimate guide:** defines the anatomy of a complete written scope.
- **Cheapest quote warning guide:** explains how hidden or transferred cost develops.
- **Low-quote checklist:** functions as a quick accept/clarify/walk-away tool.
- **Hiring questions guide:** covers provider responsibility and pre-hire verification.
- **Emergency cost guide:** explains the components of urgent pricing without publishing unreliable price ranges.
- **Dangerous-delay guide:** helps readers choose emergency response, prompt assessment, or scheduled monitoring.
- **Near-house removal guide:** focuses on when proximity plus condition makes removal the safer long-term choice.
- **Yellow-palm guide:** routes care questions toward diagnosis while reserving removal language for structural warning signs.

## CTA and Trust Changes

- All eight articles now contain a direct, context-specific CTA.
- Emergency CTAs put utilities or emergency authorities ahead of tree-service dispatch when electrical or immediate life-safety hazards exist.
- Palm-health language distinguishes diagnosis by an arborist, plant-health professional, or Extension resource from trimming/removal dispatch.
- ProTreeTrim is described as a referral/dispatch network that connects homeowners with independently owned local providers; it is not presented as the field contractor.

## Source Review

The revisions use current official material from OSHA, the Florida Legislature, the Florida Division of Workers' Compensation, the Florida Division of Corporations, and UF/IFAS. Claims were narrowed where a provider, insurer, utility, jurisdiction, arborist, or plant-health professional must make the final determination.

## QA Results

- All eight Markdown files contain valid YAML frontmatter.
- Required frontmatter fields are present.
- Original filenames/slugs were retained.
- All eight `updatedDate` values are `2026-06-28`.
- No `Internal Links to Add` publishing notes remain.
- No retired `why-the-cheapest-tree-removal-quote-can-become-expensive` link remains.
- Every article includes the ProTreeTrim phone CTA and at least two contextual internal links.
- Internal service links use current routes: `/services/tree-removal/`, `/services/stump-grinding/`, and `/services/emergency-response/`.
- `git diff --check` is included in the local apply workflow.
- Local apply workflow runs `npx astro build` because article pages changed.
- No push command is included.

## Git Workflow

- Branch: `feature/editorial-sprint-1-revisions`
- Commit: `Revise editorial sprint 1 priority articles`
- Merge commit: `Merge editorial sprint 1 revisions`
- Target: local `main`
- Remote push: intentionally not performed

Ready for local application
