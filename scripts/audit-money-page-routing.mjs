import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const candidateBlogDirs = [
  "src/content/blog",
  "src/pages/blog",
  "content/blog",
  "blog",
];

const blogDir = candidateBlogDirs
  .map((p) => path.join(root, p))
  .find((p) => fs.existsSync(p) && fs.statSync(p).isDirectory());

if (!blogDir) {
  console.error("Could not find blog directory. Checked:", candidateBlogDirs.join(", "));
  process.exit(1);
}

const auditedRoutes = [
  "/services/tree-removal/",
  "/services/tree-trimming/",
  "/services/stump-grinding/",
  "/services/emergency-response/",
  "/trust-safety/",
  "/contact/",
];

const routeGroups = {
  treeRemoval: ["/services/tree-removal/"],
  treeTrimming: ["/services/tree-trimming/"],
  stumpGrinding: ["/services/stump-grinding/"],
  emergencyResponse: ["/services/emergency-response/"],
  trustSafety: ["/trust-safety/"],
  contact: ["/contact/"],
  county: ["/county/"],
  city: ["/tree-service/"],
};

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.name.startsWith("._")) continue;
    if (entry.name === ".DS_Store") continue;

    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      files.push(full);
    }
  }

  return files;
}

function normalizeRoute(raw) {
  if (!raw) return "";
  let value = raw.trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return value;
  }

  value = value.split("#")[0].split("?")[0];

  if (value.startsWith("./") || value.startsWith("../")) return value;
  if (!value.startsWith("/")) return value;

  if (!value.endsWith("/")) value += "/";
  return value;
}

function markdownLinks(content) {
  const links = [];
  const re = /(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;

  while ((match = re.exec(content)) !== null) {
    links.push(normalizeRoute(match[1]));
  }

  return links;
}

function countOccurrences(content, needle) {
  return content.split(needle).length - 1;
}

const files = walk(blogDir).sort();

const rows = [];
const routeTotals = Object.fromEntries(auditedRoutes.map((r) => [r, 0]));
const groupTotals = Object.fromEntries(Object.keys(routeGroups).map((k) => [k, 0]));

for (const file of files) {
  const rel = path.relative(root, file);
  const content = fs.readFileSync(file, "utf8");
  const links = markdownLinks(content);

  const internalMarkdownLinks = links.filter(
    (href) => href.startsWith("/") && !href.startsWith("//")
  );

  const auditedRouteLinks = internalMarkdownLinks.filter((href) =>
    auditedRoutes.includes(href)
  );

  for (const route of auditedRoutes) {
    routeTotals[route] += countOccurrences(content, route);
  }

  for (const [group, routes] of Object.entries(routeGroups)) {
    groupTotals[group] += routes.reduce(
      (sum, route) => sum + countOccurrences(content, route),
      0
    );
  }

  rows.push({
    file: rel,
    internalMarkdownLinkCount: internalMarkdownLinks.length,
    auditedRouteLinkCount: auditedRouteLinks.length,
    auditedRoutes: [...new Set(auditedRouteLinks)],
  });
}

const zeroInternal = rows.filter((r) => r.internalMarkdownLinkCount === 0);
const zeroAuditedRoutes = rows.filter((r) => r.auditedRouteLinkCount === 0);

const output = {
  generatedAt: new Date().toISOString(),
  blogDir: path.relative(root, blogDir),
  totalMarkdownFiles: files.length,
  auditedRoutes,
  routeTotals,
  groupTotals,
  zeroInternalMarkdownLinkCount: zeroInternal.length,
  zeroAuditedRouteFileCount: zeroAuditedRoutes.length,
  zeroInternalMarkdownLinkFiles: zeroInternal.map((r) => r.file),
  zeroAuditedRouteFiles: zeroAuditedRoutes.map((r) => r.file),
  rows,
};

fs.writeFileSync(
  path.join(root, "docs/phase-b-money-routing-baseline.json"),
  JSON.stringify(output, null, 2) + "\n"
);

fs.writeFileSync(
  path.join(root, "docs/phase-b-zero-internal-link-files.txt"),
  zeroInternal.map((r) => r.file).join("\n") + (zeroInternal.length ? "\n" : "")
);

fs.writeFileSync(
  path.join(root, "docs/phase-b-zero-service-route-files.txt"),
  zeroAuditedRoutes.map((r) => r.file).join("\n") + (zeroAuditedRoutes.length ? "\n" : "")
);

const md = `# Phase B Money Page Routing Baseline

Generated: ${output.generatedAt}

Blog directory: \`${output.blogDir}\`

## Summary

| Metric | Count |
|---|---:|
| Markdown files audited | ${output.totalMarkdownFiles} |
| Zero internal Markdown link files | ${output.zeroInternalMarkdownLinkCount} |
| Zero audited service/contact/trust route files | ${output.zeroAuditedRouteFileCount} |

## Audited Route Totals

${Object.entries(routeTotals)
  .map(([route, count]) => `- \`${route}\`: ${count}`)
  .join("\n")}

## Route Group Totals

${Object.entries(groupTotals)
  .map(([group, count]) => `- ${group}: ${count}`)
  .join("\n")}
`;

fs.writeFileSync(path.join(root, "docs/phase-b-routing-counts-before.md"), md);

console.log("Phase B baseline audit complete.");
console.log("Blog directory:", output.blogDir);
console.log("Markdown files audited:", output.totalMarkdownFiles);
console.log("Zero internal Markdown link files:", output.zeroInternalMarkdownLinkCount);
console.log("Zero audited route files:", output.zeroAuditedRouteFileCount);
console.log("Wrote:");
console.log("- docs/phase-b-money-routing-baseline.json");
console.log("- docs/phase-b-zero-internal-link-files.txt");
console.log("- docs/phase-b-zero-service-route-files.txt");
console.log("- docs/phase-b-routing-counts-before.md");
