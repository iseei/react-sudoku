import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.PUBLIC_URL || '/',
  server: {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || 'localhost',
  },
  build: {
    outDir: 'build',
    sourcemap: process.env.GENERATE_SOURCEMAP !== 'false',
    manifest: 'asset-manifest.json',
  },
  plugins: [
    VitePWA({
      filename: 'service-worker.js',
      injectRegister: false,
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{html,js,css,ico}', 'manifest.json'],
        navigateFallbackDenylist: [/^\/__/],
      },
    }),
  ],
  test: { environment: 'happy-dom' },
});
