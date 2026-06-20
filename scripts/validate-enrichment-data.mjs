import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import {
  SERVICE_PREFIXES,
  canUseSharedCityContent,
  cityIdentitySlug,
  cityServicePath,
  contentKeySlug,
  countySlug,
} from "../src/lib/slugs.js";
import {
  getRenderableGenericRouteEnrichment,
  resolveGenericRouteContext,
  validateGenericSitemapEligibility,
  validateServiceModuleCompatibility,
} from "../src/lib/generic-route-enrichment.js";

const root = process.cwd();
const failures = [];
const today = new Date().toISOString().slice(0, 10);

const fail = (message) => failures.push(message);
const assert = (condition, message) => {
  if (!condition) fail(message);
};
const assertRequiredKeys = (value, keys, label) => {
  for (const key of keys) {
    assert(Object.hasOwn(value, key), `${label} missing required field: ${key}`);
  }
};
const assertArrayFields = (value, keys, label) => {
  for (const key of keys) {
    assert(Array.isArray(value[key]), `${label}.${key} must be an array`);
  }
};

const readJson = (relativePath) => {
  const absolutePath = path.join(root, relativePath);
  try {
    return {
      raw: fs.readFileSync(absolutePath, "utf8"),
      value: JSON.parse(fs.readFileSync(absolutePath, "utf8")),
    };
  } catch (error) {
    fail(`${relativePath} JSON parse failed: ${error.message}`);
    return { raw: "", value: null };
  }
};

const topLevelObjectKeys = (raw) => {
  const keys = [];
  let depth = 0;
  let inString = false;
  let escaped = false;
  let current = "";

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
        if (depth === 1) {
          let lookahead = index + 1;
          while (/\s/.test(raw[lookahead] || "")) lookahead += 1;
          if (raw[lookahead] === ":") keys.push(current);
        }
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      current = "";
    } else if (char === "{" || char === "[") {
      depth += 1;
    } else if (char === "}" || char === "]") {
      depth -= 1;
    }
  }

  return keys;
};

const duplicateValues = (values) =>
  [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

const reviewedAtIsValid = (value) =>
  value === null || /^\d{4}-\d{2}-\d{2}$/.test(String(value));

const forbiddenBehaviorKeys = new Set(["canonical", "noindex", "robots", "sitemap"]);
const findForbiddenKeys = (value, currentPath = "root") => {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => [
    ...(forbiddenBehaviorKeys.has(key) ? [`${currentPath}.${key}`] : []),
    ...findForbiddenKeys(child, `${currentPath}.${key}`),
  ]);
};

const sourceStatuses = new Set(["repo-derived", "manually-verified", "unverified"]);
const regionTypes = new Set(["coastal", "inland", "metro", "rural", "mixed", null]);
const stormExposures = new Set(["low", "moderate", "high", "unknown"]);
const populationStatuses = new Set(["known", "unknown", "verified-zero", "invalid"]);
const contextStatuses = new Set(["present", "absent", "unknown"]);

const countyRequiredFields = [
  "county",
  "countySlug",
  "regionType",
  "coastalContext",
  "stormExposure",
  "floodContext",
  "soilContexts",
  "vegetationContexts",
  "commonAccessContexts",
  "permitContext",
  "propertyContexts",
  "sourceStatus",
  "sourceNotes",
  "reviewedAt",
];
const cityRequiredFields = [
  "city",
  "county",
  "countySlug",
  "cityRouteSlug",
  "cityContentSlug",
  "identityKey",
  "population",
  "populationStatus",
  "propertyContexts",
  "accessConstraints",
  "dominantTreeSpecies",
  "soilContexts",
  "stormContexts",
  "coastalContext",
  "acreageContext",
  "hoaContext",
  "poolContext",
  "utilityContexts",
  "landmarks",
  "nearbyAreas",
  "localNotes",
  "sourceStatus",
  "sourceNotes",
  "reviewedAt",
];
const routeRequiredFields = [
  "publicUrl",
  "cityIdentityKey",
  "service",
  "enabledModules",
  "serviceDecisionNotes",
  "accessNotes",
  "riskNotes",
  "cleanupNotes",
  "permitNotes",
  "emergencyNotes",
  "stumpNotes",
  "exclusions",
  "sourceStatus",
  "sourceNotes",
  "reviewedAt",
];
const pilotRequiredFields = [
  "publicUrl",
  "city",
  "county",
  "service",
  "currentQualityScore",
  "opportunityScore",
  "targetQualityScore",
  "plannedModules",
  "mainProblem",
  "implementationRisk",
  "pilotStatus",
];

const countyFile = readJson("src/data/enrichment/county-context.json");
const cityFile = readJson("src/data/enrichment/city-context.json");
const routeFile = readJson("src/data/enrichment/route-context.json");
const pilotFile = readJson("src/data/enrichment/pilot-routes.json");

const countyContexts = countyFile.value || {};
const cityContexts = cityFile.value || {};
const routeContexts = routeFile.value || [];
const pilotRoutes = pilotFile.value || [];
const cityRouteSource = fs.readFileSync(path.join(root, "src/pages/[slug].astro"), "utf8");
const mainLayoutSource = fs.readFileSync(path.join(root, "src/layouts/MainLayout.astro"), "utf8");
const cityRoutesUseSelfCanonical = /canonical=\{currentFullUrl\}/.test(cityRouteSource);
const cityRoutesDefaultToIndexFollow = /robots\s*=\s*["']index,follow["']/.test(mainLayoutSource);

assert(!Array.isArray(countyContexts), "county-context.json must be keyed by county slug");
assert(!Array.isArray(cityContexts), "city-context.json must be keyed by city identity");
assert(Array.isArray(routeContexts), "route-context.json must be an array");
assert(Array.isArray(pilotRoutes), "pilot-routes.json must be an array");

const countyRawKeys = topLevelObjectKeys(countyFile.raw);
const cityRawKeys = topLevelObjectKeys(cityFile.raw);
assert(duplicateValues(countyRawKeys).length === 0, "duplicate county slug keys found");
assert(duplicateValues(cityRawKeys).length === 0, "duplicate city identity keys found");

const records = parse(fs.readFileSync(path.join(root, "src/data/cities.csv"), "utf8"), {
  columns: true,
  skip_empty_lines: true,
  bom: true,
});

const richSources = {
  "tree-removal": readJson("src/data/city-removal.json").value || {},
  "stump-grinding": readJson("src/data/city-stump.json").value || {},
  "emergency-service": readJson("src/data/city-emergency.json").value || {},
};
const countyPermitData = readJson("src/data/county-permits.json").value || {};

const countyRowsBySlug = new Map();
const cityRowsByIdentity = new Map();
const routesByUrl = new Map();

for (const row of records) {
  const rowCountySlug = countySlug(row.County);
  if (!countyRowsBySlug.has(rowCountySlug)) countyRowsBySlug.set(rowCountySlug, []);
  countyRowsBySlug.get(rowCountySlug).push(row);

  const identityKey = cityIdentitySlug(row.City, row.County);
  cityRowsByIdentity.set(identityKey, row);

  for (const service of SERVICE_PREFIXES) {
    const publicUrl = cityServicePath(service, row.City, row.County);
    const rich =
      canUseSharedCityContent(row.City, row.County) &&
      Boolean(richSources[service][contentKeySlug(row.City)]);
    routesByUrl.set(publicUrl, { row, service, identityKey, rich });
  }
}

assert(records.length === 800, `expected 800 city rows, got ${records.length}`);
assert(cityRowsByIdentity.size === 800, `expected 800 city identities, got ${cityRowsByIdentity.size}`);
assert(routesByUrl.size === 2400, `expected 2400 route identities, got ${routesByUrl.size}`);
assert(Object.keys(countyContexts).length === 67, `expected 67 county contexts, got ${Object.keys(countyContexts).length}`);
assert(Object.keys(cityContexts).length === 30, `expected 30 city contexts, got ${Object.keys(cityContexts).length}`);
assert(routeContexts.length === 30, `expected 30 route contexts, got ${routeContexts.length}`);

for (const [key, context] of Object.entries(countyContexts)) {
  assertRequiredKeys(context, countyRequiredFields, `county ${key}`);
  assertArrayFields(
    context,
    ["soilContexts", "vegetationContexts", "commonAccessContexts", "propertyContexts", "sourceNotes"],
    `county ${key}`,
  );
  assert(key === context.countySlug, `county key mismatch: ${key}`);
  assert(countyRowsBySlug.has(key), `county context not found in cities.csv: ${key}`);
  assert(
    countyRowsBySlug.get(key)?.some((row) => row.County === context.county),
    `county name mismatch: ${key}`,
  );
  assert(regionTypes.has(context.regionType), `invalid regionType for ${key}`);
  assert(contextStatuses.has(context.coastalContext), `invalid coastalContext for ${key}`);
  assert(contextStatuses.has(context.floodContext), `invalid floodContext for ${key}`);
  assert(stormExposures.has(context.stormExposure), `invalid stormExposure for ${key}`);
  assert(sourceStatuses.has(context.sourceStatus), `invalid sourceStatus for county ${key}`);
  assert(reviewedAtIsValid(context.reviewedAt), `invalid reviewedAt for county ${key}`);
  if (context.permitContext !== null) {
    assert(context.permitContext.dataKey === key, `permit dataKey mismatch for county ${key}`);
    assert(Object.hasOwn(countyPermitData, key), `unknown permit dataKey for county ${key}`);
  }
}

for (const [key, context] of Object.entries(cityContexts)) {
  assertRequiredKeys(context, cityRequiredFields, `city ${key}`);
  assertArrayFields(
    context,
    [
      "propertyContexts",
      "accessConstraints",
      "dominantTreeSpecies",
      "soilContexts",
      "stormContexts",
      "utilityContexts",
      "landmarks",
      "nearbyAreas",
      "localNotes",
      "sourceNotes",
    ],
    `city ${key}`,
  );
  const sourceRow = cityRowsByIdentity.get(key);
  assert(Boolean(sourceRow), `city context not found in canonical identity set: ${key}`);
  assert(key === context.identityKey, `city identity key mismatch: ${key}`);
  assert(context.cityRouteSlug === key, `cityRouteSlug mismatch for ${key}`);
  assert(context.countySlug === countySlug(context.county), `city county slug mismatch for ${key}`);
  assert(Boolean(countyContexts[context.countySlug]), `city context has unknown county: ${key}`);
  assert(populationStatuses.has(context.populationStatus), `invalid populationStatus for ${key}`);
  assert(contextStatuses.has(context.coastalContext), `invalid city coastalContext for ${key}`);
  assert(contextStatuses.has(context.acreageContext), `invalid acreageContext for ${key}`);
  assert(contextStatuses.has(context.hoaContext), `invalid hoaContext for ${key}`);
  assert(contextStatuses.has(context.poolContext), `invalid poolContext for ${key}`);
  assert(sourceStatuses.has(context.sourceStatus), `invalid sourceStatus for city ${key}`);
  assert(reviewedAtIsValid(context.reviewedAt), `invalid reviewedAt for city ${key}`);
  assert(
    !(context.population === 0 && context.populationStatus === "known"),
    `population 0 cannot be known for ${key}`,
  );
  if (sourceRow) {
    assert(sourceRow.City === context.city, `city name leakage for ${key}`);
    assert(sourceRow.County === context.county, `county leakage for ${key}`);
  }
}

const routeUrls = routeContexts.map((context) => context.publicUrl);
assert(duplicateValues(routeUrls).length === 0, "duplicate public URL in route-context.json");

let serviceModuleMismatchCount = 0;
let identityLeakageCount = 0;
let renderableRouteContexts = 0;
let sitemapEligibleRouteContexts = 0;

for (const context of routeContexts) {
  assertRequiredKeys(context, routeRequiredFields, `route ${context.publicUrl || "<unknown>"}`);
  assertArrayFields(
    context,
    [
      "enabledModules",
      "serviceDecisionNotes",
      "accessNotes",
      "riskNotes",
      "cleanupNotes",
      "permitNotes",
      "emergencyNotes",
      "stumpNotes",
      "exclusions",
      "sourceNotes",
    ],
    `route ${context.publicUrl || "<unknown>"}`,
  );
  const modeledRoute = routesByUrl.get(context.publicUrl);
  assert(Boolean(modeledRoute), `route context URL is outside the 2400-route set: ${context.publicUrl}`);
  assert(SERVICE_PREFIXES.includes(context.service), `invalid service for ${context.publicUrl}`);
  assert(context.publicUrl.startsWith(`/${context.service}-`), `service prefix mismatch for ${context.publicUrl}`);
  assert(sourceStatuses.has(context.sourceStatus), `invalid sourceStatus for ${context.publicUrl}`);
  assert(reviewedAtIsValid(context.reviewedAt), `invalid reviewedAt for ${context.publicUrl}`);

  const compatibility = validateServiceModuleCompatibility(
    context.service,
    context.enabledModules,
  );
  assert(
    duplicateValues(context.enabledModules || []).length === 0,
    `duplicate enabled module for ${context.publicUrl}`,
  );
  if (!compatibility.ok) serviceModuleMismatchCount += 1;
  assert(compatibility.ok, `wrong service module for ${context.publicUrl}: ${compatibility.invalidModules.join(", ")}`);

  const sitemapEligibility = validateGenericSitemapEligibility(context, today);
  assert(
    sitemapEligibility.ok,
    `invalid sitemap eligibility for ${context.publicUrl}: ${sitemapEligibility.errors.join("; ")}`,
  );
  if (sitemapEligibility.eligible) sitemapEligibleRouteContexts += 1;

  if (modeledRoute) {
    if (
      modeledRoute.service !== context.service ||
      modeledRoute.identityKey !== context.cityIdentityKey
    ) {
      identityLeakageCount += 1;
    }
    assert(modeledRoute.service === context.service, `route service leakage for ${context.publicUrl}`);
    assert(modeledRoute.identityKey === context.cityIdentityKey, `route identity leakage for ${context.publicUrl}`);
    assert(Boolean(cityContexts[context.cityIdentityKey]), `route has no matching pilot city context: ${context.publicUrl}`);

    if (sitemapEligibility.eligible) {
      const expectedPublicUrl = cityServicePath(
        context.service,
        modeledRoute.row.City,
        modeledRoute.row.County,
      );
      assert(!modeledRoute.rich, `sitemap-eligible route must remain generic: ${context.publicUrl}`);
      assert(
        context.publicUrl === expectedPublicUrl,
        `sitemap-eligible route URL mismatch: ${context.publicUrl} !== ${expectedPublicUrl}`,
      );
      assert(cityRoutesUseSelfCanonical, "sitemap-eligible city routes must use currentFullUrl as canonical");
      assert(cityRoutesDefaultToIndexFollow, "sitemap-eligible city routes must default to index,follow");
    }

    try {
      const resolvedContext = resolveGenericRouteContext({
        city: modeledRoute.row.City,
        county: modeledRoute.row.County,
        service: context.service,
      });
      const renderableBlocks = getRenderableGenericRouteEnrichment(resolvedContext);
      if (renderableBlocks.length > 0) renderableRouteContexts += 1;
      if (context.sourceStatus !== "manually-verified") {
        assert(
          renderableBlocks.length === 0,
          `unverified route context must not render: ${context.publicUrl}`,
        );
      }
    } catch (error) {
      fail(error.message);
    }
  }
}

const pilotUrls = pilotRoutes.map((route) => route.publicUrl);
const pilotIdentities = pilotRoutes.map((route) => cityIdentitySlug(route.city, route.county));
const pilotServiceCounts = Object.fromEntries(SERVICE_PREFIXES.map((service) => [service, 0]));

for (const pilot of pilotRoutes) {
  assertRequiredKeys(pilot, pilotRequiredFields, `pilot ${pilot.publicUrl || "<unknown>"}`);
  assertArrayFields(pilot, ["plannedModules", "mainProblem"], `pilot ${pilot.publicUrl || "<unknown>"}`);
  const modeledRoute = routesByUrl.get(pilot.publicUrl);
  if (pilotServiceCounts[pilot.service] !== undefined) pilotServiceCounts[pilot.service] += 1;
  assert(pilot.pilotStatus === "planned", `pilotStatus must be planned for ${pilot.publicUrl}`);
  assert(Boolean(modeledRoute), `pilot URL is outside the 2400-route set: ${pilot.publicUrl}`);
  assert(modeledRoute?.service === pilot.service, `pilot service mismatch for ${pilot.publicUrl}`);
  assert(modeledRoute?.row.City === pilot.city, `pilot city mismatch for ${pilot.publicUrl}`);
  assert(modeledRoute?.row.County === pilot.county, `pilot county mismatch for ${pilot.publicUrl}`);
  assert(modeledRoute ? !modeledRoute.rich : false, `pilot route must remain generic: ${pilot.publicUrl}`);
  assert(Boolean(cityContexts[cityIdentitySlug(pilot.city, pilot.county)]), `pilot city context missing: ${pilot.publicUrl}`);

  const routeContext = routeContexts.find((context) => context.publicUrl === pilot.publicUrl);
  assert(Boolean(routeContext), `pilot route context missing: ${pilot.publicUrl}`);
  assert(
    JSON.stringify(routeContext?.enabledModules || []) === JSON.stringify(pilot.plannedModules || []),
    `pilot module plan differs from route context: ${pilot.publicUrl}`,
  );
  const pilotCompatibility = validateServiceModuleCompatibility(pilot.service, pilot.plannedModules);
  assert(
    pilotCompatibility.ok,
    `pilot has wrong service module for ${pilot.publicUrl}: ${pilotCompatibility.invalidModules.join(", ")}`,
  );
}

assert(pilotRoutes.length === 30, `expected 30 pilot routes, got ${pilotRoutes.length}`);
assert(duplicateValues(pilotUrls).length === 0, "duplicate pilot URL found");
assert(new Set(pilotIdentities).size === 30, `expected 30 pilot city identities, got ${new Set(pilotIdentities).size}`);
for (const service of SERVICE_PREFIXES) {
  assert(pilotServiceCounts[service] === 10, `expected 10 ${service} pilot routes, got ${pilotServiceCounts[service]}`);
}

const forbiddenFields = findForbiddenKeys({ countyContexts, cityContexts, routeContexts, pilotRoutes });
assert(forbiddenFields.length === 0, `production behavior fields are not allowed: ${forbiddenFields.join(", ")}`);
const eligibleRouteUrls = routeContexts
  .filter((context) => context.sitemapEligible === true)
  .map((context) => context.publicUrl);
assert(
  duplicateValues(eligibleRouteUrls).length === 0,
  "duplicate sitemap-eligible public URL found",
);

const summary = {
  countyContexts: Object.keys(countyContexts).length,
  cityContexts: Object.keys(cityContexts).length,
  routeContexts: routeContexts.length,
  pilotRoutes: pilotRoutes.length,
  pilotServiceCounts,
  pilotCityIdentities: new Set(pilotIdentities).size,
  serviceModuleMismatches: serviceModuleMismatchCount,
  identityOrCountyLeakage: identityLeakageCount,
  duplicateCountySlugs: duplicateValues(countyRawKeys).length,
  duplicateCityIdentities: duplicateValues(cityRawKeys).length,
  duplicatePublicUrls: duplicateValues(routeUrls).length,
  duplicatePilotUrls: duplicateValues(pilotUrls).length,
  genericPilotRoutes: pilotRoutes.filter((pilot) => !routesByUrl.get(pilot.publicUrl)?.rich).length,
  productionBehaviorFields: forbiddenFields.length,
  renderableRouteContexts,
  sitemapEligibleRouteContexts,
  cityRoutesUseSelfCanonical,
  cityRoutesDefaultToIndexFollow,
};

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, summary, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, summary }, null, 2));
