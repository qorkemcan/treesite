import fs from "node:fs";
import path from "node:path";
import {
  getBlogMoneyLinks,
  phaseOneExpansionCandidates,
  protectedCoreMoneyUrls,
} from "../src/data/internal-links.js";

const blogDir = path.resolve("src/content/blog");
const protectedCore = new Set(protectedCoreMoneyUrls);
const expansionUrls = new Set(
  phaseOneExpansionCandidates.map((candidate) => `/${candidate.servicePrefix}-${candidate.slug}/`),
);
const allowedUrls = new Set([...protectedCore, ...expansionUrls]);

const readFrontmatter = (raw) => {
  if (!raw.startsWith("---")) return {};

  const end = raw.indexOf("\n---", 3);
  if (end === -1) return {};

  const data = {};
  const lines = raw.slice(3, end).trim().split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    let value = rawValue.trim();

    if (value === "") {
      const list = [];
      while (lines[index + 1]?.match(/^\s+-\s+/)) {
        index += 1;
        list.push(lines[index].replace(/^\s+-\s+/, "").trim().replace(/^["']|["']$/g, ""));
      }
      data[key] = list;
      continue;
    }

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (value === "true") {
      data[key] = true;
    } else if (value === "false") {
      data[key] = false;
    } else {
      data[key] = value;
    }
  }

  return data;
};

const serviceFromHref = (href) => {
  if (href.startsWith("/tree-removal-")) return "tree-removal";
  if (href.startsWith("/stump-grinding-")) return "stump-grinding";
  if (href.startsWith("/emergency-service-")) return "emergency-service";
  return "unknown";
};

const byCountDesc = (entries) => [...entries].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

const files = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".md"))
  .sort();

const hrefCounts = new Map();
const serviceCounts = new Map();
const postsOverLimit = [];
const postsWithDuplicateLinks = [];
const candidateLeaks = new Set();

let postsAnalyzed = 0;
let totalLinks = 0;

for (const file of files) {
  const slug = file.replace(/\.md$/, "");
  if (/\s\(\d+\)$/.test(slug)) continue;

  const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
  const data = readFrontmatter(raw);
  if (data.draft) continue;

  postsAnalyzed += 1;

  const links = getBlogMoneyLinks({
    slug,
    title: data.title || "",
    category: data.category || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
  });

  totalLinks += links.length;

  if (links.length > 6) {
    postsOverLimit.push({ slug, count: links.length });
  }

  const postHrefs = links.map((link) => link.href);
  const uniquePostHrefs = new Set(postHrefs);
  if (uniquePostHrefs.size !== postHrefs.length) {
    postsWithDuplicateLinks.push(slug);
  }

  for (const href of postHrefs) {
    hrefCounts.set(href, (hrefCounts.get(href) || 0) + 1);
    serviceCounts.set(serviceFromHref(href), (serviceCounts.get(serviceFromHref(href)) || 0) + 1);

    if (!allowedUrls.has(href)) {
      candidateLeaks.add(href);
    }
  }
}

const protectedRetained = protectedCoreMoneyUrls.filter((href) => hrefCounts.has(href));
const expansionReceiving = byCountDesc(
  [...hrefCounts.entries()].filter(([href]) => expansionUrls.has(href)),
);

console.log("Blog money-link report");
console.log("======================");
console.log(`posts analyzed: ${postsAnalyzed}`);
console.log(`total links emitted: ${totalLinks}`);
console.log(`unique service URLs: ${hrefCounts.size}`);
console.log(`posts with >6 money links: ${postsOverLimit.length}`);
console.log(`posts with duplicate money links: ${postsWithDuplicateLinks.length}`);
console.log(`protected core URLs retained: ${protectedRetained.length}/${protectedCoreMoneyUrls.length}`);
console.log(`expansion URLs receiving links: ${expansionReceiving.length}/${phaseOneExpansionCandidates.length}`);
console.log(`candidate pool leaks: ${candidateLeaks.size}`);

console.log("\nlinks by service type");
for (const [service, count] of byCountDesc(serviceCounts.entries())) {
  console.log(`${String(count).padStart(5)} ${service}`);
}

console.log("\ntop receiving URLs");
for (const [href, count] of byCountDesc(hrefCounts.entries()).slice(0, 25)) {
  console.log(`${String(count).padStart(5)} ${href}`);
}

console.log("\nexpansion URLs receiving links");
for (const [href, count] of expansionReceiving) {
  console.log(`${String(count).padStart(5)} ${href}`);
}

if (candidateLeaks.size > 0) {
  console.log("\ncandidate pool leaks");
  for (const href of [...candidateLeaks].sort()) {
    console.log(href);
  }
}

if (postsOverLimit.length > 0) {
  console.log("\nposts with >6 money links");
  for (const post of postsOverLimit) {
    console.log(`${post.slug}: ${post.count}`);
  }
}

if (postsWithDuplicateLinks.length > 0) {
  console.log("\nposts with duplicate money links");
  for (const slug of postsWithDuplicateLinks) {
    console.log(slug);
  }
}
