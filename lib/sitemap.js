import axios from 'axios';

const DEFAULT_BASE_URL = 'https://tarkam.fun';
const DEFAULT_API_BASE_URL = 'https://tarkam-api-web-production.up.railway.app/api/v1';

// Cache untuk sitemap
let sitemapCache = {
  data: null,
  timestamp: null,
  ttl: parseInt(process.env.SITEMAP_CACHE_TIME) || 600000, // 10 menit default
};

export function getSitemapRuntimeConfig() {
  let baseUrl = process.env.BASE_URL || DEFAULT_BASE_URL;
  
  // Ensure baseUrl has protocol
  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
  }
  
  return {
    baseUrl,
    apiBaseUrl: process.env.API_BASE_URL || DEFAULT_API_BASE_URL,
  };
}

export function clearSitemapCache() {
  console.log('🧹 Clearing sitemap cache');
  sitemapCache = {
    data: null,
    timestamp: null,
    ttl: parseInt(process.env.SITEMAP_CACHE_TIME) || 600000,
  };
}

async function fetchApiData(apiBaseUrl, endpoint) {
  const timeout = parseInt(process.env.API_TIMEOUT) || 5000; // Reduced from 30s to 5s for Vercel timeout

  try {
    // Add limit parameter untuk fetch lebih banyak data
    const url = `${apiBaseUrl}${endpoint}?limit=1000`;

    const response = await axios.get(url, {
      timeout,
      headers: {
        'User-Agent': 'Tarkam-Sitemap-Generator/1.0',
        'Accept': 'application/json',
      },
    });

    if (process.env.DEBUG_SITEMAP === 'true') {
      const count = response.data?.data?.data?.length || response.data?.data?.length || 0;
      console.log(`✅ Fetched ${endpoint}: ${count} items in ${response.config.timeout}ms`);
    }

    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint} (timeout: ${timeout}ms):`, error.message);

    // Return empty array instead of throwing to prevent sitemap generation failure
    return { data: { data: [] } };
  }
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeList(payload) {
  // Handle paginated response: { data: { data: [...], current_page, ... } }
  if (payload?.data?.data && Array.isArray(payload.data.data)) {
    return payload.data.data;
  }
  // Fallback: handle direct array response
  return Array.isArray(payload?.data) ? payload.data : [];
}

function buildBlogPath(blog) {
  const candidate = blog?.slug || slugify(blog?.title);
  return candidate ? `/detail-news/${candidate}` : null;
}

function buildProductPath(product) {
  const candidate = product?.slug || slugify(product?.name);
  return candidate ? `/detail-shop/${candidate}` : null;
}

function buildPlayerPath(player) {
  const candidate = player?.slug || slugify(player?.name);
  return candidate ? `/detail-player/${candidate}` : null;
}

export async function generateSitemapXml() {
  const now = Date.now();

  // Check cache validity
  if (sitemapCache.data && sitemapCache.timestamp && (now - sitemapCache.timestamp) < sitemapCache.ttl) {
    if (process.env.DEBUG_SITEMAP === 'true') {
      console.log('📋 Serving sitemap from cache');
    }
    return sitemapCache.data;
  }

  const { baseUrl, apiBaseUrl } = getSitemapRuntimeConfig();

  console.log('🔄 Generating fresh sitemap...');
  console.log(`📍 Using baseUrl: ${baseUrl}, apiBaseUrl: ${apiBaseUrl}`);

  try {
    console.log('🔗 Fetching API data...');
    const [blogsPayload, productsPayload, playersPayload, teamsPayload, contestsPayload] = await Promise.all([
      fetchApiData(apiBaseUrl, '/blogs'),
      fetchApiData(apiBaseUrl, '/products'),
      fetchApiData(apiBaseUrl, '/players'),
      fetchApiData(apiBaseUrl, '/teams'),
      fetchApiData(apiBaseUrl, '/contests'),
    ]);
    console.log('✅ API data fetched successfully');

    console.log('📊 Normalizing lists...');
    const blogs = normalizeList(blogsPayload);
    const products = normalizeList(productsPayload);
    const players = normalizeList(playersPayload);
    const teams = normalizeList(teamsPayload);
    const contests = normalizeList(contestsPayload);
    console.log(`📊 Normalized: blogs=${blogs.length}, products=${products.length}, players=${players.length}, teams=${teams.length}, contests=${contests.length}`);

    // Generate sitemap as string instead of using SitemapStream
    let urls = [];

    // Static pages - ONLY include pages that exist in routes.tsx
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/tarkam-schedule', changefreq: 'weekly', priority: 0.8 },
      { url: '/jadwal-pertandingan', changefreq: 'weekly', priority: 0.8 },
      { url: '/klub', changefreq: 'weekly', priority: 0.7 },
      { url: '/news', changefreq: 'weekly', priority: 0.8 },
      { url: '/shop', changefreq: 'weekly', priority: 0.8 },
      { url: '/sponsors', changefreq: 'weekly', priority: 0.7 },
      { url: '/sponsor-leaderboard', changefreq: 'weekly', priority: 0.6 },
      { url: '/global-leaderboard', changefreq: 'weekly', priority: 0.6 },
      { url: '/club-leaderboard', changefreq: 'weekly', priority: 0.6 },
      { url: '/male-leaderboard', changefreq: 'weekly', priority: 0.6 },
      { url: '/female-leaderboard', changefreq: 'weekly', priority: 0.6 },
      { url: '/pusat-bantuan', changefreq: 'weekly', priority: 0.6 },
      { url: '/kebijakan-privasi', changefreq: 'monthly', priority: 0.5 },
      { url: '/comment-policy', changefreq: 'monthly', priority: 0.5 },
      { url: '/syarat-dan-ketentuan', changefreq: 'monthly', priority: 0.5 },
      { url: '/ketentuan-penggunaan', changefreq: 'monthly', priority: 0.5 },
      { url: '/ketentuan-penghapusan-data', changefreq: 'monthly', priority: 0.5 },
      { url: '/hubungi-kami', changefreq: 'weekly', priority: 0.7 },
      { url: '/cart', changefreq: 'weekly', priority: 0.7 },
      { url: '/checkout', changefreq: 'weekly', priority: 0.7 },
    ];

    urls.push(...staticPages);
    console.log(`📄 Added ${staticPages.length} static pages`);

    // Dynamic content
    // News/Blogs
    console.log('🔄 Processing blogs...');
    for (const blog of blogs) {
      const path = buildBlogPath(blog);
      if (!path) {
        console.log(`⚠️  Skipping blog (no path): ${blog?.slug || blog?.title}`);
        continue;
      }

      urls.push({
        url: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: blog?.updated_at || blog?.created_at || new Date().toISOString(),
      });
    }
    console.log(`✅ Added ${blogs.length} blog URLs`);

    // Products/Shop
    console.log('🔄 Processing products...');
    for (const product of products) {
      const path = buildProductPath(product);
      if (!path) {
        console.log(`⚠️  Skipping product (no path): ${product?.slug || product?.name}`);
        continue;
      }

      urls.push({
        url: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: product?.updated_at || product?.created_at || new Date().toISOString(),
      });
    }
    console.log(`✅ Added ${products.length} product URLs`);

    // Players
    console.log('🔄 Processing players...');
    for (const player of players) {
      const path = buildPlayerPath(player);
      if (!path) {
        console.log(`⚠️  Skipping player (no path): ${player?.slug || player?.name}`);
        continue;
      }

      urls.push({
        url: path,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: player?.updated_at || player?.created_at || new Date().toISOString(),
      });
    }
    console.log(`✅ Added ${players.length} player URLs`);

    // Teams
    console.log('🔄 Processing teams...');
    for (const team of teams) {
      const slug = team?.slug || slugify(team?.name);
      if (!slug) {
        console.log(`⚠️  Skipping team (no slug): ${team?.name}`);
        continue;
      }

      urls.push({
        url: `/detail-tim/${team.id}`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: team?.updated_at || team?.created_at || new Date().toISOString(),
      });
    }
    console.log(`✅ Added ${teams.length} team URLs`);

    // Contests/Matches
    console.log('🔄 Processing contests...');
    for (const contest of contests) {
      if (!contest?.id) {
        console.log(`⚠️  Skipping contest (no id)`);
        continue;
      }

      urls.push({
        url: `/detail-pertandingan/${contest.id}`,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: contest?.updated_at || contest?.created_at || new Date().toISOString(),
      });
    }
    console.log(`✅ Added ${contests.length} contest URLs`);

    // Build XML string
    console.log('🔨 Building XML...');
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const item of urls) {
      xmlContent += '  <url>\n';
      xmlContent += `    <loc>${baseUrl}${item.url}</loc>\n`;
      if (item.lastmod) {
        xmlContent += `    <lastmod>${item.lastmod}</lastmod>\n`;
      }
      if (item.changefreq) {
        xmlContent += `    <changefreq>${item.changefreq}</changefreq>\n`;
      }
      if (item.priority) {
        xmlContent += `    <priority>${item.priority}</priority>\n`;
      }
      xmlContent += '  </url>\n';
    }
    
    xmlContent += '</urlset>';

    // Update cache
    sitemapCache.data = xmlContent;
    sitemapCache.timestamp = now;

    console.log(`✅ Sitemap generated successfully: ${urls.length} URLs`);
    return xmlContent;

  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    console.error('📍 Error name:', error.name);
    console.error('📍 Error code:', error.code);
    console.error('🔗 Full error:', JSON.stringify({
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }));

    // Return cached version if available, otherwise return minimal sitemap
    if (sitemapCache.data) {
      console.log('⚠️  Serving stale sitemap from cache due to generation error');
      return sitemapCache.data;
    }

    // Fallback minimal sitemap
    const { baseUrl } = getSitemapRuntimeConfig();
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
</urlset>`;

    console.log('⚠️  Serving fallback minimal sitemap');
    return fallbackSitemap;
  }
}

export function getSitemapHealthPayload() {
  const { baseUrl, apiBaseUrl } = getSitemapRuntimeConfig();

  const cacheAge = sitemapCache.timestamp ? Date.now() - sitemapCache.timestamp : null;
  const cacheValid = cacheAge ? cacheAge < sitemapCache.ttl : false;

  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Tarkam Sitemap Generator',
    version: '2.0.0',
    runtime: {
      baseUrl,
      apiBaseUrl,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
    },
    cache: {
      enabled: true,
      ttl: sitemapCache.ttl,
      age: cacheAge,
      valid: cacheValid,
      lastGenerated: sitemapCache.timestamp ? new Date(sitemapCache.timestamp).toISOString() : null,
    },
    endpoints: {
      sitemap: `${baseUrl}/sitemap.xml`,
      robots: `${baseUrl}/robots.txt`,
      health: `${baseUrl}/health`,
    },
  };
}
