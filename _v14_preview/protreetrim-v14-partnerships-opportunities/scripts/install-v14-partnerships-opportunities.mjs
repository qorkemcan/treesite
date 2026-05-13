import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, '..');
const repoRoot = process.cwd();

const filesToCopy = [
  'src/pages/partnerships.astro',
  'src/pages/partnership-thank-you.astro',
  'src/pages/api/partnerships.js',
  'src/pages/contact.astro',
  'src/pages/join-network.astro',
  'src/layouts/MainLayout.astro',
  'generate-sitemaps.mjs',
  '_INSTALL_NOTES_V14_PARTNERSHIPS_OPPORTUNITIES.md',
];

function ensureParent(targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
}

for (const relativePath of filesToCopy) {
  const sourcePath = path.join(packageRoot, relativePath);
  const targetPath = path.join(repoRoot, relativePath);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing package file: ${relativePath}`);
  }

  ensureParent(targetPath);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`✓ Installed ${relativePath}`);
}

console.log('\nV14 Partnerships & Growth Opportunities package installed.');
console.log('Next step: run npm run build and review /partnerships/.');
