const MAX_ALERT_AGE_MS = 8 * 60 * 60 * 1000;
const CLOCK_SKEW_TOLERANCE_MS = 5 * 60 * 1000;

export const FLORIDA_COUNTIES = Object.freeze([
  "Alachua",
  "Baker",
  "Bay",
  "Bradford",
  "Brevard",
  "Broward",
  "Calhoun",
  "Charlotte",
  "Citrus",
  "Clay",
  "Collier",
  "Columbia",
  "DeSoto",
  "Dixie",
  "Duval",
  "Escambia",
  "Flagler",
  "Franklin",
  "Gadsden",
  "Gilchrist",
  "Glades",
  "Gulf",
  "Hamilton",
  "Hardee",
  "Hendry",
  "Hernando",
  "Highlands",
  "Hillsborough",
  "Holmes",
  "Indian River",
  "Jackson",
  "Jefferson",
  "Lafayette",
  "Lake",
  "Lee",
  "Leon",
  "Levy",
  "Liberty",
  "Madison",
  "Manatee",
  "Marion",
  "Martin",
  "Miami-Dade",
  "Monroe",
  "Nassau",
  "Okaloosa",
  "Okeechobee",
  "Orange",
  "Osceola",
  "Palm Beach",
  "Pasco",
  "Pinellas",
  "Polk",
  "Putnam",
  "Santa Rosa",
  "Sarasota",
  "Seminole",
  "St. Johns",
  "St. Lucie",
  "Sumter",
  "Suwannee",
  "Taylor",
  "Union",
  "Volusia",
  "Wakulla",
  "Walton",
  "Washington",
]);

export const FLORIDA_COUNTY_UGC_CODES = Object.freeze({
  FLC001: "Alachua",
  FLC003: "Baker",
  FLC005: "Bay",
  FLC007: "Bradford",
  FLC009: "Brevard",
  FLC011: "Broward",
  FLC013: "Calhoun",
  FLC015: "Charlotte",
  FLC017: "Citrus",
  FLC019: "Clay",
  FLC021: "Collier",
  FLC023: "Columbia",
  FLC027: "DeSoto",
  FLC029: "Dixie",
  FLC031: "Duval",
  FLC033: "Escambia",
  FLC035: "Flagler",
  FLC037: "Franklin",
  FLC039: "Gadsden",
  FLC041: "Gilchrist",
  FLC043: "Glades",
  FLC045: "Gulf",
  FLC047: "Hamilton",
  FLC049: "Hardee",
  FLC051: "Hendry",
  FLC053: "Hernando",
  FLC055: "Highlands",
  FLC057: "Hillsborough",
  FLC059: "Holmes",
  FLC061: "Indian River",
  FLC063: "Jackson",
  FLC065: "Jefferson",
  FLC067: "Lafayette",
  FLC069: "Lake",
  FLC071: "Lee",
  FLC073: "Leon",
  FLC075: "Levy",
  FLC077: "Liberty",
  FLC079: "Madison",
  FLC081: "Manatee",
  FLC083: "Marion",
  FLC085: "Martin",
  FLC086: "Miami-Dade",
  FLC087: "Monroe",
  FLC089: "Nassau",
  FLC091: "Okaloosa",
  FLC093: "Okeechobee",
  FLC095: "Orange",
  FLC097: "Osceola",
  FLC099: "Palm Beach",
  FLC101: "Pasco",
  FLC103: "Pinellas",
  FLC105: "Polk",
  FLC107: "Putnam",
  FLC109: "St. Johns",
  FLC111: "St. Lucie",
  FLC113: "Santa Rosa",
  FLC115: "Sarasota",
  FLC117: "Seminole",
  FLC119: "Sumter",
  FLC121: "Suwannee",
  FLC123: "Taylor",
  FLC125: "Union",
  FLC127: "Volusia",
  FLC129: "Wakulla",
  FLC131: "Walton",
  FLC133: "Washington",
});

if (Object.keys(FLORIDA_COUNTY_UGC_CODES).length !== FLORIDA_COUNTIES.length) {
  throw new Error("Florida county UGC map must contain exactly 67 counties.");
}

export function normalizeCountyName(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019`]/g, "'")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+county$/i, "")
    .replace(/^saint\s+/, "st ")
    .trim();
}

const countyByNormalizedName = new Map(
  FLORIDA_COUNTIES.map((county) => [normalizeCountyName(county), county]),
);

if (countyByNormalizedName.size !== FLORIDA_COUNTIES.length) {
  throw new Error("Florida county allowlist contains duplicate normalized names.");
}

export function getCanonicalFloridaCounty(value) {
  return countyByNormalizedName.get(normalizeCountyName(value)) || null;
}

export function parseFloridaAlertArea(value) {
  const area = String(value || "").normalize("NFKC").trim();
  const match = area.match(/^(.*?)\s*,\s*FL(?:ORIDA)?\s*$/i);
  if (!match) return null;

  return getCanonicalFloridaCounty(match[1]);
}

export function parseIsoTimestamp(value) {
  if (typeof value !== "string") return null;

  const timestamp = value.trim();
  const isoPattern =
    /^(\d{4})-(\d{2})-(\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;
  const match = timestamp.match(isoPattern);
  if (!match) return null;

  const calendarDate = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  if (
    calendarDate.getUTCFullYear() !== Number(match[1]) ||
    calendarDate.getUTCMonth() !== Number(match[2]) - 1 ||
    calendarDate.getUTCDate() !== Number(match[3])
  ) {
    return null;
  }

  const parsed = new Date(timestamp);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getNowDate(now) {
  if (now instanceof Date) return Number.isNaN(now.getTime()) ? null : now;
  if (typeof now === "number" || typeof now === "string") {
    const parsed = new Date(now);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return new Date();
}

function formatAlertTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function getWeatherAlertEligibility(alert, pageCounty, now = new Date()) {
  const candidate = alert && typeof alert === "object" ? alert : {};

  if (candidate.enabled !== true) {
    return { eligible: false, reason: "disabled" };
  }
  if (candidate.mode === "normal") {
    return { eligible: false, reason: "normal-mode" };
  }
  if (!String(pageCounty || "").trim()) {
    return { eligible: false, reason: "missing-county" };
  }

  const canonicalPageCounty = getCanonicalFloridaCounty(pageCounty);
  if (!canonicalPageCounty) {
    return { eligible: false, reason: "invalid-county" };
  }

  const updatedAt = parseIsoTimestamp(candidate.updatedAt);
  const nowDate = getNowDate(now);
  if (!updatedAt || !nowDate) {
    return { eligible: false, reason: "invalid-timestamp" };
  }

  const ageMs = nowDate.getTime() - updatedAt.getTime();
  if (ageMs < -CLOCK_SKEW_TOLERANCE_MS) {
    return { eligible: false, reason: "future-timestamp" };
  }
  if (candidate.expiresAt != null) {
    const expiresAt = parseIsoTimestamp(candidate.expiresAt);
    if (!expiresAt || expiresAt.getTime() < updatedAt.getTime()) {
      return { eligible: false, reason: "invalid-expiry" };
    }
    if (nowDate.getTime() - expiresAt.getTime() > CLOCK_SKEW_TOLERANCE_MS) {
      return { eligible: false, reason: "expired" };
    }
  } else if (ageMs > MAX_ALERT_AGE_MS) {
    return { eligible: false, reason: "stale" };
  }

  const validFloridaAreas = [
    ...new Set(
      (Array.isArray(candidate.areas) ? candidate.areas : [])
        .map(parseFloridaAlertArea)
        .filter(Boolean),
    ),
  ];

  if (validFloridaAreas.length === 0) {
    return { eligible: false, reason: "no-valid-florida-area" };
  }
  if (!validFloridaAreas.includes(canonicalPageCounty)) {
    return {
      eligible: false,
      reason: "county-mismatch",
      validFloridaAreas,
    };
  }

  return {
    eligible: true,
    reason: "matched",
    matchedCounty: canonicalPageCounty,
    formattedUpdatedTime: formatAlertTime(updatedAt),
    validFloridaAreas,
  };
}
