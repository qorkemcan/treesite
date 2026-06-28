# Packet: Editorial Sprint 1 Revisions — Batch 4

Prepared: 2026-06-28

## Scope

This packet revises eight of the nine articles still remaining in the original 30-article audit.

## Articles revised

1. `what-photos-help-after-a-storm-damaged-tree-claim.md`
2. `should-you-call-insurance-or-a-tree-service-first-after-storm-damage.md`
3. `does-homeowners-insurance-cover-preventive-tree-removal-in-florida.md`
4. `should-you-remove-a-leaning-tree-or-monitor-it.md`
5. `what-is-a-widowmaker-branch-and-why-florida-homeowners-should-not-ignore-it.md`
6. `do-trees-really-damage-foundations-in-florida-myth-vs-real-risk.md`
7. `how-close-is-too-close-to-cut-tree-roots-near-a-florida-home.md`
8. `is-a-palm-too-close-to-the-house-a-real-problem-in-florida.md`

## Editorial differentiation

- The photo article is now a claim-documentation sequence rather than a generic storm checklist.
- The insurance-versus-tree-service article is now a clear call-order decision tree.
- The preventive-removal article separates maintenance, safety, underwriting, and coverage.
- The leaning-tree article uses monitor / prompt evaluation / urgent paths.
- The widowmaker article defines emergency thresholds and suspended-load hazards.
- The foundation article separates tree, drainage, soil, plumbing, and structural diagnosis.
- The root-cutting article rejects a universal distance rule and adds root-size, lean-side, target, and Sunshine 811 checks.
- The palm article focuses on mature size, roofline, screens, moisture, access, pruning limits, and storm exposure rather than overstating foundation-root risk.

## Source handling

Current factual and safety guidance was checked against primary or official sources from:

- Florida Department of Financial Services
- OSHA
- UF/IFAS
- Sunshine 811

Insurance articles explicitly avoid coverage promises and direct policy-specific questions to the insurer.

## Improvements applied

- Added immediate safety-first answers.
- Removed generic `Final Takeaway` patterns.
- Added contextual site-relative internal links.
- Added topic-appropriate ProTreeTrim CTAs.
- Added official source sections.
- Added practical tables and decision paths.
- Updated all eight `updatedDate` fields to `2026-06-28`.
- Preserved titles, filenames, categories, tags, authors, and publication dates.

## Progress after this packet

- Total distinct articles revised across four packages: 32
- Articles completed from the 30-article main audit: 29
- Articles remaining in the main audit: 1

Remaining article:

- `why-are-my-palm-leaves-turning-yellow-in-florida-nutrients-water-or-disease.md`

The distinct-article total is greater than 30 because the first revision package included three priority articles outside the final 30-item audit table.

## Git workflow

The script:

- synchronizes local `main` with `origin/main`
- allows unrelated untracked files but refuses tracked/staged edits
- verifies the expected source blobs before replacement
- creates `feature/editorial-sprint-1-revisions-4`
- applies eight revisions and this report
- runs `git diff --check`
- runs `npm run build`
- includes generated `sitemap-blog.xml` and `sitemap-index.xml`
- commits with `Revise editorial sprint 1 fourth priority batch`
- merges locally into `main`
- does not push

## Live verification workflow

After the user pushes, the assistant will provide one example URL only. The user will verify the live page.

Ready for editorial review
