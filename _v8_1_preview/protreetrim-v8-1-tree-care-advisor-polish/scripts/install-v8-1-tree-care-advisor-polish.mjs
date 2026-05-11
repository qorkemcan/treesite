import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkgRoot = path.resolve('_v8_1_preview/protreetrim-v8-1-tree-care-advisor-polish');

const files = [
  ['src/components/FloridaTreeCareAdvisor.astro', 'src/components/FloridaTreeCareAdvisor.astro'],
  ['src/pages/tools/florida-tree-care-advisor.astro', 'src/pages/tools/florida-tree-care-advisor.astro'],
  ['_INSTALL_NOTES_V8_1_TREE_CARE_ADVISOR_POLISH.md', '_INSTALL_NOTES_V8_1_TREE_CARE_ADVISOR_POLISH.md'],
];

for (const [from, to] of files) {
  const source = path.join(pkgRoot, from);
  const dest = path.join(root, to);
  if (!fs.existsSync(source)) {
    throw new Error(`Missing package file: ${source}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
  console.log(`Updated ${to}`);
}

console.log('V8.1 Tree Care Advisor polish installed. Run npm run build next.');
