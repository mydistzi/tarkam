# Tarkam Frontend + Bridge Baileys

Proyek `tarkam` tetap berfungsi sebagai frontend React/Vite, dan sekarang juga menyediakan bridge WhatsApp berbasis Baileys untuk dipakai oleh `tarkam-bot`.

## Bridge Baileys

Bridge ini menjalankan koneksi WhatsApp Web dengan Baileys lalu mengekspos endpoint HTTP yang kompatibel dengan kebutuhan `tarkam-bot`, seperti:

- `POST /api/whatsapp/send-message`
- `PUT /api/whatsapp/messages/:messageId`
- `DELETE /api/whatsapp/messages/:messageId`
- `GET /api/whatsapp/contacts/:phone`
- `GET /api/whatsapp/contacts/:phone/picture`
- `POST /api/whatsapp/groups/:groupId/leave`
- `GET /api/whatsapp/session`

Perintah untuk menjalankannya:

```bash
npm run whatsapp:baileys
```

Variabel environment yang umum dipakai:

- `BAILEYS_PORT=3010`
- `BAILEYS_HOST=0.0.0.0`
- `BAILEYS_API_TOKEN=`
- `TARKAM_BOT_WEBHOOK_URL=http://127.0.0.1:5000/webhook`
- `TARKAM_BOT_WEBHOOK_SECRET=`

Direktori sesi dan metadata lokal akan disimpan di:

- `.baileys-auth/`
- `.baileys-state/`

Saat dipakai bersama `tarkam-bot`, atur environment berikut di bot:

```env
WHATSAPP_PROVIDER=baileys
BAILEYS_BASE_API_URL=http://127.0.0.1:3010/api/whatsapp/
BAILEYS_API_TOKEN=
```

## React + TypeScript + Vite

Template ini menyediakan konfigurasi minimal agar React berjalan di Vite dengan HMR dan sejumlah aturan ESLint.

Saat ini tersedia dua plugin resmi:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) menggunakan [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) menggunakan [SWC](https://swc.rs/)

## React Compiler

React Compiler belum diaktifkan pada template ini karena dampaknya terhadap performa pengembangan dan build. Jika ingin menambahkannya, lihat [dokumentasi ini](https://react.dev/learn/react-compiler/installation).

## Memperluas Konfigurasi ESLint

Jika Anda mengembangkan aplikasi produksi, disarankan memperbarui konfigurasi agar mendukung aturan lint yang memahami tipe data:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Konfigurasi lain...

      // Hapus tseslint.configs.recommended lalu ganti dengan ini
      tseslint.configs.recommendedTypeChecked,
      // Alternatifnya, gunakan ini untuk aturan yang lebih ketat
      tseslint.configs.strictTypeChecked,
      // Opsional, tambahkan ini untuk aturan gaya penulisan
      tseslint.configs.stylisticTypeChecked,

      // Konfigurasi lain...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // Opsi lain...
    },
  },
])
```

Anda juga bisa memasang [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) dan [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) untuk aturan lint yang lebih spesifik ke React:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Konfigurasi lain...
      // Aktifkan aturan lint untuk React
      reactX.configs['recommended-typescript'],
      // Aktifkan aturan lint untuk React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // Opsi lain...
    },
  },
])
```

## Generator Sitemap

Proyek ini menyertakan generator sitemap otomatis menggunakan Express dan paket `sitemap`.

### Fitur

- **Pembuatan Sitemap Dinamis**: Secara otomatis membuat `sitemap.xml` berdasarkan data dari API
- **Integrasi API**: Mengambil data blog, kategori, dan konten lain dari Laravel API
- **Dioptimalkan untuk SEO**: Menyertakan nilai `priority`, `changefreq`, dan `lastmod` yang sesuai
- **Kompresi Gzip**: Menyajikan sitemap terkompresi untuk performa yang lebih baik

### Cara Penggunaan

#### Pengembangan

```bash
npm run sitemap:dev
```

Perintah ini menjalankan server sitemap di port 3001 dengan URL localhost.

#### Produksi

```bash
npm run sitemap
```

Perintah ini menjalankan server sitemap dengan URL produksi, menggunakan variabel environment `BASE_URL`.

#### Variabel Environment

- `BASE_URL`: URL dasar website Anda. Nilai bawaan: <http://localhost:5173>
- `PORT`: Port server. Nilai bawaan: `3001`

### Endpoint

- `GET /sitemap.xml` - Sitemap terkompresi
- `GET /sitemap-plain.xml` - Sitemap tanpa kompresi untuk debugging
- `GET /health` - Endpoint pemeriksaan kesehatan layanan

### Integrasi

Sitemap ini mencakup:

- Halaman utama (`/`)
- Halaman detail blog (`/blog/{id}`)
- Halaman kategori (`/category/{id}`)
- Halaman statis (`/about`, `/contact`, `/gallery`, `/platforms`)

### Dependensi API

Generator sitemap mengharapkan Laravel API Anda menyediakan:

- `/api/v1/blogs` - Data artikel blog
- `/api/v1/categories` - Data kategori
- `/api/v1/web-setting` - Data pengaturan website

Pastikan server API Anda sedang berjalan saat proses pembuatan sitemap dilakukan.
