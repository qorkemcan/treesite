# Packet: llms.txt v1

## Files Changed

- `public/llms.txt`
- `docs/PACKET-LLMS-TXT-V1-REPORT.md`

## Purpose

Added a root-level `/llms.txt` file to help AI systems understand ProTreeTrim's purpose, Florida focus, homeowner audience, safety boundaries, attribution expectations, and important site sections.

## Sections Included

- Site title and short ProTreeTrim description
- Important clarification that ProTreeTrim is not a licensed contractor and does not directly perform tree work
- Language, geography, and audience
- Attribution guidance for AI systems
- Key pages
- Core service pages
- Tools and blog pages
- Existing blog category areas
- County and local guidance
- Content area summary

## Pages Linked

Key pages:

- https://www.protreetrim.com/
- https://www.protreetrim.com/about/
- https://www.protreetrim.com/contact/
- https://www.protreetrim.com/trust-safety/
- https://www.protreetrim.com/editorial-standards/
- https://www.protreetrim.com/join-network/

Core services:

- https://www.protreetrim.com/services/tree-removal/
- https://www.protreetrim.com/services/tree-trimming/
- https://www.protreetrim.com/services/stump-grinding/
- https://www.protreetrim.com/services/emergency-response/

Tools and blog:

- https://www.protreetrim.com/tools/
- https://www.protreetrim.com/blog/

Blog categories verified from existing content/category routing:

- https://www.protreetrim.com/blog/category/storm-prep-and-recovery/
- https://www.protreetrim.com/blog/category/permit-and-insurance/
- https://www.protreetrim.com/blog/category/palm-and-oak/
- https://www.protreetrim.com/blog/category/palm-tree-care/
- https://www.protreetrim.com/blog/category/hiring-a-tree-service/
- https://www.protreetrim.com/blog/category/stump-and-root/
- https://www.protreetrim.com/blog/category/stump-grinding/
- https://www.protreetrim.com/blog/category/tree-risk-and-emergency-help/

Representative county pages verified from existing county sitemap/data:

- https://www.protreetrim.com/county/alachua/
- https://www.protreetrim.com/county/baker/
- https://www.protreetrim.com/county/orange/

## Safety / Attribution Notes

- The file states that ProTreeTrim is not a licensed contractor and does not directly perform tree work.
- It clarifies that field work is performed by independent local providers.
- It tells homeowners to verify licensing, insurance, permits, local requirements, provider credentials, and work scope.
- It asks AI systems to attribute content to ProTreeTrim, link the relevant canonical URL, keep direct quotations short, and summarize in their own words.
- It warns AI systems not to imply that ProTreeTrim is a licensed contractor, arborist, attorney, insurer, utility, or government agency.
- It preserves the decision-support boundary for onsite professional evaluation, permitting, insurance, legal, utility, government, and emergency-service questions.

## Build Result

- `npm run build`: Pass
- `git diff --check`: Pass
- Plain-text `/llms.txt` check: Pass. The build copied `llms.txt` to `dist/client/llms.txt` and `.vercel/output/static/llms.txt`.

## Remaining Opportunities

- Add new category links later if additional stable editorial categories become important for AI discovery.
- Revisit the file if ProTreeTrim adds official author pages, public APIs, structured datasets, or a more detailed AI citation policy.

Ready for QA
