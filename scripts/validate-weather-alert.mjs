import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FLORIDA_COUNTIES,
  parseFloridaAlertArea,
  parseIsoTimestamp,
} from "../src/lib/weather-alert.js";

const ALLOWED_KEYS = Object.freeze([
  "schemaVersion",
  "enabled",
  "mode",
  "title",
  "message",
  "areas",
  "source",
  "sourceAlertId",
  "updatedAt",
  "expiresAt",
]);
const ACTIVE_MODES = new Set(["storm", "watch"]);
const countySet = new Set(FLORIDA_COUNTIES);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function validateWeatherAlert(payload) {
  assert(payload && typeof payload === "object" && !Array.isArray(payload), "Payload must be a JSON object.");

  const keys = Object.keys(payload);
  const unknownKeys = keys.filter((key) => !ALLOWED_KEYS.includes(key));
  const missingKeys = ALLOWED_KEYS.filter((key) => !keys.includes(key));
  assert(unknownKeys.length === 0, `Unknown field(s): ${unknownKeys.join(", ")}`);
  assert(missingKeys.length === 0, `Missing field(s): ${missingKeys.join(", ")}`);
  assert(payload.schemaVersion === 2, "schemaVersion must equal 2.");
  assert(typeof payload.enabled === "boolean", "enabled must be boolean.");
  assert(typeof payload.mode === "string", "mode must be a string.");
  assert(typeof payload.title === "string", "title must be a string.");
  assert(typeof payload.message === "string", "message must be a string.");
  assert(Array.isArray(payload.areas), "areas must be an array.");
  assert(payload.areas.every((area) => typeof area === "string"), "Every area must be a string.");
  assert(new Set(payload.areas).size === payload.areas.length, "areas must not contain duplicates.");
  assert(payload.source === "NWS API", "source must equal NWS API.");

  const canonicalAreas = payload.areas.map((area) => {
    const county = parseFloridaAlertArea(area);
    assert(county && countySet.has(county), `Invalid Florida county area: ${area}`);
    assert(area === `${county}, FL`, `Area must use canonical format: ${county}, FL`);
    return area;
  });
  const sortedAreas = [...canonicalAreas].sort();
  assert(JSON.stringify(canonicalAreas) === JSON.stringify(sortedAreas), "areas must be sorted alphabetically.");

  if (payload.enabled) {
    assert(ACTIVE_MODES.has(payload.mode), "Active alert mode must be storm or watch.");
    assert(payload.title.trim().length > 0, "Active alert title must not be empty.");
    assert(payload.message.trim().length > 0, "Active alert message must not be empty.");
    assert(payload.areas.length > 0, "Active alert must contain at least one Florida county.");
    assert(typeof payload.sourceAlertId === "string" && payload.sourceAlertId.trim(), "Active alert sourceAlertId must not be empty.");

    const updatedAt = parseIsoTimestamp(payload.updatedAt);
    const expiresAt = parseIsoTimestamp(payload.expiresAt);
    assert(updatedAt, "Active alert updatedAt must be a valid ISO timestamp.");
    assert(expiresAt, "Active alert expiresAt must be a valid ISO timestamp.");
    assert(expiresAt.getTime() >= updatedAt.getTime(), "expiresAt must not be earlier than updatedAt.");
  } else {
    assert(payload.mode === "normal", "Disabled alert mode must be normal.");
    assert(payload.title === "", "Disabled alert title must be empty.");
    assert(payload.message === "", "Disabled alert message must be empty.");
    assert(payload.areas.length === 0, "Disabled alert areas must be empty.");
    assert(payload.sourceAlertId === null, "Disabled alert sourceAlertId must be null.");
    assert(payload.updatedAt === null, "Disabled alert updatedAt must be null.");
    assert(payload.expiresAt === null, "Disabled alert expiresAt must be null.");
  }

  return payload;
}

function parseCliPath(argv) {
  if (argv.length === 0) return path.resolve("src/data/site-alert.json");
  if (argv.length === 1 && !argv[0].startsWith("--")) return path.resolve(argv[0]);
  if (argv.length === 2 && argv[0] === "--input") return path.resolve(argv[1]);
  throw new Error("Usage: node scripts/validate-weather-alert.mjs [path] or --input <path>");
}

async function main() {
  const inputPath = parseCliPath(process.argv.slice(2));
  const payload = JSON.parse(await fs.readFile(inputPath, "utf8"));
  validateWeatherAlert(payload);
  console.log(`Weather alert valid: ${inputPath}`);
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  main().catch((error) => {
    console.error(`Weather alert validation failed: ${error.message}`);
    process.exitCode = 1;
  });
}
