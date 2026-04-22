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
  },
})
