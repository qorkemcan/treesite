import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const SITE_URL = 'https://www.protreetrim.com';
const DIST_PATH = './dist'; // Vercel/Astro build çıktı klasörü

// 1. Verileri Oku
const fileContent = fs.readFileSync('./src/data/cities.csv', 'utf-8');
const records = parse(fileContent, { columns: true, skip_empty_lines: true, bom: true });

// 2. İlçelere Göre Grupla
const countyGroups = {};
records.forEach(row => {
    const county = row.County.toLowerCase().trim().replace(/\s+/g, '-');
    if (!countyGroups[county]) countyGroups[county] = [];
    countyGroups[county].push(row);
});

const services = [
    { prefix: 'tree-removal' },
    { prefix: 'stump-grinding' },
    { prefix: 'emergency-service' }
];

const sitemapFiles = [];

// 3. Her İlçe İçin Sitemap Oluştur
Object.keys(countyGroups).forEach(countySlug => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- County Hub Page -->
    <url>
        <loc>${SITE_URL}/county/${countySlug}</loc>
        <priority>0.9</priority>
    </url>`;

    countyGroups[countySlug].forEach(city => {
        const citySlug = city.City.toLowerCase().trim().replace(/\./g, '').replace(/\s+/g, '-');
        
        services.forEach(svc => {
            xml += `
    <url>
        <loc>${SITE_URL}/${svc.prefix}-${citySlug}</loc>
        <priority>0.8</priority>
    </url>`;
        });
    });

    xml += `\n</urlset>`;
    
    const fileName = `sitemap-county-${countySlug}.xml`;
    fs.writeFileSync(path.join(DIST_PATH, fileName), xml);
    sitemapFiles.push(fileName);
});

// 4. Ana Sitemap Index Dosyasını Oluştur
let indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

sitemapFiles.forEach(file => {
    indexXml += `
    <sitemap>
        <loc>${SITE_URL}/${file}</loc>
    </sitemap>`;
});

indexXml += `\n</sitemapindex>`;
fs.writeFileSync(path.join(DIST_PATH, 'sitemap-index.xml'), indexXml);

console.log(`✅ ${sitemapFiles.length} adet ilçe sitemap dosyası ve index başarıyla oluşturuldu!`);