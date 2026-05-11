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

copyFile('src/components/EmergencyTreeSafetyChecklist.astro');
copyFile('src/pages/tools/emergency-tree-safety-checklist.astro');
copyFile('src/pages/tools/index.astro');
copyFile('_INSTALL_NOTES_V12_EMERGENCY_TREE_SAFETY_CHECKLIST.md');

replaceInFile('generate-sitemaps.mjs', (content) => {
  if (content.includes("'/tools/emergency-tree-safety-checklist/'")) return content;

  if (content.includes("'/tools/florida-problem-tree-guide/'")) {
    return content.replace(
      "'/tools/florida-problem-tree-guide/',",
      "'/tools/florida-problem-tree-guide/',\n      '/tools/emergency-tree-safety-checklist/',"
    );
  }

  if (content.includes("'/tools/florida-tree-care-advisor/'")) {
    return content.replace(
      "'/tools/florida-tree-care-advisor/',",
      "'/tools/florida-tree-care-advisor/',\n      '/tools/emergency-tree-safety-checklist/',"
    );
  }

  if (content.includes("'/tools/',")) {
    return content.replace(
      "'/tools/',",
      "'/tools/',\n      '/tools/emergency-tree-safety-checklist/',"
    );
  }

  return content;
});

console.log('\nV12 Emergency Tree Safety Checklist installed. Run npm run build next.');
