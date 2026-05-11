import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(__filename), "..");
const repoRoot = process.cwd();

const copies = [
  ["src/data/county-permits.json", "src/data/county-permits.json"],
  ["src/pages/county/[county].astro", "src/pages/county/[county].astro"],
];

for (const [from, to] of copies) {
  const source = path.join(packageRoot, from);
  const target = path.join(repoRoot, to);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  console.log(`Installed ${to}`);
}

console.log("V9 county permit module installed.");
