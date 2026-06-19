# Generic route enrichment data

This directory defines planning data for future generic city/service enrichment. It is not connected to the live Astro page template. Adding or editing a record here must not change routes, canonicals, robots directives, sitemap membership, CTAs, phone behavior, or rendered page content until a later package explicitly integrates the model.

## Data layers

- `county-context.json` is keyed by canonical county slug. It holds county-wide context only when the fact applies at county scale.
- `city-context.json` is keyed by the collision-aware city identity from `src/lib/slugs.js`. It holds city-level facts and existing fields derived from `cities.csv`.
- `route-context.json` is an array keyed logically by `publicUrl`. It holds only service-specific module choices and route-level planning notes.
- `pilot-routes.json` is the 30-route implementation plan derived from the Paket 3A pilot report. It contains no generated marketing copy.

Never move an unknown value from a nearby city or another county into a record. Use `null`, `"unknown"`, or `[]` when the repository does not provide evidence.

## Source status

- `repo-derived`: copied or mechanically derived from an existing repository field. This is not the same as external factual verification.
- `manually-verified`: checked against an identified source by a human reviewer.
- `unverified`: proposed or incomplete data that must not be treated as fact.

`reviewedAt` must be `YYYY-MM-DD` only after an actual review. Otherwise it stays `null`. Static facts should include a concise note naming their repository field or external source. URL-based sources belong in `sourceNotes`; do not invent citations.

## Adding a record

1. Build county and city identities with the helpers in `src/lib/slugs.js`.
2. Confirm the county and city exist in `src/data/cities.csv`.
3. Add county-wide facts only to the county layer.
4. Add city facts only to the collision-safe city identity.
5. Add service decisions only to the exact public URL in the route layer.
6. Leave unsupported facts unknown instead of inferring coastal, soil, HOA, pool, permit, or utility conditions.
7. Run all validation commands listed below before integration.

## Service modules

Tree removal:

- `risk-review`
- `targets-and-rigging`
- `permit-check`
- `debris-and-cleanup`
- `property-protection`

Stump grinding:

- `machine-access`
- `grinding-depth`
- `root-zone`
- `replanting`
- `pavers-and-pools`

Emergency service:

- `active-hazard`
- `storm-access`
- `utility-risk`
- `documentation`
- `temporary-safety`

The validator rejects modules assigned to the wrong service. Module selection is a content plan, not evidence that a local condition exists.

## Validation before template integration

Run:

```sh
npm run validate:enrichment-data
npm run audit:generic-routes
npm run validate:city-routes
npm run validate:sitemaps
git diff --check
```

Before a later package imports this data into `src/pages/[slug].astro`, reviewers must also confirm every new local fact, service-language compatibility, county identity, and pilot route. No field should be filled by guesswork.
