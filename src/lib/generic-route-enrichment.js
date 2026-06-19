import countyContexts from "../data/enrichment/county-context.json" with { type: "json" };
import cityContexts from "../data/enrichment/city-context.json" with { type: "json" };
import routeContexts from "../data/enrichment/route-context.json" with { type: "json" };
import {
  SERVICE_PREFIXES,
  cityIdentitySlug,
  cityServicePath,
  countySlug,
} from "./slugs.js";

export const SERVICE_MODULES = Object.freeze({
  "tree-removal": Object.freeze([
    "risk-review",
    "targets-and-rigging",
    "permit-check",
    "debris-and-cleanup",
    "property-protection",
  ]),
  "stump-grinding": Object.freeze([
    "machine-access",
    "grinding-depth",
    "root-zone",
    "replanting",
    "pavers-and-pools",
  ]),
  "emergency-service": Object.freeze([
    "active-hazard",
    "storm-access",
    "utility-risk",
    "documentation",
    "temporary-safety",
  ]),
});

const routeContextByUrl = new Map(
  routeContexts.map((context) => [context.publicUrl, context]),
);

export function getCountyContext(slug) {
  return countyContexts[String(slug || "")] ?? null;
}

export function getCityContext(identityKey) {
  return cityContexts[String(identityKey || "")] ?? null;
}

export function getRouteContext(publicUrl) {
  return routeContextByUrl.get(String(publicUrl || "")) ?? null;
}

export function getAllowedModulesForService(service) {
  return SERVICE_MODULES[service] ? [...SERVICE_MODULES[service]] : [];
}

export function validateServiceModuleCompatibility(service, modules = []) {
  const allowed = new Set(getAllowedModulesForService(service));
  if (!Array.isArray(modules)) {
    return { ok: false, invalidModules: ["<modules-must-be-an-array>"] };
  }

  const supplied = modules;
  const invalidModules = supplied.filter((module) => !allowed.has(module));

  return {
    ok: SERVICE_PREFIXES.includes(service) && invalidModules.length === 0,
    invalidModules,
  };
}

export function resolveGenericRouteContext({ city, county, service }) {
  if (!SERVICE_PREFIXES.includes(service)) {
    throw new Error(`Unsupported enrichment service: ${service}`);
  }

  const identityKey = cityIdentitySlug(city, county);
  const publicUrl = cityServicePath(service, city, county);
  const expectedCountySlug = countySlug(county);
  const countyContext = getCountyContext(expectedCountySlug);
  const cityContext = getCityContext(identityKey);
  const routeContext = getRouteContext(publicUrl);

  if (countyContext && countyContext.countySlug !== expectedCountySlug) {
    throw new Error(`County context identity mismatch for ${expectedCountySlug}`);
  }

  if (
    cityContext &&
    (cityContext.identityKey !== identityKey || cityContext.countySlug !== expectedCountySlug)
  ) {
    throw new Error(`City context identity mismatch for ${identityKey}`);
  }

  if (
    routeContext &&
    (routeContext.cityIdentityKey !== identityKey || routeContext.service !== service)
  ) {
    throw new Error(`Route context identity mismatch for ${publicUrl}`);
  }

  if (routeContext) {
    const compatibility = validateServiceModuleCompatibility(
      service,
      routeContext.enabledModules,
    );
    if (!compatibility.ok) {
      throw new Error(
        `Incompatible enrichment modules for ${publicUrl}: ${compatibility.invalidModules.join(", ")}`,
      );
    }
  }

  return {
    identityKey,
    publicUrl,
    county: countyContext,
    city: cityContext,
    route: routeContext,
    allowedModules: getAllowedModulesForService(service),
  };
}
