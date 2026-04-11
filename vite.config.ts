import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
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
  },
})
