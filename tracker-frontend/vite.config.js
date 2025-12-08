// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // keeps SW updated
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'FAANG Progress Tracker',
        short_name: 'FAANG Tracker',
        description: 'Daily FAANG prep tracker — coding, system design, behavioral, micro projects',
        theme_color: '#0b74de',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // adjust caching strategies as needed
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document' || request.destination === '',
            handler: 'NetworkFirst',
            options: { cacheName: 'pages-cache' }
          },
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'static-resources' }
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts' }
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist'
  }
  // ensure the base is correct if deploying to subfolder; normally '/'
})
