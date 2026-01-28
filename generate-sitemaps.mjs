import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// --- AYARLAR ---
const SITE_URL = 'https://www.protreetrim.com';
const CSV_PATH = path.join(process.cwd(), 'src/data/cities.csv');
const TODAY = new Date().toISOString().split('T')[0];

async function generate() {
    console.log('🚀 Özel Sitemap oluşturma işlemi başlıyor...');

    try {
        // Astro'nun build çıktısını koyduğu yer
        const distPath = path.join(process.cwd(), 'dist');
        
        if (!fs.existsSync(distPath)) {
            throw new Error('HATA: dist klasörü bulunamadı! Önce npm run build almalısınız.');
        }

        // 1. Verileri Oku
        const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
        const records = parse(fileContent, { columns: true, skip_empty_lines: true, bom: true });

        // 2. İlçelere Göre Grupla
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

        // sitemap-0.xml Astro'nun oluşturduğu ana sayfaları (About, Contact vb.) içerir.
        const sitemapFiles = [];
        if (fs.existsSync(path.join(distPath, 'sitemap-0.xml'))) {
            sitemapFiles.push('sitemap-0.xml');
        }

        // 3. Her İlçe İçin Ayrı XML Dosyası Oluştur
        Object.keys(countyGroups).forEach(countySlug => {
            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
            
            // İlçe Hub Sayfası
            xml += `\n  <url>\n    <loc>${SITE_URL}/county/${countySlug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.9</priority>\n  </url>`;

            // O ilçeye bağlı şehirlerin sayfaları
            countyGroups[countySlug].forEach(city => {
                if (!city.City) return;
                const citySlug = city.City.toLowerCase().trim().replace(/\./g, '').replace(/\s+/g, '-');
                
                services.forEach(svc => {
                    xml += `\n  <url>\n    <loc>${SITE_URL}/${svc.prefix}-${citySlug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.8</priority>\n  </url>`;
                });
            });

            xml += `\n</urlset>`;
            
            const fileName = `sitemap-county-${countySlug}.xml`;
            fs.writeFileSync(path.join(distPath, fileName), xml);
            sitemapFiles.push(fileName);
        });

        // 4. Ana sitemap-index.xml Dosyasını Oluştur
        let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        sitemapFiles.forEach(file => {
            indexXml += `\n  <sitemap>\n    <loc>${SITE_URL}/${file}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`;
        });

        indexXml += `\n</sitemapindex>`;
        
        fs.writeFileSync(path.join(distPath, 'sitemap-index.xml'), indexXml);

        console.log(`✅ TAMAMLANDI: Toplam ${sitemapFiles.length} sitemap dosyası sitemap-index.xml'e bağlandı.`);

    } catch (err) {
        console.error('❌ HATA:', err.message);
        process.exit(1);
    }
}

generate();