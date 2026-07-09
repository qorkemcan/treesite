# Packet: Site-wide Citation Artifact Fix 1

Prepared: 2026-07-09

## Scope

This package removes old public citation artifacts from three blog articles identified by the Sprint 14 final check report:

1. `gainesville-tree-regulations-what-property-owners-should-know.md`
2. `palm-beach-tree-service-guide-for-high-end-landscapes.md`
3. `powdery-mildew-on-florida-ornamentals-prevention-tips.md`

## Expected result

- Real blog articles remain: **564**
- Public citation artifacts in all blog Markdown files after fix: **0**
- Article count changes: **0**
- Route changes: **0**
- Metadata schema changes: **0**
- Site code changes: **0**
- Build required: **yes**
- Sitemap validation required: **yes**

## What changed

Only old inline citation-artifact strings like `cite...` are removed from the three identified articles.

No factual claims are rewritten in this package. The package only cleans visible artifact residue from article prose.

## Why this matters

The Sprint 14 final report showed Sprint 14 itself was clean, but the site-wide warning scan found three unrevised or previously generated articles with public citation artifacts. Removing those artifacts prevents broken visible citation fragments from appearing on live pages.

## Next step

After this fix is pushed and `0 0` is confirmed, continue with Editorial Sprint 15 Candidate List + Audit Package 1.
