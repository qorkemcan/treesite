export const SERVICE_PREFIXES = [
  "tree-removal",
  "stump-grinding",
  "emergency-service",
];

export const CONTENT_KEY_ALIASES = {
  "glen-saint-mary": "glen-st-mary",
};

export const LEGACY_ROUTE_REDIRECTS = {
  "land-o'-lakes": "land-o-lakes",
  "town-'n'-country": "town-n-country",
  "glen-st-mary": "glen-saint-mary",
};

export const COLLISION_CANONICAL_COUNTIES = {
  "golden-gate": "collier",
  nocatee: "st-johns",
  sweetwater: "miami-dade",
  "lake-butler": "orange",
  baker: "okaloosa",
  "five-points": "washington",
  arlington: "citrus",
  "oak-grove": "hardee",
  "white-springs": "liberty",
  "cherry-lake": "sumter",
  eastgate: "sarasota",
};

export const EXPECTED_COLLISION_SECONDARY_SLUGS = {
  "golden-gate": ["martin"],
  nocatee: ["desoto"],
  sweetwater: ["liberty"],
  "lake-butler": ["union"],
  baker: ["bay"],
  "five-points": ["columbia"],
  arlington: ["duval"],
  "oak-grove": ["gulf"],
  "white-springs": ["hamilton"],
  "cherry-lake": ["madison"],
  eastgate: ["manatee"],
};

export function baseSlug(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function countySlug(county = "") {
  return baseSlug(county);
}

export function routeSlug(city = "") {
  return baseSlug(city);
}

export function contentKeySlug(city = "") {
  const slug = baseSlug(city);
  return CONTENT_KEY_ALIASES[slug] ?? slug;
}

export function isCollisionCity(city = "") {
  return Object.hasOwn(COLLISION_CANONICAL_COUNTIES, routeSlug(city));
}

export function isCanonicalCollisionRow(city = "", county = "") {
  const citySlug = routeSlug(city);
  const canonicalCounty = COLLISION_CANONICAL_COUNTIES[citySlug];
  return !canonicalCounty || canonicalCounty === countySlug(county);
}

export function cityIdentitySlug(city = "", county = "") {
  const citySlug = routeSlug(city);
  if (isCanonicalCollisionRow(city, county)) {
    return citySlug;
  }
  return `${citySlug}-${countySlug(county)}`;
}

export function cityServiceSlug(servicePrefix, city = "", county = "") {
  return `${servicePrefix}-${cityIdentitySlug(city, county)}`;
}

export function cityServicePath(servicePrefix, city = "", county = "") {
  return `/${cityServiceSlug(servicePrefix, city, county)}/`;
}

export function canUseSharedCityContent(city = "", county = "") {
  return isCanonicalCollisionRow(city, county);
}

export function legacyCityServiceRedirects() {
  return SERVICE_PREFIXES.flatMap((servicePrefix) =>
    Object.entries(LEGACY_ROUTE_REDIRECTS).map(([legacySlug, canonicalSlug]) => ({
      source: `/${servicePrefix}-${legacySlug}`,
      destination: `/${servicePrefix}-${canonicalSlug}/`,
    })),
  );
}
