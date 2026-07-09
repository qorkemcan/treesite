import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const apply = process.argv.includes("--apply");

if (!dryRun && !apply) {
  console.error("Use either --dry-run or --apply");
  process.exit(1);
}

const planPath = path.join(root, "docs/phase-b-sprint-1-routing-plan.json");

if (!fs.existsSync(planPath)) {
  console.error("Missing plan file: docs/phase-b-sprint-1-routing-plan.json");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(planPath, "utf8"));
const plans = data.plans || [];

function splitFrontmatter(content) {
  if (!content.startsWith("---")) {
    return { frontmatter: "", body: content };
  }

  const end = content.indexOf("\n---", 3);
  if (end === -1) {
    return { frontmatter: "", body: content };
  }

  return {
    frontmatter: content.slice(0, end + 4),
    body: content.slice(end + 4),
  };
}

function chooseInsertion(body) {
  const faqMatch = body.search(/\n##\s+(FAQ|FAQs|Frequently Asked Questions)\b/i);
  const workingBody = faqMatch >= 0 ? body.slice(0, faqMatch) : body;

  const preferredHeadings = [
    /##\s+What Homeowners Should Do Next[^\n]*\n/i,
    /##\s+What to Do Next[^\n]*\n/i,
    /##\s+Before You Schedule[^\n]*\n/i,
    /##\s+Before You Decide[^\n]*\n/i,
    /##\s+When to Call[^\n]*\n/i,
    /##\s+The Bottom Line[^\n]*\n/i,
    /##\s+Final Thoughts[^\n]*\n/i,
  ];

  for (const re of preferredHeadings) {
    const match = workingBody.match(re);
    if (match && typeof match.index === "number") {
      const insertAt = match.index + match[0].length;
      return {
        index: insertAt,
        mode: "inside-existing-next-step-section",
      };
    }
  }

  const lastH2 = [...workingBody.matchAll(/\n##\s+[^\n]+\n/g)].pop();

  if (lastH2 && typeof lastH2.index === "number") {
    return {
      index: lastH2.index + lastH2[0].length,
      mode: "inside-last-h2-section",
    };
  }

  return {
    index: workingBody.trimEnd().length,
    mode: "append-to-body-end",
  };
}

function applySentence(content, sentence) {
  const { frontmatter, body } = splitFrontmatter(content);

  if (content.includes(sentence)) {
    return {
      changed: false,
      reason: "sentence-already-present",
      nextContent: content,
      insertionMode: "none",
    };
  }

  const insertion = chooseInsertion(body);
  const before = body.slice(0, insertion.index);
  const after = body.slice(insertion.index);

  const insertText = `\n${sentence}\n`;

  const nextBody = `${before}${insertText}${after}`;
  const nextContent = frontmatter ? `${frontmatter}${nextBody}` : nextBody;

  return {
    changed: nextContent !== content,
    reason: "planned",
    nextContent,
    insertionMode: insertion.mode,
  };
}

const safePlans = plans.filter(
  (p) =>
    p.editMode === "safe-auto-candidate" &&
    p.recommendedSentence &&
    p.primaryRoute
);

const manualPlans = plans.filter((p) => p.editMode !== "safe-auto-candidate");

const results = [];

for (const p of safePlans) {
  const abs = path.join(root, p.file);
  const before = fs.readFileSync(abs, "utf8");

  const result = applySentence(before, p.recommendedSentence);

  if (apply && result.changed) {
    fs.writeFileSync(abs, result.nextContent);
  }

  results.push({
    file: p.file,
    title: p.title,
    intent: p.intent,
    primaryRoute: p.primaryRoute,
    secondaryRoute: p.secondaryRoute || "",
    insertionMode: result.insertionMode,
    changed: result.changed,
    reason: result.reason,
    sentence: p.recommendedSentence,
  });
}

const changed = results.filter((r) => r.changed);

const routeCounts = changed.reduce((acc, r) => {
  acc[r.primaryRoute] = (acc[r.primaryRoute] || 0) + 1;
  return acc;
}, {});

const report = `# Phase B Sprint 1 Apply ${dryRun ? "Dry Run" : "Report"}

Mode: ${dryRun ? "dry-run only; no blog files modified" : "apply; blog files modified"}
Generated: ${new Date().toISOString()}

## Summary

| Metric | Count |
|---|---:|
| Safe plan items considered | ${safePlans.length} |
| Planned/changed blog files | ${changed.length} |
| Manual review items skipped | ${manualPlans.length} |

## Route Distribution for Planned/Changed Files

${Object.entries(routeCounts).map(([route, count]) => `- \`${route}\`: ${count}`).join("\n") || "- none"}

## Manual Review Items Skipped

${manualPlans.map((p) => `- \`${p.file}\` — ${p.title}`).join("\n") || "- none"}

## Planned/Changed Items

${results.map((r, i) => `### ${i + 1}. ${r.title}

- File: \`${r.file}\`
- Intent: ${r.intent}
- Primary route: \`${r.primaryRoute}\`
- Secondary route: ${r.secondaryRoute ? `\`${r.secondaryRoute}\`` : "none"}
- Insertion mode: ${r.insertionMode}
- Changed: ${r.changed ? "yes" : "no"}
- Reason: ${r.reason}
- Sentence: ${r.sentence}
`).join("\n")}
`;

const outPath = path.join(
  root,
  dryRun
    ? "docs/phase-b-sprint-1-apply-dry-run.md"
    : "docs/phase-b-sprint-1-apply-report.md"
);

fs.writeFileSync(outPath, report);

console.log(`Phase B Sprint 1 ${dryRun ? "dry-run" : "apply"} complete.`);
console.log("Safe plan items considered:", safePlans.length);
console.log(`${dryRun ? "Planned" : "Changed"} blog files:`, changed.length);
console.log("Manual review items skipped:", manualPlans.length);
console.log("Route distribution:");
for (const [route, count] of Object.entries(routeCounts)) {
  console.log(`- ${route}: ${count}`);
}
console.log("Wrote:", path.relative(root, outPath));

if (dryRun) {
  console.log("No blog files were modified.");
}
