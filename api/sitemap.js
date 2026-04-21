import { generateSitemapXml } from '../lib/sitemap.js';

export default async function handler(req, res) {
  try {
    const sitemap = await generateSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).send(sitemap.trim());
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
}
