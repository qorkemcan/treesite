import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");
const repoRoot = process.cwd();

const files = [
  "src/layouts/MainLayout.astro",
  "src/pages/index.astro",
];

for (const relativePath of files) {
  const from = path.join(packageRoot, relativePath);
  const to = path.join(repoRoot, relativePath);

  if (!fs.existsSync(from)) {
    throw new Error(`Missing package file: ${relativePath}`);
  }

  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log(`✓ Installed ${relativePath}`);
}

console.log("\nV15 Mobile Performance & Accessibility Optimization Pass installed.");
console.log("Next step: run npm run build and review the homepage locally.");
