# Fix Sitemap - Setup Environment Variables di Vercel

## ⚠️ Masalah

Sitemap hanya menampilkan homepage saja - artinya API tidak ter-fetch.

## ✅ Solusi: Setup Environment Variables di Vercel

### 1. Login ke Vercel Dashboard

```text
https://vercel.com/dashboard
```

### 2. Buka Project `tarkam`

- Klik Projects → tarkam

### 3. Pergi ke Settings → Environment Variables

- Klik **Settings** tab
- Pilih **Environment Variables**

### 4. Tambah Environment Variables

**Tambah 2 variables:**

|         Key        |                           Value                           |
|--------------------|-----------------------------------------------------------|
|   `API_BASE_URL`   | `https://tarkam-api-web-production.up.railway.app/api/v1` |
|   `DEBUG_SITEMAP`  | `false`                                                   |

### 5. Save dan Redeploy

- Klik **Save**
- Go to **Deployments** tab
- Klik **Redeploy** pada deployment terakhir (atau push ulang ke git)

### 6. Test Sitemap

```bash
curl https://tarkam.fun/sitemap.xml
```

Sekarang seharusnya banyak URL!

---

## 📋 Cek di Vercel Dashboard

1. **Environment Variables:**
   - Settings → Environment Variables
   - Pastikan `API_BASE_URL` sudah ada

2. **Function Logs:**
   - Deployments → Klik deployment terakhir
   - Lihat **Function Logs** untuk error details

---

## 🔍 Debug Jika Masih Error

**Check Vercel Function Logs:**

```text
Deployments → Latest deployment → Function Logs
```

**Cari error seperti:**

- `ECONNREFUSED` - API tidak accessible
- `TIMEOUT` - API lambat/down
- `Invalid URL` - API_BASE_URL salah format

---

**Ready?** Setup environment variables di Vercel sekarang!
