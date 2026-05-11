import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(__filename), '..');
const repoRoot = process.cwd();

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(relativePath) {
  const src = path.join(packageRoot, relativePath);
  const dest = path.join(repoRoot, relativePath);
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`✓ copied ${relativePath}`);
}

function replaceInFile(relativePath, replacer) {
  const filePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠ skipped missing ${relativePath}`);
    return;
  }
  const before = fs.readFileSync(filePath, 'utf8');
  const after = replacer(before);
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    console.log(`✓ updated ${relativePath}`);
  } else {
    console.log(`• no changes needed in ${relativePath}`);
  }
}

copyFile('src/data/florida-problem-trees.json');
copyFile('src/components/FloridaProblemTreeGuide.astro');
copyFile('src/pages/tools/florida-problem-tree-guide.astro');
copyFile('src/pages/tools/index.astro');

replaceInFile('src/layouts/MainLayout.astro', (content) => {
  return content.replaceAll('/tools/florida-tree-care-advisor/', '/tools/');
});

replaceInFile('generate-sitemaps.mjs', (content) => {
  if (content.includes("'/tools/florida-problem-tree-guide/'")) return content;

  if (content.includes("'/tools/florida-tree-care-advisor/'")) {
    return content.replace(
      "'/tools/florida-tree-care-advisor/',",
      "'/tools/',\n      '/tools/florida-tree-care-advisor/',\n      '/tools/florida-problem-tree-guide/',"
    );
  }

  if (content.includes("'/blog/',")) {
    return content.replace(
      "'/blog/',",
      "'/blog/',\n      '/tools/',\n      '/tools/florida-tree-care-advisor/',\n      '/tools/florida-problem-tree-guide/',"
    );
  }

  return content;
});

const notesPath = path.join(packageRoot, '_INSTALL_NOTES_V10_PROBLEM_TREE_GUIDE.md');
if (fs.existsSync(notesPath)) {
  fs.copyFileSync(notesPath, path.join(repoRoot, '_INSTALL_NOTES_V10_PROBLEM_TREE_GUIDE.md'));
  console.log('✓ copied _INSTALL_NOTES_V10_PROBLEM_TREE_GUIDE.md');
}

console.log('\nV10 Florida Problem Tree Guide installed. Run npm run build next.');
