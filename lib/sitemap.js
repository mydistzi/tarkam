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
  return candidate ? `/category/${candidate}` : null;
}

export async function generateSitemapXml() {
  const { baseUrl, apiBaseUrl } = getSitemapRuntimeConfig();

  const [blogsPayload, categoriesPayload] = await Promise.all([
    fetchApiData(apiBaseUrl, '/blogs'),
    fetchApiData(apiBaseUrl, '/categories'),
  ]);

  const blogs = normalizeList(blogsPayload);
  const categories = normalizeList(categoriesPayload);
  const sitemapStream = new SitemapStream({
    hostname: baseUrl,
    cacheTime: 600000,
  });

  sitemapStream.write({
    url: '/',
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString(),
  });

  for (const blog of blogs) {
    const path = buildBlogPath(blog);
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

  for (const page of ['/about', '/contact', '/gallery', '/platforms']) {
    sitemapStream.write({
      url: page,
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
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
