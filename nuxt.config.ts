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
      appName: 'FinanzaN&Y',
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
      name: 'FinanzaN&Y',
      short_name: 'FinanzaN&Y',
      description: 'Finanzas compartidas para dos',
       theme_color: '#101a33',
       background_color: '#0b1220',
      display: 'standalone',
      scope: '/',
      start_url: '/',

      icons: [
        {
           src: '/logo-mark.svg',
          sizes: '64x64',
           type: 'image/svg+xml',
          purpose: 'any'
        },
        {
           src: '/logo-mark.svg',
          sizes: '192x192',
           type: 'image/svg+xml',
          purpose: 'any'
        },
        {
           src: '/logo-mark.svg',
          sizes: '512x512',
           type: 'image/svg+xml',
          purpose: 'any'
        }
      ]
    },

    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json}'],

      runtimeCaching: [
        {
          // Los datos financieros son privados y no deben quedar en caché offline.
          urlPattern: /\/api\//,
          handler: 'NetworkOnly',
          options: {
            cacheName: 'pwa-private-api'
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
