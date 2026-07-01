# Packet: Editorial Sprint 6 Revision — Package 3

Prepared: 2026-07-01

## Scope

This package rewrites the seven articles audited in Editorial Sprint 6 Audit Package 3. It separates visual observation from diagnosis, plant-health care from structural tree risk, and routine homeowner action from pesticide, utility, emergency, and professional boundaries.

## Revised articles

1. `black-spots-on-tree-leaves-in-florida-leaf-spot-anthracnose-or-tree-stress.md`
2. `cracks-in-tree-bark-heat-stress-lightning-or-structural-risk.md`
3. `green-stuff-growing-on-tree-bark-in-florida-lichen-algae-moss-or-disease.md`
4. `do-pine-trees-lose-their-needles-in-florida-normal-shedding-vs-warning-signs.md`
5. `do-tree-watering-bags-work-in-florida-when-they-help-and-when-they-cause-problems.md`
6. `how-to-tell-if-a-florida-tree-is-overwatered-or-underwatered.md`
7. `florida-tree-identification-for-homeowners-common-yard-trees-and-what-they-can-tell-you.md`

## Editorial changes

- Added one clear H1 to every article.
- Updated all seven `updatedDate` values to `2026-07-01`.
- Replaced repetitive Short Answer, warning-sign, takeaway, and FAQ structures.
- Added mobile-friendly decision tables and observation workflows.
- Added contextual internal links and direct service-page routes where appropriate.
- Added clean linked authoritative source sections.
- Preserved filenames, slugs, publication dates, categories, and search intent.
- Preserved the global bordered and responsive blog-table style.

## High-stakes corrections

### Black leaf spots

- Required host, leaf age, lesion pattern, weather, irrigation, progression, and whole-tree observations before diagnosis.
- Separated anthracnose, other leaf spots, sooty growth, algal disease, insects, environmental injury, and structural risk.
- Added Extension and Florida Plant Diagnostic Network routing.
- Added pesticide-label and applicator boundaries.

### Bark cracks

- Organized the page around active movement, targets, lightning, electrical hazards, base defects, and urgency.
- Removed the public `Internal Links to Add` editorial artifact.
- Separated normal bark, old wound seams, branch cracks, codominant splits, lightning scars, sun injury, cankers, and wetwood.
- Added support-system design and inspection boundaries.

### Green bark growth

- Separated lichen, algae, moss, parasitic algal disease, conks, cankers, wetwood, and decay.
- Added no-scrape, no-pressure-wash, and no-random-pesticide controls.
- Preserved reassurance without treating every green organism as harmless.

### Pine needle loss

- Added true-pine identification, needle-age and crown-pattern analysis, pitch canker, Ips beetles, resin, boring dust, root stress, lightning, and rapid mortality lanes.
- Removed a universal two-to-four-week waiting rule.
- Separated plant diagnosis, structural assessment, electrical control, and dead-pine removal.

### Watering bags

- Defined watering bags as temporary establishment tools rather than permanent accessories.
- Added root-ball and surrounding-soil checks, discharge testing, rainfall adjustment, root-flare inspection, phase-out, and mature-tree limits.
- Avoided universal fill volumes and schedules.

### Overwatering versus underwatering

- Added four root-zone conditions and separate newly planted and established-tree workflows.
- Added rainfall, irrigation, planting-depth, compaction, drainage, root-damage, diagnosis, and one-change-at-a-time logic.
- Added saturated-root-plate and target-risk escalation.

### Florida tree identification

- Rebuilt the page as an identification hub using region, palm/conifer/broadleaf form, leaf arrangement, simple versus compound leaves, bark, reproductive features, habitat, and multiple photographs.
- Added herbarium, DDIS, Extension, native/nonnative/invasive-status, and scientific-name boundaries.
- Separated identity, condition, risk, removal authority, and tree-service scope.

## Verification required by the apply script

- clean tracked working-tree check
- exact source-blob checks for all seven files
- `git diff --check`
- citation-artifact scan
- H1, updated-date, source-section, and service-route checks
- `npm run build`
- `npm run validate:sitemaps`
- expected tracked-file-only diff check
- staged diff check
- local feature commit and `main` merge
- no push

## Expected status after application

- Sprint 6 audited: **23 / 30**
- Sprint 6 revised: **23 / 30**
- Sprint 6 revision remaining: **7**
- Total unique site articles revised: **173**
- Global blog table style: **preserved**

Ready for Editorial Sprint 6 audit package 4
