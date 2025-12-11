// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-01-01',
  devtools: { enabled: true },
  
  devServer: {
    port: 3001,
    host: 'localhost'
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],
  
  css: [
    '~/assets/css/design-tokens.css',
    '~/assets/css/transitions.css',
    '~/assets/css/main.css',
    '~/assets/css/accessibility.css'
  ],
  
  // Performance optimizations
  experimental: {
    payloadExtraction: false, // Disable payload extraction for better performance
  },
  
  // Build optimizations
  build: {
    analyze: false,
  },
  
  // Vite optimizations
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router'],
            'ui': ['lucide-vue-next'],
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'lucide-vue-next']
    }
  },
  
  app: {
    head: {
      title: 'Zeii - Assistant Vocal Intelligent',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Organise ta journée en parlant. Zeii transforme ta voix en planning intelligent.' },
        { name: 'theme-color', content: '#6C3EF1' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Zeii' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' },
        { rel: 'apple-touch-startup-image', href: '/icons/icon-512x512.png' }
      ]
    },
    pageTransition: { 
      name: 'page', 
      mode: 'default',
      enterActiveClass: 'page-enter-active',
      leaveActiveClass: 'page-leave-active',
      enterFromClass: 'page-enter-from',
      leaveToClass: 'page-leave-to'
    }
  },
  
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api'
    }
  },
  
  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'fr',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false
    },
    vueI18n: './i18n.config.ts'
  },
  
  ssr: false // SPA mode for mobile app-like experience
})

