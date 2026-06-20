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

const SERVICE_MODULE_PRESENTATION = Object.freeze({
  "tree-removal": Object.freeze({
    "risk-review": Object.freeze({ title: "Risk review", noteField: "riskNotes" }),
    "targets-and-rigging": Object.freeze({ title: "Targets and rigging", noteField: "accessNotes" }),
    "permit-check": Object.freeze({ title: "Permit check", noteField: "permitNotes" }),
    "debris-and-cleanup": Object.freeze({ title: "Debris and cleanup", noteField: "cleanupNotes" }),
    "property-protection": Object.freeze({ title: "Property protection", noteField: "serviceDecisionNotes" }),
  }),
  "stump-grinding": Object.freeze({
    "machine-access": Object.freeze({ title: "Machine access", noteField: "accessNotes" }),
    "grinding-depth": Object.freeze({ title: "Grinding depth", noteField: "stumpNotes" }),
    "root-zone": Object.freeze({ title: "Root-zone review", noteField: "riskNotes" }),
    replanting: Object.freeze({ title: "Replanting plan", noteField: "cleanupNotes" }),
    "pavers-and-pools": Object.freeze({ title: "Pavers and pools", noteField: "serviceDecisionNotes" }),
  }),
  "emergency-service": Object.freeze({
    "active-hazard": Object.freeze({ title: "Active hazard", noteField: "riskNotes" }),
    "storm-access": Object.freeze({ title: "Storm access", noteField: "accessNotes" }),
    "utility-risk": Object.freeze({ title: "Utility risk", noteField: "emergencyNotes" }),
    documentation: Object.freeze({ title: "Documentation", noteField: "serviceDecisionNotes" }),
    "temporary-safety": Object.freeze({ title: "Temporary safety", noteField: "cleanupNotes" }),
  }),
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

export function getRenderableGenericRouteEnrichment(context) {
  const routeContext = context?.route;
  if (!routeContext || routeContext.sourceStatus !== "manually-verified") return [];

  const compatibility = validateServiceModuleCompatibility(
    routeContext.service,
    routeContext.enabledModules,
  );
  if (!compatibility.ok) {
    throw new Error(
      `Incompatible enrichment modules for ${routeContext.publicUrl}: ${compatibility.invalidModules.join(", ")}`,
    );
  }

  const presentation = SERVICE_MODULE_PRESENTATION[routeContext.service] || {};
  return routeContext.enabledModules.flatMap((module) => {
    const modulePresentation = presentation[module];
    if (!modulePresentation) return [];

    const notes = Array.isArray(routeContext[modulePresentation.noteField])
      ? routeContext[modulePresentation.noteField]
          .map((note) => String(note || "").trim())
          .filter(Boolean)
      : [];

    return notes.length > 0
      ? [{ module, title: modulePresentation.title, notes }]
      : [];
  });
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
