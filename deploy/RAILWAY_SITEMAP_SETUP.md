# Tarkam Sitemap Service - Railway Environment Variables

## Required Environment Variables

```env
# Base URL untuk sitemap (domain utama website)
BASE_URL=https://tarkam.fun

# API Base URL (Railway internal URL untuk performa lebih baik)
API_BASE_URL=https://tarkam-api-web.railway.internal/api/v1

# Port untuk service (Railway akan set otomatis, tapi bisa override)
PORT=3001

# Node Environment
NODE_ENV=production
```

## Optional Environment Variables

```env
# Cache time untuk sitemap (dalam milidetik, default 10 menit)
SITEMAP_CACHE_TIME=600000

# Timeout untuk API calls (dalam milidetik, default 30 detik)
API_TIMEOUT=30000

# Enable debug logging
DEBUG_SITEMAP=false
```

## Railway Service Configuration

### Service Name

```text
tarkam-sitemap
```

### Root Directory

```text
tarkam
```

### Build Command

```bash
# Railway akan menggunakan Dockerfile
# Pastikan Dockerfile.sitemap ada di root directory tarkam
```

### Start Command

```bash
# Railway akan menggunakan CMD dari Dockerfile
```

### Health Check

Railway akan otomatis detect health check dari Dockerfile HEALTHCHECK directive.

### Domains

- **Public Domain**: `tarkam-sitemap-production.up.railway.app`
- **Private Domain**: `tarkam-sitemap.railway.internal`

## Monitoring & Alerts

Setup Railway alerts untuk:

- Service down
- High memory usage
- Failed health checks

## Scaling

- **Min Instances**: 1
- **Max Instances**: 1 (sitemap tidak perlu scale horizontal)
- **Sleep**: Enable sleep untuk menghemat biaya saat tidak ada traffic
  