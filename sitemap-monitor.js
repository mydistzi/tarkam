#!/usr/bin/env node

/**
 * Sitemap Testing & Monitoring Script
 * Usage: node sitemap-monitor.js [command]
 *
 * Commands:
 *   test        - Test sitemap generation and endpoints
 *   health      - Check health status
 *   validate    - Validate sitemap XML structure
 *   monitor     - Continuous monitoring mode
 */

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const BASE_URL = process.env.BASE_URL || 'https://tarkam.fun';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const HEALTH_URL = process.env.HEALTH_URL || 'https://tarkam-sitemap-production.up.railway.app/health';

async function testSitemap() {
  console.log('🧪 Testing Sitemap Service...\n');

  try {
    // Test sitemap endpoint
    console.log('📄 Testing sitemap.xml...');
    const sitemapResponse = await axios.get(SITEMAP_URL, {
      timeout: 30000,
      headers: { 'User-Agent': 'Sitemap-Monitor/1.0' }
    });

    console.log(`✅ Sitemap accessible (${sitemapResponse.status})`);
    console.log(`📊 Content length: ${sitemapResponse.data.length} bytes`);
    console.log(`📅 Last modified: ${sitemapResponse.headers['last-modified'] || 'N/A'}`);

    // Parse XML to count URLs
    const parser = new XMLParser();
    const sitemapData = parser.parse(sitemapResponse.data);
    const urls = sitemapData.urlset?.url || [];
    const urlCount = Array.isArray(urls) ? urls.length : 1;

    console.log(`🔢 Total URLs in sitemap: ${urlCount}`);

    // Test health endpoint
    console.log('\n💚 Testing health endpoint...');
    const healthResponse = await axios.get(HEALTH_URL, { timeout: 10000 });
    console.log(`✅ Health check passed (${healthResponse.status})`);

    const health = healthResponse.data;
    console.log(`🏥 Service: ${health.service}`);
    console.log(`📊 Status: ${health.status}`);
    console.log(`🕐 Uptime: ${Math.floor(health.uptime || 0)} seconds`);

    if (health.cache) {
      console.log(`💾 Cache age: ${Math.floor((health.cache.age || 0) / 1000)} seconds`);
      console.log(`✅ Cache valid: ${health.cache.valid ? 'Yes' : 'No'}`);
    }

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

async function validateSitemap() {
  console.log('🔍 Validating Sitemap XML Structure...\n');

  try {
    const response = await axios.get(SITEMAP_URL, {
      timeout: 30000,
      headers: { 'User-Agent': 'Sitemap-Validator/1.0' }
    });

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });

    const sitemapData = parser.parse(response.data);

    if (!sitemapData.urlset) {
      throw new Error('Invalid sitemap: missing urlset element');
    }

    const urls = sitemapData.urlset.url;
    const urlArray = Array.isArray(urls) ? urls : [urls];

    console.log(`✅ Valid XML structure`);
    console.log(`🔢 Found ${urlArray.length} URLs`);

    // Validate each URL
    let validUrls = 0;
    let invalidUrls = 0;

    for (const url of urlArray) {
      if (url.loc && url.loc.startsWith('http')) {
        validUrls++;
      } else {
        invalidUrls++;
        console.warn(`⚠️  Invalid URL: ${url.loc}`);
      }
    }

    console.log(`✅ Valid URLs: ${validUrls}`);
    if (invalidUrls > 0) {
      console.log(`❌ Invalid URLs: ${invalidUrls}`);
    }

    console.log('\n🎉 Validation completed!');

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

async function monitorMode() {
  console.log('📊 Starting monitoring mode... (Press Ctrl+C to stop)\n');

  const interval = setInterval(async () => {
    try {
      const response = await axios.get(HEALTH_URL, { timeout: 5000 });
      const timestamp = new Date().toLocaleTimeString();

      if (response.status === 200) {
        console.log(`[${timestamp}] ✅ Service healthy`);
      } else {
        console.log(`[${timestamp}] ⚠️  Service responded with status ${response.status}`);
      }
    } catch (error) {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] ❌ Service unhealthy: ${error.message}`);
    }
  }, 30000); // Check every 30 seconds

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping monitoring...');
    clearInterval(interval);
    process.exit(0);
  });
}

async function main() {
  const command = process.argv[2] || 'test';

  switch (command) {
    case 'test':
      await testSitemap();
      break;
    case 'health':
      // Just run health check part of test
      await testSitemap();
      break;
    case 'validate':
      await validateSitemap();
      break;
    case 'monitor':
      await monitorMode();
      break;
    default:
      console.log('Usage: node sitemap-monitor.js [command]');
      console.log('Commands: test, health, validate, monitor');
      process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});