import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// --- AYARLAR ---
const SITE_URL = 'https://www.protreetrim.com';
const CSV_PATH = path.join(process.cwd(), 'src/data/cities.csv');
const PUBLIC_PATH = path.join(process.cwd(), 'public');
const TODAY = new Date().toISOString().split('T')[0];

async function generate() {
    console.log('🚀 Public klasörüne sitemap oluşturuluyor...');

    try {
        // 1. Verileri Oku
        const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
        const records = parse(fileContent, { columns: true, skip_empty_lines: true, bom: true });

        // 2. Statik Sayfalar İçin Ana Sitemap
        const staticPages = [
            '', '/about', '/contact', '/services', '/gallery', 
            '/trust-safety', '/privacy', '/join-network',
            '/services/tree-removal', '/services/tree-trimming', 
            '/services/stump-grinding', '/services/emergency-response',
            '/services/land-clearing', '/services/commercial-services'
        ];

        let mainXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
        staticPages.forEach(page => {
            mainXml += `\n  <url>\n    <loc>${SITE_URL}${page}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>`;
        });
        mainXml += `\n</urlset>`;
        fs.writeFileSync(path.join(PUBLIC_PATH, 'sitemap-main.xml'), mainXml);

        // 3. İlçelere Göre Grupla ve Dinamik Sayfaları Oluştur
        const countyGroups = {};
        records.forEach(row => {
            if (!row.County) return;
            const county = row.County.toLowerCase().trim().replace(/\s+/g, '-');
            if (!countyGroups[county]) countyGroups[county] = [];
            countyGroups[county].push(row);
        });

        const services = [
            { prefix: 'tree-removal' },
            { prefix: 'stump-grinding' },
            { prefix: 'emergency-service' }
        ];

        const sitemapFiles = ['sitemap-main.xml'];

        Object.keys(countyGroups).forEach(countySlug => {
            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
            
            // İlçe Hub Sayfası
            xml += `\n  <url>\n    <loc>${SITE_URL}/county/${countySlug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.9</priority>\n  </url>`;

            countyGroups[countySlug].forEach(city => {
                if (!city.City) return;
                const citySlug = city.City.toLowerCase().trim().replace(/\./g, '').replace(/\s+/g, '-');
                services.forEach(svc => {
                    xml += `\n  <url>\n    <loc>${SITE_URL}/${svc.prefix}-${citySlug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.7</priority>\n  </url>`;
                });
            });

            xml += `\n</urlset>`;
            const fileName = `sitemap-county-${countySlug}.xml`;
            fs.writeFileSync(path.join(PUBLIC_PATH, fileName), xml);
            sitemapFiles.push(fileName);
        });

        // 4. Ana sitemap-index.xml Dosyasını Oluştur
        let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
        sitemapFiles.forEach(file => {
            indexXml += `\n  <sitemap>\n    <loc>${SITE_URL}/${file}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`;
        });
        indexXml += `\n</sitemapindex>`;
        
        fs.writeFileSync(path.join(PUBLIC_PATH, 'sitemap-index.xml'), indexXml);
        console.log(`✅ TAMAMLANDI: Toplam ${sitemapFiles.length} sitemap dosyası PUBLIC klasörüne yazıldı.`);

    } catch (err) {
        console.error('❌ HATA:', err.message);
        process.exit(1);
    }
}

generate();