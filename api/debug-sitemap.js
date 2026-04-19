export default async function handler(req, res) {
  console.log('🔍 Debug Sitemap - Testing API calls');
  
  try {
    const axios = require('axios');
    const baseUrl = 'https://tarkam-api-web-production.up.railway.app/api/v1';
    
    console.log('📍 API Base URL:', baseUrl);
    console.log('📍 API_BASE_URL env:', process.env.API_BASE_URL);
    
    // Test each endpoint
    const endpoints = [
      '/blogs',
      '/categories',
      '/products',
      '/players',
      '/teams',
      '/contests'
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Fetching ${endpoint}...`);
        const response = await axios.get(`${baseUrl}${endpoint}?limit=1000`, {
          timeout: 5000,
          headers: { 'Accept': 'application/json' }
        });
        
        const data = response.data;
        const count = data?.data?.data?.length || data?.data?.length || 0;
        
        console.log(`✅ ${endpoint}: ${count} items`);
        results[endpoint] = {
          status: 'ok',
          count,
          structure: Object.keys(data)
        };
      } catch (error) {
        console.error(`❌ ${endpoint}: ${error.message}`);
        results[endpoint] = {
          status: 'error',
          error: error.message
        };
      }
    }
    
    res.json({
      timestamp: new Date().toISOString(),
      environment: {
        api_base_url: process.env.API_BASE_URL,
        debug_sitemap: process.env.DEBUG_SITEMAP,
        node_env: process.env.NODE_ENV
      },
      results
    });
    
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}