import axios from 'axios';
import { SitemapStream, streamToPromise } from 'sitemap';

const DEFAULT_BASE_URL = 'https://tarkam.fun';
const DEFAULT_API_BASE_URL = 'https://tarkam-api-web-production.up.railway.app/api/v1';

export function getSitemapRuntimeConfig() {
  return {
    baseUrl: process.env.BASE_URL || DEFAULT_BASE_URL,
    apiBaseUrl: process.env.API_BASE_URL || DEFAULT_API_BASE_URL,
  };
}

async function fetchApiData(apiBaseUrl, endpoint) {
  try {
    const response = await axios.get(`${apiBaseUrl}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    return [];
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
  const { baseUrl, apiBaseUrl } = getSitemapRuntimeConfig();

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
  const sitemapStream = new SitemapStream({
    hostname: baseUrl,
    cacheTime: 600000,
  });

  for (const page of [
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
  ]) {
    sitemapStream.write({
      url: page,
      changefreq: page === '/' ? 'daily' : 'weekly',
      priority: page === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    });
  }

  for (const blog of blogs) {
    const path = blog?.id ? `/blog-details/${blog.id}` : buildBlogPath(blog);
    if (!path) {
      continue;
    }

    sitemapStream.write({
      url: path,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: blog?.updated_at || blog?.created_at || new Date().toISOString(),
    });
  }

  for (const category of categories) {
    const path = buildCategoryPath(category);
    if (!path) {
      continue;
    }

    sitemapStream.write({
      url: path,
      changefreq: 'weekly',
      priority: 0.6,
      lastmod: new Date().toISOString(),
    });
  }

  for (const product of products) {
    if (!product?.id) {
      continue;
    }

    sitemapStream.write({
      url: `/shop-details/${product.id}`,
      changefreq: 'weekly',
      priority: 0.6,
      lastmod: product?.updated_at || product?.created_at || new Date().toISOString(),
    });
  }

  for (const player of players) {
    if (!player?.id) {
      continue;
    }

    sitemapStream.write({
      url: `/player-details/${player.id}`,
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: player?.updated_at || player?.created_at || new Date().toISOString(),
    });
  }

  for (const team of teams) {
    if (!team?.id) {
      continue;
    }

    sitemapStream.write({
      url: `/team-details/${team.id}`,
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: team?.updated_at || team?.created_at || new Date().toISOString(),
    });
  }

  for (const contest of contests) {
    if (!contest?.id) {
      continue;
    }

    sitemapStream.write({
      url: `/match-details/${contest.id}`,
      changefreq: 'daily',
      priority: 0.6,
      lastmod: contest?.updated_at || contest?.created_at || new Date().toISOString(),
    });
  }

  sitemapStream.end();
  const sitemap = await streamToPromise(sitemapStream);
  return sitemap.toString();
}

export function getSitemapHealthPayload() {
  const { baseUrl, apiBaseUrl } = getSitemapRuntimeConfig();

  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Tarkam Sitemap Generator',
    runtime: {
      baseUrl,
      apiBaseUrl,
    },
  };
}
