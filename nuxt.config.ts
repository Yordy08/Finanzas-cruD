import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],

  // Vuetify integration
  vite: {
    plugins: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (require('vite-plugin-vuetify') as any)({
        autoImport: true
      })
    ]
  },

  build: {
    transpile: ['vuetify']
  },

  runtimeConfig: {
    databaseUrl:
      process.env.DATABASE_URL ||
      process.env.DOTENV_DATABASE_URL ||
      (process.env.NUXT_PUBLIC_DATABASE_URL as any) ||
      undefined,


    public: {
      appName: 'Finanzas CRUD',
      version: (() => {
        try {
          const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'))
          return pkg?.version || '0.0.0'
        } catch {
          return '0.0.0'
        }
      })(),

      MVP_USER_ID:
        process.env.NUXT_PUBLIC_MVP_USER_ID ||
        process.env.MVP_USER_ID ||
        '6a1b3bfed5ae05d6649ac2fc'
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
          src: '/public/logo.png',
          sizes: '64x64',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/public/logo.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/public/logo.png',
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

