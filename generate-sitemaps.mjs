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
        // Vercel build bittiğinde dosyaları 'dist/client' içinden okur.
        // Biz her iki klasöre de (dist ve dist/client) yazarak riski sıfırlıyoruz.
        const rootDist = path.join(process.cwd(), 'dist');
        const clientDist = path.join(process.cwd(), 'dist/client');
        
        const targetPaths = [];
        if (fs.existsSync(rootDist)) targetPaths.push(rootDist);
        if (fs.existsSync(clientDist)) targetPaths.push(clientDist);

        if (targetPaths.length === 0) {
            throw new Error('HATA: dist klasörü bulunamadı! Önce build almalısınız.');
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

        // sitemap-0.xml Astro'nun oluşturduğu statik sayfaları (Home, About vb.) içerir.
        const sitemapFiles = ['sitemap-0.xml'];

        // 3. Her İlçe İçin Ayrı XML Dosyası Oluştur
        Object.keys(countyGroups).forEach(countySlug => {
            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
            
            // İlçe Hub Sayfası
            xml += `\n  <url>\n    <loc>${SITE_URL}/county/${countySlug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.9</priority>\n  </url>`;

            // O ilçeye bağlı şehirlerin 3 ayrı hizmet sayfası
            countyGroups[countySlug].forEach(city => {
                if (!city.City) return;
                const citySlug = city.City.toLowerCase().trim().replace(/\./g, '').replace(/\s+/g, '-');
                
                services.forEach(svc => {
                    xml += `\n  <url>\n    <loc>${SITE_URL}/${svc.prefix}-${citySlug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.8</priority>\n  </url>`;
                });
            });

            xml += `\n</urlset>`;
            
            const fileName = `sitemap-county-${countySlug}.xml`;
            
            // Dosyayı her iki klasöre de yaz
            targetPaths.forEach(p => {
                fs.writeFileSync(path.join(p, fileName), xml);
            });
            sitemapFiles.push(fileName);
        });

        // 4. Ana sitemap-index.xml Dosyasını Her Şeyi Kapsayacak Şekilde Yeniden Yaz
        let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        sitemapFiles.forEach(file => {
            indexXml += `\n  <sitemap>\n    <loc>${SITE_URL}/${file}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`;
        });

        indexXml += `\n</sitemapindex>`;
        
        targetPaths.forEach(p => {
            fs.writeFileSync(path.join(p, 'sitemap-index.xml'), indexXml);
            console.log(`✅ ${p}/sitemap-index.xml güncellendi.`);
        });

        console.log(`✨ TAMAMLANDI: Toplam ${sitemapFiles.length} sitemap dosyası aktif.`);

    } catch (err) {
        console.error('❌ KRİTİK HATA:', err.message);
        process.exit(1);
    }
}

generate();