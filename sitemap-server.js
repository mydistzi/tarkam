import express from 'express';
import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3001;

// Base URL for your website
const BASE_URL = process.env.BASE_URL || 'https://tarkam.fun';

// API endpoints
const API_BASE_URL = 'https://tarkam-api-web-production.up.railway.app/api/v1';

// Function to fetch data from API
async function fetchAPIData(endpoint) {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    return [];
  }
}

// Generate sitemap
async function generateSitemap() {
  try {
    // Fetch data from your APIs
    const [blogs, categories, webSettings] = await Promise.all([
      fetchAPIData('/blogs'),
      fetchAPIData('/categories'),
      fetchAPIData('/web-setting')
    ]);

    const sitemapStream = new SitemapStream({
      hostname: BASE_URL,
      cacheTime: 600000, // 10 minutes
    });

    // Add static pages
    sitemapStream.write({
      url: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString()
    });

    // Add blog pages
    if (blogs && blogs.data) {
      blogs.data.forEach(blog => {
        sitemapStream.write({
          url: `/blog/${blog.id || blog.slug || blog.title?.toLowerCase().replace(/\s+/g, '-')}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: blog.updated_at || blog.created_at || new Date().toISOString()
        });
      });
    }

    // Add category pages
    if (categories && categories.data) {
      categories.data.forEach(category => {
        sitemapStream.write({
          url: `/category/${category.id || category.slug || category.name?.toLowerCase().replace(/\s+/g, '-')}`,
          changefreq: 'weekly',
          priority: 0.6,
          lastmod: new Date().toISOString()
        });
      });
    }

    // Add other static pages based on your routes
    const staticPages = [
      '/about',
      '/contact',
      '/gallery',
      '/platforms'
    ];

    staticPages.forEach(page => {
      sitemapStream.write({
        url: page,
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString()
      });
    });

    sitemapStream.end();

    const sitemap = await streamToPromise(sitemapStream);
    return sitemap.toString();
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

// Route to serve sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemap();

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error serving sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Route to serve plain XML sitemap (for debugging)
app.get('/sitemap-plain.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemap();
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error serving plain sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Tarkam Sitemap Generator'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Tarkam Sitemap Server running on port ${port}`);
  console.log(`📄 Sitemap available at: http://localhost:${port}/sitemap.xml`);
  console.log(`📄 Plain sitemap at: http://localhost:${port}/sitemap-plain.xml`);
  console.log(`💚 Health check at: http://localhost:${port}/health`);
});

export default app;