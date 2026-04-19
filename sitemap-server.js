import express from 'express';
import { generateSitemapXml, getSitemapHealthPayload } from './lib/sitemap.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware untuk logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Middleware untuk CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Route untuk sitemap.xml dengan caching headers
app.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemapXml();

    // Set caching headers untuk SEO
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600'); // Cache 1 jam
    res.header('Last-Modified', new Date().toUTCString());
    res.header('ETag', `"sitemap-${Date.now()}"`);

    res.send(sitemap);
  } catch (error) {
    console.error('Error serving sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Route untuk plain XML sitemap (untuk debugging)
app.get('/sitemap-plain.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemapXml();
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemap);
  } catch (error) {
    console.error('Error serving plain sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  const healthPayload = getSitemapHealthPayload();

  // Tambahkan informasi runtime
  healthPayload.uptime = process.uptime();
  healthPayload.memory = process.memoryUsage();
  healthPayload.timestamp = new Date().toISOString();

  res.json(healthPayload);
});

// Route untuk robots.txt
app.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://tarkam.fun/sitemap.xml

# Block access to admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/
`;

  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.send(robotsTxt);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Endpoint not found',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Tarkam Sitemap Server running on port ${port}`);
  console.log(`📄 Sitemap available at: http://localhost:${port}/sitemap.xml`);
  console.log(`📄 Plain sitemap at: http://localhost:${port}/sitemap-plain.xml`);
  console.log(`🤖 Robots.txt at: http://localhost:${port}/robots.txt`);
  console.log(`💚 Health check at: http://localhost:${port}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base URL: ${process.env.BASE_URL || 'https://tarkam.fun'}`);
});

export default app;
