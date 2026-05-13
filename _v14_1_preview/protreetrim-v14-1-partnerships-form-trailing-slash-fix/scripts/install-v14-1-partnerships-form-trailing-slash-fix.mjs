import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, '..');
const repoRoot = process.cwd();

const files = [
  'src/pages/partnerships.astro',
];

for (const relativePath of files) {
  const source = path.join(packageRoot, relativePath);
  const target = path.join(repoRoot, relativePath);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing patch source file: ${source}`);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  console.log(`✓ Installed ${relativePath}`);
}

console.log('\nV14.1 Partnerships form trailing-slash fix installed.');
console.log('Retest the form at /partnerships/ while npm run dev is active.');
