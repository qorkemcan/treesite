import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// --- AYARLAR ---
const SITE_URL = 'https://www.protreetrim.com';
const DIST_PATH = path.join(process.cwd(), 'dist');
const CSV_PATH = path.join(process.cwd(), 'src/data/cities.csv');
const TODAY = new Date().toISOString().split('T')[0];

async function generate() {
    console.log('🚀 Sitemap oluşturma işlemi başlıyor...');

    try {
        // 1. Verileri Oku
        if (!fs.existsSync(CSV_PATH)) {
            throw new Error('HATA: cities.csv dosyası bulunamadı! Yol: ' + CSV_PATH);
        }
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

        // Google'a sunulacak tüm sitemap dosyalarının listesi
        // sitemap-0.xml Astro'nun otomatik oluşturduğu (Ana sayfa, About vb.) dosyadır.
        const sitemapFiles = ['sitemap-0.xml'];

        // 3. Her İlçe İçin Özel Sitemap Oluştur
        Object.keys(countyGroups).forEach(countySlug => {
            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
            
            // County Hub Sayfası (Örn: /county/miami-dade)
            xml += `\n  <url>\n    <loc>${SITE_URL}/county/${countySlug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.9</priority>\n  </url>`;

            // Şehir Sayfaları (Örn: /tree-removal-miami)
            countyGroups[countySlug].forEach(city => {
                if (!city.City) return;
                // Noktaları sil, boşlukları tire yap (Astro slug yapısıyla tam uyumlu)
                const citySlug = city.City.toLowerCase().trim().replace(/\./g, '').replace(/\s+/g, '-');
                
                services.forEach(svc => {
                    xml += `\n  <url>\n    <loc>${SITE_URL}/${svc.prefix}-${citySlug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.8</priority>\n  </url>`;
                });
            });

            xml += `\n</urlset>`;
            
            const fileName = `sitemap-county-${countySlug}.xml`;
            fs.writeFileSync(path.join(DIST_PATH, fileName), xml);
            sitemapFiles.push(fileName);
        });

        // 4. ANA İNDEKS DOSYASINI OLUŞTUR (sitemap-index.xml)
        // Google'a sadece bu dosyayı göndermen yeterli olacak.
        let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        sitemapFiles.forEach(file => {
            // Sadece dosya dist içinde varsa indekse ekle (Hata önleyici)
            if (fs.existsSync(path.join(DIST_PATH, file))) {
                indexXml += `\n  <sitemap>\n    <loc>${SITE_URL}/${file}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`;
            }
        });

        indexXml += `\n</sitemapindex>`;
        
        // Astro'nun otomatik oluşturduğu indeksi bizimkiyle değiştiriyoruz
        fs.writeFileSync(path.join(DIST_PATH, 'sitemap-index.xml'), indexXml);

        console.log(`✅ BAŞARILI: Toplam ${sitemapFiles.length} sitemap dosyası sitemap-index.xml içinde birleştirildi!`);

    } catch (err) {
        console.error('❌ SİTEMAP HATASI:', err.message);
        process.exit(1);
    }
}

generate();