import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],

  css: ['vuetify/styles'],

  build: {
    transpile: ['vuetify']
  },

  vite: {
    plugins: [vuetify()]
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,

    public: {
      appName: 'Finanzas CRUD',
      MVP_USER_ID: process.env.NUXT_PUBLIC_MVP_USER_ID
    }
  },

  compatibilityDate: '2025-01-01',

  pwa: {
    registerType: 'autoUpdate',
    strategies: 'generateSW',

    devOptions: {
      enabled: true
    },

    manifest: {
      name: 'Finanzas',
      short_name: 'Finanzas',
      description: 'App financiera PWA',
      theme_color: '#0b1220',
      background_color: '#0b1220',
      display: 'standalone',
      scope: '/',
      start_url: '/',

      icons: [
        {
          src: '/logo.png',
          sizes: '64x64',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/logo.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/logo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        }
      ]
    },

    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json}'],

      runtimeCaching: [
        {
          urlPattern: /^https:\/\/(.*)\/api\//,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pwa-api',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60
            }
          }
        },
        {
          urlPattern: ({ request }: any) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'pwa-images',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 24 * 30
            }
          }
        }
      ]
    }
  }
})