import express from 'express';
import { generateSitemapXml, getSitemapHealthPayload } from './lib/sitemap.js';

const app = express();
const port = process.env.PORT || 3001;

// Route to serve sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemapXml();

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemap);
  } catch (error) {
    console.error('Error serving sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Route to serve plain XML sitemap (for debugging)
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json(getSitemapHealthPayload());
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Tarkam Sitemap Server running on port ${port}`);
  console.log(`📄 Sitemap available at: http://localhost:${port}/sitemap.xml`);
  console.log(`📄 Plain sitemap at: http://localhost:${port}/sitemap-plain.xml`);
  console.log(`💚 Health check at: http://localhost:${port}/health`);
});

export default app;
