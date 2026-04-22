import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { execSync } from 'node:child_process';

function getBuildId() {
  const timestamp = new Date().toISOString();

  try {
    const gitHash = execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();

    return `${gitHash}-${timestamp}`;
  } catch {
    return `local-${timestamp}`;
  }
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_BUILD_ID__: JSON.stringify(getBuildId()),
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './node_modules'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      "/baileys": {
        target: "http://127.0.0.1:3010",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/baileys/, ""),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('react-dom') || id.includes('react-router') || id.includes('react-helmet-async')) {
            return 'react-core';
          }

          if (id.includes('react-multi-carousel')) {
            return 'carousel-widgets';
          }

          if (id.includes('swiper')) {
            return 'swiper-widgets';
          }

          if (id.includes('sweetalert2')) {
            return 'dialogs';
          }

          if (id.includes('qrcode')) {
            return 'qrcode-tools';
          }

          if (id.includes('@sportsgram/brackets')) {
            return 'brackets';
          }

          if (id.includes('pusher-js') || id.includes('laravel-echo')) {
            return 'realtime';
          }

          if (id.includes('disqus-react')) {
            return 'comments';
          }

          return 'vendor';
        },
      },
    },
  },
})
