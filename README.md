# Tarkam Frontend + Baileys Bridge

Project `tarkam` tetap berfungsi sebagai frontend React/Vite, dan sekarang juga menyediakan bridge WhatsApp berbasis Baileys untuk dipakai oleh `tarkam-bot`.

## Baileys Bridge

Bridge ini menjalankan koneksi WhatsApp Web dengan Baileys lalu mengekspos endpoint HTTP yang kompatibel dengan kebutuhan `tarkam-bot`, seperti:

- `POST /api/whatsapp/send-message`
- `PUT /api/whatsapp/messages/:messageId`
- `DELETE /api/whatsapp/messages/:messageId`
- `GET /api/whatsapp/contacts/:phone`
- `GET /api/whatsapp/contacts/:phone/picture`
- `POST /api/whatsapp/groups/:groupId/leave`
- `GET /api/whatsapp/session`

Script untuk menjalankannya:

```bash
npm run whatsapp:baileys
```

Environment yang umum dipakai:

- `BAILEYS_PORT=3010`
- `BAILEYS_HOST=0.0.0.0`
- `BAILEYS_API_TOKEN=`
- `TARKAM_BOT_WEBHOOK_URL=http://127.0.0.1:5000/webhook`
- `TARKAM_BOT_WEBHOOK_SECRET=`

Direktori sesi dan metadata lokal akan disimpan di:

- `.baileys-auth/`
- `.baileys-state/`

Saat dipakai bersama `tarkam-bot`, set environment berikut di bot:

```env
WHATSAPP_PROVIDER=baileys
BAILEYS_BASE_API_URL=http://127.0.0.1:3010/api/whatsapp/
BAILEYS_API_TOKEN=
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Sitemap Generator

This project includes an automatic sitemap generator using Express and the sitemap package.

### Features

- **Dynamic Sitemap Generation**: Automatically generates sitemap.xml based on your API data
- **API Integration**: Fetches blog posts, categories, and other content from your Laravel API
- **SEO Optimized**: Includes proper priority, changefreq, and lastmod values
- **Gzip Compression**: Serves compressed sitemaps for better performance

### Usage

#### Development

```bash
npm run sitemap:dev
```

This starts the sitemap server on port 3001 with localhost URLs.

#### Production

```bash
npm run sitemap
```

This starts the sitemap server with production URLs (set BASE_URL environment variable).

#### Environment Variables

- `BASE_URL`: Your website's base URL (default: <http://localhost:5173>)
- `PORT`: Server port (default: 3001)

### Endpoints

- `GET /sitemap.xml` - Compressed sitemap
- `GET /sitemap-plain.xml` - Uncompressed sitemap for debugging
- `GET /health` - Health check endpoint

### Integration

The sitemap includes:

- Homepage (/)
- Individual blog posts (/blog/{id})
- Categories (/category/{id})
- Static pages (/about, /contact, /gallery, /platforms)

### API Dependencies

The sitemap generator expects your Laravel API to provide:

- `/api/v1/blogs` - Blog posts data
- `/api/v1/categories` - Categories data
- `/api/v1/web-setting` - Website settings

Make sure your API server is running when generating the sitemap.
