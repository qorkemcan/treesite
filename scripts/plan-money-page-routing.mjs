import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baselinePath = path.join(root, "docs/phase-b-money-routing-baseline.json");

if (!fs.existsSync(baselinePath)) {
  console.error("Missing baseline file: docs/phase-b-money-routing-baseline.json");
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));

const zeroInternal = new Set(baseline.zeroInternalMarkdownLinkFiles || []);
const zeroAudited = new Set(baseline.zeroAuditedRouteFiles || []);
const candidates = [...new Set([...zeroInternal, ...zeroAudited])].sort();

function readFile(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function frontmatter(content) {
  if (!content.startsWith("---")) return {};
  const end = content.indexOf("\n---", 3);
  if (end === -1) return {};

  const raw = content.slice(3, end).trim();
  const data = {};

  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let value = m[2].trim();
    value = value.replace(/^["']|["']$/g, "");
    data[key] = value;
  }

  return data;
}

function titleFrom(content, fm, rel) {
  if (fm.title) return fm.title;
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();

  return path.basename(rel, path.extname(rel))
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function has(text, pattern) {
  return pattern.test(text);
}

function classify(rel, content, fm, title) {
  const haystack = [
    rel,
    title,
    fm.description || "",
    fm.excerpt || "",
    fm.category || "",
  ].join(" ").toLowerCase();

  const signals = [];

  const isCountyGuide = has(haystack, /\bcounty tree removal guide\b/);
  const isSpeciesGuide = has(haystack, /\bdo i have\b/);

  const emergencyCore = has(
    haystack,
    /\bemergency tree\b|\btree emergency\b|\bemergency tree removal\b|\bafter heavy rain\b|\bhelp arrives\b|\bproblem become an emergency\b|\bsame-day tree removal\b|\bblocked access\b|\bblocked driveway\b|\broof damage\b|\bfallen tree\b|\btree fell\b/
  );

  const stormSecondary = has(
    haystack,
    /\bstorm-damaged\b|\bstorm damaged\b|\bhurricane damage\b|\bhurricane season\b|\bstorm cleanup\b|\bstorm risk\b|\bstorm prep\b/
  );

  const stumpCore = has(
    haystack,
    /\bstump grinding\b|\bgrind the stump\b|\btree stump\b|\bstump\b|\bstumps\b|\bstump grinder\b|\brots a tree stump\b/
  );

  const rootCore = has(
    haystack,
    /\broot damage\b|\broots damage\b|\bhardscape\b|\bsurface roots\b|\broot cleanup\b/
  );

  const trimmingCore = has(
    haystack,
    /\btrimming\b|\btrim\b|\bpruning\b|\bprune\b|\btopping\b|\bcanopy\b|\blimb\b|\blimbs\b|\bbranches\b|\bfronds\b|\bmangrove trimming\b/
  );

  const trustCore = has(
    haystack,
    /\blicensed\b|\binsured\b|\binsurance\b|\bliability\b|\bcertificate\b|\bbefore hiring\b|\bhiring\b|\btrust\b|\bred flag\b|\bcontractor\b/
  );

  const removalCore = has(
    haystack,
    /\btree removal\b|\bremoval\b|\bremove a tree\b|\bremove the tree\b|\bdead tree\b|\bquote\b|\bestimate\b|\bcost\b|\bnew construction\b|\bclearing your lot\b|\bnear a house\b|\bpool cage\b|\bdriveway\b|\bpaver patio\b|\bpalm removal\b/
  );

  const healthEducationOnly = has(
    haystack,
    /\bfertilize\b|\bstressed tree\b|\bwhite spots\b|\bleaves turning brown\b|\bnutrient issue\b|\bfungus\b|\bscale\b/
  );

  let intent = "manual review";
  let primaryRoute = "";
  let secondaryRoute = "";
  let ctaStyle = "manual review only";
  let confidence = "low";
  let editMode = "manual-review-required";

  if (isCountyGuide) {
    signals.push("county tree removal guide");
    if (stormSecondary) signals.push("storm/hurricane secondary context");

    intent = "county tree removal planning";
    primaryRoute = "/services/tree-removal/";
    secondaryRoute = stormSecondary ? "/services/emergency-response/" : "";
    ctaStyle = "county removal planning with optional storm context";
    confidence = "high";
    editMode = "safe-auto-candidate";
  } else if (emergencyCore) {
    signals.push("true emergency wording");

    intent = "emergency / active hazard";
    primaryRoute = "/services/emergency-response/";
    secondaryRoute = removalCore ? "/services/tree-removal/" : "";
    ctaStyle = "urgent but not alarmist";
    confidence = "high";
    editMode = "safe-auto-candidate";
  } else if (trustCore) {
    signals.push("hiring / insurance / trust");

    intent = "hiring / insurance / trust";
    primaryRoute = "/services/tree-removal/";
    secondaryRoute = "/trust-safety/";
    ctaStyle = "trust-forward hiring guidance";
    confidence = "high";
    editMode = "safe-auto-candidate";
  } else if (
    stumpCore &&
    !isSpeciesGuide &&
    has(haystack, /\bwhat rots a tree stump\b|\bstump grinding\b|\bgrind the stump\b|\btree removal, stump grinding, and replanting\b/)
  ) {
    signals.push("explicit stump / cleanup");

    intent = "stump / root / cleanup";
    primaryRoute = "/services/stump-grinding/";
    secondaryRoute = removalCore ? "/services/tree-removal/" : "";
    ctaStyle = "post-removal cleanup decision";
    confidence = "high";
    editMode = "safe-auto-candidate";
  } else if (
    stumpCore &&
    removalCore &&
    !isSpeciesGuide
  ) {
    signals.push("tree removal with stump/cleanup secondary");

    intent = "removal with stump / cleanup consideration";
    primaryRoute = "/services/tree-removal/";
    secondaryRoute = "/services/stump-grinding/";
    ctaStyle = "removal scope with cleanup detail";
    confidence = "high";
    editMode = "safe-auto-candidate";
  } else if (rootCore && removalCore && !isSpeciesGuide) {
    signals.push("root damage with removal decision");

    intent = "root damage / removal decision";
    primaryRoute = "/services/stump-grinding/";
    secondaryRoute = "/services/tree-removal/";
    ctaStyle = "root and removal scope comparison";
    confidence = "medium";
    editMode = "safe-auto-candidate";
  } else if (trimmingCore && removalCore) {
    signals.push("trim-versus-remove decision");

    intent = "trim-versus-remove decision";
    primaryRoute = "/services/tree-trimming/";
    secondaryRoute = "/services/tree-removal/";
    ctaStyle = "compare trimming and removal scope";
    confidence = "high";
    editMode = "safe-auto-candidate";
  } else if (trimmingCore) {
    signals.push("trimming / pruning / prevention");

    intent = "trimming / pruning / prevention";
    primaryRoute = "/services/tree-trimming/";
    secondaryRoute = "";
    ctaStyle = "preventive maintenance";
    confidence = "high";
    editMode = "safe-auto-candidate";
  } else if (removalCore || isSpeciesGuide) {
    if (removalCore) signals.push("removal / quote / estimate");
    if (isSpeciesGuide) signals.push("species guide with removal questions");

    intent = isSpeciesGuide ? "species identification with removal questions" : "removal / quote / estimate";
    primaryRoute = "/services/tree-removal/";
    secondaryRoute = "";
    ctaStyle = "scope and estimate clarity";
    confidence = isSpeciesGuide ? "medium" : "high";
    editMode = "safe-auto-candidate";
  }

  if (healthEducationOnly && !removalCore && !trimmingCore && !stumpCore && !emergencyCore) {
    signals.push("education-only tree health topic");
    intent = "education-only / weak money-page fit";
    primaryRoute = "";
    secondaryRoute = "";
    ctaStyle = "manual review only";
    confidence = "low";
    editMode = "manual-review-required";
  }

  return {
    intent,
    signals,
    primaryRoute,
    secondaryRoute,
    ctaStyle,
    confidence,
    editMode,
  };
}

function recommendedSentence(plan) {
  if (plan.editMode === "manual-review-required") return "";

  if (plan.primaryRoute === "/services/emergency-response/") {
    return "If the situation involves a fallen tree, blocked access, roof damage, or an immediate safety concern, start with [emergency tree response](/services/emergency-response/) before scheduling standard removal.";
  }

  if (plan.primaryRoute === "/services/tree-removal/" && plan.secondaryRoute === "/services/stump-grinding/") {
    return "For a clearer scope, review [tree removal](/services/tree-removal/) expectations first, then confirm whether [stump grinding](/services/stump-grinding/) belongs in the same job.";
  }

  if (plan.primaryRoute === "/services/stump-grinding/" && plan.secondaryRoute === "/services/tree-removal/") {
    return "When roots, hardscape, or leftover wood are part of the problem, compare [stump grinding](/services/stump-grinding/) with [tree removal](/services/tree-removal/) so the cleanup scope is clear.";
  }

  if (plan.primaryRoute === "/services/stump-grinding/") {
    return "If the tree has already been removed, compare cleanup needs with [stump grinding](/services/stump-grinding/) before treating the job as finished.";
  }

  if (plan.primaryRoute === "/services/tree-trimming/" && plan.secondaryRoute === "/services/tree-removal/") {
    return "When the decision is not obvious, compare [tree trimming](/services/tree-trimming/) with [tree removal](/services/tree-removal/) so the work matches the actual risk.";
  }

  if (plan.primaryRoute === "/services/tree-trimming/") {
    return "For preventive work, [tree trimming](/services/tree-trimming/) should focus on clearance, canopy balance, storm preparation, and avoiding unnecessary removal.";
  }

  if (plan.secondaryRoute === "/trust-safety/") {
    return "Before hiring, compare the proposed scope with [professional tree removal](/services/tree-removal/) expectations and review basic [trust and safety](/trust-safety/) checks.";
  }

  if (plan.secondaryRoute === "/services/emergency-response/") {
    return "For planned work, start with [tree removal](/services/tree-removal/) scope; if storm damage or blocked access is involved, review [emergency response](/services/emergency-response/) expectations as well.";
  }

  if (plan.primaryRoute === "/services/tree-removal/") {
    return "For a clearer scope, review [tree removal](/services/tree-removal/) expectations before approving the estimate, cleanup plan, or schedule.";
  }

  return "";
}

const plans = candidates.map((rel) => {
  const content = readFile(rel);
  const fm = frontmatter(content);
  const title = titleFrom(content, fm, rel);
  const plan = classify(rel, content, fm, title);

  return {
    file: rel,
    title,
    category: fm.category || "",
    zeroInternalMarkdownLinks: zeroInternal.has(rel),
    zeroAuditedRoutes: zeroAudited.has(rel),
    ...plan,
    recommendedSentence: recommendedSentence(plan),
  };
});

const summary = {
  generatedAt: new Date().toISOString(),
  classifierVersion: "v3-strict-emergency-stump-override",
  candidateFiles: plans.length,
  zeroInternalMarkdownLinkFiles: zeroInternal.size,
  zeroAuditedRouteFiles: zeroAudited.size,
  safeAutoCandidates: plans.filter((p) => p.editMode === "safe-auto-candidate").length,
  manualReviewRequired: plans.filter((p) => p.editMode === "manual-review-required").length,
  routePlanCounts: plans.reduce((acc, p) => {
    const key = p.primaryRoute || "manual-review/no-primary-route";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}),
};

fs.writeFileSync(
  path.join(root, "docs/phase-b-sprint-1-routing-plan.json"),
  JSON.stringify({ summary, plans }, null, 2) + "\n"
);

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

console.log("Phase B Sprint 1 planning complete.");
console.log("Classifier: v3-strict-emergency-stump-override");
console.log("Candidate files:", summary.candidateFiles);
console.log("Safe auto candidates:", summary.safeAutoCandidates);
console.log("Manual review required:", summary.manualReviewRequired);
console.log("Planned primary route distribution:");
for (const [route, count] of Object.entries(summary.routePlanCounts)) {
  console.log(`- ${route}: ${count}`);
}
console.log("Wrote:");
console.log("- docs/phase-b-sprint-1-routing-plan.json");
console.log("- docs/phase-b-sprint-1-routing-plan.md");
