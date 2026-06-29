# Editorial Sprint 2 Audit — Package 3

Prepared: 2026-06-29

## Scope

This audit covers candidates 17–24: hollow base, base rot, oak base decay, dark trunk cracks, codominant stems, included bark, Florida pine bark beetles, and delayed post-storm failure. No article Markdown or site code was changed.

## Scoring framework

Each article is scored out of 100 across ten equally weighted criteria: headline, intro, readability, natural US English, AI-pattern risk, Florida relevance, decision support, internal links, CTA quality, and overall polish.

Bands: 95–100 Excellent · 90–94 Minor polish · 80–89 Needs revision · Below 80 Major rewrite

## Summary

- Audited in this package: **8**
- Package average: **75.1/100**
- Major rewrite: **8**
- Direct contextual service-page links: **0/8**
- Sprint 2 audit progress after application: **24/30**
- Sprint 2 audit candidates remaining: **6**
- Sprint 2 revisions completed before this audit: **16/30**

## Revision priority

1. `bark-beetles-in-florida-pines-when-a-brown-pine-becomes-a-removal-risk.md` — public editor note, excessive length, raw sources
2. `a-tree-looks-hollow-near-the-base-what-should-a-homeowner-check-first.md` — overlap, no sources, no service path
3. `is-decay-at-the-base-of-an-oak-always-an-emergency-in-florida.md` — sources, heading structure, service routing
4. `can-storm-damaged-trees-fail-days-later.md` — official support and emergency-screening path
5. `can-a-tree-rotting-at-the-base-be-saved-or-is-removal-safer.md` — save/remove differentiation
6. `what-that-dark-crack-in-a-florida-tree-trunk-may-mean.md` — symptom triage
7. `what-is-included-bark-and-why-can-it-make-a-florida-tree-split.md` — differentiate from codominant stems
8. `when-a-florida-tree-has-two-main-trunks-codominant-stem-warning-signs.md` — strongest page; refine support-system guidance

## Common findings

### Search-intent overlap

- Hollow base, general base rot, and oak base decay currently repeat the same cavity, conk, lean, root movement, and target checklist.
- Codominant stems and included bark are nearly parallel articles rather than a parent structural pattern and a focused defect explainer.
- Trunk crack content overlaps with both included bark and base decay without a location-based triage system.

### Accuracy and trust

- Visual shape alone should not be used to classify branch-union strength.
- Cabling and bracing should be presented as designed, inspected, and maintained support systems—not generic fixes.
- Saturated soil is a context factor, but wording should not imply it universally destabilizes every tree.
- Pest treatment requires correct identification and label-compliant application.
- Delayed storm failure needs an explicit 911/utility screen and official storm-tree support.

### Internal links and CTAs

- None of the eight pages directly links to the appropriate removal, trimming, cabling/bracing, or emergency service route.
- The bark-beetle article contains a public `Internal Links to Add` section.
- Stable structural concerns and actively moving hazards are not consistently routed to different next steps.

### AI-pattern signals

- Repeated `Short Answer` openings.
- Similar warning-sign, mistakes, better-questions, professional-help, FAQ, and final-takeaway sequences.
- Excessive list density and repeated phrases such as “not automatically,” “the real question,” and “before storm season.”

## Site-wide table styling issue

The user supplied a live screenshot showing a Markdown table without visible borders or clear cell separation.

Root cause identified in `src/pages/blog/[slug].astro`: the existing table selectors are scoped (`.blog-prose table`, `.blog-prose th`, `.blog-prose td`), while rendered Markdown elements do not receive the component scope attribute. Links and media already use `:global(...)`, but tables do not.

Revision Package 3 should:

- convert Markdown table selectors to global selectors
- add a visible outer border and cell dividers
- add a restrained header background
- improve cell padding and line height
- use subtle row separation
- preserve horizontal scrolling on small screens
- apply the fix once for all current and future blog tables

Because this is a code/template change, the revision package must run the full Astro build.

## Article-by-article audit

### 17. A Tree Looks Hollow Near the Base: What Should a Homeowner Check First? — 73/100

- **Filename:** `a-tree-looks-hollow-near-the-base-what-should-a-homeowner-check-first.md`
- **Category:** Arborist Services
- **Status:** Major rewrite
- **Scores:** Headline 9 · Intro 8 · Readability 8 · Natural US English 8 · AI-pattern risk 6 · Florida relevance 9 · Decision support 9 · Internal links 2 · CTA 7 · Polish 7
- **Strengths:** Strong homeowner screening logic around cavity location, lean, fungal growth, root flare, canopy, targets, and storm timing.
- **Weaknesses:** No H1, sources, or direct service link; very long; lightly tapping the trunk can be misread as a diagnostic test; overlaps heavily with base-rot and oak-decay pages.
- **AI-pattern notes:** Predictable Short Answer, exhaustive warning lists, mistakes section, and Final Takeaway.
- **Florida/context notes:** Good rain, saturated-soil, pool-cage, paver, and storm-season context; needs clearer remote-diagnosis limits.
- **Internal-link opportunities:** /services/tree-removal/, base-rot page, oak-decay page, leaning-tree guide, permit guide.
- **CTA recommendation:** Route urgent movement to emergency response and stable structural concerns to tree removal/assessment.
- **Visual opportunity:** Base-cavity warning-sign map.
- **Recommended image prompt:** A realistic Florida mature tree with a cavity at the root flare, labeled signs for sound wood, fungal conk, soil cracking, lean direction, canopy decline, and nearby house target, premium homeowner risk-guide style.
- **Final action:** Major rewrite

### 18. Can a Tree Rotting at the Base Be Saved, or Is Removal Safer? — 76/100

- **Filename:** `can-a-tree-rotting-at-the-base-be-saved-or-is-removal-safer.md`
- **Category:** Tree Risk & Emergency Help
- **Status:** Major rewrite
- **Scores:** Headline 9 · Intro 9 · Readability 8 · Natural US English 8 · AI-pattern risk 7 · Florida relevance 9 · Decision support 9 · Internal links 2 · CTA 7 · Polish 8
- **Strengths:** Clear save-versus-remove framing; useful table; good warnings against drilling, filling, root cutting, and DIY repair.
- **Weaknesses:** No H1, sources, or service link; cabling language may imply support systems can address base decay; FAQ duplicates body; overlaps with hollow-base article.
- **AI-pattern notes:** Short Answer and Bottom Line templates; repeated lists and rhetorical contrast.
- **Florida/context notes:** Strong irrigation, buried flare, storm, paver, pool, and target context; needs sharper structural-versus-biological assessment distinction.
- **Internal-link opportunities:** /services/tree-removal/, hollow-base guide, emergency response, stump grinding, permit guide.
- **CTA recommendation:** Use a monitor / prompt assessment / urgent exclusion decision path and service-specific CTA.
- **Visual opportunity:** Save-monitor-remove matrix.
- **Recommended image prompt:** A Florida tree with base rot shown in three decision paths—monitor, professional assessment, removal—with callouts for conks, sound wood, root movement, canopy condition, and targets.
- **Final action:** Major rewrite

### 19. Is Decay at the Base of an Oak Always an Emergency in Florida? — 74/100

- **Filename:** `is-decay-at-the-base-of-an-oak-always-an-emergency-in-florida.md`
- **Category:** Arborist Services
- **Status:** Major rewrite
- **Scores:** Headline 9 · Intro 8 · Readability 8 · Natural US English 8 · AI-pattern risk 6 · Florida relevance 10 · Decision support 8 · Internal links 7 · CTA 7 · Polish 3
- **Strengths:** Good oak-specific context, urgency distinctions, related links, and practical photo guidance.
- **Weaknesses:** No H1 or sources; FAQ uses H2 headings under an H2 FAQ; no service-page link; repeated claims about saturated soil are broad and need nuance.
- **AI-pattern notes:** Short Answer, repeated warning lists, FAQ repetition, and Final Takeaway.
- **Florida/context notes:** Excellent live-oak and property-target relevance; should avoid implying saturated soil alone universally reduces anchorage.
- **Internal-link opportunities:** /services/tree-removal/, oak cost page, hollow/base-rot page, tree-risk documentation, permit guide.
- **CTA recommendation:** Add a stable-versus-moving oak decision and direct tree-removal/emergency routes.
- **Visual opportunity:** Oak base-decay urgency scale.
- **Recommended image prompt:** A mature Florida live oak with a close view of root flare decay, conk, cavity, soil movement, canopy targets, and a simple routine-prompt-urgent decision scale.
- **Final action:** Major rewrite

### 20. What That Dark Crack in a Florida Tree Trunk May Mean — 77/100

- **Filename:** `what-that-dark-crack-in-a-florida-tree-trunk-may-mean.md`
- **Category:** Arborist Services
- **Status:** Major rewrite
- **Scores:** Headline 9 · Intro 8 · Readability 8 · Natural US English 8 · AI-pattern risk 7 · Florida relevance 9 · Decision support 9 · Internal links 5 · CTA 7 · Polish 7
- **Strengths:** Strong emphasis on location, depth, widening, decay, targets, irrigation, and photo documentation.
- **Weaknesses:** No sources or service link; combines too many possible causes without a clear symptom triage; tapping guidance appears indirectly through related content; FAQ repeats body.
- **AI-pattern notes:** Short Answer and Final Takeaway pattern; many similar 'not always, but' sentences.
- **Florida/context notes:** Good moisture, lightning, storm, pool-cage, and root-flare context; needs clearer urgent crack-versus-old seam distinction.
- **Internal-link opportunities:** /services/tree-removal/, included bark, codominant stems, oak/base decay, storm failure.
- **CTA recommendation:** Add crack-location decision table and route fresh movement to emergency response.
- **Visual opportunity:** Trunk-crack location guide.
- **Recommended image prompt:** A Florida tree trunk illustration showing an old surface wound, wet dark seam, codominant-union crack, lightning injury, and base crack, each labeled by urgency and nearby target risk.
- **Final action:** Major rewrite

### 21. When a Florida Tree Has Two Main Trunks: Codominant Stem Warning Signs — 78/100

- **Filename:** `when-a-florida-tree-has-two-main-trunks-codominant-stem-warning-signs.md`
- **Category:** Arborist Services
- **Status:** Major rewrite
- **Scores:** Headline 9 · Intro 9 · Readability 8 · Natural US English 8 · AI-pattern risk 7 · Florida relevance 9 · Decision support 9 · Internal links 2 · CTA 7 · Polish 10
- **Strengths:** Clear explanation of codominant stems, union shape, included bark, storm loading, pruning, support systems, and removal thresholds.
- **Weaknesses:** No H1, sources, or service link; oversimplifies U-shaped versus V-shaped unions; cabling/bracing needs inspection-standard and maintenance context; overlaps with included-bark page.
- **AI-pattern notes:** Short Answer, mistakes, better questions, professional help, Final Takeaway architecture.
- **Florida/context notes:** Strong hurricane, saturated-soil, pool, roof, and target context; should emphasize union features beyond shape alone.
- **Internal-link opportunities:** /services/tree-trimming/, /services/tree-removal/, included-bark guide, trunk-crack guide, cabling page.
- **CTA recommendation:** Split CTA between structural pruning/support review and removal when active splitting or high target exposure exists.
- **Visual opportunity:** Codominant-union comparison.
- **Recommended image prompt:** A realistic Florida shade tree diagram comparing a broad branch union, tight codominant union with included bark, opening crack, reduction pruning, and support-system inspection, with house and pool targets.
- **Final action:** Major rewrite

### 22. What Is Included Bark, and Why Can It Make a Florida Tree Split? — 77/100

- **Filename:** `what-is-included-bark-and-why-can-it-make-a-florida-tree-split.md`
- **Category:** Arborist Services
- **Status:** Major rewrite
- **Scores:** Headline 9 · Intro 9 · Readability 8 · Natural US English 8 · AI-pattern risk 7 · Florida relevance 9 · Decision support 9 · Internal links 2 · CTA 7 · Polish 9
- **Strengths:** Explains trapped bark, union loading, target risk, pruning, cabling, topping, and removal in homeowner language.
- **Weaknesses:** No H1, sources, contextual links, or service link; largely duplicates codominant-stem content; some statements present union shape too simply.
- **AI-pattern notes:** Short Answer, repeated warning lists, 'goal is not X' phrasing, and Final Takeaway.
- **Florida/context notes:** Strong storm and hardscape context; should distinguish visible included bark from confirmed internal attachment weakness.
- **Internal-link opportunities:** /services/tree-trimming/, /services/cabling-bracing/, /services/tree-removal/, codominant stems, trunk cracks.
- **CTA recommendation:** Make this the focused defect explainer; route options to pruning, support inspection, or removal.
- **Visual opportunity:** Included-bark anatomy.
- **Recommended image prompt:** A detailed but homeowner-friendly cross-section of two tree stems showing normal branch bark ridge versus trapped included bark, opening seam, decay pocket, and canopy load in Florida wind.
- **Final action:** Major rewrite

### 23. Bark Beetles in Florida Pines: When a Brown Pine Becomes a Removal Risk — 71/100

- **Filename:** `bark-beetles-in-florida-pines-when-a-brown-pine-becomes-a-removal-risk.md`
- **Category:** Tree Health & Pests
- **Status:** Major rewrite
- **Scores:** Headline 9 · Intro 9 · Readability 6 · Natural US English 8 · AI-pattern risk 5 · Florida relevance 10 · Decision support 9 · Internal links 3 · CTA 7 · Polish 5
- **Strengths:** Strong UF/IFAS-informed distinction between primary and secondary beetles, pitch tubes, top-down decline, storm stress, and dead-pine removal risk.
- **Weaknesses:** Extremely long; visible `Internal Links to Add` editorial note; raw source URLs; no service links; too many repeated lists and FAQs.
- **AI-pattern notes:** Highly exhaustive template with repeated warnings, do-not list, photo list, permit notes, CTA, sources, and FAQ.
- **Florida/context notes:** Excellent pine and southern pine beetle context; treatment language needs careful pest-identification and pesticide-label boundaries.
- **Internal-link opportunities:** /services/tree-removal/, /services/emergency-response/, pine-browning guide, sawdust guide, dead-tree cost.
- **CTA recommendation:** Separate pest identification from structural removal risk and add planned/emergency service paths.
- **Visual opportunity:** Brown-pine symptom sequence.
- **Recommended image prompt:** A Florida pine diagnostic infographic showing green crown, top-down browning, pitch tubes, boring dust, bark loss, dead crown, lean, and removal-risk targets near a house.
- **Final action:** Major rewrite

### 24. Can Storm-Damaged Trees Fail Days Later? — 75/100

- **Filename:** `can-storm-damaged-trees-fail-days-later.md`
- **Category:** Emergency Storm
- **Status:** Major rewrite
- **Scores:** Headline 9 · Intro 9 · Readability 8 · Natural US English 8 · AI-pattern risk 7 · Florida relevance 10 · Decision support 9 · Internal links 1 · CTA 7 · Polish 7
- **Strengths:** Strong urgency, delayed-failure explanation, warning signs, homeowner behavior, and post-storm exclusion guidance.
- **Weaknesses:** No sources or service links; highly repetitive; opening overstates frequency without evidence; no clear 911/utility first-response section.
- **AI-pattern notes:** Repeated dramatic short paragraphs, list-heavy explanation, common mistakes, professional help, and final takeaway.
- **Florida/context notes:** Strong saturated-ground and continued-weather context; needs official storm-tree guidance and clearer stable-debris versus active-hazard path.
- **Internal-link opportunities:** /services/emergency-response/, storm price/timeline, nighttime decision, widowmaker, storm photos.
- **CTA recommendation:** Add 911/utility screen, isolate-wait-act table, and direct emergency service CTA.
- **Visual opportunity:** Delayed-failure timeline.
- **Recommended image prompt:** A Florida post-storm timeline showing a cracked tree immediately after wind, root movement after rain, a suspended limb, and delayed failure risk near a driveway, with isolate-monitor-emergency actions.
- **Final action:** Major rewrite

## Required role after revision

- hollow-base page = first homeowner observation and documentation
- base-rot page = save / monitor / remove decision
- oak-decay page = oak-specific urgency and target context
- dark-crack page = location and change-based symptom triage
- codominant-stem page = whole-tree structural pattern and management options
- included-bark page = focused defect anatomy and union implications
- bark-beetle page = pest/decline identification separated from dead-pine removal risk
- delayed-failure page = post-storm isolate / call / schedule decision

Ready for Editorial Sprint 2 revision package 3
