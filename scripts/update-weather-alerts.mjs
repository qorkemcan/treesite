import fs from "node:fs/promises";
import path from "node:path";

const OUT_FILE = path.resolve("src/data/site-alert.json");
const API_URL = "https://api.weather.gov/alerts/active?area=FL";

const watchedEvents = [
  "Hurricane Warning",
  "Hurricane Watch",
  "Tropical Storm Warning",
  "Tropical Storm Watch",
  "Tornado Warning",
  "Tornado Watch",
  "Severe Thunderstorm Warning",
  "High Wind Warning",
  "Wind Advisory",
  "Flood Warning",
  "Flash Flood Warning",
  "Flood Watch"
];

const highEvents = new Set([
  "Hurricane Warning",
  "Tropical Storm Warning",
  "Tornado Warning",
  "Flash Flood Warning"
]);

function normalizeEvent(value = "") {
  return String(value).trim();
}

function isTreeRelevantAlert(feature) {
  const event = normalizeEvent(feature?.properties?.event);
  return watchedEvents.includes(event);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildAlert(features) {
  const relevant = features.filter(isTreeRelevantAlert);
  if (!relevant.length) {
    return {
      enabled: false,
      mode: "normal",
      severity: "none",
      headline: "",
      message: "",
      areas: [],
      source: "NWS API",
      updatedAt: new Date().toISOString(),
      ctaText: "Call Dispatch",
      ctaHref: "tel:+18554982578"
    };
  }

  const events = unique(relevant.map((feature) => normalizeEvent(feature.properties.event)));
  const areas = unique(
    relevant
      .map((feature) => feature.properties.areaDesc)
      .flatMap((area) => String(area || "").split(";"))
      .map((area) => area.trim())
  ).slice(0, 8);

  const hasHigh = events.some((event) => highEvents.has(event));
  const hasTropical = events.some((event) => /Hurricane|Tropical Storm/i.test(event));
  const hasFlood = events.some((event) => /Flood/i.test(event));

  let headline = "Severe Weather Tree Safety Notice";
  let message = "Strong weather is active in parts of Florida. Keep people, pets, and vehicles away from leaning, cracked, or storm-damaged trees until conditions improve.";

  if (hasTropical) {
    headline = "Florida Storm Tree Safety Advisory";
    message = "Tropical weather may increase tree failure risk. Stay away from damaged trees, hanging limbs, and saturated root zones. If a tree is blocking access or threatening a structure, call dispatch.";
  } else if (hasFlood) {
    headline = "Saturated Soil Tree Risk Notice";
    message = "Flooding and saturated soil can reduce tree stability. Watch for new leaning, lifted soil, or cracks around large trees after heavy rain.";
  }

  return {
    enabled: true,
    mode: hasHigh ? "storm" : "watch",
    severity: hasHigh ? "high" : "medium",
    headline,
    message,
    areas,
    source: "NWS API",
    events,
    updatedAt: new Date().toISOString(),
    ctaText: "Call Dispatch",
    ctaHref: "tel:+18554982578"
  };
}

async function main() {
  const response = await fetch(API_URL, {
    headers: {
      "User-Agent": "ProTreeTrim.com weather alert checker, desk@contractor.net",
      "Accept": "application/geo+json"
    }
  });

  if (!response.ok) {
    throw new Error(`NWS API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const alert = buildAlert(Array.isArray(data.features) ? data.features : []);
  await fs.writeFile(OUT_FILE, `${JSON.stringify(alert, null, 2)}\n`);
  console.log(`Updated ${OUT_FILE}: ${alert.enabled ? alert.mode : "normal"}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
