# Panduan Lengkap Sitemap.xml untuk Google Indexing

## 🎯 Tujuan

Memastikan sitemap.xml selalu aktif di Railway dan terindex dengan baik oleh Google Search Console.

## 📋 Langkah-langkah Setup

### 1. Deploy Sitemap Service ke Railway

#### Buat Service Baru di Railway

```bash
Service Name: tarkam-sitemap
Root Directory: tarkam
Dockerfile: Dockerfile.sitemap
```

#### Environment Variables

```env
BASE_URL=https://tarkam.fun
API_BASE_URL=https://tarkam-api-web.railway.internal/api/v1
NODE_ENV=production
PORT=3001
SITEMAP_CACHE_TIME=600000
API_TIMEOUT=30000
DEBUG_SITEMAP=false
```

#### Health Check & Monitoring

- Railway akan otomatis detect health check dari Dockerfile
- Setup alerts untuk service down dan high memory usage
- Enable sleep mode untuk menghemat biaya

### 2. Update Nginx Configuration

Pastikan nginx configuration di `deploy/nginx/tarkam.fun.sitemap.locations.conf` mengarah ke service yang benar:

```nginx
location = /sitemap.xml {
    proxy_pass https://tarkam-sitemap-production.up.railway.app/sitemap.xml;
    # ... existing config
}
```

### 3. Setup Google Search Console

#### Verifikasi Domain

1. Buka [Google Search Console](https://search.google.com/search-console)
2. Klik "Add Property"
3. Pilih "URL prefix" dan masukkan: `https://tarkam.fun`
4. Verifikasi ownership dengan HTML file atau DNS record

#### Submit Sitemap

1. Di Google Search Console, pergi ke "Sitemaps"
2. Klik "Add a new sitemap"
3. Masukkan: `sitemap.xml`
4. Klik "Submit"

### 4. Robots.txt Configuration

Sitemap service sudah include robots.txt endpoint. Pastikan robots.txt mengarah ke sitemap:

```txt
User-agent: *
Allow: /

Sitemap: https://tarkam.fun/sitemap.xml
```

### 5. Monitoring & Maintenance

#### Health Check Endpoints

- **Health Check**: `https://tarkam-sitemap-production.up.railway.app/health`
- **Sitemap**: `https://tarkam.fun/sitemap.xml`
- **Robots.txt**: `https://tarkam.fun/robots.txt`

#### Cache Management

- Sitemap di-cache selama 10 menit (600000ms)
- Cache otomatis refresh saat expired
- Fallback ke cache lama jika API error

#### Error Handling

- Service tetap aktif meski API down (menggunakan cache)
- Fallback ke minimal sitemap jika semua gagal
- Comprehensive logging untuk debugging

### 6. Testing & Validation

#### Test Commands

```bash
# Test sitemap generation
curl https://tarkam.fun/sitemap.xml

# Test health check
curl https://tarkam-sitemap-production.up.railway.app/health

# Test robots.txt
curl https://tarkam.fun/robots.txt

# Validate sitemap XML
curl https://tarkam.fun/sitemap.xml | xmllint --format -
```

#### Google Search Console Monitoring

- Check "Coverage" report untuk melihat indexing status
- Monitor "Sitemaps" untuk submission status
- Setup email alerts untuk critical issues

### 7. Optimisasi SEO

#### Sitemap Best Practices

- ✅ Update frequency sesuai content type (daily/weekly)
- ✅ Priority setting yang masuk akal
- ✅ Lastmod timestamps akurat
- ✅ HTTPS URLs only
- ✅ Valid XML format

#### Content Types & Priorities

- **Homepage**: priority 1.0, daily
- **Blog posts**: priority 0.8, weekly
- **Products**: priority 0.6, weekly
- **Matches**: priority 0.6, daily
- **Players/Teams**: priority 0.5, weekly

### 8. Troubleshooting

#### Common Issues

1. **Sitemap not updating**: Check cache TTL and API connectivity
2. **Google not indexing**: Verify sitemap submission and robots.txt
3. **Service down**: Check Railway logs and health checks
4. **API errors**: Monitor API endpoints and error logs

#### Debug Mode

Enable debug logging dengan environment variable:

```env
DEBUG_SITEMAP=true
```

#### Emergency Fallback

Jika service completely down, sitemap akan fallback ke minimal version dengan homepage only.

## 🚀 Deployment Checklist

- [ ] Railway service `tarkam-sitemap` created
- [ ] Environment variables configured
- [ ] Dockerfile.sitemap committed
- [ ] Nginx config updated
- [ ] Google Search Console verified
- [ ] Sitemap submitted to GSC
- [ ] Health checks passing
- [ ] Monitoring alerts setup
- [ ] Cache settings optimized

## 📊 Monitoring Dashboard

Setup monitoring untuk:

- Service uptime
- Response times
- Cache hit rates
- API error rates
- Google indexing coverage

## 🔄 Update Process

1. Update code di repository
2. Test locally dengan `npm run sitemap`
3. Deploy ke Railway (auto-deploy jika enabled)
4. Monitor health checks
5. Verify sitemap updates
6. Check Google Search Console

---

**Note**: Sitemap akan selalu aktif selama Railway service running. Dengan caching dan error handling yang baik, service akan tetap berfungsi meski ada masalah dengan API backend.
