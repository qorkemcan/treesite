# Packet: Editorial Sprint 1 Revisions — Batch 2

Date prepared: 2026-06-28

## Scope

This packet revises the next eight priority articles identified in `docs/EDITORIAL-SPRINT-1-AUDIT.md`. It does not change routes, layouts, components, schemas, service pages, or sitemap code.

## Articles revised

1. `do-you-need-an-arborist-report-to-remove-a-hazardous-tree-in-florida.md`
2. `florida-statute-163-045-what-homeowners-should-understand-before-tree-removal.md`
3. `florida-tree-removal-permit-guide.md`
4. `hiring-a-tree-removal-company-in-florida.md`
5. `what-to-do-if-a-tree-blocks-your-driveway-after-a-storm.md`
6. `24-7-emergency-tree-service-what-defines-a-tree-emergency.md`
7. `emergency-tree-removal-florida.md`
8. `what-should-be-included-in-a-tree-removal-estimate-in-florida.md`

## Why these eight

These are the first eight still-unrevised articles in the audit’s recommended first rewrite batch. Their original scores ranged from 68 to 80 and included the audit’s three weakest legal/permit articles.

## Main improvements

### Legal and permit content

- Removed visible `turn...search` citation artifacts.
- Rebuilt Florida Statute 163.045 explanations around the current official statute.
- Distinguished qualifying residential hazardous-tree documentation from ordinary local permits.
- Added cautious language for HOAs, rights-of-way, mangroves, ownership, utilities, and property types outside the statute.
- Added official Florida Legislature, City of Tampa, and Florida DEP sources.
- Added non-legal-advice and local-verification language.

### Emergency content

- Added three-level triage: 911/utility first, emergency tree response, or stable scheduled cleanup.
- Added explicit downed-line and line-contact warnings.
- Distinguished active failure from settled debris.
- Added safe photo/documentation paths and practical dispatcher information.
- Clarified emergency mitigation versus full removal, hauling, and stump work.
- Added official Florida PSC and OSHA sources.

### Hiring and estimate content

- Differentiated the company-comparison article from the existing questions checklist.
- Added business-identity, insurance, worker-coverage, subcontractor, permit, access, and property-protection checks.
- Differentiated the Florida estimate article from the comprehensive written-estimate article.
- Added comparison tables and clear final-site-condition questions.
- Added official Sunbiz, Florida workers’ compensation, DBPR, and OSHA sources.

### Internal linking and CTA

- Replaced isolated articles with contextual site-relative internal links.
- Added clear links into permits, arborist reports, emergency triage, storm documentation, quote comparison, and service pages.
- Added topic-appropriate CTAs using ProTreeTrim’s referral and dispatch positioning.
- Kept emergency CTAs subordinate to 911 and utility instructions when electrical or immediate life-safety danger exists.

## Source policy

Current legal, electrical-safety, workers’ compensation, business-record, mangrove, and tree-care claims were checked against official primary sources, including:

- Florida Legislature
- Florida Department of Environmental Protection
- City of Tampa official tree guidance
- Florida Department of Financial Services
- Florida Department of State / Sunbiz
- Florida DBPR
- Florida Public Service Commission
- OSHA

## Files changed

- Eight existing Markdown articles under `src/content/blog/`
- This report under `docs/`

## Validation performed on the package

- All eight expected files are present.
- All files contain valid opening and closing frontmatter markers.
- Titles and slugs are preserved.
- `updatedDate` is set to `2026-06-28`.
- No visible `turn...search` or `cite` artifacts remain.
- All eight articles contain contextual internal links.
- All eight articles contain topic-appropriate CTAs.
- Article-level source sections use official primary sources.
- The application script runs `git diff --check` and `npm run build` before committing.

## Git workflow encoded in the script

- Start from `main`.
- Fetch and rebase onto `origin/main` before creating the branch.
- Ignore unrelated untracked files while refusing tracked or staged local changes.
- Verify that the eight source files still match the audited GitHub versions before replacing them.
- Create `feature/editorial-sprint-1-revisions-2`.
- Copy only the eight articles and this report.
- Run `git diff --check`.
- Run `npm run build`.
- Commit with `Revise editorial sprint 1 second priority batch`.
- Merge locally into `main` with a merge commit.
- Do not push.
- Print final Git status and recent commit log.

Ready for editorial review
