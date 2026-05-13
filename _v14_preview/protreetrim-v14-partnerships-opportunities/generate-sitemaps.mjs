import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const SITE_URL = 'https://www.protreetrim.com';
const CSV_PATH = path.join(process.cwd(), 'src/data/cities.csv');
const BLOG_PATH = path.join(process.cwd(), 'src/content/blog');
const PUBLIC_PATH = path.join(process.cwd(), 'public');
const TODAY = new Date().toISOString().split('T')[0];
const POSTS_PER_PAGE = 12;

// Default: keep current city/service coverage in sitemap, only normalize URL format.
// Later, if we decide to tighten crawl signals, build with:
// SITEMAP_ONLY_RICH_PAGES=true npm run build
const ONLY_RICH_CITY_SERVICE_PAGES = process.env.SITEMAP_ONLY_RICH_PAGES === 'true';

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeDate(value) {
  if (!value) return TODAY;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return TODAY;
  return date.toISOString().split('T')[0];
}

function pageUrl(pathname = '/') {
  const cleanPath = pathname === '/' || pathname === ''
    ? '/'
    : `/${String(pathname).replace(/^\/+|\/+$/g, '')}/`;

  return new URL(cleanPath, SITE_URL).href;
}

function fileUrl(fileName = '') {
  return new URL(`/${String(fileName).replace(/^\/+/, '')}`, SITE_URL).href;
}

function loadJson(relativePath) {
  const fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath)) return {};

  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  } catch (error) {
    console.warn(`⚠️ Could not parse ${relativePath}: ${error.message}`);
    return {};
  }
}

function normalizeCategory(value = '') {
  const clean = String(value).trim().replace(/\s+/g, ' ');

  const aliases = {
    'emergency storm': 'Emergency & Storm',
    'emergency & storm': 'Emergency & Storm',
    'florida laws & property risk': 'Florida Laws & Property Risk',
    'tree care & cleanup': 'Tree Care & Cleanup',
    'tree health & disease': 'Tree Health & Disease',
    'landscaping & planting': 'Landscaping & Planting',
    'local florida guides': 'Local Florida Guides',
    'tree removal': 'Tree Removal',
  };

  return aliases[clean.toLowerCase()] ?? clean;
}

function slugifyCategory(value = '') {
  return normalizeCategory(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function slugifyCity(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\./g, '')
    .replace(/\s+/g, '-');
}

function slugifyCounty(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

function stripMarkdownExtension(fileName = '') {
  return fileName.replace(/(\.md|\.mdx)+$/i, '');
}

function isLikelyDuplicateCopy(fileName = '') {
  return /\s\(\d+\)\.(md|mdx)$/i.test(fileName);
}

function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const lines = match[1].split('\n');
  const data = {};

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('- ')) continue;

    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!rawValue) {
      data[key] = '';
      continue;
    }

    if (rawValue === 'true') {
      data[key] = true;
      continue;
    }

    if (rawValue === 'false') {
      data[key] = false;
      continue;
    }

    data[key] = rawValue.replace(/^["']|["']$/g, '');
  }

  return data;
}

function loadBlogEntries() {
  if (!fs.existsSync(BLOG_PATH)) return [];

  const files = fs
    .readdirSync(BLOG_PATH)
    .filter((file) => /\.(md|mdx)$/i.test(file))
    .filter((file) => !isLikelyDuplicateCopy(file));

  const seenSlugs = new Set();

  const entries = files
    .map((file) => {
      const fullPath = path.join(BLOG_PATH, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const frontmatter = parseFrontmatter(content);

      if (frontmatter.draft === true) return null;

      const slug = stripMarkdownExtension(file);
      if (seenSlugs.has(slug)) return null;
      seenSlugs.add(slug);

      return {
        slug,
        category: normalizeCategory(frontmatter.category || ''),
        pubDate: normalizeDate(frontmatter.pubDate),
        updatedDate: normalizeDate(frontmatter.updatedDate || frontmatter.pubDate),
      };
    })
    .filter(Boolean);

  entries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return entries;
}

function buildUrlSet(urlEntries) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  urlEntries.forEach((entry) => {
    xml += `\n  <url>`;
    xml += `\n    <loc>${escapeXml(entry.loc)}</loc>`;
    xml += `\n    <lastmod>${escapeXml(entry.lastmod || TODAY)}</lastmod>`;
    xml += `\n    <priority>${escapeXml(entry.priority || '0.7')}</priority>`;
    xml += `\n  </url>`;
  });

  xml += `\n</urlset>`;
  return xml;
}

async function generate() {
  console.log('🚀 Public klasörüne sitemap oluşturuluyor...');

  try {
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
    });

    const blogEntries = loadBlogEntries();

    const staticPages = [
      '/',
      '/about/',
      '/contact/',
      '/services/',
      '/gallery/',
      '/trust-safety/',
      '/privacy/',
      '/join-network/',
      '/partnerships/',
      '/blog/',
      '/tools/',
      '/tools/florida-tree-care-advisor/',
      '/tools/florida-problem-tree-guide/',
      '/tools/emergency-tree-safety-checklist/',
      '/services/tree-removal/',
      '/services/tree-trimming/',
      '/services/stump-grinding/',
      '/services/emergency-response/',
      '/services/land-clearing/',
      '/services/commercial-services/',
    ];

    const mainEntries = staticPages.map((page) => ({
      loc: pageUrl(page),
      lastmod: TODAY,
      priority: page === '/' ? '1.0' : page === '/blog/' ? '0.9' : '0.8',
    }));

    fs.writeFileSync(
      path.join(PUBLIC_PATH, 'sitemap-main.xml'),
      buildUrlSet(mainEntries),
    );

    const countyGroups = {};
    records.forEach((row) => {
      if (!row.County) return;
      const county = slugifyCounty(row.County);
      if (!countyGroups[county]) countyGroups[county] = [];
      countyGroups[county].push(row);
    });

    const services = [
      {
        prefix: 'tree-removal',
        richTextSource: loadJson('src/data/city-removal.json'),
      },
      {
        prefix: 'stump-grinding',
        richTextSource: loadJson('src/data/city-stump.json'),
      },
      {
        prefix: 'emergency-service',
        richTextSource: loadJson('src/data/city-emergency.json'),
      },
    ];

    const sitemapFiles = ['sitemap-main.xml'];

    Object.keys(countyGroups).forEach((countySlug) => {
      const entries = [];

      entries.push({
        loc: pageUrl(`/county/${countySlug}/`),
        lastmod: TODAY,
        priority: '0.9',
      });

      countyGroups[countySlug].forEach((city) => {
        if (!city.City) return;
        const citySlug = slugifyCity(city.City);

        services.forEach((svc) => {
          if (ONLY_RICH_CITY_SERVICE_PAGES && !svc.richTextSource[citySlug]) {
            return;
          }

          entries.push({
            loc: pageUrl(`/${svc.prefix}-${citySlug}/`),
            lastmod: TODAY,
            priority: svc.richTextSource[citySlug] ? '0.75' : '0.6',
          });
        });
      });

      const fileName = `sitemap-county-${countySlug}.xml`;
      fs.writeFileSync(path.join(PUBLIC_PATH, fileName), buildUrlSet(entries));
      sitemapFiles.push(fileName);
    });

    const blogSitemapEntries = [];

    blogEntries.forEach((post) => {
      blogSitemapEntries.push({
        loc: pageUrl(`/blog/${post.slug}/`),
        lastmod: post.updatedDate || post.pubDate || TODAY,
        priority: '0.7',
      });
    });

    const totalBlogPages = Math.ceil(blogEntries.length / POSTS_PER_PAGE);
    for (let page = 2; page <= totalBlogPages; page++) {
      blogSitemapEntries.push({
        loc: pageUrl(`/blog/page/${page}/`),
        lastmod: TODAY,
        priority: '0.6',
      });
    }

    const categories = [...new Set(blogEntries.map((post) => post.category).filter(Boolean))];

    categories.forEach((category) => {
      const categorySlug = slugifyCategory(category);
      const categoryPosts = blogEntries.filter((post) => post.category === category);
      const totalCategoryPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);
      const categoryLastMod =
        categoryPosts[0]?.updatedDate || categoryPosts[0]?.pubDate || TODAY;

      blogSitemapEntries.push({
        loc: pageUrl(`/blog/category/${categorySlug}/`),
        lastmod: categoryLastMod,
        priority: '0.6',
      });

      for (let page = 2; page <= totalCategoryPages; page++) {
        blogSitemapEntries.push({
          loc: pageUrl(`/blog/category/${categorySlug}/page/${page}/`),
          lastmod: categoryLastMod,
          priority: '0.5',
        });
      }
    });

    if (blogSitemapEntries.length > 0) {
      fs.writeFileSync(
        path.join(PUBLIC_PATH, 'sitemap-blog.xml'),
        buildUrlSet(blogSitemapEntries),
      );
      sitemapFiles.push('sitemap-blog.xml');
    }

    let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    sitemapFiles.forEach((file) => {
      indexXml += `\n  <sitemap>`;
      indexXml += `\n    <loc>${escapeXml(fileUrl(file))}</loc>`;
      indexXml += `\n    <lastmod>${TODAY}</lastmod>`;
      indexXml += `\n  </sitemap>`;
    });

    indexXml += `\n</sitemapindex>`;

    fs.writeFileSync(path.join(PUBLIC_PATH, 'sitemap-index.xml'), indexXml);

    console.log(`✅ TAMAMLANDI: Toplam ${sitemapFiles.length} sitemap dosyası PUBLIC klasörüne yazıldı.`);
    if (ONLY_RICH_CITY_SERVICE_PAGES) {
      console.log('ℹ️ SITEMAP_ONLY_RICH_PAGES=true: only rich city/service pages were included.');
    }
  } catch (err) {
    console.error('❌ HATA:', err.message);
    process.exit(1);
  }
}

generate();
