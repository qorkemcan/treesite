import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FLORIDA_COUNTY_UGC_CODES, parseIsoTimestamp } from "../src/lib/weather-alert.js";
import { validateWeatherAlert } from "./validate-weather-alert.mjs";

export const API_URL = "https://api.weather.gov/alerts/active?area=FL";
const DEFAULT_OUTPUT = path.resolve("src/data/site-alert.json");
const RULES_FILE = path.resolve("src/data/weather-advice-rules.json");
const CLOCK_SKEW_TOLERANCE_MS = 5 * 60 * 1000;

const highPriorityEvents = new Set([
  "Hurricane Warning",
  "Tropical Storm Warning",
  "Tornado Warning",
  "Flash Flood Warning",
]);
const severityRanks = new Map([
  ["Extreme", 5],
  ["Severe", 4],
  ["Moderate", 3],
  ["Minor", 2],
  ["Unknown", 1],
]);
const urgencyRanks = new Map([
  ["Immediate", 5],
  ["Expected", 4],
  ["Future", 3],
  ["Past", 2],
  ["Unknown", 1],
]);

function disabledPayload() {
  return {
    schemaVersion: 2,
    enabled: false,
    mode: "normal",
    title: "",
    message: "",
    areas: [],
    source: "NWS API",
    sourceAlertId: null,
    updatedAt: null,
    expiresAt: null,
  };
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getFloridaAreas(feature) {
  const ugc = feature?.properties?.geocode?.UGC;
  if (!Array.isArray(ugc)) return [];

  return [...new Set(
    ugc
      .map((code) => normalizeString(code).toUpperCase())
      .filter((code) => /^FLC\d{3}$/.test(code))
      .map((code) => FLORIDA_COUNTY_UGC_CODES[code])
      .filter(Boolean)
      .map((county) => `${county}, FL`),
  )].sort();
}

function getSourceAlertId(feature) {
  return normalizeString(feature?.id) || normalizeString(feature?.properties?.id);
}

function getAlertTimestamp(properties) {
  for (const value of [properties?.updated, properties?.sent, properties?.effective]) {
    const parsed = parseIsoTimestamp(value);
    if (parsed) return parsed;
  }
  return null;
}

function findRule(event, rules) {
  return rules.find((rule) => Array.isArray(rule.events) && rule.events.includes(event)) || null;
}

function toCandidate(feature, rules, now) {
  const properties = feature?.properties;
  if (!properties || properties.status !== "Actual") return null;
  if (properties.messageType === "Cancel") return null;

  const event = normalizeString(properties.event);
  const rule = findRule(event, rules);
  if (!rule) return null;

  const sourceAlertId = getSourceAlertId(feature);
  const updatedAt = getAlertTimestamp(properties);
  const expiresAt = parseIsoTimestamp(properties.expires);
  const areas = getFloridaAreas(feature);
  if (!sourceAlertId || !updatedAt || !expiresAt || areas.length === 0) return null;
  if (updatedAt.getTime() - now.getTime() > CLOCK_SKEW_TOLERANCE_MS) return null;
  if (expiresAt.getTime() < updatedAt.getTime() || expiresAt.getTime() <= now.getTime()) return null;

  return {
    priority: highPriorityEvents.has(event) ? 2 : 1,
    severityRank: severityRanks.get(properties.severity) || 0,
    urgencyRank: urgencyRanks.get(properties.urgency) || 0,
    updatedTime: updatedAt.getTime(),
    payload: {
      schemaVersion: 2,
      enabled: true,
      mode: rule.mode,
      title: rule.headline,
      message: rule.message,
      areas,
      source: "NWS API",
      sourceAlertId,
      updatedAt: updatedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    },
  };
}

function compareCandidates(left, right) {
  return (
    right.priority - left.priority
    || right.severityRank - left.severityRank
    || right.urgencyRank - left.urgencyRank
    || right.updatedTime - left.updatedTime
    || (left.payload.sourceAlertId === right.payload.sourceAlertId
      ? 0
      : left.payload.sourceAlertId < right.payload.sourceAlertId ? -1 : 1)
  );
}

export function buildAlert(features, rules, now = new Date()) {
  if (!Array.isArray(features)) throw new Error("NWS payload features must be an array.");
  if (!Array.isArray(rules)) throw new Error("Weather advice rules must be an array.");
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) throw new Error("Current time must be valid.");

  const candidates = features
    .map((feature) => toCandidate(feature, rules, now))
    .filter(Boolean)
    .sort(compareCandidates);

  return candidates[0]?.payload || disabledPayload();
}

function parseArgs(argv) {
  const options = { input: null, output: DEFAULT_OUTPUT, now: new Date() };
  for (let index = 0; index < argv.length; index += 1) {
    const option = argv[index];
    const value = argv[index + 1];
    if (!["--input", "--output", "--now"].includes(option) || !value) {
      throw new Error("Usage: node scripts/update-weather-alerts.mjs [--input <fixture>] [--output <path>] [--now <ISO timestamp>]");
    }
    if (option === "--input") options.input = path.resolve(value);
    if (option === "--output") options.output = path.resolve(value);
    if (option === "--now") {
      const parsed = parseIsoTimestamp(value);
      if (!parsed) throw new Error("--now must be a valid ISO timestamp.");
      options.now = parsed;
    }
    index += 1;
  }
  return options;
}

async function loadRules() {
  const data = JSON.parse(await fs.readFile(RULES_FILE, "utf8"));
  if (!Array.isArray(data.rules)) throw new Error("Weather advice rules file must contain a rules array.");
  return data.rules;
}

async function loadNwsData(inputPath) {
  if (inputPath) return JSON.parse(await fs.readFile(inputPath, "utf8"));

  const response = await fetch(API_URL, {
    headers: {
      "User-Agent": "ProTreeTrim.com weather alert checker, desk@contractor.net",
      Accept: "application/geo+json",
    },
  });
  if (!response.ok) throw new Error(`NWS API request failed: ${response.status} ${response.statusText}`);
  return response.json();
}

async function writeAtomicIfChanged(outputPath, payload) {
  validateWeatherAlert(payload);
  const content = `${JSON.stringify(payload, null, 2)}\n`;

  let existing = null;
  try {
    existing = await fs.readFile(outputPath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (existing === content) return false;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const temporaryPath = path.join(path.dirname(outputPath), `.${path.basename(outputPath)}.${process.pid}.tmp`);
  try {
    await fs.writeFile(temporaryPath, content, { flag: "wx" });
    await fs.rename(temporaryPath, outputPath);
  } finally {
    await fs.rm(temporaryPath, { force: true });
  }
  return true;
}

export async function runUpdate(options) {
  const [data, rules] = await Promise.all([loadNwsData(options.input), loadRules()]);
  if (!data || typeof data !== "object" || !Array.isArray(data.features)) {
    throw new Error("NWS payload must be a FeatureCollection with a features array.");
  }

  const payload = buildAlert(data.features, rules, options.now);
  const changed = await writeAtomicIfChanged(options.output, payload);
  const result = changed ? (payload.enabled ? "updated" : "disabled") : "no semantic change";
  console.log(`Weather alert result: ${result}; output=${options.output}`);
  return { changed, payload, result };
}

async function main() {
  await runUpdate(parseArgs(process.argv.slice(2)));
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  main().catch((error) => {
    console.error(`Weather alert update failed: ${error.message}`);
    process.exitCode = 1;
  });
}
