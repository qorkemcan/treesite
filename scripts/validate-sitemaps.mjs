import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import {
  SERVICE_PREFIXES,
  canUseSharedCityContent,
  cityServiceSlug,
  contentKeySlug,
  countySlug,
} from "../src/lib/slugs.js";
import { validateGenericSitemapEligibility } from "../src/lib/generic-route-enrichment.js";

const SITE_URL = "https://www.protreetrim.com";
const POSTS_PER_PAGE = 12;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const root = process.cwd();
const publicDir = path.join(root, "public");

const failures = [];
const assertEqual = (label, actual, expected) => {
  if (actual !== expected) failures.push(`${label}: expected ${expected}, got ${actual}`);
};
const assertTrue = (label, condition) => {
  if (!condition) failures.push(label);
};

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));

function pageUrl(pathname = "/") {
  const cleanPath = pathname === "/" || pathname === ""
    ? "/"
    : `/${String(pathname).replace(/^\/+|\/+$/g, "")}/`;

  return new URL(cleanPath, SITE_URL).href;
}

function fileUrl(fileName = "") {
  return new URL(`/${String(fileName).replace(/^\/+/, "")}`, SITE_URL).href;
}

function normalizeCategory(value = "") {
  const clean = String(value).trim().replace(/\s+/g, " ");
  const aliases = {
    "emergency storm": "Emergency & Storm",
    "emergency & storm": "Emergency & Storm",
    "florida laws & property risk": "Florida Laws & Property Risk",
    "tree care & cleanup": "Tree Care & Cleanup",
    "tree health & disease": "Tree Health & Disease",
    "landscaping & planting": "Landscaping & Planting",
    "local florida guides": "Local Florida Guides",
    "tree removal": "Tree Removal",
  };

  return aliases[clean.toLowerCase()] ?? clean;
}

function slugifyCategory(value = "") {
  return normalizeCategory(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function stripMarkdownExtension(fileName = "") {
  return fileName.replace(/(\.md|\.mdx)+$/i, "");
}

function isLikelyDuplicateCopy(fileName = "") {
  return /\s\(\d+\)\.(md|mdx)$/i.test(fileName);
}

function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const data = {};
  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("- ")) continue;
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!rawValue) {
      data[key] = "";
      continue;
    }
    if (rawValue === "true") {
      data[key] = true;
      continue;
    }
    if (rawValue === "false") {
      data[key] = false;
      continue;
    }

    data[key] = rawValue.replace(/^["']|["']$/g, "");
  }

  return data;
}

function normalizeRequiredDate(value, label) {
  if (!value) throw new Error(`${label} is required`);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`${label} is invalid: ${value}`);
  return date.toISOString().split("T")[0];
}

function assertDate(value, label) {
  assertTrue(`${label} is YYYY-MM-DD`, DATE_PATTERN.test(String(value)));
}

function maxDate(values) {
  return values.filter(Boolean).sort().at(-1);
}

function getPagePosts(entries, page) {
  const start = (page - 1) * POSTS_PER_PAGE;
  return entries.slice(start, start + POSTS_PER_PAGE);
}

function unescapeXml(value = "") {
  return value
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function parseUrlset(xml, fileName) {
  assertTrue(`${fileName} has urlset root`, /<urlset\b/.test(xml) && xml.includes("</urlset>"));
  const entries = [];
  for (const match of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<priority>([^<]+)<\/priority>\s*<\/url>/g)) {
    entries.push({
      loc: unescapeXml(match[1]),
      lastmod: match[2],
      priority: match[3],
    });
  }
  assertEqual(`${fileName} parsed url count`, entries.length, (xml.match(/<url>/g) || []).length);
  return entries;
}

function parseSitemapIndex(xml) {
  assertTrue("sitemap-index.xml has sitemapindex root", /<sitemapindex\b/.test(xml) && xml.includes("</sitemapindex>"));
  const entries = [];
  for (const match of xml.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/sitemap>/g)) {
    entries.push({
      loc: unescapeXml(match[1]),
      lastmod: match[2],
    });
  }
  assertEqual("sitemap-index.xml parsed child count", entries.length, (xml.match(/<sitemap>/g) || []).length);
  return entries;
}

const manifest = readJson("src/data/sitemap-lastmod.json");
const records = parse(fs.readFileSync(path.join(root, "src/data/cities.csv"), "utf8"), {
  columns: true,
  skip_empty_lines: true,
  bom: true,
});
const richSources = {
  "tree-removal": readJson("src/data/city-removal.json"),
  "stump-grinding": readJson("src/data/city-stump.json"),
  "emergency-service": readJson("src/data/city-emergency.json"),
};
const routeContexts = readJson("src/data/enrichment/route-context.json");

const staticPages = [
  "/",
  "/about/",
  "/contact/",
  "/services/",
  "/gallery/",
  "/trust-safety/",
  "/privacy/",
  "/join-network/",
  "/partnerships/",
  "/tools/",
  "/tools/florida-tree-care-advisor/",
  "/tools/florida-problem-tree-guide/",
  "/tools/emergency-tree-safety-checklist/",
  "/services/tree-removal/",
  "/services/tree-trimming/",
  "/services/stump-grinding/",
  "/services/emergency-response/",
  "/services/land-clearing/",
  "/services/commercial-services/",
];

const staticSet = new Set(staticPages);
const manifestStaticSet = new Set(Object.keys(manifest.staticUrls || {}));
assertEqual("Manifest static URL count", manifestStaticSet.size, staticSet.size);
for (const page of staticSet) assertTrue(`Manifest has static URL ${page}`, manifestStaticSet.has(page));
for (const page of manifestStaticSet) assertTrue(`Manifest static URL is used ${page}`, staticSet.has(page));

const today = new Date().toISOString().split("T")[0];
const allManifestDates = [
  ...Object.entries(manifest.staticUrls || {}).map(([key, value]) => [`staticUrls.${key}`, value]),
  ...Object.entries(manifest.serviceSourceFallbacks || {}).map(([key, value]) => [`serviceSourceFallbacks.${key}`, value]),
  ["countyHubFallback", manifest.countyHubFallback],
];
for (const [label, date] of allManifestDates) {
  assertDate(date, label);
  assertTrue(`${label} is not future`, date <= today);
}

const routes = [];
for (const row of records) {
  for (const servicePrefix of SERVICE_PREFIXES) {
    const contentKey = contentKeySlug(row.City);
    const hasRich =
      canUseSharedCityContent(row.City, row.County) &&
      Boolean(richSources[servicePrefix][contentKey]);

    routes.push({
      slug: cityServiceSlug(servicePrefix, row.City, row.County),
      loc: pageUrl(`/${cityServiceSlug(servicePrefix, row.City, row.County)}/`),
      servicePrefix,
      city: row.City,
      county: row.County,
      contentKey,
      hasRich,
    });
  }
}
const routeSet = new Set(routes.map((route) => route.loc));
const richRouteSet = new Set(routes.filter((route) => route.hasRich).map((route) => route.loc));
const genericRouteSet = new Set(routes.filter((route) => !route.hasRich).map((route) => route.loc));
const routeByLoc = new Map(routes.map((route) => [route.loc, route]));
const eligibleGenericRoutes = new Map();
const cityRouteSource = fs.readFileSync(path.join(root, "src/pages/[slug].astro"), "utf8");
const mainLayoutSource = fs.readFileSync(path.join(root, "src/layouts/MainLayout.astro"), "utf8");
const cityRoutesUseSelfCanonical = /canonical=\{currentFullUrl\}/.test(cityRouteSource);
const cityRoutesDefaultToIndexFollow = /robots\s*=\s*["']index,follow["']/.test(mainLayoutSource);

for (const context of routeContexts) {
  const eligibility = validateGenericSitemapEligibility(context, today);
  assertTrue(
    `Valid sitemap eligibility for ${context.publicUrl}: ${eligibility.errors.join("; ")}`,
    eligibility.ok,
  );
  if (!eligibility.eligible) continue;

  const loc = pageUrl(context.publicUrl);
  const route = routeByLoc.get(loc);
  assertTrue(`Eligible generic route exists ${context.publicUrl}`, Boolean(route));
  assertTrue(`Eligible generic route remains generic ${context.publicUrl}`, route ? !route.hasRich : false);
  assertTrue(
    `Eligible generic route service matches ${context.publicUrl}`,
    route ? route.servicePrefix === context.service : false,
  );
  assertTrue(`Eligible generic route has self canonical contract ${context.publicUrl}`, cityRoutesUseSelfCanonical);
  assertTrue(`Eligible generic route has index,follow contract ${context.publicUrl}`, cityRoutesDefaultToIndexFollow);
  if (route && !route.hasRich) {
    eligibleGenericRoutes.set(loc, {
      context,
      expectedFile: `sitemap-county-${countySlug(route.county)}.xml`,
    });
  }
}

const blogFiles = fs
  .readdirSync(path.join(root, "src/content/blog"))
  .filter((file) => /\.(md|mdx)$/i.test(file))
  .filter((file) => !isLikelyDuplicateCopy(file));
const seenBlogSlugs = new Set();
const blogEntries = [];
for (const file of blogFiles) {
  const frontmatter = parseFrontmatter(fs.readFileSync(path.join(root, "src/content/blog", file), "utf8"));
  if (frontmatter.draft === true) continue;
  const slug = stripMarkdownExtension(file);
  if (seenBlogSlugs.has(slug)) continue;
  seenBlogSlugs.add(slug);
  blogEntries.push({
    slug,
    category: normalizeCategory(frontmatter.category || ""),
    pubDate: normalizeRequiredDate(frontmatter.pubDate, `${file}.pubDate`),
    updatedDate: normalizeRequiredDate(frontmatter.updatedDate || frontmatter.pubDate, `${file}.updatedDate`),
  });
}
blogEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

const expectedBlogLastmods = new Map();
const totalBlogPages = Math.ceil(blogEntries.length / POSTS_PER_PAGE);
for (let page = 1; page <= totalBlogPages; page += 1) {
  const pagePosts = getPagePosts(blogEntries, page);
  expectedBlogLastmods.set(
    pageUrl(page === 1 ? "/blog/" : `/blog/page/${page}/`),
    maxDate(pagePosts.map((post) => post.updatedDate || post.pubDate)),
  );
}
for (const post of blogEntries) {
  expectedBlogLastmods.set(pageUrl(`/blog/${post.slug}/`), post.updatedDate || post.pubDate);
}

const categoryMap = new Map();
for (const post of blogEntries) {
  if (!post.category) continue;
  const slug = slugifyCategory(post.category);
  if (!categoryMap.has(slug)) categoryMap.set(slug, []);
  categoryMap.get(slug).push(post);
}
for (const [categorySlug, posts] of categoryMap.entries()) {
  const categoryPosts = [...posts].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  expectedBlogLastmods.set(
    pageUrl(`/blog/category/${categorySlug}/`),
    maxDate(categoryPosts.map((post) => post.updatedDate || post.pubDate)),
  );
  const totalCategoryPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);
  for (let page = 2; page <= totalCategoryPages; page += 1) {
    const pagePosts = getPagePosts(categoryPosts, page);
    expectedBlogLastmods.set(
      pageUrl(`/blog/category/${categorySlug}/page/${page}/`),
      maxDate(pagePosts.map((post) => post.updatedDate || post.pubDate)),
    );
  }
}

const xmlFiles = fs.readdirSync(publicDir).filter((file) => /^sitemap.*\.xml$/.test(file)).sort();
const countyFiles = xmlFiles.filter((file) => /^sitemap-county-.*\.xml$/.test(file));
const childFiles = xmlFiles.filter((file) => file !== "sitemap-index.xml");
assertEqual("Total XML file count", xmlFiles.length, 70);
assertEqual("County sitemap count", countyFiles.length, 67);
assertEqual("Child sitemap count", childFiles.length, 69);

const fileEntries = new Map();
const allUrlEntries = [];
for (const file of childFiles) {
  const xml = fs.readFileSync(path.join(publicDir, file), "utf8");
  const entries = parseUrlset(xml, file);
  fileEntries.set(file, entries);
  allUrlEntries.push(...entries.map((entry) => ({ ...entry, file })));
}

const indexEntries = parseSitemapIndex(fs.readFileSync(path.join(publicDir, "sitemap-index.xml"), "utf8"));
assertEqual("Sitemap index child entry count", indexEntries.length, 69);
const indexChildFiles = indexEntries.map((entry) => new URL(entry.loc).pathname.slice(1));
for (const file of indexChildFiles) assertTrue(`Index child exists ${file}`, childFiles.includes(file));
for (const file of childFiles) assertTrue(`Child file is in index ${file}`, indexChildFiles.includes(file));

const allLocs = allUrlEntries.map((entry) => entry.loc);
const duplicateAllLocs = allLocs.filter((loc, index) => allLocs.indexOf(loc) !== index);
assertEqual("Duplicate all sitemap loc count", duplicateAllLocs.length, 0);

const serviceLocs = allLocs.filter((loc) => {
  const pathname = new URL(loc).pathname;
  return SERVICE_PREFIXES.some((servicePrefix) => pathname.startsWith(`/${servicePrefix}-`));
});
const duplicateServiceLocs = serviceLocs.filter((loc, index) => serviceLocs.indexOf(loc) !== index);
const outsideRouteLocs = serviceLocs.filter((loc) => !routeSet.has(loc));
const genericLocs = serviceLocs.filter((loc) => genericRouteSet.has(loc));
const expectedServiceLocCount = richRouteSet.size + eligibleGenericRoutes.size;
assertEqual("City/service sitemap URL count", serviceLocs.length, expectedServiceLocCount);
assertEqual("Duplicate city/service loc count", duplicateServiceLocs.length, 0);
assertEqual("Route set outside city/service loc count", outsideRouteLocs.length, 0);
assertEqual("Generic city/service sitemap URL count", genericLocs.length, eligibleGenericRoutes.size);
for (const loc of serviceLocs) {
  assertTrue(
    `City/service loc is rich or explicitly eligible ${loc}`,
    richRouteSet.has(loc) || eligibleGenericRoutes.has(loc),
  );
}
for (const loc of genericLocs) {
  assertTrue(`Generic sitemap loc is explicitly eligible ${loc}`, eligibleGenericRoutes.has(loc));
}
for (const [loc, { context, expectedFile }] of eligibleGenericRoutes) {
  const matches = allUrlEntries.filter((entry) => entry.loc === loc);
  assertEqual(`Eligible generic loc count ${context.publicUrl}`, matches.length, 1);
  if (matches.length === 1) {
    assertEqual(`Eligible generic county sitemap ${context.publicUrl}`, matches[0].file, expectedFile);
    assertEqual(
      `Eligible generic lastmod ${context.publicUrl}`,
      matches[0].lastmod,
      context.contentUpdatedAt,
    );
  }
}

const expectedAllLocCount =
  staticPages.length +
  expectedBlogLastmods.size +
  countyFiles.length +
  richRouteSet.size +
  eligibleGenericRoutes.size;
assertEqual("Total child sitemap URL count", allLocs.length, expectedAllLocCount);

const blogCategoryLocs = allLocs.filter((loc) => loc.includes("/blog/category/"));
const duplicateBlogCategoryLocs = blogCategoryLocs.filter((loc, index) => blogCategoryLocs.indexOf(loc) !== index);
assertEqual("Duplicate blog category loc count", duplicateBlogCategoryLocs.length, 0);
assertEqual(
  "tree-health-and-disease category root count",
  allLocs.filter((loc) => loc === pageUrl("/blog/category/tree-health-and-disease/")).length,
  1,
);

for (const entry of allUrlEntries) {
  assertDate(entry.lastmod, `${entry.file}:${entry.loc}`);
  assertTrue(`${entry.file}:${entry.loc} lastmod is not future`, entry.lastmod <= today);
}
for (const entry of indexEntries) {
  assertDate(entry.lastmod, `sitemap-index:${entry.loc}`);
  assertTrue(`sitemap-index:${entry.loc} lastmod is not future`, entry.lastmod <= today);

  const file = new URL(entry.loc).pathname.slice(1);
  const childMax = maxDate((fileEntries.get(file) || []).map((item) => item.lastmod));
  assertEqual(`Index lastmod matches child max ${file}`, entry.lastmod, childMax);
}

const sitemapMainEntries = fileEntries.get("sitemap-main.xml") || [];
const staticLocs = new Set(staticPages.map((page) => pageUrl(page)));
for (const page of staticPages) {
  const loc = pageUrl(page);
  const entry = sitemapMainEntries.find((item) => item.loc === loc);
  assertTrue(`Static URL is in sitemap-main ${page}`, Boolean(entry));
  if (entry) assertEqual(`Static URL lastmod ${page}`, entry.lastmod, manifest.staticUrls[page]);
}
for (const entry of sitemapMainEntries) {
  assertTrue(`sitemap-main loc has static manifest ${entry.loc}`, staticLocs.has(entry.loc));
}

const sitemapBlogEntries = fileEntries.get("sitemap-blog.xml") || [];
for (const [loc, expectedLastmod] of expectedBlogLastmods.entries()) {
  const entry = sitemapBlogEntries.find((item) => item.loc === loc);
  assertTrue(`Blog sitemap loc exists ${loc}`, Boolean(entry));
  if (entry) assertEqual(`Blog/category/pagination lastmod ${loc}`, entry.lastmod, expectedLastmod);
}

const summary = {
  totalXml: xmlFiles.length,
  countySitemaps: countyFiles.length,
  childSitemaps: childFiles.length,
  indexEntries: indexEntries.length,
  totalLocs: allLocs.length,
  cityServiceLocs: serviceLocs.length,
  eligibleGenericRoutes: eligibleGenericRoutes.size,
  genericRoutesOutsideSitemaps: genericRouteSet.size - eligibleGenericRoutes.size,
  duplicateCityServiceLocs: duplicateServiceLocs.length,
  outsideRouteLocs: outsideRouteLocs.length,
  duplicateAllLocs: duplicateAllLocs.length,
  duplicateBlogCategoryLocs: duplicateBlogCategoryLocs.length,
  richRoutes: richRouteSet.size,
  genericRoutes: genericRouteSet.size,
  blogExpectedLocs: expectedBlogLastmods.size,
};

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, summary, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, summary }, null, 2));
