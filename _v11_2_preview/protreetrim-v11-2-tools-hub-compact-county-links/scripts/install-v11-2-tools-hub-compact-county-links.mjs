import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");
const repoRoot = process.cwd();

const files = [
  ["src/pages/tools/index.astro", "src/pages/tools/index.astro"],
  ["_INSTALL_NOTES_V11_2_TOOLS_HUB_COMPACT_COUNTY_LINKS.md", "_INSTALL_NOTES_V11_2_TOOLS_HUB_COMPACT_COUNTY_LINKS.md"],
];

for (const [from, to] of files) {
  const source = join(packageRoot, from);
  const target = join(repoRoot, to);
  const targetDir = dirname(target);
  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
  copyFileSync(source, target);
  console.log(`Updated ${to}`);
}

console.log("V11.2 compact county links installed. Run npm run build, then review /tools/.");
