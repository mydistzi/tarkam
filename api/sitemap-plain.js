import { generateSitemapXml } from '../lib/sitemap.js';

export default async function handler(req, res) {
  try {
    const sitemap = await generateSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error serving plain sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}
