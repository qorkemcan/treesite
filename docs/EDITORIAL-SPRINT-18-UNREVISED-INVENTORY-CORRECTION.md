# Editorial Sprint 18 Inventory Correction

Prepared: 2026-07-09

## Why this document exists

After Editorial Sprint 17 was completed and pushed, the historical cumulative report counter showed:

- Total unique site articles revised after Sprint 17: **510**
- Total unrevised site articles after Sprint 17: **54**

A verification package was then generated from the current repository. The first report-based and commit-message-based methods did not reconcile cleanly. The fastest threshold-based file inventory selected the closest verified old-format set and found:

- Real blog articles: **564**
- Verified revised baseline: **494**
- Verified old-format unrevised articles: **70**

## Decision

For editorial production safety, Sprint 18 should use the **verified 70 unrevised article files** as the working baseline.

Reason: the files in this verified set still show unrevised structural signals:

- no visible title-matching H1,
- no normalized source section,
- no direct service-route structure,
- older `updatedDate` values,
- older final-answer / short-answer patterns in many articles.

This means the previous 510/54 cumulative counter should be treated as an optimistic reporting artifact, not the live working inventory.

## Working baseline from Sprint 18 onward

- Real blog articles: **564**
- Verified revised before Sprint 18: **494**
- Verified unrevised before Sprint 18: **70**
- Sprint 18 candidate pool: **30**
- Expected verified revised after Sprint 18: **524**
- Expected verified unrevised after Sprint 18: **40**

## Workflow instruction

Future sprint reports should use the phrase **verified unrevised inventory** when referring to this corrected baseline, unless a later audit proves a different file-level count.
