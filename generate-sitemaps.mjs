import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import {
  canUseSharedCityContent,
  cityIdentitySlug,
  cityServiceSlug,
  contentKeySlug,
  countySlug as makeCountySlug,
} from './src/lib/slugs.js';
import { validateGenericSitemapEligibility } from './src/lib/generic-route-enrichment.js';

const SITE_URL = 'https://www.protreetrim.com';
const CSV_PATH = path.join(process.cwd(), 'src/data/cities.csv');
const BLOG_PATH = path.join(process.cwd(), 'src/content/blog');
const PUBLIC_PATH = path.join(process.cwd(), 'public');
const LASTMOD_MANIFEST_PATH = path.join(process.cwd(), 'src/data/sitemap-lastmod.json');
const POSTS_PER_PAGE = 12;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Generic city/service pages remain excluded unless their enrichment record passes
// the explicit, manually verified sitemap eligibility contract.

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function assertIsoDate(value, label) {
  if (!DATE_PATTERN.test(String(value))) {
    throw new Error(`${label} must be YYYY-MM-DD, got ${JSON.stringify(value)}`);
  }

  return value;
}

function normalizeFrontmatterDate(value, label) {
  if (!value) {
    throw new Error(`${label} is required`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${label} is invalid: ${value}`);
  }

  return date.toISOString().split('T')[0];
}

function maxDate(values) {
  const dates = values.filter(Boolean);
  if (dates.length === 0) {
    throw new Error('Cannot calculate max date from an empty list');
  }

  return dates.sort().at(-1);
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
    throw new Error(`Could not parse ${relativePath}: ${error.message}`);
  }
}

function loadLastmodManifest() {
  if (!fs.existsSync(LASTMOD_MANIFEST_PATH)) {
    throw new Error('Missing src/data/sitemap-lastmod.json');
  }

  const manifest = JSON.parse(fs.readFileSync(LASTMOD_MANIFEST_PATH, 'utf-8'));
  if (!manifest.staticUrls || !manifest.serviceSourceFallbacks || !manifest.countyHubFallback) {
    throw new Error('sitemap-lastmod.json must define staticUrls, serviceSourceFallbacks, and countyHubFallback');
  }

  Object.entries(manifest.staticUrls).forEach(([urlPath, date]) => {
    assertIsoDate(date, `staticUrls.${urlPath}`);
  });
  Object.entries(manifest.serviceSourceFallbacks).forEach(([service, date]) => {
    assertIsoDate(date, `serviceSourceFallbacks.${service}`);
  });
  assertIsoDate(manifest.countyHubFallback, 'countyHubFallback');

  return manifest;
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

      const pubDate = normalizeFrontmatterDate(frontmatter.pubDate, `${file}.pubDate`);
      const updatedDate = normalizeFrontmatterDate(frontmatter.updatedDate || frontmatter.pubDate, `${file}.updatedDate`);

      return {
        slug,
        category: normalizeCategory(frontmatter.category || ''),
        pubDate,
        updatedDate,
      };
    })
    .filter(Boolean);

  entries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return entries;
}

function getRichEntryLastmod(sourceEntry, fallbackDate, label) {
  if (
    sourceEntry &&
    typeof sourceEntry === 'object' &&
    !Array.isArray(sourceEntry) &&
    sourceEntry.updatedDate
  ) {
    return assertIsoDate(sourceEntry.updatedDate, `${label}.updatedDate`);
  }

  return fallbackDate;
}

function assertNoDuplicateLocs(entries, fileName) {
  const seen = new Set();
  for (const entry of entries) {
    if (seen.has(entry.loc)) {
      throw new Error(`${fileName} contains duplicate loc: ${entry.loc}`);
    }
    seen.add(entry.loc);
  }
}

function buildUrlSet(urlEntries, fileName) {
  if (urlEntries.length === 0) {
    throw new Error(`${fileName} cannot be empty`);
  }
  assertNoDuplicateLocs(urlEntries, fileName);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  urlEntries.forEach((entry) => {
    assertIsoDate(entry.lastmod, `${fileName}:${entry.loc}`);
    xml += `\n  <url>`;
    xml += `\n    <loc>${escapeXml(entry.loc)}</loc>`;
    xml += `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`;
    xml += `\n    <priority>${escapeXml(entry.priority || '0.7')}</priority>`;
    xml += `\n  </url>`;
  });

  xml += `\n</urlset>`;
  return xml;
}

function writeFileIfChanged(filePath, content, stats) {
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf-8');
    if (existing === content) {
      stats.unchanged += 1;
      return;
    }

    fs.writeFileSync(filePath, content);
    stats.updated += 1;
    return;
  }

  fs.writeFileSync(filePath, content);
  stats.created += 1;
}

function removeUnexpectedGeneratedSitemaps(expectedFiles, stats) {
  if (!fs.existsSync(PUBLIC_PATH)) {
    fs.mkdirSync(PUBLIC_PATH, { recursive: true });
    return;
  }

  const generatedSitemapPattern = /^(sitemap-index|sitemap-main|sitemap-blog|sitemap-county-.+)\.xml$/;

  fs.readdirSync(PUBLIC_PATH)
    .filter((file) => generatedSitemapPattern.test(file))
    .filter((file) => !expectedFiles.has(file))
    .forEach((file) => {
      fs.unlinkSync(path.join(PUBLIC_PATH, file));
      stats.removed += 1;
    });
}

function assertStaticManifestCoverage(staticPages, manifest) {
  const staticSet = new Set(staticPages);
  const manifestSet = new Set(Object.keys(manifest.staticUrls));

  const missing = [...staticSet].filter((page) => !manifestSet.has(page));
  const unused = [...manifestSet].filter((page) => !staticSet.has(page));

  if (missing.length > 0) {
    throw new Error(`Missing static lastmod manifest entries: ${missing.join(', ')}`);
  }
  if (unused.length > 0) {
    throw new Error(`Unused static lastmod manifest entries: ${unused.join(', ')}`);
  }
}

function getPagePosts(entries, page) {
  const start = (page - 1) * POSTS_PER_PAGE;
  return entries.slice(start, start + POSTS_PER_PAGE);
}

async function generate() {
  console.log('🚀 Public klasörüne sitemap oluşturuluyor...');

  try {
    const manifest = loadLastmodManifest();
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
    assertStaticManifestCoverage(staticPages, manifest);

    const mainEntries = staticPages.map((page) => ({
      loc: pageUrl(page),
      lastmod: manifest.staticUrls[page],
      priority: page === '/' ? '1.0' : '0.8',
    }));

    const sitemapOutputs = new Map();
    sitemapOutputs.set('sitemap-main.xml', {
      entries: mainEntries,
      xml: buildUrlSet(mainEntries, 'sitemap-main.xml'),
    });

    const countyGroups = {};
    records.forEach((row) => {
      if (!row.County) return;
      const county = makeCountySlug(row.County);
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

    services.forEach((service) => {
      if (!manifest.serviceSourceFallbacks[service.prefix]) {
        throw new Error(`Missing service source fallback lastmod for ${service.prefix}`);
      }
    });

    const routeContexts = loadJson('src/data/enrichment/route-context.json');
    if (!Array.isArray(routeContexts)) {
      throw new Error('src/data/enrichment/route-context.json must be an array');
    }

    const eligibleGenericRoutes = new Map();
    routeContexts.forEach((routeContext) => {
      const eligibility = validateGenericSitemapEligibility(routeContext);
      if (!eligibility.ok) {
        throw new Error(
          `Invalid generic sitemap eligibility for ${routeContext.publicUrl || '<unknown>'}: ${eligibility.errors.join('; ')}`,
        );
      }
      if (!eligibility.eligible) return;
      if (eligibleGenericRoutes.has(routeContext.publicUrl)) {
        throw new Error(`Duplicate eligible generic route: ${routeContext.publicUrl}`);
      }
      eligibleGenericRoutes.set(routeContext.publicUrl, routeContext);
    });
    const consumedEligibleGenericRoutes = new Set();

    Object.keys(countyGroups).forEach((countySlug) => {
      const cityServiceEntries = [];

      countyGroups[countySlug].forEach((city) => {
        if (!city.City) return;
        const cityContentSlug = contentKeySlug(city.City);

        services.forEach((svc) => {
          const routeSlug = cityServiceSlug(svc.prefix, city.City, city.County);
          const publicPath = `/${routeSlug}/`;
          const sourceEntry = svc.richTextSource[cityContentSlug];
          const hasRichText =
            canUseSharedCityContent(city.City, city.County) &&
            Boolean(sourceEntry);
          const eligibleGenericRoute = eligibleGenericRoutes.get(publicPath);

          if (hasRichText && eligibleGenericRoute) {
            throw new Error(`Eligible generic route conflicts with rich content: ${publicPath}`);
          }

          if (!hasRichText && !eligibleGenericRoute) {
            return;
          }

          if (eligibleGenericRoute) {
            const expectedIdentity = cityIdentitySlug(city.City, city.County);
            if (
              eligibleGenericRoute.service !== svc.prefix ||
              eligibleGenericRoute.cityIdentityKey !== expectedIdentity
            ) {
              throw new Error(`Eligible generic route identity mismatch: ${publicPath}`);
            }
            consumedEligibleGenericRoutes.add(publicPath);
          }

          const lastmod = hasRichText
            ? getRichEntryLastmod(
                sourceEntry,
                manifest.serviceSourceFallbacks[svc.prefix],
                `${svc.prefix}.${cityContentSlug}`,
              )
            : eligibleGenericRoute.contentUpdatedAt;

          cityServiceEntries.push({
            loc: pageUrl(publicPath),
            lastmod,
            priority: hasRichText ? '0.75' : '0.6',
          });
        });
      });

      const countyLastmod = maxDate([
        manifest.countyHubFallback,
        ...cityServiceEntries.map((entry) => entry.lastmod),
      ]);
      const entries = [
        {
          loc: pageUrl(`/county/${countySlug}/`),
          lastmod: countyLastmod,
          priority: '0.9',
        },
        ...cityServiceEntries,
      ];

      const fileName = `sitemap-county-${countySlug}.xml`;
      sitemapOutputs.set(fileName, {
        entries,
        xml: buildUrlSet(entries, fileName),
      });
    });

    const unconsumedEligibleRoutes = [...eligibleGenericRoutes.keys()].filter(
      (publicPath) => !consumedEligibleGenericRoutes.has(publicPath),
    );
    if (unconsumedEligibleRoutes.length > 0) {
      throw new Error(`Eligible generic routes are outside the route inventory: ${unconsumedEligibleRoutes.join(', ')}`);
    }

    const blogSitemapEntries = [];
    const totalBlogPages = Math.ceil(blogEntries.length / POSTS_PER_PAGE);

    for (let page = 1; page <= totalBlogPages; page++) {
      const pagePosts = getPagePosts(blogEntries, page);
      blogSitemapEntries.push({
        loc: pageUrl(page === 1 ? '/blog/' : `/blog/page/${page}/`),
        lastmod: maxDate(pagePosts.map((post) => post.updatedDate || post.pubDate)),
        priority: page === 1 ? '0.9' : '0.6',
      });
    }

    blogEntries.forEach((post) => {
      blogSitemapEntries.push({
        loc: pageUrl(`/blog/${post.slug}/`),
        lastmod: post.updatedDate || post.pubDate,
        priority: '0.7',
      });
    });

    const categoryMap = new Map();
    blogEntries.forEach((post) => {
      if (!post.category) return;
      const slug = slugifyCategory(post.category);
      if (!categoryMap.has(slug)) {
        categoryMap.set(slug, {
          category: normalizeCategory(post.category),
          posts: [],
        });
      }
      categoryMap.get(slug).posts.push(post);
    });

    categoryMap.forEach(({ posts }, categorySlug) => {
      const categoryPosts = [...posts].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      const totalCategoryPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);

      blogSitemapEntries.push({
        loc: pageUrl(`/blog/category/${categorySlug}/`),
        lastmod: maxDate(categoryPosts.map((post) => post.updatedDate || post.pubDate)),
        priority: '0.6',
      });

      for (let page = 2; page <= totalCategoryPages; page++) {
        const pagePosts = getPagePosts(categoryPosts, page);
        blogSitemapEntries.push({
          loc: pageUrl(`/blog/category/${categorySlug}/page/${page}/`),
          lastmod: maxDate(pagePosts.map((post) => post.updatedDate || post.pubDate)),
          priority: '0.5',
        });
      }
    });

    if (blogSitemapEntries.length > 0) {
      sitemapOutputs.set('sitemap-blog.xml', {
        entries: blogSitemapEntries,
        xml: buildUrlSet(blogSitemapEntries, 'sitemap-blog.xml'),
      });
    }

    const childSitemapFiles = [...sitemapOutputs.keys()];
    const expectedFiles = new Set([...childSitemapFiles, 'sitemap-index.xml']);
    let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    childSitemapFiles.forEach((file) => {
      const output = sitemapOutputs.get(file);
      const childLastmod = maxDate(output.entries.map((entry) => entry.lastmod));
      indexXml += `\n  <sitemap>`;
      indexXml += `\n    <loc>${escapeXml(fileUrl(file))}</loc>`;
      indexXml += `\n    <lastmod>${childLastmod}</lastmod>`;
      indexXml += `\n  </sitemap>`;
    });

    indexXml += `\n</sitemapindex>`;
    sitemapOutputs.set('sitemap-index.xml', {
      entries: [],
      xml: indexXml,
    });

    const stats = {
      created: 0,
      updated: 0,
      unchanged: 0,
      removed: 0,
    };

    removeUnexpectedGeneratedSitemaps(expectedFiles, stats);
    sitemapOutputs.forEach((output, fileName) => {
      writeFileIfChanged(path.join(PUBLIC_PATH, fileName), output.xml, stats);
    });

    console.log(
      `✅ TAMAMLANDI: ${childSitemapFiles.length} child sitemap + 1 index = ${expectedFiles.size} XML dosyası kontrol edildi.`,
    );
    console.log(
      `ℹ️ Sitemap write summary: created=${stats.created}, updated=${stats.updated}, unchanged=${stats.unchanged}, removed=${stats.removed}`,
    );
    console.log(
      `ℹ️ City/service sitemap policy: rich routes plus ${eligibleGenericRoutes.size} verified generic opt-in route(s).`,
    );
  } catch (err) {
    console.error('❌ HATA:', err.message);
    process.exit(1);
  }
}

generate();
