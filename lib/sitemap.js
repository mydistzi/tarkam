import axios from 'axios';

/**
 * Helper untuk memastikan URL bersih dari double slash
 */
function normalizeBaseUrl(value, fallback) {
  const rawValue = String(value || fallback || '').trim();
  if (!rawValue) return fallback;
  const normalized = /^https?:\/\//i.test(rawValue)
    ? rawValue
    : `https://${rawValue.replace(/^\/+/, '')}`;
  return normalized.replace(/\/+$/, '');
}

/**
 * CRITICAL: Google mewajibkan format tanggal W3C (ISO 8601).
 * Database biasanya kasih format "YYYY-MM-DD HH:mm:ss", ini harus diubah.
 */
function formatDate(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    // Mengembalikan format YYYY-MM-DD
    return date.toISOString().split('T')[0];
  } catch (error) {
    return null;
  }
}

/**
 * Karakter khusus harus di-escape supaya XML tidak rusak
 */
function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const API_BASE_URL = normalizeBaseUrl(
  process.env.API_BASE_URL || process.env.VITE_API_BASE_URL,
  'https://tarkam-api-web-production.up.railway.app/api/v1'
);
const SITE_URL = normalizeBaseUrl(
  process.env.BASE_URL || process.env.SITE_URL,
  'https://tarkam.fun'
);

let cachedSitemap = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

async function fetchFromAPI(endpoint) {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      timeout: 15000,
    });
    return response.data?.data || [];
  } catch (error) {
    console.error(`Gagal ambil data ${endpoint}:`, error.message);
    return [];
  }
}

export async function generateSitemapXml() {
  if (cachedSitemap && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
    return cachedSitemap;
  }

  const urls = [];

  // 1. Static Pages
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/tarkam-schedule', priority: 0.8, changefreq: 'daily' },
    { url: '/jadwal-pertandingan', priority: 0.8, changefreq: 'daily' },
    { url: '/klub', priority: 0.7, changefreq: 'weekly' },
    { url: '/news', priority: 0.8, changefreq: 'daily' },
    { url: '/shop', priority: 0.8, changefreq: 'weekly' },
    { url: '/sponsors', priority: 0.7, changefreq: 'monthly' },
    { url: '/global-leaderboard', priority: 0.6, changefreq: 'daily' },
    { url: '/pusat-bantuan', priority: 0.5, changefreq: 'monthly' },
    { url: '/kebijakan-privasi', priority: 0.3, changefreq: 'monthly' },
    { url: '/hubungi-kami', priority: 0.5, changefreq: 'monthly' },
  ];

  staticPages.forEach((page) => {
    urls.push({
      loc: `${SITE_URL}${page.url}`,
      priority: page.priority,
      changefreq: page.changefreq,
      lastmod: formatDate(new Date()) // Halaman statis anggap update hari ini
    });
  });

  // 2. Fetch Dynamic Content
  try {
    const [blogs, products, players, teams, contests] = await Promise.all([
      fetchFromAPI('/blogs'),
      fetchFromAPI('/products'),
      fetchFromAPI('/players'),
      fetchFromAPI('/teams'),
      fetchFromAPI('/contests'),
    ]);

    // Blogs
    blogs.forEach((b) => {
      if (b.slug) urls.push({
        loc: `${SITE_URL}/detail-news/${b.slug}`,
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: formatDate(b.updated_at || b.created_at)
      });
    });

    // Products
    products.forEach((p) => {
      if (p.slug) urls.push({
        loc: `${SITE_URL}/detail-shop/${p.slug}`,
        priority: 0.7,
        changefreq: 'weekly',
        lastmod: formatDate(p.updated_at || p.created_at)
      });
    });

    // Players
    players.forEach((pl) => {
      if (pl.slug) urls.push({
        loc: `${SITE_URL}/detail-player/${pl.slug}`,
        priority: 0.6,
        changefreq: 'weekly',
        lastmod: formatDate(pl.updated_at || pl.created_at)
      });
    });

    // Teams
    teams.forEach((t) => {
      if (t.id || t.slug) urls.push({
        loc: `${SITE_URL}/detail-tim/${t.slug || t.id}`,
        priority: 0.6,
        changefreq: 'weekly',
        lastmod: formatDate(t.updated_at || t.created_at)
      });
    });

    // Contests
    contests.forEach((c) => {
      if (c.id) urls.push({
        loc: `${SITE_URL}/detail-pertandingan/${c.id}`,
        priority: 0.9, // Pertandingan biasanya paling dicari
        changefreq: 'daily',
        lastmod: formatDate(c.updated_at || c.created_at)
      });
    });

  } catch (error) {
    console.error('Error fetching dynamic content:', error.message);
  }

  // 3. Build XML String
  // PENTING: Jangan ada spasi atau baris kosong sebelum tag <?xml
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  urls.forEach((item) => {
    xml += '\n  <url>';
    xml += `\n    <loc>${escapeXml(item.loc)}</loc>`;
    if (item.lastmod) {
      xml += `\n    <lastmod>${item.lastmod}</lastmod>`;
    }
    xml += `\n    <changefreq>${item.changefreq}</changefreq>`;
    xml += `\n    <priority>${item.priority}</priority>`;
    xml += '\n  </url>';
  });

  xml += '\n</urlset>';

  cachedSitemap = xml;
  cacheTime = Date.now();
  return xml;
}