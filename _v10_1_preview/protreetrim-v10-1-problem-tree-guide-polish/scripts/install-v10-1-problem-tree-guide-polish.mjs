import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');
const repoRoot = process.cwd();

function copyFile(relPath) {
  const source = path.join(packageRoot, relPath);
  const target = path.join(repoRoot, relPath);
  if (!fs.existsSync(source)) {
    throw new Error(`Missing package file: ${relPath}`);
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  console.log(`Updated ${relPath}`);
}

copyFile('src/components/FloridaProblemTreeGuide.astro');
copyFile('_INSTALL_NOTES_V10_1_PROBLEM_TREE_GUIDE_POLISH.md');

console.log('\nV10.1 polish installed. Run npm run build, then test /tools/florida-problem-tree-guide/.');
