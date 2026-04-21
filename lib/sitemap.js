import axios from 'axios';

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  'https://tarkam-api-web-production.up.railway.app/api/v1';
const SITE_URL =
  process.env.BASE_URL ||
  process.env.SITE_URL ||
  'https://tarkam.fun';

let cachedSitemap = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchFromAPI(endpoint) {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      timeout: 15000,
    });
    return response.data?.data || [];
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error.message);
    return [];
  }
}

export async function generateSitemapXml() {
  // Return cached if still valid
  if (cachedSitemap && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
    console.log('Returning cached sitemap');
    return cachedSitemap;
  }

  console.log('Generating new sitemap...');

  const urls = [];

  // Static pages
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/tarkam-schedule', priority: 0.8, changefreq: 'weekly' },
    { url: '/jadwal-pertandingan', priority: 0.8, changefreq: 'weekly' },
    { url: '/klub', priority: 0.7, changefreq: 'weekly' },
    { url: '/news', priority: 0.8, changefreq: 'weekly' },
    { url: '/shop', priority: 0.8, changefreq: 'weekly' },
    { url: '/sponsors', priority: 0.7, changefreq: 'weekly' },
    { url: '/sponsor-leaderboard', priority: 0.6, changefreq: 'weekly' },
    { url: '/global-leaderboard', priority: 0.6, changefreq: 'weekly' },
    { url: '/club-leaderboard', priority: 0.6, changefreq: 'weekly' },
    { url: '/male-leaderboard', priority: 0.6, changefreq: 'weekly' },
    { url: '/female-leaderboard', priority: 0.6, changefreq: 'weekly' },
    { url: '/pusat-bantuan', priority: 0.6, changefreq: 'weekly' },
    { url: '/kebijakan-privasi', priority: 0.5, changefreq: 'monthly' },
    { url: '/comment-policy', priority: 0.5, changefreq: 'monthly' },
    { url: '/syarat-dan-ketentuan', priority: 0.5, changefreq: 'monthly' },
    { url: '/ketentuan-penggunaan', priority: 0.5, changefreq: 'monthly' },
    { url: '/ketentuan-penghapusan-data', priority: 0.5, changefreq: 'monthly' },
    { url: '/hubungi-kami', priority: 0.7, changefreq: 'weekly' },
    { url: '/cart', priority: 0.7, changefreq: 'weekly' },
    { url: '/checkout', priority: 0.7, changefreq: 'weekly' },
  ];

  staticPages.forEach((page) => {
    urls.push({
      loc: SITE_URL + page.url,
      priority: page.priority,
      changefreq: page.changefreq,
    });
  });

  // Fetch dynamic content
  try {
    const [blogs, products, players, teams, contests] = await Promise.all([
      fetchFromAPI('/blogs'),
      fetchFromAPI('/products'),
      fetchFromAPI('/players'),
      fetchFromAPI('/teams'),
      fetchFromAPI('/contests'),
    ]);

    console.log(`Fetched: ${blogs.length} blogs, ${products.length} products, ${players.length} players`);

    // Add blogs
    blogs.forEach((blog) => {
      if (blog.slug) {
        urls.push({
          loc: `${SITE_URL}/detail-news/${blog.slug}`,
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: blog.updated_at || blog.created_at,
        });
      }
    });

    // Add products
    products.forEach((product) => {
      if (product.slug) {
        urls.push({
          loc: `${SITE_URL}/detail-shop/${product.slug}`,
          priority: 0.7,
          changefreq: 'weekly',
          lastmod: product.updated_at || product.created_at,
        });
      }
    });

    // Add players
    players.forEach((player) => {
      if (player.slug) {
        urls.push({
          loc: `${SITE_URL}/detail-player/${player.slug}`,
          priority: 0.6,
          changefreq: 'weekly',
          lastmod: player.updated_at || player.created_at,
        });
      }
    });

    // Add teams
    teams.forEach((team) => {
      if (team.id) {
        urls.push({
          loc: `${SITE_URL}/detail-tim/${team.id}`,
          priority: 0.6,
          changefreq: 'weekly',
          lastmod: team.updated_at || team.created_at,
        });
      }
    });

    // Add contests
    contests.forEach((contest) => {
      if (contest.id) {
        urls.push({
          loc: `${SITE_URL}/detail-pertandingan/${contest.id}`,
          priority: 0.7,
          changefreq: 'daily',
          lastmod: contest.updated_at || contest.created_at,
        });
      }
    });
  } catch (error) {
    console.error('Error fetching dynamic content:', error.message);
  }

  // Build XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

  urls.forEach((item) => {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(item.loc)}</loc>\n`;
    if (item.lastmod) {
      xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    }
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  // Cache it
  cachedSitemap = xml;
  cacheTime = Date.now();

  console.log(`Sitemap generated with ${urls.length} URLs`);
  return xml;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function clearSitemapCache() {
  cachedSitemap = null;
  cacheTime = null;
}

export function getSitemapHealthPayload() {
  return {
    ok: true,
    siteUrl: SITE_URL,
    apiBaseUrl: API_BASE_URL,
    cacheDurationMs: CACHE_DURATION,
    cacheActive: Boolean(cachedSitemap && cacheTime && Date.now() - cacheTime < CACHE_DURATION),
    cacheGeneratedAt: cacheTime ? new Date(cacheTime).toISOString() : null,
  };
}
