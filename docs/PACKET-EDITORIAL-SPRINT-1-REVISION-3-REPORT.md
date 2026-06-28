# Packet: Editorial Sprint 1 Revisions — Batch 3

Prepared: 2026-06-28

## Scope

This packet revises eight additional ProTreeTrim articles from the original 30-article editorial audit.

## Articles revised

1. `tree-service-red-flags-when-to-walk-away-before-the-job-starts.md`
2. `red-flags-before-hiring-a-tree-removal-crew-in-florida.md`
3. `red-flags-before-hiring-a-tree-removal-crew-in-florida-licensing-insurance-and-estimate-clues.md`
4. `tree-removal-estimate-vs-final-invoice-what-can-change-the-price.md`
5. `tree-removal-cleanup-what-should-be-included-in-the-quote.md`
6. `should-cleanup-hauling-and-stump-grinding-be-included-in-a-tree-quote.md`
7. `emergency-tree-service-at-night-what-can-safely-wait-until-morning.md`
8. `storm-damaged-tree-removal-what-changes-the-price-and-timeline.md`

## Search-intent differentiation

The three red-flag articles were separated deliberately:

- `tree-service-red-flags...` covers serious stop-work / walk-away conditions.
- `red-flags-before-hiring...` covers physical site planning, access, work method, property protection, and cleanup logistics.
- `...licensing-insurance-and-estimate-clues` covers business identity, local licensing claims, insurance, worker coverage, subcontractors, estimates, and payment documentation.

The two cleanup articles were also differentiated:

- `tree-removal-cleanup...` defines the final condition of the property.
- `should-cleanup-hauling-and-stump...` compares bundled versus separate line-item pricing.

The emergency articles were separated by decision:

- `emergency-tree-service-at-night...` answers whether a stable condition can be isolated until daylight.
- `storm-damaged-tree-removal...` explains quote and timeline drivers after the response path has been chosen.

## Improvements

- Removed visible editorial-note patterns and generic final-takeaway repetition.
- Added contextual, site-relative internal links.
- Added clear referral/dispatch CTAs.
- Added electrical-safety-first language.
- Added written change-order and final-site-condition logic.
- Added careful Florida wording for licensing, workers’ compensation, permits, and storm contractor verification.
- Replaced overlapping exhaustive lists with decision tables, comparison tools, and distinct homeowner actions.
- Updated all eight `updatedDate` fields to `2026-06-28`.

## Primary sources used

- Occupational Safety and Health Administration
- Florida Department of Financial Services
- Florida Attorney General
- Florida Department of State / Sunbiz
- Florida DBPR
- Florida Legislature
- Florida Public Service Commission
- UF/IFAS

## Progress after this packet is applied

- Total distinct articles revised across the three packages: 24
- Articles completed from the 30-article main audit: 21
- Articles remaining in the main audit: 9

## Git workflow

The included script:

- fetches and rebases local `main` onto `origin/main`
- ignores the three unrelated untracked audit/standards files
- refuses tracked or staged local changes
- verifies the eight original source blobs before overwriting
- creates `feature/editorial-sprint-1-revisions-3`
- copies eight revised articles and this report
- runs `git diff --check`
- runs `npm run build`
- includes generated `sitemap-blog.xml` and `sitemap-index.xml` changes in the same commit
- commits with `Revise editorial sprint 1 third priority batch`
- merges locally into `main`
- does not push

## Live verification rule

Per the user’s workflow preference, the assistant will not perform a live-page editorial check after deployment. After push, one example URL will be provided for the user to verify directly.

Ready for editorial review
