import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, '..');
const projectRoot = process.cwd();
const source = resolve(packageRoot, 'vercel.json');
const destination = resolve(projectRoot, 'vercel.json');

if (!existsSync(source)) {
  console.error('Missing package file: vercel.json');
  process.exit(1);
}

copyFileSync(source, destination);

const parsed = JSON.parse(readFileSync(destination, 'utf8'));
const count = Array.isArray(parsed.redirects) ? parsed.redirects.length : 0;

console.log('✓ Installed vercel.json');
console.log(`✓ Redirect rules available: ${count}`);
console.log('Next step: run npm run build, then git add vercel.json && git commit && git push.');
