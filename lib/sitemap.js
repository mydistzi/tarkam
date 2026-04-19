import axios from 'axios';
import { SitemapStream, streamToPromise } from 'sitemap';

const DEFAULT_BASE_URL = 'https://tarkam.fun';
const DEFAULT_API_BASE_URL = 'https://tarkam-api-web-production.up.railway.app/api/v1';

// Cache untuk sitemap
let sitemapCache = {
  data: null,
  timestamp: null,
  ttl: parseInt(process.env.SITEMAP_CACHE_TIME) || 600000, // 10 menit default
};

export function getSitemapRuntimeConfig() {
  return {
    baseUrl: process.env.BASE_URL || DEFAULT_BASE_URL,
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
  const timeout = parseInt(process.env.API_TIMEOUT) || 30000;

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
      console.log(`✅ Fetched ${endpoint}: ${count} items`);
    }

    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error.message);

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
  const candidate = blog?.id || blog?.slug || slugify(blog?.title);
  return candidate ? `/blog/${candidate}` : null;
}

function buildCategoryPath(category) {
  const candidate = category?.id || category?.slug || slugify(category?.name);
  return candidate ? `/blog-grid?category=${candidate}` : null;
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

  try {
    const [blogsPayload, categoriesPayload, productsPayload, playersPayload, teamsPayload, contestsPayload] = await Promise.all([
      fetchApiData(apiBaseUrl, '/blogs'),
      fetchApiData(apiBaseUrl, '/categories'),
      fetchApiData(apiBaseUrl, '/products'),
      fetchApiData(apiBaseUrl, '/players'),
      fetchApiData(apiBaseUrl, '/teams'),
      fetchApiData(apiBaseUrl, '/contests'),
    ]);

    const blogs = normalizeList(blogsPayload);
    const categories = normalizeList(categoriesPayload);
    const products = normalizeList(productsPayload);
    const players = normalizeList(playersPayload);
    const teams = normalizeList(teamsPayload);
    const contests = normalizeList(contestsPayload);

    // Extract hostname from baseUrl (remove protocol)
    const hostname = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    const sitemapStream = new SitemapStream({
      hostname: hostname,
      cacheTime: sitemapCache.ttl,
    });

    // Static pages
    const staticPages = [
      '/',
      '/index-2',
      '/about',
      '/our-gamers',
      '/sponsors',
      '/faq-page',
      '/upcoming-matches',
      '/stream-schedule',
      '/shop',
      '/cart',
      '/checkout',
      '/blog-grid',
      '/blog-classic',
      '/contact',
    ];

    for (const page of staticPages) {
      sitemapStream.write({
        url: page,
        changefreq: page === '/' ? 'daily' : 'weekly',
        priority: page === '/' ? 1.0 : 0.7,
        lastmod: new Date().toISOString(),
      });
    }

    // Dynamic content
    let totalUrls = staticPages.length;

    // Blogs
    for (const blog of blogs) {
      const path = blog?.id ? `/blog-details/${blog.id}` : buildBlogPath(blog);
      if (!path) continue;

      sitemapStream.write({
        url: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: blog?.updated_at || blog?.created_at || new Date().toISOString(),
      });
      totalUrls++;
    }

    // Categories
    for (const category of categories) {
      const path = buildCategoryPath(category);
      if (!path) continue;

      sitemapStream.write({
        url: path,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      });
      totalUrls++;
    }

    // Products
    for (const product of products) {
      if (!product?.id) continue;

      sitemapStream.write({
        url: `/shop-details/${product.id}`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: product?.updated_at || product?.created_at || new Date().toISOString(),
      });
      totalUrls++;
    }

    // Players
    for (const player of players) {
      if (!player?.id) continue;

      sitemapStream.write({
        url: `/player-details/${player.id}`,
        changefreq: 'weekly',
        priority: 0.5,
        lastmod: player?.updated_at || player?.created_at || new Date().toISOString(),
      });
      totalUrls++;
    }

    // Teams
    for (const team of teams) {
      if (!team?.id) continue;

      sitemapStream.write({
        url: `/team-details/${team.id}`,
        changefreq: 'weekly',
        priority: 0.5,
        lastmod: team?.updated_at || team?.created_at || new Date().toISOString(),
      });
      totalUrls++;
    }

    // Contests
    for (const contest of contests) {
      if (!contest?.id) continue;

      sitemapStream.write({
        url: `/match-details/${contest.id}`,
        changefreq: 'daily',
        priority: 0.6,
        lastmod: contest?.updated_at || contest?.created_at || new Date().toISOString(),
      });
      totalUrls++;
    }

    sitemapStream.end();
    const sitemap = await streamToPromise(sitemapStream);
    const sitemapXml = sitemap.toString();

    // Update cache
    sitemapCache.data = sitemapXml;
    sitemapCache.timestamp = now;

    console.log(`✅ Sitemap generated successfully: ${totalUrls} URLs`);
    return sitemapXml;

  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    console.error('📍 API Base URL:', apiBaseUrl);
    console.error('🔗 Stack:', error.stack);

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
