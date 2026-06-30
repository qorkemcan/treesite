# Packet: Editorial Sprint 3 Revisions — Package 1

Prepared: 2026-06-30

## Scope

This package revises the first eight Editorial Sprint 3 candidates.

## Articles revised

1. `whiteflies-on-florida-trees-sticky-leaves-sooty-mold-and-when-to-worry.md`
2. `ambrosia-beetles-in-florida-trees-toothpick-sawdust-stress-and-when-to-worry.md`
3. `why-is-my-pine-tree-turning-brown-from-the-top-down.md`
4. `dead-branches-at-the-top-of-a-tree-drought-roots-borers-or-decline.md`
5. `bagworms-on-florida-trees-what-homeowners-should-do-first.md`
6. `carpenter-ants-in-a-tree-are-they-killing-it-or-finding-decay.md`
7. `termites-in-a-tree-stump-should-florida-homeowners-remove-or-grind-it.md`
8. `webs-in-trees-in-florida-webworms-tent-caterpillars-or-spider-webs.md`

## Main corrections

- Removed every public `Internal Links to Add` or publishing note.
- Replaced raw source URL lists with polished linked source sections.
- Reduced repeated Short Answer, warning, storm, removal, and FAQ material.
- Added the established bordered and responsive table format to all eight articles.
- Separated insect identification from tree-risk assessment.
- Limited tree-service conversion on whitefly, bagworm, and webworm pages to deadwood, unsafe access, clearance, replacement, or structural decline.
- Differentiated ambrosia beetle frass from bark beetle, carpenter-ant, and other borer signs.
- Differentiated normal pine needle shedding from dead-top decline.
- Converted the top-dieback article into a compact cause-and-next-step hub.
- Made licensed pest-professional boundaries explicit for house carpenter ants and termites.
- Added direct tree-trimming, tree-removal, emergency-response, or stump-grinding links where appropriate.
- Updated all eight `updatedDate` values to `2026-06-30`.

## Editorial roles after revision

- Whiteflies: honeydew-pest identification and plant-health route.
- Ambrosia beetles: fresh frass and tree-stress triage.
- Pine browning: normal shedding versus dead-top decline and target risk.
- Crown dieback: concise cause-and-action hub.
- Bagworms: low-risk identification, safe hand removal, and timing.
- Carpenter ants: decay clue organized by insect location.
- Stump termites: pest inspection plus stump-service coordination.
- Webs: webworm, tent caterpillar, and spider identification with leave-alone guidance.

## Official guidance used

- UF/IFAS whitefly, ambrosia beetle, pine, crown-dieback, bagworm, carpenter-ant, termite, and fall-webworm resources
- Sunshine 811 stump-grinding guidance
- OSHA tree-care safety guidance

## Progress after application

- Sprint 3 audited: **8 / 30**
- Sprint 3 revised: **8 / 30**
- Sprint 3 remaining: **22**

## Git workflow

The included script:

- synchronizes local `main` with `origin/main`
- permits unrelated untracked files but refuses tracked or staged changes
- verifies the current blob of every source article
- creates `feature/editorial-sprint-3-revisions-1`
- applies the eight revisions and this report
- runs `git diff --check`
- runs `npm run build`
- stages generated sitemap changes
- commits with `Revise editorial sprint 3 first priority batch`
- merges locally into `main`
- does not push

## Live verification after push

Recommended example:

`https://www.protreetrim.com/blog/whiteflies-on-florida-trees-sticky-leaves-sooty-mold-and-when-to-worry/`

Expected first table heading:

`Use this whitefly decision table`

Ready for Editorial Sprint 3 package 1 review
