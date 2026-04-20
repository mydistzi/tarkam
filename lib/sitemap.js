import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://tarkam-api-web-production.up.railway.app/api';
const DEFAULT_SITE_URL = 'https://tarkam.fun';

const cache = {
    data: null,
    timestamp: null,
    ttl: parseInt(process.env.SITEMAP_CACHE_TIME) || 300000, // 5 minutes

    isValid() {
        return this.data !== null && this.timestamp !== null && (Date.now() - this.timestamp) < this.ttl;
    },

    set(data) {
        this.data = data;
        this.timestamp = Date.now();
    },

    get() {
        return this.data;
    },
};

async function fetchApiData(endpoint, retries = 1) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;
    const url = `${apiBaseUrl}${endpoint}`;
    const timeout = parseInt(process.env.API_TIMEOUT) || 15000; // 15 seconds

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url, { timeout });
            return response.data;
        } catch (error) {
            console.error(`[sitemap] Error fetching ${endpoint} (attempt ${attempt + 1}/${retries + 1}):`, {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                url,
            });

            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }
    }

    return { data: [] };
}

export async function generateSitemapXml() {
    if (cache.isValid()) {
        console.log('[sitemap] Returning cached sitemap');
        return cache.get();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

    const staticPages = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/tarkam-schedule', changefreq: 'weekly', priority: 0.8 },
        { url: '/jadwal-pertandingan', changefreq: 'weekly', priority: 0.8 },
        { url: '/klub', changefreq: 'weekly', priority: 0.7 },
        { url: '/news', changefreq: 'weekly', priority: 0.8 },
        { url: '/shop', changefreq: 'weekly', priority: 0.8 },
        { url: '/sponsors', changefreq: 'weekly', priority: 0.7 },
        { url: '/sponsor-leaderboard', changefreq: 'weekly', priority: 0.6 },
        { url: '/global-leaderboard', changefreq: 'weekly', priority: 0.6 },
        { url: '/club-leaderboard', changefreq: 'weekly', priority: 0.6 },
        { url: '/male-leaderboard', changefreq: 'weekly', priority: 0.6 },
        { url: '/female-leaderboard', changefreq: 'weekly', priority: 0.6 },
        { url: '/pusat-bantuan', changefreq: 'weekly', priority: 0.6 },
        { url: '/kebijakan-privasi', changefreq: 'monthly', priority: 0.5 },
        { url: '/comment-policy', changefreq: 'monthly', priority: 0.5 },
        { url: '/syarat-dan-ketentuan', changefreq: 'monthly', priority: 0.5 },
        { url: '/ketentuan-penggunaan', changefreq: 'monthly', priority: 0.5 },
        { url: '/ketentuan-penghapusan-data', changefreq: 'monthly', priority: 0.5 },
        { url: '/hubungi-kami', changefreq: 'weekly', priority: 0.7 },
        { url: '/cart', changefreq: 'weekly', priority: 0.7 },
        { url: '/checkout', changefreq: 'weekly', priority: 0.7 },
    ];

    console.log('[sitemap] Fetching dynamic content from API...');

    let dynamicUrls = [];

    try {
        const [blogsRes, productsRes, playersRes, teamsRes, contestsRes] = await Promise.all([
            fetchApiData('/blogs'),
            fetchApiData('/products'),
            fetchApiData('/players'),
            fetchApiData('/teams'),
            fetchApiData('/contests'),
        ]);

        const blogs = blogsRes?.data ?? [];
        const products = productsRes?.data ?? [];
        const players = playersRes?.data ?? [];
        const teams = teamsRes?.data ?? [];
        const contests = contestsRes?.data ?? [];

        console.log(`[sitemap] Fetched: ${blogs.length} blogs, ${products.length} products, ${players.length} players`);

        // Build dynamic URLs
        blogs.forEach((blog) => {
            if (blog.slug) {
                dynamicUrls.push({
                    url: `/detail-news/${blog.slug}`,
                    lastmod: blog.updated_at || blog.created_at,
                    changefreq: 'weekly',
                    priority: 0.8,
                });
            }
        });

        products.forEach((product) => {
            if (product.slug) {
                dynamicUrls.push({
                    url: `/detail-shop/${product.slug}`,
                    lastmod: product.updated_at || product.created_at,
                    changefreq: 'weekly',
                    priority: 0.7,
                });
            }
        });

        players.forEach((player) => {
            if (player.slug) {
                dynamicUrls.push({
                    url: `/detail-player/${player.slug}`,
                    lastmod: player.updated_at || player.created_at,
                    changefreq: 'weekly',
                    priority: 0.6,
                });
            }
        });

        teams.forEach((team) => {
            if (team.id) {
                dynamicUrls.push({
                    url: `/detail-tim/${team.id}`,
                    lastmod: team.updated_at || team.created_at,
                    changefreq: 'weekly',
                    priority: 0.6,
                });
            }
        });

        contests.forEach((contest) => {
            if (contest.id) {
                dynamicUrls.push({
                    url: `/detail-pertandingan/${contest.id}`,
                    lastmod: contest.updated_at || contest.created_at,
                    changefreq: 'daily',
                    priority: 0.7,
                });
            }
        });
    } catch (error) {
        console.error('[sitemap] Error fetching dynamic content:', error.message);
    }

    // Build XML
    const escapeXml = (str) => {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };

    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach((page) => {
        xmlContent += '  <url>\n';
        xmlContent += `    <loc>${escapeXml(siteUrl + page.url)}</loc>\n`;
        xmlContent += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xmlContent += `    <priority>${page.priority}</priority>\n`;
        xmlContent += '  </url>\n';
    });

    // Add dynamic pages
    dynamicUrls.forEach((item) => {
        xmlContent += '  <url>\n';
        xmlContent += `    <loc>${escapeXml(siteUrl + item.url)}</loc>\n`;
        if (item.lastmod) {
            xmlContent += `    <lastmod>${item.lastmod}</lastmod>\n`;
        }
        xmlContent += `    <changefreq>${item.changefreq}</changefreq>\n`;
        xmlContent += `    <priority>${item.priority}</priority>\n`;
        xmlContent += '  </url>\n';
    });

    xmlContent += '</urlset>';

    cache.set(xmlContent);
    console.log(`[sitemap] Generated sitemap with ${staticPages.length + dynamicUrls.length} URLs`);

    return xmlContent;
}

export function clearSitemapCache() {
    cache.data = null;
    cache.timestamp = null;
}