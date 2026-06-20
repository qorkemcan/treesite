import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import {
  COLLISION_CANONICAL_COUNTIES,
  EXPECTED_COLLISION_SECONDARY_SLUGS,
  SERVICE_PREFIXES,
  canUseSharedCityContent,
  cityIdentitySlug,
  cityServiceSlug,
  contentKeySlug,
  countySlug,
} from "../src/lib/slugs.js";
import { validateGenericSitemapEligibility } from "../src/lib/generic-route-enrichment.js";

const SITE_URL = "https://www.protreetrim.com";
const checkPublicSitemaps = process.argv.includes("--check-public-sitemaps");
const root = process.cwd();

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));

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

const failures = [];
const assertEqual = (label, actual, expected) => {
  if (actual !== expected) {
    failures.push(`${label}: expected ${expected}, got ${actual}`);
  }
};
const assertTrue = (label, condition) => {
  if (!condition) failures.push(label);
};

const routes = [];
for (const row of records) {
  for (const servicePrefix of SERVICE_PREFIXES) {
    const slug = cityServiceSlug(servicePrefix, row.City, row.County);
    const contentKey = contentKeySlug(row.City);
    const hasRich =
      canUseSharedCityContent(row.City, row.County) &&
      Boolean(richSources[servicePrefix][contentKey]);

    routes.push({
      slug,
      url: `${SITE_URL}/${slug}/`,
      city: row.City,
      county: row.County,
      servicePrefix,
      contentKey,
      hasRich,
    });
  }
}

const cityIdentities = new Set(records.map((row) => cityIdentitySlug(row.City, row.County)));
const routeSlugs = routes.map((route) => route.slug);
const routeSlugSet = new Set(routeSlugs);
const routeDuplicates = routeSlugs.filter((slug, index) => routeSlugs.indexOf(slug) !== index);
const richRoutes = routes.filter((route) => route.hasRich);
const genericRoutes = routes.filter((route) => !route.hasRich);
const eligibleGenericRoutes = [];

for (const context of routeContexts) {
  const eligibility = validateGenericSitemapEligibility(context);
  assertTrue(
    `Valid sitemap eligibility for ${context.publicUrl}: ${eligibility.errors.join("; ")}`,
    eligibility.ok,
  );
  if (!eligibility.eligible) continue;

  const fullUrl = new URL(context.publicUrl, SITE_URL).href;
  const route = routes.find((item) => item.url === fullUrl);
  assertTrue(`Sitemap-eligible route exists ${context.publicUrl}`, Boolean(route));
  assertTrue(`Sitemap-eligible route is generic ${context.publicUrl}`, route ? !route.hasRich : false);
  if (route && !route.hasRich) eligibleGenericRoutes.push(route);
}

assertEqual("CSV city row count", records.length, 800);
assertEqual("Collision-aware city identity count", cityIdentities.size, 800);
assertEqual("Total generated city/service route count", routes.length, 2400);
assertEqual("Unique generated city/service route count", routeSlugSet.size, 2400);
assertEqual("Duplicate public route count", routeDuplicates.length, 0);
assertEqual("Rich route count", richRoutes.length, 819);
assertEqual("Generic route count", genericRoutes.length, 1581);

const expectedCollisionSlugs = Object.keys(COLLISION_CANONICAL_COUNTIES).sort();
const configuredSecondarySlugs = Object.keys(EXPECTED_COLLISION_SECONDARY_SLUGS).sort();
assertEqual(
  "Collision config and secondary config size",
  configuredSecondarySlugs.join(","),
  expectedCollisionSlugs.join(","),
);

for (const [citySlug, canonicalCounty] of Object.entries(COLLISION_CANONICAL_COUNTIES)) {
  const matchingRows = records.filter((row) => cityIdentitySlug(row.City, row.County).startsWith(citySlug));
  const canonicalRows = records.filter(
    (row) => cityIdentitySlug(row.City, row.County) === citySlug && countySlug(row.County) === canonicalCounty,
  );
  assertEqual(`${citySlug} canonical row count`, canonicalRows.length, 1);

  for (const secondaryCounty of EXPECTED_COLLISION_SECONDARY_SLUGS[citySlug] || []) {
    const secondaryRoute = `${citySlug}-${secondaryCounty}`;
    assertTrue(
      `${secondaryRoute} secondary city identity exists`,
      matchingRows.some((row) => cityIdentitySlug(row.City, row.County) === secondaryRoute),
    );
  }
}

for (const servicePrefix of SERVICE_PREFIXES) {
  for (const key of Object.keys(richSources[servicePrefix])) {
    const matchingRichRoutes = routes.filter(
      (route) =>
        route.servicePrefix === servicePrefix &&
        route.contentKey === key &&
        route.hasRich,
    );
    assertEqual(`${servicePrefix}:${key} rich key route binding`, matchingRichRoutes.length, 1);
  }
}

for (const city of ["Land O' Lakes", "Town 'n' Country", "Glen Saint Mary"]) {
  for (const servicePrefix of SERVICE_PREFIXES) {
    const route = routes.find((item) => item.servicePrefix === servicePrefix && item.city === city);
    assertTrue(`${servicePrefix} ${city} route exists`, Boolean(route));
    assertTrue(`${servicePrefix} ${city} uses rich content`, route?.hasRich);
  }
}

for (const [citySlug, secondaryCounties] of Object.entries(EXPECTED_COLLISION_SECONDARY_SLUGS)) {
  for (const secondaryCounty of secondaryCounties) {
    for (const servicePrefix of SERVICE_PREFIXES) {
      const route = routes.find((item) => item.slug === `${servicePrefix}-${citySlug}-${secondaryCounty}`);
      assertTrue(`${servicePrefix}-${citySlug}-${secondaryCounty} exists`, Boolean(route));
      assertTrue(`${servicePrefix}-${citySlug}-${secondaryCounty} is generic`, route ? !route.hasRich : false);
    }
  }
}

const modeledSitemapLocs = [...richRoutes, ...eligibleGenericRoutes].map((route) => route.url);
const duplicateModeledSitemapLocs = modeledSitemapLocs.filter(
  (loc, index) => modeledSitemapLocs.indexOf(loc) !== index,
);
const modeledSitemapOutsideRoutes = modeledSitemapLocs.filter(
  (loc) => !routes.some((route) => route.url === loc),
);
assertEqual(
  "Modeled city/service sitemap loc count",
  modeledSitemapLocs.length,
  richRoutes.length + eligibleGenericRoutes.length,
);
assertEqual("Modeled sitemap duplicate service loc count", duplicateModeledSitemapLocs.length, 0);
assertEqual("Modeled sitemap service loc outside route count", modeledSitemapOutsideRoutes.length, 0);

if (checkPublicSitemaps) {
  const publicDir = path.join(root, "public");
  const locs = [];
  for (const fileName of fs.readdirSync(publicDir).filter((file) => /^sitemap-county-.*\.xml$/.test(file))) {
    const xml = fs.readFileSync(path.join(publicDir, fileName), "utf8");
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const loc = match[1]
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, "&");
      if (SERVICE_PREFIXES.some((servicePrefix) => loc.includes(`/${servicePrefix}-`))) {
        locs.push(loc);
      }
    }
  }

  const duplicatePublicLocs = locs.filter((loc, index) => locs.indexOf(loc) !== index);
  const publicOutsideRoutes = locs.filter((loc) => !routeSlugSet.has(loc.replace(`${SITE_URL}/`, "").replace(/\/$/, "")));
  assertEqual("Public sitemap city/service loc count", locs.length, modeledSitemapLocs.length);
  assertEqual("Public sitemap duplicate service loc count", duplicatePublicLocs.length, 0);
  assertEqual("Public sitemap service loc outside route count", publicOutsideRoutes.length, 0);
}

const summary = {
  csvRows: records.length,
  cityIdentities: cityIdentities.size,
  routeCount: routes.length,
  uniqueRoutes: routeSlugSet.size,
  richRoutes: richRoutes.length,
  genericRoutes: genericRoutes.length,
  sitemapEligibleGenericRoutes: eligibleGenericRoutes.length,
  modeledSitemapLocs: modeledSitemapLocs.length,
  checkedPublicSitemaps: checkPublicSitemaps,
};

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, summary, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, summary }, null, 2));
