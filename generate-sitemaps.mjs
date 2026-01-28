import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// --- AYARLAR ---
const SITE_URL = 'https://www.protreetrim.com';
const CSV_PATH = path.join(process.cwd(), 'src/data/cities.csv');
const TODAY = new Date().toISOString().split('T')[0];

async function generate() {
    console.log('🚀 Sitemap oluşturma işlemi başlıyor...');

    try {
        // Vercel/Astro'nun dosyaları servis ettiği asıl klasör dist/client'dır.
        // Biz işimizi sağlama alıp her iki klasöre de yazdıracağız.
        const rootDist = path.join(process.cwd(), 'dist');
        const clientDist = path.join(process.cwd(), 'dist/client');
        
        const pathsToWrite = [];
        if (fs.existsSync(rootDist)) pathsToWrite.push(rootDist);
        if (fs.existsSync(clientDist)) pathsToWrite.push(clientDist);

        if (pathsToWrite.length === 0) {
            throw new Error('HATA: dist klasörü bulunamadı! Önce npm run build yapmalısınız.');
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

        // sitemap-0.xml Astro'nun oluşturduğu ana sayfaları (Home, About vb.) içerir.
        const sitemapFiles = ['sitemap-0.xml'];

        // 3. Her İlçe İçin Özel Sitemap Oluştur
        Object.keys(countyGroups).forEach(countySlug => {
            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
            
            // County Hub Sayfası
            xml += `\n  <url>\n    <loc>${SITE_URL}/county/${countySlug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.9</priority>\n  </url>`;

            // Şehir Sayfaları
            countyGroups[countySlug].forEach(city => {
                if (!city.City) return;
                const citySlug = city.City.toLowerCase().trim().replace(/\./g, '').replace(/\s+/g, '-');
                
                services.forEach(svc => {
                    xml += `\n  <url>\n    <loc>${SITE_URL}/${svc.prefix}-${citySlug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.8</priority>\n  </url>`;
                });
            });

            xml += `\n</urlset>`;
            
            const fileName = `sitemap-county-${countySlug}.xml`;
            
            // Dosyayı bulduğumuz tüm dist yollarına yaz
            pathsToWrite.forEach(p => {
                fs.writeFileSync(path.join(p, fileName), xml);
            });
            sitemapFiles.push(fileName);
        });

        // 4. ANA İNDEKS DOSYASINI OLUŞTUR (sitemap-index.xml)
        let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        sitemapFiles.forEach(file => {
            indexXml += `\n  <sitemap>\n    <loc>${SITE_URL}/${file}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`;
        });

        indexXml += `\n</sitemapindex>`;
        
        // ÖNEMLİ: Mevcut tüm sitemap-index.xml dosyalarının üzerine kendi indeksimizi yazıyoruz
        pathsToWrite.forEach(p => {
            fs.writeFileSync(path.join(p, 'sitemap-index.xml'), indexXml);
            console.log(`✅ Yazıldı: ${p}/sitemap-index.xml`);
        });

        console.log(`✨ BAŞARILI: Toplam ${sitemapFiles.length} sitemap dosyası yayına hazır!`);

    } catch (err) {
        console.error('❌ SİTEMAP HATASI:', err.message);
        process.exit(1);
    }
}

generate();