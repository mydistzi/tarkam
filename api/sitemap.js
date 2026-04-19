import { generateSitemapXml, clearSitemapCache } from '../lib/sitemap.js';

export default async function handler(req, res) {
  try {
    // Clear cache if refresh query param is set
    if (req.query.refresh === 'true') {
      clearSitemapCache();
    }

    const sitemap = await generateSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error.message);
    res.status(500).send('Error generating sitemap');
  }
}
