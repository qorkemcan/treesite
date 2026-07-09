import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const planPath = path.join(root, "docs/phase-b-sprint-1-routing-plan.json");

const data = JSON.parse(fs.readFileSync(planPath, "utf8"));
const plans = data.plans || [];

const removalWithStumpSecondary = new Set([
  "src/content/blog/tree-removal-near-a-driveway-or-paver-patio-access-protection-and-cleanup.md",
  "src/content/blog/tree-removal-near-a-house-what-makes-the-job-more-complicated.md",
  "src/content/blog/tree-removal-near-a-pool-cage-what-florida-homeowners-should-know.md",
  "src/content/blog/what-makes-a-tree-removal-quote-more-expensive-than-expected.md",
]);

const trimmingPrimary = new Set([
  "src/content/blog/professional-pruning-vs-topping-why-topping-kills-trees.md",
]);

const manualReview = new Set([
  "src/content/blog/white-spots-on-palm-leaves-in-florida-scale-fungus-or-nutrient-issue.md",
]);

for (const p of plans) {
  if (removalWithStumpSecondary.has(p.file)) {
    p.intent = "removal with stump / cleanup consideration";
    p.signals = ["manual QA override: removal primary, stump secondary"];
    p.primaryRoute = "/services/tree-removal/";
    p.secondaryRoute = "/services/stump-grinding/";
    p.ctaStyle = "removal scope with cleanup detail";
    p.confidence = "high";
    p.editMode = "safe-auto-candidate";
    p.recommendedSentence = "For a clearer scope, review [tree removal](/services/tree-removal/) expectations first, then confirm whether [stump grinding](/services/stump-grinding/) belongs in the same job.";
  }

  if (trimmingPrimary.has(p.file)) {
    p.intent = "professional pruning / trimming standards";
    p.signals = ["manual QA override: pruning topic"];
    p.primaryRoute = "/services/tree-trimming/";
    p.secondaryRoute = "/trust-safety/";
    p.ctaStyle = "trimming standards with trust check";
    p.confidence = "high";
    p.editMode = "safe-auto-candidate";
    p.recommendedSentence = "For corrective pruning decisions, start with [tree trimming](/services/tree-trimming/) standards and review basic [trust and safety](/trust-safety/) checks before hiring.";
  }

  if (manualReview.has(p.file)) {
    p.intent = "education-only / weak money-page fit";
    p.signals = ["manual QA override: tree health diagnosis topic"];
    p.primaryRoute = "";
    p.secondaryRoute = "";
    p.ctaStyle = "manual review only";
    p.confidence = "low";
    p.editMode = "manual-review-required";
    p.recommendedSentence = "";
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  classifierVersion: "v4-manual-qc-overrides",
  candidateFiles: plans.length,
  zeroInternalMarkdownLinkFiles: data.summary.zeroInternalMarkdownLinkFiles,
  zeroAuditedRouteFiles: data.summary.zeroAuditedRouteFiles,
  safeAutoCandidates: plans.filter((p) => p.editMode === "safe-auto-candidate").length,
  manualReviewRequired: plans.filter((p) => p.editMode === "manual-review-required").length,
  routePlanCounts: plans.reduce((acc, p) => {
    const key = p.primaryRoute || "manual-review/no-primary-route";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}),
};

data.summary = summary;
data.plans = plans;

fs.writeFileSync(planPath, JSON.stringify(data, null, 2) + "\n");

const byRoute = Object.entries(summary.routePlanCounts)
  .map(([route, count]) => `- \`${route}\`: ${count}`)
  .join("\n");

const md = `# Phase B Sprint 1 Routing Plan

Generated: ${summary.generatedAt}

Classifier: ${summary.classifierVersion}

## Scope

This is a planning report only. No blog files were modified.

| Metric | Count |
|---|---:|
| Candidate files | ${summary.candidateFiles} |
| Zero internal Markdown link files | ${summary.zeroInternalMarkdownLinkFiles} |
| Zero audited route files | ${summary.zeroAuditedRouteFiles} |
| Safe auto candidates | ${summary.safeAutoCandidates} |
| Manual review required | ${summary.manualReviewRequired} |

## Planned Primary Route Distribution

${byRoute}

## Candidate Plan

${plans.map((p, i) => `### ${i + 1}. ${p.title}

- File: \`${p.file}\`
- Category: ${p.category || "n/a"}
- Zero internal Markdown links: ${p.zeroInternalMarkdownLinks ? "yes" : "no"}
- Zero audited routes: ${p.zeroAuditedRoutes ? "yes" : "no"}
- Intent: ${p.intent}
- Signals: ${p.signals.length ? p.signals.join(", ") : "none"}
- Primary route: ${p.primaryRoute ? `\`${p.primaryRoute}\`` : "manual review"}
- Secondary route: ${p.secondaryRoute ? `\`${p.secondaryRoute}\`` : "none"}
- CTA style: ${p.ctaStyle}
- Confidence: ${p.confidence}
- Edit mode: ${p.editMode}
${p.recommendedSentence ? `- Suggested sentence: ${p.recommendedSentence}` : "- Suggested sentence: manual review required"}
`).join("\n")}
`;

fs.writeFileSync(path.join(root, "docs/phase-b-sprint-1-routing-plan.md"), md);

console.log("Phase B v4 QA overrides applied to plan only.");
console.log("Safe auto candidates:", summary.safeAutoCandidates);
console.log("Manual review required:", summary.manualReviewRequired);
console.log("Planned primary route distribution:");
for (const [route, count] of Object.entries(summary.routePlanCounts)) {
  console.log(`- ${route}: ${count}`);
}
