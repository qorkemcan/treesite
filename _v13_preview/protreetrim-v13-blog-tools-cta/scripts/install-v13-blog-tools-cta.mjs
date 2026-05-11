import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageRoot = path.resolve('_v13_preview/protreetrim-v13-blog-tools-cta');

const files = [
  ['src/components/BlogToolsCTA.astro', 'src/components/BlogToolsCTA.astro'],
  ['src/pages/blog/[slug].astro', 'src/pages/blog/[slug].astro'],
  ['_INSTALL_NOTES_V13_BLOG_TOOLS_CTA.md', '_INSTALL_NOTES_V13_BLOG_TOOLS_CTA.md'],
];

for (const [fromRel, toRel] of files) {
  const from = path.join(packageRoot, fromRel);
  const to = path.join(root, toRel);
  if (!fs.existsSync(from)) {
    throw new Error(`Missing package file: ${fromRel}`);
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log(`Installed ${toRel}`);
}

console.log('V13 Blog Tools CTA installed. Run npm run build next.');
