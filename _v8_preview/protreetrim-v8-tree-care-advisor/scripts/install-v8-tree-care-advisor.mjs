import fs from 'fs';
import path from 'path';

const root = process.cwd();
const pkgRoot = path.join(root, '_v8_preview', 'protreetrim-v8-tree-care-advisor');

function copyFile(relativePath) {
  const src = path.join(pkgRoot, relativePath);
  const dest = path.join(root, relativePath);
  if (!fs.existsSync(src)) {
    throw new Error(`Package file missing: ${relativePath}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied ${relativePath}`);
}

function replaceOnce(filePath, searchValue, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(replacement.trim())) {
    return false;
  }
  if (!content.includes(searchValue)) {
    console.warn(`Could not find expected text in ${filePath}: ${searchValue.slice(0, 80)}...`);
    return false;
  }
  content = content.replace(searchValue, replacement);
  fs.writeFileSync(filePath, content);
  return true;
}

copyFile('src/data/florida-tree-care-advisor.json');
copyFile('src/components/FloridaTreeCareAdvisor.astro');
copyFile('src/pages/tools/florida-tree-care-advisor.astro');

const layoutPath = path.join(root, 'src/layouts/MainLayout.astro');
let layout = fs.readFileSync(layoutPath, 'utf8');

if (!layout.includes('href="/tools/florida-tree-care-advisor/"')) {
  layout = layout.replace(
    '<a href="/blog/" class="nav-link">Blog</a>',
    '<a href="/blog/" class="nav-link">Blog</a>\n          <a href="/tools/florida-tree-care-advisor/" class="nav-link">Tools</a>'
  );

  layout = layout.replace(
    '<a href="/blog/" class="mobile-nav-link">Blog</a>',
    '<a href="/blog/" class="mobile-nav-link">Blog</a>\n      <a href="/tools/florida-tree-care-advisor/" class="mobile-nav-link">Tools</a>'
  );

  layout = layout.replace(
    '<a href="/services/" style="color: white; text-decoration: none;"\n            >Services</a\n          >',
    '<a href="/services/" style="color: white; text-decoration: none;"\n            >Services</a\n          >\n          <a href="/tools/florida-tree-care-advisor/" style="color: white; text-decoration: none;"\n            >Tools</a\n          >'
  );

  fs.writeFileSync(layoutPath, layout);
  console.log('Updated src/layouts/MainLayout.astro navigation links');
} else {
  console.log('MainLayout already contains Tree Care Advisor links');
}

const sitemapPath = path.join(root, 'generate-sitemaps.mjs');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
if (!sitemap.includes("'/tools/florida-tree-care-advisor/'")) {
  sitemap = sitemap.replace(
    "      '/blog/',\n      '/services/tree-removal/',",
    "      '/blog/',\n      '/tools/florida-tree-care-advisor/',\n      '/services/tree-removal/',"
  );
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('Updated generate-sitemaps.mjs static page list');
} else {
  console.log('generate-sitemaps.mjs already contains Tree Care Advisor route');
}

copyFile('_INSTALL_NOTES_V8_TREE_CARE_ADVISOR.md');
console.log('V8 Florida Tree Care Advisor installation complete. Run npm run build next.');
