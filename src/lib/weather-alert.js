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

function parseIsoTimestamp(value) {
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

function formatCheckedTime(date) {
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
  if (ageMs > MAX_ALERT_AGE_MS) {
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
    formattedCheckedTime: formatCheckedTime(updatedAt),
    validFloridaAreas,
  };
}
