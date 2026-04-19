import { generateSitemapXml } from '../lib/sitemap.js';

export default async function handler(req, res) {
  try {
    console.log('🚀 Starting sitemap generation test...');
    const sitemap = await generateSitemapXml();
    console.log(`✅ Success! Generated ${(sitemap.match(/<url>/g) || []).length} URLs`);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      urlCount: (sitemap.match(/<url>/g) || []).length,
      sitemapLength: sitemap.length,
      firstUrl: sitemap.match(/<loc>.*?<\/loc>/)?.[0] || 'N/A'
    });
  } catch (error) {
    console.error('❌ Test error:', error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
